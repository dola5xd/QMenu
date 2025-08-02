import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedDesigns = pathname.startsWith("/designs");
  const isProtectedMenu = pathname.startsWith("/menus");
  const isProtectedAccount = pathname.startsWith("/account");

  // ✅ 1. Always allow homepage
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 🔒 2. If not logged in and accessing /designs → redirect to /login
  if (!token && isProtectedDesigns) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔒 3. If not logged in and accessing /menus → redirect to /
  if (!token && isProtectedMenu) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔒 4. If not logged in and accessing /account → redirect to /
  if (!token && isProtectedAccount) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔁 5. If logged in and accessing login/register → redirect to /designs
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/designs", req.url));
  }

  // ✅ 6. Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/account",
    "/designs/:path*",
    "/menus/:path*",
  ],
};
