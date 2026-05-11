"use client";

import { useEffect, useRef, useState } from "react";

const sentences: { text: string; highlight: string | string[] }[] = [
  { text: "We connect families with homes that fit their dreams.", highlight: "connect" },
  { text: "We guide every step with integrity, clarity, and care.", highlight: "guide" },
  { text: "We turn real estate into a simpler, stress-free experience for our community.", highlight: "stress-free" },
  { text: "One team across Sacramento, California and the Sacred Valley of Peru.", highlight: ["California", "Peru"] },
];

export default function ScrollRevealText() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollableHeight = el.offsetHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const total = sentences.length;
  const stage = progress * total;
  const activeIndex = Math.min(total - 1, Math.max(0, Math.round(stage)));

  return (
    <div
      ref={outerRef}
      className="relative"
      style={{ height: `${total * 175}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center bg-white overflow-hidden">
        {/* Ambient gold gradient blob */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${30 + progress * 40}% ${50 - progress * 10}%, rgba(196,169,77,0.18) 0%, rgba(196,169,77,0.06) 25%, transparent 55%)`,
            transition: "background 0.6s ease-out",
          }}
        />

        {/* Chakana — Andean cross motif, tiled */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.09]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'><g stroke='%23C4A94D' stroke-width='1.2' fill='none' stroke-linejoin='miter'><path d='M75 30 L105 30 L105 50 L125 50 L125 75 L150 75 L150 105 L125 105 L125 130 L105 130 L105 150 L75 150 L75 130 L55 130 L55 105 L30 105 L30 75 L55 75 L55 50 L75 50 Z'/><rect x='80' y='80' width='20' height='20'/><circle cx='15' cy='15' r='1.2' fill='%23C4A94D'/><circle cx='165' cy='15' r='1.2' fill='%23C4A94D'/><circle cx='15' cy='165' r='1.2' fill='%23C4A94D'/><circle cx='165' cy='165' r='1.2' fill='%23C4A94D'/></g></svg>\")",
            backgroundSize: "180px 180px",
          }}
        />

        {/* Ghost numerals — one per sentence, crossfading */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {sentences.map((_, i) => {
            const distance = stage - i;
            let opacity = 0;
            let scale = 0.92;
            if (distance < -0.5) {
              opacity = 0;
              scale = 1.05;
            } else if (distance < 0) {
              const t = (distance + 0.5) / 0.5;
              opacity = 0.06 * t;
              scale = 0.92 + 0.05 * t;
            } else if (distance < 0.5) {
              opacity = 0.06;
              scale = 0.97 + 0.04 * distance;
            } else {
              opacity = 0;
              scale = 1.05;
            }
            return (
              <span
                key={`num-${i}`}
                className="absolute font-medium text-dark tracking-[-0.08em] leading-none select-none"
                style={{
                  fontSize: "clamp(280px, 48vw, 620px)",
                  opacity,
                  transform: `scale(${scale})`,
                  transition: "opacity 0.5s ease-out, transform 0.6s ease-out",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            );
          })}
        </div>

        {/* Top chapter label */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          <span className="block w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-[11px] tracking-[0.3em] uppercase text-medium-gray font-medium">
            Our Promise
          </span>
        </div>

        {/* Step counter top-right */}
        <div className="absolute top-10 right-6 sm:right-10 hidden sm:flex items-baseline gap-2 z-10">
          <span className="text-[11px] tracking-[0.3em] uppercase text-medium-gray font-medium">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-[11px] tracking-[0.3em] text-medium-gray/40">
            /
          </span>
          <span className="text-[11px] tracking-[0.3em] uppercase text-medium-gray/40 font-medium">
            {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Vertical progress rail on right edge */}
        <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3 z-10">
          {sentences.map((_, i) => {
            const isActive = activeIndex === i;
            const isPassed = activeIndex > i;
            return (
              <div key={i} className="flex flex-col items-center gap-3">
                <span
                  className="block transition-all duration-500"
                  style={{
                    width: isActive ? 8 : 6,
                    height: isActive ? 8 : 6,
                    borderRadius: 999,
                    background:
                      isActive || isPassed ? "#C4A94D" : "rgba(0,0,0,0.15)",
                    transform: isActive ? "scale(1.2)" : "scale(1)",
                  }}
                />
                {i < total - 1 && (
                  <span
                    className="block w-px transition-colors duration-500"
                    style={{
                      height: 36,
                      background: isPassed
                        ? "#C4A94D"
                        : "rgba(0,0,0,0.1)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Sentences */}
        <div className="relative max-w-[1100px] w-full mx-auto px-6 sm:px-8 z-10">
          {sentences.map((s, i) => {
            const distance = stage - i;

            let translateY = 0;
            let revealT = 0;
            let sentenceOpacity = 0;

            if (distance < -0.5) {
              translateY = 50;
              revealT = 0;
              sentenceOpacity = 0;
            } else if (distance < 0) {
              const t = (distance + 0.5) / 0.5;
              translateY = 50 * (1 - t);
              revealT = t;
              sentenceOpacity = 1;
            } else if (distance < 0.15) {
              translateY = 0;
              revealT = 1;
              sentenceOpacity = 1;
            } else if (distance < 0.5) {
              const t = (distance - 0.15) / 0.35;
              translateY = -50 * t;
              revealT = 1;
              sentenceOpacity = 1 - t;
            } else {
              translateY = -50;
              revealT = 1;
              sentenceOpacity = 0;
            }

            const words = s.text.split(" ");

            return (
              <p
                key={i}
                className="absolute inset-x-0 text-center text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-medium leading-[1.15] tracking-[-0.05em]"
                style={{
                  transform: `translateY(${translateY}px)`,
                  opacity: sentenceOpacity,
                  transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
                  top: "50%",
                  marginTop: "-1.4em",
                  textWrap: "balance",
                }}
              >
                {words.map((word, w) => {
                  const tStart = w / words.length;
                  const tEnd = (w + 1) / words.length;
                  let wordOpacity = 0.15;
                  if (revealT >= tEnd) wordOpacity = 1;
                  else if (revealT > tStart) {
                    wordOpacity = 0.15 + 0.85 * ((revealT - tStart) / (tEnd - tStart));
                  }
                  const cleaned = word.replace(/[.,]/g, "");
                  const isHighlight = Array.isArray(s.highlight)
                    ? s.highlight.includes(cleaned)
                    : cleaned === s.highlight;
                  return (
                    <span
                      key={w}
                      style={{
                        opacity: wordOpacity,
                        color: isHighlight ? "#C4A94D" : "#0e0e0e",
                        transition: "opacity 0.2s ease-out",
                      }}
                    >
                      {word}
                      {w < words.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
