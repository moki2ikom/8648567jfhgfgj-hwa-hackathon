import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sniff & Solve — The Modular Scent Puzzle System for Dogs",
  description: "Keep your dog happily busy for hours with Sniff & Solve — the first modular enrichment system with 6 magnetic puzzle modules targeting every canine instinct. 90-day guarantee. Free shipping over $100.",
  keywords: ["dog enrichment", "dog puzzle toy", "separation anxiety", "mental stimulation", "snuffle mat", "treat puzzle"],
  authors: [{ name: "Sniff & Solve" }],
  creator: "Sniff & Solve",
  publisher: "Sniff & Solve",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://8648567jfhgfgj-hwa-hackathon.vercel.app",
    siteName: "Sniff & Solve",
    title: "Sniff & Solve — The Modular Scent Puzzle System for Dogs",
    description: "Keep your dog happily busy for hours with 6 magnetic puzzle modules. Infinite configurations. One happy dog.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sniff & Solve Modular Scent Puzzle System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sniff & Solve — The Modular Scent Puzzle System for Dogs",
    description: "Keep your dog happily busy for hours with 6 magnetic puzzle modules.",
    images: ["/images/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">{children}</body>
    </html>
  );
}