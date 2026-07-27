import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCollection } from "@/lib/content";
import { TEAM } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog & News",
  description: "Real estate news, market updates, homebuying tips, and community highlights from Perfecto Homes Real Estate in Sacramento and Peru.",
  alternates: { canonical: "/blog" },
};

function getReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 230));
}

export default function BlogIndexPage() {
  const posts = getCollection("blog");

  return (
    <>
      <section className="bg-white pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-8 h-px bg-gold" />
            <p className="text-gold text-[11px] font-semibold tracking-[0.3em] uppercase">Resources</p>
            <span className="block w-8 h-px bg-gold" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-medium text-dark tracking-[-0.05em] leading-[1.02]">
            News &amp; Insights
          </h1>
          <p className="mt-6 text-medium-gray text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Market trends, homebuying tips, and community highlights from our team.
          </p>
        </div>
      </section>

      {/* Featured (most recent) */}
      {posts.length > 0 && (() => {
        const featured = posts[0];
        const fAuthor = TEAM.find(
          (m) => m.slug.split("-")[0] === (featured.author as string)
        );
        const fReadingTime = getReadingTime(featured.content || "");
        const fImage = (featured.image || featured.thumbnail) as string | undefined;
        return (
          <section className="bg-white pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-1.5 h-1.5 rounded-full bg-gold" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold font-semibold">
                  Featured · Latest
                </p>
              </div>
              <Link
                href={`/blog/${featured.slug}`}
                className="group block rounded-[24px] overflow-hidden bg-light-gray hover:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] transition-shadow duration-500"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative aspect-[16/10] lg:aspect-auto bg-gray-100 overflow-hidden">
                    {fImage ? (
                      <Image
                        src={fImage}
                        alt={String(featured.title)}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    ) : null}
                    {featured.category && (
                      <span className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm text-dark text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
                        {String(featured.category)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-14">
                    <div>
                      {featured.date && (
                        <p className="text-[11px] tracking-[0.25em] uppercase text-gold font-semibold mb-5">
                          {new Date(String(featured.date)).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                      <h2 className="text-xl sm:text-2xl lg:text-[32px] font-medium text-dark tracking-[-0.04em] leading-[1.1] mb-5 group-hover:text-gold transition-colors">
                        {String(featured.title)}
                      </h2>
                      {featured.metaDescription && (
                        <p className="text-medium-gray text-base leading-[1.65] line-clamp-3">
                          {String(featured.metaDescription)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                      {fAuthor ? (
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200">
                            <Image src={fAuthor.image} alt={fAuthor.name} fill className="object-cover object-top" sizes="36px" />
                          </div>
                          <div className="flex flex-col leading-tight">
                            <span className="text-dark text-sm font-medium">{fAuthor.name}</span>
                            <span className="text-medium-gray text-xs">{fAuthor.role}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-medium-gray">Perfecto Homes</span>
                      )}
                      <span className="text-[11px] tracking-[0.25em] uppercase text-medium-gray font-medium">
                        {fReadingTime} min read
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        );
      })()}

      <section className="bg-white pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-medium-gray py-20">Blog posts coming soon.</p>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-1.5 h-1.5 rounded-full bg-gold" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold font-semibold">
                  All Articles
                </p>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(1).map((post) => {
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
            </>
          )}
        </div>
      </section>
    </>
  );
}
