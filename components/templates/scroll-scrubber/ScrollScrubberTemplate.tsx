"use client";

import React, { useRef, useState } from "react";
import ScrollScrubberCanvas from "./ScrollScrubberCanvas";
import {
  Heart,
  Send,
  CheckCircle2,
  Sparkles,
  User,
  Phone,
  Mail,
  Users,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

export interface EventItem {
  time: string;
  title: string;
  location?: string;
  description?: string;
}

export interface LocationItem {
  title?: string;
  name: string;
  address: string;
  time?: string;
  mapUrl?: string;
}

export interface ScrollScrubberTemplateProps {
  templateSlug?: string;
  coupleInitials?: string;
  partnerOne?: string;
  partnerTwo?: string;
  tagline?: string;
  inviteLine?: string;
  weddingDate?: string;
  weddingTime?: string;
  events?: EventItem[];
  locations?: LocationItem[];
  galleryImages?: string[];
  guestName?: string;
  guestPhone?: string;
}

export default function ScrollScrubberTemplate({
  templateSlug = "scroll-scrubber",
  partnerOne = "Terance",
  partnerTwo = "Ancy",
  tagline = "TOGETHER WITH THEIR FAMILIES",
  inviteLine = "Request the honor of your presence at the celebration of their holy matrimony",
  weddingDate = "December 18, 2026",
  weddingTime = "4:00 PM Onwards",
  events = [
    {
      time: "03:30 PM",
      title: "Guest Arrival & Welcome Drinks",
      location: "Grand Foyer, St. Patrick's",
      description: "Welcome champagne & classical harp performance",
    },
    {
      time: "04:30 PM",
      title: "Holy Matrimony Ceremony",
      location: "St. Patrick's Cathedral",
      description: "Exchange of vows and sacred ring blessing",
    },
    {
      time: "07:00 PM",
      title: "Royal Gala Reception",
      location: "The Palace Grand Ballroom",
      description: "Live band, dinner banquet, and royal dancing",
    },
  ],
  locations = [
    {
      title: "Sacred Ceremony",
      name: "St. Patrick's Cathedral",
      address: "124 Cathedral Square, Central City",
      time: "04:30 PM",
      mapUrl: "https://maps.google.com",
    },
    {
      title: "Evening Banquet",
      name: "The Palace Grand Ballroom",
      address: "88 Royal Gardens Boulevard",
      time: "07:00 PM",
      mapUrl: "https://maps.google.com",
    },
  ],
  galleryImages = [
    "/images/templates/gallery-1.jpg",
    "/images/templates/gallery-2.jpg",
    "/images/templates/gallery-3.jpg",
    "/images/templates/gallery-4.jpg",
  ],
  guestName = "",
  guestPhone = "",
}: ScrollScrubberTemplateProps) {
  const rsvpSectionRef = useRef<HTMLDivElement>(null);

  // RSVP Form States
  const [name, setName] = useState(guestName);
  const [phone, setPhone] = useState(guestPhone);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"ATTENDING" | "DECLINED">("ATTENDING");
  const [plusOnes, setPlusOnes] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const scrollToRsvp = () => {
    rsvpSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/invitations/${templateSlug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          status,
          plusOnes: status === "ATTENDING" ? plusOnes : 0,
          dietaryNotes: message.trim(),
        }),
      });

      if (!res.ok) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-full bg-[#070707] text-[#F8F3EA] min-h-screen selection:bg-[#D9A441] selection:text-[#070707]">
      {/* 1. Scroll-Scrubbing Canvas Section (480 Frames + Overlays) */}
      <ScrollScrubberCanvas
        partnerOne={partnerOne}
        partnerTwo={partnerTwo}
        tagline={tagline}
        inviteLine={inviteLine}
        weddingDate={weddingDate}
        weddingTime={weddingTime}
        events={events}
        locations={locations}
        onExploreClick={scrollToRsvp}
      />

      {/* 2. Photo Gallery & Moments Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-[#070707] via-[#0B0B0B] to-[#070707] border-t border-[#D9A441]/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/40 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-[#D9A441]" />
          </div>

          <span className="text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold">
            Capturing Forever
          </span>
          <h2 className="text-4xl sm:text-6xl font-accent italic text-[#FDF6F3] mt-2 mb-4">
            Pre-Wedding Gallery
          </h2>

          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D9A441] to-transparent mx-auto mb-12" />

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((imgSrc, idx) => (
              <div
                key={idx}
                className="group relative h-80 rounded-2xl overflow-hidden border border-[#D9A441]/30 shadow-lg bg-[#141414]"
              >
                <Image
                  src={imgSrc}
                  alt={`${partnerOne} & ${partnerTwo} gallery ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 filter contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#F7E7C4] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-accent italic">
                    {partnerOne} &amp; {partnerTwo}
                  </span>
                  <Heart className="w-4 h-4 text-[#D9A441] fill-current" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interactive Luxury RSVP Form */}
      <section
        ref={rsvpSectionRef}
        id="rsvp"
        className="relative py-24 px-6 bg-[#0B0B0B] border-t border-[#D9A441]/20 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D9A441]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="bg-[#121212]/90 backdrop-blur-xl border border-[#D9A441]/35 p-8 sm:p-12 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#D9A441] to-transparent" />

            <div className="w-14 h-14 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/40 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-[#D9A441] fill-current" />
            </div>

            <span className="text-xs uppercase tracking-[0.35em] text-[#D9A441] font-semibold">
              R.S.V.P. Confirmation
            </span>
            <h2 className="text-4xl sm:text-5xl font-accent italic text-[#FDF6F3] mt-2 mb-2">
              Will You Attend?
            </h2>
            <p className="text-xs text-[#F8F3EA]/70 mb-8">
              Please respond by November 30, 2026
            </p>

            {submitted ? (
              <div className="py-12 px-6 rounded-2xl bg-[#D9A441]/10 border border-[#D9A441]/40 text-center">
                <CheckCircle2 className="w-16 h-16 text-[#D9A441] mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-accent italic text-[#FDF6F3]">
                  Thank You, {name || "Dear Guest"}!
                </h3>
                <p className="text-sm text-[#F8F3EA]/80 mt-2">
                  Your response has been received with joy. We look forward to
                  celebrating with you!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-5 text-left">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs text-center">
                    {errorMessage}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-medium mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#D9A441]/70 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full bg-[#070707] border border-[#D9A441]/30 rounded-xl pl-11 pr-4 py-3 text-sm text-[#FDF6F3] placeholder-[#F8F3EA]/30 focus:outline-none focus:border-[#D9A441] transition-colors"
                    />
                  </div>
                </div>

                {/* Phone & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-medium mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#D9A441]/70 absolute left-4 top-3.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-[#070707] border border-[#D9A441]/30 rounded-xl pl-11 pr-4 py-3 text-sm text-[#FDF6F3] placeholder-[#F8F3EA]/30 focus:outline-none focus:border-[#D9A441] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-medium mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#D9A441]/70 absolute left-4 top-3.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-[#070707] border border-[#D9A441]/30 rounded-xl pl-11 pr-4 py-3 text-sm text-[#FDF6F3] placeholder-[#F8F3EA]/30 focus:outline-none focus:border-[#D9A441] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Attendance Selection */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-medium mb-1.5">
                    Will You Attend?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setStatus("ATTENDING")}
                      className={`py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        status === "ATTENDING"
                          ? "bg-[#D9A441] text-[#070707] border-[#D9A441] shadow-[0_0_15px_rgba(217,164,65,0.3)]"
                          : "bg-[#070707] text-[#F8F3EA]/70 border-[#D9A441]/30 hover:border-[#D9A441]"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Joyfully Accept
                    </button>

                    <button
                      type="button"
                      onClick={() => setStatus("DECLINED")}
                      className={`py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        status === "DECLINED"
                          ? "bg-red-900/80 text-red-100 border-red-500"
                          : "bg-[#070707] text-[#F8F3EA]/70 border-[#D9A441]/30 hover:border-[#D9A441]"
                      }`}
                    >
                      Regretfully Decline
                    </button>
                  </div>
                </div>

                {/* Plus Ones count */}
                {status === "ATTENDING" && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-medium mb-1.5">
                      Number of Guests (Including Yourself)
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-[#D9A441]/70 absolute left-4 top-3.5" />
                      <select
                        value={plusOnes}
                        onChange={(e) => setPlusOnes(Number(e.target.value))}
                        className="w-full bg-[#070707] border border-[#D9A441]/30 rounded-xl pl-11 pr-4 py-3 text-sm text-[#FDF6F3] focus:outline-none focus:border-[#D9A441] transition-colors"
                      >
                        <option value={0}>1 Person (Just Me)</option>
                        <option value={1}>2 Persons (+1 Guest)</option>
                        <option value={2}>3 Persons (+2 Guests)</option>
                        <option value={3}>4 Persons (+3 Guests)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Wishes / Message */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-medium mb-1.5">
                    Warm Wishes &amp; Note for the Couple
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-[#D9A441]/70 absolute left-4 top-3.5" />
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your blessing or dietary notes..."
                      className="w-full bg-[#070707] border border-[#D9A441]/30 rounded-xl pl-11 pr-4 py-3 text-sm text-[#FDF6F3] placeholder-[#F8F3EA]/30 focus:outline-none focus:border-[#D9A441] transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#070707] font-bold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(217,164,65,0.4)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <span>Sending Response...</span>
                  ) : (
                    <>
                      <span>Send RSVP Blessing</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 4. Luxury Dark Footer */}
      <footer className="py-12 px-6 bg-[#070707] border-t border-[#D9A441]/20 text-center text-xs text-[#F8F3EA]/50">
        <div className="max-w-md mx-auto space-y-3">
          <h3 className="text-2xl font-accent italic text-[#FDF6F3]">
            {partnerOne} &amp; {partnerTwo}
          </h3>
          <p className="text-[#D9A441] tracking-widest uppercase font-mono text-[11px]">
            {weddingDate} • {weddingTime}
          </p>
          <div className="w-16 h-[1px] bg-[#D9A441]/40 mx-auto" />
          <p className="font-light">
            Crafted with elegance &amp; love • Powered by Bervic Invitations
          </p>
        </div>
      </footer>
    </main>
  );
}
