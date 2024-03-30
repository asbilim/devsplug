"use client"
import { useEffect, useState } from 'react';

function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initial check for dark mode preference.
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matcher.matches || document.documentElement.classList.contains('dark'));

    // Listen for changes in color scheme preference.
    const onChange = ({ matches }) => {
      setIsDarkMode(matches);
    };

    matcher.addEventListener('change', onChange);

    // Observe changes to the class attribute of the <html> element.
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const isDarkClassPresent = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDarkClassPresent);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true, // Observe attribute changes
      attributeFilter: ['class'], // Filter to only observe changes to the 'class' attribute
    });

    return () => {
      matcher.removeEventListener('change', onChange);
      observer.disconnect();
    };
  }, []);

  return isDarkMode;
}

export default useDarkMode;
