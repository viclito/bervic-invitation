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
  invitationId?: string;
  slug?: string;
  templateSlug?: string;
  coupleInitials?: string;
  partnerOne?: string;
  partnerTwo?: string;
  tagline?: string;
  inviteLine?: string;
  weddingDate?: string;
  weddingTime?: string;
  coupleImage?: string;
  partnerTwoImage?: string;
  events?: EventItem[];
  locations?: LocationItem[];
  galleryImages?: string[];
  guestName?: string;
  guestPhone?: string;
  contactPhone?: string;
  contactAddress?: string;
}

export default function ScrollScrubberTemplate({
  invitationId,
  slug,
  templateSlug = "scroll-scrubber",
  partnerOne = "Your Name",
  partnerTwo = "Partner Name",
  tagline = "TOGETHER WITH THEIR FAMILIES",
  inviteLine = "Request the honor of your presence at the celebration of their holy matrimony",
  weddingDate = "December 18, 2026",
  weddingTime = "4:00 PM Onwards",
  coupleImage = "/images/templates/groom-bride-1.jpg",
  partnerTwoImage = "/images/templates/groom-bride-2.jpg",
  contactPhone,
  contactAddress,
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
    "/images/templates/groom-bride-1.jpg",
    "/images/templates/groom-bride-2.jpg",
    "/images/templates/gallery-1.jpg",
    "/images/templates/gallery-2.jpg",
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
      const urlSlug = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : undefined;
      const activeSlug = slug || (urlSlug && urlSlug !== "scroll-scrubber" && urlSlug !== "customize" && urlSlug !== "templates" ? urlSlug : undefined);
      const targetIdentifier = activeSlug || invitationId || templateSlug;

      const res = await fetch(`/api/invitations/${targetIdentifier}/rsvp`, {
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

      const resData = await res.json();
      if (!res.ok) {
        setErrorMessage(resData.error || "Failed to submit RSVP response.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setErrorMessage("Network error. Please try submitting your response again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-full bg-[#070707] text-[#F8F3EA] min-h-screen selection:bg-[#D9A441] selection:text-[#070707]">
      {/* 1. Scroll-Scrubbing Canvas Section (480 Frames + Top-Aligned Text Overlay) */}
      <ScrollScrubberCanvas
        partnerOne={partnerOne}
        partnerTwo={partnerTwo}
        tagline={tagline}
        inviteLine={inviteLine}
        weddingDate={weddingDate}
        weddingTime={weddingTime}
        groomImage={coupleImage}
        brideImage={partnerTwoImage}
        events={events}
        locations={locations}
        galleryImages={galleryImages}
        guestName={guestName}
        contactPhone={contactPhone}
        contactAddress={contactAddress}
        onExploreClick={scrollToRsvp}
      />

      {/* 2. Interactive Luxury RSVP Form */}
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
                        <option value={4}>5 Persons (+4 Guests)</option>
                        <option value={5}>6 Persons (+5 Guests)</option>
                        <option value={6}>7 Persons (+6 Guests)</option>
                        <option value={7}>8 Persons (+7 Guests)</option>
                        <option value={8}>9 Persons (+8 Guests)</option>
                        <option value={9}>10 Persons (+9 Guests)</option>
                        <option value={10}>11+ Persons (Large Family)</option>
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

      {/* 5. Luxury Dark Footer */}
      <footer className="py-12 px-6 bg-[#070707] border-t border-[#D9A441]/20 text-center text-xs text-[#F8F3EA]/50">
        <div className="max-w-md mx-auto space-y-3">
          <h3 className="text-2xl font-accent italic text-[#FDF6F3]">
            {partnerOne} &amp; {partnerTwo}
          </h3>
          <p className="text-[#D9A441] tracking-widest uppercase font-mono text-[11px]">
            {weddingTime || weddingDate}
          </p>

          {(contactPhone || contactAddress) && (
            <div className="pt-2 flex flex-col items-center gap-1.5">
              {contactPhone && (
                <a
                  href={`tel:${contactPhone}`}
                  className="text-xs text-[#D9A441] font-mono font-bold flex items-center justify-center gap-2 bg-[#121212] px-4 py-1.5 rounded-full border border-[#D9A441]/40 shadow-sm hover:scale-105 transition-transform"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>RSVP &amp; Inquiries: {contactPhone}</span>
                </a>
              )}
              {contactAddress && (
                <p className="text-[11px] text-[#F8F3EA]/70 italic">
                  {contactAddress}
                </p>
              )}
            </div>
          )}

          <div className="w-16 h-[1px] bg-[#D9A441]/40 mx-auto" />
          <p className="font-light">
            Crafted with elegance &amp; love • Powered by Bervic Invitations
          </p>
        </div>
      </footer>
    </main>
  );
}
