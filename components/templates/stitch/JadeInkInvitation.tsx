"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  PartyPopper,
  Utensils,
  Menu,
  X,
  Sparkles,
  MapPin,
  Clock,
  Play,
  Heart,
} from "lucide-react";

export default function JadeInkInvitation(props: TemplateClassicFloralProps) {
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

  const heroBackgroundImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCG4bCaZSK50IQkhwqyRPKK0RFSTlB4YQoaj6K5kvV9_SpCx6lEnJKyEatJp6y-Q7HSpxYusiGKfd4perA31IdJYJSttLmd11OHZ014o7k_90fuzxCmYugOeG-rO3mKG-RxDDANRpQlq1hr6f5f1KQioZObdRN3zd_u6n6WdvEkX-kTBh2tUVPC_dp_bJvj0J4bwK0Lvc1xsu_Kh0N-CrRxHPN7jHphZSfB2BSttpTbw7BWbSoGqkdC";

  const coupleStoryImg =
    props.coupleImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDy0osn1K_AVlF9dhIxCrs1f8G5h4vFPqnpDbTb1N2YIqMJ6F5SlNkCZN-jbgnElta2JbrjBL2-dSni3qGzQFd3U_qc9bJeQNQeQlUMdmRZlJUjB9d0kz2vwrQ2dVaAYEU_pHk9idYalb-rNF_tTLp51vayJYdokMuCG53eegKTJveUkaY--5NCGO6sdJMzYS3akze_K425aUP7ouNZEPhVqgWmjaQY-BBy6XYTdzVvAVsqEmwe1hxK";

  const dinnerBgImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBW1He3ci0RjaaHTO-Ksp_k1fh-anr0Gooh3wDiufDZBYJ5Wt-yx4i4n6y8hUJoIU6XI4jFOOgpH1DR0ZPV9H-IwxrTOn3A9CJOIzosmxnWTKt5R9LN1u42X66xSHYaJJTPc8SBh56566LeZtlNPbZkFmXRTQFcWT45NnScEBgrXAzYYB5gtfsLazi8GwDus4nraWnAg7HRYGmbyLIWcUsb0dh7nhok5Od391a_4CJm1FPhBYxgzA4-";

  const defaultTimeline = [
    { time: "10:00 AM", title: "Wedding Ceremony", desc: "St. Antony Church, Kaval Kinaru", icon: <Church className="w-4 h-4 text-white" /> },
    { time: "12:00 PM", title: "Wedding Feast", desc: "A celebratory lunch with family and friends.", icon: <Utensils className="w-4 h-4 text-white" /> },
    { time: "07:00 PM", title: "Evening Reception", desc: "Ubahara Matha Mahal", icon: <PartyPopper className="w-4 h-4 text-white" /> },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t, i) => ({
          time: t.time,
          title: t.title,
          desc: "Schedule of Events",
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
    <div className="bg-[#f8f9fa] text-[#191c1d] font-sans antialiased selection:bg-[#78fbb6] selection:text-[#00331d] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="jade-ink"
      />

      {/* Top Navbar */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#bccabe]/50 ${
          navScrolled ? "bg-[#f8f9fa]/95 backdrop-blur-md py-3 shadow-md" : "bg-[#f8f9fa]/90 backdrop-blur-sm py-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-[1280px] mx-auto h-16">
          <a href="#" className="font-serif text-2xl font-bold text-[#191c1d] hover:text-[#006d43] transition-colors">
            {partner1} &amp; {partner2}
          </a>

          <nav className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest text-[#5d5e61]">
            <a href="#story" className="hover:text-[#006d43] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#006d43] transition-colors">Events</a>
            <a href="#timeline" className="hover:text-[#006d43] transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-[#006d43] transition-colors">Gallery</a>
          </nav>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#191c1d] text-white font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded hover:bg-[#006d43] transition-colors"
          >
            RSVP
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#191c1d]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#f8f9fa] border-b border-[#bccabe] px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#5d5e61]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#006d43] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 md:px-16 pt-28 pb-20">
        <div className="absolute inset-0 z-0">
          <div
            className="bg-cover bg-center w-full h-full opacity-25"
            style={{ backgroundImage: `url('${heroBackgroundImg}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8f9fa]/50 via-[#f8f9fa]/80 to-[#f8f9fa]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5d5e61]">
            {props.tagline || "TOGETHER WITH THEIR FAMILIES"}
          </p>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-[#191c1d] leading-none tracking-tight">
            {partner1} <span className="block text-[#006d43] italic font-serif my-3 font-normal">&amp;</span> {partner2}
          </h1>

          <p className="text-base sm:text-lg text-[#3d4a41] max-w-xl mx-auto">
            {props.inviteLine || "Invite you to celebrate their wedding"}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-6 pt-6 border-t border-[#bccabe]/50">
            <div className="text-center px-6">
              <p className="font-serif text-3xl font-bold text-[#006d43]">13</p>
              <p className="text-xs uppercase tracking-widest text-[#5d5e61] font-semibold">May 2026</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-[#bccabe]" />
            <div className="text-center px-6">
              <p className="font-serif text-3xl font-bold text-[#006d43]">10:00</p>
              <p className="text-xs uppercase tracking-widest text-[#5d5e61] font-semibold">AM Onwards</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Our Love Story Section */}
      <section className="py-24 px-6 md:px-16 max-w-[1280px] mx-auto" id="story">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-[#bccabe]/40"
          >
            <img src={coupleStoryImg} alt="Love Story Portrait" className="w-full h-full object-cover" />
          </motion.div>

          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-4xl font-bold text-[#191c1d]">Our Love Story</h2>
            <div className="w-12 h-0.5 bg-[#006d43]" />
            <p className="font-serif italic text-2xl text-[#3d4a41] leading-relaxed">
              "{props.loveStoryText || "Every love story is beautiful, but ours is my favorite."}"
            </p>
            <div>
              <a
                href="#rsvp"
                className="inline-flex items-center gap-2 border border-[#006d43] text-[#006d43] px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#006d43] hover:text-white transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Celebrate With Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Events */}
      <section className="py-24 px-6 md:px-16 bg-[#ffffff]" id="events">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16 flex flex-col items-center gap-3">
            <h2 className="font-serif text-4xl font-bold text-[#191c1d]">Wedding Events</h2>
            <div className="w-12 h-0.5 bg-[#006d43]" />
            <p className="text-sm text-[#5d5e61]">Join us as we step into a lifetime of love and togetherness</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wedding Ceremony (Span 2) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-2 bg-[#f8f9fa] border border-[#bccabe]/40 rounded-2xl p-8 shadow-sm flex flex-col justify-between min-h-[260px]"
            >
              <div>
                <Church className="w-8 h-8 text-[#006d43] mb-4" />
                <h3 className="font-serif text-2xl font-bold text-[#191c1d]">Wedding Ceremony</h3>
                <p className="text-xs text-[#5d5e61] mt-1 font-semibold">10:00 AM • May 13, 2026</p>
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#006d43] mt-6 inline-flex items-center gap-1 hover:underline">
                St. Antony Church, Kaval Kinaru <MapPin className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Lunch (Span 1) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-[#f8f9fa] border border-[#bccabe]/40 rounded-2xl p-8 shadow-sm flex flex-col justify-between min-h-[260px]"
            >
              <div>
                <Utensils className="w-8 h-8 text-[#006d43] mb-4" />
                <h3 className="font-serif text-2xl font-bold text-[#191c1d]">Lunch Feast</h3>
                <p className="text-xs text-[#5d5e61] mt-1 font-semibold">12:00 PM</p>
              </div>
              <p className="text-xs text-[#5d5e61]">Traditional celebratory lunch served with love.</p>
            </motion.div>

            {/* Reception (Span 1) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-[#f8f9fa] border border-[#bccabe]/40 rounded-2xl p-8 shadow-sm flex flex-col justify-between min-h-[260px]"
            >
              <div>
                <PartyPopper className="w-8 h-8 text-[#006d43] mb-4" />
                <h3 className="font-serif text-2xl font-bold text-[#191c1d]">Grand Reception</h3>
                <p className="text-xs text-[#5d5e61] mt-1 font-semibold">07:00 PM</p>
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#006d43] mt-6 inline-flex items-center gap-1 hover:underline">
                Ubahara Matha Mahal <MapPin className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Dinner (Span 2) */}
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-2 bg-[#f8f9fa] border border-[#bccabe]/40 rounded-2xl p-8 shadow-sm flex flex-col justify-between min-h-[260px] relative overflow-hidden"
            >
              <div className="absolute inset-0 z-0">
                <img src={dinnerBgImg} alt="Dinner Setting" className="w-full h-full object-cover opacity-15" />
              </div>
              <div className="relative z-10">
                <Utensils className="w-8 h-8 text-[#006d43] mb-4" />
                <h3 className="font-serif text-2xl font-bold text-[#191c1d]">Grand Dinner</h3>
                <p className="text-xs text-[#5d5e61] mt-1 font-semibold">08:00 PM Onwards</p>
              </div>
              <p className="relative z-10 text-xs text-[#3d4a41]">Fine dining, toasts, and evening celebrations.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 md:px-16 max-w-[1280px] mx-auto" id="timeline">
        <div className="text-center mb-16 flex flex-col items-center gap-3">
          <h2 className="font-serif text-4xl font-bold text-[#191c1d]">Event Timeline</h2>
          <div className="w-12 h-0.5 bg-[#006d43]" />
          <p className="text-sm text-[#5d5e61]">The schedule for our special day</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8 relative border-l-2 border-[#bccabe]/60 pl-6 ml-4 md:ml-auto">
          {timelineList.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative bg-white border border-[#bccabe]/40 p-5 rounded-xl shadow-sm"
            >
              <div className="absolute -left-[35px] top-4 w-8 h-8 rounded-full bg-[#006d43] text-white flex items-center justify-center shadow">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-[#006d43] uppercase tracking-widest">{item.time}</span>
              <h4 className="font-serif text-xl font-bold text-[#191c1d] mt-0.5">{item.title}</h4>
              <p className="text-xs text-[#5d5e61] mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Masonry Moments Gallery */}
      <section className="py-24 px-6 md:px-16 bg-[#ffffff]" id="gallery">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16 flex flex-col items-center gap-3">
            <h2 className="font-serif text-4xl font-bold text-[#191c1d]">Our Moments</h2>
            <div className="w-12 h-0.5 bg-[#006d43]" />
            <p className="text-sm text-[#5d5e61]">A glimpse into our beautiful journey</p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryList.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="break-inside-avoid rounded-2xl overflow-hidden shadow-md border border-[#bccabe]/30"
              >
                <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-auto object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="jade-ink" />
      </div>

      {/* Footer */}
      <footer className="w-full py-12 bg-[#191c1d] text-white border-t border-[#006d43]">
        <div className="flex flex-col items-center gap-3 px-6 max-w-[1280px] mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-[#78fbb6]">{partner1} &amp; {partner2}</h2>
          <p className="text-xs text-white/70">&copy; 2026 {partner1} &amp; {partner2}. Handcrafted with Love.</p>
        </div>
      </footer>
    </div>
  );
}
