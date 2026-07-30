"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  PartyPopper,
  Menu,
  X,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";

export default function VeridianGardenInvitation(props: TemplateClassicFloralProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

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

  const coupleImg1 =
    props.coupleImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBmET8Ov9nd9F_OcOL2e8nAi-N9bWyoHs-r0O-BHihHuFVwS4XqOCnnD9ATnWLidSUbQho3zkNo1a4MiT9FQY1aLrltxcopfCs6cXuRna-yPoFVsd5zWK5qP8o9AbkmJoxlfTSGN_9XjcvCuZH-UhXu7OgFg-LVUGnh2wpTsryMueMD69e7KbhvrKzyGSgo9QVCIuhp13V7BfNyjaJs2sRy6gy2bqGpczDve2KMx41wZuKZsVF8bBbB";

  const coupleImg2 =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDunvjY0ZM_XJordm4ZIu-5YRH6MEHia0nwL4co2m8ebxNAEmaz-sCAWqBXDCzpLjFJBDxqB_9ILqfn1LtAANX7ZmszlaTVGbTh-8lT6rdkMghWrM8Wib5klbJej1_J6oopwtnjrVWaALMtlUbHJW-VLCa50SI9PPmYSnA7qT5d0DQke1t3geCV-oaTbDDwGA6pjj2pzYdZi4md6wtHIp3MLuzNyaizYqARMz7KKs4gzOpjN6ToXndO";

  const defaultTimeline = [
    { time: "10:00 AM", title: "Ceremony", desc: "Exchange of vows and rings at St. Antony Church." },
    { time: "11:30 AM", title: "Photos", desc: "Family portraits and couple session." },
    { time: "07:00 PM", title: "Reception", desc: "Dinner, drinks, and dancing late into the night at Ubahara Matha Mahal." },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t) => ({
          time: t.time,
          title: t.title,
          desc: "Main Event",
        }))
      : defaultTimeline;

  const defaultGallery = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCUz0cnV241uvI_OHaJPjSJ97w8MMWbOYAQ_1F1GEA2nQOYHYp-Hmppn29Nl6LJrvjotXtr5oAmo3vHrswtxMEloIHM91NELnTD1ObKcXzumtzaw7SLaw8dqcnkLJCixgqxC2MwhN0rl7sHAULb8yU98qMjekfm6nO2yymlCzLsnyFEX0ANShLdc9sw19Idr0x21_QCeRtRBeWMi72u8C1ebSvjoJ-0yfvc0WJe6QWpzhByK-W3UO7F",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCSDfag3Gcfp9UjchLN3NXiFcEKzW96Iq0rWZVo2hyMAYFcVDwjlWeadMZLG2Unc0rV54ifVgxZXuBCcDcajcyT_iXd_qLDNLChGymMJdUSs2t3qvDS-aFOD90Gu3JqP6QPvMylWRCGOOhVA_Hh-HRLf5S_ojYRzPKcaDJozENxzaJc0UjK63gk5GldozFDxQF1hQc_oqjyHM_P81qUGbjMY1yHW18trqruXr9e2Nhmg4qgBMCqwr5Z",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBRgKKA45k3FsudZ1UMmVv0UdnWdb7gA72ODWEC1CTH8RYGYi01jROFBCLMWNTIpya_Nf7nKmjepc93IfhUZ0y7cUbIX4S6D--nKjcSg8ZvvDdpEKc6LX-8Q5zZTZ3Ah14uYginvoX-6sTJajAvhzgM8bSQO-vzAUPHxAKMz-NgU8xXW7qMrbVO-F46zAU7Eod5JOUYnYuFrXAywsr1iA6BffnwxHlKyFpamm-ApdpeDuyAWWZizEDd",
  ];

  const galleryList = props.galleryImages && props.galleryImages.length >= 3 ? props.galleryImages : defaultGallery;

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] font-serif antialiased selection:bg-[#735c00]/30 selection:text-[#061b0e] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="veridian-garden"
      />

      {/* Top Navigation */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b-2 border-[#061b0e] ${
          navScrolled ? "bg-[#fbf9f8]/95 backdrop-blur-md py-3 shadow-md" : "bg-[#fbf9f8] py-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-7xl mx-auto">
          <a href="#" className="font-serif text-2xl font-bold uppercase tracking-widest text-[#061b0e] hover:text-[#735c00] transition-colors">
            The Conservatory
          </a>

          <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-[#434843]">
            <a href="#story" className="hover:text-[#735c00] transition-colors">Our Story</a>
            <a href="#event" className="hover:text-[#735c00] transition-colors">Event Details</a>
            <a href="#locations" className="hover:text-[#735c00] transition-colors">Locations</a>
            <a href="#gallery" className="hover:text-[#735c00] transition-colors">Gallery</a>
            <a href="#rsvp" className="hover:text-[#735c00] transition-colors">RSVP</a>
          </nav>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#061b0e] text-[#ffe088] font-bold text-xs uppercase tracking-widest px-6 py-3 border border-transparent hover:border-[#735c00] hover:bg-[#735c00] hover:text-white transition-all shadow-sm transform hover:-translate-y-0.5"
          >
            Save the Date
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#061b0e]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#fbf9f8] border-b border-[#061b0e] px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#434843]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#event" onClick={() => setMobileMenuOpen(false)}>Event Details</a>
            <a href="#locations" onClick={() => setMobileMenuOpen(false)}>Locations</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#061b0e] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-16 pt-28 pb-16 flex flex-col items-center text-center">
        {/* Double Gold Ornate Border Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-14 w-full max-w-3xl bg-white border-2 border-[#735c00] relative shadow-lg"
        >
          <div className="absolute inset-1 border border-[#735c00] pointer-events-none" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#061b0e] mb-4">
            {props.tagline || "JOYFULLY ANNOUNCING THE MARRIAGE OF"}
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-[#061b0e] mb-3 tracking-tight">
            {partner1} <span className="text-[#735c00] italic font-light">&amp;</span> {partner2}
          </h1>

          <p className="italic text-lg md:text-xl text-[#434843] mt-2">
            {props.weddingTime || "May 13, 2026"}
          </p>
        </motion.div>

        {/* Side-by-Side Framed Portraits */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="border border-[#061b0e] p-2 bg-[#fbf9f8] shadow-md">
            <img src={coupleImg1} alt="Portrait 1" className="w-full h-80 md:h-96 object-cover" />
          </div>
          <div className="border border-[#061b0e] p-2 bg-[#fbf9f8] shadow-md">
            <img src={coupleImg2} alt="Portrait 2" className="w-full h-80 md:h-96 object-cover" />
          </div>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="w-full bg-[#f5f3f2] py-20 px-6 md:px-16" id="story">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#061b0e] mb-4">A Chapter Unfolds</h2>

          {/* Ornate Diamond Divider */}
          <div className="flex items-center justify-center my-6">
            <div className="flex-1 h-px bg-[#735c00]" />
            <div className="mx-4 w-2.5 h-2.5 bg-[#735c00] rotate-45" />
            <div className="flex-1 h-px bg-[#735c00]" />
          </div>

          <p className="text-base md:text-lg text-[#434843] leading-relaxed">
            {props.loveStoryText ||
              "Rooted in shared values and nurtured by time, our story is one of quiet growth and enduring companionship. Like an ancient conservatory housing rare blooms, our journey together has been cultivated with patience, respect, and an abiding love. We invite you to witness the next season of our lives."}
          </p>
        </div>
      </section>

      {/* Bento Grid Event Details */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-16 py-20" id="event">
        <h2 className="text-3xl md:text-4xl font-bold text-[#061b0e] text-center mb-12">
          The Ceremony &amp; Celebration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Ceremony Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-7 bg-white border border-[#735c00] p-8 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#061b0e]" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#061b0e] mb-2">The Ceremony</p>
                <h3 className="text-2xl font-bold text-[#061b0e] mb-1">St. Antony Church</h3>
                <p className="italic text-sm text-[#434843] mb-4">10:00 AM</p>
                <p className="text-sm text-[#1b1c1c]">Join us for the solemnization of our vows in the historic sanctuary.</p>
              </div>
              <Church className="w-9 h-9 text-[#735c00] flex-shrink-0" />
            </div>
          </motion.div>

          {/* Reception Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-5 bg-[#1b3022] text-[#819986] p-8 relative shadow-sm"
          >
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#735c00]" />
            <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">The Reception</p>
            <h3 className="text-2xl font-bold text-white mb-1">Ubahara Matha Mahal</h3>
            <p className="italic text-sm mb-4 opacity-90">7:00 PM</p>
            <p className="text-sm text-white/90">An evening of dining, dancing, and joyous celebration to commemorate our union.</p>
          </motion.div>

          {/* Date Card */}
          <div className="md:col-span-12 border-2 border-[#735c00] p-6 text-center bg-[#fbf9f8] flex flex-col md:flex-row items-center justify-center gap-8 relative shadow-sm">
            <div className="absolute inset-1 border border-[#735c00] pointer-events-none" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#735c00] mb-1">Date</p>
              <p className="text-2xl font-bold text-[#061b0e]">May 13</p>
            </div>
            <div className="h-10 w-px bg-[#735c00] hidden md:block" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#735c00] mb-1">Year</p>
              <p className="text-2xl font-bold text-[#061b0e]">2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations & Maps */}
      <section className="w-full bg-[#f5f3f2] py-20 px-6 md:px-16" id="locations">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#061b0e] text-center mb-12">Event Locations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ceremony Map */}
            <div className="bg-white p-6 border-2 border-[#735c00] relative flex flex-col gap-4 shadow-sm">
              <div className="absolute inset-1 border border-[#735c00] pointer-events-none" />
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-[#061b0e]">St. Antony Church</h3>
                  <p className="text-xs text-[#434843] mt-1">123 Sanctuary Way, Cityville</p>
                </div>
                <MapPin className="w-7 h-7 text-[#735c00]" />
              </div>
              <div className="w-full h-60 bg-[#e4e2e1] border border-[#c3c8c1] rounded overflow-hidden">
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

            {/* Reception Map */}
            <div className="bg-white p-6 border-2 border-[#735c00] relative flex flex-col gap-4 shadow-sm">
              <div className="absolute inset-1 border border-[#735c00] pointer-events-none" />
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-[#061b0e]">Ubahara Matha Mahal</h3>
                  <p className="text-xs text-[#434843] mt-1">456 Celebration Ave, Cityville</p>
                </div>
                <MapPin className="w-7 h-7 text-[#735c00]" />
              </div>
              <div className="w-full h-60 bg-[#e4e2e1] border border-[#c3c8c1] rounded overflow-hidden">
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

      {/* Order of Events Timeline */}
      <section className="w-full max-w-4xl mx-auto px-6 md:px-16 py-20" id="timeline">
        <h2 className="text-3xl font-bold text-[#061b0e] text-center mb-2">Order of Events</h2>
        <div className="flex items-center justify-center my-6">
          <div className="flex-1 h-px bg-[#735c00]" />
          <div className="mx-4 w-2.5 h-2.5 bg-[#735c00] rotate-45" />
          <div className="flex-1 h-px bg-[#735c00]" />
        </div>

        <div className="relative border-l-2 border-[#735c00] ml-4 md:ml-0 md:border-l-0 md:border-t-2 md:mt-16 md:flex md:justify-between md:pt-8 space-y-8 md:space-y-0">
          {timelineList.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative pl-8 md:pl-0 md:flex-1 md:text-center group"
            >
              <div className="absolute -left-[9px] top-1 md:top-[-41px] md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-[#735c00] border-4 border-[#fbf9f8] group-hover:bg-[#061b0e] transition-colors" />
              <p className="text-xs font-bold text-[#735c00] mb-1 uppercase tracking-widest">{item.time}</p>
              <h4 className="text-xl font-bold text-[#061b0e] mb-1">{item.title}</h4>
              <p className="text-xs text-[#434843] md:px-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Moments Gallery */}
      <section className="w-full bg-[#eae8e7] py-20 px-6 md:px-16" id="gallery">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#061b0e] text-center mb-2">Our Moments</h2>
          <p className="italic text-center text-xs text-[#434843] mb-10 max-w-2xl mx-auto">
            Glimpses of our journey, framed in love and light.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryList.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="border-2 border-[#735c00] p-3 bg-white relative shadow-sm"
              >
                <div className="absolute inset-1 border border-[#735c00] pointer-events-none" />
                <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-64 object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="veridian-garden" />
      </div>

      {/* Footer */}
      <footer className="bg-[#1b3022] text-[#819986] flex flex-col items-center gap-4 py-12 px-6 w-full border-t-2 border-[#735c00]">
        <div className="text-2xl font-bold uppercase tracking-widest text-white">
          The Conservatory
        </div>
        <p className="text-xs opacity-80 text-center">
          &copy; 2026 {partner1} &amp; {partner2}. Handcrafted for a lifetime together.
        </p>
      </footer>
    </div>
  );
}
