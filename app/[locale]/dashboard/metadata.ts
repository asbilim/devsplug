import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  console.log(`[metadata.ts] Generating metadata for locale: ${locale}`);
  try {
    const t = await getTranslations({ locale, namespace: "Dashboard" });

    const title = t("title");
    const description = t("description");
    console.log(`[metadata.ts] Resolved title: ${title}`);
    console.log(`[metadata.ts] Resolved description: ${description}`);

    // Build the base URL based on environment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://devsplug.com";
    const dashboardUrl = `${baseUrl}/${locale}/dashboard`;
    console.log(`[metadata.ts] Base URL: ${baseUrl}`);
    console.log(`[metadata.ts] Dashboard URL: ${dashboardUrl}`);

    return {
      title: title,
      description: description,

      // OpenGraph metadata for social sharing
      openGraph: {
        title: title,
        description: description,
        url: dashboardUrl,
        siteName: "DevsPlug",
        locale: locale,
        type: "website",
        images: [
          {
            url: `${baseUrl}/images/og-dashboard.jpg`,
            width: 1200,
            height: 630,
            alt: "Devsplug Dashboard",
          },
        ],
      },

      // Twitter card data
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [`${baseUrl}/images/og-dashboard.jpg`],
      },

      // Set canonical URL
      alternates: {
        canonical: dashboardUrl,
        languages: {
          en: `${baseUrl}/en/dashboard`,
          de: `${baseUrl}/de/dashboard`,
          fr: `${baseUrl}/fr/dashboard`,
        },
      },

      // Add robots directive - typically you may want to noindex dashboard pages
      robots: {
        index: false,
        follow: true,
      },

      // Add keywords (optional)
      keywords: [
        "developer dashboard",
        "coding profile",
        "challenges",
        "code solutions",
        "developer progress",
      ],

      // Set viewport (usually in _app or layout, but can be page-specific)
      viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
      },

      // Set theme color
      themeColor: "#111827", // Dark theme color, adjust based on your application's theme

      // Cache control
      other: {
        "Cache-Control": "private, max-age=0, no-cache, no-store",
      },
    };
  } catch (error) {
    console.error("[metadata.ts] Error generating metadata:", error);
    // Return default/fallback metadata or rethrow the error
    return {
      title: "Dashboard", // Fallback title
      description: "User dashboard.", // Fallback description
    };
  }
}
