import { NextResponse, type NextRequest } from "next/server";

// Route protection only checks the access cookie's presence — actual token
// validity is enforced by Django on every real request (see lib/api.ts,
// which redirects to /login on a SessionExpiredError). Middleware runs on
// the Edge runtime, so it can't do the refresh-token dance itself.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("seo_access");

  if (pathname === "/login") {
    if (hasSession) return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|finprov-mark.jpeg).*)"],
};
