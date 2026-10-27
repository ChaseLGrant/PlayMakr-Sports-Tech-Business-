import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { brand, siteUrl } from "@/lib/brand";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" });

const title = `${brand.name} — Custom Technology for Sports Organizations`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${brand.name}` },
  description: brand.description,
  applicationName: brand.name,
  keywords: [
    "sports technology",
    "sports facility software",
    "youth sports operations",
    "sports business automation",
    "custom software for sports organizations",
    "registration automation",
    "league management automation",
    "sports camp registration software",
    "college athletics revenue",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: brand.name,
    title,
    description: brand.description,
  },
  twitter: { card: "summary_large_image", title, description: brand.description },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060a15",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
