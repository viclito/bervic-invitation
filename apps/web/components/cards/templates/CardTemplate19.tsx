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

export default function CardTemplate19({
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
      style={{ width: '1080px', height: '1080px', backgroundColor: '#F4EBE1', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxSizing: 'border-box', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Tangerine:wght@700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
        `}
      </style>

      {/* Painted Brush Strokes SVGs */}
      <svg style={{ position: 'absolute', top: '-50px', left: '-50px', opacity: 0.6, width: '400px', height: '400px', pointerEvents: 'none' }} viewBox="0 0 200 200">
        <path d="M 20 100 Q 80 50 150 120 Q 180 150 190 100 Q 150 40 50 80 Z" fill="#708238" opacity="0.4" filter="blur(10px)" />
      </svg>
      <svg style={{ position: 'absolute', bottom: '-80px', right: '-80px', opacity: 0.6, width: '500px', height: '500px', pointerEvents: 'none' }} viewBox="0 0 200 200">
        <path d="M 10 150 Q 80 180 150 120 Q 190 80 160 30 Q 100 80 50 120 Z" fill="#CC7722" opacity="0.3" filter="blur(15px)" />
      </svg>

      <div
        style={{ width: '920px', padding: '40px 60px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#332211', zIndex: 1 }}
      >
        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '30px', fontWeight: 600, fontStyle: 'italic', marginBottom: '20px', color: '#5C4A3D' }}>
          {tagline}
        </div>

        {/* Painted Edge Photo Frame */}
        <div
          style={{ position: 'relative', width: '380px', height: '340px', marginBottom: '24px', backgroundColor: '#fff', padding: '12px', boxShadow: '0 16px 36px rgba(0,0,0,0.12)', borderRadius: '2px' }}
        >
          <div
            style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' preserveAspectRatio=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M 2 2 L 98 3 L 97 98 L 3 97 Z\' fill=\'black\'/%3E%3C/svg%3E")', WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' preserveAspectRatio=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M 2 2 L 98 3 L 97 98 L 3 97 Z\' fill=\'black\'/%3E%3C/svg%3E")', maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }}
          >
            <img
              src={couplePhoto}
              alt="Couple"
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.3) saturate(1.2) contrast(1.1)' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textAlign: 'center', margin: '0 0 16px 0', width: '100%' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '68px', lineHeight: 1.05, fontWeight: 700, textAlign: 'center', color: '#332211', margin: 0 }}>{partnerOne}</h1>
          <span style={{ fontSize: '38px', color: '#CC7722', margin: '0' }}>&amp;</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '68px', lineHeight: 1.05, fontWeight: 700, textAlign: 'center', color: '#332211', margin: 0 }}>{partnerTwo}</h1>
        </div>

        <div
          style={{ fontFamily: "'EB Garamond', serif", fontSize: '30px', fontWeight: 600, letterSpacing: '1px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textTransform: 'uppercase', color: '#5C4A3D', textAlign: 'center' }}
        >
          <div style={{ fontSize: '34px', fontWeight: 700, color: '#332211' }}>{weddingDate} &bull; {weddingTime}</div>
          <div style={{ fontSize: '30px' }}>{venue}</div>
          <div style={{ fontSize: '26px', color: '#6A574A' }}>{city}</div>
          <div style={{ marginTop: '12px', fontStyle: 'italic', textTransform: 'none', fontSize: '28px', fontWeight: 700, color: '#CC7722' }}>
            {hashtag}
          </div>
        </div>
      </div>
    </div>
  );
}
