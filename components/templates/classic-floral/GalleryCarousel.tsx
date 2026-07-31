"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface GalleryCarouselProps {
  galleryImages: string[];
}

const DEFAULT_MOMENTS_PLACEHOLDERS = [
  "/images/templates/gallery-1.jpg",
  "/images/templates/gallery-2.jpg",
  "/images/templates/gallery-3.jpg",
  "/images/templates/gallery-4.jpg",
  "/images/templates/gallery-5.jpg",
  "/images/templates/gallery-6.jpg",
];

export default function GalleryCarousel({ galleryImages }: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);

  // Filter out any empty/uninitialized strings
  const validImages = galleryImages?.filter((img) => Boolean(img && img.trim())) || [];
  const activeList = validImages.length > 0 ? validImages : DEFAULT_MOMENTS_PLACEHOLDERS;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeList.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === activeList.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="py-24 md:py-32 bg-[#FDF6F3] relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-[1px] bg-[#C9A15A]" />
            <Heart className="w-4 h-4 text-[#B85C6B] fill-current" />
            <div className="w-10 h-[1px] bg-[#C9A15A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-accent text-[#2B2320]">
            Our Moments
          </h2>
          <p className="text-sm sm:text-base text-[#2B2320]/75 mt-3">
            Glimpses of our journey, laughter, and special celebrations.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Display Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[320px] sm:h-[480px] w-full rounded-3xl overflow-hidden card-shadow border-2 border-[#C9A15A]/30 group cursor-pointer"
            onClick={() => setActiveLightbox(activeList[currentIndex] || activeList[0])}
          >
            <Image
              src={activeList[currentIndex] || activeList[0]}
              alt={`Gallery moment ${currentIndex + 1}`}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B2320]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-6">
              <span className="p-3 rounded-full bg-[#B85C6B] text-[#FDF6F3] shadow-lg">
                <Maximize2 className="w-5 h-5 text-[#C9A15A]" />
              </span>
            </div>
          </motion.div>

          {/* Desktop & Mobile Arrow Controls */}
          {activeList.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute top-1/2 -left-4 sm:-left-6 -translate-y-1/2 w-12 h-12 rounded-full bg-[#FDF6F3]/90 text-[#2B2320] border border-[#C9A15A] flex items-center justify-center shadow-lg hover:bg-[#B85C6B] hover:text-[#FDF6F3] transition-all"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute top-1/2 -right-4 sm:-right-6 -translate-y-1/2 w-12 h-12 rounded-full bg-[#FDF6F3]/90 text-[#2B2320] border border-[#C9A15A] flex items-center justify-center shadow-lg hover:bg-[#B85C6B] hover:text-[#FDF6F3] transition-all"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Thumbnails Track */}
          {activeList.length > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6 overflow-x-auto py-2">
              {activeList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    currentIndex === idx
                      ? "border-[#B85C6B] scale-105 shadow-md"
                      : "border-[#C9A15A]/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2B2320]/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveLightbox(null)}
          >
            <div className="relative max-w-4xl w-full max-h-[85vh] h-[550px] rounded-3xl overflow-hidden border border-[#C9A15A]/40">
              <Image
                src={activeLightbox}
                alt="Full preview"
                fill
                className="object-contain"
              />
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#B85C6B] text-[#FDF6F3] hover:scale-110 transition-transform shadow-lg"
              >
                <X className="w-6 h-6 text-[#C9A15A]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
