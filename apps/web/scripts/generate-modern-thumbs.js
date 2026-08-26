const sharp = require('sharp');
const path = require('path');

const targetDir = path.join(process.cwd(), 'public', 'images', 'canva');

async function createModernThumbnails() {
  const svg1 = `<svg width="320" height="440" viewBox="0 0 320 440" xmlns="http://www.w3.org/2000/svg">
    <rect width="320" height="440" fill="#FBFBFA" rx="16" />
    <rect x="16" y="16" width="288" height="408" fill="none" stroke="#D9C3A5" stroke-width="1.5" rx="12" />
    
    <circle cx="160" cy="75" r="28" fill="none" stroke="#8C6B1B" stroke-width="1.2" />
    <text x="160" y="80" font-family="serif" font-size="14" font-weight="bold" fill="#8C6B1B" text-anchor="middle" letter-spacing="3">S • A</text>
    
    <text x="160" y="130" font-family="sans-serif" font-size="8" font-weight="700" fill="#7A6B5B" text-anchor="middle" letter-spacing="3">TOGETHER WITH THEIR FAMILIES</text>
    
    <text x="160" y="175" font-family="serif" font-size="24" font-style="italic" fill="#1A1A1A" text-anchor="middle">Sophia</text>
    <text x="160" y="200" font-family="sans-serif" font-size="9" font-weight="600" fill="#8C6B1B" text-anchor="middle" letter-spacing="4">AND</text>
    <text x="160" y="235" font-family="serif" font-size="24" font-style="italic" fill="#1A1A1A" text-anchor="middle">Alexander</text>
    
    <line x1="80" y1="265" x2="240" y2="265" stroke="#D9C3A5" stroke-width="1" />
    <text x="160" y="290" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1A1A1A" text-anchor="middle" letter-spacing="2">OCTOBER 30, 2026</text>
    <text x="160" y="310" font-family="sans-serif" font-size="8" font-weight="500" fill="#7A6B5B" text-anchor="middle" letter-spacing="1.5">6:30 PM • THE PALACE</text>
    <line x1="80" y1="330" x2="240" y2="330" stroke="#D9C3A5" stroke-width="1" />
    
    <text x="160" y="370" font-family="sans-serif" font-size="7.5" font-weight="600" fill="#8C6B1B" text-anchor="middle" letter-spacing="2">RSVP • RECEPTION TO FOLLOW</text>
  </svg>`;

  await sharp(Buffer.from(svg1))
    .webp({ quality: 90 })
    .toFile(path.join(targetDir, 'modern1-thumb.webp'));
  console.log('Saved modern1-thumb.webp');

  const svg2 = `<svg width="320" height="440" viewBox="0 0 320 440" xmlns="http://www.w3.org/2000/svg">
    <rect width="320" height="440" fill="#121417" rx="16" />
    <rect x="16" y="16" width="288" height="408" fill="none" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.6" rx="12" />
    
    <text x="160" y="70" font-family="sans-serif" font-size="8" font-weight="700" fill="#D4AF37" text-anchor="middle" letter-spacing="4">THE WEDDING OF</text>
    
    <text x="160" y="130" font-family="serif" font-size="28" font-weight="400" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">SOPHIA</text>
    <text x="160" y="160" font-family="sans-serif" font-size="14" font-weight="300" fill="#D4AF37" text-anchor="middle">&amp;</text>
    <text x="160" y="195" font-family="serif" font-size="28" font-weight="400" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">ALEXANDER</text>
    
    <rect x="50" y="230" width="220" height="80" fill="#1B1F24" rx="8" stroke="#D4AF37" stroke-width="0.8" stroke-opacity="0.4" />
    <text x="160" y="260" font-family="sans-serif" font-size="10" font-weight="bold" fill="#D4AF37" text-anchor="middle" letter-spacing="2">30 . 10 . 2026</text>
    <text x="160" y="285" font-family="sans-serif" font-size="8" font-weight="500" fill="#E0E0E0" text-anchor="middle" letter-spacing="1">ELAMBA MUDAKKAL PALACE</text>
    
    <text x="160" y="360" font-family="sans-serif" font-size="8" font-weight="600" fill="#9E9E9E" text-anchor="middle" letter-spacing="2">RECEPTION TO FOLLOW</text>
  </svg>`;

  await sharp(Buffer.from(svg2))
    .webp({ quality: 90 })
    .toFile(path.join(targetDir, 'modern2-thumb.webp'));
  console.log('Saved modern2-thumb.webp');
}

createModernThumbnails();
