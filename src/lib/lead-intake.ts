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

export async function submitLeadIntake({ formData, formName, propertyTitle, propertySlug }: LeadSubmission) {
  const fullName = formValue(formData, "name");
  const split = splitName(fullName);
  const firstName = formValue(formData, "firstName", "first-name") || split.firstName;
  const lastName = formValue(formData, "lastName", "last-name") || split.lastName;
  const propertyInterest = formValue(formData, "property_interest", "property") || propertyTitle || "General / not sure yet";
  const eventId = crypto.randomUUID();

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
  const result = await response.json() as { ok?: boolean; status?: string };
  if (!result.ok || !["accepted", "duplicate"].includes(result.status || "")) {
    throw new Error("Lead intake returned an unexpected response.");
  }
}
