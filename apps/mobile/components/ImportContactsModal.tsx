import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import * as Contacts from "expo-contacts";
import { X, Search, Check, UserPlus, Phone } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { useAddGuest } from "../hooks/useGuests";
import { GradientButton } from "./GradientButton";

interface ImportContactsModalProps {
  visible: boolean;
  onClose: () => void;
  invitationId?: string;
}

interface DeviceContact {
  id: string;
  name: string;
  phone: string;
  selected: boolean;
}

export function ImportContactsModal({
  visible,
  onClose,
  invitationId,
}: ImportContactsModalProps) {
  const addGuest = useAddGuest(invitationId);

  const [contacts, setContacts] = useState<DeviceContact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadContacts();
    }
  }, [visible]);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const formatted: DeviceContact[] = [];
          for (const c of data) {
            const rawPhone = c.phoneNumbers?.[0]?.number;
            if (rawPhone && c.name) {
              formatted.push({
                id: c.id || `${Date.now()}_${Math.random()}`,
                name: c.name,
                phone: rawPhone,
                selected: false,
              });
            }
          }
          setContacts(formatted);
        }
      } else {
        Alert.alert("Permission Required", "Please allow contacts permission to import guests.");
      }
    } catch (err: any) {
      console.warn("Failed to load contacts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    Haptics.selectionAsync();
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const selectedCount = contacts.filter((c) => c.selected).length;

  const handleImportSelected = async () => {
    const selected = contacts.filter((c) => c.selected);
    if (selected.length === 0) {
      Alert.alert("Notice", "Please select at least 1 contact to import.");
      return;
    }

    setIsImporting(true);
    try {
      for (const item of selected) {
        await addGuest.mutateAsync({
          name: item.name,
          phone: item.phone,
          plusOnes: 0,
        });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success! 🎉", `Imported ${selected.length} guests to your wedding invitation!`);
      onClose();
    } catch (err: any) {
      Alert.alert("Notice", err.message || "Finished importing guests.");
      onClose();
    } finally {
      setIsImporting(false);
    }
  };

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-3xl p-6 max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="h-9 w-9 rounded-xl bg-red-50 items-center justify-center mr-2.5">
                <UserPlus size={18} color={BRAND_COLORS.primaryRed} />
              </View>
              <View>
                <Text className="text-base font-extrabold text-slate-900">
                  Import Phone Contacts
                </Text>
                <Text className="text-xs text-slate-500">
                  {selectedCount > 0 ? `${selectedCount} selected` : "Select guests to invite"}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <X size={16} color="#64748B" />
            </Pressable>
          </View>

          {/* Search */}
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-11 mb-3">
            <Search size={16} color="#94A3B8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search contacts..."
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-2 text-slate-900 text-xs font-medium"
            />
          </View>

          {/* Contact List */}
          {isLoading ? (
            <ActivityIndicator color={BRAND_COLORS.primaryRed} className="my-8" />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} className="max-h-80 mb-4">
              {filtered.length === 0 ? (
                <Text className="text-center text-slate-400 text-xs py-6">
                  No contacts found.
                </Text>
              ) : (
                filtered.map((c) => (
                  <Pressable
                    key={c.id}
                    onPress={() => toggleSelect(c.id)}
                    className={`flex-row items-center justify-between p-3 rounded-2xl border mb-2 ${
                      c.selected
                        ? "bg-red-50/50 border-red-500"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <View className="flex-1 mr-2">
                      <Text className="font-bold text-slate-900 text-xs">{c.name}</Text>
                      <View className="flex-row items-center mt-0.5">
                        <Phone size={10} color="#94A3B8" />
                        <Text className="text-[11px] text-slate-500 ml-1">{c.phone}</Text>
                      </View>
                    </View>
                    <View
                      className={`h-6 w-6 rounded-full border items-center justify-center ${
                        c.selected
                          ? "bg-red-600 border-red-600"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {c.selected && <Check size={12} color="#FFF" />}
                    </View>
                  </Pressable>
                ))
              )}
            </ScrollView>
          )}

          {/* Import Button */}
          <GradientButton
            onPress={handleImportSelected}
            isLoading={isImporting}
            title={
              selectedCount > 0
                ? `Import ${selectedCount} Contacts`
                : "Select Contacts to Import"
            }
            colors={["#EF4444", "#DC2626", "#881337"]}
          />
        </View>
      </View>
    </Modal>
  );
}
