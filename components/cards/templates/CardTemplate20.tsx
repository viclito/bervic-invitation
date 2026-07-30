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

export default function CardTemplate20({
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
        backgroundColor: '#1A1A1A',
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        boxSizing: 'border-box',
        color: '#FFFFFF',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600&family=Courier+Prime&display=swap');
        `}
      </style>

      {/* Film Strip Left Side */}
      <div
        style={{
          width: '500px',
          height: '100%',
          backgroundColor: '#000000',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 0',
          boxSizing: 'border-box',
          borderRight: '2px solid #333',
        }}
      >
        {/* Sprocket holes left */}
        <div style={{ position: 'absolute', left: '15px', top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
          {[...Array(12)].map((_, i) => (
            <div key={`l-${i}`} style={{ width: '20px', height: '30px', backgroundColor: '#1A1A1A', borderRadius: '4px' }}></div>
          ))}
        </div>
        
        {/* Sprocket holes right */}
        <div style={{ position: 'absolute', right: '15px', top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
          {[...Array(12)].map((_, i) => (
            <div key={`r-${i}`} style={{ width: '20px', height: '30px', backgroundColor: '#1A1A1A', borderRadius: '4px' }}></div>
          ))}
        </div>

        {/* Film Frame Content */}
        <div
          style={{
            width: '380px',
            height: '550px',
            backgroundColor: '#111',
            border: '2px solid #333',
            padding: '5px',
            boxSizing: 'border-box',
          }}
        >
          <img
            src={couplePhoto}
            alt="Couple"
            crossOrigin="anonymous"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%) contrast(1.2)',
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: '14px',
            color: '#E5A93C',
            letterSpacing: '2px',
            marginTop: '20px',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            position: 'absolute',
            left: '55px',
            bottom: '100px',
          }}
        >
          KODAK 400TX
        </div>
      </div>

      {/* Typography Right Side Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          boxSizing: 'border-box',
          fontFamily: "'Oswald', sans-serif",
        }}
      >
        <div style={{ fontSize: '20px', letterSpacing: '8px', color: '#E5A93C', textTransform: 'uppercase', marginBottom: '20px' }}>
          {tagline}
        </div>

        <h1 style={{ fontSize: '90px', margin: '0 0 -20px 0', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1 }}>
          {partnerOne}
        </h1>
        <div style={{ fontSize: '40px', color: '#E5A93C', margin: '10px 0' }}>&</div>
        <h1 style={{ fontSize: '90px', margin: '0 0 50px 0', fontWeight: 600, textTransform: 'uppercase', lineHeight: 1 }}>
          {partnerTwo}
        </h1>

        <div style={{ width: '60px', height: '4px', backgroundColor: '#E5A93C', marginBottom: '40px' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '18px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#E5A93C', fontWeight: 600 }}>DATE //</span> {weddingDate}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#E5A93C', fontWeight: 600 }}>TIME //</span> {weddingTime}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ color: '#E5A93C', fontWeight: 600 }}>LOC //</span> 
            <div>
              {venue}<br/>
              {city}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '50px', fontSize: '22px', color: '#555', letterSpacing: '1px' }}>
          {hashtag}
        </div>
      </div>
    </div>
  );
}
