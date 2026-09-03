"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  X,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Clock,
  Maximize2,
  CheckCircle2,
  Share2,
  Upload,
  FileText,
  Tag,
  ChevronDown,
  MapPin,
  Lock,
  LogIn,
  Edit3,
} from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";
import IndicLanguageInput from "@/components/shop/IndicLanguageInput";
import { calculateShippingByPincode } from "@/lib/shipping/distance";
import {
  SUPPORTED_LANGUAGES,
  getLanguageByCode,
  formatEnglishDate,
  formatRegionalDate,
  format12HourTime,
  formatRegionalTime,
} from "@/lib/indicTranslation";
import { calculateTieredCardPrice, calculatePrintingChangeFee, extractPrintingChangeConfig } from "@/lib/pricing";
import { ShopProductItem } from "./TraditionalShopClient";

interface ShopProductDetailClientProps {
  product: ShopProductItem;
  relatedProducts?: ShopProductItem[];
}

export default function ShopProductDetailClient({
  product,
  relatedProducts = [],
}: ShopProductDetailClientProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const isGift =
    product.category === "return_gifts" ||
    ["brass", "hampers", "silver", "bags", "candles"].includes(product.category);

  // Gallery image setup
  let galleryList: string[] = [];
  try {
    if (product.galleryImages) {
      const parsed =
        typeof product.galleryImages === "string"
          ? JSON.parse(product.galleryImages)
          : product.galleryImages;
      if (Array.isArray(parsed)) galleryList = parsed.filter(Boolean);
    }
  } catch {
    galleryList = [];
  }
  const allImages = Array.from(new Set([product.previewImage, ...galleryList].filter(Boolean)));

  const [activeImage, setActiveImage] = useState<string>(product.previewImage);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const minOrderCopies = Math.max(isGift ? 1 : 50, Number(product.minCopies) || (isGift ? 25 : 50));
  const [selectedCopies, setSelectedCopies] = useState<number>(() =>
    Math.max(minOrderCopies, isGift ? product.minCopies || 25 : product.minCopies || 100)
  );

  const availablePresets = useMemo(() => {
    const base = isGift
      ? [25, 50, 75, 100, 150, 200, 250, 300, 500, 750, 1000]
      : [50, 80, 100, 150, 200, 250, 300, 400, 500, 600, 750, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000];
    const filtered = base.filter((q) => q >= minOrderCopies);
    if (!filtered.includes(minOrderCopies)) {
      filtered.unshift(minOrderCopies);
      filtered.sort((a, b) => a - b);
    }
    return filtered;
  }, [isGift, minOrderCopies]);

  const quickButtonPresets = useMemo(() => {
    return availablePresets.slice(0, 8);
  }, [availablePresets]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [autoFetched, setAutoFetched] = useState(false);
  const [contentMethod, setContentMethod] = useState<"UPLOAD" | "FORM">("UPLOAD");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [centerTab, setCenterTab] = useState<"SPECS" | "STEPS">("SPECS");
  const [showMobileMore, setShowMobileMore] = useState(false);
  const [onlineFormStep, setOnlineFormStep] = useState<1 | 2 | 3>(1);
  const stepFormRef = useRef<HTMLDivElement>(null);

  const handleFormFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target", "invitation_forms");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setUploadedFileUrl(data.url);
        setUploadedFileName(file.name);
        setToastMessage(`✓ "${file.name}" uploaded successfully!`);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setUploadedFileName(file.name);
        setUploadedFileUrl(`LOCAL_FILE:${file.name}`);
        setToastMessage(`✓ "${file.name}" attached to order`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch {
      setUploadedFileName(file.name);
      setUploadedFileUrl(`LOCAL_FILE:${file.name}`);
      setToastMessage(`✓ "${file.name}" attached to order`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const currentIndex = allImages.indexOf(activeImage);
  const handlePrevImage = () => {
    if (allImages.length <= 1) return;
    const nextIdx = (currentIndex - 1 + allImages.length) % allImages.length;
    setActiveImage(allImages[nextIdx]);
  };
  const handleNextImage = () => {
    if (allImages.length <= 1) return;
    const nextIdx = (currentIndex + 1) % allImages.length;
    setActiveImage(allImages[nextIdx]);
  };

  const datePickerRef = useRef<HTMLInputElement>(null);
  const timePickerRef = useRef<HTMLInputElement>(null);

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

  const priceCalc = calculateTieredCardPrice(product.pricePerCard, selectedCopies, isGift, (product as any).pricingTiersJson);
  const effectiveUnitPrice = priceCalc.unitPrice;
  const totalPrice = priceCalc.totalPrice;

  // Printing Change / Version Changes Configuration & State
  const printingChangeConfig = useMemo(() => {
    return extractPrintingChangeConfig((product as any)?.pricingTiersJson);
  }, [product]);

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
      title: "Version 2 (e.g. Bride Side / Reception / Regional Language)",
      copies: Math.min(100, Math.max(25, Math.floor(selectedCopies / 2))),
      details: "",
    },
  ]);

  const printingChargeResult = useMemo(() => {
    if (isGift || !printingChangeConfig.enabled) {
      return { fee: 0, breakdownText: "" };
    }
    return calculatePrintingChangeFee(selectedCopies, printingChangeConfig);
  }, [isGift, printingChangeConfig, selectedCopies]);

  const totalPrintingChangeFee = printingChargeResult.fee;

  // Customization Form State
  const [printForm, setPrintForm] = useState({
    cardLanguage: "en",
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

    deliveryName: "",
    deliveryPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPincode: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Saved addresses state (strictly genuine user data, no mock data)
  interface UserSavedAddress {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state?: string | null;
    pincode: string;
    isDefault: boolean;
  }

  const [savedAddresses, setSavedAddresses] = useState<UserSavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [isAddingAddressInModal, setIsAddingAddressInModal] = useState<boolean>(false);
  const [newAddressForm, setNewAddressForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
  const [isSavingAddress, setIsSavingAddress] = useState<boolean>(false);

  // Delivery date strictly 8 days from today as requested by user
  const deliveryDateText = useMemo(() => {
    return new Date(Date.now() + 8 * 86400000).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, []);

  // Whether a genuine delivery address is selected
  const hasSelectedAddress = Boolean(
    printForm.deliveryAddress.trim() &&
    printForm.deliveryCity.trim() &&
    printForm.deliveryPincode.trim()
  );

  // Real-time silent distance-based shipping fee calculation from Kanyakumari
  const shippingInfo = useMemo(() => {
    return calculateShippingByPincode(printForm.deliveryPincode);
  }, [printForm.deliveryPincode]);

  const shippingFee = hasSelectedAddress ? shippingInfo.shippingFee : 0;
  const orderFinalTotal = totalPrice + totalPrintingChangeFee + shippingFee;

  // Fetch genuine saved addresses from user's account
  const fetchSavedAddresses = useCallback(async () => {
    if (!session?.user) return;
    setIsLoadingAddresses(true);
    try {
      const res = await fetch("/api/user/addresses");
      if (res.ok) {
        const data = await res.json();
        const addrs: UserSavedAddress[] = data.addresses || [];
        setSavedAddresses(addrs);
        if (addrs.length > 0) {
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          setSelectedAddressId(defaultAddr.id);
          setPrintForm((prev) => ({
            ...prev,
            deliveryName: defaultAddr.name,
            deliveryPhone: defaultAddr.phone,
            deliveryAddress: defaultAddr.address,
            deliveryCity: defaultAddr.city,
            deliveryPincode: defaultAddr.pincode,
          }));
          setIsAddingNewAddress(false);
        } else {
          setSelectedAddressId(null);
          setPrintForm((prev) => ({
            ...prev,
            deliveryName: "",
            deliveryPhone: "",
            deliveryAddress: "",
            deliveryCity: "",
            deliveryPincode: "",
          }));
          setIsAddingNewAddress(false);
          const userPhone = session.user && "phone" in session.user ? String((session.user as { phone?: string }).phone || "") : "";
          setNewAddressForm((prev) => ({
            ...prev,
            name: session.user?.name || "",
            phone: userPhone,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load user addresses:", err);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [session?.user]);

  useEffect(() => {
    if (session?.user) {
      fetchSavedAddresses();
    }
  }, [session?.user, fetchSavedAddresses]);

  const handleSelectAddress = (addr: UserSavedAddress) => {
    setSelectedAddressId(addr.id);
    setPrintForm((prev) => ({
      ...prev,
      deliveryName: addr.name,
      deliveryPhone: addr.phone,
      deliveryAddress: addr.address,
      deliveryCity: addr.city,
      deliveryPincode: addr.pincode,
    }));
    setIsAddingNewAddress(false);
    setIsAddingAddressInModal(false);
    setIsAddressModalOpen(false);
  };

  const handleSaveNewAddress = async () => {
    if (!session?.user) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/shop/${product.id}`)}`);
      return;
    }

    if (!newAddressForm.name.trim() || newAddressForm.name.trim().length < 2) {
      setToastMessage("Please enter a valid recipient full name.");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    const cleanPhone = newAddressForm.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setToastMessage("Please enter a valid 10-digit WhatsApp phone number.");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    if (!newAddressForm.address.trim() || newAddressForm.address.trim().length < 5) {
      setToastMessage("Please enter your complete street address & house number.");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    if (!newAddressForm.city.trim() || newAddressForm.city.trim().length < 2) {
      setToastMessage("Please enter your city / town / district.");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    const cleanPin = newAddressForm.pincode.replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      setToastMessage("Please enter a valid 6-digit postal PIN code.");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    setIsSavingAddress(true);
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddressForm),
      });
      const data = await res.json();
      if (res.ok && data.success && data.address) {
        const created: UserSavedAddress = data.address;
        setSavedAddresses((prev) => [
          created,
          ...prev.map((a) => (created.isDefault ? { ...a, isDefault: false } : a)),
        ]);
        handleSelectAddress(created);
        setIsAddingNewAddress(false);
        setToastMessage("✓ Address saved to your account!");
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        setToastMessage(data.error || "Failed to save address.");
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch {
      setToastMessage("Network error while saving address.");
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Remove this address from your saved delivery addresses?")) return;
    try {
      const res = await fetch(`/api/user/addresses?id=${addressId}`, { method: "DELETE" });
      if (res.ok) {
        setSavedAddresses((prev) => {
          const next = prev.filter((a) => a.id !== addressId);
          if (selectedAddressId === addressId) {
            if (next.length > 0) {
              handleSelectAddress(next[0]);
            } else {
              setSelectedAddressId(null);
              setIsAddingNewAddress(true);
            }
          }
          return next;
        });
        setToastMessage("Address removed from account.");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch {}
  };

  // Autofill from user draft profile
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

          let venuesList =
            prev.venues && prev.venues.length > 0 && prev.venues[0].name ? prev.venues : [];
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
              venuesList = [
                { name: "", address: "", functionType: "Wedding & Reception", time: "" },
              ];
            }
          }

          const defaultAddress =
            prev.deliveryAddress ||
            prev.brideAddress ||
            prev.groomAddress ||
            (venuesList[0]?.address || "");

          return {
            ...prev,
            brideName: bride,
            groomName: groom,
            eventDate: date,
            eventTime: time,
            venues: venuesList,
            rsvpContact: prev.rsvpContact || d.contactPhone || "",
            deliveryName: prev.deliveryName || session.user?.name || bride || groom || "",
            deliveryPhone: prev.deliveryPhone || d.contactPhone || "",
            deliveryAddress: defaultAddress,
          };
        });
        setAutoFetched(true);
      }
    } catch {
      // Graceful fallback if draft is empty
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      autoFetchEventDetails();
    }
  }, [session, autoFetchEventDetails]);

  // Venue helper functions
  const handleAddVenue = () => {
    setPrintForm((prev) => ({
      ...prev,
      venues: [
        ...prev.venues,
        {
          name: "",
          nameRegional: "",
          address: "",
          addressRegional: "",
          functionType: "Reception & Dinner",
          functionTypeRegional: "",
          time: "",
        },
      ],
    }));
  };

  const handleRemoveVenue = (index: number) => {
    if (printForm.venues.length <= 1) return;
    setPrintForm((prev) => ({
      ...prev,
      venues: prev.venues.filter((_, i) => i !== index),
    }));
  };

  const handleVenueChange = (index: number, field: string, value: string) => {
    setPrintForm((prev) => {
      const next = [...prev.venues];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, venues: next };
    });
  };

  const validateForm = (isDirectOrder: boolean): boolean => {
    const errors: Record<string, string> = {};

    if (selectedCopies < (isGift ? 25 : 50)) {
      errors.copies = `Minimum print run is ${isGift ? 25 : 50} ${isGift ? "pieces" : "copies"}.`;
    }

    if (contentMethod === "UPLOAD") {
      if (!uploadedFileName && !uploadedFileUrl && !printForm.specialInstructions.trim()) {
        errors.uploadedFile = "Please click to upload your invitation wording draft / form, or type your wording notes below.";
      }
    } else {
      if (!isGift) {
        if (!printForm.brideName.trim()) {
          errors.brideName = "Bride's full name is required for printing.";
        }
        if (!printForm.groomName.trim()) {
          errors.groomName = "Groom's full name is required for printing.";
        }
        if (!printForm.eventDate.trim()) {
          errors.eventDate = "Wedding / event date is required.";
        }
      } else {
        if (!printForm.brideName.trim() && !printForm.groomName.trim()) {
          errors.couple = "Please enter Couple / Celebrant or Family name for the gift tag.";
        }
      }
    }

    if (isDirectOrder) {
      const effectiveDeliveryName = (
        printForm.deliveryName ||
        session?.user?.name ||
        printForm.brideName ||
        printForm.groomName ||
        ""
      ).trim();

      if (!effectiveDeliveryName || effectiveDeliveryName.length < 2) {
        errors.deliveryName = "Please enter recipient / contact name for delivery.";
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
        errors.deliveryAddress = "Please enter complete delivery address.";
      }

      if (!printForm.deliveryCity.trim()) {
        errors.deliveryCity = "City / District / State is required.";
      }

      const pincodeDigits = printForm.deliveryPincode.replace(/\D/g, "");
      if (!printForm.deliveryPincode.trim()) {
        errors.deliveryPincode = "Postal pincode is required.";
      } else if (pincodeDigits.length !== 6) {
        errors.deliveryPincode = "Please enter a valid 6-digit postal pincode.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep = (stepNumber: number): boolean => {
    return validateForm(false);
  };

  const validateAllSteps = (isDirectOrder: boolean): boolean => {
    return validateForm(isDirectOrder);
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/shop/${product.id}`)}`);
      return;
    }

    if (selectedCopies < minOrderCopies) {
      setSelectedCopies(minOrderCopies);
      setToastMessage(`Minimum order quantity for this product is ${minOrderCopies} copies.`);
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    if (!validateAllSteps(false)) return;
    setFormErrors({});

    setIsAddingToCart(true);

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

      cardLanguage: printForm.cardLanguage,
      languageName: langObj.name,
      languageNativeName: langObj.nativeName,
      languageMode: printForm.languageMode,

      brideName: printForm.brideName.trim(),
      brideNameRegional: printForm.brideNameRegional.trim(),
      brideQualification: printForm.brideQualification.trim(),
      brideParents: printForm.brideParents.trim(),
      brideAddress: printForm.brideAddress.trim(),

      groomName: printForm.groomName.trim(),
      groomNameRegional: printForm.groomNameRegional.trim(),
      groomQualification: printForm.groomQualification.trim(),
      groomParents: printForm.groomParents.trim(),
      groomAddress: printForm.groomAddress.trim(),

      eventDate: printForm.eventDate.trim(),
      eventDateRegional: printForm.eventDateRegional.trim(),
      eventTime: printForm.eventTime.trim(),
      eventTimeRegional: printForm.eventTimeRegional.trim(),

      venues: validVenues,
      rsvpContact: printForm.rsvpContact.trim(),
      specialInstructions: printForm.specialInstructions.trim(),

      enablePrintingChange: totalPrintingChangeFee > 0,
      totalPrintingChangeFee,
      printingChargeFee: totalPrintingChangeFee,
      printingChargeBreakdown: printingChargeResult.breakdownText,

      contentMethod,
      uploadedFileUrl,
      uploadedFileName,

      deliveryAddress: printForm.deliveryAddress.trim(),
      deliveryPhone: printForm.deliveryPhone.trim(),
    };

    const customNotes = [
      contentMethod === "UPLOAD" && uploadedFileName
        ? `Uploaded Form: ${uploadedFileName}`
        : printForm.brideName || printForm.groomName
        ? `Couple: ${printForm.brideName} & ${printForm.groomName}`
        : "",
      printForm.eventDate ? `Date: ${printForm.eventDate} ${printForm.eventTime}` : "",
      totalPrintingChangeFee > 0
        ? `Printing Charge: +₹${totalPrintingChangeFee} (${printingChargeResult.breakdownText})`
        : "",
      printForm.specialInstructions ? `Notes: ${printForm.specialInstructions}` : "",
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
          copies: selectedCopies,
          price: totalPrice + totalPrintingChangeFee,
          customNotes,
          cardDetails,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        window.dispatchEvent(new Event("cartUpdated"));
        setToastMessage(`Added ${selectedCopies} copies of "${product.name}" to cart!`);
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
      setIsAddingToCart(false);
    }
  };

  // Direct Order
  const handleDirectOrder = async () => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/shop/${product.id}`)}`);
      return;
    }

    if (selectedCopies < minOrderCopies) {
      setSelectedCopies(minOrderCopies);
      setToastMessage(`Minimum order quantity for this product is ${minOrderCopies} copies.`);
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    if (!validateAllSteps(true)) return;
    setFormErrors({});

    setIsPlacingOrder(true);

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

      cardLanguage: printForm.cardLanguage,
      languageName: langObj.name,
      languageNativeName: langObj.nativeName,
      languageMode: printForm.languageMode,

      brideName: printForm.brideName.trim(),
      brideNameRegional: printForm.brideNameRegional.trim(),
      brideQualification: printForm.brideQualification.trim(),
      brideParents: printForm.brideParents.trim(),
      brideAddress: printForm.brideAddress.trim(),

      groomName: printForm.groomName.trim(),
      groomNameRegional: printForm.groomNameRegional.trim(),
      groomQualification: printForm.groomQualification.trim(),
      groomParents: printForm.groomParents.trim(),
      groomAddress: printForm.groomAddress.trim(),

      eventDate: printForm.eventDate.trim(),
      eventDateRegional: printForm.eventDateRegional.trim(),
      eventTime: printForm.eventTime.trim(),
      eventTimeRegional: printForm.eventTimeRegional.trim(),

      venues: validVenues,
      rsvpContact: printForm.rsvpContact.trim(),
      specialInstructions: printForm.specialInstructions.trim(),

      enablePrintingChange: totalPrintingChangeFee > 0,
      totalPrintingChangeFee,
      printingChargeFee: totalPrintingChangeFee,
      printingChargeBreakdown: printingChargeResult.breakdownText,

      contentMethod,
      uploadedFileUrl,
      uploadedFileName,

      deliveryAddress: effectiveAddress,
      deliveryPhone: effectivePhone,
      deliveryName: effectiveDeliveryName,
    };

    const customNotes = [
      contentMethod === "UPLOAD" && uploadedFileName
        ? `Uploaded Form: ${uploadedFileName}`
        : printForm.brideName || printForm.groomName
        ? `Couple: ${printForm.brideName} & ${printForm.groomName}`
        : "",
      printForm.eventDate ? `Date: ${printForm.eventDate} ${printForm.eventTime}` : "",
      totalPrintingChangeFee > 0
        ? `Printing Charge: +₹${totalPrintingChangeFee} (${printingChargeResult.breakdownText})`
        : "",
      printForm.specialInstructions ? `Notes: ${printForm.specialInstructions}` : "",
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
          shippingFee,
          items: [
            {
              itemType: "TRADITIONAL_PRINT",
              templateId: product.id,
              templateName: product.name,
              previewImage: product.previewImage,
              copies: selectedCopies,
              price: effectiveUnitPrice,
              customNotes,
              draftFileUrl: uploadedFileUrl,
              draftFileName: uploadedFileName,
              cardDetails,
            },
          ],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push(`/dashboard/orders?success=${data.orderNumber}`);
      } else {
        setToastMessage(data.error || "Failed to place order. Please check required fields.");
        setTimeout(() => setToastMessage(null), 5000);
      }
    } catch {
      setToastMessage("Error placing order. Please try again.");
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const renderDeliveryAddressSection = () => {
    return (
      <div className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="text-xs font-black text-[#991B1B] tracking-wide flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#991B1B]" />
            <span>Doorstep Delivery Address</span>
          </div>
          {session && hasSelectedAddress && (
            <button
              type="button"
              onClick={() => {
                setIsAddingAddressInModal(false);
                setIsAddressModalOpen(true);
              }}
              className="text-[11px] font-bold text-[#991B1B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Change Address</span>
            </button>
          )}
        </div>

        {!session ? (
          <div className="py-4 px-3 rounded-xl border border-dashed border-red-200 bg-red-50/20 text-center space-y-2.5">
            <div className="w-9 h-9 mx-auto rounded-full bg-red-100 text-[#991B1B] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Sign in to select or add your delivery address</p>
              <p className="text-[11px] text-slate-500">
                Delivery addresses are securely saved in your Bervic account for re-orders and tracking.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/shop/${product.id}`)}`)
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Continue</span>
            </button>
          </div>
        ) : isLoadingAddresses ? (
          <div className="py-4 text-center text-xs text-slate-400 animate-pulse">
            Loading saved addresses from your account...
          </div>
        ) : hasSelectedAddress ? (
          /* Address selected: Show cleanly as confirmed text with Edit/Change button opening modal */
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">{printForm.deliveryName}</span>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">📞 {printForm.deliveryPhone}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {printForm.deliveryAddress}, {printForm.deliveryCity} -{" "}
                  <strong className="text-slate-900 font-mono">{printForm.deliveryPincode}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddingAddressInModal(false);
                  setIsAddressModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-[#991B1B] text-[#991B1B] hover:bg-red-50 text-xs font-bold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit / Change</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11.5px] text-slate-600 flex-wrap gap-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Delivery by <strong>{deliveryDateText}</strong> (8 days)</span>
              </span>
              <span className="font-bold">
                {shippingFee === 0 ? (
                  <span className="text-emerald-700">FREE Delivery</span>
                ) : (
                  <span className="text-slate-900">Courier Charge: ₹{shippingFee}</span>
                )}
              </span>
            </div>
          </div>
        ) : (
          /* No address selected: Ask to add/select address */
          <div className="p-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/50 text-center space-y-2.5">
            <div className="w-9 h-9 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">No delivery address selected</p>
              <p className="text-[11px] text-slate-500">
                Please add or choose a delivery address from your account to proceed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAddingAddressInModal(savedAddresses.length === 0);
                setIsAddressModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{savedAddresses.length > 0 ? "Select Delivery Address" : "Add Delivery Address"}</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-16 pt-20 sm:pt-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#991B1B] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-amber-300 shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold leading-snug">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt={product.name}
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 mb-4 overflow-x-auto no-scrollbar py-0.5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <Link href="/" className="hover:text-[#991B1B] transition-colors whitespace-nowrap">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link href="/shop" className="hover:text-[#991B1B] transition-colors whitespace-nowrap">
            Print Shop
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-400 capitalize whitespace-nowrap">
            {isGift ? "Return Gifts" : product.category}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-800 truncate">{product.name}</span>
        </nav>

        {/* Main Product Stage: Amazon 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* ════════════════════════════════════════════════════════════
              COLUMN 1: Left Gallery (lg:col-span-4)
              ════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4 lg:sticky lg:top-24">
            {/* Media Gallery: Desktop shows vertical small boxes on LEFT; Mobile shows horizontal strip below */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-start w-full">
              {/* ── DESKTOP ONLY: LEFT SIDE SMALL BOXES (Amazon-style vertical strip) ── */}
              {allImages.length > 1 && (
                <div
                  className="hidden sm:flex sm:flex-col gap-2 shrink-0 py-0.5 no-scrollbar"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  role="tablist"
                  aria-label="Product thumbnails"
                >
                  {allImages.map((imgUrl, idx) => {
                    const isSelected = imgUrl === activeImage;
                    const label = idx === 0 ? "MAIN" : idx === 1 ? "BACK" : `0${idx + 1}`;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onMouseEnter={() => setActiveImage(imgUrl)}
                        onClick={() => setActiveImage(imgUrl)}
                        className={`group/thumb w-11 h-14 lg:w-12 lg:h-16 rounded-lg bg-white border p-0.5 shrink-0 transition-all duration-150 cursor-pointer relative overflow-hidden flex items-center justify-center ${
                          isSelected
                            ? "border-[#991B1B] ring-1 ring-[#991B1B] shadow-xs"
                            : "border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100"
                        }`}
                        aria-label={`View image angle ${idx + 1}`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain transition-transform duration-200 group-hover/thumb:scale-105"
                        />
                        {/* Miniature Label Badge */}
                        <span
                          className={`absolute bottom-0.5 right-0.5 text-[6.5px] font-black px-1 py-0.2 rounded shadow-2xs ${
                            isSelected ? "bg-[#991B1B] text-white" : "bg-slate-800 text-white"
                          }`}
                        >
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── MAIN IMAGE PREVIEW ── */}
              <div className="relative flex-1 w-full aspect-[3/4] sm:aspect-[4/5] max-h-[340px] sm:max-h-[400px] bg-white rounded-xl border border-slate-200/80 overflow-hidden flex items-center justify-center p-2 sm:p-3 group">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-300 group-hover:scale-102 cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                />

                {/* Mobile Touch Prev / Next Overlay Buttons */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      aria-label="Previous image"
                      className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 text-slate-800 shadow-md flex items-center justify-center border border-slate-200 active:scale-90 transition-transform"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      aria-label="Next image"
                      className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 text-slate-800 shadow-md flex items-center justify-center border border-slate-200 active:scale-90 transition-transform"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-2 left-2 bg-[#991B1B] text-white text-[8px] sm:text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs border border-red-300 uppercase tracking-wider">
                    {product.badge}
                  </div>
                )}

                {/* Price Tag Pill */}
                <div className="absolute bottom-2 right-2 bg-slate-900/90 text-white text-[10px] sm:text-xs font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs border border-slate-700 backdrop-blur-xs flex items-center gap-0.5">
                  <span>₹{effectiveUnitPrice}</span>
                  <span className="text-[8.5px] font-normal text-slate-300">
                    {isGift ? "/ pc" : "/ card"}
                  </span>
                </div>

                {/* Canva Studio Small Top-Right Button */}
                {product.canvaTemplateId && (
                  <a
                    href={`/canva?template=${encodeURIComponent(product.canvaTemplateId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 z-10 py-1 px-2.5 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#991B1B] font-bold text-[10.5px] border border-slate-200 shadow-sm flex items-center gap-1 backdrop-blur-xs transition-all no-underline cursor-pointer"
                    title="Customize design in Canva Studio"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                    <span>Edit in Studio</span>
                  </a>
                )}

                {/* Hover Lightbox Icon */}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-slate-700 hover:text-[#991B1B] p-1.5 rounded-lg shadow-xs cursor-pointer border border-slate-200"
                  title="Click to expand"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── MOBILE ONLY: THUMBNAILS ROW (Under main photo) ── */}
            {allImages.length > 1 && (
              <div
                className="flex sm:hidden items-center justify-center gap-2 pt-1 pb-0.5 w-full no-scrollbar overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                role="tablist"
                aria-label="Product thumbnails"
              >
                {allImages.map((imgUrl, idx) => {
                  const isSelected = imgUrl === activeImage;
                  const label = idx === 0 ? "MAIN" : idx === 1 ? "BACK" : `0${idx + 1}`;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-11 h-14 rounded-lg bg-white border p-0.5 shrink-0 transition-all cursor-pointer relative overflow-hidden flex items-center justify-center ${
                        isSelected
                          ? "border-[#991B1B] ring-1 ring-[#991B1B] shadow-xs scale-105"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`View image angle ${idx + 1}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                      <span
                        className={`absolute bottom-0.5 right-0.5 text-[6px] font-black px-1 rounded ${
                          isSelected ? "bg-[#991B1B] text-white" : "bg-slate-800 text-white"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Buy Now Button (in place of customize in studio) */}
            <button
              type="button"
              disabled={isPlacingOrder}
              onClick={() => {
                const hasCouple = !isGift && (!printForm.brideName.trim() || !printForm.groomName.trim());
                const hasDate = !isGift && !printForm.eventDate.trim();
                const hasAddress =
                  printForm.deliveryAddress.trim() && printForm.deliveryCity.trim() && printForm.deliveryPincode.trim();
                const hasUpload =
                  uploadedFileName || uploadedFileUrl || printForm.specialInstructions.trim();

                if (contentMethod === "UPLOAD" && !hasUpload) {
                  setCenterTab("STEPS");
                  stepFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setToastMessage("Please upload your invitation wording draft or fill details.");
                  setTimeout(() => setToastMessage(null), 4000);
                  return;
                }

                if (contentMethod === "FORM" && hasCouple) {
                  setCenterTab("STEPS");
                  setOnlineFormStep(1);
                  stepFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setToastMessage("Please enter Bride and Groom names to personalize your card.");
                  setTimeout(() => setToastMessage(null), 4000);
                  return;
                }

                if (contentMethod === "FORM" && hasDate) {
                  setCenterTab("STEPS");
                  setOnlineFormStep(2);
                  stepFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setToastMessage("Please select your wedding / event date.");
                  setTimeout(() => setToastMessage(null), 4000);
                  return;
                }

                if (!hasSelectedAddress) {
                  if (!session) {
                    router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/shop/${product.id}`)}`);
                  } else {
                    setIsAddingAddressInModal(savedAddresses.length === 0);
                    setIsAddressModalOpen(true);
                    setToastMessage("Please select or add your doorstep delivery address.");
                    setTimeout(() => setToastMessage(null), 4000);
                  }
                  return;
                }

                handleDirectOrder();
              }}
              className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isPlacingOrder ? "Placing Order..." : `Buy Now (₹${orderFinalTotal})`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Material & Paper Specifications (Direct on White) */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span>{isGift ? "🎁" : "📄"}</span>
                <span>{product.paperType}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span>📏</span>
                <span>Dimensions: {product.dimensions}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span>🚚</span>
                <span>Free Express Doorstep Delivery Across India</span>
              </div>
            </div>

            {/* Quality & Trust Badges (Clean Row on White) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#991B1B] shrink-0" />
                <div>
                  <span className="text-[11px] font-bold text-slate-900 block">100% Quality Board</span>
                  <span className="text-[9.5px] text-slate-400">Premium 350+ GSM</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[11px] font-bold text-slate-900 block">WhatsApp Proof</span>
                  <span className="text-[9.5px] text-slate-400">Sent before print run</span>
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              COLUMN 2 (lg:col-span-5): Amazon-Style Center Details & Customizer
              ════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-3.5">
            {/* 1. Header (Amazon-Style Title & Ratings) */}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
                {product.name} — Handcrafted Traditional Wedding Invitation Card
              </h1>
              <div>
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-[#007185] hover:text-[#C7511F] hover:underline inline-block"
                >
                  Visit the Bervic Invitation Store
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                <span className="font-bold text-amber-700 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>{product.rating || 4.9}</span>
                </span>
                <span className="text-[#007185] hover:underline cursor-pointer">
                  ({product.reviewsCount || 85} ratings)
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600 font-medium">400+ printed in past month</span>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* 2. Amazon Price Block with Small & Minimal Copies Dropdown */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-light text-[#CC0C39]">-38%</span>
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                    ₹{effectiveUnitPrice}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    {isGift ? "per gift piece" : "/ card"}
                  </span>
                </div>

                {/* Small & Minimal Copies Dropdown right near amount */}
                <div className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 transition-colors shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-600">Copies:</span>
                  <select
                    value={selectedCopies}
                    onChange={(e) => setSelectedCopies(Math.max(minOrderCopies, Number(e.target.value)))}
                    className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {availablePresets.map((num) => (
                      <option key={num} value={num}>
                        {num} {isGift ? "pcs" : "cards"}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-[11px] text-[#007185] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded font-semibold cursor-pointer">
                  Volume rate
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>
                  M.R.P.: <span className="line-through">₹{Math.round(effectiveUnitPrice * 1.6)}</span>
                </span>
                <span className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Bervic Fulfilled
                </span>
              </div>

              <p className="text-xs text-slate-600">Inclusive of all taxes</p>
            </div>

            {/* 3. MOBILE ONLY: 3-4 LINES OF DETAILS WITH SMALL "VIEW MORE" BUTTON */}
            <div className="lg:hidden space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs space-y-1 text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 w-24 shrink-0">Material:</span>
                  <span className="font-bold text-slate-900 truncate">{product.paperType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 w-24 shrink-0">Dimensions:</span>
                  <span className="font-bold text-slate-900 truncate">{product.dimensions}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 w-24 shrink-0">Proofing:</span>
                  <span className="font-bold text-slate-900 truncate">WhatsApp Draft Proof Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 w-24 shrink-0">Dispatch:</span>
                  <span className="font-bold text-emerald-700 truncate">3-5 Days Doorstep Delivery</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileMore(!showMobileMore)}
                className="text-[11px] text-[#007185] hover:text-[#C7511F] font-bold flex items-center gap-1 cursor-pointer py-0.5"
              >
                <span>{showMobileMore ? "View less details" : "View more details & offers"}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showMobileMore ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Offers & Badges (Desktop visible, or on Mobile when "View More" is toggled) */}
            <div className={`${showMobileMore ? "block" : "hidden lg:block"} space-y-3`}>
              {/* "Save Extra with 3 offers" Card (Exact from screenshot) */}
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-white">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>Save Extra with 3 offers</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="border-t border-slate-100 pt-1.5">
                    <span className="font-bold text-slate-900">Volume Tier Discount:</span>{" "}
                    <span className="text-slate-600">
                      Get base rate ₹{product.pricePerCard}/card on runs of {isGift ? "500+" : "1000+"} prints. Current tier for {selectedCopies} {isGift ? "pieces" : "cards"}:{" "}
                      <strong className="text-amber-800">{priceCalc.tierLabel}</strong> at{" "}
                      <strong className="text-slate-900">₹{effectiveUnitPrice}/{isGift ? "pc" : "card"}</strong>.
                    </span>
                  </div>
                  <div className="border-t border-slate-100 pt-1.5">
                    <span className="font-bold text-slate-900">Professional Typesetting:</span>{" "}
                    <span className="text-slate-600">
                      Full custom layout with your regional language script, couple names, and auspicious Muhurtham symbols.
                    </span>
                  </div>
                  <div className="border-t border-slate-100 pt-1.5">
                    <span className="font-bold text-slate-900">Free WhatsApp Proof:</span>{" "}
                    <span className="text-slate-600">
                      Digital draft PDF proof sent to your WhatsApp for approval before physical print run.
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Icons Strip (Amazon circular icons) */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                    <Truck className="w-3.5 h-3.5 text-[#991B1B]" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                    Free Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#991B1B]" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                    100% Quality
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                    <Printer className="w-3.5 h-3.5 text-[#991B1B]" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                    WhatsApp Proof
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                    Gold Foil
                  </span>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                4. THE SPECIFICATION / STEP-BY-STEP DETAILS COLLECTION AREA
                ════════════════════════════════════════════════════════════ */}
            <div ref={stepFormRef} className="pt-3 border-t border-slate-200 space-y-3">
              {/* Desktop Mode Toggle (Specs vs Steps) */}
              <div className="hidden lg:flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setCenterTab("SPECS")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      centerTab === "SPECS"
                        ? "bg-red-50 text-[#991B1B] font-extrabold border border-red-200 shadow-2xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    📋 Product Specifications
                  </button>
                  <button
                    type="button"
                    onClick={() => setCenterTab("STEPS")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      centerTab === "STEPS"
                        ? "bg-[#991B1B] text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <span>✍️ Step-by-Step Customization</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  </button>
                </div>
              </div>

              {/* MODE A (Desktop Only): Specifications Table */}
              {centerTab === "SPECS" && (
                <div className="hidden lg:block space-y-3">
                  <table className="w-full text-xs text-left">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 text-slate-500 font-semibold w-1/3">Paper Quality</td>
                        <td className="py-2 text-slate-900 font-bold">{product.paperType}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 text-slate-500 font-semibold">Dimensions</td>
                        <td className="py-2 text-slate-900 font-bold">{product.dimensions}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 text-slate-500 font-semibold">Digital Proofing</td>
                        <td className="py-2 text-slate-900 font-bold">WhatsApp Preview Included before Print</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 text-slate-500 font-semibold">Doorstep Dispatch</td>
                        <td className="py-2 text-slate-900 font-bold">3-5 Business Days across India</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-500 font-semibold">Custom Printing</td>
                        <td className="py-2 text-slate-900 font-bold">
                          Multi-lingual (Tamil, Telugu, Hindi, English) with WhatsApp Proof
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">
                        Ready to personalize this card?
                      </span>
                      <span className="text-slate-600 text-[11px]">
                        Upload your invitation form or type event details in steps.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCenterTab("STEPS")}
                      className="px-3.5 py-1.5 rounded-lg bg-[#991B1B] text-white text-xs font-bold shadow-xs hover:bg-[#7F1D1D] shrink-0 cursor-pointer"
                    >
                      Start Customization
                    </button>
                  </div>
                </div>
              )}

              {/* MODE B: STEP-BY-STEP CUSTOMIZATION & DETAILS COLLECTION
                  (Always visible on Mobile; and visible on Desktop when centerTab === "STEPS") */}
              <div
                className={`${
                  centerTab === "STEPS" ? "block" : "block lg:hidden"
                } space-y-4`}
              >
                {/* ── STEP 1: QUANTITY SELECTION ── */}
                <div className="py-2.5 bg-white space-y-3 border-b border-slate-100">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
                      <span className="w-5 h-5 rounded-full bg-[#991B1B] text-white text-[10px] flex items-center justify-center font-black">
                        1
                      </span>
                      <span>Select Print Quantity:</span>
                      <span className="text-[#991B1B] font-black">
                        {selectedCopies} {isGift ? "pieces" : "cards"}
                      </span>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300">
                        Min. Order: {minOrderCopies} {isGift ? "pcs" : "cards"}
                      </span>
                    </label>
                    <div className="text-xs text-right">
                      <div>
                        <span className="text-slate-500">Cards: </span>
                        <span className="text-sm font-black text-slate-900">₹{totalPrice}</span>
                        <span className="text-[10px] text-emerald-700 font-bold ml-1">
                          (₹{effectiveUnitPrice}/card)
                        </span>
                      </div>
                      {totalPrintingChangeFee > 0 && (
                        <div className="text-[11px] text-[#991B1B] font-bold">
                          + ₹{totalPrintingChangeFee} printing charge
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Select Preset Buttons (Only >= minOrderCopies) */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 block">
                      Quick Popular Quantities:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-0.5">
                      {quickButtonPresets.map((preset) => {
                        const isSelected = selectedCopies === preset;
                        const calc = calculateTieredCardPrice(product.pricePerCard, preset, isGift, (product as any).pricingTiersJson);
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setSelectedCopies(preset)}
                            className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${
                              isSelected
                                ? "bg-red-50/70 border-[#991B1B] text-[#991B1B] font-black ring-1 ring-[#991B1B] shadow-2xs"
                                : "bg-white border-slate-200 hover:border-slate-400 text-slate-800"
                            }`}
                          >
                            <span className="text-xs font-extrabold leading-tight">{preset}</span>
                            <span className="text-[8.5px] text-slate-500">₹{calc.unitPrice}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Prominent Custom Quantity Input Box */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/70 via-rose-50/40 to-white border-2 border-amber-300 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#991B1B] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                        ✍️
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-black text-slate-900 block">
                          Type Exact Custom Copies (e.g. 750, 1200, 2500)
                        </span>
                        <span className="text-[11px] text-slate-600">
                          Need any other count? You can type your exact number of copies directly in this box:
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <div className="relative flex-1 min-w-[160px] max-w-[240px]">
                        <input
                          type="number"
                          min={minOrderCopies}
                          max={10000}
                          step={isGift ? 5 : 25}
                          value={selectedCopies}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) {
                              setSelectedCopies(val);
                            }
                          }}
                          onBlur={() => {
                            if (selectedCopies < minOrderCopies) {
                              setSelectedCopies(minOrderCopies);
                              setToastMessage(`Minimum order for this product is ${minOrderCopies} copies.`);
                              setTimeout(() => setToastMessage(null), 3500);
                            }
                          }}
                          placeholder={`Min ${minOrderCopies}`}
                          className={`w-full pl-3 pr-14 py-2 text-sm font-black text-slate-900 bg-white border-2 rounded-xl focus:outline-none shadow-xs text-left ${
                            selectedCopies < minOrderCopies
                              ? "border-rose-500 ring-2 ring-rose-200"
                              : "border-[#991B1B] focus:ring-2 focus:ring-[#991B1B]/20"
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 pointer-events-none">
                          {isGift ? "pcs" : "cards"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (selectedCopies < minOrderCopies) {
                            setSelectedCopies(minOrderCopies);
                            setToastMessage(`Quantity set to minimum requirement of ${minOrderCopies} copies.`);
                          } else {
                            setToastMessage(`✓ Custom quantity applied: ${selectedCopies} copies!`);
                          }
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="py-2 px-4 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-black shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0 active:scale-95 flex items-center gap-1"
                      >
                        <span>Apply</span>
                        <span>✓</span>
                      </button>

                      <span className="text-[11px] font-bold text-slate-500">
                        (Min: {minOrderCopies} {isGift ? "pcs" : "cards"})
                      </span>
                    </div>

                    {selectedCopies < minOrderCopies && (
                      <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 pt-0.5">
                        <span>⚠️ Quantity cannot be less than minimum order of {minOrderCopies} copies.</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* ── STEP 2: INVITATION WORDINGS / STEPPER FORM ── */}
                <div className="py-2.5 bg-white space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#991B1B] text-white text-[10px] flex items-center justify-center font-black">
                        2
                      </span>
                      <span>Personalize Your Invitation:</span>
                    </label>
                  </div>

                  {/* Two Clean Tabs on Pure White */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setContentMethod("UPLOAD")}
                      className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        contentMethod === "UPLOAD"
                          ? "bg-red-50 text-[#991B1B] border-[#991B1B] shadow-2xs"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Form / Draft</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setContentMethod("FORM")}
                      className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        contentMethod === "FORM"
                          ? "bg-red-50 text-[#991B1B] border-[#991B1B] shadow-2xs"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Fill Online (Step-by-Step)</span>
                    </button>
                  </div>

                  {/* ══════════════════════════════════════════════════════
                      OPTION A: UPLOAD FORM / DRAFT
                      ══════════════════════════════════════════════════════ */}
                  {contentMethod === "UPLOAD" && (
                    <div className="space-y-4 pt-1 bg-white">
                      <div className="border-2 border-dashed border-red-300 rounded-2xl p-4 bg-white text-center space-y-2.5">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFormFileUpload(file);
                          }}
                          className="hidden"
                        />

                        {!uploadedFileName ? (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="cursor-pointer space-y-2 py-2 hover:opacity-90 transition-opacity"
                          >
                            <div className="w-10 h-10 mx-auto rounded-full bg-red-50 text-[#991B1B] flex items-center justify-center">
                              <Upload className="w-5 h-5 animate-bounce" />
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-slate-900">
                                Click to Upload Invitation Form, Word Doc, or Photo
                              </p>
                              <p className="text-[10.5px] text-slate-500 mt-0.5">
                                Upload filled form, .docx, PDF, or phone photos of handwritten draft
                              </p>
                            </div>
                            <button
                              type="button"
                              disabled={isUploadingFile}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#991B1B] text-white text-xs font-bold shadow-xs hover:bg-[#7F1D1D] cursor-pointer"
                            >
                              <Upload className="w-3 h-3" />
                              <span>{isUploadingFile ? "Uploading..." : "Browse File"}</span>
                            </button>
                          </div>
                        ) : (
                          <div className="bg-white border border-emerald-300 rounded-xl p-2.5 flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-2 text-left">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                                  {uploadedFileName}
                                </p>
                                <p className="text-[10px] text-emerald-700 font-semibold">
                                  ✓ Attached ready for typesetting
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedFileName(null);
                                setUploadedFileUrl(null);
                              }}
                              className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 cursor-pointer"
                            >
                              Change
                            </button>
                          </div>
                        )}

                        <div className="text-left space-y-1 pt-2 border-t border-slate-100">
                          <label className="text-[10.5px] font-bold text-slate-700 block">
                            Special Instructions / Wording Notes:
                          </label>
                          <textarea
                            rows={2}
                            value={printForm.specialInstructions}
                            onChange={(e) =>
                              setPrintForm((prev) => ({ ...prev, specialInstructions: e.target.value }))
                            }
                            placeholder="e.g. Format in Tamil with English venue, include grandparents names"
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#991B1B] bg-white text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Doorstep Delivery Address (Upload Flow) */}
                      {renderDeliveryAddressSection()}

                      {/* Order Buttons (Upload Flow) */}
                      <div className="pt-2 space-y-2">
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <button
                            type="button"
                            disabled={isPlacingOrder}
                            onClick={handleDirectOrder}
                            className="flex-1 w-full py-3 px-5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                          >
                            <span>
                              {isPlacingOrder ? "Placing Order..." : `Place Order Now (₹${orderFinalTotal})`}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={isAddingToCart}
                            onClick={handleAddToCart}
                            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-[#991B1B] border-2 border-[#991B1B] text-xs font-extrabold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                          >
                            <ShoppingBag className="w-4 h-4 text-[#991B1B]" />
                            <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-[10.5px] text-slate-500 pt-0.5">
                          <span>🚚 FREE Doorstep Delivery across India</span>
                          <span>💬 WhatsApp draft proof before print</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════════════════════════════
                      OPTION B: FILL ONLINE (STEP-BY-STEP STEPPER)
                      ══════════════════════════════════════════════════════ */}
                  {contentMethod === "FORM" && (
                    <div className="space-y-4 pt-1 bg-white">
                      {/* Stepper Progress Indicator */}
                      <div className="py-2 bg-white">
                        <div className="flex items-center justify-between relative px-2 sm:px-6">
                          {/* Connecting Background Line */}
                          <div className="absolute top-3.5 left-6 right-6 sm:left-12 sm:right-12 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                          <div
                            className="absolute top-3.5 left-6 sm:left-12 h-0.5 bg-[#991B1B] -translate-y-1/2 z-0 transition-all duration-300"
                            style={{
                              width:
                                onlineFormStep === 1
                                  ? "0%"
                                  : onlineFormStep === 2
                                  ? "calc(50% - 12px)"
                                  : "calc(100% - 24px)",
                            }}
                          />

                          {/* Step 1 Pill */}
                          <button
                            type="button"
                            onClick={() => setOnlineFormStep(1)}
                            className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer bg-white px-2"
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                onlineFormStep === 1
                                  ? "bg-[#991B1B] text-white ring-4 ring-red-100 shadow-xs"
                                  : onlineFormStep > 1
                                  ? "bg-emerald-600 text-white"
                                  : "bg-white border border-slate-300 text-slate-400"
                              }`}
                            >
                              {onlineFormStep > 1 ? "✓" : "1"}
                            </div>
                            <span
                              className={`text-[11px] font-bold transition-colors ${
                                onlineFormStep === 1 ? "text-[#991B1B]" : "text-slate-600"
                              }`}
                            >
                              Couple Details
                            </span>
                          </button>

                          {/* Step 2 Pill */}
                          <button
                            type="button"
                            onClick={() => setOnlineFormStep(2)}
                            className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer bg-white px-2"
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                onlineFormStep === 2
                                  ? "bg-[#991B1B] text-white ring-4 ring-red-100 shadow-xs"
                                  : onlineFormStep > 2
                                  ? "bg-emerald-600 text-white"
                                  : "bg-white border border-slate-300 text-slate-400"
                              }`}
                            >
                              {onlineFormStep > 2 ? "✓" : "2"}
                            </div>
                            <span
                              className={`text-[11px] font-bold transition-colors ${
                                onlineFormStep === 2 ? "text-[#991B1B]" : "text-slate-600"
                              }`}
                            >
                              Date &amp; Venues
                            </span>
                          </button>

                          {/* Step 3 Pill */}
                          <button
                            type="button"
                            onClick={() => setOnlineFormStep(3)}
                            className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer bg-white px-2"
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                onlineFormStep === 3
                                  ? "bg-[#991B1B] text-white ring-4 ring-red-100 shadow-xs"
                                  : "bg-white border border-slate-300 text-slate-400"
                              }`}
                            >
                              3
                            </div>
                            <span
                              className={`text-[11px] font-bold transition-colors ${
                                onlineFormStep === 3 ? "text-[#991B1B]" : "text-slate-600"
                              }`}
                            >
                              RSVP &amp; Delivery
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* ── STEPPER PART 1: COUPLE & LANGUAGE ── */}
                      {onlineFormStep === 1 && (
                        <div className="space-y-4 pt-1">
                          {/* Language Selection */}
                          <div className="space-y-2 pb-2.5 border-b border-slate-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                <span>🌐</span>
                                <span>Card Language &amp; Regional Script:</span>
                              </span>
                              <select
                                value={printForm.cardLanguage}
                                onChange={(e) =>
                                  setPrintForm((prev) => ({ ...prev, cardLanguage: e.target.value }))
                                }
                                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#991B1B]"
                              >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                  <option key={lang.code} value={lang.code}>
                                    {lang.name} ({lang.nativeName})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {printForm.cardLanguage !== "en" && (
                              <div className="flex items-center gap-4 text-xs pt-1">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="langMode"
                                    checked={printForm.languageMode === "DUAL"}
                                    onChange={() =>
                                      setPrintForm((prev) => ({ ...prev, languageMode: "DUAL" }))
                                    }
                                    className="text-[#991B1B] focus:ring-[#991B1B]"
                                  />
                                  <span className="font-semibold text-slate-700">
                                    Dual Language (English + Regional)
                                  </span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="langMode"
                                    checked={printForm.languageMode === "REGIONAL_ONLY"}
                                    onChange={() =>
                                      setPrintForm((prev) => ({ ...prev, languageMode: "REGIONAL_ONLY" }))
                                    }
                                    className="text-[#991B1B] focus:ring-[#991B1B]"
                                  />
                                  <span className="font-semibold text-slate-700">
                                    Pure Regional Script Only
                                  </span>
                                </label>
                              </div>
                            )}
                          </div>

                          {isGift ? (
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                  Couple / Family Name on Gift Tag <span className="text-rose-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={printForm.brideName}
                                  onChange={(e) =>
                                    setPrintForm((prev) => ({ ...prev, brideName: e.target.value }))
                                  }
                                  placeholder="e.g. S. Priyanka & R. Karthik"
                                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#991B1B] bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                  Complementary Message / Tagline
                                </label>
                                <input
                                  type="text"
                                  value={printForm.specialInstructions}
                                  onChange={(e) =>
                                    setPrintForm((prev) => ({ ...prev, specialInstructions: e.target.value }))
                                  }
                                  placeholder="e.g. With Best Compliments From Sundaram Family"
                                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#991B1B] bg-white"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Bride's Details */}
                              <div className="space-y-2 pt-1">
                                <div className="text-xs font-black text-[#991B1B] tracking-wide flex items-center gap-1 pb-1 border-b border-slate-100">
                                  <span>👰</span>
                                  <span>Bride&apos;s Details</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  <IndicLanguageInput
                                    label="Bride's Full Name"
                                    required
                                    targetLanguage={printForm.cardLanguage}
                                    languageMode={printForm.languageMode}
                                    englishValue={printForm.brideName}
                                    onEnglishChange={(val: string) =>
                                      setPrintForm((prev) => ({ ...prev, brideName: val }))
                                    }
                                    regionalValue={printForm.brideNameRegional}
                                    onRegionalChange={(rVal: string) =>
                                      setPrintForm((prev) => ({ ...prev, brideNameRegional: rVal }))
                                    }
                                    placeholderEnglish="e.g. S. Priyanka"
                                  />
                                  <IndicLanguageInput
                                    label="Educational Qualification"
                                    targetLanguage={printForm.cardLanguage}
                                    languageMode={printForm.languageMode}
                                    englishValue={printForm.brideQualification}
                                    onEnglishChange={(val: string) =>
                                      setPrintForm((prev) => ({ ...prev, brideQualification: val }))
                                    }
                                    regionalValue={printForm.brideQualificationRegional}
                                    onRegionalChange={(rVal: string) =>
                                      setPrintForm((prev) => ({ ...prev, brideQualificationRegional: rVal }))
                                    }
                                    placeholderEnglish="e.g. B.Tech, MBA"
                                  />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  <IndicLanguageInput
                                    label="Parents' Names &amp; Family"
                                    targetLanguage={printForm.cardLanguage}
                                    languageMode={printForm.languageMode}
                                    englishValue={printForm.brideParents}
                                    onEnglishChange={(val: string) =>
                                      setPrintForm((prev) => ({ ...prev, brideParents: val }))
                                    }
                                    regionalValue={printForm.brideParentsRegional}
                                    onRegionalChange={(rVal: string) =>
                                      setPrintForm((prev) => ({ ...prev, brideParentsRegional: rVal }))
                                    }
                                    placeholderEnglish="e.g. Mr. &amp; Mrs. Sundaram"
                                  />
                                  <IndicLanguageInput
                                    label="Native Place / Residence"
                                    targetLanguage={printForm.cardLanguage}
                                    languageMode={printForm.languageMode}
                                    englishValue={printForm.brideAddress}
                                    onEnglishChange={(val: string) =>
                                      setPrintForm((prev) => ({ ...prev, brideAddress: val }))
                                    }
                                    regionalValue={printForm.brideAddressRegional}
                                    onRegionalChange={(rVal: string) =>
                                      setPrintForm((prev) => ({ ...prev, brideAddressRegional: rVal }))
                                    }
                                    placeholderEnglish="e.g. Madurai, Tamil Nadu"
                                  />
                                </div>
                              </div>

                              {/* Groom's Details */}
                              <div className="space-y-2 pt-2">
                                <div className="text-xs font-black text-[#991B1B] tracking-wide flex items-center gap-1 pb-1 border-b border-slate-100">
                                  <span>🤵</span>
                                  <span>Groom&apos;s Details</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  <IndicLanguageInput
                                    label="Groom's Full Name"
                                    required
                                    targetLanguage={printForm.cardLanguage}
                                    languageMode={printForm.languageMode}
                                    englishValue={printForm.groomName}
                                    onEnglishChange={(val: string) =>
                                      setPrintForm((prev) => ({ ...prev, groomName: val }))
                                    }
                                    regionalValue={printForm.groomNameRegional}
                                    onRegionalChange={(rVal: string) =>
                                      setPrintForm((prev) => ({ ...prev, groomNameRegional: rVal }))
                                    }
                                    placeholderEnglish="e.g. R. Karthik"
                                  />
                                  <IndicLanguageInput
                                    label="Educational Qualification"
                                    targetLanguage={printForm.cardLanguage}
                                    languageMode={printForm.languageMode}
                                    englishValue={printForm.groomQualification}
                                    onEnglishChange={(val: string) =>
                                      setPrintForm((prev) => ({ ...prev, groomQualification: val }))
                                    }
                                    regionalValue={printForm.groomQualificationRegional}
                                    onRegionalChange={(rVal: string) =>
                                      setPrintForm((prev) => ({ ...prev, groomQualificationRegional: rVal }))
                                    }
                                    placeholderEnglish="e.g. M.S. (Software)"
                                  />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  <IndicLanguageInput
                                    label="Parents' Names &amp; Family"
                                    targetLanguage={printForm.cardLanguage}
                                    languageMode={printForm.languageMode}
                                    englishValue={printForm.groomParents}
                                    onEnglishChange={(val: string) =>
                                      setPrintForm((prev) => ({ ...prev, groomParents: val }))
                                    }
                                    regionalValue={printForm.groomParentsRegional}
                                    onRegionalChange={(rVal: string) =>
                                      setPrintForm((prev) => ({ ...prev, groomParentsRegional: rVal }))
                                    }
                                    placeholderEnglish="e.g. Mr. &amp; Mrs. Ramanathan"
                                  />
                                  <IndicLanguageInput
                                    label="Native Place / Residence"
                                    targetLanguage={printForm.cardLanguage}
                                    languageMode={printForm.languageMode}
                                    englishValue={printForm.groomAddress}
                                    onEnglishChange={(val: string) =>
                                      setPrintForm((prev) => ({ ...prev, groomAddress: val }))
                                    }
                                    regionalValue={printForm.groomAddressRegional}
                                    onRegionalChange={(rVal: string) =>
                                      setPrintForm((prev) => ({ ...prev, groomAddressRegional: rVal }))
                                    }
                                    placeholderEnglish="e.g. Chennai, Tamil Nadu"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {/* Step 1 Next Button */}
                          <div className="pt-3">
                            <button
                              type="button"
                              onClick={() => {
                                if (!printForm.brideName.trim() || !printForm.groomName.trim()) {
                                  setToastMessage("Please enter Bride and Groom full names to continue.");
                                  setTimeout(() => setToastMessage(null), 3500);
                                  return;
                                }
                                setOnlineFormStep(2);
                              }}
                              className="w-full py-2.5 px-4 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-black shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                            >
                              <span>Continue to Date &amp; Venues</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── STEPPER PART 2: DATE & VENUES ── */}
                      {onlineFormStep === 2 && (
                        <div className="space-y-4 pt-1">
                          {/* Wedding Date & Muhurtham */}
                          <div className="space-y-2 pt-1">
                            <div className="text-xs font-black text-[#991B1B] tracking-wide flex items-center gap-1 pb-1 border-b border-slate-100">
                              <span>📅</span>
                              <span>Wedding Date &amp; Auspicious Muhurtham Time</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block">
                                  Date of Event <span className="text-rose-600">*</span>
                                </label>
                                <input
                                  ref={datePickerRef}
                                  type="date"
                                  value={printForm.eventDate}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPrintForm((prev) => ({
                                      ...prev,
                                      eventDate: val,
                                      eventDateRegional: formatRegionalDate(val, prev.cardLanguage),
                                    }));
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#991B1B] bg-white"
                                />
                                {printForm.eventDate && (
                                  <p className="text-[10.5px] text-slate-500">
                                    Formatted: {formatEnglishDate(printForm.eventDate)}
                                  </p>
                                )}
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block">
                                  Muhurtham / Function Time
                                </label>
                                <input
                                  ref={timePickerRef}
                                  type="time"
                                  value={printForm.eventTime}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPrintForm((prev) => ({
                                      ...prev,
                                      eventTime: val,
                                      eventTimeRegional: formatRegionalTime(val, prev.cardLanguage),
                                    }));
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#991B1B] bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Ceremony & Reception Venues */}
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                              <span className="text-xs font-black text-[#991B1B] tracking-wide flex items-center gap-1">
                                <span>📍</span>
                                <span>Ceremony &amp; Reception Venues</span>
                              </span>
                              <button
                                type="button"
                                onClick={handleAddVenue}
                                className="text-xs font-bold text-[#991B1B] hover:underline flex items-center gap-0.5 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Venue</span>
                              </button>
                            </div>

                            <div className="space-y-2.5">
                              {printForm.venues.map((venue, idx) => (
                                <div
                                  key={idx}
                                  className="space-y-1.5 pb-2 border-b border-slate-100 last:border-b-0"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                      Venue #{idx + 1}
                                    </span>
                                    {printForm.venues.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveVenue(idx)}
                                        className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer text-xs"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      value={venue.name}
                                      onChange={(e) => handleVenueChange(idx, "name", e.target.value)}
                                      placeholder="Venue Name (e.g. Marthal CSI Hall)"
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                                    />
                                    <input
                                      type="text"
                                      value={venue.functionType || ""}
                                      onChange={(e) => handleVenueChange(idx, "functionType", e.target.value)}
                                      placeholder="Function Type (e.g. Muhurtham & Reception)"
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    value={venue.address}
                                    onChange={(e) => handleVenueChange(idx, "address", e.target.value)}
                                    placeholder="Full Address &amp; City / Landmark"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Step 2 Buttons */}
                          <div className="flex items-center gap-2 pt-3">
                            <button
                              type="button"
                              onClick={() => setOnlineFormStep(1)}
                              className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                            >
                              ← Back
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!printForm.eventDate.trim()) {
                                  setToastMessage("Please select the wedding date to continue.");
                                  setTimeout(() => setToastMessage(null), 3500);
                                  return;
                                }
                                setOnlineFormStep(3);
                              }}
                              className="flex-1 py-2.5 px-4 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-black shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                            >
                              <span>Continue to Delivery &amp; RSVP</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── STEPPER PART 3: RSVP & DELIVERY ── */}
                      {onlineFormStep === 3 && (
                        <div className="space-y-4 pt-1">
                          {/* RSVP & Special Instructions */}
                          <div className="space-y-2 pt-1">
                            <div className="text-xs font-black text-[#991B1B] tracking-wide flex items-center gap-1 pb-1 border-b border-slate-100">
                              <span>📞</span>
                              <span>RSVP &amp; Special Wording Notes</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className="text-xs font-bold text-slate-700 block mb-0.5">
                                  RSVP Contact Printed on Card
                                </label>
                                <input
                                  type="text"
                                  value={printForm.rsvpContact}
                                  onChange={(e) =>
                                    setPrintForm((prev) => ({ ...prev, rsvpContact: e.target.value }))
                                  }
                                  placeholder="e.g. 9840123456 / With Best Compliments"
                                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-700 block mb-0.5">
                                  Special Instructions / Notes
                                </label>
                                <input
                                  type="text"
                                  value={printForm.specialInstructions}
                                  onChange={(e) =>
                                    setPrintForm((prev) => ({ ...prev, specialInstructions: e.target.value }))
                                  }
                                  placeholder="Any font or layout preference"
                                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Doorstep Delivery Address */}
                          {renderDeliveryAddressSection()}

                          {/* Order Action Buttons */}
                          <div className="pt-3 space-y-2">
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setOnlineFormStep(2)}
                                className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                              >
                                ← Back
                              </button>
                              <button
                                type="button"
                                disabled={isPlacingOrder}
                                onClick={handleDirectOrder}
                                className="flex-1 w-full py-3 px-5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                              >
                                <span>
                                  {isPlacingOrder ? "Placing Order..." : `Place Order Now (₹${orderFinalTotal})`}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={isAddingToCart}
                                onClick={handleAddToCart}
                                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-[#991B1B] border-2 border-[#991B1B] text-xs font-extrabold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                              >
                                <ShoppingBag className="w-4 h-4 text-[#991B1B]" />
                                <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center justify-between text-[10.5px] text-slate-500 pt-0.5">
                              <span>
                                🚚 {shippingFee === 0 ? "FREE Doorstep Delivery" : `Standard Courier Delivery (₹${shippingFee})`}
                              </span>
                              <span>💬 WhatsApp draft proof before print</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              COLUMN 3 (lg:col-span-3): Dedicated Amazon Buy Box (Desktop)
              ════════════════════════════════════════════════════════════ */}
          <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              {/* Total Price Block with Small & Minimal Dropdown */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900">₹{orderFinalTotal}</span>
                    <span className="text-xs text-slate-500 block">
                      ₹{effectiveUnitPrice} per card ({selectedCopies} copies)
                    </span>
                  </div>

                  {/* Small & Minimal Copies Dropdown right near amount */}
                  <div className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 shrink-0 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-600">Qty:</span>
                    <select
                      value={selectedCopies}
                      onChange={(e) => setSelectedCopies(Math.max(minOrderCopies, Number(e.target.value)))}
                      className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer"
                    >
                      {availablePresets.map((num) => (
                        <option key={num} value={num}>
                          {num} {isGift ? "pcs" : "cards"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Final Added Amount Breakdown */}
                <div className="text-[11px] text-slate-600 space-y-1 mt-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Card Base ({selectedCopies} × ₹{effectiveUnitPrice}):</span>
                    <span className="font-semibold text-slate-900">₹{totalPrice}</span>
                  </div>
                  {totalPrintingChangeFee > 0 && (
                    <div className="flex justify-between text-[#991B1B]">
                      <span>Printing Charge ({selectedCopies} copies):</span>
                      <span className="font-bold">+₹{totalPrintingChangeFee}</span>
                    </div>
                  )}
                  {shippingFee > 0 ? (
                    <div className="flex justify-between text-slate-700">
                      <span>Courier Delivery:</span>
                      <span className="font-semibold">+₹{shippingFee}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Doorstep Delivery:</span>
                      <span>FREE</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-black text-slate-900 pt-1.5 border-t border-slate-200">
                    <span>Final Added Amount:</span>
                    <span className="text-[#991B1B] text-sm">₹{orderFinalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              {hasSelectedAddress ? (
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p>
                    <strong className="text-slate-900">
                      {shippingFee === 0 ? "FREE delivery" : `Delivery (₹${shippingFee})`}
                    </strong>{" "}
                    by <strong className="text-slate-900">{deliveryDateText}</strong>.
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    {shippingFee === 0 ? "Qualified for free doorstep delivery." : "Standard courier dispatch across India."}
                  </p>

                  {/* Location pin with Change button right here */}
                  <div className="flex items-center justify-between gap-1 text-xs pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-[#007185] min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span className="truncate" title={`${printForm.deliveryAddress}, ${printForm.deliveryCity} (${printForm.deliveryPincode})`}>
                        Deliver to {printForm.deliveryCity || printForm.deliveryName} ({printForm.deliveryPincode})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAddressInModal(false);
                        setIsAddressModalOpen(true);
                      }}
                      className="text-xs font-bold text-[#991B1B] hover:text-[#7F1D1D] hover:underline shrink-0 cursor-pointer ml-1"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-amber-900 text-xs">No delivery address selected</p>
                      <p className="text-[11px] text-amber-800 leading-tight">
                        Select or add your address to view delivery date (8 days) & shipping fee.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!session) {
                        router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/shop/${product.id}`)}`);
                      } else {
                        setIsAddingAddressInModal(savedAddresses.length === 0);
                        setIsAddressModalOpen(true);
                      }
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {session
                        ? (savedAddresses.length > 0 ? "Select Delivery Address" : "Add Delivery Address")
                        : "Sign In to Add Address"}
                    </span>
                  </button>
                </div>
              )}

              {/* In Stock */}
              <div className="text-sm font-bold text-[#007600]">
                In stock (Ready to Print)
              </div>

              {/* Amazon Style Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  disabled={isAddingToCart}
                  onClick={() => {
                    const hasCouple = !isGift && (!printForm.brideName.trim() || !printForm.groomName.trim());
                    const hasUpload = uploadedFileName || uploadedFileUrl || printForm.specialInstructions.trim();

                    if (contentMethod === "UPLOAD" && !hasUpload) {
                      setCenterTab("STEPS");
                      stepFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      setToastMessage("Please upload your invitation wording draft or fill details.");
                      setTimeout(() => setToastMessage(null), 4000);
                      return;
                    }

                    if (contentMethod === "FORM" && hasCouple) {
                      setCenterTab("STEPS");
                      setOnlineFormStep(1);
                      stepFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      setToastMessage("Please enter Bride and Groom names to personalize your card.");
                      setTimeout(() => setToastMessage(null), 4000);
                      return;
                    }

                    handleAddToCart();
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-red-50 hover:bg-red-100 text-[#991B1B] text-xs sm:text-sm font-extrabold border-2 border-[#991B1B] shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#991B1B]" />
                  <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
                </button>

                <button
                  type="button"
                  disabled={isPlacingOrder}
                  onClick={() => {
                    const hasCouple = !isGift && (!printForm.brideName.trim() || !printForm.groomName.trim());
                    const hasDate = !isGift && !printForm.eventDate.trim();
                    const hasAddress =
                      printForm.deliveryAddress.trim() && printForm.deliveryCity.trim() && printForm.deliveryPincode.trim();
                    const hasUpload = uploadedFileName || uploadedFileUrl || printForm.specialInstructions.trim();

                    if (contentMethod === "UPLOAD" && !hasUpload) {
                      setCenterTab("STEPS");
                      stepFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      setToastMessage("Please upload your invitation wording draft or fill details.");
                      setTimeout(() => setToastMessage(null), 4000);
                      return;
                    }

                    if (contentMethod === "FORM" && hasCouple) {
                      setCenterTab("STEPS");
                      setOnlineFormStep(1);
                      stepFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      setToastMessage("Please enter Bride and Groom names to personalize your card.");
                      setTimeout(() => setToastMessage(null), 4000);
                      return;
                    }

                    if (contentMethod === "FORM" && hasDate) {
                      setCenterTab("STEPS");
                      setOnlineFormStep(2);
                      stepFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      setToastMessage("Please select your wedding / event date.");
                      setTimeout(() => setToastMessage(null), 4000);
                      return;
                    }

                    if (!hasSelectedAddress) {
                      if (!session) {
                        router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/shop/${product.id}`)}`);
                      } else {
                        setIsAddingAddressInModal(savedAddresses.length === 0);
                        setIsAddressModalOpen(true);
                        setToastMessage("Please select or add your delivery address to complete your order.");
                        setTimeout(() => setToastMessage(null), 4000);
                      }
                      return;
                    }

                    handleDirectOrder();
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs sm:text-sm font-black border border-[#991B1B] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <span>{isPlacingOrder ? "Placing Order..." : `Buy Now (₹${orderFinalTotal})`}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCenterTab("STEPS");
                    stepFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold text-[#991B1B] hover:text-[#7F1D1D] hover:bg-red-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>✍️ Fill / Upload Invitation Details</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Ships from / Sold by table */}
              <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ships from</span>
                  <span className="font-semibold text-slate-800">Bervic Studio</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sold by</span>
                  <span className="font-semibold text-slate-800">Bervic Digital Prints</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Secure Transaction
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Proof</span>
                  <span className="font-semibold text-slate-800">WhatsApp Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            LOWER SECTION: Full Specifications & Guarantees
            ════════════════════════════════════════════════════════════ */}
        <div className="mt-12 pt-8 border-t border-slate-100 space-y-8">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Printer className="w-4 h-4 text-[#991B1B]" />
              <span>Full Print Specifications</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
              <div className="border-l-2 border-[#991B1B]/40 pl-3 py-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cardstock Material</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5">{product.paperType}</p>
              </div>
              <div className="border-l-2 border-[#991B1B]/40 pl-3 py-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Finished Dimensions</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5">{product.dimensions}</p>
              </div>
              <div className="border-l-2 border-[#991B1B]/40 pl-3 py-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Digital Proof</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5">WhatsApp Preview Included</p>
              </div>
              <div className="border-l-2 border-[#991B1B]/40 pl-3 py-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Doorstep Dispatch</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5">3-5 Business Days</p>
              </div>
            </div>
          </div>

          {/* Related Products Carousel/Grid */}
          {relatedProducts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                    Similar Wedding Invitation Designs
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Customers who viewed this also loved these handcrafted suites
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="text-xs font-extrabold text-[#991B1B] hover:text-[#7F1D1D] flex items-center gap-1 transition-colors"
                >
                  <span>Explore All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/shop/${rel.id}`}
                    className="bg-white rounded-xl border border-slate-200/70 hover:border-[#991B1B] shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="relative aspect-[3/4] bg-white overflow-hidden border-b border-slate-100">
                      <Image
                        src={rel.previewImage}
                        alt={rel.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 16vw"
                      />
                      {rel.badge && (
                        <div className="absolute top-2 left-2 bg-[#991B1B] text-white text-[7.5px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                          {rel.badge}
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-slate-900/90 text-white text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full">
                        ₹{rel.pricePerCard}
                      </div>
                    </div>
                    <div className="p-2 sm:p-2.5">
                      <h4 className="font-serif font-bold text-[11px] sm:text-xs text-slate-900 group-hover:text-[#991B1B] transition-colors truncate">
                        {rel.name}
                      </h4>
                      <p className="text-[9.5px] text-slate-500 mt-0.5">
                        ₹{rel.pricePerCard} / card
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ════════════════════════════════════════════════════════════
          ADDRESS SELECTION & MANAGEMENT MODAL
          ════════════════════════════════════════════════════════════ */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#991B1B] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Delivery Addresses</h3>
                  <p className="text-[11px] text-slate-500">
                    Select a delivery address or add a new one to your account.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setIsAddingAddressInModal(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
              {!session ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-[#991B1B] flex items-center justify-center">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Sign In Required</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Please sign in to view your saved addresses or save a new delivery address in your account.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/shop/${product.id}`)}`)
                    }
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In to Continue</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* List of Saved Addresses */}
                  {savedAddresses.length > 0 && !isAddingAddressInModal && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold text-slate-700">
                          Your Saved Addresses ({savedAddresses.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingAddressInModal(true);
                            const userPhone =
                              session.user && "phone" in session.user
                                ? String((session.user as { phone?: string }).phone || "")
                                : "";
                            setNewAddressForm({
                              name: session.user?.name || "",
                              phone: userPhone,
                              address: "",
                              city: "",
                              state: "",
                              pincode: "",
                              isDefault: false,
                            });
                          }}
                          className="text-xs font-bold text-[#991B1B] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Address</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {savedAddresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          const addrShipping = calculateShippingByPincode(addr.pincode);
                          return (
                            <div
                              key={addr.id}
                              onClick={() => handleSelectAddress(addr)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                                isSelected
                                  ? "border-[#991B1B] bg-red-50/40 ring-1 ring-[#991B1B]/40 shadow-xs"
                                  : "border-slate-200 hover:border-slate-300 bg-white"
                              }`}
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div
                                  className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center shrink-0 border ${
                                    isSelected ? "border-[#991B1B] bg-[#991B1B]" : "border-slate-300 bg-white"
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <div className="space-y-1 min-w-0 text-xs">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-slate-900">{addr.name}</span>
                                    <span className="text-[11px] font-mono text-slate-500">{addr.phone}</span>
                                    {addr.isDefault && (
                                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                                        DEFAULT
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                                    {addr.address}, {addr.city}
                                    {addr.state ? `, ${addr.state}` : ""} -{" "}
                                    <span className="font-mono font-bold text-slate-800">{addr.pincode}</span>
                                  </p>
                                  <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-0.5">
                                    <span>
                                      Delivery by <strong>{deliveryDateText}</strong> (8 days)
                                    </span>
                                    <span>•</span>
                                    <span
                                      className={
                                        addrShipping.shippingFee === 0
                                          ? "text-emerald-700 font-bold"
                                          : "text-slate-800 font-bold"
                                      }
                                    >
                                      {addrShipping.shippingFee === 0
                                        ? "FREE Delivery"
                                        : `Courier: ₹${addrShipping.shippingFee}`}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteAddress(addr.id, e)}
                                  title="Remove address"
                                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Add New Address Form (Inside Modal) */}
                  {(savedAddresses.length === 0 || isAddingAddressInModal) && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900">
                          {savedAddresses.length === 0
                            ? "Add Your Delivery Address"
                            : "Add New Delivery Address"}
                        </span>
                        {savedAddresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setIsAddingAddressInModal(false)}
                            className="text-xs text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                          >
                            ← Back to saved addresses
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={newAddressForm.name}
                          onChange={(e) =>
                            setNewAddressForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Recipient Full Name *"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-[#991B1B]"
                        />
                        <input
                          type="tel"
                          value={newAddressForm.phone}
                          onChange={(e) =>
                            setNewAddressForm((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          placeholder="WhatsApp Phone (10 digits) *"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-[#991B1B]"
                        />
                        <input
                          type="text"
                          value={newAddressForm.address}
                          onChange={(e) =>
                            setNewAddressForm((prev) => ({ ...prev, address: e.target.value }))
                          }
                          placeholder="Street Address, House / Flat No *"
                          className="sm:col-span-2 w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-[#991B1B]"
                        />
                        <input
                          type="text"
                          value={newAddressForm.city}
                          onChange={(e) =>
                            setNewAddressForm((prev) => ({ ...prev, city: e.target.value }))
                          }
                          placeholder="City / Town *"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-[#991B1B]"
                        />
                        <input
                          type="text"
                          maxLength={6}
                          value={newAddressForm.pincode}
                          onChange={(e) =>
                            setNewAddressForm((prev) => ({
                              ...prev,
                              pincode: e.target.value.replace(/\D/g, ""),
                            }))
                          }
                          placeholder="Postal PIN Code (6 digits) *"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-[#991B1B]"
                        />
                      </div>

                      {newAddressForm.pincode.length === 6 && (
                        <div className="text-xs text-slate-600 flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                          <span>
                            Delivery by <strong>{deliveryDateText}</strong> (8 days):
                          </span>
                          <strong className="text-slate-900">
                            {calculateShippingByPincode(newAddressForm.pincode).shippingFee === 0
                              ? "FREE Delivery"
                              : `Courier: ₹${calculateShippingByPincode(newAddressForm.pincode).shippingFee}`}
                          </strong>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          disabled={isSavingAddress}
                          onClick={handleSaveNewAddress}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isSavingAddress ? "Saving Address..." : "Save Address & Deliver Here"}</span>
                        </button>
                        {savedAddresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setIsAddingAddressInModal(false)}
                            className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
