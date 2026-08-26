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
  Layers,
  Ruler,
  Pencil,
  Palette,
  Save,
  Sliders,
  Loader2,
  Package,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import { CARD_PRICING_TIERS, calculateTieredCardPrice } from "@/lib/pricing";

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
  item: AdminOrderItem;
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

  // Calculate proportional render dimensions to fit within bounds
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

async function renderOrderItemToDataUrl(
  item: AdminOrderItem,
  pageIndex = 0
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  if (typeof window === "undefined") return null;

  try {
    let parsedDetails: Record<string, any> = {};
    try {
      if (item.cardDetailsJson) parsedDetails = JSON.parse(item.cardDetailsJson);
    } catch {}

    const pages = Array.isArray(parsedDetails.pages) ? (parsedDetails.pages as any[]) : [];
    const basePage = pages.find((p) => p.isBase) || pages[0] || null;
    const activePage = pages[pageIndex] || null;

    let elements: CanvasElementData[] = [];
    if (activePage && Array.isArray(activePage.elements)) {
      elements = activePage.elements;
    } else {
      try {
        if (item.elementsJson) elements = JSON.parse(item.elementsJson);
      } catch {}
    }

    const layerDim = activePage ? getLayerDimensions(activePage, basePage) : { width: 480, height: 672, ratioStr: "5:7" };
    const canvasW = 1000;
    const canvasH = Math.max(200, Math.round(1000 * (layerDim.height / layerDim.width)));

    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const bgInfo = activePage
      ? {
          color: (activePage.backgroundColor as string) || "#FFFFFF",
          image: (activePage.backgroundImage as string) || undefined,
        }
      : getTemplateBackground(item.templateId, item.templateName, parsedDetails);

    // 1. Draw Background Color
    ctx.fillStyle = bgInfo.color && bgInfo.color.startsWith("#") ? bgInfo.color : "#FFFFFF";
    ctx.fillRect(0, 0, canvasW, canvasH);

    const loadImg = (src: string): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src.startsWith("http") || src.startsWith("data:")
          ? src
          : `${typeof window !== "undefined" ? window.location.origin : ""}${src.startsWith("/") ? "" : "/"}${src}`;
      });
    };

    // 2. Draw Background Image if present
    const bgUrl = bgInfo.image || (typeof item.previewImage === "string" && !activePage && !elements.length ? item.previewImage : undefined);
    if (bgUrl) {
      const bgImg = await loadImg(bgUrl);
      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, canvasW, canvasH);
      }
    }

    // 3. Draw All Elements (Images & Text)
    if (Array.isArray(elements) && elements.length > 0) {
      const sortedElements = [...elements].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));

      for (const el of sortedElements) {
        if (el.type === "image" && el.src) {
          const elImg = await loadImg(el.src);
          if (elImg) {
            const elX = (el.x / 100) * canvasW;
            const elY = (el.y / 100) * canvasH;
            const elW = (el.width / 100) * canvasW;
            const elH = el.height ? (el.height / 100) * canvasH : (elW * elImg.naturalHeight) / elImg.naturalWidth;

            ctx.save();
            if (el.opacity !== undefined) ctx.globalAlpha = el.opacity;
            if (el.rotation) {
              ctx.translate(elX + elW / 2, elY + elH / 2);
              ctx.rotate((el.rotation * Math.PI) / 180);
              ctx.drawImage(elImg, -elW / 2, -elH / 2, elW, elH);
            } else {
              ctx.drawImage(elImg, elX, elY, elW, elH);
            }
            ctx.restore();
          }
        } else if (el.type === "text" && el.text) {
          const elX = (el.x / 100) * canvasW;
          const elY = (el.y / 100) * canvasH;
          const elW = (el.width / 100) * canvasW;
          const fontScale = canvasW / 500;
          const fontSize = Math.max(12, Math.round((el.fontSize || 16) * fontScale));
          const fontWeight = el.fontWeight || "normal";
          const fontStyle = el.fontStyle || "normal";
          const fontFamily = el.fontFamily || "Cinzel, serif";

          ctx.save();
          if (el.opacity !== undefined) ctx.globalAlpha = el.opacity;
          ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
          ctx.fillStyle = el.color || "#1E293B";
          ctx.textBaseline = "top";

          let textX = elX;
          if (el.textAlign === "center") {
            ctx.textAlign = "center";
            textX = elX + elW / 2;
          } else if (el.textAlign === "right") {
            ctx.textAlign = "right";
            textX = elX + elW;
          } else {
            ctx.textAlign = "left";
          }

          if (el.rotation) {
            ctx.translate(elX + elW / 2, elY);
            ctx.rotate((el.rotation * Math.PI) / 180);
            ctx.fillText(el.text, 0, 0);
          } else {
            const lines = String(el.text).split("\n");
            const lineHeight = fontSize * (el.lineHeight || 1.25);
            lines.forEach((line, lIdx) => {
              ctx.fillText(line, textX, elY + lIdx * lineHeight);
            });
          }
          ctx.restore();
        }
      }
    } else if (typeof item.previewImage === "string" && item.previewImage.trim().length > 5) {
      const pImg = await loadImg(item.previewImage);
      if (pImg) {
        ctx.drawImage(pImg, 0, 0, canvasW, canvasH);
      }
    }

    const dataUrl = canvas.toDataURL("image/png", 0.95);
    return { dataUrl, width: canvasW, height: canvasH };
  } catch (err) {
    console.error("renderOrderItemToDataUrl error:", err);
    return null;
  }
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
  const [previewModalPageIndex, setPreviewModalPageIndex] = useState<number>(0);
  const [previewModalViewMode, setPreviewModalViewMode] = useState<"sheet" | "stack">("sheet");

  // Admin Item Edit Multi-Step Modal State
  const [editingItem, setEditingItem] = useState<AdminOrderItem | null>(null);
  const [editStep, setEditStep] = useState<number>(1);
  const [savingEditItem, setSavingEditItem] = useState(false);
  const [editForm, setEditForm] = useState<{
    copies: number;
    paperType: string;
    customNotes: string;
    specialInstructions: string;
    brideName: string;
    brideQualification: string;
    brideParents: string;
    brideAddress: string;
    groomName: string;
    groomQualification: string;
    groomParents: string;
    groomAddress: string;
    eventDate: string;
    eventTime: string;
    venues: Array<{ name: string; address: string; functionType: string; time?: string }>;
    rsvpContact: string;
    deliveryName: string;
    deliveryPhone: string;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryPincode: string;
  }>({
    copies: 100,
    paperType: "250 GSM Textured Metallic Gold",
    customNotes: "",
    specialInstructions: "",
    brideName: "",
    brideQualification: "",
    brideParents: "",
    brideAddress: "",
    groomName: "",
    groomQualification: "",
    groomParents: "",
    groomAddress: "",
    eventDate: "",
    eventTime: "",
    venues: [{ name: "", address: "", functionType: "Wedding & Reception", time: "" }],
    rsvpContact: "",
    deliveryName: "",
    deliveryPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPincode: "",
  });

  const [settingPriceItemId, setSettingPriceItemId] = useState<string | null>(null);
  const [itemBasePriceInput, setItemBasePriceInput] = useState<Record<string, number>>({});
  const [itemDirectPriceInput, setItemDirectPriceInput] = useState<Record<string, number>>({});
  const [updatingItemPriceId, setUpdatingItemPriceId] = useState<string | null>(null);

  const handleSetItemPrice = async (itemId: string, unitPrice: number) => {
    if (!order) return;
    setUpdatingItemPriceId(itemId);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set_price",
          itemId,
          price: Math.round(unitPrice),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update item price");
      setOrder(data.order);
      setSettingPriceItemId(null);
      setSuccessToast(`Item unit price set to ₹${Math.round(unitPrice)} and order total updated successfully!`);
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: unknown) {
      alert((err as Error)?.message || "Failed to update item price");
    } finally {
      setUpdatingItemPriceId(null);
    }
  };

  const handleSaveEditItem = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!order || !editingItem) return;
    setSavingEditItem(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let existingDetails: any = {};
      try {
        existingDetails = JSON.parse(editingItem.cardDetailsJson || "{}");
      } catch {}

      const cleanVenues = editForm.venues.filter((v) => v.name.trim() || v.address.trim());
      const primaryV = cleanVenues[0] || { name: "", address: "", functionType: "Wedding & Reception", time: "" };

      const updatedDetails = {
        ...existingDetails,
        groom: editForm.groomName.trim(),
        groomName: editForm.groomName.trim(),
        groomQualification: editForm.groomQualification.trim(),
        groomParents: editForm.groomParents.trim(),
        groomAddress: editForm.groomAddress.trim(),

        bride: editForm.brideName.trim(),
        brideName: editForm.brideName.trim(),
        brideQualification: editForm.brideQualification.trim(),
        brideParents: editForm.brideParents.trim(),
        brideAddress: editForm.brideAddress.trim(),

        date: editForm.eventDate.trim(),
        eventDate: editForm.eventDate.trim(),
        time: editForm.eventTime.trim(),
        eventTime: editForm.eventTime.trim(),

        venues: cleanVenues.length > 0 ? cleanVenues : [primaryV],
        primaryVenue: primaryV.name.trim(),
        venue: primaryV.name.trim(),

        rsvpContact: editForm.rsvpContact.trim(),
        paperType: editForm.paperType.trim(),
        specialInstructions: editForm.specialInstructions.trim(),

        deliveryName: editForm.deliveryName.trim(),
        deliveryPhone: editForm.deliveryPhone.trim(),
        deliveryAddress: editForm.deliveryAddress.trim(),
        deliveryCity: editForm.deliveryCity.trim(),
        deliveryPincode: editForm.deliveryPincode.trim(),
      };

      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_item",
          itemId: editingItem.id,
          copies: Number(editForm.copies) || 1,
          cardDetails: updatedDetails,
          customNotes: editForm.customNotes.trim(),
          customerName: editForm.deliveryName.trim(),
          customerPhone: editForm.deliveryPhone.trim(),
          deliveryAddress: editForm.deliveryAddress.trim(),
          city: editForm.deliveryCity.trim(),
          pincode: editForm.deliveryPincode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update item details");

      setOrder(data.order);
      setEditingItem(null);
      setSuccessToast("All order details and print specifications updated successfully!");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: unknown) {
      alert((err as Error)?.message || "Failed to update item details");
    } finally {
      setSavingEditItem(false);
    }
  };

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

      // Pre-load / render high-resolution canvases for all order items in parallel
      const loadedItemImages = await Promise.all(
        order.items.map(async (item) => {
          const rendered = await renderOrderItemToDataUrl(item, 0);
          if (rendered && rendered.dataUrl) return rendered;

          let details: any = {};
          try {
            details = JSON.parse(item.cardDetailsJson || "{}");
          } catch {}
          const bgInfo = getTemplateBackground(item.templateId, item.templateName, details);
          const candidateUrl =
            (item.previewImage && item.previewImage.trim()) ||
            (details.previewImage && String(details.previewImage).trim()) ||
            (details.image && String(details.image).trim()) ||
            (bgInfo.thumbnail && bgInfo.thumbnail.trim()) ||
            (bgInfo.image && bgInfo.image.trim()) ||
            "/images/canva/template1-thumb.webp";

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

        const bride = String(details.brideName || details.bride || "").trim();
        const groom = String(details.groomName || details.groom || "").trim();
        const brideQual = String(details.brideQualification || "").trim();
        const groomQual = String(details.groomQualification || "").trim();
        const groomDisplay = groom ? `${groom}${groomQual ? ` (${groomQual})` : ""}` : "";
        const brideDisplay = bride ? `${bride}${brideQual ? ` (${brideQual})` : ""}` : "";
        const coupleName = groomDisplay
          ? `${groomDisplay}${brideDisplay ? ` & ${brideDisplay}` : ""}`
          : (brideDisplay ? brideDisplay : (details.coupleNames || "N/A"));
        const eventDate = String(details.eventDate || details.date || "N/A");

        doc.setFont("helvetica", "normal");
        doc.text(doc.splitTextToSize(coupleName, 42)[0] || "N/A", margin + 65, currentY + 7.5);
        doc.text(doc.splitTextToSize(eventDate, 35)[0] || "N/A", margin + 110, currentY + 7.5);

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
        let details: any = {};
        try {
          details = JSON.parse(item.cardDetailsJson || "{}");
        } catch {}

        const pages = Array.isArray(details.pages) ? (details.pages as any[]) : [];
        const sheetsToRender = pages.length > 0 ? pages : [null];

        for (let sIdx = 0; sIdx < sheetsToRender.length; sIdx++) {
          const activePage = sheetsToRender[sIdx];
          const sheetTitle = activePage ? (activePage.title || activePage.name || `Sheet ${sIdx + 1}`) : item.templateName;
          const pDim = activePage ? (activePage.physicalDimensions || {
            widthInches: activePage.widthInches || (activePage.isBase ? "5.00\"" : "5.00\""),
            heightInches: activePage.heightInches || `${(((activePage.heightPercent || 85) / 100) * 7.0).toFixed(2)}"`,
            widthMm: activePage.widthMm || "127 mm",
            heightMm: activePage.heightMm || `${Math.round(((activePage.heightPercent || 85) / 100) * 178)} mm`,
          }) : null;

          const sheetImg = sIdx === 0 && loadedItemImages[i] ? loadedItemImages[i] : await renderOrderItemToDataUrl(item, sIdx);
          doc.addPage();

          // Page Header Strip
          doc.setFillColor(153, 27, 27);
          doc.rect(0, 0, pageWidth, 20, "F");

          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(11);
          const headerTitle = pages.length > 1
            ? `DESIGN SPEC #${i + 1} (SHEET ${sIdx + 1}/${pages.length}: ${sheetTitle.toUpperCase()})`
            : `DESIGN SPECIFICATION #${i + 1}: ${item.templateName.toUpperCase()}`;
          doc.text(headerTitle, margin, 13);

          doc.setFontSize(9);
          doc.text(`Run: ${item.copies} Copies`, pageWidth - margin, 13, { align: "right" });

          // ── Extract All Customer Inputs ──
          const bride = String(details.brideName || details.bride || "").trim();
          const groom = String(details.groomName || details.groom || "").trim();
          const brideQual = String(details.brideQualification || "").trim();
          const groomQual = String(details.groomQualification || "").trim();
          const brideParents = String(details.brideParents || "").trim();
          const groomParents = String(details.groomParents || "").trim();
          const brideAddress = String(details.brideAddress || "").trim();
          const groomAddress = String(details.groomAddress || "").trim();

          const groomDisplay = groom ? `${groom}${groomQual ? ` (${groomQual})` : ""}` : "";
          const brideDisplay = bride ? `${bride}${brideQual ? ` (${brideQual})` : ""}` : "";
          const coupleName = groomDisplay
            ? `${groomDisplay}${brideDisplay ? ` & ${brideDisplay}` : ""}`
            : (brideDisplay ? brideDisplay : (details.coupleNames || item.templateName));

          const eventDate = String(details.eventDate || details.date || "N/A");
          const eventTime = String(details.eventTime || details.time || "");
          const eventVenue = String(details.primaryVenue || details.venue || (Array.isArray(details.venues) && details.venues[0]?.name ? details.venues[0].name : ""));
          const paperType = String(details.paperType || "250 GSM Textured Metallic Gold");
          const rsvpContact = String(details.rsvpContact || details.rsvp || (order.customerPhone ? order.customerPhone : ""));

          // Card Container Viewport
          const cardBoxW = 115;
          const cardBoxH = 120;
          const cardBoxX = (pageWidth - cardBoxW) / 2;
          const cardBoxY = 25;

          if (sheetImg && sheetImg.dataUrl) {
            const imgAspect = sheetImg.width / sheetImg.height;
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

            const format = sheetImg.dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
            doc.addImage(sheetImg.dataUrl, format, drawX, drawY, drawW, drawH, undefined, "FAST");
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
          const notesRaw = [
            item.customNotes,
            details.specialInstructions ? `Special Instructions: ${details.specialInstructions}` : "",
          ].filter(Boolean).join("\n");

          const parts = notesRaw
            .split(/[|\n]/)
            .map((p) => p.trim())
            .filter(Boolean);

          if (groomParents || groomAddress) {
            const groomFamilyInfo = [groomParents ? `Parents: ${groomParents}` : "", groomAddress ? `Native: ${groomAddress}` : ""].filter(Boolean).join(" • ");
            parts.push(`Groom's Family: ${groomFamilyInfo}`);
          }

          if (brideParents || brideAddress) {
            const brideFamilyInfo = [brideParents ? `Parents: ${brideParents}` : "", brideAddress ? `Native: ${brideAddress}` : ""].filter(Boolean).join(" • ");
            parts.push(`Bride's Family: ${brideFamilyInfo}`);
          }

          if (Array.isArray(details.venues) && details.venues.length > 0) {
            details.venues.forEach((v: any, vIdx: number) => {
              if (v.name || v.address) {
                const vDetails = [v.name, v.address, v.time].filter(Boolean).join(", ");
                parts.push(`Venue #${vIdx + 1} (${v.functionType || (vIdx === 0 ? "Primary Function" : `Function ${vIdx + 1}`)}): ${vDetails}`);
              }
            });
          }

          const parsedNotesList = parts.map((part) => {
            const colonIdx = part.indexOf(":");
            if (colonIdx > 0) {
              const key = part.slice(0, colonIdx).trim();
              const val = part.slice(colonIdx + 1).trim();
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8.5);
              const keyW = doc.getTextWidth(`• ${key}: `);
              doc.setFont("helvetica", "normal");
              const remainingW = Math.max(50, contentWidth - 18 - keyW);
              const valLines = doc.splitTextToSize(val, remainingW);
              return { key, val, lines: valLines };
            }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            return { key: "", val: part, lines: doc.splitTextToSize(part, contentWidth - 18) };
          });

          let noteLinesTotalCount = 0;
          parsedNotesList.forEach((n) => {
            noteLinesTotalCount += Math.max(1, n.lines.length);
          });

          const noteBoxHeight = (sIdx === 0 && parsedNotesList.length > 0) ? 8 + noteLinesTotalCount * 4.8 + parsedNotesList.length * 0.8 : 0;
          const specBoxHeight = 42 + noteBoxHeight;

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
          let lineY = specY + 12.5;

          // Row 1: Template/Sheet + Print Run
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(30, 41, 59);
          doc.text("Template / Sheet:", specCol1X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          const fullSheetLabel = pages.length > 1 ? `${item.templateName} (${sheetTitle})` : item.templateName;
          doc.text(doc.splitTextToSize(fullSheetLabel, 55)[0] || fullSheetLabel, specCol1X + 28, lineY);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Print Run (Copies):", specCol2X, lineY);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(153, 27, 27);
          doc.text(`${item.copies} Units / Copies`, specCol2X + 28, lineY);

          // Row 2: Cutting Dimensions + Stock
          lineY += 6.0;
          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Cutting Dimensions:", specCol1X, lineY);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(153, 27, 27);
          const dimLabel = pDim ? `${pDim.widthInches} × ${pDim.heightInches} (${pDim.widthMm} × ${pDim.heightMm})` : "5.00 x 7.00 in (127 x 178 mm)";
          doc.text(dimLabel, specCol1X + 31, lineY);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Stock / Paper Type:", specCol2X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          doc.text(doc.splitTextToSize(paperType, 55)[0] || paperType, specCol2X + 28, lineY);

          // Row 3: Couple + Date
          lineY += 6.0;
          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Celebrant / Couple:", specCol1X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          doc.text(doc.splitTextToSize(coupleName, 55)[0] || "N/A", specCol1X + 28, lineY);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Event Date & Time:", specCol2X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          const dateTimeStr = eventTime ? `${eventDate} at ${eventTime}` : eventDate;
          doc.text(doc.splitTextToSize(dateTimeStr, 55)[0] || dateTimeStr, specCol2X + 28, lineY);

          // Row 4: Primary Venue + RSVP
          lineY += 6.0;
          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Primary Venue:", specCol1X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          doc.text(doc.splitTextToSize(eventVenue || "Venue details on design", 55)[0] || "Venue details on design", specCol1X + 28, lineY);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("RSVP / Contact:", specCol2X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          doc.text(doc.splitTextToSize(rsvpContact || "N/A", 55)[0] || "N/A", specCol2X + 28, lineY);

          // Custom Notes Section (on sheet 1)
          if (sIdx === 0 && parsedNotesList.length > 0) {
            lineY += 6.5;
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(203, 213, 225);
            doc.roundedRect(margin + 3, lineY, contentWidth - 6, noteBoxHeight, 1.5, 1.5, "FD");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(153, 27, 27);
            doc.text("Special Requirements / Customer Notes:", margin + 6, lineY + 5.0);

            let currentNoteY = lineY + 10;
            const noteStartX = margin + 6;

            parsedNotesList.forEach((n) => {
              if (n.key) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(8.5);
                doc.setTextColor(15, 23, 42); // Black
                const keyPrefix = `• ${n.key}: `;
                doc.text(keyPrefix, noteStartX, currentNoteY);
                const keyW = doc.getTextWidth(keyPrefix);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(8.5);
                doc.setTextColor(15, 23, 42); // Black
                if (n.lines.length > 0) {
                  doc.text(n.lines[0], noteStartX + keyW, currentNoteY);
                  for (let l = 1; l < n.lines.length; l++) {
                    currentNoteY += 4.6;
                    doc.text(n.lines[l], noteStartX + keyW, currentNoteY);
                  }
                }
              } else {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8.5);
                doc.setTextColor(15, 23, 42); // Black
                n.lines.forEach((lStr: string, lIdx: number) => {
                  if (lIdx > 0) currentNoteY += 4.6;
                  doc.text(`• ${lStr}`, noteStartX, currentNoteY);
                });
              }
              currentNoteY += 4.8;
            });
          }

          // Page Footer
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(
            `Order #${order.orderNumber} • Item ${i + 1} (Sheet ${sIdx + 1}/${sheetsToRender.length})`,
            pageWidth / 2,
            pageHeight - 8,
            { align: "center" }
          );
        }
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
          const rendered = await renderOrderItemToDataUrl(item, 0);
          if (rendered && rendered.dataUrl) return rendered;

          let details: any = {};
          try {
            details = JSON.parse(item.cardDetailsJson || "{}");
          } catch {}
          const bgInfo = getTemplateBackground(item.templateId, item.templateName, details);
          const candidateUrl =
            (item.previewImage && item.previewImage.trim()) ||
            (details.previewImage && String(details.previewImage).trim()) ||
            (details.image && String(details.image).trim()) ||
            (bgInfo.thumbnail && bgInfo.thumbnail.trim()) ||
            (bgInfo.image && bgInfo.image.trim()) ||
            "/images/canva/template1-thumb.webp";

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

        const bride = String(details.brideName || details.bride || "").trim();
        const groom = String(details.groomName || details.groom || "").trim();
        const brideQual = String(details.brideQualification || "").trim();
        const groomQual = String(details.groomQualification || "").trim();
        const groomDisplay = groom ? `${groom}${groomQual ? ` (${groomQual})` : ""}` : "";
        const brideDisplay = bride ? `${bride}${brideQual ? ` (${brideQual})` : ""}` : "";
        const coupleName = groomDisplay
          ? `${groomDisplay}${brideDisplay ? ` & ${brideDisplay}` : ""}`
          : (brideDisplay ? brideDisplay : (details.coupleNames || "N/A"));
        const eventDate = String(details.eventDate || details.date || "N/A");

        doc.setFont("helvetica", "normal");
        doc.text(doc.splitTextToSize(coupleName, 42)[0] || "N/A", margin + 75, currentY + 7.5);
        doc.text(doc.splitTextToSize(eventDate, 28)[0] || "N/A", margin + 120, currentY + 7.5);

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
        let details: any = {};
        try {
          details = JSON.parse(item.cardDetailsJson || "{}");
        } catch {}

        const pages = Array.isArray(details.pages) ? (details.pages as any[]) : [];
        const sheetsToRender = pages.length > 0 ? pages : [null];

        for (let sIdx = 0; sIdx < sheetsToRender.length; sIdx++) {
          const activePage = sheetsToRender[sIdx];
          const sheetTitle = activePage ? (activePage.title || activePage.name || `Sheet ${sIdx + 1}`) : item.templateName;
          const pDim = activePage ? (activePage.physicalDimensions || {
            widthInches: activePage.widthInches || (activePage.isBase ? "5.00\"" : "5.00\""),
            heightInches: activePage.heightInches || `${(((activePage.heightPercent || 85) / 100) * 7.0).toFixed(2)}"`,
            widthMm: activePage.widthMm || "127 mm",
            heightMm: activePage.heightMm || `${Math.round(((activePage.heightPercent || 85) / 100) * 178)} mm`,
          }) : null;

          const sheetImg = sIdx === 0 && loadedItemImages[i] ? loadedItemImages[i] : await renderOrderItemToDataUrl(item, sIdx);
          doc.addPage();

          // Page Header Strip
          doc.setFillColor(153, 27, 27);
          doc.rect(0, 0, pageWidth, 20, "F");

          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(11);
          const headerTitle = pages.length > 1
            ? `DESIGN SPEC #${i + 1} (SHEET ${sIdx + 1}/${pages.length}: ${sheetTitle.toUpperCase()})`
            : `DESIGN SPECIFICATION #${i + 1}: ${item.templateName.toUpperCase()}`;
          doc.text(headerTitle, margin, 13);

          doc.setFontSize(9);
          doc.text(`Print Run: ${item.copies} Copies`, pageWidth - margin, 13, { align: "right" });

          // ── Extract All Customer Inputs ──
          const bride = String(details.brideName || details.bride || "").trim();
          const groom = String(details.groomName || details.groom || "").trim();
          const brideQual = String(details.brideQualification || "").trim();
          const groomQual = String(details.groomQualification || "").trim();
          const brideParents = String(details.brideParents || "").trim();
          const groomParents = String(details.groomParents || "").trim();
          const brideAddress = String(details.brideAddress || "").trim();
          const groomAddress = String(details.groomAddress || "").trim();

          const groomDisplay = groom ? `${groom}${groomQual ? ` (${groomQual})` : ""}` : "";
          const brideDisplay = bride ? `${bride}${brideQual ? ` (${brideQual})` : ""}` : "";
          const coupleName = groomDisplay
            ? `${groomDisplay}${brideDisplay ? ` & ${brideDisplay}` : ""}`
            : (brideDisplay ? brideDisplay : (details.coupleNames || item.templateName));

          const eventDate = String(details.eventDate || details.date || "N/A");
          const eventTime = String(details.eventTime || details.time || "");
          const eventVenue = String(details.primaryVenue || details.venue || (Array.isArray(details.venues) && details.venues[0]?.name ? details.venues[0].name : ""));
          const paperType = String(details.paperType || "250 GSM Textured Metallic Gold");
          const rsvpContact = String(details.rsvpContact || details.rsvp || (order.customerPhone ? order.customerPhone : ""));

          // Card Container Viewport
          const cardBoxW = 115;
          const cardBoxH = 120;
          const cardBoxX = (pageWidth - cardBoxW) / 2;
          const cardBoxY = 25;

          if (sheetImg && sheetImg.dataUrl) {
            const imgAspect = sheetImg.width / sheetImg.height;
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

            const format = sheetImg.dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
            doc.addImage(sheetImg.dataUrl, format, drawX, drawY, drawW, drawH, undefined, "FAST");
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
          const notesRaw = [
            item.customNotes,
            details.specialInstructions ? `Special Instructions: ${details.specialInstructions}` : "",
          ].filter(Boolean).join("\n");

          const parts = notesRaw
            .split(/[|\n]/)
            .map((p) => p.trim())
            .filter(Boolean);

          if (groomParents || groomAddress) {
            const groomFamilyInfo = [groomParents ? `Parents: ${groomParents}` : "", groomAddress ? `Native: ${groomAddress}` : ""].filter(Boolean).join(" • ");
            parts.push(`Groom's Family: ${groomFamilyInfo}`);
          }

          if (brideParents || brideAddress) {
            const brideFamilyInfo = [brideParents ? `Parents: ${brideParents}` : "", brideAddress ? `Native: ${brideAddress}` : ""].filter(Boolean).join(" • ");
            parts.push(`Bride's Family: ${brideFamilyInfo}`);
          }

          if (Array.isArray(details.venues) && details.venues.length > 0) {
            details.venues.forEach((v: any, vIdx: number) => {
              if (v.name || v.address) {
                const vDetails = [v.name, v.address, v.time].filter(Boolean).join(", ");
                parts.push(`Venue #${vIdx + 1} (${v.functionType || (vIdx === 0 ? "Primary Function" : `Function ${vIdx + 1}`)}): ${vDetails}`);
              }
            });
          }

          const parsedNotesList = parts.map((part) => {
            const colonIdx = part.indexOf(":");
            if (colonIdx > 0) {
              const key = part.slice(0, colonIdx).trim();
              const val = part.slice(colonIdx + 1).trim();
              doc.setFont("helvetica", "bold");
              doc.setFontSize(8.5);
              const keyW = doc.getTextWidth(`• ${key}: `);
              doc.setFont("helvetica", "normal");
              const remainingW = Math.max(50, contentWidth - 18 - keyW);
              const valLines = doc.splitTextToSize(val, remainingW);
              return { key, val, lines: valLines };
            }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            return { key: "", val: part, lines: doc.splitTextToSize(part, contentWidth - 18) };
          });

          let noteLinesTotalCount = 0;
          parsedNotesList.forEach((n) => {
            noteLinesTotalCount += Math.max(1, n.lines.length);
          });

          const noteBoxHeight = (sIdx === 0 && parsedNotesList.length > 0) ? 8 + noteLinesTotalCount * 4.8 + parsedNotesList.length * 0.8 : 0;
          const specBoxHeight = 42 + noteBoxHeight;

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
          let lineY = specY + 12.5;

          // Row 1: Template/Sheet + Print Run
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(30, 41, 59);
          doc.text("Template / Sheet:", specCol1X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          const fullSheetLabel = pages.length > 1 ? `${item.templateName} (${sheetTitle})` : item.templateName;
          doc.text(doc.splitTextToSize(fullSheetLabel, 55)[0] || fullSheetLabel, specCol1X + 28, lineY);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Print Run (Copies):", specCol2X, lineY);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(153, 27, 27);
          doc.text(`${item.copies} Units / Copies`, specCol2X + 28, lineY);

          // Row 2: Cutting Dimensions + Stock
          lineY += 6.0;
          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Cutting Dimensions:", specCol1X, lineY);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(153, 27, 27);
          const dimLabel = pDim ? `${pDim.widthInches} × ${pDim.heightInches} (${pDim.widthMm} × ${pDim.heightMm})` : "5.00 x 7.00 in (127 x 178 mm)";
          doc.text(dimLabel, specCol1X + 31, lineY);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Stock / Paper Type:", specCol2X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          doc.text(doc.splitTextToSize(paperType, 55)[0] || paperType, specCol2X + 28, lineY);

          // Row 3: Couple + Date
          lineY += 6.0;
          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Celebrant / Couple:", specCol1X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          doc.text(doc.splitTextToSize(coupleName, 55)[0] || "N/A", specCol1X + 28, lineY);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Event Date & Time:", specCol2X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          const dateTimeStr = eventTime ? `${eventDate} at ${eventTime}` : eventDate;
          doc.text(doc.splitTextToSize(dateTimeStr, 55)[0] || dateTimeStr, specCol2X + 28, lineY);

          // Row 4: Primary Venue + RSVP
          lineY += 6.0;
          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("Primary Venue:", specCol1X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          doc.text(doc.splitTextToSize(eventVenue || "Venue details on design", 55)[0] || "Venue details on design", specCol1X + 28, lineY);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text("RSVP / Contact:", specCol2X, lineY);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          doc.text(doc.splitTextToSize(rsvpContact || "N/A", 55)[0] || "N/A", specCol2X + 28, lineY);

          // Custom Notes Section (on sheet 1)
          if (sIdx === 0 && parsedNotesList.length > 0) {
            lineY += 6.5;
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(203, 213, 225);
            doc.roundedRect(margin + 3, lineY, contentWidth - 6, noteBoxHeight, 1.5, 1.5, "FD");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(153, 27, 27);
            doc.text("Special Requirements / Customer Notes:", margin + 6, lineY + 5.0);

            let currentNoteY = lineY + 10;
            const noteStartX = margin + 6;

            parsedNotesList.forEach((n) => {
              if (n.key) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(8.5);
                doc.setTextColor(15, 23, 42); // Black
                const keyPrefix = `• ${n.key}: `;
                doc.text(keyPrefix, noteStartX, currentNoteY);
                const keyW = doc.getTextWidth(keyPrefix);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(8.5);
                doc.setTextColor(15, 23, 42); // Black
                if (n.lines.length > 0) {
                  doc.text(n.lines[0], noteStartX + keyW, currentNoteY);
                  for (let l = 1; l < n.lines.length; l++) {
                    currentNoteY += 4.6;
                    doc.text(n.lines[l], noteStartX + keyW, currentNoteY);
                  }
                }
              } else {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8.5);
                doc.setTextColor(15, 23, 42); // Black
                n.lines.forEach((lStr: string, lIdx: number) => {
                  if (lIdx > 0) currentNoteY += 4.6;
                  doc.text(`• ${lStr}`, noteStartX, currentNoteY);
                });
              }
              currentNoteY += 4.8;
            });
          }

          // Page Footer
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(
            `Docket #${order.orderNumber} • Item ${i + 1} (Sheet ${sIdx + 1}/${sheetsToRender.length})`,
            pageWidth / 2,
            pageHeight - 8,
            { align: "center" }
          );
        }
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

                  const brideName = String(parsedDetails.brideName || parsedDetails.bride || "").trim();
                  const groomName = String(parsedDetails.groomName || parsedDetails.groom || "").trim();
                  const brideQual = String(parsedDetails.brideQualification || "").trim();
                  const groomQual = String(parsedDetails.groomQualification || "").trim();
                  const brideParents = String(parsedDetails.brideParents || "").trim();
                  const groomParents = String(parsedDetails.groomParents || "").trim();
                  const brideAddress = String(parsedDetails.brideAddress || "").trim();
                  const groomAddress = String(parsedDetails.groomAddress || "").trim();

                  const eventDate = String(parsedDetails.eventDate || parsedDetails.date || "").trim();
                  const eventTime = String(parsedDetails.eventTime || parsedDetails.time || "").trim();
                  const paperType = String(parsedDetails.paperType || "").trim();
                  const rsvpContact = String(parsedDetails.rsvpContact || parsedDetails.rsvp || "").trim();

                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const venuesList: Array<any> =
                    Array.isArray(parsedDetails.venues) && parsedDetails.venues.length > 0
                      ? parsedDetails.venues
                      : parsedDetails.venue || parsedDetails.primaryVenue
                      ? [
                          {
                            name: String(parsedDetails.primaryVenue || parsedDetails.venue),
                            address: String(parsedDetails.city || order.city || ""),
                            functionType: "Wedding & Reception",
                            time: eventTime,
                          },
                        ]
                      : [];

                  return (
                    <div
                      key={item.id}
                      className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 hover:border-red-200 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-200/60 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#991B1B] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <h4 className="font-serif font-bold text-base text-slate-900">{item.templateName}</h4>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              let details: any = {};
                              try {
                                details = JSON.parse(item.cardDetailsJson || "{}");
                              } catch {}

                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              let vList: any[] = [];
                              if (Array.isArray(details.venues) && details.venues.length > 0) {
                                vList = details.venues;
                              } else if (details.venue || details.primaryVenue) {
                                vList = [
                                  {
                                    name: details.primaryVenue || details.venue || "",
                                    address: details.city || order.city || "",
                                    functionType: "Wedding & Reception",
                                    time: details.eventTime || details.time || "",
                                  },
                                ];
                              } else {
                                vList = [{ name: "", address: "", functionType: "Wedding & Reception", time: "" }];
                              }

                              setEditForm({
                                copies: Number(item.copies) || 100,
                                paperType: String(details.paperType || "250 GSM Textured Metallic Gold"),
                                customNotes: String(item.customNotes || ""),
                                specialInstructions: String(details.specialInstructions || ""),

                                brideName: String(details.brideName || details.bride || ""),
                                brideQualification: String(details.brideQualification || ""),
                                brideParents: String(details.brideParents || ""),
                                brideAddress: String(details.brideAddress || ""),

                                groomName: String(details.groomName || details.groom || ""),
                                groomQualification: String(details.groomQualification || ""),
                                groomParents: String(details.groomParents || ""),
                                groomAddress: String(details.groomAddress || ""),

                                eventDate: String(details.eventDate || details.date || ""),
                                eventTime: String(details.eventTime || details.time || ""),
                                venues: vList,
                                rsvpContact: String(details.rsvpContact || details.rsvp || ""),

                                deliveryName: String(details.deliveryName || order.customerName || ""),
                                deliveryPhone: String(details.deliveryPhone || order.customerPhone || ""),
                                deliveryAddress: String(details.deliveryAddress || order.deliveryAddress || ""),
                                deliveryCity: String(details.deliveryCity || order.city || ""),
                                deliveryPincode: String(details.deliveryPincode || order.pincode || ""),
                              });
                              setEditStep(1);
                              setEditingItem(item);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50/50 text-slate-800 font-bold text-xs border border-slate-300 shadow-2xs hover:border-[#991B1B] hover:text-[#991B1B] transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Edit customer input details (Couple, Date, Venue, Paper finish, Notes)"
                          >
                            <Pencil className="w-3.5 h-3.5 text-[#991B1B]" />
                            <span>Edit Details</span>
                          </button>

                          <Link
                            href={`/canva?orderId=${order.id}&itemId=${item.id}`}
                            className="px-3 py-1.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Open and edit template artwork and layers in Canva Studio"
                          >
                            <Palette className="w-3.5 h-3.5" />
                            <span>Edit in Canva Studio</span>
                          </Link>

                          <span className="px-3 py-1 rounded-full bg-red-50 text-[#991B1B] text-xs font-extrabold border border-red-200">
                            {item.copies} Copies Requested
                          </span>
                        </div>
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
                          <div className="space-y-2.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                            {/* Couple Details */}
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-100 pb-2">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Couple / Celebrants</span>
                                <div className="text-sm font-bold text-slate-900 flex flex-wrap items-baseline gap-1.5 mt-0.5">
                                  {groomName && (
                                    <span>
                                      {groomName}
                                      {groomQual && <span className="font-normal text-xs text-slate-500 ml-1">({groomQual})</span>}
                                    </span>
                                  )}
                                  {groomName && brideName && <span className="text-[#991B1B] font-extrabold">&amp;</span>}
                                  {brideName && (
                                    <span>
                                      {brideName}
                                      {brideQual && <span className="font-normal text-xs text-slate-500 ml-1">({brideQual})</span>}
                                    </span>
                                  )}
                                  {!groomName && !brideName && <span className="text-slate-500 font-medium">Card Design Item</span>}
                                </div>
                              </div>
                              {paperType && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 text-[#991B1B] font-bold text-[11px] border border-red-100 self-start sm:self-auto">
                                  📄 {paperType}
                                </span>
                              )}
                            </div>

                            {/* Event Date, Time & RSVP */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {eventDate && (
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Event Date &amp; Time</span>
                                  <span className="font-bold text-slate-900">
                                    {eventDate} {eventTime && <span className="font-medium text-slate-600">&bull; {eventTime}</span>}
                                  </span>
                                </div>
                              )}
                              {rsvpContact && (
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-400 block uppercase">RSVP / Contact Phone</span>
                                  <span className="font-bold text-slate-900">{rsvpContact}</span>
                                </div>
                              )}
                            </div>

                            {/* Parents / Family Details */}
                            {(groomParents || brideParents || groomAddress || brideAddress) && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                                {(groomParents || groomAddress) && (
                                  <div className="bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Groom&apos;s Family</span>
                                    {groomParents && <p className="font-medium text-slate-900">Parents: <strong>{groomParents}</strong></p>}
                                    {groomAddress && <p className="text-slate-600 text-[11px]">Native: {groomAddress}</p>}
                                  </div>
                                )}
                                {(brideParents || brideAddress) && (
                                  <div className="bg-red-50/40 p-2 rounded-xl border border-red-100">
                                    <span className="text-[10px] font-bold text-[#991B1B] block uppercase">Bride&apos;s Family</span>
                                    {brideParents && <p className="font-medium text-slate-900">Parents: <strong>{brideParents}</strong></p>}
                                    {brideAddress && <p className="text-slate-600 text-[11px]">Native: {brideAddress}</p>}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Functions & Venues List */}
                            {venuesList.length > 0 && (
                              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                                  {venuesList.length > 1 ? `Functions & Venues (${venuesList.length})` : "Venue / Location"}
                                </span>
                                <div className="space-y-1.5">
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  {venuesList.map((v: any, vI: number) => (
                                    <div key={vI} className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                      <div>
                                        <span className="font-bold text-slate-900 text-xs">{v.name || "Venue Name"}</span>
                                        {v.address && <span className="text-slate-500 text-xs ml-1">({v.address})</span>}
                                      </div>
                                      <div className="flex items-center gap-2 text-[11px] text-[#991B1B] font-bold">
                                        {v.functionType && <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">{v.functionType}</span>}
                                        {v.time && <span>{v.time}</span>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Multi-Layer Stepped Card Specifications */}
                          {Array.isArray(parsedDetails.pages) && (parsedDetails.pages as any[]).length > 1 && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#991B1B] flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5" />
                                <span>Multi-Layer Deck Stack ({(parsedDetails.pages as any[]).length} Sheets):</span>
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {(parsedDetails.pages as any[]).map((pg: any, pIdx: number) => {
                                  const pDim = pg.physicalDimensions || {
                                    widthInches: pg.widthInches || (pg.isBase ? "5.00\"" : "5.00\""),
                                    heightInches: pg.heightInches || `${((pg.heightPercent || 85) / 100 * 7.0).toFixed(2)}"`,
                                    widthMm: pg.widthMm || "127 mm",
                                    heightMm: pg.heightMm || `${Math.round((pg.heightPercent || 85) / 100 * 178)} mm`,
                                    pixelW: pg.pixelW || pg.customWidth || 500,
                                    pixelH: pg.pixelH || pg.customHeight || 700,
                                  };

                                  return (
                                    <div
                                      key={pg.id || pIdx}
                                      className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex flex-col justify-between gap-2 shadow-2xs"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <span
                                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                              pg.isBase ? "bg-[#991B1B] text-white" : "bg-slate-200 text-slate-700"
                                            }`}
                                          >
                                            {pIdx + 1}
                                          </span>
                                          <div className="min-w-0">
                                            <p className="font-bold text-slate-900 truncate">
                                              {pg.title || pg.name || `Sheet ${pIdx + 1}`}
                                            </p>
                                          </div>
                                        </div>
                                        <span
                                          className={`text-[9.5px] font-mono font-extrabold px-2 py-0.5 rounded-md shrink-0 ${
                                            pg.isBase ? "bg-red-50 text-[#991B1B] border border-red-200" : "bg-slate-100 text-slate-700"
                                          }`}
                                        >
                                          {pg.isBase ? "⭐ Base (100%)" : `${pg.heightPercent || 85}% Height`}
                                        </span>
                                      </div>

                                      {/* Trimming & Cutting Physical Dimensions */}
                                      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5 font-mono text-[10.5px]">
                                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                          <span className="text-[8px] font-bold text-slate-400 block uppercase">Dimensions (Inches)</span>
                                          <span className="font-extrabold text-slate-900">{pDim.widthInches} × {pDim.heightInches}</span>
                                        </div>
                                        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                          <span className="text-[8px] font-bold text-slate-400 block uppercase">Dimensions (Metric)</span>
                                          <span className="font-extrabold text-slate-900">{pDim.widthMm} × {pDim.heightMm}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

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

                          {/* Item Price & Admin Quote Card */}
                          <div className="p-3.5 rounded-2xl border transition-all space-y-3 bg-white border-slate-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                              <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                                  Pricing &amp; Quotation Status
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {item.price > 0 ? (
                                    <span className="text-base font-extrabold text-[#991B1B]">
                                      ₹{item.price} <span className="text-xs font-normal text-slate-500">/ card</span>
                                      <span className="text-xs font-bold text-slate-800 ml-2">
                                        (Total: ₹{item.price * item.copies})
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3" />
                                      <span>Custom Studio Design • Price Pending Admin Quote</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setSettingPriceItemId(settingPriceItemId === item.id ? null : item.id);
                                  if (!itemBasePriceInput[item.id]) {
                                    setItemBasePriceInput((prev) => ({ ...prev, [item.id]: 30 }));
                                  }
                                  if (!itemDirectPriceInput[item.id]) {
                                    setItemDirectPriceInput((prev) => ({ ...prev, [item.id]: item.price || 30 }));
                                  }
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                              >
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                <span>{item.price > 0 ? "Adjust Price / Quote" : "Provide Price Quote"}</span>
                              </button>
                            </div>

                            {/* Interactive Inline Price Quote Form */}
                            {settingPriceItemId === item.id && (
                              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-3 animate-in fade-in duration-150">
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                                    <Zap className="w-4 h-4 text-amber-600" />
                                    <span>Provide Card Print Price for {item.copies} Copies</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setSettingPriceItemId(null)}
                                    className="text-xs text-slate-500 hover:text-slate-900 font-bold"
                                  >
                                    Cancel
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="bg-white p-3 rounded-xl border border-amber-200/80 space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-800 block">
                                      Option A: Enter Base Rate (for 1000+ prints)
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <div className="relative flex-1">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                                        <input
                                          type="number"
                                          min={1}
                                          value={itemBasePriceInput[item.id] || 30}
                                          onChange={(e) => {
                                            const base = Number(e.target.value) || 0;
                                            setItemBasePriceInput((prev) => ({ ...prev, [item.id]: base }));
                                            const calc = calculateTieredCardPrice(base, item.copies, false);
                                            setItemDirectPriceInput((prev) => ({ ...prev, [item.id]: calc.unitPrice }));
                                          }}
                                          className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#991B1B] focus:outline-none focus:border-[#991B1B]"
                                          placeholder="e.g. 30"
                                        />
                                      </div>
                                      <span className="text-[10.5px] text-slate-500 font-medium">/ card</span>
                                    </div>
                                    {(() => {
                                      const base = itemBasePriceInput[item.id] || 30;
                                      const calc = calculateTieredCardPrice(base, item.copies, false);
                                      return (
                                        <p className="text-[10px] text-amber-800 font-medium">
                                          ⚡ Tier for {item.copies} copies: <strong>₹{calc.unitPrice}/card</strong> (+{calc.markupPercent}% tier) • Total: <strong>₹{calc.totalPrice}</strong>
                                        </p>
                                      );
                                    })()}
                                  </div>

                                  <div className="bg-white p-3 rounded-xl border border-amber-200/80 space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-800 block">
                                      Option B: Or Direct Unit Price (₹)
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <div className="relative flex-1">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                                        <input
                                          type="number"
                                          min={1}
                                          value={itemDirectPriceInput[item.id] ?? ""}
                                          onChange={(e) => {
                                            setItemDirectPriceInput((prev) => ({ ...prev, [item.id]: Number(e.target.value) || 0 }));
                                          }}
                                          className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#991B1B] focus:outline-none focus:border-[#991B1B]"
                                          placeholder="e.g. 120"
                                        />
                                      </div>
                                      <span className="text-[10.5px] text-slate-500 font-medium">/ card</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium">
                                      Total for {item.copies} copies = <strong>₹{(itemDirectPriceInput[item.id] || 0) * item.copies}</strong>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-1">
                                  <button
                                    type="button"
                                    disabled={updatingItemPriceId === item.id || !itemDirectPriceInput[item.id]}
                                    onClick={() => {
                                      const finalUnitPrice = itemDirectPriceInput[item.id] || 0;
                                      if (finalUnitPrice > 0) {
                                        handleSetItemPrice(item.id, finalUnitPrice);
                                      }
                                    }}
                                    className="px-4 py-2 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                  >
                                    {updatingItemPriceId === item.id ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Saving Price...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Save &amp; Apply Quote (₹{itemDirectPriceInput[item.id] || 0}/card)</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
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
              <div className="bg-white rounded-3xl p-4 sm:p-5 max-w-lg w-full max-h-[92vh] flex flex-col items-center gap-2.5 sm:gap-3 relative shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto custom-scrollbar my-auto">
                <button
                  onClick={() => setPreviewModalItem(null)}
                  className="absolute top-3 right-3 p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer z-10"
                  title="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="text-center space-y-0.5 pt-1">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 leading-tight">
                    Customer Card Design Proof
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                    Template: <strong className="text-[#991B1B]">{previewModalItem.templateName}</strong> &bull; {previewModalItem.copies} Copies
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
                <div className="flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-gray-200 shrink overflow-hidden max-h-[52vh]">
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
                <div className="w-full bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs mt-auto">
                  <span className="text-slate-600 font-medium text-[11px]">
                    {modalPages.length > 1
                      ? `Viewing sheet ${previewModalPageIndex + 1} of ${modalPages.length}`
                      : "All typography, custom names, and dates are rendered from the design."}
                  </span>
                  <button
                    onClick={() => setPreviewModalItem(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#991B1B] text-white font-bold text-xs hover:bg-[#7F1D1D] transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Admin Edit Order Item Multi-Step Modal ── */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-2xl w-full max-h-[92vh] flex flex-col gap-4 relative shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto my-auto custom-scrollbar">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="border-b border-slate-100 pb-3 pr-10">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-red-50 text-[#991B1B] flex items-center justify-center font-bold">
                    <Pencil className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                      Edit Order Specifications &amp; Inputs
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Template: <strong className="text-[#991B1B]">{editingItem.templateName}</strong> &bull; Order #{order.orderNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4-Step Stepper Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl">
                {[
                  { num: 1, label: "Copies & Paper", icon: Package },
                  { num: 2, label: "Couple & Parents", icon: User },
                  { num: 3, label: "Date & Venues", icon: Calendar },
                  { num: 4, label: "Delivery & Contact", icon: MapPin },
                ].map((s) => {
                  const Icon = s.icon;
                  const isActive = editStep === s.num;
                  const isDone = editStep > s.num;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setEditStep(s.num)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isActive
                          ? "bg-[#991B1B] text-white shadow-xs"
                          : isDone
                          ? "bg-white text-[#991B1B] hover:bg-red-50"
                          : "bg-transparent text-slate-600 hover:bg-white/60"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{s.label}</span>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSaveEditItem} className="space-y-4 text-xs">
                {/* ── STEP 1: COPIES & PAPER FINISH ── */}
                {editStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1.5">
                        Print Quantity (Copies)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[50, 100, 150, 200, 300, 500].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setEditForm((prev) => ({ ...prev, copies: preset }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              editForm.copies === preset
                                ? "bg-[#991B1B] text-white border-[#991B1B]"
                                : "bg-white text-slate-700 border-slate-200 hover:border-[#991B1B]"
                            }`}
                          >
                            {preset} Copies
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        min="1"
                        value={editForm.copies}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, copies: parseInt(e.target.value, 10) || 1 }))
                        }
                        className="w-full sm:w-48 px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-bold text-slate-900 bg-slate-50/50"
                        placeholder="Custom copies"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1.5">
                        Select Paper Finish / Stock
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "250 GSM Textured Metallic Gold",
                          "350 GSM Velvet Matte Finish",
                          "300 GSM Royal Pearlescent Linen",
                          "400 GSM Ultra-Thick Cotton Card",
                        ].map((paper) => (
                          <button
                            key={paper}
                            type="button"
                            onClick={() => setEditForm((prev) => ({ ...prev, paperType: paper }))}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                              editForm.paperType === paper
                                ? "border-[#991B1B] bg-red-50/60 ring-1 ring-[#991B1B]"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <span className="font-bold text-slate-900 text-xs">{paper}</span>
                            {editForm.paperType === paper && (
                              <Check className="w-4 h-4 text-[#991B1B] shrink-0 ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Special Instructions &amp; Customer Notes
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.customNotes}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, customNotes: e.target.value }))}
                        placeholder="e.g. Gold foil stamping, ribbon packaging, specific delivery notes..."
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-slate-50/50"
                      />
                    </div>
                  </div>
                )}

                {/* ── STEP 2: COUPLE & PARENTS (FULL PERSONALIZATION) ── */}
                {editStep === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Bride Section */}
                    <div className="bg-red-50/30 border border-red-100 rounded-2xl p-3.5 space-y-3">
                      <h4 className="font-serif font-bold text-sm text-[#991B1B]">Bride &amp; Family Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Bride's Full Name</label>
                          <input
                            type="text"
                            value={editForm.brideName}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, brideName: e.target.value }))}
                            placeholder="e.g. Asha"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Bride's Qualification / Degree</label>
                          <input
                            type="text"
                            value={editForm.brideQualification}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, brideQualification: e.target.value }))}
                            placeholder="e.g. B.Tech, MBA"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Bride's Parents</label>
                          <input
                            type="text"
                            value={editForm.brideParents}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, brideParents: e.target.value }))}
                            placeholder="e.g. Mr. & Mrs. Williams"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Bride's Native / Address</label>
                          <input
                            type="text"
                            value={editForm.brideAddress}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, brideAddress: e.target.value }))}
                            placeholder="e.g. Trivandrum, Kerala"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Groom Section */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
                      <h4 className="font-serif font-bold text-sm text-slate-900">Groom &amp; Family Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Groom's Full Name</label>
                          <input
                            type="text"
                            value={editForm.groomName}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, groomName: e.target.value }))}
                            placeholder="e.g. Kirubin"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Groom's Qualification / Degree</label>
                          <input
                            type="text"
                            value={editForm.groomQualification}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, groomQualification: e.target.value }))}
                            placeholder="e.g. M.S., Software Architect"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Groom's Parents</label>
                          <input
                            type="text"
                            value={editForm.groomParents}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, groomParents: e.target.value }))}
                            placeholder="e.g. Mr. & Mrs. Johnson"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Groom's Native / Address</label>
                          <input
                            type="text"
                            value={editForm.groomAddress}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, groomAddress: e.target.value }))}
                            placeholder="e.g. Bangalore, Karnataka"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: DATE, TIME & VENUES ── */}
                {editStep === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Event Date</label>
                        <input
                          type="text"
                          value={editForm.eventDate}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, eventDate: e.target.value }))}
                          placeholder="e.g. October 30, 2026"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Event Time / Muhurtham</label>
                        <input
                          type="text"
                          value={editForm.eventTime}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, eventTime: e.target.value }))}
                          placeholder="e.g. 6:30 PM onwards"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">RSVP / Contact Number</label>
                        <input
                          type="text"
                          value={editForm.rsvpContact}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, rsvpContact: e.target.value }))}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-slate-50/50"
                        />
                      </div>
                    </div>

                    {/* Dynamic Venues List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 text-xs">
                          Functions &amp; Venues ({editForm.venues.length})
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditForm((prev) => ({
                              ...prev,
                              venues: [
                                ...prev.venues,
                                {
                                  name: "",
                                  address: "",
                                  functionType: prev.venues.length === 1 ? "Reception" : `Function ${prev.venues.length + 1}`,
                                  time: "",
                                },
                              ],
                            }))
                          }
                          className="px-2.5 py-1 rounded-xl bg-red-50 text-[#991B1B] hover:bg-red-100 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Another Venue</span>
                        </button>
                      </div>

                      {editForm.venues.map((v, vIdx) => (
                        <div
                          key={vIdx}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#991B1B] uppercase tracking-wider">
                              Venue #{vIdx + 1}
                            </span>
                            {editForm.venues.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    venues: prev.venues.filter((_, i) => i !== vIdx),
                                  }))
                                }
                                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Remove this venue"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Function Title</label>
                              <input
                                type="text"
                                value={v.functionType}
                                onChange={(e) => {
                                  const updated = [...editForm.venues];
                                  updated[vIdx].functionType = e.target.value;
                                  setEditForm((prev) => ({ ...prev, venues: updated }));
                                }}
                                placeholder="e.g. Wedding & Reception, Muhurtham, Sangeet"
                                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none text-slate-900 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Function Timing</label>
                              <input
                                type="text"
                                value={v.time || ""}
                                onChange={(e) => {
                                  const updated = [...editForm.venues];
                                  updated[vIdx].time = e.target.value;
                                  setEditForm((prev) => ({ ...prev, venues: updated }));
                                }}
                                placeholder="e.g. 7:00 PM onwards"
                                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none text-slate-900 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Venue / Hall Name</label>
                              <input
                                type="text"
                                value={v.name}
                                onChange={(e) => {
                                  const updated = [...editForm.venues];
                                  updated[vIdx].name = e.target.value;
                                  setEditForm((prev) => ({ ...prev, venues: updated }));
                                }}
                                placeholder="e.g. Elamba Mudakkal Palace"
                                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none text-slate-900 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Venue Address / City</label>
                              <input
                                type="text"
                                value={v.address}
                                onChange={(e) => {
                                  const updated = [...editForm.venues];
                                  updated[vIdx].address = e.target.value;
                                  setEditForm((prev) => ({ ...prev, venues: updated }));
                                }}
                                placeholder="e.g. Attingal Road, Trivandrum"
                                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none text-slate-900 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── STEP 4: DELIVERY & SHIPPING ── */}
                {editStep === 4 && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Recipient / Contact Name</label>
                        <input
                          type="text"
                          value={editForm.deliveryName}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, deliveryName: e.target.value }))}
                          placeholder="e.g. Kirubin"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">WhatsApp / Contact Phone</label>
                        <input
                          type="text"
                          value={editForm.deliveryPhone}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, deliveryPhone: e.target.value }))}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Shipping / Delivery Street Address</label>
                      <textarea
                        rows={2}
                        value={editForm.deliveryAddress}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, deliveryAddress: e.target.value }))}
                        placeholder="House/Flat No., Street, Landmark..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-slate-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">City / District / State</label>
                        <input
                          type="text"
                          value={editForm.deliveryCity}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, deliveryCity: e.target.value }))}
                          placeholder="e.g. Trivandrum, Kerala"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Pincode / Postal Code</label>
                        <input
                          type="text"
                          value={editForm.deliveryPincode}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, deliveryPincode: e.target.value }))}
                          placeholder="e.g. 695104"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#991B1B] outline-none font-medium text-slate-900 bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Navigation & Save Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    {editStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setEditStep((s) => s - 1)}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-colors flex items-center gap-1 w-full sm:w-auto justify-center"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {editStep < 4 && (
                      <button
                        type="button"
                        onClick={() => setEditStep((s) => s + 1)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer w-full sm:w-auto justify-center"
                      >
                        <span>Next Step</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={savingEditItem}
                      className="px-5 py-2 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
                    >
                      {savingEditItem ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>{savingEditItem ? "Saving Changes..." : "Save All Changes"}</span>
                    </button>
                  </div>
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

