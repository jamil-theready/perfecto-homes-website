"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "motion/react";

const TITLE = "Real Estate in Cusco, the Sacred Valley and Sacramento";

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.9,
      delay: 0.1 + i * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function CinematicHero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const words = TITLE.split(" ");

  return (
    <section
      ref={ref}
      className="relative overflow-hidden h-[calc(100vh-160px)] min-h-[560px] max-h-[760px] bg-black"
    >
      <motion.div
        style={{ y: videoY, scale: videoScale }}
        className="absolute inset-0"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero/sacramento-bridge.jpg"
        >
          <source src="/images/hero/hero-video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70"
      />

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute top-0 left-0 right-0 h-[2px] bg-gold origin-left"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative h-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-[60px]"
      >
        <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-[640px] flex flex-col gap-[30px]">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05 }}
              className="text-[11px] tracking-[0.3em] uppercase text-gold font-medium"
            >
              Cusco &nbsp;&middot;&nbsp; Sacred Valley &nbsp;&middot;&nbsp; Sacramento
            </motion.p>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-[-0.06em] text-white">
              <span className="sr-only">{TITLE}</span>
              <span aria-hidden className="flex flex-wrap gap-x-[0.28em] gap-y-1">
                {words.map((w, i) => (
                  <span
                    key={`${w}-${i}`}
                    className="overflow-hidden inline-flex"
                  >
                    <motion.span
                      custom={i}
                      variants={wordVariants}
                      initial="hidden"
                      animate="show"
                      className="inline-block"
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 + words.length * 0.06 + 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-[family-name:var(--font-manrope)] text-white/90 text-[16px] font-semibold leading-[1.5] tracking-[-0.02em] max-w-[460px]"
            >
              Homes, land and hospitality investment in Cusco and the Sacred
              Valley — and full service in Sacramento, California. Bilingual,
              US-licensed, on the ground in both markets.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-[30px] flex-shrink-0"
          >
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
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: cueOpacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/70">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block w-px h-8 bg-gradient-to-b from-white/80 to-transparent"
        />
      </motion.div>
    </section>
  );
}
