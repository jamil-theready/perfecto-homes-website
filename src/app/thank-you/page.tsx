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

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-dark mb-4">
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
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              Call {PHONE}
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
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dark mb-12 text-center">
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
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dark mb-12 text-center">
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
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dark mb-12 text-center">
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
