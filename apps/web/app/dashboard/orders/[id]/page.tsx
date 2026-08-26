"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Clock,
  Printer,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Loader2,
  Bell,
  ChevronDown,
  ChevronUp,
  Layers,
  Ruler,
  Maximize2,
} from "lucide-react";

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

interface OrderItemData {
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

interface OrderMessageData {
  id: string;
  orderId: string;
  sender: string;
  message: string;
  createdAt: string;
}

interface UserOrderDetail {
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
  items: OrderItemData[];
  messages: OrderMessageData[];
}

const ORDER_STEPS = [
  { key: "PENDING", label: "Order Placed", desc: "Queued for review" },
  { key: "CONFIRMED", label: "Confirmed", desc: "Proof approved" },
  { key: "IN_PRODUCTION", label: "In Production", desc: "Printing & finishes" },
  { key: "SHIPPED", label: "Dispatched", desc: "On the way" },
  { key: "DELIVERED", label: "Delivered", desc: "Arrived at doorstep" },
];

const statusOrderMap: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  IN_PRODUCTION: 2,
  SHIPPED: 3,
  DELIVERED: 4,
};

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

export const ASPECT_RATIOS = [
  { id: "classic", name: "Classic (5:7)", shortName: "Classic", width: 480, height: 672, ratioStr: "5:7" },
  { id: "portrait", name: "Story (9:16)", shortName: "Story", width: 420, height: 746, ratioStr: "9:16" },
  { id: "square", name: "Square (1:1)", shortName: "Square", width: 560, height: 560, ratioStr: "1:1" },
  { id: "landscape", name: "Landscape (7:5)", shortName: "Landscape", width: 672, height: 480, ratioStr: "7:5" },
  { id: "cinematic", name: "Cinematic (16:9)", shortName: "Cinematic", width: 746, height: 420, ratioStr: "16:9" },
  { id: "bookmark", name: "Bookmark (1:2)", shortName: "Bookmark", width: 360, height: 720, ratioStr: "1:2" },
  { id: "a4", name: "A4 Print (1:1.41)", shortName: "A4 Print", width: 480, height: 678, ratioStr: "1:1.41" },
  { id: "custom", name: "Free Size", shortName: "Free Size", width: 480, height: 672, ratioStr: "Custom" },
];

export function getLayerDimensions(
  layer: any,
  baseLayer?: any
): { width: number; height: number; ratioStr: string } {
  const layerRatioObj = ASPECT_RATIOS.find((r) => r.id === layer?.aspectRatio);
  const baseRatioObj = baseLayer
    ? ASPECT_RATIOS.find((r) => r.id === baseLayer.aspectRatio) || ASPECT_RATIOS[0]
    : ASPECT_RATIOS[0];

  const rawBaseH = baseLayer?.customHeight || baseRatioObj.height;
  const rawBaseW = baseLayer?.customWidth || baseRatioObj.width;

  if (layer?.isBase !== false) {
    return {
      width: layer?.customWidth || (layerRatioObj ? layerRatioObj.width : rawBaseW),
      height: layer?.customHeight || (layerRatioObj ? layerRatioObj.height : rawBaseH),
      ratioStr: layerRatioObj ? layerRatioObj.ratioStr : "5:7",
    };
  }

  const heightPct = (layer.heightPercent || 85) / 100;
  const targetH = Math.max(160, Math.round(rawBaseH * heightPct));

  let ratioFraction = 5 / 7;
  if (layerRatioObj && layerRatioObj.id !== "custom") {
    ratioFraction = layerRatioObj.width / layerRatioObj.height;
  } else if (layer.customWidth && layer.customHeight) {
    ratioFraction = layer.customWidth / layer.customHeight;
  } else {
    ratioFraction = rawBaseW / rawBaseH;
  }

  const targetW = Math.max(120, Math.round(targetH * ratioFraction));

  return {
    width: targetW,
    height: targetH,
    ratioStr: layerRatioObj ? layerRatioObj.ratioStr : "Custom",
  };
}

function CardProofCanvas({
  item,
  pageIndex = 0,
  maxWidth = 360,
  maxHeight = 500,
  width,
  height,
  onClick,
  showHover = true,
}: {
  item: OrderItemData;
  pageIndex?: number;
  maxWidth?: number;
  maxHeight?: number;
  width?: number;
  height?: number;
  onClick?: () => void;
  showHover?: boolean;
}) {
  let parsedDetails: Record<string, unknown> = {};
  try {
    if (item.cardDetailsJson) {
      parsedDetails = JSON.parse(item.cardDetailsJson);
    }
  } catch {
    parsedDetails = {};
  }

  const pages = Array.isArray(parsedDetails.pages) ? (parsedDetails.pages as any[]) : [];
  const basePage = pages.find((p) => p.isBase) || pages[0] || null;
  const activePage = pages[pageIndex] || null;

  // Determine true aspect ratio dimensions
  let layerDim = { width: 480, height: 672, ratioStr: "5:7" };
  if (activePage) {
    layerDim = getLayerDimensions(activePage, basePage);
  } else if (parsedDetails.aspectRatio) {
    const rObj = ASPECT_RATIOS.find((r) => r.id === parsedDetails.aspectRatio);
    if (rObj) layerDim = { width: rObj.width, height: rObj.height, ratioStr: rObj.ratioStr };
  }

  // Calculate proportional render dimensions to fit within maxWidth and maxHeight bounds
  const boundW = width || maxWidth;
  const boundH = height || maxHeight;
  const fitScale = Math.min(boundW / layerDim.width, boundH / layerDim.height);
  const renderW = Math.max(100, Math.round(layerDim.width * fitScale));
  const renderH = Math.max(100, Math.round(layerDim.height * fitScale));

  let elements: CanvasElementData[] = [];
  if (activePage && Array.isArray(activePage.elements)) {
    elements = activePage.elements;
  } else {
    try {
      if (item.elementsJson) {
        elements = JSON.parse(item.elementsJson);
      }
    } catch {
      elements = [];
    }
  }

  const bgInfo = activePage
    ? {
        color: (activePage.backgroundColor as string) || "#FFFFFF",
        image: (activePage.backgroundImage as string) || undefined,
        thumbnail: (activePage.backgroundImage as string) || item.previewImage || "/images/canva/template1-thumb.webp",
      }
    : getTemplateBackground(item.templateId, item.templateName, parsedDetails);

  const scale = renderW / 500;
  const hasElements = Array.isArray(elements) && elements.length > 0;
  const hasValidImage = !activePage && typeof item.previewImage === "string" && item.previewImage.trim().length > 5;

  return (
    <div
      onClick={onClick}
      style={{ width: `${renderW}px`, height: `${renderH}px` }}
      className={`relative rounded-2xl overflow-hidden border-2 border-[#D9A441]/40 bg-white shadow-md select-none transition-all ${
        onClick ? "cursor-pointer group hover:border-[#D9A441] hover:shadow-lg" : ""
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
              <div className="relative z-10 space-y-1 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-[#D9A441]/40 shadow-xs max-w-[90%]">
                {parsedDetails.groom ? (
                  <h4 className="font-serif font-bold text-[11px] text-[#7A1F2B]">
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
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 z-30">
          <Eye className="w-5 h-5" />
          <span className="text-[10px] font-bold">Zoom Proof</span>
        </div>
      )}
    </div>
  );
}

export default function UserOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<UserOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewModalItem, setPreviewModalItem] = useState<OrderItemData | null>(null);
  const [previewModalPageIndex, setPreviewModalPageIndex] = useState<number>(0);
  const [previewModalViewMode, setPreviewModalViewMode] = useState<"sheet" | "stack">("sheet");
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/orders/${orderId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load order details");
        setOrder(data.order);
      } catch (err: unknown) {
        setErrorMsg((err as Error)?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 text-slate-500 gap-3 px-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#991B1B]" />
          <p className="text-xs font-medium">Loading your print order details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 pt-32 pb-20 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Order Not Found</h2>
          <p className="text-xs text-slate-600">{errorMsg || "We could not find this order."}</p>
          <Link
            href="/dashboard/orders"
            className="btn-maroon inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Orders</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStepIndex = order.status === "CANCELLED" ? -1 : (statusOrderMap[order.status] ?? 0);
  const totalCopies = order.items.reduce((acc, it) => acc + (it.copies || 0), 0) || order.totalCopies || 1;
  const adminMessagesCount = order.messages ? order.messages.length : 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-16 space-y-6 sm:space-y-8">
        
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 sm:pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/dashboard/orders" className="hover:text-[#991B1B] transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>My Orders</span>
              </Link>
              <span>/</span>
              <span className="text-[#991B1B] font-bold">#{order.orderNumber}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-slate-900 flex flex-wrap items-center gap-2">
              <span>Order Tracking:</span>
              <span className="text-[#991B1B]">#{order.orderNumber}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} • {totalCopies} Physical Invitation Prints
            </p>
          </div>

          {/* Action Buttons: Specialist Updates (Notification) & Design Card */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="btn-maroon relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer flex-1 sm:flex-initial"
              title="View Printing Specialist Updates"
            >
              <Bell className="w-4 h-4 text-amber-300" />
              <span>Specialist Updates</span>
              {adminMessagesCount > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {adminMessagesCount}
                </span>
              )}
            </button>

            <Link
              href="/cards"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs transition-colors shrink-0 shadow-2xs flex-1 sm:flex-initial"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#991B1B]" />
              <span>Design Card</span>
            </Link>
          </div>
        </div>

        {/* 🌟 1. LUXURY COLLAPSIBLE ORDER PROGRESS STEPPER (INITIALLY CLOSED) 🌟 */}
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          <button
            type="button"
            onClick={() => setIsProgressOpen(!isProgressOpen)}
            className="w-full flex items-center justify-between gap-3 text-left cursor-pointer group select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#991B1B] flex items-center justify-center shrink-0 border border-red-200">
                <Clock className="w-4 h-4 text-[#991B1B]" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Live Order Progress
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Current Status: <strong className="text-[#991B1B]">{ORDER_STEPS[currentStepIndex]?.label || order.status}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-50 text-[#991B1B] font-extrabold text-[11px] border border-red-200">
                {isProgressOpen ? "Hide Progress" : "Track Progress"}
              </span>
              <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-red-50 group-hover:text-[#991B1B] transition-colors flex items-center justify-center text-slate-500">
                {isProgressOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </button>

          {/* Collapsible Stepper Body */}
          {isProgressOpen && (
            <div className="pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
              {order.status === "CANCELLED" ? (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>This order has been cancelled. Please contact support if you have any questions.</span>
                </div>
              ) : (
                <>
                  {/* DESKTOP CONNECTED HORIZONTAL STEPPER */}
                  <div className="hidden sm:block pt-3 pb-2">
                    <div className="relative flex items-center justify-between">
                      {/* Background Track Line */}
                      <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200 -z-0" />
                      
                      {/* Active Progress Track Line */}
                      <div
                        className="absolute top-5 left-8 h-0.5 bg-[#991B1B] transition-all duration-500 -z-0"
                        style={{
                          width: `${(Math.max(0, currentStepIndex) / (ORDER_STEPS.length - 1)) * 100}%`,
                        }}
                      />

                      {ORDER_STEPS.map((step, idx) => {
                        const isPassed = currentStepIndex >= idx;
                        const isCurrent = currentStepIndex === idx;

                        return (
                          <div key={step.key} className="flex flex-col items-center text-center space-y-2 z-10 w-24">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                                isPassed
                                  ? "bg-[#991B1B] text-white ring-4 ring-red-100"
                                  : "bg-white text-slate-400 border-2 border-slate-200"
                              } ${isCurrent ? "ring-4 ring-red-200 scale-105" : ""}`}
                            >
                              {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                            </div>

                            <div className="space-y-0.5">
                              <p
                                className={`text-xs font-bold ${
                                  isPassed ? "text-[#991B1B]" : "text-slate-500"
                                }`}
                              >
                                {step.label}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MOBILE CLEAN VERTICAL CONNECTED TIMELINE */}
                  <div className="block sm:hidden space-y-1 pt-2">
                    {ORDER_STEPS.map((step, idx) => {
                      const isPassed = currentStepIndex >= idx;
                      const isCurrent = currentStepIndex === idx;
                      const isLast = idx === ORDER_STEPS.length - 1;

                      return (
                        <div key={step.key} className="flex items-start gap-3 relative">
                          {!isLast && (
                            <div
                              className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] ${
                                currentStepIndex > idx ? "bg-[#991B1B]" : "bg-slate-200"
                              }`}
                            />
                          )}

                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                              isPassed
                                ? "bg-[#991B1B] text-white ring-2 ring-red-100"
                                : "bg-white text-slate-400 border border-slate-200"
                            } ${isCurrent ? "ring-4 ring-red-200" : ""}`}
                          >
                            {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>

                          <div className="flex-1 pb-4 pt-0.5">
                            <div className="flex items-center justify-between">
                              <p className={`text-xs font-bold ${isPassed ? "text-[#991B1B]" : "text-slate-500"}`}>
                                {step.label}
                              </p>
                              {isCurrent && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#991B1B] text-white uppercase tracking-wider">
                                  In Progress
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 🌟 2-COLUMN MAIN CONTENT 🌟 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* LEFT COLUMN (7 Cols on desktop): Ordered Card Items & Shipping */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Card Items Container */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Printer className="w-4 h-4 text-[#991B1B]" />
                  <span>Ordered Card Design Items ({order.items.length})</span>
                </h3>
                <span className="text-xs font-extrabold text-[#991B1B] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  {totalCopies} Total Copies
                </span>
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
                      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#991B1B] text-white text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="font-serif font-bold text-base text-slate-900">{item.templateName}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-red-50 text-[#991B1B] text-xs font-extrabold border border-red-200">
                          {item.copies} Copies
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                        {/* Design Snapshot Preview */}
                        <div className="shrink-0 flex flex-col items-center">
                          <CardProofCanvas
                            item={item}
                            width={150}
                            height={215}
                            onClick={() => setPreviewModalItem(item)}
                          />
                          <span className="text-[10px] text-slate-400 font-semibold mt-1">Tap to Zoom Proof</span>
                        </div>

                        {/* Details parsed */}
                        <div className="flex-1 w-full space-y-3 text-xs">
                          <div className="space-y-1.5 bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100">
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

                          {/* Multi-Layer Stepped Card Specifications */}
                          {Array.isArray(parsedDetails.pages) && (parsedDetails.pages as any[]).length > 1 && (
                            <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#991B1B] flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5" />
                                <span>Multi-Layer Deck Stack ({(parsedDetails.pages as any[]).length} Sheets):</span>
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {(parsedDetails.pages as any[]).map((pg: any, pIdx: number) => {
                                  const pDim = pg.physicalDimensions || {
                                    widthInches: pg.widthInches || "5.00\"",
                                    heightInches: pg.heightInches || `${(((pg.heightPercent || 85) / 100) * 7.0).toFixed(2)}"`,
                                    widthMm: pg.widthMm || "127 mm",
                                    heightMm: pg.heightMm || `${Math.round(((pg.heightPercent || 85) / 100) * 178)} mm`,
                                  };

                                  return (
                                    <div
                                      key={pg.id || pIdx}
                                      onClick={() => {
                                        setPreviewModalItem(item);
                                        setPreviewModalPageIndex(pIdx);
                                        setPreviewModalViewMode("sheet");
                                      }}
                                      className="p-2.5 rounded-xl border border-slate-200 hover:border-[#991B1B] hover:bg-red-50/30 transition-all cursor-pointer flex items-center justify-between gap-2 text-xs group"
                                      title="Click to view full proof of this sheet"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span
                                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                            pg.isBase ? "bg-[#991B1B] text-white" : "bg-slate-200 text-slate-700"
                                          }`}
                                        >
                                          {pIdx + 1}
                                        </span>
                                        <div className="min-w-0">
                                          <p className="font-bold text-slate-900 group-hover:text-[#991B1B] transition-colors truncate">
                                            {pg.title || pg.name || `Sheet ${pIdx + 1}`}
                                          </p>
                                          <p className="text-[10px] font-mono text-slate-500">
                                            {pDim.widthInches} × {pDim.heightInches} ({pDim.widthMm} × {pDim.heightMm})
                                          </p>
                                        </div>
                                      </div>
                                      <span
                                        className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0 ${
                                          pg.isBase ? "bg-red-50 text-[#991B1B] border border-red-200" : "bg-slate-100 text-slate-700"
                                        }`}
                                      >
                                        {pg.isBase ? "Base" : `${pg.heightPercent || 85}%`}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Customer Custom Notes Box */}
                          {item.customNotes && (
                            <div className="bg-red-50/60 border-l-4 border-[#991B1B] p-3 sm:p-3.5 rounded-r-xl space-y-1">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#991B1B] block">
                                Your Custom Notes / Special Requirements:
                              </span>
                              <p className="text-xs text-slate-800 whitespace-pre-wrap font-medium leading-relaxed">
                                {item.customNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery & Shipping Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-4 h-4 text-[#991B1B]" />
                <span>Delivery &amp; Recipient Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Recipient Name</span>
                  <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">WhatsApp / Mobile</span>
                  <p className="font-medium text-slate-900 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.customerPhone}</span>
                  </p>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Shipping Address</span>
                  <p className="font-medium text-slate-900 leading-relaxed">
                    {order.deliveryAddress || "Address not provided"}
                    {order.city ? `, ${order.city}` : ""}
                    {order.pincode ? ` - ${order.pincode}` : ""}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Notification Email</span>
                  <p className="font-medium text-slate-900 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.customerEmail}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Security &amp; Guarantee</span>
                  <p className="font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Quality Inspected by Bervic</span>
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (5 Cols on desktop): Admin Messages & Status Updates Feed */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 flex flex-col h-full min-h-[460px]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#991B1B]" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Printing Team Updates
                  </h3>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-50 text-[#991B1B] border border-red-200">
                  {order.messages ? order.messages.length : 0} {order.messages && order.messages.length === 1 ? "Message" : "Messages"}
                </span>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[480px] p-1 custom-scrollbar">
                {order.messages && order.messages.length > 0 ? (
                  order.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2 animate-in fade-in duration-200"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#991B1B] text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                            B
                          </div>
                          <span className="font-serif font-bold text-xs text-[#991B1B]">
                            {msg.sender === "ADMIN" ? "Bervic Print Specialist" : msg.sender}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })} at{" "}
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-50 text-[#991B1B] border border-red-200 flex items-center justify-center mx-auto">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">No Messages Yet</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Our printing specialists will post updates, proof confirmations, tracking numbers, and parcel dispatch notes here.
                    </p>
                  </div>
                )}
              </div>

              {/* Informational Footer */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p className="flex items-center gap-1 text-slate-700 font-semibold">
                  <Mail className="w-3.5 h-3.5 text-[#991B1B]" />
                  <span>Automatic Email Notifications</span>
                </p>
                <p className="text-[10.5px]">
                  Whenever the status changes or a new note is added, an email is automatically sent to <strong className="text-slate-800">{order.customerEmail}</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 🌟 3. NOTIFICATION & ADMIN MESSAGES MODAL / DRAWER 🌟 */}
        {isNotificationsOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-[2rem] sm:rounded-3xl p-5 sm:p-7 max-w-lg w-full max-h-[85vh] flex flex-col gap-4 relative shadow-2xl border border-slate-200 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-red-50 text-[#991B1B] border border-red-200 flex items-center justify-center font-bold">
                    <Bell className="w-4 h-4 text-[#991B1B]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-slate-900">Printing Specialist Updates</h3>
                    <p className="text-xs text-slate-500">Order #{order.orderNumber}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Content */}
              <div className="flex-1 overflow-y-auto max-h-[55vh] space-y-3 pr-1 custom-scrollbar">
                {order.messages && order.messages.length > 0 ? (
                  order.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#991B1B] text-white flex items-center justify-center text-[10px] font-bold">
                            B
                          </span>
                          <span className="font-serif font-bold text-xs text-[#991B1B]">
                            {msg.sender === "ADMIN" ? "Bervic Print Specialist" : msg.sender}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })} at{" "}
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 space-y-2">
                    <p className="text-xs font-bold text-slate-700">No Messages Yet</p>
                    <p className="text-[11px] text-slate-500">Updates from the printing specialist will show up here.</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Updates sent to: <strong>{order.customerEmail}</strong>
                </span>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="btn-maroon px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Full High-Definition Card Design Proof */}
        {previewModalItem && (() => {
          let modalDetails: Record<string, unknown> = {};
          try {
            modalDetails = JSON.parse(previewModalItem.cardDetailsJson || "{}");
          } catch {}
          const modalPages = Array.isArray(modalDetails.pages) ? (modalDetails.pages as any[]) : [];
          const activePage = modalPages[previewModalPageIndex] || null;
          const pDim = activePage ? (activePage.physicalDimensions || {
            widthInches: activePage.widthInches || (activePage.isBase ? "5.00\"" : "5.00\""),
            heightInches: activePage.heightInches || `${(((activePage.heightPercent || 85) / 100) * 7.0).toFixed(2)}"`,
            widthMm: activePage.widthMm || "127 mm",
            heightMm: activePage.heightMm || `${Math.round(((activePage.heightPercent || 85) / 100) * 178)} mm`,
          }) : null;

          return (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl p-4 sm:p-5 max-w-lg w-full max-h-[92vh] flex flex-col items-center gap-2.5 sm:gap-3 relative shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto custom-scrollbar my-auto">
                <button
                  onClick={() => setPreviewModalItem(null)}
                  className="absolute top-3 right-3 p-1.5 sm:p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer z-10"
                  title="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="text-center space-y-0.5 pt-1">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 leading-tight">
                    Your Customized Card Proof
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Template: <strong className="text-[#991B1B]">{previewModalItem.templateName}</strong> • {previewModalItem.copies} Copies
                  </p>
                </div>

                {/* Multi-Layer Sheet Selector Pills */}
                {modalPages.length > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-red-50/70 border border-red-100 rounded-2xl max-w-full">
                    {modalPages.map((pg, pIdx) => (
                      <button
                        key={pg.id || pIdx}
                        type="button"
                        onClick={() => {
                          setPreviewModalViewMode("sheet");
                          setPreviewModalPageIndex(pIdx);
                        }}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                          previewModalViewMode === "sheet" && previewModalPageIndex === pIdx
                            ? "bg-[#991B1B] text-white shadow-xs"
                            : "bg-white text-slate-700 hover:text-[#991B1B] hover:bg-red-50/50"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] ${
                          previewModalViewMode === "sheet" && previewModalPageIndex === pIdx
                            ? "bg-white text-[#991B1B]"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {pIdx + 1}
                        </span>
                        <span className="truncate max-w-[100px] sm:max-w-[120px]">{pg.title || pg.name || `Sheet ${pIdx + 1}`}</span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setPreviewModalViewMode("stack")}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        previewModalViewMode === "stack"
                          ? "bg-[#991B1B] text-white shadow-xs"
                          : "bg-white text-slate-700 hover:text-[#991B1B] hover:bg-red-50/50"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>2.5D Stack View</span>
                    </button>
                  </div>
                )}

                {/* Large HD Card Canvas Proof or 2.5D Stack */}
                <div className="flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-200 shrink overflow-hidden max-h-[52vh]">
                  {previewModalViewMode === "stack" && modalPages.length > 1 ? (
                    <div className="w-[280px] sm:w-[330px] h-[320px] sm:h-[370px] bg-gradient-to-b from-red-50/30 via-white to-red-50/50 rounded-2xl p-3 flex items-center justify-center relative border border-red-100 shadow-inner overflow-hidden select-none">
                      <div className="absolute inset-0 bg-[radial-gradient(#fecaca_1px,transparent_1px)] [background-size:14px_14px] opacity-60 pointer-events-none" />
                      <div className="relative w-full h-full flex items-end justify-center">
                        {(() => {
                          const baseLayer = modalPages.find((p) => p.isBase) || modalPages[0];
                          const maxHeightPx = 300;
                          const baseH = baseLayer.customHeight || 700;
                          const scaleFactor = maxHeightPx / baseH;

                          const sortedForStack = [...modalPages]
                            .map((p, origIdx) => ({ page: p, origIdx }))
                            .sort((a, b) => {
                              const aPct = a.page.isBase !== false ? 100 : a.page.heightPercent || 85;
                              const bPct = b.page.isBase !== false ? 100 : b.page.heightPercent || 85;
                              return bPct - aPct;
                            });

                          return sortedForStack.map((item, stackPos) => {
                            const { page: p, origIdx } = item;
                            const isSelected = origIdx === previewModalPageIndex;
                            const pct = p.isBase !== false ? 100 : p.heightPercent || 85;
                            const renderW = Math.round((p.customWidth || 500) * scaleFactor);
                            const renderH = Math.round((p.customHeight || baseH * (pct / 100)) * scaleFactor);

                            return (
                              <div
                                key={p.id || origIdx}
                                onClick={() => {
                                  setPreviewModalPageIndex(origIdx);
                                  setPreviewModalViewMode("sheet");
                                }}
                                style={{
                                  width: `${renderW}px`,
                                  height: `${renderH}px`,
                                  zIndex: stackPos + 10,
                                  backgroundColor: p.backgroundColor || "#FFFFFF",
                                  backgroundImage: p.backgroundImage ? `url(${p.backgroundImage})` : undefined,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                                className={`absolute rounded-2xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between p-2.5 border ${
                                  isSelected
                                    ? "ring-2 ring-[#991B1B] border-[#991B1B] shadow-2xl scale-[1.02]"
                                    : "border-slate-300 hover:scale-[1.01]"
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span
                                    className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md truncate max-w-[120px] shadow-2xs ${
                                      isSelected ? "bg-[#991B1B] text-white" : "bg-slate-900/80 text-white backdrop-blur-xs"
                                    }`}
                                  >
                                    {p.title || p.name || `Sheet ${origIdx + 1}`}
                                  </span>
                                  <span className="text-[8.5px] font-mono font-bold bg-white text-slate-800 px-1 py-0.5 rounded border border-slate-200 shadow-2xs">
                                    {pct}%
                                  </span>
                                </div>
                                <div className="flex items-center justify-center w-full">
                                  <span className="text-[8.5px] font-mono font-bold bg-white/90 text-slate-900 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                                    {p.widthInches || "5.00\""} × {p.heightInches || `${((pct / 100) * 7).toFixed(2)}"`}
                                  </span>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  ) : (
                    <CardProofCanvas
                      item={previewModalItem}
                      pageIndex={previewModalPageIndex}
                      maxWidth={320}
                      maxHeight={360}
                      showHover={false}
                    />
                  )}
                </div>

                {/* Active Sheet Dimensions Chip */}
                {pDim && previewModalViewMode === "sheet" && (
                  <div className="px-3 py-1 bg-red-50 border border-red-200 rounded-xl text-[11px] font-mono font-bold text-[#991B1B] flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>
                      {activePage?.title || activePage?.name || `Sheet ${previewModalPageIndex + 1}`}: {pDim.widthInches} × {pDim.heightInches} ({pDim.widthMm} × {pDim.heightMm})
                    </span>
                  </div>
                )}

                {/* Footer details badge */}
                <div className="w-full bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs mt-auto">
                  <span className="text-slate-600 font-medium text-[11px]">
                    {modalPages.length > 1
                      ? `Viewing sheet ${previewModalPageIndex + 1} of ${modalPages.length}`
                      : "HD vector proof prepared for printing."}
                  </span>
                  <button
                    onClick={() => setPreviewModalItem(null)}
                    className="btn-maroon px-3.5 py-1.5 rounded-xl text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Close Proof
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      </main>

      <Footer />
    </div>
  );
}
