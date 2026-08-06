"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  Heart,
  Sparkles,
  ChevronDown,
  Volume2,
  VolumeX,
  Phone,
} from "lucide-react";

const TOTAL_SCENE1_FRAMES = 240;
const TOTAL_SCENE2_FRAMES = 240;
const TOTAL_FRAMES = TOTAL_SCENE1_FRAMES + TOTAL_SCENE2_FRAMES;

// Helper to build 480 frame image URLs (WebP format for 80% compression)
const FRAME_PATHS: string[] = [
  ...Array.from({ length: TOTAL_SCENE1_FRAMES }, (_, i) => {
    const frameNum = String(i + 1).padStart(4, "0");
    return `/frames/scene1/frame-${frameNum}.webp`;
  }),
  ...Array.from({ length: TOTAL_SCENE2_FRAMES }, (_, i) => {
    const frameNum = String(i + 1).padStart(4, "0");
    return `/frames/scene2/frame-${frameNum}.webp`;
  }),
];

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

export interface ScrollScrubberCanvasProps {
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
  bgAudioUrl?: string;
}

export default function ScrollScrubberCanvas({
  partnerOne = "Your Name",
  partnerTwo = "Partner Name",
  tagline = "THE WEDDING OF",
  inviteLine = "Together with their families, invite you to celebrate their union of love",
  weddingDate = "December 18, 2026",
  weddingTime = "4:00 PM Onwards",
  groomImage,
  brideImage,
  coupleImage,
  partnerTwoImage,
  guestName = "Honored Guest",
  contactPhone,
  contactAddress,
  events = [
    {
      time: "03:30 PM",
      title: "Guest Arrival & Welcome Drinks",
      location: "Grand Foyer, St. Patrick's",
      description: "Welcome champagne & classical harp performance",
    },
    {
      time: "04:30 PM",
      title: "Holy Matrimony Ceremony",
      location: "St. Patrick's Cathedral",
      description: "Exchange of vows and ring ceremony",
    },
    {
      time: "07:00 PM",
      title: "Royal Reception & Gala Dinner",
      location: "The Palace Ballroom",
      description: "Live band, dinner feast, and first dance",
    },
  ],
  locations = [
    {
      title: "Wedding Ceremony",
      name: "St. Patrick's Cathedral",
      address: "124 Cathedral Square, Central City",
      time: "04:30 PM",
      mapUrl: "https://maps.google.com",
    },
    {
      title: "Evening Reception",
      name: "The Palace Grand Ballroom",
      address: "88 Royal Gardens Boulevard",
      time: "07:00 PM",
      mapUrl: "https://maps.google.com",
    },
  ],
  galleryImages = [
    "/images/templates/gallery-1.jpg",
    "/images/templates/gallery-2.jpg",
    "/images/templates/gallery-3.jpg",
    "/images/templates/gallery-4.jpg",
  ],
  onExploreClick,
  bgAudioUrl,
}: ScrollScrubberCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );

  // Preloader State
  const [loadedScene1Count, setLoadedScene1Count] = useState(0);
  const [loadedTotalCount, setLoadedTotalCount] = useState(0);
  const [isScene1Ready, setIsScene1Ready] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

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
  const [blessingCount, setBlessingCount] = useState(148);

  // Draw frame with object-fit: cover matrix calculation
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retrieve image or nearest loaded fallback frame
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

  // Update canvas size to match viewport high-DPI resolution
  // Includes height guard to prevent mobile address bar collapse flickering
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const newWidth = Math.round(rect.width * dpr);
    const newHeight = Math.round(rect.height * dpr);

    // Skip canvas buffer wipe/resize if width hasn't changed (eliminates mobile URL bar collapse flickering)
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

  // Progressive keyframe priority preloader (Preloads Scene 1 & Scene 2 with Royal Guest Card)
  useEffect(() => {
    let isCancelled = false;
    let scene1Count = 0;
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

          if (index < TOTAL_SCENE1_FRAMES) {
            scene1Count++;
            setLoadedScene1Count(scene1Count);
          }

          if (totalCount === TOTAL_FRAMES) {
            setIsScene1Ready(true);
            setIsFullyLoaded(true);
          }
          resolve();
        };

        img.onerror = () => {
          if (isCancelled) return resolve();
          totalCount++;
          setLoadedTotalCount(totalCount);
          if (index < TOTAL_SCENE1_FRAMES) {
            scene1Count++;
            setLoadedScene1Count(scene1Count);
          }
          if (totalCount === TOTAL_FRAMES) {
            setIsScene1Ready(true);
            setIsFullyLoaded(true);
          }
          resolve();
        };
      });
    };

    // Parallel batch preloader for all 480 frames
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
        setIsScene1Ready(true);
        setIsFullyLoaded(true);
      }
    };

    loadAllFrames();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Auto-scroll to Y: 3px upon preloader completion / unveil
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

  // Console logging helper for scroll metrics
  const lastLoggedFrameRef = useRef<number>(-1);

  // Smooth Lerp Loop & Scroll Listener (Flicker-Free with Console Logging)
  useEffect(() => {
    if (!isScene1Ready) return;

    updateCanvasDimensions();

    const getActiveSectionName = (p: number) => {
      if (p >= 0.0 && p <= 0.128) return "1. Hero Title (Terance & Ancy)";
      if (p >= 0.064 && p <= 0.20) return "2. Meet the Couple (Vanish at Y:1000px - 1400px)";
      if (p >= 0.20 && p <= 0.357) return "3. Order of Events Timeline (Vanish at Y:2100px - 2500px)";
      if (p >= 0.350 && p <= 0.514) return "4. The Venues (Vanish at Y:3200px - 3600px)";
      if (p >= 0.507 && p <= 0.643) return "5. Pre-Wedding Gallery (Vanish at Y:4100px - 4500px)";
      if (p >= 0.643 && p <= 0.871) return "6. R.S.V.P. Confirmation (Starts Vanishing at Y:5800px)";
      if (p >= 0.871 && p <= 1.000) return "7. Send Your Blessings & Live Countdown (Grand Finale at Y:6100px)";
      return "Scrubbing Transition";
    };

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

      // Console Log Scroll Metrics
      const currentFrameRounded = Math.round(targetFrameRef.current);
      if (Math.abs(currentFrameRounded - lastLoggedFrameRef.current) >= 8) {
        lastLoggedFrameRef.current = currentFrameRounded;
        const scrollY =
          targetScrollParent === window
            ? Math.round(window.scrollY)
            : Math.round((targetScrollParent as HTMLElement).scrollTop);
        const sectionName = getActiveSectionName(progress);
        console.log(
          `%c[ScrollScrubber]%c Scroll Y: ${scrollY}px | Progress: ${(progress * 100).toFixed(1)}% | Frame: ${currentFrameRounded} / ${TOTAL_FRAMES - 1} | Section: ${sectionName}`,
          "color: #D9A441; font-weight: bold;",
          "color: #F8F3EA;"
        );
      }
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

      // On mobile screens, update frames instantly with finger scroll to prevent frame lag & stuttering
      const lerpFactor = isMobile ? 1.0 : 0.16;

      // Frame interpolation
      const frameDiff = Math.abs(targetFrameRef.current - currentFrameRef.current);
      if (frameDiff > 0.01) {
        currentFrameRef.current = isMobile
          ? targetFrameRef.current
          : lerp(currentFrameRef.current, targetFrameRef.current, lerpFactor);
        drawFrame(Math.round(currentFrameRef.current));
      }

      // Opacity & transform progress interpolation
      const progDiff = Math.abs(targetProgressRef.current - smoothProgressRef.current);
      if (progDiff > 0.0002) {
        smoothProgressRef.current = isMobile
          ? targetProgressRef.current
          : lerp(smoothProgressRef.current, targetProgressRef.current, lerpFactor);

        // Throttle React state re-renders on mobile to prevent 60-FPS DOM layout thrashing
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
  }, [isScene1Ready, drawFrame, updateCanvasDimensions]);

  // Preloader Percentages
  const scene1ProgressPercent = Math.min(
    100,
    Math.round((loadedScene1Count / TOTAL_SCENE1_FRAMES) * 100)
  );

  // Background Audio Toggle
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

  // Flicker-free smooth interpolation helper with custom rising translateY & exact thresholds
  const calculateRangeStyle = (
    start: number,
    end: number,
    options?: { fadeInRatio?: number; fadeOutRatio?: number; isHero?: boolean; startRiseY?: number }
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
        willChange: isMobile ? "auto" : "opacity, transform",
      };
    }

    const duration = end - start;
    const fadeInRatio = options?.fadeInRatio ?? 0.22;
    const fadeOutRatio = options?.fadeOutRatio ?? 0.78;

    let opacity = 1;

    if (options?.isHero) {
      // Hero Section: 100% visible at Y: 0px up to fadeOutStart, then vanishes cleanly
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

    const rangeProgress = (p - start) / duration;
    let translateY = 0;

    if (!isMobile) {
      if (options?.isHero) {
        translateY = (1 - opacity) * -20;
      } else {
        const startRise = options?.startRiseY ?? 65;
        if (rangeProgress < fadeInRatio) {
          const riseProgress = rangeProgress / fadeInRatio;
          translateY = (1 - riseProgress) * startRise;
        } else if (rangeProgress > fadeOutRatio) {
          const fadeProgress = (rangeProgress - fadeOutRatio) / (1 - fadeOutRatio);
          translateY = fadeProgress * -25;
        } else {
          translateY = 0;
        }
      }
    }

    return {
      opacity,
      transform: isMobile ? "none" : `translate3d(0, ${translateY}px, 0)`,
      pointerEvents: opacity > 0.3 ? ("auto" as const) : ("none" as const),
      willChange: isMobile ? "auto" : "opacity, transform",
      WebkitBackfaceVisibility: "hidden" as const,
      backfaceVisibility: "hidden" as const,
    };
  };

  // Helper to calculate one-by-one staggered slide-in for timeline event items (starts vanishing at Y: 2100px)
  const calculateEventItemStyle = (idx: number, totalEvents: number) => {
    const p = scrollProgress;
    const timelineStart = 0.200; // Y = 1400px
    const timelineEnd = 0.357;   // Y = 2500px

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || "ontouchstart" in window);

    if (p < timelineStart || p > timelineEnd) {
      return {
        opacity: 0,
        transform: isMobile ? "none" : "translate3d(0, 30px, 0)",
        willChange: isMobile ? "auto" : "opacity, transform",
        WebkitBackfaceVisibility: "hidden" as const,
        backfaceVisibility: "hidden" as const,
      };
    }

    // Stagger each event so all events hit 100% opacity at Y = 1600px (progress 0.228)
    const itemStart = timelineStart + 0.002 + idx * 0.009;
    const itemPeak = itemStart + 0.008; // Item 2 hits 100% at progress 0.228 (Y = 1600px)
    const sectionFadeOutStart = 0.300;  // Y = 2100px (starts vanishing exactly at Y: 2100px!)

    let opacity = 0;
    let translateX = 0;
    let translateY = 0;
    const isEven = idx % 2 === 0;
    const startDir = isEven ? -60 : 60; // Left (-60px) or Right (+60px) for desktop

    if (p < itemStart) {
      opacity = 0;
      translateX = startDir;
      translateY = 25;
    } else if (p >= itemStart && p < itemPeak) {
      const progress = (p - itemStart) / (itemPeak - itemStart);
      opacity = progress;
      translateX = (1 - progress) * startDir;
      translateY = (1 - progress) * 25;
    } else if (p >= itemPeak && p < sectionFadeOutStart) {
      opacity = 1;
      translateX = 0;
      translateY = 0;
    } else {
      const fadeProgress = (p - sectionFadeOutStart) / (timelineEnd - sectionFadeOutStart);
      opacity = Math.max(0, 1 - fadeProgress);
      translateX = 0;
      translateY = 0;
    }

    return {
      opacity,
      transform: isMobile ? "none" : `translate3d(${translateX}px, 0, 0)`,
      willChange: isMobile ? "auto" : "opacity, transform",
      WebkitBackfaceVisibility: "hidden" as const,
      backfaceVisibility: "hidden" as const,
    };
  };

  // Section Ranges configured for exact pixel milestones:
  // 1. Hero ("Terance & Ancy"): Y 0px - 900px (progress 0.000 - 0.128)
  // 2. Meet the Couple: Y 450px - 1400px (progress 0.064 - 0.200) — starts rising at Y 450px, starts vanishing at Y 1000px
  // 3. Order of Events: Y 1400px - 2500px (progress 0.200 - 0.357) — comes onto screen at Y 1400px, 100% opacity at Y 1600px, starts vanishing at Y 2100px
  // 4. The Venues: Y 2450px - 3600px (progress 0.350 - 0.514) — comes onto screen at Y 2450px, 100% opacity at Y 2700px, starts vanishing at Y 3200px
  // 5. Pre-Wedding Gallery: Y 3550px - 4500px (progress 0.507 - 0.643) — comes onto screen at Y 3550px, starts vanishing at Y 4100px
  // 6. R.S.V.P. Confirmation: Y 4500px - 6100px (progress 0.643 - 0.871) — comes onto screen at Y 4500px, starts vanishing at Y 5800px!
  // 7. Send Your Blessings & Live Countdown (Grand Finale): Y 6100px - 7000px (progress 0.871 - 1.000) — comes onto screen at Y 6100px!
  const styleHero = calculateRangeStyle(0.0, 0.128, { isHero: true, fadeOutRatio: 0.55 });
  const styleStory = calculateRangeStyle(0.064, 0.20, { fadeInRatio: 0.368, fadeOutRatio: 0.581, startRiseY: 550 });
  const styleTimeline = calculateRangeStyle(0.20, 0.357, { fadeInRatio: 0.18, fadeOutRatio: 0.637, startRiseY: 550 });
  const styleLocations = calculateRangeStyle(0.35, 0.514, { fadeInRatio: 0.217, fadeOutRatio: 0.652, startRiseY: 550 });
  const styleGallery = calculateRangeStyle(0.507, 0.643, { fadeInRatio: 0.316, fadeOutRatio: 0.578, startRiseY: 550 });
  const styleRsvp = calculateRangeStyle(0.643, 0.871, { fadeInRatio: 0.188, fadeOutRatio: 0.8125, startRiseY: 550 });
  const styleFinale = calculateRangeStyle(0.871, 1.000, { fadeInRatio: 0.278, fadeOutRatio: 1.00, startRiseY: 550 });

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0B0B0B] text-[#FDF6F3] font-sans overflow-clip"
      style={{ height: "800vh" }}
    >
      {/* 1. Royal Guest Preloader Screen (Displays formal invitation card while loading all 480 frames) */}
      <AnimatePresence>
        {!isFullyLoaded && (
          <motion.div
            key="wedding-preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070707] text-[#F8F3EA] px-4 sm:px-6 text-center select-none overflow-y-auto"
          >
            {/* Background Ambient Gold Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D9A441]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Royal Guest Invitation Card Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-md w-full bg-[#0F0F0F]/90 backdrop-blur-xl border border-[#D9A441]/40 p-6 sm:p-9 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col items-center text-center relative z-10 my-auto"
            >
              {/* Animated Heart Emblem */}
              <div className="w-14 h-14 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/50 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(217,164,65,0.35)]">
                <Heart className="w-7 h-7 text-[#D9A441] fill-current animate-pulse" />
              </div>

              {/* 1. Header */}
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold mb-1">
                A Special Invitation For
              </span>

              {/* 2. Guest Name */}
              <h3 className="text-xl sm:text-2xl font-accent italic text-[#FDF6F3] mb-3">
                {guestName || "Honored Guest"}
              </h3>

              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D9A441]/60 to-transparent mb-4" />

              {/* 3. Formal Invitation Quote */}
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#D9A441]/90 font-medium mb-1">
                {tagline || "Together with their families,"}
              </p>

              <h2 className="text-3xl sm:text-4xl font-accent italic text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7C4] via-[#D9A441] to-[#F7E7C4] tracking-wide my-1">
                {partnerOne} <span className="text-[#D9A441] font-normal">&amp;</span> {partnerTwo}
              </h2>

              <p className="text-xs sm:text-sm text-[#F8F3EA]/85 font-light italic mt-1 mb-5 leading-relaxed max-w-xs">
                {inviteLine || "request the pleasure of your company at their wedding celebration."}
              </p>

              {/* 4. Date & Time */}
              <div className="px-4 py-2 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/35 text-[11px] sm:text-xs text-[#D9A441] font-semibold tracking-wider uppercase mb-6 shadow-inner">
                {weddingTime || `${weddingDate} • 4:00 PM Onwards`}
              </div>

              {/* 5. Progress Bar & Unveil Percentage */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-[10px] sm:text-xs text-[#D9A441] tracking-wider font-mono">
                  <span>PREPARING CINEMATIC EXPERIENCE</span>
                  <span>{Math.round((loadedTotalCount / TOTAL_FRAMES) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden relative border border-[#D9A441]/30">
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

      {/* 2. Pinned Full-Viewport Canvas Container */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden z-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block filter brightness-[0.92] contrast-[1.04]"
        />

        {/* Top Vignette Shadow specifically for crystal clear text readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#070707]/80 via-transparent to-[#070707]/80 z-10" />

        {/* Audio Floating Toggle Button */}
        {bgAudioUrl && (
          <button
            onClick={toggleAudio}
            aria-label="Toggle Background Music"
            className="fixed top-6 right-6 z-40 p-3 rounded-full bg-[#0B0B0B]/70 border border-[#D9A441]/40 text-[#D9A441] backdrop-blur-md hover:bg-[#0B0B0B] transition-all hover:scale-105 shadow-[0_0_15px_rgba(217,164,65,0.25)]"
          >
            {isPlayingAudio ? (
              <Volume2 className="w-5 h-5 text-[#D9A441] animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-[#D8C49F]/60" />
            )}
          </button>
        )}

        {/* Scroll Progress Gold Line */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10 z-30">
          <div
            className="h-full bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] transition-all duration-75 shadow-[0_0_10px_#D9A441]"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {!isFullyLoaded && isScene1Ready && (
          <div className="fixed bottom-4 left-6 z-40 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D9A441]/70 bg-[#0B0B0B]/80 px-3 py-1 rounded-full border border-[#D9A441]/20 backdrop-blur-sm pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-ping" />
            Optimizing Scene 2 ({Math.round((loadedTotalCount / TOTAL_FRAMES) * 100)}%)
          </div>
        )}

        {/* Live Scroll Metrics HUD Badge */}
        <div className="fixed bottom-4 right-6 z-40 hidden sm:flex items-center gap-2 text-[11px] font-mono text-[#D9A441] bg-[#070707]/80 px-3 py-1.5 rounded-xl border border-[#D9A441]/30 backdrop-blur-md pointer-events-none shadow-lg">
          <span>Y: {Math.round(scrollProgress * 7000)}px</span>
          <span className="text-[#D9A441]/40">•</span>
          <span>{Math.round(scrollProgress * 100)}%</span>
          <span className="text-[#D9A441]/40">•</span>
          <span>Frame: {Math.round(scrollProgress * 479)}/479</span>
        </div>

        {/* 3. Layered Content Overlays (Inside the single sticky viewport box) */}
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center p-4 sm:p-8">
          
          {/* OVERLAY BLOCK 1: HERO / TOP CENTER NAMES & BOTTOM GUEST WELCOME CARD */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-between py-6 sm:py-10 px-4 text-center sm:transition-all sm:duration-300 sm:ease-out"
            style={styleHero}
          >
            {/* Top Section: Couple Names & Wedding Date */}
            <div className="flex flex-col items-center text-center max-w-2xl w-full">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.38em] text-[#D9A441] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] mb-1">
                {tagline || "TOGETHER WITH THEIR FAMILIES"}
              </span>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-accent italic text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7C4] via-[#D9A441] to-[#F7E7C4] tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-tight">
                {partnerOne} <span className="text-[#D9A441] font-normal">&amp;</span> {partnerTwo}
              </h1>

              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#D9A441] mt-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {weddingTime || weddingDate}
              </p>

              <p className="text-xs sm:text-sm text-[#F7E7C4] italic font-light max-w-md mx-auto mt-2.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-relaxed">
                &quot;{inviteLine || "invite you to celebrate their wedding"}&quot;
              </p>
            </div>

            {/* Bottom Section: Catchy Royal Guest Welcoming Card (Fills lower empty space) */}
            <div className="max-w-lg w-full p-4 sm:p-5 rounded-3xl bg-[#0C0C0C]/90 sm:bg-[#070707]/75 border border-[#D9A441]/40 sm:backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col items-center text-center pointer-events-auto my-auto">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#D9A441] font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>Warmly Welcoming You</span>
                <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
              </div>

              <h3 className="text-xl sm:text-2xl font-accent italic text-[#FDF6F3] mb-1">
                Welcome, {guestName || "Honored Guest"}
              </h3>

              <p className="text-xs sm:text-sm text-[#F7E7C4]/90 font-light italic leading-relaxed max-w-md">
                &quot;With joyful hearts &amp; deepest gratitude, we invite you to step into our story and celebrate our forever union.&quot;
              </p>

              <div className="mt-3.5 inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#F7E7C4] bg-[#D9A441]/20 px-4 py-1.5 rounded-full border border-[#D9A441]/45 shadow-[0_0_15px_rgba(217,164,65,0.25)]">
                <span>Scroll Down to View Story</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#D9A441] sm:animate-bounce" />
              </div>
            </div>
          </div>

          {/* OVERLAY BLOCK 2: MEET THE COUPLE (Seamless, No Outer Box) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 sm:transition-all sm:duration-300 sm:ease-out"
            style={styleStory}
          >
            <div className="max-w-2xl w-full flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/40 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(217,164,65,0.3)]">
                <Heart className="w-5.5 h-5.5 text-[#D9A441] fill-current sm:animate-pulse" />
              </div>

              <span className="text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                The Blessed Union
              </span>
              <h2 className="text-4xl sm:text-6xl font-accent italic text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7C4] via-[#D9A441] to-[#F7E7C4] tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mt-1 mb-6">
                Meet the Couple
              </h2>

              {/* Groom & Bride Photos Grid */}
              <div className="grid grid-cols-2 gap-5 max-w-lg mx-auto mb-5 w-full">
                {/* Groom Photo */}
                <div className="group relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-[#D9A441]/50 shadow-[0_12px_35px_rgba(0,0,0,0.85)] bg-[#141414]">
                  <img
                    src={groomImage || coupleImage || "/images/templates/groom-bride-1.jpg"}
                    alt={`${partnerOne} - Groom`}
                    className="w-full h-full object-cover sm:group-hover:scale-105 sm:transition-transform sm:duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-left">
                    <span className="text-[10px] uppercase tracking-widest text-[#D9A441] font-semibold">
                      Groom
                    </span>
                    <h3 className="text-xl font-accent italic text-[#FDF6F3] leading-none mt-0.5">
                      {partnerOne}
                    </h3>
                  </div>
                </div>

                {/* Bride Photo */}
                <div className="group relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-[#D9A441]/50 shadow-[0_12px_35px_rgba(0,0,0,0.85)] bg-[#141414]">
                  <img
                    src={brideImage || partnerTwoImage || "/images/templates/groom-bride-2.jpg"}
                    alt={`${partnerTwo} - Bride`}
                    className="w-full h-full object-cover sm:group-hover:scale-105 sm:transition-transform sm:duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-left">
                    <span className="text-[10px] uppercase tracking-widest text-[#D9A441] font-semibold">
                      Bride
                    </span>
                    <h3 className="text-xl font-accent italic text-[#FDF6F3] leading-none mt-0.5">
                      {partnerTwo}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#F7E7C4] italic font-light max-w-md mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                &quot;Two souls with but a single thought, two hearts that beat as one.&quot;
              </p>
            </div>
          </div>

          {/* OVERLAY BLOCK 3: ORDER OF EVENTS TIMELINE (Seamless, No Outer Box, Alternating Left/Right) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 sm:transition-all sm:duration-300 sm:ease-out"
            style={styleTimeline}
          >
            <div className="max-w-3xl w-full flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/40 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(217,164,65,0.3)]">
                <Clock className="w-5.5 h-5.5 text-[#D9A441] animate-pulse" />
              </div>

              <span className="text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Schedule of Celebration
              </span>
              <h2 className="text-4xl sm:text-6xl font-accent italic text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7C4] via-[#D9A441] to-[#F7E7C4] tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mt-1 mb-6 sm:mb-8">
                Order of Events
              </h2>

              {/* Alternating Left-Right Timeline Grid */}
              <div className="relative w-full max-w-2xl mx-auto space-y-4 sm:space-y-5">
                {/* Central Vertical Gold Dashed Line */}
                <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#D9A441]/40 to-transparent border-r border-dashed border-[#D9A441]/40 hidden sm:block pointer-events-none" />

                {events.map((evt, idx) => {
                  const isEven = idx % 2 === 0;
                  const itemStyle = calculateEventItemStyle(idx, events.length);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center w-full ${
                        isEven
                          ? "sm:justify-start justify-center"
                          : "sm:justify-end justify-center"
                      }`}
                    >
                      <div
                        className={`w-full sm:w-[48%] p-4 sm:p-5 rounded-2xl bg-[#0C0C0C]/95 sm:bg-[#070707]/80 sm:backdrop-blur-md border border-[#D9A441]/35 shadow-[0_12px_35px_rgba(0,0,0,0.85)] text-left transition-all duration-300 hover:scale-[1.02] hover:border-[#D9A441] ${
                          isEven ? "sm:mr-auto" : "sm:ml-auto"
                        }`}
                        style={itemStyle}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="px-3 py-1 rounded-xl bg-[#D9A441]/15 border border-[#D9A441]/40 text-[#D9A441] text-xs font-mono font-bold tracking-wider">
                            {evt.time}
                          </span>
                          <Sparkles className="w-3.5 h-3.5 text-[#D9A441]/70" />
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-[#FDF6F3] mt-1">
                          {evt.title}
                        </h3>

                        {evt.location && (
                          <p className="text-xs text-[#D9A441] flex items-center gap-1 mt-1 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{evt.location}</span>
                          </p>
                        )}

                        {evt.description && (
                          <p className="text-xs text-[#F8F3EA]/80 mt-1.5 font-light leading-relaxed">
                            {evt.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* OVERLAY BLOCK 4: VENUES & LOCATIONS (Seamless, No Outer Box) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 sm:transition-all sm:duration-300 sm:ease-out"
            style={styleLocations}
          >
            <div className="max-w-3xl w-full flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/40 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(217,164,65,0.3)]">
                <MapPin className="w-5.5 h-5.5 text-[#D9A441] sm:animate-pulse" />
              </div>

              <span className="text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Where &amp; When
              </span>
              <h2 className="text-4xl sm:text-6xl font-accent italic text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7C4] via-[#D9A441] to-[#F7E7C4] tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mt-1 mb-6 sm:mb-8">
                The Venues
              </h2>

              {/* Venue Cards Grid (Seamless, No Outer Box) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl mx-auto">
                {locations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-[#0C0C0C]/95 sm:bg-[#070707]/80 sm:backdrop-blur-md border border-[#D9A441]/35 shadow-[0_12px_35px_rgba(0,0,0,0.85)] flex flex-col justify-between text-left sm:transition-all sm:duration-300 sm:hover:scale-[1.02] sm:hover:border-[#D9A441]"
                  >
                    <div>
                      {loc.title && (
                        <span className="text-[11px] uppercase tracking-widest text-[#D9A441] font-semibold">
                          {loc.title}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-[#FDF6F3] mt-1">
                        {loc.name}
                      </h3>
                      <p className="text-xs text-[#F8F3EA]/80 mt-2 font-light leading-relaxed">
                        {loc.address}
                      </p>
                      {loc.time && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#D9A441] font-mono font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{loc.time}</span>
                        </div>
                      )}
                    </div>

                    {loc.mapUrl && (
                      <a
                        href={loc.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9A441]/15 border border-[#D9A441]/40 text-[#D9A441] text-xs font-semibold hover:bg-[#D9A441] hover:text-[#0B0B0B] transition-all shadow-[0_0_12px_rgba(217,164,65,0.2)]"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Get Directions</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* OVERLAY BLOCK 5: PRE-WEDDING GALLERY (Seamless, Starts at Y = 3550px) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 sm:transition-all sm:duration-300 sm:ease-out"
            style={styleGallery}
          >
            <div className="max-w-4xl w-full flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/40 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(217,164,65,0.3)]">
                <Sparkles className="w-5.5 h-5.5 text-[#D9A441] sm:animate-pulse" />
              </div>

              <span className="text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Moments of Love
              </span>
              <h2 className="text-4xl sm:text-6xl font-accent italic text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7C4] via-[#D9A441] to-[#F7E7C4] tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mt-1 mb-6 sm:mb-8">
                Pre-Wedding Gallery
              </h2>

              {/* Catchy Asymmetric Editorial Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mx-auto">
                {/* 1. Large Featured Hero Card (Spans 2 Columns on Desktop) */}
                <div className="sm:col-span-2 group relative h-56 sm:h-72 rounded-3xl overflow-hidden border border-[#D9A441]/50 shadow-[0_15px_40px_rgba(0,0,0,0.9)] bg-[#141414] sm:transition-all sm:duration-500 sm:hover:scale-[1.02] sm:hover:border-[#D9A441]">
                  <img
                    src={galleryImages[0] || "/images/templates/gallery-1.jpg"}
                    alt="Golden Hour Walk"
                    className="w-full h-full object-cover sm:group-hover:scale-105 sm:transition-transform sm:duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/90 via-[#070707]/20 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#070707]/70 border border-[#D9A441]/40 text-[#D9A441] text-[10px] uppercase font-mono tracking-widest backdrop-blur-sm shadow-md">
                    Featured Moment
                  </div>
                  <div className="absolute bottom-3.5 left-4 text-left">
                    <span className="text-xs uppercase tracking-widest text-[#D9A441] font-semibold">
                      Golden Hour Walk
                    </span>
                    <p className="text-sm font-accent italic text-[#FDF6F3] mt-0.5">
                      Hand in hand under the autumn glow
                    </p>
                  </div>
                </div>

                {/* Right Column: 2 Stacked Cards */}
                <div className="sm:col-span-1 flex flex-col gap-3.5 sm:gap-4">
                  {/* 2. Top Right Card */}
                  <div className="group relative h-28 sm:h-34 rounded-2xl overflow-hidden border border-[#D9A441]/40 shadow-[0_10px_30px_rgba(0,0,0,0.85)] bg-[#141414] sm:transition-all sm:duration-500 sm:hover:scale-[1.03] sm:hover:border-[#D9A441]">
                    <img
                      src={galleryImages[1] || "/images/templates/gallery-2.jpg"}
                      alt="Under the Canopy"
                      className="w-full h-full object-cover sm:group-hover:scale-105 sm:transition-transform sm:duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/85 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 text-left">
                      <span className="text-[10px] uppercase tracking-wider text-[#D9A441] font-semibold">
                        Under the Canopy
                      </span>
                    </div>
                  </div>

                  {/* 3. Bottom Right Card */}
                  <div className="group relative h-28 sm:h-34 rounded-2xl overflow-hidden border border-[#D9A441]/40 shadow-[0_10px_30px_rgba(0,0,0,0.85)] bg-[#141414] sm:transition-all sm:duration-500 sm:hover:scale-[1.03] sm:hover:border-[#D9A441]">
                    <img
                      src={galleryImages[2] || "/images/templates/gallery-3.jpg"}
                      alt="Eternal Vows"
                      className="w-full h-full object-cover sm:group-hover:scale-105 sm:transition-transform sm:duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/85 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 text-left">
                      <span className="text-[10px] uppercase tracking-wider text-[#D9A441] font-semibold">
                        Eternal Vows
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OVERLAY BLOCK 6: R.S.V.P. CONFIRMATION (Seamless, Starts at Y = 4500px) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 sm:transition-all sm:duration-300 sm:ease-out"
            style={styleRsvp}
          >
            <div className="max-w-2xl w-full flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/40 flex items-center justify-center mb-2 shadow-[0_0_25px_rgba(217,164,65,0.35)]">
                <Sparkles className="w-6 h-6 text-[#D9A441] sm:animate-pulse" />
              </div>

              <span className="text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Kindly Respond
              </span>
              <h2 className="text-4xl sm:text-6xl font-accent italic text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7C4] via-[#D9A441] to-[#F7E7C4] tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mt-1 mb-3">
                R.S.V.P. Confirmation
              </h2>

              <p className="text-xs sm:text-sm text-[#F8F3EA]/90 font-light mb-6 max-w-md mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-relaxed">
                Your presence will complete our celebration of holy matrimony. Please confirm your attendance with us.
              </p>

              {/* RSVP Action Card */}
              <div className="w-full max-w-md p-6 rounded-3xl bg-[#0C0C0C]/95 sm:bg-[#070707]/80 sm:backdrop-blur-md border border-[#D9A441]/40 shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex flex-col gap-3">
                <button
                  onClick={onExploreClick}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#0B0B0B] font-bold text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(217,164,65,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Confirm Attendance Now
                </button>

                <p className="text-[11px] text-[#D9A441]/85 uppercase tracking-widest font-mono">
                  Response Requested Before Nov 18, 2026
                </p>
              </div>
            </div>
          </div>

          {/* OVERLAY BLOCK 7: FANTASTIC GRAND FINALE - BLESSINGS & COUNTDOWN (Seamless, Starts at Y = 6100px) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 sm:transition-all sm:duration-300 sm:ease-out"
            style={styleFinale}
          >
            <div className="max-w-3xl w-full flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/40 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(217,164,65,0.35)]">
                <Heart className="w-7 h-7 text-[#D9A441] fill-current animate-pulse" />
              </div>

              <span className="text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                With Love &amp; Gratitude
              </span>
              <h2 className="text-4xl sm:text-6xl font-accent italic text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7C4] via-[#D9A441] to-[#F7E7C4] tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mt-1 mb-6">
                Send Your Blessings
              </h2>

              {/* Live Wedding Countdown Pill Cards */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md w-full mb-6">
                {[
                  { label: "DAYS", value: "134" },
                  { label: "HOURS", value: "18" },
                  { label: "MINS", value: "42" },
                  { label: "SECS", value: "09" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 sm:p-4 rounded-2xl bg-[#0C0C0C]/95 sm:bg-[#070707]/80 sm:backdrop-blur-md border border-[#D9A441]/40 shadow-[0_10px_25px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center"
                  >
                    <span className="text-xl sm:text-3xl font-mono font-bold text-[#F7E7C4] leading-none">
                      {item.value}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-[#D9A441] mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* One-Tap Quick Blessing Chips */}
              <div className="w-full max-w-xl flex flex-wrap justify-center gap-2 mb-6">
                {[
                  "🥂 Wishing you endless joy & love!",
                  "✨ So happy for both of you!",
                  "❤️ Can't wait to celebrate!",
                  "🍾 A match made in heaven!",
                ].map((blessing, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBlessingCount((prev) => prev + 1)}
                    className="px-3.5 py-2 rounded-full bg-[#0C0C0C]/95 sm:bg-[#070707]/80 sm:backdrop-blur-md border border-[#D9A441]/30 text-xs text-[#F8F3EA]/90 hover:border-[#D9A441] hover:text-[#D9A441] transition-all hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(0,0,0,0.8)] cursor-pointer"
                  >
                    {blessing}
                  </button>
                ))}
              </div>

              {/* Blessing Counter Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/40 text-xs text-[#D9A441] font-mono font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(217,164,65,0.25)]">
                <Heart className="w-4 h-4 text-[#D9A441] fill-current animate-bounce" />
                <span>{blessingCount} Blessings Sent by Loved Ones</span>
              </div>

              {/* Dynamic Contact Information & Footer Details */}
              <div className="mt-6 text-center space-y-1.5 max-w-md mx-auto pointer-events-auto">
                <h4 className="text-[#F7E7C4] text-lg font-accent italic">
                  {partnerOne} &amp; {partnerTwo}
                </h4>
                <p className="text-[11px] text-[#D9A441] font-mono tracking-widest uppercase">
                  {weddingTime || weddingDate}
                </p>

                {(contactPhone || contactAddress) && (
                  <div className="pt-2 flex flex-col items-center gap-1.5">
                    {contactPhone && (
                      <a
                        href={`tel:${contactPhone}`}
                        className="text-xs text-[#D9A441] font-mono font-bold flex items-center gap-2 bg-[#0C0C0C]/90 px-4 py-1.5 rounded-full border border-[#D9A441]/40 shadow-md hover:scale-105 transition-transform"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#D9A441]" />
                        <span>For Inquiries &amp; Help: {contactPhone}</span>
                      </a>
                    )}
                    {contactAddress && (
                      <p className="text-[11px] text-[#F8F3EA]/70 italic">
                        {contactAddress}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-[10px] text-[#F8F3EA]/40 uppercase tracking-widest pt-3 font-mono">
                  Crafted with elegance &amp; love • Powered by Bervic Invitations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
