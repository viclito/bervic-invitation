"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Package,
  Printer,
  ChevronRight,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  ShoppingBag,
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

interface UserCardOrder {
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

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  PENDING: {
    label: "Order Received",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-300",
    desc: "Your order is received and queued for admin review.",
  },
  CONFIRMED: {
    label: "Confirmed",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-300",
    desc: "Order confirmed! Design proof is prepared for print setup.",
  },
  IN_PRODUCTION: {
    label: "In Production",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-300",
    desc: "Your invitation cards are being printed with luxury finishes.",
  },
  SHIPPED: {
    label: "Dispatched",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-300",
    desc: "Your parcel is on its way to your delivery address.",
  },
  DELIVERED: {
    label: "Delivered",
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-300",
    desc: "Cards delivered successfully. Wishing you a grand celebration!",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-300",
    desc: "This order has been cancelled.",
  },
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

function MiniCardProof({ item, width = 110, height = 155 }: { item: OrderItemData; width?: number; height?: number }) {
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
      style={{ width: `${width}px`, height: `${height}px` }}
      className="relative rounded-xl overflow-hidden border border-[#D9A441]/40 bg-white shadow-xs shrink-0 select-none"
    >
      {hasValidImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.previewImage!} alt={item.templateName || "Card"} className="w-full h-full object-contain p-1" />
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
                    alt="Decor"
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
                      fontSize: `${Math.max(5, (el.fontSize || 16) * scale)}px`,
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
            <div className="w-full h-full relative flex flex-col items-center justify-center p-1.5 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bgInfo.thumbnail} alt="Frame" className="absolute inset-0 w-full h-full object-cover opacity-80" />
              {parsedDetails.groom ? (
                <div className="relative z-10 bg-white/80 backdrop-blur-xs px-1.5 py-1 rounded-md border border-[#D9A441]/40">
                  <p className="font-serif font-bold text-[9px] text-[#7A1F2B] truncate max-w-[90px]">
                    {String(parsedDetails.groom)}
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function UserOrdersPage() {
  const { status } = useSession();
  const [orders, setOrders] = useState<UserCardOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (status === "unauthenticated") {
      return;
    }

    async function fetchOrders() {
      try {
        const res = await fetch("/api/user/orders");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load orders");
        if (isMounted) {
          setOrders(data.orders || []);
          setErrorMsg("");
        }
      } catch (err: unknown) {
        if (isMounted) {
          setErrorMsg((err as Error)?.message || "Failed to load orders.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (status === "authenticated") {
      fetchOrders();
    }

    return () => {
      isMounted = false;
    };
  }, [status]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-16 space-y-6 sm:space-y-8">
        
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 sm:pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/dashboard" className="hover:text-[#991B1B] transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span>/</span>
              <span className="text-[#991B1B] font-bold">Print Orders</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-slate-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#991B1B] flex items-center justify-center border border-red-200">
                <Package className="w-5 h-5 text-[#991B1B]" />
              </div>
              <span>My Card Print Orders</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Track live production status, view customized card proofs, and read messages from the printing team.
            </p>
          </div>

          <Link
            href="/cards"
            className="btn-maroon inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs hover:shadow-md shrink-0 cursor-pointer w-full sm:w-auto text-white"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Design New Card</span>
          </Link>
        </div>

        {/* Auth Required State */}
        {status === "unauthenticated" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#991B1B] border border-red-200 flex items-center justify-center mx-auto">
              <Package className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-serif font-bold text-slate-900">Sign in to View Your Orders</h2>
            <p className="text-xs text-slate-600">
              Please log in with the account you used when placing your card print order.
            </p>
            <Link
              href="/auth/login?callbackUrl=/dashboard/orders"
              className="btn-maroon inline-block px-6 py-2.5 rounded-2xl text-white text-xs font-bold transition-all shadow-xs"
            >
              Sign In Now
            </Link>
          </div>
        )}

        {/* Loading State */}
        {loading && status !== "unauthenticated" && (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#991B1B]" />
            <p className="text-xs font-medium">Loading your card orders...</p>
          </div>
        )}

        {/* Error State */}
        {errorMsg && !loading && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && status === "authenticated" && (
          <div className="bg-white border-2 border-dashed border-red-200 rounded-3xl p-8 sm:p-14 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#991B1B] border border-red-200 flex items-center justify-center mx-auto shadow-2xs">
              <ShoppingBag className="w-8 h-8 text-[#991B1B]" />
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">No Print Orders Placed Yet</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You haven&apos;t placed any card print orders yet. Customize any invitation template in the Card Studio and order physical copies directly to your doorstep.
            </p>
            <div className="pt-2">
              <Link
                href="/cards"
                className="btn-maroon inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-xs font-bold transition-all shadow-xs hover:shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Explore &amp; Order Cards</span>
              </Link>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
              <span>Total Orders Placed: <strong className="text-slate-900">{orders.length}</strong></span>
              <span className="text-slate-400">Click any order to track live printing &amp; messages</span>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {orders.map((order) => {
                const conf = statusConfig[order.status] || statusConfig.PENDING;
                const totalCopies = order.items.reduce((acc, it) => acc + (it.copies || 0), 0) || order.totalCopies || 1;
                const adminMessagesCount = order.messages ? order.messages.length : 0;
                const primaryItem = order.items[0];

                return (
                  <Link
                    key={order.id}
                    href={`/dashboard/orders/${order.id}`}
                    className="block bg-white rounded-3xl border border-slate-200/90 hover:border-red-300 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    {/* Top Order Status & Number Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#991B1B]">
                            #{order.orderNumber}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          Recipient: <strong className="text-slate-900">{order.customerName}</strong>
                          {order.city ? ` • ${order.city}` : ""}
                        </p>
                      </div>

                      {/* Status Pill Badge */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span
                          className={`px-3.5 py-1.5 rounded-full border text-xs font-extrabold flex items-center gap-1.5 ${conf.bg} ${conf.text} ${conf.border}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                          <span>{conf.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* Order Body Details */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                      <div className="flex items-center gap-4">
                        {/* Mini Card Preview */}
                        {primaryItem && <MiniCardProof item={primaryItem} width={80} height={115} />}

                        <div className="space-y-2">
                          <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#991B1B] transition-colors">
                            {primaryItem?.templateName || "Custom Invitation Card"}
                            {order.items.length > 1 && (
                              <span className="text-xs font-normal text-slate-500 ml-1.5">
                                (+{order.items.length - 1} more)
                              </span>
                            )}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 font-medium">
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                              <Printer className="w-3.5 h-3.5 text-[#991B1B]" />
                              <strong>{totalCopies}</strong> Copies Requested
                            </span>

                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                              <Layers className="w-3.5 h-3.5 text-slate-500" />
                              {order.items.length} {order.items.length === 1 ? "Design Item" : "Design Items"}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-1">
                            {conf.desc}
                          </p>
                        </div>
                      </div>

                      {/* Right Action & Admin Messages Counter */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {adminMessagesCount > 0 ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#991B1B] text-xs font-bold border border-red-200">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{adminMessagesCount} Admin {adminMessagesCount === 1 ? "Update" : "Updates"}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">No messages yet</span>
                        )}

                        <div className="flex items-center gap-1 text-xs font-bold text-[#991B1B] group-hover:translate-x-1 transition-transform">
                          <span>Track Order &amp; Proof</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
