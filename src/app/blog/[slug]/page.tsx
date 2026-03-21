import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getItemBySlug, markdownToHtml, getCollectionSlugs } from "@/lib/content";
import { BlogPostJsonLd } from "@/components/JsonLd";
import { TEAM } from "@/lib/constants";
import ContactForm from "@/components/ContactForm";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";

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

function getReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 230));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getItemBySlug("blog", slug);
  if (!post) notFound();

  const htmlContent = await markdownToHtml(post.content);
  const readingTime = getReadingTime(post.content);
  const author = TEAM.find(
    (m) => m.slug.split("-")[0] === (post.author as string)
  );
  const postUrl = `/blog/${slug}`;

  return (
    <>
      <ReadingProgress />
      <BlogPostJsonLd
        title={post.title as string}
        date={post.date as string | undefined}
        description={(post.metaDescription as string) || (post.excerpt as string) || `${post.title} - Perfecto Homes Real Estate Blog`}
        url={postUrl}
        image={post.image as string | undefined}
      />

      {/* Hero */}
      <section className="bg-dark text-white py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-tight max-w-3xl">
            {String(post.title)}
          </h1>

          {/* Author + Reading Time */}
          <div className="flex items-center gap-4 mt-6">
            {author && (
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                  <Image src={author.image} alt={author.name} fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{author.name}</p>
                  <p className="text-gray-400 text-xs">{author.role}</p>
                </div>
              </div>
            )}
            <span className="text-gray-500 text-xs">&bull;</span>
            <p className="text-gray-400 text-xs">{readingTime} min read</p>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {(post.image || post.thumbnail) && (
        <section className="bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
            <div className="rounded-2xl overflow-hidden aspect-[21/9] bg-gray-100 relative">
              <Image
                src={String(post.image || post.thumbnail)}
                alt={String(post.title)}
                fill
                className="object-cover"
                sizes="1200px"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content + Sidebar */}
      <section className="bg-white py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Share buttons (sticky left) */}
            <aside className="hidden lg:block lg:col-span-1">
              <ShareButtons url={postUrl} title={post.title as string} />
            </aside>

            {/* Main content */}
            <div className="lg:col-span-7">
              <div
                className="prose prose-gray max-w-none prose-headings:font-serif prose-headings:text-dark prose-p:text-medium-gray prose-p:leading-relaxed prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* Mobile share buttons */}
              <div className="lg:hidden mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-medium-gray font-semibold uppercase tracking-wider mb-3">Share this article</p>
                <ShareButtons url={postUrl} title={post.title as string} horizontal />
              </div>
            </div>

            {/* Sticky sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-20 space-y-6">
                <ContactForm />
              </div>
            </aside>
          </div>
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
