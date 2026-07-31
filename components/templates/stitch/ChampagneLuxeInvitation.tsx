"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function ChampagneLuxeInvitation(props: TemplateClassicFloralProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* The Details Section */}
        <section className="py-24 px-6 md:px-16 bg-[#f4f3f1]" id="details">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-light text-[#735c00]">The Details</h2>
              <div className="h-0.5 w-24 bg-[#d0c5af] mx-auto mt-4" />
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white/50 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-2xl shadow-[0_10px_40px_-10px_rgba(212,175,55,0.08)] relative overflow-hidden flex flex-col gap-6"
              >
                <div className="absolute top-4 right-4 opacity-15 text-[#735c00]">
                  <Church className="w-16 h-16" />
                </div>

                <div>
                  <h3 className="font-serif text-3xl font-light text-[#735c00] mb-2">Ceremony</h3>
                  <p className="text-xs font-semibold text-[#685d4a] uppercase tracking-wider mb-2">3:00 PM in the Afternoon</p>
                  <p className="text-sm text-[#1a1c1a] leading-relaxed">
                    The Grand Estate Gardens<br />123 Champagne Boulevard<br />Beverly Hills, CA 90210
                  </p>
                </div>

                <div className="h-px w-full bg-[#d0c5af]/40 my-2" />

                <div>
                  <h3 className="font-serif text-3xl font-light text-[#735c00] mb-2">Reception</h3>
                  <p className="text-xs font-semibold text-[#685d4a] uppercase tracking-wider mb-2">6:00 PM in the Evening</p>
                  <p className="text-sm text-[#1a1c1a] leading-relaxed">
                    The Glass Conservatory<br />Dinner, dancing, and celebrations to follow.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl border border-[#d0c5af]/40 group"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5ZBSVi6ZFGGktCxO8BRSXhu4U_4g5eh4s4t2thzsReW256sU1bXFNlbu9M0XKep96SLVXvh0Obp7rj4WfjrHL7zEVTI27XdiswLNS3LvIbjpjKXYfJnaaQij1Epe28Fpdv9Gu7alUAKuJpjlHWeEe7FWv19XGZR45bp725IFe5AHHO_2Zb-T-zOrcXKIOVxYHGr1JT9LFIahbGWE8FJI2mE-2_mrsU2Glqp2WrXsIzTRfJ0sd0FUN"
                  alt="Reception Editorial Details"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#685d4a]/10 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
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
              className="relative w-full rounded-2xl overflow-hidden shadow-xl aspect-video bg-[#e3e2e0] group cursor-pointer border border-[#d0c5af]/40"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAORY9siwAN-JdJdGrTwXTw25F_Ww6LUbZTU8C1sHkmFEy7bq_tvRJJESSMsPXKGroLYJEjo30l3g_i6whtnldfOV73vanlfVEkuk-eheRd21Ge7yEkbbDMnlZlz8hdvyzQPh9PHKZZ6kv8JE5A9zbOcbMK4NFf0mA0N9BR8HkOO8-A7Ha_78Wnr7IEPbDj31fX4pYTLlfmlW2Zprauy7T34gU6e2nc5fIcsLkPDOdxRKaR2YBwPaUq"
                alt="Video Thumbnail"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/80 text-[#735c00] rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-500 group-hover:scale-110 border border-white/60 shadow-lg">
                  <Play className="w-8 h-8 ml-1 fill-current" />
                </div>
              </div>
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
