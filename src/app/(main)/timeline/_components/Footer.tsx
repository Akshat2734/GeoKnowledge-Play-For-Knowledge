"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function Footer() {
    const [selectedTimeline] = useLocalStorage<any>("Timeline", null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    if (!isReady) return null;

    return (
        <footer
        className="
            fixed bottom-0 left-0 w-full
            bg-gray-900 text-white py-3 px-4
            flex justify-between items-center text-sm sm:text-base
            z-50
        "
        >
        <span>
            Selected Timeline:&nbsp;
            {selectedTimeline ? selectedTimeline : <span className="text-gray-400">None selected</span>}
        </span>

        {selectedTimeline ? (
            <Link href="/questions">
            <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Continue
            </button>
            </Link>
        ) : (
            <button
            className="bg-gray-700 px-4 py-2 rounded-lg text-gray-400 cursor-not-allowed"
            disabled
            >
            Continue
            </button>
        )}
        </footer>
    );
}
