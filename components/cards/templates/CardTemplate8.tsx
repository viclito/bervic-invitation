interface CardProps {
  partnerOne?: string; partnerTwo?: string; weddingDate?: string; weddingTime?: string;
  venue?: string; city?: string; tagline?: string; couplePhoto?: string; hashtag?: string;
}
export default function CardTemplate8({ partnerOne='Sophia', partnerTwo='Alexander', weddingDate='August 14, 2025', weddingTime='4:00 PM', venue='The Grand Chapel', city='Bangalore, India', tagline='Together Forever', couplePhoto='/images/templates/couple-photo.jpg', hashtag='#ForeverTogether' }: CardProps) {
  return (
    <div style={{ width: 1080, height: 1080, background: '#0F0F0F', position: 'relative', overflow: 'hidden', fontFamily: "'Georgia', 'Times New Roman', serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Art Deco sunburst */}
      <svg style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, opacity: 0.18 }} viewBox="0 0 600 300">
        {Array.from({ length: 18 }, (_, i) => {
          const angle = (i * 10 - 90) * Math.PI / 180;
          const x2 = 300 + Math.cos(angle) * 280;
          const y2 = Math.sin(angle) * 280;
          return <line key={i} x1="300" y1="0" x2={x2} y2={y2} stroke="#D4AF37" strokeWidth="1.5" />;
        })}
      </svg>
      {/* Geometric border */}
      <div style={{ position: 'absolute', inset: 40, border: '1.5px solid rgba(212,175,55,0.5)' }} />
      <div style={{ position: 'absolute', inset: 48, border: '0.5px solid rgba(212,175,55,0.25)' }} />
      {/* Corner diamonds */}
      <svg style={{ position: 'absolute', top: 28, left: 28, width: 40, height: 40 }} viewBox="0 0 40 40">
        <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
        <polygon points="20,8 32,20 20,32 8,20" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
      </svg>
      <svg style={{ position: 'absolute', top: 28, right: 28, width: 40, height: 40 }} viewBox="0 0 40 40">
        <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
        <polygon points="20,8 32,20 20,32 8,20" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
      </svg>
      <svg style={{ position: 'absolute', bottom: 28, left: 28, width: 40, height: 40 }} viewBox="0 0 40 40">
        <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
        <polygon points="20,8 32,20 20,32 8,20" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
      </svg>
      <svg style={{ position: 'absolute', bottom: 28, right: 28, width: 40, height: 40 }} viewBox="0 0 40 40">
        <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
        <polygon points="20,8 32,20 20,32 8,20" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
      </svg>
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '70px 120px', width: '100%', boxSizing: 'border-box' }}>
        <p style={{ fontSize: 28, letterSpacing: 10, color: '#E8E8E8', textTransform: 'uppercase', marginBottom: 20, fontWeight: 600, opacity: 0.95 }}>Save the Date</p>
        {/* Chevron divider */}
        <svg style={{ marginBottom: 24, opacity: 0.8 }} width="200" height="20" viewBox="0 0 200 20">
          <polyline points="0,10 25,2 50,10 75,2 100,10 125,2 150,10 175,2 200,10" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
        </svg>
        {/* Diamond photo frame */}
        {couplePhoto && (
          <div style={{ width: 210, height: 210, position: 'relative', marginBottom: 30 }}>
            <div style={{ width: 190, height: 190, position: 'absolute', top: 10, left: 10, transform: 'rotate(45deg)', overflow: 'hidden', border: '3px solid #D4AF37', boxShadow: '0 0 30px rgba(212,175,55,0.3)' }}>
              <img src={couplePhoto} alt="Couple" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(-45deg) scale(1.5)' }} crossOrigin="anonymous" />
            </div>
          </div>
        )}
        <p style={{ fontSize: 80, fontWeight: 600, color: '#D4AF37', lineHeight: 1.05, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 8, marginBottom: 6 }}>{partnerOne}</p>
        <p style={{ fontSize: 38, color: 'rgba(212,175,55,0.75)', letterSpacing: 10, marginBottom: 6 }}>&amp;</p>
        <p style={{ fontSize: 80, fontWeight: 600, color: '#D4AF37', lineHeight: 1.05, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 8, marginBottom: 20 }}>{partnerTwo}</p>
        {/* Chevron divider */}
        <svg style={{ marginBottom: 20, opacity: 0.8 }} width="200" height="20" viewBox="0 0 200 20">
          <polyline points="0,10 25,18 50,10 75,18 100,10 125,18 150,10 175,18 200,10" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
        </svg>
        <p style={{ fontSize: 36, color: '#D4AF37', letterSpacing: 4, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>{weddingDate}</p>
        <p style={{ fontSize: 30, color: 'rgba(212,175,55,0.85)', fontWeight: 600, marginBottom: 4 }}>{weddingTime}  ◆  {venue}</p>
        <p style={{ fontSize: 26, color: 'rgba(212,175,55,0.7)', fontWeight: 500, marginBottom: 18 }}>{city}</p>
        <p style={{ fontSize: 26, color: '#E8E8E8', letterSpacing: 3, fontWeight: 600 }}>{hashtag}</p>
      </div>
    </div>
  );
}
