import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
    try {
        const { difficulty = 50 } = await request.json();

        // Clamp difficulty between 1–100
        const level = Math.max(1, Math.min(100, difficulty));

        const prompt = `
                You are a quiz generator. Generate exactly one multiple-choice question as a JSON object. 
                The question must be suitable for difficulty level ${level} (1 is easiest, 100 is expert-level). 
                Return only valid JSON, with no markdown formatting or code fences.

                Format:
                    {
                        "question": "string",
                        "options": ["string", "string", "string", "string"],
                        "correct": "string",
                        "difficulty": number
                    }

                Guidelines:
                    - Make sure "correct" matches one of the options.
                    - The topic can vary (general knowledge, logic, math, science, etc.).
                    - Keep the JSON structure strict and valid.
                `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8
        });

        let jsonText = response.choices[0]?.message?.content || "{}";

        // Clean potential markdown code fences if any
        jsonText = jsonText
            .replace(/^```json\s*/, "")
            .replace(/^```\s*/, "")
            .replace(/```$/, "")
            .trim();

        let questionData;
        try {
            questionData = JSON.parse(jsonText);
        } catch (err) {
            console.error("Invalid JSON from model:", jsonText);
            questionData = { error: "Invalid JSON from model", raw: jsonText };
        }

        return NextResponse.json(questionData);
        } catch (error: any) {
            console.error("Error generating question:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate question" },
            { status: 500 }
        );
    }
}
