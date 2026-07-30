interface CardProps {
  partnerOne?: string; partnerTwo?: string; weddingDate?: string; weddingTime?: string;
  venue?: string; city?: string; tagline?: string; couplePhoto?: string; hashtag?: string;
}

export default function CardTemplate9({ partnerOne='Sophia', partnerTwo='Alexander', weddingDate='August 14, 2025', weddingTime='4:00 PM', venue='The Grand Chapel', city='Bangalore, India', tagline='Together Forever', couplePhoto='/images/templates/couple-photo.jpg', hashtag='#ForeverTogether' }: CardProps) {
  return (
    <div style={{ width: 1080, height: 1080, background: '#F4F8F1', position: 'relative', overflow: 'hidden', fontFamily: "'Cormorant Garamond', Georgia, serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5, pointerEvents: 'none' }} viewBox="0 0 1080 1080">
        <path d="M 0 150 Q 150 50 300 200 T 600 150" stroke="#7A9A60" strokeWidth="3" fill="none" opacity="0.4" />
        <circle cx="100" cy="120" r="18" fill="#E8A8A8" opacity="0.6" />
        <circle cx="220" cy="180" r="14" fill="#F5E0A3" opacity="0.6" />
        <circle cx="980" cy="960" r="22" fill="#E8A8A8" opacity="0.6" />
        <path d="M 780 930 Q 900 1000 1080 900" stroke="#7A9A60" strokeWidth="3" fill="none" opacity="0.4" />
      </svg>
      <div style={{ position: 'absolute', inset: 40, border: '2px solid rgba(122,154,96,0.4)', borderRadius: 12 }} />
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 80px', width: '100%', boxSizing: 'border-box' }}>
        <p style={{ fontSize: 24, letterSpacing: 8, color: '#7A9A60', textTransform: 'uppercase', marginBottom: 16 }}>Whimsical Garden Wedding</p>
        {couplePhoto && (
          <div style={{ width: 240, height: 240, borderRadius: '50%', overflow: 'hidden', border: '6px solid #7A9A60', marginBottom: 28, boxShadow: '0 8px 30px rgba(122,154,96,0.25)' }}>
            <img src={couplePhoto} alt="Couple" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </div>
        )}
        <p style={{ fontSize: 78, fontStyle: 'italic', color: '#2F4F2F', lineHeight: 1, marginBottom: 6 }}>{partnerOne}</p>
        <p style={{ fontSize: 32, color: '#7A9A60', letterSpacing: 8, marginBottom: 6 }}>&amp;</p>
        <p style={{ fontSize: 78, fontStyle: 'italic', color: '#2F4F2F', lineHeight: 1, marginBottom: 24 }}>{partnerTwo}</p>
        <p style={{ fontSize: 26, color: '#556B2F', fontStyle: 'italic', marginBottom: 20 }}>{tagline}</p>
        <p style={{ fontSize: 30, color: '#2F4F2F', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{weddingDate}</p>
        <p style={{ fontSize: 24, color: '#7A9A60', marginBottom: 4 }}>{weddingTime} • {venue}</p>
        <p style={{ fontSize: 20, color: '#556B2F', marginBottom: 20 }}>{city}</p>
        <p style={{ fontSize: 22, color: '#7A9A60', letterSpacing: 2 }}>{hashtag}</p>
      </div>
    </div>
  );
}
