"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Diamond,
  Church,
  PartyPopper,
  Wine,
  Clock,
  Play,
  Menu,
  X,
  Sparkles,
  MapPin,
} from "lucide-react";

export default function ArtDecoRevivalInvitation(props: TemplateClassicFloralProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const partner1 = props.partnerOne || "Terance";
  const partner2 = props.partnerTwo || "Ancy";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const heroBg =
    props.heroImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAyy2Ox8B60HYreViC34WdTGCckwDWVh3IuF8Ns3Kl_fwJqGCmjTkMnaqr7eBSvakRNY1wSDNJgzJS9rff1XZnFLnBdGvtfnlrPmcAmF1J0NiHhZoE4tB1cG2f2wNmaSRbllWcu0Gnky-DLyFX_jHFySrC6yCIzBwMo696c5-5hbMj0WgDCMkWH1KKmU_NScQrNdvQLfPTu4a2iripvtrEuZuFGsmSHw05qnpBiXs4ltozoEwcZuunB";

  const defaultTimeline = [
    { time: "3:30 PM", title: "Guest Arrival", desc: "Welcome drinks & seating" },
    { time: "4:00 PM", title: "The Vows", desc: "Ceremony commences" },
    { time: "5:30 PM", title: "Cocktail Hour", desc: "Canapés and jazz" },
    { time: "7:00 PM", title: "Grand Reception", desc: "Dinner, dancing & revelry" },
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
    "/images/templates/gallery-1.jpg",
    "/images/templates/gallery-2.jpg",
    "/images/templates/gallery-3.jpg",
    "/images/templates/gallery-4.jpg",
    "/images/templates/gallery-5.jpg",
    "/images/templates/gallery-6.jpg",
  ];

  const galleryList = props.galleryImages && props.galleryImages.length > 0 ? props.galleryImages : defaultGallery;

  return (
    <div className="bg-[#131410] text-[#e5e2db] font-sans antialiased selection:bg-[#d4af37] selection:text-black relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "Saturday, October 26th • 4:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="art-deco-revival"
      />

      {/* Art Deco Header Navigation */}
      <header className="w-full sticky top-0 z-40 bg-[#131410]/90 backdrop-blur-md border-b border-[#4d4635]">
        <nav className="flex justify-between items-center px-6 md:px-16 py-4 max-w-[1200px] mx-auto">
          <div className="hidden md:flex space-x-8 text-xs font-bold tracking-[0.2em] uppercase text-[#d0c5af]">
            <a href="#story" className="hover:text-[#f2ca50] transition-colors">
              Our Story
            </a>
            <a href="#events" className="hover:text-[#f2ca50] transition-colors">
              Events
            </a>
          </div>

          <a href="#" className="font-serif text-2xl tracking-[0.2em] uppercase text-[#f2ca50] hover:scale-105 transition-transform">
            {partner1} &amp; {partner2}
          </a>

          <div className="hidden md:flex space-x-8 text-xs font-bold tracking-[0.2em] uppercase text-[#d0c5af]">
            <a href="#gallery" className="hover:text-[#f2ca50] transition-colors">
              Gallery
            </a>
            <a href="#rsvp" className="text-[#f2ca50] border-b-2 border-[#f2ca50] pb-1 hover:text-white transition-colors">
              RSVP
            </a>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#f2ca50]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#131410] border-b border-[#4d4635] px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#d0c5af]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#f2ca50] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-[850px] flex items-center justify-center overflow-hidden py-16" id="story">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Art Deco Hero Backdrop" className="w-full h-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131410] via-[#131410]/50 to-[#131410] opacity-90" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#22513e]/40 border border-[#d4af37]/40 text-[#f2ca50] text-xs font-bold uppercase tracking-[0.3em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YOU ARE CORDIALLY INVITED</span>
          </div>

          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#f2ca50] tracking-[0.1em] uppercase drop-shadow-xl"
          >
            {partner1} <br className="md:hidden" /><span className="text-white font-serif">&amp;</span> {partner2}
          </motion.h1>

          {/* Sunburst Diamond Divider */}
          <div className="flex items-center gap-4 w-64 my-2">
            <div className="h-px bg-[#d4af37] flex-1" />
            <motion.div animate={{ rotate: [0, 45, 90, 135, 180] }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }}>
              <Diamond className="w-5 h-5 text-[#d4af37] fill-current" />
            </motion.div>
            <div className="h-px bg-[#d4af37] flex-1" />
          </div>

          <p className="text-sm text-[#d0c5af] max-w-2xl leading-relaxed tracking-wide">
            {props.inviteLine || "Join us for an evening of decadent celebration as we begin our forever after."}
          </p>

          <p className="text-lg font-bold text-[#f2ca50] tracking-widest uppercase mt-2">
            {props.weddingTime || "Saturday, October 26th • 4:00 PM"}
          </p>

          <motion.div whileHover={{ scale: 1.05 }} className="mt-6">
            <a
              href="#rsvp"
              className="inline-block bg-[#d4af37] text-black text-xs font-bold uppercase tracking-[0.2em] px-12 py-4 hover:bg-[#ffe088] transition-colors shadow-2xl"
            >
              RSVP Now
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Main Content Canvas with Art Deco Pattern Background */}
      <main className="relative py-24 px-6 md:px-16 bg-[#131410] border-t border-[#4d4635]/40" id="events">
        <div className="max-w-[1200px] mx-auto space-y-28">
          {/* The Celebration (Bento/Asymmetric) */}
          <section className="relative">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-[#f2ca50] uppercase tracking-[0.2em]">
                The Celebration
              </h2>
              <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Image Rail with Double Gold Border */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="md:col-span-5 h-[520px] p-2 border border-[#d4af37] relative group"
              >
                <div className="w-full h-full border border-[#d4af37] overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQN0JQjHjBr_Dr7kqsqaL8i75h9t4ORDdRbNpnJChk5hRppIoYCkOpmE_NC6YoaMss4471FGAwh5SfLQfPScHxfiHZhcUq03khn9InXOGCLdASTOO8fpA-oVYvkGUf33m380ek_HqRPbAGNm_D_syQkgNSx91Tu8aUld7fHOxJYrsGEyNei7Mrlyvu-3oI57EcPy6ecaBtoTuuryKhSQzs-QnVIaUR5sncLnsYZtOeKmzZDlCEvOur"
                    alt="Art Deco Interior Detail"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                </div>
              </motion.div>

              {/* Right Content Area */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="md:col-span-7 bg-[#20201c] p-10 md:p-14 border border-[#d4af37] relative z-10 md:-ml-12 shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#d4af37] m-4" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#d4af37] m-4" />

                <div className="space-y-10">
                  <div>
                    <h3 className="font-serif text-2xl text-white uppercase tracking-wider mb-2">The Ceremony</h3>
                    <p className="text-xs font-bold text-[#f2ca50] tracking-widest mb-3">
                      {props.weddingTime || "Saturday, October 26th • 4:00 PM"}
                    </p>
                    <p className="text-sm text-[#d0c5af] leading-relaxed">
                      The Grand Cathedral<br />123 Deco Avenue, Metropolis
                    </p>
                  </div>

                  <div className="w-full h-px bg-[#4d4635]" />

                  <div>
                    <h3 className="font-serif text-2xl text-white uppercase tracking-wider mb-2">The Reception</h3>
                    <p className="text-xs font-bold text-[#f2ca50] tracking-widest mb-3">Follows immediately</p>
                    <p className="text-sm text-[#d0c5af] leading-relaxed">
                      The Emerald Room at The Gatsby Hotel<br />Black Tie Strictly Enforced
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Venues & Maps */}
          <section className="relative">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-[#f2ca50] uppercase tracking-[0.2em]">
                Venues &amp; Directions
              </h2>
              <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Map 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col space-y-4"
              >
                <div className="border border-[#d4af37] p-2 h-64 relative overflow-hidden group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA80y1HYqrbRUudf8Uo74QzvTJKtooSA1TiDOs_HUIPMNiDnmcpLeIzYiWsl7KJPeu-26rBcbMGH0TybhD09qGtn7ZhbsQLTPZIdFbKCuqetkSLFpO9IaV2Qt3n00UJHC0tZxbhS6yXoKmE-DPewy__xxuz25FcA3pC_ztPWjVMfY9PaI7YYx7Zzvcfkiz-87xRXTveUsqmPKdyVpPfa76LVTUYIM9R3er5DWOSeT2n9fqK6DoB9e2S"
                    alt="Ceremony Map"
                    className="w-full h-full object-cover filter grayscale sepia-[0.3] group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="text-center">
                  <h4 className="font-serif text-xl text-[#f2ca50] uppercase mb-1">Ceremony Location</h4>
                  <p className="text-xs text-[#d0c5af]">The Grand Cathedral</p>
                </div>
              </motion.div>

              {/* Map 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col space-y-4"
              >
                <div className="border border-[#d4af37] p-2 h-64 relative overflow-hidden group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_StURIiABl83VzbxF6Hc-AsX51MyaBjA3lAAIizKYqgOzG60qMyKm6Tz6vJ9ZwoZgXfAu9esbFbYlCYXrTzeYVtlC1o3JPj43O8nPh6eTPYK0iRlaeRenLK4msM4_sGpLijnYrOYF5yy3KHcrsfnLyi2YI0zSnV1IBCAxTTOykB2MP907zhXajKjC_ooi58Lug2tpDze9xp5tDRpsq3cdOXcIA4XJS7OVGtc0UUT8kd2K4yLaIhiH"
                    alt="Reception Map"
                    className="w-full h-full object-cover filter grayscale sepia-[0.3] group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="text-center">
                  <h4 className="font-serif text-xl text-[#f2ca50] uppercase mb-1">Reception Location</h4>
                  <p className="text-xs text-[#d0c5af]">The Emerald Room at Gatsby Hotel</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Event Timeline */}
          <section className="relative" id="timeline">
            <div className="text-center mb-20">
              <h2 className="font-serif text-3xl md:text-4xl text-[#f2ca50] uppercase tracking-[0.2em]">
                Order of Events
              </h2>
              <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mt-4" />
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent hidden md:block" />

              <div className="space-y-16">
                {timelineList.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`relative flex flex-col ${
                      idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    } items-center justify-between group`}
                  >
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#131410] border-2 border-[#d4af37] rotate-45 group-hover:bg-[#d4af37] transition-colors" />

                    <div className={`md:w-5/12 text-center ${idx % 2 === 0 ? "md:text-right pr-0 md:pr-10" : "md:text-left pl-0 md:pl-10"}`}>
                      <h4 className="font-serif text-2xl text-white uppercase">{item.title}</h4>
                      <p className="text-xs text-[#d0c5af] mt-1">{item.desc}</p>
                    </div>

                    <div className={`md:w-5/12 text-center ${idx % 2 === 0 ? "md:text-left pl-0 md:pl-10" : "md:text-right pr-0 md:pr-10"}`}>
                      <span className="text-base font-bold text-[#f2ca50] tracking-[0.2em]">{item.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Moments Gallery */}
          <section className="relative" id="gallery">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-[#f2ca50] uppercase tracking-[0.2em]">
                Our Moments
              </h2>
              <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {galleryList.slice(0, 3).map((imgUrl, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="border border-[#d4af37] p-2 h-80 group overflow-hidden bg-[#1c1c18]"
                >
                  <div className="w-full h-full border border-[#d4af37] overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={`Art Deco moment ${idx + 1}`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Video Section */}
          <section className="relative">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl text-[#f2ca50] uppercase tracking-[0.2em]">
                Our Motion Film
              </h2>
              <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mt-4" />
            </div>

            <div className="max-w-4xl mx-auto border border-[#d4af37] p-2">
              <div className="relative aspect-video bg-[#1c1c18] overflow-hidden group cursor-pointer border border-[#d4af37]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADa97sld8paFwGW0c7RBjzItKjCjkqdCAG8O_ajfKVVhlSPiVQ4D6f5Fmmdmeion4KnW3_--vz0ZAvXwIvghzDWNEC78csvOsT2hs-DuU0Rc6SZAOvn3cIwlabTCn1o9ObLyysQiZo4wWWquBKVENFokM1Kn0PwCKiB0W9e2Eb5hktbnfVg7m50ZhLBVe-uVTEmNj3n6fdqyRhHAK3ksk5pApy5dxto-nWsDObj7yT6s-4xIIngkbF"
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover opacity-60 grayscale group-hover:opacity-80 transition-opacity duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-[#d4af37] flex items-center justify-center bg-[#131410]/70 text-[#f2ca50] hover:bg-[#d4af37] hover:text-black transition-colors duration-300 shadow-2xl">
                    <Play className="w-8 h-8 ml-1 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RSVP Section */}
          <div id="rsvp">
            <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="art-deco-revival" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#131410] border-t border-[#d4af37] py-14 px-6 text-center flex flex-col items-center gap-4">
        <div className="font-serif text-3xl text-[#f2ca50] tracking-widest">{initials}</div>
        <p className="text-xs text-[#d0c5af]">
          © 2026 {partner1} &amp; {partner2}. Forever After.
        </p>
      </footer>
    </div>
  );
}
