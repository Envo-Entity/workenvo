import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Workenvo — Behaviour Intelligence Platform",
  description:
    "Turn behaviour into organisational capability. Workenvo helps you detect behavioural signals early, reinforce the right actions, and build the capabilities your organisation needs to perform and scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} h-full antialiased relative`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
