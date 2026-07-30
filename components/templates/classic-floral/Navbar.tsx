"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";

interface NavbarProps {
  coupleInitials: string;
  isCustomizer?: boolean;
}

export default function Navbar({ coupleInitials, isCustomizer }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${
        isCustomizer ? "sticky top-0 z-10" : "fixed top-0 left-0 right-0 z-40"
      } transition-all duration-300 ${
        scrolled || isCustomizer
          ? "bg-[#FDF6F3]/95 backdrop-blur-md py-3 shadow-sm border-b border-[#C9A15A]/20 text-[#2B2320]"
          : "bg-transparent py-5 text-[#2B2320]"
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Monogram Badge */}
        <Link href="#hero" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-[#B85C6B] text-[#FDF6F3] flex items-center justify-center font-accent font-bold text-sm tracking-wider shadow-md group-hover:scale-105 transition-transform border border-[#C9A15A]">
            {coupleInitials}
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium tracking-wide">
          <Link href="#hero" className="hover:text-[#B85C6B] transition-colors">
            Home
          </Link>
          <Link href="#countdown" className="hover:text-[#B85C6B] transition-colors">
            Our Day
          </Link>
          <Link href="#events" className="hover:text-[#B85C6B] transition-colors">
            Events
          </Link>
          <Link href="#timeline" className="hover:text-[#B85C6B] transition-colors">
            Timeline
          </Link>
          <Link href="#story" className="hover:text-[#B85C6B] transition-colors">
            Our Story
          </Link>
          <Link href="#locations" className="hover:text-[#B85C6B] transition-colors">
            Locations
          </Link>
          <Link href="#gallery" className="hover:text-[#B85C6B] transition-colors">
            Gallery
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="#hero"
            className="px-4 py-2 rounded-full bg-[#B85C6B] text-[#FDF6F3] text-xs font-semibold hover:bg-[#a04b5a] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-[#C9A15A]" />
            <span>Save the Date</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#2B2320] focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#B85C6B]" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-[65px] bg-[#FDF6F3]/98 backdrop-blur-xl border-b border-[#C9A15A]/20 p-6 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <Link href="#hero" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#C9A15A]/10">
              Home
            </Link>
            <Link href="#countdown" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#C9A15A]/10">
              Our Big Day
            </Link>
            <Link href="#events" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#C9A15A]/10">
              Wedding Events
            </Link>
            <Link href="#timeline" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#C9A15A]/10">
              Timeline Schedule
            </Link>
            <Link href="#story" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#C9A15A]/10">
              Our Love Story
            </Link>
            <Link href="#locations" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#C9A15A]/10">
              Venues & Directions
            </Link>
            <Link href="#gallery" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#C9A15A]/10">
              Moments Gallery
            </Link>

            <Link
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 bg-[#B85C6B] text-[#FDF6F3] rounded-full text-center text-xs font-semibold flex items-center justify-center gap-2 mt-2"
            >
              <Heart className="w-4 h-4 fill-current text-[#C9A15A]" />
              <span>Save the Date</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
