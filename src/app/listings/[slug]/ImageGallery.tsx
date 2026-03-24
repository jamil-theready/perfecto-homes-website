"use client";

import { useState } from "react";

export default function ImageGallery({
  images,
  title,
  youtubeVideo,
}: {
  images: string[];
  title: string;
  youtubeVideo?: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0 && !youtubeVideo) return null;

  // Build media array: video first if exists, then images
  const mediaCount = images.length + (youtubeVideo ? 1 : 0);
  const videoIndex = youtubeVideo ? 0 : -1;

  const mainImage = images[0];
  const thumbs = images.slice(1, youtubeVideo ? 4 : 5);
  const remaining = mediaCount - 1 - thumbs.length;

  return (
    <>
      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
          {/* Main Slot: Video or Image */}
          {youtubeVideo ? (
            <div
              className="md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto bg-dark relative cursor-pointer group"
              onClick={() => { setCurrentIndex(0); setLightboxOpen(true); }}
            >
              <img
                src={`https://img.youtube.com/vi/${youtubeVideo}/maxresdefault.jpg`}
                alt="Video tour"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
                Video Tour
              </div>
            </div>
          ) : (
            <div
              className="md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto bg-gray-200 relative cursor-pointer"
              onClick={() => { setCurrentIndex(0); setLightboxOpen(true); }}
            >
              <img
                src={mainImage}
                alt={`${title} - main photo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Thumbnail Grid: first 4 images (or 3 if video took main slot + first image moves here) */}
          {(youtubeVideo ? images.slice(0, 4) : thumbs).map((img, i) => {
            const mediaIdx = youtubeVideo ? i + 1 : i + 1;
            const isLast = i === (youtubeVideo ? 3 : thumbs.length - 1);
            const moreCount = youtubeVideo ? images.length - 4 : remaining;
            return (
              <div
                key={i}
                className="hidden md:block aspect-[4/3] bg-gray-200 relative cursor-pointer"
                onClick={() => { setCurrentIndex(mediaIdx); setLightboxOpen(true); }}
              >
                <img
                  src={img}
                  alt={`${title} - photo ${i + 1}`}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
                {isLast && moreCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">+{moreCount} more</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Mobile: show all button */}
          {mediaCount > 1 && (
            <button
              className="md:hidden absolute bottom-4 right-4 bg-white/90 text-dark text-sm font-semibold px-4 py-2 rounded-lg shadow"
              onClick={() => { setCurrentIndex(0); setLightboxOpen(true); }}
            >
              View All {mediaCount} {youtubeVideo ? "Photos & Video" : "Photos"}
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
            &times;
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/60 text-sm">
            {currentIndex + 1} / {mediaCount}{currentIndex === videoIndex ? " (Video)" : ""}
          </div>

          {/* Previous */}
          {currentIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl font-light z-10 w-12 h-12 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => prev - 1); }}
              aria-label="Previous"
            >
              &lsaquo;
            </button>
          )}

          {/* Next */}
          {currentIndex < mediaCount - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl font-light z-10 w-12 h-12 flex items-center justify-center"
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => prev + 1); }}
              aria-label="Next"
            >
              &rsaquo;
            </button>
          )}

          {/* Content: Image or Video */}
          {currentIndex === videoIndex ? (
            <div
              className="w-[90vw] max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideo}?autoplay=1`}
                title="Property Video Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          ) : (
            <img
              src={images[currentIndex]}
              alt={`${title} - photo ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  );
}
