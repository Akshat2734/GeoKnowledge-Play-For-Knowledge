'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebsiteViewer from './TimelineFrame';
import { getMediaUrl } from 'import/app/utils/getMedialUrl'; // ✅ fixed import path & typo
import type { TimelineEvent } from 'import/types/timeline'; // ✅ proper import
import AnimatedDropdown from '../../components/AnimatedDropdown';
import useLocalStorage from '../../hooks/useLocalStorage';

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
  const [selectedTimeline, setSelectedTimeline] = useLocalStorage<number | null>("Timeline", null);

  const scrollToEvent = (index: number) => {
    setCurrent(index);
    const el = document.getElementById(`event-${index}`);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const next = () => scrollToEvent(Math.min(current + 1, data.events.length - 1));
  const prev = () => scrollToEvent(Math.max(current - 1, 0));

  useEffect(() => {
    setSelectedTimeline(currentEvent.start_date.year);
  }, [current]);

  return (
    <div className="relative w-full h-[90%] flex flex-col bg-black text-white overflow-hidden">
      {/* Background Transition */}
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
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(40%)',
          }}
        />
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-6 left-6 z-30 text-black px-4 py-2 rounded-full shadow-lg border bg-white border-gray-200"
        >
          <AnimatedDropdown options={["General", "TimePeriod"]} />
        </motion.div>
        {/*
        <motion.h1
          key={`headline-${current}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-4 uppercase tracking-wide"
        >
          {data.title?.text?.headline || 'Timeline'}
        </motion.h1>
        /*}

        {/* ✅ FIX 1: change <motion.p> → <motion.div> to avoid invalid <div> inside <p> */}
        <motion.div
          key={`desc-${current}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl text-lg leading-relaxed"
        >
          {/* ✅ FIX 2: use helper for both media formats */}
          <WebsiteViewer url={getMediaUrl(currentEvent.media)} />
        </motion.div>
      </div>

      {/* Timeline Bar */}
      <div className="relative z-20 bg-white text-black py-3 border-t border-gray-300">
        <div
          ref={timelineRef}
          className="flex overflow-x-auto gap-4 px-4 scroll-smooth scrollbar-hide"
        >
          {data.events.map((event, i) => (
            <motion.div
              id={`event-${i}`}
              key={i}
              whileHover={{ scale: 1.1 }}
              onClick={() => scrollToEvent(i)}
              className={`min-w-[120px] flex-shrink-0 text-center p-2 rounded-lg cursor-pointer transition-all ${
                i === current
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-blue-50'
              }`}
            >
              <div className="font-semibold text-sm">{event.start_date.year}</div>
              <div className="text-xs truncate">{event.headline}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Info */}
      <div className="relative z-20 bg-gray-50 text-black p-6 border-t">
        <motion.h2
          key={`event-headline-${current}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold mb-2 text-center"
        >
          {currentEvent.headline}
        </motion.h2>
        <motion.p
          key={`event-text-${current}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-3xl mx-auto text-center text-gray-700"
        >
          {currentEvent.text}
        </motion.p>
        {getMediaUrl(currentEvent.media) && (
          <p className="text-center mt-2 text-blue-600">
            <a
              href={getMediaUrl(currentEvent.media)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more →
            </a>
          </p>
        )}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 text-black rounded-full p-2 hover:bg-white shadow-md"
        >
          ◀
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 text-black rounded-full p-2 hover:bg-white shadow-md"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
