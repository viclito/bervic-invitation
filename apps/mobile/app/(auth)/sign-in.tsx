import React, { useState, useEffect } from "react";
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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { Lock, Mail, Eye, EyeOff, Fingerprint, X, User } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BRAND_COLORS } from "@bervic/shared";
import { useAuthStore } from "../../lib/authStore";
import { api } from "../../lib/api";
import { GoogleLogo } from "../../components/GoogleLogo";
import { GradientButton } from "../../components/GradientButton";

const GOOGLE_CLIENT_ID =
  "931335326798-jn6evc9aorgn9ktps1n141tllnc57ob6.apps.googleusercontent.com";

const RECENT_GOOGLE_ACCOUNTS = [
  { name: "berglin viclito", email: "berglin1998@gmail.com" },
  { name: "Ayarin Baby", email: "ayarinbaby@gmail.com" },
  { name: "Bersis Vinslin", email: "bersisvinslin@gmail.com" },
  { name: "Clash Slin", email: "clashslin@gmail.com" },
];

export default function SignInScreen() {
  const router = useRouter();
  const { login, isBiometricSupported, authenticateWithBiometrics, hasStoredCredentials } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  // Listen for Google OAuth deep link callbacks
  useEffect(() => {
    const handleUrl = async (event: { url: string }) => {
      const url = event.url;
      if (!url) return;

      try {
        const parsed = Linking.parse(url);
        const queryParams = parsed.queryParams || {};

        // Case A: Web Bridge Callback
        const token = (queryParams.token as string) || "";
        const rawUser = (queryParams.user as string) || "";

        if (token && rawUser) {
          setIsGoogleLoading(true);
          const parsedUser = JSON.parse(decodeURIComponent(rawUser));
          await login(parsedUser, token);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace("/(tabs)");
          return;
        }

        // Case B: Direct Google Cloud OAuth / Expo Auth Proxy Token
        let accessToken = (queryParams.access_token as string) || "";
        if (!accessToken && url.includes("access_token=")) {
          const match = url.match(/access_token=([^&#]+)/);
          if (match) accessToken = match[1];
        }

        if (accessToken) {
          setIsGoogleLoading(true);
          const gRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const gData = await gRes.json();

          if (gData.email) {
            executeGoogleLogin(gData.email, gData.name, gData.picture);
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to process Google sign in callback");
      } finally {
        setIsGoogleLoading(false);
      }
    };

    const sub = Linking.addEventListener("url", handleUrl);

    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) handleUrl({ url: initialUrl });
    });

    return () => sub.remove();
  }, [login, router]);

  const executeGoogleLogin = async (googleEmail: string, googleName?: string, googleImage?: string) => {
    setIsGoogleLoading(true);
    setErrorMessage("");
    try {
      const res = await api.post("/api/auth/mobile-login", {
        email: googleEmail.trim(),
        name: googleName || googleEmail.split("@")[0],
        image: googleImage || null,
        mode: "google",
      });

      if (res.success && res.token && res.user) {
        setShowGooglePicker(false);
        await login(res.user, res.token);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(tabs)");
      } else {
        setErrorMessage(res.error || "Failed to sign in with Google");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to connect to Google Auth");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignIn = async () => {
    setErrorMessage("");
    if (!email.trim()) {
      setErrorMessage("Please enter your email address");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!isOtpMode && !password) {
      setErrorMessage("Please enter your password");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (isOtpMode && !otp.trim()) {
      setErrorMessage("Please enter the 6-digit OTP code");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    try {
      const payload = isOtpMode
        ? { email: email.trim(), otp: otp.trim(), mode: "otp" }
        : { email: email.trim(), password, mode: "password" };

      const res = await api.post("/api/auth/mobile-login", payload);

      if (res.success && res.token && res.user) {
        await login(res.user, res.token);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(tabs)");
      } else {
        setErrorMessage(res.error || "Failed to sign in");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Check connection.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGooglePress = () => {
    setErrorMessage("");
    if (email.trim()) {
      executeGoogleLogin(email.trim());
      return;
    }
    setShowGooglePicker(true);
  };

  const launchBrowserGoogleOAuth = async () => {
    setShowGooglePicker(false);
    setIsGoogleLoading(true);
    try {
      // Use correct slug 'bervic-invitation'
      const redirectUri = "https://auth.expo.io/@anonymous/bervic-invitation";
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=token&scope=openid%20profile%20email&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;
      await Linking.openURL(googleAuthUrl);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to launch browser Google OAuth");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!hasStoredCredentials) {
      setErrorMessage("Sign in with password or Google once to enable Face ID on this device.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    const success = await authenticateWithBiometrics();
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } else {
      setErrorMessage("Biometric verification failed. Please enter your password.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setErrorMessage("Enter your email address to receive an OTP");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      await api.post("/api/auth/send-otp", { email: email.trim() });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsOtpMode(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send OTP email");
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
          {/* Clean Brand Header */}
          <View className="items-center mb-8">
            <Image
              source={require("../../assets/logo.png")}
              style={{ width: 84, height: 84 }}
              resizeMode="contain"
              className="mb-2"
            />
            <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Bervic Invitation
            </Text>
            <Text className="text-slate-500 text-xs mt-1">
              Sign in to manage your luxury wedding suite
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
          <View className="mb-4">
            {/* Google Sign In Button */}
            <Pressable
              onPress={handleGooglePress}
              disabled={isGoogleLoading}
              className="h-12 rounded-2xl bg-white border border-slate-200 flex-row items-center justify-center mb-5 active:bg-slate-50"
            >
              {isGoogleLoading ? (
                <ActivityIndicator color="#4285F4" />
              ) : (
                <>
                  <View className="mr-2.5">
                    <GoogleLogo size={20} />
                  </View>
                  <Text className="text-slate-800 font-bold text-xs">
                    Continue with Google
                  </Text>
                </>
              )}
            </Pressable>

            {/* Divider */}
            <View className="flex-row items-center mb-5">
              <View className="flex-1 h-[1px] bg-slate-200" />
              <Text className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Or with email
              </Text>
              <View className="flex-1 h-[1px] bg-slate-200" />
            </View>

            {/* Email Field */}
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

            {/* Password or OTP Input */}
            {!isOtpMode ? (
              <View className="mb-5">
                <View className="flex-row items-center justify-between mb-1.5">
                  <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </Text>
                  <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
                    <Text className="text-xs font-semibold text-red-600">
                      Forgot?
                    </Text>
                  </Pressable>
                </View>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12">
                  <Lock size={18} color={BRAND_COLORS.textMuted} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
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
            ) : (
              <View className="mb-5">
                <Text className="text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  6-Digit OTP Code
                </Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 h-12">
                  <Lock size={18} color={BRAND_COLORS.textMuted} />
                  <TextInput
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="123456"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={6}
                    className="flex-1 ml-2.5 text-slate-900 text-sm tracking-widest font-bold"
                  />
                </View>
              </View>
            )}

            {/* Primary Sign In Button (Luxury Gradient Red) */}
            <GradientButton
              onPress={handleSignIn}
              isLoading={isLoading}
              title={isOtpMode ? "Verify OTP & Sign In" : "Sign In with Password"}
              colors={["#EF4444", "#DC2626", "#881337"]}
            />

            {/* Toggle OTP Mode */}
            <Pressable
              onPress={() => {
                if (!isOtpMode) {
                  handleSendOtp();
                } else {
                  setIsOtpMode(false);
                }
              }}
              className="mt-3.5 py-2 items-center"
            >
              <Text className="text-xs font-semibold text-slate-600">
                {isOtpMode ? "← Use Password Instead" : "Sign In with Email OTP →"}
              </Text>
            </Pressable>
          </View>

          {/* Biometrics Action */}
          {isBiometricSupported && (
            <Pressable
              onPress={handleBiometricLogin}
              className="h-12 rounded-2xl bg-white border border-slate-200 flex-row items-center justify-center mb-6 active:bg-slate-50"
            >
              <Fingerprint size={20} color={BRAND_COLORS.primaryRed} />
              <Text className="text-slate-900 font-bold text-xs ml-2">
                Sign in with Face ID / Fingerprint
              </Text>
            </Pressable>
          )}

          {/* Register Link */}
          <View className="flex-row items-center justify-center pb-8">
            <Text className="text-slate-500 text-xs">Don't have an account?</Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text className="text-red-600 font-bold text-xs ml-1">
                Create Free Account
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Google Account Quick Selector Sheet */}
      <Modal
        visible={showGooglePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGooglePicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="mr-2.5">
                  <GoogleLogo size={20} />
                </View>
                <Text className="text-base font-bold text-slate-900">
                  Choose a Google account
                </Text>
              </View>
              <Pressable
                onPress={() => setShowGooglePicker(false)}
                className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <X size={16} color="#64748B" />
              </Pressable>
            </View>

            <Text className="text-xs text-slate-500 mb-4">
              to continue to Bervic Invitation Suite:
            </Text>

            {/* List of Accounts */}
            {RECENT_GOOGLE_ACCOUNTS.map((acc, index) => (
              <Pressable
                key={index}
                onPress={() => executeGoogleLogin(acc.email, acc.name)}
                disabled={isGoogleLoading}
                className="flex-row items-center p-3.5 rounded-2xl border border-slate-100 mb-2.5 active:bg-slate-50"
              >
                <View className="h-10 w-10 rounded-full bg-slate-100 items-center justify-center mr-3 border border-slate-200">
                  <User size={18} color="#64748B" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-slate-900">{acc.name}</Text>
                  <Text className="text-xs text-slate-500">{acc.email}</Text>
                </View>
              </Pressable>
            ))}

            {/* Browser OAuth option */}
            <Pressable
              onPress={launchBrowserGoogleOAuth}
              className="mt-2 py-3 items-center border-t border-slate-100"
            >
              <Text className="text-xs font-semibold text-blue-600">
                Use Another Account via Browser →
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
