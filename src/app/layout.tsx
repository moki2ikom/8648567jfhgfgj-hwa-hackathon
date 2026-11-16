import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = "https://8648567jfhgfgj-hwa-hackathon.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sniff & Solve — A Nose-Led Puzzle That Redraws Itself",
    template: "%s — Sniff & Solve",
  },
  description:
    "Six magnetic scent modules on a machined base. Reconfigure the deck, rotate the scents, and give your dog a puzzle that is never finished. Free shipping over $100.",
  keywords: [
    "dog enrichment",
    "scent puzzle",
    "dog puzzle toy",
    "nose work",
    "snuffle",
    "treat puzzle",
  ],
  authors: [{ name: "Sniff & Solve" }],
  creator: "Sniff & Solve",
  publisher: "Sniff & Solve",
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Sniff & Solve",
    title: "Sniff & Solve — A Nose-Led Puzzle That Redraws Itself",
    description:
      "Six magnetic scent modules. 720 permutations. One station your dog can never finish.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sniff & Solve — A Nose-Led Puzzle That Redraws Itself",
    description:
      "Six magnetic scent modules. 720 permutations. One station your dog can never finish.",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bone-50 text-ink">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
