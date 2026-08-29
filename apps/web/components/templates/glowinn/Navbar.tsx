"use client";

import React, { useState, useEffect } from "react";
import { MenuIcon } from "./icons";
import { Heart } from "lucide-react";
import "./Navbar.css";

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "Our Day", href: "#our-day" },
  { label: "Events", href: "#events" },
  { label: "Timeline", href: "#timeline" },
  { label: "Our Story", href: "#our-story" },
  { label: "Locations", href: "#locations" },
  { label: "Gallery", href: "#gallery" },
  { label: "RSVP", href: "#rsvp" },
];

export interface NavbarProps {
  coupleNames?: string;
  coupleInitials?: string;
}

export default function Navbar({
  coupleNames = "Aarav & Riya",
  coupleInitials = "A & R",
}: NavbarProps) {
  const [active, setActive] = useState("Home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`glowinn-nav ${scrolled ? "glowinn-nav--scrolled" : ""}`}>
      <div className="glowinn-nav__inner shell">
        {/* 1. LEFT: BRAND MONOGRAM */}
        <div className="glowinn-nav__left">
          <a
            className="glowinn-nav__brand"
            href="#top"
            onClick={() => {
              setActive("Home");
              setOpen(false);
            }}
          >
            <div className="glowinn-nav__monogram">{coupleInitials}</div>
            <span className="glowinn-nav__brand-title">{coupleNames}</span>
          </a>
        </div>

        {/* 2. CENTER: NAVIGATION RAIL */}
        <nav className="glowinn-nav__rail" aria-label="Primary">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={active === label ? "is-active" : ""}
              onClick={() => setActive(label)}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* 3. RIGHT: QUICK RSVP PILL & MOBILE TOGGLE */}
        <div className="glowinn-nav__right">
          <a href="#rsvp" className="glowinn-nav__rsvp-btn">
            <Heart className="w-3.5 h-3.5 fill-[#f0b4c4] text-[#f0b4c4]" />
            <span>RSVP</span>
          </a>

          <button
            type="button"
            className="glowinn-nav__toggle"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((prev) => !prev)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {/* MOBILE SHEET */}
      {open && (
        <div className="glowinn-nav__sheet">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => {
                setActive(label);
                setOpen(false);
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
