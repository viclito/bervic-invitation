"use client";

import { getWeddingTargetDate, formatAgeOrdinal } from "@/lib/dateUtils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Rocket, Satellite, Radar, Cake, Gamepad2, Navigation, Sparkles, Radio } from "lucide-react";

export default function SpaceGalaxyAdventureInvitation(
  props: TemplateClassicFloralProps
) {
  // Celebrant Name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const brandName = `${celebrantName.toUpperCase()}'S GALAXY`;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
    seconds: 30,
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

  // Gallery items matching exact Stitch screen 71edf06d2f8d40b9a37aeed543f5efc3
  const galleryList =
    props.galleryImages && props.galleryImages.filter(img => Boolean(Boolean(img && String(img).trim()))).length > 0
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD26RzMNw98_I6dJCR-GzELYeg2VupxVmrw2aVGIpwXvtAbHsIeUWo0XI9e_7_NL4wbptfmuPPzZ51gMm7PufWteR_dg5ODYpQ7uHjNE0TNFRVRadz_5Py4hIJ8l7Nz1Oebx9cAo0QpvyqVko4dBMh1Ev4AMQPMQMa1OqlZl2LF8jsXv2l4l_vVlztLJFAixJaMlmTkuFb2vIhapQHcfCcAcmlY-thMu4Y6pk6WNUzzmGtQZXsIjWRM",
            rotate: "-rotate-2",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuATb68zas_DcqvanAtszGWs6S-et4FbOWa9ihxA57kUgezb8s5Sb5VbH1GunwY0RP2ITh14DQVpAjWqgIDkfllPd2Cu650mMOOOxs0b_dVECzLrzzBdKqhFX4FtqcIIu4S4AlJxj_-Yhrwu2IZmu0zybfUo18rtWzWqaN36PJVh7rg6yk_iZg7FkJa5ysYYJOVC7kvWRh5t1zp3gnqR5Am-plL0PUL_3tQguMfpPL0ttKRFwSKwTv2o",
            rotate: "rotate-3 md:translate-y-8",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAa3yrjA-9MbAPF4GZtZtmVHkyyJ0Ug7IsQpwiyK5D6LMpgnZQfWmgnh8CI89JV-D9Qvv24IceGZIrjV34TSWnz4fJrxtOt5jZGFochWgwwtMs_HTvfWK1KNQ7iv3h04JRYQi5U6crl2gC21bJmZWzABlJqH6dzfihgOARUNgNVBgI24Buva3DK_sVV3r-ddRblrHaADrf6CYytz7-_JSXjahduWNGATXWvlyofdUQS-hVR7UqTanpW",
            rotate: "-rotate-1",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0WW1Qag9XNEKdyXcwr8y-1S6TUogH6BCRR3HdrhIlJtu7BVwiI4UA0g3N6lLVIaNg3jlk_MfndAgcry_zN0O1lgmVRXMLPbjrXkCtcaZwkEY3J5Ejd8yKcjOw1v21ykmyI297D0D1YRyi56c0uAX_tWn768rbT3VMUu7A3yj99REO_d5p4uux11iELYnxfPHRLHHX_M8UYznAU6_h1yisSwVlUtsMHWvkN6lNmaUUpU9l2IYar1eW",
            rotate: "rotate-2 md:translate-y-8",
          },
        ];

  // Cosmic timeline steps
  const timelineSteps =
    props.events && props.events.length > 0
      ? props.events
      : [
          {
            time: "10:00 AM",
            title: "Lift Off & Boarding",
            desc: "All cadets report to the main hanger for briefing and spacesuit fitting.",
            icon: Rocket,
            iconColor: "text-[#3cd7ff]",
            borderColor: "border-[#3cd7ff]",
          },
          {
            time: "12:30 PM",
            title: "Zero-G Cake Cutting",
            desc: `Celebrating Commander ${celebrantName}'s 10th successful orbit around the sun.`,
            icon: Cake,
            iconColor: "text-[#d2bbff]",
            borderColor: "border-[#d2bbff]",
          },
          {
            time: "02:00 PM",
            title: "Asteroid Field Games",
            desc: "Test your piloting skills in the obstacle course and win cosmic prizes.",
            icon: Gamepad2,
            iconColor: "text-[#3cd7ff]",
            borderColor: "border-[#3cd7ff]",
          },
        ];

  // Venue location matching exact Stitch screen 71edf06d2f8d40b9a37aeed543f5efc3
  const mapQuery = encodeURIComponent(
    props.contactAddress ||
      props.venuePlace ||
      (props.locations && props.locations[0] && props.locations[0].address) ||
      "St. Antony Church Hall, Kaval Kinaru"
  );
  const mainVenue =
    props.locations && props.locations[0]
      ? {
          ...props.locations[0],
          name: props.locations[0].name || props.venuePlace || "St. Antony Church Hall",
          address: props.locations[0].address || props.contactAddress || props.venuePlace || "Kaval Kinaru, Tirunelveli District, Tamil Nadu, Earth",
          mapLink:
            props.locations[0].mapLink &&
            props.locations[0].mapLink !== "https://maps.google.com" &&
            props.locations[0].mapLink !== "https://maps.google.com/"
              ? props.locations[0].mapLink
              : `https://maps.google.com/?q=${mapQuery}`,
        }
      : {
          name: props.venuePlace || "St. Antony Church Hall",
          address: props.contactAddress || props.venuePlace || "Kaval Kinaru, Tirunelveli District, Tamil Nadu, Earth",
          mapLink: `https://maps.google.com/?q=${mapQuery}`,
        };

  // Celebrant portrait priority: user's celebrant portrait or cover photo
  const celebrantPortrait =
    props.coupleImage ||
    props.coverImage ||
    (props.heroImage && !props.heroImage.includes("wedding") ? props.heroImage : undefined) ||
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] font-sans antialiased overflow-x-hidden relative selection:bg-[#7c3aed]/30 selection:text-[#d2bbff] min-h-screen">
      {/* Space & Technical Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Galaxy CSS Engine */}
      <style>{`
        .glass-panel {
          background-color: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(124, 58, 237, 0.3);
          box-shadow: 0 0 15px rgba(124, 58, 237, 0.1);
        }

        .neon-glow {
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
        }

        .orbit-ring {
          border: 1px solid rgba(60, 215, 255, 0.3);
          border-radius: 50%;
          animation: spinOrbit 20s linear infinite;
        }

        @keyframes spinOrbit {
          100% { transform: rotate(360deg); }
        }

        .star-field {
          background-image: 
            radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 130px 80px, #ffffff, rgba(0,0,0,0));
          background-size: 200px 200px;
        }

        .draw-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 3s ease forwards infinite alternate;
        }

        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }

        .sticker-peel {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .sticker-peel:hover {
          transform: scale(1.05) rotate(2deg);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), -10px 10px 15px rgba(255, 255, 255, 0.1) inset;
          border-color: rgba(124, 58, 237, 0.8);
        }

        .timeline-line::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
          background: linear-gradient(to bottom, transparent, #3cd7ff, #d2bbff, transparent);
          transform: translateX(-50%);
          box-shadow: 0 0 10px #7c3aed;
        }
      `}</style>

      {/* Star Field Ambient Background */}
      <div className="fixed inset-0 pointer-events-none star-field z-0"></div>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday, 15th October 2026 at 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="space-galaxy-adventure"
      />

      {/* Main Content Canvas */}
      <main className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-12 space-y-24 relative z-10">
        {/* Hero Section */}
        <section className="relative w-full rounded-xl overflow-hidden glass-panel h-[716px] flex flex-col justify-center items-center text-center p-8">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuALT96qJSyicbEl7cNwi8mbXovX7pw_o2elt8Ux8-6dbqaYdRCd69TLH8Ae3RnlsCAI_RpdI1L2UV5Xom0lNNT_71Sk_a5HXPOxUZM54Q41_7uSKlKs19PiQlPU84j-CJyBEWalqdbD76kYeHp-Lb51JzdstRhDOLJCtf8EAQJREYlEUWz_hHSjjzHTyuBJezgWqJThxXOk_H636gkQkLNeJboqOScjJhkHS2OHbmMC1FkA4BeuqKs8')",
            }}
          />
          <div className="relative z-10 space-y-6 max-w-2xl">
            <span className="font-mono text-xs text-[#3cd7ff] uppercase tracking-[0.2em] font-bold">
              Initiating Launch Sequence
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-[#d2bbff] font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(124,58,237,0.8)]">
              {celebrantName}'s Space & Galaxy Adventure
            </h1>
            <p className="text-base md:text-lg text-[#ccc3d8]">
              Join us for a cosmic celebration across the stars.
            </p>
            <a
              href="#rsvp"
              className="mt-8 bg-gradient-to-r from-[#7c3aed] to-[#00d2fd] text-white px-8 py-4 rounded-full font-mono text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all inline-flex items-center justify-center gap-2 mx-auto"
            >
              <Rocket className="w-4 h-4 fill-current" />
              RSVP NOW
            </a>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="relative flex flex-col items-center py-16">
          <h2 className="font-serif text-2xl md:text-4xl text-[#d2bbff] mb-12 font-bold">
            T-Minus to Launch
          </h2>
          <div className="relative w-64 h-64 flex justify-center items-center">
            <div className="absolute inset-0 orbit-ring"></div>
            <div
              className="absolute inset-4 orbit-ring"
              style={{ animationDirection: "reverse", animationDuration: "25s" }}
            ></div>
            <div className="glass-panel w-48 h-48 rounded-full flex flex-col justify-center items-center neon-glow">
              <span className="font-serif text-5xl md:text-6xl text-[#3cd7ff] font-bold">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs text-[#ccc3d8] tracking-widest uppercase mt-1">
                Days
              </span>
            </div>
            <Satellite className="absolute top-0 right-6 w-6 h-6 text-[#3cd7ff] animate-pulse" />
          </div>
        </section>

        {/* Mission Log (About Me) Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="glass-panel p-8 rounded-xl border-t border-l border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d2bbff] to-transparent opacity-50"></div>
            <h2 className="font-serif text-2xl md:text-3xl text-[#d2bbff] mb-4 font-bold">
              Commander {celebrantName}'s Mission Log
            </h2>
            <p className="text-base text-[#ccc3d8] mb-4 leading-relaxed font-sans">
              {props.loveStoryText ||
                `Preparing for another stellar solar rotation! Commander ${celebrantName} has been exploring the outer rim, charting new horizons and bringing boundless joy to the galaxy.`}
            </p>
            <p className="text-base text-[#ccc3d8] mb-6 leading-relaxed font-sans">
              Now, she is calling all cadets to join her back at home base for a celebration of galactic proportions. Bring your space suits and your sense of wonder as we embark on a journey through the stars!
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-1 rounded-full bg-[#2d3449] text-[#3cd7ff] font-mono text-xs border border-[#3cd7ff]/20 shadow-[0_0_10px_rgba(60,215,255,0.1)] font-semibold">
                Explorer Class
              </span>
              <span className="px-4 py-1 rounded-full bg-[#2d3449] text-[#d2bbff] font-mono text-xs border border-[#d2bbff]/20 shadow-[0_0_10px_rgba(210,187,255,0.1)] font-semibold">
                Commander Orbit Active
              </span>
            </div>
          </div>

          <div className="h-96 rounded-xl overflow-hidden glass-panel flex items-center justify-center p-2 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7c3aed]/20 to-[#3cd7ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            <img
              alt={`Commander ${celebrantName} Mission Visual`}
              className="w-full h-full rounded-lg object-cover z-0 group-hover:scale-105 transition-transform duration-700"
              src={celebrantPortrait}
            />
            {/* HUD Elements */}
            <div className="absolute top-4 left-4 z-20 text-[#3cd7ff] font-mono text-[10px] bg-[#0b1326]/80 px-2 py-1 rounded border border-[#3cd7ff]/30 backdrop-blur-sm">
              SCAN: ACTIVE // CADET: {celebrantName.toUpperCase()}<br />
              COORDINATES: MISSION_LOG_01
            </div>
            <div className="absolute bottom-4 right-4 z-20 bg-[#0b1326]/80 p-1.5 rounded-full border border-[#d2bbff]/30">
              <Radar className="w-6 h-6 text-[#d2bbff] animate-pulse" />
            </div>
          </div>
        </section>

        {/* Star Chart (Timeline) Section */}
        <section className="py-16 relative">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-[#d2bbff] mb-4 font-bold">
              Mission Itinerary
            </h2>
            <p className="text-base text-[#ccc3d8]">
              The coordinates for our cosmic journey.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto timeline-line py-8">
            {timelineSteps.map((step: any, idx: number) => {
              const isEven = idx % 2 === 1;
              const IconComp = step.icon || Rocket;
              const iconColor = step.iconColor || "text-[#3cd7ff]";
              const borderColor = step.borderColor || "border-[#3cd7ff]";

              return (
                <div
                  key={idx}
                  className={`relative flex items-center justify-between w-full mb-16 last:mb-0 group ${
                    isEven ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-5/12 ${
                      isEven ? "text-left pl-8" : "text-right pr-8"
                    }`}
                  >
                    <div
                      className={`glass-panel p-6 rounded-xl inline-block transform transition-transform ${
                        isEven
                          ? "group-hover:translate-x-2"
                          : "group-hover:-translate-x-2"
                      }`}
                    >
                      <span className="font-mono text-xs text-[#3cd7ff] block mb-2 font-bold">
                        {step.time}
                      </span>
                      <h3 className="font-serif text-xl text-[#d2bbff] mb-2 font-medium">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[#ccc3d8] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <div className="w-2/12 flex justify-center z-10">
                    <div
                      className={`w-12 h-12 rounded-full bg-[#222a3d] border-2 ${borderColor} flex items-center justify-center neon-glow`}
                    >
                      {typeof IconComp === "string" ? (
                        <span className="text-xl">{IconComp}</span>
                      ) : typeof IconComp === "function" || typeof IconComp === "object" ? (
                        <IconComp className={`w-5 h-5 ${iconColor}`} />
                      ) : (
                        <Rocket className={`w-5 h-5 ${iconColor}`} />
                      )}
                    </div>
                  </div>

                  <div className="w-5/12"></div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Nebula Quote (Highlight Banner) */}
        <section className="w-full relative h-[280px] rounded-xl overflow-hidden glass-panel flex items-center justify-center my-16">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYd_dsQAMErj7qx9MyiPuV-qdQaYsEc0K44fgy3SzyieX1Jy2cpxciXdEkjt8NOY51WrLPTGVJ4AP1I74Yz05WsUOrBZrDVYiCgHFNgk2IXUvCwG2Ob3jrRBgKvXvIty9Bx0MVSoYmPQJO-p_v0l4DqatXUOkGsf7WEpqY4YCf6s-AW_A2GRE8WgJUno-SBNNJIsn4K3voS5I0BJzr6dwaLwGh7KutL9pBJR_BKr69_vbKfd2nFRlR')",
            }}
          />
          <svg className="absolute inset-0 w-full h-full">
            <path
              className="draw-line"
              d="M 0 140 Q 500 40 1000 140 T 2000 140"
              fill="transparent"
              stroke="rgba(124, 58, 237, 0.5)"
              strokeWidth="2"
            ></path>
            <path
              className="draw-line"
              d="M 0 140 Q 500 240 1000 140 T 2000 140"
              fill="transparent"
              stroke="rgba(60, 215, 255, 0.5)"
              strokeWidth="2"
              style={{ animationDelay: "1s" }}
            ></path>
          </svg>
          <div className="relative z-10 text-center px-6">
            <h2 className="font-serif text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#d2bbff] to-[#3cd7ff] italic drop-shadow-lg font-bold">
              "Across the stars and back again"
            </h2>
            <p className="mt-4 font-mono text-xs text-[#ccc3d8] tracking-widest uppercase font-bold">
              The universe awaits
            </p>
          </div>
        </section>

        {/* Cosmic Gallery */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-[#d2bbff] mb-4 font-bold">
              Commander's Log Visuals
            </h2>
            <p className="text-base text-[#ccc3d8]">
              Glimpses from past solar rotations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const rotate =
                typeof item === "string"
                  ? i === 0
                    ? "-rotate-2"
                    : i === 1
                    ? "rotate-3 md:translate-y-8"
                    : i === 2
                    ? "-rotate-1"
                    : "rotate-2 md:translate-y-8"
                  : item.rotate || "";

              return (
                <div
                  key={i}
                  className={`glass-panel p-3 rounded-lg transform ${rotate} transition-all duration-300 sticker-peel cursor-pointer aspect-square`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center rounded"
                    style={{ backgroundImage: `url('${url}')` }}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Galactic Coordinates (Venue & Map) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch py-16" id="location">
          <div className="md:col-span-1 glass-panel p-8 rounded-xl flex flex-col justify-center border-l-4 border-l-[#3cd7ff]">
            <div className="flex items-center gap-3 mb-6 text-[#3cd7ff]">
              <Radar className="w-8 h-8" />
              <h2 className="font-serif text-2xl font-bold text-[#dae2fd]">
                Galactic Coordinates
              </h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-mono text-xs text-[#d2bbff] mb-1 uppercase font-bold tracking-wider">
                  Space Station
                </h3>
                <p className="text-base text-[#dae2fd] font-semibold">
                  {mainVenue.name || "St. Antony Church Hall"}
                </p>
              </div>
              <div>
                <h3 className="font-mono text-xs text-[#d2bbff] mb-1 uppercase font-bold tracking-wider">
                  Sector
                </h3>
                <p className="text-sm text-[#ccc3d8] leading-relaxed">
                  {mainVenue.address || "Kaval Kinaru, Tirunelveli District, Tamil Nadu, Earth"}
                </p>
              </div>
              <a
                className="inline-flex items-center gap-2 text-[#3cd7ff] hover:text-[#d2bbff] transition-colors font-mono text-xs mt-4 border border-[#3cd7ff]/30 rounded-full px-4 py-2 hover:bg-[#3cd7ff]/10 font-bold"
                href={mainVenue.mapLink}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation className="w-4 h-4" />
                Engage Thrusters (Google Maps)
              </a>
            </div>
          </div>

          {/* Interactive Radar Map Navigation Card */}
          <a
            href={mainVenue.mapLink}
            target="_blank"
            rel="noreferrer"
            className="md:col-span-2 rounded-xl overflow-hidden glass-panel h-80 relative group hover:border-[#3cd7ff]/60 transition-colors block cursor-pointer"
          >
            {/* Simulated Radar UI Overlay */}
            <div className="absolute inset-0 bg-[#0b1326]/50 z-10 border border-[#3cd7ff]/20 flex flex-col group-hover:bg-[#0b1326]/30 transition-colors">
              <div className="w-full h-8 border-b border-[#3cd7ff]/20 flex items-center px-4 gap-2 bg-[#222a3d]/80">
                <div className="w-3 h-3 rounded-full bg-[#ffb4ab]"></div>
                <div className="w-3 h-3 rounded-full bg-[#3cd7ff]"></div>
                <div className="w-3 h-3 rounded-full bg-[#d2bbff]"></div>
                <span className="ml-2 font-mono text-[10px] text-[#ccc3d8] tracking-widest uppercase">
                  NAV-SYSTEM ONLINE // SECTOR: {mainVenue.name?.toUpperCase() || "BASE"}
                </span>
              </div>
              <div className="flex-1 relative flex items-center justify-center">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#3cd7ff]/30"></div>
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#3cd7ff]/30"></div>
                <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full border border-[#3cd7ff]/20 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full border border-[#3cd7ff]/10 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-20 bg-[#0b1326]/90 border border-[#3cd7ff]/60 rounded-full px-5 py-2.5 font-mono text-xs text-[#3cd7ff] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(60,215,255,0.4)] group-hover:bg-[#3cd7ff] group-hover:text-[#0b1326] transition-colors">
                  Open Target Sector in Google Maps 🚀
                </div>
              </div>
            </div>
            <div
              className="absolute inset-0 bg-cover bg-center z-0 grayscale opacity-40 group-hover:opacity-60 transition-opacity"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB30HGxpouL2TCobBa6EntSuGZLEA6jh1KqT_x3Vqv7vy0adoHG3ULhZwrn3GCERjQ4njF2RnorO-mMTlmvjvUQqdzaZjUekxeWuVd1zpwSLl9PlGRpaemRHVFVXlG3mJLzWwAw7w44MtS5ufggsAjaACBu23pXpy6yiBI4gspFdDpVuu-7AggQ2j7bBssxX4gS87WgEwKNWZTK9tG7sSUArI8YaazhB_TDESSDf5rPNSc0JYAC601D')",
              }}
            />
          </a>
        </section>

        {/* Mission Briefing (RSVP) */}
        <section
          className="glass-panel p-10 rounded-xl text-center max-w-3xl mx-auto border-t-4 border-t-[#7c3aed] mb-12"
          id="rsvp"
        >
          <Rocket className="w-12 h-12 text-[#d2bbff] mx-auto mb-4 animate-bounce fill-current" />
          <h2 className="font-serif text-3xl md:text-4xl text-[#dae2fd] mb-4 font-bold">
            Mission Briefing Acceptance
          </h2>
          <p className="text-base text-[#ccc3d8] mb-8 max-w-xl mx-auto leading-relaxed">
            Confirm your coordinates for {celebrantName}'s 10th Solar Rotation celebration. Space is limited, so lock in your trajectory soon!
          </p>

          <RsvpSection partnerOne={celebrantName} partnerTwo="" />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#060e20] border-t border-[#4a4455]/30 w-full py-12 px-6 md:px-16 text-xs font-mono text-[#ccc3d8]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-base text-[#d2bbff] font-bold uppercase tracking-widest">
            {brandName}
          </div>
          <div>
            © {new Date().getFullYear()} Commander {celebrantName}'s Solar Rotation. All Rights Reserved.
          </div>
          <div className="flex gap-6 font-bold uppercase">
            <a href="#concept" className="hover:text-[#3cd7ff] transition-colors">
              Mission
            </a>
            <a href="#location" className="hover:text-[#3cd7ff] transition-colors">
              Coordinates
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
