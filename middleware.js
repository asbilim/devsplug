export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/problems/solve/:path*", "/settings/:path*"],
};
