"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { parseYouTubeEmbedUrl, getYouTubeVideoId } from "../classic-floral/LoveStoryVideoFacade";
import {
  Church,
  Camera,
  Utensils,
  PartyPopper,
  MapPin,
  Menu,
  X,
  Play,
  ExternalLink,
  Heart,
} from "lucide-react";

export default function EmeraldGoldInvitation(props: TemplateClassicFloralProps) {
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

  const coverImg =
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

  const videoCoverImg =
    props.coverImage ||
    props.coupleImage ||
    props.heroImage ||
    "/images/templates/couple-photo.jpg";

  const defaultTimeline: { time: string; date?: string; title: string; desc: string; icon: React.ReactNode }[] = [
    { time: "10:00 AM", date: "May 13, 2026", title: "Wedding Ceremony", desc: "The exchanging of vows at St. Antony Church", icon: <Church className="w-4 h-4 text-[#ffe088]" /> },
    { time: "12:30 PM", date: "May 13, 2026", title: "Family Portraits", desc: "Capturing cherishable wedding memories", icon: <Camera className="w-4 h-4 text-[#ffe088]" /> },
    { time: "07:00 PM", date: "May 13, 2026", title: "Grand Reception", desc: "Dinner, dancing, and grand evening celebration", icon: <PartyPopper className="w-4 h-4 text-[#ffe088]" /> },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t, i) => ({
          time: t.time,
          date: t.date,
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
  const showVideo = props.showVideoSection !== false && Boolean(props.loveStoryVideoUrl);
  const videoId = getYouTubeVideoId(props.loveStoryVideoUrl);
  const embedUrl = parseYouTubeEmbedUrl(props.loveStoryVideoUrl);
  const directWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] font-sans antialiased selection:bg-[#ffe088] selection:text-[#241a00] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="emerald-gold"
      />

      {/* Sleek Top Navigation */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 border-b border-[#c0c9c2]/30 ${
          navScrolled ? "bg-[#fcf9f8]/95 backdrop-blur-md py-2 shadow-md" : "bg-[#fcf9f8]/90 backdrop-blur-sm py-2.5"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-[1280px] mx-auto h-12">
          <a href="#" className="font-serif text-xl font-bold text-[#043927] tracking-wider">
            {initials}
          </a>

          <div className="hidden md:flex gap-8 items-center text-xs font-semibold uppercase tracking-widest text-[#414944]">
            <a href="#story" className="hover:text-[#735c00] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#735c00] transition-colors">Events</a>
            <a href="#timeline" className="hover:text-[#735c00] transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-[#735c00] transition-colors">Gallery</a>
          </div>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#043927] text-white font-bold text-[11px] uppercase tracking-widest px-5 py-2 rounded border border-[#735c00] hover:bg-[#ffe088] hover:text-[#043927] transition-colors"
          >
            RSVP
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#043927]">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#fcf9f8] border-b border-[#735c00] px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#414944]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#735c00] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#043927] pt-20 pb-16" id="story">
        <div className="absolute inset-0 z-0">
          <img src={coverImg} alt="Cover Background" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#043927] via-[#043927]/80 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 md:px-16 max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ffe088]">
            {props.tagline || "TOGETHER WITH THEIR FAMILIES"}
          </span>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-[#fcf9f8] tracking-tight flex flex-col gap-2">
            <span>{partner1}</span>
            <span className="text-[#ffe088] font-serif italic text-4xl">&amp;</span>
            <span>{partner2}</span>
          </h1>

          <p className="text-base sm:text-lg text-[#c9c6c1] max-w-xl mx-auto">
            {props.inviteLine || "Invite you to celebrate their wedding"}
          </p>

          <div className="border border-[#ffe088]/50 px-8 py-4 rounded-sm backdrop-blur-sm bg-[#043927]/40 shadow-xl">
            <p className="font-serif text-2xl font-bold text-[#fcf9f8]">{props.weddingDate || "13th May 2026"}</p>
            <p className="text-xs font-bold text-[#ffe088] uppercase tracking-widest mt-1">{props.weddingTime || "10:00 AM ONWARDS"}</p>
          </div>
        </motion.div>
      </section>

      {/* Meet the Bride & Groom Section */}
      <section className="py-20 px-6 md:px-16 bg-[#fcf9f8] border-b border-[#c0c9c2]/40 relative overflow-hidden" id="couple">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#735c00] block mb-2">
              The Happy Couple
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#043927] tracking-tight">
              Meet the Bride &amp; Groom
            </h2>
            <div className="w-16 h-0.5 bg-[#735c00] mx-auto mt-4 opacity-80" />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-4xl mx-auto">
            {/* Bride Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white border-2 border-[#735c00]/30 p-4 rounded-t-[140px] rounded-b-3xl shadow-xl transition-all group relative"
            >
              <div className="aspect-[4/5] rounded-t-[125px] rounded-b-2xl overflow-hidden relative border border-[#735c00]/20">
                <img
                  src={brideImg}
                  alt={`${partner1} - Bride`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#043927]/90 text-[#ffe088] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur-md shadow-md border border-[#ffe088]/30">
                  The Bride
                </div>
              </div>
              <div className="pt-6 pb-2 text-center">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#043927]">
                  {partner1}
                </h3>
                <p className="text-xs text-[#735c00] font-semibold uppercase tracking-widest mt-1">
                  Bride-To-Be
                </p>
              </div>
            </motion.div>

            {/* Central Heart Badge */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-[#043927] text-[#ffe088] border-4 border-white shadow-2xl items-center justify-center">
              <Heart className="w-6 h-6 fill-current animate-pulse" />
            </div>

            {/* Groom Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white border-2 border-[#735c00]/30 p-4 rounded-t-[140px] rounded-b-3xl shadow-xl transition-all group relative"
            >
              <div className="aspect-[4/5] rounded-t-[125px] rounded-b-2xl overflow-hidden relative border border-[#735c00]/20">
                <img
                  src={groomImg}
                  alt={`${partner2} - Groom`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#043927]/90 text-[#ffe088] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur-md shadow-md border border-[#ffe088]/30">
                  The Groom
                </div>
              </div>
              <div className="pt-6 pb-2 text-center">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#043927]">
                  {partner2}
                </h3>
                <p className="text-xs text-[#735c00] font-semibold uppercase tracking-widest mt-1">
                  Groom-To-Be
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wedding Events & Venues Section */}
      <section className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto" id="events">
        <div id="venue">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-[#043927] mb-3">Wedding Events &amp; Venues</h2>
            <div className="w-12 h-1 bg-[#735c00] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {(props.locations && props.locations.length > 0
              ? props.locations
              : [
                  {
                    name: "Holy Matrimony",
                    venueLabel: "St. Antony Church",
                    address: props.contactAddress || "Kaval Kinaru, Tirunelveli District",
                    image: "/images/templates/venue-ceremony.jpg",
                    mapLink: "https://maps.google.com",
                  },
                  {
                    name: "Grand Reception",
                    venueLabel: "Ubahara Matha Mahal",
                    address: props.venuePlace || "Kaval Kinaru, Tirunelveli District",
                    image: "/images/templates/venue-reception.jpg",
                    mapLink: "https://maps.google.com",
                  },
                ]
            ).map((loc, idx) => (
              <motion.div
                key={idx}
                id={`venue-card-${idx}`}
                whileHover={{ y: -6 }}
                className="border-2 border-[#735c00]/50 p-6 rounded bg-white shadow-md hover:shadow-xl transition-all flex flex-col justify-between scroll-mt-28"
              >
                <div>
                  <div className="h-48 rounded overflow-hidden mb-6 border border-[#735c00]/30">
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

                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#735c00] block mb-1">
                    {loc.venueLabel || (idx === 0 ? "Holy Matrimony" : "Grand Reception")}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#043927] mb-1">
                    {loc.name || (idx === 0 ? "Holy Matrimony" : "Grand Reception")}
                  </h3>
                  <p className="text-xs text-[#414944] mb-4">
                    {loc.address || "Kaval Kinaru, Tirunelveli District"}
                  </p>
                </div>

                <div className="w-full h-44 rounded overflow-hidden border border-[#735c00]/30 mb-6 bg-gray-100">
                  <iframe
                    title={`Venue Map ${idx + 1}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      `${loc.name || ""} ${loc.address || ""}`.trim() || "New York, NY"
                    )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
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
                  className="inline-flex items-center justify-center gap-2 border border-[#735c00] text-[#735c00] px-8 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#735c00] hover:text-white transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Timeline with Responsive Wrap Grid */}
      <section className="py-20 px-6 md:px-16 bg-[#f6f3f2]" id="timeline">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-[#043927] mb-3">Event Timeline</h2>
            <div className="w-12 h-1 bg-[#735c00] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {timelineList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white border-2 border-[#735c00]/30 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-between"
              >
                <div className="w-full">
                  <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest block mb-2">{item.date ? `${item.date} • ${item.time}` : item.time}</span>
                  <h4 className="font-serif text-lg font-bold text-[#043927] mb-2 leading-snug">{item.title}</h4>
                </div>
                <p className="text-xs text-[#414944]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto" id="gallery">
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl font-bold text-[#043927] mb-3">Our Moments</h2>
          <div className="w-12 h-1 bg-[#735c00] mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryList.map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="group relative overflow-hidden rounded-lg aspect-square shadow-md border border-[#735c00]/30"
            >
              <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[#043927]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Love Story Video Facade (Only rendered if showVideo is true) */}
      {showVideo && (
        <section className="py-20 px-6 md:px-16 bg-[#043927] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold text-[#ffe088] mb-3">Our Love Story</h2>
            <div className="w-12 h-1 bg-[#ffe088] mx-auto mb-10" />

            <div className="relative aspect-video rounded-lg overflow-hidden border-4 border-[#ffe088]/40 shadow-2xl group cursor-pointer bg-[#002215]">
              {isPlayingVideo ? (
                <div className="relative w-full h-full">
                  <iframe
                    title="Love story video"
                    src={embedUrl}
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                  {/* Direct Watch Button Fallback */}
                  <div className="absolute top-2 right-2 z-20">
                    <a
                      href={directWatchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#002215]/80 hover:bg-[#ffe088] hover:text-[#043927] text-[#ffe088] text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#ffe088]/50 flex items-center gap-1.5 backdrop-blur-sm transition-all shadow-md"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full" onClick={() => setIsPlayingVideo(true)}>
                  <img src={videoCoverImg} alt="Video Cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center bg-[#043927]/40">
                    <div className="w-20 h-20 bg-[#ffe088] rounded-full flex items-center justify-center text-[#043927] group-hover:scale-110 transition-transform shadow-xl">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Fallback Link */}
            <div className="mt-3 text-center">
              <a
                href={directWatchUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffe088] hover:underline"
              >
                <span>Playback issues? Click to watch directly on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="emerald-gold" />
      </div>

      {/* Footer */}
      <footer className="bg-[#002215] text-white py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold">
          <span className="font-serif text-[#ffe088] text-lg">{initials}</span>
          <span className="text-white/70">&copy; 2026 {partner1} &amp; {partner2}. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
