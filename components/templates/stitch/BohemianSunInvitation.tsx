"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
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

  const partner1 = props.partnerOne || "Terance";
  const partner2 = props.partnerTwo || "Ancy";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const heroArchImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCnEL--Gfk0geKfHH8ySi3pS7tFAYlkFi82ejbjOtmSkCTWELxufhpZqmm4C4OwDuCt9TpqKC0x1Nxukl4zsSyXJsv4WigVHuSEu-RVO2DCGj9VE3MXVcjqqmln1ZH80FNDzta9nw9NHGcPmZkGfRfI_IkSgY899vimu-t8wVRE2Qyw4BoQ-a3Oae7RJ-s21eOkol8VmtxOKenTezQgmagq-O5RgIroY_GT1a03s-4DJQs10Z-fwmem";

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

  const defaultGallery = [
    "https://lh3.googleusercontent.com/aida/AP1WRLvEhJXxSb9zoAY7xYoYlyOOe-3Y9n3_5L3jySpdXWJkWR4hKFi2Tyc5gw55QTcXYIcTRpHfbteRMdbV3E99JnaDT4-tth5lKwWI7GCa5RD9veh_BoV2IVV9vcpX4MvHdCpQvWWWOTdrz2nLexFVTJOpSKk00GSrv-7lU_Np5wntEcKLkvpNnrDqRQZslqk4TXPIyRIIJGKevFxdllwl-58RsLUY_viqOHouprDUyJHuo1Bnr32F4MhJTJM",
    "https://lh3.googleusercontent.com/aida/AP1WRLt-EmTuDPVWoS8a3KOuvb1nZuz3QNMdn7ERfhrxMCNKJ6qW3mKa3k_4FmVZa5THA9uZ-_KDEPVFlDdrKtqpluQhzjA37_jwYoqLmt25V0iVNEDw31slPowT_RNSFvTv_7qS1-8ztMBREfFQTAm_zIH_GM-vvwkkhfM10741b9CexocgtgxkX6ltdQ0Svxa6xhhtYYBQvyMb3Vzlj6CRzpNow4xFxBdcc9tQOOXj50MJqhh4OFkPrM5Spg",
    "https://lh3.googleusercontent.com/aida/AP1WRLtKz9lJnGkGr1HEozNINKPO3psDlp8ptMnCyX1z4oft_p6uW5Je460e3ZVLPtFYD3UEFqkvm9Q2rOXYPKJe6ts3G-0Ti4-a-wM2bdTGiAMSkQOC8m5Eamp3Ngl5VCVeuhv9Y_XIxdS1ooIi3D40fFiAFwBQ4uVsVfnRERsG3a4A-ac9wFX5UYBtLoz2wPm3i3yLOQu0R0pVED5aWtJjs4-S8AuEn9J0mBnZp1k8rY4U0vcK3FeRC0kULw",
  ];

  const galleryList = props.galleryImages && props.galleryImages.length >= 3 ? props.galleryImages : defaultGallery;

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
              <img src={heroArchImg} alt="Bohemian Wedding Arch" className="w-full h-full object-cover" />
            </div>

            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#fdf9f4] px-6 py-2.5 rounded-full shadow-md border border-[#dac1b9]/50 flex items-center gap-2 text-xs font-bold text-[#54433d] whitespace-nowrap">
              <Calendar className="w-4 h-4 text-[#91472a]" />
              <span>13th May 2026 • 10:00 AM</span>
            </div>
          </div>
        </motion.div>
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
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#91472a] mb-2">Celebrations</h2>
          <p className="text-sm text-[#54433d] max-w-md mx-auto">
            Join us for a weekend of love, laughter, and celebration in Tirunelveli.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Marriage */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-[#fdf9f4] rounded-2xl p-8 border border-[#dac1b9]/50 shadow-lg flex flex-col justify-between"
          >
            <div>
              <span className="inline-block bg-[#d4e5c1] text-[#58674b] font-bold text-xs px-3 py-1 rounded-full mb-4">
                Holy Matrimony
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1c1c19] mb-2">The Marriage Ceremony</h3>
              <div className="flex items-center gap-2 mb-1 text-xs text-[#54433d] font-semibold">
                <Clock className="w-4 h-4 text-[#7f5214]" />
                <span>13 May 2026 • 10:00 AM</span>
              </div>
              <div className="flex items-center gap-2 mb-4 text-xs text-[#54433d] font-semibold">
                <MapPin className="w-4 h-4 text-[#7f5214]" />
                <span>St. Antony Church, Kaval Kinaru</span>
              </div>
              <p className="text-xs text-[#54433d] border-t border-[#dac1b9]/30 pt-4 mb-6">
                Join us as we exchange our vows and begin our journey together.
              </p>
            </div>

            <div className="w-full h-44 rounded-xl overflow-hidden border border-[#dac1b9]/50">
              <iframe
                title="Church Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15764.041530932822!2d77.7249339!3d8.7135063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0411ed00645069%3A0xcb13e9a4440f93ff!2sSt.%20Antony's%20Church!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Reception */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-[#fdf9f4] rounded-2xl p-8 border border-[#dac1b9]/50 shadow-lg flex flex-col justify-between"
          >
            <div>
              <span className="inline-block bg-[#ffdbcf] text-[#380d00] font-bold text-xs px-3 py-1 rounded-full mb-4">
                Grand Celebration
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1c1c19] mb-2">Evening Reception</h3>
              <div className="flex items-center gap-2 mb-1 text-xs text-[#54433d] font-semibold">
                <Clock className="w-4 h-4 text-[#7f5214]" />
                <span>13 May 2026 • 07:00 PM Onwards</span>
              </div>
              <div className="flex items-center gap-2 mb-4 text-xs text-[#54433d] font-semibold">
                <MapPin className="w-4 h-4 text-[#7f5214]" />
                <span>Ubahara Matha Mahal, Kaval Kinaru</span>
              </div>
              <p className="text-xs text-[#54433d] border-t border-[#dac1b9]/30 pt-4 mb-6">
                An evening of celebration, dinner, and dancing under the bohemian sky.
              </p>
            </div>

            <div className="w-full h-44 rounded-xl overflow-hidden border border-[#dac1b9]/50">
              <iframe
                title="Reception Venue Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.433433618485!2d77.73359677590827!3d8.74526689408665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b041160ce3959c5%3A0x88981f33f7c4c379!2sUbahara%20Matha%20Mahal!5e0!3m2!1sen!2sin!4v1711200000001!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Horizontal Day Itinerary Timeline */}
      <section className="py-20 px-6 md:px-16 bg-[#f1ede8]" id="timeline">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#91472a] mb-12">Day Itinerary</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {defaultTimeline.map((item, idx) => (
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
