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

export default function CardTemplate5({
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
    <div style={{ width: 1080, height: 1080, background: '#EEF4FB', position: 'relative', overflow: 'hidden', fontFamily: "'Cormorant Garamond', Georgia, serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Watercolor blobs */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1080 1080">
        <ellipse cx="80" cy="80" rx="160" ry="140" fill="#A8C4E0" opacity="0.35" />
        <ellipse cx="200" cy="40" rx="100" ry="80" fill="#6A9EC7" opacity="0.25" />
        <ellipse cx="40" cy="200" rx="90" ry="120" fill="#B8A8D4" opacity="0.2" />
        <circle cx="1000" cy="100" r="130" fill="#A8C4E0" opacity="0.3" />
        <ellipse cx="960" cy="200" rx="90" ry="110" fill="#6A9EC7" opacity="0.2" />
        <ellipse cx="80" cy="1000" rx="150" ry="120" fill="#B8A8D4" opacity="0.3" />
        <ellipse cx="200" cy="1050" rx="100" ry="70" fill="#A8C4E0" opacity="0.22" />
        <ellipse cx="1000" cy="980" rx="140" ry="120" fill="#6A9EC7" opacity="0.28" />
        <circle cx="540" cy="1060" r="80" fill="#A8C4E0" opacity="0.15" />
        {/* Petal shapes */}
        <ellipse cx="120" cy="120" rx="30" ry="60" fill="#D4E8F5" opacity="0.4" transform="rotate(-30 120 120)" />
        <ellipse cx="960" cy="120" rx="30" ry="60" fill="#D4E8F5" opacity="0.4" transform="rotate(30 960 120)" />
        <ellipse cx="120" cy="960" rx="30" ry="60" fill="#D4E8F5" opacity="0.4" transform="rotate(30 120 960)" />
        <ellipse cx="960" cy="960" rx="30" ry="60" fill="#D4E8F5" opacity="0.4" transform="rotate(-30 960 960)" />
        {/* Vine bottom */}
        <path d="M 0 1050 Q 270 1000 540 1040 Q 810 1080 1080 1020" stroke="#4A7FA5" strokeWidth="2" fill="none" opacity="0.3" />
        <path d="M 0 1060 Q 270 1010 540 1050 Q 810 1090 1080 1030" stroke="#7B6FA0" strokeWidth="1.5" fill="none" opacity="0.2" />
        {/* Leaf accents */}
        <ellipse cx="200" cy="1050" rx="12" ry="28" fill="#4A7FA5" opacity="0.2" transform="rotate(-40 200 1050)" />
        <ellipse cx="350" cy="1045" rx="10" ry="22" fill="#7B6FA0" opacity="0.2" transform="rotate(20 350 1045)" />
        <ellipse cx="730" cy="1042" rx="10" ry="22" fill="#4A7FA5" opacity="0.2" transform="rotate(-20 730 1042)" />
        <ellipse cx="880" cy="1048" rx="12" ry="28" fill="#7B6FA0" opacity="0.2" transform="rotate(40 880 1048)" />
      </svg>

      {/* Thin lavender border */}
      <div style={{ position: 'absolute', inset: 38, border: '1.5px solid rgba(106,158,199,0.5)', borderRadius: 6 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '70px 100px', width: '100%', boxSizing: 'border-box' }}>
        <p style={{ fontSize: 26, letterSpacing: 8, color: '#4A7FA5', textTransform: 'uppercase', marginBottom: 18, fontWeight: 400 }}>Wedding Invitation</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28, width: '70%' }}>
          <div style={{ flex: 1, height: 1, background: '#7B6FA0', opacity: 0.4 }} />
          <span style={{ color: '#7B6FA0', fontSize: 28, opacity: 0.7 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: '#7B6FA0', opacity: 0.4 }} />
        </div>
        {/* Photo */}
        {couplePhoto && (
          <div style={{ width: 220, height: 220, borderRadius: '50%', overflow: 'hidden', border: '5px solid #A8C4E0', marginBottom: 32, boxShadow: '0 8px 40px rgba(74,127,165,0.25), 0 0 0 10px rgba(168,196,224,0.15)' }}>
            <img src={couplePhoto} alt="Couple" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </div>
        )}
        <p style={{ fontSize: 80, fontWeight: 300, color: '#1C2B4A', lineHeight: 1, textAlign: 'center', fontStyle: 'italic', marginBottom: 8 }}>{partnerOne}</p>
        <p style={{ fontSize: 34, color: '#7B6FA0', letterSpacing: 10, marginBottom: 8 }}>and</p>
        <p style={{ fontSize: 80, fontWeight: 300, color: '#1C2B4A', lineHeight: 1, textAlign: 'center', fontStyle: 'italic', marginBottom: 30 }}>{partnerTwo}</p>
        <p style={{ fontSize: 28, color: '#4A7FA5', fontStyle: 'italic', marginBottom: 28 }}>{tagline}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, width: '60%' }}>
          <div style={{ flex: 1, height: 0.5, background: '#6A9EC7', opacity: 0.5 }} />
          <span style={{ color: '#7B6FA0', fontSize: 20 }}>✿</span>
          <div style={{ flex: 1, height: 0.5, background: '#6A9EC7', opacity: 0.5 }} />
        </div>
        <p style={{ fontSize: 32, color: '#1C2B4A', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 400, marginBottom: 10 }}>{weddingDate}</p>
        <p style={{ fontSize: 26, color: '#4A7FA5', marginBottom: 6 }}>{weddingTime}</p>
        <p style={{ fontSize: 26, color: '#4A7FA5', marginBottom: 4, textAlign: 'center' }}>{venue}</p>
        <p style={{ fontSize: 22, color: '#7B6FA0', marginBottom: 24 }}>{city}</p>
        <p style={{ fontSize: 24, color: '#4A7FA5', letterSpacing: 2, fontStyle: 'italic' }}>{hashtag}</p>
      </div>
    </div>
  );
}
