"use client";

import { useState, useEffect } from "react";
import { getWeddingTargetDate, getYouTubeEmbedUrl, formatAgeOrdinal } from "@/lib/dateUtils";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Church,
  Camera,
  Utensils,
  PartyPopper,
  MapPin,
  Menu,
  X,
  Play,
  Sparkles,
  Flower2,
} from "lucide-react";

export default function ForestFernInvitation(props: TemplateClassicFloralProps) {
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

  const fernHeroImg =
    props.heroImage ||
    "https://lh3.googleusercontent.com/aida/AP1WRLsyetsNB3VvfHZJLQR2gtqueKxbmMGzqWXsyFEZbFabL5kkLReXEYwmDSNP9hAIcrzTSOHiCTlhoVSptSS_OuDvU4dIAuu1wFgioY2rNp8-VM2X3ts_1QIVIYh8Sv65MZ_pUSU8Z4tHbMIS9-aKr_7ut0qoplvLZMO2Qp9Kz0KJ4Z7Eb8jDRYiAa_W77sRCAbNbRO11060IAs6hdnkrLOWrtHvS2D42Y0_ql2MedmME2ueWwEn8_HpLHNk";

  const storyImg =
    props.coupleImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB57ztD0xf_u0DHs5VOUMPCWgFavF3EdhazNk79b5TX059nnRN0MjckatYElDg9voGsKEdKDqDkuWMR6XXuF0IioEr3YBk0fROV8MbydX9OVHfg7YtjTlM6lyzkFJbUSYiC385Ncu4bKVcrENO500KbTD-Ub02kalv4p0bbm-OzRcrHK6lyMGCUp9k_Ri72su6fYhgt7PIqnLTuVColtm5wEcsDpxh8SYuyFE5eXnQhFF2ztQV315R_";

  const videoCoverImg =
    props.coverImage ||
    props.coupleImage ||
    props.heroImage ||
    "/images/templates/couple-photo.jpg";

  const defaultTimeline = [
    { time: "10:00 AM", title: "The Ceremony", desc: "Witness the exchange of our vows in the presence of God and our loved ones.", icon: <Church className="w-4 h-4 text-[#203527]" /> },
    { time: "11:30 AM", title: "Family Portraits", desc: "Capturing memories with our dear families outside the cathedral.", icon: <Camera className="w-4 h-4 text-[#203527]" /> },
    { time: "12:30 PM", title: "Luncheon", desc: "A traditional feast to celebrate the joyous occasion.", icon: <Utensils className="w-4 h-4 text-[#203527]" /> },
    { time: "06:00 PM", title: "Evening Reception", desc: "Join us for an evening of music, dancing, and merriment under the stars.", icon: <PartyPopper className="w-4 h-4 text-[#203527]" /> },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t, idx) => ({
          time: t.time,
          title: t.title,
          desc: t.desc || (t.date ? `Date: ${t.date}` : ""),
          icon: defaultTimeline[idx % defaultTimeline.length]?.icon,
        }))
      : props.events && props.events.length > 0
      ? props.events.map((e, idx) => ({
          time: e.time,
          title: e.title,
          desc: e.date ? `Date: ${e.date}` : "",
          icon: defaultTimeline[idx % defaultTimeline.length]?.icon,
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
    <div className="bg-[#13140f] text-[#e4e2db] font-sans antialiased selection:bg-[#1b3022] selection:text-[#b4cdb8] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="forest-fern"
      />

      {/* Top Navigation */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#434843]/30 ${
          navScrolled ? "bg-[#13140f]/95 backdrop-blur-md py-3 shadow-md" : "bg-[#13140f]/80 backdrop-blur-sm py-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-[1280px] mx-auto h-16">
          <a href="#" className="font-serif text-2xl font-bold text-[#b4cdb8] tracking-tight">
            {initials}
          </a>

          <div className="hidden md:flex gap-8 items-center text-xs font-semibold uppercase tracking-widest text-[#c3c8c1]">
            <a href="#story" className="hover:text-[#b4cdb8] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#b4cdb8] transition-colors">Events</a>
            <a href="#timeline" className="hover:text-[#b4cdb8] transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-[#b4cdb8] transition-colors">Gallery</a>
          </div>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#28501e] text-[#94c183] font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded border border-[#8d928c]/20 hover:bg-[#a4d393] hover:text-[#113809] transition-colors"
          >
            RSVP
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#b4cdb8]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#13140f] border-b border-[#28501e] px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#c3c8c1]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#b4cdb8] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-28 pb-20 px-6 overflow-hidden" id="story">
        <img
          src={fernHeroImg}
          alt="Fern motif background"
          className="absolute top-0 right-0 w-full max-w-md opacity-20 pointer-events-none mix-blend-screen rotate-12 -translate-y-1/4 translate-x-1/4 blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-6"
        >
          <span className="text-xs font-bold text-[#ffdcbd] uppercase tracking-[0.25em]">
            {props.tagline || "TOGETHER WITH THEIR FAMILIES"}
          </span>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-[#d0e9d4] tracking-tight flex flex-col gap-2 italic">
            <span>{partner1}</span>
            <span className="text-base text-[#f0bd8b] not-italic my-1">and</span>
            <span>{partner2}</span>
          </h1>

          <div className="flex items-center justify-center gap-4 text-[#f0bd8b]">
            <div className="h-px w-16 bg-[#422401]" />
            <Flower2 className="w-4 h-4" />
            <div className="h-px w-16 bg-[#422401]" />
          </div>

          <p className="text-base sm:text-lg text-[#c3c8c1] max-w-lg">
            {props.inviteLine || "Invite you to celebrate their wedding in the forest"}
          </p>

          <div className="pt-4 text-center">
            <p className="font-serif text-3xl font-bold text-[#b4cdb8]">{props.weddingDate || "13th May 2026"}</p>
            <p className="text-xs text-[#c3c8c1] uppercase tracking-widest mt-1">{props.weddingTime || "10:00 AM ONWARDS"}</p>
          </div>

          <a
            href="#rsvp"
            className="mt-6 bg-[#1b3022] text-[#d0e9d4] border border-[#422401] hover:bg-[#28501e] transition-all font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded shadow-lg"
          >
            Save the Date
          </a>
        </motion.div>
      </section>

      {/* Our Love Story Section */}
      <section className="py-24 px-6 md:px-16 bg-[#1b1c17]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#d0e9d4] mb-2">Our Love Story</h2>
            <p className="text-base text-[#f0bd8b] italic">Every love story is beautiful, but ours is my favorite.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] rounded border border-[#434843]/30 overflow-hidden relative group">
              <img
                src={storyImg}
                alt="Forest Couple Portrait"
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#1b3022]/20 group-hover:bg-transparent transition-colors" />
            </div>

            <div className="space-y-6 text-sm text-[#c3c8c1] leading-relaxed">
              <p>
                {props.loveStoryText ||
                  "Our journey began in a quiet corner of the world, surrounded by the rustling leaves and the gentle hum of nature. What started as a chance encounter quickly blossomed into a deep, unwavering connection."}
              </p>
              <p>
                We are thrilled to invite our dearest friends and family to witness the next chapter of our story as we exchange our vows and commit to a lifetime of love.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Events Section */}
      <section className="py-24 px-6 md:px-16 bg-[#13140f]" id="events">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#d0e9d4] mb-2">Wedding Events</h2>
            <p className="text-base text-[#f0bd8b] italic">Join us for the celebrations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Matrimony */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-[#1f201b] p-8 sm:p-10 rounded-lg border border-[#434843]/30 flex flex-col items-center text-center group hover:bg-[#2a2a25] transition-all"
            >
              <Church className="w-10 h-10 text-[#b4cdb8] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-2xl font-bold text-[#d0e9d4] mb-2">Holy Matrimony</h3>
              <p className="text-xs font-bold text-[#c3c8c1] uppercase tracking-widest mb-6">{props.weddingDate || "13th May 2026"} • {props.weddingTime || "10:00 AM"}</p>
              <p className="text-xs text-[#c3c8c1] mb-8 leading-relaxed">
                St. Antony Church<br />Kaval Kinaru, Tirunelveli District
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#ffdcbd] hover:text-[#f0bd8b] font-bold text-xs uppercase tracking-widest border-b border-[#ffdcbd]/30 pb-1"
              >
                <MapPin className="w-4 h-4" /> View on Map
              </a>
            </motion.div>

            {/* Reception */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-[#1f201b] p-8 sm:p-10 rounded-lg border border-[#434843]/30 flex flex-col items-center text-center group hover:bg-[#2a2a25] transition-all"
            >
              <PartyPopper className="w-10 h-10 text-[#b4cdb8] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-2xl font-bold text-[#d0e9d4] mb-2">The Reception</h3>
              <p className="text-xs font-bold text-[#c3c8c1] uppercase tracking-widest mb-6">{props.weddingDate || "13th May 2026"} • 06:00 PM</p>
              <p className="text-xs text-[#c3c8c1] mb-8 leading-relaxed">
                Ubahara Matha Mahal<br />Kaval Kinaru, Tirunelveli District
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#ffdcbd] hover:text-[#f0bd8b] font-bold text-xs uppercase tracking-widest border-b border-[#ffdcbd]/30 pb-1"
              >
                <MapPin className="w-4 h-4" /> View on Map
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Day's Flow Timeline Section */}
      <section className="py-24 px-6 md:px-16 bg-[#1b1c17]" id="timeline">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#d0e9d4] mb-2">The Day&apos;s Flow</h2>
            <p className="text-base text-[#f0bd8b] italic">Our story unfolds</p>
          </div>

          <div className="space-y-12 relative border-l-2 border-[#434843]/30 ml-4 md:ml-1/2">
            {timelineList.map((item, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex items-center justify-between md:justify-normal ${
                    isEven ? "md:flex-row-reverse" : ""
                  } group`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#1b1c17] bg-[#b4cdb8] text-[#203527] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {item.icon}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-lg bg-[#13140f] border border-[#434843]/20 shadow-sm text-left">
                    <span className="text-xs font-bold text-[#ffdcbd] uppercase tracking-widest block mb-1">{item.time}</span>
                    <h4 className="font-serif text-xl font-bold text-[#b4cdb8] mb-1">{item.title}</h4>
                    <p className="text-xs text-[#c3c8c1]">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Moments Gallery Section */}
      <section className="py-24 px-6 md:px-16 bg-[#13140f]" id="gallery">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#d0e9d4] mb-2">Our Moments</h2>
            <p className="text-base text-[#f0bd8b] italic">Captured in time</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryList.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="aspect-square rounded-lg overflow-hidden group border border-[#434843]/20"
              >
                <img
                  src={img}
                  alt={`Moment ${idx + 1}`}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaser Video Facade */}
      {props.showVideoSection !== false && Boolean(props.loveStoryVideoUrl && props.loveStoryVideoUrl.trim() !== "") && (
        <section className="py-24 px-6 md:px-16 bg-[#1b1c17]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold text-[#d0e9d4] mb-8">Wedding Teaser</h2>
            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#434843]/30 shadow-2xl group cursor-pointer">
              {isPlayingVideo ? (
                <iframe
                  title="Love story video"
                  src={getYouTubeEmbedUrl(props.loveStoryVideoUrl)}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full relative" onClick={() => setIsPlayingVideo(true)}>
                  <img src={videoCoverImg} alt="Video Teaser" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-[#13140f]/50 group-hover:bg-[#13140f]/30 transition-colors flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-[#b4cdb8] text-[#203527] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform mb-3">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                    <span className="text-xs font-bold text-[#ffdcbd] uppercase tracking-widest">Play Teaser</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="forest-fern" />
      </div>

      {/* Footer */}
      <footer className="bg-[#0e0f0a] border-t border-[#434843]/20 py-12">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col items-center text-center gap-4 text-xs font-bold text-[#c3c8c1]">
          <span className="font-serif text-[#b4cdb8] text-2xl">{initials}</span>
          <p className="text-[#c3c8c1]">Thank you for being a part of our special journey.</p>
          <span className="text-[#8d928c]">&copy; 2026 {partner1} &amp; {partner2}. Built for a lifetime.</span>
        </div>
      </footer>
    </div>
  );
}
