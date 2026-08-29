import React, { useState, useEffect } from 'react';
import { MenuIcon } from './icons';
import './Navbar.css';

const LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Our Day', href: '#our-day' },
  { label: 'Events', href: '#events' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Our Story', href: '#our-story' },
  { label: 'Locations', href: '#locations' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'RSVP', href: '#rsvp' },
];

export default function Navbar({
  coupleNames = 'Aarav & Riya',
  coupleInitials = 'A & R',
}) {
  const [active, setActive] = useState('Home');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner shell">
        {/* 1. LEFT: BRAND MONOGRAM */}
        <div className="nav__left">
          <a
            className="nav__brand"
            href="#top"
            onClick={() => {
              setActive('Home');
              setOpen(false);
            }}
          >
            <div className="nav__monogram">{coupleInitials}</div>
            <span className="nav__brand-title">{coupleNames}</span>
          </a>
        </div>

        {/* 2. CENTER: NAVIGATION RAIL */}
        <nav className="nav__rail" aria-label="Primary">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={active === label ? 'is-active' : ''}
              onClick={() => setActive(label)}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* 3. RIGHT: RSVP QUICK ACTION & MOBILE TOGGLE */}
        <div className="nav__right">
          <a href="#rsvp" className="nav__rsvp-btn">
            <span>RSVP</span>
          </a>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((prev) => !prev)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {/* MOBILE SHEET */}
      {open && (
        <div className="nav__sheet">
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
