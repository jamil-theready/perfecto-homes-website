import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Perfecto Homes Real Estate terms of service. Review our website usage terms and conditions.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-dark text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">Terms of Service</h1>
          <p className="mt-3 text-gray-400 text-sm">Last updated: March 2026</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Acceptance of Terms</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            By accessing and using the Perfecto Homes Real Estate website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Use of Website</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            This website is provided for informational purposes about real estate services and property listings. All content, including text, images, and data, is the property of Perfecto Homes Real Estate unless otherwise stated. You may not reproduce, distribute, or use any content without written permission.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Property Listings</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            Property listings on this website are provided for informational purposes only. While we strive for accuracy, we do not guarantee that listing information is complete, current, or error-free. Prices, availability, and property details are subject to change without notice.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">No Professional Advice</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            Content on this website does not constitute legal, financial, or investment advice. Always consult with qualified professionals before making real estate decisions.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Limitation of Liability</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            Perfecto Homes Real Estate shall not be liable for any damages arising from the use of this website. We are not responsible for the content of external websites linked from our site.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Changes to Terms</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Contact</h2>
          <p className="text-medium-gray leading-relaxed">
            Questions about these Terms of Service can be directed to Perfecto Homes Real Estate at (916) 878-7703 or elisban.gonzales@gmail.com.
          </p>
        </div>
      </section>
    </>
  );
}
