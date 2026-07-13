import { NextResponse } from "next/server";

export function proxy(request) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin") && path !== "/admin-login") {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};