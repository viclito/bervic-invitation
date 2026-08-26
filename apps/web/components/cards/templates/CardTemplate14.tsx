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

export default function CardTemplate14({
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
      style={{ width: '1080px', height: '1080px', backgroundColor: '#FDFBF7', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Raleway:wght@300;400;500&display=swap');
        `}
      </style>

      {/* Elaborate Double Floral Border Frame SVG */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 1080 1080"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Frame */}
        <rect x="40" y="40" width="1000" height="1000" fill="none" stroke="#B76E79" strokeWidth="2" opacity="0.8" />
        <rect x="55" y="55" width="970" height="970" fill="none" stroke="#B76E79" strokeWidth="1" opacity="0.4" />
        
        {/* Corner Floral Ornaments */}
        <g stroke="#5A2A38" fill="none" strokeWidth="1.5" opacity="0.6">
          {/* Top Left */}
          <path d="M 40,120 Q 80,120 120,80 Q 120,40 120,40" />
          <circle cx="80" cy="80" r="10" fill="#B76E79" opacity="0.3" />
          {/* Top Right */}
          <path d="M 960,40 Q 960,80 1000,120 Q 1040,120 1040,120" />
          <circle cx="1000" cy="80" r="10" fill="#B76E79" opacity="0.3" />
          {/* Bottom Left */}
          <path d="M 40,960 Q 80,960 120,1000 Q 120,1040 120,1040" />
          <circle cx="80" cy="1000" r="10" fill="#B76E79" opacity="0.3" />
          {/* Bottom Right */}
          <path d="M 1040,960 Q 1000,960 960,1000 Q 960,1040 960,1040" />
          <circle cx="1000" cy="1000" r="10" fill="#B76E79" opacity="0.3" />
        </g>
      </svg>

      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 80px' }}>
        
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '28px', letterSpacing: '6px', fontWeight: 600, color: '#B76E79', textTransform: 'uppercase', marginBottom: '40px' }}>
          {tagline}
        </p>

        {/* Inset Photo Rectangle */}
        <div style={{ padding: '8px', border: '1px solid #B76E79', marginBottom: '40px', backgroundColor: '#FFFFFF' }}>
          <div style={{ width: '320px', height: '320px', position: 'relative' }}>
            <img
              src={couplePhoto}
              alt="Couple"
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Names */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', marginBottom: '24px', width: '100%' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '76px', fontStyle: 'italic', color: '#5A2A38', margin: 0, fontWeight: 400, lineHeight: 1.1 }}>{partnerOne}</h1>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontStyle: 'normal', fontSize: '44px', color: '#B76E79', margin: '2px 0' }}>&amp;</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '76px', fontStyle: 'italic', color: '#5A2A38', margin: 0, fontWeight: 400, lineHeight: 1.1 }}>{partnerTwo}</h1>
        </div>

        <div style={{ width: '150px', height: '1px', backgroundColor: '#5A2A38', opacity: 0.3, marginBottom: '30px' }}></div>

        {/* Details */}
        <div style={{ fontFamily: "'Raleway', sans-serif", color: '#333333', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ fontSize: '34px', fontWeight: 400, letterSpacing: '3px', color: '#5A2A38' }}>
            {weddingDate}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '2px' }}>
            {weddingTime}
          </div>
          <div style={{ fontSize: '32px', fontWeight: 400, letterSpacing: '1px', marginTop: '10px' }}>
            {venue}
          </div>
          <div style={{ fontSize: '26px', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '4px', color: '#666666' }}>
            {city}
          </div>
        </div>

        <div style={{ marginTop: '50px' }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: '26px', fontWeight: 500, color: '#B76E79', letterSpacing: '5px' }}>
            {hashtag}
          </p>
        </div>

      </div>
    </div>
  );
}
