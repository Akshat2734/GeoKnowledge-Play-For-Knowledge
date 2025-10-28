"use client";

import React, { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Link from "next/link";
import Portal from "./Portal";

export default function HomeNavBar() {
    const [selectedTimeline] = useLocalStorage("Timeline", null);
    const [selectedCountry] = useLocalStorage("selectedCountry", null);
    const [selected] = useLocalStorage("Menu", null);
    const [isOpen, setIsOpen] = useState(false);

    // Prevent background scroll when popup is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    const Popup = (
    <Portal>
        <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-black/50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 animate-fadeIn">
            <p className="text-gray-600 mb-2 text-xl text-center">
            Selected Country: {selectedCountry}
            </p>
            <p className="text-gray-600 text-xl mb-6 text-center">
            Selected: {selected}
            </p>
            <div className="flex justify-between gap-4">
            <Link
                href="/questions"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full text-center"
            >
                Continue
            </Link>
            <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition w-full"
            >
                Close
            </button>
            </div>
        </div>
        </div>
    </Portal>
    );



    // Title (always centered on mobile; left-aligned on md+)
    const Title = (
        <div className="text-4xl md:text-7xl font-semibold flex gap-1 mx-auto md:mx-0 text-center md:text-left">
        <span className="text-blue-200">Gen</span>
        <span className="text-blue-300">Know</span>
        <span className="text-blue-400">ledge</span>
        </div>
    );

    // Button: fixed at bottom on mobile, inline right on md+
    const ActionButton = (
        <div
        className="
            fixed bottom-6 left-1/2 -translate-x-1/2 w-[80%] z-40
            md:static md:translate-x-0 md:w-auto
            flex justify-center md:justify-end
        "
        >
        <button
            onClick={() => setIsOpen(true)}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition w-full md:w-auto"
        >
            Continue
        </button>
        </div>
    );

    // Choose which top bar text color you want across cases
    const textColor = "text-white";

    return (
        // pb-24 adds space so the fixed mobile button doesn’t overlap content
        <header className={`z-10 w-full ${textColor} px-6 py-6 md:py-10 pb-24 md:pb-0`}>
        {/* Top row becomes a row on md+, stacked on mobile */}
        <div className="max-w-7xl mx-auto md:flex md:items-center md:justify-between gap-6">
            {Title}
            {ActionButton}
        </div>

        {/* Optional: show small context line under on mobile */}
        

        {isOpen && Popup}
        </header>
    );
}
