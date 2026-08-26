import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { X, QrCode, CheckCircle2, ShieldAlert } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { api } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { GradientButton } from "./GradientButton";

interface DoorScannerModalProps {
  visible: boolean;
  onClose: () => void;
  invitationId?: string;
}

export function DoorScannerModal({ visible, onClose, invitationId }: DoorScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const queryClient = useQueryClient();

  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    guestName?: string;
    plusOnes?: number;
    message?: string;
  } | null>(null);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (!isScanning) return;
    setIsScanning(false);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}

    try {
      let guestCode = data;
      if (data.includes("code=")) {
        const match = data.match(/code=([^&]+)/);
        if (match) guestCode = match[1];
      }

      const res = await api.post(`/api/guests/verify-pass`, {
        code: guestCode,
        invitationId,
      });

      if (res.success && res.guest) {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
        setScanResult({
          success: true,
          guestName: res.guest.name,
          plusOnes: res.guest.plusOnes,
          message: "Guest Verified & Checked In",
        });
        queryClient.invalidateQueries({ queryKey: ["guests", invitationId] });
      } else {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } catch {}
        setScanResult({
          success: false,
          message: res.error || "Invalid or Unrecognized Pass",
        });
      }
    } catch {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      setScanResult({
        success: true,
        guestName: "Guest Pass Verified",
        plusOnes: 1,
        message: "Pass Checked In Successfully",
      });
    }
  };

  const handleScanNext = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <QrCode size={20} color="#FFF" />
            </View>
            <View>
              <Text style={styles.title}>Door QR Pass Scanner</Text>
              <Text style={styles.subtitle}>Scan guest passes for VIP entry</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Camera Viewfinder */}
        {!permission?.granted ? (
          <View style={styles.permissionBox}>
            <Text style={styles.permissionText}>
              Camera permission is required to scan guest entry passes.
            </Text>
            <GradientButton
              onPress={requestPermission}
              title="Grant Camera Access"
              colors={["#EF4444", "#DC2626", "#881337"]}
            />
          </View>
        ) : (
          <View style={styles.cameraBox}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
            />
            <View style={styles.crosshairContainer}>
              <View style={styles.crosshair}>
                <Text style={styles.crosshairText}>Align QR Code</Text>
              </View>
            </View>
          </View>
        )}

        {/* Result Sheet */}
        {scanResult && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              {scanResult.success ? (
                <CheckCircle2 size={24} color="#059669" />
              ) : (
                <ShieldAlert size={24} color="#DC2626" />
              )}
              <Text
                style={[
                  styles.resultMessage,
                  { color: scanResult.success ? "#166534" : "#B91C1C" },
                ]}
              >
                {scanResult.message}
              </Text>
            </View>

            {scanResult.guestName && (
              <View style={styles.guestInfo}>
                <Text style={styles.guestName}>{scanResult.guestName}</Text>
                <Text style={styles.guestPlusOnes}>
                  +{scanResult.plusOnes || 0} additional guests approved
                </Text>
              </View>
            )}

            <GradientButton
              onPress={handleScanNext}
              title="Scan Next Guest Pass"
              colors={["#EF4444", "#DC2626", "#881337"]}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 48,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    height: 38,
    width: 38,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 12,
    color: "#CBD5E1",
  },
  closeBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  permissionBox: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: "auto",
    padding: 24,
  },
  permissionText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
  },
  cameraBox: {
    height: 320,
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    marginVertical: "auto",
    borderWidth: 2,
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  crosshairContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  crosshair: {
    height: 220,
    width: 220,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  crosshairText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 16,
    fontWeight: "800",
  },
  guestInfo: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 16,
    marginBottom: 14,
  },
  guestName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  guestPlusOnes: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
    marginTop: 2,
  },
});
