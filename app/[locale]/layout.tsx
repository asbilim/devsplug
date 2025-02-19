import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import "./globals.css";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const validLocales = ["en", "de", "fr"] as const;
  const locale = validLocales.includes(params.locale as any)
    ? params.locale
    : "en";

  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;

    return (
      <html lang={locale} suppressHydrationWarning>
        <body className={inter.className}>
          <Providers messages={messages} locale={locale}>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-8 pb-36">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </body>
      </html>
    );
  } catch {
    notFound();
  }
}
