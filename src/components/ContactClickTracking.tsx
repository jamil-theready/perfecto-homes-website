"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ContactClickTracking() {
  const pathname = usePathname();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      let contactMethod: "phone" | "email" | null = null;

      if (href.startsWith("tel:")) contactMethod = "phone";
      if (href.startsWith("mailto:")) contactMethod = "email";
      if (!contactMethod || typeof window.gtag !== "function") return;

      window.gtag("event", "contact_click", {
        contact_method: contactMethod,
        page_path: pathname,
        link_url: href,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}
