"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { parseYouTubeEmbedUrl, getYouTubeVideoId } from "../classic-floral/LoveStoryVideoFacade";
import {
  Church,
  Camera,
  Utensils,
  PartyPopper,
  MapPin,
  Menu,
  X,
  Play,
  ExternalLink,
} from "lucide-react";

export default function EmeraldGoldInvitation(props: TemplateClassicFloralProps) {
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
    "https://lh3.googleusercontent.com/aida/AP1WRLvWfzXdN3dHblHMwCfYoZzOQpFd55WruE3qhpS4L0St43rwB0l9HRsSVUPWL226kWxQkGJRu6OUJ5cOQo4G0Vp8s-N63YtcTfH8vIaWTvvr9rHykEUQ0mI_v8bBC7ZTc8VAO1--z-jMa4pg_IU1uaN3Gd76BW-8k-d4R5LU4PtaWr7aPUpDbHttGiVo0D0y6Y_O7PNACCjqktCyXRVWMTP8nJzTwqnxpfozIb53uukdEtbwZ1iwTN6b4rI";

  const videoCoverImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBpm4j-t6RMihRtGmM9BhDv4mA8cc80g2Gps4_cJa3CerbcYtH4lMbejonFYa25EunL-XZeXmhPP-_2I1lwaiQo-a4nhAYX7OAe3JdDaQvslcPrLk5sPtrDp5UzLmJ0eFX1h_SWxL1obiYSlKtXwkIpvk-xRzLrcTSK0M84D4f9YiS9Q9SBcSYrBg_NtLF78PMqb_wzFYCreqA7y0Gd5DOeYdbXdQn8IYQZXz6bhpnSZAHarQsf77e0";

  const defaultTimeline: { time: string; date?: string; title: string; desc: string; icon: React.ReactNode }[] = [
    { time: "10:00 AM", date: "May 13, 2026", title: "Wedding Ceremony", desc: "The exchanging of vows at St. Antony Church", icon: <Church className="w-4 h-4 text-[#ffe088]" /> },
    { time: "12:30 PM", date: "May 13, 2026", title: "Family Portraits", desc: "Capturing cherishable wedding memories", icon: <Camera className="w-4 h-4 text-[#ffe088]" /> },
    { time: "07:00 PM", date: "May 13, 2026", title: "Grand Reception", desc: "Dinner, dancing, and grand evening celebration", icon: <PartyPopper className="w-4 h-4 text-[#ffe088]" /> },
  ];

  const timelineList =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay.map((t, i) => ({
          time: t.time,
          date: t.date,
          title: t.title,
          desc: "Schedule of Events",
          icon: defaultTimeline[i % 3].icon,
        }))
      : defaultTimeline;

  const defaultGallery = [
    "https://lh3.googleusercontent.com/aida/AP1WRLv7A8kyvN_MpvqRpthu-z7KMF7mC9mwkADuTHS4vnOyzMKdxfTp4BtAj4de04cJq7x5GkZe0FmLc-nUxM2dbGc5sEnEtiQM49uGb9LaaTxlDJFGb9CCg6WbqsZGm9wWL0rjSQ-nnsVpOhsZjtglowAm9NCxYV1DrK9Hz7huTlTjW6I2nWvVGLdzbhEET9v9s8IVLrbzoev__d-zBFFjHpdZC-eVZRh_AUC_hdEOZ6ncM8h2vYr3qsLAOlA",
    "https://lh3.googleusercontent.com/aida/AP1WRLuKl3y0d0Ur1X0GR89jNyA4tEh4O7Y9UEl2cVy7zcSATunTKNQZtR35thtJl5Pkb-s6CPt33p3oOu-JhqV_K-KJmJRlMrpbU1-4GZfyaQ9DOPQUazfx_2qfUu_AvJdoIg244iozw3hbq4C_Rwri61oRBQxBVjGhWo21FOuxPVKyKjon-PqvR0SHL6tjNATYYnWcLiGbk8ue4ddwEjft9Qmw-jM9GreY-frQygH28AtXSXRSApySh6sEts8",
    "https://lh3.googleusercontent.com/aida/AP1WRLvEhJXxSb9zoAY7xYoYlyOOe-3Y9n3_5L3jySpdXWJkWR4hKFi2Tyc5gw55QTcXYIcTRpHfbteRMdbV3E99JnaDT4-tth5lKwWI7GCa5RD9veh_BoV2IVV9vcpX4MvHdCpQvWWWOTdrz2nLexFVTJOpSKk00GSrv-7lU_Np5wntEcKLkvpNnrDqRQZslqk4TXPIyRIIJGKevFxdllwl-58RsLUY_viqOHouprDUyJHuo1Bnr32F4MhJTJM",
    "https://lh3.googleusercontent.com/aida/AP1WRLt-EmTuDPVWoS8a3KOuvb1nZuz3QNMdn7ERfhrxMCNKJ6qW3mKa3k_4FmVZa5THA9uZ-_KDEPVFlDdrKtqpluQhzjA37_jwYoqLmt25V0iVNEDw31slPowT_RNSFvTv_7qS1-8ztMBREfFQTAm_zIH_GM-vvwkkhfM10741b9CexocgtgxkX6ltdQ0Svxa6xhhtYYBQvyMb3Vzlj6CRzpNow4xFxBdcc9tQOOXj50MJqhh4OFkPrM5Spg",
    "https://lh3.googleusercontent.com/aida/AP1WRLvWfzXdN3dHblHMwCfYoZzOQpFd55WruE3qhpS4L0St43rwB0l9HRsSVUPWL226kWxQkGJRu6OUJ5cOQo4G0Vp8s-N63YtcTfH8vIaWTvvr9rHykEUQ0mI_v8bBC7ZTc8VAO1--z-jMa4pg_IU1uaN3Gd76BW-8k-d4R5LU4PtaWr7aPUpDbHttGiVo0D0y6Y_O7PNACCjqktCyXRVWMTP8nJzTwqnxpfozIb53uukdEtbwZ1iwTN6b4rI",
    "https://lh3.googleusercontent.com/aida/AP1WRLtKz9lJnGkGr1HEozNINKPO3psDlp8ptMnCyX1z4oft_p6uW5Je460e3ZVLPtFYD3UEFqkvm9Q2rOXYPKJe6ts3G-0Ti4-a-wM2bdTGiAMSkQOC8m5Eamp3Ngl5VCVeuhv9Y_XIxdS1ooIi3D40fFiAFwBQ4uVsVfnRERsG3a4A-ac9wFX5UYBtLoz2wPm3i3yLOQu0R0pVED5aWtJjs4-S8AuEn9J0mBnZp1k8rY4U0vcK3FeRC0kULw",
  ];

  const galleryList = props.galleryImages && props.galleryImages.length >= 6 ? props.galleryImages : defaultGallery;
  const showVideo = props.showVideoSection ?? true;
  const videoId = getYouTubeVideoId(props.loveStoryVideoUrl);
  const embedUrl = parseYouTubeEmbedUrl(props.loveStoryVideoUrl);
  const directWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] font-sans antialiased selection:bg-[#ffe088] selection:text-[#241a00] relative min-h-screen overflow-hidden">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={partner1}
        partnerTwo={partner2}
        weddingTime={props.weddingTime || "May 13, 2026 • 10:00 AM"}
        isCustomizer={props.isCustomizer}
        templateSlug="emerald-gold"
      />

      {/* Sleek Top Navigation */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 border-b border-[#c0c9c2]/30 ${
          navScrolled ? "bg-[#fcf9f8]/95 backdrop-blur-md py-2 shadow-md" : "bg-[#fcf9f8]/90 backdrop-blur-sm py-2.5"
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-[1280px] mx-auto h-12">
          <a href="#" className="font-serif text-xl font-bold text-[#043927] tracking-wider">
            {initials}
          </a>

          <div className="hidden md:flex gap-8 items-center text-xs font-semibold uppercase tracking-widest text-[#414944]">
            <a href="#story" className="hover:text-[#735c00] transition-colors">Our Story</a>
            <a href="#events" className="hover:text-[#735c00] transition-colors">Events</a>
            <a href="#timeline" className="hover:text-[#735c00] transition-colors">Timeline</a>
            <a href="#gallery" className="hover:text-[#735c00] transition-colors">Gallery</a>
          </div>

          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#043927] text-white font-bold text-[11px] uppercase tracking-widest px-5 py-2 rounded border border-[#735c00] hover:bg-[#ffe088] hover:text-[#043927] transition-colors"
          >
            RSVP
          </a>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#043927]">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#fcf9f8] border-b border-[#735c00] px-6 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-[#414944]"
          >
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
            <a href="#rsvp" onClick={() => setMobileMenuOpen(false)} className="text-[#735c00] font-extrabold">RSVP NOW</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#043927] pt-20 pb-16" id="story">
        <div className="absolute inset-0 z-0">
          <img src={coupleHeroImg} alt="Couple Portrait" className="w-full h-full object-cover opacity-35 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#043927] via-[#043927]/80 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 md:px-16 max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ffe088]">
            {props.tagline || "TOGETHER WITH THEIR FAMILIES"}
          </span>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-[#fcf9f8] tracking-tight flex flex-col gap-2">
            <span>{partner1}</span>
            <span className="text-[#ffe088] font-serif italic text-4xl">&amp;</span>
            <span>{partner2}</span>
          </h1>

          <p className="text-base sm:text-lg text-[#c9c6c1] max-w-xl mx-auto">
            {props.inviteLine || "Invite you to celebrate their wedding"}
          </p>

          <div className="border border-[#ffe088]/50 px-8 py-4 rounded-sm backdrop-blur-sm bg-[#043927]/40 shadow-xl">
            <p className="font-serif text-2xl font-bold text-[#fcf9f8]">13th May 2026</p>
            <p className="text-xs font-bold text-[#ffe088] uppercase tracking-widest mt-1">10:00 AM ONWARDS</p>
          </div>
        </motion.div>
      </section>

      {/* Events Section */}
      <section className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto" id="events">
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl font-bold text-[#043927] mb-3">Wedding Events</h2>
          <div className="w-12 h-1 bg-[#735c00] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Matrimony */}
          <motion.div
            whileHover={{ y: -6 }}
            className="border-2 border-[#735c00]/50 p-8 sm:p-10 text-center rounded bg-white shadow-md hover:shadow-xl transition-all"
          >
            <Church className="w-10 h-10 text-[#735c00] mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#043927] mb-1">Holy Matrimony</h3>
            <p className="text-xs font-bold text-[#735c00] uppercase tracking-widest mb-4">MAY 13, 2026 • 10:00 AM</p>
            <p className="text-xs text-[#414944] mb-8 leading-relaxed">
              St. Antony Church<br />Kaval Kinaru, Tirunelveli District
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#735c00] text-[#735c00] px-8 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#735c00] hover:text-white transition-colors"
            >
              <MapPin className="w-4 h-4" /> View on Map
            </a>
          </motion.div>

          {/* Reception */}
          <motion.div
            whileHover={{ y: -6 }}
            className="border-2 border-[#735c00]/50 p-8 sm:p-10 text-center rounded bg-white shadow-md hover:shadow-xl transition-all"
          >
            <PartyPopper className="w-10 h-10 text-[#735c00] mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#043927] mb-1">Grand Reception</h3>
            <p className="text-xs font-bold text-[#735c00] uppercase tracking-widest mb-4">MAY 13, 2026 • 07:00 PM</p>
            <p className="text-xs text-[#414944] mb-8 leading-relaxed">
              Ubahara Matha Mahal<br />Kaval Kinaru, Tirunelveli District
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#735c00] text-[#735c00] px-8 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#735c00] hover:text-white transition-colors"
            >
              <MapPin className="w-4 h-4" /> View on Map
            </a>
          </motion.div>
        </div>
      </section>

      {/* Event Timeline with Responsive Wrap Grid */}
      <section className="py-20 px-6 md:px-16 bg-[#f6f3f2]" id="timeline">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-[#043927] mb-3">Event Timeline</h2>
            <div className="w-12 h-1 bg-[#735c00] mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {timelineList.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white border-2 border-[#735c00]/30 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-between"
              >
                <div className="w-full">
                  <span className="text-xs font-bold text-[#735c00] uppercase tracking-widest block mb-2">{item.date ? `${item.date} • ${item.time}` : item.time}</span>
                  <h4 className="font-serif text-lg font-bold text-[#043927] mb-2 leading-snug">{item.title}</h4>
                </div>
                <p className="text-xs text-[#414944]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto" id="gallery">
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl font-bold text-[#043927] mb-3">Our Moments</h2>
          <div className="w-12 h-1 bg-[#735c00] mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryList.map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="group relative overflow-hidden rounded-lg aspect-square shadow-md border border-[#735c00]/30"
            >
              <img src={img} alt={`Moment ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[#043927]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Love Story Video Facade (Only rendered if showVideo is true) */}
      {showVideo && (
        <section className="py-20 px-6 md:px-16 bg-[#043927] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold text-[#ffe088] mb-3">Our Love Story</h2>
            <div className="w-12 h-1 bg-[#ffe088] mx-auto mb-10" />

            <div className="relative aspect-video rounded-lg overflow-hidden border-4 border-[#ffe088]/40 shadow-2xl group cursor-pointer bg-[#002215]">
              {isPlayingVideo ? (
                <div className="relative w-full h-full">
                  <iframe
                    title="Love story video"
                    src={embedUrl}
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                  {/* Direct Watch Button Fallback */}
                  <div className="absolute top-2 right-2 z-20">
                    <a
                      href={directWatchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#002215]/80 hover:bg-[#ffe088] hover:text-[#043927] text-[#ffe088] text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#ffe088]/50 flex items-center gap-1.5 backdrop-blur-sm transition-all shadow-md"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full" onClick={() => setIsPlayingVideo(true)}>
                  <img src={videoCoverImg} alt="Video Cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center bg-[#043927]/40">
                    <div className="w-20 h-20 bg-[#ffe088] rounded-full flex items-center justify-center text-[#043927] group-hover:scale-110 transition-transform shadow-xl">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Fallback Link */}
            <div className="mt-3 text-center">
              <a
                href={directWatchUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffe088] hover:underline"
              >
                <span>Playback issues? Click to watch directly on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <div id="rsvp">
        <RsvpSection partnerOne={partner1} partnerTwo={partner2} templateSlug="emerald-gold" />
      </div>

      {/* Footer */}
      <footer className="bg-[#002215] text-white py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold">
          <span className="font-serif text-[#ffe088] text-lg">{initials}</span>
          <span className="text-white/70">&copy; 2026 {partner1} &amp; {partner2}. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
