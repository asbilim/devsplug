"use client";

import { useEffect, useState } from "react";

/**
 * A hook that returns whether the current viewport matches the specified media query
 * @param query The media query to match against
 * @returns A boolean indicating whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false to avoid hydration mismatch
  // Default to true for wider queries like `(min-width: ...)` to avoid layout shift
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Create a MediaQueryList object
    const mediaQueryList = window.matchMedia(query);

    // Initial check
    setMatches(mediaQueryList.matches);

    // Define a callback function for handling changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add an event listener for changes to the media query
    try {
      // Modern browsers
      mediaQueryList.addEventListener("change", handleChange);
    } catch (e) {
      // Fallback for older browsers
      mediaQueryList.addListener(handleChange);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      try {
        // Modern browsers
        mediaQueryList.removeEventListener("change", handleChange);
      } catch (e) {
        // Fallback for older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}
