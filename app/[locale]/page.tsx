import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { Code2, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Devsplug - Developer Community Hub",
  description:
    "A community hub for developers to connect, share, and grow together.",
  keywords: [
    "developer community",
    "coding",
    "programming",
    "software development",
    "tech community",
  ],
  authors: [{ name: "Devsplug Team" }],
  openGraph: {
    type: "website",
    title: "Devsplug - Developer Community Hub",
    description:
      "A community hub for developers to connect, share, and grow together.",
    siteName: "Devsplug",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devsplug - Developer Community Hub",
    description:
      "A community hub for developers to connect, share, and grow together.",
  },
};

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 text-center">
      <div className="relative">
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary via-primary/50 to-primary/20 opacity-75 blur" />
        <div className="relative flex items-center gap-2 rounded-lg border bg-background px-4 py-2 font-mono">
          <Code2 className="h-5 w-5 text-primary" />
          <span className="text-sm">devsplug.dev</span>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="font-mono text-4xl font-bold tracking-tight md:text-6xl">
          {t("title")}
        </h1>
        <p className="mx-auto max-w-[42rem] font-sans leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          {t("description")}
        </p>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="font-handwriting text-lg">{t("status")}</p>
        </div>
      </div>
    </div>
  );
}
