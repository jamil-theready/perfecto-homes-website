import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollection, getItemBySlug, markdownToHtml, getCollectionSlugs } from "@/lib/content";
import { PHONE, PHONE_TEL, EMAIL, TEAM } from "@/lib/constants";
import { PropertyJsonLd } from "@/components/JsonLd";
import ImageGallery from "@/app/listings/[slug]/ImageGallery";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getCollectionSlugs("peru").map((slug) => ({ slug }));
}

const PERU_SEO: Record<string, { title: string; description: string }> = {
  "predio-victoria": {
    title: "10,000 m\u00B2 Land for Sale in Urubamba, Sacred Valley Peru | $820K",
    description: "10,000 m\u00B2 (2.47 acres) of flat, buildable land for sale in Urubamba, Sacred Valley of Cusco, Peru. Ideal for hotel, eco lodge, or development. $820,000.",
  },
  "hostal-qhispicay-ollantaytambo": {
    title: "Hostel for Sale in Ollantaytambo, Peru | 12 Rooms | Near Machu Picchu | $960K",
    description: "Operating 12 room hostel with 2 apartments for sale in Ollantaytambo, gateway to Machu Picchu. 474 m\u00B2 built, turnkey business. $960,000.",
  },
  "hatuchay-valle-restaurant-urubamba": {
    title: "Restaurant for Sale in Urubamba, Sacred Valley Peru | 1,764 m\u00B2 | $1.26M",
    description: "Operating 250 seat restaurant for sale in Urubamba, Sacred Valley of Cusco, Peru. Two floors, full bar, industrial kitchen, 1,764 m\u00B2 of land. $1,260,000.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getItemBySlug("peru", slug);
  if (!item) return {};
  const seo = PERU_SEO[slug];
  return {
    title: seo?.title || (item.metaTitle as string) || (item.title as string),
    description: seo?.description || (item.metaDescription as string) || `${item.title} - Property for sale in Peru's Sacred Valley. ${item.price}`,
  };
}

export default async function PeruListingPage({ params }: Props) {
  const { slug } = await params;
  const item = getItemBySlug("peru", slug);
  if (!item) notFound();

  const htmlContent = await markdownToHtml(item.content);
  const allListings = getCollection("peru");
  const otherListings = allListings.filter((l) => l.slug !== slug);

  // Collect images
  const images: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const img = item[`image${i}`] as string | undefined;
    if (img) images.push(img);
  }

  const status = ((item.listingStatus as string) || "active").toLowerCase();
  const currentAgent = TEAM.find((m) => m.slug === "alfredo-gonzalez") || TEAM[0];
  const address = (item.location as string) || (item.city as string) || "Sacred Valley, Peru";

  return (
    <div>
      <PropertyJsonLd
        title={item.title as string}
        price={item.price as string}
        location={address}
        description={(item.metaDescription as string) || `${item.title} - Property for sale in Peru's Sacred Valley. ${item.price}`}
        image={item.image1 as string | undefined}
        url={`/peru/${slug}`}
      />

      <main className="bg-light-gray min-h-screen pt-20">
        {/* Back Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/peru" className="text-gold text-sm font-semibold hover:underline">
            &larr; Back to Peru Listings
          </Link>
        </div>

        {/* Photo Gallery */}
        {images.length > 0 && <ImageGallery images={images} title={item.title as string} youtubeVideo={item.youtubeVideo as string | undefined} />}

        {/* Title + Price Bar */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <span className="text-[11px] text-medium-gray uppercase tracking-widest">{item.propertyType as string}</span>
                <h1 className="text-3xl sm:text-4xl font-bold text-dark mt-1">
                  {item.title as string} &mdash; {(item.city as string) || "Sacred Valley, Peru"}
                </h1>
                <a href="#map" className="inline-flex items-center gap-1.5 text-medium-gray text-[15px] mt-2 hover:text-gold transition-colors">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 92.3 132.3"><path fill="#1a73e8" d="M60.2 2.2C55.8.8 51 0 46.1 0 32 0 19.3 6.4 10.8 16.5l21.8 18.3L60.2 2.2z"/><path fill="#ea4335" d="M10.8 16.5C4.1 24.5 0 34.9 0 46.1c0 8.7 1.7 15.7 4.6 22l28-32.6L10.8 16.5z"/><path fill="#4285f4" d="M46.1 66.7c-11.3 0-20.6-9.2-20.6-20.6 0-5.9 2.5-11.2 6.5-14.9L4.6 68.1c5.5 12 13.4 22 21.3 32.7l27.4-37.2c-2.2 1.9-5 3.1-7.2 3.1z"/><path fill="#fbbc04" d="M46.1 25.5c11.3 0 20.6 9.2 20.6 20.6 0 5.1-1.9 9.7-5 13.3L92.3 17c-8-11-21.5-17-46.2-17-5.1 0-9.9.8-14.4 2.2l27.5 32.5c-1.3-5.2-4.4-9.6-13.1-9.2z"/><path fill="#34a853" d="M25.9 100.8c11.9 15.2 24.1 31.5 20.2 31.5s8.3-16.3 20.2-31.5l-27.4-37.2-13 37.2z"/></svg>
                  View on Google Maps
                </a>
              </div>
              <div className="flex items-center gap-4 sm:mt-1 shrink-0">
                <p className="text-2xl sm:text-3xl font-bold text-dark tracking-tight">
                  {item.price as string}
                </p>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
                  status === "active" ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  {item.listingStatus as string || "Active"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center overflow-x-auto scrollbar-hide">
              {[
                item.landArea && { value: item.landArea as string, label: "Land Area" },
                item.builtArea && { value: item.builtArea as string, label: "Built Area" },
                item.floors && { value: String(item.floors), label: "Floors" },
                item.district && { value: item.district as string, label: "District" },
              ].filter(Boolean).map((stat, i) => (
                <div key={i} className={`text-center px-5 sm:px-7 shrink-0 ${i > 0 ? "border-l border-gray-200" : ""}`}>
                  <p className="text-2xl sm:text-3xl font-bold text-dark">{(stat as { value: string }).value}</p>
                  <p className="text-[11px] text-medium-gray uppercase tracking-wider mt-1">{(stat as { value: string; label: string }).label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Description */}
              <div className="lg:col-span-2 space-y-8">
                {htmlContent && (
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
                    <h2 className="text-xl font-serif font-bold text-dark mb-4">About This Property</h2>
                    <div
                      className="prose prose-gray max-w-prose prose-img:rounded-xl prose-img:w-full prose-img:my-6 prose-headings:font-serif prose-headings:text-dark prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3 prose-h3:text-base prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-dark/70 prose-p:leading-relaxed prose-p:mb-5 prose-ul:my-4 prose-ul:space-y-2 prose-li:text-dark/70 prose-li:leading-relaxed prose-ol:my-4 prose-ol:space-y-2 prose-strong:text-dark prose-table:mt-6 prose-hr:my-10"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  </div>
                )}

                {/* Property Details Table */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
                  <h2 className="text-xl font-serif font-bold text-dark mb-4">Property Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    <DetailRow label="Property Type" value={item.propertyType as string} />
                    <DetailRow label="Status" value={(item.listingStatus as string) || "Active"} />
                    {item.landArea && <DetailRow label="Land Area" value={item.landArea as string} />}
                    {item.builtArea && <DetailRow label="Built Area" value={item.builtArea as string} />}
                    {item.floors && <DetailRow label="Floors" value={String(item.floors)} />}
                    <DetailRow label="District" value={(item.district as string) || ""} />
                    <DetailRow label="City" value={(item.city as string) || ""} />
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <aside>
                <div className="sticky top-24 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                  {/* Agent Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-xs text-medium-gray uppercase tracking-wider mb-3">Listed By</p>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gold/20" style={{ background: "linear-gradient(135deg, #f5ecd7 0%, #e8d5a0 100%)" }}>
                        <img src={currentAgent.image} alt={currentAgent.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark text-base">{currentAgent.name}</h3>
                        <p className="text-xs text-medium-gray">{currentAgent.role}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${currentAgent.phoneTel}`}
                      className="block w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors text-sm mb-3"
                    >
                      Call {currentAgent.phone}
                    </a>
                    <a
                      href={`https://wa.me/${currentAgent.phoneTel.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi, I am interested in " + (item.title as string) + " (" + (item.price as string) + ")")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 hover:border-dark text-dark font-semibold py-3 px-6 rounded-lg text-center transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>

                  {/* Inquiry Form */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-xs text-medium-gray uppercase tracking-wider mb-3">Inquire About This Property</p>
                    <form name={`inquiry-${slug}`} method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you">
                      <input type="hidden" name="form-name" value={`inquiry-${slug}`} />
                      <input type="hidden" name="property" value={item.title as string} />
                      <p className="hidden"><label>Don&apos;t fill: <input name="bot-field" /></label></p>
                      <input type="text" name="name" required placeholder="First and Last Name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2" />
                      <input type="email" name="email" required placeholder="your@email.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2" />
                      <input type="tel" name="phone" placeholder="(916) 878-7260" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2" />
                      <textarea name="message" rows={2} placeholder="Tell us about your interest in this property" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 resize-none" />
                      <button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                        Send Inquiry
                      </button>
                    </form>
                  </div>

                  {/* Share */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-xs text-medium-gray uppercase tracking-wider mb-3">Share</p>
                    <div className="flex gap-3">
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.perfectohomesrealestate.com/peru/${slug}`} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-light-gray text-medium-gray hover:bg-gold hover:text-white transition-colors" aria-label="Facebook">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                      <a href={`https://twitter.com/intent/tweet?url=https://www.perfectohomesrealestate.com/peru/${slug}&text=${encodeURIComponent((item.title as string) + " - " + (item.price as string))}`} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-light-gray text-medium-gray hover:bg-gold hover:text-white transition-colors" aria-label="X">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                      <a href={`mailto:?subject=${encodeURIComponent((item.title as string) + " - " + (item.price as string))}&body=Check out this property: https://www.perfectohomesrealestate.com/peru/${slug}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-light-gray text-medium-gray hover:bg-gold hover:text-white transition-colors" aria-label="Email">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </a>
                      <a href={`https://wa.me/?text=${encodeURIComponent((item.title as string) + " " + (item.price as string) + " https://www.perfectohomesrealestate.com/peru/" + slug)}`} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-light-gray text-medium-gray hover:bg-gold hover:text-white transition-colors" aria-label="WhatsApp">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Map */}
        <section id="map" className="bg-white py-12 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-serif font-bold text-dark mb-4">Location</h2>
            <div className="rounded-xl overflow-hidden h-[400px]">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Property location"
              />
            </div>
          </div>
        </section>

        {/* Other Peru Properties */}
        {otherListings.length > 0 && (
          <section className="bg-white py-16 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-serif font-bold text-dark mb-8">Other Properties in Peru</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherListings.map((l) => {
                  const img = (l.image1 as string) || "/images/placeholder.jpg";
                  return (
                    <Link
                      key={l.slug}
                      href={`/peru/${l.slug}`}
                      className="group flex flex-col bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img src={img} alt={`${l.title} - Peru property`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent pt-10 pb-3 px-4">
                          <p className="text-white text-xl font-bold tracking-tight">{l.price as string}</p>
                        </div>
                      </div>
                      <div className="px-4 pt-4 pb-5">
                        <h3 className="text-dark font-semibold text-base leading-snug">{l.title as string}</h3>
                        <p className="text-medium-gray text-[13px] mt-0.5 mb-3">{l.city as string}</p>
                        <div className="flex items-center gap-4 text-[13px] text-medium-gray">
                          {l.landArea && <span>{l.landArea as string}</span>}
                          {l.builtArea && <span>{l.builtArea as string} built</span>}
                        </div>
                        <div className="pt-4 flex items-center justify-between">
                          <span className="text-gold text-[13px] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            Details
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
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
