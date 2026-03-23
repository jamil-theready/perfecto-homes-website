import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollection, getItemBySlug, markdownToHtml, getCollectionSlugs } from "@/lib/content";
import { PHONE } from "@/lib/constants";
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

  return (
    <>
      <PropertyJsonLd
        title={item.title as string}
        price={item.price as string}
        location={(item.location as string) || (item.city as string) || "Sacred Valley, Peru"}
        description={(item.metaDescription as string) || `${item.title} - Property for sale in Peru's Sacred Valley. ${item.price}`}
        image={item.image1 as string | undefined}
        url={`/peru/${slug}`}
      />
      {/* Hero */}
      <section className="bg-dark text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/listings" className="text-gold text-sm hover:underline mb-4 inline-block">&larr; Back to Listings</Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold">
            {item.title as string}
          </h1>
          <p className="text-gold text-sm font-medium tracking-wide mt-2">
            {(item.city as string) || "Sacred Valley, Peru"}
          </p>
          <p className="text-4xl sm:text-5xl font-bold text-gold mt-4">{item.price as string}</p>
        </div>
      </section>

      {/* Image Gallery */}
      {(() => {
        const images: string[] = [];
        for (let i = 1; i <= 20; i++) {
          const img = item[`image${i}`] as string | undefined;
          if (img) images.push(img);
        }
        if (images.length === 0) return null;
        return <ImageGallery images={images} title={item.title as string} />;
      })()}

      {/* Property Details */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {item.landArea && <StatBox label="Land Area" value={item.landArea as string} />}
                {item.builtArea && <StatBox label="Built Area" value={item.builtArea as string} />}
                {item.propertyType && <StatBox label="Type" value={item.propertyType as string} />}
                {item.district && <StatBox label="District" value={item.district as string} />}
              </div>

              {/* Markdown Content */}
              <div
                className="prose prose-gray max-w-none prose-headings:font-serif prose-headings:text-dark prose-p:text-medium-gray prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>

            {/* Sidebar */}
            <aside>
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="bg-light-gray rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-dark mb-2">Interested in this property?</h3>
                  <p className="text-medium-gray text-sm mb-4">
                    Contact us for more details, schedule a tour, or make an offer.
                  </p>
                  <a
                    href={`tel:${PHONE}`}
                    className="block w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors text-sm mb-3"
                  >
                    Call {PHONE}
                  </a>
                  <a
                    href={`https://wa.me/19168787703?text=${encodeURIComponent("Hi, I am interested in " + (item.title as string) + " (" + (item.price as string) + ")")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors text-sm mb-3"
                  >
                    WhatsApp
                  </a>
                  <Link
                    href="/Contact-Us"
                    className="block w-full border border-dark text-dark hover:bg-dark hover:text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors text-sm"
                  >
                    Send a Message
                  </Link>
                </div>

                {/* Listing Status */}
                {item.listingStatus && (
                  <div className="bg-light-gray rounded-2xl p-6">
                    <p className="text-xs text-medium-gray uppercase tracking-wider mb-1">Status</p>
                    <p className={`font-semibold text-lg ${item.listingStatus === "Active" ? "text-green-600" : "text-red-500"}`}>
                      {item.listingStatus as string}
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Other Listings */}
      {otherListings.length > 0 && (
        <section className="bg-light-gray py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-serif font-bold text-dark mb-8">Other Properties in Peru</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherListings.map((listing) => (
                <Link
                  key={listing.slug}
                  href={`/peru/${listing.slug}`}
                  className="group rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                    {listing.image1 && (
                      <img src={listing.image1 as string} alt={listing.title as string} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-gold text-xs font-semibold tracking-wider uppercase mb-1">{listing.city as string}</p>
                    <h3 className="font-semibold text-dark text-lg mb-2">{listing.title as string}</h3>
                    <p className="font-bold text-dark text-xl">{listing.price as string}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-light-gray rounded-xl p-4 text-center">
      <p className="text-xs text-medium-gray mb-1">{label}</p>
      <p className="font-semibold text-dark text-sm">{value}</p>
    </div>
  );
}
