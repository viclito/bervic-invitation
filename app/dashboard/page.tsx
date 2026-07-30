"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuestRsvpModal from "@/components/dashboard/GuestRsvpModal";
import PdfCardExportModal from "@/components/dashboard/PdfCardExportModal";
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
  Clock,
  LayoutGrid,
  Layers,
  CreditCard,
  User,
  Download,
  ImageIcon,
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
  allowedCardsCount: number;
  usedTemplatesCount: number;
  usedCardsCount: number;
  remainingTemplateSlots: number;
  remainingCardSlots: number;
  savedCards: SavedCard[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"invitations" | "subscription">("invitations");
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

  // Modals state
  const [activeRsvpInv, setActiveRsvpInv] = useState<SavedInvitation | null>(null);
  const [activePdfInv, setActivePdfInv] = useState<SavedInvitation | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/dashboard");
      return;
    }

    if (status === "authenticated") {
      Promise.all([
        fetch("/api/invitations/my-invitations").then((res) => res.json()),
        fetch("/api/user/subscription?activateTest=true").then((res) => res.json()),
      ])
        .then(([invData, subDataRes]) => {
          if (invData.invitations) {
            setInvitations(invData.invitations);
          }
          if (subDataRes && !subDataRes.error) {
            setSubData(subDataRes);
          }
        })
        .catch((err) => console.error("Error fetching dashboard data:", err))
        .finally(() => setLoading(false));
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

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-32 pb-16">
        {/* Sleek Dashboard Top Bar Header */}
        <div className="bg-[#FAF7F2] border border-[#D9A441]/30 rounded-3xl p-6 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center text-xl font-serif font-bold shadow-md shrink-0">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "B"}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] text-[10px] font-bold uppercase tracking-wider">
                  Private Dashboard
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D9A441]/20 text-[#8B6519] text-[11px] font-bold border border-[#D9A441]/30 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#D9A441]" />
                  <span>
                    {subData.plan === "PRO_999" ? "Pro Pass (₹999)" : subData.plan === "BASIC_299" ? "Basic Pass (₹299)" : "Free Preview"}
                  </span>
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#221C17]">
                Welcome back, {session?.user?.name || "Bride & Groom"}
              </h1>
            </div>
          </div>

          {/* Quick Header Action */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/templates"
              className="btn-maroon px-5 py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all w-full md:w-auto shrink-0"
            >
              <Plus className="w-4 h-4 text-[#D9A441]" />
              <span>Create New Invitation</span>
            </Link>
          </div>
        </div>

        {/* Segmented Tab Navigation */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border-b border-[#D9A441]/20 mb-8 pb-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("invitations")}
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
              onClick={() => setActiveTab("subscription")}
              className={`flex-1 sm:flex-initial px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "subscription"
                  ? "bg-[#7A1F2B] text-[#F8F3EA] shadow-md"
                  : "bg-[#EFE7D8]/60 text-[#221C17]/70 hover:bg-[#EFE7D8]"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Subscription & Quota</span>
              {subData.isActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 text-xs text-[#221C17]/60 font-semibold pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D9A441]/10">
            <span>Template Slots: <strong className="text-[#7A1F2B]">{subData.remainingTemplateSlots} left</strong></span>
            <span>Card Credits: <strong className="text-[#8B6519]">{subData.remainingCardSlots} left</strong></span>
          </div>
        </div>

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
                        href={`/templates/customize/${inv.templateSlug}?id=${inv.id}&from=dashboard`}
                        className="py-2 px-2 rounded-xl bg-[#EFE7D8] text-[#221C17] text-[11px] font-bold hover:bg-[#D9A441]/20 transition-all flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#7A1F2B]" />
                        <span>Edit</span>
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

            {/* DOWNLOADED INSTAGRAM CARDS SECTION */}
            {subData.savedCards && subData.savedCards.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#D9A441]/30">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#221C17] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#D9A441]" />
                      <span>Downloaded Instagram Announcement Cards ({subData.savedCards.length})</span>
                    </h3>
                    <p className="text-xs text-[#221C17]/70">
                      Re-download your saved cards anytime without using extra subscription credits.
                    </p>
                  </div>

                  <Link
                    href="/cards"
                    className="px-4 py-2 rounded-xl bg-[#7A1F2B] text-[#F8F3EA] text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-[#D9A441]" />
                    <span>Create Card</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {subData.savedCards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-[#FAF7F2] border border-[#D9A441]/30 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#D9A441]/20 text-[#7A1F2B] text-[10px] font-extrabold uppercase">
                            Template #{card.templateId}
                          </span>
                          <span className="text-[10px] text-[#221C17]/50 font-medium">
                            {new Date(card.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#7A1F2B] mb-1">
                          {card.partnerOne} & {card.partnerTwo}
                        </h4>
                        <p className="text-xs text-[#221C17]/70 font-medium mb-4">{card.weddingDate}</p>
                      </div>

                      <div className="pt-3 border-t border-[#D9A441]/20 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ✓ Paid Download Saved
                        </span>
                        <Link
                          href={`/cards?template=${card.templateId}`}
                          className="px-3 py-1.5 rounded-lg bg-[#7A1F2B] text-[#F8F3EA] text-[11px] font-bold flex items-center gap-1 hover:bg-[#9B2C3B] transition-all"
                        >
                          <Download className="w-3 h-3 text-[#D9A441]" />
                          <span>Re-download</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUBSCRIPTION & QUOTA */}
        {activeTab === "subscription" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#FAF7F2] border-2 border-[#D9A441]/40 rounded-3xl p-8 shadow-md relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#D9A441]/20">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-[#7A1F2B] text-[#D9A441] text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                      <Crown className="w-3.5 h-3.5 text-[#D9A441]" />
                      <span>
                        {subData.plan === "PRO_999"
                          ? "Pro Annual Pass (₹999)"
                          : subData.plan === "BASIC_299"
                          ? "Basic Pass (₹299)"
                          : "Free Preview Mode"}
                      </span>
                    </span>
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

                  <h2 className="text-2xl font-serif font-bold text-[#221C17]">Subscription & Quota Details</h2>
                  <p className="text-xs text-[#221C17]/70 mt-1">
                    {subData.isActive && subData.planExpiresAt ? (
                      <>
                        Amount Paid: <strong className="text-[#7A1F2B]">{subData.plan === "PRO_999" ? "₹999" : "₹299"}</strong> • Valid until{" "}
                        <strong>
                          {new Date(subData.planExpiresAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </strong>{" "}
                        ({daysRemaining} days remaining)
                      </>
                    ) : (
                      <>Subscribe to ₹299 (6 Months) or ₹999 (1 Year) to unlock 1-click customization, saving, and WhatsApp invitations.</>
                    )}
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="btn-gold px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all text-[#7A1F2B] shrink-0"
                >
                  <Zap className="w-4 h-4 text-[#7A1F2B]" />
                  <span>{subData.isActive ? "Upgrade / Buy Additional Pass" : "Choose Subscription Plan"}</span>
                </Link>
              </div>

              {/* Progress Meters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                {/* Template Slots Meter */}
                <div className="bg-[#EFE7D8] p-5 rounded-2xl border border-[#D9A441]/30 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#221C17]/70 font-semibold block mb-1">Wedding Template Slots</span>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-bold text-[#7A1F2B]">
                        {subData.usedTemplatesCount} of {subData.allowedTemplatesCount} Used
                      </span>
                      <span className="text-xs font-extrabold text-[#8B6519]">
                        {subData.remainingTemplateSlots} slots left
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7A1F2B] rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            subData.allowedTemplatesCount > 0
                              ? Math.min(100, (subData.usedTemplatesCount / subData.allowedTemplatesCount) * 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#221C17]/60 mt-3">
                    Selected template slots are locked to your chosen design with unlimited edits.
                  </p>
                </div>

                {/* Instagram Cards Meter */}
                <div className="bg-[#EFE7D8] p-5 rounded-2xl border border-[#D9A441]/30 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#221C17]/70 font-semibold block mb-1">Instagram Announcement Cards</span>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-bold text-[#7A1F2B]">
                        {subData.usedCardsCount} of {subData.allowedCardsCount} Used
                      </span>
                      <span className="text-xs font-extrabold text-[#8B6519]">
                        {subData.remainingCardSlots} credits left
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D9A441] rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            subData.allowedCardsCount > 0
                              ? Math.min(100, (subData.usedCardsCount / subData.allowedCardsCount) * 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#221C17]/60 mt-3">
                    Credits are deducted ONLY when a new card is downloaded for the first time.
                  </p>
                </div>

                {/* WhatsApp Invites Meter */}
                <div className="bg-[#EFE7D8] p-5 rounded-2xl border border-[#D9A441]/30 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#221C17]/70 font-semibold block mb-1">WhatsApp Guest Invitations</span>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-bold text-emerald-700">Unlimited</span>
                      <span className="text-xs font-extrabold text-emerald-800">Personalized</span>
                    </div>

                    <div className="w-full h-2.5 bg-emerald-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-full" />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#221C17]/60 mt-3">
                    Includes personalized guest names and 1-click RSVP tracking.
                  </p>
                </div>
              </div>

              {/* Saved Downloaded Cards List in Subscription View */}
              {subData.savedCards && subData.savedCards.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#D9A441]/20">
                  <h4 className="text-base font-serif font-bold text-[#221C17] mb-3">
                    Saved Instagram Cards ({subData.savedCards.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {subData.savedCards.map((c) => (
                      <div key={c.id} className="p-3 bg-[#EFE7D8]/60 rounded-xl border border-[#D9A441]/20 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-[#7A1F2B] block">
                            Template #{c.templateId} • {c.partnerOne} & {c.partnerTwo}
                          </span>
                          <span className="text-[10px] text-[#221C17]/60">{c.weddingDate}</span>
                        </div>
                        <Link
                          href={`/cards?template=${c.templateId}`}
                          className="px-2.5 py-1 rounded-lg bg-[#7A1F2B] text-[#F8F3EA] text-[10px] font-bold"
                        >
                          Re-download
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
