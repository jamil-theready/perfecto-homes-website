"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";
const HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

export default function ContactForm({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const hcaptchaRef = useRef<HCaptcha>(null);
  const formDataRef = useRef<FormData | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    formDataRef.current = new FormData(e.currentTarget);
    hcaptchaRef.current?.execute();
  };

  const handleVerify = async (token: string) => {
    const data = formDataRef.current;
    if (!data) return;
    data.append("h-captcha-response", token);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        router.push("/thank-you");
      } else {
        alert("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    } finally {
      hcaptchaRef.current?.resetCaptcha();
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
            placeholder="(555) 123-4567"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors"
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
            placeholder="How can we help you?"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-dark placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-colors resize-none"
          />
        </div>

        <HCaptcha
          sitekey={HCAPTCHA_SITEKEY}
          size="invisible"
          reCaptchaCompat={false}
          onVerify={handleVerify}
          onError={() => setLoading(false)}
          onExpire={() => setLoading(false)}
          ref={hcaptchaRef}
        />

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
