"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import { getYouTubeEmbedUrl, formatAgeOrdinal } from "@/lib/dateUtils";
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

  const partner1 = props.partnerOne || "Sasa Adi Tinah";
  const partner2 = props.partnerTwo || "Allan Susilo";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const heroBg =
    props.coverImage ||
    props.heroImage ||
    props.coupleImage ||
    "/images/templates/couple-photo.jpg";

  const brideImg =
    props.coupleImage ||
    props.coverImage ||
    "/images/templates/groom-bride-1.jpg";

  const groomImg =
    props.partnerTwoImage ||
    props.coverImage ||
    "/images/templates/groom-bride-2.jpg";

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
          desc: t.desc || (t.date ? `Date: ${t.date}` : ""),
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
          <img src={heroBg} alt="Grand Ballroom Cover Background" className="w-full h-full object-cover object-center filter brightness-75" />
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

      {/* Meet the Couple Section */}
      <section className="py-24 px-6 md:px-16 bg-white border-b border-[#D4AF37]/30" id="couple">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div>
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.3em] block mb-2">
              The Happy Couple
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#31105C]">
              Meet the Bride &amp; Groom
            </h2>
            <div className="h-0.5 w-24 bg-[#D4AF37] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Bride Card */}
            <div className="group relative border-2 border-[#D4AF37] p-3 bg-[#fbf9f4] shadow-xl overflow-hidden">
              <div className="relative w-full h-96 overflow-hidden">
                <img
                  src={brideImg}
                  alt={`${partner2} - Bride`}
                  onError={(e) => {
                    e.currentTarget.src = "/images/templates/groom-bride-1.jpg";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#31105C]/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-left text-white">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-1">
                    Bride
                  </span>
                  <h3 className="text-3xl font-serif font-bold">{partner2}</h3>
                </div>
              </div>
            </div>

            {/* Groom Card */}
            <div className="group relative border-2 border-[#D4AF37] p-3 bg-[#fbf9f4] shadow-xl overflow-hidden">
              <div className="relative w-full h-96 overflow-hidden">
                <img
                  src={groomImg}
                  alt={`${partner1} - Groom`}
                  onError={(e) => {
                    e.currentTarget.src = "/images/templates/groom-bride-2.jpg";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#31105C]/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-left text-white">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-1">
                    Groom
                  </span>
                  <h3 className="text-3xl font-serif font-bold">{partner1}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Celebration Film Video Section */}
      {props.showVideoSection !== false && Boolean(props.loveStoryVideoUrl && props.loveStoryVideoUrl.trim() !== "") && (
        <section className="py-24 px-6 md:px-16 bg-[#31105C] text-white relative border-b border-[#D4AF37]/30" id="video">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div>
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.3em] block mb-2">
                Cinematic Moments
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#D4AF37]">
                Our Celebration Film
              </h2>
              <p className="text-sm font-serif text-[#F1E9FF] mt-2 max-w-xl mx-auto">
                Watch a preview of our story and shared memories together.
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] aspect-video bg-black group">
              {isPlayingVideo ? (
                <iframe
                  src={getYouTubeEmbedUrl(props.loveStoryVideoUrl)}
                  title="Love Story Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                  <img
                    src={heroBg}
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#D4AF37] text-[#31105C] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white text-left">
                    <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Watch Video</p>
                    <p className="text-xl font-serif font-bold">{partner1} &amp; {partner2}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Event Schedule & Functions Section */}
      <section className="py-24 px-6 md:px-16 bg-[#f5f3ee]" id="events">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.3em] block mb-2">
              Event Functions &amp; Schedule
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#31105C]">
              The Celebration
            </h2>
            <div className="h-0.5 w-24 bg-[#D4AF37] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(props.events && props.events.length > 0
              ? props.events.map((e, idx) => ({
                  title: e.title,
                  time: e.time,
                  date: e.date || props.weddingDate || "Saturday, October 26, 2026",
                  location: props.locations?.[idx % props.locations.length]?.name || props.venuePlace || "The Grand Royal Palace",
                  address: props.locations?.[idx % props.locations.length]?.address || props.contactAddress || "Main Event Venue",
                  image: props.locations?.[idx % props.locations.length]?.image || (idx === 0 ? "/images/templates/venue-ceremony.jpg" : "/images/templates/venue-reception.jpg"),
                }))
              : [
                  {
                    title: "The Holy Ceremony",
                    time: props.weddingTime || "10:00 AM",
                    date: props.weddingDate || "Saturday, October 26, 2026",
                    location: props.locations?.[0]?.name || props.venuePlace || "St. Regis Cathedral",
                    address: props.locations?.[0]?.address || props.contactAddress || "456 Cathedral Ave, Cityville",
                    image: props.locations?.[0]?.image || "/images/templates/venue-ceremony.jpg",
                  },
                  {
                    title: "Grand Evening Reception",
                    time: "7:00 PM",
                    date: props.weddingDate || "Saturday, October 26, 2026",
                    location: props.locations?.[1]?.name || "The Grand Royal Palace",
                    address: props.locations?.[1]?.address || "789 Palace Blvd, Royal City",
                    image: props.locations?.[1]?.image || "/images/templates/venue-reception.jpg",
                  },
                ]
            ).map((evt, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-white border-2 border-[#D4AF37]/30 shadow-xl overflow-hidden flex flex-col justify-between"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#31105C]/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-[#31105C] text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-[#D4AF37]/50 shadow-md">
                    Function #{idx + 1}
                  </div>
                  <div className="absolute bottom-4 left-6 text-white">
                    <h3 className="font-serif text-2xl font-bold">{evt.title}</h3>
                  </div>
                </div>

                <div className="p-8 space-y-4 bg-white flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-[#31105C]" />
                      <span>{evt.time} • {evt.date}</span>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs text-[#4a4452]">
                      <MapPin className="w-4 h-4 text-[#31105C] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[#31105C]">{evt.location}</p>
                        <p>{evt.address}</p>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#venue"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(`venue-card-${idx}`) || document.getElementById("venue");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="inline-flex items-center text-xs font-bold text-[#31105C] hover:text-[#D4AF37] transition-colors uppercase tracking-widest pt-3 border-t border-[#D4AF37]/20 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
                    <span>View Venue Location</span>
                  </a>
                </div>
              </motion.div>
            ))}
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
      <section className="py-24 px-6 md:px-16 bg-white border-t border-[#D4AF37]/30" id="venue">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <MapPin className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
            <h2 className="font-serif text-4xl font-bold text-[#31105C] mb-2">Locations &amp; Venues</h2>
            <div className="h-0.5 w-24 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(props.locations && props.locations.length > 0
              ? props.locations
              : [
                  {
                    name: "The Ceremony",
                    venueLabel: "Cathedral of St. Regis",
                    address: props.contactAddress || "456 Cathedral Ave, Cityville",
                    image: "/images/templates/venue-ceremony.jpg",
                    mapLink: "https://maps.google.com",
                  },
                  {
                    name: "The Reception",
                    venueLabel: "The Grand Royal Palace",
                    address: props.venuePlace || "789 Palace Blvd, Royal City",
                    image: "/images/templates/venue-reception.jpg",
                    mapLink: "https://maps.google.com",
                  },
                ]
            ).map((loc, idx) => (
              <div
                key={idx}
                id={`venue-card-${idx}`}
                className="bg-[#fbf9f4] p-8 border border-[#D4AF37]/30 shadow-sm text-center flex flex-col justify-between scroll-mt-28"
              >
                <div className="h-56 rounded-xl overflow-hidden mb-6 border border-[#D4AF37]/20">
                  <img
                    src={
                      loc.image ||
                      (idx === 0
                        ? "/images/templates/venue-ceremony.jpg"
                        : "/images/templates/venue-reception.jpg")
                    }
                    alt={loc.name || "Venue"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
                    {loc.venueLabel || (idx === 0 ? "The Ceremony" : "The Reception")}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#31105C] mb-1">
                    {loc.name || (idx === 0 ? "Cathedral of St. Regis" : "The Grand Royal Palace")}
                  </h3>
                  <p className="text-xs text-[#4a4452] mb-6">
                    {loc.address || (idx === 0 ? "Cathedral of St. Regis" : "The Grand Royal Palace")}
                  </p>
                </div>

                <div className="w-full h-52 border border-[#D4AF37]/20 mb-6 overflow-hidden rounded-xl bg-gray-100">
                  <iframe
                    title={`Venue Map ${idx + 1}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      `${loc.name || ""} ${loc.address || ""}`.trim() || "New York, NY"
                    )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>

                <a
                  href={
                    loc.mapLink && loc.mapLink !== "https://maps.google.com"
                      ? loc.mapLink
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${loc.name || ""} ${loc.address || ""}`.trim() || "New York, NY"
                        )}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-[#31105C] text-[#D4AF37] px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#4a1b8c] transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>
              </div>
            ))}
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
