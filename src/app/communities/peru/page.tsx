import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sacred Valley Communities | Peru | Perfecto Homes",
  description:
    "Get to know the Sacred Valley — Ollantaytambo, Urubamba, and the towns we serve in Cusco, Peru. Living, investing, and visiting in the Andes.",
};

const SACRED_VALLEY = [
  {
    name: "Ollantaytambo",
    slug: "ollantaytambo",
    image: "/images/peru/hostal-ollantaytambo.jpg",
  },
  {
    name: "Urubamba",
    slug: "urubamba",
    image: "/images/peru/hatuchay-restaurant.jpg",
  },
  {
    name: "Pisac",
    slug: "pisac",
    image: "/images/hero/peru-landscape.jpg",
  },
  {
    name: "Chinchero",
    slug: "chinchero",
    image: "/images/hero/peru-landscape.jpg",
  },
  {
    name: "Calca",
    slug: "calca",
    image: "/images/hero/peru-landscape.jpg",
  },
  {
    name: "Yucay",
    slug: "yucay",
    image: "/images/hero/peru-landscape.jpg",
  },
  {
    name: "Maras",
    slug: "maras",
    image: "/images/hero/peru-landscape.jpg",
  },
  {
    name: "Aguas Calientes",
    slug: "aguas-calientes",
    image: "/images/hero/peru-landscape.jpg",
  },
];

const CUSCO_CITY = [
  {
    name: "Cusco",
    slug: "cusco",
    image: "/images/hero/peru-landscape.jpg",
  },
  {
    name: "Centro Histórico",
    slug: "centro-historico",
    image: "/images/hero/peru-landscape.jpg",
  },
  {
    name: "San Blas",
    slug: "san-blas",
    image: "/images/hero/peru-landscape.jpg",
  },
  {
    name: "Wanchaq",
    slug: "wanchaq",
    image: "/images/hero/peru-landscape.jpg",
  },
  {
    name: "San Sebastián",
    slug: "san-sebastian",
    image: "/images/hero/peru-landscape.jpg",
  },
  {
    name: "San Jerónimo",
    slug: "san-jeronimo",
    image: "/images/hero/peru-landscape.jpg",
  },
];

export default function PeruCommunitiesIndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-8 h-px bg-gold" />
            <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase">
              Cusco · Peru
            </p>
            <span className="block w-8 h-px bg-gold" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-medium text-dark tracking-[-0.05em] leading-[1.02]">
            Live in the <span className="text-gold">Sacred Valley</span>
          </h1>
          <p className="mt-6 text-medium-gray text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            The Andean valley between Cusco and Machu Picchu — fertile, storied,
            and steadily growing as Chinchero airport approaches. Explore the
            towns where we work.
          </p>
        </div>
      </section>

      {/* Sacred Valley */}
      <CommunityGrid eyebrow={`Sacred Valley · ${SACRED_VALLEY.length} Towns`} items={SACRED_VALLEY} />

      {/* Cusco City */}
      <CommunityGrid eyebrow={`Cusco City · ${CUSCO_CITY.length} Districts`} items={CUSCO_CITY} bottomPad />
    </>
  );
}

function CommunityGrid({
  eyebrow,
  items,
  bottomPad,
}: {
  eyebrow: string;
  items: { name: string; slug: string; image: string }[];
  bottomPad?: boolean;
}) {
  return (
    <section className={`bg-white ${bottomPad ? "pb-24" : "pb-16"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="block w-1.5 h-1.5 rounded-full bg-gold" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold font-semibold">
            {eyebrow}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c) => (
            <Link
              key={c.slug}
              href={`/communities/${c.slug}`}
              className="group relative block rounded-[18px] overflow-hidden aspect-[16/11] bg-dark"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h2 className="text-white text-2xl sm:text-[28px] font-medium tracking-[-0.04em] leading-[1.05] mb-4">
                  {c.name}
                </h2>
                <span className="inline-flex items-center gap-2 text-white/90 text-sm font-medium border-b border-white/40 group-hover:border-gold group-hover:text-gold pb-1 transition-colors">
                  Explore
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
