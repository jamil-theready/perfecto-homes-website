import type { Metadata } from "next";
import { getCollection } from "@/lib/content";
import ListingsFilter from "@/app/listings/ListingsFilter";

export const metadata: Metadata = {
  title: "Sacred Valley Peru Properties for Sale",
  description:
    "Investment property for sale in Peru's Sacred Valley. Land, hotels and restaurants in Ollantaytambo, Urubamba and Cusco.",
  alternates: { canonical: "/peru" },
};

export default function PeruListingsPage() {
  const peru = getCollection("peru");
  peru.forEach((l) => { l.market = "peru"; });

  const all = [...peru].sort((a, b) => {
    const pa = Number(a.priceNumeric || 0);
    const pb = Number(b.priceNumeric || 0);
    return pb - pa;
  });

  const markets = [...new Set(all.map((l) => String(l.market)))];
  const cities = [...new Set(all.map((l) => String(l.city || "").split(",")[0].trim()).filter(Boolean))];
  const types = [...new Set(all.map((l) => String(l.propertyType || "")).filter(Boolean))];

  return (
    <div className="bg-light-gray min-h-screen pt-24">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">Sacred Valley, Peru</p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dark mb-3">
            Peru Listings
          </h1>
          <p className="text-medium-gray text-lg max-w-2xl">
            Investment properties in Peru's Sacred Valley. Land, hotels, and commercial opportunities near Machu Picchu.
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
