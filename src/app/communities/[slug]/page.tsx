import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { COMMUNITIES, PHONE, PHONE_TEL, EMAIL } from "@/lib/constants";
import { getItemBySlug, markdownToHtml, getCollectionSlugs } from "@/lib/content";
import ContactForm from "@/components/ContactForm";

type Props = { params: Promise<{ slug: string }> };

const COMMUNITY_SEO: Record<string, { title: string; description: string }> = {
  "citrus-heights": {
    title: "Homes for Sale in Citrus Heights CA",
    description: "Browse homes for sale in Citrus Heights, California. Updated listings, market data, and local agent support. Perfecto Homes Real Estate.",
  },
  sacramento: {
    title: "Homes for Sale in Sacramento CA",
    description: "Browse homes for sale in Sacramento, Roseville, Elk Grove, Folsom, Citrus Heights, and El Dorado Hills. Perfecto Homes Real Estate — your local Sacramento brokerage.",
  },
  arden: {
    title: "Homes for Sale in Arden Arcade, Sacramento CA",
    description: "Browse homes for sale in Arden Arcade, Sacramento. Updated listings and local market knowledge. Perfecto Homes Real Estate.",
  },
  "rancho-cordova": {
    title: "Homes for Sale in Rancho Cordova CA",
    description: "Homes for sale in Rancho Cordova, California. Browse current listings, pricing, and neighborhood info. Perfecto Homes Real Estate.",
  },
  roseville: {
    title: "Homes for Sale in Roseville CA | New Construction & Resale",
    description: "Homes and new construction for sale in Roseville, California. Browse listings, get market insights, and work with a local agent. Perfecto Homes Real Estate.",
  },
  folsom: {
    title: "Homes & Condos for Sale in Folsom CA",
    description: "Browse homes, condos, and new construction for sale in Folsom, California. Luxury and affordable options. Perfecto Homes Real Estate.",
  },
  "olympus-pointe": {
    title: "Olympus Pointe Roseville CA | Homes for Sale",
    description: "Homes for sale in Olympus Pointe, Roseville CA. Community info, current listings, and expert guidance. Perfecto Homes Real Estate.",
  },
  "el-dorado-hills": {
    title: "Homes for Sale in El Dorado Hills CA",
    description: "Luxury and family homes for sale in El Dorado Hills, California. Explore listings, neighborhood guides, and market data. Perfecto Homes Real Estate.",
  },
  "elk-grove": {
    title: "Homes for Sale in Elk Grove CA | New Construction Available",
    description: "Homes and new construction for sale in Elk Grove, California. From starter homes to new builds. Perfecto Homes Real Estate.",
  },
};

export async function generateStaticParams() {
  const staticSlugs = COMMUNITIES.map((c) => c.slug);
  const cmsSlugs = getCollectionSlugs("communities");
  const allSlugs = [...new Set([...staticSlugs, ...cmsSlugs])];
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const community = COMMUNITIES.find((c) => c.slug === slug);
  const cmsItem = getItemBySlug("communities", slug);
  const seo = COMMUNITY_SEO[slug];

  const title = seo?.title || (cmsItem?.title as string) || `${community?.name || slug} Real Estate`;
  const description = seo?.description || (cmsItem?.metaDescription as string) || `Explore real estate in ${community?.name || slug}. Homes for sale, market info, and community highlights from Perfecto Homes.`;
  const ogImage = community?.image || (cmsItem?.image as string) || `/images/communities/${slug}.jpg`;
  return {
    title,
    description,
    alternates: { canonical: `/communities/${slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${community?.name || slug} real estate` }],
    },
  };
}

const PERU_SLUGS = new Set([
  "ollantaytambo",
  "urubamba",
  "pisac",
  "chinchero",
  "calca",
  "yucay",
  "maras",
  "aguas-calientes",
  "cusco",
  "san-blas",
  "centro-historico",
  "wanchaq",
  "san-sebastian",
  "san-jeronimo",
]);
const PERU_HERO_IMAGES: Record<string, string> = {
  ollantaytambo: "/images/peru/qhispicay/03-ollantaytambo-town-rooftop-view-from-hostal-qhispicay.jpg",
  urubamba: "/images/peru/hatuchay-restaurant.jpg",
  pisac: "/images/peru/pisac.jpg",
  chinchero: "/images/peru/chinchero.jpg",
  calca: "/images/peru/calca.jpg",
  yucay: "/images/peru/yucay.jpg",
  maras: "/images/peru/maras.jpg",
  "aguas-calientes": "/images/peru/aguas-calientes.jpg",
  cusco: "/images/peru/cusco.jpg",
  "centro-historico": "/images/peru/centro-historico.jpg",
  "san-blas": "/images/peru/san-blas.jpg",
  wanchaq: "/images/peru/wanchaq.jpg",
  "san-sebastian": "/images/peru/san-sebastian.jpg",
  "san-jeronimo": "/images/peru/san-jeronimo.jpg",
};

type Fact = { elevation?: string; distance?: string; character?: string; bestFor?: string };
const COMMUNITY_FACTS: Record<string, Fact> = {
  ollantaytambo: { elevation: "2,792 m", distance: "1.5 hr from Cusco", character: "Inca Heritage", bestFor: "Boutique stays · history buyers" },
  urubamba: { elevation: "2,871 m", distance: "1 hr from Cusco", character: "Commercial Hub", bestFor: "Full-time living · expats" },
  pisac: { elevation: "2,972 m", distance: "45 min from Cusco", character: "Market & Wellness", bestFor: "Retreats · creatives" },
  chinchero: { elevation: "3,762 m", distance: "30 min from Cusco", character: "Airport District", bestFor: "Growth investors · land" },
  calca: { elevation: "2,929 m", distance: "1 hr from Cusco", character: "Provincial Capital", bestFor: "Value buyers · long-stay" },
  yucay: { elevation: "2,857 m", distance: "1 hr from Cusco", character: "Royal Heritage", bestFor: "Boutique hotels · estates" },
  maras: { elevation: "3,380 m", distance: "50 min from Cusco", character: "Salt & Soil", bestFor: "Agriculture · agritourism" },
  "aguas-calientes": { elevation: "2,040 m", distance: "4 hr from Cusco", character: "Hospitality Only", bestFor: "Hotel investors" },
  cusco: { elevation: "3,399 m", distance: "Gateway City", character: "UNESCO Capital", bestFor: "Urban living · all segments" },
  "centro-historico": { elevation: "3,399 m", distance: "City Center", character: "Heritage Core", bestFor: "Trophy hospitality" },
  "san-blas": { elevation: "3,400 m", distance: "Old Town", character: "Artisan Quarter", bestFor: "Second homes · expats" },
  wanchaq: { elevation: "3,360 m", distance: "Inner City", character: "Modern Residential", bestFor: "Full-time families" },
  "san-sebastian": { elevation: "3,280 m", distance: "Eastern Cusco", character: "Growing Suburb", bestFor: "Family value" },
  "san-jeronimo": { elevation: "3,250 m", distance: "Eastern Edge", character: "Rural-Urban Mix", bestFor: "Larger lots · growth" },
};

export default async function CommunityPage({ params }: Props) {
  const { slug } = await params;
  const community = COMMUNITIES.find((c) => c.slug === slug);
  const cmsItem = getItemBySlug("communities", slug);

  if (slug === "communities") {
    return <CommunitiesIndex />;
  }

  if (!community && !cmsItem) notFound();

  const name = (cmsItem?.title as string) || community?.name || slug;
  const htmlContent = cmsItem ? await markdownToHtml(cmsItem.content) : null;
  const isPeru = PERU_SLUGS.has(slug);
  const regionLabel = isPeru ? "Cusco · Sacred Valley, Peru" : "Sacramento Area · California";
  const backHref = isPeru ? "/communities/peru" : "/communities";
  const backLabel = isPeru ? "All Sacred Valley" : "All Communities";
  const heroImage = isPeru
    ? PERU_HERO_IMAGES[slug] ?? "/images/hero/peru-landscape.jpg"
    : `/images/communities/${slug}.jpg`;
  const facts = COMMUNITY_FACTS[slug];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-dark text-white overflow-hidden pt-28 pb-16 sm:pb-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/40 to-dark/10" />
        {isPeru && <ChakanaPattern className="absolute inset-0 opacity-[0.07] pointer-events-none text-gold" />}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={backHref} className="text-gold text-sm hover:underline mb-4 inline-block">&larr; {backLabel}</Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold">{name}</h1>
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mt-3">{regionLabel}</p>
        </div>
      </section>

      {/* Quick Facts Strip */}
      {facts && (
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {facts.elevation && (
                <FactCard
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 21l4.5-9 3 5 2-3 4.5 7H5z" /><circle cx="16" cy="6" r="1.6" /></svg>
                  }
                  label="Elevation"
                  value={facts.elevation}
                />
              )}
              {facts.distance && (
                <FactCard
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s-7-7.3-7-12a7 7 0 0114 0c0 4.7-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
                  }
                  label="Location"
                  value={facts.distance}
                />
              )}
              {facts.character && (
                <FactCard
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21V8l9-5 9 5v13M9 21V12h6v9" /></svg>
                  }
                  label="Character"
                  value={facts.character}
                />
              )}
              {facts.bestFor && (
                <FactCard
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14l-5-4.5 6.5-.5L12 3z" /></svg>
                  }
                  label="Best For"
                  value={facts.bestFor}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="bg-white py-16 relative">
        {isPeru && <ChakanaPattern className="absolute inset-0 opacity-[0.025] pointer-events-none text-dark" />}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {htmlContent ? (
                <div
                  className="prose prose-gray max-w-prose prose-headings:font-serif prose-headings:text-dark prose-p:text-medium-gray prose-p:leading-relaxed prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:flex prose-h2:items-center prose-h2:gap-3 prose-h2:before:content-[''] prose-h2:before:block prose-h2:before:w-8 prose-h2:before:h-px prose-h2:before:bg-gold prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-strong:text-dark prose-ul:mt-2 prose-li:text-medium-gray prose-li:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <div>
                  <h2 className="text-xl font-serif font-bold text-dark mb-4">About {name}</h2>
                  <p className="text-medium-gray leading-relaxed mb-6">
                    {name} is one of the vibrant communities in the greater Sacramento area. Contact our team to learn about available properties, market trends, and what makes this neighborhood special.
                  </p>
                  <a
                    href={`tel:${PHONE}`}
                    className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
                  >
                    Call {PHONE}
                  </a>
                </div>
              )}
            </div>
            <aside>
              <ContactForm />
            </aside>
          </div>
        </div>
      </section>

      {/* What you'll find here — feature cards */}
      <section className="bg-light-gray py-16 relative overflow-hidden">
        {isPeru && <ChakanaPattern className="absolute inset-0 opacity-[0.05] pointer-events-none text-gold" />}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-px bg-gold" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold font-semibold">Why {name}</p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dark mb-10 max-w-2xl">
            What you&apos;ll find when you choose {name}.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l9-9 9 9M5 10v10h14V10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20v-6h6v6" /></svg>
              }
              title="Real Estate Range"
              copy={isPeru
                ? "From in-town homes to working farms and view parcels. Inventory turns over slowly — we keep a tight pulse on what comes available."
                : "Single family homes, new construction, and condos at every price point. Local agents who know each pocket of the neighborhood."}
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 22s8-7.6 8-13a8 8 0 10-16 0c0 5.4 8 13 8 13z" /><circle cx="12" cy="9" r="3" /></svg>
              }
              title="Local Lifestyle"
              copy={isPeru
                ? "Markets, food, festivals, and walking pace. The kind of daily rhythm that doesn't exist in most modern cities anymore."
                : "Schools, parks, food scene, and commuter access dialed in. Every community has its own character — we'll match you to the right one."}
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 17l6-6 4 4 8-8" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 7h7v7" /></svg>
              }
              title="Investment Outlook"
              copy={isPeru
                ? "The Chinchero airport opens in 2027 and is already reshaping land prices across the region. Buying ahead matters."
                : "Sacramento growth has been steady — diverse economy, strong rental demand, and infrastructure investment behind every major district."}
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2.2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14 16c1.3-1.2 3-2 5-2 2.8 0 5 1.6 5 3.6" /></svg>
              }
              title="Trusted Local Team"
              copy={isPeru
                ? "Bilingual support, on-the-ground due diligence, and a network of legal partners who handle Peruvian title and water rights."
                : "Licensed California agents who've closed deals in every community we list. Bilingual English and Spanish."}
            />
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-dark text-white py-16 relative overflow-hidden">
        {isPeru && <ChakanaPattern className="absolute inset-0 opacity-[0.06] pointer-events-none text-gold" />}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">Ready to explore {name}?</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Our team handles every step — from the first walk-through to closing day. Reach out when you&apos;re ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call {PHONE}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white hover:text-dark text-white border border-white/20 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Other Communities */}
      <section className="bg-light-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-serif font-bold text-dark mb-8">
            {isPeru ? "Explore the Sacred Valley" : "Explore Other Communities"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isPeru ? (
              Array.from(PERU_SLUGS)
                .filter((s) => s !== slug)
                .slice(0, 6)
                .map((s) => {
                  const label = peruLabel(s);
                  return (
                    <Link
                      key={s}
                      href={`/communities/${s}`}
                      className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-dark"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url('${PERU_HERO_IMAGES[s] ?? "/images/hero/peru-landscape.jpg"}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white text-lg font-semibold">{label}</h3>
                      </div>
                    </Link>
                  );
                })
            ) : (
              COMMUNITIES.filter((c) => c.slug !== slug).slice(0, 6).map((c) => (
                <Link
                  key={c.slug}
                  href={`/communities/${c.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-dark"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('/images/communities/${c.slug}.jpg')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-lg font-semibold">{c.name}</h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FactCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.2em] uppercase text-medium-gray font-semibold">{label}</p>
        <p className="text-dark font-semibold text-sm leading-tight mt-1">{value}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold/40 hover:shadow-sm transition-all">
      <div className="w-11 h-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-base font-serif font-bold text-dark mb-2">{title}</h3>
      <p className="text-sm text-medium-gray leading-relaxed">{copy}</p>
    </div>
  );
}

function ChakanaPattern({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <pattern id="chakana" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter">
            <path d="M75 30 L105 30 L105 50 L125 50 L125 75 L150 75 L150 105 L125 105 L125 130 L105 130 L105 150 L75 150 L75 130 L55 130 L55 105 L30 105 L30 75 L55 75 L55 50 L75 50 Z" />
            <rect x="80" y="80" width="20" height="20" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#chakana)" />
    </svg>
  );
}

function peruLabel(slug: string): string {
  const map: Record<string, string> = {
    ollantaytambo: "Ollantaytambo",
    urubamba: "Urubamba",
    pisac: "Pisac",
    chinchero: "Chinchero",
    calca: "Calca",
    yucay: "Yucay",
    maras: "Maras",
    "aguas-calientes": "Aguas Calientes",
    cusco: "Cusco",
    "centro-historico": "Centro Histórico",
    "san-blas": "San Blas",
    wanchaq: "Wanchaq",
    "san-sebastian": "San Sebastián",
    "san-jeronimo": "San Jerónimo",
  };
  return map[slug] ?? slug;
}

function CommunitiesIndex() {
  return (
    <>
      <section className="bg-dark text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Sacramento Area</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold">Our Communities</h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Explore neighborhoods across the greater Sacramento area. Find the community that fits your lifestyle.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-dark"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url('/images/communities/${c.slug}.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-lg font-semibold">{c.name}</h3>
                  <p className="text-white/70 text-sm mt-1">View community &rarr;</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
