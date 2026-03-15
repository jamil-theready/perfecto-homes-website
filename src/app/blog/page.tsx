import { Metadata } from "next";
import Link from "next/link";
import { getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog & News",
  description: "Real estate news, market updates, homebuying tips, and community highlights from Perfecto Homes Real Estate in Sacramento and Peru.",
};

export default function BlogIndexPage() {
  const posts = getCollection("blog");

  return (
    <>
      <section className="bg-dark text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Resources</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold">News &amp; Insights</h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Market trends, homebuying tips, and community highlights from our team.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-medium-gray py-20">Blog posts coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[16/9] bg-gray-200 overflow-hidden">
                    {post.image && (
                      <img
                        src={post.image as string}
                        alt={post.title as string}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    {post.date && (
                      <p className="text-xs text-medium-gray mb-2">
                        {new Date(post.date as string).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    <h2 className="text-lg font-semibold text-dark group-hover:text-gold transition-colors mb-2 line-clamp-2">
                      {post.title as string}
                    </h2>
                    {post.excerpt && (
                      <p className="text-medium-gray text-sm leading-relaxed line-clamp-3">
                        {post.excerpt as string}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 mt-4 text-sm text-gold font-semibold">
                      Read More <span>&rarr;</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
