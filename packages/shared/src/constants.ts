export const APP_NAME = "Bervic Invitation Suite";

export const BRAND_COLORS = {
  primaryRed: "#DC2626",
  deepCrimson: "#991B1B",
  rubyDark: "#7F1D1D",
  roseTint: "#FEF2F2",
  roseSubtle: "#FEE2E2",
  pureWhite: "#FFFFFF",
  canvasLight: "#F8FAFC",
  textPrimary: "#0F172A",
  textMuted: "#64748B",
} as const;

export const PRICING_TIERS = [
  {
    id: "BASIC_599",
    name: "Classic Elegance",
    price: 599,
    features: [
      "1 Digital Wedding Website",
      "Up to 100 RSVP Guests",
      "Interactive Countdown & Maps",
      "WhatsApp 1-Click Invitation Dispatch",
    ],
  },
  {
    id: "PRO_1799",
    name: "Royal Heritage",
    price: 1799,
    popular: true,
    features: [
      "All 15+ Luxury Interactive Themes",
      "Unlimited Guest RSVPs & Dietary Notes",
      "Venue Entrance QR Door Scanner",
      "Canva 2D Custom Studio Access",
      "Background Audio & Video Teasers",
    ],
  },
  {
    id: "CINEMATIC_2000",
    name: "Imperial Cinematic",
    price: 2000,
    features: [
      "Everything in Royal Heritage",
      "Custom Domain Support",
      "Priority VIP Print Proof Service",
      "Dedicated Event Concierge",
    ],
  },
] as const;

export const PAPER_STOCKS = [
  { id: "metallic_gold", name: "350 GSM Textured Metallic Gold Cardstock" },
  { id: "velvet_matte", name: "400 GSM Soft Touch Velvet Matte" },
  { id: "deckle_cotton", name: "300 GSM Handcrafted Deckle Edge Cotton" },
  { id: "pearl_shimmer", name: "320 GSM Pearlized Shimmer Cardstock" },
] as const;
