"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Hero.css";

export interface HeroProps {
  partnerOne?: string;
  partnerTwo?: string;
  weddingDate?: string;
  weddingTime?: string;
  tagline?: string;
  leadText?: string;
  inviteLine?: string;
  welcomeMessage?: string;
  noteTitle?: string;
  noteDescription?: string;
  captionText?: string;
}

export default function Hero({
  partnerOne,
  partnerTwo,
  weddingDate,
  weddingTime,
  tagline,
  leadText,
  inviteLine,
  welcomeMessage,
  noteTitle,
  noteDescription,
  captionText,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const footRef = useRef<HTMLDivElement>(null);

  const displayLead = leadText || tagline || "Together With Their Families";
  const coupleTitle =
    partnerOne && partnerTwo
      ? `${partnerOne} & ${partnerTwo}`
      : partnerOne || partnerTwo || "The Wedding";

  const effectiveNoteTitle = noteTitle || welcomeMessage || "A Celebration of Love";
  const effectiveNoteDesc =
    noteDescription ||
    inviteLine ||
    "Join us under the sunlit canopy as we unite our hearts and celebrate the beginning of our forever.";

  const hasStats = Boolean(weddingDate || weddingTime);

  // GSAP Premium Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 40, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, delay: 0.2 }
        );
      }

      if (footRef.current) {
        tl.fromTo(
          footRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 },
          "-=0.6"
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="glowinn-hero" id="top">
      {/* Centre Headline Block */}
      <div className="glowinn-hero__body shell">
        <h1 ref={titleRef} className="glowinn-hero__title">
          <span className="glowinn-hero__title-lead">{displayLead}</span>
          {coupleTitle}
        </h1>

        {/* Subtle scroll down indicator */}
        <div className="glowinn-hero__scroll-hint">
          <span className="glowinn-hero__scroll-text">Scroll to explore our wedding</span>
          <div className="glowinn-hero__scroll-line" />
        </div>
      </div>

      {/* Foot Row: Note Card · Caption · Stat Cards */}
      <div ref={footRef} className="glowinn-hero__foot shell">
        <article className="glowinn-card glowinn-card--note">
          <h2>{effectiveNoteTitle}</h2>
          <p>{effectiveNoteDesc}</p>
        </article>

        {captionText && <p className="glowinn-hero__caption">{captionText}</p>}

        {hasStats && (
          <div className="glowinn-hero__stats">
            {weddingDate && (
              <article className="glowinn-card glowinn-card--stat">
                <strong>{weddingDate}</strong>
                <span className="glowinn-card__label">Wedding Day</span>
                <span className="glowinn-card__foot">Save The Date</span>
              </article>
            )}
            {weddingTime && (
              <article className="glowinn-card glowinn-card--stat">
                <strong>{weddingTime}</strong>
                <span className="glowinn-card__label">Ceremony Time</span>
                <span className="glowinn-card__foot">Grand Matrimony</span>
              </article>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
