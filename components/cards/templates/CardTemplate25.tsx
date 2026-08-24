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

export default function CardTemplate25({
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
      style={{ width: '1080px', height: '1080px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxSizing: 'border-box' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Open+Sans:wght@300;400&display=swap');
        `}
      </style>

      {/* Blurred Background */}
      <img
        src={couplePhoto}
        alt="Background"
        crossOrigin="anonymous"
        style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', objectFit: 'cover', filter: 'blur(30px) brightness(1.2)', zIndex: 0 }}
      />
      <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)', zIndex: 0 }} />

      {/* Frosted Glass Panel */}
      <div
        style={{ width: '900px', height: '900px', backgroundColor: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.9)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', boxSizing: 'border-box', zIndex: 1 }}
      >
        <p style={{ fontFamily: '"Open Sans", sans-serif', fontSize: '28px', fontWeight: 600, letterSpacing: '5px', color: '#475569', textTransform: 'uppercase', marginBottom: '40px' }}>
          {tagline}
        </p>

        <div
          style={{ width: '240px', height: '240px', borderRadius: '50%', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', border: '4px solid #FFFFFF' }}
        >
          <img
            src={couplePhoto}
            alt="Couple"
            crossOrigin="anonymous"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: '84px', fontWeight: '400', color: '#1E293B', margin: '0 0 10px 0', textAlign: 'center' }}>
          {partnerOne}
        </h1>
        <h2 style={{ fontFamily: '"Cinzel", serif', fontSize: '46px', fontWeight: '400', color: '#64748B', margin: '0 0 10px 0', textAlign: 'center' }}>
          &
        </h2>
        <h1 style={{ fontFamily: '"Cinzel", serif', fontSize: '84px', fontWeight: '400', color: '#1E293B', margin: '0 0 50px 0', textAlign: 'center' }}>
          {partnerTwo}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <p style={{ fontFamily: '"Open Sans", sans-serif', fontSize: '34px', fontWeight: '400', color: '#334155', margin: '0', letterSpacing: '2px' }}>
            {weddingDate} AT {weddingTime}
          </p>
          <p style={{ fontFamily: '"Open Sans", sans-serif', fontSize: '28px', fontWeight: '300', color: '#475569', margin: '0', letterSpacing: '1px' }}>
            {venue}, {city}
          </p>
        </div>

        <p style={{ fontFamily: '"Open Sans", sans-serif', fontSize: '28px', fontWeight: 600, color: '#64748B', margin: '30px 0 0 0', letterSpacing: '2px' }}>
          {hashtag}
        </p>
      </div>
    </div>
  );
}
