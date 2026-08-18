/**
 * Google Consent Mode v2 wiring, shared by the head bootstrap and the banner UI.
 *
 * Two layers, deliberately separate:
 *   1. Enforcement — the `region` array below is handed to gtag, and Google resolves
 *      the visitor's region server-side from IP. This is what actually decides whether
 *      cookies get written, so a wrong client-side guess cannot cause a compliance gap.
 *   2. Presentation — `isEuLikeTimezone()` only picks which banner *style* to show.
 *      Wrong guess means the wrong chrome, never the wrong behaviour.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = "trc-consent-v1";

/** Fired on `window` to reopen the banner from the footer link. */
export const CONSENT_OPEN_EVENT = "trc:cookie-settings";

/** Fired on `window` whenever a choice is recorded, so gated scripts can react. */
export const CONSENT_CHANGED_EVENT = "trc:consent-changed";

/** EEA + UK + Switzerland. Consent defaults to denied for these regions. */
export const CONSENT_DENIED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

export type ConsentRecord = { analytics: boolean; ts: number; v: 1 };

/**
 * Inline script for the document head. Runs before any Next.js code, so the consent
 * defaults are in place before the GA4 tag loads.
 *
 * This must be rendered as a raw <script> in <head>, NOT via next/script with
 * strategy="beforeInteractive": an inline beforeInteractive Script is serialised into
 * the RSC payload and only executes at hydration, which lets GA4 fire first.
 *
 * It also re-applies a stored choice here rather than waiting for React to mount —
 * otherwise a returning visitor who declined would still have their first pageview
 * measured under the granted default before the banner component hydrated.
 */
export function consentBootstrap(): string {
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){window.dataLayer.push(arguments);}",
    "window.gtag=gtag;",
    "gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted',functionality_storage:'granted',security_storage:'granted'});",
    `gtag('consent','default',{region:${JSON.stringify(CONSENT_DENIED_REGIONS)},ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`,
    `try{var s=JSON.parse(window.localStorage.getItem('${CONSENT_KEY}')||'null');`,
    "if(s&&typeof s.analytics==='boolean'){var v=s.analytics?'granted':'denied';",
    "gtag('consent','update',{ad_storage:v,ad_user_data:v,ad_personalization:v,analytics_storage:v});}}catch(e){}",
  ].join("");
}

export function readConsent(): ConsentRecord | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    return typeof parsed?.analytics === "boolean" ? parsed : null;
  } catch {
    // Private-mode Safari throws on localStorage. Treat as "no choice recorded".
    return null;
  }
}

/**
 * Consent Mode stops GA writing *new* cookies but never clears existing ones. Under the
 * opt-out model GA has already run by the time a visitor declines, so without this the
 * `_ga` cookies from that first pageview would survive the decline indefinitely.
 */
function clearAnalyticsCookies(): void {
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n.startsWith("_ga") || n === "_gid");
  if (!names.length) return;

  const host = window.location.hostname;
  const parts = host.split(".");
  const scopes = ["", `domain=${host};`, `domain=.${host};`];
  if (parts.length > 2) scopes.push(`domain=.${parts.slice(-2).join(".")};`);

  for (const name of names) {
    for (const scope of scopes) {
      document.cookie = `${name}=; path=/; ${scope} expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
}

export function writeConsent(analytics: boolean): void {
  const value: ConsentRecord = { analytics, ts: Date.now(), v: 1 };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    // Choice still applies to this page view even if we cannot persist it.
  }
  const v = analytics ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_storage: v,
    ad_user_data: v,
    ad_personalization: v,
    analytics_storage: v,
  });
  if (!analytics) clearAnalyticsCookies();
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT));
}

/** Rough EEA/UK check used only to decide banner styling. No network call. */
export function isEuLikeTimezone(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    return /^(Europe|Atlantic\/(Canary|Madeira|Faroe|Azores))/.test(tz);
  } catch {
    return false;
  }
}
