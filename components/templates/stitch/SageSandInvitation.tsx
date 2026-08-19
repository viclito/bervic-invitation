"use client";

import { useState, useEffect } from "react";
import { getWeddingTargetDate, getYouTubeEmbedUrl, formatAgeOrdinal } from "@/lib/dateUtils";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Heart,
  Play,
  MapPin,
  Menu,
  X,
  Clock,
  Sparkles,
  Calendar,
} from "lucide-react";

export default function SageSandInvitation(props: TemplateClassicFloralProps) {
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
    const interval = setInterval(() => {
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
    }, 1000);
    return () => clearInterval(interval);
  }, [props.weddingDate, props.weddingTime]);

  const partner1 = props.partnerOne || "Terance";
  const partner2 = props.partnerTwo || "Ancy";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const heroBgImg =
    props.heroImage ||
    "https://lh3.googleusercontent.com/aida/AP1WRLtisJD1qdDfRYnXBmh9fVPEvajF-Z31oa-thOzmiupl4y2rKbfLzXWdpbGf3wAC2X9LROwEGS-vT7Bvo5AnQ8XY3_AYOfMyRRzWyhwo6edp7_Wm_Lw3cPXFgUEDCJvHwixIa3g8uwQW-X9ip7CeG8QyN-TgNTaJ8z1SBrOZ5wfF0xvynfOT0cG9gFt4l7-tYHRUwdcHqGONEDBf4lcMWcoWcOp24qBi03-nAOrmNNbaKq0eaoztQr6wi7g";

  const storyImg =
    props.coupleImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDHkcXt0pSfWYe0a2Wk7yE-xixPDHHuI3_QTdS7VGNJ1RKkKxGstOOPEZbFAIzOoaz8gPwL3LDRI34AnQtH1c1BCKvHrFNTK66uQFzdsJy3DfhddU8lMnbhX9bWTczZ8oMQWo81Ax_bddACSrgDildpfcfI7bFAgJebwY3xnlTvgrfJazegnbmKqY7YR0nP-Huqy8tzIWSTJSf4f8q0zWuW_zRrtcoNl4Ztv7-kaF-vPIwAsz8ZSfdC";

  const videoCoverImg =
    props.coverImage ||
    props.coupleImage ||
    props.heroImage ||
    "/images/templates/couple-photo.jpg";

  const defaultTimeline = [
    { time: "10:00 AM", title: "Ceremony", desc: "The exchanging of vows and rings in the presence of our loved ones." },
    { time: "12:00 PM", title: "Feast Lunch", desc: "A joyous feast to celebrate the newly weds." },
    { time: "07:00 PM", title: "Grand Reception", desc: "An evening of celebrations with music, drinks, and good company." },
    { time: "08:00 PM", title: "Grand Dinner", desc: "A grand dinner to conclude our special day." },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t) => ({
          time: t.time,
          title: t.title,
          desc: t.desc || (t.date ? `Date: ${t.date}` : ""),
        }))
      : props.events && props.events.length > 0
      ? props.events.map((e) => ({
          time: e.time,
          title: e.title,
          desc: e.date ? `Date: ${e.date}` : "",
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
    <div className="bg-[#fbf9f8] text-[#1b1c1c] font-sans antialiased selection:bg-[#9caf88] selection:text-[#324224] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="sage-sand"
      />

      {/* Top Navigation */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b border-[#c5c8bc]/30 ${
          navScrolled ? "bg-[#fbf9f8]/95 backdrop-blur-md py-3 shadow-sm" : "bg-[#fbf9f8]/90 backdrop-blur-sm py-4"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-[1280px] mx-auto h-16">
          <a href="#" className="font-serif text-2xl font-bold text-[#526442] tracking-wider">
            T &amp; A
          </a>

          <div className="hidden md:flex gap-8 items-center text-xs font-semibold uppercase tracking-widest text-[#44483f]">
            <a href="#story" className="hover:text-[#526442] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#526442]/10">Our Story</a>
            <a href="#events" className="hover:text-[#526442] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#526442]/10">Events</a>
            <a href="#timeline" className="hover:text-[#526442] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#526442]/10">Timeline</a>
            <a href="#gallery" className="hover:text-[#526442] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#526442]/10">Gallery</a>
            <a href="#rsvp" className="bg-[#526442] text-white px-6 py-2 rounded-full hover:bg-[#3b4c2c] transition-colors shadow-sm ml-2">RSVP</a>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#526442]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#fbf9f8] border-b border-[#526442] px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#44483f]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#526442] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 overflow-hidden" id="story">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={heroBgImg} alt="Hero background" className="w-full h-full object-cover blur-sm" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center"
        >
          <p className="text-xs font-bold text-[#5e604d] tracking-[0.25em] uppercase mb-8">
            {props.tagline || "TOGETHER WITH THEIR FAMILIES"}
          </p>

          <h1 className="font-serif text-5xl sm:text-7xl font-bold text-[#526442] mb-3 tracking-tight">
            {partner1}
          </h1>

          <span className="font-serif italic text-3xl sm:text-4xl text-[#6c5b4e] my-2">and</span>

          <h1 className="font-serif text-5xl sm:text-7xl font-bold text-[#526442] mt-3 mb-8 tracking-tight">
            {partner2}
          </h1>

          <p className="text-base sm:text-lg text-[#44483f] mb-10 max-w-lg">
            {props.inviteLine || "Invite you to celebrate their wedding"}
          </p>

          <div className="bg-[#efeded]/70 backdrop-blur-sm border border-[#c5c8bc]/40 rounded-2xl p-8 shadow-xl inline-block">
            <p className="font-serif text-3xl font-bold text-[#6c5b4e] mb-2">{props.weddingDate || "13th May 2026"}</p>
            <p className="text-xs font-bold text-[#44483f] uppercase tracking-widest">{props.weddingTime || "10:00 AM ONWARDS"}</p>
          </div>
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 bg-[#f5f3f3]">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <Heart className="w-10 h-10 text-[#526442] fill-current mx-auto mb-4" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#526442] mb-10">Our Big Day Countdown</h2>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {[
              { label: "DAYS", value: timeLeft.days },
              { label: "HOURS", value: timeLeft.hours },
              { label: "MINS", value: timeLeft.minutes },
              { label: "SECS", value: timeLeft.seconds },
            ].map((unit, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white border border-[#c5c8bc]/30 rounded-xl p-6 min-w-[100px] shadow-sm flex flex-col items-center"
              >
                <span className="font-serif text-4xl font-bold text-[#6c5b4e]">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="text-xs font-bold text-[#44483f] mt-2 uppercase tracking-wider">{unit.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Love Story Section */}
      <section className="py-24 bg-white" id="story">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden shadow-2xl border-8 border-[#ffffff]">
                <img src={storyImg} alt="Love Story" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="font-serif text-4xl font-bold text-[#526442] mb-4">Our Love Story</h2>
              <p className="text-lg text-[#44483f] italic mb-6">
                &ldquo;Every love story is beautiful, but ours is my favorite.&rdquo;
              </p>
              <p className="text-sm text-[#44483f] leading-relaxed mb-8">
                {props.loveStoryText ||
                  "Join us as we step into a lifetime of love and togetherness. Our journey began with a simple hello and has blossomed into a beautiful adventure that we are excited to continue side by side."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Timeline Section */}
      <section className="py-24 bg-[#fbf9f8]" id="timeline">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#526442] mb-3">Event Timeline</h2>
            <Clock className="w-6 h-6 text-[#6c5b4e] mx-auto" />
          </div>

          <div className="relative border-l-2 border-[#c5c8bc]/40 ml-4 md:ml-1/2">
            {timelineList.map((item, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="mb-12 relative pl-8 md:pl-0"
                >
                  <div className="absolute -left-[9px] md:left-1/2 md:-ml-[9px] top-1 w-4 h-4 rounded-full bg-[#6c5b4e] border-4 border-white shadow" />
                  <div className={`md:w-1/2 ${isEven ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right"}`}>
                    <h3 className="font-serif text-xl font-bold text-[#526442] mb-1">{item.title}</h3>
                    <p className="text-xs font-bold text-[#6c5b4e] mb-2">{item.time}</p>
                    <p className="text-xs text-[#44483f] leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Event Locations Section */}
      <section className="py-24 bg-[#f5f3f3]" id="events">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#526442] mb-3">Event Locations</h2>
            <MapPin className="w-6 h-6 text-[#6c5b4e] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(props.locations && props.locations.length > 0
              ? props.locations
              : [
                  {
                    name: "Marriage Ceremony",
                    venueLabel: props.venuePlace || "St. Antony Church, Kaval Kinaru",
                    address: props.venuePlace || "St. Antony Church, Kaval Kinaru",
                    mapLink: "https://maps.google.com",
                  },
                  {
                    name: "Grand Reception",
                    venueLabel: "Ubahara Matha Mahal, Kaval Kinaru",
                    address: "Ubahara Matha Mahal, Kaval Kinaru",
                    mapLink: "https://maps.google.com",
                  },
                ]
            ).map((loc, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl overflow-hidden border border-[#c5c8bc]/30 shadow-md flex flex-col justify-between"
              >
                <div className="aspect-video w-full">
                  <iframe
                    title={loc.name}
                    src={loc.mapLink && loc.mapLink.includes("embed") ? loc.mapLink : (idx === 0 ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15764.041530932822!2d77.7249339!3d8.7135063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0411ed00645069%3A0xcb13e9a4440f93ff!2sSt.%20Antony's%20Church!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin" : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.433433618485!2d77.73359677590827!3d8.74526689408665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b041160ce3959c5%3A0x88981f33f7c4c379!2sUbahara%20Matha%20Mahal!5e0!3m2!1sen!2sin!4v1711200000001!5m2!1sen!2sin")}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-serif text-2xl font-bold text-[#526442] mb-2">
                    {loc.venueLabel || loc.name || props.venuePlace}
                  </h3>
                  <p className="text-xs text-[#44483f] mb-4">
                    {loc.address && loc.address !== (loc.venueLabel || loc.name)
                      ? loc.address
                      : loc.name !== (loc.venueLabel || loc.name)
                      ? loc.name
                      : props.venuePlace}
                  </p>
                  <a href={loc.mapLink || "https://maps.google.com"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#526442] font-bold text-xs hover:text-[#6c5b4e]">
                    <MapPin className="w-4 h-4" /> Get Directions
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Love Story Video Facade */}
      {props.showVideoSection !== false && Boolean(props.loveStoryVideoUrl && props.loveStoryVideoUrl.trim() !== "") && (
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-serif text-4xl font-bold text-[#526442] mb-8">Save the Date Video</h2>
            <div className="aspect-video bg-[#efeded] rounded-2xl shadow-xl border border-[#c5c8bc]/40 flex items-center justify-center relative overflow-hidden group cursor-pointer">
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
                  <img src={videoCoverImg} alt="Video Cover" className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 text-[#526442] rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform shadow-xl">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Our Moments Gallery */}
      <section className="py-24 bg-[#f5f3f3]" id="gallery">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-[#526442] mb-3">Our Moments</h2>
            <Heart className="w-6 h-6 text-[#6c5b4e] fill-current mx-auto" />
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryList.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="break-inside-avoid rounded-2xl overflow-hidden shadow-md group border border-[#c5c8bc]/30"
              >
                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="sage-sand" />
      </div>

      {/* Footer */}
      <footer className="bg-[#f5f3f3] border-t border-[#c5c8bc]/30 py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-[#44483f]">
          <span className="font-serif text-[#526442] text-xl font-bold">{initials}</span>
          <span>&copy; 2026 {partner1} &amp; {partner2}. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}
