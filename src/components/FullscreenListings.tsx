"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";

function RegionIntro({
  eyebrow,
  prefix,
  highlight,
}: {
  eyebrow: string;
  prefix: string;
  highlight: string;
}) {
  return (
    <section className="relative bg-white py-24 sm:py-32 overflow-hidden">
      {/* Subtle chakana pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'><g stroke='%23C4A94D' stroke-width='1.2' fill='none' stroke-linejoin='miter'><path d='M75 30 L105 30 L105 50 L125 50 L125 75 L150 75 L150 105 L125 105 L125 130 L105 130 L105 150 L75 150 L75 130 L55 130 L55 105 L30 105 L30 75 L55 75 L55 50 L75 50 Z'/><rect x='80' y='80' width='20' height='20'/></g></svg>\")",
          backgroundSize: "180px 180px",
        }}
      />
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-32 pointer-events-none bg-gradient-to-b from-white to-transparent"
      />
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none bg-gradient-to-t from-white to-transparent"
      />

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
            {eyebrow}
          </p>
          <span className="block w-10 h-px bg-gold" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-[-0.05em] leading-[1.02] text-dark"
        >
          {prefix}{" "}
          <span className="relative inline-block">
            <span
              style={{
                background: "linear-gradient(135deg, #C4A94D 0%, #8a7234 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {highlight}
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
  );
}

type Listing = {
  name: string;
  slug: string;
  image: string;
};

type StatIcon = "land" | "bed" | "bath" | "building" | "location" | "tag" | "users" | "ruler";

type ListingMeta = {
  eyebrow: string;
  tagline: string;
  cta: string;
  stats: { icon: StatIcon; label: string; value: string }[];
};

const META: Record<string, ListingMeta> = {
  "predio-victoria": {
    eyebrow: "Sacred Valley · Cusco",
    tagline:
      "Aerial views, fertile land, and timeless terraces. A working Sacred Valley estate ready for stewardship as a private residence, retreat center, or agricultural venture — minutes from the Urubamba river.",
    cta: "View Predio Victoria",
    stats: [
      { icon: "ruler", label: "Land Area", value: "12 ha" },
      { icon: "location", label: "Region", value: "Sacred Valley" },
      { icon: "tag", label: "Status", value: "Available" },
    ],
  },
  "hostal-qhispicay-ollantaytambo": {
    eyebrow: "Ollantaytambo · Cusco",
    tagline:
      "A boutique hostal at the gateway to Machu Picchu. Steps from the Inca terraces and the morning train, with proven nightly bookings and room to grow into a higher-end stay or wellness concept.",
    cta: "View Hostal Qhispicay",
    stats: [
      { icon: "bed", label: "Rooms", value: "12" },
      { icon: "building", label: "Type", value: "Boutique Hostal" },
      { icon: "location", label: "Area", value: "Ollantaytambo" },
    ],
  },
  "hatuchay-valle-restaurant-urubamba": {
    eyebrow: "Urubamba · Sacred Valley",
    tagline:
      "A storied restaurant in the heart of the valley. Decades of local reputation, a generous courtyard kitchen, and steady tourist foot traffic on the corridor between Cusco and Aguas Calientes.",
    cta: "View Hatuchay Valle",
    stats: [
      { icon: "users", label: "Capacity", value: "120 seats" },
      { icon: "building", label: "Type", value: "Restaurant" },
      { icon: "location", label: "Area", value: "Urubamba" },
    ],
  },
  "11610-vickie-dr": {
    eyebrow: "Marysville · California",
    tagline:
      "A three-bedroom single family home in Marysville with comfortable interiors, a workable lot, and easy access to Sacramento commuter corridors.",
    cta: "View 11610 Vickie Dr",
    stats: [
      { icon: "tag", label: "Price", value: "$635,000" },
      { icon: "bed", label: "Beds", value: "3" },
      { icon: "bath", label: "Baths", value: "3" },
    ],
  },
  "6630-dunmore-ave": {
    eyebrow: "Citrus Heights · California",
    tagline:
      "A four-bedroom home in Citrus Heights — generous living space, established neighborhood, and proximity to schools and the I-80 corridor.",
    cta: "View 6630 Dunmore Ave",
    stats: [
      { icon: "tag", label: "Price", value: "$549,000" },
      { icon: "bed", label: "Beds", value: "4" },
      { icon: "bath", label: "Baths", value: "3" },
    ],
  },
};

function StatIconSvg({ name }: { name: StatIcon }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "land":
    case "ruler":
      return (
        <svg {...props}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
        </svg>
      );
    case "bed":
      return (
        <svg {...props}>
          <path d="M2 17V7" />
          <path d="M2 11h20v6" />
          <circle cx="7" cy="11" r="2" />
          <path d="M11 11V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" />
        </svg>
      );
    case "bath":
      return (
        <svg {...props}>
          <path d="M9 6c0-1.1.9-2 2-2s2 .9 2 2v1" />
          <path d="M3 12h18" />
          <path d="M4 12v4a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-4" />
          <path d="M7 19v2" />
          <path d="M17 19v2" />
        </svg>
      );
    case "building":
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="1" />
          <path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2" />
        </svg>
      );
    case "location":
      return (
        <svg {...props}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "tag":
      return (
        <svg {...props}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
  }
}

function ListingPanel({
  listing,
  index,
  total,
  basePath,
  regionLabel,
}: {
  listing: Listing;
  index: number;
  total: number;
  basePath: string;
  regionLabel: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.0, 1.1]);
  const titleY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -60]);
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.6, 0.85],
    [0, 1, 1, 0]
  );
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.7, 0.45, 0.7]
  );

  const meta: ListingMeta = META[listing.slug] ?? {
    eyebrow: "Peru",
    tagline: listing.name,
    cta: "View Listing",
    stats: [],
  };

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Parallax image layer */}
      <motion.div
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0"
      >
        <Image
          src={listing.image}
          alt={listing.name}
          fill
          priority={index === 0}
          unoptimized={listing.image.startsWith("http")}
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Top vignette (subtle, so eyebrow + counter read) */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 22%, rgba(0,0,0,0) 45%)",
          }}
        />
      </motion.div>

      {/* Strong floor gradient — independent of scroll fade */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[70%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* SVG grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      {/* Index counter top-left */}
      <div className="absolute top-8 sm:top-12 left-6 sm:left-12 z-10 flex items-baseline gap-3 text-white/90">
        <span className="text-[12px] tracking-[0.3em] uppercase font-medium">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-white/40">/</span>
        <span className="text-[12px] tracking-[0.3em] uppercase text-white/40">
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Section label top-right (only on first) */}
      {index === 0 && (
        <div className="absolute top-8 sm:top-12 right-6 sm:right-12 z-10 flex items-center gap-3">
          <span className="block w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-[12px] tracking-[0.3em] uppercase text-white/90 font-medium">
            {regionLabel}
          </span>
        </div>
      )}

      {/* Content — bottom row, left text + right stats */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="absolute bottom-0 left-0 right-0 z-10 px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20"
      >
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          {/* Left — title block */}
          <div className="flex-1 min-w-0 max-w-[760px]">
            <p className="text-[11px] sm:text-[12px] tracking-[0.3em] uppercase text-gold font-medium mb-4">
              {meta.eyebrow}
            </p>
            <h2 className="text-white text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-[-0.05em] leading-[1.0] mb-6">
              {listing.name}
            </h2>
            <p className="text-white/85 text-lg sm:text-xl max-w-[640px] mb-9 leading-[1.55] tracking-[-0.005em]">
              {meta.tagline}
            </p>
            <Link
              href={`${basePath}/${listing.slug}`}
              className="group inline-flex items-center gap-3 bg-white/10 hover:bg-gold text-white px-6 py-3.5 rounded-full backdrop-blur-md border border-white/30 hover:border-gold transition-all duration-300"
            >
              <span className="text-sm font-medium tracking-[-0.01em]">
                {meta.cta}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Right — stats stacked */}
          <div className="flex flex-col items-start lg:items-end gap-5 lg:min-w-[260px]">
            {meta.stats.map((stat, si) => (
              <div
                key={`${stat.label}-${si}`}
                className="flex items-center gap-3 lg:flex-row-reverse lg:text-right"
              >
                <span
                  className="flex items-center justify-center w-11 h-11 rounded-full text-white flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(196,169,77,0.55) 0%, rgba(196,169,77,0.25) 100%)",
                    border: "1px solid rgba(196,169,77,0.7)",
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.06) inset, 0 6px 20px -6px rgba(196,169,77,0.55)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <StatIconSvg name={stat.icon} />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] tracking-[0.22em] uppercase text-gold/90 font-semibold">
                    {stat.label}
                  </span>
                  <span className="text-white text-[16px] font-medium tracking-[-0.01em]">
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll cue (only last) */}
      {index === total - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-6 right-6 sm:right-12 z-10 hidden md:flex items-center gap-3 text-white/70"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">
            Continue
          </span>
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="block w-8 h-px bg-white/60"
          />
        </motion.div>
      )}
    </section>
  );
}

export default function FullscreenListings({
  listings,
  basePath = "/peru",
  sectionId = "peru",
  intro = { eyebrow: "Featured Properties", prefix: "Our Listings in", highlight: "Peru" },
  regionLabel = "International · Peru",
}: {
  listings: Listing[];
  basePath?: string;
  sectionId?: string;
  intro?: { eyebrow: string; prefix: string; highlight: string };
  regionLabel?: string;
}) {
  return (
    <div id={sectionId} className="relative bg-black">
      <RegionIntro
        eyebrow={intro.eyebrow}
        prefix={intro.prefix}
        highlight={intro.highlight}
      />

      {listings.map((listing, i) => (
        <ListingPanel
          key={listing.slug}
          listing={listing}
          index={i}
          total={listings.length}
          basePath={basePath}
          regionLabel={regionLabel}
        />
      ))}
    </div>
  );
}
