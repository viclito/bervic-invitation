"use client";

import React, { useEffect, useRef } from "react";
import { MapPin, Navigation, ExternalLink, Phone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface VenueLocation {
  name: string;
  tag?: string;
  address: string;
  time?: string;
  mapUrl?: string;
  contact?: string;
}

export interface LocationsSectionProps {
  locations?: VenueLocation[];
  venuePlace?: string;
  contactAddress?: string;
  contactPhone?: string;
}

export default function LocationsSection({
  locations,
  venuePlace,
  contactAddress,
  contactPhone,
}: LocationsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const displayLocations: VenueLocation[] =
    locations && locations.length > 0
      ? locations
      : venuePlace || contactAddress
      ? [
          {
            name: venuePlace || "Wedding Venue",
            tag: "Celebration Venue",
            address: contactAddress || venuePlace || "Venue Address",
            mapUrl: `https://maps.google.com/?q=${encodeURIComponent(contactAddress || venuePlace || "")}`,
            contact: contactPhone,
          },
        ]
      : [];

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
        { opacity: 0, y: 35, scale: 0.97 },
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
  }, [displayLocations]);

  if (displayLocations.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="glowinn-section" id="locations">
      <div className="shell">
        {/* Section Header */}
        <div ref={headerRef} className="glowinn-section__header">
          <span className="glowinn-section__badge">
            <MapPin className="w-3.5 h-3.5" />
            <span>Getting There</span>
          </span>
          <h2 className="glowinn-section__title">Celebration Locations</h2>
          <p className="glowinn-section__subtitle">
            Find addresses, navigation routes, and concierge contacts for all events.
          </p>
        </div>

        {/* Location Cards */}
        <div ref={gridRef} className="glowinn-locations-grid">
          {displayLocations.map((loc, idx) => (
            <div key={idx} className="glowinn-glass-card glowinn-location-card">
              <div className="glowinn-location-card__head">
                {loc.tag && <span className="glowinn-location-card__tag">{loc.tag}</span>}
                {loc.time && <span className="glowinn-location-card__time">{loc.time}</span>}
              </div>

              <h3 className="glowinn-location-card__name">{loc.name}</h3>

              {loc.address && (
                <div className="glowinn-location-card__addr">
                  <MapPin className="w-4 h-4 text-[#f0b4c4] shrink-0 mt-0.5" />
                  <p>{loc.address}</p>
                </div>
              )}

              {loc.contact && loc.contact.trim() !== "" && !loc.contact.includes("98765 43210") && (
                <div className="glowinn-location-card__contact">
                  <Phone className="w-3.5 h-3.5 text-[#f0b4c4] shrink-0" />
                  <span>Concierge Assistance: {loc.contact}</span>
                </div>
              )}

              {loc.mapUrl && (
                <div className="glowinn-location-card__actions">
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glowinn-btn glowinn-btn--pearl w-full"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-auto" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
