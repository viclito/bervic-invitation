import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { KeyRound, Mail, ArrowLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { api } from "../../lib/api";
import { GradientButton } from "../../components/GradientButton";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendReset = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      await api.post("/api/auth/send-otp", { email: email.trim() });
      setIsSent(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send reset code");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 rounded-full bg-slate-50 items-center justify-center border border-slate-200 mb-6"
        >
          <ArrowLeft size={18} color={BRAND_COLORS.textPrimary} />
        </Pressable>

        <View className="items-center mb-8">
          <View className="h-16 w-16 rounded-3xl bg-red-50 border border-red-100 items-center justify-center mb-3">
            <KeyRound size={32} color={BRAND_COLORS.primaryRed} />
          </View>
          <Text className="text-2xl font-extrabold text-slate-900">
            Reset Password
          </Text>
          <Text className="text-slate-500 text-xs text-center mt-1 px-4">
            Enter your account email to receive a password reset OTP code.
          </Text>
        </View>

        {errorMessage ? (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-3.5 mb-5">
            <Text className="text-red-700 font-semibold text-xs text-center">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {isSent ? (
          <View className="mb-6 items-center">
            <Text className="text-emerald-700 font-bold text-sm mb-1">
              Reset Code Sent!
            </Text>
            <Text className="text-slate-500 text-xs text-center mb-5">
              Check your inbox for the OTP verification code.
            </Text>
            <GradientButton
              onPress={() =>
                router.push({
                  pathname: "/(auth)/otp-verify",
                  params: { email: email.trim() },
                })
              }
              title="Enter OTP Code"
              colors={["#EF4444", "#DC2626", "#881337"]}
              className="w-full"
            />
          </View>
        ) : (
          <View className="mb-6">
            <View className="mb-5">
              <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12">
                <Mail size={18} color={BRAND_COLORS.textMuted} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="organizer@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 ml-2.5 text-slate-900 text-sm"
                />
              </View>
            </View>

            <GradientButton
              onPress={handleSendReset}
              isLoading={isLoading}
              title="Send Reset OTP"
              colors={["#EF4444", "#DC2626", "#881337"]}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
