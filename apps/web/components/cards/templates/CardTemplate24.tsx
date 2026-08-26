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

export default function CardTemplate24({
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
      style={{ width: '1080px', height: '1080px', backgroundColor: '#FAFAF7', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxSizing: 'border-box' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400;1,600&family=Jost:wght@300;400&display=swap');
        `}
      </style>

      {/* Botanical Border SVG */}
      <svg
        width="1000"
        height="1000"
        viewBox="0 0 1000 1000"
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <rect x="40" y="40" width="920" height="920" fill="none" stroke="#E4EBE4" strokeWidth="2" />
        <rect x="50" y="50" width="900" height="900" fill="none" stroke="#5C7658" strokeWidth="1" />
        
        {/* Simple decorative leaves in corners and centers */}
        <g stroke="#5C7658" fill="none" strokeWidth="2">
          {/* Top Left */}
          <path d="M50,150 C80,120 120,80 150,50" />
          <path d="M50,100 C70,90 90,70 100,50" />
          <path d="M50,200 C100,180 180,100 200,50" />
          
          {/* Top Right */}
          <path d="M950,150 C920,120 880,80 850,50" />
          <path d="M950,100 C930,90 910,70 900,50" />
          <path d="M950,200 C900,180 820,100 800,50" />
          
          {/* Bottom Left */}
          <path d="M50,850 C80,880 120,920 150,950" />
          <path d="M50,900 C70,910 90,930 100,950" />
          <path d="M50,800 C100,820 180,900 200,950" />
          
          {/* Bottom Right */}
          <path d="M950,850 C920,880 880,920 850,950" />
          <path d="M950,900 C930,910 910,930 900,950" />
          <path d="M950,800 C900,820 820,900 800,950" />
        </g>
        
        {/* Leaf details */}
        <g fill="#A3B19B" opacity="0.6">
          <ellipse cx="100" cy="100" rx="15" ry="5" transform="rotate(45 100 100)" />
          <ellipse cx="900" cy="100" rx="15" ry="5" transform="rotate(-45 900 100)" />
          <ellipse cx="100" cy="900" rx="15" ry="5" transform="rotate(-45 100 900)" />
          <ellipse cx="900" cy="900" rx="15" ry="5" transform="rotate(45 900 900)" />
        </g>
      </svg>

      <p style={{ fontFamily: '"Jost", sans-serif', fontSize: '28px', fontWeight: 600, letterSpacing: '6px', color: '#5C7658', textTransform: 'uppercase', marginBottom: '40px', zIndex: 1 }}>
        {tagline}
      </p>

      {/* Oval Photo */}
      <div
        style={{ width: '260px', height: '340px', marginBottom: '50px', borderRadius: '50%', border: '4px solid #E4EBE4', padding: '8px', boxSizing: 'border-box', zIndex: 1 }}
      >
        <img
          src={couplePhoto}
          alt="Couple"
          crossOrigin="anonymous"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', zIndex: 1, width: '100%' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '74px', fontStyle: 'italic', color: '#334433', margin: '0', lineHeight: '1.1' }}>
          {partnerOne}
        </h1>
        <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '44px', fontStyle: 'italic', color: '#5C7658', margin: '2px 0' }}>&amp;</span>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '74px', fontStyle: 'italic', color: '#334433', margin: '0', lineHeight: '1.1' }}>
          {partnerTwo}
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px', zIndex: 1, gap: '10px' }}>
        <p style={{ fontFamily: '"Jost", sans-serif', fontSize: '32px', fontWeight: '400', color: '#334433', margin: '0', letterSpacing: '2px' }}>
          {weddingDate}
        </p>
        <p style={{ fontFamily: '"Jost", sans-serif', fontSize: '28px', fontWeight: '300', color: '#5C7658', margin: '0', letterSpacing: '1px' }}>
          {venue} &bull; {city} &bull; {weddingTime}
        </p>
      </div>

      <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '32px', fontWeight: 600, color: '#334433', margin: '40px 0 0 0', zIndex: 1 }}>
        {hashtag}
      </p>
    </div>
  );
}
