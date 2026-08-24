# React Native (Expo) Master Blueprint: Bervic Invitation Suite

> **Project:** Bervic Invitation Mobile App  
> **Framework:** React Native with Expo (SDK 52+), Expo Router v4, NativeWind v4 (Tailwind CSS)  
> **Brand Design System:** Signature Imperial White & Crimson Red (`#DC2626` / `#991B1B` / `#FFFFFF`)  
> **Architecture Goal:** 100% Feature Parity with Web, zero "shrunk website" feel, true native mobile UX.

---

## 1. App Philosophy & Feel: True Native Luxury vs. Web Page

### ❌ What the App MUST NOT Feel Like:
* No web-like static pages with long vertical scrolling of generic web sections.
* No browser-like dropdown selects, generic HTML alert modals, or tiny tap targets.
* No delayed web transitions or spinner-heavy page loads.

### ✨ How the App MUST Feel:
* **Tactile & Responsive (Haptics):** Subtle haptic tick (`expo-haptics`) when selecting templates, switching tabs, adding elements, or confirming RSVP dispatches.
* **Fluid Bottom Sheet Architecture:** Every modal (guest editing, date picker, color variant selector, profile switch) opens as a smooth native gesture-driven bottom sheet (`@gorhom/bottom-sheet`).
* **Micro-Interactions & 120 FPS Motion:** Powered by `react-native-reanimated` with spring physics on card interactions, carousel snapping, and animated badge counters.
* **Instant Native Launch:** Splash screen seamlessly transitions into cached dashboard data using MMKV/SQLite local cache before network requests complete.
* **Offline-Resilient:** Organizers can look up guest lists and scan QR codes at venue doors even in low-connectivity banquet halls.

---

## 2. Brand Visual Identity & Color System (White & Red)

The palette balances pure modern white space with luxurious crimson red accents, creating an elegant, celebration-worthy aesthetic.

| Token | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| `primary-red` | `#DC2626` (Red-600) | Primary action buttons, active tab indicators, key badges |
| `deep-crimson` | `#991B1B` (Red-800) | Headers, royal accents, high-contrast borders |
| `ruby-dark` | `#7F1D1D` (Red-900) | Premium card backgrounds, luxury tier highlights |
| `rose-tint` | `#FEF2F2` (Red-50) | Selected item backdrops, input backgrounds, subtle card fills |
| `rose-subtle` | `#FEE2E2` (Red-100) | Subtle borders, divider lines, pill badges |
| `pure-white` | `#FFFFFF` | Primary surface background, card containers, dialog backgrounds |
| `canvas-light` | `#F8FAFC` | App background, contrast backing for white cards |
| `text-primary` | `#0F172A` (Slate-900) | High-contrast typography |
| `text-muted` | `#64748B` (Slate-500) | Subtitles, hints, timestamps |

---

## 3. Navigation Hierarchy & Screen Architecture (Expo Router)

```
app/
├── (auth)/
│   ├── sign-in.tsx               # Login with Email + Password / OTP toggle
│   ├── register.tsx              # Account creation + Name + Phone
│   ├── otp-verify.tsx            # 6-digit auto-read OTP verification screen
│   └── forgot-password.tsx       # Reset password magic link trigger
│
├── (tabs)/
│   ├── _layout.tsx               # Bottom Tab Bar with White & Crimson Red styling
│   ├── index.tsx                 # [TAB 1: Home / Studio] - Featured templates, quick actions, stats
│   ├── events.tsx                # [TAB 2: My Events] - Event profile manager, live invitation links
│   ├── guests.tsx                # [TAB 3: Guest Hub] - RSVP overview, QR passes, WhatsApp dispatch
│   ├── shop.tsx                  # [TAB 4: Print Shop] - Luxury physical cards, card customizer
│   └── profile.tsx               # [TAB 5: Account & Orders] - Orders tracking, plan quota, settings
│
├── studio/
│   ├── template-preview.tsx      # Full-screen interactive invitation preview with live data injection
│   ├── canva-editor.tsx          # Touch-optimized 2D canvas card editor (text, stickers, colors)
│   ├── customizer-modal.tsx      # Sheet for modifying event details on the fly
│   └── export-modal.tsx          # Export high-res PDF / Image / Video shareable card
│
├── wizard/
│   ├── ocr-scanner.tsx           # Live Camera / Photo OCR invitation text extractor (Tesseract/Vision)
│   ├── step-event-type.tsx       # Wedding vs Birthday selector
│   ├── step-hosts.tsx            # Partner/Host names & initials monogram
│   ├── step-venues.tsx           # Multi-venue manager with Google Maps search integration
│   ├── step-subevents.tsx        # Rituals & Sub-functions (Sangeet, Reception, Haldi)
│   ├── step-timeline.tsx         # Day timeline scheduler (Vows, Feast, Cake cutting)
│   ├── step-story.tsx            # Love story narrative & video teaser URL
│   └── step-gallery.tsx          # Multi-photo uploader with Cloudinary background processing
│
├── guests/
│   ├── add-guest-sheet.tsx       # Add guest with phone contacts picker integration
│   ├── import-sheet.tsx          # Import contacts from device or Excel/CSV
│   ├── qr-scanner.tsx            # Real-time venue entrance QR code check-in camera
│   └── guest-detail.tsx          # Dietary notes, plus-ones counter, WhatsApp dispatch history
│
├── shop/
│   ├── product-detail.tsx        # Card detail with 350 GSM texture preview, gallery & reviews
│   ├── cart-sheet.tsx            # Slide-over cart drawer with pricing calculations
│   └── checkout.tsx              # Address lookup, pincode validation & Razorpay SDK checkout
│
├── orders/
│   ├── [id].tsx                  # Order tracking timeline (Pending -> Shipped -> Delivered)
│   └── chat.tsx                  # Live two-way admin proof approval chat with image attachments
│
└── subscription/
    ├── pricing-plans.tsx         # Plan comparison (Basic, Pro, Cinematic) with feature matrix
    └── checkout-modal.tsx        # Native Razorpay payment sheet for instant quota unlock
```

---

## 4. Complete Feature Parity Checklist (100% Zero Missing Features)

### 4.1 Authentication & Profile Management
- [x] Email + Password authentication with bcrypt validation.
- [x] One-Time Password (OTP) verification with auto-fill via SMS/Email.
- [x] Multi-profile draft switching (`isActive` toggle between different wedding/birthday events).
- [x] Multi-tenant data isolation (every query filtered by `userId`).
- [x] Admin & Staff badge display and privileged routing.

### 4.2 Event Wizard & OCR Auto-Fill
- [x] Multi-step event creation wizard with progress bar and step persistence.
- [x] **Smart AI/OCR Document Extraction**: Capture photo of physical invitation card with phone camera, extract names, dates, venues, and auto-populate all draft fields.
- [x] Wedding mode (Couples, Monogram, 2 Venues, Sangeet/Reception sub-events) and Birthday mode (Host, Turning Age, Party Venue).
- [x] Cloudinary multi-image background uploader with progress indicators.
- [x] Love story text and YouTube/Vimeo video URL embeds.

### 4.3 Template Gallery & Live Interactive Previews
- [x] All 15+ rich design themes supported:
  * Classic Floral, Golden Ring, Premium Scroll, Art Deco, Citrus Summer, Confetti Carnival, Eclectic Chic, Industrial Loft, Japandi, Masterpiece, Monochrome, Space Galaxy, Storybook, Tiny Sweet, Urban Streetwear, Vintage Newspaper, Watercolor Floral.
- [x] Dynamic real-time preview injecting active user draft details.
- [x] Interactive components: Live countdown timers, venue directions via Google Maps/Apple Maps, photo gallery lightbox, celebratory confetti particles, background music playback.
- [x] Custom slug availability checker (`/api/invitations/check-slug`) with 1-tap save.

### 4.4 Mobile Canva 2D Studio
- [x] Gesture-driven canvas editor (Pinch-to-zoom, pan, drag-and-drop elements).
- [x] Multi-layer editing: Text formatting (custom fonts, sizes, letter spacing, alignment), sticker badges, floral borders, geometric shapes.
- [x] Color palette variants with instant canvas re-theming.
- [x] High-resolution PNG and print-ready PDF export via native canvas rendering.
- [x] 1-Tap "Add to Cart for Physical Print" action.

### 4.5 Guest Hub, RSVP & Venue Check-In Scanner
- [x] Guest list management with status badges (`PENDING`, `ATTENDING`, `DECLINED`).
- [x] Plus-ones counter and dietary requirements notes.
- [x] **Device Contacts Import**: Pick multiple guests directly from phone contacts in 1 tap.
- [x] **1-Click Personalized WhatsApp Dispatch**: Directly launches WhatsApp with a pre-filled invitation greeting, personalized guest pass link, and unique code.
- [x] **Native Camera QR Code Check-in**: Point camera at guest's digital pass at venue entrance to mark attendance and verify plus-ones in real time.
- [x] RSVP analytical breakdown charts (Total Invited, Confirmed Guests, Plus-ones count, Decline rate).

### 4.6 Traditional Luxury Shop, Cart & Physical Orders
- [x] Luxury catalog with category filtering (Royal, Floral, Vintage, Modern, Velvet).
- [x] Paper stock selector (350 GSM Textured Metallic Gold, Matte Velvet, Handcrafted Cotton).
- [x] Minimum copies validation (e.g. 50+ copies) and live total pricing calculator.
- [x] Cart drawer with persistent local & backend storage (`CartItem`).
- [x] Native Razorpay SDK payment integration for instant UPI/Card payments.
- [x] Order tracking timeline with live push notifications on status changes.
- [x] In-app two-way customer-to-admin chat for digital proof approvals before printing.

### 4.7 Subscriptions, Quotas & Locking System
- [x] Tiered subscription plans (`BASIC_599`, `PRO_1799`, `CINEMATIC_2000`).
- [x] Quota enforcement (`allowedTemplatesCount`, `allowedCardsCount`, `allowedCinematicCount`).
- [x] Admin lock/unlock moderation banner support.

---

## 5. Technical Stack & Recommended React Native Packages

```json
{
  "dependencies": {
    "expo": "^52.0.0",
    "expo-router": "^4.0.0",
    "nativewind": "^4.1.23",
    "react-native-reanimated": "~3.16.1",
    "react-native-gesture-handler": "~2.20.2",
    "@gorhom/bottom-sheet": "^5.0.0",
    "lucide-react-native": "^0.475.0",
    "expo-haptics": "~14.0.0",
    "expo-camera": "~16.0.0",
    "expo-contacts": "~14.0.0",
    "expo-notifications": "~0.29.0",
    "expo-sharing": "~13.0.0",
    "expo-image": "~2.0.0",
    "expo-av": "~15.0.0",
    "expo-local-authentication": "~15.0.0",
    "react-native-svg": "15.8.0",
    "react-native-razorpay": "^2.3.0",
    "@tanstack/react-query": "^5.66.0",
    "zustand": "^5.0.3",
    "axios": "^1.7.9"
  }
}
```
