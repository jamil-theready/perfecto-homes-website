import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCollection } from "@/lib/content";
import { TEAM } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog & News",
  description: "Real estate news, market updates, homebuying tips, and community highlights from Perfecto Homes Real Estate in Sacramento and Peru.",
};

function getReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 230));
}

export default function BlogIndexPage() {
  const posts = getCollection("blog");

  return (
    <>
      <section className="bg-dark text-white py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Resources</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold">News &amp; Insights</h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Market trends, homebuying tips, and community highlights from our team.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-medium-gray py-20">Blog posts coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const author = TEAM.find(
                  (m) => m.slug.split("-")[0] === (post.author as string)
                );
                const readingTime = getReadingTime(post.content || "");
                const imageUrl = (post.image || post.thumbnail) as string | undefined;

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={String(post.title)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                      {post.category && (
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-dark text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                          {String(post.category)}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="text-[16px] font-semibold text-dark group-hover:text-gold transition-colors mb-3 leading-snug line-clamp-2">
                        {String(post.title)}
                      </h2>
                      {post.metaDescription && (
                        <p className="text-medium-gray text-sm leading-relaxed line-clamp-2 mb-4">
                          {String(post.metaDescription)}
                        </p>
                      )}

                      {/* Author row */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        {author ? (
                          <div className="flex items-center gap-2">
                            <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-gray-200">
                              <Image
                                src={author.image}
                                alt={author.name}
                                fill
                                className="object-cover"
                                sizes="28px"
                              />
                            </div>
                            <span className="text-xs text-dark font-medium">{author.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-medium-gray">Perfecto Homes</span>
                        )}
                        <span className="text-xs text-medium-gray">{readingTime} min read</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
