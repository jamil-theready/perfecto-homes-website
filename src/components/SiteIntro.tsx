"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const SEEN_KEY = "ph_intro_seen";
const LONG_HOLD_MS = 1900;
const SHORT_HOLD_MS = 350;

export default function SiteIntro() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const [variant, setVariant] = useState<"long" | "short" | null>(null);

  // Long intro — once per session
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.sessionStorage.getItem(SEEN_KEY);
    if (!seen) {
      setVariant("long");
      window.sessionStorage.setItem(SEEN_KEY, "1");
    }
  }, []);

  // Short transition on route change (after first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setVariant("short");
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {variant === "long" && (
        <LongIntro key="long" onComplete={() => setVariant(null)} />
      )}
      {variant === "short" && (
        <ShortTransition key="short" onComplete={() => setVariant(null)} />
      )}
    </AnimatePresence>
  );
}

function LongIntro({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setExiting(true), LONG_HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ y: "0%" }}
      animate={{ y: exiting ? "-100%" : "0%" }}
      transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] }}
      onAnimationComplete={() => {
        if (exiting) onComplete();
      }}
      className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Chakana motif backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><g stroke='%23C4A94D' stroke-width='1' fill='none' stroke-linejoin='miter'><path d='M85 35 L115 35 L115 60 L140 60 L140 85 L165 85 L165 115 L140 115 L140 140 L115 140 L115 165 L85 165 L85 140 L60 140 L60 115 L35 115 L35 85 L60 85 L60 60 L85 60 Z'/><rect x='92' y='92' width='16' height='16'/></g></svg>\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Gold rule */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-40 sm:w-56 bg-gold origin-center mb-8 z-10"
      />

      {/* Logo + wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-4 z-10"
      >
        <Image
          src="/images/logo/perfecto-logo.svg"
          alt="Perfecto Homes"
          width={40}
          height={32}
          className="w-9 h-7 sm:w-11 sm:h-9"
          priority
        />
        <span className="text-dark text-xl sm:text-3xl font-semibold tracking-[0.18em] sm:tracking-[0.22em]">
          PERFECTO HOMES
        </span>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.95 }}
        className="mt-6 text-gold text-[10px] sm:text-[11px] tracking-[0.4em] uppercase font-semibold z-10"
      >
        Real Estate · Sacramento &amp; Peru
      </motion.p>

      {/* Bottom gold rule */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-40 sm:w-56 bg-gold/60 origin-center mt-8 z-10"
      />
    </motion.div>
  );
}

function ShortTransition({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const t = setTimeout(() => setPhase("out"), SHORT_HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: phase === "in" ? "0%" : "-100%" }}
      transition={{ duration: 0.55, ease: [0.83, 0, 0.17, 1] }}
      onAnimationComplete={() => {
        if (phase === "out") onComplete();
      }}
      className="fixed inset-0 z-[200] bg-white flex items-center justify-center pointer-events-none"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "in" ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-3"
      >
        <Image
          src="/images/logo/perfecto-logo.svg"
          alt=""
          width={24}
          height={20}
          className="w-6 h-5"
        />
        <span className="text-dark text-[11px] tracking-[0.3em] uppercase font-semibold">
          Perfecto Homes
        </span>
      </motion.div>
    </motion.div>
  );
}
