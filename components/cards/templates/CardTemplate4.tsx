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

export default function CardTemplate4({
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
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        fontFamily: "'Playfair Display', serif",
      }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400&display=swap');`}
      </style>

      {/* Left Side: Photo */}
      <div
        style={{
          width: '540px',
          height: '1080px',
          backgroundImage: `url(${couplePhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRight: '4px solid #C9A84C'
        }}
      ></div>

      {/* Right Side: Text Panel */}
      <div
        style={{
          width: '540px',
          height: '1080px',
          backgroundColor: '#F8F5F0',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          boxSizing: 'border-box',
          color: '#1C2B4A',
        }}
      >
        {/* Huge Backdrop Text */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-90deg)',
            fontSize: '180px',
            fontWeight: 900,
            opacity: 0.1,
            color: '#1C2B4A',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          2025
        </div>

        <div style={{ zIndex: 10, textAlign: 'center', width: '100%' }}>
          <p style={{ fontSize: '18px', letterSpacing: '4px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '60px' }}>
            Save The Date
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '60px' }}>
            <div style={{ fontSize: '62px', lineHeight: '1' }}>{partnerOne}</div>
            <div style={{ fontSize: '30px', fontStyle: 'italic', color: '#C9A84C' }}>&amp;</div>
            <div style={{ fontSize: '62px', lineHeight: '1' }}>{partnerTwo}</div>
          </div>

          <div style={{ 
            padding: '30px', 
            borderTop: '1px solid #C9A84C', 
            borderBottom: '1px solid #C9A84C',
            marginBottom: '50px'
          }}>
            <p style={{ fontSize: '26px', margin: '0 0 10px 0' }}>{weddingDate}</p>
            <p style={{ fontSize: '20px', margin: '0', color: '#666' }}>{weddingTime}</p>
          </div>

          <div style={{ marginBottom: '60px' }}>
            <p style={{ fontSize: '24px', margin: '0 0 10px 0', fontWeight: 'bold' }}>{venue}</p>
            <p style={{ fontSize: '20px', margin: '0' }}>{city}</p>
          </div>

          <p style={{ fontSize: '22px', fontStyle: 'italic', color: '#C9A84C', marginBottom: '20px' }}>
            {tagline}
          </p>

          <p style={{ fontSize: '16px', letterSpacing: '2px', fontWeight: 'bold' }}>
            {hashtag}
          </p>
        </div>
      </div>
    </div>
  );
}
