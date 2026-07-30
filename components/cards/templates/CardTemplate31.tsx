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

const CardTemplate31: React.FC<CardProps> = ({
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
      style={{
        width: '1080px',
        height: '1080px',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        boxSizing: 'border-box',
        color: '#111111',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;1,400&display=swap');
        `}
      </style>

      {/* Minimalist Line Art SVG Background */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.08,
        }}
        viewBox="0 0 1080 1080"
      >
        {/* Single line drawing of abstract floral/face shape */}
        <path
          d="M 200,800 C 300,700 200,500 400,400 C 600,300 800,400 900,600 C 1000,800 800,900 600,800 C 400,700 500,500 700,400"
          fill="none"
          stroke="#111111"
          strokeWidth="3"
        />
        <path
          d="M 100,100 L 980,100 L 980,980 L 100,980 Z"
          fill="none"
          stroke="#111111"
          strokeWidth="1"
        />
        <path
          d="M 120,120 L 960,120 L 960,960 L 120,960 Z"
          fill="none"
          stroke="#111111"
          strokeWidth="1"
        />
      </svg>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <div style={{ marginBottom: '60px', width: '480px', height: '480px', position: 'relative' }}>
          <img
            src={couplePhoto}
            alt="Couple"
            crossOrigin="anonymous"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              border: '1px solid #111111',
              padding: '10px',
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 200, fontSize: '18px', letterSpacing: '10px', textTransform: 'uppercase', margin: '0 0 20px 0', color: '#555555' }}>
            {tagline}
          </p>

          <h1 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '68px', fontWeight: 400, margin: '0 0 40px 0', letterSpacing: '2px' }}>
            {partnerOne} <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 200, fontSize: '40px', margin: '0 15px' }}>+</span> {partnerTwo}
          </h1>

          <div style={{ width: '40px', height: '1px', backgroundColor: '#111111', margin: '0 auto 40px auto' }} />

          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: '20px', lineHeight: 2, letterSpacing: '4px', textTransform: 'uppercase' }}>
            <div>{weddingDate} — {weddingTime}</div>
            <div>{venue}, {city}</div>
          </div>
          
          <div style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', fontSize: '22px', marginTop: '40px', color: '#555555' }}>
            {hashtag}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate31;
