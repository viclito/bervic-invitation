"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, PlayCircle, Newspaper, Clock, Calendar, MapPin } from "lucide-react";

export default function VintageNewspaperInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Celebrant Name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const brandName = "THE DAILY CHRONICLE";

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(
      props.weddingDate || "2026-10-15T18:00:00"
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

  // Gallery items matching exact Stitch screen 98fdaad794ba457faaa59779a6de3586
  const galleryList =
    props.galleryImages && props.galleryImages.length >= 4
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-SJwPvD3NwRI7Xw3UR9x2l68xmKvVzmdmHFaRFC3q4Zxz1a33wdjiB4R_3RVUaZSEP0TxAxsvNoiHOkqUUnnzyZVLIO9NlC_FR_ndjM6EosYiMzK6BXJfnkTcwCmZWRE9tE9_Mpwt6cgX4zg2ttsMzzHWCtSNEdS1Ko8milCZG4S2TdSArYnYMo2Y_IDpo5ABDq2n1kxzIFbHih0DKnYxs3EE8Px4eso3TS8q1o1snzbe2VJl-h5",
            caption: "The Early Years",
            rotate: "-rotate-2",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDc75eTcJrJFyqlT3xZ6qnw0MKXlrJa-qiPaht2mNk36bYfIJtmV4wKNbPtpT1-ivtz6feWPNZH1MlqezxC2V23mfCDMMlZ58XY-aVkYJY0fzm37o82M1fPgYIMPmVNZSC7RxlICx1mYf3gqW2YWC4EpezNyHy4dfrlOmdtNp_q--tFzcGD5DvITaW1JPZ6EGVO_xk2gacOJdAfNRXi4jNKx3VlDTzChmTHELt5sK-9x8A-1R5xluP",
            caption: "A Grand Affair",
            rotate: "rotate-3",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDs26g_jGdGVvZdN0Ajvzq882DwcJHRUcG3rg3Rhsz9nUmZVcxMNu3WhxPTjDrOlt9yUJRxRSSYoR1KUwYdXeP3EQCJDG36YQoAEPSYfs_GiNTpx-JhpuhKPhcumkoCEnAi4Rgsl0wjqSpISqY_2Ml3muRbO0_mzGRaIuyLM2pwR_FSgnMedUvx20jMq92iSly02XY9C0Qn4Q-obXaHNLvb4KiXm4dvhYqVePhUMWHHM9U9wADrR218",
            caption: "Overseas Dispatch",
            rotate: "-rotate-1",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3RyZDJvpuJF16bzgXVJhCVDZoXXVSNrlqf98SRgcoe0xS_CEu8r7YfoHeK48tMlUA52WlZV7GzpsXjAG3U_1n1g8L8gRSNEhAKm3RV7cz3P-UBJ-jQ3IKClXHNl06biCUmdzL6sqQdvmuh08m1UTm7pbysDWGY62oE9WEaMqGHHjmobaKsfZdjIZkTgT8k1ujRMM8RM_Zzw0R-Ky-0DRaivCVoHXvHRC9sURXSfAc3N3_J8215nKw",
            caption: "Unprecedented Joy",
            rotate: "rotate-2",
          },
        ];

  // Daily Dispatch timeline items
  const timelineItems =
    props.events && props.events.length > 0
      ? props.events
      : [
          {
            time: "6PM",
            title: "Arrival & Registration",
            desc: "Guests are requested to present their credentials at the main vestibule. Libations will be served.",
          },
          {
            time: "7PM",
            title: "Grand Banquet",
            desc: "A sumptuous feast awaits in the dining hall, prepared by renowned culinary artisans.",
          },
          {
            time: "9PM",
            title: "Ceremonial Toast",
            desc: "Raise your glasses as distinguished guests deliver remarks and accolades.",
          },
          {
            time: "LATE",
            title: "Revelry & Dance",
            desc: "The orchestra shall commence, and the floor will be open for jubilant celebration until the early hours.",
          },
        ];

  return (
    <div className="bg-[#fcf9f2] text-[#1c1c18] font-mono antialiased overflow-x-hidden relative selection:bg-[#1c1c18]/20 selection:text-[#1c1c18] min-h-screen flex flex-col">
      {/* Newspaper Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Domine:wght@400..700&display=swap"
        rel="stylesheet"
      />

      {/* Vintage Newspaper CSS Engine */}
      <style>{`
        .drop-cap::first-letter {
          font-family: 'Domine', serif;
          font-size: 4rem;
          font-weight: bold;
          line-height: 1;
          float: left;
          margin-right: 0.5rem;
          margin-top: 0.2rem;
          color: #1A1A1A;
        }

        .polaroid-frame {
          background: #fcf9f2;
          padding: 1rem 1rem 3rem 1rem;
          border: 1px solid #1A1A1A;
          box-shadow: 4px 4px 0px rgba(26,26,26,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .polaroid-frame:hover {
          transform: scale(1.05) rotate(0deg) !important;
          box-shadow: 8px 8px 0px rgba(26,26,26,0.2);
          z-index: 10;
        }

        .coupon-border {
          border: 2px dashed #1A1A1A;
          padding: 2rem;
          position: relative;
        }
        .coupon-border::before {
          content: "✂";
          position: absolute;
          top: -12px;
          left: 20px;
          font-size: 20px;
          color: #1A1A1A;
          background: #fcf9f2;
          padding: 0 4px;
        }
      `}</style>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday, 15th October 2026 at 6:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="vintage-newspaper"
      />

      {/* Top Bar Header */}
      <header className="flex justify-between items-center px-6 md:px-16 py-4 w-full bg-[#fcf9f2] border-b-2 border-[#1c1c18] sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <h1 className="font-serif text-xl md:text-2xl font-bold text-[#1c1c18] tracking-tighter uppercase">
            {brandName}
          </h1>
          <nav className="hidden md:flex gap-6 font-mono text-xs font-semibold">
            <a
              className="text-[#5e5e5e] hover:bg-[#1c1c18] hover:text-[#fcf9f2] transition-colors px-2 py-1 uppercase"
              href="#story"
            >
              Report
            </a>
            <a
              className="text-[#5e5e5e] hover:bg-[#1c1c18] hover:text-[#fcf9f2] transition-colors px-2 py-1 uppercase"
              href="#timeline"
            >
              Dispatch
            </a>
            <a
              className="text-[#5e5e5e] hover:bg-[#1c1c18] hover:text-[#fcf9f2] transition-colors px-2 py-1 uppercase"
              href="#rsvp"
            >
              RSVP
            </a>
          </nav>
        </div>

        <a
          className="font-serif font-bold uppercase text-[#1c1c18] border-2 border-[#1c1c18] px-4 py-1.5 hover:bg-[#1c1c18] hover:text-[#fcf9f2] transition-colors text-xs"
          href="#rsvp"
        >
          Subscribe
        </a>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow px-6 md:px-16 py-12 flex flex-col gap-16 max-w-[1440px] mx-auto w-full">
        {/* Hero: News Headline */}
        <section className="flex flex-col items-center text-center gap-6 pb-12 border-b-4 border-[#1c1c18] relative">
          <p className="font-sans text-xs font-bold text-[#5e5e5e] tracking-widest uppercase">
            Special Edition Dispatch
          </p>
          <h2 className="font-serif text-4xl md:text-6xl uppercase max-w-4xl leading-tight font-bold">
            {celebrantName}'s Grand Celebration Declared
          </h2>
          <p className="font-mono text-base md:text-lg max-w-2xl text-[#444748] leading-relaxed">
            Citizens are hereby summoned to partake in an evening of unprecedented revelry, commemorating another illustrious year in the annals of history.
          </p>
        </section>

        {/* Countdown Widget */}
        <section className="flex justify-center -mt-16 relative z-10">
          <div className="bg-[#fcf9f2] border-2 border-[#1c1c18] p-6 text-center shadow-[4px_4px_0_#000]">
            <p className="font-sans text-xs font-bold mb-4 uppercase border-b border-[#1c1c18] pb-2 tracking-widest">
              Edition Countdown
            </p>
            <div className="flex gap-6 md:gap-10 font-serif">
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="font-sans text-xs mt-1 font-bold uppercase tracking-wider">
                  Days
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="font-sans text-xs mt-1 font-bold uppercase tracking-wider">
                  Hours
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="font-sans text-xs mt-1 font-bold uppercase tracking-wider">
                  Mins
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story / Special Report */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b-2 border-[#1c1c18] pb-16" id="story">
          <div className="col-span-1 md:col-span-12 text-center mb-4">
            <h3 className="font-serif text-2xl uppercase border-y-2 border-[#1c1c18] py-2 inline-block px-8 font-bold">
              Special Report: The Journey So Far
            </h3>
          </div>

          <div className="col-span-1 md:col-span-7 flex flex-col gap-4">
            <div className="aspect-video bg-[#dcdad3] border border-[#1c1c18] flex items-center justify-center relative overflow-hidden group">
              <PlayCircle className="w-16 h-16 text-[#1c1c18] opacity-50 group-hover:opacity-100 transition-opacity z-10 absolute" />
              <div className="absolute inset-0 flex items-center justify-center font-serif text-xl text-[#747878] uppercase opacity-30 font-bold">
                Latest Newsreel
              </div>
              <img
                alt="Vintage newsreel placeholder"
                className="w-full h-full object-cover mix-blend-luminosity opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj3CvobW7gsQYwkfoAOootCuUgtdPvoOrhAs_N_lgeq9Arj1ulHZKjnXc7O9rJIJoLSp0ZlHmOaA6btrEP8CeFLaF_Pjw49qQi5JL_75EQioNX2QVVhtDjH1sr7zPKY6eDlXWb5SiSduZr-al3XItn_AmkNHx5KxdMnb9CqaumzJ3AUQY6kSgIdyvw8S2X4jnmpe7IDa24Se5LU5-aoqc8lOP9gRtbWoARW-iOEVAkgsFYyBpKoDJo"
              />
            </div>
            <p className="font-sans text-center text-[#5e5e5e] italic text-xs font-semibold">
              Fig. 1 - Archival footage of the early years.
            </p>
          </div>

          <div className="col-span-1 md:col-span-5 border-t md:border-t-0 md:border-l border-[#1c1c18] pt-6 md:pt-0 md:pl-8 text-justify font-mono text-sm leading-relaxed">
            <p className="drop-cap mb-4">
              From the very beginning, it was clear that {celebrantName} was destined for greatness. Born under an auspicious star, her early days were marked by a curiosity that confounded scholars and delighted observers alike. The local gazettes frequently featured her nascent exploits, from the great tricycle expedition to the profound philosophical inquiries posited during afternoon tea.
            </p>
            <p className="mb-4">
              As the years progressed, so too did her influence. A beacon of modern thought and uncompromising style, she has traversed the globe, leaving an indelible mark upon the cultural zeitgeist. Friends and confidants note her unparalleled ability to turn a mundane gathering into an affair of historic proportions.
            </p>
            <p>
              Now, as we stand on the precipice of another momentous anniversary, the city holds its breath in anticipation of what promises to be the most spectacular gala of the decade. The archives have been dusted off, the champagne secured, and the press alerted.
            </p>
          </div>
        </section>

        {/* Event Timeline */}
        <section className="border-b-2 border-[#1c1c18] pb-16" id="timeline">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl uppercase border-y-2 border-[#1c1c18] py-2 inline-block px-8 font-bold">
              The Day's Dispatch
            </h3>
            <p className="font-sans text-xs text-[#5e5e5e] mt-2 font-bold tracking-wider uppercase">
              Schedule of Proceedings
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[#1c1c18] transform md:-translate-x-1/2"></div>

            {timelineItems.map((item: any, idx: number) => {
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={idx}
                  className="relative flex items-center justify-between mb-8 last:mb-0 flex-col md:flex-row"
                >
                  {!isEven ? (
                    <div className="order-1 w-full md:w-5/12 pl-12 md:pl-0 text-left md:text-right pr-4">
                      <h4 className="font-serif text-lg font-bold text-[#1c1c18] uppercase">
                        {item.title}
                      </h4>
                      <p className="font-mono text-sm text-[#444748] mt-1">
                        {item.desc}
                      </p>
                    </div>
                  ) : (
                    <div className="order-1 w-full md:w-5/12 hidden md:block"></div>
                  )}

                  <div className="z-20 flex items-center justify-center order-1 bg-[#fcf9f2] border-2 border-[#1c1c18] w-10 h-10 rounded-full shadow-[2px_2px_0_#000] absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
                    <span className="font-sans font-bold text-xs">
                      {item.time}
                    </span>
                  </div>

                  {isEven ? (
                    <div className="order-1 w-full md:w-5/12 pl-12 md:pl-4 text-left">
                      <h4 className="font-serif text-lg font-bold text-[#1c1c18] uppercase">
                        {item.title}
                      </h4>
                      <p className="font-mono text-sm text-[#444748] mt-1">
                        {item.desc}
                      </p>
                    </div>
                  ) : (
                    <div className="order-1 w-full md:w-5/12 hidden md:block"></div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Photo Archive (Gallery) */}
        <section className="border-b-2 border-[#1c1c18] pb-16" id="gallery">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl uppercase border-y-2 border-[#1c1c18] py-2 inline-block px-8 font-bold">
              Photo Archive
            </h3>
            <p className="font-sans text-xs text-[#5e5e5e] mt-2 font-bold tracking-wider uppercase">
              Glimpses of Yesteryear
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const caption =
                typeof item === "string" ? `Archival Item #${i + 1}` : item.caption;
              const rotate =
                typeof item === "string"
                  ? i === 0
                    ? "-rotate-2"
                    : i === 1
                    ? "rotate-3"
                    : i === 2
                    ? "-rotate-1"
                    : "rotate-2"
                  : item.rotate || "";

              return (
                <div key={i} className={`polaroid-frame transform ${rotate}`}>
                  <div className="aspect-square bg-[#dcdad3] border border-[#1c1c18] overflow-hidden relative">
                    <img
                      alt={caption}
                      className="w-full h-full object-cover grayscale contrast-125 sepia-[.3]"
                      src={url}
                    />
                  </div>
                  <p className="font-mono text-center mt-3 text-xs italic text-[#1c1c18]">
                    {caption}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* RSVP Coupon */}
        <section className="max-w-2xl mx-auto py-12 w-full" id="rsvp">
          <div className="coupon-border bg-[#fcf9f2]">
            <div className="text-center mb-6 border-b border-[#1c1c18] pb-4">
              <h3 className="font-serif text-2xl font-bold uppercase">
                Subscription & RSVP
              </h3>
              <p className="font-sans text-xs font-bold text-[#5e5e5e] mt-2 tracking-wider uppercase">
                Please remit your response by the 15th inst.
              </p>
            </div>

            <RsvpSection partnerOne={celebrantName} partnerTwo="" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-8 w-full border-t-2 border-[#1c1c18] mt-16 bg-[#fcf9f2] text-xs font-sans text-[#5e5e5e]">
        <p className="font-bold text-[#1c1c18] text-center md:text-left mb-4 md:mb-0 uppercase tracking-wider">
          © {new Date().getFullYear()} THE DAILY CHRONICLE PUBLISHING CO. ALL RIGHTS RESERVED.
        </p>
        <div className="flex flex-wrap justify-center gap-6 uppercase font-semibold">
          <a href="#story" className="hover:text-[#1c1c18] transition-colors">
            Report
          </a>
          <a href="#timeline" className="hover:text-[#1c1c18] transition-colors">
            Dispatch
          </a>
          <a href="#rsvp" className="hover:text-[#1c1c18] transition-colors">
            RSVP
          </a>
        </div>
      </footer>
    </div>
  );
}
