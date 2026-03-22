"use client";

import { useState } from "react";

export default function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const mainImage = images[0];
  const thumbs = images.slice(1, 5);
  const remaining = images.length - 5;

  return (
    <>
      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => { setCurrentIndex(0); setLightboxOpen(true); }}
        >
          {/* Main Image */}
          <div className="md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto bg-gray-200 relative">
            <img
              src={mainImage}
              alt={`${title} - main photo`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Grid */}
          {thumbs.map((img, i) => (
            <div
              key={i}
              className="hidden md:block aspect-[4/3] bg-gray-200 relative"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i + 1);
                setLightboxOpen(true);
              }}
            >
              <img
                src={img}
                alt={`${title} - photo ${i + 2}`}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
              {/* Show count on last thumb if more photos */}
              {i === thumbs.length - 1 && remaining > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    +{remaining} more
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Mobile: show all button */}
          {images.length > 1 && (
            <button
              className="md:hidden absolute bottom-4 right-4 bg-white/90 text-dark text-sm font-semibold px-4 py-2 rounded-lg shadow"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(0);
                setLightboxOpen(true);
              }}
            >
              View All {images.length} Photos
            </button>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10 text-3xl font-light"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close gallery"
          >
            ×
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/60 text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Previous */}
          {currentIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl font-light z-10 w-12 h-12 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => prev - 1);
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          {/* Next */}
          {currentIndex < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl font-light z-10 w-12 h-12 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => prev + 1);
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          )}

          {/* Image */}
          <img
            src={images[currentIndex]}
            alt={`${title} - photo ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
