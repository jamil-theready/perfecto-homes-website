"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

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

    // Watch for WebinarJam form to appear, then attach Lead event
    const observer = new MutationObserver(() => {
      const form = containerRef.current?.querySelector("form");
      if (form && !form.dataset.pixelAttached) {
        form.dataset.pixelAttached = "true";
        form.addEventListener("submit", () => {
          if (window.fbq) {
            window.fbq("track", "Lead");
          }
        });
      }

      // Also catch button clicks in case form submit doesn't bubble
      const buttons = containerRef.current?.querySelectorAll(
        'button[type="submit"], input[type="submit"], .wj-embed-button'
      );
      buttons?.forEach((btn) => {
        if (!(btn as HTMLElement).dataset.pixelAttached) {
          (btn as HTMLElement).dataset.pixelAttached = "true";
          btn.addEventListener("click", () => {
            if (window.fbq) {
              window.fbq("track", "Lead");
            }
          });
        }
      });
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef} />;
}
