"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function SacramentoIntro() {
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
        {/* Eyebrow */}
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

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-[-0.05em] leading-[1.02] text-dark"
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

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/communities"
            className="group inline-flex items-center gap-2 bg-white hover:bg-gold hover:text-white hover:border-gold text-dark border border-dark/15 font-semibold px-7 py-3 rounded-full transition-colors text-sm shadow-sm"
          >
            View all communities
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
