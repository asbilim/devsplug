"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Link, usePathname } from "@/src/i18n/routing"; // Updated: Use next-intl's usePathname
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { locales } from "@/src/i18n";
import { DevsplugLogo } from "./devsplug-logo";
import {
  Monitor,
  Moon,
  Sun,
  Terminal,
  Wand2,
  LogOut,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ReactCountryFlag from "react-country-flag";
import { useLocale } from "next-intl";

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

const countryCodeMap: Record<string, string> = {
  en: "GB",
  fr: "FR",
  de: "DE",
};

export function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const currentLocale = useLocale();

  console.log("Current locale from useLocale:", currentLocale);
  console.log("Country code mapped:", countryCodeMap[currentLocale]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono font-bold transition-colors hover:text-primary">
            <DevsplugLogo />
            <span className="hidden md:inline-block ml-2">Devsplug</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="gap-2 px-3 md:px-4 min-w-[80px]">
                <span className="hidden md:inline-block">{t("language")}</span>
                <ReactCountryFlag
                  countryCode={countryCodeMap[currentLocale]}
                  svg
                  style={{
                    width: "1.2em",
                    height: "1.2em",
                  }}
                  aria-label={`${languageNames[currentLocale]} flag`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((locale) => (
                <DropdownMenuItem key={locale} asChild>
                  <Link
                    href={pathname}
                    locale={locale}
                    className="flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={countryCodeMap[locale]}
                      svg
                      style={{
                        width: "1.2em",
                        height: "1.2em",
                      }}
                      aria-label={`${languageNames[locale]} flag`}
                    />
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
                size="icon"
                className="gap-2 px-3 md:px-4 min-w-[80px]">
                <span className="hidden md:inline-block">{t("theme")}</span>
                {themeIcons[theme as keyof typeof themeIcons] || (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="h-4 w-4 mr-2" />
                {t("themes.light")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="h-4 w-4 mr-2" />
                {t("themes.dark")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="h-4 w-4 mr-2" />
                {t("themes.system")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("matrix")}>
                <Terminal className="h-4 w-4 mr-2" />
                Matrix
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("synthwave")}>
                <Wand2 className="h-4 w-4 mr-2" />
                Synthwave
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("terminal")}>
                <Terminal className="h-4 w-4 mr-2" />
                Terminal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dracula")}>
                <Moon className="h-4 w-4 mr-2" />
                Dracula
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Section */}
          {status === "loading" ? (
            <Button variant="ghost" size="icon" className="ml-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
            </Button>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full ring-2 ring-primary/20 hover:ring-primary/30 ml-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user?.image || ""}
                      alt={session.user?.name || ""}
                    />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="default" className="px-4">
              <Link href="/auth/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
