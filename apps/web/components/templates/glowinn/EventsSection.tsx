"use client";

import React, { useEffect, useRef } from "react";
import { Clock, Calendar, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface EventItem {
  id?: string;
  title: string;
  subtitle?: string;
  date?: string;
  time?: string;
  location?: string;
  address?: string;
  description?: string;
  attire?: string;
  icon?: string;
}

export interface EventsSectionProps {
  events?: EventItem[] | any[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      gsap.fromTo(
        gridRef.current!.children,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [events]);

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="glowinn-section" id="events">
      <div className="shell">
        {/* Section Header */}
        <div ref={headerRef} className="glowinn-section__header">
          <span className="glowinn-section__badge">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Itinerary of Celebrations</span>
          </span>
          <h2 className="glowinn-section__title">Wedding Celebrations</h2>
          <p className="glowinn-section__subtitle">
            Join us in honor of these special ceremonies and festivities.
          </p>
        </div>

        {/* Dynamic Events Cards Grid */}
        <div ref={gridRef} className="glowinn-events-grid">
          {events.map((evt, idx) => (
            <div key={evt.id || idx} className="glowinn-glass-card glowinn-event-card">
              <div className="glowinn-event-card__header">
                <span className="glowinn-event-card__step">
                  {evt.icon || `Event 0${idx + 1}`}
                </span>
                {evt.date && <span className="glowinn-event-card__date">{evt.date}</span>}
              </div>

              <h3 className="glowinn-event-card__title">{evt.title}</h3>
              {evt.subtitle && <p className="glowinn-event-card__sub">{evt.subtitle}</p>}

              {evt.description && <p className="glowinn-event-card__desc">{evt.description}</p>}

              <div className="glowinn-event-card__details">
                {evt.time && (
                  <div className="glowinn-event-detail-item">
                    <Clock className="w-4 h-4 text-[#f0b4c4] shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                )}
                {evt.date && (
                  <div className="glowinn-event-detail-item">
                    <Calendar className="w-4 h-4 text-[#f0b4c4] shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                )}
              </div>

              {evt.attire && (
                <div className="glowinn-event-card__attire">
                  <span className="text-[11px] font-medium text-white/50">Dress Code:</span>
                  <span className="text-xs font-medium text-[#f0b4c4]">{evt.attire}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
