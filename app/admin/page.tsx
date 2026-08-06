"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Users,
  CreditCard,
  Layers,
  Sparkles,
  Search,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  IndianRupee,
  X,
  Crown,
  ArrowLeft,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  plan: string;
  planExpiresAt: string | null;
  allowedTemplatesCount: number;
  usedTemplatesCount: number;
  allowedCardsCount: number;
  usedCardsCount: number;
  totalRevenue: number;
  hasActiveSubscription: boolean;
  createdAt: string;
}

interface OverviewStats {
  totalUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalInvitationsCreated: number;
  totalCardsGenerated: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State for Granting Extra Quota
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [addTemplateSlots, setAddTemplateSlots] = useState<number>(1);
  const [addCardCredits, setAddCardCredits] = useState<number>(5);
  const [overridePlan, setOverridePlan] = useState<string>("");
  const [granting, setGranting] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  const isAdmin = session?.user?.email?.toLowerCase() === "berglin1998@gmail.com";

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/overview");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load admin data");
      }

      setStats(data.stats);
      setUsers(data.users || []);
    } catch (err: any) {
      setErrorMsg(err?.message || "Error loading admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && isAdmin) {
      fetchAdminData();
    }
  }, [status, isAdmin]);

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setGranting(true);
    try {
      const res = await fetch("/api/admin/grant-quota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          addTemplateSlots,
          addCardCredits,
          overridePlan: overridePlan || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update quota");
      }

      setSuccessToast(data.message || "Quota updated successfully!");
      setSelectedUser(null);
      fetchAdminData();
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      alert(err?.message || "Error updating quota");
    } finally {
      setGranting(false);
    }
  };

  const handleResetPurchases = async () => {
    if (!confirm("Are you sure you want to reset ALL user purchases, subscriptions, and revenue records to zero? This will reset all non-admin users to Free status.")) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset-purchases", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setSuccessToast(data.message || "Purchases & revenue reset to zero!");
      fetchAdminData();
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      alert(err?.message || "Failed to reset purchases");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F8F3EA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#7A1F2B] border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-[#7A1F2B]">Loading Admin Control Panel...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="bg-[#FAF7F2] border-2 border-[#7A1F2B]/30 rounded-3xl p-8 sm:p-12 text-center max-w-md w-full card-shadow space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center mx-auto shadow-inner">
              <Crown className="w-8 h-8 text-[#7A1F2B]" />
            </div>
            <h2 className="text-2xl font-bold text-[#221C17]">Admin Authority Required</h2>
            <p className="text-xs text-[#221C17]/70 leading-relaxed">
              You must be logged in as an administrator (<strong className="text-[#7A1F2B]">berglin1998@gmail.com</strong>) to access the Admin Control Dashboard.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="btn-maroon inline-flex items-center gap-2 px-6 py-3 text-xs font-bold shadow-md"
              >
                <ArrowLeft className="w-4 h-4 text-[#D9A441]" />
                <span>Return to User Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === "ALL" || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#221C17] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 max-w-[1400px] mx-auto w-full px-4 sm:px-6 space-y-8">
        {/* Toast Notification */}
        {successToast && (
          <div className="fixed top-24 right-6 z-50 bg-[#5B8C69] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/20 animate-slide-down">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Header Title Bar */}
        <div className="bg-[#FAF7F2] border border-[#D9A441]/30 rounded-3xl p-6 sm:p-8 card-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#7A1F2B] text-[#D9A441] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3 fill-current" />
                <span>ADMIN AUTHORITY PANEL</span>
              </span>
              <span className="text-xs text-[#221C17]/60 font-semibold">• Live System Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#221C17]">
              Subscription Analytics &amp; Quota Top-Up Panel
            </h1>
            <p className="text-xs text-[#221C17]/70">
              Logged in as <strong className="text-[#7A1F2B]">{session?.user?.email}</strong>. View platform subscriptions, total usage metrics, and grant custom quotas to users.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleResetPurchases}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-xl bg-[#7A1F2B]/10 text-[#7A1F2B] text-xs font-extrabold hover:bg-[#7A1F2B]/20 border border-[#7A1F2B]/30 flex items-center gap-1.5 transition-all shadow-sm"
              title="Reset all non-admin user purchases and revenue to zero"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#7A1F2B]" />
              <span>Reset Purchases to ₹0</span>
            </button>
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-xl bg-[#EFE7D8] text-[#221C17] text-xs font-bold hover:bg-[#D9A441]/20 border border-[#D9A441]/40 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#7A1F2B] ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Stats</span>
            </button>
            <Link
              href="/dashboard"
              className="btn-maroon px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>User Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-[#7A1F2B]/10 border border-[#7A1F2B]/40 text-[#7A1F2B] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Overview Analytics Stat Cards (4 Cards) */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Stat 1: Total Revenue */}
            <div className="bg-[#FAF7F2] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8B6519] uppercase tracking-wider">Total Revenue</span>
                <div className="w-10 h-10 rounded-2xl bg-[#D9A441]/20 text-[#8B6519] flex items-center justify-center">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[#7A1F2B]">₹{stats.totalRevenue.toLocaleString()}</span>
                <span className="text-[11px] text-[#221C17]/60 block mt-1 font-medium">
                  From {stats.totalSubscriptions} payment subscriptions
                </span>
              </div>
            </div>

            {/* Stat 2: Subscriptions */}
            <div className="bg-[#FAF7F2] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8B6519] uppercase tracking-wider">Active Subscriptions</span>
                <div className="w-10 h-10 rounded-2xl bg-[#5B8C69]/20 text-[#5B8C69] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[#221C17]">{stats.activeSubscriptions}</span>
                <span className="text-[11px] text-[#221C17]/60 block mt-1 font-medium">
                  {stats.totalSubscriptions} total purchased plans
                </span>
              </div>
            </div>

            {/* Stat 3: Total Invitations Created */}
            <div className="bg-[#FAF7F2] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8B6519] uppercase tracking-wider">Web Invitations Built</span>
                <div className="w-10 h-10 rounded-2xl bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[#7A1F2B]">{stats.totalInvitationsCreated}</span>
                <span className="text-[11px] text-[#221C17]/60 block mt-1 font-medium">
                  Active wedding invite websites
                </span>
              </div>
            </div>

            {/* Stat 4: Instagram Cards Generated */}
            <div className="bg-[#FAF7F2] border border-[#D9A441]/30 rounded-3xl p-6 card-shadow flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8B6519] uppercase tracking-wider">Instagram Cards Exported</span>
                <div className="w-10 h-10 rounded-2xl bg-[#D9A441]/20 text-[#8B6519] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[#8B6519]">{stats.totalCardsGenerated}</span>
                <span className="text-[11px] text-[#221C17]/60 block mt-1 font-medium">
                  Custom announcement card exports
                </span>
              </div>
            </div>
          </div>
        )}

        {/* User Management & Quota Top-Up Table Section */}
        <div className="bg-[#FAF7F2] border border-[#D9A441]/30 rounded-3xl p-6 sm:p-8 card-shadow space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D9A441]/20 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#221C17] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7A1F2B]" />
                <span>User Management &amp; Quota Top-Up Authority ({filteredUsers.length})</span>
              </h3>
              <p className="text-xs text-[#221C17]/70 mt-0.5">
                View individual user usage and grant extra wedding template slots or Instagram card credits.
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#221C17]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name or email..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#EFE7D8] border border-[#D9A441]/40 text-xs font-semibold focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#EFE7D8] border border-[#D9A441]/40 text-xs font-bold text-[#7A1F2B] focus:outline-none"
              >
                <option value="ALL">All Plans</option>
                <option value="BASIC_599">BASIC ₹599</option>
                <option value="PRO_1799">PRO ₹1799</option>
                <option value="CINEMATIC_2000">CINEMATIC ₹2000</option>
                <option value="NONE">Free / Unsubscribed</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#D9A441]/30 bg-white">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#EFE7D8] text-[#7A1F2B] text-[11px] font-extrabold uppercase tracking-wider border-b border-[#D9A441]/30">
                  <th className="py-3.5 px-4">User Details</th>
                  <th className="py-3.5 px-4">Active Plan</th>
                  <th className="py-3.5 px-4">Template Slots (Used / Allowed)</th>
                  <th className="py-3.5 px-4">Card Credits (Used / Allowed)</th>
                  <th className="py-3.5 px-4">Total Revenue</th>
                  <th className="py-3.5 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9A441]/20 text-xs text-[#221C17]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#221C17]/60 font-semibold">
                      No users found matching query "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#F8F3EA]/60 transition-colors">
                      {/* User Info */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <strong className="font-bold text-[#221C17] text-xs sm:text-sm">{user.name}</strong>
                            {user.role === "ADMIN" && (
                              <span className="bg-[#7A1F2B] text-[#D9A441] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#221C17]/70 font-mono">{user.email}</span>
                        </div>
                      </td>

                      {/* Active Plan */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                            user.plan === "CINEMATIC_2000"
                              ? "bg-amber-500/20 text-amber-800 border-amber-500/50"
                              : user.plan === "PRO_1799"
                              ? "bg-[#D9A441]/20 text-[#8B6519] border-[#D9A441]/50"
                              : user.plan === "BASIC_599"
                              ? "bg-[#7A1F2B]/10 text-[#7A1F2B] border-[#7A1F2B]/30"
                              : "bg-gray-100 text-gray-600 border-gray-300"
                          }`}
                        >
                          {user.plan === "CINEMATIC_2000"
                            ? "CINEMATIC ₹2000 Plan"
                            : user.plan === "PRO_1799"
                            ? "PRO ₹1799 Plan"
                            : user.plan === "BASIC_599"
                            ? "BASIC ₹599 Plan"
                            : "Free User"}
                        </span>
                      </td>

                      {/* Template Slots */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#7A1F2B]">
                            {user.role === "ADMIN" ? `${user.usedTemplatesCount} / Unlimited` : `${user.usedTemplatesCount} / ${user.allowedTemplatesCount}`}
                          </span>
                          <span className="text-[10px] text-[#221C17]/60">
                            ({user.role === "ADMIN" ? "∞ left" : `${Math.max(0, user.allowedTemplatesCount - user.usedTemplatesCount)} left`})
                          </span>
                        </div>
                      </td>

                      {/* Card Credits */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#8B6519]">
                            {user.role === "ADMIN" ? `${user.usedCardsCount} / Unlimited` : `${user.usedCardsCount} / ${user.allowedCardsCount}`}
                          </span>
                          <span className="text-[10px] text-[#221C17]/60">
                            ({user.role === "ADMIN" ? "∞ left" : `${Math.max(0, user.allowedCardsCount - user.usedCardsCount)} left`})
                          </span>
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="py-4 px-4 font-bold text-[#5B8C69]">
                        ₹{user.totalRevenue.toLocaleString()}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setAddTemplateSlots(1);
                            setAddCardCredits(5);
                            setOverridePlan("");
                          }}
                          className="btn-maroon px-3 py-1.5 text-[11px] font-bold inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Zap className="w-3.5 h-3.5 text-[#D9A441]" />
                          <span>Grant Extra Quota</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Grant Quota Drawer */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FAF7F2] border-2 border-[#D9A441]/50 rounded-3xl p-6 sm:p-8 max-w-md w-full card-shadow relative space-y-5 animate-scale-up">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#EFE7D8] text-[#7A1F2B] hover:bg-[#7A1F2B]/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-[#D9A441]/20 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center shadow-md">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#221C17]">Admin Quota Authority Top-Up</h3>
                  <p className="text-xs text-[#221C17]/70 font-semibold">{selectedUser.name} ({selectedUser.email})</p>
                </div>
              </div>

              <form onSubmit={handleGrantSubmit} className="space-y-4">
                {/* Current Status */}
                <div className="p-3 bg-[#EFE7D8]/70 rounded-2xl border border-[#D9A441]/30 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#221C17]/60 block font-semibold">Current Templates Allowed:</span>
                    <strong className="text-[#7A1F2B] font-bold">{selectedUser.allowedTemplatesCount} Slots</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#221C17]/60 block font-semibold">Current Cards Allowed:</span>
                    <strong className="text-[#8B6519] font-bold">{selectedUser.allowedCardsCount} Credits</strong>
                  </div>
                </div>

                {/* Add Template Slots */}
                <div>
                  <label className="block text-xs font-bold text-[#7A1F2B] mb-1.5">
                    📜 Add Extra Wedding Template Slots
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 3, 5].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAddTemplateSlots(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          addTemplateSlots === preset
                            ? "bg-[#7A1F2B] text-[#F8F3EA] border-[#7A1F2B]"
                            : "bg-[#EFE7D8] text-[#221C17] border-[#D9A441]/40 hover:bg-[#D9A441]/20"
                        }`}
                      >
                        +{preset} Slot{preset > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={addTemplateSlots}
                    onChange={(e) => setAddTemplateSlots(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A441]/40 text-xs font-bold text-[#221C17] focus:outline-none focus:border-[#7A1F2B]"
                    placeholder="Enter number of extra template slots to add"
                  />
                </div>

                {/* Add Card Credits */}
                <div>
                  <label className="block text-xs font-bold text-[#8B6519] mb-1.5">
                    🎨 Add Extra Instagram Card Credits
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    {[5, 10, 25].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAddCardCredits(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          addCardCredits === preset
                            ? "bg-[#8B6519] text-white border-[#8B6519]"
                            : "bg-[#EFE7D8] text-[#221C17] border-[#D9A441]/40 hover:bg-[#D9A441]/20"
                        }`}
                      >
                        +{preset} Credits
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={addCardCredits}
                    onChange={(e) => setAddCardCredits(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A441]/40 text-xs font-bold text-[#221C17] focus:outline-none focus:border-[#7A1F2B]"
                    placeholder="Enter number of extra card credits to add"
                  />
                </div>

                {/* Optional Plan Upgrade */}
                <div>
                  <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
                    👑 Optional Plan Override
                  </label>
                  <select
                    value={overridePlan}
                    onChange={(e) => setOverridePlan(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A441]/40 text-xs font-semibold focus:outline-none focus:border-[#7A1F2B]"
                  >
                    <option value="">Keep current plan ({selectedUser.plan})</option>
                    <option value="BASIC_599">Set Plan to BASIC ₹599 (1 Template + 2 Cards)</option>
                    <option value="PRO_1799">Set Plan to PRO ₹1799 (4 Templates + 6 Cards)</option>
                    <option value="CINEMATIC_2000">Set Plan to CINEMATIC ₹2000 (1 Premium Template + 10 Cards)</option>
                    <option value="NONE">Reset Plan to Free User</option>
                  </select>
                </div>

                {/* Submit Action */}
                <div className="pt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="w-1/2 py-3 rounded-full border border-[#D9A441] text-xs font-bold text-[#221C17] hover:bg-[#EFE7D8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={granting}
                    className="btn-maroon w-1/2 py-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-[#D9A441]" />
                    <span>{granting ? "Granting..." : "Grant Authority Quota"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
