import React from 'react';

interface CardProps {
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

export default function CardTemplate21({
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
      style={{ width: '1080px', height: '1080px', backgroundColor: '#F9F6F0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxSizing: 'border-box', padding: '60px' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap');
        `}
      </style>

      {/* Double-ruled border */}
      <div
        style={{ position: 'absolute', top: '40px', left: '40px', right: '40px', bottom: '40px', border: '2px solid #7A1F2B', pointerEvents: 'none' }}
      />
      <div
        style={{ position: 'absolute', top: '50px', left: '50px', right: '50px', bottom: '50px', border: '1px solid #7A1F2B', pointerEvents: 'none' }}
      />

      {/* Corner flourishes */}
      {[{ top: '35px', left: '35px', transform: 'none' },
        { top: '35px', right: '35px', transform: 'rotate(90deg)' },
        { bottom: '35px', right: '35px', transform: 'rotate(180deg)' },
        { bottom: '35px', left: '35px', transform: 'rotate(270deg)' }].map((pos, i) => (
        <svg
          key={i}
          width="40"
          height="40"
          viewBox="0 0 100 100"
          style={{ position: 'absolute', fill: 'none', stroke: '#7A1F2B', strokeWidth: 4, pointerEvents: 'none' }}
        >
          <path d="M0,20 Q20,20 20,0 M0,40 Q40,40 40,0 M0,60 Q60,60 60,0 M0,80 Q80,80 80,0" />
        </svg>
      ))}

      <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '30px', fontWeight: 600, letterSpacing: '6px', color: '#7A1F2B', textTransform: 'uppercase', marginBottom: '40px', marginTop: '-40px' }}>
        {tagline}
      </p>

      <div style={{ position: 'relative', width: '280px', height: '360px', marginBottom: '50px' }}>
        <img
          src={couplePhoto}
          alt="Couple"
          crossOrigin="anonymous"
          style={{ width: '100%', height: '100%', objectFit: 'cover', border: '3px solid #D4AF37', padding: '10px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', width: '100%' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '74px', fontWeight: '600', color: '#7A1F2B', margin: '0', fontStyle: 'italic', lineHeight: '1.1' }}>
          {partnerOne}
        </h1>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '44px', fontStyle: 'italic', color: '#D4AF37', margin: '2px 0' }}>&amp;</span>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '74px', fontWeight: '600', color: '#7A1F2B', margin: '0', fontStyle: 'italic', lineHeight: '1.1' }}>
          {partnerTwo}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginTop: '50px' }}>
        <div style={{ width: '100px', height: '1px', backgroundColor: '#7A1F2B' }} />
        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '32px', fontWeight: '400', color: '#7A1F2B', margin: '0', letterSpacing: '2px' }}>
          {weddingDate}
        </p>
        <div style={{ width: '100px', height: '1px', backgroundColor: '#7A1F2B' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '28px', fontWeight: 500, color: '#7A1F2B', margin: '0', letterSpacing: '1px' }}>
          {venue} | {city}
        </p>
        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '28px', fontWeight: 500, color: '#7A1F2B', margin: '0', letterSpacing: '1px' }}>
          {weddingTime}
        </p>
      </div>

      <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', fontWeight: 600, fontStyle: 'italic', color: '#D4AF37', margin: '30px 0 0 0' }}>
        {hashtag}
      </p>
    </div>
  );
}
