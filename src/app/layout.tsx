import type { Metadata } from "next";
import { Inter, Libre_Baskerville, Manrope } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OrganizationJsonLd } from "@/components/JsonLd";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Real Estate Consultation & Steps to Buying a House | Perfecto Homes",
    template: "%s | Perfecto Homes",
  },
  description:
    "Expert real estate services in Sacramento and Peru. From Sacramento neighborhoods to investment properties in Peru, we help you identify the right opportunities and move forward with confidence.",
  metadataBase: new URL("https://www.perfectohomesrealestate.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Perfecto Homes Real Estate",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${inter.variable} ${manrope.variable} ${libreBaskerville.variable} font-sans antialiased`}
      >
        <OrganizationJsonLd />
        <Header />
        <main>{children}</main>
        <Footer />
        <GoogleAnalytics gaId="G-Q0X209GPL3" />
      </body>
    </html>
  );
}
