import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getItemBySlug, markdownToHtml, getCollectionSlugs } from "@/lib/content";
import { BlogPostJsonLd } from "@/components/JsonLd";
import { TEAM } from "@/lib/constants";
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
  const title = post.title as string;
  // Optional frontmatter override: lets the SERP title stay inside ~60 chars
  // without changing the on-page H1 copy.
  const seoTitle = (post.metaTitle as string) || title;
  const description = (post.metaDescription as string) || (post.excerpt as string) || `${title} - Perfecto Homes Real Estate Blog`;
  const ogImage = post.image
    ? [{ url: post.image as string, width: 1200, height: 630, alt: title }]
    : undefined;
  return {
    // Use the short brand here: the default " | Perfecto Homes Real Estate" template
    // pushed almost every post title past Google's ~60 char display limit.
    title: { absolute: `${seoTitle} | Perfecto Homes` },
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.perfectohomesrealestate.com/blog/${slug}`,
      type: "article",
      siteName: "Perfecto Homes Real Estate",
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage,
    },
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
        authorName={author?.name}
        authorSlug={author?.slug}
      />

      {/* Editorial Hero */}
      <section className="bg-white pt-24 pb-10 sm:pt-32 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-medium-gray hover:text-gold text-sm transition-colors mb-12"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Blog
          </Link>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-medium text-dark leading-[1.05] tracking-[-0.04em] max-w-[920px]">
            {String(post.title)}
          </h1>

          {/* Author + meta bar */}
          {author && (
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-light-gray flex-shrink-0">
                  <Image src={author.image} alt={author.name} fill className="object-cover object-top" sizes="48px" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-dark text-[15px] font-medium tracking-[-0.01em]">{author.name}</span>
                  <span className="text-medium-gray text-xs">{author.role}</span>
                </div>
              </div>

              {/* Meta — date · category · reading time */}
              <div className="flex flex-wrap items-center gap-3">
                {post.date && (
                  <span className="text-[11px] tracking-[0.25em] uppercase text-gold font-semibold">
                    {new Date(String(post.date)).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
                {post.category ? (
                  <>
                    <span className="text-medium-gray/40 text-xs">·</span>
                    <span className="text-[11px] tracking-[0.25em] uppercase text-medium-gray font-medium">
                      {String(post.category)}
                    </span>
                  </>
                ) : null}
                <span className="text-medium-gray/40 text-xs">·</span>
                <span className="text-[11px] tracking-[0.25em] uppercase text-medium-gray font-medium">
                  {readingTime} min read
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Image — full bleed within container, 16/9 */}
      {(post.image || post.thumbnail) && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-[20px] overflow-hidden aspect-[16/9] bg-gray-100 relative shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">
              <Image
                src={String(post.image || post.thumbnail)}
                alt={String(post.title)}
                fill
                className="object-cover"
                sizes="1200px"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Content + Sidebar */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Share buttons (sticky left) */}
            <aside className="hidden lg:block lg:col-span-1">
              <ShareButtons url={postUrl} title={post.title as string} />
            </aside>

            {/* Main content */}
            <div className="lg:col-span-7">
              {/* Quick Answer — soft editorial pull-card */}
              {post.quickAnswer && (
                <div className="relative mb-10 rounded-[20px] p-8 sm:p-10 overflow-hidden bg-light-gray">
                  <div
                    aria-hidden
                    className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-30"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(196,169,77,0.25) 0%, transparent 70%)",
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className="block w-1.5 h-1.5 rounded-full bg-gold" />
                      <p className="text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
                        Quick Answer
                      </p>
                    </div>
                    <p className="text-dark text-[18px] sm:text-[20px] leading-[1.55] tracking-[-0.01em] font-normal">
                      {post.quickAnswer as string}
                    </p>
                  </div>
                </div>
              )}

              {/* Key Takeaways — clean numbered timeline */}
              {post.keyTakeaways && (post.keyTakeaways as string[]).length > 0 && (
                <div className="mb-10 rounded-[20px] border border-gray-100 bg-white p-8 sm:p-10">
                  <p className="mb-6 text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
                    Key Takeaways
                  </p>
                  <ul className="flex flex-col gap-5">
                    {(post.keyTakeaways as string[]).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-4 text-[15px] sm:text-[16px] leading-[1.6] text-dark">
                        <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gold text-[12px] font-semibold text-white">
                          {i + 1}
                        </span>
                        <span>{item}</span>
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
                  <nav className="mb-10 rounded-[20px] bg-light-gray p-8 sm:p-10">
                    <p className="mb-5 text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
                      In This Article
                    </p>
                    <ul className="flex flex-col gap-3">
                      {headings.map((h: string, idx: number) => {
                        const text = h.replace(/^## /, "");
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                        return (
                          <li key={id} className="flex items-baseline gap-3">
                            <span className="text-[11px] tracking-[0.2em] text-gold/70 font-medium tabular-nums">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <a href={`#${id}`} className="text-[15px] text-dark transition-colors hover:text-gold">
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
                className="prose prose-gray max-w-prose prose-headings:font-serif prose-headings:text-dark prose-p:text-medium-gray prose-p:leading-relaxed prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* FAQ Section */}
              {post.faq && (post.faq as Array<{question: string; answer: string}>).length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h2 className="text-xl font-serif font-bold text-dark mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-0">
                    {(post.faq as Array<{question: string; answer: string}>).map((item, i) => (
                      <details key={i} className="group border-b border-gray-100 overflow-hidden">
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
                {author && (
                  <div className="rounded-[20px] p-7 relative overflow-hidden bg-light-gray">
                    <div
                      aria-hidden
                      className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full opacity-30"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(196,169,77,0.3) 0%, transparent 70%)",
                      }}
                    />
                    <div className="relative">
                      <p className="text-[10px] font-semibold tracking-[0.28em] text-gold uppercase mb-5">
                        Talk to a Realtor
                      </p>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white flex-shrink-0 border border-gold/20">
                          <Image src={author.image} alt={author.name} fill className="object-cover object-top" sizes="56px" />
                        </div>
                        <div>
                          <p className="text-dark text-[16px] font-medium tracking-[-0.01em]">{author.name}</p>
                          <p className="text-medium-gray text-xs">{author.role}</p>
                        </div>
                      </div>
                      <p className="text-medium-gray text-[14px] leading-[1.6] mb-6">
                        Get a free consultation tailored to your goals — Sacramento or Peru.
                      </p>
                      <Link
                        href="/contact"
                        className="group flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-dark text-white font-medium px-5 py-3 rounded-full transition-colors text-sm"
                      >
                        Book a Call
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}

                <div className="rounded-[20px] border border-gray-100 bg-white p-6">
                  <p className="text-[10px] font-semibold tracking-[0.28em] text-gold uppercase mb-4">
                    Stay Updated
                  </p>
                  <h4 className="text-dark text-[18px] font-medium tracking-[-0.02em] leading-tight mb-4">
                    New listings & market insights, monthly.
                  </h4>
                  <Link
                    href="/#newsletter"
                    className="inline-flex items-center gap-2 text-gold text-sm font-medium hover:underline"
                  >
                    Subscribe to Newsletter
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
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
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
