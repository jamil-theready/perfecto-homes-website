import Image from "next/image";
import { PHONE, PHONE_TEL, EMAIL } from "@/lib/constants";

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
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-dark mb-10">
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
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl">
            <form name="global-contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you">
              <input type="hidden" name="form-name" value="global-contact" />
              <p className="hidden"><label>Don&apos;t fill this out: <input name="bot-field" /></label></p>

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
                className="w-full bg-dark hover:bg-dark/80 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
