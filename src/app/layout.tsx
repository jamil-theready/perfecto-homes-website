import type { Metadata } from "next";
import { Inter, Libre_Baskerville, Manrope } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OrganizationJsonLd } from "@/components/JsonLd";
import TestimonialCarousel from "@/components/TestimonialCarousel";
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
    default: "Sacramento Real Estate Agents | Homes for Sale & Peru Investment Properties | Perfecto Homes",
    template: "%s | Perfecto Homes Real Estate",
  },
  description:
    "Bilingual real estate team in Sacramento. Homes for sale in Elk Grove, Roseville, Folsom, and El Dorado Hills. Peru investment properties. Call (916) 878-7260.",
  metadataBase: new URL("https://www.perfectohomesrealestate.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Perfecto Homes Real Estate",
    images: [
      {
        url: "/images/logo/perfecto-logo-full.png",
        width: 1200,
        height: 630,
        alt: "Perfecto Homes Real Estate",
      },
    ],
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
        <TestimonialCarousel />
        <Footer />
        <GoogleAnalytics gaId="G-Q0X209GPL3" />
      </body>
    </html>
  );
}
