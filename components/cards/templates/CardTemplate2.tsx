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

export default function CardTemplate2({
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
      style={{ width: '1080px', height: '1080px', background: 'linear-gradient(to bottom, #F5E6D3, #E8D5C0)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", overflow: 'hidden', color: '#5C3D2E' }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');`}
      </style>

      {/* Decorative Botanical Elements */}
      <svg width="200" height="400" style={{ position: 'absolute', top: '100px', left: '0', fill: '#8B9D6A', opacity: 0.7 }} viewBox="0 0 100 200">
        <path d="M0 50 Q 50 20, 80 80 T 100 150 Q 50 180, 20 120 T 0 50" />
      </svg>
      <svg width="200" height="400" style={{ position: 'absolute', bottom: '50px', right: '0', fill: '#C4714A', opacity: 0.5, transform: 'scaleX(-1)' }} viewBox="0 0 100 200">
        <path d="M0 50 Q 50 20, 80 80 T 100 150 Q 50 180, 20 120 T 0 50" />
      </svg>

      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%' }}>
        
        <p style={{ fontSize: '30px', letterSpacing: '6px', textTransform: 'uppercase', color: '#C4714A', fontWeight: 600, marginBottom: '24px' }}>
          We Are Getting Married
        </p>

        <div style={{ width: '240px', height: '300px', borderRadius: '60% 60% 0 0 / 70% 70% 0 0', overflow: 'hidden', border: '4px solid #C4714A', marginBottom: '28px' }}>
          <img
            src={couplePhoto}
            crossOrigin="anonymous"
            alt="Couple"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '84px', fontStyle: 'italic', fontWeight: 600, lineHeight: '1.1' }}>{partnerOne}</div>
          <div style={{ fontSize: '44px', color: '#C4714A', fontStyle: 'italic', margin: '2px 0' }}>and</div>
          <div style={{ fontSize: '84px', fontStyle: 'italic', fontWeight: 600, lineHeight: '1.1' }}>{partnerTwo}</div>
        </div>

        <div style={{ borderBottom: '2px dashed #C4714A', width: '220px', margin: '20px 0' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <p style={{ fontSize: '34px', margin: '0', fontWeight: 600 }}>{weddingDate}</p>
          <p style={{ fontSize: '28px', margin: '0', color: '#C4714A', fontWeight: 500 }}>at {weddingTime}</p>
          <p style={{ fontSize: '32px', margin: '12px 0 0 0', fontWeight: 600 }}>{venue}</p>
          <p style={{ fontSize: '26px', margin: '0' }}>{city}</p>
        </div>

        <div style={{ borderBottom: '2px dashed #C4714A', width: '220px', margin: '20px 0' }}></div>

        <p style={{ fontSize: '30px', fontStyle: 'italic', color: '#8B9D6A', fontWeight: 500 }}>
          "{tagline}"
        </p>

        <p style={{ fontSize: '26px', marginTop: '16px', letterSpacing: '3px', fontWeight: 'bold', color: '#C4714A' }}>
          {hashtag}
        </p>

      </div>
    </div>
  );
}
