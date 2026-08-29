import { useQuery } from "@tanstack/react-query";
import { api, getBaseUrl } from "../lib/api";

export interface ColorVariant {
  id: string;
  name: string;
  swatchHex: string;
  bgImage: string;
  primaryTextColor: string;
  accentTextColor: string;
  badgeBgColor: string;
}

export interface CanvaElement {
  id: string;
  type: "text" | "image" | "shape" | "monogram" | "sticker";
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
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width?: number; // percentage (0-100)
  height?: number; // percentage (0-100)
  rotation?: number;
  scale?: number;
  zIndex?: number;
  imageUrl?: string;
  src?: string;
  opacity?: number;
  backgroundColor?: string;
  isLocked?: boolean;
}

export interface CanvaTemplate {
  id: string;
  dbId?: string;
  name: string;
  topic?: string;
  category?: string;
  pricePerCard?: number;
  minCopies?: number;
  paperType?: string;
  previewImage?: string;
  aspectRatio?: string;
  backgroundColor: string;
  backgroundImage?: string;
  elements: CanvaElement[];
  colorVariants?: ColorVariant[];
}

export const MODERN_FLORAL_COLOR_VARIANTS: ColorVariant[] = [
  {
    id: "purple",
    name: "Amethyst Purple",
    swatchHex: "#8B5CF6",
    bgImage: "https://res.cloudinary.com/dqiwclph/image/upload/v1787498608/bervic-shop/products/tby6u0pfaknatimimfni.jpg",
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

export const OFFICIAL_PRESET_TEMPLATES: CanvaTemplate[] = [
  // 1. Exact "Purple flower print" / "Modern Watercolor Floral"
  {
    id: "modern-watercolor-floral",
    name: "Modern Watercolor Floral & Rings",
    topic: "modern",
    category: "Modern Floral",
    previewImage: "https://res.cloudinary.com/dqiwclph/image/upload/v1787498608/bervic-shop/products/tby6u0pfaknatimimfni.jpg",
    aspectRatio: "classic",
    backgroundColor: "#FAF9FC",
    backgroundImage: "https://res.cloudinary.com/dqiwclph/image/upload/v1787498608/bervic-shop/products/tby6u0pfaknatimimfni.jpg",
    colorVariants: MODERN_FLORAL_COLOR_VARIANTS,
    elements: [
      {
        id: "cross-icon-m1",
        type: "text",
        text: "✝",
        fontFamily: "sans-serif",
        fontSize: 22,
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
        fontFamily: "sans-serif",
        fontSize: 10,
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
        fontFamily: "serif",
        fontSize: 28,
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
        fieldKey: "groomName",
        text: "Kirubin",
        fontFamily: "serif",
        fontSize: 32,
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
        type: "text",
        text: "💍",
        fontSize: 18,
        textAlign: "center",
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
        fieldKey: "brideName",
        text: "Asha",
        fontFamily: "serif",
        fontSize: 32,
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
        fontFamily: "serif",
        fontSize: 24,
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
        fontFamily: "serif",
        fontSize: 12,
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
        text: "Welcomes you all to the Wedding",
        fontFamily: "serif",
        fontSize: 16,
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
        fontFamily: "serif",
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
        fontFamily: "serif",
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
        fontFamily: "serif",
        fontSize: 12,
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
        fontFamily: "serif",
        fontSize: 8.5,
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
        fontFamily: "serif",
        fontSize: 12,
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
        fontFamily: "serif",
        fontSize: 8.5,
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
  // 2. Vintage Botanical Romance
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
        id: "tagline-1",
        type: "text",
        fieldKey: "tagline",
        text: "TOGETHER WITH THEIR FAMILIES",
        fontFamily: "serif",
        fontSize: 11,
        color: "#5C4E3A",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 20,
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
        fontFamily: "serif",
        fontSize: 36,
        color: "#4A3B2A",
        fontWeight: "400",
        textAlign: "center",
        letterSpacing: 1,
        x: 5,
        y: 35,
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
        text: "Request the pleasure of your company at their wedding celebration",
        fontFamily: "serif",
        fontSize: 12,
        color: "#5C4E3A",
        fontWeight: "500",
        textAlign: "center",
        x: 10,
        y: 52,
        width: 80,
        height: 8,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "wedding-date-1",
        type: "text",
        fieldKey: "date",
        text: "OCTOBER 30, 2026",
        fontFamily: "serif",
        fontSize: 16,
        color: "#8C6B1B",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 2,
        x: 10,
        y: 62,
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
        text: "ELAMBA MUDAKKAL PALACE\nMG Road, Trivandrum",
        fontFamily: "serif",
        fontSize: 11,
        color: "#5C4E3A",
        fontWeight: "700",
        textAlign: "center",
        x: 10,
        y: 72,
        width: 80,
        height: 8,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: "rsvp-line-1",
        type: "text",
        fieldKey: "rsvp",
        text: "R.S.V.P: +91 98765 43210",
        fontFamily: "serif",
        fontSize: 13,
        color: "#8C6B1B",
        textAlign: "center",
        x: 10,
        y: 82,
        width: 80,
        height: 4,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
    ],
  },
];

export function useCanvaTemplates() {
  return useQuery<CanvaTemplate[]>({
    queryKey: ["canva-templates"],
    queryFn: async () => {
      try {
        const res = await api.get<any>("/api/canva/templates");
        if (res?.templates && Array.isArray(res.templates) && res.templates.length > 0) {
          // Flatten any multiDeck layer structures for mobile touch studio
          const apiTemplates: CanvaTemplate[] = res.templates.map((t: any) => {
            let elList: CanvaElement[] = [];
            if (t.elements && Array.isArray(t.elements)) {
              elList = t.elements;
            } else if (t.elements && t.elements.layers && Array.isArray(t.elements.layers)) {
              const baseLayer = t.elements.layers.find((l: any) => l.isBase) || t.elements.layers[0];
              elList = baseLayer?.elements || [];
            }

            return {
              id: t.id,
              dbId: t.dbId,
              name: t.name,
              topic: t.topic,
              category: t.category,
              pricePerCard: t.pricePerCard,
              minCopies: t.minCopies,
              paperType: t.paperType,
              previewImage: t.previewImage,
              aspectRatio: t.aspectRatio,
              backgroundColor: t.backgroundColor || "#FAF9FC",
              backgroundImage: t.backgroundImage,
              elements: elList,
              colorVariants: t.colorVariants,
            };
          });

          // Merge: official presets first, then custom API templates
          const merged = [...OFFICIAL_PRESET_TEMPLATES];
          for (const apiTpl of apiTemplates) {
            const existingIdx = merged.findIndex((m) => m.id === apiTpl.id || m.dbId === apiTpl.id);
            if (existingIdx >= 0) {
              merged[existingIdx] = { ...merged[existingIdx], ...apiTpl };
            } else {
              merged.push(apiTpl);
            }
          }
          return merged;
        }
      } catch {
        // Return official presets if offline
      }
      return OFFICIAL_PRESET_TEMPLATES;
    },
  });
}

