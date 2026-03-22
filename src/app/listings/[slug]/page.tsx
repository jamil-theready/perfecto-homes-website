import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCollection, getItemBySlug, markdownToHtml, getCollectionSlugs } from "@/lib/content";
import { PHONE, PHONE_TEL, EMAIL } from "@/lib/constants";
import { PropertyJsonLd } from "@/components/JsonLd";
import ImageGallery from "./ImageGallery";
import type { ContentItem } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getCollectionSlugs("listings/sacramento").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getItemBySlug("listings/sacramento", slug);
  if (!item) return {};

  const title = (item.metaTitle as string) || `${item.title} | ${item.city}, ${item.state}`;
  const description =
    (item.metaDescription as string) ||
    `${item.propertyType} for sale at ${item.address}. ${item.beds} beds, ${item.baths} baths, ${item.sqft} sqft. ${item.price}. Perfecto Homes Real Estate.`;

  return { title, description };
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getItemBySlug("listings/sacramento", slug);
  if (!item) notFound();

  const htmlContent = await markdownToHtml(item.content || "");
  const allListings = getCollection("listings/sacramento");
  const similar = allListings
    .filter((l) => l.slug !== slug)
    .filter((l) => l.city === item.city || l.propertyType === item.propertyType)
    .slice(0, 3);

  // Collect images
  const images: string[] = [];
  if (item.featuredImage) images.push(item.featuredImage as string);
  const imgArray = item.images as string[] | undefined;
  if (imgArray) {
    imgArray.forEach((img) => {
      if (!images.includes(img)) images.push(img);
    });
  }
  // Check for image1-image10 fields as fallback
  for (let i = 1; i <= 10; i++) {
    const img = item[`image${i}`] as string | undefined;
    if (img && !images.includes(img)) images.push(img);
  }

  const highlights = (item.highlights as string[]) || [];
  const status = (item.status as string) || "active";
  const agent = (item.agent as string) || "elisban";

  const agentInfo: Record<string, { name: string; phone: string; role: string }> = {
    elisban: { name: "Elisban Gonzales", phone: "(916) 878-7703", role: "Real Estate Specialist" },
    gina: { name: "Gina Gonzalez", phone: "(916) 878-7260", role: "Real Estate Specialist" },
    alfredo: { name: "Alfredo Gonzales", phone: "(916) 878-7260", role: "Real Estate Specialist" },
  };

  const currentAgent = agentInfo[agent] || agentInfo.elisban;

  return (
    <>
      <PropertyJsonLd
        title={item.title as string}
        price={item.price as string}
        location={(item.address as string) || (item.city as string) || "Sacramento, CA"}
        description={
          (item.metaDescription as string) ||
          `${item.propertyType} for sale. ${item.beds} beds, ${item.baths} baths. ${item.price}.`
        }
        image={images[0]}
        url={`/listings/${slug}`}
      />

      <Header />

      <main className="bg-light-gray min-h-screen pt-20">
        {/* Back Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/listings"
            className="text-gold text-sm font-semibold hover:underline"
          >
            ← Back to Listings
          </Link>
        </div>

        {/* Photo Gallery */}
        {images.length > 0 && <ImageGallery images={images} title={item.title as string} />}

        {/* Title + Price Bar */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide text-white ${
                      status === "active" ? "bg-green-500" :
                      status === "pending" ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}
                  >
                    {status}
                  </span>
                  <span className="text-xs text-medium-gray uppercase tracking-wider">
                    {item.propertyType as string}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dark">
                  {item.title as string}
                </h1>
                <p className="text-medium-gray mt-1">
                  {item.address as string}
                </p>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-dark">
                {item.price as string}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-6 sm:gap-10">
              {item.beds && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark">{item.beds as number}</p>
                  <p className="text-xs text-medium-gray uppercase tracking-wider">Beds</p>
                </div>
              )}
              {item.baths && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark">{item.baths as number}</p>
                  <p className="text-xs text-medium-gray uppercase tracking-wider">Baths</p>
                </div>
              )}
              {item.sqft && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark">{String(item.sqft).toLocaleString()}</p>
                  <p className="text-xs text-medium-gray uppercase tracking-wider">Sqft</p>
                </div>
              )}
              {item.lotSize && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark">{item.lotSize as string}</p>
                  <p className="text-xs text-medium-gray uppercase tracking-wider">Lot</p>
                </div>
              )}
              {item.landArea && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark">{item.landArea as string}</p>
                  <p className="text-xs text-medium-gray uppercase tracking-wider">Land</p>
                </div>
              )}
              {item.yearBuilt && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark">{item.yearBuilt as number}</p>
                  <p className="text-xs text-medium-gray uppercase tracking-wider">Built</p>
                </div>
              )}
              {item.builtArea && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark">{item.builtArea as string}</p>
                  <p className="text-xs text-medium-gray uppercase tracking-wider">Built Area</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Description + Features */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                {htmlContent && (
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
                    <h2 className="text-xl font-serif font-bold text-dark mb-4">About This Property</h2>
                    <div
                      className="prose prose-gray max-w-none prose-headings:font-serif prose-headings:text-dark prose-p:text-medium-gray prose-p:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  </div>
                )}

                {/* Highlights */}
                {highlights.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
                    <h2 className="text-xl font-serif font-bold text-dark mb-4">Property Highlights</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-dark bg-light-gray rounded-lg px-4 py-3"
                        >
                          <svg className="h-4 w-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Details Table */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
                  <h2 className="text-xl font-serif font-bold text-dark mb-4">Property Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    <DetailRow label="Property Type" value={item.propertyType as string} />
                    <DetailRow label="Status" value={status} />
                    {item.beds && <DetailRow label="Bedrooms" value={String(item.beds)} />}
                    {item.baths && <DetailRow label="Bathrooms" value={String(item.baths)} />}
                    {item.sqft && <DetailRow label="Square Feet" value={String(item.sqft)} />}
                    {item.lotSize && <DetailRow label="Lot Size" value={item.lotSize as string} />}
                    {item.landArea && <DetailRow label="Land Area" value={item.landArea as string} />}
                    {item.builtArea && <DetailRow label="Built Area" value={item.builtArea as string} />}
                    {item.yearBuilt && <DetailRow label="Year Built" value={String(item.yearBuilt)} />}
                    {item.floors && <DetailRow label="Floors" value={String(item.floors)} />}
                    <DetailRow label="City" value={(item.city as string) || ""} />
                    {item.district && <DetailRow label="District" value={item.district as string} />}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <aside>
                <div className="sticky top-24 space-y-6">
                  {/* Agent Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-xs text-medium-gray uppercase tracking-wider mb-3">Listed By</p>
                    <h3 className="font-semibold text-dark text-lg">{currentAgent.name}</h3>
                    <p className="text-sm text-medium-gray mb-4">{currentAgent.role}</p>
                    <a
                      href={`tel:${currentAgent.phone}`}
                      className="block w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors text-sm mb-3"
                    >
                      Call {currentAgent.phone}
                    </a>
                    <a
                      href={`mailto:${EMAIL}?subject=Inquiry: ${item.title}`}
                      className="block w-full border border-dark text-dark hover:bg-dark hover:text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors text-sm mb-3"
                    >
                      Email About This Property
                    </a>
                    <Link
                      href="/Contact-Us"
                      className="block w-full text-center text-sm text-gold font-semibold hover:underline"
                    >
                      Schedule a Showing
                    </Link>
                  </div>

                  {/* Quick Facts */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-xs text-medium-gray uppercase tracking-wider mb-3">Quick Facts</p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-medium-gray">Price</span>
                        <span className="font-semibold text-dark">{item.price as string}</span>
                      </div>
                      {item.beds && (
                        <div className="flex justify-between text-sm">
                          <span className="text-medium-gray">Beds / Baths</span>
                          <span className="font-semibold text-dark">{item.beds} / {item.baths}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-medium-gray">Type</span>
                        <span className="font-semibold text-dark">{item.propertyType as string}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-medium-gray">Market</span>
                        <span className="font-semibold text-dark">Sacramento, CA</span>
                      </div>
                    </div>
                  </div>

                  {/* Share */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-xs text-medium-gray uppercase tracking-wider mb-3">Share</p>
                    <div className="flex gap-3">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=https://www.perfectohomesrealestate.com/listings/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray text-medium-gray hover:bg-gold hover:text-white transition-colors"
                        aria-label="Share on Facebook"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=https://www.perfectohomesrealestate.com/listings/${slug}&text=${encodeURIComponent((item.title as string) + " - " + (item.price as string))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray text-medium-gray hover:bg-gold hover:text-white transition-colors"
                        aria-label="Share on X"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                      <a
                        href={`mailto:?subject=${encodeURIComponent((item.title as string) + " - " + (item.price as string))}&body=Check out this property: https://www.perfectohomesrealestate.com/listings/${slug}`}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray text-medium-gray hover:bg-gold hover:text-white transition-colors"
                        aria-label="Share via Email"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <section className="bg-white py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-serif font-bold text-dark mb-8">Similar Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((l) => {
                  const img = (l.featuredImage as string) || (l.image1 as string) || "/images/placeholder.jpg";
                  return (
                    <Link
                      key={l.slug}
                      href={`/listings/${l.slug}`}
                      className="group rounded-2xl overflow-hidden bg-light-gray border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-gray-200">
                        <img
                          src={img}
                          alt={`${l.title} - ${l.city} property`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-xl font-bold text-dark mb-1">{l.price as string}</p>
                        <p className="font-semibold text-dark text-sm">{l.title as string}</p>
                        <p className="text-medium-gray text-sm">{l.address as string}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-50">
      <span className="text-sm text-medium-gray">{label}</span>
      <span className="text-sm font-medium text-dark">{value}</span>
    </div>
  );
}
