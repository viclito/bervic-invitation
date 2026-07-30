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
  ArrowUpRight,
  Play,
} from "lucide-react";

export default function MintSlateInvitation(props: TemplateClassicFloralProps) {
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

  const coupleHeroImg =
    props.coupleImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAjriyi8OKqSxX-n7aG6XHdetfdvjDv0raDmoJ1in-VEh4vteFYS3EXy1UffuU12xdbx2McQAlch2eYV0UXsWwlWkMB7_o2sF4QdSZHXdSmudh31wSi0TjKKpbkuL11N9GsxOTaCBcw6QNcg1llf9qYbAVv5ezYiql6JZlddV_LT8pONm32_ZPSnoSaoF_XW02gthMw_pWI4DNf2ds3TiuWNvIHDkNxQT70PJtsV1N18KUF_e8VH1xG";

  const defaultGallery = [
    "https://lh3.googleusercontent.com/aida/AP1WRLv7A8kyvN_MpvqRpthu-z7KMF7mC9mwkADuTHS4vnOyzMKdxfTp4BtAj4de04cJq7x5GkZe0FmLc-nUxM2dbGc5sEnEtiQM49uGb9LaaTxlDJFGb9CCg6WbqsZGm9wWL0rjSQ-nnsVpOhsZjtglowAm9NCxYV1DrK9Hz7huTlTjW6I2nWvVGLdzbhEET9v9s8IVLrbzoev__d-zBFFjHpdZC-eVZRh_AUC_hdEOZ6ncM8h2vYr3qsLAOlA",
    "https://lh3.googleusercontent.com/aida/AP1WRLuKl3y0d0Ur1X0GR89jNyA4tEh4O7Y9UEl2cVy7zcSATunTKNQZtR35thtJl5Pkb-s6CPt33p3oOu-JhqV_K-KJmJRlMrpbU1-4GZfyaQ9DOPQUazfx_2qfUu_AvJdoIg244iozw3hbq4C_Rwri61oRBQxBVjGhWo21FOuxPVKyKjon-PqvR0SHL6tjNATYYnWcLiGbk8ue4ddwEjft9Qmw-jM9GreY-frQygH28AtXSXRSApySh6sEts8",
    "https://lh3.googleusercontent.com/aida/AP1WRLvEhJXxSb9zoAY7xYoYlyOOe-3Y9n3_5L3jySpdXWJkWR4hKFi2Tyc5gw55QTcXYIcTRpHfbteRMdbV3E99JnaDT4-tth5lKwWI7GCa5RD9veh_BoV2IVV9vcpX4MvHdCpQvWWWOTdrz2nLexFVTJOpSKk00GSrv-7lU_Np5wntEcKLkvpNnrDqRQZslqk4TXPIyRIIJGKevFxdllwl-58RsLUY_viqOHouprDUyJHuo1Bnr32F4MhJTJM",
    "https://lh3.googleusercontent.com/aida/AP1WRLt-EmTuDPVWoS8a3KOuvb1nZuz3QNMdn7ERfhrxMCNKJ6qW3mKa3k_4FmVZa5THA9uZ-_KDEPVFlDdrKtqpluQhzjA37_jwYoqLmt25V0iVNEDw31slPowT_RNSFvTv_7qS1-8ztMBREfFQTAm_zIH_GM-vvwkkhfM10741b9CexocgtgxkX6ltdQ0Svxa6xhhtYYBQvyMb3Vzlj6CRzpNow4xFxBdcc9tQOOXj50MJqhh4OFkPrM5Spg",
    "https://lh3.googleusercontent.com/aida/AP1WRLvWfzXdN3dHblHMwCfYoZzOQpFd55WruE3qhpS4L0St43rwB0l9HRsSVUPWL226kWxQkGJRu6OUJ5cOQo4G0Vp8s-N63YtcTfH8vIaWTvvr9rHykEUQ0mI_v8bBC7ZTc8VAO1--z-jMa4pg_IU1uaN3Gd76BW-8k-d4R5LU4PtaWr7aPUpDbHttGiVo0D0y6Y_O7PNACCjqktCyXRVWMTP8nJzTwqnxpfozIb53uukdEtbwZ1iwTN6b4rI",
    "https://lh3.googleusercontent.com/aida/AP1WRLtKz9lJnGkGr1HEozNINKPO3psDlp8ptMnCyX1z4oft_p6uW5Je460e3ZVLPtFYD3UEFqkvm9Q2rOXYPKJe6ts3G-0Ti4-a-wM2bdTGiAMSkQOC8m5Eamp3Ngl5VCVeuhv9Y_XIxdS1ooIi3D40fFiAFwBQ4uVsVfnRERsG3a4A-ac9wFX5UYBtLoz2wPm3i3yLOQu0R0pVED5aWtJjs4-S8AuEn9J0mBnZp1k8rY4U0vcK3FeRC0kULw",
  ];

  const galleryList = props.galleryImages && props.galleryImages.length >= 6 ? props.galleryImages : defaultGallery;

  return (
    <div className="bg-[#f8fafa] text-[#191c1d] font-sans antialiased selection:bg-[#aaf0d1] selection:text-[#2a6f57] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="mint-slate"
      />

      {/* Top Navbar */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#191c1d] ${
          navScrolled ? "bg-[#f8fafa]/95 backdrop-blur-md py-3 shadow-md" : "bg-[#f8fafa] py-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-[1440px] mx-auto">
          <a href="#" className="font-mono text-2xl font-bold uppercase tracking-tight text-[#246a52] hover:text-[#191c1d] transition-colors">
            {initials} Wedding
          </a>

          <nav className="hidden md:flex gap-8 font-mono text-xs font-semibold uppercase tracking-widest text-[#191c1d]">
            <a href="#story" className="hover:text-[#246a52] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#246a52] transition-colors">Events</a>
            <a href="#timeline" className="hover:text-[#246a52] transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-[#246a52] transition-colors">Gallery</a>
          </nav>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#191c1d] text-[#ffffff] font-mono font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-[#246a52] transition-colors"
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
            className="md:hidden bg-[#f8fafa] border-b border-[#191c1d] px-6 py-4 flex flex-col gap-3 font-mono text-xs font-bold uppercase tracking-widest text-[#191c1d]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#246a52] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </header>

      {/* Split-Screen Hero Section */}
      <section className="min-h-[90vh] flex flex-col md:flex-row items-stretch border-b border-[#191c1d] pt-20" id="story">
        <div className="w-full md:w-1/2 p-8 sm:p-16 flex flex-col justify-center bg-[#f8fafa] z-10 border-r border-[#191c1d]">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#6f7973] mb-4">
            {props.tagline || "TOGETHER WITH THEIR FAMILIES"}
          </span>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-[#191c1d] leading-none uppercase tracking-tight mb-8">
            {partner1} <br />
            <span className="text-[#246a52] italic font-light">&amp;</span> {partner2}
          </h1>

          <p className="font-mono text-xs uppercase tracking-widest text-[#6f7973] mb-8">
            Invite you to celebrate their wedding
          </p>

          <div className="inline-flex flex-col sm:flex-row gap-6 border border-[#191c1d] p-6 bg-white relative shadow-sm max-w-lg">
            <div className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-[#246a52]" />
            <div>
              <p className="font-mono text-[10px] text-[#6f7973] uppercase mb-1">Date</p>
              <p className="text-2xl font-bold text-[#191c1d]">May 13, 2026</p>
            </div>
            <div className="hidden sm:block w-px bg-[#191c1d]" />
            <div>
              <p className="font-mono text-[10px] text-[#6f7973] uppercase mb-1">Time</p>
              <p className="text-2xl font-bold text-[#191c1d]">10:00 AM</p>
            </div>
          </div>

          <div className="mt-10">
            <a
              href="#rsvp"
              className="inline-block bg-[#191c1d] text-white px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#246a52] transition-colors border border-[#191c1d]"
            >
              Save the Date
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/2 min-h-[400px] md:min-h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-[#246a52] mix-blend-multiply opacity-20 z-10 pointer-events-none" />
          <img src={coupleHeroImg} alt="Couple Portrait" className="w-full h-full object-cover grayscale contrast-125" />
        </div>
      </section>

      {/* Countdown Grid */}
      <section className="py-20 border-b border-[#191c1d] bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#191c1d] uppercase inline-block border-b-2 border-[#246a52] pb-2">
              Our Big Day
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-[#191c1d] p-8 text-center bg-[#f8fafa] relative group overflow-hidden">
              <div className="absolute inset-0 bg-[#aaf0d1] scale-y-0 origin-bottom transition-transform group-hover:scale-y-100 z-0" />
              <div className="relative z-10">
                <p className="text-4xl sm:text-5xl font-extrabold text-[#191c1d] group-hover:text-[#2a6f57]">180</p>
                <p className="font-mono text-xs font-semibold text-[#6f7973] uppercase mt-2 group-hover:text-[#2a6f57]">Days</p>
              </div>
            </div>

            <div className="border border-[#191c1d] p-8 text-center bg-[#f8fafa] relative group overflow-hidden">
              <div className="absolute inset-0 bg-[#aaf0d1] scale-y-0 origin-bottom transition-transform group-hover:scale-y-100 z-0" />
              <div className="relative z-10">
                <p className="text-4xl sm:text-5xl font-extrabold text-[#191c1d] group-hover:text-[#2a6f57]">12</p>
                <p className="font-mono text-xs font-semibold text-[#6f7973] uppercase mt-2 group-hover:text-[#2a6f57]">Hours</p>
              </div>
            </div>

            <div className="border border-[#191c1d] p-8 text-center bg-[#f8fafa] relative group overflow-hidden">
              <div className="absolute inset-0 bg-[#aaf0d1] scale-y-0 origin-bottom transition-transform group-hover:scale-y-100 z-0" />
              <div className="relative z-10">
                <p className="text-4xl sm:text-5xl font-extrabold text-[#191c1d] group-hover:text-[#2a6f57]">45</p>
                <p className="font-mono text-xs font-semibold text-[#6f7973] uppercase mt-2 group-hover:text-[#2a6f57]">Minutes</p>
              </div>
            </div>

            <div className="border border-[#191c1d] p-8 text-center bg-[#f8fafa] relative group overflow-hidden">
              <div className="absolute inset-0 bg-[#aaf0d1] scale-y-0 origin-bottom transition-transform group-hover:scale-y-100 z-0" />
              <div className="relative z-10">
                <p className="text-4xl sm:text-5xl font-extrabold text-[#191c1d] group-hover:text-[#2a6f57]">30</p>
                <p className="font-mono text-xs font-semibold text-[#6f7973] uppercase mt-2 group-hover:text-[#2a6f57]">Seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Events Cards */}
      <section className="py-20 border-b border-[#191c1d] bg-[#f8fafa]" id="events">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="mb-12 max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold text-[#191c1d] uppercase mb-2">Wedding Events</h2>
            <p className="text-sm text-[#3f4944]">Join us as we step into a lifetime of love and togetherness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ceremony */}
            <div className="border border-[#191c1d] p-8 bg-white flex flex-col sm:flex-row gap-6 items-start hover:bg-[#f2f4f4] transition-colors relative shadow-sm">
              <div className="w-14 h-14 bg-[#246a52] flex items-center justify-center flex-shrink-0 text-white rounded">
                <Church className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-xs font-bold text-[#246a52] uppercase mb-1">13 May 2026 • 10:00 AM</p>
                <h3 className="text-2xl font-bold text-[#191c1d] uppercase mb-2">Marriage Ceremony</h3>
                <p className="text-xs text-[#3f4944] mb-4">St. Antony Church, Kaval Kinaru, Tirunelveli District</p>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#191c1d] border-b-2 border-[#246a52] pb-0.5 hover:text-[#246a52] uppercase">
                  View on Map <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Reception */}
            <div className="border border-[#191c1d] p-8 bg-white flex flex-col sm:flex-row gap-6 items-start hover:bg-[#f2f4f4] transition-colors relative shadow-sm">
              <div className="w-14 h-14 bg-[#191c1d] flex items-center justify-center flex-shrink-0 text-white rounded">
                <Utensils className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-xs font-bold text-[#246a52] uppercase mb-1">13 May 2026 • 07:00 PM</p>
                <h3 className="text-2xl font-bold text-[#191c1d] uppercase mb-2">Grand Reception</h3>
                <p className="text-xs text-[#3f4944] mb-4">Ubahara Matha Mahal, Kaval Kinaru, Tirunelveli District</p>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#191c1d] border-b-2 border-[#246a52] pb-0.5 hover:text-[#246a52] uppercase">
                  View on Map <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 border-b border-[#191c1d] bg-white" id="timeline">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#191c1d] uppercase inline-block border-b-2 border-[#246a52] pb-2">
              Event Timeline
            </h2>
          </div>

          <div className="relative border-l-2 md:border-l-0 md:border-t-2 border-[#191c1d] pt-8 md:pt-12 ml-4 md:ml-0 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative pl-8 md:pl-0">
              <div className="absolute -left-[7px] md:left-0 md:-top-[23px] w-3 h-3 bg-[#246a52] rotate-45" />
              <p className="font-mono text-xs font-bold text-[#246a52] uppercase mb-1">09:30 AM</p>
              <h4 className="text-sm font-bold text-[#191c1d] uppercase mb-1">Guest Arrival</h4>
              <p className="text-xs text-[#3f4944]">Welcome drinks and seating.</p>
            </div>

            <div className="relative pl-8 md:pl-0">
              <div className="absolute -left-[7px] md:left-0 md:-top-[23px] w-3 h-3 bg-[#191c1d] rotate-45" />
              <p className="font-mono text-xs font-bold text-[#246a52] uppercase mb-1">10:00 AM</p>
              <h4 className="text-sm font-bold text-[#191c1d] uppercase mb-1">Marriage Ceremony</h4>
              <p className="text-xs text-[#3f4944]">Exchange of vows at St. Antony Church.</p>
            </div>

            <div className="relative pl-8 md:pl-0">
              <div className="absolute -left-[7px] md:left-0 md:-top-[23px] w-3 h-3 bg-[#191c1d] rotate-45" />
              <p className="font-mono text-xs font-bold text-[#246a52] uppercase mb-1">12:30 PM</p>
              <h4 className="text-sm font-bold text-[#191c1d] uppercase mb-1">Lunch Feast</h4>
              <p className="text-xs text-[#3f4944]">Traditional celebratory meal.</p>
            </div>

            <div className="relative pl-8 md:pl-0">
              <div className="absolute -left-[7px] md:left-0 md:-top-[23px] w-3 h-3 bg-[#191c1d] rotate-45" />
              <p className="font-mono text-xs font-bold text-[#246a52] uppercase mb-1">07:00 PM</p>
              <h4 className="text-sm font-bold text-[#191c1d] uppercase mb-1">Grand Reception</h4>
              <p className="text-xs text-[#3f4944]">Evening celebration and dinner.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grayscale Photo Grid */}
      <section className="py-20 border-b border-[#191c1d] bg-[#f8fafa]" id="gallery">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#191c1d] uppercase mb-2">Our Moments</h2>
              <p className="text-sm text-[#3f4944]">Glimpses of our journey together.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-[#191c1d] p-4 bg-white shadow-sm">
            {galleryList.map((img, idx) => (
              <div key={idx} className="aspect-square relative overflow-hidden border border-[#191c1d] group">
                <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="mint-slate" />
      </div>

      {/* Footer */}
      <footer className="w-full py-10 bg-[#191c1d] text-white border-t border-[#246a52]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 gap-4 max-w-[1440px] mx-auto font-mono text-xs">
          <div className="font-bold uppercase tracking-widest">{initials} WEDDING</div>
          <div className="text-white/70">&copy; 2026 {partner1} &amp; {partner2}. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
