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

    const wrapper = containerRef.current;

    // Inject the exact HTML WebinarJam expects: script inside .wj-embed-wrapper
    wrapper.innerHTML =
      '<div class="wj-embed-wrapper" data-webinar-hash="g8o8w6i6"></div>';

    const wjDiv = wrapper.querySelector(".wj-embed-wrapper");
    if (!wjDiv) return;

    const script = document.createElement("script");
    script.src =
      "https://event.webinarjam.com/register/g8o8w6i6/embed-form?formButtonText=Register&formAccentColor=%2329b6f6&formAccentOpacity=0.95&formBgColor=%23ffffff&formBgOpacity=1";
    // Use synchronous loading so the script finds the wrapper immediately
    script.async = false;
    wjDiv.appendChild(script);

    // Watch for WebinarJam form/iframe to appear, then attach Lead event
    const observer = new MutationObserver(() => {
      const iframes = wrapper.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        if (!iframe.dataset.pixelAttached) {
          iframe.dataset.pixelAttached = "true";
          iframe.addEventListener("load", () => {
            if (window.fbq) {
              window.fbq("track", "Lead");
            }
          });
        }
      });

      const buttons = wrapper.querySelectorAll(
        'button[type="submit"], input[type="submit"], .wj-embed-button'
      );
      buttons.forEach((btn) => {
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

    observer.observe(wrapper, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef} style={{ minHeight: 400 }} />;
}
