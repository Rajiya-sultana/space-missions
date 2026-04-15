import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://watch.learnwhatmatters.in"),
  title: "Mission HQ — Space Explorer Workbook",
  description: "Watch your mission videos, earn badges, and become a Certified Space Explorer!",
  openGraph: {
    title: "Mission HQ — Space Explorer Workbook",
    description: "Watch your mission videos, earn badges, and become a Certified Space Explorer!",
    images: ["/og-image.png"],
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
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="min-h-full bg-[#050714] text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
