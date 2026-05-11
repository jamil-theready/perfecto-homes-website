"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const SEEN_KEY = "ph_intro_seen";
const LONG_HOLD_MS = 4200;
const SHORT_HOLD_MS = 350;

export default function SiteIntro() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const [variant, setVariant] = useState<"long" | "short" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.sessionStorage.getItem(SEEN_KEY);
    if (!seen) {
      setVariant("long");
      window.sessionStorage.setItem(SEEN_KEY, "1");
    }
  }, []);

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

const WORDMARK = "PERFECTO HOMES";
const LOCATIONS = ["SACRAMENTO · CALIFORNIA", "CUSCO · SACRED VALLEY"];

function LongIntro({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);
  const [locationIdx, setLocationIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setExiting(true), LONG_HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLocationIdx(1), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
      onAnimationComplete={() => {
        if (exiting) onComplete();
      }}
      style={{ backgroundColor: "#0a0a08" }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
    >
      {/* Animated chakana grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'><g stroke='%23C4A94D' stroke-width='0.8' fill='none' stroke-linejoin='miter' opacity='0.18'><path d='M105 45 L135 45 L135 70 L160 70 L160 105 L185 105 L185 135 L160 135 L160 160 L135 160 L135 185 L105 185 L105 160 L80 160 L80 135 L55 135 L55 105 L80 105 L80 70 L105 70 Z'/><rect x='112' y='112' width='16' height='16'/></g></svg>\")",
          backgroundSize: "240px 240px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Animated radial glow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at center, rgba(196, 169, 77, 0.18) 0%, transparent 60%)",
        }}
      />

      {/* Center stack */}
      <div className="relative flex flex-col items-center z-10 px-6">
        {/* Drawn chakana */}
        <DrawnChakana />

        {/* Logo with fade-up */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex items-center gap-4"
        >
          <Image
            src="/images/logo/perfecto-logo.svg"
            alt="Perfecto Homes"
            width={40}
            height={32}
            className="w-9 h-7 sm:w-10 sm:h-8 brightness-0 invert"
            priority
          />
        </motion.div>

        {/* Letter-by-letter wordmark */}
        <div className="mt-5 flex items-center justify-center" aria-label={WORDMARK}>
          {WORDMARK.split("").map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.65,
                delay: 1.5 + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-white text-lg sm:text-2xl font-semibold tracking-[0.22em] sm:tracking-[0.28em] inline-block"
              style={{ minWidth: char === " " ? "0.4em" : undefined }}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </div>

        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 2.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 h-px w-32 sm:w-44 bg-gradient-to-r from-transparent via-gold to-transparent origin-center"
        />

        {/* Cycling location */}
        <div className="mt-6 h-5 relative w-full max-w-sm flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={locationIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-gold text-[10px] sm:text-[11px] tracking-[0.4em] uppercase font-semibold absolute"
            >
              {LOCATIONS[locationIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-px bg-white/10 overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: exiting ? 1 : 0.92 }}
          transition={{
            duration: exiting ? 0.4 : (LONG_HOLD_MS - 200) / 1000,
            ease: exiting ? "easeOut" : "linear",
          }}
          className="h-full bg-gold origin-left"
        />
      </div>

      {/* Bottom small tag */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-[9px] tracking-[0.4em] uppercase"
      >
        Est. 2010
      </motion.p>
    </motion.div>
  );
}

function DrawnChakana() {
  return (
    <motion.svg
      width="140"
      height="140"
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden
      className="text-gold"
      initial={{ opacity: 0, scale: 0.92, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer chakana shape — drawn with stroke animation */}
      <motion.path
        d="M105 45 L135 45 L135 70 L160 70 L160 105 L185 105 L185 135 L160 135 L160 160 L135 160 L135 185 L105 185 L105 160 L80 160 L80 135 L55 135 L55 105 L80 105 L80 70 L105 70 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
      />
      {/* Inner square */}
      <motion.rect
        x="112"
        y="112"
        width="16"
        height="16"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.0, delay: 1.6, ease: [0.65, 0, 0.35, 1] }}
      />
      {/* Center dot — appears after */}
      <motion.circle
        cx="120"
        cy="120"
        r="3"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 2.4, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformOrigin: "120px 120px" }}
      />
      {/* Pulsing aura */}
      <motion.circle
        cx="120"
        cy="120"
        r="6"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        initial={{ scale: 1, opacity: 0 }}
        animate={{
          scale: [1, 4, 1],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 2.2,
          delay: 2.8,
          repeat: Infinity,
          ease: "easeOut",
        }}
        style={{ transformOrigin: "120px 120px" }}
      />
    </motion.svg>
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
