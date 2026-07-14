"use client";

import { useState, useRef, FormEvent } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
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
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      hcaptchaRef.current?.resetCaptcha();
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
        className="bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm whitespace-nowrap disabled:opacity-60"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
