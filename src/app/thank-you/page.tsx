import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for contacting Perfecto Homes Real Estate. We will be in touch shortly.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-white py-20">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Checkmark */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-dark mb-4">
          Thank You!
        </h1>
        <p className="text-medium-gray leading-relaxed mb-8">
          Your message has been received. One of our team members will be in touch with you shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
          >
            Back to Home
          </Link>
          <Link
            href="/communities/communities"
            className="border border-dark rounded-full px-8 py-3 text-sm font-semibold text-dark hover:bg-dark hover:text-white transition-colors"
          >
            Explore Communities
          </Link>
        </div>
      </div>
    </section>
  );
}
