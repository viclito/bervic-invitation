# React Native Ultra-Performance & Low-Latency Optimization Architecture

> **Application:** Bervic Invitation Suite Mobile App  
> **Target Performance Benchmarks:**  
> • **Cold Start Time:** < 1.2 seconds  
> • **Screen Frame Rate:** Consistent 60 FPS on mid-range Android & 120 FPS on iOS ProMotion  
> • **Memory Footprint:** < 120 MB baseline RAM usage (Zero memory leaks on camera/audio)  
> • **List Scrolling (500+ Guests):** 0 blank cells during fast fling scroll (FlashList recycling)  
> • **Canvas Studio Interaction Latency:** < 16ms touch-to-render response time

---

## 1. Core Performance Pillars & Implementation Techniques

```mermaid
graph TD
    subgraph UI & Motion Layer [120 FPS UI Thread]
        Reanimated["react-native-reanimated (Worklets)"]
        Gestures["react-native-gesture-handler"]
        FlashList["@shopify/flash-list (Recycling)"]
    end

    subgraph Media & Storage Layer [Zero Lag Pipeline]
        ExpoImage["expo-image (Blurhash + Disk Cache)"]
        MMKV["react-native-mmkv (30x faster than AsyncStorage)"]
        Skia["@shopify/react-native-skia (Canvas Engine)"]
    end

    subgraph Engine & Networking [Instant 0ms Data]
        Hermes["Hermes Engine + New Architecture (JSI)"]
        ReactQuery["TanStack React Query (Stale-While-Revalidate)"]
    end

    UI & Motion Layer <--> Media & Storage Layer
    Media & Storage Layer <--> Engine & Networking
```

---

## 2. High-Performance Techniques by Feature Module

### 2.1 Guest List with 500+ Attendees (`@shopify/flash-list`)
* **The Problem:** Standard `<FlatList>` or `<ScrollView>` mounts hundreds of components into memory, causing severe frame drops, UI freezes, and blank white rectangles during fast scrolling.
* **The Optimization:**
  * Use **Shopify's `@shopify/flash-list`** with an estimated item size of `72px`.
  * FlashList **recycles** existing native views instead of destroying and recreating DOM nodes.
  * Memoize each row component using `React.memo` with custom comparison (`prevProps.guest.status === nextProps.guest.status`) to prevent re-rendering 500 rows when one guest is checked in.

```tsx
import { FlashList } from "@shopify/flash-list";
import React, { memo } from "react";

const GuestRow = memo(({ guest, onSwipeWhatsApp, onCheckIn }: GuestRowProps) => {
  return (
    <View className="h-[72px] flex-row items-center px-4 bg-white border-b border-red-50">
      {/* Optimized Row Content */}
    </View>
  );
}, (prev, next) => prev.guest.status === next.guest.status && prev.guest.whatsappSentAt === next.guest.whatsappSentAt);

export function GuestList({ guests }: { guests: Guest[] }) {
  return (
    <FlashList
      data={guests}
      renderItem={({ item }) => <GuestRow guest={item} />}
      estimatedItemSize={72}
      keyExtractor={(item) => item.id}
    />
  );
}
```

---

### 2.2 Image Pipeline & Progressive Placeholders (`expo-image`)
* **The Problem:** Loading high-resolution wedding photography (Cloudinary URLs) without optimization causes massive memory spikes, screen jank, and battery drain.
* **The Optimization:**
  * Use **`expo-image`** which utilizes native iOS `SDWebImage` and Android `Glide`.
  * Enable **Progressive Blurhash**: Displays a tiny 32-byte color placeholder instantly before the full image arrives, eliminating layout shifts.
  * Set explicit `priority="high"` for the active cover photo and `priority="low"` for gallery thumbnails.
  * Enable automatic downscaling: Request Cloudinary images with dynamic width parameters (`w_800,f_auto,q_auto`) matching the device screen density.

```tsx
import { Image } from "expo-image";

const blurhash = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

export function OptimizedCoverPhoto({ url }: { url: string }) {
  return (
    <Image
      source={url}
      placeholder={{ blurhash }}
      contentFit="cover"
      transition={300}
      cachePolicy="memory-disk"
      className="w-full h-64 rounded-2xl"
    />
  );
}
```

---

### 2.3 Instant 0ms Screen Transitions (MMKV + React Query)
* **The Problem:** Waiting for network roundtrips every time a user switches tabs causes empty loading spinners.
* **The Optimization:**
  * Replace traditional `AsyncStorage` with **`react-native-mmkv`** (written in C++, synchronous memory-mapped I/O, **30x faster**).
  * Combine with **TanStack React Query's `persistQueryClient`**:
    1. When opening the app, cached events, templates, and guest lists load from MMKV in **< 5 milliseconds**.
    2. A non-blocking background fetch verifies data freshness without showing a loading spinner.

---

### 2.4 Canva 2D Studio: 120 FPS Touch & Pan (`react-native-reanimated`)
* **The Problem:** Calculating element dragging and pinching on the JavaScript thread causes touch lag and stutter.
* **The Optimization:**
  * Run all touch gestures directly on the native UI thread using **Reanimated Worklets** (`useAnimatedStyle`, `useSharedValue`, and `Gesture.Pan()`).
  * Separate **Visual Interaction State** (60/120 FPS instant movement on screen) from **Business State** (updating the JSON array in database debounced by 300ms after user lifts their finger).

---

### 2.5 Battery & Hardware Resource Management (Camera & Audio)
* **The Problem:** Keeping the camera or background music player active when navigating away drains the phone's battery and causes memory leaks.
* **The Optimization:**
  * **Camera Cleanup:** In `qr-scanner.tsx` and `ocr-scanner.tsx`, automatically deactivate the camera session whenever the screen loses focus using `useIsFocused()` from Expo Router.
  * **Audio Cleanup:** In `expo-av` background music playback, ensure `sound.unloadAsync()` is called in the `useEffect` cleanup hook on component unmount.

---

## 3. Production Readiness Checklist: What Else is Required?

To guarantee a smooth launch on the **Apple App Store** and **Google Play Store**, here are the remaining production requirements:

| Requirement | Implementation Detail | Status / Action |
| :--- | :--- | :--- |
| **1. Crash Reporting (Sentry)** | `@sentry/react-native` for real-time tracking of native iOS/Android crashes and unhandled JS exceptions. | Integrated in root layout |
| **2. Offline Network Toast** | `@react-native-community/netinfo` to show a subtle *"Working Offline — Changes will sync when reconnected"* banner. | Handled in global provider |
| **3. App Store Guideline 5.1.1 (Account Deletion)** | Apple strictly requires an in-app "Delete Account & Data" button for any app that supports user registration. | Included in Profile tab |
| **4. App Icons & Adaptive Splash** | 1024x1024 icon with White & Red branding, vector Android adaptive icon, and native launch storyboard. | Configured in `app.json` |
| **5. Safe Area Insets** | `react-native-safe-area-context` to ensure zero overlapping with iPhone Dynamic Island, home indicator, and Android navigation bars. | Standardized in screen layouts |
| **6. Deep Linking Configuration** | Handle custom URLs (`bervic://invitation/[slug]` and `https://bervic.com/invitation/[slug]`) for universal app opening. | Configured via Expo Router scheme |

---

## 4. Performance Audit Summary

By adhering to the techniques in this document:
- The app will achieve a **smooth 60/120 FPS UI response**.
- App launch time will be instantaneous (< 1.2s cold start).
- Data will load in 0ms via local MMKV cache.
- The app will operate reliably even in high-stress, low-connectivity wedding environments.
