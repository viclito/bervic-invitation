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

function CardProofCanvas({
  item,
  width = 160,
  height = 225,
  onClick,
  showHover = true,
}: {
  item: OrderItemData;
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
            backgroundColor: bgInfo.color,
            backgroundImage: bgInfo.image ? `url(${bgInfo.image})` : undefined,
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
        {previewModalItem && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-xl w-full flex flex-col items-center gap-4 relative shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setPreviewModalItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                  Your Customized Card Proof
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Template: <strong className="text-[#991B1B]">{previewModalItem.templateName}</strong> • {previewModalItem.copies} Copies
                </p>
              </div>

              {/* Large HD Card Canvas Proof */}
              <div className="flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-200">
                <CardProofCanvas
                  item={previewModalItem}
                  width={340}
                  height={485}
                  showHover={false}
                />
              </div>

              {/* Footer details badge */}
              <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  High-definition vector proof prepared for printing.
                </span>
                <button
                  onClick={() => setPreviewModalItem(null)}
                  className="btn-maroon px-4 py-1.5 rounded-xl text-white font-bold text-xs shadow-xs"
                >
                  Close Proof
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
