import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalCTA from "@/components/GlobalCTA";
import { OrganizationJsonLd } from "@/components/JsonLd";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import SiteIntro from "@/components/SiteIntro";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
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
    <html lang="en" className="bg-white">
      <body
        className={`${inter.variable} ${lato.variable} font-sans antialiased`}
      >
        <OrganizationJsonLd />
        <SiteIntro />
        <Header />
        <main className="bg-white">{children}</main>
        <TestimonialCarousel />
        <GlobalCTA />
        <Footer />
        <GoogleAnalytics gaId="G-Q0X209GPL3" />
        {/* Meta Pixel — ID: 715432155734308 */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '715432155734308');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=715432155734308&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* Metricool tracking pixel */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://tracker.metricool.com/c3po.jpg?hash=8bbb27e9742b25ca662c0482dff9b49d"
          alt=""
        />
      </body>
    </html>
  );
}
