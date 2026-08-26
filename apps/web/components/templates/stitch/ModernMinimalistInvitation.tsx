"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  PartyPopper,
  MapPin,
  Car,
  Info,
  Play,
  CheckCircle2,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export default function ModernMinimalistInvitation(props: TemplateClassicFloralProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const partner1 = props.partnerOne || "Elias";
  const partner2 = props.partnerTwo || "Sophia";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const heroBg =
    props.heroImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAozQTTShxbC2nG0N4AqOQYF9-PJMAj5p4kqugcb0I5t5zZInw42xxfjdzw5JP1O3YU9ohkSXnh1LmqrfIwb0vF402pC3lrLVbSX8cI4QHYkqLqQgAGcZR9viSyKJ0_m_vXwuTELqm1Fqq1zOWoEbOIeLKzLQxb8xgWKJOSZeAyqjJL_MOY7eQhqA-kZlThFG8UyBDAuixWoZ8pcqTBjCZknGbYjZkga0FnKfwKlBiLGMqR4gRIbRjC";

  const defaultTimeline = [
    { time: "3:00 PM", title: "Ceremony Begins", location: "St. Patrick's Cathedral" },
    { time: "4:30 PM", title: "Cocktail Hour", location: "The Plaza Gardens" },
    { time: "6:00 PM", title: "Dinner & Dancing", location: "Grand Ballroom" },
    { time: "11:00 PM", title: "Farewell Sparklers", location: "Main Entrance" },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t) => ({
          time: t.time,
          title: t.title,
          location: "Main Venue",
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
    <div className="bg-[#fbf9f4] text-[#1b1c19] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#31105C] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "Saturday, October 14th • 3:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="modern-minimalist"
      />

      {/* Decorative Amethyst Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#31105C]/15 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-[#FFFFFF]/85 backdrop-blur-xl border-b border-[#D4AF37]/20 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-6 md:px-16 py-4 flex justify-between items-center">
          <a href="#" className="font-serif text-2xl font-bold text-[#31105C] hover:text-[#D4AF37] transition-all hover:scale-105">
            {partner1} &amp; {partner2}
          </a>

          <div className="hidden md:flex items-center gap-8 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#4a4452]">
            <a href="#story" className="hover:text-[#31105C] transition-colors relative group">
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#events" className="hover:text-[#31105C] transition-colors relative group">
              Events
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#timeline" className="hover:text-[#31105C] transition-colors relative group">
              Timeline
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#locations" className="hover:text-[#31105C] transition-colors relative group">
              Locations
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
            className="hidden md:inline-block bg-[#31105C] text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.15em] py-2.5 px-6 rounded-sm hover:bg-[#D4AF37] hover:text-[#31105C] transition-all shadow-md transform hover:-translate-y-0.5"
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
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#locations" onClick={() => setMobileMenuOpen(false)}>Locations</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#31105C] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Header Section */}
      <header className="relative w-full h-[88vh] min-h-[580px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Hero Background" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#31105C]/35 via-[#31105C]/65 to-[#31105C]/85" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center gap-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{props.tagline || "WE ARE GETTING MARRIED"}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-lg"
          >
            Together
          </motion.h1>

          <p className="text-lg text-[#F1E9FF] max-w-xl font-light leading-relaxed">
            {props.inviteLine || "Join us as we celebrate the beginning of our new chapter."}
          </p>

          <motion.div whileHover={{ scale: 1.05 }} className="mt-6">
            <a
              href="#rsvp"
              className="bg-white text-[#31105C] text-[11px] font-extrabold uppercase tracking-[0.2em] py-3.5 px-9 rounded-sm hover:bg-[#D4AF37] hover:text-white transition-all shadow-xl block"
            >
              RSVP Now
            </a>
          </motion.div>
        </motion.div>
      </header>

      {/* Meet the Couple - Bride & Groom Photos */}
      <section className="py-16 px-6 md:px-16 bg-[#fbf9f4] border-b border-[#D4AF37]/20" id="couple">
        <div className="max-w-[1000px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              The Blessed Union
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#31105C] mt-1">
              Meet the Couple
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-3" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Bride Photo Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-lg bg-white"
            >
              <img
                src={props.coupleImage || props.coverImage || "/images/templates/groom-bride-1.jpg"}
                alt={`${partner1} - Bride`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#31105C]/85 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">
                  Bride
                </span>
                <h3 className="text-xl font-serif font-bold text-white leading-none mt-1">
                  {partner1}
                </h3>
              </div>
            </motion.div>

            {/* Groom Photo Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-lg bg-white"
            >
              <img
                src={props.partnerTwoImage || props.coverImage || "/images/templates/groom-bride-2.jpg"}
                alt={`${partner2} - Groom`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#31105C]/85 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block">
                  Groom
                </span>
                <h3 className="text-xl font-serif font-bold text-white leading-none mt-1">
                  {partner2}
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Celebration & Events Section */}
      <section className="py-24 px-6 md:px-16 bg-[#ffffff] relative" id="events">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#31105C] mb-3">
              Event Schedule &amp; Functions
            </h2>
            <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(props.events && props.events.length > 0 ? props.events : [
              {
                time: props.weddingTime || "10:30 AM",
                title: "Wedding Ceremony",
                location: props.venuePlace || "Main Venue",
                description: "Celebrate the sacred wedding ceremony with us.",
              },
              {
                time: "07:00 PM",
                title: "Grand Evening Reception",
                location: props.venuePlace || "Reception Ballroom",
                description: "An evening of feast, music, and grand celebration.",
              },
            ]).map((evt: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-[#ffffff] p-8 md:p-10 text-left rounded-2xl border border-[#D4AF37]/30 relative overflow-hidden group hover:border-[#D4AF37] transition-all duration-500 shadow-md flex flex-col justify-between"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#31105C]/10 border border-[#D4AF37]/40 flex items-center justify-center text-xl mb-4 text-[#31105C]">
                    {evt.icon || "💍"}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                    {evt.time} {evt.date ? `• ${evt.date}` : ""}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#31105C] mb-2">
                    {evt.title}
                  </h3>
                  {evt.location && (
                    <p className="text-xs text-[#4a4452] flex items-center gap-1.5 font-medium mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{evt.location}</span>
                    </p>
                  )}
                  {evt.description && (
                    <p className="text-xs text-[#6b6276] font-light leading-relaxed">
                      {evt.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Timeline */}
      <section className="py-24 px-6 md:px-16 bg-[#fbf9f4]" id="timeline">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#31105C] mb-3">Event Timeline</h2>
            <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="relative border-l-2 md:border-l-0 md:border-t-2 border-[#D4AF37]/40 ml-4 md:ml-0 pt-6 md:pt-10 grid grid-cols-1 md:grid-cols-4 gap-8">
            {timelineList.map((tl, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pl-8 md:pl-0 text-left md:text-center"
              >
                <div className="absolute w-3.5 h-3.5 bg-[#D4AF37] rounded-full -left-[8px] top-1 md:-top-[47px] md:left-1/2 md:-translate-x-1/2 shadow-sm" />
                <span className="text-xs font-bold text-[#D4AF37] block mb-1 uppercase tracking-wider">
                  {tl.time}
                </span>
                <h4 className="font-serif text-lg font-bold text-[#31105C] mb-1">{tl.title}</h4>
                <p className="text-xs text-[#4a4452]">{tl.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section with Maps */}
      <section className="py-24 px-6 md:px-16 bg-[#f0eee9]" id="locations">
        <div className="max-w-[1200px] mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-80 w-full rounded-2xl overflow-hidden shadow-lg border border-[#D4AF37]/30"
            >
              <iframe
                title="Ceremony Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.25983574581!2d-73.97893918459374!3d40.75896697932688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258fa492b45eb%3A0xc3f8f17548c7bd3a!2sSt.%20Patrick's%20Cathedral!5e0!3m2!1sen!2sus!4v1689269550424!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </motion.div>
            <div>
              <h3 className="font-serif text-3xl font-bold text-[#31105C] mb-4">
                The Ceremony Location
              </h3>
              <p className="text-sm text-[#4a4452] mb-6 leading-relaxed">
                Join us for the exchange of vows in the historic and beautiful setting of St. Patrick's Cathedral.
              </p>
              <div className="space-y-3 font-sans text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#31105C] uppercase block mb-0.5">Address</strong>
                    <span className="text-[#4a4452]">5th Ave, New York, NY 10022</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#31105C] uppercase block mb-0.5">Parking</strong>
                    <span className="text-[#4a4452]">Valet parking available at 51st Street entrance.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Photo Gallery */}
      <section className="py-24 px-6 md:px-16 bg-[#ffffff]" id="gallery">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#31105C] mb-3">Our Moments</h2>
            <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryList.slice(0, 6).map((imgUrl, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="rounded-2xl overflow-hidden border border-[#D4AF37]/30 aspect-square shadow-sm group"
              >
                <img src={imgUrl} alt={`Gallery moment ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="modern-minimalist" />
      </div>

      {/* Footer */}
      <footer className="bg-[#31105C] text-white border-t border-[#D4AF37]/30 py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="font-serif text-4xl font-bold text-[#D4AF37]">{initials}</span>
          <p className="text-sm text-[#F1E9FF]/80 max-w-md leading-relaxed">
            With love and gratitude, thank you for celebrating this sacred union with us.
          </p>
          <p className="text-xs text-[#D4AF37] uppercase tracking-widest mt-2">
            © 2026 {partner1} &amp; {partner2}
          </p>
        </div>
      </footer>
    </div>
  );
}
