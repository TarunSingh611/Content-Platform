import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from '@/components/providers/SessionProvider' 

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AI Content Platform - Create, Manage, and Analyze Content",
  description: "AI-powered content management platform with advanced analytics, collaborative editing, and comprehensive blog features.",
  keywords: "content management, AI, blog, analytics, collaboration",
  authors: [{ name: "AI Content Platform" }],
  robots: "index, follow",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

          <Providers>
            {children}
          </Providers>
      </body>
    </html>
  );
}
