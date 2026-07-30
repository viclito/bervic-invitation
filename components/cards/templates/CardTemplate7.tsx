interface CardProps {
  partnerOne?: string; partnerTwo?: string; weddingDate?: string; weddingTime?: string;
  venue?: string; city?: string; tagline?: string; couplePhoto?: string; hashtag?: string;
}
export default function CardTemplate7({ partnerOne='Sophia', partnerTwo='Alexander', weddingDate='August 14, 2025', weddingTime='4:00 PM', venue='The Grand Chapel', city='Bangalore, India', tagline='Together Forever', couplePhoto='/images/templates/couple-photo.jpg', hashtag='#ForeverTogether' }: CardProps) {
  return (
    <div style={{ width: 1080, height: 1080, background: '#1C3A2A', position: 'relative', overflow: 'hidden', fontFamily: "'Georgia', 'Times New Roman', serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Tropical leaf illustrations */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: 320, height: 400, opacity: 0.7 }} viewBox="0 0 320 400">
        <ellipse cx="60" cy="200" rx="40" ry="150" fill="#2D5A3F" transform="rotate(-20 60 200)" />
        <ellipse cx="110" cy="150" rx="30" ry="120" fill="#3D7A52" transform="rotate(-10 110 150)" />
        <ellipse cx="30" cy="280" rx="25" ry="100" fill="#4A9E6B" transform="rotate(-35 30 280)" />
        <ellipse cx="160" cy="80" rx="20" ry="80" fill="#2D5A3F" transform="rotate(10 160 80)" />
        <ellipse cx="80" cy="80" rx="18" ry="60" fill="#3D7A52" transform="rotate(-45 80 80)" />
      </svg>
      <svg style={{ position: 'absolute', top: 0, right: 0, width: 320, height: 400, opacity: 0.7, transform: 'scaleX(-1)' }} viewBox="0 0 320 400">
        <ellipse cx="60" cy="200" rx="40" ry="150" fill="#2D5A3F" transform="rotate(-20 60 200)" />
        <ellipse cx="110" cy="150" rx="30" ry="120" fill="#3D7A52" transform="rotate(-10 110 150)" />
        <ellipse cx="30" cy="280" rx="25" ry="100" fill="#4A9E6B" transform="rotate(-35 30 280)" />
        <ellipse cx="160" cy="80" rx="20" ry="80" fill="#2D5A3F" transform="rotate(10 160 80)" />
      </svg>
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: 320, height: 400, opacity: 0.7, transform: 'scaleY(-1)' }} viewBox="0 0 320 400">
        <ellipse cx="60" cy="200" rx="40" ry="150" fill="#2D5A3F" transform="rotate(-20 60 200)" />
        <ellipse cx="110" cy="150" rx="30" ry="120" fill="#3D7A52" transform="rotate(-10 110 150)" />
        <ellipse cx="30" cy="280" rx="25" ry="100" fill="#4A9E6B" transform="rotate(-35 30 280)" />
      </svg>
      <svg style={{ position: 'absolute', bottom: 0, right: 0, width: 320, height: 400, opacity: 0.7, transform: 'scale(-1,-1)' }} viewBox="0 0 320 400">
        <ellipse cx="60" cy="200" rx="40" ry="150" fill="#2D5A3F" transform="rotate(-20 60 200)" />
        <ellipse cx="110" cy="150" rx="30" ry="120" fill="#3D7A52" transform="rotate(-10 110 150)" />
        <ellipse cx="30" cy="280" rx="25" ry="100" fill="#4A9E6B" transform="rotate(-35 30 280)" />
      </svg>
      {/* Gold border */}
      <div style={{ position: 'absolute', inset: 44, border: '1.5px solid rgba(212,175,112,0.6)' }} />
      <div style={{ position: 'absolute', inset: 52, border: '0.5px solid rgba(212,175,112,0.3)' }} />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '70px 120px', width: '100%', boxSizing: 'border-box' }}>
        <p style={{ fontSize: 22, letterSpacing: 8, color: '#D4AF70', textTransform: 'uppercase', marginBottom: 22, fontWeight: 400 }}>We Are Getting Married</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30, width: '70%' }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
          <span style={{ color: '#D4AF70', fontSize: 26 }}>❧</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
        </div>
        {/* Photo */}
        {couplePhoto && (
          <div style={{ width: 260, height: 260, borderRadius: '50%', overflow: 'hidden', border: '6px solid #D4AF70', marginBottom: 32, boxShadow: '0 0 0 3px rgba(212,175,112,0.3), 0 8px 40px rgba(0,0,0,0.5)' }}>
            <img src={couplePhoto} alt="Couple" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </div>
        )}
        <p style={{ fontSize: 76, fontWeight: 400, color: '#D4AF70', lineHeight: 1.05, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 8 }}>{partnerOne}</p>
        <p style={{ fontSize: 32, color: 'rgba(212,175,112,0.6)', letterSpacing: 10, marginBottom: 8 }}>AND</p>
        <p style={{ fontSize: 76, fontWeight: 400, color: '#D4AF70', lineHeight: 1.05, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 28 }}>{partnerTwo}</p>
        <p style={{ fontSize: 26, color: 'rgba(212,175,112,0.7)', fontStyle: 'italic', marginBottom: 26 }}>{tagline}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 26, width: '60%' }}>
          <div style={{ flex: 1, height: 0.5, background: 'rgba(212,175,112,0.4)' }} />
          <span style={{ color: '#C9A84C', fontSize: 18 }}>◆</span>
          <div style={{ flex: 1, height: 0.5, background: 'rgba(212,175,112,0.4)' }} />
        </div>
        <p style={{ fontSize: 30, color: '#D4AF70', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>{weddingDate}</p>
        <p style={{ fontSize: 24, color: 'rgba(212,175,112,0.7)', marginBottom: 6 }}>{weddingTime}</p>
        <p style={{ fontSize: 24, color: 'rgba(212,175,112,0.7)', marginBottom: 4, textAlign: 'center' }}>{venue}</p>
        <p style={{ fontSize: 20, color: 'rgba(212,175,112,0.5)', marginBottom: 22 }}>{city}</p>
        <p style={{ fontSize: 22, color: 'rgba(212,175,112,0.6)', letterSpacing: 2, fontStyle: 'italic' }}>{hashtag}</p>
      </div>
    </div>
  );
}
