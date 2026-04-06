"use client";

import { useEffect, useRef } from "react";

export default function WebinarEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous content
    containerRef.current.innerHTML = "";

    // Create the wrapper div WebinarJam expects
    const wrapper = document.createElement("div");
    wrapper.className = "wj-embed-wrapper";
    wrapper.setAttribute("data-webinar-hash", "g8o8w6i6");

    // Inject the script inside the wrapper (how WebinarJam expects it)
    const script = document.createElement("script");
    script.src =
      "https://event.webinarjam.com/register/g8o8w6i6/embed-form?formButtonText=Register&formAccentColor=%2329b6f6&formAccentOpacity=0.95&formBgColor=%23ffffff&formBgOpacity=1";
    script.async = true;

    wrapper.appendChild(script);
    containerRef.current.appendChild(wrapper);
  }, []);

  return <div ref={containerRef} />;
}
