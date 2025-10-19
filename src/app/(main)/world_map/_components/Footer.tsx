"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function Footer() {
  const [selectedCountry] = useLocalStorage("selectedCountry", null);
  const [isReady, setIsReady] = useState(false);

  // Wait until client hydration completes
  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    // Prevent rendering before localStorage is available
    return null;
  }

  if (!selectedCountry) {
    return (
      <div className="w-full flex bg-gray-900 text-white py-4 text-center mt-auto justify-around items-center">
        Selected World: None selected
        <button className="btn" disabled>
          Continue
        </button>
      </div>
    );
  }

  return (
    <footer className="w-full flex bg-gray-900 text-white py-4 text-center mt-auto justify-around items-center">
      Selected World: {selectedCountry}
      <Link href="/timeline">
        <button className="btn">Continue</button>
      </Link>
    </footer>
  );
}
