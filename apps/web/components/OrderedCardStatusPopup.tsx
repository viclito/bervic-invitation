"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Package,
  CheckCircle2,
  Send,
  ShoppingBag,
  ExternalLink,
  Clock,
  Printer,
  Truck,
} from "lucide-react";

interface OrderedCardInfo {
  id: string;
  orderNumber: string;
  status: string;
  templateName: string;
  previewImage?: string | null;
  copies?: number;
  totalAmount?: number;
  createdAt?: string;
  templateId?: string;
}

type PopupMode =
  | "EXPLORE_PROMO"    // User has not ordered any invitation cards yet
  | "ORDER_TRACKING"   // User ordered card, but status is not DELIVERED yet (Placed, Confirmed, Printing, Shipped)
  | "REVIEW_PROMPT"    // Order is DELIVERED, user hasn't submitted feedback yet
  | "BUY_NEW_PROMPT";  // Order is DELIVERED and feedback already submitted -> asking to explore/buy new products

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    pillText: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
    pingClass: string;
    subtext: string;
  }
> = {
  PENDING: {
    label: "Order Placed",
    pillText: "Under Review",
    bgClass: "bg-amber-50",
    textClass: "text-amber-900",
    borderClass: "border-amber-200",
    dotClass: "bg-amber-500",
    pingClass: "bg-amber-400",
    subtext: "Design proof under review",
  },
  CONFIRMED: {
    label: "Confirmed",
    pillText: "Proof Approved",
    bgClass: "bg-blue-50",
    textClass: "text-blue-900",
    borderClass: "border-blue-200",
    dotClass: "bg-blue-500",
    pingClass: "bg-blue-400",
    subtext: "Queued for print production",
  },
  IN_PRODUCTION: {
    label: "In Production",
    pillText: "Printing Now 🖨️",
    bgClass: "bg-red-50",
    textClass: "text-[#991B1B]",
    borderClass: "border-red-200",
    dotClass: "bg-[#991B1B]",
    pingClass: "bg-red-400",
    subtext: "Printing & hot foil stamping",
  },
  PROCESSING: {
    label: "In Production",
    pillText: "Printing Now 🖨️",
    bgClass: "bg-red-50",
    textClass: "text-[#991B1B]",
    borderClass: "border-red-200",
    dotClass: "bg-[#991B1B]",
    pingClass: "bg-red-400",
    subtext: "Printing & hot foil stamping",
  },
  SHIPPED: {
    label: "Shipped",
    pillText: "On the Way 🚚",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-900",
    borderClass: "border-emerald-200",
    dotClass: "bg-emerald-500",
    pingClass: "bg-emerald-400",
    subtext: "Dispatched to your doorstep",
  },
  DELIVERED: {
    label: "Delivered",
    pillText: "Delivered 🎉",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-900",
    borderClass: "border-emerald-200",
    dotClass: "bg-emerald-500",
    pingClass: "bg-emerald-400",
    subtext: "Successfully delivered",
  },
};

export default function OrderedCardStatusPopup() {
  const { data: session, status: authStatus } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<OrderedCardInfo | null>(null);
  const [popupMode, setPopupMode] = useState<PopupMode>("EXPLORE_PROMO");
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Review Form States
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);

  // Check if a specific product / order has been reviewed
  const checkReviewStatus = useCallback(
    async (productId?: string, orderId?: string): Promise<boolean> => {
      if (!productId && !orderId) return false;

      // 1. Check local storage cache
      if (typeof window !== "undefined") {
        if (productId && localStorage.getItem(`bervic_reviewed_prod_${productId}`)) {
          return true;
        }
        if (orderId && localStorage.getItem(`bervic_reviewed_ord_${orderId}`)) {
          return true;
        }
      }

      // 2. Query backend if logged in
      if (authStatus === "authenticated" && (session?.user as any)?.id) {
        try {
          const res = await fetch("/api/shop/reviews?checkReviewed=true");
          if (res.ok) {
            const data = await res.json();
            const reviewedProductIds: string[] = data?.reviewedProductIds || [];
            const reviewedOrderIds: string[] = data?.reviewedOrderIds || [];

            if (productId && reviewedProductIds.includes(productId)) {
              if (typeof window !== "undefined") {
                localStorage.setItem(`bervic_reviewed_prod_${productId}`, "true");
              }
              return true;
            }
            if (orderId && reviewedOrderIds.includes(orderId)) {
              if (typeof window !== "undefined") {
                localStorage.setItem(`bervic_reviewed_ord_${orderId}`, "true");
              }
              return true;
            }
          }
        } catch {}
      }

      return false;
    },
    [authStatus, session]
  );

  // Determine user state: No orders vs. Order In Progress vs. Delivered (Needs Review) vs. Delivered & Reviewed
  const syncPopupState = useCallback(async () => {
    try {
      let activeCardOrder: OrderedCardInfo | null = null;

      // 1. Try fetching orders from API if logged in
      if (authStatus === "authenticated" && session?.user) {
        try {
          const res = await fetch("/api/user/orders", {
            headers: { "Cache-Control": "no-cache" },
          });
          if (res.ok) {
            const data = await res.json();
            const ordersList: any[] = data?.orders || [];
            if (ordersList.length > 0) {
              const validOrder =
                ordersList.find((o) => o.status !== "CANCELLED") || ordersList[0];
              if (validOrder) {
                const firstItem = validOrder.items?.[0];
                activeCardOrder = {
                  id: validOrder.id,
                  orderNumber: validOrder.orderNumber,
                  status: (validOrder.status || "PENDING").toUpperCase(),
                  templateName:
                    firstItem?.templateName ||
                    validOrder.notes ||
                    "Traditional Invitation Card",
                  previewImage: firstItem?.previewImage || null,
                  copies: validOrder.totalCopies || firstItem?.copies || 1,
                  totalAmount: validOrder.totalAmount || 0,
                  createdAt: validOrder.createdAt,
                  templateId: firstItem?.templateId || validOrder.id,
                };
              }
            }
          }
        } catch {}
      }

      // 2. Fallback to localStorage recent card order
      if (!activeCardOrder && typeof window !== "undefined") {
        const localRaw = localStorage.getItem("bervic_last_card_order");
        if (localRaw) {
          try {
            const parsed = JSON.parse(localRaw);
            if (parsed && parsed.id && parsed.orderNumber) {
              activeCardOrder = {
                id: parsed.id,
                orderNumber: parsed.orderNumber,
                status: (parsed.status || "PENDING").toUpperCase(),
                templateName: parsed.templateName || "Traditional Invitation Card",
                previewImage: parsed.previewImage || null,
                copies: parsed.copies || 100,
                createdAt: parsed.createdAt,
                templateId: parsed.templateId || parsed.id,
              };
            }
          } catch {}
        }
      }

      // STATE RESOLUTION:
      if (!activeCardOrder) {
        // STATE 1: User has not ordered any invitations
        setOrder(null);
        setPopupMode("EXPLORE_PROMO");

        if (typeof window !== "undefined") {
          const dismissed = sessionStorage.getItem("bervic_dismiss_explore_promo");
          setIsDismissed(dismissed === "true");
        }
      } else {
        setOrder(activeCardOrder);

        // ONLY AFTER DELIVERED STATUS: Review option opens
        const isDelivered = activeCardOrder.status === "DELIVERED";

        if (!isDelivered) {
          // STATE 2A: Order is in progress (PENDING, CONFIRMED, IN_PRODUCTION, SHIPPED) -> Show live tracking
          setPopupMode("ORDER_TRACKING");
          if (typeof window !== "undefined") {
            const dismissed = sessionStorage.getItem(
              `bervic_dismiss_tracking_${activeCardOrder.id}`
            );
            setIsDismissed(dismissed === "true");
          }
        } else {
          // Order IS DELIVERED: Check if review has been submitted
          const hasReviewed = await checkReviewStatus(
            activeCardOrder.templateId,
            activeCardOrder.id
          );

          if (hasReviewed) {
            // STATE 3: Delivered & already reviewed -> Prompt to explore / buy new products
            setPopupMode("BUY_NEW_PROMPT");
            if (typeof window !== "undefined") {
              const dismissed = sessionStorage.getItem("bervic_dismiss_buynew_promo");
              setIsDismissed(dismissed === "true");
            }
          } else {
            // STATE 2B: Delivered & NOT reviewed yet -> Open review / feedback & stars option
            setPopupMode("REVIEW_PROMPT");
            if (typeof window !== "undefined") {
              const dismissed = sessionStorage.getItem(
                `bervic_dismiss_review_${activeCardOrder.id}`
              );
              setIsDismissed(dismissed === "true");
            }
          }
        }
      }
    } catch {
      setOrder(null);
      setPopupMode("EXPLORE_PROMO");
    }
  }, [authStatus, session, checkReviewStatus]);

  useEffect(() => {
    setMounted(true);
    syncPopupState();

    const handleEvent = () => {
      syncPopupState();
    };

    window.addEventListener("bervic_order_updated", handleEvent);
    window.addEventListener("bervic_review_submitted", handleEvent);
    window.addEventListener("storage", handleEvent);

    return () => {
      window.removeEventListener("bervic_order_updated", handleEvent);
      window.removeEventListener("bervic_review_submitted", handleEvent);
      window.removeEventListener("storage", handleEvent);
    };
  }, [syncPopupState]);

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (!reviewText.trim()) {
      alert("Please share a few words about your card quality and design!");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/shop/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: order.templateId || order.id,
          rating,
          reviewText: reviewText.trim(),
          orderId: order.id,
          userName: session?.user?.name || "Verified Buyer",
        }),
      });

      if (res.ok) {
        setReviewSubmittedSuccess(true);

        // Mark as reviewed in localStorage
        if (typeof window !== "undefined") {
          if (order.templateId) {
            localStorage.setItem(`bervic_reviewed_prod_${order.templateId}`, "true");
          }
          localStorage.setItem(`bervic_reviewed_ord_${order.id}`, "true");
        }

        // Notify other components & switch to STATE 3
        window.dispatchEvent(new Event("bervic_review_submitted"));

        setTimeout(() => {
          setPopupMode("BUY_NEW_PROMPT");
          setReviewSubmittedSuccess(false);
        }, 1500);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Do not display if dismissed or unmounted
  if (!mounted || isDismissed) return null;

  // Non-disturbance check: Do not show on admin panels, builder studio, checkout, or auth pages
  const isHiddenRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.includes("/canva-templates/builder") ||
    pathname?.includes("/checkout") ||
    (order && pathname === `/dashboard/orders/${order.id}`);

  if (isHiddenRoute) return null;

  // Handle Close / Dismissal
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      if (popupMode === "EXPLORE_PROMO") {
        sessionStorage.setItem("bervic_dismiss_explore_promo", "true");
      } else if (popupMode === "ORDER_TRACKING" && order?.id) {
        sessionStorage.setItem(`bervic_dismiss_tracking_${order.id}`, "true");
      } else if (popupMode === "REVIEW_PROMPT" && order?.id) {
        sessionStorage.setItem(`bervic_dismiss_review_${order.id}`, "true");
      } else if (popupMode === "BUY_NEW_PROMPT") {
        sessionStorage.setItem("bervic_dismiss_buynew_promo", "true");
      }
    }
  };

  const handleToggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized((prev) => !prev);
  };

  // Active status config for tracking
  const currentStatusKey = (order?.status || "PENDING").toUpperCase();
  const statusInfo = STATUS_CONFIG[currentStatusKey] || STATUS_CONFIG.PENDING;

  // Rating helper labels
  const activeRatingValue = hoverRating || rating;
  const ratingLabels: Record<number, string> = {
    1: "Needs Improvement",
    2: "Fair Quality",
    3: "Good Card",
    4: "Great & Beautiful!",
    5: "Excellent & Loved It! ⭐",
  };

  return (
    <aside
      aria-label="Customer Engagement & Order Status Notification"
      className="fixed bottom-4 left-3 right-3 sm:right-auto sm:left-6 z-40 max-w-sm select-none print:hidden transition-all duration-300"
    >
      {isMinimized ? (
        /* ========================================================= */
        /* Minimized Compact Floating Chip                           */
        /* ========================================================= */
        <div
          onClick={() => setIsMinimized(false)}
          className="flex items-center justify-between gap-2.5 px-3.5 py-2 bg-white/95 backdrop-blur-md border border-amber-300/80 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:scale-[1.02]"
        >
          <div className="flex items-center gap-2 min-w-0">
            {popupMode === "EXPLORE_PROMO" ? (
              <span className="p-1 rounded-full bg-amber-100 text-amber-800">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </span>
            ) : popupMode === "ORDER_TRACKING" ? (
              <span className="relative flex h-2 w-2 shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusInfo.pingClass}`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${statusInfo.dotClass}`}
                />
              </span>
            ) : popupMode === "REVIEW_PROMPT" ? (
              <span className="p-1 rounded-full bg-amber-100 text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              </span>
            ) : (
              <span className="p-1 rounded-full bg-emerald-100 text-emerald-800">
                <ShoppingBag className="w-3.5 h-3.5" />
              </span>
            )}

            <span className="text-[11px] font-extrabold text-slate-800 truncate">
              {popupMode === "EXPLORE_PROMO"
                ? "Physical Cards from ₹10"
                : popupMode === "ORDER_TRACKING"
                ? `${statusInfo.pillText} • ${order?.templateName || "Card"}`
                : popupMode === "REVIEW_PROMPT"
                ? `Review ${order?.templateName || "Card"}`
                : "Explore New Collections"}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleToggleMinimize}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              title="Expand"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-slate-400 hover:text-red-500 rounded-full"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* Full Expanded Card Container                              */
        /* ========================================================= */
        <div className="relative bg-white/98 backdrop-blur-md border border-amber-200/90 rounded-2xl shadow-2xl p-4 transition-all duration-300 overflow-hidden ring-1 ring-black/5 hover:border-amber-300">
          {/* Subtle Top Accent Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A1F2B] via-amber-400 to-[#7A1F2B]" />

          {/* Header Controls (Minimize & Close) */}
          <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5 min-w-0">
              {popupMode === "EXPLORE_PROMO" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Physical Invitation Cards
                </span>
              ) : popupMode === "ORDER_TRACKING" ? (
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusInfo.bgClass} ${statusInfo.textClass} ${statusInfo.borderClass}`}
                >
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusInfo.pingClass}`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusInfo.dotClass}`}
                    />
                  </span>
                  <span>{statusInfo.label}</span>
                </span>
              ) : popupMode === "REVIEW_PROMPT" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Verified Order Review
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Discover More
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleToggleMinimize}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="Minimize popup"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ======================================================= */}
          {/* STATE 1: User has not ordered any invitation card yet   */}
          {/* ======================================================= */}
          {popupMode === "EXPLORE_PROMO" && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
                  <span className="text-2xl">💌</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                    Looking for Physical Printed Cards?
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Order premium custom physical cards with luxury metallic foil & cardstock starting at reasonable prices!
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/shop"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#7A1F2B] to-[#991B1B] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.99] transition-all group"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  <span>Explore Invitation Cards (From ₹10)</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* STATE 2A: Order In Progress (Placed/Printing/Shipped)   */}
          {/* Review option opens only after DELIVERED status        */}
          {/* ======================================================= */}
          {popupMode === "ORDER_TRACKING" && order && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 shadow-2xs">
                  {order.previewImage ? (
                    <img
                      src={order.previewImage}
                      alt={order.templateName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Package className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate leading-tight">
                    {order.templateName}
                  </h4>

                  <p className="text-[10.5px] text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                    <span>{order.copies ? `${order.copies.toLocaleString()} Copies` : "Custom Print"}</span>
                    {order.totalAmount ? (
                      <>
                        <span>•</span>
                        <span className="font-bold text-slate-700">₹{order.totalAmount.toLocaleString()}</span>
                      </>
                    ) : null}
                  </p>

                  <p className="text-[10.5px] font-semibold text-slate-600 mt-1 flex items-center gap-1">
                    <span className="text-[#7A1F2B] font-bold">{statusInfo.pillText}</span>
                    <span>— {statusInfo.subtext}</span>
                  </p>
                </div>
              </div>

              {/* Action Button & Review Note */}
              <div className="space-y-1.5 pt-1">
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-[#7A1F2B] to-[#991B1B] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:brightness-110 active:scale-[0.99] transition-all group"
                >
                  <span>View Ordered Product & Tracking</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <p className="text-[10px] text-center text-slate-400 font-medium">
                  Review & star ratings will unlock once your cards are delivered 🎉
                </p>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* STATE 2B: Order DELIVERED -> Review & Stars Option Open */}
          {/* ======================================================= */}
          {popupMode === "REVIEW_PROMPT" && order && (
            <div className="space-y-3">
              {reviewSubmittedSuccess ? (
                <div className="py-4 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Thank you for your review!</h4>
                  <p className="text-xs text-slate-500">Your feedback has been attached to the product.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-2.5">
                  {/* Product Mini Row */}
                  <div className="flex items-center gap-2.5 p-2 bg-emerald-50/70 rounded-xl border border-emerald-200/70">
                    {order.previewImage ? (
                      <img
                        src={order.previewImage}
                        alt={order.templateName}
                        className="w-10 h-10 rounded-lg object-cover border border-emerald-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wide bg-emerald-100/90 px-1.5 py-0.2 rounded-sm">
                          Delivered 🎉
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-xs truncate mt-0.5">
                        {order.templateName}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">
                        Order #{order.orderNumber} • {order.copies} Copies
                      </p>
                    </div>
                  </div>

                  {/* Interactive Star Rating */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-700">How was your card?</span>
                      <span className="text-[10px] font-extrabold text-amber-700">
                        {ratingLabels[activeRatingValue] || ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 hover:scale-115 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              star <= activeRatingValue
                                ? "fill-amber-400 text-amber-500 drop-shadow-xs"
                                : "text-slate-200 hover:text-amber-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Text Input */}
                  <div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with paper quality, printing & finish..."
                      rows={2}
                      maxLength={500}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-hidden resize-none placeholder:text-slate-400 text-slate-800"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-[#7A1F2B] to-[#991B1B] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60"
                    >
                      {isSubmittingReview ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>Submit Review</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="py-2 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[11px] font-semibold border border-slate-200 shrink-0 transition-colors flex items-center gap-1"
                      title="View Order Details"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ======================================================= */}
          {/* STATE 3: Feedback submitted -> Ask to explore/buy new   */}
          {/* ======================================================= */}
          {popupMode === "BUY_NEW_PROMPT" && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
                  <span className="text-2xl">✨</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                    Ready for Your Next Celebration?
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Thank you for your valuable feedback! Are you willing to explore our new traditional cards & return gift collections?
                  </p>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <Link
                  href="/shop"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#7A1F2B] to-[#991B1B] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.99] transition-all group"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  <span>Discover New Products</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
