"use client";

import React from "react";
import { Heart, ArrowUp } from "lucide-react";

export default function GlowinnFooter({
  coupleNames = "Aarav & Riya",
  coupleInitials = "A & R",
}: {
  coupleNames?: string;
  coupleInitials?: string;
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="glowinn-footer">
      <div className="shell text-center">
        <div className="glowinn-footer__monogram">{coupleInitials}</div>
        <h3 className="glowinn-footer__title">{coupleNames}</h3>
        <p className="glowinn-footer__tagline">
          Thank you for being an indispensable part of our story and celebration.
        </p>

        <div className="glowinn-footer__divider" />

        <div className="glowinn-footer__bottom">
          <p className="text-xs text-white/50">
            With love &amp; gratitude • December 18, 2026
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="glowinn-btn glowinn-btn--ink text-xs px-4 py-2 mt-4 inline-flex items-center gap-1.5"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
