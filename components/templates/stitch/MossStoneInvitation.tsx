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
  Clock,
  Calendar,
} from "lucide-react";

export default function MossStoneInvitation(props: TemplateClassicFloralProps) {
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

  const archHeroImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC_KRSL4qgXTZlSEB5QSWBr0fQ3cx2xsJjp_LfTXZJdZLmHGF2ZF0k4QeyTUrGQeyJMvqyCMCP0r0n2gDBiGx1L4el-tm8YzE5gnq064HUHJOYYgvZL2oUQjRt8YI5kIUz682EBFxlopiQZCscE_F1b3l1Q9zDissZPDzgGF5yQmIN4XT62j31HmT4nE3Md_-_hQ02IP1q3cIJNwIh7LxRDO0HvjuIup3g_diVXhXGwo9faKmCNZ0fl";

  const defaultTimeline = [
    { time: "9:30 AM", title: "Arrival of Guests", desc: "Welcome drinks, seating, and ambient music" },
    { time: "10:00 AM", title: "Wedding Ceremony", desc: "The exchange of sacred vows and rings" },
    { time: "05:00 PM", title: "Cocktail Hour", desc: "Drinks, hors d'oeuvres, and evening mingling" },
    { time: "07:00 PM", title: "Dinner & Dancing", desc: "A grand feast followed by celebration under the stars" },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t) => ({
          time: t.time,
          title: t.title,
          desc: "Schedule of Events",
        }))
      : defaultTimeline;

  const defaultGallery = [
    "https://lh3.googleusercontent.com/aida/AP1WRLuKl3y0d0Ur1X0GR89jNyA4tEh4O7Y9UEl2cVy7zcSATunTKNQZtR35thtJl5Pkb-s6CPt33p3oOu-JhqV_K-KJmJRlMrpbU1-4GZfyaQ9DOPQUazfx_2qfUu_AvJdoIg244iozw3hbq4C_Rwri61oRBQxBVjGhWo21FOuxPVKyKjon-PqvR0SHL6tjNATYYnWcLiGbk8ue4ddwEjft9Qmw-jM9GreY-frQygH28AtXSXRSApySh6sEts8",
    "https://lh3.googleusercontent.com/aida/AP1WRLv7A8kyvN_MpvqRpthu-z7KMF7mC9mwkADuTHS4vnOyzMKdxfTp4BtAj4de04cJq7x5GkZe0FmLc-nUxM2dbGc5sEnEtiQM49uGb9LaaTxlDJFGb9CCg6WbqsZGm9wWL0rjSQ-nnsVpOhsZjtglowAm9NCxYV1DrK9Hz7huTlTjW6I2nWvVGLdzbhEET9v9s8IVLrbzoev__d-zBFFjHpdZC-eVZRh_AUC_hdEOZ6ncM8h2vYr3qsLAOlA",
    "https://lh3.googleusercontent.com/aida/AP1WRLvEhJXxSb9zoAY7xYoYlyOOe-3Y9n3_5L3jySpdXWJkWR4hKFi2Tyc5gw55QTcXYIcTRpHfbteRMdbV3E99JnaDT4-tth5lKwWI7GCa5RD9veh_BoV2IVV9vcpX4MvHdCpQvWWWOTdrz2nLexFVTJOpSKk00GSrv-7lU_Np5wntEcKLkvpNnrDqRQZslqk4TXPIyRIIJGKevFxdllwl-58RsLUY_viqOHouprDUyJHuo1Bnr32F4MhJTJM",
    "https://lh3.googleusercontent.com/aida/AP1WRLt-EmTuDPVWoS8a3KOuvb1nZuz3QNMdn7ERfhrxMCNKJ6qW3mKa3k_4FmVZa5THA9uZ-_KDEPVFlDdrKtqpluQhzjA37_jwYoqLmt25V0iVNEDw31slPowT_RNSFvTv_7qS1-8ztMBREfFQTAm_zIH_GM-vvwkkhfM10741b9CexocgtgxkX6ltdQ0Svxa6xhhtYYBQvyMb3Vzlj6CRzpNow4xFxBdcc9tQOOXj50MJqhh4OFkPrM5Spg",
    "https://lh3.googleusercontent.com/aida/AP1WRLvWfzXdN3dHblHMwCfYoZzOQpFd55WruE3qhpS4L0St43rwB0l9HRsSVUPWL226kWxQkGJRu6OUJ5cOQo4G0Vp8s-N63YtcTfH8vIaWTvvr9rHykEUQ0mI_v8bBC7ZTc8VAO1--z-jMa4pg_IU1uaN3Gd76BW-8k-d4R5LU4PtaWr7aPUpDbHttGiVo0D0y6Y_O7PNACCjqktCyXRVWMTP8nJzTwqnxpfozIb53uukdEtbwZ1iwTN6b4rI",
    "https://lh3.googleusercontent.com/aida/AP1WRLtKz9lJnGkGr1HEozNINKPO3psDlp8ptMnCyX1z4oft_p6uW5Je460e3ZVLPtFYD3UEFqkvm9Q2rOXYPKJe6ts3G-0Ti4-a-wM2bdTGiAMSkQOC8m5Eamp3Ngl5VCVeuhv9Y_XIxdS1ooIi3D40fFiAFwBQ4uVsVfnRERsG3a4A-ac9wFX5UYBtLoz2wPm3i3yLOQu0R0pVED5aWtJjs4-S8AuEn9J0mBnZp1k8rY4U0vcK3FeRC0kULw",
  ];

  const galleryList = props.galleryImages && props.galleryImages.length >= 6 ? props.galleryImages : defaultGallery;

  return (
    <div className="bg-[#f9f9f7] text-[#1a1c1b] font-sans antialiased selection:bg-[#8a9a5b] selection:text-white relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="moss-stone"
      />

      {/* Top Navigation */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b-2 border-[#76786b] ${
          navScrolled ? "bg-[#f9f9f7]/95 backdrop-blur-md py-3 shadow-md" : "bg-[#f9f9f7]/90 backdrop-blur-sm py-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-[1280px] mx-auto h-16">
          <a href="#" className="font-serif italic text-2xl font-bold text-[#56642b]">
            {initials}
          </a>

          <ul className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#46483c]">
            <li><a href="#story" className="hover:text-[#56642b] transition-colors">Our Story</a></li>
            <li><a href="#events" className="hover:text-[#56642b] transition-colors">Events</a></li>
            <li><a href="#timeline" className="hover:text-[#56642b] transition-colors">Timeline</a></li>
            <li><a href="#gallery" className="hover:text-[#56642b] transition-colors">Gallery</a></li>
            <li><a href="#rsvp" className="text-[#56642b] border-b-2 border-[#56642b] pb-0.5">RSVP</a></li>
          </ul>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#56642b]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#f9f9f7] border-b-2 border-[#56642b] px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#46483c]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#56642b] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative w-full min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#eeeeec]" id="story">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url(${archHeroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f9f9f7] via-transparent to-transparent z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#56642b] mb-4 border-b-2 border-[#56642b] pb-1">
            {props.tagline || "TOGETHER WITH THEIR FAMILIES"}
          </span>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-[#1a1c1b] mb-2 tracking-tight">
            {partner1}
          </h1>

          <span className="font-serif italic text-3xl sm:text-4xl text-[#56642b] my-2">and</span>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-[#1a1c1b] mb-6 tracking-tight">
            {partner2}
          </h1>

          <p className="text-base sm:text-lg text-[#46483c] max-w-lg mb-8">
            {props.inviteLine || "Invite you to celebrate their wedding under the rustic stone archway"}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 border-2 border-[#76786b] p-6 bg-[#f9f9f7]/80 backdrop-blur-md rounded shadow-lg">
            <div className="text-center px-4">
              <span className="block font-serif text-2xl font-bold text-[#1a1c1b]">13th May 2026</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#56642b]">Date</span>
            </div>
            <div className="hidden sm:block w-px h-10 bg-[#76786b]" />
            <div className="sm:hidden w-12 h-px bg-[#76786b]" />
            <div className="text-center px-4">
              <span className="block font-serif text-2xl font-bold text-[#1a1c1b]">10:00 AM</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#56642b]">Time</span>
            </div>
          </div>

          <a
            href="#rsvp"
            className="mt-8 bg-[#56642b] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded hover:bg-[#3e4c16] transition-colors shadow-md"
          >
            Save the Date
          </a>
        </motion.div>
      </header>

      {/* Wedding Events Section */}
      <section className="py-24 bg-[#f9f9f7] px-6 md:px-16" id="events">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#1a1c1b] mb-3">Wedding Events</h2>
            <div className="w-20 h-1 bg-[#56642b] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Matrimony */}
            <motion.div
              whileHover={{ y: -6 }}
              className="border-2 border-[#76786b] p-8 sm:p-10 bg-[#eeeeec] flex flex-col items-center text-center rounded shadow-sm hover:shadow-xl transition-all"
            >
              <Church className="w-12 h-12 text-[#56642b] mb-4" />
              <h3 className="font-serif text-2xl font-bold text-[#1a1c1b] mb-2">Holy Matrimony</h3>
              <p className="text-xs font-bold text-[#46483c] uppercase tracking-widest mb-6">13th May 2026 • 10:00 AM</p>
              <p className="text-xs text-[#1a1c1b] mb-8 leading-relaxed">
                St. Antony Church<br />Kaval Kinaru, Tirunelveli District
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-2 border-[#56642b] text-[#56642b] font-bold text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#56642b] hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4" /> View on Map
              </a>
            </motion.div>

            {/* Reception */}
            <motion.div
              whileHover={{ y: -6 }}
              className="border-2 border-[#76786b] p-8 sm:p-10 bg-[#eeeeec] flex flex-col items-center text-center rounded shadow-sm hover:shadow-xl transition-all"
            >
              <PartyPopper className="w-12 h-12 text-[#56642b] mb-4" />
              <h3 className="font-serif text-2xl font-bold text-[#1a1c1b] mb-2">Grand Reception</h3>
              <p className="text-xs font-bold text-[#46483c] uppercase tracking-widest mb-6">13th May 2026 • 06:30 PM</p>
              <p className="text-xs text-[#1a1c1b] mb-8 leading-relaxed">
                Ubahara Matha Mahal<br />Kaval Kinaru, Tirunelveli District
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-2 border-[#56642b] text-[#56642b] font-bold text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#56642b] hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4" /> View on Map
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Timeline Section */}
      <section className="py-24 bg-[#f4f4f2] px-6 md:px-16" id="timeline">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#1a1c1b] mb-3">Event Timeline</h2>
            <div className="w-20 h-1 bg-[#56642b] mx-auto" />
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#c6c8b8] -ml-px" />
            <div className="space-y-12">
              {timelineList.map((item, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`relative flex items-center md:justify-between flex-col md:flex-row gap-6 md:gap-0 ${
                      isEven ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`w-full md:w-[45%] text-left pl-14 md:pl-0 ${isEven ? "" : "md:text-right"}`}>
                      <h4 className="font-serif text-xl font-bold text-[#1a1c1b]">{item.title}</h4>
                      <p className="text-xs text-[#46483c] mt-1">{item.desc}</p>
                    </div>

                    <div className="absolute left-0 md:left-1/2 w-14 h-14 bg-[#f9f9f7] border-2 border-[#56642b] rounded-full flex items-center justify-center -translate-x-0 md:-translate-x-1/2 z-10 text-[#56642b] font-bold text-xs shadow-md">
                      {item.time}
                    </div>

                    <div className="w-full md:w-[45%] hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Our Moments Section */}
      <section className="py-24 bg-[#f9f9f7] px-6 md:px-16" id="gallery">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#1a1c1b] mb-3">Our Moments</h2>
            <div className="w-20 h-1 bg-[#56642b] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryList.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className={`overflow-hidden border-2 border-[#76786b] group rounded aspect-[4/3] ${
                  idx === 0 ? "sm:col-span-2 sm:row-span-2 aspect-square" : ""
                }`}
              >
                <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Love Story Video Facade */}
      <section className="py-24 bg-[#e8e8e6] px-6 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-[#1a1c1b] mb-3">A Glimpse of Us</h2>
          <div className="w-20 h-1 bg-[#56642b] mx-auto mb-10" />

          <div className="relative w-full aspect-video border-4 border-[#76786b] bg-[#eeeeec] p-2 sm:p-4 rounded shadow-xl">
            {isPlayingVideo ? (
              <iframe
                title="Love story video"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full bg-[#dadad8] flex items-center justify-center relative overflow-hidden group cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                <img src={galleryList[4]} alt="Video Cover" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
                <div className="relative z-10 w-20 h-20 bg-[#56642b] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-xl">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="moss-stone" />
      </div>

      {/* Footer */}
      <footer className="bg-[#e2e3e1] border-t-2 border-[#76786b] py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-[#46483c]">
          <span className="font-serif text-[#56642b] text-xl italic">{initials}</span>
          <span>&copy; 2026 {partner1} &amp; {partner2}. Designed with Love.</span>
        </div>
      </footer>
    </div>
  );
}
