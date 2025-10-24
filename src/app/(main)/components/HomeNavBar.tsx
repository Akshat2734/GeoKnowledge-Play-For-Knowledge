"use client";

import React, { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Link from "next/link";

function HomeNavBar() {
    const [selectedTimeline] = useLocalStorage("Timeline", null);
    const [selectedCountry] = useLocalStorage("selectedCountry", null);
    const [selected] = useLocalStorage("Menu", null);
    const [isOpen, setIsOpen] = useState(false);

    if (selectedCountry && selected == "General") {
        return (
        <div className="relative p-5 flex items-center text-gray-300 z-10">
            {/* Centered Title */}
            <div className="absolute left-[49.5%] transform -translate-x-1/2 text-4xl font-semibold">
            GenKnowledge
            </div>

            {/* Button at the end */}
            <div className="ml-auto">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
                Continue
            </button>
            </div>

            {/* Popup */}
            {isOpen && (
            <>
                {/* Overlay 
                <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsOpen(false)}
                ></div>
                */}
                {/* Popup Box */}
                <div className="fixed inset-0 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 relative animate-fadeIn">
                    <p className="text-gray-600 mb-2 text-xl text-center">
                        Selected Country : {selectedCountry}
                    </p>
                    <p className="text-gray-600 text-xl mb-6 text-center">
                        Selected : {selected}
                    </p>
                    <div className="flex justify-between gap-8">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full"
                        >
                            <Link href="/questions">Continue</Link>
                        </button>
                        <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full"
                        >
                        Close
                        </button>
                    </div>
                </div>
                </div>
            </>
            )}
        </div>
        );
    } 
    else if(selectedTimeline && selectedCountry) {
        return (
        <div className="relative p-5 flex items-center text-gray-300 z-10">
            {/* Centered Title */}
            <div className="absolute left-[49.5%] transform -translate-x-1/2 text-4xl font-semibold">
            GenKnowledge
            </div>

            {/* Button at the end */}
            <div className="ml-auto">
            <button
                onClick={() => setIsOpen(true)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
                Continue
            </button>
            </div>

            {/* Popup */}
            {isOpen && (
            <>
                {/* Overlay 
                <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsOpen(false)}
                ></div>
                */}
                {/* Popup Box */}
                <div className="fixed inset-0 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 relative animate-fadeIn">
                    <p className="text-gray-600 mb-2 text-xl text-center">
                        Selected Country : {selectedCountry}
                    </p>
                    <p className="text-gray-600 text-xl mb-6 text-center">
                        Selected : {selected}
                    </p>
                    <div className="flex justify-between gap-8">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full"
                        >
                            <Link href="/questions">Continue</Link>
                        </button>
                        <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full"
                        >
                        Close
                        </button>
                    </div>
                </div>
                </div>
            </>
            )}
        </div>
        );
    }
    else {
        return (
        <div className="relative p-5 flex items-center text-gray-300">
            {/* Centered Title */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-semibold">
            GenKnowledge
            </div>

            {/* Button at the end */}
            <div className="ml-auto">
            <button
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                disabled
            >
                Hello world
            </button>
            </div>
        </div>
        );
    }
}

export default HomeNavBar;
