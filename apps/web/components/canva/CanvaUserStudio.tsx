"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { optimizeImageForUpload } from "@/lib/imageOptimizer";
import {
  ArrowLeft,
  Upload,
  Layers,
  Type,
  Image as ImageIcon,
  Sparkles,
  Save,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  MoveUp,
  MoveDown,
  RotateCw,
  RotateCcw,
  Copy,
  Sliders,
  Check,
  X,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Maximize2,
  FlipHorizontal,
  FlipVertical,
  Settings,
  Crosshair,
  Italic,
  Underline,
  Palette,
  Minus,
  Smartphone,
  Square,
  Monitor,
  FileText,
  Bookmark,
  Tv,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  FolderUp,
  IndianRupee,
  Tag,
  Zap,
  Download,
  ShoppingCart,
  Share2,
} from "lucide-react";
import { calculateTieredCardPrice, CARD_PRICING_TIERS } from "@/lib/pricing";
import OrderOrCartModal from "@/components/cart/OrderOrCartModal";

export interface CanvasElement {
  id: string;
  type: "text" | "image" | "shape" | "sticker";
  fieldKey?: string;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  gradient?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  textAlign?: "left" | "center" | "right" | "justify";
  letterSpacing?: number;
  lineHeight?: number;
  textShadow?: string;
  src?: string;
  x: number; // 0 - 100 (%)
  y: number; // 0 - 100 (%)
  width: number; // 0 - 100 (%)
  height: number; // 0 - 100 (%)
  rotation: number;
  opacity: number;
  zIndex: number;
  backgroundColor?: string;
  flipH?: boolean;
  flipV?: boolean;
  isLocked?: boolean;
}

export interface CardDeckLayer {
  id: string;
  name: string;
  isBase: boolean;
  heightPercent: number; // e.g. 100 for Base, 85 for Layer 2, 70 for Layer 3
  aspectRatio: string; // "classic" | "portrait" | "square" | "landscape" | "cinematic" | "bookmark" | "a4" | "custom"
  customWidth?: number;
  customHeight?: number;
  lockRatio: boolean;
  backgroundColor: string;
  backgroundImage: string | null;
  bgMode: "solid" | "gradient" | "image" | "textures";
  elements: CanvasElement[];
}

export const ASPECT_RATIOS = [
  {
    id: "classic",
    name: "Classic (5:7)",
    shortName: "Classic",
    subtitle: "Standard Wedding Card",
    width: 480,
    height: 672,
    ratioStr: "5:7",
    boxClass: "w-4 h-5.5",
  },
  {
    id: "portrait",
    name: "Story (9:16)",
    shortName: "Story",
    subtitle: "Instagram & WhatsApp Story",
    width: 420,
    height: 746,
    ratioStr: "9:16",
    boxClass: "w-3.5 h-6",
  },
  {
    id: "square",
    name: "Square (1:1)",
    shortName: "Square",
    subtitle: "Social Post & Announcement",
    width: 560,
    height: 560,
    ratioStr: "1:1",
    boxClass: "w-5 h-5",
  },
  {
    id: "landscape",
    name: "Landscape (7:5)",
    shortName: "Landscape",
    subtitle: "Horizontal Card Suite",
    width: 672,
    height: 480,
    ratioStr: "7:5",
    boxClass: "w-6 h-4",
  },
  {
    id: "cinematic",
    name: "Cinematic (16:9)",
    shortName: "Cinematic",
    subtitle: "Wide Video & Screen Display",
    width: 746,
    height: 420,
    ratioStr: "16:9",
    boxClass: "w-6.5 h-3.5",
  },
  {
    id: "bookmark",
    name: "Bookmark (1:2)",
    shortName: "Bookmark",
    subtitle: "Tall Insert Card & Itinerary",
    width: 360,
    height: 720,
    ratioStr: "1:2",
    boxClass: "w-3 h-6",
  },
  {
    id: "a4",
    name: "A4 Print (1:1.41)",
    shortName: "A4 Print",
    subtitle: "Formal Letter & Box Set Insert",
    width: 480,
    height: 678,
    ratioStr: "1:1.41",
    boxClass: "w-4.5 h-6",
  },
  {
    id: "custom",
    name: "Free Size",
    shortName: "Free Size",
    subtitle: "Custom Pixel Dimensions",
    width: 480,
    height: 672,
    ratioStr: "Custom",
    boxClass: "w-5 h-5 border-dashed",
  },
];

export function getLayerDimensions(
  layer: CardDeckLayer,
  baseLayer?: CardDeckLayer
): { width: number; height: number; ratioStr: string } {
  const layerRatioObj = ASPECT_RATIOS.find((r) => r.id === layer.aspectRatio);
  const baseRatioObj = baseLayer
    ? ASPECT_RATIOS.find((r) => r.id === baseLayer.aspectRatio) || ASPECT_RATIOS[0]
    : ASPECT_RATIOS[0];

  const rawBaseH = baseLayer?.customHeight || baseRatioObj.height;
  const rawBaseW = baseLayer?.customWidth || baseRatioObj.width;

  if (layer.isBase) {
    return {
      width: layer.customWidth || (layerRatioObj ? layerRatioObj.width : rawBaseW),
      height: layer.customHeight || (layerRatioObj ? layerRatioObj.height : rawBaseH),
      ratioStr: layerRatioObj ? layerRatioObj.ratioStr : "5:7",
    };
  }

  const heightPct = (layer.heightPercent || 85) / 100;
  const targetH = Math.max(160, Math.round(rawBaseH * heightPct));

  let ratioFraction = 5 / 7;
  if (layerRatioObj && layerRatioObj.id !== "custom") {
    ratioFraction = layerRatioObj.width / layerRatioObj.height;
  } else if (layer.customWidth && layer.customHeight) {
    ratioFraction = layer.customWidth / layer.customHeight;
  } else {
    ratioFraction = rawBaseW / rawBaseH;
  }

  const targetW = Math.max(120, Math.round(targetH * ratioFraction));

  return {
    width: targetW,
    height: targetH,
    ratioStr: layerRatioObj ? layerRatioObj.ratioStr : "Custom",
  };
}

export const CURATED_FONTS = [
  { name: "Cormorant Garamond (Warm Serif)", family: "'Cormorant Garamond', serif" },
  { name: "Playfair Display (Editorial Serif)", family: "'Playfair Display', serif" },
  { name: "Bodoni Moda (Vogue Fashion Serif)", family: "'Bodoni Moda', serif" },
  { name: "Prata (Didone Luxury Serif)", family: "'Prata', serif" },
  { name: "Marcellus (Roman Statuesque)", family: "'Marcellus', serif" },
  { name: "Cinzel (Imperial Roman Caps)", family: "'Cinzel', serif" },
  { name: "Cinzel Decorative (Flourished Gold Caps)", family: "'Cinzel Decorative', serif" },
  { name: "Great Vibes (Classic Wedding Script)", family: "'Great Vibes', cursive" },
  { name: "Alex Brush (Flowing Calligraphy)", family: "'Alex Brush', cursive" },
  { name: "Parisienne (French Romance Script)", family: "'Parisienne', cursive" },
  { name: "Pinyon Script (Royal Copperplate)", family: "'Pinyon Script', cursive" },
  { name: "Sacramento (Fine Monoline Cursive)", family: "'Sacramento', cursive" },
  { name: "Montserrat (Clean Geometric Sans)", family: "'Montserrat', sans-serif" },
  { name: "Outfit (Modern Minimalist Sans)", family: "'Outfit', sans-serif" },
  { name: "Poiret One (1920s Art Deco)", family: "'Poiret One', cursive" },
  { name: "Rozha One (Royal Indian Heavy Serif)", family: "'Rozha One', serif" },
  { name: "Dancing Script (Bouncy Script)", family: "'Dancing Script', cursive" },
  { name: "Satisfy (Retro Brush Script)", family: "'Satisfy', cursive" },
  { name: "Caveat (Boho Handwritten)", family: "'Caveat', cursive" },
  { name: "Pacifico (Retro Fun Script)", family: "'Pacifico', cursive" },
  { name: "Amatic SC (Tall Hand-Drawn Caps)", family: "'Amatic SC', cursive" },
  { name: "Monoton (Retro Multi-Line Neon)", family: "'Monoton', cursive" },
  { name: "Abril Fatface (Vintage Poster Serif)", family: "'Abril Fatface', serif" },
  { name: "UnifrakturMaguntia (Vintage Gothic)", family: "'UnifrakturMaguntia', cursive" },
];

export const DEFAULT_TEXTURES = Array.from({ length: 22 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  return {
    id: `texture-${num}`,
    name: `Luxury Texture ${num}`,
    num,
    src: `/images/canva/backgrounds/texture-${num}.webp`,
  };
});

export const TEXT_GRADIENTS = [
  { name: "Solid (None)", value: "" },
  { name: "Polished Imperial Gold", value: "linear-gradient(135deg, #B38728 0%, #FBF5B7 25%, #DAA520 50%, #AA771C 75%, #FBF5B7 100%)" },
  { name: "Warm Champagne Shimmer", value: "linear-gradient(135deg, #CF9E42 0%, #F4E2BB 50%, #B8860B 100%)" },
  { name: "Rose Gold Elegance", value: "linear-gradient(135deg, #E0A9A9 0%, #F9EBEA 50%, #B76E79 100%)" },
  { name: "Royal Copper Bronze", value: "linear-gradient(135deg, #C47644 0%, #E8A87C 50%, #8A4B29 100%)" },
  { name: "Heritage Crimson Ruby", value: "linear-gradient(135deg, #7F1D1D 0%, #DC2626 50%, #991B1B 100%)" },
  { name: "Midnight Sapphire Emerald", value: "linear-gradient(135deg, #064E3B 0%, #047857 50%, #065F46 100%)" },
];

export const BG_GRADIENTS = [
  { name: "Antique Cream & Gold", value: "linear-gradient(145deg, #FAF6EE 0%, #F3EAD8 50%, #E8D9BD 100%)" },
  { name: "Ivory Pearl Whisper", value: "linear-gradient(145deg, #FFFFFF 0%, #FBF9F5 50%, #F5EFE6 100%)" },
  { name: "Vintage Parchment Warmth", value: "linear-gradient(145deg, #F5EBE1 0%, #EBDBCB 50%, #DFCBBA 100%)" },
  { name: "Royal Burgundy Velvet", value: "linear-gradient(145deg, #4A0E17 0%, #31070D 50%, #1A0307 100%)" },
  { name: "Midnight Sapphire Sky", value: "linear-gradient(145deg, #0B192C 0%, #06101E 50%, #02070D 100%)" },
  { name: "Regal Emerald Forest", value: "linear-gradient(145deg, #0A261A 0%, #05160E 50%, #020B07 100%)" },
  { name: "Vintage Rose Blush", value: "linear-gradient(145deg, #FBF0F0 0%, #F4DDDD 50%, #E8C5C5 100%)" },
  { name: "Smoky Charcoal Obsidian", value: "linear-gradient(145deg, #262626 0%, #171717 50%, #0A0A0A 100%)" },
];

export const PRESET_SHAPES = [
  { id: "rect", name: "Rectangle", type: "shape" as const, width: 30, height: 20, backgroundColor: "#D4AF37", opacity: 0.8 },
  { id: "rounded-rect", name: "Rounded Card", type: "shape" as const, width: 35, height: 25, backgroundColor: "#F3EAD8", opacity: 0.9 },
  { id: "circle", name: "Circle Seal", type: "shape" as const, width: 22, height: 22, backgroundColor: "#991B1B", opacity: 0.9 },
  { id: "divider-line", name: "Thin Gold Line", type: "shape" as const, width: 70, height: 0.4, backgroundColor: "#D4AF37", opacity: 0.85 },
];

export const WEDDING_TEXT_PRESETS = [
  {
    category: "Auspicious Slokas",
    items: [
      {
        label: "|| Shree Ganeshay Namah ||",
        text: "|| श्री गणेशाय नमः ||",
        fontFamily: "'Rozha One', serif",
        fontSize: 16,
        color: "#991B1B",
        letterSpacing: 2,
        fontWeight: "bold",
      },
      {
        label: "|| Vakratunda Mahakaya ||",
        text: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 13,
        color: "#5C3619",
        lineHeight: 1.5,
        letterSpacing: 1,
      },
      {
        label: "|| Shubham Karoti Kalyanam ||",
        text: "शुभं करोति कल्याणम् आरोग्यम् धनसंपदा।\nशत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तुते॥",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 13,
        color: "#5C3619",
        lineHeight: 1.5,
        letterSpacing: 1,
      },
    ],
  },
  {
    category: "Royal Couple Names",
    items: [
      {
        label: "Calligraphy Couple Headline",
        text: "Sophia & Alexander",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 38,
        color: "#1E293B",
        fontWeight: "bold",
      },
      {
        label: "Imperial Roman Names",
        text: "SOPHIA  &  ALEXANDER",
        fontFamily: "'Cinzel', serif",
        fontSize: 22,
        color: "#991B1B",
        letterSpacing: 4,
        fontWeight: "bold",
      },
      {
        label: "Warm Garamond Serif Names",
        text: "Sophia  &  Alexander",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 32,
        color: "#2C1810",
        fontStyle: "italic",
        letterSpacing: 1,
      },
    ],
  },
  {
    category: "Invitations & Taglines",
    items: [
      {
        label: "Formal Family Invitation",
        text: "TOGETHER WITH THEIR PARENTS\nINVITE YOU TO CELEBRATE THE WEDDING OF",
        fontFamily: "'Cinzel', serif",
        fontSize: 10,
        color: "#78350F",
        letterSpacing: 3,
        lineHeight: 1.8,
      },
      {
        label: "Save Our Date Header",
        text: "SAVE OUR DATE",
        fontFamily: "'Cinzel', serif",
        fontSize: 14,
        color: "#991B1B",
        letterSpacing: 5,
        fontWeight: "bold",
      },
      {
        label: "Wedding Ceremony Callout",
        text: "WEDDING CEREMONY & RECEPTION",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 11,
        color: "#1E293B",
        letterSpacing: 3,
        fontWeight: "bold",
      },
    ],
  },
  {
    category: "Event Date, Venue & RSVP",
    items: [
      {
        label: "Classic Date Callout",
        text: "SATURDAY | OCTOBER 30, 2026 | 6:30 PM",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 11,
        color: "#475569",
        letterSpacing: 2,
        fontWeight: "600",
      },
      {
        label: "Venue & Palace Address",
        text: "ELAMBA MUDAKKAL PALACE\nMG Road, Kerala, India",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 14,
        color: "#1E293B",
        letterSpacing: 2,
        lineHeight: 1.6,
      },
      {
        label: "RSVP Contact Block",
        text: "RSVP: +91 98765 43210\nKindly respond by September 15",
        fontFamily: "'Outfit', sans-serif",
        fontSize: 10,
        color: "#64748B",
        letterSpacing: 1,
        lineHeight: 1.6,
      },
    ],
  },
];

export default function CanvaUserStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const templateParam = searchParams.get("template") || searchParams.get("id");
  const orderIdParam = searchParams.get("orderId");
  const itemIdParam = searchParams.get("itemId");

  // Template / Card Metadata
  const [docTitle, setDocTitle] = useState("Sophia & Alexander's Wedding");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusToast, setStatusToast] = useState("");

  // Create New Card Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createCardTitle, setCreateCardTitle] = useState("My Wedding Invitation");
  const [createRatio, setCreateRatio] = useState("classic");
  const [createDeckLayers, setCreateDeckLayers] = useState<number>(1);
  const [createTheme, setCreateTheme] = useState<{ bgMode: "solid" | "gradient" | "image" | "textures"; val: string }>({
    bgMode: "textures",
    val: "/images/canva/backgrounds/texture-01.webp",
  });
  const [createStarterStyle, setCreateStarterStyle] = useState<"blank" | "sloka_names">("sloka_names");

  // Multi-Layer Card Deck State
  const [cardLayers, setCardLayers] = useState<CardDeckLayer[]>([
    {
      id: "layer-1",
      name: "Main Invitation (Base)",
      isBase: true,
      heightPercent: 100,
      aspectRatio: "classic",
      customWidth: 480,
      customHeight: 672,
      lockRatio: true,
      backgroundColor: "#F3EAD8",
      backgroundImage: "/images/canva/backgrounds/texture-01.webp",
      bgMode: "textures",
      elements: [
        {
          id: "starter-sloka",
          type: "text",
          text: "|| श्री गणेशाय नमः ||",
          fontFamily: "'Rozha One', serif",
          fontSize: 16,
          color: "#991B1B",
          fontWeight: "bold",
          textAlign: "center",
          x: 20,
          y: 7,
          width: 60,
          height: 6,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
        },
        {
          id: "starter-motif-top",
          type: "image",
          src: "/images/canva/floral-header.webp",
          x: 22,
          y: 13,
          width: 56,
          height: 12,
          rotation: 0,
          opacity: 0.95,
          zIndex: 2,
        },
        {
          id: "starter-tagline",
          type: "text",
          text: "TOGETHER WITH THEIR FAMILIES\nINVITE YOU TO CELEBRATE THE WEDDING OF",
          fontFamily: "'Cinzel', serif",
          fontSize: 10,
          color: "#78350F",
          letterSpacing: 2.5,
          lineHeight: 1.6,
          textAlign: "center",
          x: 10,
          y: 26,
          width: 80,
          height: 8,
          rotation: 0,
          opacity: 0.9,
          zIndex: 3,
        },
        {
          id: "starter-names",
          type: "text",
          text: "Sophia & Alexander",
          fontFamily: "'Great Vibes', cursive",
          fontSize: 40,
          color: "#1E293B",
          fontWeight: "bold",
          textAlign: "center",
          x: 10,
          y: 35,
          width: 80,
          height: 14,
          rotation: 0,
          opacity: 1,
          zIndex: 4,
        },
        {
          id: "starter-divider",
          type: "image",
          src: "/images/canva/leaf-divider.webp",
          x: 30,
          y: 49,
          width: 40,
          height: 5,
          rotation: 0,
          opacity: 0.85,
          zIndex: 5,
        },
        {
          id: "starter-date",
          type: "text",
          text: "SATURDAY | OCTOBER 30, 2026 | 6:30 PM",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: "#991B1B",
          letterSpacing: 2,
          fontWeight: "bold",
          textAlign: "center",
          x: 10,
          y: 56,
          width: 80,
          height: 6,
          rotation: 0,
          opacity: 1,
          zIndex: 6,
        },
        {
          id: "starter-venue",
          type: "text",
          text: "ELAMBA MUDAKKAL PALACE\nMG Road, Kerala, India",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 15,
          color: "#2C1810",
          letterSpacing: 1.5,
          lineHeight: 1.5,
          textAlign: "center",
          x: 10,
          y: 64,
          width: 80,
          height: 10,
          rotation: 0,
          opacity: 0.95,
          zIndex: 7,
        },
        {
          id: "starter-footer-motif",
          type: "image",
          src: "/images/canva/floral-footer.webp",
          x: 24,
          y: 77,
          width: 52,
          height: 14,
          rotation: 0,
          opacity: 0.9,
          zIndex: 8,
        },
      ],
    },
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>("layer-1");

  // Selection & UI State
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"SETTINGS" | "TEXT" | "ASSETS" | "LAYERS" | "TEMPLATES">("SETTINGS");
  const [testMode, setTestMode] = useState(false);
  const [zoom, setZoom] = useState<number>(0.9);
  const [scaleContentWithSize, setScaleContentWithSize] = useState<boolean>(true);

  // Mobile Drawers
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);

  // Modals
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Pricing & Database Templates
  const [pricePerCard, setPricePerCard] = useState<number>(30);
  const [minCopies, setMinCopies] = useState<number>(50);
  const [dynamicTemplates, setDynamicTemplates] = useState<any[]>([]);
  const [uploadedGraphics, setUploadedGraphics] = useState<string[]>([
    "/images/canva/leaf-divider.webp",
    "/images/canva/floral-footer.webp",
    "/images/canva/floral-header.webp",
    "/images/canva/vintage-swirl-header.webp",
    "/images/canva/vintage-wave-divider.webp",
    "/images/canva/vintage-swirl-footer.webp",
    "/images/canva/interlocked-rings.svg",
    "/images/canva/victorian-header-swirl.webp",
    "/images/canva/victorian-footer-swirl.webp",
    "/images/canva/victorian-center-divider.webp",
    "/images/canva/victorian-date-badge.webp",
    "/images/canva/modern3-foliage-top.webp",
    "/images/canva/modern3-foliage-bottom.webp",
  ]);
  const [texturesList, setTexturesList] = useState<Array<{ id: string; name: string; num: string; src: string }>>(DEFAULT_TEXTURES);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Canvas & Interaction Refs
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isInteractingRef = useRef<boolean>(false);
  const interactionStartRef = useRef<{
    startX: number;
    startY: number;
    elemX: number;
    elemY: number;
    elemW: number;
    elemH: number;
    handle?: string;
  } | null>(null);

  // Undo / Redo History
  const [history, setHistory] = useState<Array<{ layers: CardDeckLayer[]; activeLayerId: string }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Active Layer & Base Layer Computations
  const activeLayer = cardLayers.find((l) => l.id === activeLayerId) || cardLayers[0] || {
    id: "layer-1",
    name: "Main Invitation (Base)",
    isBase: true,
    heightPercent: 100,
    aspectRatio: "classic",
    customWidth: 480,
    customHeight: 672,
    lockRatio: true,
    backgroundColor: "#F3EAD8",
    backgroundImage: null,
    bgMode: "textures",
    elements: [],
  };
  const baseLayer = cardLayers.find((l) => l.isBase) || cardLayers[0] || activeLayer;
  const activeDimensions = getLayerDimensions(activeLayer, baseLayer);
  const baseDimensions = getLayerDimensions(baseLayer, baseLayer);
  const selectedRatio = ASPECT_RATIOS.find((r) => r.id === activeLayer.aspectRatio) || ASPECT_RATIOS[0];
  const selectedElement = activeLayer.elements.find((el) => el.id === selectedElementId) || null;

  // History Recording
  const recordHistory = useCallback((newLayers: CardDeckLayer[]) => {
    setHistory((prev) => {
      const slice = prev.slice(0, historyIndex + 1);
      return [...slice, { layers: JSON.parse(JSON.stringify(newLayers)), activeLayerId }];
    });
    setHistoryIndex((prev) => prev + 1);
    setHasUnsavedChanges(true);
  }, [historyIndex, activeLayerId]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const target = history[historyIndex - 1];
      setCardLayers(JSON.parse(JSON.stringify(target.layers)));
      setActiveLayerId(target.activeLayerId);
      setHistoryIndex(historyIndex - 1);
      setSelectedElementId(null);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const target = history[historyIndex + 1];
      setCardLayers(JSON.parse(JSON.stringify(target.layers)));
      setActiveLayerId(target.activeLayerId);
      setHistoryIndex(historyIndex + 1);
      setSelectedElementId(null);
    }
  }, [historyIndex, history]);

  // Layer State Updaters
  const updateActiveLayer = (updates: Partial<CardDeckLayer>) => {
    setCardLayers((prev) => {
      const updated = prev.map((l) => (l.id === activeLayer.id ? { ...l, ...updates } : l));
      recordHistory(updated);
      return updated;
    });
  };

  const setElements = (updater: CanvasElement[] | ((prev: CanvasElement[]) => CanvasElement[])) => {
    setCardLayers((prev) => {
      const updated = prev.map((l) => {
        if (l.id !== activeLayer.id) return l;
        const newElements = typeof updater === "function" ? updater(l.elements) : updater;
        return { ...l, elements: newElements };
      });
      recordHistory(updated);
      return updated;
    });
  };

  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElementId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedElementId ? { ...el, ...updates } : el))
    );
  };

  // Content Auto-Scaling helper
  const getScaledElementsForDimensions = (
    currentElements: CanvasElement[],
    oldW: number,
    oldH: number,
    newW: number,
    newH: number
  ): CanvasElement[] => {
    if (!scaleContentWithSize || oldW <= 0 || oldH <= 0 || newW <= 0 || newH <= 0) {
      return currentElements;
    }
    const scaleFactor = Math.min(newW / oldW, newH / oldH);
    return currentElements.map((el) => {
      if (el.type === "text" && el.fontSize) {
        const scaledFont = Math.max(8, Math.round(el.fontSize * scaleFactor));
        return { ...el, fontSize: scaledFont };
      }
      return el;
    });
  };

  // Fit to screen helper
  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const containerH = containerRef.current.clientHeight - 130;
    const containerW = containerRef.current.clientWidth - 70;
    const scaleH = containerH / activeDimensions.height;
    const scaleW = containerW / activeDimensions.width;
    const fitScale = Math.min(scaleH, scaleW, 1.0);
    setZoom(Math.max(0.35, Math.round(fitScale * 100) / 100));
  }, [activeDimensions.height, activeDimensions.width]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleFitToScreen();
    }, 120);
    return () => clearTimeout(timer);
  }, [activeLayerId, activeLayer.aspectRatio, activeLayer.heightPercent, handleFitToScreen]);

  // Load public assets, textures, and templates
  useEffect(() => {
    async function loadResources() {
      try {
        setIsLoadingAssets(true);
        // Load textures
        fetch("/api/canva/textures")
          .then((r) => r.json())
          .then((d) => {
            if (d.textures && Array.isArray(d.textures) && d.textures.length > 0) {
              setTexturesList(d.textures);
            }
          })
          .catch(() => {});

        // Load graphic assets
        fetch("/api/canva/assets")
          .then((r) => r.json())
          .then((d) => {
            if (d.assets && Array.isArray(d.assets) && d.assets.length > 0) {
              setUploadedGraphics((prev) => Array.from(new Set([...d.assets, ...prev])));
            }
          })
          .catch(() => {});

        // Load templates
        fetch("/api/canva/templates")
          .then((r) => r.json())
          .then((d) => {
            if (d.templates && Array.isArray(d.templates)) {
              setDynamicTemplates(d.templates);
            }
          })
          .catch(() => {});
      } finally {
        setIsLoadingAssets(false);
      }
    }
    loadResources();
  }, []);

  // Preload template if specified in query param
  useEffect(() => {
    if (!templateParam) return;
    async function loadTemplate() {
      try {
        const res = await fetch("/api/canva/templates");
        const data = await res.json();
        if (data.templates && Array.isArray(data.templates)) {
          const found = data.templates.find(
            (t: any) => t.id === templateParam || t.dbId === templateParam || t.slug === templateParam
          );
          if (found) {
            setDocTitle(found.name || "Custom Invitation Card");
            if (found.elements && found.elements.layers) {
              setCardLayers(found.elements.layers);
              setActiveLayerId(found.elements.activeLayerId || found.elements.layers[0]?.id || "layer-1");
            } else if (Array.isArray(found.elements)) {
              setCardLayers([
                {
                  id: "layer-1",
                  name: "Main Invitation (Base)",
                  isBase: true,
                  heightPercent: 100,
                  aspectRatio: found.aspectRatio || "classic",
                  customWidth: 480,
                  customHeight: 672,
                  lockRatio: true,
                  backgroundColor: found.backgroundColor || "#F3EAD8",
                  backgroundImage: found.backgroundImage || null,
                  bgMode: found.backgroundImage ? "image" : "textures",
                  elements: found.elements,
                },
              ]);
            }
          }
        }
      } catch (e) {
        console.warn("Failed to load template param:", e);
      }
    }
    loadTemplate();
  }, [templateParam]);

  // BRAND NEW FEATURE: CREATE NEW INVITATION CARD HANDLER
  const handleCreateNewCard = () => {
    const chosenRatioObj = ASPECT_RATIOS.find((r) => r.id === createRatio) || ASPECT_RATIOS[0];
    const baseW = chosenRatioObj.width;
    const baseH = chosenRatioObj.height;

    const layersCount = Math.max(1, Math.min(3, createDeckLayers));
    const newLayers: CardDeckLayer[] = [];

    // Base Layer
    const starterElements: CanvasElement[] =
      createStarterStyle === "sloka_names"
        ? [
            {
              id: `starter-sloka-${Date.now()}`,
              type: "text",
              text: "|| श्री गणेशाय नमः ||",
              fontFamily: "'Rozha One', serif",
              fontSize: 16,
              color: "#991B1B",
              fontWeight: "bold",
              textAlign: "center",
              x: 20,
              y: 8,
              width: 60,
              height: 6,
              rotation: 0,
              opacity: 1,
              zIndex: 1,
            },
            {
              id: `starter-motif-${Date.now()}`,
              type: "image",
              src: "/images/canva/floral-header.webp",
              x: 25,
              y: 15,
              width: 50,
              height: 12,
              rotation: 0,
              opacity: 0.95,
              zIndex: 2,
            },
            {
              id: `starter-names-${Date.now()}`,
              type: "text",
              text: "Sophia & Alexander",
              fontFamily: "'Great Vibes', cursive",
              fontSize: 38,
              color: "#1E293B",
              fontWeight: "bold",
              textAlign: "center",
              x: 10,
              y: 35,
              width: 80,
              height: 14,
              rotation: 0,
              opacity: 1,
              zIndex: 3,
            },
            {
              id: `starter-date-${Date.now()}`,
              type: "text",
              text: "SATURDAY | OCTOBER 30, 2026",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11,
              color: "#991B1B",
              letterSpacing: 2,
              fontWeight: "bold",
              textAlign: "center",
              x: 10,
              y: 56,
              width: 80,
              height: 6,
              rotation: 0,
              opacity: 1,
              zIndex: 4,
            },
            {
              id: `starter-venue-${Date.now()}`,
              type: "text",
              text: "ELAMBA MUDAKKAL PALACE",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 15,
              color: "#2C1810",
              letterSpacing: 1.5,
              textAlign: "center",
              x: 10,
              y: 65,
              width: 80,
              height: 8,
              rotation: 0,
              opacity: 0.95,
              zIndex: 5,
            },
          ]
        : [];

    newLayers.push({
      id: "layer-1",
      name: "Main Invitation (Base)",
      isBase: true,
      heightPercent: 100,
      aspectRatio: createRatio,
      customWidth: baseW,
      customHeight: baseH,
      lockRatio: true,
      backgroundColor: createTheme.bgMode === "solid" ? createTheme.val : "#F3EAD8",
      backgroundImage: createTheme.bgMode !== "solid" ? createTheme.val : null,
      bgMode: createTheme.bgMode,
      elements: starterElements,
    });

    if (layersCount >= 2) {
      newLayers.push({
        id: "layer-2",
        name: "Program & Functions (Insert)",
        isBase: false,
        heightPercent: 85,
        aspectRatio: createRatio,
        customWidth: Math.round(baseW * 0.85),
        customHeight: Math.round(baseH * 0.85),
        lockRatio: true,
        backgroundColor: "#FFFFFF",
        backgroundImage: null,
        bgMode: "solid",
        elements: [
          {
            id: `insert-title-${Date.now()}`,
            type: "text",
            text: "WEDDING ITINERARY & PROGRAM",
            fontFamily: "'Cinzel', serif",
            fontSize: 14,
            color: "#991B1B",
            letterSpacing: 3,
            fontWeight: "bold",
            textAlign: "center",
            x: 10,
            y: 12,
            width: 80,
            height: 8,
            rotation: 0,
            opacity: 1,
            zIndex: 1,
          },
        ],
      });
    }

    if (layersCount >= 3) {
      newLayers.push({
        id: "layer-3",
        name: "RSVP & Details (Top Sheet)",
        isBase: false,
        heightPercent: 70,
        aspectRatio: createRatio,
        customWidth: Math.round(baseW * 0.7),
        customHeight: Math.round(baseH * 0.7),
        lockRatio: true,
        backgroundColor: "#FAF6EE",
        backgroundImage: null,
        bgMode: "solid",
        elements: [
          {
            id: `rsvp-title-${Date.now()}`,
            type: "text",
            text: "KINDLY RSVP",
            fontFamily: "'Cinzel', serif",
            fontSize: 14,
            color: "#991B1B",
            letterSpacing: 3,
            fontWeight: "bold",
            textAlign: "center",
            x: 10,
            y: 14,
            width: 80,
            height: 8,
            rotation: 0,
            opacity: 1,
            zIndex: 1,
          },
        ],
      });
    }

    setDocTitle(createCardTitle.trim() || "My Wedding Invitation");
    setCardLayers(newLayers);
    setActiveLayerId("layer-1");
    setSelectedElementId(null);
    setShowCreateModal(false);
    setHistory([]);
    setHistoryIndex(-1);
    setHasUnsavedChanges(true);

    setStatusToast("🎉 Created new invitation card! Ready to customize.");
    setTimeout(() => setStatusToast(""), 3500);
  };

  // Add Card Deck Layer
  const handleAddLayer = () => {
    const nextIdx = cardLayers.length + 1;
    const newId = `layer-${Date.now()}`;
    const defaultPct = nextIdx === 2 ? 85 : nextIdx === 3 ? 72 : 60;
    const baseDim = getLayerDimensions(baseLayer, baseLayer);
    const newLayer: CardDeckLayer = {
      id: newId,
      name: `Card Sheet ${nextIdx}`,
      isBase: false,
      heightPercent: defaultPct,
      aspectRatio: activeLayer.aspectRatio === "custom" ? "classic" : activeLayer.aspectRatio,
      customWidth: Math.round(baseDim.width * (defaultPct / 100)),
      customHeight: Math.round(baseDim.height * (defaultPct / 100)),
      lockRatio: true,
      backgroundColor: "#FFFFFF",
      backgroundImage: null,
      bgMode: "solid",
      elements: [],
    };
    const updated = [...cardLayers, newLayer];
    setCardLayers(updated);
    setActiveLayerId(newId);
    setSelectedElementId(null);
    recordHistory(updated);
    setStatusToast(`✨ Added new card sheet: "${newLayer.name}"`);
    setTimeout(() => setStatusToast(""), 3500);
  };

  // Duplicate Layer
  const handleDuplicateLayer = (layerId: string) => {
    const target = cardLayers.find((l) => l.id === layerId);
    if (!target) return;
    const newId = `layer-${Date.now()}`;
    const newLayer: CardDeckLayer = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      isBase: false,
      elements: target.elements.map((el) => ({
        ...el,
        id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      })),
    };
    const updated = [...cardLayers, newLayer];
    setCardLayers(updated);
    setActiveLayerId(newId);
    setSelectedElementId(null);
    recordHistory(updated);
    setStatusToast(`📋 Duplicated "${target.name}"`);
    setTimeout(() => setStatusToast(""), 3500);
  };

  // Delete Layer
  const handleDeleteLayer = (layerId: string) => {
    if (cardLayers.length <= 1) {
      alert("An invitation card must have at least one card sheet layer.");
      return;
    }
    const target = cardLayers.find((l) => l.id === layerId);
    if (!confirm(`Are you sure you want to delete card layer "${target?.name}"?`)) return;

    const filtered = cardLayers.filter((l) => l.id !== layerId);
    if (!filtered.some((l) => l.isBase) && filtered.length > 0) {
      filtered[0].isBase = true;
      filtered[0].heightPercent = 100;
    }
    setCardLayers(filtered);
    if (activeLayerId === layerId) {
      setActiveLayerId(filtered[0]?.id || "layer-1");
    }
    setSelectedElementId(null);
    recordHistory(filtered);
    setStatusToast("🗑️ Card layer removed");
    setTimeout(() => setStatusToast(""), 3000);
  };

  // Element Actions (Add, Delete, Duplicate, Bring to Front, Send to Back)
  const handleAddTextElement = (preset?: Partial<CanvasElement>) => {
    const newId = `text-${Date.now()}`;
    const newEl: CanvasElement = {
      id: newId,
      type: "text",
      text: preset?.text || "New Text",
      fontFamily: preset?.fontFamily || "'Cormorant Garamond', serif",
      fontSize: preset?.fontSize || 24,
      color: preset?.color || "#1E293B",
      fontWeight: preset?.fontWeight || "normal",
      fontStyle: preset?.fontStyle || "normal",
      textAlign: preset?.textAlign || "center",
      letterSpacing: preset?.letterSpacing || 1,
      lineHeight: preset?.lineHeight || 1.4,
      x: 15,
      y: 40,
      width: 70,
      height: 10,
      rotation: 0,
      opacity: 1,
      zIndex: activeLayer.elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newId);
  };

  const handleAddImageElement = (src: string) => {
    const newId = `img-${Date.now()}`;
    const newEl: CanvasElement = {
      id: newId,
      type: "image",
      src,
      x: 25,
      y: 30,
      width: 50,
      height: 25,
      rotation: 0,
      opacity: 1,
      zIndex: activeLayer.elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newId);
  };

  const handleAddShapeElement = (shape: typeof PRESET_SHAPES[0]) => {
    const newId = `shape-${Date.now()}`;
    const newEl: CanvasElement = {
      id: newId,
      type: "shape",
      backgroundColor: shape.backgroundColor,
      opacity: shape.opacity,
      x: 30,
      y: 40,
      width: shape.width,
      height: shape.height,
      rotation: 0,
      zIndex: activeLayer.elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newId);
  };

  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleDuplicateElement = (id: string) => {
    const target = activeLayer.elements.find((el) => el.id === id);
    if (!target) return;
    const newId = `el-${Date.now()}`;
    const newEl = {
      ...target,
      id: newId,
      x: Math.min(80, target.x + 4),
      y: Math.min(80, target.y + 4),
      zIndex: activeLayer.elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newId);
  };

  const handleMoveLayerZIndex = (id: string, direction: "up" | "down" | "top" | "bottom") => {
    const list = [...activeLayer.elements];
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) return;

    const el = list[idx];
    if (direction === "up" && idx < list.length - 1) {
      list[idx] = list[idx + 1];
      list[idx + 1] = el;
    } else if (direction === "down" && idx > 0) {
      list[idx] = list[idx - 1];
      list[idx - 1] = el;
    } else if (direction === "top") {
      list.splice(idx, 1);
      list.push(el);
    } else if (direction === "bottom") {
      list.splice(idx, 1);
      list.unshift(el);
    }
    const reindexed = list.map((item, i) => ({ ...item, zIndex: i + 1 }));
    setElements(reindexed);
  };

  // Alignment Helpers
  const handleAlignElement = (align: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    if (!selectedElement) return;
    let updates: Partial<CanvasElement> = {};
    if (align === "left") updates = { x: 5 };
    if (align === "center") updates = { x: Math.max(0, (100 - selectedElement.width) / 2) };
    if (align === "right") updates = { x: 100 - selectedElement.width - 5 };
    if (align === "top") updates = { y: 5 };
    if (align === "middle") updates = { y: Math.max(0, (100 - selectedElement.height) / 2) };
    if (align === "bottom") updates = { y: 100 - selectedElement.height - 5 };
    updateSelectedElement(updates);
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const result = loadEvent.target?.result as string;
          if (result) {
            setUploadedGraphics((prev) => [result, ...prev]);
            handleAddImageElement(result);
          }
        };
        reader.readAsDataURL(file);
      }
      setStatusToast("📷 Photo uploaded to your canvas");
      setTimeout(() => setStatusToast(""), 3500);
    } catch {
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Drag & Drop / Resize Engine on Canvas
  const handleMouseDownElement = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation();
    setSelectedElementId(el.id);
    if (el.isLocked) return;

    isInteractingRef.current = true;
    interactionStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elemX: el.x,
      elemY: el.y,
      elemW: el.width,
      elemH: el.height,
    };
  };

  const handleMouseDownResize = (e: React.MouseEvent, handle: string, el: CanvasElement) => {
    e.stopPropagation();
    if (el.isLocked) return;

    isInteractingRef.current = true;
    interactionStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elemX: el.x,
      elemY: el.y,
      elemW: el.width,
      elemH: el.height,
      handle,
    };
  };

  // Global mousemove & mouseup for drag/resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isInteractingRef.current || !interactionStartRef.current || !selectedElementId) return;

      const { startX, startY, elemX, elemY, elemW, elemH, handle } = interactionStartRef.current;
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      const rect = canvasEl.getBoundingClientRect();
      const deltaXPercent = ((e.clientX - startX) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - startY) / rect.height) * 100;

      if (!handle) {
        // Dragging Element
        const newX = Math.max(-20, Math.min(100, Math.round((elemX + deltaXPercent) * 10) / 10));
        const newY = Math.max(-20, Math.min(100, Math.round((elemY + deltaYPercent) * 10) / 10));
        updateSelectedElement({ x: newX, y: newY });
      } else {
        // Resizing Element
        let newW = elemW;
        let newH = elemH;
        let newX = elemX;
        let newY = elemY;

        if (handle.includes("e")) newW = Math.max(5, Math.min(100, elemW + deltaXPercent));
        if (handle.includes("s")) newH = Math.max(2, Math.min(100, elemH + deltaYPercent));
        if (handle.includes("w")) {
          const diffW = elemW - deltaXPercent;
          if (diffW >= 5) {
            newW = diffW;
            newX = elemX + deltaXPercent;
          }
        }
        if (handle.includes("n")) {
          const diffH = elemH - deltaYPercent;
          if (diffH >= 2) {
            newH = diffH;
            newY = elemY + deltaYPercent;
          }
        }

        updateSelectedElement({
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
        });
      }
    };

    const handleMouseUp = () => {
      if (isInteractingRef.current) {
        isInteractingRef.current = false;
        interactionStartRef.current = null;
        recordHistory(cardLayers);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedElementId, cardLayers, recordHistory]);

  // Save Card Handler
  const handleSaveCard = async () => {
    setSaving(true);
    try {
      const cardPayload = {
        title: docTitle,
        aspectRatio: activeLayer.aspectRatio,
        cardLayers,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("canva_user_card_draft", JSON.stringify(cardPayload));

      if (session?.user) {
        await fetch("/api/user/cards/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId: 1,
            templateName: docTitle,
            partnerOne: "Sophia",
            partnerTwo: "Alexander",
            weddingDate: "October 30, 2026",
            cardDataJson: JSON.stringify(cardPayload),
          }),
        });
      }

      setHasUnsavedChanges(false);
      setStatusToast("✨ Invitation card saved successfully!");
      setTimeout(() => setStatusToast(""), 3500);
    } catch (e) {
      console.error("Save card error:", e);
      setStatusToast("Saved to local storage draft");
      setTimeout(() => setStatusToast(""), 3500);
    } finally {
      setSaving(false);
    }
  };

  // High-Res Export (PNG / PDF)
  const handleExport = async (format: "png" | "pdf") => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setSelectedElementId(null);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const fileName = `${docTitle.toLowerCase().replace(/[^a-z0-9]/g, "-") || "invitation-card"}.${format}`;

      if (format === "png") {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const { jsPDF } = await import("jspdf");
        const w = activeDimensions.width;
        const h = activeDimensions.height;
        const pdf = new jsPDF(w > h ? "landscape" : "portrait", "px", [w, h]);
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, w, h);
        pdf.save(fileName);
      }
      setStatusToast(`🎉 Exported ${format.toUpperCase()} successfully!`);
      setTimeout(() => setStatusToast(""), 3500);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden flex flex-col bg-slate-100/70 text-slate-900 font-sans select-none">
      {/* ── TOPBAR: CLEAN WHITE & RED BRANDING WITH BRAND NEW "CREATE NEW CARD" FEATURE ── */}
      <header className="h-14 bg-white border-b border-slate-200 shrink-0 z-30 shadow-xs flex items-center justify-between px-2 sm:px-4 md:px-6 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <Link
            href="/templates"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="Back to Templates"
          >
            <ArrowLeft className="w-4 h-4 text-[#991B1B]" />
            <span className="hidden md:inline">Templates</span>
          </Link>

          {/* 🌟 BRAND NEW FEATURE: CREATE NEW CARD BUTTON 🌟 */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
            title="Create a brand new invitation card from scratch"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Card</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

          {/* Card Title Input & Badge */}
          <div className="flex items-center gap-1.5 min-w-0">
            <input
              type="text"
              value={docTitle}
              onChange={(e) => {
                setDocTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#991B1B] text-xs sm:text-sm font-bold text-slate-900 outline-none px-2 py-1 rounded-xl transition-all w-28 sm:w-44 md:w-56 truncate shadow-2xs"
              placeholder="Card Title..."
            />
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[8.5px] font-bold border border-slate-200 hidden lg:inline-flex shrink-0">
              {selectedRatio.name}
            </span>

            {/* Print Pricing Pill */}
            <div className="flex items-center gap-1 bg-red-50/70 border border-red-200 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl shadow-2xs shrink-0">
              <span className="text-[11px] font-bold text-[#991B1B] hidden xl:inline">Print:</span>
              <span className="text-xs font-black text-[#991B1B]">₹{pricePerCard}</span>
              <span className="text-[9.5px] font-bold text-slate-600 hidden xs:inline">/card</span>
              <button
                type="button"
                onClick={() => setShowPricingModal(true)}
                className="text-[9px] bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold px-1.5 py-0.5 rounded cursor-pointer transition-colors shadow-2xs"
                title="View volume pricing table"
              >
                Tiers
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons: Undo/Redo, Preview, Download, Save, Order */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preview Button */}
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
            title="Preview full invitation card"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Preview</span>
          </button>

          {/* Download Dropdown */}
          <div className="relative group">
            <button
              type="button"
              disabled={isExporting}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Download Card"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 hidden group-hover:block">
              <button
                type="button"
                onClick={() => handleExport("png")}
                className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>High-Res PNG</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport("pdf")}
                className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Print-Ready PDF</span>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveCard}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              hasUnsavedChanges
                ? "bg-[#991B1B] hover:bg-[#7F1D1D] text-white"
                : "bg-emerald-50 text-emerald-700 border border-emerald-300"
            }`}
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : hasUnsavedChanges ? (
              <Save className="w-3.5 h-3.5" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{saving ? "Saving..." : hasUnsavedChanges ? "Save" : "Saved"}</span>
          </button>

          {/* Order Physical Prints Button */}
          <button
            type="button"
            onClick={() => setShowOrderModal(true)}
            className="px-3 sm:px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
            <span>Order Prints</span>
          </button>
        </div>
      </header>

      {/* Success Notification Toast */}
      {statusToast && (
        <div className="fixed top-18 right-6 z-50 bg-[#991B1B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/20 animate-slide-down">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* ── 3-COLUMN WORKSPACE: LEFT TOOLS, CANVAS, RIGHT INSPECTOR ── */}
      <div className="flex-1 min-h-0 flex flex-row overflow-hidden">
        {/* Mobile Left Backdrop */}
        {mobileLeftOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileLeftOpen(false)}
          />
        )}

        {/* ── LEFT SIDEBAR: TOOLS & PRESETS (SETTINGS, TEXT, ASSETS, LAYERS, TEMPLATES) ── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm bg-white shadow-2xl transition-transform duration-200 flex flex-col border-r border-slate-200 shrink-0 lg:static lg:z-10 lg:w-80 lg:translate-x-0 lg:shadow-xs ${
            mobileLeftOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Mobile Drawer Header */}
          <div className="lg:hidden p-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <span className="font-extrabold text-xs flex items-center gap-1.5">
              <span>🛠️</span> Studio Tools
            </span>
            <button
              type="button"
              onClick={() => setMobileLeftOpen(false)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs: SETTINGS | TEXT | ASSETS | LAYERS | TEMPLATES */}
          <div className="shrink-0 grid grid-cols-5 p-2 gap-1 bg-slate-50 border-b border-slate-200 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("SETTINGS")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "SETTINGS" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("TEXT")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "TEXT" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ASSETS")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "ASSETS" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Assets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("LAYERS")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "LAYERS" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("TEMPLATES")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "TEMPLATES" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Designs</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-auto overscroll-contain bg-white">
            {/* ── TAB 1: CANVAS & SETTINGS (ASPECT RATIOS, DECK LAYERS, BACKGROUNDS) ── */}
            {activeTab === "SETTINGS" && (
              <div className="p-4 space-y-5 text-xs">
                {/* Brand New Feature Banner in Canvas Settings */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#991B1B] text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Start New Card
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(true)}
                      className="px-2.5 py-1 bg-[#991B1B] hover:bg-[#7F1D1D] text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      New Card
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-600">
                    Create a customized invitation card with custom aspect ratios, multi-deck layers, and luxury textures.
                  </p>
                </div>

                {/* Aspect Ratio Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                      Card Dimensions & Format
                    </label>
                    <span className="text-[10px] text-[#991B1B] font-bold">{selectedRatio.ratioStr}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {ASPECT_RATIOS.map((ratio) => {
                      const isSelected = activeLayer.aspectRatio === ratio.id;
                      return (
                        <button
                          key={ratio.id}
                          type="button"
                          onClick={() => {
                            const oldW = activeDimensions.width;
                            const oldH = activeDimensions.height;
                            const newW = ratio.width;
                            const newH = ratio.height;
                            const scaledElements = getScaledElementsForDimensions(
                              activeLayer.elements,
                              oldW,
                              oldH,
                              newW,
                              newH
                            );
                            updateActiveLayer({
                              aspectRatio: ratio.id,
                              customWidth: newW,
                              customHeight: newH,
                              elements: scaledElements,
                            });
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-red-50/60 border-[#991B1B] ring-1 ring-[#991B1B]/30"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-bold text-xs ${isSelected ? "text-[#991B1B]" : "text-slate-800"}`}>
                              {ratio.shortName}
                            </span>
                            <div className={`rounded-xs border ${ratio.boxClass} ${isSelected ? "border-[#991B1B] bg-red-100/50" : "border-slate-300"}`} />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono mt-1">
                            {ratio.width} × {ratio.height}px
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Multi-Layer Card Deck Manager */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#991B1B]" />
                      Card Deck Multi-Layers ({cardLayers.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddLayer}
                      className="px-2 py-0.5 rounded-lg bg-red-50 text-[#991B1B] hover:bg-red-100 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add Layer
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {cardLayers.map((layer, idx) => {
                      const isSelected = layer.id === activeLayerId;
                      return (
                        <div
                          key={layer.id}
                          onClick={() => {
                            setActiveLayerId(layer.id);
                            setSelectedElementId(null);
                          }}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-red-50/40 border-[#991B1B] ring-1 ring-[#991B1B]/20"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                              {idx + 1}
                            </span>
                            <div className="truncate">
                              <span className="font-bold text-xs text-slate-800 block truncate">{layer.name}</span>
                              <span className="text-[10px] text-slate-500">
                                {layer.isBase ? "⭐ Fixed Base Layer (100%)" : `Height: ${layer.heightPercent}%`}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!layer.isBase && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLayer(layer.id);
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete layer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Background: Textures, Colors, Gradients, Images */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                    Card Background
                  </label>
                  {/* Mode Selector */}
                  <div className="grid grid-cols-4 p-1 bg-slate-100 rounded-xl text-[10px] font-bold">
                    {(["textures", "solid", "gradient", "image"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => updateActiveLayer({ bgMode: mode })}
                        className={`py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                          activeLayer.bgMode === mode ? "bg-white text-[#991B1B] shadow-2xs font-extrabold" : "text-slate-600"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  {/* Textures Gallery */}
                  {activeLayer.bgMode === "textures" && (
                    <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto custom-scrollbar p-1">
                      {texturesList.map((tex) => {
                        const isSelected = activeLayer.backgroundImage === tex.src;
                        return (
                          <button
                            key={tex.id}
                            type="button"
                            onClick={() =>
                              updateActiveLayer({
                                bgMode: "textures",
                                backgroundImage: tex.src,
                              })
                            }
                            className={`group relative rounded-xl border overflow-hidden aspect-square transition-all cursor-pointer ${
                              isSelected ? "border-[#991B1B] ring-2 ring-[#991B1B]/30" : "border-slate-200 hover:border-slate-400"
                            }`}
                            title={tex.name}
                          >
                            <img src={tex.src} alt={tex.name} className="w-full h-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-[#991B1B]/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Solid Colors */}
                  {activeLayer.bgMode === "solid" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeLayer.backgroundColor?.startsWith("#") ? activeLayer.backgroundColor : "#FFFFFF"}
                          onChange={(e) =>
                            updateActiveLayer({
                              bgMode: "solid",
                              backgroundColor: e.target.value,
                              backgroundImage: null,
                            })
                          }
                          className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {activeLayer.backgroundColor}
                        </span>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5 pt-1">
                        {["#FFFFFF", "#F3EAD8", "#FAF6EE", "#4A0E17", "#0B192C", "#1E293B", "#FDF2F2", "#F0FDF4"].map(
                          (hex) => (
                            <button
                              key={hex}
                              type="button"
                              onClick={() =>
                                updateActiveLayer({
                                  bgMode: "solid",
                                  backgroundColor: hex,
                                  backgroundImage: null,
                                })
                              }
                              style={{ backgroundColor: hex }}
                              className="w-7 h-7 rounded-lg border border-slate-300 hover:scale-110 transition-transform cursor-pointer"
                              title={hex}
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Gradients */}
                  {activeLayer.bgMode === "gradient" && (
                    <div className="grid grid-cols-2 gap-2">
                      {BG_GRADIENTS.map((grad) => (
                        <button
                          key={grad.name}
                          type="button"
                          onClick={() =>
                            updateActiveLayer({
                              bgMode: "gradient",
                              backgroundColor: grad.value,
                              backgroundImage: null,
                            })
                          }
                          style={{ background: grad.value }}
                          className="h-12 rounded-xl border border-slate-200 hover:scale-102 transition-transform cursor-pointer p-1 text-left flex items-end"
                        >
                          <span className="text-[9px] font-bold text-slate-900 bg-white/80 px-1 rounded truncate">
                            {grad.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Custom Background Image */}
                  {activeLayer.bgMode === "image" && (
                    <div className="space-y-2">
                      <label className="block p-4 border-2 border-dashed border-slate-200 hover:border-[#991B1B] rounded-2xl text-center cursor-pointer transition-colors">
                        <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <span className="text-xs font-bold text-slate-700 block">Upload Background Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 2: TEXT & WEDDING TYPOGRAPHY PRESETS ── */}
            {activeTab === "TEXT" && (
              <div className="p-4 space-y-5 text-xs">
                {/* Standard Text Adders */}
                <div className="space-y-2">
                  <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                    Add Text to Card
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddTextElement({ text: "Heading", fontSize: 32, fontWeight: "bold" })}
                      className="p-3 bg-slate-50 hover:bg-red-50 hover:border-[#991B1B] border border-slate-200 rounded-xl text-center transition-all cursor-pointer"
                    >
                      <span className="text-base font-bold text-slate-900 block">Heading</span>
                      <span className="text-[9px] text-slate-500">32px</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddTextElement({ text: "Subheading", fontSize: 20, fontWeight: "600" })}
                      className="p-3 bg-slate-50 hover:bg-red-50 hover:border-[#991B1B] border border-slate-200 rounded-xl text-center transition-all cursor-pointer"
                    >
                      <span className="text-sm font-semibold text-slate-900 block">Subhead</span>
                      <span className="text-[9px] text-slate-500">20px</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddTextElement({ text: "Body Text", fontSize: 14 })}
                      className="p-3 bg-slate-50 hover:bg-red-50 hover:border-[#991B1B] border border-slate-200 rounded-xl text-center transition-all cursor-pointer"
                    >
                      <span className="text-xs text-slate-900 block">Body</span>
                      <span className="text-[9px] text-slate-500">14px</span>
                    </button>
                  </div>
                </div>

                {/* Pre-Curated Wedding Typography Presets */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                    Wedding Typography Presets & Slokas
                  </label>
                  {WEDDING_TEXT_PRESETS.map((cat) => (
                    <div key={cat.category} className="space-y-2">
                      <span className="text-[10px] font-extrabold text-[#991B1B] uppercase tracking-wider">
                        {cat.category}
                      </span>
                      <div className="space-y-1.5">
                        {cat.items.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => handleAddTextElement(item)}
                            className="w-full p-2.5 bg-slate-50 hover:bg-red-50 hover:border-[#991B1B] border border-slate-200 rounded-xl text-left transition-all cursor-pointer group"
                          >
                            <span className="text-[10px] font-bold text-slate-500 block mb-1 group-hover:text-[#991B1B]">
                              {item.label}
                            </span>
                            <div
                              style={{
                                fontFamily: item.fontFamily,
                                color: item.color,
                              }}
                              className="text-xs truncate"
                            >
                              {item.text.split("\n")[0]}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 3: ASSETS (UPLOAD PHOTOS, TRADITIONAL MOTIFS, BORDERS, SHAPES) ── */}
            {activeTab === "ASSETS" && (
              <div className="p-4 space-y-5 text-xs">
                {/* Photo Uploader */}
                <div className="space-y-2">
                  <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                    Upload Photos & Graphics
                  </label>
                  <label className="block p-4 border-2 border-dashed border-slate-200 hover:border-[#991B1B] rounded-2xl text-center cursor-pointer transition-colors bg-slate-50/50">
                    <Upload className="w-5 h-5 text-[#991B1B] mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">Click to Upload Couple Photo / PNG</span>
                    <span className="text-[10px] text-slate-500">Supports PNG, JPG, WebP</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {/* Geometric Shapes */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                    Shapes & Frames
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_SHAPES.map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => handleAddShapeElement(shape)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/50 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer aspect-square"
                        title={shape.name}
                      >
                        <div
                          style={{
                            backgroundColor: shape.backgroundColor,
                            borderRadius: shape.id.includes("circle") ? "50%" : shape.id.includes("rounded") ? "6px" : "2px",
                          }}
                          className={shape.id.includes("line") ? "w-8 h-1" : "w-6 h-6"}
                        />
                        <span className="text-[9px] text-slate-600 font-bold truncate max-w-full">{shape.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Traditional Motifs & Overlays */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      Wedding Motifs & Overlays ({uploadedGraphics.length})
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">Click to place</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto custom-scrollbar p-1">
                    {uploadedGraphics.map((src, idx) => (
                      <div
                        key={`${src}-${idx}`}
                        onClick={() => handleAddImageElement(src)}
                        className="group relative p-2 bg-slate-50 border border-slate-200 hover:border-[#991B1B] rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-white shadow-2xs aspect-square"
                        title="Click to place on card"
                      >
                        <img src={src} alt="Motif" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 4: LAYERS (ELEMENT STACK, REORDER, LOCK, ALIGN) ── */}
            {activeTab === "LAYERS" && (
              <div className="p-4 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                    Active Card Elements ({activeLayer.elements.length})
                  </label>
                  <span className="text-[10px] text-slate-500">Top to bottom</span>
                </div>

                {activeLayer.elements.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    No elements on this card layer yet. Add text or motifs from the tabs above.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {[...activeLayer.elements].reverse().map((el) => {
                      const isSelected = el.id === selectedElementId;
                      return (
                        <div
                          key={el.id}
                          onClick={() => setSelectedElementId(el.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-red-50/40 border-[#991B1B] ring-1 ring-[#991B1B]/20"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {el.type === "text" ? (
                              <Type className="w-3.5 h-3.5 text-[#991B1B] shrink-0" />
                            ) : el.type === "image" ? (
                              <ImageIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <span className="font-bold text-xs text-slate-800 truncate">
                              {el.type === "text" ? el.text : el.type === "image" ? "Photo / Motif" : "Shape"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateSelectedElement({ isLocked: !el.isLocked });
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700"
                              title={el.isLocked ? "Unlock" : "Lock"}
                            >
                              {el.isLocked ? <Lock className="w-3 h-3 text-amber-600" /> : <Unlock className="w-3 h-3" />}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveLayerZIndex(el.id, "up");
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700"
                              title="Bring forward"
                            >
                              <MoveUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveLayerZIndex(el.id, "down");
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700"
                              title="Send backward"
                            >
                              <MoveDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteElement(el.id);
                              }}
                              className="p-1 text-slate-400 hover:text-red-600"
                              title="Delete element"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 5: DESIGNS & TEMPLATES GALLERY ── */}
            {activeTab === "TEMPLATES" && (
              <div className="p-4 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                    Pre-Designed Templates ({dynamicTemplates.length})
                  </label>
                  <span className="text-[10px] text-slate-500">Click to apply</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {dynamicTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => {
                        if (confirm(`Load template "${tpl.name}" onto your canvas?`)) {
                          setDocTitle(tpl.name);
                          if (tpl.elements && tpl.elements.layers) {
                            setCardLayers(tpl.elements.layers);
                          } else if (Array.isArray(tpl.elements)) {
                            setCardLayers([
                              {
                                id: "layer-1",
                                name: "Main Invitation (Base)",
                                isBase: true,
                                heightPercent: 100,
                                aspectRatio: tpl.aspectRatio || "classic",
                                customWidth: 480,
                                customHeight: 672,
                                lockRatio: true,
                                backgroundColor: tpl.backgroundColor || "#F3EAD8",
                                backgroundImage: tpl.backgroundImage || null,
                                bgMode: tpl.backgroundImage ? "image" : "textures",
                                elements: tpl.elements,
                              },
                            ]);
                          }
                          setSelectedElementId(null);
                        }
                      }}
                      className="p-2 border border-slate-200 hover:border-[#991B1B] rounded-xl cursor-pointer hover:bg-red-50/30 transition-all text-left"
                    >
                      <img
                        src={tpl.previewImage || "/images/canva/template1-thumb.webp"}
                        alt={tpl.name}
                        className="w-full aspect-[4/5] object-cover rounded-lg mb-1.5"
                      />
                      <span className="font-bold text-xs text-slate-800 block truncate">{tpl.name}</span>
                      <span className="text-[10px] text-slate-500 block">₹{tpl.pricePerCard || 30}/card</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── CENTER CANVAS WORKSPACE (INTERACTIVE DRAG, RESIZE, 3D DECK VIEW) ── */}
        <main
          ref={containerRef}
          className="flex-1 min-h-0 relative flex flex-col items-center justify-center overflow-auto p-4 sm:p-6 lg:p-8 bg-slate-100/70 custom-scrollbar select-none"
          onClick={() => setSelectedElementId(null)}
        >
          {/* Zoom Wrapper */}
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              transition: "transform 0.15s ease",
            }}
            className="relative flex items-center justify-center p-8 shrink-0"
          >
            {/* 3D / Stacked Card Deck Layers Behind Active Layer */}
            {cardLayers.map((layer) => {
              if (layer.id === activeLayerId) return null;
              const lDim = getLayerDimensions(layer, baseLayer);
              return (
                <div
                  key={layer.id}
                  style={{
                    position: "absolute",
                    width: `${lDim.width}px`,
                    height: `${lDim.height}px`,
                    backgroundColor: layer.backgroundColor?.startsWith("#") ? layer.backgroundColor : "#FFFFFF",
                    backgroundImage: layer.backgroundImage ? `url(${layer.backgroundImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "16px",
                    zIndex: layer.isBase ? 1 : 2,
                    pointerEvents: "none",
                    opacity: 0.7,
                  }}
                  className="border border-slate-300"
                />
              );
            })}

            {/* 🌟 ACTIVE CANVAS CARD 🌟 */}
            <div
              ref={canvasRef}
              style={{
                width: `${activeDimensions.width}px`,
                height: `${activeDimensions.height}px`,
                backgroundColor: activeLayer.backgroundColor?.startsWith("#") ? activeLayer.backgroundColor : "#F3EAD8",
                backgroundImage: activeLayer.backgroundImage
                  ? `url(${activeLayer.backgroundImage})`
                  : activeLayer.backgroundColor?.includes("gradient")
                  ? activeLayer.backgroundColor
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                borderRadius: "16px",
                position: "relative",
                overflow: "hidden",
                zIndex: 10,
              }}
              className="transition-shadow"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedElementId(null);
              }}
            >
              {/* Elements on Active Canvas */}
              {activeLayer.elements.map((el) => {
                const isSelected = el.id === selectedElementId;
                return (
                  <div
                    key={el.id}
                    onMouseDown={(e) => handleMouseDownElement(e, el)}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      transform: `rotate(${el.rotation || 0}deg) scaleX(${el.flipH ? -1 : 1}) scaleY(${el.flipV ? -1 : 1})`,
                      opacity: el.opacity ?? 1,
                      zIndex: el.zIndex || 1,
                    }}
                    className={`cursor-move select-none group/item ${
                      isSelected ? "ring-2 ring-[#991B1B] ring-offset-1 rounded-sm" : "hover:ring-1 hover:ring-slate-400/60"
                    }`}
                  >
                    {/* Element Render: Text */}
                    {el.type === "text" && (
                      <div
                        style={{
                          fontFamily: el.fontFamily || "'Cormorant Garamond', serif",
                          fontSize: `${el.fontSize || 16}px`,
                          color: el.color || "#1E293B",
                          fontWeight: el.fontWeight || "normal",
                          fontStyle: el.fontStyle || "normal",
                          textDecoration: el.textDecoration || "none",
                          textTransform: el.textTransform || "none",
                          textAlign: el.textAlign || "center",
                          letterSpacing: `${el.letterSpacing || 0}px`,
                          lineHeight: el.lineHeight || 1.3,
                          textShadow: el.textShadow || "none",
                        }}
                        className="w-full h-full flex items-center justify-center p-0.5 whitespace-pre-wrap leading-tight"
                      >
                        {el.text}
                      </div>
                    )}

                    {/* Element Render: Image / Motif */}
                    {el.type === "image" && el.src && (
                      <img src={el.src} alt="" className="w-full h-full object-contain pointer-events-none" />
                    )}

                    {/* Element Render: Shape */}
                    {el.type === "shape" && (
                      <div
                        style={{
                          backgroundColor: el.backgroundColor || "#D4AF37",
                          width: "100%",
                          height: "100%",
                          borderRadius: el.backgroundColor?.includes("circle") ? "50%" : "4px",
                        }}
                      />
                    )}

                    {/* 8-Point Resize Handles (Only When Selected & Unlocked) */}
                    {isSelected && !el.isLocked && (
                      <>
                        <div
                          onMouseDown={(e) => handleMouseDownResize(e, "nw", el)}
                          className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#991B1B] cursor-nwse-resize z-30"
                        />
                        <div
                          onMouseDown={(e) => handleMouseDownResize(e, "ne", el)}
                          className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#991B1B] cursor-nesw-resize z-30"
                        />
                        <div
                          onMouseDown={(e) => handleMouseDownResize(e, "sw", el)}
                          className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#991B1B] cursor-nesw-resize z-30"
                        />
                        <div
                          onMouseDown={(e) => handleMouseDownResize(e, "se", el)}
                          className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#991B1B] cursor-nwse-resize z-30"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── FLOATING ZOOM & CANVAS CONTROLS (BOTTOM CENTER) ── */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3 py-1.5 shadow-xl flex items-center gap-2 z-30 text-xs font-bold text-slate-700 select-none">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(0.3, Math.round((prev - 0.1) * 10) / 10))}
              className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFitToScreen}
              className="w-12 text-center text-[11px] font-extrabold text-slate-900 font-mono hover:text-[#991B1B] cursor-pointer"
              title="Auto-Fit Screen"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(2.0, Math.round((prev + 0.1) * 10) / 10))}
              className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-px bg-slate-200 mx-0.5" />
            <button
              type="button"
              onClick={handleFitToScreen}
              className="px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-[#991B1B] text-[10px] font-extrabold flex items-center gap-1 cursor-pointer border border-red-200"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fit</span>
            </button>
          </div>
        </main>

        {/* ── RIGHT INSPECTOR PANEL (TYPOGRAPHY, COLORS, DIMENSIONS, ALIGNMENT) ── */}
        <aside
          className={`fixed inset-y-0 right-0 z-50 w-[88vw] max-w-sm bg-white shadow-2xl transition-transform duration-200 flex flex-col border-l border-slate-200 shrink-0 lg:static lg:z-10 lg:w-80 lg:translate-x-0 lg:shadow-xs ${
            mobileRightOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between shrink-0">
            <span className="font-extrabold text-[#991B1B] uppercase tracking-wider text-[11px]">
              {selectedElement
                ? selectedElement.type === "text"
                  ? "✍️ Text Inspector"
                  : "🖼️ Element Inspector"
                : "⚙️ Studio Inspector"}
            </span>
            {selectedElement && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleDuplicateElement(selectedElement.id)}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteElement(selectedElement.id)}
                  className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-[#991B1B]"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Inspector Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            {selectedElement ? (
              <>
                {/* Text Content */}
                {selectedElement.type === "text" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Edit Text Content</label>
                      <textarea
                        rows={3}
                        value={selectedElement.text || ""}
                        onChange={(e) => updateSelectedElement({ text: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#991B1B] text-xs outline-none"
                      />
                    </div>

                    {/* Font Family Selection */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Typography Font</label>
                      <select
                        value={selectedElement.fontFamily || "'Cormorant Garamond', serif"}
                        onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:border-[#991B1B] outline-none"
                      >
                        {CURATED_FONTS.map((font) => (
                          <option key={font.name} value={font.family}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Font Size & Weight */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800">Size (px)</label>
                        <input
                          type="number"
                          min={8}
                          max={120}
                          value={selectedElement.fontSize || 16}
                          onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) || 16 })}
                          className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800">Color</label>
                        <div className="flex items-center gap-1.5 p-1 border border-slate-200 rounded-xl">
                          <input
                            type="color"
                            value={selectedElement.color || "#1E293B"}
                            onChange={(e) => updateSelectedElement({ color: e.target.value })}
                            className="w-6 h-6 rounded-lg cursor-pointer border-0"
                          />
                          <span className="text-[10px] font-mono">{selectedElement.color}</span>
                        </div>
                      </div>
                    </div>

                    {/* Text Styling Buttons (Bold, Italic, Align) */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedElement({
                            fontWeight: selectedElement.fontWeight === "bold" ? "normal" : "bold",
                          })
                        }
                        className={`p-1.5 rounded-lg text-xs font-bold ${
                          selectedElement.fontWeight === "bold" ? "bg-white text-[#991B1B] shadow-2xs" : "text-slate-600"
                        }`}
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedElement({
                            fontStyle: selectedElement.fontStyle === "italic" ? "normal" : "italic",
                          })
                        }
                        className={`p-1.5 rounded-lg text-xs italic ${
                          selectedElement.fontStyle === "italic" ? "bg-white text-[#991B1B] shadow-2xs" : "text-slate-600"
                        }`}
                      >
                        I
                      </button>
                      <div className="h-3 w-px bg-slate-300 mx-1" />
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => updateSelectedElement({ textAlign: align })}
                          className={`p-1.5 rounded-lg ${
                            selectedElement.textAlign === align ? "bg-white text-[#991B1B] shadow-2xs" : "text-slate-600"
                          }`}
                        >
                          {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                          {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                          {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Opacity & Flip Controls */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">Opacity</label>
                    <span className="text-[10px] font-mono">{Math.round((selectedElement.opacity ?? 1) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={selectedElement.opacity ?? 1}
                    onChange={(e) => updateSelectedElement({ opacity: parseFloat(e.target.value) })}
                    className="w-full accent-[#991B1B]"
                  />
                </div>

                {/* Alignment Tools */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="font-bold text-slate-800 block">Align on Card</label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => handleAlignElement("left")}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                    >
                      Left
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAlignElement("center")}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                    >
                      Center
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAlignElement("right")}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                    >
                      Right
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAlignElement("top")}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                    >
                      Top
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAlignElement("middle")}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                    >
                      Middle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAlignElement("bottom")}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                    >
                      Bottom
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Settings className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs">Click on any text or motif on the card to inspect and style it.</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── 🌟 MODAL: BRAND NEW "CREATE NEW INVITATION CARD" FEATURE 🌟 ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#991B1B]" />
                  <span>Create New Invitation Card</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Customize card dimensions, multi-layer deck structure, and starting paper texture.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Card Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Invitation Card Title</label>
              <input
                type="text"
                value={createCardTitle}
                onChange={(e) => setCreateCardTitle(e.target.value)}
                placeholder="e.g. Sophia & Alexander's Royal Wedding"
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#991B1B] text-xs font-bold text-slate-900 outline-none"
              />
            </div>

            {/* Step 2: Choose Aspect Ratio / Format */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">Select Format & Dimensions</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ASPECT_RATIOS.map((ratio) => {
                  const isSel = createRatio === ratio.id;
                  return (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setCreateRatio(ratio.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSel
                          ? "bg-red-50/70 border-[#991B1B] ring-2 ring-[#991B1B]/20"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[11px] font-extrabold ${isSel ? "text-[#991B1B]" : "text-slate-900"}`}>
                          {ratio.shortName}
                        </span>
                        <div className={`rounded-xs border ${ratio.boxClass} ${isSel ? "border-[#991B1B] bg-red-100" : "border-slate-300"}`} />
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {ratio.width} × {ratio.height}px
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Card Deck Layers */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">Card Deck Structure</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { count: 1, title: "Single Layer", desc: "1 Base Card (100%)" },
                  { count: 2, title: "2-Layer Deck", desc: "Base + 85% Insert" },
                  { count: 3, title: "3-Layer Deck", desc: "Base + 85% + 70% Stack" },
                ].map((item) => {
                  const isSel = createDeckLayers === item.count;
                  return (
                    <button
                      key={item.count}
                      type="button"
                      onClick={() => setCreateDeckLayers(item.count)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSel
                          ? "bg-red-50/70 border-[#991B1B] ring-2 ring-[#991B1B]/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className={`text-xs font-extrabold block ${isSel ? "text-[#991B1B]" : "text-slate-900"}`}>
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Starting Paper Texture */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">Starting Paper Texture / Theme</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "Handmade Ivory", bgMode: "textures" as const, val: "/images/canva/backgrounds/texture-01.webp" },
                  { name: "Gold Foil Fleck", bgMode: "textures" as const, val: "/images/canva/backgrounds/texture-03.webp" },
                  { name: "Vintage Parchment", bgMode: "textures" as const, val: "/images/canva/backgrounds/texture-07.webp" },
                  { name: "Silk Cream", bgMode: "solid" as const, val: "#F3EAD8" },
                  { name: "Pure White", bgMode: "solid" as const, val: "#FFFFFF" },
                  { name: "Royal Maroon", bgMode: "solid" as const, val: "#4A0E17" },
                  { name: "Midnight Navy", bgMode: "solid" as const, val: "#0B192C" },
                  { name: "Vintage Linen", bgMode: "textures" as const, val: "/images/canva/backgrounds/texture-05.webp" },
                ].map((theme) => {
                  const isSel = createTheme.val === theme.val;
                  return (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => setCreateTheme({ bgMode: theme.bgMode, val: theme.val })}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSel
                          ? "bg-red-50/70 border-[#991B1B] ring-2 ring-[#991B1B]/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {theme.bgMode === "textures" ? (
                        <img src={theme.val} alt={theme.name} className="w-8 h-8 rounded-lg object-cover border" />
                      ) : (
                        <div style={{ backgroundColor: theme.val }} className="w-8 h-8 rounded-lg border" />
                      )}
                      <span className="text-[10px] font-bold text-slate-800 truncate max-w-full">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Starter Content Style */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Starter Template Style</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCreateStarterStyle("sloka_names")}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    createStarterStyle === "sloka_names"
                      ? "bg-red-50/70 border-[#991B1B] ring-1 ring-[#991B1B]/20"
                      : "border-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold block text-slate-900">✨ Traditional Wedding Starter</span>
                  <span className="text-[10px] text-slate-500">Includes Auspicious Sloka, couple names, and floral motifs</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCreateStarterStyle("blank")}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    createStarterStyle === "blank"
                      ? "bg-red-50/70 border-[#991B1B] ring-1 ring-[#991B1B]/20"
                      : "border-slate-200"
                  }`}
                >
                  <span className="text-xs font-bold block text-slate-900">📄 Blank Canvas</span>
                  <span className="text-[10px] text-slate-500">Start completely clean from scratch</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateNewCard}
                className="px-6 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Create Card & Open Studio →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PRICING TIERS ── */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-[#991B1B]" />
                Volume Print Pricing Tiers
              </h3>
              <button
                type="button"
                onClick={() => setShowPricingModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Pricing per printed card decreases as quantity increases. Minimum order is 50 copies.
            </p>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {CARD_PRICING_TIERS.map((tier) => {
                const calc = calculateTieredCardPrice(pricePerCard, tier.min);
                return (
                  <div key={tier.label} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{tier.label}</span>
                      <span className="text-[10px] text-slate-500">
                        {tier.max ? `${tier.min} - ${tier.max} copies` : `${tier.min}+ copies`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-[#991B1B] text-sm block">₹{calc.unitPrice}</span>
                      <span className="text-[9.5px] text-slate-500">total ₹{calc.totalPrice}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setShowPricingModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: PREVIEW CARD ── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">{docTitle}</h3>
                <span className="text-xs text-slate-500">Full Invitation Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Visual Card Display */}
            <div className="flex justify-center p-4 bg-slate-100 rounded-2xl overflow-hidden max-h-[60vh]">
              <div
                style={{
                  width: `${activeDimensions.width * 0.7}px`,
                  height: `${activeDimensions.height * 0.7}px`,
                  backgroundColor: activeLayer.backgroundColor?.startsWith("#") ? activeLayer.backgroundColor : "#F3EAD8",
                  backgroundImage: activeLayer.backgroundImage ? `url(${activeLayer.backgroundImage})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "12px",
                  position: "relative",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              >
                {activeLayer.elements.map((el) => (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      transform: `rotate(${el.rotation || 0}deg)`,
                      opacity: el.opacity ?? 1,
                    }}
                  >
                    {el.type === "text" && (
                      <div
                        style={{
                          fontFamily: el.fontFamily,
                          fontSize: `${(el.fontSize || 16) * 0.7}px`,
                          color: el.color,
                          fontWeight: el.fontWeight,
                          textAlign: el.textAlign,
                        }}
                        className="w-full h-full flex items-center justify-center leading-tight whitespace-pre-wrap"
                      >
                        {el.text}
                      </div>
                    )}
                    {el.type === "image" && el.src && (
                      <img src={el.src} alt="" className="w-full h-full object-contain" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleExport("png")}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  setShowOrderModal(true);
                }}
                className="px-5 py-2 rounded-xl bg-[#991B1B] text-white text-xs font-extrabold"
              >
                Order Prints Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ORDER PRINTS & CART ── */}
      <OrderOrCartModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        templateId={String(templateParam || "custom-canva-card")}
        templateName={docTitle}
        basePrice={pricePerCard}
        previewImage="/images/canva/template1-thumb.webp"
        cardDetails={{
          coupleNames: docTitle,
          aspectRatio: activeLayer.aspectRatio,
          backgroundColor: activeLayer.backgroundColor,
          backgroundImage: activeLayer.backgroundImage,
          layerCount: cardLayers.length,
          pages: cardLayers.map((l, i) => ({
            ...l,
            index: i + 1,
            sheetName: l.name,
          })),
        }}
        elements={activeLayer.elements}
        onCartSuccess={() => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("cartUpdated"));
          }
        }}
      />
    </div>
  );
}
