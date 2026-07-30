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

export default function CardTemplate17({
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
        background: 'linear-gradient(135deg, #FF8C42 0%, #FF3E6C 50%, #6B2D5C 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
        color: '#FFFFFF',
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400&display=swap');
        `}
      </style>

      {/* Sunburst Lines */}
      <svg
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1200px',
          height: '1200px',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
        viewBox="0 0 100 100"
      >
        {[...Array(24)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 50 * Math.cos((i * 15 * Math.PI) / 180)}
            y2={50 + 50 * Math.sin((i * 15 * Math.PI) / 180)}
            stroke="#FFFFFF"
            strokeWidth="0.2"
          />
        ))}
        <circle cx="50" cy="50" r="10" fill="#FFFFFF" opacity="0.3" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#FFFFFF" strokeWidth="0.1" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#FFFFFF" strokeWidth="0.05" />
      </svg>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          zIndex: 1,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: '26px', fontStyle: 'italic', marginBottom: '40px', letterSpacing: '2px' }}>
          {tagline}
        </div>

        {/* Glowing Circle Frame */}
        <div
          style={{
            position: 'relative',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            padding: '15px',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.5)',
            marginBottom: '50px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#fff',
            }}
          >
            <img
              src={couplePhoto}
              alt="Couple"
              crossOrigin="anonymous"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(1.1) contrast(1.1) sepia(0.2)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', marginBottom: '24px', width: '100%' }}>
          <h1 style={{ margin: 0, fontSize: '54px', fontWeight: 600, letterSpacing: '2px', textShadow: '2px 2px 10px rgba(0,0,0,0.2)', lineHeight: 1.1 }}>{partnerOne}</h1>
          <span style={{ fontSize: '36px', fontStyle: 'italic', fontWeight: 400, margin: '2px 0' }}>&amp;</span>
          <h1 style={{ margin: 0, fontSize: '54px', fontWeight: 600, letterSpacing: '2px', textShadow: '2px 2px 10px rgba(0,0,0,0.2)', lineHeight: 1.1 }}>{partnerTwo}</h1>
        </div>

        <div
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '18px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div>{weddingDate} <span style={{ margin: '0 10px' }}>•</span> {weddingTime}</div>
          <div>{venue} <span style={{ margin: '0 10px' }}>•</span> {city}</div>
          <div style={{ marginTop: '15px', fontWeight: 600, letterSpacing: '3px' }}>{hashtag}</div>
        </div>
      </div>
    </div>
  );
}
