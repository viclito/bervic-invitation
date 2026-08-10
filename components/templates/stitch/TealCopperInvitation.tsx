"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { getWeddingTargetDate } from "@/lib/dateUtils";
import {
  Church,
  PartyPopper,
  Coffee,
  Heart,
  Utensils,
  Music,
  MapPin,
  Menu,
  X,
  Play,
  Sparkles,
} from "lucide-react";

export default function TealCopperInvitation(props: TemplateClassicFloralProps) {
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
    const updateTimer = () => {
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
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [props.weddingDate, props.weddingTime]);

  const partner1 = props.partnerOne || "Terance";
  const partner2 = props.partnerTwo || "Ancy";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const artDecoPatternImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDY5Zt6iboDwKNt77wxIMSXY8fbpVlmb7lBggYis9bpQ87UdeF4G0fprPj8EM_f8zVs2RGkrifN2pUkhvxW9C-EHjRS_Di2nc3i-Fph57T4XdlZeMNTJawHgbbOdHJvjObfy5OQy6v1UeQS6ME6SR_ETJCOcIz_dVLvSTCZzTZS6QSUpO5G8fEthKmJbOKEFtvDyWCV1-z_KSKHYNfI4vaQ9TXBPwgc_bYE-33-mbNynfBXs6KEUZqw";

  const defaultEvents = [
    {
      title: "Holy Matrimony",
      time: "Thursday, 13 May 2026 • 10:00 AM",
      venue: "St. Antony Church",
      address: "Kaval Kinaru, Tirunelveli District",
      mapLink: "https://maps.google.com",
    },
    {
      title: "Grand Reception",
      time: "Thursday, 13 May 2026 • 07:00 PM",
      venue: "Ubahara Matha Mahal",
      address: "Kaval Kinaru, Tirunelveli District",
      mapLink: "https://maps.google.com",
    },
  ];

  const eventsList =
    props.events && props.events.length > 0
      ? props.events.map((e, idx) => ({
          title: e.title,
          time: `${e.date || props.weddingDate || "13 May 2026"} • ${e.time || "10:00 AM"}`,
          venue: props.locations?.[idx % props.locations.length]?.name || props.venuePlace || "Wedding Venue",
          address: props.locations?.[idx % props.locations.length]?.address || props.contactAddress || "Venue Location",
          mapLink: props.locations?.[idx % props.locations.length]?.mapLink || "https://maps.google.com",
        }))
      : defaultEvents;

  const defaultTimeline = [
    { time: "09:00 AM", title: "Guest Arrival", desc: "Welcome drinks and seating", icon: <Coffee className="w-4 h-4 text-[#ffb77b]" /> },
    { time: "10:00 AM", title: "Ceremony Starts", desc: "The exchange of vows at Holy Matrimony", icon: <Heart className="w-4 h-4 text-[#ffb77b]" /> },
    { time: "12:30 PM", title: "Lunch & Photos", desc: "Family portraits and festive feast", icon: <Utensils className="w-4 h-4 text-[#ffb77b]" /> },
    { time: "06:00 PM", title: "Grand Reception", desc: "Dinner, dancing, and celebration", icon: <Music className="w-4 h-4 text-[#ffb77b]" /> },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t, i) => ({
          time: t.time,
          title: t.title,
          desc: t.desc || (t.date ? `Date: ${t.date}` : ""),
          icon: defaultTimeline[i % 4].icon,
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
    <div className="bg-[#131407] text-[#e4e4cc] font-sans antialiased selection:bg-[#76d6d5] selection:text-[#003737] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="teal-copper"
      />

      {/* Top Navigation */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#ffb77b]/30 ${
          navScrolled ? "bg-[#131407]/95 backdrop-blur-md py-3 shadow-md" : "bg-[#131407]/80 backdrop-blur-md py-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-[1280px] mx-auto h-16">
          <a href="#" className="font-serif text-2xl font-bold tracking-widest text-[#76d6d5]">
            {initials}
          </a>

          <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-[#bdc9c8]">
            <a href="#story" className="hover:text-[#ffb77b] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#ffb77b] transition-colors">Events</a>
            <a href="#timeline" className="hover:text-[#ffb77b] transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-[#ffb77b] transition-colors">Gallery</a>
          </nav>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#ffb77b] text-[#4d2700] font-bold text-xs uppercase tracking-widest px-6 py-2.5 hover:bg-white transition-colors"
          >
            RSVP
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#76d6d5]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#131407] border-b border-[#ffb77b]/40 px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#bdc9c8]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#ffb77b] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 px-6 md:px-16 bg-[#1f2111] overflow-hidden" id="story">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: `url('${artDecoPatternImg}')` }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto border border-[#ffb77b] p-8 sm:p-16 bg-[#343625]/80 backdrop-blur-md shadow-[0_0_25px_rgba(255,183,123,0.15)] relative"
        >
          {/* Corner Marks */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border border-[#ffb77b] bg-[#131407]" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border border-[#ffb77b] bg-[#131407]" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border border-[#ffb77b] bg-[#131407]" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border border-[#ffb77b] bg-[#131407]" />

          <p className="text-xs font-bold text-[#ffb77b] uppercase tracking-[0.25em] mb-6">
            {props.tagline || "TOGETHER WITH THEIR FAMILIES"}
          </p>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal text-[#76d6d5] uppercase tracking-wider mb-2">
            {partner1}
          </h1>

          <div className="flex items-center justify-center gap-4 my-4">
            <span className="h-px w-12 bg-[#ffb77b]" />
            <Heart className="w-5 h-5 text-[#ffb77b] fill-current" />
            <span className="font-serif italic text-lg text-[#bdc9c8]">and</span>
            <Heart className="w-5 h-5 text-[#ffb77b] fill-current" />
            <span className="h-px w-12 bg-[#ffb77b]" />
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal text-[#76d6d5] uppercase tracking-wider mb-8">
            {partner2}
          </h1>

          {/* Bride & Groom Couple Photo Card */}
          <div className="my-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="relative w-52 sm:w-64 h-64 sm:h-72 border-2 border-[#ffb77b] p-2 bg-[#131407] shadow-2xl overflow-hidden group rounded-sm">
              <img
                src={props.coupleImage || props.coverImage || props.heroImage || "/images/templates/couple-photo.jpg"}
                alt={`${partner1} & ${partner2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 border border-[#ffb77b]/40 m-2 pointer-events-none" />
            </div>

            {props.partnerTwoImage && (
              <div className="relative w-52 sm:w-64 h-64 sm:h-72 border-2 border-[#ffb77b] p-2 bg-[#131407] shadow-2xl overflow-hidden group rounded-sm">
                <img
                  src={props.partnerTwoImage}
                  alt={partner2}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 border border-[#ffb77b]/40 m-2 pointer-events-none" />
              </div>
            )}
          </div>

          <p className="text-base sm:text-lg text-[#e4e4cc] mb-8 max-w-lg mx-auto leading-relaxed">
            {props.inviteLine || "Invite you to celebrate their wedding"}
          </p>

          <div className="inline-block border border-[#ffb77b] p-4 px-8 mb-8 bg-[#131407]/60">
            <p className="font-serif text-2xl font-bold text-[#ffb77b]">{props.weddingDate || "13th May 2026"}</p>
            <p className="text-xs text-[#bdc9c8] mt-1 font-semibold uppercase tracking-wider">{props.weddingTime || "10:00 AM Onwards"}</p>
          </div>

          <div>
            <a
              href="#rsvp"
              className="inline-block bg-[#ffb77b] text-[#4d2700] px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors border border-[#ffb77b]"
            >
              Save the Date
            </a>
          </div>
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 px-6 md:px-16 bg-[#0e0f03] text-center border-y border-[#ffb77b]/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-[#76d6d5] mb-2 uppercase tracking-wide">Our Big Day</h2>
          <div className="flex items-center justify-center gap-4 my-4 max-w-xs mx-auto">
            <div className="h-px w-full bg-[#ffb77b]/40" />
            <Heart className="w-4 h-4 text-[#ffb77b] fill-current shrink-0" />
            <div className="h-px w-full bg-[#ffb77b]/40" />
          </div>

          <div className="flex justify-center gap-4 sm:gap-8 mt-10">
            <div className="border border-[#ffb77b] p-5 sm:p-6 w-24 sm:w-32 bg-[#131407] shadow-[0_0_15px_rgba(255,183,123,0.15)] relative">
              <div className="font-serif text-3xl sm:text-5xl text-[#ffb77b] font-bold">
                {String(timeLeft.days).padStart(2, "0")}
              </div>
              <div className="text-[10px] font-bold text-[#bdc9c8] uppercase tracking-widest mt-2">DAYS</div>
            </div>

            <div className="border border-[#ffb77b] p-5 sm:p-6 w-24 sm:w-32 bg-[#131407] shadow-[0_0_15px_rgba(255,183,123,0.15)] relative">
              <div className="font-serif text-3xl sm:text-5xl text-[#ffb77b] font-bold">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="text-[10px] font-bold text-[#bdc9c8] uppercase tracking-widest mt-2">HOURS</div>
            </div>

            <div className="border border-[#ffb77b] p-5 sm:p-6 w-24 sm:w-32 bg-[#131407] shadow-[0_0_15px_rgba(255,183,123,0.15)] relative">
              <div className="font-serif text-3xl sm:text-5xl text-[#ffb77b] font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="text-[10px] font-bold text-[#bdc9c8] uppercase tracking-widest mt-2">MINUTES</div>
            </div>

            <div className="border border-[#ffb77b] p-5 sm:p-6 w-24 sm:w-32 bg-[#131407] shadow-[0_0_15px_rgba(255,183,123,0.15)] relative">
              <div className="font-serif text-3xl sm:text-5xl text-[#ffb77b] font-bold">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
              <div className="text-[10px] font-bold text-[#bdc9c8] uppercase tracking-widest mt-2">SECONDS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Events Section */}
      <section className="py-20 px-6 md:px-16 bg-[#1f2111] text-center relative overflow-hidden" id="events">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl text-[#76d6d5] mb-2 uppercase tracking-wide">Wedding Events</h2>
          <div className="flex items-center justify-center gap-4 my-4 max-w-xs mx-auto mb-12">
            <div className="h-px w-full bg-[#ffb77b]/40" />
            <Heart className="w-4 h-4 text-[#ffb77b] fill-current shrink-0" />
            <div className="h-px w-full bg-[#ffb77b]/40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {eventsList.map((evt, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="border border-[#ffb77b] p-8 bg-[#343625]/80 backdrop-blur-md flex flex-col items-center justify-between h-full shadow-[0_0_20px_rgba(255,183,123,0.12)] relative"
              >
                <div className="mb-4">
                  {idx % 2 === 0 ? (
                    <Church className="w-10 h-10 text-[#ffb77b] mx-auto mb-3" />
                  ) : (
                    <PartyPopper className="w-10 h-10 text-[#ffb77b] mx-auto mb-3" />
                  )}
                  <h3 className="font-serif text-2xl text-[#76d6d5] uppercase font-bold">{evt.title}</h3>
                  <p className="text-xs text-[#ffb77b] font-semibold mt-1">{evt.time}</p>
                </div>

                <div className="w-16 h-px bg-[#ffb77b]/50 my-4" />

                <div className="mb-6">
                  <p className="text-base font-bold text-[#e4e4cc] mb-1">{evt.venue}</p>
                  <p className="text-xs text-[#bdc9c8]">{evt.address}</p>
                </div>

                <a
                  href={evt.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-[#ffb77b] text-[#ffb77b] px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#ffb77b] hover:text-[#4d2700] transition-colors"
                >
                  <MapPin className="w-4 h-4" /> View on Map
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Timeline */}
      <section className="py-20 px-6 md:px-16 bg-[#1b1d0e] text-center" id="timeline">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-[#76d6d5] mb-2 uppercase tracking-wide">Event Timeline</h2>
          <div className="flex items-center justify-center gap-4 my-4 max-w-xs mx-auto mb-12">
            <div className="h-px w-full bg-[#ffb77b]/40" />
            <Heart className="w-4 h-4 text-[#ffb77b] fill-current shrink-0" />
            <div className="h-px w-full bg-[#ffb77b]/40" />
          </div>

          <div className="space-y-8 relative">
            {timelineList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="border border-[#ffb77b]/60 bg-[#131407] p-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-[#ffb77b] bg-[#343625] flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-bold text-[#76d6d5] uppercase">{item.title}</h4>
                    <p className="text-xs text-[#bdc9c8] mt-0.5">{item.desc}</p>
                  </div>
                </div>

                <div className="font-serif text-xl font-bold text-[#ffb77b] shrink-0 sm:text-right">
                  {item.time}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 md:px-16 bg-[#1f2111] text-center" id="gallery">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-[#76d6d5] mb-2 uppercase tracking-wide">Our Moments</h2>
          <div className="flex items-center justify-center gap-4 my-4 max-w-xs mx-auto mb-12">
            <div className="h-px w-full bg-[#ffb77b]/40" />
            <Sparkles className="w-4 h-4 text-[#ffb77b] shrink-0" />
            <div className="h-px w-full bg-[#ffb77b]/40" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryList.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="border border-[#ffb77b] p-2 bg-[#343625] overflow-hidden group shadow-md"
              >
                <img
                  src={img}
                  alt={`Moment ${idx + 1}`}
                  className="w-full h-64 object-cover filter brightness-90 group-hover:brightness-110 transition-all duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="teal-copper" />
      </div>

      {/* Footer */}
      <footer className="bg-[#0e0f03] border-t border-[#ffb77b]/30 py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold">
          <span className="font-serif text-[#76d6d5] text-lg uppercase tracking-widest">{initials}</span>
          <span className="text-[#bdc9c8]">&copy; 2026 {partner1} &amp; {partner2}. Handcrafted with Love.</span>
        </div>
      </footer>
    </div>
  );
}
