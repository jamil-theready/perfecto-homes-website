"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function GlobalCTAForm() {
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
          window.gtag("event", "generate_lead", { form_name: "global_cta_form" });
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
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl">
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ""} />
        <input type="hidden" name="subject" value="New Contact Form — Perfecto Homes (Global CTA)" />
        <input type="hidden" name="from_name" value="Perfecto Homes Website" />
        <input type="checkbox" name="botcheck" className="hidden" />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-medium-gray mb-1">First Name</label>
            <input type="text" name="first-name" required placeholder="First" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-medium-gray mb-1">Last Name</label>
            <input type="text" name="last-name" required placeholder="Last" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-medium-gray mb-1">Email</label>
          <input type="email" name="email" required placeholder="you@email.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-medium-gray mb-1">Phone Number</label>
          <input type="tel" name="phone" placeholder="(916) 878-7260" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div className="mb-5">
          <label className="block text-xs font-medium text-medium-gray mb-1">Message</label>
          <textarea name="message" rows={3} placeholder="Write us a message!" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm resize-none" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-dark hover:bg-dark/80 text-white font-semibold py-3 rounded-lg transition-colors text-sm disabled:opacity-60"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
