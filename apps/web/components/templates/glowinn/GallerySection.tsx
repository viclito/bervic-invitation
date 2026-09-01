"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface GalleryItem {
  src: string;
  caption?: string;
  span?: string;
}

export interface GallerySectionProps {
  images?: (string | GalleryItem)[];
}

const DEFAULT_GALLERY_FALLBACKS = [
  "/images/templates/gallery-1.jpg",
  "/images/templates/gallery-2.jpg",
  "/images/templates/gallery-3.jpg",
  "/images/templates/gallery-4.jpg",
  "/images/templates/gallery-5.jpg",
  "/images/templates/gallery-6.jpg",
];

function SafeGalleryImage({
  src,
  alt,
  className,
  sizes,
  fallbackIdx = 0,
}: {
  src: string;
  alt: string;
  className: string;
  sizes?: string;
  fallbackIdx?: number;
}) {
  const fallback = DEFAULT_GALLERY_FALLBACKS[fallbackIdx % DEFAULT_GALLERY_FALLBACKS.length];
  const [currentSrc, setCurrentSrc] = useState(src || fallback);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || fallback);
    setErrored(false);
  }, [src, fallback]);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      onError={() => {
        if (!errored) {
          setErrored(true);
          setCurrentSrc(fallback);
        }
      }}
    />
  );
}

export default function GallerySection({ images }: GallerySectionProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Dynamic span pattern for big & small asymmetric premium bento grid
  const getBentoSpanClass = (index: number) => {
    const pattern = index % 5;
    if (pattern === 0) return "glowinn-bento--hero"; // Large wide/tall feature
    if (pattern === 1) return "glowinn-bento--tall"; // Tall portrait
    if (pattern === 2) return "glowinn-bento--small"; // Compact square
    if (pattern === 3) return "glowinn-bento--small"; // Compact square
    return "glowinn-bento--wide"; // Wide landscape
  };

  const isBrokenAsset = (url: string) => typeof url === "string" && url.includes("vwq4boeadk1rfshnhmq");

  const rawList =
    images && images.length > 0
      ? images.filter((item) => {
          const s = typeof item === "string" ? item : item?.src;
          return s && !isBrokenAsset(s);
        })
      : [];

  const effectiveImages = rawList.length > 0 ? rawList : DEFAULT_GALLERY_FALLBACKS;

  const normalizedImages: (GalleryItem & { bentoClass: string })[] =
    effectiveImages.map((item, i) => {
      const base =
        typeof item === "string"
          ? { src: item, caption: `Moment 0${i + 1}` }
          : { src: item.src, caption: item.caption || `Moment 0${i + 1}` };
      return {
        ...base,
        bentoClass: getBentoSpanClass(i),
      };
    });

  // GSAP Viewport ScrollTrigger Animation for Bento items
  useEffect(() => {
    if (!gridRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      gsap.fromTo(
        gridRef.current!.children,
        { opacity: 0, scale: 0.93, y: 35 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [images]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIdx]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((prev) => (prev! > 0 ? prev! - 1 : normalizedImages.length - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((prev) => (prev! < normalizedImages.length - 1 ? prev! + 1 : 0));
    }
  };

  if (normalizedImages.length === 0) {
    return null;
  }

  const activeItem = selectedIdx !== null ? normalizedImages[selectedIdx] : null;

  return (
    <section ref={sectionRef} className="glowinn-section" id="gallery">
      <div className="shell">
        {/* Section Header */}
        <div ref={headerRef} className="glowinn-section__header">
          <span className="glowinn-section__badge">
            <Camera className="w-3.5 h-3.5" />
            <span>Captured Memories</span>
          </span>
          <h2 className="glowinn-section__title">Our Moments</h2>
          <p className="glowinn-section__subtitle">
            A curated gallery of cherished memories. Tap any photo to expand in full view.
          </p>
        </div>

        {/* Unique Premium Bento Grid: Big & Small Frames */}
        <div ref={gridRef} className="glowinn-gallery-bento-grid">
          {normalizedImages.map((img, idx) => (
            <div
              key={idx}
              className={`glowinn-glass-card glowinn-bento-card ${img.bentoClass} group`}
              onClick={() => setSelectedIdx(idx)}
            >
              <div className="glowinn-bento-card__media">
                <SafeGalleryImage
                  src={img.src}
                  alt={img.caption || `Gallery moment ${idx + 1}`}
                  className="object-cover transition-transform duration-700 group-hover:scale-106"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 450px"
                  fallbackIdx={idx}
                />
                <div className="glowinn-bento-card__overlay">
                  <div className="glowinn-bento-card__zoom-btn">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                  {img.caption && (
                    <p className="glowinn-bento-card__caption">{img.caption}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LIGHTBOX MODAL ── */}
      {selectedIdx !== null && activeItem && (
        <div
          className="glowinn-lightbox-backdrop"
          onClick={() => setSelectedIdx(null)}
        >
          {/* Close button */}
          <button
            type="button"
            className="glowinn-lightbox-close"
            onClick={() => setSelectedIdx(null)}
            aria-label="Close photo"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          {normalizedImages.length > 1 && (
            <>
              <button
                type="button"
                className="glowinn-lightbox-nav glowinn-lightbox-nav--prev"
                onClick={handlePrev}
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                className="glowinn-lightbox-nav glowinn-lightbox-nav--next"
                onClick={handleNext}
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Large Image Modal */}
          <div
            className="glowinn-lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glowinn-lightbox-media">
              <SafeGalleryImage
                src={activeItem.src}
                alt={activeItem.caption || "Full size photo"}
                className="object-contain"
                sizes="(max-width: 1200px) 95vw, 1100px"
                fallbackIdx={selectedIdx}
              />
            </div>
            {activeItem.caption && (
              <div className="glowinn-lightbox-info">
                <p className="text-sm font-medium text-white/90">{activeItem.caption}</p>
                <span className="text-xs text-white/50">
                  {selectedIdx + 1} / {normalizedImages.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
