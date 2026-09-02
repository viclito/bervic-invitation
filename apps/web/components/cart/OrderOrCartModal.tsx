"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  X,
  ShoppingCart,
  Sparkles,
  Package,
  MapPin,
  Phone,
  FileText,
  AlertCircle,
  Loader2,
  Layers,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import { calculateTieredCardPrice, calculatePrintingChangeFee, extractPrintingChangeConfig } from "@/lib/pricing";

export interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: string;
  templateName: string;
  previewImage?: string;
  cardDetails: Record<string, unknown>;
  elements?: unknown[];
  basePrice?: number;
  onOrderSuccess?: (orderNumber: string) => void;
  onCartSuccess?: () => void;
}

interface VenueItem {
  name: string;
  address: string;
  functionType: string;
  time?: string;
}

interface PrintDetailsForm {
  brideName: string;
  brideQualification: string;
  brideParents: string;
  brideAddress: string;
  groomName: string;
  groomQualification: string;
  groomParents: string;
  groomAddress: string;
  eventDate: string;
  eventTime: string;
  venues: VenueItem[];
  rsvpContact: string;
  paperType: string;
  specialInstructions: string;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPincode: string;
}

const PAPER_OPTIONS = [
  "250 GSM Textured Metallic Gold",
  "350 GSM Velvet Matte Finish",
  "300 GSM Royal Pearlescent Linen",
  "400 GSM Ultra-Thick Cotton Card",
];

const PRESET_COPIES = [50, 80, 100, 150, 200, 300, 500, 1000];

function getCardFallbackPreview(templateId?: string, templateName?: string): string {
  const id = String(templateId || "").toLowerCase();
  const name = String(templateName || "").toLowerCase();

  // 1. Modern Watercolor Floral & Rings (Purple)
  if (id.includes("modern-watercolor-floral") || id.includes("modern-floral") || name.includes("floral & rings") || name.includes("modern watercolor floral")) {
    return "/images/canva/modern-floral-thumb.webp";
  }

  // 2. Modern Watercolor & Gold Splatter (Plum / Luxury)
  if (id.includes("modern-watercolor-gold-splatter") || id.includes("modern2") || name.includes("gold splatter") || name.includes("luxury watercolor")) {
    return "/images/canva/modern2-thumb.webp";
  }

  // 3. Modern Botanical Silver Foil & Foliage (Navy / Royal)
  if (id.includes("modern-silver-botanical-foliage") || id.includes("modern3") || name.includes("silver foil") || name.includes("botanical silver")) {
    return "/images/canva/modern3-thumb.webp";
  }

  // 4. Vintage Botanical Romance (Template 1)
  if (id.includes("vintage-botanical") || name.includes("vintage botanical") || id.includes("template1")) {
    return "/images/canva/template1-thumb.webp";
  }

  // 5. Royal Parchment & Filigree (Template 2)
  if (id.includes("royal-parchment") || id.includes("royal-heritage") || name.includes("royal parchment") || name.includes("filigree") || id.includes("template2")) {
    return "/images/canva/template2-thumb.webp";
  }

  // 6. Grand Mughal Royal Architecture (Template 3)
  if (id.includes("grand-mughal") || name.includes("mughal") || id.includes("template3")) {
    return "/images/canva/template3-thumb.webp";
  }

  // 7. Antique Parchment & Victorian Swirl (Template 4)
  if (id.includes("antique-parchment") || id.includes("vintage-victorian") || name.includes("victorian") || id.includes("template4")) {
    return "/images/canva/template4-thumb.webp";
  }

  return "/images/canva/template1-thumb.webp";
}

export default function OrderOrCartModal({
  isOpen,
  onClose,
  templateId,
  templateName,
  previewImage,
  cardDetails = {},
  elements = [],
  basePrice,
  onOrderSuccess,
  onCartSuccess,
}: OrderModalProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [copies, setCopies] = useState<number>(100);
  const [customCopiesInput, setCustomCopiesInput] = useState<string>("");
  const [autoFetched, setAutoFetched] = useState<boolean>(false);

  const [form, setForm] = useState<PrintDetailsForm>({
    brideName: String(cardDetails.bride || ""),
    brideQualification: "",
    brideParents: "",
    brideAddress: "",
    groomName: String(cardDetails.groom || ""),
    groomQualification: "",
    groomParents: "",
    groomAddress: "",
    eventDate: String(cardDetails.date || ""),
    eventTime: String(cardDetails.time || ""),
    venues: [
      {
        name: String(cardDetails.venue || ""),
        address: String(cardDetails.city || ""),
        functionType: "Wedding & Reception",
        time: String(cardDetails.time || ""),
      },
    ],
    rsvpContact: "",
    paperType: PAPER_OPTIONS[0],
    specialInstructions: "",
    deliveryName: session?.user?.name || "",
    deliveryPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPincode: "",
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loadingAction, setLoadingAction] = useState<"cart" | "order" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const [linkedShopProduct, setLinkedShopProduct] = useState<{
    id: string;
    name: string;
    pricePerCard: number;
    minCopies: number;
    paperType: string;
    badge?: string | null;
    pricingTiersJson?: string | null;
  } | null>(null);
  const [checkingShopProduct, setCheckingShopProduct] = useState(false);

  // Printing Change (Multiple Text / Language Versions) State
  const [enablePrintingChange, setEnablePrintingChange] = useState<boolean>(false);
  const [printingChanges, setPrintingChanges] = useState<
    Array<{
      id: string;
      title: string;
      copies: number;
      details: string;
    }>
  >([
    {
      id: "change_1",
      title: "Version 2 (e.g. Bride Side / Reception / Tamil Text)",
      copies: 50,
      details: "",
    },
  ]);

  const autoFetchEventDetails = useCallback(async () => {
    try {
      const res = await fetch("/api/user/event-draft");
      const data = await res.json();
      if (res.ok && data?.draft?.data) {
        const d = data.draft.data;
        const bride = form.brideName || d.brideName || "";
        const groom = form.groomName || d.groomName || "";
        const date = form.eventDate || d.weddingDate || d.eventDate || "";
        const time = form.eventTime || d.weddingTime || d.muhurthamTime || "";

        let venuesList: VenueItem[] = [];
        if (Array.isArray(d.venues) && d.venues.length > 0) {
          venuesList = d.venues.map((v: { name?: string; address?: string; functionType?: string; time?: string }) => ({
            name: v.name || "",
            address: v.address || "",
            functionType: v.functionType || "Wedding",
            time: v.time || "",
          }));
        } else if (d.venueName || d.venueAddress) {
          venuesList = [
            {
              name: d.venueName || "",
              address: d.venueAddress || "",
              functionType: "Wedding & Reception",
              time: d.weddingTime || "",
            },
          ];
        } else {
          venuesList = form.venues.length > 0 ? form.venues : [{ name: "", address: "", functionType: "Wedding & Reception", time: "" }];
        }

        const defaultAddress =
          form.deliveryAddress ||
          d.brideAddress ||
          d.groomAddress ||
          (venuesList[0]?.address ? venuesList[0].address : "");

        setForm((prev) => ({
          ...prev,
          brideName: prev.brideName || bride,
          brideQualification: prev.brideQualification || d.brideQualification || "",
          brideParents: prev.brideParents || d.brideParents || "",
          brideAddress: prev.brideAddress || d.brideAddress || "",

          groomName: prev.groomName || groom,
          groomQualification: prev.groomQualification || d.groomQualification || "",
          groomParents: prev.groomParents || d.groomParents || "",
          groomAddress: prev.groomAddress || d.groomAddress || "",

          eventDate: prev.eventDate || date,
          eventTime: prev.eventTime || time,
          venues: prev.venues.some((v) => v.name.trim()) ? prev.venues : venuesList,

          rsvpContact: prev.rsvpContact || d.rsvpContact || d.contactPhone || "",
          specialInstructions: prev.specialInstructions || d.specialInstructions || "",

          deliveryName: prev.deliveryName || session?.user?.name || bride || groom || "",
          deliveryPhone: prev.deliveryPhone || (session?.user as { phone?: string })?.phone || d.rsvpContact || d.contactPhone || "",
          deliveryAddress: prev.deliveryAddress || defaultAddress,
          deliveryCity: prev.deliveryCity || d.city || "",
          deliveryPincode: prev.deliveryPincode || d.pincode || "",
        }));

        setAutoFetched(true);
      }
    } catch {
      // ignore
    }
  }, [session, form]);

  useEffect(() => {
    if (isOpen && session?.user) {
      autoFetchEventDetails();
    }
  }, [isOpen, session, autoFetchEventDetails]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function checkLinkedShopProduct() {
      setCheckingShopProduct(true);
      try {
        const cleanId = String(templateId || "").trim().toLowerCase();
        const cleanName = String(templateName || "").trim().toLowerCase();
        let foundProduct: any = null;

        if (basePrice && Number(basePrice) > 0) {
          foundProduct = {
            id: templateId,
            name: templateName,
            pricePerCard: Number(basePrice),
            minCopies: 50,
            paperType: PAPER_OPTIONS[0],
            badge: null,
          };
        }

        // 1. Check Canva templates table for admin-configured price
        try {
          const cRes = await fetch("/api/canva/templates", { cache: "no-store" });
          const cData = await cRes.json();
          if (isMounted && cRes.ok && Array.isArray(cData.templates)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cFound = cData.templates.find((t: any) => {
              const tSlug = String(t.id || "").trim().toLowerCase();
              const tDbId = String(t.dbId || "").trim().toLowerCase();
              const tName = String(t.name || "").trim().toLowerCase();
              return (cleanId && (tSlug === cleanId || tDbId === cleanId)) || (cleanName && tName === cleanName);
            });
            if (cFound && Number(cFound.pricePerCard) > 0) {
              foundProduct = {
                id: cFound.dbId || cFound.id,
                name: cFound.name || templateName,
                pricePerCard: Number(cFound.pricePerCard),
                minCopies: Number(cFound.minCopies) || 50,
                paperType: cFound.paperType || PAPER_OPTIONS[0],
                badge: cFound.badge || null,
              };
            }
          }
        } catch {
          // ignore
        }

        // 2. Check if product is registered in physical shop catalog
        try {
          const res = await fetch("/api/shop/products?limit=all", { cache: "no-store" });
          const data = await res.json();
          if (isMounted && res.ok && Array.isArray(data.products)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const found = data.products.find((p: any) => {
              const pCanvaId = String(p.canvaTemplateId || "").trim().toLowerCase();
              const pId = String(p.id || "").trim().toLowerCase();
              const pName = String(p.name || "").trim().toLowerCase();
              return (pCanvaId && pCanvaId === cleanId) || (pId && pId === cleanId) || (cleanName && pName === cleanName);
            });
            if (found && Number(found.pricePerCard) > 0) {
              foundProduct = {
                id: found.id,
                name: found.name || templateName,
                pricePerCard: Number(found.pricePerCard),
                minCopies: Number(found.minCopies) || 50,
                paperType: found.paperType || PAPER_OPTIONS[0],
                badge: found.badge || null,
                pricingTiersJson: found.pricingTiersJson || null,
              };
            }
          }
        } catch {
          // ignore
        }

        if (isMounted) {
          if (foundProduct) {
            setLinkedShopProduct(foundProduct);
            if (foundProduct.paperType && PAPER_OPTIONS.includes(foundProduct.paperType)) {
              setForm((prev) => ({ ...prev, paperType: foundProduct.paperType }));
            }
          } else {
            setLinkedShopProduct(null);
          }
        }
      } catch {
        if (isMounted) setLinkedShopProduct(null);
      } finally {
        if (isMounted) setCheckingShopProduct(false);
      }
    }

    checkLinkedShopProduct();
    return () => {
      isMounted = false;
    };
  }, [isOpen, templateId, templateName, basePrice]);

  const currentCopies = customCopiesInput ? parseInt(customCopiesInput, 10) : copies;
  const isLinked = !!linkedShopProduct;
  const basePricePerCard = linkedShopProduct?.pricePerCard || 0;
  const priceCalc = isLinked
    ? calculateTieredCardPrice(basePricePerCard, currentCopies, false, linkedShopProduct?.pricingTiersJson)
    : null;
  const unitPrice = priceCalc ? priceCalc.unitPrice : 0;
  const totalPrice = priceCalc ? priceCalc.totalPrice : 0;

  const printingChangeConfig = useMemo(() => {
    return extractPrintingChangeConfig(linkedShopProduct?.pricingTiersJson);
  }, [linkedShopProduct]);

  const totalPrintingChangeFee = useMemo(() => {
    if (!enablePrintingChange || !printingChangeConfig.enabled) return 0;
    return printingChanges.reduce((sum, chg) => {
      const feeResult = calculatePrintingChangeFee(chg.copies, printingChangeConfig);
      return sum + feeResult.fee;
    }, 0);
  }, [enablePrintingChange, printingChangeConfig, printingChanges]);

  if (!isOpen) return null;

  const effectivePreviewImage =
    previewImage && previewImage.trim().length > 5
      ? previewImage
      : getCardFallbackPreview(templateId, templateName);

  const clearFieldError = (key: string) => {
    setFormErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleAddVenue = () => {
    setForm((prev) => ({
      ...prev,
      venues: [
        ...prev.venues,
        {
          name: "",
          address: "",
          functionType: prev.venues.length === 1 ? "Reception" : "Function Venue",
          time: "",
        },
      ],
    }));
  };

  const handleRemoveVenue = (index: number) => {
    setForm((prev) => ({
      ...prev,
      venues: prev.venues.filter((_, i) => i !== index),
    }));
  };

  const handleVenueChange = (index: number, field: string, value: string) => {
    setForm((prev) => {
      const updated = [...prev.venues];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, venues: updated };
    });
  };

  const STEP_TITLES: Record<number, string> = {
    1: "Step 1 (Copies & Paper)",
    2: "Step 2 (Couple & Parents)",
    3: "Step 3 (Date & Venues)",
    4: "Step 4 (Delivery & Order)",
  };

  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (isNaN(currentCopies) || currentCopies < 50) {
        errors.copies = "Please select or enter print quantity (minimum 50 copies).";
      }
      if (!form.paperType) {
        errors.paperType = "Please select a paper finish.";
      }
    }

    if (stepNumber === 2) {
      if (!form.brideName.trim()) {
        errors.brideName = "Bride's full name is required for printing.";
      }
      if (!form.groomName.trim()) {
        errors.groomName = "Groom's full name is required for printing.";
      }
    }

    if (stepNumber === 3) {
      if (!form.eventDate.trim()) {
        errors.eventDate = "Wedding / event date is required.";
      }
      const hasValidVenue = form.venues.some((v) => v.name.trim());
      if (!hasValidVenue) {
        errors.venue = "Please enter at least one venue / marriage hall name.";
      }
    }

    if (stepNumber === 4) {
      const effectiveDeliveryName = (form.deliveryName || session?.user?.name || form.brideName || form.groomName || "").trim();
      if (!effectiveDeliveryName || effectiveDeliveryName.length < 2) {
        errors.deliveryName = "Recipient / Contact name is required.";
      }

      const rawPhone = (form.deliveryPhone || form.rsvpContact || "").trim();
      const phoneDigits = rawPhone.replace(/\D/g, "");
      if (!form.deliveryPhone.trim()) {
        errors.deliveryPhone = "WhatsApp contact phone number is required.";
      } else if (phoneDigits.length < 10) {
        errors.deliveryPhone = "Please enter a valid 10-digit WhatsApp or mobile number.";
      }

      if (!form.deliveryAddress.trim()) {
        errors.deliveryAddress = "Delivery & shipping address is required.";
      } else if (form.deliveryAddress.trim().length < 5) {
        errors.deliveryAddress = "Please enter a detailed address (House/Flat No, Street, Landmark).";
      }

      if (!form.deliveryCity.trim()) {
        errors.deliveryCity = "City / District / State is required.";
      }

      const pincodeDigits = form.deliveryPincode.replace(/\D/g, "");
      if (!form.deliveryPincode.trim()) {
        errors.deliveryPincode = "Postal pincode is required.";
      } else if (pincodeDigits.length !== 6) {
        errors.deliveryPincode = "Please enter a valid 6-digit postal pincode (e.g. 600001).";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setErrorMsg("");
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      setErrorMsg(`⚠️ Please fill in all required fields in ${STEP_TITLES[currentStep]} before proceeding.`);
      const scrollEl = document.getElementById("order-modal-scroll-body");
      if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const buildDetailsPayload = () => {
    const validVenues = form.venues.filter((v) => v.name.trim() || v.address.trim());
    const compiledCardDetails = {
      ...cardDetails,
      paperType: form.paperType,
      basePricePerCard: isLinked ? basePricePerCard : null,
      pricePerCard: unitPrice,
      totalPrice,
      priceStatus: isLinked ? "CONFIRMED" : "PENDING_ADMIN_QUOTE",
      linkedShopProductId: linkedShopProduct?.id || null,
      tierMultiplier: priceCalc?.multiplier || null,
      tierLabel: priceCalc?.tierLabel || "Custom Admin Quote",
      brideName: form.brideName.trim(),
      brideQualification: form.brideQualification.trim(),
      brideParents: form.brideParents.trim(),
      brideAddress: form.brideAddress.trim(),
      groomName: form.groomName.trim(),
      groomQualification: form.groomQualification.trim(),
      groomParents: form.groomParents.trim(),
      groomAddress: form.groomAddress.trim(),
      eventDate: form.eventDate.trim(),
      eventTime: form.eventTime.trim(),
      venues: validVenues.length > 0 ? validVenues : form.venues,
      primaryVenue: validVenues[0]?.name || form.venues[0]?.name || "",
      rsvpContact: form.rsvpContact.trim(),
      specialInstructions: form.specialInstructions.trim(),
      enablePrintingChange,
      printingChangesCount: enablePrintingChange ? printingChanges.length : 0,
      totalPrintingChangeFee,
      printingChanges: enablePrintingChange ? printingChanges : [],
      deliveryName: (form.deliveryName || session?.user?.name || form.brideName || form.groomName || "Valued Customer").trim(),
      deliveryPhone: (form.deliveryPhone || form.rsvpContact || "").trim(),
      deliveryAddress: (form.deliveryAddress || form.brideAddress || form.groomAddress || (form.venues[0]?.address || "")).trim(),
      deliveryCity: form.deliveryCity.trim(),
      deliveryPincode: form.deliveryPincode.trim(),
    };

    const lines: string[] = [];
    if (isLinked) {
      lines.push(`Catalog Pricing: ₹${unitPrice}/card (${priceCalc?.tierLabel}) • Base Total: ₹${totalPrice}`);
    } else {
      lines.push(`Pricing: Custom Studio Design (Pending Admin Quote)`);
    }
    if (enablePrintingChange && totalPrintingChangeFee > 0) {
      lines.push(`Printing Changes: ${printingChanges.length} additional text version(s) • Fee: +₹${totalPrintingChangeFee}`);
    }
    if (form.paperType) lines.push(`Paper Finish: ${form.paperType}`);
    if (form.specialInstructions.trim()) lines.push(`Notes: ${form.specialInstructions.trim()}`);
    if (form.rsvpContact.trim()) lines.push(`RSVP: ${form.rsvpContact.trim()}`);
    if (form.groomQualification.trim() || form.brideQualification.trim()) {
      lines.push(`Qualifications: Groom (${form.groomQualification.trim() || "N/A"}) | Bride (${form.brideQualification.trim() || "N/A"})`);
    }
    if (form.groomParents.trim() || form.brideParents.trim()) {
      lines.push(`Parents: Groom's (${form.groomParents.trim() || "N/A"}) | Bride's (${form.brideParents.trim() || "N/A"})`);
    }
    if (form.groomAddress.trim() || form.brideAddress.trim()) {
      lines.push(`Native Address: Groom (${form.groomAddress.trim() || "N/A"}) | Bride (${form.brideAddress.trim() || "N/A"})`);
    }
    const compiledCustomNotes = lines.join("\n\n");

    return { compiledCardDetails, compiledCustomNotes };
  };

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname + window.location.search : "/canva")}`);
      return;
    }

    for (let s = 1; s <= currentStep; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        setErrorMsg(`⚠️ Incomplete details in ${STEP_TITLES[s]}. Please fill in the required fields highlighted in red.`);
        const scrollEl = document.getElementById("order-modal-scroll-body");
        if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    setLoadingAction("cart");
    setErrorMsg("");
    setSuccessMsg("");

    const { compiledCardDetails, compiledCustomNotes } = buildDetailsPayload();

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "CANVA_CARD",
          templateId,
          templateName,
          previewImage: effectivePreviewImage,
          copies: currentCopies,
          cardDetails: compiledCardDetails,
          elements,
          customNotes: compiledCustomNotes,
          price: totalPrice + totalPrintingChangeFee,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      setSuccessMsg("✨ Card added to your cart successfully!");
      if (onCartSuccess) onCartSuccess();
      setTimeout(() => {
        onClose();
        setSuccessMsg("");
      }, 1200);
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || "Failed to add item to cart.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname + window.location.search : "/canva")}`);
      return;
    }

    // Sequentially validate steps 1 to 4 and navigate to the exact incomplete step
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        setErrorMsg(`⚠️ Incomplete details in ${STEP_TITLES[s]}. Please fill in the required fields highlighted in red.`);
        const scrollEl = document.getElementById("order-modal-scroll-body");
        if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    setLoadingAction("order");
    setErrorMsg("");
    setSuccessMsg("");

    const { compiledCardDetails, compiledCustomNotes } = buildDetailsPayload();

    const effectiveDeliveryName = (form.deliveryName || session?.user?.name || form.brideName || form.groomName || "Valued Customer").trim();
    const rawPhone = (form.deliveryPhone || form.rsvpContact || "").trim();
    const phoneDigits = rawPhone.replace(/\D/g, "");
    const effectivePhone = phoneDigits.length > 15 ? phoneDigits.slice(-10) : (rawPhone || "9876543210");
    const effectiveAddress = (form.deliveryAddress || form.brideAddress || form.groomAddress || (form.venues[0]?.address || "") || "Standard Delivery").trim();

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: effectiveDeliveryName,
          customerEmail: session.user?.email || "",
          customerPhone: effectivePhone,
          deliveryAddress: effectiveAddress,
          city: form.deliveryCity.trim() || null,
          pincode: form.deliveryPincode.trim() || null,
          notes: form.specialInstructions.trim() || null,
          items: [
            {
              itemType: "CANVA_CARD",
              templateId,
              templateName,
              previewImage: effectivePreviewImage,
              copies: currentCopies,
              cardDetails: compiledCardDetails,
              elements,
              customNotes: compiledCustomNotes,
              price: unitPrice,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      setSuccessMsg(`🎉 Order #${data.orderNumber} placed successfully! An email notification has been sent.`);
      if (onOrderSuccess) onOrderSuccess(data.orderNumber);
      setTimeout(() => {
        onClose();
        setSuccessMsg("");
      }, 2000);
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "Failed to place order. Please try again.";
      setErrorMsg(msg);
      const scrollEl = document.getElementById("order-modal-scroll-body");
      if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoadingAction(null);
    }
  };

  const STEPS = [
    { num: 1, title: "Copies & Paper", icon: "📦" },
    { num: 2, title: "Couple & Parents", icon: "💍" },
    { num: 3, title: "Date & Venues", icon: "🏛️" },
    { num: 4, title: "Delivery & Order", icon: "🚚" },
  ];

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#991B1B] border border-red-100 flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Order Custom Invitation Prints
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Template: <strong className="text-[#991B1B]">{templateName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Stepper Bar */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-200/80 shrink-0">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {STEPS.map((step) => {
              const isCompleted = currentStep > step.num;
              const isActive = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    // Allow navigating back or validating forward
                    if (step.num < currentStep) {
                      setCurrentStep(step.num);
                    } else if (step.num === currentStep + 1) {
                      if (validateStep(currentStep)) {
                        setCurrentStep(step.num);
                      }
                    }
                  }}
                  className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-white border-2 border-[#991B1B] shadow-xs"
                      : isCompleted
                      ? "bg-red-50/60 border border-red-200 text-[#991B1B]"
                      : "bg-transparent border border-transparent text-slate-400 opacity-60"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isActive
                        ? "bg-[#991B1B] text-white"
                        : isCompleted
                        ? "bg-[#991B1B] text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isCompleted ? "✓" : step.num}
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <p className={`text-[10px] uppercase font-bold tracking-wider truncate ${isActive ? "text-[#991B1B]" : "text-slate-500"}`}>
                      Step {step.num}
                    </p>
                    <p className={`text-xs font-bold truncate ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                      {step.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div id="order-modal-scroll-body" data-lenis-prevent className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Top Error Message Toast */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Auto-filled Notification Banner */}
          {autoFetched && (
            <div className="bg-red-50 text-[#991B1B] px-4 py-2.5 rounded-2xl border border-red-200 flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Auto-filled from your Event Profile. You can edit any details below.</span>
              </span>
            </div>
          )}

          {/* ══════════════════ STEP 1: COPIES & PAPER STOCK ══════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Card Snapshot & Details Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col sm:flex-row gap-5 items-center">
                {effectivePreviewImage ? (
                  <div className="w-32 h-40 shrink-0 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={effectivePreviewImage} alt="Card Preview" className="w-full h-full object-contain p-1.5" />
                  </div>
                ) : (
                  <div className="w-32 h-40 shrink-0 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1.5">
                    <Layers className="w-7 h-7" />
                    <span className="text-[10px] font-bold">Custom Card</span>
                  </div>
                )}

                <div className="flex-1 space-y-2 text-xs text-slate-700 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isLinked
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-red-50 text-[#991B1B] border border-red-200"
                    }`}>
                      {isLinked ? "Linked Catalog Design" : "Custom Studio Design"}
                    </span>
                    {linkedShopProduct?.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#991B1B] text-white text-[9.5px] font-black uppercase">
                        {linkedShopProduct.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-serif font-bold text-slate-900">{templateName}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                    {isLinked
                      ? `Connected to physical catalog item "${linkedShopProduct?.name}". Tiered volume pricing is automatically applied based on print run.`
                      : "Select your preferred physical print run and cardstock paper finish. Price quotation will be reviewed & confirmed by Admin upon order."}
                  </p>
                </div>
              </div>

              {/* ── LIVE PRICING & TIER BREAKDOWN BANNER ── */}
              {isLinked ? (
                <div className="p-4 rounded-3xl bg-emerald-50/90 border-2 border-emerald-200 text-xs space-y-2.5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wide">
                        Catalog Pricing
                      </span>
                      <span className="font-extrabold text-emerald-950 text-xs">
                        {linkedShopProduct?.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-extrabold text-emerald-900 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300">
                      Base Rate: ₹{basePricePerCard}/card (1000+ prints)
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">
                        Volume Rate for {currentCopies} Copies ({priceCalc?.tierLabel})
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-extrabold text-[#991B1B]">₹{unitPrice}</span>
                        <span className="text-xs text-slate-500 font-normal">/ card</span>
                        {priceCalc && priceCalc.markupPercent > 0 ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                            +{priceCalc.markupPercent}% Tier
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                            Base Bulk Rate
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 self-stretch sm:self-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Estimated Subtotal</span>
                      <span className="text-xl font-extrabold text-slate-900">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-3xl bg-amber-50/90 border-2 border-amber-200 text-xs space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                      Custom Studio Design
                    </span>
                    <span className="font-extrabold text-amber-950 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Price Quote Provided by Admin</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed">
                    This invitation is crafted separately in Canva Studio. When you place your order, our printing team will calculate the custom paper stock &amp; manufacturing rate for {currentCopies} copies and confirm the quote with you.
                  </p>
                  <div className="bg-white p-2.5 rounded-2xl border border-amber-200 flex items-center justify-between font-bold text-amber-950">
                    <span>Estimated Print Total:</span>
                    <span className="text-[#991B1B] font-extrabold text-sm">Quote on Admin Review</span>
                  </div>
                </div>
              )}

              {/* Number of Copies Needed */}
              <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#991B1B]" />
                    <span>Number of Copies Required <span className="text-[#991B1B]">*</span></span>
                  </label>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${
                    formErrors.copies
                      ? "bg-rose-50 text-rose-700 border-rose-300"
                      : "bg-red-50 text-[#991B1B] border-red-200"
                  }`}>
                    {currentCopies > 0 ? `${currentCopies} Copies Selected` : "Invalid Count"}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {PRESET_COPIES.map((preset) => {
                    const isSelected = !customCopiesInput && copies === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setCopies(preset);
                          setCustomCopiesInput("");
                          clearFieldError("copies");
                        }}
                        className={`py-3 px-3 rounded-2xl font-extrabold text-xs transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-[#991B1B] text-white border-[#991B1B] shadow-sm scale-102"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-[#991B1B]"
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-slate-600 font-bold">Or enter exact custom count:</span>
                  <input
                    type="number"
                    min="50"
                    placeholder="Min 50 (e.g. 250)"
                    value={customCopiesInput}
                    onChange={(e) => {
                      setCustomCopiesInput(e.target.value);
                      const val = parseInt(e.target.value, 10);
                      if (val >= 50) {
                        clearFieldError("copies");
                      }
                    }}
                    className={`w-36 px-3.5 py-2 rounded-xl border text-xs font-bold text-slate-900 focus:outline-none transition-colors ${
                      formErrors.copies
                        ? "border-rose-500 bg-rose-50/40 ring-2 ring-rose-200"
                        : "border-slate-200 bg-slate-50 focus:ring-1 focus:ring-[#991B1B]"
                    }`}
                  />
                </div>
                {formErrors.copies && (
                  <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.copies}</span>
                  </p>
                )}
              </div>

              {/* Paper Type Selection */}
              <div className="space-y-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 block">
                  Paper Finish &amp; Card Stock <span className="text-[#991B1B]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAPER_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, paperType: opt });
                        clearFieldError("paperType");
                      }}
                      className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        form.paperType === opt
                          ? "bg-red-50/80 border-[#991B1B] text-[#991B1B] shadow-2xs ring-1 ring-[#991B1B]"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span>{opt}</span>
                      {form.paperType === opt && <span className="text-xs font-extrabold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Printing Change (Multiple Text / Language Versions) Option */}
              {printingChangeConfig.enabled && (
                <div className="p-4 rounded-3xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-red-100/80 text-[#991B1B] flex items-center justify-center font-bold text-xs shrink-0">
                        📝
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Need separate text / language versions? (Printing Change)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          e.g. Groom side &amp; Bride side details, or English &amp; Regional language copies.
                        </span>
                      </div>
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={enablePrintingChange}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setEnablePrintingChange(checked);
                          if (checked && printingChanges.length === 0) {
                            setPrintingChanges([
                              {
                                id: `change_${Date.now()}`,
                                title: "Version 2 (e.g. Bride Side / Reception / Tamil Text)",
                                copies: Math.min(100, Math.max(25, Math.floor(currentCopies / 2))),
                                details: "",
                              },
                            ]);
                          }
                        }}
                        className="w-4 h-4 text-[#991B1B] rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        {enablePrintingChange ? "Added" : "Add"}
                      </span>
                    </label>
                  </div>

                  {enablePrintingChange && (
                    <div className="space-y-2.5 pt-2.5 border-t border-slate-200">
                      {/* Versions Breakdown List */}
                      <div className="space-y-2">
                        {/* Version 1 summary */}
                        <div className="p-2.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block">Version 1 (Main Print Version)</span>
                            <span className="text-[10px] text-slate-500">Primary invitation wording</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-900">
                              {Math.max(0, currentCopies - printingChanges.reduce((sum, c) => sum + c.copies, 0))} cards
                            </span>
                            <span className="text-[10px] text-slate-400 block">(Included in base)</span>
                          </div>
                        </div>

                        {/* Extra Printing Changes */}
                        {printingChanges.map((chg, idx) => {
                          const feeCalc = calculatePrintingChangeFee(chg.copies, printingChangeConfig);
                          return (
                            <div
                              key={chg.id}
                              className="p-2.5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs relative"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={chg.title}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPrintingChanges((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, title: val } : item))
                                    );
                                  }}
                                  placeholder={`Version ${idx + 2} Label (e.g. Bride Side Details)`}
                                  className="font-bold text-slate-900 text-xs bg-transparent border-b border-dashed border-slate-300 focus:border-[#991B1B] focus:outline-none flex-1 py-0.5"
                                />
                                {printingChanges.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPrintingChanges((prev) => prev.filter((_, i) => i !== idx))
                                    }
                                    className="text-slate-400 hover:text-red-600 text-xs font-bold cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <label className="text-[11px] text-slate-500">Print Quantity:</label>
                                  <input
                                    type="number"
                                    min={10}
                                    max={currentCopies - 10}
                                    value={chg.copies}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10) || 10;
                                      setPrintingChanges((prev) =>
                                        prev.map((item, i) => (i === idx ? { ...item, copies: val } : item))
                                      );
                                    }}
                                    className="w-16 px-2 py-0.5 rounded border border-slate-300 font-bold text-xs text-slate-800 focus:outline-none focus:border-[#991B1B]"
                                  />
                                  <span className="text-[11px] text-slate-500">cards</span>
                                </div>

                                <div className="text-right font-mono font-bold text-xs text-[#991B1B]">
                                  +₹{feeCalc.fee}
                                </div>
                              </div>

                              <div className="text-[10px] text-slate-500 font-sans">
                                {feeCalc.breakdownText}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add another change button */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPrintingChanges((prev) => [
                              ...prev,
                              {
                                id: `change_${Date.now()}`,
                                title: `Version ${prev.length + 2} (e.g. Reception / Regional)`,
                                copies: 50,
                                details: "",
                              },
                            ]);
                          }}
                          className="text-[11px] font-bold text-[#991B1B] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          + Add Another Text Version (Version {printingChanges.length + 2})
                        </button>

                        <div className="text-xs font-bold text-slate-900">
                          Total Change Fee: <span className="text-[#991B1B] font-mono">+₹{totalPrintingChangeFee}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════ STEP 2: COUPLE & FAMILY ══════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Bride Information */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-[#991B1B] font-extrabold text-xs border-b border-slate-100 pb-2">
                  <span className="text-base">👰</span>
                  <span>Bride&apos;s Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={formErrors.brideName ? "has-validation-error" : ""}>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Bride&apos;s Full Name <span className="text-[#991B1B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.brideName}
                      onChange={(e) => {
                        setForm({ ...form, brideName: e.target.value });
                        clearFieldError("brideName");
                      }}
                      placeholder="e.g. Priya Sharma"
                      className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                        formErrors.brideName
                          ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                          : "border-slate-200 bg-slate-50 focus:ring-1 focus:ring-[#991B1B]"
                      }`}
                    />
                    {formErrors.brideName && (
                      <p className="text-rose-600 text-[11px] font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.brideName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Bride&apos;s Qualification <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.brideQualification}
                      onChange={(e) => setForm({ ...form, brideQualification: e.target.value })}
                      placeholder="e.g. B.Tech, MBA"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Bride&apos;s Parents Names
                    </label>
                    <input
                      type="text"
                      value={form.brideParents}
                      onChange={(e) => setForm({ ...form, brideParents: e.target.value })}
                      placeholder="e.g. Mr. Rajesh Sharma & Mrs. Kavita Sharma"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Bride&apos;s Residence Address
                    </label>
                    <input
                      type="text"
                      value={form.brideAddress}
                      onChange={(e) => setForm({ ...form, brideAddress: e.target.value })}
                      placeholder="e.g. No. 42, Lotus Villa, Gandhi Road, Chennai"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                    />
                  </div>
                </div>
              </div>

              {/* Groom Information */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-[#991B1B] font-extrabold text-xs border-b border-slate-100 pb-2">
                  <span className="text-base">🤵</span>
                  <span>Groom&apos;s Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={formErrors.groomName ? "has-validation-error" : ""}>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Groom&apos;s Full Name <span className="text-[#991B1B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.groomName}
                      onChange={(e) => {
                        setForm({ ...form, groomName: e.target.value });
                        clearFieldError("groomName");
                      }}
                      placeholder="e.g. Rahul Verma"
                      className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                        formErrors.groomName
                          ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                          : "border-slate-200 bg-slate-50 focus:ring-1 focus:ring-[#991B1B]"
                      }`}
                    />
                    {formErrors.groomName && (
                      <p className="text-rose-600 text-[11px] font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.groomName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Groom&apos;s Qualification <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.groomQualification}
                      onChange={(e) => setForm({ ...form, groomQualification: e.target.value })}
                      placeholder="e.g. M.S., Software Architect"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Groom&apos;s Parents Names
                    </label>
                    <input
                      type="text"
                      value={form.groomParents}
                      onChange={(e) => setForm({ ...form, groomParents: e.target.value })}
                      placeholder="e.g. Mr. Vijay Verma & Mrs. Sunita Verma"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Groom&apos;s Residence Address
                    </label>
                    <input
                      type="text"
                      value={form.groomAddress}
                      onChange={(e) => setForm({ ...form, groomAddress: e.target.value })}
                      placeholder="e.g. No. 18, Royal Heights, Indiranagar, Bangalore"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════ STEP 3: DATE & VENUES ══════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Wedding Date & Timing */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-[#991B1B] font-extrabold text-xs border-b border-slate-100 pb-2">
                  <span className="text-base">📅</span>
                  <span>Wedding Date &amp; Auspicious Timing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={formErrors.eventDate ? "has-validation-error" : ""}>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Wedding / Event Date <span className="text-[#991B1B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.eventDate}
                      onChange={(e) => {
                        setForm({ ...form, eventDate: e.target.value });
                        clearFieldError("eventDate");
                      }}
                      placeholder="e.g. Sunday, 24th Nov 2026"
                      className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                        formErrors.eventDate
                          ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                          : "border-slate-200 bg-slate-50 focus:ring-1 focus:ring-[#991B1B]"
                      }`}
                    />
                    {formErrors.eventDate && (
                      <p className="text-rose-600 text-[11px] font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.eventDate}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Muhurtham / Function Timing
                    </label>
                    <input
                      type="text"
                      value={form.eventTime}
                      onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                      placeholder="e.g. Muhurtham: 9:00 AM | Reception: 7:00 PM"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                    />
                  </div>
                </div>
              </div>

              {/* Multiple Venues */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-[#991B1B] font-extrabold text-xs">
                    <span className="text-base">🏛️</span>
                    <span>Venue &amp; Function Locations</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVenue}
                    className="text-xs text-[#991B1B] hover:text-white font-bold flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 cursor-pointer shadow-2xs hover:bg-[#991B1B] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Venue</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {form.venues.map((venue, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#991B1B]">
                          Location #{idx + 1}
                        </span>
                        {form.venues.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVenue(idx)}
                            className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Remove this venue"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-900 block mb-1 text-[11px]">
                            Function Name
                          </label>
                          <input
                            type="text"
                            value={venue.functionType || ""}
                            onChange={(e) => handleVenueChange(idx, "functionType", e.target.value)}
                            placeholder="e.g. Muhurtham / Reception"
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                          />
                        </div>

                        <div className={`sm:col-span-2 ${formErrors.venue && idx === 0 ? "has-validation-error" : ""}`}>
                          <label className="font-bold text-slate-900 block mb-1 text-[11px]">
                            Venue / Marriage Hall Name <span className="text-[#991B1B]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={venue.name}
                            onChange={(e) => {
                              handleVenueChange(idx, "name", e.target.value);
                              clearFieldError("venue");
                            }}
                            placeholder="e.g. Grand Palace Convention Hall"
                            className={`w-full p-2 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                              formErrors.venue && !venue.name.trim()
                                ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                                : "border-slate-200 bg-white focus:ring-1 focus:ring-[#991B1B]"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-900 block mb-1 text-[11px]">
                            City &amp; Full Location Address
                          </label>
                          <input
                            type="text"
                            value={venue.address}
                            onChange={(e) => handleVenueChange(idx, "address", e.target.value)}
                            placeholder="e.g. Anna Salai, Chennai, Tamil Nadu - 600002"
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-900 block mb-1 text-[11px]">
                            Timing / Time
                          </label>
                          <input
                            type="text"
                            value={venue.time || ""}
                            onChange={(e) => handleVenueChange(idx, "time", e.target.value)}
                            placeholder="e.g. 9:00 AM onwards"
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {formErrors.venue && (
                  <p className="text-rose-600 text-xs font-bold flex items-center gap-1.5 mt-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors.venue}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════ STEP 4: DELIVERY & SPECIAL NOTES ══════════════════ */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Delivery & Shipping Address */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-[#991B1B] font-extrabold text-xs border-b border-slate-100 pb-2">
                  <MapPin className="w-4 h-4 text-[#991B1B]" />
                  <span>Delivery &amp; Shipping Address</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={formErrors.deliveryName ? "has-validation-error" : ""}>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Recipient / Contact Name <span className="text-[#991B1B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.deliveryName}
                      onChange={(e) => {
                        setForm({ ...form, deliveryName: e.target.value });
                        clearFieldError("deliveryName");
                      }}
                      placeholder="e.g. Priya Sharma"
                      className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                        formErrors.deliveryName
                          ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                          : "border-slate-200 bg-slate-50 focus:ring-1 focus:ring-[#991B1B]"
                      }`}
                    />
                    {formErrors.deliveryName && (
                      <p className="text-rose-600 text-[11px] font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.deliveryName}</span>
                      </p>
                    )}
                  </div>

                  <div className={formErrors.deliveryPhone ? "has-validation-error" : ""}>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      WhatsApp Contact Phone <span className="text-[#991B1B]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={form.deliveryPhone}
                        onChange={(e) => {
                          setForm({ ...form, deliveryPhone: e.target.value });
                          clearFieldError("deliveryPhone");
                        }}
                        placeholder="e.g. 9876543210"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                          formErrors.deliveryPhone
                            ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                            : "border-slate-200 bg-slate-50 focus:ring-1 focus:ring-[#991B1B]"
                        }`}
                      />
                    </div>
                    {formErrors.deliveryPhone && (
                      <p className="text-rose-600 text-[11px] font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.deliveryPhone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className={formErrors.deliveryAddress ? "has-validation-error" : ""}>
                  <label className="font-bold text-slate-900 block mb-1 text-xs">
                    Complete Shipping Address (House/Street/Landmark) <span className="text-[#991B1B]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={form.deliveryAddress}
                    onChange={(e) => {
                      setForm({ ...form, deliveryAddress: e.target.value });
                      clearFieldError("deliveryAddress");
                    }}
                    placeholder="e.g. Flat 402, Royal Palms Apartment, 12th Main Road, Indiranagar"
                    className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none transition-colors ${
                      formErrors.deliveryAddress
                        ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                        : "border-slate-200 bg-slate-50 focus:ring-1 focus:ring-[#991B1B]"
                    }`}
                  />
                  {formErrors.deliveryAddress && (
                    <p className="text-rose-600 text-[11px] font-bold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.deliveryAddress}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={formErrors.deliveryCity ? "has-validation-error" : ""}>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      City / District / State <span className="text-[#991B1B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.deliveryCity}
                      onChange={(e) => {
                        setForm({ ...form, deliveryCity: e.target.value });
                        clearFieldError("deliveryCity");
                      }}
                      placeholder="e.g. Bangalore, Karnataka"
                      className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                        formErrors.deliveryCity
                          ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                          : "border-slate-200 bg-slate-50 focus:ring-1 focus:ring-[#991B1B]"
                      }`}
                    />
                    {formErrors.deliveryCity && (
                      <p className="text-rose-600 text-[11px] font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.deliveryCity}</span>
                      </p>
                    )}
                  </div>

                  <div className={formErrors.deliveryPincode ? "has-validation-error" : ""}>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Pincode / Postal Code <span className="text-[#991B1B]">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={form.deliveryPincode}
                      onChange={(e) => {
                        setForm({ ...form, deliveryPincode: e.target.value });
                        clearFieldError("deliveryPincode");
                      }}
                      placeholder="e.g. 560038"
                      className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                        formErrors.deliveryPincode
                          ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                          : "border-slate-200 bg-slate-50 focus:ring-1 focus:ring-[#991B1B]"
                      }`}
                    />
                    {formErrors.deliveryPincode && (
                      <p className="text-rose-600 text-[11px] font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.deliveryPincode}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* RSVP & Special Instructions */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-[#991B1B] font-extrabold text-xs border-b border-slate-100 pb-2">
                  <FileText className="w-4 h-4 text-[#991B1B]" />
                  <span>RSVP &amp; Special Production Instructions</span>
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1 text-xs">
                    📞 RSVP Names &amp; Contact Numbers
                  </label>
                  <input
                    type="text"
                    value={form.rsvpContact}
                    onChange={(e) => setForm({ ...form, rsvpContact: e.target.value })}
                    placeholder="e.g. Sharma Family: +91 98765 43210 / Verma Family: +91 91234 56789"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1 text-xs">
                    Special Requirements / Custom Proof Notes
                  </label>
                  <textarea
                    rows={3}
                    value={form.specialInstructions}
                    onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
                    placeholder="e.g. Please send a WhatsApp proof before printing, keep couple names in calligraphy script, deliver before 15th Nov..."
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B] bg-slate-50"
                  />
                </div>
              </div>

              {/* Summary Overview Box */}
              <div className="bg-red-50/70 border border-red-200 rounded-3xl p-4 sm:p-5 space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#991B1B] block">
                  Order Summary Review
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Print Run:</span>
                    <strong className="text-slate-900">{currentCopies} Copies</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Estimated Total:</span>
                    <strong className="text-[#991B1B] text-xs font-extrabold block truncate">
                      {isLinked
                        ? `₹${totalPrice + totalPrintingChangeFee} ${totalPrintingChangeFee > 0 ? `(Card: ₹${totalPrice} + Change: ₹${totalPrintingChangeFee})` : `(₹${unitPrice}/card)`}`
                        : "Price on Admin Review"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Paper Stock:</span>
                    <strong className="text-slate-900 truncate block">{form.paperType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Celebrants:</span>
                    <strong className="text-slate-900 truncate block">{form.brideName || "Bride"} &amp; {form.groomName || "Groom"}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Toasts */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 font-bold animate-in fade-in">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

        </div>

        {/* Modal Navigation Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Back Step Button */}
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={loadingAction !== null}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>← Back</span>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}

          {/* Forward / Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-102"
              >
                <span>Continue to Step {currentStep + 1} →</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={loadingAction !== null}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {loadingAction === "cart" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4 text-[#991B1B]" />}
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loadingAction !== null}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 hover:scale-102 active:scale-98"
                >
                  {loadingAction === "order" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>✨ Place Order Now</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
