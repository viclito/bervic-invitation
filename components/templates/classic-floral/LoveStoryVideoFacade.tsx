"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Play, Film, ExternalLink, VideoOff } from "lucide-react";

interface LoveStoryVideoFacadeProps {
  loveStoryText: string;
  loveStoryVideoUrl: string;
  coupleImage: string;
  coverImage?: string;
  partnerOne: string;
  partnerTwo: string;
  showVideoSection?: boolean;
}

// Extracts clean YouTube Video ID from any URL (watch, shorts, youtu.be, embed)
export function getYouTubeVideoId(url: string): string {
  if (!url || !url.trim()) return "";

  try {
    if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/")[1];
      return parts.split("?")[0].split("&")[0].split("/")[0];
    }
    if (url.includes("youtube.com/watch")) {
      const match = url.match(/[?&]v=([^&]+)/);
      if (match && match[1]) return match[1];
    }
    if (url.includes("youtube.com/embed/")) {
      const parts = url.split("youtube.com/embed/")[1];
      return parts.split("?")[0].split("&")[0].split("/")[0];
    }
    if (url.includes("youtube.com/shorts/")) {
      const parts = url.split("youtube.com/shorts/")[1];
      return parts.split("?")[0].split("&")[0].split("/")[0];
    }
  } catch (e) {
    console.error("Error parsing YouTube Video ID:", e);
  }

  return "";
}

export function parseYouTubeEmbedUrl(url: string): string {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return "";
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

export default function LoveStoryVideoFacade({
  loveStoryText,
  loveStoryVideoUrl,
  coupleImage,
  coverImage,
  partnerOne,
  partnerTwo,
  showVideoSection = true,
}: LoveStoryVideoFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const hasVideo = showVideoSection !== false && Boolean(loveStoryVideoUrl && loveStoryVideoUrl.trim() !== "");
  const hasText = Boolean(loveStoryText && loveStoryText.trim() !== "");

  if (!hasVideo && !hasText) {
    return null;
  }

  const videoId = getYouTubeVideoId(loveStoryVideoUrl || "");
  const embedUrl = parseYouTubeEmbedUrl(loveStoryVideoUrl || "");
  const directWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <section id="story" className="py-24 md:py-32 bg-[#FDF6F3] relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
        {/* Heading & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-[1px] bg-[#C9A15A]" />
            <Heart className="w-4 h-4 text-[#B85C6B] fill-current" />
            <div className="w-10 h-[1px] bg-[#C9A15A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-accent text-[#2B2320]">
            Our Love Story
          </h2>
          <p className="text-lg sm:text-xl font-accent italic text-[#B85C6B] mt-2">
            "Every love story is beautiful, but ours is my favorite."
          </p>
        </motion.div>

        {/* Narrative Text Card */}
        {hasText && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#FDF6F3] border border-[#C9A15A]/30 rounded-3xl p-6 sm:p-10 shadow-sm max-w-3xl mx-auto mb-10 text-[#2B2320]/80 leading-relaxed text-sm sm:text-base italic font-accent"
          >
            <p>{loveStoryText}</p>
          </motion.div>
        )}

        {/* Video Facade (Click-to-Load YouTube Embed) */}
        {hasVideo && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-3xl mx-auto aspect-video rounded-3xl overflow-hidden card-shadow border-2 border-[#C9A15A]/40 bg-[#2B2320]"
            >
              {isPlaying ? (
                <div className="relative w-full h-full">
                  <iframe
                    src={embedUrl}
                    title={`${partnerOne} & ${partnerTwo}'s Love Story Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                  {/* Direct Watch Button Fallback */}
                  <div className="absolute top-2 right-2 z-20">
                    <a
                      href={directWatchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#2B2320]/80 hover:bg-[#B85C6B] text-[#FDF6F3] text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#C9A15A]/50 flex items-center gap-1.5 backdrop-blur-sm transition-all shadow-md"
                      title="Open video on YouTube app/browser if embedding is restricted"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsPlaying(true)}
                  className="relative w-full h-full cursor-pointer group"
                >
                  {/* Facade Poster Image */}
                  <Image
                    src={coverImage || coupleImage || "/images/templates/couple-photo.jpg"}
                    alt={`${partnerOne} & ${partnerTwo} Video Thumbnail`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2320]/80 via-[#2B2320]/30 to-transparent flex flex-col items-center justify-center p-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#B85C6B] text-[#FDF6F3] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-2 border-[#C9A15A]">
                      <Play className="w-8 h-8 fill-current ml-1 text-[#C9A15A]" />
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#FDF6F3] uppercase tracking-wider bg-[#2B2320]/60 px-4 py-1.5 rounded-full backdrop-blur-sm border border-[#C9A15A]/30">
                      <Film className="w-4 h-4 text-[#C9A15A]" />
                      <span>Watch Our Journey Film</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Fallback Direct Link Bar */}
            <div className="mt-3 max-w-3xl mx-auto text-center">
              <a
                href={directWatchUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B85C6B] hover:underline"
              >
                <span>Having playback issues? Click to watch directly on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
