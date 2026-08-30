"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, CheckCircle2, Heart, Sparkles, MessageSquareHeart } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface RsvpSectionProps {
  defaultGuestName?: string;
  onRsvpSubmit?: (data: { name: string; attending: string; guests: string; note: string }) => void;
}

const QUICK_BLESSINGS = [
  "Wishing you a lifetime of endless joy & love! ✨",
  "May your bond grow deeper with every sunrise 🌸",
  "Sending heartfelt congratulations & blessings! 🥂",
  "So thrilled to celebrate your special day! ❤️",
];

export default function RsvpSection({ defaultGuestName, onRsvpSubmit }: RsvpSectionProps) {
  const [name, setName] = useState(defaultGuestName || "");
  const [attending, setAttending] = useState("yes");
  const [guests, setGuests] = useState("1");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (defaultGuestName && !name) {
      setName(defaultGuestName);
    }
  }, [defaultGuestName]);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 35, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (onRsvpSubmit) {
      onRsvpSubmit({ name, attending, guests, note });
    }
    setSubmitted(true);
  };

  return (
    <section ref={sectionRef} className="glowinn-section" id="rsvp">
      <div className="shell max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="glowinn-section__header">
          <span className="glowinn-section__badge">
            <Heart className="w-3.5 h-3.5 fill-[#f0b4c4] text-[#f0b4c4]" />
            <span>Honored Presence</span>
          </span>
          <h2 className="glowinn-section__title">Will You Join Us?</h2>
          <p className="glowinn-section__subtitle">
            Please respond with your blessings and confirmation so we can reserve your seat.
          </p>
        </div>

        {/* Glass Card Form */}
        <div ref={cardRef} className="glowinn-glass-card glowinn-rsvp-card">
          {submitted ? (
            <div className="glowinn-rsvp-success">
              <div className="glowinn-rsvp-success__icon">
                <CheckCircle2 className="w-10 h-10 text-[#f0b4c4]" />
              </div>
              <h3 className="glowinn-rsvp-success__title">Thank You, {name}!</h3>
              <p className="glowinn-rsvp-success__desc">
                Your response has been registered. We are deeply touched by your love and cannot wait to celebrate together!
              </p>
              <button
                type="button"
                className="glowinn-btn glowinn-btn--ink mt-6"
                onClick={() => {
                  setSubmitted(false);
                  setName("");
                  setNote("");
                }}
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glowinn-rsvp-form">
              {/* Full Name */}
              <div className="glowinn-form-group">
                <label className="glowinn-form-label" htmlFor="rsvp-name">
                  Your Full Name *
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  placeholder="e.g. Aditi Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glowinn-form-input"
                />
              </div>

              {/* Attendance Options */}
              <div className="glowinn-form-group">
                <label className="glowinn-form-label">Will you be attending?</label>
                <div className="glowinn-rsvp-options">
                  <button
                    type="button"
                    className={`glowinn-rsvp-opt ${attending === "yes" ? "is-selected" : ""}`}
                    onClick={() => setAttending("yes")}
                  >
                    🎉 Joyfully Accept
                  </button>
                  <button
                    type="button"
                    className={`glowinn-rsvp-opt ${attending === "no" ? "is-selected" : ""}`}
                    onClick={() => setAttending("no")}
                  >
                    💌 Regretfully Decline
                  </button>
                </div>
              </div>

              {/* Number of Guests */}
              {attending === "yes" && (
                <div className="glowinn-form-group">
                  <label className="glowinn-form-label" htmlFor="rsvp-guests">
                    Number of Guests Attending
                  </label>
                  <select
                    id="rsvp-guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="glowinn-form-input"
                  >
                    <option value="1">1 Person (Just Me)</option>
                    <option value="2">2 Persons (Couple)</option>
                    <option value="3">3 Persons</option>
                    <option value="4">4 Persons</option>
                    <option value="5+">5+ Family Members</option>
                  </select>
                </div>
              )}

              {/* Warm Wishes & Blessings */}
              <div className="glowinn-form-group">
                <label className="glowinn-form-label" htmlFor="rsvp-note">
                  Warm Wishes & Message for the Couple
                </label>
                <textarea
                  id="rsvp-note"
                  rows={3}
                  placeholder="Write your blessing or message..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="glowinn-form-input resize-none"
                />

                {/* Quick blessings suggestions */}
                <div className="glowinn-blessings-chips">
                  {QUICK_BLESSINGS.map((blessing, i) => (
                    <button
                      key={i}
                      type="button"
                      className="glowinn-blessing-chip"
                      onClick={() => setNote((prev) => (prev ? `${prev} ${blessing}` : blessing))}
                    >
                      {blessing}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="glowinn-btn glowinn-btn--pearl w-full mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Send RSVP & Blessings</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
