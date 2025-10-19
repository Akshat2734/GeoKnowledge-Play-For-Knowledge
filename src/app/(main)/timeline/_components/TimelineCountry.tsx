"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useLocalStorage from "../../hooks/useLocalStorage";

const TimelineJSStyleSafe = dynamic(() => import("./TimelineJSStyleSafe"), {
  ssr: false,
});

export default function TimelineCountry({ timelines }: { timelines: Record<string, any> }) {
  const [selectedCountry] = useLocalStorage("selectedCountry", null);
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const data = selectedCountry ? timelines[selectedCountry] ?? null : null;

  if (!ready)
    return (
      <div className="text-white h-screen flex justify-center items-center">
        Loading timelines...
      </div>
    );

  return (
    <div className="w-full pt-5 bg-black">
      {data ? (
        <TimelineJSStyleSafe data={data} />
      ) : (
        <div className="flex items-center justify-center h-full text-white text-2xl">
          {selectedCountry
            ? `No timeline data for ${selectedCountry}`
            : "No country selected"}
        </div>
      )}
    </div>
  );
}
