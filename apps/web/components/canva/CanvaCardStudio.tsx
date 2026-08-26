"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Type,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Download,
  RotateCcw,
  RotateCw,
  Trash2,
  Copy,
  Check,
  ChevronLeft,
  Lock,
  Unlock,
  AlignCenter,
  AlignLeft,
  AlignRight,
  MousePointer,
  Wand2,
  Share2,
  Eye,
  EyeOff,
  Sliders,
  X,
  FileText,
  CopyCheck,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Save,
  AlertTriangle,
  Palette,
  MoreHorizontal,
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  ChevronsDown,
  FlipHorizontal,
  FlipVertical,
  CopyPlus,
  ShoppingCart,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Crosshair,
  Minus,
  Plus,
  WrapText,
  Edit3,
  Ruler,
  Upload,
  FolderUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import OrderOrCartModal from "@/components/cart/OrderOrCartModal";

export interface CanvasElement {
  id: string;
  type: "text" | "image" | "shape" | "sticker";
  fieldKey?: string;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: "left" | "center" | "right";
  letterSpacing?: number;
  lineHeight?: number;
  src?: string;
  x: number; // Percentage relative to canvas (0-100)
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  backgroundColor?: string;
  isLocked?: boolean;
  isHidden?: boolean;
  flipH?: boolean;
  flipV?: boolean;
}

export const ASPECT_RATIOS = [
  { id: "classic", name: "Classic (5:7)", shortName: "Classic", width: 480, height: 672, ratioStr: "5:7" },
  { id: "portrait", name: "Story (9:16)", shortName: "Story", width: 420, height: 746, ratioStr: "9:16" },
  { id: "square", name: "Square (1:1)", shortName: "Square", width: 560, height: 560, ratioStr: "1:1" },
  { id: "landscape", name: "Landscape (7:5)", shortName: "Landscape", width: 672, height: 480, ratioStr: "7:5" },
  { id: "cinematic", name: "Cinematic (16:9)", shortName: "Cinematic", width: 746, height: 420, ratioStr: "16:9" },
  { id: "bookmark", name: "Bookmark (1:2)", shortName: "Bookmark", width: 360, height: 720, ratioStr: "1:2" },
  { id: "a4", name: "A4 Print (1:1.41)", shortName: "A4 Print", width: 480, height: 678, ratioStr: "1:1.41" },
  { id: "custom", name: "Free Size", shortName: "Free Size", width: 480, height: 672, ratioStr: "Custom" },
];

export interface CanvasPage {
  id: string;
  title: string;
  name?: string;
  isBase?: boolean;
  heightPercent?: number;
  aspectRatio?: string;
  customWidth?: number;
  customHeight?: number;
  lockRatio?: boolean;
  backgroundColor: string;
  backgroundImage?: string | null;
  bgMode?: string;
  elements: CanvasElement[];
}

export function getLayerDimensions(
  layer: CanvasPage,
  baseLayer?: CanvasPage
): { width: number; height: number; ratioStr: string } {
  const layerRatioObj = ASPECT_RATIOS.find((r) => r.id === layer.aspectRatio);
  const baseRatioObj = baseLayer
    ? ASPECT_RATIOS.find((r) => r.id === baseLayer.aspectRatio) || ASPECT_RATIOS[0]
    : ASPECT_RATIOS[0];

  const rawBaseH = baseLayer?.customHeight || baseRatioObj.height;
  const rawBaseW = baseLayer?.customWidth || baseRatioObj.width;

  if (layer.isBase !== false) {
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

export interface PresetTemplate {
  id: string;
  dbId?: string;
  slug?: string;
  name: string;
  topic: "vintage" | "modern" | string;
  category: string;
  pricePerCard?: number;
  minCopies?: number;
  paperType?: string;
  badge?: string | null;
  previewImage?: string;
  aspectRatio: "portrait" | "square" | "classic" | string;
  backgroundColor: string;
  backgroundImage?: string;
  elements: CanvasElement[] | any;
}

let elementIdCounter = 0;
const createUniqueId = (prefix: string) => `${prefix}-${Date.now()}-${++elementIdCounter}`;

export interface PersonalizationData {
  coupleNames: string;
  groomName?: string;
  brideName?: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  rsvp: string;
  hashtag: string;

  // Modern 1 & 2 Specific Fields
  modernTagline: string;
  modernGroom: string;
  modernBride: string;
  modernDate: string;
  modernWelcome: string;
  modernContact: string;
  modernFamilyWithLove: string;
  modernMarriageVenue: string;
  modernReceptionVenue: string;

  // Modern 3 (Botanical Foliage) Specific Fields
  modern3Host: string;
  modern3GroomFirst: string;
  modern3GroomLast: string;
  modern3BrideFirst: string;
  modern3BrideLast: string;
  modern3DateDay: string;
  modern3DateYear: string;
  modern3DateTime: string;
  modern3VenueTitle: string;
  modern3VenueAddr1: string;
  modern3VenueAddr2: string;
}

const DEFAULT_PERSONALIZATION: PersonalizationData = {
  coupleNames: "Sophia & Alexander",
  groomName: "Alexander",
  brideName: "Sophia",
  eventName: "Wedding Ceremony",
  date: "OCTOBER 30, 2026",
  time: "6:30 PM",
  venue: "Elamba Mudakkal Palace",
  address: "MG Road, Kerala, India",
  rsvp: "+91 98765 43210",
  hashtag: "#SophiaAndAlexander",

  modernTagline: "Praise the lord",
  modernGroom: "Kirubin",
  modernBride: "Asha",
  modernDate: "3  Jan 2024,  Saturday  @10am",
  modernWelcome: "Welcomes you all Kirubin Wedding",
  modernContact: "Place: Karumankoodal\nPhone: 8489520394",
  modernFamilyWithLove: "With love\nM. Tharmar\nS. Rajam",
  modernMarriageVenue: "Marthal Zion C.S.I Church\nMarthal\nTime: 10:30 am",
  modernReceptionVenue: "Holy loosiyal Auditorium\nLocation: Pudur to maindaikadu road\nTime: 6pm",

  modern3Host: "Host(s)",
  modern3GroomFirst: "First Name",
  modern3GroomLast: "last name",
  modern3BrideFirst: "First Name",
  modern3BrideLast: "last name",
  modern3DateDay: "Day and Month",
  modern3DateYear: "Year",
  modern3DateTime: "4:00 PM",
  modern3VenueTitle: "Venue",
  modern3VenueAddr1: "Address Line 1",
  modern3VenueAddr2: "Address Line 2",
};

const FONTS = [
  // 1. Classic & Luxury Serifs
  { name: "Cormorant Garamond (Warm Serif)", family: "'Cormorant Garamond', serif" },
  { name: "Playfair Display (Editorial Serif)", family: "'Playfair Display', serif" },
  { name: "Bodoni Moda (Vogue Fashion Serif)", family: "'Bodoni Moda', serif" },
  { name: "Prata (Didone Luxury Serif)", family: "'Prata', serif" },
  { name: "Marcellus (Roman Statuesque)", family: "'Marcellus', serif" },

  // 2. Royal Roman Caps & Ornate
  { name: "Cinzel (Imperial Roman Caps)", family: "'Cinzel', serif" },
  { name: "Cinzel Decorative (Flourished Gold Caps)", family: "'Cinzel Decorative', serif" },

  // 3. Elegant Calligraphy & Scripts
  { name: "Great Vibes (Classic Wedding Script)", family: "'Great Vibes', cursive" },
  { name: "Alex Brush (Flowing Calligraphy)", family: "'Alex Brush', cursive" },
  { name: "Parisienne (French Romance Script)", family: "'Parisienne', cursive" },
  { name: "Pinyon Script (Royal Copperplate)", family: "'Pinyon Script', cursive" },
  { name: "Sacramento (Fine Monoline Cursive)", family: "'Sacramento', cursive" },

  // 4. Modern Minimalist Sans-Serif
  { name: "Montserrat (Clean Geometric Sans)", family: "'Montserrat', sans-serif" },
  { name: "Outfit (Modern Minimalist Sans)", family: "'Outfit', sans-serif" },
  { name: "Poiret One (1920s Art Deco)", family: "'Poiret One', cursive" },

  // 5. Vintage Gothic / Blackletter / Heavy Poster
  { name: "UnifrakturMaguntia (Vintage Gothic)", family: "'UnifrakturMaguntia', cursive" },
  { name: "Rozha One (Royal Indian Heavy Serif)", family: "'Rozha One', serif" },
  { name: "Abril Fatface (Vintage Poster Serif)", family: "'Abril Fatface', serif" },

  // 6. Playful, Boho & Brush Scripts
  { name: "Dancing Script (Bouncy Script)", family: "'Dancing Script', cursive" },
  { name: "Satisfy (Retro Brush Script)", family: "'Satisfy', cursive" },
  { name: "Caveat (Boho Handwritten)", family: "'Caveat', cursive" },
  { name: "Pacifico (Retro Fun Script)", family: "'Pacifico', cursive" },

  // 7. Specialty Display & Handcrafted
  { name: "Amatic SC (Tall Hand-Drawn Caps)", family: "'Amatic SC', cursive" },
  { name: "Monoton (Retro Multi-Line Neon)", family: "'Monoton', cursive" },
  { name: "Fredericka the Great (Vintage Chalk Serif)", family: "'Fredericka the Great', cursive" },
];

export interface ColorVariant {
  id: string;
  name: string;
  swatchHex: string;
  bgImage: string;
  primaryTextColor: string;
  accentTextColor: string;
  badgeBgColor: string;
}

export const MODERN_FLORAL_COLOR_VARIANTS: ColorVariant[] = [
  {
    id: "purple",
    name: "Amethyst Purple",
    swatchHex: "#8B5CF6",
    bgImage: "/images/canva/modern-floral-purple.webp",
    primaryTextColor: "#3B1B54",
    accentTextColor: "#5B2A6B",
    badgeBgColor: "#4D2C6D",
  },
  {
    id: "blue",
    name: "Royal Sapphire Blue",
    swatchHex: "#3B82F6",
    bgImage: "/images/canva/modern-floral-blue.webp",
    primaryTextColor: "#1E3A8A",
    accentTextColor: "#2563EB",
    badgeBgColor: "#1D4ED8",
  },
  {
    id: "pink",
    name: "Blush Rose Pink",
    swatchHex: "#EC4899",
    bgImage: "/images/canva/modern-floral-pink.webp",
    primaryTextColor: "#831843",
    accentTextColor: "#BE185D",
    badgeBgColor: "#9D174D",
  },
  {
    id: "red",
    name: "Crimson Ruby Red",
    swatchHex: "#EF4444",
    bgImage: "/images/canva/modern-floral-red.webp",
    primaryTextColor: "#7F1D1D",
    accentTextColor: "#B91C1C",
    badgeBgColor: "#991B1B",
  },
  {
    id: "sepia",
    name: "Antique Sepia Bronze",
    swatchHex: "#8B5E3C",
    bgImage: "/images/canva/modern-floral-sepia.webp",
    primaryTextColor: "#452814",
    accentTextColor: "#6B3E1F",
    badgeBgColor: "#5C3619",
  },
  {
    id: "gold",
    name: "Golden Ochre Yellow",
    swatchHex: "#F59E0B",
    bgImage: "/images/canva/modern-floral-gold.webp",
    primaryTextColor: "#713F12",
    accentTextColor: "#A16207",
    badgeBgColor: "#854D0E",
  },
];

export const MODERN_JEWEL_COLOR_VARIANTS: ColorVariant[] = [
  {
    id: "plum",
    name: "Royal Amethyst Plum",
    swatchHex: "#581C87",
    bgImage: "/images/canva/modern2-plum.webp",
    primaryTextColor: "#FFFFFF",
    accentTextColor: "#E5C158",
    badgeBgColor: "#D4AF37",
  },
  {
    id: "navy",
    name: "Midnight Sapphire Navy",
    swatchHex: "#1E3A8A",
    bgImage: "/images/canva/modern2-navy.webp",
    primaryTextColor: "#FFFFFF",
    accentTextColor: "#E5C158",
    badgeBgColor: "#D4AF37",
  },
  {
    id: "emerald",
    name: "Emerald Forest Jade",
    swatchHex: "#065F46",
    bgImage: "/images/canva/modern2-emerald.webp",
    primaryTextColor: "#FFFFFF",
    accentTextColor: "#E5C158",
    badgeBgColor: "#D4AF37",
  },
  {
    id: "burgundy",
    name: "Crimson Ruby Burgundy",
    swatchHex: "#831843",
    bgImage: "/images/canva/modern2-burgundy.webp",
    primaryTextColor: "#FFFFFF",
    accentTextColor: "#E5C158",
    badgeBgColor: "#D4AF37",
  },
  {
    id: "noir",
    name: "Noir Obsidian Charcoal",
    swatchHex: "#18181B",
    bgImage: "/images/canva/modern2-noir.webp",
    primaryTextColor: "#FFFFFF",
    accentTextColor: "#E5C158",
    badgeBgColor: "#D4AF37",
  },
];

export const MODERN_BOTANICAL_COLOR_VARIANTS: ColorVariant[] = [
  {
    id: "navy",
    name: "Midnight Sapphire Navy",
    swatchHex: "#1E3A8A",
    bgImage: "/images/canva/modern3-navy.webp",
    primaryTextColor: "#FFFFFF",
    accentTextColor: "#E2E8F0",
    badgeBgColor: "#1E3A8A",
  },
  {
    id: "emerald",
    name: "Emerald Forest Jade",
    swatchHex: "#065F46",
    bgImage: "/images/canva/modern3-emerald.webp",
    primaryTextColor: "#FFFFFF",
    accentTextColor: "#E2E8F0",
    badgeBgColor: "#065F46",
  },
  {
    id: "plum",
    name: "Royal Amethyst Plum",
    swatchHex: "#581C87",
    bgImage: "/images/canva/modern3-plum.webp",
    primaryTextColor: "#FFFFFF",
    accentTextColor: "#E2E8F0",
    badgeBgColor: "#581C87",
  },
  {
    id: "burgundy",
    name: "Crimson Ruby Burgundy",
    swatchHex: "#831843",
    bgImage: "/images/canva/modern3-burgundy.webp",
    primaryTextColor: "#FFFFFF",
    accentTextColor: "#E2E8F0",
    badgeBgColor: "#831843",
  },
  {
    id: "noir",
    name: "Noir Obsidian Charcoal",
    swatchHex: "#18181B",
    bgImage: "/images/canva/modern3-noir.webp",
    primaryTextColor: "#FFFFFF",
    accentTextColor: "#E2E8F0",
    badgeBgColor: "#27272A",
  },
];

// ─── 1. VINTAGE TEMPLATES COLLECTION ───
const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "vintage-botanical-romance",
    name: "Vintage Botanical Romance",
    topic: "vintage",
    category: "Vintage Floral",
    previewImage: "/images/canva/template1-thumb.webp",
    aspectRatio: "classic",
    backgroundColor: "#F3EAD8",
    backgroundImage: "/images/canva/parchment-bg.jpg",
    elements: [
      {
        id: "top-floral-header",
        type: "image",
        src: "/images/canva/floral-header.webp",
        x: 0,
        y: 0,
        width: 100,
        height: 22,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "leaf-divider-middle",
        type: "image",
        src: "/images/canva/leaf-divider.webp",
        x: 15,
        y: 29,
        width: 70,
        height: 14,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "bottom-floral-footer",
        type: "image",
        src: "/images/canva/floral-footer.webp",
        x: 0,
        y: 78,
        width: 100,
        height: 22,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "tagline-1",
        type: "text",
        fieldKey: "tagline",
        text: "TOGETHER WITH THEIR FAMILIES",
        fontFamily: "'Cinzel', serif",
        fontSize: 13,
        color: "#5C4E3A",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 4,
        x: 10,
        y: 23,
        width: 80,
        height: 6,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "couple-names-1",
        type: "text",
        fieldKey: "coupleNames",
        text: "Sophia & Alexander",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 46,
        color: "#4A3B2A",
        fontWeight: "400",
        textAlign: "center",
        letterSpacing: 1,
        x: 5,
        y: 43,
        width: 90,
        height: 16,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },
      {
        id: "invitation-line-1",
        type: "text",
        fieldKey: "inviteLine",
        text: "Request the pleasure of your company at the celebration of their wedding",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 15,
        color: "#5C4E3A",
        fontWeight: "500",
        textAlign: "center",
        letterSpacing: 1,
        x: 10,
        y: 59,
        width: 80,
        height: 10,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "wedding-date-1",
        type: "text",
        fieldKey: "date",
        text: "OCTOBER 30, 2026",
        fontFamily: "'Cinzel', serif",
        fontSize: 18,
        color: "#8C6B1B",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 3,
        x: 10,
        y: 69,
        width: 80,
        height: 8,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "venue-name-1",
        type: "text",
        fieldKey: "venue",
        text: "ELAMBA MUDAKKAL PALACE",
        fontFamily: "'Cinzel', serif",
        fontSize: 12,
        color: "#5C4E3A",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 73,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "address-line-1",
        type: "text",
        fieldKey: "address",
        text: "MG Road, Trivandrum, Kerala",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 10,
        color: "#5C4E3A",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 1,
        x: 10,
        y: 77,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "rsvp-line-1",
        type: "text",
        fieldKey: "rsvp",
        text: "R.S.V.P +91 98765 43210",
        fontFamily: "'Alex Brush', cursive",
        fontSize: 16,
        color: "#8C6B1B",
        textAlign: "center",
        x: 10,
        y: 81,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
    ],
  },
  {
    id: "royal-parchment-filigree",
    name: "Royal Parchment & Filigree",
    topic: "vintage",
    category: "Vintage Parchment",
    previewImage: "/images/canva/template2-thumb.webp",
    aspectRatio: "classic",
    backgroundColor: "#3A2312",
    backgroundImage: "/images/canva/template2-clean-bg.jpg",
    elements: [
      {
        id: "top-filigree-header-2",
        type: "image",
        src: "/images/canva/vintage-swirl-header.webp",
        x: 10,
        y: 8,
        width: 80,
        height: 10,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "middle-wave-divider-2a",
        type: "image",
        src: "/images/canva/vintage-wave-divider.webp",
        x: 15,
        y: 46,
        width: 70,
        height: 8,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "middle-wave-divider-2b",
        type: "image",
        src: "/images/canva/vintage-wave-divider.webp",
        x: 15,
        y: 64,
        width: 70,
        height: 8,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "bottom-filigree-footer-2",
        type: "image",
        src: "/images/canva/vintage-swirl-footer.webp",
        x: 10,
        y: 84,
        width: 80,
        height: 10,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "parents-line-2",
        type: "text",
        text: "MR. & MRS. JIMMY WHITE",
        fontFamily: "'Cinzel', serif",
        fontSize: 13,
        color: "#3D1C06",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 17,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "request-line-2",
        type: "text",
        text: "request the pleasure of your company",
        fontFamily: "'Alex Brush', cursive",
        fontSize: 22,
        color: "#3D1C06",
        fontWeight: "400",
        textAlign: "center",
        x: 5,
        y: 22,
        width: 90,
        height: 6,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "marriage-subline-2",
        type: "text",
        text: "AT THE MARRIAGE OF",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 10,
        color: "#6B431D",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 3,
        x: 10,
        y: 28,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "couple-names-2",
        type: "text",
        fieldKey: "coupleNames",
        text: "Jessie & Jamie",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 48,
        color: "#2C1203",
        fontWeight: "500",
        textAlign: "center",
        x: 5,
        y: 33,
        width: 90,
        height: 14,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },
      {
        id: "wedding-date-2",
        type: "text",
        fieldKey: "date",
        text: "SATURDAY 13.05.2014",
        fontFamily: "'Rozha One', serif",
        fontSize: 20,
        color: "#3D1C06",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 53,
        width: 80,
        height: 6,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "wedding-time-2",
        type: "text",
        fieldKey: "time",
        text: "11.00 PM",
        fontFamily: "'Cinzel', serif",
        fontSize: 14,
        color: "#3D1C06",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 3,
        x: 10,
        y: 59,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "venue-name-2",
        type: "text",
        fieldKey: "venue",
        text: "ELAMBA MUDAKKAL PALACE",
        fontFamily: "'Cinzel', serif",
        fontSize: 12,
        color: "#3D1C06",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 70,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "address-line-2",
        type: "text",
        fieldKey: "address",
        text: "MG ROAD, TRIVANDRUM, KERALA",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 10,
        color: "#3D1C06",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 74,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "rsvp-line-2",
        type: "text",
        fieldKey: "rsvp",
        text: "R.S.V.P +91 98765 43210",
        fontFamily: "'Alex Brush', cursive",
        fontSize: 18,
        color: "#3D1C06",
        textAlign: "center",
        x: 10,
        y: 78,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
    ],
  },
  {
    id: "vintage-baroque-gold",
    name: "Vintage Baroque Gold Scroll",
    topic: "vintage",
    category: "Baroque Gold",
    previewImage: "/images/canva/template3-thumb.webp",
    aspectRatio: "classic",
    backgroundColor: "#F6EFE0",
    backgroundImage: "/images/canva/template3-vintage-frame.jpg",
    elements: [
      {
        id: "tagline-3",
        type: "text",
        fieldKey: "tagline",
        text: "TOGETHER WITH THEIR FAMILIES",
        fontFamily: "'Cinzel', serif",
        fontSize: 12,
        color: "#6B4E2E",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 4,
        x: 10,
        y: 18,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "invite-courtesy-3",
        type: "text",
        text: "cordially invite you to celebrate the wedding of",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 15,
        color: "#5C4528",
        fontStyle: "italic",
        fontWeight: "500",
        textAlign: "center",
        x: 10,
        y: 26,
        width: 80,
        height: 6,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "couple-names-3",
        type: "text",
        fieldKey: "coupleNames",
        text: "Sophia & Alexander",
        fontFamily: "'Pinyon Script', cursive",
        fontSize: 34,
        color: "#4A3319",
        fontWeight: "400",
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
        id: "wedding-date-3",
        type: "text",
        fieldKey: "date",
        text: "OCTOBER 30, 2026",
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: 18,
        color: "#8C6B1B",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 3,
        x: 10,
        y: 54,
        width: 80,
        height: 6,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "wedding-time-3",
        type: "text",
        fieldKey: "time",
        text: "AT 6:30 IN THE EVENING",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 11,
        color: "#6B4E2E",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 62,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "venue-name-3",
        type: "text",
        fieldKey: "venue",
        text: "ELAMBA MUDAKKAL PALACE",
        fontFamily: "'Cinzel', serif",
        fontSize: 13,
        color: "#4A3319",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 70,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "address-line-3",
        type: "text",
        fieldKey: "address",
        text: "MG ROAD, TRIVANDRUM, KERALA",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 10,
        color: "#6B4E2E",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 76,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "rsvp-line-3",
        type: "text",
        fieldKey: "rsvp",
        text: "R.S.V.P +91 98765 43210",
        fontFamily: "'Alex Brush', cursive",
        fontSize: 18,
        color: "#6B4E2E",
        textAlign: "center",
        x: 10,
        y: 82,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
    ],
  },
  {
    id: "antique-parchment-victorian",
    name: "Antique Parchment & Victorian Swirl",
    topic: "vintage",
    category: "Vintage Victorian",
    previewImage: "/images/canva/template4-thumb.webp",
    aspectRatio: "classic",
    backgroundColor: "#E8DCBF",
    backgroundImage: "/images/canva/template4-parchment-bg.jpg",
    elements: [
      {
        id: "victorian-top-arch-4",
        type: "image",
        src: "/images/canva/victorian-header-swirl.webp",
        x: 10,
        y: 4,
        width: 80,
        height: 15,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "tagline-4",
        type: "text",
        fieldKey: "tagline",
        text: "TOGETHER WITH THEIR FAMILIES",
        fontFamily: "'Cinzel', serif",
        fontSize: 12,
        color: "#2B1A0E",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 3,
        x: 10,
        y: 20,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "couple-names-4",
        type: "text",
        fieldKey: "coupleNames",
        text: "Sophia & Alexander",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 36,
        color: "#1C1108",
        fontWeight: "400",
        textAlign: "center",
        x: 10,
        y: 26,
        width: 80,
        height: 8,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },
      {
        id: "invite-line-4",
        type: "text",
        fieldKey: "inviteLine",
        text: "REQUEST THE HONOUR OF YOUR PRESENCE AT THEIR MARRIAGE",
        fontFamily: "'Cinzel', serif",
        fontSize: 10,
        color: "#2B1A0E",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 5,
        y: 36,
        width: 90,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "wedding-date-4",
        type: "text",
        fieldKey: "date",
        text: "SATURDAY  •  10.30.26  •  6:30 P.M.",
        fontFamily: "'Bodoni Moda', serif",
        fontSize: 13,
        color: "#1C1108",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 43,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "venue-name-4",
        type: "text",
        fieldKey: "venue",
        text: "ELAMBA MUDAKKAL PALACE",
        fontFamily: "'Cinzel', serif",
        fontSize: 12,
        color: "#2B1A0E",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 50,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "address-line-4",
        type: "text",
        fieldKey: "address",
        text: "MG ROAD, TRIVANDRUM, KERALA",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 10,
        color: "#4A321E",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 55,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "victorian-center-divider-4",
        type: "image",
        src: "/images/canva/victorian-center-divider.webp",
        x: 35,
        y: 61,
        width: 30,
        height: 3,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "reception-courtesy-4",
        type: "text",
        text: "Reception to follow at six o'clock",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 22,
        color: "#2B1A0E",
        textAlign: "center",
        x: 10,
        y: 66,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "rsvp-line-4",
        type: "text",
        fieldKey: "rsvp",
        text: "R.S.V.P +91 98765 43210",
        fontFamily: "'Cinzel', serif",
        fontSize: 11,
        color: "#2B1A0E",
        fontWeight: "700",
        letterSpacing: 2,
        textAlign: "center",
        x: 10,
        y: 73,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "victorian-bottom-arch-4",
        type: "image",
        src: "/images/canva/victorian-footer-swirl.webp",
        x: 10,
        y: 79,
        width: 80,
        height: 16,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
    ],
  },
  // ─── 2. MODERN TEMPLATES COLLECTION ───
  {
    id: "modern-watercolor-floral",
    name: "Modern Watercolor Floral & Rings",
    topic: "modern",
    category: "Modern Floral",
    previewImage: "/images/canva/modern-floral-thumb.webp",
    aspectRatio: "classic",
    backgroundColor: "#FAF9FC",
    backgroundImage: "/images/canva/modern-floral-purple.webp",
    elements: [
      {
        id: "cross-icon-m1",
        type: "text",
        text: "✝",
        fontFamily: "sans-serif",
        fontSize: 26,
        color: "#5B84B1",
        fontWeight: "400",
        textAlign: "center",
        x: 40,
        y: 4,
        width: 20,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "praise-lord-m1",
        type: "text",
        fieldKey: "tagline",
        text: "Praise the lord",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 9.5,
        color: "#3B1B54",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 1.5,
        x: 10,
        y: 8.5,
        width: 80,
        height: 3,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "heading-m1",
        type: "text",
        text: "Wedding Invitation",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 32,
        color: "#3B1B54",
        fontWeight: "400",
        textAlign: "center",
        x: 5,
        y: 12,
        width: 90,
        height: 7,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "groom-name-m1",
        type: "text",
        fieldKey: "coupleNames",
        text: "Kirubin",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 36,
        color: "#2C1838",
        fontWeight: "700",
        textAlign: "center",
        x: 10,
        y: 19.5,
        width: 80,
        height: 7,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },
      {
        id: "rings-motif-m1",
        type: "image",
        src: "/images/canva/interlocked-rings.svg",
        x: 40,
        y: 27,
        width: 20,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "bride-name-m1",
        type: "text",
        text: "Asha",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 36,
        color: "#2C1838",
        fontWeight: "700",
        textAlign: "center",
        x: 10,
        y: 32,
        width: 80,
        height: 7,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },
      {
        id: "star-divider-m1",
        type: "text",
        text: "✦  •  ✦  •  ✦  •  ✦  •  ✦  •  ✦  •  ✦",
        fontFamily: "sans-serif",
        fontSize: 8,
        color: "#8C6B99",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 15,
        y: 39.5,
        width: 70,
        height: 2.5,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "save-date-m1",
        type: "text",
        text: "Save the Date",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 28,
        color: "#3B1B54",
        fontWeight: "400",
        textAlign: "center",
        x: 10,
        y: 43,
        width: 80,
        height: 6,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "date-line-m1",
        type: "text",
        fieldKey: "date",
        text: "3  Jan 2024,  Saturday  @10am",
        fontFamily: "'Playfair Display', serif",
        fontSize: 13,
        color: "#2C1838",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 1,
        x: 10,
        y: 50,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "welcome-sentence-m1",
        type: "text",
        text: "Welcomes you all Kirubin Wedding",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 20,
        color: "#3B1B54",
        fontWeight: "400",
        textAlign: "center",
        x: 10,
        y: 55.5,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "contact-info-m1",
        type: "text",
        fieldKey: "address",
        text: "Place: Karumankoodal\nPhone: 8489520394",
        fontFamily: "'Playfair Display', serif",
        fontSize: 9.5,
        color: "#2C1838",
        fontWeight: "600",
        textAlign: "left",
        x: 7,
        y: 62.5,
        width: 44,
        height: 6.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "family-info-m1",
        type: "text",
        text: "With love\nM. Tharmar\nS. Rajam",
        fontFamily: "'Playfair Display', serif",
        fontSize: 9.5,
        color: "#2C1838",
        fontWeight: "600",
        textAlign: "right",
        x: 50,
        y: 62.5,
        width: 43,
        height: 7.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "badge-marriage-m1",
        type: "text",
        text: "Marriage",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 14,
        color: "#FFFFFF",
        backgroundColor: "#4D2C6D",
        fontWeight: "700",
        textAlign: "center",
        x: 12,
        y: 72,
        width: 32,
        height: 3.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "marriage-details-m1",
        type: "text",
        fieldKey: "venue",
        text: "Marthal Zion C.S.I Church\nMarthal\nTime: 10:30 am",
        fontFamily: "'Playfair Display', serif",
        fontSize: 9,
        color: "#2C1838",
        fontWeight: "600",
        textAlign: "center",
        x: 5,
        y: 77,
        width: 46,
        height: 8.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "badge-reception-m1",
        type: "text",
        text: "Reception",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 14,
        color: "#FFFFFF",
        backgroundColor: "#4D2C6D",
        fontWeight: "700",
        textAlign: "center",
        x: 56,
        y: 72,
        width: 32,
        height: 3.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "reception-details-m1",
        type: "text",
        text: "Holy loosiyal Auditorium\nLocation: Pudur to maindaikadu road\nTime: 6pm",
        fontFamily: "'Playfair Display', serif",
        fontSize: 9,
        color: "#2C1838",
        fontWeight: "600",
        textAlign: "center",
        x: 50,
        y: 77,
        width: 46,
        height: 8.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
    ],
  },
  {
    id: "modern-watercolor-gold-splatter",
    name: "Modern Jewel Watercolor & Gold Foil",
    topic: "modern",
    category: "Luxury Watercolor",
    previewImage: "/images/canva/modern2-thumb.webp",
    aspectRatio: "classic",
    backgroundColor: "#1D0B2B",
    backgroundImage: "/images/canva/modern2-plum.webp",
    elements: [
      {
        id: "cross-icon-m2",
        type: "text",
        text: "✝",
        fontFamily: "sans-serif",
        fontSize: 26,
        color: "#E5C158",
        fontWeight: "400",
        textAlign: "center",
        x: 40,
        y: 4,
        width: 20,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "praise-lord-m2",
        type: "text",
        fieldKey: "tagline",
        text: "Praise the lord",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 9.5,
        color: "#E5C158",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 1.5,
        x: 10,
        y: 8.5,
        width: 80,
        height: 3,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "heading-m2",
        type: "text",
        text: "Wedding Invitation",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 32,
        color: "#FFFFFF",
        fontWeight: "400",
        textAlign: "center",
        x: 5,
        y: 12,
        width: 90,
        height: 7,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "groom-name-m2",
        type: "text",
        fieldKey: "coupleNames",
        text: "Kirubin",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 36,
        color: "#FFFFFF",
        fontWeight: "700",
        textAlign: "center",
        x: 10,
        y: 19.5,
        width: 80,
        height: 7,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },
      {
        id: "rings-motif-m2",
        type: "image",
        src: "/images/canva/interlocked-rings.svg",
        x: 40,
        y: 27,
        width: 20,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "bride-name-m2",
        type: "text",
        text: "Asha",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 36,
        color: "#FFFFFF",
        fontWeight: "700",
        textAlign: "center",
        x: 10,
        y: 32,
        width: 80,
        height: 7,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },
      {
        id: "star-divider-m2",
        type: "text",
        text: "✦  •  ✦  •  ✦  •  ✦  •  ✦  •  ✦  •  ✦",
        fontFamily: "sans-serif",
        fontSize: 8,
        color: "#E5C158",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 15,
        y: 39.5,
        width: 70,
        height: 2.5,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "save-date-m2",
        type: "text",
        text: "Save the Date",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 28,
        color: "#FFFFFF",
        fontWeight: "400",
        textAlign: "center",
        x: 10,
        y: 43,
        width: 80,
        height: 6,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "date-line-m2",
        type: "text",
        fieldKey: "date",
        text: "3  Jan 2024,  Saturday  @10am",
        fontFamily: "'Playfair Display', serif",
        fontSize: 13,
        color: "#E5C158",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 1,
        x: 10,
        y: 50,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "welcome-sentence-m2",
        type: "text",
        text: "Welcomes you all Kirubin Wedding",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 20,
        color: "#FFFFFF",
        fontWeight: "400",
        textAlign: "center",
        x: 10,
        y: 55.5,
        width: 80,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "contact-info-m2",
        type: "text",
        fieldKey: "address",
        text: "Place: Karumankoodal\nPhone: 8489520394",
        fontFamily: "'Playfair Display', serif",
        fontSize: 9.5,
        color: "#E2E8F0",
        fontWeight: "600",
        textAlign: "left",
        x: 7,
        y: 62.5,
        width: 44,
        height: 6.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "family-info-m2",
        type: "text",
        text: "With love\nM. Tharmar\nS. Rajam",
        fontFamily: "'Playfair Display', serif",
        fontSize: 9.5,
        color: "#E2E8F0",
        fontWeight: "600",
        textAlign: "right",
        x: 50,
        y: 62.5,
        width: 43,
        height: 7.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "badge-marriage-m2",
        type: "text",
        text: "Marriage",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 14,
        color: "#FFFFFF",
        backgroundColor: "#B58328",
        fontWeight: "700",
        textAlign: "center",
        x: 12,
        y: 72,
        width: 32,
        height: 3.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "marriage-details-m2",
        type: "text",
        fieldKey: "venue",
        text: "Marthal Zion C.S.I Church\nMarthal\nTime: 10:30 am",
        fontFamily: "'Playfair Display', serif",
        fontSize: 9,
        color: "#FFFFFF",
        fontWeight: "600",
        textAlign: "center",
        x: 5,
        y: 77,
        width: 46,
        height: 8.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "badge-reception-m2",
        type: "text",
        text: "Reception",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 14,
        color: "#FFFFFF",
        backgroundColor: "#B58328",
        fontWeight: "700",
        textAlign: "center",
        x: 56,
        y: 72,
        width: 32,
        height: 3.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "reception-details-m2",
        type: "text",
        text: "Holy loosiyal Auditorium\nLocation: Pudur to maindaikadu road\nTime: 6pm",
        fontFamily: "'Playfair Display', serif",
        fontSize: 9,
        color: "#FFFFFF",
        fontWeight: "600",
        textAlign: "center",
        x: 50,
        y: 77,
        width: 46,
        height: 8.5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
    ],
  },
  {
    id: "modern-silver-botanical-foliage",
    name: "Modern Botanical Foliage & Night Sky",
    topic: "modern",
    category: "Botanical Silver",
    previewImage: "/images/canva/modern3-thumb.webp",
    aspectRatio: "classic",
    backgroundColor: "#062044",
    backgroundImage: "/images/canva/modern3-navy.webp",
    elements: [
      // 🌿 TWO-PART SILVER BOTANICAL FOLIAGE (TOP & BOTTOM)
      {
        id: "modern3-foliage-top",
        type: "image",
        src: "/images/canva/modern3-foliage-top.webp",
        x: 0,
        y: 0,
        width: 100,
        height: 50.8,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "modern3-foliage-bottom",
        type: "image",
        src: "/images/canva/modern3-foliage-bottom.webp",
        x: 0,
        y: 48.8,
        width: 100,
        height: 51.2,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },

      // ── 1. HOST & INVITATION LINES ──
      {
        id: "host-names-m3",
        type: "text",
        fieldKey: "tagline",
        text: "Host(s)",
        fontFamily: "'Playfair Display', serif",
        fontSize: 13,
        color: "#E2E8F0",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 1,
        x: 10,
        y: 22,
        width: 80,
        height: 3,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "invite-line1-m3",
        type: "text",
        text: "Request the honour of your presence",
        fontFamily: "'Playfair Display', serif",
        fontSize: 12,
        color: "#CBD5E1",
        fontWeight: "400",
        textAlign: "center",
        x: 5,
        y: 25,
        width: 90,
        height: 3,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "invite-line2-m3",
        type: "text",
        text: "At the marriage of their daughter",
        fontFamily: "'Playfair Display', serif",
        fontSize: 12,
        color: "#CBD5E1",
        fontWeight: "400",
        textAlign: "center",
        x: 5,
        y: 28,
        width: 90,
        height: 3,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },

      // ── 2. FIRST COUPLE (GROOM) ──
      {
        id: "groom-first-m3",
        type: "text",
        fieldKey: "coupleNames",
        text: "First Name",
        fontFamily: "'Playfair Display', serif",
        fontSize: 27,
        color: "#FFFFFF",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 1,
        x: 10,
        y: 33.5,
        width: 80,
        height: 4.5,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },
      {
        id: "groom-last-m3",
        type: "text",
        text: "last name",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 25,
        color: "#E2E8F0",
        fontWeight: "400",
        textAlign: "center",
        x: 10,
        y: 38,
        width: 80,
        height: 4.5,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },

      // ── 3. AMPERSAND MOTIF ──
      {
        id: "ampersand-m3",
        type: "text",
        text: "&",
        fontFamily: "'Playfair Display', serif",
        fontSize: 32,
        color: "#FFFFFF",
        fontWeight: "400",
        textAlign: "center",
        x: 35,
        y: 43.5,
        width: 30,
        height: 5,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },

      // ── 4. SECOND COUPLE (BRIDE) ──
      {
        id: "bride-first-m3",
        type: "text",
        text: "First Name",
        fontFamily: "'Playfair Display', serif",
        fontSize: 27,
        color: "#FFFFFF",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 1,
        x: 10,
        y: 49,
        width: 80,
        height: 4.5,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },
      {
        id: "bride-last-m3",
        type: "text",
        text: "last name",
        fontFamily: "'Great Vibes', cursive",
        fontSize: 25,
        color: "#E2E8F0",
        fontWeight: "400",
        textAlign: "center",
        x: 10,
        y: 53.5,
        width: 80,
        height: 4.5,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },

      // ── 5. DATE & TIME ──
      {
        id: "date-day-m3",
        type: "text",
        fieldKey: "date",
        text: "Day and Month",
        fontFamily: "'Playfair Display', serif",
        fontSize: 12,
        color: "#E2E8F0",
        fontWeight: "600",
        textAlign: "center",
        x: 10,
        y: 60.5,
        width: 80,
        height: 2.8,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "date-year-m3",
        type: "text",
        text: "Year",
        fontFamily: "'Playfair Display', serif",
        fontSize: 12,
        color: "#E2E8F0",
        fontWeight: "600",
        textAlign: "center",
        x: 10,
        y: 63.5,
        width: 80,
        height: 2.8,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "date-time-m3",
        type: "text",
        fieldKey: "time",
        text: "4:00 PM",
        fontFamily: "'Playfair Display', serif",
        fontSize: 12,
        color: "#E2E8F0",
        fontWeight: "600",
        textAlign: "center",
        x: 10,
        y: 66.5,
        width: 80,
        height: 2.8,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },

      // ── 6. VENUE & ADDRESS ──
      {
        id: "venue-title-m3",
        type: "text",
        fieldKey: "venue",
        text: "Venue",
        fontFamily: "'Playfair Display', serif",
        fontSize: 13,
        color: "#FFFFFF",
        fontWeight: "700",
        textAlign: "center",
        x: 10,
        y: 71.5,
        width: 80,
        height: 3,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "venue-line1-m3",
        type: "text",
        fieldKey: "address",
        text: "Address Line 1",
        fontFamily: "'Playfair Display', serif",
        fontSize: 11,
        color: "#CBD5E1",
        fontWeight: "500",
        textAlign: "center",
        x: 10,
        y: 74.5,
        width: 80,
        height: 2.8,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "venue-line2-m3",
        type: "text",
        text: "Address Line 2",
        fontFamily: "'Playfair Display', serif",
        fontSize: 11,
        color: "#CBD5E1",
        fontWeight: "500",
        textAlign: "center",
        x: 10,
        y: 77.5,
        width: 80,
        height: 2.8,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
    ],
  },
];

const GRAPHIC_ELEMENTS = [
  // ── 1. FLORAL MOTIFS ──
  { id: "modern-floral-blue", name: "Royal Blue Rose Bouquet", templateId: "all", category: "florals", icon: "🌹", src: "/images/canva/modern-floral-blue.webp" },
  { id: "modern-floral-gold", name: "Golden Blossom Motif", templateId: "all", category: "florals", icon: "✨", src: "/images/canva/modern-floral-gold.webp" },
  { id: "modern-floral-pink", name: "Blush Peony Floral", templateId: "all", category: "florals", icon: "🌸", src: "/images/canva/modern-floral-pink.webp" },
  { id: "modern-floral-purple", name: "Imperial Purple Rose", templateId: "all", category: "florals", icon: "💜", src: "/images/canva/modern-floral-purple.webp" },
  { id: "modern-floral-red", name: "Crimson Rose Motif", templateId: "all", category: "florals", icon: "🌹", src: "/images/canva/modern-floral-red.webp" },
  { id: "modern-floral-sepia", name: "Vintage Sepia Rose", templateId: "all", category: "florals", icon: "🍂", src: "/images/canva/modern-floral-sepia.webp" },
  { id: "floral-header-t1", name: "Vintage Floral Top Header", templateId: "all", category: "florals", icon: "🌸", src: "/images/canva/floral-header.webp" },
  { id: "floral-footer-t1", name: "Vintage Floral Bottom Footer", templateId: "all", category: "florals", icon: "🌺", src: "/images/canva/floral-footer.webp" },

  // ── 2. BOTANICAL & FOLIAGE ──
  { id: "modern3-foliage-top", name: "Silver Botanical Top Foliage", templateId: "all", category: "botanical", icon: "🌿", src: "/images/canva/modern3-foliage-top.webp" },
  { id: "modern3-foliage-bottom", name: "Silver Botanical Bottom Foliage", templateId: "all", category: "botanical", icon: "🍃", src: "/images/canva/modern3-foliage-bottom.webp" },
  { id: "leaf-divider-t1", name: "Botanical Leaf Sprig", templateId: "all", category: "botanical", icon: "🌿", src: "/images/canva/leaf-divider.webp" },
  { id: "modern2-fill", name: "Geometric Luxury Fill", templateId: "all", category: "botanical", icon: "💎", src: "/images/canva/modern2-fill.webp" },

  // ── 3. VICTORIAN SWIRLS & DIVIDERS ──
  { id: "victorian-arch-top-t4", name: "Victorian Swirl Arch Top", templateId: "all", category: "swirls", icon: "⚜️", src: "/images/canva/victorian-header-swirl.webp" },
  { id: "victorian-arch-bottom-t4", name: "Victorian Swirl Arch Bottom", templateId: "all", category: "swirls", icon: "⚜️", src: "/images/canva/victorian-footer-swirl.webp" },
  { id: "victorian-divider-t4", name: "Victorian Center Divider", templateId: "all", category: "swirls", icon: "✦", src: "/images/canva/victorian-center-divider.webp" },
  { id: "victorian-date-badge-t4", name: "Victorian Date Banner", templateId: "all", category: "swirls", icon: "📅", src: "/images/canva/victorian-date-badge.webp" },
  { id: "swirl-header-t2", name: "Royal Swirl Header", templateId: "all", category: "swirls", icon: "📜", src: "/images/canva/vintage-swirl-header.webp" },
  { id: "wave-divider-t2", name: "Filigree Wave Divider", templateId: "all", category: "swirls", icon: "〰️", src: "/images/canva/vintage-wave-divider.webp" },
  { id: "swirl-footer-t2", name: "Royal Swirl Footer", templateId: "all", category: "swirls", icon: "📜", src: "/images/canva/vintage-swirl-footer.webp" },

  // ── 4. SEALS, RINGS & FRAMES ──
  { id: "interlocked-rings", name: "Interlocked Gold Rings", templateId: "all", category: "seals", icon: "💍", src: "/images/canva/interlocked-rings.svg" },
  { id: "gold-arch", name: "Gold Arch Frame", templateId: "all", category: "seals", icon: "🏛️" },
  { id: "golden-rings", name: "Golden Rings", templateId: "all", category: "seals", icon: "💍" },
  { id: "wax-seal", name: "Royal Wax Seal", templateId: "all", category: "seals", icon: "🏵️" },
];

const INITIAL_PAGES: CanvasPage[] = [
  {
    id: "layer-1",
    title: "Main Invitation (Base)",
    name: "Main Invitation (Base)",
    isBase: true,
    heightPercent: 100,
    aspectRatio: "classic",
    customWidth: 480,
    customHeight: 672,
    lockRatio: true,
    backgroundColor: PRESET_TEMPLATES[0].backgroundColor,
    backgroundImage: PRESET_TEMPLATES[0].backgroundImage,
    bgMode: "textures",
    elements: PRESET_TEMPLATES[0].elements,
  },
];

const getInitialDraft = () => {
  if (typeof window === "undefined") return null;
  try {
    const savedDraft = localStorage.getItem("canva_draft_design");
    if (savedDraft) return JSON.parse(savedDraft);
  } catch (e) {
    console.error("Failed to load local draft:", e);
  }
  return null;
};

export default function CanvaCardStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const itemIdParam = searchParams.get("itemId");

  const [adminOrderContext, setAdminOrderContext] = useState<{
    orderId: string;
    itemId: string;
    orderNumber: string;
    templateName: string;
    initialDetails: Record<string, unknown>;
  } | null>(null);
  const [savingAdminOrder, setSavingAdminOrder] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: session, status } = useSession();
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  // Dynamic DB Templates State
  const [dynamicTemplates, setDynamicTemplates] = useState<PresetTemplate[]>([]);

  useEffect(() => {
    async function loadDynamicTemplates() {
      try {
        const res = await fetch("/api/canva/templates", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data.templates) && data.templates.length > 0) {
          setDynamicTemplates(data.templates);
        }
      } catch (e) {
        console.warn("Failed to load dynamic templates:", e);
      }
    }
    loadDynamicTemplates();
  }, []);

  // Preload Order Item for Admin Editing Mode
  useEffect(() => {
    if (!orderIdParam || !itemIdParam) return;

    async function fetchOrderForAdmin() {
      try {
        const res = await fetch(`/api/admin/orders/${orderIdParam}`);
        const data = await res.json();
        if (res.ok && data.order) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const item = (data.order.items || []).find((it: any) => it.id === itemIdParam);
          if (item) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let details: any = {};
            try {
              details = JSON.parse(item.cardDetailsJson || "{}");
            } catch {}

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let els: any[] = [];
            try {
              els = JSON.parse(item.elementsJson || "[]");
            } catch {}

            setAdminOrderContext({
              orderId: String(orderIdParam),
              itemId: String(itemIdParam),
              orderNumber: data.order.orderNumber,
              templateName: item.templateName,
              initialDetails: details,
            });

            setDocTitle(item.templateName);
            if (Array.isArray(details.pages) && details.pages.length > 0) {
              setPages(details.pages);
            } else if (els.length > 0) {
              setPages([
                {
                  id: "page-1",
                  title: "Main Invitation (Base)",
                  isBase: true,
                  heightPercent: 100,
                  backgroundColor: details.backgroundColor || "#FFFFFF",
                  backgroundImage: details.backgroundImage || undefined,
                  elements: els,
                },
              ]);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to preload order for admin editing:", err);
      }
    }

    fetchOrderForAdmin();
  }, [orderIdParam, itemIdParam]);

  const handleSaveAdminOrder = async () => {
    if (!adminOrderContext) return;
    setSavingAdminOrder(true);
    try {
      let capturedUrl = "";
      if (canvasRef.current) {
        setSelectedId(null);
        if (typeof document !== "undefined" && document.fonts) {
          await document.fonts.ready;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(canvasRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: null,
        });
        capturedUrl = canvas.toDataURL("image/jpeg", 0.92);
      }

      const res = await fetch(`/api/admin/orders/${adminOrderContext.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_item",
          itemId: adminOrderContext.itemId,
          cardDetails: {
            ...adminOrderContext.initialDetails,
            pages: pages.map((pg, idx) => ({
              ...pg,
              index: idx + 1,
              sheetName: pg.title || pg.name || `Sheet ${idx + 1}`,
            })),
            layerCount: pages.length,
          },
          elements: pages[0]?.elements || elements,
          previewImage: capturedUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order");

      setToastNotification({
        type: "success",
        message: "Order design updated successfully! Redirecting back to order...",
      });
      setTimeout(() => {
        router.push(`/admin/orders/${adminOrderContext.orderId}`);
      }, 1000);
    } catch (err: unknown) {
      setToastNotification({
        type: "error",
        message: (err as Error)?.message || "Failed to save design updates",
      });
      setTimeout(() => {
        setToastNotification(null);
      }, 4000);
    } finally {
      setSavingAdminOrder(false);
    }
  };

  const allTemplates: PresetTemplate[] = useMemo(() => {
    const combined = [...dynamicTemplates, ...PRESET_TEMPLATES];
    const seen = new Set<string>();
    return combined.filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });
  }, [dynamicTemplates]);

  // Document & Page State
  const [docTitle, setDocTitle] = useState<string>(
    () => getInitialDraft()?.docTitle || "Vintage Botanical Wedding Invitation"
  );
  const [aspectRatio] = useState<"portrait" | "square" | "classic">("classic");
  const [pages, setPages] = useState<CanvasPage[]>(() => getInitialDraft()?.pages || INITIAL_PAGES);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    () => getInitialDraft()?.activeTemplateId || "vintage-botanical-romance"
  );
  const currentPage = pages[activePageIndex] || pages[0];
  const elements = currentPage.elements;

  // Selected Element & Dragging/Resizing State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const dragRef = useRef<{
    isDragging: boolean;
    elId: string;
    startX: number;
    startY: number;
    mouseStartX: number;
    mouseStartY: number;
  } | null>(null);

  const resizeRef = useRef<{
    isResizing: boolean;
    elId: string;
    handle: string;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    mouseStartX: number;
    mouseStartY: number;
  } | null>(null);

  // Studio Tools Drawer Tab
  const [activeTab, setActiveTab] = useState<
    "templates" | "elements" | "text" | "uploads" | "layers"
  >("templates");
  const [templateTopic, setTemplateTopic] = useState<"all" | "vintage" | "modern">("all");
  const [selectedColorVariantId, setSelectedColorVariantId] = useState<string>("purple");

  // Mobile Bottom Bar & Slide-up Drawer State
  const [mobileTab, setMobileTab] = useState<"templates" | "text" | "elements" | "layers" | "personalize" | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState<boolean>(false);

  // History State for Undo/Redo
  const [history, setHistory] = useState<CanvasPage[][]>([INITIAL_PAGES]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Smart Personalization Form Variables
  const [personalization, setPersonalization] = useState<PersonalizationData>(() => {
    const draft = getInitialDraft();
    if (draft?.personalization) {
      return { ...DEFAULT_PERSONALIZATION, ...draft.personalization };
    }
    return DEFAULT_PERSONALIZATION;
  });

  // Save & Unsaved Changes Protection State
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Modals & UI Toggles — DEFAULT ZOOM 80%
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [orderPreviewUrl, setOrderPreviewUrl] = useState<string>("");
  const [exporting, setExporting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(85);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showMobileLayers, setShowMobileLayers] = useState<boolean>(false);

  // Right Sidebar Tab State (Personalize vs Format)
  const [rightPanelTab, setRightPanelTab] = useState<"personalize" | "format">("personalize");

  // Multi-Deck Layer Stack Visualizer State
  const [stackAlign, setStackAlign] = useState<"bottom" | "top" | "center">("bottom");
  const [showStackModal, setShowStackModal] = useState<boolean>(false);

  // Graphic Elements Library State
  const [elementsCategory, setElementsCategory] = useState<string>("all");
  const [userUploadedElements, setUserUploadedElements] = useState<any[]>([]);

  const handleCustomElementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        const newEl = {
          id: `custom-upload-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          category: "uploads",
          icon: "🖼️",
          src: dataUrl,
          templateId: "all",
        };
        setUserUploadedElements((prev) => [newEl, ...prev]);
        handleAddGraphic(newEl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Auto-switch right panel to Format tab when user selects an element
  useEffect(() => {
    if (selectedId) {
      setRightPanelTab("format");
    }
  }, [selectedId]);

  // Canva Floating Toolbar Context Menu State
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [showTopMoreMenu, setShowTopMoreMenu] = useState<boolean>(false);
  const [activeSubMenu, setActiveSubMenu] = useState<"arrange" | "align" | "flip" | null>(null);

  // Real-time background auto-save to localStorage (prevents loss on reload without native popups)
  useEffect(() => {
    try {
      localStorage.setItem(
        "canva_draft_design",
        JSON.stringify({
          docTitle,
          aspectRatio,
          pages,
          personalization,
          activeTemplateId,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.error("Auto-save error:", e);
    }
  }, [docTitle, aspectRatio, pages, personalization, activeTemplateId]);

  // Mouse wheel zoom only when Ctrl is pressed, normal vertical scrolling otherwise
  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoomLevel((prev) => Math.min(150, Math.max(40, prev + (e.deltaY < 0 ? 5 : -5))));
    }
  };

  // Full 4-Directional Pointer Drag-to-Move Handler
  const handlePointerDownElement = (e: React.PointerEvent, el: CanvasElement) => {
    if (el.isLocked) {
      setSelectedId(el.id);
      return;
    }
    const target = e.target as HTMLElement;
    if (target.closest(".floating-toolbar") || target.closest(".resize-handle") || target.tagName === "TEXTAREA") {
      return;
    }
    e.stopPropagation();
    setSelectedId(el.id);
    dragRef.current = {
      isDragging: true,
      elId: el.id,
      startX: el.x,
      startY: el.y,
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
    };
  };

  // Element Resize Start (Mouse & Touch)
  const handlePointerDownResize = (e: React.PointerEvent, handle: string, el: CanvasElement) => {
    e.stopPropagation();
    if (el.isLocked) return;
    setSelectedId(el.id);
    resizeRef.current = {
      isResizing: true,
      elId: el.id,
      handle,
      startX: el.x,
      startY: el.y,
      startW: el.width,
      startH: el.height || 20,
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
    };
  };

  // Global Pointer Listeners for Ultra-Smooth Instant Dragging & Resizing
  useEffect(() => {
    const onGlobalPointerMove = (e: PointerEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      // 1. Resizing Mode
      if (resizeRef.current && resizeRef.current.isResizing) {
        const { elId, handle, startX, startY, startW, startH, mouseStartX, mouseStartY } = resizeRef.current;
        const deltaXPercent = ((e.clientX - mouseStartX) / rect.width) * 100;
        const deltaYPercent = ((e.clientY - mouseStartY) / rect.height) * 100;

        let newX = startX;
        let newY = startY;
        let newW = startW;
        let newH = startH;

        if (handle === "e") {
          newW = Math.max(5, Math.min(100, startW + deltaXPercent));
        } else if (handle === "w") {
          newW = Math.max(5, Math.min(100, startW - deltaXPercent));
          newX = Math.max(0, startX + (startW - newW));
        } else if (handle === "s") {
          newH = Math.max(2, Math.min(100, startH + deltaYPercent));
        } else if (handle === "n") {
          newH = Math.max(2, Math.min(100, startH - deltaYPercent));
          newY = Math.max(0, startY + (startH - newH));
        } else if (handle === "se") {
          newW = Math.max(5, Math.min(100, startW + deltaXPercent));
          newH = Math.max(2, Math.min(100, startH + deltaYPercent));
        } else if (handle === "sw") {
          newW = Math.max(5, Math.min(100, startW - deltaXPercent));
          newX = Math.max(0, startX + (startW - newW));
          newH = Math.max(2, Math.min(100, startH + deltaYPercent));
        } else if (handle === "ne") {
          newW = Math.max(5, Math.min(100, startW + deltaXPercent));
          newH = Math.max(2, Math.min(100, startH - deltaYPercent));
          newY = Math.max(0, startY + (startH - newH));
        } else if (handle === "nw") {
          newW = Math.max(5, Math.min(100, startW - deltaXPercent));
          newX = Math.max(0, startX + (startW - newW));
          newH = Math.max(2, Math.min(100, startH - deltaYPercent));
          newY = Math.max(0, startY + (startH - newH));
        }

        setPages((prevPages) =>
          prevPages.map((pg, idx) =>
            idx === activePageIndex
              ? {
                  ...pg,
                  elements: pg.elements.map((item) =>
                    item.id === elId
                      ? {
                          ...item,
                          x: Math.round(newX * 10) / 10,
                          y: Math.round(newY * 10) / 10,
                          width: Math.round(newW * 10) / 10,
                          height: Math.round(newH * 10) / 10,
                        }
                      : item
                  ),
                }
              : pg
          )
        );
        return;
      }

      // 2. Dragging Mode
      if (dragRef.current && dragRef.current.isDragging) {
        const { elId, startX, startY, mouseStartX, mouseStartY } = dragRef.current;
        const deltaXPercent = ((e.clientX - mouseStartX) / rect.width) * 100;
        const deltaYPercent = ((e.clientY - mouseStartY) / rect.height) * 100;

        const newX = Math.max(0, Math.min(95, Math.round(startX + deltaXPercent)));
        const newY = Math.max(0, Math.min(95, Math.round(startY + deltaYPercent)));

        setPages((prevPages) =>
          prevPages.map((pg, idx) =>
            idx === activePageIndex
              ? {
                  ...pg,
                  elements: pg.elements.map((item) =>
                    item.id === elId ? { ...item, x: newX, y: newY } : item
                  ),
                }
              : pg
          )
        );
      }
    };

    const onGlobalPointerUp = () => {
      if (dragRef.current?.isDragging || resizeRef.current?.isResizing) {
        dragRef.current = null;
        resizeRef.current = null;
        setPages((currentPages) => {
          pushState(currentPages);
          return currentPages;
        });
        setHasUnsavedChanges(true);
      }
    };

    window.addEventListener("pointermove", onGlobalPointerMove);
    window.addEventListener("pointerup", onGlobalPointerUp);
    return () => {
      window.removeEventListener("pointermove", onGlobalPointerMove);
      window.removeEventListener("pointerup", onGlobalPointerUp);
    };
  }, [activePageIndex]);

  const handlePersonalizationChange = (field: keyof typeof personalization, value: string) => {
    let nextBride = personalization.brideName || "Sophia";
    let nextGroom = personalization.groomName || "Alexander";
    let nextCouple = personalization.coupleNames || "Sophia & Alexander";

    if (field === "brideName") {
      nextBride = value;
      nextCouple = nextGroom ? `${value} & ${nextGroom}` : value;
    } else if (field === "groomName") {
      nextGroom = value;
      nextCouple = nextBride ? `${nextBride} & ${value}` : value;
    } else if (field === "coupleNames") {
      nextCouple = value;
      if (value.includes("&")) {
        const parts = value.split("&");
        nextBride = parts[0].trim();
        nextGroom = parts[1].trim();
      }
    }

    setPersonalization((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "brideName" ? { brideName: value, coupleNames: nextCouple } : {}),
      ...(field === "groomName" ? { groomName: value, coupleNames: nextCouple } : {}),
      ...(field === "coupleNames" ? { brideName: nextBride, groomName: nextGroom } : {}),
    }));

    const updatedPages = pages.map((pg) => ({
      ...pg,
      elements: pg.elements.map((el) => {
        // Modern 3 Dedicated Field Bindings
        if (field === "modern3Host" && el.id === "host-names-m3") {
          return { ...el, text: value };
        }
        if (field === "modern3GroomFirst" && el.id === "groom-first-m3") {
          return { ...el, text: value };
        }
        if (field === "modern3GroomLast" && el.id === "groom-last-m3") {
          return { ...el, text: value };
        }
        if (field === "modern3BrideFirst" && el.id === "bride-first-m3") {
          return { ...el, text: value };
        }
        if (field === "modern3BrideLast" && el.id === "bride-last-m3") {
          return { ...el, text: value };
        }
        if (field === "modern3DateDay" && el.id === "date-day-m3") {
          return { ...el, text: value };
        }
        if (field === "modern3DateYear" && el.id === "date-year-m3") {
          return { ...el, text: value };
        }
        if (field === "modern3DateTime" && el.id === "date-time-m3") {
          return { ...el, text: value };
        }
        if (field === "modern3VenueTitle" && el.id === "venue-title-m3") {
          return { ...el, text: value };
        }
        if (field === "modern3VenueAddr1" && el.id === "venue-line1-m3") {
          return { ...el, text: value };
        }
        if (field === "modern3VenueAddr2" && el.id === "venue-line2-m3") {
          return { ...el, text: value };
        }

        // Modern 1 & 2 Specific Field Bindings
        if (field === "modernTagline" && (el.id.startsWith("praise-lord") || el.fieldKey === "tagline")) {
          return { ...el, text: value };
        }
        if ((field === "modernGroom" || field === "groomName") && (el.id.startsWith("groom-name") || el.fieldKey === "groomName")) {
          return { ...el, text: value };
        }
        if ((field === "modernBride" || field === "brideName") && (el.id.startsWith("bride-name") || el.fieldKey === "brideName")) {
          return { ...el, text: value };
        }
        if (field === "modernDate" && (el.id.startsWith("date-line") || el.fieldKey === "date")) {
          return { ...el, text: value };
        }
        if (field === "modernWelcome" && el.id.startsWith("welcome-sentence")) {
          return { ...el, text: value };
        }
        if (field === "modernContact" && (el.id.startsWith("contact-info") || el.fieldKey === "address")) {
          return { ...el, text: value };
        }
        if (field === "modernFamilyWithLove" && el.id.startsWith("family-info")) {
          return { ...el, text: value };
        }
        if (field === "modernMarriageVenue" && (el.id.startsWith("marriage-details") || el.fieldKey === "venue")) {
          return { ...el, text: value };
        }
        if (field === "modernReceptionVenue" && el.id.startsWith("reception-details")) {
          return { ...el, text: value };
        }

        // Bride & Groom & Couple Names Bindings
        if (field === "brideName") {
          if (el.fieldKey === "brideName" || el.id.startsWith("bride-name") || el.id.includes("bride")) {
            return { ...el, text: value };
          }
          if (el.fieldKey === "coupleNames" || el.id.includes("couple")) {
            return { ...el, text: nextCouple };
          }
        }
        if (field === "groomName") {
          if (el.fieldKey === "groomName" || el.id.startsWith("groom-name") || el.id.includes("groom")) {
            return { ...el, text: value };
          }
          if (el.fieldKey === "coupleNames" || el.id.includes("couple")) {
            return { ...el, text: nextCouple };
          }
        }
        if (field === "coupleNames" && (el.id.includes("couple") || el.fieldKey === "coupleNames")) {
          return { ...el, text: value };
        }

        // Vintage / Global Field Bindings
        if (el.fieldKey === field) {
          return { ...el, text: field === "rsvp" && !value.startsWith("R.S.V.P") ? `R.S.V.P ${value}` : value };
        }
        if (field === "date" && (el.id.includes("date") || el.fieldKey === "date")) {
          return { ...el, text: value };
        }
        if (field === "time" && (el.id.includes("time") || el.fieldKey === "time")) {
          return { ...el, text: value };
        }
        if (field === "venue" && (el.id.includes("venue") || el.fieldKey === "venue")) {
          return { ...el, text: value };
        }
        if (field === "address" && (el.id.includes("address") || el.fieldKey === "address")) {
          return { ...el, text: value };
        }
        if (field === "rsvp" && (el.id.includes("rsvp") || el.fieldKey === "rsvp")) {
          return { ...el, text: value.startsWith("R.S.V.P") ? value : `R.S.V.P ${value}` };
        }
        return el;
      }),
    }));

    setPages(updatedPages);
    pushState(updatedPages);
    setHasUnsavedChanges(true);
  };

  const pushState = (newPages: CanvasPage[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newPages);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPages(history[historyIndex - 1]);
      setHasUnsavedChanges(true);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPages(history[historyIndex + 1]);
      setHasUnsavedChanges(true);
    }
  };

  const activeElement = elements.find((el) => el.id === selectedId);

  const updateActiveElement = (updatedProps: Partial<CanvasElement>) => {
    if (!selectedId) return;
    const updatedPages = pages.map((pg, idx) =>
      idx === activePageIndex
        ? {
            ...pg,
            elements: pg.elements.map((el) =>
              el.id === selectedId ? { ...el, ...updatedProps } : el
            ),
          }
        : pg
    );
    setPages(updatedPages);
    pushState(updatedPages);
    setHasUnsavedChanges(true);
  };

  const handleBringToFront = () => {
    if (!selectedId) return;
    const maxZ = Math.max(...elements.map((e) => e.zIndex || 1), 1);
    updateActiveElement({ zIndex: maxZ + 1 });
  };

  const handleBringForward = () => {
    if (!selectedId) return;
    const currentZ = activeElement?.zIndex || 1;
    updateActiveElement({ zIndex: currentZ + 1 });
  };

  const handleSendBackward = () => {
    if (!selectedId) return;
    const currentZ = activeElement?.zIndex || 1;
    updateActiveElement({ zIndex: Math.max(1, currentZ - 1) });
  };

  const handleSendToBack = () => {
    if (!selectedId) return;
    const minZ = Math.min(...elements.map((e) => e.zIndex || 1), 1);
    updateActiveElement({ zIndex: Math.max(1, minZ - 1) });
  };

  const [nudgeStep, setNudgeStep] = useState<number>(1);
  const [showNudgePad, setShowNudgePad] = useState<boolean>(false);

  const handleNudge = useCallback(
    (dir: "up" | "down" | "left" | "right", customStep?: number) => {
      if (!activeElement || activeElement.isLocked) return;
      const step = customStep || nudgeStep;
      let newX = activeElement.x;
      let newY = activeElement.y;

      if (dir === "left") newX = Math.max(0, Number((activeElement.x - step).toFixed(2)));
      if (dir === "right") newX = Math.min(100 - activeElement.width, Number((activeElement.x + step).toFixed(2)));
      if (dir === "up") newY = Math.max(0, Number((activeElement.y - step).toFixed(2)));
      if (dir === "down") newY = Math.min(100 - activeElement.height, Number((activeElement.y + step).toFixed(2)));

      updateActiveElement({ x: newX, y: newY });
    },
    [activeElement, nudgeStep]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }

      if (!activeElement || activeElement.isLocked) return;

      const step = e.shiftKey ? 5 : 1;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleNudge("left", step);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNudge("right", step);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handleNudge("up", step);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNudge("down", step);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeElement, handleNudge]);

  const handleAlign = (type: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    if (!activeElement) return;
    if (type === "left") updateActiveElement({ x: 5 });
    else if (type === "center") updateActiveElement({ x: Math.round((100 - activeElement.width) / 2) });
    else if (type === "right") updateActiveElement({ x: Math.max(0, 95 - activeElement.width) });
    else if (type === "top") updateActiveElement({ y: 5 });
    else if (type === "middle") updateActiveElement({ y: Math.round((100 - activeElement.height) / 2) });
    else if (type === "bottom") updateActiveElement({ y: Math.max(0, 95 - activeElement.height) });
  };

  const handleFlip = (dir: "horizontal" | "vertical") => {
    if (!activeElement) return;
    if (dir === "horizontal") {
      updateActiveElement({ flipH: !activeElement.flipH });
    } else {
      updateActiveElement({ flipV: !activeElement.flipV });
    }
  };

  const handleToggleLock = () => {
    if (!activeElement) return;
    updateActiveElement({ isLocked: !activeElement.isLocked });
  };

  const handleArrange = (action: "forward" | "backward" | "front" | "back") => {
    if (!selectedId) return;
    const currentElements = [...currentPage.elements];
    const idx = currentElements.findIndex((e) => e.id === selectedId);
    if (idx === -1) return;

    const el = currentElements[idx];
    currentElements.splice(idx, 1);

    if (action === "front") {
      currentElements.push(el);
    } else if (action === "back") {
      currentElements.unshift(el);
    } else if (action === "forward") {
      const newIdx = Math.min(currentElements.length, idx + 1);
      currentElements.splice(newIdx, 0, el);
    } else if (action === "backward") {
      const newIdx = Math.max(0, idx - 1);
      currentElements.splice(newIdx, 0, el);
    }

    const updatedPages = pages.map((pg, pIdx) =>
      pIdx === activePageIndex ? { ...pg, elements: currentElements } : pg
    );
    setPages(updatedPages);
    pushState(updatedPages);
    setHasUnsavedChanges(true);
  };

  const handleSetBaseLayer = (idxToSet: number) => {
    const updated = pages.map((p, idx) => ({
      ...p,
      isBase: idx === idxToSet,
      heightPercent: idx === idxToSet ? 100 : (p.heightPercent || 85),
    }));
    setPages(updated);
    pushState(updated);
    setHasUnsavedChanges(true);
  };

  const handleUpdateLayerHeightPercent = (idx: number, pct: number) => {
    const clamped = Math.max(10, Math.min(200, pct));
    const updated = pages.map((p, pIdx) =>
      pIdx === idx ? { ...p, heightPercent: clamped } : p
    );
    setPages(updated);
    pushState(updated);
    setHasUnsavedChanges(true);
  };

  const handleUpdateLayerName = (idx: number, name: string) => {
    const updated = pages.map((p, pIdx) =>
      pIdx === idx ? { ...p, title: name, name: name } : p
    );
    setPages(updated);
    pushState(updated);
    setHasUnsavedChanges(true);
  };

  const getPhysicalDimensions = (layer: CanvasPage, basePg: CanvasPage) => {
    const lDim = getLayerDimensions(layer, basePg);
    const bDim = getLayerDimensions(basePg, basePg);
    const pct = layer.isBase !== false ? 100 : (layer.heightPercent || 85);
    
    // Reference 5" x 7" base card
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
  };

  const handleSave = async (navTarget?: string | null) => {
    const currentDraft = {
      docTitle,
      aspectRatio,
      pages,
      personalization,
      activeTemplateId,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("canva_draft_design", JSON.stringify(currentDraft));

    if (status !== "authenticated") {
      setShowUnsavedModal(false);
      router.push(`/auth/login?callbackUrl=${encodeURIComponent("/canva")}`);
      return false;
    }

    setSaving(true);
    try {
      await fetch("/api/user/cards/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: 1,
          templateName: docTitle,
          cardDataJson: JSON.stringify(currentDraft),
        }),
      });

      setHasUnsavedChanges(false);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);

      if (navTarget) {
        setShowUnsavedModal(false);
        router.push(navTarget);
      }
      return true;
    } catch (err) {
      console.error("Save error:", err);
      return true;
    } finally {
      setSaving(false);
    }
  };

  const handleBackNavigation = (e: React.MouseEvent, href: string) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      setPendingNavigation(href);
      setShowUnsavedModal(true);
    } else {
      router.push(href);
    }
  };

  const handleLoadTemplate = (tpl: PresetTemplate) => {
    setActiveTemplateId(tpl.id);
    setDocTitle(tpl.name);
    setTemplateTopic(tpl.topic === "modern" ? "modern" : "vintage");
    setSelectedColorVariantId(
      tpl.id === "modern-watercolor-floral"
        ? "purple"
        : tpl.id === "modern-watercolor-gold-splatter"
        ? "plum"
        : tpl.id === "modern-silver-botanical-foliage"
        ? "navy"
        : ""
    );

    let updatedPersonalization = { ...personalization };

    const rawElementsList: any[] = Array.isArray(tpl.elements)
      ? tpl.elements
      : (tpl.elements as any)?.layers?.[0]?.elements || [];

    if (tpl.id === "modern-silver-botanical-foliage") {
      const hostText = rawElementsList.find((e) => e.id === "host-names-m3")?.text || "Host(s)";
      const gFirst = rawElementsList.find((e) => e.id === "groom-first-m3")?.text || "First Name";
      const gLast = rawElementsList.find((e) => e.id === "groom-last-m3")?.text || "last name";
      const bFirst = rawElementsList.find((e) => e.id === "bride-first-m3")?.text || "First Name";
      const bLast = rawElementsList.find((e) => e.id === "bride-last-m3")?.text || "last name";
      const dDay = rawElementsList.find((e) => e.id === "date-day-m3")?.text || "Day and Month";
      const dYear = rawElementsList.find((e) => e.id === "date-year-m3")?.text || "Year";
      const dTime = rawElementsList.find((e) => e.id === "date-time-m3")?.text || "4:00 PM";
      const vTitle = rawElementsList.find((e) => e.id === "venue-title-m3")?.text || "Venue";
      const vAddr1 = rawElementsList.find((e) => e.id === "venue-line1-m3")?.text || "Address Line 1";
      const vAddr2 = rawElementsList.find((e) => e.id === "venue-line2-m3")?.text || "Address Line 2";

      updatedPersonalization = {
        ...personalization,
        modern3Host: hostText,
        modern3GroomFirst: gFirst,
        modern3GroomLast: gLast,
        modern3BrideFirst: bFirst,
        modern3BrideLast: bLast,
        modern3DateDay: dDay,
        modern3DateYear: dYear,
        modern3DateTime: dTime,
        modern3VenueTitle: vTitle,
        modern3VenueAddr1: vAddr1,
        modern3VenueAddr2: vAddr2,
      };
      setPersonalization(updatedPersonalization);
    } else if (tpl.topic === "modern") {
      const taglineText = rawElementsList.find((e) => e.id.startsWith("praise-lord") || e.fieldKey === "tagline")?.text || "Praise the lord";
      const groomText = rawElementsList.find((e) => e.id.startsWith("groom-name") || e.fieldKey === "coupleNames")?.text || "Kirubin";
      const brideText = rawElementsList.find((e) => e.id.startsWith("bride-name"))?.text || "Asha";
      const dateText = rawElementsList.find((e) => e.id.startsWith("date-line") || e.fieldKey === "date")?.text || "3  Jan 2024,  Saturday  @10am";
      const welcomeText = rawElementsList.find((e) => e.id.startsWith("welcome-sentence"))?.text || "Welcomes you all";
      const contactText = rawElementsList.find((e) => e.id.startsWith("contact-info") || e.fieldKey === "address")?.text || "Place: Karumankoodal\nPhone: 8489520394";
      const familyText = rawElementsList.find((e) => e.id.startsWith("family-info"))?.text || "With love\nM. Tharmar\nS. Rajam";
      const marriageText = rawElementsList.find((e) => e.id.startsWith("marriage-details") || e.fieldKey === "venue")?.text || "Marthal Zion C.S.I Church\nMarthal\nTime: 10:30 am";
      const receptionText = rawElementsList.find((e) => e.id.startsWith("reception-details"))?.text || "Holy loosiyal Auditorium\nLocation: Pudur to maindaikadu road\nTime: 6pm";

      updatedPersonalization = {
        ...personalization,
        modernTagline: taglineText,
        modernGroom: groomText,
        modernBride: brideText,
        modernDate: dateText,
        modernWelcome: welcomeText,
        modernContact: contactText,
        modernFamilyWithLove: familyText,
        modernMarriageVenue: marriageText,
        modernReceptionVenue: receptionText,
      };
      setPersonalization(updatedPersonalization);
    }

    const populatedElements =
      tpl.id === "modern-silver-botanical-foliage"
        ? rawElementsList.map((el: any) => {
            if (el.id === "host-names-m3") return { ...el, text: updatedPersonalization.modern3Host };
            if (el.id === "groom-first-m3") return { ...el, text: updatedPersonalization.modern3GroomFirst };
            if (el.id === "groom-last-m3") return { ...el, text: updatedPersonalization.modern3GroomLast };
            if (el.id === "bride-first-m3") return { ...el, text: updatedPersonalization.modern3BrideFirst };
            if (el.id === "bride-last-m3") return { ...el, text: updatedPersonalization.modern3BrideLast };
            if (el.id === "date-day-m3") return { ...el, text: updatedPersonalization.modern3DateDay };
            if (el.id === "date-year-m3") return { ...el, text: updatedPersonalization.modern3DateYear };
            if (el.id === "date-time-m3") return { ...el, text: updatedPersonalization.modern3DateTime };
            if (el.id === "venue-title-m3") return { ...el, text: updatedPersonalization.modern3VenueTitle };
            if (el.id === "venue-line1-m3") return { ...el, text: updatedPersonalization.modern3VenueAddr1 };
            if (el.id === "venue-line2-m3") return { ...el, text: updatedPersonalization.modern3VenueAddr2 };
            return el;
          })
        : tpl.topic === "modern"
        ? rawElementsList.map((el: any) => {
            if (el.id.startsWith("praise-lord") || el.fieldKey === "tagline") {
              return { ...el, text: updatedPersonalization.modernTagline };
            }
            if (el.id.startsWith("groom-name") || el.fieldKey === "coupleNames") {
              return { ...el, text: updatedPersonalization.modernGroom };
            }
            if (el.id.startsWith("bride-name")) {
              return { ...el, text: updatedPersonalization.modernBride };
            }
            if (el.id.startsWith("date-line") || el.fieldKey === "date") {
              return { ...el, text: updatedPersonalization.modernDate };
            }
            if (el.id.startsWith("welcome-sentence")) {
              return { ...el, text: updatedPersonalization.modernWelcome };
            }
            if (el.id.startsWith("contact-info") || el.fieldKey === "address") {
              return { ...el, text: updatedPersonalization.modernContact };
            }
            if (el.id.startsWith("family-info")) {
              return { ...el, text: updatedPersonalization.modernFamilyWithLove };
            }
            if (el.id.startsWith("marriage-details") || el.fieldKey === "venue") {
              return { ...el, text: updatedPersonalization.modernMarriageVenue };
            }
            if (el.id.startsWith("reception-details")) {
              return { ...el, text: updatedPersonalization.modernReceptionVenue };
            }
            return el;
          })
        : rawElementsList.map((el: any) => {
            if (el.fieldKey === "coupleNames" || el.id.includes("couple")) {
              return { ...el, text: personalization.coupleNames };
            }
            if (el.fieldKey === "date" || el.id.includes("date")) {
              return { ...el, text: personalization.date };
            }
            if (el.fieldKey === "time" || el.id.includes("time")) {
              return { ...el, text: personalization.time };
            }
            if (el.fieldKey === "venue" || el.id.includes("venue")) {
              return { ...el, text: personalization.venue };
            }
            if (el.fieldKey === "address" || el.id.includes("address")) {
              return { ...el, text: personalization.address };
            }
            if (el.fieldKey === "rsvp" || el.id.includes("rsvp")) {
              return { ...el, text: personalization.rsvp.startsWith("R.S.V.P") ? personalization.rsvp : `R.S.V.P ${personalization.rsvp}` };
            }
            return el;
          });

    let loadedPages: CanvasPage[] = [];

    if (
      tpl.elements &&
      typeof tpl.elements === "object" &&
      !Array.isArray(tpl.elements) &&
      (tpl.elements as any).layers
    ) {
      const rawLayers = (tpl.elements as any).layers as any[];
      loadedPages = rawLayers.map((l, idx) => ({
        id: l.id || `layer-${idx + 1}`,
        title: l.name || (idx === 0 ? "Main Invitation (Base)" : `Insert Sheet ${idx + 1}`),
        name: l.name || (idx === 0 ? "Main Invitation (Base)" : `Insert Sheet ${idx + 1}`),
        isBase: l.isBase ?? (idx === 0),
        heightPercent: l.heightPercent ?? (idx === 0 ? 100 : 85),
        aspectRatio: l.aspectRatio || tpl.aspectRatio || "classic",
        customWidth: l.customWidth,
        customHeight: l.customHeight,
        lockRatio: l.lockRatio ?? true,
        backgroundColor: l.backgroundColor || tpl.backgroundColor || "#FFFFFF",
        backgroundImage: l.backgroundImage || null,
        bgMode: l.bgMode || "textures",
        elements: Array.isArray(l.elements) ? l.elements : [],
      }));
    } else {
      loadedPages = [
        {
          id: "layer-1",
          title: "Main Invitation (Base)",
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
          elements: populatedElements,
        },
      ];
    }

    setPages(loadedPages);
    setActivePageIndex(0);
    const firstText = loadedPages[0]?.elements.find((e: any) => e.type === "text");
    setSelectedId(firstText?.id || loadedPages[0]?.elements[0]?.id || null);
    pushState(loadedPages);
    setHasUnsavedChanges(true);

    try {
      localStorage.setItem(
        "canva_draft_design",
        JSON.stringify({
          docTitle: tpl.name,
          aspectRatio,
          pages: loadedPages,
          personalization: updatedPersonalization,
          activeTemplateId: tpl.id,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.error("Failed to persist template selection:", e);
    }
  };

  // Check URL parameters on mount or sync latest admin template layers
  useEffect(() => {
    if (typeof window === "undefined" || allTemplates.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const templateParam = params.get("template") || params.get("id");

    if (templateParam) {
      const found = allTemplates.find(
        (t) => t.id === templateParam || (t as any).dbId === templateParam || (t as any).slug === templateParam
      );
      if (found) {
        handleLoadTemplate(found);
        return;
      }
    }

    // If dynamic templates are loaded from admin, sync them
    if (dynamicTemplates.length > 0) {
      const activeMatch = dynamicTemplates.find(
        (t) => t.id === activeTemplateId || (t as any).dbId === activeTemplateId || (t as any).slug === activeTemplateId
      );
      if (activeMatch) {
        handleLoadTemplate(activeMatch);
      } else {
        // If no active match or first visit, load latest admin template
        handleLoadTemplate(dynamicTemplates[0]);
      }
    }
  }, [dynamicTemplates]);

  const handleSelectColorVariant = (variant: ColorVariant) => {
    setSelectedColorVariantId(variant.id);
    const updatedPages = pages.map((page, idx) => {
      if (idx !== activePageIndex) return page;
      return {
        ...page,
        backgroundImage: variant.bgImage,
        elements: page.elements.map((el) => {
          if (el.id.includes("badge-")) {
            return { ...el, backgroundColor: variant.badgeBgColor };
          }
          if (
            el.id.includes("groom-name") ||
            el.id.includes("groom-first") ||
            el.id.includes("bride-name") ||
            el.id.includes("bride-first") ||
            el.id.includes("heading") ||
            el.id.includes("save-date") ||
            el.id.includes("welcome") ||
            el.id.includes("venue-name") ||
            el.id.includes("venue-title") ||
            el.id.includes("invite-line")
          ) {
            return { ...el, color: variant.primaryTextColor };
          }
          if (
            el.id.includes("praise") ||
            el.id.includes("host-names") ||
            el.id.includes("groom-last") ||
            el.id.includes("bride-last") ||
            el.id.includes("star-divider") ||
            el.id.includes("date-line") ||
            el.id.includes("date-day") ||
            el.id.includes("date-year") ||
            el.id.includes("date-time") ||
            el.id.includes("contact") ||
            el.id.includes("family") ||
            el.id.includes("details") ||
            el.id.includes("tagline") ||
            el.id.includes("ampersand") ||
            el.id.includes("venue-line") ||
            el.id.includes("rsvp")
          ) {
            return { ...el, color: variant.accentTextColor };
          }
          return el;
        }),
      };
    });
    setPages(updatedPages);
    pushState(updatedPages);
    setHasUnsavedChanges(true);
  };

  const handleAddText = (text: string, presetType: "heading" | "body" | "date") => {
    const newEl: CanvasElement = {
      id: createUniqueId("text"),
      type: "text",
      text,
      fontFamily: presetType === "heading" ? "'Great Vibes', cursive" : "'Cormorant Garamond', serif",
      fontSize: presetType === "heading" ? 42 : presetType === "date" ? 18 : 16,
      color: presetType === "date" ? "#8C6B1B" : "#4A3B2A",
      fontWeight: presetType === "date" ? "700" : "500",
      textAlign: "center",
      letterSpacing: presetType === "date" ? 3 : 1,
      x: 15,
      y: 40,
      width: 70,
      height: 10,
      rotation: 0,
      opacity: 1,
      zIndex: elements.length + 1,
    };
    const updatedPages = pages.map((pg, idx) =>
      idx === activePageIndex ? { ...pg, elements: [...pg.elements, newEl] } : pg
    );
    setPages(updatedPages);
    setSelectedId(newEl.id);
    pushState(updatedPages);
    setHasUnsavedChanges(true);
  };

  const handleAddGraphicAt = (graphic: { name: string; icon: string; src?: string; id?: string }, dropX?: number, dropY?: number) => {
    let x = typeof dropX === "number" ? dropX : 20;
    let y = typeof dropY === "number" ? dropY : 35;
    let width = 60;
    let height = 15;

    // Smart default positions if not dropped directly via mouse
    if (typeof dropX !== "number" || typeof dropY !== "number") {
      const gName = (graphic.name || "").toLowerCase();
      const gId = (graphic.id || "").toLowerCase();
      if (gName.includes("header") || gName.includes("top") || gId.includes("top") || gId.includes("header")) {
        x = 10;
        y = 3;
        width = 80;
        height = 18;
      } else if (gName.includes("footer") || gName.includes("bottom") || gId.includes("bottom") || gId.includes("footer")) {
        x = 10;
        y = 76;
        width = 80;
        height = 20;
      } else if (gName.includes("arch") || gName.includes("frame")) {
        x = 5;
        y = 5;
        width = 90;
        height = 90;
      } else if (gName.includes("divider") || gName.includes("leaf") || gName.includes("swirl")) {
        x = 20;
        y = 44;
        width = 60;
        height = 8;
      } else if (gName.includes("ring") || gName.includes("seal")) {
        x = 40;
        y = 10;
        width = 20;
        height = 12;
      }
    }

    const newEl: CanvasElement = graphic.src
      ? {
          id: createUniqueId("image"),
          type: "image",
          src: graphic.src,
          x,
          y,
          width,
          height,
          rotation: 0,
          opacity: 1,
          zIndex: elements.length + 1,
        }
      : {
          id: createUniqueId("sticker"),
          type: "sticker",
          text: graphic.icon,
          fontSize: 36,
          color: "#8C6B1B",
          x,
          y,
          width: 20,
          height: 12,
          rotation: 0,
          opacity: 1,
          zIndex: elements.length + 1,
        };
    const updatedPages = pages.map((pg, idx) =>
      idx === activePageIndex ? { ...pg, elements: [...pg.elements, newEl] } : pg
    );
    setPages(updatedPages);
    setSelectedId(newEl.id);
    pushState(updatedPages);
    setHasUnsavedChanges(true);
  };

  const handleAddGraphic = (graphic: { name: string; icon: string; src?: string; id?: string }) => {
    handleAddGraphicAt(graphic);
  };

  const handleDuplicate = () => {
    if (!activeElement) return;
    const newEl: CanvasElement = {
      ...activeElement,
      id: createUniqueId(activeElement.type),
      x: Math.min(80, activeElement.x + 4),
      y: Math.min(80, activeElement.y + 4),
      zIndex: elements.length + 1,
    };
    const updatedPages = pages.map((pg, idx) =>
      idx === activePageIndex ? { ...pg, elements: [...pg.elements, newEl] } : pg
    );
    setPages(updatedPages);
    setSelectedId(newEl.id);
    pushState(updatedPages);
    setHasUnsavedChanges(true);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    const updatedPages = pages.map((pg, idx) =>
      idx === activePageIndex
        ? { ...pg, elements: pg.elements.filter((el) => el.id !== selectedId) }
        : pg
    );
    setPages(updatedPages);
    setSelectedId(updatedPages[activePageIndex].elements[0]?.id || null);
    pushState(updatedPages);
    setHasUnsavedChanges(true);
  };



  // High-Res Export Engine
  const handleExport = async (format: "png" | "jpg" | "pdf") => {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      // 1. Deselect any active elements so selection outline & toolbar are not captured
      setSelectedId(null);
      setShowMoreMenu(false);
      setActiveSubMenu(null);

      // 2. Ensure all Google fonts and web fonts are fully loaded into browser canvas context
      if (typeof document !== "undefined" && document.fonts) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 3. Render pixel-perfect high-res canvas (scale: 3 = 300+ DPI print quality)
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(canvasRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        onclone: (_clonedDoc, clonedElement) => {
          clonedElement.style.transform = "none";
          clonedElement.style.transformOrigin = "top left";
          clonedElement.style.boxShadow = "none";
          clonedElement.style.margin = "0";
          clonedElement.querySelectorAll('[data-hidden="true"]').forEach((hiddenEl: any) => {
            hiddenEl.style.display = "none";
          });
        },
      });

      const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
      const quality = format === "jpg" ? 0.98 : 1.0;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      const fileName = `${docTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${format}`;

      if (format === "png" || format === "jpg") {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const { jsPDF } = await import("jspdf");
        const wNum = parseInt(canvasDim.width, 10) || 440;
        const hNum = parseInt(canvasDim.height, 10) || 620;
        const isLandscape = wNum > hNum;
        const pdf = new jsPDF(isLandscape ? "landscape" : "portrait", "px", [wNum, hNum]);
        pdf.addImage(dataUrl, "PNG", 0, 0, wNum, hNum);
        pdf.save(fileName);
      }
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
      setShowDownloadModal(false);
    }
  };

  const handleOpenOrderModal = async () => {
    if (status === "unauthenticated" || !session) {
      const returnUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/canva";
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    let capturedUrl = "";
    try {
      if (canvasRef.current) {
        setSelectedId(null);
        setShowMoreMenu(false);
        setActiveSubMenu(null);

        if (typeof document !== "undefined" && document.fonts) {
          await document.fonts.ready;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));

        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(canvasRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: null,
          onclone: (_clonedDoc, clonedElement) => {
            clonedElement.style.transform = "none";
            clonedElement.style.transformOrigin = "top left";
            clonedElement.style.boxShadow = "none";
            clonedElement.style.margin = "0";
          },
        });
        capturedUrl = canvas.toDataURL("image/jpeg", 0.92);
      }
    } catch (err) {
      console.warn("Canvas preview snapshot warning:", err);
    }

    if (!capturedUrl) {
      const matched = allTemplates.find((t) => t.id === activeTemplateId);
      capturedUrl = matched?.previewImage || "/images/canva/template1-thumb.webp";
    }

    setOrderPreviewUrl(capturedUrl);
    setShowOrderModal(true);
  };

  const renderLeftToolsDrawerContent = (tabToRender: "templates" | "elements" | "text" | "uploads" | "layers" = activeTab) => {
    return (
      <div className="space-y-4">
        {/* TAB: TEMPLATES */}
        {tabToRender === "templates" && (
          <div className="space-y-3.5">
            {/* TOPIC SUB-TABS (ALL / MODERN / VINTAGE) */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1">
              <button
                onClick={() => setTemplateTopic("all")}
                className={`flex-1 py-1.5 px-1 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  templateTopic === "all"
                    ? "bg-white text-[#991B1B] shadow-xs border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>All</span>
                <span
                  className={`text-[8.5px] px-1 py-0.2 rounded-full font-mono font-bold ${
                    templateTopic === "all"
                      ? "bg-red-50 text-[#991B1B]"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {allTemplates.length}
                </span>
              </button>

              <button
                onClick={() => setTemplateTopic("modern")}
                className={`flex-1 py-1.5 px-1 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  templateTopic === "modern"
                    ? "bg-white text-[#991B1B] shadow-xs border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Modern</span>
                <span
                  className={`text-[8.5px] px-1 py-0.2 rounded-full font-mono font-bold ${
                    templateTopic === "modern"
                      ? "bg-red-50 text-[#991B1B]"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {allTemplates.filter((t) => t.topic === "modern").length}
                </span>
              </button>

              <button
                onClick={() => setTemplateTopic("vintage")}
                className={`flex-1 py-1.5 px-1 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  templateTopic === "vintage"
                    ? "bg-white text-[#991B1B] shadow-xs border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Vintage</span>
                <span
                  className={`text-[8.5px] px-1 py-0.2 rounded-full font-mono font-bold ${
                    templateTopic === "vintage"
                      ? "bg-red-50 text-[#991B1B]"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {allTemplates.filter((t) => t.topic === "vintage").length}
                </span>
              </button>
            </div>

            {/* TEMPLATES GRID */}
            <div className="grid grid-cols-2 gap-2.5">
              {allTemplates
                .filter((t) => (templateTopic === "all" ? true : t.topic === templateTopic))
                .map((tpl) => {
                  const isActive = tpl.id === activeTemplateId;
                  const layerCount =
                    tpl.elements && typeof tpl.elements === "object" && (tpl.elements as any).layers
                      ? (tpl.elements as any).layers.length
                      : 1;

                  return (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        handleLoadTemplate(tpl);
                        setMobileSheetOpen(false);
                      }}
                      className={`group relative flex flex-col text-left rounded-xl overflow-hidden border transition-all cursor-pointer bg-white ${
                        isActive
                          ? "border-[#991B1B] ring-2 ring-red-200 shadow-sm"
                          : "border-slate-200 hover:border-[#991B1B]/70 hover:shadow-sm"
                      }`}
                    >
                      {/* Compact Thumbnail Container */}
                      <div className="relative aspect-[4/5] w-full bg-slate-50 overflow-hidden">
                        {tpl.previewImage ? (
                          <img
                            src={tpl.previewImage}
                            alt={tpl.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : tpl.backgroundImage ? (
                          <img
                            src={tpl.backgroundImage}
                            alt={tpl.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center p-1.5 text-center text-[10px] font-serif font-bold text-slate-700"
                            style={{
                              backgroundColor:
                                tpl.backgroundColor &&
                                (tpl.backgroundColor.startsWith("#") || tpl.backgroundColor.startsWith("rgb"))
                                  ? tpl.backgroundColor
                                  : undefined,
                              backgroundImage: tpl.backgroundImage
                                ? `url(${tpl.backgroundImage})`
                                : tpl.backgroundColor && tpl.backgroundColor.includes("gradient")
                                ? tpl.backgroundColor
                                : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            {tpl.name}
                          </div>
                        )}

                        {/* Multi-Layer Count Badge */}
                        {layerCount > 1 && (
                          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white text-[7.5px] font-bold shadow-xs backdrop-blur-xs flex items-center gap-0.5">
                            <span>🗂️ {layerCount} Sheets</span>
                          </div>
                        )}

                        {/* Active Badge Overlay */}
                        {isActive && (
                          <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-[#991B1B] text-white text-[7px] font-extrabold shadow-sm flex items-center gap-0.5 uppercase tracking-wider backdrop-blur-xs">
                            <Check className="w-2 h-2" />
                            Active
                          </div>
                        )}
                      </div>

                      {/* Compact Card Info */}
                      <div className="p-1.5 bg-white flex flex-col gap-0.5">
                        <span className="text-[8px] font-extrabold text-[#991B1B] uppercase tracking-wider truncate">
                          {tpl.category}
                        </span>
                        <h4 className="text-[10px] font-serif font-bold text-slate-900 group-hover:text-[#991B1B] line-clamp-1 leading-tight">
                          {tpl.name}
                        </h4>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB: TEXT (CLEAN & CRISPY TYPOGRAPHY) */}
        {tabToRender === "text" && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#991B1B]" />
                <h3 className="text-xs font-extrabold text-[#991B1B] uppercase tracking-wider">
                  Typography
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Click to add text</span>
            </div>

            {/* Primary Action: Add Custom Text Box */}
            <button
              type="button"
              onClick={() => {
                handleAddText("Your Custom Text", "body");
                setMobileSheetOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Text Box</span>
            </button>

            {/* Preset Typography Styles */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Quick Presets
              </span>

              {/* 1. Luxury Heading */}
              <div
                onClick={() => {
                  handleAddText("Add a Luxury Heading", "heading");
                  setMobileSheetOpen(false);
                }}
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/40 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-serif font-bold text-sm text-slate-900 group-hover:text-[#991B1B] transition-colors block truncate">
                    Luxury Heading
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Cormorant Garamond • Bold
                  </span>
                </div>
                <span className="w-6 h-6 rounded-lg bg-red-50 text-[#991B1B] border border-red-200 flex items-center justify-center text-xs font-bold group-hover:bg-[#991B1B] group-hover:text-white transition-colors shrink-0">
                  +
                </span>
              </div>

              {/* 2. Script Couple Names */}
              <div
                onClick={() => {
                  handleAddText(personalization.coupleNames || "Sophia & Alexander", "heading");
                  setMobileSheetOpen(false);
                }}
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/40 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-serif italic font-medium text-sm text-slate-900 group-hover:text-[#991B1B] transition-colors block truncate">
                    {personalization.coupleNames || "Sophia & Alexander"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Great Vibes • Cursive Script
                  </span>
                </div>
                <span className="w-6 h-6 rounded-lg bg-red-50 text-[#991B1B] border border-red-200 flex items-center justify-center text-xs font-bold group-hover:bg-[#991B1B] group-hover:text-white transition-colors shrink-0">
                  +
                </span>
              </div>

              {/* 3. Event Date & Time */}
              <div
                onClick={() => {
                  handleAddText(personalization.date || "OCTOBER 30, 2026", "date");
                  setMobileSheetOpen(false);
                }}
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/40 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-mono text-xs font-bold tracking-widest text-[#991B1B] block truncate uppercase">
                    {personalization.date || "OCTOBER 30, 2026"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Event Date • Letter Spaced
                  </span>
                </div>
                <span className="w-6 h-6 rounded-lg bg-red-50 text-[#991B1B] border border-red-200 flex items-center justify-center text-xs font-bold group-hover:bg-[#991B1B] group-hover:text-white transition-colors shrink-0">
                  +
                </span>
              </div>

              {/* 4. Venue Name */}
              <div
                onClick={() => {
                  handleAddText(personalization.venue || "The Grand Palace Hall", "body");
                  setMobileSheetOpen(false);
                }}
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/40 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#991B1B] transition-colors block truncate">
                    {personalization.venue || "The Grand Palace Hall"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Venue Subheading
                  </span>
                </div>
                <span className="w-6 h-6 rounded-lg bg-red-50 text-[#991B1B] border border-red-200 flex items-center justify-center text-xs font-bold group-hover:bg-[#991B1B] group-hover:text-white transition-colors shrink-0">
                  +
                </span>
              </div>

              {/* 5. Address & Subtext */}
              <div
                onClick={() => {
                  handleAddText(personalization.address || "Request the honour of your presence...", "body");
                  setMobileSheetOpen(false);
                }}
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/40 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-xs text-slate-700 group-hover:text-slate-900 block truncate">
                    {personalization.address || "Request the honour of your presence..."}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Invitation Body Paragraph
                  </span>
                </div>
                <span className="w-6 h-6 rounded-lg bg-red-50 text-[#991B1B] border border-red-200 flex items-center justify-center text-xs font-bold group-hover:bg-[#991B1B] group-hover:text-white transition-colors shrink-0">
                  +
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ELEMENTS (ONLY THIS TEMPLATE'S PNG ELEMENTS) */}
        {tabToRender === "elements" && (
          <div className="space-y-3.5">
            {(() => {
              // 1. Collect all PNG motifs used in current template across all pages
              const templateMotifs: any[] = [];
              pages.forEach((p, pIdx) => {
                p.elements.forEach((el, eIdx) => {
                  if (el.type === "image" && el.src) {
                    if (!templateMotifs.some((m) => m.src === el.src)) {
                      templateMotifs.push({
                        id: `tpl-motif-${p.id}-${el.id || eIdx}`,
                        name: el.text || `Template Element #${templateMotifs.length + 1}`,
                        category: "template",
                        icon: "✨",
                        src: el.src,
                        templateId: activeTemplateId,
                      });
                    }
                  }
                });
              });

              // Combine template motifs and user custom uploads
              const availableElements = [
                ...templateMotifs,
                ...userUploadedElements,
              ];

              return (
                <>
                  {/* Upload Custom PNG / Photo Button (Disabled for User) */}
                  <button
                    type="button"
                    disabled
                    className="w-full py-2.5 px-3 bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center gap-2 text-xs font-extrabold cursor-not-allowed select-none opacity-60 shadow-2xs"
                    title="Custom uploads are disabled"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>+ Upload Custom PNG / Photo</span>
                  </button>

                  {/* Elements Grid */}
                  {availableElements.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-4 space-y-1.5">
                      <p className="text-xs font-bold text-slate-700">No PNG elements on this template</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableElements.map((elem) => (
                        <div
                          key={elem.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("application/json", JSON.stringify(elem));
                            e.dataTransfer.effectAllowed = "copy";
                          }}
                          onClick={() => {
                            handleAddGraphic(elem);
                            setMobileSheetOpen(false);
                          }}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1.5 hover:border-[#991B1B] hover:bg-red-50/50 transition-all group cursor-grab active:cursor-grabbing shadow-xs select-none relative"
                          title="Click to add or Drag & Drop directly onto card"
                        >
                          {elem.src ? (
                            <img
                              src={elem.src}
                              alt={elem.name}
                              className="h-14 w-auto max-w-[85%] object-contain my-1 pointer-events-none group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <span className="text-2xl pointer-events-none">{elem.icon}</span>
                          )}
                          <span className="text-[9px] font-bold text-slate-700 group-hover:text-[#991B1B] text-center leading-tight pointer-events-none truncate max-w-full">
                            {elem.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* TAB: LAYERS (CARD DECK VISUALIZER & SHEETS) */}
        {tabToRender === "layers" && (
          <div className="space-y-4">
            
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
                      ? "bg-[#991B1B] text-white shadow-xs"
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
                      ? "bg-[#991B1B] text-white shadow-xs"
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
                      ? "bg-[#991B1B] text-white shadow-xs"
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
                    const baseLayer = pages.find((p) => p.isBase) || pages[0];
                    const baseDim = getLayerDimensions(baseLayer, baseLayer);
                    const maxHeightPx = 180;
                    const scaleFactor = maxHeightPx / baseDim.height;

                    const sortedForStack = [...pages]
                      .map((p, origIdx) => ({ page: p, origIdx }))
                      .sort((a, b) => {
                        const aPct = a.page.isBase !== false ? 100 : a.page.heightPercent || 85;
                        const bPct = b.page.isBase !== false ? 100 : b.page.heightPercent || 85;
                        return bPct - aPct;
                      });

                    return sortedForStack.map((item, stackPos) => {
                      const { page: p, origIdx } = item;
                      const isSelected = origIdx === activePageIndex;
                      const pDim = getPhysicalDimensions(p, baseLayer);
                      const renderW = Math.round(pDim.pixelW * scaleFactor);
                      const renderH = Math.round(pDim.pixelH * scaleFactor);

                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setActivePageIndex(origIdx);
                            setSelectedId(null);
                          }}
                          style={{
                            width: `${renderW}px`,
                            height: `${renderH}px`,
                            zIndex: stackPos + 10,
                            backgroundColor: p.backgroundColor || "#FFFFFF",
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
                              {p.title || p.name || `Sheet ${origIdx + 1}`}
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


            {/* ── 4. CANVAS ELEMENTS ON ACTIVE SHEET ── */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Elements on Active Sheet ({elements.length})
              </h3>
              <div className="space-y-1.5">
                {elements.length === 0 ? (
                  <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                    No elements on this card insert sheet yet.
                  </div>
                ) : (
                  elements.map((el, i) => (
                    <div
                      key={el.id}
                      onClick={() => {
                        setSelectedId(el.id);
                        setMobileSheetOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-bold cursor-pointer transition-colors ${
                        el.id === selectedId
                          ? "bg-red-50 border-[#991B1B] text-[#991B1B]"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span className="truncate">
                        {el.text || (el.type === "image" ? "Graphic Image" : `Layer #${i + 1}`)}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedPages = pages.map((pg, idx) =>
                              idx === activePageIndex
                                ? {
                                    ...pg,
                                    elements: pg.elements.map((item) =>
                                      item.id === el.id ? { ...item, isHidden: !item.isHidden } : item
                                    ),
                                  }
                                : pg
                            );
                            setPages(updatedPages);
                            pushState(updatedPages);
                            setHasUnsavedChanges(true);
                          }}
                          className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                          title={el.isHidden ? "Unhide Layer" : "Hide Layer"}
                        >
                          {el.isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-600" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedPages = pages.map((pg, idx) =>
                              idx === activePageIndex
                                ? {
                                    ...pg,
                                    elements: pg.elements.map((item) =>
                                      item.id === el.id ? { ...item, isLocked: !item.isLocked } : item
                                    ),
                                  }
                                : pg
                            );
                            setPages(updatedPages);
                            pushState(updatedPages);
                            setHasUnsavedChanges(true);
                          }}
                          className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                          title={el.isLocked ? "Unlock Layer" : "Lock Layer"}
                        >
                          {el.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    );
  };

  const renderPersonalizationContent = () => {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#991B1B]" />
            <h3 className="text-xs font-extrabold text-[#1E293B] uppercase tracking-wider">Personalize Invitation</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-red-50 text-[#991B1B] border border-red-200 text-[9px] font-bold uppercase tracking-widest">
            SMART VARIABLES
          </span>
        </div>

        {/* 🎨 6-Color Theme Selector for Modern Floral Template */}
        {activeTemplateId === "modern-watercolor-floral" && (
          <div className="bg-[#FAF9FC] border border-purple-200/90 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A154B]">
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                <span>Floral Color Theme</span>
              </div>
              <span className="text-[9px] font-extrabold uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-mono">
                6 Colors
              </span>
            </div>
            <p className="text-[10px] text-gray-500">
              Select hand-painted watercolor color theme:
            </p>
            <div className="grid grid-cols-6 gap-1.5 pt-1">
              {MODERN_FLORAL_COLOR_VARIANTS.map((v) => {
                const isSelected = selectedColorVariantId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => handleSelectColorVariant(v)}
                    title={v.name}
                    className={`relative aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-purple-600 scale-110 shadow-md"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: v.swatchHex }}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3] drop-shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-[10px] font-bold text-center text-purple-900 pt-0.5">
              {MODERN_FLORAL_COLOR_VARIANTS.find((v) => v.id === selectedColorVariantId)?.name}
            </div>
          </div>
        )}

        {/* 🎨 5-Color Theme Selector for Modern Jewel & Gold Foil Template */}
        {activeTemplateId === "modern-watercolor-gold-splatter" && (
          <div className="bg-[#FAF9FC] border border-amber-300/80 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A154B]">
                <Palette className="w-3.5 h-3.5 text-amber-600" />
                <span>Jewel & Gold Color Theme</span>
              </div>
              <span className="text-[9px] font-extrabold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                5 Colors
              </span>
            </div>
            <p className="text-[10px] text-gray-500">
              Select rich jewel watercolor & gold foil tone:
            </p>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {MODERN_JEWEL_COLOR_VARIANTS.map((v) => {
                const isSelected = selectedColorVariantId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => handleSelectColorVariant(v)}
                    title={v.name}
                    className={`relative aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-amber-500 scale-110 shadow-md"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: v.swatchHex }}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3] drop-shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-[10px] font-bold text-center text-amber-900 pt-0.5">
              {MODERN_JEWEL_COLOR_VARIANTS.find((v) => v.id === selectedColorVariantId)?.name}
            </div>
          </div>
        )}

        {/* 🎨 5-Color Theme Selector for Modern Botanical Foliage Template */}
        {activeTemplateId === "modern-silver-botanical-foliage" && (
          <div className="bg-[#FAF9FC] border border-blue-300/80 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A]">
                <Palette className="w-3.5 h-3.5 text-blue-600" />
                <span>Botanical Color Theme</span>
              </div>
              <span className="text-[9px] font-extrabold uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full font-mono">
                5 Colors
              </span>
            </div>
            <p className="text-[10px] text-gray-500">
              Select botanical silver foliage color tone:
            </p>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {MODERN_BOTANICAL_COLOR_VARIANTS.map((v) => {
                const isSelected = selectedColorVariantId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => handleSelectColorVariant(v)}
                    title={v.name}
                    className={`relative aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-blue-600 scale-110 shadow-md"
                        : "hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: v.swatchHex }}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3] drop-shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-[10px] font-bold text-center text-blue-900 pt-0.5">
              {MODERN_BOTANICAL_COLOR_VARIANTS.find((v) => v.id === selectedColorVariantId)?.name}
            </div>
          </div>
        )}

        {/* Smart Form Inputs */}
        {activeTemplateId === "modern-silver-botanical-foliage" ? (
          /* ── 🌿 MODERN 3 BOTANICAL FOLIAGE INPUTS ── */
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                Host(s) / Header Line
              </label>
              <input
                type="text"
                value={personalization.modern3Host}
                onChange={(e) => handlePersonalizationChange("modern3Host", e.target.value)}
                placeholder="e.g. Host(s)"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif font-bold text-[#1E293B] outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                  Groom First Name
                </label>
                <input
                  type="text"
                  value={personalization.modern3GroomFirst}
                  onChange={(e) => handlePersonalizationChange("modern3GroomFirst", e.target.value)}
                  placeholder="e.g. First Name"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif font-bold text-[#1E293B] outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                  Groom Last Name
                </label>
                <input
                  type="text"
                  value={personalization.modern3GroomLast}
                  onChange={(e) => handlePersonalizationChange("modern3GroomLast", e.target.value)}
                  placeholder="e.g. last name"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif italic text-[#1E293B] outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                  Bride First Name
                </label>
                <input
                  type="text"
                  value={personalization.modern3BrideFirst}
                  onChange={(e) => handlePersonalizationChange("modern3BrideFirst", e.target.value)}
                  placeholder="e.g. First Name"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif font-bold text-[#1E293B] outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                  Bride Last Name
                </label>
                <input
                  type="text"
                  value={personalization.modern3BrideLast}
                  onChange={(e) => handlePersonalizationChange("modern3BrideLast", e.target.value)}
                  placeholder="e.g. last name"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif italic text-[#1E293B] outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                  Day & Month
                </label>
                <input
                  type="text"
                  value={personalization.modern3DateDay}
                  onChange={(e) => handlePersonalizationChange("modern3DateDay", e.target.value)}
                  placeholder="e.g. Day and Month"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={personalization.modern3DateYear}
                  onChange={(e) => handlePersonalizationChange("modern3DateYear", e.target.value)}
                  placeholder="e.g. Year"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                Time
              </label>
              <input
                type="text"
                value={personalization.modern3DateTime}
                onChange={(e) => handlePersonalizationChange("modern3DateTime", e.target.value)}
                placeholder="e.g. 4:00 PM"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-900 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                Venue Name
              </label>
              <input
                type="text"
                value={personalization.modern3VenueTitle}
                onChange={(e) => handlePersonalizationChange("modern3VenueTitle", e.target.value)}
                placeholder="e.g. Venue"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif font-bold text-[#1E293B] outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={personalization.modern3VenueAddr1}
                  onChange={(e) => handlePersonalizationChange("modern3VenueAddr1", e.target.value)}
                  placeholder="e.g. Address Line 1"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs text-[#1E293B] outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={personalization.modern3VenueAddr2}
                  onChange={(e) => handlePersonalizationChange("modern3VenueAddr2", e.target.value)}
                  placeholder="e.g. Address Line 2"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs text-[#1E293B] outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        ) : activeTemplateId === "modern-watercolor-floral" || activeTemplateId === "modern-watercolor-gold-splatter" || templateTopic === "modern" ? (
          /* ── 🌟 MODERN TEMPLATE SPECIFIC INPUTS ── */
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                Top Tagline / Blessing
              </label>
              <input
                type="text"
                value={personalization.modernTagline}
                onChange={(e) => handlePersonalizationChange("modernTagline", e.target.value)}
                placeholder="e.g. Praise the lord"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-[#1E293B] outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                  Groom Name
                </label>
                <input
                  type="text"
                  value={personalization.modernGroom}
                  onChange={(e) => handlePersonalizationChange("modernGroom", e.target.value)}
                  placeholder="e.g. Kirubin"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif font-bold text-[#1E293B] outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                  Bride Name
                </label>
                <input
                  type="text"
                  value={personalization.modernBride}
                  onChange={(e) => handlePersonalizationChange("modernBride", e.target.value)}
                  placeholder="e.g. Asha"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif font-bold text-[#1E293B] outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                Event Date & Time
              </label>
              <input
                type="text"
                value={personalization.modernDate}
                onChange={(e) => handlePersonalizationChange("modernDate", e.target.value)}
                placeholder="e.g. 3 Jan 2024, Saturday @10am"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-purple-800 outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                Welcome Invitation Sentence
              </label>
              <input
                type="text"
                value={personalization.modernWelcome}
                onChange={(e) => handlePersonalizationChange("modernWelcome", e.target.value)}
                placeholder="e.g. Welcomes you all Kirubin Wedding"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif italic text-[#1E293B] outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                  Place & Phone
                </label>
                <textarea
                  rows={2}
                  value={personalization.modernContact}
                  onChange={(e) => handlePersonalizationChange("modernContact", e.target.value)}
                  placeholder="Place: Karumankoodal&#10;Phone: 8489520394"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-1.5 text-[11px] font-sans text-[#1E293B] outline-none focus:border-purple-500 focus:bg-white resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                  Host (With Love)
                </label>
                <textarea
                  rows={2}
                  value={personalization.modernFamilyWithLove}
                  onChange={(e) => handlePersonalizationChange("modernFamilyWithLove", e.target.value)}
                  placeholder="With love&#10;M. Tharmar&#10;S. Rajam"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-2.5 py-1.5 text-[11px] font-sans text-[#1E293B] outline-none focus:border-purple-500 focus:bg-white resize-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                Marriage Ceremony (Church & Time)
              </label>
              <textarea
                rows={2}
                value={personalization.modernMarriageVenue}
                onChange={(e) => handlePersonalizationChange("modernMarriageVenue", e.target.value)}
                placeholder="Marthal Zion C.S.I Church Marthal&#10;Time: 10:30 am"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-sans text-[#1E293B] outline-none focus:border-purple-500 focus:bg-white resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                Reception Details (Hall & Time)
              </label>
              <textarea
                rows={2}
                value={personalization.modernReceptionVenue}
                onChange={(e) => handlePersonalizationChange("modernReceptionVenue", e.target.value)}
                placeholder="Holy loosiyal Auditorium&#10;Location: Pudur to maindaikadu road&#10;Time: 6pm"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-sans text-[#1E293B] outline-none focus:border-purple-500 focus:bg-white resize-none"
              />
            </div>
          </div>
        ) : (
          /* ── 📜 VINTAGE TEMPLATE INPUTS ── */
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                  Bride Name
                </label>
                <input
                  type="text"
                  value={personalization.brideName || ""}
                  onChange={(e) => handlePersonalizationChange("brideName", e.target.value)}
                  placeholder="e.g. Sophia"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif font-bold text-[#1E293B] outline-none focus:border-[#D9A441] focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                  Groom Name
                </label>
                <input
                  type="text"
                  value={personalization.groomName || ""}
                  onChange={(e) => handlePersonalizationChange("groomName", e.target.value)}
                  placeholder="e.g. Alexander"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif font-bold text-[#1E293B] outline-none focus:border-[#D9A441] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={personalization.eventName}
                onChange={(e) => handlePersonalizationChange("eventName", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-[#1E293B] outline-none focus:border-[#D9A441] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={personalization.date}
                  onChange={(e) => handlePersonalizationChange("date", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#B58328] outline-none focus:border-[#D9A441] focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                  Time
                </label>
                <input
                  type="text"
                  value={personalization.time}
                  onChange={(e) => handlePersonalizationChange("time", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-[#1E293B] outline-none focus:border-[#D9A441] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                Venue Name
              </label>
              <input
                type="text"
                value={personalization.venue}
                onChange={(e) => handlePersonalizationChange("venue", e.target.value)}
                placeholder="e.g. Elamba Mudakkal Palace"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-[#1E293B] outline-none focus:border-[#D9A441] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                Full Address & City
              </label>
              <input
                type="text"
                value={personalization.address}
                onChange={(e) => handlePersonalizationChange("address", e.target.value)}
                placeholder="e.g. MG Road, Trivandrum, Kerala"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-[#1E293B] outline-none focus:border-[#D9A441] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                RSVP Contact
              </label>
              <input
                type="text"
                value={personalization.rsvp}
                onChange={(e) => handlePersonalizationChange("rsvp", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-[#1E293B] outline-none focus:border-[#D9A441] focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* ✨ AI Assistant Quick Prompts */}
        <div className="bg-red-50/60 border border-red-200 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#991B1B]">
            <Wand2 className="w-3.5 h-3.5" />
            <span>✨ AI Wording Assistant</span>
          </div>
          <p className="text-[10px] text-slate-600">One-click rewrite options for luxury wording:</p>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => handlePersonalizationChange("coupleNames", "Sophia & Alexander")}
              className="p-2 rounded-xl bg-white border border-slate-200 text-[10px] font-bold text-slate-800 hover:bg-[#991B1B] hover:text-white transition-all text-left cursor-pointer"
            >
              ✨ Make Romantic & Formal
            </button>
            <button
              onClick={() => handlePersonalizationChange("coupleNames", "S & A")}
              className="p-2 rounded-xl bg-white border border-slate-200 text-[10px] font-bold text-slate-800 hover:bg-[#991B1B] hover:text-white transition-all text-left cursor-pointer"
            >
              ✨ Switch to Monogram Initials
            </button>
          </div>
        </div>

        {/* Bottom Place Order Action */}
        <div className="pt-3 border-t border-slate-200 shrink-0">
          <button
            onClick={() => {
              handleOpenOrderModal();
              setMobileSheetOpen(false);
            }}
            className="w-full py-3.5 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-amber-300" />
            <span>Place Order</span>
          </button>
        </div>
      </div>
    );
  };

  const renderFormatContent = () => {
    if (!activeElement) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#991B1B]">
            <MousePointer className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Select an Element</h4>
          <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
            Click on any text or graphic on the card to edit its font, colors, dimensions, and positioning here.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Active Element Header & Quick Actions */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 rounded-full bg-[#991B1B] text-white text-[9px] font-extrabold uppercase tracking-wider">
              {activeElement.type === "text" ? "Text" : "Graphic"}
            </span>
            <span className="text-xs font-bold text-slate-800 truncate">
              {activeElement.text || (activeElement.type === "image" ? "Graphic Image" : "Layer")}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Duplicate */}
            <button
              onClick={handleDuplicate}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Duplicate Element"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            {/* Lock / Unlock */}
            <button
              onClick={handleToggleLock}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title={activeElement.isLocked ? "Unlock Element" : "Lock Element"}
            >
              {activeElement.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>

            {/* Hide / Unhide */}
            <button
              onClick={() => updateActiveElement({ isHidden: !activeElement.isHidden })}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title={activeElement.isHidden ? "Unhide Element" : "Hide Element"}
            >
              {activeElement.isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-600" /> : <Eye className="w-3.5 h-3.5" />}
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
              title="Delete Element"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1. TEXT EDITING (For Text Elements) */}
        {activeElement.type === "text" && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Text Content
            </label>
            <div className="space-y-1.5">
              <textarea
                value={activeElement.text || ""}
                onChange={(e) => updateActiveElement({ text: e.target.value })}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-[#991B1B] rounded-xl text-xs font-medium text-slate-900 outline-none resize-y"
                placeholder="Type text..."
              />
              <button
                type="button"
                onClick={() => updateActiveElement({ text: (activeElement.text || "") + "\n" })}
                className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <WrapText className="w-3.5 h-3.5 text-[#991B1B]" />
                <span>Add Next Line / Line Break</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. TYPOGRAPHY (For Text Elements) */}
        {activeElement.type === "text" && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Typography &amp; Style
            </label>

            {/* Font Family */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold">Font Family</span>
              <select
                value={activeElement.fontFamily}
                onChange={(e) => updateActiveElement({ fontFamily: e.target.value })}
                className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none cursor-pointer focus:border-[#991B1B]"
              >
                {FONTS.map((f) => (
                  <option key={f.name} value={f.family}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Color */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold">Font Size</span>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => updateActiveElement({ fontSize: Math.max(8, (activeElement.fontSize || 20) - 2) })}
                    className="p-1 rounded bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    value={activeElement.fontSize || 20}
                    onChange={(e) => updateActiveElement({ fontSize: Number(e.target.value) })}
                    className="w-full bg-transparent text-xs font-bold text-center outline-none text-slate-800"
                  />
                  <button
                    onClick={() => updateActiveElement({ fontSize: Math.min(200, (activeElement.fontSize || 20) + 2) })}
                    className="p-1 rounded bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold">Text Color</span>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 px-2 h-[34px]">
                  <input
                    type="color"
                    value={activeElement.color || "#1E293B"}
                    onChange={(e) => updateActiveElement({ color: e.target.value })}
                    className="w-6 h-6 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                  />
                  <span className="font-mono text-[11px] font-bold text-slate-700 truncate">
                    {activeElement.color || "#1E293B"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Color Palette Swatches */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {["#1E293B", "#991B1B", "#B45309", "#065F46", "#1E3A8A", "#581C87", "#F3EAD8", "#FFFFFF"].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => updateActiveElement({ color: col })}
                  style={{ backgroundColor: col }}
                  className={`w-5 h-5 rounded-full border border-slate-300 transition-transform cursor-pointer ${
                    activeElement.color === col ? "ring-2 ring-[#991B1B] scale-110" : "hover:scale-110"
                  }`}
                  title={col}
                />
              ))}
            </div>

            {/* Alignment */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold">Text Alignment</span>
              <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => updateActiveElement({ textAlign: "left" })}
                  className={`py-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    activeElement.textAlign === "left" ? "bg-[#991B1B] text-white" : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Left</span>
                </button>
                <button
                  onClick={() => updateActiveElement({ textAlign: "center" })}
                  className={`py-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    !activeElement.textAlign || activeElement.textAlign === "center"
                      ? "bg-[#991B1B] text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                  <span>Center</span>
                </button>
                <button
                  onClick={() => updateActiveElement({ textAlign: "right" })}
                  className={`py-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    activeElement.textAlign === "right" ? "bg-[#991B1B] text-white" : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                  <span>Right</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. SIZE & DIMENSIONS */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
            Dimensions &amp; Width
          </label>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
              <span>Card Width %</span>
              <span className="font-mono text-slate-800 font-bold">{Math.round(activeElement.width || 80)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateActiveElement({ width: Math.max(5, (activeElement.width || 80) - 5) })}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Decrease Width"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min={5}
                max={100}
                value={Math.round(activeElement.width || 80)}
                onChange={(e) => updateActiveElement({ width: Number(e.target.value) })}
                className="flex-1 accent-[#991B1B] cursor-pointer"
              />
              <button
                onClick={() => updateActiveElement({ width: Math.min(100, (activeElement.width || 80) + 5) })}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Increase Width"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={() => handleAlign("center")}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-[#991B1B] hover:text-white text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <AlignCenter className="w-3.5 h-3.5 text-[#991B1B]" />
            <span>Align Horizontally to Center</span>
          </button>
        </div>

        {/* 4. POSITION & NUDGE */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Nudge Position
            </label>
            <button
              onClick={() => setNudgeStep((prev) => (prev === 1 ? 5 : prev === 5 ? 0.5 : 1))}
              className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Change nudge step percentage"
            >
              Step: {nudgeStep}%
            </button>
          </div>

          <div className="flex flex-col items-center gap-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => handleNudge("up")}
              className="p-2 rounded-xl bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 font-bold transition-colors cursor-pointer shadow-2xs"
              title="Move Up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNudge("left")}
                className="p-2 rounded-xl bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 font-bold transition-colors cursor-pointer shadow-2xs"
                title="Move Left"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-[10px] font-mono font-bold text-slate-600">
                {nudgeStep}%
              </div>
              <button
                onClick={() => handleNudge("right")}
                className="p-2 rounded-xl bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 font-bold transition-colors cursor-pointer shadow-2xs"
                title="Move Right"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => handleNudge("down")}
              className="p-2 rounded-xl bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 font-bold transition-colors cursor-pointer shadow-2xs"
              title="Move Down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5. ARRANGE / LAYER ORDER */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
            Layer Order
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleArrange("forward")}
              className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Forward</span>
            </button>
            <button
              onClick={() => handleArrange("backward")}
              className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Backward</span>
            </button>
            <button
              onClick={() => handleArrange("front")}
              className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronsUp className="w-3.5 h-3.5" />
              <span>To Front</span>
            </button>
            <button
              onClick={() => handleArrange("back")}
              className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronsDown className="w-3.5 h-3.5" />
              <span>To Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const basePage = pages.find((p) => p.isBase) || pages[0];
  const activeDimensions = getLayerDimensions(currentPage, basePage);

  const getCanvasDimensions = () => {
    return {
      width: `${activeDimensions.width}px`,
      height: `${activeDimensions.height}px`,
      ratio: activeDimensions.ratioStr,
    };
  };

  const canvasDim = getCanvasDimensions();

  // Dynamic Fit to screen helper (ensures entire card fits without needing scrollbars)
  const handleFitToScreen = useCallback(() => {
    if (!workspaceRef.current) return;
    const containerH = workspaceRef.current.clientHeight - 130;
    const containerW = workspaceRef.current.clientWidth - 36;
    if (containerH <= 0 || containerW <= 0) return;
    const scaleH = containerH / activeDimensions.height;
    const scaleW = containerW / activeDimensions.width;
    const fitScale = Math.min(scaleH, scaleW, 0.9);
    setZoomLevel(Math.max(30, Math.round(fitScale * 100)));
  }, [activeDimensions.width, activeDimensions.height]);

  // Auto-fit on mount, window resize, active page switch, or dimension change
  useEffect(() => {
    handleFitToScreen();
    const timer = setTimeout(handleFitToScreen, 150);
    window.addEventListener("resize", handleFitToScreen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleFitToScreen);
    };
  }, [handleFitToScreen, activePageIndex, currentPage.aspectRatio, currentPage.heightPercent]);

  return (
    <div
      data-lenis-prevent
      className="h-screen max-h-screen w-full bg-slate-50 text-[#1E293B] flex flex-col font-sans overflow-hidden select-none"
    >
      
      {/* ── ADMIN ORDER EDITING BANNER ── */}
      {adminOrderContext && (
        <div className="w-full bg-[#991B1B] text-white px-3 sm:px-6 py-2 flex items-center justify-between shadow-md z-50 text-xs sm:text-sm font-bold shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono uppercase tracking-wider shrink-0">
              🛠️ Admin Studio Mode
            </span>
            <span className="truncate">
              Order #{adminOrderContext.orderNumber} &bull; {adminOrderContext.templateName}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => router.push(`/admin/orders/${adminOrderContext.orderId}`)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer text-xs font-medium"
            >
              Back to Order
            </button>
            <button
              onClick={handleSaveAdminOrder}
              disabled={savingAdminOrder}
              className="px-4 py-1 bg-white text-[#991B1B] hover:bg-red-50 rounded-xl shadow-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            >
              {savingAdminOrder ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savingAdminOrder ? "Saving..." : "Save to Order"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 1. TOP NAVIGATION BAR ── */}
      <header data-lenis-prevent className="h-14 sm:h-16 bg-white border-b border-slate-200 px-2 sm:px-4 md:px-6 flex items-center justify-between gap-1 sm:gap-3 shrink-0 z-40 shadow-xs overflow-x-auto no-scrollbar whitespace-nowrap flex-nowrap">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 shrink">
          <button
            onClick={(e) => handleBackNavigation(e, "/templates")}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200 flex items-center gap-1 text-xs font-bold cursor-pointer shrink-0"
            title="Back to Templates"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
            <span className="hidden md:inline">Templates</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-red-50 border border-red-200 text-[#991B1B] flex items-center justify-center font-extrabold shadow-2xs shrink-0">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-[#991B1B]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => {
                    setDocTitle(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  className="bg-transparent text-xs sm:text-sm font-serif font-bold text-slate-900 outline-none border-b border-transparent hover:border-[#991B1B] focus:border-[#991B1B] transition-colors py-0.5 max-w-[80px] xs:max-w-[110px] sm:max-w-[160px] md:max-w-xs truncate"
                />
              </div>
              <span className={`text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1 ${hasUnsavedChanges ? "text-amber-600" : "text-emerald-600"}`}>
                {hasUnsavedChanges ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" /> Unsaved
                  </>
                ) : (
                  <>
                    <Check className="w-2.5 h-2.5 text-emerald-600" /> Saved
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions (Undo, Redo, Save, More Options, Download, Order Prints) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1 sm:p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1 sm:p-1.5 rounded-lg text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* 🌟 SAVE BUTTON 🌟 */}
          <button
            onClick={() => handleSave(null)}
            disabled={saving}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all shadow-xs cursor-pointer shrink-0 ${
              hasUnsavedChanges
                ? "bg-[#991B1B] text-white hover:bg-[#7F1D1D] shadow-md animate-pulse"
                : "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
            }`}
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : hasUnsavedChanges ? (
              <Save className="w-3.5 h-3.5" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span className="hidden xs:inline">{saving ? "..." : hasUnsavedChanges ? "Save" : "Saved"}</span>
          </button>

          {/* Expanded Preview & Share on large screens (>= 1536px) */}
          <button
            onClick={() => setShowPreviewModal(true)}
            className="hidden 2xl:flex px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-extrabold uppercase tracking-wider hover:bg-red-50 hover:text-[#991B1B] transition-colors items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <Eye className="w-3.5 h-3.5 text-[#991B1B]" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="hidden 2xl:flex px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-extrabold uppercase tracking-wider hover:bg-red-50 hover:text-[#991B1B] transition-colors items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <Share2 className="w-3.5 h-3.5 text-[#991B1B]" />
            <span>Share</span>
          </button>

          {/* 🌟 MORE OPTIONS (•••) DROPDOWN (on screens < 2xl) 🌟 */}
          <div className="relative 2xl:hidden shrink-0">
            <button
              onClick={() => setShowTopMoreMenu(!showTopMoreMenu)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors flex items-center justify-center cursor-pointer"
              title="More Options (Preview, Share)"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showTopMoreMenu && (
              <div
                data-lenis-prevent
                className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 text-xs text-slate-900 animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  onClick={() => {
                    setShowPreviewModal(true);
                    setShowTopMoreMenu(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-red-50 hover:text-[#991B1B] flex items-center gap-2 font-bold text-left cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#991B1B]" />
                  <span>Preview Full Screen</span>
                </button>
                <button
                  onClick={() => {
                    setShowShareModal(true);
                    setShowTopMoreMenu(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-red-50 hover:text-[#991B1B] flex items-center gap-2 font-bold text-left cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#991B1B]" />
                  <span>Share Online</span>
                </button>
              </div>
            )}
          </div>

          {/* 🌟 DOWNLOAD / EXPORT BUTTON (DISABLED) 🌟 */}
          <button
            type="button"
            disabled
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-2xs flex items-center gap-1 shrink-0 cursor-not-allowed opacity-60 select-none"
            title="Download is disabled"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">Export</span>
          </button>

          {/* 🌟 ACTION BUTTON: SAVE FOR ADMIN OR ORDER FOR CUSTOMER 🌟 */}
          {adminOrderContext ? (
            <button
              onClick={handleSaveAdminOrder}
              disabled={savingAdminOrder}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
              title="Save changes directly to customer order"
            >
              {savingAdminOrder ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savingAdminOrder ? "Saving..." : "Save to Order"}</span>
            </button>
          ) : (
            <button
              onClick={handleOpenOrderModal}
              className="px-2.5 xs:px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1 sm:gap-1.5 shrink-0 cursor-pointer hover:scale-105"
              title="Order Physical Cards & Prints or Add to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden xs:inline">Order Prints</span>
              <span className="xs:hidden">Order</span>
            </button>
          )}

        </div>
      </header>

      {/* ── 3. MAIN THREE-COLUMN STUDIO BODY (Responsive Flex) ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative pb-16 lg:pb-0">
        
        {/* ── DESKTOP LEFT SIDEBAR: UNIFIED TABBED SIDEBAR (MATCHING ADMIN BUILDER) ── */}
        <aside className="hidden lg:flex w-80 xl:w-84 h-full flex-col bg-white border-r border-slate-200 shrink-0 z-10 shadow-xs">
          {/* Navigation Tabs */}
          <div className="shrink-0 grid grid-cols-4 p-2 gap-1 bg-slate-50 border-b border-slate-200 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab("templates")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "templates" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>

            <button
              onClick={() => setActiveTab("text")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "text" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              onClick={() => setActiveTab("elements")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "elements" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Elements</span>
            </button>

            <button
              onClick={() => setActiveTab("layers")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "layers" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>
          </div>

          {/* Scrollable Left Tab Body */}
          <div
            data-lenis-prevent
            className="flex-1 min-h-0 overflow-y-auto custom-scrollbar select-auto overscroll-contain bg-white p-3.5"
          >
            {renderLeftToolsDrawerContent(activeTab)}
          </div>
        </aside>

        {/* ── CENTER COLUMN: CANVAS WORKSPACE (Responsive Full-Width on Mobile) ── */}
        <div className="flex-1 h-full min-h-0 relative overflow-hidden bg-[#EAEAEA] flex flex-col">
          {/* ── MOBILE TOGGLEABLE HORIZONTAL LAYER THUMBNAILS TRAY ── */}
          <div className="lg:hidden absolute top-2.5 left-2 right-2 z-20 flex flex-col items-center gap-1.5 pointer-events-none">
            {/* Toggle Pill Button */}
            <button
              type="button"
              onClick={() => setShowMobileLayers(!showMobileLayers)}
              className="pointer-events-auto px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-slate-800 text-[10.5px] font-extrabold flex items-center gap-1.5 cursor-pointer hover:bg-red-50 hover:text-[#991B1B] hover:border-red-200 transition-all active:scale-95"
            >
              <Layers className="w-3.5 h-3.5 text-[#991B1B]" />
              <span className="truncate max-w-[140px]">
                {currentPage.title || currentPage.name || `Sheet ${activePageIndex + 1}`} ({activePageIndex + 1}/{pages.length})
              </span>
              <span className="text-[9px] text-[#991B1B] bg-red-50 px-1.5 py-0.2 rounded font-bold">
                {showMobileLayers ? "▲ Hide" : "▼ Layers"}
              </span>
            </button>

            {/* Expandable Horizontal Thumbnails Strip */}
            {showMobileLayers && (
              <div className="pointer-events-auto w-full max-w-sm bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-2.5 animate-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-2.5 overflow-x-auto custom-scrollbar pb-1">
                  {pages.map((layer, idx) => {
                    const isSelected = idx === activePageIndex;
                    const lDim = getLayerDimensions(layer, basePage);
                    const scale = Math.min(38 / lDim.width, 54 / lDim.height);
                    const thumbW = Math.max(24, Math.round(lDim.width * scale));
                    const thumbH = Math.max(24, Math.round(lDim.height * scale));

                    return (
                      <div
                        key={layer.id}
                        onClick={() => {
                          setActivePageIndex(idx);
                          setSelectedId(null);
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
                          {layer.title || layer.name || `Sheet ${idx + 1}`}
                        </span>
                      </div>
                    );
                  })}

                  {/* + Add Button in Mobile Tray */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextIdx = pages.length + 1;
                      const newId = `layer-${Date.now()}`;
                      const defaultPct = nextIdx === 2 ? 85 : nextIdx === 3 ? 72 : 60;
                      const baseDim = getLayerDimensions(basePage, basePage);
                      const newLayer: CanvasPage = {
                        id: newId,
                        title: `Insert Sheet ${nextIdx}`,
                        name: `Insert Sheet ${nextIdx}`,
                        isBase: false,
                        heightPercent: defaultPct,
                        aspectRatio: currentPage.aspectRatio || "classic",
                        customWidth: Math.round(baseDim.width * (defaultPct / 100)),
                        customHeight: Math.round(baseDim.height * (defaultPct / 100)),
                        lockRatio: true,
                        backgroundColor: "#FFFFFF",
                        backgroundImage: null,
                        bgMode: "textures",
                        elements: [],
                      };
                      setPages([...pages, newLayer]);
                      setActivePageIndex(pages.length);
                    }}
                    className="w-8 h-8 rounded-full bg-white hover:bg-red-50 border border-slate-300 hover:border-[#991B1B] text-slate-600 hover:text-[#991B1B] flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer group"
                    title="Add another card layer"
                  >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Viewport (Scrollable with guaranteed top clearance) */}
          <div
            ref={workspaceRef}
            onWheel={handleWheelZoom}
            onClick={() => setSelectedId(null)}
            className="flex-1 w-full flex flex-col items-center justify-center p-2 sm:p-6 pb-28 overflow-y-auto overflow-x-auto h-full cursor-default custom-scrollbar select-none min-h-0"
          >
          
          {/* Main Canvas Card Container (Exact scaled dimensions so top is never hidden on zoom) */}
          <div
            style={{
              width: `${Math.round(activeDimensions.width * (zoomLevel / 100))}px`,
              height: `${Math.round(activeDimensions.height * (zoomLevel / 100))}px`,
            }}
            className="relative shrink-0 my-auto mx-auto"
          >
            <div
              ref={canvasRef}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(null);
                setShowMoreMenu(false);
                setActiveSubMenu(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDrop={(e) => {
                e.preventDefault();
                try {
                  const raw = e.dataTransfer.getData("application/json");
                  if (!raw) return;
                  const elem = JSON.parse(raw);
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const dropX = Math.max(0, Math.min(85, Math.round(((e.clientX - rect.left) / rect.width) * 100) - 15));
                  const dropY = Math.max(0, Math.min(85, Math.round(((e.clientY - rect.top) / rect.height) * 100) - 5));
                  handleAddGraphicAt(elem, dropX, dropY);
                } catch (err) {
                  console.error("Drop error:", err);
                }
              }}
              style={{
                width: canvasDim.width,
                height: canvasDim.height,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "0 0",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              className="shadow-2xl rounded-3xl transition-transform duration-100 overflow-hidden"
            >
              {/* INNER ARTWORK CONTAINER */}
              <div
                style={{
                  backgroundColor:
                    currentPage.backgroundColor &&
                    (currentPage.backgroundColor.startsWith("#") || currentPage.backgroundColor.startsWith("rgb"))
                      ? currentPage.backgroundColor
                      : undefined,
                  backgroundImage: currentPage.backgroundImage
                    ? `url(${currentPage.backgroundImage})`
                    : currentPage.backgroundColor && currentPage.backgroundColor.includes("gradient")
                    ? currentPage.backgroundColor
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                className={`absolute inset-0 rounded-3xl overflow-hidden pointer-events-none ${
                  showGrid ? "bg-[radial-gradient(#D9A441_1px,transparent_1px)] [background-size:16px_16px]" : ""
                }`}
              />

              {/* Elements Rendering Layer */}
              {elements.map((el) => {
                const isSelected = el.id === selectedId;
                const isNearTop = el.y <= 18;

                return (
                  <div
                    key={el.id}
                    onPointerDown={(e) => handlePointerDownElement(e, el)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(el.id);
                      setShowMoreMenu(false);
                      setActiveSubMenu(null);
                    }}
                    data-hidden={el.isHidden ? "true" : "false"}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      opacity: el.isHidden ? (isSelected ? 0.35 : 0) : el.opacity,
                      display: el.isHidden && !isSelected ? "none" : "block",
                      zIndex: isSelected ? 100 : el.zIndex,
                      cursor: el.isLocked ? "default" : "move",
                      touchAction: "none",
                    }}
                    className={`relative select-none transition-shadow ${
                      isSelected ? (el.isHidden ? "ring-2 ring-rose-400 border-2 border-dashed border-rose-400" : "ring-2 ring-[#991B1B] ring-offset-0") : ""
                    }`}
                  >
                    {/* 🌟 8-POINT & SIDE RESIZE HANDLES 🌟 */}
                    {isSelected && !el.isLocked && (
                      <>
                        {/* West / Left Handle (Width) */}
                        <div
                          onPointerDown={(e) => handlePointerDownResize(e, "w", el)}
                          className="resize-handle absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#991B1B] rounded-full shadow-md z-40 cursor-ew-resize hover:scale-125 transition-transform"
                          title="Drag to resize width"
                        />
                        {/* East / Right Handle (Width) */}
                        <div
                          onPointerDown={(e) => handlePointerDownResize(e, "e", el)}
                          className="resize-handle absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#991B1B] rounded-full shadow-md z-40 cursor-ew-resize hover:scale-125 transition-transform"
                          title="Drag to resize width"
                        />
                        {/* Bottom-Right Corner Handle */}
                        <div
                          onPointerDown={(e) => handlePointerDownResize(e, "se", el)}
                          className="resize-handle absolute -right-1.5 -bottom-1.5 w-3.5 h-3.5 bg-white border-2 border-[#991B1B] rounded-sm shadow-sm z-40 cursor-nwse-resize hover:scale-125 transition-transform"
                          title="Drag corner to resize"
                        />
                        {/* Bottom-Left Corner Handle */}
                        <div
                          onPointerDown={(e) => handlePointerDownResize(e, "sw", el)}
                          className="resize-handle absolute -left-1.5 -bottom-1.5 w-3.5 h-3.5 bg-white border-2 border-[#991B1B] rounded-sm shadow-sm z-40 cursor-nesw-resize hover:scale-125 transition-transform"
                          title="Drag corner to resize"
                        />
                      </>
                    )}

                    {/* 🌟 CANVA-STYLE FLOATING CAPSULE TOOLBAR 🌟 */}
                    {isSelected && (
                      <div
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onMouseUp={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          left: "50%",
                          transform: "translateX(-50%)",
                          ...(isNearTop ? { top: "100%", marginTop: "10px" } : { bottom: "100%", marginBottom: "10px" }),
                        }}
                        className="floating-toolbar bg-white text-gray-800 border border-gray-200/90 rounded-2xl px-2 py-1.5 shadow-2xl flex items-center gap-1.5 z-[999] text-xs shrink-0 whitespace-nowrap pointer-events-auto select-none"
                      >
                        <button
                          onClick={() => setShowNudgePad(!showNudgePad)}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            showNudgePad ? "bg-[#991B1B] text-white" : "hover:bg-gray-100 text-gray-700"
                          }`}
                          title="Nudge / Move Position"
                        >
                          <Move className="w-4 h-4" />
                        </button>

                        {/* 🌟 4-WAY DIRECTIONAL TOUCH NUDGE PAD POPOVER 🌟 */}
                        {showNudgePad && (
                          <div
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-slate-900 text-white border border-slate-700 rounded-2xl p-2.5 shadow-2xl z-[1001] flex flex-col items-center gap-1 text-xs animate-in fade-in zoom-in-95"
                          >
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Move Element</span>
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleNudge("up")}
                                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#991B1B] text-white flex items-center justify-center font-extrabold active:scale-95 transition-all shadow-xs cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleNudge("left")}
                                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#991B1B] text-white flex items-center justify-center font-extrabold active:scale-95 transition-all shadow-xs cursor-pointer"
                                title="Move Left"
                              >
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateActiveElement({ x: Math.round((100 - el.width) / 2) })}
                                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 flex items-center justify-center font-bold active:scale-95 transition-all text-[10px] cursor-pointer"
                                title="Center Horizontal"
                              >
                                Center
                              </button>
                              <button
                                onClick={() => handleNudge("right")}
                                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#991B1B] text-white flex items-center justify-center font-extrabold active:scale-95 transition-all shadow-xs cursor-pointer"
                                title="Move Right"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleNudge("down")}
                                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#991B1B] text-white flex items-center justify-center font-extrabold active:scale-95 transition-all shadow-xs cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between w-full mt-1 pt-1 border-t border-slate-800 text-[10px]">
                              <span className="text-slate-400">Step:</span>
                              <button
                                onClick={() => setNudgeStep((prev) => (prev === 1 ? 5 : prev === 5 ? 0.5 : 1))}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold cursor-pointer"
                              >
                                {nudgeStep}%
                              </button>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => updateActiveElement({ isHidden: !el.isHidden })}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            el.isHidden ? "bg-rose-100 text-rose-800" : "hover:bg-gray-100 text-gray-700"
                          }`}
                          title={el.isHidden ? "Unhide Element" : "Hide Element"}
                        >
                          {el.isHidden ? <EyeOff className="w-4 h-4 text-rose-600" /> : <Eye className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={handleToggleLock}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            el.isLocked ? "bg-amber-100 text-amber-800" : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {el.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={handleDuplicate}
                          className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-all cursor-pointer"
                        >
                          <CopyPlus className="w-4 h-4" />
                        </button>

                        <button
                          onClick={handleDelete}
                          className="p-1.5 rounded-xl hover:bg-red-50 text-red-600 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setShowMoreMenu(!showMoreMenu);
                            setActiveSubMenu(null);
                          }}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            showMoreMenu ? "bg-gray-200" : "hover:bg-gray-100"
                          }`}
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-700" />
                        </button>

                        {/* 🌟 CANVA MORE OPTIONS IN-PLACE DRILLDOWN MENU 🌟 */}
                        {showMoreMenu && (
                          <div
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl p-1.5 z-[1000] flex flex-col gap-0.5 text-xs text-gray-800 animate-in fade-in zoom-in-95 duration-100"
                          >
                            {/* ── 1. ROOT MENU VIEW ── */}
                            {!activeSubMenu && (
                              <>
                                <button
                                  onClick={() => setActiveSubMenu("arrange")}
                                  className="w-full px-3 py-2 rounded-xl hover:bg-gray-100 flex items-center justify-between transition-colors text-left cursor-pointer"
                                >
                                  <span className="flex items-center gap-2 font-medium">
                                    <ChevronsUp className="w-4 h-4 text-gray-500" />
                                    Arrange
                                  </span>
                                  <span className="text-gray-400 text-[10px]">›</span>
                                </button>

                                <button
                                  onClick={() => setActiveSubMenu("align")}
                                  className="w-full px-3 py-2 rounded-xl hover:bg-gray-100 flex items-center justify-between transition-colors text-left cursor-pointer"
                                >
                                  <span className="flex items-center gap-2 font-medium">
                                    <AlignCenter className="w-4 h-4 text-gray-500" />
                                    Align to page
                                  </span>
                                  <span className="text-gray-400 text-[10px]">›</span>
                                </button>

                                <button
                                  onClick={() => setActiveSubMenu("flip")}
                                  className="w-full px-3 py-2 rounded-xl hover:bg-gray-100 flex items-center justify-between transition-colors text-left cursor-pointer"
                                >
                                  <span className="flex items-center gap-2 font-medium">
                                    <FlipHorizontal className="w-4 h-4 text-gray-500" />
                                    Flip
                                  </span>
                                  <span className="text-gray-400 text-[10px]">›</span>
                                </button>

                                <div className="h-px bg-gray-100 my-1" />

                                <button
                                  onClick={handleToggleLock}
                                  className="w-full px-3 py-2 rounded-xl hover:bg-gray-100 flex items-center gap-2 transition-colors text-left cursor-pointer"
                                >
                                  {el.isLocked ? <Unlock className="w-4 h-4 text-amber-600" /> : <Lock className="w-4 h-4 text-gray-500" />}
                                  <span>{el.isLocked ? "Unlock" : "Lock"}</span>
                                </button>
                              </>
                            )}

                            {/* ── 2. SUBMENU: ARRANGE (Layer Stacking) ── */}
                            {activeSubMenu === "arrange" && (
                              <div className="space-y-0.5">
                                <button
                                  onClick={() => setActiveSubMenu(null)}
                                  className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-1.5 font-bold text-[11px] text-gray-600 mb-1 cursor-pointer border border-gray-200/80"
                                >
                                  <span>←</span>
                                  <span>Back</span>
                                </button>
                                <button
                                  onClick={handleBringForward}
                                  className="w-full px-3 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-2 text-left cursor-pointer"
                                >
                                  <ChevronUp className="w-4 h-4 text-gray-500" />
                                  <span>Bring forward</span>
                                </button>
                                <button
                                  onClick={handleBringToFront}
                                  className="w-full px-3 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-2 text-left cursor-pointer"
                                >
                                  <ChevronsUp className="w-4 h-4 text-gray-500" />
                                  <span>Bring to front</span>
                                </button>
                                <button
                                  onClick={handleSendBackward}
                                  className="w-full px-3 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-2 text-left cursor-pointer"
                                >
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                  <span>Send backward</span>
                                </button>
                                <button
                                  onClick={handleSendToBack}
                                  className="w-full px-3 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-2 text-left cursor-pointer"
                                >
                                  <ChevronsDown className="w-4 h-4 text-gray-500" />
                                  <span>Send to back</span>
                                </button>
                              </div>
                            )}

                            {/* ── 3. SUBMENU: ALIGN TO PAGE ── */}
                            {activeSubMenu === "align" && (
                              <div className="space-y-0.5">
                                <button
                                  onClick={() => setActiveSubMenu(null)}
                                  className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-1.5 font-bold text-[11px] text-gray-600 mb-1 cursor-pointer border border-gray-200/80"
                                >
                                  <span>←</span>
                                  <span>Back</span>
                                </button>
                                <div className="grid grid-cols-2 gap-1 pt-1">
                                  <button
                                    onClick={() => handleAlign("top")}
                                    className="px-2.5 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-1.5 text-[11px] cursor-pointer"
                                  >
                                    Top
                                  </button>
                                  <button
                                    onClick={() => handleAlign("middle")}
                                    className="px-2.5 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-1.5 text-[11px] cursor-pointer"
                                  >
                                    Middle
                                  </button>
                                  <button
                                    onClick={() => handleAlign("bottom")}
                                    className="px-2.5 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-1.5 text-[11px] cursor-pointer"
                                  >
                                    Bottom
                                  </button>
                                  <button
                                    onClick={() => handleAlign("left")}
                                    className="px-2.5 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-1.5 text-[11px] cursor-pointer"
                                  >
                                    Left
                                  </button>
                                  <button
                                    onClick={() => handleAlign("center")}
                                    className="px-2.5 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-1.5 text-[11px] cursor-pointer font-bold text-[#B58328]"
                                  >
                                    Center
                                  </button>
                                  <button
                                    onClick={() => handleAlign("right")}
                                    className="px-2.5 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-1.5 text-[11px] cursor-pointer"
                                  >
                                    Right
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* ── 4. SUBMENU: FLIP ── */}
                            {activeSubMenu === "flip" && (
                              <div className="space-y-0.5">
                                <button
                                  onClick={() => setActiveSubMenu(null)}
                                  className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center gap-1.5 font-bold text-[11px] text-gray-600 mb-1 cursor-pointer border border-gray-200/80"
                                >
                                  <span>←</span>
                                  <span>Back</span>
                                </button>
                                <button
                                  onClick={() => handleFlip("horizontal")}
                                  className="w-full px-3 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-2 text-left cursor-pointer"
                                >
                                  <FlipHorizontal className="w-4 h-4 text-gray-500" />
                                  <span>Flip horizontal</span>
                                </button>
                                <button
                                  onClick={() => handleFlip("vertical")}
                                  className="w-full px-3 py-1.5 rounded-xl hover:bg-gray-100 flex items-center gap-2 text-left cursor-pointer"
                                >
                                  <FlipVertical className="w-4 h-4 text-gray-500" />
                                  <span>Flip vertical</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Layer with Transforms */}
                    <div
                      style={{
                        transform: `rotate(${el.rotation || 0}deg) scaleX(${el.flipH ? -1 : 1}) scaleY(${el.flipV ? -1 : 1})`,
                        transformOrigin: "center center",
                        width: "100%",
                        height: "100%",
                        pointerEvents: "auto",
                      }}
                      className="flex items-center justify-center"
                    >
                      {el.type === "text" && (
                        editingTextId === el.id ? (
                          <textarea
                            autoFocus
                            value={el.text || ""}
                            onChange={(e) => updateActiveElement({ text: e.target.value })}
                            onBlur={() => setEditingTextId(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                setEditingTextId(null);
                              }
                            }}
                            rows={Math.max(1, (el.text || "").split("\n").length)}
                            style={{
                              fontFamily: el.fontFamily,
                              fontSize: `${el.fontSize}px`,
                              color: el.color,
                              fontWeight: el.fontWeight,
                              fontStyle: el.fontStyle,
                              textAlign: el.textAlign,
                              letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
                              lineHeight: el.lineHeight || 1.2,
                              width: "100%",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              background: "rgba(255, 255, 255, 0.92)",
                              borderRadius: "8px",
                              padding: "2px 4px",
                            }}
                            className="outline-none border-2 border-[#991B1B] resize-none shadow-md z-50 text-slate-900"
                          />
                        ) : (
                          <div
                            onDoubleClick={() => !el.isLocked && setEditingTextId(el.id)}
                            style={{
                              fontFamily: el.fontFamily,
                              fontSize: `${el.fontSize}px`,
                              color: el.color,
                              fontWeight: el.fontWeight,
                              fontStyle: el.fontStyle,
                              textAlign: el.textAlign,
                              letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
                              lineHeight: el.lineHeight || 1.2,
                              width: "100%",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              cursor: el.isLocked ? "default" : "text",
                            }}
                            className="outline-none"
                            title="Double-click to edit text directly & press Enter for next line"
                          >
                            {el.text}
                          </div>
                        )
                      )}

                      {el.type === "image" && el.src && (
                        <img
                          src={el.src}
                          alt="Canvas graphic element"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                          className="pointer-events-none select-none"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          </div>

          {/* Bottom Floating Canvas Bar: Zoom & Grid (Stationary on scroll) */}
          <div className="absolute bottom-18 lg:bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-xl flex items-center gap-2 sm:gap-3 text-xs z-30 pointer-events-auto select-none">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel(Math.max(40, zoomLevel - 10))}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold w-9 sm:w-10 text-center text-[11px] sm:text-xs">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-4 w-px bg-gray-300" />

            {/* Fit to Screen Button */}
            <button
              onClick={handleFitToScreen}
              className="px-2 sm:px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 text-[#991B1B] hover:bg-red-100 text-[10px] sm:text-[11px] transition-colors cursor-pointer font-extrabold flex items-center gap-1"
              title="Auto-Fit Card to Screen without Scrolling"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fit</span>
            </button>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] sm:text-[11px] transition-colors cursor-pointer font-bold ${
                showGrid ? "bg-[#991B1B] text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Grid
            </button>
            <span className="font-mono text-[10px] sm:text-[11px] text-slate-500">{canvasDim.ratio}</span>
          </div>

        </div>

        {/* ── RIGHT COLUMN 1: MINIMAL FLOATING CARD THUMBNAILS STACK (RIGHT SIDEBAR EXACTLY AS IN ADMIN) ── */}
        <div className="hidden lg:flex w-28 sm:w-32 h-full flex-col items-center shrink-0 py-6 px-1 z-10 select-none overflow-y-auto custom-scrollbar bg-slate-50 border-l border-slate-200">
          <div className="flex flex-col items-center gap-4 w-full">
            {pages.map((layer, idx) => {
              const isSelected = idx === activePageIndex;
              const lDim = getLayerDimensions(layer, basePage);

              // Compact thumbnail calculation (max bounded box: 56px W, 80px H)
              const maxThumbW = 56;
              const maxThumbH = 80;
              const scale = Math.min(maxThumbW / lDim.width, maxThumbH / lDim.height);
              const thumbW = Math.max(36, Math.round(lDim.width * scale));
              const thumbH = Math.max(36, Math.round(lDim.height * scale));

              return (
                <div
                  key={layer.id}
                  onClick={() => {
                    setActivePageIndex(idx);
                    setSelectedId(null);
                  }}
                  className="flex flex-col items-center gap-1 w-full cursor-pointer group relative"
                >
                  {/* Proportional Card Frame with Active Selection Handles */}
                  <div className="relative p-1.5 flex items-center justify-center">
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
                      className={`rounded-md overflow-visible transition-all relative select-none ${
                        isSelected
                          ? "opacity-100 ring-2 ring-blue-500 border-2 border-blue-500 shadow-sm bg-white scale-102"
                          : "opacity-30 hover:opacity-75 border border-slate-300 bg-white"
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
                            opacity: 0.8,
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
                                fontSize: "4.5px",
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

                      {/* 8-Point Blue Selection Handles for Selected Thumbnail */}
                      {isSelected && (
                        <>
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-xs border border-white shadow-2xs z-30" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-xs border border-white shadow-2xs z-30" />
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-xs border border-white shadow-2xs z-30" />
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-xs border border-white shadow-2xs z-30" />
                          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-xs border border-white shadow-2xs z-30" />
                          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-xs border border-white shadow-2xs z-30" />
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-xs border border-white shadow-2xs z-30" />
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-xs border border-white shadow-2xs z-30" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sheet Name & Ratio */}
                  <span
                    className={`text-[9.5px] text-center truncate max-w-[84px] transition-colors leading-tight ${
                      isSelected ? "font-bold text-slate-900" : "font-medium text-slate-500 group-hover:text-slate-700"
                    }`}
                  >
                    {layer.title || layer.name || `Sheet ${idx + 1}`}
                  </span>
                  <span className="text-[8px] font-mono text-slate-400">
                    {lDim.ratioStr} {layer.isBase ? "(Base)" : `${layer.heightPercent || 85}%`}
                  </span>
                </div>
              );
            })}

            {/* Plus Button to Add Card Insert Sheet */}
            <button
              type="button"
              onClick={() => {
                const nextIdx = pages.length + 1;
                const newId = `layer-${Date.now()}`;
                const defaultPct = nextIdx === 2 ? 85 : nextIdx === 3 ? 72 : 60;
                const baseDim = getLayerDimensions(basePage, basePage);
                const newLayer: CanvasPage = {
                  id: newId,
                  title: `Insert Sheet ${nextIdx}`,
                  name: `Insert Sheet ${nextIdx}`,
                  isBase: false,
                  heightPercent: defaultPct,
                  aspectRatio: currentPage.aspectRatio || "classic",
                  customWidth: Math.round(baseDim.width * (defaultPct / 100)),
                  customHeight: Math.round(baseDim.height * (defaultPct / 100)),
                  lockRatio: true,
                  backgroundColor: "#FFFFFF",
                  backgroundImage: null,
                  bgMode: "textures",
                  elements: [],
                };
                setPages([...pages, newLayer]);
                setActivePageIndex(pages.length);
                setSelectedId(null);
              }}
              className="w-8 h-8 rounded-full border border-slate-300 hover:border-[#991B1B] hover:bg-red-50 text-slate-500 hover:text-[#991B1B] flex items-center justify-center transition-all cursor-pointer shadow-2xs mt-1"
              title="Add new card insert sheet"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── DESKTOP RIGHT COLUMN 2: SMART PERSONALIZATION & FORMAT TABS ── */}
        <div
          data-lenis-prevent
          className="hidden lg:flex w-84 xl:w-90 bg-white border-l border-slate-200 flex-col h-full shrink-0 z-20 custom-scrollbar overflow-hidden"
        >
          {/* Top Tab Switcher */}
          <div className="p-3 border-b border-slate-200 bg-slate-50/80 shrink-0">
            <div className="flex p-1 bg-slate-200/80 rounded-xl border border-slate-200 gap-1">
              <button
                type="button"
                onClick={() => setRightPanelTab("personalize")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  rightPanelTab === "personalize"
                    ? "bg-white text-[#991B1B] shadow-xs border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Personalize</span>
              </button>

              <button
                type="button"
                onClick={() => setRightPanelTab("format")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                  rightPanelTab === "format"
                    ? "bg-white text-[#991B1B] shadow-xs border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Format</span>
                {activeElement && (
                  <span className="w-2 h-2 rounded-full bg-[#991B1B]" />
                )}
              </button>
            </div>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 custom-scrollbar">
            {rightPanelTab === "personalize" ? (
              renderPersonalizationContent()
            ) : (
              renderFormatContent()
            )}
          </div>
        </div>

      </div>

      {/* ── 🌟 MOBILE BOTTOM NAVIGATION BAR (Canva Mobile Style) 🌟 ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 text-slate-700 flex items-center justify-around py-1.5 px-1 shadow-2xl backdrop-blur-md">
        <button
          onClick={() => {
            setMobileTab("templates");
            setActiveTab("templates");
            setMobileSheetOpen(true);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            mobileSheetOpen && mobileTab === "templates" ? "text-[#991B1B] font-bold scale-105" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold">Templates</span>
        </button>

        <button
          onClick={() => {
            setMobileTab("text");
            setActiveTab("text");
            setMobileSheetOpen(true);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            mobileSheetOpen && mobileTab === "text" ? "text-[#991B1B] font-bold scale-105" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Type className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold">Text</span>
        </button>

        <button
          onClick={() => {
            setMobileTab("elements");
            setActiveTab("elements");
            setMobileSheetOpen(true);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            mobileSheetOpen && mobileTab === "elements" ? "text-[#991B1B] font-bold scale-105" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold">Elements</span>
        </button>

        <button
          onClick={() => {
            setMobileTab("layers");
            setActiveTab("layers");
            setMobileSheetOpen(true);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            mobileSheetOpen && mobileTab === "layers" ? "text-[#991B1B] font-bold scale-105" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold">Layers</span>
        </button>

        <button
          onClick={() => {
            setMobileTab("personalize");
            setMobileSheetOpen(true);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            mobileSheetOpen && mobileTab === "personalize" ? "text-[#991B1B] font-bold scale-105" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold">Form</span>
        </button>

        {/* 🌟 DIRECT ACTION TAB ON MOBILE BOTTOM BAR 🌟 */}
        {adminOrderContext ? (
          <button
            onClick={handleSaveAdminOrder}
            disabled={savingAdminOrder}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold shadow-md border border-red-200 transition-all cursor-pointer"
          >
            {savingAdminOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="text-[9px] mt-0.5 font-extrabold text-white">Save</span>
          </button>
        ) : (
          <button
            onClick={handleOpenOrderModal}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold shadow-md border border-red-200 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4 text-amber-300" />
            <span className="text-[9px] mt-0.5 font-extrabold text-white">Order</span>
          </button>
        )}
      </nav>

      {/* ── 🌟 MOBILE SLIDE-UP BOTTOM SHEET MODAL 🌟 ── */}
      {mobileSheetOpen && mobileTab && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMobileSheetOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Bottom Sheet Container */}
          <div className="relative bg-white rounded-t-3xl shadow-2xl z-10 max-h-[82vh] flex flex-col border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            {/* Sheet Handle & Header */}
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50 rounded-t-3xl">
              <div className="flex items-center gap-2">
                {mobileTab === "templates" && <Layers className="w-4 h-4 text-[#991B1B]" />}
                {mobileTab === "text" && <Type className="w-4 h-4 text-[#991B1B]" />}
                {mobileTab === "elements" && <Sparkles className="w-4 h-4 text-[#991B1B]" />}
                {mobileTab === "layers" && <FileText className="w-4 h-4 text-[#991B1B]" />}
                {mobileTab === "personalize" && <Sliders className="w-4 h-4 text-[#991B1B]" />}
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  {mobileTab === "templates" && "Templates Gallery"}
                  {mobileTab === "text" && "Typography & Text Presets"}
                  {mobileTab === "elements" && "Graphic Motifs & Elements"}
                  {mobileTab === "layers" && "Canvas Layers"}
                  {mobileTab === "personalize" && "Personalize Invitation Form"}
                </h3>
              </div>

              <button
                onClick={() => setMobileSheetOpen(false)}
                className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Personalize / Format Subtabs when in Personalize tab */}
            {mobileTab === "personalize" && (
              <div className="px-4 pt-2">
                <div className="flex p-1 bg-slate-200/80 rounded-xl border border-slate-200 gap-1">
                  <button
                    type="button"
                    onClick={() => setRightPanelTab("personalize")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      rightPanelTab === "personalize"
                        ? "bg-white text-[#991B1B] shadow-xs border border-slate-200 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Personalize</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRightPanelTab("format")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                      rightPanelTab === "format"
                        ? "bg-white text-[#991B1B] shadow-xs border border-slate-200 font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Format</span>
                    {activeElement && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B]" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Sheet Scrollable Content */}
            <div
              data-lenis-prevent
              className="p-4 overflow-y-auto overscroll-contain flex-1 custom-scrollbar space-y-4 pb-10"
            >
              {mobileTab === "personalize"
                ? rightPanelTab === "personalize"
                  ? renderPersonalizationContent()
                  : renderFormatContent()
                : renderLeftToolsDrawerContent(mobileTab)}
            </div>
          </div>
        </div>
      )}

      {/* ── 🌟 SAVE TOAST NOTIFICATION 🌟 ── */}
      {showSaveToast && (
        <div className="fixed top-20 right-6 z-[100] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4" />
          <span>✨ Design saved successfully to your account!</span>
        </div>
      )}

      {/* ── 🌟 UNSAVED CHANGES WARNING MODAL 🌟 ── */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 relative shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowUnsavedModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-[#991B1B] flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-slate-900">Unsaved Changes Detected</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have customized your invitation card! Would you like to save your work before leaving to prevent losing your changes?
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => handleSave(pendingNavigation)}
                className="w-full py-3.5 rounded-xl bg-[#991B1B] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#7F1D1D] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>✨ Save &amp; Continue</span>
              </button>

              <button
                onClick={() => {
                  setHasUnsavedChanges(false);
                  setShowUnsavedModal(false);
                  if (pendingNavigation) {
                    router.push(pendingNavigation);
                  }
                }}
                className="w-full py-3 rounded-xl bg-slate-100 text-rose-600 font-extrabold text-xs uppercase tracking-wider hover:bg-rose-50 transition-all cursor-pointer border border-slate-200"
              >
                Discard &amp; Leave
              </button>

              <button
                onClick={() => setShowUnsavedModal(false)}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PREVIEW MODAL ── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full flex flex-col items-center gap-6 relative shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 p-2 rounded-full bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-slate-900 text-center">Invitation Final Preview</h3>

            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center">
              <div
                style={{
                  width: "360px",
                  height: "500px",
                  backgroundColor:
                    currentPage.backgroundColor &&
                    (currentPage.backgroundColor.startsWith("#") || currentPage.backgroundColor.startsWith("rgb"))
                      ? currentPage.backgroundColor
                      : undefined,
                  backgroundImage: currentPage.backgroundImage
                    ? `url(${currentPage.backgroundImage})`
                    : currentPage.backgroundColor && currentPage.backgroundColor.includes("gradient")
                    ? currentPage.backgroundColor
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-red-200"
              >
                {elements.map((el) => (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      transform: `rotate(${el.rotation}deg)`,
                      opacity: el.opacity,
                    }}
                  >
                    {el.type === "text" && (
                      <div
                        style={{
                          fontFamily: el.fontFamily || "'Cormorant Garamond', serif",
                          fontSize: `${(el.fontSize || 20) * 0.8}px`,
                          color: el.color || "#4A3B2A",
                          fontWeight: el.fontWeight || "600",
                          textAlign: el.textAlign || "center",
                          letterSpacing: `${el.letterSpacing || 1}px`,
                        }}
                      >
                        {el.text}
                      </div>
                    )}
                    {el.type === "image" && el.src && (
                      <img src={el.src} alt="Graphic" className="w-full h-full object-contain" />
                    )}
                    {el.type === "sticker" && (
                      <div style={{ fontSize: "28px", color: el.color || "#8C6B1B" }} className="text-center">
                        {el.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled
                className="px-6 py-3 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed opacity-60"
                title="Download is disabled"
              >
                Download PNG (Disabled)
              </button>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
              >
                Back to Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 🌟 FULLSCREEN MULTI-DECK LAYER STACK VISUALIZER MODAL 🌟 ── */}
      {showStackModal && (
        <div className="fixed inset-0 z-[105] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
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
                    const baseLayer = pages.find((p) => p.isBase) || pages[0];
                    const baseDim = getLayerDimensions(baseLayer, baseLayer);
                    const maxHeightPx = 280;
                    const scaleFactor = maxHeightPx / baseDim.height;

                    const sortedForStack = [...pages]
                      .map((p, origIdx) => ({ page: p, origIdx }))
                      .sort((a, b) => {
                        const aPct = a.page.isBase !== false ? 100 : a.page.heightPercent || 85;
                        const bPct = b.page.isBase !== false ? 100 : b.page.heightPercent || 85;
                        return bPct - aPct;
                      });

                    return sortedForStack.map((item, stackPos) => {
                      const { page: p, origIdx } = item;
                      const isSelected = origIdx === activePageIndex;
                      const pDim = getPhysicalDimensions(p, baseLayer);
                      const renderW = Math.round(pDim.pixelW * scaleFactor);
                      const renderH = Math.round(pDim.pixelH * scaleFactor);

                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setActivePageIndex(origIdx);
                            setSelectedId(null);
                          }}
                          style={{
                            width: `${renderW}px`,
                            height: `${renderH}px`,
                            zIndex: stackPos + 10,
                            backgroundColor: p.backgroundColor || "#FFFFFF",
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
                              {p.title || p.name || `Sheet ${origIdx + 1}`}
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
                  const baseLayer = pages.find((p) => p.isBase) || pages[0];
                  return pages.map((p, idx) => {
                    const isSelected = idx === activePageIndex;
                    const pDim = getPhysicalDimensions(p, baseLayer);

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActivePageIndex(idx);
                          setSelectedId(null);
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
                                {p.title || p.name || `Sheet ${idx + 1}`}
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

      {/* ── DOWNLOAD MODAL ── */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 relative shadow-2xl text-center border border-slate-200">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 p-2 rounded-full bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-[#991B1B] flex items-center justify-center mx-auto">
              <Download className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-serif font-bold text-slate-900">Download Your Invitation</h3>

            <div className="space-y-3">
              <button
                onClick={() => handleExport("png")}
                className="w-full py-3.5 rounded-xl bg-[#991B1B] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#7F1D1D] transition-all cursor-pointer shadow-md"
              >
                <ImageIcon className="w-4 h-4" />
                <span>High-Resolution PNG (Digital)</span>
              </button>

              <button
                onClick={() => handleExport("pdf")}
                className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-800 transition-all cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Print-Ready PDF (Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SHARE MODAL ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-6 relative shadow-2xl text-center border border-slate-200">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 p-2 rounded-full bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif font-bold text-slate-900">Share Invitation</h3>

            <div className="space-y-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
                className="w-full py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:border-[#991B1B]"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <CopyCheck className="w-4 h-4 text-[#991B1B]" />}
                <span>{copiedLink ? "Link Copied to Clipboard!" : "Copy Shareable Link"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ORDER PRINTS & CART MODAL ── */}
      <OrderOrCartModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        templateId={String(activeTemplateId)}
        templateName={allTemplates.find((t) => t.id === activeTemplateId || (t as any).dbId === activeTemplateId || (t as any).slug === activeTemplateId || t.name === docTitle)?.name || docTitle}
        basePrice={allTemplates.find((t) => t.id === activeTemplateId || (t as any).dbId === activeTemplateId || (t as any).slug === activeTemplateId || t.name === docTitle)?.pricePerCard}
        previewImage={orderPreviewUrl || allTemplates.find((t) => t.id === activeTemplateId || (t as any).dbId === activeTemplateId || (t as any).slug === activeTemplateId || t.name === docTitle)?.previewImage || "/images/canva/template1-thumb.webp"}
        cardDetails={{
          coupleNames: personalization.coupleNames || "",
          groom: personalization.modernGroom || personalization.modern3GroomFirst || "",
          bride: personalization.modernBride || personalization.modern3BrideFirst || "",
          date: personalization.date || personalization.modernDate || personalization.modern3DateDay || "",
          time: personalization.time || personalization.modern3DateTime || "",
          venue: personalization.venue || personalization.modernMarriageVenue || personalization.modern3VenueTitle || "",
          city: personalization.address || personalization.modern3VenueAddr2 || "",
          tagline: personalization.modernTagline || "",
          aspectRatio,
          backgroundColor: pages[activePageIndex]?.backgroundColor || allTemplates.find((t) => t.id === activeTemplateId)?.backgroundColor,
          backgroundImage: pages[activePageIndex]?.backgroundImage || allTemplates.find((t) => t.id === activeTemplateId)?.backgroundImage,
          pages: pages.map((pg, idx) => {
            const baseLayer = pages.find((p) => p.isBase) || pages[0];
            const pDim = getPhysicalDimensions(pg, baseLayer);
            return {
              ...pg,
              index: idx + 1,
              sheetName: pg.title || pg.name || `Sheet ${idx + 1}`,
              widthInches: pDim.widthInches,
              heightInches: pDim.heightInches,
              widthMm: pDim.widthMm,
              heightMm: pDim.heightMm,
              pixelW: pDim.pixelW,
              pixelH: pDim.pixelH,
              heightPercent: pDim.pct,
              physicalDimensions: pDim,
            };
          }),
          layerCount: pages.length,
          baseDimensions: getPhysicalDimensions(basePage, basePage),
        }}
        elements={elements}
        onCartSuccess={() => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("cartUpdated"));
          }
        }}
      />

      {/* ── TOAST NOTIFICATION ── */}
      {toastNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs sm:text-sm font-bold pointer-events-auto ${
              toastNotification.type === "success"
                ? "bg-slate-900 text-white border-emerald-500/50 shadow-emerald-950/30"
                : "bg-red-950 text-white border-red-500/50 shadow-red-950/30"
            }`}
          >
            {toastNotification.type === "success" ? (
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              </span>
            ) : (
              <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-red-400 stroke-[3]" />
              </span>
            )}
            <span>{toastNotification.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}
