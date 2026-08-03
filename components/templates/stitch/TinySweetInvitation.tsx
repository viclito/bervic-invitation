"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, PartyPopper, Heart, PlayCircle, Cake, Sparkles, MapPin, ExternalLink, Smile } from "lucide-react";

export default function TinySweetInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Celebrant Name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const brandName = "TinyOne";

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(
      props.weddingDate || "2026-10-15T14:00:00"
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

  // Gallery items matching exact Stitch screen a4e94bff76894b0fad47837a9a571cc1
  const galleryList =
    props.galleryImages && props.galleryImages.length >= 3
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWm7Yc6PDowZdcXKTMz7D0wfPgnJ7vM_k9Z1MP_SH3XPt7edMg_qOj_A4CsY1y8vWssWIarJw-Z1Wilze7httykt5Fo_pD94Fnhnbka5Ko-moJS8zXl7q6ZVwaXbNPftr8ydvE0j4yu8Cf70ZqZTGSrmM4ovVOkgFD9wiZnZJBF9Y8PeN7q39TZCBtraUSvcE9GSB_C4VA_GvQQUGO80g9iDd1Ak-YgqWX3olqK4izL-JFOpnE75Yi",
            caption: "First Smiles - 2 Months",
            rotate: "-rotate-3",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOFKB8R9Y6Ss2l1cC15_HHbtsndt4Tg8TsXksD2xVl_jagbI8JRqWU7MZS8J-gurq4N-vrqKR800k3-0cqCqn2J2V_zQ3eQwjmA8bS9mmNOU7nXjbvyR-wvhmxX2ARQYNcJr2zapC7wwGieGk0YGVHqMwbmNBvRkBC5IjCYXmVlTWHI5T0VqpYqsS5Xaq5N2oLj_jgiCUPr2AT2u54JjQjyT_SJgmhoQSu9XHmmBwpml5JYRhKguVW",
            caption: "On the Move - 7 Months",
            rotate: "rotate-2 md:mt-8",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeHiZdA5QfYEQAh-5pLXHm8wXeJb4eWT2jt9cry8wWzCP_LNyFoG53BLpBH-MIoNEWoVog4WKzQLpqAAI7V01H8_nzOH77HYf6gavyQtD_fAXkmoQocsvirTlKsQ7WpMSHYtfeCo-fgSJ6Iu_XypBA_7wS5ngfBqsYJXg_G4WSODsyjRhx_236TGKFMF3cStQu_Y3GfxbLMLmUPCvuQKmdZ8RhhVG5nTTHviyELB2VToJQvcBOXSHc",
            caption: "Bath Time Fun - 10 Months",
            rotate: "-rotate-2",
          },
        ];

  // Big Day timeline items
  const timelineSteps =
    props.events && props.events.length > 0
      ? props.events
      : [
          {
            time: "2:00 PM",
            title: "Arrival & Sweet Treats",
            desc: "Welcome! Grab a drink and let the kids explore the play area.",
            icon: Smile,
            bgColor: "bg-[#a7d8de]",
            textColor: "text-[#2f5f65]",
          },
          {
            time: "3:00 PM",
            title: "Games & Magic",
            desc: "Time for giggles! We have a special entertainer joining us.",
            icon: Sparkles,
            bgColor: "bg-[#ffd4e7]",
            textColor: "text-[#7a5969]",
          },
          {
            time: "4:00 PM",
            title: "Cake Cutting",
            desc: `Sing Happy Birthday and watch ${celebrantName} smash her first cake!`,
            icon: Cake,
            bgColor: "bg-[#dbd195]",
            textColor: "text-[#605929]",
          },
        ];

  return (
    <div className="bg-[#f8f9ff] text-[#151c26] font-sans antialiased overflow-x-hidden relative selection:bg-[#36666b]/20 selection:text-[#36666b] min-h-screen">
      {/* Quicksand Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Tiny & Sweet CSS Engine */}
      <style>{`
        body {
          font-family: 'Quicksand', sans-serif;
        }

        .clip-cloud {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          transition: all 8s ease-in-out;
          animation: morphCloud 8s ease-in-out infinite both alternate;
        }
        @keyframes morphCloud {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }

        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-soft {
          animation: bounceSoft 2s infinite cubic-bezier(0.28, 0.84, 0.42, 1);
        }
        .animate-bounce-soft-delay-1 {
          animation: bounceSoft 2s infinite cubic-bezier(0.28, 0.84, 0.42, 1) 0.2s;
        }
        .animate-bounce-soft-delay-2 {
          animation: bounceSoft 2s infinite cubic-bezier(0.28, 0.84, 0.42, 1) 0.4s;
        }

        .soft-shadow {
          box-shadow: 0px 10px 30px rgba(167, 216, 222, 0.2);
        }

        .polaroid {
          background: white;
          padding: 12px 12px 40px 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .polaroid:hover {
          transform: scale(1.05) rotate(0deg) !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 10;
        }

        .wavy-divider {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }
        .wavy-divider svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 50px;
        }
        .wavy-divider .shape-fill {
          fill: #f8f9ff;
        }

        .wavy-divider-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          transform: rotate(180deg);
        }
        .wavy-divider-bottom svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 50px;
        }
        .wavy-divider-bottom .shape-fill {
          fill: #f8f9ff;
        }
      `}</style>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday, 15th October 2026 at 2:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="tiny-sweet"
      />

      {/* Header */}
      <header className="bg-[#f8f9ff] text-[#36666b] font-serif w-full top-0 sticky z-50 bg-[#eff3ff] shadow-[0px_10px_30px_rgba(167,216,222,0.2)]">
        <div className="flex justify-between items-center px-6 md:px-16 py-4 max-w-[1140px] mx-auto">
          <div className="text-3xl md:text-4xl text-[#36666b] font-bold tracking-tight">
            {brandName}
          </div>

          <nav className="hidden md:flex space-x-8 font-sans font-bold text-sm">
            <a
              className="text-[#36666b] border-b-4 border-[#36666b] pb-1 hover:scale-105 transition-transform"
              href="#rsvp"
            >
              RSVP
            </a>
            <a
              className="text-[#404849] hover:scale-105 hover:text-[#36666b] transition-colors"
              href="#gallery"
            >
              Gallery
            </a>
            <a
              className="text-[#404849] hover:scale-105 hover:text-[#36666b] transition-colors"
              href="#our-story"
            >
              Our Story
            </a>
          </nav>

          <a
            className="hidden md:inline-flex items-center justify-center bg-[#36666b] text-white font-bold text-sm px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform soft-shadow"
            href="#rsvp"
          >
            RSVP Now
          </a>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#36666b] p-2"
          >
            {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#f8f9ff] border-t border-[#c0c8c9]/30 px-6 py-4 flex flex-col gap-3 text-center font-sans font-bold text-sm">
            <a
              href="#our-story"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#404849] py-2 border-b border-[#e7eefd]"
            >
              Our Story
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#404849] py-2 border-b border-[#e7eefd]"
            >
              Gallery
            </a>
            <a
              href="#rsvp"
              onClick={() => setMobileNavOpen(false)}
              className="bg-[#36666b] text-white py-2.5 rounded-full font-bold uppercase tracking-wider mt-2"
            >
              RSVP Now
            </a>
          </div>
        )}
      </header>

      {/* Main Content Canvas */}
      <main className="w-full">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 px-6 md:px-16 max-w-[1140px] mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#eff3ff] to-[#ffd4e7] opacity-50 rounded-b-[4rem] -z-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
              <span className="inline-flex items-center px-4 py-2 bg-[#dbd195] text-[#605929] text-xs font-bold rounded-full uppercase tracking-wider soft-shadow">
                <PartyPopper className="w-4 h-4 mr-2 text-[#605929]" />
                Join the Party!
              </span>
              <h1 className="text-4xl md:text-6xl text-[#36666b] font-bold leading-tight font-serif">
                {celebrantName} is turning <br />
                <span className="text-[#755565]">One!</span>
              </h1>
              <p className="text-base md:text-lg text-[#404849] max-w-md leading-relaxed font-sans">
                Our little sweetie is celebrating her first year of wonder. We can't wait to share this magical day with you.
              </p>
              <a
                className="inline-flex items-center justify-center bg-[#755565] text-white text-base font-bold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform soft-shadow mt-4 gap-2"
                href="#rsvp"
              >
                RSVP Now
                <Heart className="w-5 h-5 fill-current text-white" />
              </a>
            </div>

            <div className="relative flex justify-center items-center p-8">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-[#a7d8de] clip-cloud scale-105 opacity-50 blur-lg"></div>
                <img
                  alt={celebrantName}
                  className="w-full h-full object-cover clip-cloud soft-shadow border-4 border-white"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpe710EgUA8jejL2m8yFPevpulHGGvyWeCBoXiLn8mjGTVP8cAzCiDPY6XOno0S5eARTmpX9rWsTv5-RG8X6g7nOYP_vVeHjwmBCJEqw7f34Yt1L0RonhUKuSkC-wHb70C-m77lvUsJoiG479dqkD8lPJVqxSMKlpieOyrxrM_mudqSS1uqfPKQmptWNn2FNy6HQn9E96gW4w_FUXTlMUuajKHSnOG6qkjHPbFas87r-tVUGrYXK-A"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-16 px-6 md:px-16">
          <div className="max-w-[1140px] mx-auto text-center">
            <h2 className="text-2xl md:text-3xl text-[#36666b] mb-12 font-bold font-serif">
              The Celebration Begins In...
            </h2>
            <div className="flex justify-center items-center gap-6 md:gap-12">
              <div className="flex flex-col items-center animate-bounce-soft">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#a7d8de] flex items-center justify-center soft-shadow mb-4 border-4 border-white">
                  <span className="text-3xl md:text-5xl text-[#2f5f65] font-bold font-serif">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs md:text-sm text-[#404849] uppercase tracking-wider font-bold">
                  Days
                </span>
              </div>
              <span className="text-3xl md:text-5xl text-[#c0c8c9] -mt-10 font-bold">:</span>
              <div className="flex flex-col items-center animate-bounce-soft-delay-1">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#ffd4e7] flex items-center justify-center soft-shadow mb-4 border-4 border-white">
                  <span className="text-3xl md:text-5xl text-[#7a5969] font-bold font-serif">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs md:text-sm text-[#404849] uppercase tracking-wider font-bold">
                  Hours
                </span>
              </div>
              <span className="text-3xl md:text-5xl text-[#c0c8c9] -mt-10 hidden md:block font-bold">:</span>
              <div className="flex flex-col items-center animate-bounce-soft-delay-2 hidden md:flex">
                <div className="w-28 h-28 rounded-full bg-[#dbd195] flex items-center justify-center soft-shadow mb-4 border-4 border-white">
                  <span className="text-5xl text-[#605929] font-bold font-serif">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-sm text-[#404849] uppercase tracking-wider font-bold">
                  Mins
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Highlight Banner */}
        <section className="relative py-24 bg-gradient-to-r from-[#a7d8de] via-[#e7eefd] to-[#ffd4e7] overflow-hidden">
          <div className="wavy-divider">
            <svg preserveAspectRatio="none" viewBox="0 0 1200 120">
              <path
                className="shape-fill"
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              ></path>
            </svg>
          </div>
          <div className="max-w-[1140px] mx-auto px-6 md:px-16 text-center relative z-10">
            <Heart className="w-16 h-16 text-[#755565] mx-auto mb-6 opacity-80 fill-current" />
            <h2 className="font-serif text-3xl md:text-5xl text-[#36666b] italic max-w-3xl mx-auto leading-tight font-bold">
              "One tiny year, a lifetime of love."
            </h2>
          </div>
          <div className="wavy-divider-bottom">
            <svg preserveAspectRatio="none" viewBox="0 0 1200 120">
              <path
                className="shape-fill"
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 px-6 md:px-16 bg-[#f8f9ff]" id="our-story">
          <div className="max-w-[1140px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="aspect-[4/3] bg-[#dce3f1] clip-cloud relative flex items-center justify-center soft-shadow border-4 border-white group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#a7d8de] to-[#ffd4e7] opacity-60"></div>
                  <PlayCircle className="w-16 h-16 text-white z-10 group-hover:scale-110 transition-transform cursor-pointer drop-shadow-md" />
                  <span className="absolute bottom-6 font-serif text-white z-10 drop-shadow-md text-lg font-bold">
                    Our First Year Video
                  </span>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-3xl md:text-5xl text-[#36666b] font-bold font-serif">
                  {celebrantName}'s First Year
                </h2>
                <p className="text-base md:text-lg text-[#404849] leading-relaxed">
                  From her first tiny smile to her wobbly first steps, this past year has been a beautiful whirlwind. We've loved watching her personality blossom.
                </p>
                <p className="text-sm md:text-base text-[#404849] leading-relaxed">
                  She loves peek-a-boo, mashed sweet potatoes, and her favorite plush bunny. Join us as we look back on 365 days of pure joy and wonder!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Celebration Timeline Section */}
        <section className="py-24 bg-[#eff3ff] px-6 md:px-16">
          <div className="max-w-[1140px] mx-auto">
            <h2 className="text-3xl md:text-5xl text-[#36666b] text-center mb-16 font-bold font-serif">
              The Big Day
            </h2>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#c0c8c9] rounded-full hidden md:block"></div>
              <div className="space-y-12">
                {timelineSteps.map((step: any, idx: number) => {
                  const IconComp = step.icon || Smile;
                  const isEven = idx % 2 === 1;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row items-center justify-between w-full relative"
                    >
                      {!isEven ? (
                        <div className="w-full md:w-5/12 text-center md:text-right mb-4 md:mb-0">
                          <h3 className="text-xl md:text-2xl font-bold font-serif text-[#755565]">
                            {step.time}
                          </h3>
                          <p className="text-base text-[#404849] font-bold">
                            {step.title}
                          </p>
                        </div>
                      ) : (
                        <div className="w-full md:w-5/12 bg-white p-6 rounded-2xl soft-shadow text-center md:text-right order-3 md:order-1">
                          <p className="text-base text-[#151c26] leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      )}

                      <div
                        className={`absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 ${
                          step.bgColor || "bg-[#a7d8de]"
                        } rounded-full border-4 border-white z-10 soft-shadow hidden md:flex ${
                          isEven ? "order-2" : ""
                        }`}
                      >
                        {typeof IconComp === "string" ? (
                          <span className="text-xl">{IconComp}</span>
                        ) : typeof IconComp === "function" || typeof IconComp === "object" ? (
                          <IconComp className={`w-5 h-5 ${step.textColor || "text-[#2f5f65]"}`} />
                        ) : (
                          <Smile className={`w-5 h-5 ${step.textColor || "text-[#2f5f65]"}`} />
                        )}
                      </div>

                      {isEven ? (
                        <div className="w-full md:w-5/12 text-center md:text-left mb-4 md:mb-0 order-1 md:order-3">
                          <h3 className="text-xl md:text-2xl font-bold font-serif text-[#36666b]">
                            {step.time}
                          </h3>
                          <p className="text-base text-[#404849] font-bold">
                            {step.title}
                          </p>
                        </div>
                      ) : (
                        <div className="w-full md:w-5/12 bg-white p-6 rounded-2xl soft-shadow text-center md:text-left">
                          <p className="text-base text-[#151c26] leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Party HQ Section */}
        <section className="py-24 px-6 md:px-16 bg-[#f8f9ff]">
          <div className="max-w-[1140px] mx-auto">
            <div className="bg-[#dce3f1] rounded-[3rem] p-8 md:p-16 soft-shadow relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#a7d8de] rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#ffd4e7] rounded-full opacity-50 blur-2xl"></div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-center md:text-left">
                  <MapPin className="w-12 h-12 text-[#36666b] mb-2 mx-auto md:mx-0" />
                  <h2 className="text-3xl md:text-4xl text-[#36666b] font-bold font-serif">
                    Party HQ
                  </h2>
                  <div>
                    <h3 className="text-xl font-bold text-[#151c26] mb-2 font-serif">
                      Sunshine Park Pavilion
                    </h3>
                    <p className="text-base text-[#404849] leading-relaxed">
                      123 Meadow Lane<br />
                      Sunnyville, CA 90210
                    </p>
                  </div>
                  <p className="text-sm text-[#404849] leading-relaxed">
                    Parking is available near the south entrance. Look for the big bundle of pink and teal balloons!
                  </p>
                  <a
                    className="inline-flex items-center justify-center bg-[#36666b] text-white font-bold text-sm px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-transform soft-shadow mt-4 gap-2"
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get Directions
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="w-full h-80 bg-[#dce3f1] rounded-[2rem] border-4 border-white soft-shadow flex items-center justify-center">
                  <div className="text-center text-[#70797a]">
                    <MapPin className="w-10 h-10 mb-2 mx-auto" />
                    <p className="font-bold text-sm">Google Map Details</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 bg-[#e7eefd] px-6 md:px-16" id="gallery">
          <div className="max-w-[1140px] mx-auto text-center">
            <h2 className="text-3xl md:text-5xl text-[#36666b] mb-4 font-bold font-serif">
              Sweet Moments
            </h2>
            <p className="text-base text-[#404849] mb-16 max-w-2xl mx-auto leading-relaxed">
              A peek into {celebrantName}'s world of giggles and snuggles.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 px-4 md:px-8">
              {galleryList.map((item: any, i: number) => {
                const url = typeof item === "string" ? item : item.url;
                const caption =
                  typeof item === "string"
                    ? `Sweet Moment #${i + 1}`
                    : item.caption;
                const rotate =
                  typeof item === "string"
                    ? i === 0
                      ? "-rotate-3"
                      : i === 1
                      ? "rotate-2 md:mt-8"
                      : "-rotate-2"
                    : item.rotate || "";

                return (
                  <div key={i} className={`polaroid ${rotate} cursor-pointer`}>
                    <div className="bg-[#dce3f1] aspect-square mb-4 overflow-hidden rounded-xs">
                      <img
                        alt={caption}
                        className="w-full h-full object-cover"
                        src={url}
                      />
                    </div>
                    <p className="text-xs text-[#404849] italic font-bold">
                      {caption}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RSVP Form Section */}
        <section
          className="py-24 px-6 md:px-16 bg-[#dce3f1] rounded-t-[4rem] relative overflow-hidden"
          id="rsvp"
        >
          <div className="max-w-3xl mx-auto relative z-10 bg-[#f8f9ff] rounded-2xl p-8 md:p-12 soft-shadow border border-[#dce3f1]">
            <RsvpSection partnerOne={celebrantName} partnerTwo="" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#ffd4e7] text-[#7a5969] font-sans font-bold text-xs w-full py-12 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="text-xl font-serif text-[#755565] font-bold">
          {brandName}
        </div>
        <div className="flex gap-6 uppercase">
          <a href="#our-story" className="hover:underline transition-all">
            Our Story
          </a>
          <a href="#gallery" className="hover:underline transition-all">
            Gallery
          </a>
          <a href="#rsvp" className="hover:underline transition-all">
            RSVP
          </a>
        </div>
        <div>
          © {new Date().getFullYear()} Tiny & Sweet Birthday Celebrations.
        </div>
      </footer>
    </div>
  );
}
