import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Inter } from "next/font/google";
import { UserProvider } from "@/utils/UserContext";
import { ThemeProvider } from "next-themes";
<<<<<<< HEAD
import { NotificationProvider } from "@/utils/NotificationContext";
import { ReviewProvider } from "@/utils/ReviewContext";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
=======
import { Toaster } from "@/components/ui/sonner"
import AppChrome from "@/components/app-chrome";
>>>>>>> 41c0910dfbfac80aa9977c699016dcddccc6088e
import "./globals.css";

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

export const metadata: Metadata = {
  title: "P2P Marketplace",
  description: "Buy, sell, rent, and avail services from people near you.",
};

export default function RootLayout({ children }:
  Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${dmSans.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
<<<<<<< HEAD
            <NotificationProvider>
              <ReviewProvider>
                <Navbar />
                {children}
                <Toaster />
                <Footer />
              </ReviewProvider>
            </NotificationProvider>
=======
            <AppChrome slot="top" />
            {children}
            <Toaster />
            <AppChrome slot="bottom" />
>>>>>>> 41c0910dfbfac80aa9977c699016dcddccc6088e
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
