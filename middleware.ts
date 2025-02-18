import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./src/i18n";
import type { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";

// Create intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// Create base middleware
export default withAuth(
  async function middleware(request: NextRequest) {
    const publicPatterns = ["/", "/auth/(.*)"];
    const pathname = request.nextUrl.pathname;

    // Remove locale prefix for pattern matching
    const pathnameWithoutLocale = pathname.replace(/^\/[a-zA-Z-]+/, "");

    // Check if the pathname is a public path
    const isPublicPath = publicPatterns.some((pattern) =>
      new RegExp(`^${pattern}$`).test(pathnameWithoutLocale)
    );

    // For public paths, only apply i18n
    if (isPublicPath) {
      return intlMiddleware(request);
    }

    // For protected paths, apply i18n
    return intlMiddleware(request);
  },
  {
    callbacks: {
      authorized: ({ token }: { token: JWT | null }) => {
        // Allow access to public paths
        const pathname = token?.sub ? new URL(token.sub).pathname : "/";
        const pathnameWithoutLocale = pathname.replace(/^\/[a-zA-Z-]+/, "");
        const isPublicPath = ["/", "/auth/(.*)"].some((pattern) =>
          new RegExp(`^${pattern}$`).test(pathnameWithoutLocale)
        );

        if (isPublicPath) return true;
        return token != null;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)", "/", "/(en|fr|de)/:path*"],
};
