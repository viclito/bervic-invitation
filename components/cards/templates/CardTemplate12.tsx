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

export default function CardTemplate12({
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
        backgroundColor: '#FAFAFA',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');
        `}
      </style>

      {/* Top Details */}
      <div style={{ position: 'absolute', top: '50px', left: '80px', width: '920px', display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", color: '#111111', fontSize: '13px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', zIndex: 10 }}>
        <span>{tagline}</span>
        <span>{hashtag}</span>
      </div>

      {/* Main Content Column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '700px', marginTop: '40px', zIndex: 10 }}>
        {/* Names Heading Above Photo */}
        <h1 style={{ 
          fontFamily: "'Inter', sans-serif", 
          fontSize: '52px', 
          fontWeight: 900, 
          color: '#111111', 
          lineHeight: 1.1, 
          margin: '0 0 24px 0',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '-1px'
        }}>
          {partnerOne} <span style={{ color: '#888888', fontWeight: 400 }}>&amp;</span> {partnerTwo}
        </h1>

        {/* Center Photo Area */}
        <div style={{ width: '640px', height: '420px', border: '2px solid #111111', overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}>
          <img
            src={couplePhoto}
            alt="Couple"
            crossOrigin="anonymous"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Ultra-clean Grid Details Below */}
        <div style={{ marginTop: '36px', width: '640px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', borderTop: '1.5px solid #111111', paddingTop: '28px', fontFamily: "'Inter', sans-serif" }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#888888', margin: '0 0 6px 0' }}>When</p>
            <p style={{ fontSize: '20px', fontWeight: 600, color: '#111111', margin: '0 0 4px 0' }}>{weddingDate}</p>
            <p style={{ fontSize: '15px', fontWeight: 400, color: '#555555', margin: 0 }}>{weddingTime}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#888888', margin: '0 0 6px 0' }}>Where</p>
            <p style={{ fontSize: '20px', fontWeight: 600, color: '#111111', margin: '0 0 4px 0' }}>{venue}</p>
            <p style={{ fontSize: '15px', fontWeight: 400, color: '#555555', margin: 0 }}>{city}</p>
          </div>
        </div>
      </div>

      {/* Subtle Frame */}
      <div style={{ position: 'absolute', top: '40px', left: '40px', right: '40px', bottom: '40px', border: '1px solid rgba(17,17,17,0.1)', pointerEvents: 'none' }}></div>
    </div>
  );
}
