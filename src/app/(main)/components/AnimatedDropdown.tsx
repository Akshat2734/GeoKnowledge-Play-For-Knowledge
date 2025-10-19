import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useLocalStorage from "../hooks/useLocalStorage";

interface AnimatedDropdownProps {
    options: string[];
    initialValue?: string;
}

const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({
        options,
        initialValue = null,
    }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [selected, setSelected] = useLocalStorage<string | null>("Menu", initialValue);
        const dropdownRef = useRef<HTMLDivElement>(null);

        // Close dropdown on outside click
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
            setIsOpen(false);
            }
            };
            document.addEventListener("mousedown", handleClickOutside);
                return () => {
                    document.removeEventListener("mousedown", handleClickOutside);
                };
            }, []);

        return (
            <div ref={dropdownRef} className="relative inline-block text-left">
            {/* Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-black rounded-lg hover:bg-gray-100"
                >
                    {selected || "Menu ▼"}
                </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute mt-2 w-40 bg-white border rounded-lg shadow-lg z-10"
                    >
                        {options.map((opt) => (
                            <div
                                key={opt}
                                onClick={() => {
                                setSelected(opt);
                                setIsOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                            >
                                {opt}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedDropdown;
