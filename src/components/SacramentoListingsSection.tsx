"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

const SACRAMENTO_LISTINGS = [
  {
    slug: "11610-vickie-dr",
    title: "11610 Vickie Dr",
    city: "Marysville, CA",
    price: "$635,000",
    beds: 3,
    baths: 3,
    image:
      "https://res.cloudinary.com/duwsn5ksy/image/upload/w_1200,q_auto,f_auto/listings/perfecto-homes/11610-vickie-dr/1",
  },
  {
    slug: "6236-riverbelle-ct",
    title: "6236 Riverbelle Ct",
    city: "Rio Linda, CA",
    price: "$480,000",
    beds: 3,
    baths: 2,
    image:
      "https://res.cloudinary.com/duwsn5ksy/image/upload/w_1200,q_auto,f_auto/listings/perfecto-homes/6236-riverbelle-ct/1",
  },
  {
    slug: "6630-dunmore-ave",
    title: "6630 Dunmore Ave",
    city: "Citrus Heights, CA",
    price: "$549,000",
    beds: 4,
    baths: 3,
    image:
      "https://res.cloudinary.com/duwsn5ksy/image/upload/w_1200,q_auto,f_auto/listings/perfecto-homes/6630-dunmore-ave/1",
  },
];

export default function SacramentoListingsSection() {
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
              Sacramento Area · California
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
            Our Listings in{" "}
            <span className="relative inline-block">
              <span
                style={{
                  background: "linear-gradient(135deg, #C4A94D 0%, #8a7234 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Sacramento
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

      {/* Listings grid */}
      <section className="bg-white pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SACRAMENTO_LISTINGS.map((l) => (
              <Link
                key={l.slug}
                href={`/listings/${l.slug}`}
                className="group block rounded-[18px] overflow-hidden bg-light-gray hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] transition-shadow duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={l.image}
                    alt={l.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-dark text-[11px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
                    Active
                  </span>
                  <span className="absolute bottom-4 left-4 bg-gold text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                    {l.price}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-[22px] font-medium text-dark tracking-[-0.03em] leading-[1.15] mb-1 group-hover:text-gold transition-colors">
                    {l.title}
                  </h3>
                  <p className="text-medium-gray text-sm mb-5">{l.city}</p>
                  <div className="flex items-center gap-5 text-sm text-medium-gray border-t border-gray-200 pt-4">
                    <span className="flex items-center gap-1.5">
                      <span className="text-gold font-semibold">{l.beds}</span>
                      <span>beds</span>
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-gold font-semibold">{l.baths}</span>
                      <span>baths</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 bg-dark text-white text-sm font-medium px-7 py-3.5 rounded-full hover:bg-gold transition-colors"
            >
              View All Sacramento Listings
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
