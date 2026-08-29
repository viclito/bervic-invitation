import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  X,
  Crown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { api } from "../lib/api";
import { useAuthStore } from "../lib/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { GradientButton } from "./GradientButton";
import {
  RazorpayCheckoutModal,
  RazorpayOrderData,
} from "./RazorpayCheckoutModal";

export interface PlanOption {
  key: "BASIC_599" | "PRO_1799" | "CINEMATIC_2000" | "CARDS_99";
  title: string;
  price: number;
  badge?: string;
  features: string[];
}

export const PLAN_OPTIONS: PlanOption[] = [
  {
    key: "BASIC_599",
    title: "Royal Basic Suite",
    price: 599,
    badge: "STARTER",
    features: [
      "1 Luxury Wedding Website Slot",
      "Unlimited Guest RSVPs & Dietary Tracking",
      "1-Click WhatsApp Personalized Passes",
      "Door QR Entrance Scanner",
      "Live Countdown & Google Maps Navigation",
    ],
  },
  {
    key: "PRO_1799",
    title: "Royal Pro Suite",
    price: 1799,
    badge: "MOST POPULAR",
    features: [
      "3 Luxury Wedding Website Slots",
      "10 Custom Canva 2D Card Design Slots",
      "Multi-Function Scheduler (Sangeet, Reception)",
      "Bulk Phone Contacts Importer",
      "VIP Fast-Track Courier for 350 GSM Cards",
    ],
  },
  {
    key: "CINEMATIC_2000",
    title: "Royal Cinematic 480 Suite",
    price: 2000,
    badge: "ROYAL EXCLUSIVE",
    features: [
      "480-Frame Apple-Style Video Scroll Sequence",
      "288-Frame Heritage Emerald Suite",
      "4K Video Teaser & Love Story Streamer",
      "All 47 Themes Unlocked",
      "Dedicated 24/7 VIP Concierge Manager",
    ],
  },
  {
    key: "CARDS_99",
    title: "Canva 2D Card Booster Pack",
    price: 99,
    badge: "ADD-ON",
    features: [
      "5 Additional Custom 2D Card Slots",
      "High-Resolution PNG / PDF Print Exports",
      "Gold Foil & Velvet Texture Access",
    ],
  },
];

interface BuyPlanModalProps {
  visible: boolean;
  onClose: () => void;
  selectedPlanKey?: "BASIC_599" | "PRO_1799" | "CINEMATIC_2000" | "CARDS_99";
}

export function BuyPlanModal({
  visible,
  onClose,
  selectedPlanKey = "PRO_1799",
}: BuyPlanModalProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [activePlanKey, setActivePlanKey] = useState<
    "BASIC_599" | "PRO_1799" | "CINEMATIC_2000" | "CARDS_99"
  >(selectedPlanKey);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState<RazorpayOrderData | null>(null);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  const safeHaptics = () => {
    try {
      Haptics.selectionAsync();
    } catch {}
  };

  const activePlan =
    PLAN_OPTIONS.find((p) => p.key === activePlanKey) || PLAN_OPTIONS[1];

  const handlePurchase = async () => {
    setIsProcessing(true);
    safeHaptics();
    try {
      // 1. Create genuine Razorpay order on backend
      const orderRes = await api.post<any>("/api/payment/create-order", {
        plan: activePlan.key,
      });

      if (!orderRes?.orderId) {
        throw new Error(orderRes?.error || "Could not initialize payment order.");
      }

      // 2. Open in-app native Razorpay Checkout sheet
      setRazorpayOrder({
        orderId: orderRes.orderId,
        amount: orderRes.amount,
        keyId: orderRes.keyId || "rzp_test_TJjdhQ40H2NION",
        plan: activePlan.key,
        planTitle: activePlan.title,
        name: orderRes.user?.name || user?.name || "Customer",
        email: orderRes.user?.email || user?.email || "",
        phone: orderRes.user?.phone || "",
      });

      setShowRazorpayModal(true);
    } catch (err: any) {
      Alert.alert("Payment Error", err.message || "Failed to create Razorpay payment order.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setShowRazorpayModal(false);
    setIsProcessing(true);
    try {
      // 3. Verify signature on backend & update database
      const verifyRes = await api.post<any>("/api/payment/verify", {
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        plan: activePlan.key,
      });

      if (!verifyRes?.success) {
        throw new Error(verifyRes?.error || "Payment verification failed.");
      }

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      await queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
      await queryClient.invalidateQueries({ queryKey: ["user-orders"] });

      Alert.alert(
        "Payment Successful! 🎉",
        `Your ${activePlan.title} is now active. All features and quotas have been unlocked.`
      );
      onClose();
    } catch (err: any) {
      Alert.alert("Verification Error", err?.message || "Could not verify payment with server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentFailure = (errorMsg: string) => {
    setShowRazorpayModal(false);
    Alert.alert("Payment Cancelled / Declined", errorMsg);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {showRazorpayModal && razorpayOrder ? (
          <RazorpayCheckoutModal
            visible={showRazorpayModal}
            orderData={razorpayOrder}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
            onClose={() => setShowRazorpayModal(false)}
          />
        ) : (
          <View style={styles.modalCard}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <View style={styles.iconBox}>
                  <Crown size={20} color={BRAND_COLORS.primaryRed} />
                </View>
                <View>
                  <Text style={styles.title}>Upgrade Royal Plan</Text>
                  <Text style={styles.subtitle}>Unlock invitation slots & quotas via Razorpay</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <X size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Plan Options Selector */}
              <View style={styles.plansContainer}>
                {PLAN_OPTIONS.map((plan) => {
                  const isSelected = plan.key === activePlanKey;
                  return (
                    <TouchableOpacity
                      key={plan.key}
                      onPress={() => {
                        safeHaptics();
                        setActivePlanKey(plan.key);
                      }}
                      activeOpacity={0.8}
                      style={[
                        styles.planCard,
                        isSelected ? styles.planCardActive : styles.planCardInactive,
                      ]}
                    >
                      <View style={styles.planHeader}>
                        <View style={styles.planTitleContainer}>
                          <Text
                            style={[
                              styles.planTitle,
                              isSelected ? styles.planTitleActive : styles.planTitleInactive,
                            ]}
                          >
                            {plan.title}
                          </Text>
                          {plan.badge && (
                            <View
                              style={[
                                styles.badge,
                                isSelected ? styles.badgeActive : styles.badgeInactive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.badgeText,
                                  isSelected ? styles.badgeTextActive : styles.badgeTextInactive,
                                ]}
                              >
                                {plan.badge}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.planPrice,
                            isSelected ? styles.planPriceActive : styles.planPriceInactive,
                          ]}
                        >
                          ₹{plan.price.toLocaleString("en-IN")}
                        </Text>
                      </View>

                      {/* Features Bullet List */}
                      <View style={styles.featureList}>
                        {plan.features.map((feat, idx) => (
                          <View key={idx} style={styles.featureItem}>
                            <CheckCircle2
                              size={13}
                              color={isSelected ? BRAND_COLORS.primaryRed : "#94A3B8"}
                            />
                            <Text
                              style={[
                                styles.featureText,
                                isSelected ? styles.featureTextActive : styles.featureTextInactive,
                              ]}
                            >
                              {feat}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Security Badge */}
              <View style={styles.securityRow}>
                <ShieldCheck size={14} color="#059669" />
                <Text style={styles.securityText}>
                  Official Razorpay 256-Bit SSL Gateway • UPI / Cards / NetBanking
                </Text>
              </View>

              {/* Primary Action Button */}
              <View style={styles.buttonContainer}>
                <GradientButton
                  title={
                    isProcessing
                      ? "Starting Razorpay..."
                      : `Pay ₹${activePlan.price.toLocaleString("en-IN")} via Razorpay`
                  }
                  onPress={handlePurchase}
                  isLoading={isProcessing}
                />
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: "90%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconBox: {
    height: 40,
    width: 40,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  closeBtn: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  plansContainer: {
    gap: 12,
    marginBottom: 16,
  },
  planCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  planCardActive: {
    backgroundColor: "#FFF5F5",
    borderColor: "#DC2626",
  },
  planCardInactive: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  planTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  planTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  planTitleActive: {
    color: "#991B1B",
  },
  planTitleInactive: {
    color: "#1E293B",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeActive: {
    backgroundColor: "#FEE2E2",
  },
  badgeInactive: {
    backgroundColor: "#E2E8F0",
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
  },
  badgeTextActive: {
    color: "#991B1B",
  },
  badgeTextInactive: {
    color: "#475569",
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "900",
  },
  planPriceActive: {
    color: "#DC2626",
  },
  planPriceInactive: {
    color: "#0F172A",
  },
  featureList: {
    gap: 6,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featureText: {
    fontSize: 11,
    fontWeight: "500",
    flex: 1,
  },
  featureTextActive: {
    color: "#334155",
  },
  featureTextInactive: {
    color: "#64748B",
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  securityText: {
    fontSize: 10,
    color: "#065F46",
    fontWeight: "700",
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 12,
  },
});
