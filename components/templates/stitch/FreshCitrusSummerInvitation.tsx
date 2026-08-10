"use client";

import { useState, useEffect } from "react";
import { getYouTubeEmbedUrl } from "@/lib/dateUtils";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Menu,
  X,
  Play,
  MapPin,
  Calendar,
  Car,
  Coffee,
  Utensils,
  PartyPopper,
  Music,
  UtensilsCrossed,
  ArrowRight,
} from "lucide-react";

export default function FreshCitrusSummerInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Celebrant Name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const brandName = "Citrus Summer";

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(
      props.weddingDate || "2026-08-15T10:30:00"
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

  // Gallery items matching exact Stitch screen 78b87bccfe924e33a5f8d5422cb65a03
  const galleryList =
    props.galleryImages && props.galleryImages.length >= 3
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSsKGaMuuDxgIaWJElIBuO9LMUZvIAPe_TZ99NLrT_RmiQmid1eHwWPgN01lxQwP6NJiC-Z0o2fxeTfB2UNm8GRJ7BKObTwA5qfk8sstLqYLwKIeBWUMDCD_rhUS9cL7K_HA_pmRR1ErDPHpYJZ7XYRoxwuiWAEr79G9nDuarVao0TFxMAqgQ8DfUCMe0YH0-z7ve0o3TMXBcLY6t-jCqFa2t8heaoMmTBwOH7rrh25AUSXRk92Rbd",
            caption: "Fresh Details",
            rotate: "rotate-[-2deg]",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCz6IHDKKBoX41WAxmwji2X4g83f4HXWVoYyu-l3u-Pvbnrv2UAHC4pBL9jm18v7h5q1FUf5Zj5wf7eVaN69naKDxDBtlWhUz7xoq7LPwp3cAQXXuAv-awYeD3s3Riq5eUYtMJ_mHT6sYdGIn1AkcOumL2IhTIwNehwF_L8q7HaeX-SnOUIPq2v-pZvYAr-spSZ3ONFlnDhtpPQOJNgT3owQQXOs4Ox4c-SljHVceYfAoh-VI_zEQxW",
            caption: "The Tablescape",
            rotate: "rotate-[3deg] translate-y-4",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGEXwHUm8LNh76mgGBWP6kijB-g6dNyXszqcLkwDF0nzOf9MEHGVi3-tGQqHS5zBRix1VD53kH6VOCC39mXdn7EgI2rIHXoIStSTXEocK4516r3sDNvO0kVS3n4g_broZDPn0XXAtTvvWqDIOwMyQYQHHZK9djCa4jfiZOVVEvyzeE9yuM6oJuR7POtSMbjk-oIVbYmgr9mvcC1jTp9yqi-XI-q7toGvAuKBAifA6farSWeqp2LiCi",
            caption: "Cheers!",
            rotate: "rotate-[-1deg]",
          },
        ];

  // Schedule items
  const itinerarySteps =
    props.events && props.events.length > 0
      ? props.events
      : [
          {
            time: "10:30 AM",
            title: "Arrival & Mimosas",
            desc: "Welcome! Start your morning with a freshly squeezed mimosa and light pastries while everyone gathers.",
            icon: Coffee,
            bgColor: "bg-[#ff8c00]",
            textColor: "text-white",
          },
          {
            time: "11:15 AM",
            title: "Brunch is Served",
            desc: "Take your seats for a multi-course brunch featuring seasonal, citrus-infused dishes.",
            icon: Utensils,
            bgColor: "bg-[#e8e8e3]",
            textColor: "text-[#1a1c19]",
          },
          {
            time: "1:00 PM",
            title: "Toasts & Cake",
            desc: "A few words, plenty of laughs, and the cutting of the lemon zest celebration cake.",
            icon: PartyPopper,
            bgColor: "bg-[#69fd5d]",
            textColor: "text-[#005306]",
          },
          {
            time: "2:00 PM",
            title: "Golden Hour Mingle",
            desc: "Relax in the botanical gardens with iced tea, lawn games, and gentle afternoon tunes.",
            icon: Music,
            bgColor: "bg-[#b2a997]",
            textColor: "text-[#201b0f]",
          },
        ];

  return (
    <div className="bg-[#fafaf4] text-[#1a1c19] font-sans antialiased overflow-x-hidden relative min-h-screen">
      {/* Citrus Summer Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Be+Vietnam+Pro:wght@400;500;600&family=Space+Grotesk:wght@600&display=swap"
        rel="stylesheet"
      />

      {/* Citrus Summer CSS Engine */}
      <style>{`
        .citrus-slice-bg {
          background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="none" stroke="%23ff8c00" stroke-width="2" opacity="0.12"/><circle cx="50" cy="50" r="35" fill="none" stroke="%23ff8c00" stroke-width="1" opacity="0.12"/><path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="%23ff8c00" stroke-width="1" opacity="0.12"/></svg>');
        }
        .animate-spin-slow {
          animation: spin 24s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .sticker-peel {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .sticker-peel:hover {
          transform: scale(1.04) rotate(2deg) translateY(-4px);
          box-shadow: 12px 12px 0px rgba(255, 140, 0, 0.2);
        }
        .font-title-citrus {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .font-mono-citrus {
          font-family: 'Space Grotesk', monospace;
        }
        .font-body-citrus {
          font-family: 'Be Vietnam Pro', sans-serif;
        }
      `}</style>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday, 15th August 2026 at 10:30 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="fresh-citrus-summer"
      />

      {/* Floating Interactive Citrus Wheel Widget */}
      <a
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 animate-float hover:scale-110 transition-transform duration-300 group"
        href="#rsvp"
      >
        <div className="w-16 h-16 bg-[#ff8c00] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(255,140,0,0.4)] border-2 border-white/50 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 citrus-slice-bg animate-spin-slow opacity-50 group-hover:opacity-100 transition-opacity" />
          <UtensilsCrossed className="w-7 h-7 text-white z-10" />
        </div>
      </a>

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#fafaf4]/80 backdrop-blur-md border-b border-white/20 shadow-[0_8px_30px_rgba(255,140,0,0.08)] hidden md:block">
        <div className="flex justify-between items-center px-12 py-4 max-w-[1200px] mx-auto">
          <div className="font-title-citrus text-2xl font-extrabold text-[#904d00] tracking-tight hover:scale-105 transition-transform duration-300">
            {brandName}
          </div>
          <div className="flex items-center gap-8 font-mono-citrus text-xs uppercase tracking-wider">
            <a className="text-[#564334] hover:text-[#904d00] transition-colors" href="#hero">
              Home
            </a>
            <a className="text-[#564334] hover:text-[#904d00] transition-colors" href="#about">
              About
            </a>
            <a className="text-[#564334] hover:text-[#904d00] transition-colors" href="#timeline">
              Timeline
            </a>
            <a className="text-[#564334] hover:text-[#904d00] transition-colors" href="#venue">
              Venue
            </a>
            <a className="text-[#564334] hover:text-[#904d00] transition-colors" href="#gallery">
              Gallery
            </a>
            <a
              className="bg-[#904d00] text-white px-6 py-2 rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_4px_14px_rgba(255,140,0,0.4)] font-bold"
              href="#rsvp"
            >
              RSVP
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="pt-0 md:pt-20 pb-28">
        {/* Hero Section */}
        <section className="relative min-h-[750px] flex items-center justify-center overflow-hidden px-6 md:px-16 py-20" id="hero">
          {/* Decorative Citrus Slice Graphic Wheels */}
          <div className="absolute top-10 left-10 w-40 h-40 citrus-slice-bg animate-spin-slow opacity-40" />
          <div
            className="absolute bottom-20 right-20 w-64 h-64 citrus-slice-bg animate-spin-slow opacity-40"
            style={{ animationDuration: "30s" }}
          />
          <div className="absolute top-1/3 right-10 w-20 h-20 rounded-full bg-[#69fd5d]/20 blur-xl" />
          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full bg-[#ff8c00]/20 blur-2xl" />

          <div className="max-w-[1200px] mx-auto text-center relative z-10 flex flex-col items-center">
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#b2a997]/20 text-[#006e0a] border border-[#006e0a]/20 font-mono-citrus text-xs uppercase tracking-widest backdrop-blur-md font-bold">
              YOU'RE INVITED
            </span>
            <h1 className="font-title-citrus text-4xl md:text-6xl font-extrabold text-[#904d00] mb-6 leading-tight max-w-4xl">
              {celebrantName}'s Citrus Summer Brunch
            </h1>
            <p className="font-body-citrus text-base md:text-lg text-[#564334] max-w-2xl mb-10 leading-relaxed">
              Join us for an effervescent morning of fresh squeezed joy, radiant company, and aesthetic delights. Let's celebrate the warmth of summer together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                className="bg-[#904d00] text-white px-8 py-3.5 rounded-full hover:scale-105 transition-transform duration-300 font-mono-citrus text-xs uppercase tracking-wider shadow-[0_8px_24px_rgba(255,140,0,0.3)] font-bold"
                href="#rsvp"
              >
                RSVP Now
              </a>
              <a
                className="border border-[#006e0a]/30 bg-[#fafaf4]/50 backdrop-blur-md text-[#006e0a] px-8 py-3.5 rounded-full hover:bg-[#006e0a]/10 transition-colors duration-300 font-mono-citrus text-xs uppercase tracking-wider font-bold"
                href="#about"
              >
                Event Details
              </a>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-12 bg-[#ff8c00]/5 relative overflow-hidden" id="countdown">
          <div className="max-w-[1200px] mx-auto px-6 md:px-16 text-center">
            <h3 className="font-mono-citrus text-xs text-[#904d00] uppercase tracking-widest mb-8 font-bold">
              Counting down the days
            </h3>
            <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
              <div className="bg-[#fafaf4] rounded-2xl p-6 shadow-[0_8px_30px_rgba(255,140,0,0.08)] border border-[#904d00]/10 w-24 md:w-32">
                <div className="font-title-citrus text-4xl md:text-5xl font-extrabold text-[#904d00] mb-2">
                  {String(timeLeft.days).padStart(2, "0")}
                </div>
                <div className="font-mono-citrus text-xs text-[#564334]">
                  Days
                </div>
              </div>
              <div className="bg-[#fafaf4] rounded-2xl p-6 shadow-[0_8px_30px_rgba(255,140,0,0.08)] border border-[#904d00]/10 w-24 md:w-32">
                <div className="font-title-citrus text-4xl md:text-5xl font-extrabold text-[#904d00] mb-2">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="font-mono-citrus text-xs text-[#564334]">
                  Hours
                </div>
              </div>
              <div className="bg-[#fafaf4] rounded-2xl p-6 shadow-[0_8px_30px_rgba(255,140,0,0.08)] border border-[#904d00]/10 w-24 md:w-32">
                <div className="font-title-citrus text-4xl md:text-5xl font-extrabold text-[#904d00] mb-2">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="font-mono-citrus text-xs text-[#564334]">
                  Mins
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Story Section */}
        <section className="py-20 px-6 md:px-16 relative" id="about">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-title-citrus text-3xl md:text-4xl font-bold text-[#904d00] mb-6">
                  Freshly Squeezed Joy
                </h2>
                <p className="font-body-citrus text-base md:text-lg text-[#564334] mb-6 leading-relaxed">
                  Summer is a state of mind, and this brunch is our canvas. We're bringing together our favorite people to celebrate the season with a menu inspired by sun-kissed citrus and vibrant flavors.
                </p>
                <p className="font-body-citrus text-base md:text-lg text-[#564334] mb-8 leading-relaxed">
                  Expect an elegant yet relaxed atmosphere where the mimosas flow freely, the conversation sparkles, and every detail is designed to bring a little sunshine to your day. Let's create memories that are as bright and refreshing as a summer breeze.
                </p>
                <a
                  className="inline-flex items-center gap-2 text-[#904d00] hover:text-[#ff8c00] transition-colors font-mono-citrus text-xs uppercase tracking-wider font-bold"
                  href="#timeline"
                >
                  View the itinerary <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-[#ff8c00]/20 rounded-[2rem] transform rotate-3 blur-xl" />
                <div className="relative bg-[#fafaf4] p-4 rounded-[2rem] shadow-xl border border-white/50 backdrop-blur-md">
                  <div className="aspect-video bg-black rounded-xl flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    {isPlayingVideo ? (
                      <iframe
                        title="Love story video"
                        src={getYouTubeEmbedUrl(props.loveStoryVideoUrl)}
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    ) : (
                      <div className="relative w-full h-full" onClick={() => setIsPlayingVideo(true)}>
                        <img
                          alt="Video Cover Photo"
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                          src={props.coverImage || props.heroImage || props.coupleImage || "/images/templates/couple-photo.jpg"}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center z-10 text-[#904d00] shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlight Banner (Quote) */}
        <section className="py-24 relative overflow-hidden flex items-center justify-center my-12">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00]/40 to-[#69fd5d]/30" />
          <div className="absolute inset-0 citrus-slice-bg animate-spin-slow opacity-20" />
          <div className="relative z-10 text-center px-6">
            <h2 className="font-title-citrus text-3xl md:text-5xl text-[#904d00] font-extrabold max-w-4xl mx-auto drop-shadow-md">
              "Savor the sunshine, celebrate the moment."
            </h2>
          </div>
        </section>

        {/* Timeline Section (The Itinerary) */}
        <section className="py-20 px-6 md:px-16 bg-white rounded-3xl shadow-sm my-12" id="timeline">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-title-citrus text-3xl md:text-4xl font-bold text-[#904d00] mb-3">
                The Itinerary
              </h2>
              <p className="font-body-citrus text-base text-[#564334]">
                A vibrant flow for our day together
              </p>
            </div>
            <div className="relative border-l-2 border-[#904d00]/20 pl-8 ml-4 md:ml-0 space-y-12">
              {itinerarySteps.map((step: any, idx: number) => {
                const IconComp = step.icon;
                return (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-[41px] top-1 w-8 h-8 rounded-full ${step.bgColor} flex items-center justify-center border-4 border-white shadow-sm`}
                    >
                      <IconComp className={`w-4 h-4 ${step.textColor}`} />
                    </div>
                    <h3 className="font-mono-citrus text-xs text-[#904d00] uppercase tracking-wider mb-1 font-bold">
                      {step.time}
                    </h3>
                    <h4 className="font-title-citrus text-xl font-bold text-[#1a1c19] mb-2">
                      {step.title}
                    </h4>
                    <p className="text-[#564334] font-body-citrus text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Citrus Moments Gallery */}
        <section className="py-20 px-6 md:px-16 overflow-hidden" id="gallery">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-title-citrus text-3xl md:text-4xl font-bold text-[#904d00] mb-3">
                Citrus Moments
              </h2>
              <p className="font-body-citrus text-base text-[#564334]">
                A glimpse of the aesthetic
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {galleryList.map((item: any, i: number) => {
                const url = typeof item === "string" ? item : item.url;
                const caption =
                  typeof item === "string"
                    ? i === 0
                      ? "Fresh Details"
                      : i === 1
                      ? "The Tablescape"
                      : "Cheers!"
                    : item.caption || "Citrus Vibes";

                const rotate =
                  typeof item === "string"
                    ? i === 0
                      ? "rotate-[-2deg]"
                      : i === 1
                      ? "rotate-[3deg] translate-y-4"
                      : "rotate-[-1deg]"
                    : item.rotate || "";

                return (
                  <div
                    key={i}
                    className={`bg-[#fafaf4] p-4 rounded-xl shadow-md border border-[#ddc1ae]/40 ${rotate} sticker-peel`}
                  >
                    <div className="aspect-square bg-[#f4f4ee] rounded-lg overflow-hidden mb-4">
                      <img
                        alt={caption}
                        className="w-full h-full object-cover"
                        src={url}
                      />
                    </div>
                    <p className="font-mono-citrus text-xs text-center text-[#564334] uppercase font-bold tracking-wider">
                      {caption}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* The Orangery Venue Section */}
        <section className="py-20 px-6 md:px-16 bg-[#fafaf4]/80 rounded-3xl border border-[#904d00]/10 my-12" id="venue">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 md:order-1">
                <div className="absolute inset-0 bg-[#006e0a]/10 rounded-2xl transform rotate-3 scale-105 blur-lg" />
                <div
                  className="w-full h-[450px] bg-cover bg-center rounded-2xl shadow-lg relative z-10 border border-white/50"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCbHKejKdRUkXbCUxxcjo3sUqfciRib9IgPhlWMTI115yZLJev3rUMmMUtglPKEebM802jt0H4KNf8IxAuTQytYxSNFyu0tVwxxAdAoRxQ1_QYf46Ex_Yxxj7CpA0qZ20uqjKJd8WR214MBxDY5xHpBwRuwlaqei02_gHQ8EeKvK7ZTyDzcAVR_ATpjzKgiZFPnz5Tai16I72avsd0OKTYXB7aSuT2957Q-Ecp5zGpZQSfYa-hpB6gO')",
                  }}
                />
                <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center z-20 border border-[#ddc1ae]/40">
                  <MapPin className="w-8 h-8 text-[#904d00]" />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="font-title-citrus text-3xl md:text-4xl font-bold text-[#904d00] mb-6">
                  The Orangery
                </h2>
                <p className="font-body-citrus text-base text-[#564334] mb-8 leading-relaxed">
                  Nestled in the heart of the botanical gardens, The Orangery offers a luminous glasshouse setting perfect for a sun-drenched gathering. Expect a vibrant atmosphere where the scent of blooming citrus fills the air.
                </p>
                <ul className="space-y-6 font-body-citrus">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#ff8c00]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="w-5 h-5 text-[#904d00]" />
                    </div>
                    <div>
                      <h4 className="font-mono-citrus text-xs text-[#1a1c19] uppercase tracking-wider mb-1 font-bold">
                        Location
                      </h4>
                      <p className="text-[#564334] text-sm">
                        123 Sunlit Avenue, The Botanical Gardens
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#69fd5d]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Calendar className="w-5 h-5 text-[#006e0a]" />
                    </div>
                    <div>
                      <h4 className="font-mono-citrus text-xs text-[#1a1c19] uppercase tracking-wider mb-1 font-bold">
                        Date &amp; Time
                      </h4>
                      <p className="text-[#564334] text-sm">
                        Saturday, August 15th • 10:30 AM
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#b2a997]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Car className="w-5 h-5 text-[#655e4e]" />
                    </div>
                    <div>
                      <h4 className="font-mono-citrus text-xs text-[#1a1c19] uppercase tracking-wider mb-1 font-bold">
                        Parking
                      </h4>
                      <p className="text-[#564334] text-sm">
                        Complimentary valet parking is available at the East Gate entrance.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* RSVP Form */}
        <section className="max-w-3xl mx-auto bg-[#fafaf4] p-8 md:p-12 rounded-3xl border border-[#904d00]/20 shadow-md my-12" id="rsvp">
          <RsvpSection partnerOne={celebrantName} partnerTwo="" />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#e3e3de]/50 backdrop-blur-sm w-full py-12 border-t border-[#ddc1ae]/30 flex flex-col items-center justify-center gap-4 px-6 text-center relative overflow-hidden">
        <div className="font-title-citrus text-2xl font-bold text-[#904d00]">
          {brandName}
        </div>
        <div className="flex gap-6 font-mono-citrus text-xs text-[#564334] uppercase">
          <a href="#hero" className="hover:text-[#006e0a] transition-colors">
            Home
          </a>
          <a href="#timeline" className="hover:text-[#006e0a] transition-colors">
            Itinerary
          </a>
          <a href="#gallery" className="hover:text-[#006e0a] transition-colors">
            Gallery
          </a>
        </div>
        <p className="text-[#006e0a] font-mono-citrus text-xs mt-2">
          © {new Date().getFullYear()} {celebrantName}'s Citrus Summer. Savor the sunshine responsibly.
        </p>
      </footer>
    </div>
  );
}
