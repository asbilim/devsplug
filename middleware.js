import { NextResponse } from "next/server";
import { default as authMiddleware } from "next-auth/middleware";

export default function middleware(req) {
  const { pathname } = req.nextUrl;

  // Redirect from `/` to `/community`
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/community", req.url));
  }

  // Call the NextAuth middleware
  return authMiddleware(req);
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/problems/solve/:path*",
    "/settings/:path*",
  ],
};
