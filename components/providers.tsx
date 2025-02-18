"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "./ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
  session: any;
  messages: any;
  locale: string;
}

export function Providers({
  children,
  session,
  messages,
  locale,
}: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
