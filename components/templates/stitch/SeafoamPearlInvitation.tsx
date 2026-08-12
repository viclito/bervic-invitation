"use client";

import { useState, useEffect } from "react";
import { getWeddingTargetDate, getYouTubeEmbedUrl } from "@/lib/dateUtils";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  PartyPopper,
  Heart,
  Menu,
  X,
  Play,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";

export default function SeafoamPearlInvitation(props: TemplateClassicFloralProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 324, hours: 12, minutes: 45, seconds: 10 });

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
  }, [props.weddingDate]);

  const partner1 = props.partnerOne || "Terance";
  const partner2 = props.partnerTwo || "Ancy";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const coupleImg =
    props.coverImage ||
    props.heroImage ||
    props.coupleImage ||
    "/images/templates/couple-photo.jpg";

  const defaultTimeline = [
    { time: "09:30 AM", title: "Guest Arrival", desc: "Gathering at the church for welcoming refreshments." },
    { time: "10:00 AM", title: "Wedding Ceremony", desc: "The exchange of vows and rings." },
    { time: "12:30 PM", title: "Photo Session", desc: "Capturing moments with family and friends." },
    { time: "07:00 PM", title: "Grand Reception", desc: "Dinner, dancing, and celebration." },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t) => ({
          time: t.time,
          title: t.title,
          desc: "Main Event",
        }))
      : defaultTimeline;

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
    <div className="bg-[#faf9f6] text-[#1a1c1a] font-serif antialiased selection:bg-[#93e9be]/40 selection:text-[#046c4a] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="seafoam-pearl"
      />

      {/* Top Navbar */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#046c4a]/10 ${
          navScrolled ? "bg-[#faf9f6]/95 backdrop-blur-xl py-3 shadow-sm" : "bg-[#faf9f6]/70 backdrop-blur-md py-4"
        }`}
      >
        <div className="flex justify-between items-center h-16 px-6 md:px-16 max-w-[1120px] mx-auto">
          <a href="#" className="font-serif italic text-3xl font-normal text-[#046c4a] hover:scale-105 transition-transform">
            T &amp; A
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#3f4943]">
            <a href="#our-story" className="hover:text-[#046c4a] transition-colors relative group">
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#93e9be] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#couple" className="hover:text-[#046c4a] transition-colors relative group">
              The Couple
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#93e9be] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#events" className="hover:text-[#046c4a] transition-colors relative group">
              Events
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#93e9be] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#timeline" className="hover:text-[#046c4a] transition-colors relative group">
              Timeline
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#93e9be] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#gallery" className="hover:text-[#046c4a] transition-colors relative group">
              Gallery
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#93e9be] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#rsvp" className="hover:text-[#046c4a] transition-colors relative group">
              RSVP
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#93e9be] transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-gradient-to-r from-[#93e9be] to-[#ffffff] text-[#046c4a] font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full shadow-[0_4px_15px_rgba(147,233,190,0.4)] hover:shadow-[0_6px_20px_rgba(147,233,190,0.6)] transition-all transform hover:-translate-y-0.5 border border-[#93e9be]"
          >
            Save the Date
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#046c4a]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#faf9f6] border-b border-[#046c4a]/20 px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#3f4943]"
          >
            <a href="#our-story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#couple" onClick={() => setMobileMenuOpen(false)}>The Couple</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#046c4a] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" id="our-story">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('${coupleImg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f6]/30 via-[#faf9f6]/70 to-[#faf9f6]/95" />

        {/* Ethereal Glow Circles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#93e9be]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#d0e7ea]/40 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 text-center px-6 max-w-2xl mx-auto bg-white/70 backdrop-blur-md p-10 md:p-14 rounded-2xl border border-white/80 shadow-[0_8px_32px_rgba(147,233,190,0.2)]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#046c4a] mb-4">
            {props.tagline || "TOGETHER WITH THEIR FAMILIES"}
          </p>

          <h1 className="font-serif italic text-6xl sm:text-7xl md:text-8xl text-[#046c4a] mb-2 drop-shadow-sm">
            {partner1}
          </h1>

          <p className="font-serif italic text-2xl text-[#5a5f62] mb-2">and</p>

          <h1 className="font-serif italic text-6xl sm:text-7xl md:text-8xl text-[#046c4a] mb-8 drop-shadow-sm">
            {partner2}
          </h1>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3f4943] mb-8">
            {props.inviteLine || "Invite you to celebrate their wedding"}
          </p>

          <div className="flex flex-col items-center justify-center space-y-3 mb-8 py-4 border-y border-[#93e9be]/50 bg-white/40 rounded-xl">
            <p className="text-2xl font-bold text-[#046c4a]">{props.weddingDate || "13th May 2026"}</p>
            <span className="w-12 h-0.5 bg-[#93e9be]" />
            <p className="text-sm text-[#5a5f62] font-semibold">{props.weddingTime || "10:00 AM Onwards"}</p>
            <p className="text-xs text-[#5a5f62]">{props.venuePlace || "St. Mary's Church & Grand Pearl Hotel"}</p>
          </div>

          <a
            href="#rsvp"
            className="inline-block bg-gradient-to-r from-[#93e9be] to-[#ffffff] text-[#046c4a] font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-[0_4px_15px_rgba(147,233,190,0.4)] hover:shadow-[0_6px_20px_rgba(147,233,190,0.6)] transition-all transform hover:-translate-y-0.5 border border-[#93e9be]"
          >
            Save the Date
          </a>
        </motion.div>
      </section>

      {/* Meet the Couple (Bride & Groom Photo Cards) */}
      <section className="py-24 bg-[#faf9f6] border-t border-[#046c4a]/10" id="couple">
        <div className="max-w-[1120px] mx-auto px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#046c4a] block mb-2">
            The Happy Couple
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#046c4a] mb-12">
            Meet the Bride &amp; Groom
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Bride Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-[#93e9be]/50 bg-white"
            >
              <img
                src={props.coupleImage || props.coverImage || "/images/templates/groom-bride-1.jpg"}
                alt={`${partner1} - Bride`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#046c4a]/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-left">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#93e9be] font-bold block">
                  Bride
                </span>
                <h3 className="text-3xl font-serif italic text-white leading-none mt-1">
                  {partner1}
                </h3>
              </div>
            </motion.div>

            {/* Groom Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-[#93e9be]/50 bg-white"
            >
              <img
                src={props.partnerTwoImage || props.coverImage || "/images/templates/groom-bride-2.jpg"}
                alt={`${partner2} - Groom`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#046c4a]/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-left">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#93e9be] font-bold block">
                  Groom
                </span>
                <h3 className="text-3xl font-serif italic text-white leading-none mt-1">
                  {partner2}
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 bg-white border-y border-[#046c4a]/10">
        <div className="max-w-[1120px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#046c4a] mb-3">Our Big Day</h2>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2.5 }} className="inline-block text-[#046c4a] mb-8">
            <Heart className="w-7 h-7 fill-current" />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center p-4 bg-[#faf9f6] rounded-2xl border border-[#93e9be]/40 min-w-[90px] shadow-sm">
              <span className="text-4xl font-bold text-[#1a1c1a]">{timeLeft.days}</span>
              <span className="text-[10px] font-bold text-[#5a5f62] uppercase tracking-widest mt-2">Days</span>
            </motion.div>
            <span className="text-3xl text-[#93e9be] font-light self-center">:</span>
            <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center p-4 bg-[#faf9f6] rounded-2xl border border-[#93e9be]/40 min-w-[90px] shadow-sm">
              <span className="text-4xl font-bold text-[#1a1c1a]">{timeLeft.hours}</span>
              <span className="text-[10px] font-bold text-[#5a5f62] uppercase tracking-widest mt-2">Hours</span>
            </motion.div>
            <span className="text-3xl text-[#93e9be] font-light self-center hidden sm:inline">:</span>
            <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center p-4 bg-[#faf9f6] rounded-2xl border border-[#93e9be]/40 min-w-[90px] shadow-sm">
              <span className="text-4xl font-bold text-[#1a1c1a]">{timeLeft.minutes}</span>
              <span className="text-[10px] font-bold text-[#5a5f62] uppercase tracking-widest mt-2">Minutes</span>
            </motion.div>
            <span className="text-3xl text-[#93e9be] font-light self-center">:</span>
            <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center p-4 bg-[#faf9f6] rounded-2xl border border-[#93e9be]/40 min-w-[90px] shadow-sm">
              <span className="text-4xl font-bold text-[#1a1c1a]">{timeLeft.seconds}</span>
              <span className="text-[10px] font-bold text-[#5a5f62] uppercase tracking-widest mt-2">Seconds</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wedding Events Section */}
      <section className="py-24 bg-[#faf9f6]" id="events">
        <div className="max-w-[1120px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#046c4a] mb-16 text-center">Wedding Events</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Marriage Ceremony */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="bg-white/80 backdrop-blur-md p-10 rounded-2xl text-center flex flex-col items-center relative overflow-hidden border border-white/90 shadow-[0_8px_32px_rgba(147,233,190,0.15)] group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#93e9be]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Church className="w-10 h-10 text-[#046c4a] mb-4" />
              <h3 className="font-serif italic text-3xl text-[#046c4a] mb-3">Marriage Ceremony</h3>
              <p className="text-lg font-bold text-[#1a1c1a] mb-1">{props.weddingDate || "13th May 2026"}</p>
              <p className="text-sm text-[#5a5f62] mb-6">10:00 AM - 12:00 PM</p>
              <p className="text-sm text-[#1a1c1a] font-semibold mb-8">St. Mary&apos;s Church, Seafoam Avenue</p>
              <a
                href="#"
                className="bg-gradient-to-r from-[#93e9be] to-[#ffffff] text-[#046c4a] font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-full inline-flex items-center gap-2 mt-auto border border-[#93e9be] shadow-sm group-hover:shadow-md transition-all"
              >
                <MapPin className="w-4 h-4" /> View on Map
              </a>
            </motion.div>

            {/* Reception */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white/80 backdrop-blur-md p-10 rounded-2xl text-center flex flex-col items-center relative overflow-hidden border border-white/90 shadow-[0_8px_32px_rgba(147,233,190,0.15)] group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#93e9be]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <PartyPopper className="w-10 h-10 text-[#046c4a] mb-4" />
              <h3 className="font-serif italic text-3xl text-[#046c4a] mb-3">Reception</h3>
              <p className="text-lg font-bold text-[#1a1c1a] mb-1">{props.weddingDate || "13th May 2026"}</p>
              <p className="text-sm text-[#5a5f62] mb-6">7:00 PM Onwards</p>
              <p className="text-sm text-[#1a1c1a] font-semibold mb-8">Grand Pearl Hotel, Ocean Drive</p>
              <a
                href="#"
                className="bg-gradient-to-r from-[#93e9be] to-[#ffffff] text-[#046c4a] font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-full inline-flex items-center gap-2 mt-auto border border-[#93e9be] shadow-sm group-hover:shadow-md transition-all"
              >
                <MapPin className="w-4 h-4" /> View on Map
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Timeline */}
      <section className="py-24 bg-[#f4f3f1]" id="timeline">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#046c4a] mb-16 text-center">Event Timeline</h2>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#93e9be] -translate-x-1/2" />

            <div className="space-y-12">
              {timelineList.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`flex flex-col md:flex-row items-center justify-between w-full relative ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`md:w-5/12 ${idx % 2 === 0 ? "text-left md:text-right pr-0 md:pr-8" : "pl-16 md:pl-8 text-left"} pl-16 md:pl-0`}>
                    <h4 className="text-2xl font-bold text-[#046c4a] mb-1">{item.title}</h4>
                    <p className="text-sm text-[#5a5f62]">{item.desc}</p>
                  </div>

                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#faf9f6] border-2 border-[#046c4a] -translate-x-1/2 shadow-[0_0_10px_rgba(4,108,74,0.3)]" />

                  <div className={`md:w-5/12 ${idx % 2 === 0 ? "pl-16 md:pl-8 text-left" : "text-left md:text-right pr-0 md:pr-8"} pl-16 md:pl-0 mt-2 md:mt-0`}>
                    <span className="text-xs font-bold text-[#046c4a] tracking-widest uppercase">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Moments Photo Gallery */}
      <section className="py-24 bg-white" id="gallery">
        <div className="max-w-[1120px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#046c4a] mb-16 text-center">Our Moments</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryList.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Love Story Video Film Section */}
      {props.showVideoSection !== false && Boolean(props.loveStoryVideoUrl) && (
        <section className="py-24 bg-[#faf9f6] border-t border-[#046c4a]/10" id="video">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#046c4a] block mb-2">
              Cherished Highlights
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#046c4a] mb-12">
              Our Celebration Film
            </h2>

            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-black group cursor-pointer flex items-center justify-center">
              {isPlayingVideo ? (
                <iframe
                  title="Seafoam Pearl Celebration Video"
                  src={getYouTubeEmbedUrl(props.loveStoryVideoUrl)}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                  <img
                    alt="Video poster thumbnail"
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                    src={
                      props.coverImage ||
                      props.heroImage ||
                      props.coupleImage ||
                      "/images/templates/couple-photo.jpg"
                    }
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <div className="absolute z-20 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center text-[#046c4a] group-hover:scale-110 transition-transform shadow-lg border border-[#93e9be]">
                    <Play className="w-10 h-10 fill-[#046c4a] ml-1" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="seafoam-pearl" />
      </div>

      {/* Footer */}
      <footer className="bg-[#f4f3f1] border-t border-[#046c4a]/10 py-12 px-6 text-center">
        <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif italic text-2xl text-[#046c4a]">
            {partner1} &amp; {partner2}
          </div>
          <div className="text-xs text-[#5a5f62]">
            &copy; 2026 {partner1} &amp; {partner2}. Handcrafted with love.
          </div>
        </div>
      </footer>
    </div>
  );
}
