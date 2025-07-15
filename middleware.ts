// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    // if you set NEXTAUTH_SECRET in env, include it here:
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedPage =
    pathname.startsWith("/Designs") || pathname.startsWith("/menu");

  // 1️⃣ Not signed in, trying to access protected routes → send to /login
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2️⃣ Already signed in, trying to hit sign-in or register → send to /Designs
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/Designs", req.url));
  }

  // 3️⃣ Otherwise, just let them through
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/Designs", "/menu"],
};
