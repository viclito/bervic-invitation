"use client";

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
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
  EyeOff,
  Ruler,
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
  Bold,
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
  FolderKanban,
  LayoutGrid,
  IndianRupee,
  Tag,
  Zap,
  Download,
  ShoppingCart,
  Share2,
  Search,
} from "lucide-react";
import { calculateTieredCardPrice, CARD_PRICING_TIERS } from "@/lib/pricing";
import OrderOrCartModal from "@/components/cart/OrderOrCartModal";
import {
  WEDDING_TEXT_PRESETS,
  CATEGORY_ICONS,
  type TextPresetCategory,
  type TextPresetItem,
} from "@/data/canvaTextPresets";

export { WEDDING_TEXT_PRESETS, CATEGORY_ICONS };
export type { TextPresetCategory, TextPresetItem };

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
  isHidden?: boolean;
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

export interface UserUploadedAsset {
  id: string;
  url: string;
  name?: string;
  createdAt?: string;
  isGuest?: boolean;
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

export function getPhysicalDimensions(
  layer: CardDeckLayer,
  baseLayer?: CardDeckLayer
): {
  pixelW: number;
  pixelH: number;
  widthInches: string;
  heightInches: string;
  widthMm: string;
  heightMm: string;
  pct: number;
  ratioStr: string;
} {
  const basePg = baseLayer || layer;
  const lDim = getLayerDimensions(layer, basePg);
  const bDim = getLayerDimensions(basePg, basePg);
  const pct = layer.isBase ? 100 : layer.heightPercent || 85;

  // Reference standard 5" x 7" base card
  const widthInches = ((lDim.width / bDim.width) * 5.0).toFixed(2);
  const heightInches = ((lDim.height / bDim.height) * 7.0).toFixed(2);
  const widthMm = Math.round((lDim.width / bDim.width) * 127);
  const heightMm = Math.round((lDim.height / bDim.height) * 178);

  return {
    pixelW: lDim.width,
    pixelH: lDim.height,
    widthInches: `${widthInches}"`,
    heightInches: `${heightInches}"`,
    widthMm: `${widthMm} mm`,
    heightMm: `${heightMm} mm`,
    pct,
    ratioStr: lDim.ratioStr,
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

export default function CanvaUserStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const templateParam = searchParams.get("template") || searchParams.get("id");
  const orderIdParam = searchParams.get("orderId");
  const itemIdParam = searchParams.get("itemId");

  // Template / Card Metadata & Gallery State
  const [currentCardId, setCurrentCardId] = useState<string | null>(searchParams.get("id") || null);
  const [docTitle, setDocTitle] = useState("My Wedding Invitation");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusToast, setStatusToast] = useState("");

  // User Saved Cards & Projects Gallery State
  const [userSavedCards, setUserSavedCards] = useState<any[]>([]);
  const [isLoadingSavedCards, setIsLoadingSavedCards] = useState(true);
  const [showGalleryView, setShowGalleryView] = useState(false);

  // Text Presets Search & Filter State (200+ Presets)
  const [textSearchQuery, setTextSearchQuery] = useState("");
  const [selectedTextCategory, setSelectedTextCategory] = useState("All");

  // Create New Card Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createCardTitle, setCreateCardTitle] = useState("My Wedding Invitation");
  const [createRatio, setCreateRatio] = useState("classic");
  const [createDeckLayers, setCreateDeckLayers] = useState<number>(1);
  const [createTheme, setCreateTheme] = useState<{ bgMode: "solid" | "gradient" | "image" | "textures"; val: string }>({
    bgMode: "solid",
    val: "#FFFFFF",
  });
  const [createStarterStyle, setCreateStarterStyle] = useState<"blank" | "classic_names">("blank");

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
      backgroundColor: "#FFFFFF",
      backgroundImage: null,
      bgMode: "solid",
      elements: [],
    },
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>("layer-1");

  // Selection & UI State
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"SETTINGS" | "TEXT" | "ASSETS" | "LAYERS" | "TEMPLATES">("SETTINGS");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [testMode, setTestMode] = useState(false);
  const [zoom, setZoom] = useState<number>(0.9);
  const [scaleContentWithSize, setScaleContentWithSize] = useState<boolean>(true);
  const [stackAlign, setStackAlign] = useState<"bottom" | "top" | "center">("bottom");

  // Mobile App Native UI State
  type MobileSheetType =
    | null
    | "ADD"
    | "TEXT"
    | "ASSETS"
    | "SETTINGS"
    | "LAYERS"
    | "TEMPLATES"
    | "INSPECTOR_TEXT"
    | "INSPECTOR_FONT"
    | "INSPECTOR_SIZE"
    | "INSPECTOR_COLOR"
    | "INSPECTOR_STYLE"
    | "INSPECTOR_OPACITY";

  const [mobileSheet, setMobileSheet] = useState<MobileSheetType>(null);
  const [mobileAddTab, setMobileAddTab] = useState<"text" | "presets" | "assets" | "shapes">("text");
  const [mobileSettingsTab, setMobileSettingsTab] = useState<"bg" | "format">("bg");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);
  const [isDeckBarMinimized, setIsDeckBarMinimized] = useState(false);

  // Modals
  const [showStackModal, setShowStackModal] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Pricing & Database Templates
  const [pricePerCard, setPricePerCard] = useState<number>(30);
  const [minCopies, setMinCopies] = useState<number>(50);
  const [dynamicTemplates, setDynamicTemplates] = useState<any[]>([]);
  // User Assets (Private to this user's account) & Curated Stock Motifs
  const [userAssets, setUserAssets] = useState<UserUploadedAsset[]>([]);
  const [isLoadingUserAssets, setIsLoadingUserAssets] = useState(false);
  const [stockMotifs, setStockMotifs] = useState<string[]>([
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
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);

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

  // Deck Layer / Sheet Navigation
  const activeLayerIndex = Math.max(0, cardLayers.findIndex((l) => l.id === activeLayerId));
  const handleNextSheet = () => {
    if (activeLayerIndex < cardLayers.length - 1) {
      setActiveLayerId(cardLayers[activeLayerIndex + 1].id);
      setSelectedElementId(null);
    }
  };
  const handlePrevSheet = () => {
    if (activeLayerIndex > 0) {
      setActiveLayerId(cardLayers[activeLayerIndex - 1].id);
      setSelectedElementId(null);
    }
  };

  // Categorized Wedding Typography Presets (200+ Presets) Filter & Search
  const allTextCategories = useMemo(() => {
    return ["All", ...WEDDING_TEXT_PRESETS.map((c) => c.category)];
  }, []);

  const filteredTextPresets = useMemo(() => {
    const q = textSearchQuery.trim().toLowerCase();
    return WEDDING_TEXT_PRESETS.map((cat) => {
      if (selectedTextCategory !== "All" && cat.category !== selectedTextCategory) {
        return { ...cat, items: [] };
      }
      if (!q) return cat;
      const matchedItems = cat.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.text.toLowerCase().includes(q) ||
          cat.category.toLowerCase().includes(q)
      );
      return { ...cat, items: matchedItems };
    }).filter((cat) => cat.items.length > 0);
  }, [textSearchQuery, selectedTextCategory]);

  const totalFilteredPresetsCount = useMemo(() => {
    return filteredTextPresets.reduce((sum, cat) => sum + cat.items.length, 0);
  }, [filteredTextPresets]);

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

  const setElements = (
    updater: CanvasElement[] | ((prev: CanvasElement[]) => CanvasElement[]),
    record: boolean = true
  ) => {
    setCardLayers((prev) => {
      const updated = prev.map((l) => {
        if (l.id !== activeLayer.id) return l;
        const newElements = typeof updater === "function" ? updater(l.elements) : updater;
        return { ...l, elements: newElements };
      });
      if (record) {
        recordHistory(updated);
      }
      return updated;
    });
  };

  const updateSelectedElement = (updates: Partial<CanvasElement>, record: boolean = true) => {
    if (!selectedElementId) return;
    setElements(
      (prev) => prev.map((el) => (el.id === selectedElementId ? { ...el, ...updates } : el)),
      record
    );
  };

  const updateElementById = (id: string, updates: Partial<CanvasElement>, record: boolean = true) => {
    setElements(
      (prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)),
      record
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
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    const padH = isMobile ? 100 : 130;
    const padW = isMobile ? 24 : 70;
    const containerH = containerRef.current.clientHeight - padH;
    const containerW = containerRef.current.clientWidth - padW;
    const scaleH = containerH / activeDimensions.height;
    const scaleW = containerW / activeDimensions.width;
    const fitScale = Math.min(scaleH, scaleW, 1.0);
    setZoom(Math.max(0.25, Math.round(fitScale * 100) / 100));
  }, [activeDimensions.height, activeDimensions.width]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleFitToScreen();
    }, 120);
    return () => clearTimeout(timer);
  }, [activeLayerId, activeLayer.aspectRatio, activeLayer.heightPercent, handleFitToScreen]);

  useEffect(() => {
    const onResize = () => handleFitToScreen();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [handleFitToScreen]);

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

        // Load curated stock graphic assets
        fetch("/api/canva/assets")
          .then((r) => r.json())
          .then((d) => {
            if (d.assets && Array.isArray(d.assets) && d.assets.length > 0) {
              setStockMotifs((prev) => Array.from(new Set([...d.assets, ...prev])));
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

  // Load user assets strictly for current user / local device
  useEffect(() => {
    let isMounted = true;
    async function fetchUserAssets() {
      setIsLoadingUserAssets(true);
      try {
        const res = await fetch("/api/user/assets");
        const d = await res.json();
        if (isMounted && d.success && Array.isArray(d.assets)) {
          if (session?.user?.email) {
            setUserAssets(d.assets);
          } else {
            // Guest user: load from localStorage
            const stored = localStorage.getItem("bervic_canva_guest_assets");
            if (stored) {
              try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) setUserAssets(parsed);
              } catch {}
            }
          }
        }
      } catch (err) {
        console.warn("Failed to load user assets:", err);
      } finally {
        if (isMounted) setIsLoadingUserAssets(false);
      }
    }
    fetchUserAssets();
    return () => {
      isMounted = false;
    };
  }, [session?.user?.email]);

  // Open / Load a saved card into studio
  const handleOpenSavedCard = useCallback((card: any) => {
    setCurrentCardId(card.id === "guest-draft" ? null : card.id);
    setDocTitle(card.templateName || "My Wedding Invitation");
    let parsed: any = null;
    try {
      parsed = typeof card.cardDataJson === "string" ? JSON.parse(card.cardDataJson) : card.cardDataJson;
    } catch {}

    if (parsed?.cardLayers && Array.isArray(parsed.cardLayers) && parsed.cardLayers.length > 0) {
      setCardLayers(parsed.cardLayers);
      setActiveLayerId(parsed.cardLayers[0]?.id || "layer-1");
    }

    setShowGalleryView(false);
    setHasUnsavedChanges(false);

    if (card.id && card.id !== "guest-draft" && typeof window !== "undefined") {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("id", card.id);
      window.history.replaceState({}, "", newUrl.toString());
    }

    setStatusToast(`📂 Opened "${card.templateName || "Invitation Card"}"`);
    setTimeout(() => setStatusToast(""), 3000);
  }, []);

  // Delete saved card from gallery
  const handleDeleteSavedCard = async (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this saved invitation card?")) return;

    if (cardId === "guest-draft") {
      try {
        localStorage.removeItem("canva_user_card_draft");
      } catch {}
      setUserSavedCards((prev) => {
        const updated = prev.filter((c) => c.id !== cardId);
        if (updated.length === 0) {
          setShowGalleryView(false);
          setShowCreateModal(true);
        }
        return updated;
      });
      setStatusToast("🗑️ Deleted draft");
      setTimeout(() => setStatusToast(""), 3000);
      return;
    }

    try {
      const res = await fetch(`/api/user/cards?id=${cardId}`, { method: "DELETE" });
      if (res.ok) {
        setUserSavedCards((prev) => {
          const updated = prev.filter((c) => c.id !== cardId);
          if (updated.length === 0) {
            setShowGalleryView(false);
            setShowCreateModal(true);
          }
          return updated;
        });
        if (currentCardId === cardId) {
          setCurrentCardId(null);
        }
        setStatusToast("🗑️ Card deleted from your gallery");
        setTimeout(() => setStatusToast(""), 3000);
      } else {
        alert("Could not delete card. Please try again.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error deleting card.");
    }
  };

  // Duplicate saved card in gallery
  const handleDuplicateSavedCard = async (e: React.MouseEvent, card: any) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/user/cards/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateName: `${card.templateName || "Invitation Card"} (Copy)`,
          partnerOne: card.partnerOne || "Sophia",
          partnerTwo: card.partnerTwo || "Alexander",
          weddingDate: card.weddingDate || "October 30, 2026",
          cardDataJson: card.cardDataJson,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.card) {
          setUserSavedCards((prev) => [data.card, ...prev]);
          setStatusToast(`✨ Duplicated "${card.templateName || "Card"}"`);
          setTimeout(() => setStatusToast(""), 3000);
        }
      } else {
        alert("Failed to duplicate card.");
      }
    } catch (err) {
      console.error("Duplicate error:", err);
    }
  };

  // Preload saved user card or template if specified in query param, or check saved cards
  useEffect(() => {
    let active = true;

    if (searchParams.get("order") === "true") {
      setShowOrderModal(true);
    }

    async function checkCardsAndInit() {
      setIsLoadingSavedCards(true);
      try {
        // 1. Fetch user saved cards from API
        const res = await fetch("/api/user/cards");
        let cards: any[] = [];
        if (res.ok) {
          const data = await res.json();
          cards = data.cards || [];
        }

        // 2. If user is guest/local, check localStorage draft
        if (cards.length === 0 && typeof window !== "undefined") {
          try {
            const guestDraft = localStorage.getItem("canva_user_card_draft");
            if (guestDraft) {
              const parsed = JSON.parse(guestDraft);
              if (parsed?.cardLayers && parsed.cardLayers.length > 0) {
                cards = [
                  {
                    id: "guest-draft",
                    templateName: parsed.docTitle || "My Draft Invitation",
                    cardDataJson: guestDraft,
                    updatedAt: new Date().toISOString(),
                    isGuestDraft: true,
                  },
                ];
              }
            }
          } catch {}
        }

        if (!active) return;
        setUserSavedCards(cards);

        // 3. Direct template / card param in URL: load that card directly
        if (templateParam) {
          const matchedCard = cards.find((c) => c.id === templateParam);
          if (matchedCard) {
            handleOpenSavedCard(matchedCard);
            return;
          }

          try {
            const cardRes = await fetch(`/api/user/cards?id=${templateParam}`);
            if (cardRes.ok) {
              const cardData = await cardRes.json();
              if (cardData?.card) {
                handleOpenSavedCard(cardData.card);
                return;
              }
            }
          } catch {}

          // Check predefined canva templates
          try {
            const tplRes = await fetch("/api/canva/templates");
            const tplData = await tplRes.json();
            if (tplData.templates && Array.isArray(tplData.templates)) {
              const found = tplData.templates.find(
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
                      backgroundColor: found.backgroundColor || "#FFFFFF",
                      backgroundImage: found.backgroundImage || null,
                      bgMode: found.backgroundImage ? "image" : "textures",
                      elements: found.elements,
                    },
                  ]);
                }
              }
            }
          } catch {}
          return;
        }

        // 4. No specific card param in URL:
        if (cards.length === 0) {
          // User with NO saved invitations enters /canva:
          // Immediately prompt them to create a new card as they wish!
          setShowGalleryView(false);
          setShowCreateModal(true);
        } else {
          // User HAS created and saved card(s):
          // While opening the page, display the list of cards they designed & saved!
          setShowGalleryView(true);
          setShowCreateModal(false);
        }
      } catch (err) {
        console.warn("Failed to check saved cards:", err);
        if (active && !templateParam) {
          setShowCreateModal(true);
        }
      } finally {
        if (active) {
          setIsLoadingSavedCards(false);
        }
      }
    }

    checkCardsAndInit();

    return () => {
      active = false;
    };
  }, [templateParam, searchParams, handleOpenSavedCard]);

  // BRAND NEW FEATURE: CREATE NEW INVITATION CARD HANDLER
  const handleCreateNewCard = () => {
    const chosenRatioObj = ASPECT_RATIOS.find((r) => r.id === createRatio) || ASPECT_RATIOS[0];
    const baseW = chosenRatioObj.width;
    const baseH = chosenRatioObj.height;

    const layersCount = Math.max(1, Math.min(3, createDeckLayers));
    const newLayers: CardDeckLayer[] = [];

    // Base Layer
    const starterElements: CanvasElement[] =
      createStarterStyle === "classic_names"
        ? [
            {
              id: `starter-headline-${Date.now()}`,
              type: "text",
              text: "THE WEDDING CELEBRATION",
              fontFamily: "'Cinzel', serif",
              fontSize: 12,
              color: "#991B1B",
              fontWeight: "bold",
              letterSpacing: 4,
              textAlign: "center",
              x: 15,
              y: 8,
              width: 70,
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
        elements:
          createStarterStyle === "classic_names"
            ? [
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
              ]
            : [],
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
        elements:
          createStarterStyle === "classic_names"
            ? [
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
              ]
            : [],
      });
    }

    setDocTitle(createCardTitle.trim() || "My Wedding Invitation");
    setCardLayers(newLayers);
    setActiveLayerId("layer-1");
    setSelectedElementId(null);
    setSelectedIds([]);
    setCurrentCardId(null);
    setShowCreateModal(false);
    setShowGalleryView(false);
    if (typeof window !== "undefined") {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("id");
      cleanUrl.searchParams.delete("template");
      window.history.replaceState({}, "", cleanUrl.pathname);
    }
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
  const handleAddTextElement = (
    preset?: Partial<CanvasElement>,
    customPos?: { x: number; y: number; width?: number; height?: number }
  ) => {
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
      x: customPos?.x !== undefined ? customPos.x : 15,
      y: customPos?.y !== undefined ? customPos.y : 40,
      width: customPos?.width !== undefined ? customPos.width : 70,
      height: customPos?.height !== undefined ? customPos.height : 10,
      rotation: 0,
      opacity: 1,
      zIndex: activeLayer.elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newId);
  };

  const handleAddImageElement = (
    src: string,
    customPos?: { x: number; y: number; width?: number; height?: number }
  ) => {
    const newId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const w = customPos?.width || 50;
    const h = customPos?.height || 25;
    const x = customPos !== undefined ? customPos.x : 25;
    const y = customPos !== undefined ? customPos.y : 30;
    const newEl: CanvasElement = {
      id: newId,
      type: "image",
      src,
      x,
      y,
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      zIndex: activeLayer.elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newId);
    setHasUnsavedChanges(true);
  };

  const handleAddShapeElement = (
    shape: typeof PRESET_SHAPES[0],
    customPos?: { x: number; y: number }
  ) => {
    const newId = `shape-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newEl: CanvasElement = {
      id: newId,
      type: "shape",
      backgroundColor: shape.backgroundColor,
      opacity: shape.opacity,
      x: customPos !== undefined ? customPos.x : 30,
      y: customPos !== undefined ? customPos.y : 40,
      width: shape.width,
      height: shape.height,
      rotation: 0,
      zIndex: activeLayer.elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newId);
    setHasUnsavedChanges(true);
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

  // Image Upload Handler (Strictly scoped to user's account)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Try backend /api/user/assets to attach to user account
        let uploadedUrl = "";
        let assetId = "";
        try {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/user/assets", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.asset?.url) {
              uploadedUrl = data.asset.url;
              assetId = data.asset.id;
              const newAsset: UserUploadedAsset = {
                id: assetId || `asset-${Date.now()}`,
                url: uploadedUrl,
                name: data.asset.name || file.name,
                isGuest: data.isGuest,
              };
              setUserAssets((prev) => [newAsset, ...prev]);
              handleAddImageElement(uploadedUrl);

              if (data.isGuest) {
                try {
                  const stored = JSON.parse(localStorage.getItem("bervic_canva_guest_assets") || "[]");
                  localStorage.setItem(
                    "bervic_canva_guest_assets",
                    JSON.stringify([newAsset, ...stored.slice(0, 20)])
                  );
                } catch {}
              }
              continue;
            }
          }
        } catch (apiErr) {
          console.warn("Backend user asset upload failed, using local FileReader:", apiErr);
        }

        // 2. Fallback to local FileReader if backend or Cloudinary is unavailable
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const result = loadEvent.target?.result as string;
          if (result) {
            const fallbackAsset: UserUploadedAsset = {
              id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              url: result,
              name: file.name,
              isGuest: true,
            };
            setUserAssets((prev) => [fallbackAsset, ...prev]);
            handleAddImageElement(result);
            try {
              const stored = JSON.parse(localStorage.getItem("bervic_canva_guest_assets") || "[]");
              localStorage.setItem(
                "bervic_canva_guest_assets",
                JSON.stringify([fallbackAsset, ...stored.slice(0, 20)])
              );
            } catch {}
          }
        };
        reader.readAsDataURL(file);
      }
      setStatusToast("📷 Photo uploaded to your account");
      setTimeout(() => setStatusToast(""), 3500);
    } catch {
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Delete an asset from user's account
  const handleDeleteUserAsset = async (e: React.MouseEvent, assetId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this asset from your account?")) return;

    try {
      await fetch(`/api/user/assets?id=${assetId}`, { method: "DELETE" });
      setUserAssets((prev) => prev.filter((a) => a.id !== assetId));
      try {
        const stored = JSON.parse(localStorage.getItem("bervic_canva_guest_assets") || "[]");
        localStorage.setItem(
          "bervic_canva_guest_assets",
          JSON.stringify(stored.filter((a: any) => a.id !== assetId))
        );
      } catch {}
      setStatusToast("🗑️ Asset removed from your account");
      setTimeout(() => setStatusToast(""), 2500);
    } catch (err) {
      console.error("Failed to delete asset:", err);
    }
  };

  // Drag & drop element placement from sidebar onto canvas
  const handleDragStartAsset = (
    e: React.DragEvent,
    data:
      | { type: "image"; src: string; defaultWidth?: number; defaultHeight?: number }
      | { type: "shape"; shape: typeof PRESET_SHAPES[0] }
      | { type: "text"; preset: Partial<CanvasElement> }
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDropOnCanvas = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverCanvas(false);
    const rawData = e.dataTransfer.getData("application/json");
    if (!rawData) return;

    let data: any;
    try {
      data = JSON.parse(rawData);
    } catch {
      return;
    }

    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const rect = canvasEl.getBoundingClientRect();
    const dropXRatio = (e.clientX - rect.left) / rect.width;
    const dropYRatio = (e.clientY - rect.top) / rect.height;

    const dropXPct = Math.max(0, Math.min(100, dropXRatio * 100));
    const dropYPct = Math.max(0, Math.min(100, dropYRatio * 100));

    if (data.type === "image" && data.src) {
      const elW = data.defaultWidth || 45;
      const elH = data.defaultHeight || 20;
      const x = Math.max(0, Math.min(100 - elW, Math.round(dropXPct - elW / 2)));
      const y = Math.max(0, Math.min(100 - elH, Math.round(dropYPct - elH / 2)));
      handleAddImageElement(data.src, { x, y, width: elW, height: elH });
      setStatusToast("✨ Element placed at drop position");
      setTimeout(() => setStatusToast(""), 2000);
    } else if (data.type === "shape" && data.shape) {
      const shape = data.shape;
      const elW = shape.width || 30;
      const elH = shape.height || 30;
      const x = Math.max(0, Math.min(100 - elW, Math.round(dropXPct - elW / 2)));
      const y = Math.max(0, Math.min(100 - elH, Math.round(dropYPct - elH / 2)));
      handleAddShapeElement(shape, { x, y });
      setStatusToast("✨ Shape placed at drop position");
      setTimeout(() => setStatusToast(""), 2000);
    } else if (data.type === "text" && data.preset) {
      const preset = data.preset;
      const elW = preset.fontSize && preset.fontSize > 30 ? 80 : 70;
      const elH = preset.fontSize && preset.fontSize > 30 ? 14 : 9;
      const x = Math.max(0, Math.min(100 - elW, Math.round(dropXPct - elW / 2)));
      const y = Math.max(0, Math.min(100 - elH, Math.round(dropYPct - elH / 2)));
      handleAddTextElement(preset, { x, y, width: elW, height: elH });
      setStatusToast("✨ Text preset placed at drop position");
      setTimeout(() => setStatusToast(""), 2000);
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

  const handleTouchStartElement = (e: React.TouchEvent, el: CanvasElement) => {
    e.stopPropagation();
    setSelectedElementId(el.id);
    if (el.isLocked || e.touches.length === 0) return;

    const touch = e.touches[0];
    isInteractingRef.current = true;
    interactionStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
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

  const handleTouchStartResize = (e: React.TouchEvent, handle: string, el: CanvasElement) => {
    e.stopPropagation();
    if (el.isLocked || e.touches.length === 0) return;

    const touch = e.touches[0];
    isInteractingRef.current = true;
    interactionStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      elemX: el.x,
      elemY: el.y,
      elemW: el.width,
      elemH: el.height,
      handle,
    };
  };

  // Keep a fresh reference to cardLayers for recording history at drag completion
  const cardLayersRef = useRef(cardLayers);
  useEffect(() => {
    cardLayersRef.current = cardLayers;
  }, [cardLayers]);

  // Global mousemove, mouseup, touchmove, touchend for drag/resize
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isInteractingRef.current || !interactionStartRef.current || !selectedElementId) return;

      const { startX, startY, elemX, elemY, elemW, elemH, handle } = interactionStartRef.current;
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      const rect = canvasEl.getBoundingClientRect();
      const deltaXPercent = ((clientX - startX) / rect.width) * 100;
      const deltaYPercent = ((clientY - startY) / rect.height) * 100;

      if (!handle) {
        // Dragging Element (without saving history on every drag frame)
        const newX = Math.max(-20, Math.min(100, Math.round((elemX + deltaXPercent) * 10) / 10));
        const newY = Math.max(-20, Math.min(100, Math.round((elemY + deltaYPercent) * 10) / 10));
        updateSelectedElement({ x: newX, y: newY }, false);
      } else {
        // Resizing Element (without saving history on every drag frame)
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

        updateSelectedElement(
          {
            width: Math.round(newW * 10) / 10,
            height: Math.round(newH * 10) / 10,
            x: Math.round(newX * 10) / 10,
            y: Math.round(newY * 10) / 10,
          },
          false
        );
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      if (isInteractingRef.current) {
        isInteractingRef.current = false;
        interactionStartRef.current = null;
        recordHistory(cardLayersRef.current);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isInteractingRef.current || e.touches.length === 0) return;
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      handleMouseUp();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [selectedElementId, recordHistory]);

  // ── Keyboard Shortcuts (Delete / Backspace, Arrow Nudge, Undo / Redo, Escape) ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in any input, textarea, select, or contenteditable element, do not trigger canvas shortcuts
      const activeEl = document.activeElement as HTMLElement | null;
      const activeTag = (activeEl?.tagName || "").toLowerCase();
      const isContentEditable = Boolean(activeEl?.isContentEditable);
      const isTargetInput = Boolean(
        (e.target as HTMLElement)?.closest?.("input, textarea, select, [contenteditable='true']")
      );

      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        activeTag === "select" ||
        isContentEditable ||
        isTargetInput
      ) {
        return;
      }

      // 1. Delete / Backspace: Remove selected element or multi-selection
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds && selectedIds.length > 0) {
          e.preventDefault();
          const deletable = selectedIds.filter((id) => {
            const el = activeLayer.elements.find((item) => item.id === id);
            return el && !el.isLocked;
          });
          if (deletable.length > 0) {
            setElements((prev) => prev.filter((el) => !deletable.includes(el.id)));
            setSelectedIds([]);
            setSelectedElementId(null);
            setStatusToast("🗑️ Selected elements deleted");
            setTimeout(() => setStatusToast(""), 2000);
          } else {
            setStatusToast("🔒 Selected elements are locked");
            setTimeout(() => setStatusToast(""), 2000);
          }
          return;
        }

        if (selectedElementId) {
          const targetEl = activeLayer.elements.find((el) => el.id === selectedElementId);
          if (targetEl) {
            e.preventDefault();
            if (targetEl.isLocked) {
              setStatusToast("🔒 Cannot delete locked element");
              setTimeout(() => setStatusToast(""), 2000);
              return;
            }
            handleDeleteElement(selectedElementId);
            setStatusToast("🗑️ Element deleted");
            setTimeout(() => setStatusToast(""), 2000);
          }
          return;
        }
      }

      // 2. Escape: Close modals or deselect elements
      if (e.key === "Escape") {
        if (showGalleryView) {
          e.preventDefault();
          setShowGalleryView(false);
          return;
        }
        if (showCreateModal) {
          e.preventDefault();
          setShowCreateModal(false);
          return;
        }
        if (showStackModal) {
          e.preventDefault();
          setShowStackModal(false);
          return;
        }
        if (showPreviewModal) {
          e.preventDefault();
          setShowPreviewModal(false);
          return;
        }
        if (showPricingModal) {
          e.preventDefault();
          setShowPricingModal(false);
          return;
        }
        if (selectedElementId || (selectedIds && selectedIds.length > 0)) {
          e.preventDefault();
          setSelectedElementId(null);
          setSelectedIds([]);
        }
        return;
      }

      // 3. Undo / Redo: Ctrl+Z / Cmd+Z / Ctrl+Y / Cmd+Y
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
        return;
      }

      // 4. Duplicate: Ctrl+D / Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        if (selectedElementId) {
          e.preventDefault();
          handleDuplicateElement(selectedElementId);
          setStatusToast("📑 Element duplicated");
          setTimeout(() => setStatusToast(""), 2000);
        }
        return;
      }

      // 5. Arrow Nudge: Move selected element by 1% (or 5% with Shift)
      if (
        selectedElement &&
        !selectedElement.isLocked &&
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
      ) {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        if (e.key === "ArrowLeft") {
          updateSelectedElement({ x: Math.max(0, Number((selectedElement.x - step).toFixed(2))) });
        } else if (e.key === "ArrowRight") {
          updateSelectedElement({
            x: Math.min(100 - selectedElement.width, Number((selectedElement.x + step).toFixed(2))),
          });
        } else if (e.key === "ArrowUp") {
          updateSelectedElement({ y: Math.max(0, Number((selectedElement.y - step).toFixed(2))) });
        } else if (e.key === "ArrowDown") {
          updateSelectedElement({
            y: Math.min(100 - selectedElement.height, Number((selectedElement.y + step).toFixed(2))),
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedElementId,
    selectedIds,
    selectedElement,
    activeLayer,
    handleUndo,
    handleRedo,
  ]);

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

      // Extract couple names, date, venue from card layers if available
      let partnerOne = "Sophia";
      let partnerTwo = "Alexander";
      let weddingDate = "October 30, 2026";
      let venue = "Elamba Mudakkal Palace";

      const baseLayer = cardLayers.find((l) => l.isBase) || cardLayers[0];
      if (baseLayer) {
        const textElements = baseLayer.elements.filter((el) => el.type === "text" && el.text);
        for (const el of textElements) {
          const t = el.text || "";
          if (t.includes("&") && t.length < 50 && !t.includes("CEREMONY") && !t.includes("PROGRAM")) {
            const parts = t.split("&");
            if (parts.length === 2) {
              partnerOne = parts[0].trim();
              partnerTwo = parts[1].trim();
            }
          } else if (
            (t.includes("2025") || t.includes("2026") || t.includes("2027") || t.includes("2028")) &&
            t.length < 60
          ) {
            weddingDate = t.replace(/\n/g, " ").trim();
          } else if (
            (t.toLowerCase().includes("palace") ||
              t.toLowerCase().includes("resort") ||
              t.toLowerCase().includes("hall") ||
              t.toLowerCase().includes("hotel") ||
              t.toLowerCase().includes("mandapam")) &&
            t.length < 70
          ) {
            venue = t.split("\n")[0].trim();
          }
        }
      }

      if (session?.user) {
        const res = await fetch("/api/user/cards/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardId: currentCardId || undefined,
            templateId: 1,
            templateName: docTitle,
            partnerOne,
            partnerTwo,
            weddingDate,
            venue,
            cardDataJson: JSON.stringify(cardPayload),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.card?.id) {
            setCurrentCardId(data.card.id);
            if (typeof window !== "undefined") {
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.set("id", data.card.id);
              window.history.replaceState({}, "", newUrl.toString());
            }
            setUserSavedCards((prev) => {
              const existingIdx = prev.findIndex((c) => c.id === data.card.id);
              if (existingIdx >= 0) {
                const nextList = [...prev];
                nextList[existingIdx] = data.card;
                return nextList;
              }
              return [data.card, ...prev];
            });
          }
        }
      } else {
        if (typeof window !== "undefined") {
          const guestCard = {
            id: "guest-draft",
            templateName: docTitle,
            partnerOne,
            partnerTwo,
            weddingDate,
            venue,
            cardDataJson: JSON.stringify(cardPayload),
            updatedAt: new Date().toISOString(),
            isGuestDraft: true,
          };
          setUserSavedCards((prev) => {
            const nextList = prev.filter((c) => c.id !== "guest-draft");
            return [guestCard, ...nextList];
          });
        }
      }

      setHasUnsavedChanges(false);
      setStatusToast("✨ Saved to your dashboard gallery!");
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
      {/* ── TOPBAR: CLEAN, ORGANIZED & LUXURY STUDIO HEADER ── */}
      <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shrink-0 z-30 shadow-2xs flex items-center justify-between px-3 sm:px-5 gap-2">
        {/* LEFT: BACK, NEW CARD, EDITABLE TITLE & STATUS */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/templates"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="Back to Templates"
          >
            <ArrowLeft className="w-4 h-4 text-[#991B1B]" />
            <span className="hidden md:inline">Templates</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowGalleryView(true)}
            className="flex px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold items-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
            title="Browse all your saved cards & designs"
          >
            <FolderKanban className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">My Cards</span>
            {userSavedCards.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-red-100 text-[#991B1B] rounded-full font-extrabold border border-red-200">
                {userSavedCards.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#991B1B] border border-red-200 text-xs font-bold items-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
            title="Create a brand new invitation card from scratch"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#991B1B]" />
            <span className="hidden sm:inline">New Card</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

          {/* Card Title Input & Saved Indicator */}
          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={docTitle}
              onChange={(e) => {
                setDocTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent hover:border-slate-200 focus:border-[#991B1B] text-xs sm:text-sm font-bold text-slate-900 outline-none px-2 py-1 rounded-xl transition-all w-28 sm:w-48 md:w-60 truncate"
              placeholder="Invitation Title..."
              title="Click to rename your invitation card"
            />
            <span
              className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                hasUnsavedChanges
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${hasUnsavedChanges ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
              <span>{hasUnsavedChanges ? "Unsaved" : "Saved"}</span>
            </span>
          </div>
        </div>

        {/* CENTER: SHEET / PAGE SWITCHER (DESKTOP) */}
        <div className="hidden xl:flex items-center gap-1 bg-slate-100/80 border border-slate-200/90 rounded-2xl p-1 text-xs shadow-2xs">
          <button
            type="button"
            onClick={handlePrevSheet}
            disabled={activeLayerIndex <= 0}
            className="p-1 rounded-xl text-slate-600 hover:bg-white disabled:opacity-25 transition-all cursor-pointer"
            title="Previous Sheet"
          >
            <ChevronDown className="w-3.5 h-3.5 rotate-90" />
          </button>
          <div className="px-2 font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
            <span className="text-[#991B1B] font-mono">Sheet {activeLayerIndex + 1}/{cardLayers.length}:</span>
            <span className="truncate max-w-[130px]">{activeLayer.name}</span>
          </div>
          <button
            type="button"
            onClick={handleNextSheet}
            disabled={activeLayerIndex >= cardLayers.length - 1}
            className="p-1 rounded-xl text-slate-600 hover:bg-white disabled:opacity-25 transition-all cursor-pointer"
            title="Next Sheet"
          >
            <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
          </button>
        </div>

        {/* RIGHT: ACTIONS (UNDO/REDO, PREVIEW, EXPORT, SAVE, ORDER) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-25 transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-25 transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preview Button */}
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            title="Preview full card"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">Preview</span>
          </button>

          {/* Download Dropdown */}
          <div className="relative">
            <button
              type="button"
              disabled={isExporting}
              onClick={() => setShowExportMenu((prev) => !prev)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export Card as High-Res File"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
            </button>
            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      handleExport("png");
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-semibold hover:bg-red-50/50 text-slate-700 flex items-center gap-2.5 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-[#991B1B]" />
                    <div>
                      <span className="block font-bold text-slate-900">High-Res PNG</span>
                      <span className="text-[10px] text-slate-400">Crystal clear digital image</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      handleExport("pdf");
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-semibold hover:bg-red-50/50 text-slate-700 flex items-center gap-2.5 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#991B1B]" />
                    <div>
                      <span className="block font-bold text-slate-900">Print-Ready PDF</span>
                      <span className="text-[10px] text-slate-400">Standard print document</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Save to Gallery Button */}
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveCard}
            className={`p-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              hasUnsavedChanges
                ? "bg-[#991B1B] hover:bg-[#7F1D1D] text-white"
                : "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
            }`}
            title="Save invitation card to your dashboard gallery"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : hasUnsavedChanges ? (
              <Save className="w-3.5 h-3.5" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span className="hidden md:inline">{saving ? "Saving..." : hasUnsavedChanges ? "Save" : "Saved"}</span>
          </button>

          {/* Order Physical Prints Button */}
          <button
            type="button"
            onClick={() => setShowOrderModal(true)}
            className="px-3 sm:px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border border-slate-800"
            title="Order Physical Luxury Printed Cards"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Order Prints</span>
            <span className="sm:hidden text-[11px]">Order</span>
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
      <div className="flex-1 min-h-0 flex flex-row overflow-hidden relative">
        {/* ── DESKTOP LEFT SIDEBAR: TOOLS & PRESETS (SETTINGS, TEXT, ASSETS, LAYERS, TEMPLATES) ── */}
        <aside className="hidden lg:flex lg:static lg:z-10 lg:w-80 flex-col border-r border-slate-200 shrink-0 bg-white shadow-xs">

          {/* Tabs: SETTINGS | TEXT | ASSETS | LAYERS | TEMPLATES */}
          <div className="shrink-0 grid grid-cols-5 p-1 gap-1 bg-slate-100/80 border-b border-slate-200 text-[9.5px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("SETTINGS")}
              className={`py-1 px-1 rounded-md flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                activeTab === "SETTINGS"
                  ? "bg-[#991B1B] text-white shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("TEXT")}
              className={`py-1 px-1 rounded-md flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                activeTab === "TEXT"
                  ? "bg-[#991B1B] text-white shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ASSETS")}
              className={`py-1 px-1 rounded-md flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                activeTab === "ASSETS"
                  ? "bg-[#991B1B] text-white shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Assets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("LAYERS")}
              className={`py-1 px-1 rounded-md flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                activeTab === "LAYERS"
                  ? "bg-[#991B1B] text-white shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("TEMPLATES")}
              className={`py-1 px-1 rounded-md flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                activeTab === "TEMPLATES"
                  ? "bg-[#991B1B] text-white shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Designs</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-auto overscroll-contain bg-white">
            {/* ── TAB 1: CANVAS & SETTINGS (ASPECT RATIOS, DECK LAYERS, BACKGROUNDS) ── */}
            {activeTab === "SETTINGS" && (
              <div className="p-2.5 space-y-3 text-xs">
                {/* Compact New Card Action */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200">
                  <span className="font-extrabold text-[#991B1B] text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Start New Card
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="px-2 py-0.5 bg-[#991B1B] hover:bg-[#7F1D1D] text-white rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    + New
                  </button>
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

            {/* ── TAB 2: TEXT & WEDDING TYPOGRAPHY PRESETS (COMPACT PHOTOSHOP-STYLE) ── */}
            {activeTab === "TEXT" && (
              <div className="p-2 space-y-2 text-xs">
                {/* 1. Quick Add Text - SINGLE LINE (Heading, Subheading, Body) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wider px-0.5">
                    <span>Quick Add Text</span>
                    <span className="text-[9px] font-normal lowercase text-slate-400">click or drag</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {/* Heading */}
                    <button
                      type="button"
                      draggable
                      onDragStart={(e) =>
                        handleDragStartAsset(e, {
                          type: "text",
                          preset: {
                            text: "Add a Heading",
                            fontFamily: "'Cinzel', serif",
                            fontSize: 32,
                            fontWeight: "bold",
                            color: "#1E293B",
                            letterSpacing: 2,
                          },
                        })
                      }
                      onClick={() =>
                        handleAddTextElement({
                          text: "Add a Heading",
                          fontFamily: "'Cinzel', serif",
                          fontSize: 32,
                          fontWeight: "bold",
                          letterSpacing: 2,
                        })
                      }
                      className="h-8 px-1.5 bg-slate-50 hover:bg-red-50 hover:border-[#991B1B] border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-grab active:cursor-grabbing text-slate-800 hover:text-[#991B1B] shadow-2xs group"
                      title="Heading: Cinzel • 32px • Bold (Drag or Click)"
                    >
                      <span className="font-serif font-black text-xs text-[#991B1B] shrink-0">H1</span>
                      <span className="text-[11px] font-bold truncate">Heading</span>
                    </button>

                    {/* Subheading */}
                    <button
                      type="button"
                      draggable
                      onDragStart={(e) =>
                        handleDragStartAsset(e, {
                          type: "text",
                          preset: {
                            text: "Add a Subheading",
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 20,
                            fontWeight: "600",
                            color: "#334155",
                            letterSpacing: 1,
                          },
                        })
                      }
                      onClick={() =>
                        handleAddTextElement({
                          text: "Add a Subheading",
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: 20,
                          fontWeight: "600",
                          letterSpacing: 1,
                        })
                      }
                      className="h-8 px-1.5 bg-slate-50 hover:bg-red-50 hover:border-[#991B1B] border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-grab active:cursor-grabbing text-slate-800 hover:text-[#991B1B] shadow-2xs group"
                      title="Subheading: Montserrat • 20px (Drag or Click)"
                    >
                      <span className="font-sans font-black text-[11px] text-slate-600 group-hover:text-[#991B1B] shrink-0">H2</span>
                      <span className="text-[11px] font-semibold truncate">Subhead</span>
                    </button>

                    {/* Body */}
                    <button
                      type="button"
                      draggable
                      onDragStart={(e) =>
                        handleDragStartAsset(e, {
                          type: "text",
                          preset: {
                            text: "Add body text...",
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 14,
                            fontStyle: "italic",
                            color: "#475569",
                          },
                        })
                      }
                      onClick={() =>
                        handleAddTextElement({
                          text: "Add body text...",
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 14,
                          fontStyle: "italic",
                        })
                      }
                      className="h-8 px-1.5 bg-slate-50 hover:bg-red-50 hover:border-[#991B1B] border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-grab active:cursor-grabbing text-slate-800 hover:text-[#991B1B] shadow-2xs group"
                      title="Body Text: Cormorant • 14px (Drag or Click)"
                    >
                      <span className="font-serif italic font-bold text-xs text-slate-500 group-hover:text-[#991B1B] shrink-0">p</span>
                      <span className="text-[11px] font-medium truncate">Body</span>
                    </button>
                  </div>
                </div>

                {/* 2. Compact Search & Category Filter Toolbar */}
                <div className="space-y-1.5 pt-1.5 border-t border-slate-200">
                  <div className="flex items-center gap-1.5">
                    {/* Category Selector Dropdown */}
                    <div className="relative w-[50%] shrink-0">
                      <select
                        value={selectedTextCategory}
                        onChange={(e) => setSelectedTextCategory(e.target.value)}
                        className="w-full h-7 pl-2 pr-5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-[10px] font-bold text-slate-800 focus:outline-none focus:border-[#991B1B] focus:bg-white truncate cursor-pointer appearance-none"
                      >
                        {allTextCategories.map((catName) => {
                          const icon = CATEGORY_ICONS[catName] || "✨";
                          const count =
                            catName === "All"
                              ? WEDDING_TEXT_PRESETS.reduce((sum, c) => sum + c.items.length, 0)
                              : WEDDING_TEXT_PRESETS.find((c) => c.category === catName)?.items.length || 0;
                          return (
                            <option key={catName} value={catName}>
                              {icon} {catName} ({count})
                            </option>
                          );
                        })}
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={textSearchQuery}
                        onChange={(e) => setTextSearchQuery(e.target.value)}
                        placeholder="Search presets..."
                        className="w-full h-7 pl-6 pr-5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-[10.5px] placeholder:text-slate-400 focus:outline-none focus:border-[#991B1B] focus:bg-white transition-colors"
                      />
                      {textSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setTextSearchQuery("")}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Micro Category Pills (Horizontal, Clean, No Bulky Scrollbar) */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                    {allTextCategories.map((catName) => {
                      const isSel = selectedTextCategory === catName;
                      const icon = CATEGORY_ICONS[catName] || "✨";
                      return (
                        <button
                          key={catName}
                          type="button"
                          onClick={() => setSelectedTextCategory(catName)}
                          className={`px-2 py-0.5 rounded-md text-[9px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                            isSel
                              ? "bg-[#991B1B] text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/50"
                          }`}
                        >
                          <span>{icon}</span>
                          <span>{catName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Compact High-Density Presets List (Zero Wasted Space) */}
                {filteredTextPresets.length === 0 ? (
                  <div className="p-3 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 space-y-1">
                    <p className="text-[11px] text-slate-600 font-medium">
                      No presets found for &ldquo;{textSearchQuery}&rdquo;
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setTextSearchQuery("");
                        setSelectedTextCategory("All");
                      }}
                      className="text-[10px] font-bold text-[#991B1B] hover:underline cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[calc(100vh-175px)] overflow-y-auto pr-0.5 custom-scrollbar">
                    {filteredTextPresets.map((cat) => (
                      <div key={cat.category} className="space-y-1">
                        {/* Compact Category Header */}
                        <div className="flex items-center justify-between px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-extrabold text-slate-700 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-xs">
                          <span className="flex items-center gap-1 text-[#991B1B]">
                            <span>{CATEGORY_ICONS[cat.category] || "✨"}</span>
                            <span>{cat.category}</span>
                          </span>
                          <span className="text-[8.5px] text-slate-400 font-mono">
                            {cat.items.length}
                          </span>
                        </div>

                        {/* Dense Preset Items */}
                        <div className="space-y-1">
                          {cat.items.map((item) => (
                            <div
                              key={item.label}
                              draggable
                              onDragStart={(e) =>
                                handleDragStartAsset(e, {
                                  type: "text",
                                  preset: item,
                                })
                              }
                              onClick={() => handleAddTextElement(item)}
                              className="w-full px-2.5 py-2 bg-white hover:bg-red-50/25 border border-slate-200 hover:border-[#991B1B] rounded-lg text-left transition-all cursor-grab active:cursor-grabbing group shadow-2xs hover:shadow-xs relative"
                              title={`${item.label} (${item.fontFamily?.replace(/['",]/g, "").split(" ")[0] || "Serif"}) - Drag or click`}
                            >
                              {/* Pure Styled Typography Preview */}
                              <div
                                style={{
                                  fontFamily: item.fontFamily,
                                  color: item.color,
                                  letterSpacing: item.letterSpacing ? `${item.letterSpacing}px` : undefined,
                                  fontWeight: item.fontWeight as any,
                                  fontStyle: item.fontStyle,
                                }}
                                className="text-xs leading-tight line-clamp-2 select-none"
                              >
                                {item.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: ASSETS (UPLOAD PHOTOS, TRADITIONAL MOTIFS, BORDERS, SHAPES) ── */}
            {activeTab === "ASSETS" && (
              <div className="p-2.5 space-y-3 text-xs">
                {/* 1. Compact Photo Uploader */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] block">
                      Upload Photos & Graphics
                    </label>
                    {session?.user ? (
                      <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1 border border-emerald-200">
                        <Lock className="w-2.5 h-2.5" /> Account Private
                      </span>
                    ) : (
                      <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md font-bold border border-amber-200">
                        Guest
                      </span>
                    )}
                  </div>

                  <label className="block p-2.5 border border-dashed border-slate-300 hover:border-[#991B1B] rounded-xl text-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-red-50/20 group">
                    <div className="flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4 text-[#991B1B] shrink-0" />
                      <span className="text-[11px] font-bold text-slate-800">
                        {isUploading ? "Uploading..." : "Upload Photo / PNG"}
                      </span>
                    </div>
                    <span className="text-[9.5px] text-slate-400 block mt-0.5">
                      PNG, JPG, WebP • Drag & drop onto card
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploading}
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {/* 2. User's Account Assets (Private to this logged-in account) */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      Your Account Assets ({userAssets.length})
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">Drag to place</span>
                  </div>

                  {isLoadingUserAssets ? (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center text-slate-500 text-[11px]">
                      Loading your assets...
                    </div>
                  ) : userAssets.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center text-slate-500 text-[11px]">
                      <p className="font-bold text-slate-700 mb-0.5">No uploaded assets yet</p>
                      <p className="text-[10px] text-slate-400">
                        Photos, PNGs, and graphics you upload appear here and are only visible in your account.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto custom-scrollbar p-1">
                      {userAssets.map((asset) => (
                        <div
                          key={asset.id}
                          draggable
                          onDragStart={(e) =>
                            handleDragStartAsset(e, {
                              type: "image",
                              src: asset.url,
                              defaultWidth: 45,
                              defaultHeight: 30,
                            })
                          }
                          onClick={() => handleAddImageElement(asset.url)}
                          className="group relative p-1.5 bg-slate-50 border border-slate-200 hover:border-[#991B1B] rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-all hover:bg-white shadow-2xs aspect-square"
                          title="Drag onto card to place at desired position, or click to place at center"
                        >
                          <img
                            src={asset.url}
                            alt={asset.name || "User Asset"}
                            className="max-w-full max-h-full object-contain pointer-events-none group-hover:scale-105 transition-transform"
                          />
                          {/* Delete button from account */}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteUserAsset(e, asset.id)}
                            className="absolute top-1 right-1 w-5 h-5 bg-white/95 hover:bg-red-600 text-slate-500 hover:text-white rounded-md flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                            title="Delete from your account"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Geometric Shapes */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      Shapes & Frames
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">Drag or Click</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_SHAPES.map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        draggable
                        onDragStart={(e) =>
                          handleDragStartAsset(e, {
                            type: "shape",
                            shape,
                          })
                        }
                        onClick={() => handleAddShapeElement(shape)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/50 flex flex-col items-center justify-center gap-1 transition-all cursor-grab active:cursor-grabbing aspect-square"
                        title={`Drag ${shape.name} onto card`}
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

                {/* 4. Traditional Motifs & Overlays */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      Wedding Motifs & Overlays ({stockMotifs.length})
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">Drag to place</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto custom-scrollbar p-1">
                    {stockMotifs.map((src, idx) => (
                      <div
                        key={`${src}-${idx}`}
                        draggable
                        onDragStart={(e) =>
                          handleDragStartAsset(e, {
                            type: "image",
                            src,
                            defaultWidth: 45,
                            defaultHeight: 20,
                          })
                        }
                        onClick={() => handleAddImageElement(src)}
                        className="group relative p-2 bg-slate-50 border border-slate-200 hover:border-[#991B1B] rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-all hover:bg-white shadow-2xs aspect-square"
                        title="Drag onto card to place at desired position, or click to place at center"
                      >
                        <img
                          src={src}
                          alt="Motif"
                          className="max-w-full max-h-full object-contain pointer-events-none group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 4: LAYERS (CARD DECK VISUALIZER & ELEMENTS) ── */}
            {activeTab === "LAYERS" && (
              <div className="p-4 space-y-4 text-xs">
                {/* ── 1. 2.5D DECK PREVIEW (CLEAN WHITE & RED) ── */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#991B1B]" />
                      <h3 className="text-xs font-extrabold text-[#991B1B] uppercase tracking-wider">
                        Deck Preview
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowStackModal(true)}
                      className="px-2.5 py-1 rounded-xl bg-red-50 text-[#991B1B] hover:bg-red-100 text-[10px] font-extrabold flex items-center gap-1 border border-red-200 transition-colors cursor-pointer"
                      title="Open Fullscreen Stack Visualizer"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Enlarge</span>
                    </button>
                  </div>

                  {/* Red & White Alignment Selector */}
                  <div className="flex items-center p-1 bg-red-50/60 rounded-2xl border border-red-100 text-[10px] font-extrabold">
                    <button
                      type="button"
                      onClick={() => setStackAlign("bottom")}
                      className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer text-center ${
                        stackAlign === "bottom"
                          ? "bg-[#991B1B] text-white shadow-xs font-bold"
                          : "text-slate-700 hover:text-[#991B1B]"
                      }`}
                    >
                      Bottom Stepped
                    </button>
                    <button
                      type="button"
                      onClick={() => setStackAlign("top")}
                      className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer text-center ${
                        stackAlign === "top"
                          ? "bg-[#991B1B] text-white shadow-xs font-bold"
                          : "text-slate-700 hover:text-[#991B1B]"
                      }`}
                    >
                      Top Stepped
                    </button>
                    <button
                      type="button"
                      onClick={() => setStackAlign("center")}
                      className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer text-center ${
                        stackAlign === "center"
                          ? "bg-[#991B1B] text-white shadow-xs font-bold"
                          : "text-slate-700 hover:text-[#991B1B]"
                      }`}
                    >
                      Center
                    </button>
                  </div>

                  {/* 2.5D Live Stack Preview Box (Clean White & Red Canvas) */}
                  <div
                    className="h-56 bg-gradient-to-b from-red-50/30 via-white to-red-50/50 rounded-2xl p-4 flex items-center justify-center relative border border-red-100 shadow-sm overflow-hidden select-none"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(#fecaca_1px,transparent_1px)] [background-size:12px_12px] opacity-60 pointer-events-none" />

                    {/* Stack Container */}
                    <div
                      className={`relative w-full h-full flex justify-center ${
                        stackAlign === "bottom"
                          ? "items-end"
                          : stackAlign === "top"
                          ? "items-start"
                          : "items-center"
                      }`}
                    >
                      {(() => {
                        const baseL = cardLayers.find((p) => p.isBase) || cardLayers[0];
                        const baseDim = getLayerDimensions(baseL, baseL);
                        const maxHeightPx = 180;
                        const scaleFactor = maxHeightPx / baseDim.height;

                        const sortedForStack = [...cardLayers]
                          .map((layer, origIdx) => ({ layer, origIdx }))
                          .sort((a, b) => {
                            const aPct = a.layer.isBase !== false ? 100 : a.layer.heightPercent || 85;
                            const bPct = b.layer.isBase !== false ? 100 : b.layer.heightPercent || 85;
                            return bPct - aPct;
                          });

                        return sortedForStack.map((item, stackPos) => {
                          const { layer: p, origIdx } = item;
                          const isSelected = p.id === activeLayerId;
                          const pDim = getPhysicalDimensions(p, baseL);
                          const renderW = Math.round(pDim.pixelW * scaleFactor);
                          const renderH = Math.round(pDim.pixelH * scaleFactor);

                          return (
                            <div
                              key={p.id}
                              onClick={() => {
                                setActiveLayerId(p.id);
                                setSelectedElementId(null);
                              }}
                              style={{
                                width: `${renderW}px`,
                                height: `${renderH}px`,
                                zIndex: stackPos + 10,
                                backgroundColor: p.backgroundColor?.startsWith("#") ? p.backgroundColor : "#FFFFFF",
                                backgroundImage: p.backgroundImage ? `url(${p.backgroundImage})` : undefined,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                              className={`absolute rounded-xl transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl flex flex-col justify-between p-2 border ${
                                isSelected
                                  ? "ring-2 ring-[#991B1B] border-[#991B1B] shadow-xl scale-[1.02]"
                                  : "border-slate-200 hover:border-slate-300 hover:scale-[1.01]"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span
                                  className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-md truncate max-w-[100px] shadow-2xs ${
                                    isSelected
                                      ? "bg-[#991B1B] text-white"
                                      : "bg-slate-900/80 text-white backdrop-blur-xs"
                                  }`}
                                >
                                  {p.name || `Sheet ${origIdx + 1}`}
                                </span>
                                <span className="text-[8px] font-mono font-bold bg-white text-slate-800 px-1 py-0.5 rounded border border-slate-200 shadow-2xs">
                                  {pDim.pct}%
                                </span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>

                {/* ── 2. CANVAS ELEMENTS ON ACTIVE SHEET ── */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      Elements on Active Sheet ({activeLayer.elements.length})
                    </h3>
                    <span className="text-[10px] text-slate-500">Top to bottom</span>
                  </div>

                  {activeLayer.elements.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                      No elements on this card insert sheet yet.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {[...activeLayer.elements].reverse().map((el) => {
                        const isSelected = el.id === selectedElementId;
                        return (
                          <div
                            key={el.id}
                            onClick={() => {
                              setSelectedElementId(el.id);
                              setMobileSheet(null);
                            }}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-bold cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-red-50/60 border-[#991B1B] text-[#991B1B] ring-1 ring-[#991B1B]/30"
                                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
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
                              <span className="truncate">
                                {el.text || (el.type === "image" ? "Graphic Image" : "Shape")}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateElementById(el.id, { isHidden: !el.isHidden });
                                }}
                                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                                title={el.isHidden ? "Unhide Element" : "Hide Element"}
                              >
                                {el.isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-600" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateElementById(el.id, { isLocked: !el.isLocked });
                                }}
                                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                                title={el.isLocked ? "Unlock Element" : "Lock Element"}
                              >
                                {el.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveLayerZIndex(el.id, "up");
                                }}
                                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
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
                                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
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
                                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
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
          className="flex-1 min-h-0 relative flex flex-col items-center justify-start lg:justify-center overflow-auto p-2 sm:p-4 lg:p-8 bg-slate-100/70 custom-scrollbar select-none pb-24 lg:pb-8 pt-12 sm:pt-14 lg:pt-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedElementId(null);
            }
          }}
        >
          {/* ── 📱 MOBILE SLEEK FLOATING CARD DECK PILL (MINIMIZED & INTERACTIVE) ── */}
          {!isDeckBarMinimized ? (
            <div className="lg:hidden fixed top-[54px] sm:top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow-md border border-slate-200/90 max-w-[94vw] select-none pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
              {/* Sheets Switcher Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[55vw] sm:max-w-[65vw]">
                {cardLayers.map((layer, idx) => {
                  const isSelected = layer.id === activeLayerId;
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => {
                        setActiveLayerId(layer.id);
                        setSelectedElementId(null);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? "bg-[#991B1B] text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                      title={`Switch to ${layer.name}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full border border-white/50 shrink-0"
                        style={{
                          backgroundColor: layer.backgroundColor?.startsWith("#") ? layer.backgroundColor : "#FFFFFF",
                        }}
                      />
                      <span className="truncate max-w-[64px]">
                        {layer.name || (idx === 0 ? "Base" : `Sheet ${idx + 1}`)}
                      </span>
                      <span className={`text-[8.5px] font-mono ${isSelected ? "text-red-100" : "text-slate-400"}`}>
                        {layer.isBase ? "Base" : `${layer.heightPercent || 85}%`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick (+) Add Card Insert Sheet */}
              <button
                type="button"
                onClick={handleAddLayer}
                className="w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 active:bg-red-200 text-[#991B1B] border border-red-200 flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-2xs ml-0.5"
                title="Add card insert sheet"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-3.5 bg-slate-200 mx-0.5 shrink-0" />

              {/* Full Deck Drawer Trigger */}
              <button
                type="button"
                onClick={() => setMobileSheet("LAYERS")}
                className="p-1 rounded-full text-slate-500 hover:text-slate-800 transition-colors shrink-0 cursor-pointer"
                title="Open Deck Manager"
              >
                <Layers className="w-3.5 h-3.5 text-[#991B1B]" />
              </button>

              {/* Minimize Toggle */}
              <button
                type="button"
                onClick={() => setIsDeckBarMinimized(true)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors shrink-0 cursor-pointer"
                title="Minimize sheet switcher"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="lg:hidden fixed top-[54px] sm:top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md border border-slate-200/90 select-none pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => setIsDeckBarMinimized(false)}
                className="flex items-center gap-1 text-[10.5px] font-bold text-slate-800 cursor-pointer"
                title="Expand sheet switcher"
              >
                <Layers className="w-3.5 h-3.5 text-[#991B1B]" />
                <span className="truncate max-w-[100px]">
                  {activeLayer.name || (activeLayer.isBase ? "Base Card" : "Insert Sheet")}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">({cardLayers.length})</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              <div className="w-px h-3 bg-slate-200" />
              <button
                type="button"
                onClick={handleAddLayer}
                className="w-5 h-5 rounded-full bg-red-50 hover:bg-red-100 text-[#991B1B] flex items-center justify-center cursor-pointer transition-colors"
                title="Add card insert sheet"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Zoom Wrapper */}
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              transition: "transform 0.15s ease",
            }}
            className={`relative flex justify-center p-2 sm:p-4 lg:p-8 shrink-0 ${
              stackAlign === "bottom"
                ? "items-end"
                : stackAlign === "top"
                ? "items-start"
                : "items-center"
            }`}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedElementId(null);
              }
            }}
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
                    ...(stackAlign === "bottom"
                      ? { bottom: "2rem" }
                      : stackAlign === "top"
                      ? { top: "2rem" }
                      : {}),
                  }}
                  className="border border-slate-300"
                />
              );
            })}

            {/* 🌟 ACTIVE CANVAS CARD (DRAG & DROP PLACEMENT TARGET) 🌟 */}
            <div
              ref={canvasRef}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
                if (!isDragOverCanvas) setIsDragOverCanvas(true);
              }}
              onDragLeave={(e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                setIsDragOverCanvas(false);
              }}
              onDrop={handleDropOnCanvas}
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
                boxShadow: isDragOverCanvas
                  ? "0 30px 60px -12px rgba(153, 27, 27, 0.35), 0 0 0 2px rgba(153, 27, 27, 0.5)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                borderRadius: "16px",
                position: "relative",
                overflow: "hidden",
                zIndex: 10,
              }}
              className={`transition-all duration-150 ${
                isDragOverCanvas ? "ring-4 ring-dashed ring-[#991B1B] scale-[1.01]" : "transition-shadow"
              }`}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedElementId(null);
                }
              }}
            >
              {/* Drag-over live helper pill overlay */}
              {isDragOverCanvas && (
                <div className="absolute inset-0 bg-[#991B1B]/5 pointer-events-none z-50 flex items-center justify-center">
                  <div className="bg-white/95 text-[#991B1B] border-2 border-[#991B1B] px-4 py-2 rounded-full font-extrabold text-xs shadow-xl flex items-center gap-2 animate-bounce">
                    <Sparkles className="w-4 h-4 text-[#991B1B]" />
                    <span>Drop element at cursor position</span>
                  </div>
                </div>
              )}
              {/* Elements on Active Canvas */}
              {activeLayer.elements.map((el) => {
                const isSelected = el.id === selectedElementId;
                return (
                  <div
                    key={el.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(el.id);
                    }}
                    onMouseDown={(e) => handleMouseDownElement(e, el)}
                    onTouchStart={(e) => handleTouchStartElement(e, el)}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      transform: `rotate(${el.rotation || 0}deg) scaleX(${el.flipH ? -1 : 1}) scaleY(${el.flipV ? -1 : 1})`,
                      opacity: el.isHidden ? 0 : el.opacity ?? 1,
                      display: el.isHidden ? "none" : "block",
                      zIndex: el.zIndex || 1,
                    }}
                    className={`cursor-move select-none touch-none group/item ${
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
                        className="w-full h-full flex items-center justify-center p-0.5 whitespace-pre-wrap leading-tight pointer-events-none"
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
                        className="pointer-events-none"
                      />
                    )}

                    {/* 8-Point Resize Handles (Only When Selected & Unlocked) */}
                    {isSelected && !el.isLocked && (
                      <>
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "nw", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "nw", el)}
                          className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 sm:w-3 sm:h-3 rounded-full bg-white border-2 border-[#991B1B] cursor-nwse-resize z-30 touch-none shadow-xs"
                        />
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "ne", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "ne", el)}
                          className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-3 sm:h-3 rounded-full bg-white border-2 border-[#991B1B] cursor-nesw-resize z-30 touch-none shadow-xs"
                        />
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "sw", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "sw", el)}
                          className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 sm:w-3 sm:h-3 rounded-full bg-white border-2 border-[#991B1B] cursor-nesw-resize z-30 touch-none shadow-xs"
                        />
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "se", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "se", el)}
                          className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 sm:w-3 sm:h-3 rounded-full bg-white border-2 border-[#991B1B] cursor-nwse-resize z-30 touch-none shadow-xs"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── UNIFIED SLEEK BOTTOM DOCK: CARD SHEETS TRAY & ZOOM CONTROLS ── */}
          <div className="fixed bottom-[68px] lg:absolute lg:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 select-none pointer-events-auto max-w-[95vw] overflow-x-auto p-1 custom-scrollbar scrollbar-none">
            {/* Sheet / Deck Switcher Pill Dock */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-1.5 shadow-xl flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1.5 pr-1 hidden sm:inline">
                Sheets:
              </span>
              {cardLayers.map((layer, idx) => {
                const isSelected = layer.id === activeLayerId;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => {
                      setActiveLayerId(layer.id);
                      setSelectedElementId(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-[#991B1B] text-white shadow-xs scale-102"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <span>{idx === 0 ? "Main Card" : layer.name || `Insert ${idx + 1}`}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-extrabold ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {layer.isBase ? "Base" : `${layer.heightPercent}%`}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={handleAddLayer}
                className="px-2.5 py-1.5 rounded-xl border border-dashed border-red-300 hover:border-[#991B1B] hover:bg-red-50 text-[#991B1B] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                title="Add new insert card sheet"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Sheet</span>
              </button>
            </div>

            {/* Zoom Controls Pill */}
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-2.5 py-1.5 shadow-xl flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(0.25, Math.round((prev - 0.1) * 10) / 10))}
                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleFitToScreen}
                className="w-10 text-center text-[10px] font-extrabold text-slate-900 font-mono hover:text-[#991B1B] cursor-pointer"
                title="Fit to Screen"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(2.0, Math.round((prev + 0.1) * 10) / 10))}
                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <Plus className="w-3 h-3" />
              </button>
              <div className="h-4 w-px bg-slate-200 mx-0.5" />
              <button
                type="button"
                onClick={handleFitToScreen}
                className="px-2 py-0.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#991B1B] text-[10px] font-extrabold flex items-center gap-1 cursor-pointer"
                title="Reset zoom to fit screen"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Fit</span>
              </button>
            </div>
          </div>
        </main>

        {/* ── DESKTOP RIGHT INSPECTOR PANEL (TYPOGRAPHY, COLORS, DIMENSIONS, ALIGNMENT) ── */}
        <aside className="hidden lg:flex lg:static lg:z-10 lg:w-80 flex-col border-l border-slate-200 shrink-0 bg-white shadow-xs">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between shrink-0">
            <span className="font-extrabold text-[#991B1B] uppercase tracking-wider text-[11px]">
              {selectedElement
                ? selectedElement.type === "text"
                  ? "✍️ Text Inspector"
                  : "🖼️ Element Inspector"
                : "⚙️ Studio Inspector"}
            </span>
            <div className="flex items-center gap-1">
              {selectedElement && (
                <>
                  <button
                    type="button"
                    onClick={() => handleDuplicateElement(selectedElement.id)}
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteElement(selectedElement.id)}
                    className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-[#991B1B] cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              {/* Close Button on Mobile Drawer */}
              <button
                type="button"
                onClick={() => setMobileRightOpen(false)}
                className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Inspector Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            {selectedElement ? (
              <>
                {/* ── 1. TEXT ELEMENT CONTROLS ── */}
                {selectedElement.type === "text" && (
                  <div className="space-y-3.5">
                    {/* Content */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800 text-[11px] block">Text Content</label>
                      <textarea
                        rows={3}
                        value={selectedElement.text || ""}
                        onChange={(e) => updateSelectedElement({ text: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#991B1B] text-xs outline-none bg-slate-50/50 focus:bg-white transition-all resize-y"
                        placeholder="Type text..."
                      />
                    </div>

                    {/* Font Family Selection */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800 text-[11px] block">Typography Font</label>
                      <select
                        value={selectedElement.fontFamily || "'Cormorant Garamond', serif"}
                        onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:border-[#991B1B] focus:bg-white outline-none cursor-pointer"
                      >
                        {CURATED_FONTS.map((font) => (
                          <option key={font.name} value={font.family}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Size and Quick Steppers */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 text-[11px] block">Font Size</label>
                        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedElement({
                                fontSize: Math.max(8, (selectedElement.fontSize || 16) - 2),
                              })
                            }
                            className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 cursor-pointer font-bold"
                            title="Decrease font size"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min={8}
                            max={120}
                            value={selectedElement.fontSize || 16}
                            onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) || 16 })}
                            className="w-full text-center text-xs font-bold bg-transparent outline-none py-1"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedElement({
                                fontSize: Math.min(120, (selectedElement.fontSize || 16) + 2),
                              })
                            }
                            className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 cursor-pointer font-bold"
                            title="Increase font size"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Text Color + Picker */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 text-[11px] block">Text Color</label>
                        <div className="flex items-center gap-1.5 p-1 border border-slate-200 rounded-xl bg-slate-50 h-8">
                          <input
                            type="color"
                            value={selectedElement.color || "#1E293B"}
                            onChange={(e) => updateSelectedElement({ color: e.target.value })}
                            className="w-6 h-6 rounded-lg cursor-pointer border-0 shrink-0"
                          />
                          <span className="text-[10px] font-mono text-slate-600 truncate">{selectedElement.color}</span>
                        </div>
                      </div>
                    </div>

                    {/* Curated Luxury Wedding Swatches */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Royal Palette
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { name: "Royal Gold", hex: "#D4AF37" },
                          { name: "Imperial Crimson", hex: "#991B1B" },
                          { name: "Palace Burgundy", hex: "#4A0E17" },
                          { name: "Midnight Navy", hex: "#0F172A" },
                          { name: "Rose Gold", hex: "#B76E79" },
                          { name: "Emerald", hex: "#064E3B" },
                          { name: "Champagne", hex: "#C5A880" },
                          { name: "Charcoal", hex: "#1E293B" },
                        ].map((swatch) => (
                          <button
                            key={swatch.name}
                            type="button"
                            onClick={() => updateSelectedElement({ color: swatch.hex })}
                            style={{ backgroundColor: swatch.hex }}
                            className={`w-6 h-6 rounded-lg border transition-transform cursor-pointer hover:scale-110 shadow-2xs ${
                              selectedElement.color?.toLowerCase() === swatch.hex.toLowerCase()
                                ? "ring-2 ring-[#991B1B] ring-offset-1 border-white"
                                : "border-black/10"
                            }`}
                            title={swatch.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Typography Style & Align Toolbar */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800 text-[11px] block">Style & Alignment</label>
                      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedElement({
                              fontWeight: selectedElement.fontWeight === "bold" ? "normal" : "bold",
                            })
                          }
                          className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                            selectedElement.fontWeight === "bold"
                              ? "bg-white text-[#991B1B] shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                          title="Bold"
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
                          className={`flex-1 py-1 rounded-lg text-xs italic font-serif transition-all ${
                            selectedElement.fontStyle === "italic"
                              ? "bg-white text-[#991B1B] shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                          title="Italic"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedElement({
                              textDecoration:
                                selectedElement.textDecoration === "underline" ? "none" : "underline",
                            })
                          }
                          className={`flex-1 py-1 rounded-lg text-xs underline transition-all ${
                            selectedElement.textDecoration === "underline"
                              ? "bg-white text-[#991B1B] shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                          title="Underline"
                        >
                          U
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedElement({
                              textTransform:
                                selectedElement.textTransform === "uppercase" ? "none" : "uppercase",
                            })
                          }
                          className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                            selectedElement.textTransform === "uppercase"
                              ? "bg-white text-[#991B1B] shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                          title="Uppercase"
                        >
                          AA
                        </button>
                        <div className="h-4 w-px bg-slate-300 mx-0.5" />
                        {(["left", "center", "right"] as const).map((align) => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => updateSelectedElement({ textAlign: align })}
                            className={`p-1.5 rounded-lg transition-all ${
                              selectedElement.textAlign === align
                                ? "bg-white text-[#991B1B] shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                            title={`Align ${align}`}
                          >
                            {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                            {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                            {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Letter Spacing (Tracking) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 text-[11px]">Letter Spacing (Tracking)</label>
                        <span className="text-[10px] font-mono text-slate-500">
                          {selectedElement.letterSpacing || 0}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-2}
                        max={20}
                        step={0.5}
                        value={selectedElement.letterSpacing || 0}
                        onChange={(e) =>
                          updateSelectedElement({ letterSpacing: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full accent-[#991B1B]"
                      />
                    </div>
                  </div>
                )}

                {/* ── 2. SHAPE ELEMENT CONTROLS ── */}
                {selectedElement.type === "shape" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800">Shape Fill Color</span>
                      <div className="flex items-center gap-1.5 p-1 border border-slate-200 rounded-xl bg-slate-50 h-8">
                        <input
                          type="color"
                          value={selectedElement.backgroundColor || "#D4AF37"}
                          onChange={(e) => updateSelectedElement({ backgroundColor: e.target.value })}
                          className="w-6 h-6 rounded-lg cursor-pointer border-0 shrink-0"
                        />
                        <span className="text-[10px] font-mono text-slate-600">
                          {selectedElement.backgroundColor || "#D4AF37"}
                        </span>
                      </div>
                    </div>

                    {/* Curated Luxury Wedding Swatches */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Royal Palette
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { name: "Royal Gold", hex: "#D4AF37" },
                          { name: "Imperial Crimson", hex: "#991B1B" },
                          { name: "Palace Burgundy", hex: "#4A0E17" },
                          { name: "Midnight Navy", hex: "#0F172A" },
                          { name: "Rose Gold", hex: "#B76E79" },
                          { name: "Emerald", hex: "#064E3B" },
                          { name: "Champagne", hex: "#C5A880" },
                          { name: "White", hex: "#FFFFFF" },
                        ].map((swatch) => (
                          <button
                            key={swatch.name}
                            type="button"
                            onClick={() => updateSelectedElement({ backgroundColor: swatch.hex })}
                            style={{ backgroundColor: swatch.hex }}
                            className={`w-6 h-6 rounded-lg border transition-transform cursor-pointer hover:scale-110 shadow-2xs ${
                              selectedElement.backgroundColor?.toLowerCase() === swatch.hex.toLowerCase()
                                ? "ring-2 ring-[#991B1B] ring-offset-1 border-white"
                                : "border-black/10"
                            }`}
                            title={swatch.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 3. IMAGE / GRAPHIC CONTROLS ── */}
                {selectedElement.type === "image" && (
                  <div className="space-y-3">
                    <label className="font-bold text-slate-800 text-[11px] block">Graphic Actions</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateSelectedElement({ flipH: !selectedElement.flipH })}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          selectedElement.flipH
                            ? "bg-red-50 border-[#991B1B] text-[#991B1B]"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <FlipHorizontal className="w-3.5 h-3.5" />
                        <span>Flip H</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSelectedElement({ flipV: !selectedElement.flipV })}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          selectedElement.flipV
                            ? "bg-red-50 border-[#991B1B] text-[#991B1B]"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <FlipVertical className="w-3.5 h-3.5" />
                        <span>Flip V</span>
                      </button>
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
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      Left
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAlignElement("center")}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      Center
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAlignElement("right")}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      Right
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAlignElement("top")}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      Top
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAlignElement("middle")}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      Middle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAlignElement("bottom")}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      Bottom
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {/* Active Sheet Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Active Card Sheet
                    </span>
                    <span className="text-[9.5px] font-extrabold bg-[#991B1B] text-white px-2 py-0.5 rounded-full">
                      {activeLayer.isBase ? "Base Layer" : `${activeLayer.heightPercent}% Insert`}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-slate-900 text-sm">
                    {activeLayer.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10.5px] text-slate-500 font-mono">
                    <span>{selectedRatio.name}</span>
                    <span>•</span>
                    <span>{activeDimensions.width} × {activeDimensions.height} px</span>
                  </div>
                </div>

                {/* Quick Add Actions */}
                <div className="space-y-2 pt-1">
                  <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                    Quick Add to Sheet
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddTextElement({ text: "Add Headline", fontSize: 28, fontWeight: "bold" })}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/40 text-left transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Type className="w-4 h-4 text-[#991B1B]" />
                      <span className="font-bold text-slate-800 text-xs">Add Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("ASSETS")}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/40 text-left transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-slate-800 text-xs">Add Motif</span>
                    </button>
                  </div>
                </div>

                {/* Background Material Quick Swatches */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                      Sheet Background
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab("SETTINGS")}
                      className="text-[10px] font-bold text-[#991B1B] hover:underline cursor-pointer"
                    >
                      Customize →
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { name: "Texture 1", val: "/images/canva/backgrounds/texture-01.webp" },
                      { name: "Texture 2", val: "/images/canva/backgrounds/texture-02.webp" },
                      { name: "Texture 3", val: "/images/canva/backgrounds/texture-03.webp" },
                      { name: "Parchment", val: "#FAF6EE" },
                      { name: "Ivory", val: "#F3EAD8" },
                      { name: "Burgundy", val: "#4A0E17" },
                      { name: "Navy", val: "#0B192C" },
                      { name: "Blush", val: "#FDF2F2" },
                    ].map((swatch) => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() =>
                          updateActiveLayer({
                            bgMode: swatch.val.startsWith("/") ? "textures" : "solid",
                            backgroundColor: swatch.val.startsWith("/") ? "#F3EAD8" : swatch.val,
                            backgroundImage: swatch.val.startsWith("/") ? swatch.val : null,
                          })
                        }
                        style={{
                          backgroundColor: swatch.val.startsWith("#") ? swatch.val : "#F3EAD8",
                          backgroundImage: swatch.val.startsWith("/") ? `url(${swatch.val})` : undefined,
                          backgroundSize: "cover",
                        }}
                        className="h-10 rounded-xl border border-slate-200 hover:scale-105 hover:border-[#991B1B] transition-all cursor-pointer shadow-2xs"
                        title={swatch.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Sheet Layer Stack Quick View */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                      Sheet Elements ({activeLayer.elements.length})
                    </label>
                  </div>
                  {activeLayer.elements.length === 0 ? (
                    <p className="text-slate-400 text-[11px] italic">No elements placed yet. Tap &ldquo;Add Text&rdquo; or choose a preset.</p>
                  ) : (
                    <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                      {activeLayer.elements.map((el, i) => (
                        <div
                          key={el.id}
                          onClick={() => setSelectedElementId(el.id)}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-red-50/50 border border-slate-200/80 hover:border-[#991B1B] flex items-center justify-between cursor-pointer text-[11px] transition-colors"
                        >
                          <span className="font-bold text-slate-700 truncate max-w-[180px]">
                            {el.type === "text" ? el.text || "Text Box" : el.type === "image" ? "Motif / Image" : "Shape"}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">#{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Helpful Tip */}
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[10.5px] text-amber-900 leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Click on any text or graphic on the card to edit fonts, size, letter spacing, and colors.</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── 📱 MOBILE APP BOTTOM NAVIGATION DOCK (FIXED AT BOTTOM) ── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl lg:hidden select-none"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
        aria-label="Mobile Studio Navigation"
      >
        {/* MODE 1: CONTEXTUAL EDITING TOOLBAR (WHEN ELEMENT IS SELECTED) */}
        {selectedElement ? (
          <div className="flex items-center gap-1.5 px-2 py-2 overflow-x-auto custom-scrollbar bg-slate-900 text-white">
            {/* If Text Element */}
            {selectedElement.type === "text" && (
              <>
                <button
                  type="button"
                  onClick={() => setMobileSheet("INSPECTOR_TEXT")}
                  className="flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <Type className="w-4 h-4 text-red-400" />
                  <span className="text-[9px] font-bold mt-0.5">Edit Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSheet("INSPECTOR_FONT")}
                  className="flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-[9px] font-bold mt-0.5">Font</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSheet("INSPECTOR_SIZE")}
                  className="flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[9px] font-bold mt-0.5">{selectedElement.fontSize || 16}px</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSheet("INSPECTOR_COLOR")}
                  className="flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white/60 shadow-xs"
                    style={{ backgroundColor: selectedElement.color || "#1E293B" }}
                  />
                  <span className="text-[9px] font-bold mt-0.5">Color</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSheet("INSPECTOR_STYLE")}
                  className="flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span className="text-[9px] font-bold mt-0.5">Format</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const aligns: ("left" | "center" | "right")[] = ["left", "center", "right"];
                    const cur = selectedElement.textAlign || "center";
                    const next = aligns[(aligns.indexOf(cur as any) + 1) % aligns.length];
                    updateElementById(selectedElement.id, { textAlign: next });
                  }}
                  className="flex flex-col items-center justify-center min-w-[50px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  {selectedElement.textAlign === "left" ? (
                    <AlignLeft className="w-4 h-4 text-slate-300" />
                  ) : selectedElement.textAlign === "right" ? (
                    <AlignRight className="w-4 h-4 text-slate-300" />
                  ) : (
                    <AlignCenter className="w-4 h-4 text-slate-300" />
                  )}
                  <span className="text-[9px] font-bold mt-0.5 capitalize">{selectedElement.textAlign || "center"}</span>
                </button>
              </>
            )}

            {/* If Image Element */}
            {selectedElement.type === "image" && (
              <>
                <button
                  type="button"
                  onClick={() => setMobileSheet("ASSETS")}
                  className="flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span className="text-[9px] font-bold mt-0.5">Replace</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSheet("INSPECTOR_OPACITY")}
                  className="flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span className="text-[9px] font-bold mt-0.5">Opacity</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateElementById(selectedElement.id, { flipH: !selectedElement.flipH })}
                  className={`flex flex-col items-center justify-center min-w-[50px] py-1 px-1.5 rounded-xl transition-colors cursor-pointer ${
                    selectedElement.flipH ? "bg-red-500/40 text-red-200" : "hover:bg-white/10 text-white"
                  }`}
                >
                  <span className="text-xs">⇄</span>
                  <span className="text-[9px] font-bold mt-0.5">Flip H</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateElementById(selectedElement.id, { flipV: !selectedElement.flipV })}
                  className={`flex flex-col items-center justify-center min-w-[50px] py-1 px-1.5 rounded-xl transition-colors cursor-pointer ${
                    selectedElement.flipV ? "bg-red-500/40 text-red-200" : "hover:bg-white/10 text-white"
                  }`}
                >
                  <span className="text-xs">⇅</span>
                  <span className="text-[9px] font-bold mt-0.5">Flip V</span>
                </button>
              </>
            )}

            {/* If Shape Element */}
            {selectedElement.type === "shape" && (
              <>
                <button
                  type="button"
                  onClick={() => setMobileSheet("INSPECTOR_COLOR")}
                  className="flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white/60 shadow-xs"
                    style={{ backgroundColor: selectedElement.backgroundColor || "#D4AF37" }}
                  />
                  <span className="text-[9px] font-bold mt-0.5">Color</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSheet("INSPECTOR_OPACITY")}
                  className="flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span className="text-[9px] font-bold mt-0.5">Opacity</span>
                </button>
              </>
            )}

            {/* Common Action Buttons: Layer Forward, Duplicate, Delete, Done */}
            <button
              type="button"
              onClick={() => handleMoveLayerZIndex(selectedElement.id, "up")}
              className="flex flex-col items-center justify-center min-w-[50px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
              title="Bring forward"
            >
              <MoveUp className="w-4 h-4 text-slate-300" />
              <span className="text-[9px] font-bold mt-0.5">Forward</span>
            </button>

            <button
              type="button"
              onClick={() => handleDuplicateElement(selectedElement.id)}
              className="flex flex-col items-center justify-center min-w-[50px] py-1 px-1.5 rounded-xl hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
              title="Duplicate"
            >
              <Copy className="w-4 h-4 text-slate-300" />
              <span className="text-[9px] font-bold mt-0.5">Duplicate</span>
            </button>

            <button
              type="button"
              onClick={() => handleDeleteElement(selectedElement.id)}
              className="flex flex-col items-center justify-center min-w-[50px] py-1 px-1.5 rounded-xl hover:bg-red-500/20 active:bg-red-500/30 text-rose-400 transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-[9px] font-bold mt-0.5">Delete</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedElementId(null)}
              className="flex flex-col items-center justify-center min-w-[52px] py-1 px-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors ml-auto shrink-0 cursor-pointer"
              title="Done editing element"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] font-extrabold mt-0.5">Done</span>
            </button>
          </div>
        ) : (
          /* MODE 2: MAIN CREATION DOCK (WHEN NO ELEMENT SELECTED) */
          <div className="flex items-center justify-between px-3 py-1.5">
            {/* 🌟 + Add Button (Primary Action) 🌟 */}
            <button
              type="button"
              onClick={() => {
                setMobileSheet("ADD");
                setMobileAddTab("text");
              }}
              className="flex flex-col items-center justify-center px-3.5 py-1 rounded-2xl bg-gradient-to-r from-[#991B1B] to-[#B91C1C] text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[10px] font-black tracking-wide">Add</span>
            </button>

            {/* Text Presets */}
            <button
              type="button"
              onClick={() => {
                setMobileSheet("ADD");
                setMobileAddTab("text");
              }}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-700 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
            >
              <Type className="w-4 h-4 text-slate-700" />
              <span className="text-[9.5px] font-bold mt-0.5">Text</span>
            </button>

            {/* Motifs & Graphics */}
            <button
              type="button"
              onClick={() => {
                setMobileSheet("ASSETS");
              }}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-700 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-slate-700" />
              <span className="text-[9.5px] font-bold mt-0.5">Graphics</span>
            </button>

            {/* Background & Paper Textures */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("SETTINGS");
                setMobileSettingsTab("bg");
                setMobileSheet("SETTINGS");
              }}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-700 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
            >
              <Palette className="w-4 h-4 text-slate-700" />
              <span className="text-[9.5px] font-bold mt-0.5">Paper</span>
            </button>

            {/* Card Sheets / Multi-Deck Layers */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("LAYERS");
                setMobileSheet("LAYERS");
              }}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-700 hover:text-slate-900 active:scale-95 transition-all relative cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#991B1B]" />
              <span className="text-[9.5px] font-bold mt-0.5">Sheets ({cardLayers.length})</span>
            </button>

            {/* Templates Gallery */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("TEMPLATES");
                setMobileSheet("TEMPLATES");
              }}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-700 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[9.5px] font-bold mt-0.5">Designs</span>
            </button>
          </div>
        )}
      </nav>

      {/* ── 📱 MOBILE APP SLIDING BOTTOM SHEET (MODAL DRAWER) ── */}
      {mobileSheet && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden animate-in fade-in duration-200"
            onClick={() => setMobileSheet(null)}
          />

          {/* Bottom Sheet Modal Container */}
          <div
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-200 lg:hidden select-none"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />

            {/* Sheet Header */}
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                {mobileSheet === "ADD" && (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Add Elements</span>
                  </>
                )}
                {mobileSheet === "ASSETS" && (
                  <>
                    <ImageIcon className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Graphic Motifs & Stickers</span>
                  </>
                )}
                {mobileSheet === "SETTINGS" && (
                  <>
                    <Palette className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Paper & Format</span>
                  </>
                )}
                {mobileSheet === "LAYERS" && (
                  <>
                    <Layers className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Deck Sheets & Elements</span>
                  </>
                )}
                {mobileSheet === "TEMPLATES" && (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pre-Designed Templates</span>
                  </>
                )}
                {mobileSheet === "INSPECTOR_TEXT" && (
                  <>
                    <Type className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Edit Text</span>
                  </>
                )}
                {mobileSheet === "INSPECTOR_FONT" && (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Select Font Family</span>
                  </>
                )}
                {mobileSheet === "INSPECTOR_SIZE" && (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Font Size</span>
                  </>
                )}
                {mobileSheet === "INSPECTOR_COLOR" && (
                  <>
                    <Palette className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Colors & Gradients</span>
                  </>
                )}
                {mobileSheet === "INSPECTOR_STYLE" && (
                  <>
                    <Sliders className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Format & Spacing</span>
                  </>
                )}
                {mobileSheet === "INSPECTOR_OPACITY" && (
                  <>
                    <Sliders className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Opacity</span>
                  </>
                )}
              </h3>

              <button
                type="button"
                onClick={() => setMobileSheet(null)}
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="Close sheet"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet Scrollable Content Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar text-xs">
              {/* ── SHEET: ADD ELEMENTS (TEXT, PRESETS, MOTIFS, SHAPES) ── */}
              {mobileSheet === "ADD" && (
                <div className="space-y-4">
                  {/* Category Chips */}
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setMobileAddTab("text")}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        mobileAddTab === "text" ? "bg-white text-[#991B1B] shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Basic Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileAddTab("presets")}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        mobileAddTab === "presets" ? "bg-white text-[#991B1B] shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Presets (200+)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileAddTab("assets")}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        mobileAddTab === "assets" ? "bg-white text-[#991B1B] shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Motifs
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileAddTab("shapes")}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        mobileAddTab === "shapes" ? "bg-white text-[#991B1B] shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Shapes
                    </button>
                  </div>

                  {/* Add Tab 1: Typography Presets */}
                  {mobileAddTab === "text" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleAddTextElement({ text: "Heading", fontSize: 32, fontWeight: "bold" });
                            setMobileSheet(null);
                          }}
                          className="p-3 rounded-xl border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/40 text-center transition-all cursor-pointer"
                        >
                          <span className="text-base font-bold text-slate-900 block">Heading</span>
                          <span className="text-[9px] text-slate-500">32px Serif</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleAddTextElement({ text: "Subheading", fontSize: 20, fontWeight: "600" });
                            setMobileSheet(null);
                          }}
                          className="p-3 rounded-xl border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/40 text-center transition-all cursor-pointer"
                        >
                          <span className="text-sm font-semibold text-slate-800 block">Subheading</span>
                          <span className="text-[9px] text-slate-500">20px Medium</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleAddTextElement({ text: "Add body description text here...", fontSize: 13 });
                            setMobileSheet(null);
                          }}
                          className="p-3 rounded-xl border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/40 text-center transition-all cursor-pointer"
                        >
                          <span className="text-xs text-slate-700 block truncate">Body text</span>
                          <span className="text-[9px] text-slate-500">13px Regular</span>
                        </button>
                      </div>

                      {/* Quick Wedding Lines */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Quick Invitation Lines
                        </label>
                        {[
                          { label: "Couple Names", text: "Sophia & Alexander", font: "'Great Vibes', cursive", size: 36 },
                          { label: "Formal Header", text: "TOGETHER WITH THEIR FAMILIES\nINVITE YOU TO CELEBRATE THE WEDDING OF", font: "'Cinzel', serif", size: 10 },
                          { label: "Save Our Date", text: "SAVE OUR DATE", font: "'Cinzel', serif", size: 16 },
                          { label: "Ceremony & Reception", text: "WEDDING CEREMONY & RECEPTION", font: "'Montserrat', sans-serif", size: 12 },
                          { label: "Event Date & Time", text: "SATURDAY | OCTOBER 30, 2026 | 6:30 PM", font: "'Montserrat', sans-serif", size: 11 },
                          { label: "Palace Venue", text: "ELAMBA MUDAKKAL PALACE\nKERALA, INDIA", font: "'Cormorant Garamond', serif", size: 12 },
                        ].map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                              handleAddTextElement({
                                text: item.text,
                                fontFamily: item.font,
                                fontSize: item.size,
                              });
                              setMobileSheet(null);
                            }}
                            className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/30 text-left transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span className="font-bold text-slate-800 text-xs">{item.label}</span>
                            <span className="text-[10px] text-slate-500 truncate max-w-[180px] font-mono">
                              {item.text.replace("\n", " ")}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Tab 2: 200+ Categorized Wedding Typography Presets */}
                  {mobileAddTab === "presets" && (
                    <div className="space-y-3">
                      {/* Search */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={textSearchQuery}
                          onChange={(e) => setTextSearchQuery(e.target.value)}
                          placeholder="Search 200+ presets..."
                          className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#991B1B] focus:bg-white"
                        />
                        {textSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setTextSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Horizontal Category Filters */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 custom-scrollbar scrollbar-none">
                        {allTextCategories.map((catName) => {
                          const isSel = selectedTextCategory === catName;
                          const icon = CATEGORY_ICONS[catName] || "✨";
                          return (
                            <button
                              key={catName}
                              type="button"
                              onClick={() => setSelectedTextCategory(catName)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                                isSel
                                  ? "bg-gradient-to-r from-[#991B1B] to-[#7F1D1D] text-white shadow-xs"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60"
                              }`}
                            >
                              <span>{icon}</span>
                              <span>{catName}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Presets List */}
                      {filteredTextPresets.length === 0 ? (
                        <div className="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1.5">
                          <p className="text-xs text-slate-600">No presets found</p>
                          <button
                            type="button"
                            onClick={() => {
                              setTextSearchQuery("");
                              setSelectedTextCategory("All");
                            }}
                            className="text-[11px] font-bold text-[#991B1B]"
                          >
                            Reset filters
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                          {filteredTextPresets.map((cat) => (
                            <div key={cat.category} className="space-y-1.5">
                              <span className="text-[10px] font-extrabold text-[#991B1B] uppercase tracking-wider flex items-center gap-1">
                                <span>{CATEGORY_ICONS[cat.category] || "✨"}</span>
                                <span>{cat.category} ({cat.items.length})</span>
                              </span>
                              {cat.items.map((item) => {
                                const fontDisplayName =
                                  item.fontFamily?.replace(/['",]/g, "").split(" ")[0] || "Serif";
                                return (
                                  <div
                                    key={item.label}
                                    onClick={() => {
                                      handleAddTextElement(item);
                                      setMobileSheet(null);
                                    }}
                                    className="px-3 py-2 border border-slate-200 hover:border-[#991B1B] rounded-xl cursor-pointer hover:bg-red-50/30 transition-all text-left bg-white active:scale-98 shadow-2xs"
                                    title={item.label}
                                  >
                                    <p
                                      style={{
                                        fontFamily: item.fontFamily,
                                        color: item.color,
                                        fontWeight: item.fontWeight as any,
                                        fontStyle: item.fontStyle,
                                      }}
                                      className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap py-0.5"
                                    >
                                      {item.text}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add Tab 3: Motifs & Graphics */}
                  {mobileAddTab === "assets" && (
                    <div className="space-y-3">
                      {/* Upload Button */}
                      <label className="w-full py-2.5 px-3 border border-dashed border-red-300 rounded-xl bg-red-50/50 hover:bg-red-50 text-center flex items-center justify-center gap-2 text-xs font-bold text-[#991B1B] cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Upload Custom Photo / Motif</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            handleImageUpload(e);
                            setMobileSheet(null);
                          }}
                        />
                      </label>

                      {/* Your Account Assets */}
                      {userAssets.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-extrabold text-[#991B1B] uppercase tracking-wider block">
                            Your Account Assets ({userAssets.length})
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {userAssets.map((asset) => (
                              <div
                                key={asset.id}
                                onClick={() => {
                                  handleAddImageElement(asset.url);
                                  setMobileSheet(null);
                                }}
                                className="group relative p-2 border border-slate-200 hover:border-[#991B1B] rounded-xl flex items-center justify-center aspect-square cursor-pointer hover:bg-red-50/40 transition-all"
                              >
                                <img src={asset.url} alt={asset.name || "Asset"} className="max-w-full max-h-full object-contain" />
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteUserAsset(e, asset.id)}
                                  className="absolute top-1 right-1 w-5 h-5 bg-white/95 text-slate-500 hover:text-red-600 rounded-md flex items-center justify-center shadow-xs"
                                  title="Delete from account"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stock Motifs Grid */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                          Curated Motifs ({stockMotifs.length})
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {stockMotifs.map((src, idx) => (
                            <div
                              key={`${src}-${idx}`}
                              onClick={() => {
                                handleAddImageElement(src);
                                setMobileSheet(null);
                              }}
                              className="p-2 border border-slate-200 hover:border-[#991B1B] rounded-xl flex items-center justify-center aspect-square cursor-pointer hover:bg-red-50/40 transition-all"
                            >
                              <img src={src} alt="Motif" className="max-w-full max-h-full object-contain" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add Tab 4: Shapes */}
                  {mobileAddTab === "shapes" && (
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_SHAPES.map((shape) => (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => {
                            handleAddShapeElement(shape);
                            setMobileSheet(null);
                          }}
                          className="p-3 border border-slate-200 hover:border-[#991B1B] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-red-50/40 transition-all"
                        >
                          <div
                            style={{
                              backgroundColor: shape.backgroundColor,
                              width: shape.id.includes("line") ? "80%" : "36px",
                              height: shape.id.includes("line") ? "2px" : "36px",
                              borderRadius: shape.id.includes("circle") ? "50%" : "6px",
                            }}
                          />
                          <span className="text-xs font-bold text-slate-800">{shape.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── SHEET: GRAPHIC MOTIFS & ASSETS ── */}
              {mobileSheet === "ASSETS" && (
                <div className="space-y-3">
                  <label className="w-full py-2.5 px-3 border border-dashed border-red-300 rounded-xl bg-red-50/50 hover:bg-red-50 text-center flex items-center justify-center gap-2 text-xs font-bold text-[#991B1B] cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Upload PNG / Motif</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleImageUpload(e);
                        setMobileSheet(null);
                      }}
                    />
                  </label>

                  {/* Your Account Assets */}
                  {userAssets.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-[#991B1B] uppercase tracking-wider block">
                        Your Account Assets ({userAssets.length})
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {userAssets.map((asset) => (
                          <div
                            key={asset.id}
                            onClick={() => {
                              if (selectedElement && selectedElement.type === "image") {
                                updateElementById(selectedElement.id, { src: asset.url });
                              } else {
                                handleAddImageElement(asset.url);
                              }
                              setMobileSheet(null);
                            }}
                            className="group relative p-2 border border-slate-200 hover:border-[#991B1B] rounded-xl flex items-center justify-center aspect-square cursor-pointer hover:bg-red-50/40 transition-all"
                          >
                            <img src={asset.url} alt={asset.name || "Asset"} className="max-w-full max-h-full object-contain" />
                            <button
                              type="button"
                              onClick={(e) => handleDeleteUserAsset(e, asset.id)}
                              className="absolute top-1 right-1 w-5 h-5 bg-white/95 text-slate-500 hover:text-red-600 rounded-md flex items-center justify-center shadow-xs"
                              title="Delete from account"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                      Curated Motifs ({stockMotifs.length})
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {stockMotifs.map((src, idx) => (
                        <div
                          key={`${src}-${idx}`}
                          onClick={() => {
                            if (selectedElement && selectedElement.type === "image") {
                              updateElementById(selectedElement.id, { src });
                            } else {
                              handleAddImageElement(src);
                            }
                            setMobileSheet(null);
                          }}
                          className="p-2 border border-slate-200 hover:border-[#991B1B] rounded-xl flex items-center justify-center aspect-square cursor-pointer hover:bg-red-50/40 transition-all"
                        >
                          <img src={src} alt="Motif" className="max-w-full max-h-full object-contain" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── SHEET: PAPER TEXTURES, COLORS & DIMENSIONS ── */}
              {mobileSheet === "SETTINGS" && (
                <div className="space-y-4">
                  {/* Mode Selector */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setMobileSettingsTab("bg")}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        mobileSettingsTab === "bg" ? "bg-white text-[#991B1B] shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Paper Textures
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileSettingsTab("format")}
                      className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                        mobileSettingsTab === "format" ? "bg-white text-[#991B1B] shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Dimensions
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(true)}
                      className="py-1.5 rounded-lg bg-[#991B1B] text-white transition-all cursor-pointer font-extrabold flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> New Card
                    </button>
                  </div>

                  {mobileSettingsTab === "bg" ? (
                    <div className="space-y-3">
                      {/* Textures Grid */}
                      <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block">
                        Luxury Wedding Paper Textures
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {texturesList.map((tex) => {
                          const isSel = activeLayer.backgroundImage === tex.src;
                          return (
                            <div
                              key={tex.id}
                              onClick={() => {
                                updateActiveLayer({
                                  backgroundImage: tex.src,
                                  bgMode: "textures",
                                });
                              }}
                              className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                                isSel
                                  ? "border-[#991B1B] ring-2 ring-[#991B1B]/40 bg-red-50/50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <img src={tex.src} alt={tex.name} className="w-10 h-10 rounded-lg object-cover border" />
                              <span className="text-[8.5px] font-bold text-slate-700 truncate w-full text-center">
                                {tex.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Solid Colors */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block">
                          Solid Colors
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { name: "White", val: "#FFFFFF" },
                            { name: "Ivory", val: "#FAF6EE" },
                            { name: "Silk Cream", val: "#F3EAD8" },
                            { name: "Gold Foil", val: "#D4AF37" },
                            { name: "Maroon", val: "#4A0E17" },
                            { name: "Navy", val: "#0B192C" },
                            { name: "Charcoal", val: "#1E293B" },
                          ].map((c) => (
                            <button
                              key={c.val}
                              type="button"
                              onClick={() => {
                                updateActiveLayer({
                                  backgroundColor: c.val,
                                  backgroundImage: null,
                                  bgMode: "solid",
                                });
                              }}
                              style={{ backgroundColor: c.val }}
                              className="w-8 h-8 rounded-full border-2 border-white shadow-md active:scale-95 transition-transform"
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Aspect Ratios */
                    <div className="space-y-2">
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
                                  : "border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-bold text-xs ${isSelected ? "text-[#991B1B]" : "text-slate-800"}`}>
                                  {ratio.shortName}
                                </span>
                                <span className="text-[9px] text-[#991B1B] font-bold">{ratio.ratioStr}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono mt-1">
                                {ratio.width} × {ratio.height}px
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── SHEET: DECK SHEETS, 2.5D PREVIEW & ACTIVE SHEET ELEMENTS ── */}
              {mobileSheet === "LAYERS" && (
                <div className="space-y-4">
                  {/* Sheets Manager */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#991B1B]" />
                        Card Deck Sheets ({cardLayers.length})
                      </label>
                      <button
                        type="button"
                        onClick={handleAddLayer}
                        className="px-2.5 py-1 rounded-lg bg-red-50 text-[#991B1B] hover:bg-red-100 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Sheet
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
                                  className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                                  title="Delete sheet"
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

                  {/* 2.5D Stepped Deck Visualizer */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5 text-[#991B1B]" />
                        Deck Preview
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileSheet(null);
                          setShowStackModal(true);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#991B1B] text-[10px] font-extrabold flex items-center gap-1 shadow-2xs"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Enlarge</span>
                      </button>
                    </div>

                    {/* Stepped Alignment Controls */}
                    <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[10px] font-bold text-center">
                      <button
                        type="button"
                        onClick={() => setStackAlign("bottom")}
                        className={`py-1 rounded-lg transition-all cursor-pointer ${
                          stackAlign === "bottom" ? "bg-[#991B1B] text-white shadow-xs font-extrabold" : "text-slate-600"
                        }`}
                      >
                        Bottom
                      </button>
                      <button
                        type="button"
                        onClick={() => setStackAlign("top")}
                        className={`py-1 rounded-lg transition-all cursor-pointer ${
                          stackAlign === "top" ? "bg-[#991B1B] text-white shadow-xs font-extrabold" : "text-slate-600"
                        }`}
                      >
                        Top
                      </button>
                      <button
                        type="button"
                        onClick={() => setStackAlign("center")}
                        className={`py-1 rounded-lg transition-all cursor-pointer ${
                          stackAlign === "center" ? "bg-[#991B1B] text-white shadow-xs font-extrabold" : "text-slate-600"
                        }`}
                      >
                        Center
                      </button>
                    </div>
                  </div>

                  {/* Elements on Active Sheet */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                      Elements on Active Sheet ({activeLayer.elements.length})
                    </label>
                    {activeLayer.elements.length === 0 ? (
                      <p className="text-center py-4 text-xs text-slate-400">No elements on this sheet yet.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {[...activeLayer.elements].reverse().map((el) => {
                          const isSelected = el.id === selectedElementId;
                          return (
                            <div
                              key={el.id}
                              onClick={() => {
                                setSelectedElementId(el.id);
                                setMobileSheet(null);
                              }}
                              className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-xs font-bold cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-red-50/60 border-[#991B1B] text-[#991B1B] ring-1 ring-[#991B1B]/30"
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
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
                                <span className="truncate">
                                  {el.text || (el.type === "image" ? "Graphic Image" : "Shape")}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateElementById(el.id, { isHidden: !el.isHidden });
                                  }}
                                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                                  title={el.isHidden ? "Unhide" : "Hide"}
                                >
                                  {el.isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-600" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteElement(el.id);
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── SHEET: TEMPLATES GALLERY ── */}
              {mobileSheet === "TEMPLATES" && (
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
                          setMobileSheet(null);
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
              )}

              {/* ── SHEET: INSPECTOR - EDIT TEXT ── */}
              {mobileSheet === "INSPECTOR_TEXT" && selectedElement && selectedElement.type === "text" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block text-xs">Text Content</label>
                    <textarea
                      rows={4}
                      value={selectedElement.text || ""}
                      onChange={(e) => updateSelectedElement({ text: e.target.value })}
                      placeholder="Type your invitation text here..."
                      className="w-full p-3 rounded-xl border border-slate-300 focus:border-[#991B1B] text-sm text-slate-900 outline-none leading-relaxed"
                    />
                  </div>

                  {/* Casing Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateSelectedElement({
                          text: (selectedElement.text || "").toUpperCase(),
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                    >
                      UPPERCASE
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateSelectedElement({
                          text: (selectedElement.text || "").toLowerCase(),
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                    >
                      lowercase
                    </button>
                  </div>
                </div>
              )}

              {/* ── SHEET: INSPECTOR - FONT PICKER ── */}
              {mobileSheet === "INSPECTOR_FONT" && selectedElement && (
                <div className="space-y-2">
                  {CURATED_FONTS.map((font) => {
                    const isSel = selectedElement.fontFamily === font.family;
                    return (
                      <button
                        key={font.name}
                        type="button"
                        onClick={() => {
                          updateSelectedElement({ fontFamily: font.family });
                          setMobileSheet(null);
                        }}
                        style={{ fontFamily: font.family }}
                        className={`w-full p-3 rounded-xl border text-left text-base transition-all flex items-center justify-between cursor-pointer ${
                          isSel
                            ? "border-[#991B1B] bg-red-50/50 text-[#991B1B] ring-2 ring-[#991B1B]/30"
                            : "border-slate-200 hover:bg-slate-50 text-slate-900"
                        }`}
                      >
                        <span>{font.name.split(" (")[0]}</span>
                        {isSel && <Check className="w-4 h-4 text-[#991B1B]" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── SHEET: INSPECTOR - FONT SIZE ── */}
              {mobileSheet === "INSPECTOR_SIZE" && selectedElement && (
                <div className="space-y-5 p-2">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-[#991B1B] font-mono">
                      {selectedElement.fontSize || 16}px
                    </span>
                  </div>

                  <input
                    type="range"
                    min="8"
                    max="96"
                    value={selectedElement.fontSize || 16}
                    onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) })}
                    className="w-full accent-[#991B1B]"
                  />

                  <div className="grid grid-cols-4 gap-2">
                    {[-10, -2, +2, +10].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() =>
                          updateSelectedElement({
                            fontSize: Math.max(8, Math.min(120, (selectedElement.fontSize || 16) + step)),
                          })
                        }
                        className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-800"
                      >
                        {step > 0 ? `+${step}` : step}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SHEET: INSPECTOR - COLOR & GRADIENTS ── */}
              {mobileSheet === "INSPECTOR_COLOR" && selectedElement && (
                <div className="space-y-4">
                  {/* Luxury Color Swatches */}
                  <div className="space-y-2">
                    <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      Luxury Palette Swatches
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { name: "Charcoal", hex: "#1E293B" },
                        { name: "Imperial Gold", hex: "#D4AF37" },
                        { name: "Royal Maroon", hex: "#991B1B" },
                        { name: "Emerald Green", hex: "#065F46" },
                        { name: "Midnight Navy", hex: "#0F172A" },
                        { name: "Deep Ruby", hex: "#7F1D1D" },
                        { name: "Rose Gold", hex: "#B76E79" },
                        { name: "Warm Bronze", hex: "#8A4B29" },
                        { name: "Pure White", hex: "#FFFFFF" },
                        { name: "Jet Black", hex: "#000000" },
                      ].map((item) => (
                        <button
                          key={item.hex}
                          type="button"
                          onClick={() => {
                            if (selectedElement.type === "shape") {
                              updateSelectedElement({ backgroundColor: item.hex });
                            } else {
                              updateSelectedElement({ color: item.hex, textShadow: "none" });
                            }
                          }}
                          className="flex flex-col items-center gap-1 p-2 rounded-xl border border-slate-200 hover:border-slate-300"
                        >
                          <div
                            style={{ backgroundColor: item.hex }}
                            className="w-7 h-7 rounded-full border border-slate-200 shadow-xs"
                          />
                          <span className="text-[8.5px] font-bold text-slate-700 truncate w-full text-center">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Foil Gradients (For Text) */}
                  {selectedElement.type === "text" && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                        Foil & Gradients
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {TEXT_GRADIENTS.filter((g) => g.value).map((grad) => (
                          <button
                            key={grad.name}
                            type="button"
                            onClick={() => updateSelectedElement({ color: "#B38728", textShadow: "0 1px 2px rgba(0,0,0,0.3)" })}
                            className="p-2.5 rounded-xl border border-slate-200 hover:border-[#991B1B] text-left text-xs font-bold"
                          >
                            <div style={{ background: grad.value }} className="h-4 rounded-md mb-1" />
                            <span className="text-[10px] text-slate-800 block truncate">{grad.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Hex Picker */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.color?.startsWith("#") ? selectedElement.color : "#1E293B"}
                      onChange={(e) => updateSelectedElement({ color: e.target.value })}
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedElement.color || "#1E293B"}
                      onChange={(e) => updateSelectedElement({ color: e.target.value })}
                      className="flex-1 p-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                      placeholder="#HEX"
                    />
                  </div>
                </div>
              )}

              {/* ── SHEET: INSPECTOR - FORMAT & SPACING ── */}
              {mobileSheet === "INSPECTOR_STYLE" && selectedElement && selectedElement.type === "text" && (
                <div className="space-y-4">
                  {/* Styling Toggles: Bold, Italic, Underline, Uppercase */}
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      Style & Casing
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedElement({
                            fontWeight: selectedElement.fontWeight === "bold" ? "normal" : "bold",
                          })
                        }
                        className={`py-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1 ${
                          selectedElement.fontWeight === "bold"
                            ? "bg-[#991B1B] text-white border-[#991B1B]"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <Bold className="w-3.5 h-3.5" />
                        <span>Bold</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedElement({
                            fontStyle: selectedElement.fontStyle === "italic" ? "normal" : "italic",
                          })
                        }
                        className={`py-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1 ${
                          selectedElement.fontStyle === "italic"
                            ? "bg-[#991B1B] text-white border-[#991B1B]"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <Italic className="w-3.5 h-3.5" />
                        <span>Italic</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedElement({
                            textDecoration: selectedElement.textDecoration === "underline" ? "none" : "underline",
                          })
                        }
                        className={`py-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1 ${
                          selectedElement.textDecoration === "underline"
                            ? "bg-[#991B1B] text-white border-[#991B1B]"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <Underline className="w-3.5 h-3.5" />
                        <span>Line</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedElement({
                            textTransform: selectedElement.textTransform === "uppercase" ? "none" : "uppercase",
                          })
                        }
                        className={`py-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1 ${
                          selectedElement.textTransform === "uppercase"
                            ? "bg-[#991B1B] text-white border-[#991B1B]"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <span>aA</span>
                        <span>Caps</span>
                      </button>
                    </div>
                  </div>

                  {/* Letter Spacing */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 text-xs">Letter Spacing</label>
                      <span className="text-xs font-mono font-bold text-[#991B1B]">
                        {selectedElement.letterSpacing || 0}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-2"
                      max="12"
                      value={selectedElement.letterSpacing || 0}
                      onChange={(e) => updateSelectedElement({ letterSpacing: Number(e.target.value) })}
                      className="w-full accent-[#991B1B]"
                    />
                  </div>

                  {/* Line Height */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 text-xs">Line Height</label>
                      <span className="text-xs font-mono font-bold text-[#991B1B]">
                        {selectedElement.lineHeight || 1.3}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.9"
                      max="2.2"
                      step="0.1"
                      value={selectedElement.lineHeight || 1.3}
                      onChange={(e) => updateSelectedElement({ lineHeight: Number(e.target.value) })}
                      className="w-full accent-[#991B1B]"
                    />
                  </div>
                </div>
              )}

              {/* ── SHEET: INSPECTOR - OPACITY ── */}
              {mobileSheet === "INSPECTOR_OPACITY" && selectedElement && (
                <div className="space-y-4 p-2">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-[#991B1B] font-mono">
                      {Math.round((selectedElement.opacity ?? 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={selectedElement.opacity ?? 1}
                    onChange={(e) => updateSelectedElement({ opacity: Number(e.target.value) })}
                    className="w-full accent-[#991B1B]"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── 🌟 MODAL: BRAND NEW "CREATE NEW INVITATION CARD" FEATURE 🌟 ── */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
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
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
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
                placeholder="e.g. Wedding Invitation Card"
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

            {/* Step 4: Starting Paper Texture (Pure White FIRST) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">Starting Paper Texture / Theme</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "Pure White", bgMode: "solid" as const, val: "#FFFFFF" },
                  { name: "Silk Cream", bgMode: "solid" as const, val: "#F3EAD8" },
                  { name: "Handmade Ivory", bgMode: "textures" as const, val: "/images/canva/backgrounds/texture-01.webp" },
                  { name: "Gold Foil Fleck", bgMode: "textures" as const, val: "/images/canva/backgrounds/texture-03.webp" },
                  { name: "Vintage Parchment", bgMode: "textures" as const, val: "/images/canva/backgrounds/texture-07.webp" },
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
                        <div style={{ backgroundColor: theme.val }} className="w-8 h-8 rounded-lg border border-slate-200" />
                      )}
                      <span className="text-[10px] font-bold text-slate-800 truncate max-w-full">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Starter Content Style (Blank Canvas FIRST) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Starter Template Style</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCreateStarterStyle("blank")}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    createStarterStyle === "blank"
                      ? "bg-red-50/70 border-[#991B1B] ring-1 ring-[#991B1B]/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xs font-bold block text-slate-900">📄 Blank Canvas</span>
                  <span className="text-[10px] text-slate-500">Start completely clean from scratch</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCreateStarterStyle("classic_names")}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    createStarterStyle === "classic_names"
                      ? "bg-red-50/70 border-[#991B1B] ring-1 ring-[#991B1B]/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xs font-bold block text-slate-900">✨ Royal Wedding Starter</span>
                  <span className="text-[10px] text-slate-500">Includes royal couple headline, floral motifs, date & palace venue</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {userSavedCards.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowGalleryView(true);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>My Saved Cards</span>
                </button>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2">
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
        </div>
      )}

      {/* ── 🌟 MODAL: SAVED CARDS & PROJECTS GALLERY VIEW 🌟 ── */}
      {showGalleryView && (
        <div
          onClick={() => setShowGalleryView(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col custom-scrollbar overflow-hidden"
          >
            {/* Gallery Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#991B1B]">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    My Saved Invitations
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100/70 text-[#991B1B] border border-red-200">
                    {userSavedCards.length} {userSavedCards.length === 1 ? "Card" : "Cards"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Choose a previously designed invitation to resume designing, or start a new card from scratch.
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setShowGalleryView(false);
                    setShowCreateModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGalleryView(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  title="Close and continue editing current canvas"
                >
                  <span>Resume Studio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowGalleryView(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer ml-1"
                  title="Close Gallery"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Gallery Grid Container */}
            <div className="flex-1 overflow-y-auto py-5 pr-1 custom-scrollbar">
              {isLoadingSavedCards ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#991B1B]" />
                  <span className="text-xs font-semibold">Loading your saved invitations...</span>
                </div>
              ) : userSavedCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center text-[#991B1B] shadow-sm mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">No Saved Invitations Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5 leading-relaxed">
                    You haven’t designed or saved any wedding cards yet. Click below to create your first card from scratch with custom dimensions, paper textures, and layers.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowGalleryView(false);
                      setShowCreateModal(true);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Card</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 1. START NEW CARD TILE */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowGalleryView(false);
                      setShowCreateModal(true);
                    }}
                    className="group min-h-[240px] rounded-2xl border-2 border-dashed border-red-200 hover:border-[#991B1B] bg-red-50/30 hover:bg-red-50/70 p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-2xs hover:shadow-md"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-red-200 group-hover:border-[#991B1B] flex items-center justify-center text-[#991B1B] shadow-2xs group-hover:scale-110 transition-all mb-3">
                      <Plus className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-[#991B1B] transition-colors">
                      + Create New Card
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-[210px] leading-relaxed">
                      Design from scratch with custom dimensions, paper textures & multi-sheet decks.
                    </p>
                    <span className="mt-3 px-3 py-1 rounded-full text-[10px] font-extrabold bg-red-100/70 text-[#991B1B] border border-red-200">
                      Start Custom Card
                    </span>
                  </button>

                  {/* 2. USER'S SAVED CARDS */}
                  {userSavedCards.map((card) => {
                    let parsed: any = null;
                    try {
                      parsed = typeof card.cardDataJson === "string" ? JSON.parse(card.cardDataJson) : card.cardDataJson;
                    } catch {}

                    const layers = parsed?.cardLayers || [];
                    const baseLayerObj = layers[0] || {};
                    const layerCount = layers.length || 1;
                    const bgVal = baseLayerObj.backgroundColor || "#F3EAD8";
                    const bgImg = baseLayerObj.backgroundImage || null;
                    const title = card.templateName || "Custom Invitation Card";
                    const isCurrent = currentCardId === card.id;

                    return (
                      <div
                        key={card.id}
                        onClick={() => handleOpenSavedCard(card)}
                        className={`group rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col bg-white shadow-2xs hover:shadow-lg ${
                          isCurrent
                            ? "border-[#991B1B] ring-2 ring-[#991B1B]/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {/* Card Preview Header / Texture Box */}
                        <div
                          className="h-32 w-full relative flex items-center justify-center p-3 border-b border-slate-100 overflow-hidden"
                          style={{
                            backgroundColor: bgVal.startsWith("#") ? bgVal : "#F3EAD8",
                            backgroundImage: bgImg ? `url(${bgImg})` : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          {/* Subtle overlay gradient */}
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />

                          {/* Mini Sheet Badge */}
                          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-extrabold text-slate-800 shadow-2xs border border-white/60">
                            <Layers className="w-3 h-3 text-[#991B1B]" />
                            <span>{layerCount} {layerCount === 1 ? "Sheet" : "Sheets"}</span>
                          </div>

                          {isCurrent && (
                            <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-[#991B1B] text-white text-[10px] font-extrabold shadow-2xs">
                              Active In Studio
                            </div>
                          )}

                          {/* Preview Text Content */}
                          <div className="relative z-10 text-center max-w-[85%] bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-white/80 shadow-xs group-hover:scale-102 transition-transform">
                            <p className="text-[11px] font-black text-slate-900 truncate">
                              {title}
                            </p>
                            {(card.weddingDate || card.partnerOne) && (
                              <p className="text-[9px] font-medium text-slate-600 truncate mt-0.5">
                                {card.partnerOne && card.partnerTwo ? `${card.partnerOne} & ${card.partnerTwo}` : card.weddingDate || ""}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Body & Details */}
                        <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-black text-slate-900 truncate flex-1" title={title}>
                                {title}
                              </h4>
                              {card.isGuestDraft && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                                  Local Draft
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                              {card.updatedAt
                                ? `Updated ${new Date(card.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
                                : "Ready to edit"}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenSavedCard(card);
                              }}
                              className="flex-1 py-1.5 px-3 rounded-xl bg-slate-900 group-hover:bg-[#991B1B] text-white text-xs font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>Open in Studio</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDuplicateSavedCard(e, card)}
                              title="Duplicate this card"
                              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDeleteSavedCard(e, card.id)}
                              title="Delete this card"
                              className="p-1.5 rounded-xl border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PRICING TIERS ── */}
      {showPricingModal && (
        <div
          onClick={() => setShowPricingModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 cursor-default"
          >
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

      {/* ── MODAL: MULTI-DECK PHYSICAL STACK VISUALIZER ── */}
      {showStackModal && (
        <div
          onClick={() => setShowStackModal(false)}
          className="fixed inset-0 z-[105] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 cursor-default"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 text-[#991B1B] flex items-center justify-center font-bold">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-slate-900">
                    Multi-Deck Physical Stack Visualizer
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Visualize how the layered cards align and step over one another when physically printed.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Alignment Toggle */}
                <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setStackAlign("bottom")}
                    className={`py-1 px-2.5 rounded-lg transition-all cursor-pointer ${
                      stackAlign === "bottom"
                        ? "bg-white text-[#991B1B] shadow-xs font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Bottom Stepped
                  </button>
                  <button
                    type="button"
                    onClick={() => setStackAlign("top")}
                    className={`py-1 px-2.5 rounded-lg transition-all cursor-pointer ${
                      stackAlign === "top"
                        ? "bg-white text-[#991B1B] shadow-xs font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Top Stepped
                  </button>
                  <button
                    type="button"
                    onClick={() => setStackAlign("center")}
                    className={`py-1 px-2.5 rounded-lg transition-all cursor-pointer ${
                      stackAlign === "center"
                        ? "bg-white text-[#991B1B] shadow-xs font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Center
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowStackModal(false)}
                  className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                  title="Close Visualizer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {/* Large 2.5D Stack Preview Area */}
              <div className="h-80 sm:h-96 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200/90 rounded-3xl p-6 flex items-center justify-center relative border border-slate-200 shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                <div
                  className={`relative w-full h-full flex justify-center ${
                    stackAlign === "bottom"
                      ? "items-end"
                      : stackAlign === "top"
                      ? "items-start"
                      : "items-center"
                  }`}
                >
                  {(() => {
                    const baseL = cardLayers.find((p) => p.isBase) || cardLayers[0];
                    const baseDim = getLayerDimensions(baseL, baseL);
                    const maxHeightPx = 280;
                    const scaleFactor = maxHeightPx / baseDim.height;

                    const sortedForStack = [...cardLayers]
                      .map((p, origIdx) => ({ layer: p, origIdx }))
                      .sort((a, b) => {
                        const aPct = a.layer.isBase !== false ? 100 : a.layer.heightPercent || 85;
                        const bPct = b.layer.isBase !== false ? 100 : b.layer.heightPercent || 85;
                        return bPct - aPct;
                      });

                    return sortedForStack.map((item, stackPos) => {
                      const { layer: p, origIdx } = item;
                      const isSelected = p.id === activeLayerId;
                      const pDim = getPhysicalDimensions(p, baseL);
                      const renderW = Math.round(pDim.pixelW * scaleFactor);
                      const renderH = Math.round(pDim.pixelH * scaleFactor);

                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setActiveLayerId(p.id);
                            setSelectedElementId(null);
                          }}
                          style={{
                            width: `${renderW}px`,
                            height: `${renderH}px`,
                            zIndex: stackPos + 10,
                            backgroundColor: p.backgroundColor?.startsWith("#") ? p.backgroundColor : "#FFFFFF",
                            backgroundImage: p.backgroundImage ? `url(${p.backgroundImage})` : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                          className={`absolute rounded-2xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl group flex flex-col justify-between p-3 border ${
                            isSelected
                              ? "ring-4 ring-[#991B1B]/40 border-[#991B1B] shadow-2xl scale-[1.02]"
                              : "border-slate-300 hover:scale-[1.01]"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span
                              className={`text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-lg truncate max-w-[140px] ${
                                isSelected
                                  ? "bg-[#991B1B] text-white shadow-2xs"
                                  : "bg-black/60 text-white backdrop-blur-xs"
                              }`}
                            >
                              {p.name || `Sheet ${origIdx + 1}`}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-mono font-bold bg-white/90 text-slate-900 px-1.5 py-0.5 rounded-md shadow-2xs">
                              {pDim.pct}%
                            </span>
                          </div>

                          <div className="flex items-center justify-center w-full">
                            <span className="text-[9px] sm:text-[10px] font-mono font-extrabold bg-white/95 text-slate-900 px-2 py-1 rounded-lg border border-slate-200 shadow-md">
                              {pDim.widthInches} × {pDim.heightInches} ({pDim.widthMm} × {pDim.heightMm})
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Specifications Grid Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(() => {
                  const baseL = cardLayers.find((p) => p.isBase) || cardLayers[0];
                  return cardLayers.map((p, idx) => {
                    const isSelected = p.id === activeLayerId;
                    const pDim = getPhysicalDimensions(p, baseL);

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActiveLayerId(p.id);
                          setSelectedElementId(null);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? "bg-red-50/80 border-[#991B1B] ring-2 ring-[#991B1B]/30 shadow-xs"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
                              p.isBase
                                ? "bg-[#991B1B] text-white"
                                : "bg-slate-200 text-slate-800"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">
                                {p.name || `Sheet ${idx + 1}`}
                              </h4>
                              {p.isBase && (
                                <span className="text-[9px] font-extrabold bg-red-100 text-[#991B1B] px-1.5 py-0.5 rounded-md">
                                  Base
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                              {pDim.widthInches} × {pDim.heightInches} ({pDim.widthMm} × {pDim.heightMm})
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-extrabold text-[#991B1B] bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs block">
                            {pDim.pct}% Height
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 flex items-center justify-end bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setShowStackModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Visualizer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PREVIEW CARD ── */}
      {showPreviewModal && (
        <div
          onClick={() => setShowPreviewModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 cursor-default"
          >
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
