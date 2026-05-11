import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { COMMUNITIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sacramento Communities | Explore Neighborhoods",
  description:
    "Explore the Sacramento area community by community. Citrus Heights, Folsom, Roseville, El Dorado Hills, Elk Grove and more — local insight from Perfecto Homes.",
};

export default function CommunitiesIndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-8 h-px bg-gold" />
            <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase">
              Sacramento Area
            </p>
            <span className="block w-8 h-px bg-gold" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-medium text-dark tracking-[-0.05em] leading-[1.02]">
            Find Your Corner of <span className="text-gold">Sacramento</span>
          </h1>
          <p className="mt-6 text-medium-gray text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From the riverfront downtown to the rolling hills of El Dorado, get
            to know every neighborhood we serve — schools, character, and what
            it&apos;s like to live there.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-white pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-1.5 h-1.5 rounded-full bg-gold" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold font-semibold">
              {COMMUNITIES.length} Neighborhoods
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="group relative block rounded-[18px] overflow-hidden aspect-[4/5] bg-dark"
              >
                <Image
                  src={c.image}
                  alt={`Homes in ${c.name}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h2 className="text-white text-[22px] font-medium tracking-[-0.03em] leading-[1.05] mb-4">
                    {c.name}
                  </h2>
                  <span className="inline-flex items-center gap-2 text-white/90 text-sm font-medium border-b border-white/40 group-hover:border-gold group-hover:text-gold pb-1 transition-colors">
                    Explore neighborhood
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
    </>
  );
}
