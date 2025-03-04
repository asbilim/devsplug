"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Link, usePathname } from "@/src/i18n/routing";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./ui/dropdown-menu";
import { locales } from "@/src/i18n";
import { DevsplugLogo } from "./devsplug-logo";
import {
  Monitor,
  Moon,
  Sun,
  Terminal,
  Laptop,
  Palette,
  Code2,
  Gamepad2,
  Laptop2,
  Zap,
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

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
  matrix: Terminal,
  synthwave: Gamepad2,
  terminal: Laptop2,
  dracula: Zap,
  cyberpunk: Code2,
  hacker: Terminal,
  retro: Laptop,
  nord: Palette,
  solarized: Sun,
  material: Palette,
  monokai: Code2,
  "github-dark": Code2,
} as const;

const countryCodeMap: Record<string, string> = {
  en: "GB",
  fr: "FR",
  de: "DE",
};

export function Header() {
  const t = useTranslations("Navigation");
  const homeT = useTranslations("Home");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const currentLocale = useLocale();

  const ThemeIcon = themeIcons[theme as keyof typeof themeIcons] || Sun;

  const getThemeDisplayName = (themeName: string) => {
    return t(`themes.${themeName}`);
  };

  const navLinks = [
    { href: "/features", label: t("features"), enabled: true },
    { href: "/docs", label: t("documentation"), enabled: true },
    { href: "/solutions", label: t("solutions"), enabled: false },
    { href: "/contribute", label: t("contribute"), enabled: false },
    { href: "/create", label: t("create"), enabled: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Centered container on all breakpoints */}
      <div className="container mx-auto h-16 px-4 sm:px-6">
        {/* Use flex on mobile, switch to a 3-column grid on md and above */}
        <div className="flex h-full items-center justify-between md:grid md:grid-cols-3">
          {/* Left section - Logo */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono font-bold transition-colors hover:text-primary">
              <DevsplugLogo />
              <span className="hidden sm:inline-block ml-2">Devsplug</span>
            </Link>
          </div>

          {/* Center section - Navigation (hidden on mobile) */}
          <nav className="hidden md:flex items-center justify-center">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {!link.enabled && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                  </div>
                )}
                <Link
                  href={link.enabled ? link.href : "#"}
                  onClick={
                    !link.enabled ? (e) => e.preventDefault() : undefined
                  }
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    !link.enabled
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:text-primary hover:bg-accent"
                  } ${
                    pathname === link.href
                      ? "text-primary bg-accent/50"
                      : "text-muted-foreground"
                  }`}
                  title={!link.enabled ? homeT("featureComingSoon") : ""}>
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right section - Controls */}
          <div className="flex items-center justify-end gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full">
                  <ReactCountryFlag
                    countryCode={countryCodeMap[currentLocale]}
                    svg
                    style={{
                      width: "1.2em",
                      height: "1.2em",
                    }}
                    aria-label={`${languageNames[currentLocale]} flag`}
                  />
                  <span className="sr-only">
                    {languageNames[currentLocale]}
                  </span>
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
                  className="h-8 w-8 rounded-full">
                  <ThemeIcon className="h-4 w-4" />
                  <span className="sr-only">
                    {getThemeDisplayName(theme || "matrix")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t("theme")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  {Object.entries(themeIcons).map(([key, Icon]) => (
                    <DropdownMenuRadioItem
                      key={key}
                      value={key}
                      className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {t(`themes.${key}`)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Section */}
            {status === "loading" ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
              </Button>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 rounded-full ring-2 ring-primary/20 hover:ring-primary/30">
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
              <Button asChild variant="default" size="sm">
                <Link href="/auth/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
