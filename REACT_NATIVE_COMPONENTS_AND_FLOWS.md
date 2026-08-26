# React Native Screen-by-Screen Component Specifications & UI State Flows

> **Target Platform:** React Native (Expo SDK 52+) with Expo Router  
> **Styling Framework:** NativeWind v4 (Tailwind CSS)  
> **Brand Palette:** Pure White (`#FFFFFF`), Canvas Light (`#F8FAFC`), Crimson Red (`#DC2626`), Deep Maroon (`#991B1B`), Rose Tint (`#FEF2F2`)

---

## 1. Authentication & Onboarding Flow

```
(auth)
├── sign-in.tsx
├── register.tsx
├── otp-verify.tsx
└── forgot-password.tsx
```

### 1.1 `sign-in.tsx`
* **UI Components:**
  * Top branding: Imperial White & Crimson Red badge with monogram logo.
  * Form inputs: Email address (`keyboardType="email-address"`), Password (`secureTextEntry`), Toggle visibility icon (Lucide `Eye` / `EyeOff`).
  * Action buttons:
    * Primary: "Sign In with Password" (`bg-red-600 active:bg-red-700 text-white`).
    * Secondary: "Sign In with Email OTP" (`border border-red-200 bg-red-50 text-red-700`).
    * Link: "Create an Account" / "Forgot Password?".
* **States:** `idle`, `loading` (red activity spinner on button), `error` (haptic warning vibrate + floating error card).
* **Storage:** On success, stores JWT token in `expo-secure-store` and user profile in Zustand auth store.

### 1.2 `otp-verify.tsx`
* **UI Components:**
  * 6-box individual digit input with auto-focus and auto-advance.
  * "Resend OTP in 0:45s" countdown timer.
  * "Verify & Continue" button.

---

## 2. Main Tab 1: Home & Studio (`(tabs)/index.tsx`)

### Screen Anatomy & Hierarchy:
1. **Hero Header:**
   * Greeting: *"Good morning, [Partner 1] & [Partner 2]"*.
   * Active Event Pill: *"54 Days to Wedding • Nov 20, 2026"* (Ruby red gradient card).
   * Profile Switcher: Dropdown bottom-sheet to switch between multiple draft events (Wedding vs Birthday).
2. **Quick Action Grid (4 Large Touch Tiles):**
   * 📷 **AI Card Scanner (OCR)** $\rightarrow$ Auto-fill draft from physical photo.
   * 🎨 **Canva 2D Studio** $\rightarrow$ Design custom luxury digital & print card.
   * 👥 **Guest Hub** $\rightarrow$ RSVP stats, WhatsApp dispatch & QR check-in.
   * 🛍️ **Luxury Print Shop** $\rightarrow$ Order 350 GSM physical foil cards.
3. **Live Template Showcase (15+ Themes Carousel):**
   * Horizontal snapping carousel (`react-native-reanimated`).
   * Live cards rendering actual user couple names, event dates, and cover photos.
   * "Preview Live Website" button & "Customize Theme" button.
4. **Recent Activity Stream:**
   * Latest RSVP responses with green/red status pills.
   * Print order status cards with live timeline tracking.

---

## 3. Main Tab 2: Event Profiles & Wizard (`(tabs)/events.tsx`)

### Screen Anatomy & Flows:
1. **Draft Status Bar:**
   * Visual progress ring: *"85% Details Completed"*.
   * Missing fields warning badge: *"Add Venue 2 Map link"*.
2. **Modular Section Accordions (Gesture-Driven Bottom Sheets):**
   * **Couple / Host Details:** Partner 1 & 2 names, monogram initials, formal invitation line, tagline.
   * **Date & Schedule:** Date picker (`@react-native-community/datetimepicker`), ceremony time, day timeline items (Vows, Lunch, Toast).
   * **Venues & Maps:** Venue 1 & Venue 2 names, addresses, Google Maps links with "Test Map Pin" native button.
   * **Sub-Events (Rituals):** Sangeet, Mehendi, Haldi, Reception sub-event cards with dates and dress codes.
   * **Our Love Story:** Multi-line narrative text and YouTube/Vimeo video URL.
   * **Photo Gallery:** Multi-image picker (`expo-image-picker`) with Cloudinary background upload and drag-and-drop reordering.
   * **Background Music:** Song selector with live audio preview player (`expo-av`).

---

## 4. Main Tab 3: Guest Hub & Door Check-In (`(tabs)/guests.tsx`)

### Screen Anatomy & Flows:
1. **Analytics Summary Row (3 Metric Cards):**
   * Total Invited (e.g. 250).
   * Confirmed Attending (e.g. 182 + 34 Plus-ones).
   * Pending Response (e.g. 34).
2. **Action Bar:**
   * 📇 **"Import Contacts"**: Opens native `expo-contacts` sheet to select multiple guests in 1 tap.
   * ➕ **"Add Guest"**: Native bottom sheet (Name, Phone, Email, Max Plus-Ones, Dietary Notes).
   * 📷 **"Door Check-in Scanner"**: Opens camera scanner (`expo-camera`) to scan guest QR passes.
3. **Guest List with Swipe Actions (`react-native-gesture-handler`):**
   * **Swipe Right:** Quick WhatsApp Dispatch (Directly opens WhatsApp with personalized link).
   * **Swipe Left:** Delete / Edit guest.
   * **Row Tap:** Opens detailed guest profile (RSVP history, unique code, food preferences).

---

## 5. Main Tab 4: Luxury Print Shop & Cart (`(tabs)/shop.tsx`)

### Screen Anatomy & Flows:
1. **Category Filter Pills:**
   * "All", "Royal Gold", "Floral Botanical", "Modern Minimal", "Velvet Luxe", "Vintage Heritage".
2. **Product Grid:**
   * High-res imagery with 350 GSM metallic texture badge.
   * Starting price per card and minimum order quantity (e.g. *"From ₹65/card • Min 50 pcs"*).
3. **Product Detail Sheet (`shop/product-detail.tsx`):**
   * Interactive photo gallery with pinch-to-zoom.
   * Paper stock picker: *350 GSM Textured Metallic Gold*, *400 GSM Soft Touch Velvet*, *300 GSM Deckle Edge Cotton*.
   * Copies quantity stepper: `[-] 100 [+]` with live total calculation.
   * "Customize with My Event Data" toggle.
   * "Add to Cart" button with animated cart icon badge.
4. **Cart Drawer & Checkout (`shop/checkout.tsx`):**
   * Shipping address form with Indian Pincode auto-city detection.
   * Delivery estimation badge.
   * Razorpay Native SDK 1-tap checkout (UPI, Cards, NetBanking).

---

## 6. Main Tab 5: Account, Orders & Chat (`(tabs)/profile.tsx`)

### Screen Anatomy & Flows:
1. **User Profile Card:**
   * Name, Email, Plan Tier Badge (*"PRO LUXE ACTIVE"* in gold/red badge).
   * Active Quota counters: *3 of 5 Invitations Used • 8 Cards Remaining*.
2. **Physical Orders Timeline (`orders/[id].tsx`):**
   * Step progress tracker: `Order Placed` $\rightarrow$ `Proof Approved` $\rightarrow$ `In Production` $\rightarrow$ `Dispatched` $\rightarrow$ `Delivered`.
3. **Two-Way Print Proof Chat (`orders/chat.tsx`):**
   * Real-time messaging with printing admin.
   * Image attachment preview for digital print proofs (Foil positioning, spellings).
   * "Approve Proof for Printing" button with safety confirmation dialog.

---

## 7. Canva 2D Touch Studio (`studio/canva-editor.tsx`)

### Touch-Optimized Canvas Engine:
* **Canvas Viewport:** Scaled responsive canvas supporting Aspect Ratios (Portrait 9:16, Classic 5:7, Square 1:1).
* **Gestures (`react-native-gesture-handler`):**
  * Single finger pan to position elements.
  * Pinch-to-zoom to resize text and stickers.
  * Two-finger rotation with magnetic snapping at 0°, 90°, 180°, 270°.
* **Floating Bottom Toolbar:**
  * **Text Tool:** Font family selector (Playfair Display, Great Vibes, Cinzel, Montserrat), font size, color palette picker, letter spacing, line height.
  * **Graphics & Stickers:** Royal monograms, floral corners, gold borders, watercolor splash overlays.
  * **Color Variants:** 1-Tap re-theming (Burgundy Red, Royal Navy, Forest Emerald, Rose Champagne).
  * **Layers Drawer:** Reorder layers (Bring to Front, Send to Back), duplicate layer, lock layer.
  * **Export & Save:** Save to Cloud, Export High-Res PNG / PDF to device files, or "Order Physical Prints".
