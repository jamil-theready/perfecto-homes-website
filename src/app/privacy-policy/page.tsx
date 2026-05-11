import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Perfecto Homes Real Estate privacy policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-dark text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">Privacy Policy</h1>
          <p className="mt-3 text-gray-400 text-sm">Last updated: March 2026</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Information We Collect</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            We collect information you provide directly, such as your name, email address, phone number, and any messages you send through our contact forms. We also collect standard analytics data through Google Analytics to understand how visitors use our website.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">How We Use Your Information</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            We use the information we collect to respond to your inquiries, provide real estate services, send newsletters (if subscribed), improve our website, and communicate important updates about properties or services.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Information Sharing</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website or conducting our business, as long as those parties agree to keep this information confidential.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Cookies</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            Our website uses cookies to enhance your experience. These include analytics cookies from Google Analytics that help us understand website traffic patterns. You can choose to disable cookies through your browser settings.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Data Security</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Your Rights</h2>
          <p className="text-medium-gray leading-relaxed mb-4">
            You may request access to, correction of, or deletion of your personal information at any time by contacting us at elisban.gonzales@gmail.com or calling (916) 878-7703.
          </p>

          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">Contact Us</h2>
          <p className="text-medium-gray leading-relaxed">
            If you have questions about this Privacy Policy, contact Perfecto Homes Real Estate at (916) 878-7703 or elisban.gonzales@gmail.com.
          </p>
        </div>
      </section>
    </>
  );
}
