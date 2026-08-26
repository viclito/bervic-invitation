# Monorepo Migration, Workspace Configuration & Deployment Guide

> **Architecture:** Turborepo + npm / pnpm Workspaces  
> **Web Platform:** Next.js 16 (App Router) $\rightarrow$ Deployed on Vercel  
> **Mobile Platform:** React Native Expo SDK 52+ $\rightarrow$ Built via Expo Application Services (EAS) & App Stores

---

## 1. Directory Structure

```
bervic-invitation/
├── apps/
│   ├── web/                     # Next.js Web App (Full existing codebase)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── prisma/
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json         # name: "web"
│   │
│   └── mobile/                  # React Native Expo Mobile App
│       ├── app/                 # Expo Router v4 screens
│       │   ├── (auth)/
│       │   ├── (tabs)/
│       │   ├── studio/
│       │   ├── wizard/
│       │   └── shop/
│       ├── components/          # Native mobile components (NativeWind)
│       ├── hooks/               # Mobile query & mutation hooks
│       ├── app.json             # Expo configuration (icons, splash, permissions)
│       ├── eas.json             # EAS cloud build profiles (development, preview, production)
│       ├── tailwind.config.js   # NativeWind configuration (White & Red theme)
│       ├── tsconfig.json
│       └── package.json         # name: "mobile"
│
├── packages/
│   └── shared/                  # Shared TypeScript interfaces & validators
│       ├── src/
│       │   ├── types/           # User, Invitation, Guest, Order interfaces
│       │   ├── constants/       # Theme lists, paper stocks, pricing tiers
│       │   └── utils/           # Date formatters, validation helpers
│       ├── tsconfig.json
│       └── package.json         # name: "@bervic/shared"
│
├── package.json                 # Root monorepo workspace configuration
├── turbo.json                   # Turborepo pipeline caching
└── .gitignore
```

---

## 2. Root Monorepo Configuration

### 2.1 Root `package.json`
```json
{
  "name": "bervic-suite",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "turbo run dev --filter=web",
    "dev:mobile": "turbo run dev --filter=mobile",
    "build:web": "turbo run build --filter=web",
    "build:mobile": "turbo run build --filter=mobile",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2.4.0",
    "typescript": "^5.7.0"
  }
}
```

### 2.2 `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## 3. Vercel Configuration (Zero Downtime & Web Deployment)

### 3.1 Configure Vercel Project Settings:
1. Go to **[vercel.com](https://vercel.com)** $\rightarrow$ Select your `bervic-invitation` project.
2. Navigate to **Settings** $\rightarrow$ **General**.
3. Locate **Root Directory**:
   * Click **Edit** and set it to: `apps/web`
   * Check **"Include source files outside of the Root Directory in the Build Step"** (enables access to `packages/shared`).
4. In **Build & Development Settings**:
   * Framework Preset: **Next.js**
   * Build Command: `prisma generate && next build`
   * Output Directory: `.next`

### 3.2 Prevent Mobile Commits from Triggering Vercel Builds:
Under **Settings** $\rightarrow$ **Git** $\rightarrow$ **Ignored Build Step**:
Enter:
```bash
git diff --quiet HEAD^ HEAD ./apps/web
```
* **Why this is critical:** Whenever you make commits to `apps/mobile/`, Vercel will skip the build completely, saving your Vercel build minutes and preventing unnecessary web redeploys.

---

## 4. Mobile App Cloud Builds & App Stores (Expo EAS)

### 4.1 `apps/mobile/eas.json`
```json
{
  "cli": {
    "version": ">= 14.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 4.2 Build & Release Commands:
* **Test Locally on Physical Phone:**
  ```bash
  cd apps/mobile && npx expo start
  ```
  *(Scan QR code with Expo Go on iOS/Android)*
* **Build Direct Android APK (for testing):**
  ```bash
  cd apps/mobile && eas build --profile preview --platform android
  ```
* **Build Production App Store & Play Store Binaries:**
  ```bash
  cd apps/mobile && eas build --profile production --platform all
  ```
* **Push Instant Over-The-Air (OTA) Update:**
  ```bash
  cd apps/mobile && eas update --branch production --message "Add new floral theme"
  ```
