import Constants from "expo-constants";
import { useAuthStore } from "./authStore";

// Dynamic Base URL pointing to currently running Next.js instance
export function getBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(":")[0];
    return `http://${hostIp}:3000`;
  }

  return "http://localhost:3000";
}

export const PRODUCTION_WEB_URL = getBaseUrl();

export const API_BASE_URL = getBaseUrl();

export function getOAuthBridgeUrl(): string {
  return getBaseUrl();
}

interface RequestOptions extends RequestInit {
  data?: any;
  timeoutMs?: number;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { data, headers = {}, timeoutMs = 12000, ...customConfig } = options;
  const token = useAuthStore.getState().token;
  const baseUrl = getBaseUrl();

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const config: RequestInit = {
    ...customConfig,
    headers: reqHeaders,
    signal: controller.signal,
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${cleanEndpoint}`;

  try {
    const response = await fetch(fullUrl, config);
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    try {
      return (await response.json()) as T;
    } catch {
      return {} as T;
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(
        `Connection timed out. Ensure Next.js is running (npm run dev:web) at ${baseUrl}`
      );
    }
    if (error.message?.includes("Network request failed")) {
      throw new Error(
        `Cannot reach backend at ${baseUrl}. Ensure Next.js is running (npm run dev:web).`
      );
    }
    throw error;
  }
}

export const api = {
  get: <T = any>(url: string, headers?: Record<string, string>) =>
    apiRequest<T>(url, { method: "GET", headers }),

  post: <T = any>(url: string, data?: any, headers?: Record<string, string>) =>
    apiRequest<T>(url, { method: "POST", data, headers }),

  put: <T = any>(url: string, data?: any, headers?: Record<string, string>) =>
    apiRequest<T>(url, { method: "PUT", data, headers }),

  delete: <T = any>(url: string, headers?: Record<string, string>) =>
    apiRequest<T>(url, { method: "DELETE", headers }),
};
