import { useState, useEffect } from "react";

const useLocalStorage = (key: string, initialValue: any) => {
  // Always start with initialValue on server-side
  const [storedValue, setStoredValue] = useState(initialValue);

  // Only run once on mount to get the localStorage value
  useEffect(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue if none
      const value = item ? JSON.parse(item) : initialValue;
      setStoredValue(value);
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  }, [key]);

  // Update local storage whenever the stored value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
