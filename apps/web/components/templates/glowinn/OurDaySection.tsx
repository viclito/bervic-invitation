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
  targetDate?: string; // ISO date string
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

  useEffect(() => {
    if (!targetDate) return;
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

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
            {(weddingDate || venuePlace) && (
              <p className="glowinn-countdown-foot">
                {weddingDate && <span>{weddingDate}</span>}
                {weddingTime && <span> • {weddingTime}</span>}
                {venuePlace && <span> • {venuePlace}</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
