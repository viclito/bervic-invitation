import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Switch,
  Modal,
  RefreshControl,
  Linking,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Package,
  Crown,
  Shield,
  HelpCircle,
  LogOut,
  LogIn,
  Fingerprint,
  X,
  ExternalLink,
  Sparkles,
  Users,
  Palette,
  Edit3,
  Calendar,
  MapPin,
  ChevronRight,
  Phone,
  Layers,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS, UserDraftDetailsData } from "@bervic/shared";
import { useAuthStore } from "../../lib/authStore";
import { useSubscription } from "../../hooks/useSubscription";
import { useUserOrders, UserOrder } from "../../hooks/useUserOrders";
import { useEventDraft, useUserProfiles } from "../../hooks/useEventDraft";
import { useMyInvitations } from "../../hooks/useMyInvitations";
import { useGuests } from "../../hooks/useGuests";
import { OrderDetailModal } from "../../components/OrderDetailModal";
import { BuyPlanModal } from "../../components/BuyPlanModal";
import { EventEditModal } from "../../components/EventEditModal";
import { PRODUCTION_WEB_URL } from "../../lib/api";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isBiometricSupported } = useAuthStore();
  const { data: subData, isLoading: subLoading, refetch: refetchSub } = useSubscription();
  const { data: orders, refetch: refetchOrders } = useUserOrders();
  const { data: draft, refetch: refetchDraft } = useEventDraft();
  const { data: profiles, refetch: refetchProfiles } = useUserProfiles();
  const { data: invitations, refetch: refetchInvs } = useMyInvitations();
  const { data: guestData, refetch: refetchGuests } = useGuests();

  const [useBiometrics, setUseBiometrics] = useState(true);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showBuyPlanModal, setShowBuyPlanModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserDraftDetailsData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);

  const safeHaptics = () => {
    try {
      Haptics.selectionAsync();
    } catch {}
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AB";

  const totalGuests = guestData?.guests?.length || 0;
  const attendingGuests = guestData?.stats?.attending || 0;

  const isFreeTier = !subData?.plan || subData.plan === "NONE" || !subData.isActive;

  const onRefreshAll = async () => {
    await Promise.all([
      refetchSub(),
      refetchOrders(),
      refetchDraft(),
      refetchProfiles(),
      refetchInvs(),
      refetchGuests(),
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out of your account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch {}
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  };

  const handleConcierge = () => {
    Linking.openURL(
      "https://wa.me/919876543210?text=Hello%20Bervic%20VIP%20Concierge,%20I%20need%20help%20with%20my%20wedding%20invitation."
    );
  };

  const activeProfile =
    (profiles && profiles.length > 0 ? profiles[0] : null) || draft;

  const activeCoupleName =
    activeProfile?.hostNameOne && activeProfile?.hostNameTwo
      ? `${activeProfile.hostNameOne} & ${activeProfile.hostNameTwo}`
      : activeProfile?.eventTitle || (user?.name ? `${user.name}'s Wedding` : "Sam & Ayarin");

  const initialsMonogram =
    activeProfile?.coupleInitials ||
    (activeProfile?.hostNameOne && activeProfile?.hostNameTwo
      ? `${activeProfile.hostNameOne[0]} & ${activeProfile.hostNameTwo[0]}`
      : "S & A");

  let parsedFunctionsCount = 0;
  try {
    if (activeProfile?.functions && Array.isArray(activeProfile.functions)) {
      parsedFunctionsCount = activeProfile.functions.length;
    } else if (activeProfile?.functionsJson) {
      parsedFunctionsCount = JSON.parse(activeProfile.functionsJson).length;
    }
  } catch {}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={subLoading}
            onRefresh={onRefreshAll}
            tintColor={BRAND_COLORS.primaryRed}
          />
        }
      >
        {/* Header */}
        <Text style={styles.screenTitle}>Account & Dashboard</Text>

        {/* User Profile Card */}
        {isAuthenticated ? (
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || "Ayarin Baby"}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View
                style={[
                  styles.planBadge,
                  isFreeTier ? styles.planBadgeFree : styles.planBadgeActive,
                ]}
              >
                <Crown size={10} color={isFreeTier ? "#64748B" : "#DC2626"} />
                <Text
                  style={[
                    styles.planBadgeText,
                    isFreeTier ? styles.planBadgeTextFree : styles.planBadgeTextActive,
                  ]}
                >
                  {isFreeTier
                    ? "Free Tier"
                    : `${subData?.plan?.replace("_", " ")} ACTIVE`}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.signInCard}>
            <Text style={styles.signInTitle}>Sign in to Bervic</Text>
            <Text style={styles.signInSubtitle}>
              Sign in to sync your guest RSVPs, orders, and custom invitations.
            </Text>
            <TouchableOpacity
              onPress={() => {
                safeHaptics();
                router.push("/(auth)/sign-in");
              }}
              activeOpacity={0.8}
              style={styles.signInButton}
            >
              <LogIn size={16} color={BRAND_COLORS.pureWhite} />
              <Text style={styles.signInButtonText}>Sign In Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dashboard Overview - Quotas & Statistics Grid */}
        <Text style={styles.sectionTitle}>Dashboard Overview</Text>

        <View style={styles.gridContainer}>
          {/* Tile 1: Template Slots */}
          <View style={styles.gridTile}>
            <View style={styles.tileHeader}>
              <View style={[styles.tileIconBox, { backgroundColor: "#FEE2E2" }]}>
                <Crown size={15} color={BRAND_COLORS.primaryRed} />
              </View>
              <Text style={[styles.tileBadgeText, { color: "#DC2626" }]}>
                {subData?.remainingTemplateSlots ?? 0} slots left
              </Text>
            </View>
            <Text style={styles.tileValue}>
              {subData?.usedTemplatesCount ?? 0} / {subData?.allowedTemplatesCount ?? 0}
            </Text>
            <Text style={styles.tileLabel}>Standard Templates</Text>
          </View>

          {/* Tile 2: Canva & Instagram Cards */}
          <View style={styles.gridTile}>
            <View style={styles.tileHeader}>
              <View style={[styles.tileIconBox, { backgroundColor: "#F3E8FF" }]}>
                <Palette size={15} color="#9333EA" />
              </View>
              <Text style={[styles.tileBadgeText, { color: "#9333EA" }]}>
                {subData?.remainingCardSlots ?? 2} credits left
              </Text>
            </View>
            <Text style={styles.tileValue}>
              {subData?.usedCardsCount ?? 0} / {subData?.allowedCardsCount ?? 2}
            </Text>
            <Text style={styles.tileLabel}>Instagram Cards</Text>
          </View>

          {/* Tile 3: Total Guests */}
          <View style={styles.gridTile}>
            <View style={styles.tileHeader}>
              <View style={[styles.tileIconBox, { backgroundColor: "#D1FAE5" }]}>
                <Users size={15} color="#059669" />
              </View>
              <Text style={[styles.tileBadgeText, { color: "#059669" }]}>
                {attendingGuests} attending
              </Text>
            </View>
            <Text style={styles.tileValue}>{totalGuests}</Text>
            <Text style={styles.tileLabel}>Total Invited Guests</Text>
          </View>

          {/* Tile 4: Print Orders */}
          <View style={styles.gridTile}>
            <View style={styles.tileHeader}>
              <View style={[styles.tileIconBox, { backgroundColor: "#DBEAFE" }]}>
                <Package size={15} color="#2563EB" />
              </View>
              <Text style={[styles.tileBadgeText, { color: "#2563EB" }]}>350 GSM</Text>
            </View>
            <Text style={styles.tileValue}>{orders?.length ?? 0}</Text>
            <Text style={styles.tileLabel}>Print Orders Placed</Text>
          </View>
        </View>

        {/* Upgrade Subscription Banner */}
        <TouchableOpacity
          onPress={() => {
            safeHaptics();
            setShowBuyPlanModal(true);
          }}
          activeOpacity={0.85}
          style={styles.bannerCard}
        >
          <View style={styles.bannerHeader}>
            <View style={styles.bannerHeaderLeft}>
              <Sparkles size={16} color="#FDE047" />
              <Text style={styles.bannerTagText}>Subscription & Quota</Text>
            </View>
            <View style={styles.bannerPill}>
              <Text style={styles.bannerPillText}>Choose a Plan →</Text>
            </View>
          </View>
          <Text style={styles.bannerTitle}>
            Upgrade Your Plan to Unlock Templates & Downloads
          </Text>
          <Text style={styles.bannerSubtitle}>
            Basic (₹599) • Pro (₹1,799) • Cinematic 480-Frame (₹2,000)
          </Text>
        </TouchableOpacity>

        {/* My Created Event Profiles Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Created Event Profiles</Text>
          <TouchableOpacity
            onPress={() => {
              safeHaptics();
              setEditingProfile(activeProfile || ({} as any));
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.editProfileLink}>+ Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Detailed Event Profile Card */}
        {activeProfile ? (
          <View style={styles.profileEventCard}>
            <View style={styles.profileEventHeader}>
              <Text style={styles.profileEventTitle} numberOfLines={1}>
                {activeCoupleName} ({initialsMonogram})
              </Text>
              <View style={styles.completePill}>
                <Text style={styles.completePillText}>
                  {activeProfile.eventType || "WEDDING"} • COMPLETE
                </Text>
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.infoRow}>
              <Calendar size={12} color="#DC2626" />
              <Text style={styles.infoRowText}>
                {activeProfile.eventDate || "2026-11-20"}{" "}
                {activeProfile.eventTime ? `(${activeProfile.eventTime})` : "(10:28 AM)"}
              </Text>
            </View>

            {/* Venue */}
            <View style={styles.infoRow}>
              <MapPin size={12} color="#64748B" />
              <Text style={styles.infoRowText} numberOfLines={1}>
                {activeProfile.venueName || "Marriage Ceremony Hall"}
                {activeProfile.venueAddress ? ` — ${activeProfile.venueAddress}` : ""}
              </Text>
            </View>

            {/* Sub-functions */}
            <View style={styles.infoRow}>
              <Layers size={12} color="#64748B" />
              <Text style={styles.infoRowText}>
                {parsedFunctionsCount > 0
                  ? `${parsedFunctionsCount} schedule functions configured`
                  : "2 functions configured"}
              </Text>
            </View>

            {/* RSVP Phone */}
            {activeProfile.rsvpContact && (
              <View style={styles.infoRow}>
                <Phone size={12} color="#64748B" />
                <Text style={styles.infoRowText}>
                  RSVP Contact: {activeProfile.rsvpContact}
                </Text>
              </View>
            )}

            <View style={styles.eventActionRow}>
              <TouchableOpacity
                onPress={() => {
                  safeHaptics();
                  setEditingProfile(activeProfile);
                }}
                activeOpacity={0.8}
                style={styles.editProfileBtn}
              >
                <Edit3 size={13} color="#FFF" />
                <Text style={styles.btnTextWhite}>Edit Wedding Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  safeHaptics();
                  router.push("/(tabs)/events");
                }}
                activeOpacity={0.8}
                style={styles.viewStudioBtn}
              >
                <Text style={styles.btnTextWhite}>View Studio</Text>
                <ChevronRight size={13} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyProfileCard}>
            <Calendar size={28} color="#94A3B8" />
            <Text style={styles.emptyProfileTitle}>No profile created yet</Text>
            <TouchableOpacity
              onPress={() => {
                safeHaptics();
                setEditingProfile({} as any);
              }}
              activeOpacity={0.8}
              style={styles.createProfileBtn}
            >
              <Text style={styles.btnTextWhite}>+ Create Wedding Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Published Invitations */}
        {invitations &&
          invitations.map((inv) => (
            <View key={inv.id} style={styles.invitationCard}>
              <View style={styles.invitationHeader}>
                <Text style={styles.invitationTitle}>
                  {inv.partnerOne && inv.partnerTwo
                    ? `${inv.partnerOne} & ${inv.partnerTwo}`
                    : inv.slug}
                </Text>
                <View style={styles.templatePill}>
                  <Text style={styles.templatePillText}>
                    {(inv.templateSlug || "art-deco").toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.invitationSubtitle}>
                Live URL: bervic.in/{inv.slug}
              </Text>

              <TouchableOpacity
                onPress={() => Linking.openURL(`${PRODUCTION_WEB_URL}/${inv.slug}`)}
                activeOpacity={0.7}
                style={styles.openWebsiteBtn}
              >
                <Text style={styles.openWebsiteBtnText}>Open Live Website</Text>
                <ExternalLink size={13} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}

        {/* Management Options */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
          Orders & Management
        </Text>

        {/* Physical Orders */}
        <TouchableOpacity
          onPress={() => {
            safeHaptics();
            setShowOrdersModal(true);
          }}
          activeOpacity={0.7}
          style={styles.menuRow}
        >
          <View style={styles.menuRowLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: "#FEF2F2" }]}>
              <Package size={18} color={BRAND_COLORS.primaryRed} />
            </View>
            <Text style={styles.menuRowTitle}>My Physical Card Orders</Text>
          </View>
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>{orders?.length || 0} Orders</Text>
          </View>
        </TouchableOpacity>

        {/* VIP Concierge */}
        <TouchableOpacity
          onPress={handleConcierge}
          activeOpacity={0.7}
          style={styles.menuRow}
        >
          <View style={styles.menuRowLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: "#F8FAFC" }]}>
              <HelpCircle size={18} color="#64748B" />
            </View>
            <Text style={styles.menuRowTitle}>VIP Support & Concierge</Text>
          </View>
          <ExternalLink size={14} color="#64748B" />
        </TouchableOpacity>

        {/* Biometrics Toggle */}
        {isBiometricSupported && (
          <View style={styles.menuRow}>
            <View style={styles.menuRowLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: "#F8FAFC" }]}>
                <Fingerprint size={18} color="#64748B" />
              </View>
              <Text style={styles.menuRowTitle}>Face ID / Fingerprint Sign In</Text>
            </View>
            <Switch
              value={useBiometrics}
              onValueChange={setUseBiometrics}
              trackColor={{ false: "#CBD5E1", true: "#DC2626" }}
              thumbColor="#FFFFFF"
            />
          </View>
        )}

        {/* Privacy & Security */}
        <View style={styles.menuRow}>
          <View style={styles.menuRowLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: "#F8FAFC" }]}>
              <Shield size={18} color="#64748B" />
            </View>
            <Text style={styles.menuRowTitle}>Privacy & Multi-Tenant Security</Text>
          </View>
          <Text style={styles.encryptedText}>Encrypted</Text>
        </View>

        {/* Log Out */}
        {isAuthenticated && (
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            style={styles.logoutButton}
          >
            <LogOut size={16} color={BRAND_COLORS.primaryRed} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Orders List Modal */}
      <Modal
        visible={showOrdersModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOrdersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Physical Card Orders ({orders?.length || 0})
              </Text>
              <TouchableOpacity
                onPress={() => setShowOrdersModal(false)}
                activeOpacity={0.7}
                style={styles.modalCloseBtn}
              >
                <X size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {!orders || orders.length === 0 ? (
                <View style={styles.emptyOrdersBox}>
                  <Package size={32} color="#94A3B8" />
                  <Text style={styles.emptyOrdersTitle}>No print orders yet</Text>
                  <Text style={styles.emptyOrdersSubtitle}>
                    Visit the Luxury Print Shop tab to order handcrafted 350 GSM cards!
                  </Text>
                </View>
              ) : (
                orders.map((ord) => (
                  <TouchableOpacity
                    key={ord.id}
                    onPress={() => {
                      safeHaptics();
                      setSelectedOrder(ord);
                    }}
                    activeOpacity={0.7}
                    style={styles.orderCard}
                  >
                    <View style={styles.orderCardHeader}>
                      <Text style={styles.orderNumberText}>
                        Order #{ord.orderNumber || ord.id.slice(-6)}
                      </Text>
                      <View style={styles.orderStatusPill}>
                        <Text style={styles.orderStatusText}>
                          {ord.orderStatus || "IN PRODUCTION"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.orderAmountText}>
                      Amount: ₹{ord.totalAmount?.toLocaleString() || "0"}
                    </Text>
                    {ord.shippingAddress && (
                      <Text style={styles.orderAddressText} numberOfLines={1}>
                        Ship to: {ord.shippingAddress}
                      </Text>
                    )}
                    <Text style={styles.orderTrackingLink}>
                      Tap to view live timeline tracking →
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Interactive Modals */}
      <OrderDetailModal
        visible={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <BuyPlanModal
        visible={showBuyPlanModal}
        onClose={() => setShowBuyPlanModal(false)}
      />

      <EventEditModal
        visible={!!editingProfile}
        draft={editingProfile || undefined}
        onClose={() => setEditingProfile(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    height: 56,
    width: 56,
    borderRadius: 18,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: "900",
    color: "#0F172A",
    fontSize: 16,
  },
  profileEmail: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },
  planBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 6,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  planBadgeFree: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  planBadgeActive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  planBadgeTextFree: {
    color: "#475569",
  },
  planBadgeTextActive: {
    color: "#B91C1C",
  },
  signInCard: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    alignItems: "center",
  },
  signInTitle: {
    fontWeight: "900",
    color: "#0F172A",
    fontSize: 16,
    marginBottom: 4,
  },
  signInSubtitle: {
    color: "#64748B",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
  },
  signInButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridTile: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  tileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tileIconBox: {
    height: 32,
    width: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tileBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  tileValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
  },
  tileLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  bannerCard: {
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  bannerHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bannerTagText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bannerPill: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  bannerPillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: "#FEE2E2",
    fontSize: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  editProfileLink: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "800",
  },
  profileEventCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 14,
  },
  profileEventHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  profileEventTitle: {
    fontWeight: "900",
    color: "#0F172A",
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  completePill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  completePillText: {
    color: "#047857",
    fontSize: 10,
    fontWeight: "800",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  infoRowText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  eventActionRow: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  editProfileBtn: {
    flex: 1,
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  viewStudioBtn: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  btnTextWhite: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  emptyProfileCard: {
    backgroundColor: "#F8FAFC",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyProfileTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginTop: 8,
  },
  createProfileBtn: {
    marginTop: 10,
    backgroundColor: "#DC2626",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  invitationCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
  },
  invitationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  invitationTitle: {
    fontWeight: "900",
    color: "#0F172A",
    fontSize: 14,
  },
  templatePill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  templatePillText: {
    color: "#047857",
    fontSize: 10,
    fontWeight: "800",
  },
  invitationSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 12,
  },
  openWebsiteBtn: {
    height: 40,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    gap: 4,
  },
  openWebsiteBtnText: {
    color: "#B91C1C",
    fontWeight: "800",
    fontSize: 12,
  },
  menuRow: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconBox: {
    height: 36,
    width: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuRowTitle: {
    fontWeight: "700",
    color: "#1E293B",
    fontSize: 12,
  },
  menuBadge: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  menuBadgeText: {
    color: "#B91C1C",
    fontSize: 10,
    fontWeight: "800",
  },
  encryptedText: {
    color: "#047857",
    fontSize: 12,
    fontWeight: "800",
  },
  logoutButton: {
    height: 48,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    marginTop: 6,
    gap: 8,
  },
  logoutButtonText: {
    color: "#DC2626",
    fontWeight: "800",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  modalCloseBtn: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyOrdersBox: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyOrdersTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
    marginTop: 8,
  },
  emptyOrdersSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
  orderCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  orderCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  orderNumberText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  orderStatusPill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  orderStatusText: {
    color: "#047857",
    fontSize: 10,
    fontWeight: "800",
  },
  orderAmountText: {
    fontSize: 12,
    color: "#475569",
  },
  orderAddressText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 4,
  },
  orderTrackingLink: {
    color: "#DC2626",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 6,
  },
});
