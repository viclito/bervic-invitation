"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, Calendar, MapPin, PlayCircle, Play, Sparkles, GlassWater, Utensils, Music, PartyPopper } from "lucide-react";

export default function ElegantWatercolorFloralInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Celebrant Name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const brandName = `${celebrantName.toUpperCase()}'S 30TH`;
  const celebrationTitle = `${celebrantName}'s Special Day`;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 15,
  });

  useEffect(() => {
    const targetDate = new Date(
      props.weddingDate || "2026-09-15T18:00:00"
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

  // Gallery items matching 100% birthday vibe
  const galleryList =
    props.galleryImages && props.galleryImages.length >= 3
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNwqi234BE9QmwnrysNENt7qR5469NSENJVC2JJGl5NRYiCs9tFiWCie8l-DsmDINWoIqgKKnuYT41DMb6Dy_TDp5oL6rPyu1VIcrWC_oW8Os_4S8roRwy0F8GDW1rnwHXHPjCJRcbk0P_s6fDRjc2tgo_Fg1WfPiWl6fLNgyFufX7DdqG7nLdpugTqhEfPrH0KindZeBV4AgYd8cFpPnsp1Ldv4aXiMFj8X4DYkOugv_9Oy5-PaQv",
            caption: "Summer '22",
            rotate: "rotate-1",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7kkZLcgtRsPCvKndKS8Fikp3jBEpBxrIGcBXPUaIZ1sZI6zGxMeR6t7CoIBG74B4dxbuA_3RHKmC-KFwIkFTPiU2qk4go9SnRNJmt_1802oh6_0vUmqwITJOMToWCGrrN6zaWJpQF_QhEPDv9P5qjGREjlwS9Kl_cZpcjE3NqNJyrR_eWo4G3LtQGZqtYjZmJaWSH2FkldCdWaBCuML6YwjYZzWKjc8-QbehQskd6zgM3wJEuWLHu",
            caption: "Sweet Details",
            rotate: "rotate-[-2deg]",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUJU6AiPtZe1zQI_GDNKEukBB7sZIo0cHAn0ea53Hrx9ZcTQFkYcHC9CxhXlvozySp3rx9rOXML1uExoHMROGG0lxBB_7q5877tct5LDAlr-TtYto-aZtA7BRm8TgPoi87oEeeB6u43BC_wzEryl1iHVybHl_15wXQiRkqxC3VuPwizKCQjUOEgMixgX9xuHwWhwJlsUaHa_vTOg4YN6o_rBylCCWC-YlK9f5z9aYXIySjGV-YI2a5",
            caption: "The Venue",
            rotate: "rotate-2",
          },
        ];

  // Birthday timeline steps
  const timelineSteps =
    props.events && props.events.length > 0
      ? props.events
      : [
          {
            time: "6:00 PM",
            title: "🍹 Welcome Drinks",
            date: "Sep 15, 2026",
          },
          {
            time: "7:30 PM",
            title: "🍽️ Artisanal Dinner",
            date: "Sep 15, 2026",
          },
          {
            time: "8:45 PM",
            title: "🎂 Cake Cutting & Toast",
            date: "Sep 15, 2026",
          },
          {
            time: "9:30 PM",
            title: "💃 Music & Dancing",
            date: "Sep 15, 2026",
          },
        ];

  return (
    <div className="bg-[#fefae0] text-[#1d1c0d] font-serif antialiased overflow-x-hidden relative selection:bg-[#7d562d]/20 selection:text-[#7d562d] min-h-screen">
      {/* Material Symbols Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap"
        rel="stylesheet"
      />

      {/* Watercolor CSS Engine & Animations */}
      <style>{`
        .watercolor-wash-bg {
          background: radial-gradient(circle at 20% 30%, rgba(212, 163, 115, 0.15) 0%, transparent 40%),
                      radial-gradient(circle at 80% 70%, rgba(183, 172, 143, 0.15) 0%, transparent 40%);
        }

        .glass-panel {
          background: rgba(254, 250, 224, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px 0 rgba(125, 86, 45, 0.05);
        }

        .text-glow {
          text-shadow: 0 2px 15px rgba(125, 86, 45, 0.15);
        }

        .organic-blob-divider {
          position: relative;
          width: 100%;
          height: 100px;
          overflow: hidden;
          line-height: 0;
          transform: rotate(180deg);
        }
        .organic-blob-divider svg {
          display: block;
          width: calc(100% + 1.3px);
          height: 150px;
        }
        .organic-blob-divider .shape-fill {
          fill: #dedbc2;
        }

        .organic-blob-divider-bottom {
          position: relative;
          width: 100%;
          height: 100px;
          overflow: hidden;
          line-height: 0;
        }
        .organic-blob-divider-bottom svg {
          display: block;
          width: calc(100% + 1.3px);
          height: 150px;
        }
        .organic-blob-divider-bottom .shape-fill {
          fill: #f2efd5;
        }

        .sticker-peel {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .sticker-peel:hover {
          transform: scale(1.02) rotate(-2deg);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1), -5px -5px 15px rgba(255,255,255,0.8);
          border-bottom-right-radius: 20px;
        }
      `}</style>

      {/* Ambient Watercolor Texture */}
      <div className="fixed inset-0 pointer-events-none watercolor-wash-bg z-[-1]"></div>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday, 15th September 2026 at 6:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="elegant-watercolor-floral"
      />

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#fefae0]/80 backdrop-blur-md border-b border-[#d4c4b7]/30 transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-20">
          <div className="text-2xl text-[#7d562d] font-serif font-bold tracking-tight">
            {brandName}
          </div>

          <div className="hidden md:flex items-center gap-8 font-sans text-xs font-semibold uppercase tracking-widest text-[#50453b]">
            <a
              className="hover:text-[#7d562d] transition-colors"
              href="#story"
            >
              Our Story
            </a>
            <a
              className="hover:text-[#7d562d] transition-colors"
              href="#events"
            >
              Timeline
            </a>
            <a
              className="hover:text-[#7d562d] transition-colors"
              href="#gallery"
            >
              Gallery
            </a>
            <a
              className="text-[#7d562d] font-bold border-b border-[#7d562d]/40 pb-1"
              href="#rsvp"
            >
              RSVP
            </a>
            <a
              className="hover:text-[#7d562d] transition-colors"
              href="#contact"
            >
              Contact
            </a>
          </div>

          <a
            className="hidden md:inline-flex px-6 py-2 bg-[#7d562d] text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-full hover:bg-[#5b3912] transition-colors shadow-[0_4px_14px_0_rgba(125,86,45,0.2)]"
            href="#rsvp"
          >
            RSVP Now
          </a>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#7d562d] p-2"
          >
            {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#fefae0] border-t border-[#d4c4b7]/30 px-6 py-4 flex flex-col gap-3 text-center font-sans">
            <a
              href="#story"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#50453b] font-semibold py-2 border-b border-[#e7e3ca]"
            >
              Our Story
            </a>
            <a
              href="#events"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#50453b] font-semibold py-2 border-b border-[#e7e3ca]"
            >
              Timeline
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#50453b] font-semibold py-2 border-b border-[#e7e3ca]"
            >
              Gallery
            </a>
            <a
              href="#rsvp"
              onClick={() => setMobileNavOpen(false)}
              className="bg-[#7d562d] text-white py-2.5 rounded-full font-semibold text-xs uppercase tracking-wider"
            >
              RSVP Now
            </a>
          </div>
        )}
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[880px] flex flex-col items-center justify-center overflow-hidden px-6 md:px-16 py-20">
          {/* Asymmetrical Corner Floral Images */}
          <img
            alt="Watercolor Floral Frame Top Left"
            className="absolute top-0 left-0 w-64 md:w-96 opacity-60 pointer-events-none -translate-x-1/4 -translate-y-1/4 rotate-[15deg]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBbq3Nbe8AemSKWrtfTRwypDPTS6co-s1WGLpcpIpsukg25UVtiUyuWDMkDn7OKR8TelkeWpTQCpHRdc7H4KCO3ctkURKQR8dOHv6du434S1JcS6pxsfTTSNk6oAhZbGNt6jO4ZwBUi4NSxfp1ho_-Dr9XijUm5Clao8hyx2ZxNCHFGNmYRZFv33PRwXsE0TlFTVZ4Zu9rlIk4zh7t-DzJ1xLQRPRduksKYecoShyPvOW0osFxzUo7"
          />
          <img
            alt="Watercolor Floral Frame Bottom Right"
            className="absolute bottom-0 right-0 w-64 md:w-96 opacity-60 pointer-events-none translate-x-1/4 translate-y-1/4 rotate-[195deg]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNI4un1gaV0B0IoifiXV-4mh687Z8zKBfiioWXoo_E70DPXPOZ0zsaJMCe2xUNXi21uufbAhM0qohkdg3U_yHD_N8k4lB2t-wueC4NWPQk1J54mBgvLaBr1syNbFGniSdB0ISb1pxk36ZmZ6xHElGgQ3Hv3IUkGL4vSBB8g1CLhs7nPCFYin3fJACypaBPde3abZ5RWPySYV--2PJ6eM-biZThJryEhIqgv3UO4sOYTZ7DKsLqZo_o"
          />

          <div className="glass-panel p-8 md:p-16 rounded-3xl max-w-3xl text-center relative z-10 flex flex-col items-center gap-6 shadow-sm">
            <span className="font-sans text-xs font-semibold text-[#5d6143] uppercase tracking-[0.2em]">
              You are invited to celebrate
            </span>
            <h1 className="text-4xl md:text-6xl text-[#7d562d] text-glow font-bold leading-tight font-serif">
              {celebrantName}'s <br />
              <span className="font-sans text-[#5d6143] text-xl md:text-2xl mx-4 italic font-normal">
                ♥ 30th ♥
              </span>{" "}
              <br />
              Special Day
            </h1>
            <p className="text-base md:text-lg text-[#50453b] max-w-xl mx-auto leading-relaxed">
              Join us for an evening of joy, laughter, and unforgettable memories as we celebrate a milestone surrounded by nature's quiet beauty.
            </p>
            <div className="mt-4 flex flex-col md:flex-row items-center gap-4 text-[#665e45] text-sm font-sans">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7d562d]" />
                15th September 2026 | 6:00 PM Onwards
              </span>
              <span className="hidden md:inline text-[#d4c4b7]">•</span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#7d562d]" />
                The Serene Pavilion, Tranquil Hills
              </span>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-20 px-6 md:px-16 bg-[#fefae0] relative z-10 border-y border-[#d4c4b7]/20">
          <div className="max-w-[1280px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl text-[#7d562d] mb-8 font-bold font-serif">
              The Countdown Begins
            </h2>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              <div className="glass-panel flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#7d562d]/20 p-4">
                <span className="text-2xl md:text-4xl text-[#7d562d] font-bold font-serif">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] md:text-xs text-[#5d6143] tracking-widest uppercase mt-1 font-semibold">
                  Days
                </span>
              </div>
              <div className="glass-panel flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#7d562d]/20 p-4">
                <span className="text-2xl md:text-4xl text-[#7d562d] font-bold font-serif">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] md:text-xs text-[#5d6143] tracking-widest uppercase mt-1 font-semibold">
                  Hours
                </span>
              </div>
              <div className="glass-panel flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#7d562d]/20 p-4">
                <span className="text-2xl md:text-4xl text-[#7d562d] font-bold font-serif">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] md:text-xs text-[#5d6143] tracking-widest uppercase mt-1 font-semibold">
                  Minutes
                </span>
              </div>
              <div className="glass-panel flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#7d562d]/20 p-4">
                <span className="text-2xl md:text-4xl text-[#7d562d] font-bold font-serif">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] md:text-xs text-[#5d6143] tracking-widest uppercase mt-1 font-semibold">
                  Seconds
                </span>
              </div>
            </div>
            <p className="text-base text-[#5d6143] mt-8 italic font-sans">
              ✨ Get ready for {celebrantName}'s 30th Birthday Celebration! ✨
            </p>
          </div>
        </section>

        {/* Our Story Section (A New Decade) */}
        <section className="py-20 px-6 md:px-16 bg-[#f2efd5] relative overflow-hidden" id="story">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10 flex flex-col gap-6 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl text-[#7d562d] font-bold font-serif">
                A New Decade
              </h2>
              <div className="flex items-center justify-center md:justify-start text-[#5d6143] mb-2">
                <Sparkles className="w-6 h-6 text-[#7d562d]" />
              </div>
              <p className="text-lg md:text-xl text-[#50453b] italic leading-relaxed">
                "Thirty feels like a profound threshold—a time to slow down, connect deeply, and enjoy the simple beauty of good company."
              </p>
              <div className="mt-4">
                <button className="flex items-center justify-center md:justify-start gap-2 text-[#7d562d] font-bold hover:text-[#5b3912] transition-colors font-sans text-sm">
                  <PlayCircle className="w-6 h-6" />
                  Watch Highlight Reel
                </button>
              </div>
            </div>

            {/* Video Placeholder */}
            <div className="relative z-10 mt-8 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-md aspect-video rounded-[3rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(125,86,45,0.2)] border-[8px] border-[#fefae0]/50">
                <img
                  alt="Birthday Highlight Video Placeholder"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZCkfapr3kHN4Z2HWJgMAu969WaZErlUGyVg0mTlWmloy-uhdFfRMiSSCNhMo0C-ymAjjw4hxDsngLL1kGZQcnTHrhrm63ss5ivqgcXiOtTcj8G6v_UY8--i2XPajDm5JADtmZbg6N9vPSeCkzBig52dT2B-1wtrydI05mNhiBPwfoOqJ5cxKc3HLl449etoHZfdJpxUI4ECa_Beg6zBU_E1QoKzLveaLhiBIdyzLbh-FVDEfdEIgm"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/50 transition-colors">
                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Organic Wave Divider */}
        <div className="organic-blob-divider">
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path
              className="shape-fill"
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            ></path>
          </svg>
        </div>

        {/* Event Timeline Section */}
        <section className="bg-[#dedbc2] py-20 px-6 md:px-16" id="events">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl text-[#7d562d] mb-4 font-bold font-serif">
                The Birthday Schedule
              </h2>
              <p className="text-base text-[#50453b] max-w-2xl mx-auto leading-relaxed">
                Join us as we celebrate {celebrantName}'s special milestone throughout the evening
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#82756a]/30 -translate-x-1/2"></div>

              {timelineSteps.map((step, idx) => {
                const isLeft = idx % 2 === 0;

                return (
                  <div
                    key={idx}
                    className={`glass-panel p-6 rounded-2xl relative ${
                      isLeft ? "md:text-right" : ""
                    } ${idx >= 2 ? "mt-4 md:mt-0" : ""}`}
                  >
                    {isLeft ? (
                      <div className="hidden md:block absolute right-0 top-1/2 w-4 h-4 rounded-full bg-[#e2e6bf]/50 border border-[#5d6143] translate-x-[calc(50%+16px)] -translate-y-1/2 shadow-sm"></div>
                    ) : (
                      <div className="hidden md:block absolute left-0 top-1/2 w-4 h-4 rounded-full bg-[#e2e6bf]/50 border border-[#5d6143] -translate-x-[calc(50%+16px)] -translate-y-1/2 shadow-sm"></div>
                    )}
                    <span className="font-sans text-xs font-semibold text-[#7d562d] tracking-widest mb-2 block">
                      {step.time}
                    </span>
                    <h3 className="text-xl font-serif text-[#1d1c0d] mb-2 font-medium">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#50453b]">
                      {step.date || "Sep 15, 2026"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Organic Blob Divider Bottom */}
        <div className="organic-blob-divider-bottom">
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path
              className="shape-fill"
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            ></path>
          </svg>
        </div>

        {/* Highlight Banner */}
        <section className="py-16 md:py-24 px-6 text-center bg-[#7d562d] text-white watercolor-wash-bg">
          <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10 gap-4">
            <span className="text-white/50 text-4xl italic font-serif">“</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light italic opacity-90 leading-tight">
              "In simplicity, we find beauty."
            </h2>
          </div>
        </section>

        {/* Locations Section (The Venue) */}
        <section className="bg-[#f2efd5] py-20 px-6 md:px-16 relative overflow-hidden" id="locations">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col gap-6 z-10">
              <h2 className="text-3xl md:text-4xl text-[#7d562d] font-bold font-serif">
                The Venue
              </h2>
              <p className="text-base text-[#50453b]">
                Join us at this beautiful estate to celebrate {celebrantName}'s 30th birthday.
              </p>

              {/* Party Venue */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <PartyPopper className="w-6 h-6 text-[#5d6143] mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#1d1c0d] mb-1 font-serif text-lg">
                      Celebration Pavilion
                    </h4>
                    <p className="text-sm text-[#50453b] leading-relaxed">
                      The Serene Pavilion<br />
                      123 Calm Way<br />
                      Tranquil Hills
                    </p>
                    <a
                      className="text-[#7d562d] hover:underline text-sm font-semibold mt-2 inline-block font-sans"
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* After-Party Venue */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <GlassWater className="w-6 h-6 text-[#5d6143] mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#1d1c0d] mb-1 font-serif text-lg">
                      Glasshouse Lounge
                    </h4>
                    <p className="text-sm text-[#50453b] leading-relaxed">
                      The Glasshouse Conservatory<br />
                      123 Calm Way<br />
                      Tranquil Hills
                    </p>
                    <a
                      className="text-[#7d562d] hover:underline text-sm font-semibold mt-2 inline-block font-sans"
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Area */}
            <div className="relative z-10 mt-8 lg:mt-0 h-full flex flex-col justify-center">
              <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(125,86,45,0.2)] border-[8px] border-[#fefae0]/50 bg-[#fefae0] flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#d4c4b7 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative z-10 flex flex-col items-center text-[#5d6143] gap-2">
                  <MapPin className="w-10 h-10 text-[#7d562d]" />
                  <span className="font-sans text-xs font-semibold tracking-widest uppercase">
                    Map Details Provided Upon RSVP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto" id="gallery">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-[#7d562d] mb-4 font-bold font-serif">
              Memories & Moments
            </h2>
            <p className="text-base text-[#50453b] max-w-lg mx-auto leading-relaxed">
              Glimpses of shared laughs, unforgettable adventures, and sweet moments.
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
                  className={`bg-[#fefae0] p-3 shadow-md rounded-sm transform ${rotate} sticker-peel`}
                >
                  <div className="aspect-square bg-[#f8f4db] overflow-hidden rounded-xs">
                    <img
                      alt={caption}
                      className="w-full h-full object-cover"
                      src={url}
                    />
                  </div>
                  <p className="font-sans text-xs font-semibold text-center mt-3 text-[#5d6143]">
                    {caption}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="py-20 bg-[#f8f4db] border-t border-[#d4c4b7]/30">
          <RsvpSection partnerOne={celebrantName} partnerTwo="" />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f8f4db] border-t border-[#d4c4b7]/30 py-12 px-6 md:px-16 text-center text-xs font-sans text-[#5d6143]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-serif text-[#7d562d] font-bold">
            {brandName}
          </div>
          <div>
            © {new Date().getFullYear()} {celebrantName}'s 30th Birthday. Crafted with Love.
          </div>
          <div className="flex gap-6 font-semibold">
            <a href="#story" className="hover:text-[#7d562d] transition-colors">
              Our Story
            </a>
            <a href="#events" className="hover:text-[#7d562d] transition-colors">
              Timeline
            </a>
            <a href="#gallery" className="hover:text-[#7d562d] transition-colors">
              Gallery
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
