"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Footer from "./_components/Footer";
import { CountryProvider } from "../context/WorldMapContext";

// Dynamically import WorldMapInner (for client-side only)
const WorldMapInner = dynamic(() => import("./_components/WorldMapInner"), {
    ssr: false,
});

export default function Page() {
    const [showMap, setShowMap] = useState(false);

  // ⏳ Run animation first, then reveal the map after 1.2s    
    useEffect(() => {
        const timer = setTimeout(() => setShowMap(true), 1200);
        return () => clearTimeout(timer);
    }, []);
  // 🎬 Show animation first
    if (!showMap) {
        return (
        <div className="relative w-full h-screen overflow-hidden flex justify-center items-center">
            <Image
            alt="Deep Space"
            src="/home_page/vecteezy_concept-of-nebula-with-galaxies-in-deep-space-cosmos_29273064.jpg"
            fill
            priority
            className="object-cover"
            />
            <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                    scale: { type: "spring" },
                }}
                className="relative z-10 flex justify-center items-center"
            >
                <Image
                    src="/world_map/earth-ball-planet-isolated.png"
                    alt="World Image"
                    width={600}
                    height={600}
                    className="drop-shadow-2xl"
                    priority
                />
            </motion.div>
        </div>
    );
}
  // 🌍 Show world map after animation
    return (
        <CountryProvider>
                <div className="flex flex-col min-h-screen">
                    <main className="flex-grow flex justify-center items-center">
                        <WorldMapInner />
                    </main>
                <Footer />
            </div>
        </CountryProvider>
);
}
