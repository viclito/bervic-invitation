"use client";

import { useState } from "react";
import { getYouTubeEmbedUrl } from "@/lib/dateUtils";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  PartyPopper,
  Wine,
  Clock,
  Play,
  Menu,
  X,
  Sparkles,
  MapPin,
} from "lucide-react";

export default function ChampagneLuxeInvitation(props: TemplateClassicFloralProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const partner1 = props.partnerOne || "Terance";
  const partner2 = props.partnerTwo || "Ancy";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const heroBg =
    props.heroImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBvtRGl_mmbjLP_vTzc6MHhDEp4Q4QvyJjYtlb4btMTXd_x56p7IxFHwLQvcexORPcCmzinjuiJvrfP03V_lc3XzaN_gMzivL6e79e79MbG18n2aRFEkX2dQcEbiz0P2KUxvORqK005ZQSwig8soBxdcjuCFPpFbejuhP4WCLUTr2SqOSu5AAoo3ZfZhtbOBGN6Vy3nxvUdDegW_Y4NAoHfwFHLI9XeWucoRz_6UeJvILRrEmtwfoih";

  const defaultTimeline = [
    { time: "3:00 PM", title: "Ceremony", venue: "The Grand Estate Gardens", icon: "church" },
    { time: "4:30 PM", title: "Cocktails", venue: "The Rose Terrace", icon: "bar" },
    { time: "6:00 PM", title: "Reception", venue: "The Glass Conservatory", icon: "party" },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t, idx) => ({
          time: t.time,
          title: t.title,
          venue: "Main Venue",
          icon: idx % 3 === 0 ? "church" : idx % 3 === 1 ? "bar" : "party",
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
    <div className="bg-[#faf9f6] text-[#1a1c1a] font-sans antialiased selection:bg-[#d4af37]/30 selection:text-[#735c00] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 3:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="champagne-luxe"
      />

      {/* Ambient Gold Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#d4af37]/10 via-[#ffe088]/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-[#faf9f6]/70 backdrop-blur-xl border-b border-[#d0c5af]/30 transition-all duration-500">
        <div className="flex justify-between items-center px-6 md:px-16 py-5 max-w-[1200px] mx-auto">
          <a href="#" className="font-serif text-2xl italic font-bold text-[#735c00] hover:text-[#d4af37] transition-all hover:scale-105">
            {partner1} &amp; {partner2}
          </a>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#685d4a]">
            <a href="#story" className="hover:text-[#735c00] transition-colors relative group">
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#details" className="hover:text-[#735c00] transition-colors relative group">
              Event Details
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#timeline" className="hover:text-[#735c00] transition-colors relative group">
              Timeline
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#locations" className="hover:text-[#735c00] transition-colors relative group">
              Locations
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#gallery" className="hover:text-[#735c00] transition-colors relative group">
              Gallery
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#735c00] text-white text-xs font-bold uppercase tracking-widest px-7 py-3 rounded-sm hover:bg-[#d4af37] transition-all shadow-md transform hover:-translate-y-0.5"
          >
            RSVP
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#735c00] p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#faf9f6] border-b border-[#d0c5af]/40 px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#685d4a]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#details" onClick={() => setMobileMenuOpen(false)}>Event Details</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#locations" onClick={() => setMobileMenuOpen(false)}>Locations</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#735c00] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      <main className="pt-24 md:pt-32 relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[820px] flex items-center justify-center px-6 md:px-16 overflow-hidden py-16" id="story">
          <div className="absolute inset-0 z-0">
            <img src={heroBg} alt="Hero Soft Background" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f6]/40 via-[#faf9f6]/70 to-[#faf9f6]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 text-center max-w-4xl mx-auto bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_10px_40px_-10px_rgba(212,175,55,0.12)] rounded-2xl p-8 md:p-16 flex flex-col items-center gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#735c00]/10 border border-[#735c00]/20 text-[#735c00] text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{props.tagline || "JOIN US TO CELEBRATE"}</span>
            </div>

            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="font-serif text-4xl sm:text-5xl md:text-7xl font-light text-[#735c00] tracking-tight leading-tight"
            >
              {partner1} <span className="text-[#d4af37] text-4xl sm:text-5xl md:text-6xl mx-2 italic font-light">&amp;</span> {partner2}
            </motion.h1>

            <p className="text-lg text-[#685d4a] max-w-lg mx-auto font-light leading-relaxed">
              {props.inviteLine || "We invite you to share in our joy as we begin our new life together."}
            </p>

            <p className="font-serif text-3xl font-normal text-[#735c00] tracking-wide mt-2">
              {props.weddingTime || "May 13, 2026"}
            </p>

            <motion.div whileHover={{ scale: 1.05 }} className="mt-4">
              <a
                href="#rsvp"
                className="inline-block px-10 py-4 border border-[#735c00] text-[#735c00] text-xs font-bold uppercase tracking-widest hover:bg-[#735c00] hover:text-white transition-all shadow-md"
              >
                RSVP Now
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Section 1: Meet the Couple */}
        <section className="py-20 px-6 md:px-16 bg-[#faf9f6] border-b border-[#d0c5af]/30" id="couple">
          <div className="max-w-[1000px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37] block mb-1">
                The Blessed Union
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-[#735c00]">
                Meet the Couple
              </h2>
              <div className="h-0.5 w-24 bg-[#d0c5af] mx-auto mt-4" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {/* Bride Card */}
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl border-2 border-[#d0c5af]/50 bg-white"
              >
                <img
                  src={props.coupleImage || props.coverImage || "/images/templates/groom-bride-1.jpg"}
                  alt={`${partner1} - Bride`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4a3b00]/90 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 text-left">
                  <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#f2ca50] font-bold block">
                    Bride
                  </span>
                  <h3 className="text-2xl font-serif font-light text-white leading-none mt-1">
                    {partner1}
                  </h3>
                </div>
              </motion.div>

              {/* Groom Card */}
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl border-2 border-[#d0c5af]/50 bg-white"
              >
                <img
                  src={props.partnerTwoImage || props.coverImage || "/images/templates/groom-bride-2.jpg"}
                  alt={`${partner2} - Groom`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4a3b00]/90 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 text-left">
                  <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#f2ca50] font-bold block">
                    Groom
                  </span>
                  <h3 className="text-2xl font-serif font-light text-white leading-none mt-1">
                    {partner2}
                  </h3>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 2: Event Schedule & Functions */}
        <section className="py-24 px-6 md:px-16 bg-[#f4f3f1]" id="details">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37] block mb-1">
                The Celebrations
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-[#735c00]">
                Event Schedule &amp; Functions
              </h2>
              <div className="h-0.5 w-24 bg-[#d0c5af] mx-auto mt-4" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(props.events && props.events.length > 0
                ? props.events
                : [
                    {
                      time: props.weddingTime || "3:00 PM",
                      title: "Wedding Ceremony",
                      location: props.venuePlace || "The Grand Estate Gardens",
                      description: "Sacred marriage ceremony surrounded by family & friends.",
                    },
                    {
                      time: "6:00 PM",
                      title: "Evening Reception",
                      location: props.venuePlace || "The Glass Conservatory",
                      description: "Dinner, dancing, and celebrations to follow.",
                    },
                  ]
              ).map((evt: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white/80 backdrop-blur-xl border border-white/90 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#735c00]/10 border border-[#735c00]/20 text-xs font-bold text-[#735c00] uppercase tracking-wider mb-4">
                      {evt.time} {evt.date ? `• ${evt.date}` : ""}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-[#735c00] mb-2">
                      {evt.title}
                    </h3>
                    {evt.location && (
                      <p className="text-xs text-[#685d4a] font-medium flex items-center gap-1.5 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{evt.location}</span>
                      </p>
                    )}
                    {evt.description && (
                      <p className="text-xs text-[#685d4a] leading-relaxed font-light">
                        {evt.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Locations Section with Maps */}
        <section className="py-24 px-6 md:px-16 bg-[#faf9f6]" id="locations">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-light text-[#735c00]">Locations</h2>
              <div className="h-0.5 w-24 bg-[#d0c5af] mx-auto mt-4" />
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              {/* Ceremony Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl border border-[#d0c5af]/40 shadow-sm flex flex-col gap-4"
              >
                <h3 className="font-serif text-2xl font-light text-[#735c00]">The Ceremony</h3>
                <p className="text-xs text-[#685d4a] font-semibold uppercase tracking-wider">The Grand Estate Gardens</p>
                <div className="w-full h-64 rounded-xl overflow-hidden bg-[#e3e2e0] border border-[#d0c5af]/30">
                  <iframe
                    title="Ceremony Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.7432328738316!2d-118.40685952448375!3d34.07542917314842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </motion.div>

              {/* Reception Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl border border-[#d0c5af]/40 shadow-sm flex flex-col gap-4"
              >
                <h3 className="font-serif text-2xl font-light text-[#735c00]">The Reception</h3>
                <p className="text-xs text-[#685d4a] font-semibold uppercase tracking-wider">The Glass Conservatory</p>
                <div className="w-full h-64 rounded-xl overflow-hidden bg-[#e3e2e0] border border-[#d0c5af]/30">
                  <iframe
                    title="Reception Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.7432328738316!2d-118.40685952448375!3d34.07542917314842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 px-6 md:px-16 bg-[#f4f3f1]" id="timeline">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-light text-[#735c00]">Timeline of Events</h2>
              <div className="h-0.5 w-24 bg-[#d0c5af] mx-auto mt-4" />
            </div>

            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto before:-translate-x-px md:before:translate-x-0 before:h-full before:w-px before:bg-[#d0c5af]/60">
              {timelineList.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#d0c5af] bg-[#faf9f6] text-[#735c00] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10">
                    {item.icon === "church" && <Church className="w-4 h-4" />}
                    {item.icon === "bar" && <Wine className="w-4 h-4" />}
                    {item.icon === "party" && <PartyPopper className="w-4 h-4" />}
                  </div>

                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm">
                    <p className="text-xs font-bold text-[#685d4a] uppercase tracking-widest mb-1">{item.time}</p>
                    <h4 className="font-serif text-2xl font-light text-[#735c00] mb-1">{item.title}</h4>
                    <p className="text-xs text-[#1a1c1a]">{item.venue}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Moments Gallery */}
        <section className="py-24 px-6 md:px-16 bg-[#faf9f6]" id="gallery">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-light text-[#735c00]">Our Moments</h2>
              <div className="h-0.5 w-24 bg-[#d0c5af] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {galleryList.map((imgUrl, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`rounded-2xl overflow-hidden group shadow-md border border-[#d0c5af]/30 ${
                    idx === 0 ? "sm:col-span-2 sm:row-span-2 aspect-square" : "aspect-square"
                  }`}
                >
                  <img src={imgUrl} alt={`Moment ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Film Section */}
        <section className="py-24 px-6 md:px-16 bg-[#f4f3f1]" id="video">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-center mb-14">
              <h2 className="font-serif text-4xl font-light text-[#735c00]">A Glimpse</h2>
              <div className="h-0.5 w-24 bg-[#d0c5af] mx-auto mt-4" />
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative w-full rounded-2xl overflow-hidden shadow-xl aspect-video bg-black group cursor-pointer border border-[#d0c5af]/40"
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
                    src={props.coverImage || props.heroImage || props.coupleImage || "/images/templates/couple-photo.jpg"}
                    alt="Video Cover Photo"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/80 text-[#735c00] rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-500 group-hover:scale-110 border border-white/60 shadow-lg">
                      <Play className="w-8 h-8 ml-1 fill-current" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* RSVP Section */}
        <div id="rsvp">
          <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="champagne-luxe" />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 bg-[#faf9f6] border-t border-[#d0c5af]/30 flex flex-col items-center gap-4 text-center">
        <a href="#" className="font-serif text-3xl italic font-bold text-[#735c00]">
          {initials}
        </a>
        <div className="flex gap-8 text-xs font-semibold uppercase tracking-widest text-[#685d4a] mt-2">
          <a href="#story" className="hover:text-[#735c00]">Our Story</a>
          <a href="#details" className="hover:text-[#735c00]">Event Details</a>
          <a href="#rsvp" className="hover:text-[#735c00]">RSVP</a>
          <a href="#gallery" className="hover:text-[#735c00]">Gallery</a>
        </div>
        <p className="text-xs text-[#685d4a] mt-4">
          © 2026 {partner1} &amp; {partner2}. Crafted with love.
        </p>
      </footer>
    </div>
  );
}
