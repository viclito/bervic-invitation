/**
 * Bervic Tiered Volume Pricing Utility for Card Prints & Shop Catalog
 * 
 * Modes Supported:
 * 1. PERCENTAGE: Base rate for 1000+ prints + configurable % markups per quantity bracket.
 * 2. MANUAL: Exact unit price (₹) specified directly for each quantity bracket.
 * 3. FLAT: Fixed unit price (₹) regardless of quantity (for return gifts or standard items).
 * 
 * Default Rules (when no custom config is provided):
 * - 1000+ prints: Same base price (+0%, multiplier = 1.0)
 * - 500 to 999 prints: 80% more (+80%, multiplier = 1.80)
 * - 300 to 499 prints: 180% more (+180%, multiplier = 2.80)
 * - 150 to 299 prints: 250% more (+250%, multiplier = 3.50)
 * - 80 to 149 prints: 300% more (+300%, multiplier = 4.00)
 * - Below 80 (50 to 79 prints): 450% more (+450%, multiplier = 5.50)
 * - Minimum copies: 50
 * - Round all unit and total prices to whole numbers.
 */

export interface PricingTierInfo {
  min: number;
  max: number | null;
  label: string;
  markupPercent: number;
  multiplier: number;
  price?: number;
}

export interface CustomPricingTier {
  min: number;
  max: number | null;
  label?: string;
  markupPercent?: number;
  price?: number;
}

export interface PrintingChangeConfig {
  enabled: boolean;
  chargeUpto500: number; // e.g. 250 (₹ for up to 500 copies)
  chargeFor1000: number; // e.g. 500 (₹ for up to 1000 copies)
  chargePerNext1000: number; // e.g. 250 (₹ consistent increment for each next 1000 copies)
  
  // Legacy / fallback support
  baseCharge?: number;
  baseCopies?: number;
  extraBatchCopies?: number;
  extraBatchCharge?: number;
}

export const DEFAULT_PRINTING_CHANGE_CONFIG: PrintingChangeConfig = {
  enabled: true,
  chargeUpto500: 500,
  chargeFor1000: 750,
  chargePerNext1000: 750,
  baseCharge: 500,
  baseCopies: 500,
  extraBatchCopies: 1000,
  extraBatchCharge: 750,
};

export interface CustomPricingConfig {
  mode: "PERCENTAGE" | "MANUAL" | "FLAT";
  basePrice?: number;
  tiers?: CustomPricingTier[];
  printingChangeConfig?: PrintingChangeConfig;
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
  isGiftOrFixedItem: boolean = false,
  pricingConfigInput?: string | CustomPricingConfig | null
): TieredPriceResult {
  const base = Math.max(0, Number(basePricePerCard) || 0);
  const qty = Math.max(1, Number(copies) || 1);

  // Parse config if string
  let config: CustomPricingConfig | null = null;
  if (typeof pricingConfigInput === "string" && pricingConfigInput.trim()) {
    try {
      config = JSON.parse(pricingConfigInput);
    } catch {
      config = null;
    }
  } else if (pricingConfigInput && typeof pricingConfigInput === "object") {
    config = pricingConfigInput;
  }

  // 1. Flat Fixed Pricing Mode (for gifts or fixed price items)
  if (isGiftOrFixedItem || config?.mode === "FLAT") {
    const unitPrice = Math.round(base);
    return {
      basePricePerCard: unitPrice,
      unitPrice,
      totalPrice: Math.round(unitPrice * qty),
      copies: qty,
      markupPercent: 0,
      multiplier: 1.0,
      tierLabel: "Standard Flat Rate",
    };
  }

  // 2. Manual Exact Tier Pricing Mode
  if (config?.mode === "MANUAL" && Array.isArray(config.tiers) && config.tiers.length > 0) {
    const sortedTiers = [...config.tiers].sort((a, b) => (b.min || 0) - (a.min || 0));
    const matchedTier = sortedTiers.find((t) => {
      if (t.max === null || t.max === undefined) return qty >= t.min;
      return qty >= t.min && qty <= t.max;
    }) || sortedTiers[sortedTiers.length - 1];

    const manualPrice = Math.round(Number(matchedTier.price ?? base));
    const effectiveUnitPrice = Math.max(1, manualPrice);
    const markupPct = base > 0 ? Math.round(((effectiveUnitPrice - base) / base) * 100) : 0;
    const mult = base > 0 ? effectiveUnitPrice / base : 1.0;

    return {
      basePricePerCard: Math.round(base),
      unitPrice: effectiveUnitPrice,
      totalPrice: Math.round(effectiveUnitPrice * qty),
      copies: qty,
      markupPercent: markupPct,
      multiplier: Number(mult.toFixed(2)),
      tierLabel: matchedTier.label || (matchedTier.max ? `${matchedTier.min} - ${matchedTier.max} Prints` : `${matchedTier.min}+ Prints`),
    };
  }

  // 3. Custom Percentage Markup Mode
  if (config?.mode === "PERCENTAGE" && Array.isArray(config.tiers) && config.tiers.length > 0) {
    const sortedTiers = [...config.tiers].sort((a, b) => (b.min || 0) - (a.min || 0));
    const matchedTier = sortedTiers.find((t) => {
      if (t.max === null || t.max === undefined) return qty >= t.min;
      return qty >= t.min && qty <= t.max;
    }) || sortedTiers[sortedTiers.length - 1];

    const markupPct = Number(matchedTier.markupPercent ?? 0);
    const mult = 1 + markupPct / 100;
    const unitPrice = Math.round(base * mult);

    return {
      basePricePerCard: Math.round(base),
      unitPrice,
      totalPrice: Math.round(unitPrice * qty),
      copies: qty,
      markupPercent: markupPct,
      multiplier: Number(mult.toFixed(2)),
      tierLabel: matchedTier.label || (matchedTier.max ? `${matchedTier.min} - ${matchedTier.max} Prints (+${markupPct}%)` : `${matchedTier.min}+ Prints (Base Rate)`),
    };
  }

  // 4. Default Standard Percentage Tier Rules
  const standardTier = getCardPricingTier(qty);
  const unitPrice = Math.round(base * standardTier.multiplier);
  const totalPrice = Math.round(unitPrice * qty);

  return {
    basePricePerCard: Math.round(base),
    unitPrice,
    totalPrice,
    copies: qty,
    markupPercent: standardTier.markupPercent,
    multiplier: standardTier.multiplier,
    tierLabel: standardTier.label,
  };
}

export function extractPrintingChangeConfig(
  pricingConfigInput?: string | CustomPricingConfig | null
): PrintingChangeConfig {
  if (!pricingConfigInput) return DEFAULT_PRINTING_CHANGE_CONFIG;
  if (typeof pricingConfigInput === "string") {
    try {
      const parsed = JSON.parse(pricingConfigInput);
      if (parsed?.printingChangeConfig) {
        const pcc = parsed.printingChangeConfig;
        return {
          ...DEFAULT_PRINTING_CHANGE_CONFIG,
          ...pcc,
          chargeUpto500: Number(pcc.chargeUpto500 ?? pcc.baseCharge ?? 250),
          chargeFor1000: Number(pcc.chargeFor1000 ?? 500),
          chargePerNext1000: Number(pcc.chargePerNext1000 ?? pcc.extraBatchCharge ?? 250),
        };
      }
    } catch {
      return DEFAULT_PRINTING_CHANGE_CONFIG;
    }
  } else if (typeof pricingConfigInput === "object" && pricingConfigInput?.printingChangeConfig) {
    const pcc = pricingConfigInput.printingChangeConfig;
    return {
      ...DEFAULT_PRINTING_CHANGE_CONFIG,
      ...pcc,
      chargeUpto500: Number(pcc.chargeUpto500 ?? pcc.baseCharge ?? 250),
      chargeFor1000: Number(pcc.chargeFor1000 ?? 500),
      chargePerNext1000: Number(pcc.chargePerNext1000 ?? pcc.extraBatchCharge ?? 250),
    };
  }
  return DEFAULT_PRINTING_CHANGE_CONFIG;
}

export interface PrintingChangeFeeResult {
  fee: number;
  chargeUpto500: number;
  chargeFor1000: number;
  chargePerNext1000: number;
  copies: number;
  extraBatches: number;
  breakdownText: string;
}

export function calculatePrintingChangeFee(
  changeCopies: number,
  configInput?: PrintingChangeConfig | string | CustomPricingConfig | null
): PrintingChangeFeeResult {
  let resolvedConfig: PrintingChangeConfig = DEFAULT_PRINTING_CHANGE_CONFIG;

  if (configInput) {
    if (typeof configInput === "string" || (typeof configInput === "object" && ("mode" in (configInput as any) || "printingChangeConfig" in (configInput as any)))) {
      resolvedConfig = extractPrintingChangeConfig(configInput as any);
    } else if (typeof configInput === "object") {
      const cfg = configInput as any;
      resolvedConfig = {
        ...DEFAULT_PRINTING_CHANGE_CONFIG,
        ...cfg,
        chargeUpto500: Number(cfg.chargeUpto500 ?? cfg.baseCharge ?? 250),
        chargeFor1000: Number(cfg.chargeFor1000 ?? 500),
        chargePerNext1000: Number(cfg.chargePerNext1000 ?? cfg.extraBatchCharge ?? 250),
      };
    }
  }

  const copies = Math.max(0, Number(changeCopies) || 0);

  const chargeUpto500 = Math.max(0, Number(resolvedConfig.chargeUpto500) || 0);
  const chargeFor1000 = Math.max(0, Number(resolvedConfig.chargeFor1000) || 0);
  const chargePerNext1000 = Math.max(0, Number(resolvedConfig.chargePerNext1000) || 0);

  if (!resolvedConfig.enabled || copies <= 0) {
    return {
      fee: 0,
      chargeUpto500,
      chargeFor1000,
      chargePerNext1000,
      copies: 0,
      extraBatches: 0,
      breakdownText: "No printing change selected",
    };
  }

  // 1. Up to 500 copies (flat tier)
  if (copies <= 500) {
    return {
      fee: chargeUpto500,
      chargeUpto500,
      chargeFor1000,
      chargePerNext1000,
      copies,
      extraBatches: 0,
      breakdownText: `₹${chargeUpto500} (Rate for up to 500 copies)`,
    };
  }

  // 2. 501 to 1000 copies (1000 copies tier)
  if (copies <= 1000) {
    return {
      fee: chargeFor1000,
      chargeUpto500,
      chargeFor1000,
      chargePerNext1000,
      copies,
      extraBatches: 0,
      breakdownText: `₹${chargeFor1000} (Rate for 1000 copies)`,
    };
  }

  // 3. Beyond 1000 copies (consistent increment for each next 1000 copies)
  const extraCopies = copies - 1000;
  const extraBatches = Math.ceil(extraCopies / 1000);
  const extraFee = extraBatches * chargePerNext1000;
  const totalFee = chargeFor1000 + extraFee;

  return {
    fee: totalFee,
    chargeUpto500,
    chargeFor1000,
    chargePerNext1000,
    copies,
    extraBatches,
    breakdownText: `₹${chargeFor1000} + (${extraBatches} × ₹${chargePerNext1000}) = ₹${totalFee}`,
  };
}
