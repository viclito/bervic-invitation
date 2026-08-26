"use client";

import { getWeddingTargetDate, formatAgeOrdinal } from "@/lib/dateUtils";
import { useState, useEffect } from "react";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, GlassWater, Utensils, Music, MapPin, Car, Info, Star, Camera, PartyPopper } from "lucide-react";

export default function ConfettiCarnivalClassicInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Celebrant name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const celebrationHeader = `${celebrantName}'s Celebration`;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 12,
    minutes: 45,
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

  // Gallery items matching exact Stitch screen 2dfee62a4912475e8f29cd027b002cba
  const galleryList =
    props.galleryImages && props.galleryImages.filter(img => Boolean(Boolean(img && String(img).trim()))).length > 0
      ? props.galleryImages
      : [
          {
            url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80",
            caption: "The Early Days",
            rotate: "-rotate-6",
          },
          {
            url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80",
            caption: "Wild Adventures",
            rotate: "rotate-3 mt-8",
          },
          {
            url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80",
            caption: "Unforgettable",
            rotate: "-rotate-2",
          },
        ];

  // Timeline items matching exact Stitch screen 2dfee62a4912475e8f29cd027b002cba
  const timelineSteps =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay
      : [
          {
            time: "6:00 PM",
            title: "Welcome Drinks",
            desc: "Kick off the evening with signature cocktails and carnival-themed appetizers.",
            icon: GlassWater,
            pinBg: "bg-[#ffff00]",
            timeColor: "text-[#ff66b2]",
          },
          {
            time: "7:30 PM",
            title: "Dinner & Speeches",
            desc: "Enjoy a feast fit for a celebration, accompanied by heartfelt (and funny) stories.",
            icon: Utensils,
            pinBg: "bg-[#00ffff]",
            timeColor: "text-[#00ffff]",
          },
          {
            time: "9:00 PM",
            title: "Dancing & Games",
            desc: "The dance floor opens, and the carnival games begin! Prizes to be won.",
            icon: Music,
            pinBg: "bg-[#ff66b2]",
            timeColor: "text-[#ffff00]",
          },
        ];

  // Venue location matching exact Stitch screen 2dfee62a4912475e8f29cd027b002cba
  const mainVenue =
    props.locations && props.locations[0]
      ? props.locations[0]
      : {
          name: "The Grand Pavilion",
          address: "123 Celebration Avenue, Festivity City, FC 90210",
          mapLink: "https://maps.google.com",
        };

  return (
    <div className="bg-[#fff9eb] text-[#1b1c1c] font-serif antialiased overflow-x-hidden relative selection:bg-[#ff66b2] selection:text-black min-h-screen">
      {/* Material Symbols Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Pop-Art & Confetti Engine */}
      <style>{`
        .confetti-piece {
          position: absolute;
          width: 12px;
          height: 24px;
          opacity: 0;
          border: 2px solid #000;
          animation: fall 3s linear infinite;
        }
        @keyframes fall {
          0% { opacity: 1; top: -10%; transform: translateX(0) rotate(0deg); }
          100% { opacity: 0; top: 110%; transform: translateX(40px) rotate(720deg); }
        }

        .pop-border {
          border: 4px solid #000;
          box-shadow: 4px 4px 0px #000;
        }
        .hover-pop {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-pop:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px #000;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #5f5f00 0%, #ffff00 50%, #5f5f00 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }

        .polaroid {
          background: #fff;
          padding: 10px 10px 40px 10px;
          border: 4px solid #000;
          box-shadow: 6px 6px 0px #000;
          transition: transform 0.3s ease;
        }
        .polaroid:hover {
          transform: scale(1.05) rotate(0deg) !important;
          z-index: 10;
        }
      `}</style>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 6:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="cheerful-confetti-carnival-v1"
      />

      {/* Top Navigation Bar */}
      <nav className="bg-[#fff9eb]/90 border-b-4 border-black backdrop-blur-md fixed top-0 w-full z-50 transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-20">
          <div className="text-xl md:text-2xl text-[#5f5f00] shimmer-text italic font-bold">
            {celebrationHeader}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center font-sans text-sm font-bold uppercase tracking-wider">
            <a
              className="hover:text-[#ff66b2] transition-colors"
              href="#about"
            >
              About
            </a>
            <a
              className="hover:text-[#ff66b2] transition-colors"
              href="#timeline"
            >
              Timeline
            </a>
            <a
              className="hover:text-[#ff66b2] transition-colors"
              href="#venue"
            >
              Venue
            </a>
            <a
              className="hover:text-[#ff66b2] transition-colors"
              href="#gallery"
            >
              Gallery
            </a>
            <a
              className="hover:text-[#ff66b2] transition-colors"
              href="#rsvp"
            >
              RSVP
            </a>
          </div>

          {/* RSVP Button */}
          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#ffff00] text-black font-sans text-xs font-bold uppercase tracking-widest px-6 py-3 pop-border hover-pop"
          >
            RSVP Now
          </a>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-black p-2"
          >
            {mobileNavOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#fff9eb] border-t-4 border-black px-6 py-6 flex flex-col gap-4 text-center font-sans">
            <a
              href="#about"
              onClick={() => setMobileNavOpen(false)}
              className="text-black font-bold text-lg py-2 border-b-2 border-black/20"
            >
              About
            </a>
            <a
              href="#timeline"
              onClick={() => setMobileNavOpen(false)}
              className="text-black font-bold text-lg py-2 border-b-2 border-black/20"
            >
              Timeline
            </a>
            <a
              href="#venue"
              onClick={() => setMobileNavOpen(false)}
              className="text-black font-bold text-lg py-2 border-b-2 border-black/20"
            >
              Venue
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileNavOpen(false)}
              className="text-black font-bold text-lg py-2 border-b-2 border-black/20"
            >
              Gallery
            </a>
            <a
              href="#rsvp"
              onClick={() => setMobileNavOpen(false)}
              className="bg-[#ffff00] text-black py-3 text-sm font-bold uppercase tracking-wider pop-border"
            >
              RSVP Now
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header
        className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#00ffff]/20 border-b-4 border-black"
        id="hero"
      >
        {/* Animated Confetti Particles */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${(i * 3) % 100}vw`,
                animationDelay: `${(i * 0.2) % 3}s`,
                animationDuration: `${2.5 + ((i * 0.3) % 2)}s`,
                backgroundColor:
                  i % 4 === 0
                    ? "#ff66b2"
                    : i % 4 === 1
                    ? "#00ffff"
                    : i % 4 === 2
                    ? "#ffff00"
                    : "#ffffff",
                width: i % 2 === 0 ? "12px" : "16px",
                height: i % 2 === 0 ? "24px" : "18px",
              }}
            />
          ))}
        </div>

        <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-20 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-serif text-black mb-6 shimmer-text drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] leading-tight">
            Join the Celebration
          </h1>
          <p className="text-base md:text-lg text-black font-medium max-w-2xl mx-auto mb-10 bg-white/80 p-6 pop-border leading-relaxed">
            A joyous occasion marking a special milestone. We invite you to share in the laughter, memories, and a truly unforgettable night.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <a
              href="#rsvp"
              className="bg-[#ff66b2] text-black font-bold font-sans text-xs md:text-sm px-8 py-4 uppercase tracking-widest pop-border hover-pop inline-block"
            >
              Join the Party
            </a>
            <a
              href="#about"
              className="bg-white text-black font-bold font-sans text-xs md:text-sm px-8 py-4 uppercase tracking-widest pop-border hover-pop inline-block"
            >
              View Details
            </a>
          </div>
        </div>
      </header>

      {/* Wave Divider */}
      <div className="relative w-full overflow-hidden leading-none bg-[#fff4d9]">
        <svg
          className="relative block w-full h-[40px] text-[#fff9eb]"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>

      {/* Countdown Section */}
      <section className="py-24 bg-[#fff4d9]" id="countdown">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center">
          <h2 className="text-3xl md:text-4xl text-black mb-12 shimmer-text font-bold">
            The Countdown Begins
          </h2>
          <div className="flex justify-center gap-6 md:gap-12 flex-wrap">
            {/* Days */}
            <div className="bg-[#ffff00] rounded-full w-32 h-32 flex flex-col items-center justify-center pop-border hover-pop">
              <div className="text-3xl md:text-4xl text-black font-bold">
                {String(timeLeft.days).padStart(2, "0")}
              </div>
              <div className="text-xs font-sans text-black uppercase tracking-wider font-bold mt-1">
                Days
              </div>
            </div>

            {/* Hours */}
            <div className="bg-[#00ffff] rounded-full w-32 h-32 flex flex-col items-center justify-center pop-border hover-pop">
              <div className="text-3xl md:text-4xl text-black font-bold">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="text-xs font-sans text-black uppercase tracking-wider font-bold mt-1">
                Hours
              </div>
            </div>

            {/* Mins */}
            <div className="bg-[#ff66b2] rounded-full w-32 h-32 flex flex-col items-center justify-center pop-border hover-pop">
              <div className="text-3xl md:text-4xl text-black font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="text-xs font-sans text-black uppercase tracking-wider font-bold mt-1">
                Mins
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-[#fff9eb] border-y-4 border-black" id="about">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Pop Box */}
            <div className="col-span-1 md:col-span-5 relative">
              <div className="aspect-square bg-[#ffff00] pop-border w-full h-full absolute -top-4 -left-4 z-0 pointer-events-none"></div>
              <div className="aspect-square bg-white pop-border relative z-10 flex items-center justify-center overflow-hidden">
                <PartyPopper className="w-32 h-32 text-[#ff66b2]" />
              </div>
            </div>

            {/* Right Narrative */}
            <div className="col-span-1 md:col-span-6 md:col-start-7 space-y-6">
              <h2 className="text-3xl md:text-5xl text-black shimmer-text font-bold">
                Our Story
              </h2>
              <p className="text-base md:text-lg text-black bg-[#00ffff]/20 p-6 pop-border leading-relaxed">
                Every great party has a story behind it. {celebrantName}’s journey has been filled with bright colors, loud laughs, and unforgettable moments. This night is a tribute to all the wild adventures, the quiet triumphs, and the amazing people who have been there along the way.
              </p>
              <p className="text-base md:text-lg text-black leading-relaxed">
                Expect a night where nostalgia meets the present, wrapped in a confetti-filled carnival of joy. We can't wait to make more memories with you!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-[#fff4d9]" id="timeline">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <h2 className="text-3xl md:text-5xl text-center text-black mb-16 shimmer-text font-bold">
            The Evening's Flow
          </h2>

          <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-black">
            {timelineSteps.map((step, idx) => {
              const isEven = idx % 2 === 1;
              const iconProp = (step as any).icon;
              const isComponent = typeof iconProp === "function" || typeof iconProp === "object";
              const pinBg = (step as any).pinBg || "bg-[#ffff00]";
              const timeColor = (step as any).timeColor || "text-[#ff66b2]";

              return (
                <div
                  key={idx}
                  className={`relative flex items-center justify-between md:justify-normal ${
                    isEven ? "md:flex-row-reverse" : ""
                  } group`}
                >
                  {/* Pin Circle Icon */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-black ${pinBg} text-black shrink-0 md:order-1 ${
                      isEven ? "md:-translate-x-1/2" : "md:translate-x-1/2"
                    } shadow-[2px_2px_0px_#000] z-10`}
                  >
                    {isComponent ? (
                      (() => {
                        const IconComp = iconProp;
                        return <IconComp className="w-4 h-4" />;
                      })()
                    ) : (
                      <span className="text-base leading-none">
                        {typeof iconProp === "string" ? iconProp : "✨"}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 pop-border">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                      <h3 className="text-xl font-bold text-black font-sans">
                        {step.title}
                      </h3>
                      <span
                        className={`font-sans text-xs font-bold ${timeColor} bg-black px-2.5 py-1 inline-block shrink-0`}
                      >
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm text-black font-sans leading-relaxed">
                      {"desc" in step
                        ? (step as any).desc
                        : "Enjoy the party!"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Highlight Banner */}
      <section className="py-16 bg-[#ff66b2] border-y-4 border-black">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center">
          <h2 className="text-3xl md:text-5xl text-black uppercase tracking-widest font-black drop-shadow-[3px_3px_0px_#fff]">
            Don't Miss The Magic!
          </h2>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-24 bg-[#fff9eb]" id="venue">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <h2 className="text-3xl md:text-5xl text-center text-black mb-16 shimmer-text font-bold">
            The Venue
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Info Card */}
            <div className="bg-white p-8 pop-border space-y-6">
              <h3 className="text-2xl font-bold text-black font-sans">
                {mainVenue.name || "The Grand Pavilion"}
              </h3>
              <p className="text-base text-black leading-relaxed font-sans">
                {mainVenue.address}
              </p>
              <div className="space-y-4 text-black font-sans text-sm">
                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-[#ff66b2] shrink-0 mt-0.5" />
                  <p>
                    <strong>Parking:</strong> Ample free parking available on-site.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#00ffff] shrink-0 mt-0.5" />
                  <p>
                    <strong>Note:</strong> Look for the giant balloons at the entrance!
                  </p>
                </div>
              </div>
            </div>

            {/* Map Area Box */}
            <div className="bg-[#ffff00] pop-border flex flex-col items-center justify-center min-h-[300px] gap-3">
              <MapPin className="w-16 h-16 text-black" />
              <span className="font-bold text-xl uppercase tracking-wider text-black font-sans">
                Map Area
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        className="py-24 bg-[#fff4d9] overflow-hidden border-t-4 border-black"
        id="gallery"
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center">
          <h2 className="text-3xl md:text-5xl text-black mb-16 shimmer-text font-bold">
            Our Moments
          </h2>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 px-4">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const caption =
                typeof item === "string" ? `Moment #${i + 1}` : item.caption;
              const rotate =
                typeof item === "string"
                  ? i === 0
                    ? "-rotate-6"
                    : i === 1
                    ? "rotate-3 mt-8"
                    : "-rotate-2"
                  : item.rotate || "";

              return (
                <div key={i} className={`polaroid w-64 ${rotate}`}>
                  <div className="bg-gray-200 h-48 w-full mb-4 flex items-center justify-center border-2 border-black overflow-hidden">
                    <img
                      alt={caption}
                      className="w-full h-full object-cover"
                      src={url}
                    />
                  </div>
                  <p className="font-sans text-sm text-black font-bold uppercase">
                    {caption}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-24 bg-[#00ffff]/20 border-y-4 border-black" id="rsvp">
        <div className="max-w-3xl mx-auto px-6 md:px-16 relative">
          <div className="bg-white p-8 md:p-12 pop-border relative">
            {/* Spinning Star Badge */}
            <div className="absolute -top-6 -right-6 bg-[#ffff00] w-16 h-16 rounded-full pop-border flex items-center justify-center animate-spin" style={{ animationDuration: "10s" }}>
              <Star className="w-8 h-8 text-black fill-black" />
            </div>

            <RsvpSection partnerOne={celebrantName} partnerTwo="" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white w-full py-12">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-xl text-[#ffff00] italic font-bold">
            {celebrationHeader}
          </div>
          <div className="text-xs text-gray-400 font-sans">
            © {new Date().getFullYear()} Crafted with Love for {celebrantName}'s Special Day
          </div>
          <div className="flex gap-6 text-xs font-sans font-bold uppercase">
            <a href="#" className="hover:text-[#00ffff] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#00ffff] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
