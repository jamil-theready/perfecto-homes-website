import { Metadata } from "next";
import Link from "next/link";
import { getCollection } from "@/lib/content";
import Image from "next/image";
import { TEAM } from "@/lib/constants";
import Confetti from "./Confetti";

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

      <section className="min-h-[60vh] flex items-center justify-center bg-white py-20 pt-32">
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
              href="/listings"
              className="border border-dark rounded-full px-8 py-3 text-sm font-semibold text-dark hover:bg-dark hover:text-white transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="bg-light-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-bold text-dark mb-8 text-center">While You Wait</h2>
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
        </div>
      </section>
    </>
  );
}
