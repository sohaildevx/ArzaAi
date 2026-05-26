import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/billing/razorpay/webhook")) {
    return NextResponse.next();
  }

  const isApiRoute = pathname.startsWith("/api");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!isApiRoute && !isDashboardRoute) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });
  const isAuthenticated = Boolean(session?.user);

  if (!isAuthenticated && isApiRoute) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAuthenticated && isDashboardRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
