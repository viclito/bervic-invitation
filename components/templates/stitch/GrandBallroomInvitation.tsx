"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  PartyPopper,
  Wine,
  Menu,
  X,
  Sparkles,
  MapPin,
  Clock,
  Shirt,
  Play,
} from "lucide-react";

export default function GrandBallroomInvitation(props: TemplateClassicFloralProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

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

  const partner1 = props.partnerOne || "Elias";
  const partner2 = props.partnerTwo || "Sophia";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const heroBallroomImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDPiSWwZuWF5lnBNg6pqKyu587msdF134pWzJkSddp1d9fS_F12V7moqHPQdgqziFCtCT7VtKjExV243eaLuzoCOx82iPmcKMmDwZKyV572LbYEeZ1pAEmG_tDqK47RICLeb7JxNle_l_w5V_b0vAyIfXf8UZ9Z1zbmNzK_242hq8D4PHlzsdVaZJ-qNkqxTh73y630VODGi3vbZb_BHo5BgNYB5xP_hStGKXKnkCv_uHddD4k5JzC-";

  const mandapImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBOKTYrPoHDJYdajFSzpXiuIBT7k8fowDi8bZKGGM-Ze3-y7TrctJMkPia3lWnv-VKd4vtlUhIv82wP6QAu947LsxfStD4akikV-1WZ0TzRJR6IfZkYvYyQqPeISrdVPbpkMesabEahjD10XB2e4zoVsAxDHMU41bHyc90J0V5DXYqDZEEvsybzyYXSh5kRdErS1IwTepvPHjq-xp01TkhEHZB4MgtmKAnGW1HSHAHubI6xwZBBz3bp";

  const defaultTimeline = [
    { time: "4:00 PM", title: "The Vows", desc: "The ceremony begins at the Cathedral of St. Regis.", icon: <Church className="w-4 h-4 text-[#31105C]" /> },
    { time: "6:00 PM", title: "Cocktails", desc: "Drinks and hors d'oeuvres in the Grand Foyer.", icon: <Wine className="w-4 h-4 text-[#31105C]" /> },
    { time: "7:30 PM", title: "Dinner & Dancing", desc: "An evening of fine dining and celebration in the Crystal Ballroom.", icon: <PartyPopper className="w-4 h-4 text-[#31105C]" /> },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t, i) => ({
          time: t.time,
          title: t.title,
          desc: "Formal Ceremony Schedule",
          icon: defaultTimeline[i % 3].icon,
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
    <div className="bg-[#fbf9f4] text-[#1b1c19] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#31105C] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "Saturday, October 26, 2026 • The Grand Royal Palace"}
        isCustomizer={props.isCustomizer}
        templateSlug="grand-ballroom"
      />

      {/* Top Navbar */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#D4AF37]/20 ${
          navScrolled ? "bg-white/95 backdrop-blur-xl py-3 shadow-md" : "bg-white/80 backdrop-blur-md py-4"
        }`}
      >
        <div className="flex justify-between items-center w-full px-6 md:px-16 max-w-[1200px] mx-auto">
          <a href="#" className="font-serif text-2xl font-bold text-[#31105C] hover:text-[#D4AF37] transition-colors">
            {partner1} &amp; {partner2}
          </a>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#4a4452]">
            <a href="#story" className="hover:text-[#31105C] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#31105C] transition-colors">Events</a>
            <a href="#timeline" className="hover:text-[#31105C] transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-[#31105C] transition-colors">Gallery</a>
            <a href="#rsvp" className="hover:text-[#31105C] transition-colors">RSVP</a>
          </div>

          <a
            href="#rsvp"
            className="hidden md:inline-flex bg-[#31105C] text-[#D4AF37] font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded hover:bg-[#4a1b8c] hover:text-white transition-all shadow-md"
          >
            Registry
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
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#31105C] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Grand Ballroom Section */}
      <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16" id="story">
        <div className="absolute inset-0 z-0">
          <img src={heroBallroomImg} alt="Grand Ballroom Background" className="w-full h-full object-cover object-center filter brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#31105C]/80 via-transparent to-[#31105C]/30" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 bg-white/85 backdrop-blur-xl max-w-3xl mx-auto p-10 md:p-16 border-2 border-[#D4AF37] shadow-2xl relative"
        >
          <div className="absolute inset-2 border border-[#31105C]/30 pointer-events-none" />
          <span className="text-xs font-bold text-[#31105C] uppercase tracking-[0.3em] block mb-4">Together with their families</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#31105C] mb-6 leading-tight">
            {partner1} <span className="font-serif italic text-[#D4AF37] font-light">&amp;</span> {partner2}
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-[#4a4452] mb-8 max-w-xl mx-auto">
            {props.inviteLine || "Joyfully invite you to celebrate their marriage in an evening of elegance, dining, and dancing."}
          </p>
          <div className="flex flex-col items-center gap-1 text-xs font-bold text-[#31105C] tracking-widest uppercase">
            <span>{props.weddingTime || "Saturday, October Twenty-Sixth"}</span>
            <span className="text-[#D4AF37] mt-1 font-extrabold">The Grand Royal Palace</span>
          </div>
        </motion.div>
      </header>

      {/* Formal Details Bento Grid */}
      <section className="py-24 px-6 md:px-16 bg-[#f5f3ee]" id="events">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#31105C] mb-2">The Celebration</h2>
            <div className="h-0.5 w-24 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Ceremony Card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-7 bg-white p-8 sm:p-10 shadow-sm border border-[#D4AF37]/30 flex flex-col justify-center relative overflow-hidden"
            >
              <Church className="w-10 h-10 text-[#D4AF37] mb-4" />
              <h3 className="font-serif text-2xl font-bold text-[#31105C] mb-2">The Ceremony</h3>
              <p className="text-xs text-[#4a4452] mb-6 leading-relaxed">
                Join us as we exchange our vows in the historic cathedral. Please arrive by three-thirty in the afternoon.
              </p>
              <div className="text-xs font-bold text-[#1b1c19] uppercase tracking-wider mb-2">4:00 PM - Cathedral of St. Regis</div>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-bold text-[#D4AF37] hover:text-[#31105C] transition-colors uppercase tracking-widest mt-2">
                <MapPin className="w-4 h-4 mr-1" /> View Map
              </a>
            </motion.div>

            {/* Reception Photo */}
            <div className="md:col-span-5 h-80 md:h-auto overflow-hidden shadow-sm border border-[#D4AF37]/30">
              <img src={mandapImg} alt="Grand Mandap" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Dress Code Card */}
            <div className="md:col-span-4 bg-[#31105C] text-white p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-md">
              <Shirt className="w-10 h-10 text-[#D4AF37] mb-3" />
              <h4 className="font-serif text-2xl font-bold text-[#D4AF37] mb-2">Dress Code</h4>
              <p className="text-xs text-[#F1E9FF] leading-relaxed">
                Black Tie Requested. We kindly ask our guests to embrace the formal elegance of the evening.
              </p>
            </div>

            {/* Cocktails & Reception Details */}
            <div className="md:col-span-8 bg-white p-8 sm:p-10 border border-[#D4AF37]/30 flex flex-col justify-center shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-[#31105C] mb-4">Cocktails &amp; Reception</h3>
              <div className="flex flex-col gap-6 relative pl-6 border-l-2 border-[#D4AF37]">
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-[#31105C] rounded-full -left-[1.9rem] top-1 border-2 border-white" />
                  <div className="text-xs font-bold text-[#31105C] uppercase tracking-wider mb-1">6:00 PM</div>
                  <p className="text-xs text-[#4a4452]">Cocktail hour begins in the Grand Foyer.</p>
                </div>
                <div className="relative">
                  <div className="absolute w-3 h-3 bg-[#31105C] rounded-full -left-[1.9rem] top-1 border-2 border-white" />
                  <div className="text-xs font-bold text-[#31105C] uppercase tracking-wider mb-1">7:30 PM</div>
                  <p className="text-xs text-[#4a4452]">Dinner, toasts, and dancing in the Crystal Ballroom.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 md:px-16 bg-[#fbf9f4]" id="timeline">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#31105C] mb-2">Event Timeline</h2>
            <div className="h-0.5 w-24 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="space-y-12 relative border-l-2 border-[#D4AF37]/50 ml-4 md:ml-0 md:border-l-0">
            {timelineList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pl-8 md:pl-0 md:flex md:items-center md:justify-between group"
              >
                <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#D4AF37] bg-white text-[#31105C] shadow z-10 mx-auto">
                  {item.icon}
                </div>
                <div className="w-full md:w-[calc(50%-2.5rem)] p-6 bg-white border border-[#D4AF37]/30 shadow-sm">
                  <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1">{item.time}</div>
                  <h3 className="font-serif text-xl font-bold text-[#31105C] mb-1">{item.title}</h3>
                  <p className="text-xs text-[#4a4452] leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Moments Square Grid */}
      <section className="py-24 px-6 md:px-16 bg-[#f5f3ee]" id="gallery">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#31105C] mb-2">Our Moments</h2>
            <div className="h-0.5 w-24 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryList.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="aspect-square bg-white border border-[#D4AF37]/30 p-2.5 shadow-sm overflow-hidden"
              >
                <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-full object-cover filter brightness-95 hover:brightness-100 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Location Maps */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <MapPin className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
            <h2 className="font-serif text-4xl font-bold text-[#31105C] mb-2">Locations &amp; Venues</h2>
            <div className="h-0.5 w-24 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#fbf9f4] p-8 border border-[#D4AF37]/30 shadow-sm text-center">
              <h3 className="font-serif text-2xl font-bold text-[#31105C] mb-1">The Ceremony</h3>
              <p className="text-xs text-[#4a4452] mb-6">Cathedral of St. Regis</p>
              <div className="w-full h-60 border border-[#D4AF37]/20 mb-6 overflow-hidden">
                <iframe
                  title="Ceremony Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.14483011405021!3d40.6976312333469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="bg-[#fbf9f4] p-8 border border-[#D4AF37]/30 shadow-sm text-center">
              <h3 className="font-serif text-2xl font-bold text-[#31105C] mb-1">The Reception</h3>
              <p className="text-xs text-[#4a4452] mb-6">The Grand Royal Palace</p>
              <div className="w-full h-60 border border-[#D4AF37]/20 mb-6 overflow-hidden">
                <iframe
                  title="Reception Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.14483011405021!3d40.6976312333469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="grand-ballroom" />
      </div>

      {/* Footer */}
      <footer className="bg-[#31105C] text-white py-14 text-center border-t border-[#D4AF37]/30">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-3">
          <span className="font-serif text-3xl font-bold text-[#D4AF37]">{partner1} &amp; {partner2}</span>
          <p className="text-xs text-white/80">With Love, {partner1} &amp; {partner2} — 2026</p>
        </div>
      </footer>
    </div>
  );
}
