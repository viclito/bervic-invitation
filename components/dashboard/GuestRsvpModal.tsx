"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Users,
  UserPlus,
  FileSpreadsheet,
  Download,
  Send,
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Upload,
  Zap,
  PhoneCall,
  Play,
  Pause,
  Sliders,
  Pencil,
} from "lucide-react";

interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: "PENDING" | "ATTENDING" | "DECLINED";
  plusOnes: number;
  dietaryNotes: string | null;
  uniqueCode: string;
  whatsappSentAt: string | null;
  reminderSentAt: string | null;
}

interface Stats {
  totalGuests: number;
  attending: number;
  declined: number;
  pending: number;
  totalPlusOnes: number;
  totalAttendingPeople: number;
  responseRate: number;
}

interface GuestRsvpModalProps {
  invitationId: string;
  invitationSlug: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  venuePlace: string;
  onClose?: () => void;
  isFullPage?: boolean;
}

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", label: "India (+91)" },
  { code: "+1", flag: "🇺🇸", label: "USA/Canada (+1)" },
  { code: "+44", flag: "🇬🇧", label: "UK (+44)" },
  { code: "+971", flag: "🇦🇪", label: "UAE (+971)" },
  { code: "+65", flag: "🇸🇬", label: "Singapore (+65)" },
  { code: "+61", flag: "🇦🇺", label: "Australia (+61)" },
  { code: "+966", flag: "🇸🇦", label: "Saudi Arabia (+966)" },
  { code: "+60", flag: "🇲🇾", label: "Malaysia (+60)" },
  { code: "+974", flag: "🇶🇦", label: "Qatar (+974)" },
  { code: "+968", flag: "🇴🇲", label: "Oman (+968)" },
  { code: "+965", flag: "🇰🇼", label: "Kuwait (+965)" },
  { code: "+973", flag: "🇧🇭", label: "Bahrain (+973)" },
  { code: "+49", flag: "🇩🇪", label: "Germany (+49)" },
  { code: "+33", flag: "🇫🇷", label: "France (+33)" },
  { code: "+39", flag: "🇮🇹", label: "Italy (+39)" },
  { code: "+34", flag: "🇪🇸", label: "Spain (+34)" },
  { code: "+81", flag: "🇯🇵", label: "Japan (+81)" },
  { code: "+82", flag: "🇰🇷", label: "South Korea (+82)" },
  { code: "+86", flag: "🇨🇳", label: "China (+86)" },
  { code: "+852", flag: "🇭🇰", label: "Hong Kong (+852)" },
  { code: "+63", flag: "🇵🇭", label: "Philippines (+63)" },
  { code: "+62", flag: "🇮🇩", label: "Indonesia (+62)" },
  { code: "+66", flag: "🇹🇭", label: "Thailand (+66)" },
  { code: "+84", flag: "🇻🇳", label: "Vietnam (+84)" },
  { code: "+94", flag: "🇱🇰", label: "Sri Lanka (+94)" },
  { code: "+977", flag: "🇳🇵", label: "Nepal (+977)" },
  { code: "+880", flag: "🇧🇩", label: "Bangladesh (+880)" },
  { code: "+92", flag: "🇵🇰", label: "Pakistan (+92)" },
  { code: "+27", flag: "🇿🇦", label: "South Africa (+27)" },
  { code: "+55", flag: "🇧🇷", label: "Brazil (+55)" },
  { code: "+52", flag: "🇲🇽", label: "Mexico (+52)" },
  { code: "+64", flag: "🇳🇿", label: "New Zealand (+64)" },
];

const DEFAULT_INVITATION_MSG = `Dear {guest_name},

We joyfully request the pleasure of your company to celebrate the wedding of {couple_names}!

📅 Date: {wedding_date}
📍 Venue: {venue}

Click below to view our interactive digital invitation card & confirm your RSVP:
{invitation_link}

With love,
{couple_names}`;

const DEFAULT_REMINDER_MSG = `Hi {guest_name},

This is a gentle reminder regarding the wedding of {couple_names}!

We would love to know if you can join us on {wedding_date} at {venue}.

Please take a quick moment to respond to our invitation card:
{invitation_link}

Warm regards,
{couple_names}`;

export default function GuestRsvpModal({
  invitationId,
  invitationSlug,
  partnerOne,
  partnerTwo,
  weddingDate,
  venuePlace,
  onClose,
  isFullPage = false,
}: GuestRsvpModalProps) {
  const [activeTab, setActiveTab] = useState<"guests" | "broadcast" | "import">("guests");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalGuests: 0,
    attending: 0,
    declined: 0,
    pending: 0,
    totalPlusOnes: 0,
    totalAttendingPeople: 0,
    responseRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Single Guest Form State
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("+91");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newStatus, setNewStatus] = useState<"PENDING" | "ATTENDING" | "DECLINED">("PENDING");
  const [newPlusOnes, setNewPlusOnes] = useState(0);
  const [addingGuest, setAddingGuest] = useState(false);

  // Edit Guest Form State
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editName, setEditName] = useState("");
  const [editCountryCode, setEditCountryCode] = useState("+91");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState<"PENDING" | "ATTENDING" | "DECLINED">("PENDING");
  const [editPlusOnes, setEditPlusOnes] = useState(0);
  const [editDietaryNotes, setEditDietaryNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Message Broadcast State
  const [msgTemplate, setMsgTemplate] = useState(DEFAULT_INVITATION_MSG);
  const [activeBroadcastFilter, setActiveBroadcastFilter] = useState<"ALL" | "PENDING" | "ATTENDING">("PENDING");
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  // Auto-Broadcast Streamer State
  const [isAutoStreaming, setIsAutoStreaming] = useState(false);
  const [autoStreamDelay, setAutoStreamDelay] = useState(2); // seconds delay between messages
  const autoStreamTimerRef = useRef<NodeJS.Timeout | null>(null);

  // CSV Import State
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string }>({});

  const publicLink = typeof window !== "undefined"
    ? `${window.location.origin}/invitations/${invitationSlug}`
    : `https://bervic.app/invitations/${invitationSlug}`;

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invitations/${invitationId}/guests`);
      const data = await res.json();
      if (res.ok) {
        setGuests(data.guests || []);
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [invitationId]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    setAddingGuest(true);
    try {
      const fullPhone = newPhone.startsWith("+")
        ? newPhone
        : `${newCountryCode}${newPhone.replace(/^[0\s-]+/g, "")}`;

      const res = await fetch(`/api/invitations/${invitationId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          phone: fullPhone,
          email: newEmail,
          status: newStatus,
          plusOnes: newPlusOnes,
        }),
      });

      if (res.ok) {
        setNewName("");
        setNewPhone("");
        setNewEmail("");
        setNewPlusOnes(0);
        setShowAddGuest(false);
        fetchGuests();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingGuest(false);
    }
  };

  const startEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setEditName(guest.name);
    setEditStatus(guest.status);
    setEditPlusOnes(guest.plusOnes);
    setEditDietaryNotes(guest.dietaryNotes || "");

    let matchedCode = "+91";
    let phoneWithoutCode = guest.phone.trim();

    for (const item of COUNTRY_CODES) {
      if (guest.phone.startsWith(item.code)) {
        matchedCode = item.code;
        phoneWithoutCode = guest.phone.slice(item.code.length).trim();
        break;
      }
    }

    setEditCountryCode(matchedCode);
    setEditPhone(phoneWithoutCode);
  };

  const handleSaveEditGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest || !editName || !editPhone) return;

    setSavingEdit(true);
    try {
      const fullPhone = editPhone.startsWith("+")
        ? editPhone
        : `${editCountryCode}${editPhone.replace(/^[0\s-]+/g, "")}`;

      const res = await fetch(`/api/invitations/${invitationId}/guests`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: editingGuest.id,
          name: editName,
          phone: fullPhone,
          status: editStatus,
          plusOnes: editPlusOnes,
          dietaryNotes: editDietaryNotes,
        }),
      });

      if (res.ok) {
        setEditingGuest(null);
        fetchGuests();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Are you sure you want to remove this guest?")) return;
    try {
      const res = await fetch(`/api/invitations/${invitationId}/guests?guestId=${guestId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchGuests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatMessageForGuest = (guest: Guest) => {
    const coupleNames = `${partnerOne} & ${partnerTwo}`;
    const codeParam = guest.uniqueCode ? `?code=${guest.uniqueCode}` : `?to=${encodeURIComponent(guest.name)}`;
    const personalizedLink = `${publicLink}${codeParam}`;
    return msgTemplate
      .replace(/{guest_name}/g, guest.name)
      .replace(/{couple_names}/g, coupleNames)
      .replace(/{wedding_date}/g, weddingDate)
      .replace(/{venue}/g, venuePlace)
      .replace(/{invitation_link}/g, personalizedLink);
  };

  const openWhatsAppForGuest = (guest: Guest) => {
    let rawPhone = guest.phone.trim();
    let cleanDigits = rawPhone.replace(/[^\d]/g, "");

    // If number is 10 digits without leading + or country code, default to India (+91)
    if (!rawPhone.startsWith("+") && cleanDigits.length === 10) {
      cleanDigits = "91" + cleanDigits;
    }

    const formattedMsg = encodeURIComponent(formatMessageForGuest(guest));
    const url = `https://wa.me/${cleanDigits}?text=${formattedMsg}`;
    window.open(url, "_blank");
  };

  // Automated 500+ Guest Sequential Broadcast Streamer
  const broadcastQueue = guests.filter((g) => {
    if (activeBroadcastFilter === "ALL") return true;
    return g.status === activeBroadcastFilter;
  });

  const startAutoStream = () => {
    if (broadcastQueue.length === 0) return;
    setIsAutoStreaming(true);
  };

  const stopAutoStream = () => {
    setIsAutoStreaming(false);
    if (autoStreamTimerRef.current) {
      clearTimeout(autoStreamTimerRef.current);
    }
  };

  useEffect(() => {
    if (isAutoStreaming && currentQueueIndex < broadcastQueue.length) {
      const currentGuest = broadcastQueue[currentQueueIndex];
      if (currentGuest) {
        openWhatsAppForGuest(currentGuest);
      }

      if (currentQueueIndex + 1 < broadcastQueue.length) {
        autoStreamTimerRef.current = setTimeout(() => {
          setCurrentQueueIndex((prev) => prev + 1);
        }, autoStreamDelay * 1000);
      } else {
        setIsAutoStreaming(false);
      }
    }

    return () => {
      if (autoStreamTimerRef.current) clearTimeout(autoStreamTimerRef.current);
    };
  }, [isAutoStreaming, currentQueueIndex]);

  const handleImportCsv = async () => {
    if (!csvText.trim()) return;

    setImporting(true);
    setImportStatus({});

    try {
      const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
      const parsedGuests = lines.map((line) => {
        const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
        return {
          name: parts[0] || "Guest",
          phone: parts[1] || "",
          status: parts[2] ? parts[2].toUpperCase() : "PENDING",
          plusOnes: parts[3] ? parseInt(parts[3], 10) || 0 : 0,
          email: parts[4] || null,
        };
      }).filter((g) => g.phone.length >= 5);

      if (parsedGuests.length === 0) {
        setImportStatus({ success: false, message: "No valid guest rows found in CSV data." });
        setImporting(false);
        return;
      }

      const res = await fetch(`/api/invitations/${invitationId}/guests/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests: parsedGuests }),
      });

      const data = await res.json();
      if (res.ok) {
        setImportStatus({ success: true, message: data.message || `Successfully imported guests!` });
        setCsvText("");
        fetchGuests();
      } else {
        setImportStatus({ success: false, message: data.error || "Failed to import guests" });
      }
    } catch (err: any) {
      setImportStatus({ success: false, message: err?.message || "Import failed" });
    } finally {
      setImporting(false);
    }
  };

  const exportCsv = () => {
    if (guests.length === 0) return;
    const header = "Name,Phone,Status,PlusOnes,Email,DietaryNotes\n";
    const rows = guests
      .map(
        (g) =>
          `"${g.name}","${g.phone}","${g.status}",${g.plusOnes},"${g.email || ""}","${g.dietaryNotes || ""}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Guests_${invitationSlug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export 500+ Phone Contacts as .VCF (vCard) file for WhatsApp Broadcast Group
  const exportVcard = () => {
    if (guests.length === 0) return;
    let vcfContent = "";
    guests.forEach((g) => {
      const cleanPhone = g.phone.replace(/[^\d+]/g, "");
      vcfContent += `BEGIN:VCARD\nVERSION:3.0\nN:;WeddingGuest_${g.name.replace(/\s+/g, "_")};;;\nFN:WeddingGuest ${g.name}\nTEL;TYPE=CELL:${cleanPhone}\nEND:VCARD\n`;
    });

    const blob = new Blob([vcfContent], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `WhatsApp_Broadcast_Contacts_${invitationSlug}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "ALL" || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const modalContent = (
    <div data-lenis-prevent className={`bg-[#F8F3EA] border-2 border-[#D9A441]/40 rounded-3xl w-full flex flex-col shadow-xl overflow-hidden text-[#221C17] ${isFullPage ? "" : "max-w-5xl max-h-[92vh] shadow-2xl overscroll-contain"}`}>
      {/* Modal Header */}
      <div className="p-3.5 sm:p-6 border-b border-[#D9A441]/20 bg-[#EFE7D8] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center shadow-md shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-xl font-bold text-[#221C17] flex flex-wrap items-center gap-1.5 leading-tight">
              <span>Invite via WhatsApp</span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] font-semibold border border-[#7A1F2B]/20">
                {stats.totalGuests} Guests
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-[#221C17]/70 font-medium truncate max-w-[210px] sm:max-w-none mt-0.5">
              {partnerOne} & {partnerTwo}&apos;s Guestlist & WhatsApp Engine
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => {
              stopAutoStream();
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-full hover:bg-black/10 text-[#221C17]/70 hover:text-[#221C17] transition-all shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

        {/* Analytics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-2.5 sm:p-4 bg-[#F8F3EA] border-b border-[#D9A441]/20">
          <div className="p-2 sm:p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              ATTENDING
            </span>
            <div className="text-base sm:text-xl font-bold text-emerald-900 mt-0.5">
              {stats.attending}{" "}
              <span className="text-[10px] sm:text-xs font-normal text-emerald-700">
                (+{stats.totalPlusOnes})
              </span>
            </div>
          </div>

          <div className="p-2 sm:p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              PENDING
            </span>
            <div className="text-base sm:text-xl font-bold text-amber-900 mt-0.5">{stats.pending}</div>
          </div>

          <div className="p-2 sm:p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
              DECLINED
            </span>
            <div className="text-base sm:text-xl font-bold text-rose-900 mt-0.5">{stats.declined}</div>
          </div>

          <div className="p-2 sm:p-3 rounded-2xl bg-[#7A1F2B]/10 border border-[#7A1F2B]/20 text-center">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#7A1F2B] block">
              RESPONSE RATE
            </span>
            <div className="text-base sm:text-xl font-bold text-[#7A1F2B] mt-0.5">{stats.responseRate}%</div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#D9A441]/20 px-2 sm:px-6 bg-[#EFE7D8]/50 overflow-x-auto shrink-0 whitespace-nowrap">
          <button
            onClick={() => setActiveTab("guests")}
            className={`py-2.5 sm:py-3 px-3 sm:px-5 text-xs font-bold border-b-2 shrink-0 flex items-center gap-1.5 sm:gap-2 transition-all ${
              activeTab === "guests"
                ? "border-[#7A1F2B] text-[#7A1F2B]"
                : "border-transparent text-[#221C17]/60 hover:text-[#221C17]"
            }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Roster ({stats.totalGuests})</span>
          </button>

          <button
            onClick={() => setActiveTab("broadcast")}
            className={`py-2.5 sm:py-3 px-3 sm:px-5 text-xs font-bold border-b-2 shrink-0 flex items-center gap-1.5 sm:gap-2 transition-all ${
              activeTab === "broadcast"
                ? "border-[#7A1F2B] text-[#7A1F2B]"
                : "border-transparent text-[#221C17]/60 hover:text-[#221C17]"
            }`}
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D9A441]" />
            <span className="hidden sm:inline">⚡ 500+ WhatsApp Auto-Broadcast</span>
            <span className="sm:hidden">⚡ WhatsApp Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab("import")}
            className={`py-2.5 sm:py-3 px-3 sm:px-5 text-xs font-bold border-b-2 shrink-0 flex items-center gap-1.5 sm:gap-2 transition-all ${
              activeTab === "import"
                ? "border-[#7A1F2B] text-[#7A1F2B]"
                : "border-transparent text-[#221C17]/60 hover:text-[#221C17]"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">CSV & .VCF Broadcast Contacts</span>
            <span className="sm:hidden">CSV & .VCF Import</span>
          </button>
        </div>

        {/* Tab 1: Guest List Table & Mobile Cards */}
        {activeTab === "guests" && (
          <div data-lenis-prevent className="p-3 sm:p-6 flex-1 overflow-y-auto space-y-3 sm:space-y-4 overscroll-contain">

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#221C17]/50 absolute left-3 top-2.5 sm:top-3" />
                  <input
                    type="text"
                    placeholder="Search name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D9A441]/30 text-xs font-medium focus:outline-none focus:border-[#7A1F2B]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 sm:px-3 py-2 rounded-xl bg-white border border-[#D9A441]/30 text-xs font-semibold focus:outline-none focus:border-[#7A1F2B] shrink-0"
                >
                  <option value="ALL">All Status</option>
                  <option value="ATTENDING">Attending</option>
                  <option value="PENDING">Pending</option>
                  <option value="DECLINED">Declined</option>
                </select>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => setShowAddGuest(!showAddGuest)}
                  className="btn-maroon px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm w-full sm:w-auto"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>{showAddGuest ? "Cancel" : "Add Guest"}</span>
                </button>
              </div>
            </div>

            {/* Add Guest Form Drawer */}
            {showAddGuest && (
              <form
                onSubmit={handleAddGuest}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#EFE7D8] border border-[#D9A441]/40 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in shadow-md"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D9A441]/30 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">WhatsApp Phone *</label>
                  <div className="flex items-center gap-1">
                    <select
                      value={newCountryCode}
                      onChange={(e) => setNewCountryCode(e.target.value)}
                      className="px-2 py-1.5 rounded-lg bg-white border border-[#D9A441]/30 text-xs font-bold shrink-0 w-24"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-white border border-[#D9A441]/30 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">RSVP Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D9A441]/30 text-xs font-medium"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ATTENDING">Attending</option>
                    <option value="DECLINED">Declined</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex justify-end gap-2 pt-1 sm:pt-2">
                  <button
                    type="submit"
                    disabled={addingGuest}
                    className="btn-maroon px-5 py-2 text-xs font-bold flex items-center gap-1.5 w-full sm:w-auto justify-center"
                  >
                    {addingGuest ? "Saving..." : "Save Guest to List"}
                  </button>
                </div>
              </form>
            )}

            {/* Edit Guest Form Drawer */}
            {editingGuest && (
              <form
                onSubmit={handleSaveEditGuest}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#EFE7D8] border-2 border-[#7A1F2B]/40 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in shadow-md mb-2"
              >
                <div className="sm:col-span-3 flex items-center justify-between border-b border-[#D9A441]/20 pb-2">
                  <h4 className="text-xs font-bold text-[#7A1F2B] uppercase tracking-wider flex items-center gap-1.5">
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Guest Details ({editingGuest.name})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingGuest(null)}
                    className="text-[#221C17]/60 hover:text-[#221C17] text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D9A441]/30 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">WhatsApp Phone *</label>
                  <div className="flex items-center gap-1">
                    <select
                      value={editCountryCode}
                      onChange={(e) => setEditCountryCode(e.target.value)}
                      className="px-2 py-1.5 rounded-lg bg-white border border-[#D9A441]/30 text-xs font-bold shrink-0 w-24"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-white border border-[#D9A441]/30 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">RSVP Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D9A441]/30 text-xs font-medium"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ATTENDING">Attending</option>
                    <option value="DECLINED">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Plus Ones (+)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={editPlusOnes}
                    onChange={(e) => setEditPlusOnes(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D9A441]/30 text-xs font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase mb-1">Dietary / Special Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetarian, VIP guest"
                    value={editDietaryNotes}
                    onChange={(e) => setEditDietaryNotes(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D9A441]/30 text-xs font-medium"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingGuest(null)}
                    className="px-4 py-1.5 rounded-lg bg-gray-200 text-gray-800 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="btn-maroon px-5 py-1.5 text-xs font-bold flex items-center gap-1.5"
                  >
                    {savingEdit ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* Guest List Table & Mobile Cards */}
            {loading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#7A1F2B] border-t-transparent animate-spin mx-auto mb-2" />
                <span className="text-xs text-[#221C17]/70 font-semibold">Loading guest list...</span>
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-[#D9A441]/30 rounded-2xl text-center p-4">
                <Users className="w-10 h-10 text-[#D9A441] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#221C17]">No Guests Found</h4>
                <p className="text-xs text-[#221C17]/70 mt-1 max-w-sm mx-auto">
                  Add guests manually or import your guest CSV file to begin sending 1-click WhatsApp invitations.
                </p>
              </div>
            ) : (
              <>
                {/* Mobile Card Layout (< 768px) */}
                <div className="block md:hidden space-y-2.5">
                  {filteredGuests.map((guest) => (
                    <div key={guest.id} className="p-3 rounded-2xl bg-white border border-[#D9A441]/30 space-y-2 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs sm:text-sm text-[#221C17] truncate">{guest.name}</h4>
                          <span className="font-mono text-[11px] text-[#221C17]/70 block mt-0.5">{guest.phone}</span>
                        </div>
                        <div className="shrink-0">
                          {guest.status === "ATTENDING" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Attending (+{guest.plusOnes})
                            </span>
                          )}
                          {guest.status === "DECLINED" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                              <XCircle className="w-3 h-3" /> Declined
                            </span>
                          )}
                          {guest.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </div>
                      </div>

                      {guest.dietaryNotes && (
                        <p className="text-[11px] text-[#7A1F2B] italic bg-[#F8F3EA] p-1.5 rounded-lg">
                          Note: {guest.dietaryNotes}
                        </p>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#D9A441]/10">
                        <button
                          onClick={() => openWhatsAppForGuest(guest)}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => startEditGuest(guest)}
                          className="p-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all shrink-0"
                          title="Edit Guest"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all shrink-0"
                          title="Delete Guest"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View (≥ 768px) */}
                <div className="hidden md:block border border-[#D9A441]/30 rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EFE7D8] text-[#221C17] font-bold uppercase text-[10px] tracking-wider border-b border-[#D9A441]/20">
                      <tr>
                        <th className="py-3 px-4">Guest Name</th>
                        <th className="py-3 px-4">WhatsApp Phone</th>
                        <th className="py-3 px-4">RSVP Status</th>
                        <th className="py-3 px-4">Plus Ones</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D9A441]/10">
                      {filteredGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-[#F8F3EA]/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-[#221C17]">
                            {guest.name}
                            {guest.dietaryNotes && (
                              <span className="block text-[10px] text-[#7A1F2B] font-normal italic">
                                Note: {guest.dietaryNotes}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-[#221C17]/80">{guest.phone}</td>
                          <td className="py-3 px-4">
                            {guest.status === "ATTENDING" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" /> Attending
                              </span>
                            )}
                            {guest.status === "DECLINED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                                <XCircle className="w-3 h-3" /> Declined
                              </span>
                            )}
                            {guest.status === "PENDING" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            {guest.status === "ATTENDING" ? `+${guest.plusOnes}` : "-"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openWhatsAppForGuest(guest)}
                                className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-all flex items-center gap-1 shadow-sm"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </button>

                              <button
                                onClick={() => startEditGuest(guest)}
                                className="p-1 rounded-lg hover:bg-amber-50 text-amber-700 transition-all"
                                title="Edit Guest"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteGuest(guest.id)}
                                className="p-1 rounded-lg hover:bg-red-50 text-red-600 transition-all"
                                title="Delete Guest"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: 500+ WhatsApp Automated Broadcast Suite */}
        {activeTab === "broadcast" && (
          <div data-lenis-prevent className="p-3 sm:p-6 flex-1 overflow-y-auto space-y-4 sm:space-y-6 overscroll-contain">

            {/* Banner explaining 500+ Guest Dispatch Modes */}
            <div className="bg-[#EFE7D8] p-3.5 sm:p-5 rounded-2xl border border-[#D9A441]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#221C17] flex items-center gap-2">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#D9A441] fill-current shrink-0" />
                  <span>500+ Automated WhatsApp Broadcast Engine</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-[#221C17]/70 mt-0.5 font-medium">
                  Dispatch invitations to guests automatically in sequence or export contact files for WhatsApp Broadcast Groups.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                <button
                  onClick={() => setMsgTemplate(DEFAULT_INVITATION_MSG)}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    msgTemplate === DEFAULT_INVITATION_MSG
                      ? "bg-[#7A1F2B] text-white border-[#7A1F2B]"
                      : "bg-white text-[#7A1F2B] border-[#7A1F2B]/30 hover:bg-[#7A1F2B]/5"
                  }`}
                >
                  Card Invitation
                </button>
                <button
                  onClick={() => setMsgTemplate(DEFAULT_REMINDER_MSG)}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    msgTemplate === DEFAULT_REMINDER_MSG
                      ? "bg-[#7A1F2B] text-white border-[#7A1F2B]"
                      : "bg-white text-[#7A1F2B] border-[#7A1F2B]/30 hover:bg-[#7A1F2B]/5"
                  }`}
                >
                  Pending Reminder
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* ⚡ Primary Action: Automated 500+ Broadcast Control Panel */}
              <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#D9A441]/30 flex flex-col justify-between space-y-3 sm:space-y-4 order-1">
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#221C17] flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#7A1F2B]" />
                      <span>Auto-Broadcast Stream</span>
                    </h4>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setActiveBroadcastFilter("PENDING")}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          activeBroadcastFilter === "PENDING"
                            ? "bg-amber-500 text-white"
                            : "bg-[#EFE7D8] text-[#221C17]"
                        }`}
                      >
                        Pending ({stats.pending})
                      </button>
                      <button
                        onClick={() => setActiveBroadcastFilter("ALL")}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          activeBroadcastFilter === "ALL"
                            ? "bg-[#7A1F2B] text-white"
                            : "bg-[#EFE7D8] text-[#221C17]"
                        }`}
                      >
                        All ({stats.totalGuests})
                      </button>
                    </div>
                  </div>

                  {/* Delay Config */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/30 mb-3 flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-[#221C17] text-[11px] sm:text-xs">Stream Delay:</span>
                    <select
                      value={autoStreamDelay}
                      onChange={(e) => setAutoStreamDelay(Number(e.target.value))}
                      className="px-2 py-1 rounded-lg bg-white border border-[#D9A441]/40 font-bold text-xs"
                    >
                      <option value={1}>1 sec / guest</option>
                      <option value={2}>2 sec / guest (Recommended)</option>
                      <option value={3}>3 sec / guest</option>
                      <option value={5}>5 sec / guest</option>
                    </select>
                  </div>

                  {/* Queue Progress Bar */}
                  {broadcastQueue.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs font-bold text-[#221C17] mb-1">
                        <span>Progress: {currentQueueIndex + 1} / {broadcastQueue.length}</span>
                        <span>{Math.round(((currentQueueIndex + 1) / broadcastQueue.length) * 100)}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EFE7D8] overflow-hidden">
                        <div
                          className="h-full bg-[#7A1F2B] transition-all duration-300"
                          style={{
                            width: `${((currentQueueIndex + 1) / broadcastQueue.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Active Queue Item Display */}
                  {broadcastQueue.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#221C17]/60">
                      No guests match the selected filter.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {broadcastQueue.map((g, idx) => (
                        <div
                          key={g.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            idx === currentQueueIndex
                              ? "bg-[#7A1F2B]/10 border-[#7A1F2B] font-bold"
                              : "bg-[#F8F3EA]/40 border-[#D9A441]/20 opacity-70"
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <span className="text-[#221C17] block truncate">{g.name}</span>
                            <span className="text-[10px] text-[#221C17]/60 block font-mono">
                              {g.phone}
                            </span>
                          </div>

                          <button
                            onClick={() => openWhatsAppForGuest(g)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition-all flex items-center gap-1 shrink-0"
                          >
                            <Send className="w-3 h-3" /> Send
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 1-Click Stream Action Button */}
                {broadcastQueue.length > 0 && (
                  <div className="pt-2 border-t border-[#D9A441]/20">
                    {isAutoStreaming ? (
                      <button
                        onClick={stopAutoStream}
                        className="w-full py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md animate-pulse"
                      >
                        <Pause className="w-4 h-4" />
                        <span>Pause Auto-Broadcast Stream</span>
                      </button>
                    ) : (
                      <button
                        onClick={startAutoStream}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <Zap className="w-4 h-4 text-amber-300 fill-current" />
                        <span>⚡ 1-Click Auto-Broadcast All {broadcastQueue.length} Guests</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Template Editor */}
              <div className="order-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#221C17] mb-1.5">
                  Message Template Text
                </label>
                <textarea
                  rows={5}
                  value={msgTemplate}
                  onChange={(e) => setMsgTemplate(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white border border-[#D9A441]/40 text-xs font-mono text-[#221C17] focus:outline-none focus:border-[#7A1F2B] shadow-inner"
                />

                <div className="mt-2 p-2.5 rounded-xl bg-[#EFE7D8]/60 text-[11px] text-[#221C17]/80 flex flex-wrap items-center justify-between gap-1">
                  <span className="truncate max-w-[220px]">
                    Link: <strong>{publicLink}</strong>
                  </span>
                  <a
                    href={publicLink}
                    target="_blank"
                    className="text-[#7A1F2B] font-bold underline flex items-center gap-1 shrink-0"
                  >
                    Preview Card <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: CSV & .VCF WhatsApp Broadcast Contacts */}
        {activeTab === "import" && (
          <div data-lenis-prevent className="p-3 sm:p-6 flex-1 overflow-y-auto space-y-4 sm:space-y-6 overscroll-contain">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Import Section */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#D9A441]/30">
                <h3 className="text-xs sm:text-sm font-bold text-[#221C17] mb-1.5 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#7A1F2B]" />
                  <span>Batch Import Guests (CSV Data)</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-[#221C17]/70 mb-3">
                  Paste CSV lines formatted as: <br />
                  <code className="text-[#7A1F2B] font-mono text-[10px] sm:text-[11px]">
                    Name, Phone, Status, PlusOnes, Email
                  </code>
                </p>

                <textarea
                  rows={5}
                  placeholder={`John Doe, +15550192831, PENDING, 0, john@example.com\nJane Smith, +15550192832, ATTENDING, 1, jane@example.com`}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs font-mono focus:outline-none focus:border-[#7A1F2B]"
                />

                {importStatus.message && (
                  <div
                    className={`mt-2.5 p-2.5 rounded-xl text-xs font-semibold ${
                      importStatus.success
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {importStatus.message}
                  </div>
                )}

                <button
                  onClick={handleImportCsv}
                  disabled={importing || !csvText.trim()}
                  className="btn-maroon w-full py-2.5 mt-3 text-xs font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {importing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#D9A441]" />
                      <span>Importing Guest CSV...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-[#D9A441]" />
                      <span>Process & Add Guests</span>
                    </>
                  )}
                </button>
              </div>

              {/* Export Section: CSV & WhatsApp Native Broadcast Group .VCF */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#D9A441]/30 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#221C17] mb-1.5 flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-[#7A1F2B]" />
                    <span>WhatsApp Native Broadcast (.VCF Contacts)</span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#221C17]/70 mb-3">
                    Download a 1-click <strong>.VCF Contact File</strong>. Import it into your mobile phone contacts, and create a <strong>WhatsApp Broadcast List</strong> to message all guests at once!
                  </p>

                  <div className="p-3 rounded-xl bg-[#EFE7D8]/60 text-xs space-y-1">
                    <div>
                      Total Roster Records: <strong>{stats.totalGuests} Guests</strong>
                    </div>
                    <div>
                      Attending Headcount: <strong>{stats.totalAttendingPeople} People</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={exportVcard}
                    disabled={guests.length === 0}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-current" />
                    <span>Download WhatsApp Broadcast .VCF File</span>
                  </button>

                  <button
                    onClick={exportCsv}
                    disabled={guests.length === 0}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#7A1F2B] text-white text-xs font-bold hover:bg-[#601822] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 text-[#D9A441]" />
                    <span>Download .CSV Roster File</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );

  if (isFullPage) {
    return modalContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" data-lenis-prevent>
      {modalContent}
    </div>
  );
}
