import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl, TextInput, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  Plus,
  MapPin,
  Clock,
  Heart,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Search,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { useEventDraft } from "../../hooks/useEventDraft";
import { useMyInvitations } from "../../hooks/useMyInvitations";
import { useTemplatesRegistry, TemplateItem } from "../../hooks/useTemplatesRegistry";
import { EventEditModal } from "../../components/EventEditModal";
import { CardScannerModal } from "../../components/CardScannerModal";
import { TemplatePreviewModal } from "../../components/TemplatePreviewModal";
import { API_BASE_URL, PRODUCTION_WEB_URL } from "../../lib/api";

const TEMPLATE_CATEGORIES = [
  { key: "all", label: "All Themes" },
  { key: "wedding", label: "Wedding" },
  { key: "birthday", label: "Birthday" },
];

export default function EventsScreen() {
  const { data: draft, isLoading, refetch } = useEventDraft();
  const { data: invitations, refetch: refetchInvitations } = useMyInvitations();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: allTemplates } = useTemplatesRegistry(selectedCategory);

  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<"basics" | "venues" | "schedule" | "rsvp">("basics");
  const [showScanner, setShowScanner] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);

  const coupleDesc =
    draft?.hostNameOne && draft?.hostNameTwo
      ? `${draft.hostNameOne} & ${draft.hostNameTwo} • Monogram: ${draft.coupleInitials || "S & A"}`
      : "Tap to enter couple names";

  const dateDesc =
    draft?.eventDate
      ? `${draft.eventDate} ${draft.eventTime ? `• ${draft.eventTime}` : "(10:28 AM)"}`
      : "Tap to set wedding date & time";

  let resolvedVenueName = draft?.venueName || "";
  let resolvedVenueAddr = draft?.venueAddress || "";
  try {
    if (!resolvedVenueName && draft?.locationsJson) {
      const locs = JSON.parse(draft.locationsJson);
      if (locs.length > 0 && locs[0]) {
        resolvedVenueName = locs[0].subLabel || locs[0].mainTitle || locs[0].name || "";
        resolvedVenueAddr = locs[0].address || "";
      }
    }
  } catch {}

  const venueDesc = resolvedVenueName
    ? `${resolvedVenueName}${resolvedVenueAddr ? ` — ${resolvedVenueAddr}` : ""}`
    : "Tap to add venue addresses & Google Maps";

  let galleryCount = 0;
  try {
    if (draft?.galleryImagesJson) {
      galleryCount = JSON.parse(draft.galleryImagesJson).length;
    }
  } catch {}

  const storyDesc = `${galleryCount} Photos Uploaded • ${draft?.loveStoryVideoUrl ? "1 Video Teaser" : "No Video"}`;

  const filteredTemplates = (allTemplates || []).filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.styleTag.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  const onRefreshAll = async () => {
    await Promise.all([refetch(), refetchInvitations()]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefreshAll}
            tintColor={BRAND_COLORS.primaryRed}
          />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">Event Studio</Text>
            <Text className="text-slate-500 text-xs">Manage details & select website design</Text>
          </View>
          <Pressable
            onPress={() => {
              setModalInitialTab("basics");
              setShowEditModal(true);
            }}
            className="h-10 px-3.5 rounded-2xl bg-red-600 flex-row items-center justify-center shadow-md shadow-red-200 active:bg-red-700"
          >
            <Plus size={16} color={BRAND_COLORS.pureWhite} />
            <Text className="text-white text-xs font-bold ml-1">Edit Details</Text>
          </Pressable>
        </View>

        {/* Wizard Progress Card */}
        <View className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-5">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Sparkles size={16} color={BRAND_COLORS.primaryRed} />
              <Text className="font-bold text-slate-900 text-sm ml-1.5">
                {draft?.profileName || `${draft?.hostNameOne || "Sam"} & ${draft?.hostNameTwo || "Ayarin"}'s Wedding`}
              </Text>
            </View>
            <Text className="text-red-600 font-bold text-xs">
              {draft?.isComplete ? "100% Ready" : "Details Active"}
            </Text>
          </View>
          <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
            <View
              className={`h-full bg-red-600 rounded-full ${
                draft?.isComplete ? "w-full" : "w-[80%]"
              }`}
            />
          </View>
          <Text className="text-slate-500 text-xs">
            {draft?.venueMapUrl
              ? "All core venue and schedule details synced to database."
              : "Tip: Add Google Maps navigation link for your guests."}
          </Text>
        </View>

        {/* Details Sections with direct tab jump */}
        <Text className="text-base font-extrabold text-slate-900 mb-3">Event Details</Text>

        {[
          { icon: Heart, title: "Couple & Hosts", desc: coupleDesc, tab: "basics" },
          { icon: Clock, title: "Date, Time & Day Timeline", desc: dateDesc, tab: "basics" },
          { icon: MapPin, title: "Venues & Maps", desc: venueDesc, tab: "venues" },
          { icon: ImageIcon, title: "Our Story & Photo Gallery", desc: storyDesc, tab: "rsvp" },
        ].map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <Pressable
              key={idx}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setModalInitialTab(sec.tab as any);
                setShowEditModal(true);
              }}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-3 flex-row items-center justify-between active:bg-slate-50"
            >
              <View className="flex-row items-center flex-1 pr-2">
                <View className="h-10 w-10 rounded-xl bg-red-50 items-center justify-center mr-3">
                  <Icon size={18} color={BRAND_COLORS.primaryRed} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-slate-900 text-sm">{sec.title}</Text>
                  <Text className="text-slate-500 text-xs mt-0.5" numberOfLines={1}>
                    {sec.desc}
                  </Text>
                </View>
              </View>
              <Text className="text-red-600 text-xs font-bold">Edit</Text>
            </Pressable>
          );
        })}

        {/* Published Invitations */}
        {invitations && invitations.length > 0 && (
          <View className="mt-2 mb-5">
            <Text className="text-base font-extrabold text-slate-900 mb-2">
              Active Public Web Link
            </Text>
            {invitations.map((inv) => (
              <View
                key={inv.id}
                className="bg-red-50/60 p-4 rounded-2xl border border-red-200/80 mb-2 flex-row items-center justify-between"
              >
                <View className="flex-1 mr-2">
                  <Text className="font-extrabold text-slate-900 text-sm">
                    {inv.partnerOne && inv.partnerTwo ? `${inv.partnerOne} & ${inv.partnerTwo}` : inv.slug}
                  </Text>
                  <Text className="text-red-800 text-xs mt-0.5 font-semibold">
                    bervic.in/invitations/{inv.slug}
                  </Text>
                </View>
                <Pressable
                  onPress={() => Linking.openURL(`${PRODUCTION_WEB_URL}/invitations/${inv.slug}`)}
                  className="h-9 px-3.5 rounded-xl bg-red-600 flex-row items-center active:bg-red-700 shadow-sm"
                >
                  <Text className="text-white font-bold text-xs mr-1">Open Link</Text>
                  <ExternalLink size={12} color="#FFF" />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* 47 Website Theme Catalog */}
        <View className="mt-4 mb-2">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-base font-extrabold text-slate-900">
              Theme Catalog ({filteredTemplates.length})
            </Text>
            <Text className="text-xs text-slate-400 font-semibold">Tap to preview</Text>
          </View>
          <Text className="text-slate-500 text-xs mb-3">
            Choose the visual design theme for your public invitation website.
          </Text>

          {/* Search Bar */}
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-11 mb-3">
            <Search size={16} color="#94A3B8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search 47 themes by name or style..."
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-2 text-slate-900 text-xs"
            />
          </View>

          {/* Category Tabs */}
          <View className="flex-row gap-2 mb-4">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const isSel = selectedCategory === cat.key;
              return (
                <Pressable
                  key={cat.key}
                  onPress={() => {
                    setSelectedCategory(cat.key);
                    Haptics.selectionAsync();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl border ${
                    isSel
                      ? "bg-slate-900 border-slate-900"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSel ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* 47 Templates Grid */}
          <View className="flex-row flex-wrap justify-between pb-10">
            {filteredTemplates.map((item) => {
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
                  className="w-[48%] bg-white p-3 rounded-3xl border border-slate-200 shadow-sm mb-3.5 active:bg-slate-50 active:scale-[0.98]"
                >
                  <View className="h-32 rounded-2xl overflow-hidden mb-2 bg-slate-100 border border-slate-200 relative">
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
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <EventEditModal
        visible={showEditModal}
        initialTab={modalInitialTab}
        onClose={() => setShowEditModal(false)}
        draft={draft}
      />
      <CardScannerModal visible={showScanner} onClose={() => setShowScanner(false)} />
      <TemplatePreviewModal
        visible={!!previewTemplate}
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </SafeAreaView>
  );
}
