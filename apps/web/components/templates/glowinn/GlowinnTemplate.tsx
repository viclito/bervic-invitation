"use client";

import React, { useRef, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import OurDaySection from "./OurDaySection";
import EventsSection from "./EventsSection";
import TimelineSection from "./TimelineSection";
import OurStorySection from "./OurStorySection";
import LocationsSection, { VenueLocation } from "./LocationsSection";
import GallerySection from "./GallerySection";
import RsvpSection from "./RsvpSection";
import GlowinnFooter from "./GlowinnFooter";
import "./GlowinnTemplate.css";

// High-speed CDN video stream with global edge caching
const CDN_HERO_VIDEO_URL =
  "https://pub-1e5b4001b36b47e28e6a2fb775966a79.r2.dev/templates/glowinn/hero.mp4";

export interface GlowinnTemplateProps {
  partnerOne?: string;
  partnerTwo?: string;
  coupleNames?: string;
  coupleInitials?: string;
  tagline?: string;
  inviteLine?: string;
  weddingDate?: string;
  weddingTime?: string;
  venuePlace?: string;
  leadText?: string;
  welcomeMessage?: string;
  noteTitle?: string;
  noteDescription?: string;
  captionText?: string;
  groomName?: string;
  groomTitle?: string;
  groomDesc?: string;
  groomImage?: string;
  heroImage?: string;
  coupleImage?: string;
  coverImage?: string;
  partnerTwoImage?: string;
  brideName?: string;
  brideTitle?: string;
  brideDesc?: string;
  brideImage?: string;
  targetDate?: string;
  events?: any[];
  timelineDay?: any[];
  loveStoryText?: string;
  story?: any[];
  locations?: any[];
  galleryImages?: string[];
  contactAddress?: string;
  contactPhone?: string;
  onRsvpSubmit?: (data: { name: string; attending: string; guests: string; note: string }) => void;
  [key: string]: any;
}

export default function GlowinnTemplate(props: GlowinnTemplateProps) {
  const {
    partnerOne,
    partnerTwo,
    coupleNames,
    coupleInitials,
    tagline,
    inviteLine,
    weddingDate,
    weddingTime,
    venuePlace,
    leadText,
    welcomeMessage,
    noteTitle,
    noteDescription,
    captionText,
    groomName,
    groomTitle,
    groomDesc,
    groomImage,
    heroImage,
    coupleImage,
    coverImage,
    partnerTwoImage,
    brideName,
    brideTitle,
    brideDesc,
    brideImage,
    targetDate,
    events,
    timelineDay,
    loveStoryText,
    story,
    locations,
    galleryImages,
    contactAddress,
    contactPhone,
    onRsvpSubmit,
  } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Defer video stream until after initial DOM paint to make page load instantaneous
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setVideoLoaded(true);
    video.addEventListener("canplay", handleCanPlay);

    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        // Fallback gracefully to poster if autoplay is restricted
        setVideoLoaded(true);
      });
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      setVideoLoaded(true);
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [shouldLoadVideo]);

  const effectivePartnerOne = groomName || partnerOne || "Groom";
  const effectivePartnerTwo = brideName || partnerTwo || "Bride";
  const effectiveNames = coupleNames || `${effectivePartnerOne} & ${effectivePartnerTwo}`;
  const effectiveInitials =
    coupleInitials ||
    `${(effectivePartnerOne || "G")[0]} & ${(effectivePartnerTwo || "B")[0]}`;

  const effectiveGroomImg = groomImage || coupleImage || heroImage;
  const effectiveBrideImg = brideImage || partnerTwoImage || coverImage;

  // Format date if ISO string
  let formattedDate = weddingDate;
  if (weddingDate && weddingDate.includes("T")) {
    try {
      const d = new Date(weddingDate);
      formattedDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      formattedDate = weddingDate;
    }
  }

  // Map locations if supplied
  const mappedLocations: VenueLocation[] | undefined = locations?.map((l) => ({
    name: l.name || l.venueLabel || "Celebration Venue",
    tag: l.tag || "Ceremony Venue",
    address: l.address || "",
    time: l.time || weddingTime,
    mapUrl:
      l.mapLink ||
      l.mapUrl ||
      (l.address ? `https://maps.google.com/?q=${encodeURIComponent(l.address)}` : undefined),
    contact: l.contact || contactPhone,
  }));

  const hasGallery = Boolean(galleryImages && galleryImages.length > 0);

  return (
    <div className="glowinn-root">
      {/* ── FIXED OPTIMIZED BACKGROUND LAYER (INSTANT POSTER + CDN STREAM) ── */}
      <div
        className="glowinn-fixed-bg"
        style={{
          backgroundImage: "url('/hero-poster.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      >
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            className={`glowinn-fixed-bg__video ${videoLoaded ? "is-ready" : ""}`}
            src={CDN_HERO_VIDEO_URL}
            poster="/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        )}
        <div className="glowinn-fixed-bg__scrim" />
      </div>

      {/* ── NAVIGATION ── */}
      <Navbar coupleNames={effectiveNames} coupleInitials={effectiveInitials} />

      {/* ── SCROLLING CONTENT SECTIONS ── */}
      <main className="glowinn-main">
        {/* Section 1: Hero */}
        <Hero
          partnerOne={effectivePartnerOne}
          partnerTwo={effectivePartnerTwo}
          weddingDate={formattedDate}
          weddingTime={weddingTime}
          tagline={tagline}
          leadText={leadText}
          inviteLine={inviteLine}
          welcomeMessage={welcomeMessage}
          noteTitle={noteTitle}
          noteDescription={noteDescription}
          captionText={captionText}
        />

        {/* Section 2: Our Day (Bride & Groom + Live Countdown) */}
        <OurDaySection
          partnerOne={effectivePartnerOne}
          partnerTwo={effectivePartnerTwo}
          groomName={effectivePartnerOne}
          groomTitle={groomTitle}
          groomDesc={groomDesc}
          groomImage={effectiveGroomImg}
          brideName={effectivePartnerTwo}
          brideTitle={brideTitle}
          brideDesc={brideDesc}
          brideImage={effectiveBrideImg}
          weddingDate={formattedDate}
          weddingTime={weddingTime}
          venuePlace={venuePlace}
          targetDate={targetDate || (weddingDate && weddingDate.includes("T") ? weddingDate : undefined)}
        />

        {/* Section 3: Wedding Celebrations (Events) */}
        {events && events.length > 0 && <EventsSection events={events} />}

        {/* Section 4: Day Timeline */}
        {timelineDay && timelineDay.length > 0 && <TimelineSection items={timelineDay} />}

        {/* Section 5: Our Story */}
        <OurStorySection loveStoryText={loveStoryText} story={story} />

        {/* Section 6: Locations & Maps */}
        <LocationsSection
          locations={mappedLocations}
          venuePlace={venuePlace}
          contactAddress={contactAddress}
          contactPhone={contactPhone}
        />

        {/* Section 7: Our Moments (Gallery with Lightbox) */}
        {hasGallery && <GallerySection images={galleryImages} />}

        {/* Section 8: RSVP & Blessings */}
        <RsvpSection onRsvpSubmit={onRsvpSubmit} />
      </main>

      {/* ── FOOTER ── */}
      <GlowinnFooter coupleNames={effectiveNames} coupleInitials={effectiveInitials} />
    </div>
  );
}
