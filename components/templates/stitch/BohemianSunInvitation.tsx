"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import { getYouTubeEmbedUrl } from "@/lib/dateUtils";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  Utensils,
  PartyPopper,
  Cake,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Menu,
  X,
  Play,
  Heart,
  Sun,
} from "lucide-react";

export default function BohemianSunInvitation(props: TemplateClassicFloralProps) {
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

  const storyImg =
    props.coupleImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuChHRExak4njHpFTXKKdh12T82uA_T9eJ4cm8dH6Yp_bFxQnffCKV_EiP3yvSr5htProXbM-BmfywOTd85esg9MzOuLSjSgMwMYgsSl-BQLvos3rfkgwumd4PS-AhrRCCrUR0ZSq7oAdfYYU-H5oeSP5Fin_USruuiCjcIsek-UxrAQQftkevcJ0xw1f0dvmOWpW46dvKP86T07kB1hB1BzuKcLohiM0SXjE-ZzCz0MR8vnD2ke9773";

  const defaultTimeline = [
    { time: "10:00 AM", title: "Marriage", icon: <Church className="w-5 h-5 text-[#91472a]" /> },
    { time: "01:00 PM", title: "Feast Lunch", icon: <Utensils className="w-5 h-5 text-[#91472a]" /> },
    { time: "07:00 PM", title: "Reception", icon: <PartyPopper className="w-5 h-5 text-[#91472a]" /> },
    { time: "07:30 PM", title: "Cake Cutting", icon: <Cake className="w-5 h-5 text-[#91472a]" /> },
    { time: "08:00 PM", title: "Grand Dinner", icon: <Utensils className="w-5 h-5 text-[#91472a]" /> },
  ];

  const timelineList =
    props.events && props.events.length > 0
      ? props.events.map((e, idx) => ({
          time: e.time,
          title: e.title,
          icon: defaultTimeline[idx % defaultTimeline.length]?.icon,
        }))
      : props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t, idx) => ({
          time: t.time,
          title: t.title,
          icon: defaultTimeline[idx % defaultTimeline.length]?.icon,
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
    <div className="bg-[#fdf9f4] text-[#1c1c19] font-sans antialiased selection:bg-[#ffdbcf] selection:text-[#380d00] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="bohemian-sun"
      />

      {/* Top Navbar */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#dac1b9]/50 ${
          navScrolled ? "bg-[#fdf9f4]/95 backdrop-blur-md py-3 shadow-sm" : "bg-[#fdf9f4]/90 backdrop-blur-sm py-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-[1280px] mx-auto">
          <a href="#" className="font-serif text-2xl font-bold italic text-[#91472a]">
            Bohemian Sun
          </a>

          <nav className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest text-[#54433d]">
            <a href="#story" className="hover:text-[#91472a] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#91472a] transition-colors">Events</a>
            <a href="#timeline" className="hover:text-[#91472a] transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-[#91472a] transition-colors">Gallery</a>
          </nav>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#91472a] text-white font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg hover:bg-[#af5e3f] transition-colors shadow-sm"
          >
            RSVP
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#91472a]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#fdf9f4] border-b border-[#dac1b9] px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#54433d]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#91472a] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 md:px-16 pt-28 pb-16 relative">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none flex items-center justify-center">
          <Sun className="w-96 h-96 text-[#ffddb9] animate-spin-slow" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto flex flex-col items-center"
        >
          <span className="text-xs font-bold text-[#546347] uppercase tracking-[0.25em] mb-3">
            {props.tagline || "WE ARE GETTING MARRIED"}
          </span>

          <h1 className="font-serif text-5xl sm:text-7xl font-bold text-[#91472a] mb-2 tracking-tight">
            {partner1} &amp; {partner2}
          </h1>

          <p className="font-serif italic text-xl text-[#7f5214] mb-8">
            {props.inviteLine || "Join us under the bohemian sun"}
          </p>

          <div className="w-full max-w-lg relative mt-4">
            <div className="aspect-[4/3] rounded-t-[120px] overflow-hidden border-2 border-[#e6e2dd] shadow-xl">
              <img src={coverImg} alt="Cover Photo" className="w-full h-full object-cover" />
            </div>

            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#fdf9f4] px-6 py-2.5 rounded-full shadow-md border border-[#dac1b9]/50 flex items-center gap-2 text-xs font-bold text-[#54433d] whitespace-nowrap">
              <Calendar className="w-4 h-4 text-[#91472a]" />
              <span>{props.weddingTime || props.weddingDate || "13th May 2026 • 10:00 AM"}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Meet the Bride & Groom Section */}
      <section className="py-20 px-6 md:px-16 bg-[#fdf9f4] border-b border-[#dac1b9]/50 relative overflow-hidden" id="couple">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div>
            <span className="text-[11px] font-bold text-[#546347] uppercase tracking-[0.3em] block mb-2">
              The Happy Couple
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#91472a] tracking-tight">
              Meet the Bride &amp; Groom
            </h2>
            <div className="w-16 h-0.5 bg-[#91472a] mx-auto mt-4 opacity-80" />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-4xl mx-auto">
            {/* Bride Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-[#f7f3ee] border-2 border-[#dac1b9]/60 p-4 rounded-t-[140px] rounded-b-3xl shadow-xl transition-all group relative"
            >
              <div className="aspect-[4/5] rounded-t-[125px] rounded-b-2xl overflow-hidden relative border border-[#dac1b9]/40">
                <img
                  src={brideImg}
                  alt={`${partner1} - Bride`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#91472a] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur-md shadow-md">
                  The Bride
                </div>
              </div>
              <div className="pt-6 pb-2 text-center">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1c1c19]">
                  {partner1}
                </h3>
                <p className="text-xs text-[#91472a] font-semibold uppercase tracking-widest mt-1">
                  Bride-To-Be
                </p>
              </div>
            </motion.div>

            {/* Central Heart Badge */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-[#91472a] text-[#ffdbcf] border-4 border-white shadow-2xl items-center justify-center">
              <Heart className="w-6 h-6 fill-current animate-pulse" />
            </div>

            {/* Groom Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-[#f7f3ee] border-2 border-[#dac1b9]/60 p-4 rounded-t-[140px] rounded-b-3xl shadow-xl transition-all group relative"
            >
              <div className="aspect-[4/5] rounded-t-[125px] rounded-b-2xl overflow-hidden relative border border-[#dac1b9]/40">
                <img
                  src={groomImg}
                  alt={`${partner2} - Groom`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#91472a] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur-md shadow-md">
                  The Groom
                </div>
              </div>
              <div className="pt-6 pb-2 text-center">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1c1c19]">
                  {partner2}
                </h3>
                <p className="text-xs text-[#91472a] font-semibold uppercase tracking-widest mt-1">
                  Groom-To-Be
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Celebration Film Video Section */}
      <section className="py-20 px-6 md:px-16 bg-[#380d00] text-white relative border-b border-[#dac1b9]/50" id="video">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <span className="text-xs font-bold text-[#ffdbcf] uppercase tracking-[0.25em] block mb-2">
              Cinematic Preview
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#ffdbcf]">
              Our Celebration Film
            </h2>
            <p className="text-sm font-serif text-[#fdf9f4]/80 mt-2 max-w-xl mx-auto">
              Watch a preview of our story and shared memories together.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#ffdbcf] aspect-video bg-black group">
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
                  src={coverImg}
                  alt="Video Poster"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#ffdbcf] text-[#380d00] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                  <p className="text-xs uppercase tracking-widest text-[#ffdbcf] font-bold">Watch Video</p>
                  <p className="text-xl font-serif font-bold">{partner1} &amp; {partner2}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="py-20 px-6 md:px-16 bg-[#f7f3ee] mt-12" id="story">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#91472a] mb-2">Our Journey</h2>
            <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
              <div className="h-px w-full bg-[#dac1b9]" />
              <Sparkles className="w-4 h-4 text-[#7f5214]" />
              <div className="h-px w-full bg-[#dac1b9]" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 text-sm sm:text-base text-[#54433d] space-y-4 leading-relaxed">
              <p>
                {props.loveStoryText ||
                  "Our story began under the warm sun of a late summer afternoon. What started as a chance meeting blossomed into a shared love for quiet mornings, long walks, and the beauty of simple moments."}
              </p>
              <p>
                Through countless cups of coffee and endless conversations, we realized our paths were meant to intertwine. We invite you to celebrate this next chapter with us.
              </p>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-[#fdf9f4] shadow-xl rotate-3">
                <img src={storyImg} alt="Couple Journey" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Celebrations Bento Section */}
      <section className="py-20 px-6 md:px-16 max-w-6xl mx-auto" id="events">
        <div id="venue">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#91472a] mb-2">Celebrations &amp; Venues</h2>
            <p className="text-sm text-[#54433d] max-w-md mx-auto">
              Join us for a weekend of love, laughter, and celebration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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
                    name: "Evening Reception",
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
                whileHover={{ y: -4 }}
                className="bg-[#fdf9f4] rounded-2xl p-6 border border-[#dac1b9]/50 shadow-lg flex flex-col justify-between scroll-mt-28"
              >
                <div>
                  <div className="h-48 rounded-xl overflow-hidden mb-6 border border-[#dac1b9]/40">
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

                  <span className="inline-block bg-[#d4e5c1] text-[#58674b] font-bold text-xs px-3 py-1 rounded-full mb-3">
                    {loc.venueLabel || (idx === 0 ? "Holy Matrimony" : "Grand Celebration")}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1c1c19] mb-2">
                    {loc.name || (idx === 0 ? "The Marriage Ceremony" : "Evening Reception")}
                  </h3>
                  <div className="flex items-center gap-2 mb-4 text-xs text-[#54433d] font-semibold">
                    <MapPin className="w-4 h-4 text-[#7f5214]" />
                    <span>{loc.address || "Kaval Kinaru, Tirunelveli District"}</span>
                  </div>
                </div>

                <div className="w-full h-44 rounded-xl overflow-hidden border border-[#dac1b9]/50 mb-4 bg-gray-100">
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
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#91472a] hover:underline uppercase"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Day Itinerary Timeline */}
      <section className="py-20 px-6 md:px-16 bg-[#f1ede8]" id="timeline">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#91472a] mb-12">Day Itinerary</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {timelineList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center bg-[#fdf9f4] border border-[#dac1b9]/40 p-5 rounded-2xl shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-[#fdf9f4] border-2 border-[#91472a]/50 flex items-center justify-center mb-3 shadow-inner">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-[#7f5214] mb-1">{item.time}</span>
                <span className="font-serif font-bold text-[#1c1c19] text-sm">{item.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organic Shapes Gallery */}
      <section className="py-20 px-6 md:px-16 bg-[#fdf9f4]" id="gallery">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#91472a] mb-2">Our Moments</h2>
          <p className="text-sm text-[#54433d] max-w-md mx-auto mb-12">
            Glimpses of love, laughter, and the beautiful journey we are embarking on.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-center">
            {galleryList.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className={`aspect-[4/5] overflow-hidden border-4 border-white shadow-xl ${
                  idx % 3 === 0
                    ? "rounded-[60px_120px_60px_120px]"
                    : idx % 3 === 1
                    ? "rounded-[120px_60px_120px_60px]"
                    : "rounded-full"
                }`}
              >
                <img src={img} alt={`Our Moment ${idx + 1}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="bohemian-sun" />
      </div>

      {/* Footer */}
      <footer className="bg-[#f1ede8] border-t border-[#dac1b9]/30 py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold">
          <span className="font-serif text-[#91472a] text-lg italic">{initials}</span>
          <span className="text-[#54433d]">&copy; 2026 {partner1} &amp; {partner2}. Crafted with Love.</span>
        </div>
      </footer>
    </div>
  );
}
