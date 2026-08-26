"use client";

import { getWeddingTargetDate, formatAgeOrdinal } from "@/lib/dateUtils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, Wine, Utensils, Music, MapPin, Car, Shirt, ExternalLink } from "lucide-react";

export default function ZenJapandiCalmInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Celebrant name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const ageMilestone = formatAgeOrdinal(props.turningAge);
  const celebrationHeader = ageMilestone ? `${celebrantName.toUpperCase()}'S ${ageMilestone.toUpperCase()}` : `${celebrantName.toUpperCase()}'S BIRTHDAY`;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 14,
    minutes: 30,
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

      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(interval);
  }, [props.weddingDate, props.weddingTime]);

  // Gallery items matching exact Stitch screen a439264a19914fe392d707563594c943
  const galleryList =
    props.galleryImages && props.galleryImages.filter(img => Boolean(Boolean(img && String(img).trim()))).length > 0
      ? props.galleryImages
      : [
          {
            url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80",
            caption: "Celebration Cake",
            rotate: "rotate-1",
          },
          {
            url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
            caption: "Party Balloons",
            rotate: "rotate-[-2deg]",
          },
          {
            url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
            caption: "Evening Lights",
            rotate: "rotate-2",
          },
        ];

  const timelineSteps =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay
      : [
          {
            time: "6:00 PM",
            title: "Welcome Drinks",
            desc: "Arrive and unwind with a signature botanical cocktail or natural wine.",
            icon: Wine,
          },
          {
            time: "7:30 PM",
            title: "Artisanal Dinner",
            desc: "A curated menu of seasonal, locally sourced dishes shared family-style.",
            icon: Utensils,
          },
          {
            time: "9:00 PM",
            title: "Music & Mingling",
            desc: "Soft jazz, warm ambient lighting, and meaningful conversations.",
            icon: Music,
          },
        ];

  const mapQuery = encodeURIComponent(
    props.contactAddress ||
      props.venuePlace ||
      (props.locations && props.locations[0] && props.locations[0].address) ||
      "123 Calm Way, Tranquil Hills"
  );

  const mainVenue =
    props.locations && props.locations[0]
      ? {
          ...props.locations[0],
          name: props.locations[0].name || props.venuePlace || "The Serene Estate",
          address: props.locations[0].address || props.contactAddress || props.venuePlace || "123 Calm Way, Tranquil Hills",
          mapLink:
            props.locations[0].mapLink &&
            props.locations[0].mapLink !== "https://maps.google.com" &&
            props.locations[0].mapLink !== "https://maps.google.com/"
              ? props.locations[0].mapLink
              : `https://maps.google.com/?q=${mapQuery}`,
          image: props.locations[0].image || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
        }
      : {
          name: props.venuePlace || "The Serene Estate",
          address: props.contactAddress || props.venuePlace || "123 Calm Way, Tranquil Hills",
          mapLink: `https://maps.google.com/?q=${mapQuery}`,
          image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
        };

  const displayHeroImage =
    props.heroImage ||
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="bg-[#fcf9f4] text-[#1c1c19] font-sans antialiased overflow-x-hidden relative selection:bg-[#60291e]/20 selection:text-[#60291e] min-h-screen flex flex-col">
      {/* Material Symbols Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=Source+Sans+3:wght@400;600&display=swap"
        rel="stylesheet"
      />

      {/* Japandi CSS Engine & Animations */}
      <style>{`
        .sticker-peel {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .sticker-peel:hover {
          transform: scale(1.02) rotate(-2deg);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1), -5px -5px 15px rgba(255,255,255,0.8);
          border-bottom-right-radius: 20px;
        }

        .glass-card {
          background: rgba(240, 237, 233, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 6:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="zen-japandi-calm"
      />

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full bg-[#fcf9f4]/90 backdrop-blur-md border-b border-[#e5e2dd] transition-all duration-300">
        <div className="flex justify-between items-center w-full px-6 md:px-16 py-4 max-w-[1120px] mx-auto">
          <a
            className="font-serif text-2xl tracking-[0.1em] text-[#60291e] uppercase font-medium"
            href="#"
          >
            SERENE
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center text-xs font-semibold uppercase tracking-widest text-[#534340]">
            <a
              className="hover:text-[#60291e] transition-colors duration-300"
              href="#story"
            >
              Our Story
            </a>
            <a
              className="hover:text-[#60291e] transition-colors duration-300"
              href="#venue"
            >
              The Venue
            </a>
            <a
              className="hover:text-[#60291e] transition-colors duration-300"
              href="#schedule"
            >
              Schedule
            </a>
            <a
              className="hover:text-[#60291e] transition-colors duration-300"
              href="#gallery"
            >
              Gallery
            </a>
            <a
              className="hover:text-[#60291e] transition-colors duration-300"
              href="#rsvp"
            >
              RSVP
            </a>
          </div>

          <a
            className="hidden md:inline-flex items-center justify-center px-6 py-3 bg-[#60291e] text-white text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 hover:bg-[#7c3f33]"
            href="#rsvp"
          >
            Contact Us
          </a>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#60291e] p-2"
          >
            {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#fcf9f4] border-t border-[#e5e2dd] px-6 py-4 flex flex-col gap-3 text-center">
            <a
              href="#story"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#534340] font-semibold py-2 border-b border-[#f0ede9]"
            >
              Our Story
            </a>
            <a
              href="#venue"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#534340] font-semibold py-2 border-b border-[#f0ede9]"
            >
              The Venue
            </a>
            <a
              href="#schedule"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#534340] font-semibold py-2 border-b border-[#f0ede9]"
            >
              Schedule
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#534340] font-semibold py-2 border-b border-[#f0ede9]"
            >
              Gallery
            </a>
            <a
              href="#rsvp"
              onClick={() => setMobileNavOpen(false)}
              className="bg-[#60291e] text-white py-2.5 rounded font-semibold text-xs uppercase tracking-widest"
            >
              RSVP Now
            </a>
          </div>
        )}
      </nav>

      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[880px] flex items-center justify-center px-6 md:px-16 py-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt={`${celebrantName} Japandi Hero`}
              className="w-full h-full object-cover opacity-80"
              src={displayHeroImage}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#fcf9f4]/40 to-[#fcf9f4]"></div>
          </div>

          <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center gap-4 mt-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b5c4c]">
              Join me to celebrate
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-[#60291e] tracking-wider leading-tight">
              {celebrationHeader}
            </h1>
            <p className="text-base md:text-lg text-[#534340] max-w-lg mt-2 font-light">
              A gathering of warmth, simplicity, and shared moments.
            </p>
            <div className="mt-6">
              <a
                className="inline-flex items-center justify-center px-8 py-4 border border-[#60291e] text-[#60291e] text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 hover:bg-[#60291e] hover:text-white"
                href="#rsvp"
              >
                RSVP Now
              </a>
            </div>
          </div>
        </section>

        {/* Minimalist Countdown */}
        <section className="py-16 px-6 md:px-16 bg-[#f6f3ee] border-y border-[#e5e2dd]/60">
          <div className="max-w-[1120px] mx-auto flex flex-wrap justify-center gap-8 md:gap-16 text-center items-center">
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl md:text-4xl text-[#60291e]">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-xs text-[#6b5c4c] tracking-widest uppercase font-semibold mt-2">
                Days
              </span>
            </div>
            <div className="hidden md:block w-[1px] h-12 bg-[#d8c2bd]"></div>

            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl md:text-4xl text-[#60291e]">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-xs text-[#6b5c4c] tracking-widest uppercase font-semibold mt-2">
                Hours
              </span>
            </div>
            <div className="hidden md:block w-[1px] h-12 bg-[#d8c2bd]"></div>

            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl md:text-4xl text-[#60291e]">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-xs text-[#6b5c4c] tracking-widest uppercase font-semibold mt-2">
                Mins
              </span>
            </div>
          </div>
        </section>

        {/* About / Story */}
        <section className="py-24 md:py-[120px] px-6 md:px-16 max-w-[1120px] mx-auto" id="story">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative h-[480px] w-full rounded-lg overflow-hidden group shadow-sm">
              <img
                alt="Celebrant story portrait"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={
                  props.coupleImage ||
                  props.coverImage ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuArG5YFkRTyG0NbTRVMqnmH7qfHqXAFAyK9JzYzo8qCgb5rl-LsBpf_yfiu6j1B5B-pS3COjC9Zvf5xCmQWnOci5lJyAwvFF6deG8F2jdka4FfDAsO2XcwegK14vWOKrCgrOjviqY8ei882FdnnfnL0fcl7-gbrMahUOousxE2MhxV44VfugAIk0O2C2UoLNZQprgDmCkbJfVVcUt5ZQ1I4lAaOlbjmPoRR5NTrOeTVk0aIg86H_iIy"
                }
              />
              <div className="absolute inset-0 bg-[#60291e]/5 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>

            <div className="order-1 md:order-2 flex flex-col gap-6 md:pl-6">
              <h2 className="font-serif text-3xl md:text-4xl text-[#60291e]">
                A New Decade
              </h2>
              <p className="text-base text-[#534340] leading-relaxed">
                Thirty feels like a profound threshold—a time to shed the unnecessary and embrace what truly matters. This celebration is an invitation to slow down, connect deeply, and enjoy the simple beauty of good company in a tranquil setting.
              </p>
              <p className="text-base text-[#534340] leading-relaxed">
                We'll share curated bites, natural wines, and an atmosphere designed for unhurried conversation.
              </p>
            </div>
          </div>
        </section>

        {/* Event Timeline */}
        <section className="py-24 md:py-[120px] px-6 md:px-16 max-w-[1120px] mx-auto" id="schedule">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-[#60291e]">
              The Day's Flow
            </h2>
          </div>

          <div className="max-w-2xl mx-auto flex flex-col gap-8 relative before:absolute before:inset-0 before:ml-[28px] md:before:mx-auto md:before:left-0 md:before:right-0 before:h-full before:w-[1px] before:bg-[#d8c2bd] before:-z-10">
            {timelineSteps.map((step, idx) => {
              const isEven = idx % 2 === 1;
              const iconProp = (step as any).icon;
              const isComponent = typeof iconProp === "function" || typeof iconProp === "object";

              return (
                <div
                  key={idx}
                  className={`relative flex items-center justify-between md:justify-normal ${
                    isEven ? "md:flex-row-reverse" : ""
                  } group`}
                >
                  {/* Circle Icon Pin */}
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#fcf9f4] border border-[#d8c2bd] text-[#60291e] shrink-0 z-10 md:mx-auto shadow-sm group-hover:border-[#60291e] transition-colors">
                    {isComponent ? (
                      (() => {
                        const IconComp = iconProp;
                        return <IconComp className="w-5 h-5" />;
                      })()
                    ) : (
                      <span className="text-xl leading-none">
                        {typeof iconProp === "string" ? iconProp : "✨"}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div
                    className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-[#f6f3ee] p-6 rounded-lg border border-[#e5e2dd]/60 group-hover:border-[#60291e]/20 transition-colors ${
                      isEven ? "text-left md:text-left" : "text-left md:text-right"
                    }`}
                  >
                    <span className="text-xs font-semibold text-[#6b5c4c] tracking-widest uppercase block mb-1">
                      {step.time}
                    </span>
                    <h3 className="font-serif text-xl text-[#60291e] mb-2 font-medium">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#534340] leading-relaxed">
                      {"desc" in step
                        ? (step as any).desc
                        : "Enjoy the serene company."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Venue & Map */}
        <section
          className="py-24 md:py-[120px] px-6 md:px-16 bg-[#f6f3ee] border-y border-[#e5e2dd]/60"
          id="venue"
        >
          <div className="max-w-[1120px] mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="font-serif text-3xl md:text-4xl text-[#60291e]">
                The Setting
              </h2>
              <p className="text-base text-[#534340] leading-relaxed">
                We are gathering at a tranquil, secluded estate designed to blend indoors and outdoors harmoniously.
              </p>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#60291e] mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-[#60291e] uppercase tracking-widest">
                    Location
                  </h4>
                  <a
                    href={mainVenue.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#534340] mt-1 hover:text-[#60291e] transition-colors block group"
                  >
                    <span className="font-semibold block text-[#60291e] group-hover:underline">
                      {mainVenue.name || "The Serene Estate"}
                    </span>
                    <span className="text-[#534340] block">
                      {mainVenue.address || "123 Calm Way, Tranquil Hills"}
                    </span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Car className="w-5 h-5 text-[#60291e] mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-[#60291e] uppercase tracking-widest">
                    Details
                  </h4>
                  <p className="text-sm text-[#534340] mt-1">
                    Complimentary valet parking is available at the entrance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Shirt className="w-5 h-5 text-[#60291e] mt-1 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-[#60291e] uppercase tracking-widest">
                    Attire
                  </h4>
                  <p className="text-sm text-[#534340] mt-1">
                    Casual Elegance (neutral tones recommended)
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={mainVenue.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#60291e] text-[#fcf9f4] px-6 py-3 rounded text-xs uppercase tracking-widest font-semibold hover:bg-[#7a3426] transition-colors shadow-sm"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>

            {/* Map Area - Clickable */}
            <a
              href={mainVenue.mapLink}
              target="_blank"
              rel="noreferrer"
              className="group relative w-full h-[380px] bg-[#fcf9f4] rounded-xl border border-[#d8c2bd]/60 flex flex-col items-center justify-center overflow-hidden shadow-sm hover:shadow-md hover:border-[#60291e]/40 transition-all p-8 text-center"
            >
              <div
                className="absolute inset-0 opacity-40 pointer-events-none group-hover:opacity-60 transition-opacity"
                style={{
                  backgroundImage:
                    "radial-gradient(#d8c2bd 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="relative z-10 flex flex-col items-center text-[#6b5c4c] gap-3">
                <div className="w-14 h-14 rounded-full bg-[#f6f3ee] border border-[#d8c2bd] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <MapPin className="w-7 h-7 text-[#60291e]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-[#60291e]">
                    {mainVenue.name || "The Serene Estate"}
                  </h3>
                  <p className="text-xs text-[#534340] max-w-xs line-clamp-2">
                    {mainVenue.address || "123 Calm Way, Tranquil Hills"}
                  </p>
                </div>
                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#60291e] bg-[#f6f3ee] px-4 py-2 rounded-full border border-[#d8c2bd]/80 group-hover:bg-[#60291e] group-hover:text-white transition-colors duration-200">
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          </div>
        </section>

        {/* Highlight Banner */}
        <section className="py-24 px-6 text-center bg-[#60291e] text-white">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
            <span className="text-white/50 text-3xl italic">“</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light italic opacity-90 leading-tight">
              "In simplicity, we find beauty."
            </h2>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-24 md:py-[120px] px-6 md:px-16 max-w-[1120px] mx-auto" id="gallery">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-[#60291e]">
              Captured Moments
            </h2>
            <p className="text-sm text-[#534340] mt-2 max-w-lg mx-auto">
              Glimpses of the aesthetic and mood we hope to share.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const caption =
                typeof item === "string" ? `Moment #${i + 1}` : item.caption;
              const rotate =
                typeof item === "string"
                  ? i === 0
                    ? "rotate-1"
                    : i === 1
                    ? "-rotate-2"
                    : "rotate-2"
                  : item.rotate || "";

              return (
                <div
                  key={i}
                  className={`bg-[#fcf9f4] p-3 shadow-md rounded-sm transform ${rotate} sticker-peel`}
                >
                  <div className="aspect-square bg-[#f6f3ee] overflow-hidden rounded-xs">
                    <img
                      alt={caption}
                      className="w-full h-full object-cover"
                      src={url}
                    />
                  </div>
                  <p className="text-xs font-semibold text-center mt-3 text-[#6b5c4c]">
                    {caption}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* RSVP */}
        <section id="rsvp" className="py-24 bg-[#f6f3ee] border-t border-[#e5e2dd]/60">
          <RsvpSection partnerOne={celebrantName} partnerTwo="" />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f6f3ee] border-t border-[#e5e2dd]">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-16 py-8 max-w-[1120px] mx-auto gap-4 text-center md:text-left">
          <span className="font-serif text-lg text-[#1c1c19] uppercase tracking-widest">
            SERENE
          </span>
          <div className="flex gap-6 text-xs font-semibold text-[#6b5c4c]">
            <a href="#" className="hover:text-[#60291e] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#60291e] transition-colors">
              Contact
            </a>
          </div>
          <span className="text-xs text-[#6b5c4c]">
            © {new Date().getFullYear()} Serene Invitations. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
