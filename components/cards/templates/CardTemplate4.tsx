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
      style={{ width: '1080px', height: '1080px', display: 'flex', flexDirection: 'row', overflow: 'hidden', fontFamily: "'Playfair Display', serif" }}
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
        style={{ width: '540px', height: '1080px', backgroundColor: '#F8F5F0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', boxSizing: 'border-box', color: '#1C2B4A' }}
      >
        {/* Huge Backdrop Text */}
        <div
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-90deg)', fontSize: '180px', fontWeight: 900, opacity: 0.1, color: '#1C2B4A', pointerEvents: 'none', whiteSpace: 'nowrap' }}
        >
          2025
        </div>

        <div style={{ zIndex: 10, textAlign: 'center', width: '100%' }}>
          <p style={{ fontSize: '28px', letterSpacing: '6px', textTransform: 'uppercase', color: '#C9A84C', fontWeight: 600, marginBottom: '32px' }}>
            Save The Date
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '36px' }}>
            <div style={{ fontSize: '72px', fontWeight: 700, lineHeight: '1.05' }}>{partnerOne}</div>
            <div style={{ fontSize: '42px', fontStyle: 'italic', color: '#C9A84C', margin: '2px 0' }}>&amp;</div>
            <div style={{ fontSize: '72px', fontWeight: 700, lineHeight: '1.05' }}>{partnerTwo}</div>
          </div>

          <div style={{ padding: '20px', borderTop: '2px solid #C9A84C', borderBottom: '2px solid #C9A84C', marginBottom: '32px' }}>
            <p style={{ fontSize: '34px', fontWeight: 700, margin: '0 0 6px 0' }}>{weddingDate}</p>
            <p style={{ fontSize: '28px', margin: '0', color: '#555', fontWeight: 500 }}>{weddingTime}</p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '32px', margin: '0 0 6px 0', fontWeight: 700 }}>{venue}</p>
            <p style={{ fontSize: '26px', margin: '0', color: '#555' }}>{city}</p>
          </div>

          <p style={{ fontSize: '30px', fontStyle: 'italic', color: '#C9A84C', fontWeight: 600, marginBottom: '16px' }}>
            {tagline}
          </p>

          <p style={{ fontSize: '24px', letterSpacing: '3px', fontWeight: 'bold' }}>
            {hashtag}
          </p>
        </div>
      </div>
    </div>
  );
}
