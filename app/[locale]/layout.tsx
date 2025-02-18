import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { auth } from "@/app/auth";
import "./globals.css";
import { routing } from "@/src/i18n/routing";

const inter = Inter({ subsets: ["latin"] });

type LayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export default async function RootLayout({
  children,
  params: { locale },
}: LayoutProps) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();
  const session = await auth();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers session={session} messages={messages} locale={locale}>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
