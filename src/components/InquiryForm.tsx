"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface InquiryFormProps {
  propertyTitle: string;
  slug: string;
}

export default function InquiryForm({ propertyTitle, slug }: InquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
          window.gtag("event", "generate_lead", { form_name: "inquiry_form", property: propertyTitle });
        }
        router.push("/thank-you");
      } else {
        alert("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
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
