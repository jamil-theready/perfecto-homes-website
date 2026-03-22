import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCollection, ContentItem } from "@/lib/content";
import { PHONE } from "@/lib/constants";
import ListingsFilter from "./ListingsFilter";

export const metadata: Metadata = {
  title: "Properties for Sale | Sacramento & Peru",
  description:
    "Browse homes for sale in Sacramento, CA and investment properties in Peru's Sacred Valley. Perfecto Homes Real Estate.",
};

export default function ListingsPage() {
  const sacramento = getCollection("listings/sacramento");
  sacramento.forEach((l) => { l.market = "sacramento"; });

  const peru = getCollection("listings/peru");
  peru.forEach((l) => { l.market = "peru"; });

  const all = [...sacramento, ...peru].sort((a, b) => {
    const pa = Number(a.priceNumeric || 0);
    const pb = Number(b.priceNumeric || 0);
    return pb - pa;
  });

  const markets = [...new Set(all.map((l) => String(l.market)))];
  const cities = [...new Set(all.map((l) => String(l.city || "")).filter(Boolean))];
  const types = [...new Set(all.map((l) => String(l.propertyType || "")).filter(Boolean))];

  return (
    <>
      <Header />
      <main className="bg-light-gray min-h-screen pt-24">
        {/* Hero */}
        <section className="bg-dark text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-3">
              Our Properties
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Sacramento homes and Peru investment properties. Browse our
              current listings or contact us for off-market opportunities.
            </p>
          </div>
        </section>

        {/* Listings Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ListingsFilter
              listings={all}
              markets={markets}
              cities={cities}
              types={types}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-dark text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4">
              Looking for Something Specific?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              We have access to off-market properties and can help you find
              exactly what you need. Contact us for a personalized search.
            </p>
            <a
              href={`tel:${PHONE}`}
              className="inline-block bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Call {PHONE}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
