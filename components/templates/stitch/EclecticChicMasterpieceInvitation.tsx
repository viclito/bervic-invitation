"use client";

import { getWeddingTargetDate, formatAgeOrdinal } from "@/lib/dateUtils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, PlayCircle, MapPin, Gift, Sparkles, ExternalLink, Calendar } from "lucide-react";

export default function EclecticChicMasterpieceInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Celebrant Name & Age
  const ageMilestone = formatAgeOrdinal(props.turningAge);
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const brandName = "Celebration";

  // Venue location fallback
  const mapQuery = encodeURIComponent(
    props.contactAddress ||
      props.venuePlace ||
      (props.locations && props.locations[0] && props.locations[0].address) ||
      "123 Creative District Avenue, Metropolis, NY 10001"
  );
  const mainVenue =
    props.locations && props.locations[0]
      ? {
          ...props.locations[0],
          name: props.locations[0].name || props.venuePlace || "The Artisan Foundry",
          address: props.locations[0].address || props.contactAddress || props.venuePlace || "123 Creative District Avenue, Metropolis, NY 10001",
          mapLink:
            props.locations[0].mapLink &&
            props.locations[0].mapLink !== "https://maps.google.com" &&
            props.locations[0].mapLink !== "https://maps.google.com/"
              ? props.locations[0].mapLink
              : `https://maps.google.com/?q=${mapQuery}`,
        }
      : {
          name: props.venuePlace || "The Artisan Foundry",
          address: props.contactAddress || props.venuePlace || "123 Creative District Avenue, Metropolis, NY 10001",
          mapLink: `https://maps.google.com/?q=${mapQuery}`,
        };

  // Celebrant portrait priority
  const celebrantPhoto =
    props.coupleImage ||
    props.coverImage ||
    (props.heroImage && !props.heroImage.includes("wedding") ? props.heroImage : undefined) ||
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80";

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = getWeddingTargetDate(props.weddingDate, props.weddingTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetDate - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [props.weddingDate, props.weddingTime]);

  // Gallery items matching exact Stitch screen c2a28195b90246c19cc930f204e0c9ed
  const galleryList =
    props.galleryImages && props.galleryImages.filter(img => Boolean(Boolean(img && String(img).trim()))).length > 0
      ? props.galleryImages
      : [
          {
            url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80",
            margin: "",
          },
          {
            url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
            margin: "mt-6 md:mt-10",
          },
          {
            url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
            margin: "",
          },
          {
            url: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=1200&q=80",
            margin: "mt-6 md:mt-10",
          },
        ];

  // Celebration Itinerary items
  const itinerarySteps =
    props.events && props.events.length > 0
      ? props.events
      : [
          {
            time: "5:00 PM",
            title: "Welcome Receptions & Aperitifs",
            desc: "Gather in the conservatory for artisanal cocktails and a curated selection of hors d'oeuvres.",
            isHighlight: false,
          },
          {
            time: "7:00 PM",
            title: "The Grand Feast",
            desc: "A multi-course culinary experience inspired by Evelyn's travels, served in the main dining hall.",
            isHighlight: false,
          },
          {
            time: "9:00 PM",
            title: "Toasts & Revelry",
            desc: "Stories shared, glasses raised, and live music to carry us into the night.",
            isHighlight: true,
          },
        ];

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] font-mono antialiased overflow-x-hidden relative min-h-screen">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Work+Sans:wght@400;600&display=swap"
        rel="stylesheet"
      />

      {/* Blueprint Grid & Cloud Mask CSS Engine */}
      <style>{`
        .blueprint-grid {
          background-image: 
            linear-gradient(to right, rgba(124, 118, 110, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(124, 118, 110, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .cloud-mask {
          clip-path: polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%);
        }

        .sticker-peel {
          transition: all 0.3s ease;
          position: relative;
        }
        .sticker-peel::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          background: linear-gradient(225deg, transparent 50%, #94492c 50%);
          transition: all 0.3s ease;
          box-shadow: -2px 2px 4px rgba(0,0,0,0.1);
        }
        .sticker-peel:hover::after {
          width: 36px;
          height: 36px;
        }
        .sticker-peel:hover {
          transform: scale(1.02);
        }

        .font-serif-caslon {
          font-family: 'Libre Caslon Text', serif;
        }
        .font-mono-space {
          font-family: 'Space Mono', monospace;
        }
        .font-sans-work {
          font-family: 'Work Sans', sans-serif;
        }
      `}</style>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Sunday, 20th September 2026 at 5:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="eclectic-chic-masterpiece"
      />

      {/* Header */}
      <header className="hidden md:flex justify-between items-center px-10 py-5 w-full max-w-[1280px] mx-auto border-b border-[#7c766e]/40 bg-[#fcf9f8] sticky top-0 z-50">
        <div className="font-serif-caslon text-3xl text-[#94492c] font-normal tracking-wide">
          {brandName}
        </div>
        <nav className="flex space-x-8 font-serif-caslon text-[#645d53] text-sm uppercase tracking-widest">
          <a
            className="hover:text-[#94492c] transition-colors"
            href="#itinerary"
          >
            Itinerary
          </a>
          <a
            className="hover:text-[#94492c] transition-colors"
            href="#venue"
          >
            Venue
          </a>
          <a
            className="hover:text-[#94492c] transition-colors"
            href="#gallery"
          >
            Archive
          </a>
          <a
            className="hover:text-[#94492c] transition-colors"
            href="#rsvp"
          >
            RSVP
          </a>
        </nav>
        <a
          className="border border-[#1c1b1b] px-5 py-2 font-sans-work text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#94492c] hover:text-white transition-all duration-300"
          href="#rsvp"
        >
          RSVP Now
        </a>
      </header>

      {/* Main Canvas Container */}
      <main className="max-w-[1280px] mx-auto px-6 md:px-10 pb-24 border-x border-[#7c766e]/30 blueprint-grid relative">
        {/* Hero Section */}
        <section className="relative min-h-[750px] flex flex-col md:flex-row items-center justify-center gap-12 border-b border-[#7c766e]/40 pb-16 pt-12">
          <div className="flex-1 flex flex-col items-start space-y-6 z-10">
            <div className="border border-[#1c1b1b] px-3 py-1 inline-block bg-[#fcf9f8]">
              <span className="font-sans-work text-xs text-[#1c1b1b] uppercase tracking-[0.2em] font-semibold">
                VOL. {ageMilestone || "SPECIAL EDITION"}
              </span>
            </div>
            <h1 className="font-serif-caslon text-4xl md:text-6xl text-[#1c1b1b] leading-tight font-normal">
              {celebrantName}'s Grand Soirée
            </h1>
            <p className="font-mono-space text-base text-[#4b463f] max-w-md leading-relaxed">
              Join us for an eclectic celebration. A curated evening of warmth, curiosity, and artisanal revelry among cherished friends.
            </p>

            {/* Quick Event Meta Summary */}
            <div className="w-full border-t border-b border-[#7c766e]/30 py-3 font-mono-space text-xs text-[#4b463f] space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#94492c]" />
                <span>{props.weddingTime || "Sunday, 20th September 2026 at 5:00 PM"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#94492c]" />
                <a href="#venue" className="underline hover:text-[#94492c]">
                  {mainVenue.name || "The Artisan Foundry"} • {mainVenue.address}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                className="inline-block border border-[#1c1b1b] px-8 py-4 font-sans-work text-xs uppercase tracking-[0.2em] font-semibold bg-[#fcf9f8] text-[#1c1b1b] hover:bg-[#94492c] hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:shadow-none"
                href="#rsvp"
              >
                RSVP Now
              </a>
            </div>
          </div>

          <div className="flex-1 relative flex justify-center items-center h-[420px] md:h-[500px] w-full max-w-[500px]">
            {/* Spinning Dashed Sunburst Border */}
            <div
              className="absolute inset-0 border-8 border-dashed border-[#735c00] opacity-30 rounded-full"
              style={{ animation: "spin 60s linear infinite" }}
            />
            <div className="relative w-full h-full cloud-mask overflow-hidden border border-[#7c766e] bg-[#f0eded] group">
              <img
                alt={`${celebrantName} Editorial Portrait`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                src={celebrantPhoto}
              />
            </div>
          </div>
        </section>

        {/* Countdown Section (The Anticipation) */}
        <section className="py-16 border-b border-[#7c766e]/40 relative">
          <h2 className="font-serif-caslon text-3xl md:text-4xl text-center text-[#1c1b1b] mb-12">
            The Anticipation
          </h2>
          <div className="flex justify-center gap-6 md:gap-12">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#7c766e] flex items-center justify-center relative bg-[#fcf9f8] shadow-sm">
                <div className="absolute inset-2 border border-[#94492c]/50 rounded-full" />
                <span className="font-serif-caslon text-3xl md:text-4xl text-[#1c1b1b]">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
              </div>
              <span className="font-sans-work text-xs uppercase tracking-[0.2em] mt-4 font-semibold text-[#4b463f]">
                Days
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#7c766e] flex items-center justify-center relative bg-[#fcf9f8] shadow-sm">
                <div className="absolute inset-2 border border-[#94492c]/50 rounded-full" />
                <span className="font-serif-caslon text-3xl md:text-4xl text-[#1c1b1b]">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
              </div>
              <span className="font-sans-work text-xs uppercase tracking-[0.2em] mt-4 font-semibold text-[#4b463f]">
                Hours
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#7c766e] flex items-center justify-center relative bg-[#fcf9f8] shadow-sm">
                <div className="absolute inset-2 border border-[#94492c]/50 rounded-full" />
                <span className="font-serif-caslon text-3xl md:text-4xl text-[#1c1b1b]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
              </div>
              <span className="font-sans-work text-xs uppercase tracking-[0.2em] mt-4 font-semibold text-[#4b463f]">
                Mins
              </span>
            </div>
          </div>
        </section>

        {/* Highlight Banner (Terracotta Quote) */}
        <section className="py-16 border-b border-[#7c766e]/40 relative bg-[#94492c] text-white -mx-6 md:-mx-10 px-6 md:px-10 my-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif-caslon text-2xl md:text-4xl italic opacity-95 leading-relaxed">
              "Life is a curated collection of beautiful moments."
            </h2>
          </div>
        </section>

        {/* Celebration Itinerary (Timeline) */}
        <section className="py-16 border-b border-[#7c766e]/40" id="itinerary">
          <h2 className="font-serif-caslon text-3xl md:text-4xl text-[#1c1b1b] mb-12 text-center">
            The Celebration Itinerary
          </h2>
          <div className="max-w-3xl mx-auto relative border-l border-[#7c766e]/40 pl-8 ml-4 md:mx-auto">
            {itinerarySteps.map((step: any, idx: number) => (
              <div key={idx} className="mb-10 relative">
                <div
                  className={`absolute w-4 h-4 rounded-full border border-[#1c1b1b] ${
                    step.isHighlight ? "bg-[#94492c]" : "bg-[#f0eded]"
                  } -left-[41px] top-1`}
                />
                <span className="font-sans-work text-xs text-[#94492c] uppercase tracking-[0.2em] block mb-1 font-semibold">
                  {step.time}
                </span>
                <h3 className="font-serif-caslon text-2xl text-[#1c1b1b] mb-2 font-normal">
                  {step.title}
                </h3>
                <p className="font-mono-space text-sm text-[#4b463f] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Venue & Map (The Grand Estate) */}
        <section className="py-16 border-b border-[#7c766e]/40" id="venue">
          <h2 className="font-serif-caslon text-3xl md:text-4xl text-[#1c1b1b] mb-12 text-center md:text-left">
            The Grand Estate
          </h2>
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            {/* Interactive Clickable Map Card */}
            <a
              href={mainVenue.mapLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 w-full block group"
            >
              <div className="border border-[#7c766e] p-2 bg-[#fcf9f8]">
                <div className="w-full h-64 md:h-80 border border-[#7c766e]/40 bg-[#f4f4ee] flex flex-col items-center justify-center relative overflow-hidden p-6 text-center group-hover:bg-[#e5e2e1] transition-colors">
                  <div className="absolute inset-0 blueprint-grid opacity-30" />
                  <MapPin className="w-10 h-10 text-[#4b463f] mb-2 relative z-10 group-hover:text-[#94492c] group-hover:scale-110 transition-all" />
                  <span className="font-serif-caslon text-xl text-[#1c1b1b] font-bold relative z-10 block mb-1">
                    {mainVenue.name || "The Artisan Foundry"}
                  </span>
                  <span className="font-mono-space text-xs text-[#4b463f] relative z-10 block max-w-xs mb-3">
                    {mainVenue.address}
                  </span>
                  <span className="inline-flex items-center gap-1.5 border border-[#1c1b1b] px-3 py-1 font-sans-work text-xs uppercase tracking-[0.2em] font-semibold text-[#1c1b1b] group-hover:bg-[#94492c] group-hover:text-white group-hover:border-[#94492c] transition-all">
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </a>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <span className="font-sans-work text-xs uppercase tracking-[0.2em] text-[#94492c] font-semibold block mb-1">
                  OFFICIAL VENUE
                </span>
                <h3 className="font-serif-caslon text-3xl text-[#1c1b1b] mb-2 font-normal">
                  {mainVenue.name || "The Artisan Foundry"}
                </h3>
                <p className="font-mono-space text-sm text-[#4b463f] leading-relaxed">
                  {mainVenue.address}
                </p>
              </div>
              <p className="font-mono-space text-sm text-[#1c1b1b] leading-relaxed">
                An industrial-chic venue with exposed brick, terracotta accents, and ample natural light. Valet and guest parking provided upon arrival.
              </p>
              <div className="pt-2">
                <a
                  href={mainVenue.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-[#1c1b1b] px-6 py-3 font-sans-work text-xs uppercase tracking-[0.2em] font-semibold bg-[#fcf9f8] text-[#1c1b1b] hover:bg-[#94492c] hover:text-white hover:border-[#94492c] transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:shadow-none"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery (The Curated Archive) */}
        <section className="py-16 border-b border-[#7c766e]/40" id="gallery">
          <h2 className="font-serif-caslon text-3xl md:text-4xl text-[#1c1b1b] mb-12">
            The Curated Archive
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const margin = typeof item === "string" ? (i % 2 === 1 ? "mt-6 md:mt-10" : "") : item.margin || "";

              return (
                <div
                  key={i}
                  className={`sticker-peel border border-[#7c766e] bg-[#fcf9f8] p-2 h-60 md:h-64 cursor-pointer ${margin}`}
                >
                  <div className="w-full h-full border border-[#7c766e]/30 overflow-hidden bg-[#eae7e7] flex items-center justify-center">
                    <img
                      alt={`Archive photo #${i + 1}`}
                      className="w-full h-full object-cover filter mix-blend-multiply"
                      src={url}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RSVP Form */}
        <section className="max-w-3xl mx-auto bg-[#fcf9f8] p-8 md:p-12 border border-[#1c1b1b] shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] my-12" id="rsvp">
          <RsvpSection partnerOne={celebrantName} partnerTwo="" />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full px-10 py-8 flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto border-t-2 border-[#1c1b1b] bg-[#fcf9f8]">
        <div className="font-serif-caslon text-3xl text-[#1c1b1b] mb-4 md:mb-0">
          E
        </div>
        <div className="font-sans-work text-xs uppercase tracking-[0.2em] text-[#1c1b1b] text-center md:text-left mb-4 md:mb-0">
          © {new Date().getFullYear()} THE CURATED COLLECTIVE. DESIGNED IN BLUEPRINT.
        </div>
        <div className="flex space-x-6 font-sans-work text-xs uppercase tracking-widest text-[#4b463f]">
          <a href="#story" className="hover:text-[#94492c] transition-colors">
            Story
          </a>
          <a href="#chapters" className="hover:text-[#94492c] transition-colors">
            Chapters
          </a>
          <a href="#gallery" className="hover:text-[#94492c] transition-colors">
            Gallery
          </a>
        </div>
      </footer>
    </div>
  );
}
