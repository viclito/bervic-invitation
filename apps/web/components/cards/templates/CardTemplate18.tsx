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

export default function CardTemplate18({
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
      style={{ width: '1080px', height: '1080px', backgroundColor: '#0D2818', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxSizing: 'border-box', backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(241, 196, 15, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(241, 196, 15, 0.1) 0%, transparent 50%)' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400&display=swap');
        `}
      </style>

      {/* Glassmorphism Card */}
      <div
        style={{ width: '900px', height: '900px', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(241, 196, 15, 0.4)', borderRadius: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px', boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,0.3)', color: '#F1C40F', fontFamily: "'Bodoni Moda', serif" }}
      >
        <div style={{ fontSize: '28px', letterSpacing: '4px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '40px' }}>
          {tagline}
        </div>

        {/* Hexagon Frame */}
        <div
          style={{ width: '340px', height: '380px', position: 'relative', marginBottom: '40px', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', border: '2px solid #F1C40F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', boxSizing: 'border-box', backgroundColor: 'rgba(241, 196, 15, 0.1)' }}
        >
          <div
            style={{ width: '100%', height: '100%', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', overflow: 'hidden' }}
          >
            <img
              src={couplePhoto}
              alt="Couple"
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.1)' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '24px', width: '100%' }}>
          <h1 style={{ margin: 0, fontSize: '72px', fontWeight: 700, letterSpacing: '3px', textAlign: 'center', color: '#F1C40F', lineHeight: 1.1 }}>{partnerOne}</h1>
          <span style={{ fontSize: '40px', fontStyle: 'italic', fontWeight: 300, color: 'rgba(241, 196, 15, 0.7)' }}>&amp;</span>
          <h1 style={{ margin: 0, fontSize: '72px', fontWeight: 700, letterSpacing: '3px', textAlign: 'center', color: '#F1C40F', lineHeight: 1.1 }}>{partnerTwo}</h1>
        </div>

        <div
          style={{ fontFamily: "'Inter', sans-serif", fontSize: '28px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>{weddingDate}</span>
            <span style={{ width: '4px', height: '4px', backgroundColor: '#F1C40F', borderRadius: '50%' }}></span>
            <span>{weddingTime}</span>
          </div>
          <div>{venue}, {city}</div>
          <div style={{ marginTop: '10px', color: '#F1C40F', letterSpacing: '4px' }}>{hashtag}</div>
        </div>
      </div>
    </div>
  );
}
