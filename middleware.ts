import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Arabic-speaking countries
const arabicCountries = [
  "EG",
  "SA",
  "AE",
  "DZ",
  "MA",
  "LY",
  "SD",
  "KW",
  "QA",
  "OM",
  "BH",
  "YE",
  "IQ",
  "SY",
  "JO",
  "LB",
  "PS",
  "MR",
  "SO",
];

// Detect language
function detectLang(country: string | undefined): "ar" | "en" {
  if (!country) return "en";
  return arabicCountries.includes(country) ? "ar" : "en";
}

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedDesigns = pathname.startsWith("/Designs");
  const isProtectedMenu = pathname.startsWith("/menus");
  const isProtectedAccount = pathname.startsWith("/account");

  // ✅ 1. Language detection only for homepage `/`
  if (pathname === "/") {
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("x-country-code") ||
      "US";
    const lang = detectLang(country);
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}`;
    return NextResponse.redirect(url);
  }

  // 🔒 2. If not logged in and accessing /Designs → redirect to /login
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

  // 🔁 5. If logged in and accessing login/register → redirect to /Designs
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/Designs", req.url));
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
    "/Designs/:path*",
    "/menus/:path*",
  ],
};
