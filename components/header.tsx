"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { locales } from "@/src/i18n";
import { DevsplugLogo } from "./devsplug-logo";
import { Monitor, Moon, Sun, Terminal, Wand2 } from "lucide-react";

const languageFlags: Record<string, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  de: "🇩🇪",
};

const languageNames: Record<string, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
};

const themeIcons: Record<string, JSX.Element> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Monitor className="h-4 w-4" />,
  matrix: <Terminal className="h-4 w-4" />,
  synthwave: <Wand2 className="h-4 w-4" />,
  terminal: <Terminal className="h-4 w-4" />,
  dracula: <Moon className="h-4 w-4" />,
};

export function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const switchLocale = (locale: string) => {
    // Remove the current locale from pathname
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono font-bold transition-colors hover:text-primary">
            <DevsplugLogo />
            <span className="hidden md:inline-block">Devsplug</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 font-mono text-xs md:text-sm">
                {languageFlags[pathname.split("/")[1] || "en"]}
                <span className="hidden md:inline-block">
                  {languageNames[pathname.split("/")[1] || "en"]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[150px]">
              {locales.map((locale) => (
                <DropdownMenuItem key={locale} asChild>
                  <Link
                    href={switchLocale(locale)}
                    className="flex items-center gap-2 font-mono">
                    {languageFlags[locale]}
                    {languageNames[locale]}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 font-mono text-xs md:text-sm">
                {themeIcons[theme as string] || themeIcons.system}
                <span className="hidden capitalize md:inline-block">
                  {theme || "system"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[150px]">
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="gap-2">
                <Monitor className="h-4 w-4" />
                {t("themes.system")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="gap-2">
                <Sun className="h-4 w-4" />
                {t("themes.light")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="gap-2">
                <Moon className="h-4 w-4" />
                {t("themes.dark")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("matrix")}
                className="gap-2">
                <Terminal className="h-4 w-4" />
                Matrix
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("synthwave")}
                className="gap-2">
                <Wand2 className="h-4 w-4" />
                Synthwave
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("terminal")}
                className="gap-2">
                <Terminal className="h-4 w-4" />
                Terminal
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dracula")}
                className="gap-2">
                <Moon className="h-4 w-4" />
                Dracula
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
