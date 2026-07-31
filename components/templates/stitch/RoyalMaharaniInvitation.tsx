"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  PartyPopper,
  MapPin,
  Menu,
  X,
  Play,
  Sparkles,
  Crown,
  Heart,
} from "lucide-react";

export default function RoyalMaharaniInvitation(props: TemplateClassicFloralProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const targetDate = new Date("2026-05-13T10:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const partner1 = props.partnerOne || "Terance";
  const partner2 = props.partnerTwo || "Ancy";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const coupleHeroImg =
    props.heroImage ||
    "https://lh3.googleusercontent.com/aida/AP1WRLvWfzXdN3dHblHMwCfYoZzOQpFd55WruE3qhpS4L0St43rwB0l9HRsSVUPWL226kWxQkGJRu6OUJ5cOQo4G0Vp8s-N63YtcTfH8vIaWTvvr9rHykEUQ0mI_v8bBC7ZTc8VAO1--z-jMa4pg_IU1uaN3Gd76BW-8k-d4R5LU4PtaWr7aPUpDbHttGiVo0D0y6Y_O7PNACCjqktCyXRVWMTP8nJzTwqnxpfozIb53uukdEtbwZ1iwTN6b4rI";

  const videoCoverImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC8i0wWwVz0XkdyjrVRPE_3gLQ1AOASUEPF3522qAE5ggUHQ-HHEaPB_BOT_C92cOVdxrxEj330lttE-e2ha-j2DLSL_N3W4-uiQE395S2aK0QK7bLMEjC_yd6cRbCp0gbacGsZ19T5yRsitocxP9lGmPFka6_lsjRM1sB4jUyI0wrbXTW3ZTX5nThN8-7e2ZOYOm9cDlNufwWPaqyFBkTcuTTA9N5sUzgyczfSkvi6kvaVEZ9VZxBB";

  const defaultTimeline = [
    { time: "10:00 AM", title: "Royal Wedding Ceremony", desc: "Holy Matrimony at St. Antony Church" },
    { time: "12:30 PM", title: "Grand Banquet Luncheon", desc: "Traditional royal feast for honored guests" },
    { time: "07:00 PM", title: "Maharani Gala Reception", desc: "Evening gala with live orchestra and dancing" },
    { time: "08:30 PM", title: "Royal Banquet Dinner", desc: "Delightful grand reception dinner" },
  ];

  const defaultGallery = [
    "/images/templates/gallery-1.jpg",
    "/images/templates/gallery-2.jpg",
    "/images/templates/gallery-3.jpg",
    "/images/templates/gallery-4.jpg",
    "/images/templates/gallery-5.jpg",
    "/images/templates/gallery-6.jpg",
  ];

  const galleryList = props.galleryImages && props.galleryImages.length > 0 ? props.galleryImages : defaultGallery;

  return (
    <div className="bg-[#1a0812] text-[#fce8ef] font-sans antialiased selection:bg-[#e6c280] selection:text-[#1a0812] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="royal-maharani"
      />

      {/* Top Navigation */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#e6c280]/30 ${
          navScrolled ? "bg-[#1a0812]/95 backdrop-blur-md py-3 shadow-xl" : "bg-[#1a0812]/80 backdrop-blur-sm py-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-[1280px] mx-auto h-16">
          <a href="#" className="font-serif text-2xl font-bold text-[#e6c280] tracking-wider flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#e6c280]" /> {initials}
          </a>

          <div className="hidden md:flex gap-8 items-center text-xs font-semibold uppercase tracking-widest text-[#d8b5c4]">
            <a href="#story" className="hover:text-[#e6c280] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#e6c280] transition-colors">Events</a>
            <a href="#timeline" className="hover:text-[#e6c280] transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-[#e6c280] transition-colors">Gallery</a>
          </div>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#e6c280] text-[#1a0812] font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded border border-[#e6c280] hover:bg-white transition-colors"
          >
            RSVP
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#e6c280]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#1a0812] border-b border-[#e6c280] px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#d8b5c4]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#e6c280] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-28 pb-20 px-6 overflow-hidden" id="story">
        <div className="absolute inset-0 z-0 opacity-25">
          <img src={coupleHeroImg} alt="Royal Maharani background" className="w-full h-full object-cover mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0812]/60 via-[#1a0812]/80 to-[#1a0812]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-2 text-[#e6c280] text-xs font-bold uppercase tracking-[0.3em]">
            <Crown className="w-4 h-4 text-[#e6c280]" />
            <span>ROYAL WEDDING INVITATION</span>
            <Crown className="w-4 h-4 text-[#e6c280]" />
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-[#fff0f5] tracking-tight flex flex-col gap-2">
            <span>{partner1}</span>
            <span className="text-[#e6c280] font-serif italic text-4xl">&amp;</span>
            <span>{partner2}</span>
          </h1>

          <p className="text-base sm:text-lg text-[#d8b5c4] max-w-xl mx-auto">
            {props.inviteLine || "Cordially request the honor of your presence at their grand wedding celebration"}
          </p>

          <div className="border-2 border-[#e6c280]/60 p-6 rounded-xl backdrop-blur-md bg-[#1a0812]/80 shadow-[0_0_35px_rgba(230,194,128,0.2)] flex flex-col items-center">
            <p className="font-serif text-3xl font-bold text-[#e6c280]">13th May 2026</p>
            <p className="text-xs font-bold text-white uppercase tracking-widest mt-1">10:00 AM ONWARDS</p>
          </div>

          {/* Countdown Grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 mt-4">
            {[
              { label: "DAYS", val: timeLeft.days },
              { label: "HOURS", val: timeLeft.hours },
              { label: "MINS", val: timeLeft.minutes },
              { label: "SECS", val: timeLeft.seconds },
            ].map((unit, i) => (
              <div key={i} className="bg-[#290d1d] border border-[#e6c280]/40 px-4 py-3 rounded-lg min-w-[70px]">
                <span className="font-serif text-2xl font-bold text-[#e6c280] block">{String(unit.val).padStart(2, "0")}</span>
                <span className="text-[10px] font-bold text-[#d8b5c4] uppercase tracking-wider">{unit.label}</span>
              </div>
            ))}
          </div>

          <a
            href="#rsvp"
            className="mt-4 bg-[#e6c280] text-[#1a0812] font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded hover:bg-white transition-colors shadow-xl"
          >
            Save the Date
          </a>
        </motion.div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-6 md:px-16 max-w-[1280px] mx-auto" id="events">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-[#e6c280] mb-3">Royal Celebrations</h2>
          <div className="w-20 h-0.5 bg-[#e6c280] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Matrimony */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-[#290d1d] border border-[#e6c280]/40 p-8 sm:p-10 text-center rounded-xl shadow-xl flex flex-col justify-between"
          >
            <div>
              <Church className="w-10 h-10 text-[#e6c280] mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-white mb-1">Holy Matrimony</h3>
              <p className="text-xs font-bold text-[#e6c280] uppercase tracking-widest mb-4">MAY 13, 2026 • 10:00 AM</p>
              <p className="text-xs text-[#d8b5c4] mb-6 leading-relaxed">
                St. Antony Church<br />Kaval Kinaru, Tirunelveli District
              </p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[#e6c280] text-[#e6c280] px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#e6c280] hover:text-[#1a0812] transition-colors"
            >
              <MapPin className="w-4 h-4" /> View Location
            </a>
          </motion.div>

          {/* Reception */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-[#290d1d] border border-[#e6c280]/40 p-8 sm:p-10 text-center rounded-xl shadow-xl flex flex-col justify-between"
          >
            <div>
              <PartyPopper className="w-10 h-10 text-[#e6c280] mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-white mb-1">Maharani Gala Reception</h3>
              <p className="text-xs font-bold text-[#e6c280] uppercase tracking-widest mb-4">MAY 13, 2026 • 07:00 PM</p>
              <p className="text-xs text-[#d8b5c4] mb-6 leading-relaxed">
                Ubahara Matha Mahal<br />Kaval Kinaru, Tirunelveli District
              </p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[#e6c280] text-[#e6c280] px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#e6c280] hover:text-[#1a0812] transition-colors"
            >
              <MapPin className="w-4 h-4" /> View Location
            </a>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 md:px-16 bg-[#210917]" id="timeline">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#e6c280] mb-3">Royal Order of Events</h2>
            <div className="w-20 h-0.5 bg-[#e6c280] mx-auto" />
          </div>

          <div className="flex flex-col gap-6">
            {defaultTimeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-[#290d1d] border border-[#e6c280]/30 p-6 rounded-xl flex items-center gap-6 shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-[#1a0812] border border-[#e6c280] text-[#e6c280] flex items-center justify-center font-bold text-xs shrink-0">
                  <Crown className="w-5 h-5 text-[#e6c280]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#e6c280] uppercase tracking-widest block mb-1">{item.time}</span>
                  <h4 className="font-serif text-lg font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-[#d8b5c4]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 px-6 md:px-16 max-w-[1280px] mx-auto" id="gallery">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-[#e6c280] mb-3">Royal Moments</h2>
          <div className="w-20 h-0.5 bg-[#e6c280] mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryList.map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="group relative overflow-hidden rounded-xl aspect-square shadow-lg border border-[#e6c280]/30"
            >
              <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[#1a0812]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Love Story Video Facade */}
      <section className="py-24 px-6 md:px-16 bg-[#210917] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-[#e6c280] mb-3">Royal Film</h2>
          <div className="w-20 h-0.5 bg-[#e6c280] mx-auto mb-10" />

          <div className="relative aspect-video rounded-xl overflow-hidden border border-[#e6c280]/40 shadow-2xl group cursor-pointer">
            {isPlayingVideo ? (
              <iframe
                title="Royal video"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full" onClick={() => setIsPlayingVideo(true)}>
                <img src={videoCoverImg} alt="Video Cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a0812]/50">
                  <div className="w-20 h-20 bg-[#e6c280] rounded-full flex items-center justify-center text-[#1a0812] group-hover:scale-110 transition-transform shadow-xl">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="royal-maharani" />
      </div>

      {/* Footer */}
      <footer className="bg-[#12050c] border-t border-[#e6c280]/20 py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold">
          <span className="font-serif text-[#e6c280] text-lg">{initials}</span>
          <span className="text-[#d8b5c4]">&copy; 2026 {partner1} &amp; {partner2}. Royal Maharani Suite.</span>
        </div>
      </footer>
    </div>
  );
}
