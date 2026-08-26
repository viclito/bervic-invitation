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

const CardTemplate29: React.FC<CardProps> = ({
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
      style={{ width: '1080px', height: '1080px', display: 'flex', flexDirection: 'row', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap');
        `}
      </style>

      {/* Left Panel */}
      <div
        style={{ width: '540px', height: '1080px', backgroundColor: '#FBEAEB', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', boxSizing: 'border-box', color: '#7A1F2B', zIndex: 2 }}
      >
        {/* Watercolor abstract floral background shapes */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15, pointerEvents: 'none' }}>
          <circle cx="100" cy="200" r="150" fill="#E8B0B7" filter="blur(30px)" />
          <circle cx="450" cy="800" r="200" fill="#C4737B" filter="blur(40px)" />
          <path d="M 50,500 Q 150,400 250,550 T 450,450" fill="none" stroke="#7A1F2B" strokeWidth="2" opacity="0.3" />
          <path d="M 100,600 Q 200,500 300,650 T 500,550" fill="none" stroke="#7A1F2B" strokeWidth="1" opacity="0.2" />
        </svg>

        <div style={{ zIndex: 3, width: '100%', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '36px', fontWeight: 600, letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '40px' }}>
            {tagline}
          </p>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '84px', fontWeight: 'bold', margin: '0 0 20px 0', lineHeight: 1.1 }}>
            {partnerOne}
          </h1>
          <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '56px', margin: '10px 0' }}>
            and
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '84px', fontWeight: 'bold', margin: '0 0 60px 0', lineHeight: 1.1 }}>
            {partnerTwo}
          </h1>

          <div style={{ width: '80px', height: '2px', backgroundColor: '#7A1F2B', margin: '0 auto 60px auto' }} />

          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: '34px', fontWeight: 300, lineHeight: 1.8 }}>
            <div style={{ fontWeight: 700, fontSize: '36px', marginBottom: '10px' }}>{weddingDate}</div>
            <div>at {weddingTime}</div>
            <div style={{ marginTop: '30px' }}>{venue}</div>
            <div>{city}</div>
            <div style={{ marginTop: '40px', fontSize: '36px', fontWeight: 600, fontStyle: 'italic', letterSpacing: '2px' }}>{hashtag}</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{ width: '540px', height: '1080px', position: 'relative' }}
      >
        <img
          src={couplePhoto}
          alt="Couple"
          crossOrigin="anonymous"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(251,234,235,0.4) 0%, rgba(251,234,235,0) 20%)', pointerEvents: 'none' }}
        />
      </div>
    </div>
  );
};

export default CardTemplate29;
