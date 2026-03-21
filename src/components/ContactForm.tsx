"use client";

import { useState, FormEvent } from "react";

const WEB3FORMS_KEY = "YOUR_ACCESS_KEY";

export default function ContactForm({ className = "" }: { className?: string }) {
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
      <div className={`bg-light-gray rounded-2xl p-8 text-center ${className}`}>
        <h3 className="text-xl font-semibold text-dark mb-2">Thank you!</h3>
        <p className="text-medium-gray">We&apos;ll be in touch shortly.</p>
      </div>
    );
  }

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
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 transition-colors"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 transition-colors"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 transition-colors"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 transition-colors"
          />
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
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 transition-colors resize-none"
          />
        </div>

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
