"use client";

import { useEffect, useRef, useState } from "react";

const sentences = [
  { before: "We ", highlight: "connect", after: " families with homes that fit their dreams." },
  { before: "We ", highlight: "guide", after: " every step with integrity, clarity, and care." },
  { before: "We turn real estate into a simpler, ", highlight: "stress-free", after: " experience for our community." },
];

export default function ScrollRevealText() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollableHeight = el.offsetHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      let count = 0;
      if (progress > 0.05) count = 1;
      if (progress > 0.35) count = 2;
      if (progress > 0.65) count = 3;

      setRevealedCount(count);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={outerRef}
      className="relative"
      style={{ height: "250vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center bg-white">
        <div className="max-w-[600px] mx-auto px-6 sm:px-8 text-center flex flex-col gap-6">
          {sentences.map((s, i) => (
            <p
              key={i}
              className="text-2xl sm:text-3xl md:text-[36px] font-medium leading-[1.3] tracking-[-0.04em] transition-colors duration-700 ease-out"
              style={{
                color: i < revealedCount ? "#0e0e0e" : "#e0e0e0",
              }}
            >
              {s.before}
              <span style={{ color: i < revealedCount ? "#C4A94D" : "#e0e0e0", transition: "color 0.7s ease-out" }}>{s.highlight}</span>
              {s.after}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
