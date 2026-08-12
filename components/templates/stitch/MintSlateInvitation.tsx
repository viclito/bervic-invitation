"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import { getYouTubeEmbedUrl } from "@/lib/dateUtils";
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

  const partner1 = props.partnerOne || "Sasa Adi Tinah";
  const partner2 = props.partnerTwo || "Allan Susilo";
  const initials = props.coupleInitials || `${partner1[0]} & ${partner2[0]}`;

  const coverImg =
    props.coverImage ||
    props.heroImage ||
    props.coupleImage ||
    "/images/templates/couple-photo.jpg";

  const brideImg =
    props.coupleImage ||
    props.coverImage ||
    "/images/templates/groom-bride-1.jpg";

  const groomImg =
    props.partnerTwoImage ||
    props.coverImage ||
    "/images/templates/groom-bride-2.jpg";

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
          <img src={coverImg} alt="Cover Background" className="w-full h-full object-cover grayscale contrast-125" />
        </div>
      </section>

      {/* Meet the Bride & Groom Section */}
      <section className="py-20 border-b border-[#191c1d] bg-[#f8fafa]" id="couple">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#246a52] mb-2">
              The Happy Couple
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#191c1d] uppercase">
              Meet the Bride &amp; Groom
            </h2>
            <div className="w-16 h-1 bg-[#246a52] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Bride Card */}
            <div className="border border-[#191c1d] bg-white p-4 relative group shadow-sm">
              <div className="h-96 relative overflow-hidden border border-[#191c1d]">
                <img
                  src={brideImg}
                  alt={`${partner1} - Bride`}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191c1d]/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-left text-white">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#aaf0d1] font-bold block mb-1">
                    Bride
                  </span>
                  <h3 className="text-3xl font-extrabold uppercase tracking-tight">{partner1}</h3>
                </div>
              </div>
            </div>

            {/* Groom Card */}
            <div className="border border-[#191c1d] bg-white p-4 relative group shadow-sm">
              <div className="h-96 relative overflow-hidden border border-[#191c1d]">
                <img
                  src={groomImg}
                  alt={`${partner2} - Groom`}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191c1d]/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-left text-white">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#aaf0d1] font-bold block mb-1">
                    Groom
                  </span>
                  <h3 className="text-3xl font-extrabold uppercase tracking-tight">{partner2}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Celebration Film Video Section */}
      {props.showVideoSection !== false && Boolean(props.loveStoryVideoUrl) && (
        <section className="py-20 border-b border-[#191c1d] bg-[#191c1d] text-white relative" id="video">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#aaf0d1] block mb-2">
                Cinematic Preview
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-white">
                Our Celebration Film
              </h2>
              <p className="font-mono text-xs text-white/70 mt-2 uppercase tracking-wider">
                Watch a preview of our journey &amp; precious moments together
              </p>
            </div>

            <div className="relative rounded border-2 border-[#246a52] overflow-hidden shadow-2xl aspect-video bg-black group">
              {isPlayingVideo ? (
                <iframe
                  src={getYouTubeEmbedUrl(props.loveStoryVideoUrl)}
                  title="Love Story Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                  <img
                    src={coverImg}
                    alt="Video Poster"
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500 opacity-70"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[#246a52] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white text-left font-mono">
                    <p className="text-[10px] uppercase tracking-widest text-[#aaf0d1] font-bold">Watch Video</p>
                    <p className="text-xl font-bold uppercase">{partner1} &amp; {partner2}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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

      {/* Wedding Events & Locations Section */}
      <section className="py-20 border-b border-[#191c1d] bg-[#f8fafa]" id="events">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16" id="venue">
          <div className="mb-12 max-w-md">
            <h2 className="text-3xl md:text-4xl font-bold text-[#191c1d] uppercase mb-2">Wedding Events &amp; Venues</h2>
            <p className="text-sm text-[#3f4944]">Join us as we step into a lifetime of love and togetherness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(props.locations && props.locations.length > 0
              ? props.locations
              : [
                  {
                    name: "Marriage Ceremony",
                    venueLabel: "St. Antony Church",
                    address: props.contactAddress || "Kaval Kinaru, Tirunelveli District",
                    image: "/images/templates/venue-ceremony.jpg",
                    mapLink: "https://maps.google.com",
                  },
                  {
                    name: "Grand Reception",
                    venueLabel: "Ubahara Matha Mahal",
                    address: props.venuePlace || "Kaval Kinaru, Tirunelveli District",
                    image: "/images/templates/venue-reception.jpg",
                    mapLink: "https://maps.google.com",
                  },
                ]
            ).map((loc, idx) => (
              <div
                key={idx}
                id={`venue-card-${idx}`}
                className="border border-[#191c1d] p-6 bg-white flex flex-col justify-between hover:bg-[#f2f4f4] transition-colors relative shadow-sm scroll-mt-28"
              >
                <div className="h-48 rounded border border-[#191c1d] overflow-hidden mb-6">
                  <img
                    src={
                      loc.image ||
                      (idx === 0
                        ? "/images/templates/venue-ceremony.jpg"
                        : "/images/templates/venue-reception.jpg")
                    }
                    alt={loc.name || "Venue"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2 mb-6">
                  <p className="font-mono text-xs font-bold text-[#246a52] uppercase">
                    {loc.venueLabel || (idx === 0 ? "Marriage Ceremony" : "Grand Reception")}
                  </p>
                  <h3 className="text-2xl font-bold text-[#191c1d] uppercase">
                    {loc.name || (idx === 0 ? "Marriage Ceremony" : "Grand Reception")}
                  </h3>
                  <p className="text-xs text-[#3f4944]">
                    {loc.address || "Kaval Kinaru, Tirunelveli District"}
                  </p>
                </div>

                <div className="h-44 w-full border border-[#191c1d] overflow-hidden rounded mb-6 bg-gray-100">
                  <iframe
                    title={`Venue Map ${idx + 1}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      `${loc.name || ""} ${loc.address || ""}`.trim() || "New York, NY"
                    )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>

                <a
                  href={
                    loc.mapLink && loc.mapLink !== "https://maps.google.com"
                      ? loc.mapLink
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${loc.name || ""} ${loc.address || ""}`.trim() || "New York, NY"
                        )}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#191c1d] border-b-2 border-[#246a52] pb-0.5 hover:text-[#246a52] uppercase self-start"
                >
                  View Location Map <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ))}
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
