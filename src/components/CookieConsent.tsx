"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CONSENT_OPEN_EVENT,
  isEuLikeTimezone,
  readConsent,
  writeConsent,
} from "@/lib/consent";

/** The site's shared grid shell, so the banner keeps the one-grid left edge. */
const CONTAINER = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
const PRIVACY_HREF = "/privacy-policy";

const COPY = {
  title: "Cookies on this site",
  body: "We use Google Analytics, Metricool, and the Meta Pixel to understand how visitors find and use this site and to measure our advertising.",
  privacy: "Privacy Policy",
  accept: "Accept",
  decline: "Decline",
};

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setBlocking(isEuLikeTimezone());
    if (!readConsent()) setOpen(true);

    // Footer "Cookie Settings" reopens the banner for an existing choice.
    const reopen = () => {
      setBlocking(false);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  // Under a scrim the banner is the only thing on screen, so it takes focus.
  useEffect(() => {
    if (open && blocking) acceptRef.current?.focus();
  }, [open, blocking]);

  const choose = useCallback((analytics: boolean) => {
    writeConsent(analytics);
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <>
      {blocking && <div className="trc-cc-scrim" aria-hidden="true" />}
      <div
        role="dialog"
        aria-modal={blocking}
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-body"
        className="trc-cc"
      >
        <div className={`${CONTAINER} trc-cc__row`}>
          <div>
            <h2 id="cookie-consent-title" className="trc-cc__title">
              {COPY.title}
            </h2>
            <p id="cookie-consent-body" className="trc-cc__body">
              {COPY.body}{" "}
              <Link href={PRIVACY_HREF}>{COPY.privacy}</Link>.
            </p>
          </div>

          <div className="trc-cc__actions">
            <button
              type="button"
              onClick={() => choose(false)}
              className="trc-cc__btn trc-cc__btn--ghost"
            >
              {COPY.decline}
            </button>
            <button
              ref={acceptRef}
              type="button"
              onClick={() => choose(true)}
              className="trc-cc__btn trc-cc__btn--primary"
            >
              {COPY.accept}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
