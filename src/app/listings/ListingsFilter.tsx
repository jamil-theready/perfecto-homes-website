"use client";

import React, { useState, useMemo } from "react";
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
  const status = (listing.status as string) || (listing.listingStatus as string) || "active";
  const featuredImage = (listing.featuredImage as string) || (listing.image1 as string) || "/images/placeholder.jpg";
  const href = listing.market === "peru" ? `/peru/${listing.slug}` : `/listings/${listing.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={featuredImage}
          alt={`${listing.title} - ${listing.city || ""} property`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Price overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent pt-10 pb-3 px-4">
          <p className="text-white text-xl font-bold tracking-tight">{listing.price as string}</p>
        </div>
        {/* Status badge */}
        {status === "pending" && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-amber-600 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Pending
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-4 pb-5 flex-1 flex flex-col">
        {/* Title + Address */}
        <h3 className="text-dark font-semibold text-base leading-snug">
          {listing.title as string}
        </h3>
        <p className="text-medium-gray text-[13px] mt-0.5 mb-3">
          {(listing.address as string) || (listing.city as string) || ""}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-[13px] text-medium-gray">
          {listing.beds && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v11a1 1 0 001 1h16a1 1 0 001-1V7M3 7h18M3 7l2-4h14l2 4M8 14h8M5 19v2M19 19v2" /></svg>
              <span>{listing.beds} bed</span>
            </span>
          )}
          {listing.baths && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 12h16M4 12a2 2 0 01-2-2V6a2 2 0 012-2h1a2 2 0 012 2v1M4 12v4a4 4 0 004 4h8a4 4 0 004-4v-4" /></svg>
              <span>{listing.baths} bath</span>
            </span>
          )}
          {listing.sqft && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              <span>{listing.sqft} sqft</span>
            </span>
          )}
          {listing.landArea && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              <span>{listing.landArea as string}</span>
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-[11px] text-medium-gray uppercase tracking-wider">{listing.propertyType as string}</span>
          <span className="text-gold text-[13px] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Details
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
