import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateHomeMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  return {
    title: t("title"),
    description: t("description"),
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
      description: t("description"),
      siteName: "Devsplug",
    },
    twitter: {
      card: "summary_large_image",
      title: "Devsplug - Developer Community Hub",
      description: t("description"),
    },
  };
}
