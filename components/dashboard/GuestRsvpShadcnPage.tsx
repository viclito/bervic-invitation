"use client";

import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import {
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
  Upload,
  Zap,
  Pencil,
  Copy,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Eye,
  AlertTriangle,
  Phone,
  Mail,
  HelpCircle,
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

interface GuestRsvpShadcnPageProps {
  invitationId: string;
  invitationSlug: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  venuePlace: string;
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
];

const MESSAGE_PRESETS = [
  {
    id: "traditional",
    name: "Royal Traditional",
    icon: "🌸",
    tag: "Traditional",
    text: `Dear {guest_name},\n\nTogether with our families, we cordially invite you to grace the auspicious wedding celebration of {couple_names}!\n\n📅 Date: {wedding_date}\n📍 Venue: {venue}\n\nKindly view our digital wedding invitation card & confirm your presence:\n{invitation_link}\n\nWith warm regards,\n{couple_names}`,
  },
  {
    id: "luxury",
    name: "Luxury Formal",
    icon: "✨",
    tag: "Formal",
    text: `Dear {guest_name},\n\nWe would be deeply honored by your company as we celebrate the wedding of {couple_names}.\n\n📅 Date: {wedding_date}\n📍 Venue: {venue}\n\nPlease click below to view our interactive invitation card & RSVP online:\n{invitation_link}\n\nWarmly,\n{couple_names}`,
  },
  {
    id: "heartfelt",
    name: "Warm & Heartfelt",
    icon: "💕",
    tag: "Personal",
    text: `Hi {guest_name}! 💕\n\nWe are getting married! We would love for you to be a part of our special day as {couple_names} tie the knot.\n\n📅 Date: {wedding_date}\n📍 Venue: {venue}\n\nPlease click the link to view our invitation & let us know if you can make it:\n{invitation_link}\n\nCan't wait to celebrate with you!\n{couple_names}`,
  },
  {
    id: "minimal",
    name: "Modern Minimalist",
    icon: "💍",
    tag: "Short",
    text: `{couple_names}'s Wedding 💍\n\nDear {guest_name}, join us on {wedding_date} at {venue}.\n\nView Invitation & Confirm RSVP:\n{invitation_link}`,
  },
];

const DEFAULT_INVITATION_MSG = MESSAGE_PRESETS[0].text;

export default function GuestRsvpShadcnPage({
  invitationId,
  invitationSlug,
  partnerOne,
  partnerTwo,
  weddingDate,
  venuePlace,
}: GuestRsvpShadcnPageProps) {
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
  const [copiedLink, setCopiedLink] = useState(false);

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

  // Mobile Guest Details Modal State & Delete Confirmation Modal State
  const [detailsGuest, setDetailsGuest] = useState<Guest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Card Image Theme (Stitch Designs)
  const [selectedCardTheme, setSelectedCardTheme] = useState<"peach" | "church" | "islamic" | "hindu" | "haldi" | "ceremony">("peach");
  const [, setSentGuestIds] = useState<string[]>([]);
  const [showMetrics, setShowMetrics] = useState(false);

  // Accordions State (First 2 closed by default, 3rd queue runner open)
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    wording: false,
    cardImage: false,
    queue: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Message Broadcast State
  const [msgTemplate, setMsgTemplate] = useState(DEFAULT_INVITATION_MSG);
  const [activeBroadcastFilter, setActiveBroadcastFilter] = useState<"ALL" | "PENDING" | "ATTENDING" | "DECLINED">("ALL");
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [bulkSubTab, setBulkSubTab] = useState<"import" | "export">("import");
  const [showGuidance, setShowGuidance] = useState(false);

  // Canvas Card Image Download Generator
  const downloadCardGraphic = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selectedCardTheme === "ceremony"
      ? "/templates/ceremony-wedding-bg.png"
      : selectedCardTheme === "haldi"
      ? "/templates/haldi-wedding-bg.png"
      : selectedCardTheme === "hindu"
      ? "/templates/hindu-wedding-bg.png"
      : selectedCardTheme === "islamic"
      ? "/templates/islamic-wedding-bg.png"
      : selectedCardTheme === "church"
      ? "/templates/church-wedding-bg.png"
      : "/templates/peach-mandap-bg.png";

    img.onload = () => {
      canvas.width = img.naturalWidth || 1000;
      canvas.height = img.naturalHeight || 800;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      if (selectedCardTheme === "ceremony") {
        ctx.fillStyle = "#58440C";
        ctx.font = "600 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TOGETHER WITH THEIR FAMILIES", centerX, centerY - 50);

        ctx.fillStyle = "#58440C";
        ctx.font = "bold 56px serif";
        ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, centerY + 10);

        ctx.fillStyle = "#725C22";
        ctx.font = "italic 20px serif";
        ctx.fillText('"A journey of love and faith begins"', centerX, centerY + 55);

        ctx.fillStyle = "#1A1C1C";
        ctx.font = "bold 18px serif";
        ctx.fillText(`📅 ${weddingDate}`, centerX, centerY + 95);
      } else if (selectedCardTheme === "haldi") {
        ctx.fillStyle = "#725C22";
        ctx.font = "600 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TOGETHER WITH THEIR FAMILIES", centerX, centerY - 50);

        ctx.fillStyle = "#725C22";
        ctx.font = "bold 52px serif";
        ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, centerY + 10);

        ctx.fillStyle = "#5F5E5E";
        ctx.font = "italic 20px serif";
        ctx.fillText("A journey of love and faith begins", centerX, centerY + 55);

        ctx.fillStyle = "#1A1C1C";
        ctx.font = "bold 18px serif";
        ctx.fillText(`📅 ${weddingDate}`, centerX, centerY + 95);
      } else if (selectedCardTheme === "hindu") {
        ctx.fillStyle = "#E1C37F";
        ctx.font = "bold 56px serif";
        ctx.textAlign = "center";
        ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, centerY - 40);

        ctx.fillStyle = "#E1C37F";
        ctx.font = "600 20px sans-serif";
        ctx.fillText("ARE GETTING MARRIED", centerX, centerY + 10);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 20px serif";
        ctx.fillText(`📅 ${weddingDate}`, centerX, centerY + 55);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "italic 18px serif";
        ctx.fillText('"A journey of love and faith begins"', centerX, centerY + 95);
      } else if (selectedCardTheme === "islamic") {
        ctx.fillStyle = "#725C22";
        ctx.font = "600 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TOGETHER WITH THEIR FAMILIES", centerX, centerY - 50);

        ctx.fillStyle = "#725C22";
        ctx.font = "bold 52px serif";
        ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, centerY + 10);

        ctx.fillStyle = "#5F5E5E";
        ctx.font = "italic 20px serif";
        ctx.fillText("A journey of love and faith begins", centerX, centerY + 55);

        ctx.fillStyle = "#1A1C1C";
        ctx.font = "bold 18px serif";
        ctx.fillText(`📅 ${weddingDate}`, centerX, centerY + 95);
      } else if (selectedCardTheme === "church") {
        const pillWidth = Math.min(640, canvas.width * 0.75);
        const pillHeight = Math.min(340, canvas.height * 0.55);
        const pillX = centerX - pillWidth / 2;
        const pillY = centerY - pillHeight / 2;

        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 160);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#725C22";
        ctx.font = "bold 52px serif";
        ctx.textAlign = "center";
        ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, centerY - 25);

        ctx.strokeStyle = "rgba(114, 92, 34, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX - 40, centerY + 10);
        ctx.lineTo(centerX + 40, centerY + 10);
        ctx.stroke();

        ctx.fillStyle = "#5F5E5E";
        ctx.font = "600 18px sans-serif";
        ctx.fillText("SAVE THE DATE", centerX, centerY + 45);

        ctx.fillStyle = "#1A1C1C";
        ctx.font = "bold 18px serif";
        ctx.fillText(`📅 ${weddingDate}`, centerX, centerY + 85);
      } else {
        ctx.fillStyle = "#5C4033";
        ctx.font = "600 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TOGETHER WITH THEIR FAMILIES", centerX, 140);

        ctx.strokeStyle = "#8B6B55";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX - 160, 160);
        ctx.lineTo(centerX - 20, 160);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + 20, 160);
        ctx.lineTo(centerX + 160, 160);
        ctx.stroke();

        ctx.fillStyle = "#8B6B55";
        ctx.font = "14px sans-serif";
        ctx.fillText("♥", centerX, 164);

        ctx.fillStyle = "#4A2E1B";
        ctx.font = "bold 56px serif";
        ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, 235);

        ctx.fillStyle = "#5C4033";
        ctx.font = "600 18px sans-serif";
        ctx.fillText("ARE GETTING MARRIED", centerX, 280);

        ctx.beginPath();
        ctx.moveTo(centerX - 160, 300);
        ctx.lineTo(centerX - 20, 300);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + 20, 300);
        ctx.lineTo(centerX + 160, 300);
        ctx.stroke();

        ctx.fillStyle = "#8B6B55";
        ctx.font = "14px sans-serif";
        ctx.fillText("♥", centerX, 304);

        const pillWidth = 520;
        const pillHeight = 50;
        const pillX = centerX - pillWidth / 2;
        const pillY = 330;

        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 14);
        ctx.fill();

        ctx.strokeStyle = "rgba(139, 107, 85, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = "#3A2818";
        ctx.font = "bold 17px sans-serif";
        ctx.fillText(`📅 ${weddingDate}`, centerX, pillY + 31);
      }

      // Download Trigger
      const link = document.createElement("a");
      link.download = `WeddingCard_${invitationSlug}_${selectedCardTheme}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  const [copiedImageToast, setCopiedImageToast] = useState(false);

  // Copy Image Card to Clipboard
  const copyCardImageToClipboard = async () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = selectedCardTheme === "ceremony"
        ? "/templates/ceremony-wedding-bg.png"
        : selectedCardTheme === "haldi"
        ? "/templates/haldi-wedding-bg.png"
        : selectedCardTheme === "hindu"
        ? "/templates/hindu-wedding-bg.png"
        : selectedCardTheme === "islamic"
        ? "/templates/islamic-wedding-bg.png"
        : selectedCardTheme === "church"
        ? "/templates/church-wedding-bg.png"
        : "/templates/peach-mandap-bg.png";

      img.onload = async () => {
        canvas.width = img.naturalWidth || 1000;
        canvas.height = img.naturalHeight || 800;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        if (selectedCardTheme === "ceremony") {
          ctx.fillStyle = "#58440C";
          ctx.font = "600 18px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("TOGETHER WITH THEIR FAMILIES", centerX, centerY - 50);

          ctx.fillStyle = "#58440C";
          ctx.font = "bold 56px serif";
          ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, centerY + 10);

          ctx.fillStyle = "#725C22";
          ctx.font = "italic 20px serif";
          ctx.fillText('"A journey of love and faith begins"', centerX, centerY + 55);

          ctx.fillStyle = "#1A1C1C";
          ctx.font = "bold 18px serif";
          ctx.fillText(`📅 ${weddingDate}`, centerX, centerY + 95);
        } else if (selectedCardTheme === "haldi") {
          ctx.fillStyle = "#725C22";
          ctx.font = "600 18px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("TOGETHER WITH THEIR FAMILIES", centerX, centerY - 50);

          ctx.fillStyle = "#725C22";
          ctx.font = "bold 52px serif";
          ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, centerY + 10);

          ctx.fillStyle = "#5F5E5E";
          ctx.font = "italic 20px serif";
          ctx.fillText("A journey of love and faith begins", centerX, centerY + 55);

          ctx.fillStyle = "#1A1C1C";
          ctx.font = "bold 18px serif";
          ctx.fillText(`📅 ${weddingDate}`, centerX, centerY + 95);
        } else if (selectedCardTheme === "hindu") {
          ctx.fillStyle = "#E1C37F";
          ctx.font = "bold 56px serif";
          ctx.textAlign = "center";
          ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, centerY - 40);

          ctx.fillStyle = "#E1C37F";
          ctx.font = "600 20px sans-serif";
          ctx.fillText("ARE GETTING MARRIED", centerX, centerY + 10);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 20px serif";
          ctx.fillText(`📅 ${weddingDate}`, centerX, centerY + 55);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "italic 18px serif";
          ctx.fillText('"A journey of love and faith begins"', centerX, centerY + 95);
        } else if (selectedCardTheme === "islamic") {
          ctx.fillStyle = "#725C22";
          ctx.font = "600 18px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("TOGETHER WITH THEIR FAMILIES", centerX, centerY - 50);

          ctx.fillStyle = "#725C22";
          ctx.font = "bold 52px serif";
          ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, centerY + 10);

          ctx.fillStyle = "#5F5E5E";
          ctx.font = "italic 20px serif";
          ctx.fillText("A journey of love and faith begins", centerX, centerY + 55);

          ctx.fillStyle = "#1A1C1C";
          ctx.font = "bold 18px serif";
          ctx.fillText(`📅 ${weddingDate}`, centerX, centerY + 95);
        } else if (selectedCardTheme === "church") {
          const pillWidth = Math.min(640, canvas.width * 0.75);
          const pillHeight = Math.min(340, canvas.height * 0.55);
          const pillX = centerX - pillWidth / 2;
          const pillY = centerY - pillHeight / 2;

          ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 160);
          ctx.fill();

          ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = "#725C22";
          ctx.font = "bold 52px serif";
          ctx.textAlign = "center";
          ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, centerY - 25);

          ctx.strokeStyle = "rgba(114, 92, 34, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(centerX - 40, centerY + 10);
          ctx.lineTo(centerX + 40, centerY + 10);
          ctx.stroke();

          ctx.fillStyle = "#5F5E5E";
          ctx.font = "600 18px sans-serif";
          ctx.fillText("SAVE THE DATE", centerX, centerY + 45);

          ctx.fillStyle = "#1A1C1C";
          ctx.font = "bold 18px serif";
          ctx.fillText(`📅 ${weddingDate}`, centerX, centerY + 85);
        } else {
          ctx.fillStyle = "#5C4033";
          ctx.font = "600 18px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("TOGETHER WITH THEIR FAMILIES", centerX, 140);

          ctx.strokeStyle = "#8B6B55";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(centerX - 160, 160);
          ctx.lineTo(centerX - 20, 160);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(centerX + 20, 160);
          ctx.lineTo(centerX + 160, 160);
          ctx.stroke();

          ctx.fillStyle = "#8B6B55";
          ctx.font = "14px sans-serif";
          ctx.fillText("♥", centerX, 164);

          ctx.fillStyle = "#4A2E1B";
          ctx.font = "bold 56px serif";
          ctx.fillText(`${partnerOne} & ${partnerTwo}`, centerX, 235);

          ctx.fillStyle = "#5C4033";
          ctx.font = "600 18px sans-serif";
          ctx.fillText("ARE GETTING MARRIED", centerX, 280);

          ctx.beginPath();
          ctx.moveTo(centerX - 160, 300);
          ctx.lineTo(centerX - 20, 300);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(centerX + 20, 300);
          ctx.lineTo(centerX + 160, 300);
          ctx.stroke();

          ctx.fillStyle = "#8B6B55";
          ctx.font = "14px sans-serif";
          ctx.fillText("♥", centerX, 304);

          const pillWidth = 520;
          const pillHeight = 50;
          const pillX = centerX - pillWidth / 2;
          const pillY = 330;

          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 14);
          ctx.fill();

          ctx.strokeStyle = "rgba(139, 107, 85, 0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = "#3A2818";
          ctx.font = "bold 17px sans-serif";
          ctx.fillText(`📅 ${weddingDate}`, centerX, pillY + 31);
        }

        canvas.toBlob(async (blob) => {
          if (blob && typeof ClipboardItem !== "undefined") {
            try {
              await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
              setCopiedImageToast(true);
              setTimeout(() => setCopiedImageToast(false), 3000);
            } catch (e) {
              console.error(e);
            }
          }
        }, "image/png");
      };
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Import State
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string }>({});

  const publicLink = typeof window !== "undefined"
    ? `${window.location.origin}/invitations/${invitationSlug}`
    : `https://www.bervic.in/invitations/${invitationSlug}`;

  const fetchGuests = useCallback(async () => {
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
  }, [invitationId]);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/invitations/${invitationId}/guests`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setGuests(data.guests || []);
          setStats(data.stats || {});
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
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

  const executeDeleteGuest = async () => {
    if (!deletingGuest) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/invitations/${invitationId}/guests?guestId=${deletingGuest.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingGuest(null);
        setDetailsGuest(null);
        fetchGuests();
      }
    } catch (err) {
      console.error("Error removing guest:", err);
    } finally {
      setDeleting(false);
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

  const shareWhatsAppWithImage = (guest: Guest) => {
    const rawPhone = guest.phone.trim();
    let cleanDigits = rawPhone.replace(/[^\d]/g, "");
    if (!rawPhone.startsWith("+") && cleanDigits.length === 10) {
      cleanDigits = "91" + cleanDigits;
    }

    // 1. Format personalized text with link
    const formattedMsg = encodeURIComponent(formatMessageForGuest(guest.name));
    const url = `https://wa.me/${cleanDigits}?text=${formattedMsg}`;

    // 2. Open WhatsApp SYNCHRONOUSLY (prevents browser popup blocker completely)
    window.open(url, "_blank");
    setSentGuestIds((prev) => [...prev, guest.id]);

    // 3. Copy Card Image PNG to Clipboard at the exact same instant
    copyCardImageToClipboard();
  };

  const broadcastQueue = guests.filter((g) => {
    if (activeBroadcastFilter === "ALL") return true;
    return g.status === activeBroadcastFilter;
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Excel (.xlsx, .xls, .csv) File Upload Handler
  const handleExcelFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportStatus({ message: "Reading Excel file & parsing contacts..." });

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (!jsonRows || jsonRows.length === 0) {
        setImportStatus({ success: false, message: "No data rows found in the uploaded Excel file." });
        setImporting(false);
        return;
      }

      // Map rows into standardized guest objects
      const parsedGuests = jsonRows.map((row) => {
        const keys = Object.keys(row);
        const findVal = (possibleKeys: string[]) => {
          for (const pk of possibleKeys) {
            const foundKey = keys.find((k) => k.trim().toLowerCase() === pk.toLowerCase());
            if (foundKey && String(row[foundKey]).trim().length > 0) {
              return String(row[foundKey]).trim();
            }
          }
          return "";
        };

        const name = findVal(["name", "guest name", "guest", "full name", "fn"]) || (keys[0] ? String(row[keys[0]]).trim() : "Guest");
        const phone = findVal(["phone", "whatsapp phone", "mobile", "number", "tel", "contact"]) || (keys[1] ? String(row[keys[1]]).trim() : "");
        const statusRaw = findVal(["status", "rsvp status", "rsvp"]) || "PENDING";
        const statusUpper = statusRaw.toUpperCase();
        const status = ["ATTENDING", "PENDING", "DECLINED"].includes(statusUpper) ? statusUpper : "PENDING";
        const plusOnesVal = findVal(["plusones", "plus ones", "plus_ones", "guests", "guests count"]);
        const plusOnes = parseInt(plusOnesVal, 10) || 0;
        const email = findVal(["email", "e-mail", "mail"]) || null;

        return { name, phone, status, plusOnes, email };
      }).filter((g) => g.phone.length >= 5);

      if (parsedGuests.length === 0) {
        setImportStatus({ success: false, message: "Could not find valid guest names and phone numbers in the Excel file." });
        setImporting(false);
        return;
      }

      // Format text area preview
      const previewText = parsedGuests
        .map((g) => `${g.name}, ${g.phone}, ${g.status}, ${g.plusOnes}${g.email ? `, ${g.email}` : ""}`)
        .join("\n");
      setCsvText(previewText);

      // Auto-save all parsed contacts to Prisma DB
      const res = await fetch(`/api/invitations/${invitationId}/guests/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests: parsedGuests }),
      });

      const data = await res.json();
      if (res.ok) {
        setImportStatus({
          success: true,
          message: `🎉 Success! Imported ${data.count || parsedGuests.length} contacts from Excel file "${file.name}" into your guest list!`,
        });
        fetchGuests();
      } else {
        setImportStatus({ success: false, message: data.error || "Failed to save contacts from Excel file." });
      }
    } catch (err: unknown) {
      console.error("Excel Parsing Error:", err);
      setImportStatus({ success: false, message: (err as Error)?.message || "Error reading Excel file. Please ensure it is a valid .xlsx or .csv file." });
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

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
    } catch (err: unknown) {
      setImportStatus({ success: false, message: (err as Error)?.message || "Import failed" });
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
    link.setAttribute("download", `WhatsAppBroadcast_${invitationSlug}.vcf`);
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sleek Header Section */}
      <div className="hidden sm:flex bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] text-[11px] font-bold tracking-wide uppercase">
              WhatsApp Guest Suite
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {stats.totalGuests} Guests Registered
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#221C17] mt-1">
            {partnerOne} & {partnerTwo}&apos;s Invitation Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span>Event: {weddingDate}</span>
            <span>•</span>
            <span className="truncate max-w-xs">{venuePlace}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all border border-slate-200"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Copied Link!" : "Copy Public Link"}</span>
          </button>

          <button
            onClick={() => setShowAddGuest(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A1F2B] hover:bg-[#9B2C3B] text-white text-xs font-bold transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add New Guest</span>
          </button>
        </div>
      </div>

      {/* Collapsible 4 Metric Stat Cards Toggle Section */}
      <div className="border-0 sm:border border-slate-200/80 rounded-none sm:rounded-2xl bg-white overflow-hidden shadow-none sm:shadow-2xs">
        <button
          type="button"
          onClick={() => setShowMetrics(!showMetrics)}
          className="w-full px-3 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between text-left bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <BarChart2 className="w-4 h-4 text-[#7A1F2B]" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>RSVP Overview & Metrics</span>
              <span className="text-[11px] font-normal text-slate-500 hidden sm:inline">
                ({stats.totalGuests || 0} Total Guests • {stats.attending || 0} Attending • {stats.pending || 0} Pending)
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#7A1F2B]">
              {showMetrics ? "Hide Overview" : "Show Overview"}
            </span>
            <div className="p-1 rounded-lg text-slate-400">
              {showMetrics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {showMetrics && (
          <div className="p-2 sm:p-4 border-t border-slate-100 bg-slate-50/30 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {/* Total Guests */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Total Guests</span>
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">
                  {stats.totalGuests}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <span className="font-semibold text-emerald-600">{stats.responseRate}%</span>
                  <span>Response Rate</span>
                </div>
              </div>

              {/* Attending */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Attending</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-900 mt-2 flex items-baseline gap-1.5">
                  <span>{stats.attending}</span>
                  <span className="text-xs font-medium text-emerald-600">
                    (+{stats.totalPlusOnes} plus ones)
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Total People: <span className="font-semibold text-slate-800">{stats.totalAttendingPeople}</span>
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Pending RSVP</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-amber-800 mt-2">
                  {stats.pending}
                </div>
                <div className="text-[11px] text-amber-700 mt-1 font-medium">
                  Awaiting Confirmation
                </div>
              </div>

              {/* Declined */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Declined</span>
                  <XCircle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl font-bold text-rose-800 mt-2">
                  {stats.declined}
                </div>
                <div className="text-[11px] text-rose-600 mt-1 font-medium">
                  Cannot Attend
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Card with Shadcn Underline Tabs */}
      <div className="bg-white border-0 sm:border sm:border-slate-200/80 rounded-none sm:rounded-2xl shadow-none sm:shadow-xs overflow-hidden">
        {/* Navigation Tabs (Shadcn Underline Style) */}
        <div className="border-b border-slate-200 bg-white px-2 sm:px-6 flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("guests")}
            className={`inline-flex items-center gap-2 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "guests"
                ? "border-[#7A1F2B] text-[#7A1F2B]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Guest Roster</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "guests"
                  ? "bg-[#7A1F2B]/10 text-[#7A1F2B]"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {guests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("broadcast")}
            className={`inline-flex items-center gap-2 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "broadcast"
                ? "border-[#7A1F2B] text-[#7A1F2B]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp Auto-Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab("import")}
            className={`inline-flex items-center gap-2 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "import"
                ? "border-[#7A1F2B] text-[#7A1F2B]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bulk Import & Export</span>
          </button>
        </div>

        {/* TAB 1: GUEST ROSTER TABLE */}
        {activeTab === "guests" && (
          <div className="p-1 sm:p-6 space-y-3 sm:space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {/* Row 1 on mobile: Search Input + Mobile "+ Guest" Button */}
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guest name or phone..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#7A1F2B] focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddGuest(true)}
                  className="sm:hidden shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#7A1F2B] hover:bg-[#9B2C3B] text-white text-xs font-bold transition-all shadow-xs whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Guest</span>
                </button>
              </div>

              {/* Row 2 on mobile: Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Filter:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
                  {["ALL", "PENDING", "ATTENDING", "DECLINED"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`flex-1 sm:flex-initial px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all text-center whitespace-nowrap ${
                        statusFilter === status
                          ? "bg-white text-[#7A1F2B] shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Guest Roster Rendering (Mobile Cards vs Desktop Table) */}
            {loading ? (
              <div className="py-12 text-center text-xs font-semibold text-slate-500">
                <Sparkles className="w-5 h-5 animate-spin mx-auto mb-2 text-[#7A1F2B]" />
                Loading guest list...
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No guests found</p>
                <p className="mt-1">Add guests manually or import via CSV file.</p>
              </div>
            ) : (
              <>
                {/* MOBILE CARD LIST (Name + Status + Details Button, No Scroll Table) */}
                <div className="sm:hidden space-y-2">
                  {filteredGuests.map((g) => (
                    <div
                      key={g.id}
                      className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-slate-900 truncate">
                          {g.name}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          {g.status === "ATTENDING" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Attending
                            </span>
                          )}
                          {g.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" /> Pending
                            </span>
                          )}
                          {g.status === "DECLINED" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" /> Declined
                            </span>
                          )}
                          {g.plusOnes > 0 && (
                            <span className="text-[10px] font-semibold text-slate-500">
                              +{g.plusOnes} guest{g.plusOnes > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDetailsGuest(g)}
                        className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all border border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Details</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* DESKTOP TABLE VIEW (Full Table with Columns) */}
                <div className="hidden sm:block overflow-x-auto border border-slate-200/80 rounded-xl shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-3 px-4">Guest Name</th>
                        <th className="py-3 px-4">WhatsApp Phone</th>
                        <th className="py-3 px-4">RSVP Status</th>
                        <th className="py-3 px-4 text-center">Plus Ones</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {filteredGuests.map((g) => (
                        <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            <div>{g.name}</div>
                            {g.dietaryNotes && (
                              <div className="text-[10px] text-amber-700 font-normal italic mt-0.5">
                                Note: {g.dietaryNotes}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                            {g.phone}
                          </td>
                          <td className="py-3 px-4">
                            {g.status === "ATTENDING" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Attending
                              </span>
                            )}
                            {g.status === "PENDING" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" /> Pending
                              </span>
                            )}
                            {g.status === "DECLINED" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
                                <XCircle className="w-3 h-3 text-rose-600" /> Declined
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold">
                            {g.plusOnes > 0 ? `+${g.plusOnes}` : "-"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => shareWhatsAppWithImage(g)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[11px] shadow-2xs transition-all"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </button>

                              <button
                                onClick={() => startEditGuest(g)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                                title="Edit Guest"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setDeletingGuest(g)}
                                className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all"
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

        {/* TAB 2: WHATSAPP AUTO-BROADCAST & TEMPLATES (ACCORDION STYLE) */}
        {activeTab === "broadcast" && (
          <div className="p-1.5 sm:p-6 space-y-3">
            {/* ACCORDION ITEM 1: MESSAGE WORDING & PRESETS */}
            <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => toggleAccordion("wording")}
                className="w-full px-3 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between text-left bg-slate-50/50 hover:bg-slate-100/60 transition-colors border-b border-slate-100"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-5 h-5 rounded-md bg-[#7A1F2B]/10 text-[#7A1F2B] font-bold text-[10px] flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#7A1F2B] shrink-0" />
                      <span>Step 1: Customize Message Wording</span>
                    </h3>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700 shrink-0">
                  {openAccordions.wording ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {openAccordions.wording && (
                <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
                  {/* Template Presets Gallery */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Preset Wording Styles
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Click a template to load preset text
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {MESSAGE_PRESETS.map((preset) => {
                        const isSelected = msgTemplate === preset.text;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => setMsgTemplate(preset.text)}
                            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                              isSelected
                                ? "bg-white border-[#7A1F2B] ring-2 ring-[#7A1F2B]/10 shadow-xs"
                                : "bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xl">{preset.icon}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isSelected ? "bg-[#7A1F2B] text-white" : "bg-slate-200 text-slate-700"
                              }`}>
                                {preset.tag}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{preset.name}</h4>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                                {preset.text.replace(/\n/g, " ")}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customizer Textarea & Live Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                        <Send className="w-4 h-4 text-[#7A1F2B]" />
                        Customize Message Text
                      </h4>
                      <textarea
                        rows={8}
                        value={msgTemplate}
                        onChange={(e) => setMsgTemplate(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:border-[#7A1F2B]"
                      />
                      <p className="text-[11px] text-slate-500">
                        Placeholders: <code className="text-[#7A1F2B]">{`{guest_name}`}</code>, <code className="text-[#7A1F2B]">{`{couple_names}`}</code>, <code className="text-[#7A1F2B]">{`{wedding_date}`}</code>, <code className="text-[#7A1F2B]">{`{venue}`}</code>, <code className="text-[#7A1F2B]">{`{invitation_link}`}</code>
                      </p>
                    </div>

                    {/* WhatsApp Chat Preview Card */}
                    <div className="bg-[#E5DDD5] border border-slate-300 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b border-slate-300/60">
                        <span>📱 WhatsApp Rich Card Preview</span>
                        <span className="text-[10px] bg-[#25D366] text-white px-2 py-0.5 rounded-full font-bold">WhatsApp Web</span>
                      </div>

                      <div className="bg-white rounded-2xl rounded-tl-xs shadow-xs overflow-hidden border border-slate-200">
                        {/* TOP VISUAL INVITATION IMAGE CARD BANNER (Stitch Design Layout) */}
                        {selectedCardTheme === "ceremony" ? (
                          <div
                            className="relative p-6 text-center bg-cover bg-center border-b border-amber-900/20 flex flex-col items-center justify-center space-y-2 min-h-[300px]"
                            style={{ backgroundImage: "url('/templates/ceremony-wedding-bg.png')" }}
                          >
                            <p className="uppercase tracking-[0.25em] text-[10px] font-semibold text-[#58440c]">
                              Together with their families
                            </p>

                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#58440c] tracking-tight my-1 drop-shadow-xs">
                              {partnerOne} & {partnerTwo}
                            </h1>

                            <p className="font-serif italic text-sm sm:text-base text-[#725c22]">
                              &quot;A journey of love and faith begins&quot;
                            </p>

                            <p className="font-serif text-xs font-semibold text-[#1a1c1c] pt-1">
                              📅 {weddingDate}
                            </p>
                          </div>
                        ) : selectedCardTheme === "haldi" ? (
                          <div
                            className="relative p-6 text-center bg-cover bg-center border-b border-amber-900/20 flex flex-col items-center justify-center space-y-2 min-h-[300px]"
                            style={{ backgroundImage: "url('/templates/haldi-wedding-bg.png')" }}
                          >
                            <p className="uppercase tracking-[0.2em] text-[10px] font-semibold text-[#725c22]">
                              Together with their families
                            </p>

                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#725c22] tracking-tight my-1">
                              {partnerOne} & {partnerTwo}
                            </h1>

                            <p className="font-serif italic text-sm sm:text-base text-[#5f5e5e]">
                              A journey of love and faith begins
                            </p>

                            <p className="font-serif text-xs font-medium text-[#1a1c1c] pt-1">
                              📅 {weddingDate}
                            </p>
                          </div>
                        ) : selectedCardTheme === "hindu" ? (
                          <div
                            className="relative p-6 text-center bg-cover bg-center border-b border-amber-900/20 flex flex-col items-center justify-center space-y-2 min-h-[300px]"
                            style={{ backgroundImage: "url('/templates/hindu-wedding-bg.png')" }}
                          >
                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#e1c37f] tracking-wide my-0.5 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
                              {partnerOne} & {partnerTwo}
                            </h1>

                            <p className="uppercase tracking-[0.25em] text-xs font-semibold text-[#e1c37f]">
                              Are getting married
                            </p>

                            <p className="font-serif text-sm font-semibold text-white pt-1 drop-shadow-sm">
                              📅 {weddingDate}
                            </p>

                            <p className="font-serif italic text-xs text-white/90">
                              &quot;A journey of love and faith begins&quot;
                            </p>
                          </div>
                        ) : selectedCardTheme === "islamic" ? (
                          <div
                            className="relative p-6 text-center bg-cover bg-center border-b border-amber-900/20 flex flex-col items-center justify-center space-y-2 min-h-[300px]"
                            style={{ backgroundImage: "url('/templates/islamic-wedding-bg.png')" }}
                          >
                            <p className="uppercase tracking-[0.2em] text-[10px] font-semibold text-[#725c22]">
                              Together with their families
                            </p>

                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#725c22] tracking-tight my-1">
                              {partnerOne} & {partnerTwo}
                            </h1>

                            <p className="font-serif italic text-sm sm:text-base text-[#5f5e5e]">
                              A journey of love and faith begins
                            </p>

                            <p className="font-serif text-xs font-medium text-[#1a1c1c] pt-1">
                              📅 {weddingDate}
                            </p>
                          </div>
                        ) : selectedCardTheme === "church" ? (
                          <div
                            className="relative p-6 text-center bg-cover bg-center border-b border-amber-900/20 flex flex-col items-center justify-center min-h-[300px]"
                            style={{ backgroundImage: "url('/templates/church-wedding-bg.png')" }}
                          >
                            <div className="bg-white/45 backdrop-blur-md border border-white/40 rounded-full px-6 py-7 shadow-md max-w-xs mx-auto flex flex-col items-center justify-center text-center space-y-2">
                              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#725C22] tracking-tight">
                                {partnerOne} & {partnerTwo}
                              </h1>
                              <div className="w-8 h-px bg-[#725C22]/40 my-0.5"></div>
                              <p className="uppercase tracking-[0.2em] text-[9px] font-semibold text-[#5f5e5e]">
                                Save the Date
                              </p>
                              <p className="font-serif text-[11px] font-medium text-[#1a1c1c]">
                                📅 {weddingDate}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="relative p-6 text-center bg-cover bg-center border-b border-amber-900/20 flex flex-col items-center justify-center space-y-1.5"
                            style={{ backgroundImage: "url('/templates/peach-mandap-bg.png')" }}
                          >
                            <p className="uppercase tracking-[0.2em] text-[10px] font-semibold text-[#5c4033]">
                              Together with their families
                            </p>

                            <div className="flex items-center justify-center w-full max-w-[200px] my-0.5">
                              <div className="flex-grow border-t border-[#8b6b55]/60"></div>
                              <div className="mx-2 text-[#8b6b55] text-[10px]">♥</div>
                              <div className="flex-grow border-t border-[#8b6b55]/60"></div>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#4a2e1b] tracking-wide my-0.5 flex items-center justify-center gap-1.5">
                              <span>{partnerOne}</span>
                              <span className="text-lg font-serif text-[#d48c8b]">&</span>
                              <span>{partnerTwo}</span>
                            </h1>

                            <p className="uppercase tracking-[0.2em] text-[10px] font-semibold text-[#5c4033]">
                              Are getting married
                            </p>

                            <div className="flex items-center justify-center w-full max-w-[200px] my-0.5">
                              <div className="flex-grow border-t border-[#8b6b55]/60"></div>
                              <div className="mx-2 text-[#8b6b55] text-[10px]">♥</div>
                              <div className="flex-grow border-t border-[#8b6b55]/60"></div>
                            </div>

                            <div className="mt-1.5 bg-white/75 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#8b6b55]/30 shadow-xs inline-flex items-center gap-2 text-[11px] font-semibold text-[#3a2818]">
                              <span>📅 {weddingDate}</span>
                            </div>
                          </div>
                        )}

                        {/* MESSAGE TEXT & LINK BELOW */}
                        <div className="p-3.5 text-xs text-slate-900 font-sans whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
                          {formatMessageForGuest("Sample Guest Name")}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-600 italic">
                        ✨ The selected High-Res Invitation Image Card automatically renders right at the top of your link on WhatsApp!
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION ITEM 2: INVITATION CARD GRAPHIC THEME */}
            <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => toggleAccordion("cardImage")}
                className="w-full px-3 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between text-left bg-slate-50/50 hover:bg-slate-100/60 transition-colors border-b border-slate-100"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-5 h-5 rounded-md bg-[#7A1F2B]/10 text-[#7A1F2B] font-bold text-[10px] flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#7A1F2B] shrink-0" />
                      <span>Step 2: Select Card Graphic Theme</span>
                    </h3>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700 shrink-0">
                  {openAccordions.cardImage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {openAccordions.cardImage && (
                <div className="p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-600">
                      Choose Theme for Image Card & WhatsApp Header:
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={copyCardImageToClipboard}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 shadow-2xs"
                      >
                        <Copy className="w-4 h-4 text-[#7A1F2B]" />
                        <span>{copiedImageToast ? "Copied Image to Clipboard!" : "Copy Card Image (Ctrl+V)"}</span>
                      </button>

                      <button
                        onClick={downloadCardGraphic}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7A1F2B] hover:bg-[#9B2C3B] text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Card Image (PNG)</span>
                      </button>
                    </div>
                  </div>

                  {copiedImageToast && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Card Image copied to your clipboard! Open WhatsApp chat and press <strong>Ctrl + V</strong> to paste image.</span>
                      </div>
                    </div>
                  )}

                  {/* Stitch Design Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-2">
                    {/* Card 1: Soft Peach Mandap */}
                    <button
                      type="button"
                      onClick={() => setSelectedCardTheme("peach")}
                      style={{ backgroundImage: "url('/templates/peach-mandap-bg.png')" }}
                      className={`p-6 rounded-2xl border-2 text-left bg-cover bg-center flex flex-col items-center justify-center text-center space-y-1.5 relative overflow-hidden transition-all min-h-[220px] ${
                        selectedCardTheme === "peach"
                          ? "border-[#D9A441] ring-4 ring-[#7A1F2B]/20 shadow-md scale-[1.01]"
                          : "border-slate-300/80 opacity-90 hover:opacity-100"
                      }`}
                    >
                      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 px-2 py-0.5 rounded-md text-[#4A2E1B]">
                          🌸 Soft Peach Mandap
                        </span>
                        {selectedCardTheme === "peach" && (
                          <span className="w-5 h-5 rounded-full bg-[#D9A441] text-slate-900 flex items-center justify-center font-bold text-xs">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="pt-6 pb-2 space-y-1 w-full flex flex-col items-center">
                        <p className="uppercase tracking-[0.2em] text-[9px] font-semibold text-[#5c4033]">
                          Together with their families
                        </p>
                        <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#4a2e1b] tracking-wide my-0.5 flex items-center justify-center gap-1">
                          <span>{partnerOne}</span>
                          <span className="text-base font-serif text-[#d48c8b]">&</span>
                          <span>{partnerTwo}</span>
                        </h1>
                        <p className="uppercase tracking-[0.2em] text-[9px] font-semibold text-[#5c4033]">
                          Are getting married
                        </p>
                        <div className="mt-1 bg-white/75 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-[#8b6b55]/30 text-[10px] font-semibold text-[#3a2818]">
                          📅 {weddingDate}
                        </div>
                      </div>
                    </button>

                    {/* Card 2: Church Wedding Overlay */}
                    <button
                      type="button"
                      onClick={() => setSelectedCardTheme("church")}
                      style={{ backgroundImage: "url('/templates/church-wedding-bg.png')" }}
                      className={`p-6 rounded-2xl border-2 text-left bg-cover bg-center flex flex-col items-center justify-center text-center relative overflow-hidden transition-all min-h-[220px] ${
                        selectedCardTheme === "church"
                          ? "border-[#D9A441] ring-4 ring-[#7A1F2B]/20 shadow-md scale-[1.01]"
                          : "border-slate-300/80 opacity-90 hover:opacity-100"
                      }`}
                    >
                      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 px-2 py-0.5 rounded-md text-[#725C22]">
                          ⛪ Church Wedding Overlay
                        </span>
                        {selectedCardTheme === "church" && (
                          <span className="w-5 h-5 rounded-full bg-[#D9A441] text-slate-900 flex items-center justify-center font-bold text-xs">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="bg-white/45 backdrop-blur-md border border-white/40 rounded-full px-6 py-5 shadow-sm max-w-xs mx-auto flex flex-col items-center justify-center text-center space-y-1.5 mt-4">
                        <h1 className="text-lg sm:text-xl font-serif font-bold text-[#725C22] tracking-tight">
                          {partnerOne} & {partnerTwo}
                        </h1>
                        <div className="w-8 h-px bg-[#725C22]/40"></div>
                        <p className="uppercase tracking-[0.2em] text-[8px] font-semibold text-[#5f5e5e]">
                          Save the Date
                        </p>
                        <p className="font-serif text-[10px] font-medium text-[#1a1c1c]">
                          📅 {weddingDate}
                        </p>
                      </div>
                    </button>

                    {/* Card 3: Islamic Arch Overlay */}
                    <button
                      type="button"
                      onClick={() => setSelectedCardTheme("islamic")}
                      style={{ backgroundImage: "url('/templates/islamic-wedding-bg.png')" }}
                      className={`p-6 rounded-2xl border-2 text-left bg-cover bg-center flex flex-col items-center justify-center text-center relative overflow-hidden transition-all min-h-[220px] ${
                        selectedCardTheme === "islamic"
                          ? "border-[#D9A441] ring-4 ring-[#7A1F2B]/20 shadow-md scale-[1.01]"
                          : "border-slate-300/80 opacity-90 hover:opacity-100"
                      }`}
                    >
                      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#725C22] px-2 py-0.5 rounded-md">
                          🕌 Islamic Arch Overlay
                        </span>
                        {selectedCardTheme === "islamic" && (
                          <span className="w-5 h-5 rounded-full bg-[#D9A441] text-slate-900 flex items-center justify-center font-bold text-xs">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="pt-6 pb-2 space-y-1 w-full flex flex-col items-center">
                        <p className="uppercase tracking-[0.2em] text-[8px] font-semibold text-[#725c22]">
                          Together with their families
                        </p>
                        <h1 className="text-lg sm:text-xl font-serif font-bold text-[#725c22] tracking-wide">
                          {partnerOne} & {partnerTwo}
                        </h1>
                        <p className="font-serif italic text-[10px] text-[#5f5e5e]">
                          A journey of love and faith begins
                        </p>
                        <p className="font-serif text-[10px] font-medium text-[#1a1c1c] pt-0.5">
                          📅 {weddingDate}
                        </p>
                      </div>
                    </button>

                    {/* Card 4: Hindu Mandap Overlay */}
                    <button
                      type="button"
                      onClick={() => setSelectedCardTheme("hindu")}
                      style={{ backgroundImage: "url('/templates/hindu-wedding-bg.png')" }}
                      className={`p-6 rounded-2xl border-2 text-left bg-cover bg-center flex flex-col items-center justify-center text-center relative overflow-hidden transition-all min-h-[220px] ${
                        selectedCardTheme === "hindu"
                          ? "border-[#D9A441] ring-4 ring-[#7A1F2B]/20 shadow-md scale-[1.01]"
                          : "border-slate-300/80 opacity-90 hover:opacity-100"
                      }`}
                    >
                      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black/75 text-[#e1c37f] px-2 py-0.5 rounded-md">
                          🛕 Hindu Mandap Overlay
                        </span>
                        {selectedCardTheme === "hindu" && (
                          <span className="w-5 h-5 rounded-full bg-[#D9A441] text-slate-900 flex items-center justify-center font-bold text-xs">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="pt-6 pb-2 space-y-1 w-full flex flex-col items-center">
                        <h1 className="text-lg sm:text-xl font-serif font-bold text-[#e1c37f] tracking-wide drop-shadow-xs">
                          {partnerOne} & {partnerTwo}
                        </h1>
                        <p className="uppercase tracking-[0.2em] text-[8px] font-semibold text-[#e1c37f]">
                          Are getting married
                        </p>
                        <p className="font-serif text-[10px] font-medium text-white pt-0.5">
                          📅 {weddingDate}
                        </p>
                        <p className="font-serif italic text-[9px] text-white/90">
                          &quot;A journey of love and faith begins&quot;
                        </p>
                      </div>
                    </button>

                    {/* Card 5: Haldi Ceremony Overlay */}
                    <button
                      type="button"
                      onClick={() => setSelectedCardTheme("haldi")}
                      style={{ backgroundImage: "url('/templates/haldi-wedding-bg.png')" }}
                      className={`p-6 rounded-2xl border-2 text-left bg-cover bg-center flex flex-col items-center justify-center text-center relative overflow-hidden transition-all min-h-[220px] ${
                        selectedCardTheme === "haldi"
                          ? "border-[#D9A441] ring-4 ring-[#7A1F2B]/20 shadow-md scale-[1.01]"
                          : "border-slate-300/80 opacity-90 hover:opacity-100"
                      }`}
                    >
                      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#725C22] px-2 py-0.5 rounded-md">
                          🌼 Haldi Ceremony Overlay
                        </span>
                        {selectedCardTheme === "haldi" && (
                          <span className="w-5 h-5 rounded-full bg-[#D9A441] text-slate-900 flex items-center justify-center font-bold text-xs">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="pt-6 pb-2 space-y-1 w-full flex flex-col items-center">
                        <p className="uppercase tracking-[0.2em] text-[8px] font-semibold text-[#725c22]">
                          Together with their families
                        </p>
                        <h1 className="text-lg sm:text-xl font-serif font-bold text-[#725c22] tracking-wide">
                          {partnerOne} & {partnerTwo}
                        </h1>
                        <p className="font-serif italic text-[10px] text-[#5f5e5e]">
                          A journey of love and faith begins
                        </p>
                        <p className="font-serif text-[10px] font-medium text-[#1a1c1c] pt-0.5">
                          📅 {weddingDate}
                        </p>
                      </div>
                    </button>

                    {/* Card 6: Golden Ceremony Overlay */}
                    <button
                      type="button"
                      onClick={() => setSelectedCardTheme("ceremony")}
                      style={{ backgroundImage: "url('/templates/ceremony-wedding-bg.png')" }}
                      className={`p-6 rounded-2xl border-2 text-left bg-cover bg-center flex flex-col items-center justify-center text-center relative overflow-hidden transition-all min-h-[220px] ${
                        selectedCardTheme === "ceremony"
                          ? "border-[#D9A441] ring-4 ring-[#7A1F2B]/20 shadow-md scale-[1.01]"
                          : "border-slate-300/80 opacity-90 hover:opacity-100"
                      }`}
                    >
                      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#58440C] px-2 py-0.5 rounded-md">
                          ✨ Golden Ceremony Overlay
                        </span>
                        {selectedCardTheme === "ceremony" && (
                          <span className="w-5 h-5 rounded-full bg-[#D9A441] text-slate-900 flex items-center justify-center font-bold text-xs">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="pt-6 pb-2 space-y-1 w-full flex flex-col items-center">
                        <p className="uppercase tracking-[0.2em] text-[8px] font-semibold text-[#58440c]">
                          Together with their families
                        </p>
                        <h1 className="text-lg sm:text-xl font-serif font-bold text-[#58440c] tracking-wide">
                          {partnerOne} & {partnerTwo}
                        </h1>
                        <p className="font-serif italic text-[10px] text-[#725c22]">
                          A journey of love and faith begins
                        </p>
                        <p className="font-serif text-[10px] font-medium text-[#1a1c1c] pt-0.5">
                          📅 {weddingDate}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ACCORDION ITEM 3: SEQUENTIAL 1-BY-1 WHATSAPP BROADCAST QUEUE RUNNER */}
            <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => toggleAccordion("queue")}
                className="w-full px-3 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between text-left bg-slate-50/50 hover:bg-slate-100/60 transition-colors border-b border-slate-100"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      <span>Step 3: Launch Broadcast Queue</span>
                    </h3>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700 shrink-0">
                  {openAccordions.queue ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {openAccordions.queue && (
                <div className="p-3 sm:p-6 space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                    <span className="text-xs font-semibold text-slate-600">Select Recipient Group:</span>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {["ALL", "PENDING", "ATTENDING", "DECLINED"].map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => {
                            setActiveBroadcastFilter(filter as "ALL" | "PENDING" | "ATTENDING" | "DECLINED");
                            setCurrentQueueIndex(0);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                            activeBroadcastFilter === filter
                              ? "bg-[#7A1F2B] text-white shadow-2xs"
                              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                          }`}
                        >
                          {filter} ({guests.filter((g) => filter === "ALL" || g.status === filter).length})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QUEUE STATUS BAR */}
                  {broadcastQueue.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No guests in the selected queue filter ({activeBroadcastFilter}).
                    </div>
                  ) : currentQueueIndex >= broadcastQueue.length ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                      <div className="text-sm font-bold text-emerald-900">
                        🎉 Broadcast Queue Complete! ({broadcastQueue.length}/{broadcastQueue.length} Sent)
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentQueueIndex(0)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all"
                      >
                        Reset Queue to Start
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">
                          Current Target ({currentQueueIndex + 1} of {broadcastQueue.length})
                        </span>
                        <span className="text-slate-500 font-medium">
                          Progress: {Math.round(((currentQueueIndex) / broadcastQueue.length) * 100)}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#25D366] transition-all duration-300"
                          style={{ width: `${((currentQueueIndex) / broadcastQueue.length) * 100}%` }}
                        />
                      </div>

                      {/* Active Target Card */}
                      {broadcastQueue[currentQueueIndex] && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-bold text-slate-900">
                              {broadcastQueue[currentQueueIndex].name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono">
                              Phone: {broadcastQueue[currentQueueIndex].phone} • Status: {broadcastQueue[currentQueueIndex].status}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (currentQueueIndex + 1 < broadcastQueue.length) {
                                  setCurrentQueueIndex((prev) => prev + 1);
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all"
                            >
                              Skip
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const current = broadcastQueue[currentQueueIndex];
                                shareWhatsAppWithImage(current);
                                if (currentQueueIndex + 1 < broadcastQueue.length) {
                                  setCurrentQueueIndex((prev) => prev + 1);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-xs transition-all"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Send to {broadcastQueue[currentQueueIndex].name}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Full Recipient Queue List Preview */}
                      <div className="mt-4 border-t border-slate-100 pt-3 space-y-2">
                        <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                          <span>📋 Recipient Queue List ({broadcastQueue.length} Guests)</span>
                          <span className="text-[10px] font-normal text-slate-500">Tap item to select target</span>
                        </div>

                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {broadcastQueue.map((item, idx) => {
                            const isCurrent = idx === currentQueueIndex;
                            return (
                              <div
                                key={item.id}
                                className={`p-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                                  isCurrent
                                    ? "bg-amber-50 border border-amber-300 font-semibold shadow-2xs"
                                    : "bg-slate-50 border border-slate-200/80 hover:bg-slate-100"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="font-bold text-slate-900 truncate max-w-[130px] sm:max-w-none">
                                    {item.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    item.status === "ATTENDING"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : item.status === "PENDING"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-rose-100 text-rose-800"
                                  }`}>
                                    {item.status}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => setCurrentQueueIndex(idx)}
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                                      isCurrent
                                        ? "bg-[#7A1F2B] text-white"
                                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                    }`}
                                  >
                                    {isCurrent ? "Active" : "Target"}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: BULK IMPORT & EXPORT TOOLS */}
        {activeTab === "import" && (
          <div className="p-2 sm:p-6 space-y-4 sm:space-y-6">
            {/* Mobile Sub-Tab Pills (Import vs Export) */}
            <div className="flex sm:hidden items-center bg-slate-200/80 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setBulkSubTab("import")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  bulkSubTab === "import"
                    ? "bg-white text-[#7A1F2B] shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>📋 Bulk Import</span>
              </button>

              <button
                type="button"
                onClick={() => setBulkSubTab("export")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  bulkSubTab === "export"
                    ? "bg-white text-[#7A1F2B] shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>📥 Export & VCF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Box 1: Bulk Add Guests */}
              <div
                className={`bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs ${
                  bulkSubTab === "import" ? "block" : "hidden sm:block"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#7A1F2B]" />
                    <span>📋 Quick Bulk Import</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setCsvText(
                        `Rohan Kumar, +919876543210, PENDING, 1\nAnanya Sharma, +919812345678, ATTENDING, 0\nVikram Singh, +919988776655, PENDING, 2`
                      )
                    }
                    className="text-[11px] font-bold text-[#7A1F2B] hover:underline bg-[#7A1F2B]/10 px-2.5 py-1 rounded-lg transition-all"
                  >
                    Paste Example Text
                  </button>
                </div>

                {/* 1. TOP ELEMENT: Upload Excel File (.xlsx, .xls, .csv) Button Card */}
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Upload Excel File (.xlsx, .xls, .csv)</span>
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                      1-Click Auto Save
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-normal">
                    Select your Excel spreadsheet file and all guest contacts will be automatically saved into your database.
                  </p>
                  <label className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>Select & Upload Excel File (.xlsx / .csv)</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv, .txt"
                      onChange={handleExcelFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative flex items-center justify-center my-1">
                  <div className="w-full border-t border-slate-200"></div>
                  <span className="bg-slate-50 px-2 text-[10px] font-bold text-slate-400 uppercase">Or Paste Text Lines</span>
                </div>

                {/* 2. SECOND ELEMENT: Text Area */}
                <textarea
                  rows={4}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`Rohan Kumar, +919876543210, PENDING, 1\nAnanya Sharma, +919812345678, ATTENDING, 0`}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/10 transition-all"
                />

                {importStatus.message && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      importStatus.success
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {importStatus.message}
                  </div>
                )}

                {/* 3. THIRD ELEMENT: Import All Guests Button */}
                <button
                  type="button"
                  onClick={handleImportCsv}
                  disabled={importing || !csvText.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#7A1F2B] text-white text-xs font-bold hover:bg-[#9B2C3B] transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{importing ? "Adding Guests..." : "Import All Guests"}</span>
                </button>

                {/* 4. FOURTH ELEMENT: Guidance & Instructions Collapsible Toggle */}
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowGuidance((prev) => !prev)}
                    className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#7A1F2B]" />
                      <span>Guidance & Formatting Instructions</span>
                    </span>
                    <div className="text-slate-400">
                      {showGuidance ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {showGuidance && (
                    <div className="p-3 bg-slate-50/80 border-t border-slate-100 space-y-2 text-[11px] text-slate-600 animate-in fade-in duration-150">
                      <p className="leading-relaxed">
                        Upload an Excel spreadsheet (`.xlsx` / `.csv`) above for automatic parsing, or paste text lines into the text area.
                      </p>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono space-y-1">
                        <div className="font-bold text-slate-700 font-sans">Text Format Guide:</div>
                        <div className="text-[#7A1F2B] font-bold">Name, Phone Number, RSVP Status, Plus Ones</div>
                        <div className="text-slate-500 text-[10px] font-sans">
                          Status options: <code className="text-emerald-700 font-bold">ATTENDING</code>, <code className="text-amber-700 font-bold">PENDING</code>, or <code className="text-rose-700 font-bold">DECLINED</code>.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Box 2: Export Tools */}
              <div
                className={`bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4 flex-col justify-between shadow-2xs ${
                  bulkSubTab === "export" ? "flex" : "hidden sm:flex"
                }`}
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#7A1F2B]" />
                    <span>📥 Export & Phone Contact Backup</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Download your guest roster formatted for phone contacts or Excel reports.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Card A: Phone Contacts (.VCF) */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                        <span>Save Contacts to Phone (.VCF)</span>
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        For WhatsApp
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Saves all guest numbers into your phone contacts in 1 tap so you can easily send WhatsApp Broadcasts.
                    </p>
                    <button
                      type="button"
                      onClick={exportVcard}
                      disabled={guests.length === 0}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Phone Contacts (.VCF)</span>
                    </button>
                  </div>

                  {/* Card B: Excel Spreadsheet (.CSV) */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#7A1F2B]" />
                        <span>Export Excel Spreadsheet (.CSV)</span>
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                        For Caterers & Venues
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Export a complete spreadsheet of RSVP statuses, headcount, and notes for your planner.
                    </p>
                    <button
                      type="button"
                      onClick={exportCsv}
                      disabled={guests.length === 0}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-700" />
                      <span>Download Excel Spreadsheet (.CSV)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD GUEST DIALOG MODAL */}
      {showAddGuest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#7A1F2B]" />
                Add Single Guest
              </h3>
              <button onClick={() => setShowAddGuest(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGuest} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Country</label>
                  <select
                    value={newCountryCode}
                    onChange={(e) => setNewCountryCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#7A1F2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as "PENDING" | "ATTENDING" | "DECLINED")}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="ATTENDING">ATTENDING</option>
                    <option value="DECLINED">DECLINED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Plus Ones</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={newPlusOnes}
                    onChange={(e) => setNewPlusOnes(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGuest(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingGuest}
                  className="px-5 py-2 rounded-xl bg-[#7A1F2B] text-white text-xs font-bold hover:bg-[#9B2C3B] disabled:opacity-50"
                >
                  {addingGuest ? "Saving..." : "Add Guest"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT GUEST DIALOG MODAL */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#7A1F2B]" />
                Edit Guest Details
              </h3>
              <button onClick={() => setEditingGuest(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditGuest} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Country</label>
                  <select
                    value={editCountryCode}
                    onChange={(e) => setEditCountryCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#7A1F2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "PENDING" | "ATTENDING" | "DECLINED")}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="ATTENDING">ATTENDING</option>
                    <option value="DECLINED">DECLINED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Plus Ones</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={editPlusOnes}
                    onChange={(e) => setEditPlusOnes(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Dietary / Attendance Notes</label>
                <input
                  type="text"
                  value={editDietaryNotes}
                  onChange={(e) => setEditDietaryNotes(e.target.value)}
                  placeholder="e.g. Vegetarian, arriving on 28th"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-[#7A1F2B] text-white text-xs font-bold hover:bg-[#9B2C3B] disabled:opacity-50"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE GUEST DETAILS & ACTIONS MODAL */}
      {detailsGuest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 w-full max-w-sm shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7A1F2B]" />
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                  {detailsGuest.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailsGuest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-500">RSVP Status</span>
                {detailsGuest.status === "ATTENDING" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Attending
                  </span>
                )}
                {detailsGuest.status === "PENDING" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px] border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending
                  </span>
                )}
                {detailsGuest.status === "DECLINED" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> Declined
                  </span>
                )}
              </div>

              <div className="space-y-2 p-3 bg-slate-50/60 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
                  </span>
                  <span className="font-mono font-bold text-slate-900">{detailsGuest.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                  </span>
                  <span className="font-semibold text-slate-800">{detailsGuest.email || "Not specified"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Plus Ones:
                  </span>
                  <span className="font-bold text-slate-900">{detailsGuest.plusOnes > 0 ? `+${detailsGuest.plusOnes}` : "None"}</span>
                </div>

                {detailsGuest.dietaryNotes && (
                  <div className="pt-1.5 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium block">Dietary / Notes:</span>
                    <span className="font-medium text-amber-800 italic block mt-0.5">{detailsGuest.dietaryNotes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  const target = detailsGuest;
                  setDetailsGuest(null);
                  shareWhatsAppWithImage(target);
                }}
                className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send WhatsApp Invitation</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = detailsGuest;
                    setDetailsGuest(null);
                    startEditGuest(target);
                  }}
                  className="w-full py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-600" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = detailsGuest;
                    setDetailsGuest(null);
                    setDeletingGuest(target);
                  }}
                  className="w-full py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Delete Guest</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE GUEST CONFIRMATION MODAL */}
      {deletingGuest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-sm shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Guest</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-slate-800">{deletingGuest.name}</span> from your guest list? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingGuest(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDeleteGuest}
                disabled={deleting}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Guest"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
