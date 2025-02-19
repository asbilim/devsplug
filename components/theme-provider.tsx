import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="matrix"
      enableSystem
      themes={[
        "light",
        "dark",
        "matrix",
        "synthwave",
        "terminal",
        "dracula",
        "cyberpunk",
        "hacker",
        "retro",
        "nord",
        "solarized",
        "material",
        "monokai",
        "github-dark",
      ]}
      {...props}>
      {children}
    </NextThemesProvider>
  );
}
