"use client";
import { useCountry } from "../../context/WorldMapContext";

export default function Footer() {
    const { selectedCountry } = useCountry();
    return (
        <footer className="w-full bg-gray-900 text-white py-4 text-center mt-auto">
            Selected World: {selectedCountry || "None selected"}
        </footer>
    );
}
