"use client";

import Image from "next/image";
import { TESTIMONIALS, TESTIMONIAL_PHOTOS } from "@/lib/constants";

/* ── Text testimonials marquee card ── */
function TestimonialCard({
  quote,
  name,
  location,
  image,
}: {
  quote: string;
  name: string;
  location: string;
  image: string;
}) {
  return (
    <li className="flex-shrink-0 w-[340px] bg-white rounded-[10px] p-6 flex flex-col gap-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <Image src={image} alt={name} fill className="object-cover" sizes="48px" />
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{location}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{quote}</p>
    </li>
  );
}

/* ── Photo card ── */
function PhotoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <li className="flex-shrink-0 w-[200px] h-[200px] rounded-[10px] overflow-hidden bg-gray-200 relative">
      <Image src={src} alt={alt} fill className="object-cover" sizes="200px" />
    </li>
  );
}

export default function TestimonialCarousel() {
  // Duplicate items 4x for seamless infinite scroll
  const textItems = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];
  const photoItems = [...TESTIMONIAL_PHOTOS, ...TESTIMONIAL_PHOTOS, ...TESTIMONIAL_PHOTOS, ...TESTIMONIAL_PHOTOS];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="text-center mb-12 px-4">
        <p className="text-xs tracking-[0.16em] uppercase text-gold font-normal mb-3">
          Testimonials
        </p>
        <h2 className="text-3xl md:text-[36px] font-medium text-gray-900 tracking-[-0.06em]">
          What our clients have to say&hellip;
        </h2>
      </div>

      {/* Row 1: Text testimonials — scrolls left */}
      <div className="relative mb-6">
        <ul className="flex gap-5 animate-marquee-left">
          {textItems.map((t, i) => (
            <TestimonialCard key={`t1-${i}`} {...t} />
          ))}
        </ul>
      </div>

      {/* Row 2: Photo testimonials — scrolls right */}
      <div className="relative">
        <ul className="flex gap-5 animate-marquee-right">
          {photoItems.map((p, i) => (
            <PhotoCard key={`p2-${i}`} {...p} />
          ))}
        </ul>
      </div>

    </section>
  );
}
