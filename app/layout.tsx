import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Food Explorer",
  description: "A website to check facts on your favorite foods.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full m-0 p-0">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen bg-gray-50 m-0 p-0 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}