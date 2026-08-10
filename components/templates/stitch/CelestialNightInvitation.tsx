"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  PartyPopper,
  MapPin,
  Menu,
  X,
  Play,
  Sparkles,
  Moon,
  Star,
  Calendar,
  Clock,
  Heart,
} from "lucide-react";

import { getWeddingTargetDate, getYouTubeEmbedUrl } from "@/lib/dateUtils";

export default function CelestialNightInvitation(props: TemplateClassicFloralProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    const targetDate = getWeddingTargetDate(props.weddingDate, props.weddingTime);
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [props.weddingDate, props.weddingTime]);

  const partner1 = props.partnerOne || "Terance";
  const partner2 = props.partnerTwo || "Ancy";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const coupleHeroImg =
    props.heroImage ||
    "https://lh3.googleusercontent.com/aida/AP1WRLvWfzXdN3dHblHMwCfYoZzOQpFd55WruE3qhpS4L0St43rwB0l9HRsSVUPWL226kWxQkGJRu6OUJ5cOQo4G0Vp8s-N63YtcTfH8vIaWTvvr9rHykEUQ0mI_v8bBC7ZTc8VAO1--z-jMa4pg_IU1uaN3Gd76BW-8k-d4R5LU4PtaWr7aPUpDbHttGiVo0D0y6Y_O7PNACCjqktCyXRVWMTP8nJzTwqnxpfozIb53uukdEtbwZ1iwTN6b4rI";

  const videoCoverImg =
    props.coverImage ||
    props.coupleImage ||
    props.heroImage ||
    "/images/templates/couple-photo.jpg";

  const defaultEvents = [
    {
      title: "Holy Matrimony",
      time: "MAY 13, 2026 • 10:00 AM",
      venue: "St. Antony Church",
      address: "Kaval Kinaru, Tirunelveli District",
      mapLink: "https://maps.google.com",
    },
    {
      title: "Starlight Reception",
      time: "MAY 13, 2026 • 07:00 PM",
      venue: "Ubahara Matha Mahal",
      address: "Kaval Kinaru, Tirunelveli District",
      mapLink: "https://maps.google.com",
    },
  ];

  const eventsList =
    props.events && props.events.length > 0
      ? props.events.map((e, idx) => ({
          title: e.title,
          time: `${e.date || props.weddingDate || "MAY 13, 2026"} • ${e.time || "10:00 AM"}`,
          venue: props.locations?.[idx % props.locations.length]?.name || props.venuePlace || "Wedding Venue",
          address: props.locations?.[idx % props.locations.length]?.address || props.contactAddress || "Venue Location",
          mapLink: props.locations?.[idx % props.locations.length]?.mapLink || "https://maps.google.com",
        }))
      : defaultEvents;

  const defaultTimeline = [
    { time: "10:00 AM", title: "Holy Matrimony", desc: "Exchange of sacred vows under the celestial arch" },
    { time: "12:30 PM", title: "Feast & Toast", desc: "Celebratory feast with royal toast" },
    { time: "07:00 PM", title: "Starlight Reception", desc: "Grand evening ball under twinkling stars" },
    { time: "08:30 PM", title: "Cake Cutting & Fireworks", desc: "Illuminating celebration and dinner" },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t) => ({
          time: t.time,
          title: t.title,
          desc: t.desc || (t.date ? `Date: ${t.date}` : ""),
        }))
      : props.events && props.events.length > 0
      ? props.events.map((e) => ({
          time: e.time,
          title: e.title,
          desc: e.date ? `Date: ${e.date}` : "",
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
    <div className="bg-[#090a10] text-[#e0e2ec] font-sans antialiased selection:bg-[#d4af37] selection:text-[#090a10] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="celestial-night"
      />

      {/* Top Navigation */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#d4af37]/30 ${
          navScrolled ? "bg-[#090a10]/95 backdrop-blur-md py-3 shadow-lg shadow-black/50" : "bg-[#090a10]/80 backdrop-blur-sm py-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-[1280px] mx-auto h-16">
          <a href="#" className="font-serif text-2xl font-bold text-[#d4af37] tracking-wider flex items-center gap-2">
            <Moon className="w-5 h-5 text-[#d4af37]" /> {initials}
          </a>

          <div className="hidden md:flex gap-8 items-center text-xs font-semibold uppercase tracking-widest text-[#a3a8be]">
            <a href="#story" className="hover:text-[#d4af37] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#d4af37] transition-colors">Events</a>
            <a href="#timeline" className="hover:text-[#d4af37] transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-[#d4af37] transition-colors">Gallery</a>
          </div>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#d4af37] text-[#090a10] font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded border border-[#d4af37] hover:bg-white transition-colors"
          >
            RSVP
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#d4af37]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#090a10] border-b border-[#d4af37] px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#a3a8be]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#d4af37] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-28 pb-20 px-6 overflow-hidden" id="story">
        <div className="absolute inset-0 z-0 opacity-65">
          <img src={coupleHeroImg} alt="Celestial background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090a10]/50 via-[#090a10]/75 to-[#090a10]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-[0.3em]">
            <Star className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>WRITTEN IN THE STARS</span>
            <Star className="w-3.5 h-3.5 fill-current animate-pulse" />
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-white tracking-tight flex flex-col gap-2">
            <span>{partner1}</span>
            <span className="text-[#d4af37] font-serif italic text-4xl">&amp;</span>
            <span>{partner2}</span>
          </h1>

          {/* Bride & Groom Couple Photo Card */}
          <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6 z-10">
            <div className="relative w-52 sm:w-64 h-64 sm:h-72 border-2 border-[#d4af37] p-2 bg-[#121420] shadow-2xl overflow-hidden group rounded-xl">
              <img
                src={props.coupleImage || props.coverImage || props.heroImage || "/images/templates/couple-photo.jpg"}
                alt={`${partner1} & ${partner2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 border border-[#d4af37]/40 m-2 rounded-lg pointer-events-none" />
            </div>

            {props.partnerTwoImage && (
              <div className="relative w-52 sm:w-64 h-64 sm:h-72 border-2 border-[#d4af37] p-2 bg-[#121420] shadow-2xl overflow-hidden group rounded-xl">
                <img
                  src={props.partnerTwoImage}
                  alt={partner2}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 border border-[#d4af37]/40 m-2 rounded-lg pointer-events-none" />
              </div>
            )}
          </div>

          <p className="text-base sm:text-lg text-[#a3a8be] max-w-xl mx-auto">
            {props.inviteLine || "Invite you to celebrate their union under the starlight sky"}
          </p>

          <div className="border border-[#d4af37]/40 p-6 rounded-xl backdrop-blur-md bg-[#090a10]/60 shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col items-center">
            <p className="font-serif text-3xl font-bold text-[#d4af37]">{props.weddingDate || "13th May 2026"}</p>
            <p className="text-xs font-bold text-white uppercase tracking-widest mt-1">{props.weddingTime || "10:00 AM ONWARDS"}</p>
          </div>

          {/* Countdown Grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 mt-4">
            {[
              { label: "DAYS", val: timeLeft.days },
              { label: "HOURS", val: timeLeft.hours },
              { label: "MINS", val: timeLeft.minutes },
              { label: "SECS", val: timeLeft.seconds },
            ].map((unit, i) => (
              <div key={i} className="bg-[#121420] border border-[#d4af37]/30 px-4 py-3 rounded-lg min-w-[70px]">
                <span className="font-serif text-2xl font-bold text-[#d4af37] block">{String(unit.val).padStart(2, "0")}</span>
                <span className="text-[10px] font-bold text-[#a3a8be] uppercase tracking-wider">{unit.label}</span>
              </div>
            ))}
          </div>

          <a
            href="#rsvp"
            className="mt-4 bg-[#d4af37] text-[#090a10] font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded hover:bg-white transition-colors shadow-lg"
          >
            Save the Date
          </a>
        </motion.div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-6 md:px-16 max-w-[1280px] mx-auto" id="events">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-[#d4af37] mb-3">Celestial Events</h2>
          <div className="w-16 h-0.5 bg-[#d4af37] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {eventsList.map((evt, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="bg-[#121420] border border-[#d4af37]/40 p-8 sm:p-10 text-center rounded-xl shadow-xl flex flex-col justify-between"
            >
              <div>
                {idx % 2 === 0 ? (
                  <Church className="w-10 h-10 text-[#d4af37] mx-auto mb-4" />
                ) : (
                  <PartyPopper className="w-10 h-10 text-[#d4af37] mx-auto mb-4" />
                )}
                <h3 className="font-serif text-2xl font-bold text-white mb-1">{evt.title}</h3>
                <p className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-4">{evt.time}</p>
                <p className="text-xs text-[#a3a8be] mb-6 leading-relaxed">
                  {evt.venue}<br />{evt.address}
                </p>
              </div>
              <a
                href={evt.mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-[#d4af37] text-[#d4af37] px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#d4af37] hover:text-[#090a10] transition-colors"
              >
                <MapPin className="w-4 h-4" /> View Location
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 md:px-16 bg-[#0e1018]" id="timeline">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#d4af37] mb-3">Celebration Flow</h2>
            <div className="w-16 h-0.5 bg-[#d4af37] mx-auto" />
          </div>

          <div className="flex flex-col gap-6">
            {timelineList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-[#121420] border border-[#d4af37]/30 p-6 rounded-xl flex items-center gap-6 shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-[#090a10] border border-[#d4af37] text-[#d4af37] flex items-center justify-center font-bold text-xs shrink-0">
                  <Star className="w-5 h-5 fill-current text-[#d4af37]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-1">{item.time}</span>
                  <h4 className="font-serif text-lg font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-[#a3a8be]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 px-6 md:px-16 max-w-[1280px] mx-auto" id="gallery">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-[#d4af37] mb-3">Our Starlight Moments</h2>
          <div className="w-16 h-0.5 bg-[#d4af37] mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryList.map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="group relative overflow-hidden rounded-xl aspect-square shadow-lg border border-[#d4af37]/30"
            >
              <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[#090a10]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Love Story Video Facade */}
      <section className="py-24 px-6 md:px-16 bg-[#0e1018] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-[#d4af37] mb-3">Celestial Story</h2>
          <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mb-10" />

          <div className="relative aspect-video rounded-xl overflow-hidden border border-[#d4af37]/40 shadow-2xl group cursor-pointer">
            {isPlayingVideo ? (
              <iframe
                title="Love story video"
                src={getYouTubeEmbedUrl(props.loveStoryVideoUrl)}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full" onClick={() => setIsPlayingVideo(true)}>
                <img src={videoCoverImg} alt="Video Cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center bg-[#090a10]/50">
                  <div className="w-20 h-20 bg-[#d4af37] rounded-full flex items-center justify-center text-[#090a10] group-hover:scale-110 transition-transform shadow-xl">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="celestial-night" />
      </div>

      {/* Footer */}
      <footer className="bg-[#050609] border-t border-[#d4af37]/20 py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold">
          <span className="font-serif text-[#d4af37] text-lg">{initials}</span>
          <span className="text-[#a3a8be]">&copy; 2026 {partner1} &amp; {partner2}. Celestial Night Weddings.</span>
        </div>
      </footer>
    </div>
  );
}
