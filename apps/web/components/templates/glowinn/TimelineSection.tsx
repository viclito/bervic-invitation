"use client";

import React, { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface TimelineItem {
  time: string;
  title: string;
  description?: string;
  desc?: string;
  icon?: string;
}

export interface TimelineSectionProps {
  items?: TimelineItem[] | any[];
}

export default function TimelineSection({ items }: TimelineSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const displayItems: TimelineItem[] =
    items && items.length > 0
      ? items.map((it) => ({
          time: it.time || "Celebration Time",
          title: it.title || "Wedding Program",
          description: it.description || it.desc || "",
        }))
      : [];

  useEffect(() => {
    if (!timelineRef.current) return;
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
        timelineRef.current!.querySelectorAll(".glowinn-timeline__item"),
        { opacity: 0, x: -25 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [items]);

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="glowinn-section" id="timeline">
      <div className="shell max-w-3xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="glowinn-section__header">
          <span className="glowinn-section__badge">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Schedule of Events</span>
          </span>
          <h2 className="glowinn-section__title">Day Timeline</h2>
          <p className="glowinn-section__subtitle">
            A step-by-step itinerary to guide your celebration with us.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div ref={timelineRef} className="glowinn-timeline">
          <div className="glowinn-timeline__track" />

          {displayItems.map((item, idx) => (
            <div key={idx} className="glowinn-timeline__item">
              <div className="glowinn-timeline__node">
                <div className="glowinn-timeline__dot" />
              </div>

              <div className="glowinn-glass-card glowinn-timeline__card">
                <div className="glowinn-timeline__time-badge">{item.time}</div>
                <h4 className="glowinn-timeline__item-title">{item.title}</h4>
                {item.description && (
                  <p className="glowinn-timeline__item-desc">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
