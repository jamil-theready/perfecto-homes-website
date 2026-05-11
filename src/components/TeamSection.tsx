"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { TEAM } from "@/lib/constants";

type Member = (typeof TEAM)[number];

function MemberRow({ member, index }: { member: Member; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const isEven = index % 2 === 1;

  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`relative flex flex-col ${
          isEven ? "md:flex-row-reverse" : "md:flex-row"
        } items-center md:items-start gap-10 md:gap-16`}
      >
        {/* Photo column */}
        <div className="relative flex-shrink-0">
          {/* Floating ghost number */}
          <motion.span
            aria-hidden
            style={{ y: ghostY }}
            className={`absolute hidden md:block font-medium text-dark/[0.04] tracking-[-0.05em] leading-none select-none pointer-events-none ${
              isEven ? "-right-6" : "-left-6"
            } -top-12`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span style={{ fontSize: "clamp(180px, 22vw, 280px)" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
          </motion.span>

          {/* Peruvian stepped frame (chakana-inspired) */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 pointer-events-none ${
              isEven ? "translate-x-4 translate-y-4" : "-translate-x-4 -translate-y-4"
            }`}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 280 360"
              preserveAspectRatio="none"
              className="absolute inset-0"
            >
              <path
                d="M 16 0 L 264 0 L 264 16 L 280 16 L 280 344 L 264 344 L 264 360 L 16 360 L 16 344 L 0 344 L 0 16 L 16 16 Z"
                fill="none"
                stroke="#C4A94D"
                strokeWidth="2.5"
              />
            </svg>
          </motion.div>

          {/* Tiny chakana ornament — top corner */}
          <motion.svg
            aria-hidden
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#C4A94D"
            className={`absolute ${isEven ? "-top-3 -left-3" : "-top-3 -right-3"} z-20`}
          >
            <path d="M9 2 L15 2 L15 5 L18 5 L18 9 L21 9 L21 15 L18 15 L18 18 L15 18 L15 21 L9 21 L9 18 L6 18 L6 15 L3 15 L3 9 L6 9 L6 5 L9 5 Z" />
            <rect x="10" y="10" width="4" height="4" fill="white" />
          </motion.svg>

          {/* Tiny chakana ornament — opposite corner */}
          <motion.svg
            aria-hidden
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#C4A94D"
            className={`absolute ${isEven ? "-bottom-3 -right-3" : "-bottom-3 -left-3"} z-20`}
          >
            <path d="M9 2 L15 2 L15 5 L18 5 L18 9 L21 9 L21 15 L18 15 L18 18 L15 18 L15 21 L9 21 L9 18 L6 18 L6 15 L3 15 L3 9 L6 9 L6 5 L9 5 Z" />
            <rect x="10" y="10" width="4" height="4" fill="white" />
          </motion.svg>

          {/* Photo — also gets stepped corners via SVG clip */}
          <div className="relative w-[240px] h-[300px] sm:w-[280px] sm:h-[360px] overflow-hidden bg-light-gray z-10" style={{
            clipPath: "polygon(5% 0%, 95% 0%, 95% 4%, 100% 4%, 100% 96%, 95% 96%, 95% 100%, 5% 100%, 5% 96%, 0% 96%, 0% 4%, 5% 4%)"
          }}>
            <motion.div
              style={{ y: photoY }}
              className="absolute inset-0"
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-top"
                sizes="280px"
              />
            </motion.div>
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Info column */}
        <div className="flex-1 min-w-0 max-w-[600px]">
          {/* Mobile counter */}
          <span className="md:hidden inline-block text-[12px] tracking-[0.3em] text-gold font-semibold mb-2">
            / {String(index + 1).padStart(2, "0")}
          </span>

          <p className="text-[11px] tracking-[0.3em] uppercase text-gold font-semibold mb-3">
            {member.role}
          </p>

          <h3 className="text-4xl sm:text-5xl lg:text-[56px] font-medium text-dark tracking-[-0.04em] leading-[1.05] mb-5">
            {member.name}
          </h3>

          {/* Animated gold rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-[2px] w-16 bg-gold origin-left mb-6"
          />

          <p className="text-medium-gray text-[15px] sm:text-base leading-[1.7] mb-7">
            {member.bio}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <a
              href={member.phoneLink || `tel:${member.phoneTel}`}
              className="inline-flex items-center gap-2 bg-light-gray hover:bg-gold hover:text-white text-dark text-sm font-medium px-4 py-2.5 rounded-full transition-colors group/btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold group-hover/btn:text-white">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {member.phone}
            </a>
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-2 bg-light-gray hover:bg-gold hover:text-white text-dark text-sm font-medium px-4 py-2.5 rounded-full transition-colors group/btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold group-hover/btn:text-white">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {member.email}
            </a>
          </div>

          <Link
            href={`/about/${member.slug}`}
            className="group/more inline-flex items-center gap-2 text-sm text-dark hover:text-gold font-medium border-b border-dark hover:border-gold pb-0.5 transition-colors"
          >
            Learn more about {member.name.split(" ")[0]}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/more:translate-x-1">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section id="team" className="relative bg-white py-24 sm:py-32 overflow-hidden">
      {/* Subtle chakana pattern far in the background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><g stroke='%23C4A94D' stroke-width='1' fill='none' stroke-linejoin='miter'><path d='M95 40 L125 40 L125 65 L150 65 L150 95 L175 95 L175 125 L150 125 L150 150 L125 150 L125 175 L95 175 L95 150 L70 150 L70 125 L45 125 L45 95 L70 95 L70 65 L95 65 Z'/><rect x='102' y='102' width='16' height='16'/></g></svg>\")",
          backgroundSize: "220px 220px",
        }}
      />

      <div className="relative max-w-[1100px] mx-auto px-6 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 sm:mb-28"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="block w-10 h-px bg-gold" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold font-semibold">
              Who We Are
            </p>
            <span className="block w-10 h-px bg-gold" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-medium text-dark tracking-[-0.05em] leading-[1.05]">
            Meet the{" "}
            <span className="relative inline-block">
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #C4A94D 0%, #8a7234 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Perfecto
              </span>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gold origin-left rounded-full"
              />
            </span>{" "}
            Team
          </h2>
        </motion.div>

        {/* Members */}
        <div className="space-y-32 sm:space-y-40">
          {TEAM.map((member, i) => (
            <MemberRow key={member.slug} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
