"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const themeColors = {
  light: { primary: "#1a7f37", background: "#ffffff" },
  dark: { primary: "#3bab5c", background: "#0d1117" },
  matrix: { primary: "#00ff00", background: "#050505" },
  synthwave: { primary: "#ff1493", background: "#040008" },
  terminal: { primary: "#00ff00", background: "#0d0d0d" },
  dracula: { primary: "#ff79c6", background: "#282a36" },
  cyberpunk: { primary: "#ff00ff", background: "#050510" },
  hacker: { primary: "#00ff00", background: "#020202" },
  retro: { primary: "#d35f00", background: "#f5f2ed" },
};

export function ThemeFavicon() {
  const { theme = "light" } = useTheme();

  useEffect(() => {
    const setFavicon = () => {
      const colors =
        themeColors[theme as keyof typeof themeColors] || themeColors.light;
      const favicon = document.getElementById("favicon") as HTMLLinkElement;
      const svg = `
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2L35 11V29L20 38L5 29V11L20 2Z" stroke="${colors.primary}" stroke-width="2" stroke-linejoin="round" fill="${colors.background}"/>
          <path d="M15 14L10 20L15 26" stroke="${colors.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M25 14L30 20L25 26" stroke="${colors.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="20" cy="12" r="2" fill="${colors.primary}"/>
          <circle cx="20" cy="28" r="2" fill="${colors.primary}"/>
          <circle cx="12" cy="20" r="2" fill="${colors.primary}"/>
          <circle cx="28" cy="20" r="2" fill="${colors.primary}"/>
        </svg>
      `;

      const svgBlob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);

      if (favicon) {
        favicon.href = url;
      } else {
        const newFavicon = document.createElement("link");
        newFavicon.id = "favicon";
        newFavicon.rel = "icon";
        newFavicon.href = url;
        document.head.appendChild(newFavicon);
      }

      // Cleanup
      return () => URL.revokeObjectURL(url);
    };

    const cleanup = setFavicon();
    return cleanup;
  }, [theme]);

  return null;
}
