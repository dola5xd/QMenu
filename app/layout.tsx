import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./_providers/Providers";

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const CairoFont = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
});

export const metadata: Metadata = {
  title: "QMenu",
  description: "Your modern multilingual café menu, QR-ready and customizable.",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
