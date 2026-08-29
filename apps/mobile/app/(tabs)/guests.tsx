import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  UserPlus,
  QrCode,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Users,
  Utensils,
} from "lucide-react-native";
import { Linking } from "react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS, GuestData } from "@bervic/shared";
import { useMyInvitations } from "../../hooks/useMyInvitations";
import { useGuests, useDeleteGuest } from "../../hooks/useGuests";
import { AddGuestModal } from "../../components/AddGuestModal";
import { EditGuestModal } from "../../components/EditGuestModal";
import { DoorScannerModal } from "../../components/DoorScannerModal";
import { ImportContactsModal } from "../../components/ImportContactsModal";
import { PRODUCTION_WEB_URL } from "../../lib/api";

export default function GuestsScreen() {
  const { data: invitations } = useMyInvitations();
  const activeInvitation = invitations?.[0];
  const invitationId = activeInvitation?.id;

  const { data: guestData, isLoading, refetch } = useGuests(invitationId);
  const deleteGuest = useDeleteGuest(invitationId);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ATTENDING" | "PENDING" | "DECLINED">("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDoorScanner, setShowDoorScanner] = useState(false);
  const [showImportContacts, setShowImportContacts] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestData | null>(null);

  const guests = guestData?.guests || [];
  const stats = guestData?.stats || {
    totalGuests: guests.length,
    attending: guests.filter((g) => g.status === "ATTENDING").length,
    pending: guests.filter((g) => g.status === "PENDING").length,
    declined: guests.filter((g) => g.status === "DECLINED").length,
    totalPlusOnes: guests.filter((g) => g.status === "ATTENDING").reduce((s, g) => s + (g.plusOnes || 0), 0),
    totalAttendingPeople: guests.filter((g) => g.status === "ATTENDING").reduce((s, g) => s + 1 + (g.plusOnes || 0), 0),
    responseRate: guests.length > 0 ? Math.round(((guests.filter((g) => g.status !== "PENDING").length) / guests.length) * 100) : 0,
  };

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery);
    const matchesStatus =
      filterStatus === "ALL" || g.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sendWhatsAppInvite = (guest: GuestData) => {
    const inviteUrl = activeInvitation
      ? `${PRODUCTION_WEB_URL}/invitations/${activeInvitation.slug}?code=${guest.uniqueCode || ""}`
      : PRODUCTION_WEB_URL;

    const message = encodeURIComponent(
      `Dear ${guest.name},\n\nYou are cordially invited to our wedding celebration! ✨\n\nPlease view your personalized digital invitation and RSVP here:\n${inviteUrl}`
    );

    const cleanPhone = guest.phone.replace(/[^\d]/g, "");
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}&text=${message}`).catch(() => {
      Alert.alert("WhatsApp Notice", "Make sure WhatsApp is installed on this device.");
    });
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
            onRefresh={refetch}
            tintColor={BRAND_COLORS.primaryRed}
          />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">Guest Hub</Text>
            <Text className="text-slate-500 text-xs">RSVP tracking & WhatsApp passes</Text>
          </View>
          <Pressable
            onPress={() => setShowDoorScanner(true)}
            className="h-10 px-3 rounded-2xl bg-red-600 flex-row items-center justify-center shadow-md shadow-red-200 active:bg-red-700"
          >
            <QrCode size={16} color={BRAND_COLORS.pureWhite} />
            <Text className="text-white text-xs font-bold ml-1.5">Scan Door Pass</Text>
          </Pressable>
        </View>

        {/* 3 Metric Summary Cards */}
        <View className="flex-row justify-between mb-3">
          <View className="w-[31%] bg-slate-50 p-3.5 rounded-2xl border border-slate-200 items-center">
            <Text className="text-xl font-extrabold text-slate-900">{stats.totalGuests}</Text>
            <Text className="text-[11px] text-slate-500 font-semibold mt-0.5">Invited</Text>
          </View>
          <View className="w-[31%] bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 items-center">
            <Text className="text-xl font-extrabold text-emerald-700">{stats.attending}</Text>
            <Text className="text-[11px] text-emerald-600 font-semibold mt-0.5">Attending</Text>
          </View>
          <View className="w-[31%] bg-amber-50 p-3.5 rounded-2xl border border-amber-200 items-center">
            <Text className="text-xl font-extrabold text-amber-700">{stats.pending}</Text>
            <Text className="text-[11px] text-amber-600 font-semibold mt-0.5">Pending</Text>
          </View>
        </View>

        {/* Response Rate Bar */}
        <View className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-5">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs font-bold text-slate-700">RSVP Response Rate</Text>
            <Text className="text-xs font-extrabold text-red-600">
              {stats.responseRate}% Responded
            </Text>
          </View>
          <View className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-1.5">
            <View
              style={{ width: `${Math.min(100, Math.max(0, stats.responseRate))}%` }}
              className="h-full bg-red-600 rounded-full"
            />
          </View>
          <Text className="text-[11px] text-slate-500">
            {stats.totalAttendingPeople} total confirmed attendees (including plus-ones).
          </Text>
        </View>

        {/* Action Buttons: Add Guest & Import Contacts */}
        <View className="flex-row gap-2.5 mb-5">
          <Pressable
            onPress={() => setShowAddModal(true)}
            className="flex-1 h-12 bg-white border border-slate-200 rounded-2xl flex-row items-center justify-center active:bg-slate-50 shadow-sm"
          >
            <UserPlus size={16} color={BRAND_COLORS.primaryRed} />
            <Text className="text-slate-900 font-bold text-xs ml-2">
              + Add Guest
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setShowImportContacts(true)}
            className="flex-1 h-12 bg-white border border-slate-200 rounded-2xl flex-row items-center justify-center active:bg-slate-50 shadow-sm"
          >
            <Users size={16} color={BRAND_COLORS.primaryRed} />
            <Text className="text-slate-900 font-bold text-xs ml-2">
              Import Contacts
            </Text>
          </Pressable>
        </View>

        {/* Search & Filter Bar */}
        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-11 mb-3">
          <Search size={16} color="#94A3B8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by guest name or phone..."
            placeholderTextColor="#94A3B8"
            className="flex-1 ml-2 text-slate-900 text-xs"
          />
        </View>

        {/* Filter Chips */}
        <View className="flex-row gap-2 mb-4">
          {(["ALL", "ATTENDING", "PENDING", "DECLINED"] as const).map((st) => (
            <Pressable
              key={st}
              onPress={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl border ${
                filterStatus === st
                  ? "bg-slate-900 border-slate-900"
                  : "bg-white border-slate-200"
              }`}
            >
              <Text
                className={`text-[11px] font-bold ${
                  filterStatus === st ? "text-white" : "text-slate-600"
                }`}
              >
                {st}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Guest List */}
        <Text className="text-base font-extrabold text-slate-900 mb-3">
          Guest Attendees ({filteredGuests.length})
        </Text>

        {isLoading ? (
          <ActivityIndicator color={BRAND_COLORS.primaryRed} className="my-6" />
        ) : filteredGuests.length === 0 ? (
          <View className="items-center py-10 bg-slate-50 rounded-2xl border border-slate-200 mb-8">
            <Users size={32} color="#94A3B8" />
            <Text className="text-sm font-bold text-slate-700 mt-2">No guests found</Text>
            <Text className="text-xs text-slate-500 mt-1">Tap "+ Add Guest" above to start inviting!</Text>
          </View>
        ) : (
          filteredGuests.map((guest) => (
            <Pressable
              key={guest.id}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedGuest(guest);
              }}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-3 flex-row items-center justify-between active:bg-slate-50"
            >
              <View className="flex-1 mr-2">
                <View className="flex-row items-center">
                  <Text className="font-bold text-slate-900 text-sm mr-2">{guest.name}</Text>
                  {guest.plusOnes > 0 && (
                    <View className="bg-slate-100 px-1.5 py-0.5 rounded">
                      <Text className="text-[10px] text-slate-600 font-bold">+{guest.plusOnes}</Text>
                    </View>
                  )}
                </View>
                <Text className="text-slate-500 text-xs mt-0.5">{guest.phone}</Text>
                {guest.dietaryNotes && (
                  <View className="flex-row items-center mt-1">
                    <Utensils size={10} color="#64748B" />
                    <Text className="text-[10px] text-slate-500 ml-1" numberOfLines={1}>
                      {guest.dietaryNotes}
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row items-center gap-2">
                {guest.status === "ATTENDING" && (
                  <View className="bg-emerald-50 px-2.5 py-1 rounded-full flex-row items-center">
                    <CheckCircle2 size={12} color="#059669" />
                    <Text className="text-emerald-700 text-[10px] font-bold ml-1">Attending</Text>
                  </View>
                )}
                {guest.status === "PENDING" && (
                  <View className="bg-amber-50 px-2.5 py-1 rounded-full flex-row items-center">
                    <Clock size={12} color="#D97706" />
                    <Text className="text-amber-700 text-[10px] font-bold ml-1">Pending</Text>
                  </View>
                )}
                {guest.status === "DECLINED" && (
                  <View className="bg-slate-100 px-2.5 py-1 rounded-full flex-row items-center">
                    <XCircle size={12} color="#64748B" />
                    <Text className="text-slate-600 text-[10px] font-bold ml-1">Declined</Text>
                  </View>
                )}

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    sendWhatsAppInvite(guest);
                  }}
                  className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-200 items-center justify-center active:bg-emerald-100"
                >
                  <Send size={13} color="#059669" />
                </Pressable>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Modals */}
      <AddGuestModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        invitationId={invitationId}
      />
      <EditGuestModal
        visible={!!selectedGuest}
        guest={selectedGuest}
        onClose={() => setSelectedGuest(null)}
        invitationId={invitationId}
      />
      <DoorScannerModal
        visible={showDoorScanner}
        onClose={() => setShowDoorScanner(false)}
        invitationId={invitationId}
      />
      <ImportContactsModal
        visible={showImportContacts}
        onClose={() => setShowImportContacts(false)}
        invitationId={invitationId}
      />
    </SafeAreaView>
  );
}
