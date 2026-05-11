import Link from "next/link";
import Image from "next/image";
import {
  COMMUNITIES,
  SOCIAL_LINKS,
  PERU_LISTINGS,
} from "@/lib/constants";
import NewsletterForm from "@/components/NewsletterForm";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollRevealText from "@/components/ScrollRevealText";
import CinematicHero from "@/components/CinematicHero";
import FullscreenListings from "@/components/FullscreenListings";
import TeamSection from "@/components/TeamSection";
import SacramentoIntro from "@/components/SacramentoIntro";
import PeruCommunitiesSection from "@/components/PeruCommunitiesSection";

const SACRAMENTO_LISTINGS = [
  {
    name: "11610 Vickie Dr",
    slug: "11610-vickie-dr",
    image:
      "https://res.cloudinary.com/duwsn5ksy/image/upload/w_1600,q_auto,f_auto/listings/perfecto-homes/11610-vickie-dr/1.jpg",
  },
  {
    name: "6630 Dunmore Ave",
    slug: "6630-dunmore-ave",
    image:
      "https://res.cloudinary.com/duwsn5ksy/image/upload/w_1600,q_auto,f_auto/listings/perfecto-homes/6630-dunmore-ave/1.jpg",
  },
  {
    name: "6236 Riverbelle Ct",
    slug: "6236-riverbelle-ct",
    image:
      "https://res.cloudinary.com/duwsn5ksy/image/upload/w_1600,q_auto,f_auto/listings/perfecto-homes/6236-riverbelle-ct/1.jpg",
  },
];

export default function HomePage() {
  return (
    <>
      <CinematicHero />

      {/* ====== SOCIAL BAR + LOCATION CARDS ====== */}
      <section className="pt-8 pb-16 sm:pt-10 sm:pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-stretch gap-5">
            {/* Social icons column */}
            <div className="flex-1 bg-white flex items-center justify-center gap-6 py-4">
              {Object.entries(SOCIAL_LINKS).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="w-9 h-9 rounded-full bg-light-gray hover:bg-gold text-medium-gray hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  <SocialSvg name={name} />
                </a>
              ))}
            </div>

            {/* Sacramento card */}
            <Link
              href="/communities/communities"
              className="group flex-1 bg-white rounded-[10px] overflow-clip p-5 flex flex-col justify-center items-start shadow-[0_1px_3px_rgba(0,0,0,0.25)] hover:shadow-md transition-shadow"
            >
              <h4 className="text-[18px] font-medium text-dark tracking-[-0.05em] leading-[1.4] mb-3">
                Sacramento
              </h4>
              <div className="relative w-full h-[83px] rounded-md overflow-hidden">
                <Image
                  src="/images/hero/sacramento-card.jpg"
                  alt="Sacramento Area real estate"
                  fill
                  className="object-contain"
                  sizes="347px"
                />
              </div>
            </Link>

            {/* Peru card */}
            <Link
              href="#peru"
              className="group flex-1 bg-white rounded-[10px] overflow-clip p-5 flex flex-col justify-center items-start shadow-[0_1px_3px_rgba(0,0,0,0.25)] hover:shadow-md transition-shadow"
            >
              <h4 className="text-[18px] font-medium text-dark tracking-[-0.05em] leading-[1.4] mb-3">
                Peru
              </h4>
              <div className="relative w-full h-[83px]">
                <Image
                  src="/images/hero/peru.png"
                  alt="Peru Sacred Valley landscape"
                  fill
                  className="object-contain"
                  sizes="347px"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== MISSION STATEMENTS ====== */}
      <ScrollRevealText />

      {/* ====== PERU LISTINGS (fullscreen) ====== */}
      <FullscreenListings
        listings={PERU_LISTINGS}
        basePath="/peru"
        sectionId="peru"
        intro={{ eyebrow: "Featured Properties", prefix: "Our Listings in", highlight: "Peru" }}
        regionLabel="International · Peru"
      />

      {/* ====== PERU COMMUNITIES ====== */}
      <PeruCommunitiesSection />

      {/* ====== SACRAMENTO LISTINGS (fullscreen) ====== */}
      <FullscreenListings
        listings={SACRAMENTO_LISTINGS}
        basePath="/listings"
        sectionId="sacramento-listings"
        intro={{ eyebrow: "Featured Properties", prefix: "Our Listings in", highlight: "Sacramento" }}
        regionLabel="Sacramento · California"
      />

      {/* ====== SACRAMENTO COMMUNITIES ====== */}
      <SacramentoIntro />
      <section className="bg-light-gray py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMMUNITIES.slice(0, 9).map((c, i) => (
              <ScrollReveal key={c.slug} delay={0.1 * i}>
                <Link
                  href={`/communities/${c.slug}`}
                  className="group relative rounded-[10px] overflow-hidden aspect-[4/3] block bg-dark"
                >
                  <Image
                    src={c.image}
                    alt={`Homes in ${c.name}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h4 className="text-white text-[18px] font-medium tracking-[-0.05em]">
                      {c.name}
                    </h4>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TEAM ====== */}
      <TeamSection />

      {/* ====== NEWSLETTER ====== */}
      <section className="relative overflow-hidden bg-dark py-20 sm:py-28">
        <Image
          src="/images/contact/backdrop.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-dark/70" />
        <div className="relative max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-white text-center">
              <h2 className="text-2xl sm:text-[32px] font-medium tracking-[-0.06em] mb-3">
                Stay Up to Date
              </h2>
              <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-md mx-auto">
                Subscribe to our newsletter and receive updates on new
                listings, events, news, and more.
              </p>
              <NewsletterForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ====== RESOURCES ====== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-xs tracking-[0.16em] uppercase text-gold font-normal mb-3">
                Resources
              </p>
              <h2 className="text-2xl sm:text-[28px] font-medium text-dark tracking-[-0.06em]">
                Insights, Stories, and Events
              </h2>
            </div>
          </ScrollReveal>

          {/* News + Events — asymmetric layout */}
          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
              {/* Blog — takes 2 cols */}
              <Link
                href="/blog"
                className="group lg:col-span-2 relative rounded-xl overflow-hidden aspect-[16/7] block"
              >
                <Image
                  src="/images/resources/news.png"
                  alt="Blog and News"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-gold text-xs font-semibold tracking-wider uppercase mb-2">Blog</p>
                  <h3 className="text-white text-xl sm:text-xl font-medium tracking-[-0.04em] mb-1">
                    Real Estate Tips and Market Updates
                  </h3>
                  <p className="text-white/70 text-sm">
                    Read our latest articles &rarr;
                  </p>
                </div>
              </Link>

              {/* Events — single col */}
              <Link
                href="/events"
                className="group relative rounded-xl overflow-hidden aspect-[16/7] lg:aspect-auto block"
              >
                <Image
                  src="/images/resources/events.jpg"
                  alt="Events"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-gold text-xs font-semibold tracking-wider uppercase mb-2">Events</p>
                  <h3 className="text-white text-xl font-medium tracking-[-0.04em] mb-1">
                    Community Events
                  </h3>
                  <p className="text-white/70 text-sm">
                    See what&apos;s coming up &rarr;
                  </p>
                </div>
              </Link>
            </div>
          </ScrollReveal>


        </div>
      </section>



    </>
  );
}

/* ──────── Helper components ──────── */

function SocialSvg({ name }: { name: string }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "facebook")
    return (
      <svg {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  if (name === "instagram")
    return (
      <svg {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  if (name === "tiktok")
    return (
      <svg {...props}>
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    );
  if (name === "youtube")
    return (
      <svg {...props}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    );
  return null;
}
