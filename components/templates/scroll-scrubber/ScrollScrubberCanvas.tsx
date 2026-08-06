"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Sparkles,
  ChevronDown,
  Volume2,
  VolumeX,
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

interface EventItem {
  time: string;
  title: string;
  location?: string;
  description?: string;
}

interface LocationItem {
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
  events?: EventItem[];
  locations?: LocationItem[];
  onExploreClick?: () => void;
  bgAudioUrl?: string;
}

export default function ScrollScrubberCanvas({
  partnerOne = "Terance",
  partnerTwo = "Ancy",
  tagline = "THE WEDDING OF",
  inviteLine = "Together with their families, invite you to celebrate their union of love",
  weddingDate = "December 18, 2026",
  weddingTime = "4:00 PM Onwards",
  events = [
    {
      time: "03:30 PM",
      title: "Guest Arrival & Welcome Drinks",
      location: "Grand Foyer, St. Patrick's",
      description: "Welcome flute of champagne & harp performance",
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

  // Smooth frame scrubbing animation refs
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Draw frame with object-fit: cover matrix calculation
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retrieve image or nearest loaded fallback frame
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find closest loaded frame
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
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Draw current frame immediately
    const roundedIndex = Math.min(
      Math.max(Math.round(currentFrameRef.current), 0),
      TOTAL_FRAMES - 1
    );
    drawFrame(roundedIndex);
  }, [drawFrame]);

  // Progressive keyframe priority preloader
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

            // Unlock playback early once keyframes (or 50+ frames) are ready
            if (scene1Count >= 40) {
              setIsScene1Ready(true);
            }
          }

          if (totalCount === TOTAL_FRAMES) {
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
            if (scene1Count >= 40) {
              setIsScene1Ready(true);
            }
          }
          resolve();
        };
      });
    };

    // Stage 1: Keyframe priority load (every 4th frame for Scene 1)
    const loadKeyframes = async () => {
      const keyframeIndices: number[] = [];
      for (let i = 0; i < TOTAL_SCENE1_FRAMES; i += 4) {
        keyframeIndices.push(i);
      }

      const batchSize = 16;
      for (let i = 0; i < keyframeIndices.length; i += batchSize) {
        if (isCancelled) break;
        const batch = keyframeIndices
          .slice(i, i + batchSize)
          .map((idx) => loadFrame(idx));
        await Promise.all(batch);
      }

      if (!isCancelled) {
        setIsScene1Ready(true);
        // Stage 2: Fill in remaining frames in background
        loadRemainingFrames();
      }
    };

    // Stage 2: Fill in all remaining frames (Scene 1 intermediate + Scene 2)
    const loadRemainingFrames = async () => {
      const remainingIndices: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!imagesRef.current[i]) {
          remainingIndices.push(i);
        }
      }

      const batchSize = 12;
      for (let i = 0; i < remainingIndices.length; i += batchSize) {
        if (isCancelled) break;
        const batch = remainingIndices
          .slice(i, i + batchSize)
          .map((idx) => loadFrame(idx));
        await Promise.all(batch);
      }

      if (!isCancelled) {
        setIsFullyLoaded(true);
      }
    };

    loadKeyframes();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Handle Resize
  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);
    return () => window.removeEventListener("resize", updateCanvasDimensions);
  }, [updateCanvasDimensions]);

  // Lerp Animation & Scroll Listener loop
  useEffect(() => {
    if (!isScene1Ready) return;

    // Draw initial frame
    updateCanvasDimensions();

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);

      setScrollProgress(progress);
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Continuous requestAnimationFrame lerp loop
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const tick = () => {
      const diff = Math.abs(targetFrameRef.current - currentFrameRef.current);
      if (diff > 0.005) {
        currentFrameRef.current = lerp(
          currentFrameRef.current,
          targetFrameRef.current,
          0.14
        );
        const roundedIndex = Math.min(
          Math.max(Math.round(currentFrameRef.current), 0),
          TOTAL_FRAMES - 1
        );
        drawFrame(roundedIndex);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
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

  // Range interpolation helper for overlay section fades & Y drift
  const calculateRangeStyle = (start: number, end: number) => {
    const p = scrollProgress;
    if (p < start || p > end) {
      return { opacity: 0, translateY: 28, pointerEvents: "none" as const };
    }

    const duration = end - start;
    const fadeInEnd = start + duration * 0.22;
    const fadeOutStart = start + duration * 0.78;

    let opacity = 1;
    if (p < fadeInEnd) {
      opacity = (p - start) / (fadeInEnd - start);
    } else if (p > fadeOutStart) {
      opacity = 1 - (p - fadeOutStart) / (end - fadeOutStart);
    }

    opacity = Math.max(0, Math.min(1, opacity));
    const rangeProgress = (p - start) / duration;
    const translateY = (1 - rangeProgress) * 24 - 12;

    return {
      opacity,
      translateY,
      pointerEvents: opacity > 0.25 ? ("auto" as const) : ("none" as const),
    };
  };

  const styleHero = calculateRangeStyle(0.0, 0.18);
  const styleStory = calculateRangeStyle(0.2, 0.38);
  const styleTimeline = calculateRangeStyle(0.4, 0.58);
  const styleLocations = calculateRangeStyle(0.6, 0.78);
  const styleRsvp = calculateRangeStyle(0.8, 0.98);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0B0B0B] text-[#FDF6F3] font-sans overflow-clip"
      style={{ height: "800vh" }}
    >
      {/* 1. Minimal Elegant Gold Preloader */}
      <AnimatePresence>
        {!isScene1Ready && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070707] text-[#D9A441] px-6 text-center"
          >
            {/* Elegant Monogram */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full border border-[#D9A441]/40 flex items-center justify-center mb-4 bg-[#D9A441]/5 shadow-[0_0_25px_rgba(217,164,65,0.2)]">
                <Sparkles className="w-7 h-7 text-[#D9A441] animate-pulse" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-accent italic text-[#F8F3EA] tracking-wide">
                {partnerOne} <span className="text-[#D9A441] font-normal">&amp;</span> {partnerTwo}
              </h2>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D9A441]/80 mt-2 font-medium">
                Wedding Invitation Sequence
              </p>
            </motion.div>

            {/* Progress Bar Container */}
            <div className="w-64 max-w-full">
              <div className="flex justify-between text-xs text-[#D9A441]/90 mb-2 tracking-widest font-mono">
                <span>LOADING SCENE 1</span>
                <span>{scene1ProgressPercent}%</span>
              </div>
              <div className="h-[2px] w-full bg-[#1F1D1A] rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D9A441]/60 via-[#F7E7C4] to-[#D9A441] shadow-[0_0_12px_#D9A441]"
                  style={{ width: `${scene1ProgressPercent}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-[#F8F3EA]/40 mt-6 tracking-wider font-light">
              Crafting a cinematic experience...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Pinned Full-Viewport Canvas */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block filter brightness-[0.88] contrast-[1.04]"
        />

        {/* Cinematic Vignette & Ambient Radial Glows */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,7,7,0.75)_100%)]" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#070707]/60 via-transparent to-[#070707]/80" />

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

        {/* Scroll Progress Gold Line (Bottom Viewport Accent) */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10 z-30">
          <div
            className="h-full bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] transition-all duration-75 shadow-[0_0_10px_#D9A441]"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Background Scene 2 loading indicator subtle badge */}
        {!isFullyLoaded && isScene1Ready && (
          <div className="fixed bottom-4 left-6 z-40 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D9A441]/70 bg-[#0B0B0B]/80 px-3 py-1 rounded-full border border-[#D9A441]/20 backdrop-blur-sm pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-ping" />
            Optimizing Scene 2 ({Math.round((loadedTotalCount / TOTAL_FRAMES) * 100)}%)
          </div>
        )}
      </div>

      {/* 3. Layered Content Overlays (Synchronized to Scroll Progress) */}
      <div className="sticky top-0 left-0 w-full h-screen pointer-events-none z-20 flex items-center justify-center p-4 sm:p-8">
        {/* OVERLAY BLOCK 1: HERO / COUPLE ANNOUNCEMENT (0.00 - 0.18) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-all duration-300 ease-out"
          style={{
            opacity: styleHero.opacity,
            transform: `translateY(${styleHero.translateY}px)`,
            pointerEvents: styleHero.pointerEvents,
          }}
        >
          <div className="max-w-2xl bg-[#070707]/75 backdrop-blur-md border border-[#D9A441]/30 p-8 sm:p-12 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#D9A441] to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#D9A441] to-transparent" />

            <span className="inline-block text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold mb-4 px-4 py-1 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/20">
              {tagline}
            </span>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-accent italic text-[#FDF6F3] tracking-tight leading-tight my-4">
              {partnerOne}{" "}
              <span className="text-[#D9A441] font-normal">&amp;</span>{" "}
              {partnerTwo}
            </h1>

            <p className="text-sm sm:text-base text-[#F8F3EA]/80 font-light max-w-lg mx-auto italic mb-6">
              &quot;{inviteLine}&quot;
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B0B0B]/80 border border-[#D9A441]/30 text-xs sm:text-sm text-[#F7E7C4]">
                <Calendar className="w-4 h-4 text-[#D9A441]" />
                <span>{weddingDate}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B0B0B]/80 border border-[#D9A441]/30 text-xs sm:text-sm text-[#F7E7C4]">
                <Clock className="w-4 h-4 text-[#D9A441]" />
                <span>{weddingTime}</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#D9A441] animate-bounce">
              <span>Scroll to Begin Story</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* OVERLAY BLOCK 2: OUR LOVE STORY (0.20 - 0.38) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-all duration-300 ease-out"
          style={{
            opacity: styleStory.opacity,
            transform: `translateY(${styleStory.translateY}px)`,
            pointerEvents: styleStory.pointerEvents,
          }}
        >
          <div className="max-w-xl bg-[#070707]/80 backdrop-blur-md border border-[#D9A441]/30 p-8 sm:p-10 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] relative">
            <div className="w-12 h-12 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/40 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-[#D9A441] fill-current" />
            </div>

            <span className="text-xs uppercase tracking-[0.3em] text-[#D9A441]">
              Chapter One
            </span>
            <h2 className="text-3xl sm:text-5xl font-accent italic text-[#FDF6F3] mt-2 mb-4">
              Our Journey of Love
            </h2>

            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D9A441] to-transparent mx-auto mb-6" />

            <p className="text-sm sm:text-base text-[#F8F3EA]/85 leading-relaxed font-light mb-6">
              From our first quiet conversation to thousands of shared laughs,
              every step of our journey has led us to this sacred moment. We
              invite you to stand with us as we vow our forever.
            </p>

            <blockquote className="italic font-accent text-lg text-[#D9A441] border-l-2 border-[#D9A441] pl-4 py-1 text-left bg-[#D9A441]/5 rounded-r-xl">
              &quot;In your hands, my heart has found its eternal home.&quot;
            </blockquote>
          </div>
        </div>

        {/* OVERLAY BLOCK 3: ORDER OF EVENTS TIMELINE (0.40 - 0.58) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 transition-all duration-300 ease-out"
          style={{
            opacity: styleTimeline.opacity,
            transform: `translateY(${styleTimeline.translateY}px)`,
            pointerEvents: styleTimeline.pointerEvents,
          }}
        >
          <div className="max-w-2xl w-full bg-[#070707]/85 backdrop-blur-md border border-[#D9A441]/30 p-6 sm:p-10 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D9A441] font-medium">
              Schedule of Celebration
            </span>
            <h2 className="text-3xl sm:text-4xl font-accent italic text-[#FDF6F3] mt-1 mb-6">
              Order of Events
            </h2>

            <div className="space-y-4 text-left">
              {events.map((evt, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#0B0B0B]/70 border border-[#D9A441]/20 hover:border-[#D9A441]/50 transition-colors"
                >
                  <div className="px-3 py-1.5 rounded-xl bg-[#D9A441]/10 border border-[#D9A441]/40 text-[#D9A441] text-xs font-mono font-semibold whitespace-nowrap">
                    {evt.time}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#FDF6F3]">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[#D9A441] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{evt.location}</span>
                    </p>
                    {evt.description && (
                      <p className="text-xs text-[#F8F3EA]/70 mt-1 font-light">
                        {evt.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OVERLAY BLOCK 4: VENUES & LOCATIONS (0.60 - 0.78) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 transition-all duration-300 ease-out"
          style={{
            opacity: styleLocations.opacity,
            transform: `translateY(${styleLocations.translateY}px)`,
            pointerEvents: styleLocations.pointerEvents,
          }}
        >
          <div className="max-w-2xl w-full bg-[#070707]/85 backdrop-blur-md border border-[#D9A441]/30 p-6 sm:p-10 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D9A441] font-medium">
              Where &amp; When
            </span>
            <h2 className="text-3xl sm:text-4xl font-accent italic text-[#FDF6F3] mt-1 mb-6">
              The Venues
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {locations.map((loc, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0B0B0B]/80 border border-[#D9A441]/30 flex flex-col justify-between text-left"
                >
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#D9A441] font-medium">
                      {loc.title}
                    </span>
                    <h3 className="text-lg font-bold text-[#FDF6F3] mt-1">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-[#F8F3EA]/75 mt-2 font-light leading-relaxed">
                      {loc.address}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#D9A441]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{loc.time}</span>
                    </div>
                  </div>

                  {loc.mapUrl && (
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#D9A441]/15 border border-[#D9A441]/40 text-[#D9A441] text-xs font-semibold hover:bg-[#D9A441] hover:text-[#0B0B0B] transition-all"
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

        {/* OVERLAY BLOCK 5: RSVP & CALLOUT (0.80 - 0.98) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-all duration-300 ease-out"
          style={{
            opacity: styleRsvp.opacity,
            transform: `translateY(${styleRsvp.translateY}px)`,
            pointerEvents: styleRsvp.pointerEvents,
          }}
        >
          <div className="max-w-lg bg-[#070707]/90 backdrop-blur-md border border-[#D9A441]/40 p-8 sm:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative">
            <div className="w-16 h-16 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/40 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#D9A441]" />
            </div>

            <span className="text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold">
              Kindly Respond
            </span>
            <h2 className="text-4xl sm:text-5xl font-accent italic text-[#FDF6F3] mt-2 mb-4">
              Celebrate With Us
            </h2>

            <p className="text-sm text-[#F8F3EA]/80 font-light mb-8 max-w-sm mx-auto">
              Your presence will make our celebration complete. Please confirm
              your attendance below.
            </p>

            <button
              onClick={onExploreClick}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#0B0B0B] font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(217,164,65,0.4)] hover:scale-[1.02] transition-transform cursor-pointer"
            >
              Fill RSVP Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
