"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { appendLeadAttribution } from "@/lib/lead-attribution";
import { submitLeadIntake, leadSubmissionMessage } from "@/lib/lead-intake";

interface InquiryFormProps {
  propertyTitle: string;
  slug: string;
}

export default function InquiryForm({ propertyTitle, slug }: InquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submissionId = useRef<string | null>(null);
  const sending = useRef(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    submissionId.current ||= crypto.randomUUID();
    data.set("event_id", submissionId.current);
    try { appendLeadAttribution(data, "property_inquiry_form"); } catch { /* Attribution storage is optional. */ }

    try {
      await submitLeadIntake({
        formData: data,
        formName: "property_inquiry_form",
        propertyTitle,
        propertySlug: slug,
      });
      try {
        window.sessionStorage.setItem("perfecto_lead_context", JSON.stringify({
          form_name: "property_inquiry_form", property: propertyTitle,
        }));
      } catch { /* Optional thank-you context must not reject a saved lead. */ }
      router.push("/thank-you");
    } catch (cause) {
      setError(leadSubmissionMessage(cause));
    } finally {
      sending.current = false;
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ""} />
      <input type="hidden" name="subject" value={`Property Inquiry — ${propertyTitle} — Perfecto Homes`} />
      <input type="hidden" name="from_name" value="Perfecto Homes Website" />
      <input type="hidden" name="property" value={propertyTitle} />
      <input type="hidden" name="listing_slug" value={slug} />
      <input type="checkbox" name="botcheck" className="hidden" />

      <input type="text" name="name" required placeholder="First and Last Name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2" />
      <input type="email" name="email" required placeholder="your@email.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2" />
      <input type="tel" name="phone" placeholder="+51 999 123 456" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2" />
      <p className="mt-1 mb-2 text-xs text-medium-gray">Optional. Include your country code for calls or WhatsApp.</p>
      <textarea name="message" rows={2} placeholder="Tell us about your interest in this property" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 resize-none" />
      <select name="how_heard" aria-label="How did you hear about us?" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3"><option value="">How did you hear about us? (optional)</option><option>Google Search or Maps</option><option>Google ad</option><option>Facebook or Instagram</option><option>Friend or referral</option><option>Other</option></select>
      {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-2.5 rounded-lg transition-colors text-sm disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
