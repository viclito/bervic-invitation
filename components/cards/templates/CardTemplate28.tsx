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

const CardTemplate28: React.FC<CardProps> = ({
  partnerOne = 'Sophia',
  partnerTwo = 'Alexander',
  weddingDate = 'August 14, 2025',
  weddingTime = '4:00 PM',
  venue = 'The Grand Chapel',
  city = 'Bangalore, India',
  tagline = 'Together Forever',
  couplePhoto = '/images/templates/couple-photo.jpg',
  hashtag = '#ForeverTogether',
}) => {
  return (
    <div
      style={{
        width: '1080px',
        height: '1080px',
        backgroundColor: '#141E18',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        boxSizing: 'border-box',
        color: '#E5C158',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap');
        `}
      </style>

      {/* Gold Leaf Corner SVGs */}
      {[
        { top: '-20px', left: '-20px', rotate: '0deg' },
        { top: '-20px', right: '-20px', rotate: '90deg' },
        { bottom: '-20px', right: '-20px', rotate: '180deg' },
        { bottom: '-20px', left: '-20px', rotate: '270deg' },
      ].map((pos, idx) => (
        <svg
          key={idx}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            transform: `rotate(${pos.rotate})`,
            width: '300px',
            height: '300px',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
          viewBox="0 0 200 200"
        >
          <path
            d="M20,20 Q80,20 100,80 Q100,20 160,20 Q160,80 100,100 Q140,120 140,160 Q80,160 80,100 Q20,100 20,40"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="3"
          />
          <path d="M40,30 Q90,30 110,80" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          <path d="M110,30 Q160,30 140,80" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="150" cy="50" r="4" fill="#D4AF37" />
          <circle cx="50" cy="50" r="3" fill="#D4AF37" />
          <circle cx="100" cy="120" r="5" fill="#D4AF37" />
        </svg>
      ))}

      <div style={{ textAlign: 'center', zIndex: 2, marginTop: '20px' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '24px', letterSpacing: '8px', textTransform: 'uppercase', color: '#D4AF37', margin: '0 0 40px 0' }}>
          {tagline}
        </p>
      </div>

      <div
        style={{
          position: 'relative',
          width: '500px',
          height: '500px',
          margin: '20px 0 50px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '2px solid #D4AF37',
            transform: 'rotate(45deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '92%',
            height: '92%',
            border: '1px solid #D4AF37',
            transform: 'rotate(45deg)',
          }}
        />
        
        <div
          style={{
            width: '460px',
            height: '460px',
            overflow: 'hidden',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
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
            }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '46px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#E5C158', lineHeight: 1.2, textTransform: 'uppercase' }}>
          {partnerOne} <br /><span style={{ fontSize: '30px', fontWeight: 300, color: '#D4AF37' }}>&amp;</span><br />{partnerTwo}
        </h1>
        
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '22px', color: '#D4AF37', lineHeight: 1.8, letterSpacing: '3px' }}>
          <div>{weddingDate} &nbsp;|&nbsp; {weddingTime}</div>
          <div>{venue}</div>
          <div>{city}</div>
          <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 300 }}>{hashtag}</div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate28;
