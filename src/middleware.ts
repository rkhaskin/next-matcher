import { NextResponse } from "next/server";
import { auth } from "./auth";
import { publicRoutes, authRoutes } from "./routes";

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;

  const isPublic = publicRoutes.includes(nextUrl.pathname);
  if (isPublic) {
    return NextResponse.next();
  }

  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);
  if (isAuthRoutes) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/members", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isPublic && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
