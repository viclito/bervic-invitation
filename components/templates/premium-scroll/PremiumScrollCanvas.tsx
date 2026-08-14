"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  Heart,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Volume2,
  VolumeX,
  Phone,
  Calendar,
  Compass,
} from "lucide-react";

import { getWeddingTargetDate } from "@/lib/dateUtils";

const TOTAL_SCENE3_FRAMES = 288;
const TOTAL_FRAMES = TOTAL_SCENE3_FRAMES;

// Helper to build 288 frame image URLs (WebP format for 960x540 resolution)
const FRAME_PATHS: string[] = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const frameNum = String(i + 1).padStart(4, "0");
  return `/frames/scene3/frame-${frameNum}.webp`;
});

export interface EventItem {
  time: string;
  title: string;
  location?: string;
  description?: string;
}

export interface LocationItem {
  title?: string;
  name: string;
  address: string;
  time?: string;
  mapUrl?: string;
}

export interface PremiumScrollCanvasProps {
  partnerOne?: string;
  partnerTwo?: string;
  tagline?: string;
  inviteLine?: string;
  weddingDate?: string;
  weddingTime?: string;
  groomImage?: string;
  brideImage?: string;
  coupleImage?: string;
  partnerTwoImage?: string;
  events?: EventItem[];
  locations?: LocationItem[];
  galleryImages?: string[];
  guestName?: string;
  contactPhone?: string;
  contactAddress?: string;
  onExploreClick?: () => void;
  onSelectBlessing?: (blessing: string) => void;
  bgAudioUrl?: string;
}

export default function PremiumScrollCanvas({
  partnerOne = "Your Name",
  partnerTwo = "Partner Name",
  tagline = "ROYAL WEDDING CELEBRATION",
  inviteLine = "Together with their families, invite you to celebrate their union of love and togetherness",
  weddingDate = "December 18, 2026",
  weddingTime = "4:00 PM Onwards",
  groomImage,
  brideImage,
  coupleImage,
  partnerTwoImage,
  guestName = "Honored Guest",
  contactPhone,
  contactAddress,
  onExploreClick,
  onSelectBlessing,
  events = [
    {
      time: "03:30 PM",
      title: "Royal Guest Welcome & Refreshments",
      location: "Grand Heritage Courtyard",
      description: "Welcome elixirs & traditional live instrumental ensemble",
    },
    {
      time: "05:00 PM",
      title: "Holy Wedding Ceremony",
      location: "Royal Heritage Pavilion",
      description: "Exchange of vows and ceremonial blessings",
    },
    {
      time: "07:30 PM",
      title: "Grand Royal Feast & Reception",
      location: "The Imperial Ballroom",
      description: "Gala banquet, champagne toast, and celebratory dancing",
    },
  ],
  locations = [
    {
      title: "Wedding Ceremony",
      name: "Royal Heritage Pavilion",
      address: "Palace Road, Heritage Enclave",
      time: "05:00 PM",
      mapUrl: "https://maps.google.com",
    },
    {
      title: "Grand Gala Reception",
      name: "The Imperial Ballroom",
      address: "77 Crown Boulevard, Heritage Estate",
      time: "07:30 PM",
      mapUrl: "https://maps.google.com",
    },
  ],
  galleryImages = [
    "/images/templates/gallery-1.jpg",
    "/images/templates/gallery-2.jpg",
    "/images/templates/gallery-3.jpg",
    "/images/templates/gallery-4.jpg",
  ],
  bgAudioUrl,
  ...restProps
}: PremiumScrollCanvasProps & { coverImage?: string; heroImage?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Photo Resolution
  const rawCoupleImg = coupleImage?.trim() || "";
  const rawPartnerTwoImg = partnerTwoImage?.trim() || "";
  const rawGroomImg = groomImage?.trim() || "";
  const rawBrideImg = brideImage?.trim() || "";
  const rawCoverImg = restProps.coverImage?.trim() || "";
  const rawHeroImg = restProps.heroImage?.trim() || "";

  const bridePhoto =
    rawBrideImg ||
    rawCoupleImg ||
    rawCoverImg ||
    rawHeroImg ||
    "/images/templates/groom-bride-1.jpg";

  const groomPhoto =
    rawGroomImg ||
    rawPartnerTwoImg ||
    (rawCoverImg && rawCoverImg !== bridePhoto ? rawCoverImg : "") ||
    "/images/templates/groom-bride-2.jpg";
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );

  // Preloader State
  const [loadedTotalCount, setLoadedTotalCount] = useState(0);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  // Lightbox Modal State
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Gallery items formatted with high-end editorial metadata
  const resolvedGallery = [
    {
      url: galleryImages?.[0] || "/images/templates/gallery-1.jpg",
      title: "The Holy Vows",
      subtitle: "A sacred moment under the royal mandap",
      category: "Featured Moment",
    },
    {
      url: galleryImages?.[1] || "/images/templates/gallery-2.jpg",
      title: "Golden Sunset",
      subtitle: "Hand in hand under the autumn sky",
      category: "Romance",
    },
    {
      url: galleryImages?.[2] || "/images/templates/gallery-3.jpg",
      title: "Royal Celebration",
      subtitle: "Surrounded by loved ones & classical music",
      category: "Celebration",
    },
    {
      url: galleryImages?.[3] || "/images/templates/gallery-4.jpg",
      title: "Gala Banquet",
      subtitle: "Candlelit feast and champagne toast",
      category: "Reception",
    },
    {
      url: galleryImages?.[4] || "/images/templates/gallery-5.jpg",
      title: "Rings & Promises",
      subtitle: "Everlasting bond of love & unity",
      category: "Details",
    },
    {
      url: galleryImages?.[5] || "/images/templates/gallery-6.jpg",
      title: "The First Dance",
      subtitle: "Dancing under twinkling golden lights",
      category: "Memories",
    },
  ];

  // Audio State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Smooth frame scrubbing animation refs (Starts at frame 3 to eliminate initial black background)
  const INITIAL_FRAME_INDEX = 3;
  const currentFrameRef = useRef<number>(INITIAL_FRAME_INDEX);
  const targetFrameRef = useRef<number>(INITIAL_FRAME_INDEX);

  // Eased progress ref to eliminate text box flickering during scroll
  const smoothProgressRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);
  const lastStateProgressRef = useRef<number>(-1);

  const rafIdRef = useRef<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [blessingCount, setBlessingCount] = useState(210);

  // Live Wedding Countdown Calculation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPassed: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetDate = getWeddingTargetDate(weddingDate, weddingTime);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingDate, weddingTime]);

  // Draw frame with object-fit: cover matrix calculation
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prevIdx = frameIndex - offset;
        const nextIdx = frameIndex + offset;

        if (prevIdx >= 0 && imagesRef.current[prevIdx]?.complete) {
          img = imagesRef.current[prevIdx];
          break;
        }
        if (nextIdx < TOTAL_FRAMES && imagesRef.current[nextIdx]?.complete) {
          img = imagesRef.current[nextIdx];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let renderWidth = canvasWidth;
    let renderHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      renderHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - renderHeight) / 2;
    } else {
      renderWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - renderWidth) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  }, []);

  // High-DPI Canvas Resizing with Mobile Address Bar Guard
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const newWidth = Math.round(rect.width * dpr);
    const newHeight = Math.round(rect.height * dpr);

    if (canvas.width === newWidth && Math.abs(canvas.height - newHeight) < 140) {
      return;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

    const roundedIndex = Math.min(
      Math.max(Math.round(currentFrameRef.current), INITIAL_FRAME_INDEX),
      TOTAL_FRAMES - 1
    );
    drawFrame(roundedIndex);
  }, [drawFrame]);

  // Progressive Batch Preloader for 288 WebP Frames
  useEffect(() => {
    let isCancelled = false;
    let totalCount = 0;

    const loadFrame = (index: number): Promise<void> => {
      if (imagesRef.current[index]) return Promise.resolve();

      return new Promise((resolve) => {
        const img = new Image();
        img.src = FRAME_PATHS[index];

        img.onload = () => {
          if (isCancelled) return resolve();
          imagesRef.current[index] = img;

          totalCount++;
          setLoadedTotalCount(totalCount);

          if (totalCount === TOTAL_FRAMES) {
            setIsSceneReady(true);
            setIsFullyLoaded(true);
          }
          resolve();
        };

        img.onerror = () => {
          if (isCancelled) return resolve();
          totalCount++;
          setLoadedTotalCount(totalCount);
          if (totalCount === TOTAL_FRAMES) {
            setIsSceneReady(true);
            setIsFullyLoaded(true);
          }
          resolve();
        };
      });
    };

    const loadAllFrames = async () => {
      const batchSize = 16;
      for (let i = 0; i < TOTAL_FRAMES; i += batchSize) {
        if (isCancelled) break;
        const batch = Array.from(
          { length: Math.min(batchSize, TOTAL_FRAMES - i) },
          (_, k) => loadFrame(i + k)
        );
        await Promise.all(batch);
      }

      if (!isCancelled) {
        setIsSceneReady(true);
        setIsFullyLoaded(true);
      }
    };

    loadAllFrames();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Auto-scroll to Y: 3px upon preloader completion / unveil (eliminates initial black background at Y: 0px)
  useEffect(() => {
    if (!isFullyLoaded) return;

    const timer = setTimeout(() => {
      const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
        if (!node) return window;
        let parent = node.parentElement;
        while (parent && parent !== document.body) {
          const overflowY = window.getComputedStyle(parent).overflowY;
          if (overflowY === "auto" || overflowY === "scroll") {
            return parent;
          }
          parent = parent.parentElement;
        }
        return window;
      };

      const scrollTarget = getScrollParent(containerRef.current);
      if (scrollTarget === window) {
        window.scrollTo({ top: 3, behavior: "auto" });
      } else {
        (scrollTarget as HTMLElement).scrollTop = 3;
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isFullyLoaded]);

  // Handle Resize
  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);
    return () => window.removeEventListener("resize", updateCanvasDimensions);
  }, [updateCanvasDimensions]);

  // Smooth Lerp Loop & Scroll Listener
  useEffect(() => {
    if (!isSceneReady) return;

    updateCanvasDimensions();

    const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
      if (!node) return window;
      let parent = node.parentElement;
      while (parent && parent !== document.body) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        if (overflowY === "auto" || overflowY === "scroll") {
          return parent;
        }
        parent = parent.parentElement;
      }
      return window;
    };

    const targetScrollParent = getScrollParent(containerRef.current);

    const handleScroll = () => {
      if (!containerRef.current) return;

      let progress = 0;

      if (targetScrollParent === window) {
        const rect = containerRef.current.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;

        if (totalScrollable <= 0) return;

        const scrolled = -rect.top;
        progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      } else {
        const parent = targetScrollParent as HTMLElement;
        const totalScrollable = containerRef.current.offsetHeight - parent.clientHeight;

        if (totalScrollable <= 0) return;

        const scrolled = parent.scrollTop;
        progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      }

      targetProgressRef.current = progress;
      targetFrameRef.current =
        INITIAL_FRAME_INDEX + progress * (TOTAL_FRAMES - 1 - INITIAL_FRAME_INDEX);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    if (targetScrollParent !== window) {
      targetScrollParent.addEventListener("scroll", handleScroll, { passive: true });
    }
    handleScroll();

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const tick = () => {
      const isMobile =
        typeof window !== "undefined" &&
        (window.innerWidth < 768 || "ontouchstart" in window);

      const lerpFactor = isMobile ? 1.0 : 0.16;

      const frameDiff = Math.abs(targetFrameRef.current - currentFrameRef.current);
      if (frameDiff > 0.01) {
        currentFrameRef.current = isMobile
          ? targetFrameRef.current
          : lerp(currentFrameRef.current, targetFrameRef.current, lerpFactor);
        drawFrame(Math.round(currentFrameRef.current));
      }

      const progDiff = Math.abs(targetProgressRef.current - smoothProgressRef.current);
      if (progDiff > 0.0002) {
        smoothProgressRef.current = isMobile
          ? targetProgressRef.current
          : lerp(smoothProgressRef.current, targetProgressRef.current, lerpFactor);

        const stateThreshold = isMobile ? 0.005 : 0.001;
        if (Math.abs(smoothProgressRef.current - lastStateProgressRef.current) >= stateThreshold) {
          lastStateProgressRef.current = smoothProgressRef.current;
          setScrollProgress(smoothProgressRef.current);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (targetScrollParent !== window) {
        targetScrollParent.removeEventListener("scroll", handleScroll);
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isSceneReady, drawFrame, updateCanvasDimensions]);

  // Audio Toggle
  const toggleAudio = () => {
    if (!audioRef.current && bgAudioUrl) {
      audioRef.current = new Audio(bgAudioUrl);
      audioRef.current.loop = true;
    }
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
      }
    }
  };

  // Helper for scroll section range styles
  const calculateRangeStyle = (
    start: number,
    end: number,
    options?: { fadeInRatio?: number; fadeOutRatio?: number; isHero?: boolean }
  ) => {
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || "ontouchstart" in window);

    const p = scrollProgress;
    if (p < start || p > end) {
      return {
        opacity: 0,
        transform: isMobile ? "translate3d(0, 20px, 0)" : "translate3d(0, 40px, 0)",
        pointerEvents: "none" as const,
        display: "none" as const,
        visibility: "hidden" as const,
      };
    }

    const duration = end - start;
    const fadeInRatio = options?.fadeInRatio ?? 0.22;
    const fadeOutRatio = options?.fadeOutRatio ?? 0.78;

    let opacity = 1;

    if (options?.isHero) {
      const fadeOutStart = start + duration * fadeOutRatio;
      if (p > fadeOutStart) {
        opacity = 1 - (p - fadeOutStart) / (end - fadeOutStart);
      }
    } else {
      const fadeInEnd = start + duration * fadeInRatio;
      const fadeOutStart = start + duration * fadeOutRatio;

      if (p < fadeInEnd) {
        opacity = (p - start) / (fadeInEnd - start);
      } else if (p > fadeOutStart) {
        opacity = 1 - (p - fadeOutStart) / (end - fadeOutStart);
      }
    }

    opacity = Math.max(0, Math.min(1, opacity));
    const isVisible = opacity > 0.05;

    return {
      opacity,
      transform: "none",
      pointerEvents: isVisible ? ("auto" as const) : ("none" as const),
      display: opacity < 0.02 ? ("none" as const) : ("flex" as const),
      visibility: isVisible ? ("visible" as const) : ("hidden" as const),
    };
  };

  // Section Ranges (Strict non-overlapping milestones)
  const styleHero = calculateRangeStyle(0.0, 0.14, { isHero: true, fadeOutRatio: 0.6 });
  const styleStory = calculateRangeStyle(0.12, 0.26, { fadeInRatio: 0.25, fadeOutRatio: 0.75 });
  const styleTimeline = calculateRangeStyle(0.25, 0.43, { fadeInRatio: 0.2, fadeOutRatio: 0.8 });
  const styleLocations = calculateRangeStyle(0.42, 0.58, { fadeInRatio: 0.2, fadeOutRatio: 0.8 });
  const styleGallery = calculateRangeStyle(0.57, 0.75, { fadeInRatio: 0.2, fadeOutRatio: 0.8 });
  const styleRsvp = calculateRangeStyle(0.74, 0.89, { fadeInRatio: 0.2, fadeOutRatio: 0.85 });
  const styleFinale = calculateRangeStyle(0.88, 1.00, { fadeInRatio: 0.2, fadeOutRatio: 1.0 });

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#051811] text-[#FDF6F3] font-sans overflow-clip"
      style={{ height: "650vh" }}
    >
      {/* 1. Royal Guest Preloader Screen */}
      <AnimatePresence>
        {!isFullyLoaded && (
          <motion.div
            key="royal-preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#03110b] text-[#F8F3EA] px-4 sm:px-6 text-center select-none overflow-y-auto"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D9A441]/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-md w-full bg-[#062016]/90 backdrop-blur-xl border-2 border-[#D9A441]/40 p-6 sm:p-9 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col items-center text-center relative z-10 my-auto"
            >
              <div className="w-14 h-14 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/50 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(217,164,65,0.35)]">
                <Sparkles className="w-7 h-7 text-[#D9A441] animate-pulse" />
              </div>

              <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold mb-1">
                Royal Invitation Suite
              </span>

              <h3 className="text-xl sm:text-2xl font-serif italic text-[#FDF6F3] mb-3">
                {guestName || "Honored Guest"}
              </h3>

              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D9A441]/60 to-transparent mb-4" />

              <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#D9A441]/90 font-medium mb-1">
                {tagline}
              </p>

              <h2 className="text-3xl sm:text-4xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7C4] via-[#D9A441] to-[#F7E7C4] tracking-wide my-1">
                {partnerOne} <span className="text-[#D9A441] font-normal">&amp;</span> {partnerTwo}
              </h2>

              <p className="text-xs sm:text-sm text-[#F8F3EA]/85 font-light italic mt-1 mb-5 leading-relaxed max-w-xs">
                {inviteLine}
              </p>

              <div className="px-4 py-2 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/40 text-[11px] sm:text-xs text-[#D9A441] font-semibold tracking-wider uppercase mb-6 shadow-inner">
                {weddingTime || `${weddingDate} • 4:00 PM Onwards`}
              </div>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-[10px] sm:text-xs text-[#D9A441] tracking-wider font-mono">
                  <span>LOADING ROYAL CINEMATIC SCENE</span>
                  <span>{Math.round((loadedTotalCount / TOTAL_FRAMES) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#04140d] rounded-full overflow-hidden relative border border-[#D9A441]/30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#D9A441]/60 via-[#F7E7C4] to-[#D9A441] shadow-[0_0_12px_#D9A441]"
                    style={{ width: `${Math.round((loadedTotalCount / TOTAL_FRAMES) * 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Sticky Canvas Container */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden z-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block filter brightness-[0.94] contrast-[1.05]"
        />

        {/* Ambient Top/Bottom Shadow Overlay for Text Legibility */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#03110b]/80 via-transparent to-[#03110b]/85 z-10" />

        {/* Audio Floating Toggle Button */}
        {bgAudioUrl && (
          <button
            onClick={toggleAudio}
            aria-label="Toggle Background Music"
            className="fixed top-6 right-6 z-40 p-3 rounded-full bg-[#062016]/80 border border-[#D9A441]/40 text-[#D9A441] backdrop-blur-md hover:bg-[#062016] transition-all hover:scale-105 shadow-[0_0_15px_rgba(217,164,65,0.25)]"
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-[#D9A441] animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-[#D8C49F]/60" />
            )}
          </button>
        )}

        {/* Right Corner Scroll Height & Progress HUD Badge */}
        <div className="fixed top-20 right-3 sm:top-24 sm:right-6 z-40 flex items-center gap-2 text-[10px] sm:text-xs font-mono text-[#D9A441] bg-[#03110b]/90 px-3 py-1.5 rounded-full border border-[#D9A441]/40 backdrop-blur-md shadow-[0_0_15px_rgba(217,164,65,0.25)] pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-pulse" />
          <span>Y: {Math.round(scrollProgress * 5500)}px</span>
          <span className="text-[#D9A441]/40">•</span>
          <span className="font-bold">{Math.round(scrollProgress * 100)}%</span>
          <span className="text-[#D9A441]/40 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[10px] text-[#FDF6F3]/70">Frame: {Math.round(scrollProgress * (TOTAL_FRAMES - 1))}/{TOTAL_FRAMES - 1}</span>
        </div>

        {/* Right Screen Edge Vertical Scroll Progress Indicator Track */}
        <div className="fixed right-1 sm:right-2 top-1/2 -translate-y-1/2 h-44 sm:h-64 w-1 sm:w-1.5 rounded-full bg-white/10 border border-[#D9A441]/20 z-40 pointer-events-none overflow-hidden">
          <div
            className="w-full bg-gradient-to-b from-[#D9A441] via-[#F7E7C4] to-[#D9A441] rounded-full transition-all duration-75 shadow-[0_0_8px_#D9A441]"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Gold Scroll Indicator Bar */}
        <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-[#03110b]">
          <div
            className="h-full bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] transition-all duration-75 shadow-[0_0_8px_#D9A441]"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* ── SECTION 1: HERO TITLE ── */}
        <div
          style={styleHero}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none"
        >
          <div className="max-w-3xl w-full flex flex-col items-center justify-center">
            <span className="text-xs sm:text-sm uppercase tracking-[0.45em] text-[#F7E7C4] font-semibold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              {tagline}
            </span>
            <h1 className="text-4xl sm:text-7xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#F3C46B] to-[#FFF5D0] leading-tight my-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] filter">
              {partnerOne} <span className="text-[#F3C46B] font-normal">&amp;</span> {partnerTwo}
            </h1>
            <p className="text-xs sm:text-lg text-[#FDF6F3] font-light italic max-w-lg mx-auto my-3 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              {inviteLine}
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#000000]/40 border border-[#D9A441]/50 text-[#F7E7C4] text-xs sm:text-sm font-semibold tracking-widest uppercase mt-4 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              <Calendar className="w-4 h-4 text-[#D9A441]" />
              <span>{weddingDate} • {weddingTime}</span>
            </div>
          </div>
          <div className="absolute bottom-10 flex flex-col items-center gap-1.5 text-[#F3C46B] text-xs tracking-widest uppercase animate-bounce drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <span>SCROLL TO UNVEIL</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* ── SECTION 2: MEET THE COUPLE ── */}
        <div
          style={styleStory}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none"
        >
          <div className="max-w-3xl w-full flex flex-col items-center justify-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#F7E7C4] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <Heart className="w-4 h-4 fill-current text-[#D9A441]" />
              <span>THE ROYAL COUPLE</span>
            </div>
            <h2 className="text-3xl sm:text-6xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#F3C46B] to-[#FFF5D0] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              Two Souls, One Eternal Promise
            </h2>

            {/* Bride & Groom Dual Photos Showcase */}
            <div className="flex items-center justify-center gap-4 sm:gap-10 my-2 pointer-events-auto">
              {/* Bride Card */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#D9A441] shadow-[0_0_25px_rgba(217,164,65,0.45)] p-1 bg-[#000000]/40 backdrop-blur-md">
                  <img
                    src={bridePhoto}
                    alt={partnerOne}
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-sm sm:text-base font-serif font-bold text-[#FFF5D0] mt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  {partnerOne}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#F3C46B] font-medium">The Bride</span>
              </div>

              {/* Gold Ampersand Emblem */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#000000]/40 border border-[#D9A441]/60 backdrop-blur-md flex items-center justify-center text-[#F3C46B] font-serif italic text-lg sm:text-2xl shadow-[0_0_15px_rgba(217,164,65,0.35)]">
                &amp;
              </div>

              {/* Groom Card */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#D9A441] shadow-[0_0_25px_rgba(217,164,65,0.45)] p-1 bg-[#000000]/40 backdrop-blur-md">
                  <img
                    src={groomPhoto}
                    alt={partnerTwo}
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-sm sm:text-base font-serif font-bold text-[#FFF5D0] mt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  {partnerTwo}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#F3C46B] font-medium">The Groom</span>
              </div>
            </div>
            <p className="text-sm sm:text-xl text-[#FDF6F3] font-light italic leading-relaxed max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              From unforgettable first glances to shared laughter across seasons, our journey leads us to this sacred celebration of eternal union.
            </p>
          </div>
        </div>

        {/* ── SECTION 3: EVENT TIMELINE ── */}
        <div
          style={styleTimeline}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none"
        >
          <div className="max-w-4xl w-full flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#F7E7C4] font-semibold mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <Clock className="w-4 h-4 text-[#D9A441]" />
              <span>ORDER OF CELEBRATION</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center w-full">
              {events.map((ev, idx) => (
                <div
                  key={idx}
                  className="bg-[#000000]/40 backdrop-blur-md border border-[#D9A441]/40 p-6 rounded-2xl flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                >
                  <div>
                    <span className="text-xs font-mono text-[#F3C46B] font-bold block mb-1">
                      {ev.time}
                    </span>
                    <h4 className="text-lg font-serif font-bold text-[#FFF5D0] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                      {ev.title}
                    </h4>
                    {ev.location && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#F3C46B] hover:underline mt-1 flex items-center justify-center gap-1 font-medium pointer-events-auto cursor-pointer"
                      >
                        <MapPin className="w-3 h-3 text-[#D9A441]" />
                        <span>{ev.location}</span>
                      </a>
                    )}
                  </div>
                  {ev.description && (
                    <p className="text-xs text-[#FDF6F3]/80 italic mt-3 pt-2 border-t border-[#D9A441]/30">
                      {ev.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: VENUE LOCATIONS ── */}
        <div
          style={styleLocations}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none"
        >
          <div className="max-w-3xl w-full flex flex-col items-center justify-center space-y-6 pointer-events-auto">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#F7E7C4] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <Compass className="w-4 h-4 text-[#D9A441]" />
              <span>ROYAL VENUE LOCATIONS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-center w-full pointer-events-auto">
              {locations.map((loc, idx) => {
                const mapLink =
                  loc.mapUrl && loc.mapUrl !== "https://maps.google.com" && loc.mapUrl.startsWith("http")
                    ? loc.mapUrl
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.name || ""} ${loc.address || ""}`.trim() || "Wedding Venue")}`;
                return (
                  <a
                    key={idx}
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof window !== "undefined") {
                        window.open(mapLink, "_blank", "noopener,noreferrer");
                      }
                    }}
                    className="group relative z-30 bg-[#000000]/60 hover:bg-[#000000]/80 border-2 border-[#D9A441]/60 hover:border-[#D9A441] p-6 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all duration-300 hover:scale-[1.04] cursor-pointer pointer-events-auto flex flex-col items-center justify-between text-center"
                  >
                    <div>
                      <h4 className="text-xl font-serif font-bold text-[#FFF5D0] mb-1 group-hover:text-[#F3C46B] transition-colors">
                        {loc.title || "Venue"}
                      </h4>
                      <p className="text-base font-semibold text-[#F3C46B]">{loc.name}</p>
                      <p className="text-xs text-[#FDF6F3]/90 mt-1">{loc.address}</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#F3C46B] font-semibold mt-4 px-4 py-2 rounded-full bg-[#D9A441]/20 border border-[#D9A441]/40 group-hover:bg-[#D9A441] group-hover:text-[#03110b] transition-all shadow-md">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Open Location in Google Maps</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 5: PHOTO GALLERY ── */}
        <div
          style={styleGallery}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none"
        >
          <div className="max-w-4xl w-full flex flex-col items-center justify-center">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#F7E7C4] font-semibold mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <Sparkles className="w-4 h-4 text-[#D9A441]" />
              <span>ROYAL GALLERY MOMENTS</span>
            </div>

            {/* Mobile View (Compact 2x2 Grid, Fits 100% inside mobile viewport height) */}
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm sm:hidden pointer-events-auto px-1">
              {resolvedGallery.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveLightboxIndex(idx)}
                  className="group relative h-28 sm:h-32 rounded-xl overflow-hidden border border-[#D9A441]/50 shadow-[0_8px_20px_rgba(0,0,0,0.8)] bg-[#070707] cursor-pointer active:scale-95 transition-transform"
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03110b]/90 via-transparent to-transparent" />
                  {idx === 3 ? (
                    <div className="absolute inset-0 bg-[#000000]/65 backdrop-blur-[2px] flex flex-col items-center justify-center text-[#F3C46B] border border-[#D9A441]">
                      <Maximize2 className="w-5 h-5 mb-1 text-[#D9A441]" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFF5D0]">+ View All</span>
                      <span className="text-[9px] text-[#F3C46B]/80 font-mono">({resolvedGallery.length} Photos)</span>
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2 right-2 text-left">
                      <span className="text-[8px] uppercase font-mono tracking-widest text-[#F3C46B] block">
                        {item.category}
                      </span>
                      <h4 className="text-[11px] font-serif font-bold text-[#FFF5D0] truncate">
                        {item.title}
                      </h4>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop & Tablet View (Asymmetric Editorial Bento Grid Showcase) */}
            <div className="hidden sm:grid grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-3xl pointer-events-auto">
              {/* 1. Large Featured Hero Bento Card (Spans 2 Columns) */}
              <div
                onClick={() => setActiveLightboxIndex(0)}
                className="sm:col-span-2 group relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#D9A441]/50 shadow-[0_15px_35px_rgba(0,0,0,0.85)] bg-[#070707] cursor-pointer hover:scale-[1.015] hover:border-[#D9A441] transition-all duration-300"
              >
                <img
                  src={resolvedGallery[0].url}
                  alt={resolvedGallery[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03110b]/95 via-[#03110b]/30 to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#000000]/70 border border-[#D9A441]/50 text-[#F3C46B] text-[10px] uppercase font-mono tracking-widest backdrop-blur-md shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D9A441]" />
                  <span>{resolvedGallery[0].category}</span>
                </div>
                <div className="absolute top-3 right-3 p-2 rounded-full bg-[#000000]/60 border border-[#D9A441]/40 text-[#D9A441] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-left">
                  <h4 className="text-lg font-serif font-bold text-[#FFF5D0] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    {resolvedGallery[0].title}
                  </h4>
                  <p className="text-xs text-[#FDF6F3]/85 italic mt-0.5">
                    {resolvedGallery[0].subtitle}
                  </p>
                </div>
              </div>

              {/* 2. Side Accent Bento Card (1 Column) */}
              <div
                onClick={() => setActiveLightboxIndex(1)}
                className="group relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#D9A441]/50 shadow-[0_15px_35px_rgba(0,0,0,0.85)] bg-[#070707] cursor-pointer hover:scale-[1.015] hover:border-[#D9A441] transition-all duration-300"
              >
                <img
                  src={resolvedGallery[1].url}
                  alt={resolvedGallery[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03110b]/95 via-[#03110b]/20 to-transparent" />
                <div className="absolute top-3 right-3 p-2 rounded-full bg-[#000000]/60 border border-[#D9A441]/40 text-[#D9A441] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#F3C46B] block">
                    {resolvedGallery[1].category}
                  </span>
                  <h4 className="text-sm font-serif font-bold text-[#FFF5D0] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {resolvedGallery[1].title}
                  </h4>
                </div>
              </div>

              {/* 3, 4, 5. Bottom Row Equal Bento Cards */}
              {resolvedGallery.slice(2, 5).map((item, idx) => {
                const itemIndex = idx + 2;
                return (
                  <div
                    key={itemIndex}
                    onClick={() => setActiveLightboxIndex(itemIndex)}
                    className="group relative h-36 sm:h-40 rounded-2xl overflow-hidden border border-[#D9A441]/50 shadow-[0_10px_25px_rgba(0,0,0,0.85)] bg-[#070707] cursor-pointer hover:scale-[1.02] hover:border-[#D9A441] transition-all duration-300"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#03110b]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3 text-left">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-[#F3C46B] block">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-[#FFF5D0]">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Fullscreen Photo Lightbox Modal */}
        <AnimatePresence>
          {activeLightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] bg-[#000000]/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8 select-none"
            >
              {/* Top Header */}
              <div className="w-full max-w-5xl flex items-center justify-between z-10">
                <div className="flex items-center gap-2 text-xs font-mono text-[#D9A441]">
                  <span>PHOTO {activeLightboxIndex + 1} OF {resolvedGallery.length}</span>
                </div>
                <button
                  onClick={() => setActiveLightboxIndex(null)}
                  className="p-2.5 rounded-full bg-[#111111] border border-[#D9A441]/40 text-[#D9A441] hover:bg-[#D9A441] hover:text-[#000000] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Central Photo View & Navigation */}
              <div className="relative w-full max-w-4xl h-[65vh] flex items-center justify-center my-auto">
                <button
                  onClick={() =>
                    setActiveLightboxIndex(
                      (activeLightboxIndex - 1 + resolvedGallery.length) % resolvedGallery.length
                    )
                  }
                  className="absolute left-2 sm:-left-12 z-20 p-3 rounded-full bg-[#111111]/80 border border-[#D9A441]/40 text-[#D9A441] hover:bg-[#D9A441] hover:text-[#000000] transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <img
                  src={resolvedGallery[activeLightboxIndex].url}
                  alt={resolvedGallery[activeLightboxIndex].title}
                  className="max-w-full max-h-full object-contain rounded-2xl border-2 border-[#D9A441]/50 shadow-[0_0_50px_rgba(217,164,65,0.3)]"
                />

                <button
                  onClick={() =>
                    setActiveLightboxIndex(
                      (activeLightboxIndex + 1) % resolvedGallery.length
                    )
                  }
                  className="absolute right-2 sm:-right-12 z-20 p-3 rounded-full bg-[#111111]/80 border border-[#D9A441]/40 text-[#D9A441] hover:bg-[#D9A441] hover:text-[#000000] transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Bottom Caption */}
              <div className="w-full max-w-xl text-center z-10 bg-[#062016]/80 border border-[#D9A441]/40 px-6 py-3 rounded-2xl backdrop-blur-md shadow-2xl">
                <h4 className="text-lg font-serif font-bold text-[#FFF5D0]">
                  {resolvedGallery[activeLightboxIndex].title}
                </h4>
                <p className="text-xs text-[#FDF6F3]/80 italic mt-0.5">
                  {resolvedGallery[activeLightboxIndex].subtitle}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SECTION 6: RSVP FORM ── */}
        <div
          style={styleRsvp}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none"
        >
          <div className="max-w-md w-full flex flex-col items-center justify-center space-y-4 pointer-events-auto">
            <h3 className="text-3xl font-serif italic text-[#FFF5D0] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">Confirm Your Presence</h3>
            <p className="text-xs sm:text-sm text-[#FDF6F3] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Please honor us with your RSVP confirmation for our wedding celebration.</p>
            <form onSubmit={(e) => e.preventDefault()} className="w-full space-y-3.5 pointer-events-auto">
              <input
                type="text"
                placeholder="Your Full Name"
                defaultValue={guestName}
                className="w-full px-5 py-3 rounded-2xl bg-[#000000]/60 border border-[#D9A441]/50 text-sm text-[#FDF6F3] placeholder:text-[#FDF6F3]/50 focus:outline-none focus:border-[#D9A441] backdrop-blur-md shadow-inner pointer-events-auto"
              />
              <select className="w-full px-5 py-3 rounded-2xl bg-[#000000]/60 border border-[#D9A441]/50 text-sm text-[#FDF6F3] focus:outline-none focus:border-[#D9A441] backdrop-blur-md shadow-inner pointer-events-auto cursor-pointer">
                <option className="bg-[#0b0b0b] text-[#FDF6F3]">Will Attend (Joyfully Accepts)</option>
                <option className="bg-[#0b0b0b] text-[#FDF6F3]">Regretfully Declines</option>
              </select>

              {/* Dedicated How Many Guests Are Attending Dropdown */}
              <div className="w-full text-left pointer-events-auto">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#F3C46B] block mb-1.5 ml-1">
                  How Many Guests Are Attending?
                </label>
                <select className="w-full px-5 py-3 rounded-2xl bg-[#000000]/60 border border-[#D9A441]/50 text-sm text-[#FDF6F3] focus:outline-none focus:border-[#D9A441] backdrop-blur-md shadow-inner pointer-events-auto cursor-pointer">
                  <option value="1" className="bg-[#0b0b0b] text-[#FDF6F3]">1 Guest (Attending Solo)</option>
                  <option value="2" className="bg-[#0b0b0b] text-[#FDF6F3]">2 Guests (Attending as Couple)</option>
                  <option value="3" className="bg-[#0b0b0b] text-[#FDF6F3]">3 Guests (Family)</option>
                  <option value="4" className="bg-[#0b0b0b] text-[#FDF6F3]">4 Guests (Group)</option>
                  <option value="5+" className="bg-[#0b0b0b] text-[#FDF6F3]">5+ Guests (Party)</option>
                </select>
              </div>

              <button
                type="button"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#03110b] font-bold text-xs uppercase tracking-widest shadow-[0_10px_25px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform pointer-events-auto cursor-pointer"
              >
                Send RSVP Confirmation
              </button>
            </form>
          </div>
        </div>

        {/* ── SECTION 7: LIVE COUNTDOWN & BLESSINGS ── */}
        <div
          style={styleFinale}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none"
        >
          <div className="max-w-2xl w-full flex flex-col items-center justify-center space-y-6">
            <span className="text-xs uppercase tracking-[0.4em] text-[#F7E7C4] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              COUNTDOWN TO THE CELEBRATION
            </span>
            <div className="grid grid-cols-4 gap-3 text-center w-full my-2">
              <div className="bg-[#000000]/40 border border-[#D9A441]/40 p-4 rounded-2xl backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#FFF5D0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{timeLeft.days}</span>
                <span className="text-[11px] uppercase tracking-wider text-[#F3C46B] block mt-1">Days</span>
              </div>
              <div className="bg-[#000000]/40 border border-[#D9A441]/40 p-4 rounded-2xl backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#FFF5D0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{timeLeft.hours}</span>
                <span className="text-[11px] uppercase tracking-wider text-[#F3C46B] block mt-1">Hours</span>
              </div>
              <div className="bg-[#000000]/40 border border-[#D9A441]/40 p-4 rounded-2xl backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#FFF5D0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{timeLeft.minutes}</span>
                <span className="text-[11px] uppercase tracking-wider text-[#F3C46B] block mt-1">Mins</span>
              </div>
              <div className="bg-[#000000]/40 border border-[#D9A441]/40 p-4 rounded-2xl backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#FFF5D0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{timeLeft.seconds}</span>
                <span className="text-[11px] uppercase tracking-wider text-[#F3C46B] block mt-1">Secs</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#FDF6F3] italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">We look forward to celebrating this magical milestone with you!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
