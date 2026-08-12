"use client";

import { useState, useEffect } from "react";
import { getWeddingTargetDate, getYouTubeEmbedUrl } from "@/lib/dateUtils";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  PlayCircle,
  Church,
  Utensils,
  PartyPopper,
  Wine,
  Phone,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export default function OliveOchreInvitation(props: TemplateClassicFloralProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Countdown timer state
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
    const targetDate = getWeddingTargetDate(props.weddingDate, props.weddingTime).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetDate - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [props.weddingDate, props.weddingTime]);

  const partner1 = props.partnerOne || "Terance";
  const partner2 = props.partnerTwo || "Ancy";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const heroImg =
    props.heroImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC8pIzrWFqgjXZqDvga8yFpYUuIh5ZfJwLIPEQmE8YezKXKGUJitoMuYjumsgdEj2C6aXGdm1jN3vCjFTtzEgmKZoBUINcOn-4Yk5sHzeEEGVIrO5sgi4CLpLKafTgKnFmPu5jAbSAAQYBVMXhh5dI0LQC3k6mgev320tJ9N3eB49in7QKZoKtpk2VBgZlnPiDRKu3AtfsJicrrksaAvrw76GJcX7N0flQP7O64HVsKrhsLdoGAZORq";

  const coupleImg =
    props.coupleImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAozQTTShxbC2nG0N4AqOQYF9-PJMAj5p4kqugcb0I5t5zZInw42xxfjdzw5JP1O3YU9ohkSXnh1LmqrfIwb0vF402pC3lrLVbSX8cI4QHYkqLqQgAGcZR9viSyKJ0_m_vXwuTELqm1Fqq1zOWoEbOIeLKzLQxb8xgWKJOSZeAyqjJL_MOY7eQhqA-kZlThFG8UyBDAuixWoZ8pcqTBjCZknGbYjZkga0FnKfwKlBiLGMqR4gRIbRjC";

  const defaultEvents = [
    { icon: "church", title: "Wedding", time: "10:00 AM", date: "May 13, 2026" },
    { icon: "restaurant", title: "Lunch", time: "12:00 PM", date: "May 13, 2026" },
    { icon: "celebration", title: "Reception", time: "07:00 PM", date: "May 13, 2026" },
    { icon: "dinner_dining", title: "Dinner", time: "08:00 PM", date: "May 13, 2026" },
  ];

  const eventsList = props.events && props.events.length > 0 ? props.events : defaultEvents;

  const defaultLocations = [
    {
      name: "Marriage Venue",
      venueLabel: "St. Antony Church",
      address: "Kaval Kinaru, Tirunelveli District, Tamil Nadu, India",
      mapLink: "https://maps.google.com/?q=St+Antony+Church+Kaval+Kinaru",
    },
    {
      name: "Reception Venue",
      venueLabel: "Ubahara Matha Mahal",
      address: "Kaval Kinaru, Tirunelveli District, Tamil Nadu, India",
      mapLink: "https://maps.google.com/?q=Ubahara+Matha+Mahal+Kaval+Kinaru",
    },
  ];

  const locationsList = props.locations && props.locations.length > 0 ? props.locations : defaultLocations;

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
    <div className="bg-[#fcf9f8] text-[#1b1c1c] font-serif min-h-screen selection:bg-[#5f5f00]/20 selection:text-[#5f5f00] relative overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "13th May 2026 at 10:00 AM Onwards"}
        isCustomizer={props.isCustomizer}
        templateSlug="olive-ochre"
      />

      {/* Decorative Botanical Corner Motifs */}
      <div className="absolute top-12 left-6 text-[#5f5f00]/20 pointer-events-none z-0">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
          <path d="M10 10 C 40 10, 50 40, 50 80 C 40 40, 10 40, 10 10 Z" />
          <circle cx="50" cy="20" r="5" />
        </svg>
      </div>
      <div className="absolute top-12 right-6 text-[#904d00]/20 pointer-events-none z-0 rotate-90">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
          <path d="M10 10 C 40 10, 50 40, 50 80 C 40 40, 10 40, 10 10 Z" />
          <circle cx="50" cy="20" r="5" />
        </svg>
      </div>

      {/* Top Navbar */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          navScrolled ? "bg-[#fcf9f8]/95 shadow-md border-b border-[#cac7b1]/40 py-3" : "bg-[#fcf9f8]/80 backdrop-blur-md border-b border-[#cac7b1]/20 py-4"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-14">
          <a href="#" className="text-2xl font-bold italic tracking-tight text-[#5f5f00] hover:scale-105 transition-transform">
            {initials}
          </a>

          <div className="hidden md:flex gap-8 items-center font-sans text-xs font-semibold tracking-wider uppercase text-[#484837]">
            <a href="#story" className="hover:text-[#5f5f00] transition-colors relative group">
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#904d00] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#events" className="hover:text-[#5f5f00] transition-colors relative group">
              Events
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#904d00] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#locations" className="hover:text-[#5f5f00] transition-colors relative group">
              Locations
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#904d00] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#gallery" className="hover:text-[#5f5f00] transition-colors relative group">
              Gallery
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#904d00] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#contact" className="hover:text-[#5f5f00] transition-colors relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#904d00] transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          <a
            href="#rsvp"
            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-[#5f5f00] text-white rounded text-xs font-semibold tracking-widest uppercase hover:bg-[#494900] transition-all transform hover:-translate-y-0.5 shadow-md"
          >
            RSVP
          </a>

          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="md:hidden text-[#5f5f00] p-2">
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#fcf9f8] border-b border-[#cac7b1]/30 px-6 py-4 flex flex-col gap-3 font-sans text-xs font-bold uppercase tracking-widest text-[#484837]"
          >
            <a href="#story" onClick={() => setMobileNavOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileNavOpen(false)}>Events</a>
            <a href="#locations" onClick={() => setMobileNavOpen(false)}>Locations</a>
            <a href="#gallery" onClick={() => setMobileNavOpen(false)}>Gallery</a>
            <a href="#contact" onClick={() => setMobileNavOpen(false)}>Contact</a>
            <a href="#rsvp" onClick={() => setMobileNavOpen(false)} className="py-2 text-[#5f5f00] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[850px] flex items-center justify-center overflow-hidden py-16">
          <div
            className="absolute inset-0 z-0 opacity-30 mix-blend-multiply pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,160,73,0.2) 0%, transparent 70%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative z-10 text-center max-w-4xl px-6 md:px-16 mx-auto flex flex-col items-center gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#904d00]/10 border border-[#904d00]/30 text-[#904d00] text-xs font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{props.tagline || "TOGETHER WITH THEIR FAMILIES"}</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 justify-center">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#5f5f00] tracking-tight drop-shadow-sm"
              >
                {partner1}
              </motion.h1>
              <span className="text-[#904d00] text-4xl italic font-serif">&amp;</span>
              <motion.h1
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#5f5f00] tracking-tight drop-shadow-sm"
              >
                {partner2}
              </motion.h1>
            </div>

            <p className="text-lg text-[#484837] mt-2 max-w-xl mx-auto italic leading-relaxed">
              {props.inviteLine || "Invite you to celebrate their wedding"}
            </p>

            {/* Bride & Groom Photo Cards */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg mx-auto mt-4">
              {/* Bride Card */}
              <div className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#5f5f00]/30 shadow-md bg-white">
                <img
                  src={props.coupleImage || props.coverImage || "/images/templates/groom-bride-1.jpg"}
                  alt={`${partner1} - Bride`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-left">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#e9e86b] font-bold block">
                    Bride
                  </span>
                  <h3 className="text-lg font-bold text-white leading-none mt-0.5">
                    {partner1}
                  </h3>
                </div>
              </div>

              {/* Groom Card */}
              <div className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#5f5f00]/30 shadow-md bg-white">
                <img
                  src={props.partnerTwoImage || props.coverImage || "/images/templates/groom-bride-2.jpg"}
                  alt={`${partner2} - Groom`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-left">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#e9e86b] font-bold block">
                    Groom
                  </span>
                  <h3 className="text-lg font-bold text-white leading-none mt-0.5">
                    {partner2}
                  </h3>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center gap-1.5 mt-6 py-6 border-y border-[#cac7b1]/40 w-full max-w-md bg-white/40 backdrop-blur-sm rounded-xl"
            >
              <p className="text-2xl font-bold text-[#1b1c1c] tracking-wide">{props.weddingDate || "13th May 2026"}</p>
              <p className="font-sans text-xs text-[#484837] font-semibold uppercase tracking-wider">{props.weddingTime || "10:00 AM Onwards"}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-6 w-full max-w-2xl overflow-hidden rounded-2xl shadow-xl border border-[#cac7b1]/40 group"
            >
              <img
                src={heroImg}
                alt="Mediterranean Olive Illustration"
                className="w-full max-h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Countdown Section */}
        <section className="py-20 bg-[#f6f3f2] border-y border-[#cac7b1]/30 relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="inline-block"
            >
              <Heart className="w-10 h-10 text-[#904d00] fill-current mx-auto mb-4 drop-shadow" />
            </motion.div>
            <h2 className="text-3xl font-bold text-[#5f5f00] mb-10 tracking-tight">Our Big Day</h2>

            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-14">
              <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center p-4 rounded-xl bg-white/80 border border-[#cac7b1]/40 shadow-sm min-w-[90px]">
                <span className="text-4xl md:text-5xl font-bold text-[#5f5f00] mb-1">{timeLeft.days}</span>
                <span className="font-sans text-[11px] font-bold text-[#484837] uppercase tracking-widest">Days</span>
              </motion.div>
              <span className="text-3xl text-[#5f5f00]/40 font-serif hidden sm:block">:</span>
              <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center p-4 rounded-xl bg-white/80 border border-[#cac7b1]/40 shadow-sm min-w-[90px]">
                <span className="text-4xl md:text-5xl font-bold text-[#5f5f00] mb-1">{timeLeft.hours}</span>
                <span className="font-sans text-[11px] font-bold text-[#484837] uppercase tracking-widest">Hours</span>
              </motion.div>
              <span className="text-3xl text-[#5f5f00]/40 font-serif hidden sm:block">:</span>
              <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center p-4 rounded-xl bg-white/80 border border-[#cac7b1]/40 shadow-sm min-w-[90px]">
                <span className="text-4xl md:text-5xl font-bold text-[#5f5f00] mb-1">{timeLeft.minutes}</span>
                <span className="font-sans text-[11px] font-bold text-[#484837] uppercase tracking-widest">Minutes</span>
              </motion.div>
              <span className="text-3xl text-[#5f5f00]/40 font-serif hidden sm:block">:</span>
              <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center p-4 rounded-xl bg-white/80 border border-[#cac7b1]/40 shadow-sm min-w-[90px]">
                <span className="text-4xl md:text-5xl font-bold text-[#5f5f00] mb-1">{timeLeft.seconds}</span>
                <span className="font-sans text-[11px] font-bold text-[#484837] uppercase tracking-widest">Seconds</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Love Story Section */}
        {props.showVideoSection !== false && Boolean(props.loveStoryVideoUrl) && (
          <section className="py-24 max-w-[1280px] mx-auto px-6 md:px-16" id="story">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-6"
              >
                <h2 className="text-4xl font-bold text-[#5f5f00]">Our Love Story</h2>
                <div className="w-16 h-1 bg-[#904d00] rounded-full" />
                <blockquote className="text-xl italic text-[#1b1c1c] pl-6 border-l-4 border-[#5f5f00]/40 leading-relaxed bg-[#5f5f00]/5 py-3 rounded-r-xl">
                  &ldquo;Every love story is beautiful, but ours is my favorite.&rdquo;
                </blockquote>
                <p className="font-sans text-sm text-[#484837] leading-relaxed">
                  {props.loveStoryText ||
                    "From a chance encounter to a lifetime of promises, our journey has been filled with laughter, shared dreams, and endless love. We are thrilled to take this next step surrounded by the people who mean the most to us."}
                </p>
                <a
                  href={props.loveStoryVideoUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="self-start mt-2 px-6 py-3 border-2 border-[#904d00] text-[#904d00] rounded-lg font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#904d00] hover:text-white transition-all shadow-sm inline-flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Watch Full Video</span>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#cac7b1]/40 shadow-xl group cursor-pointer bg-black"
              >
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
                      src={coupleImg}
                      alt="Couple Love Story Photo"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/15 transition-colors">
                      <PlayCircle className="w-16 h-16 text-white drop-shadow-2xl group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}

        {/* Wedding Events Section */}
        <section className="py-24 bg-[#ffffff]" id="events">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-[#5f5f00] mb-3">Wedding Events</h2>
              <p className="font-sans text-sm text-[#484837] max-w-xl mx-auto">
                Join us as we step into a lifetime of love and togetherness.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {eventsList.map((ev, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-[#fcf9f8] p-8 rounded-2xl border border-[#cac7b1]/40 flex flex-col items-center text-center transition-all duration-300 shadow-sm hover:shadow-md hover:border-[#5f5f00]"
                >
                  <div className="w-16 h-16 rounded-full bg-[#5f5f00]/10 flex items-center justify-center mb-6 text-[#5f5f00] shadow-inner">
                    {idx % 4 === 0 && <Church className="w-7 h-7" />}
                    {idx % 4 === 1 && <Utensils className="w-7 h-7" />}
                    {idx % 4 === 2 && <PartyPopper className="w-7 h-7" />}
                    {idx % 4 === 3 && <Wine className="w-7 h-7" />}
                  </div>
                  <h3 className="text-xl font-bold text-[#1b1c1c] mb-2">{ev.title}</h3>
                  <p className="font-sans text-xs font-bold text-[#904d00] mb-4 uppercase tracking-wider">{ev.time}</p>
                  <p className="font-sans text-xs text-[#484837] border-t border-[#cac7b1]/30 pt-4 w-full">{ev.date}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-24 border-t border-[#cac7b1]/30" id="locations">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-[#5f5f00] mb-3">Locations</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {locationsList.map((loc, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-[#fcf9f8] p-8 rounded-2xl border border-[#cac7b1]/40 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-2xl font-bold text-[#1b1c1c] mb-3">{loc.name}</h3>
                  <p className="font-sans text-sm font-semibold text-[#5f5f00] mb-1">{loc.venueLabel}</p>
                  <p className="font-sans text-xs text-[#484837] mb-6 leading-relaxed">{loc.address}</p>
                  <div className="mt-auto pt-4 border-t border-[#cac7b1]/30">
                    <a
                      href={loc.mapLink || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[#904d00] hover:underline font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>View on Google Maps</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Moments Gallery Section */}
        <section className="py-24 bg-[#f6f3f2]" id="gallery">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-[#5f5f00] mb-3">Our Moments</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryList.slice(0, 6).map((imgUrl, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="rounded-2xl overflow-hidden border border-[#cac7b1]/40 aspect-square shadow-sm group"
                >
                  <img src={imgUrl} alt={`Moment ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* RSVP Section */}
        <div id="rsvp">
          <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="olive-ochre" />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#ffffff] border-t border-[#cac7b1]/30 py-12" id="contact">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <span className="text-3xl font-bold italic text-[#5f5f00]">{initials}</span>
            <p className="font-sans text-xs text-[#484837] max-w-sm leading-relaxed">
              Thank you for being a part of our special journey. We can&apos;t wait to celebrate with you!
            </p>
            <div className="font-sans text-xs text-[#904d00] font-semibold mt-2 space-y-1">
              <p>📞 {props.contactPhone || "+91 934590 0711"}</p>
              <p>📍 {props.contactAddress || "Kaval Kinaru, Tirunelveli District, Tamil Nadu, India"}</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex flex-wrap justify-center gap-6 font-sans text-xs font-bold uppercase tracking-wider text-[#484837]">
              <a href="#story" className="hover:text-[#904d00]">Our Story</a>
              <a href="#events" className="hover:text-[#904d00]">Events</a>
              <a href="#rsvp" className="hover:text-[#904d00]">RSVP</a>
              <a href="#gallery" className="hover:text-[#904d00]">Gallery</a>
              <a href="#contact" className="hover:text-[#904d00]">Contact</a>
            </div>
            <p className="font-sans text-xs text-[#904d00]">
              © 2026 {partner1} &amp; {partner2}. Handcrafted with love.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
