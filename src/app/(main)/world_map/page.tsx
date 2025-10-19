"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./_components/Footer";

export default function Page() {
    const [showAnimation, setShowAnimation] = useState(true);
    // State to ensure we only render the map on the client side.
    // This is the key fix for the "Map container already initialized" error.
    const [isClient, setIsClient] = useState(false);

    // This effect runs once after the component mounts on the client.
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Memoize the dynamically imported map component.
    // This prevents it from being re-imported on every render.
    const SafeMap = useMemo(() => {
        return dynamic(() => import("./_components/WorldMapInner"), {
            ssr: false, // Ensure it never renders on the server
            loading: () => (
                // A simple placeholder while the map component itself loads.
                <div className="h-[600px] w-full flex items-center justify-center rounded-2xl bg-gray-200 animate-pulse">
                    <p className="text-gray-500">Loading Map...</p>
                </div>
            ),
        });
    }, []);

    return (
        <AnimatePresence mode="wait">
            {showAnimation ? (
                // Animation Screen
                <motion.div
                    key="splash-animation"
                    className="relative w-full h-screen overflow-hidden flex justify-center items-center"
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                >
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
                        // This triggers the switch to the map view once the animation is done.
                        onAnimationComplete={() => setShowAnimation(false)}
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
                </motion.div>
            ) : (
                // Main Content with Map
                <motion.div
                    key="main-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col min-h-screen"
                >
                    <main className="flex-grow flex justify-center items-center p-4">
                        {/* We only render the map component if we are on the client */}
                        {isClient && <SafeMap />}
                    </main>
                    <Footer />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
