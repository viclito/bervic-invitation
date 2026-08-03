"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, PlayCircle, MapPin, Gift, Sparkles } from "lucide-react";

export default function EclecticChicMasterpieceInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Celebrant Name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const brandName = "Celebration";

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(
      props.weddingDate || "2026-09-20T17:00:00"
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

  // Gallery items matching exact Stitch screen c2a28195b90246c19cc930f204e0c9ed
  const galleryList =
    props.galleryImages && props.galleryImages.length >= 4
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdKXCRxcIDBXoKSebaIZlcxJBDX_tkJeyzsH6j6gN1MVrqkV9Hl4c7t3PVD0H6LJPsV9MLQeR_quxN4vo7TO2fWB0LL4lwKKN7rFf6IkrAYqnli1m6hzJKFwysPogrgYC4PQZFXB9KLdcb7I5tnYtZ78GLO0dosXyL7fkd3CsZ5fb2V_J-LbqEiOgQU0YbPE43paxPBRwla3vp-7nCX-3fpsr4RCOLFxbPbg2kErJ_OBbO048x3kvQ",
            margin: "",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_g_bJbhH9dbAzj07IUxP5ec7aB_MMSmxmYPQ2UC0zkT3xQ7sXQaZe771wslYYs6ghlCwDcrW_hScK_eZhKnLNC3zh22hicVB2M1BA6VOvUCDRbhHzRMBtsSv788xvb4V0NR28MqSyDBTZoH_rdPElc70j0L1_6HHWO6TyJAa8lIYeIL--tMbX2gy0I3l39Y-EF8rgMHmrYcwv0uxGxk7Acj109_kf4xVUHnX0lHVIhsgolF9YXljm",
            margin: "mt-6 md:mt-10",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBH0-s4zXoSeI9Rf4iozsoeTrx6wvEOrJBEd-DhxoykTDkkmgiqRyIZFHGLXOn4e3Ue_iTQRZ12JwpkOJ3uVTo_ZAkmok3TKLJseHCUUOgXDQI3ZxyceQPlkhLP4vUMSLTOQ8sHxNygleqdo0owQWrS30bZ3iVEDU9D58ASsO3QJDZoiMKEwRsk8CA3kI4y7SCf4ttjCNMzT19cu1MTf4QSOOKWqJAMc-6vVpsvwtq9kCLEpL3U9tVl",
            margin: "",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCugwguA0QJJyPU9PriWc9GPniBIA16I4I3AoaDewf8ulmtXj63BNYpGl30FnibYVvw9yfvUjH-j-1blvMdr35wlkdfUmhRoH-oBzUHA9ZyUx9nB0nekF4LWYB5XxMG3HvP1nQwhukORE2k8J9TBUhdomfWxFmSku_Xik_KTxBRZ1kydFaQFDbl4ST1n4HDGDIQAZTcQGoV7muGQ3miphruYQIwqBuzpyCnAgf1AlVdjRryKJCUiNoQ",
            margin: "mt-6 md:mt-10",
          },
        ];

  // Chapters comic panel data
  const chaptersList = [
    {
      year: "1998",
      text: "The early drafts. Always a creator.",
      badgeBg: "bg-[#fcf9f8] text-[#94492c]",
      transform: "-skew-x-3 w-5/6",
      align: "justify-end",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBY4Ki58ZtLCaVVnfpQ4A94NrOkyp9g5oYyMGKRjpgv54O1m4GwpMcTsMqr9wU6lzrWdSbN2UyDBoJDrJlsqjMJSsOxS0eMtrN4ucz5pDZ_CVjUhIzn-o7HGQ0wd-tqPXKaLhSklMP35Zsv5S5jNc467d1UpFaYZ618snkeXeFJw6RrQ_Q0_bBkXfvRn-aexCl5P0nTDTCMX-_3rRXrjr-59QSocg0tBW4DdDblqLqx5_O-eQqhofZ",
    },
    {
      year: "2012",
      text: "Discovering the geometry of life.",
      badgeBg: "bg-[#94492c] text-white",
      transform: "skew-x-3 w-5/6 self-end",
      align: "justify-start",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrCSKm9xxHDBn1y5IsR8gOz-spSeNvCQr2I-yblJakb0IBzNwbueX3o-O6S8D_9Hsxui-5ZVTwPYbABxwK_p2YnprsBN15KM6gcliIL0bi_nhX8WEnV_Qb79Vf-3HPmSxGaRpsULdBBmaE4y7Z0qWInWU24jTfWfu9o2HNxDUP8q5GiCREgEq_hHpcgyMrto3B9CWvwlKrtB9w10T6pEmhD5MdbhV9aZE8fkz1V4UyEbl3k7EKJ-yl",
    },
    {
      year: "2024",
      text: "Mastering the craft.",
      badgeBg: "bg-[#ffdc76] text-[#785f00]",
      transform: "w-full text-center",
      align: "justify-center",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhWZ3obGcPLOm0hvM6IUON2VCnVzbkzpCosf2POa9Zb305guZax3T1WTtW05-yuuPfd9H0FAfcdoaOgK004PgN8m2pl788bWC6kiPCoCkunCEONGzuwPNjJ4qq3b6u3qH42fqQDCcje6EPajmoJZ2RctpT_wc3VbZUp-yUv5TOU6O-C_n9XonKtEZRBOdh1bFgpS2ByrQZlIyaSZifPodpQ0R_2nX9WJdtQ2OXn5xhzJh3Ubwosz6J",
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
            href="#story"
          >
            Our Story
          </a>
          <a
            className="hover:text-[#94492c] transition-colors"
            href="#chapters"
          >
            Chapters
          </a>
          <a
            className="hover:text-[#94492c] transition-colors"
            href="#gallery"
          >
            Gallery
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
          Gift Registry
        </a>
      </header>

      {/* Main Canvas Container */}
      <main className="max-w-[1280px] mx-auto px-6 md:px-10 pb-24 border-x border-[#7c766e]/30 blueprint-grid relative">
        {/* Hero Section */}
        <section className="relative min-h-[750px] flex flex-col md:flex-row items-center justify-center gap-12 border-b border-[#7c766e]/40 pb-16 pt-12">
          <div className="flex-1 flex flex-col items-start space-y-6 z-10">
            <div className="border border-[#1c1b1b] px-3 py-1 inline-block bg-[#fcf9f8]">
              <span className="font-sans-work text-xs text-[#1c1b1b] uppercase tracking-[0.2em] font-semibold">
                Est. 1994
              </span>
            </div>
            <h1 className="font-serif-caslon text-4xl md:text-6xl text-[#1c1b1b] leading-tight font-normal">
              {celebrantName}'s Grand Soirée
            </h1>
            <p className="font-mono-space text-base text-[#4b463f] max-w-md leading-relaxed">
              Join us for an eclectic celebration of thirty remarkable years. A curated evening of warmth, curiosity, and artisanal quality.
            </p>
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
            <div className="relative w-full h-full cloud-mask overflow-hidden border border-[#7c766e] bg-[#f0eded]">
              <img
                alt={`${celebrantName} Editorial Portrait`}
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBALjnlcLB5ZHG2lfteKyh3PuZVCTn8RWtH_XxucX6GvHv5VUFRosEdk81L1pJsr5slKlV5BFV-6jSGWND4QTj_d7jimD-PIjiHgcNtpqJqXvmCtS1LxMhUjAeL3BcVxR0UQQ3ShaZF8UuYJvUdiQ0d5HkM7dXeS9daiHM-T-jYV6YSXTGgzB4ofGkiJSicJo2OPFPCNCg0dSHub9DT4JHO3gyd67alU7RZkLzWxWGwSlGUNcp7YZbt"
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

        {/* The Curated Journey (Story Section) */}
        <section className="py-16 border-b border-[#7c766e]/40 relative" id="story">
          <h2 className="font-serif-caslon text-3xl md:text-4xl text-[#1c1b1b] mb-12 text-center md:text-left">
            The Curated Journey
          </h2>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 w-full relative group">
              <div className="border border-[#1c1b1b] bg-[#f0eded] p-2 absolute inset-0 transform translate-x-2 translate-y-2" />
              <div className="border border-[#1c1b1b] bg-[#fcf9f8] relative z-10 flex items-center justify-center h-64 md:h-96 overflow-hidden">
                <div className="absolute inset-0 bg-[#94492c]/10 group-hover:bg-[#94492c]/20 transition-colors" />
                <PlayCircle className="w-16 h-16 text-[#645d53] group-hover:text-[#94492c] transition-colors cursor-pointer relative z-20" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="font-mono-space text-base md:text-lg text-[#1c1b1b] leading-relaxed">
                Every detail of the past thirty years has been meticulously gathered, like artifacts in a personal museum. From the quiet mornings in the studio to the vibrant evenings shared with kindred spirits.
              </p>
              <p className="font-mono-space text-sm text-[#4b463f] leading-relaxed">
                This celebration is more than a milestone; it is an exhibition of growth, creativity, and the enduring bonds that have shaped {celebrantName}'s narrative.
              </p>
            </div>
          </div>
        </section>

        {/* Chapters of Evelyn (Comic Panels) */}
        <section className="py-16 border-b border-[#7c766e]/40" id="chapters">
          <h2 className="font-serif-caslon text-3xl md:text-4xl text-[#1c1b1b] mb-12">
            Chapters of {celebrantName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-[#1c1b1b] bg-[#fcf9f8]">
            {chaptersList.map((panel, idx) => (
              <div
                key={idx}
                className={`border border-[#1c1b1b] p-4 relative group overflow-hidden bg-[#f4f4ee] min-h-[320px] flex flex-col ${panel.align}`}
              >
                <div className="absolute inset-0 z-0">
                  <img
                    alt={`Chapter ${panel.year}`}
                    className="w-full h-full object-cover filter grayscale opacity-60 group-hover:grayscale-0 transition-all duration-500"
                    src={panel.img}
                  />
                </div>
                <div
                  className={`relative z-10 border border-[#1c1b1b] p-4 ${panel.transform} ${panel.badgeBg}`}
                >
                  <span className="font-sans-work text-xs uppercase tracking-widest block mb-1 font-bold">
                    {panel.year}
                  </span>
                  <p className="font-mono-space text-xs leading-normal">
                    {panel.text}
                  </p>
                </div>
              </div>
            ))}
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
            <div className="flex-1 w-full">
              <div className="border border-[#7c766e] p-2 bg-[#fcf9f8]">
                <div className="w-full h-64 md:h-80 border border-[#7c766e]/40 bg-[#f4f4ee] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-[#e5e2e1] transition-colors">
                  <div className="absolute inset-0 blueprint-grid opacity-30" />
                  <MapPin className="w-10 h-10 text-[#4b463f] mb-2 relative z-10 group-hover:text-[#94492c] transition-colors" />
                  <span className="font-sans-work text-xs uppercase tracking-[0.2em] font-semibold relative z-10 group-hover:text-[#94492c] transition-colors">
                    View Directions
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h3 className="font-serif-caslon text-3xl text-[#1c1b1b] mb-2">
                  The Artisan Foundry
                </h3>
                <p className="font-mono-space text-xs text-[#4b463f] leading-relaxed">
                  123 Creative District Avenue<br />
                  Metropolis, NY 10001
                </p>
              </div>
              <p className="font-mono-space text-sm text-[#1c1b1b] leading-relaxed">
                An industrial-chic venue with exposed brick, terracotta accents, and ample natural light. Valet parking provided.
              </p>
              <button className="border-b-2 border-[#94492c] font-sans-work text-xs uppercase tracking-[0.2em] font-semibold text-[#94492c] hover:text-[#735c00] transition-colors pb-1">
                Open in Maps
              </button>
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
