import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { X, ShieldCheck } from "lucide-react-native";
import { BRAND_COLORS } from "@bervic/shared";

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

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body {
      margin: 0;
      padding: 0;
      background: #FEF2F2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .loader {
      width: 44px;
      height: 44px;
      border: 4px solid #DC2626;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .text {
      color: #991B1B;
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="loader"></div>
  <div class="text">Opening Razorpay Secure Gateway...</div>
  <script>
    function notify(type, payload) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload }));
      }
    }

    var options = {
      key: "${orderData.keyId}",
      amount: ${orderData.amount},
      currency: "INR",
      name: "Bervic Invitations",
      description: "${orderData.planTitle || 'Subscription Pass'}",
      order_id: "${orderData.orderId}",
      prefill: {
        name: "${orderData.name || 'Customer'}",
        email: "${orderData.email || ''}",
        contact: "${orderData.phone || ''}"
      },
      theme: { color: "#991B1B" },
      modal: {
        ondismiss: function() {
          notify("CANCELLED", {});
        }
      },
      handler: function(response) {
        notify("SUCCESS", response);
      }
    };

    window.onload = function() {
      try {
        var rzp = new Razorpay(options);
        rzp.on('payment.failed', function(resp) {
          notify("FAILED", resp.error || {});
        });
        rzp.open();
      } catch (err) {
        notify("ERROR", { message: err.message });
      }
    };
  </script>
</body>
</html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "SUCCESS") {
        onSuccess(data.payload);
      } else if (data.type === "CANCELLED") {
        onClose();
      } else if (data.type === "FAILED" || data.type === "ERROR") {
        onFailure(data.payload?.description || data.payload?.message || "Payment cancelled or declined.");
      }
    } catch {
      onFailure("Failed to process payment gateway response.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ShieldCheck size={18} color="#059669" />
            <Text style={styles.headerTitle}>Razorpay Secure In-App Payment</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* In-App WebView */}
        <View style={styles.webviewWrapper}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: htmlContent, baseUrl: "https://api.razorpay.com" }}
            onMessage={handleMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={BRAND_COLORS.primaryRed} />
                <Text style={styles.loadingText}>Connecting to Razorpay...</Text>
              </View>
            )}
            style={styles.webview}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#FEF2F2",
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
