import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { X, ShieldCheck } from "lucide-react-native";
import { BRAND_COLORS } from "@bervic/shared";
import { getBaseUrl } from "../lib/api";

export interface RazorpayOrderData {
  orderId: string;
  amount: number; // in paise
  keyId: string;
  plan: string;
  planTitle: string;
  name: string;
  email: string;
  phone?: string;
}

interface Props {
  visible: boolean;
  orderData: RazorpayOrderData | null;
  onSuccess: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure: (errorMsg: string) => void;
  onClose: () => void;
}

export function RazorpayCheckoutModal({
  visible,
  orderData,
  onSuccess,
  onFailure,
  onClose,
}: Props) {
  if (!visible || !orderData) return null;

  const checkoutUrl = `${getBaseUrl()}/mobile-checkout?orderId=${encodeURIComponent(
    orderData.orderId
  )}&amount=${orderData.amount}&keyId=${encodeURIComponent(
    orderData.keyId
  )}&plan=${encodeURIComponent(orderData.plan)}&planTitle=${encodeURIComponent(
    orderData.planTitle
  )}&name=${encodeURIComponent(orderData.name)}&email=${encodeURIComponent(
    orderData.email
  )}&phone=${encodeURIComponent(orderData.phone || "")}`;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "SUCCESS") {
        onSuccess(data.payload);
      } else if (data.type === "CANCELLED") {
        onClose();
      } else if (data.type === "ERROR") {
        onFailure(data.payload?.message || "Payment process could not be completed.");
      }
    } catch {
      onFailure("Failed to process payment gateway response.");
    }
  };

  const handleShouldStartLoad = (request: any) => {
    const url = request.url;
    if (!url) return true;

    if (
      url.startsWith("upi://") ||
      url.startsWith("phonepe://") ||
      url.startsWith("gpay://") ||
      url.startsWith("paytmmp://") ||
      url.startsWith("tez://") ||
      url.startsWith("bhim://") ||
      url.startsWith("credpay://")
    ) {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert(
              "UPI App Not Found",
              "Please select Card or NetBanking payment, or install a UPI app."
            );
          }
        })
        .catch(() => {});
      return false;
    }

    return true;
  };

  return (
    <View style={styles.fullScreenWrapper}>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ShieldCheck size={18} color="#059669" />
            <Text style={styles.headerTitle}>Razorpay Secure In-App Payment</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* In-App WebView */}
        <View style={styles.webviewWrapper}>
          <WebView
            originWhitelist={["*"]}
            source={{ uri: checkoutUrl }}
            onMessage={handleMessage}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            javaScriptCanOpenWindowsAutomatically={true}
            setSupportMultipleWindows={false}
            allowsBackForwardNavigationGestures={true}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            mixedContentMode="always"
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={BRAND_COLORS.primaryRed} />
                <Text style={styles.loadingText}>Connecting to Razorpay Gateway...</Text>
              </View>
            )}
            style={styles.webview}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    zIndex: 99999,
    elevation: 99999,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "800",
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
  webviewWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
});
