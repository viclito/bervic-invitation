"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  PartyPopper,
  Wine,
  Menu,
  X,
  Sparkles,
  MapPin,
  Clock,
  Heart,
} from "lucide-react";

export default function PhotoGalleryInvitation(props: TemplateClassicFloralProps) {
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

  const partner1 = props.partnerOne || "Elias";
  const partner2 = props.partnerTwo || "Sophia";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const coupleImg1 =
    props.coupleImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC4vXQa4es04gV_xcvR-T-23xenF_7yNe_3WhQQKnKI6MsTsJ1AtphDJqA0TPF2V97g3Iw7QBVsjc3g_Uy8aG-mb64B3YxcxXpbRGlFoDDEAEGcSbk5wqIh0wmO8qkxYxBrWNstRjJeXZ-VVMIv_gCWhRHq8LFWmUZe_zd8FTUav-lKSf3YouUSNDPd2rSQUXofn4yHYzRgusatt2WSi165bY27cMPYBLSIlN8isbiy4tlgQH-YYk3l";

  const coupleImg2 =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC3XEG3i0Z8VNePibgsxxvKrCtaqfewEMMRMnzvi_pyVXQY6rY_t-AnJDr4OpBKCGO_REbQawZ88ROXSFtt380bmKz4SMeRcTiGAgl52ko2OOvHFam9HFYjzYchzGjCt1CA1u9XYT50eLQZ4qeeaUpRzl6raS5VLdH1CjP3PE24V1YyfMKXqmFxvRaDglyp_K1EJ8Z30ATDygs4z0OId2Xby--_DK7WBzHQkBzt8Jnd9Tl4sbNdsY32";

  const coupleImg3 =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBKM0Q-7Fa_Wso3KTiIf3fAt4v6Z7Au-unGDTTM2nvGF4BaP9AK-JWPlJ098jn6QY5XPSEP-CDN9da8bcNQtsdVfrgymrGf_9nP-38VT8JbvHigLx-aOM7AXARw42jy582yIvqVXSB9iZlhJVPY67d_93rhExZ3mgcB6Gi9R3dfEVPejOP8eEcqdR5wLK-upYvwAB4FUxtve4A2Rzl7ril6NNeyQ_4GDtYB5xR2aUYLHDC2U2mpokq8";

  const defaultTimeline = [
    {
      time: "3:00 PM",
      title: "Welcome Drinks",
      desc: "Gather for cocktails and light refreshments to kick off the celebration.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDClryiwbmx24p4PxP23d2aWxrQZ2IDGUuwfALCRJHnLViOLoZU9A8eikls1iqiucInJjtv6Bc1173Pow7643G8DukUtPkwvP66GsHHPLR49uKntLYmw9Oy8uX5srHRn3R7ru6Ck7kUIIj-RfgN_ROoEMvi7-YD9n3B_NeFnm8UV-_3NZRSjG8A6q-u1vJWxMNABiWLTdOYwOVGR6aZ4M44TbByWr5d16REwtFUHO-x9RtAbx7IVZwc",
    },
    {
      time: "4:30 PM",
      title: "The Ceremony",
      desc: 'Join us as we exchange our vows and say "I do."',
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPbRC4dWS_RmnKAbqf578Kbck9Mnwu_JWXD2e4rh3hrwSKV8ShAIqCmCPWsK6vXR9m-9Du7pqSUILABJooKi_q5cZQ35K27mOsWnKlBXsa044nbGPb4gslUL-tS4XAn0Hr44HyB5RKgkXzN8E7eIb5Y1pNAT611b36uEZW2rGLdHNrWEZTwlgrKLjq4QFc54VoXfJPlGpJCK5OV-FFaxo7jbWPPR7jTb5PxiVLeZ03BUt1Ux2L-vg-",
    },
    {
      time: "6:00 PM",
      title: "Dinner & Dancing",
      desc: "A feast followed by music and dancing into the night.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4DztyCy4mKcRKAjst2xV68053UznM1i0gZ21fHycx733RFvH9nKR_K22kQiUzeHIiawI5-emIt9E6PO3FVp6lER7ncx35FqKcThWtQwnMYk-K1IwDJRAKdcLM_vYWcGbEkHWX6QIpkGJ2g1Fo9d42wMXQEle_-fk8kRM4rcTrQbgKrT5oPsoa93xpkGvSyd5f02MY5GY3aAvurPDtbcz7hKKgxWRmFelAgcB2P8CE-T5ynJM_knDb",
    },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t, i) => ({
          time: t.time,
          title: t.title,
          desc: "Main Event Schedule",
          image: defaultTimeline[i % 3].image,
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
    <div className="bg-[#fbf9f4] text-[#1b1c19] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#31105C] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "September 24, 2026 • Tuscany, Italy"}
        isCustomizer={props.isCustomizer}
        templateSlug="photo-gallery"
      />

      {/* Top Navbar */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#D4AF37]/20 ${
          navScrolled ? "bg-white/95 backdrop-blur-xl py-3 shadow-md" : "bg-white/80 backdrop-blur-md py-4"
        }`}
      >
        <div className="flex justify-between items-center w-full px-6 md:px-16 max-w-[1200px] mx-auto">
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#4a4452]">
            <a href="#our-story" className="hover:text-[#31105C] transition-colors relative group">
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#timeline" className="hover:text-[#31105C] transition-colors relative group">
              Timeline
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          <a href="#" className="font-serif text-2xl font-bold text-[#31105C] hover:text-[#D4AF37] transition-all hover:scale-105">
            {partner1} &amp; {partner2}
          </a>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#4a4452]">
            <a href="#gallery" className="hover:text-[#31105C] transition-colors relative group">
              Gallery
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#rsvp" className="hover:text-[#31105C] transition-colors relative group">
              RSVP
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#rsvp"
              className="bg-[#31105C] text-white px-6 py-2.5 rounded-full hover:bg-[#D4AF37] hover:text-[#31105C] transition-all shadow-md"
            >
              Registry
            </a>
          </div>

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
            <a href="#our-story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#31105C] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Editorial Photo Grid */}
      <section className="w-full pt-24 px-6 md:px-16 pb-20 max-w-[1200px] mx-auto" id="our-story">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[780px] relative">
          {/* Center Glass Overlay Card */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white/85 backdrop-blur-xl p-8 sm:p-12 text-center border border-[#D4AF37]/40 rounded-2xl shadow-2xl pointer-events-auto max-w-md w-full"
            >
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-3 block">YOU ARE INVITED</span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#31105C] mb-2">{partner1} &amp; {partner2}</h1>
              <p className="font-serif italic text-base text-[#4a4452] mb-6">{props.inviteLine || "Are getting married"}</p>
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mb-6" />
              <p className="text-xs font-semibold text-[#4a4452] uppercase tracking-wider">{props.weddingTime || "September 24, 2026 • Tuscany, Italy"}</p>
            </motion.div>
          </div>

          {/* Grid Photos */}
          <div className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden shadow-md group">
            <img src={coupleImg1} alt="Hero Couple 1" className="w-full h-full min-h-[350px] object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-md group hidden md:block">
            <img src={coupleImg2} alt="Hero Couple 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-md group hidden md:block">
            <img src={coupleImg3} alt="Hero Couple 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* Event Timeline */}
      <section className="py-24 px-6 md:px-16 bg-[#ffffff]" id="timeline">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#31105C] mb-2">Event Timeline</h2>
            <p className="text-sm text-[#4a4452]">The schedule for our special day.</p>
          </div>

          <div className="relative border-l-2 md:border-l-0 md:left-1/2 border-[#D4AF37]/50 ml-4 md:ml-0 space-y-12">
            {timelineList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative pl-8 md:w-1/2 md:pl-0 ${
                  idx % 2 === 0 ? "md:-ml-[50%] md:pr-12 md:text-right" : "md:ml-0 md:pl-12 md:text-left"
                } group`}
              >
                <div className={`absolute w-4 h-4 bg-[#D4AF37] rounded-full -left-[9px] ${
                  idx % 2 === 0 ? "md:-right-[9px] md:left-auto" : "md:-left-[9px]"
                } top-2 shadow-md z-10 group-hover:scale-125 transition-transform`} />

                <div className={`flex flex-col ${idx % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"} gap-6 items-center`}>
                  <div className="w-full md:w-1/3 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                    <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="font-serif text-2xl font-bold text-[#31105C] mb-1">{item.title}</h3>
                    <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-2">{item.time}</p>
                    <p className="text-xs text-[#4a4452] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Our Moments Gallery */}
      <section className="py-24 px-6 md:px-16 bg-[#f0eee9]" id="gallery">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#31105C] mb-2">Our Moments</h2>
            <p className="text-sm text-[#4a4452] max-w-2xl mx-auto">
              A glimpse into our journey together, leading up to this special day.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryList.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:scale-102 transition-transform duration-500 border border-[#D4AF37]/30"
              >
                <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-auto object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Locations Maps */}
      <section className="py-24 px-6 md:px-16 bg-[#ffffff]" id="events">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#31105C] mb-2">Event Locations</h2>
            <p className="text-sm text-[#4a4452]">Where the magic happens.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#fbf9f4] rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/30 flex flex-col">
              <div className="h-56 overflow-hidden">
                <img src={coupleImg1} alt="Ceremony Venue" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-serif text-2xl font-bold text-[#31105C] mb-1">The Ceremony</h3>
                <p className="text-xs text-[#4a4452] mb-4">Villa Cetinale, Sovicille, Siena, Italy</p>
                <div className="h-44 w-full rounded-xl overflow-hidden border border-[#ccc3d4] mt-auto">
                  <iframe
                    title="Ceremony Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11568.176465492476!2d11.2312!3d43.2725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132a2c1111111111%3A0x1111111111111111!2sVilla%20Cetinale!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#fbf9f4] rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/30 flex flex-col">
              <div className="h-56 overflow-hidden">
                <img src={coupleImg2} alt="Reception Venue" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-serif text-2xl font-bold text-[#31105C] mb-1">The Reception</h3>
                <p className="text-xs text-[#4a4452] mb-4">Borgo Santo Pietro, Chiusdino, Siena, Italy</p>
                <div className="h-44 w-full rounded-xl overflow-hidden border border-[#ccc3d4] mt-auto">
                  <iframe
                    title="Reception Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11579.5!2d11.1!3d43.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132a2c2222222222%3A0x2222222222222222!2sBorgo%20Santo%20Pietro!5e0!3m2!1sen!2sus!4v1680000000001!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="photo-gallery" />
      </div>

      {/* Footer */}
      <footer className="bg-[#31105C] text-white py-16 text-center border-t border-[#D4AF37]/30">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-3">
          <span className="font-serif text-3xl font-bold text-[#D4AF37]">{initials}</span>
          <p className="text-xs text-[#F1E9FF]/80">With Love, {partner1} &amp; {partner2} — 2026</p>
        </div>
      </footer>
    </div>
  );
}
