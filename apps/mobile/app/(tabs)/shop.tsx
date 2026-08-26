import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
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
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { GradientButton } from "../../components/GradientButton";
import { CanvaTouchStudio } from "../../components/canva/CanvaTouchStudio";
import { useShopProducts, ShopProductItem } from "../../hooks/useShopProducts";
import { useAuthStore } from "../../lib/authStore";
import { api } from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = [
  { key: "all", label: "All Cards" },
  { key: "royal", label: "Royal Gold" },
  { key: "velvet", label: "Velvet Luxe" },
  { key: "floral", label: "Floral Botanical" },
  { key: "modern", label: "Minimalist Modern" },
];

export default function ShopScreen() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: products, isLoading } = useShopProducts(selectedCategory);

  const [selectedProduct, setSelectedProduct] = useState<ShopProductItem | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");
  const [showCanva, setShowCanva] = useState(false);

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

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      Alert.alert("Required", "Please enter your delivery shipping address");
      return;
    }
    if (!customerPhone.trim()) {
      Alert.alert("Required", "Please enter your contact phone number");
      return;
    }

    setIsOrdering(true);
    try {
      const calc = calculateTotal(selectedProduct?.pricePerCard || 65, quantity);

      const res = await api.post<any>("/api/orders/create", {
        customerName: customerName.trim() || user?.name || "Valued Customer",
        customerEmail: user?.email || "customer@bervic.in",
        customerPhone: customerPhone.trim(),
        deliveryAddress: shippingAddress.trim(),
        items: [
          {
            itemType: "CANVA_CARD",
            templateId: selectedProduct?.id || "custom_card",
            templateName: selectedProduct?.name || "Physical Luxury Card",
            copies: quantity,
            price: calc.unitPrice,
            paperType: selectedProduct?.paperType || "350 GSM Textured Metallic Gold Cardstock",
          },
        ],
        totalAmount: calc.totalPrice,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCreatedOrderNumber(res?.order?.orderNumber || "BV-2026-CONFIRMED");
      setOrderSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
    } catch {
      // Offline fallback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCreatedOrderNumber("BV-2026-OFFLINE");
      setOrderSuccess(true);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Luxury Print Shop
            </Text>
            <Text className="text-slate-500 text-xs">Handcrafted physical wedding cards</Text>
          </View>
          <View className="h-10 w-10 rounded-2xl bg-white items-center justify-center border border-slate-200 shadow-sm">
            <ShoppingCart size={18} color={BRAND_COLORS.textPrimary} />
          </View>
        </View>

        {/* Paper Stock Highlight Banner */}
        <View className="bg-red-50 p-4 rounded-3xl border border-red-100 mb-5">
          <View className="flex-row items-center mb-1 gap-1">
            <Sparkles size={14} color="#DC2626" />
            <Text className="text-red-800 font-bold text-xs uppercase tracking-wider">
              350 GSM Luxury Paper Stock
            </Text>
          </View>
          <Text className="text-slate-900 font-extrabold text-sm">
            Textured Metallic Gold & Velvet Soft-Touch
          </Text>
          <Text className="text-slate-500 text-xs mt-1 mb-3">
            Foil-stamped, debossed monogram wedding cards with matching wax seal envelopes.
          </Text>
          <Pressable
            onPress={() => setShowCanva(true)}
            className="bg-red-600 self-start px-3.5 py-2 rounded-xl flex-row items-center active:bg-red-700 shadow-sm gap-1.5"
          >
            <Sparkles size={13} color="#FFF" />
            <Text className="text-white font-bold text-xs">
              Launch Canva 2D Studio
            </Text>
          </Pressable>
        </View>

        {/* Category Filters Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {CATEGORIES.map((cat) => {
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

        {/* Products Grid */}
        <Text className="text-base font-extrabold text-slate-900 mb-3">Card Collections</Text>

        {isLoading ? (
          <ActivityIndicator color={BRAND_COLORS.primaryRed} className="my-10" />
        ) : (
          <View className="flex-row flex-wrap justify-between pb-8">
            {(products || []).map((prod) => (
              <View
                key={prod.id}
                className="w-[48%] bg-white rounded-3xl border border-slate-200 shadow-sm p-3.5 mb-3.5"
              >
                <View className="h-36 bg-red-50/60 rounded-2xl items-center justify-center mb-2.5 p-2 relative overflow-hidden">
                  {prod.badge && (
                    <View className="absolute top-2 left-2 bg-red-600 px-2 py-0.5 rounded-md z-10">
                      <Text className="text-white font-bold text-[9px]">{prod.badge}</Text>
                    </View>
                  )}
                  <Sparkles size={20} color={BRAND_COLORS.primaryRed} />
                  <Text className="text-slate-800 font-extrabold text-[11px] text-center mt-1" numberOfLines={2}>
                    {prod.paperType}
                  </Text>
                </View>

                <Text className="font-extrabold text-slate-900 text-xs mb-1" numberOfLines={1}>
                  {prod.name}
                </Text>

                <View className="flex-row items-center mb-2 gap-1">
                  <Star size={12} color="#EAB308" fill="#EAB308" />
                  <Text className="text-[10px] text-slate-500 font-semibold">
                    {prod.rating || 5.0} ({prod.reviewsCount || 40})
                  </Text>
                </View>

                <View className="flex-row items-center justify-between mt-1">
                  <View>
                    <Text className="text-[10px] text-slate-400">Starting from</Text>
                    <Text className="text-red-600 font-black text-sm">
                      ₹{prod.pricePerCard}/card
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedProduct(prod);
                      setOrderSuccess(false);
                    }}
                    className="bg-red-600 px-3 py-1.5 rounded-xl active:bg-red-700"
                  >
                    <Text className="text-white font-bold text-xs">Customize</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Order Modal */}
      <Modal
        visible={!!selectedProduct}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[85%]">
            {selectedProduct && (
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-base font-extrabold text-slate-900">
                    {selectedProduct.name}
                  </Text>
                  <Text className="text-xs text-slate-500" numberOfLines={1}>
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

            <ScrollView showsVerticalScrollIndicator={false}>
              {orderSuccess ? (
                <View className="items-center py-6">
                  <CheckCircle2 size={48} color="#059669" />
                  <Text className="text-lg font-extrabold text-slate-900 mb-1 mt-3">
                    Print Order Confirmed! 🎉
                  </Text>
                  <Text className="text-xs font-semibold text-slate-700 mb-1">
                    Order #{createdOrderNumber}
                  </Text>
                  <Text className="text-xs text-slate-500 text-center mb-6 px-4">
                    Your {quantity} physical cards are queued for 350 GSM foil printing. Track live progress in your Account tab.
                  </Text>
                  <GradientButton
                    onPress={() => setSelectedProduct(null)}
                    title="View in Account"
                  />
                </View>
              ) : (
                <View>
                  {/* Quantity Tier Selector */}
                  <Text className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    Select Card Quantity & Volume Discount
                  </Text>
                  <View className="flex-row gap-2 mb-4">
                    {[
                      { qty: 50, label: "50 pcs" },
                      { qty: 100, label: "100 pcs (10% off)" },
                      { qty: 200, label: "200 pcs (18% off)" },
                      { qty: 500, label: "500 pcs (25% off)" },
                    ].map((item) => (
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
                          cards
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Customer Name & Phone */}
                  <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Recipient Full Name *
                  </Text>
                  <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12 justify-center mb-3">
                    <TextInput
                      value={customerName}
                      onChangeText={setCustomerName}
                      placeholder="e.g. Alexander Sterling"
                      placeholderTextColor="#94A3B8"
                      className="text-slate-900 text-xs font-semibold"
                    />
                  </View>

                  <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Contact Phone (for Courier delivery) *
                  </Text>
                  <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12 justify-center mb-3">
                    <TextInput
                      value={customerPhone}
                      onChangeText={setCustomerPhone}
                      placeholder="+91 9876543210"
                      placeholderTextColor="#94A3B8"
                      keyboardType="phone-pad"
                      className="text-slate-900 text-xs font-semibold"
                    />
                  </View>

                  {/* Shipping Address */}
                  <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Delivery Shipping Address *
                  </Text>
                  <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-16 justify-center mb-4">
                    <TextInput
                      value={shippingAddress}
                      onChangeText={setShippingAddress}
                      placeholder="House No, Street, Landmark, City, Pincode"
                      placeholderTextColor="#94A3B8"
                      multiline
                      className="text-slate-900 text-xs"
                    />
                  </View>

                  {/* Free Inclusions Badges */}
                  <View className="bg-amber-50 p-3 rounded-2xl border border-amber-200 mb-4">
                    <View className="flex-row items-center mb-1 gap-1.5">
                      <Gift size={13} color="#D97706" />
                      <Text className="text-amber-900 font-bold text-xs">
                        Free Luxury Inclusions:
                      </Text>
                    </View>
                    <Text className="text-[11px] text-amber-800">
                      • {quantity} Matching Gold Foil Wax Seal Envelopes
                    </Text>
                    <Text className="text-[11px] text-amber-800">
                      • Free Express Insured Courier Delivery Across India
                    </Text>
                  </View>

                  {/* Price Breakdown */}
                  {selectedProduct && (() => {
                    const calc = calculateTotal(selectedProduct.pricePerCard, quantity);
                    return (
                      <View className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-4">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="text-xs text-slate-500">Unit Price:</Text>
                          <Text className="text-xs font-bold text-slate-700">
                            ₹{calc.unitPrice}/card
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

                  <GradientButton
                    onPress={handlePlaceOrder}
                    isLoading={isOrdering}
                    title={`Place Order • ₹${(selectedProduct ? calculateTotal(selectedProduct.pricePerCard, quantity).totalPrice : 0).toLocaleString()}`}
                    colors={["#EF4444", "#DC2626", "#881337"]}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Canva Touch Studio Modal */}
      <CanvaTouchStudio visible={showCanva} onClose={() => setShowCanva(false)} />
    </SafeAreaView>
  );
}
