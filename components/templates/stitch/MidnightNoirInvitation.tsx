"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Sparkles,
  MapPin,
  Clock,
  Play,
  ArrowUpRight,
  Menu,
  X,
  Heart,
} from "lucide-react";

export default function MidnightNoirInvitation(props: TemplateClassicFloralProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 42, hours: 14, minutes: 59, seconds: 20 });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const targetDate = new Date(props.weddingDate || "2026-11-18T17:00:00").getTime();
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

  const defaultTimeline = [
    { time: "4:30 PM", title: "Guest Arrival", desc: "Welcome drinks and seating." },
    { time: "5:00 PM", title: "The Ceremony", desc: "Exchange of vows under the stars." },
    { time: "6:00 PM", title: "Cocktail Hour", desc: "Signature drinks and hors d'oeuvres." },
    { time: "7:30 PM", title: "Dinner & Dancing", desc: "Curated menu and celebration." },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t) => ({
          time: t.time,
          title: t.title,
          desc: "Main Venue Event",
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
    <div className="bg-[#081425] text-[#d8e3fb] font-sans antialiased selection:bg-[#c1c7cf] selection:text-[#081425] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "Saturday, November 18th • 5:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="midnight-noir"
      />

      {/* Ambient Radial Backdrop Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30 mix-blend-screen"
        style={{
          background: "radial-gradient(circle at 50% 0%, #1f2a3c, #081425 70%)",
        }}
      />

      {/* Top Bar Shell */}
      <nav
        className={`fixed top-0 w-full z-40 flex justify-between items-center px-6 md:px-16 transition-all duration-500 border-b border-[#45474b]/30 ${
          navScrolled ? "bg-[#081425]/95 backdrop-blur-md py-3 shadow-2xl" : "bg-[#081425]/80 backdrop-blur-sm py-5"
        }`}
      >
        <a href="#" className="font-serif text-xl md:text-2xl font-bold tracking-widest text-[#d8e3fb] uppercase hover:text-[#c1c7cf] transition-all">
          LUMIÈRE &amp; NOIR
        </a>

        <div className="hidden md:flex gap-10 items-center text-xs font-bold uppercase tracking-[0.2em] text-[#c6c6cb]">
          <a href="#story" className="hover:text-[#c1c7cf] transition-colors relative group">
            Our Story
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c1c7cf] transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#details" className="hover:text-[#c1c7cf] transition-colors relative group">
            Event Details
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c1c7cf] transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#timeline" className="hover:text-[#c1c7cf] transition-colors relative group">
            Timeline
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c1c7cf] transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#locations" className="hover:text-[#c1c7cf] transition-colors relative group">
            Locations
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c1c7cf] transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#gallery" className="hover:text-[#c1c7cf] transition-colors relative group">
            Gallery
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c1c7cf] transition-all duration-300 group-hover:w-full" />
          </a>
        </div>

        <a
          href="#rsvp"
          className="bg-[#c1c7cf] text-[#161c22] font-bold text-xs uppercase tracking-widest px-7 py-3 rounded-sm hover:bg-[#dde3eb] transition-all transform hover:-translate-y-0.5 shadow-lg hidden md:block"
        >
          RSVP
        </a>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#d8e3fb] p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden fixed top-[70px] inset-x-0 bg-[#081425] border-b border-[#45474b]/40 z-50 px-6 py-4 flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-[#c6c6cb]"
        >
          <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
          <a href="#details" onClick={() => setMobileMenuOpen(false)}>Event Details</a>
          <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
          <a href="#locations" onClick={() => setMobileMenuOpen(false)}>Locations</a>
          <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
          <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#c1c7cf] font-extrabold">RSVP NOW</a>
        </motion.div>
      )}

      <main className="pt-20 relative z-10">
        {/* Hero Section */}
        <section className="min-h-[880px] relative flex items-center justify-center px-6 md:px-16 py-24" id="story">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-[1200px] mx-auto text-center flex flex-col items-center gap-10"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#152031] border border-[#45474b]/40 text-[#c1c7cf] text-xs font-bold uppercase tracking-[0.3em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>You are invited to witness the union of</span>
            </div>

            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.2 }}
              className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold text-[#d8e3fb] tracking-tight leading-tight"
            >
              {partner1} <span className="text-[#c1c7cf] italic font-light">&amp;</span> {partner2}
            </motion.h1>

            {/* Glowing Vertical Line */}
            <div className="w-0.5 h-24 bg-gradient-to-b from-[#c1c7cf] via-[#c1c7cf]/40 to-transparent my-2 animate-pulse" />

            {/* Countdown Grid */}
            <div className="flex gap-8 md:gap-14 text-center">
              <motion.div whileHover={{ y: -4 }} className="flex flex-col gap-1 p-4 rounded-xl bg-[#152031]/80 border border-[#45474b]/30 min-w-[80px]">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#d8e3fb]">{timeLeft.days}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c6c6cb]">Days</span>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="flex flex-col gap-1 p-4 rounded-xl bg-[#152031]/80 border border-[#45474b]/30 min-w-[80px]">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#d8e3fb]">{timeLeft.hours}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c6c6cb]">Hours</span>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="flex flex-col gap-1 p-4 rounded-xl bg-[#152031]/80 border border-[#45474b]/30 min-w-[80px]">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#d8e3fb]">{timeLeft.minutes}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c6c6cb]">Mins</span>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="flex flex-col gap-1 p-4 rounded-xl bg-[#152031]/80 border border-[#45474b]/30 min-w-[80px]">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#d8e3fb]">{timeLeft.seconds}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c6c6cb]">Secs</span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* The Details Section */}
        <section className="py-28 px-6 md:px-16 bg-[#040e1f] relative border-t border-[#45474b]/30" id="details">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row gap-12 md:gap-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="md:w-1/3 flex flex-col gap-6"
              >
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#d8e3fb] leading-tight">
                  The <br /><span className="text-[#c1c7cf] italic font-normal">Details</span>
                </h2>
                <p className="text-sm text-[#c6c6cb] max-w-sm leading-relaxed">
                  Join us for an evening of architectural elegance and modern romance under the midnight sky.
                </p>
              </motion.div>

              <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Ceremony */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ x: 4 }}
                  className="flex flex-col gap-4 relative group p-6 rounded-2xl bg-[#081425] border border-[#45474b]/30 shadow-md"
                >
                  <span className="text-xs font-bold text-[#c1c7cf] tracking-widest uppercase">Ceremony</span>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#d8e3fb] mb-1">The Grand Atrium</h3>
                    <p className="text-xs text-[#c6c6cb] leading-relaxed">
                      {props.weddingTime || "Saturday, November 18th, 2026"}<br />Five O'clock in the Evening
                    </p>
                  </div>
                  <p className="text-xs text-[#c6c6cb]">
                    100 Midnight Boulevard<br />Metropolis
                  </p>
                </motion.div>

                {/* Reception */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex flex-col gap-4 relative group p-6 rounded-2xl bg-[#081425] border border-[#45474b]/30 shadow-md"
                >
                  <span className="text-xs font-bold text-[#c1c7cf] tracking-widest uppercase">Reception</span>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#d8e3fb] mb-1">Noir Gallery</h3>
                    <p className="text-xs text-[#c6c6cb] leading-relaxed">
                      Follows immediately after ceremony<br />Dinner, drinks, and dancing
                    </p>
                  </div>
                  <p className="text-xs text-[#c6c6cb]">
                    Black Tie Strictly Enforced<br />Adults Only Affair
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Timeline */}
        <section className="py-28 px-6 md:px-16 bg-[#081425] relative border-t border-[#45474b]/30" id="timeline">
          <div className="max-w-3xl mx-auto flex flex-col gap-14 relative z-10">
            <div className="text-center flex flex-col gap-3">
              <h2 className="font-serif text-4xl font-bold text-[#d8e3fb]">
                Event <span className="text-[#c1c7cf] italic font-normal">Timeline</span>
              </h2>
              <p className="text-xs text-[#c6c6cb]">The sequence of our evening.</p>
            </div>

            <div className="relative">
              <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#c1c7cf]/40 to-transparent -translate-x-1/2" />

              <div className="flex flex-col gap-10">
                {timelineList.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`relative flex flex-col ${
                      idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    } items-start md:items-center justify-between w-full group`}
                  >
                    <div className={`md:w-[45%] ${idx % 2 === 0 ? "text-left md:text-right pr-0 md:pr-10" : "text-left pl-10 md:pl-10"} pl-10 md:pl-0`}>
                      <h3 className="font-serif text-xl font-bold text-[#d8e3fb] mb-1">{item.title}</h3>
                      <p className="text-xs text-[#c6c6cb]">{item.desc}</p>
                    </div>

                    <div className="absolute left-[15px] md:left-1/2 w-4 h-4 rounded-full bg-[#081425] border-2 border-[#c1c7cf] -translate-x-1/2 mt-1 md:mt-0 z-10 shadow-[0_0_12px_rgba(193,199,207,0.4)] group-hover:scale-125 transition-transform duration-300" />

                    <div className={`md:w-[45%] ${idx % 2 === 0 ? "pl-10 md:pl-10 text-left" : "pl-10 md:pl-0 md:pr-10 md:text-right"} text-xs font-bold text-[#c1c7cf] tracking-widest pt-1 md:pt-0`}>
                      {item.time}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section with Inverted Dark Maps */}
        <section className="py-28 px-6 md:px-16 bg-[#111c2d] border-t border-[#45474b]/30" id="locations">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center flex flex-col gap-3 mb-14">
              <h2 className="font-serif text-4xl font-bold text-[#d8e3fb]">
                Event <span className="text-[#c1c7cf] italic font-normal">Locations</span>
              </h2>
              <p className="text-xs text-[#c6c6cb]">Navigating the evening.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Map Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#081425] border border-[#45474b]/40 rounded-2xl overflow-hidden group hover:border-[#c1c7cf]/50 transition-colors shadow-lg"
              >
                <div className="h-[280px] w-full relative overflow-hidden grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-700">
                  <iframe
                    title="Ceremony Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                    loading="lazy"
                  />
                </div>
                <div className="p-8 flex flex-col gap-3">
                  <span className="text-xs font-bold text-[#c1c7cf] tracking-widest uppercase">Ceremony</span>
                  <h3 className="font-serif text-2xl font-bold text-[#d8e3fb]">The Grand Atrium</h3>
                  <p className="text-xs text-[#c6c6cb]">100 Midnight Boulevard, Metropolis</p>
                  <a href="#" className="inline-flex items-center gap-1.5 text-[#c1c7cf] text-xs font-bold tracking-widest uppercase hover:text-white transition-colors mt-3">
                    <span>Get Directions</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>

              {/* Map Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-[#081425] border border-[#45474b]/40 rounded-2xl overflow-hidden group hover:border-[#c1c7cf]/50 transition-colors shadow-lg"
              >
                <div className="h-[280px] w-full relative overflow-hidden grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-700">
                  <iframe
                    title="Reception Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                    loading="lazy"
                  />
                </div>
                <div className="p-8 flex flex-col gap-3">
                  <span className="text-xs font-bold text-[#c1c7cf] tracking-widest uppercase">Reception</span>
                  <h3 className="font-serif text-2xl font-bold text-[#d8e3fb]">Noir Gallery</h3>
                  <p className="text-xs text-[#c6c6cb]">250 Obsidian Way, Metropolis</p>
                  <a href="#" className="inline-flex items-center gap-1.5 text-[#c1c7cf] text-xs font-bold tracking-widest uppercase hover:text-white transition-colors mt-3">
                    <span>Get Directions</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Moments Gallery */}
        <section className="py-28 px-6 md:px-16 bg-[#081425] border-t border-[#45474b]/30" id="gallery">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center flex flex-col gap-3 mb-14">
              <h2 className="font-serif text-4xl font-bold text-[#d8e3fb]">
                Our <span className="text-[#c1c7cf] italic font-normal">Moments</span>
              </h2>
              <p className="text-xs text-[#c6c6cb]">Glimpses into our journey.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryList.slice(0, 6).map((imgUrl, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="rounded-2xl overflow-hidden border border-[#45474b]/40 aspect-square shadow-md group relative cursor-pointer"
                >
                  <img
                    src={imgUrl}
                    alt={`Moment ${idx + 1}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out transform group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-[#081425]/20 group-hover:bg-transparent transition-colors duration-700" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Proposal Feature */}
        <section className="py-28 relative min-h-[500px] flex items-center justify-center overflow-hidden bg-[#040e1f] border-t border-[#45474b]/30 text-center">
          <div className="relative z-10 flex flex-col items-center gap-6 px-6">
            <h2 className="font-serif text-4xl font-bold text-[#d8e3fb]">
              The <span className="text-[#c1c7cf] italic font-normal">Proposal</span>
            </h2>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full border-2 border-[#c1c7cf] flex items-center justify-center group bg-[#081425]/80 backdrop-blur-sm hover:bg-[#c1c7cf] transition-all duration-500 relative shadow-2xl"
            >
              <span className="absolute inset-0 rounded-full border border-[#c1c7cf] animate-ping opacity-30 pointer-events-none" />
              <Play className="w-8 h-8 text-[#c1c7cf] group-hover:text-[#081425] ml-1 transition-colors fill-current" />
            </motion.button>

            <span className="text-xs font-bold text-[#c1c7cf] uppercase tracking-widest mt-2">
              Watch The Motion Film
            </span>
          </div>
        </section>

        {/* RSVP Section */}
        <div id="rsvp">
          <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="midnight-noir" />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-6 flex flex-col items-center gap-4 bg-[#040e1f] border-t border-[#45474b]/20 text-center relative z-10">
        <span className="font-serif text-3xl font-bold tracking-widest text-[#d8e3fb]">
          LUMIÈRE &amp; NOIR
        </span>
        <div className="flex gap-8 text-xs font-semibold text-[#c6c6cb] mt-2">
          <a href="#" className="hover:text-[#c1c7cf] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#c1c7cf] transition-colors">Registry</a>
          <a href="#" className="hover:text-[#c1c7cf] transition-colors">Contact</a>
        </div>
        <p className="text-xs text-[#c1c7cf]/60 mt-4 tracking-wider">
          © 2026 {partner1} &amp; {partner2}. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
