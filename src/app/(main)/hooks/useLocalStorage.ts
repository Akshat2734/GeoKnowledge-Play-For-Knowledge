"use client";
import { useEffect, useState } from "react";

/**
 * useLocalStorage — synced across components & tabs
 * Safely supports plain strings AND JSON-serialized data.
 */
export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  // Load from localStorage safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        try {
          // Try JSON parse first
          setValue(JSON.parse(stored) as T);
        } catch {
          // Fallback: use as raw string if parsing fails
          setValue(stored as unknown as T);
        }
      } else {
        setValue(initialValue);
      }
    } catch (err) {
      console.error("Failed to read from localStorage:", err);
      setValue(initialValue);
    }
  }, [key, initialValue]);

  // Update & broadcast
  const updateValue = (newValue: T | null) => {
    setValue(newValue ?? initialValue);
    try {
      if (newValue === null) {
        localStorage.removeItem(key);
      } else {
        // Always store as JSON string
        localStorage.setItem(key, JSON.stringify(newValue));
      }
      // Broadcast change for same-tab listeners
      window.dispatchEvent(
        new CustomEvent("localstorage-update", { detail: { key, newValue } })
      );
    } catch (err) {
      console.error("Failed to write to localStorage:", err);
    }
  };

  // Listen for cross-tab or same-tab updates
  useEffect(() => {
    const handleChange = (event: StorageEvent | CustomEvent) => {
      if (event instanceof StorageEvent && event.key === key) {
        if (event.newValue !== null) {
          try {
            setValue(JSON.parse(event.newValue) as T);
          } catch {
            setValue(event.newValue as unknown as T);
          }
        }
      } else if (event instanceof CustomEvent && event.detail.key === key) {
        setValue(event.detail.newValue ?? initialValue);
      }
    };

    window.addEventListener("storage", handleChange as EventListener);
    window.addEventListener("localstorage-update", handleChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleChange as EventListener);
      window.removeEventListener("localstorage-update", handleChange as EventListener);
    };
  }, [key, initialValue]);

  return [value, updateValue] as const;
}
