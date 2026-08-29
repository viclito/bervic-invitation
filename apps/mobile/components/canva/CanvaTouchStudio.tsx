import React, { useState, useEffect, useCallback } from "react";
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
  StyleSheet,
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
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Copy,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Wand2,
  Layers,
  ShoppingCart,
  Sliders,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { api, getBaseUrl } from "../../lib/api";
import { GradientButton } from "../GradientButton";
import {
  CanvaElement,
  CanvaTemplate,
  ColorVariant,
  OFFICIAL_PRESET_TEMPLATES,
  MODERN_FLORAL_COLOR_VARIANTS,
  useCanvaTemplates,
} from "../../hooks/useCanvaTemplates";
import { useQueryClient } from "@tanstack/react-query";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CANVAS_WIDTH = Math.min(SCREEN_WIDTH - 32, 380);
const CANVAS_HEIGHT = Math.round(CANVAS_WIDTH * 1.42); // Standard 5:7 luxury card ratio

const LUXURY_PALETTES = [
  { name: "Purple", hex: "#3B1B54" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Rose Gold", hex: "#E0A96D" },
  { name: "Ruby Crimson", hex: "#991B1B" },
  { name: "Emerald", hex: "#065F46" },
  { name: "Midnight Noir", hex: "#0F172A" },
  { name: "Champagne", hex: "#F5E6CA" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Dark Charcoal", hex: "#2C1838" },
];

const LUXURY_BACKGROUNDS = [
  { name: "Amethyst Floral", color: "#FAF9FC", image: "https://res.cloudinary.com/dqiwclph/image/upload/v1787498608/bervic-shop/products/tby6u0pfaknatimimfni.jpg" },
  { name: "Parchment Gold", color: "#F3EAD8", image: "/images/canva/parchment-bg.jpg" },
  { name: "Velvet Red", color: "#450A0A" },
  { name: "Royal Noir", color: "#09090B" },
  { name: "Ivory Silk", color: "#FDFBF7" },
  { name: "Emerald Luxe", color: "#022C22" },
];

const FONTS = [
  { name: "Luxury Serif", value: Platform.OS === "ios" ? "Georgia" : "serif" },
  { name: "Script Calligraphy", value: Platform.OS === "ios" ? "Snell Roundhand" : "serif" },
  { name: "Modern Minimal", value: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif" },
  { name: "Imperial Roman", value: Platform.OS === "ios" ? "Times New Roman" : "serif" },
];

interface CanvaTouchStudioProps {
  visible: boolean;
  onClose: () => void;
  initialTemplate?: CanvaTemplate | null;
  onOrderPhysicalCard?: (template: CanvaTemplate, elements: CanvaElement[]) => void;
}

export function CanvaTouchStudio({
  visible,
  onClose,
  initialTemplate,
  onOrderPhysicalCard,
}: CanvaTouchStudioProps) {
  const queryClient = useQueryClient();
  const { data: allTemplates } = useCanvaTemplates();

  // Active template configuration
  const [activeTemplate, setActiveTemplate] = useState<CanvaTemplate>(
    initialTemplate || OFFICIAL_PRESET_TEMPLATES[0]
  );
  const [elements, setElements] = useState<CanvaElement[]>(
    initialTemplate?.elements?.length
      ? initialTemplate.elements
      : OFFICIAL_PRESET_TEMPLATES[0].elements
  );
  const [backgroundColor, setBackgroundColor] = useState(
    initialTemplate?.backgroundColor || OFFICIAL_PRESET_TEMPLATES[0].backgroundColor || "#FAF9FC"
  );
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    initialTemplate?.backgroundImage || initialTemplate?.previewImage || OFFICIAL_PRESET_TEMPLATES[0].backgroundImage
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"text" | "palette" | "elements" | "autofill" | "layers">("text");
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // Sync when initialTemplate changes
  useEffect(() => {
    if (initialTemplate) {
      setActiveTemplate(initialTemplate);
      setElements(initialTemplate.elements || []);
      setBackgroundColor(initialTemplate.backgroundColor || "#FAF9FC");
      setBackgroundImage(initialTemplate.backgroundImage || initialTemplate.previewImage);
      if (initialTemplate.elements?.length) {
        setSelectedId(initialTemplate.elements[0].id);
      }
    } else {
      const defaultTpl = OFFICIAL_PRESET_TEMPLATES[0];
      setActiveTemplate(defaultTpl);
      setElements(defaultTpl.elements);
      setBackgroundColor(defaultTpl.backgroundColor);
      setBackgroundImage(defaultTpl.backgroundImage);
      setSelectedId(defaultTpl.elements[3]?.id || defaultTpl.elements[0]?.id || null);
    }
  }, [initialTemplate]);

  const selectedElement = elements.find((el) => el.id === selectedId);

  // Asset URL normalizer
  const resolveAssetUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    return `${getBaseUrl()}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Update selected element
  const updateSelectedElement = (updates: Partial<CanvaElement>) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? { ...el, ...updates } : el))
    );
  };

  // Nudge positioning (D-pad)
  const handleNudge = (dx: number, dy: number) => {
    if (!selectedElement) return;
    Haptics.selectionAsync();
    updateSelectedElement({
      x: Math.round((selectedElement.x + dx) * 10) / 10,
      y: Math.round((selectedElement.y + dy) * 10) / 10,
    });
  };

  // Add new text element
  const handleAddText = (defaultText = "New Custom Text", fontSize = 16) => {
    const newId = `txt-${Date.now()}`;
    const newEl: CanvaElement = {
      id: newId,
      type: "text",
      text: defaultText,
      fontFamily: "serif",
      fontSize,
      color: activeTemplate.topic === "vintage" ? "#5C4E3A" : "#3B1B54",
      fontWeight: "bold",
      textAlign: "center",
      x: 10,
      y: 45,
      width: 80,
      height: 6,
      rotation: 0,
      opacity: 1,
      zIndex: elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
    setActiveTab("text");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Add motif/sticker
  const handleAddMotif = (iconSymbol: string, fontSize = 24) => {
    const newId = `motif-${Date.now()}`;
    const newEl: CanvaElement = {
      id: newId,
      type: "text",
      text: iconSymbol,
      fontSize,
      color: "#D4AF37",
      textAlign: "center",
      x: 40,
      y: 30,
      width: 20,
      height: 6,
      rotation: 0,
      opacity: 1,
      zIndex: elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Duplicate selected element
  const handleDuplicate = () => {
    if (!selectedElement) return;
    const newId = `dup-${Date.now()}`;
    const duplicated: CanvaElement = {
      ...selectedElement,
      id: newId,
      x: Math.min(80, selectedElement.x + 3),
      y: Math.min(80, selectedElement.y + 3),
      zIndex: elements.length + 1,
    };
    setElements((prev) => [...prev, duplicated]);
    setSelectedId(newId);
    Haptics.selectionAsync();
  };

  // Delete element
  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  // Apply Color Variant (e.g. Purple, Blue, Pink, Red, Sepia, Gold)
  const handleApplyColorVariant = (variant: ColorVariant) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBackgroundImage(variant.bgImage);

    // Update typography colors to match the variant
    setElements((prev) =>
      prev.map((el) => {
        if (el.id.includes("badge") || el.backgroundColor) {
          return { ...el, backgroundColor: variant.badgeBgColor, color: "#FFFFFF" };
        }
        if (el.fieldKey === "groomName" || el.fieldKey === "brideName" || el.fieldKey === "coupleNames") {
          return { ...el, color: variant.primaryTextColor };
        }
        if (el.fieldKey === "date" || el.id.includes("heading") || el.id.includes("save-date")) {
          return { ...el, color: variant.accentTextColor };
        }
        if (el.type === "text" && !el.id.includes("star") && !el.id.includes("cross")) {
          return { ...el, color: variant.primaryTextColor };
        }
        return el;
      })
    );
  };

  // Auto-Fill from Event Draft (/api/user/event-draft)
  const handleAutoFillFromDraft = async () => {
    setIsAutoFilling(true);
    try {
      const res = await api.get<any>("/api/user/event-draft");
      if (res?.draft) {
        const d = res.draft;
        const bride = d.hostNameOne || d.partnerOne || "";
        const groom = d.hostNameTwo || d.partnerTwo || "";
        const date = d.eventDate || d.weddingDate || "";
        const time = d.eventTime || d.weddingTime || "";
        const venue = d.venueName || (d.locations?.[0]?.name) || "";
        const rsvp = d.rsvpContact || d.contactPhone || "";

        setElements((prev) =>
          prev.map((el) => {
            // Groom Name
            if (groom && (el.fieldKey === "groomName" || el.id.includes("groom-name"))) {
              return { ...el, text: groom };
            }
            // Bride Name
            if (bride && (el.fieldKey === "brideName" || el.id.includes("bride-name"))) {
              return { ...el, text: bride };
            }
            // Couple Names
            if (bride && groom && (el.fieldKey === "coupleNames" || el.id.includes("couple-names"))) {
              return { ...el, text: `${groom} & ${bride}` };
            }
            // Wedding Date
            if (date && (el.fieldKey === "date" || el.id.includes("wedding-date") || el.id.includes("date-line"))) {
              return { ...el, text: time ? `${date}  @${time}` : date };
            }
            // Venue
            if (venue && (el.fieldKey === "venue" || el.id.includes("venue") || el.id.includes("marriage-details"))) {
              return { ...el, text: `${venue}${time ? `\nTime: ${time}` : ""}` };
            }
            // RSVP
            if (rsvp && (el.fieldKey === "rsvp" || el.id.includes("rsvp"))) {
              return { ...el, text: `R.S.V.P: ${rsvp}` };
            }
            return el;
          })
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Auto-Filled! ✨", "Your wedding invitation details have been applied to the card.");
      } else {
        Alert.alert("Notice", "No saved event draft found. You can edit the text fields directly!");
      }
    } catch {
      Alert.alert("Notice", "Could not fetch event draft. You can customize text directly!");
    } finally {
      setIsAutoFilling(false);
    }
  };

  // Save Card Design to User Account
  const handleSaveCard = async () => {
    setIsSaving(true);
    try {
      const groomEl = elements.find((el) => el.fieldKey === "groomName")?.text || "Groom";
      const brideEl = elements.find((el) => el.fieldKey === "brideName")?.text || "Bride";
      const dateEl = elements.find((el) => el.fieldKey === "date")?.text || "";
      const venueEl = elements.find((el) => el.fieldKey === "venue")?.text || "";

      await api.post("/api/user/cards/save", {
        templateId: activeTemplate.id,
        templateName: activeTemplate.name,
        partnerOne: groomEl,
        partnerTwo: brideEl,
        weddingDate: dateEl.slice(0, 30),
        venue: venueEl.slice(0, 50),
        cardDetailsJson: JSON.stringify(elements),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Design Saved! 🎉", "Your custom card design has been saved to your account.");
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
    } catch (err: any) {
      Alert.alert("Notice", err.message || "Card design saved locally.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-slate-950"
      >
        {/* Top Navigation Bar */}
        <View className="flex-row items-center justify-between px-4 pt-12 pb-3 bg-slate-900 border-b border-slate-800">
          <Pressable
            onPress={onClose}
            className="h-9 w-9 rounded-full bg-slate-800 items-center justify-center active:bg-slate-700"
          >
            <X size={18} color="#FFF" />
          </Pressable>

          <View className="items-center">
            <Text className="text-white font-extrabold text-sm tracking-tight" numberOfLines={1}>
              {activeTemplate.name}
            </Text>
            <Text className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              ✨ Canva 2D Touch Studio
            </Text>
          </View>

          <View className="flex-row gap-2">
            <Pressable
              onPress={handleAutoFillFromDraft}
              disabled={isAutoFilling}
              className="h-9 px-2.5 rounded-full bg-amber-500/20 border border-amber-500/50 flex-row items-center justify-center active:bg-amber-500/30"
            >
              <Wand2 size={13} color="#FBBF24" />
              <Text className="text-amber-300 text-[11px] font-bold ml-1">Auto-Fill</Text>
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
          contentContainerStyle={{ alignItems: "center", paddingVertical: 14 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Real Invitation Card Container */}
          <View
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              backgroundColor,
            }}
            className="rounded-3xl shadow-2xl relative overflow-hidden border border-amber-400/40"
          >
            {/* Background Texture / High-Res Invitation Image */}
            {backgroundImage ? (
              <Image
                source={{ uri: resolveAssetUrl(backgroundImage) }}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
              />
            ) : null}

            {/* Subtle Inner Gold Border */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: 8,
                bottom: 8,
                left: 8,
                right: 8,
                borderColor: "#D4AF37",
                borderWidth: 1,
                borderRadius: 20,
                opacity: 0.45,
              }}
            />

            {/* Rendered Elements with Percentage Coordinates */}
            {elements.map((el) => {
              const isSelected = el.id === selectedId;
              const leftPos = (el.x / 100) * CANVAS_WIDTH;
              const topPos = (el.y / 100) * CANVAS_HEIGHT;
              const elWidth = el.width ? (el.width / 100) * CANVAS_WIDTH : undefined;

              return (
                <Pressable
                  key={el.id}
                  onPress={() => {
                    setSelectedId(el.id);
                    setActiveTab("text");
                    Haptics.selectionAsync();
                  }}
                  style={{
                    position: "absolute",
                    left: leftPos,
                    top: topPos,
                    width: elWidth,
                    opacity: el.opacity ?? 1,
                    zIndex: isSelected ? 99 : el.zIndex ?? 1,
                    transform: [{ rotate: `${el.rotation || 0}deg` }],
                  }}
                >
                  <View
                    style={{
                      paddingHorizontal: 4,
                      paddingVertical: 2,
                      borderRadius: 6,
                      borderWidth: isSelected ? 1.5 : 0,
                      borderColor: isSelected ? "#EF4444" : "transparent",
                      backgroundColor: el.backgroundColor || (isSelected ? "rgba(239, 68, 68, 0.15)" : "transparent"),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: el.fontSize || 14,
                        color: el.color || "#1E293B",
                        fontWeight: (el.fontWeight as any) || "normal",
                        fontStyle: el.fontStyle === "italic" ? "italic" : "normal",
                        textAlign: el.textAlign || "center",
                        letterSpacing: el.letterSpacing || 0,
                        fontFamily: el.fontFamily,
                        lineHeight: el.fontSize ? Math.round(el.fontSize * (el.lineHeight || 1.2)) : undefined,
                      }}
                    >
                      {el.text}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Studio Toolbar */}
        <View className="bg-slate-900 border-t border-slate-800 p-4">
          {/* Main Control Tabs */}
          <View className="flex-row gap-1.5 mb-3">
            {[
              { key: "text", icon: Type, label: "Text" },
              { key: "palette", icon: Palette, label: "Theme" },
              { key: "elements", icon: Plus, label: "Add" },
              { key: "layers", icon: Layers, label: "Move & Layers" },
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
                      ? "bg-red-600 border-red-600 shadow-sm"
                      : "bg-slate-800 border-slate-700"
                  }`}
                >
                  <Icon size={13} color="#FFF" />
                  <Text className="text-white text-[11px] font-bold ml-1">{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* TAB 1: TEXT EDITING & FONT CONTROLS */}
          {activeTab === "text" && (
            <View>
              {selectedElement ? (
                <View>
                  {/* Live Text Input Field */}
                  <View className="bg-slate-800 border border-slate-700 rounded-2xl px-3.5 h-11 justify-center mb-2.5">
                    <TextInput
                      value={selectedElement.text}
                      onChangeText={(val) => updateSelectedElement({ text: val })}
                      placeholder="Edit card text..."
                      placeholderTextColor="#94A3B8"
                      className="text-white text-xs font-semibold"
                    />
                  </View>

                  {/* Size, Alignment & Font Picker Row */}
                  <View className="flex-row items-center justify-between gap-2 mb-2">
                    {/* Font Size (+ / -) */}
                    <View className="flex-row items-center gap-1.5 bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700">
                      <Text className="text-slate-400 text-[10.5px] font-bold">Size:</Text>
                      <Pressable
                        onPress={() =>
                          updateSelectedElement({
                            fontSize: Math.max(8, (selectedElement.fontSize || 14) - 2),
                          })
                        }
                        className="h-6 w-6 rounded-lg bg-slate-700 items-center justify-center"
                      >
                        <Text className="text-white font-bold text-xs">-</Text>
                      </Pressable>
                      <Text className="text-white font-black text-xs px-1">
                        {selectedElement.fontSize}
                      </Text>
                      <Pressable
                        onPress={() =>
                          updateSelectedElement({
                            fontSize: Math.min(48, (selectedElement.fontSize || 14) + 2),
                          })
                        }
                        className="h-6 w-6 rounded-lg bg-slate-700 items-center justify-center"
                      >
                        <Text className="text-white font-bold text-xs">+</Text>
                      </Pressable>
                    </View>

                    {/* Alignment */}
                    <View className="flex-row items-center bg-slate-800 p-1 rounded-xl border border-slate-700 gap-1">
                      {[
                        { align: "left", icon: AlignLeft },
                        { align: "center", icon: AlignCenter },
                        { align: "right", icon: AlignRight },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSel = selectedElement.textAlign === item.align;
                        return (
                          <Pressable
                            key={item.align}
                            onPress={() => updateSelectedElement({ textAlign: item.align as any })}
                            className={`h-7 w-7 rounded-lg items-center justify-center ${
                              isSel ? "bg-red-600" : ""
                            }`}
                          >
                            <Icon size={12} color={isSel ? "#FFF" : "#94A3B8"} />
                          </Pressable>
                        );
                      })}
                    </View>

                    {/* Actions: Duplicate & Delete */}
                    <View className="flex-row items-center gap-1.5">
                      <Pressable
                        onPress={handleDuplicate}
                        className="h-8 w-8 rounded-xl bg-slate-800 border border-slate-700 items-center justify-center"
                      >
                        <Copy size={13} color="#FFF" />
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

                  {/* Font Palette Swatches */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
                    {LUXURY_PALETTES.map((color) => (
                      <Pressable
                        key={color.hex}
                        onPress={() => updateSelectedElement({ color: color.hex })}
                        className={`h-7 w-7 rounded-full mr-2 items-center justify-center border-2 ${
                          selectedElement.color === color.hex
                            ? "border-white scale-110"
                            : "border-slate-700"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedElement.color === color.hex && (
                          <Check size={11} color={color.hex === "#FFFFFF" ? "#000" : "#FFF"} />
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <View className="py-3 items-center">
                  <Text className="text-slate-400 text-xs font-semibold">
                    👆 Tap any text element on the card to edit its content & font.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* TAB 2: THEME & COLOR VARIANTS */}
          {activeTab === "palette" && (
            <View>
              <Text className="text-white text-xs font-bold mb-2">
                Card Color & Background Theme
              </Text>

              {/* Color Variants (For Modern Floral) */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                {MODERN_FLORAL_COLOR_VARIANTS.map((v) => (
                  <Pressable
                    key={v.id}
                    onPress={() => handleApplyColorVariant(v)}
                    className="mr-3 items-center"
                  >
                    <View
                      className="h-10 w-10 rounded-2xl border-2 border-white/40 items-center justify-center shadow-md mb-1"
                      style={{ backgroundColor: v.swatchHex }}
                    >
                      <Sparkles size={14} color="#FFF" />
                    </View>
                    <Text className="text-slate-300 text-[10px] font-bold">{v.name.split(" ")[0]}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Background Color Swatches */}
              <Text className="text-slate-400 text-[11px] font-semibold mb-2">
                Paper Base Tone:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {LUXURY_BACKGROUNDS.map((bg) => (
                  <Pressable
                    key={bg.name}
                    onPress={() => {
                      setBackgroundColor(bg.color);
                      if (bg.image) setBackgroundImage(bg.image);
                      Haptics.selectionAsync();
                    }}
                    className="mr-2 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 flex-row items-center gap-1.5"
                  >
                    <View
                      className="h-4 w-4 rounded-full border border-slate-600"
                      style={{ backgroundColor: bg.color }}
                    />
                    <Text className="text-white text-[11px] font-semibold">{bg.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* TAB 3: ADD ELEMENTS & MOTIFS */}
          {activeTab === "elements" && (
            <View>
              <Text className="text-white text-xs font-bold mb-2">Add New Elements & Motifs</Text>
              <View className="flex-row flex-wrap gap-2 mb-2">
                <Pressable
                  onPress={() => handleAddText("Wedding Celebration", 22)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 flex-row items-center gap-1.5"
                >
                  <Plus size={12} color="#DC2626" />
                  <Text className="text-white text-xs font-bold">+ Heading</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleAddText("Together with their parents", 11)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 flex-row items-center gap-1.5"
                >
                  <Plus size={12} color="#DC2626" />
                  <Text className="text-white text-xs font-bold">+ Subtitle</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleAddText("Reception to follow at 7:00 PM", 10)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 flex-row items-center gap-1.5"
                >
                  <Plus size={12} color="#DC2626" />
                  <Text className="text-white text-xs font-bold">+ Body Text</Text>
                </Pressable>
              </View>

              {/* Motifs / Symbols */}
              <Text className="text-slate-400 text-[11px] font-semibold mb-1.5">
                Decorative Motifs:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[
                  { symbol: "💍", label: "Rings" },
                  { symbol: "✝", label: "Cross" },
                  { symbol: "🕉️", label: "Om" },
                  { symbol: "🌿", label: "Flora" },
                  { symbol: "💖", label: "Heart" },
                  { symbol: "✦", label: "Star" },
                  { symbol: "👑", label: "Royal" },
                  { symbol: "🪔", label: "Diya" },
                ].map((item) => (
                  <Pressable
                    key={item.label}
                    onPress={() => handleAddMotif(item.symbol, 24)}
                    className="mr-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 items-center justify-center"
                  >
                    <Text className="text-base mb-0.5">{item.symbol}</Text>
                    <Text className="text-slate-400 text-[9px] font-bold">{item.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* TAB 4: MOVE D-PAD & LAYERS */}
          {activeTab === "layers" && (
            <View>
              {selectedElement ? (
                <View className="flex-row items-center justify-between">
                  {/* Position D-Pad Nudge Controls */}
                  <View className="items-center">
                    <Text className="text-slate-400 text-[10px] font-bold mb-1">Nudge Position</Text>
                    <View className="items-center">
                      <Pressable
                        onPress={() => handleNudge(0, -1)}
                        className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center mb-1 active:bg-red-600"
                      >
                        <ArrowUp size={14} color="#FFF" />
                      </Pressable>
                      <View className="flex-row gap-1">
                        <Pressable
                          onPress={() => handleNudge(-1, 0)}
                          className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center active:bg-red-600"
                        >
                          <ArrowLeft size={14} color="#FFF" />
                        </Pressable>
                        <View className="h-8 w-8 rounded-lg bg-slate-950 items-center justify-center">
                          <Move size={12} color="#94A3B8" />
                        </View>
                        <Pressable
                          onPress={() => handleNudge(1, 0)}
                          className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center active:bg-red-600"
                        >
                          <ArrowRight size={14} color="#FFF" />
                        </Pressable>
                      </View>
                      <Pressable
                        onPress={() => handleNudge(0, 1)}
                        className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center mt-1 active:bg-red-600"
                      >
                        <ArrowDown size={14} color="#FFF" />
                      </Pressable>
                    </View>
                  </View>

                  {/* Layer Z-Index Reordering */}
                  <View className="flex-1 ml-4 space-y-2">
                    <Text className="text-slate-400 text-[10px] font-bold mb-1">Layer Depth</Text>
                    <Pressable
                      onPress={() =>
                        updateSelectedElement({ zIndex: (selectedElement.zIndex || 1) + 1 })
                      }
                      className="py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 flex-row items-center justify-between"
                    >
                      <Text className="text-white text-xs font-semibold">Bring Forward</Text>
                      <ArrowUp size={13} color="#FFF" />
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        updateSelectedElement({ zIndex: Math.max(1, (selectedElement.zIndex || 1) - 1) })
                      }
                      className="py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 flex-row items-center justify-between"
                    >
                      <Text className="text-white text-xs font-semibold">Send Backward</Text>
                      <ArrowDown size={13} color="#FFF" />
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Text className="text-slate-400 text-xs text-center py-3">
                  Select an element to move or adjust its layer order.
                </Text>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
