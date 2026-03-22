"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ContentItem } from "@/lib/content";

export default function ListingsFilter({
  listings,
  markets,
  cities,
  types,
}: {
  listings: ContentItem[];
  markets: string[];
  cities: string[];
  types: string[];
}) {
  const [market, setMarket] = useState("all");
  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("price-desc");

  const filtered = useMemo(() => {
    let result = [...listings];

    if (market !== "all") result = result.filter((l) => l.market === market);
    if (city !== "all") result = result.filter((l) => l.city === city);
    if (type !== "all") result = result.filter((l) => l.propertyType === type);

    result.sort((a, b) => {
      const pa = Number(a.priceNumeric || 0);
      const pb = Number(b.priceNumeric || 0);
      if (sort === "price-asc") return pa - pb;
      return pb - pa;
    });

    return result;
  }, [listings, market, city, type, sort]);

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={market}
          onChange={(e) => { setMarket(e.target.value); setCity("all"); }}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-dark focus:ring-2 focus:ring-gold focus:border-transparent"
        >
          <option value="all">All Markets</option>
          {markets.map((m) => (
            <option key={m} value={m}>{m === "sacramento" ? "Sacramento, CA" : "Peru"}</option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-dark focus:ring-2 focus:ring-gold focus:border-transparent"
        >
          <option value="all">All Cities</option>
          {cities
            .filter((c) => market === "all" || listings.some((l) => l.city === c && l.market === market))
            .map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-dark focus:ring-2 focus:ring-gold focus:border-transparent"
        >
          <option value="all">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-dark focus:ring-2 focus:ring-gold focus:border-transparent"
        >
          <option value="price-desc">Price: High to Low</option>
          <option value="price-asc">Price: Low to High</option>
        </select>

        <div className="ml-auto flex items-center text-sm text-medium-gray">
          {filtered.length} {filtered.length === 1 ? "property" : "properties"}
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-medium-gray text-lg">No properties match your filters.</p>
          <button
            onClick={() => { setMarket("all"); setCity("all"); setType("all"); }}
            className="mt-4 text-gold font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </div>
      )}
    </>
  );
}

function ListingCard({ listing }: { listing: ContentItem }) {
  const status = (listing.status as string) || "active";
  const statusColor =
    status === "active" ? "bg-green-500" :
    status === "pending" ? "bg-yellow-500" :
    status === "sold" ? "bg-red-500" : "bg-gray-500";

  const featuredImage = (listing.featuredImage as string) || (listing.image1 as string) || "/images/placeholder.jpg";
  const marketLabel = listing.market === "peru" ? "Peru" : "Sacramento";
  const href = listing.market === "peru" ? `/peru/${listing.slug}` : `/listings/${listing.slug}`;

  return (
    <Link
      href={href}
      className="group rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          src={featuredImage}
          alt={`${listing.title} - ${listing.city || ""} property for sale`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`${statusColor} text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide`}>
            {status}
          </span>
          <span className="bg-dark/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {marketLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <p className="text-2xl font-bold text-dark mb-1">
          {listing.price as string}
        </p>

        {/* Stats Row */}
        {(listing.beds || listing.baths || listing.sqft) && (
          <div className="flex items-center gap-4 text-sm text-medium-gray mb-3">
            {listing.beds && <span className="font-medium">{listing.beds} bed</span>}
            {listing.baths && <span className="font-medium">{listing.baths} bath</span>}
            {listing.sqft && <span className="font-medium">{listing.sqft} sqft</span>}
            {listing.landArea && <span className="font-medium">{listing.landArea}</span>}
          </div>
        )}

        {/* Address */}
        <p className="text-dark font-semibold text-[15px] mb-1">
          {listing.title as string}
        </p>
        <p className="text-medium-gray text-sm">
          {(listing.address as string) || (listing.city as string) || ""}
        </p>

        {/* Property Type */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-medium-gray uppercase tracking-wider">
            {listing.propertyType as string}
          </span>
          <span className="text-gold text-sm font-semibold group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
