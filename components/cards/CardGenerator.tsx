'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import PricingCheckoutModal from '@/components/payment/PricingCheckoutModal';
import { Download, Image as ImageIcon, Sparkles, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

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

  const router = useRouter();
  const { status } = useSession();

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
    allowedCardsCount: 2,
    usedCardsCount: 0,
    remainingCardSlots: 2,
  });

  const checkSubscriptionAccess = useCallback(async () => {
    try {
      const res = await fetch('/api/user/subscription');
      const data = await res.json();
      const isLoggedIn = !!data.isLoggedIn || status === 'authenticated';
      const allowed = data.allowedCardsCount || (isLoggedIn ? 2 : 0);
      const used = data.usedCardsCount || 0;
      const remaining = data.remainingCardSlots !== undefined ? data.remainingCardSlots : Math.max(0, allowed - used);

      setSubscriptionData({
        isActive: !!data.isActive || remaining > 0,
        allowedCardsCount: allowed,
        usedCardsCount: used,
        remainingCardSlots: remaining,
      });

      if (!isLoggedIn) {
        router.push('/auth/login?callbackUrl=' + encodeURIComponent('/checkout?plan=CARDS_99'));
        return false;
      }

      if (remaining <= 0) {
        router.push('/checkout?plan=CARDS_99');
        return false;
      }
      return true;
    } catch (e) {
      return true;
    }
  }, [status, router]);

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
    const targetElement = cardRef.current;
    if (!targetElement) {
      alert('Card preview is not ready. Please try again.');
      return;
    }
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

      // 2. Perform Crisp Canvas Capture on the live 1080x1080 Card Element (excluding watermarks)
      let dataUrl = '';
      if (typeof document !== 'undefined' && document.fonts) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 80));

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(targetElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 1080,
        height: 1080,
        ignoreElements: (element) => element.getAttribute('data-watermark') === 'true',
        onclone: (_clonedDoc, clonedElement) => {
          clonedElement.style.transform = 'none';
          clonedElement.style.transformOrigin = 'top left';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.margin = '0';
        },
      });
      dataUrl = canvas.toDataURL('image/png', 1.0);

      if (!dataUrl) {
        throw new Error('Failed to generate image data.');
      }

      if (format === 'png') {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = ('wedding-card-' + (formData.partnerOne || 'card') + '-' + (formData.partnerTwo || 'invite') + '.png')
          .toLowerCase()
          .replace(/\s+/g, '-');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [1080, 1080] });
        pdf.addImage(dataUrl, 'PNG', 0, 0, 1080, 1080);
        pdf.save(
          ('wedding-card-' + (formData.partnerOne || 'card') + '-' + (formData.partnerTwo || 'invite') + '.pdf')
            .toLowerCase()
            .replace(/\s+/g, '-')
        );
      }

      // Update remaining quota state
      checkSubscriptionAccess();
    } catch (e: any) {
      console.error('Export failed', e);
      alert('Card export failed: ' + (e?.message || 'Please try again.'));
    } finally {
      setExporting(false);
    }
  };

  const [mobileTab, setMobileTab] = useState<'details' | 'preview' | 'templates'>('details');
  const [previewScale, setPreviewScale] = useState(0.35);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      const screenW = window.innerWidth;
      if (screenW < 480) {
        // Mobile (iPhone / Android)
        const targetW = Math.min(screenW - 32, 380);
        setPreviewScale(targetW / 1080);
      } else if (screenW < 768) {
        setPreviewScale(Math.min(0.38, (screenW - 48) / 1080));
      } else if (screenW < 1200) {
        setPreviewScale(0.35);
      } else {
        setPreviewScale(0.40);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    padding: '11px 14px',
    borderRadius: 12,
    border: '1.5px solid #E2E8F0',
    background: '#FFFFFF',
    fontSize: 14,
    color: '#0F172A',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  };

  const labelClass = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: '#64748B',
    marginBottom: 5,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="min-h-[56px] sm:min-h-[64px] bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 shrink-0 z-50 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-[#991B1B] hover:text-white transition-all shrink-0 shadow-xs"
            title="Return to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#991B1B]" />
            <div>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-[#991B1B] tracking-[0.2em] uppercase block leading-none">BERVIC</span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Card Studio</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Card Quota Display Pill */}
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-[#991B1B] text-[11px] sm:text-xs font-bold shadow-2xs">
            {status === "authenticated" ? (
              <>
                <span className="hidden sm:inline">
                  {subscriptionData.remainingCardSlots > 0 ? (
                    `🎁 ${subscriptionData.remainingCardSlots} Slot${subscriptionData.remainingCardSlots > 1 ? 's' : ''} Available`
                  ) : (
                    `⚠️ 0 Slots Left (${subscriptionData.usedCardsCount}/${subscriptionData.allowedCardsCount} used)`
                  )}
                </span>
                <span className="sm:hidden">
                  {subscriptionData.remainingCardSlots > 0 ? `🎁 ${subscriptionData.remainingCardSlots} Left` : `0 Left`}
                </span>
                <button
                  onClick={() => {
                    router.push('/checkout?plan=CARDS_99');
                  }}
                  className="bg-[#991B1B] text-white border-none px-2 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer hover:bg-[#7F1D1D] transition-colors ml-0.5 shadow-2xs"
                  title="Buy 5 Cards for ₹99"
                >
                  +5 (₹99)
                </button>
              </>
            ) : (
              <Link
                href="/auth/login?callbackUrl=/checkout?plan=CARDS_99"
                className="text-[#991B1B] font-extrabold hover:underline flex items-center gap-1"
              >
                <span>🎁 2 Free Slots (Login)</span>
              </Link>
            )}
          </div>

          <button
            onClick={() => triggerDownloadConfirmation('png')}
            disabled={exporting}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 border-none font-bold text-xs shadow-xs hover:bg-amber-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{exporting ? '...' : 'PNG'}</span>
          </button>

          <button
            onClick={() => triggerDownloadConfirmation('pdf')}
            disabled={exporting}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#991B1B] text-white border-none font-bold text-xs hover:bg-[#7F1D1D] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? '...' : 'PDF'}</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER: Responsive 2-Column Desktop / Tabbed Single Column Mobile */}
      <div className="flex flex-1 min-h-0 h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] pb-[68px] md:pb-0 overflow-hidden">
        {/* LEFT SIDEBAR: Edit Details / Choose Template */}
        <div
          className={`w-full md:w-[380px] lg:w-[400px] shrink-0 h-full min-h-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden ${
            mobileTab === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Desktop Tab Switcher */}
          <div className="hidden md:flex border-b border-slate-200 bg-slate-50 shrink-0">
            <button
              onClick={() => {
                setActiveTab('details');
                setMobileTab('details');
              }}
              className={`flex-1 py-3.5 px-4 border-none font-bold text-xs sm:text-sm cursor-pointer transition-all border-b-2 ${
                activeTab === 'details'
                  ? 'bg-white text-[#991B1B] border-[#991B1B]'
                  : 'bg-transparent text-slate-500 border-transparent hover:text-slate-900'
              }`}
            >
              ✏️ Edit Details
            </button>
            <button
              onClick={() => {
                setActiveTab('templates');
                setMobileTab('templates');
              }}
              className={`flex-1 py-3.5 px-4 border-none font-bold text-xs sm:text-sm cursor-pointer transition-all border-b-2 ${
                activeTab === 'templates'
                  ? 'bg-white text-[#991B1B] border-[#991B1B]'
                  : 'bg-transparent text-slate-500 border-transparent hover:text-slate-900'
              }`}
            >
              🎨 Choose Template ({TEMPLATES.length})
            </button>
          </div>

          {/* TAB 1: EDIT DETAILS */}
          {activeTab === 'details' && (
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
              {/* Card Quota Summary Banner */}
              <div className="bg-red-50/70 border border-red-200/80 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🎁</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {subscriptionData.remainingCardSlots} Slot{subscriptionData.remainingCardSlots !== 1 ? 's' : ''} Available
                    </span>
                    <span className="text-[10.5px] text-slate-500 block">
                      {subscriptionData.usedCardsCount} of {subscriptionData.allowedCardsCount} total credits used
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    router.push('/checkout?plan=CARDS_99');
                  }}
                  className="px-3 py-1 rounded-full bg-[#991B1B] text-white text-[11px] font-extrabold hover:bg-[#7F1D1D] transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  + ₹99 (5 Slots)
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <h2 className="text-xs sm:text-sm font-extrabold text-[#991B1B] uppercase tracking-wider m-0">
                  Wedding Announcement Details
                </h2>
                {/* Mobile quick jump to preview */}
                <button
                  onClick={() => setMobileTab('preview')}
                  className="md:hidden text-xs font-bold text-[#991B1B] bg-red-50 px-2.5 py-1 rounded-full border border-red-200"
                >
                  Preview →
                </button>
              </div>

              <div className="flex flex-col gap-3.5">
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

              <hr className="border-none border-t border-[#D9A441]/25 m-0" />

              <div className="flex flex-col gap-3.5">
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
                  <input style={inputClass} value={formData.venue} placeholder="The Grand Chapel" onChange={e => handleChange('venue', e.target.value)} />
                </div>
                <div>
                  <label style={labelClass}>City / Location</label>
                  <input style={inputClass} value={formData.city} placeholder="Bangalore, India" onChange={e => handleChange('city', e.target.value)} />
                </div>
                <div>
                  <label style={labelClass}>Hashtag</label>
                  <input style={inputClass} value={formData.hashtag} placeholder="#ForeverTogether" onChange={e => handleChange('hashtag', e.target.value)} />
                </div>
              </div>

              <hr className="border-none border-t border-[#D9A441]/25 m-0" />

              <div>
                <label style={labelClass}>Couple Photo</label>
                <CloudinaryUploader
                  label=""
                  value={formData.couplePhoto}
                  onChange={url => handleChange('couplePhoto', url)}
                  placeholder="/images/templates/couple-photo.jpg"
                />
              </div>

              {/* Mobile Quick Action Button */}
              <div className="md:hidden pt-2 pb-6">
                <button
                  type="button"
                  onClick={() => setMobileTab('preview')}
                  className="w-full py-3 px-4 rounded-xl bg-[#991B1B] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <span>👁️ View Live Card Preview</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CHOOSE TEMPLATE */}
          {activeTab === 'templates' && (
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
              {/* Category Filter Chips */}
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-1 px-3 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                      selectedCategory === cat
                        ? 'bg-[#991B1B] text-white border-[#991B1B] shadow-xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-[#991B1B]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template Cards Grid (2 Columns) */}
              <div className="grid grid-cols-2 gap-3 pb-6">
                {filteredTemplates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t.id);
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        setMobileTab('preview');
                      }
                    }}
                    className={`flex flex-col gap-2 p-2.5 sm:p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedTemplate === t.id
                        ? 'border-2 border-[#991B1B] bg-white shadow-md'
                        : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-[#991B1B]'
                    }`}
                  >
                    {/* Visual Color Box */}
                    <div
                      className="w-full h-14 sm:h-16 rounded-lg flex items-center justify-center relative border-2"
                      style={{ background: t.bg, borderColor: t.color }}
                    >
                      <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: t.color }}>
                        Card #{t.id}
                      </span>
                      {selectedTemplate === t.id && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#991B1B] text-white text-[10px] flex items-center justify-center font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{t.name}</div>
                      <div className="text-[10px] text-[#991B1B] font-semibold mt-0.5">{t.tag}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT MAIN WORKSPACE: Permanent Live Preview Canvas */}
        <div
          className={`flex-1 h-full bg-slate-100 flex flex-col items-center justify-start p-3 sm:p-5 overflow-y-auto ${
            mobileTab !== 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Top Control Bar with Quick Arrows & Selected Template Info */}
          <div className="w-full max-w-[680px] flex items-center justify-between bg-white px-3.5 sm:px-4.5 py-2.5 rounded-2xl border border-slate-200 mb-3 sm:mb-4 shrink-0 shadow-xs">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                onClick={handlePrevTemplate}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer flex items-center justify-center hover:bg-[#991B1B] hover:text-white transition-all"
                title="Previous Template"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[#991B1B] text-[9px] sm:text-[10px] font-bold tracking-wider uppercase block">
                  Template {selectedTemplate} of {TEMPLATES.length}
                </span>
                <div className="text-slate-900 text-xs sm:text-sm font-bold">{currentTemplateObj.name}</div>
              </div>
              <button
                onClick={handleNextTemplate}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer flex items-center justify-center hover:bg-[#991B1B] hover:text-white transition-all"
                title="Next Template"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('templates');
                  setMobileTab('templates');
                }}
                className="py-1.5 px-3 rounded-full bg-red-50 text-[#991B1B] border border-red-200 text-xs font-semibold cursor-pointer hover:bg-[#991B1B] hover:text-white transition-all"
              >
                Browse Presets →
              </button>
            </div>
          </div>

          {/* Scaled Preview Canvas Wrapper */}
          <div
            style={{
              width: 1080 * previewScale,
              height: 1080 * previewScale,
              flexShrink: 0,
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                transformOrigin: 'top left',
                transform: `scale(${previewScale})`,
                width: 1080,
                height: 1080,
              }}
            >
              <div ref={cardRef} data-card-wrapper="true" style={{ width: 1080, height: 1080, overflow: 'hidden', position: 'relative' }}>
                <CardRenderer templateId={selectedTemplate} data={formData} />
                {/* Bervic Watermark Overlay — 3 positions */}
                <div data-watermark="true" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 999 }}>
                  {/* Top-left */}
                  <span
                    style={{
                      position: 'absolute',
                      top: 80,
                      left: -40,
                      fontSize: 96,
                      fontWeight: 900,
                      fontFamily: 'serif',
                      color: 'rgba(255,255,255,0.11)',
                      letterSpacing: 20,
                      textTransform: 'uppercase',
                      transform: 'rotate(-35deg)',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      textShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    bervic
                  </span>
                  {/* Center */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      fontSize: 120,
                      fontWeight: 900,
                      fontFamily: 'serif',
                      color: 'rgba(255,255,255,0.11)',
                      letterSpacing: 24,
                      textTransform: 'uppercase',
                      transform: 'translate(-50%, -50%) rotate(-35deg)',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      textShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    bervic
                  </span>
                  {/* Bottom-right */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 80,
                      right: -40,
                      fontSize: 96,
                      fontWeight: 900,
                      fontFamily: 'serif',
                      color: 'rgba(255,255,255,0.11)',
                      letterSpacing: 20,
                      textTransform: 'uppercase',
                      transform: 'rotate(-35deg)',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      textShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    bervic
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Swatches Horizontal Carousel */}
          <div className="w-full max-w-[680px] mt-3 sm:mt-4 mb-3 flex flex-col items-center gap-1.5 shrink-0">
            <div className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
              Quick Template Selector
            </div>
            <div className="flex gap-2 w-full overflow-x-auto pb-1.5" style={{ scrollbarWidth: 'thin' }}>
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0 text-[9px] font-extrabold flex items-center justify-center cursor-pointer transition-all border-2 ${
                    selectedTemplate === t.id
                      ? 'border-[#991B1B] shadow-md scale-105'
                      : 'border-slate-200 hover:border-[#991B1B]'
                  }`}
                  style={{
                    background: t.bg,
                    color: t.color,
                  }}
                  title={t.name}
                >
                  #{t.id}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Download Bar at Bottom of Preview */}
          <div className="md:hidden w-full max-w-[380px] flex gap-2 pt-1 pb-4">
            <button
              onClick={() => triggerDownloadConfirmation('png')}
              disabled={exporting}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={() => triggerDownloadConfirmation('pdf')}
              disabled={exporting}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#991B1B] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* DOWNLOAD CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-7 max-w-md w-full text-slate-900 shadow-2xl text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-50 text-[#991B1B] flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm border border-red-200">
              <Download className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2 font-serif">
              Confirm Card Export ({pendingFormat?.toUpperCase()})
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Downloading <strong>Template #{selectedTemplate} ({currentTemplateObj.name})</strong> will consume <strong>1 Instagram Card credit</strong> from your subscription quota.
            </p>

            <div className="bg-slate-50 rounded-xl p-3.5 mb-5 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Available Card Credits:</span>
                <span className="font-extrabold text-[#991B1B]">
                  {subscriptionData.remainingCardSlots} of {subscriptionData.allowedCardsCount} Cards Left
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                ✨ Logged-in users receive 2 Free High-Res Card Downloads.
              </p>
            </div>

            <div className="flex gap-2.5 justify-center">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 px-4 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  if (pendingFormat) executeDownload(pendingFormat);
                }}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#991B1B] border-none text-white font-extrabold text-xs sm:text-sm cursor-pointer shadow-md hover:bg-[#7F1D1D] transition-all"
              >
                Confirm &amp; Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIXED MOBILE BOTTOM NAVIGATION BAR */}
      <nav aria-label="Mobile Navigation" className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 z-50 shadow-[0_-6px_25px_rgba(0,0,0,0.1)] pb-[max(8px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => {
              setMobileTab('details');
              setActiveTab('details');
            }}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              mobileTab === 'details'
                ? 'bg-red-50 text-[#991B1B] shadow-xs scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-sm">✏️</span>
            <span className="text-[11px] leading-tight">Details</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              mobileTab === 'preview'
                ? 'bg-[#991B1B] text-white shadow-xs scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-sm">👁️</span>
            <span className="text-[11px] leading-tight">Live Card</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileTab('templates');
              setActiveTab('templates');
            }}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              mobileTab === 'templates'
                ? 'bg-red-50 text-[#991B1B] shadow-xs scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-sm">🎨</span>
            <span className="text-[11px] leading-tight">Presets ({TEMPLATES.length})</span>
          </button>
        </div>
      </nav>

      <PricingCheckoutModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        reason={pricingReason}
      />
    </div>
  );
}
