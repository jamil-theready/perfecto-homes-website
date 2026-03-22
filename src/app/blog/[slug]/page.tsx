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
              {/* Quick Answer */}
              {post.quickAnswer && (
                <div className="mb-8 rounded-xl border-l-4 border-gold bg-light-gray p-6">
                  <p className="mb-1 text-[11px] font-bold tracking-widest text-gold uppercase">Quick Answer</p>
                  <p className="text-[15px] leading-relaxed text-dark">{post.quickAnswer as string}</p>
                </div>
              )}

              {/* Key Takeaways */}
              {post.keyTakeaways && (post.keyTakeaways as string[]).length > 0 && (
                <div className="mb-8 rounded-xl bg-light-gray p-6">
                  <p className="mb-3 text-[11px] font-bold tracking-widest text-gold uppercase">Key Takeaways</p>
                  <ul className="flex flex-col gap-2">
                    {(post.keyTakeaways as string[]).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-dark">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-[11px] font-bold text-gold">{i + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Table of Contents */}
              {(() => {
                const headings = (post.content as string).match(/^## .+/gm) || [];
                if (headings.length <= 2) return null;
                return (
                  <nav className="mb-8 rounded-xl border border-gray-100 bg-light-gray p-6">
                    <p className="mb-3 text-[11px] font-bold tracking-widest text-gold uppercase">In This Article</p>
                    <ul className="flex flex-col gap-1.5">
                      {headings.map((h: string) => {
                        const text = h.replace(/^## /, "");
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                        return (
                          <li key={id}>
                            <a href={`#${id}`} className="inline-block text-[14px] text-medium-gray transition-colors hover:text-gold hover:underline">
                              {text}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                );
              })()}

              <div
                className="prose prose-gray max-w-none prose-headings:font-serif prose-headings:text-dark prose-p:text-medium-gray prose-p:leading-relaxed prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* FAQ Section */}
              {post.faq && (post.faq as Array<{question: string; answer: string}>).length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h2 className="text-2xl font-serif font-bold text-dark mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {(post.faq as Array<{question: string; answer: string}>).map((item, i) => (
                      <details key={i} className="group rounded-xl border border-gray-100 bg-light-gray overflow-hidden">
                        <summary className="flex cursor-pointer items-center justify-between p-5 text-[15px] font-semibold text-dark hover:bg-gray-100 transition-colors">
                          {item.question}
                          <svg className="h-5 w-5 text-gold flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="px-5 pb-5 text-[14px] leading-relaxed text-medium-gray">
                          {item.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                  {/* FAQ Schema */}
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: (post.faq as Array<{question: string; answer: string}>).map((item) => ({
                          "@type": "Question",
                          name: item.question,
                          acceptedAnswer: { "@type": "Answer", text: item.answer },
                        })),
                      }),
                    }}
                  />
                </div>
              )}

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
