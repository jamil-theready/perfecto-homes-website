"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { appendLeadAttribution } from "@/lib/lead-attribution";
import { submitLeadIntake, leadSubmissionMessage } from "@/lib/lead-intake";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

export default function ContactForm({ className = "" }: { className?: string }) {
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
    try { appendLeadAttribution(data, "contact_form"); } catch { /* Attribution storage is optional. */ }

    try {
      await submitLeadIntake({ formData: data, formName: "contact_form" });
      try {
        window.sessionStorage.setItem("perfecto_lead_context", JSON.stringify({
          form_name: "contact_form", property: String(data.get("property_interest") || "General / not sure yet"),
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
    <form
      onSubmit={handleSubmit}
      className={`bg-light-gray rounded-2xl p-6 sm:p-8 ${className}`}
    >
      <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
      <input type="hidden" name="subject" value="New Contact Form Submission — Perfecto Homes" />
      <input type="hidden" name="from_name" value="Perfecto Homes Website" />
      <input type="checkbox" name="botcheck" className="hidden" />

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-xs font-medium text-dark mb-1.5">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-xs font-medium text-dark mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              placeholder="Last Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-dark mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="you@email.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-medium text-dark mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+51 999 123 456"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
          />
          <p className="mt-1 text-xs text-medium-gray">Optional. Include your country code for calls or WhatsApp.</p>
        </div>

        <div>
          <label htmlFor="property_interest" className="block text-xs font-medium text-dark mb-1.5">
            Which property are you interested in?
          </label>
          <select
            id="property_interest"
            name="property_interest"
            defaultValue=""
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
          >
            <option value="">I’m not sure yet / General inquiry</option>
            <option value="Hostal Qhispicay">Hostal Qhispicay</option>
            <option value="Predio Victoria">Predio Victoria</option>
            <option value="Siete Cuartones 352">Siete Cuartones 352</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-medium text-dark mb-1.5">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="How can we help you?"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <label htmlFor="how_heard" className="block text-sm font-medium text-dark mb-1">How did you hear about us? <span className="font-normal">(optional)</span></label>
          <select id="how_heard" name="how_heard" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"><option value="">Select one</option><option>Google Search or Maps</option><option>Google ad</option><option>Facebook or Instagram</option><option>Friend or referral</option><option>Other</option></select>
        </div>
        {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm disabled:opacity-60"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
