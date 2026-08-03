"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, PlayCircle, Lock, MapPin, AlertTriangle, Flame } from "lucide-react";

export default function UrbanStreetwearBashInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Celebrant Name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const brandName = "URBAN_STREET";

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 14,
    minutes: 42,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(
      props.weddingDate || "2026-10-15T20:00:00"
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

  // Gallery items matching exact Stitch screen 990205ac113a48b69bea7420827c29e3
  const galleryList =
    props.galleryImages && props.galleryImages.length >= 3
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuArKqpEpBw99diBgqjhH5tEvPMtCgN6yYRd5LOIXYTmWQT_ROS9SChpLlOPAXuCDgMGduYAqG2ViQu971ItV3-kXaBiGKVnaV9Ytzoj7LdUxLwkbA5798xr1Vc_oIMjt_A3ySuDtK8kjlzGvZn6LNzboDzkZiYhUay-J2ORVYkWRavZWrko2RHct2FqAUMLPlkVL10WBxJ40aoNw36R3Lfh90VgeCuykTRr9J2towc_WHI9TR9G9y8x",
            rotate: "rotate-[-4deg]",
            bgColor: "bg-[#ff00ff]",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDdHbmQ9tthMNVH3PnOkjaQURD-YUP7poBPRzDG3Kf45bK_5c0DznNum3gflAd6WrPetWq7PJHDYuacZvgdxB47gAevz2lwdILvNpVHj7F2wHiuLthzeIpUXi7syX6wWEFrHC58xA18HXlAWMiE4KEPX_pixyOrvLoxi2tx5zPqK4eNjXPeiw1sTpL0HtpJGG0a7KvckF6a_Z8fbcCkJ7YuVkfDHfps1Xs-xzvKnxPdIWemzMKjlsC",
            rotate: "rotate-[3deg] md:mt-12",
            bgColor: "bg-[#ccff00]",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1iRmwea9B8zNIZsC56vD_btfaD5O1vnNcB8iq1-8ZZuBq0sGneEJcTBGDsiEiJCbW_OqGSRnQ3XW-uD5xbxyBQ5q7d8ayu4-ChpwTiVciC9OZxzKunAPeSodtp7w6M-4wCp9AEo8ync2t--hpu3zSLYIFOuE3vGIu-MyxwjNe-5p20IIZo--EAo9ouE0igHjhLTM2K4jcQZY_96t0jrxUz-hHQPm_FU5bnpFc6pTqd1Xsz94U-isD",
            rotate: "rotate-[-2deg]",
            bgColor: "bg-white",
          },
        ];

  // Streetwear lineup items
  const lineupSteps =
    props.events && props.events.length > 0
      ? props.events
      : [
          {
            time: "20:00",
            title: "Doors Open",
            desc: "Live DJ set by DJ K-Spin. Grab a drink and find your spot.",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiGouVWFGXrFXHNGxamU_ckuyK1gVnv004dyOOnwjPGqUHJOxckqEE25TldHkjfuRz6HuHPGz20oloWs5XWk7Du2SEy_R-JrHeWJsxRkhBy-WGdO0B7hkB0u15r_mGk-oQNGw7xk-96dQLcCv46lI1xaiiRugUMJV0sKrAgUZFtb8cyi5Ez7A09bIz3ClsIpMkbWKuGTVSfKzzkMwQHT1Gv1hHhOQgAJuyQv4wEIk1j7QsoXwR28dC",
            borderColor: "border-[#ccff00]",
            badgeBg: "bg-[#ccff00] text-black",
            rotate: "rotate-[-1deg]",
          },
          {
            time: "22:30",
            title: "Exclusive Drop",
            desc: "First look at the new urban collection. Limited pieces available.",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkmfzQM7u51p6-mfhdF0Ec2dCCUJ3bq6ub9D89xYKRcPiUr8xStXsWsEkqIr0jUNuFuaZUxMHy0kyt7w9M151g9Uo6r_r8sC8x17GaGzXX5bqwnaFBxA8aaJu2DIulR8ew1JRrrF5wvADPLxTImfc2zhXplALC3m_JIDC5fd1wEIh66LBFIXJPZwfj696zcDIEulWatVL8KxLVj4I-tbiF3s0QqSGS2ZAzO93mKH1qjj6BimsseFRd",
            borderColor: "border-[#ff00ff]",
            badgeBg: "bg-[#ff00ff] text-white",
            rotate: "rotate-[2deg]",
          },
          {
            time: "01:00",
            title: "Afterparty",
            desc: "Secret location revealed to attendees only. Keep the energy high.",
            isLock: true,
            borderColor: "border-[#ccff00]",
            badgeBg: "bg-[#ccff00] text-black",
            rotate: "rotate-[-1deg]",
          },
        ];

  return (
    <div className="bg-[#131313] text-[#e5e2e1] font-sans antialiased overflow-x-hidden relative selection:bg-[#ccff00]/30 selection:text-[#ccff00] min-h-screen">
      {/* Streetwear Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:ital,wght@0,400..700;1,400..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />

      {/* Neo-brutalist CSS Engine */}
      <style>{`
        .sticker-shadow { box-shadow: 6px 6px 0px 0px rgba(204,255,0,1); }
        .sticker-shadow-secondary { box-shadow: 6px 6px 0px 0px rgba(255,0,255,1); }
        .sticker-shadow-black { box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); }
        .sticker-shadow-black-lg { box-shadow: 12px 12px 0px 0px rgba(0,0,0,1); }
        
        .peel-effect {
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
        }
        .peel-effect-hover:hover {
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%);
        }

        .bg-[#131313] {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }

        .bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(204, 255, 0, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(204, 255, 0, 0.1) 1px, transparent 1px);
        }

        .text-stroke-black {
          -webkit-text-stroke: 2px #000;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday, 15th October 2026 at 8:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="urban-streetwear-bash"
      />

      {/* Header */}
      <header className="flex justify-between items-center w-full px-6 md:px-16 py-4 z-50 bg-[#131313] border-b-4 border-[#ccff00] shadow-[4px_4px_0px_0px_rgba(204,255,0,1)] sticky top-0">
        <div className="font-serif text-2xl md:text-3xl tracking-tighter text-[#ccff00] italic font-bold">
          {brandName}
        </div>
        <nav className="hidden md:flex gap-8 font-serif text-sm font-bold uppercase">
          <a
            className="text-[#e5e2e1] opacity-80 hover:bg-[#ff00ff] hover:text-white transition-transform scale-105 px-2 py-1"
            href="#lineup"
          >
            Lineup
          </a>
          <a
            className="text-[#e5e2e1] opacity-80 hover:bg-[#ff00ff] hover:text-white transition-transform scale-105 px-2 py-1"
            href="#story"
          >
            Vision
          </a>
          <a
            className="text-[#e5e2e1] opacity-80 hover:bg-[#ff00ff] hover:text-white transition-transform scale-105 px-2 py-1"
            href="#archive"
          >
            Archive
          </a>
          <a
            className="text-[#e5e2e1] opacity-80 hover:bg-[#ff00ff] hover:text-white transition-transform scale-105 px-2 py-1"
            href="#rsvp"
          >
            RSVP
          </a>
        </nav>
        <a
          className="hidden md:inline-flex bg-[#ccff00] text-black font-mono text-xs uppercase px-6 py-3 border-2 border-white sticker-shadow active:translate-x-1 active:translate-y-1 transition-all font-bold"
          href="#rsvp"
        >
          JOIN_CREW
        </a>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="md:hidden text-[#ccff00] p-2"
        >
          {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="w-full">
        {/* Hero Section */}
        <section className="relative min-h-[850px] flex items-center justify-center overflow-hidden px-6 md:px-16 py-20">
          <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 flex flex-col items-start gap-6 relative">
              <div className="absolute -top-12 -left-8 md:-left-12 rotate-[-5deg] z-20">
                <span className="bg-[#ff00ff] text-white font-mono text-xs uppercase px-4 py-2 border-2 border-[#ccff00] sticker-shadow-black font-bold">
                  VIP INVITE
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl uppercase text-white leading-none tracking-tight font-bold">
                {celebrantName}'s <br />
                <span className="text-[#ccff00] underline decoration-8 underline-offset-8">
                  Bash
                </span>
              </h1>
              <p className="font-sans text-base md:text-lg text-[#c4c9ac] max-w-md bg-[#2a2a2a] p-4 border-l-4 border-[#ccff00] relative z-10 peel-effect leading-relaxed">
                Get ready for the most exclusive underground streetwear event of the year. Limited capacity. High energy only.
              </p>
              <a
                className="mt-6 bg-white text-black font-serif text-xl uppercase px-8 py-4 border-4 border-white sticker-shadow-black hover:bg-[#ff00ff] hover:text-white hover:border-[#ff00ff] transition-colors active:translate-x-1 active:translate-y-1 z-10 rotate-[2deg] font-bold"
                href="#rsvp"
              >
                RSVP NOW
              </a>
            </div>

            <div className="flex-1 relative w-full h-[500px] md:h-[650px] flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-[#ccff00] sticker-shadow rotate-[3deg] z-0"></div>
              <div className="relative z-10 w-full h-full border-4 border-white peel-effect overflow-hidden rotate-[-2deg]">
                <img
                  alt={`${celebrantName} Streetwear Portrait`}
                  className="w-full h-full object-cover filter contrast-125 saturate-50 mix-blend-luminosity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbU8RpbgNa3bPgNMzEyC-qfY2czcPgzx31apUfi4LIh0hmdWm20h4fpUEK4wCghCi3gzPjo7YK47dYEptWcyJAAVGxKRqEzioNsYVVmU_fO2fEzxAVDXomeoRz9R3wLyn-3mZCwp_BbOQIeHRW3DaJY349WsODlGL7MvYUJqfmlGoof-yi7Jow8vlxU-vWJX-PAOdhv8qRuaT3R98ITHP81pRjy29WTbMCMyfCSSlxCdd4kX04Lmh-"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Hype Countdown Section */}
        <section className="py-16 px-6 md:px-16 bg-[#131313] relative z-20 border-y-4 border-[#ccff00]">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
            <h2 className="font-serif text-2xl uppercase text-white tracking-widest bg-black px-6 py-2 border-2 border-[#ccff00] sticker-shadow rotate-[-2deg] font-bold">
              The Drop Begins In
            </h2>
            <div className="flex gap-4 md:gap-8 justify-center">
              <div className="bg-[#393939] border-4 border-[#ccff00] p-6 sticker-shadow-black flex flex-col items-center min-w-[100px] md:min-w-[140px] rotate-[1deg]">
                <span className="font-serif text-4xl md:text-6xl text-[#ccff00] leading-none font-bold">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs text-[#c4c9ac] uppercase mt-2 font-bold">
                  Days
                </span>
              </div>
              <div className="bg-[#393939] border-4 border-[#ff00ff] p-6 sticker-shadow-black flex flex-col items-center min-w-[100px] md:min-w-[140px] rotate-[-1deg]">
                <span className="font-serif text-4xl md:text-6xl text-[#ff00ff] leading-none font-bold">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs text-[#c4c9ac] uppercase mt-2 font-bold">
                  Hours
                </span>
              </div>
              <div className="bg-[#393939] border-4 border-[#ccff00] p-6 sticker-shadow-black flex flex-col items-center min-w-[100px] md:min-w-[140px] rotate-[2deg]">
                <span className="font-serif text-4xl md:text-6xl text-[#ccff00] leading-none font-bold">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs text-[#c4c9ac] uppercase mt-2 font-bold">
                  Mins
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Origin Story Section */}
        <section className="py-20 px-6 md:px-16 bg-[#201f1f] relative z-10" id="story">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 relative order-2 md:order-1 w-full">
              <div className="absolute inset-0 bg-[#ff00ff] translate-x-4 translate-y-4 border-4 border-black z-0"></div>
              <div className="relative w-full aspect-video bg-black border-4 border-white z-10 flex items-center justify-center overflow-hidden">
                <PlayCircle className="w-16 h-16 text-[#ccff00] opacity-80 cursor-pointer hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-6 order-1 md:order-2">
              <h2 className="font-serif text-4xl md:text-6xl text-white uppercase leading-tight font-bold">
                The <br />
                <span className="text-[#ff00ff] text-stroke-black">Vision</span>
              </h2>
              <p className="font-sans text-base md:text-lg text-[#c4c9ac] border-l-4 border-[#ff00ff] pl-6 py-2 leading-relaxed">
                This isn't just a party. It's a statement. {celebrantName}'s Bash brings together the rawest elements of street culture, underground music, and exclusive fashion drops in one concrete space.
              </p>
              <div className="flex gap-4 mt-2 font-mono text-xs font-bold">
                <span className="bg-[#393939] px-4 py-2 text-[#ccff00] border border-[#ccff00]">
                  NO RULES
                </span>
                <span className="bg-[#393939] px-4 py-2 text-[#ff00ff] border border-[#ff00ff]">
                  JUST VIBES
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section (The Lineup) */}
        <section className="py-20 px-6 md:px-16 bg-[#201f1f] relative z-10 border-t-4 border-[#ff00ff]" id="lineup">
          <div className="max-w-6xl mx-auto flex flex-col gap-12">
            <div className="text-center relative">
              <h2 className="font-serif text-4xl md:text-6xl uppercase text-[#ff00ff] font-bold">
                The Lineup
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              {lineupSteps.map((step: any, idx: number) => {
                return (
                  <div
                    key={idx}
                    className={`bg-[#393939] border-4 ${
                      step.borderColor || "border-[#ccff00]"
                    } p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center sticker-shadow-black relative z-20 hover:scale-[1.01] transition-transform ${
                      step.rotate || ""
                    }`}
                  >
                    <div
                      className={`${
                        step.badgeBg || "bg-[#ccff00] text-black"
                      } font-serif text-xl md:text-2xl px-4 py-2 border-2 border-black sticker-shadow-black whitespace-nowrap font-bold`}
                    >
                      {step.time}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl uppercase text-white mb-2 font-bold">
                        {step.title}
                      </h3>
                      <p className="font-sans text-sm md:text-base text-[#c4c9ac]">
                        {step.desc}
                      </p>
                    </div>
                    {step.img ? (
                      <div className="hidden md:block w-28 h-28 border-2 border-white rotate-3 shrink-0 peel-effect overflow-hidden">
                        <img
                          alt={step.title}
                          className="w-full h-full object-cover filter grayscale contrast-150"
                          src={step.img}
                        />
                      </div>
                    ) : (
                      <div className="hidden md:block w-28 h-28 border-2 border-white rotate-2 shrink-0 peel-effect overflow-hidden bg-black flex items-center justify-center">
                        <Lock className="w-8 h-8 text-[#ccff00]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Base Coordinates Section */}
        <section className="py-20 px-6 md:px-16 bg-grid relative z-10" id="location">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 bg-[#201f1f] p-8 border-4 border-black sticker-shadow-black-lg">
            <div className="flex-1 flex flex-col gap-8 justify-center">
              <div className="inline-block bg-white text-black font-serif text-2xl px-6 py-2 border-2 border-black sticker-shadow-black self-start rotate-[-3deg] font-bold">
                <h2 className="uppercase">Base Coordinates</h2>
              </div>
              <div className="font-mono text-sm text-[#c4c9ac] space-y-4">
                <p className="text-[#ccff00] text-lg md:text-xl border-l-2 border-[#ccff00] pl-4 font-bold">
                  THE WAREHOUSE<br />
                  192 CONCRETE AVE<br />
                  DISTRICT 7
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#ff00ff]" /> Access via Underground Line B
                </p>
                <p className="flex items-center gap-2 text-[#ffb4ab]">
                  <AlertTriangle className="w-5 h-5" /> Warning: No parking on site.
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-[280px] bg-[#393939] border-4 border-[#ccff00] flex items-center justify-center relative overflow-hidden peel-effect">
              <MapPin className="w-16 h-16 text-[#ccff00] relative z-10 animate-bounce" />
            </div>
          </div>
        </section>

        {/* Hype Banner Section (Marquee) */}
        <section className="py-12 bg-[#ccff00] border-y-8 border-black overflow-hidden whitespace-nowrap flex items-center">
          <div className="animate-[marquee_20s_linear_infinite] flex items-center gap-12">
            <span className="font-serif text-4xl md:text-6xl text-black italic uppercase leading-none font-bold">
              STREET CULTURE DEFINED.
            </span>
            <span className="font-serif text-4xl md:text-6xl text-black italic uppercase leading-none text-stroke-black font-bold">
              STREET CULTURE DEFINED.
            </span>
            <span className="font-serif text-4xl md:text-6xl text-black italic uppercase leading-none font-bold">
              STREET CULTURE DEFINED.
            </span>
            <span className="font-serif text-4xl md:text-6xl text-black italic uppercase leading-none text-stroke-black font-bold">
              STREET CULTURE DEFINED.
            </span>
          </div>
        </section>

        {/* The Archive (Gallery Section) */}
        <section className="py-20 px-6 md:px-16 bg-[#131313] relative z-10 overflow-hidden" id="archive">
          <div className="max-w-6xl mx-auto flex flex-col gap-16">
            <h2 className="font-serif text-4xl md:text-6xl text-center uppercase text-white font-bold">
              The Archive
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {galleryList.map((item: any, i: number) => {
                const url = typeof item === "string" ? item : item.url;
                const rotate =
                  typeof item === "string"
                    ? i === 0
                      ? "rotate-[-4deg]"
                      : i === 1
                      ? "rotate-[3deg] md:mt-12"
                      : "rotate-[-2deg]"
                    : item.rotate || "";

                return (
                  <div key={i} className={`relative group ${rotate}`}>
                    <div className="absolute inset-0 bg-[#ff00ff] border-4 border-black sticker-shadow-black translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform z-0"></div>
                    <div className="relative aspect-[3/4] bg-[#393939] border-4 border-black z-10 peel-effect peel-effect-hover transition-all cursor-pointer overflow-hidden">
                      <img
                        alt={`Archive item #${i + 1}`}
                        className="w-full h-full object-cover filter grayscale contrast-150 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                        src={url}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RSVP Form */}
        <section className="py-20 px-6 md:px-16 bg-[#201f1f]" id="rsvp">
          <div className="max-w-3xl mx-auto bg-[#131313] border-4 border-[#ccff00] p-8 md:p-12 sticker-shadow-black-lg">
            <RsvpSection partnerOne={celebrantName} partnerTwo="" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e0e] border-t-4 border-[#ccff00] w-full py-12 px-6 md:px-16 text-xs font-mono text-[#c4c9ac]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-xl text-[#ccff00] font-bold uppercase tracking-widest font-serif italic">
            {brandName}
          </div>
          <div>
            © {new Date().getFullYear()} {celebrantName}'s Streetwear Bash. All Rights Reserved.
          </div>
          <div className="flex gap-6 uppercase font-bold">
            <a href="#lineup" className="hover:text-[#ccff00] transition-colors">
              Lineup
            </a>
            <a href="#story" className="hover:text-[#ccff00] transition-colors">
              Vision
            </a>
            <a href="#archive" className="hover:text-[#ccff00] transition-colors">
              Archive
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
