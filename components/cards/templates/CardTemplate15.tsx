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

export default function CardTemplate15({
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
        backgroundColor: '#121824',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Cinzel', serif",
        color: '#E6C280',
        boxSizing: 'border-box',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Montserrat:wght@300;400;600&display=swap');
        `}
      </style>

      {/* Constellation Stars Background */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1080 1080"
      >
        <circle cx="150" cy="200" r="3" fill="#E6C280" />
        <circle cx="200" cy="150" r="2" fill="#E6C280" />
        <line x1="150" y1="200" x2="200" y2="150" stroke="#E6C280" strokeWidth="1" />
        
        <circle cx="850" cy="300" r="4" fill="#E6C280" />
        <circle cx="950" cy="250" r="2" fill="#E6C280" />
        <line x1="850" y1="300" x2="950" y2="250" stroke="#E6C280" strokeWidth="1" />

        <circle cx="250" cy="800" r="3" fill="#E6C280" />
        <circle cx="350" cy="850" r="2" fill="#E6C280" />
        <circle cx="300" cy="950" r="3" fill="#E6C280" />
        <line x1="250" y1="800" x2="350" y2="850" stroke="#E6C280" strokeWidth="1" />
        <line x1="350" y1="850" x2="300" y2="950" stroke="#E6C280" strokeWidth="1" />

        <circle cx="800" cy="850" r="2" fill="#E6C280" />
        <circle cx="900" cy="800" r="3" fill="#E6C280" />
        <line x1="800" y1="850" x2="900" y2="800" stroke="#E6C280" strokeWidth="1" />
      </svg>

      {/* Semi-transparent abstract shape */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(230, 194, 128, 0.15) 0%, rgba(18, 24, 36, 0) 70%)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          right: '-150px',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(230, 194, 128, 0.1) 0%, rgba(18, 24, 36, 0) 70%)',
          zIndex: 0,
        }}
      />

      {/* Main Content Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: '60px',
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: '24px', letterSpacing: '6px', marginBottom: '40px', textTransform: 'uppercase' }}>
          {tagline}
        </div>

        {/* Arched Photo Frame */}
        <div
          style={{
            position: 'relative',
            width: '380px',
            height: '460px',
            borderRadius: '190px 190px 0 0',
            border: '2px solid #E6C280',
            padding: '8px',
            marginBottom: '32px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '182px 182px 0 0',
              overflow: 'hidden',
              backgroundColor: '#1a2233',
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
                opacity: 0.9,
              }}
            />
          </div>
        </div>

        {/* Clean Centered Names Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '24px', width: '100%' }}>
          <h1 style={{ margin: 0, fontSize: '50px', fontWeight: 600, letterSpacing: '4px', textAlign: 'center', textTransform: 'uppercase', color: '#E6C280', lineHeight: 1.1 }}>
            {partnerOne}
          </h1>
          <span style={{ fontSize: '32px', fontStyle: 'italic', color: '#c4a66a', margin: '2px 0' }}>&amp;</span>
          <h1 style={{ margin: 0, fontSize: '50px', fontWeight: 600, letterSpacing: '4px', textAlign: 'center', textTransform: 'uppercase', color: '#E6C280', lineHeight: 1.1 }}>
            {partnerTwo}
          </h1>
        </div>

        {/* Details Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '18px',
            letterSpacing: '3px',
            color: '#c4a66a',
            textTransform: 'uppercase',
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            {weddingDate} | {weddingTime}
          </div>
          <div style={{ marginBottom: '20px' }}>
            {venue}, {city}
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '20px', fontStyle: 'italic', textTransform: 'none' }}>
            {hashtag}
          </div>
        </div>
      </div>
    </div>
  );
}
