"use client";

import { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { setProfileHasDetailsCache } from "@/lib/useRequireLoginAndDetails";
import WizardDetailsSkeleton from "@/components/skeletons/WizardDetailsSkeleton";
import LoginModal from "@/components/auth/LoginModal";
import {
  Upload,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Wand2,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Cake,
  PartyPopper,
  Home,
  User,
  Phone,
  Image as ImageIcon,
  Loader2,
  ShieldCheck,
  Plus,
  Trash2,
  Video,
  VideoOff,
  X,
  Save,
  LayoutDashboard,
  Lock,
  LogIn,
  UserPlus,
  Globe,
  Edit3,
} from "lucide-react";

export interface EventSubFunction {
  id?: string;
  icon?: string;
  title: string;
  date: string;
  time: string;
  venue: string;
}

export interface DayTimelineItem {
  id?: string;
  icon?: string;
  title: string;
  date: string;
  time: string;
}

export interface VenueLocationItem {
  id: string;
  mainTitle: string;
  subLabel: string;
  venuePhoto: string;
  address: string;
  mapUrl: string;
}

export interface DraftData {
  id?: string;
  invitationId?: string;
  customSlug?: string;
  eventType: string;
  hostNameOne: string;
  hostNameTwo: string;
  coupleInitials: string;
  eventTitle: string;
  inviteLine: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  venueTwoName: string;
  venueTwoAddress: string;
  venueTwoMapUrl: string;
  locations: VenueLocationItem[];
  tagline: string;
  turningAge: string;
  dressCode: string;
  rsvpContact: string;
  loveStoryText: string;
  loveStoryVideoUrl: string;
  showVideo: boolean;
  coverImage: string;
  coupleImage: string;
  partnerTwoImage: string;
  venueImage: string;
  galleryImages: string[];
  functions: EventSubFunction[];
  timelineItems: DayTimelineItem[];
  additionalNotes: string;
  extractedFromDoc: boolean;
  completedFields: string[];
  currentStep: number;
}

export const WEDDING_DEFAULT_LOCATIONS: VenueLocationItem[] = [
  {
    id: "loc-1",
    mainTitle: "Marriage Ceremony Venue",
    subLabel: "Your Ceremony Hall",
    venuePhoto: "/images/templates/venue-ceremony.jpg",
    address: "Your Full Address, City, State 000000",
    mapUrl: "https://maps.google.com",
  },
  {
    id: "loc-2",
    mainTitle: "Grand Reception Venue",
    subLabel: "Grand Reception Hall",
    venuePhoto: "/images/templates/venue-reception.jpg",
    address: "Your Full Address, City, State 000000",
    mapUrl: "https://maps.google.com",
  },
];

export const BIRTHDAY_DEFAULT_LOCATIONS: VenueLocationItem[] = [
  {
    id: "loc-1",
    mainTitle: "Birthday Celebration Venue",
    subLabel: "Celebration Hall & Lawn",
    venuePhoto: "/images/templates/venue-reception.jpg",
    address: "Your Full Address, City, State 000000",
    mapUrl: "https://maps.google.com",
  },
];

export const WEDDING_DEFAULT_FUNCTIONS: EventSubFunction[] = [
  { icon: "ring", title: "Sacred Marriage Vows", date: "", time: "10:30", venue: "Marriage Ceremony Hall" },
  { icon: "sparkles", title: "Grand Reception", date: "", time: "19:00", venue: "Grand Ballroom" },
];

export const BIRTHDAY_DEFAULT_FUNCTIONS: EventSubFunction[] = [
  { icon: "cocktail", title: "Welcome Drinks & Mocktails", date: "", time: "18:00", venue: "Celebration Hall" },
  { icon: "cake", title: "Cake Cutting & Cheers", date: "", time: "19:30", venue: "Main Party Area" },
  { icon: "feast", title: "Grand Birthday Dinner", date: "", time: "20:30", venue: "Banquet Lawn" },
  { icon: "music", title: "DJ & Dance Party", date: "", time: "21:30", venue: "Party Floor" },
];

export const WEDDING_DEFAULT_TIMELINE: DayTimelineItem[] = [
  { icon: "ring", title: "Sacred Marriage Vows", date: "", time: "10:30" },
  { icon: "feast", title: "Traditional Lunch", date: "", time: "13:00" },
  { icon: "home", title: "Welcome at Home", date: "", time: "16:00" },
  { icon: "sparkles", title: "Grand Reception", date: "", time: "19:00" },
  { icon: "cake", title: "Cake Cutting Ceremony", date: "", time: "20:00" },
  { icon: "cocktail", title: "Gala Dinner", date: "", time: "20:30" },
  { icon: "car", title: "Send Off & Blessings", date: "", time: "22:30" },
];

export const BIRTHDAY_DEFAULT_TIMELINE: DayTimelineItem[] = [
  { icon: "cocktail", title: "Welcome Drinks & Mocktails", date: "", time: "18:00" },
  { icon: "sparkles", title: "Fun Games & Photobooth", date: "", time: "18:30" },
  { icon: "cake", title: "Cake Cutting & Cheers", date: "", time: "19:30" },
  { icon: "feast", title: "Artisanal Dinner", date: "", time: "20:30" },
  { icon: "music", title: "DJ & Dance Floor", date: "", time: "21:30" },
];

const initialDraft: DraftData = {
  eventType: "WEDDING",
  showVideo: true,
  customSlug: "",
  hostNameOne: "",
  hostNameTwo: "",
  coupleInitials: "",
  eventTitle: "",
  inviteLine: "Together with their families, request the pleasure of your company at the celebration of their wedding",
  eventDate: "",
  eventTime: "",
  venueName: "Marriage Ceremony Hall",
  venueAddress: "Your Full Address, City, State 000000",
  venueMapUrl: "https://maps.google.com",
  venueTwoName: "Grand Reception Hall",
  venueTwoAddress: "Your Full Address, City, State 000000",
  venueTwoMapUrl: "https://maps.google.com",
  locations: WEDDING_DEFAULT_LOCATIONS,
  tagline: "",
  turningAge: "",
  dressCode: "Traditional / Cocktail Attire",
  rsvpContact: "",
  loveStoryText: "",
  loveStoryVideoUrl: "",
  coverImage: "",
  coupleImage: "",
  partnerTwoImage: "",
  venueImage: "",
  galleryImages: [],
  functions: WEDDING_DEFAULT_FUNCTIONS,
  timelineItems: WEDDING_DEFAULT_TIMELINE,
  additionalNotes: "",
  extractedFromDoc: false,
  completedFields: [],
  currentStep: 1,
};

const STEP_TITLES: Record<number, string> = {
  1: "Select Celebration Type",
  2: "Who Is Being Celebrated?",
  3: "Main Date, Time & Invitation Message",
  4: "Venue Locations & Maps",
  5: "Event Schedule & Functions",
  6: "Day Timeline",
  7: "Bride, Groom & Gallery Photos",
  8: "Love Story, Video, Dress Code & RSVP",
  9: "Review All Details",
};

const getStepTitle = (step: number, eventType?: string): string => {
  const isBirthday = eventType?.toUpperCase() === "BIRTHDAY";
  if (isBirthday) {
    switch (step) {
      case 1:
        return "Select Celebration Type";
      case 2:
        return "Birthday Person Details";
      case 3:
        return "Event Date, Time & Invitation Message";
      case 4:
        return "Party Venue & Maps";
      case 5:
        return "Event Schedule & Activities";
      case 6:
        return "Party Timeline";
      case 7:
        return "Celebrant & Gallery Photos";
      case 8:
        return "Celebration Story, Dress Code & RSVP";
      case 9:
        return "Review All Details";
      default:
        return STEP_TITLES[step] || "";
    }
  }
  return STEP_TITLES[step] || "";
};

const calculateMonogram = (name1: string, name2: string): string => {
  const c1 = name1.trim() ? name1.trim()[0].toUpperCase() : "";
  const c2 = name2.trim() ? name2.trim()[0].toUpperCase() : "";
  if (c1 && c2) return `${c1} & ${c2}`;
  if (c1) return c1;
  if (c2) return c2;
  return "";
};

const getAutoVenueForFunction = (
  title: string,
  icon: string,
  time: string,
  locations: VenueLocationItem[],
  defaultVenueName: string
): string => {
  const isEvening =
    (time && parseInt(time.split(":")[0], 10) >= 17) ||
    icon === "sparkles" ||
    icon === "cocktail" ||
    title.toLowerCase().includes("reception") ||
    title.toLowerCase().includes("gala") ||
    title.toLowerCase().includes("dinner");

  if (isEvening && locations && locations.length > 1) {
    return locations[1].subLabel || locations[1].mainTitle || defaultVenueName || "Grand Reception Hall";
  }

  if (locations && locations.length > 0 && locations[0]) {
    return locations[0].subLabel || locations[0].mainTitle || defaultVenueName || "Marriage Ceremony Hall";
  }

  return defaultVenueName || "Main Ceremony Hall";
};

function getStepStatus(stepNum: number, draft: DraftData) {
  const missing: string[] = [];
  if (stepNum === 1) {
    if (!draft.eventType) missing.push("Celebration Type");
  } else if (stepNum === 2) {
    if (!draft.hostNameOne || !draft.hostNameOne.trim()) missing.push("Host/Partner #1 Name");
  } else if (stepNum === 3) {
    if (!draft.eventDate) missing.push("Event Date");
    if (!draft.eventTime) missing.push("Event Time");
  } else if (stepNum === 4) {
    const primaryName =
      draft.venueName?.trim() ||
      (draft.locations && draft.locations.length > 0
        ? (draft.locations[0] as unknown as Record<string, string>)?.mainTitle?.trim() || (draft.locations[0] as unknown as Record<string, string>)?.name?.trim() || (draft.locations[0] as unknown as Record<string, string>)?.venueLabel?.trim()
        : "");

    const primaryAddress =
      draft.venueAddress?.trim() ||
      (draft.locations && draft.locations.length > 0
        ? (draft.locations[0] as unknown as Record<string, string>)?.address?.trim() || (draft.locations[0] as unknown as Record<string, string>)?.subLabel?.trim()
        : "");

    if (!primaryName) missing.push("Venue Name");
    if (!primaryAddress) missing.push("Venue Address");
  } else if (stepNum === 8) {
    if (!draft.rsvpContact || !draft.rsvpContact.trim()) missing.push("RSVP Contact Phone");
  }

  const isPending = missing.length > 0;
  const isComplete = !isPending;
  return {
    stepNum,
    isComplete,
    isPending,
    missing,
    summary: missing.join(" & "),
  };
}

const ICON_OPTIONS = [
  { id: "ring", label: "💍 Sacred Vows / Ceremony", emoji: "💍" },
  { id: "feast", label: "🍲 Traditional Lunch / Feast", emoji: "🍲" },
  { id: "home", label: "🏡 Welcome at Home", emoji: "🏡" },
  { id: "sparkles", label: "✨ Grand Reception", emoji: "✨" },
  { id: "cake", label: "🎂 Cake Cutting Ceremony", emoji: "🎂" },
  { id: "cocktail", label: "🍸 Gala Dinner & Drinks", emoji: "🍸" },
  { id: "car", label: "🚗 Send Off & Blessings", emoji: "🚗" },
  { id: "music", label: "🎵 Music / Sangeet", emoji: "🎵" },
  { id: "flower", label: "🌸 Haldi / Mehendi", emoji: "🌸" },
];

const formatDatePill = (dateStr: string) => {
  if (!dateStr) return "Nov 28, 2026";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

const formatTimePill = (timeStr: string) => {
  if (!timeStr) return "10:30 AM IST";
  try {
    const [h, m] = timeStr.split(":");
    const hours = parseInt(h, 10);
    if (isNaN(hours)) return timeStr;
    const ampm = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 || 12;
    return `${h12.toString().padStart(2, "0")}:${m} ${ampm} IST`;
  } catch {
    return timeStr;
  }
};

interface QuickStartDetailsWizardProps {
  profileId?: string;
  invitationId?: string;
  isNewProfile?: boolean;
  initialEventType?: string;
  onClose?: () => void;
  onComplete?: () => void;
  startAtStepOne?: boolean;
}

export default function QuickStartDetailsWizard({
  profileId,
  invitationId,
  isNewProfile,
  initialEventType,
  onClose,
  onComplete,
  startAtStepOne = true,
}: QuickStartDetailsWizardProps = {}) {
  const { status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const couplePhotoInputRef = useRef<HTMLInputElement>(null);
  const partnerTwoPhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryPhotoInputRef = useRef<HTMLInputElement>(null);

  const [activeLocationIndex, setActiveLocationIndex] = useState<number>(0);
  const [activeFunctionIndex, setActiveFunctionIndex] = useState<number>(0);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState<number>(0);
  const [draft, setDraft] = useState<DraftData>(initialDraft);
  const [extracting, setExtracting] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(true);
  const [hasExistingSavedProfile, setHasExistingSavedProfile] = useState(false);
  const [isEditingLandingProfile, setIsEditingLandingProfile] = useState(false);
  const [isLockedState, setIsLockedState] = useState(false);
  const [lockReasonState, setLockReasonState] = useState("");
  const [isRedirectedFromTemplates, setIsRedirectedFromTemplates] = useState(false);
  const isDedicatedInvitationForm = Boolean(invitationId || draft.invitationId);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const slugDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCustomSlugChange = (val: string) => {
    const formatted = val.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    setDraft((prev) => ({ ...prev, customSlug: formatted }));

    if (slugDebounceTimerRef.current) clearTimeout(slugDebounceTimerRef.current);

    if (!formatted.trim()) {
      setSlugStatus("idle");
      return;
    }

    setSlugStatus("checking");
    slugDebounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/invitations/check-slug?slug=${encodeURIComponent(formatted)}&invitationId=${invitationId || draft.invitationId || ""}`);
        const data = await res.json();
        if (data.available) {
          setSlugStatus("available");
        } else {
          setSlugStatus("taken");
        }
      } catch {
        setSlugStatus("idle");
      }
    }, 400);
  };

  const [existingProfiles, setExistingProfiles] = useState<{ id: string; eventType?: string }[]>([]);
  const [alertMessage, setAlertMessage] = useState<{
    type: "error" | "success";
    title: string;
    description: string;
  } | null>(null);

  // Auto-scroll & catch banner if redirected from templates or accessing #details-form
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    const isRedirected =
      searchParams.get("redirectFromTemplates") === "true" ||
      searchParams.get("fromTemplates") === "true" ||
      window.location.hash.includes("details-form");

    if (isRedirected) {
      const timer = setTimeout(() => {
        setIsRedirectedFromTemplates(true);
        const el = document.getElementById("details-form");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, []);

  // Load saved draft on mount (API or localStorage resume)
  useEffect(() => {
    async function loadSavedDraft() {
      try {
        let profileFound = false;

        // Restore from form-isolated localStorage key first so state NEVER leaks across different invitation forms!
        const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
        const paramInvId = invitationId || searchParams?.get("invitationId") || "";
        const paramProfId = profileId || searchParams?.get("id") || "";

        if (status === "authenticated") {
          try {
            const allRes = await fetch("/api/user/event-draft?all=true");
            const allData = await allRes.json();
            if (allData.success && Array.isArray(allData.profiles)) {
              setExistingProfiles(allData.profiles);
              if (isNewProfile || !profileId) {
                const hasWedding = allData.profiles.some((p: { eventType?: string }) => !p.eventType || p.eventType.toUpperCase() === "WEDDING");
                const hasBirthday = allData.profiles.some((p: { eventType?: string }) => p.eventType && p.eventType.toUpperCase() === "BIRTHDAY");
                if (hasWedding && !hasBirthday) {
                  setDraft((prev) => ({
                    ...prev,
                    eventType: "BIRTHDAY",
                    venueName: "Birthday Celebration Venue",
                    locations: BIRTHDAY_DEFAULT_LOCATIONS,
                    functions: BIRTHDAY_DEFAULT_FUNCTIONS,
                    timelineItems: BIRTHDAY_DEFAULT_TIMELINE,
                    dressCode: "Smart Casual / Party Chic",
                    inviteLine: "Join us in celebrating this special birthday with an evening of music, delicious dining, and great company!",
                  }));
                } else if (hasBirthday && !hasWedding) {
                  setDraft((prev) => ({
                    ...prev,
                    eventType: "WEDDING",
                    venueName: "Marriage Ceremony Hall",
                    locations: WEDDING_DEFAULT_LOCATIONS,
                    functions: WEDDING_DEFAULT_FUNCTIONS,
                    timelineItems: WEDDING_DEFAULT_TIMELINE,
                    dressCode: "Traditional / Cocktail Attire",
                    inviteLine: "Together with their families, request the pleasure of your company at the celebration of their wedding",
                  }));
                }
              }
            }
          } catch {}
        }

        const formLocalStorageKey = paramInvId
          ? `bervic_invitation_draft_${paramInvId}`
          : paramProfId
          ? `bervic_profile_draft_${paramProfId}`
          : `bervic_quick_start_draft`;

        const localSaved = typeof window !== "undefined"
          ? localStorage.getItem(formLocalStorageKey) || (!paramInvId && !paramProfId ? localStorage.getItem("bervic_user_draft_details") : null)
          : null;
        let localParsed: Partial<DraftData> | null = null;

        if (localSaved) {
          try {
            localParsed = JSON.parse(localSaved);
            if (localParsed && (localParsed.hostNameOne || localParsed.eventDate || localParsed.venueName || localParsed.rsvpContact)) {
              setDraft((prev) => {
                const merged = { ...prev, ...localParsed };
                return {
                  ...merged,
                  coupleInitials: merged.coupleInitials || calculateMonogram(merged.hostNameOne, merged.hostNameTwo),
                };
              });
            }
          } catch {
            localParsed = null;
          }
        }

        if (status === "authenticated" && !isNewProfile) {
          const eventTypeSearch = searchParams?.get("eventType") || initialEventType;
          const endpoint = invitationId
            ? `/api/user/event-draft?invitationId=${invitationId}`
            : profileId
            ? `/api/user/event-draft?id=${profileId}`
            : eventTypeSearch
            ? `/api/user/event-draft?eventType=${eventTypeSearch}`
            : "/api/user/event-draft";
          const res = await fetch(endpoint);
          const data = await res.json();
          if (data.success && data.draft) {
            profileFound = true;
            const apiDraft = data.draft;

            if (apiDraft.isLocked) {
              setIsLockedState(true);
              setLockReasonState(apiDraft.lockReason || "Editing for this invitation is locked starting 2 hours before your event date to protect invitation data.");
            } else {
              setIsLockedState(false);
              setLockReasonState("");
            }

            let completedList: string[] = [];
            let parsedGallery: string[] = [];
            let parsedFunctions: EventSubFunction[] | null = null;
            let parsedLocations: VenueLocationItem[] | null = null;
            let parsedTimeline: DayTimelineItem[] | null = null;

            try {
              completedList = JSON.parse(apiDraft.completedFields || "[]");
            } catch {
              completedList = [];
            }

            if (apiDraft.galleryImagesJson) {
              try {
                parsedGallery = JSON.parse(apiDraft.galleryImagesJson);
              } catch {
                parsedGallery = [];
              }
            }

            if (apiDraft.functionsJson) {
              try {
                const raw = JSON.parse(apiDraft.functionsJson);
                if (Array.isArray(raw)) parsedFunctions = raw;
              } catch {
                parsedFunctions = null;
              }
            }

            if (apiDraft.dayTimelineJson) {
              try {
                const raw = JSON.parse(apiDraft.dayTimelineJson);
                if (Array.isArray(raw)) parsedTimeline = raw;
              } catch {
                parsedTimeline = null;
              }
            }

            if (apiDraft.locationsJson) {
              try {
                const raw = JSON.parse(apiDraft.locationsJson);
                if (Array.isArray(raw)) parsedLocations = raw;
              } catch {
                parsedLocations = null;
              }
            }

            const h1 = apiDraft.hostNameOne || localParsed?.hostNameOne || "";
            const h2 = apiDraft.hostNameTwo || localParsed?.hostNameTwo || "";

            setDraft((prevDraft) => ({
              id: apiDraft.id,
              eventType: apiDraft.eventType || localParsed?.eventType || "WEDDING",
              hostNameOne: h1,
              hostNameTwo: h2,
              coupleInitials: apiDraft.coupleInitials || calculateMonogram(h1, h2),
              eventTitle: apiDraft.eventTitle || localParsed?.eventTitle || "",
              inviteLine: apiDraft.inviteLine || localParsed?.inviteLine || "Together with their families, request the pleasure of your company...",
              eventDate: apiDraft.eventDate || localParsed?.eventDate || "",
              eventTime: apiDraft.eventTime || localParsed?.eventTime || "",
              venueName: apiDraft.venueName || localParsed?.venueName || "",
              venueAddress: apiDraft.venueAddress || localParsed?.venueAddress || "",
              venueMapUrl: apiDraft.venueMapUrl || localParsed?.venueMapUrl || "",
              venueTwoName: apiDraft.venueTwoName || localParsed?.venueTwoName || "",
              venueTwoAddress: apiDraft.venueTwoAddress || localParsed?.venueTwoAddress || "",
              venueTwoMapUrl: apiDraft.venueTwoMapUrl || localParsed?.venueTwoMapUrl || "",
              locations: parsedLocations !== null ? parsedLocations : (localParsed?.locations || initialDraft.locations),
              tagline: apiDraft.tagline || localParsed?.tagline || "",
              turningAge: apiDraft.turningAge || localParsed?.turningAge || "",
              dressCode: apiDraft.dressCode || localParsed?.dressCode || "",
              rsvpContact: apiDraft.rsvpContact || localParsed?.rsvpContact || "",
              loveStoryText: apiDraft.loveStoryText || localParsed?.loveStoryText || "",
              loveStoryVideoUrl: apiDraft.loveStoryVideoUrl || localParsed?.loveStoryVideoUrl || "",
              showVideo: apiDraft.showVideo !== undefined ? Boolean(apiDraft.showVideo) : localParsed?.showVideo !== undefined ? Boolean(localParsed?.showVideo) : true,
              coverImage: apiDraft.coverImage || localParsed?.coverImage || "",
              coupleImage: apiDraft.coupleImage || localParsed?.coupleImage || "",
              partnerTwoImage: apiDraft.partnerTwoImage || localParsed?.partnerTwoImage || "",
              venueImage: apiDraft.venueImage || localParsed?.venueImage || "",
              galleryImages: parsedGallery.length > 0 ? parsedGallery : (localParsed?.galleryImages || []),
              functions: parsedFunctions !== null ? parsedFunctions : (localParsed?.functions || initialDraft.functions),
              timelineItems: parsedTimeline !== null ? parsedTimeline : (localParsed?.timelineItems || initialDraft.timelineItems),
              additionalNotes: apiDraft.additionalNotes || localParsed?.additionalNotes || "",
              extractedFromDoc: Boolean(apiDraft.extractedFromDoc),
              completedFields: completedList,
              currentStep: prevDraft.currentStep > 1 ? prevDraft.currentStep : (apiDraft.currentStep || localParsed?.currentStep || 1),
            }));
          } else if (!data.draft) {
            profileFound = false;
          }
        }

        setHasExistingSavedProfile(profileFound);
      } catch (err) {
        console.error("Failed to load draft:", err);
      } finally {
        setIsLoadingDraft(false);
      }
    }

    loadSavedDraft();
  }, [status, profileId, isNewProfile, startAtStepOne]);

  // Continuously persist draft to localStorage so navigation never loses typing progress
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bervic_quick_start_draft", JSON.stringify(draft));
      localStorage.setItem("bervic_user_draft_details", JSON.stringify(draft));
    }
  }, [draft]);

  // Calculate accurate progress percentage based on 9 wizard steps completion
  const calculateProgress = () => {
    let completedSteps = 0;
    if (draft.eventType) completedSteps++;
    if (draft.hostNameOne?.trim()) completedSteps++;
    if (draft.eventDate?.trim()) completedSteps++;
    if (draft.venueName?.trim()) completedSteps++;
    if (draft.functions && draft.functions.length > 0) completedSteps++;
    if (draft.loveStoryText?.trim() || draft.loveStoryVideoUrl?.trim() || draft.currentStep > 6) completedSteps++;
    if (draft.coverImage || draft.coupleImage || (draft.galleryImages && draft.galleryImages.length > 0) || draft.currentStep > 7) completedSteps++;
    if (draft.rsvpContact?.trim() || draft.dressCode?.trim()) completedSteps++;
    if (draft.currentStep === 9) completedSteps++;

    return Math.min(100, Math.max(11, Math.round((completedSteps / 9) * 100)));
  };

  // Explicit save function for second / new profile creation
  const saveProfileToDb = async (draftToSave: DraftData) => {
    if (isLockedState) {
      setAlertMessage({
        type: "error",
        title: "Editing Locked",
        description: lockReasonState || "Editing for this invitation is locked starting 2 hours before your event date.",
      });
      return;
    }
    setIsSavingProfile(true);
    const filledKeys: string[] = [];
    Object.keys(draftToSave).forEach((k) => {
      const val = draftToSave[k as keyof DraftData];
      if (typeof val === "string" && val.trim().length > 0) {
        filledKeys.push(k);
      }
    });

    if (draftToSave.showVideo === false) {
      filledKeys.push("showVideo:false");
    } else {
      filledKeys.push("showVideo:true");
    }

    const payload = {
      ...draftToSave,
      invitationId,
      isInvitationInstance: Boolean(invitationId),
      loveStoryVideoUrl: draftToSave.showVideo === false ? "" : draftToSave.loveStoryVideoUrl,
      completedFields: filledKeys,
      isNewProfile: Boolean(isNewProfile && !draftToSave.id && !invitationId),
    };

    if (status === "authenticated") {
      try {
        const res = await fetch("/api/user/event-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.draft?.id) {
          setDraft((prev) => ({ ...prev, id: data.draft.id }));
          setProfileHasDetailsCache(true);
        } else if (data.error === "SUBSCRIPTION_REQUIRED" || data.error === "PROFILE_LIMIT_REACHED") {
          alert(data.message || "An active subscription plan is required to create multiple celebration profiles. Please upgrade to unlock multiple event profiles.");
          router.push("/checkout");
        }
      } catch (err) {
        console.error("Save profile error:", err);
      } finally {
        setIsSavingProfile(false);
      }
    }
  };

  const handleInPlaceSave = async () => {
    setIsSavingProfile(true);
    try {
      await saveProfileToDb(draft);
      setIsSaveSuccess(true);
      setTimeout(() => setIsSaveSuccess(false), 2500);
    } catch (err) {
      console.error("In-place save error:", err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Close / Exit button handler with unsaved changes check
  const handleCloseClick = () => {
    const hasUnsavedContent = Boolean(
      isNewProfile &&
        !draft.id &&
        (draft.hostNameOne.trim() ||
          draft.hostNameTwo.trim() ||
          draft.eventDate.trim() ||
          draft.venueName.trim() ||
          draft.rsvpContact.trim())
    );

    if (hasUnsavedContent) {
      setShowUnsavedModal(true);
    } else {
      if (onClose) onClose();
      else if (onComplete) onComplete();
      else router.push("/dashboard");
    }
  };

  // Save current step data to local state (and auto-save to DB ONLY for existing profiles with id)
  const saveStepData = async (updatedDraft: DraftData, stepNumber: number) => {
    const filledKeys: string[] = [];
    Object.keys(updatedDraft).forEach((k) => {
      const val = updatedDraft[k as keyof DraftData];
      if (typeof val === "string" && val.trim().length > 0) {
        filledKeys.push(k);
      }
    });

    if (updatedDraft.showVideo === false) {
      filledKeys.push("showVideo:false");
    } else {
      filledKeys.push("showVideo:true");
    }

    const newDraftState = {
      ...updatedDraft,
      loveStoryVideoUrl: updatedDraft.showVideo === false ? "" : updatedDraft.loveStoryVideoUrl,
      completedFields: filledKeys,
      currentStep: stepNumber,
    };

    setDraft(newDraftState);

    // Save to form-isolated localStorage key after every step transition so state NEVER leaks across different invitation forms!
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const paramInvId = updatedDraft.invitationId || invitationId || searchParams.get("invitationId") || "";
      const paramProfId = updatedDraft.id || profileId || searchParams.get("id") || "";

      const key = paramInvId
        ? `bervic_invitation_draft_${paramInvId}`
        : paramProfId
        ? `bervic_profile_draft_${paramProfId}`
        : `bervic_quick_start_draft`;

      localStorage.setItem(key, JSON.stringify(newDraftState));
      if (!paramInvId && !paramProfId) {
        localStorage.setItem("bervic_user_draft_details", JSON.stringify(newDraftState));
      }
    }

    // Auto-save to DB ONLY for existing profiles with a valid DB id
    if (updatedDraft.id && status === "authenticated") {
      try {
        const res = await fetch("/api/user/event-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDraftState),
        });
        const data = await res.json();
        if (data.success && data.draft?.id) {
          setDraft((prev) => ({ ...prev, id: data.draft.id }));
        }
      } catch (err) {
        console.error("Auto-save error:", err);
      }
    }
  };

  // Document/Image Auto-Extraction Handler
  const handleFileUpload = async (file: File) => {
    setExtracting(true);
    setAlertMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/user/event-draft/extract", {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(25000),
      });

      const data = await res.json();

      if (data.isIrrelevant || !data.success) {
        setAlertMessage({
          type: "error",
          title: "Irrelevant File Uploaded",
          description:
            data.message ||
            "The uploaded file does not appear to contain valid invitation details. Please upload a valid invitation card image or document, or fill out your details using the form below.",
        });
        return;
      }

      const ext = data.extractedData || {};
      const extractedDate = ext.eventDate || draft.eventDate;
      const extractedTime = ext.eventTime || draft.eventTime;
      const extractedVenue = ext.venueName || draft.venueName;
      const extractedAddress = ext.venueAddress || draft.venueAddress;

      const updatedFunctions = draft.functions.map((fn) => ({
        ...fn,
        date: fn.date || extractedDate || "",
        venue: fn.venue || extractedVenue || "",
      }));

      let parsedLocations: VenueLocationItem[] | null = null;
      if (ext.locationsJson) {
        try {
          const raw = JSON.parse(ext.locationsJson);
          if (Array.isArray(raw)) parsedLocations = raw;
        } catch {
          parsedLocations = null;
        }
      }

      const updatedLocations: VenueLocationItem[] = parsedLocations || (draft.locations && draft.locations.length > 0
        ? draft.locations.map((loc, idx) => {
            if (idx === 0) {
              return {
                ...loc,
                mainTitle: loc.mainTitle || "Marriage Ceremony Venue",
                subLabel: extractedVenue || loc.subLabel || "",
                address: extractedAddress || extractedVenue || loc.address || "",
              };
            }
            return loc;
          })
        : [
            {
              id: "loc-1",
              mainTitle: "Marriage Ceremony Venue",
              subLabel: extractedVenue || "",
              venuePhoto: "/images/templates/venue-ceremony.jpg",
              address: extractedAddress || "",
              mapUrl: "https://maps.google.com",
            },
          ]);

      const h1 = ext.hostNameOne || "";
      const h2 = ext.hostNameTwo || "";
      const updatedInitials = (h1 && h2)
        ? `${h1[0].toUpperCase()} & ${h2[0].toUpperCase()}`
        : (h1 ? `${h1[0].toUpperCase()}` : (h2 ? `${h2[0].toUpperCase()}` : ""));

      const updatedDraft: DraftData = {
        ...draft,
        eventType: ext.eventType || draft.eventType,
        hostNameOne: h1 || draft.hostNameOne,
        hostNameTwo: h2 || draft.hostNameTwo,
        coupleInitials: updatedInitials || draft.coupleInitials,
        eventTitle: ext.eventTitle || (h1 && h2 ? `${h1} & ${h2}'s Wedding` : draft.eventTitle),
        eventDate: ext.eventDate || draft.eventDate,
        eventTime: ext.eventTime || draft.eventTime,
        venueName: ext.venueName || draft.venueName,
        venueAddress: ext.venueAddress || draft.venueAddress,
        locations: updatedLocations,
        rsvpContact: ext.rsvpContact || draft.rsvpContact,
        functions: updatedFunctions,
        extractedFromDoc: true,
      };

      await saveStepData(updatedDraft, 2);

      setAlertMessage({
        type: "success",
        title: "Details Extracted Successfully!",
        description: `We extracted ${data.extractedCount || 5} event fields from "${file.name}". Complete any remaining fields below.`,
      });
    } catch (err) {
      console.error("Extraction error:", err);
      setAlertMessage({
        type: "error",
        title: "Extraction Error",
        description: "Failed to read file details. Please enter your details in the form below.",
      });
    } finally {
      setExtracting(false);
    }
  };

  // Single Photo Upload Handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: "coverImage" | "coupleImage" | "partnerTwoImage" | "venueImage") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        const updated = { ...draft, [fieldKey]: data.url };
        await saveStepData(updated, draft.currentStep);
      }
    } catch (err) {
      console.error("Photo upload error:", err);
    }
  };

  // Multiple Gallery Photos Upload Handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
      } catch (err) {
        console.error("Gallery upload error:", err);
      }
    }

    if (uploadedUrls.length > 0) {
      const updated = {
        ...draft,
        galleryImages: [...draft.galleryImages, ...uploadedUrls],
      };
      await saveStepData(updated, draft.currentStep);
    }
  };

  const addFunction = () => {
    const defaultTime = "10:30";
    const defaultTitle = `Function #${draft.functions.length + 1}`;
    const autoVenue = getAutoVenueForFunction(defaultTitle, "ring", defaultTime, draft.locations, draft.venueName);

    const newFunctions = [
      ...draft.functions,
      {
        icon: "ring",
        title: defaultTitle,
        date: draft.eventDate || "",
        time: defaultTime,
        venue: autoVenue,
      },
    ];
    setDraft({ ...draft, functions: newFunctions });
    setActiveFunctionIndex(newFunctions.length - 1);
  };

  const removeFunction = (index: number) => {
    const updated = {
      ...draft,
      functions: draft.functions.filter((_, i) => i !== index),
    };
    setDraft(updated);
    setActiveFunctionIndex(Math.max(0, index - 1));
  };

  const updateFunction = (index: number, field: keyof EventSubFunction, value: string) => {
    const newFunctions = [...draft.functions];
    const updatedItem = { ...newFunctions[index], [field]: value };

    // Auto-fetch venue as time or icon or title is selected if venue is empty or matching previous auto venue
    if (field === "time" || field === "title" || field === "icon") {
      if (!updatedItem.venue || updatedItem.venue.trim() === "") {
        updatedItem.venue = getAutoVenueForFunction(
          updatedItem.title,
          updatedItem.icon || "",
          updatedItem.time,
          draft.locations,
          draft.venueName
        );
      }
    }

    newFunctions[index] = updatedItem;
    setDraft({ ...draft, functions: newFunctions });
  };

  const addTimelineItem = () => {
    setDraft((prev) => ({
      ...prev,
      timelineItems: [
        ...(prev.timelineItems || []),
        {
          icon: "sparkles",
          title: `Activity #${(prev.timelineItems || []).length + 1}`,
          date: prev.eventDate || "",
          time: "12:00",
        },
      ],
    }));
  };

  const updateTimelineItem = (index: number, field: keyof DayTimelineItem, value: string) => {
    setDraft((prev) => {
      const updated = [...(prev.timelineItems || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, timelineItems: updated };
    });
  };

  const removeTimelineItem = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      timelineItems: (prev.timelineItems || []).filter((_, i) => i !== index),
    }));
  };

  const nextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = Math.min(draft.currentStep + 1, 9);
    saveStepData(draft, target);
  };

  const prevStep = () => {
    const target = Math.max(draft.currentStep - 1, 1);
    saveStepData(draft, target);
  };

  const handleFinalSubmit = async () => {
    localStorage.setItem("bervic_prefill_data", JSON.stringify(draft));
    await saveProfileToDb(draft);
    if (onComplete) {
      onComplete();
    } else {
      router.push("/templates");
    }
  };

  const progressPercent = calculateProgress();

  if (isLoadingDraft) {
    return (
      <section className="py-12 bg-white text-slate-900 border-b border-slate-200">
        <WizardDetailsSkeleton />
      </section>
    );
  }

  const isLandingPageWithProfile = Boolean(
    hasExistingSavedProfile && !isNewProfile && !profileId && !onClose && !isEditingLandingProfile
  );

  if (isLandingPageWithProfile) {
    return (
      <section className="py-16 md:py-24 bg-white text-slate-900 relative border-t border-b border-slate-100 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          {/* Catchy Headline */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 leading-tight">
              Ready to Design Your <span className="italic text-[#991B1B]">Dream Invitation</span>?
            </h2>
          </div>

          {/* Multi-Device Luxury Showcase Image */}
          <div className="relative max-w-4xl mx-auto py-2">
            <NextImage
              src="/images/multidevice-showcase.png"
              alt="Luxury Invitation Website Multi-Device Showcase (Desktop, Laptop, Tablet, Mobile)"
              width={1200}
              height={800}
              priority
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Active Saved Profile Badge Card */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-900 shadow-xs">
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#991B1B] to-[#7F1D1D] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0 shadow-xs">
                {draft.coupleInitials || "S & A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#991B1B] text-sm truncate">
                  {draft.hostNameOne || "Celebration Details"} {draft.hostNameTwo ? `& ${draft.hostNameTwo}` : ""}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {draft.eventDate ? `Date: ${draft.eventDate}` : "Details saved to account"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-200/80 pt-2.5 sm:pt-0">
              <button
                type="button"
                onClick={() => setIsEditingLandingProfile(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-[#991B1B] hover:text-[#7F1D1D] font-bold text-xs border border-slate-200 hover:border-red-200 transition-all shadow-xs cursor-pointer flex-1 sm:flex-none"
                title="Edit Celebration Details"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
              <span className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold uppercase shrink-0 flex items-center gap-1">
                ✓ Profile Saved
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 max-w-lg mx-auto w-full">
            <button
              type="button"
              onClick={() => router.push("/templates")}
              className="w-full sm:w-auto flex-1 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-red-900/25 transition-all cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Choose Template &amp; Build Website →</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#991B1B] font-bold text-xs sm:text-sm border border-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4 text-[#991B1B]" />
              <span>Go to Dashboard</span>
            </button>
          </div>

          {/* Bottom note for creating extra profiles */}
          <p className="text-[11px] sm:text-xs text-slate-500 pt-2 font-medium">
            Want to add another event profile or edit current details? Visit your <button type="button" onClick={() => router.push("/dashboard")} className="font-bold text-[#991B1B] underline hover:opacity-80">Private Dashboard</button>.
          </p>
        </div>
      </section>
    );
  }

  if (status !== "authenticated") {
    return (
      <section
        id="details-form"
        className={`text-slate-900 relative scroll-mt-24 ${
          onClose ? "py-2 sm:py-4 bg-transparent" : "py-12 md:py-20 bg-white border-t border-b border-slate-200"
        }`}
      >
        <div className="max-w-[1020px] mx-auto px-4 sm:px-6">
          {/* Header matching Image 2 */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#991B1B] shadow-2xs shrink-0">
              <UploadCloud className="w-5 h-5 text-[#991B1B]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-tight">
                Upload Your Wedding Invitation
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Upload your invitation and our AI will automatically fill your wedding details.
              </p>
            </div>
          </div>

          {/* Luxury Dashed Floral Upload Card matching Image 2 */}
          <div
            onClick={() => setShowLoginModal(true)}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              setShowLoginModal(true);
            }}
            className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 p-8 sm:p-14 text-center cursor-pointer overflow-hidden group shadow-xs ${
              isDragging
                ? "border-[#991B1B] bg-red-50/40 ring-4 ring-red-100"
                : "border-rose-300 hover:border-[#991B1B]/70 bg-gradient-to-b from-white via-rose-50/30 to-white hover:shadow-md"
            }`}
          >
            {/* Top-Right Floral Decorative Art */}
            <div className="absolute top-0 right-0 w-36 sm:w-56 h-36 sm:h-56 pointer-events-none opacity-80 select-none transition-transform duration-500 group-hover:scale-105">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <g fill="none">
                  <circle cx="170" cy="45" r="28" fill="#FFE4E6" opacity="0.8" />
                  <circle cx="170" cy="45" r="20" fill="#FECDD3" opacity="0.9" />
                  <circle cx="170" cy="45" r="8" fill="#BE123C" opacity="0.6" />
                  <circle cx="130" cy="70" r="18" fill="#FFF1F2" opacity="0.85" />
                  <circle cx="130" cy="70" r="12" fill="#FECDD3" opacity="0.9" />
                  <circle cx="130" cy="70" r="5" fill="#E11D48" opacity="0.7" />
                  <path d="M145 25 Q160 10 170 30 Q155 45 145 25 Z" fill="#FDA4AF" opacity="0.7" />
                  <path d="M190 30 Q205 45 185 60 Q170 45 190 30 Z" fill="#FDA4AF" opacity="0.7" />
                  <path d="M160 70 Q180 85 160 95 Q145 80 160 70 Z" fill="#FDA4AF" opacity="0.7" />
                  <path d="M110 50 Q125 35 135 55 Q120 70 110 50 Z" fill="#FECDD3" opacity="0.8" />
                  <path d="M180 110 Q150 120 135 150" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M150 125 Q140 115 130 122 Q140 135 150 125 Z" fill="#E2E8F0" opacity="0.8" />
                  <path d="M165 140 Q175 145 170 155 Q160 150 165 140 Z" fill="#E2E8F0" opacity="0.8" />
                </g>
              </svg>
            </div>

            {/* Bottom-Left Floral Decorative Art */}
            <div className="absolute bottom-0 left-0 w-36 sm:w-56 h-36 sm:h-56 pointer-events-none opacity-80 select-none transition-transform duration-500 group-hover:scale-105">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -scale-x-100 -scale-y-100">
                <g fill="none">
                  <circle cx="170" cy="45" r="28" fill="#FFE4E6" opacity="0.8" />
                  <circle cx="170" cy="45" r="20" fill="#FECDD3" opacity="0.9" />
                  <circle cx="170" cy="45" r="8" fill="#BE123C" opacity="0.6" />
                  <circle cx="130" cy="70" r="18" fill="#FFF1F2" opacity="0.85" />
                  <circle cx="130" cy="70" r="12" fill="#FECDD3" opacity="0.9" />
                  <circle cx="130" cy="70" r="5" fill="#E11D48" opacity="0.7" />
                  <path d="M145 25 Q160 10 170 30 Q155 45 145 25 Z" fill="#FDA4AF" opacity="0.7" />
                  <path d="M190 30 Q205 45 185 60 Q170 45 190 30 Z" fill="#FDA4AF" opacity="0.7" />
                  <path d="M110 50 Q125 35 135 55 Q120 70 110 50 Z" fill="#FECDD3" opacity="0.8" />
                  <path d="M180 110 Q150 120 135 150" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M150 125 Q140 115 130 122 Q140 135 150 125 Z" fill="#E2E8F0" opacity="0.8" />
                </g>
              </svg>
            </div>

            {/* Floating Petals Sparkles */}
            <div className="absolute top-1/4 left-1/5 w-3 h-4 rounded-full bg-rose-200/60 rotate-45 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/5 w-2.5 h-3.5 rounded-full bg-rose-200/50 -rotate-12 pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 text-amber-400/70 text-xs pointer-events-none">✦</div>
            <div className="absolute bottom-1/3 left-1/4 text-rose-300/80 text-xs pointer-events-none">✨</div>

            {/* Center Content */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto py-2">
              {/* Circular Upload Cloud Badge */}
              <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-rose-50/90 border border-rose-200 flex items-center justify-center text-[#991B1B] shadow-sm group-hover:scale-105 transition-transform duration-300">
                <UploadCloud className="w-10 sm:w-12 h-10 sm:h-12 text-[#991B1B]" strokeWidth={1.75} />
              </div>

              {/* Title Text */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
                  Drag &amp; Drop Your File Here
                </h3>
              </div>

              {/* Divider: or */}
              <div className="flex items-center gap-3 w-44 opacity-60 my-1">
                <div className="h-[1px] bg-rose-300 flex-1" />
                <span className="text-xs text-rose-900/60 font-medium">or</span>
                <div className="h-[1px] bg-rose-300 flex-1" />
              </div>

              {/* Choose File Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLoginModal(true);
                }}
                className="px-8 py-3 rounded-full bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group-hover:scale-[1.02]"
              >
                <Upload className="w-4 h-4 text-white" />
                <span>Choose File</span>
              </button>

              {/* Format Spec */}
              <p className="text-xs text-slate-500 font-medium pt-0.5">
                JPG, PNG, PDF, DOCX • Max file size 25MB
              </p>

              {/* AI Bottom Pill Banner */}
              <div className="mt-4 pt-2 w-full">
                <div className="bg-rose-50/90 border border-rose-200/80 rounded-full px-4 sm:px-6 py-2.5 flex items-center gap-3 text-left shadow-2xs max-w-xl mx-auto">
                  <div className="w-7 h-7 rounded-full bg-white text-[#991B1B] flex items-center justify-center shrink-0 shadow-2xs border border-rose-100">
                    <Sparkles className="w-3.5 h-3.5 text-[#991B1B]" />
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-700 font-medium leading-tight">
                    Our AI will automatically read names, dates, venues &amp; events from your invitation and fill the form instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reusable Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          callbackUrl="/#details-form"
          title="Sign In to Auto-Fill Details"
          subtitle="Log in or create an account to upload your invitation and let our AI personalize your digital suite."
        />
      </section>
    );
  }

  return (
    <section
      id="details-form"
      className={`text-slate-900 relative scroll-mt-24 ${
        onClose ? "py-2 sm:py-4 bg-transparent" : "py-16 md:py-24 bg-white border-t border-b border-slate-200"
      }`}
    >
      {/* UNSAVED DRAFT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showUnsavedModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#D9A441]/30 space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                <AlertTriangle className="w-7 h-7 text-amber-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  Save New Celebration Profile?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You have unsaved details for <strong>{draft.hostNameOne || "this new event"}</strong>. Would you like to save this profile before exiting?
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isSavingProfile}
                  onClick={async () => {
                    await saveProfileToDb(draft);
                    setShowUnsavedModal(false);
                    if (onComplete) onComplete();
                    else if (onClose) onClose();
                    else router.push("/dashboard");
                  }}
                  className="w-full py-3 rounded-xl bg-[#7E121D] hover:bg-[#680E17] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#FED7AA]" />
                  ) : (
                    <Save className="w-4 h-4 text-[#FED7AA]" />
                  )}
                  <span>{isSavingProfile ? "Saving Profile..." : "Save Profile & Exit"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUnsavedModal(false);
                    localStorage.removeItem("bervic_quick_start_draft");
                    if (onClose) onClose();
                    else if (onComplete) onComplete();
                    else router.push("/dashboard");
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs transition-all cursor-pointer border border-slate-200"
                >
                  Discard & Exit
                </button>

                <button
                  type="button"
                  onClick={() => setShowUnsavedModal(false)}
                  className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Keep Editing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">

        {/* Banner when editing profile from landing page */}
        {isEditingLandingProfile && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-9 h-9 rounded-xl bg-[#991B1B] text-white flex items-center justify-center font-bold text-sm shrink-0">
                <Edit3 className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-slate-900">Editing Celebration Profile Details</h4>
                <p className="text-xs text-slate-600">Update your event details below and save your changes.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingLandingProfile(false)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              Back to Overview
            </button>
          </div>
        )}

        {/* Top Alert Callout Message */}
        <AnimatePresence>
          {alertMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto mb-8"
            >
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 shadow-md ${
                  alertMessage.type === "error"
                    ? "bg-rose-50 border-rose-300 text-rose-900"
                    : "bg-emerald-50 border-emerald-300 text-emerald-900"
                }`}
              >
                {alertMessage.type === "error" ? (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{alertMessage.title}</h4>
                  <p className="text-xs sm:text-sm mt-0.5 leading-relaxed opacity-90">
                    {alertMessage.description}
                  </p>
                </div>
                <button
                  onClick={() => setAlertMessage(null)}
                  className="text-xs font-semibold underline hover:opacity-80"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Catchy Redirect Callout Banner when accessing form for templates */}
        {isRedirectedFromTemplates && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#7A1F2B] via-[#631822] to-[#7A1F2B] text-white border-2 border-[#D9A441]/60 shadow-xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#D9A441]/20 text-[#D9A441] flex items-center justify-center shrink-0 border border-[#D9A441]/50 shadow-inner">
                <Sparkles className="w-6 h-6 text-[#D9A441]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base sm:text-lg text-[#F8F3EA] leading-tight">
                  Please fill in your details below to view your desired template! ✨
                </h4>
                <p className="text-xs sm:text-sm text-[#F8F3EA]/85 mt-0.5 leading-relaxed">
                  Add your event date, host names & venue to unlock live personalized previews across all template designs.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsRedirectedFromTemplates(false)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F8F3EA] transition-colors shrink-0 border border-white/20"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Top Bar Header for Close Action */}
        {onClose && (
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80 bg-white/60 backdrop-blur-xs p-3 rounded-2xl">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold text-[#7E121D] uppercase tracking-wider">
                {invitationId
                  ? draft.eventType?.toUpperCase() === "BIRTHDAY"
                    ? "Edit Birthday Invitation"
                    : "Edit Wedding Invitation"
                  : isNewProfile
                  ? draft.eventType?.toUpperCase() === "BIRTHDAY"
                    ? "Add New Birthday Profile"
                    : "Add New Wedding Profile"
                  : draft.eventType?.toUpperCase() === "BIRTHDAY"
                  ? "Edit Birthday Profile"
                  : "Edit Wedding Profile"}
              </span>

              <span
                className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1 ${
                  draft.eventType?.toUpperCase() === "BIRTHDAY"
                    ? "bg-[#EA580C]"
                    : "bg-[#7A1F2B]"
                }`}
              >
                {draft.eventType?.toUpperCase() === "BIRTHDAY" ? (
                  <>
                    <Cake className="w-3 h-3 fill-current text-white/90" />
                    <span>Birthday Form</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3 h-3 fill-current text-white/90" />
                    <span>Wedding Form</span>
                  </>
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCloseClick}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 shadow-xs"
              title="Close & Return to Dashboard"
            >
              <X className="w-4 h-4 text-slate-500" />
              <span>Close</span>
            </button>
          </div>
        )}

        {/* Locked Details Callout Banner */}
        {isLockedState && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 mb-6 flex items-start gap-3.5 text-rose-950 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm sm:text-base flex items-center gap-2 text-rose-900">
                <span>Event Details Are Locked</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[10px] font-mono uppercase tracking-wider">
                  Locked (2H Pre-Event)
                </span>
              </h4>
              <p className="text-xs sm:text-sm text-rose-800/90 leading-relaxed font-medium">
                {lockReasonState || "Editing for this invitation is locked (starts 2 hours before event date) to protect invitation data and prevent multi-event reuse. Contact Admin to request unlock access."}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {/* Left Column: Smart File Auto-Extractor Upload Box */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between min-h-0 lg:min-h-[480px] relative overflow-hidden">

            <div className="space-y-3 flex-1 flex flex-col pt-1">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#991B1B] text-[10px] font-extrabold uppercase tracking-wider border border-red-200">
                  <Sparkles className="w-3 h-3 text-[#991B1B]" />
                  <span>AI MAGIC AUTO-FILL</span>
                </div>
                <h3 className="text-base font-serif font-bold text-[#0F172A] leading-tight">
                  Have an Invitation Card?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Upload your card image, PDF, or Word doc — our AI will instantly fetch &amp; populate your details into the form below!
                </p>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[120px] sm:min-h-[180px] border-2 border-dashed border-red-200 hover:border-[#991B1B] bg-red-50/20 hover:bg-red-50/50 rounded-2xl p-3.5 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center space-y-2 shadow-xs"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                />

                {extracting ? (
                  <div className="py-2 flex flex-col items-center gap-1.5 text-[#991B1B]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs font-bold animate-pulse">Extracting Details with AI...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#991B1B] to-[#7F1D1D] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-[#0F172A]">Drop Card or PDF Here</p>
                      <p className="text-[10px] text-[#991B1B] font-semibold">⚡ Auto-fills form below</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#991B1B] text-white text-[11px] font-bold shadow-xs group-hover:bg-[#7F1D1D] transition-all flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-white" />
                      <span>Upload Card / Doc</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-[11px] text-slate-600 space-y-0.5 mt-2">
              <div className="flex items-center gap-1 font-bold text-[#0F172A]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Typing Needed!</span>
              </div>
              <p className="leading-tight text-[10.5px]">
                Smart parser reads host names, dates, venues, and schedule functions directly into your profile!
              </p>
            </div>
          </div>

          {/* Right Column: Clean Form Container (Steps 1 to 9) */}
          <div className="lg:col-span-8 bg-transparent sm:bg-white rounded-2xl p-0.5 sm:p-6 border-0 sm:border sm:border-slate-200/80 shadow-none sm:shadow-xs flex flex-col justify-between min-h-0 sm:min-h-[440px]">
            {/* Minimal Step Tracker Header */}
            {(() => {
              const currentStatus = getStepStatus(draft.currentStep, draft);
              const allPendingSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9]
                .map((s) => getStepStatus(s, draft))
                .filter((s) => s.isPending);

              return (
                <div className="space-y-2.5 mb-4 pb-2 border-b border-slate-100">
                  {/* Horizontally Scrollable Step Navigation Pills */}
                  <div className="flex items-center gap-1.5 pb-1 overflow-x-auto no-scrollbar scroll-smooth">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((stepNum) => {
                      const isActive = draft.currentStep === stepNum;
                      const { isComplete, isPending } = getStepStatus(stepNum, draft);

                      return (
                        <button
                          key={stepNum}
                          type="button"
                          onClick={() => saveStepData(draft, stepNum)}
                          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                            isActive
                              ? "bg-[#991B1B] text-white border-[#991B1B] shadow-sm"
                              : isComplete
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                          title={isComplete ? `Step ${stepNum}: Complete` : `Step ${stepNum}: Pending (${getStepStatus(stepNum, draft).summary})`}
                        >
                          {isComplete && !isActive && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                          {isPending && !isActive && (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          )}
                          <span>Step {stepNum}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Minimal Inline Step Title & Minimal Pending Badge */}
                  <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-semibold">
                    <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                      <span className="text-[#991B1B] uppercase tracking-wider font-bold truncate">
                        Step {draft.currentStep} of 9: {getStepTitle(draft.currentStep, draft.eventType)}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full text-white text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 ${
                          draft.eventType?.toUpperCase() === "BIRTHDAY"
                            ? "bg-[#EA580C]"
                            : "bg-[#991B1B]"
                        }`}
                      >
                        {draft.eventType?.toUpperCase() === "BIRTHDAY" ? (
                          <>
                            <Cake className="w-3 h-3 text-white" />
                            <span>Birthday</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-3 h-3 text-white" />
                            <span>Wedding</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Minimal Pending Status Chip */}
                    {currentStatus.isComplete ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide shrink-0">
                        ✓ Complete
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (allPendingSteps.length > 0) {
                            saveStepData(draft, allPendingSteps[0].stepNum);
                          }
                        }}
                        className="px-2.5 py-0.5 rounded-full bg-red-50 hover:bg-red-100 text-[#991B1B] border border-red-200 text-[10px] font-extrabold uppercase tracking-wide shrink-0 transition-colors cursor-pointer"
                        title={allPendingSteps.map((s) => `Step ${s.stepNum} (${s.summary})`).join(", ")}
                      >
                        ⚠️ {allPendingSteps.length} Pending
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Wizard Step Content */}
            <AnimatePresence mode="wait">
              {/* STEP 1: Celebration Type */}
              {draft.currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {(() => {
                    const existingTypes = isNewProfile || !draft.id
                      ? existingProfiles.map((p) => (p.eventType || "WEDDING").toUpperCase())
                      : existingProfiles.filter((p) => p.id !== draft.id).map((p) => (p.eventType || "WEDDING").toUpperCase());

                    const hasExistingWedding = existingTypes.includes("WEDDING");
                    const hasExistingBirthday = existingTypes.includes("BIRTHDAY");

                    const items = [
                      {
                        type: "WEDDING",
                        label: "Wedding",
                        icon: Heart,
                        disabled: (isNewProfile || !draft.id) && hasExistingWedding,
                        badgeText: (isNewProfile || !draft.id) && hasExistingWedding ? "Created" : undefined,
                      },
                      {
                        type: "BIRTHDAY",
                        label: "Birthday",
                        icon: Cake,
                        disabled: (isNewProfile || !draft.id) && hasExistingBirthday,
                        badgeText: (isNewProfile || !draft.id) && hasExistingBirthday ? "Created" : undefined,
                      },
                      { type: "RELIGIOUS", label: "Religious / Home", icon: Home, disabled: true, badgeText: "Soon" },
                      { type: "ANNIVERSARY", label: "Anniversary", icon: Sparkles, disabled: true, badgeText: "Soon" },
                      { type: "PARTY", label: "Party / Gala", icon: PartyPopper, disabled: true, badgeText: "Soon" },
                    ];

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {items.map((item) => {
                          const Icon = item.icon;
                          const isSelected = draft.eventType === item.type;
                          return (
                            <button
                              key={item.type}
                              type="button"
                              disabled={item.disabled}
                              onClick={() => {
                                if (item.disabled) return;
                                const isBirthday = item.type === "BIRTHDAY";
                                const updated: DraftData = {
                                  ...draft,
                                  eventType: item.type,
                                  ...(isBirthday
                                    ? {
                                        venueName: draft.venueName === "Marriage Ceremony Hall" ? "Birthday Celebration Venue" : draft.venueName,
                                        locations: BIRTHDAY_DEFAULT_LOCATIONS,
                                        functions: BIRTHDAY_DEFAULT_FUNCTIONS,
                                        timelineItems: BIRTHDAY_DEFAULT_TIMELINE,
                                        dressCode: draft.dressCode === "Traditional / Cocktail Attire" ? "Smart Casual / Party Chic" : draft.dressCode,
                                        inviteLine: draft.inviteLine?.includes("wedding")
                                          ? "Join us in celebrating this special birthday with an evening of music, delicious dining, and great company!"
                                          : draft.inviteLine,
                                      }
                                    : {
                                        venueName: draft.venueName === "Birthday Celebration Venue" ? "Marriage Ceremony Hall" : draft.venueName,
                                        locations: WEDDING_DEFAULT_LOCATIONS,
                                        functions: WEDDING_DEFAULT_FUNCTIONS,
                                        timelineItems: WEDDING_DEFAULT_TIMELINE,
                                        dressCode: draft.dressCode === "Smart Casual / Party Chic" ? "Traditional / Cocktail Attire" : draft.dressCode,
                                        inviteLine: draft.inviteLine?.includes("birthday")
                                          ? "Together with their families, request the pleasure of your company at the celebration of their wedding"
                                          : draft.inviteLine,
                                      }),
                                };
                                saveStepData(updated, 2);
                              }}
                              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center relative ${
                                item.disabled
                                  ? "bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                                  : isSelected
                                  ? "bg-[#FFF7ED] border-[#EA580C] text-[#EA580C] font-bold shadow-md ring-2 ring-[#EA580C]/20"
                                  : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 font-medium cursor-pointer"
                              }`}
                            >
                              {item.badgeText && (
                                <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                                  item.badgeText === "Created"
                                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                                    : "bg-slate-200 text-slate-500"
                                }`}>
                                  {item.badgeText}
                                </span>
                              )}
                              <Icon className={`w-6 h-6 ${item.disabled ? "text-slate-400" : isSelected ? "text-[#EA580C]" : "text-slate-500"}`} />
                              <span className="text-xs sm:text-sm">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </motion.div>
              )}

              {/* STEP 2: Host / Couple Names & Monogram */}
              {draft.currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {draft.eventType === "WEDDING" ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                            Groom / Partner 1 Name
                          </label>
                          <div className="relative">
                            <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              placeholder="e.g. Diya"
                              value={draft.hostNameOne}
                              onChange={(e) => {
                                const newName = e.target.value;
                                const autoInitials = calculateMonogram(newName, draft.hostNameTwo);
                                setDraft({
                                  ...draft,
                                  hostNameOne: newName,
                                  coupleInitials: autoInitials || draft.coupleInitials,
                                });
                              }}
                              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                            Bride / Partner 2 Name
                          </label>
                          <div className="relative">
                            <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              placeholder="e.g. Vikram"
                              value={draft.hostNameTwo}
                              onChange={(e) => {
                                const newName = e.target.value;
                                const autoInitials = calculateMonogram(draft.hostNameOne, newName);
                                setDraft({
                                  ...draft,
                                  hostNameTwo: newName,
                                  coupleInitials: autoInitials || draft.coupleInitials,
                                });
                              }}
                              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                          Couple Monogram / Initials
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. D & V"
                          value={draft.coupleInitials}
                          onChange={(e) => setDraft({ ...draft, coupleInitials: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                          Birthday Person Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Aarav Sharma"
                          value={draft.hostNameOne}
                          onChange={(e) => setDraft({ ...draft, hostNameOne: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                          Turning Age
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 5th or 21st"
                          value={draft.turningAge}
                          onChange={(e) => setDraft({ ...draft, turningAge: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Dedicated Invitation Template Form Only: Desired Custom URL Route Availability Field */}
                  {isDedicatedInvitationForm && (
                    <div className="mt-4 pt-3.5 border-t border-slate-200 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[#7A1F2B]">
                          <Globe className="w-3.5 h-3.5 text-[#D9A441]" />
                          Desired Custom URL Route
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal lowercase">
                          /invitations/<span className="font-semibold text-[#7A1F2B]">{draft.customSlug || "desired-route"}</span>
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400 select-none">
                          bervic.com/invitations/
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. priya-rahul-wedding"
                          value={draft.customSlug || ""}
                          onChange={(e) => handleCustomSlugChange(e.target.value)}
                          className={`w-full h-9 pl-44 pr-9 rounded-lg border text-xs font-medium focus:outline-none transition-colors ${
                            slugStatus === "checking"
                              ? "border-slate-300 bg-slate-50 text-slate-800"
                              : slugStatus === "available"
                              ? "border-emerald-500 bg-emerald-50/30 text-emerald-950 focus:border-emerald-600 ring-1 ring-emerald-500/30"
                              : slugStatus === "taken"
                              ? "border-rose-500 bg-rose-50/30 text-rose-950 focus:border-rose-600 ring-1 ring-rose-500/30"
                              : "border-slate-200 bg-white focus:border-[#7A1F2B]"
                          }`}
                        />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
                          {slugStatus === "checking" && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                          {slugStatus === "available" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {slugStatus === "taken" && <X className="w-4 h-4 text-rose-600" />}
                        </div>
                      </div>

                      {/* Availability Status Notification */}
                      {draft.customSlug ? (
                        <div className="mt-1.5 text-[11px] font-medium">
                          {slugStatus === "checking" && (
                            <span className="text-slate-500 flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin inline" /> Checking route availability...
                            </span>
                          )}
                          {slugStatus === "available" && (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                              Route available! Your shareable link will be: <code className="bg-emerald-100/80 px-1 py-0.5 rounded text-emerald-900 font-mono text-[10px]">bervic.com/invitations/{draft.customSlug}</code>
                            </span>
                          )}
                          {slugStatus === "taken" && (
                            <span className="text-rose-700 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600 inline" />
                              Route &ldquo;{draft.customSlug}&rdquo; is already taken by another invitation. Please try a different name!
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="mt-1 text-[10px] text-slate-500">
                          Enter your preferred custom link URL. If left empty, an automatic link will be generated.
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: Main Date, Time & Formal Invitation Line */}
              {draft.currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                        Main Event Date
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="date"
                          value={draft.eventDate}
                          onChange={(e) => {
                            const newDate = e.target.value;
                            const updatedFunctions = draft.functions.map((fn) => ({
                              ...fn,
                              date: fn.date && fn.date !== draft.eventDate ? fn.date : newDate,
                            }));
                            setDraft({ ...draft, eventDate: newDate, functions: updatedFunctions });
                          }}
                          className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                        Main Event Time
                      </label>
                      <div className="relative">
                        <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="time"
                          value={draft.eventTime}
                          onChange={(e) => setDraft({ ...draft, eventTime: e.target.value })}
                          className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                      Invitation Tagline / Motto
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Two Hearts, One Celebration or A Tale of Love"
                      value={draft.tagline}
                      onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                      Formal Invitation Line
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Together with their families, request the pleasure of your company..."
                      value={draft.inviteLine}
                      onChange={(e) => setDraft({ ...draft, inviteLine: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Venue Locations, Photos & Map Links (Tabbed Format) */}
              {draft.currentStep === 4 && (() => {
                const safeIdx = Math.min(activeLocationIndex, Math.max(draft.locations.length - 1, 0));
                const currentLoc = draft.locations[safeIdx] || draft.locations[0];

                return (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Catchy Location Tab Header */}
                    <div className="flex items-center justify-between gap-2 px-0.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7E121D] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
                        <span>Venue Location Tabs (Tap tab to switch venue)</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {draft.locations.length} {draft.locations.length === 1 ? "Venue" : "Venues"}
                      </span>
                    </div>

                    {/* Location Segmented Tab Bar */}
                    <div className="p-1.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {draft.locations.map((loc, idx) => (
                          <button
                            key={loc.id || idx}
                            type="button"
                            onClick={() => setActiveLocationIndex(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                              safeIdx === idx
                                ? "bg-white text-[#7E121D] shadow-sm border-[#7E121D]/40 ring-2 ring-[#7E121D]/15 font-extrabold"
                                : "bg-slate-200/50 border-transparent text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <MapPin className={`w-3.5 h-3.5 ${safeIdx === idx ? "text-[#7E121D]" : "text-slate-400"}`} />
                            <span>{loc.mainTitle || `Location #${idx + 1}`}</span>
                            {safeIdx === idx && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#7E121D] inline-block animate-pulse" />
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newLoc: VenueLocationItem = {
                            id: `loc-${Date.now()}`,
                            mainTitle: `Venue #${draft.locations.length + 1}`,
                            subLabel: "",
                            venuePhoto: "",
                            address: "",
                            mapUrl: "",
                          };
                          const newLocs = [...draft.locations, newLoc];
                          setDraft({ ...draft, locations: newLocs });
                          setActiveLocationIndex(newLocs.length - 1);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#7E121D] hover:bg-[#680E17] text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Location</span>
                      </button>
                    </div>

                    {/* Active Location Form Fields */}
                    {currentLoc && (
                      <div className="space-y-3 pt-1">
                        {draft.locations.length > 1 && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const updatedLocs = draft.locations.filter((_, i) => i !== safeIdx);
                                setDraft({ ...draft, locations: updatedLocs });
                                setActiveLocationIndex(Math.max(0, safeIdx - 1));
                              }}
                              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] font-bold transition-colors"
                              title="Delete Location"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Location</span>
                            </button>
                          </div>
                        )}

                        {/* Row 1: Venue Main Title & Sub-Label / Hall Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Venue Main Title
                            </label>
                            <input
                              type="text"
                              placeholder={draft.eventType === "BIRTHDAY" ? "e.g. Birthday Party Venue" : "e.g. Marriage Ceremony Venue"}
                              value={currentLoc.mainTitle}
                              onChange={(e) => {
                                const newLocs = [...draft.locations];
                                newLocs[safeIdx].mainTitle = e.target.value;
                                setDraft({ ...draft, locations: newLocs });
                              }}
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Venue Sub-Label / Hall Name
                            </label>
                            <input
                              type="text"
                              placeholder={draft.eventType === "BIRTHDAY" ? "e.g. Celebration Hall & Lawn" : "e.g. JW Marriott Grand Ballroom"}
                              value={currentLoc.subLabel}
                              onChange={(e) => {
                                const newLocs = [...draft.locations];
                                newLocs[safeIdx].subLabel = e.target.value;
                                setDraft({ ...draft, locations: newLocs });
                              }}
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                            />
                          </div>
                        </div>

                        {/* Row 2: Venue Photo & Google Maps Link */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Venue Photo
                            </label>
                            <div className="flex items-center gap-2">
                              <label className="flex-1 flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg bg-[#7E121D] hover:bg-[#680E17] text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                                <Upload className="w-3.5 h-3.5 text-[#FED7AA]" />
                                <span>Upload Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    try {
                                      const res = await fetch("/api/upload", { method: "POST", body: formData });
                                      const data = await res.json();
                                      if (data.url) {
                                        const newLocs = [...draft.locations];
                                        newLocs[safeIdx].venuePhoto = data.url;
                                        setDraft({ ...draft, locations: newLocs });
                                      }
                                    } catch (err) {
                                      console.error("Venue photo upload error:", err);
                                    }
                                  }}
                                />
                              </label>

                              {currentLoc.venuePhoto && (
                                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#EA580C] shrink-0">
                                  <img src={currentLoc.venuePhoto} alt="Venue" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newLocs = [...draft.locations];
                                      newLocs[safeIdx].venuePhoto = "";
                                      setDraft({ ...draft, locations: newLocs });
                                    }}
                                    className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded-full"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <input
                              type="text"
                              placeholder="Or paste direct image URL"
                              value={currentLoc.venuePhoto}
                              onChange={(e) => {
                                const newLocs = [...draft.locations];
                                newLocs[safeIdx].venuePhoto = e.target.value;
                                setDraft({ ...draft, locations: newLocs });
                              }}
                              className="w-full h-8 px-2.5 rounded-md border border-slate-200 text-[11px] font-medium focus:outline-none focus:border-[#EA580C] bg-white mt-1.5"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Google Maps Link
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. https://maps.google.com"
                              value={currentLoc.mapUrl}
                              onChange={(e) => {
                                const newLocs = [...draft.locations];
                                newLocs[safeIdx].mapUrl = e.target.value;
                                setDraft({ ...draft, locations: newLocs });
                              }}
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                            />
                          </div>
                        </div>

                        {/* Row 3: Venue Address */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                            Venue Address
                          </label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Your Full Address, City, State 000000"
                            value={currentLoc.address}
                            onChange={(e) => {
                              const newLocs = [...draft.locations];
                              newLocs[safeIdx].address = e.target.value;
                              setDraft({ ...draft, locations: newLocs });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })()}

              {/* STEP 5: Event Functions & Schedule (Tabbed Format) */}
              {draft.currentStep === 5 && (() => {
                const safeFnIdx = Math.min(activeFunctionIndex, Math.max(draft.functions.length - 1, 0));
                const currentFn = draft.functions[safeFnIdx] || draft.functions[0];

                return (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Catchy Function Tab Header */}
                    <div className="flex items-center justify-between gap-2 px-0.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7E121D] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
                        <span>Schedule Function Tabs (Tap tab to switch function)</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {draft.functions.length} {draft.functions.length === 1 ? "Function" : "Functions"}
                      </span>
                    </div>

                    {/* Function Segmented Tab Bar */}
                    <div className="p-1.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {draft.functions.map((fn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveFunctionIndex(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                              safeFnIdx === idx
                                ? "bg-white text-[#7E121D] shadow-sm border-[#7E121D]/40 ring-2 ring-[#7E121D]/15 font-extrabold"
                                : "bg-slate-200/50 border-transparent text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <span>{ICON_OPTIONS.find((o) => o.id === fn.icon)?.emoji || "✨"}</span>
                            <span>{fn.title || `Function #${idx + 1}`}</span>
                            {safeFnIdx === idx && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#7E121D] inline-block animate-pulse" />
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={addFunction}
                        className="px-2.5 py-1.5 rounded-lg bg-[#7E121D] hover:bg-[#680E17] text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Function</span>
                      </button>
                    </div>

                    {/* Active Function Form Fields */}
                    {currentFn && (
                      <div className="space-y-3 pt-1">
                        {draft.functions.length > 1 && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeFunction(safeFnIdx)}
                              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] font-bold transition-colors"
                              title="Delete Function"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Function</span>
                            </button>
                          </div>
                        )}

                        {/* Row 1: Icon & Function Title */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-4">
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Icon
                            </label>
                            <select
                              value={currentFn.icon || "ring"}
                              onChange={(e) => updateFunction(safeFnIdx, "icon", e.target.value)}
                              className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
                            >
                              {ICON_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-8">
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Function Title
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Wedding Ceremony, Royal Feast Lunch..."
                              value={currentFn.title}
                              onChange={(e) => updateFunction(safeFnIdx, "title", e.target.value)}
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                            />
                          </div>
                        </div>

                        {/* Row 2: Date (Synced / Custom) & Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Date Field + Badge */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Date (Synced / Custom)
                            </label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="date"
                                  value={currentFn.date || draft.eventDate || ""}
                                  onChange={(e) => updateFunction(safeFnIdx, "date", e.target.value)}
                                  className="w-full h-9 pl-9 pr-2 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C] cursor-pointer"
                                />
                              </div>

                              <div className="h-9 px-3 rounded-lg bg-red-50 border border-red-200 text-[#991B1B] text-xs font-semibold flex items-center justify-center shrink-0 min-w-[105px]">
                                {formatDatePill(currentFn.date || draft.eventDate || "")}
                              </div>
                            </div>
                          </div>

                          {/* Time Field + Badge */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Time
                            </label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="time"
                                  value={currentFn.time || ""}
                                  onChange={(e) => updateFunction(safeFnIdx, "time", e.target.value)}
                                  className="w-full h-9 pl-9 pr-2 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C] cursor-pointer"
                                />
                              </div>

                              <div className="h-9 px-3 rounded-lg bg-red-50 border border-red-200 text-[#991B1B] text-xs font-semibold flex items-center justify-center shrink-0 min-w-[105px]">
                                {formatTimePill(currentFn.time)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Row 3: Venue / Hall Name */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                            Venue / Hall Name
                          </label>
                          <div className="relative">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              placeholder="e.g. Main Temple Hall / Grand Ballroom"
                              value={
                                currentFn.venue ||
                                getAutoVenueForFunction(
                                  currentFn.title,
                                  currentFn.icon || "",
                                  currentFn.time,
                                  draft.locations,
                                  draft.venueName
                                )
                              }
                              onChange={(e) => updateFunction(safeFnIdx, "venue", e.target.value)}
                              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })()}

              {/* STEP 6: Day Timeline (Tabbed Format like Step 5) */}
              {draft.currentStep === 6 && (() => {
                const safeTlIdx = Math.min(activeTimelineIndex, Math.max((draft.timelineItems || []).length - 1, 0));
                const currentItem = (draft.timelineItems || [])[safeTlIdx] || (draft.timelineItems || [])[0];

                return (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Timeline Item Segmented Tab Bar */}
                    <div className="p-1 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
                      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                        {(draft.timelineItems || []).map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveTimelineIndex(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                              safeTlIdx === idx
                                ? "bg-white text-[#7E121D] shadow-xs border-slate-200/60"
                                : "bg-transparent border-transparent text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <span>{ICON_OPTIONS.find((o) => o.id === item.icon)?.emoji || "✨"}</span>
                            <span>{item.title || `Item #${idx + 1}`}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={addTimelineItem}
                        className="px-2.5 py-1.5 rounded-lg bg-[#7E121D] hover:bg-[#680E17] text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Timeline Item</span>
                      </button>
                    </div>

                    {/* Active Timeline Item Form Fields */}
                    {currentItem && (
                      <div className="space-y-3 pt-1">
                        {(draft.timelineItems || []).length > 1 && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeTimelineItem(safeTlIdx)}
                              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer"
                              title="Delete Timeline Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Timeline Item</span>
                            </button>
                          </div>
                        )}

                        {/* Row 1: Icon & Activity Title */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-4">
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Icon
                            </label>
                            <select
                              value={currentItem.icon || "ring"}
                              onChange={(e) => updateTimelineItem(safeTlIdx, "icon", e.target.value)}
                              className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
                            >
                              {ICON_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-8">
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Activity Title
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Sacred Marriage Vows, Traditional Lunch..."
                              value={currentItem.title}
                              onChange={(e) => updateTimelineItem(safeTlIdx, "title", e.target.value)}
                              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                            />
                          </div>
                        </div>

                        {/* Row 2: Date (Synced / Custom) & Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Date Field + Badge */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Date (Synced / Custom)
                            </label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="date"
                                  value={currentItem.date || draft.eventDate || ""}
                                  onChange={(e) => updateTimelineItem(safeTlIdx, "date", e.target.value)}
                                  className="w-full h-9 pl-9 pr-2 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C] cursor-pointer"
                                />
                              </div>

                              <div className="h-9 px-3 rounded-lg bg-red-50 border border-red-200 text-[#991B1B] text-xs font-semibold flex items-center justify-center shrink-0 min-w-[105px]">
                                {formatDatePill(currentItem.date || draft.eventDate || "")}
                              </div>
                            </div>
                          </div>

                          {/* Time Field + Badge */}
                          <div>
                            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                              Time
                            </label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="time"
                                  value={currentItem.time || ""}
                                  onChange={(e) => updateTimelineItem(safeTlIdx, "time", e.target.value)}
                                  className="w-full h-9 pl-9 pr-2 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C] cursor-pointer"
                                />
                              </div>

                              <div className="h-9 px-3 rounded-lg bg-red-50 border border-red-200 text-[#991B1B] text-xs font-semibold flex items-center justify-center shrink-0 min-w-[105px]">
                                {formatTimePill(currentItem.time)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Summary All Items Card List at bottom */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60">
                      <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider block mb-2">
                        Day Timeline Overview ({(draft.timelineItems || []).length} items)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(draft.timelineItems || []).map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveTimelineIndex(idx)}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                              safeTlIdx === idx
                                ? "bg-red-50 border-red-300 text-[#991B1B] font-bold shadow-2xs"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span>{ICON_OPTIONS.find((o) => o.id === item.icon)?.emoji || "✨"}</span>
                              <span className="truncate">{item.title || `Item #${idx + 1}`}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 shrink-0 ml-2">
                              {formatTimePill(item.time)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* STEP 7: Bride, Groom, Cover & Gallery Photos */}
              {draft.currentStep === 7 && (
                <motion.div
                  key="step7"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Hidden Input Refs */}
                  <input
                    ref={couplePhotoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e, "coupleImage")}
                  />
                  <input
                    ref={partnerTwoPhotoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e, "partnerTwoImage")}
                  />
                  <input
                    ref={coverPhotoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e, "coverImage")}
                  />
                  <input
                    ref={galleryPhotoInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />

                  {/* Bride / Celebrant / Groom Compact Cards */}
                  <div className={`grid ${draft.eventType === "BIRTHDAY" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-3`}>
                    {/* Bride / Celebrant Photo */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-[#EA580C]/30 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        {draft.coupleImage ? (
                          <img
                            src={draft.coupleImage}
                            alt={draft.eventType === "BIRTHDAY" ? "Celebrant" : "Bride"}
                            className="w-12 h-12 rounded-full object-cover border border-[#EA580C]/40 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-rose-50 border border-dashed border-rose-200 flex items-center justify-center text-rose-500 shrink-0">
                            {draft.eventType === "BIRTHDAY" ? (
                              <User className="w-5 h-5 text-rose-500" />
                            ) : (
                              <Heart className="w-5 h-5 text-rose-400" />
                            )}
                          </div>
                        )}

                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider block truncate">
                            {draft.eventType === "BIRTHDAY"
                              ? "Celebrant Photo"
                              : draft.eventType === "WEDDING"
                              ? "Bride Photo"
                              : "Host #1 Photo"}
                          </span>
                          <p className="text-xs text-slate-500 truncate font-medium">
                            {draft.hostNameOne || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => couplePhotoInputRef.current?.click()}
                          className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-[#7E121D] text-slate-700 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{draft.coupleImage ? "Change" : "Upload"}</span>
                        </button>
                        {draft.coupleImage && (
                          <button
                            type="button"
                            onClick={() => setDraft({ ...draft, coupleImage: "" })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title={draft.eventType === "BIRTHDAY" ? "Delete Celebrant Photo" : "Delete Bride Photo"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Groom / Host #2 Photo (Wedding / Multi-host only) */}
                    {draft.eventType !== "BIRTHDAY" && (
                      <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-[#EA580C]/30 transition-all">
                        <div className="flex items-center gap-3 min-w-0">
                          {draft.partnerTwoImage ? (
                            <img
                              src={draft.partnerTwoImage}
                              alt="Groom"
                              className="w-12 h-12 rounded-full object-cover border border-[#EA580C]/40 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-amber-50 border border-dashed border-amber-200 flex items-center justify-center text-amber-500 shrink-0">
                              <User className="w-5 h-5 text-amber-500" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider block truncate">
                              {draft.eventType === "WEDDING" ? "Groom Photo" : "Host #2 Photo"}
                            </span>
                            <p className="text-xs text-slate-500 truncate font-medium">
                              {draft.hostNameTwo || "Not specified"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => partnerTwoPhotoInputRef.current?.click()}
                            className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-[#7E121D] text-slate-700 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{draft.partnerTwoImage ? "Change" : "Upload"}</span>
                          </button>
                          {draft.partnerTwoImage && (
                            <button
                              type="button"
                              onClick={() => setDraft({ ...draft, partnerTwoImage: "" })}
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete Groom Photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hero Cover Photo */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-[#EA580C]/30 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      {draft.coverImage ? (
                        <img
                          src={draft.coverImage}
                          alt="Hero Cover"
                          className="w-12 h-12 rounded-lg object-cover border border-[#EA580C]/40 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider block truncate">
                          Main Hero Cover Banner Photo
                        </span>
                        <p className="text-xs text-slate-500 truncate font-medium">
                          Used for main website header / background banner
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => coverPhotoInputRef.current?.click()}
                        className="h-8 px-2.5 rounded-lg bg-slate-100 hover:bg-[#7E121D] text-slate-700 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{draft.coverImage ? "Change" : "Upload"}</span>
                      </button>
                      {draft.coverImage && (
                        <button
                          type="button"
                          onClick={() => setDraft({ ...draft, coverImage: "" })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Cover Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Album Gallery Photos Grid */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider">
                        Album Gallery Photos ({draft.galleryImages.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => galleryPhotoInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-[#7E121D] hover:bg-[#680E17] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Photos</span>
                      </button>
                    </div>

                    {draft.galleryImages.length > 0 ? (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {draft.galleryImages.map((img, idx) => (
                          <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                            <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                  const updatedGallery = draft.galleryImages.filter((_, i) => i !== idx);
                                  setDraft({ ...draft, galleryImages: updatedGallery });
                              }}
                              className="absolute top-1 right-1 p-1 rounded-full bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete Photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => galleryPhotoInputRef.current?.click()}
                        className="w-full h-14 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-[#EA580C] cursor-pointer flex items-center justify-center gap-2 transition-all text-slate-400"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-xs font-medium">Click to upload album gallery photos.</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 8: Love Story, Video, Dress Code & RSVP Contact */}
              {draft.currentStep === 8 && (
                <motion.div
                  key="step8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* YouTube Video Section Guide (Wedding Only) */}
                  {draft.eventType !== "BIRTHDAY" && (
                    <>
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-950 space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <span>💡 How to Add Your YouTube Wedding Video</span>
                        </div>
                        <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-amber-900/90 leading-relaxed font-medium">
                          <li>Upload your wedding teaser/glimpse to <strong>YouTube</strong> (Public or Unlisted).</li>
                          <li>In YouTube Studio under Advanced Settings, ensure <strong>&quot;Allow embedding&quot;</strong> is ON.</li>
                          <li>Copy the YouTube video link from your browser or share button and paste it below!</li>
                        </ol>
                      </div>

                      {/* Shadcn Toggle Switch: Show / Hide Video Section */}
                      <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-800 flex items-center justify-center font-bold">
                            <Video className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">Show YouTube Video Section</h4>
                            <p className="text-[11px] text-slate-500">
                              Toggle ON to display your wedding teaser video, or OFF to hide the video section completely from your invitation card.
                            </p>
                          </div>
                        </div>

                        {/* Shadcn Switch Toggle */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={draft.showVideo !== false}
                          onClick={() => setDraft({ ...draft, showVideo: !(draft.showVideo !== false) })}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            draft.showVideo !== false ? "bg-[#7E121D]" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              draft.showVideo !== false ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Paste YouTube Video Link (Conditional on Toggle) */}
                      {draft.showVideo !== false ? (
                        <div>
                          <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                            Paste YouTube Video Link
                          </label>
                          <div className="relative">
                            <Video className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                              value={draft.loveStoryVideoUrl}
                              onChange={(e) => setDraft({ ...draft, loveStoryVideoUrl: e.target.value })}
                              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                            />
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Supports standard YouTube watch links, shorts, shortlinks (youtu.be), and embed URLs.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-100/60 text-slate-500 text-xs flex items-center gap-2">
                          <VideoOff className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Video section is currently <strong>Hidden</strong>. Toggle the switch ON above if you wish to display a wedding video on your invitation card.</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Story / Celebration Narrative Text */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                      {draft.eventType === "BIRTHDAY" ? "Celebration Message / Story Note" : "Love Story Narrative Text"}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={
                        draft.eventType === "BIRTHDAY"
                          ? "Enter a special birthday note or celebration message for your guests..."
                          : "Enter your love story narrative here. Share how you first met, your favorite memories together, and your excitement for your wedding day with your guests."
                      }
                      value={draft.loveStoryText}
                      onChange={(e) => setDraft({ ...draft, loveStoryText: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                    />
                  </div>

                  {/* Row: Dress Code & RSVP Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                        Dress Code / Attire Theme
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Traditional Indian Ethnic / Formal"
                        value={draft.dressCode}
                        onChange={(e) => setDraft({ ...draft, dressCode: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                        RSVP Contact Phone (WhatsApp)
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="e.g. +91 98765 43210"
                          value={draft.rsvpContact}
                          onChange={(e) => setDraft({ ...draft, rsvpContact: e.target.value })}
                          className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EA580C] bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 9: Final Review & Template Selection */}
              {draft.currentStep === 9 && (
                <motion.div
                  key="step9"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#D9A441]/30 space-y-3 text-xs shadow-2xs">
                    {/* Event Type */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold text-[11px]">Event Type:</span>
                      <span className="font-bold text-[#0F172A] sm:text-right uppercase tracking-wider">{draft.eventType}</span>
                    </div>

                    {/* Names */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold text-[11px]">Names:</span>
                      <span className="font-bold text-[#0F172A] sm:text-right">
                        {draft.hostNameOne} {draft.hostNameTwo ? `& ${draft.hostNameTwo}` : ""} {draft.coupleInitials ? `(${draft.coupleInitials})` : ""}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold text-[11px] shrink-0">Date & Time:</span>
                      <span className="font-bold text-[#0F172A] sm:text-right">
                        {(() => {
                          const dateStr = draft.eventDate || "";
                          let formattedDate = dateStr;
                          if (dateStr.includes("T")) {
                            try {
                              const d = new Date(dateStr);
                              formattedDate = d.toLocaleDateString("en-US", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              });
                            } catch {
                              formattedDate = dateStr.split("T")[0];
                            }
                          }
                          return formattedDate || "Not set";
                        })()} {draft.eventTime ? `(${draft.eventTime})` : ""}
                      </span>
                    </div>

                    {/* Venue */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold text-[11px] shrink-0 pt-0.5">Venue:</span>
                      <span className="font-semibold text-[#0F172A] sm:text-right leading-relaxed max-w-lg">
                        {Array.from(new Set([draft.venueName, draft.venueAddress].filter(Boolean))).join(" — ") || "Not set"}
                      </span>
                    </div>

                    {/* Schedule Functions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold text-[11px]">Schedule Functions:</span>
                      <span className="font-bold text-[#0F172A] sm:text-right">
                        {draft.functions?.length || 0} functions configured
                      </span>
                    </div>

                    {/* RSVP Contact */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-slate-500 font-semibold text-[11px]">RSVP Contact:</span>
                      <span className="font-bold text-[#0F172A] sm:text-right">{draft.rsvpContact || "Not set"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    {isLockedState ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-3.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 cursor-not-allowed opacity-80"
                      >
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span>Event Details Locked (2H Pre-Event)</span>
                      </button>
                    ) : isNewProfile || profileId || onClose ? (
                      <>
                        <button
                          type="button"
                          disabled={isSavingProfile}
                          onClick={async () => {
                            await saveProfileToDb(draft);
                            if (onComplete) onComplete();
                            else if (onClose) onClose();
                            else router.push("/dashboard");
                          }}
                          className="w-full sm:w-1/2 py-3 rounded-xl bg-[#7E121D] hover:bg-[#680E17] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-900/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isSavingProfile ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#FED7AA]" />
                          ) : (
                            <Save className="w-4 h-4 text-[#FED7AA]" />
                          )}
                          <span>{isSavingProfile ? "Saving Profile..." : "Save Event Profile"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCloseClick}
                          className="w-full sm:w-1/2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4 text-slate-500" />
                          <span>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={isSavingProfile}
                        onClick={handleFinalSubmit}
                        className="w-full py-4 rounded-xl bg-[#7E121D] hover:bg-[#680E17] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-rose-900/20 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
                      >
                        {isSavingProfile ? (
                          <Loader2 className="w-5 h-5 animate-spin text-[#FED7AA]" />
                        ) : (
                          <Save className="w-5 h-5 text-[#FED7AA]" />
                        )}
                        <span>{isSavingProfile ? "Saving Event Profile..." : "Save Details & Choose Template ✨"}</span>
                        <ArrowRight className="w-5 h-5 text-[#FED7AA]" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {draft.currentStep < 9 && (
              <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-slate-100 w-full">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={draft.currentStep === 1}
                  className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap shrink-0 border ${
                    draft.currentStep === 1
                      ? "text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed"
                      : "text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200"
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Back</span>
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    disabled={isSavingProfile || isLockedState}
                    onClick={handleInPlaceSave}
                    className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
                      isLockedState
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "bg-[#EFE7D8] hover:bg-[#D9A441]/30 text-[#7E121D] border-[#D9A441]/40 cursor-pointer shadow-xs"
                    }`}
                    title={isLockedState ? "Editing locked 2 hours pre-event" : "Save changes on this step without leaving the page"}
                  >
                    {isSavingProfile ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7E121D] shrink-0" />
                    ) : isSaveSuccess ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : isLockedState ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <Save className="w-3.5 h-3.5 text-[#7E121D] shrink-0" />
                    )}
                    <span className="whitespace-nowrap">
                      {isSavingProfile ? "Saving..." : isSaveSuccess ? "Saved ✓" : isLockedState ? "Locked" : "Save Details"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => nextStep()}
                    className="px-3.5 sm:px-5 py-2.5 rounded-xl bg-[#7E121D] hover:bg-[#680E17] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span className="whitespace-nowrap">Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FED7AA] shrink-0" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
