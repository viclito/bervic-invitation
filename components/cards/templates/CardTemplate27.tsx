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

const CardTemplate27: React.FC<CardProps> = ({
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
        backgroundColor: '#F5E8D0',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        boxSizing: 'border-box',
        color: '#4A3525',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
        `}
      </style>
      
      {/* Airmail Border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: '25px solid transparent',
          borderImage: 'repeating-linear-gradient(-45deg, #c43a31, #c43a31 20px, transparent 20px, transparent 40px, #2a5a8a 40px, #2a5a8a 60px, transparent 60px, transparent 80px) 25',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Postmark Stamp */}
      <svg
        style={{
          position: 'absolute',
          top: '60px',
          right: '60px',
          width: '180px',
          height: '180px',
          opacity: 0.6,
          zIndex: 2,
        }}
        viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="85" fill="none" stroke="#c43a31" strokeWidth="4" />
        <circle cx="100" cy="100" r="75" fill="none" stroke="#c43a31" strokeWidth="2" />
        <path d="M 40,100 A 60,60 0 0,1 160,100" fill="none" stroke="none" id="curve" />
        <text style={{ fontSize: '24px', fontFamily: "'Courier Prime', monospace", fill: '#c43a31', letterSpacing: '4px' }}>
          <textPath href="#curve" startOffset="50%" textAnchor="middle">AIR MAIL</textPath>
        </text>
        <text x="100" y="115" style={{ fontSize: '32px', fontFamily: "'Special Elite', cursive", fill: '#c43a31', fontWeight: 'bold' }} textAnchor="middle">
          LOVE
        </text>
        <path d="M 20,80 L 180,80" stroke="#c43a31" strokeWidth="2" opacity="0.5" transform="rotate(30 100 100)" />
        <path d="M 20,100 L 180,100" stroke="#c43a31" strokeWidth="2" opacity="0.5" transform="rotate(30 100 100)" />
        <path d="M 20,120 L 180,120" stroke="#c43a31" strokeWidth="2" opacity="0.5" transform="rotate(30 100 100)" />
      </svg>

      {/* Inner Content */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 3,
        }}
      >
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: '28px', margin: '0 0 20px 0', letterSpacing: '4px', textTransform: 'uppercase' }}>
            {tagline}
          </p>
          <h1 style={{ fontFamily: "'Special Elite', cursive", fontSize: '72px', margin: 0, lineHeight: 1.2 }}>
            {partnerOne} <br/> &amp; <br/> {partnerTwo}
          </h1>
        </div>

        {/* Vintage Photo */}
        <div style={{ position: 'relative', margin: '40px 0' }}>
          {/* Photo Corners */}
          <div style={{ position: 'absolute', top: '-15px', left: '-15px', width: '40px', height: '40px', borderTop: '4px solid #4A3525', borderLeft: '4px solid #4A3525' }} />
          <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '40px', height: '40px', borderTop: '4px solid #4A3525', borderRight: '4px solid #4A3525' }} />
          <div style={{ position: 'absolute', bottom: '-15px', left: '-15px', width: '40px', height: '40px', borderBottom: '4px solid #4A3525', borderLeft: '4px solid #4A3525' }} />
          <div style={{ position: 'absolute', bottom: '-15px', right: '-15px', width: '40px', height: '40px', borderBottom: '4px solid #4A3525', borderRight: '4px solid #4A3525' }} />
          
          <img
            src={couplePhoto}
            alt="Couple"
            crossOrigin="anonymous"
            style={{
              width: '460px',
              height: '340px',
              objectFit: 'cover',
              border: '8px solid #fff',
              boxShadow: '2px 4px 15px rgba(0,0,0,0.1)',
              filter: 'sepia(40%) contrast(110%)',
            }}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px', width: '100%', fontFamily: "'Courier Prime', monospace", fontSize: '26px', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '80%', margin: '0 auto 20px auto', borderTop: '1px solid #4A3525', borderBottom: '1px solid #4A3525', padding: '15px 0' }}>
            <span>{weddingDate}</span>
            <span style={{ fontSize: '32px' }}>✦</span>
            <span>{weddingTime}</span>
          </div>
          <div>{venue}</div>
          <div>{city}</div>
          <div style={{ marginTop: '20px', fontSize: '22px', fontStyle: 'italic', letterSpacing: '2px' }}>
            {hashtag}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate27;
