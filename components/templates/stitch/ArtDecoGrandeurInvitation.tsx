"use client";

import { useState, useEffect } from "react";
import { getWeddingTargetDate } from "@/lib/dateUtils";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, PlayCircle, MapPin } from "lucide-react";

export default function ArtDecoGrandeurInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Celebrant Name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const brandName = "GRANDEUR";

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 18,
    minutes: 30,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = getWeddingTargetDate(
      props.weddingDate,
      props.weddingTime
    ).getTime();

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
  }, [props.weddingDate]);

  // Gallery items matching exact Stitch screen 70fda70b44084bce81ed9cc6adb4dec3
  const galleryList =
    props.galleryImages && props.galleryImages.length >= 3
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_JH44cFP46ThEWh6od0hSuOU9vdctmMvd58Y8c7Mvl-JL8gRP6m_BnaYteF6eHdYGMH1V-gf0VyuR33V-4oFOKrmYY2xK4Cr1qoes3zkq-vFTTX5e4SQDNyhAoDYpuwXDnuz8JmnlM6HTHqkGnq2IfjY0gOMMK6Fuc9a2zxzOaKGGaKzUL6J5hyNOjxx203TU50rf8fjXLtDg1snZ6XQNef1O1JS8wuuBQcjpO_iA-fd-eQ000rKA",
            numeral: "I",
            rotate: "rotate-[-2deg]",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_BZeacw_hip-3hinpK1xnBJjKXlRW4ipj9rG92kOuyDeKKbCMSoBZdMpc5mjF3I-HW6QmC-ckNEkwDZaFhWMpys_F5n1hAf2rtrRm7hZUItTTQNoGKxvOOz7RZdrPqG4In_8ILYO8cYK2k5hlKehNkMLjaL6Wy4qlQ36LGdRV4_r1ZJJrglBLYd1z5SqINVpbf6LgxoI51_l_0cXs6rVMC6I_zPJAWfWF1SYru7Ca0ySCjHL5R7gG",
            numeral: "II",
            rotate: "rotate-[3deg] translate-y-6",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6E1WoKLtT8MMieGenO-MGCkF-utFe4EIv9ODuhzsO8GKAETRhW0Z-lVbKr23UO3ZBQQDiZPihHTQaWk6HBYNFC2d1-XEu1JOAtD213iHKpv5YVNZRM5-S2YWd0od2UAPTKBQ0uVu6wqdyc7zA4qRffQ1L7Crl9_lc9IGe7gyqvRPSLPQwrUzDgK2LAJZOsgEShUKLQkXjBsIDPKASdUUlP1HHyV9iHKRFtuFaL7MR_JH_i25cW898",
            numeral: "III",
            rotate: "rotate-[-1deg]",
          },
        ];

  // Schedule items
  const scheduleSteps =
    props.events && props.events.length > 0
      ? props.events
      : [
          {
            numeral: "VII",
            period: "Evening",
            title: "Cocktails & Canapés",
            desc: "Arrival and signature libations in the grand foyer.",
          },
          {
            numeral: "VIII",
            period: "Evening",
            title: "The Grand Feast",
            desc: "A curated five-course culinary journey.",
          },
          {
            numeral: "IX",
            period: "Evening",
            title: "Jazz & Dancing",
            desc: "Revel in the syncopated rhythms of the house band.",
          },
        ];

  return (
    <div className="bg-[#131407] text-[#e4e4cc] font-sans antialiased overflow-x-hidden relative min-h-screen pt-20">
      {/* Art Deco Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Playfair+Display:wght@700;900&family=Poiret+One&display=swap"
        rel="stylesheet"
      />

      {/* Art Deco CSS Engine */}
      <style>{`
        /* Global Viewport Frame */
        .global-frame {
          position: fixed;
          top: 12px;
          left: 12px;
          right: 12px;
          bottom: 12px;
          border: 2px solid;
          border-image: linear-gradient(to bottom, #f2ca50, #b89327) 1;
          pointer-events: none;
          z-index: 9999;
        }

        /* Art Deco Double Border Frame */
        .deco-frame {
          border: 2px solid #f2ca50;
          padding: 4px;
          position: relative;
        }
        .deco-frame::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          border: 1px solid #e9c349;
          pointer-events: none;
        }

        /* Sunburst Background Pattern */
        .sunburst-bg {
          background-image: repeating-linear-gradient(
            45deg,
            rgba(242, 202, 80, 0.05),
            rgba(242, 202, 80, 0.05) 10px,
            transparent 10px,
            transparent 20px
          );
        }

        /* Geometric Divider */
        .deco-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2.5rem 0;
        }
        .deco-divider::before, .deco-divider::after {
          content: '';
          flex-grow: 1;
          height: 1px;
          background-color: #f2ca50;
        }
        .deco-divider .diamond {
          width: 12px;
          height: 12px;
          border: 1px solid #f2ca50;
          transform: rotate(45deg);
          margin: 0 1rem;
        }

        /* Glassmorphism Panel */
        .glass-panel {
          background: rgba(19, 20, 7, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(242, 202, 80, 0.35);
        }

        /* Gold Leaf Texture */
        .gold-leaf-bg {
          background-color: #f2ca50;
          background-image: url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.15"/%3E%3C/svg%3E');
        }

        .sticker-peel {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .sticker-peel:hover {
          transform: scale(1.04) rotate(-1deg) translate(-4px, -4px);
          box-shadow: 15px 15px 20px rgba(0,0,0,0.5);
        }

        .font-serif-deco {
          font-family: 'Playfair Display', serif;
        }
        .font-accent-deco {
          font-family: 'Poiret One', cursive, sans-serif;
        }
      `}</style>

      {/* Global Viewport Frame */}
      <div className="global-frame" />

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday, 14th October 2026 at 7:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="art-deco-grandeur"
      />

      {/* Top Header Nav */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-20 py-5 bg-[#131407]/90 backdrop-blur-md border-b-2 border-double border-[#f2ca50]">
        <div className="font-serif-deco text-2xl md:text-3xl text-[#f2ca50] tracking-widest font-extrabold">
          {brandName}
        </div>
        <ul className="hidden md:flex gap-8 font-accent-deco text-sm uppercase text-[#d0c5af] tracking-[0.2em]">
          <li className="hover:text-[#f2ca50] transition-colors cursor-pointer">
            <a href="#estate">The Estate</a>
          </li>
          <li className="hover:text-[#f2ca50] transition-colors cursor-pointer">
            <a href="#itinerary">Itinerary</a>
          </li>
          <li className="hover:text-[#f2ca50] transition-colors cursor-pointer">
            <a href="#gallery">Gallery</a>
          </li>
          <li className="hover:text-[#f2ca50] transition-colors cursor-pointer">
            <a href="#rsvp">RSVP</a>
          </li>
        </ul>
        <a
          className="deco-frame bg-[#f2ca50] text-[#3c2f00] font-accent-deco text-xs uppercase px-6 py-2 tracking-[0.2em] font-bold hover:opacity-90 transition-opacity"
          href="#rsvp"
        >
          RSVP
        </a>
      </nav>

      {/* Main Canvas Container */}
      <main className="max-w-[1200px] mx-auto px-6 md:px-16 pb-20">
        {/* Hero Section */}
        <section className="relative min-h-[750px] flex flex-col items-center justify-center text-center mb-28 pt-8">
          <div className="sunburst-bg absolute inset-0 -z-10 opacity-30" />
          <div className="glass-panel p-8 md:p-20 w-full max-w-4xl relative shadow-2xl">
            {/* Inner Deco Frame */}
            <div className="absolute inset-4 border border-[#f2ca50] opacity-50 pointer-events-none" />
            <div className="absolute inset-6 border border-[#f2ca50] pointer-events-none" />

            <h1 className="font-serif-deco text-5xl md:text-7xl text-[#f2ca50] mb-6 font-extrabold tracking-tight">
              {celebrantName}'s Soirée
            </h1>
            <p className="font-accent-deco text-lg md:text-2xl text-[#d0c5af] mb-12 uppercase tracking-[0.3em]">
              A Night of Unparalleled Opulence
            </p>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <div className="text-center">
                <span className="block font-serif-deco text-3xl md:text-4xl text-[#f2ca50] font-bold">
                  XIV
                </span>
                <span className="font-accent-deco text-xs text-[#d0c5af] uppercase tracking-[0.2em]">
                  October
                </span>
              </div>
              <div className="hidden md:block h-12 w-px bg-[#f2ca50]" />
              <div className="text-center">
                <span className="block font-serif-deco text-3xl md:text-4xl text-[#f2ca50] font-bold">
                  VII
                </span>
                <span className="font-accent-deco text-xs text-[#d0c5af] uppercase tracking-[0.2em]">
                  Evening
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Event Commencement Countdown */}
        <section className="mb-28 flex justify-center">
          <div className="glass-panel p-8 md:p-12 text-center max-w-3xl w-full border border-[#f2ca50] relative shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#131407] px-4 border border-[#f2ca50]/50">
              <span className="font-accent-deco text-xs text-[#f2ca50] uppercase tracking-[0.3em] font-bold">
                Event Commencement
              </span>
            </div>
            <div className="flex justify-center gap-8 md:gap-16 pt-2">
              <div className="flex flex-col items-center">
                <span className="font-serif-deco text-4xl md:text-6xl text-[#f2ca50] mb-2 font-black">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="font-accent-deco text-xs md:text-sm text-[#d0c5af] uppercase tracking-[0.2em]">
                  Days
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-serif-deco text-4xl md:text-6xl text-[#f2ca50] mb-2 font-black">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="font-accent-deco text-xs md:text-sm text-[#d0c5af] uppercase tracking-[0.2em]">
                  Hours
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-serif-deco text-4xl md:text-6xl text-[#f2ca50] mb-2 font-black">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="font-accent-deco text-xs md:text-sm text-[#d0c5af] uppercase tracking-[0.2em]">
                  Mins
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="deco-divider">
          <div className="diamond" />
        </div>

        {/* The Golden Era (Story) */}
        <section className="mb-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            <div className="col-span-1 md:col-span-6 deco-frame p-8 md:p-10 flex flex-col justify-center bg-[#2a2b1b] h-full">
              <h2 className="font-serif-deco text-3xl md:text-4xl text-[#f2ca50] mb-6 font-bold">
                The Golden Era
              </h2>
              <p className="font-sans text-sm md:text-base text-[#e4e4cc] leading-relaxed">
                Join us in celebrating {celebrantName}'s grand milestone. Expect an evening steeped in the glamour of a bygone era, where every detail is meticulously curated to reflect her impeccable taste. Prepare for a night of jazz, champagne, and geometric perfection. Let the opulence of the roaring twenties wash over you in a symphony of gold and shadow.
              </p>
            </div>
            <div className="col-span-1 md:col-span-6 min-h-[350px] deco-frame p-2 relative bg-[#0e0f03] flex items-center justify-center">
              <div className="absolute inset-0 border border-[#f2ca50] m-4 opacity-30 pointer-events-none" />
              <div className="flex flex-col items-center justify-center text-[#d0c5af] cursor-pointer hover:scale-105 transition-transform">
                <PlayCircle className="w-16 h-16 text-[#f2ca50] mb-4 opacity-90" />
                <span className="font-accent-deco text-xs md:text-sm uppercase tracking-[0.3em]">
                  A Glimpse of Grandeur
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* The Soirée Schedule (Timeline) */}
        <section className="mb-28 relative" id="itinerary">
          <div className="sunburst-bg absolute inset-0 -z-10 opacity-20" />
          <div className="text-center mb-16">
            <h2 className="font-serif-deco text-3xl md:text-5xl text-[#f2ca50] mb-4 font-bold">
              The Soirée Schedule
            </h2>
            <div className="w-24 h-px bg-[#f2ca50] mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#f2ca50] hidden md:block" />

            <div className="space-y-12 md:space-y-16">
              {scheduleSteps.map((step: any, idx: number) => {
                const isEven = idx % 2 === 1;

                return (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row items-center justify-between group"
                  >
                    {!isEven ? (
                      <>
                        <div className="md:w-5/12 text-center md:text-right mb-4 md:mb-0 pr-0 md:pr-8">
                          <span className="font-serif-deco text-3xl md:text-4xl text-[#f2ca50] block font-bold">
                            {step.numeral}
                          </span>
                          <span className="font-accent-deco text-xs text-[#d0c5af] uppercase tracking-[0.2em]">
                            {step.period}
                          </span>
                        </div>
                        <div className="w-8 h-8 border-2 border-[#f2ca50] bg-[#131407] transform rotate-45 z-10 flex items-center justify-center mb-4 md:mb-0 group-hover:bg-[#f2ca50] transition-colors">
                          <div className="w-2 h-2 bg-[#f2ca50] group-hover:bg-[#131407] transition-colors" />
                        </div>
                        <div className="md:w-5/12 text-center md:text-left pl-0 md:pl-8 bg-[#1f2111] p-6 border border-[#f2ca50]/30 relative w-full">
                          <h3 className="font-accent-deco text-lg md:text-xl text-[#f2ca50] uppercase mb-2 font-bold tracking-[0.1em]">
                            {step.title}
                          </h3>
                          <p className="font-sans text-xs md:text-sm text-[#d0c5af]">
                            {step.desc}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="md:w-5/12 text-center md:text-right mb-4 md:mb-0 pr-0 md:pr-8 bg-[#1f2111] p-6 border border-[#f2ca50]/30 relative order-3 md:order-1 w-full">
                          <h3 className="font-accent-deco text-lg md:text-xl text-[#f2ca50] uppercase mb-2 font-bold tracking-[0.1em]">
                            {step.title}
                          </h3>
                          <p className="font-sans text-xs md:text-sm text-[#d0c5af]">
                            {step.desc}
                          </p>
                        </div>
                        <div className="w-8 h-8 border-2 border-[#f2ca50] bg-[#131407] transform rotate-45 z-10 flex items-center justify-center mb-4 md:mb-0 order-2 group-hover:bg-[#f2ca50] transition-colors">
                          <div className="w-2 h-2 bg-[#f2ca50] group-hover:bg-[#131407] transition-colors" />
                        </div>
                        <div className="md:w-5/12 text-center md:text-left pl-0 md:pl-8 order-1 md:order-3 mb-4 md:mb-0">
                          <span className="font-serif-deco text-3xl md:text-4xl text-[#f2ca50] block font-bold">
                            {step.numeral}
                          </span>
                          <span className="font-accent-deco text-xs text-[#d0c5af] uppercase tracking-[0.2em]">
                            {step.period}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* The Estate Grounds */}
        <section className="mb-28" id="estate">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#1f2111] p-8 deco-frame">
            <div className="order-2 md:order-1 h-[350px] border border-[#f2ca50] p-2 relative bg-[#0e0f03] flex items-center justify-center">
              <MapPin className="w-16 h-16 text-[#f2ca50]/50 mb-2" />
              <span className="font-accent-deco text-xs text-[#f2ca50]/50 uppercase absolute bottom-4 tracking-[0.2em]">
                Map Integration
              </span>
            </div>
            <div className="order-1 md:order-2 flex flex-col justify-center text-center p-6">
              <h2 className="font-serif-deco text-3xl md:text-4xl text-[#f2ca50] mb-6 font-bold">
                The Estate Grounds
              </h2>
              <div className="w-12 h-px bg-[#f2ca50] mx-auto mb-6" />
              <p className="font-accent-deco text-xl text-white mb-2 tracking-[0.1em]">
                The Gatsby Mansion
              </p>
              <p className="font-sans text-sm text-[#d0c5af] mb-1">
                1924 West Egg Boulevard
              </p>
              <p className="font-sans text-sm text-[#d0c5af] mb-8">
                Long Island, New York
              </p>
              <p className="font-sans text-xs text-[#d0c5af] italic mb-8">
                Valet parking will be provided upon arrival at the main gates.
              </p>
              <button className="bg-transparent border border-[#f2ca50] text-[#f2ca50] font-accent-deco text-xs px-8 py-3 uppercase tracking-[0.2em] hover:bg-[#f2ca50] hover:text-[#3c2f00] transition-colors self-center font-bold">
                Get Directions
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Highlight Banner (Gold Leaf Quote) */}
      <section className="w-full gold-leaf-bg py-20 px-6 md:px-16 mb-28 relative flex justify-center items-center text-center border-y-4 border-double border-[#131407]">
        <div className="absolute inset-0 bg-black/60 mix-blend-overlay" />
        <div className="relative z-10 max-w-4xl border border-[#f2ca50]/40 p-8 md:p-12 bg-black/50 backdrop-blur-sm">
          <p className="font-serif-deco text-2xl md:text-4xl text-[#f2ca50] leading-relaxed italic">
            "A night where every detail is a masterpiece, and every moment a memory in gold."
          </p>
        </div>
      </section>

      {/* Second Section Canvas */}
      <main className="max-w-[1200px] mx-auto px-6 md:px-16 pb-20">
        {/* The Portrait Gallery */}
        <section className="mb-28" id="gallery">
          <div className="text-center mb-16">
            <h2 className="font-serif-deco text-3xl md:text-5xl text-[#f2ca50] mb-4 font-bold">
              The Portrait Gallery
            </h2>
            <div className="w-24 h-px bg-[#f2ca50] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 p-4">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const numeral =
                typeof item === "string"
                  ? i === 0
                    ? "I"
                    : i === 1
                    ? "II"
                    : "III"
                  : item.numeral || "I";

              const rotate =
                typeof item === "string"
                  ? i === 0
                    ? "rotate-[-2deg]"
                    : i === 1
                    ? "rotate-[3deg] translate-y-6"
                    : "rotate-[-1deg]"
                  : item.rotate || "";

              return (
                <div
                  key={i}
                  className={`aspect-[3/4] bg-[#343625] p-4 border border-[#f2ca50] shadow-xl ${rotate} sticker-peel relative`}
                >
                  <div className="w-full h-full bg-[#0e0f03] border border-[#f2ca50]/30 flex items-center justify-center overflow-hidden">
                    <img
                      alt={`Art Deco Gallery #${numeral}`}
                      className="w-full h-full object-cover filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                      src={url}
                    />
                  </div>
                  <div className="absolute -bottom-4 right-4 bg-[#131407] px-3 py-1 border border-[#f2ca50] z-20">
                    <span className="font-accent-deco text-[10px] text-[#f2ca50] font-bold">
                      {numeral}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RSVP Form */}
        <section className="max-w-3xl mx-auto bg-[#343625] p-8 md:p-12 deco-frame mb-12 relative overflow-hidden" id="rsvp">
          <div className="sunburst-bg absolute inset-0 -z-10 opacity-10" />
          <RsvpSection partnerOne={celebrantName} partnerTwo="" />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 md:px-16 flex flex-col items-center gap-4 bg-[#0e0f03] border-t-4 border-double border-[#f2ca50]/50 z-40 relative">
        <div className="font-serif-deco text-2xl text-[#f2ca50] font-bold tracking-widest">
          {brandName}
        </div>
        <div className="flex gap-6 text-xs font-accent-deco text-[#d0c5af] tracking-[0.2em]">
          <a href="#estate" className="hover:text-[#f2ca50] transition-colors">
            The Estate
          </a>
          <a href="#itinerary" className="hover:text-[#f2ca50] transition-colors">
            Itinerary
          </a>
          <a href="#gallery" className="hover:text-[#f2ca50] transition-colors">
            Gallery
          </a>
        </div>
        <div className="font-accent-deco text-xs text-[#f2ca50] tracking-[0.2em]">
          © MCMXXIV GRANDEUR ESTATE. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}
