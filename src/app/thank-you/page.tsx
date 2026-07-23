import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCollection } from "@/lib/content";
import { TEAM, PHONE, PHONE_TEL, EMAIL } from "@/lib/constants";
import Confetti from "./Confetti";
import TrackLead from "./TrackLead";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for contacting Perfecto Homes Real Estate. We will be in touch shortly.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  const posts = getCollection("blog").slice(0, 3);

  return (
    <>
      <Confetti />
      <TrackLead />

      {/* Hero */}
      <section className="bg-white pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-dark mb-4">
            Thank You!
          </h1>
          <p className="text-lg text-medium-gray leading-relaxed mb-2">
            Your message is on its way to our team.
          </p>
          <p className="text-medium-gray leading-relaxed mb-8">
            We respond to every inquiry within <span className="font-semibold text-dark">24 hours</span>, Monday through Saturday.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a
              href={`https://wa.me/${PHONE_TEL.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi Perfecto Homes, I just submitted a form on your website.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp {PHONE}
            </a>
            <Link
              href="/listings"
              className="inline-flex items-center justify-center gap-2 border border-dark rounded-full px-8 py-3 text-sm font-semibold text-dark hover:bg-dark hover:text-white transition-colors"
            >
              Browse Listings
            </Link>
          </div>

          <p className="text-xs text-medium-gray">
            Prefer email? Reach us at{" "}
            <a href={`mailto:${EMAIL}`} className="text-gold hover:underline">
              {EMAIL}
            </a>
          </p>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="bg-light-gray py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3 text-center">
            What Happens Next
          </p>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-dark mb-12 text-center">
            Here&apos;s what to expect
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "We review your message",
                desc: "One of our agents personally reads every inquiry to understand how we can help.",
              },
              {
                step: "02",
                title: "We reach out within 24 hours",
                desc: "Expect a call, text, or email from the team member best suited to your needs.",
              },
              {
                step: "03",
                title: "We schedule a conversation",
                desc: "A free, no-pressure chat to talk through your goals and next steps.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <div className="text-gold text-sm font-bold tracking-[0.2em] mb-3">
                  {item.step}
                </div>
                <h3 className="text-lg font-serif font-bold text-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-medium-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Your Team */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3 text-center">
            Meet Your Team
          </p>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-dark mb-12 text-center">
            The people behind Perfecto Homes
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TEAM.map((member) => (
              <Link
                key={member.slug}
                href={`/about/${member.slug}`}
                className="group bg-light-gray rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="300px"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-dark text-sm leading-snug mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-medium-gray leading-tight">
                    {member.role}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* While You Wait — Blog */}
      <section className="bg-light-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3 text-center">
            While You Wait
          </p>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-dark mb-12 text-center">
            Real estate reads from our team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const author = TEAM.find((m) => m.slug.split("-")[0] === (post.author as string));
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  {post.image && (
                    <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
                      <Image
                        src={post.image as string}
                        alt={post.title as string}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="400px"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-dark text-[15px] mb-2 leading-snug">{post.title as string}</h3>
                    {author && (
                      <p className="text-xs text-medium-gray">{author.name}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-dark hover:text-gold transition-colors"
            >
              View all posts &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Return Home */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-medium-gray hover:text-gold transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
