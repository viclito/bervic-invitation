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

export default function CardTemplate10({
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
      style={{ width: '1080px', height: '1080px', backgroundColor: '#1E1A17', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel', serif", color: '#E0986C', boxSizing: 'border-box' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
        `}
      </style>

      {/* Industrial Copper Frame Border */}
      <div
        style={{ position: 'absolute', top: '30px', left: '30px', right: '30px', bottom: '30px', border: '2px solid #C87D55', pointerEvents: 'none', zIndex: 1 }}
      >
        <div
          style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: '1px solid rgba(200, 125, 85, 0.4)' }}
        />
        {/* Corner Accents */}
        <div style={{ position: 'absolute', top: '-5px', left: '-5px', width: '10px', height: '10px', backgroundColor: '#E0986C' }} />
        <div style={{ position: 'absolute', top: '-5px', right: '-5px', width: '10px', height: '10px', backgroundColor: '#E0986C' }} />
        <div style={{ position: 'absolute', bottom: '-5px', left: '-5px', width: '10px', height: '10px', backgroundColor: '#E0986C' }} />
        <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '10px', height: '10px', backgroundColor: '#E0986C' }} />
      </div>

      <div style={{ zIndex: 10, width: '100%', padding: '0 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '28px', letterSpacing: '8px', fontWeight: 600, color: '#C87D55', textTransform: 'uppercase', marginBottom: '50px' }}>
          {tagline}
        </p>

        {/* Square Photo with Copper Border */}
        <div style={{ position: 'relative', width: '300px', height: '300px', marginBottom: '50px' }}>
          {/* Copper Gradient Border Simulation */}
          <div style={{ position: 'absolute', top: '-6px', left: '-6px', right: '-6px', bottom: '-6px', background: 'linear-gradient(135deg, #E0986C, #73452c, #E0986C)', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: '#1E1A17', zIndex: 2 }} />
          <img
            src={couplePhoto}
            alt="Couple"
            crossOrigin="anonymous"
            style={{ position: 'absolute', top: '4px', left: '4px', right: '4px', bottom: '4px', width: 'calc(100% - 8px)', height: 'calc(100% - 8px)', objectFit: 'cover', zIndex: 3 }}
          />
        </div>

        {/* Names */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '82px', fontWeight: 700, color: '#E0986C', margin: 0, letterSpacing: '4px', textTransform: 'uppercase', lineHeight: 1.1 }}>
            {partnerOne}
            <br />
            <span style={{ fontSize: '46px', fontWeight: 400, color: '#C87D55', fontFamily: "'Jost', sans-serif" }}>&</span>
            <br />
            {partnerTwo}
          </h1>
        </div>

        {/* Line Art Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '30px 0', width: '200px' }}>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#C87D55' }}></div>
          <div style={{ width: '8px', height: '8px', transform: 'rotate(45deg)', border: '1px solid #E0986C' }}></div>
          <div style={{ height: '1px', flex: 1, backgroundColor: '#C87D55' }}></div>
        </div>

        {/* Details */}
        <div style={{ fontFamily: "'Jost', sans-serif", display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
            <span style={{ fontSize: '32px', letterSpacing: '3px', fontWeight: 500, textTransform: 'uppercase' }}>{weddingDate}</span>
            <div style={{ width: '4px', height: '4px', backgroundColor: '#C87D55', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '32px', letterSpacing: '3px', fontWeight: 500 }}>{weddingTime}</span>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 400, margin: 0, letterSpacing: '2px', color: '#E0986C' }}>
            {venue}
          </p>
          <p style={{ fontSize: '26px', fontWeight: 300, margin: 0, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(224, 152, 108, 0.7)' }}>
            {city}
          </p>
        </div>

        <div style={{ marginTop: '40px' }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '26px', fontWeight: 300, color: '#C87D55', letterSpacing: '5px' }}>
            {hashtag}
          </p>
        </div>

      </div>
    </div>
  );
}
