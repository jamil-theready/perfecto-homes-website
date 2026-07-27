import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { PHONE, EMAIL, TEAM, WA_LINK } from "@/lib/constants";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Perfecto Homes Real Estate. Call us at (916) 878-7260 or send a message. Serving Sacramento, CA and Peru.",
  alternates: { canonical: "/contact" },
};

export default function ContactUsPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-dark text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            Contact Us
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold">
            Let&apos;s Get Started
          </h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Ready to buy, sell, or invest? Our team is here to help every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Info */}
            <div>
              <h2 className="text-xl font-serif font-bold text-dark mb-6">
                Reach Out to Us
              </h2>
              <p className="text-medium-gray leading-relaxed mb-8">
                Whether you have a question about a listing, want a market analysis, or are ready to start your real estate journey, we want to hear from you.
              </p>

              {/* Contact Info */}
              <div className="space-y-5">
                <ContactInfoRow
                  icon="phone"
                  label="Phone"
                  value={PHONE}
                  href={`tel:${PHONE}`}
                />
                <ContactInfoRow
                  icon="email"
                  label="Email"
                  value={EMAIL}
                  href={`mailto:${EMAIL}`}
                />
                <ContactInfoRow
                  icon="location"
                  label="Office"
                  value="Sacramento, California"
                />
              </div>
            </div>

            {/* Right: Form */}
            <ContactForm />
          </div>

          {/* Team Contacts — below form */}
          <div className="mt-12 pt-10 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-dark mb-6">Our Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TEAM.map((m) => (
                <div
                  key={m.slug}
                  className="flex items-center justify-between bg-light-gray rounded-xl p-4"
                >
                  <div>
                    <p className="font-semibold text-dark text-sm">{m.name}</p>
                    <p className="text-gold text-xs">{m.role}</p>
                  </div>
                  <a
                    href={`tel:${m.phone}`}
                    className="text-xs text-medium-gray hover:text-gold transition-colors"
                  >
                    {m.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map / CTA */}
      <section className="bg-light-gray py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-serif font-bold text-dark mb-4">
            Serving Sacramento &amp; Peru
          </h2>
          <p className="text-medium-gray leading-relaxed mb-6">
            We serve the greater Sacramento area including Citrus Heights, Roseville, Folsom, Elk Grove, and El Dorado Hills. We also offer exclusive international listings in Peru&apos;s Sacred Valley.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
          >
            <WhatsAppIcon />
            WhatsApp Us: {PHONE}
          </a>
        </div>
      </section>
    </>
  );
}

function ContactInfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
}) {
  const iconSvg =
    icon === "phone" ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
    ) : icon === "email" ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
    );

  const content = (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
        {iconSvg}
      </div>
      <div>
        <p className="text-xs text-medium-gray">{label}</p>
        <p className="text-dark font-medium text-sm">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block hover:opacity-80 transition-opacity">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}
