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

export default function CardTemplate16({
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
        backgroundColor: '#EFEBE4',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundImage: 'radial-gradient(#d9d2c5 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&display=swap');
        `}
      </style>

      {/* Torn Paper Layer */}
      <div
        style={{
          position: 'absolute',
          width: '940px',
          height: '940px',
          backgroundColor: '#FFFFFF',
          clipPath: 'polygon(2% 0, 98% 3%, 100% 97%, 95% 100%, 3% 98%, 0 95%, 1% 45%, 4% 15%)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          boxSizing: 'border-box',
          filter: 'drop-shadow(0px 15px 15px rgba(0,0,0,0.15))', // Fake drop shadow for clip path
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: '#2B2B2B',
            fontFamily: "'Playfair Display', serif",
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '20px', fontStyle: 'italic', letterSpacing: '2px', color: '#555' }}>
            {tagline}
          </div>

          {/* Photo inside torn frame */}
          <div
            style={{
              width: '500px',
              height: '500px',
              position: 'relative',
              margin: '30px 0',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                clipPath: 'polygon(5% 5%, 98% 2%, 95% 98%, 2% 95%)',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
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
                  clipPath: 'polygon(0 0, 100% 2%, 98% 100%, 2% 98%)',
                  filter: 'grayscale(20%) sepia(10%)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', margin: '0 0 20px 0', width: '100%' }}>
            <h1 style={{ margin: 0, fontSize: '52px', fontWeight: 600, letterSpacing: '1px', lineHeight: 1.1 }}>{partnerOne}</h1>
            <span style={{ fontWeight: 400, fontStyle: 'italic', fontSize: '36px', margin: '2px 0' }}>&amp;</span>
            <h1 style={{ margin: 0, fontSize: '52px', fontWeight: 600, letterSpacing: '1px', lineHeight: 1.1 }}>{partnerTwo}</h1>
          </div>

          <div
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '16px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#444',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <div>{weddingDate}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ width: '30px', height: '1px', backgroundColor: '#444' }}></span>
              <span>{weddingTime}</span>
              <span style={{ width: '30px', height: '1px', backgroundColor: '#444' }}></span>
            </div>
            <div>{venue}, {city}</div>
            <div style={{ marginTop: '10px', fontSize: '14px', letterSpacing: '2px', fontWeight: 600 }}>
              {hashtag}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
