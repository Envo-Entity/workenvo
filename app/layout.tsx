import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "Turn behaviour into capability",
  description:
    "See how your organisation is really operating today and build the capability you'll need tomorrow.",
  openGraph: {
    title: "Turn behaviour into capability",
    description:
      "See how your organisation is really operating today and build the capability you'll need tomorrow.",
    images: [
      {
        url: "/og.png",
        alt: "Workenvo Open Graph preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Turn behaviour into capability",
    description:
      "See how your organisation is really operating today and build the capability you'll need tomorrow.",
    images: ["/og.png"],
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
      className={`${instrumentSerif.variable} ${dmSans.variable} ${montserrat.variable} h-full antialiased relative`}
    >
      <body className="min-h-full flex flex-col bg-white">{children}</body>
      <Analytics />
    </html>
  );
}
