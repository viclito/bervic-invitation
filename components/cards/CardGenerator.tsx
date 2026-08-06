'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import PricingCheckoutModal from '@/components/payment/PricingCheckoutModal';
import { Download, Image as ImageIcon, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const CardTemplate1 = dynamic(() => import('./templates/CardTemplate1'), { ssr: false });
const CardTemplate2 = dynamic(() => import('./templates/CardTemplate2'), { ssr: false });
const CardTemplate3 = dynamic(() => import('./templates/CardTemplate3'), { ssr: false });
const CardTemplate4 = dynamic(() => import('./templates/CardTemplate4'), { ssr: false });
const CardTemplate5 = dynamic(() => import('./templates/CardTemplate5'), { ssr: false });
const CardTemplate6 = dynamic(() => import('./templates/CardTemplate6'), { ssr: false });
const CardTemplate7 = dynamic(() => import('./templates/CardTemplate7'), { ssr: false });
const CardTemplate8 = dynamic(() => import('./templates/CardTemplate8'), { ssr: false });
const CardTemplate9 = dynamic(() => import('./templates/CardTemplate9'), { ssr: false });
const CardTemplate10 = dynamic(() => import('./templates/CardTemplate10'), { ssr: false });
const CardTemplate11 = dynamic(() => import('./templates/CardTemplate11'), { ssr: false });
const CardTemplate12 = dynamic(() => import('./templates/CardTemplate12'), { ssr: false });
const CardTemplate13 = dynamic(() => import('./templates/CardTemplate13'), { ssr: false });
const CardTemplate14 = dynamic(() => import('./templates/CardTemplate14'), { ssr: false });
const CardTemplate15 = dynamic(() => import('./templates/CardTemplate15'), { ssr: false });
const CardTemplate16 = dynamic(() => import('./templates/CardTemplate16'), { ssr: false });
const CardTemplate17 = dynamic(() => import('./templates/CardTemplate17'), { ssr: false });
const CardTemplate18 = dynamic(() => import('./templates/CardTemplate18'), { ssr: false });
const CardTemplate19 = dynamic(() => import('./templates/CardTemplate19'), { ssr: false });
const CardTemplate20 = dynamic(() => import('./templates/CardTemplate20'), { ssr: false });
const CardTemplate21 = dynamic(() => import('./templates/CardTemplate21'), { ssr: false });
const CardTemplate22 = dynamic(() => import('./templates/CardTemplate22'), { ssr: false });
const CardTemplate23 = dynamic(() => import('./templates/CardTemplate23'), { ssr: false });
const CardTemplate24 = dynamic(() => import('./templates/CardTemplate24'), { ssr: false });
const CardTemplate25 = dynamic(() => import('./templates/CardTemplate25'), { ssr: false });
const CardTemplate26 = dynamic(() => import('./templates/CardTemplate26'), { ssr: false });
const CardTemplate27 = dynamic(() => import('./templates/CardTemplate27'), { ssr: false });
const CardTemplate28 = dynamic(() => import('./templates/CardTemplate28'), { ssr: false });
const CardTemplate29 = dynamic(() => import('./templates/CardTemplate29'), { ssr: false });
const CardTemplate30 = dynamic(() => import('./templates/CardTemplate30'), { ssr: false });
const CardTemplate31 = dynamic(() => import('./templates/CardTemplate31'), { ssr: false });

export interface CardFormData {
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  city: string;
  tagline: string;
  couplePhoto: string;
  hashtag: string;
}

const TEMPLATES = [
  { id: 1, name: 'Pink Floral', tag: 'Romantic', color: '#F4C6C6', bg: '#FDF6F0' },
  { id: 2, name: 'Boho Earthy', tag: 'Bohemian', color: '#C4714A', bg: '#F5E6D3' },
  { id: 3, name: 'Classic Mono', tag: 'Formal', color: '#1A1A1A', bg: '#FFFFFF' },
  { id: 4, name: 'Modern Side', tag: 'Modern', color: '#1C2B4A', bg: '#F8F5F0' },
  { id: 5, name: 'Blue Floral', tag: 'Dreamy', color: '#4A7FA5', bg: '#EEF4FB' },
  { id: 6, name: 'Rustic Kraft', tag: 'Rustic', color: '#5C3D2E', bg: '#C8A97A' },
  { id: 7, name: 'Verdant Gold', tag: 'Luxury', color: '#D4AF70', bg: '#1C3A2A' },
  { id: 8, name: 'Art Deco', tag: 'Glamour', color: '#D4AF37', bg: '#0F0F0F' },
  { id: 9, name: 'Whimsical Garden', tag: 'Botanical', color: '#7A9A60', bg: '#F4F8F1' },
  { id: 10, name: 'Industrial Copper', tag: 'Vintage', color: '#C87D55', bg: '#1E1A17' },
  { id: 11, name: 'Ethereal Soft', tag: 'Pastel', color: '#B8A8D4', bg: '#FFF0F5' },
  { id: 12, name: 'Minimalist Overlay', tag: 'Minimal', color: '#111111', bg: '#FAFAFA' },
  { id: 13, name: 'Polaroid Nostalgia', tag: 'Retro', color: '#D8C3A5', bg: '#F5EDD8' },
  { id: 14, name: 'Floral Frame Inset', tag: 'Elegance', color: '#5A2A38', bg: '#FDFBF7' },
  { id: 15, name: 'Double Exposure', tag: 'Artistic', color: '#E6C280', bg: '#121824' },
  { id: 16, name: 'Torn Paper Edge', tag: 'Textured', color: '#2B2B2B', bg: '#EFEBE4' },
  { id: 17, name: 'Golden Hour Glow', tag: 'Warmth', color: '#FF8C42', bg: '#6B2D5C' },
  { id: 18, name: 'Geometric Glass', tag: 'Glassmorphism', color: '#F1C40F', bg: '#0D2818' },
  { id: 19, name: 'Painted Canvas', tag: 'Fine Art', color: '#708238', bg: '#F4EBE1' },
  { id: 20, name: 'Vertical Film Strip', tag: 'Cinema', color: '#E5A93C', bg: '#1A1A1A' },
  { id: 21, name: 'Classic Bordered', tag: 'Traditional', color: '#7A1F2B', bg: '#F9F6F0' },
  { id: 22, name: 'Archway Garden', tag: 'Garden', color: '#2D4A3E', bg: '#F0F4EC' },
  { id: 23, name: 'Script Overlay', tag: 'Bold Photo', color: '#FFFFFF', bg: '#222222' },
  { id: 24, name: 'Botanical Border', tag: 'Eucalyptus', color: '#5C7658', bg: '#FAFAF7' },
  { id: 25, name: 'Frosted Glass', tag: 'Modern Blur', color: '#1E293B', bg: '#E2E8F0' },
  { id: 26, name: 'Circular Bloom', tag: 'Blush Floral', color: '#6B2D3E', bg: '#FFF9F5' },
  { id: 27, name: 'Vintage Postcard', tag: 'Airmail', color: '#4A3525', bg: '#F5E8D0' },
  { id: 28, name: 'Gold Leaf Accent', tag: 'Forest Gold', color: '#D4AF37', bg: '#141E18' },
  { id: 29, name: 'Split Screen Floral', tag: 'Dual Tone', color: '#7A1F2B', bg: '#FBEAEB' },
  { id: 30, name: 'Midnight Elegance', tag: 'Silver Blue', color: '#E2E8F0', bg: '#0B0E14' },
  { id: 31, name: 'Scandi Minimalist', tag: 'Scandi', color: '#111111', bg: '#FFFFFF' },
];

const DEFAULT_DATA: CardFormData = {
  partnerOne: 'Sophia',
  partnerTwo: 'Alexander',
  weddingDate: 'August 14, 2025',
  weddingTime: '4:00 PM',
  venue: 'The Grand Chapel',
  city: 'Bangalore, India',
  tagline: 'Together Forever',
  couplePhoto: '/images/templates/couple-photo.jpg',
  hashtag: '#ForeverTogether',
};

function CardRenderer({ templateId, data }: { templateId: number; data: CardFormData }) {
  const props = { ...data };
  if (templateId === 1) return <CardTemplate1 {...props} />;
  if (templateId === 2) return <CardTemplate2 {...props} />;
  if (templateId === 3) return <CardTemplate3 {...props} />;
  if (templateId === 4) return <CardTemplate4 {...props} />;
  if (templateId === 5) return <CardTemplate5 {...props} />;
  if (templateId === 6) return <CardTemplate6 {...props} />;
  if (templateId === 7) return <CardTemplate7 {...props} />;
  if (templateId === 8) return <CardTemplate8 {...props} />;
  if (templateId === 9) return <CardTemplate9 {...props} />;
  if (templateId === 10) return <CardTemplate10 {...props} />;
  if (templateId === 11) return <CardTemplate11 {...props} />;
  if (templateId === 12) return <CardTemplate12 {...props} />;
  if (templateId === 13) return <CardTemplate13 {...props} />;
  if (templateId === 14) return <CardTemplate14 {...props} />;
  if (templateId === 15) return <CardTemplate15 {...props} />;
  if (templateId === 16) return <CardTemplate16 {...props} />;
  if (templateId === 17) return <CardTemplate17 {...props} />;
  if (templateId === 18) return <CardTemplate18 {...props} />;
  if (templateId === 19) return <CardTemplate19 {...props} />;
  if (templateId === 20) return <CardTemplate20 {...props} />;
  if (templateId === 21) return <CardTemplate21 {...props} />;
  if (templateId === 22) return <CardTemplate22 {...props} />;
  if (templateId === 23) return <CardTemplate23 {...props} />;
  if (templateId === 24) return <CardTemplate24 {...props} />;
  if (templateId === 25) return <CardTemplate25 {...props} />;
  if (templateId === 26) return <CardTemplate26 {...props} />;
  if (templateId === 27) return <CardTemplate27 {...props} />;
  if (templateId === 28) return <CardTemplate28 {...props} />;
  if (templateId === 29) return <CardTemplate29 {...props} />;
  if (templateId === 30) return <CardTemplate30 {...props} />;
  if (templateId === 31) return <CardTemplate31 {...props} />;
  return null;
}

export default function CardGenerator() {
  const searchParams = useSearchParams();
  const invitationId = searchParams.get('invitationId');

  const [formData, setFormData] = useState<CardFormData>(DEFAULT_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'templates'>('details');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [exporting, setExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const exportCardRef = useRef<HTMLDivElement>(null);
  const PREVIEW_SCALE = 0.35;

  useEffect(() => {
    if (invitationId) {
      fetch('/api/invitations/my-invitations')
        .then((res) => res.json())
        .then((data) => {
          if (data.invitations && Array.isArray(data.invitations)) {
            const found = data.invitations.find((inv: any) => inv.id === invitationId);
            if (found) {
              const cleanPartnerOne = found.partnerOne || 'Sophia';
              const cleanPartnerTwo = found.partnerTwo || 'Alexander';
              const autoHashtag = '#' + cleanPartnerOne.replace(/[^a-zA-Z0-9]/g, '') + 'And' + cleanPartnerTwo.replace(/[^a-zA-Z0-9]/g, '');

              setFormData({
                partnerOne: cleanPartnerOne,
                partnerTwo: cleanPartnerTwo,
                weddingDate: found.weddingTime ? (found.weddingTime.includes(' at ') ? found.weddingTime.split(' at ')[0] : found.weddingTime) : 'August 14, 2025',
                weddingTime: found.weddingTime ? (found.weddingTime.includes(' at ') ? found.weddingTime.split(' at ')[1] : found.weddingTime) : '4:00 PM',
                venue: found.venuePlace || 'The Grand Chapel',
                city: found.contactAddress || found.venuePlace || 'Bangalore, India',
                tagline: found.tagline || 'Together Forever',
                couplePhoto: found.coupleImage || found.heroImage || '/images/templates/couple-photo.jpg',
                hashtag: autoHashtag,
              });
            }
          }
        })
        .catch((err) => console.error('Failed to auto-populate card from invitation:', err));
    }
  }, [invitationId]);

  const handleChange = useCallback((key: keyof CardFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingReason, setPricingReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<'png' | 'pdf' | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<{
    isActive: boolean;
    allowedCardsCount: number;
    usedCardsCount: number;
    remainingCardSlots: number;
  }>({
    isActive: false,
    allowedCardsCount: 0,
    usedCardsCount: 0,
    remainingCardSlots: 0,
  });

  const checkSubscriptionAccess = useCallback(async () => {
    try {
      const res = await fetch('/api/user/subscription');
      const data = await res.json();
      setSubscriptionData({
        isActive: !!data.isActive,
        allowedCardsCount: data.allowedCardsCount || 0,
        usedCardsCount: data.usedCardsCount || 0,
        remainingCardSlots: data.remainingCardSlots || 0,
      });

      if (!data.isActive) {
        setPricingReason('An active subscription plan (₹599 for Basic, ₹1799 for Pro, or ₹2000 for Cinematic) is required to download & export High-Res Instagram Announcement Cards.');
        setShowPricingModal(true);
        return false;
      }
      if (data.remainingCardSlots <= 0) {
        setPricingReason(`You have used all ${data.allowedCardsCount} Instagram card downloads included in your plan. Please upgrade to download additional cards.`);
        setShowPricingModal(true);
        return false;
      }
      return true;
    } catch (e) {
      return true;
    }
  }, []);

  useEffect(() => {
    checkSubscriptionAccess();
  }, [checkSubscriptionAccess]);

  const handleRefreshQuota = async () => {
    try {
      const res = await fetch('/api/user/refresh-card-limit', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        checkSubscriptionAccess();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const executeDownload = async (format: 'png' | 'pdf') => {
    const targetElement = exportCardRef.current || cardRef.current;
    if (!targetElement) return;
    setExporting(true);
    try {
      // 1. Record card download in DB and deduct 1 credit slot
      const saveRes = await fetch('/api/user/cards/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          templateName: currentTemplateObj.name,
          partnerOne: formData.partnerOne,
          partnerTwo: formData.partnerTwo,
          weddingDate: formData.weddingDate,
          weddingTime: formData.weddingTime,
          venue: formData.venue,
          city: formData.city,
          tagline: formData.tagline,
          couplePhoto: formData.couplePhoto,
          hashtag: formData.hashtag,
        }),
      });

      const saveResult = await saveRes.json();
      if (!saveRes.ok) {
        alert(saveResult.error || 'Failed to record card download credit.');
        setExporting(false);
        return;
      }

      // 2. Perform Crisp Canvas Capture on Unscaled Standalone 1080x1080 Element
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(targetElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 1080,
        height: 1080,
        windowWidth: 1080,
        windowHeight: 1080,
        onclone: (clonedDoc) => {
          // Convert any img tags with CSS grayscale filter into native B&W Data URLs for html2canvas
          const images = clonedDoc.querySelectorAll('img');
          images.forEach((img) => {
            const styleFilter = img.style.filter || (img as any).computedStyleMap?.().get?.('filter')?.toString?.() || '';
            if (styleFilter && styleFilter.includes('grayscale')) {
              try {
                const c = document.createElement('canvas');
                const w = img.naturalWidth || img.width || 800;
                const h = img.naturalHeight || img.height || 800;
                c.width = w;
                c.height = h;
                const ctx = c.getContext('2d');
                if (ctx) {
                  ctx.filter = styleFilter;
                  ctx.drawImage(img, 0, 0, w, h);
                  const bwDataUrl = c.toDataURL('image/jpeg', 0.95);
                  img.src = bwDataUrl;
                  img.style.filter = 'none';
                }
              } catch (e) {
                console.error('Grayscale canvas conversion error', e);
              }
            }
          });
        },
      });

      if (format === 'png') {
        const url = canvas.toDataURL('image/png', 1.0);
        const a = document.createElement('a');
        a.href = url;
        a.download = ('wedding-card-' + formData.partnerOne + '-' + formData.partnerTwo + '.png').toLowerCase().replace(/\s+/g, '-');
        a.click();
      } else {
        const { jsPDF } = await import('jspdf');
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [1080, 1080] });
        pdf.addImage(imgData, 'PNG', 0, 0, 1080, 1080);
        pdf.save(('wedding-card-' + formData.partnerOne + '-' + formData.partnerTwo + '.pdf').toLowerCase().replace(/\s+/g, '-'));
      }

      // Update remaining quota state
      checkSubscriptionAccess();
    } catch (e) {
      console.error('Export failed', e);
    } finally {
      setExporting(false);
    }
  };

  const triggerDownloadConfirmation = async (format: 'png' | 'pdf') => {
    const allowed = await checkSubscriptionAccess();
    if (!allowed) return;
    setPendingFormat(format);
    setShowConfirmModal(true);
  };

  const CATEGORIES = ['All', 'Romantic', 'Bohemian', 'Formal', 'Modern', 'Dreamy', 'Rustic', 'Luxury', 'Glamour', 'Botanical'];

  const filteredTemplates = TEMPLATES.filter(t => selectedCategory === 'All' || t.tag === selectedCategory);

  const currentTemplateObj = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  const handleNextTemplate = () => {
    setSelectedTemplate(prev => (prev >= TEMPLATES.length ? 1 : prev + 1));
  };

  const handlePrevTemplate = () => {
    setSelectedTemplate(prev => (prev <= 1 ? TEMPLATES.length : prev - 1));
  };

  const inputClass = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 12,
    border: '1.5px solid rgba(217,164,65,0.35)',
    background: '#F8F3EA',
    fontSize: 13,
    color: '#221C17',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  };

  const labelClass = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(34,28,23,0.7)',
    marginBottom: 5,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  };

  return (
    <div style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', background: '#1A1614', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header className="min-h-[64px] bg-[#120F0D] border-b border-[#D9A441]/20 px-3 sm:px-7 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 z-50">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles style={{ width: 18, height: 18, color: '#D9A441' }} />
          <div>
            <span style={{ fontSize: 9, fontWeight: 800, color: '#D9A441', letterSpacing: 3, textTransform: 'uppercase', display: 'block', lineHeight: 1 }}>BERVIC</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#F8F3EA', lineHeight: 1.2 }}>Instagram Card Studio</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {/* Card Quota Display Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(217,164,65,0.12)', border: '1px solid rgba(217,164,65,0.3)', padding: '4px 10px', borderRadius: 99, color: '#D9A441', fontSize: 11, fontWeight: 700 }}>
            <span>Cards: {subscriptionData.usedCardsCount} / {subscriptionData.allowedCardsCount}</span>
            <button
              onClick={handleRefreshQuota}
              style={{ background: '#7A1F2B', color: '#F8F3EA', border: 'none', padding: '2px 6px', borderRadius: 99, fontSize: 10, cursor: 'pointer', fontWeight: 800 }}
              title="Refresh Card Quota for Testing"
            >
              🔄
            </button>
          </div>

          <button
            onClick={() => triggerDownloadConfirmation('png')}
            disabled={exporting}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 99, background: '#D9A441', color: '#221C17', border: 'none', cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 12, opacity: exporting ? 0.7 : 1, boxShadow: '0 4px 14px rgba(217,164,65,0.3)' }}
          >
            <ImageIcon style={{ width: 13, height: 13 }} />
            {exporting ? 'Exporting…' : 'PNG'}
          </button>
          <button
            onClick={() => triggerDownloadConfirmation('pdf')}
            disabled={exporting}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 99, background: '#7A1F2B', color: '#F8F3EA', border: 'none', cursor: exporting ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 12, opacity: exporting ? 0.7 : 1 }}
          >
            <Download style={{ width: 13, height: 13 }} />
            {exporting ? 'Exporting…' : 'PDF'}
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        {/* LEFT SIDEBAR: Tabbed Controls (380px) - Independent Scroll */}
        <div style={{ width: 380, flexShrink: 0, height: '100%', minHeight: 0, background: '#F8F3EA', borderRight: '1px solid rgba(217,164,65,0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(217,164,65,0.25)', background: '#EFE7D8', flexShrink: 0 }}>
            <button
              onClick={() => setActiveTab('details')}
              style={{
                flex: 1,
                padding: '14px 16px',
                border: 'none',
                background: activeTab === 'details' ? '#F8F3EA' : 'transparent',
                color: activeTab === 'details' ? '#7A1F2B' : '#666666',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                borderBottom: activeTab === 'details' ? '3px solid #7A1F2B' : '3px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              ✏️ Edit Details
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              style={{
                flex: 1,
                padding: '14px 16px',
                border: 'none',
                background: activeTab === 'templates' ? '#F8F3EA' : 'transparent',
                color: activeTab === 'templates' ? '#7A1F2B' : '#666666',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                borderBottom: activeTab === 'templates' ? '3px solid #7A1F2B' : '3px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              🎨 Choose Template ({TEMPLATES.length})
            </button>
          </div>

          {/* TAB 1: EDIT DETAILS */}
          {activeTab === 'details' && (
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontSize: 13, fontWeight: 800, color: '#7A1F2B', textTransform: 'uppercase', letterSpacing: 2, margin: 0 }}>Wedding Invitation Details</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelClass}>Partner One</label>
                  <input style={inputClass} value={formData.partnerOne} onChange={e => handleChange('partnerOne', e.target.value)} placeholder="Partner One Name" />
                </div>
                <div>
                  <label style={labelClass}>Partner Two</label>
                  <input style={inputClass} value={formData.partnerTwo} onChange={e => handleChange('partnerTwo', e.target.value)} placeholder="Partner Two Name" />
                </div>
                <div>
                  <label style={labelClass}>Tagline</label>
                  <input style={inputClass} value={formData.tagline} onChange={e => handleChange('tagline', e.target.value)} placeholder="e.g. TOGETHER WITH THEIR FAMILIES" />
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(217,164,65,0.25)', margin: 0 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelClass}>Wedding Date</label>
                  <input style={inputClass} value={formData.weddingDate} onChange={e => handleChange('weddingDate', e.target.value)} placeholder="August 14, 2025" />
                </div>
                <div>
                  <label style={labelClass}>Wedding Time</label>
                  <input style={inputClass} value={formData.weddingTime} onChange={e => handleChange('weddingTime', e.target.value)} placeholder="4:00 PM" />
                </div>
                <div>
                  <label style={labelClass}>Venue</label>
                  <input style={inputClass} value={formData.venue} onChange={e => handleChange('venue', e.target.value)} placeholder="Venue Name" />
                </div>
                <div>
                  <label style={labelClass}>City / Location</label>
                  <input style={inputClass} value={formData.city} onChange={e => handleChange('city', e.target.value)} placeholder="Bangalore, India" />
                </div>
                <div>
                  <label style={labelClass}>Hashtag</label>
                  <input style={inputClass} value={formData.hashtag} onChange={e => handleChange('hashtag', e.target.value)} placeholder="#YourHashtag" />
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(217,164,65,0.25)', margin: 0 }} />

              <div>
                <label style={labelClass}>Couple Photo</label>
                <CloudinaryUploader
                  label=""
                  value={formData.couplePhoto}
                  onChange={url => handleChange('couplePhoto', url)}
                  placeholder="/images/templates/couple-photo.jpg"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CHOOSE TEMPLATE */}
          {activeTab === 'templates' && (
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Category Filter Chips */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 99,
                      border: '1px solid ' + (selectedCategory === cat ? '#7A1F2B' : 'rgba(34,28,23,0.2)'),
                      background: selectedCategory === cat ? '#7A1F2B' : '#EFE7D8',
                      color: selectedCategory === cat ? '#FFFFFF' : '#221C17',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template Cards Grid (2 Columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {filteredTemplates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      padding: 12,
                      borderRadius: 14,
                      border: selectedTemplate === t.id ? '2px solid #7A1F2B' : '1px solid rgba(217,164,65,0.3)',
                      background: selectedTemplate === t.id ? '#FFFFFF' : '#EFE7D8',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      boxShadow: selectedTemplate === t.id ? '0 4px 16px rgba(122,31,43,0.2)' : 'none',
                    }}
                  >
                    {/* Visual Color Box */}
                    <div style={{ width: '100%', height: 60, borderRadius: 10, background: t.bg, border: '2px solid ' + t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: t.color, textTransform: 'uppercase', letterSpacing: 1 }}>Card #{t.id}</span>
                      {selectedTemplate === t.id && (
                        <div style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: '50%', background: '#7A1F2B', color: '#FFF', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#221C17', lineHeight: 1.2 }}>{t.name}</div>
                      <div style={{ fontSize: 10, color: '#7A1F2B', fontWeight: 600, marginTop: 2 }}>{t.tag}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT MAIN WORKSPACE: Permanent Live Preview Canvas */}
        <div style={{ flex: 1, height: '100%', background: '#1A1614', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '16px 20px', overflowY: 'auto' }}>
          {/* Top Control Bar with Quick Arrows & Selected Template Info */}
          <div style={{ width: '100%', maxWidth: 680, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#25201D', padding: '8px 18px', borderRadius: 14, border: '1px solid rgba(217,164,65,0.2)', marginBottom: 16, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={handlePrevTemplate}
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#332B27', border: '1px solid rgba(217,164,65,0.3)', color: '#F8F3EA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Previous Template"
              >
                <ChevronLeft style={{ width: 16, height: 16 }} />
              </button>
              <div>
                <span style={{ color: '#D9A441', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Template {selectedTemplate} of {TEMPLATES.length}</span>
                <div style={{ color: '#F8F3EA', fontSize: 13, fontWeight: 700 }}>{currentTemplateObj.name}</div>
              </div>
              <button
                onClick={handleNextTemplate}
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#332B27', border: '1px solid rgba(217,164,65,0.3)', color: '#F8F3EA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Next Template"
              >
                <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setActiveTab('templates')}
                style={{ padding: '5px 12px', borderRadius: 99, background: 'rgba(217,164,65,0.15)', color: '#D9A441', border: '1px solid rgba(217,164,65,0.3)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
              >
                Browse All 31 →
              </button>
            </div>
          </div>

          {/* Scaled Preview Canvas */}
          <div style={{ width: 1080 * PREVIEW_SCALE, height: 1080 * PREVIEW_SCALE, flexShrink: 0, position: 'relative', boxShadow: '0 20px 70px rgba(0,0,0,0.8), 0 0 0 1px rgba(217,164,65,0.25)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ transformOrigin: 'top left', transform: 'scale(' + PREVIEW_SCALE + ')', width: 1080, height: 1080 }}>
              <div ref={cardRef} data-card-wrapper="true" style={{ width: 1080, height: 1080, overflow: 'hidden', position: 'relative' }}>
                <CardRenderer templateId={selectedTemplate} data={formData} />
                {/* Bervic Watermark Overlay — 3 positions */}
                <div data-watermark="true" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 999 }}>
                  {/* Top-left */}
                  <span style={{
                    position: 'absolute', top: 80, left: -40,
                    fontSize: 96, fontWeight: 900, fontFamily: 'serif',
                    color: 'rgba(255,255,255,0.11)', letterSpacing: 20,
                    textTransform: 'uppercase', transform: 'rotate(-35deg)',
                    userSelect: 'none', whiteSpace: 'nowrap',
                    textShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}>bervic</span>
                  {/* Center */}
                  <span style={{
                    position: 'absolute', top: '50%', left: '50%',
                    fontSize: 120, fontWeight: 900, fontFamily: 'serif',
                    color: 'rgba(255,255,255,0.11)', letterSpacing: 24,
                    textTransform: 'uppercase', transform: 'translate(-50%, -50%) rotate(-35deg)',
                    userSelect: 'none', whiteSpace: 'nowrap',
                    textShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}>bervic</span>
                  {/* Bottom-right */}
                  <span style={{
                    position: 'absolute', bottom: 80, right: -40,
                    fontSize: 96, fontWeight: 900, fontFamily: 'serif',
                    color: 'rgba(255,255,255,0.11)', letterSpacing: 20,
                    textTransform: 'uppercase', transform: 'rotate(-35deg)',
                    userSelect: 'none', whiteSpace: 'nowrap',
                    textShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}>bervic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Swatches Horizontal Carousel */}
          <div style={{ width: '100%', maxWidth: 680, marginTop: 16, marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: 'rgba(248,243,234,0.5)', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
              Quick Template Selector
            </div>
            <div style={{ display: 'flex', gap: 8, width: '100%', overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'thin' }}>
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: t.bg,
                    border: selectedTemplate === t.id ? '3px solid #D9A441' : '2px solid transparent',
                    boxShadow: selectedTemplate === t.id ? '0 0 12px rgba(217,164,65,0.6)' : 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    fontSize: 9,
                    fontWeight: 800,
                    color: t.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  title={t.name}
                >
                  #{t.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DOWNLOAD CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#F8F3EA', borderRadius: 24, border: '2px solid rgba(217,164,65,0.4)', padding: '28px 32px', maxWidth: 460, width: '100%', color: '#221C17', boxShadow: '0 25px 60px rgba(0,0,0,0.7)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#7A1F2B', color: '#D9A441', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 8px 20px rgba(122,31,43,0.3)' }}>
              <Download style={{ width: 28, height: 28 }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#221C17', marginBottom: 8, fontFamily: 'serif' }}>
              Confirm Card Export ({pendingFormat?.toUpperCase()})
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(34,28,23,0.8)', lineHeight: 1.5, marginBottom: 20 }}>
              Downloading <strong>Template #{selectedTemplate} ({currentTemplateObj.name})</strong> will consume <strong>1 Instagram Card credit</strong> from your subscription quota.
            </p>

            <div style={{ background: '#EFE7D8', borderRadius: 14, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(217,164,65,0.3)', fontSize: 12 }}>
              <span style={{ fontWeight: 600, color: '#7A1F2B' }}>Remaining Quota:</span>
              <span style={{ fontWeight: 800, color: '#221C17' }}>
                {subscriptionData.remainingCardSlots} of {subscriptionData.allowedCardsCount} Cards Left
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{ flex: 1, padding: '12px 18px', borderRadius: 99, background: 'transparent', border: '1.5px solid rgba(34,28,23,0.3)', color: '#221C17', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  if (pendingFormat) executeDownload(pendingFormat);
                }}
                style={{ flex: 1, padding: '12px 18px', borderRadius: 99, background: '#7A1F2B', border: 'none', color: '#F8F3EA', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(122,31,43,0.4)' }}
              >
                Confirm & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFF-SCREEN UNTOUCHED 1080x1080 HIGH-RES CAPTURE CONTAINER */}
      <div
        ref={exportCardRef}
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: 1080,
          height: 1080,
          overflow: "hidden",
          zIndex: -9999,
          pointerEvents: "none",
        }}
      >
        <CardRenderer templateId={selectedTemplate} data={formData} />
      </div>

      <PricingCheckoutModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        reason={pricingReason}
      />
    </div>
  );
}
