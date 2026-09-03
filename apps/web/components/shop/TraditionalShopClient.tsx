"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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

export interface DynamicShopCategory {
  id: string;
  name: string;
  icon?: string;
  type: string;
  sortOrder: number;
  label: string;
}



export default function TraditionalShopClient() {
  const { data: session } = useSession();
  const router = useRouter();

  const [mainTab, setMainTab] = useState<"invitations" | "return_gifts">("invitations");
  const [dbCategories, setDbCategories] = useState<DynamicShopCategory[]>([]);
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

  // Redirect if someone arrived at /shop?product=prod_...
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get("product");
      if (prodId) {
        router.replace(`/shop/${prodId}`);
      }
    }
  }, [router]);

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

  // Fetch dynamic categories from database
  useEffect(() => {
    async function loadShopCategories() {
      try {
        const res = await fetch("/api/shop/categories");
        const data = await res.json();
        if (res.ok && Array.isArray(data.categories)) {
          setDbCategories(data.categories);
        }
      } catch (err) {
        console.warn("Error fetching dynamic categories:", err);
      }
    }
    loadShopCategories();
  }, []);

  const currentTypeCategories = dbCategories.filter((c) => c.type === mainTab);

  const activeCategories = [
    {
      id: "all",
      label: mainTab === "invitations" ? "All Invitation Cards" : "All Return Gifts",
    },
    ...currentTypeCategories,
  ];

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
    const priceCalc = calculateTieredCardPrice(product.pricePerCard, copies, isGift, (product as any).pricingTiersJson);
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
    const priceCalc = calculateTieredCardPrice(product.pricePerCard, copies, isGift, (product as any).pricingTiersJson);
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
                    <Link
                      key={product.id}
                      href={`/shop/${product.id}`}
                      className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-[#991B1B] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
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
                            <span>Customize &amp; Order</span>
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
                        <div className="w-full py-1.5 sm:py-2 px-2 rounded-lg sm:rounded-xl bg-red-50 hover:bg-[#991B1B] text-[#991B1B] hover:text-white border border-red-200 text-[10px] sm:text-xs font-extrabold flex items-center justify-center gap-1 transition-all shadow-2xs group-hover:bg-[#991B1B] group-hover:text-white">
                          <ShoppingBag className="w-3 h-3 text-amber-500 group-hover:text-amber-300" />
                          <span>Customize &amp; Order</span>
                        </div>
                      </div>
                    </Link>
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

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCartChange={() => window.dispatchEvent(new Event("cartUpdated"))}
      />
    </div>
  );
}
