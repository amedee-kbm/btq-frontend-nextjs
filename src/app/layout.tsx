import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Inter, Noto_Sans, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Footer from "./(main)/footer";
import NavBar from "./nav-bar";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        "font-sans",
        inter.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <body className="flex min-h-screen flex-col bg-surface font-sans">
        <Suspense>
          <NavBar />
          <main className="flex flex-col flex-1 justify-center items-center">
            {children}
          </main>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}

