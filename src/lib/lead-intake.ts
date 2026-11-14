const LEAD_INTAKE_URL = "https://thereadyconsult.app.n8n.cloud/webhook/perfecto-lead-intake";

type LeadSubmission = {
  formData: FormData;
  formName: string;
  propertyTitle?: string;
  propertySlug?: string;
};

function splitName(value: string) {
  const [firstName = "", ...rest] = value.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

function formValue(formData: FormData, ...names: string[]) {
  for (const name of names) {
    const value = formData.get(name);
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

class LeadValidationError extends Error {}

export function leadSubmissionMessage(error: unknown) {
  return error instanceof LeadValidationError ? error.message :
    "We couldn’t confirm your submission. Please try again. Your details are still here.";
}

function validationMessage(errors: unknown) {
  const text = Array.isArray(errors) ? errors.filter(value => typeof value === "string").join(" ") : "";
  if (/phone.*country code/i.test(text)) return "Please include your country code (for example, +51), or leave the optional phone number blank.";
  if (/phone.*format/i.test(text)) return "Please check your phone number, or leave the optional phone number blank.";
  if (/email/i.test(text)) return "Please enter a valid email address so we can contact you.";
  return "Please check your contact details and try again.";
}

export async function submitLeadIntake({ formData, formName, propertyTitle, propertySlug }: LeadSubmission) {
  const fullName = formValue(formData, "name");
  const split = splitName(fullName);
  const firstName = formValue(formData, "firstName", "first-name") || split.firstName;
  const lastName = formValue(formData, "lastName", "last-name") || split.lastName;
  const propertyInterest = formValue(formData, "property_interest", "property") || propertyTitle || "General / not sure yet";
  const eventId = formValue(formData, "event_id") || crypto.randomUUID();

  const response = await fetch(LEAD_INTAKE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_id: eventId,
      occurred_at: new Date().toISOString(),
      source: "perfecto website — property inquiry",
      first_name: firstName,
      last_name: lastName,
      email: formValue(formData, "email"),
      phone: formValue(formData, "phone"),
      property_slug: propertySlug || "",
      property_interest: propertyInterest,
      message: formValue(formData, "message"),
      language: document.documentElement.lang || "en",
      landing_page: window.location.href,
      form_name: formName,
      utm_source: formValue(formData, "utm_source"),
      utm_medium: formValue(formData, "utm_medium"),
      utm_campaign: formValue(formData, "utm_campaign"),
      utm_content: formValue(formData, "utm_content"),
      utm_term: formValue(formData, "utm_term"),
    }),
  });

  if (!response.ok) throw new Error("Lead intake could not accept the submission.");
  const result = await response.json() as { ok?: boolean; status?: string; errors?: unknown };
  if (result.status === "rejected") throw new LeadValidationError(validationMessage(result.errors));
  if (!result.ok || !["accepted", "duplicate"].includes(result.status || "")) {
    throw new Error("Lead intake returned an unexpected response.");
  }
  // The accepted intake is the lead receipt. Secondary email delivery and
  // thank-you navigation must not decide whether that lead is measured.
  if (result.status === "accepted" && formValue(formData, "access_key")) {
    // Retain the existing email notification without making an already saved
    // lead depend on a second provider. A duplicate receipt never emails again.
    try {
      void fetch("https://api.web3forms.com/submit", {
        method: "POST", body: formData, keepalive: true,
      }).catch(() => {});
    } catch { /* The native intake has already committed this lead. */ }
  }
  if (result.status === "accepted" && window.gtag) {
    const markedTest = /\bTRC PERFECTO (?:(?:LIVE|AUTO|MEASUREMENT|GA4) )?TEST\b|\bTRC TEST ONLY\b/i
      .test(`${firstName} ${lastName} ${formValue(formData, "message")}`) ||
      /@thereadyconsult\.com$/i.test(formValue(formData, "email"));
    // Give the existing consent-aware tag time to send before the caller
    // navigates. Analytics failure must never reject a committed inquiry.
    await new Promise<void>((resolve) => {
      const done = () => { clearTimeout(timer); resolve(); };
      const timer = setTimeout(done, 1200);
      try {
        window.gtag?.("event", "generate_lead", {
          event_id: eventId,
          form_name: formName,
          property: propertySlug || propertyTitle || "general-inquiry",
          test_submission: markedTest ? 1 : 0,
          transport_type: "beacon",
          event_callback: done,
          event_timeout: 1000,
          value: 1,
        });
      } catch {
        done();
      }
    });
  }
}
