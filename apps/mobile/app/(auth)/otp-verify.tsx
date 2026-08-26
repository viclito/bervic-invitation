import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MailCheck, ArrowLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { api } from "../../lib/api";
import { GradientButton } from "../../components/GradientButton";

export default function OtpVerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const email = params.email || "";

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length < 6) {
      setErrorMessage("Please enter the complete 6-digit OTP code");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      await api.post("/api/auth/verify-otp", { email, otp });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(auth)/sign-in");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to verify OTP");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      await api.post("/api/auth/send-otp", { email });
      setTimer(60);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 rounded-full bg-slate-50 items-center justify-center border border-slate-200 mb-6"
        >
          <ArrowLeft size={18} color={BRAND_COLORS.textPrimary} />
        </Pressable>

        {/* Header */}
        <View className="items-center mb-8">
          <View className="h-16 w-16 rounded-3xl bg-red-50 border border-red-100 items-center justify-center mb-3">
            <MailCheck size={32} color={BRAND_COLORS.primaryRed} />
          </View>
          <Text className="text-2xl font-extrabold text-slate-900">
            Verify Email
          </Text>
          <Text className="text-slate-500 text-xs text-center mt-1 px-4">
            We sent a 6-digit verification code to{"\n"}
            <Text className="font-bold text-slate-800">{email}</Text>
          </Text>
        </View>

        {/* Error Banner */}
        {errorMessage ? (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-3.5 mb-5">
            <Text className="text-red-700 font-semibold text-xs text-center">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        {/* Seamless White Form Layout */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider text-center">
            Enter 6-Digit Code
          </Text>

          <TextInput
            value={otp}
            onChangeText={(val) => {
              setOtp(val.replace(/[^0-9]/g, ""));
              if (val.length === 6) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
            placeholder="• • • • • •"
            placeholderTextColor="#CBD5E1"
            keyboardType="number-pad"
            maxLength={6}
            className="h-14 bg-slate-50 border border-slate-200 rounded-2xl text-center text-2xl font-extrabold tracking-widest text-slate-900 mb-6"
          />

          <GradientButton
            onPress={handleVerify}
            isLoading={isLoading}
            title="Verify & Continue"
            colors={["#EF4444", "#DC2626", "#881337"]}
          />

          {/* Resend Timer */}
          <Pressable onPress={handleResend} className="mt-4 items-center">
            <Text className="text-xs font-semibold text-slate-600">
              {timer > 0 ? (
                `Resend code in ${timer}s`
              ) : (
                <Text className="text-red-600 font-bold">Resend OTP Code</Text>
              )}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
