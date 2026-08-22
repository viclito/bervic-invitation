"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { optimizeImageForUpload } from "@/lib/imageOptimizer";
import {
  ArrowLeft,
  Upload,
  Layers,
  Type,
  Image as ImageIcon,
  Sparkles,
  Save,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  MoveUp,
  MoveDown,
  RotateCw,
  Copy,
  Sliders,
  Check,
  X,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Maximize2,
  FlipHorizontal,
  FlipVertical,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  Crosshair,
  Italic,
  Underline,
  Palette,
  Minus,
  Smartphone,
  Square,
  Monitor,
  FileText,
  Bookmark,
  Tv,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  FolderUp,
} from "lucide-react";

export interface CanvasElement {
  id: string;
  type: "text" | "image" | "shape" | "sticker";
  fieldKey?: string;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  gradient?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  textAlign?: "left" | "center" | "right" | "justify";
  letterSpacing?: number;
  lineHeight?: number;
  textShadow?: string;
  src?: string;
  x: number; // 0 - 100 (%)
  y: number; // 0 - 100 (%)
  width: number; // 0 - 100 (%)
  height: number; // 0 - 100 (%)
  rotation: number;
  opacity: number;
  zIndex: number;
  backgroundColor?: string;
  flipH?: boolean;
  flipV?: boolean;
  isLocked?: boolean;
}

export const ASPECT_RATIOS = [
  {
    id: "classic",
    name: "Classic (5:7)",
    shortName: "Classic",
    subtitle: "Standard Wedding Card",
    width: 480,
    height: 672,
    ratioStr: "5:7",
    boxClass: "w-4 h-5.5",
    badge: "Popular",
  },
  {
    id: "portrait",
    name: "Mobile (9:16)",
    shortName: "Story",
    subtitle: "WhatsApp & Instagram",
    width: 430,
    height: 764,
    ratioStr: "9:16",
    boxClass: "w-3 h-5.5",
    badge: "Mobile",
  },
  {
    id: "square",
    name: "Square (1:1)",
    shortName: "Square",
    subtitle: "Instagram Post & Box",
    width: 500,
    height: 500,
    ratioStr: "1:1",
    boxClass: "w-4.5 h-4.5",
    badge: "Feed",
  },
  {
    id: "landscape",
    name: "Landscape (7:5)",
    shortName: "Landscape",
    subtitle: "Wide Folded Envelope",
    width: 672,
    height: 480,
    ratioStr: "7:5",
    boxClass: "w-5.5 h-4",
    badge: "Wide",
  },
  {
    id: "cinematic",
    name: "Cinematic (16:9)",
    shortName: "Cinematic",
    subtitle: "Digital Display & TV",
    width: 680,
    height: 382,
    ratioStr: "16:9",
    boxClass: "w-6 h-3.5",
    badge: "Screen",
  },
  {
    id: "bookmark",
    name: "Bookmark (1:2)",
    shortName: "Bookmark",
    subtitle: "Gatefold & Menu Card",
    width: 360,
    height: 720,
    ratioStr: "1:2",
    boxClass: "w-2.5 h-5.5",
    badge: "Slim",
  },
  {
    id: "a4",
    name: "Poster (A4)",
    shortName: "A4 Print",
    subtitle: "Wall Frame & Document",
    width: 460,
    height: 650,
    ratioStr: "1:1.41",
    boxClass: "w-4 h-5.5",
    badge: "Print",
  },
];

export const LUXURY_GRADIENTS = [
  {
    name: "Royal Champagne",
    value: "linear-gradient(135deg, #FBF8EE 0%, #F3EAD8 50%, #E8D8BA 100%)",
  },
  {
    name: "Velvet Crimson",
    value: "linear-gradient(135deg, #881337 0%, #7F1D1D 50%, #450A0A 100%)",
  },
  {
    name: "Silk Rose",
    value: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FECDD3 100%)",
  },
  {
    name: "Sunset Shimmer",
    value: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #D97706 100%)",
  },
  {
    name: "Royal Emerald",
    value: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #022C22 100%)",
  },
  {
    name: "Sapphire Navy",
    value: "linear-gradient(135deg, #1E3A8A 0%, #172554 50%, #020617 100%)",
  },
  {
    name: "Vintage Parchment",
    value: "linear-gradient(135deg, #FBF6E9 0%, #EFE1C6 50%, #E2CFAC 100%)",
  },
  {
    name: "Pearl Ivory",
    value: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #E2E8F0 100%)",
  },
  {
    name: "Obsidian Gold",
    value: "linear-gradient(135deg, #27272A 0%, #18181B 50%, #09090B 100%)",
  },
  {
    name: "Lavender Dusk",
    value: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #E9D5FF 100%)",
  },
  {
    name: "Sage Mist",
    value: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)",
  },
  {
    name: "Radial Aura",
    value: "radial-gradient(circle at center, #FFFBEB 0%, #FEF3C7 60%, #FDE68A 100%)",
  },
];

export const TEXT_GRADIENTS = [
  { name: "Pure Gold Foil", value: "linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #AA771C 100%)" },
  { name: "Rose Gold Shimmer", value: "linear-gradient(135deg, #B76E79 0%, #FAD0C4 50%, #E28C9C 100%)" },
  { name: "Royal Maroon Glow", value: "linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #7F1D1D 100%)" },
  { name: "Silver Chrome", value: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 50%, #94A3B8 100%)" },
  { name: "Bronze Heritage", value: "linear-gradient(135deg, #8C6B1B 0%, #CD7F32 50%, #5C4310 100%)" },
];

const FONT_CATEGORIES = [
  {
    category: "Royal Calligraphy & Script",
    fonts: [
      { name: "Great Vibes (Classic Wedding Script)", family: "'Great Vibes', cursive" },
      { name: "Alex Brush (Flowing Calligraphy)", family: "'Alex Brush', cursive" },
      { name: "Parisienne (French Romance Script)", family: "'Parisienne', cursive" },
      { name: "Pinyon Script (Royal Copperplate)", family: "'Pinyon Script', cursive" },
      { name: "Sacramento (Fine Monoline Cursive)", family: "'Sacramento', cursive" },
      { name: "Dancing Script (Bouncy Elegant Script)", family: "'Dancing Script', cursive" },
      { name: "Satisfy (Vintage Brush Script)", family: "'Satisfy', cursive" },
      { name: "Caveat (Handwritten Cursive)", family: "'Caveat', cursive" },
      { name: "Pacifico (Casual Retro Script)", family: "'Pacifico', cursive" },
    ],
  },
  {
    category: "Luxury Editorial Serifs",
    fonts: [
      { name: "Cormorant Garamond (Warm Serif)", family: "'Cormorant Garamond', serif" },
      { name: "Playfair Display (Editorial High-Fashion)", family: "'Playfair Display', serif" },
      { name: "Bodoni Moda (Vogue Luxury Serif)", family: "'Bodoni Moda', serif" },
      { name: "Prata (Didone Editorial Serif)", family: "'Prata', serif" },
      { name: "Abril Fatface (Vintage Poster Serif)", family: "'Abril Fatface', serif" },
      { name: "Marcellus (Heritage Roman Serif)", family: "'Marcellus', serif" },
      { name: "Rozha One (Traditional Indian Serif)", family: "'Rozha One', serif" },
    ],
  },
  {
    category: "Imperial Roman & Display Caps",
    fonts: [
      { name: "Cinzel (Imperial Roman Caps)", family: "'Cinzel', serif" },
      { name: "Cinzel Decorative (Flourished Gold Caps)", family: "'Cinzel Decorative', serif" },
      { name: "Poiret One (Art Deco Geometric)", family: "'Poiret One', cursive" },
    ],
  },
  {
    category: "Clean Modern Sans-Serif",
    fonts: [
      { name: "Montserrat (Clean Geometric Sans)", family: "'Montserrat', sans-serif" },
      { name: "Outfit (Modern Minimalist Sans)", family: "'Outfit', sans-serif" },
      { name: "Inter (Crisp Contemporary Sans)", family: "'Inter', sans-serif" },
      { name: "Special Elite (Vintage Typewriter)", family: "'Special Elite', cursive" },
    ],
  },
];

const PRESET_FIELDS = [
  {
    label: "🤵 Groom Name",
    fieldKey: "groomName",
    defaultText: "Alexander",
    fontFamily: "'Great Vibes', cursive",
    fontSize: 48,
    color: "#1E293B",
    fontWeight: "400",
  },
  {
    label: "💍 Connector ('&' / 'WEDS')",
    fieldKey: "connector",
    defaultText: "&",
    fontFamily: "'Playfair Display', serif",
    fontSize: 26,
    color: "#8C6B1B",
    fontWeight: "600",
    fontStyle: "italic",
  },
  {
    label: "👰 Bride Name",
    fieldKey: "brideName",
    defaultText: "Sophia",
    fontFamily: "'Great Vibes', cursive",
    fontSize: 48,
    color: "#1E293B",
    fontWeight: "400",
  },
  {
    label: "👑 Couple / Combined Names",
    fieldKey: "coupleNames",
    defaultText: "Sophia & Alexander",
    fontFamily: "'Great Vibes', cursive",
    fontSize: 44,
    color: "#4A3B2A",
    fontWeight: "400",
  },
  {
    label: "📜 Tagline / Intro",
    fieldKey: "tagline",
    defaultText: "TOGETHER WITH THEIR FAMILIES",
    fontFamily: "'Cinzel', serif",
    fontSize: 12,
    color: "#5C4E3A",
    fontWeight: "700",
    letterSpacing: 3,
  },
  {
    label: "💌 Invitation Line",
    fieldKey: "inviteLine",
    defaultText: "Request the pleasure of your company at the celebration of their wedding",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 14,
    color: "#5C4E3A",
    fontWeight: "500",
  },
  {
    label: "📅 Wedding Date",
    fieldKey: "date",
    defaultText: "OCTOBER 30, 2026",
    fontFamily: "'Cinzel', serif",
    fontSize: 18,
    color: "#8C6B1B",
    fontWeight: "700",
    letterSpacing: 2,
  },
  {
    label: "⏰ Event Time",
    fieldKey: "time",
    defaultText: "AT 4:00 IN THE AFTERNOON",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 11,
    color: "#5C4E3A",
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  {
    label: "🏛️ Venue Name",
    fieldKey: "venue",
    defaultText: "ELAMBA MUDAKKAL PALACE",
    fontFamily: "'Cinzel', serif",
    fontSize: 13,
    color: "#5C4E3A",
    fontWeight: "700",
    letterSpacing: 1,
  },
  {
    label: "📍 Address & City",
    fieldKey: "address",
    defaultText: "MG Road, Trivandrum, Kerala",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 10,
    color: "#5C4E3A",
    fontWeight: "600",
  },
  {
    label: "📱 RSVP Contact",
    fieldKey: "rsvp",
    defaultText: "R.S.V.P +91 98765 43210",
    fontFamily: "'Alex Brush', cursive",
    fontSize: 16,
    color: "#8C6B1B",
  },
  {
    label: "👪 Parents / Family Line",
    fieldKey: "parentsLine",
    defaultText: "D/o Mr. & Mrs. Anderson",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 12,
    color: "#64748B",
    fontStyle: "italic",
  },
];

const LUXURY_PALETTE = [
  { name: "Gold", color: "#8C6B1B" },
  { name: "Bright Gold", color: "#D4AF37" },
  { name: "Royal Maroon", color: "#991B1B" },
  { name: "Deep Charcoal", color: "#1E293B" },
  { name: "Pure Black", color: "#0F172A" },
  { name: "Rose Gold", color: "#B76E79" },
  { name: "Forest Sage", color: "#2D4A3E" },
  { name: "Royal Navy", color: "#1E3A8A" },
  { name: "Pearl Cream", color: "#F5EBE0" },
  { name: "Pure White", color: "#FFFFFF" },
];

function CanvaTemplateBuilderInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id");

  // Template Metadata
  const [templateName, setTemplateName] = useState("New Luxury Card Template");
  const [topic, setTopic] = useState<"vintage" | "modern">("vintage");
  const [category, setCategory] = useState("Vintage Floral");
  const [aspectRatio, setAspectRatio] = useState<string>("classic");
  const [backgroundColor, setBackgroundColor] = useState("#F3EAD8");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // Zoom & Full View Fit State
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(0.78);

  // Background Customizer Mode
  const [bgMode, setBgMode] = useState<"solid" | "gradient" | "image">("gradient");
  const [customGradStart, setCustomGradStart] = useState("#FBF8EE");
  const [customGradEnd, setCustomGradEnd] = useState("#E8D8BA");
  const [customGradAngle, setCustomGradAngle] = useState(135);

  // Accordion Expand/Collapse State
  const [accordionOpen, setAccordionOpen] = useState({
    ratio: true,
    background: true,
    thumbnail: true,
    metadata: true,
  });

  const toggleAccordion = (key: "ratio" | "background" | "thumbnail" | "metadata") => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Canvas Elements
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Asset Library (Uploaded PNGs)
  const [uploadedGraphics, setUploadedGraphics] = useState<string[]>([
    "/images/canva/top-floral-arch.webp",
    "/images/canva/leaf-divider.webp",
    "/images/canva/floral-footer.webp",
    "/images/canva/vintage-swirl-header.webp",
    "/images/canva/vintage-wave-divider.webp",
    "/images/canva/vintage-swirl-footer.webp",
  ]);

  // UI state
  const [activeTab, setActiveTab] = useState<"SETTINGS" | "TEXT" | "ASSETS" | "LAYERS">("SETTINGS");
  const [testMode, setTestMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [isDraggingOverPNGTab, setIsDraggingOverPNGTab] = useState(false);
  const [statusToast, setStatusToast] = useState("");
  const [loadingInitial, setLoadingInitial] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; elX: number; elY: number } | null>(null);

  // Resizing State
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{
    mouseX: number;
    mouseY: number;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Canvas aspect ratio dimension lookup
  const selectedRatio = ASPECT_RATIOS.find((r) => r.id === aspectRatio) || ASPECT_RATIOS[0];
  const canvasDimensions = { width: selectedRatio.width, height: selectedRatio.height };

  // Fit to screen helper (calculates exact scale to fit 100% without scroll)
  const handleFitToScreen = () => {
    if (!containerRef.current) return;
    const containerH = containerRef.current.clientHeight - 85; // leaves margin for bottom zoom bar
    const containerW = containerRef.current.clientWidth - 50;
    const scaleH = containerH / canvasDimensions.height;
    const scaleW = containerW / canvasDimensions.width;
    const fitScale = Math.min(scaleH, scaleW, 1.0);
    setZoom(Math.max(0.35, Math.round(fitScale * 100) / 100));
  };

  // Auto-fit on initial mount & aspect ratio changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFitToScreen();
    }, 120);
    return () => clearTimeout(timer);
  }, [aspectRatio]);

  // Load existing template if editing
  useEffect(() => {
    if (!templateId) return;

    async function loadTemplate() {
      try {
        setLoadingInitial(true);
        const res = await fetch(`/api/admin/canva-templates/${templateId}`);
        const data = await res.json();
        if (data.template) {
          const t = data.template;
          setTemplateName(t.name);
          setTopic(t.topic || "vintage");
          setCategory(t.category || "Vintage Floral");
          setAspectRatio(t.aspectRatio || "classic");
          setBackgroundColor(t.backgroundColor || "#F3EAD8");
          if (t.backgroundColor && t.backgroundColor.includes("gradient")) {
            setBgMode("gradient");
          }
          setBackgroundImage(t.backgroundImage || null);
          setPreviewImage(t.previewImage || null);
          setIsActive(t.isActive !== false);
          setSortOrder(t.sortOrder || 0);
          setElements(t.elements || []);
        }
      } catch (err) {
        console.error("Failed to load template:", err);
      } finally {
        setLoadingInitial(false);
      }
    }

    loadTemplate();
  }, [templateId]);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Upload Single File (for Background or Preview)
  const handleUploadFile = async (file: File, type: "background" | "preview") => {
    try {
      setIsUploading(true);
      const optimizedFile = await optimizeImageForUpload(file, {
        maxDimension: type === "preview" ? 1080 : 2560,
        quality: 0.92,
      });

      const formData = new FormData();
      formData.append("file", optimizedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (type === "background") {
        setBackgroundImage(data.url);
        setBgMode("image");
        setStatusToast("Card Background updated!");
      } else if (type === "preview") {
        setPreviewImage(data.url);
        setStatusToast("Preview thumbnail updated!");
      }
      setTimeout(() => setStatusToast(""), 3500);
    } catch (err: any) {
      alert(err?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Upload Multiple PNG Overlays in Batch
  const handleUploadMultiplePNGs = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress({ current: 0, total: fileArray.length });

      const uploadedUrls: string[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setUploadProgress({ current: i + 1, total: fileArray.length });

        const optimizedFile = await optimizeImageForUpload(file, {
          maxDimension: 2560,
          quality: 0.92,
        });

        const formData = new FormData();
        formData.append("file", optimizedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setUploadedGraphics((prev) => [...uploadedUrls, ...prev]);

        // Place first one on canvas as a starter
        handleAddImageElement(uploadedUrls[0]);

        setStatusToast(
          uploadedUrls.length === 1
            ? "✨ PNG Overlay uploaded and added to canvas!"
            : `🎉 ${uploadedUrls.length} PNGs uploaded and added to library!`
        );
        setTimeout(() => setStatusToast(""), 4000);
      }
    } catch (err: any) {
      alert(err?.message || "Failed to upload PNG files");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Add Image / Overlay Element
  const handleAddImageElement = (src: string) => {
    const newEl: CanvasElement = {
      id: `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: "image",
      src,
      x: 35,
      y: 35,
      width: 30,
      height: 30,
      rotation: 0,
      opacity: 1,
      zIndex: elements.length + 1,
      isLocked: false,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Add Text Element
  const handleAddTextElement = (preset?: (typeof PRESET_FIELDS)[0]) => {
    const newEl: CanvasElement = {
      id: `txt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: "text",
      fieldKey: preset?.fieldKey || "customText",
      text: preset?.defaultText || "Custom Luxury Text",
      fontFamily: preset?.fontFamily || "'Cinzel', serif",
      fontSize: preset?.fontSize || 18,
      color: preset?.color || "#1E293B",
      fontWeight: preset?.fontWeight || "600",
      fontStyle: preset?.fontStyle || "normal",
      textAlign: "center",
      letterSpacing: preset?.letterSpacing || 1,
      lineHeight: 1.2,
      x: 10,
      y: Math.min(80, 20 + elements.length * 8),
      width: 80,
      height: 8,
      rotation: 0,
      opacity: 1,
      zIndex: elements.length + 1,
      isLocked: false,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Update selected element property
  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElementId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedElementId ? { ...el, ...updates } : el))
    );
  };

  // Update element by specific ID
  const updateElementById = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // Delete element
  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  // Duplicate element
  const handleDuplicateElement = (id: string) => {
    const target = elements.find((el) => el.id === id);
    if (!target) return;
    const duplicated: CanvasElement = {
      ...target,
      id: `copy-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      x: Math.min(90, target.x + 4),
      y: Math.min(90, target.y + 4),
      zIndex: elements.length + 1,
      isLocked: false,
    };
    setElements((prev) => [...prev, duplicated]);
    setSelectedElementId(duplicated.id);
  };

  // Z-Index ordering
  const handleMoveLayer = (id: string, direction: "up" | "down") => {
    setElements((prev) => {
      const idx = prev.findIndex((el) => el.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx + 1 : idx - 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;

      const updated = [...prev];
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;

      return updated.map((el, i) => ({ ...el, zIndex: i + 1 }));
    });
  };

  // Dragging element on canvas (Mouse & Touch)
  const handleMouseDownElement = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation();
    if (el.isLocked) return;
    setSelectedElementId(el.id);

    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elX: el.x,
      elY: el.y,
    });
  };

  const handleTouchStartElement = (e: React.TouchEvent, el: CanvasElement) => {
    e.stopPropagation();
    if (el.isLocked || e.touches.length === 0) return;
    setSelectedElementId(el.id);

    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX,
      y: touch.clientY,
      elX: el.x,
      elY: el.y,
    });
  };

  // Resizing element on canvas (Mouse & Touch)
  const handleMouseDownResize = (e: React.MouseEvent, handle: string, el: CanvasElement) => {
    e.stopPropagation();
    if (el.isLocked) return;
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height || 20,
    });
  };

  const handleTouchStartResize = (e: React.TouchEvent, handle: string, el: CanvasElement) => {
    e.stopPropagation();
    if (el.isLocked || e.touches.length === 0) return;

    const touch = e.touches[0];
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height || 20,
    });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!canvasRef.current || !selectedElementId || !selectedElement) return;
    if (selectedElement.isLocked) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Handle Resizing
    if (isResizing && resizeStart && resizeHandle) {
      const deltaX = ((e.clientX - resizeStart.mouseX) / canvasRect.width) * 100;
      const deltaY = ((e.clientY - resizeStart.mouseY) / canvasRect.height) * 100;

      if (resizeHandle === "se") {
        const newW = Math.max(5, Math.min(150, resizeStart.width + deltaX));
        const newH = Math.max(5, Math.min(150, resizeStart.height + deltaY));
        updateSelectedElement({
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
        });
      } else if (resizeHandle === "sw") {
        const newW = Math.max(5, Math.min(150, resizeStart.width - deltaX));
        const newX = resizeStart.x + (resizeStart.width - newW);
        const newH = Math.max(5, Math.min(150, resizeStart.height + deltaY));
        updateSelectedElement({
          x: Math.round(newX * 10) / 10,
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
        });
      } else if (resizeHandle === "ne") {
        const newW = Math.max(5, Math.min(150, resizeStart.width + deltaX));
        const newH = Math.max(5, Math.min(150, resizeStart.height - deltaY));
        const newY = resizeStart.y + (resizeStart.height - newH);
        updateSelectedElement({
          y: Math.round(newY * 10) / 10,
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
        });
      } else if (resizeHandle === "nw") {
        const newW = Math.max(5, Math.min(150, resizeStart.width - deltaX));
        const newH = Math.max(5, Math.min(150, resizeStart.height - deltaY));
        const newX = resizeStart.x + (resizeStart.width - newW);
        const newY = resizeStart.y + (resizeStart.height - newH);
        updateSelectedElement({
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
          width: Math.round(newW * 10) / 10,
          height: Math.round(newH * 10) / 10,
        });
      } else if (resizeHandle === "e") {
        const newW = Math.max(5, Math.min(150, resizeStart.width + deltaX));
        updateSelectedElement({ width: Math.round(newW * 10) / 10 });
      } else if (resizeHandle === "w") {
        const newW = Math.max(5, Math.min(150, resizeStart.width - deltaX));
        const newX = resizeStart.x + (resizeStart.width - newW);
        updateSelectedElement({ x: Math.round(newX * 10) / 10, width: Math.round(newW * 10) / 10 });
      } else if (resizeHandle === "s") {
        const newH = Math.max(5, Math.min(150, resizeStart.height + deltaY));
        updateSelectedElement({ height: Math.round(newH * 10) / 10 });
      } else if (resizeHandle === "n") {
        const newH = Math.max(5, Math.min(150, resizeStart.height - deltaY));
        const newY = resizeStart.y + (resizeStart.height - newH);
        updateSelectedElement({ y: Math.round(newY * 10) / 10, height: Math.round(newH * 10) / 10 });
      }
      return;
    }

    // Handle Dragging
    if (isDragging && dragStart) {
      const deltaX = ((e.clientX - dragStart.x) / canvasRect.width) * 100;
      const deltaY = ((e.clientY - dragStart.y) / canvasRect.height) * 100;

      const newX = Math.max(-30, Math.min(100, dragStart.elX + deltaX));
      const newY = Math.max(-30, Math.min(100, dragStart.elY + deltaY));

      updateSelectedElement({
        x: Math.round(newX * 10) / 10,
        y: Math.round(newY * 10) / 10,
      });
    }
  };

  const handleTouchMoveCanvas = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    handleMouseMoveCanvas({ clientX: touch.clientX, clientY: touch.clientY } as any);
  };

  const handleMouseUpCanvas = () => {
    setIsDragging(false);
    setIsResizing(false);
    setDragStart(null);
    setResizeStart(null);
    setResizeHandle(null);
  };

  const handleTouchEndCanvas = () => {
    handleMouseUpCanvas();
  };

  // Global pointer up listener to prevent stuck dragging/resizing
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  // Quick Corner & Alignment Helpers
  const handleAlign = (type: "tl" | "tr" | "bl" | "br" | "center" | "centerH" | "centerV") => {
    if (!selectedElement || selectedElement.isLocked) return;
    const w = selectedElement.width || 30;
    const h = selectedElement.height || 20;

    switch (type) {
      case "tl":
        updateSelectedElement({ x: 0, y: 0 });
        break;
      case "tr":
        updateSelectedElement({ x: Math.round((100 - w) * 10) / 10, y: 0 });
        break;
      case "bl":
        updateSelectedElement({ x: 0, y: Math.round((100 - h) * 10) / 10 });
        break;
      case "br":
        updateSelectedElement({
          x: Math.round((100 - w) * 10) / 10,
          y: Math.round((100 - h) * 10) / 10,
        });
        break;
      case "center":
        updateSelectedElement({
          x: Math.round(((100 - w) / 2) * 10) / 10,
          y: Math.round(((100 - h) / 2) * 10) / 10,
        });
        break;
      case "centerH":
        updateSelectedElement({ x: Math.round(((100 - w) / 2) * 10) / 10 });
        break;
      case "centerV":
        updateSelectedElement({ y: Math.round(((100 - h) / 2) * 10) / 10 });
        break;
    }
  };

  // Quick Scale Delta
  const handleQuickScale = (deltaPercent: number) => {
    if (!selectedElement || selectedElement.isLocked) return;
    const currentW = selectedElement.width || 30;
    const currentH = selectedElement.height || 20;
    const scaleFactor = 1 + deltaPercent / 100;

    const newW = Math.max(5, Math.min(150, Math.round(currentW * scaleFactor * 10) / 10));
    const newH = Math.max(5, Math.min(150, Math.round(currentH * scaleFactor * 10) / 10));

    updateSelectedElement({ width: newW, height: newH });
  };

  // Case Transform Helper
  const handleTransformCase = (mode: "upper" | "lower" | "title") => {
    if (!selectedElement?.text) return;
    let t = selectedElement.text;
    if (mode === "upper") t = t.toUpperCase();
    else if (mode === "lower") t = t.toLowerCase();
    else if (mode === "title") {
      t = t
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
    updateSelectedElement({ text: t });
  };

  // Custom Gradient Generator
  const applyCustomGradient = (start: string, end: string, angle: number) => {
    const grad = `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)`;
    setBackgroundColor(grad);
  };

  // Save Template to DB
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert("Please specify a template name.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name: templateName.trim(),
        topic,
        category,
        aspectRatio,
        backgroundColor,
        backgroundImage,
        previewImage: previewImage || backgroundImage || "/images/canva/template1-thumb.webp",
        elements,
        isActive,
        sortOrder,
      };

      const url = templateId
        ? `/api/admin/canva-templates/${templateId}`
        : "/api/admin/canva-templates";
      const method = templateId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to save template");

      setStatusToast(
        templateId
          ? "✨ Template updated successfully!"
          : "🎉 New Template published to Canva Studio!"
      );
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (err: any) {
      alert(err?.message || "Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden flex flex-col bg-slate-100/70 text-slate-900 font-sans select-none">
      
      {/* ── DEDICATED FIXED STUDIO TOPBAR (CLEAN WHITE & RED BRANDING) ── */}
      <header className="h-14 bg-white border-b border-slate-200 shrink-0 z-30 shadow-xs flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#991B1B]" />
            <span>Admin Hub</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#991B1B] text-xs sm:text-sm font-bold text-slate-900 outline-none px-2.5 py-1 rounded-xl transition-all w-52 sm:w-72 shadow-2xs"
              placeholder="Template Name..."
            />
            <span className="px-2 py-0.5 rounded-full bg-red-50 text-[#991B1B] text-[9px] font-extrabold uppercase tracking-wider border border-red-200">
              {topic}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[9px] font-bold border border-slate-200 hidden md:inline">
              {selectedRatio.name}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Test Personalization Mode Toggle */}
          <button
            type="button"
            onClick={() => setTestMode(!testMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              testMode
                ? "bg-[#991B1B] text-white border-[#991B1B] shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
            }`}
            title="Preview how sample bride and groom names appear"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{testMode ? "Editing Mode" : "Preview Names"}</span>
          </button>

          {/* Save & Publish */}
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveTemplate}
            className="px-4 sm:px-5 py-1.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 text-white" />
            )}
            <span>{isSaving ? "Publishing..." : "Publish Template"}</span>
          </button>
        </div>
      </header>

      {/* Success Toast */}
      {statusToast && (
        <div className="fixed top-16 right-6 z-50 bg-[#991B1B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/20 animate-slide-down">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* ── 3-COLUMN FULL-HEIGHT VIEWPORT WORKSPACE ── */}
      <div className="flex-1 min-h-0 flex flex-row overflow-hidden">
        
        {/* ── LEFT SIDEBAR (TOOLS & PRESETS) ── */}
        <aside className="w-80 h-full flex flex-col bg-white border-r border-slate-200 shrink-0 z-10 shadow-xs">
          {/* Navigation Tabs */}
          <div className="shrink-0 grid grid-cols-4 p-2 gap-1 bg-slate-50 border-b border-slate-200 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab("SETTINGS")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "SETTINGS" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>

            <button
              onClick={() => setActiveTab("TEXT")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "TEXT" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              onClick={() => setActiveTab("ASSETS")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "ASSETS" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>PNGs</span>
            </button>

            <button
              onClick={() => setActiveTab("LAYERS")}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === "LAYERS" ? "bg-[#991B1B] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>
          </div>

          {/* Scrollable Left Tab Body */}
          <div
            data-lenis-prevent
            className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar select-auto overscroll-contain"
          >
            {/* TAB 1: CANVAS SETTINGS (COLLAPSIBLE ACCORDIONS) */}
            {activeTab === "SETTINGS" && (
              <div className="space-y-3 text-xs">
                
                {/* ── ACCORDION 1: ASPECT RATIO (3 IN A ROW) ── */}
                <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("ratio")}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📐</span>
                      <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                        Aspect Ratio
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#991B1B] bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        {selectedRatio.ratioStr}
                      </span>
                      {accordionOpen.ratio ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {accordionOpen.ratio && (
                    <div className="p-3 border-t border-slate-100 space-y-2">
                      {/* 3 IN A ROW GRID */}
                      <div className="grid grid-cols-3 gap-2">
                        {ASPECT_RATIOS.map((ratio) => (
                          <button
                            key={ratio.id}
                            type="button"
                            onClick={() => setAspectRatio(ratio.id)}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-center cursor-pointer group shadow-2xs ${
                              aspectRatio === ratio.id
                                ? "bg-red-50/80 border-[#991B1B] ring-2 ring-red-100"
                                : "bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300"
                            }`}
                            title={`${ratio.name} - ${ratio.subtitle}`}
                          >
                            {/* Miniature Proportional Wireframe Box */}
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                              <div
                                className={`${ratio.boxClass} rounded-xs border-2 transition-colors ${
                                  aspectRatio === ratio.id
                                    ? "border-[#991B1B] bg-red-100/60"
                                    : "border-slate-400 bg-slate-100"
                                }`}
                              />
                            </div>

                            <span
                              className={`text-[10px] font-extrabold truncate w-full leading-tight ${
                                aspectRatio === ratio.id ? "text-[#991B1B]" : "text-slate-800"
                              }`}
                            >
                              {ratio.ratioStr}
                            </span>
                            <span className="text-[8px] text-slate-500 truncate w-full font-medium leading-tight">
                              {ratio.shortName}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── ACCORDION 2: CARD BACKGROUND & GRADIENTS (4 IN A ROW) ── */}
                <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("background")}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🎨</span>
                      <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                        Card Background
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 capitalize">
                        {bgMode}
                      </span>
                      {accordionOpen.background ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {accordionOpen.background && (
                    <div className="p-3 border-t border-slate-100 space-y-3">
                      {/* Mode Selector */}
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setBgMode("solid")}
                          className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                            bgMode === "solid"
                              ? "bg-[#991B1B] text-white shadow-2xs"
                              : "text-slate-700 hover:text-slate-900"
                          }`}
                        >
                          Solid
                        </button>
                        <button
                          type="button"
                          onClick={() => setBgMode("gradient")}
                          className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                            bgMode === "gradient"
                              ? "bg-[#991B1B] text-white shadow-2xs"
                              : "text-slate-700 hover:text-slate-900"
                          }`}
                        >
                          ✨ Gradients
                        </button>
                        <button
                          type="button"
                          onClick={() => setBgMode("image")}
                          className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                            bgMode === "image"
                              ? "bg-[#991B1B] text-white shadow-2xs"
                              : "text-slate-700 hover:text-slate-900"
                          }`}
                        >
                          Image
                        </button>
                      </div>

                      {/* SOLID COLOR CONTROLS */}
                      {bgMode === "solid" && (
                        <div className="space-y-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={backgroundColor.startsWith("#") ? backgroundColor : "#F3EAD8"}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                            />
                            <input
                              type="text"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono uppercase text-xs"
                              placeholder="#F3EAD8"
                            />
                          </div>

                          {/* Quick Solid Swatches */}
                          <div className="flex items-center gap-1 flex-wrap pt-1">
                            {LUXURY_PALETTE.map((pal, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setBackgroundColor(pal.color)}
                                style={{ backgroundColor: pal.color }}
                                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-115 cursor-pointer shadow-2xs ${
                                  backgroundColor === pal.color
                                    ? "border-[#991B1B] ring-2 ring-red-200"
                                    : "border-white"
                                }`}
                                title={pal.name}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* LUXURY GRADIENTS (4 IN A ROW GRID) */}
                      {bgMode === "gradient" && (
                        <div className="space-y-3">
                          {/* 4 IN A ROW GRADIENT SWATCHES */}
                          <div className="grid grid-cols-4 gap-1.5">
                            {LUXURY_GRADIENTS.map((grad, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setBackgroundColor(grad.value)}
                                className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer group shadow-2xs ${
                                  backgroundColor === grad.value
                                    ? "border-[#991B1B] ring-2 ring-red-200 bg-red-50/50"
                                    : "border-slate-200 bg-slate-50 hover:bg-white"
                                }`}
                                title={grad.name}
                              >
                                <div
                                  style={{ background: grad.value }}
                                  className="w-full h-8 rounded-lg shadow-inner border border-black/10 group-hover:scale-105 transition-transform"
                                />
                                <span className="text-[8px] font-bold text-slate-700 truncate w-full leading-tight">
                                  {grad.name.split(" ")[0]}
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Custom 2-Color Gradient Builder */}
                          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                            <span className="font-bold text-slate-800 text-[9px] uppercase tracking-wider block">
                              🛠️ Custom 2-Color Gradient Builder
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-0.5">
                                <label className="text-[9px] text-slate-500 font-semibold">Start Color</label>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="color"
                                    value={customGradStart}
                                    onChange={(e) => {
                                      setCustomGradStart(e.target.value);
                                      applyCustomGradient(e.target.value, customGradEnd, customGradAngle);
                                    }}
                                    className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                                  />
                                  <input
                                    type="text"
                                    value={customGradStart}
                                    onChange={(e) => {
                                      setCustomGradStart(e.target.value);
                                      applyCustomGradient(e.target.value, customGradEnd, customGradAngle);
                                    }}
                                    className="w-full p-1 bg-white border border-slate-200 rounded text-[9px] font-mono uppercase"
                                  />
                                </div>
                              </div>

                              <div className="space-y-0.5">
                                <label className="text-[9px] text-slate-500 font-semibold">End Color</label>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="color"
                                    value={customGradEnd}
                                    onChange={(e) => {
                                      setCustomGradEnd(e.target.value);
                                      applyCustomGradient(customGradStart, e.target.value, customGradAngle);
                                    }}
                                    className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                                  />
                                  <input
                                    type="text"
                                    value={customGradEnd}
                                    onChange={(e) => {
                                      setCustomGradEnd(e.target.value);
                                      applyCustomGradient(customGradStart, e.target.value, customGradAngle);
                                    }}
                                    className="w-full p-1 bg-white border border-slate-200 rounded text-[9px] font-mono uppercase"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-0.5 pt-1">
                              <div className="flex items-center justify-between text-[9px] text-slate-700 font-bold">
                                <span>Angle</span>
                                <span>{customGradAngle}°</span>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={360}
                                value={customGradAngle}
                                onChange={(e) => {
                                  const angle = Number(e.target.value);
                                  setCustomGradAngle(angle);
                                  applyCustomGradient(customGradStart, customGradEnd, angle);
                                }}
                                className="w-full accent-[#991B1B]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* BG IMAGE CONTROLS */}
                      {bgMode === "image" && (
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Uploaded BG Image</span>
                            {backgroundImage && (
                              <button
                                onClick={() => setBackgroundImage(null)}
                                className="text-[10px] font-bold text-[#991B1B] hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 hover:border-[#991B1B] rounded-xl cursor-pointer bg-white transition-all text-center">
                            <Upload className="w-4 h-4 text-slate-400 mb-1" />
                            <span className="text-[10px] font-bold text-slate-700">
                              {isUploading ? "Optimizing & Uploading..." : "Upload Full Card BG"}
                            </span>
                            <span className="text-[8px] text-slate-400">Auto-optimized for 4K Retina</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadFile(file, "background");
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── ACCORDION 3: TEMPLATE PREVIEW THUMBNAIL / COVER ── */}
                <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("thumbnail")}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🖼️</span>
                      <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                        Template Preview Cover / Thumbnail
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {previewImage ? (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Custom Cover
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Auto
                        </span>
                      )}
                      {accordionOpen.thumbnail ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {accordionOpen.thumbnail && (
                    <div className="p-3 border-t border-slate-100 space-y-3">
                      {previewImage ? (
                        <div className="space-y-2">
                          <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-4/5 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previewImage}
                              alt="Template Thumbnail Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                              <label className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-[10px] font-bold cursor-pointer hover:bg-slate-100 shadow-md">
                                Change Thumbnail
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={isUploading}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadFile(file, "preview");
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => setPreviewImage(null)}
                                className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-[10px] font-bold cursor-pointer hover:bg-red-700 shadow-md"
                              >
                                Reset to Auto
                              </button>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 text-center font-medium">
                            Displaying on the Admin Hub and /canva Studio catalog.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-[#991B1B] rounded-xl cursor-pointer bg-slate-50/60 hover:bg-white transition-all text-center">
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <span className="text-[11px] font-bold text-slate-800">
                              {isUploading ? "Uploading Preview..." : "Upload Custom Catalog Thumbnail"}
                            </span>
                            <span className="text-[9px] text-slate-400 mt-0.5">
                              JPEG / PNG / WebP (Used for template cards)
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadFile(file, "preview");
                              }}
                            />
                          </label>
                          <p className="text-[9px] text-slate-500 italic text-center">
                            💡 If no custom thumbnail is uploaded, the background or card preview is used automatically.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── ACCORDION 4: TEMPLATE METADATA & STATUS ── */}
                <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleAccordion("metadata")}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🏷️</span>
                      <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                        Template Info &amp; Status
                      </span>
                    </div>
                    {accordionOpen.metadata ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {accordionOpen.metadata && (
                    <div className="p-3 border-t border-slate-100 space-y-2.5">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Template Topic</label>
                        <select
                          value={topic}
                          onChange={(e) => setTopic(e.target.value as any)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#991B1B]"
                        >
                          <option value="vintage">📜 Vintage / Parchment</option>
                          <option value="modern">✨ Modern / Contemporary</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Category Tag</label>
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#991B1B]"
                          placeholder="e.g. Royal Heritage, Floral Arch"
                        />
                      </div>

                      <div className="pt-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="isActiveTpl"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 rounded text-[#991B1B] accent-[#991B1B] cursor-pointer"
                          />
                          <label htmlFor="isActiveTpl" className="text-slate-800 font-medium cursor-pointer">
                            Active &amp; Visible in /canva Studio
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: TEXT PRESETS (Bride & Groom Separated) */}
            {activeTab === "TEXT" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Invitation Text Fields</span>
                  <button
                    onClick={() => handleAddTextElement()}
                    className="text-[11px] font-bold text-[#991B1B] hover:text-[#7F1D1D] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Plain Text</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {PRESET_FIELDS.map((field, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddTextElement(field)}
                      className="w-full p-3 bg-slate-50 hover:bg-red-50/50 border border-slate-200 hover:border-[#991B1B] rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#991B1B] transition-colors">
                          {field.label}
                        </p>
                        <p className="text-[10px] text-slate-500 italic truncate max-w-[200px]">
                          &ldquo;{field.defaultText}&rdquo;
                        </p>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#991B1B] transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ASSETS (MULTI-PNG BATCH UPLOAD & LIBRARY) */}
            {activeTab === "ASSETS" && (
              <div className="space-y-4">
                {/* Multi-PNG Dropzone & Upload Button */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      PNG Overlays Library
                    </span>
                    <label className="text-[11px] font-bold text-[#991B1B] hover:text-[#7F1D1D] flex items-center gap-1 cursor-pointer bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 transition-colors">
                      <FolderUp className="w-3.5 h-3.5" />
                      <span>+ Select PNGs</span>
                      <input
                        type="file"
                        multiple
                        accept="image/png,image/webp"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleUploadMultiplePNGs(e.target.files);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Drag & Drop Multi-file Box */}
                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingOverPNGTab(true);
                    }}
                    onDragLeave={() => setIsDraggingOverPNGTab(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingOverPNGTab(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleUploadMultiplePNGs(e.dataTransfer.files);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-3.5 border-2 border-dashed rounded-2xl cursor-pointer transition-all text-center ${
                      isDraggingOverPNGTab
                        ? "border-[#991B1B] bg-red-50/80 scale-101"
                        : "border-slate-300 hover:border-[#991B1B] bg-slate-50/60 hover:bg-white"
                    }`}
                  >
                    <Upload className={`w-5 h-5 mb-1 transition-colors ${
                      isDraggingOverPNGTab ? "text-[#991B1B]" : "text-slate-400"
                    }`} />
                    
                    {isUploading && uploadProgress ? (
                      <div className="space-y-1 w-full px-2">
                        <span className="text-[11px] font-bold text-[#991B1B] block">
                          Optimizing &amp; Uploading ({uploadProgress.current} / {uploadProgress.total})...
                        </span>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#991B1B] h-full transition-all duration-300"
                            style={{
                              width: `${Math.round((uploadProgress.current / uploadProgress.total) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="text-[11px] font-bold text-slate-800">
                          Drop multiple PNGs here or Browse
                        </span>
                        <span className="text-[9px] text-slate-500">
                          Upload transparent PNG arches, florals, swirls (Batch multi-upload supported)
                        </span>
                      </>
                    )}

                    <input
                      type="file"
                      multiple
                      accept="image/png,image/webp"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleUploadMultiplePNGs(e.target.files);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* PNG Library Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <span>Available Assets ({uploadedGraphics.length})</span>
                    <span className="text-[9px] font-medium text-slate-400">Click to add on canvas</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {uploadedGraphics.map((src, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleAddImageElement(src)}
                        className="group relative p-2.5 bg-slate-50 border border-slate-200 hover:border-[#991B1B] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-102 hover:bg-white shadow-2xs"
                        title="Click to add onto canvas"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt="Overlay"
                          className="h-16 w-full object-contain filter drop-shadow-xs"
                        />
                        <span className="text-[9px] font-bold text-[#991B1B] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          + Add Layer
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: LAYERS LIST (WITH LOCK / UNLOCK TOGGLES) */}
            {activeTab === "LAYERS" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Layer Stack ({elements.length} Layers)
                </span>

                {elements.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No layers added yet. Add a PNG or Text layer to get started!
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {[...elements].reverse().map((el) => {
                      const isSelected = selectedElementId === el.id;

                      return (
                        <div
                          key={el.id}
                          onClick={() => setSelectedElementId(el.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                            isSelected
                              ? el.isLocked
                                ? "bg-amber-50/90 border-amber-500 text-slate-900 shadow-2xs ring-1 ring-amber-300"
                                : "bg-red-50/80 border-[#991B1B] text-slate-900 shadow-2xs ring-1 ring-red-200"
                              : el.isLocked
                              ? "bg-slate-100/90 border-slate-300/80 text-slate-500"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {/* Layer Title & Icon */}
                          <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 pr-2">
                            {el.type === "image" ? (
                              <ImageIcon className="w-3.5 h-3.5 text-[#991B1B] shrink-0" />
                            ) : (
                              <Type className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                            )}
                            <span className="truncate font-bold text-[11px]">
                              {el.type === "image"
                                ? "PNG Graphic"
                                : el.fieldKey
                                ? `Field: ${el.fieldKey}`
                                : el.text}
                            </span>
                            {el.isLocked && (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 py-0.2 rounded shrink-0 flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> Locked
                              </span>
                            )}
                          </div>

                          {/* Action Buttons: Lock/Unlock, Move, Delete */}
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Lock / Unlock Toggle Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateElementById(el.id, { isLocked: !el.isLocked });
                              }}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                el.isLocked
                                  ? "text-amber-800 bg-amber-200 hover:bg-amber-300"
                                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                              }`}
                              title={el.isLocked ? "Unlock Layer (Click to allow moving)" : "Lock Layer (Click to freeze position)"}
                            >
                              {el.isLocked ? (
                                <Lock className="w-3.5 h-3.5 text-amber-800" />
                              ) : (
                                <Unlock className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveLayer(el.id, "up");
                              }}
                              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded cursor-pointer"
                              title="Bring Forward"
                            >
                              <MoveUp className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveLayer(el.id, "down");
                              }}
                              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded cursor-pointer"
                              title="Send Backward"
                            >
                              <MoveDown className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteElement(el.id);
                              }}
                              className="p-1 text-slate-400 hover:text-[#991B1B] hover:bg-red-50 rounded cursor-pointer"
                              title="Delete Layer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* ── CENTER WORKSPACE CANVAS (SCALED FULL VIEW WITHOUT SCROLL) ── */}
        <main
          ref={containerRef}
          data-lenis-prevent
          className={`flex-1 h-full min-h-0 ${
            zoom > 1.05 ? "overflow-auto" : "overflow-hidden"
          } bg-slate-100/80 flex flex-col items-center justify-center p-4 relative overscroll-contain select-none`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedElementId(null);
            }
          }}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          onTouchMove={handleTouchMoveCanvas}
          onTouchEnd={handleTouchEndCanvas}
        >
          {/* Zoomable Wrapper */}
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDragging || isResizing ? "none" : "transform 0.15s ease-out",
            }}
            className="shrink-0 flex items-center justify-center pointer-events-auto"
          >
            {/* Canvas Card Mockup */}
            <div
              ref={canvasRef}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedElementId(null);
                }
              }}
              style={{
                width: `${canvasDimensions.width}px`,
                height: `${canvasDimensions.height}px`,
                backgroundColor:
                  backgroundColor && (backgroundColor.startsWith("#") || backgroundColor.startsWith("rgb"))
                    ? backgroundColor
                    : undefined,
                backgroundImage: backgroundImage
                  ? `url(${backgroundImage})`
                  : backgroundColor && backgroundColor.includes("gradient")
                  ? backgroundColor
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              className="relative rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden select-none"
            >
              {/* Render Layers */}
              {elements.map((el) => {
                const isSelected = selectedElementId === el.id;

                return (
                  <div
                    key={el.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (el.isLocked) return;
                      setSelectedElementId(el.id);
                    }}
                    onMouseDown={(e) => {
                      if (el.isLocked) return;
                      handleMouseDownElement(e, el);
                    }}
                    onTouchStart={(e) => {
                      if (el.isLocked) return;
                      handleTouchStartElement(e, el);
                    }}
                    style={{
                      position: "absolute",
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: el.height ? `${el.height}%` : "auto",
                      transform: `rotate(${el.rotation || 0}deg) ${el.flipH ? "scaleX(-1)" : ""} ${el.flipV ? "scaleY(-1)" : ""}`,
                      opacity: el.opacity ?? 1,
                      zIndex: el.zIndex,
                      pointerEvents: el.isLocked && !isSelected ? "none" : "auto",
                    }}
                    className={`group ${el.isLocked ? "cursor-default" : "cursor-move"} transition-shadow ${
                      isSelected
                        ? el.isLocked
                          ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-white/80"
                          : "ring-2 ring-[#991B1B] ring-offset-2 ring-offset-white/80"
                        : ""
                    }`}
                  >
                    {/* Layer Content */}
                    {el.type === "image" && el.src && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={el.src}
                        alt="Overlay"
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    )}

                    {el.type === "text" && (
                      <div
                        style={{
                          color: el.gradient ? "transparent" : el.color || "#1E293B",
                          backgroundImage: el.gradient || undefined,
                          WebkitBackgroundClip: el.gradient ? "text" : undefined,
                          WebkitTextFillColor: el.gradient ? "transparent" : undefined,
                          fontFamily: el.fontFamily || "'Cinzel', serif",
                          fontSize: `${el.fontSize || 16}px`,
                          fontWeight: el.fontWeight || "normal",
                          fontStyle: el.fontStyle || "normal",
                          textDecoration: el.textDecoration || "none",
                          textTransform: el.textTransform || "none",
                          textAlign: el.textAlign || "center",
                          letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
                          lineHeight: el.lineHeight || 1.2,
                          textShadow: el.textShadow || "none",
                        }}
                        className="whitespace-pre-wrap w-full h-full flex items-center justify-center p-0.5"
                      >
                        {testMode
                          ? el.fieldKey === "groomName"
                            ? "Alexander"
                            : el.fieldKey === "brideName"
                            ? "Sophia"
                            : el.fieldKey === "connector"
                            ? "&"
                            : el.fieldKey === "coupleNames"
                            ? "Sophia & Alexander"
                            : el.fieldKey === "date"
                            ? "OCTOBER 30, 2026"
                            : el.fieldKey === "time"
                            ? "4:30 PM"
                            : el.fieldKey === "venue"
                            ? "ELAMBA MUDAKKAL PALACE"
                            : el.text || "Text Layer"
                          : el.text || "Text Layer"}
                      </div>
                    )}

                    {/* ── LOCKED PILL BADGE ON CANVAS (WHEN SELECTED VIA LAYERS PANEL) ── */}
                    {isSelected && el.isLocked && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-40 whitespace-nowrap">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Locked Layer</span>
                      </div>
                    )}

                    {/* ── 8-POINT INTERACTIVE RESIZE & ROTATE HANDLES (ONLY WHEN UNLOCKED & SELECTED) ── */}
                    {isSelected && !el.isLocked && (
                      <>
                        {/* Top-Left Handle */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "nw", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "nw", el)}
                          className="absolute -top-2 -left-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#991B1B] shadow-sm cursor-nwse-resize hover:scale-125 transition-transform z-30"
                        />

                        {/* Top-Right Handle */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "ne", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "ne", el)}
                          className="absolute -top-2 -right-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#991B1B] shadow-sm cursor-nesw-resize hover:scale-125 transition-transform z-30"
                        />

                        {/* Bottom-Left Handle */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "sw", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "sw", el)}
                          className="absolute -bottom-2 -left-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#991B1B] shadow-sm cursor-nesw-resize hover:scale-125 transition-transform z-30"
                        />

                        {/* Bottom-Right Handle */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "se", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "se", el)}
                          className="absolute -bottom-2 -right-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#991B1B] shadow-sm cursor-nwse-resize hover:scale-125 transition-transform z-30"
                        />

                        {/* Edge Middle Handles */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "n", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "n", el)}
                          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2 rounded-full bg-white border border-[#991B1B] cursor-ns-resize z-30"
                        />
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "s", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "s", el)}
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2 rounded-full bg-white border border-[#991B1B] cursor-ns-resize z-30"
                        />
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "w", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "w", el)}
                          className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-4 rounded-full bg-white border border-[#991B1B] cursor-ew-resize z-30"
                        />
                        <div
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => handleMouseDownResize(e, "e", el)}
                          onTouchStart={(e) => handleTouchStartResize(e, "e", el)}
                          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-4 rounded-full bg-white border border-[#991B1B] cursor-ew-resize z-30"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── FLOATING ZOOM & VIEW CONTROLS (BOTTOM CENTER) ── */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3 py-1.5 shadow-xl flex items-center gap-2 z-30 text-xs font-bold text-slate-700 select-none">
            {/* Zoom Out Button */}
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(0.3, Math.round((prev - 0.1) * 10) / 10))}
              className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title="Zoom Out (-10%)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Percentage Display */}
            <button
              type="button"
              onClick={handleFitToScreen}
              className="w-12 text-center text-[11px] font-extrabold text-slate-900 font-mono hover:text-[#991B1B] cursor-pointer"
              title="Click to auto-fit to screen"
            >
              {Math.round(zoom * 100)}%
            </button>

            {/* Zoom In Button */}
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(2.0, Math.round((prev + 0.1) * 10) / 10))}
              className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title="Zoom In (+10%)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-0.5" />

            {/* Fit to Screen Button */}
            <button
              type="button"
              onClick={handleFitToScreen}
              className="px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-[#991B1B] text-[10px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer border border-red-200"
              title="Auto-Fit Full Card on Screen (No Scrolling)"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Fit Screen</span>
            </button>

            {/* 100% Zoom Button */}
            <button
              type="button"
              onClick={() => setZoom(1.0)}
              className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
              title="100% Actual Pixel Size"
            >
              100%
            </button>
          </div>
        </main>

        {/* ── RIGHT INSPECTOR PANEL (TYPOGRAPHY & POSITION) ── */}
        <aside
          data-lenis-prevent
          className="w-80 h-full flex flex-col bg-white border-l border-slate-200 shrink-0 z-10 shadow-xs overscroll-contain"
        >
          {selectedElement ? (
            <div className="flex-1 min-h-0 flex flex-col">
              {/* Header with Layer Actions */}
              <div className="shrink-0 p-3.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-[#991B1B] uppercase tracking-wider text-[11px]">
                  {selectedElement.type === "text" ? "✍️ Typography & Text" : "🖼️ Image Layer Inspector"}
                </span>
                <div className="flex items-center gap-1.5">
                  {/* Lock / Unlock Toggle */}
                  <button
                    type="button"
                    onClick={() => updateSelectedElement({ isLocked: !selectedElement.isLocked })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
                      selectedElement.isLocked
                        ? "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                    }`}
                    title={selectedElement.isLocked ? "Unlock Layer" : "Lock Layer (Click to freeze position)"}
                  >
                    {selectedElement.isLocked ? (
                      <Lock className="w-3 h-3 text-amber-800" />
                    ) : (
                      <Unlock className="w-3 h-3 text-slate-500" />
                    )}
                    <span>{selectedElement.isLocked ? "Locked" : "Lock"}</span>
                  </button>

                  <button
                    onClick={() => handleDuplicateElement(selectedElement.id)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Duplicate Layer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteElement(selectedElement.id)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#991B1B] transition-colors cursor-pointer"
                    title="Delete Layer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Inspector Body */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
                
                {/* 🔒 LOCKED BANNER NOTIFICATION */}
                {selectedElement.isLocked && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        Layer is Locked
                      </span>
                      <button
                        type="button"
                        onClick={() => updateSelectedElement({ isLocked: false })}
                        className="text-[10px] font-extrabold text-[#991B1B] hover:underline cursor-pointer"
                      >
                        Unlock Now
                      </button>
                    </div>
                    <p className="text-[10px] text-amber-700 leading-normal">
                      This element cannot be clicked or moved directly on the canvas. You can style it here or unlock it to drag.
                    </p>
                  </div>
                )}

                {/* ── TYPOGRAPHY CONTROLS (PLACED FIRST FOR TEXT LAYERS) ── */}
                {selectedElement.type === "text" && (
                  <div className="space-y-4">
                    {/* Layer Text Content */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">Layer Text</label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleTransformCase("upper")}
                            className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold cursor-pointer"
                            title="Convert to UPPERCASE"
                          >
                            AA
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTransformCase("title")}
                            className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold cursor-pointer"
                            title="Convert to Title Case"
                          >
                            Aa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTransformCase("lower")}
                            className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold cursor-pointer"
                            title="Convert to lowercase"
                          >
                            aa
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={selectedElement.text || ""}
                        onChange={(e) => updateSelectedElement({ text: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#991B1B] text-xs leading-relaxed"
                      />
                    </div>

                    {/* Personalization Field Mapping */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">User Personalization Field</label>
                      <select
                        value={selectedElement.fieldKey || "customText"}
                        onChange={(e) => updateSelectedElement({ fieldKey: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none font-medium text-xs focus:border-[#991B1B]"
                      >
                        <option value="groomName">🤵 Groom Name (e.g. Alexander)</option>
                        <option value="brideName">👰 Bride Name (e.g. Sophia)</option>
                        <option value="connector">💍 Connector (e.g. &amp; / WEDS / and)</option>
                        <option value="coupleNames">👑 Combined Couple Names (e.g. Groom &amp; Bride)</option>
                        <option value="tagline">📜 Tagline (e.g. Together with their families)</option>
                        <option value="inviteLine">💌 Invite Line (e.g. Request the pleasure of...)</option>
                        <option value="date">📅 Wedding Date (e.g. OCTOBER 30, 2026)</option>
                        <option value="time">⏰ Event Time (e.g. 6:30 PM)</option>
                        <option value="venue">🏛️ Venue Name (e.g. Grand Ballroom)</option>
                        <option value="address">📍 Address (e.g. MG Road, Kerala)</option>
                        <option value="rsvp">📱 RSVP Contact (e.g. +91 98765 43210)</option>
                        <option value="parentsLine">👪 Parents / Family Line</option>
                        <option value="customText">🔤 Static Text (No replacement)</option>
                      </select>
                    </div>

                    {/* Font Family Selector (With Categorized Groups) */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Font Family</label>
                      <select
                        value={selectedElement.fontFamily || "'Cinzel', serif"}
                        onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#991B1B] text-xs"
                      >
                        {FONT_CATEGORIES.map((cat, idx) => (
                          <optgroup key={idx} label={`── ${cat.category} ──`}>
                            {cat.fonts.map((f, fIdx) => (
                              <option key={fIdx} value={f.family}>
                                {f.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {/* Font Size with Stepper & Slider */}
                    <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">Font Size</label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedElement({
                                fontSize: Math.max(8, (selectedElement.fontSize || 16) - 2),
                              })
                            }
                            className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center font-bold text-slate-900">
                            {selectedElement.fontSize || 16}px
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedElement({
                                fontSize: Math.min(120, (selectedElement.fontSize || 16) + 2),
                              })
                            }
                            className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={8}
                        max={100}
                        value={selectedElement.fontSize || 16}
                        onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) })}
                        className="w-full accent-[#991B1B]"
                      />
                    </div>

                    {/* Font Weight & Styling */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800">Font Weight &amp; Style</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { label: "Light", weight: "300" },
                          { label: "Regular", weight: "400" },
                          { label: "SemiBold", weight: "600" },
                          { label: "Bold", weight: "700" },
                        ].map((w) => (
                          <button
                            key={w.weight}
                            type="button"
                            onClick={() => updateSelectedElement({ fontWeight: w.weight })}
                            className={`py-1.5 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                              (selectedElement.fontWeight || "400") === w.weight
                                ? "bg-[#991B1B] text-white border-[#991B1B]"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedElement({
                              fontStyle: selectedElement.fontStyle === "italic" ? "normal" : "italic",
                            })
                          }
                          className={`flex-1 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                            selectedElement.fontStyle === "italic"
                              ? "bg-[#991B1B] text-white border-[#991B1B]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <Italic className="w-3.5 h-3.5" />
                          <span>Italic</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateSelectedElement({
                              textDecoration:
                                selectedElement.textDecoration === "underline" ? "none" : "underline",
                            })
                          }
                          className={`flex-1 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                            selectedElement.textDecoration === "underline"
                              ? "bg-[#991B1B] text-white border-[#991B1B]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <Underline className="w-3.5 h-3.5" />
                          <span>Underline</span>
                        </button>
                      </div>
                    </div>

                    {/* Text Color, Solid & Metallic Gradients */}
                    <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">Text Color &amp; Foil</label>
                        {selectedElement.gradient ? (
                          <button
                            onClick={() => updateSelectedElement({ gradient: undefined })}
                            className="text-[10px] font-bold text-[#991B1B] hover:underline cursor-pointer"
                          >
                            Clear Gradient
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedElement.color || "#1E293B"}
                              onChange={(e) => updateSelectedElement({ color: e.target.value, gradient: undefined })}
                              className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-0"
                            />
                            <input
                              type="text"
                              value={selectedElement.color || "#1E293B"}
                              onChange={(e) => updateSelectedElement({ color: e.target.value, gradient: undefined })}
                              className="w-20 p-1 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px] uppercase text-center"
                            />
                          </div>
                        )}
                      </div>

                      {/* Quick Palette Swatches */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {LUXURY_PALETTE.map((pal, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => updateSelectedElement({ color: pal.color, gradient: undefined })}
                            style={{ backgroundColor: pal.color }}
                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-115 cursor-pointer shadow-2xs ${
                              selectedElement.color === pal.color && !selectedElement.gradient
                                ? "border-[#991B1B] ring-2 ring-red-200"
                                : "border-white"
                            }`}
                            title={pal.name}
                          />
                        ))}
                      </div>

                      {/* Metallic Text Gradient Presets */}
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[10px] font-bold text-slate-700 block mb-1.5">
                          ✨ Metallic Text Foil Gradients
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {TEXT_GRADIENTS.map((g, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => updateSelectedElement({ gradient: g.value })}
                              className={`py-1 px-1.5 rounded-lg border text-[9px] font-bold truncate transition-colors text-center cursor-pointer ${
                                selectedElement.gradient === g.value
                                  ? "bg-[#991B1B] text-white border-[#991B1B]"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {g.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Alignment & Letter Spacing */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800">Alignment</label>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          {(["left", "center", "right"] as const).map((align) => (
                            <button
                              key={align}
                              type="button"
                              onClick={() => updateSelectedElement({ textAlign: align })}
                              className={`flex-1 py-1 rounded text-center font-bold text-[10px] uppercase transition-colors cursor-pointer ${
                                (selectedElement.textAlign || "center") === align
                                  ? "bg-[#991B1B] text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-800">
                          Letter Spacing ({selectedElement.letterSpacing || 0}px)
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={12}
                          value={selectedElement.letterSpacing || 0}
                          onChange={(e) =>
                            updateSelectedElement({ letterSpacing: Number(e.target.value) })
                          }
                          className="w-full accent-[#991B1B]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── IMAGE SPECIFIC CONTROLS ── */}
                {selectedElement.type === "image" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedElement.src}
                        alt="Selected"
                        className="h-24 w-full object-contain mx-auto"
                      />
                    </div>
                  </div>
                )}

                {/* ── LAYOUT, POSITION & CORNER SNAP CONTROLS ── */}
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  {/* Quick Corner Snap Grid */}
                  <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider block">
                      Quick Position &amp; Corner Snap
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("tl")}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-700 text-[10px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shadow-2xs disabled:opacity-50"
                        title="Snap to Top-Left Corner"
                      >
                        <CornerUpLeft className="w-3.5 h-3.5 text-[#991B1B]" />
                        <span>Top-L</span>
                      </button>

                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("tr")}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-700 text-[10px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shadow-2xs disabled:opacity-50"
                        title="Snap to Top-Right Corner"
                      >
                        <CornerUpRight className="w-3.5 h-3.5 text-[#991B1B]" />
                        <span>Top-R</span>
                      </button>

                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("bl")}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-700 text-[10px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shadow-2xs disabled:opacity-50"
                        title="Snap to Bottom-Left Corner"
                      >
                        <CornerDownLeft className="w-3.5 h-3.5 text-[#991B1B]" />
                        <span>Btm-L</span>
                      </button>

                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("br")}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-700 text-[10px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shadow-2xs disabled:opacity-50"
                        title="Snap to Bottom-Right Corner"
                      >
                        <CornerDownRight className="w-3.5 h-3.5 text-[#991B1B]" />
                        <span>Btm-R</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("centerH")}
                        className="py-1 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold text-center cursor-pointer disabled:opacity-50"
                      >
                        Center ↔
                      </button>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("centerV")}
                        className="py-1 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold text-center cursor-pointer disabled:opacity-50"
                      >
                        Center ↕
                      </button>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleAlign("center")}
                        className="py-1 px-2 rounded-lg bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-700 text-[10px] font-bold text-center cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <Crosshair className="w-3 h-3 text-[#991B1B]" />
                        <span>Center</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Scale (Big / Small) Buttons */}
                  <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider block">
                      Quick Scale (Resize Box)
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleQuickScale(-20)}
                        className="py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        -20%
                      </button>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleQuickScale(-10)}
                        className="py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        -10%
                      </button>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleQuickScale(10)}
                        className="py-1.5 rounded-lg bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-900 font-bold text-[11px] cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        +10%
                      </button>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => handleQuickScale(20)}
                        className="py-1.5 rounded-lg bg-white hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 text-slate-900 font-bold text-[11px] cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        +20%
                      </button>
                    </div>
                  </div>

                  {/* Dimensions (Width % & Height %) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Width ({selectedElement.width}%)</label>
                      <input
                        type="range"
                        min={5}
                        max={120}
                        disabled={selectedElement.isLocked}
                        value={selectedElement.width}
                        onChange={(e) => updateSelectedElement({ width: Number(e.target.value) })}
                        className="w-full accent-[#991B1B] disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Height ({selectedElement.height || 20}%)</label>
                      <input
                        type="range"
                        min={5}
                        max={120}
                        disabled={selectedElement.isLocked}
                        value={selectedElement.height || 20}
                        onChange={(e) => updateSelectedElement({ height: Number(e.target.value) })}
                        className="w-full accent-[#991B1B] disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Rotation & Flips */}
                  <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800">Rotation ({selectedElement.rotation || 0}°)</label>
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() =>
                          updateSelectedElement({ rotation: ((selectedElement.rotation || 0) + 90) % 360 })
                        }
                        className="text-[10px] font-bold text-[#991B1B] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>+90°</span>
                      </button>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      disabled={selectedElement.isLocked}
                      value={selectedElement.rotation || 0}
                      onChange={(e) => updateSelectedElement({ rotation: Number(e.target.value) })}
                      className="w-full accent-[#991B1B] disabled:opacity-50"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => updateSelectedElement({ flipH: !selectedElement.flipH })}
                        className={`flex-1 py-1 px-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50 ${
                          selectedElement.flipH
                            ? "bg-[#991B1B] text-white border-[#991B1B]"
                            : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        <FlipHorizontal className="w-3 h-3" />
                        <span>Flip H</span>
                      </button>

                      <button
                        type="button"
                        disabled={selectedElement.isLocked}
                        onClick={() => updateSelectedElement({ flipV: !selectedElement.flipV })}
                        className={`flex-1 py-1 px-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50 ${
                          selectedElement.flipV
                            ? "bg-[#991B1B] text-white border-[#991B1B]"
                            : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        <FlipVertical className="w-3 h-3" />
                        <span>Flip V</span>
                      </button>
                    </div>
                  </div>

                  {/* Common Layer Controls: Opacity & Position */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800">
                      Layer Opacity ({Math.round((selectedElement.opacity ?? 1) * 100)}%)
                    </label>
                    <input
                      type="range"
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={selectedElement.opacity ?? 1}
                      onChange={(e) => updateSelectedElement({ opacity: Number(e.target.value) })}
                      className="w-full accent-[#991B1B]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-bold text-slate-700">No Layer Selected</p>
              <p className="text-[11px] leading-relaxed">
                Click on any text or graphic element on the canvas to customize its font, size, groom/bride fields, position, and colors.
              </p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}

export default function AdminCanvaTemplateBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-[#991B1B] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-[#991B1B] uppercase tracking-wider">
            Loading Canva Template Studio...
          </p>
        </div>
      }
    >
      <CanvaTemplateBuilderInner />
    </Suspense>
  );
}
