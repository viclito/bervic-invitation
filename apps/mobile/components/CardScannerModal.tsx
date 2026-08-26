import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon, Sparkles, X, CheckCircle2 } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { api } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { GradientButton } from "./GradientButton";

interface CardScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onExtracted?: (data: any) => void;
}

export function CardScannerModal({
  visible,
  onClose,
  onExtracted,
}: CardScannerModalProps) {
  const queryClient = useQueryClient();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [extractedResult, setExtractedResult] = useState<any | null>(null);

  const pickImage = async (useCamera: boolean) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Camera permission is required to scan cards.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          quality: 0.8,
          base64: true,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Photo library permission is required to choose cards.");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 0.8,
          base64: true,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        processImageOCR(asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to capture image");
    }
  };

  const processImageOCR = async (imageBase64OrUri: string) => {
    setIsScanning(true);
    setScanStep("Uploading card photo to AI vision pipeline...");
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    try {
      setScanStep("Extracting couple names, date, venue, & timeline...");
      const res = await api.post("/api/user/event-draft/extract", {
        imageBase64: imageBase64OrUri,
      });

      if (res.success && res.extractedData) {
        setScanStep("Event details extracted successfully!");
        setExtractedResult(res.extractedData);
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
        queryClient.invalidateQueries({ queryKey: ["event-draft"] });
        if (onExtracted) {
          onExtracted(res.extractedData);
        }
      } else {
        throw new Error(res.message || "Could not detect clear invitation text");
      }
    } catch (err: any) {
      Alert.alert("OCR Scanning Notice", err.message || "Please take a clearer, well-lit photo of the invitation card.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setImageUri(null);
    setExtractedResult(null);
    setScanStep("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBox}>
                <Sparkles size={20} color={BRAND_COLORS.primaryRed} />
              </View>
              <View>
                <Text style={styles.title}>AI Wedding Card Scanner</Text>
                <Text style={styles.subtitle}>Scan physical card to auto-fill event</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          {!imageUri ? (
            <View style={styles.emptyContainer}>
              <View style={styles.cameraIconBox}>
                <Camera size={36} color={BRAND_COLORS.primaryRed} />
              </View>
              <Text style={styles.emptyTitle}>Snap or Upload Your Invitation Card</Text>
              <Text style={styles.emptySubtitle}>
                Our AI OCR automatically extracts Bride & Groom names, Wedding Date, Venue, and RSVP details.
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => pickImage(true)}
                  style={styles.primaryBtn}
                  activeOpacity={0.8}
                >
                  <Camera size={18} color="#FFF" />
                  <Text style={styles.primaryBtnText}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => pickImage(false)}
                  style={styles.secondaryBtn}
                  activeOpacity={0.8}
                >
                  <ImageIcon size={18} color="#0F172A" />
                  <Text style={styles.secondaryBtnText}>Choose Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.resultContainer}>
              <View style={styles.previewBox}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
              </View>

              {isScanning ? (
                <View style={styles.scanningBox}>
                  <ActivityIndicator size="small" color={BRAND_COLORS.primaryRed} />
                  <Text style={styles.scanningText}>{scanStep}</Text>
                </View>
              ) : extractedResult ? (
                <View style={styles.successBox}>
                  <View style={styles.successHeader}>
                    <CheckCircle2 size={16} color="#059669" />
                    <Text style={styles.successHeaderText}>Extraction Complete!</Text>
                  </View>
                  <Text style={styles.resultField}>
                    Couple: {extractedResult.hostNameOne || "Groom"} & {extractedResult.hostNameTwo || "Bride"}
                  </Text>
                  <Text style={styles.resultField}>Date: {extractedResult.eventDate || "Not detected"}</Text>
                  <Text style={styles.resultField}>Venue: {extractedResult.venueName || "Not detected"}</Text>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      onPress={handleReset}
                      style={styles.retakeBtn}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.retakeBtnText}>Scan Another</Text>
                    </TouchableOpacity>
                    <GradientButton
                      onPress={onClose}
                      title="Apply & Edit"
                      colors={["#EF4444", "#DC2626", "#881337"]}
                    />
                  </View>
                </View>
              ) : null}
            </View>
          )}
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
    maxHeight: "85%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    height: 38,
    width: 38,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  closeBtn: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  cameraIconBox: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  primaryBtn: {
    flex: 1,
    height: 48,
    backgroundColor: "#DC2626",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  secondaryBtn: {
    flex: 1,
    height: 48,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  secondaryBtnText: {
    color: "#0F172A",
    fontWeight: "800",
    fontSize: 12,
  },
  resultContainer: {
    paddingVertical: 12,
  },
  previewBox: {
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  scanningBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 10,
  },
  scanningText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  successBox: {
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  successHeaderText: {
    color: "#15803D",
    fontWeight: "800",
    fontSize: 12,
  },
  resultField: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
    marginBottom: 2,
  },
  actionRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 8,
  },
  retakeBtn: {
    flex: 1,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  retakeBtnText: {
    color: "#475569",
    fontWeight: "700",
    fontSize: 12,
  },
});
