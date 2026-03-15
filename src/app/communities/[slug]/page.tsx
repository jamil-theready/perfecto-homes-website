import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { COMMUNITIES, PHONE } from "@/lib/constants";
import { getItemBySlug, markdownToHtml, getCollectionSlugs } from "@/lib/content";
import ContactForm from "@/components/ContactForm";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  // Static community pages + CMS community pages
  const staticSlugs = COMMUNITIES.map((c) => c.slug);
  const cmsSlugs = getCollectionSlugs("communities");
  const allSlugs = [...new Set([...staticSlugs, ...cmsSlugs])];
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const community = COMMUNITIES.find((c) => c.slug === slug);
  const cmsItem = getItemBySlug("communities", slug);

  const title = (cmsItem?.title as string) || community?.name || slug;
  return {
    title: `${title} Real Estate`,
    description: (cmsItem?.metaDescription as string) || `Explore real estate in ${title}. Homes for sale, market info, and community highlights from Perfecto Homes.`,
  };
}

export default async function CommunityPage({ params }: Props) {
  const { slug } = await params;
  const community = COMMUNITIES.find((c) => c.slug === slug);
  const cmsItem = getItemBySlug("communities", slug);

  // If it's the "communities" index page
  if (slug === "communities") {
    return <CommunitiesIndex />;
  }

  if (!community && !cmsItem) notFound();

  const name = (cmsItem?.title as string) || community?.name || slug;
  const htmlContent = cmsItem ? await markdownToHtml(cmsItem.content) : null;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-dark text-white overflow-hidden py-20 sm:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('/images/communities/${slug}.jpg')` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/communities/communities" className="text-gold text-sm hover:underline mb-4 inline-block">&larr; All Communities</Link>
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-2">Sacramento Area</p>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold">{name}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {htmlContent ? (
                <div
                  className="prose prose-gray max-w-none prose-headings:font-serif prose-headings:text-dark prose-p:text-medium-gray prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-dark mb-4">About {name}</h2>
                  <p className="text-medium-gray leading-relaxed mb-6">
                    {name} is one of the vibrant communities in the greater Sacramento area. Contact our team to learn about available properties, market trends, and what makes this neighborhood special.
                  </p>
                  <a
                    href={`tel:${PHONE}`}
                    className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
                  >
                    Call {PHONE}
                  </a>
                </div>
              )}
            </div>
            <aside>
              <ContactForm />
            </aside>
          </div>
        </div>
      </section>

      {/* Other Communities */}
      <section className="bg-light-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-bold text-dark mb-8">Explore Other Communities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITIES.filter((c) => c.slug !== slug).slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-dark"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('/images/communities/${c.slug}.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-lg font-semibold">{c.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CommunitiesIndex() {
  return (
    <>
      <section className="bg-dark text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Sacramento Area</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold">Our Communities</h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Explore neighborhoods across the greater Sacramento area. Find the community that fits your lifestyle.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-dark"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('/images/communities/${c.slug}.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-lg font-semibold">{c.name}</h3>
                  <p className="text-white/70 text-sm mt-1">View community &rarr;</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
