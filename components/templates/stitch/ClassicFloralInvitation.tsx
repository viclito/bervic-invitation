"use client";

import { useState, useEffect } from "react";
import { getWeddingTargetDate } from "@/lib/dateUtils";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  PartyPopper,
  Wine,
  Heart,
  Menu,
  X,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";

export default function ClassicFloralInvitation(props: TemplateClassicFloralProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

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
    props.coupleImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC3LWlnsiO1-BBK1c17yXxt18k4AD3WCVwIO_o4sa5hDg203Rg_FgOYNNpucZEPPSyFPYnQQlyG0c3sOa-p_PprhSyzaMKsXKvTWB9H4lWbX2KYsVpqORm_-euQe_sOhHomG4H9UydO9sT3dFxlhFVyehidOB2HxpV7WaQegInAzPko5vf4aICGqPTvye8kFnjgea9yPIn4527jKOMUkKlmDI4HR1o_m6PoyBJnqv0FrV082VAn3eRW";

  const defaultTimeline = [
    { time: "2:00 PM", title: "The Vows", desc: "The ceremony begins at St. Patrick's Cathedral." },
    { time: "4:00 PM", title: "Cocktails & Mingle", desc: "Enjoy drinks and light bites on the terrace." },
    { time: "6:00 PM", title: "Dinner is Served", desc: "A three-course meal honoring the couple." },
    { time: "8:00 PM", title: "Dancing Begins", desc: "Join us on the dance floor to celebrate into the night!" },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t) => ({
          time: t.time,
          title: t.title,
          desc: t.desc || (t.date ? `Date: ${t.date}` : ""),
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

  const galleryList =
    props.galleryImages && props.galleryImages.filter((img) => Boolean(img && img.trim())).length > 0
      ? props.galleryImages.filter((img) => Boolean(img && img.trim()))
      : defaultGallery;

  return (
    <div className="bg-[#fbf9f4] text-[#1b1c19] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#31105C] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 2:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="classic-floral"
      />

      {/* Top Navbar */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#D4AF37]/20 ${
          navScrolled ? "bg-[#FFFFFF]/95 backdrop-blur-xl py-3 shadow-md" : "bg-[#FFFFFF]/80 backdrop-blur-md py-4"
        }`}
      >
        <div className="flex justify-between items-center w-full px-6 md:px-16 max-w-[1200px] mx-auto">
          <a href="#" className="font-serif text-2xl font-bold text-[#31105C] hover:text-[#D4AF37] transition-all hover:scale-105">
            {partner1} &amp; {partner2}
          </a>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#4a4452]">
            <a href="#our-story" className="hover:text-[#31105C] transition-colors relative group">
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#events" className="hover:text-[#31105C] transition-colors relative group">
              Events
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#gallery" className="hover:text-[#31105C] transition-colors relative group">
              Gallery
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#rsvp" className="hover:text-[#31105C] transition-colors relative group">
              RSVP
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#31105C] text-[#D4AF37] font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded hover:bg-[#D4AF37] hover:text-[#31105C] transition-all shadow-md transform hover:-translate-y-0.5"
          >
            RSVP
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#31105C]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#fbf9f4] border-b border-[#D4AF37]/30 px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#4a4452]"
          >
            <a href="#our-story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#31105C] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section with Botanical Framing */}
      <header className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 md:px-16 py-24 overflow-hidden bg-[#F1E9FF]/20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="z-20 max-w-3xl mx-auto flex flex-col items-center gap-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#31105C] text-xs font-bold uppercase tracking-[0.3em]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{props.tagline || "TOGETHER WITH THEIR FAMILIES"}</span>
          </div>

          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-[#31105C] tracking-tight leading-tight my-2 drop-shadow-sm"
          >
            {partner1} <span className="text-[#D4AF37] italic font-light">&amp;</span> {partner2}
          </motion.h1>

          <p className="font-serif italic text-xl text-[#735c00]">
            {props.inviteLine || "invite you to celebrate their wedding"}
          </p>

          <div className="mt-6 flex flex-col items-center gap-2 py-4 border-y border-[#D4AF37]/30 w-full max-w-md bg-white/40 backdrop-blur-sm rounded-xl">
            <span className="font-serif text-3xl font-bold text-[#1b1c19]">{props.weddingTime || "May 13, 2026"}</span>
            <span className="text-xs text-[#4a4452] font-semibold uppercase tracking-wider">St. Patrick's Cathedral &amp; The Grand Plaza</span>
          </div>
        </motion.div>
      </header>

      {/* Couple Image Section with Arch Frame */}
      <section className="py-24 px-6 md:px-16 max-w-[1200px] mx-auto relative" id="our-story">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 relative"
          >
            {/* Arch Framing Effect */}
            <div className="absolute inset-0 border-2 border-[#D4AF37] rounded-t-full -m-4 opacity-50 pointer-events-none" />
            <img
              src={coupleImg}
              alt="Couple Portrait"
              className="w-full h-auto rounded-t-full object-cover shadow-[0_10px_30px_rgba(49,16,92,0.1)] relative z-10"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 flex flex-col gap-6"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#31105C]">
              The Beginning of Forever
            </h2>
            <p className="text-base text-[#4a4452] leading-relaxed">
              {props.loveStoryText ||
                "From a chance encounter to a lifetime commitment, our journey has been nothing short of magical. We are thrilled to gather our closest friends and family to witness as we exchange our vows and start this beautiful new chapter together."}
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] rounded-full mt-2" />
          </motion.div>
        </div>
      </section>

      {/* Countdown Timer Bar */}
      <section className="py-16 bg-[#31105C] text-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2.5 }} className="inline-block mb-3">
            <Heart className="w-8 h-8 text-[#D4AF37] fill-current" />
          </motion.div>
          <h3 className="text-xs font-bold text-[#D4AF37] tracking-[0.25em] uppercase mb-8">THE COUNTDOWN BEGINS</h3>

          <div className="flex justify-center gap-6 md:gap-14 font-serif text-4xl md:text-5xl font-bold text-white">
            <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center p-3 rounded-xl bg-white/10 border border-white/20 min-w-[85px]">
              <span>{timeLeft.days}</span>
              <span className="text-[10px] font-sans font-bold text-[#D4AF37] uppercase tracking-widest mt-1">DAYS</span>
            </motion.div>
            <span className="text-[#D4AF37] font-light mt-2">:</span>
            <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center p-3 rounded-xl bg-white/10 border border-white/20 min-w-[85px]">
              <span>{timeLeft.hours}</span>
              <span className="text-[10px] font-sans font-bold text-[#D4AF37] uppercase tracking-widest mt-1">HOURS</span>
            </motion.div>
            <span className="text-[#D4AF37] font-light mt-2">:</span>
            <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center p-3 rounded-xl bg-white/10 border border-white/20 min-w-[85px]">
              <span>{timeLeft.minutes}</span>
              <span className="text-[10px] font-sans font-bold text-[#D4AF37] uppercase tracking-widest mt-1">MINS</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Details & Maps */}
      <section className="py-24 px-6 md:px-16 bg-[#ffffff]" id="events">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#31105C] mb-2">Event Details</h2>
            <p className="font-serif italic text-base text-[#735c00]">Join us for the celebration</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 relative">
            {/* Ceremony Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="bg-[#fbf9f4] p-8 md:p-12 relative shadow-md rounded-2xl text-center border border-[#D4AF37]/30 flex flex-col"
            >
              <div className="absolute inset-3 border border-[#D4AF37]/30 rounded-xl pointer-events-none" />
              <Church className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="font-serif text-3xl font-bold text-[#31105C] mb-1">The Ceremony</h3>
              <p className="text-xs font-semibold text-[#4a4452] uppercase tracking-wider mb-6">2:00 PM</p>
              <p className="text-sm text-[#1b1c19] font-bold mb-1">St. Patrick&apos;s Cathedral</p>
              <p className="text-xs text-[#4a4452] mb-8">123 Wedding Lane, Cityville</p>
              <div className="w-full h-48 bg-[#e4e2dd] mb-8 rounded-xl overflow-hidden shadow-inner">
                <iframe
                  title="Ceremony Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.14483011405021!3d40.6976312333469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* Reception Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-[#fbf9f4] p-8 md:p-12 relative shadow-md rounded-2xl text-center border border-[#D4AF37]/30 flex flex-col"
            >
              <div className="absolute inset-3 border border-[#D4AF37]/30 rounded-xl pointer-events-none" />
              <PartyPopper className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="font-serif text-3xl font-bold text-[#31105C] mb-1">The Reception</h3>
              <p className="text-xs font-semibold text-[#4a4452] uppercase tracking-wider mb-6">5:00 PM</p>
              <p className="text-sm text-[#1b1c19] font-bold mb-1">The Grand Plaza</p>
              <p className="text-xs text-[#4a4452] mb-8">456 Celebration Blvd, Cityville</p>
              <div className="w-full h-48 bg-[#e4e2dd] mb-8 rounded-xl overflow-hidden shadow-inner">
                <iframe
                  title="Reception Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.14483011405021!3d40.6976312333469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
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

      {/* Wedding Day Timeline */}
      <section className="py-24 px-6 md:px-16 bg-[#F1E9FF]/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#31105C] mb-2">Wedding Day Timeline</h2>
            <p className="font-serif italic text-base text-[#735c00]">The order of events</p>
          </div>

          <div className="relative border-l-2 md:border-l-0 border-[#D4AF37] ml-4 md:mx-auto">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#D4AF37] -translate-x-1/2" />

            <div className="space-y-12">
              {timelineList.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`flex flex-col md:flex-row items-center w-full ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`md:w-1/2 ${idx % 2 === 0 ? "md:pr-12 text-left md:text-right" : "md:pl-12 text-left"} pl-8 md:pl-0 w-full relative`}>
                    <div className="absolute w-4 h-4 rounded-full bg-[#31105C] border-2 border-[#D4AF37] -left-[9px] md:left-auto md:-right-[8px] top-1" />
                    <p className="text-xs font-bold text-[#D4AF37] mb-1 uppercase tracking-widest">{item.time}</p>
                    <h4 className="font-serif text-xl font-bold text-[#31105C] mb-1">{item.title}</h4>
                    <p className="text-xs text-[#4a4452]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Arched Moments Gallery */}
      <section className="py-24 px-6 md:px-16 bg-[#ffffff]" id="gallery">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#31105C] mb-2">Our Moments</h2>
            <p className="font-serif italic text-base text-[#735c00]">A glimpse into our beautiful journey</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {galleryList.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                className={`relative overflow-hidden group aspect-[4/5] border-2 border-[#D4AF37]/40 p-2 shadow-md ${
                  idx % 2 === 0 ? "rounded-t-full" : "rounded-b-full md:mt-4"
                }`}
              >
                <img
                  src={img}
                  alt={`Our Moment ${idx + 1}`}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                    idx % 2 === 0 ? "rounded-t-full" : "rounded-b-full"
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="classic-floral" />
      </div>

      {/* Footer */}
      <footer className="bg-[#31105C] text-white border-t border-[#D4AF37]/30 py-16 text-center">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-4">
          <span className="font-serif text-3xl font-bold text-[#D4AF37]">{initials}</span>
          <p className="text-xs text-[#F1E9FF]/80">
            With Love, {partner1} &amp; {partner2} — 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
