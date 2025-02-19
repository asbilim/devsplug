"use client";

import { NextIntlClientProvider, useMessages } from "next-intl";
import { PropsWithChildren } from "react";

interface ClientLayoutProps extends PropsWithChildren {
  locale: string;
}

export default function ClientLayout({ children, locale }: ClientLayoutProps) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      onError={(error) => {
        // Ignore missing message errors
        if (error.code === "MISSING_MESSAGE") {
          return;
        }
        // Log other errors
        console.error(error);
      }}>
      {children}
    </NextIntlClientProvider>
  );
}
