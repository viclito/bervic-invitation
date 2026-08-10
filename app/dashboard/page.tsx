"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuestRsvpModal from "@/components/dashboard/GuestRsvpModal";
import PdfCardExportModal from "@/components/dashboard/PdfCardExportModal";
import { setProfileHasDetailsCache } from "@/lib/useRequireLoginAndDetails";
import type { EventProfileData } from "@/components/dashboard/EventProfileModal";
import {
  Sparkles,
  Calendar,
  Edit3,
  ExternalLink,
  Share2,
  Plus,
  Heart,
  Check,
  Globe,
  FileText,
  MessageSquare,
  Crown,
  Zap,
  ShieldCheck,
  Layers,
  CreditCard,
  User,
  Star,
  Trash2,
  CheckCircle2,
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

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"profiles" | "invitations" | "subscription">("profiles");

  const handleTabChange = (tab: "profiles" | "invitations" | "subscription") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("bervic_active_dashboard_tab", tab);
    }
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "invitations" || tabParam === "subscription" || tabParam === "profiles") {
      setActiveTab(tabParam);
      if (typeof window !== "undefined") {
        localStorage.setItem("bervic_active_dashboard_tab", tabParam);
      }
    } else if (typeof window !== "undefined") {
      const cachedTab = localStorage.getItem("bervic_active_dashboard_tab") as "profiles" | "invitations" | "subscription" | null;
      if (cachedTab === "invitations" || cachedTab === "subscription" || cachedTab === "profiles") {
        setActiveTab(cachedTab);
      }
    }
  }, [searchParams]);

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
  const [activeRsvpInv, setActiveRsvpInv] = useState<SavedInvitation | null>(null);
  const [activePdfInv, setActivePdfInv] = useState<SavedInvitation | null>(null);

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/user/event-draft?all=true");
      const data = await res.json();
      let profiles: EventProfileData[] = data.profiles || [];

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
    return (
      <div className="min-h-screen bg-[#FDF6F0] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#7A1F2B] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#2B2320] font-serif text-lg">Loading your invitation suite...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const daysRemaining = subData.planExpiresAt
    ? Math.max(0, Math.ceil((new Date(subData.planExpiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen bg-[#FDF6F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-36 sm:pt-40 pb-16">
        {/* Sleek & Neat Dashboard Top Bar Header */}
        <div className="bg-[#FAF7F2] border border-[#D9A441]/30 rounded-3xl p-6 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center text-xl font-serif font-bold shadow-md shrink-0">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "B"}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#221C17]">
                Welcome back, {session?.user?.name || "Bride & Groom"}
              </h1>
              {activeProfile && (
                <p className="text-xs font-semibold text-[#7A1F2B] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current text-[#D9A441]" />
                  <span>
                    Active Profile: <strong>{activeProfile.hostNameOne}{activeProfile.hostNameTwo ? ` & ${activeProfile.hostNameTwo}` : ""}</strong>
                    {activeProfile.eventDate ? ` (${activeProfile.eventDate})` : ""}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" && (
              <Link
                href="/admin"
                className="px-4 py-2.5 rounded-xl bg-[#7A1F2B] text-[#D9A441] text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm hover:bg-[#680E17] transition-all border border-[#D9A441]/40 w-full sm:w-auto"
              >
                <Crown className="w-4 h-4 fill-current" />
                <span>Admin Panel</span>
              </Link>
            )}
            <Link
              href="/dashboard/event-profile?new=true"
              onClick={(e) => {
                const isAdmin = session?.user?.email?.toLowerCase() === "berglin1998@gmail.com";
                const totalAllowed = Math.max(0, (subData.allowedTemplatesCount || 0) + (subData.allowedCinematicCount || 0));
                const maxAllowed = isAdmin ? 99 : Math.max(1, totalAllowed);
                if (eventProfiles.length >= maxAllowed) {
                  e.preventDefault();
                  router.push("/checkout?plan=BASIC_599");
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[#EFE7D8] text-[#7A1F2B] text-xs font-bold border border-[#D9A441]/40 flex items-center justify-center gap-2 hover:bg-[#D9A441]/20 transition-all w-full sm:w-auto shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#7A1F2B]" />
              <span>+ Add Event Profile</span>
            </Link>
            <Link
              href="/templates"
              className="btn-maroon px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 text-[#D9A441]" />
              <span>Create Invitation</span>
            </Link>
          </div>
        </div>



        {/* Segmented Tab Navigation */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border-b border-[#D9A441]/20 mb-8 pb-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleTabChange("profiles")}
              className={`flex-1 sm:flex-initial px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "profiles"
                  ? "bg-[#7A1F2B] text-[#F8F3EA] shadow-md"
                  : "bg-[#EFE7D8]/60 text-[#221C17]/70 hover:bg-[#EFE7D8]"
              }`}
            >
              <User className="w-4 h-4 text-[#D9A441]" />
              <span>Event Profiles ({eventProfiles.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("invitations")}
              className={`flex-1 sm:flex-initial px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "invitations"
                  ? "bg-[#7A1F2B] text-[#F8F3EA] shadow-md"
                  : "bg-[#EFE7D8]/60 text-[#221C17]/70 hover:bg-[#EFE7D8]"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>My Invitations ({invitations.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("subscription")}
              className={`flex-1 sm:flex-initial px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "subscription"
                  ? "bg-[#7A1F2B] text-[#F8F3EA] shadow-md"
                  : "bg-[#EFE7D8]/60 text-[#221C17]/70 hover:bg-[#EFE7D8]"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Subscription & Quota</span>
              {subData.isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>}
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-xs text-[#221C17]/60 font-semibold pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D9A441]/10">
            <span>Template Slots: <strong className="text-[#7A1F2B]">{session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" ? "Unlimited" : `${subData.remainingTemplateSlots} left`}</strong></span>
            <span>Card Credits: <strong className="text-[#8B6519]">{session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" ? "Unlimited" : `${subData.remainingCardSlots} left`}</strong></span>
          </div>
        </div>

        {/* TAB 0: EVENT PROFILES MANAGEMENT */}
        {activeTab === "profiles" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#221C17]">My Event Profiles</h3>
                <p className="text-xs text-[#221C17]/70">
                  Manage multiple celebration profiles. Click <strong>&quot;Set as Active&quot;</strong> to set which profile populates all template previews.
                </p>
                <p className="text-[11px] font-bold text-[#8C6227] mt-1">
                  Profiles Allowed: {eventProfiles.length} of {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" ? "Unlimited" : Math.max(1, (subData.allowedTemplatesCount || 0) + (subData.allowedCinematicCount || 0))} (1 profile per template purchased)
                </p>
              </div>

              <Link
                href="/dashboard/event-profile?new=true"
                onClick={(e) => {
                  const isAdmin = session?.user?.email?.toLowerCase() === "berglin1998@gmail.com";
                  const totalAllowed = Math.max(0, (subData.allowedTemplatesCount || 0) + (subData.allowedCinematicCount || 0));
                  const maxAllowed = isAdmin ? 99 : Math.max(1, totalAllowed);
                  if (eventProfiles.length >= maxAllowed) {
                    e.preventDefault();
                    router.push("/checkout?plan=BASIC_599");
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-[#7A1F2B] text-[#F8F3EA] text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#9B2C3B] transition-all"
              >
                <Plus className="w-4 h-4 text-[#D9A441]" />
                <span>Add New Event Profile</span>
              </Link>
            </div>

            {eventProfiles.length === 0 ? (
              <div className="bg-[#FAF7F2] border-2 border-dashed border-[#D9A441]/40 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-xl mx-auto shadow-sm my-8">
                <div className="w-16 h-16 rounded-2xl bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center">
                  <User className="w-8 h-8 text-[#7A1F2B]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#221C17]">No Celebration Profiles Yet</h3>
                <p className="text-xs text-[#221C17]/70 leading-relaxed">
                  Add your event details (Bride/Groom names, Date, Venue, Timeline, Photos) to see live personalized invitation previews.
                </p>
                <Link
                  href="/dashboard/event-profile?new=true"
                  className="btn-maroon px-6 py-3 text-xs font-bold flex items-center gap-2 mt-2 shadow-md"
                >
                  <Plus className="w-4 h-4 text-[#D9A441]" />
                  <span>Create First Event Profile</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {eventProfiles.map((prof) => (
                  <div
                    key={prof.id}
                    className={`bg-[#FAF6F0] rounded-2xl p-4 sm:p-5 shadow-md transition-all relative overflow-hidden flex flex-col justify-between border-2 max-w-sm w-full mx-auto ${
                      prof.isActive
                        ? "border-[#C59B27] ring-1 ring-[#C59B27]/20"
                        : "border-[#EBE3D7] hover:border-[#C59B27]/60"
                    }`}
                  >
                    {/* Top Watermark Floral Accents */}
                    <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-20">
                      <svg viewBox="0 0 100 100" fill="#A37B43">
                        <path d="M100 0 C80 20 60 10 50 30 C40 50 20 40 0 60 L0 0 Z" opacity="0.5" />
                        <circle cx="85" cy="15" r="8" opacity="0.4" />
                        <circle cx="70" cy="30" r="5" opacity="0.4" />
                      </svg>
                    </div>

                    <div>
                      {/* Top Header Row: Category Badge & Status */}
                      <div className="flex items-center justify-between gap-1.5 mb-3 relative z-10">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#A37B43] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-current text-white/90" />
                          <span>{prof.eventType || "WEDDING"}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {prof.isActive ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#C59B27] text-[#070707] text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-current text-[#7A1F2B]" />
                              Active Main
                            </span>
                          ) : (
                            <button
                              onClick={() => prof.id && handleActivateProfile(prof.id)}
                              disabled={activatingId === prof.id}
                              className="px-2.5 py-0.5 rounded-full bg-white/90 hover:bg-[#C59B27]/20 text-[#8C6227] text-[9px] font-extrabold uppercase tracking-wider border border-[#C59B27]/40 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-[#8C6227]" />
                              <span>Set Active</span>
                            </button>
                          )}

                          {prof.id && (
                            <button
                              onClick={() => handleDeleteProfile(prof.id!)}
                              className="p-1.5 text-amber-900/60 hover:text-rose-600 transition-colors cursor-pointer rounded-md hover:bg-rose-50 border border-transparent hover:border-rose-200"
                              title="Delete Event Profile"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Golden Laurel Monogram Emblem (Compact) */}
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center my-1.5">
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#C59B27]" fill="none" stroke="currentColor">
                          <circle cx="50" cy="50" r="44" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                          <path d="M50 90 C 25 85, 10 65, 12 45 C 14 25, 30 12, 50 10" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M50 90 C 75 85, 90 65, 88 45 C 86 25, 70 12, 50 10" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M22 65 Q 16 60 18 53 Q 26 56 22 65 Z" fill="currentColor" opacity="0.7" />
                          <path d="M16 48 Q 10 42 14 36 Q 20 40 16 48 Z" fill="currentColor" opacity="0.7" />
                          <path d="M25 32 Q 20 24 28 20 Q 31 28 25 32 Z" fill="currentColor" opacity="0.7" />
                          <path d="M78 65 Q 84 60 82 53 Q 74 56 78 65 Z" fill="currentColor" opacity="0.7" />
                          <path d="M84 48 Q 90 42 86 36 Q 80 40 84 48 Z" fill="currentColor" opacity="0.7" />
                          <path d="M75 32 Q 80 24 72 20 Q 69 28 75 32 Z" fill="currentColor" opacity="0.7" />
                          <path d="M46 90 Q 50 86 54 90 Q 50 94 46 90 Z" fill="currentColor" />
                        </svg>
                        <span className="font-serif text-lg font-bold text-[#A37B43] tracking-tight z-10">
                          {prof.coupleInitials || "S & A"}
                        </span>
                      </div>

                      {/* Subheading & Heart Divider (Compact) */}
                      <div className="text-center mb-3">
                        <p className="font-serif text-xs font-semibold text-[#5C4033] truncate px-2">
                          {prof.profileName || prof.eventTitle || "Sasa Adi Tinah & Allan Susilo's Wedding"}
                        </p>
                        <div className="flex items-center justify-center gap-1.5 my-1 opacity-60">
                          <div className="h-px w-6 bg-[#C59B27]" />
                          <Heart className="w-2.5 h-2.5 fill-current text-[#C59B27]" />
                          <div className="h-px w-6 bg-[#C59B27]" />
                        </div>
                        <h4 className="font-serif text-base sm:text-lg font-bold text-[#2C1D11] tracking-tight mt-0.5 truncate">
                          {prof.hostNameOne || "Sasa Adi Tinah"} {prof.hostNameTwo ? `& ${prof.hostNameTwo}` : "& Allan Susilo"}
                        </h4>
                      </div>

                      {/* Stacked Details Rows (Compact) */}
                      <div className="space-y-1.5 text-[11px] mb-4">
                        <div className="bg-white/80 border border-[#E8DFC8] rounded-lg px-3 py-1.5 shadow-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[#6E5A44] font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-[#A37B43]" />
                            <span>Main Date &amp; Time</span>
                          </div>
                          <span className="font-bold text-[#2C1D11] text-[11px]">
                            : {prof.eventDate || "2026-08-12"} {prof.eventTime ? `@ ${prof.eventTime}` : "@ 10:00"}
                          </span>
                        </div>

                        <div className="bg-white/80 border border-[#E8DFC8] rounded-lg px-3 py-1.5 shadow-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[#6E5A44] font-semibold">
                            <Globe className="w-3.5 h-3.5 text-[#A37B43]" />
                            <span>Venue</span>
                          </div>
                          <span className="font-bold text-[#2C1D11] text-[11px] truncate max-w-[140px]">
                            : {prof.venueName || "Your Villa"}
                          </span>
                        </div>

                        <div className="bg-white/80 border border-[#E8DFC8] rounded-lg px-3 py-1.5 shadow-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[#6E5A44] font-semibold">
                            <Zap className="w-3.5 h-3.5 text-[#A37B43]" />
                            <span>RSVP Contact</span>
                          </div>
                          <span className="font-bold text-[#2C1D11] text-[11px]">
                            : {prof.rsvpContact || "0000229932"}
                          </span>
                        </div>

                        <div className="bg-white/80 border border-[#E8DFC8] rounded-lg px-3 py-1.5 shadow-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[#6E5A44] font-semibold">
                            <Sparkles className="w-3.5 h-3.5 text-[#A37B43]" />
                            <span>Dress Code</span>
                          </div>
                          <span className="font-bold text-[#2C1D11] text-[11px]">
                            : {prof.dressCode || "Ethinic wear"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Button (Compact) */}
                    <div>
                      <Link
                        href={`/dashboard/event-profile?id=${prof.id}`}
                        className="w-full py-2 px-3 rounded-lg bg-[#8C6227] hover:bg-[#75501F] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.01]"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#FFE088]" />
                        <span>Edit Details</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: MY INVITATIONS */}
        {activeTab === "invitations" && (
          <div>
            {invitations.length === 0 ? (
              <div className="bg-[#FAF7F2] border-2 border-dashed border-[#D9A441]/40 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-xl mx-auto shadow-sm my-8">
                <div className="w-16 h-16 rounded-2xl bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center">
                  <Heart className="w-8 h-8 text-[#7A1F2B]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#221C17]">No Invitations Created Yet</h3>
                <p className="text-xs text-[#221C17]/70 leading-relaxed">
                  Browse our luxury wedding template collection and customize your digital invitation suite in seconds.
                </p>
                <Link
                  href="/templates"
                  className="btn-maroon px-6 py-3 text-xs font-bold flex items-center gap-2 mt-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-[#D9A441]" />
                  <span>Browse Templates Gallery</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-[#FAF7F2] border border-[#D9A441]/30 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Template Badge & Date */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-[#D9A441]/20 text-[#7A1F2B] text-[10px] font-extrabold uppercase tracking-widest border border-[#D9A441]/40">
                          {inv.templateSlug}
                        </span>
                        <span className="text-[10px] text-[#221C17]/50 font-medium">
                          {new Date(inv.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      {/* Couple Title */}
                      <h3 className="text-xl font-serif font-bold text-[#7A1F2B] mb-3 group-hover:text-[#9B2C3B] transition-colors leading-tight">
                        {inv.partnerOne} & {inv.partnerTwo}
                      </h3>

                      {/* Details */}
                      <div className="flex flex-col gap-2 text-xs text-[#221C17]/80 mb-6 bg-[#EFE7D8]/50 p-3 rounded-2xl border border-[#D9A441]/20">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
                          <span className="font-medium">{formatDate(inv.weddingDate || inv.weddingTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
                          <span className="truncate font-mono text-[11px] text-[#7A1F2B]">
                            bervic.app/invitations/{inv.slug}
                          </span>
                        </div>
                      </div>

                      {/* Suite Action Buttons */}
                      <div className="flex flex-col gap-2 mb-6">
                        <button
                          onClick={() => setActiveRsvpInv(inv)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#7A1F2B] text-[#F8F3EA] text-xs font-bold hover:bg-[#9B2C3B] transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#D9A441]" />
                          <span>Guest RSVP & WhatsApp Suite</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setActivePdfInv(inv)}
                            className="py-2 px-2 rounded-xl bg-[#EFE7D8] text-[#221C17] text-[11px] font-bold hover:bg-[#D9A441]/20 border border-[#D9A441]/30 transition-all flex items-center justify-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#7A1F2B]" />
                            <span>Printable PDF</span>
                          </button>

                          <Link
                            href={`/cards?invitationId=${inv.id}`}
                            className="py-2 px-2 rounded-xl bg-[#EFE7D8] text-[#221C17] text-[11px] font-bold hover:bg-[#D9A441]/20 border border-[#D9A441]/30 transition-all flex items-center justify-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#7A1F2B]" />
                            <span>Instagram Card</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Primary Card Actions */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#D9A441]/20">
                      <Link
                        href={`/dashboard/event-profile?invitationId=${inv.id}`}
                        className="py-2 px-2 rounded-xl bg-[#EFE7D8] text-[#221C17] text-[11px] font-bold hover:bg-[#D9A441]/20 transition-all flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#7A1F2B]" />
                        <span>Edit Details</span>
                      </Link>

                      <Link
                        href={`/invitations/${inv.slug}`}
                        target="_blank"
                        className="py-2 px-2 rounded-xl bg-[#EFE7D8] text-[#221C17] text-[11px] font-bold hover:bg-[#D9A441]/20 transition-all flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#7A1F2B]" />
                        <span>View</span>
                      </Link>

                      <button
                        onClick={() => handleShare(inv.slug, inv.id)}
                        className="py-2 px-2 rounded-xl bg-[#7A1F2B] text-[#F8F3EA] text-[11px] font-bold hover:bg-[#9B2C3B] transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        {copiedId === inv.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-[#D9A441]" />
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
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#FAF7F2] border-2 border-[#D9A441]/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              {/* Card Top Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#D9A441]/20">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {subData.plan && subData.plan !== "NONE" && (
                      <span className="px-3.5 py-1 rounded-full bg-[#7A1F2B] text-[#D9A441] text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                        <Crown className="w-3.5 h-3.5 text-[#D9A441]" />
                        <span>
                          {subData.plan === "PRO_1799"
                            ? "Pro Annual Pass (₹1799)"
                            : "Basic Pass (₹599)"}
                        </span>
                      </span>
                    )}

                    {(subData.allowedCinematicCount || 0) > 0 && (
                      <span className="px-3.5 py-1 rounded-full bg-[#0D0D0D] text-[#F7E7C4] text-[10px] font-extrabold uppercase tracking-widest border border-[#D9A441] flex items-center gap-1.5 shadow-md">
                        <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                        <span>
                          {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com"
                            ? "Admin Full Access (₹2000)"
                            : `Premium Cinematic Pass (₹2000 x ${subData.allowedCinematicCount})`}
                        </span>
                      </span>
                    )}

                    {subData.isActive ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Active Subscription
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300">
                        No Active Plan
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#221C17]">
                    Subscription & Quota Details
                  </h2>
                  <p className="text-xs sm:text-sm text-[#221C17]/70 mt-1.5">
                    {subData.isActive ? (
                      <>
                        Active Passes:{" "}
                        <strong className="text-[#7A1F2B]">
                          {[
                            subData.plan === "PRO_1799"
                              ? "Standard Pro Pass (₹1799)"
                              : subData.plan === "BASIC_599"
                              ? "Standard Basic Pass (₹599)"
                              : null,
                            (subData.allowedCinematicCount || 0) > 0
                              ? session?.user?.email?.toLowerCase() === "berglin1998@gmail.com"
                                ? "Premium Cinematic Pass (₹2000 • Unlimited)"
                                : `Premium Cinematic Pass (₹2000 x ${subData.allowedCinematicCount})`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" + ")}
                        </strong>{" "}
                        {subData.planExpiresAt && (
                          <>
                            • Valid until{" "}
                            <strong>
                              {new Date(subData.planExpiresAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </strong>{" "}
                            ({daysRemaining} days remaining)
                          </>
                        )}
                      </>
                    ) : (
                      <>Subscribe to ₹599 (Basic), ₹1799 (Pro), or ₹2000 (Cinematic Exclusive) to unlock 1-click customization, saving, and WhatsApp invitations.</>
                    )}
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="btn-gold px-6 py-3.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg transition-all text-[#7A1F2B] shrink-0"
                >
                  <Zap className="w-4 h-4 text-[#7A1F2B]" />
                  <span>{subData.isActive ? "Upgrade / Buy Additional Pass" : "Choose Subscription Plan"}</span>
                </Link>
              </div>

              {/* Progress Meters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-8">
                {/* Box 1 */}
                <div className="bg-[#FAF7F2] p-6 rounded-3xl border-2 border-[#D9A441]/40 flex flex-col justify-between hover:border-[#7A1F2B] transition-all shadow-md group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#7A1F2B] flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-[#D9A441]" />
                        <span>Wedding Template Slots</span>
                      </span>
                      <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] border border-[#7A1F2B]/20">
                        STANDARD PASS
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#221C17]">
                        {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com"
                          ? `${subData.usedTemplatesCount} Active Created`
                          : `${subData.usedTemplatesCount} of ${subData.allowedTemplatesCount} Used`}
                      </span>
                      <span className="text-xs font-extrabold text-[#8B6519]">
                        {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" ? "Unlimited Access" : `${subData.remainingTemplateSlots} slots left`}
                      </span>
                    </div>

                    <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-[#7A1F2B] rounded-full transition-all duration-500"
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
                  <p className="text-xs text-[#221C17]/60 mt-3 pt-3 border-t border-[#D9A441]/20">
                    Standard wedding templates (₹599 / ₹1799 passes).
                  </p>
                </div>

                {/* Box 2 */}
                <div className="bg-gradient-to-br from-[#0F0F0F] via-[#1B1814] to-[#0A0A0A] border-2 border-[#D9A441] shadow-[0_8px_30px_rgba(217,164,65,0.3)] text-[#FDF6F3] rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-[#F7E7C4] transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#D9A441]/20 border border-[#D9A441] flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-[#D9A441]" />
                        </div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#D9A441]">
                          Premium Wedding Template Slots
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#D9A441] text-[#070707] uppercase tracking-widest shrink-0 shadow-sm">
                        ₹2000 PASS
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-2xl sm:text-3xl font-serif font-bold text-[#F7E7C4]">
                        {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com"
                          ? `${subData.usedCinematicCount || 0} Active Created`
                          : `${subData.usedCinematicCount || 0} of ${subData.allowedCinematicCount || 0} Used`}
                      </span>
                      <span className="text-xs font-extrabold text-[#D9A441] font-mono">
                        {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" ? "Unlimited Access" : `${subData.remainingCinematicSlots || 0} slots left`}
                      </span>
                    </div>

                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(217,164,65,0.8)]"
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
                  <p className="text-xs text-[#FDF6F3]/70 mt-3 pt-3 border-t border-[#D9A441]/30">
                    480-Frame Apple-Style Video Scroll sequence (₹2000 pass).
                  </p>
                </div>
              </div>

              {/* Asset Lifetime Guarantee */}
              <div className="p-4 mt-6 bg-[#EFE7D8]/60 border border-[#D9A441]/20 rounded-2xl flex items-center gap-3 text-xs text-[#221C17]/80">
                <ShieldCheck className="w-5 h-5 text-[#7A1F2B] shrink-0" />
                <span>
                  <strong>Asset Lifetime Protection:</strong> Your saved invitations and guest RSVPs do NOT auto-delete on your event date. They remain active until your plan expires.
                </span>
              </div>
            </div>
          </div>
        )}
      </main>



      {/* Render Active Modals */}
      {activeRsvpInv && (
        <GuestRsvpModal
          invitationId={activeRsvpInv.id}
          invitationSlug={activeRsvpInv.slug}
          partnerOne={activeRsvpInv.partnerOne}
          partnerTwo={activeRsvpInv.partnerTwo}
          weddingDate={activeRsvpInv.weddingTime || activeRsvpInv.weddingDate}
          venuePlace={activeRsvpInv.venuePlace || "Our Wedding Venue"}
          onClose={() => setActiveRsvpInv(null)}
        />
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
        <div className="min-h-screen bg-[#FDF6F0] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#7A1F2B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
