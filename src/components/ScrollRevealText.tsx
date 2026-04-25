"use client";

import { useEffect, useRef, useState } from "react";

const sentences = [
  { text: "We connect families with homes that fit their dreams.", highlight: "connect" },
  { text: "We guide every step with integrity, clarity, and care.", highlight: "guide" },
  { text: "We turn real estate into a simpler, stress-free experience for our community.", highlight: "stress-free" },
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

  return (
    <div
      ref={outerRef}
      className="relative"
      style={{ height: `${total * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center bg-white overflow-hidden">
        <div className="relative max-w-[900px] w-full mx-auto px-6 sm:px-8">
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
                className="absolute inset-x-0 text-center text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-medium leading-[1.25] tracking-[-0.04em]"
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
                  const isHighlight = cleaned === s.highlight;
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
