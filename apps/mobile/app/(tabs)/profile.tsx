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
  LogOut,
  LogIn,
  Fingerprint,
  X,
  ExternalLink,
  Sparkles,
  Users,
  Palette,
  Calendar,
  ChevronRight,
  Phone,
  LayoutDashboard,
  UserCheck,
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
  const [showDashboardModal, setShowDashboardModal] = useState(false);
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
    : "B";

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
      "https://wa.me/919042127115?text=Hello%20Bervic%20VIP%20Concierge,%20I%20need%20help%20with%20my%20wedding%20invitation."
    );
  };

  const activeProfile =
    (profiles && profiles.length > 0 ? profiles[0] : null) || draft;

  const activeCoupleName =
    activeProfile?.hostNameOne && activeProfile?.hostNameTwo
      ? activeProfile.hostNameOne + " & " + activeProfile.hostNameTwo
      : activeProfile?.eventTitle || (user?.name ? user.name + "'s Event" : "Your Wedding");

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Profile</Text>
          <Text style={styles.screenSubtitle}>Manage your workspace, plans & settings</Text>
        </View>

        {/* User Card / Auth Banner */}
        {isAuthenticated ? (
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{initials}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || "Bervic Member"}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View
                style={[
                  styles.userPlanBadge,
                  isFreeTier ? styles.userPlanFree : styles.userPlanActive,
                ]}
              >
                <Crown size={10} color={isFreeTier ? "#64748B" : "#B91C1C"} />
                <Text
                  style={[
                    styles.userPlanText,
                    isFreeTier ? styles.userPlanTextFree : styles.userPlanTextActive,
                  ]}
                >
                  {isFreeTier
                    ? "Free Plan"
                    : (subData?.plan || "").replace("_", " ") + " ACTIVE"}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.guestCard}>
            <View style={styles.guestHeader}>
              <View style={styles.guestIconBox}>
                <LogIn size={20} color={BRAND_COLORS.primaryRed} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.guestTitle}>Sign in to Bervic</Text>
                <Text style={styles.guestSubtitle}>
                  Sync RSVPs, designs, and track physical print orders
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                safeHaptics();
                router.push("/(auth)/sign-in");
              }}
              activeOpacity={0.85}
              style={styles.guestSignInBtn}
            >
              <Text style={styles.guestSignInBtnText}>Sign In or Register</Text>
              <ChevronRight size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Section 1: Core Activities & Management */}
        <Text style={styles.sectionHeading}>WORKSPACE & ACTIVITIES</Text>
        <View style={styles.menuGroup}>
          {/* Menu Item 1: Dashboard Overview */}
          <TouchableOpacity
            onPress={() => {
              safeHaptics();
              setShowDashboardModal(true);
            }}
            activeOpacity={0.7}
            style={styles.menuItem}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: "#EEF2FF" }]}>
              <LayoutDashboard size={18} color="#4F46E5" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Dashboard Overview</Text>
              <Text style={styles.menuSubtitle}>
                Template quotas, card credits & live metrics
              </Text>
            </View>
            <View style={styles.menuTrailing}>
              <View style={styles.metricPill}>
                <Text style={styles.metricPillText}>
                  {subData?.isActive
                    ? `${subData?.usedTemplatesCount ?? 0}/${subData?.allowedTemplatesCount ?? 0} used`
                    : "0 slots"}
                </Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Menu Item 2: Create or Edit Profile */}
          <TouchableOpacity
            onPress={() => {
              safeHaptics();
              setEditingProfile(activeProfile || ({} as any));
            }}
            activeOpacity={0.7}
            style={styles.menuItem}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: "#FEF2F2" }]}>
              <UserCheck size={18} color="#DC2626" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Create or Edit Event Profile</Text>
              <Text style={styles.menuSubtitle} numberOfLines={1}>
                {activeProfile
                  ? activeCoupleName + " • Configured"
                  : "Setup couple names, date, venue & schedule"}
              </Text>
            </View>
            <View style={styles.menuTrailing}>
              <View
                style={[
                  styles.statusPill,
                  activeProfile ? styles.statusPillSuccess : styles.statusPillDraft,
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    activeProfile
                      ? styles.statusPillTextSuccess
                      : styles.statusPillTextDraft,
                  ]}
                >
                  {activeProfile ? "Edit" : "Create"}
                </Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Menu Item 3: Subscription & Quota */}
          <TouchableOpacity
            onPress={() => {
              safeHaptics();
              setShowBuyPlanModal(true);
            }}
            activeOpacity={0.7}
            style={styles.menuItem}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: "#FEF3C7" }]}>
              <Crown size={18} color="#D97706" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Subscription & Plans</Text>
              <Text style={styles.menuSubtitle}>
                {isFreeTier
                  ? "Basic, Pro & Cinematic 480-Frame tiers"
                  : (subData?.plan || "").replace("_", " ") + " Active"}
              </Text>
            </View>
            <View style={styles.menuTrailing}>
              <View
                style={[
                  styles.statusPill,
                  isFreeTier ? styles.statusPillWarning : styles.statusPillSuccess,
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    isFreeTier
                      ? styles.statusPillTextWarning
                      : styles.statusPillTextSuccess,
                  ]}
                >
                  {isFreeTier ? "Upgrade" : "Active"}
                </Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Menu Item 4: Physical Print Orders */}
          <TouchableOpacity
            onPress={() => {
              safeHaptics();
              setShowOrdersModal(true);
            }}
            activeOpacity={0.7}
            style={styles.menuItem}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: "#EFF6FF" }]}>
              <Package size={18} color="#2563EB" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Physical Print Orders</Text>
              <Text style={styles.menuSubtitle}>
                Track handcrafted 350 GSM cards shipment
              </Text>
            </View>
            <View style={styles.menuTrailing}>
              <Text style={styles.orderCountBadge}>
                {orders?.length || 0} Orders
              </Text>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 2: Support & Preferences */}
        <Text style={styles.sectionHeading}>SUPPORT & PREFERENCES</Text>
        <View style={styles.menuGroup}>
          {/* VIP WhatsApp Concierge */}
          <TouchableOpacity
            onPress={handleConcierge}
            activeOpacity={0.7}
            style={styles.menuItem}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: "#ECFDF5" }]}>
              <Phone size={18} color="#059669" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>VIP Support & Concierge</Text>
              <Text style={styles.menuSubtitle}>
                24/7 dedicated wedding designer help
              </Text>
            </View>
            <ExternalLink size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Biometrics Toggle */}
          {isBiometricSupported && (
            <>
              <View style={styles.menuItem}>
                <View style={[styles.menuIconCircle, { backgroundColor: "#F3E8FF" }]}>
                  <Fingerprint size={18} color="#9333EA" />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>Face ID / Biometric Sign In</Text>
                  <Text style={styles.menuSubtitle}>
                    Instant secure sign in with Face ID
                  </Text>
                </View>
                <Switch
                  value={useBiometrics}
                  onValueChange={setUseBiometrics}
                  trackColor={{ false: "#CBD5E1", true: "#DC2626" }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.menuDivider} />
            </>
          )}

          {/* Security */}
          <View style={styles.menuItem}>
            <View style={[styles.menuIconCircle, { backgroundColor: "#F1F5F9" }]}>
              <Shield size={18} color="#475569" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Privacy & Data Security</Text>
              <Text style={styles.menuSubtitle}>
                Multi-tenant isolated & encrypted
              </Text>
            </View>
            <Text style={styles.securedTag}>Encrypted</Text>
          </View>
        </View>

        {/* Section 3: Authentication Actions */}
        {isAuthenticated && (
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            style={styles.logoutRow}
          >
            <LogOut size={18} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out of Account</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.versionFooter}>Bervic Invitation Suite • v1.0.0 (SDK 54)</Text>
      </ScrollView>

      {/* ========================================================================= */}
      {/* ACTIVITY MODAL 1: DASHBOARD OVERVIEW */}
      {/* ========================================================================= */}
      <Modal
        visible={showDashboardModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDashboardModal(false)}
      >
        <SafeAreaView style={styles.modalSafeContainer} edges={["top", "bottom"]}>
          <View style={styles.activityHeader}>
            <View>
              <Text style={styles.activityTitle}>Dashboard Overview</Text>
              <Text style={styles.activitySubtitle}>Real-time metrics, quotas and status</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowDashboardModal(false)}
              activeOpacity={0.7}
              style={styles.activityCloseBtn}
            >
              <X size={18} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.activityScroll}
            contentContainerStyle={styles.activityScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 4 Overview Metric Tiles */}
            <View style={styles.gridContainer}>
              {/* Tile 1: Standard Templates */}
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

            {/* Quick Action Banner */}
            <TouchableOpacity
              onPress={() => {
                setShowDashboardModal(false);
                setShowBuyPlanModal(true);
              }}
              activeOpacity={0.85}
              style={styles.bannerCard}
            >
              <View style={styles.bannerHeader}>
                <View style={styles.bannerHeaderLeft}>
                  <Sparkles size={16} color="#FDE047" />
                  <Text style={styles.bannerTagText}>Upgrade Quota</Text>
                </View>
                <View style={styles.bannerPill}>
                  <Text style={styles.bannerPillText}>View Plans →</Text>
                </View>
              </View>
              <Text style={styles.bannerTitle}>
                Unlock Unlimited Templates, AI Extraction & Full HD
              </Text>
            </TouchableOpacity>

            {/* Live Published Invitations */}
            <Text style={[styles.sectionHeading, { marginTop: 24 }]}>
              LIVE PUBLISHED INVITATIONS ({invitations?.length || 0})
            </Text>
            {!invitations || invitations.length === 0 ? (
              <View style={styles.emptyStateBox}>
                <Calendar size={28} color="#94A3B8" />
                <Text style={styles.emptyStateTitle}>No published invitations yet</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Choose a template from the Studio tab to publish your wedding website!
                </Text>
              </View>
            ) : (
              invitations.map((inv) => (
                <View key={inv.id} style={styles.invitationCard}>
                  <View style={styles.invitationHeader}>
                    <Text style={styles.invitationTitle}>
                      {inv.partnerOne && inv.partnerTwo
                        ? inv.partnerOne + " & " + inv.partnerTwo
                        : inv.slug}
                    </Text>
                    <View style={styles.templatePill}>
                      <Text style={styles.templatePillText}>
                        {(inv.templateSlug || "art-deco").toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.invitationSubtitle}>
                    Live URL: bervic.in/invitations/{inv.slug}
                  </Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(PRODUCTION_WEB_URL + "/invitations/" + inv.slug)}
                    activeOpacity={0.7}
                    style={styles.openWebsiteBtn}
                  >
                    <Text style={styles.openWebsiteBtnText}>Open Live Website</Text>
                    <ExternalLink size={13} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ========================================================================= */}
      {/* ACTIVITY MODAL 2: ORDERS LIST & TRACKING */}
      {/* ========================================================================= */}
      <Modal
        visible={showOrdersModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowOrdersModal(false)}
      >
        <SafeAreaView style={styles.modalSafeContainer} edges={["top", "bottom"]}>
          <View style={styles.activityHeader}>
            <View>
              <Text style={styles.activityTitle}>Physical Print Orders</Text>
              <Text style={styles.activitySubtitle}>
                {orders?.length || 0} active & delivered orders
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowOrdersModal(false)}
              activeOpacity={0.7}
              style={styles.activityCloseBtn}
            >
              <X size={18} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.activityScroll}
            contentContainerStyle={styles.activityScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {!orders || orders.length === 0 ? (
              <View style={styles.emptyStateBox}>
                <Package size={36} color="#94A3B8" />
                <Text style={styles.emptyStateTitle}>No print orders yet</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Visit the Shop tab to order handcrafted 350 GSM gold-foiled invitations!
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowOrdersModal(false);
                    router.push("/(tabs)/shop");
                  }}
                  activeOpacity={0.8}
                  style={styles.browseShopBtn}
                >
                  <Text style={styles.browseShopBtnText}>Explore Luxury Shop</Text>
                </TouchableOpacity>
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
                    Tap to view live shipment tracking →
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ========================================================================= */}
      {/* OTHER SUB-ACTIVITIES (Modals) */}
      {/* ========================================================================= */}
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
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 150,
  },
  header: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.6,
  },
  screenSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  userAvatar: {
    height: 52,
    width: 52,
    borderRadius: 16,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  userAvatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: "800",
    color: "#0F172A",
    fontSize: 16,
  },
  userEmail: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },
  userPlanBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 6,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userPlanFree: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  userPlanActive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  userPlanText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  userPlanTextFree: {
    color: "#475569",
  },
  userPlanTextActive: {
    color: "#B91C1C",
  },
  guestCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  guestHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  guestIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  guestTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  guestSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  guestSignInBtn: {
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  guestSignInBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 56,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  menuTrailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metricPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  metricPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusPillSuccess: {
    backgroundColor: "#DCFCE7",
  },
  statusPillTextSuccess: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803D",
  },
  statusPillWarning: {
    backgroundColor: "#FEF3C7",
  },
  statusPillTextWarning: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B45309",
  },
  statusPillDraft: {
    backgroundColor: "#F1F5F9",
  },
  statusPillTextDraft: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  orderCountBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  securedTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  logoutRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
    marginBottom: 20,
  },
  logoutText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "800",
  },
  versionFooter: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
    marginBottom: 16,
  },

  /* Activity Modal Styles */
  modalSafeContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  activitySubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  activityCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  activityScroll: {
    flex: 1,
  },
  activityScrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gridTile: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 18,
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
    borderRadius: 18,
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
    color: "#FDE047",
    fontWeight: "800",
    fontSize: 11,
    textTransform: "uppercase",
  },
  bannerPill: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  bannerPillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
  invitationCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  invitationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  invitationTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    flex: 1,
  },
  templatePill: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  templatePillText: {
    color: "#DC2626",
    fontSize: 9,
    fontWeight: "800",
  },
  invitationSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 10,
  },
  openWebsiteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  openWebsiteBtnText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 12,
  },
  emptyStateBox: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    marginVertical: 8,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 8,
  },
  emptyStateSubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
  },
  browseShopBtn: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 12,
  },
  browseShopBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  orderCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  orderNumberText: {
    fontWeight: "800",
    color: "#0F172A",
    fontSize: 14,
  },
  orderStatusPill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  orderStatusText: {
    color: "#2563EB",
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  orderAmountText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  orderAddressText: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 8,
  },
  orderTrackingLink: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "700",
  },
});
