"use client";

import { useState, FormEvent } from "react";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.currentTarget);

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
      <div className="text-center">
        <p className="text-white text-lg font-semibold">You are subscribed!</p>
        <p className="text-gray-300 text-sm mt-1">We will keep you updated.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ""} />
      <input type="hidden" name="subject" value="New Newsletter Subscriber — Perfecto Homes" />
      <input type="hidden" name="from_name" value="Perfecto Homes Website" />
      <input type="checkbox" name="botcheck" className="hidden" />
      <input
        type="email"
        name="email"
        required
        placeholder="you@email.com"
        className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 text-sm focus:border-gold transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm whitespace-nowrap disabled:opacity-60"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
