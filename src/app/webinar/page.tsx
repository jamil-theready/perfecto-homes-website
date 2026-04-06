import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Free Webinar: How to Buy a Home in Northern California | Perfecto Homes",
  description:
    "Join Alfredo Gonzalez for a free webinar on buying a home in Northern California. Learn about the market, financing options, and a step by step path to homeownership.",
  openGraph: {
    title: "Free Webinar: How to Buy a Home in Northern California",
    description:
      "Join Alfredo Gonzalez for a free webinar on buying a home in Northern California. Learn about the market, financing, and your path to homeownership.",
  },
};

export default function WebinarPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <Image
          src="/images/hero/sacramento-bridge.jpg"
          alt="Northern California landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-bold text-white leading-[1.1] tracking-tight">
                Learn Exactly
                <br />
                How to Buy a Home
                <br />
                in Northern California
              </h1>
              <div className="flex items-center gap-3 mt-8">
                <div className="flex -space-x-2">
                  {[
                    { src: "/images/testimonials/percy-ivy.png", alt: "Percy and Ivy" },
                    { src: "/images/testimonials/lety-moises.png", alt: "Lety and Moises" },
                    { src: "/images/testimonials/ana.png", alt: "Ana" },
                    { src: "/images/testimonials/marcela.png", alt: "Marcela" },
                  ].map((person) => (
                    <div
                      key={person.alt}
                      className="w-10 h-10 rounded-full border-2 border-white bg-white overflow-hidden relative"
                    >
                      <Image
                        src={person.src}
                        alt={person.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center text-dark text-xs font-semibold">
                    +20
                  </div>
                </div>
              </div>
              <p className="text-white/80 text-lg mt-4">
                Helping over 20+ Homeowners in Sacramento.
              </p>

              {/* Host Card */}
              <div className="mt-10 bg-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 max-w-md border border-white/10">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="/images/team/alfredo.png"
                    alt="Alfredo Gonzalez"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">
                    Hosted by Alfredo Gonzalez
                  </p>
                  <p className="text-white/60 text-sm">Host | Loan Officer</p>
                </div>
                <a
                  href="tel:+19168786864"
                  className="ml-auto bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Contact Alfredo →
                </a>
              </div>
            </div>

            {/* Right: WebinarJam Embed */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-2xl font-serif font-bold text-dark mb-2">
                Get a Clear Plan.
              </h2>
              <p className="text-lg text-dark mb-6">Join the Free Webinar.</p>
              <div
                className="wj-embed-wrapper"
                data-webinar-hash="g8o8w6i6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-dark mb-2">
            What we will talk about
          </h2>
          <p className="text-3xl sm:text-4xl font-serif font-bold text-gold mb-12">
            in this Webinar
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-light-gray rounded-2xl p-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-5">
                <svg
                  className="w-5 h-5 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-dark mb-3">
                A Simple Breakdown of the Northern California Market
              </h3>
              <p className="text-medium-gray text-[15px] leading-relaxed">
                No confusing charts. No jargon. Just a clear explanation of
                prices, rates, trends, and what they mean for you.
              </p>
            </div>

            <div className="bg-light-gray rounded-2xl p-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-5">
                <svg
                  className="w-5 h-5 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-dark mb-3">
                A Step by Step Path to Buying Your Home
              </h3>
              <p className="text-medium-gray text-[15px] leading-relaxed">
                We will show you what to do first, what to avoid, and how to
                move forward even if you think you are not ready.
              </p>
            </div>

            <div className="bg-light-gray rounded-2xl p-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-5">
                <svg
                  className="w-5 h-5 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-dark mb-3">
                Financing Made Easy
              </h3>
              <p className="text-medium-gray text-[15px] leading-relaxed">
                Loan officer Alfredo Gonzalez will explain loan options, monthly
                payments, credit requirements, and what you actually need to
                qualify.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/contact/cta-bg.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="relative bg-black/40 py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              Stay Up to Date...
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Subscribe to our newsletter and receive updates on new listings,
              events, news, and more.
            </p>
            <form
              name="webinar-newsletter"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="flex gap-3 max-w-md mx-auto"
            >
              <input
                type="hidden"
                name="form-name"
                value="webinar-newsletter"
              />
              <p className="hidden">
                <label>
                  Don&apos;t fill this out: <input name="bot-field" />
                </label>
              </p>
              <input
                type="email"
                name="email"
                required
                placeholder="perfectohomes@gmail.com"
                className="flex-1 px-5 py-3 rounded-lg text-sm border-0 focus:ring-2 focus:ring-gold"
              />
              <button
                type="submit"
                className="bg-dark hover:bg-dark/80 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* WebinarJam Script */}
      <Script
        src="https://event.webinarjam.com/register/g8o8w6i6/embed-form?formButtonText=Register&formAccentColor=%2329b6f6&formAccentOpacity=0.95&formBgColor=%23ffffff&formBgOpacity=1"
        strategy="lazyOnload"
      />
    </>
  );
}
