import { create } from "zustand";
import { SecureStorage } from "./secureStorage";
import * as LocalAuthentication from "expo-local-authentication";

export interface MobileUser {
  id: string;
  name: string | null;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: string;
  plan: string;
  allowedTemplatesCount?: number;
  allowedCardsCount?: number;
  allowedCinematicCount?: number;
}

interface AuthState {
  user: MobileUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBiometricSupported: boolean;
  hasStoredCredentials: boolean;
  login: (user: MobileUser, token: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  authenticateWithBiometrics: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isBiometricSupported: false,
  hasStoredCredentials: false,

  async initializeAuth() {
    try {
      const token = await SecureStorage.getItem("bervic_auth_token");
      const userJson = await SecureStorage.getItem("bervic_auth_user");
      const isBio = await LocalAuthentication.hasHardwareAsync();

      if (token && userJson) {
        const user = JSON.parse(userJson);
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
          isBiometricSupported: isBio,
          hasStoredCredentials: true,
        });
      } else {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isBiometricSupported: isBio,
          hasStoredCredentials: false,
        });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  async login(user: MobileUser, token: string) {
    await SecureStorage.setItem("bervic_auth_token", token);
    await SecureStorage.setItem("bervic_auth_user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true, hasStoredCredentials: true });
  },

  async logout() {
    await SecureStorage.removeItem("bervic_auth_token");
    await SecureStorage.removeItem("bervic_auth_user");
    set({ user: null, token: null, isAuthenticated: false, hasStoredCredentials: false });
  },

  async authenticateWithBiometrics() {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!compatible || !enrolled) return false;

      const token = await SecureStorage.getItem("bervic_auth_token");
      const userJson = await SecureStorage.getItem("bervic_auth_user");

      if (!token || !userJson) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Sign in to Bervic Invitation Suite",
        fallbackLabel: "Use Password",
      });

      if (result.success) {
        const user = JSON.parse(userJson);
        set({ token, user, isAuthenticated: true, hasStoredCredentials: true });
        return true;
      }
      return false;
    } catch (e) {
      console.warn("Biometric auth error:", e);
      return false;
    }
  },
}));
