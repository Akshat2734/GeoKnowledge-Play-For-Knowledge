"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WebsiteViewer from "./TimelineFrame";
import { getMediaUrl } from "import/app/utils/getMedialUrl"; // ✅ correct import path
import type { TimelineEvent } from "import/types/timeline";
import AnimatedDropdown from "../../components/AnimatedDropdown";
import useLocalStorage from "../../hooks/useLocalStorage";

interface TimelineData {
  title?: {
    text?: { headline?: string; text?: string };
  };
  events: TimelineEvent[];
}

export default function TimelineJSStyle({ data }: { data: TimelineData }) {
  const [current, setCurrent] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const currentEvent = data.events[current];
  const [selectedTimeline, setSelectedTimeline] = useLocalStorage<number | null>(
    "Timeline",
    null
  );

  const scrollToEvent = (index: number) => {
    setCurrent(index);
    const el = document.getElementById(`event-${index}`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const next = () => scrollToEvent(Math.min(current + 1, data.events.length - 1));
  const prev = () => scrollToEvent(Math.max(current - 1, 0));

  useEffect(() => {
    setSelectedTimeline(currentEvent.start_date.year);
  }, [current]);

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* 🌌 Background transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://source.unsplash.com/1600x900/?india,history')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(40%)",
          }}
        />
      </AnimatePresence>

      {/* 🧭 Header section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center flex-grow px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            absolute top-4 left-1/2 -translate-x-1/2 sm:top-6 sm:left-6 sm:translate-x-0
            z-30 text-black px-4 py-2 rounded-full shadow-lg border bg-white border-gray-200
          "
        >
          <AnimatedDropdown options={["General", "TimePeriod"]} />
        </motion.div>

        {/* 🖥️ Website viewer area */}
        <motion.div
          key={`desc-${current}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full mt-16 sm:mt-0"
        >
          <WebsiteViewer url={getMediaUrl(currentEvent.media)} />
        </motion.div>
      </div>

      {/* 📜 Timeline Bar */}
      <div className="relative z-20 bg-white text-black py-2 sm:py-3 border-t border-gray-300">
        <div
          ref={timelineRef}
          className="
            flex overflow-x-auto gap-2 sm:gap-4 px-2 sm:px-4 scroll-smooth scrollbar-hide
          "
        >
          {data.events.map((event, i) => (
            <motion.div
              id={`event-${i}`}
              key={i}
              whileHover={{ scale: 1.05 }}
              onClick={() => scrollToEvent(i)}
              className={`min-w-[90px] sm:min-w-[120px] flex-shrink-0 text-center p-2 rounded-lg cursor-pointer transition-all ${
                i === current
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 hover:bg-blue-50"
              }`}
            >
              <div className="font-semibold text-xs sm:text-sm">
                {event.start_date.year}
              </div>
              <div className="text-[10px] sm:text-xs truncate">{event.headline}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🧾 Event Info Section */}
      <div className="relative z-20 bg-gray-50 text-black flex flex-col flex-grow p-4 sm:p-6 border-t h-[40vh] sm:h-auto">
        {/* Title */}
        <motion.h2
          key={`event-headline-${current}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-lg sm:text-2xl font-bold mb-2 text-center"
        >
          {currentEvent.headline}
        </motion.h2>

        {/* Description fills space */}
        <motion.div
          key={`event-text-${current}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 overflow-y-auto max-w-3xl mx-auto text-center text-gray-700 text-sm sm:text-base leading-relaxed"
        >
          {currentEvent.text}
        </motion.div>

        {getMediaUrl(currentEvent.media) && (
          <p className="text-center mt-2 text-blue-600 text-sm">
            <a
              href={getMediaUrl(currentEvent.media)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more →
            </a>
          </p>
        )}

        {/* ✅ Centered Navigation Buttons */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4 pointer-events-none">
          <button
            onClick={prev}
            className="
              bg-white/80 text-black rounded-full p-3 sm:p-2 hover:bg-white shadow-md
              active:scale-95 pointer-events-auto
            "
          >
            ◀
          </button>

          <button
            onClick={next}
            className="
              bg-white/80 text-black rounded-full p-3 sm:p-2 hover:bg-white shadow-md
              active:scale-95 pointer-events-auto
            "
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
