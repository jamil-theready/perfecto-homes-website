"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const SEEN_KEY = "ph_intro_seen";
const LONG_HOLD_MS = 2800;
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
  const [locationIdx, setLocationIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(onComplete, LONG_HOLD_MS);
    return () => clearTimeout(t);
  }, [onComplete]);

  useEffect(() => {
    const t = setTimeout(() => setLocationIdx(1), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Soft gold glow behind logo */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 45% 35% at center, rgba(196, 169, 77, 0.10) 0%, transparent 65%)",
        }}
      />

      {/* Center stack */}
      <div className="relative flex flex-col items-center z-10 px-6">
        {/* Logo — the centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/logo/perfecto-logo.svg"
            alt="Perfecto Homes"
            width={200}
            height={160}
            className="w-36 h-auto sm:w-48"
            priority
          />
        </motion.div>

        {/* Letter-by-letter wordmark */}
        <div className="mt-8 flex items-center justify-center" aria-label={WORDMARK}>
          {WORDMARK.split("").map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.5,
                delay: 0.5 + i * 0.035,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-dark text-lg sm:text-2xl font-semibold tracking-[0.22em] sm:tracking-[0.28em] inline-block"
              style={{ minWidth: char === " " ? "0.4em" : undefined }}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </div>

        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
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
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-gold text-[10px] sm:text-[11px] tracking-[0.4em] uppercase font-semibold absolute"
            >
              {LOCATIONS[locationIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-px bg-dark/10 overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: LONG_HOLD_MS / 1000, ease: "linear" }}
          className="h-full bg-gold origin-left"
        />
      </div>

      {/* Bottom small tag */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-medium-gray text-[9px] tracking-[0.4em] uppercase"
      >
        Est. 2010
      </motion.p>
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
