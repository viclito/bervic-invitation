"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Calendar } from "lucide-react";
import gsap from "gsap";
import "./BushOpeningCurtain.css";

export interface BushOpeningCurtainProps {
  coupleNames?: string;
  coupleInitials?: string;
  weddingDate?: string;
  welcomeLine?: string;
  onOpened?: () => void;
  autoOpenDelay?: number; // In ms, triggers after 2000ms by default
}

export default function BushOpeningCurtain({
  coupleNames = "Aarav & Riya",
  coupleInitials = "A & R",
  weddingDate = "November 28, 2026",
  welcomeLine = "Welcome to the Wedding Celebration of",
  onOpened,
  autoOpenDelay = 2000,
}: BushOpeningCurtainProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const bgWallRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsCompleted(true);
        if (onOpened) onOpened();
      },
    });

    // 1. Welcome Card purely fades opacity in place (ZERO movement / no going down)
    if (cardRef.current) {
      tl.to(cardRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      });
    }

    // 2. Left and Right bush curtains smoothly glide open
    tl.to(
      leftCurtainRef.current,
      {
        xPercent: -110,
        rotate: -3,
        scale: 1.05,
        duration: 1.8,
        ease: "power4.inOut",
      },
      "-=0.4"
    );

    tl.to(
      rightCurtainRef.current,
      {
        xPercent: 110,
        rotate: 3,
        scale: 1.05,
        duration: 1.8,
        ease: "power4.inOut",
      },
      "<"
    );

    // 3. Bush wall background fades out smoothly
    if (bgWallRef.current) {
      tl.to(
        bgWallRef.current,
        {
          opacity: 0,
          scale: 1.04,
          duration: 1.2,
          ease: "power3.inOut",
        },
        "-=1.4"
      );
    }

    // 4. Fade container out completely and destroy
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.3"
    );
  };

  // Keep static and visible for 2 seconds, then automatically start smooth gradual fade & open
  useEffect(() => {
    if (autoOpenDelay > 0 && !isOpen) {
      const timer = setTimeout(() => {
        handleOpen();
      }, autoOpenDelay);
      return () => clearTimeout(timer);
    }
  }, [autoOpenDelay, isOpen]);

  // Gentle fade-in for card (no movement)
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  if (isCompleted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`glowinn-curtain-stage ${isOpen ? "is-opening" : ""}`}
      onClick={handleOpen}
      aria-label="Wedding Opening Curtain"
    >
      {/* ── FULL SCREEN BUSH WALL BACKGROUND ── */}
      <div ref={bgWallRef} className="glowinn-curtain-bg-wall">
        <Image
          src="/templates/glowinn/bush-wall-bg.webp"
          alt="Lush forest foliage background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="glowinn-curtain-bg-scrim" />
      </div>

      {/* ── LEFT BUSH CURTAIN (OVERLAPPING CENTER) ── */}
      <div ref={leftCurtainRef} className="glowinn-curtain-panel glowinn-curtain-panel--left">
        <div className="glowinn-curtain-media">
          <Image
            src="/templates/glowinn/bush-left.webp"
            alt="Foliage curtain left"
            fill
            priority
            className="object-cover object-right"
            sizes="(max-width: 768px) 85vw, 68vw"
          />
        </div>
      </div>

      {/* ── RIGHT BUSH CURTAIN (OVERLAPPING CENTER) ── */}
      <div ref={rightCurtainRef} className="glowinn-curtain-panel glowinn-curtain-panel--right">
        <div className="glowinn-curtain-media">
          <Image
            src="/templates/glowinn/bush-right.webp"
            alt="Foliage curtain right"
            fill
            priority
            className="object-cover object-left"
            sizes="(max-width: 768px) 85vw, 68vw"
          />
        </div>
      </div>

      {/* ── CENTER WELCOME CARD WITH BUSH IMAGE BACKGROUND ── */}
      {!isOpen && (
        <div ref={cardRef} className="glowinn-curtain-welcome-card">
          <span className="glowinn-curtain-welcome-lead">
            <Sparkles className="w-3.5 h-3.5 text-[#f0b4c4]" />
            <span>{welcomeLine}</span>
            <Sparkles className="w-3.5 h-3.5 text-[#f0b4c4]" />
          </span>

          <h1 className="glowinn-curtain-welcome-names">{coupleNames}</h1>

          <div className="glowinn-curtain-seal__ring">
            <span className="glowinn-curtain-seal__initials">{coupleInitials}</span>
          </div>

          {weddingDate && (
            <div className="glowinn-curtain-welcome-date">
              <Calendar className="w-3.5 h-3.5 text-[#f0b4c4]" />
              <span>{weddingDate}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
