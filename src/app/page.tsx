import Link from "next/link";
import Image from "next/image";
import {
  COMMUNITIES,
  TEAM,
  SOCIAL_LINKS,
  PHONE,
  PHONE_TEL,
  EMAIL,
  PERU_LISTINGS,
} from "@/lib/constants";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollRevealText from "@/components/ScrollRevealText";
import TeamCTA from "@/components/TeamCTA";

export default function HomePage() {
  return (
    <>
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden h-[716px]">
        {/* Background video (desktop) / image (mobile fallback) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero/hero-bg.jpg"
        >
          <source src="/images/hero/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay for text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* Content — bottom-aligned, two-column layout */}
        <div className="relative h-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-[60px]">
          <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between">
            {/* Left column — title + subtitle */}
            <div className="max-w-[597px] flex flex-col gap-[30px]">
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-medium leading-[1.2] tracking-[-0.06em] text-white">
                Expert Real Estate Services in Sacramento and Peru
              </h1>
              <p className="font-[family-name:var(--font-manrope)] text-white text-[16px] font-semibold leading-[1.4] tracking-[-0.02em] max-w-[440px]">
                From Sacramento neighborhoods to investment properties in Peru,
                we help you identify the right opportunities and move forward
                with confidence.
              </p>
            </div>

            {/* Right column — badges */}
            <div className="flex items-center gap-[30px] flex-shrink-0 mt-8 md:mt-0">
              <Image
                src="/images/logo/lpt-realty-white.jpg"
                alt="LPT Realty"
                width={151}
                height={38}
              />
              <Image
                src="/images/logo/diamond-club.png"
                alt="Diamond Club"
                width={168}
                height={37}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====== SOCIAL BAR + LOCATION CARDS ====== */}
      <section className="py-16 sm:py-20">
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
                  className="w-[42px] h-[42px] rounded-full bg-gray-100 flex items-center justify-center text-dark hover:bg-gold hover:text-white hover:shadow-md transition-all duration-200"
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
              <h4 className="text-[22px] font-medium text-dark tracking-[-0.05em] leading-[1.4] mb-3">
                Sacramento
              </h4>
              <div className="relative w-full h-[83px] rounded-md overflow-hidden">
                <Image
                  src="/images/hero/sacramento-aerial.jpg"
                  alt="Aerial view of Sacramento neighborhoods"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="347px"
                />
              </div>
            </Link>

            {/* Peru card */}
            <Link
              href="#peru"
              className="group flex-1 bg-white rounded-[10px] overflow-clip p-5 flex flex-col justify-center items-start shadow-[0_1px_3px_rgba(0,0,0,0.25)] hover:shadow-md transition-shadow"
            >
              <h4 className="text-[22px] font-medium text-dark tracking-[-0.05em] leading-[1.4] mb-3">
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

      {/* ====== COMMUNITIES ====== */}
      <section className="bg-light-gray py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.16em] uppercase text-gold font-normal mb-3">
                Communities
              </p>
              <h2 className="text-3xl sm:text-[36px] font-medium text-dark tracking-[-0.06em]">
                Explore and Learn about the Sacramento Area
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COMMUNITIES.map((c, i) => (
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
                    <h4 className="text-white text-[22px] font-medium tracking-[-0.05em]">
                      {c.name}
                    </h4>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== INTERNATIONAL / PERU ====== */}
      <section id="peru" className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.16em] uppercase text-gold font-normal mb-3">
                International
              </p>
              <h2 className="text-3xl sm:text-[36px] font-medium text-dark tracking-[-0.06em]">
                View our Properties in Peru
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERU_LISTINGS.map((listing, i) => (
              <ScrollReveal key={listing.slug} delay={0.1 * i}>
                <Link
                  href={`/peru/${listing.slug}`}
                  className="group relative rounded-[10px] overflow-hidden aspect-[4/3] block bg-dark"
                >
                  <Image
                    src={listing.image}
                    alt={listing.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h4 className="text-white text-[22px] font-medium tracking-[-0.05em]">
                      {listing.name}
                    </h4>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TEAM ====== */}
      <section id="team" className="bg-white py-16 sm:py-20">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.16em] uppercase text-gold font-normal mb-3">
                Who We Are
              </p>
              <h2 className="text-3xl sm:text-[36px] font-medium text-dark tracking-[-0.06em]">
                Meet The Perfecto Homes Team
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-10">
            {TEAM.map((member, i) => {
              const isEven = i % 2 === 1;
              return (
                <ScrollReveal key={member.slug} delay={0.2}>
                  <div
                    className={`flex flex-col ${
                      isEven ? "md:flex-row-reverse" : "md:flex-row"
                    } gap-6 items-start`}
                  >
                    {/* Photo */}
                    <div className="relative w-[180px] h-[220px] sm:w-[200px] sm:h-[250px] flex-shrink-0 rounded-xl overflow-hidden bg-light-gray">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-contain object-bottom"
                        sizes="200px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-[24px] font-medium text-dark tracking-[-0.05em]">
                          {member.name}
                        </h3>
                        <Link
                          href={`/About-Us/${member.slug}`}
                          className="hidden md:inline-flex items-center gap-1 text-sm text-medium-gray hover:text-gold transition-colors"
                        >
                          Learn More &rarr;
                        </Link>
                      </div>
                      <p className="text-xs tracking-[0.16em] uppercase text-gold mt-1 mb-4">
                        {member.role}
                      </p>
                      <p className="text-medium-gray text-[15px] leading-[1.6] tracking-[0.02em] mb-5">
                        {member.bio}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <a
                          href={
                            member.phoneLink ||
                            `tel:${member.phoneTel}`
                          }
                          className="inline-flex items-center gap-2 bg-light-gray hover:bg-gray-100 text-dark text-sm font-medium px-4 py-2.5 rounded-lg transition-colors [&_svg]:text-gold"
                        >
                          <PhoneIcon />
                          {member.phone}
                        </a>
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-2 bg-light-gray hover:bg-gray-100 text-dark text-sm font-medium px-4 py-2.5 rounded-lg transition-colors [&_svg]:text-gold"
                        >
                          <EmailIcon />
                          Email
                        </a>
                      </div>
                      <Link
                        href={`/About-Us/${member.slug}`}
                        className="md:hidden inline-flex items-center gap-1 text-sm text-medium-gray hover:text-gold transition-colors mt-3"
                      >
                        Learn More &rarr;
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== NEWSLETTER ====== */}
      <section className="bg-light-gray py-16 sm:py-20">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/contact/backdrop.jpg"
                alt="Newsletter background"
                fill
                className="object-cover"
                sizes="900px"
              />
              <div className="absolute inset-0 bg-dark/85" />
              <div className="relative text-white text-center px-6 sm:px-12 py-12 sm:py-16">
                <h2 className="text-2xl sm:text-[32px] font-medium tracking-[-0.06em] mb-3">
                  Stay Up to Date
                </h2>
                <p className="text-gray-300 text-sm mb-8 max-w-md mx-auto">
                  Subscribe to our newsletter and receive updates on new
                  listings, events, news, and more.
                </p>
                <form
                  action="https://api.web3forms.com/submit"
                  method="POST"
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY" />
                  <input type="hidden" name="subject" value="New Newsletter Subscriber — Perfecto Homes" />
                  <input type="hidden" name="from_name" value="Perfecto Homes Website" />
                  <input type="hidden" name="redirect" value="https://www.perfectohomesrealestate.com/thank-you" />
                  <input type="checkbox" name="botcheck" className="hidden" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@email.com"
                    className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 text-sm focus:border-gold transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
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
              <h2 className="text-3xl sm:text-[36px] font-medium text-dark tracking-[-0.06em]">
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
                  <h3 className="text-white text-xl sm:text-2xl font-medium tracking-[-0.04em] mb-1">
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

          {/* ====== CROSS-PROMOTION: FINANCING ====== */}
          <TeamCTA variant="alfredo" />

          {/* Information for Sellers / Buyers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sellers */}
            <ScrollReveal delay={0.1}>
              <div className="rounded-[10px] overflow-hidden bg-light-gray">
                <div className="relative h-[200px]">
                  <Image
                    src="/images/resources/sellers-house.jpg"
                    alt="Information for Sellers"
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-[28px] font-medium text-dark tracking-[-0.05em] mb-6">
                    Information for{" "}
                    <span className="text-gold">Sellers</span>
                  </h3>
                  <div className="space-y-5">
                    <InfoItem
                      title="Maximize Your Home Value"
                      description="Proven strategies that help you sell for top dollar."
                    />
                    <InfoItem
                      title="Professional Marketing & Exposure"
                      description="High-quality photos, listings, and promotion that attract serious buyers."
                    />
                    <InfoItem
                      title="Guidance From Prep to Closing"
                      description="Step-by-step support to make your selling process smooth and stress-free."
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Buyers */}
            <ScrollReveal delay={0.2}>
              <div className="rounded-[10px] overflow-hidden bg-light-gray">
                <div className="relative h-[200px]">
                  <Image
                    src="/images/resources/buyers-house.jpg"
                    alt="Information for Buyers"
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-[28px] font-medium text-dark tracking-[-0.05em] mb-6">
                    Information for{" "}
                    <span className="text-gold">Buyers</span>
                  </h3>
                  <div className="space-y-5">
                    <InfoItem
                      title="Trusted Financing Partners"
                      description="Access to reliable lenders and a simplified loan process."
                    />
                    <InfoItem
                      title="Local Experts"
                      description="We guide you through every step — from searching to getting your keys."
                    />
                    <InfoItem
                      title="Bilingual Support"
                      description="Clear communication in English or Spanish for your family's comfort."
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ====== CROSS-PROMOTION: NOTARY ====== */}
      <TeamCTA variant="gina" />

      {/* ====== TESTIMONIALS ====== */}
      <TestimonialCarousel />

      {/* ====== CONTACT CTA ====== */}
      <section className="relative py-16 sm:py-20">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/contact/backdrop.jpg"
            alt="Contact us backdrop"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-white/90" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left side */}
            <ScrollReveal>
              <div>
                <h2 className="text-3xl sm:text-[36px] font-medium text-dark tracking-[-0.06em] mb-2">
                  Don&apos;t wait.
                  <br />
                  Contact us, today.
                </h2>

                <div className="space-y-3 mt-8">
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="flex items-center gap-3 text-dark hover:text-gold transition-colors"
                  >
                    <PhoneIcon />
                    <span className="font-medium">{PHONE}</span>
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-center gap-3 text-dark hover:text-gold transition-colors"
                  >
                    <EmailIcon />
                    <span className="font-medium">{EMAIL}</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Right side — Contact Form */}
            <ScrollReveal delay={0.2}>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ====== CROSS-PROMOTION: WEB DESIGN ====== */}
      <TeamCTA variant="jamil" />
    </>
  );
}

/* ──────── Helper components ──────── */

function InfoItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gold"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <h4 className="font-semibold text-dark text-sm">{title}</h4>
        <p className="text-medium-gray text-xs leading-relaxed mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold flex-shrink-0"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold flex-shrink-0"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

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
