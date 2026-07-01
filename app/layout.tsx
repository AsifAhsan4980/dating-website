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
  metadataBase: new URL("https://prova.asifahsan.com"),
  title: "Will you go on a date with me? 💝",
  description: "A very important question for Prova… 🌹",
  openGraph: {
    title: "Will you go on a date with me? 💝",
    description: "Prova… I have something to ask you 🥺",
    url: "https://prova.asifahsan.com",
    siteName: "For Prova",
    images: [
      {
        url: "/prova.jpg",
        width: 1200,
        height: 1200,
        alt: "For Prova 💕",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Will you go on a date with me? 💝",
    description: "Prova… I have something to ask you 🥺",
    images: ["/prova.jpg"],
  },
  icons: {
    icon: "/prova.jpg",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
