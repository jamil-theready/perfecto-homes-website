import type { Metadata } from "next";
import { getCollection, ContentItem } from "@/lib/content";
import ListingsFilter from "./ListingsFilter";

export const metadata: Metadata = {
  title: "Sacramento Homes for Sale | Perfecto Homes Real Estate",
  description:
    "Browse homes for sale in Sacramento, Roseville, Elk Grove, Citrus Heights, and surrounding areas. Perfecto Homes Real Estate.",
};

export default function ListingsPage() {
  const sacramento = getCollection("listings/sacramento");
  sacramento.forEach((l) => { l.market = "sacramento"; });

  const all = [...sacramento].sort((a, b) => {
    const pa = Number(a.priceNumeric || 0);
    const pb = Number(b.priceNumeric || 0);
    return pb - pa;
  });

  const markets = [...new Set(all.map((l) => String(l.market)))];
  const cities = [...new Set(all.map((l) => String(l.city || "")).filter(Boolean))];
  const types = [...new Set(all.map((l) => String(l.propertyType || "")).filter(Boolean))];

  return (
    <div className="bg-light-gray min-h-screen pt-24">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">Sacramento Real Estate</p>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dark mb-3">
              Sacramento Listings
            </h1>
            <p className="text-medium-gray text-lg max-w-2xl">
              Homes for sale in Sacramento and surrounding communities. Contact us for off-market opportunities.
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

    </div>
  );
}
