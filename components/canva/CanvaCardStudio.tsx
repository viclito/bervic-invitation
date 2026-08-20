"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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

export interface CanvasPage {
  id: string;
  title: string;
  backgroundColor: string;
  backgroundImage?: string;
  elements: CanvasElement[];
}

export interface PresetTemplate {
  id: string;
  name: string;
  topic: "vintage" | "modern";
  category: string;
  previewImage?: string;
  aspectRatio: "portrait" | "square" | "classic";
  backgroundColor: string;
  backgroundImage?: string;
  elements: CanvasElement[];
}

let elementIdCounter = 0;
const createUniqueId = (prefix: string) => `${prefix}-${Date.now()}-${++elementIdCounter}`;

export interface PersonalizationData {
  coupleNames: string;
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
  // Modern Template 3 Motifs (Silver Botanical Foliage in Two Parts)
  { id: "modern3-foliage-top", name: "Silver Botanical Top Foliage", templateId: "modern-silver-botanical-foliage", category: "Silver Botanical", icon: "🌿", src: "/images/canva/modern3-foliage-top.webp" },
  { id: "modern3-foliage-bottom", name: "Silver Botanical Bottom Foliage", templateId: "modern-silver-botanical-foliage", category: "Silver Botanical", icon: "🍃", src: "/images/canva/modern3-foliage-bottom.webp" },

  // Template 4 Motifs (Antique Parchment & Victorian Swirl)
  { id: "victorian-arch-top-t4", name: "Victorian Swirl Arch Top", templateId: "antique-parchment-victorian", category: "Victorian Swirl", icon: "⚜️", src: "/images/canva/victorian-header-swirl.webp" },
  { id: "victorian-arch-bottom-t4", name: "Victorian Swirl Arch Bottom", templateId: "antique-parchment-victorian", category: "Victorian Swirl", icon: "⚜️", src: "/images/canva/victorian-footer-swirl.webp" },
  { id: "victorian-divider-t4", name: "Victorian Center Divider", templateId: "antique-parchment-victorian", category: "Victorian Swirl", icon: "✦", src: "/images/canva/victorian-center-divider.webp" },
  { id: "victorian-date-badge-t4", name: "Victorian Date Banner", templateId: "antique-parchment-victorian", category: "Victorian Swirl", icon: "📅", src: "/images/canva/victorian-date-badge.webp" },

  // Template 2 Motifs (Royal Parchment & Filigree)
  { id: "swirl-header-t2", name: "Swirl Header Flourish", templateId: "royal-parchment-filigree", category: "Royal Filigree", icon: "📜", src: "/images/canva/vintage-swirl-header.webp" },
  { id: "wave-divider-t2", name: "Filigree Wave Divider", templateId: "royal-parchment-filigree", category: "Royal Filigree", icon: "〰️", src: "/images/canva/vintage-wave-divider.webp" },
  { id: "swirl-footer-t2", name: "Swirl Footer Flourish", templateId: "royal-parchment-filigree", category: "Royal Filigree", icon: "📜", src: "/images/canva/vintage-swirl-footer.webp" },

  // Template 1 Motifs (Vintage Botanical Romance)
  { id: "leaf-divider-t1", name: "Vintage Leaf Ornament", templateId: "vintage-botanical-romance", category: "Botanical Floral", icon: "🌿", src: "/images/canva/leaf-divider.webp" },
  { id: "floral-header-t1", name: "Floral Top Header", templateId: "vintage-botanical-romance", category: "Botanical Floral", icon: "🌸", src: "/images/canva/floral-header.webp" },
  { id: "floral-footer-t1", name: "Floral Bottom Footer", templateId: "vintage-botanical-romance", category: "Botanical Floral", icon: "🌺", src: "/images/canva/floral-footer.webp" },

  // Universal Royal Seals & Frames
  { id: "gold-arch", name: "Gold Arch Frame", templateId: "all", category: "Seals & Frames", icon: "🏛️" },
  { id: "golden-rings", name: "Golden Rings", templateId: "all", category: "Seals & Frames", icon: "💍" },
  { id: "wax-seal", name: "Royal Wax Seal", templateId: "all", category: "Seals & Frames", icon: "🏵️" },
];

const INITIAL_PAGES: CanvasPage[] = [
  {
    id: "page-1",
    title: "01 Cover",
    backgroundColor: PRESET_TEMPLATES[0].backgroundColor,
    backgroundImage: PRESET_TEMPLATES[0].backgroundImage,
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
  const { status } = useSession();
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  // Document & Page State
  const [docTitle, setDocTitle] = useState<string>(
    () => getInitialDraft()?.docTitle || "Vintage Botanical Wedding Invitation"
  );
  const [aspectRatio] = useState<"portrait" | "square" | "classic">("classic");
  const [pages, setPages] = useState<CanvasPage[]>(() => getInitialDraft()?.pages || INITIAL_PAGES);
  const [activePageIndex] = useState<number>(0);

  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    () => getInitialDraft()?.activeTemplateId || "vintage-botanical-romance"
  );
  const currentPage = pages[activePageIndex] || pages[0];
  const elements = currentPage.elements;

  // Selected Element & Dragging State
  const [selectedId, setSelectedId] = useState<string | null>("leaf-divider-middle");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);

  // Studio Tools Drawer Tab
  const [activeTab, setActiveTab] = useState<
    "templates" | "elements" | "text" | "uploads" | "layers"
  >("templates");
  const [templateTopic, setTemplateTopic] = useState<"vintage" | "modern">(() => {
    const draft = getInitialDraft();
    if (draft?.activeTemplateId?.startsWith("modern-")) return "modern";
    return "vintage";
  });
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
  const [zoomLevel, setZoomLevel] = useState<number>(80);
  const [showGrid, setShowGrid] = useState<boolean>(false);

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

  // Full 4-Directional Mouse Drag-to-Move Handler
  const handleMouseDown = (e: React.MouseEvent, el: CanvasElement) => {
    if (el.isLocked) {
      setSelectedId(el.id);
      return;
    }
    e.stopPropagation();
    setSelectedId(el.id);
    setDraggingId(el.id);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: el.x,
      startY: el.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !dragStart || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const deltaXPercent = ((e.clientX - dragStart.mouseX) / rect.width) * 100;
    const deltaYPercent = ((e.clientY - dragStart.mouseY) / rect.height) * 100;

    const newX = Math.max(0, Math.min(95, Math.round(dragStart.startX + deltaXPercent)));
    const newY = Math.max(0, Math.min(95, Math.round(dragStart.startY + deltaYPercent)));

    setPages((prevPages) =>
      prevPages.map((pg, idx) =>
        idx === activePageIndex
          ? {
              ...pg,
              elements: pg.elements.map((el) =>
                el.id === draggingId ? { ...el, x: newX, y: newY } : el
              ),
            }
          : pg
      )
    );
  };

  const handleMouseUp = () => {
    if (draggingId) {
      setDraggingId(null);
      setDragStart(null);
      pushState(pages);
      setHasUnsavedChanges(true);
    }
  };

  const handlePersonalizationChange = (field: keyof typeof personalization, value: string) => {
    setPersonalization((prev) => ({ ...prev, [field]: value }));

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
        if (field === "modernGroom" && (el.id.startsWith("groom-name") || el.fieldKey === "coupleNames")) {
          return { ...el, text: value };
        }
        if (field === "modernBride" && el.id.startsWith("bride-name")) {
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

        // Vintage / Global Field Bindings
        if (el.fieldKey === field) {
          return { ...el, text: field === "rsvp" && !value.startsWith("R.S.V.P") ? `R.S.V.P ${value}` : value };
        }
        if (field === "coupleNames" && (el.id.includes("couple") || el.fieldKey === "coupleNames")) {
          return { ...el, text: value };
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
    setTemplateTopic(tpl.topic);
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

    if (tpl.id === "modern-silver-botanical-foliage") {
      const hostText = tpl.elements.find((e) => e.id === "host-names-m3")?.text || "Host(s)";
      const gFirst = tpl.elements.find((e) => e.id === "groom-first-m3")?.text || "First Name";
      const gLast = tpl.elements.find((e) => e.id === "groom-last-m3")?.text || "last name";
      const bFirst = tpl.elements.find((e) => e.id === "bride-first-m3")?.text || "First Name";
      const bLast = tpl.elements.find((e) => e.id === "bride-last-m3")?.text || "last name";
      const dDay = tpl.elements.find((e) => e.id === "date-day-m3")?.text || "Day and Month";
      const dYear = tpl.elements.find((e) => e.id === "date-year-m3")?.text || "Year";
      const dTime = tpl.elements.find((e) => e.id === "date-time-m3")?.text || "4:00 PM";
      const vTitle = tpl.elements.find((e) => e.id === "venue-title-m3")?.text || "Venue";
      const vAddr1 = tpl.elements.find((e) => e.id === "venue-line1-m3")?.text || "Address Line 1";
      const vAddr2 = tpl.elements.find((e) => e.id === "venue-line2-m3")?.text || "Address Line 2";

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
      const taglineText = tpl.elements.find((e) => e.id.startsWith("praise-lord") || e.fieldKey === "tagline")?.text || "Praise the lord";
      const groomText = tpl.elements.find((e) => e.id.startsWith("groom-name") || e.fieldKey === "coupleNames")?.text || "Kirubin";
      const brideText = tpl.elements.find((e) => e.id.startsWith("bride-name"))?.text || "Asha";
      const dateText = tpl.elements.find((e) => e.id.startsWith("date-line") || e.fieldKey === "date")?.text || "3  Jan 2024,  Saturday  @10am";
      const welcomeText = tpl.elements.find((e) => e.id.startsWith("welcome-sentence"))?.text || "Welcomes you all";
      const contactText = tpl.elements.find((e) => e.id.startsWith("contact-info") || e.fieldKey === "address")?.text || "Place: Karumankoodal\nPhone: 8489520394";
      const familyText = tpl.elements.find((e) => e.id.startsWith("family-info"))?.text || "With love\nM. Tharmar\nS. Rajam";
      const marriageText = tpl.elements.find((e) => e.id.startsWith("marriage-details") || e.fieldKey === "venue")?.text || "Marthal Zion C.S.I Church\nMarthal\nTime: 10:30 am";
      const receptionText = tpl.elements.find((e) => e.id.startsWith("reception-details"))?.text || "Holy loosiyal Auditorium\nLocation: Pudur to maindaikadu road\nTime: 6pm";

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

    const populatedElements = tpl.id === "modern-silver-botanical-foliage"
      ? tpl.elements.map((el) => {
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
      ? tpl.elements.map((el) => {
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
      : tpl.elements.map((el) => {
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

    const updatedPages = pages.map((pg, idx) =>
      idx === activePageIndex
        ? {
            ...pg,
            backgroundColor: tpl.backgroundColor,
            backgroundImage: tpl.backgroundImage,
            elements: populatedElements,
          }
        : pg
    );
    setPages(updatedPages);
    setSelectedId(populatedElements.find((e) => e.type === "text")?.id || populatedElements[0]?.id || null);
    pushState(updatedPages);
    setHasUnsavedChanges(true);

    try {
      localStorage.setItem(
        "canva_draft_design",
        JSON.stringify({
          docTitle: tpl.name,
          aspectRatio,
          pages: updatedPages,
          personalization: updatedPersonalization,
          activeTemplateId: tpl.id,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.error("Failed to persist template selection:", e);
    }
  };

  // Check URL parameters on mount e.g. /canva?template=modern-watercolor-floral
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const templateParam = params.get("template");
    if (templateParam) {
      const found = PRESET_TEMPLATES.find((t) => t.id === templateParam);
      if (found) {
        handleLoadTemplate(found);
      }
    }
  }, []);

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

  const handleAddGraphic = (graphic: { name: string; icon: string; src?: string }) => {
    const newEl: CanvasElement = graphic.src
      ? {
          id: createUniqueId("image"),
          type: "image",
          src: graphic.src,
          x: 20,
          y: 35,
          width: 60,
          height: 15,
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
          x: 40,
          y: 10,
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
      const matched = PRESET_TEMPLATES.find((t) => t.id === activeTemplateId);
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
            {/* TOPIC SUB-TABS (VINTAGE / MODERN) */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1">
              <button
                onClick={() => setTemplateTopic("vintage")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  templateTopic === "vintage"
                    ? "bg-white text-[#991B1B] shadow-xs border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>📜 Vintage</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    templateTopic === "vintage"
                      ? "bg-red-50 text-[#991B1B]"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {PRESET_TEMPLATES.filter((t) => t.topic === "vintage").length}
                </span>
              </button>

              <button
                onClick={() => setTemplateTopic("modern")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  templateTopic === "modern"
                    ? "bg-white text-[#991B1B] shadow-xs border border-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>✨ Modern</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    templateTopic === "modern"
                      ? "bg-red-50 text-[#991B1B]"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {PRESET_TEMPLATES.filter((t) => t.topic === "modern").length}
                </span>
              </button>
            </div>

            {/* TEMPLATES GRID FOR SELECTED TOPIC */}
            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_TEMPLATES.filter((t) => t.topic === templateTopic).map((tpl) => {
                const isActive = tpl.id === activeTemplateId;
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
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center p-1.5 text-center text-[10px] font-serif font-bold text-slate-700"
                          style={{ backgroundColor: tpl.backgroundColor }}
                        >
                          {tpl.name}
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

        {/* TAB: TEXT */}
        {tabToRender === "text" && (
          <div className="space-y-3.5">
            <h3 className="text-xs font-extrabold text-[#991B1B] uppercase tracking-wider">Typography Library</h3>

            <button
              onClick={() => {
                handleAddText("Add a Luxury Heading", "heading");
                setMobileSheetOpen(false);
              }}
              className="w-full p-3.5 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-serif font-bold text-sm hover:scale-[1.02] transition-transform shadow-md cursor-pointer text-center"
            >
              + Add Luxury Heading
            </button>

            <button
              onClick={() => {
                handleAddText("Sophia & Alexander", "heading");
                setMobileSheetOpen(false);
              }}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[#1E293B] font-serif italic text-xs hover:border-[#991B1B] hover:bg-red-50/50 transition-all cursor-pointer text-center"
            >
              + Add Couple Names
            </button>

            <button
              onClick={() => {
                handleAddText("OCTOBER 30, 2026", "date");
                setMobileSheetOpen(false);
              }}
              className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-[#991B1B] font-mono text-[11px] uppercase tracking-widest hover:border-[#991B1B] hover:bg-red-50/50 transition-all cursor-pointer text-center"
            >
              + Add Wedding Date
            </button>

            <button
              onClick={() => {
                handleAddText(personalization.venue, "body");
                setMobileSheetOpen(false);
              }}
              className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs hover:border-[#991B1B] hover:bg-red-50/50 transition-all cursor-pointer text-center"
            >
              + Add Venue Name
            </button>

            <button
              onClick={() => {
                handleAddText(personalization.address, "body");
                setMobileSheetOpen(false);
              }}
              className="w-full p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs hover:border-[#991B1B] hover:bg-red-50/50 transition-all cursor-pointer font-semibold text-center"
            >
              + Add Full Address Details
            </button>
          </div>
        )}

        {/* TAB: ELEMENTS */}
        {tabToRender === "elements" && (
          <div className="space-y-3.5">
            {(() => {
              const availableElements = GRAPHIC_ELEMENTS.filter(
                (e) => e.templateId === activeTemplateId || e.templateId === "all"
              );
              const activeTplObj = PRESET_TEMPLATES.find((t) => t.id === activeTemplateId);

              return (
                <>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-extrabold text-[#991B1B] uppercase tracking-wider truncate max-w-[170px]">
                      {activeTplObj?.name || "Active Model"} Motifs
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-500">
                      {availableElements.length} Items
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {availableElements.map((elem) => (
                      <button
                        key={elem.id}
                        onClick={() => {
                          handleAddGraphic(elem);
                          setMobileSheetOpen(false);
                        }}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1.5 hover:border-[#991B1B] hover:bg-red-50/50 transition-all group cursor-pointer shadow-xs"
                      >
                        {elem.src ? (
                          <img src={elem.src} alt={elem.name} className="h-8 object-contain my-0.5" />
                        ) : (
                          <span className="text-2xl">{elem.icon}</span>
                        )}
                        <span className="text-[9px] font-bold text-slate-700 group-hover:text-[#991B1B] text-center leading-tight">
                          {elem.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* TAB: LAYERS */}
        {tabToRender === "layers" && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#991B1B] uppercase tracking-wider">Canvas Layers</h3>
            <div className="space-y-2">
              {elements.map((el, i) => (
                <div
                  key={el.id}
                  onClick={() => {
                    setSelectedId(el.id);
                    setMobileSheetOpen(false);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-bold cursor-pointer transition-colors ${
                    el.id === selectedId ? "bg-red-50 border-[#991B1B] text-[#991B1B]" : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="truncate">{el.text || (el.type === "image" ? "Graphic Image" : `Layer #${i + 1}`)}</span>
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
              ))}
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
            <div>
              <label className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block mb-1">
                Couple Names
              </label>
              <input
                type="text"
                value={personalization.coupleNames}
                onChange={(e) => handlePersonalizationChange("coupleNames", e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-serif font-bold text-[#1E293B] outline-none focus:border-[#D9A441] focus:bg-white"
              />
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

  const getCanvasDimensions = () => {
    if (aspectRatio === "square") return { width: "480px", height: "480px", ratio: "1:1" };
    if (aspectRatio === "portrait") return { width: "400px", height: "660px", ratio: "9:16" };
    return { width: "440px", height: "620px", ratio: "5:7" };
  };

  const canvasDim = getCanvasDimensions();

  return (
    <div
      data-lenis-prevent
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="h-screen max-h-screen w-full bg-slate-50 text-[#1E293B] flex flex-col font-sans overflow-hidden select-none"
    >
      
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

          {/* 🌟 DOWNLOAD / EXPORT BUTTON 🌟 */}
          <button
            onClick={() => setShowDownloadModal(true)}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#991B1B] text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-[#7F1D1D] transition-all shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
            title="Download Card (JPG, PNG, PDF)"
          >
            <Download className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">Export</span>
          </button>

          {/* 🌟 ORDER PRINTS (PRIMARY ACTION) 🌟 */}
          <button
            onClick={handleOpenOrderModal}
            className="px-2.5 xs:px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1 sm:gap-1.5 shrink-0 cursor-pointer hover:scale-105"
            title="Order Physical Cards & Prints or Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden xs:inline">Order Prints</span>
            <span className="xs:hidden">Order</span>
          </button>

        </div>
      </header>

      {/* ── 2. TOP CONTEXTUAL BAR ── */}
      {activeElement && (
        <div data-lenis-prevent className="h-12 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center gap-2.5 sm:gap-4 text-xs shrink-0 overflow-x-auto z-40 shadow-xs whitespace-nowrap no-scrollbar scroll-smooth">
          {/* Text Font Family & Color */}
          {activeElement.type === "text" && (
            <>
              <select
                value={activeElement.fontFamily}
                onChange={(e) => updateActiveElement({ fontFamily: e.target.value })}
                className="bg-slate-50 text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer focus:border-[#991B1B]"
              >
                {FONTS.map((f) => (
                  <option key={f.name} value={f.family}>
                    {f.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Color:</span>
                <input
                  type="color"
                  value={activeElement.color || "#1E293B"}
                  onChange={(e) => updateActiveElement({ color: e.target.value })}
                  className="w-6 h-6 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                />
              </div>
            </>
          )}

          {/* Universal SIZE Controls (Shrink, Value, Expand) */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 shrink-0">
            <span className="text-[10px] text-slate-500 uppercase font-extrabold">Size:</span>
            <button
              onClick={() => {
                if (activeElement.type === "text") {
                  updateActiveElement({ fontSize: Math.max(8, (activeElement.fontSize || 20) - 2) });
                } else {
                  updateActiveElement({ width: Math.max(5, activeElement.width - 5) });
                }
              }}
              className="p-1 rounded-lg bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 transition-colors cursor-pointer"
              title="Shrink Size"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>

            {activeElement.type === "text" ? (
              <input
                type="number"
                value={activeElement.fontSize || 20}
                onChange={(e) => updateActiveElement({ fontSize: Number(e.target.value) })}
                className="w-11 bg-white text-slate-800 border border-slate-200 rounded-lg py-0.5 text-xs font-bold text-center outline-none focus:border-[#991B1B]"
              />
            ) : (
              <span className="font-mono text-xs font-bold w-10 text-center">{activeElement.width}%</span>
            )}

            <button
              onClick={() => {
                if (activeElement.type === "text") {
                  updateActiveElement({ fontSize: Math.min(200, (activeElement.fontSize || 20) + 2) });
                } else {
                  updateActiveElement({ width: Math.min(100, activeElement.width + 5) });
                }
              }}
              className="p-1 rounded-lg bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 transition-colors cursor-pointer"
              title="Expand Size"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1-Click Align Center Button */}
          <button
            onClick={() => updateActiveElement({ x: Math.round((100 - activeElement.width) / 2) })}
            className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-[#991B1B] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
            title="Align Horizontally to Canvas Center"
          >
            <AlignCenter className="w-3.5 h-3.5 text-[#991B1B]" />
            <span>Center</span>
          </button>

          {/* Hide / Unhide Eye Button */}
          <button
            onClick={() => updateActiveElement({ isHidden: !activeElement.isHidden })}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeElement.isHidden
                ? "bg-rose-100 text-rose-800 border-rose-300 shadow-xs"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-[#991B1B] hover:text-white"
            }`}
            title={activeElement.isHidden ? "Unhide Element" : "Hide Element"}
          >
            {activeElement.isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-600" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{activeElement.isHidden ? "Hidden" : "Hide"}</span>
          </button>

          {/* Nudge Position Controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase px-1">Move:</span>
            <button
              onClick={() => handleNudge("left")}
              className="p-1 rounded bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 font-bold transition-colors cursor-pointer"
              title="Move Left (ArrowLeft)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleNudge("up")}
              className="p-1 rounded bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 font-bold transition-colors cursor-pointer"
              title="Move Up (ArrowUp)"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleNudge("down")}
              className="p-1 rounded bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 font-bold transition-colors cursor-pointer"
              title="Move Down (ArrowDown)"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleNudge("right")}
              className="p-1 rounded bg-white hover:bg-[#991B1B] hover:text-white border border-slate-200 text-slate-800 font-bold transition-colors cursor-pointer"
              title="Move Right (ArrowRight)"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setNudgeStep((prev) => (prev === 1 ? 5 : prev === 5 ? 0.5 : 1))}
              className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors ml-0.5 cursor-pointer"
              title="Toggle Nudge Step Size"
            >
              {nudgeStep}%
            </button>
          </div>

          {/* Duplicate & Delete Buttons */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              onClick={handleDuplicate}
              className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 hover:bg-[#991B1B] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate</span>
            </button>

            <button
              onClick={handleDelete}
              className="px-2.5 py-1 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-[#991B1B] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 3. MAIN THREE-COLUMN STUDIO BODY (Responsive Flex) ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative pb-16 lg:pb-0">
        
        {/* ── DESKTOP LEFT COLUMN 1: Clean White & Red Vertical Icon Toolbar ── */}
        <div className="hidden lg:flex w-20 bg-white border-r border-slate-200 flex-col items-center py-4 gap-3 shrink-0 z-20">
          <button
            onClick={() => setActiveTab("templates")}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === "templates"
                ? "bg-[#991B1B] text-white shadow-md font-bold"
                : "text-slate-600 hover:text-[#991B1B] hover:bg-red-50"
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Templates</span>
          </button>

          <button
            onClick={() => setActiveTab("text")}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === "text"
                ? "bg-[#991B1B] text-white shadow-md font-bold"
                : "text-slate-600 hover:text-[#991B1B] hover:bg-red-50"
            }`}
          >
            <Type className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Text</span>
          </button>

          <button
            onClick={() => setActiveTab("elements")}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === "elements"
                ? "bg-[#991B1B] text-white shadow-md font-bold"
                : "text-slate-600 hover:text-[#991B1B] hover:bg-red-50"
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Elements</span>
          </button>

          <button
            onClick={() => setActiveTab("layers")}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === "layers"
                ? "bg-[#991B1B] text-white shadow-md font-bold"
                : "text-slate-600 hover:text-[#991B1B] hover:bg-red-50"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Layers</span>
          </button>
        </div>

        {/* ── DESKTOP LEFT COLUMN 2: Light Secondary Tool Panels Drawer ── */}
        <div
          data-lenis-prevent
          className="hidden lg:flex w-72 bg-white border-r border-slate-200 p-3.5 flex-col gap-4 overflow-y-auto overscroll-contain h-full shrink-0 z-10 custom-scrollbar"
        >
          {renderLeftToolsDrawerContent(activeTab)}
        </div>

        {/* ── CENTER COLUMN: CANVAS WORKSPACE (Responsive Full-Width on Mobile) ── */}
        <div
          ref={workspaceRef}
          onWheel={handleWheelZoom}
          onClick={() => setSelectedId(null)}
          className="flex-1 w-full bg-[#EAEAEA] flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-y-auto overflow-x-auto h-full cursor-default"
        >
          
          {/* Main Canvas Card */}
          <div className="my-auto flex flex-col items-center py-4 sm:py-6">
            <div
              ref={canvasRef}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(null);
                setShowMoreMenu(false);
                setActiveSubMenu(null);
              }}
              style={{
                width: canvasDim.width,
                height: canvasDim.height,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "center center",
              }}
              className="relative shadow-2xl rounded-3xl transition-transform duration-100 flex-shrink-0"
            >
              {/* INNER ARTWORK CONTAINER */}
              <div
                style={{
                  backgroundColor: currentPage.backgroundColor,
                  backgroundImage: currentPage.backgroundImage ? `url(${currentPage.backgroundImage})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
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
                    onMouseDown={(e) => handleMouseDown(e, el)}
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
                    }}
                    className={`relative select-none transition-shadow ${
                      isSelected ? (el.isHidden ? "ring-2 ring-rose-400 border-2 border-dashed border-rose-400" : "ring-2 ring-[#991B1B] ring-offset-0") : ""
                    }`}
                  >
                    {/* Anchor handles on selection */}
                    {isSelected && (
                      <>
                        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#991B1B] rounded-full shadow-sm z-30 pointer-events-none" />
                        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#991B1B] rounded-full shadow-sm z-30 pointer-events-none" />
                      </>
                    )}

                    {/* 🌟 CANVA-STYLE FLOATING CAPSULE TOOLBAR 🌟 */}
                    {isSelected && (
                      <div
                        onMouseDown={(e) => e.stopPropagation()}
                        onMouseUp={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          left: "50%",
                          transform: "translateX(-50%)",
                          ...(isNearTop ? { top: "100%", marginTop: "10px" } : { bottom: "100%", marginBottom: "10px" }),
                        }}
                        className="bg-white text-gray-800 border border-gray-200/90 rounded-2xl px-2 py-1.5 shadow-2xl flex items-center gap-1.5 z-[999] text-xs shrink-0 whitespace-nowrap pointer-events-auto select-none"
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
                        <div
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
                          }}
                          className="outline-none"
                        >
                          {el.text}
                        </div>
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

          {/* Bottom Floating Canvas Bar: Zoom & Grid (Responsive placement) */}
          <div className="absolute bottom-18 lg:bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-xl flex items-center gap-2 sm:gap-3 text-xs z-30 pointer-events-auto">
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

        {/* ── DESKTOP RIGHT COLUMN: LIGHT SMART PERSONALIZATION PANEL ── */}
        <div
          data-lenis-prevent
          className="hidden lg:flex w-80 bg-white border-l border-slate-200 p-5 flex-col justify-between gap-5 overflow-y-auto overscroll-contain h-full shrink-0 z-20 custom-scrollbar"
        >
          {renderPersonalizationContent()}
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

        {/* 🌟 DIRECT ORDER PRINTS TAB ON MOBILE BOTTOM BAR 🌟 */}
        <button
          onClick={handleOpenOrderModal}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold shadow-md border border-red-200 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <ShoppingCart className="w-4 h-4 text-amber-300" />
          <span className="text-[9px] mt-0.5 font-extrabold text-white">Order</span>
        </button>
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

            {/* Sheet Scrollable Content */}
            <div
              data-lenis-prevent
              className="p-4 overflow-y-auto overscroll-contain flex-1 custom-scrollbar space-y-4 pb-10"
            >
              {mobileTab === "personalize" ? renderPersonalizationContent() : renderLeftToolsDrawerContent(mobileTab)}
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
                  backgroundColor: currentPage.backgroundColor,
                  backgroundImage: currentPage.backgroundImage ? `url(${currentPage.backgroundImage})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
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
                onClick={() => handleExport("png")}
                className="px-6 py-3 rounded-xl bg-[#991B1B] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#7F1D1D] cursor-pointer shadow-md"
              >
                Download PNG
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
        templateName={PRESET_TEMPLATES.find((t) => t.id === activeTemplateId)?.name || docTitle}
        previewImage={orderPreviewUrl || PRESET_TEMPLATES.find((t) => t.id === activeTemplateId)?.previewImage || "/images/canva/template1-thumb.webp"}
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
          backgroundColor: pages[activePageIndex]?.backgroundColor || PRESET_TEMPLATES.find((t) => t.id === activeTemplateId)?.backgroundColor,
          backgroundImage: pages[activePageIndex]?.backgroundImage || PRESET_TEMPLATES.find((t) => t.id === activeTemplateId)?.backgroundImage,
        }}
        elements={elements}
        onCartSuccess={() => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("cartUpdated"));
          }
        }}
      />

    </div>
  );
}
