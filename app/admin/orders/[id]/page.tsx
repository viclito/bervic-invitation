"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  Printer,
  User,
  X,
  Download,
  FileText,
  Sparkles,
  MapPin,
  Check,
  RefreshCw,
} from "lucide-react";

interface AdminOrderItem {
  id: string;
  orderId: string;
  itemType: string;
  templateId: string;
  templateName: string;
  previewImage: string | null;
  copies: number;
  cardDetailsJson: string;
  elementsJson: string | null;
  customNotes: string | null;
  price: number;
  createdAt: string;
}

interface AdminOrderMessage {
  id: string;
  orderId: string;
  sender: string;
  message: string;
  createdAt: string;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string | null;
  city: string | null;
  pincode: string | null;
  status: string;
  totalCopies: number;
  totalAmount: number;
  paymentStatus: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
  messages: AdminOrderMessage[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-900 border-amber-300 ring-amber-400/20",
  CONFIRMED: "bg-emerald-50 text-emerald-900 border-emerald-300 ring-emerald-400/20",
  IN_PRODUCTION: "bg-blue-50 text-blue-900 border-blue-300 ring-blue-400/20",
  SHIPPED: "bg-purple-50 text-purple-900 border-purple-300 ring-purple-400/20",
  DELIVERED: "bg-green-50 text-green-900 border-green-300 ring-green-400/20",
  CANCELLED: "bg-red-50 text-red-900 border-red-300 ring-red-400/20",
};

interface CanvasElementData {
  id: string;
  type: "text" | "image" | "shape" | "sticker";
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: "left" | "center" | "right";
  letterSpacing?: number;
  lineHeight?: number;
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  zIndex?: number;
}

function getTemplateBackground(templateId?: string, templateName?: string, cardDetails?: Record<string, unknown>): { color: string; image?: string; thumbnail: string } {
  const id = String(templateId || "").toLowerCase();
  const name = String(templateName || "").toLowerCase();

  // If dynamic background was passed in cardDetails, honor it
  if (cardDetails?.backgroundImage && typeof cardDetails.backgroundImage === "string") {
    return {
      color: (cardDetails.backgroundColor as string) || "#FFFFFF",
      image: cardDetails.backgroundImage,
      thumbnail: cardDetails.backgroundImage,
    };
  }

  // 1. Modern Watercolor Floral & Rings (Purple)
  if (id.includes("modern-watercolor-floral") || id.includes("modern-floral") || name.includes("floral & rings") || name.includes("modern watercolor floral")) {
    return {
      color: "#FAF9FC",
      image: "/images/canva/modern-floral-purple.webp",
      thumbnail: "/images/canva/modern-floral-thumb.webp",
    };
  }

  // 2. Modern Watercolor & Gold Splatter (Plum / Luxury)
  if (id.includes("modern-watercolor-gold-splatter") || id.includes("modern2") || name.includes("gold splatter") || name.includes("luxury watercolor")) {
    return {
      color: "#FAF8F5",
      image: "/images/canva/modern2-bg-plum.webp",
      thumbnail: "/images/canva/modern2-thumb.webp",
    };
  }

  // 3. Modern Botanical Silver Foil & Foliage (Navy / Royal)
  if (id.includes("modern-silver-botanical-foliage") || id.includes("modern3") || name.includes("silver foil") || name.includes("botanical silver")) {
    return {
      color: "#F8FAFC",
      image: "/images/canva/modern3-navy.webp",
      thumbnail: "/images/canva/modern3-thumb.webp",
    };
  }

  // 4. Vintage Botanical Romance (Template 1)
  if (id.includes("vintage-botanical") || name.includes("vintage botanical") || id.includes("template1")) {
    return {
      color: "#F3EAD8",
      image: "/images/canva/parchment-bg.jpg",
      thumbnail: "/images/canva/template1-thumb.webp",
    };
  }

  // 5. Royal Parchment & Filigree (Template 2)
  if (id.includes("royal-parchment") || id.includes("royal-heritage") || name.includes("royal parchment") || name.includes("filigree") || id.includes("template2")) {
    return {
      color: "#3A2312",
      image: "/images/canva/template2-clean-bg.jpg",
      thumbnail: "/images/canva/template2-thumb.webp",
    };
  }

  // 6. Grand Mughal Royal Architecture (Template 3)
  if (id.includes("grand-mughal") || name.includes("mughal") || id.includes("template3")) {
    return {
      color: "#F5ECD7",
      image: "/images/canva/template3-vintage-frame.jpg",
      thumbnail: "/images/canva/template3-thumb.webp",
    };
  }

  // 7. Antique Parchment & Victorian Swirl (Template 4)
  if (id.includes("antique-parchment") || id.includes("vintage-victorian") || name.includes("victorian") || id.includes("template4")) {
    return {
      color: "#E8DCBF",
      image: "/images/canva/template4-parchment-bg.jpg",
      thumbnail: "/images/canva/template4-thumb.webp",
    };
  }

  // Universal Fallback
  return {
    color: "#FAF9FC",
    thumbnail: "/images/canva/template1-thumb.webp",
  };
}

function CardProofCanvas({
  item,
  width = 160,
  height = 225,
  onClick,
  showHover = true,
}: {
  item: AdminOrderItem;
  width?: number;
  height?: number;
  onClick?: () => void;
  showHover?: boolean;
}) {
  let elements: CanvasElementData[] = [];
  try {
    if (item.elementsJson) {
      elements = JSON.parse(item.elementsJson);
    }
  } catch {
    elements = [];
  }

  let parsedDetails: Record<string, unknown> = {};
  try {
    if (item.cardDetailsJson) {
      parsedDetails = JSON.parse(item.cardDetailsJson);
    }
  } catch {
    parsedDetails = {};
  }

  const bgInfo = getTemplateBackground(item.templateId, item.templateName, parsedDetails);
  const scale = width / 500;
  const hasElements = Array.isArray(elements) && elements.length > 0;
  const hasValidImage = typeof item.previewImage === "string" && item.previewImage.trim().length > 5;

  return (
    <div
      onClick={onClick}
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`relative rounded-2xl overflow-hidden border border-red-100 bg-white shadow-sm select-none transition-all ${
        onClick ? "cursor-pointer group hover:border-[#991B1B] hover:shadow-md" : ""
      }`}
      title={onClick ? "Click to view full zoom proof" : undefined}
    >
      {hasValidImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.previewImage!}
          alt={item.templateName || "Card Preview"}
          className="w-full h-full object-contain p-1"
        />
      ) : (
        <div
          style={{
            backgroundColor:
              bgInfo.color && (bgInfo.color.startsWith("#") || bgInfo.color.startsWith("rgb"))
                ? bgInfo.color
                : undefined,
            backgroundImage: bgInfo.image
              ? `url(${bgInfo.image})`
              : bgInfo.color && bgInfo.color.includes("gradient")
              ? bgInfo.color
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          {hasElements ? (
            elements.map((el) => {
              if (el.type === "image" && el.src) {
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={el.id}
                    src={el.src}
                    alt="Layer"
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: el.height ? `${el.height}%` : "auto",
                      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                      opacity: el.opacity ?? 1,
                      zIndex: el.zIndex ?? 1,
                    }}
                    className="object-contain pointer-events-none"
                  />
                );
              }
              if (el.type === "text" && el.text) {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      color: el.color || "#1E293B",
                      fontFamily: el.fontFamily || "Cinzel, serif",
                      fontSize: `${Math.max(6, (el.fontSize || 16) * scale)}px`,
                      fontWeight: el.fontWeight || "normal",
                      fontStyle: el.fontStyle || "normal",
                      textAlign: el.textAlign || "center",
                      letterSpacing: el.letterSpacing ? `${el.letterSpacing * scale}px` : undefined,
                      lineHeight: el.lineHeight || 1.2,
                      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                      opacity: el.opacity ?? 1,
                      zIndex: el.zIndex ?? 2,
                    }}
                    className="whitespace-pre-wrap pointer-events-none"
                  >
                    {el.text}
                  </div>
                );
              }
              return null;
            })
          ) : (
            <div className="w-full h-full relative flex flex-col items-center justify-center p-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bgInfo.thumbnail}
                alt="Card Frame"
                className="absolute inset-0 w-full h-full object-cover opacity-85"
              />
              <div className="relative z-10 space-y-1 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-red-100 shadow-2xs max-w-[90%]">
                {parsedDetails.groom ? (
                  <h4 className="font-serif font-bold text-[11px] text-[#991B1B]">
                    {String(parsedDetails.groom)} {parsedDetails.bride ? `& ${String(parsedDetails.bride)}` : ""}
                  </h4>
                ) : null}
                {parsedDetails.date ? (
                  <p className="text-[9px] font-bold text-slate-700 tracking-wider">
                    {String(parsedDetails.date)}
                  </p>
                ) : null}
                {parsedDetails.venue ? (
                  <p className="text-[8px] text-slate-600 font-medium line-clamp-2">
                    {String(parsedDetails.venue)}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hover Zoom Proof Overlay */}
      {showHover && onClick && (
        <div className="absolute inset-0 bg-[#991B1B]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 z-30">
          <Eye className="w-5 h-5 text-white" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Zoom Proof</span>
        </div>
      )}
    </div>
  );
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingPrintShopPdf, setDownloadingPrintShopPdf] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [previewModalItem, setPreviewModalItem] = useState<AdminOrderItem | null>(null);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrderDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/orders/${orderId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load order details");
        setOrder(data.order);
      } catch (err: unknown) {
        setErrorMsg((err as Error)?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetail();
  }, [orderId]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      setSuccessToast(`Status updated to ${newStatus} & customer notified!`);
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: unknown) {
      alert((err as Error)?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendMessage = async () => {
    if (!order || !messageInput.trim()) return;
    setSendingMessage(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setOrder((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, data.message],
            }
          : null
      );
      setMessageInput("");
      setSuccessToast("Message sent & customer notified via email!");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: unknown) {
      alert((err as Error)?.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDownloadOrderPdf = async () => {
    if (!order) return;
    setDownloadingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;

      // Helper to load image as DataURL with natural dimensions
      const loadImageAsDataUrl = async (
        url: string
      ): Promise<{ dataUrl: string; width: number; height: number } | null> => {
        try {
          const cleanUrl = url.trim();
          if (!cleanUrl) return null;
          const fullUrl = cleanUrl.startsWith("http")
            ? cleanUrl
            : `${typeof window !== "undefined" ? window.location.origin : ""}${
                cleanUrl.startsWith("/") ? "" : "/"
              }${cleanUrl}`;

          const res = await fetch(fullUrl, { mode: "cors" });
          if (!res.ok) return null;
          const blob = await res.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const dataUrl = reader.result as string;
              const img = new window.Image();
              img.onload = () => {
                resolve({
                  dataUrl,
                  width: img.naturalWidth || 800,
                  height: img.naturalHeight || 1200,
                });
              };
              img.onerror = () => resolve({ dataUrl, width: 800, height: 1200 });
              img.src = dataUrl;
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn("Failed to load image as DataURL for PDF:", e);
          return null;
        }
      };

      // Pre-load images for all order items in parallel
      const loadedItemImages = await Promise.all(
        order.items.map(async (item) => {
          let details: any = {};
          try {
            details = JSON.parse(item.cardDetailsJson || "{}");
          } catch {}
          const bgInfo = getTemplateBackground(item.templateId, item.templateName);
          const candidateUrl =
            (item.previewImage && item.previewImage.trim()) ||
            (details.previewImage && String(details.previewImage).trim()) ||
            (details.image && String(details.image).trim()) ||
            (bgInfo.thumbnail && bgInfo.thumbnail.trim()) ||
            (bgInfo.image && bgInfo.image.trim()) ||
            "/images/canva/template2-thumb.webp";

          return await loadImageAsDataUrl(candidateUrl);
        })
      );

      // ── Page 1: Official Print Work Order & Customer Specifications Sheet ──
      // Top Maroon Header Bar
      doc.setFillColor(153, 27, 27); // #991B1B
      doc.rect(0, 0, pageWidth, 28, "F");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("BERVIC PRINT PRODUCTION WORK ORDER", margin, 12);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Luxury Card Studio • Official Manufacturing & Dispatch Document", margin, 19);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`#${order.orderNumber}`, pageWidth - margin, 12, { align: "right" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Status: ${order.status}`, pageWidth - margin, 19, { align: "right" });

      // Order Overview Metadata Strip
      let currentY = 36;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, "FD");

      doc.setTextColor(71, 85, 105);
      doc.setFontSize(8);
      doc.text("DATE PLACED", margin + 6, currentY + 7);
      doc.text("TOTAL PRINT RUN", margin + 55, currentY + 7);
      doc.text("PAYMENT STATUS", margin + 105, currentY + 7);
      doc.text("ORDER AMOUNT", margin + 145, currentY + 7);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const dateFormatted = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      doc.text(dateFormatted, margin + 6, currentY + 14);
      doc.text(`${order.totalCopies} Copies`, margin + 55, currentY + 14);
      doc.text(order.paymentStatus || "PAID", margin + 105, currentY + 14);
      doc.text(`Rs. ${order.totalAmount || 0}`, margin + 145, currentY + 14);

      currentY += 28;

      // Customer & Shipping Information Box
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(153, 27, 27);
      doc.text("1. CUSTOMER & DELIVERY SPECIFICATIONS", margin, currentY);

      currentY += 4;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, currentY, contentWidth, 34, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Customer Name:", margin + 6, currentY + 7);
      doc.text("Phone Number:", margin + 95, currentY + 7);
      doc.text("Email Address:", margin + 6, currentY + 15);
      doc.text("Shipping Address:", margin + 6, currentY + 23);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(order.customerName || "N/A", margin + 38, currentY + 7);
      doc.text(order.customerPhone || "N/A", margin + 120, currentY + 7);

      doc.setFont("helvetica", "normal");
      doc.text(order.customerEmail || "N/A", margin + 38, currentY + 15);
      const fullAddress = `${order.deliveryAddress || "N/A"}${
        order.city ? `, ${order.city}` : ""
      }${order.pincode ? ` - ${order.pincode}` : ""}`;
      doc.text(doc.splitTextToSize(fullAddress, contentWidth - 46), margin + 38, currentY + 23);

      currentY += 42;

      // Ordered Template Items Table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(153, 27, 27);
      doc.text(`2. ORDERED CARD TEMPLATES & PRINT ITEMS (${order.items.length})`, margin, currentY);

      currentY += 4;
      doc.setFillColor(153, 27, 27);
      doc.rect(margin, currentY, contentWidth, 8, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text("#", margin + 4, currentY + 5.5);
      doc.text("Template Name", margin + 14, currentY + 5.5);
      doc.text("Celebrant / Couple", margin + 65, currentY + 5.5);
      doc.text("Event Date", margin + 110, currentY + 5.5);
      doc.text("Print Quantity", margin + 150, currentY + 5.5);

      currentY += 8;

      order.items.forEach((item, idx) => {
        let details: any = {};
        try {
          details = JSON.parse(item.cardDetailsJson || "{}");
        } catch {}

        doc.setFillColor(
          idx % 2 === 0 ? 255 : 248,
          idx % 2 === 0 ? 255 : 250,
          idx % 2 === 0 ? 255 : 252
        );
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, currentY, contentWidth, 12, "FD");

        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.text(String(idx + 1), margin + 4, currentY + 7.5);
        doc.text(item.templateName || "Custom Card", margin + 14, currentY + 7.5);

        const coupleName = details.groom
          ? `${details.groom}${details.bride ? ` & ${details.bride}` : ""}`
          : "N/A";
        doc.setFont("helvetica", "normal");
        doc.text(doc.splitTextToSize(coupleName, 42)[0] || "N/A", margin + 65, currentY + 7.5);
        doc.text(String(details.date || "N/A"), margin + 110, currentY + 7.5);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(153, 27, 27);
        doc.text(`${item.copies} Copies`, margin + 150, currentY + 7.5);

        currentY += 12;

        if (item.customNotes) {
          const parts = item.customNotes
            .split(/[|\n]/)
            .map((p) => p.trim())
            .filter(Boolean);

          const parsedList = parts.map((part) => {
            const colonIdx = part.indexOf(":");
            if (colonIdx > 0) {
              const key = part.slice(0, colonIdx).trim();
              const val = part.slice(colonIdx + 1).trim();
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9.5);
              const keyW = doc.getTextWidth(`• ${key}: `);
              doc.setFont("helvetica", "normal");
              const remainingW = Math.max(45, contentWidth - 14 - keyW);
              const valLines = doc.splitTextToSize(val, remainingW);
              return { key, val, lines: valLines };
            }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            return { key: "", val: part, lines: doc.splitTextToSize(part, contentWidth - 14) };
          });

          let p1ContentHeight = 0;
          parsedList.forEach((n) => {
            p1ContentHeight += Math.max(1, n.lines.length) * 5.2 + 1.2;
          });
          const noteBoxHeight = 8 + p1ContentHeight;

          // Pure White Background with crisp border
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(203, 213, 225);
          doc.rect(margin, currentY, contentWidth, noteBoxHeight, "FD");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(153, 27, 27);
          doc.text("Special Requirements / Custom Notes:", margin + 5, currentY + 5.5);

          let p1NoteY = currentY + 11;
          const p1StartX = margin + 5;

          parsedList.forEach((n) => {
            if (n.key) {
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              const keyPrefix = `• ${n.key}: `;
              doc.text(keyPrefix, p1StartX, p1NoteY);
              const keyW = doc.getTextWidth(keyPrefix);

              doc.setFont("helvetica", "normal");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              if (n.lines.length > 0) {
                doc.text(n.lines[0], p1StartX + keyW, p1NoteY);
                for (let l = 1; l < n.lines.length; l++) {
                  p1NoteY += 5.0;
                  doc.text(n.lines[l], p1StartX + keyW, p1NoteY);
                }
              }
            } else {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              n.lines.forEach((lStr: string, lIdx: number) => {
                if (lIdx > 0) p1NoteY += 5.0;
                doc.text(`• ${lStr}`, p1StartX, p1NoteY);
              });
            }
            p1NoteY += 5.4;
          });

          currentY += noteBoxHeight + 2;
        }
      });

      currentY += 6;

      // ── 3. PRODUCTION & QUALITY CHECKLIST (Fix text overlapping & unicode font issues) ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(153, 27, 27);
      doc.text("3. PRODUCTION SPECIFICATIONS & QUALITY CHECKLIST", margin, currentY);

      currentY += 4;
      const specBoxH = 34;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, currentY, contentWidth, specBoxH, 2, 2, "FD");

      const drawCheckItem = (x: number, y: number, label: string, val: string) => {
        // Green OK badge
        doc.setFillColor(220, 252, 231);
        doc.setDrawColor(22, 163, 74);
        doc.roundedRect(x, y - 3, 5.5, 4, 0.8, 0.8, "FD");
        doc.setTextColor(22, 163, 74);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.text("OK", x + 0.9, y - 0.2);

        // Label and Value
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(`${label}: `, x + 7.5, y);
        const labelW = doc.getTextWidth(`${label}: `);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(val, x + 7.5 + labelW, y);
      };

      const col1X = margin + 5;
      const col2X = margin + contentWidth / 2 + 3;

      // Row 1
      drawCheckItem(col1X, currentY + 8, "Stock", "Premium 350 GSM Textured Board");
      drawCheckItem(col2X, currentY + 8, "Envelopes", "Matching Custom Luxury Envelopes");

      // Row 2
      drawCheckItem(col1X, currentY + 17, "Printing", "Ultra-HD 2400 DPI Offset Precision");
      drawCheckItem(col2X, currentY + 17, "Inspection", "Quality & Alignment Check Passed");

      // Row 3
      drawCheckItem(col1X, currentY + 26, "Finishes", "Precision Hot-Foil & Die-Cut Edges");
      drawCheckItem(col2X, currentY + 26, "Packaging", "Moisture-Proof Protective Box");

      // Footer on Page 1
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Generated by Bervic Admin System on ${new Date().toLocaleString(
          "en-IN"
        )} • Page 1 of ${1 + order.items.length}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );

      // ── Subsequent Pages: Full-Resolution Card Design Proofs & Clear Specifications ──
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const loadedImg = loadedItemImages[i];
        doc.addPage();

        // Page Header Strip
        doc.setFillColor(153, 27, 27);
        doc.rect(0, 0, pageWidth, 20, "F");

        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text(`DESIGN SPECIFICATION #${i + 1}: ${item.templateName.toUpperCase()}`, margin, 13);

        doc.setFontSize(9);
        doc.text(`Run: ${item.copies} Copies`, pageWidth - margin, 13, { align: "right" });

        let details: any = {};
        try {
          details = JSON.parse(item.cardDetailsJson || "{}");
        } catch {}

        const coupleName = details.groom
          ? `${details.groom}${details.bride ? ` & ${details.bride}` : ""}`
          : item.templateName;

        // Card Container Viewport
        const cardBoxW = 115;
        const cardBoxH = 142;
        const cardBoxX = (pageWidth - cardBoxW) / 2;
        const cardBoxY = 26;

        if (loadedImg && loadedImg.dataUrl) {
          const imgAspect = loadedImg.width / loadedImg.height;
          let drawW = cardBoxW;
          let drawH = cardBoxW / imgAspect;
          if (drawH > cardBoxH) {
            drawH = cardBoxH;
            drawW = cardBoxH * imgAspect;
          }
          const drawX = cardBoxX + (cardBoxW - drawW) / 2;
          const drawY = cardBoxY + (cardBoxH - drawH) / 2;

          // Shadow and border container
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(203, 213, 225);
          doc.roundedRect(drawX - 1.5, drawY - 1.5, drawW + 3, drawH + 3, 2, 2, "FD");

          const format = loadedImg.dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
          doc.addImage(loadedImg.dataUrl, format, drawX, drawY, drawW, drawH, undefined, "FAST");
        } else {
          // Luxury Fallback Card Frame
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(203, 213, 225);
          doc.roundedRect(cardBoxX, cardBoxY, cardBoxW, cardBoxH, 3, 3, "FD");

          doc.setFont("serif", "bold");
          doc.setFontSize(15);
          doc.setTextColor(153, 27, 27);
          doc.text(coupleName, pageWidth / 2, cardBoxY + 50, { align: "center" });

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(180, 83, 9);
          doc.text(String(details.date || "DATE OF CELEBRATION"), pageWidth / 2, cardBoxY + 70, {
            align: "center",
          });

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          const venueLines = doc.splitTextToSize(String(details.venue || "VENUE DETAILS"), 90);
          doc.text(venueLines, pageWidth / 2, cardBoxY + 86, { align: "center" });
        }

        // ── ITEM SPECIFICATIONS & MANUFACTURING PARAMETERS (Below Card Proof) ──
        const specY = cardBoxY + cardBoxH + 5;
        const parts = (item.customNotes || "")
          .split(/[|\n]/)
          .map((p) => p.trim())
          .filter(Boolean);

        const parsedNotesList = parts.map((part) => {
          const colonIdx = part.indexOf(":");
          if (colonIdx > 0) {
            const key = part.slice(0, colonIdx).trim();
            const val = part.slice(colonIdx + 1).trim();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            const keyW = doc.getTextWidth(`• ${key}: `);
            doc.setFont("helvetica", "normal");
            const remainingW = Math.max(50, contentWidth - 18 - keyW);
            const valLines = doc.splitTextToSize(val, remainingW);
            return { key, val, lines: valLines };
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          return { key: "", val: part, lines: doc.splitTextToSize(part, contentWidth - 18) };
        });

        let noteLinesTotalCount = 0;
        parsedNotesList.forEach((n) => {
          noteLinesTotalCount += Math.max(1, n.lines.length);
        });

        const noteBoxHeight = parsedNotesList.length > 0 ? 10 + noteLinesTotalCount * 5.2 + parsedNotesList.length * 1.0 : 0;
        const specBoxHeight = 35 + noteBoxHeight;

        // Outer Box
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(margin, specY, contentWidth, specBoxHeight, 2, 2, "FD");

        // Top Title Banner inside Spec Box
        doc.setFillColor(153, 27, 27);
        doc.roundedRect(margin, specY, contentWidth, 7, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text("ITEM SPECIFICATIONS & MANUFACTURING PARAMETERS", margin + 5, specY + 4.8);

        // 2-Column Key/Value Grid
        const specCol1X = margin + 5;
        const specCol2X = margin + contentWidth / 2 + 4;
        let lineY = specY + 13;

        // Row 1
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text("Template / Design:", specCol1X, lineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(
          doc.splitTextToSize(item.templateName, 55)[0] || item.templateName,
          specCol1X + 28,
          lineY
        );

        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Print Run (Copies):", specCol2X, lineY);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(153, 27, 27);
        doc.text(`${item.copies} Units / Copies`, specCol2X + 28, lineY);

        // Row 2
        lineY += 6.5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Standard Dimensions:", specCol1X, lineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text("5.5 x 8.5 in (Standard Luxury)", specCol1X + 31, lineY);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Stock / Paper Type:", specCol2X, lineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text("350 GSM Metallic Cardstock", specCol2X + 28, lineY);

        // Row 3
        lineY += 6.5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Celebrant / Couple:", specCol1X, lineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(doc.splitTextToSize(coupleName, 55)[0] || "N/A", specCol1X + 28, lineY);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Event Date:", specCol2X, lineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(String(details.date || "N/A"), specCol2X + 28, lineY);

        // Custom Notes Section (Pure White background, 9.5pt text size)
        if (parsedNotesList.length > 0) {
          lineY += 6.5;
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(203, 213, 225);
          doc.roundedRect(margin + 3, lineY, contentWidth - 6, noteBoxHeight, 1.5, 1.5, "FD");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(153, 27, 27);
          doc.text("Special Requirements / Customer Notes:", margin + 6, lineY + 5.5);

          let currentNoteY = lineY + 11;
          const noteStartX = margin + 6;

          parsedNotesList.forEach((n) => {
            if (n.key) {
              // Key: Bold, Black
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              const keyPrefix = `• ${n.key}: `;
              doc.text(keyPrefix, noteStartX, currentNoteY);
              const keyW = doc.getTextWidth(keyPrefix);

              // Value: Normal, Black
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              if (n.lines.length > 0) {
                doc.text(n.lines[0], noteStartX + keyW, currentNoteY);
                for (let l = 1; l < n.lines.length; l++) {
                  currentNoteY += 5.0;
                  doc.text(n.lines[l], noteStartX + keyW, currentNoteY);
                }
              }
            } else {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              n.lines.forEach((lStr: string, lIdx: number) => {
                if (lIdx > 0) currentNoteY += 5.0;
                doc.text(`• ${lStr}`, noteStartX, currentNoteY);
              });
            }
            currentNoteY += 5.4;
          });
        }

        // Page Footer
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Order #${order.orderNumber} • Item ${i + 1} of ${order.items.length} • Page ${
            i + 2
          } of ${1 + order.items.length}`,
          pageWidth / 2,
          pageHeight - 8,
          { align: "center" }
        );
      }

      doc.save(`Bervic_Order_${order.orderNumber}_Print_Work_Order.pdf`);
      setSuccessToast("Print Order PDF downloaded successfully!");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      alert(err?.message || "Failed to generate PDF");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // ── Dedicated PDF for the Print Shop / Manufacturing Press (No prices, No payment status) ──
  const handleDownloadPrintShopPdf = async () => {
    if (!order) return;
    setDownloadingPrintShopPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;

      // Helper to load image as DataURL
      const loadImageAsDataUrl = async (
        url: string
      ): Promise<{ dataUrl: string; width: number; height: number } | null> => {
        try {
          const cleanUrl = url.trim();
          if (!cleanUrl) return null;
          const fullUrl = cleanUrl.startsWith("http")
            ? cleanUrl
            : `${typeof window !== "undefined" ? window.location.origin : ""}${
                cleanUrl.startsWith("/") ? "" : "/"
              }${cleanUrl}`;

          const res = await fetch(fullUrl, { mode: "cors" });
          if (!res.ok) return null;
          const blob = await res.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const dataUrl = reader.result as string;
              const img = new window.Image();
              img.onload = () => {
                resolve({
                  dataUrl,
                  width: img.naturalWidth || 800,
                  height: img.naturalHeight || 1200,
                });
              };
              img.onerror = () => resolve({ dataUrl, width: 800, height: 1200 });
              img.src = dataUrl;
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn("Failed to load image as DataURL for Print Shop PDF:", e);
          return null;
        }
      };

      // Load Bervic Logo & Item Images in parallel
      const [logoImg, ...loadedItemImages] = await Promise.all([
        loadImageAsDataUrl("/images/logo.png").then((res) => res || loadImageAsDataUrl("/logo.png")),
        ...order.items.map(async (item) => {
          let details: any = {};
          try {
            details = JSON.parse(item.cardDetailsJson || "{}");
          } catch {}
          const bgInfo = getTemplateBackground(item.templateId, item.templateName);
          const candidateUrl =
            (item.previewImage && item.previewImage.trim()) ||
            (details.previewImage && String(details.previewImage).trim()) ||
            (details.image && String(details.image).trim()) ||
            (bgInfo.thumbnail && bgInfo.thumbnail.trim()) ||
            (bgInfo.image && bgInfo.image.trim()) ||
            "/images/canva/template2-thumb.webp";

          return await loadImageAsDataUrl(candidateUrl);
        }),
      ]);

      // ── Page 1: Official Print Shop Production Docket & Delivery Routing ──
      // Top Maroon Header Bar
      doc.setFillColor(153, 27, 27); // #991B1B
      doc.rect(0, 0, pageWidth, 28, "F");

      // Bervic Logo in Header (if loaded)
      let titleStartX = margin;
      if (logoImg && logoImg.dataUrl) {
        const logoAspect = logoImg.width / logoImg.height;
        const logoH = 16;
        const logoW = Math.min(24, logoH * logoAspect);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, 6, logoW + 2, logoH + 2, 2, 2, "F");
        doc.addImage(logoImg.dataUrl, "PNG", margin + 1, 7, logoW, logoH, undefined, "FAST");
        titleStartX = margin + logoW + 6;
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("BERVIC PRINT MANUFACTURING DOCKET", titleStartX, 13);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text("Official Press Specification & Dispatch Document", titleStartX, 19);

      // Order Reference on Right (NO amount, NO payment status)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`DOCKET #${order.orderNumber}`, pageWidth - margin, 12, { align: "right" });

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text(`Job Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, pageWidth - margin, 19, { align: "right" });

      // Highlighted Production Run Strip (NO prices or status!)
      let currentY = 35;
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(239, 68, 68);
      doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, "FD");

      doc.setTextColor(153, 27, 27);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("TOTAL PRODUCTION QUANTITY:", margin + 6, currentY + 7);
      doc.text("DESTINATION CITY:", margin + 95, currentY + 7);

      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${order.totalCopies} Printed Units / Copies`, margin + 6, currentY + 14);
      doc.setFontSize(10);
      doc.text(order.city ? `${order.city.toUpperCase()} (${order.pincode || ""})` : "Standard Dispatch", margin + 95, currentY + 14);

      currentY += 25;

      // ── 1. CUSTOMER DELIVERY & DISPATCH ADDRESS ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(153, 27, 27);
      doc.text("1. CUSTOMER DELIVERY & COURIER DISPATCH ADDRESS", margin, currentY);

      currentY += 4;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Recipient Name:", margin + 6, currentY + 7);
      doc.text("Contact Phone:", margin + 95, currentY + 7);
      doc.text("Shipping Address:", margin + 6, currentY + 16);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(order.customerName || "N/A", margin + 38, currentY + 7);
      doc.text(order.customerPhone || "N/A", margin + 120, currentY + 7);

      doc.setFont("helvetica", "normal");
      const fullAddress = `${order.deliveryAddress || "N/A"}${
        order.city ? `, ${order.city}` : ""
      }${order.pincode ? ` - ${order.pincode}` : ""}`;
      doc.text(doc.splitTextToSize(fullAddress, contentWidth - 46), margin + 38, currentY + 16);

      currentY += 39;

      // ── 2. ORDERED TEMPLATES & PRINT RUN SUMMARY TABLE (NO PRICES!) ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(153, 27, 27);
      doc.text(`2. ORDERED CARD TEMPLATES & PRINT QUANTITIES (${order.items.length})`, margin, currentY);

      currentY += 4;
      doc.setFillColor(153, 27, 27);
      doc.rect(margin, currentY, contentWidth, 8, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text("#", margin + 4, currentY + 5.5);
      doc.text("Template / Design Name", margin + 14, currentY + 5.5);
      doc.text("Celebrant / Couple", margin + 75, currentY + 5.5);
      doc.text("Event Date", margin + 120, currentY + 5.5);
      doc.text("Required Run", margin + 150, currentY + 5.5);

      currentY += 8;

      order.items.forEach((item, idx) => {
        let details: any = {};
        try {
          details = JSON.parse(item.cardDetailsJson || "{}");
        } catch {}

        doc.setFillColor(
          idx % 2 === 0 ? 255 : 248,
          idx % 2 === 0 ? 255 : 250,
          idx % 2 === 0 ? 255 : 252
        );
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, currentY, contentWidth, 12, "FD");

        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.text(String(idx + 1), margin + 4, currentY + 7.5);
        doc.text(item.templateName || "Custom Card", margin + 14, currentY + 7.5);

        const coupleName = details.groom
          ? `${details.groom}${details.bride ? ` & ${details.bride}` : ""}`
          : "N/A";
        doc.setFont("helvetica", "normal");
        doc.text(doc.splitTextToSize(coupleName, 42)[0] || "N/A", margin + 75, currentY + 7.5);
        doc.text(String(details.date || "N/A"), margin + 120, currentY + 7.5);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(153, 27, 27);
        doc.text(`${item.copies} Copies`, margin + 150, currentY + 7.5);

        currentY += 12;

        if (item.customNotes) {
          const parts = item.customNotes
            .split(/[|\n]/)
            .map((p) => p.trim())
            .filter(Boolean);

          const parsedList = parts.map((part) => {
            const colonIdx = part.indexOf(":");
            if (colonIdx > 0) {
              const key = part.slice(0, colonIdx).trim();
              const val = part.slice(colonIdx + 1).trim();
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9.5);
              const keyW = doc.getTextWidth(`• ${key}: `);
              doc.setFont("helvetica", "normal");
              const remainingW = Math.max(45, contentWidth - 14 - keyW);
              const valLines = doc.splitTextToSize(val, remainingW);
              return { key, val, lines: valLines };
            }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            return { key: "", val: part, lines: doc.splitTextToSize(part, contentWidth - 14) };
          });

          let p1ContentHeight = 0;
          parsedList.forEach((n) => {
            p1ContentHeight += Math.max(1, n.lines.length) * 5.2 + 1.2;
          });
          const noteBoxHeight = 8 + p1ContentHeight;

          // Pure White background with clean border
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(203, 213, 225);
          doc.rect(margin, currentY, contentWidth, noteBoxHeight, "FD");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(153, 27, 27);
          doc.text("Special Requirements / Custom Notes:", margin + 5, currentY + 5.5);

          let p1NoteY = currentY + 11;
          const p1StartX = margin + 5;

          parsedList.forEach((n) => {
            if (n.key) {
              // Key: Bold, Black
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              const keyPrefix = `• ${n.key}: `;
              doc.text(keyPrefix, p1StartX, p1NoteY);
              const keyW = doc.getTextWidth(keyPrefix);

              // Value: Normal, Black
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              if (n.lines.length > 0) {
                doc.text(n.lines[0], p1StartX + keyW, p1NoteY);
                for (let l = 1; l < n.lines.length; l++) {
                  p1NoteY += 5.0;
                  doc.text(n.lines[l], p1StartX + keyW, p1NoteY);
                }
              }
            } else {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              n.lines.forEach((lStr: string, lIdx: number) => {
                if (lIdx > 0) p1NoteY += 5.0;
                doc.text(`• ${lStr}`, p1StartX, p1NoteY);
              });
            }
            p1NoteY += 5.4;
          });

          currentY += noteBoxHeight + 2;
        }
      });

      currentY += 6;

      // ── 3. PRODUCTION SPECIFICATIONS & QUALITY CHECKLIST ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(153, 27, 27);
      doc.text("3. PRODUCTION SPECIFICATIONS & QUALITY CHECKLIST", margin, currentY);

      currentY += 4;
      const specBoxH = 34;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, currentY, contentWidth, specBoxH, 2, 2, "FD");

      const drawCheckItem = (x: number, y: number, label: string, val: string) => {
        // Green OK badge
        doc.setFillColor(220, 252, 231);
        doc.setDrawColor(22, 163, 74);
        doc.roundedRect(x, y - 3, 5.5, 4, 0.8, 0.8, "FD");
        doc.setTextColor(22, 163, 74);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.text("OK", x + 0.9, y - 0.2);

        // Label and Value
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(`${label}: `, x + 7.5, y);
        const labelW = doc.getTextWidth(`${label}: `);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(val, x + 7.5 + labelW, y);
      };

      const col1X = margin + 5;
      const col2X = margin + contentWidth / 2 + 3;

      // Row 1
      drawCheckItem(col1X, currentY + 8, "Stock", "Premium 350 GSM Textured Board");
      drawCheckItem(col2X, currentY + 8, "Envelopes", "Matching Custom Luxury Envelopes");

      // Row 2
      drawCheckItem(col1X, currentY + 17, "Printing", "Ultra-HD 2400 DPI Offset Precision");
      drawCheckItem(col2X, currentY + 17, "Inspection", "Quality & Alignment Check Passed");

      // Row 3
      drawCheckItem(col1X, currentY + 26, "Finishes", "Precision Hot-Foil & Die-Cut Edges");
      drawCheckItem(col2X, currentY + 26, "Packaging", "Moisture-Proof Protective Box");

      // Footer on Page 1
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Bervic Print Shop Docket #${order.orderNumber} • Page 1 of ${1 + order.items.length}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );

      // ── Subsequent Pages: High-Resolution Card Design Proofs with Exact Alignment & Notes ──
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const loadedImg = loadedItemImages[i];
        doc.addPage();

        // Page Header Strip
        doc.setFillColor(153, 27, 27);
        doc.rect(0, 0, pageWidth, 20, "F");

        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text(`DESIGN SPECIFICATION #${i + 1}: ${item.templateName.toUpperCase()}`, margin, 13);

        doc.setFontSize(9);
        doc.text(`Print Run: ${item.copies} Copies`, pageWidth - margin, 13, { align: "right" });

        let details: any = {};
        try {
          details = JSON.parse(item.cardDetailsJson || "{}");
        } catch {}

        const coupleName = details.groom
          ? `${details.groom}${details.bride ? ` & ${details.bride}` : ""}`
          : item.templateName;

        // Card Container Viewport
        const cardBoxW = 115;
        const cardBoxH = 120;
        const cardBoxX = (pageWidth - cardBoxW) / 2;
        const cardBoxY = 25;

        if (loadedImg && loadedImg.dataUrl) {
          const imgAspect = loadedImg.width / loadedImg.height;
          let drawW = cardBoxW;
          let drawH = cardBoxW / imgAspect;
          if (drawH > cardBoxH) {
            drawH = cardBoxH;
            drawW = cardBoxH * imgAspect;
          }
          const drawX = cardBoxX + (cardBoxW - drawW) / 2;
          const drawY = cardBoxY + (cardBoxH - drawH) / 2;

          // Shadow and border container
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(203, 213, 225);
          doc.roundedRect(drawX - 1.5, drawY - 1.5, drawW + 3, drawH + 3, 2, 2, "FD");

          const format = loadedImg.dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
          doc.addImage(loadedImg.dataUrl, format, drawX, drawY, drawW, drawH, undefined, "FAST");
        } else {
          // Luxury Fallback Card Frame
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(203, 213, 225);
          doc.roundedRect(cardBoxX, cardBoxY, cardBoxW, cardBoxH, 3, 3, "FD");

          doc.setFont("serif", "bold");
          doc.setFontSize(15);
          doc.setTextColor(153, 27, 27);
          doc.text(coupleName, pageWidth / 2, cardBoxY + 45, { align: "center" });

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(180, 83, 9);
          doc.text(String(details.date || "DATE OF CELEBRATION"), pageWidth / 2, cardBoxY + 65, {
            align: "center",
          });

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          const venueLines = doc.splitTextToSize(String(details.venue || "VENUE DETAILS"), 90);
          doc.text(venueLines, pageWidth / 2, cardBoxY + 78, { align: "center" });
        }

        // ── ITEM SPECIFICATIONS & MANUFACTURING PARAMETERS (Below Card Proof) ──
        const specY = cardBoxY + cardBoxH + 5;
        const parts = (item.customNotes || "")
          .split(/[|\n]/)
          .map((p) => p.trim())
          .filter(Boolean);

        const parsedNotesList = parts.map((part) => {
          const colonIdx = part.indexOf(":");
          if (colonIdx > 0) {
            const key = part.slice(0, colonIdx).trim();
            const val = part.slice(colonIdx + 1).trim();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            const keyW = doc.getTextWidth(`• ${key}: `);
            doc.setFont("helvetica", "normal");
            const remainingW = Math.max(50, contentWidth - 18 - keyW);
            const valLines = doc.splitTextToSize(val, remainingW);
            return { key, val, lines: valLines };
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          return { key: "", val: part, lines: doc.splitTextToSize(part, contentWidth - 18) };
        });

        let noteLinesTotalCount = 0;
        parsedNotesList.forEach((n) => {
          noteLinesTotalCount += Math.max(1, n.lines.length);
        });

        const noteBoxHeight = parsedNotesList.length > 0 ? 10 + noteLinesTotalCount * 5.2 + parsedNotesList.length * 1.0 : 0;
        const specBoxHeight = 35 + noteBoxHeight;

        // Outer Box
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(margin, specY, contentWidth, specBoxHeight, 2, 2, "FD");

        // Top Title Banner inside Spec Box
        doc.setFillColor(153, 27, 27);
        doc.roundedRect(margin, specY, contentWidth, 7, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text("ITEM SPECIFICATIONS & MANUFACTURING PARAMETERS", margin + 5, specY + 4.8);

        // 2-Column Key/Value Grid (NO PRICES!)
        const specCol1X = margin + 5;
        const specCol2X = margin + contentWidth / 2 + 4;
        let lineY = specY + 13;

        // Row 1
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text("Template / Design:", specCol1X, lineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(
          doc.splitTextToSize(item.templateName, 55)[0] || item.templateName,
          specCol1X + 28,
          lineY
        );

        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Print Run (Copies):", specCol2X, lineY);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(153, 27, 27);
        doc.text(`${item.copies} Units / Copies`, specCol2X + 28, lineY);

        // Row 2
        lineY += 6.5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Standard Dimensions:", specCol1X, lineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text("5.5 x 8.5 in (Standard Luxury)", specCol1X + 31, lineY);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Stock / Paper Type:", specCol2X, lineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text("350 GSM Metallic Cardstock", specCol2X + 28, lineY);

        // Row 3
        lineY += 6.5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Celebrant / Couple:", specCol1X, lineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(doc.splitTextToSize(coupleName, 55)[0] || "N/A", specCol1X + 28, lineY);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Event Date:", specCol2X, lineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(String(details.date || "N/A"), specCol2X + 28, lineY);

        // Custom Notes Section (Pure White background, 9.5pt text size)
        if (parsedNotesList.length > 0) {
          lineY += 6.5;
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(203, 213, 225);
          doc.roundedRect(margin + 3, lineY, contentWidth - 6, noteBoxHeight, 1.5, 1.5, "FD");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(153, 27, 27);
          doc.text("Special Requirements / Customer Notes:", margin + 6, lineY + 5.5);

          let currentNoteY = lineY + 11;
          const noteStartX = margin + 6;

          parsedNotesList.forEach((n) => {
            if (n.key) {
              // Key: Bold, Black
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              const keyPrefix = `• ${n.key}: `;
              doc.text(keyPrefix, noteStartX, currentNoteY);
              const keyW = doc.getTextWidth(keyPrefix);

              // Value: Normal, Black
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              if (n.lines.length > 0) {
                doc.text(n.lines[0], noteStartX + keyW, currentNoteY);
                for (let l = 1; l < n.lines.length; l++) {
                  currentNoteY += 5.0;
                  doc.text(n.lines[l], noteStartX + keyW, currentNoteY);
                }
              }
            } else {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(9.5);
              doc.setTextColor(15, 23, 42); // Black
              n.lines.forEach((lStr: string, lIdx: number) => {
                if (lIdx > 0) currentNoteY += 5.0;
                doc.text(`• ${lStr}`, noteStartX, currentNoteY);
              });
            }
            currentNoteY += 5.4;
          });
        }

        // Page Footer
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Docket #${order.orderNumber} • Item ${i + 1} of ${order.items.length} • Page ${
            i + 2
          } of ${1 + order.items.length}`,
          pageWidth / 2,
          pageHeight - 8,
          { align: "center" }
        );
      }

      doc.save(`Bervic_Print_Shop_Docket_${order.orderNumber}.pdf`);
      setSuccessToast("Print Shop Vendor Docket downloaded successfully!");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      console.error("Print Shop PDF generation failed:", err);
      alert(err?.message || "Failed to generate Print Shop PDF");
    } finally {
      setDownloadingPrintShopPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 pt-28 pb-20 max-w-6xl mx-auto w-full px-4 sm:px-6 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-3 border-[#991B1B] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-[#991B1B] uppercase tracking-wider">
            Loading Order #{orderId}...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 pt-28 pb-20 max-w-4xl mx-auto w-full px-4 sm:px-6 text-center space-y-6">
          <div className="p-8 rounded-3xl bg-red-50 border border-red-200 space-y-3">
            <AlertCircle className="w-10 h-10 text-[#991B1B] mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Order Not Found</h2>
            <p className="text-xs text-slate-600">{errorMsg || "Unable to locate the requested print order."}</p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#991B1B] text-white text-xs font-bold shadow-md hover:bg-[#7F1D1D] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin Dashboard</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const mapAddressQuery = encodeURIComponent(
    `${order.deliveryAddress || ""}, ${order.city || ""}, ${order.pincode || ""}`
  );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 max-w-6xl mx-auto w-full px-4 sm:px-6 space-y-6">
        {/* Success Toast */}
        {successToast && (
          <div className="fixed top-24 right-6 z-50 bg-[#991B1B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/20 animate-slide-down">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Back Link & Header Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#991B1B] hover:text-[#7F1D1D] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Admin Hub</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Admin</span>
            <span>/</span>
            <span>Card Print Orders</span>
            <span>/</span>
            <span className="font-mono font-bold text-[#991B1B]">#{order.orderNumber}</span>
          </div>
        </div>

        {/* Top Header Card (Clean White & Red) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono font-extrabold text-xl sm:text-2xl text-[#991B1B]">
                #{order.orderNumber}
              </span>
              <span className="px-3 py-1 rounded-full bg-red-50 text-[#991B1B] text-xs font-extrabold border border-red-200">
                {order.totalCopies} Total Printed Copies
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#991B1B]" />
              <span>
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>

          {/* Action Buttons: Status Selector, Print Shop PDF & Admin PDF */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Button 1: Dedicated Print Shop Vendor Docket (No amount, No status) */}
            <button
              onClick={handleDownloadPrintShopPdf}
              disabled={downloadingPrintShopPdf || downloadingPdf}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 border border-slate-800"
              title="Download print-shop vendor docket (With Bervic logo, customer address, template images & quality checklist - NO amounts or status)"
            >
              {downloadingPrintShopPdf ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : (
                <Printer className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{downloadingPrintShopPdf ? "Generating Press PDF..." : "Send to Print Shop PDF"}</span>
            </button>

            {/* Button 2: Admin Internal Work Order PDF */}
            <button
              onClick={handleDownloadOrderPdf}
              disabled={downloadingPdf || downloadingPrintShopPdf}
              className="px-4 py-2.5 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              title="Download complete administrative work order PDF"
            >
              {downloadingPdf ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{downloadingPdf ? "Generating PDF..." : "Admin Work Order PDF"}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider hidden sm:inline">Status:</span>
              <select
                value={order.status}
                disabled={updatingStatus}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold border ring-1 outline-none cursor-pointer transition-all shadow-xs ${
                  statusColors[order.status] || "bg-white text-slate-800 border-slate-300"
                }`}
              >
                <option value="PENDING">⏳ Pending Review</option>
                <option value="CONFIRMED">✅ Confirmed</option>
                <option value="IN_PRODUCTION">🏭 In Production</option>
                <option value="SHIPPED">🚚 Shipped</option>
                <option value="DELIVERED">🎉 Delivered</option>
                <option value="CANCELLED">❌ Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Left (Customer & Items) | Right (Messaging Thread) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN (7 Cols): Customer Details & Ordered Card Items */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer & Shipping Details (Clean White Table, No Nested Box Clutter) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-extrabold text-[#991B1B] uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#991B1B]" />
                  <span>Customer &amp; Delivery Details</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
                {/* Customer Name */}
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Customer Name</span>
                  <p className="font-bold text-sm text-slate-900">{order.customerName}</p>
                </div>

                {/* Contact Phone */}
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="font-bold text-sm text-[#991B1B] hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>{order.customerPhone || "Not provided"}</span>
                  </a>
                </div>

                {/* Email Address */}
                <div className="space-y-0.5 sm:col-span-2 pt-1 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="font-semibold text-xs text-[#991B1B] hover:underline flex items-center gap-1.5 font-mono"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>{order.customerEmail}</span>
                  </a>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1 sm:col-span-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Shipping / Delivery Address
                    </span>
                    {order.deliveryAddress && (
                      <a
                        href={`https://maps.google.com/?q=${mapAddressQuery}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-[#991B1B] hover:underline flex items-center gap-1"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {order.deliveryAddress || "No physical delivery address specified"}
                    {order.city ? `, ${order.city}` : ""}
                    {order.pincode ? ` - ${order.pincode}` : ""}
                  </p>
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <div className="sm:col-span-2 p-3 bg-red-50/60 rounded-xl border border-red-100 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#991B1B] block">
                      General Order Note:
                    </span>
                    <p className="text-xs text-slate-800 whitespace-pre-wrap font-medium">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Card Ordered Items */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-extrabold text-[#991B1B] uppercase tracking-wider flex items-center gap-2">
                  <Printer className="w-4 h-4 text-[#991B1B]" />
                  <span>Ordered Card Design Items ({order.items.length})</span>
                </h3>
              </div>

              <div className="space-y-4">
                {order.items.map((item, idx) => {
                  let parsedDetails: Record<string, unknown> = {};
                  try {
                    parsedDetails = JSON.parse(item.cardDetailsJson || "{}");
                  } catch {
                    // ignore
                  }

                  const groom = parsedDetails.groom ? String(parsedDetails.groom) : null;
                  const bride = parsedDetails.bride ? String(parsedDetails.bride) : null;
                  const date = parsedDetails.date ? String(parsedDetails.date) : null;
                  const venue = parsedDetails.venue ? String(parsedDetails.venue) : null;

                  return (
                    <div
                      key={item.id}
                      className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 hover:border-red-200 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#991B1B] text-white text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="font-serif font-bold text-base text-slate-900">{item.templateName}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-red-50 text-[#991B1B] text-xs font-extrabold border border-red-200">
                          {item.copies} Copies Requested
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Design Snapshot Preview */}
                        <CardProofCanvas
                          item={item}
                          width={150}
                          height={215}
                          onClick={() => setPreviewModalItem(item)}
                        />

                        {/* Details parsed */}
                        <div className="flex-1 space-y-2.5 text-xs">
                          <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200">
                            {groom && (
                              <p>
                                <strong className="text-slate-500">Couple / Celebrant:</strong>{" "}
                                <span className="font-bold text-slate-900">{groom} {bride ? `& ${bride}` : ""}</span>
                              </p>
                            )}
                            {date && (
                              <p>
                                <strong className="text-slate-500">Event Date:</strong>{" "}
                                <span className="font-medium text-slate-900">{date}</span>
                              </p>
                            )}
                            {venue && (
                              <p>
                                <strong className="text-slate-500">Venue:</strong>{" "}
                                <span className="font-medium text-slate-900">{venue}</span>
                              </p>
                            )}
                          </div>

                          {/* Customer Custom Notes Box */}
                          {item.customNotes && (
                            <div className="bg-red-50/70 border-l-4 border-[#991B1B] p-3.5 rounded-r-xl space-y-2">
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#991B1B] block">
                                Customer&apos;s Custom Notes / Special Requirements:
                              </span>
                              <div className="space-y-1.5 text-xs text-slate-950 font-medium">
                                {item.customNotes
                                  .split(/[|\n]/)
                                  .map((part, pIdx) => {
                                    const trimmed = part.trim();
                                    if (!trimmed) return null;
                                    const colonIdx = trimmed.indexOf(":");
                                    if (colonIdx > 0) {
                                      const k = trimmed.slice(0, colonIdx).trim();
                                      const v = trimmed.slice(colonIdx + 1).trim();
                                      return (
                                        <div key={pIdx} className="flex flex-wrap gap-1.5 items-start">
                                          <strong className="text-slate-950 font-bold shrink-0">• {k}:</strong>
                                          <span className="text-slate-900">{v}</span>
                                        </div>
                                      );
                                    }
                                    return (
                                      <p key={pIdx} className="text-slate-900">
                                        • {trimmed}
                                      </p>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (5 Cols): Customer Messaging Thread */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col h-full min-h-[500px]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#991B1B]" />
                  <h3 className="text-xs font-extrabold text-[#991B1B] uppercase tracking-wider">
                    Customer Message Thread
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#991B1B] border border-red-200 text-[10px] font-mono font-bold">
                  {order.messages.length} on file
                </span>
              </div>

              {/* Message History Container */}
              <div className="flex-1 max-h-[420px] overflow-y-auto space-y-3 p-3.5 bg-slate-50/60 rounded-2xl border border-slate-200 text-xs custom-scrollbar">
                {order.messages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-medium text-xs">No messages exchanged yet.</p>
                    <p className="text-[11px]">Send customer proof approvals or delivery updates below!</p>
                  </div>
                ) : (
                  order.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl shadow-2xs ${
                        m.sender === "ADMIN"
                          ? "bg-red-50/80 text-slate-900 border border-red-200 ml-4"
                          : "bg-white text-slate-900 border border-slate-200 mr-4"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-extrabold mb-1">
                        <span className={m.sender === "ADMIN" ? "text-[#991B1B]" : "text-slate-600"}>
                          {m.sender === "ADMIN" ? "🛡️ Admin Support" : `👤 ${order.customerName.split(" ")[0]}`}
                        </span>
                        <span className="text-slate-400 font-mono">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input & Action */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Write Reply (Automatic email notification to {order.customerEmail}):
                </label>
                <textarea
                  rows={4}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="e.g. Hi! Your custom card proof is ready. Please confirm the venue spelling..."
                  className="w-full p-3.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#991B1B] focus:ring-1 focus:ring-[#991B1B] shadow-2xs"
                />

                <button
                  type="button"
                  disabled={sendingMessage || !messageInput.trim()}
                  onClick={handleSendMessage}
                  className="w-full py-3 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>{sendingMessage ? "Sending & Notifying..." : "Send & Email Customer"}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Modal: Full High-Definition Card Design Proof */}
        {previewModalItem && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-xl w-full flex flex-col items-center gap-4 relative shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setPreviewModalItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                  Customer Card Design Proof
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Template: <strong className="text-[#991B1B]">{previewModalItem.templateName}</strong> &bull; {previewModalItem.copies} Copies
                </p>
              </div>

              {/* Large HD Card Canvas Proof */}
              <div className="flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-gray-200">
                <CardProofCanvas
                  item={previewModalItem}
                  width={340}
                  height={485}
                  showHover={false}
                />
              </div>

              {/* Footer details badge */}
              <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  All typography, custom names, and dates are rendered from the design.
                </span>
                <button
                  onClick={() => setPreviewModalItem(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#991B1B] text-white font-bold text-xs hover:bg-[#7F1D1D] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

