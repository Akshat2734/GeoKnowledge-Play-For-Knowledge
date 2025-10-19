"use client";

import { useEffect, useState } from "react";

interface Question {
    question: string;
    options: string[];
    correct: string;
    difficulty: number;
}

export default function AdaptiveQuizLive() {
    const [difficulty, setDifficulty] = useState(50);
    const [question, setQuestion] = useState<Question | null>(null);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

  // Cache questions by difficulty (so re-fetching the same level is instant)
    const questionCache = new Map<number, Question>();

    async function fetchQuestion(level: number) {
        // If we already have a question cached for this difficulty, use it
        if (questionCache.has(level)) {
            setQuestion(questionCache.get(level)!);
        return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/fetch_question", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ difficulty: level }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            // Simple validation check
            if (!data.question || !Array.isArray(data.options)) {
                throw new Error("Invalid question format from API");
            }

        // Cache it for future reuse
            questionCache.set(level, data);
                setQuestion(data);
        } catch (err) {
            console.error("❌ Failed to fetch question:", err);
            setQuestion({
            question: "Could not load question. Please try again.",
            options: [],
            correct: "",
            difficulty: level,
        });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchQuestion(difficulty);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAnswer = (option: string) => {
        if (!question) return;
        const correct = option === question.correct;
        setFeedback(correct ? "✅ Correct!" : "❌ Wrong!");

        const newDifficulty = Math.max(
        1,
        Math.min(100, difficulty + (correct ? 1 : -1))
        );
        setDifficulty(newDifficulty);

        // Wait before fetching next
        setTimeout(() => {
            setFeedback("");
            fetchQuestion(newDifficulty);
        }, 1200);
    };

    if (loading && !question) return <p>Loading...</p>;

    return (
        <div className="p-6">
        <h2 className="text-xl font-bold mb-3">
            Difficulty: {difficulty}
        </h2>

        {loading && <p className="text-sm text-gray-500">Generating question...</p>}

        {question && (
            <>
            <p className="text-lg mb-4">{question.question}</p>
                <ul>
                    {question.options.map((opt, i) => (
                    <li
                        key={i}
                        className="border p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => handleAnswer(opt)}
                    >
                        {opt}
                    </li>
                    ))}
                </ul>
            </>
        )}

        {feedback && (
            <p className="mt-3 text-lg font-semibold">{feedback}</p>
        )}
        </div>
    );
}
