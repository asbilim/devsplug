"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "./ui/sonner";
import { ThemeFavicon } from "./theme-favicon";

interface ProvidersProps {
  children: React.ReactNode;
  messages: any;
  locale: string;
}

export function Providers({ children, messages, locale }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <ThemeProvider>
          <ThemeFavicon />
          {children}
          <Toaster />
        </ThemeProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
