import React from 'react';

export interface CardProps {
  partnerOne?: string;
  partnerTwo?: string;
  weddingDate?: string;
  weddingTime?: string;
  venue?: string;
  city?: string;
  tagline?: string;
  couplePhoto?: string;
  hashtag?: string;
}

export default function CardTemplate13({
  partnerOne = 'Sophia',
  partnerTwo = 'Alexander',
  weddingDate = 'August 14, 2025',
  weddingTime = '4:00 PM',
  venue = 'The Grand Chapel',
  city = 'Bangalore, India',
  tagline = 'Together Forever',
  couplePhoto = '/images/templates/couple-photo.jpg',
  hashtag = '#ForeverTogether',
}: CardProps) {
  return (
    <div
      style={{ width: '1080px', height: '1080px', backgroundColor: '#D8C3A5', // Warm wood/cork texture color
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1%, transparent 20%), radial-gradient(circle, rgba(0,0,0,0.05) 1%, transparent 20%)', backgroundSize: '10px 10px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Permanent+Marker&family=Shadows+Into+Light&display=swap');
        `}
      </style>

      {/* Scattered Elements (Background decoration) */}
      <div style={{ position: 'absolute', top: '100px', left: '100px', fontFamily: "'Shadows Into Light', cursive", fontSize: '36px', color: 'rgba(0,0,0,0.3)', transform: 'rotate(-15deg)' }}>
        {tagline}
      </div>
      <div style={{ position: 'absolute', bottom: '150px', right: '150px', fontFamily: "'Shadows Into Light', cursive", fontSize: '32px', color: 'rgba(0,0,0,0.3)', transform: 'rotate(10deg)' }}>
        {hashtag}
      </div>

      {/* Polaroid Container */}
      <div
        style={{ width: '640px', height: '740px', backgroundColor: '#F9F9F9', transform: 'rotate(-3deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.1)', padding: '30px 30px 100px 30px', display: 'flex', flexDirection: 'column', position: 'relative' }}
      >
        {/* Vintage Tape SVG */}
        <svg
          style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%) rotate(-5deg)', width: '150px', height: '40px', zIndex: 10 }}
          viewBox="0 0 150 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" y="5" width="150" height="30" fill="rgba(255, 248, 220, 0.7)" filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.1))" />
          <path d="M 0,5 L 5,10 L 0,15 L 5,20 L 0,25 L 5,30 L 0,35" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
          <path d="M 150,5 L 145,10 L 150,15 L 145,20 L 150,25 L 145,30 L 150,35" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        </svg>

        {/* Polaroid Photo Slot */}
        <div
          style={{ width: '580px', height: '520px', backgroundColor: '#222222', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)', overflow: 'hidden' }}
        >
          <img
            src={couplePhoto}
            alt="Couple"
            crossOrigin="anonymous"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(20%) contrast(1.1) saturate(0.9)' }}
          />
        </div>

        {/* Handwritten Text on Margin */}
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '76px', color: '#222222', margin: '10px 0 0 0', fontWeight: 600, lineHeight: 1 }}>
            {partnerOne} <span style={{ fontSize: '48px', fontStyle: 'italic', opacity: 0.7 }}>&amp;</span> {partnerTwo}
          </h1>
          <p style={{ fontFamily: "'Shadows Into Light', cursive", fontSize: '36px', fontWeight: 600, color: '#444444', margin: '5px 0 0 0' }}>
            {weddingDate} • {weddingTime}
          </p>
          <p style={{ fontFamily: "'Shadows Into Light', cursive", fontSize: '30px', fontWeight: 600, color: '#555555', margin: '5px 0 0 0' }}>
            {venue}, {city}
          </p>
        </div>
      </div>
    </div>
  );
}
