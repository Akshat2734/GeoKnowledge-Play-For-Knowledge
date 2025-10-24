"use client";

import { useEffect, useRef, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
    question: string;
    options: string[];
    correct: string;
    difficulty: number;
    media?: string | null; // optional image or description
}

export default function AdaptiveQuizLive() {
    const [difficulty, setDifficulty] = useState(50);
    const [question, setQuestion] = useState<Question | null>(null);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedTimeline] = useLocalStorage("Timeline", null);
    const [selectedCountry] = useLocalStorage("selectedCountry", null);
    const [selected] = useLocalStorage("Menu", null);

    // ✅ Preloaded GIFs
    const correctGif = "/assets/cat-jump.gif";
    const wrongGif = "/assets/the-voices.gif";
    const [gifSrc, setGifSrc] = useState<string | null>(null);

    // ✅ Cache
    const questionCache = useRef(new Map<number, Question>());

    // ✅ Preload GIFs
    useEffect(() => {
        const preload = (src: string) => {
        const img = new Image();
        img.src = src;
        };
        preload(correctGif);
        preload(wrongGif);
    }, []);

    // ✅ Fetch Question
    async function fetchQuestion(level: number) {
        if (questionCache.current.has(level)) {
        setQuestion(questionCache.current.get(level)!);
        return;
        }

        try {
        setLoading(true);
        const res = await fetch("/api/fetch_question", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            difficulty: level,
            selectedTimeline,
            selectedCountry,
            selected,
            }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!data.question || !Array.isArray(data.options)) {
            throw new Error("Invalid question format from API");
        }

        questionCache.current.set(level, data);
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

    // ✅ Handle Answer
    const handleAnswer = (option: string) => {
        if (!question || loading) return; // prevent clicks during load
        const correct = option === question.correct;
        setFeedback(correct ? "✅ Correct!" : "❌ Wrong!");
        setGifSrc(correct ? correctGif : wrongGif);

        const newDifficulty = Math.max(
        1,
        Math.min(100, difficulty + (correct ? 1 : -1))
        );
        setDifficulty(newDifficulty);

        // Wait before fetching next
        setTimeout(() => {
        setGifSrc(null);
        setFeedback("");
        fetchQuestion(newDifficulty);
        }, 2000);
    };

    return (
        <div className="relative flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-6 overflow-hidden">
        {/* ✨ Header Info (Country + Timeline) */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-center z-10">
            <h1 className="text-3xl font-bold text-blue-400 drop-shadow-md">
            {selectedCountry || "Unknown Country"}
            </h1>
            <p className="text-sm text-gray-400">
            {selectedTimeline || "No timeline selected"}
            </p>
        </div>

        {/* ✨ Loading Popup */}
        <AnimatePresence>
            {loading && (
            <motion.div
                key="loading-popup"
                className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                >
                <div className="loader border-t-4 border-blue-400 rounded-full w-12 h-12 mx-auto mb-4 animate-spin"></div>
                <p className="text-lg font-semibold text-gray-300">
                    Generating Question...
                </p>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>

        {/* ✨ Feedback GIF Overlay */}
        <AnimatePresence>
            {gifSrc && (
            <motion.img
                key={gifSrc}
                src={gifSrc}
                alt="Feedback Animation"
                className="absolute inset-0 m-auto max-h-[300px] rounded-xl shadow-xl z-20"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
            />
            )}
        </AnimatePresence>

        {/* Main Content */}
        <div
            className={`flex flex-1 flex-col md:flex-row items-center justify-center gap-10 transition-opacity duration-300 ${
            gifSrc || loading ? "opacity-20 pointer-events-none" : "opacity-100"
            }`}
        >
            {/* Left Side – Image or Placeholder */}
            <motion.div
            key={question?.media || "default"}
            className="w-full md:w-1/2 flex justify-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            >
            {question?.media ? (
                <img
                src={question.media}
                alt="Question Visual"
                className="rounded-2xl shadow-lg max-h-[350px] object-cover"
                />
            ) : (
                <div className="flex items-center justify-center bg-gray-700/40 rounded-2xl w-full h-[300px] border border-gray-600">
                <p className="text-gray-400 italic">No image provided</p>
                </div>
            )}
            </motion.div>

            {/* Right Side – Question + Options */}
            <motion.div
            key={question?.question}
            className="w-full md:w-1/2 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            >
            <h2 className="text-2xl font-bold text-blue-400 mb-2">
                Question
            </h2>

            {question && (
                <>
                <p className="text-lg mb-4 leading-relaxed">
                    {question.question}
                </p>

                <ul className="space-y-3">
                    {question.options.map((opt, i) => (
                    <motion.li
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="border border-gray-700 rounded-xl p-3 cursor-pointer hover:bg-gray-800 transition-all"
                    >
                        {opt}
                    </motion.li>
                    ))}
                </ul>
                </>
            )}

            <AnimatePresence>
                {feedback && (
                <motion.p
                    key="feedback"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mt-4 text-xl font-semibold ${
                    feedback.includes("✅")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                >
                    {feedback}
                </motion.p>
                )}
            </AnimatePresence>
            </motion.div>
        </div>

        {/* Bottom Center Difficulty Indicator */}
        <div className="text-center mt-6 z-10">
            <p className="text-gray-400 text-sm uppercase tracking-wider">
            Current Difficulty
            </p>
            <motion.div
            key={difficulty}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold text-blue-400 mt-1"
            >
            {difficulty}
            </motion.div>
        </div>
        </div>
    );
}
