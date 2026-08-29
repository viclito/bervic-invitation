"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Sparkles,
  Check,
  Star,
  Package,
  Truck,
  ShieldCheck,
  Printer,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Eye,
  X,
  Loader2,
  RefreshCw,
  Zap,
  Plus,
  Trash2,
  GraduationCap,
  Home,
  Building,
  MapPin,
  Users,
  Calendar,
  Mail,
  Gift,
  AlertCircle,
  CheckCircle2,
  Heart,
  Search,
  Languages,
  Clock,
  ChevronDown,
} from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";
import IndicLanguageInput from "@/components/shop/IndicLanguageInput";
import {
  SUPPORTED_LANGUAGES,
  getLanguageByCode,
  formatEnglishDate,
  formatRegionalDate,
  format12HourTime,
  formatRegionalTime,
} from "@/lib/indicTranslation";
import { CARD_PRICING_TIERS, calculateTieredCardPrice } from "@/lib/pricing";

export interface ShopProductItem {
  id: string;
  name: string;
  category: string;
  pricePerCard: number;
  minCopies: number;
  previewImage: string;
  galleryImages?: string | null;
  badge?: string | null;
  rating: number;
  reviewsCount: number;
  paperType: string;
  dimensions: string;
  description: string;
  featuresJson: string;
  canvaTemplateId?: string | null;
  isActive: boolean;
}

const INVITATION_CATEGORIES = [
  { id: "all", label: "All Invitation Cards" },
  { id: "royal", label: "👑 Royal & Heritage" },
  { id: "floral", label: "🌸 Floral & Botanical" },
  { id: "vintage", label: "📜 Vintage Parchment" },
  { id: "modern", label: "✨ Modern Die-Cut Arch" },
  { id: "velvet", label: "💎 Luxury Velvet Suites" },
];

const RETURN_GIFT_CATEGORIES = [
  { id: "all", label: "All Return Gifts" },
  { id: "brass", label: "🪔 Brass Diyas & Idols" },
  { id: "hampers", label: "🍬 Sweets & Dry Fruits" },
  { id: "silver", label: "🪙 Silver Pooja Coins" },
  { id: "bags", label: "🛍️ Brocade & Jute Bags" },
  { id: "candles", label: "🕯️ Aromatherapy Candles" },
];

export default function TraditionalShopClient() {
  const { data: session } = useSession();
  const router = useRouter();

  const [mainTab, setMainTab] = useState<"invitations" | "return_gifts">("invitations");
  const [products, setProducts] = useState<ShopProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [addingCardId, setAddingCardId] = useState<string | null>(null);
  const [placingOrderId, setPlacingOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewProduct, setPreviewProduct] = useState<ShopProductItem | null>(null);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [autoFetched, setAutoFetched] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLInputElement>(null);
  const timePickerRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    if (datePickerRef.current) {
      if (typeof datePickerRef.current.showPicker === "function") {
        datePickerRef.current.showPicker();
      } else {
        datePickerRef.current.focus();
        datePickerRef.current.click();
      }
    }
  };

  const openTimePicker = () => {
    if (timePickerRef.current) {
      if (typeof timePickerRef.current.showPicker === "function") {
        timePickerRef.current.showPicker();
      } else {
        timePickerRef.current.focus();
        timePickerRef.current.click();
      }
    }
  };

  // Debounce search query input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [printForm, setPrintForm] = useState({
    cardLanguage: "en", // default English Only
    languageMode: "DUAL" as "DUAL" | "REGIONAL_ONLY",

    brideName: "",
    brideNameRegional: "",
    brideQualification: "",
    brideQualificationRegional: "",
    brideParents: "",
    brideParentsRegional: "",
    brideAddress: "",
    brideAddressRegional: "",

    groomName: "",
    groomNameRegional: "",
    groomQualification: "",
    groomQualificationRegional: "",
    groomParents: "",
    groomParentsRegional: "",
    groomAddress: "",
    groomAddressRegional: "",

    eventDate: "",
    eventDateRegional: "",
    eventTime: "",
    eventTimeRegional: "",

    venues: [
      {
        name: "",
        nameRegional: "",
        address: "",
        addressRegional: "",
        functionType: "Wedding & Reception",
        functionTypeRegional: "",
        time: "",
      },
    ] as Array<{
      name: string;
      nameRegional?: string;
      address: string;
      addressRegional?: string;
      functionType?: string;
      functionTypeRegional?: string;
      time?: string;
    }>,

    rsvpContact: "",
    rsvpContactRegional: "",
    specialInstructions: "",
    specialInstructionsRegional: "",

    // Delivery & Shipping details
    deliveryName: "",
    deliveryPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPincode: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const autoFetchEventDetails = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/user/event-draft");
      const data = await res.json();
      if (res.ok && data.success && data.draft) {
        const d = data.draft;
        setPrintForm((prev) => {
          const bride = prev.brideName || d.hostNameOne || d.partnerOne || "";
          const groom = prev.groomName || d.hostNameTwo || d.partnerTwo || "";
          const date = prev.eventDate || d.eventDate || d.weddingDate || "";
          const time = prev.eventTime || d.eventTime || d.weddingTime || "";

          let venuesList = prev.venues && prev.venues.length > 0 && prev.venues[0].name ? prev.venues : [];
          if (venuesList.length === 0 || !venuesList[0].name) {
            if (Array.isArray(d.locations) && d.locations.length > 0) {
              venuesList = d.locations.map((loc: any) => ({
                name: loc.name || loc.title || "",
                address: loc.address || loc.place || "",
                functionType: loc.type || loc.tag || "Wedding & Reception",
                time: loc.time || "",
              }));
            } else if (d.venueName || d.venueAddress) {
              venuesList = [
                {
                  name: d.venueName || "",
                  address: d.venueAddress || "",
                  functionType: "Wedding & Reception",
                  time: time,
                },
              ];
            } else {
              venuesList = [{ name: "", address: "", functionType: "Wedding & Reception", time: "" }];
            }
          }

          const defaultAddress =
            prev.deliveryAddress ||
            prev.brideAddress ||
            prev.groomAddress ||
            (venuesList[0]?.address ? venuesList[0].address : "");

          return {
            ...prev,
            brideName: bride,
            brideQualification: prev.brideQualification || d.brideQualification || "",
            brideParents: prev.brideParents || d.brideParents || "",
            brideAddress: prev.brideAddress || d.brideAddress || "",

            groomName: groom,
            groomQualification: prev.groomQualification || d.groomQualification || "",
            groomParents: prev.groomParents || d.groomParents || "",
            groomAddress: prev.groomAddress || d.groomAddress || "",

            eventDate: date,
            eventTime: time,
            venues: venuesList,

            rsvpContact: prev.rsvpContact || d.rsvpContact || d.contactPhone || "",
            specialInstructions: prev.specialInstructions || d.specialInstructions || "",

            deliveryName: prev.deliveryName || session?.user?.name || bride || groom || "",
            deliveryPhone: prev.deliveryPhone || (session?.user as any)?.phone || d.rsvpContact || d.contactPhone || "",
            deliveryAddress: defaultAddress,
            deliveryCity: prev.deliveryCity || "",
            deliveryPincode: prev.deliveryPincode || "",
          };
        });
        setAutoFetched(true);
      }
    } catch {
      // ignore
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      autoFetchEventDetails();
    }
  }, [session, autoFetchEventDetails]);

  const handleAddVenue = () => {
    setPrintForm((prev) => ({
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
    setPrintForm((prev) => ({
      ...prev,
      venues: prev.venues.filter((_, i) => i !== index),
    }));
  };

  const handleVenueChange = (index: number, field: string, value: string) => {
    setPrintForm((prev) => {
      const updated = [...prev.venues];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, venues: updated };
    });
  };

  // High-performance paginated product fetcher with batching
  const fetchProducts = useCallback(
    async (targetPage = 1, isAppend = false) => {
      if (targetPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const params = new URLSearchParams({
          page: String(targetPage),
          limit: "24",
          mainTab,
          category: selectedCategory,
          sortBy,
        });
        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }
        const res = await fetch(`/api/shop/products?${params.toString()}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.products)) {
          if (isAppend) {
            setProducts((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const fresh = data.products.filter((p: ShopProductItem) => !existingIds.has(p.id));
              return [...prev, ...fresh];
            });
          } else {
            setProducts(data.products);
          }
          setTotalCount(typeof data.total === "number" ? data.total : data.products.length);
          setHasMore(Boolean(data.hasMore));
          setPage(targetPage);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [mainTab, selectedCategory, debouncedSearch, sortBy]
  );

  // Trigger page 1 fetch when filters change
  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

  // Load next batch handler
  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    fetchProducts(page + 1, true);
  }, [loading, loadingMore, hasMore, page, fetchProducts]);

  // Infinite scroll observer
  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "250px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, handleLoadMore]);

  const activeCategories = mainTab === "invitations" ? INVITATION_CATEGORIES : RETURN_GIFT_CATEGORIES;

  const getQuantity = (cardId: string, minCopies = 50) => {
    return selectedQuantities[cardId] || Math.max(minCopies, 100);
  };

  const setQuantity = (cardId: string, copies: number) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [cardId]: copies,
    }));
  };

  const parseFeatures = (jsonStr?: string): string[] => {
    if (!jsonStr) return [];
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return [];
  };

  const clearFieldError = (fieldKey: string) => {
    setFormErrors((prev) => {
      if (!prev[fieldKey]) return prev;
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const validateStep = (stepNumber: number): boolean => {
    if (!previewProduct) return true;
    const errors: Record<string, string> = {};
    const isGift =
      previewProduct.category === "return_gifts" ||
      ["brass", "hampers", "silver", "bags", "candles"].includes(previewProduct.category);

    if (isGift) {
      if (stepNumber === 1) {
        const qty = getQuantity(previewProduct.id, 20);
        if (qty < 1) {
          errors.copies = "Please select valid gift piece quantity.";
        }
      } else if (stepNumber === 2) {
        if (!printForm.brideName.trim() && !printForm.groomName.trim()) {
          errors.couple = "Please enter Couple / Celebrant or Family name for the gift tag.";
        }
      } else if (stepNumber === 3) {
        const effectiveDeliveryName = (
          printForm.deliveryName ||
          session?.user?.name ||
          ""
        ).trim();
        if (!effectiveDeliveryName) {
          errors.deliveryName = "Please enter recipient name.";
        }
        const effectivePhone = (printForm.deliveryPhone || "").trim();
        const phoneDigits = effectivePhone.replace(/\D/g, "");
        if (!effectivePhone || phoneDigits.length < 10) {
          errors.deliveryPhone = "Please enter a valid 10-digit phone number.";
        }
        if (!printForm.deliveryAddress.trim()) {
          errors.deliveryAddress = "Please enter delivery shipping address.";
        }
        if (!printForm.deliveryCity.trim()) {
          errors.deliveryCity = "City / District / State is required.";
        }
        const pincodeDigits = printForm.deliveryPincode.replace(/\D/g, "");
        if (!printForm.deliveryPincode.trim() || pincodeDigits.length !== 6) {
          errors.deliveryPincode = "Please enter a valid 6-digit postal pincode.";
        }
      }
    } else {
      if (stepNumber === 1) {
        const copies = getQuantity(previewProduct.id, 50);
        if (copies < 50) {
          errors.copies = "Minimum print run is 50 copies.";
        }
      } else if (stepNumber === 2) {
        if (!printForm.brideName.trim()) {
          errors.brideName = "Bride's full name is required for printing.";
        }
        if (!printForm.groomName.trim()) {
          errors.groomName = "Groom's full name is required for printing.";
        }
      } else if (stepNumber === 3) {
        if (!printForm.eventDate.trim()) {
          errors.eventDate = "Wedding / event date is required.";
        }
        const hasValidVenue = printForm.venues.some((v) => v.name.trim());
        if (!hasValidVenue) {
          errors.venue = "Please enter at least one venue / marriage hall name.";
        }
      } else if (stepNumber === 4) {
        const effectiveDeliveryName = (
          printForm.deliveryName ||
          session?.user?.name ||
          printForm.brideName ||
          printForm.groomName ||
          ""
        ).trim();

        if (!effectiveDeliveryName || effectiveDeliveryName.length < 2) {
          errors.deliveryName = "Please enter a valid recipient / contact name.";
        }

        const effectivePhone = (printForm.deliveryPhone || printForm.rsvpContact || "").trim();
        const phoneDigits = effectivePhone.replace(/\D/g, "");
        if (!effectivePhone || phoneDigits.length < 10) {
          errors.deliveryPhone = "Please enter a valid 10-digit WhatsApp or mobile number.";
        }

        const effectiveAddress = (
          printForm.deliveryAddress ||
          printForm.brideAddress ||
          printForm.groomAddress ||
          (printForm.venues[0]?.address || "")
        ).trim();

        if (!effectiveAddress || effectiveAddress.length < 5) {
          errors.deliveryAddress = "Please enter complete delivery address (House/Flat No, Street, Landmark).";
        }

        if (!printForm.deliveryCity.trim()) {
          errors.deliveryCity = "City / District / State is required.";
        }

        const pincodeDigits = printForm.deliveryPincode.replace(/\D/g, "");
        if (!printForm.deliveryPincode.trim()) {
          errors.deliveryPincode = "Postal pincode is required.";
        } else if (pincodeDigits.length !== 6) {
          errors.deliveryPincode = "Please enter a valid 6-digit postal pincode (e.g. 600001).";
        }
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector(".has-validation-error");
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);
      return false;
    }
    return true;
  };

  const validatePrintForm = (product: ShopProductItem, isDirectOrder: boolean = false): boolean => {
    const isGift =
      product.category === "return_gifts" ||
      ["brass", "hampers", "silver", "bags", "candles"].includes(product.category);
    const maxSteps = isGift ? 3 : 4;
    const targetSteps = isDirectOrder ? maxSteps : (isGift ? 2 : 3);

    for (let s = 1; s <= targetSteps; s++) {
      if (!validateStep(s)) {
        setActiveStep(s);
        return false;
      }
    }
    return true;
  };

  const handleAddToCart = async (product: ShopProductItem, customCopies?: number) => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent("/shop")}`);
      return;
    }

    // Validate essential invitation print fields if modal was open
    if (previewProduct) {
      if (!validatePrintForm(product, false)) return;
    }

    setFormErrors({});

    const isGift = ["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(product.category);
    const copies = customCopies || getQuantity(product.id, isGift ? product.minCopies || 25 : product.minCopies || 50);
    const priceCalc = calculateTieredCardPrice(product.pricePerCard, copies, isGift);
    const effectiveUnitPrice = priceCalc.unitPrice;
    const totalPrice = priceCalc.totalPrice;

    setAddingCardId(product.id);

    const validVenues = printForm.venues.filter((v) => v.name.trim() || v.address.trim());
    const langObj = getLanguageByCode(printForm.cardLanguage);

    const cardDetails = {
      paperType: product.paperType,
      dimensions: product.dimensions,
      basePricePerCard: product.pricePerCard,
      pricePerCard: effectiveUnitPrice,
      tierMultiplier: priceCalc.multiplier,
      tierLabel: priceCalc.tierLabel,
      totalPrice,

      // Language & Script Metadata
      cardLanguage: printForm.cardLanguage,
      languageName: langObj.name,
      languageNativeName: langObj.nativeName,
      languageMode: printForm.languageMode,

      brideName: printForm.brideName.trim(),
      brideNameRegional: printForm.brideNameRegional.trim(),
      brideQualification: printForm.brideQualification.trim(),
      brideQualificationRegional: printForm.brideQualificationRegional.trim(),
      brideParents: printForm.brideParents.trim(),
      brideParentsRegional: printForm.brideParentsRegional.trim(),
      brideAddress: printForm.brideAddress.trim(),
      brideAddressRegional: printForm.brideAddressRegional.trim(),

      groomName: printForm.groomName.trim(),
      groomNameRegional: printForm.groomNameRegional.trim(),
      groomQualification: printForm.groomQualification.trim(),
      groomQualificationRegional: printForm.groomQualificationRegional.trim(),
      groomParents: printForm.groomParents.trim(),
      groomParentsRegional: printForm.groomParentsRegional.trim(),
      groomAddress: printForm.groomAddress.trim(),
      groomAddressRegional: printForm.groomAddressRegional.trim(),

      eventDate: printForm.eventDate.trim(),
      eventDateRegional: printForm.eventDateRegional.trim(),
      eventTime: printForm.eventTime.trim(),
      eventTimeRegional: printForm.eventTimeRegional.trim(),

      venues: validVenues,
      rsvpContact: printForm.rsvpContact.trim(),
      rsvpContactRegional: printForm.rsvpContactRegional.trim(),
      specialInstructions: printForm.specialInstructions.trim(),
      specialInstructionsRegional: printForm.specialInstructionsRegional.trim(),

      deliveryAddress: printForm.deliveryAddress.trim(),
      deliveryPhone: printForm.deliveryPhone.trim(),
    };

    const customNotes = [
      `Language: ${langObj.name} (${printForm.languageMode === "REGIONAL_ONLY" ? "Regional Only" : "Dual Language"})`,
      printForm.brideName || printForm.groomName
        ? `Couple (Eng): ${printForm.brideName}${printForm.brideQualification ? ` (${printForm.brideQualification})` : ""} & ${printForm.groomName}${printForm.groomQualification ? ` (${printForm.groomQualification})` : ""}`
        : "",
      printForm.brideNameRegional || printForm.groomNameRegional
        ? `Couple (${langObj.nativeName}): ${printForm.brideNameRegional} & ${printForm.groomNameRegional}`
        : "",
      printForm.brideParents ? `Bride Parents: ${printForm.brideParents}${printForm.brideParentsRegional ? ` / ${printForm.brideParentsRegional}` : ""}` : "",
      printForm.brideAddress ? `Bride House: ${printForm.brideAddress}${printForm.brideAddressRegional ? ` / ${printForm.brideAddressRegional}` : ""}` : "",
      printForm.groomParents ? `Groom Parents: ${printForm.groomParents}${printForm.groomParentsRegional ? ` / ${printForm.groomParentsRegional}` : ""}` : "",
      printForm.groomAddress ? `Groom House: ${printForm.groomAddress}${printForm.groomAddressRegional ? ` / ${printForm.groomAddressRegional}` : ""}` : "",
      printForm.eventDate ? `Date: ${printForm.eventDate} ${printForm.eventTime}${printForm.eventDateRegional ? ` / ${printForm.eventDateRegional} ${printForm.eventTimeRegional}` : ""}` : "",
      validVenues.length > 0
        ? `Venues: ` +
          validVenues
            .map((v) => `${v.functionType || "Venue"}: ${v.name}${v.nameRegional ? ` (${v.nameRegional})` : ""}, ${v.address}${v.addressRegional ? ` (${v.addressRegional})` : ""}`)
            .join(" ; ")
        : "",
      printForm.rsvpContact ? `RSVP: ${printForm.rsvpContact}${printForm.rsvpContactRegional ? ` / ${printForm.rsvpContactRegional}` : ""}` : "",
      printForm.specialInstructions ? `Notes: ${printForm.specialInstructions}${printForm.specialInstructionsRegional ? ` / ${printForm.specialInstructionsRegional}` : ""}` : "",
      `Paper: ${product.paperType} | Size: ${product.dimensions}`,
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "TRADITIONAL_PRINT",
          templateId: product.id,
          templateName: product.name,
          previewImage: product.previewImage,
          copies,
          price: totalPrice,
          customNotes,
          cardDetails,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        window.dispatchEvent(new Event("cartUpdated"));
        if (previewProduct) setPreviewProduct(null);
        setToastMessage(`Added ${copies} copies of "${product.name}" to cart!`);
        setTimeout(() => setToastMessage(null), 4000);
        setCartOpen(true);
      } else {
        setToastMessage(data.error || "Failed to add item to cart.");
        setTimeout(() => setToastMessage(null), 5000);
      }
    } catch {
      setToastMessage("Error adding item to cart. Please try again.");
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setAddingCardId(null);
    }
  };

  const handleDirectOrder = async (product: ShopProductItem, customCopies?: number) => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent("/shop")}`);
      return;
    }

    if (!validatePrintForm(product, true)) return;

    setFormErrors({});
    const isGift = ["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(product.category);
    const copies = customCopies || getQuantity(product.id, isGift ? product.minCopies || 25 : product.minCopies || 50);
    const priceCalc = calculateTieredCardPrice(product.pricePerCard, copies, isGift);
    const effectiveUnitPrice = priceCalc.unitPrice;
    const totalPrice = priceCalc.totalPrice;

    setPlacingOrderId(product.id);

    const effectiveDeliveryName = (
      printForm.deliveryName ||
      session?.user?.name ||
      printForm.brideName ||
      printForm.groomName ||
      ""
    ).trim();

    const effectivePhone = (printForm.deliveryPhone || printForm.rsvpContact || "").trim();

    const effectiveAddress = (
      printForm.deliveryAddress ||
      printForm.brideAddress ||
      printForm.groomAddress ||
      (printForm.venues[0]?.address || "")
    ).trim();

    const validVenues = printForm.venues.filter((v) => v.name.trim() || v.address.trim());
    const langObj = getLanguageByCode(printForm.cardLanguage);

    const cardDetails = {
      paperType: product.paperType,
      dimensions: product.dimensions,
      basePricePerCard: product.pricePerCard,
      pricePerCard: effectiveUnitPrice,
      tierMultiplier: priceCalc.multiplier,
      tierLabel: priceCalc.tierLabel,
      totalPrice,

      // Language & Script Metadata
      cardLanguage: printForm.cardLanguage,
      languageName: langObj.name,
      languageNativeName: langObj.nativeName,
      languageMode: printForm.languageMode,

      brideName: printForm.brideName.trim(),
      brideNameRegional: printForm.brideNameRegional.trim(),
      brideQualification: printForm.brideQualification.trim(),
      brideQualificationRegional: printForm.brideQualificationRegional.trim(),
      brideParents: printForm.brideParents.trim(),
      brideParentsRegional: printForm.brideParentsRegional.trim(),
      brideAddress: printForm.brideAddress.trim(),
      brideAddressRegional: printForm.brideAddressRegional.trim(),

      groomName: printForm.groomName.trim(),
      groomNameRegional: printForm.groomNameRegional.trim(),
      groomQualification: printForm.groomQualification.trim(),
      groomQualificationRegional: printForm.groomQualificationRegional.trim(),
      groomParents: printForm.groomParents.trim(),
      groomParentsRegional: printForm.groomParentsRegional.trim(),
      groomAddress: printForm.groomAddress.trim(),
      groomAddressRegional: printForm.groomAddressRegional.trim(),

      eventDate: printForm.eventDate.trim(),
      eventDateRegional: printForm.eventDateRegional.trim(),
      eventTime: printForm.eventTime.trim(),
      eventTimeRegional: printForm.eventTimeRegional.trim(),

      venues: validVenues,
      rsvpContact: printForm.rsvpContact.trim(),
      rsvpContactRegional: printForm.rsvpContactRegional.trim(),
      specialInstructions: printForm.specialInstructions.trim(),
      specialInstructionsRegional: printForm.specialInstructionsRegional.trim(),

      deliveryAddress: effectiveAddress,
      deliveryPhone: effectivePhone,
      deliveryName: effectiveDeliveryName,
    };

    const customNotes = [
      `Language: ${langObj.name} (${printForm.languageMode === "REGIONAL_ONLY" ? "Regional Only" : "Dual Language"})`,
      printForm.brideName || printForm.groomName
        ? `Couple (Eng): ${printForm.brideName}${printForm.brideQualification ? ` (${printForm.brideQualification})` : ""} & ${printForm.groomName}${printForm.groomQualification ? ` (${printForm.groomQualification})` : ""}`
        : "",
      printForm.brideNameRegional || printForm.groomNameRegional
        ? `Couple (${langObj.nativeName}): ${printForm.brideNameRegional} & ${printForm.groomNameRegional}`
        : "",
      printForm.brideParents ? `Bride Parents: ${printForm.brideParents}${printForm.brideParentsRegional ? ` / ${printForm.brideParentsRegional}` : ""}` : "",
      printForm.brideAddress ? `Bride House: ${printForm.brideAddress}${printForm.brideAddressRegional ? ` / ${printForm.brideAddressRegional}` : ""}` : "",
      printForm.groomParents ? `Groom Parents: ${printForm.groomParents}${printForm.groomParentsRegional ? ` / ${printForm.groomParentsRegional}` : ""}` : "",
      printForm.groomAddress ? `Groom House: ${printForm.groomAddress}${printForm.groomAddressRegional ? ` / ${printForm.groomAddressRegional}` : ""}` : "",
      printForm.eventDate ? `Date: ${printForm.eventDate} ${printForm.eventTime}${printForm.eventDateRegional ? ` / ${printForm.eventDateRegional} ${printForm.eventTimeRegional}` : ""}` : "",
      validVenues.length > 0
        ? `Venues: ` +
          validVenues
            .map((v) => `${v.functionType || "Venue"}: ${v.name}${v.nameRegional ? ` (${v.nameRegional})` : ""}, ${v.address}${v.addressRegional ? ` (${v.addressRegional})` : ""}`)
            .join(" ; ")
        : "",
      printForm.rsvpContact ? `RSVP: ${printForm.rsvpContact}${printForm.rsvpContactRegional ? ` / ${printForm.rsvpContactRegional}` : ""}` : "",
      printForm.specialInstructions ? `Notes: ${printForm.specialInstructions}${printForm.specialInstructionsRegional ? ` / ${printForm.specialInstructionsRegional}` : ""}` : "",
      `Paper: ${product.paperType} | Size: ${product.dimensions}`,
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: effectiveDeliveryName,
          customerEmail: session?.user?.email || "",
          customerPhone: effectivePhone,
          deliveryAddress: effectiveAddress,
          city: printForm.deliveryCity.trim() || null,
          pincode: printForm.deliveryPincode.trim() || null,
          notes: printForm.specialInstructions.trim() || null,
          items: [
            {
              itemType: "TRADITIONAL_PRINT",
              templateId: product.id,
              templateName: product.name,
              previewImage: product.previewImage,
              copies,
              price: effectiveUnitPrice,
              customNotes,
              cardDetails,
            },
          ],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (previewProduct) setPreviewProduct(null);
        router.push(`/dashboard/orders?success=${data.orderNumber}`);
      } else {
        setToastMessage(data.error || "Failed to place order. Please check required fields.");
        setTimeout(() => setToastMessage(null), 5000);
      }
    } catch {
      setToastMessage("Error placing order. Please try again.");
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setPlacingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#991B1B] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-amber-300 shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">{toastMessage}</p>
            <button
              onClick={() => setCartOpen(true)}
              className="text-[11px] text-amber-300 font-semibold hover:underline"
            >
              View Cart &amp; Place Order →
            </button>
          </div>
        </div>
      )}

      {/* Main Shop Container */}
      <div className="flex-1 pt-28 sm:pt-32 pb-24">
        {/* Top-Level Primary Segmented Navigation Tabs */}
        <div className="flex justify-center mb-6 px-4">
          <div className="inline-flex p-1.5 rounded-full bg-slate-100/90 border border-slate-200 shadow-xs backdrop-blur-xs">
            <button
              onClick={() => {
                setMainTab("invitations");
                setSelectedCategory("all");
              }}
              className={`flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                mainTab === "invitations"
                  ? "bg-[#991B1B] text-white shadow-md"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Invitation Cards</span>
            </button>

            <button
              onClick={() => {
                setMainTab("return_gifts");
                setSelectedCategory("all");
              }}
              className={`flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                mainTab === "return_gifts"
                  ? "bg-[#991B1B] text-white shadow-md"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Return Gifts</span>
            </button>
          </div>
        </div>

        {/* Clean Hero Header */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-6 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-[#991B1B] text-xs font-extrabold tracking-wide">
            {mainTab === "invitations" ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                <span>TRADITIONAL PRINT INVITATIONS</span>
              </>
            ) : (
              <>
                <Gift className="w-3.5 h-3.5 text-amber-500" />
                <span>CURATED RETURN GIFTS &amp; FAVORS</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-serif max-w-3xl mx-auto">
            {mainTab === "invitations" ? (
              <>
                Luxury Physical <span className="text-[#991B1B] italic">Printed Invitations</span>
              </>
            ) : (
              <>
                Celebration &amp; Wedding <span className="text-[#991B1B] italic">Return Gifts</span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            {mainTab === "invitations"
              ? "Shop handcrafted invitation cards printed on 350+ GSM textured boards, gold foil stamping, and matching envelopes."
              : "Delight your guests with bespoke handcrafted brass peacock diyas, dry fruit hampers, 999 pure silver coins, and custom silk potli bags."}
          </p>
        </section>

        {/* Subcategory Filter Tabs & Search / Sort Controls */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-8 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#991B1B] text-white shadow-md border border-[#991B1B]"
                    : "bg-white text-slate-700 hover:bg-red-50 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designs by name, paper texture, or keywords..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#991B1B] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                {totalCount > 0 ? `Showing ${products.length} of ${totalCount} designs` : "0 designs"}
              </span>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#991B1B] cursor-pointer"
              >
                <option value="default">Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-20">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-2 space-y-2 animate-pulse"
                >
                  <div className="aspect-[3/4] bg-slate-100 rounded-xl w-full" />
                  <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-7 bg-slate-100 rounded-lg w-full mt-2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
              <Package className="w-12 h-12 text-[#991B1B] mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No items match your criteria</h3>
              <p className="text-xs text-slate-500 mt-1">Please try clearing your search query or selecting another category.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#991B1B] text-white text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                {products.map((product) => {
                  const isGift = product.category === "return_gifts" || ["brass", "hampers", "silver", "bags", "candles"].includes(product.category);
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-[#991B1B] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                      onClick={() => setPreviewProduct(product)}
                    >
                      {/* Crispy Card Image Frame */}
                      <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden border-b border-slate-100">
                        <Image
                          src={product.previewImage}
                          alt={product.name}
                          fill
                          className="object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                          loading="lazy"
                        />

                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-[#991B1B] text-white text-[8px] sm:text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md border border-red-300 uppercase tracking-wider">
                            {product.badge}
                          </div>
                        )}

                        {/* Studio Customizable Badge */}
                        {product.canvaTemplateId && (
                          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-amber-500 to-[#991B1B] text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full shadow-md border border-amber-300 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-200" />
                            <span>Studio Edit</span>
                          </div>
                        )}

                        {/* Price Tag Pill */}
                        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 bg-slate-900/90 text-white text-[10px] sm:text-xs font-extrabold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md border border-slate-700 backdrop-blur-xs flex items-center gap-0.5">
                          <span>₹{product.pricePerCard}</span>
                          <span className="text-[8px] sm:text-[9px] font-normal text-slate-300">
                            {isGift ? "/ pc" : "/ card"}
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                          <span className="bg-white text-[#991B1B] text-[10px] sm:text-xs font-extrabold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <Eye className="w-3 h-3 text-amber-500" />
                            <span>View Specs</span>
                          </span>
                        </div>
                      </div>

                      {/* Bottom Content Area */}
                      <div className="p-2.5 sm:p-3.5 flex flex-col justify-between space-y-2 bg-white">
                        <div>
                          <h3 className="font-serif font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#991B1B] transition-colors truncate">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between text-[10px] sm:text-xs mt-0.5">
                            <span className="font-extrabold text-[#991B1B]">
                              ₹{product.pricePerCard}{" "}
                              <span className="text-[9px] font-medium text-slate-500">
                                {isGift ? "/ piece" : "/ card"}
                              </span>
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                              Min {product.minCopies || (isGift ? 25 : 50)} {isGift ? "pcs" : ""}
                            </span>
                          </div>
                        </div>

                        {/* Place Order Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!session) {
                              router.push(`/auth/login?callbackUrl=${encodeURIComponent("/shop")}`);
                              return;
                            }
                            setPreviewProduct(product);
                          }}
                          className="w-full py-1.5 sm:py-2 px-2 rounded-lg sm:rounded-xl bg-red-50 hover:bg-[#991B1B] text-[#991B1B] hover:text-white border border-red-200 text-[10px] sm:text-xs font-extrabold flex items-center justify-center gap-1 transition-all shadow-2xs group-hover:bg-[#991B1B] group-hover:text-white cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-amber-500 group-hover:text-amber-300" />
                          <span>Place Order</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Infinite Scroll Sentinel & Batch Loader Trigger */}
              <div ref={observerTarget} className="w-full py-8 flex flex-col items-center justify-center">
                {loadingMore ? (
                  <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-600 animate-in fade-in">
                    <Loader2 className="w-4 h-4 animate-spin text-[#991B1B]" />
                    <span>Loading next batch of designs...</span>
                  </div>
                ) : hasMore ? (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 shadow-xs transition-all cursor-pointer"
                  >
                    Load More ({totalCount - products.length} remaining)
                  </button>
                ) : products.length > 0 ? (
                  <p className="text-[11px] font-semibold text-slate-400">
                    ✨ You&apos;ve viewed all {totalCount} designs
                  </p>
                ) : null}
              </div>
            </>
          )}
        </section>



        {/* How The Print Order Process Works */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-16">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#221C17] font-serif">
              Simple 4-Step Print &amp; Delivery Process
            </h2>
            <p className="text-xs sm:text-sm text-[#221C17]/70">
              From card selection to your doorstep in 4-6 business days.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#D9A441]/30 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center font-extrabold text-sm shadow-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-[#221C17]">Select Card Design</h3>
              <p className="text-xs text-[#221C17]/70 leading-relaxed">
                Choose your favorite traditional printed invitation design and select your required copies (50 to 500+).
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#D9A441]/30 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center font-extrabold text-sm shadow-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-[#221C17]">Place Order &amp; Details</h3>
              <p className="text-xs text-[#221C17]/70 leading-relaxed">
                Add to cart, enter your delivery address and couple/event names, and complete payment securely.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#D9A441]/30 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center font-extrabold text-sm shadow-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-[#221C17]">WhatsApp Proof Approval</h3>
              <p className="text-xs text-[#221C17]/70 leading-relaxed">
                Our design team shares the exact high-res print proof on WhatsApp for your final approval before mass printing.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#D9A441]/30 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center font-extrabold text-sm shadow-sm">
                4
              </div>
              <h3 className="text-sm font-bold text-[#221C17]">Print &amp; Doorstep Delivery</h3>
              <p className="text-xs text-[#221C17]/70 leading-relaxed">
                Crafted on 350+ GSM textured boards, gold foil stamped, carefully boxed, and dispatched with live tracking.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Product Detail & Customization Stepper Modal */}
      {previewProduct && (() => {
        const isGift =
          previewProduct.category === "return_gifts" ||
          ["brass", "hampers", "silver", "bags", "candles"].includes(previewProduct.category);

        const steps = isGift
          ? [
              { number: 1, title: "Quantity & Pieces", icon: "🎁" },
              { number: 2, title: "Gift Tag Details", icon: "🏷️" },
              { number: 3, title: "Delivery & Order", icon: "🚚" },
            ]
          : [
              { number: 1, title: "Copies & Pricing", icon: "📦" },
              { number: 2, title: "Couple & Parents", icon: "👰" },
              { number: 3, title: "Event & Venues", icon: "📅" },
              { number: 4, title: "RSVP & Delivery", icon: "🚚" },
            ];
        const maxSteps = steps.length;

        const copies = getQuantity(previewProduct.id, isGift ? previewProduct.minCopies || 25 : previewProduct.minCopies || 50);
        const priceCalc = calculateTieredCardPrice(previewProduct.pricePerCard, copies, isGift);
        const effectiveUnitPrice = priceCalc.unitPrice;
        const totalPrice = priceCalc.totalPrice;
        const isOrdering = placingOrderId === previewProduct.id;
        const isAdding = addingCardId === previewProduct.id;

        let galleryList: string[] = [];
        try {
          if (previewProduct.galleryImages) {
            const parsed = typeof previewProduct.galleryImages === "string" ? JSON.parse(previewProduct.galleryImages) : previewProduct.galleryImages;
            if (Array.isArray(parsed)) galleryList = parsed.filter(Boolean);
          }
        } catch {
          galleryList = [];
        }
        const allDisplayImages = Array.from(new Set([previewProduct.previewImage, ...galleryList].filter(Boolean)));
        const currentDisplayedImage = activeModalImage || previewProduct.previewImage;

        return (
          <div
            data-lenis-prevent
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto overscroll-contain animate-in fade-in duration-150"
          >
            <div
              data-lenis-prevent
              className="bg-white rounded-3xl border-2 border-red-100 shadow-2xl max-w-6xl w-full p-5 sm:p-7 relative max-h-[92vh] overflow-y-auto overscroll-contain animate-in zoom-in-95 duration-200 space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setPreviewProduct(null);
                  setActiveStep(1);
                  setFormErrors({});
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-50 text-[#991B1B] flex items-center justify-center hover:bg-[#991B1B] hover:text-white transition-colors cursor-pointer z-10 border border-red-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                {/* Left Column: Product Snapshot, Gallery Thumbnails, Title & Specs */}
                <div className="lg:col-span-4 space-y-3.5">
                  <div className="relative aspect-[3/4] bg-red-50/40 rounded-2xl overflow-hidden border-2 border-red-100 p-4 flex items-center justify-center shadow-inner">
                    <img
                      src={currentDisplayedImage}
                      alt={previewProduct.name}
                      className="w-full h-full object-contain p-2 transition-all duration-300"
                    />
                    {previewProduct.badge && (
                      <span className="absolute top-3.5 left-3.5 bg-[#991B1B] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md border border-red-300 uppercase tracking-wider">
                        {previewProduct.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3.5 right-3.5 bg-slate-900/90 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md border border-slate-700 backdrop-blur-xs">
                      ₹{effectiveUnitPrice} {isGift ? "/ pc" : "/ card"}
                    </div>
                  </div>

                  {/* Sub-Images / Gallery Thumbnails Selector */}
                  {allDisplayImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 no-scrollbar">
                      {allDisplayImages.map((imgUrl, imgIdx) => {
                        const isSelected = imgUrl === currentDisplayedImage;
                        return (
                          <button
                            key={imgIdx}
                            type="button"
                            onClick={() => setActiveModalImage(imgUrl)}
                            className={`w-14 h-16 rounded-xl overflow-hidden bg-white border-2 p-0.5 shrink-0 transition-all cursor-pointer relative ${
                              isSelected
                                ? "border-[#991B1B] ring-2 ring-red-300 shadow-md scale-105"
                                : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400"
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Angle ${imgIdx + 1}`}
                              className="w-full h-full object-contain"
                            />
                            {imgIdx === 0 && (
                              <span className="absolute bottom-0.5 right-0.5 bg-amber-400 text-slate-950 text-[7px] font-black px-1 rounded">
                                MAIN
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" /> {previewProduct.rating || 5.0}
                      </span>
                      <span className="text-[11px] text-slate-500">({previewProduct.reviewsCount || 50} reviews)</span>
                      <span className="text-[10px] text-[#991B1B] font-extrabold uppercase bg-red-50 px-2 py-0.5 rounded-full border border-red-200 ml-auto">
                        {isGift ? "Return Gift" : previewProduct.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold font-serif text-slate-900 leading-snug">{previewProduct.name}</h3>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-2xl font-black text-[#991B1B]">₹{effectiveUnitPrice}</span>
                      <span className="text-xs font-medium text-slate-500">
                        {isGift ? "per gift piece" : "/ card"}
                      </span>
                      {!isGift && priceCalc.markupPercent > 0 && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                          +{priceCalc.markupPercent}% Tier
                        </span>
                      )}
                      {!isGift && priceCalc.markupPercent === 0 && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Base Rate
                        </span>
                      )}
                    </div>
                    {!isGift && (
                      <p className="text-[10.5px] text-slate-500 font-medium">
                        Base rate: ₹{previewProduct.pricePerCard}/card for 1000+ prints
                      </p>
                    )}
                  </div>

                  {/* Canva Studio Direct Customization Button (Only shown if linked to Canva template) */}
                  {previewProduct.canvaTemplateId && (
                    <a
                      href={`/canva?template=${encodeURIComponent(previewProduct.canvaTemplateId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-[#991B1B] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer no-underline text-center group border border-amber-300"
                    >
                      <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                      <span>Customize Design in Studio</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}

                  {/* Paper / Material Specifications */}
                  <div className="bg-red-50/40 p-3 rounded-2xl border border-red-100 space-y-1 text-xs shadow-2xs">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{isGift ? "🎁" : "📄"}</span>
                      <span>{previewProduct.paperType}</span>
                    </p>
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <span>📏</span>
                      <span>Dimensions: {previewProduct.dimensions}</span>
                    </p>
                  </div>
                </div>

                {/* Right Column: Multi-Step Customization Form (8 cols on desktop) */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Stepper Navigation Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#991B1B] uppercase tracking-wider">
                          Step {activeStep} of {maxSteps}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm font-bold text-slate-800 font-serif">
                          {steps[activeStep - 1]?.title}
                        </span>
                      </div>
                      {autoFetched && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Event Profile Auto-filled</span>
                        </span>
                      )}
                    </div>

                    {/* Stepper Pill Tabs */}
                    <div className="flex items-center gap-2 p-1 bg-red-50/70 border border-red-100 rounded-2xl">
                      {steps.map((step) => {
                        const isCurrent = activeStep === step.number;
                        const isCompleted = activeStep > step.number;
                        return (
                          <button
                            key={step.number}
                            type="button"
                            onClick={() => {
                              if (step.number < activeStep) {
                                setActiveStep(step.number);
                              } else if (step.number > activeStep) {
                                if (validateStep(activeStep)) {
                                  setActiveStep(step.number);
                                }
                              }
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isCurrent
                                ? "bg-[#991B1B] text-white shadow-md ring-2 ring-red-200"
                                : isCompleted
                                ? "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                                : "bg-transparent text-slate-500 hover:text-slate-900"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                                isCurrent
                                  ? "bg-white text-[#991B1B]"
                                  : isCompleted
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {isCompleted ? "✓" : step.number}
                            </span>
                            <span className="truncate hidden sm:inline">{step.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Validation Error Banner */}
                  {Object.keys(formErrors).length > 0 && (
                    <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs shadow-xs animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-rose-900">Please complete the required fields:</p>
                        <ul className="list-disc list-inside text-[11px] text-rose-700 font-semibold space-y-0.5">
                          {Object.values(formErrors).map((msg, i) => (
                            <li key={i}>{msg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* ════════════════════════════════════════════════════════════
                      STEP 1: COPIES & TIERED PRICING (Moved to Stepper)
                      ════════════════════════════════════════════════════════════ */}
                  {activeStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-red-100 space-y-4 shadow-2xs">
                        <div className="flex items-center justify-between border-b border-red-100 pb-2.5">
                          <div className="flex items-center gap-2 text-[#991B1B] font-extrabold text-xs">
                            <Package className="w-4 h-4 text-[#991B1B]" />
                            <span>{isGift ? "Select Gift Pieces Required" : "Select Physical Print Run (Min 50 Copies)"}</span>
                          </div>
                          <span className="px-3 py-1 rounded-xl bg-red-50 text-[#991B1B] text-xs font-extrabold border border-red-200">
                            {copies} {isGift ? "Pieces" : "Cards Selected"}
                          </span>
                        </div>

                        {/* Preset Quantity Buttons */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Choose Quantity Preset:
                          </label>
                          {!isGift ? (
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                              {[50, 80, 100, 150, 200, 300, 500, 1000].map((preset) => {
                                const isSelected = copies === preset;
                                const calc = calculateTieredCardPrice(previewProduct.pricePerCard, preset, false);
                                return (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => {
                                      setQuantity(previewProduct.id, preset);
                                      clearFieldError("copies");
                                    }}
                                    className={`py-2.5 px-1 rounded-2xl font-bold text-center transition-all border cursor-pointer flex flex-col items-center justify-center ${
                                      isSelected
                                        ? "bg-[#991B1B] text-white border-[#991B1B] shadow-md scale-102 ring-2 ring-red-200"
                                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-[#991B1B]"
                                    }`}
                                  >
                                    <span className="text-sm font-black">{preset}</span>
                                    <span className={`text-[10px] ${isSelected ? "text-red-100" : "text-[#991B1B] font-extrabold"}`}>
                                      ₹{calc.unitPrice}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                              {[20, 25, 50, 100, 150, 200, 300, 500].map((preset) => {
                                const isSelected = copies === preset;
                                return (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => {
                                      setQuantity(previewProduct.id, preset);
                                      clearFieldError("copies");
                                    }}
                                    className={`py-2.5 px-1 rounded-2xl font-bold text-center transition-all border cursor-pointer flex flex-col items-center justify-center ${
                                      isSelected
                                        ? "bg-[#991B1B] text-white border-[#991B1B] shadow-md scale-102"
                                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-[#991B1B]"
                                    }`}
                                  >
                                    <span className="text-sm font-black">{preset}</span>
                                    <span className={`text-[10px] ${isSelected ? "text-red-100" : "text-[#991B1B] font-extrabold"}`}>
                                      ₹{previewProduct.pricePerCard}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Live Active Tier & Calculation Card */}
                        {!isGift ? (
                          <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-200 space-y-2.5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                              <span className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                                <Zap className="w-4 h-4 text-amber-600" />
                                <span>Volume Tier Rate: {priceCalc.tierLabel}</span>
                              </span>
                              <span className="text-[11px] font-mono font-bold text-amber-900 bg-white px-2.5 py-0.5 rounded-lg border border-amber-300">
                                Base: ₹{previewProduct.pricePerCard}/card (1000+)
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div className="bg-white p-3 rounded-xl border border-amber-200/80">
                                <span className="text-[10px] font-bold text-slate-500 block uppercase">Price Per Card</span>
                                <div className="flex items-baseline gap-2 mt-0.5">
                                  <span className="text-2xl font-extrabold text-[#991B1B]">₹{effectiveUnitPrice}</span>
                                  <span className="text-xs text-slate-500 font-normal">/ card</span>
                                  {priceCalc.markupPercent > 0 ? (
                                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                                      +{priceCalc.markupPercent}% Tier
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                                      Base Rate
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded-xl border border-amber-200/80 flex flex-col justify-between">
                                <span className="text-[10px] font-bold text-slate-500 block uppercase">
                                  Estimated Total ({copies} Cards)
                                </span>
                                <span className="text-2xl font-black text-slate-900 mt-0.5">₹{totalPrice}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-200 flex items-center justify-between font-bold text-amber-950">
                            <div>
                              <span className="text-[10px] text-slate-500 block uppercase">Estimated Subtotal ({copies} Pieces)</span>
                              <span className="text-2xl font-black text-[#991B1B]">₹{totalPrice}</span>
                            </div>
                            <span className="text-xs bg-white px-3 py-1.5 rounded-xl border border-amber-300 font-extrabold text-slate-800">
                              ₹{previewProduct.pricePerCard} / piece
                            </span>
                          </div>
                        )}

                        {/* Paper & Specs Info */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span>{isGift ? "🎁" : "📄"}</span>
                              <span>{previewProduct.paperType}</span>
                            </span>
                            <span className="text-[11px] text-slate-500 block">Dimensions: {previewProduct.dimensions}</span>
                          </div>
                          <span className="text-[10.5px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                            Premium Board
                          </span>
                        </div>
                      </div>

                      {/* Step 1 Continue Button */}
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (validateStep(1)) {
                              setFormErrors({});
                              setActiveStep(2);
                            }
                          }}
                          className="py-3 px-6 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-102"
                        >
                          <span>{isGift ? "Continue to Gift Tag Details" : "Continue to Couple & Parents"}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ════════════════════════════════════════════════════════════
                      STEP 2: COUPLE & PARENTS (Cards) / GIFT TAG DETAILS (Gifts)
                      ════════════════════════════════════════════════════════════ */}
                  {activeStep === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {isGift ? (
                        /* Return Gifts Personalized Tag Box */
                        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-red-100 space-y-3.5 shadow-xs">
                          <div className="flex items-center gap-1.5 text-[#991B1B] font-extrabold text-xs border-b border-red-100 pb-2">
                            <span>🏷️</span>
                            <span>Custom Gift Tag Details</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className={formErrors.couple ? "has-validation-error" : ""}>
                              <label className="font-bold text-slate-900 block mb-1">
                                Couple / Celebrant / Family Name <span className="text-[#991B1B]">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={printForm.brideName || printForm.groomName}
                                onChange={(e) => {
                                  setPrintForm({ ...printForm, brideName: e.target.value, groomName: "" });
                                  clearFieldError("couple");
                                }}
                                placeholder="e.g. Rahul & Priya / The Sharma Family"
                                className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                                  formErrors.couple
                                    ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                                    : "border-slate-200 bg-white focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B]"
                                }`}
                              />
                              {formErrors.couple && (
                                <p className="text-rose-600 text-[10.5px] font-bold mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>{formErrors.couple}</span>
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="font-bold text-slate-900 block mb-1">
                                Event Occasion &amp; Date
                              </label>
                              <input
                                type="text"
                                value={printForm.eventDate}
                                onChange={(e) => setPrintForm({ ...printForm, eventDate: e.target.value })}
                                placeholder="e.g. Wedding Celebration • 24th Nov 2026"
                                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="font-bold text-slate-900 block mb-1">
                              Thank You Message on Gift Tag <span className="text-[10px] text-slate-400">(Optional)</span>
                            </label>
                            <textarea
                              rows={2}
                              value={printForm.specialInstructions}
                              onChange={(e) => setPrintForm({ ...printForm, specialInstructions: e.target.value })}
                              placeholder="e.g. With Best Compliments from the Family. Thank you for blessing us!"
                              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B]"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Card Printing Language & Mode Selector */}
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              {/* Language Dropdown (English on Top) */}
                              <div className="flex-1 max-w-sm">
                                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                                  <Languages className="w-4 h-4 text-[#991B1B]" />
                                  <span>Card Printing Language</span>
                                </label>
                                <div className="relative">
                                  <select
                                    value={printForm.cardLanguage}
                                    onChange={(e) =>
                                      setPrintForm((prev) => ({
                                        ...prev,
                                        cardLanguage: e.target.value,
                                      }))
                                    }
                                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#991B1B]/15 focus:border-[#991B1B] transition-all cursor-pointer appearance-none pr-9"
                                  >
                                    {SUPPORTED_LANGUAGES.map((lang) => (
                                      <option key={lang.code} value={lang.code}>
                                        {lang.name} {lang.code !== "en" ? `(${lang.nativeName})` : "(Default)"}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                    <ChevronDown className="w-4 h-4" />
                                  </div>
                                </div>
                              </div>

                              {/* Format Switcher (Shown only when a Regional Language is selected) */}
                              {printForm.cardLanguage !== "en" && (
                                <div className="space-y-1 self-start sm:self-end">
                                  <span className="block text-[11px] font-bold text-slate-600">
                                    Language Format
                                  </span>
                                  <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80">
                                    <button
                                      type="button"
                                      onClick={() => setPrintForm((prev) => ({ ...prev, languageMode: "DUAL" }))}
                                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                                        printForm.languageMode === "DUAL"
                                          ? "bg-white text-[#991B1B] shadow-xs font-extrabold"
                                          : "text-slate-600 hover:text-slate-900"
                                      }`}
                                    >
                                      Dual Language (Eng + {getLanguageByCode(printForm.cardLanguage).name})
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setPrintForm((prev) => ({ ...prev, languageMode: "REGIONAL_ONLY" }))}
                                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                                        printForm.languageMode === "REGIONAL_ONLY"
                                          ? "bg-[#991B1B] text-white shadow-xs font-extrabold"
                                          : "text-slate-600 hover:text-slate-900"
                                      }`}
                                    >
                                      {getLanguageByCode(printForm.cardLanguage).name} Only
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {printForm.cardLanguage !== "en" && (
                              <p className="text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/70 font-medium">
                                ✨ <strong>Multi-Language Active:</strong> Type in English below and it will automatically translate into {getLanguageByCode(printForm.cardLanguage).nativeName} script. You can edit the words directly if needed.
                              </p>
                            )}
                          </div>

                          {/* Bride Details Section */}
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-red-100 space-y-3.5 shadow-xs">
                            <div className="flex items-center gap-1.5 text-[#991B1B] font-extrabold text-xs border-b border-red-100 pb-2">
                              <span>👰</span>
                              <span>Bride&apos;s Information</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <IndicLanguageInput
                                label="Bride's Full Name"
                                required
                                englishValue={printForm.brideName || ""}
                                onEnglishChange={(val) => {
                                  setPrintForm((prev) => ({ ...prev, brideName: val }));
                                  clearFieldError("brideName");
                                }}
                                regionalValue={printForm.brideNameRegional || ""}
                                onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, brideNameRegional: val }))}
                                targetLanguage={printForm.cardLanguage}
                                languageMode={printForm.languageMode}
                                placeholderEnglish="e.g. Priya Sharma"
                                error={formErrors.brideName}
                              />

                              <IndicLanguageInput
                                label="Bride's Qualification / Degree"
                                englishValue={printForm.brideQualification || ""}
                                onEnglishChange={(val) => setPrintForm((prev) => ({ ...prev, brideQualification: val }))}
                                regionalValue={printForm.brideQualificationRegional || ""}
                                onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, brideQualificationRegional: val }))}
                                targetLanguage={printForm.cardLanguage}
                                languageMode={printForm.languageMode}
                                placeholderEnglish="e.g. B.Tech, MBA"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <IndicLanguageInput
                                label="Bride's Parents Names"
                                englishValue={printForm.brideParents || ""}
                                onEnglishChange={(val) => setPrintForm((prev) => ({ ...prev, brideParents: val }))}
                                regionalValue={printForm.brideParentsRegional || ""}
                                onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, brideParentsRegional: val }))}
                                targetLanguage={printForm.cardLanguage}
                                languageMode={printForm.languageMode}
                                placeholderEnglish="e.g. Mr. Rajesh Sharma & Mrs. Meena Sharma"
                              />

                              <IndicLanguageInput
                                label="Bride's Residence / House Address"
                                englishValue={printForm.brideAddress || ""}
                                onEnglishChange={(val) => setPrintForm((prev) => ({ ...prev, brideAddress: val }))}
                                regionalValue={printForm.brideAddressRegional || ""}
                                onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, brideAddressRegional: val }))}
                                targetLanguage={printForm.cardLanguage}
                                languageMode={printForm.languageMode}
                                placeholderEnglish="e.g. 45 Green Avenue, Gandhi Nagar, Chennai"
                                mode="translate"
                              />
                            </div>
                          </div>

                          {/* Groom Details Section */}
                          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-red-100 space-y-3.5 shadow-xs">
                            <div className="flex items-center gap-1.5 text-[#991B1B] font-extrabold text-xs border-b border-red-100 pb-2">
                              <span>🤵</span>
                              <span>Groom&apos;s Information</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <IndicLanguageInput
                                label="Groom's Full Name"
                                required
                                englishValue={printForm.groomName || ""}
                                onEnglishChange={(val) => {
                                  setPrintForm((prev) => ({ ...prev, groomName: val }));
                                  clearFieldError("groomName");
                                }}
                                regionalValue={printForm.groomNameRegional || ""}
                                onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, groomNameRegional: val }))}
                                targetLanguage={printForm.cardLanguage}
                                languageMode={printForm.languageMode}
                                placeholderEnglish="e.g. Rahul Verma"
                                error={formErrors.groomName}
                              />

                              <IndicLanguageInput
                                label="Groom's Qualification / Degree"
                                englishValue={printForm.groomQualification || ""}
                                onEnglishChange={(val) => setPrintForm((prev) => ({ ...prev, groomQualification: val }))}
                                regionalValue={printForm.groomQualificationRegional || ""}
                                onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, groomQualificationRegional: val }))}
                                targetLanguage={printForm.cardLanguage}
                                languageMode={printForm.languageMode}
                                placeholderEnglish="e.g. M.S., Software Architect"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              <IndicLanguageInput
                                label="Groom's Parents Names"
                                englishValue={printForm.groomParents || ""}
                                onEnglishChange={(val) => setPrintForm((prev) => ({ ...prev, groomParents: val }))}
                                regionalValue={printForm.groomParentsRegional || ""}
                                onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, groomParentsRegional: val }))}
                                targetLanguage={printForm.cardLanguage}
                                languageMode={printForm.languageMode}
                                placeholderEnglish="e.g. Mr. Vijay Verma & Mrs. Sunita Verma"
                              />

                              <IndicLanguageInput
                                label="Groom's Residence / House Address"
                                englishValue={printForm.groomAddress || ""}
                                onEnglishChange={(val) => setPrintForm((prev) => ({ ...prev, groomAddress: val }))}
                                regionalValue={printForm.groomAddressRegional || ""}
                                onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, groomAddressRegional: val }))}
                                targetLanguage={printForm.cardLanguage}
                                languageMode={printForm.languageMode}
                                placeholderEnglish="e.g. 18 Royal Heights, Bangalore"
                                mode="translate"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Step 2 Navigation Buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveStep(1)}
                          className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back to Copies &amp; Pricing</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (validateStep(2)) {
                              setFormErrors({});
                              setActiveStep(3);
                            }
                          }}
                          className="py-3 px-6 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                        >
                          <span>{isGift ? "Continue to Delivery & Order" : "Continue to Event & Venues"}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ════════════════════════════════════════════════════════════
                      STEP 3: EVENT & VENUES (Cards) / DELIVERY & ORDER (Gifts)
                      ════════════════════════════════════════════════════════════ */}
                  {activeStep === 3 && !isGift && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* Wedding Date & Timing with Date Picker & Time Selector */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-red-100 space-y-4 shadow-xs">
                        <div className="flex items-center justify-between border-b border-red-100 pb-2.5">
                          <div className="flex items-center gap-2 text-[#991B1B] font-extrabold text-xs">
                            <Calendar className="w-4 h-4" />
                            <span>Wedding Date &amp; Auspicious Timing</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">Select or Type Details</span>
                        </div>

                        {/* Date & Time Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Date Selection Box */}
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#991B1B]" />
                                <span>Wedding Date</span>
                                <span className="text-[#991B1B]">*</span>
                              </label>
                              <button
                                type="button"
                                onClick={openDatePicker}
                                className="text-[11px] font-bold text-[#991B1B] hover:text-white hover:bg-[#991B1B] flex items-center gap-1 cursor-pointer bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 transition-all shadow-2xs"
                              >
                                <Calendar className="w-3 h-3" />
                                <span>Choose Calendar Date</span>
                              </button>
                            </div>

                            {/* Direct Native Date Picker Bar */}
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200">
                              <span className="text-[11px] text-slate-500 font-semibold shrink-0">Calendar Picker:</span>
                              <input
                                ref={datePickerRef}
                                type="date"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val) {
                                    const eng = formatEnglishDate(val);
                                    const reg = formatRegionalDate(val, printForm.cardLanguage);
                                    setPrintForm((prev) => ({
                                      ...prev,
                                      eventDate: eng,
                                      eventDateRegional: reg,
                                    }));
                                    clearFieldError("eventDate");
                                  }
                                }}
                                className="w-full text-xs bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B] cursor-pointer"
                              />
                            </div>

                            <IndicLanguageInput
                              label="Wedding / Event Date (Wording on Card)"
                              required
                              englishValue={printForm.eventDate || ""}
                              onEnglishChange={(val) => {
                                setPrintForm((prev) => ({ ...prev, eventDate: val }));
                                clearFieldError("eventDate");
                              }}
                              regionalValue={printForm.eventDateRegional || ""}
                              onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, eventDateRegional: val }))}
                              targetLanguage={printForm.cardLanguage}
                              languageMode={printForm.languageMode}
                              placeholderEnglish="e.g. Sunday, 24 November 2026"
                              mode="translate"
                              error={formErrors.eventDate}
                            />
                          </div>

                          {/* Time Selection Box */}
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#991B1B]" />
                                <span>Muhurtham / Timing</span>
                              </label>
                              <button
                                type="button"
                                onClick={openTimePicker}
                                className="text-[11px] font-bold text-[#991B1B] hover:text-white hover:bg-[#991B1B] flex items-center gap-1 cursor-pointer bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 transition-all shadow-2xs"
                              >
                                <Clock className="w-3 h-3" />
                                <span>Set Clock Time</span>
                              </button>
                            </div>

                            {/* Direct Native Time Picker Bar */}
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200">
                              <span className="text-[11px] text-slate-500 font-semibold shrink-0">Time Picker:</span>
                              <input
                                ref={timePickerRef}
                                type="time"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val) {
                                    const eng = format12HourTime(val);
                                    const reg = formatRegionalTime(val, printForm.cardLanguage);
                                    setPrintForm((prev) => ({
                                      ...prev,
                                      eventTime: eng,
                                      eventTimeRegional: reg,
                                    }));
                                  }
                                }}
                                className="w-full text-xs bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#991B1B] cursor-pointer"
                              />
                            </div>

                            {/* Quick Auspicious Timing Presets */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 block">Quick Auspicious Slots:</span>
                              <div className="flex flex-wrap gap-1">
                                {[
                                  { label: "🌅 Morning 9:00 AM", time: "09:00 AM" },
                                  { label: "✨ Muhurtham 6:00 AM", time: "06:00 AM" },
                                  { label: "🌆 Evening 7:00 PM", time: "07:00 PM onwards" },
                                  { label: "☀️ Lunch 12:00 PM", time: "12:00 PM" },
                                ].map((preset, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => {
                                      const reg = formatRegionalTime(preset.time, printForm.cardLanguage);
                                      setPrintForm((prev) => ({
                                        ...prev,
                                        eventTime: preset.time,
                                        eventTimeRegional: reg,
                                      }));
                                    }}
                                    className="text-[10.5px] font-semibold px-2 py-1 rounded-md bg-stone-100 hover:bg-red-50 hover:text-[#991B1B] hover:border-red-200 border border-stone-200 text-slate-700 transition-all cursor-pointer"
                                  >
                                    {preset.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <IndicLanguageInput
                              label="Muhurtham / Function Timing (Wording on Card)"
                              englishValue={printForm.eventTime || ""}
                              onEnglishChange={(val) => setPrintForm((prev) => ({ ...prev, eventTime: val }))}
                              regionalValue={printForm.eventTimeRegional || ""}
                              onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, eventTimeRegional: val }))}
                              targetLanguage={printForm.cardLanguage}
                              languageMode={printForm.languageMode}
                              placeholderEnglish="e.g. Muhurtham: 9:00 AM | Reception: 7:00 PM"
                              mode="translate"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Multiple Venue Locations */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-red-100 space-y-3.5 shadow-xs">
                        <div className="flex items-center justify-between border-b border-red-100 pb-2">
                          <div className="flex items-center gap-1.5 text-[#991B1B] font-extrabold text-xs">
                            <span>🏛️</span>
                            <span>Venue &amp; Function Locations</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddVenue}
                            className="text-[11px] text-[#991B1B] hover:text-white font-bold flex items-center gap-1 bg-red-50 px-3 py-1 rounded-lg border border-red-200 cursor-pointer shadow-2xs hover:bg-[#991B1B] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Another Venue</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {printForm.venues.map((venue, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-red-50/30 border border-red-100 space-y-3 relative"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-extrabold text-[#991B1B]">
                                  Location #{idx + 1}
                                </span>
                                {printForm.venues.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveVenue(idx)}
                                    className="text-rose-600 hover:text-rose-800 p-1 rounded-md hover:bg-rose-100 transition-colors cursor-pointer"
                                    title="Remove this venue"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <IndicLanguageInput
                                  label="Function Name"
                                  englishValue={venue.functionType || ""}
                                  onEnglishChange={(val) => handleVenueChange(idx, "functionType", val)}
                                  regionalValue={venue.functionTypeRegional || ""}
                                  onRegionalChange={(val) => handleVenueChange(idx, "functionTypeRegional", val)}
                                  targetLanguage={printForm.cardLanguage}
                                  languageMode={printForm.languageMode}
                                  placeholderEnglish="e.g. Muhurtham / Reception"
                                  mode="translate"
                                />

                                <IndicLanguageInput
                                  label="Hall / Hotel Name"
                                  required
                                  englishValue={venue.name || ""}
                                  onEnglishChange={(val) => {
                                    handleVenueChange(idx, "name", val);
                                    clearFieldError("venue");
                                  }}
                                  regionalValue={venue.nameRegional || ""}
                                  onRegionalChange={(val) => handleVenueChange(idx, "nameRegional", val)}
                                  targetLanguage={printForm.cardLanguage}
                                  languageMode={printForm.languageMode}
                                  placeholderEnglish="e.g. Grand Palace Hall"
                                  mode="transliterate"
                                />

                                <IndicLanguageInput
                                  label="Address & Landmark"
                                  englishValue={venue.address || ""}
                                  onEnglishChange={(val) => handleVenueChange(idx, "address", val)}
                                  regionalValue={venue.addressRegional || ""}
                                  onRegionalChange={(val) => handleVenueChange(idx, "addressRegional", val)}
                                  targetLanguage={printForm.cardLanguage}
                                  languageMode={printForm.languageMode}
                                  placeholderEnglish="e.g. Anna Salai, Chennai"
                                  mode="translate"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {formErrors.venue && (
                          <p className="text-rose-600 text-[10.5px] font-bold flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{formErrors.venue}</span>
                          </p>
                        )}
                      </div>

                      {/* Step 3 Navigation Buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveStep(2)}
                          className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back to Couple Info</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (validateStep(3)) {
                              setFormErrors({});
                              setActiveStep(4);
                            }
                          }}
                          className="py-3 px-6 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                        >
                          <span>Continue to Delivery &amp; Order</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ════════════════════════════════════════════════════════════
                      STEP 4: DELIVERY ADDRESS, RSVP & ORDER (Step 4 for Cards, Step 3 for Gifts)
                      ════════════════════════════════════════════════════════════ */}
                  {((!isGift && activeStep === 4) || (isGift && activeStep === 3)) && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {!isGift && (
                        /* RSVP Contact */
                        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-red-100 space-y-2 shadow-xs">
                          <IndicLanguageInput
                            label="📞 RSVP Names & Contact Phone Numbers"
                            englishValue={printForm.rsvpContact || ""}
                            onEnglishChange={(val) => setPrintForm((prev) => ({ ...prev, rsvpContact: val }))}
                            regionalValue={printForm.rsvpContactRegional || ""}
                            onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, rsvpContactRegional: val }))}
                            targetLanguage={printForm.cardLanguage}
                            languageMode={printForm.languageMode}
                            placeholderEnglish="e.g. Sharma Family: +91 98765 43210"
                            mode="transliterate"
                          />
                        </div>
                      )}

                      {/* Delivery & Shipping Address */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-red-100 space-y-3.5 shadow-xs">
                        <div className="flex items-center gap-1.5 text-[#991B1B] font-extrabold text-xs border-b border-red-100 pb-2">
                          <span>📦</span>
                          <span>Delivery &amp; Shipping Address</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className={formErrors.deliveryName ? "has-validation-error" : ""}>
                            <label className="font-bold text-slate-900 block mb-1 text-[11px]">
                              Recipient / Contact Name <span className="text-[#991B1B]">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={printForm.deliveryName}
                              onChange={(e) => {
                                setPrintForm({ ...printForm, deliveryName: e.target.value });
                                clearFieldError("deliveryName");
                              }}
                              placeholder="e.g. Priya Sharma"
                              className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                                formErrors.deliveryName
                                  ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                                  : "border-slate-200 bg-white focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B]"
                              }`}
                            />
                            {formErrors.deliveryName && (
                              <p className="text-rose-600 text-[10.5px] font-bold mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{formErrors.deliveryName}</span>
                              </p>
                            )}
                          </div>

                          <div className={formErrors.deliveryPhone ? "has-validation-error" : ""}>
                            <label className="font-bold text-slate-900 block mb-1 text-[11px]">
                              WhatsApp Contact Phone <span className="text-[#991B1B]">*</span>
                            </label>
                            <input
                              type="tel"
                              required
                              value={printForm.deliveryPhone}
                              onChange={(e) => {
                                setPrintForm({ ...printForm, deliveryPhone: e.target.value });
                                clearFieldError("deliveryPhone");
                              }}
                              placeholder="e.g. +91 98765 43210"
                              className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                                formErrors.deliveryPhone
                                  ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                                  : "border-slate-200 bg-white focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B]"
                              }`}
                            />
                            {formErrors.deliveryPhone && (
                              <p className="text-rose-600 text-[10.5px] font-bold mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{formErrors.deliveryPhone}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className={formErrors.deliveryAddress ? "has-validation-error" : ""}>
                          <label className="font-bold text-slate-900 block mb-1 text-[11px]">
                            Complete Shipping Address <span className="text-[#991B1B]">*</span>
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={printForm.deliveryAddress}
                            onChange={(e) => {
                              setPrintForm({ ...printForm, deliveryAddress: e.target.value });
                              clearFieldError("deliveryAddress");
                            }}
                            placeholder="e.g. Flat 402, Royal Palms, Indiranagar"
                            className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 focus:outline-none transition-colors ${
                              formErrors.deliveryAddress
                                ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                                : "border-slate-200 bg-white focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B]"
                            }`}
                          />
                          {formErrors.deliveryAddress && (
                            <p className="text-rose-600 text-[10.5px] font-bold mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{formErrors.deliveryAddress}</span>
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className={formErrors.deliveryCity ? "has-validation-error" : ""}>
                            <label className="font-bold text-slate-900 block mb-1 text-[11px]">
                              City / District / State <span className="text-[#991B1B]">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={printForm.deliveryCity}
                              onChange={(e) => {
                                setPrintForm({ ...printForm, deliveryCity: e.target.value });
                                clearFieldError("deliveryCity");
                              }}
                              placeholder="e.g. Bangalore, Karnataka"
                              className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                                formErrors.deliveryCity
                                  ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                                  : "border-slate-200 bg-white focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B]"
                              }`}
                            />
                            {formErrors.deliveryCity && (
                              <p className="text-rose-600 text-[10.5px] font-bold mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{formErrors.deliveryCity}</span>
                              </p>
                            )}
                          </div>

                          <div className={formErrors.deliveryPincode ? "has-validation-error" : ""}>
                            <label className="font-bold text-slate-900 block mb-1 text-[11px]">
                              Pincode / Postal Code <span className="text-[#991B1B]">*</span>
                            </label>
                            <input
                              type="text"
                              maxLength={6}
                              required
                              value={printForm.deliveryPincode}
                              onChange={(e) => {
                                setPrintForm({ ...printForm, deliveryPincode: e.target.value });
                                clearFieldError("deliveryPincode");
                              }}
                              placeholder="e.g. 560038"
                              className={`w-full p-2.5 rounded-xl border text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                                formErrors.deliveryPincode
                                  ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 text-rose-900"
                                  : "border-slate-200 bg-white focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B]"
                              }`}
                            />
                            {formErrors.deliveryPincode && (
                              <p className="text-rose-600 text-[10.5px] font-bold mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{formErrors.deliveryPincode}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Special Instructions / Religion Symbol */}
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-red-100 space-y-2 shadow-xs">
                        <IndicLanguageInput
                          label="✨ Special Notes / Religious Symbols / Custom Proof Notes (Optional)"
                          multiline={true}
                          mode="translate"
                          englishValue={printForm.specialInstructions || ""}
                          onEnglishChange={(val) => setPrintForm((prev) => ({ ...prev, specialInstructions: val }))}
                          regionalValue={printForm.specialInstructionsRegional || ""}
                          onRegionalChange={(val) => setPrintForm((prev) => ({ ...prev, specialInstructionsRegional: val }))}
                          targetLanguage={printForm.cardLanguage}
                          languageMode={printForm.languageMode}
                          placeholderEnglish="e.g. Include Lord Ganesha symbol at top, Vegetarian Dinner note, Custom traditional quote..."
                        />
                      </div>

                      {/* Order Summary Box */}
                      <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#991B1B] block">
                          Order Summary Review
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Print Run:</span>
                            <strong className="text-slate-900">{copies} {isGift ? "Pieces" : "Cards"}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Estimated Subtotal:</span>
                            <strong className="text-[#991B1B] font-extrabold text-sm block">
                              ₹{totalPrice}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Paper Finish:</span>
                            <strong className="text-slate-900 truncate block">{previewProduct.paperType}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">{isGift ? "Couple/Family:" : "Celebrants:"}</span>
                            <strong className="text-slate-900 truncate block">
                              {printForm.brideName || printForm.groomName ? `${printForm.brideName} & ${printForm.groomName}` : "Not specified"}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Final Stepper Action Buttons */}
                      <div className="pt-3 border-t border-red-100 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveStep(isGift ? 2 : 3)}
                            className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDirectOrder(previewProduct, copies)}
                            disabled={isOrdering || isAdding}
                            className="flex-1 py-3.5 px-5 rounded-xl bg-[#991B1B] text-white hover:bg-[#7F1D1D] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-70"
                          >
                            {isOrdering ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Zap className="w-4 h-4 text-amber-300" />
                            )}
                            <span>Direct Order &amp; Pay (₹{totalPrice})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(previewProduct, copies)}
                            disabled={isOrdering || isAdding}
                            className="flex-1 py-3.5 px-5 rounded-xl bg-white hover:bg-red-50 text-[#991B1B] border-2 border-[#991B1B] text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-70"
                          >
                            {isAdding ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#991B1B]" />
                            ) : (
                              <ShoppingBag className="w-4 h-4 text-[#991B1B]" />
                            )}
                            <span>Add to Cart</span>
                          </button>
                        </div>

                        <p className="text-[11px] text-center text-slate-500 font-medium">
                          ⚡ Our designers will prepare a digital print proof and share on WhatsApp before production
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCartChange={() => window.dispatchEvent(new Event("cartUpdated"))}
      />
    </div>
  );
}
