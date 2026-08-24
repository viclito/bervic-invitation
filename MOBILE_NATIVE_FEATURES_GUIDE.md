# Native Mobile Superpowers: Capabilities Beyond the Web

When converting the Bervic Invitation Suite into a React Native mobile app, you unlock a suite of hardware, OS-level, and user experience capabilities that are impossible or severely restricted on traditional web browsers.

---

## 1. Real-Time Native Push Notifications (vs. Unreliable Web Push)

### Why Mobile Excels:
* **The Web Limitation:** On mobile web (especially iOS Safari), web push notifications require the user to manually add the website to their home screen first, grant permissions through multi-step popups, and frequently get terminated by battery optimization.
* **The Native Mobile Advantage:**
  * **Instant RSVP Alerts:** As soon as a guest responds with "Attending" or adds dietary requests, the host's phone instantly sounds a celebration chime with an actionable notification banner.
  * **Real-time Order Status & Proofs:** When the printing team uploads a finished foil card preview or marks the shipment as "Out for Delivery", the customer receives an immediate alert.
  * **Automated Event Countdown Reminders:** Push scheduled notifications to hosts (e.g., *"3 days left until the ceremony! 18 guests haven't RSVP'd yet. Tap to send 1-click reminders."*).

---

## 2. Venue Entrance QR Code Camera Scanner (Zero Delay Check-in)

### Why Mobile Excels:
* **The Web Limitation:** Browser camera access on mobile web suffers from permission re-prompts, slow canvas frame rate, autofocus lag, and browser sleep timeouts.
* **The Native Mobile Advantage:**
  * Uses `expo-camera` with hardware-accelerated 60 FPS barcode scanning.
  * Organizers and venue staff can stand at the door, point the phone at incoming guests' digital passes, and instantly verify:
    1. Guest Name & Authenticity.
    2. Number of Plus-Ones allowed.
    3. VIP seating / Table allocations.
    4. Automatically toggles check-in status in the database with a green haptic confirmation.

---

## 3. 1-Tap Device Contacts Picker (Bulk Guest List Creation)

### Why Mobile Excels:
* **The Web Limitation:** Websites cannot read the user's phonebook contacts. Users are forced to manually type hundreds of phone numbers and names, leading to high drop-off.
* **The Native Mobile Advantage:**
  * Uses `expo-contacts` to open the native phone contacts sheet.
  * Hosts can multi-select 50+ friends and family members in under 10 seconds.
  * Names and phone numbers are automatically cleaned, formatted with international country codes (`+91`), and imported into the guest table.

---

## 4. Native WhatsApp & Social Share Sheet (Zero Clunky Copy-Pasting)

### Why Mobile Excels:
* **The Web Limitation:** Web `wa.me` links open new browser tabs, prompting external app switches that often break context or get blocked by popup blockers.
* **The Native Mobile Advantage:**
  * Uses deep linking (`Linking.openURL('whatsapp://send?...')`) and native OS Share Sheets (`expo-sharing`).
  * Can attach dynamic card preview images, custom typography cards, and interactive invitation URLs directly into WhatsApp, Instagram Stories, Apple AirDrop, or iMessage with zero intermediate browser hops.

---

## 5. Offline-First Access for Organizers in Low-Network Banquet Halls

### Why Mobile Excels:
* **The Web Limitation:** Wedding venues, hotel basements, and rural banquet lawns frequently suffer from poor cell reception. A web app shows a blank "No Internet" offline error.
* **The Native Mobile Advantage:**
  * Uses local SQLite / MMKV local persistence (`@tanstack/react-query` offline persistence).
  * Organizers can view their entire guest list, search attendee names, look up vendor phone numbers, and record check-ins completely offline. Changes automatically sync to the server when network reconnects.

---

## 6. Biometric Security & 1-Tap Checkout (Face ID / Fingerprint)

### Why Mobile Excels:
* **The Web Limitation:** Users constantly get logged out when session cookies expire and have to re-enter email passwords or wait for email OTPs.
* **The Native Mobile Advantage:**
  * Instant 0.2-second login via `expo-local-authentication` (Face ID / Apple Touch ID / Android BiometricPrompt).
  * 1-Tap native payment integration for purchasing luxury physical cards and upgrading quotas using native Apple Pay / Google Pay / Razorpay Native SDK without entering SMS OTPs.

---

## 7. Tactile Haptic Feedback & Gesture-Driven Canvas Studio

### Why Mobile Excels:
* **The Web Limitation:** Web touch interactions lack tactile feedback, making drag-and-drop card designing feel slippery and inaccurate on small screens.
* **The Native Mobile Advantage:**
  * **Sensory Engagement:** Using `expo-haptics`, users feel a distinct mechanical click when snapping elements to center lines, picking color swatches, or confirming RSVPs.
  * **Fluid 120 FPS Gestures:** Pinch-to-zoom, two-finger rotate, and smooth velocity-based scrolling powered by `react-native-gesture-handler` and `react-native-reanimated`.
