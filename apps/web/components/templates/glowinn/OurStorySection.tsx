"use client";

import React from "react";
import { Heart } from "lucide-react";

export interface StoryMilestone {
  year?: string;
  title?: string;
  description: string;
}

export interface OurStorySectionProps {
  loveStoryText?: string;
  story?: StoryMilestone[];
}

export default function OurStorySection({ loveStoryText, story }: OurStorySectionProps) {
  if (!loveStoryText && (!story || story.length === 0)) {
    return null;
  }

  return (
    <section className="glowinn-section" id="our-story">
      <div className="shell max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="glowinn-section__header">
          <span className="glowinn-section__badge">
            <Heart className="w-3.5 h-3.5 fill-[#f0b4c4] text-[#f0b4c4]" />
            <span>How It All Began</span>
          </span>
          <h2 className="glowinn-section__title">Our Story</h2>
          <p className="glowinn-section__subtitle">
            Every love story is special, and we are grateful to share our journey with you.
          </p>
        </div>

        {/* Story Content */}
        {loveStoryText ? (
          <div className="glowinn-glass-card glowinn-story-card text-center p-8">
            <p className="text-sm sm:text-base font-light text-white/90 leading-relaxed italic">
              &ldquo;{loveStoryText}&rdquo;
            </p>
          </div>
        ) : (
          <div className="glowinn-story-grid">
            {story?.map((milestone, idx) => (
              <div key={idx} className="glowinn-glass-card glowinn-story-card">
                {milestone.year && (
                  <span className="glowinn-story-card__year">{milestone.year}</span>
                )}
                {milestone.title && (
                  <h3 className="glowinn-story-card__title">{milestone.title}</h3>
                )}
                <p className="glowinn-story-card__desc">{milestone.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
