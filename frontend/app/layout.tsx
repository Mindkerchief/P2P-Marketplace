import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Lusitana } from 'next/font/google';
import { DM_Sans } from "next/font/google";
import Navbar from "../components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lusitana = Lusitana({
  variable: "--font-lusitana",
  weight: ['400', '700'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "P2P Marketplace",
  description: "Buy, sell, rent, and avail services from people near you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <ReactQueryClientProvider> */}
        <body className={`${inter.variable} ${lusitana.variable} antialiased`}>
          <Navbar />
          {children}
        </body>
      {/* </ReactQueryClientProvider> */}
    </html>
  );
}
