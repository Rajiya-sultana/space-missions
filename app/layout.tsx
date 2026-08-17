import type { Metadata } from "next";
import { Inter, Space_Grotesk, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { WelcomeToast } from "@/components/WelcomeToast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${nunito.variable} h-full`}
    >
      <body className="min-h-full bg-[#050714] text-slate-50 antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <WelcomeToast />
        </AuthProvider>
      </body>
    </html>
  );
}
