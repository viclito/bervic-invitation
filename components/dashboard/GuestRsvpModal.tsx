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
  onClose: () => void;
}

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
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newStatus, setNewStatus] = useState<"PENDING" | "ATTENDING" | "DECLINED">("PENDING");
  const [newPlusOnes, setNewPlusOnes] = useState(0);
  const [addingGuest, setAddingGuest] = useState(false);

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
      const res = await fetch(`/api/invitations/${invitationId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          phone: newPhone,
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

  const formatMessageForGuest = (guestName: string) => {
    const coupleNames = `${partnerOne} & ${partnerTwo}`;
    const personalizedLink = `${publicLink}?to=${encodeURIComponent(guestName)}`;
    return msgTemplate
      .replace(/{guest_name}/g, guestName)
      .replace(/{couple_names}/g, coupleNames)
      .replace(/{wedding_date}/g, weddingDate)
      .replace(/{venue}/g, venuePlace)
      .replace(/{invitation_link}/g, personalizedLink);
  };


  const openWhatsAppForGuest = (guest: Guest) => {
    let cleanPhone = guest.phone.replace(/[^\d]/g, "");
    const formattedMsg = encodeURIComponent(formatMessageForGuest(guest.name));
    const url = `https://wa.me/${cleanPhone}?text=${formattedMsg}`;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" data-lenis-prevent>
      <div data-lenis-prevent className="bg-[#F8F3EA] border-2 border-[#D9A441]/40 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#221C17] overscroll-contain">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#D9A441]/20 bg-[#EFE7D8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#221C17] flex items-center gap-2">
                <span>Guest RSVP & WhatsApp Suite</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] font-semibold border border-[#7A1F2B]/20">
                  {stats.totalGuests} Guests
                </span>
              </h2>
              <p className="text-xs text-[#221C17]/70 font-medium">
                {partnerOne} & {partnerTwo}&apos;s Wedding Guestlist & 500+ WhatsApp Broadcast Engine
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAutoStream();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-black/10 text-[#221C17]/70 hover:text-[#221C17] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F8F3EA] border-b border-[#D9A441]/20">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              ATTENDING
            </span>
            <div className="text-xl font-bold text-emerald-900 mt-0.5">
              {stats.attending}{" "}
              <span className="text-xs font-normal text-emerald-700">
                (+{stats.totalPlusOnes} guests)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              PENDING
            </span>
            <div className="text-xl font-bold text-amber-900 mt-0.5">{stats.pending}</div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
              DECLINED
            </span>
            <div className="text-xl font-bold text-rose-900 mt-0.5">{stats.declined}</div>
          </div>

          <div className="p-3 rounded-2xl bg-[#7A1F2B]/10 border border-[#7A1F2B]/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A1F2B] block">
              RESPONSE RATE
            </span>
            <div className="text-xl font-bold text-[#7A1F2B] mt-0.5">{stats.responseRate}%</div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#D9A441]/20 px-6 bg-[#EFE7D8]/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab("guests")}
            className={`py-3 px-5 text-xs font-bold border-b-2 shrink-0 flex items-center gap-2 transition-all ${
              activeTab === "guests"
                ? "border-[#7A1F2B] text-[#7A1F2B]"
                : "border-transparent text-[#221C17]/60 hover:text-[#221C17]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Guest Roster ({stats.totalGuests})</span>
          </button>

          <button
            onClick={() => setActiveTab("broadcast")}
            className={`py-3 px-5 text-xs font-bold border-b-2 shrink-0 flex items-center gap-2 transition-all ${
              activeTab === "broadcast"
                ? "border-[#7A1F2B] text-[#7A1F2B]"
                : "border-transparent text-[#221C17]/60 hover:text-[#221C17]"
            }`}
          >
            <Zap className="w-4 h-4 text-[#D9A441]" />
            <span>⚡ 500+ WhatsApp Auto-Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab("import")}
            className={`py-3 px-5 text-xs font-bold border-b-2 shrink-0 flex items-center gap-2 transition-all ${
              activeTab === "import"
                ? "border-[#7A1F2B] text-[#7A1F2B]"
                : "border-transparent text-[#221C17]/60 hover:text-[#221C17]"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV & .VCF Broadcast Contacts</span>
          </button>
        </div>

        {/* Tab 1: Guest List Table */}
        {activeTab === "guests" && (
          <div data-lenis-prevent className="p-6 flex-1 overflow-y-auto space-y-4 overscroll-contain">

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#221C17]/50 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by guest name or phone number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#D9A441]/30 text-xs font-medium focus:outline-none focus:border-[#7A1F2B]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-[#D9A441]/30 text-xs font-semibold focus:outline-none focus:border-[#7A1F2B]"
                >
                  <option value="ALL">All Status</option>
                  <option value="ATTENDING">Attending</option>
                  <option value="PENDING">Pending</option>
                  <option value="DECLINED">Declined</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddGuest(!showAddGuest)}
                  className="btn-maroon px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
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
                className="p-4 rounded-2xl bg-[#EFE7D8] border border-[#D9A441]/40 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in"
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
                  <input
                    type="tel"
                    required
                    placeholder="+1 555 019 2831"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D9A441]/30 text-xs font-medium"
                  />
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

                <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={addingGuest}
                    className="btn-maroon px-5 py-2 text-xs font-bold flex items-center gap-1.5"
                  >
                    {addingGuest ? "Saving..." : "Save Guest to List"}
                  </button>
                </div>
              </form>
            )}

            {/* Guest Table */}
            {loading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#7A1F2B] border-t-transparent animate-spin mx-auto mb-2" />
                <span className="text-xs text-[#221C17]/70 font-semibold">Loading guest list...</span>
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-[#D9A441]/30 rounded-2xl text-center">
                <Users className="w-10 h-10 text-[#D9A441] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#221C17]">No Guests Found</h4>
                <p className="text-xs text-[#221C17]/70 mt-1 max-w-sm mx-auto">
                  Add guests manually or import your guest CSV file to begin sending 1-click WhatsApp invitations.
                </p>
              </div>
            ) : (
              <div className="border border-[#D9A441]/30 rounded-2xl overflow-hidden bg-white">
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
                              onClick={() => handleDeleteGuest(guest.id)}
                              className="p-1 rounded-lg hover:bg-red-50 text-red-600 transition-all"
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
            )}
          </div>
        )}

        {/* Tab 2: 500+ WhatsApp Automated Broadcast Suite */}
        {activeTab === "broadcast" && (
          <div data-lenis-prevent className="p-6 flex-1 overflow-y-auto space-y-6 overscroll-contain">

            {/* Banner explaining 500+ Guest Dispatch Modes */}
            <div className="bg-[#EFE7D8] p-5 rounded-2xl border border-[#D9A441]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#221C17] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#D9A441] fill-current" />
                  <span>500+ Automated WhatsApp Broadcast Engine</span>
                </h3>
                <p className="text-xs text-[#221C17]/70 mt-0.5 font-medium">
                  Dispatch invitations to 500+ guests automatically in sequence or export phone contact lists for WhatsApp Native Broadcast Lists.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMsgTemplate(DEFAULT_INVITATION_MSG)}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#7A1F2B] text-xs font-bold border border-[#7A1F2B]/30 hover:bg-[#7A1F2B]/5 transition-all"
                >
                  Card Broadcast
                </button>
                <button
                  onClick={() => setMsgTemplate(DEFAULT_REMINDER_MSG)}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#7A1F2B] text-xs font-bold border border-[#7A1F2B]/30 hover:bg-[#7A1F2B]/5 transition-all"
                >
                  Pending Reminder
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Template Editor */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#221C17] mb-2">
                  Message Template Text
                </label>
                <textarea
                  rows={8}
                  value={msgTemplate}
                  onChange={(e) => setMsgTemplate(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-white border border-[#D9A441]/40 text-xs font-mono text-[#221C17] focus:outline-none focus:border-[#7A1F2B] shadow-inner"
                />

                <div className="mt-3 p-3 rounded-xl bg-[#EFE7D8]/60 text-[11px] text-[#221C17]/80 flex items-center justify-between">
                  <span>
                    Digital Link: <strong>{publicLink}</strong>
                  </span>
                  <a
                    href={publicLink}
                    target="_blank"
                    className="text-[#7A1F2B] font-bold underline flex items-center gap-1"
                  >
                    Preview Card <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* ⚡ Automated 500+ Broadcast Control Panel */}
              <div className="bg-white p-5 rounded-2xl border border-[#D9A441]/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-[#221C17] flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#7A1F2B]" />
                      <span>Automated 500+ Broadcast Stream</span>
                    </h4>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveBroadcastFilter("PENDING")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          activeBroadcastFilter === "PENDING"
                            ? "bg-amber-500 text-white"
                            : "bg-[#EFE7D8] text-[#221C17]"
                        }`}
                      >
                        Pending ({stats.pending})
                      </button>
                      <button
                        onClick={() => setActiveBroadcastFilter("ALL")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
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
                  <div className="p-3 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/30 mb-4 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#221C17]">Auto-Stream Pace Delay:</span>
                    <select
                      value={autoStreamDelay}
                      onChange={(e) => setAutoStreamDelay(Number(e.target.value))}
                      className="px-2 py-1 rounded-lg bg-white border border-[#D9A441]/40 font-bold"
                    >
                      <option value={1}>1 second / guest</option>
                      <option value={2}>2 seconds / guest (Recommended)</option>
                      <option value={3}>3 seconds / guest</option>
                      <option value={5}>5 seconds / guest</option>
                    </select>
                  </div>

                  {/* Queue Progress Bar */}
                  {broadcastQueue.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs font-bold text-[#221C17] mb-1">
                        <span>Queue Progress: {currentQueueIndex + 1} / {broadcastQueue.length}</span>
                        <span>{Math.round(((currentQueueIndex + 1) / broadcastQueue.length) * 100)}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#EFE7D8] overflow-hidden">
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
                    <div className="py-8 text-center text-xs text-[#221C17]/60">
                      No guests match the selected filter.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {broadcastQueue.map((g, idx) => (
                        <div
                          key={g.id}
                          className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            idx === currentQueueIndex
                              ? "bg-[#7A1F2B]/10 border-[#7A1F2B] font-bold"
                              : "bg-[#F8F3EA]/40 border-[#D9A441]/20 opacity-70"
                          }`}
                        >
                          <div>
                            <span className="text-[#221C17]">{g.name}</span>
                            <span className="text-[10px] text-[#221C17]/60 block font-mono">
                              {g.phone}
                            </span>
                          </div>

                          <button
                            onClick={() => openWhatsAppForGuest(g)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition-all flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" /> Send
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 1-Click Stream Actions */}
                {broadcastQueue.length > 0 && (
                  <div className="pt-3 border-t border-[#D9A441]/20 flex flex-col sm:flex-row items-center gap-2">
                    {isAutoStreaming ? (
                      <button
                        onClick={stopAutoStream}
                        className="w-full py-3 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md animate-pulse"
                      >
                        <Pause className="w-4 h-4" />
                        <span>Pause Auto-Broadcast Stream</span>
                      </button>
                    ) : (
                      <button
                        onClick={startAutoStream}
                        className="w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <Zap className="w-4 h-4 text-amber-300 fill-current" />
                        <span>⚡ 1-Click Auto-Broadcast All {broadcastQueue.length} Guests</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: CSV & .VCF WhatsApp Broadcast Contacts */}
        {activeTab === "import" && (
          <div data-lenis-prevent className="p-6 flex-1 overflow-y-auto space-y-6 overscroll-contain">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Import Section */}
              <div className="bg-white p-6 rounded-2xl border border-[#D9A441]/30">
                <h3 className="text-sm font-bold text-[#221C17] mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#7A1F2B]" />
                  <span>Batch Import Guests (CSV Data)</span>
                </h3>
                <p className="text-xs text-[#221C17]/70 mb-4">
                  Paste CSV lines formatted as: <br />
                  <code className="text-[#7A1F2B] font-mono text-[11px]">
                    Name, Phone, Status, PlusOnes, Email
                  </code>
                </p>

                <textarea
                  rows={6}
                  placeholder={`John Doe, +15550192831, PENDING, 0, john@example.com\nJane Smith, +15550192832, ATTENDING, 1, jane@example.com`}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs font-mono focus:outline-none focus:border-[#7A1F2B]"
                />

                {importStatus.message && (
                  <div
                    className={`mt-3 p-3 rounded-xl text-xs font-semibold ${
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
                  className="btn-maroon w-full py-3 mt-4 text-xs font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
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
              <div className="bg-white p-6 rounded-2xl border border-[#D9A441]/30 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#221C17] mb-2 flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-[#7A1F2B]" />
                    <span>WhatsApp Native Broadcast List (.VCF Contacts)</span>
                  </h3>
                  <p className="text-xs text-[#221C17]/70 mb-4">
                    Download a 1-click <strong>.VCF Contact File</strong>. Import it into your mobile phone contacts, and create a <strong>WhatsApp Broadcast List</strong> to message all 500+ guests at once natively in WhatsApp!
                  </p>

                  <div className="p-4 rounded-xl bg-[#EFE7D8]/60 text-xs space-y-1">
                    <div>
                      Total Roster Records: <strong>{stats.totalGuests} Guests</strong>
                    </div>
                    <div>
                      Attending Headcount: <strong>{stats.totalAttendingPeople} People</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={exportVcard}
                    disabled={guests.length === 0}
                    className="w-full py-3 px-6 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-current" />
                    <span>Download WhatsApp Broadcast .VCF File</span>
                  </button>

                  <button
                    onClick={exportCsv}
                    disabled={guests.length === 0}
                    className="w-full py-3 px-6 rounded-xl bg-[#7A1F2B] text-white text-xs font-bold hover:bg-[#601822] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
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
    </div>
  );
}
