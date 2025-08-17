import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./_providers/Providers";
import { LangProvider } from "./_providers/LangProvider";
import Lenis from "@/_components/layout/Lenis";

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const CairoFont = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
});

export const metadata: Metadata = {
  title: "QMenu | Effortless Digital Menus for Cafés & Restaurants",
  description:
    "QMenu helps cafés and restaurants create beautiful digital menus in minutes. QR-ready, multilingual, and customizable — no coding, no hassle.",
  keywords: [
    "digital menu",
    "QR code menu",
    "restaurant menu maker",
    "café digital menu",
    "multilingual menu",
    "contactless menu",
    "menu builder",
  ],
  authors: [{ name: "QMenu Team" }],

  openGraph: {
    title: "QMenu | Effortless Digital Menus for Cafés & Restaurants",
    description:
      "Create beautiful, multilingual digital menus for your café or restaurant in minutes. QR-ready, customizable, and hassle-free with QMenu.",
    url: "https://q-menu-delta.vercel.app/",
    siteName: "QMenu",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "QMenu Digital Menu Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QMenu | Effortless Digital Menus for Cafés & Restaurants",
    description:
      "Build your café or restaurant's digital menu in minutes. QR-ready, multilingual & customizable with QMenu.",
    images: ["/assets/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${InterFont.variable} ${CairoFont.variable} antialiased  text-primary font-inter min-h-dvh w-screen bg-background overflow-x-hidden`}
      >
        <Lenis>
          <LangProvider>
            <Providers>{children}</Providers>
          </LangProvider>
        </Lenis>
      </body>
    </html>
  );
}
