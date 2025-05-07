"use client";

import { useState, useEffect } from 'react';

// Generic type for local storage hook
type StorageValue<T> = T | null;

/**
 * A hook to easily use localStorage
 * @param key The localStorage key
 * @param initialValue The initial value if no value exists in localStorage
 * @returns A stateful value and a function to update it
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [StorageValue<T>, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<StorageValue<T>>(initialValue);

  // Initialize the state
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        setStoredValue(item ? JSON.parse(item) : initialValue);
      }
    } catch (error) {
      // If error, return initialValue
      console.error('Error reading from localStorage:', error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T) => {
    try {
      if (typeof window !== 'undefined') {
        // Save state
        setStoredValue(value);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
} 