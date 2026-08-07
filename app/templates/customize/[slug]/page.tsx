"use client";

import { useState, useEffect, useRef, use, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DynamicTemplateCard from "@/components/templates/DynamicTemplateCard";
import CloudinaryUploader from "@/components/CloudinaryUploader";
import PricingCheckoutModal from "@/components/payment/PricingCheckoutModal";
import { checkInvitationLockStatus } from "@/lib/lockCheck";

import { sampleWeddingData } from "@/data/sampleWeddingData";
import { sampleBirthdayData } from "@/data/sampleBirthdayData";
import { templatesRegistry } from "@/data/templatesRegistry";
import { TemplateClassicFloralProps, WeddingEvent, TimelineStep, LocationVenue } from "@/types/template";
import {
  Sparkles,
  Edit3,
  Eye,
  Save,
  ArrowLeft,
  Heart,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  LayoutDashboard,
  Copy,
  Check,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Clock,
  Video,
  Globe,
  Camera,
  Lock,
} from "lucide-react";

function formatMainDateAndTime(dateVal: string, timeVal: string): string {
  if (!dateVal) return "";
  const d = new Date(dateVal + (timeVal ? `T${timeVal}` : "T00:00"));
  if (isNaN(d.getTime())) return "";

  const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
  const dayNum = d.getDate();
  const monthName = d.toLocaleDateString("en-US", { month: "long" });
  const year = d.getFullYear();

  let suffix = "th";
  if (dayNum % 10 === 1 && dayNum !== 11) suffix = "st";
  else if (dayNum % 10 === 2 && dayNum !== 12) suffix = "nd";
  else if (dayNum % 10 === 3 && dayNum !== 13) suffix = "rd";

  let timeFormatted = "";
  if (timeVal) {
    const [h, m] = timeVal.split(":");
    const hours = parseInt(h, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    timeFormatted = ` at ${formattedHours}:${m} ${ampm} IST`;
  }

  return `${dayName}, ${dayNum}${suffix} ${monthName} ${year}${timeFormatted}`;
}

function formatEventDate(dateVal: string): string {
  if (!dateVal) return "";
  const d = new Date(dateVal + "T00:00");
  if (isNaN(d.getTime())) return dateVal;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function parseDateToIsoString(dateVal?: string, fallbackPickerVal?: string): string {
  if (!dateVal) return fallbackPickerVal || "";
  const d = new Date(dateVal);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }
  const d2 = new Date(dateVal + " 00:00:00");
  if (!isNaN(d2.getTime())) {
    return d2.toISOString().split("T")[0];
  }
  return fallbackPickerVal || "";
}

function formatEventTime(timeVal: string): string {
  if (!timeVal) return "";
  const parts = timeVal.split(":");
  if (parts.length < 2) return timeVal;
  const hours = parseInt(parts[0], 10);
  if (isNaN(hours)) return timeVal;
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${parts[1]} ${ampm} IST`;
}

function formatTimelineTime(timeVal: string): string {
  if (!timeVal) return "";
  const parts = timeVal.split(":");
  if (parts.length < 2) return timeVal;
  const hours = parseInt(parts[0], 10);
  if (isNaN(hours)) return timeVal;
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${parts[1]} ${ampm}`;
}

const DEFAULT_SIX_MOMENTS = [
  "/images/templates/gallery-1.jpg",
  "/images/templates/gallery-2.jpg",
  "/images/templates/gallery-3.jpg",
  "/images/templates/gallery-4.jpg",
  "/images/templates/gallery-5.jpg",
  "/images/templates/gallery-6.jpg",
];

function CustomizerContent({ templateSlug }: { templateSlug: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("id");

  const targetTemplate = templatesRegistry.find((t) => t.slug === templateSlug);
  const isBirthday = targetTemplate?.category === "birthday";
  const isDualPartnerPhotoTemplate = templateSlug === "scroll-scrubber" || templateSlug === "premium-scroll" || targetTemplate?.hasDualPartnerPhotos === true;
  const showEvents = targetTemplate?.hasEvents !== false;
  const showDayTimeline = targetTemplate?.hasDayTimeline !== false;
  const showLoveStory = targetTemplate?.hasLoveStory !== false;
  const defaultSampleData = isBirthday ? sampleBirthdayData : sampleWeddingData;

  // Auth Protection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/templates/customize/${templateSlug}`);
    }
  }, [status, router, templateSlug]);

  // Form State
  const [formData, setFormData] = useState<TemplateClassicFloralProps>({
    ...defaultSampleData,
    galleryImages: defaultSampleData.galleryImages?.slice(0, 6) || DEFAULT_SIX_MOMENTS,
  });

  const [baseUrl, setBaseUrl] = useState("https://bervic-invitation-six.vercel.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
      if (window.innerWidth < 1024) {
        setActiveTab("edit");
      }
    }
  }, []);

  const [datePickerVal, setDatePickerVal] = useState(
    isBirthday ? "2026-09-15" : "2026-11-28"
  );
  const [timePickerVal, setTimePickerVal] = useState(
    isBirthday ? "18:00" : "10:30"
  );

  const [customSlug, setCustomSlug] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">("split");
  const [saving, setSaving] = useState(false);
  const [isSavedInProfile, setIsSavedInProfile] = useState<boolean>(Boolean(invitationId));
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [invitationCreatedAt, setInvitationCreatedAt] = useState<string | null>(null);
  const [invitationUnlockedByAdmin, setInvitationUnlockedByAdmin] = useState<boolean>(false);
  const [savedSuccessModal, setSavedSuccessModal] = useState(false);
  const [savedInvitationSlug, setSavedInvitationSlug] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Refs for zero-lag background auto-save without stale closures
  const invitationIdRef = useRef(invitationId);
  const savedSlugRef = useRef(savedInvitationSlug);
  const customSlugRef = useRef(customSlug);
  const formDataRef = useRef(formData);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    invitationIdRef.current = invitationId;
  }, [invitationId]);

  useEffect(() => {
    savedSlugRef.current = savedInvitationSlug;
  }, [savedInvitationSlug]);

  useEffect(() => {
    customSlugRef.current = customSlug;
  }, [customSlug]);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const performAutoSave = async (dataToSave = formDataRef.current) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`bervic_draft_${templateSlug}`, JSON.stringify(dataToSave));
    }

    setAutoSaveStatus("saving");

    const targetInvId = invitationIdRef.current || undefined;
    const targetSlug = savedSlugRef.current || customSlugRef.current.trim() || undefined;

    if (status === "authenticated") {
      try {
        const res = await fetch("/api/invitations/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invitationId: targetInvId,
            templateSlug,
            customSlug: targetSlug,
            ...dataToSave,
          }),
        });

        const resData = await res.json();
        if (res.ok && resData.invitation?.slug) {
          savedSlugRef.current = resData.invitation.slug;
          setSavedInvitationSlug(resData.invitation.slug);
          setIsSavedInProfile(true);
        }

        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus(null), 2500);
      } catch (err) {
        console.error("Auto-save sync error:", err);
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus(null), 2500);
      }
    } else {
      setAutoSaveStatus("saved");
      setTimeout(() => setAutoSaveStatus(null), 2500);
    }
  };

  const triggerAutoSave = (dataToSave = formDataRef.current) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      performAutoSave(dataToSave);
    }, 400);
  };

  // If editing an existing saved invitation, load it from DB
  useEffect(() => {
    if (invitationId && status === "authenticated") {
      fetch("/api/invitations/my-invitations")
        .then((res) => res.json())
        .then((data) => {
          if (data.invitations) {
            const found = data.invitations.find((inv: any) => inv.id === invitationId);
            if (found) {
              setIsSavedInProfile(true);
              setCustomSlug(found.slug || "");
              if (found.createdAt) setInvitationCreatedAt(found.createdAt);
              if (typeof found.isUnlockedByAdmin === "boolean") setInvitationUnlockedByAdmin(found.isUnlockedByAdmin);
              if (found.weddingDate) {
                const d = new Date(found.weddingDate);
                if (!isNaN(d.getTime())) {
                  setDatePickerVal(d.toISOString().split("T")[0]);
                }
              }
              const loadedGallery = found.galleryImagesJson ? JSON.parse(found.galleryImagesJson) : DEFAULT_SIX_MOMENTS;
              const activeGallery = Array.isArray(loadedGallery) && loadedGallery.length > 0 ? loadedGallery : DEFAULT_SIX_MOMENTS;

              setFormData({
                coupleInitials: found.coupleInitials || "Y | P",
                partnerOne: found.partnerOne || "Your Name",
                partnerTwo: found.partnerTwo || "Partner's Name",
                tagline: found.tagline || "TOGETHER WITH THEIR FAMILIES",
                inviteLine: found.inviteLine || "invite you to celebrate their wedding",
                weddingDate: found.weddingDate || "2026-11-28T10:30:00.000Z",
                weddingTime: found.weddingTime || "Saturday, 28th November 2026 at 10:30 AM IST",
                heroImage: found.heroImage || "/images/templates/floral-hero.jpg",
                coupleImage: found.coupleImage || "/images/templates/groom-bride-1.jpg",
                partnerTwoImage: found.partnerTwoImage || "/images/templates/groom-bride-2.jpg",
                venuePlace: found.venuePlace || "Your Venue Name, Your City, State",
                events: found.eventsJson ? JSON.parse(found.eventsJson) : sampleWeddingData.events,
                timelineDay: found.timelineDayJson ? JSON.parse(found.timelineDayJson) : sampleWeddingData.timelineDay,
                loveStoryText: found.loveStoryText || "",
                loveStoryVideoUrl: found.loveStoryVideoUrl || "",
                locations: found.locationsJson ? JSON.parse(found.locationsJson) : sampleWeddingData.locations,
                galleryImages: activeGallery,
                contactPhone: found.contactPhone || "",
                contactAddress: found.contactAddress || "",
                socialLinks: found.socialLinksJson ? JSON.parse(found.socialLinksJson) : sampleWeddingData.socialLinks,
              });
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [invitationId, status]);

  const handleInputChange = (field: keyof TemplateClassicFloralProps, value: any) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      formDataRef.current = updated;
      triggerAutoSave(updated);
      return updated;
    });
  };

  // Date and Time picker handlers for Main Wedding Date
  const handleMainDateChange = (dVal: string, tVal: string) => {
    setDatePickerVal(dVal);
    setTimePickerVal(tVal);

    if (dVal) {
      const isoDate = new Date(dVal + (tVal ? `T${tVal}` : "T00:00")).toISOString();
      const formattedText = formatMainDateAndTime(dVal, tVal);
      const formattedEventDate = formatEventDate(dVal);

      setFormData((prev) => ({
        ...prev,
        weddingDate: isoDate,
        weddingTime: formattedText,
        // Auto-fetch & sync the user's selected wedding date to all events in the Wedding Events Suite
        events: prev.events.map((ev) => ({
          ...ev,
          date: formattedEventDate,
        })),
        // Auto-fetch & sync the user's selected wedding date to all timeline items in Day Timeline
        timelineDay: prev.timelineDay.map((tl) => ({
          ...tl,
          date: formattedEventDate,
        })),
      }));
    }
  };

  const handleBack = () => {
    const fromParam = searchParams.get("from");
    if (fromParam === "dashboard" || invitationId) {
      router.push("/dashboard");
      return;
    }
    if (fromParam === "templates") {
      router.push("/templates");
      return;
    }
    if (typeof window !== "undefined" && document.referrer) {
      if (document.referrer.includes("/dashboard")) {
        router.push("/dashboard");
        return;
      }
      if (document.referrer.includes("/templates")) {
        router.push("/templates");
        return;
      }
    }
    router.push("/templates");
  };

  // Helper arrays update functions
  const handleEventChange = (index: number, key: keyof WeddingEvent, value: string) => {
    const updated = [...formData.events];
    updated[index] = { ...updated[index], [key]: value };
    handleInputChange("events", updated);
  };

  const handleEventPickerDateChange = (index: number, rawDate: string) => {
    const formatted = formatEventDate(rawDate);
    handleEventChange(index, "date", formatted);
  };

  const handleEventPickerTimeChange = (index: number, rawTime: string) => {
    const formatted = formatEventTime(rawTime);
    handleEventChange(index, "time", formatted);
  };

  const addEvent = () => {
    const defaultDate = datePickerVal ? formatEventDate(datePickerVal) : "Nov 28, 2026";
    handleInputChange("events", [
      ...formData.events,
      { icon: "✨", title: "New Function", time: "05:00 PM IST", date: defaultDate },
    ]);
  };

  const removeEvent = (index: number) => {
    handleInputChange(
      "events",
      formData.events.filter((_, i) => i !== index)
    );
  };

  const handleTimelineChange = (index: number, key: keyof TimelineStep, value: any) => {
    const updated = [...formData.timelineDay];
    updated[index] = { ...updated[index], [key]: value };
    handleInputChange("timelineDay", updated);
  };

  const handleTimelinePickerDateChange = (index: number, rawDate: string) => {
    const formatted = formatEventDate(rawDate);
    handleTimelineChange(index, "date", formatted);
  };

  const handleTimelinePickerTimeChange = (index: number, rawTime: string) => {
    const formatted = formatTimelineTime(rawTime);
    handleTimelineChange(index, "time", formatted);
  };

  const addTimelineItem = () => {
    const defaultDate = datePickerVal ? formatEventDate(datePickerVal) : "Nov 28, 2026";
    handleInputChange("timelineDay", [
      ...formData.timelineDay,
      {
        order: formData.timelineDay.length + 1,
        icon: "🎉",
        title: "Special Moment",
        time: "06:00 PM",
        date: defaultDate,
        status: "upcoming",
      },
    ]);
  };

  const removeTimelineItem = (index: number) => {
    handleInputChange(
      "timelineDay",
      formData.timelineDay.filter((_, i) => i !== index)
    );
  };

  const handleLocationChange = (index: number, key: keyof LocationVenue, value: string) => {
    const updated = [...formData.locations];
    updated[index] = { ...updated[index], [key]: value };
    handleInputChange("locations", updated);
  };

  const addLocation = () => {
    handleInputChange("locations", [
      ...formData.locations,
      {
        name: "New Venue Location",
        venueLabel: "Venue Sub-Label",
        address: "Address line, City, State",
        mapLink: "https://maps.google.com",
        image: "/images/templates/venue-ceremony.jpg",
      },
    ]);
  };

  const removeLocation = (index: number) => {
    handleInputChange(
      "locations",
      formData.locations.filter((_, i) => i !== index)
    );
  };

  // Dynamic Gallery Images Handlers
  const handleGalleryImageChange = (index: number, url: string) => {
    const current = [...(formData.galleryImages || [])];
    current[index] = url;
    handleInputChange("galleryImages", current);
  };

  const addGalleryImage = () => {
    const current = [...(formData.galleryImages || [])];
    if (current.length >= 6) return;
    handleInputChange("galleryImages", [...current, "/images/templates/gallery-1.jpg"]);
  };

  const removeGalleryImage = (index: number) => {
    const current = [...(formData.galleryImages || [])];
    handleInputChange(
      "galleryImages",
      current.filter((_, i) => i !== index)
    );
  };

  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingReason, setPricingReason] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/invitations/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: invitationId || undefined,
          templateSlug,
          customSlug: customSlug.trim() || undefined,
          ...formData,
        }),
      });

      const data = await res.json();

      if (res.status === 402 || data.error === "PAYMENT_REQUIRED" || data.error === "QUOTA_EXCEEDED") {
        router.push(`/checkout?required=true&template=${templateSlug}`);
        setSaving(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to save invitation");
      }

      const savedSlug = data.invitation?.slug || "";
      const newInvId = data.invitation?.id;

      setSavedInvitationSlug(savedSlug);
      setCustomSlug(savedSlug);
      setIsSavedInProfile(true);

      if (newInvId) {
        invitationIdRef.current = newInvId;
        savedSlugRef.current = savedSlug;
        router.replace(`/templates/customize/${templateSlug}?id=${newInvId}&from=dashboard`);
      }

      setSavedSuccessModal(true);
    } catch (err: any) {
      setErrorMsg(err?.message || "Error saving invitation to database");
    } finally {
      setSaving(false);
    }
  };

  const copyShareLink = () => {
    if (typeof window !== "undefined" && savedInvitationSlug) {
      const url = `${window.location.origin}/invitations/${savedInvitationSlug}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F3EA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#7A1F2B] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-[#7A1F2B]">Checking login status...</span>
        </div>
      </div>
    );
  }

  // Ensure gallery list always has 6 items
  const galleryList = Array.from({ length: 6 }, (_, i) => (formData.galleryImages || [])[i] || DEFAULT_SIX_MOMENTS[i]);

  // Compute Lock Status
  const lockStatus = checkInvitationLockStatus({
    createdAt: invitationCreatedAt || new Date(),
    weddingDate: formData.weddingDate,
    isUnlockedByAdmin: invitationUnlockedByAdmin,
  });

  const isEditingLockedForUser = lockStatus.isLocked && session?.user?.email?.toLowerCase() !== "berglin1998@gmail.com";

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EA] text-[#221C17]">
      {/* Top Lock Banner if Editing is Locked */}
      {isEditingLockedForUser && (
        <div className="bg-rose-900 text-rose-100 border-b border-rose-700 px-4 py-3 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-md z-[110] sticky top-0">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-300 shrink-0" />
            <span>{lockStatus.lockReason || "Editing for this invitation is locked 2 hours prior to your wedding date to protect invitation data."}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] shrink-0 uppercase tracking-widest">
            🔒 LOCKED FOR EVENT
          </span>
        </div>
      )}
      {/* Top Header Controls Bar */}
      <header className="fixed top-0 inset-x-0 z-[100] bg-[#F8F3EA] border-b border-[#D9A441]/40 px-2 sm:px-6 py-2 sm:py-3 shadow-md">
        <div className="max-w-[1450px] mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Left Title & Back Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={handleBack}
              className="p-2 rounded-full bg-[#EFE7D8] text-[#7A1F2B] hover:bg-[#D9A441]/20 transition-colors shadow-sm"
              title={invitationId || searchParams.get("from") === "dashboard" ? "Back to Dashboard" : "Back to Templates"}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="hidden md:block">
              <span className="text-[9px] sm:text-[10px] uppercase font-extrabold text-[#D9A441] tracking-widest block leading-none">
                BERVIC BUILDER
              </span>
              <h1 className="text-xs sm:text-base font-bold text-[#221C17] leading-tight mt-0.5">
                {targetTemplate?.title || "Invitation Builder"}
              </h1>
            </div>
          </div>

          {/* Center Tabs & Right Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* View Mode Tab Selector */}
            <div className="inline-flex items-center p-0.5 sm:p-1 rounded-full bg-[#EFE7D8] border border-[#D9A441]/40 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all ${
                  activeTab === "edit"
                    ? "bg-[#7A1F2B] text-[#F8F3EA] shadow-md"
                    : "text-[#221C17]/70 hover:text-[#221C17]"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Form Editor</span>
                <span className="sm:hidden">Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("split")}
                className={`hidden lg:flex px-3 py-1.5 rounded-full text-xs font-bold items-center gap-1.5 transition-all ${
                  activeTab === "split"
                    ? "bg-[#7A1F2B] text-[#F8F3EA] shadow-md"
                    : "text-[#221C17]/70 hover:text-[#221C17]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Split Screen</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all ${
                  activeTab === "preview"
                    ? "bg-[#7A1F2B] text-[#F8F3EA] shadow-md"
                    : "text-[#221C17]/70 hover:text-[#221C17]"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Live Preview</span>
                <span className="sm:hidden">Preview</span>
              </button>
            </div>

            {/* Dashboard Link Button */}
            <Link
              href="/dashboard"
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-[#7A1F2B] text-[#7A1F2B] text-xs font-bold hover:bg-[#7A1F2B]/10 transition-colors flex items-center gap-1 sm:gap-1.5 shadow-sm"
              title="Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#7A1F2B]" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            {/* Auto Save Status Indicator */}
            {autoSaveStatus && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7D8] text-[11px] font-bold text-[#7A1F2B] border border-[#D9A441]/30">
                {autoSaveStatus === "saving" ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Auto-saved</span>
                  </>
                )}
              </div>
            )}

            {/* Manual Save Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#EFE7D8] text-[#7A1F2B] border-2 border-[#7A1F2B]/40 text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:bg-[#7A1F2B] hover:text-[#F8F3EA] transition-all disabled:opacity-50 shrink-0"
              title="Click to manually save all changes"
            >
              <Save className="w-3.5 h-3.5 text-[#7A1F2B]" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>

            {/* Select This Template / Selected in Profile Button */}
            {isSavedInProfile ? (
              <div className="hidden sm:flex px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-extrabold items-center gap-1.5 shadow-sm shrink-0">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Selected in Profile</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-maroon px-3.5 sm:px-4.5 py-1.5 sm:py-2 text-xs font-extrabold flex items-center gap-1.5 shadow-md disabled:opacity-50 shrink-0 hover:scale-105 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>{saving ? "Selecting Template..." : "Select This Template ✨"}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 pt-20 max-w-[1500px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Panel: Form Editor */}
        <div
          data-lenis-prevent
          className={`p-6 sm:p-8 bg-[#F8F3EA] border-r border-[#D9A441]/20 overflow-y-auto max-h-[calc(100vh-80px)] ${
            activeTab === "edit"
              ? "col-span-12 block"
              : activeTab === "split"
              ? "hidden lg:block col-span-12 lg:col-span-5"
              : "hidden"
          }`}
        >
          <div className="space-y-8 max-w-xl mx-auto pb-16">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-[#7A1F2B]/10 border border-[#7A1F2B]/40 text-[#7A1F2B] text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#7A1F2B]" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Custom Route Link Step */}
            <div className="bg-[#F8F3EA] border-2 border-[#D9A441]/50 rounded-3xl p-6 card-shadow space-y-3">
              <h3 className="text-base font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-2 border-b border-[#D9A441]/20 pb-3">
                <Globe className="w-4 h-4 text-[#D9A441]" />
                <span>Custom Invitation Route Link</span>
              </h3>
              <p className="text-xs text-[#221C17]/70">
                Choose a unique web address link for your invitation card:
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#7A1F2B] bg-[#EFE7D8] px-3 py-2.5 rounded-xl border border-[#D9A441]/40 shrink-0">
                  /invitations/
                </span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="e.g. berglin-and-viclito"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border-2 border-[#D9A441]/50 text-xs font-bold text-[#7A1F2B] focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>
              <span className="text-[10px] text-[#221C17]/60 block font-medium">
                Live URL Preview: <strong className="text-[#7A1F2B]">{baseUrl}/invitations/{customSlug || "your-custom-link"}</strong>
              </span>
            </div>

            {/* Step 1: Details */}
            <div className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow space-y-4">
              <h3 className="text-base font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-2 border-b border-[#D9A441]/20 pb-3">
                <Heart className="w-4 h-4 text-[#D9A441] fill-current" />
                <span>{isBirthday ? "1. Celebrant & Event Details" : "1. Couple Details"}</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
                    {isBirthday ? "Celebrant Name" : "Partner One Name"}
                  </label>
                  <input
                    type="text"
                    value={formData.partnerOne}
                    onChange={(e) => handleInputChange("partnerOne", e.target.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder={isBirthday ? "Celebrant Name" : "Your Name"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
                    {isBirthday ? "Secondary Name (Optional)" : "Partner Two Name"}
                  </label>
                  <input
                    type="text"
                    value={formData.partnerTwo}
                    onChange={(e) => handleInputChange("partnerTwo", e.target.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder={isBirthday ? "Optional Subtitle/Name" : "Partner's Name"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
                    Monogram Initials
                  </label>
                  <input
                    type="text"
                    value={formData.coupleInitials}
                    onChange={(e) => handleInputChange("coupleInitials", e.target.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder="Y | P"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                    onFocus={(e) => e.target.select()}
                    placeholder="TOGETHER WITH THEIR FAMILIES"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
                  Invitation Line
                </label>
                <input
                  type="text"
                  value={formData.inviteLine}
                  onChange={(e) => handleInputChange("inviteLine", e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="invite you to celebrate their wedding"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>
            </div>

            {/* Step 2: Date & Venue */}
            <div className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow space-y-4">
              <h3 className="text-base font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-2 border-b border-[#D9A441]/20 pb-3">
                <Calendar className="w-4 h-4 text-[#D9A441]" />
                <span>{isBirthday ? "2. Select Event Date & Time" : "2. Select Wedding Date & Time"}</span>
              </h3>

              {/* Native Calendar & Time Pickers Row */}
              <div className="grid grid-cols-2 gap-4 bg-[#EFE7D8]/60 p-4 rounded-2xl border border-[#D9A441]/30">
                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] mb-1">
                    📅 Select Date
                  </label>
                  <input
                    type="date"
                    value={datePickerVal}
                    onChange={(e) => handleMainDateChange(e.target.value, timePickerVal)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/50 text-xs font-semibold focus:outline-none focus:border-[#7A1F2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] mb-1">
                    ⏰ Select Time
                  </label>
                  <input
                    type="time"
                    value={timePickerVal}
                    onChange={(e) => handleMainDateChange(datePickerVal, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/50 text-xs font-semibold focus:outline-none focus:border-[#7A1F2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
                  Formatted Display Date Text (Auto-generated or custom)
                </label>
                <input
                  type="text"
                  value={formData.weddingTime}
                  onChange={(e) => handleInputChange("weddingTime", e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="Saturday, 28th November 2026 at 10:30 AM IST"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
                  Venue Place & City
                </label>
                <input
                  type="text"
                  value={formData.venuePlace}
                  onChange={(e) => handleInputChange("venuePlace", e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="Your Venue Name, Your City, State"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>
            </div>

            {/* Step 3: Photos & Image Uploaders (Cloudinary) */}
            <div className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow space-y-6">
              <h3 className="text-base font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-2 border-b border-[#D9A441]/20 pb-3">
                <ImageIcon className="w-4 h-4 text-[#D9A441]" />
                <span>3. Main Photos & Image Uploads (Cloudinary)</span>
              </h3>

              {/* Hero Background Banner Photo - Hide for canvas video sequence templates */}
              {templateSlug !== "scroll-scrubber" && (
                <CloudinaryUploader
                  label="Hero Background Banner Photo"
                  value={formData.heroImage}
                  onChange={(url) => handleInputChange("heroImage", url)}
                  placeholder="/images/templates/floral-hero.jpg"
                />
              )}

              {/* Couple / Partner Photos Uploader */}
              {isDualPartnerPhotoTemplate ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CloudinaryUploader
                    label={`${isBirthday ? "Celebrant Photo" : "Partner One (Groom) Photo"}`}
                    value={formData.coupleImage}
                    onChange={(url) => handleInputChange("coupleImage", url)}
                    placeholder="/images/templates/groom-bride-1.jpg"
                  />

                  <CloudinaryUploader
                    label={`${isBirthday ? "Secondary Photo" : "Partner Two (Bride) Photo"}`}
                    value={formData.partnerTwoImage || ""}
                    onChange={(url) => handleInputChange("partnerTwoImage", url)}
                    placeholder="/images/templates/groom-bride-2.jpg"
                  />
                </div>
              ) : (
                <CloudinaryUploader
                  label={`${isBirthday ? "Celebrant Photo" : "Couple Portrait Photo"}`}
                  value={formData.coupleImage}
                  onChange={(url) => handleInputChange("coupleImage", url)}
                  placeholder="/images/templates/couple-photo.jpg"
                />
              )}

              {/* Moments Gallery Uploaders (Up to 6 Photos) */}
              <div className="pt-4 border-t border-[#D9A441]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                    <span>Our Moments Gallery (Upload Up to 6 Photos)</span>
                  </h4>
                  <span className="text-[10px] text-[#7A1F2B] font-bold bg-[#EFE7D8] px-2 py-0.5 rounded-full border border-[#D9A441]/30">
                    {(formData.galleryImages || []).length} / 6 Photos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[0, 1, 2, 3, 4, 5].map((slotIdx) => (
                    <CloudinaryUploader
                      key={slotIdx}
                      label={`Moment Photo ${slotIdx + 1}`}
                      value={(formData.galleryImages && formData.galleryImages[slotIdx]) || ""}
                      onChange={(url) => {
                        const currentList = [...(formData.galleryImages || DEFAULT_SIX_MOMENTS)];
                        currentList[slotIdx] = url;
                        handleInputChange("galleryImages", currentList);
                      }}
                      placeholder={`/images/templates/gallery-${slotIdx + 1}.jpg`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Wedding Events Suite */}
            <div className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow space-y-4">
              <div className="flex items-center justify-between border-b border-[#D9A441]/20 pb-3">
                <h3 className="text-base font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D9A441]" />
                  <span>4. Wedding Events Suite ({formData.events.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={addEvent}
                  className="text-xs text-[#7A1F2B] font-bold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Function</span>
                </button>
              </div>

              {formData.events.map((ev, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#EFE7D8]/60 border border-[#D9A441]/30 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeEvent(idx)}
                    className="absolute top-3 right-3 text-[#7A1F2B] opacity-60 hover:opacity-100 transition-opacity"
                    title="Remove Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2.5 pr-6">
                    <div className="w-16 shrink-0">
                      <label className="block text-[10px] font-bold text-[#221C17]/70 mb-1">Icon</label>
                      <input
                        type="text"
                        value={ev.icon}
                        onChange={(e) => handleEventChange(idx, "icon", e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-full px-2 py-1.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs text-center font-bold"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-[10px] font-bold text-[#221C17]/70 mb-1">Function Title</label>
                      <input
                        type="text"
                        value={ev.title}
                        onChange={(e) => handleEventChange(idx, "title", e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-[#7A1F2B] mb-1 truncate">
                        📅 Date (Synced / Custom)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="date"
                          value={parseDateToIsoString(ev.date, datePickerVal)}
                          onChange={(e) => handleEventPickerDateChange(idx, e.target.value)}
                          className="w-28 shrink-0 px-2 py-1.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs font-semibold focus:outline-none focus:border-[#7A1F2B]"
                        />
                        <input
                          type="text"
                          value={ev.date}
                          onChange={(e) => handleEventChange(idx, "date", e.target.value)}
                          onFocus={(e) => e.target.select()}
                          placeholder="Nov 28, 2026"
                          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs font-semibold focus:outline-none focus:border-[#7A1F2B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#7A1F2B] mb-1 truncate">
                        ⏰ Time
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="time"
                          onChange={(e) => handleEventPickerTimeChange(idx, e.target.value)}
                          className="w-20 shrink-0 px-2 py-1.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs font-semibold focus:outline-none focus:border-[#7A1F2B]"
                        />
                        <input
                          type="text"
                          value={ev.time}
                          onChange={(e) => handleEventChange(idx, "time", e.target.value)}
                          placeholder="10:30 AM IST"
                          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs font-semibold focus:outline-none focus:border-[#7A1F2B]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Step 5: Timeline Day (Only rendered if template supports it) */}
            {showDayTimeline && (
              <div className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow space-y-4">
                <div className="flex items-center justify-between border-b border-[#D9A441]/20 pb-3">
                  <h3 className="text-base font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D9A441]" />
                    <span>5. Day Timeline ({formData.timelineDay.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addTimelineItem}
                    className="text-xs text-[#7A1F2B] font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Timeline Item</span>
                  </button>
                </div>

                {formData.timelineDay.map((tl, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#EFE7D8]/60 border border-[#D9A441]/30 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tl.icon}
                        onChange={(e) => handleTimelineChange(idx, "icon", e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-10 px-2 py-1.5 rounded-lg bg-[#F8F3EA] border text-xs text-center shrink-0 font-bold"
                      />
                      <input
                        type="text"
                        value={tl.title}
                        onChange={(e) => handleTimelineChange(idx, "title", e.target.value)}
                        onFocus={(e) => e.target.select()}
                        placeholder="Title"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#F8F3EA] border text-xs font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => removeTimelineItem(idx)}
                        className="text-[#7A1F2B] opacity-60 hover:opacity-100 transition-opacity"
                        title="Remove Timeline Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-[#7A1F2B] mb-0.5 truncate">📅 Date</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="date"
                            value={parseDateToIsoString(tl.date, datePickerVal)}
                            onChange={(e) => handleTimelinePickerDateChange(idx, e.target.value)}
                            className="w-28 shrink-0 px-2 py-1 rounded-lg bg-[#F8F3EA] border text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={tl.date || (datePickerVal ? formatEventDate(datePickerVal) : "")}
                            onChange={(e) => handleTimelineChange(idx, "date", e.target.value)}
                            onFocus={(e) => e.target.select()}
                            placeholder="Nov 28, 2026"
                            className="flex-1 min-w-0 px-2.5 py-1 rounded-lg bg-[#F8F3EA] border text-xs font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#7A1F2B] mb-0.5 truncate">⏰ Time</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="time"
                            onChange={(e) => handleTimelinePickerTimeChange(idx, e.target.value)}
                            className="w-20 shrink-0 px-2 py-1 rounded-lg bg-[#F8F3EA] border text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={tl.time}
                            onChange={(e) => handleTimelineChange(idx, "time", e.target.value)}
                            onFocus={(e) => e.target.select()}
                            placeholder="07:00 PM"
                            className="flex-1 min-w-0 px-2.5 py-1 rounded-lg bg-[#F8F3EA] border text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 6: Love Story & Video Glimpse (Only rendered if template supports it) */}
            {showLoveStory && (
              <div className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow space-y-4">
                <div className="flex items-center justify-between border-b border-[#D9A441]/20 pb-3">
                  <h3 className="text-base font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#D9A441]" />
                    <span>6. Love Story & Video Section</span>
                  </h3>
                  {/* Toggle / Delete Access Control */}
                  <button
                    type="button"
                    onClick={() => handleInputChange("showVideoSection", !(formData.showVideoSection ?? true))}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      (formData.showVideoSection ?? true)
                        ? "bg-[#7A1F2B] text-[#F8F3EA] border-[#7A1F2B] shadow-sm"
                        : "bg-[#EFE7D8] text-[#221C17]/60 border-[#D9A441]/40 hover:text-[#7A1F2B]"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{(formData.showVideoSection ?? true) ? "Video Enabled" : "Video Disabled (Deleted)"}</span>
                  </button>
                </div>

                {(formData.showVideoSection ?? true) ? (
                  <div className="space-y-4">
                    {/* YouTube Guide Box */}
                    <div className="p-4 rounded-2xl bg-[#EFE7D8]/80 border border-[#D9A441]/40 text-xs text-[#221C17]/80 space-y-2">
                      <h4 className="font-bold text-[#7A1F2B] flex items-center gap-1.5">
                        <span>💡 How to Add Your YouTube Wedding Video</span>
                      </h4>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-[#221C17]/75 font-medium">
                        <li>Upload your wedding teaser or glimpse video to <strong>YouTube</strong> (Set visibility to <em>Public</em> or <em>Unlisted</em>).</li>
                        <li>In YouTube Studio under <strong>Advanced Settings</strong>, ensure <strong>"Allow embedding"</strong> is turned <strong>ON</strong>.</li>
                        <li>Copy the YouTube video link from your browser address bar or share button (e.g. <code>https://www.youtube.com/watch?v=...</code> or <code>https://youtu.be/...</code>) and paste it below!</li>
                      </ol>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#7A1F2B] mb-1">
                        Paste YouTube Video Link
                      </label>
                      <input
                        type="url"
                        value={formData.loveStoryVideoUrl}
                        onChange={(e) => handleInputChange("loveStoryVideoUrl", e.target.value)}
                        onFocus={(e) => e.target.select()}
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/50 text-xs font-semibold text-[#7A1F2B] focus:outline-none focus:border-[#7A1F2B]"
                      />
                      <span className="text-[10px] text-[#221C17]/60 block mt-1">
                        Supports standard YouTube watch links, shorts, shortlinks (youtu.be), and embed URLs.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
                        Love Story Narrative Text
                      </label>
                      <textarea
                        rows={4}
                        value={formData.loveStoryText}
                        onChange={(e) => handleInputChange("loveStoryText", e.target.value)}
                        onFocus={(e) => e.target.select()}
                        placeholder="Enter your love story narrative here..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#EFE7D8]/40 border border-dashed border-[#D9A441]/40 text-center text-xs text-[#221C17]/60">
                    <p>The Video Section is currently <strong>disabled / deleted</strong> from your invitation card.</p>
                    <button
                      type="button"
                      onClick={() => handleInputChange("showVideoSection", true)}
                      className="mt-2 text-xs font-bold text-[#7A1F2B] underline hover:text-[#D9A441]"
                    >
                      Click to Enable Video Section
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 7: Venues & Map Locations */}
            <div className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow space-y-6">
              <div className="flex items-center justify-between border-b border-[#D9A441]/20 pb-3">
                <h3 className="text-base font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D9A441]" />
                  <span>7. Venue Locations & Maps ({formData.locations.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={addLocation}
                  className="text-xs text-[#7A1F2B] font-bold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Location</span>
                </button>
              </div>

              {formData.locations.map((loc, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#EFE7D8]/60 border border-[#D9A441]/30 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeLocation(idx)}
                    className="absolute top-3 right-3 text-[#7A1F2B] opacity-60 hover:opacity-100 z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    <label className="block text-[10px] font-semibold mb-1">Venue Main Title</label>
                    <input
                      type="text"
                      value={loc.name}
                      onChange={(e) => handleLocationChange(idx, "name", e.target.value)}
                      onFocus={(e) => e.target.select()}
                      placeholder="Marriage Ceremony Venue"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#F8F3EA] border text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold mb-1">Venue Sub-Label</label>
                    <input
                      type="text"
                      value={loc.venueLabel}
                      onChange={(e) => handleLocationChange(idx, "venueLabel", e.target.value)}
                      onFocus={(e) => e.target.select()}
                      placeholder="Your Ceremony Hall"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#F8F3EA] border text-xs"
                    />
                  </div>

                  {/* Cloudinary Venue Photo Uploader */}
                  <CloudinaryUploader
                    label="Venue Photo"
                    value={loc.image || "/images/templates/venue-ceremony.jpg"}
                    onChange={(url) => handleLocationChange(idx, "image", url)}
                    placeholder="/images/templates/venue-ceremony.jpg"
                  />

                  <div>
                    <label className="block text-[10px] font-semibold mb-1">Venue Address</label>
                    <input
                      type="text"
                      value={loc.address}
                      onChange={(e) => handleLocationChange(idx, "address", e.target.value)}
                      onFocus={(e) => e.target.select()}
                      placeholder="Address line, City, State"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#F8F3EA] border text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold mb-1">Google Maps Link</label>
                    <input
                      type="text"
                      value={loc.mapLink}
                      onChange={(e) => handleLocationChange(idx, "mapLink", e.target.value)}
                      onFocus={(e) => e.target.select()}
                      placeholder="https://maps.google.com"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#F8F3EA] border text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Step 8: Dynamic Moments Photo Gallery Suite */}
            <div className="bg-[#F8F3EA] border-2 border-[#D9A441]/50 rounded-3xl p-6 card-shadow space-y-6">
              <div className="flex items-center justify-between border-b border-[#D9A441]/20 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#D9A441]" />
                    <span>8. Our Moments Gallery ({(formData.galleryImages || []).length}/6 Photos)</span>
                  </h3>
                  <p className="text-xs text-[#221C17]/70 mt-1">
                    Upload up to 6 favorite wedding photos (Maximum 6 photos). Use <strong>"Remove Photo"</strong> to delete unwanted photos.
                  </p>
                </div>
                {(formData.galleryImages || []).length < 6 ? (
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="text-xs text-[#7A1F2B] font-bold flex items-center gap-1 hover:underline bg-[#EFE7D8] px-3 py-1.5 rounded-xl border border-[#D9A441]/40 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-[#7A1F2B] font-bold bg-[#7A1F2B]/10 px-3 py-1.5 rounded-xl border border-[#7A1F2B]/20 shrink-0">
                    Max 6 Photos Reached
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {(formData.galleryImages || []).map((imgUrl, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#EFE7D8]/60 border border-[#D9A441]/30 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#7A1F2B]">Our Moment #{idx + 1}</span>
                      {(formData.galleryImages || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="text-xs text-[#7A1F2B] font-bold flex items-center gap-1 hover:underline text-[#7A1F2B]/80 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Photo</span>
                        </button>
                      )}
                    </div>
                    <CloudinaryUploader
                      label=""
                      value={imgUrl}
                      onChange={(url) => handleGalleryImageChange(idx, url)}
                      placeholder={`/images/templates/gallery-${(idx % 6) + 1}.jpg`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Step 9: Contact Information */}
            <div className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow space-y-4">
              <h3 className="text-base font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-2 border-b border-[#D9A441]/20 pb-3">
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
                <span>9. Contact Information</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
                  Contact Address
                </label>
                <input
                  type="text"
                  value={formData.contactAddress}
                  onChange={(e) => handleInputChange("contactAddress", e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="Your City, State, Country"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Live Real-Time Interactive Template Preview */}
        <div
          data-lenis-prevent
          className={`bg-[#221C17] overflow-y-auto max-h-[calc(100vh-80px)] ${
            activeTab === "preview"
              ? "col-span-12 block"
              : activeTab === "split"
              ? "hidden lg:block col-span-12 lg:col-span-7"
              : "hidden"
          }`}
        >
          <div className="relative shadow-2xl">
            <DynamicTemplateCard {...formData} templateSlug={templateSlug} isCustomizer={true} />
          </div>

        </div>
      </main>

      {/* Mobile Quick Floating View Toggle Pill Bar */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#221C17]/90 backdrop-blur-md border-2 border-[#D9A441] text-[#F8F3EA] px-4 py-2 rounded-full shadow-2xl flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("edit")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === "edit" || activeTab === "split"
              ? "bg-[#7A1F2B] text-[#F8F3EA] shadow-md"
              : "text-[#F8F3EA]/70 hover:text-white"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Form</span>
        </button>
        <div className="w-px h-4 bg-[#D9A441]/40" />
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === "preview"
              ? "bg-[#7A1F2B] text-[#F8F3EA] shadow-md"
              : "text-[#F8F3EA]/70 hover:text-white"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Success Modal Overlay */}
      {savedSuccessModal && (
        <div className="fixed inset-0 z-[200] bg-[#221C17]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8F3EA] border-2 border-[#D9A441] rounded-3xl p-8 max-w-md w-full text-center card-shadow space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#5B8C69]/15 text-[#5B8C69] flex items-center justify-center mx-auto border border-[#5B8C69]/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#221C17]">Invitation Saved!</h3>
              <p className="text-sm text-[#221C17]/70 mt-2">
                Your customized invitation has been successfully saved to your profile in PostgreSQL database.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/dashboard"
                className="btn-maroon w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <LayoutDashboard className="w-4 h-4 text-[#D9A441]" />
                <span>Go to My Dashboard</span>
              </Link>

              {savedInvitationSlug && (
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="w-full py-3 rounded-full border border-[#D9A441] text-[#221C17] text-xs font-semibold hover:bg-[#D9A441]/20 flex items-center justify-center gap-2"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#5B8C69]" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#7A1F2B]" />
                      <span>Copy Invitation Share Link</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => setSavedSuccessModal(false)}
                className="text-xs text-[#221C17]/60 hover:text-[#221C17] block mx-auto pt-2"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Checkout Modal */}
      {showPricingModal && (
        <PricingCheckoutModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          onSuccess={() => handleSave()}
          reason={pricingReason}
        />
      )}
    </div>
  );
}

export default function CustomizeTemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const templateSlug = resolvedParams.slug || "classic-floral";

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F8F3EA] text-xs font-bold text-[#7A1F2B]">Loading builder...</div>}>
      <CustomizerContent templateSlug={templateSlug} />
    </Suspense>
  );
}
