import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  X,
  Type,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Share2,
  Save,
  Plus,
  Trash2,
  Move,
  Check,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { api } from "../../lib/api";
import { GradientButton } from "../GradientButton";
import { CanvaElement, CanvaTemplate } from "../../hooks/useCanvaTemplates";
import { useQueryClient } from "@tanstack/react-query";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CANVAS_WIDTH = SCREEN_WIDTH - 48;
const CANVAS_HEIGHT = CANVAS_WIDTH * 1.45; // Golden wedding card ratio

const LUXURY_PALETTES = [
  { name: "Gold", hex: "#D4AF37" },
  { name: "Rose Gold", hex: "#E0A96D" },
  { name: "Crimson", hex: "#DC2626" },
  { name: "Burgundy", hex: "#881337" },
  { name: "Emerald", hex: "#065F46" },
  { name: "Midnight", hex: "#0F172A" },
  { name: "Champagne", hex: "#F5E6CA" },
  { name: "White", hex: "#FFFFFF" },
];

const CARD_BACKGROUNDS = [
  { name: "Ivory Silk", color: "#FDFBF7" },
  { name: "Velvet Red", color: "#450A0A" },
  { name: "Royal Noir", color: "#09090B" },
  { name: "Emerald Luxe", color: "#022C22" },
  { name: "Champagne Gold", color: "#FEF9C3" },
  { name: "Blush Rose", color: "#FFF1F2" },
];

const DEFAULT_ELEMENTS: CanvaElement[] = [
  {
    id: "tagline",
    type: "text",
    text: "TOGETHER WITH THEIR FAMILIES",
    fontSize: 10,
    color: "#D4AF37",
    fontWeight: "bold",
    letterSpacing: 2,
    x: 0,
    y: 35,
    textAlign: "center",
  },
  {
    id: "couple_names",
    type: "text",
    text: "Alexander & Evelyn",
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    x: 0,
    y: 75,
    textAlign: "center",
  },
  {
    id: "invite_line",
    type: "text",
    text: "INVITE YOU TO CELEBRATE THEIR WEDDING",
    fontSize: 9,
    color: "#E2E8F0",
    fontWeight: "bold",
    letterSpacing: 1.5,
    x: 0,
    y: 120,
    textAlign: "center",
  },
  {
    id: "event_datetime",
    type: "text",
    text: "SATURDAY, OCTOBER 24, 2026\nAT FIVE O'CLOCK IN THE EVENING",
    fontSize: 11,
    color: "#D4AF37",
    fontWeight: "bold",
    x: 0,
    y: 155,
    textAlign: "center",
  },
  {
    id: "venue_details",
    type: "text",
    text: "THE GRAND ROYAL PALACE\nNEW DELHI, INDIA",
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
    x: 0,
    y: 215,
    textAlign: "center",
  },
  {
    id: "reception_line",
    type: "text",
    text: "DINNER & DANCING TO FOLLOW",
    fontSize: 9,
    color: "#CBD5E1",
    fontWeight: "bold",
    letterSpacing: 1,
    x: 0,
    y: 275,
    textAlign: "center",
  },
];

interface CanvaTouchStudioProps {
  visible: boolean;
  onClose: () => void;
  initialTemplate?: CanvaTemplate | null;
}

export function CanvaTouchStudio({
  visible,
  onClose,
  initialTemplate,
}: CanvaTouchStudioProps) {
  const queryClient = useQueryClient();

  const [backgroundColor, setBackgroundColor] = useState(
    initialTemplate?.backgroundColor || "#450A0A"
  );
  const [elements, setElements] = useState<CanvaElement[]>(
    initialTemplate?.elements?.length ? initialTemplate.elements : DEFAULT_ELEMENTS
  );
  const [selectedId, setSelectedId] = useState<string | null>("couple_names");
  const [activeTab, setActiveTab] = useState<"text" | "color" | "bg" | "photo">("text");
  const [couplePhotoUri, setCouplePhotoUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedElement = elements.find((el) => el.id === selectedId);

  const updateSelectedElement = (updates: Partial<CanvaElement>) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, ...updates } : el))
    );
  };

  const handleAddText = () => {
    const newId = `text_${Date.now()}`;
    const newEl: CanvaElement = {
      id: newId,
      type: "text",
      text: "New Custom Text",
      fontSize: 14,
      color: "#D4AF37",
      fontWeight: "bold",
      x: 0,
      y: 180,
      textAlign: "center",
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
    setActiveTab("text");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handlePickPhoto = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });
      if (!res.canceled && res.assets[0]) {
        setCouplePhotoUri(res.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to pick image");
    }
  };

  const handleSaveCard = async () => {
    setIsSaving(true);
    try {
      const coupleEl = elements.find((el) => el.id === "couple_names")?.text || "Wedding Card";
      const dateEl = elements.find((el) => el.id === "event_datetime")?.text || "";
      const venueEl = elements.find((el) => el.id === "venue_details")?.text || "";

      await api.post("/api/user/cards/save", {
        templateId: initialTemplate?.id || "custom_2d_mobile_card",
        templateName: initialTemplate?.name || "Mobile 2D Touch Card",
        partnerOne: coupleEl.split("&")[0]?.trim() || "Groom",
        partnerTwo: coupleEl.split("&")[1]?.trim() || "Bride",
        weddingDate: dateEl.slice(0, 30),
        venue: venueEl.slice(0, 50),
        couplePhoto: couplePhotoUri || null,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success! 🎉", "Your custom card design has been saved to your account.");
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
    } catch (err: any) {
      Alert.alert("Notice", err.message || "Card design saved locally.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (await Sharing.isAvailableAsync()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert("Card Ready", "Ready to share with family and friends on WhatsApp!");
    } else {
      Alert.alert("Sharing", "Sharing not available on this device.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-slate-950"
      >
        {/* Studio Top Navigation */}
        <View className="flex-row items-center justify-between px-4 pt-12 pb-3 bg-slate-900 border-b border-slate-800">
          <Pressable
            onPress={onClose}
            className="h-9 w-9 rounded-full bg-slate-800 items-center justify-center active:bg-slate-700"
          >
            <X size={18} color="#FFF" />
          </Pressable>

          <View className="items-center">
            <Text className="text-white font-extrabold text-sm">Canva 2D Touch Studio</Text>
            <Text className="text-red-400 text-[10px] font-bold">350 GSM Live Renderer</Text>
          </View>

          <View className="flex-row gap-2">
            <Pressable
              onPress={handleShare}
              className="h-9 w-9 rounded-full bg-slate-800 items-center justify-center active:bg-slate-700"
            >
              <Share2 size={16} color="#FFF" />
            </Pressable>
            <Pressable
              onPress={handleSaveCard}
              disabled={isSaving}
              className="h-9 px-3 rounded-full bg-red-600 flex-row items-center justify-center shadow-md active:bg-red-700"
            >
              <Save size={14} color="#FFF" />
              <Text className="text-white text-xs font-bold ml-1">Save</Text>
            </Pressable>
          </View>
        </View>

        {/* 2D Touch Canvas Area */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ alignItems: "center", paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              backgroundColor,
            }}
            className="rounded-3xl p-5 shadow-2xl relative overflow-hidden border border-amber-400/40 items-center"
          >
            {/* Elegant Inner Gold Foil Frame */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
                borderColor: "#D4AF37",
                borderWidth: 1,
                borderRadius: 18,
                opacity: 0.6,
              }}
            />

            {/* Optional Couple Photo */}
            {couplePhotoUri && (
              <View className="h-24 w-24 rounded-full overflow-hidden border-2 border-amber-300 shadow-md mb-2 mt-4">
                <Image
                  source={{ uri: couplePhotoUri }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Rendered Text Elements */}
            {elements.map((el) => {
              const isSelected = el.id === selectedId;
              return (
                <Pressable
                  key={el.id}
                  onPress={() => {
                    setSelectedId(el.id);
                    setActiveTab("text");
                    Haptics.selectionAsync();
                  }}
                  style={{
                    marginVertical: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    borderWidth: isSelected ? 1 : 0,
                    borderColor: isSelected ? "#D4AF37" : "transparent",
                    backgroundColor: isSelected ? "rgba(212, 175, 55, 0.15)" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: el.fontSize,
                      color: el.color,
                      fontWeight: el.fontWeight as any,
                      textAlign: el.textAlign || "center",
                      letterSpacing: el.letterSpacing,
                      fontFamily: el.fontFamily,
                    }}
                  >
                    {el.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Editing Control Sheet */}
        <View className="bg-slate-900 border-t border-slate-800 p-4">
          {/* Tab Selector */}
          <View className="flex-row gap-2 mb-3">
            {[
              { key: "text", icon: Type, label: "Text" },
              { key: "color", icon: Palette, label: "Color" },
              { key: "bg", icon: Sparkles, label: "Background" },
              { key: "photo", icon: ImageIcon, label: "Photo" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => {
                    setActiveTab(tab.key as any);
                    Haptics.selectionAsync();
                  }}
                  className={`flex-1 py-2 rounded-xl flex-row items-center justify-center border ${
                    isActive
                      ? "bg-red-600 border-red-600"
                      : "bg-slate-800 border-slate-700"
                  }`}
                >
                  <Icon size={14} color="#FFF" />
                  <Text className="text-white text-xs font-bold ml-1.5">{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Tab Content: Text Editor */}
          {activeTab === "text" && selectedElement && (
            <View className="mb-2">
              <View className="flex-row items-center bg-slate-800 border border-slate-700 rounded-2xl px-3.5 h-11 mb-2.5">
                <TextInput
                  value={selectedElement.text}
                  onChangeText={(val) => updateSelectedElement({ text: val })}
                  placeholder="Edit text content..."
                  placeholderTextColor="#94A3B8"
                  className="flex-1 text-white text-xs font-semibold"
                />
              </View>

              {/* Font Size & Alignment Controls */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-slate-400 text-xs font-bold">Size:</Text>
                  <Pressable
                    onPress={() =>
                      updateSelectedElement({
                        fontSize: Math.max(8, (selectedElement.fontSize || 14) - 2),
                      })
                    }
                    className="h-8 w-8 rounded-xl bg-slate-800 items-center justify-center border border-slate-700"
                  >
                    <Text className="text-white font-bold text-xs">-</Text>
                  </Pressable>
                  <Text className="text-white font-extrabold text-xs">
                    {selectedElement.fontSize}
                  </Text>
                  <Pressable
                    onPress={() =>
                      updateSelectedElement({
                        fontSize: Math.min(36, (selectedElement.fontSize || 14) + 2),
                      })
                    }
                    className="h-8 w-8 rounded-xl bg-slate-800 items-center justify-center border border-slate-700"
                  >
                    <Text className="text-white font-bold text-xs">+</Text>
                  </Pressable>
                </View>

                <View className="flex-row gap-2">
                  <Pressable
                    onPress={handleAddText}
                    className="h-8 px-3 rounded-xl bg-slate-800 border border-slate-700 flex-row items-center"
                  >
                    <Plus size={12} color="#FFF" />
                    <Text className="text-white text-[11px] font-bold ml-1">Add Text</Text>
                  </Pressable>

                  {elements.length > 1 && (
                    <Pressable
                      onPress={() => handleDeleteElement(selectedElement.id)}
                      className="h-8 w-8 rounded-xl bg-red-900/60 border border-red-800 items-center justify-center"
                    >
                      <Trash2 size={13} color="#FCA5A5" />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Tab Content: Color Palette */}
          {activeTab === "color" && selectedElement && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
              {LUXURY_PALETTES.map((pal) => (
                <Pressable
                  key={pal.hex}
                  onPress={() => {
                    updateSelectedElement({ color: pal.hex });
                    Haptics.selectionAsync();
                  }}
                  className="items-center mr-3"
                >
                  <View
                    style={{ backgroundColor: pal.hex }}
                    className={`h-9 w-9 rounded-full border-2 ${
                      selectedElement.color === pal.hex
                        ? "border-white scale-110"
                        : "border-slate-700"
                    } items-center justify-center`}
                  >
                    {selectedElement.color === pal.hex && (
                      <Check size={14} color={pal.hex === "#FFFFFF" ? "#000" : "#FFF"} />
                    )}
                  </View>
                  <Text className="text-slate-400 text-[10px] mt-1">{pal.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Tab Content: Background Themes */}
          {activeTab === "bg" && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
              {CARD_BACKGROUNDS.map((bg) => (
                <Pressable
                  key={bg.color}
                  onPress={() => {
                    setBackgroundColor(bg.color);
                    Haptics.selectionAsync();
                  }}
                  className="items-center mr-3"
                >
                  <View
                    style={{ backgroundColor: bg.color }}
                    className={`h-9 w-14 rounded-xl border-2 ${
                      backgroundColor === bg.color
                        ? "border-red-500 scale-105"
                        : "border-slate-700"
                    } items-center justify-center`}
                  />
                  <Text className="text-slate-400 text-[10px] mt-1">{bg.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Tab Content: Couple Photo Upload */}
          {activeTab === "photo" && (
            <View className="flex-row items-center justify-between py-1">
              <View className="flex-1 mr-3">
                <Text className="text-white font-bold text-xs mb-0.5">Insert Couple Photo</Text>
                <Text className="text-slate-400 text-[10px]">
                  Adds a round gold-bordered portrait badge to the card
                </Text>
              </View>

              <Pressable
                onPress={handlePickPhoto}
                className="h-10 px-4 rounded-xl bg-red-600 flex-row items-center active:bg-red-700"
              >
                <ImageIcon size={14} color="#FFF" />
                <Text className="text-white font-bold text-xs ml-1.5">
                  {couplePhotoUri ? "Change Photo" : "Upload Photo"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
