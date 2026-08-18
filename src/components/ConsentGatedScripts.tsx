"use client";

import { useEffect, useState } from "react";
import { CONSENT_CHANGED_EVENT, readConsent } from "@/lib/consent";

/**
 * Renders its children only once the visitor has accepted.
 *
 * Google Consent Mode governs Google tags only. Anything else — Meta Pixel, HubSpot,
 * Metricool — ignores it entirely and would set cookies regardless of the banner, so
 * those tags live in here instead of the layout.
 *
 * Note this gates *loading*. A tag already loaded in this page view cannot be unloaded
 * by declining; it stops on the next navigation, and `writeConsent` clears the cookies.
 */
export default function ConsentGatedScripts({
  children,
}: {
  children: React.ReactNode;
}) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const sync = () => setGranted(readConsent()?.analytics === true);
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  return granted ? <>{children}</> : null;
}
