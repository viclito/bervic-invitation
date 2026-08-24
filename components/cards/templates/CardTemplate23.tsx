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

export default function CardTemplate23({
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
      style={{ width: '1080px', height: '1080px', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Montserrat:wght@300;400;500&display=swap');
        `}
      </style>

      {/* Background Image */}
      <img
        src={couplePhoto}
        alt="Couple"
        crossOrigin="anonymous"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />

      {/* Gradient Overlay */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.85) 100%)', zIndex: 1 }}
      />

      {/* Content */}
      <div
        style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', padding: '80px', boxSizing: 'border-box' }}
      >
        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '28px', fontWeight: 600, letterSpacing: '4px', color: '#D4AF37', textTransform: 'uppercase', marginBottom: '30px' }}>
          {tagline}
        </p>

        <h1 style={{ fontFamily: '"Dancing Script", cursive', fontSize: '114px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 40px 0', textAlign: 'center', lineHeight: '1.2', textShadow: '2px 4px 10px rgba(0,0,0,0.5)' }}>
          {partnerOne} <br />
          <span style={{ fontSize: '74px', fontWeight: 800, color: '#D4AF37' }}>&</span> <br />
          {partnerTwo}
        </h1>

        <div style={{ width: '80%', height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: '40px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '34px', fontWeight: '500', color: '#FFFFFF', margin: '0', letterSpacing: '2px' }}>
            {weddingDate} AT {weddingTime}
          </p>
          <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '30px', fontWeight: '300', color: '#E0E0E0', margin: '0', letterSpacing: '1px' }}>
            {venue}, {city}
          </p>
        </div>

        <p style={{ fontFamily: '"Montserrat", sans-serif', fontSize: '28px', fontWeight: 600, color: '#D4AF37', margin: '40px 0 0 0', letterSpacing: '1px' }}>
          {hashtag}
        </p>
      </div>
    </div>
  );
}
