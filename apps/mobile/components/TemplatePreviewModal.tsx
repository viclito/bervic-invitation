import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import {
  X,
  ExternalLink,
  Sparkles,
  Heart,
  Calendar,
  MapPin,
  Clock,
  Music,
  CheckCircle2,
  Lock,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { TemplateItem } from "../hooks/useTemplatesRegistry";
import { useEventDraft } from "../hooks/useEventDraft";
import { useSubscription } from "../hooks/useSubscription";
import { useMyInvitations } from "../hooks/useMyInvitations";
import { PRODUCTION_WEB_URL, api } from "../lib/api";
import { GradientButton } from "./GradientButton";
import { useQueryClient } from "@tanstack/react-query";
import {
  RazorpayCheckoutModal,
  RazorpayOrderData,
} from "./RazorpayCheckoutModal";

interface TemplatePreviewModalProps {
  visible: boolean;
  onClose: () => void;
  template: TemplateItem | null;
}

export function TemplatePreviewModal({
  visible,
  onClose,
  template,
}: TemplatePreviewModalProps) {
  const queryClient = useQueryClient();
  const { data: draft } = useEventDraft();
  const { data: subData } = useSubscription();
  const { data: myInvs } = useMyInvitations();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  const [razorpayOrder, setRazorpayOrder] = useState<RazorpayOrderData | null>(null);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  if (!template) return null;

  const livePreviewUrl = `${PRODUCTION_WEB_URL}/templates/${template.slug}?preview=true`;

  const coupleTitle =
    draft?.hostNameOne && draft?.hostNameTwo
      ? `${draft.hostNameOne} & ${draft.hostNameTwo}`
      : draft?.profileName || "Sam & Ayarin";

  const eventDate = draft?.eventDate || "November 20, 2026";
  const venuePlace = draft?.venueName || "Marriage Ceremony Palace Hall";

  const fallbackUri =
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";
  const thumbnailUri = template.previewImage || fallbackUri;

  const existingInvitationWithThisTemplate = myInvs?.find(
    (inv) => inv.templateSlug === template.slug
  );
  const isActiveTemplate = !!existingInvitationWithThisTemplate;

  const templatePrice = template.price ?? (template.isPremium ? 1799 : 599);
  const hasAvailableSlot = (subData?.remainingTemplateSlots ?? 0) > 0;

  const handleOpenBrowser = () => {
    try {
      Haptics.selectionAsync();
    } catch {}
    Linking.openURL(livePreviewUrl);
  };

  const handleUnlockNewSlot = async () => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setIsUnlocking(true);
    try {
      if (hasAvailableSlot) {
        await api.post("/api/invitations/create-slot", {
          templateSlug: template.slug,
          templateName: template.title,
        });

        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
        setUnlockSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
        queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      } else {
        const orderRes = await api.post<any>("/api/payment/create-order", {
          templateSlug: template.slug,
          amount: templatePrice,
          plan: "PRO_1799",
        });

        if (orderRes?.orderId) {
          setRazorpayOrder({
            orderId: orderRes.orderId,
            amount: orderRes.amount,
            keyId: orderRes.keyId || "rzp_test_TJjdhQ40H2NION",
            plan: "PRO_1799",
            planTitle: template.title,
            name: orderRes.user?.name || "Customer",
            email: orderRes.user?.email || "",
            phone: orderRes.user?.phone || "",
          });
          setShowRazorpayModal(true);
        } else {
          throw new Error("Could not initialize template purchase order.");
        }
      }
    } catch (err: any) {
      Alert.alert("Checkout Error", err.message || "Failed to start Razorpay payment.");
    } finally {
      setIsUnlocking(false);
    }
  };

  const handlePaymentSuccess = async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setShowRazorpayModal(false);
    setIsUnlocking(true);
    try {
      const verifyRes = await api.post<any>("/api/payment/verify", {
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        plan: "PRO_1799",
      });

      if (!verifyRes?.success) {
        throw new Error(verifyRes?.error || "Payment verification failed.");
      }

      await api.post("/api/invitations/create-slot", {
        templateSlug: template.slug,
        templateName: template.title,
      });

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      setUnlockSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      Alert.alert("Slot Unlocked! 🎉", "Your luxury template has been unlocked.");
    } catch (err: any) {
      Alert.alert("Verification Error", err?.message || "Could not verify payment with server.");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {showRazorpayModal && razorpayOrder ? (
          <RazorpayCheckoutModal
            visible={showRazorpayModal}
            orderData={razorpayOrder}
            onSuccess={handlePaymentSuccess}
            onFailure={(msg) => {
              setShowRazorpayModal(false);
              Alert.alert("Payment Cancelled / Declined", msg);
            }}
            onClose={() => setShowRazorpayModal(false)}
          />
        ) : (
          <View style={styles.modalCard}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <View style={styles.badgeRow}>
                  <Text style={styles.categoryBadge}>{template.category || "LUXURY WEDDING"}</Text>
                  {template.isPremium && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumBadgeText}>480p SCROLL</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.title} numberOfLines={1}>
                  {template.title}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <X size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* High-Resolution Template Thumbnail Preview */}
              <View style={styles.previewImageContainer}>
                <Image
                  source={{ uri: thumbnailUri }}
                  placeholder={{ uri: fallbackUri }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  transition={300}
                />
                <View style={styles.floatingPreviewTag}>
                  <Sparkles size={11} color="#FDE047" />
                  <Text style={styles.floatingPreviewTagText}>Theme Preview</Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.desc}>{template.description}</Text>

              {/* Live Data Injection Teaser */}
              <Text style={styles.sectionLabel}>Live Website Preview Data</Text>

              <View style={styles.dataCard}>
                <View style={styles.dataRow}>
                  <Heart size={13} color={BRAND_COLORS.primaryRed} />
                  <Text style={styles.coupleText}>{coupleTitle}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Calendar size={13} color="#64748B" />
                  <Text style={styles.dateText}>{eventDate}</Text>
                </View>
                <View style={styles.dataRow}>
                  <MapPin size={13} color="#64748B" />
                  <Text style={styles.venueText} numberOfLines={1}>
                    {venuePlace}
                  </Text>
                </View>

                <View style={styles.featuresRow}>
                  <View style={styles.miniFeaturePill}>
                    <Clock size={12} color={BRAND_COLORS.primaryRed} />
                    <Text style={styles.miniFeatureText}>LIVE COUNTDOWN</Text>
                  </View>
                  <View style={styles.miniFeaturePill}>
                    <Music size={12} color={BRAND_COLORS.primaryRed} />
                    <Text style={styles.miniFeatureText}>BG AUDIO</Text>
                  </View>
                  <View style={styles.miniFeaturePill}>
                    <CheckCircle2 size={12} color="#059669" />
                    <Text style={styles.miniFeatureText}>RSVP FORM</Text>
                  </View>
                </View>
              </View>

              {/* Template Slot Notice */}
              {isActiveTemplate ? (
                <View style={styles.activeBanner}>
                  <CheckCircle2 size={22} color="#059669" />
                  <Text style={styles.activeBannerTitle}>Current Active Theme for Your Invitation</Text>
                  <Text style={styles.activeBannerSub}>
                    Your live web invitation is actively operating in this design.
                  </Text>
                </View>
              ) : unlockSuccess ? (
                <View style={styles.activeBanner}>
                  <CheckCircle2 size={24} color="#059669" />
                  <Text style={styles.activeBannerTitle}>Template Slot Unlocked! 🎉</Text>
                  <Text style={styles.activeBannerSub}>
                    A new invitation has been provisioned with the {template.title} design.
                  </Text>
                </View>
              ) : (
                <View style={styles.noticeBanner}>
                  <View style={styles.dataRow}>
                    <Lock size={13} color="#D97706" />
                    <Text style={styles.noticeTitle}>Template Slot Purchase Policy</Text>
                  </View>
                  <Text style={styles.noticeSub}>
                    Each purchased invitation is permanently tied to its chosen template. To create an invitation with this design, unlock an additional template slot.
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              {isActiveTemplate ? (
                <View style={styles.activeDesignBtn}>
                  <Text style={styles.activeDesignBtnText}>✓ Active Live Design</Text>
                </View>
              ) : !unlockSuccess && (
                <GradientButton
                  onPress={handleUnlockNewSlot}
                  isLoading={isUnlocking}
                  title={
                    hasAvailableSlot
                      ? "Unlock New Slot with This Design"
                      : `Unlock Template Slot • ₹${templatePrice}`
                  }
                  colors={["#EF4444", "#DC2626", "#881337"]}
                />
              )}

              <TouchableOpacity
                onPress={handleOpenBrowser}
                style={styles.demoBtn}
                activeOpacity={0.8}
              >
                <ExternalLink size={15} color="#FFF" />
                <Text style={styles.demoBtnText}>Open Live Interactive Web Demo</Text>
              </TouchableOpacity>
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
    padding: 24,
    maxHeight: "92%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: "800",
    color: "#DC2626",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  premiumBadge: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  premiumBadgeText: {
    color: "#DC2626",
    fontSize: 9,
    fontWeight: "800",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  closeBtn: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImageContainer: {
    height: 220,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    position: "relative",
  },
  floatingPreviewTag: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  floatingPreviewTagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  desc: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0F172A",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  dataCard: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  coupleText: {
    color: "#0F172A",
    fontWeight: "800",
    fontSize: 12,
  },
  dateText: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "500",
  },
  venueText: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "500",
    flex: 1,
  },
  featuresRow: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  miniFeaturePill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  miniFeatureText: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "800",
    marginTop: 2,
  },
  activeBanner: {
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    alignItems: "center",
    marginBottom: 14,
  },
  activeBannerTitle: {
    color: "#14532D",
    fontWeight: "800",
    fontSize: 12,
    marginTop: 4,
  },
  activeBannerSub: {
    color: "#15803D",
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },
  noticeBanner: {
    backgroundColor: "#FFFBEB",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#FEF3C7",
    marginBottom: 16,
  },
  noticeTitle: {
    color: "#92400E",
    fontWeight: "800",
    fontSize: 12,
  },
  noticeSub: {
    color: "#B45309",
    fontSize: 11,
    lineHeight: 16,
  },
  activeDesignBtn: {
    height: 48,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeDesignBtnText: {
    color: "#475569",
    fontWeight: "800",
    fontSize: 12,
  },
  demoBtn: {
    height: 48,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 8,
  },
  demoBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
});
