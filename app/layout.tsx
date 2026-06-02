import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ArzaAI — मराठी कायदेशीर कागदपत्रे सहज तयार करा",
  description:
    "ArzaAI helps Maharashtra court users create properly formatted Marathi legal documents — arza, affidavits, and applications — without relying on court typists.",
  keywords: ["marathi legal documents", "arza", "affidavit", "maharashtra court", "AI legal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="mr"
      className={`${inter.variable} ${notoDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster position="top-right"/>
      </body>
    </html>
  );
}
