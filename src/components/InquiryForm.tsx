"use client";

import { useState, FormEvent } from "react";

interface InquiryFormProps {
  propertyTitle: string;
  slug: string;
}

export default function InquiryForm({ propertyTitle, slug }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <h3 className="text-lg font-semibold text-dark mb-2">Thank you!</h3>
        <p className="text-sm text-medium-gray">We&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ""} />
      <input type="hidden" name="subject" value={`Property Inquiry — ${propertyTitle}`} />
      <input type="hidden" name="from_name" value="Perfecto Homes Website" />
      <input type="hidden" name="property" value={propertyTitle} />
      <input type="hidden" name="listing_slug" value={slug} />
      <input type="checkbox" name="botcheck" className="hidden" />

      <input type="text" name="name" required placeholder="First and Last Name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2" />
      <input type="email" name="email" required placeholder="your@email.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2" />
      <input type="tel" name="phone" placeholder="(916) 878-7260" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2" />
      <textarea name="message" rows={2} placeholder="Tell us about your interest in this property" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 resize-none" />
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
