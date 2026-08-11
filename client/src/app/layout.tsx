import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/shared/navbar";
import { Toaster } from "sonner";
import { Footer } from "../components/shared/footer";
import QueryProvider from "../providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OsudhX | Smart Pharmacy Management",
  description:
    "OsudhX is a smart pharmacy management system for managing products, inventory, categories, and orders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col justify-between">
        <QueryProvider>
          <main className="flex-1">{children}</main>
        </QueryProvider>

        <Toaster position="top-left"></Toaster>
      </body>
    </html>
  );
}
