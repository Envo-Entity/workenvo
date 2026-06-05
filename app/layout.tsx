import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

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
      <GoogleTagManager gtmId="GTM-K6M9GVJ3" />
      <GoogleAnalytics gaId="G-YEXWEX52MR" />
      <Script
        id="salesloft-scout"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(i,s,o,g,r,a,m){i['SLScoutObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://scout-cdn.salesloft.com/sl.js','slscout');slscout(["init", "eyJhbGciOiJIUzI1NiJ9.eyJ0IjoxMTI3NzV9.YAxfNI2uqYTaqV6fmP8CgIpH0BtPYaZsEG27lKFsVgI"]);`,
        }}
      />
    </html>
  );
}
