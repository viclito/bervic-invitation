import React, { useState } from "react";
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
import { X, UserPlus, Phone, Mail, Users } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { useAddGuest } from "../hooks/useGuests";
import { GradientButton } from "./GradientButton";

interface AddGuestModalProps {
  visible: boolean;
  onClose: () => void;
  invitationId?: string;
}

export function AddGuestModal({ visible, onClose, invitationId }: AddGuestModalProps) {
  const addGuest = useAddGuest(invitationId);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [plusOnes, setPlusOnes] = useState("0");
  const [dietaryNotes, setDietaryNotes] = useState("");

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
      await addGuest.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        plusOnes: parseInt(plusOnes, 10) || 0,
        dietaryNotes: dietaryNotes.trim() || undefined,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setName("");
      setPhone("");
      setEmail("");
      setPlusOnes("0");
      setDietaryNotes("");
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to add guest");
    }
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
                <UserPlus size={20} color={BRAND_COLORS.primaryRed} />
              </View>
              <View>
                <Text className="text-base font-bold text-slate-900">Add New Guest</Text>
                <Text className="text-xs text-slate-500">Add to royal wedding attendee list</Text>
              </View>
            </View>
            <Pressable onPress={onClose} className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center">
              <X size={16} color="#64748B" />
            </Pressable>
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
                placeholder="e.g. Johnathan Smith"
                placeholderTextColor="#94A3B8"
                className="text-slate-900 text-sm font-semibold"
              />
            </View>

            <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Phone Number (WhatsApp) *
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
                placeholder="e.g. Vegetarian, Gluten Free"
                placeholderTextColor="#94A3B8"
                className="text-slate-900 text-sm"
              />
            </View>
          </View>

          {/* Submit Button */}
          <GradientButton
            onPress={handleSave}
            isLoading={addGuest.isPending}
            title="Add Guest to Invitation"
            colors={["#EF4444", "#DC2626", "#881337"]}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
