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

export default function CardTemplate26({
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
        backgroundColor: '#FFF9F5',
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
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Raleway:wght@300;400&display=swap');
        `}
      </style>

      {/* Circular Floral Ring SVG */}
      <svg
        width="800"
        height="800"
        viewBox="0 0 800 800"
        style={{ position: 'absolute', top: '140px', pointerEvents: 'none', zIndex: 0 }}
      >
        <circle cx="400" cy="400" r="380" fill="none" stroke="#F4D3CC" strokeWidth="2" strokeDasharray="10 5" />
        <circle cx="400" cy="400" r="360" fill="none" stroke="#E6B8B0" strokeWidth="1" />
        
        <g opacity="0.8">
          {/* Top floral cluster */}
          <circle cx="400" cy="40" r="30" fill="#FFCDB2" />
          <circle cx="370" cy="50" r="20" fill="#FFB4A2" />
          <circle cx="430" cy="50" r="25" fill="#E5989B" />
          <circle cx="400" cy="40" r="15" fill="#B56576" />
          
          {/* Bottom floral cluster */}
          <circle cx="400" cy="760" r="35" fill="#FFB4A2" />
          <circle cx="360" cy="745" r="25" fill="#E5989B" />
          <circle cx="440" cy="745" r="20" fill="#FFCDB2" />
          <circle cx="400" cy="760" r="15" fill="#B56576" />
          
          {/* Left floral cluster */}
          <circle cx="40" cy="400" r="25" fill="#E5989B" />
          <circle cx="55" cy="370" r="20" fill="#FFCDB2" />
          <circle cx="55" cy="430" r="15" fill="#FFB4A2" />
          
          {/* Right floral cluster */}
          <circle cx="760" cy="400" r="25" fill="#FFCDB2" />
          <circle cx="745" cy="360" r="15" fill="#FFB4A2" />
          <circle cx="745" cy="440" r="20" fill="#E5989B" />
        </g>
      </svg>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontFamily: '"Raleway", sans-serif', fontSize: '18px', letterSpacing: '4px', color: '#6B2D3E', textTransform: 'uppercase', marginBottom: '30px' }}>
          {tagline}
        </p>

        {/* Embedded Photo */}
        <div
          style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            overflow: 'hidden',
            marginBottom: '40px',
            border: '6px solid #FFF',
            boxShadow: '0 8px 24px rgba(107, 45, 62, 0.15)'
          }}
        >
          <img
            src={couplePhoto}
            alt="Couple"
            crossOrigin="anonymous"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '54px', fontWeight: '400', color: '#6B2D3E', margin: '0', textAlign: 'center', lineHeight: '1.1' }}>
            {partnerOne}
          </h1>
          <span style={{ fontSize: '36px', fontStyle: 'italic', color: '#E5989B', margin: '2px 0' }}>&amp;</span>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '54px', fontWeight: '400', color: '#6B2D3E', margin: '0', textAlign: 'center', lineHeight: '1.1' }}>
            {partnerTwo}
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
          <p style={{ fontFamily: '"Raleway", sans-serif', fontSize: '22px', fontWeight: '400', color: '#6B2D3E', margin: '0', letterSpacing: '2px' }}>
            {weddingDate} | {weddingTime}
          </p>
          <div style={{ width: '60px', height: '1px', backgroundColor: '#E5989B' }} />
          <p style={{ fontFamily: '"Raleway", sans-serif', fontSize: '20px', fontWeight: '300', color: '#6B2D3E', margin: '0', letterSpacing: '1px' }}>
            {venue}, {city}
          </p>
        </div>

        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontStyle: 'italic', color: '#B56576', margin: '40px 0 0 0' }}>
          {hashtag}
        </p>
      </div>
    </div>
  );
}
