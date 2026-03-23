import Link from "next/link";
import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer>
      {/* Upper Footer */}
      <div className="bg-dark-gray text-white py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* Sacramento Listings */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Sacramento Listings</h4>
              <ul className="space-y-2">
                <li><Link href="/listings" className="text-sm text-gray-300 hover:text-gold transition-colors">All Sacramento</Link></li>
              </ul>
            </div>

            {/* Peru Listings */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Peru Listings</h4>
              <ul className="space-y-2">
                <li><Link href="/peru/predio-victoria" className="text-sm text-gray-300 hover:text-gold transition-colors">Predio Victoria</Link></li>
                <li><Link href="/peru/hostal-qhispicay-ollantaytambo" className="text-sm text-gray-300 hover:text-gold transition-colors">Hostal Qhispicay</Link></li>
                <li><Link href="/peru/hatuchay-valle-restaurant-urubamba" className="text-sm text-gray-300 hover:text-gold transition-colors">Hatuchay Valle</Link></li>
              </ul>
            </div>

            {/* Sacramento Communities */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Sacramento</h4>
              <ul className="space-y-2">
                <li><Link href="/communities/sacramento" className="text-sm text-gray-300 hover:text-gold transition-colors">Sacramento</Link></li>
                <li><Link href="/communities/citrus-heights" className="text-sm text-gray-300 hover:text-gold transition-colors">Citrus Heights</Link></li>
                <li><Link href="/communities/roseville" className="text-sm text-gray-300 hover:text-gold transition-colors">Roseville</Link></li>
                <li><Link href="/communities/elk-grove" className="text-sm text-gray-300 hover:text-gold transition-colors">Elk Grove</Link></li>
                <li><Link href="/communities/folsom" className="text-sm text-gray-300 hover:text-gold transition-colors">Folsom</Link></li>
              </ul>
            </div>

            {/* Peru Communities */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Peru</h4>
              <ul className="space-y-2">
                <li><Link href="/communities/marysville" className="text-sm text-gray-300 hover:text-gold transition-colors">Ollantaytambo</Link></li>
                <li><Link href="/communities/windsor" className="text-sm text-gray-300 hover:text-gold transition-colors">Urubamba</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog/first-time-home-buyer-guide-sacramento-ca" className="text-sm text-gray-300 hover:text-gold transition-colors">Buyer Guide</Link></li>
                <li><Link href="/blog/selling-your-home-in-sacramento-what-to-expect" className="text-sm text-gray-300 hover:text-gold transition-colors">Seller Guide</Link></li>
                <li><Link href="/blog" className="text-sm text-gray-300 hover:text-gold transition-colors">Blog</Link></li>
                <li><Link href="/Contact-Us" className="text-sm text-gray-300 hover:text-gold transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-400">About Us</h4>
              <ul className="space-y-2">
                <li><Link href="/About-Us/elisban-gonzales" className="text-sm text-gray-300 hover:text-gold transition-colors">Elisban</Link></li>
                <li><Link href="/About-Us/gina-gonzalez" className="text-sm text-gray-300 hover:text-gold transition-colors">Gina</Link></li>
                <li><Link href="/About-Us/alfredo-gonzalez" className="text-sm text-gray-300 hover:text-gold transition-colors">Alfredo</Link></li>
                <li><Link href="/About-Us/jamil-gonzales" className="text-sm text-gray-300 hover:text-gold transition-colors">Jamil</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer */}
      <div className="bg-dark text-white py-6">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
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
              <span className="text-[13px] font-medium tracking-[0.08em]">
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
              &copy; Perfecto Homes - All rights reserved
            </p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-gray-400 hover:text-gold transition-colors">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>

          {/* Brokerage + Credit */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo/lpt-realty-white.jpg"
                alt="LPT Realty"
                width={24}
                height={7}
                className="rounded opacity-15 w-auto h-auto"
              />
              <p className="text-[10px] text-gray-600">LPT Realty, Inc.</p>
            </div>
            <a href="https://thereadyconsult.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-600 hover:text-gold transition-colors">
              Designed by The Ready Consult
            </a>
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
