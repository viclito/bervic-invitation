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

const CardTemplate30: React.FC<CardProps> = ({
  partnerOne = 'Sophia',
  partnerTwo = 'Alexander',
  weddingDate = 'August 14, 2025',
  weddingTime = '4:00 PM',
  venue = 'The Grand Chapel',
  city = 'Bangalore, India',
  tagline = 'Together Forever',
  couplePhoto = '/images/templates/couple-photo.jpg',
  hashtag = '#ForeverTogether',
}) => {
  return (
    <div
      style={{ width: '1080px', height: '1080px', backgroundColor: '#0B0E14', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', boxSizing: 'border-box', color: '#E2E8F0' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');
        `}
      </style>

      {/* Starry Night / Moon SVG */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.6 }}
      >
        <circle cx="10%" cy="20%" r="1.5" fill="#E2E8F0" />
        <circle cx="25%" cy="15%" r="2.5" fill="#E2E8F0" opacity="0.8" />
        <circle cx="45%" cy="8%" r="1" fill="#E2E8F0" />
        <circle cx="80%" cy="25%" r="2" fill="#E2E8F0" opacity="0.6" />
        <circle cx="90%" cy="10%" r="1.5" fill="#E2E8F0" />
        <circle cx="15%" cy="80%" r="2" fill="#E2E8F0" />
        <circle cx="30%" cy="90%" r="1" fill="#E2E8F0" />
        <circle cx="85%" cy="85%" r="2.5" fill="#E2E8F0" opacity="0.7" />
        
        {/* Crescent Moon */}
        <path d="M 850,200 A 100,100 0 1,0 950,300 A 120,120 0 0,1 850,200 Z" fill="#E2E8F0" opacity="0.8" />
      </svg>

      <div style={{ textAlign: 'center', zIndex: 2, marginBottom: '50px' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '38px', fontWeight: 700, color: '#CBD5E1', margin: 0, letterSpacing: '4px' }}>
          {tagline}
        </p>
      </div>

      <div
        style={{ position: 'relative', width: '400px', height: '520px', margin: '0 0 60px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}
      >
        <div
          style={{ position: 'absolute', width: '104%', height: '104%', border: '2px solid rgba(226, 232, 240, 0.4)', borderRadius: '50%' }}
        />
        <div
          style={{ position: 'absolute', width: '110%', height: '110%', border: '1px solid rgba(226, 232, 240, 0.2)', borderRadius: '50%' }}
        />
        
        <div
          style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '4px solid #E2E8F0' }}
        >
          <img
            src={couplePhoto}
            alt="Couple"
            crossOrigin="anonymous"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', zIndex: 2, width: '100%' }}>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '86px', fontWeight: 600, margin: '0 0 30px 0', letterSpacing: '2px' }}>
          {partnerOne} <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: '66px' }}>&</span> {partnerTwo}
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#CBD5E1', letterSpacing: '3px', textTransform: 'uppercase' }}>
          <span>{weddingDate}</span>
          <span style={{ fontSize: '30px', fontWeight: 500 }}>✦</span>
          <span>{weddingTime}</span>
        </div>
        
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '30px', fontWeight: 600, color: '#CBD5E1', marginTop: '20px', letterSpacing: '2px' }}>
          {venue}, {city}
        </div>
        
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '30px', fontWeight: 500, color: '#94A3B8', marginTop: '40px', letterSpacing: '4px' }}>
          {hashtag}
        </div>
      </div>
    </div>
  );
};

export default CardTemplate30;
