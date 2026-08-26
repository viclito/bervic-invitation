import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl, Image as RNImage } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  Camera,
  ShoppingBag,
  ChevronRight,
  Palette,
  QrCode,
  Sparkles,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { useAuthStore } from "../../lib/authStore";
import { useEventDraft } from "../../hooks/useEventDraft";
import { useTemplatesRegistry, TemplateItem } from "../../hooks/useTemplatesRegistry";
import { EventHeroCard } from "../../components/EventHeroCard";
import { CardScannerModal } from "../../components/CardScannerModal";
import { EventEditModal } from "../../components/EventEditModal";
import { DoorScannerModal } from "../../components/DoorScannerModal";
import { CanvaTouchStudio } from "../../components/canva/CanvaTouchStudio";
import { TemplatePreviewModal } from "../../components/TemplatePreviewModal";
import { API_BASE_URL, PRODUCTION_WEB_URL } from "../../lib/api";

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { data: draft, isLoading, refetch } = useEventDraft();
  const { data: templates } = useTemplatesRegistry();

  const [showScanner, setShowScanner] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDoorScanner, setShowDoorScanner] = useState(false);
  const [showCanvaStudio, setShowCanvaStudio] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);

  const coupleTitle =
    draft?.eventTitle ||
    (draft?.hostNameOne && draft?.hostNameTwo
      ? `${draft.hostNameOne} & ${draft.hostNameTwo}`
      : user?.name ? `${user.name}'s Wedding` : "Your Royal Wedding");

  const eventDate = draft?.eventDate || "Date TBD";
  const venuePlace = draft?.venueName || "Add Venue & Location";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={BRAND_COLORS.primaryRed}
          />
        }
      >
        {/* Top Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-[10px] font-extrabold text-red-600 uppercase tracking-[0.2em] mb-0.5 opacity-90">
              Bervic Royal Suite
            </Text>
            <Text className="text-2xl font-black text-slate-900 tracking-tight">
              {isAuthenticated ? `Welcome, ${user?.name?.split(" ")[0] || "Host"}` : "Wedding Studio"}
            </Text>
          </View>
          <View className="h-11 w-11 rounded-2xl bg-white p-1.5 items-center justify-center border border-slate-200 shadow-sm">
            <RNImage
              source={require("../../assets/logo.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Active Event Banner Card with Multi-Stop Red Gradient & Luxury Watermark */}
        <EventHeroCard
          coupleTitle={coupleTitle}
          eventDate={eventDate}
          venuePlace={venuePlace}
          onEdit={() => setShowEditModal(true)}
          onScan={() => setShowScanner(true)}
        />

        {/* Quick Action Tiles - Sleek Modern Style with Black Icons */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-extrabold text-slate-900">Quick Actions</Text>
          <Text className="text-[11px] font-semibold text-slate-400">Core Tools</Text>
        </View>

        <View className="flex-row flex-wrap justify-between mb-6">
          {/* Tile 1: AI Card Scanner */}
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setShowScanner(true);
            }}
            className="w-[48%] bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm mb-3 active:scale-[0.98] active:bg-slate-50 justify-between"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="h-11 w-11 rounded-2xl bg-slate-100 items-center justify-center border border-slate-200/60">
                <Camera size={20} color="#0F172A" />
              </View>
              <ChevronRight size={14} color="#94A3B8" />
            </View>
            <View>
              <Text className="font-extrabold text-slate-900 text-sm">AI Card Scanner</Text>
              <Text className="text-slate-500 text-xs mt-0.5 font-medium">Extract from photo</Text>
            </View>
          </Pressable>

          {/* Tile 2: Canva Studio */}
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setShowCanvaStudio(true);
            }}
            className="w-[48%] bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm mb-3 active:scale-[0.98] active:bg-slate-50 justify-between"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="h-11 w-11 rounded-2xl bg-slate-100 items-center justify-center border border-slate-200/60">
                <Palette size={20} color="#0F172A" />
              </View>
              <ChevronRight size={14} color="#94A3B8" />
            </View>
            <View>
              <Text className="font-extrabold text-slate-900 text-sm">Canva 2D Studio</Text>
              <Text className="text-slate-500 text-xs mt-0.5 font-medium">Design custom card</Text>
            </View>
          </Pressable>

          {/* Tile 3: Door Pass QR Scanner */}
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setShowDoorScanner(true);
            }}
            className="w-[48%] bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm active:scale-[0.98] active:bg-slate-50 justify-between"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="h-11 w-11 rounded-2xl bg-slate-100 items-center justify-center border border-slate-200/60">
                <QrCode size={20} color="#0F172A" />
              </View>
              <ChevronRight size={14} color="#94A3B8" />
            </View>
            <View>
              <Text className="font-extrabold text-slate-900 text-sm">Door QR Scanner</Text>
              <Text className="text-slate-500 text-xs mt-0.5 font-medium">VIP guest check-in</Text>
            </View>
          </Pressable>

          {/* Tile 4: Print Shop */}
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/(tabs)/shop");
            }}
            className="w-[48%] bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm active:scale-[0.98] active:bg-slate-50 justify-between"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="h-11 w-11 rounded-2xl bg-slate-100 items-center justify-center border border-slate-200/60">
                <ShoppingBag size={20} color="#0F172A" />
              </View>
              <ChevronRight size={14} color="#94A3B8" />
            </View>
            <View>
              <Text className="font-extrabold text-slate-900 text-sm">Print Shop</Text>
              <Text className="text-slate-500 text-xs mt-0.5 font-medium">Order 350 GSM prints</Text>
            </View>
          </Pressable>
        </View>

        {/* 47+ Luxury Themes Carousel */}
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-base font-extrabold text-slate-900">
              47+ Luxury Themes ({templates?.length || 47})
            </Text>
            <Text className="text-[11px] text-slate-500 font-medium">
              Tap any theme for interactive preview
            </Text>
          </View>
          <Pressable onPress={() => router.push("/(tabs)/events")}>
            <Text className="text-red-600 text-xs font-bold">View All 47 →</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
          {(templates || []).slice(0, 12).map((item) => {
            const thumbUrl = item.previewImage.startsWith("http")
              ? item.previewImage
              : `${API_BASE_URL}${item.previewImage}`;
            const fallbackUrl = `${PRODUCTION_WEB_URL}${item.previewImage}`;

            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setPreviewTemplate(item);
                }}
                className="w-44 bg-white rounded-3xl p-3 mr-3 border border-slate-200/90 shadow-sm active:bg-slate-50 active:scale-[0.98]"
              >
                <View className="h-28 rounded-2xl overflow-hidden mb-2.5 bg-slate-100 border border-slate-200/60 relative">
                  <Image
                    source={{ uri: thumbUrl }}
                    placeholder={{ uri: fallbackUrl }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    transition={200}
                  />
                  {item.isPremium && (
                    <View className="absolute top-1.5 left-1.5 bg-amber-500 px-1.5 py-0.5 rounded-md">
                      <Text className="text-white text-[8px] font-extrabold">CINEMATIC</Text>
                    </View>
                  )}
                  <View className="absolute bottom-1.5 right-1.5 bg-black/60 px-1.5 py-0.5 rounded-md flex-row items-center gap-0.5">
                    <Sparkles size={8} color="#FDE047" />
                    <Text className="text-white text-[8px] font-bold">Preview</Text>
                  </View>
                </View>

                <Text className="font-extrabold text-slate-900 text-xs" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="text-slate-500 text-[10px] font-medium mt-0.5" numberOfLines={1}>
                  {item.styleTag}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </ScrollView>

      {/* Interactive Modals */}
      <CardScannerModal visible={showScanner} onClose={() => setShowScanner(false)} />
      <EventEditModal visible={showEditModal} onClose={() => setShowEditModal(false)} draft={draft} />
      <DoorScannerModal visible={showDoorScanner} onClose={() => setShowDoorScanner(false)} />
      <CanvaTouchStudio visible={showCanvaStudio} onClose={() => setShowCanvaStudio(false)} />
      <TemplatePreviewModal
        visible={!!previewTemplate}
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </SafeAreaView>
  );
}
