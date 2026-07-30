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

export default function CardTemplate22({
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
      style={{
        width: '1080px',
        height: '1080px',
        backgroundColor: '#F0F4EC',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&display=swap');
        `}
      </style>

      {/* Archway Frame */}
      <svg
        width="900"
        height="950"
        viewBox="0 0 900 950"
        style={{ position: 'absolute', top: '65px', pointerEvents: 'none' }}
      >
        <path d="M50,950 L50,450 A400,400 0 0,1 850,450 L850,950" fill="none" stroke="#2D4A3E" strokeWidth="2" />
        <path d="M80,950 L80,450 A370,370 0 0,1 820,450 L820,950" fill="none" stroke="#2D4A3E" strokeWidth="1" strokeDasharray="5,5" />
        
        {/* Vines */}
        <path d="M50,450 C30,400 80,350 40,300 C70,250 20,200 60,150" fill="none" stroke="#5C7658" strokeWidth="3" />
        <path d="M850,450 C870,400 820,350 860,300 C830,250 880,200 840,150" fill="none" stroke="#5C7658" strokeWidth="3" />
        
        {/* Leaves */}
        <ellipse cx="45" cy="400" rx="8" ry="4" transform="rotate(45 45 400)" fill="#789A74" />
        <ellipse cx="65" cy="350" rx="10" ry="5" transform="rotate(-30 65 350)" fill="#789A74" />
        <ellipse cx="40" cy="250" rx="9" ry="4" transform="rotate(20 40 250)" fill="#789A74" />
        <ellipse cx="855" cy="400" rx="8" ry="4" transform="rotate(-45 855 400)" fill="#789A74" />
        <ellipse cx="835" cy="350" rx="10" ry="5" transform="rotate(30 835 350)" fill="#789A74" />
        <ellipse cx="860" cy="250" rx="9" ry="4" transform="rotate(-20 860 250)" fill="#789A74" />
      </svg>

      <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '20px', letterSpacing: '4px', color: '#2D4A3E', textTransform: 'uppercase', marginBottom: '40px', marginTop: '-80px', zIndex: 1 }}>
        {tagline}
      </p>

      {/* Arch Photo Mask */}
      <div
        style={{
          width: '300px',
          height: '420px',
          marginBottom: '50px',
          clipPath: 'path("M0,420 L0,150 A150,150 0 0,1 300,150 L300,420 Z")',
          WebkitClipPath: 'path("M0,420 L0,150 A150,150 0 0,1 300,150 L300,420 Z")',
          border: '2px solid #2D4A3E',
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
        <img
          src={couplePhoto}
          alt="Couple"
          crossOrigin="anonymous"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', zIndex: 1, width: '100%' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '54px', fontWeight: '400', color: '#2D4A3E', margin: '0', lineHeight: '1.1', textAlign: 'center' }}>
          {partnerOne}
        </h1>
        <span style={{ fontSize: '36px', fontStyle: 'italic', color: '#5C7658', margin: '2px 0' }}>&amp;</span>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '54px', fontWeight: '400', color: '#2D4A3E', margin: '0', lineHeight: '1.1', textAlign: 'center' }}>
          {partnerTwo}
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px', zIndex: 1, gap: '12px' }}>
        <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '22px', fontWeight: '300', color: '#2D4A3E', margin: '0', letterSpacing: '2px' }}>
          {weddingDate} | {weddingTime}
        </p>
        <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '20px', fontWeight: '400', color: '#2D4A3E', margin: '0', letterSpacing: '1px' }}>
          {venue}, {city}
        </p>
      </div>

      <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '22px', fontStyle: 'italic', color: '#5C7658', margin: '30px 0 0 0', zIndex: 1 }}>
        {hashtag}
      </p>
    </div>
  );
}
