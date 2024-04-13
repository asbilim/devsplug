import { useEffect, useState } from "react";

function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initial check for dark mode preference.
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const initialMode =
      matcher.matches || document.documentElement.classList.contains("dark");
    setIsDarkMode(initialMode);
    updateHtmlClass(initialMode);

    // Listen for changes in color scheme preference.
    const onChange = ({ matches }) => {
      setIsDarkMode(matches);
      updateHtmlClass(matches);
    };

    matcher.addEventListener("change", onChange);

    // Observe changes to the class attribute of the <html> element.
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const isDarkClassPresent =
            document.documentElement.classList.contains("dark");
          setIsDarkMode(isDarkClassPresent);
          // No need to call updateHtmlClass here as the class change originated from elsewhere
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true, // Observe attribute changes
      attributeFilter: ["class"], // Filter to only observe changes to the 'class' attribute
    });

    // Clean up the event listener and observer when the component unmounts
    return () => {
      matcher.removeEventListener("change", onChange);
      observer.disconnect();
    };
  }, []);

  // Function to update the class on the <html> element
  const updateHtmlClass = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  // Effect to log changes in dark mode state
  useEffect(() => {}, [isDarkMode]); // This effect runs only when isDarkMode changes.

  return isDarkMode;
}

export default useDarkMode;
