import Link from "next/link";
import Image from "next/image";
import { SOCIAL_LINKS, PERU_LISTINGS } from "@/lib/constants";
import { getCollection } from "@/lib/content";
import TrcCredit from "@/components/TrcCredit";

import CookieSettingsLink from "@/components/CookieSettingsLink";
const SACRED_VALLEY_SLUGS = [
  { slug: "ollantaytambo", name: "Ollantaytambo" },
  { slug: "urubamba", name: "Urubamba" },
  { slug: "pisac", name: "Pisac" },
  { slug: "chinchero", name: "Chinchero" },
  { slug: "calca", name: "Calca" },
  { slug: "yucay", name: "Yucay" },
  { slug: "maras", name: "Maras" },
  { slug: "aguas-calientes", name: "Aguas Calientes" },
];

const CUSCO_CITY_SLUGS = [
  { slug: "cusco", name: "Cusco" },
  { slug: "centro-historico", name: "Centro Histórico" },
  { slug: "san-blas", name: "San Blas" },
  { slug: "wanchaq", name: "Wanchaq" },
  { slug: "san-sebastian", name: "San Sebastián" },
  { slug: "san-jeronimo", name: "San Jerónimo" },
];

const SACRAMENTO_COMMUNITIES = [
  { slug: "sacramento", name: "Sacramento" },
  { slug: "citrus-heights", name: "Citrus Heights" },
  { slug: "roseville", name: "Roseville" },
  { slug: "elk-grove", name: "Elk Grove" },
  { slug: "folsom", name: "Folsom" },
  { slug: "rancho-cordova", name: "Rancho Cordova" },
];

export default function Footer() {
  const sacListings = getCollection("listings/sacramento")
    .filter((l) => (l.status as string) !== "sold")
    .map((l) => ({
      slug: l.slug as string,
      title: (l.title as string) || (l.slug as string),
    }));

  return (
    <footer>
      {/* Upper Footer */}
      <div className="bg-dark-gray text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-8">
            {/* Sacramento Listings */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Sacramento Listings</h4>
              <ul className="space-y-2">
                {sacListings.map((l) => (
                  <li key={l.slug}>
                    <Link href={`/listings/${l.slug}`} className="text-sm text-gray-300 hover:text-gold transition-colors">
                      {l.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/listings" className="text-sm text-gold/80 hover:text-gold font-medium transition-colors">
                    View all &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Peru Listings */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Peru Listings</h4>
              <ul className="space-y-2">
                {PERU_LISTINGS.map((l) => (
                  <li key={l.slug}>
                    <Link href={`/peru/${l.slug}`} className="text-sm text-gray-300 hover:text-gold transition-colors">
                      {l.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/peru" className="text-sm text-gold/80 hover:text-gold font-medium transition-colors">
                    View all &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sacramento Communities */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Sacramento</h4>
              <ul className="space-y-2">
                {SACRAMENTO_COMMUNITIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/communities/${c.slug}`} className="text-sm text-gray-300 hover:text-gold transition-colors">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sacred Valley */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Sacred Valley</h4>
              <ul className="space-y-2">
                {SACRED_VALLEY_SLUGS.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/communities/${c.slug}`} className="text-sm text-gray-300 hover:text-gold transition-colors">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cusco City */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Cusco City</h4>
              <ul className="space-y-2">
                {CUSCO_CITY_SLUGS.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/communities/${c.slug}`} className="text-sm text-gray-300 hover:text-gold transition-colors">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog/first-time-home-buyer-guide-sacramento-ca" className="text-sm text-gray-300 hover:text-gold transition-colors">Buyer Guide</Link></li>
                <li><Link href="/blog/selling-your-home-in-sacramento-what-to-expect" className="text-sm text-gray-300 hover:text-gold transition-colors">Seller Guide</Link></li>
                <li><Link href="/blog" className="text-sm text-gray-300 hover:text-gold transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-300 hover:text-gold transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">About Us</h4>
              <ul className="space-y-2">
                <li><Link href="/about/elisban-gonzales" className="text-sm text-gray-300 hover:text-gold transition-colors">Elisban</Link></li>
                <li><Link href="/about/gina-gonzalez" className="text-sm text-gray-300 hover:text-gold transition-colors">Gina</Link></li>
                <li><Link href="/about/alfredo-gonzalez" className="text-sm text-gray-300 hover:text-gold transition-colors">Alfredo</Link></li>
                <li><Link href="/about/jamil-gonzales" className="text-sm text-gray-300 hover:text-gold transition-colors">Jamil</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer */}
      <div className="bg-dark text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo — matches nav */}
            <div className="flex items-center gap-[10px]">
              <Image
                src="/images/logo/perfecto-logo.svg"
                alt="Perfecto Homes"
                width={26}
                height={21}
                className="w-[26px] h-[21px]"
              />
              <span className="text-[18px] font-semibold tracking-[0.06em]">
                PERFECTO HOMES
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <SocialIcon href={SOCIAL_LINKS.facebook} label="Facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </SocialIcon>
              <SocialIcon href={SOCIAL_LINKS.instagram} label="Instagram">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </SocialIcon>
              <SocialIcon href={SOCIAL_LINKS.tiktok} label="TikTok">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </SocialIcon>
              <SocialIcon href={SOCIAL_LINKS.youtube} label="YouTube">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </SocialIcon>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-6 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Perfecto Homes - All rights reserved
            </p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-gold transition-colors">
                Privacy Policy
              </Link>
            <CookieSettingsLink className="text-xs text-gray-400 hover:text-gold transition-colors" />
              <Link href="/terms" className="text-xs text-gray-400 hover:text-gold transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>

          {/* Brokerage + Credit */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo/lpt-realty-white.jpg"
                alt="LPT Realty"
                style={{ height: "14px", width: "auto" }}
              />
              <p className="text-[10px] text-gray-600">LPT Realty, Inc.</p>
            </div>
            <TrcCredit className="text-white" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:shadow-lg hover:shadow-gold/20 transition-all duration-200"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        {children}
      </svg>
    </a>
  );
}
