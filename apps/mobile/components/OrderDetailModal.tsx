import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import {
  X,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react-native";
import { BRAND_COLORS } from "@bervic/shared";
import { UserOrder } from "../hooks/useUserOrders";

interface OrderDetailModalProps {
  visible: boolean;
  onClose: () => void;
  order: UserOrder | null;
}

const TIMELINE_STEPS = [
  { key: "PENDING", label: "Order Received", sub: "Payment & specs confirmed", icon: Clock },
  { key: "PROOF_READY", label: "Digital Proof Ready", sub: "Designer proof generated", icon: Sparkles },
  { key: "IN_PRODUCTION", label: "In Production", sub: "350 GSM foil printing & debossing", icon: Package },
  { key: "SHIPPED", label: "Dispatched", sub: "Handed over to express courier", icon: Truck },
  { key: "DELIVERED", label: "Delivered", sub: "Delivered to doorstep", icon: CheckCircle2 },
];

export function OrderDetailModal({ visible, onClose, order }: OrderDetailModalProps) {
  if (!order) return null;

  const currentStatus = order.orderStatus || "IN_PRODUCTION";
  let activeIndex = 0;
  if (currentStatus === "CONFIRMED" || currentStatus === "PROOF_READY") activeIndex = 1;
  else if (currentStatus === "IN_PRODUCTION") activeIndex = 2;
  else if (currentStatus === "SHIPPED") activeIndex = 3;
  else if (currentStatus === "DELIVERED") activeIndex = 4;

  const handleProofChat = () => {
    const text = encodeURIComponent(
      `Hello Bervic Studio, I'm inquiring about my print order #${order.orderNumber || order.id.slice(-6)} for digital proof approval.`
    );
    Linking.openURL(`https://wa.me/919042127115?text=${text}`);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>
                Order #{order.orderNumber || order.id.slice(-6)}
              </Text>
              <Text style={styles.headerSubtitle}>
                Total: ₹{order.totalAmount?.toLocaleString() || "0"} • {order.items?.length || 1} Item(s)
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Visual Timeline Tracking */}
            <Text style={styles.sectionLabel}>Production & Delivery Status</Text>

            <View style={styles.timelineBox}>
              {TIMELINE_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <View key={step.key} style={styles.stepRow}>
                    {/* Vertical Line */}
                    {idx < TIMELINE_STEPS.length - 1 && (
                      <View
                        style={[
                          styles.verticalLine,
                          { backgroundColor: idx < activeIndex ? "#DC2626" : "#E2E8F0" },
                        ]}
                      />
                    )}

                    {/* Step Icon */}
                    <View
                      style={[
                        styles.stepIconBox,
                        isCurrent
                          ? styles.stepIconCurrent
                          : isPassed
                          ? styles.stepIconPassed
                          : styles.stepIconPending,
                      ]}
                    >
                      <Icon
                        size={13}
                        color={isCurrent ? "#FFF" : isPassed ? BRAND_COLORS.primaryRed : "#94A3B8"}
                      />
                    </View>

                    {/* Step Text */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.stepLabel,
                          isCurrent
                            ? styles.stepLabelCurrent
                            : isPassed
                            ? styles.stepLabelPassed
                            : styles.stepLabelPending,
                        ]}
                      >
                        {step.label}
                      </Text>
                      <Text style={styles.stepSub}>{step.sub}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Delivery Address */}
            {order.shippingAddress && (
              <View style={styles.shippingBox}>
                <MapPin size={16} color={BRAND_COLORS.primaryRed} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.shippingTitle}>Shipping Address</Text>
                  <Text style={styles.shippingAddress}>{order.shippingAddress}</Text>
                </View>
              </View>
            )}

            {/* Proof Approval & WhatsApp Support */}
            <TouchableOpacity
              onPress={handleProofChat}
              style={styles.chatBtn}
              activeOpacity={0.8}
            >
              <MessageCircle size={16} color="#FFF" />
              <Text style={styles.chatBtnText}>Designer Proof Approval Chat</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
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
    maxHeight: "88%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  closeBtn: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0F172A",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  timelineBox: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    position: "relative",
  },
  verticalLine: {
    position: "absolute",
    left: 13,
    top: 26,
    width: 2,
    height: 24,
  },
  stepIconBox: {
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    zIndex: 10,
  },
  stepIconCurrent: {
    backgroundColor: "#DC2626",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  stepIconPassed: {
    backgroundColor: "#FEE2E2",
  },
  stepIconPending: {
    backgroundColor: "#E2E8F0",
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  stepLabelCurrent: {
    color: "#B91C1C",
  },
  stepLabelPassed: {
    color: "#0F172A",
  },
  stepLabelPending: {
    color: "#94A3B8",
  },
  stepSub: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 1,
  },
  shippingBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  shippingTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },
  shippingAddress: {
    fontSize: 11,
    color: "#475569",
  },
  chatBtn: {
    height: 48,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    gap: 8,
  },
  chatBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
});
