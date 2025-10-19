"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function Footer() {
    const [selectedTimeline] = useLocalStorage<any>("Timeline", null);
    const [isReady, setIsReady] = useState(false);

    // Wait until client hydration completes
    useEffect(() => {
        setIsReady(true);
    }, []);

    if (!isReady) {
        // Prevent rendering before localStorage is available
        return null;
    }

    if (!selectedTimeline) {
        return (
        <div className="w-full flex bg-gray-900 text-white py-2 text-center mt-auto justify-around items-center">
            Selected World: None selected
            <button className="btn" disabled>
                Continue
            </button>
        </div>
        );
    }

    return (
        <footer className="w-full flex bg-gray-900 text-white py-2 text-center mt-auto justify-around items-center">
            Selected Timeline: {selectedTimeline}
            <Link href="/questions">
                <button className="btn">Continue</button>
            </Link>
        </footer>
    );
}
