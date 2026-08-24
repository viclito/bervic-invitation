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
      style={{ width: '1080px', height: '1080px', backgroundColor: '#141E18', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', boxSizing: 'border-box', color: '#E5C158' }}
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

      <div style={{ textAlign: 'center', zIndex: 2, marginBottom: '16px' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '28px', fontWeight: 600, letterSpacing: '8px', textTransform: 'uppercase', color: '#D4AF37', margin: 0 }}>
          {tagline}
        </p>
      </div>

      <div
        style={{ position: 'relative', width: '340px', height: '340px', margin: '14px 0 20px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}
      >
        <div
          style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #D4AF37', transform: 'rotate(45deg)' }}
        />
        <div
          style={{ position: 'absolute', width: '90%', height: '90%', border: '1px solid #D4AF37', transform: 'rotate(45deg)' }}
        />
        
        <div
          style={{ width: '300px', height: '300px', overflow: 'hidden', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
        >
          <img
            src={couplePhoto}
            alt="Couple"
            crossOrigin="anonymous"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', zIndex: 2, width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textAlign: 'center', marginBottom: '14px' }}>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '66px', fontWeight: 700, margin: 0, color: '#E5C158', lineHeight: 1.05, textTransform: 'uppercase' }}>
            {partnerOne}
          </h1>
          <span style={{ fontSize: '36px', color: '#D4AF37', margin: '0' }}>&amp;</span>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '66px', fontWeight: 700, margin: 0, color: '#E5C158', lineHeight: 1.05, textTransform: 'uppercase' }}>
            {partnerTwo}
          </h1>
        </div>
        
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '28px', fontWeight: 600, color: '#D4AF37', lineHeight: 1.4, letterSpacing: '2px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#FFF' }}>{weddingDate} &nbsp;|&nbsp; {weddingTime}</div>
          <div style={{ marginTop: '6px', fontSize: '30px' }}>{venue}</div>
          <div style={{ fontSize: '26px', color: '#C8A845' }}>{city}</div>
          <div style={{ marginTop: '14px', fontSize: '26px', fontWeight: 600, color: '#E5C158', letterSpacing: '3px' }}>{hashtag}</div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate28;
