"use client";

import { useState, FormEvent } from "react";

export default function ContactForm({ className = "" }: { className?: string }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
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
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className={`bg-light-gray rounded-2xl p-6 sm:p-8 ${className}`}
    >
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>

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
          className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
