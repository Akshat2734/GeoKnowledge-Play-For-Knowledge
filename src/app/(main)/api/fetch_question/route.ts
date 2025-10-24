import { NextResponse } from "next/server";
import OpenAI from "openai";

// Small fetch helper with timeout
async function fetchWithTimeout(url: string, opts: RequestInit = {}, ms = 8000) {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), ms);
    try {
        const res = await fetch(url, { ...opts, signal: ctrl.signal });
        return res;
    } finally {
        clearTimeout(id);
    }
}

// Look up a real image URL from Wikimedia Commons using a search phrase
async function findWikimediaImage(query: string): Promise<{
    url: string | null;
    title?: string;
    attribution?: string;
    }> {
    if (!query) return { url: null };

    // Search within the File namespace (6) and get direct, large image URLs + some metadata
    const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&generator=search&gsrsearch=${encodeURIComponent(
        query
    )}&gsrlimit=12&gsrnamespace=6&iiprop=url|mime|extmetadata&iiurlwidth=1200`;

    try {
        const res = await fetchWithTimeout(api);
        if (!res.ok) return { url: null };

        const data = await res.json();
        const pages = data?.query?.pages;
        if (!pages) return { url: null };

        // Pick the first valid image (mime starts with image/)
        const candidates: any[] = Object.values(pages);
        for (const p of candidates) {
        const info = p?.imageinfo?.[0];
        const mime: string | undefined = info?.mime;
        const url: string | undefined = info?.thumburl || info?.url;
        if (mime?.startsWith("image/") && url) {
            // Optional simple attribution from extmetadata
            const meta = info?.extmetadata || {};
            const credit = meta.Credit?.value || "";
            const artist = meta.Artist?.value || "";
            const license = meta.LicenseShortName?.value || "";
            const attribution = [artist, credit, license].filter(Boolean).join(" • ");
            return { url, title: p.title, attribution };
        }
        }
        return { url: null };
    } catch {
        return { url: null };
    }
    }

    const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    });

    export async function POST(request: Request) {
    try {
        const { difficulty = 50, selectedTimeline, selectedCountry, selected } = await request.json();
        const level = Math.max(1, Math.min(100, difficulty));

        // Ask model for the question + a media_query (NOT a URL)
        const prompt = `
    You are a strict, factual history quiz generator.

    ### Context
    - Country: ${selectedCountry}
    - Timeline: ${selectedTimeline} (negative = BCE, positive = CE)
    - Focus ONLY on ${selectedCountry}. Do NOT mention unrelated civilizations unless there was direct influence/contact.
    - If prehistoric (e.g., < 3000 BCE), focus on archaeology, rock art, climate, or early human activity in that region.

    ### Task
    Generate exactly ONE multiple-choice question related to ${selectedCountry} and roughly the year ${selectedTimeline}.
    If "${selected}" is "general", make it about ${selectedCountry}'s general history; otherwise focus on that timeline.

    ### Very important about images
    - DO NOT provide any image URLs.
    - Instead, provide a short, specific search phrase we can use to find a relevant image (e.g., "Tassili n'Ajjer rock art Algeria", "Numidian cavalry relief", "Ottoman Algiers city walls").
    - The image should supplement the question topic (map, artifact, site, artwork, etc.) and be relevant to ${selectedCountry} and the time/context.

    ### Output (STRICT JSON ONLY)
    {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correct": "string",
    "difficulty": ${level},
    "media_query": "string | null",    // e.g. "Tassili n'Ajjer rock art Algeria"
    "media_description": "string | null"
    }

    ### Rules
    - "correct" must match one of the options.
    - JSON only. No markdown, no extra text.
    `;

        const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        });

        let jsonText = response.choices[0]?.message?.content || "{}";
        jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

        let obj: any;
        try {
        obj = JSON.parse(jsonText);
        } catch {
        return NextResponse.json(
            { error: "Invalid JSON from model", raw: jsonText },
            { status: 502 }
        );
        }

        // Try to fetch a real image using media_query (augmented with country to improve relevance)
        let mediaUrl: string | null = null;
        if (obj?.media_query) {
        const q = `${obj.media_query} ${selectedCountry}`.trim();
        const found = await findWikimediaImage(q);
        mediaUrl = found.url;
        // Optionally attach attribution if you want to show it on UI
        if (found.title || found.attribution) {
            obj.media_attribution = {
            source: "Wikimedia Commons",
            title: found.title || null,
            credit: found.attribution || null,
            };
        }
        }

        // Final shape returned to the frontend
        const payload = {
        question: obj.question,
        options: obj.options,
        correct: obj.correct,
        difficulty: obj.difficulty ?? level,
        media: mediaUrl, // verified URL or null
        media_description: obj.media_description ?? null,
        };

        return NextResponse.json(payload);
    } catch (error: any) {
        return NextResponse.json(
        { error: error.message || "Failed to generate question" },
        { status: 500 }
        );
    }
}
