"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

interface InquiryFormProps {
  propertyTitle: string;
  slug: string;
}

export default function InquiryForm({ propertyTitle, slug }: InquiryFormProps) {
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
        className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-2.5 rounded-lg transition-colors text-sm disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
