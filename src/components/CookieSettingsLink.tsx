"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

/** Reopens the consent banner so a visitor can change a recorded choice. */
export default function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT))}
      className={className}
    >
      Cookie Settings
    </button>
  );
}
