import Image from "next/image";
import { PHONE, PHONE_TEL, EMAIL } from "@/lib/constants";
import GlobalCTAForm from "./GlobalCTAForm";

export default function GlobalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#f5f0e8]">
      {/* Background image */}
      <Image
        src="/images/contact/cta-bg.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Headline + Contact Info */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dark mb-10">
              Don&apos;t wait.<br />
              Contact us, today.
            </h2>
            <div className="space-y-3">
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {PHONE}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 text-dark/70 hover:text-gold transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {EMAIL}
              </a>
            </div>
          </div>

          {/* Right — Contact Form */}
          <GlobalCTAForm />
        </div>
      </div>
    </section>
  );
}
