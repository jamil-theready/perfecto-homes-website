import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getItemBySlug, markdownToHtml, getCollectionSlugs } from "@/lib/content";
import { BlogPostJsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getCollectionSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getItemBySlug("blog", slug);
  if (!post) return {};
  return {
    title: post.title as string,
    description: (post.metaDescription as string) || (post.excerpt as string) || `${post.title} - Perfecto Homes Real Estate Blog`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getItemBySlug("blog", slug);
  if (!post) notFound();

  const htmlContent = await markdownToHtml(post.content);

  return (
    <>
      <BlogPostJsonLd
        title={post.title as string}
        date={post.date as string | undefined}
        description={(post.metaDescription as string) || (post.excerpt as string) || `${post.title} - Perfecto Homes Real Estate Blog`}
        url={`/blog/${slug}`}
        image={post.image as string | undefined}
      />
      {/* Hero */}
      <section className="bg-dark text-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-gold text-sm hover:underline mb-4 inline-block">&larr; Back to Blog</Link>
          {post.date ? (
            <p className="text-gray-400 text-sm mb-2">
              {new Date(String(post.date)).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          ) : null}
          <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
            {String(post.title)}
          </h1>
        </div>
      </section>

      {/* Featured Image */}
      {post.image ? (
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
            <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-gray-200">
              <img src={String(post.image)} alt={String(post.title)} className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      ) : null}

      {/* Content */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-gray max-w-none prose-headings:font-serif prose-headings:text-dark prose-p:text-medium-gray prose-p:leading-relaxed prose-a:text-gold prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-light-gray py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-serif font-bold text-dark mb-3">Have questions?</h2>
          <p className="text-medium-gray mb-6">Our team is ready to help with your real estate needs.</p>
          <Link
            href="/Contact-Us"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
