"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
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
} from "lucide-react";
import { calculateTieredCardPrice, CARD_PRICING_TIERS } from "@/lib/pricing";

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
    badge: "Popular",
  },
  {
    id: "portrait",
    name: "Mobile (9:16)",
    shortName: "Story",
    subtitle: "WhatsApp & Instagram",
    width: 430,
    height: 764,
    ratioStr: "9:16",
    boxClass: "w-3 h-5.5",
    badge: "Mobile",
  },
  {
    id: "square",
    name: "Square (1:1)",
    shortName: "Square",
    subtitle: "Instagram Post & Box",
    width: 500,
    height: 500,
    ratioStr: "1:1",
    boxClass: "w-4.5 h-4.5",
    badge: "Feed",
  },
  {
    id: "landscape",
    name: "Landscape (7:5)",
    shortName: "Landscape",
    subtitle: "Wide Folded Envelope",
    width: 672,
    height: 480,
    ratioStr: "7:5",
    boxClass: "w-5.5 h-4",
    badge: "Wide",
  },
  {
    id: "cinematic",
    name: "Cinematic (16:9)",
    shortName: "Cinematic",
    subtitle: "Digital Display & TV",
    width: 680,
    height: 382,
    ratioStr: "16:9",
    boxClass: "w-6 h-3.5",
    badge: "Screen",
  },
  {
    id: "bookmark",
    name: "Bookmark (1:2)",
    shortName: "Bookmark",
    subtitle: "Gatefold & Menu Card",
    width: 360,
    height: 720,
    ratioStr: "1:2",
    boxClass: "w-2.5 h-5.5",
    badge: "Slim",
  },
  {
    id: "a4",
    name: "Poster (A4)",
    shortName: "A4 Print",
    subtitle: "Wall Frame & Document",
    width: 460,
    height: 650,
    ratioStr: "1:1.41",
    boxClass: "w-4 h-5.5",
    badge: "Print",
  },
  {
    id: "custom",
    name: "Free Size / Custom",
    shortName: "Free Size",
    subtitle: "Custom Dimensions",
    width: 480,
    height: 600,
    ratioStr: "Free",
    boxClass: "w-4 h-5 border-dashed",
    badge: "Custom",
  },
];

export function getLayerDimensions(
  layer: CardDeckLayer,
  baseLayer: CardDeckLayer
): { width: number; height: number; ratioStr: string } {
  const layerRatioObj = ASPECT_RATIOS.find((r) => r.id === layer.aspectRatio);

  let rawBaseW = 480;
  let rawBaseH = 672;
  if (baseLayer) {
    const baseRatioObj = ASPECT_RATIOS.find((r) => r.id === baseLayer.aspectRatio);
    if (baseLayer.aspectRatio === "custom") {
      rawBaseW = baseLayer.customWidth || 480;
      rawBaseH = baseLayer.customHeight || 672;
    } else if (baseRatioObj) {
      rawBaseW = baseRatioObj.width;
      rawBaseH = baseRatioObj.height;
    }
  }

  if (layer.isBase) {
    if (layer.aspectRatio === "custom") {
      const customW = layer.customWidth || 480;
      const customH = layer.customHeight || 672;
      return {
        width: customW,
        height: customH,
        ratioStr: `${customW}:${customH}`,
      };
    }
    return {
      width: layerRatioObj ? layerRatioObj.width : 480,
      height: layerRatioObj ? layerRatioObj.height : 672,
      ratioStr: layerRatioObj ? layerRatioObj.ratioStr : "5:7",
    };
  }

  // Calculate target height from percentage of base height
  const pct = (layer.heightPercent || 85) / 100;
  const targetH = Math.max(120, Math.round(rawBaseH * pct));

  // If custom / free size without lock
  if (layer.aspectRatio === "custom" && !layer.lockRatio) {
    const customW = layer.customWidth || Math.round(rawBaseW * pct);
    const customH = layer.customHeight || targetH;
    return {
      width: customW,
      height: customH,
      ratioStr: "Free",
    };
  }

  // Proportional aspect ratio calculations
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

export const LUXURY_GRADIENTS = [
  {
    name: "Royal Champagne",
    value: "linear-gradient(135deg, #FBF8EE 0%, #F3EAD8 50%, #E8D8BA 100%)",
  },
  {
    name: "Velvet Crimson",
    value: "linear-gradient(135deg, #881337 0%, #7F1D1D 50%, #450A0A 100%)",
  },
  {
    name: "Silk Rose",
    value: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FECDD3 100%)",
  },
  {
    name: "Sunset Shimmer",
    value: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #D97706 100%)",
  },
  {
    name: "Royal Emerald",
    value: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #022C22 100%)",
  },
  {
    name: "Sapphire Navy",
    value: "linear-gradient(135deg, #1E3A8A 0%, #172554 50%, #020617 100%)",
  },
  {
    name: "Vintage Parchment",
    value: "linear-gradient(135deg, #FBF6E9 0%, #EFE1C6 50%, #E2CFAC 100%)",
  },
  {
    name: "Pearl Ivory",
    value: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #E2E8F0 100%)",
  },
  {
    name: "Obsidian Gold",
    value: "linear-gradient(135deg, #27272A 0%, #18181B 50%, #09090B 100%)",
  },
  {
    name: "Lavender Dusk",
    value: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #E9D5FF 100%)",
  },
  {
    name: "Sage Mist",
    value: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)",
  },
  {
    name: "Radial Aura",
    value: "radial-gradient(circle at center, #FFFBEB 0%, #FEF3C7 60%, #FDE68A 100%)",
  },
];

export const DEFAULT_TEXTURES = Array.from({ length: 22 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  return {
    id: `texture-${num}`,
    name: `Texture ${num}`,
    num,
    src: `/images/canva/backgrounds/texture-${num}.webp`,
  };
});

export const TEXT_GRADIENTS = [
  { name: "Pure Gold Foil", value: "linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #AA771C 100%)" },
  { name: "Rose Gold Shimmer", value: "linear-gradient(135deg, #B76E79 0%, #FAD0C4 50%, #E28C9C 100%)" },
  { name: "Royal Maroon Glow", value: "linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #7F1D1D 100%)" },
  { name: "Silver Chrome", value: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 50%, #94A3B8 100%)" },
  { name: "Bronze Heritage", value: "linear-gradient(135deg, #8C6B1B 0%, #CD7F32 50%, #5C4310 100%)" },
];

const FONT_CATEGORIES = [
  {
    category: "Royal Calligraphy & Script",
    fonts: [
      { name: "Great Vibes (Classic Wedding Script)", family: "'Great Vibes', cursive" },
      { name: "Alex Brush (Flowing Calligraphy)", family: "'Alex Brush', cursive" },
      { name: "Parisienne (French Romance Script)", family: "'Parisienne', cursive" },
      { name: "Pinyon Script (Royal Copperplate)", family: "'Pinyon Script', cursive" },
      { name: "Sacramento (Fine Monoline Cursive)", family: "'Sacramento', cursive" },
      { name: "Dancing Script (Bouncy Elegant Script)", family: "'Dancing Script', cursive" },
      { name: "Satisfy (Vintage Brush Script)", family: "'Satisfy', cursive" },
      { name: "Caveat (Handwritten Cursive)", family: "'Caveat', cursive" },
      { name: "Pacifico (Casual Retro Script)", family: "'Pacifico', cursive" },
    ],
  },
  {
    category: "Luxury Editorial Serifs",
    fonts: [
      { name: "Cormorant Garamond (Warm Serif)", family: "'Cormorant Garamond', serif" },
      { name: "Playfair Display (Editorial High-Fashion)", family: "'Playfair Display', serif" },
      { name: "Bodoni Moda (Vogue Luxury Serif)", family: "'Bodoni Moda', serif" },
      { name: "Prata (Didone Editorial Serif)", family: "'Prata', serif" },
      { name: "Abril Fatface (Vintage Poster Serif)", family: "'Abril Fatface', serif" },
      { name: "Marcellus (Heritage Roman Serif)", family: "'Marcellus', serif" },
      { name: "Rozha One (Traditional Indian Serif)", family: "'Rozha One', serif" },
    ],
  },
  {
    category: "Imperial Roman & Display Caps",
    fonts: [
      { name: "Cinzel (Imperial Roman Caps)", family: "'Cinzel', serif" },
      { name: "Cinzel Decorative (Flourished Gold Caps)", family: "'Cinzel Decorative', serif" },
      { name: "Poiret One (Art Deco Geometric)", family: "'Poiret One', cursive" },
    ],
  },
  {
    category: "Clean Modern Sans-Serif",
    fonts: [
      { name: "Montserrat (Clean Geometric Sans)", family: "'Montserrat', sans-serif" },
      { name: "Outfit (Modern Minimalist Sans)", family: "'Outfit', sans-serif" },
      { name: "Inter (Crisp Contemporary Sans)", family: "'Inter', sans-serif" },
      { name: "Special Elite (Vintage Typewriter)", family: "'Special Elite', cursive" },
    ],
  },
];

const PRESET_FIELDS = [
  {
    label: "🤵 Groom Name",
    fieldKey: "groomName",
    defaultText: "Alexander",
    fontFamily: "'Great Vibes', cursive",
    fontSize: 48,
    color: "#1E293B",
    fontWeight: "400",
  },
  {
    label: "💍 Connector ('&' / 'WEDS')",
    fieldKey: "connector",
    defaultText: "&",
    fontFamily: "'Playfair Display', serif",
    fontSize: 26,
    color: "#8C6B1B",
    fontWeight: "600",
    fontStyle: "italic",
  },
  {
    label: "👰 Bride Name",
    fieldKey: "brideName",
    defaultText: "Sophia",
    fontFamily: "'Great Vibes', cursive",
    fontSize: 48,
    color: "#1E293B",
    fontWeight: "400",
  },
  {
    label: "👑 Couple / Combined Names",
    fieldKey: "coupleNames",
    defaultText: "Sophia & Alexander",
    fontFamily: "'Great Vibes', cursive",
    fontSize: 44,
    color: "#4A3B2A",
    fontWeight: "400",
  },
  {
    label: "📜 Tagline / Intro",
    fieldKey: "tagline",
    defaultText: "TOGETHER WITH THEIR FAMILIES",
    fontFamily: "'Cinzel', serif",
    fontSize: 12,
    color: "#5C4E3A",
    fontWeight: "700",
    letterSpacing: 3,
  },
  {
    label: "💌 Invitation Line",
    fieldKey: "inviteLine",
    defaultText: "Request the pleasure of your company at the celebration of their wedding",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 14,
    color: "#5C4E3A",
    fontWeight: "500",
  },
  {
    label: "📅 Wedding Date",
    fieldKey: "date",
    defaultText: "OCTOBER 30, 2026",
    fontFamily: "'Cinzel', serif",
    fontSize: 18,
    color: "#8C6B1B",
    fontWeight: "700",
    letterSpacing: 2,
  },
  {
    label: "⏰ Event Time",
    fieldKey: "time",
    defaultText: "AT 4:00 IN THE AFTERNOON",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 11,
    color: "#5C4E3A",
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  {
    label: "🏛️ Venue Name",
    fieldKey: "venue",
    defaultText: "ELAMBA MUDAKKAL PALACE",
    fontFamily: "'Cinzel', serif",
    fontSize: 13,
    color: "#5C4E3A",
    fontWeight: "700",
    letterSpacing: 1,
  },
  {
    label: "📍 Address & City",
    fieldKey: "address",
    defaultText: "MG Road, Trivandrum, Kerala",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 10,
    color: "#5C4E3A",
    fontWeight: "600",
  },
  {
    label: "📱 RSVP Contact",
    fieldKey: "rsvp",
    defaultText: "R.S.V.P +91 98765 43210",
    fontFamily: "'Alex Brush', cursive",
    fontSize: 16,
    color: "#8C6B1B",
  },
  {
    label: "👪 Parents / Family Line",
    fieldKey: "parentsLine",
    defaultText: "D/o Mr. & Mrs. Anderson",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 12,
    color: "#64748B",
    fontStyle: "italic",
  },
];

const LUXURY_PALETTE = [
  { name: "Gold", color: "#8C6B1B" },
  { name: "Bright Gold", color: "#D4AF37" },
  { name: "Royal Maroon", color: "#991B1B" },
  { name: "Deep Charcoal", color: "#1E293B" },
  { name: "Pure Black", color: "#0F172A" },
  { name: "Rose Gold", color: "#B76E79" },
  { name: "Forest Sage", color: "#2D4A3E" },
  { name: "Royal Navy", color: "#1E3A8A" },
  { name: "Pearl Cream", color: "#F5EBE0" },
  { name: "Pure White", color: "#FFFFFF" },
];

function CanvaTemplateBuilderInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");

  // Template Metadata
  const [templateName, setTemplateName] = useState("New Luxury Card Template");
  const [topic, setTopic] = useState<"vintage" | "modern">("vintage");
  const [category, setCategory] = useState("Vintage Floral");
  const [pricePerCard, setPricePerCard] = useState<number>(30);
  const [minCopies, setMinCopies] = useState<number>(50);
  const [paperType, setPaperType] = useState<string>("350 GSM Textured Metallic Gold Cardstock");
  const [badge, setBadge] = useState<string>("");
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

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
      backgroundImage: null,
      bgMode: "textures",
      elements: [],
    },
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>("layer-1");
  const [renamingLayerId, setRenamingLayerId] = useState<string | null>(null);
  const [renamingLayerName, setRenamingLayerName] = useState<string>("");

  // Mobile Drawer & Layer State
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);
  const [showMobileLayers, setShowMobileLayers] = useState(false);

  // Computed Active Layer and Base Anchor Layer
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

  // Layer State Updaters
  const updateActiveLayer = (updates: Partial<CardDeckLayer>) => {
    setCardLayers((prev) =>
      prev.map((l) => (l.id === activeLayer.id ? { ...l, ...updates } : l))
    );
  };

  const setElements = (updater: CanvasElement[] | ((prev: CanvasElement[]) => CanvasElement[])) => {
    setCardLayers((prev) =>
      prev.map((l) => {
        if (l.id !== activeLayer.id) return l;
        const newElements = typeof updater === "function" ? updater(l.elements) : updater;
        return { ...l, elements: newElements };
      })
    );
  };

  const setBackgroundColor = (val: string) => {
    updateActiveLayer({ backgroundColor: val });
  };

  const setBackgroundImage = (val: string | null) => {
    updateActiveLayer({ backgroundImage: val });
  };

  const setBgMode = (val: "solid" | "gradient" | "image" | "textures") => {
    updateActiveLayer({ bgMode: val });
  };

  // Content Auto-Scaling Mode State
  const [scaleContentWithSize, setScaleContentWithSize] = useState<boolean>(true);

  // Helper to scale text font sizes and element dimensions proportionally with card size changes
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
    const scaleFactorH = newH / oldH;
    const scaleFactorW = newW / oldW;
    const fontScaleFactor = Math.sqrt(scaleFactorW * scaleFactorH);

    if (Math.abs(fontScaleFactor - 1) < 0.005) {
      return currentElements;
    }

    return currentElements.map((el) => {
      if (el.type === "text") {
        const newFontSize = Math.max(8, Math.min(240, Math.round((el.fontSize || 16) * fontScaleFactor)));
        return {
          ...el,
          fontSize: newFontSize,
          letterSpacing: el.letterSpacing ? Math.max(0, Math.round(el.letterSpacing * fontScaleFactor)) : undefined,
        };
      }
      return el;
    });
  };

  const setAspectRatio = (val: string) => {
    const ratioObj = ASPECT_RATIOS.find((r) => r.id === val);
    const oldW = activeDimensions.width;
    const oldH = activeDimensions.height;

    if (val === "custom") {
      updateActiveLayer({
        aspectRatio: "custom",
        customWidth: activeDimensions.width,
        customHeight: activeDimensions.height,
      });
    } else if (ratioObj) {
      let targetW = ratioObj.width;
      let targetH = ratioObj.height;

      if (!activeLayer.isBase) {
        const baseDim = getLayerDimensions(baseLayer, baseLayer);
        targetH = Math.round(baseDim.height * ((activeLayer.heightPercent || 85) / 100));
        targetW = Math.round(targetH * (ratioObj.width / ratioObj.height));
      }

      const scaledElements = getScaledElementsForDimensions(activeLayer.elements, oldW, oldH, targetW, targetH);

      updateActiveLayer({
        aspectRatio: val,
        customWidth: targetW,
        customHeight: targetH,
        elements: scaledElements,
      });
    }
  };

  // Aliases for compatibility
  const elements = activeLayer.elements;
  const backgroundColor = activeLayer.backgroundColor;
  const backgroundImage = activeLayer.backgroundImage;
  const bgMode = activeLayer.bgMode;
  const aspectRatio = activeLayer.aspectRatio;

  // Zoom & Full View Fit State
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(0.78);

  // Background Customizer Mode
  const [customGradStart, setCustomGradStart] = useState("#FBF8EE");
  const [customGradEnd, setCustomGradEnd] = useState("#E8D8BA");
  const [customGradAngle, setCustomGradAngle] = useState(135);

  // Accordion Expand/Collapse State
  const [accordionOpen, setAccordionOpen] = useState({
    ratio: true,
    background: true,
    pricing: true,
    thumbnail: true,
    metadata: true,
  });

  const toggleAccordion = (key: "ratio" | "background" | "pricing" | "thumbnail" | "metadata") => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Selected Canvas Element
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Asset Library (Uploaded PNGs) - Dynamically loaded from Cloudinary & Database
  const [uploadedGraphics, setUploadedGraphics] = useState<string[]>([
    "/images/canva/leaf-divider.webp",
    "/images/canva/floral-footer.webp",
    "/images/canva/vintage-swirl-header.webp",
    "/images/canva/vintage-wave-divider.webp",
    "/images/canva/vintage-swirl-footer.webp",
  ]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  // Fetch all uploaded PNG overlays across Cloudinary & all saved Canva templates
  const fetchCanvaAssets = useCallback(async () => {
    try {
      setIsLoadingAssets(true);
      const res = await fetch("/api/admin/canva-assets");
      const data = await res.json();
      if (data.assets && Array.isArray(data.assets) && data.assets.length > 0) {
        setUploadedGraphics(data.assets);
      }
    } catch (err) {
      console.warn("Failed to fetch Canva assets:", err);
    } finally {
      setIsLoadingAssets(false);
    }
  }, []);

  useEffect(() => {
    fetchCanvaAssets();
  }, [fetchCanvaAssets]);

  // Dynamic Background Textures Library (Auto-scans all optimized textures)
  const [texturesList, setTexturesList] = useState<Array<{ id: string; name: string; num: string; src: string }>>(DEFAULT_TEXTURES);
  const [isLoadingTextures, setIsLoadingTextures] = useState(false);

  const fetchTextures = useCallback(async () => {
    try {
      setIsLoadingTextures(true);
      const res = await fetch("/api/admin/canva-textures");
      const data = await res.json();
      if (data.textures && Array.isArray(data.textures) && data.textures.length > 0) {
        setTexturesList(data.textures);
      }
    } catch (err) {
      console.warn("Failed to fetch textures:", err);
    } finally {
      setIsLoadingTextures(false);
    }
  }, []);

  useEffect(() => {
    fetchTextures();
  }, [fetchTextures]);

  // Live Height vs Base Card Comparison Visualizer State (shows comparison guide only while adjusting)
  const [isAdjustingHeight, setIsAdjustingHeight] = useState(false);
  const heightAdjustTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerHeightAdjusting = () => {
    setIsAdjustingHeight(true);
    if (heightAdjustTimerRef.current) {
      clearTimeout(heightAdjustTimerRef.current);
    }
    heightAdjustTimerRef.current = setTimeout(() => {
      setIsAdjustingHeight(false);
    }, 2000);
  };

  // UI state
  const [activeTab, setActiveTab] = useState<"SETTINGS" | "TEXT" | "ASSETS" | "LAYERS">("SETTINGS");
  const [testMode, setTestMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [isDraggingOverPNGTab, setIsDraggingOverPNGTab] = useState(false);
  const [statusToast, setStatusToast] = useState("");
  const [loadingInitial, setLoadingInitial] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; elX: number; elY: number } | null>(null);

  // Resizing State
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{
    mouseX: number;
    mouseY: number;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Fit to screen helper (calculates exact scale to fit 100% without scroll)
  const handleFitToScreen = () => {
    if (!containerRef.current) return;
    const containerH = containerRef.current.clientHeight - 130; // leaves margin for top deck bar and bottom zoom bar
    const containerW = containerRef.current.clientWidth - 70;
    const scaleH = containerH / activeDimensions.height;
    const scaleW = containerW / activeDimensions.width;
    const fitScale = Math.min(scaleH, scaleW, 1.0);
    setZoom(Math.max(0.35, Math.round(fitScale * 100) / 100));
  };

  // Auto-fit on mount, active layer changes & dimension changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFitToScreen();
    }, 120);
    return () => clearTimeout(timer);
  }, [activeLayerId, activeLayer.aspectRatio, activeLayer.heightPercent]);

  // Load existing template if editing
  useEffect(() => {
    if (!templateId) return;

    async function loadTemplate() {
      try {
        setLoadingInitial(true);
        const res = await fetch(`/api/admin/canva-templates/${templateId}`);
        const data = await res.json();
        if (data.template) {
          const t = data.template;
          setTemplateName(t.name);
          setTopic(t.topic || "vintage");
          setCategory(t.category || "Vintage Floral");
          setPricePerCard(t.pricePerCard !== undefined && t.pricePerCard !== null ? Number(t.pricePerCard) : 30);
          setMinCopies(t.minCopies !== undefined && t.minCopies !== null ? Number(t.minCopies) : 50);
          setPaperType(t.paperType || "350 GSM Textured Metallic Gold Cardstock");
          setBadge(t.badge || "");
          setPreviewImage(t.previewImage || null);
          setIsActive(t.isActive !== false);
          setSortOrder(t.sortOrder || 0);

          // Check if template elements data contains multi-deck structure
          if (t.elements && typeof t.elements === "object" && !Array.isArray(t.elements) && t.elements.layers) {
            const mappedLayers = (t.elements.layers as CardDeckLayer[]).map((l) => ({
              ...l,
              bgMode: l.bgMode || (l.backgroundImage ? "image" : l.backgroundColor?.includes("gradient") ? "gradient" : "textures"),
            }));
            setCardLayers(mappedLayers);
            setActiveLayerId(t.elements.activeLayerId || t.elements.layers[0]?.id || "layer-1");
          } else {
            // Single layer legacy template -> wrap into Base Layer 1
            const initialLayer: CardDeckLayer = {
              id: "layer-1",
              name: "Main Invitation (Base)",
              isBase: true,
              heightPercent: 100,
              aspectRatio: t.aspectRatio || "classic",
              customWidth: 480,
              customHeight: 672,
              lockRatio: true,
              backgroundColor: t.backgroundColor || "#F3EAD8",
              backgroundImage: t.backgroundImage || null,
              bgMode: t.backgroundImage?.includes("backgrounds/bg-")
                ? "textures"
                : t.backgroundImage
                ? "image"
                : t.backgroundColor && t.backgroundColor.includes("gradient")
                ? "gradient"
                : "textures",
              elements: Array.isArray(t.elements) ? t.elements : [],
            };
            setCardLayers([initialLayer]);
            setActiveLayerId("layer-1");
          }
        }
      } catch (err) {
        console.error("Failed to load template:", err);
      } finally {
        setLoadingInitial(false);
      }
    }

    loadTemplate();
  }, [templateId]);

  // Multi-Deck Layer Management Handlers
  const handleAddLayer = () => {
    const nextIdx = cardLayers.length + 1;
    const newId = `layer-${Date.now()}`;
    const defaultPct = nextIdx === 2 ? 85 : nextIdx === 3 ? 72 : 60;
    const baseDim = getLayerDimensions(baseLayer, baseLayer);
    const newLayer: CardDeckLayer = {
      id: newId,
      name: `Insert Sheet ${nextIdx}`,
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
    setCardLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(newId);
    setSelectedElementId(null);
    setStatusToast(`✨ Added new card sheet: "${newLayer.name}"`);
    setTimeout(() => setStatusToast(""), 3500);
  };

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
    setCardLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(newId);
    setSelectedElementId(null);
    setStatusToast(`📋 Duplicated "${target.name}"`);
    setTimeout(() => setStatusToast(""), 3500);
  };

  const handleDeleteLayer = (layerId: string) => {
    if (cardLayers.length <= 1) {
      alert("A template must have at least one card sheet layer.");
      return;
    }
    const target = cardLayers.find((l) => l.id === layerId);
    if (!confirm(`Are you sure you want to delete card layer "${target?.name}"?`)) return;

    setCardLayers((prev) => {
      const filtered = prev.filter((l) => l.id !== layerId);
      if (!filtered.some((l) => l.isBase) && filtered.length > 0) {
        filtered[0].isBase = true;
        filtered[0].heightPercent = 100;
      }
      return filtered;
    });

    if (activeLayerId === layerId) {
      const remaining = cardLayers.filter((l) => l.id !== layerId);
      if (remaining.length > 0) {
        setActiveLayerId(remaining[0].id);
      }
    }
    setSelectedElementId(null);
    setStatusToast("🗑️ Card layer removed");
    setTimeout(() => setStatusToast(""), 3000);
  };

  const handleSetAsBaseLayer = (layerId: string) => {
    setCardLayers((prev) =>
      prev.map((l) => {
        if (l.id === layerId) {
          return { ...l, isBase: true, heightPercent: 100 };
        }
        return { ...l, isBase: false };
      })
    );
    setStatusToast("⭐ Set as Fixed Base Reference Card");
    setTimeout(() => setStatusToast(""), 3000);
  };

  const handleHeightPercentChange = (pct: number) => {
    triggerHeightAdjusting();
    const clamped = Math.min(300, Math.max(10, pct));
    const baseH = getLayerDimensions(baseLayer, baseLayer).height;
    const targetH = Math.round(baseH * (clamped / 100));

    const ratioObj = ASPECT_RATIOS.find((r) => r.id === activeLayer.aspectRatio);
    let ratioFraction = 5 / 7;
    if (ratioObj && ratioObj.id !== "custom") {
      ratioFraction = ratioObj.width / ratioObj.height;
    } else if (activeDimensions.width && activeDimensions.height) {
      ratioFraction = activeDimensions.width / activeDimensions.height;
    }

    const targetW = Math.round(targetH * ratioFraction);
    const oldW = activeDimensions.width;
    const oldH = activeDimensions.height;
    const scaledElements = getScaledElementsForDimensions(activeLayer.elements, oldW, oldH, targetW, targetH);

    updateActiveLayer({
      heightPercent: clamped,
      customHeight: targetH,
      customWidth: targetW,
      elements: scaledElements,
    });
  };

  const handleDimensionChange = (dimension: "width" | "height", valueStr: string) => {
    triggerHeightAdjusting();
    const val = parseInt(valueStr, 10);
    if (isNaN(val) || val <= 0) return;

    const ratioObj = ASPECT_RATIOS.find((r) => r.id === activeLayer.aspectRatio);
    let ratioFraction = 5 / 7;
    if (ratioObj && ratioObj.id !== "custom") {
      ratioFraction = ratioObj.width / ratioObj.height;
    } else if (activeDimensions.width && activeDimensions.height) {
      ratioFraction = activeDimensions.width / activeDimensions.height;
    }

    const oldW = activeDimensions.width;
    const oldH = activeDimensions.height;

    if (dimension === "height") {
      if (activeLayer.isBase) {
        if (activeLayer.lockRatio) {
          const autoWidth = Math.round(val * ratioFraction);
          const scaledElements = getScaledElementsForDimensions(activeLayer.elements, oldW, oldH, autoWidth, val);
          updateActiveLayer({
            aspectRatio: activeLayer.aspectRatio === "custom" ? "custom" : activeLayer.aspectRatio,
            customHeight: val,
            customWidth: autoWidth,
            elements: scaledElements,
          });
        } else {
          const scaledElements = getScaledElementsForDimensions(activeLayer.elements, oldW, oldH, activeDimensions.width, val);
          updateActiveLayer({
            aspectRatio: "custom",
            customHeight: val,
            customWidth: activeDimensions.width,
            elements: scaledElements,
          });
        }
      } else {
        const baseH = getLayerDimensions(baseLayer, baseLayer).height;
        const newPct = Math.min(300, Math.max(10, Math.round((val / baseH) * 100)));
        if (activeLayer.lockRatio) {
          const autoWidth = Math.round(val * ratioFraction);
          const scaledElements = getScaledElementsForDimensions(activeLayer.elements, oldW, oldH, autoWidth, val);
          updateActiveLayer({
            heightPercent: newPct,
            customHeight: val,
            customWidth: autoWidth,
            elements: scaledElements,
          });
        } else {
          const scaledElements = getScaledElementsForDimensions(activeLayer.elements, oldW, oldH, activeDimensions.width, val);
          updateActiveLayer({
            aspectRatio: "custom",
            heightPercent: newPct,
            customHeight: val,
            customWidth: activeDimensions.width,
            elements: scaledElements,
          });
        }
      }
    } else {
      // Width changed
      if (activeLayer.lockRatio) {
        const autoHeight = Math.round(val / ratioFraction);
        if (activeLayer.isBase) {
          const scaledElements = getScaledElementsForDimensions(activeLayer.elements, oldW, oldH, val, autoHeight);
          updateActiveLayer({
            customWidth: val,
            customHeight: autoHeight,
            elements: scaledElements,
          });
        } else {
          const baseH = getLayerDimensions(baseLayer, baseLayer).height;
          const newPct = Math.min(300, Math.max(10, Math.round((autoHeight / baseH) * 100)));
          const scaledElements = getScaledElementsForDimensions(activeLayer.elements, oldW, oldH, val, autoHeight);
          updateActiveLayer({
            customWidth: val,
            customHeight: autoHeight,
            heightPercent: newPct,
            elements: scaledElements,
          });
        }
      } else {
        const scaledElements = getScaledElementsForDimensions(activeLayer.elements, oldW, oldH, val, activeDimensions.height);
        updateActiveLayer({
          aspectRatio: "custom",
          customWidth: val,
          customHeight: activeDimensions.height,
          elements: scaledElements,
        });
      }
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Upload Single File (for Background or Preview)
  const handleUploadFile = async (file: File, type: "background" | "preview") => {
    try {
      setIsUploading(true);
      const optimizedFile = await optimizeImageForUpload(file, {
        maxDimension: type === "preview" ? 1080 : 2560,
        quality: 0.92,
      });

      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("target", "canva");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (type === "background") {
        setBackgroundImage(data.url);
        setBgMode("image");
        setStatusToast("Card Background updated!");
      } else if (type === "preview") {
        setPreviewImage(data.url);
        setStatusToast("Preview thumbnail updated!");
      }
      setTimeout(() => setStatusToast(""), 3500);
    } catch (err: any) {
      alert(err?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Upload Multiple PNG Overlays in Batch
  const handleUploadMultiplePNGs = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress({ current: 0, total: fileArray.length });

      const uploadedUrls: string[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setUploadProgress({ current: i + 1, total: fileArray.length });

        const optimizedFile = await optimizeImageForUpload(file, {
          maxDimension: 2560,
          quality: 0.92,
        });

        const formData = new FormData();
        formData.append("file", optimizedFile);
        formData.append("target", "canva-overlays");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setUploadedGraphics((prev) => [...uploadedUrls, ...prev]);

        // Place first one on canvas as a starter
        handleAddImageElement(uploadedUrls[0]);

        setStatusToast(
          uploadedUrls.length === 1
            ? "✨ PNG Overlay uploaded and added to canvas!"
            : `🎉 ${uploadedUrls.length} PNGs uploaded and added to library!`
        );
        setTimeout(() => setStatusToast(""), 4000);
      }
    } catch (err: any) {
      alert(err?.message || "Failed to upload PNG files");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Add Image / Overlay Element
  const handleAddImageElement = (src: string) => {
    const newEl: CanvasElement = {
      id: `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: "image",
      src,
      x: 35,
      y: 35,
      width: 30,
      height: 30,
      rotation: 0,
      opacity: 1,
      zIndex: elements.length + 1,
      isLocked: false,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Add Text Element
  const handleAddTextElement = (preset?: (typeof PRESET_FIELDS)[0]) => {
    const newEl: CanvasElement = {
      id: `txt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: "text",
      fieldKey: preset?.fieldKey || "customText",
      text: preset?.defaultText || "Custom Luxury Text",
      fontFamily: preset?.fontFamily || "'Cinzel', serif",
      fontSize: preset?.fontSize || 18,
      color: preset?.color || "#1E293B",
      fontWeight: preset?.fontWeight || "600",
      fontStyle: preset?.fontStyle || "normal",
      textAlign: "center",
      letterSpacing: preset?.letterSpacing || 1,
      lineHeight: 1.2,
      x: 10,
      y: Math.min(80, 20 + elements.length * 8),
      width: 80,
      height: 8,
      rotation: 0,
      opacity: 1,
      zIndex: elements.length + 1,
      isLocked: false,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Update selected element property
  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElementId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedElementId ? { ...el, ...updates } : el))
    );
  };

  // Update element by specific ID
  const updateElementById = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // Delete element
  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  // Duplicate element
  const handleDuplicateElement = (id: string) => {
    const target = elements.find((el) => el.id === id);
    if (!target) return;
    const duplicated: CanvasElement = {
      ...target,
      id: `copy-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      x: Math.min(90, target.x + 4),
      y: Math.min(90, target.y + 4),
      zIndex: elements.length + 1,
      isLocked: false,
    };
    setElements((prev) => [...prev, duplicated]);
    setSelectedElementId(duplicated.id);
  };

  // Z-Index ordering
  const handleMoveLayer = (id: string, direction: "up" | "down") => {
    setElements((prev) => {
      const idx = prev.findIndex((el) => el.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx + 1 : idx - 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;

      const updated = [...prev];
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;

      return updated.map((el, i) => ({ ...el, zIndex: i + 1 }));
    });
  };

  // Dragging element on canvas (Mouse & Touch)
  const handleMouseDownElement = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation();
    if (el.isLocked) return;
    setSelectedElementId(el.id);

    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elX: el.x,
      elY: el.y,
    });
  };

  const handleTouchStartElement = (e: React.TouchEvent, el: CanvasElement) => {
    e.stopPropagation();
    if (el.isLocked || e.touches.length === 0) return;
    setSelectedElementId(el.id);

    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX,
      y: touch.clientY,
      elX: el.x,
      elY: el.y,
    });
  };

  // Resizing element on canvas (Mouse & Touch)
  const handleMouseDownResize = (e: React.MouseEvent, handle: string, el: CanvasElement) => {
    e.stopPropagation();
    if (el.isLocked) return;
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height || 20,
    });
  };

  const handleTouchStartResize = (e: React.TouchEvent, handle: string, el: CanvasElement) => {
    e.stopPropagation();
    if (el.isLocked || e.touches.length === 0) return;

    const touch = e.touches[0];
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height || 20,
    });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!canvasRef.current || !selectedElementId || !selectedElement) return;
    if (selectedElement.isLocked) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Handle Resizing
    if (isResizing && resizeStart && resizeHandle) {
      const deltaX = ((e.clientX - resizeStart.mouseX) / canvasRect.width) * 100;
      const deltaY = ((e.clientY - resizeStart.mouseY) / canvasRect.height) * 100;

      if (resizeHandle === "se") {
        const newW = Math.max(5, Math.min(150, resizeStart.width + deltaX));
        const newH = Math.max(5, Math.min(150, resizeStart.height + deltaY));
        updateSelectedElement({
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
        });
      } else if (resizeHandle === "sw") {
        const newW = Math.max(5, Math.min(150, resizeStart.width - deltaX));
        const newX = resizeStart.x + (resizeStart.width - newW);
        const newH = Math.max(5, Math.min(150, resizeStart.height + deltaY));
        updateSelectedElement({
          x: Math.round(newX * 10) / 10,
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
        });
      } else if (resizeHandle === "ne") {
        const newW = Math.max(5, Math.min(150, resizeStart.width + deltaX));
        const newH = Math.max(5, Math.min(150, resizeStart.height - deltaY));
        const newY = resizeStart.y + (resizeStart.height - newH);
        updateSelectedElement({
          y: Math.round(newY * 10) / 10,
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
        });
      } else if (resizeHandle === "nw") {
        const newW = Math.max(5, Math.min(150, resizeStart.width - deltaX));
        const newH = Math.max(5, Math.min(150, resizeStart.height - deltaY));
        const newX = resizeStart.x + (resizeStart.width - newW);
        const newY = resizeStart.y + (resizeStart.height - newH);
        updateSelectedElement({
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
        });
      } else if (resizeHandle === "e") {
        const newW = Math.max(5, Math.min(150, resizeStart.width + deltaX));
        updateSelectedElement({ width: Math.round(newW * 10) / 10 });
      } else if (resizeHandle === "w") {
        const newW = Math.max(5, Math.min(150, resizeStart.width - deltaX));
        const newX = resizeStart.x + (resizeStart.width - newW);
        updateSelectedElement({ x: Math.round(newX * 10) / 10, width: Math.round(newW * 10) / 10 });
      } else if (resizeHandle === "s") {
        const newH = Math.max(5, Math.min(150, resizeStart.height + deltaY));
        updateSelectedElement({ height: Math.round(newH * 10) / 10 });
      } else if (resizeHandle === "n") {
        const newH = Math.max(5, Math.min(150, resizeStart.height - deltaY));
        const newY = resizeStart.y + (resizeStart.height - newH);
        updateSelectedElement({ y: Math.round(newY * 10) / 10, height: Math.round(newH * 10) / 10 });
      }
      return;
    }

    // Handle Dragging
    if (isDragging && dragStart) {
      const deltaX = ((e.clientX - dragStart.x) / canvasRect.width) * 100;
      const deltaY = ((e.clientY - dragStart.y) / canvasRect.height) * 100;

      const newX = Math.max(-30, Math.min(100, dragStart.elX + deltaX));
      const newY = Math.max(-30, Math.min(100, dragStart.elY + deltaY));

      updateSelectedElement({
        x: Math.round(newX * 10) / 10,
        y: Math.round(newY * 10) / 10,
      });
    }
  };

  const handleTouchMoveCanvas = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    handleMouseMoveCanvas({ clientX: touch.clientX, clientY: touch.clientY } as any);
  };

  const handleMouseUpCanvas = () => {
    setIsDragging(false);
    setIsResizing(false);
    setDragStart(null);
    setResizeStart(null);
    setResizeHandle(null);
  };

  const handleTouchEndCanvas = () => {
    handleMouseUpCanvas();
  };

  // Global pointer up listener to prevent stuck dragging/resizing
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  // Quick Corner & Alignment Helpers
  const handleAlign = (type: "tl" | "tr" | "bl" | "br" | "center" | "centerH" | "centerV") => {
    if (!selectedElement || selectedElement.isLocked) return;
    const w = selectedElement.width || 30;
    const h = selectedElement.height || 20;

    switch (type) {
      case "tl":
        updateSelectedElement({ x: 0, y: 0 });
        break;
      case "tr":
        updateSelectedElement({ x: Math.round((100 - w) * 10) / 10, y: 0 });
        break;
      case "bl":
        updateSelectedElement({ x: 0, y: Math.round((100 - h) * 10) / 10 });
        break;
      case "br":
        updateSelectedElement({
          x: Math.round((100 - w) * 10) / 10,
          y: Math.round((100 - h) * 10) / 10,
        });
        break;
      case "center":
        updateSelectedElement({
          x: Math.round(((100 - w) / 2) * 10) / 10,
          y: Math.round(((100 - h) / 2) * 10) / 10,
        });
        break;
      case "centerH":
        updateSelectedElement({ x: Math.round(((100 - w) / 2) * 10) / 10 });
        break;
      case "centerV":
        updateSelectedElement({ y: Math.round(((100 - h) / 2) * 10) / 10 });
        break;
    }
  };

  // Quick Scale Delta
  const handleQuickScale = (deltaPercent: number) => {
    if (!selectedElement || selectedElement.isLocked) return;
    const currentW = selectedElement.width || 30;
    const currentH = selectedElement.height || 20;
    const scaleFactor = 1 + deltaPercent / 100;

    const newW = Math.max(5, Math.min(150, Math.round(currentW * scaleFactor * 10) / 10));
    const newH = Math.max(5, Math.min(150, Math.round(currentH * scaleFactor * 10) / 10));

    updateSelectedElement({ width: newW, height: newH });
  };

  // Case Transform Helper
  const handleTransformCase = (mode: "upper" | "lower" | "title") => {
    if (!selectedElement?.text) return;
    let t = selectedElement.text;
    if (mode === "upper") t = t.toUpperCase();
    else if (mode === "lower") t = t.toLowerCase();
    else if (mode === "title") {
      t = t
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
    updateSelectedElement({ text: t });
  };

  // Custom Gradient Generator
  const applyCustomGradient = (start: string, end: string, angle: number) => {
    const grad = `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)`;
    setBackgroundColor(grad);
  };

  // Save Template to DB
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert("Please specify a template name.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name: templateName.trim(),
        topic,
        category,
        pricePerCard: Number(pricePerCard) > 0 ? Number(pricePerCard) : 30,
        minCopies: Number(minCopies) > 0 ? Number(minCopies) : 50,
        paperType: paperType.trim() || "350 GSM Textured Metallic Gold Cardstock",
        badge: badge.trim() || null,
        aspectRatio: baseLayer.aspectRatio,
        backgroundColor: baseLayer.backgroundColor,
        backgroundImage: baseLayer.backgroundImage,
        previewImage: previewImage || baseLayer.backgroundImage || "/images/canva/template1-thumb.webp",
        elements:
          cardLayers.length > 1
            ? {
                isMultiDeck: true,
                layers: cardLayers,
                activeLayerId,
              }
            : cardLayers[0]?.elements || [],
        isActive,
        sortOrder,
      };

      const url = templateId
        ? `/api/admin/canva-templates/${templateId}`
        : "/api/admin/canva-templates";
      const method = templateId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to save template");

      setStatusToast(
        templateId
          ? "✨ Template saved & published!"
          : "🎉 New Template published to Canva Studio!"
      );
      setTimeout(() => setStatusToast(""), 3500);

      // If new template created, update URL without reloading
      if (!templateId && data.template?.id) {
        window.history.replaceState(null, "", `/admin/canva-templates/builder?id=${data.template.id}`);
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden flex flex-col bg-slate-100/70 text-slate-900 font-sans select-none">
      
      {/* ── DEDICATED FIXED STUDIO TOPBAR (CLEAN WHITE & RED BRANDING) ── */}
      <header className="h-14 bg-white border-b border-slate-200 shrink-0 z-30 shadow-xs flex items-center justify-between px-2 sm:px-4 md:px-6 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <Link
            href="/admin?tab=canva"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="Back to Admin Hub"
          >
            <ArrowLeft className="w-4 h-4 text-[#991B1B]" />
            <span className="hidden md:inline">Admin Hub</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

          <div className="flex items-center gap-1.5 min-w-0">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#991B1B] text-xs sm:text-sm font-bold text-slate-900 outline-none px-2 py-1 rounded-xl transition-all w-28 sm:w-44 md:w-64 truncate shadow-2xs"
              placeholder="Template Name..."
            />
            <span className="px-1.5 py-0.5 rounded-full bg-red-50 text-[#991B1B] text-[8.5px] font-extrabold uppercase tracking-wider border border-red-200 hidden sm:inline-flex shrink-0">
              {topic}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[8.5px] font-bold border border-slate-200 hidden lg:inline-flex shrink-0">
              {selectedRatio.name}
            </span>

            {/* Base Price Pill */}
            <div className="flex items-center gap-1 bg-red-50/70 border border-red-200 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl shadow-2xs shrink-0">
              <span className="text-[11px] font-bold text-[#991B1B] hidden xl:inline">Base:</span>
              <span className="text-xs font-black text-[#991B1B]">₹</span>
              <input
                type="number"
                min={1}
                value={pricePerCard}
                onChange={(e) => setPricePerCard(Math.max(1, Number(e.target.value) || 0))}
                className="w-10 sm:w-12 bg-white border border-red-200 focus:border-[#991B1B] focus:ring-1 focus:ring-red-100 rounded-lg px-1 py-0.5 text-xs font-black text-slate-900 text-center outline-none"
                placeholder="30"
                title="Base rate per card (for 1000+ prints)"
              />
              <span className="text-[9.5px] font-bold text-slate-600 hidden xs:inline">/card</span>
              <button
                type="button"
                onClick={() => setShowPricingModal(true)}
                className="text-[9px] bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold px-1.5 py-0.5 rounded cursor-pointer transition-colors shadow-2xs"
                title="View 6-tier volume pricing breakdown table"
              >
                Tiers
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Test Personalization Mode Toggle */}
          <button
            type="button"
            onClick={() => setTestMode(!testMode)}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              testMode
                ? "bg-[#991B1B] text-white border-[#991B1B] shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
            }`}
            title="Preview sample names"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{testMode ? "Editing" : "Preview"}</span>
          </button>

          {/* Save & Publish */}
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveTemplate}
            className="px-3 sm:px-5 py-1.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold flex items-center gap-1.5 sm:gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 text-white" />
            )}
            <span className="hidden sm:inline">{isSaving ? "Publishing..." : "Publish Template"}</span>
            <span className="sm:hidden">{isSaving ? "..." : "Publish"}</span>
          </button>
        </div>
      </header>



      {/* Success Toast */}
      {statusToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#991B1B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/20 animate-slide-down">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* ── 3-COLUMN FULL-HEIGHT VIEWPORT WORKSPACE ── */}
      <div className="flex-1 min-h-0 flex flex-row overflow-hidden">
        
        {/* ── MOBILE BACKDROP FOR LEFT SIDEBAR ── */}
        {mobileLeftOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileLeftOpen(false)}
          />
        )}

        {/* ── LEFT SIDEBAR (TOOLS & PRESETS) ── */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm bg-white shadow-2xl transition-transform duration-200 flex flex-col border-r border-slate-200 shrink-0 lg:static lg:z-10 lg:w-80 lg:translate-x-0 lg:shadow-xs ${
            mobileLeftOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Mobile Drawer Header with Close */}
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

          {/* Navigation Tabs */}
          <div className="shrink-0 grid grid-cols-4 p-2 gap-1 bg-slate-50 border-b border-slate-200 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab("SETTINGS")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "SETTINGS" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>

            <button
              onClick={() => setActiveTab("TEXT")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "TEXT" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              onClick={() => setActiveTab("ASSETS")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "ASSETS" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>PNGs</span>
            </button>

            <button
              onClick={() => setActiveTab("LAYERS")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "LAYERS" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>
          </div>

          {/* Scrollable Left Tab Body */}
          <div
            data-lenis-prevent
            className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-auto overscroll-contain bg-white"
          >
            {/* TAB 1: CANVAS SETTINGS (COLLAPSIBLE ACCORDIONS) */}
            {activeTab === "SETTINGS" && (
              <div className="divide-y divide-slate-200 text-xs">
                
                {/* ── ACCORDION 1: ASPECT RATIO & MULTI-LAYER SIZING ── */}
                <div className="bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("ratio")}
                    className="w-full px-4 py-3.5 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📐</span>
                      <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                        Aspect Ratio &amp; Layer Sizing
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#991B1B] bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        {activeDimensions.ratioStr}
                      </span>
                      {accordionOpen.ratio ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {accordionOpen.ratio && (
                    <div className="px-4 pb-4 pt-1 space-y-4">
                      
                      {/* Crisp Layer Name Input with Inline Base Button */}
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={activeLayer.name}
                          onChange={(e) => updateActiveLayer({ name: e.target.value })}
                          className="w-full py-2 pl-3 pr-24 bg-white border border-slate-200 focus:border-[#991B1B] focus:ring-1 focus:ring-red-100 rounded-xl text-xs font-bold text-slate-900 outline-none transition-all shadow-2xs"
                          placeholder="Layer Name (e.g. Insert Sheet 2)"
                        />
                        <div className="absolute right-1.5 flex items-center">
                          {activeLayer.isBase ? (
                            <span className="text-[9px] font-extrabold text-[#991B1B] bg-red-50 px-2 py-1 rounded-lg border border-red-200">
                              ⭐ Base Card
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetAsBaseLayer(activeLayer.id)}
                              className="text-[9px] font-bold text-slate-500 hover:text-[#991B1B] hover:bg-red-50 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              title="Make this the base reference card"
                            >
                              ⭐ Set Base
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Sizing Mode Toggle Button (Scale Content vs Outer Layer Only) */}
                      <div className="p-2.5 bg-red-50/70 rounded-2xl border border-red-200/90 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-[#991B1B] uppercase tracking-wider">
                            Resize Mode
                          </span>
                          <span className="text-[9px] text-slate-600 font-bold">
                            {scaleContentWithSize ? "Auto-scale Text & Motifs" : "Outer Canvas Only"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-red-100 text-[10px] font-extrabold">
                          <button
                            type="button"
                            onClick={() => setScaleContentWithSize(true)}
                            className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                              scaleContentWithSize
                                ? "bg-[#991B1B] text-white shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Scale Content
                          </button>
                          <button
                            type="button"
                            onClick={() => setScaleContentWithSize(false)}
                            className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                              !scaleContentWithSize
                                ? "bg-slate-900 text-white shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Outer Layer Only
                          </button>
                        </div>
                      </div>

                      {/* Relative Height Percentage (Simple & Crispy for Non-Base Layers) */}
                      {!activeLayer.isBase && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[11px] font-bold text-slate-700">Height vs Base Card</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={10}
                                max={300}
                                value={activeLayer.heightPercent || 85}
                                onFocus={() => triggerHeightAdjusting()}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val)) handleHeightPercentChange(val);
                                }}
                                className="w-14 text-right py-0.5 px-1.5 bg-red-50 border border-red-200 focus:border-[#991B1B] rounded-md text-xs font-mono font-extrabold text-[#991B1B] outline-none"
                              />
                              <span className="text-xs font-extrabold text-[#991B1B] font-mono">%</span>
                            </div>
                          </div>
                          
                          {/* Quick Percentage Presets */}
                          <div className="flex items-center gap-1">
                            {[150, 125, 100, 85, 75, 60].map((pct) => (
                              <button
                                key={pct}
                                type="button"
                                onPointerDown={() => triggerHeightAdjusting()}
                                onClick={() => handleHeightPercentChange(pct)}
                                className={`flex-1 py-1 rounded-lg text-[10px] font-bold text-center border transition-all cursor-pointer ${
                                  activeLayer.heightPercent === pct
                                    ? "bg-[#991B1B] text-white border-[#991B1B] shadow-2xs"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                                }`}
                              >
                                {pct}%
                              </button>
                            ))}
                          </div>

                          <input
                            type="range"
                            min={10}
                            max={300}
                            value={activeLayer.heightPercent || 85}
                            onPointerDown={() => triggerHeightAdjusting()}
                            onPointerUp={() => {
                              if (heightAdjustTimerRef.current) clearTimeout(heightAdjustTimerRef.current);
                              heightAdjustTimerRef.current = setTimeout(() => setIsAdjustingHeight(false), 900);
                            }}
                            onChange={(e) => handleHeightPercentChange(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#991B1B]"
                          />
                        </div>
                      )}

                      {/* Aspect Ratio Presets (3 in a Row Grid) */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-700 block">
                          Aspect Ratio Preset
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {ASPECT_RATIOS.map((ratio) => {
                            const isActive = activeLayer.aspectRatio === ratio.id;
                            return (
                              <button
                                key={ratio.id}
                                type="button"
                                onClick={() => setAspectRatio(ratio.id)}
                                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer shadow-2xs ${
                                  isActive
                                    ? "bg-red-50/60 border-[#991B1B] text-[#991B1B] ring-1 ring-red-200"
                                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                                }`}
                                title={`${ratio.name} - ${ratio.subtitle}`}
                              >
                                <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                  <div
                                    className={`${ratio.boxClass} rounded-xs border-2 transition-colors ${
                                      isActive ? "border-[#991B1B] bg-red-100/50" : "border-slate-400 bg-slate-200"
                                    }`}
                                  />
                                </div>
                                <span className="text-[10px] font-extrabold leading-tight">
                                  {ratio.ratioStr}
                                </span>
                                <span className="text-[8.5px] text-slate-400 leading-tight">
                                  {ratio.shortName}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Width & Height Measurement Inputs (with auto-calculation) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700">Dimensions (px)</span>
                          <button
                            type="button"
                            onClick={() => updateActiveLayer({ lockRatio: !activeLayer.lockRatio })}
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 border transition-colors cursor-pointer ${
                              activeLayer.lockRatio
                                ? "bg-red-50 text-[#991B1B] border-red-200"
                                : "bg-white text-slate-500 border-slate-200"
                            }`}
                            title={activeLayer.lockRatio ? "Lock Aspect Ratio (Auto-calculates width/height)" : "Unlock Free Dimensions"}
                          >
                            {activeLayer.lockRatio ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                            <span>{activeLayer.lockRatio ? "Locked" : "Free"}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              value={activeDimensions.width}
                              onChange={(e) => handleDimensionChange("width", e.target.value)}
                              className="w-full py-1.5 pl-2.5 pr-7 bg-white border border-slate-200 focus:border-[#991B1B] rounded-lg text-xs font-mono font-bold text-slate-900 outline-none"
                              placeholder="Width"
                            />
                            <span className="absolute right-2 text-[9px] text-slate-400 font-mono pointer-events-none">W</span>
                          </div>

                          <div className="relative flex items-center">
                            <input
                              type="number"
                              value={activeDimensions.height}
                              onChange={(e) => handleDimensionChange("height", e.target.value)}
                              className="w-full py-1.5 pl-2.5 pr-7 bg-white border border-slate-200 focus:border-[#991B1B] rounded-lg text-xs font-mono font-bold text-slate-900 outline-none"
                              placeholder="Height"
                            />
                            <span className="absolute right-2 text-[9px] text-slate-400 font-mono pointer-events-none">H</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* ── ACCORDION 2: CARD BACKGROUND & GRADIENTS (4 IN A ROW) ── */}
                <div className="bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("background")}
                    className="w-full px-4 py-3.5 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🎨</span>
                      <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                        Card Background
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 capitalize">
                        {bgMode}
                      </span>
                      {accordionOpen.background ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {accordionOpen.background && (
                    <div className="px-4 pb-4 pt-1 space-y-3">
                      {/* Mode Selector (4 in a Row) */}
                      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setBgMode("textures")}
                          className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                            bgMode === "textures"
                              ? "bg-[#991B1B] text-white shadow-2xs"
                              : "text-slate-700 hover:text-slate-900"
                          }`}
                        >
                          Textures ({texturesList.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setBgMode("solid")}
                          className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                            bgMode === "solid"
                              ? "bg-[#991B1B] text-white shadow-2xs"
                              : "text-slate-700 hover:text-slate-900"
                          }`}
                        >
                          Solid
                        </button>
                        <button
                          type="button"
                          onClick={() => setBgMode("gradient")}
                          className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                            bgMode === "gradient"
                              ? "bg-[#991B1B] text-white shadow-2xs"
                              : "text-slate-700 hover:text-slate-900"
                          }`}
                        >
                          Gradients
                        </button>
                        <button
                          type="button"
                          onClick={() => setBgMode("image")}
                          className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                            bgMode === "image"
                              ? "bg-[#991B1B] text-white shadow-2xs"
                              : "text-slate-700 hover:text-slate-900"
                          }`}
                        >
                          Upload
                        </button>
                      </div>

                      {/* DYNAMIC BACKGROUND TEXTURES SELECTOR */}
                      {bgMode === "textures" && (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-slate-800">
                                Background Textures ({texturesList.length})
                              </span>
                              {isLoadingTextures && (
                                <span className="text-[9px] text-slate-400">Loading...</span>
                              )}
                            </div>
                            {backgroundImage && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateActiveLayer({ backgroundImage: null, bgMode: "solid" });
                                  setStatusToast("Background texture cleared");
                                  setTimeout(() => setStatusToast(""), 2500);
                                }}
                                className="text-[10px] font-bold text-[#991B1B] hover:underline cursor-pointer"
                              >
                                Clear BG
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-5 gap-1.5 max-h-[360px] overflow-y-auto pr-1 select-none">
                            {texturesList.map((tex) => {
                              const isSelected = backgroundImage === tex.src;
                              return (
                                <button
                                  key={tex.id}
                                  type="button"
                                  onClick={() => {
                                    updateActiveLayer({
                                      backgroundImage: tex.src,
                                      backgroundColor: "transparent",
                                      bgMode: "textures",
                                    });
                                    setStatusToast(`Applied ${tex.name}`);
                                    setTimeout(() => setStatusToast(""), 2000);
                                  }}
                                  className={`group relative rounded-lg overflow-hidden border aspect-[3/4] transition-all cursor-pointer hover:shadow-md ${
                                    isSelected
                                      ? "border-[#991B1B] ring-2 ring-[#991B1B] scale-95 shadow-sm"
                                      : "border-slate-200 hover:border-slate-400 bg-slate-50"
                                  }`}
                                  title={tex.name}
                                >
                                  <img
                                    src={tex.src}
                                    alt={tex.name}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    loading="lazy"
                                  />
                                  {/* Number Badge */}
                                  <span className="absolute bottom-0.5 right-0.5 bg-black/70 backdrop-blur-xs text-white text-[7.5px] font-mono font-bold px-1 py-0.2 rounded">
                                    {tex.num}
                                  </span>
                                  {isSelected && (
                                    <div className="absolute inset-0 bg-[#991B1B]/20 flex items-center justify-center">
                                      <div className="w-4 h-4 rounded-full bg-[#991B1B] text-white flex items-center justify-center text-[10px] font-bold shadow">
                                        ✓
                                      </div>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* SOLID COLOR CONTROLS */}
                      {bgMode === "solid" && (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={backgroundColor.startsWith("#") ? backgroundColor : "#F3EAD8"}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                            />
                            <input
                              type="text"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="flex-1 p-2 bg-white border border-slate-200 focus:border-[#991B1B] rounded-xl text-slate-900 font-mono uppercase text-xs font-bold outline-none"
                              placeholder="#F3EAD8"
                            />
                          </div>

                          {/* Quick Solid Swatches */}
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            {LUXURY_PALETTE.map((pal, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setBackgroundColor(pal.color)}
                                style={{ backgroundColor: pal.color }}
                                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-115 cursor-pointer shadow-2xs ${
                                  backgroundColor === pal.color
                                    ? "border-[#991B1B] ring-2 ring-red-200"
                                    : "border-white"
                                }`}
                                title={pal.name}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* LUXURY GRADIENTS (4 IN A ROW GRID) */}
                      {bgMode === "gradient" && (
                        <div className="space-y-3 pt-1">
                          {/* 4 IN A ROW GRADIENT SWATCHES */}
                          <div className="grid grid-cols-4 gap-1.5">
                            {LUXURY_GRADIENTS.map((grad, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setBackgroundColor(grad.value)}
                                className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer group shadow-2xs ${
                                  backgroundColor === grad.value
                                    ? "border-[#991B1B] ring-2 ring-red-200 bg-red-50/50"
                                    : "border-slate-200 bg-slate-50 hover:bg-white"
                                }`}
                                title={grad.name}
                              >
                                <div
                                  style={{ background: grad.value }}
                                  className="w-full h-8 rounded-lg shadow-inner border border-black/10 group-hover:scale-105 transition-transform"
                                />
                                <span className="text-[8px] font-bold text-slate-700 truncate w-full leading-tight">
                                  {grad.name.split(" ")[0]}
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Custom 2-Color Gradient Builder */}
                          <div className="space-y-2 pt-1">
                            <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider block">
                              🛠️ Custom 2-Color Gradient Builder
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-0.5">
                                <label className="text-[9px] text-slate-500 font-semibold">Start Color</label>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="color"
                                    value={customGradStart}
                                    onChange={(e) => {
                                      setCustomGradStart(e.target.value);
                                      applyCustomGradient(e.target.value, customGradEnd, customGradAngle);
                                    }}
                                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                                  />
                                  <input
                                    type="text"
                                    value={customGradStart}
                                    onChange={(e) => {
                                      setCustomGradStart(e.target.value);
                                      applyCustomGradient(e.target.value, customGradEnd, customGradAngle);
                                    }}
                                    className="w-full p-1 bg-white border border-slate-200 rounded text-[9px] font-mono uppercase"
                                  />
                                </div>
                              </div>

                              <div className="space-y-0.5">
                                <label className="text-[9px] text-slate-500 font-semibold">End Color</label>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="color"
                                    value={customGradEnd}
                                    onChange={(e) => {
                                      setCustomGradEnd(e.target.value);
                                      applyCustomGradient(customGradStart, e.target.value, customGradAngle);
                                    }}
                                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                                  />
                                  <input
                                    type="text"
                                    value={customGradEnd}
                                    onChange={(e) => {
                                      setCustomGradEnd(e.target.value);
                                      applyCustomGradient(customGradStart, e.target.value, customGradAngle);
                                    }}
                                    className="w-full p-1 bg-white border border-slate-200 rounded text-[9px] font-mono uppercase"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-0.5 pt-1">
                              <div className="flex items-center justify-between text-[9px] text-slate-700 font-bold">
                                <span>Angle</span>
                                <span>{customGradAngle}°</span>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={360}
                                value={customGradAngle}
                                onChange={(e) => {
                                  const angle = Number(e.target.value);
                                  setCustomGradAngle(angle);
                                  applyCustomGradient(customGradStart, customGradEnd, angle);
                                }}
                                className="w-full accent-[#991B1B]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* BG IMAGE CONTROLS */}
                      {bgMode === "image" && (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Uploaded BG Image</span>
                            {backgroundImage && (
                              <button
                                onClick={() => setBackgroundImage(null)}
                                className="text-[10px] font-bold text-[#991B1B] hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 hover:border-[#991B1B] rounded-xl cursor-pointer bg-white transition-all text-center">
                            <Upload className="w-4 h-4 text-slate-400 mb-1" />
                            <span className="text-[10px] font-bold text-slate-700">
                              {isUploading ? "Optimizing & Uploading..." : "Upload Full Card BG"}
                            </span>
                            <span className="text-[8px] text-slate-400">Auto-optimized for 4K Retina</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadFile(file, "background");
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── ACCORDION 3: TEMPLATE PREVIEW THUMBNAIL / COVER ── */}
                <div className="bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("thumbnail")}
                    className="w-full px-4 py-3.5 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🖼️</span>
                      <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                        Template Preview Cover / Thumbnail
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {previewImage ? (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Custom Cover
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Auto
                        </span>
                      )}
                      {accordionOpen.thumbnail ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {accordionOpen.thumbnail && (
                    <div className="px-4 pb-4 pt-1 space-y-3">
                      {previewImage ? (
                        <div className="space-y-2">
                          <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-4/5 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previewImage}
                              alt="Template Thumbnail Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                              <label className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-[10px] font-bold cursor-pointer hover:bg-slate-100 shadow-md">
                                Change Thumbnail
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={isUploading}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadFile(file, "preview");
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => setPreviewImage(null)}
                                className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-[10px] font-bold cursor-pointer hover:bg-red-700 shadow-md"
                              >
                                Reset to Auto
                              </button>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 text-center font-medium">
                            Displaying on the Admin Hub and /canva Studio catalog.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-[#991B1B] rounded-xl cursor-pointer bg-slate-50/60 hover:bg-white transition-all text-center">
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <span className="text-[11px] font-bold text-slate-800">
                              {isUploading ? "Uploading Preview..." : "Upload Custom Catalog Thumbnail"}
                            </span>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              JPEG / PNG / WebP (Used for template cards)
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadFile(file, "preview");
                              }}
                            />
                          </label>
                          <p className="text-[9px] text-slate-500 italic text-center">
                            💡 If no custom thumbnail is uploaded, the background or card preview is used automatically.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── ACCORDION: PRICING & PRINT SPECIFICATIONS ── */}
                <div className="bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("pricing")}
                    className="w-full px-4 py-3.5 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">💰</span>
                      <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                        Pricing &amp; Print Specs
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-[#991B1B] bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        ₹{pricePerCard} / card
                      </span>
                      {accordionOpen.pricing ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {accordionOpen.pricing && (
                    <div className="px-4 pb-4 pt-1 space-y-3.5">
                      {/* Base Rate Input */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-800 text-[11px]">
                            Base Price (for 1000+ Prints) <span className="text-[#991B1B]">*</span>
                          </label>
                          <span className="text-[10px] font-semibold text-slate-500">Min: ₹1/card</span>
                        </div>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 font-black text-slate-400 text-xs">₹</span>
                          <input
                            type="number"
                            min={1}
                            value={pricePerCard}
                            onChange={(e) => setPricePerCard(Math.max(1, Number(e.target.value) || 0))}
                            className="w-full py-2 pl-7 pr-16 bg-white border border-slate-200 focus:border-[#991B1B] focus:ring-1 focus:ring-red-100 rounded-xl text-xs font-black text-slate-900 outline-none transition-all shadow-2xs"
                            placeholder="30"
                          />
                          <span className="absolute right-3 text-[10px] font-bold text-slate-400 pointer-events-none">
                            / card
                          </span>
                        </div>
                      </div>

                      {/* Minimum Copies & Badge */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 text-[10px]">Min Copies</label>
                          <input
                            type="number"
                            min={20}
                            value={minCopies}
                            onChange={(e) => setMinCopies(Math.max(20, Number(e.target.value) || 50))}
                            className="w-full p-2 bg-white border border-slate-200 focus:border-[#991B1B] rounded-xl text-xs font-bold text-slate-900 outline-none"
                            placeholder="50"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 text-[10px]">Catalog Badge</label>
                          <select
                            value={badge}
                            onChange={(e) => setBadge(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-200 focus:border-[#991B1B] rounded-xl text-xs font-bold text-slate-900 outline-none"
                          >
                            <option value="">(None)</option>
                            <option value="BESTSELLER">BESTSELLER</option>
                            <option value="ROYAL LUXE">ROYAL LUXE</option>
                            <option value="NEW">NEW</option>
                            <option value="TRENDING">TRENDING</option>
                            <option value="POPULAR">POPULAR</option>
                          </select>
                        </div>
                      </div>

                      {/* Paper Type & Stock */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 text-[10px]">Paper Finish / Material Stock</label>
                        <select
                          value={paperType}
                          onChange={(e) => setPaperType(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 focus:border-[#991B1B] rounded-xl text-xs text-slate-900 font-semibold outline-none"
                        >
                          <option value="350 GSM Textured Metallic Gold Cardstock">350 GSM Textured Metallic Gold Cardstock</option>
                          <option value="300 GSM Royal Silk Matte Finish">300 GSM Royal Silk Matte Finish</option>
                          <option value="350 GSM Handmade Cotton Paper with Gold Foil">350 GSM Handmade Cotton Paper with Gold Foil</option>
                          <option value="400 GSM Ultra-Thick Velvet Board">400 GSM Ultra-Thick Velvet Board</option>
                          <option value="280 GSM Pearl Shimmer Embossed">280 GSM Pearl Shimmer Embossed</option>
                        </select>
                      </div>

                      {/* Live 6-Tier Volume Pricing Preview Table */}
                      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-600" />
                            <span>Auto Tiered Rates</span>
                          </span>
                          <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            Base: ₹{pricePerCard}
                          </span>
                        </div>

                        <div className="space-y-1 text-[10px]">
                          {CARD_PRICING_TIERS.map((tier, idx) => {
                            const sampleQty = tier.min;
                            const calc = calculateTieredCardPrice(pricePerCard, sampleQty, false);
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between py-0.5 px-1.5 rounded bg-white/80 border border-amber-100 text-slate-700"
                              >
                                <span className="font-semibold text-slate-800">{tier.label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] text-amber-700 font-medium">+{tier.markupPercent}%</span>
                                  <strong className="text-[#991B1B] font-extrabold font-mono">₹{calc.unitPrice}/card</strong>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── ACCORDION 4: TEMPLATE METADATA & STATUS ── */}
                <div className="bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("metadata")}
                    className="w-full px-4 py-3.5 bg-white hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🏷️</span>
                      <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                        Template Info &amp; Status
                      </span>
                    </div>
                    {accordionOpen.metadata ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {accordionOpen.metadata && (
                    <div className="px-4 pb-4 pt-1 space-y-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Template Topic</label>
                        <select
                          value={topic}
                          onChange={(e) => setTopic(e.target.value as any)}
                          className="w-full p-2 bg-white border border-slate-200 focus:border-[#991B1B] rounded-xl text-slate-900 outline-none"
                        >
                          <option value="vintage">📜 Vintage / Parchment</option>
                          <option value="modern">✨ Modern / Contemporary</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Category Tag</label>
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 focus:border-[#991B1B] rounded-xl text-slate-900 outline-none"
                          placeholder="e.g. Royal Heritage, Floral Arch"
                        />
                      </div>

                      <div className="pt-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="isActiveTpl"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 rounded text-[#991B1B] accent-[#991B1B] cursor-pointer"
                          />
                          <label htmlFor="isActiveTpl" className="text-slate-800 font-medium cursor-pointer">
                            Active &amp; Visible in /canva Studio
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: TEXT PRESETS (Bride & Groom Separated) */}
            {activeTab === "TEXT" && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Invitation Text Fields</span>
                  <button
                    onClick={() => handleAddTextElement()}
                    className="text-[11px] font-bold text-[#991B1B] hover:text-[#7F1D1D] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Plain Text</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {PRESET_FIELDS.map((field, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddTextElement(field)}
                      className="w-full p-3 bg-slate-50 hover:bg-red-50/50 border border-slate-200 hover:border-[#991B1B] rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#991B1B] transition-colors">
                          {field.label}
                        </p>
                        <p className="text-[10px] text-slate-500 italic truncate max-w-[200px]">
                          &ldquo;{field.defaultText}&rdquo;
                        </p>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#991B1B] transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ASSETS (MULTI-PNG BATCH UPLOAD & LIBRARY) */}
            {activeTab === "ASSETS" && (
              <div className="p-4 space-y-4">
                {/* Multi-PNG Dropzone & Upload Button */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      PNG Overlays Library
                    </span>
                    <label className="text-[11px] font-bold text-[#991B1B] hover:text-[#7F1D1D] flex items-center gap-1 cursor-pointer bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 transition-colors">
                      <FolderUp className="w-3.5 h-3.5" />
                      <span>+ Select PNGs</span>
                      <input
                        type="file"
                        multiple
                        accept="image/png,image/webp"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleUploadMultiplePNGs(e.target.files);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Drag & Drop Multi-file Box */}
                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingOverPNGTab(true);
                    }}
                    onDragLeave={() => setIsDraggingOverPNGTab(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingOverPNGTab(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleUploadMultiplePNGs(e.dataTransfer.files);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-3.5 border-2 border-dashed rounded-2xl cursor-pointer transition-all text-center ${
                      isDraggingOverPNGTab
                        ? "border-[#991B1B] bg-red-50/80 scale-101"
                        : "border-slate-300 hover:border-[#991B1B] bg-slate-50/60 hover:bg-white"
                    }`}
                  >
                    <Upload className={`w-5 h-5 mb-1 transition-colors ${
                      isDraggingOverPNGTab ? "text-[#991B1B]" : "text-slate-400"
                    }`} />
                    
                    {isUploading && uploadProgress ? (
                      <div className="space-y-1 w-full px-2">
                        <span className="text-[11px] font-bold text-[#991B1B] block">
                          Optimizing &amp; Uploading ({uploadProgress.current} / {uploadProgress.total})...
                        </span>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#991B1B] h-full transition-all duration-300"
                            style={{
                              width: `${Math.round((uploadProgress.current / uploadProgress.total) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="text-[11px] font-bold text-slate-800">
                          Drop multiple PNGs here or Browse
                        </span>
                        <span className="text-[9px] text-slate-500">
                          Upload transparent PNG arches, florals, swirls (Batch multi-upload supported)
                        </span>
                      </>
                    )}

                    <input
                      type="file"
                      multiple
                      accept="image/png,image/webp"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleUploadMultiplePNGs(e.target.files);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* PNG Library Grid */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-800">
                        Available PNGs ({uploadedGraphics.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => fetchCanvaAssets()}
                        className={`p-1 rounded-md text-slate-400 hover:text-[#991B1B] hover:bg-red-50 transition-colors cursor-pointer ${
                          isLoadingAssets ? "animate-spin text-[#991B1B]" : ""
                        }`}
                        title="Refresh and sync all uploaded PNGs from Cloudinary & templates"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Click to add on canvas</span>
                  </div>

                  {isLoadingAssets && uploadedGraphics.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                      <RotateCw className="w-4 h-4 animate-spin text-[#991B1B]" />
                      <span>Loading all uploaded assets...</span>
                    </div>
                  ) : uploadedGraphics.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No PNG assets found. Upload some transparent PNGs above to populate your library!
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto p-1 custom-scrollbar">
                      {uploadedGraphics.map((src, idx) => (
                        <div
                          key={`${src}-${idx}`}
                          onClick={() => handleAddImageElement(src)}
                          className="group relative p-2.5 bg-slate-50 border border-slate-200 hover:border-[#991B1B] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-102 hover:bg-white shadow-2xs aspect-square"
                          title="Click to place onto active canvas layer"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt="PNG Overlay"
                            onError={(e) => {
                              (e.currentTarget.parentElement as HTMLElement)?.classList.add("hidden");
                            }}
                            className="h-20 w-full object-contain filter drop-shadow-xs transition-transform group-hover:scale-108"
                          />
                          <span className="text-[9px] font-bold text-[#991B1B] mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1.5">
                            + Add Layer
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: LAYERS LIST (WITH LOCK / UNLOCK TOGGLES) */}
            {activeTab === "LAYERS" && (
              <div className="p-4 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Layer Stack ({elements.length} Layers)
                </span>

                {elements.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No layers added yet. Add a PNG or Text layer to get started!
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {[...elements].reverse().map((el) => {
                      const isSelected = selectedElementId === el.id;

                      return (
                        <div
                          key={el.id}
                          onClick={() => setSelectedElementId(el.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                            isSelected
                              ? el.isLocked
                                ? "bg-amber-50/90 border-amber-500 text-slate-900 shadow-2xs ring-1 ring-amber-300"
                                : "bg-red-50/80 border-[#991B1B] text-slate-900 shadow-2xs ring-1 ring-red-200"
                              : el.isLocked
                              ? "bg-slate-100/90 border-slate-300/80 text-slate-500"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {/* Layer Title & Icon */}
                          <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 pr-2">
                            {el.type === "image" ? (
                              <ImageIcon className="w-3.5 h-3.5 text-[#991B1B] shrink-0" />
                            ) : (
                              <Type className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                            )}
                            <span className="truncate font-bold text-[11px]">
                              {el.type === "image"
                                ? "PNG Graphic"
                                : el.fieldKey
                                ? `Field: ${el.fieldKey}`
                                : el.text}
                            </span>
                            {el.isLocked && (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 py-0.2 rounded shrink-0 flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> Locked
                              </span>
                            )}
                          </div>

                          {/* Action Buttons: Lock/Unlock, Move, Delete */}
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Lock / Unlock Toggle Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateElementById(el.id, { isLocked: !el.isLocked });
                              }}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                el.isLocked
                                  ? "text-amber-800 bg-amber-200 hover:bg-amber-300"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                              title={el.isLocked ? "Unlock Layer (Click to allow moving)" : "Lock Layer (Click to freeze position)"}
                            >
                              {el.isLocked ? (
                                <Lock className="w-3.5 h-3.5 text-amber-800" />
                              ) : (
                                <Unlock className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveLayer(el.id, "up");
                              }}
                              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded cursor-pointer"
                              title="Bring Forward"
                            >
                              <MoveUp className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveLayer(el.id, "down");
                              }}
                              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded cursor-pointer"
                              title="Send Backward"
                            >
                              <MoveDown className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteElement(el.id);
                              }}
                              className="p-1 text-slate-400 hover:text-[#991B1B] hover:bg-red-50 rounded cursor-pointer"
                              title="Delete Layer"
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
          </div>
        </aside>

        {/* ── CENTER WORKSPACE CANVAS (SCALED FULL VIEW WITHOUT SCROLL) ── */}
        <main
          ref={containerRef}
          data-lenis-prevent
          className={`flex-1 h-full min-h-0 ${
            zoom > 1.05 ? "overflow-auto" : "overflow-hidden"
          } bg-slate-100/80 flex flex-col items-center justify-center p-4 relative overscroll-contain select-none`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedElementId(null);
            }
          }}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          onTouchMove={handleTouchMoveCanvas}
          onTouchEnd={handleTouchEndCanvas}
        >
          {/* ── MOBILE TOGGLEABLE HORIZONTAL LAYER THUMBNAILS TRAY ── */}
          <div className="md:hidden absolute top-2.5 left-2 right-2 z-20 flex flex-col items-center gap-1.5 pointer-events-none">
            {/* Toggle Pill Button */}
            <button
              type="button"
              onClick={() => setShowMobileLayers(!showMobileLayers)}
              className="pointer-events-auto px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-slate-800 text-[10.5px] font-extrabold flex items-center gap-1.5 cursor-pointer hover:bg-red-50 hover:text-[#991B1B] hover:border-red-200 transition-all active:scale-95"
            >
              <Layers className="w-3.5 h-3.5 text-[#991B1B]" />
              <span className="truncate max-w-[140px]">
                {activeLayer.name} ({cardLayers.findIndex((l) => l.id === activeLayerId) + 1}/{cardLayers.length})
              </span>
              <span className="text-[9px] text-[#991B1B] bg-red-50 px-1.5 py-0.2 rounded font-bold">
                {showMobileLayers ? "▲ Hide" : "▼ Layers"}
              </span>
            </button>

            {/* Expandable Horizontal Thumbnails Strip */}
            {showMobileLayers && (
              <div className="pointer-events-auto w-full max-w-sm bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-2.5 animate-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-2.5 overflow-x-auto custom-scrollbar pb-1">
                  {cardLayers.map((layer) => {
                    const isSelected = layer.id === activeLayerId;
                    const lDim = getLayerDimensions(layer, baseLayer);
                    const scale = Math.min(38 / lDim.width, 54 / lDim.height);
                    const thumbW = Math.max(24, Math.round(lDim.width * scale));
                    const thumbH = Math.max(24, Math.round(lDim.height * scale));

                    return (
                      <div
                        key={layer.id}
                        onClick={() => {
                          setActiveLayerId(layer.id);
                          setSelectedElementId(null);
                        }}
                        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group relative"
                      >
                        <div
                          style={{
                            width: `${thumbW}px`,
                            height: `${thumbH}px`,
                            backgroundColor:
                              layer.backgroundColor && (layer.backgroundColor.startsWith("#") || layer.backgroundColor.startsWith("rgb"))
                                ? layer.backgroundColor
                                : undefined,
                            backgroundImage: layer.backgroundImage
                              ? `url(${layer.backgroundImage})`
                              : layer.backgroundColor && layer.backgroundColor.includes("gradient")
                              ? layer.backgroundColor
                              : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                          className={`rounded-xs transition-all relative select-none ${
                            isSelected
                              ? "opacity-100 border-2 border-[#991B1B] shadow-xs bg-white scale-105"
                              : "opacity-45 hover:opacity-85 border border-slate-300 bg-white"
                          }`}
                        >
                          {/* Mini Elements */}
                          {layer.elements.map((el) => (
                            <div
                              key={el.id}
                              style={{
                                position: "absolute",
                                left: `${el.x}%`,
                                top: `${el.y}%`,
                                width: `${el.width}%`,
                                height: el.height ? `${el.height}%` : "auto",
                                transform: `rotate(${el.rotation || 0}deg)`,
                                opacity: 0.85,
                              }}
                              className="pointer-events-none"
                            >
                              {el.type === "image" && el.src && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={el.src} alt="" className="w-full h-full object-contain" />
                              )}
                              {el.type === "text" && (
                                <div
                                  style={{
                                    fontSize: "3.5px",
                                    color: el.color || "#1E293B",
                                    textAlign: el.textAlign || "center",
                                  }}
                                  className="truncate font-sans leading-none"
                                >
                                  {el.text}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <span
                          className={`text-[8.5px] truncate max-w-[55px] text-center ${
                            isSelected ? "text-[#991B1B] font-extrabold" : "text-slate-500 font-medium"
                          }`}
                        >
                          {layer.name}
                        </span>
                      </div>
                    );
                  })}

                  {/* + Add Button in Mobile Tray */}
                  <button
                    type="button"
                    onClick={handleAddLayer}
                    className="w-8 h-8 rounded-full bg-white hover:bg-red-50 border border-slate-300 hover:border-[#991B1B] text-slate-600 hover:text-[#991B1B] flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer group"
                    title="Add another card layer"
                  >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Zoomable Wrapper */}
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDragging || isResizing ? "none" : "transform 0.15s ease-out",
            }}
            className="shrink-0 flex items-center justify-center pointer-events-auto relative p-8"
          >
            {/* Visual Base Card Reference Guide (ONLY VISIBLE WHILE ADJUSTING HEIGHT/DIMENSIONS) */}
            {isAdjustingHeight && !activeLayer.isBase && (
              <>
                {/* Floating Top Dual Dimension Comparison Bar */}
                <div className="absolute -top-14 flex items-center gap-2.5 bg-slate-900/95 text-white px-3.5 py-1.5 rounded-xl shadow-xl text-[10px] font-bold z-50 backdrop-blur-xs border border-white/20 animate-in fade-in zoom-in-95 pointer-events-none">
                  <span className="text-red-400 font-extrabold flex items-center gap-1">
                    ⭐ Base: <span className="font-mono text-white">{baseDimensions.width}×{baseDimensions.height}px</span> (100%)
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-red-300 font-extrabold flex items-center gap-1">
                    📐 Active: <span className="font-mono text-white">{activeDimensions.width}×{activeDimensions.height}px</span> ({activeLayer.heightPercent || 85}%)
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-300 font-mono font-extrabold">
                    Δ W: {activeDimensions.width - baseDimensions.width >= 0 ? `+${activeDimensions.width - baseDimensions.width}` : activeDimensions.width - baseDimensions.width}px • Δ H: {activeDimensions.height - baseDimensions.height >= 0 ? `+${activeDimensions.height - baseDimensions.height}` : activeDimensions.height - baseDimensions.height}px
                  </span>
                </div>

                {/* Base Card Reference Outline (Rendered ON TOP at zIndex 35 so it's always clearly visible, even if smaller) */}
                <div
                  style={{
                    position: "absolute",
                    width: `${baseDimensions.width}px`,
                    height: `${baseDimensions.height}px`,
                    zIndex: 35,
                    pointerEvents: "none",
                  }}
                  className="rounded-2xl border-2 border-dashed border-[#991B1B] bg-red-500/10 backdrop-blur-[0.5px] transition-all duration-150 flex flex-col justify-between items-center shadow-xl select-none animate-in fade-in"
                >
                  {/* Top Reference Header Badge */}
                  <div className="w-full flex items-center justify-between px-3 py-1.5 bg-[#991B1B]/95 text-white rounded-t-xl text-[10px] font-extrabold shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span>⭐ Base Reference Card</span>
                      <span className="font-mono text-red-200 font-normal">
                        ({baseDimensions.width}W × {baseDimensions.height}H px)
                      </span>
                    </div>
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded font-mono">
                      100% Reference
                    </span>
                  </div>

                  {/* Center Subtle Watermark */}
                  <div className="my-auto text-center px-4 py-1.5 rounded-lg bg-white/80 border border-red-200 shadow-2xs">
                    <span className="text-[10px] font-extrabold text-[#991B1B] block">
                      Base Card Boundary (100%)
                    </span>
                    <span className="text-[8.5px] text-slate-500 font-mono">
                      W: {baseDimensions.width}px • H: {baseDimensions.height}px
                    </span>
                  </div>

                  {/* Bottom Base Alignment Indicator */}
                  <div className="w-full flex items-center justify-center py-1 bg-red-100/90 text-[#991B1B] text-[9px] font-bold rounded-b-xl border-t border-red-300">
                    <span>Base Card Floor Baseline</span>
                  </div>
                </div>

                {/* Right Side Live Height Comparison Delta Ruler */}
                <div className="absolute -right-48 top-0 bottom-0 flex flex-col justify-between items-start py-2 z-50 pointer-events-none">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#991B1B] bg-white border-2 border-[#991B1B] px-2.5 py-1 rounded-lg shadow-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#991B1B]" />
                    <span>Base H: {baseDimensions.height}px (100%)</span>
                  </div>

                  <div className="my-auto pl-3 border-l-2 border-dashed border-[#991B1B] text-left bg-white/95 p-2 rounded-r-lg shadow-sm border border-slate-200">
                    <span className="text-xs font-black text-[#991B1B] font-mono block">
                      Height: {activeLayer.heightPercent || 85}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 block">
                      {activeDimensions.height - baseDimensions.height < 0
                        ? `-${baseDimensions.height - activeDimensions.height}px shorter`
                        : activeDimensions.height - baseDimensions.height > 0
                        ? `+${activeDimensions.height - baseDimensions.height}px taller`
                        : "Equal height"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#991B1B] bg-white border-2 border-[#991B1B] px-2.5 py-1 rounded-lg shadow-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#991B1B]" />
                    <span>Active H: {activeDimensions.height}px ({activeLayer.heightPercent}%)</span>
                  </div>
                </div>

                {/* Bottom Width Comparison Ruler */}
                <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-between px-2 z-50 pointer-events-none">
                  <div className="flex items-center gap-1.5 text-[9.5px] font-extrabold text-[#991B1B] bg-white border border-[#991B1B] px-2 py-0.5 rounded-md shadow-xs">
                    <span>Base W: {baseDimensions.width}px</span>
                  </div>
                  <div className="text-[9.5px] font-bold text-slate-800 bg-white/95 border border-slate-300 px-2.5 py-0.5 rounded-full shadow-xs">
                    Width Δ: {activeDimensions.width - baseDimensions.width !== 0
                      ? `${Math.abs(activeDimensions.width - baseDimensions.width)}px ${activeDimensions.width < baseDimensions.width ? "narrower" : "wider"}`
                      : "Equal width"}
                  </div>
                  <div className="flex items-center gap-1.5 text-[9.5px] font-extrabold text-[#991B1B] bg-white border border-[#991B1B] px-2 py-0.5 rounded-md shadow-xs">
                    <span>Active W: {activeDimensions.width}px</span>
                  </div>
                </div>
              </>
            )}

            {/* Active Canvas Card Mockup (ONLY the selected template is displayed at 100% full opacity) */}
            <div
              ref={canvasRef}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedElementId(null);
                }
              }}
              style={{
                position: "relative",
                width: `${activeDimensions.width}px`,
                height: `${activeDimensions.height}px`,
                backgroundColor:
                  backgroundColor && (backgroundColor.startsWith("#") || backgroundColor.startsWith("rgb"))
                    ? backgroundColor
                    : undefined,
                backgroundImage: backgroundImage
                  ? `url(${backgroundImage})`
                  : backgroundColor && backgroundColor.includes("gradient")
                  ? backgroundColor
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                zIndex: 20,
                opacity: 1.0,
              }}
              className="rounded-2xl shadow-2xl border-2 border-slate-300 overflow-hidden select-none"
            >
              {/* Render Layers */}
              {elements.map((el) => {
                const isSelected = selectedElementId === el.id;

                return (
                  <div
                    key={el.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (el.isLocked) return;
                      setSelectedElementId(el.id);
                    }}
                    onMouseDown={(e) => {
                      if (el.isLocked) return;
                      handleMouseDownElement(e, el);
                    }}
                    onTouchStart={(e) => {
                      if (el.isLocked) return;
                      handleTouchStartElement(e, el);
                    }}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: el.height ? `${el.height}%` : "auto",
                      transform: `rotate(${el.rotation || 0}deg) ${el.flipH ? "scaleX(-1)" : ""} ${el.flipV ? "scaleY(-1)" : ""}`,
                      opacity: el.opacity ?? 1,
                      zIndex: el.zIndex,
                      pointerEvents: el.isLocked && !isSelected ? "none" : "auto",
                    }}
                    className={`group ${el.isLocked ? "cursor-default" : "cursor-move"} transition-shadow ${
                      isSelected
                        ? el.isLocked
                          ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-white/80"
                          : "ring-2 ring-[#991B1B] ring-offset-2 ring-offset-white/80"
                        : ""
                    }`}
                  >
                    {/* Layer Content */}
                    {el.type === "image" && el.src && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={el.src}
                        alt="Overlay"
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    )}

                    {el.type === "text" && (
                      <div
                        style={{
                          color: el.gradient ? "transparent" : el.color || "#1E293B",
                          backgroundImage: el.gradient || undefined,
                          WebkitBackgroundClip: el.gradient ? "text" : undefined,
                          WebkitTextFillColor: el.gradient ? "transparent" : undefined,
                          fontFamily: el.fontFamily || "'Cinzel', serif",
                          fontSize: `${el.fontSize || 16}px`,
                          fontWeight: el.fontWeight || "normal",
                          fontStyle: el.fontStyle || "normal",
                          textDecoration: el.textDecoration || "none",
                          textTransform: el.textTransform || "none",
                          textAlign: el.textAlign || "center",
                          letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
                          lineHeight: el.lineHeight || 1.2,
                          textShadow: el.textShadow || "none",
                        }}
                        className="whitespace-pre-wrap w-full h-full flex items-center justify-center p-0.5"
                      >
                        {testMode
                          ? el.fieldKey === "groomName"
                            ? "Alexander"
                            : el.fieldKey === "brideName"
                            ? "Sophia"
                            : el.fieldKey === "connector"
                            ? "&"
                            : el.fieldKey === "coupleNames"
                            ? "Sophia & Alexander"
                            : el.fieldKey === "date"
                            ? "OCTOBER 30, 2026"
                            : el.fieldKey === "time"
                            ? "4:30 PM"
                            : el.fieldKey === "venue"
                            ? "ELAMBA MUDAKKAL PALACE"
                            : el.text || "Text Layer"
                          : el.text || "Text Layer"}
                      </div>
                    )}

                    {/* ── LOCKED PILL BADGE ON CANVAS (WHEN SELECTED VIA LAYERS PANEL) ── */}
                    {isSelected && el.isLocked && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-40 whitespace-nowrap">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Locked Layer</span>
                      </div>
                    )}

                    {/* ── 8-POINT INTERACTIVE RESIZE & ROTATE HANDLES (ONLY WHEN UNLOCKED & SELECTED) ── */}
                    {isSelected && !el.isLocked && (
                      <>
                        {/* Top-Left Handle */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "nw", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "nw", el)}
                          className="absolute -top-2 -left-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#991B1B] shadow-sm cursor-nwse-resize hover:scale-125 transition-transform z-30"
                        />

                        {/* Top-Right Handle */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "ne", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "ne", el)}
                          className="absolute -top-2 -right-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#991B1B] shadow-sm cursor-nesw-resize hover:scale-125 transition-transform z-30"
                        />

                        {/* Bottom-Left Handle */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "sw", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "sw", el)}
                          className="absolute -bottom-2 -left-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#991B1B] shadow-sm cursor-nesw-resize hover:scale-125 transition-transform z-30"
                        />

                        {/* Bottom-Right Handle */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "se", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "se", el)}
                          className="absolute -bottom-2 -right-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#991B1B] shadow-sm cursor-nwse-resize hover:scale-125 transition-transform z-30"
                        />

                        {/* Edge Middle Handles */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "n", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "n", el)}
                          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2 rounded-full bg-white border border-[#991B1B] cursor-ns-resize z-30"
                        />
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "s", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "s", el)}
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2 rounded-full bg-white border border-[#991B1B] cursor-ns-resize z-30"
                        />
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "w", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "w", el)}
                          className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-4 rounded-full bg-white border border-[#991B1B] cursor-ew-resize z-30"
                        />
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "e", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "e", el)}
                          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-4 rounded-full bg-white border border-[#991B1B] cursor-ew-resize z-30"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── FLOATING ZOOM & VIEW CONTROLS (BOTTOM CENTER) ── */}
          <div className="absolute bottom-16 lg:bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3 py-1.5 shadow-xl flex items-center gap-2 z-30 text-xs font-bold text-slate-700 select-none">
            {/* Zoom Out Button */}
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(0.3, Math.round((prev - 0.1) * 10) / 10))}
              className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title="Zoom Out (-10%)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Percentage Display */}
            <button
              type="button"
              onClick={handleFitToScreen}
              className="w-12 text-center text-[11px] font-extrabold text-slate-900 font-mono hover:text-[#991B1B] cursor-pointer"
              title="Click to auto-fit to screen"
            >
              {Math.round(zoom * 100)}%
            </button>

            {/* Zoom In Button */}
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(2.0, Math.round((prev + 0.1) * 10) / 10))}
              className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title="Zoom In (+10%)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-0.5" />

            {/* Fit to Screen Button */}
            <button
              type="button"
              onClick={handleFitToScreen}
              className="px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-[#991B1B] text-[10px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer border border-red-200"
              title="Auto-Fit Full Card on Screen (No Scrolling)"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fit Screen</span>
            </button>

            {/* 100% Zoom Button */}
            <button
              type="button"
              onClick={() => setZoom(1.0)}
              className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              title="100% Actual Pixel Size"
            >
              100%
            </button>
          </div>
        </main>

        {/* ── MINIMAL FLOATING CARD THUMBNAILS STACK (DESKTOP DOCKED STRIP) ── */}
        <div className="hidden md:flex w-14 sm:w-16 h-full flex-col items-center shrink-0 py-4 px-0.5 z-10 select-none overflow-y-auto custom-scrollbar border-l border-slate-100 bg-slate-50/40">
          <div className="flex flex-col items-center gap-3 w-full">
            {cardLayers.map((layer, idx) => {
              const isSelected = layer.id === activeLayerId;
              const lDim = getLayerDimensions(layer, baseLayer);

              // Compact thumbnail calculation (max bounded box: 38px W, 54px H)
              const maxThumbW = 38;
              const maxThumbH = 54;
              const scale = Math.min(maxThumbW / lDim.width, maxThumbH / lDim.height);
              const thumbW = Math.max(24, Math.round(lDim.width * scale));
              const thumbH = Math.max(24, Math.round(lDim.height * scale));

              return (
                <div
                  key={layer.id}
                  onClick={() => {
                    setActiveLayerId(layer.id);
                    setSelectedElementId(null);
                  }}
                  className="flex flex-col items-center gap-0.5 w-full cursor-pointer group relative"
                >
                  {/* Proportional Card Frame (With Active Red Selection Handles) */}
                  <div className="relative p-1 flex items-center justify-center">
                    <div
                      style={{
                        width: `${thumbW}px`,
                        height: `${thumbH}px`,
                        backgroundColor:
                          layer.backgroundColor && (layer.backgroundColor.startsWith("#") || layer.backgroundColor.startsWith("rgb"))
                            ? layer.backgroundColor
                            : undefined,
                        backgroundImage: layer.backgroundImage
                          ? `url(${layer.backgroundImage})`
                          : layer.backgroundColor && layer.backgroundColor.includes("gradient")
                          ? layer.backgroundColor
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      className={`rounded-sm overflow-hidden transition-all relative select-none ${
                        isSelected
                          ? "opacity-100 border border-[#991B1B] shadow-xs bg-white"
                          : "opacity-45 hover:opacity-85 border border-slate-200 bg-white"
                      }`}
                    >
                      {/* Mini Thumbnail Elements */}
                      {layer.elements.map((el) => (
                        <div
                          key={el.id}
                          style={{
                            position: "absolute",
                            left: `${el.x}%`,
                            top: `${el.y}%`,
                            width: `${el.width}%`,
                            height: el.height ? `${el.height}%` : "auto",
                            transform: `rotate(${el.rotation || 0}deg)`,
                            opacity: 0.85,
                          }}
                          className="pointer-events-none"
                        >
                          {el.type === "image" && el.src && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={el.src} alt="" className="w-full h-full object-contain" />
                          )}
                          {el.type === "text" && (
                            <div
                              style={{
                                fontSize: "3.5px",
                                color: el.color || "#1E293B",
                                textAlign: el.textAlign || "center",
                              }}
                              className="truncate font-sans leading-none"
                            >
                              {el.text}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Delete Button for Non-Base Layers */}
                    {cardLayers.length > 1 && !layer.isBase && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLayer(layer.id);
                        }}
                        className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white hover:bg-[#991B1B] text-slate-400 hover:text-white border border-slate-300 hover:border-[#991B1B] flex items-center justify-center shadow-xs transition-all z-40 cursor-pointer ${
                          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                        title={`Delete "${layer.name}"`}
                      >
                        <Trash2 className="w-2 h-2" />
                      </button>
                    )}
                  </div>

                  {/* Thumbnail Info */}
                  <div className="text-center w-full px-0.5">
                    <span
                      className={`text-[8px] truncate block max-w-[48px] ${
                        isSelected ? "text-[#991B1B] font-black" : "text-slate-500 font-medium"
                      }`}
                    >
                      {layer.name}
                    </span>
                    <span className="text-[7.5px] text-slate-400 font-mono block">
                      {layer.isBase ? "Base" : `${layer.heightPercent}%`}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* + Add Button Below Thumbnails (Compact Round Icon) */}
            <button
              type="button"
              onClick={handleAddLayer}
              className="w-6 h-6 rounded-full bg-white hover:bg-red-50 border border-slate-300 hover:border-[#991B1B] text-slate-600 hover:text-[#991B1B] flex items-center justify-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group mt-0.5"
              title="Add another card layer (e.g. Insert / RSVP / Program)"
            >
              <Plus className="w-3 h-3 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── MOBILE BACKDROP FOR RIGHT INSPECTOR ── */}
        {mobileRightOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileRightOpen(false)}
          />
        )}

        {/* ── RIGHT INSPECTOR PANEL (TYPOGRAPHY & POSITION) ── */}
        <aside
          data-lenis-prevent
          className={`fixed inset-y-0 right-0 z-50 w-[88vw] max-w-sm bg-white shadow-2xl transition-transform duration-200 flex flex-col border-l border-slate-200 shrink-0 overscroll-contain lg:static lg:z-10 lg:w-80 lg:translate-x-0 lg:shadow-xs ${
            mobileRightOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Mobile Inspector Drawer Header */}
          <div className="lg:hidden p-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <span className="font-extrabold text-xs flex items-center gap-1.5">
              <span>⚙️</span> Layer Inspector
            </span>
            <button
              type="button"
              onClick={() => setMobileRightOpen(false)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {selectedElement ? (
            <div className="flex-1 min-h-0 flex flex-col">
              {/* Header with Layer Actions */}
              <div className="shrink-0 p-3.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-[#991B1B] uppercase tracking-wider text-[11px]">
                  {selectedElement.type === "text" ? "✍️ Typography & Text" : "🖼️ Image Layer Inspector"}
                </span>
                <div className="flex items-center gap-1.5">
                  {/* Lock / Unlock Toggle */}
                  <button
                    type="button"
                    onClick={() => updateSelectedElement({ isLocked: !selectedElement.isLocked })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
                      selectedElement.isLocked
                        ? "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                    }`}
                    title={selectedElement.isLocked ? "Unlock Layer" : "Lock Layer (Click to freeze position)"}
                  >
                    {selectedElement.isLocked ? (
                      <Lock className="w-3 h-3 text-amber-800" />
                    ) : (
                      <Unlock className="w-3 h-3 text-slate-500" />
                    )}
                    <span>{selectedElement.isLocked ? "Locked" : "Lock"}</span>
                  </button>

                  <button
                    onClick={() => handleDuplicateElement(selectedElement.id)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Duplicate Layer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteElement(selectedElement.id)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#991B1B] transition-colors cursor-pointer"
                    title="Delete Layer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Inspector Body */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
                
                {/* 🔒 LOCKED BANNER NOTIFICATION */}
                {selectedElement.isLocked && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        Layer is Locked
                      </span>
                      <button
                        type="button"
                        onClick={() => updateSelectedElement({ isLocked: false })}
                        className="text-[10px] font-extrabold text-[#991B1B] hover:underline cursor-pointer"
                      >
                        Unlock Now
                      </button>
                    </div>
                    <p className="text-[10px] text-amber-700 leading-normal">
                      This element cannot be clicked or moved directly on the canvas. You can style it here or unlock it to drag.
                    </p>
                  </div>
                )}

                {/* ── TYPOGRAPHY CONTROLS (PLACED FIRST FOR TEXT LAYERS) ── */}
                {selectedElement.type === "text" && (
                  <div className="space-y-4">
                    {/* Layer Text Content */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">Layer Text</label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleTransformCase("upper")}
                            className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold cursor-pointer"
                            title="Convert to UPPERCASE"
                          >
                            AA
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTransformCase("title")}
                            className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold cursor-pointer"
                            title="Convert to Title Case"
                          >
                            Aa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTransformCase("lower")}
                            className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold cursor-pointer"
                            title="Convert to lowercase"
                          >
                            aa
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={selectedElement.text || ""}
                        onChange={(e) => updateSelectedElement({ text: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#991B1B] text-xs leading-relaxed"
                      />
                    </div>

                    {/* Personalization Field Mapping */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">User Personalization Field</label>
                      <select
                        value={selectedElement.fieldKey || "customText"}
                        onChange={(e) => updateSelectedElement({ fieldKey: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none font-medium text-xs focus:border-[#991B1B]"
                      >
                        <option value="groomName">🤵 Groom Name (e.g. Alexander)</option>
                        <option value="brideName">👰 Bride Name (e.g. Sophia)</option>
                        <option value="connector">💍 Connector (e.g. &amp; / WEDS / and)</option>
                        <option value="coupleNames">👑 Combined Couple Names (e.g. Groom &amp; Bride)</option>
                        <option value="tagline">📜 Tagline (e.g. Together with their families)</option>
                        <option value="inviteLine">💌 Invite Line (e.g. Request the pleasure of...)</option>
                        <option value="date">📅 Wedding Date (e.g. OCTOBER 30, 2026)</option>
                        <option value="time">⏰ Event Time (e.g. 6:30 PM)</option>
                        <option value="venue">🏛️ Venue Name (e.g. Grand Ballroom)</option>
                        <option value="address">📍 Address (e.g. MG Road, Kerala)</option>
                        <option value="rsvp">📱 RSVP Contact (e.g. +91 98765 43210)</option>
                        <option value="parentsLine">👪 Parents / Family Line</option>
                        <option value="customText">🔤 Static Text (No replacement)</option>
                      </select>
                    </div>

                    {/* Font Family Selector (With Categorized Groups) */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Font Family</label>
                      <select
                        value={selectedElement.fontFamily || "'Cinzel', serif"}
                        onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#991B1B] text-xs"
                      >
                        {FONT_CATEGORIES.map((cat, idx) => (
                          <optgroup key={idx} label={`── ${cat.category} ──`}>
                            {cat.fonts.map((f, fIdx) => (
                              <option key={fIdx} value={f.family}>
                                {f.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {/* Font Size with Stepper & Slider */}
                    <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">Font Size</label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedElement({
                                fontSize: Math.max(8, (selectedElement.fontSize || 16) - 2),
                              })
                            }
                            className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center font-bold text-slate-900">
                            {selectedElement.fontSize || 16}px
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedElement({
                                fontSize: Math.min(120, (selectedElement.fontSize || 16) + 2),
                              })
                            }
                            className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={8}
                        max={100}
                        value={selectedElement.fontSize || 16}
                        onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) })}
                        className="w-full accent-[#991B1B]"
                      />
                    </div>

                    {/* Font Weight & Styling */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800">Font Weight &amp; Style</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { label: "Light", weight: "300" },
                          { label: "Regular", weight: "400" },
                          { label: "SemiBold", weight: "600" },
                          { label: "Bold", weight: "700" },
                        ].map((w) => (
                          <button
                            key={w.weight}
                            type="button"
                            onClick={() => updateSelectedElement({ fontWeight: w.weight })}
                            className={`py-1.5 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                              (selectedElement.fontWeight || "400") === w.weight
                                ? "bg-[#991B1B] text-white border-[#991B1B]"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedElement({
                              fontStyle: selectedElement.fontStyle === "italic" ? "normal" : "italic",
                            })
                          }
                          className={`flex-1 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                            selectedElement.fontStyle === "italic"
                              ? "bg-[#991B1B] text-white border-[#991B1B]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <Italic className="w-3.5 h-3.5" />
                          <span>Italic</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedElement({
                              textDecoration:
                                selectedElement.textDecoration === "underline" ? "none" : "underline",
                            })
                          }
                          className={`flex-1 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                            selectedElement.textDecoration === "underline"
                              ? "bg-[#991B1B] text-white border-[#991B1B]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <Underline className="w-3.5 h-3.5" />
                          <span>Underline</span>
                        </button>
                      </div>
                    </div>

                    {/* Text Color, Solid & Metallic Gradients */}
                    <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">Text Color &amp; Foil</label>
                        {selectedElement.gradient ? (
                          <button
                            onClick={() => updateSelectedElement({ gradient: undefined })}
                            className="text-[10px] font-bold text-[#991B1B] hover:underline cursor-pointer"
                          >
                            Clear Gradient
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedElement.color || "#1E293B"}
                              onChange={(e) => updateSelectedElement({ color: e.target.value, gradient: undefined })}
                              className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-0"
                            />
                            <input
                              type="text"
                              value={selectedElement.color || "#1E293B"}
                              onChange={(e) => updateSelectedElement({ color: e.target.value, gradient: undefined })}
                              className="w-20 p-1 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px] uppercase text-center"
                            />
                          </div>
                        )}
                      </div>

                      {/* Quick Palette Swatches */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {LUXURY_PALETTE.map((pal, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => updateSelectedElement({ color: pal.color, gradient: undefined })}
                            style={{ backgroundColor: pal.color }}
                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-115 cursor-pointer shadow-2xs ${
                              selectedElement.color === pal.color && !selectedElement.gradient
                                ? "border-[#991B1B] ring-2 ring-red-200"
                                : "border-white"
                            }`}
                            title={pal.name}
                          />
                        ))}
                      </div>

                      {/* Metallic Text Gradient Presets */}
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[10px] font-bold text-slate-700 block mb-1.5">
                          ✨ Metallic Text Foil Gradients
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {TEXT_GRADIENTS.map((g, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => updateSelectedElement({ gradient: g.value })}
                              className={`py-1 px-1.5 rounded-lg border text-[9px] font-bold truncate transition-colors text-center cursor-pointer ${
                                selectedElement.gradient === g.value
                                  ? "bg-[#991B1B] text-white border-[#991B1B]"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {g.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Alignment & Letter Spacing */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800">Alignment</label>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          {(["left", "center", "right"] as const).map((align) => (
                            <button
                              key={align}
                              type="button"
                              onClick={() => updateSelectedElement({ textAlign: align })}
                              className={`flex-1 py-1 rounded text-center font-bold text-[10px] uppercase transition-colors cursor-pointer ${
                                (selectedElement.textAlign || "center") === align
                                  ? "bg-[#991B1B] text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-800">
                          Letter Spacing ({selectedElement.letterSpacing || 0}px)
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={12}
                          value={selectedElement.letterSpacing || 0}
                          onChange={(e) =>
                            updateSelectedElement({ letterSpacing: Number(e.target.value) })
                          }
                          className="w-full accent-[#991B1B]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── IMAGE SPECIFIC CONTROLS ── */}
                {selectedElement.type === "image" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedElement.src}
                        alt="Selected"
                        className="h-24 w-full object-contain mx-auto"
                      />
                    </div>
                  </div>
                )}

                {/* ── LAYOUT, POSITION & CORNER SNAP CONTROLS ── */}
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  {/* Quick Corner Snap Grid */}
                  <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider block">
                      Quick Position &amp; Corner Snap
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("tl")}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-700 text-[10px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shadow-2xs disabled:opacity-50"
                        title="Snap to Top-Left Corner"
                      >
                        <CornerUpLeft className="w-3.5 h-3.5 text-[#991B1B]" />
                        <span>Top-L</span>
                      </button>

                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("tr")}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-700 text-[10px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shadow-2xs disabled:opacity-50"
                        title="Snap to Top-Right Corner"
                      >
                        <CornerUpRight className="w-3.5 h-3.5 text-[#991B1B]" />
                        <span>Top-R</span>
                      </button>

                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("bl")}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-700 text-[10px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shadow-2xs disabled:opacity-50"
                        title="Snap to Bottom-Left Corner"
                      >
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#991B1B]" />
                        <span>Btm-L</span>
                      </button>

                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("br")}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-700 text-[10px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shadow-2xs disabled:opacity-50"
                        title="Snap to Bottom-Right Corner"
                      >
                        <CornerDownRight className="w-3.5 h-3.5 text-[#991B1B]" />
                        <span>Btm-R</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("centerH")}
                        className="py-1 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold text-center cursor-pointer disabled:opacity-50"
                      >
                        Center ↔
                      </button>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("centerV")}
                        className="py-1 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold text-center cursor-pointer disabled:opacity-50"
                      >
                        Center ↕
                      </button>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("center")}
                        className="py-1 px-2 rounded-lg bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-700 text-[10px] font-bold text-center cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <Crosshair className="w-3 h-3 text-[#991B1B]" />
                        <span>Center</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Scale (Big / Small) Buttons */}
                  <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider block">
                      Quick Scale (Resize Box)
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleQuickScale(-20)}
                        className="py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        -20%
                      </button>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleQuickScale(-10)}
                        className="py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        -10%
                      </button>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleQuickScale(10)}
                        className="py-1.5 rounded-lg bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-900 font-bold text-[11px] cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        +10%
                      </button>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleQuickScale(20)}
                        className="py-1.5 rounded-lg bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-900 font-bold text-[11px] cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        +20%
                      </button>
                    </div>
                  </div>

                  {/* Dimensions (Width % & Height %) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Width ({selectedElement.width}%)</label>
                      <input
                        type="range"
                        min={5}
                        max={120}
                        disabled={selectedElement.isLocked}
                        value={selectedElement.width}
                        onChange={(e) => updateSelectedElement({ width: Number(e.target.value) })}
                        className="w-full accent-[#991B1B] disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Height ({selectedElement.height || 20}%)</label>
                      <input
                        type="range"
                        min={5}
                        max={120}
                        disabled={selectedElement.isLocked}
                        value={selectedElement.height || 20}
                        onChange={(e) => updateSelectedElement({ height: Number(e.target.value) })}
                        className="w-full accent-[#991B1B] disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Rotation & Flips */}
                  <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800">Rotation ({selectedElement.rotation || 0}°)</label>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() =>
                          updateSelectedElement({ rotation: ((selectedElement.rotation || 0) + 90) % 360 })
                        }
                        className="text-[10px] font-bold text-[#991B1B] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>+90°</span>
                      </button>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      disabled={selectedElement.isLocked}
                      value={selectedElement.rotation || 0}
                      onChange={(e) => updateSelectedElement({ rotation: Number(e.target.value) })}
                      className="w-full accent-[#991B1B] disabled:opacity-50"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => updateSelectedElement({ flipH: !selectedElement.flipH })}
                        className={`flex-1 py-1 px-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50 ${
                          selectedElement.flipH
                            ? "bg-[#991B1B] text-white border-[#991B1B]"
                            : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        <FlipHorizontal className="w-3 h-3" />
                        <span>Flip H</span>
                      </button>

                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => updateSelectedElement({ flipV: !selectedElement.flipV })}
                        className={`flex-1 py-1 px-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50 ${
                          selectedElement.flipV
                            ? "bg-[#991B1B] text-white border-[#991B1B]"
                            : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        <FlipVertical className="w-3 h-3" />
                        <span>Flip V</span>
                      </button>
                    </div>
                  </div>

                  {/* Common Layer Controls: Opacity & Position */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800">
                      Layer Opacity ({Math.round((selectedElement.opacity ?? 1) * 100)}%)
                    </label>
                    <input
                      type="range"
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={selectedElement.opacity ?? 1}
                      onChange={(e) => updateSelectedElement({ opacity: Number(e.target.value) })}
                      className="w-full accent-[#991B1B]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-bold text-slate-700">No Layer Selected</p>
              <p className="text-[11px] leading-relaxed">
                Click on any text or graphic element on the canvas to customize its font, size, groom/bride fields, position, and colors.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION TOOLBAR (VISIBLE ON < LG) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 flex items-center justify-around px-1 shadow-lg">
        <button
          type="button"
          onClick={() => {
            setActiveTab("SETTINGS");
            setMobileLeftOpen(true);
            setMobileRightOpen(false);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors cursor-pointer ${
            mobileLeftOpen && activeTab === "SETTINGS" ? "text-[#991B1B] bg-red-50" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Canvas</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("TEXT");
            setMobileLeftOpen(true);
            setMobileRightOpen(false);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors cursor-pointer ${
            mobileLeftOpen && activeTab === "TEXT" ? "text-[#991B1B] bg-red-50" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Text</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("ASSETS");
            setMobileLeftOpen(true);
            setMobileRightOpen(false);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors cursor-pointer ${
            mobileLeftOpen && activeTab === "ASSETS" ? "text-[#991B1B] bg-red-50" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>PNGs</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("LAYERS");
            setMobileLeftOpen(true);
            setMobileRightOpen(false);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors cursor-pointer ${
            mobileLeftOpen && activeTab === "LAYERS" ? "text-[#991B1B] bg-red-50" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Layers</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMobileRightOpen(!mobileRightOpen);
            setMobileLeftOpen(false);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold relative transition-colors cursor-pointer ${
            mobileRightOpen ? "text-[#991B1B] bg-red-50" : selectedElement ? "text-amber-800 bg-amber-50" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Inspector</span>
          {selectedElement && (
            <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-[#991B1B] ring-2 ring-white" />
          )}
        </button>
      </div>

      {/* ── PRICING TIER BREAKDOWN MODAL ── */}
      {showPricingModal && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl border-2 border-red-100 shadow-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-red-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#991B1B] flex items-center justify-center font-bold text-sm">
                  ₹
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Volume Tier Pricing Calculator
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Based on Base Rate: <strong>₹{pricePerCard}/card</strong> for 1000+ prints
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPricingModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Editable Base Rate inside Modal */}
            <div className="bg-red-50/60 border border-red-200 p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Base Price (1000+ Prints)</span>
                <span className="text-[10px] text-slate-500">Catalog standard minimum price per unit</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-extrabold text-[#991B1B]">₹</span>
                <input
                  type="number"
                  min={1}
                  value={pricePerCard}
                  onChange={(e) => setPricePerCard(Math.max(1, Number(e.target.value) || 0))}
                  className="w-20 p-1.5 bg-white border border-red-200 focus:border-[#991B1B] rounded-xl text-xs font-extrabold text-slate-900 text-center outline-none"
                />
              </div>
            </div>

            {/* Complete Tier Table */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                Calculated Price Matrix for Customers:
              </span>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                {CARD_PRICING_TIERS.map((tier, idx) => {
                  const sampleQty = tier.min;
                  const calc = calculateTieredCardPrice(pricePerCard, sampleQty, false);
                  return (
                    <div
                      key={idx}
                      className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <strong className="text-slate-900 font-bold block">{tier.label}</strong>
                        <span className="text-[10px] text-slate-500">
                          {tier.max ? `${tier.min} to ${tier.max} copies` : "1000+ copies"}
                        </span>
                      </div>
                      <div className="text-right space-y-0.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            +{tier.markupPercent}%
                          </span>
                          <strong className="text-[#991B1B] font-extrabold font-mono text-sm">
                            ₹{calc.unitPrice} <span className="text-[10px] font-normal text-slate-500">/card</span>
                          </strong>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Example {sampleQty} cards: ₹{calc.totalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPricingModal(false)}
                className="w-full py-2.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Done &amp; Apply Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCanvaTemplateBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-[#991B1B] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-[#991B1B] uppercase tracking-wider">
            Loading Canva Template Studio...
          </p>
        </div>
      }
    >
      <CanvaTemplateBuilderInner />
    </Suspense>
  );
}
