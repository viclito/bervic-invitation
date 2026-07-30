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

export default function CardTemplate3({
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
        backgroundColor: '#FFFFFF',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Cinzel', serif",
        overflow: 'hidden',
        color: '#1A1A1A',
      }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap');`}
      </style>

      {/* Outer Border */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          right: '30px',
          bottom: '30px',
          border: '2px solid #1A1A1A',
          pointerEvents: 'none',
        }}
      ></div>
      {/* Inner Border */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          right: '40px',
          bottom: '40px',
          border: '1px solid #1A1A1A',
          pointerEvents: 'none',
        }}
      ></div>

      {/* Corner Ornaments */}
      <svg width="40" height="40" style={{ position: 'absolute', top: '40px', left: '40px', fill: '#1A1A1A' }} viewBox="0 0 100 100">
        <polygon points="50,0 100,50 50,100 0,50" />
      </svg>
      <svg width="40" height="40" style={{ position: 'absolute', top: '40px', right: '40px', fill: '#1A1A1A' }} viewBox="0 0 100 100">
        <polygon points="50,0 100,50 50,100 0,50" />
      </svg>
      <svg width="40" height="40" style={{ position: 'absolute', bottom: '40px', left: '40px', fill: '#1A1A1A' }} viewBox="0 0 100 100">
        <polygon points="50,0 100,50 50,100 0,50" />
      </svg>
      <svg width="40" height="40" style={{ position: 'absolute', bottom: '40px', right: '40px', fill: '#1A1A1A' }} viewBox="0 0 100 100">
        <polygon points="50,0 100,50 50,100 0,50" />
      </svg>

      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 80px' }}>
        
        <p style={{ fontSize: '18px', letterSpacing: '4px', textTransform: 'uppercase', fontVariant: 'small-caps', marginBottom: '40px' }}>
          With Joyful Hearts We Invite You
        </p>

        <img
          src={couplePhoto}
          crossOrigin="anonymous"
          alt="Couple"
          style={{
            width: '260px',
            height: '260px',
            objectFit: 'cover',
            border: '4px solid #1A1A1A',
            padding: '4px',
            backgroundColor: '#FFFFFF',
            marginBottom: '50px',
          }}
        />

        <div style={{ marginBottom: '30px' }}>
          <div style={{ fontSize: '66px', letterSpacing: '8px', textTransform: 'uppercase', lineHeight: '1.2' }}>{partnerOne}</div>
          <div style={{ fontSize: '30px', margin: '15px 0', fontStyle: 'italic', color: '#C9A84C' }}>&amp;</div>
          <div style={{ fontSize: '66px', letterSpacing: '8px', textTransform: 'uppercase', lineHeight: '1.2' }}>{partnerTwo}</div>
        </div>

        <div style={{ width: '150px', height: '2px', backgroundColor: '#C9A84C', margin: '30px 0' }}></div>

        <div style={{ fontSize: '22px', letterSpacing: '2px', lineHeight: '1.8' }}>
          <div>{weddingDate}</div>
          <div>{weddingTime}</div>
          <div style={{ marginTop: '20px' }}>{venue}</div>
          <div>{city}</div>
        </div>

        <div style={{ width: '80px', height: '1px', backgroundColor: '#C9A84C', margin: '30px 0' }}></div>

        <p style={{ fontSize: '16px', letterSpacing: '2px' }}>
          {tagline} | {hashtag}
        </p>

      </div>
    </div>
  );
}
