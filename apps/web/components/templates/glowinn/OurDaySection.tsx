"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Calendar } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface OurDaySectionProps {
  partnerOne?: string;
  partnerTwo?: string;
  groomName?: string;
  groomTitle?: string;
  groomDesc?: string;
  groomImage?: string;
  brideName?: string;
  brideTitle?: string;
  brideDesc?: string;
  brideImage?: string;
  weddingDate?: string;
  weddingTime?: string;
  venuePlace?: string;
  targetDate?: string; // ISO or date string
}

function parseTargetDate(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== "string" || dateStr.trim() === "") return null;
  const raw = dateStr.trim();

  // Try standard direct parsing
  let d = new Date(raw);
  if (!isNaN(d.getTime())) {
    // If it's a date-only string (e.g. 2026-09-25), incorporate timeStr
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw) || /^\d{4}\/\d{2}\/\d{2}$/.test(raw)) {
      let hours = 10;
      let mins = 0;
      if (timeStr) {
        const timeParts = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (timeParts) {
          hours = parseInt(timeParts[1], 10);
          mins = parseInt(timeParts[2], 10);
          const ampm = timeParts[3]?.toUpperCase();
          if (ampm === "PM" && hours < 12) hours += 12;
          if (ampm === "AM" && hours === 12) hours = 0;
        }
      }
      d.setHours(hours, mins, 0, 0);
    }
    return d;
  }

  // Handle YYYY-MM-DD or YYYY/MM/DD manually
  const ymd = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymd) {
    const year = parseInt(ymd[1], 10);
    const month = parseInt(ymd[2], 10) - 1;
    const day = parseInt(ymd[3], 10);
    d = new Date(year, month, day, 10, 0, 0);
    if (!isNaN(d.getTime())) return d;
  }

  // Handle Month DD, YYYY
  const mdy = Date.parse(raw);
  if (!isNaN(mdy)) {
    return new Date(mdy);
  }

  return null;
}

export default function OurDaySection({
  partnerOne = "Groom",
  partnerTwo = "Bride",
  groomName,
  groomTitle = "The Groom",
  groomImage,
  brideName,
  brideTitle = "The Bride",
  brideImage,
  weddingDate,
  weddingTime,
  venuePlace,
  targetDate,
}: OurDaySectionProps) {
  const effectiveGroom = groomName || partnerOne;
  const effectiveBride = brideName || partnerTwo;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const coupleRowRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Failsafe Live Countdown Timer
  useEffect(() => {
    const effectiveDateStr = targetDate || weddingDate;
    const targetObj = parseTargetDate(effectiveDateStr, weddingTime);
    if (!targetObj) return;

    const calculateTime = () => {
      const difference = targetObj.getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate, weddingDate, weddingTime]);

  // GSAP Viewport ScrollTrigger Animations
  useEffect(() => {
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

      if (coupleRowRef.current) {
        gsap.fromTo(
          coupleRowRef.current.children,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: coupleRowRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (countdownRef.current) {
        gsap.fromTo(
          countdownRef.current,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: countdownRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="glowinn-section" id="our-day">
      <div className="shell">
        {/* Section Header */}
        <div ref={headerRef} className="glowinn-section__header">
          <span className="glowinn-section__badge">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Happy Couple</span>
          </span>
          <h2 className="glowinn-section__title">Our Special Day</h2>
          <p className="glowinn-section__subtitle">
            Two souls united in love and celebrated with family and friends.
          </p>
        </div>

        {/* Clean Square Floating Photos with Overlaid Text */}
        <div ref={coupleRowRef} className="glowinn-couple-square-row">
          {/* Groom Square Photo */}
          <div className="glowinn-couple-square-item group">
            {groomImage ? (
              <Image
                src={groomImage}
                alt={effectiveGroom}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-106"
                sizes="(max-width: 640px) 160px, 220px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/10">
                <span className="text-3xl font-serif text-[#f0b4c4]">
                  {(effectiveGroom || "G")[0]}
                </span>
              </div>
            )}
            {/* Small text overlay directly on the image */}
            <div className="glowinn-couple-square-overlay">
              <span className="glowinn-couple-square-tag">{groomTitle}</span>
              <h3 className="glowinn-couple-square-name">{effectiveGroom}</h3>
            </div>
          </div>

          {/* Bride Square Photo */}
          <div className="glowinn-couple-square-item group">
            {brideImage ? (
              <Image
                src={brideImage}
                alt={effectiveBride}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-106"
                sizes="(max-width: 640px) 160px, 220px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/10">
                <span className="text-3xl font-serif text-[#f0b4c4]">
                  {(effectiveBride || "B")[0]}
                </span>
              </div>
            )}
            {/* Small text overlay directly on the image */}
            <div className="glowinn-couple-square-overlay">
              <span className="glowinn-couple-square-tag">{brideTitle}</span>
              <h3 className="glowinn-couple-square-name">{effectiveBride}</h3>
            </div>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div ref={countdownRef} className="glowinn-countdown-wrapper">
          <div className="glowinn-glass-card glowinn-countdown-card">
            <div className="glowinn-countdown-card__header">
              <Calendar className="w-4 h-4 text-[#f0b4c4]" />
              <span>Counting Down to the Celebration</span>
            </div>
            <div className="glowinn-countdown-grid">
              <div className="glowinn-countdown-item">
                <span className="glowinn-countdown-val">{String(timeLeft.days).padStart(2, "0")}</span>
                <span className="glowinn-countdown-unit">Days</span>
              </div>
              <div className="glowinn-countdown-sep">:</div>
              <div className="glowinn-countdown-item">
                <span className="glowinn-countdown-val">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="glowinn-countdown-unit">Hours</span>
              </div>
              <div className="glowinn-countdown-sep">:</div>
              <div className="glowinn-countdown-item">
                <span className="glowinn-countdown-val">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="glowinn-countdown-unit">Mins</span>
              </div>
              <div className="glowinn-countdown-sep">:</div>
              <div className="glowinn-countdown-item">
                <span className="glowinn-countdown-val">{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="glowinn-countdown-unit">Secs</span>
              </div>
            </div>

            {/* Event Summary Details Footer */}
            {(weddingDate || weddingTime || venuePlace) && (
              <div className="glowinn-countdown-footer">
                {[weddingDate, weddingTime, venuePlace].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
