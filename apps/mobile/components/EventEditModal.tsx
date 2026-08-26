import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  X,
  Heart,
  Clock,
  MapPin,
  Sparkles,
  Calendar,
  Phone,
  Film,
  Plus,
  Trash2,
  CheckCircle2,
  PartyPopper,
  Home,
  Cake,
  UploadCloud,
  Image as ImageIcon,
  Layers,
  ListOrdered,
  Camera,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS, UserDraftDetailsData } from "@bervic/shared";
import { useUpdateEventDraft } from "../hooks/useEventDraft";
import { GradientButton } from "./GradientButton";
import { PRODUCTION_WEB_URL } from "../lib/api";

export interface EventSubFunction {
  id?: string;
  title: string;
  date: string;
  time: string;
  venue: string;
}

export interface DayTimelineItem {
  id?: string;
  title: string;
  time: string;
  date?: string;
  icon?: string;
}

export const WEDDING_DEFAULT_TIMELINE: DayTimelineItem[] = [
  { id: "tl-1", title: "Sacred Marriage Vows", time: "10:30 AM" },
  { id: "tl-2", title: "Traditional Wedding Feast", time: "01:00 PM" },
  { id: "tl-3", title: "Welcome at Home", time: "04:00 PM" },
  { id: "tl-4", title: "Grand Reception", time: "07:00 PM" },
  { id: "tl-5", title: "Cake Cutting Ceremony", time: "08:00 PM" },
  { id: "tl-6", title: "Gala Dinner", time: "08:30 PM" },
  { id: "tl-7", title: "Send Off & Blessings", time: "10:30 PM" },
];

export const WEDDING_DEFAULT_FUNCTIONS: EventSubFunction[] = [
  { id: "fn-1", title: "Haldi & Mehendi Ceremony", date: "2026-11-19", time: "04:00 PM", venue: "Ceremony Lawn" },
  { id: "fn-2", title: "Sangeet Musical Night", date: "2026-11-19", time: "07:30 PM", venue: "Palace Ballroom" },
  { id: "fn-3", title: "Sacred Marriage Vows", date: "2026-11-20", time: "10:28 AM", venue: "Marriage Ceremony Hall" },
  { id: "fn-4", title: "Grand Reception", date: "2026-11-20", time: "07:00 PM", venue: "Grand Banquet Hall" },
];

interface EventEditModalProps {
  visible: boolean;
  onClose: () => void;
  draft?: UserDraftDetailsData;
  initialTab?: "basics" | "venues" | "schedule" | "timeline" | "photos" | "rsvp";
}

export function EventEditModal({
  visible,
  onClose,
  draft,
  initialTab = "basics",
}: EventEditModalProps) {
  const updateDraft = useUpdateEventDraft();

  const [eventType, setEventType] = useState("WEDDING");
  const [profileName, setProfileName] = useState("");
  const [hostNameOne, setHostNameOne] = useState("");
  const [hostNameTwo, setHostNameTwo] = useState("");
  const [coupleInitials, setCoupleInitials] = useState("");
  const [tagline, setTagline] = useState("");
  const [inviteLine, setInviteLine] = useState("");
  const [turningAge, setTurningAge] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueMapUrl, setVenueMapUrl] = useState("");
  const [venueImage, setVenueImage] = useState("");

  const [venueTwoName, setVenueTwoName] = useState("");
  const [venueTwoAddress, setVenueTwoAddress] = useState("");
  const [venueTwoMapUrl, setVenueTwoMapUrl] = useState("");

  const [functions, setFunctions] = useState<EventSubFunction[]>([]);
  const [timelineItems, setTimelineItems] = useState<DayTimelineItem[]>([]);

  const [coverImage, setCoverImage] = useState("");
  const [coupleImage, setCoupleImage] = useState("");
  const [partnerTwoImage, setPartnerTwoImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [rsvpContact, setRsvpContact] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [loveStoryText, setLoveStoryText] = useState("");
  const [loveStoryVideoUrl, setLoveStoryVideoUrl] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [activeTab, setActiveTab] = useState<
    "basics" | "venues" | "schedule" | "timeline" | "photos" | "rsvp"
  >(initialTab);

  const safeHaptics = () => {
    try {
      Haptics.selectionAsync();
    } catch {}
  };

  useEffect(() => {
    if (visible) {
      setActiveTab(initialTab);
    }
  }, [visible, initialTab]);

  useEffect(() => {
    if (draft) {
      setEventType(draft.eventType || "WEDDING");
      setProfileName(draft.profileName || "");
      setHostNameOne(draft.hostNameOne || "");
      setHostNameTwo(draft.hostNameTwo || "");
      setCoupleInitials(draft.coupleInitials || "");
      setTagline(draft.tagline || "");
      setInviteLine(draft.inviteLine || "");
      setTurningAge(draft.turningAge || "");

      setEventDate(draft.eventDate || "");
      setEventTime(draft.eventTime || "");

      let vName = draft.venueName || "";
      let vAddr = draft.venueAddress || "";
      let vMap = draft.venueMapUrl || "";
      let vTwoName = draft.venueTwoName || "";
      let vTwoAddr = draft.venueTwoAddress || "";
      let vTwoMap = draft.venueTwoMapUrl || "";
      let vImg = draft.venueImage || "";

      let locs: any[] = [];
      try {
        if (draft.locations && Array.isArray(draft.locations)) {
          locs = draft.locations;
        } else if (draft.locationsJson) {
          locs = JSON.parse(draft.locationsJson);
        }
      } catch {}

      if (Array.isArray(locs) && locs.length > 0 && locs[0]) {
        if (!vName) vName = locs[0].subLabel || locs[0].mainTitle || locs[0].name || "";
        if (!vAddr) vAddr = locs[0].address || "";
        if (!vMap) vMap = locs[0].mapUrl || "";
        if (!vImg && locs[0].venuePhoto) vImg = locs[0].venuePhoto;
      }
      if (Array.isArray(locs) && locs.length > 1 && locs[1]) {
        if (!vTwoName) vTwoName = locs[1].subLabel || locs[1].mainTitle || locs[1].name || "";
        if (!vTwoAddr) vTwoAddr = locs[1].address || "";
        if (!vTwoMap) vTwoMap = locs[1].mapUrl || "";
      }

      setVenueName(vName);
      setVenueAddress(vAddr);
      setVenueMapUrl(vMap);
      setVenueImage(vImg);
      setVenueTwoName(vTwoName);
      setVenueTwoAddress(vTwoAddr);
      setVenueTwoMapUrl(vTwoMap);

      setCoverImage(draft.coverImage || "");
      setCoupleImage(draft.coupleImage || "");
      setPartnerTwoImage(draft.partnerTwoImage || "");

      try {
        if (draft.galleryImagesJson) {
          const parsed = JSON.parse(draft.galleryImagesJson);
          setGalleryImages(Array.isArray(parsed) ? parsed : []);
        } else if (Array.isArray((draft as any).galleryImages)) {
          setGalleryImages((draft as any).galleryImages);
        } else {
          setGalleryImages([]);
        }
      } catch {
        setGalleryImages([]);
      }

      setRsvpContact(draft.rsvpContact || "");
      setDressCode(draft.dressCode || "");
      setLoveStoryText(draft.loveStoryText || "");
      setLoveStoryVideoUrl(draft.loveStoryVideoUrl || "");
      setAdditionalNotes(draft.additionalNotes || "");

      try {
        if (draft.functions && Array.isArray(draft.functions)) {
          setFunctions(draft.functions as EventSubFunction[]);
        } else if (draft.functionsJson) {
          const parsed = JSON.parse(draft.functionsJson);
          setFunctions(Array.isArray(parsed) ? parsed : []);
        } else {
          setFunctions(WEDDING_DEFAULT_FUNCTIONS);
        }
      } catch {
        setFunctions(WEDDING_DEFAULT_FUNCTIONS);
      }

      try {
        if (draft.timelineItems && Array.isArray(draft.timelineItems)) {
          setTimelineItems(draft.timelineItems as DayTimelineItem[]);
        } else if (draft.dayTimelineJson) {
          const parsed = JSON.parse(draft.dayTimelineJson);
          setTimelineItems(Array.isArray(parsed) ? parsed : []);
        } else {
          setTimelineItems(WEDDING_DEFAULT_TIMELINE);
        }
      } catch {
        setTimelineItems(WEDDING_DEFAULT_TIMELINE);
      }
    }
  }, [draft, visible]);

  // Image Upload Handler
  const handleUploadImage = async (onSuccess: (url: string) => void) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Please grant access to your photo library to select pictures.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setIsUploadingPhoto(true);
        try {
          const formData = new FormData();
          const filename = asset.uri.split("/").pop() || "photo.jpg";
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : "image/jpeg";

          formData.append("file", {
            uri: asset.uri,
            name: filename,
            type,
          } as any);
          formData.append("target", "user-drafts");

          const response = await fetch(`${PRODUCTION_WEB_URL}/api/upload`, {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          });
          const resJson = await response.json();
          if (resJson?.url) {
            onSuccess(resJson.url);
            safeHaptics();
            return;
          }
        } catch {}
        // Fallback to local URI
        onSuccess(asset.uri);
        safeHaptics();
      }
    } catch (e: any) {
      Alert.alert("Upload Error", e.message || "Failed to pick image");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Schedule Functions
  const handleAddFunction = () => {
    safeHaptics();
    setFunctions((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      {
        id: `fn-${Date.now()}`,
        title: "Sangeet / Reception",
        date: eventDate || "2026-11-20",
        time: "07:00 PM",
        venue: venueName || "Banquet Palace Hall",
      },
    ]);
  };

  const handleUpdateFunction = (index: number, field: keyof EventSubFunction, value: string) => {
    setFunctions((prev) => {
      const currentList = Array.isArray(prev) ? prev : [];
      const updated = [...currentList];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleRemoveFunction = (index: number) => {
    safeHaptics();
    setFunctions((prev) => {
      const currentList = Array.isArray(prev) ? prev : [];
      return currentList.filter((_, i) => i !== index);
    });
  };

  // Day Timeline Items
  const handleAddTimelineItem = () => {
    safeHaptics();
    setTimelineItems((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      {
        id: `tl-${Date.now()}`,
        title: "Ceremony & Blessings",
        time: "05:00 PM",
        date: eventDate || "2026-11-20",
      },
    ]);
  };

  const handleUpdateTimelineItem = (index: number, field: keyof DayTimelineItem, value: string) => {
    setTimelineItems((prev) => {
      const currentList = Array.isArray(prev) ? prev : [];
      const updated = [...currentList];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleRemoveTimelineItem = (index: number) => {
    safeHaptics();
    setTimelineItems((prev) => {
      const currentList = Array.isArray(prev) ? prev : [];
      return currentList.filter((_, i) => i !== index);
    });
  };

  // Gallery Array Handler
  const handleAddGalleryImage = (url: string) => {
    setGalleryImages((prev) => [...(Array.isArray(prev) ? prev : []), url]);
  };

  const handleRemoveGalleryImage = (index: number) => {
    safeHaptics();
    setGalleryImages((prev) => {
      const currentList = Array.isArray(prev) ? prev : [];
      return currentList.filter((_, i) => i !== index);
    });
  };

  const handleSave = async () => {
    try {
      const safeFunctions = Array.isArray(functions) ? functions : [];
      const safeTimeline = Array.isArray(timelineItems) ? timelineItems : [];
      const safeGallery = Array.isArray(galleryImages) ? galleryImages : [];

      const constructedLocations = [
        {
          id: "loc-1",
          mainTitle: eventType === "WEDDING" ? "Marriage Ceremony Venue" : "Main Celebration Venue",
          subLabel: venueName.trim() || "Marriage Ceremony Hall",
          address: venueAddress.trim() || "Your Full Address, City, State 000000",
          mapUrl: venueMapUrl.trim() || "https://maps.google.com",
          venuePhoto: venueImage.trim(),
        },
        ...(venueTwoName.trim()
          ? [
              {
                id: "loc-2",
                mainTitle: "Grand Reception Venue",
                subLabel: venueTwoName.trim(),
                address: venueTwoAddress.trim(),
                mapUrl: venueTwoMapUrl.trim() || "https://maps.google.com",
              },
            ]
          : []),
      ];

      await updateDraft.mutateAsync({
        id: draft?.id,
        eventType,
        profileName: profileName || `${hostNameOne || "Sam"} & ${hostNameTwo || "Ayarin"}'s ${eventType}`,
        hostNameOne: hostNameOne.trim(),
        hostNameTwo: hostNameTwo.trim(),
        coupleInitials: coupleInitials.trim() || `${hostNameOne[0] || "S"} & ${hostNameTwo[0] || "A"}`,
        tagline: tagline.trim(),
        inviteLine: inviteLine.trim(),
        turningAge: turningAge.trim(),
        eventDate: eventDate.trim(),
        eventTime: eventTime.trim(),
        venueName: venueName.trim(),
        venueAddress: venueAddress.trim(),
        venueMapUrl: venueMapUrl.trim(),
        venueImage: venueImage.trim(),
        venueTwoName: venueTwoName.trim(),
        venueTwoAddress: venueTwoAddress.trim(),
        venueTwoMapUrl: venueTwoMapUrl.trim(),
        locationsJson: JSON.stringify(constructedLocations),
        functions: safeFunctions,
        functionsJson: JSON.stringify(safeFunctions),
        timelineItems: safeTimeline,
        dayTimelineJson: JSON.stringify(safeTimeline),
        coverImage: coverImage.trim(),
        coupleImage: coupleImage.trim(),
        partnerTwoImage: partnerTwoImage.trim(),
        galleryImagesJson: JSON.stringify(safeGallery),
        rsvpContact: rsvpContact.trim(),
        dressCode: dressCode.trim(),
        loveStoryText: loveStoryText.trim(),
        loveStoryVideoUrl: loveStoryVideoUrl.trim(),
        additionalNotes: additionalNotes.trim(),
        isComplete: true,
      });

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      Alert.alert("Success", "All wedding details, timeline, and photos synced successfully!");
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save event details");
    }
  };

  const safeFunctionsList = Array.isArray(functions) ? functions : [];
  const safeTimelineList = Array.isArray(timelineItems) ? timelineItems : [];
  const safeGalleryList = Array.isArray(galleryImages) ? galleryImages : [];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalBackdrop}
      >
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBox}>
                <Sparkles size={20} color={BRAND_COLORS.primaryRed} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Edit Event Suite & Profile</Text>
                <Text style={styles.headerSubtitle}>Syncs photos, timeline & details live</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* 6-Tab Navigation Scrollable Bar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScrollContainer}
            contentContainerStyle={styles.tabsContentContainer}
          >
            <TouchableOpacity
              onPress={() => {
                setActiveTab("basics");
                safeHaptics();
              }}
              style={[styles.tabBtn, activeTab === "basics" && styles.tabBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === "basics" && styles.tabTextActive]}>
                1. Basics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab("venues");
                safeHaptics();
              }}
              style={[styles.tabBtn, activeTab === "venues" && styles.tabBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === "venues" && styles.tabTextActive]}>
                2. Venues & Maps
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab("schedule");
                safeHaptics();
              }}
              style={[styles.tabBtn, activeTab === "schedule" && styles.tabBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === "schedule" && styles.tabTextActive]}>
                {`3. Functions (${safeFunctionsList.length})`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab("timeline");
                safeHaptics();
              }}
              style={[styles.tabBtn, activeTab === "timeline" && styles.tabBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === "timeline" && styles.tabTextActive]}>
                {`4. Timeline (${safeTimelineList.length})`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab("photos");
                safeHaptics();
              }}
              style={[styles.tabBtn, activeTab === "photos" && styles.tabBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === "photos" && styles.tabTextActive]}>
                {`5. Photos (${safeGalleryList.length})`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab("rsvp");
                safeHaptics();
              }}
              style={[styles.tabBtn, activeTab === "rsvp" && styles.tabBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === "rsvp" && styles.tabTextActive]}>
                6. RSVP & Story
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {/* ── TAB 1: BASICS & NAMES ── */}
            {activeTab === "basics" && (
              <View>
                {/* Event Category */}
                <Text style={styles.sectionLabel}>Event Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  {[
                    { key: "WEDDING", label: "Wedding", icon: Heart },
                    { key: "BIRTHDAY", label: "Birthday", icon: Cake },
                    { key: "ANNIVERSARY", label: "Anniversary", icon: Sparkles },
                    { key: "HOUSEWARMING", label: "Housewarming", icon: Home },
                    { key: "POOJA", label: "Pooja", icon: PartyPopper },
                  ].map((cat) => {
                    const isSel = eventType === cat.key;
                    const IconComp = cat.icon;
                    return (
                      <TouchableOpacity
                        key={cat.key}
                        onPress={() => {
                          setEventType(cat.key);
                          safeHaptics();
                        }}
                        style={[styles.categoryPill, isSel && styles.categoryPillActive]}
                        activeOpacity={0.8}
                      >
                        <IconComp size={14} color={isSel ? "#FFF" : "#64748B"} />
                        <Text style={[styles.categoryText, isSel && styles.categoryTextActive]}>
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Host / Couple Names */}
                <Text style={styles.sectionLabel}>
                  {eventType === "WEDDING" ? "Couple Names" : "Hosts / Celebrants"}
                </Text>
                <View style={styles.rowGap}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>
                      {eventType === "WEDDING" ? "Groom Name" : "Host Name 1"}
                    </Text>
                    <TextInput
                      value={hostNameOne}
                      onChangeText={setHostNameOne}
                      placeholder="e.g. Sam"
                      placeholderTextColor="#94A3B8"
                      style={styles.inputField}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>
                      {eventType === "WEDDING" ? "Bride Name" : "Host Name 2"}
                    </Text>
                    <TextInput
                      value={hostNameTwo}
                      onChangeText={setHostNameTwo}
                      placeholder="e.g. Ayarin"
                      placeholderTextColor="#94A3B8"
                      style={styles.inputField}
                    />
                  </View>
                </View>

                {/* Monogram Initials */}
                <View style={{ marginBottom: 14 }}>
                  <Text style={styles.fieldLabel}>Monogram Initials</Text>
                  <TextInput
                    value={coupleInitials}
                    onChangeText={setCoupleInitials}
                    placeholder="e.g. S & A"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />
                </View>

                {/* Turning Age if Birthday */}
                {eventType === "BIRTHDAY" && (
                  <View style={{ marginBottom: 14 }}>
                    <Text style={styles.fieldLabel}>Turning Age (e.g. 25th / 50th)</Text>
                    <TextInput
                      value={turningAge}
                      onChangeText={setTurningAge}
                      placeholder="e.g. 25th"
                      placeholderTextColor="#94A3B8"
                      style={styles.inputField}
                    />
                  </View>
                )}

                {/* Date & Time */}
                <Text style={styles.sectionLabel}>Main Celebration Date & Time</Text>
                <View style={styles.rowGap}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Date (YYYY-MM-DD)</Text>
                    <TextInput
                      value={eventDate}
                      onChangeText={setEventDate}
                      placeholder="2026-11-20"
                      placeholderTextColor="#94A3B8"
                      style={styles.inputField}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Time (HH:MM AM/PM)</Text>
                    <TextInput
                      value={eventTime}
                      onChangeText={setEventTime}
                      placeholder="10:28 AM"
                      placeholderTextColor="#94A3B8"
                      style={styles.inputField}
                    />
                  </View>
                </View>

                {/* Tagline */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.fieldLabel}>Invitation Tagline / Header Line</Text>
                  <TextInput
                    value={tagline}
                    onChangeText={setTagline}
                    placeholder="Together with their families request the honour of your presence"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />
                </View>
              </View>
            )}

            {/* ── TAB 2: VENUES & MAPS ── */}
            {activeTab === "venues" && (
              <View>
                <View style={styles.infoBanner}>
                  <Text style={styles.infoBannerTitle}>Primary Ceremony Venue</Text>
                  <Text style={styles.infoBannerSub}>
                    Displayed on your digital invitation cover, navigation card, and GPS routes.
                  </Text>
                </View>

                <View style={{ marginBottom: 14 }}>
                  <Text style={styles.fieldLabel}>Venue Name / Palace</Text>
                  <TextInput
                    value={venueName}
                    onChangeText={setVenueName}
                    placeholder="e.g. Marriage Ceremony Hall"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />
                </View>

                <View style={{ marginBottom: 14 }}>
                  <Text style={styles.fieldLabel}>Full Street Address, City, State</Text>
                  <TextInput
                    value={venueAddress}
                    onChangeText={setVenueAddress}
                    placeholder="Your Full Address, City, State 000000"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />
                </View>

                <View style={{ marginBottom: 14 }}>
                  <View style={styles.fieldHeaderRow}>
                    <Text style={styles.fieldLabel}>Google Maps Navigation Link</Text>
                    {venueMapUrl ? (
                      <TouchableOpacity onPress={() => Linking.openURL(venueMapUrl)}>
                        <Text style={styles.linkAction}>Test Link ↗</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <TextInput
                    value={venueMapUrl}
                    onChangeText={setVenueMapUrl}
                    placeholder="https://maps.google.com/?q=..."
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />
                </View>

                <View style={{ marginBottom: 18 }}>
                  <Text style={styles.fieldLabel}>Primary Venue Photo URL</Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TextInput
                      value={venueImage}
                      onChangeText={setVenueImage}
                      placeholder="https://images.unsplash.com/..."
                      placeholderTextColor="#94A3B8"
                      style={[styles.inputField, { flex: 1 }]}
                    />
                    <TouchableOpacity
                      onPress={() => handleUploadImage((url) => setVenueImage(url))}
                      style={styles.uploadBtnMini}
                      activeOpacity={0.8}
                    >
                      <Camera size={14} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.sectionLabel}>Secondary Venue / Reception Hall (Optional)</Text>

                <View style={{ marginBottom: 14 }}>
                  <Text style={styles.fieldLabel}>Reception Venue Name</Text>
                  <TextInput
                    value={venueTwoName}
                    onChangeText={setVenueTwoName}
                    placeholder="e.g. Grand Banquet Hall"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />
                </View>

                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.fieldLabel}>Reception Full Address</Text>
                  <TextInput
                    value={venueTwoAddress}
                    onChangeText={setVenueTwoAddress}
                    placeholder="Reception Street Address, City"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />
                </View>
              </View>
            )}

            {/* ── TAB 3: SCHEDULE FUNCTIONS ── */}
            {activeTab === "schedule" && (
              <View>
                <View style={styles.scheduleHeaderRow}>
                  <View>
                    <Text style={styles.sectionLabel}>Schedule Sub-Functions</Text>
                    <Text style={styles.fieldSubLabel}>Haldi, Mehendi, Sangeet, Reception</Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleAddFunction}
                    style={styles.addFunctionBtn}
                    activeOpacity={0.8}
                  >
                    <Plus size={13} color="#FFF" />
                    <Text style={styles.addFunctionBtnText}>Add Function</Text>
                  </TouchableOpacity>
                </View>

                {safeFunctionsList.length > 0 ? (
                  safeFunctionsList.map((fn, idx) => (
                    <View key={fn?.id || `fn-${idx}`} style={styles.functionCard}>
                      <View style={styles.functionCardHeader}>
                        <Text style={styles.functionNumber}>Function #{idx + 1}</Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveFunction(idx)}
                          style={styles.trashBtn}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={13} color="#DC2626" />
                        </TouchableOpacity>
                      </View>

                      <View style={{ marginBottom: 8 }}>
                        <Text style={styles.tinyLabel}>Function Title</Text>
                        <TextInput
                          value={fn?.title || ""}
                          onChangeText={(t) => handleUpdateFunction(idx, "title", t)}
                          placeholder="e.g. Sangeet Night / Grand Reception"
                          placeholderTextColor="#94A3B8"
                          style={styles.cardInput}
                        />
                      </View>

                      <View style={styles.rowGap}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.tinyLabel}>Date</Text>
                          <TextInput
                            value={fn?.date || ""}
                            onChangeText={(t) => handleUpdateFunction(idx, "date", t)}
                            placeholder="2026-11-20"
                            placeholderTextColor="#94A3B8"
                            style={styles.cardInput}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.tinyLabel}>Time</Text>
                          <TextInput
                            value={fn?.time || ""}
                            onChangeText={(t) => handleUpdateFunction(idx, "time", t)}
                            placeholder="07:00 PM"
                            placeholderTextColor="#94A3B8"
                            style={styles.cardInput}
                          />
                        </View>
                      </View>

                      <View style={{ marginTop: 8 }}>
                        <Text style={styles.tinyLabel}>Venue</Text>
                        <TextInput
                          value={fn?.venue || ""}
                          onChangeText={(t) => handleUpdateFunction(idx, "venue", t)}
                          placeholder="Ceremony Hall / Palace Ballroom"
                          placeholderTextColor="#94A3B8"
                          style={styles.cardInput}
                        />
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyCard}>
                    <Calendar size={28} color="#94A3B8" />
                    <Text style={styles.emptyCardTitle}>No sub-functions added</Text>
                    <Text style={styles.emptyCardSub}>
                      Tap "+ Add Function" to schedule Sangeet, Haldi, or Reception.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* ── TAB 4: DAY TIMELINE ── */}
            {activeTab === "timeline" && (
              <View>
                <View style={styles.scheduleHeaderRow}>
                  <View>
                    <Text style={styles.sectionLabel}>Main Day Timeline</Text>
                    <Text style={styles.fieldSubLabel}>Hour-by-hour event itinerary for guests</Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleAddTimelineItem}
                    style={styles.addFunctionBtn}
                    activeOpacity={0.8}
                  >
                    <Plus size={13} color="#FFF" />
                    <Text style={styles.addFunctionBtnText}>Add Event</Text>
                  </TouchableOpacity>
                </View>

                {safeTimelineList.length > 0 ? (
                  safeTimelineList.map((item, idx) => (
                    <View key={item?.id || `tl-${idx}`} style={styles.timelineCard}>
                      <View style={styles.functionCardHeader}>
                        <View style={styles.timelineIndexBadge}>
                          <Clock size={11} color="#DC2626" />
                          <Text style={styles.timelineIndexText}>Step #{idx + 1}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveTimelineItem(idx)}
                          style={styles.trashBtn}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={13} color="#DC2626" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.rowGap}>
                        <View style={{ flex: 1.6 }}>
                          <Text style={styles.tinyLabel}>Itinerary Title</Text>
                          <TextInput
                            value={item?.title || ""}
                            onChangeText={(t) => handleUpdateTimelineItem(idx, "title", t)}
                            placeholder="e.g. Sacred Marriage Vows"
                            placeholderTextColor="#94A3B8"
                            style={styles.cardInput}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.tinyLabel}>Scheduled Time</Text>
                          <TextInput
                            value={item?.time || ""}
                            onChangeText={(t) => handleUpdateTimelineItem(idx, "time", t)}
                            placeholder="10:30 AM"
                            placeholderTextColor="#94A3B8"
                            style={styles.cardInput}
                          />
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyCard}>
                    <ListOrdered size={28} color="#94A3B8" />
                    <Text style={styles.emptyCardTitle}>No timeline steps added</Text>
                    <Text style={styles.emptyCardSub}>
                      Tap "+ Add Event" to create your day itinerary (e.g. Vows, Feast, Reception).
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* ── TAB 5: PHOTOS & GALLERY ── */}
            {activeTab === "photos" && (
              <View>
                <Text style={styles.sectionLabel}>Portraits & Banner Photos</Text>

                {/* Groom / Host 1 Photo */}
                <View style={styles.photoUploadRow}>
                  <View style={styles.photoThumbBox}>
                    {coupleImage ? (
                      <Image source={{ uri: coupleImage }} style={styles.photoThumb} contentFit="cover" />
                    ) : (
                      <ImageIcon size={22} color="#94A3B8" />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>
                      {eventType === "WEDDING" ? "Groom Portrait Photo" : "Host 1 Photo"}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <TextInput
                        value={coupleImage}
                        onChangeText={setCoupleImage}
                        placeholder="Image URL or upload"
                        placeholderTextColor="#94A3B8"
                        style={[styles.inputField, { flex: 1, height: 38 }]}
                      />
                      <TouchableOpacity
                        onPress={() => handleUploadImage((url) => setCoupleImage(url))}
                        style={styles.uploadBtnMini}
                        activeOpacity={0.8}
                      >
                        <Camera size={14} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Bride / Host 2 Photo */}
                <View style={styles.photoUploadRow}>
                  <View style={styles.photoThumbBox}>
                    {partnerTwoImage ? (
                      <Image source={{ uri: partnerTwoImage }} style={styles.photoThumb} contentFit="cover" />
                    ) : (
                      <ImageIcon size={22} color="#94A3B8" />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>
                      {eventType === "WEDDING" ? "Bride Portrait Photo" : "Host 2 Photo"}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <TextInput
                        value={partnerTwoImage}
                        onChangeText={setPartnerTwoImage}
                        placeholder="Image URL or upload"
                        placeholderTextColor="#94A3B8"
                        style={[styles.inputField, { flex: 1, height: 38 }]}
                      />
                      <TouchableOpacity
                        onPress={() => handleUploadImage((url) => setPartnerTwoImage(url))}
                        style={styles.uploadBtnMini}
                        activeOpacity={0.8}
                      >
                        <Camera size={14} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Cover Banner Photo */}
                <View style={styles.photoUploadRow}>
                  <View style={styles.photoThumbBox}>
                    {coverImage ? (
                      <Image source={{ uri: coverImage }} style={styles.photoThumb} contentFit="cover" />
                    ) : (
                      <ImageIcon size={22} color="#94A3B8" />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Hero Banner / Cover Photo</Text>
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      <TextInput
                        value={coverImage}
                        onChangeText={setCoverImage}
                        placeholder="Image URL or upload"
                        placeholderTextColor="#94A3B8"
                        style={[styles.inputField, { flex: 1, height: 38 }]}
                      />
                      <TouchableOpacity
                        onPress={() => handleUploadImage((url) => setCoverImage(url))}
                        style={styles.uploadBtnMini}
                        activeOpacity={0.8}
                      >
                        <Camera size={14} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Wedding Gallery Section */}
                <View style={styles.scheduleHeaderRow}>
                  <View>
                    <Text style={styles.sectionLabel}>Wedding Gallery</Text>
                    <Text style={styles.fieldSubLabel}>Photos shown on your interactive website slider</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleUploadImage((url) => handleAddGalleryImage(url))}
                    style={styles.addFunctionBtn}
                    activeOpacity={0.8}
                  >
                    <UploadCloud size={13} color="#FFF" />
                    <Text style={styles.addFunctionBtnText}>Upload Photo</Text>
                  </TouchableOpacity>
                </View>

                {safeGalleryList.length > 0 ? (
                  <View style={styles.galleryGrid}>
                    {safeGalleryList.map((imgUrl, idx) => (
                      <View key={`gal-${idx}`} style={styles.galleryItem}>
                        <Image source={{ uri: imgUrl }} style={styles.galleryImage} contentFit="cover" />
                        <TouchableOpacity
                          onPress={() => handleRemoveGalleryImage(idx)}
                          style={styles.galleryDeleteBtn}
                          activeOpacity={0.7}
                        >
                          <X size={12} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyCard}>
                    <ImageIcon size={28} color="#94A3B8" />
                    <Text style={styles.emptyCardTitle}>No gallery photos yet</Text>
                    <Text style={styles.emptyCardSub}>
                      Tap "Upload Photo" to select pictures from your phone camera roll.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* ── TAB 6: RSVP & LOVE STORY ── */}
            {activeTab === "rsvp" && (
              <View>
                <Text style={styles.sectionLabel}>RSVP & Contact Phone</Text>

                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.fieldLabel}>RSVP Contact Phone Number</Text>
                  <TextInput
                    value={rsvpContact}
                    onChangeText={setRsvpContact}
                    placeholder="e.g. 8732984321"
                    keyboardType="phone-pad"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />
                </View>

                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.fieldLabel}>Dress Code / Attire Theme</Text>
                  <TextInput
                    value={dressCode}
                    onChangeText={setDressCode}
                    placeholder="e.g. Traditional Royal Indian / Formal Black Tie"
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />
                </View>

                <Text style={styles.sectionLabel}>Love Story Narrative & Video Teaser</Text>

                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.fieldLabel}>Love Story Narrative</Text>
                  <TextInput
                    value={loveStoryText}
                    onChangeText={setLoveStoryText}
                    placeholder="How we met, the proposal, and our journey to forever..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={3}
                    style={styles.multilineInputField}
                  />
                </View>

                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.fieldLabel}>Video Teaser URL (YouTube / Vimeo / Cloudflare)</Text>
                  <TextInput
                    value={loveStoryVideoUrl}
                    onChangeText={setLoveStoryVideoUrl}
                    placeholder="https://youtube.com/watch?v=..."
                    placeholderTextColor="#94A3B8"
                    style={styles.inputField}
                  />
                </View>

                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.fieldLabel}>Additional Host Notes (Optional)</Text>
                  <TextInput
                    value={additionalNotes}
                    onChangeText={setAdditionalNotes}
                    placeholder="Special instructions, dietary accommodations, parking notices..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={2}
                    style={[styles.multilineInputField, { minHeight: 70 }]}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Footer */}
          <GradientButton
            onPress={handleSave}
            isLoading={updateDraft.isPending || isUploadingPhoto}
            title="Save & Sync Complete Profile"
            colors={["#EF4444", "#DC2626", "#881337"]}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "94%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconBox: {
    height: 40,
    width: 40,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  closeBtn: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  tabsScrollContainer: {
    maxHeight: 48,
    marginBottom: 16,
  },
  tabsContentContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    padding: 4,
    borderRadius: 16,
    gap: 4,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#DC2626",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0F172A",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    gap: 6,
  },
  categoryPillActive: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  rowGap: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 6,
  },
  fieldSubLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  fieldHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  linkAction: {
    color: "#DC2626",
    fontSize: 10,
    fontWeight: "700",
  },
  inputField: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 44,
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "500",
  },
  multilineInputField: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 88,
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "500",
    textAlignVertical: "top",
  },
  infoBanner: {
    backgroundColor: "#FEF2F2",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    marginBottom: 16,
  },
  infoBannerTitle: {
    color: "#7F1D1D",
    fontWeight: "800",
    fontSize: 12,
    marginBottom: 2,
  },
  infoBannerSub: {
    color: "#B91C1C",
    fontSize: 11,
  },
  scheduleHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 6,
  },
  addFunctionBtn: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addFunctionBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  functionCard: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  timelineCard: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  functionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  functionNumber: {
    fontWeight: "800",
    color: "#0F172A",
    fontSize: 12,
  },
  timelineIndexBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  timelineIndexText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#DC2626",
  },
  trashBtn: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 2,
  },
  cardInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 36,
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyCard: {
    backgroundColor: "#F8FAFC",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginTop: 8,
  },
  emptyCardSub: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 2,
  },
  photoUploadRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    gap: 12,
  },
  photoThumbBox: {
    height: 52,
    width: 52,
    borderRadius: 14,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photoThumb: {
    height: "100%",
    width: "100%",
  },
  uploadBtnMini: {
    height: 38,
    width: 38,
    borderRadius: 12,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  galleryItem: {
    height: 80,
    width: "31%",
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  galleryImage: {
    height: "100%",
    width: "100%",
  },
  galleryDeleteBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
});
