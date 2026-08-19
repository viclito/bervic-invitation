"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Palette, Wand2, Download, Layers } from "lucide-react";

export default function CanvaStudioSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile / touch devices
    const checkMobile = () => {
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 768 ||
        window.matchMedia("(hover: none)").matches;
      setIsMobile(isTouch);

      if (videoRef.current) {
        if (isTouch) {
          // On mobile: auto-play repeatedly in a continuous loop
          videoRef.current.muted = true;
          videoRef.current.loop = true;
          videoRef.current.playsInline = true;
          videoRef.current.play().catch(() => {
            // Autoplay policy fallback
          });
          setIsPlaying(true);
        } else {
          // On desktop: start paused until hover
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile && videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section id="canva-studio" className="py-20 lg:py-28 bg-gradient-to-b from-white via-red-50/25 to-white text-slate-900 relative overflow-hidden border-t border-b border-slate-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* ── LEFT COLUMN: Headline, Features & CTAs ── */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            
            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-serif font-bold text-slate-900 leading-[1.2] tracking-tight">
              Design Your Perfect Invitation with{" "}
              <span className="text-[#991B1B] italic font-serif">Canva Studio</span>
            </h2>

            {/* Feature Bullets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-red-100 shadow-2xs">
                <Palette className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Drag &amp; Drop Editor</h4>
                  <p className="text-[11px] text-slate-500">Edit text, fonts &amp; layout instantly</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-red-100 shadow-2xs">
                <Wand2 className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Traditional Motifs</h4>
                  <p className="text-[11px] text-slate-500">Ganesha, florals, foils &amp; borders</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-red-100 shadow-2xs">
                <Layers className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Multi-Page Suites</h4>
                  <p className="text-[11px] text-slate-500">Save the date, Muhurtham &amp; reception</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-red-100 shadow-2xs">
                <Download className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">HD Export &amp; Print</h4>
                  <p className="text-[11px] text-slate-500">Download PNG, PDF or order prints</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
              <Link
                href="/canva"
                className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>OPEN CANVA STUDIO</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/shop"
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-red-50 text-[#991B1B] border-2 border-[#991B1B] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>SHOP NOW</span>
              </Link>
            </div>

          </div>

          {/* ── RIGHT COLUMN: Video Player (Hover to play on desktop, continuous loop on mobile) ── */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div
              className="relative w-full cursor-pointer flex items-center justify-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={togglePlay}
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                playsInline
                muted
                loop
                preload="auto"
                className="w-full h-auto max-h-[520px] object-contain rounded-2xl"
              >
                <source src="/videos/canva-landing.mp4" type="video/mp4" />
                <source src="/canva-landing.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
