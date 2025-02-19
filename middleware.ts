import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";

export default withAuth(
  async function middleware(request: NextRequest) {
    const protectedPath = "/dashboard";
    const pathname = request.nextUrl.pathname;

    // Redirect root path to /en
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/en";
      return NextResponse.redirect(url);
    }

    // If user is not authenticated and tries to access /dashboard, redirect to login
    const token =
      request.cookies.get("next-auth.session-token") ||
      request.cookies.get("__Secure-next-auth.session-token");

    if (!token && pathname.startsWith(protectedPath)) {
      const url = request.nextUrl.clone();
      url.pathname = "/en/auth/login";
      // url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }: { token: JWT | null }) => !!token,
    },
    pages: {
      signIn: "/en/",
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/"],
};
