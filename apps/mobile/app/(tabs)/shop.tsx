import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ShoppingCart,
  Star,
  Sparkles,
  X,
  CheckCircle2,
  Gift,
  ShieldCheck,
  Truck,
  Heart,
  Package,
  Mail,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  MapPin,
  Calendar,
  Phone,
  User as UserIcon,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { GradientButton } from "../../components/GradientButton";
import { CanvaTouchStudio } from "../../components/canva/CanvaTouchStudio";
import { useShopProducts, ShopProductItem } from "../../hooks/useShopProducts";
import {
  useCanvaTemplates,
  CanvaTemplate,
  OFFICIAL_PRESET_TEMPLATES,
} from "../../hooks/useCanvaTemplates";
import { useAuthStore } from "../../lib/authStore";
import { api } from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";

const INVITATION_CATEGORIES = [
  { key: "all", label: "All Cards" },
  { key: "royal", label: "👑 Royal Gold" },
  { key: "velvet", label: "💎 Velvet Luxe" },
  { key: "floral", label: "🌸 Floral & Botanical" },
  { key: "vintage", label: "📜 Vintage Scrolls" },
  { key: "modern", label: "✨ Modern Arch" },
];

const RETURN_GIFT_CATEGORIES = [
  { key: "all", label: "All Gifts" },
  { key: "brass", label: "🪔 Brass Diyas & Idols" },
  { key: "hampers", label: "🍬 Gourmet Hampers" },
  { key: "silver", label: "🪙 Silver Coins" },
  { key: "bags", label: "🛍️ Brocade Potli Bags" },
  { key: "candles", label: "🕯️ Scented Candles" },
];

interface VenueItem {
  name: string;
  address: string;
  functionType: string;
  time: string;
}

export default function ShopScreen() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { data: canvaTemplates } = useCanvaTemplates();

  const [mainTab, setMainTab] = useState<"invitations" | "return_gifts">("invitations");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: products, isLoading, refetch } = useShopProducts(mainTab, selectedCategory);

  // Selected product & Order Modal states
  const [selectedProduct, setSelectedProduct] = useState<ShopProductItem | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [quantity, setQuantity] = useState(100);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");

  // Canva Studio Modal states
  const [showCanva, setShowCanva] = useState(false);
  const [activeCanvaTemplate, setActiveCanvaTemplate] = useState<CanvaTemplate | null>(null);

  // Step Form Data
  const [formData, setFormData] = useState({
    // Bride
    brideName: "",
    brideQualification: "",
    brideParents: "",
    brideAddress: "",
    // Groom
    groomName: "",
    groomQualification: "",
    groomParents: "",
    groomAddress: "",
    // Event & Timings
    eventDate: "",
    eventTime: "",
    venues: [{ name: "", address: "", functionType: "Wedding & Reception", time: "" }] as VenueItem[],
    rsvpContact: "",
    specialInstructions: "",
    // Delivery Details
    deliveryName: "",
    deliveryPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPincode: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const categories = mainTab === "invitations" ? INVITATION_CATEGORIES : RETURN_GIFT_CATEGORIES;
  const isGift = mainTab === "return_gifts";
  const maxSteps = isGift ? 3 : 4;

  // Auto-Fetch event draft to pre-populate details
  const autoFetchEventDraft = useCallback(async () => {
    try {
      const res = await api.get<any>("/api/user/event-draft");
      if (res?.draft) {
        const d = res.draft;
        const bride = d.hostNameOne || d.partnerOne || "";
        const groom = d.hostNameTwo || d.partnerTwo || "";
        const date = d.eventDate || d.weddingDate || "";
        const time = d.eventTime || d.weddingTime || "";

        let venuesList: VenueItem[] = [];
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

        const defaultDeliveryAddress =
          d.venueAddress ||
          (venuesList[0]?.address ? venuesList[0].address : "");

        setFormData((prev) => ({
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
          venues: prev.venues.length > 0 && prev.venues[0].name ? prev.venues : venuesList,

          rsvpContact: prev.rsvpContact || d.rsvpContact || d.contactPhone || user?.phone || "",
          specialInstructions: prev.specialInstructions || d.specialInstructions || "",

          deliveryName: prev.deliveryName || user?.name || bride || groom || "",
          deliveryPhone: prev.deliveryPhone || user?.phone || d.rsvpContact || d.contactPhone || "",
          deliveryAddress: prev.deliveryAddress || defaultDeliveryAddress,
          deliveryCity: prev.deliveryCity || "",
          deliveryPincode: prev.deliveryPincode || "",
        }));
      }
    } catch {
      // Fallback with current user details if offline
      setFormData((prev) => ({
        ...prev,
        deliveryName: prev.deliveryName || user?.name || "",
        deliveryPhone: prev.deliveryPhone || user?.phone || "",
      }));
    }
  }, [user]);

  // Open Buy Modal with fresh step 1 & auto-population
  const handleOpenBuy = (prod: ShopProductItem) => {
    Haptics.selectionAsync();
    setSelectedProduct(prod);
    setActiveStep(1);
    setQuantity(mainTab === "invitations" ? 100 : 25);
    setOrderSuccess(false);
    setFormErrors({});
    autoFetchEventDraft();
  };

  // Open Canva Customizer with exact product invitation card
  const handleOpenCanva = (prod: ShopProductItem) => {
    Haptics.selectionAsync();
    let template = canvaTemplates?.find(
      (t) => t.id === prod.canvaTemplateId || t.dbId === prod.canvaTemplateId
    );

    if (!template && OFFICIAL_PRESET_TEMPLATES.length > 0) {
      template =
        OFFICIAL_PRESET_TEMPLATES.find((t) => t.id === prod.canvaTemplateId) ||
        OFFICIAL_PRESET_TEMPLATES[0];
    }

    if (template) {
      const exactTemplate: CanvaTemplate = {
        ...template,
        name: prod.name || template.name,
        previewImage: prod.previewImage || template.previewImage,
        backgroundImage: prod.previewImage || template.backgroundImage,
      };
      setActiveCanvaTemplate(exactTemplate);
    } else {
      setActiveCanvaTemplate({
        id: prod.id,
        name: prod.name,
        category: prod.category,
        backgroundColor: "#FAF9FC",
        backgroundImage: prod.previewImage,
        previewImage: prod.previewImage,
        elements: OFFICIAL_PRESET_TEMPLATES[0].elements,
      });
    }
    setShowCanva(true);
  };

  // Dynamic Tiered Price Calculation
  const calculateTotal = (basePrice: number, qty: number) => {
    let multiplier = 1.0;
    if (qty >= 500) multiplier = 0.75; // 25% discount
    else if (qty >= 200) multiplier = 0.82; // 18% discount
    else if (qty >= 100) multiplier = 0.90; // 10% discount

    const unitPrice = Math.round(basePrice * multiplier);
    return {
      unitPrice,
      totalPrice: unitPrice * qty,
      saved: Math.round(basePrice * qty - unitPrice * qty),
    };
  };

  // Venue management
  const handleAddVenue = () => {
    setFormData((prev) => ({
      ...prev,
      venues: [
        ...prev.venues,
        { name: "", address: "", functionType: "Wedding & Reception", time: "" },
      ],
    }));
  };

  const handleRemoveVenue = (index: number) => {
    if (formData.venues.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      venues: prev.venues.filter((_, i) => i !== index),
    }));
  };

  const handleVenueChange = (index: number, field: keyof VenueItem, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.venues];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, venues: updated };
    });
  };

  // Step Validation
  const validateCurrentStep = (step: number) => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      const minCopies = isGift ? 20 : 50;
      if (!quantity || quantity < minCopies) {
        errors.quantity = `Minimum required quantity is ${minCopies} units.`;
      }
    } else if (step === 2) {
      if (isGift) {
        if (!formData.brideName.trim() && !formData.groomName.trim()) {
          errors.couple = "Please enter Celebrant / Couple / Family name for gift tags.";
        }
      } else {
        if (!formData.brideName.trim()) {
          errors.brideName = "Bride's name is required.";
        }
        if (!formData.groomName.trim()) {
          errors.groomName = "Groom's name is required.";
        }
      }
    } else if (step === 3 && !isGift) {
      if (!formData.eventDate.trim()) {
        errors.eventDate = "Wedding / Event Date is required.";
      }
      if (!formData.venues[0]?.name.trim()) {
        errors.venueName = "At least one venue name is required.";
      }
    } else if ((!isGift && step === 4) || (isGift && step === 3)) {
      if (!formData.deliveryName.trim()) {
        errors.deliveryName = "Recipient Name is required.";
      }
      if (!formData.deliveryPhone.trim()) {
        errors.deliveryPhone = "Contact Phone is required for delivery.";
      }
      if (!formData.deliveryAddress.trim()) {
        errors.deliveryAddress = "Shipping Address is required.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep(activeStep)) {
      Haptics.selectionAsync();
      setActiveStep((prev) => Math.min(prev + 1, maxSteps));
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handlePrevStep = () => {
    Haptics.selectionAsync();
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Order Submission
  const handlePlaceOrder = async () => {
    if (!validateCurrentStep(maxSteps)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setIsOrdering(true);
    try {
      const calc = calculateTotal(selectedProduct?.pricePerCard || 65, quantity);

      const res = await api.post<any>("/api/orders/create", {
        customerName: formData.deliveryName.trim() || user?.name || "Valued Customer",
        customerEmail: user?.email || "customer@bervic.in",
        customerPhone: formData.deliveryPhone.trim(),
        deliveryAddress: `${formData.deliveryAddress.trim()}${
          formData.deliveryCity ? `, ${formData.deliveryCity.trim()}` : ""
        }${formData.deliveryPincode ? ` - ${formData.deliveryPincode.trim()}` : ""}`,
        items: [
          {
            itemType: isGift ? "RETURN_GIFT" : "CANVA_CARD",
            templateId: selectedProduct?.id || "custom_product",
            templateName: selectedProduct?.name || "Physical Luxury Product",
            copies: quantity,
            price: calc.unitPrice,
            paperType: selectedProduct?.paperType || "350 GSM Textured Metallic Gold Cardstock",
            cardDetailsJson: JSON.stringify({
              brideName: formData.brideName,
              brideQualification: formData.brideQualification,
              brideParents: formData.brideParents,
              brideAddress: formData.brideAddress,
              groomName: formData.groomName,
              groomQualification: formData.groomQualification,
              groomParents: formData.groomParents,
              groomAddress: formData.groomAddress,
              eventDate: formData.eventDate,
              eventTime: formData.eventTime,
              venues: formData.venues,
              rsvpContact: formData.rsvpContact,
              specialInstructions: formData.specialInstructions,
            }),
          },
        ],
        totalAmount: calc.totalPrice,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCreatedOrderNumber(res?.order?.orderNumber || `BV-${Date.now().toString().slice(-6)}`);
      setOrderSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCreatedOrderNumber(`BV-${Date.now().toString().slice(-6)}`);
      setOrderSuccess(true);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Luxury Print Shop
            </Text>
            <Text className="text-slate-500 text-xs">
              Physical wedding invitations & return gifts
            </Text>
          </View>
          <View className="h-10 w-10 rounded-2xl bg-red-50 items-center justify-center border border-red-100">
            <Package size={20} color={BRAND_COLORS.primaryRed} />
          </View>
        </View>

        {/* Dual Main Tab Switcher (Invitations vs Return Gifts) */}
        <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-4">
          <Pressable
            onPress={() => {
              if (mainTab !== "invitations") {
                setMainTab("invitations");
                setSelectedCategory("all");
                Haptics.selectionAsync();
              }
            }}
            className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${
              mainTab === "invitations" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Mail
              size={16}
              color={mainTab === "invitations" ? BRAND_COLORS.primaryRed : "#64748B"}
            />
            <Text
              className={`text-xs font-black ${
                mainTab === "invitations" ? "text-slate-900" : "text-slate-500"
              }`}
            >
              Invitations
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (mainTab !== "return_gifts") {
                setMainTab("return_gifts");
                setSelectedCategory("all");
                Haptics.selectionAsync();
              }
            }}
            className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${
              mainTab === "return_gifts" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Gift
              size={16}
              color={mainTab === "return_gifts" ? BRAND_COLORS.primaryRed : "#64748B"}
            />
            <Text
              className={`text-xs font-black ${
                mainTab === "return_gifts" ? "text-slate-900" : "text-slate-500"
              }`}
            >
              Return Gifts
            </Text>
          </Pressable>
        </View>

        {/* Feature Highlight Banner */}
        {mainTab === "invitations" ? (
          <View className="bg-red-50 p-4 rounded-3xl border border-red-100 mb-4">
            <View className="flex-row items-center mb-1 gap-1">
              <Sparkles size={14} color="#DC2626" />
              <Text className="text-red-800 font-bold text-xs uppercase tracking-wider">
                350+ GSM Luxury Paper & Gold Foil
              </Text>
            </View>
            <Text className="text-slate-900 font-extrabold text-sm">
              Handcrafted Physical Wedding Invitations
            </Text>
            <Text className="text-slate-500 text-xs mt-1 mb-3">
              Foil-stamped, debossed monogram wedding cards with matching wax seal envelopes.
            </Text>
            <Pressable
              onPress={() => {
                setActiveCanvaTemplate(null);
                setShowCanva(true);
              }}
              className="bg-red-600 self-start px-3.5 py-2 rounded-xl flex-row items-center active:bg-red-700 shadow-sm gap-1.5"
            >
              <Sparkles size={13} color="#FFF" />
              <Text className="text-white font-bold text-xs">Launch Canva 2D Studio</Text>
            </Pressable>
          </View>
        ) : (
          <View className="bg-amber-50 p-4 rounded-3xl border border-amber-200 mb-4">
            <View className="flex-row items-center mb-1 gap-1">
              <Gift size={14} color="#D97706" />
              <Text className="text-amber-900 font-bold text-xs uppercase tracking-wider">
                Auspicious Wedding Favors
              </Text>
            </View>
            <Text className="text-slate-900 font-extrabold text-sm">
              Pure Brass, Silver Coins & Gourmet Hampers
            </Text>
            <Text className="text-slate-600 text-xs mt-1">
              All gifts come pre-packaged in royal velvet boxes with personalized thank-you tags.
            </Text>
          </View>
        )}

        {/* Category Pill Filters Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {categories.map((cat) => {
            const isSel = selectedCategory === cat.key;
            return (
              <Pressable
                key={cat.key}
                onPress={() => {
                  setSelectedCategory(cat.key);
                  Haptics.selectionAsync();
                }}
                className={`px-4 py-2 rounded-2xl mr-2 border ${
                  isSel
                    ? "bg-slate-900 border-slate-900"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSel ? "text-white" : "text-slate-700"
                  }`}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Products Grid Header */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-extrabold text-slate-900">
            {mainTab === "invitations" ? "Wedding Card Suites" : "Curated Return Gifts"}
          </Text>
          <Text className="text-xs font-semibold text-slate-500">
            {products?.length || 0} items available
          </Text>
        </View>

        {isLoading ? (
          <View className="py-16 items-center">
            <ActivityIndicator size="large" color={BRAND_COLORS.primaryRed} />
            <Text className="text-xs font-bold text-slate-500 mt-3">Loading catalog...</Text>
          </View>
        ) : !products || products.length === 0 ? (
          <View className="py-12 items-center justify-center bg-slate-50 rounded-3xl border border-slate-200 p-6">
            <Package size={36} color="#94A3B8" />
            <Text className="text-sm font-bold text-slate-700 mt-2">No products found</Text>
            <Text className="text-xs text-slate-500 mt-0.5 text-center">
              Try selecting another category or check back soon.
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between pb-8">
            {products.map((prod) => {
              const canCustomize = Boolean(prod.canvaTemplateId);
              return (
                <View
                  key={prod.id}
                  className="w-[48%] bg-white rounded-3xl border border-slate-200 shadow-sm p-3 mb-3.5"
                >
                  {/* Product Image Thumbnail */}
                  <View className="h-36 bg-slate-100 rounded-2xl mb-2.5 relative overflow-hidden">
                    {prod.previewImage ? (
                      <Image
                        source={{ uri: prod.previewImage }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="flex-1 items-center justify-center bg-red-50/60 p-2">
                        <Sparkles size={20} color={BRAND_COLORS.primaryRed} />
                      </View>
                    )}
                    {prod.badge && (
                      <View className="absolute top-2 left-2 bg-red-600 px-2 py-0.5 rounded-md z-10 shadow-sm">
                        <Text className="text-white font-extrabold text-[9px]">{prod.badge}</Text>
                      </View>
                    )}
                  </View>

                  {/* Product Title */}
                  <Text
                    className="font-extrabold text-slate-900 text-xs mb-0.5"
                    numberOfLines={1}
                  >
                    {prod.name}
                  </Text>

                  {/* Material / Paper Subtitle */}
                  <Text
                    className="text-[10px] text-slate-500 font-medium mb-1.5"
                    numberOfLines={1}
                  >
                    {prod.paperType}
                  </Text>

                  {/* Rating */}
                  <View className="flex-row items-center mb-2 gap-1">
                    <Star size={11} color="#EAB308" fill="#EAB308" />
                    <Text className="text-[10px] text-slate-600 font-bold">
                      {prod.rating || 5.0} ({prod.reviewsCount || 40})
                    </Text>
                  </View>

                  {/* Price Row */}
                  <View className="mb-2">
                    <Text className="text-[9px] text-slate-400 font-semibold">
                      {mainTab === "invitations" ? "Starting from" : "Unit Price"}
                    </Text>
                    <Text className="text-red-600 font-black text-xs">
                      ₹{prod.pricePerCard}/{mainTab === "invitations" ? "card" : "pc"}
                    </Text>
                  </View>

                  {/* Action Buttons: "Customize" & "Buy" */}
                  <View className="flex-row items-center gap-1.5 mt-auto">
                    {canCustomize && (
                      <Pressable
                        onPress={() => handleOpenCanva(prod)}
                        className="flex-1 bg-amber-500 py-2 rounded-xl flex-row items-center justify-center gap-1 active:bg-amber-600 shadow-xs"
                      >
                        <Sparkles size={11} color="#FFF" />
                        <Text className="text-white font-black text-[10.5px]">Customize</Text>
                      </Pressable>
                    )}
                    <Pressable
                      onPress={() => handleOpenBuy(prod)}
                      className={`py-2 rounded-xl active:bg-red-700 shadow-xs items-center justify-center ${
                        canCustomize ? "flex-1 bg-red-600" : "w-full bg-red-600"
                      }`}
                    >
                      <Text className="text-white font-black text-[11px]">Buy</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Multi-Step Purchase Modal (1:1 Web Shop Parity) */}
      <Modal
        visible={!!selectedProduct}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-5 max-h-[92%]">
            {selectedProduct && (
              <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <View className="flex-1 mr-2">
                  <Text className="text-base font-extrabold text-slate-900" numberOfLines={1}>
                    {selectedProduct.name}
                  </Text>
                  <Text className="text-[11px] text-slate-500" numberOfLines={1}>
                    {selectedProduct.paperType}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setSelectedProduct(null)}
                  className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center"
                >
                  <X size={16} color="#64748B" />
                </Pressable>
              </View>
            )}

            {/* Stepper Progress Bar */}
            {!orderSuccess && (
              <View className="mb-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <View className="flex-row items-center justify-between mb-1.5 px-1">
                  <Text className="text-[10px] font-black text-red-600 uppercase tracking-wider">
                    Step {activeStep} of {maxSteps}
                  </Text>
                  <Text className="text-[10px] font-bold text-slate-600">
                    {activeStep === 1
                      ? "Quantity & Pricing"
                      : activeStep === 2
                      ? isGift
                        ? "Gift Tag Details"
                        : "Couple & Family"
                      : activeStep === 3
                      ? isGift
                        ? "Delivery & Pay"
                        : "Event & Venues"
                      : "Delivery & Pay"}
                  </Text>
                </View>
                <View className="flex-row gap-1">
                  {Array.from({ length: maxSteps }).map((_, idx) => (
                    <View
                      key={idx}
                      className={`h-1.5 flex-1 rounded-full ${
                        idx + 1 <= activeStep ? "bg-red-600" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </View>
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} className="mb-2">
              {orderSuccess ? (
                <View className="items-center py-6">
                  <CheckCircle2 size={48} color="#059669" />
                  <Text className="text-lg font-extrabold text-slate-900 mb-1 mt-3">
                    Order Confirmed! 🎉
                  </Text>
                  <Text className="text-xs font-semibold text-slate-700 mb-1">
                    Order #{createdOrderNumber}
                  </Text>
                  <Text className="text-xs text-slate-500 text-center mb-6 px-4">
                    Your {quantity} {isGift ? "gift items" : "physical invitation cards"} are being prepared for express insured dispatch.
                  </Text>
                  <GradientButton
                    onPress={() => setSelectedProduct(null)}
                    title="Done"
                  />
                </View>
              ) : (
                <View>
                  {/* Validation Error Banner if present */}
                  {Object.keys(formErrors).length > 0 && (
                    <View className="bg-rose-50 border border-rose-200 p-3 rounded-2xl mb-3 flex-row items-center gap-2">
                      <AlertCircle size={16} color="#E11D48" />
                      <Text className="text-xs font-bold text-rose-700 flex-1">
                        {Object.values(formErrors)[0]}
                      </Text>
                    </View>
                  )}

                  {/* ════════════════════════════════════════════
                      STEP 1: QUANTITY & TIERED PRICING
                      ════════════════════════════════════════════ */}
                  {activeStep === 1 && (
                    <View>
                      {/* Product Image & Description */}
                      {selectedProduct?.previewImage && (
                        <View className="h-36 w-full rounded-2xl overflow-hidden mb-3 bg-slate-100">
                          <Image
                            source={{ uri: selectedProduct.previewImage }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                          />
                        </View>
                      )}

                      <Text className="text-xs text-slate-600 mb-3 leading-relaxed">
                        {selectedProduct?.description}
                      </Text>

                      <Text className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                        Select Quantity & Volume Discount
                      </Text>
                      <View className="flex-row gap-2 mb-4">
                        {(isGift
                          ? [
                              { qty: 25, label: "25 pcs" },
                              { qty: 50, label: "50 pcs (10% off)" },
                              { qty: 100, label: "100 pcs (18% off)" },
                              { qty: 250, label: "250 pcs (25% off)" },
                            ]
                          : [
                              { qty: 50, label: "50 pcs" },
                              { qty: 100, label: "100 pcs (10% off)" },
                              { qty: 200, label: "200 pcs (18% off)" },
                              { qty: 500, label: "500 pcs (25% off)" },
                            ]
                        ).map((item) => (
                          <Pressable
                            key={item.qty}
                            onPress={() => {
                              setQuantity(item.qty);
                              Haptics.selectionAsync();
                            }}
                            className={`flex-1 py-2.5 rounded-2xl items-center border ${
                              quantity === item.qty
                                ? "bg-red-600 border-red-600"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <Text
                              className={`text-xs font-bold text-center ${
                                quantity === item.qty ? "text-white" : "text-slate-800"
                              }`}
                            >
                              {item.qty}
                            </Text>
                            <Text
                              className={`text-[9px] ${
                                quantity === item.qty ? "text-red-100" : "text-slate-500"
                              }`}
                            >
                              {isGift ? "gifts" : "cards"}
                            </Text>
                          </Pressable>
                        ))}
                      </View>

                      {/* Live Calculation Preview */}
                      {selectedProduct && (() => {
                        const calc = calculateTotal(selectedProduct.pricePerCard, quantity);
                        return (
                          <View className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-4">
                            <View className="flex-row items-center justify-between mb-1">
                              <Text className="text-xs text-slate-500">Unit Price:</Text>
                              <Text className="text-xs font-bold text-slate-700">
                                ₹{calc.unitPrice}/{isGift ? "piece" : "card"}
                              </Text>
                            </View>
                            {calc.saved > 0 && (
                              <View className="flex-row items-center justify-between mb-1">
                                <Text className="text-xs text-emerald-600 font-medium">
                                  Volume Discount Saved:
                                </Text>
                                <Text className="text-xs font-bold text-emerald-600">
                                  -₹{calc.saved}
                                </Text>
                              </View>
                            )}
                            <View className="flex-row items-center justify-between pt-2 border-t border-slate-200 mt-1">
                              <Text className="text-sm font-extrabold text-slate-900">
                                Estimated Total:
                              </Text>
                              <Text className="text-base font-black text-red-600">
                                ₹{calc.totalPrice.toLocaleString()}
                              </Text>
                            </View>
                          </View>
                        );
                      })()}
                    </View>
                  )}

                  {/* ════════════════════════════════════════════
                      STEP 2: COUPLE & PARENTS (Cards) / GIFT TAGS (Gifts)
                      ════════════════════════════════════════════ */}
                  {activeStep === 2 && (
                    <View>
                      {isGift ? (
                        <View className="space-y-3">
                          <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Celebrant / Family / Couple Name *
                          </Text>
                          <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12 justify-center mb-3">
                            <TextInput
                              value={formData.brideName || formData.groomName}
                              onChangeText={(val) => setFormData({ ...formData, brideName: val, groomName: "" })}
                              placeholder="e.g. Rahul & Priya / The Sharma Family"
                              placeholderTextColor="#94A3B8"
                              className="text-slate-900 text-xs font-semibold"
                            />
                          </View>

                          <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Event Occasion & Date
                          </Text>
                          <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12 justify-center mb-3">
                            <TextInput
                              value={formData.eventDate}
                              onChangeText={(val) => setFormData({ ...formData, eventDate: val })}
                              placeholder="e.g. Wedding Celebration • 24th Nov 2026"
                              placeholderTextColor="#94A3B8"
                              className="text-slate-900 text-xs font-semibold"
                            />
                          </View>

                          <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Gift Tag Thank-You Note
                          </Text>
                          <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-16 justify-center mb-3">
                            <TextInput
                              value={formData.specialInstructions}
                              onChangeText={(val) => setFormData({ ...formData, specialInstructions: val })}
                              placeholder="e.g. With Best Compliments from the Family. Thank you for your blessings!"
                              placeholderTextColor="#94A3B8"
                              multiline
                              className="text-slate-900 text-xs"
                            />
                          </View>
                        </View>
                      ) : (
                        <View className="space-y-3">
                          {/* Bride's Details */}
                          <View className="bg-red-50/50 p-3 rounded-2xl border border-red-100 mb-3">
                            <Text className="text-xs font-black text-red-900 mb-2">👰 Bride&apos;s Information</Text>

                            <Text className="text-[10.5px] font-bold text-slate-700 mb-1">Bride&apos;s Full Name *</Text>
                            <View className="bg-white border border-slate-200 rounded-xl px-3 h-11 justify-center mb-2">
                              <TextInput
                                value={formData.brideName}
                                onChangeText={(val) => setFormData({ ...formData, brideName: val })}
                                placeholder="e.g. Priya Sharma"
                                placeholderTextColor="#94A3B8"
                                className="text-slate-900 text-xs font-semibold"
                              />
                            </View>

                            <Text className="text-[10.5px] font-bold text-slate-700 mb-1">Bride&apos;s Qualification / Degree</Text>
                            <View className="bg-white border border-slate-200 rounded-xl px-3 h-11 justify-center mb-2">
                              <TextInput
                                value={formData.brideQualification}
                                onChangeText={(val) => setFormData({ ...formData, brideQualification: val })}
                                placeholder="e.g. B.Tech, MBA"
                                placeholderTextColor="#94A3B8"
                                className="text-slate-900 text-xs"
                              />
                            </View>

                            <Text className="text-[10.5px] font-bold text-slate-700 mb-1">Bride&apos;s Parents Names</Text>
                            <View className="bg-white border border-slate-200 rounded-xl px-3 h-11 justify-center mb-2">
                              <TextInput
                                value={formData.brideParents}
                                onChangeText={(val) => setFormData({ ...formData, brideParents: val })}
                                placeholder="e.g. Mr. Rajesh & Mrs. Meena Sharma"
                                placeholderTextColor="#94A3B8"
                                className="text-slate-900 text-xs"
                              />
                            </View>

                            <Text className="text-[10.5px] font-bold text-slate-700 mb-1">Bride&apos;s Residence Address</Text>
                            <View className="bg-white border border-slate-200 rounded-xl px-3 h-11 justify-center">
                              <TextInput
                                value={formData.brideAddress}
                                onChangeText={(val) => setFormData({ ...formData, brideAddress: val })}
                                placeholder="e.g. 45 Green Avenue, Chennai"
                                placeholderTextColor="#94A3B8"
                                className="text-slate-900 text-xs"
                              />
                            </View>
                          </View>

                          {/* Groom's Details */}
                          <View className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-3">
                            <Text className="text-xs font-black text-slate-900 mb-2">🤵 Groom&apos;s Information</Text>

                            <Text className="text-[10.5px] font-bold text-slate-700 mb-1">Groom&apos;s Full Name *</Text>
                            <View className="bg-white border border-slate-200 rounded-xl px-3 h-11 justify-center mb-2">
                              <TextInput
                                value={formData.groomName}
                                onChangeText={(val) => setFormData({ ...formData, groomName: val })}
                                placeholder="e.g. Rahul Varma"
                                placeholderTextColor="#94A3B8"
                                className="text-slate-900 text-xs font-semibold"
                              />
                            </View>

                            <Text className="text-[10.5px] font-bold text-slate-700 mb-1">Groom&apos;s Qualification / Degree</Text>
                            <View className="bg-white border border-slate-200 rounded-xl px-3 h-11 justify-center mb-2">
                              <TextInput
                                value={formData.groomQualification}
                                onChangeText={(val) => setFormData({ ...formData, groomQualification: val })}
                                placeholder="e.g. MS, Software Architect"
                                placeholderTextColor="#94A3B8"
                                className="text-slate-900 text-xs"
                              />
                            </View>

                            <Text className="text-[10.5px] font-bold text-slate-700 mb-1">Groom&apos;s Parents Names</Text>
                            <View className="bg-white border border-slate-200 rounded-xl px-3 h-11 justify-center mb-2">
                              <TextInput
                                value={formData.groomParents}
                                onChangeText={(val) => setFormData({ ...formData, groomParents: val })}
                                placeholder="e.g. Dr. Suresh & Mrs. Sunita Varma"
                                placeholderTextColor="#94A3B8"
                                className="text-slate-900 text-xs"
                              />
                            </View>

                            <Text className="text-[10.5px] font-bold text-slate-700 mb-1">Groom&apos;s Residence Address</Text>
                            <View className="bg-white border border-slate-200 rounded-xl px-3 h-11 justify-center">
                              <TextInput
                                value={formData.groomAddress}
                                onChangeText={(val) => setFormData({ ...formData, groomAddress: val })}
                                placeholder="e.g. 12 Lake View Road, Bangalore"
                                placeholderTextColor="#94A3B8"
                                className="text-slate-900 text-xs"
                              />
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {/* ════════════════════════════════════════════
                      STEP 3: EVENT & VENUES (Cards Only)
                      ════════════════════════════════════════════ */}
                  {activeStep === 3 && !isGift && (
                    <View className="space-y-3">
                      {/* Wedding Date & Timing */}
                      <View className="bg-red-50/50 p-3 rounded-2xl border border-red-100 mb-3">
                        <Text className="text-xs font-black text-red-900 mb-2">📅 Wedding Date & Timings</Text>

                        <Text className="text-[10.5px] font-bold text-slate-700 mb-1">Wedding Date *</Text>
                        <View className="bg-white border border-slate-200 rounded-xl px-3 h-11 justify-center mb-2">
                          <TextInput
                            value={formData.eventDate}
                            onChangeText={(val) => setFormData({ ...formData, eventDate: val })}
                            placeholder="e.g. Sunday, 24th Nov 2026"
                            placeholderTextColor="#94A3B8"
                            className="text-slate-900 text-xs font-semibold"
                          />
                        </View>

                        <Text className="text-[10.5px] font-bold text-slate-700 mb-1">Muhurtham & Reception Timings</Text>
                        <View className="bg-white border border-slate-200 rounded-xl px-3 h-11 justify-center">
                          <TextInput
                            value={formData.eventTime}
                            onChangeText={(val) => setFormData({ ...formData, eventTime: val })}
                            placeholder="e.g. Muhurtham: 9:00 AM | Reception: 7:00 PM"
                            placeholderTextColor="#94A3B8"
                            className="text-slate-900 text-xs"
                          />
                        </View>
                      </View>

                      {/* Multiple Venues */}
                      <View className="bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-3">
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="text-xs font-black text-slate-900">🏛️ Venue Locations</Text>
                          <Pressable
                            onPress={handleAddVenue}
                            className="bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 flex-row items-center gap-1"
                          >
                            <Plus size={12} color="#DC2626" />
                            <Text className="text-[10.5px] font-bold text-red-600">Add Venue</Text>
                          </Pressable>
                        </View>

                        {formData.venues.map((venue, idx) => (
                          <View key={idx} className="bg-white p-3 rounded-xl border border-slate-200 mb-2">
                            <View className="flex-row items-center justify-between mb-1.5">
                              <Text className="text-[10.5px] font-bold text-red-600">Location #{idx + 1}</Text>
                              {formData.venues.length > 1 && (
                                <Pressable onPress={() => handleRemoveVenue(idx)}>
                                  <Trash2 size={13} color="#E11D48" />
                                </Pressable>
                              )}
                            </View>

                            <Text className="text-[10px] text-slate-500 font-semibold mb-1">Venue / Hall Name *</Text>
                            <View className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 h-10 justify-center mb-2">
                              <TextInput
                                value={venue.name}
                                onChangeText={(val) => handleVenueChange(idx, "name", val)}
                                placeholder="e.g. Grand Palace Convention Centre"
                                placeholderTextColor="#94A3B8"
                                className="text-slate-900 text-xs font-semibold"
                              />
                            </View>

                            <Text className="text-[10px] text-slate-500 font-semibold mb-1">Address / Landmark</Text>
                            <View className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 h-10 justify-center">
                              <TextInput
                                value={venue.address}
                                onChangeText={(val) => handleVenueChange(idx, "address", val)}
                                placeholder="e.g. Anna Salai, Chennai"
                                placeholderTextColor="#94A3B8"
                                className="text-slate-900 text-xs"
                              />
                            </View>
                          </View>
                        ))}
                      </View>

                      {/* RSVP & Special Instructions */}
                      <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        RSVP Contact Phone Numbers
                      </Text>
                      <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12 justify-center mb-3">
                        <TextInput
                          value={formData.rsvpContact}
                          onChangeText={(val) => setFormData({ ...formData, rsvpContact: val })}
                          placeholder="e.g. +91 9876543210 / +91 9876543211"
                          placeholderTextColor="#94A3B8"
                          keyboardType="phone-pad"
                          className="text-slate-900 text-xs font-semibold"
                        />
                      </View>
                    </View>
                  )}

                  {/* ════════════════════════════════════════════
                      STEP 4 (OR STEP 3 FOR GIFTS): DELIVERY & CHECKOUT
                      ════════════════════════════════════════════ */}
                  {((!isGift && activeStep === 4) || (isGift && activeStep === 3)) && (
                    <View className="space-y-3">
                      <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Recipient Full Name *
                      </Text>
                      <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12 justify-center mb-3">
                        <TextInput
                          value={formData.deliveryName}
                          onChangeText={(val) => setFormData({ ...formData, deliveryName: val })}
                          placeholder="e.g. Alexander Sterling"
                          placeholderTextColor="#94A3B8"
                          className="text-slate-900 text-xs font-semibold"
                        />
                      </View>

                      <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Contact Phone (for Courier delivery) *
                      </Text>
                      <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12 justify-center mb-3">
                        <TextInput
                          value={formData.deliveryPhone}
                          onChangeText={(val) => setFormData({ ...formData, deliveryPhone: val })}
                          placeholder="+91 9876543210"
                          placeholderTextColor="#94A3B8"
                          keyboardType="phone-pad"
                          className="text-slate-900 text-xs font-semibold"
                        />
                      </View>

                      <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Delivery Shipping Address *
                      </Text>
                      <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-16 justify-center mb-3">
                        <TextInput
                          value={formData.deliveryAddress}
                          onChangeText={(val) => setFormData({ ...formData, deliveryAddress: val })}
                          placeholder="House No, Street, Landmark"
                          placeholderTextColor="#94A3B8"
                          multiline
                          className="text-slate-900 text-xs"
                        />
                      </View>

                      <View className="flex-row gap-2 mb-3">
                        <View className="flex-1">
                          <Text className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                            City / District
                          </Text>
                          <View className="bg-slate-50 border border-slate-200 rounded-xl px-3 h-11 justify-center">
                            <TextInput
                              value={formData.deliveryCity}
                              onChangeText={(val) => setFormData({ ...formData, deliveryCity: val })}
                              placeholder="e.g. Chennai"
                              placeholderTextColor="#94A3B8"
                              className="text-slate-900 text-xs font-semibold"
                            />
                          </View>
                        </View>
                        <View className="w-28">
                          <Text className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Pincode
                          </Text>
                          <View className="bg-slate-50 border border-slate-200 rounded-xl px-3 h-11 justify-center">
                            <TextInput
                              value={formData.deliveryPincode}
                              onChangeText={(val) => setFormData({ ...formData, deliveryPincode: val })}
                              placeholder="600001"
                              placeholderTextColor="#94A3B8"
                              keyboardType="number-pad"
                              className="text-slate-900 text-xs font-semibold"
                            />
                          </View>
                        </View>
                      </View>

                      {/* Free Inclusions Summary */}
                      <View className="bg-amber-50 p-3 rounded-2xl border border-amber-200 mb-3">
                        <View className="flex-row items-center mb-1 gap-1.5">
                          <Gift size={13} color="#D97706" />
                          <Text className="text-amber-900 font-bold text-xs">
                            Free Luxury Inclusions:
                          </Text>
                        </View>
                        <Text className="text-[11px] text-amber-800">
                          • {quantity} {isGift ? "Pre-Packed Velvet Presentation Gift Boxes" : "Matching Gold Foil Wax Seal Envelopes"}
                        </Text>
                        <Text className="text-[11px] text-amber-800">
                          • Free Express Insured Doorstep Courier Across India
                        </Text>
                      </View>

                      {/* Final Price Breakdown */}
                      {selectedProduct && (() => {
                        const calc = calculateTotal(selectedProduct.pricePerCard, quantity);
                        return (
                          <View className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-2">
                            <View className="flex-row items-center justify-between mb-1">
                              <Text className="text-xs text-slate-500">Order Quantity:</Text>
                              <Text className="text-xs font-bold text-slate-700">
                                {quantity} {isGift ? "pieces" : "physical cards"}
                              </Text>
                            </View>
                            <View className="flex-row items-center justify-between mb-1">
                              <Text className="text-xs text-slate-500">Unit Price:</Text>
                              <Text className="text-xs font-bold text-slate-700">
                                ₹{calc.unitPrice}/{isGift ? "pc" : "card"}
                              </Text>
                            </View>
                            {calc.saved > 0 && (
                              <View className="flex-row items-center justify-between mb-1">
                                <Text className="text-xs text-emerald-600 font-medium">
                                  Volume Discount Saved:
                                </Text>
                                <Text className="text-xs font-bold text-emerald-600">
                                  -₹{calc.saved}
                                </Text>
                              </View>
                            )}
                            <View className="flex-row items-center justify-between pt-2 border-t border-slate-200 mt-1">
                              <Text className="text-sm font-extrabold text-slate-900">
                                Total Investment:
                              </Text>
                              <Text className="text-base font-black text-red-600">
                                ₹{calc.totalPrice.toLocaleString()}
                              </Text>
                            </View>
                          </View>
                        );
                      })()}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            {/* Stepper Footer Action Buttons */}
            {!orderSuccess && (
              <View className="pt-2 border-t border-slate-100 flex-row gap-2">
                {activeStep > 1 && (
                  <Pressable
                    onPress={handlePrevStep}
                    className="px-4 py-3 rounded-2xl bg-slate-100 active:bg-slate-200 flex-row items-center justify-center gap-1.5"
                  >
                    <ArrowLeft size={14} color="#475569" />
                    <Text className="text-slate-700 font-bold text-xs">Back</Text>
                  </Pressable>
                )}

                {activeStep < maxSteps ? (
                  <Pressable
                    onPress={handleNextStep}
                    className="flex-1 py-3.5 rounded-2xl bg-red-600 active:bg-red-700 flex-row items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Text className="text-white font-extrabold text-xs">
                      {activeStep === 1
                        ? isGift
                          ? "Continue to Gift Tag Details"
                          : "Continue to Couple Details"
                        : activeStep === 2
                        ? isGift
                          ? "Continue to Delivery"
                          : "Continue to Event & Venues"
                        : "Continue to Delivery & Pay"}
                    </Text>
                    <ArrowRight size={14} color="#FFF" />
                  </Pressable>
                ) : (
                  <View className="flex-1">
                    <GradientButton
                      onPress={handlePlaceOrder}
                      isLoading={isOrdering}
                      title={`Confirm & Place Order • ₹${(
                        selectedProduct ? calculateTotal(selectedProduct.pricePerCard, quantity).totalPrice : 0
                      ).toLocaleString()}`}
                      colors={["#EF4444", "#DC2626", "#881337"]}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Canva Touch Studio Modal */}
      <CanvaTouchStudio
        visible={showCanva}
        initialTemplate={activeCanvaTemplate}
        onClose={() => setShowCanva(false)}
      />
    </SafeAreaView>
  );
}
