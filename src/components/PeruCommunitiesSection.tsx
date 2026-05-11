"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

const PERU_COMMUNITIES = [
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
];

export default function PeruCommunitiesSection() {
  return (
    <>
      {/* Intro */}
      <section className="relative bg-white py-24 sm:py-32 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'><g stroke='%23C4A94D' stroke-width='1.2' fill='none' stroke-linejoin='miter'><path d='M75 30 L105 30 L105 50 L125 50 L125 75 L150 75 L150 105 L125 105 L125 130 L105 130 L105 150 L75 150 L75 130 L55 130 L55 105 L30 105 L30 75 L55 75 L55 50 L75 50 Z'/><rect x='80' y='80' width='20' height='20'/></g></svg>\")",
            backgroundSize: "180px 180px",
          }}
        />
        <div aria-hidden className="absolute top-0 inset-x-0 h-32 pointer-events-none bg-gradient-to-b from-white to-transparent" />
        <div aria-hidden className="absolute bottom-0 inset-x-0 h-32 pointer-events-none bg-gradient-to-t from-white to-transparent" />

        <div className="relative max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-7"
          >
            <span className="block w-10 h-px bg-gold" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold font-semibold">
              Cusco · Peru
            </p>
            <span className="block w-10 h-px bg-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[88px] font-medium tracking-[-0.05em] leading-[1.02] text-dark"
          >
            Our Communities in{" "}
            <span className="relative inline-block">
              <span
                style={{
                  background: "linear-gradient(135deg, #C4A94D 0%, #8a7234 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Peru
              </span>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gold origin-left rounded-full"
              />
            </span>
          </motion.h2>
        </div>
      </section>

      {/* Cards */}
      <section className="bg-white pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PERU_COMMUNITIES.map((c) => (
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
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                  <h3 className="text-white text-[34px] sm:text-[40px] font-medium tracking-[-0.04em] leading-[1.05] mb-5">
                    {c.name}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-white/90 text-sm font-medium border-b border-white/40 group-hover:border-gold group-hover:text-gold pb-1 transition-colors">
                    Explore town
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
