import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_ROUTES = ["/login", "/register", "/"];

export default auth(async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const normalizedPath =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

  const isPublic = PUBLIC_ROUTES.includes(normalizedPath);

  if (
    isLoggedIn &&
    (normalizedPath === "/login" || normalizedPath === "/register")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const segments = pathname.split("/").filter(Boolean);
  const isProfileRoute = segments.length === 1;

  if (
    !isLoggedIn &&
    !isPublic &&
    !isProfileRoute &&
    !pathname.startsWith("/api")
  ) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(self)");

  return response;
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};
