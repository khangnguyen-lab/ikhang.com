import type { Metadata } from "next";
import { JetBrains_Mono, Lora, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { StarField } from "@/components/ui/StarField";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

/** D-DIN — spacex.com typeface (regular + bold) */
const spacex = localFont({
  src: [
    { path: "../public/fonts/D-DIN.woff", weight: "400", style: "normal" },
    { path: "../public/fonts/D-DIN-Bold.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-spacex",
  display: "swap",
  preload: true,
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const body = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Khang Nguyen",
  description:
    "Personal site of Khang Nguyen — UCI student, Stripe intern, NASA researcher, and founder of Irvine Consulting Group.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spacex.variable} ${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="font-body">
        <CustomCursor />
        <StarField />
        <main className="relative z-10 pl-14 pr-14 md:pl-16 md:pr-16">
          {children}
        </main>
        <SiteChrome />
      </body>
    </html>
  );
}
