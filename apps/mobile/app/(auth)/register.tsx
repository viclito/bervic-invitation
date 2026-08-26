import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { api } from "../../lib/api";
import { GradientButton } from "../../components/GradientButton";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setErrorMessage("");
    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage("Name, email, and password are required");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: "/(auth)/otp-verify",
        params: { email: email.trim() },
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 pt-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-6">
            <Image
              source={require("../../assets/logo.png")}
              style={{ width: 84, height: 84 }}
              resizeMode="contain"
              className="mb-2"
            />
            <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create Account
            </Text>
            <Text className="text-slate-500 text-xs mt-1">
              Start designing digital invitations & managing guests
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View className="bg-red-50 border border-red-200 rounded-2xl p-3.5 mb-4">
              <Text className="text-red-700 font-semibold text-xs text-center">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* Form Fields (Seamless Minimal White) */}
          <View className="mb-6">
            {/* Full Name */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Full Name / Couple Names
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12">
                <User size={18} color={BRAND_COLORS.textMuted} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Sasa & Allan"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-2.5 text-slate-900 text-sm"
                />
              </View>
            </View>

            {/* Email Address */}
            <View className="mb-4">
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

            {/* Phone Number */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Phone Number (Optional)
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12">
                <Phone size={18} color={BRAND_COLORS.textMuted} />
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 9876543210"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  className="flex-1 ml-2.5 text-slate-900 text-sm"
                />
              </View>
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12">
                <Lock size={18} color={BRAND_COLORS.textMuted} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create strong password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  className="flex-1 ml-2.5 text-slate-900 text-sm"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={18} color={BRAND_COLORS.textMuted} />
                  ) : (
                    <Eye size={18} color={BRAND_COLORS.textMuted} />
                  )}
                </Pressable>
              </View>
            </View>

            {/* Register Button (Luxury Gradient Red) */}
            <GradientButton
              onPress={handleRegister}
              isLoading={isLoading}
              title="Create Account & Send OTP"
              colors={["#EF4444", "#DC2626", "#881337"]}
            />
          </View>

          {/* Sign In Link */}
          <View className="flex-row items-center justify-center pb-8">
            <Text className="text-slate-500 text-xs">Already have an account?</Text>
            <Pressable onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="text-red-600 font-bold text-xs ml-1">
                Sign In
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
