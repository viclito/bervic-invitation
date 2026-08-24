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

export default function CardTemplate1({
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
      style={{ width: '1080px', height: '1080px', backgroundColor: '#FDF6F0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", overflow: 'hidden', color: '#4A2830' }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap');`}
      </style>

      {/* Decorative Blobs */}
      <svg width="200" height="200" style={{ position: 'absolute', top: '-50px', left: '-50px', fill: '#F4C6C6' }}><circle cx="100" cy="100" r="100" /></svg>
      <svg width="150" height="150" style={{ position: 'absolute', top: '10px', left: '100px', fill: '#E8A8A8' }}><circle cx="75" cy="75" r="75" /></svg>
      <svg width="250" height="250" style={{ position: 'absolute', bottom: '-80px', right: '-50px', fill: '#B8D4A8' }}><ellipse cx="125" cy="125" rx="125" ry="100" /></svg>
      <svg width="150" height="150" style={{ position: 'absolute', bottom: '100px', right: '150px', fill: '#F4C6C6' }}><circle cx="75" cy="75" r="75" /></svg>
      <svg width="200" height="200" style={{ position: 'absolute', top: '-20px', right: '-40px', fill: '#E8A8A8' }}><circle cx="100" cy="100" r="100" /></svg>
      <svg width="180" height="180" style={{ position: 'absolute', bottom: '-40px', left: '-20px', fill: '#F4C6C6' }}><circle cx="90" cy="90" r="90" /></svg>

      {/* Outer Border */}
      <div
        style={{ position: 'absolute', top: '36px', left: '36px', right: '36px', bottom: '36px', border: '1px solid #D4998F', pointerEvents: 'none' }}
      ></div>
      {/* Inner Border */}
      <div
        style={{ position: 'absolute', top: '44px', left: '44px', right: '44px', bottom: '44px', border: '1px solid #D4998F', pointerEvents: 'none' }}
      ></div>

      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '900px', textAlign: 'center' }}>
        <p style={{ textTransform: 'uppercase', color: '#C4837B', letterSpacing: '8px', fontSize: '34px', fontWeight: 700, marginBottom: '20px' }}>
          Wedding Announcement
        </p>

        <img
          src={couplePhoto}
          crossOrigin="anonymous"
          alt="Couple"
          style={{
            width: '190px',
            height: '190px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '5px solid #F4C6C6',
            marginBottom: '20px',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', textAlign: 'center', marginBottom: '14px', width: '100%' }}>
          <span style={{ fontSize: '84px', fontStyle: 'italic', fontWeight: 700, color: '#4A2830', lineHeight: '1.05' }}>{partnerOne}</span>
          <span style={{ fontSize: '48px', color: '#C4837B', fontStyle: 'italic', margin: '0' }}>&amp;</span>
          <span style={{ fontSize: '84px', fontStyle: 'italic', fontWeight: 700, color: '#4A2830', lineHeight: '1.05' }}>{partnerTwo}</span>
        </div>

        <p style={{ fontSize: '36px', fontStyle: 'italic', color: '#C4837B', marginBottom: '18px', fontWeight: 600 }}>
          {tagline}
        </p>

        <p style={{ fontSize: '40px', margin: '4px 0', letterSpacing: '2px', fontWeight: 700, color: '#4A2830' }}>{weddingDate}</p>
        <p style={{ fontSize: '32px', margin: '2px 0', color: '#6B3A46', fontWeight: 600 }}>{weddingTime}</p>
        <div style={{ width: '100px', height: '2px', backgroundColor: '#D4998F', margin: '14px 0' }}></div>
        <p style={{ fontSize: '36px', margin: '4px 0', fontWeight: 700, color: '#4A2830' }}>{venue}</p>
        <p style={{ fontSize: '30px', margin: '2px 0', color: '#6B3A46', fontWeight: 600 }}>{city}</p>
        
        <p style={{ fontSize: '30px', marginTop: '20px', color: '#C4837B', letterSpacing: '3px', fontWeight: 700 }}>
          {hashtag}
        </p>
      </div>
    </div>
  );
}
