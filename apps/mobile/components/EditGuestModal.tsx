import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { X, UserCheck, Phone, Mail, Users, Trash2 } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS, GuestData } from "@bervic/shared";
import { useUpdateGuest, useDeleteGuest } from "../hooks/useGuests";
import { GradientButton } from "./GradientButton";

interface EditGuestModalProps {
  visible: boolean;
  onClose: () => void;
  guest: GuestData | null;
  invitationId?: string;
}

export function EditGuestModal({
  visible,
  onClose,
  guest,
  invitationId,
}: EditGuestModalProps) {
  const updateGuest = useUpdateGuest(invitationId);
  const deleteGuest = useDeleteGuest(invitationId);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"PENDING" | "ATTENDING" | "DECLINED">("PENDING");
  const [plusOnes, setPlusOnes] = useState("0");
  const [dietaryNotes, setDietaryNotes] = useState("");

  useEffect(() => {
    if (guest) {
      setName(guest.name || "");
      setPhone(guest.phone || "");
      setEmail(guest.email || "");
      setStatus((guest.status as any) || "PENDING");
      setPlusOnes(String(guest.plusOnes || 0));
      setDietaryNotes(guest.dietaryNotes || "");
    }
  }, [guest]);

  if (!guest) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter guest name");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Required", "Please enter guest phone number");
      return;
    }

    try {
      await updateGuest.mutateAsync({
        guestId: guest.id,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        status,
        plusOnes: parseInt(plusOnes, 10) || 0,
        dietaryNotes: dietaryNotes.trim() || undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update guest");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Guest", `Are you sure you want to remove ${guest.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteGuest.mutateAsync(guest.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onClose();
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to remove guest");
          }
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-black/60 justify-end"
      >
        <View className="bg-white rounded-t-3xl p-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="h-9 w-9 rounded-xl bg-red-50 items-center justify-center mr-2.5">
                <UserCheck size={20} color={BRAND_COLORS.primaryRed} />
              </View>
              <View>
                <Text className="text-base font-extrabold text-slate-900">Edit Guest Details</Text>
                <Text className="text-xs text-slate-500">Pass Code: {guest.uniqueCode || guest.id.slice(-6)}</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={handleDelete}
                className="h-8 w-8 rounded-full bg-red-50 items-center justify-center"
              >
                <Trash2 size={16} color="#DC2626" />
              </Pressable>
              <Pressable
                onPress={onClose}
                className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <X size={16} color="#64748B" />
              </Pressable>
            </View>
          </View>

          {/* Status Segment */}
          <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            RSVP Status
          </Text>
          <View className="flex-row gap-2 mb-4">
            {(["ATTENDING", "PENDING", "DECLINED"] as const).map((st) => (
              <Pressable
                key={st}
                onPress={() => {
                  setStatus(st);
                  Haptics.selectionAsync();
                }}
                className={`flex-1 py-2.5 rounded-2xl items-center border ${
                  status === st
                    ? st === "ATTENDING"
                      ? "bg-emerald-600 border-emerald-600"
                      : st === "DECLINED"
                      ? "bg-slate-800 border-slate-800"
                      : "bg-amber-500 border-amber-500"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    status === st ? "text-white" : "text-slate-700"
                  }`}
                >
                  {st}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Form Fields */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Guest Name *
            </Text>
            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12 justify-center mb-3">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Guest Name"
                placeholderTextColor="#94A3B8"
                className="text-slate-900 text-sm font-semibold"
              />
            </View>

            <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Phone Number *
            </Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12 mb-3">
              <Phone size={18} color={BRAND_COLORS.textMuted} />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 9876543210"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                className="flex-1 ml-2 text-slate-900 text-sm"
              />
            </View>

            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email (Optional)
                </Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12">
                  <Mail size={18} color={BRAND_COLORS.textMuted} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="guest@example.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 ml-2 text-slate-900 text-sm"
                  />
                </View>
              </View>

              <View className="w-24">
                <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Plus Ones
                </Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12">
                  <Users size={18} color={BRAND_COLORS.textMuted} />
                  <TextInput
                    value={plusOnes}
                    onChangeText={setPlusOnes}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    className="flex-1 ml-2 text-slate-900 text-sm font-bold text-center"
                  />
                </View>
              </View>
            </View>

            <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Dietary Notes (Optional)
            </Text>
            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12 justify-center mb-6">
              <TextInput
                value={dietaryNotes}
                onChangeText={setDietaryNotes}
                placeholder="e.g. Vegetarian, Nut Allergy"
                placeholderTextColor="#94A3B8"
                className="text-slate-900 text-sm"
              />
            </View>
          </View>

          {/* Submit Button */}
          <GradientButton
            onPress={handleSave}
            isLoading={updateGuest.isPending}
            title="Save Guest Changes"
            colors={["#EF4444", "#DC2626", "#881337"]}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
