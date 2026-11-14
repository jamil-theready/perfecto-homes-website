const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"] as const;

export function appendLeadAttribution(formData: FormData, formName: string) {
  const storageKey = "trc_lead_first_touch";
  let firstTouch: Record<string, string> | null = null;
  try {
    const saved = sessionStorage.getItem(storageKey);
    const parsed: unknown = saved ? JSON.parse(saved) : null;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      firstTouch = Object.fromEntries(Object.entries(parsed).filter(([, value]) => typeof value === "string"));
    }
  } catch { /* Storage restrictions must never block a customer inquiry. */ }
  const url = new URL(window.location.href);
  const values = Object.fromEntries(KEYS.map((key) => [key, firstTouch?.[key] || url.searchParams.get(key)?.trim() || ""]));
  const firstLandingPage = firstTouch?.first_landing_page || url.pathname;
  const firstReferrer = firstTouch?.first_referrer || document.referrer || "";
  const status = KEYS.some((key) => values[key]) ? "campaign_tagged" : firstReferrer ? "referral" : "direct_or_unknown";
  const attribution = { ...values, attribution_status: status, first_landing_page: firstLandingPage, first_referrer: firstReferrer || "direct_or_unknown", form_name: formName, submission_page: url.pathname };
  if (!firstTouch) {
    try { sessionStorage.setItem(storageKey, JSON.stringify(attribution)); }
    catch { /* Attribution remains available on this submission. */ }
  }
  Object.entries(attribution).forEach(([key, value]) => formData.set(key, value));
  return attribution;
}
