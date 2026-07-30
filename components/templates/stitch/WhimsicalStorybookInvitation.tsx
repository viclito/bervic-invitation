"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Coffee,
  Plane,
  Heart,
  Church,
  Wine,
  Utensils,
  Play,
  Menu,
  X,
  Sparkles,
  MapPin,
  Calendar,
} from "lucide-react";

export default function WhimsicalStorybookInvitation(props: TemplateClassicFloralProps) {
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

  const partner1 = props.partnerOne || "Elias";
  const partner2 = props.partnerTwo || "Sophia";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const coupleImgHero =
    props.coupleImage ||
    "https://lh3.googleusercontent.com/aida/AP1WRLt-EmTuDPVWoS8a3KOuvb1nZuz3QNMdn7ERfhrxMCNKJ6qW3mKa3k_4FmVZa5THA9uZ-_KDEPVFlDdrKtqpluQhzjA37_jwYoqLmt25V0iVNEDw31slPowT_RNSFvTv_7qS1-8ztMBREfFQTAm_zIH_GM-vvwkkhfM10741b9CexocgtgxkX6ltdQ0Svxa6xhhtYYBQvyMb3Vzlj6CRzpNow4xFxBdcc9tQOOXj50MJqhh4OFkPrM5Spg";

  const storyChapters = [
    {
      badge: "The First Glance",
      title: "Coffee & Coincidence",
      desc: "It was a rainy Tuesday. Elias was reading his favorite novel, and Sophia bumped into his table, spilling espresso everywhere. The rest, as they say, is history written in caffeine.",
      icon: <Coffee className="w-5 h-5 text-white" />,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA-kkHjGr_U9di1Iy2XSfV_bD90R_nZ5k_DmroY8XOdYHk6L-jNKJIjQjfTzYhrBg25Flkq9CmzGC9TmlHgwrEvDVsZY-OFPrNxXJNkkg5lFcJR65hXzNAG8dgjjqLK8TV3lE8kK_rr8U0Ohjf7LSDxpQl6uGONugxBaXvw27gfREnBFs_RC4LfQLbo0s4gmZCgc_na9gEdfDXnXHHvuNdTFz9t9laSIfF40TWpu5FAT9jPxrRy8PYV",
      rotation: "rotate-2 hover:rotate-0",
    },
    {
      badge: "The Adventure",
      title: "Lost in Kyoto",
      desc: "Our first trip together tested our patience and our map-reading skills. Getting lost in the bamboo forests turned into the most magical afternoon of our lives.",
      icon: <Plane className="w-5 h-5 text-white" />,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDe9yUvc8zp0AuNip2mOebvFmAazmndYeP-uIIE7zoMLc6DhVq_uxDKwmzSqsSoNDyTFasqV2PPGkfU59IOETHFR-C5vVFjfuAU_K_5TPk-dqqmZLSYECx0HNmp2Fd1MhZ1Lci3TTiyIdUpdY7S9ATYovxurAArHTsMxVHJDN70opb1Wfp4xE9oM25qCa0rCq2WHibbbkv3xK2DPac8uJbnH4gKS_j7cVA_or8iOZqkp2lfIf4VxU5-",
      rotation: "-rotate-2 hover:rotate-0",
    },
    {
      badge: "The Question",
      title: "Under the Stars",
      desc: "On a quiet beach at midnight, with nothing but the sound of the waves and a sky full of stars, Elias asked the easiest question Sophia ever had to answer.",
      icon: <Heart className="w-5 h-5 text-[#31105C]" />,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCCis-wE9XOT37pqoPb4auPdQ8HnPyqevNqJWglM9onLrBT_6GvpSiQppb5niZHjKk69wd0LdZmxqE7Y_b0ddsCZnyzAly_1Wqc0xq7sjGCPolUg9A_dsZQvWc9JqAb8iJnjYIfxm7aoto4nj4PJyPTxNhcrFk1LrEqoWSobGhaVAMZIYAe4IHrrVaMyrM6dP2lgpylYWMSo3fkxanqjqVVR4O5CKNY4x2oo75nfBE9e2qjuP4BRrjj",
      rotation: "rotate-1 hover:rotate-0",
    },
  ];

  const defaultDayTimeline = [
    { time: "3:00 PM", title: "The Gathering", desc: "Guests arrive and find their seats amidst the floral arrangements.", icon: <Church className="w-5 h-5 text-[#31105C]" /> },
    { time: "4:00 PM", title: "The \"I Do's\"", desc: "A ceremony of love, promises, and perhaps a few happy tears.", icon: <Heart className="w-5 h-5 text-[#31105C]" /> },
    { time: "5:30 PM", title: "Twilight Toasts", desc: "Cocktails, hors d'oeuvres, and the first whispers of celebration.", icon: <Wine className="w-5 h-5 text-[#31105C]" /> },
    { time: "7:00 PM", title: "The Grand Feast & Revelry", desc: "Dinner is served, followed by dancing until the stars fade.", icon: <Utensils className="w-5 h-5 text-[#31105C]" /> },
  ];

  const dayTimeline =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t, i) => ({
          time: t.time,
          title: t.title,
          desc: "Special Event Schedule",
          icon: defaultDayTimeline[i % 4].icon,
        }))
      : defaultDayTimeline;

  const defaultPolaroids = [
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAh8CIRhDMSd_Yq5vWnnj9fZaukcNvX982yP-Sj0VFKiE2IbKTr1vONAfrAdWzIoptN1wjiMkDZjMdgUfiuEPqw-7cPNxbxqCaGQJAG0dWpLT1WSQJtiFglAsnYcPpu_1nMDf_4o_W0Ko6irF_EyfpmdNDkrH1Y1biduETSK8Tmak2Br0ntK-9DwPpfJSz7DcKDiNqWh6RJrSaQgPYm9cU6zQCF9QFbgD6CzerKRYR6ECKZF9CL3lJj",
      caption: "Autumn in Paris",
      rotate: "-rotate-2",
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhYD9HWT8O_KLNKkFmia5G5ncI2upTtEUwrFLiG6Mi9nPWrORlcPlEUbdM7asCp1vjLU8mZMyleEwa8YwSybfxt4ld2UYkQsy1xPry16Ms8tfF_LVHoQaW8_6iroLERS9iN6B6nhekzzXwuBkGNp2qqSmeJX-gODNU-NHbKg2ffa4gyn3-Ph3zjoJ9UODDFOyNBmMVnMR_QC2BTYOnvql-Hdzeew9Ltsph_b6yuQPd5adO7Zz565A_",
      caption: "The Engagement",
      rotate: "rotate-1 mt-8 md:mt-12",
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfAumFTcNQu7idhddaX7vx6Vqaus4glvkf7eiNjVtUxGnnMnW71zfUx54beNu0GjodM7vOCapJw9fCOhMqEO_79hH21cKdbj3iP1fIqitPwVuPVzyLlBfASRo0Mz-nv6GYbBT7bA-2GDfZ0cMhQyB0wkKLKVFfSlQr1osgfRkYXjHkTpktgZSrdixqTrQQdFP4zyD9NSt_-5QRyLsiDoV88OpOMh_gMtKiyyYNOAGm8mgk_2oConoZ",
      caption: "First Anniversary",
      rotate: "rotate-3",
    },
  ];

  const polaroidList = props.galleryImages && props.galleryImages.length >= 3
    ? props.galleryImages.slice(0, 3).map((img, i) => ({
        img,
        caption: defaultPolaroids[i].caption,
        rotate: defaultPolaroids[i].rotate,
      }))
    : defaultPolaroids;

  return (
    <div className="bg-[#fbf9f4] text-[#1b1c19] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#31105C] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "October 15, 2026 • The Botanical Gardens"}
        isCustomizer={props.isCustomizer}
        templateSlug="whimsical-storybook"
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

      {/* Hero Section */}
      <section className="py-24 px-6 md:px-16 max-w-[1200px] mx-auto text-center relative pt-32" id="story">
        <div className="absolute inset-0 bg-[#F1E9FF]/40 rounded-[100px] -z-10 rotate-3 scale-110 blur-3xl opacity-50 pointer-events-none" />

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-5xl md:text-7xl font-bold text-[#31105C] mb-4 tracking-tight"
        >
          Our Whimsical Tale
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif italic text-lg md:text-xl text-[#735c00] max-w-2xl mx-auto mb-10"
        >
          "Every love story is beautiful, but ours is my favorite."
        </motion.p>

        {/* Circular Framed Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-64 h-64 md:w-96 md:h-96 mx-auto rounded-full p-2 bg-white border-4 border-[#D4AF37]/40 shadow-2xl"
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            <img src={coupleImgHero} alt="Couple Portrait" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </section>

      {/* The Timeline Story */}
      <section className="py-20 px-6 md:px-16 max-w-[1200px] mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#31105C] mb-3">How It Started</h2>
          <div className="w-24 h-0.5 bg-[#D4AF37] mx-auto" />
        </div>

        <div className="relative">
          {/* Center Vertical Line */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#D4AF37]/50" />

          <div className="space-y-20">
            {storyChapters.map((chapter, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`flex flex-col ${
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center justify-between relative`}
              >
                <div className={`w-full md:w-5/12 text-center ${idx % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"} mb-8 md:mb-0`}>
                  <span className="inline-block bg-[#F1E9FF] text-[#31105C] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                    {chapter.badge}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#31105C] mb-3">{chapter.title}</h3>
                  <p className="text-sm text-[#4a4452] leading-relaxed">{chapter.desc}</p>
                </div>

                {/* Central Icon Circle */}
                <div className="w-12 h-12 absolute left-1/2 -translate-x-1/2 rounded-full bg-[#31105C] border-4 border-white hidden md:flex items-center justify-center shadow-lg z-10">
                  {chapter.icon}
                </div>

                <div className={`w-full md:w-5/12 ${idx % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}>
                  <div className={`rounded-2xl overflow-hidden shadow-xl border border-[#D4AF37]/30 p-2.5 bg-white transform ${chapter.rotation} transition-transform duration-500`}>
                    <img src={chapter.image} alt={chapter.title} className="w-full h-64 object-cover rounded-xl" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapters of Our Celebration */}
      <section className="py-20 px-6 md:px-16 max-w-[1200px] mx-auto" id="events">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#31105C] mb-3">Chapters of Our Celebration</h2>
          <div className="w-24 h-0.5 bg-[#D4AF37] mx-auto mb-4" />
          <p className="font-serif italic text-base text-[#735c00]">"Join us as our tale unfolds over three magical acts."</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Act I */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white border border-[#D4AF37]/30 rounded-3xl overflow-hidden shadow-lg p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="text-center mb-6">
              <span className="inline-block bg-[#ecdcff] text-[#4a1b8c] text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
                Act I
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#31105C] mb-1">The Welcome Feast</h3>
              <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-3">Friday, October 14th • 7:00 PM</p>
              <p className="text-sm text-[#4a4452]">A night of laughter, stories, and raising glasses under the lantern-lit canopy of the old vineyard.</p>
            </div>
            <div className="rounded-xl overflow-hidden h-56 border border-[#ccc3d4]">
              <iframe
                title="Welcome Feast Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.14483011405021!3d40.6976312333469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Act II */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white border border-[#D4AF37]/30 rounded-3xl overflow-hidden shadow-lg p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="text-center mb-6">
              <span className="inline-block bg-[#ecdcff] text-[#4a1b8c] text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
                Act II
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#31105C] mb-1">The Vows</h3>
              <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-3">Saturday, October 15th • 3:00 PM</p>
              <p className="text-sm text-[#4a4452]">The moment our two stories become one, surrounded by the blooming flora of the botanical gardens.</p>
            </div>
            <div className="rounded-xl overflow-hidden h-56 border border-[#ccc3d4]">
              <iframe
                title="The Vows Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.14483011405021!3d40.6976312333469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Day's Journey Timeline */}
      <section className="py-20 px-6 md:px-16 max-w-[1200px] mx-auto" id="timeline">
        <div className="bg-white rounded-3xl p-8 md:p-14 border border-[#D4AF37]/30 shadow-md relative overflow-hidden">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-[#31105C] mb-2">The Day's Journey</h2>
            <div className="w-24 h-0.5 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            {dayTimeline.map((item, idx) => (
              <div key={idx} className="flex items-center gap-6">
                <div className="text-right w-24 sm:w-32 flex-shrink-0">
                  <span className="text-xs font-bold text-[#31105C] uppercase tracking-wider">{item.time}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#fbf9f4] border-2 border-[#D4AF37] flex items-center justify-center flex-shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div className="flex-1 pl-2">
                  <h4 className="font-serif text-lg font-bold text-[#1b1c19] mb-0.5">{item.title}</h4>
                  <p className="text-xs text-[#4a4452] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pages From Our Book Polaroid Gallery */}
      <section className="py-20 px-6 md:px-16 max-w-[1200px] mx-auto" id="gallery">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#31105C] mb-3">Pages From Our Book</h2>
          <div className="w-24 h-0.5 bg-[#D4AF37] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {polaroidList.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03, rotate: 0 }}
              className={`bg-white p-4 shadow-xl rounded-lg border border-[#e4e2dd] transform ${item.rotate} transition-all duration-500`}
            >
              <img src={item.img} alt={item.caption} className="w-full h-80 object-cover rounded border border-[#D4AF37]/20" />
              <p className="font-serif italic text-center mt-4 text-[#735c00] font-semibold">{item.caption}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Video Trailer Section */}
      <section className="py-20 px-6 md:px-16 max-w-[1200px] mx-auto">
        <div className="bg-[#31105C] rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl border-4 border-[#D4AF37]/50 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">A Glimpse of Magic</h2>
          <p className="font-serif italic text-[#D4AF37] text-lg mb-8">Press play to watch our story unfold</p>

          <div className="relative w-full max-w-3xl mx-auto aspect-video bg-black/40 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-inner group">
            {isPlayingVideo ? (
              <iframe
                title="Love Story Video"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                <img src={coupleImgHero} alt="Video Thumbnail" className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.5)] group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-[#31105C] fill-current ml-1" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="whimsical-storybook" />
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
