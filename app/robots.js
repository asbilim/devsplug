export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/settings/", "/problems/solve"],
    },
    sitemap: "https://devsplug/sitemap.xml",
  };
}
