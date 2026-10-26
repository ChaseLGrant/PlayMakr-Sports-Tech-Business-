import { NextResponse, type NextRequest } from "next/server";

export const HERO_COOKIE = "pm_hero";

/**
 * 1. Hero A/B test: when HERO_SPLIT_TEST=true, assigns each new visitor to
 *    variant A or B for 30 days. Otherwise everyone sees A (or HERO_VARIANT).
 * 2. Optimistic admin check: bounces visitors without a session cookie to the
 *    login page. Real authorization happens in every admin page and action.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!request.cookies.get("pm_admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/" && process.env.HERO_SPLIT_TEST === "true" && !request.cookies.get(HERO_COOKIE)) {
    const variant = Math.random() < 0.5 ? "A" : "B";
    // Make the assignment visible to this very render, then persist it.
    request.cookies.set(HERO_COOKIE, variant);
    const response = NextResponse.next({ request });
    response.cookies.set(HERO_COOKIE, variant, { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
