"use client";

import { useEffect, useRef, useState } from "react";

const sentences = [
  { before: "We ", highlight: "connect", after: " families with homes that fit their dreams." },
  { before: "We ", highlight: "guide", after: " every step with integrity, clarity, and care." },
  { before: "We turn real estate into a simpler, ", highlight: "stress-free", after: " experience for our community." },
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
        <div className="relative max-w-[1000px] w-full mx-auto px-6 sm:px-8">
          {sentences.map((s, i) => {
            const distance = stage - i;
            let translateY = 0;
            let opacity = 0;

            if (distance <= -1) {
              translateY = 80;
              opacity = 0;
            } else if (distance < 0) {
              const t = distance + 1;
              translateY = 80 * (1 - t);
              opacity = t;
            } else if (distance < 1) {
              translateY = -80 * distance;
              opacity = 1 - distance;
            } else {
              translateY = -80;
              opacity = 0;
            }

            return (
              <p
                key={i}
                className="absolute inset-x-0 text-center text-4xl sm:text-5xl md:text-[64px] lg:text-[72px] font-medium leading-[1.15] tracking-[-0.04em] text-dark"
                style={{
                  transform: `translateY(${translateY}px)`,
                  opacity,
                  transition: "transform 0.4s ease-out, opacity 0.4s ease-out",
                  top: "50%",
                  marginTop: "-1em",
                }}
              >
                {s.before}
                <span className="text-gold">{s.highlight}</span>
                {s.after}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
