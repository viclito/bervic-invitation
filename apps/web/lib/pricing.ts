/**
 * Bervic Tiered Volume Pricing Utility for Card Prints & Shop Catalog
 * 
 * Rules:
 * - 1000+ prints: Same base price (+0%, multiplier = 1.0)
 * - 500 to 999 prints: 80% more (+80%, multiplier = 1.80)
 * - 300 to 499 prints: 180% more (+180%, multiplier = 2.80)
 * - 150 to 299 prints: 250% more (+250%, multiplier = 3.50)
 * - 80 to 149 prints: 300% more (+300%, multiplier = 4.00)
 * - Below 80 (50 to 79 prints): 450% more (+450%, multiplier = 5.50)
 * - Minimum copies: 50
 * - Round any decimals to nearest integer (whole number)
 */

export interface PricingTierInfo {
  min: number;
  max: number | null;
  label: string;
  markupPercent: number;
  multiplier: number;
}

export const CARD_PRICING_TIERS: PricingTierInfo[] = [
  { min: 1000, max: null, label: "1000+ Prints (Base Bulk Rate)", markupPercent: 0, multiplier: 1.0 },
  { min: 500, max: 999, label: "500 - 999 Prints (+80%)", markupPercent: 80, multiplier: 1.80 },
  { min: 300, max: 499, label: "300 - 499 Prints (+180%)", markupPercent: 180, multiplier: 2.80 },
  { min: 150, max: 299, label: "150 - 299 Prints (+250%)", markupPercent: 250, multiplier: 3.50 },
  { min: 80, max: 149, label: "80 - 149 Prints (+300%)", markupPercent: 300, multiplier: 4.00 },
  { min: 50, max: 79, label: "50 - 79 Prints (+450%)", markupPercent: 450, multiplier: 5.50 },
];

export function getCardPricingTier(copies: number): PricingTierInfo {
  const qty = Math.max(50, Number(copies) || 50);
  if (qty >= 1000) return CARD_PRICING_TIERS[0];
  if (qty >= 500) return CARD_PRICING_TIERS[1];
  if (qty >= 300) return CARD_PRICING_TIERS[2];
  if (qty >= 150) return CARD_PRICING_TIERS[3];
  if (qty >= 80) return CARD_PRICING_TIERS[4];
  return CARD_PRICING_TIERS[5];
}

export interface TieredPriceResult {
  basePricePerCard: number;
  unitPrice: number;
  totalPrice: number;
  copies: number;
  markupPercent: number;
  multiplier: number;
  tierLabel: string;
}

export function calculateTieredCardPrice(
  basePricePerCard: number,
  copies: number,
  isGiftOrFixedItem: boolean = false
): TieredPriceResult {
  const base = Math.max(0, Number(basePricePerCard) || 0);
  const qty = Math.max(50, Number(copies) || 50);

  // Return gifts or non-card fixed piece products do not scale on invitation tiers
  if (isGiftOrFixedItem) {
    const roundedBase = Math.round(base);
    return {
      basePricePerCard: roundedBase,
      unitPrice: roundedBase,
      totalPrice: Math.round(roundedBase * (Number(copies) || 1)),
      copies: Number(copies) || 1,
      markupPercent: 0,
      multiplier: 1.0,
      tierLabel: "Standard Piece Price",
    };
  }

  const tier = getCardPricingTier(qty);
  // Unit price rounded to whole integer
  const unitPrice = Math.round(base * tier.multiplier);
  const totalPrice = Math.round(unitPrice * qty);

  return {
    basePricePerCard: Math.round(base),
    unitPrice,
    totalPrice,
    copies: qty,
    markupPercent: tier.markupPercent,
    multiplier: tier.multiplier,
    tierLabel: tier.label,
  };
}
