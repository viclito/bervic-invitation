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
  Calendar,
  Clock,
  MapPin,
  Menu,
  X,
  Play,
  Heart,
} from "lucide-react";

export default function LimeSilverInvitation(props: TemplateClassicFloralProps) {
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

  const partner1 = props.partnerOne || "Terance";
  const partner2 = props.partnerTwo || "Ancy";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const heroBgImg =
    props.heroImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCUU4JX9QUA0wxl_auEnFsKeBci4Kf2M0N0gBp9W-68i9kn93kF2w9oAiW3_F41v_6VOc1SQnlpYrl6h4iBRZ7L7PmsWLc7JDPllF39G9d9bTGTDQc6Qzv87B4smbBOSyaTJHehFm1bNuQzxX2cgM47mA1kApxqbBLEUAb3U9eB6t4B0p7sjPIYcmRGw706baTFborZQFQcNb6N5GP-pWVwEQbo2Bgum2XGWr9k5MDyxfi-L9tJ-DtQ";

  const defaultEvents = [
    {
      title: "Marriage",
      time: "May 13, 2026 • 10:00 AM",
      venue: "St. Antony Church",
      address: "Kaval Kinaru, Tirunelveli District",
      mapLink: "https://maps.google.com",
    },
    {
      title: "Reception",
      time: "May 13, 2026 • 07:00 PM",
      venue: "Ubahara Matha Mahal",
      address: "Kaval Kinaru, Tirunelveli District",
      mapLink: "https://maps.google.com",
    },
  ];

  const eventsList =
    props.events && props.events.length > 0
      ? props.events.map((e, idx) => ({
          title: e.title,
          time: `${e.date || props.weddingDate || "May 13, 2026"} • ${e.time || "10:00 AM"}`,
          venue: props.locations?.[idx % props.locations.length]?.name || props.venuePlace || "Wedding Venue",
          address: props.locations?.[idx % props.locations.length]?.address || props.contactAddress || "Venue Location",
          mapLink: props.locations?.[idx % props.locations.length]?.mapLink || "https://maps.google.com",
        }))
      : defaultEvents;

  const defaultTimeline = [
    { time: "10:00 AM", title: "The Ceremony", desc: "The main event begins. Please arrive a few minutes early to find your seats as we exchange our vows." },
    { time: "12:30 PM", title: "Photos & Light Lunch", desc: "Enjoy a light lunch and refreshments while we capture some precious family portraits and moments." },
    { time: "06:00 PM", title: "Grand Reception", desc: "The party starts! Join us for an evening of celebration, dinner, and dancing into the night." },
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

  const galleryList = props.galleryImages && props.galleryImages.length > 0 ? props.galleryImages : defaultGallery;

  return (
    <div className="bg-[#0A0A0A] text-[#e2e2e2] font-sans antialiased selection:bg-[#32CD32] selection:text-[#0A0A0A] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="lime-silver"
      />

      {/* Top Navbar */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#c6c6c6]/20 ${
          navScrolled ? "bg-[#0A0A0A]/95 backdrop-blur-md py-3 shadow-md" : "bg-[#0A0A0A] py-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-[1280px] mx-auto">
          <a href="#" className="font-sans text-2xl font-black uppercase tracking-wider text-[#32CD32]">
            {initials}
          </a>

          <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-[#c6c6c6]">
            <a href="#story" className="hover:text-[#32CD32] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#32CD32] transition-colors">Events</a>
            <a href="#timeline" className="hover:text-[#32CD32] transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-[#32CD32] transition-colors">Gallery</a>
          </nav>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#32CD32] text-[#0A0A0A] font-bold text-xs uppercase tracking-widest px-6 py-2.5 hover:bg-white transition-colors"
          >
            RSVP
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#32CD32]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0A0A0A] border-b border-[#32CD32]/40 px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#c6c6c6]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#32CD32] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-[85vh] relative flex flex-col justify-center px-6 md:px-16 overflow-hidden pt-28 pb-20" id="story">
        <div className="absolute inset-0 z-0">
          <div
            className="bg-cover bg-center w-full h-full opacity-30 grayscale contrast-150"
            style={{ backgroundImage: `url('${heroBgImg}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[#1a1c1c]/80 backdrop-blur-md p-8 sm:p-14 border-l-4 border-[#32CD32] border-t border-r border-b border-white/10 shadow-2xl"
          >
            <p className="text-xs font-bold text-[#c6c6c6] uppercase tracking-[0.2em] mb-4">
              {props.tagline || "TOGETHER WITH THEIR FAMILIES"}
            </p>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tight mb-2">
              {partner1}
            </h1>

            <div className="flex items-center gap-4 my-4">
              <div className="h-px w-12 bg-white/20" />
              <Heart className="w-5 h-5 text-[#32CD32] fill-current" />
              <div className="h-px w-12 bg-white/20" />
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tight mb-6">
              {partner2}
            </h1>

            {/* Bride & Groom Couple Photo Card */}
            <div className="my-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="relative w-52 sm:w-64 h-64 sm:h-72 border-l-4 border-[#32CD32] border-t border-r border-b border-white/20 p-2 bg-[#0A0A0A] shadow-2xl overflow-hidden group">
                <img
                  src={props.coupleImage || props.coverImage || props.heroImage || "/images/templates/couple-photo.jpg"}
                  alt={`${partner1} & ${partner2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
              </div>

              {props.partnerTwoImage && (
                <div className="relative w-52 sm:w-64 h-64 sm:h-72 border-l-4 border-[#32CD32] border-t border-r border-b border-white/20 p-2 bg-[#0A0A0A] shadow-2xl overflow-hidden group">
                  <img
                    src={props.partnerTwoImage}
                    alt={partner2}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                </div>
              )}
            </div>

            <p className="text-sm sm:text-base text-[#bccbb4] max-w-lg mb-8">
              {props.inviteLine || "Invite you to celebrate their wedding in high style."}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#32CD32]" />
                <span className="text-xl font-bold text-white uppercase">{props.weddingDate || "13th May 2026"}</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 bg-[#32CD32] rounded-full" />
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#32CD32]" />
                <span className="text-xl font-bold text-white uppercase">{props.weddingTime || "10:00 AM"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Events Bento Grid */}
      <section className="px-6 md:px-16 py-20" id="events">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-4xl font-black text-white uppercase mb-12 text-center tracking-tight">The Main Events</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {eventsList.map((evt, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-[#1a1c1c]/80 backdrop-blur-md p-8 sm:p-10 border-l-4 border-[#32CD32] border-t border-r border-b border-white/10 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {idx % 2 === 0 ? (
                      <Church className="w-8 h-8 text-[#32CD32]" />
                    ) : (
                      <PartyPopper className="w-8 h-8 text-[#32CD32]" />
                    )}
                    <h3 className="text-3xl font-black text-white uppercase">{evt.title}</h3>
                  </div>
                  <p className="text-base font-bold text-white mb-2">{evt.venue}</p>
                  <p className="text-xs text-[#c6c6c6] mb-6 leading-relaxed">
                    {evt.address}
                  </p>
                  <div className="flex flex-col gap-2 mb-6 text-xs text-[#bccbb4] font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#32CD32]" />
                      <span>{evt.time}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={evt.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#32CD32] text-[#0A0A0A] font-bold text-xs uppercase tracking-widest px-6 py-3 hover:bg-white transition-colors shadow-[0_0_15px_rgba(50,205,50,0.3)] w-fit"
                >
                  <MapPin className="w-4 h-4" /> View on Map
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-6 md:px-16 py-20" id="timeline">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-white uppercase mb-12 text-center tracking-tight">Event Timeline</h2>

          <div className="relative border-l-2 border-[#32CD32]/40 py-4 pl-8 md:pl-12 space-y-12">
            {timelineList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="absolute -left-[41px] md:-left-[57px] top-1 w-5 h-5 bg-[#0A0A0A] border-2 border-[#32CD32] rounded-full group-hover:bg-[#32CD32] transition-colors shadow-[0_0_10px_rgba(50,205,50,0.5)]" />
                <h4 className="text-xs font-bold text-[#32CD32] uppercase tracking-widest mb-1">{item.time}</h4>
                <h5 className="text-2xl font-bold text-white uppercase mb-2">{item.title}</h5>
                <p className="text-xs text-[#c6c6c6] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Grayscale Moments Gallery */}
      <section className="px-6 md:px-16 py-20" id="gallery">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-4xl font-black text-white uppercase mb-12 text-center tracking-tight">Our Moments</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryList.map((img, idx) => (
              <div key={idx} className="bg-[#1a1c1c]/70 backdrop-blur-md p-2 border border-white/10 group overflow-hidden">
                <img
                  src={img}
                  alt={`Moment ${idx + 1}`}
                  className="w-full h-full object-cover aspect-square md:aspect-[4/3] group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Teaser Facade */}
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white uppercase mb-8 tracking-tight">Save the Date Video</h2>
          <div className="bg-[#1a1c1c]/80 backdrop-blur-md p-2 border-l-4 border-[#32CD32] border-t border-r border-b border-white/10 relative aspect-video group cursor-pointer overflow-hidden shadow-2xl">
            {isPlayingVideo ? (
              <iframe
                title="Save the date video"
                src={getYouTubeEmbedUrl(props.loveStoryVideoUrl)}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full" onClick={() => setIsPlayingVideo(true)}>
                <img src={heroBgImg} alt="Video cover" className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-[#32CD32] rounded-full flex items-center justify-center shadow-[0_0_30px_#32CD32] group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-[#0A0A0A] fill-current ml-1" />
                  </div>
                  <p className="text-xs font-bold text-[#32CD32] uppercase tracking-widest mt-4">Watch Teaser</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="lime-silver" />
      </div>

      {/* Footer */}
      <footer className="bg-[#121414] border-t border-white/10 py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold">
          <span className="text-[#32CD32] uppercase tracking-widest">{initials}</span>
          <span className="text-[#c6c6c6]">&copy; 2026 {partner1} &amp; {partner2}. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
