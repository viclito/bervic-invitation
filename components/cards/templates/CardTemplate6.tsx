interface CardProps {
  partnerOne?: string; partnerTwo?: string; weddingDate?: string; weddingTime?: string;
  venue?: string; city?: string; tagline?: string; couplePhoto?: string; hashtag?: string;
}
export default function CardTemplate6({ partnerOne='Sophia', partnerTwo='Alexander', weddingDate='August 14, 2025', weddingTime='4:00 PM', venue='The Grand Chapel', city='Bangalore, India', tagline='Together Forever', couplePhoto='/images/templates/couple-photo.jpg', hashtag='#ForeverTogether' }: CardProps) {
  return (
    <div style={{ width: 1080, height: 1080, background: 'linear-gradient(145deg,#C8A97A,#B8996A)', position: 'relative', overflow: 'hidden', fontFamily: "'Georgia', 'Times New Roman', serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Paper texture overlay */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08, pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100" height="100" filter="url(#noise)" opacity="1" />
      </svg>
      {/* Corner leaf decorations */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: 200, height: 200, opacity: 0.6 }} viewBox="0 0 200 200">
        <ellipse cx="30" cy="80" rx="15" ry="50" fill="#5C3D2E" transform="rotate(-30 30 80)" />
        <ellipse cx="60" cy="50" rx="12" ry="40" fill="#3D2510" transform="rotate(-15 60 50)" />
        <ellipse cx="80" cy="30" rx="10" ry="35" fill="#5C3D2E" transform="rotate(10 80 30)" />
        <ellipse cx="20" cy="40" rx="8" ry="28" fill="#3D2510" transform="rotate(-50 20 40)" />
      </svg>
      <svg style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, opacity: 0.6, transform: 'scaleX(-1)' }} viewBox="0 0 200 200">
        <ellipse cx="30" cy="80" rx="15" ry="50" fill="#5C3D2E" transform="rotate(-30 30 80)" />
        <ellipse cx="60" cy="50" rx="12" ry="40" fill="#3D2510" transform="rotate(-15 60 50)" />
        <ellipse cx="80" cy="30" rx="10" ry="35" fill="#5C3D2E" transform="rotate(10 80 30)" />
      </svg>
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: 200, height: 200, opacity: 0.6, transform: 'scaleY(-1)' }} viewBox="0 0 200 200">
        <ellipse cx="30" cy="80" rx="15" ry="50" fill="#5C3D2E" transform="rotate(-30 30 80)" />
        <ellipse cx="60" cy="50" rx="12" ry="40" fill="#3D2510" transform="rotate(-15 60 50)" />
        <ellipse cx="80" cy="30" rx="10" ry="35" fill="#5C3D2E" transform="rotate(10 80 30)" />
      </svg>
      <svg style={{ position: 'absolute', bottom: 0, right: 0, width: 200, height: 200, opacity: 0.6, transform: 'scale(-1,-1)' }} viewBox="0 0 200 200">
        <ellipse cx="30" cy="80" rx="15" ry="50" fill="#5C3D2E" transform="rotate(-30 30 80)" />
        <ellipse cx="60" cy="50" rx="12" ry="40" fill="#3D2510" transform="rotate(-15 60 50)" />
        <ellipse cx="80" cy="30" rx="10" ry="35" fill="#5C3D2E" transform="rotate(10 80 30)" />
      </svg>
      {/* Central cream panel */}
      <div style={{ position: 'relative', zIndex: 10, width: 780, background: '#F5EDD8', borderRadius: 6, padding: '52px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, boxShadow: '0 8px 40px rgba(61,37,16,0.3)' }}>
        {/* Stamp circle */}
        <div style={{ position: 'absolute', top: 28, right: 28, width: 80, height: 80, borderRadius: '50%', border: '3px solid #3D2510', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, transform: 'rotate(-15deg)' }}>
          <span style={{ fontSize: 16, color: '#3D2510', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Est. 2025</span>
        </div>
        <p style={{ fontSize: 28, letterSpacing: 6, fontWeight: 400, color: '#5C3D2E', textTransform: 'uppercase', marginBottom: 14 }}>The Wedding of</p>
        {/* Rope divider */}
        <div style={{ width: '100%', borderTop: '2px dashed rgba(61,37,16,0.3)', marginBottom: 22 }} />
        {/* Photo */}
        {couplePhoto && (
          <div style={{ width: 190, height: 190, borderRadius: 16, overflow: 'hidden', border: '4px solid #8B6A4A', marginBottom: 26, boxShadow: '0 4px 20px rgba(61,37,16,0.2)' }}>
            <img src={couplePhoto} alt="Couple" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.15)' }} crossOrigin="anonymous" />
          </div>
        )}
        <p style={{ fontSize: 84, fontWeight: 600, color: '#3D2510', lineHeight: 1, textAlign: 'center', fontStyle: 'italic', marginBottom: 6 }}>{partnerOne}</p>
        <p style={{ fontSize: 42, color: '#8B6A4A', fontWeight: 500, letterSpacing: 6, marginBottom: 6 }}>& </p>
        <p style={{ fontSize: 84, fontWeight: 600, color: '#3D2510', lineHeight: 1, textAlign: 'center', fontStyle: 'italic', marginBottom: 24 }}>{partnerTwo}</p>
        <div style={{ width: '100%', borderTop: '2px dashed rgba(61,37,16,0.3)', marginBottom: 22 }} />
        <p style={{ fontSize: 32, color: '#5C3D2E', fontWeight: 500, fontStyle: 'italic', marginBottom: 18 }}>{tagline}</p>
        <p style={{ fontSize: 36, color: '#3D2510', fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>{weddingDate}</p>
        <p style={{ fontSize: 30, color: '#5C3D2E', fontWeight: 500, marginBottom: 4 }}>{weddingTime}  •  {venue}</p>
        <p style={{ fontSize: 26, color: '#8B6A4A', fontWeight: 500, marginBottom: 18 }}>{city}</p>
        <div style={{ width: '100%', borderTop: '2px dashed rgba(61,37,16,0.2)', marginBottom: 14 }} />
        <p style={{ fontSize: 26, color: '#5C3D2E', fontWeight: 600, letterSpacing: 2, fontStyle: 'italic' }}>{hashtag}</p>
      </div>
    </div>
  );
}
