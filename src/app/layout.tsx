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
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "./globals.css";

import CookieConsent from "@/components/CookieConsent";
import { consentBootstrap } from "@/lib/consent";
import ConsentGatedScripts from "@/components/ConsentGatedScripts";
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
    default: "Cusco & Sacred Valley Real Estate | Perfecto Homes",
    // Short brand: the previous " | Perfecto Homes Real Estate" suffix (29 chars) pushed
    // most page titles past Google's ~60 char display limit and got truncated anyway.
    template: "%s | Perfecto Homes",
  },
  description:
    "Property for sale in Cusco and the Sacred Valley — homes, land and hospitality investment. US-licensed bilingual agents, also serving Sacramento, CA. Call (916) 878-7260.",
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
      <head>
        {/* Consent Mode v2 defaults. A raw head script, not next/script: an inline
            beforeInteractive Script is serialised into the RSC payload and only runs
            at hydration, which lets the GA4 tag fire ahead of the defaults. */}
        <script dangerouslySetInnerHTML={{ __html: consentBootstrap() }} />
      </head>
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
        <WhatsAppWidget />
        <GoogleAnalytics gaId="G-Q0X209GPL3" />
        {/* Meta Pixel and Metricool ignore Google Consent Mode entirely, so they
            load only once the visitor has accepted. */}
        <ConsentGatedScripts>
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
        {/* Metricool tracker (JS tag — replaces the older image pixel, same hash) */}
        <Script id="metricool-tracker" strategy="afterInteractive">
          {`function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"8bbb27e9742b25ca662c0482dff9b49d"})});`}
        </Script>
        </ConsentGatedScripts>
        <CookieConsent />
      </body>
    </html>
  );
}
