"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PdfCardExportModal from "@/components/dashboard/PdfCardExportModal";
import { Skeleton } from "@/components/ui/skeleton";
import { setProfileHasDetailsCache } from "@/lib/useRequireLoginAndDetails";
import type { EventProfileData } from "@/components/dashboard/EventProfileModal";
import { templatesRegistry } from "@/data/templatesRegistry";
import {
  Sparkles,
  Calendar,
  Edit3,
  ExternalLink,
  Share2,
  Plus,
  Heart,
  Cake,
  Check,
  Globe,
  FileText,
  MessageSquare,
  Crown,
  Zap,
  ShieldCheck,
  Layers,
  CreditCard,
  Image as ImageIcon,
  User,
  Star,
  Trash2,
  CheckCircle2,
  Lock,
  Package,
} from "lucide-react";

interface SavedInvitation {
  id: string;
  templateSlug: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  weddingTime: string;
  venuePlace: string;
  slug: string;
  updatedAt: string;
  heroImage?: string;
  coupleImage?: string;
  tagline?: string;
  isLocked?: boolean;
  lockReason?: string;
  timeUntilLockText?: string;
}

interface SavedCard {
  id: string;
  templateId: number;
  templateName: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  weddingTime?: string;
  venue?: string;
  city?: string;
  createdAt: string;
}

interface SubscriptionData {
  plan: string;
  planExpiresAt: string | null;
  isActive: boolean;
  allowedTemplatesCount: number;
  allowedCinematicCount?: number;
  allowedCardsCount: number;
  usedTemplatesCount: number;
  usedCinematicCount?: number;
  usedCardsCount: number;
  remainingTemplateSlots: number;
  remainingCinematicSlots?: number;
  remainingCardSlots: number;
  savedCards: SavedCard[];
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-20 sm:pt-28 md:pt-32 pb-16">
        {/* Top Welcome Card Skeleton */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6 mb-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full">
            <Skeleton className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-20 h-3 rounded-md" />
              <Skeleton className="w-40 sm:w-56 h-5 rounded-lg" />
              <Skeleton className="w-32 h-3 rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full md:w-auto pt-2 sm:pt-0">
            <Skeleton className="h-9 rounded-xl w-full sm:w-28" />
            <Skeleton className="h-9 rounded-xl w-full sm:w-36" />
          </div>
        </div>

        {/* Segmented Tabs Skeleton */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200/60 mb-8 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1.5 sm:pb-0">
            <Skeleton className="w-36 h-10 rounded-2xl shrink-0" />
            <Skeleton className="w-36 h-10 rounded-2xl shrink-0" />
            <Skeleton className="w-40 h-10 rounded-2xl shrink-0" />
          </div>
          <Skeleton className="w-48 h-4 rounded-md" />
        </div>

        {/* Section Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="space-y-2">
            <Skeleton className="w-48 h-6 rounded-lg" />
            <Skeleton className="w-72 sm:w-96 h-3.5 rounded-md" />
          </div>
          <Skeleton className="w-36 h-9 rounded-xl shrink-0" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="w-20 h-5 rounded-full" />
                <Skeleton className="w-24 h-5 rounded-full" />
              </div>
              <div className="space-y-2 py-2">
                <Skeleton className="w-3/4 h-5 rounded-lg" />
                <Skeleton className="w-1/2 h-4 rounded-md" />
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Skeleton className="w-full h-3 rounded" />
                <Skeleton className="w-5/6 h-3 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3">
                <Skeleton className="h-8 rounded-xl" />
                <Skeleton className="h-8 rounded-xl" />
                <Skeleton className="h-8 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"profiles" | "invitations" | "subscription">(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam === "invitations" || tabParam === "subscription" || tabParam === "profiles") {
      return tabParam;
    }
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("bervic_active_dashboard_tab") as "profiles" | "invitations" | "subscription" | null;
      if (cached === "invitations" || cached === "subscription" || cached === "profiles") {
        return cached;
      }
    }
    return "profiles";
  });

  const handleTabChange = (tab: "profiles" | "invitations" | "subscription") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("bervic_active_dashboard_tab", tab);
    }
  };

  const [invitations, setInvitations] = useState<SavedInvitation[]>([]);
  const [subData, setSubData] = useState<SubscriptionData>({
    plan: "NONE",
    planExpiresAt: null,
    isActive: false,
    allowedTemplatesCount: 0,
    allowedCardsCount: 0,
    usedTemplatesCount: 0,
    usedCardsCount: 0,
    remainingTemplateSlots: 0,
    remainingCardSlots: 0,
    savedCards: [],
  });
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Multi-Profile States
  const [eventProfiles, setEventProfiles] = useState<EventProfileData[]>([]);
  const [activeProfile, setActiveProfile] = useState<EventProfileData | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  // Modals state
  const [activePdfInv, setActivePdfInv] = useState<SavedInvitation | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleAddProfileClick = () => {
    const isSuperAdmin = session?.user?.email?.toLowerCase() === "berglin1998@gmail.com";
    const hasSubscription = subData.isActive || (subData.remainingTemplateSlots ?? 0) > 0 || (subData.plan && subData.plan !== "NONE");
    if (eventProfiles.length >= 1 && !hasSubscription && !isSuperAdmin) {
      setShowUpgradeModal(true);
    } else {
      router.push("/dashboard/event-profile?new=true");
    }
  };

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/user/event-draft?all=true");
      const data = await res.json();
      const profiles: EventProfileData[] = data.profiles || [];

      setEventProfiles(profiles);
      const active = profiles.find((p: EventProfileData) => p.isActive) || profiles[0] || null;
      setActiveProfile(active);
    } catch (err) {
      console.error("Error fetching event profiles:", err);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard");
      return;
    }

    if (status === "authenticated") {
      const loadAllData = async () => {
        try {
          const [invData, subDataRes] = await Promise.all([
            fetch("/api/invitations/my-invitations").then((res) => res.json()),
            fetch("/api/user/subscription?activateTest=true").then((res) => res.json()),
          ]);

          if (invData.invitations) {
            setInvitations(invData.invitations);
          }
          if (subDataRes && !subDataRes.error) {
            setSubData(subDataRes);
          }

          await fetchProfiles();
        } catch (err) {
          console.error("Error fetching dashboard data:", err);
        } finally {
          setLoading(false);
        }
      };

      loadAllData();
    }
  }, [status, router]);

  const handleShare = (slug: string, id: string) => {
    const url = `${window.location.origin}/invitations/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleActivateProfile = async (profileId: string) => {
    setActivatingId(profileId);
    try {
      const res = await fetch("/api/user/event-draft/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchProfiles();
      }
    } catch (err) {
      console.error("Error setting active profile:", err);
    } finally {
      setActivatingId(null);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!window.confirm("Are you sure you want to delete this celebration event profile?")) return;
    try {
      const res = await fetch(`/api/user/event-draft?id=${profileId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProfileHasDetailsCache(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem("bervic_quick_start_draft");
          localStorage.removeItem("bervic_user_draft_details");
        }
        await fetchProfiles();
      }
    } catch (err) {
      console.error("Error deleting event profile:", err);
    }
  };

  const formatDate = (rawDate: string) => {
    if (!rawDate) return "Date set in invitation";
    if (rawDate.includes("T")) {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      }
    }
    return rawDate.length > 30 ? rawDate.slice(0, 30) + "..." : rawDate;
  };

  if (status === "loading" || loading) {
    return <DashboardSkeleton />;
  }

  const daysRemaining = subData.planExpiresAt
    ? Math.max(0, Math.ceil((new Date(subData.planExpiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-20 sm:pt-28 md:pt-32 pb-16">
        {/* Luxury Modern Mobile & Desktop Top Welcome Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 mb-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3.5 w-full">
            {/* User Avatar */}
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-[#991B1B] to-[#7F1D1D] text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-xs shrink-0 border border-red-200">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "B"}
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#991B1B] block">
                WELCOME BACK
              </span>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 truncate leading-tight">
                {session?.user?.name || "Bride & Groom"}
              </h1>
              {activeProfile && (
                <p className="text-[11px] sm:text-xs font-semibold text-[#991B1B] flex items-center gap-1 mt-0.5 truncate">
                  <Star className="w-3 h-3 fill-current text-amber-500 shrink-0" />
                  <span className="truncate">
                    Active: <strong>{activeProfile.hostNameOne}{activeProfile.hostNameTwo ? ` & ${activeProfile.hostNameTwo}` : ""}</strong>
                    {activeProfile.eventDate ? ` (${activeProfile.eventDate})` : ""}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Compact Responsive Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-2.5 w-full md:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" && (
              <Link
                href="/admin"
                className="col-span-2 sm:col-span-1 px-3.5 py-2.5 rounded-xl bg-[#991B1B] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#7F1D1D] transition-all"
              >
                <Crown className="w-3.5 h-3.5 fill-current text-amber-300" />
                <span>Admin Panel</span>
              </Link>
            )}

            <Link
              href="/templates"
              className="btn-maroon px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Create Invitation</span>
            </Link>
          </div>
        </div>

        {/* Segmented Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 mb-8 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1.5 sm:pb-0 w-full sm:w-auto">
            <button
              onClick={() => handleTabChange("profiles")}
              className={`px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "profiles"
                  ? "bg-[#991B1B] text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <User className="w-4 h-4 text-amber-500" />
              <span>Event Profile</span>
            </button>

            <button
              onClick={() => handleTabChange("invitations")}
              className={`px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "invitations"
                  ? "bg-[#991B1B] text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>My Invitations ({invitations.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("subscription")}
              className={`px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "subscription"
                  ? "bg-[#991B1B] text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Subscription &amp; Quota</span>
              {subData.isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>}
            </button>

            <Link
              href="/dashboard/orders"
              className="px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 bg-white text-slate-700 hover:bg-[#991B1B] hover:text-white border border-slate-200 group shadow-2xs"
            >
              <Package className="w-4 h-4 text-[#991B1B] group-hover:text-white" />
              <span>Print Orders</span>
            </Link>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-xs text-slate-500 font-semibold pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
            <span>Template Slots: <strong className="text-[#991B1B]">{session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" ? "Unlimited" : `${subData.remainingTemplateSlots} left`}</strong></span>
            <span>Card Credits: <strong className="text-[#991B1B]">{session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" ? "Unlimited" : `${subData.remainingCardSlots} left`}</strong></span>
          </div>
        </div>

        {/* TAB 0: EVENT PROFILES MANAGEMENT */}
        {activeTab === "profiles" && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">My Event Profile</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                  This profile populates all template previews. Fill in your details to see your live personalized invitation across every design.
                </p>
                <p className="text-[11px] font-bold text-[#991B1B] mt-1">
                  Your active profile is used for live template previews — each purchased invitation has its own dedicated form.
                </p>
              </div>

              {eventProfiles.length > 0 && (
                <button
                  onClick={handleAddProfileClick}
                  className="btn-maroon px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all whitespace-nowrap cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>Add Celebration Profile</span>
                </button>
              )}
            </div>

            {eventProfiles.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-red-200 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-xl mx-auto shadow-xs my-8">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#991B1B] flex items-center justify-center border border-red-200">
                  <User className="w-8 h-8 text-[#991B1B]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900">No Celebration Profiles Yet</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Add your event details (Bride/Groom names or Birthday Celebrant, Date, Venue, Timeline, Photos) to see live personalized invitation previews.
                </p>
                <button
                  onClick={handleAddProfileClick}
                  className="btn-maroon px-6 py-3 text-xs font-bold flex items-center gap-2 mt-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>Create First Event Profile</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {eventProfiles.map((prof) => {
                  const isBirthday = prof.eventType?.toUpperCase() === "BIRTHDAY";
                  const displayInitials =
                    prof.coupleInitials ||
                    (isBirthday
                      ? prof.hostNameOne?.trim().charAt(0).toUpperCase() || "B"
                      : prof.hostNameOne && prof.hostNameTwo
                      ? `${prof.hostNameOne.trim().charAt(0).toUpperCase()} & ${prof.hostNameTwo.trim().charAt(0).toUpperCase()}`
                      : prof.hostNameOne?.trim().charAt(0).toUpperCase() || "W");

                  const displaySubheading =
                    prof.profileName ||
                    prof.eventTitle ||
                    (isBirthday
                      ? `${prof.hostNameOne || "Celebrant"}'s Birthday Celebration`
                      : prof.hostNameOne && prof.hostNameTwo
                      ? `${prof.hostNameOne} & ${prof.hostNameTwo}'s Wedding`
                      : `${prof.hostNameOne || "Couple"}'s Wedding Celebration`);

                  const displayNames = isBirthday
                    ? prof.hostNameOne || "Celebrant"
                    : prof.hostNameTwo
                    ? `${prof.hostNameOne || "Partner 1"} & ${prof.hostNameTwo}`
                    : prof.hostNameOne || "Wedding Couple";

                  return (
                    <div
                      key={prof.id}
                      className={`bg-white rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between border ${
                        prof.isActive
                          ? "border-2 border-[#991B1B] ring-4 ring-red-100/70"
                          : "border-slate-200 hover:border-red-300"
                      }`}
                    >
                      <div>
                        {/* Top Header Row: Category Badge & Status */}
                        <div className="flex items-center justify-between gap-1.5 mb-4 relative z-10">
                          <span
                            className={`px-3 py-1 rounded-full text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1.5 ${
                              isBirthday ? "bg-[#EA580C]" : "bg-[#991B1B]"
                            }`}
                          >
                            {isBirthday ? (
                              <Cake className="w-3 h-3 fill-current text-white" />
                            ) : (
                              <Heart className="w-3 h-3 fill-current text-white" />
                            )}
                            <span>{prof.eventType || "WEDDING"}</span>
                          </span>

                          <div className="flex items-center gap-1.5">
                            {prof.isActive ? (
                              <span className="px-3 py-1 rounded-full bg-red-50 text-[#991B1B] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border border-red-200 shadow-2xs">
                                <Star className="w-3 h-3 fill-current text-[#991B1B]" />
                                Active Main
                              </span>
                            ) : (
                              <button
                                onClick={() => prof.id && handleActivateProfile(prof.id)}
                                disabled={activatingId === prof.id}
                                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-[#991B1B] hover:border-red-200 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Set Active</span>
                              </button>
                            )}

                            {prof.id && (
                              <button
                                onClick={() => handleDeleteProfile(prof.id!)}
                                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                                title="Delete Event Profile"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Circular Monogram Emblem */}
                        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-[#991B1B] font-serif font-bold text-lg flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                          {displayInitials}
                        </div>

                        {/* Subheading & Title */}
                        <div className="text-center mb-4">
                          <p className="text-xs text-slate-500 font-medium truncate px-2">
                            {displaySubheading}
                          </p>
                          <div className="flex items-center justify-center gap-1.5 my-1.5 opacity-60">
                            <div className="h-px w-6 bg-red-200" />
                            {isBirthday ? (
                              <Cake className="w-2.5 h-2.5 fill-current text-[#EA580C]" />
                            ) : (
                              <Heart className="w-2.5 h-2.5 fill-current text-[#991B1B]" />
                            )}
                            <div className="h-px w-6 bg-red-200" />
                          </div>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                            {displayNames}
                          </h4>
                        </div>

                        {/* Clean Details Rows */}
                        <div className="space-y-2 text-xs text-slate-600 py-3 border-t border-b border-slate-100 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-[#991B1B]" />
                              <span>Main Date &amp; Time</span>
                            </span>
                            <span className="font-bold text-slate-900 text-right truncate max-w-[170px]">
                              {prof.eventDate || "2026-08-12"} {prof.eventTime ? `@ ${prof.eventTime}` : ""}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                              <Globe className="w-3.5 h-3.5 text-[#991B1B]" />
                              <span>Venue</span>
                            </span>
                            <span className="font-bold text-slate-900 text-right truncate max-w-[170px]">
                              {prof.venueName || "Venue not set"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                              <Zap className="w-3.5 h-3.5 text-[#991B1B]" />
                              <span>RSVP Contact</span>
                            </span>
                            <span className="font-bold text-slate-900 text-right truncate">
                              {prof.rsvpContact || "Not set"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                              <Sparkles className="w-3.5 h-3.5 text-[#991B1B]" />
                              <span>Dress Code</span>
                            </span>
                            <span className="font-bold text-slate-900 text-right truncate">
                              {prof.dressCode || "Ethnic wear"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Edit Action Button */}
                      <div>
                        <Link
                          href={`/dashboard/event-profile?id=${prof.id}`}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-200" />
                          <span>Edit Details</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: MY INVITATIONS */}
        {activeTab === "invitations" && (
          <div>
            {invitations.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-red-200 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-xl mx-auto shadow-xs my-8">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#991B1B] flex items-center justify-center border border-red-200">
                  <Heart className="w-8 h-8 text-[#991B1B]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900">No Invitations Created Yet</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Browse our luxury wedding template collection and customize your digital invitation suite in seconds.
                </p>
                <Link
                  href="/templates"
                  className="btn-maroon px-6 py-3 text-xs font-bold flex items-center gap-2 mt-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Browse Templates Gallery</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white border border-slate-200/80 hover:border-red-300 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Template Badge & Date */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-red-50 text-[#991B1B] text-[10px] font-extrabold uppercase tracking-widest border border-red-200">
                          {inv.templateSlug}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(inv.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      {/* Couple / Host Title */}
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 mb-2 leading-tight">
                        {inv.partnerOne}
                        {inv.partnerTwo &&
                        inv.partnerTwo.trim() !== "" &&
                        inv.partnerTwo !== "Partner Name" &&
                        inv.partnerTwo !== "Partner's Name" &&
                        templatesRegistry.find((t) => t.slug === inv.templateSlug)?.category !== "birthday"
                          ? ` & ${inv.partnerTwo}`
                          : ""}
                      </h3>

                      {/* Clean Details Info */}
                      <div className="space-y-1.5 text-xs text-slate-600 py-3 border-t border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#991B1B] shrink-0" />
                          <span className="font-semibold text-slate-800">{formatDate(inv.weddingDate || inv.weddingTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-[#991B1B] shrink-0" />
                          <span className="truncate font-mono text-[11px] text-[#991B1B]">
                            bervic.app/invitations/{inv.slug}
                          </span>
                        </div>
                      </div>

                      {/* Suite Action Buttons */}
                      <div className="flex flex-col gap-2 mb-4">
                        <Link
                          href={`/dashboard/invite-whatsapp/${inv.id}`}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#991B1B] text-white text-xs font-bold hover:bg-[#7F1D1D] transition-all flex items-center justify-center gap-2 shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                          <span>Invite via WhatsApp</span>
                        </Link>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setActivePdfInv(inv)}
                            className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#991B1B]" />
                            <span>Printable PDF</span>
                          </button>

                          <Link
                            href={`/cards?invitationId=${inv.id}`}
                            className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#991B1B]" />
                            <span>Instagram Card</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Primary Card Actions */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                      {inv.isLocked ? (
                        <button
                          disabled
                          className="py-2 px-2 rounded-xl bg-slate-100 text-slate-400 text-[11px] font-bold border border-slate-200 flex items-center justify-center gap-1 cursor-not-allowed opacity-85"
                          title={inv.lockReason || "Editing is locked 2 hours pre-event."}
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Locked</span>
                        </button>
                      ) : (
                        <Link
                          href={`/dashboard/event-profile?invitationId=${inv.id}`}
                          className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-200 transition-all flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#991B1B]" />
                          <span>Edit Details</span>
                        </Link>
                      )}

                      <Link
                        href={`/invitations/${inv.slug}`}
                        target="_blank"
                        className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-200 transition-all flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#991B1B]" />
                        <span>View</span>
                      </Link>

                      <button
                        onClick={() => handleShare(inv.slug, inv.id)}
                        className="py-2 px-2 rounded-xl bg-[#991B1B] text-white text-[11px] font-bold hover:bg-[#7F1D1D] transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        {copiedId === inv.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-white" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUBSCRIPTION & QUOTA */}
        {activeTab === "subscription" && (
          <div>
            {/* Clean Header Row without outer box */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {subData.plan && subData.plan !== "NONE" && (
                    <span className="px-3 py-1 rounded-full bg-[#991B1B] text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                      <Crown className="w-3.5 h-3.5 text-amber-300" />
                      <span>{subData.plan === "PRO_1799" ? "Pro Pass (₹1799)" : "Basic Pass (₹599)"}</span>
                    </span>
                  )}
                  {(subData.allowedCinematicCount || 0) > 0 && (
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>
                        {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com"
                          ? "Admin Full Access (₹2000)"
                          : `Premium Pass (₹2000${(subData.allowedCinematicCount || 0) > 1 ? ` x ${subData.allowedCinematicCount}` : ""})`}
                      </span>
                    </span>
                  )}
                  {subData.isActive ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Active Subscription
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                      Free Tier
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Subscription &amp; Quota</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {subData.isActive && subData.planExpiresAt
                    ? `Valid until ${new Date(subData.planExpiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} (${daysRemaining} days remaining)`
                    : "Upgrade your plan to unlock unlimited customization, custom domains, and downloads."}
                </p>
              </div>

              <Link
                href="/checkout"
                className="btn-maroon px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs hover:shadow-md transition-all text-white shrink-0"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>{subData.isActive ? "Upgrade / Buy Passes" : "Choose a Plan"}</span>
              </Link>
            </div>

            {/* 3 Catchy, Simple Metric Cards in a Modern Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {/* Card 1: Standard Invitations */}
              <div className="bg-white border border-slate-200/90 hover:border-red-300 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-[#991B1B]" />
                      <span>Standard Templates</span>
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-50 text-[#991B1B] border border-red-200">
                      STANDARD
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
                      {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com"
                        ? `${subData.usedTemplatesCount} Active`
                        : `${subData.usedTemplatesCount} / ${subData.allowedTemplatesCount}`}
                    </span>
                    <span className="text-xs font-bold text-[#991B1B]">
                      {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" ? "Unlimited" : `${subData.remainingTemplateSlots} slots left`}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-[#991B1B] rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          session?.user?.email?.toLowerCase() === "berglin1998@gmail.com"
                            ? 100
                            : subData.allowedTemplatesCount > 0
                            ? Math.min(100, (subData.usedTemplatesCount / subData.allowedTemplatesCount) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  Standard templates (₹599 / ₹1799 passes).
                </p>
              </div>

              {/* Card 2: Premium Templates */}
              <div className="bg-white border border-slate-200/90 hover:border-amber-300 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Premium Templates</span>
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                      ₹2000 PASS
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
                      {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com"
                        ? `${subData.usedCinematicCount || 0} Active`
                        : `${subData.usedCinematicCount || 0} / ${subData.allowedCinematicCount || 0}`}
                    </span>
                    <span className="text-xs font-bold text-amber-700 font-mono">
                      {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" ? "Unlimited" : `${subData.remainingCinematicSlots || 0} slots left`}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          session?.user?.email?.toLowerCase() === "berglin1998@gmail.com"
                            ? 100
                            : (subData.allowedCinematicCount || 0) > 0
                            ? Math.min(100, ((subData.usedCinematicCount || 0) / (subData.allowedCinematicCount || 1)) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  480-Frame Apple-Style video scroll templates.
                </p>
              </div>

              {/* Card 3: Instagram Cards */}
              <div className="bg-white border border-slate-200/90 hover:border-red-300 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#991B1B]" />
                      <span>Instagram Cards</span>
                    </span>
                    <Link
                      href="/checkout?plan=CARDS_99"
                      className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#991B1B] text-white hover:bg-[#7F1D1D] transition-colors shadow-2xs"
                    >
                      + 5 Cards (₹99)
                    </Link>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
                      {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com"
                        ? `${subData.usedCardsCount || 0} Saved`
                        : `${subData.usedCardsCount || 0} / ${subData.allowedCardsCount || 0}`}
                    </span>
                    <span className="text-xs font-bold text-[#991B1B]">
                      {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" ? "Unlimited" : `${subData.remainingCardSlots || 0} credits left`}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-[#991B1B] rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          session?.user?.email?.toLowerCase() === "berglin1998@gmail.com"
                            ? 100
                            : (subData.allowedCardsCount || 0) > 0
                            ? Math.min(100, ((subData.usedCardsCount || 0) / (subData.allowedCardsCount || 1)) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500">2 free + ₹99 addon slots</span>
                  <Link href="/cards" className="font-bold text-[#991B1B] hover:underline">
                    Open Studio →
                  </Link>
                </div>
              </div>
            </div>

            {/* Asset Lifetime Guarantee Bar */}
            <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between gap-3 text-xs text-slate-700 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#991B1B] shrink-0" />
                <span>
                  <strong>Asset Lifetime Protection:</strong> Your saved invitations and guest RSVPs do NOT auto-delete on your event date.
                </span>
              </div>
              <Link
                href="/templates"
                className="text-xs font-bold text-[#991B1B] hover:underline shrink-0 hidden sm:inline"
              >
                Browse Templates →
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Upgrade Plan Modal for Multiple Profiles */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#991B1B] flex items-center justify-center mx-auto border border-red-200">
              <Crown className="w-8 h-8 text-[#991B1B]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-slate-900">
                Multiple Profiles Require a Plan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You currently have <strong>1 free celebration profile</strong>. To create and manage multiple celebration profiles simultaneously (e.g. Wedding + Birthday), please upgrade to any active invitation plan.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-[11px] text-[#991B1B] font-semibold flex items-center gap-2 text-left">
              <Sparkles className="w-4 h-4 text-[#991B1B] shrink-0" />
              <span>Upgrading unlocks multiple event profiles, custom URL routes, unlimited downloads, and live guest RSVPs.</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Link
                href="/checkout"
                className="btn-maroon py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>View Plans</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {activePdfInv && (
        <PdfCardExportModal
          templateSlug={activePdfInv.templateSlug}
          invitationSlug={activePdfInv.slug}
          partnerOne={activePdfInv.partnerOne}
          partnerTwo={activePdfInv.partnerTwo}
          weddingDate={activePdfInv.weddingTime || activePdfInv.weddingDate}
          venuePlace={activePdfInv.venuePlace || "Our Wedding Venue"}
          coupleImage={activePdfInv.coupleImage || activePdfInv.heroImage}
          tagline={activePdfInv.tagline}
          onClose={() => setActivePdfInv(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#991B1B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
