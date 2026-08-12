import type { Metadata } from "next";
import { getCollection } from "@/lib/content";
import ListingsFilter from "@/app/listings/ListingsFilter";

export const metadata: Metadata = {
  // This page owns the transactional Peru queries ("homes for sale in cusco peru",
  // "cusco homes for sale", "land for sale in peru"). GSC 90d to 2026-08-08 showed it
  // ranking 26 to 42 for those while /communities/cusco ranked 38 to 43 for the same
  // terms: two pages splitting one intent. /communities/cusco keeps the market and
  // area queries ("cusco real estate", where it already sits at position 10.4).
  // Kept short: the root layout appends " | Perfecto Homes" (17 chars), so anything
  // over ~43 here renders past Google's ~60 char display limit.
  title: "Homes and Land for Sale in Cusco, Peru",
  description:
    "Browse homes, land, and hospitality property for sale in Cusco, Ollantaytambo, and Urubamba, Peru. Foreign buyers welcome at Perfecto Homes.",
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
            Homes and Land for Sale in Cusco and the Sacred Valley
          </h1>
          <p className="text-medium-gray text-lg max-w-2xl">
            Investment properties in Cusco, Ollantaytambo, and Urubamba. Land, hotels, and commercial opportunities near Machu Picchu.
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
