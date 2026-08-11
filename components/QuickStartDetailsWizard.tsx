"use client";

import { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { setProfileHasDetailsCache } from "@/lib/useRequireLoginAndDetails";
import WizardDetailsSkeleton from "@/components/skeletons/WizardDetailsSkeleton";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
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
  X,
  Save,
  LayoutDashboard,
  Lock,
  LogIn,
  UserPlus,
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

const initialDraft: DraftData = {
  eventType: "WEDDING",
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
  locations: [
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
  ],
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
  functions: [
    { icon: "ring", title: "Sacred Marriage Vows", date: "", time: "10:30", venue: "Marriage Ceremony Hall" },
    { icon: "sparkles", title: "Grand Reception", date: "", time: "19:00", venue: "Grand Ballroom" },
  ],
  timelineItems: [
    { icon: "ring", title: "Sacred Marriage Vows", date: "", time: "10:30" },
    { icon: "feast", title: "Traditional Lunch", date: "", time: "13:00" },
    { icon: "home", title: "Welcome at Home", date: "", time: "16:00" },
    { icon: "sparkles", title: "Grand Reception", date: "", time: "19:00" },
    { icon: "cake", title: "Cake Cutting Ceremony", date: "", time: "20:00" },
    { icon: "cocktail", title: "Gala Dinner", date: "", time: "20:30" },
    { icon: "car", title: "Send Off & Blessings", date: "", time: "22:30" },
  ],
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
        ? (draft.locations[0] as any)?.mainTitle?.trim() || (draft.locations[0] as any)?.name?.trim() || (draft.locations[0] as any)?.venueLabel?.trim()
        : "");

    const primaryAddress =
      draft.venueAddress?.trim() ||
      (draft.locations && draft.locations.length > 0
        ? (draft.locations[0] as any)?.address?.trim() || (draft.locations[0] as any)?.subLabel?.trim()
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
  onClose?: () => void;
  onComplete?: () => void;
  startAtStepOne?: boolean;
}

export default function QuickStartDetailsWizard({
  profileId,
  invitationId,
  isNewProfile,
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
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(true);
  const [hasExistingSavedProfile, setHasExistingSavedProfile] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: "error" | "success";
    title: string;
    description: string;
  } | null>(null);

  // Load saved draft on mount (API or localStorage resume)
  useEffect(() => {
    async function loadSavedDraft() {
      try {
        let profileFound = false;

        // Restore from localStorage first so unsaved typing is NEVER lost across page navigation!
        const localSaved = typeof window !== "undefined"
          ? localStorage.getItem("bervic_quick_start_draft") || localStorage.getItem("bervic_user_draft_details")
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
          const endpoint = invitationId
            ? `/api/user/event-draft?invitationId=${invitationId}`
            : profileId
            ? `/api/user/event-draft?id=${profileId}`
            : "/api/user/event-draft";
          const res = await fetch(endpoint);
          const data = await res.json();
          if (data.success && data.draft) {
            profileFound = true;
            const apiDraft = data.draft;
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
    setIsSavingProfile(true);
    const filledKeys: string[] = [];
    Object.keys(draftToSave).forEach((k) => {
      const val = draftToSave[k as keyof DraftData];
      if (typeof val === "string" && val.trim().length > 0) {
        filledKeys.push(k);
      }
    });

    const payload = {
      ...draftToSave,
      invitationId,
      isInvitationInstance: Boolean(invitationId),
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

    const newDraftState = {
      ...updatedDraft,
      completedFields: filledKeys,
      currentStep: stepNumber,
    };

    setDraft(newDraftState);

    // Save to localStorage after every Next Question / step transition for 100% reliable quick resume
    if (typeof window !== "undefined") {
      localStorage.setItem("bervic_quick_start_draft", JSON.stringify(newDraftState));
      localStorage.setItem("bervic_user_draft_details", JSON.stringify(newDraftState));
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
                subLabel: extractedVenue || loc.subLabel,
                address: extractedAddress || extractedVenue || loc.address,
              };
            }
            if (idx === 1) {
              return {
                ...loc,
                mainTitle: loc.mainTitle || "Grand Reception Venue",
                subLabel: "UBAHARA MATHA MAHAL",
                address: "kavalkinaru",
              };
            }
            return loc;
          })
        : [
            {
              id: "loc-1",
              mainTitle: "Marriage Ceremony Venue",
              subLabel: extractedVenue || "ST. ANTONY'S CHURCH",
              venuePhoto: "/images/templates/venue-ceremony.jpg",
              address: extractedAddress || "Tirunelveli",
              mapUrl: "https://maps.google.com",
            },
            {
              id: "loc-2",
              mainTitle: "Grand Reception Venue",
              subLabel: "UBAHARA MATHA MAHAL",
              venuePhoto: "/images/templates/venue-reception.jpg",
              address: "kavalkinaru",
              mapUrl: "https://maps.google.com",
            },
          ]);

      const updatedDraft: DraftData = {
        ...draft,
        eventType: ext.eventType || draft.eventType,
        hostNameOne: ext.hostNameOne || draft.hostNameOne,
        hostNameTwo: ext.hostNameTwo || draft.hostNameTwo,
        eventTitle: ext.eventTitle || draft.eventTitle,
        eventDate: extractedDate,
        eventTime: extractedTime,
        venueName: extractedVenue,
        venueAddress: extractedAddress,
        locations: updatedLocations,
        rsvpContact: ext.rsvpContact || draft.rsvpContact,
        functions: updatedFunctions,
        extractedFromDoc: true,
      };

      await saveStepData(updatedDraft, 3);

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
      <section className="py-12 bg-[#F8F3EA] text-[#221C17] border-b border-[#D9C88A]/30">
        <WizardDetailsSkeleton />
      </section>
    );
  }

  const isLandingPageWithProfile = Boolean(
    hasExistingSavedProfile && !isNewProfile && !profileId && !onClose
  );

  if (isLandingPageWithProfile) {
    return (
      <section className="py-16 md:py-24 bg-white text-[#221C17] relative border-t border-b border-slate-100 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          {/* Sparkles Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9A441]/15 text-[#7E121D] text-xs font-extrabold uppercase tracking-wider border border-[#D9A441]/30 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#D9A441]" />
            <span>YOUR CELEBRATION PROFILE IS READY!</span>
          </div>

          {/* Catchy Headline */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#0F172A] leading-tight">
              Ready to Design Your <span className="italic text-[#7E121D]">Dream Invitation</span>?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
              Your celebration profile for <strong>{draft.hostNameOne || "your celebration"}{draft.hostNameTwo ? ` & ${draft.hostNameTwo}` : ""}</strong> is saved! Experience your interactive invitation suite rendered live across Desktop, Laptop, Tablet, and Mobile screens.
            </p>
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
          <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#D9A441]/30 max-w-md mx-auto flex items-center justify-between text-xs text-[#0F172A] shadow-xs">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7E121D] to-[#5C1620] text-[#FED7AA] flex items-center justify-center font-serif font-bold text-sm shrink-0">
                {draft.coupleInitials || "S & A"}
              </div>
              <div>
                <p className="font-bold text-[#7E121D]">
                  {draft.hostNameOne || "Celebration Details"} {draft.hostNameTwo ? `& ${draft.hostNameTwo}` : ""}
                </p>
                <p className="text-[11px] text-slate-500">
                  {draft.eventDate ? `Date: ${draft.eventDate}` : "Details saved to account"}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase shrink-0">
              ✓ Profile Saved
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => router.push("/templates")}
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-[#7E121D] hover:bg-[#680E17] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-rose-900/25 transition-all cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-[#FED7AA] group-hover:rotate-12 transition-transform" />
              <span>Choose Template & Build Website →</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#EFE7D8] hover:bg-[#D9A441]/30 text-[#7E121D] font-bold text-xs sm:text-sm border border-[#D9A441]/40 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4 text-[#7E121D]" />
              <span>Go to Dashboard</span>
            </button>
          </div>

          {/* Bottom note for creating extra profiles */}
          <p className="text-[11px] sm:text-xs text-slate-500 pt-2 font-medium">
            Want to add another event profile or edit current details? Visit your <button type="button" onClick={() => router.push("/dashboard")} className="font-bold text-[#7E121D] underline hover:opacity-80">Private Dashboard</button>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="details-form"
      className={`text-[#221C17] relative scroll-mt-24 ${
        onClose ? "py-2 sm:py-4 bg-transparent" : "py-16 md:py-24 bg-white sm:bg-[#F8F3EA] border-t border-b border-[#D9A441]/20"
      }`}
    >
      {/* BEFORE LOGIN DULLED OVERLAY BANNER */}
      {status !== "authenticated" && (
        <div className="absolute inset-0 z-30 bg-[#F8F3EA]/75 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl border-2 border-[#D9A441]/50 text-center space-y-5 transform transition-all">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7A1F2B] to-[#5C1620] text-[#D9A441] mx-auto flex items-center justify-center border-2 border-[#D9A441]/60 shadow-md">
              <Lock className="w-8 h-8 text-[#D9A441]" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] text-[10px] font-extrabold uppercase tracking-wider">
                Authentication Required
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
                Please Login to Fill Event Details
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Log in or register your free Bervic account to enter your wedding/celebration details, upload invitation cards, and preview live templates personalized for you!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/auth/login?callbackUrl=/#details-form")}
                className="flex-1 py-3.5 px-5 rounded-xl bg-[#7A1F2B] hover:bg-[#680E17] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4 text-[#D9A441]" />
                <span>Log In to Continue</span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/auth/register?callbackUrl=/#details-form")}
                className="flex-1 py-3.5 px-5 rounded-xl bg-white hover:bg-slate-50 text-[#7A1F2B] font-bold text-xs sm:text-sm border-2 border-[#7A1F2B]/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <UserPlus className="w-4 h-4 text-[#7A1F2B]" />
                <span>Create Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={status !== "authenticated" ? "filter blur-[1.5px] opacity-35 grayscale-[25%] pointer-events-none select-none" : ""}>
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

        {/* Top Bar Header for Close Action */}
        {onClose && (
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80 bg-white/60 backdrop-blur-xs p-3 rounded-2xl">
            <span className="text-xs sm:text-sm font-extrabold text-[#7E121D] uppercase tracking-wider">
              {isNewProfile ? "Add New Event Profile" : "Edit Event Profile Details"}
            </span>

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {/* Left Column: Smart File Auto-Extractor Upload Box */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-[#D9A441]/30 shadow-xs flex flex-col justify-between min-h-0 lg:min-h-[480px] relative overflow-hidden">

            <div className="space-y-3 flex-1 flex flex-col pt-1">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EA580C]/10 text-[#EA580C] text-[10px] font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#EA580C]" />
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
                className="min-h-[120px] sm:min-h-[180px] border-2 border-dashed border-[#D9A441]/50 hover:border-[#EA580C] bg-gradient-to-b from-[#FFFDF9] to-[#FAF5ED] hover:bg-[#FFF7ED] rounded-2xl p-3.5 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center space-y-2 shadow-xs"
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
                  <div className="py-2 flex flex-col items-center gap-1.5 text-[#EA580C]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs font-bold animate-pulse">Extracting Details with AI...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#7E121D] to-[#5C1620] text-[#FED7AA] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-[#0F172A]">Drop Card or PDF Here</p>
                      <p className="text-[10px] text-[#EA580C] font-semibold">⚡ Auto-fills form below</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#7E121D] text-white text-[11px] font-bold shadow-xs group-hover:bg-[#680E17] transition-all flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FED7AA]" />
                      <span>Upload Card / Doc</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#FAF8F5] rounded-xl p-2.5 border border-[#D9A441]/20 text-[11px] text-slate-600 space-y-0.5 mt-2">
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
                              ? "bg-[#7E121D] text-white border-[#7E121D] shadow-sm"
                              : isComplete
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                              : "bg-amber-50/80 text-amber-900 border-amber-200/90 hover:bg-amber-100/80"
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
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-[#EA580C] uppercase tracking-wider font-bold truncate">
                        Step {draft.currentStep} of 9: {STEP_TITLES[draft.currentStep]}
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
                        className="px-2.5 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase tracking-wide shrink-0 transition-colors cursor-pointer"
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { type: "WEDDING", label: "Wedding", icon: Heart, disabled: false },
                      { type: "BIRTHDAY", label: "Birthday", icon: Cake, disabled: false },
                      { type: "RELIGIOUS", label: "Religious / Home", icon: Home, disabled: true },
                      { type: "ANNIVERSARY", label: "Anniversary", icon: Sparkles, disabled: true },
                      { type: "PARTY", label: "Party / Gala", icon: PartyPopper, disabled: true },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = draft.eventType === item.type;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          disabled={item.disabled}
                          onClick={() => {
                            if (item.disabled) return;
                            const updated = { ...draft, eventType: item.type };
                            saveStepData(updated, 2);
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center relative ${
                            item.disabled
                              ? "bg-slate-100/60 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                              : isSelected
                              ? "bg-[#FFF7ED] border-[#EA580C] text-[#EA580C] font-bold shadow-md ring-2 ring-[#EA580C]/20"
                              : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 font-medium"
                          }`}
                        >
                          {item.disabled && (
                            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
                              Soon
                            </span>
                          )}
                          <Icon className={`w-6 h-6 ${item.disabled ? "text-slate-400" : isSelected ? "text-[#EA580C]" : "text-slate-500"}`} />
                          <span className="text-xs sm:text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
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
                              placeholder="e.g. Marriage Ceremony Venue"
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
                              placeholder="e.g. JW Marriott Grand Ballroom"
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

                              <div className="h-9 px-3 rounded-lg bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs font-semibold flex items-center justify-center shrink-0 min-w-[105px]">
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

                              <div className="h-9 px-3 rounded-lg bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs font-semibold flex items-center justify-center shrink-0 min-w-[105px]">
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

                              <div className="h-9 px-3 rounded-lg bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs font-semibold flex items-center justify-center shrink-0 min-w-[105px]">
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

                              <div className="h-9 px-3 rounded-lg bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs font-semibold flex items-center justify-center shrink-0 min-w-[105px]">
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
                                ? "bg-amber-50/90 border-amber-300 text-amber-950 font-bold shadow-2xs"
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

                  {/* Bride & Groom Compact Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Bride Photo */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-[#EA580C]/30 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        {draft.coupleImage ? (
                          <img
                            src={draft.coupleImage}
                            alt="Bride"
                            className="w-12 h-12 rounded-full object-cover border border-[#EA580C]/40 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-rose-50 border border-dashed border-rose-200 flex items-center justify-center text-rose-500 shrink-0">
                            <Heart className="w-5 h-5 text-rose-400" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider block truncate">
                            {draft.eventType === "WEDDING" ? "Bride Photo" : "Host #1 Photo"}
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
                            title="Delete Bride Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Groom Photo */}
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
                  {/* YouTube Video Section Guide */}
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

                  {/* Paste YouTube Video Link */}
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

                  {/* Love Story Narrative Text */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                      Love Story Narrative Text
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter your love story narrative here. Share how you first met, your favorite memories together, and your excitement for your wedding day with your guests."
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
                  <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#D9A441]/30 space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Event Type:</span>
                      <span className="font-bold text-[#0F172A]">{draft.eventType}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Names:</span>
                      <span className="font-bold text-[#0F172A]">
                        {draft.hostNameOne} {draft.hostNameTwo ? `& ${draft.hostNameTwo}` : ""} ({draft.coupleInitials || "N/A"})
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Date & Time:</span>
                      <span className="font-bold text-[#0F172A]">
                        {draft.eventDate || "Not set"} ({draft.eventTime || "TBD"})
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Venue:</span>
                      <span className="font-bold text-[#0F172A]">{draft.venueName} - {draft.venueAddress}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500">Schedule Functions:</span>
                      <span className="font-bold text-[#0F172A]">{draft.functions.length} functions configured</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">RSVP Contact:</span>
                      <span className="font-bold text-[#0F172A]">{draft.rsvpContact || "Not set"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    {isNewProfile || profileId || onClose ? (
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
                    disabled={isSavingProfile}
                    onClick={handleInPlaceSave}
                    className="px-3 sm:px-4 py-2.5 rounded-xl bg-[#EFE7D8] hover:bg-[#D9A441]/30 text-[#7E121D] text-xs font-bold border border-[#D9A441]/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50 whitespace-nowrap shrink-0"
                    title="Save changes on this step without leaving the page"
                  >
                    {isSavingProfile ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7E121D] shrink-0" />
                    ) : isSaveSuccess ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Save className="w-3.5 h-3.5 text-[#7E121D] shrink-0" />
                    )}
                    <span className="whitespace-nowrap">
                      {isSavingProfile ? "Saving..." : isSaveSuccess ? "Saved ✓" : "Save Details"}
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
      </div>
    </section>
  );
}
