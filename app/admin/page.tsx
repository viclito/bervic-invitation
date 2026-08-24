"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Users,
  CreditCard,
  Layers,
  Sparkles,
  Search,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  IndianRupee,
  X,
  Crown,
  ArrowLeft,
  Lock,
  Check,
  Package,
  MessageSquare,
  Send,
  Clock,
  Truck,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Eye,
  ExternalLink,
  ShoppingBag,
  Edit3,
  Trash2,
  Loader2,
  Plus,
  Upload,
  Image as ImageIcon,
  Link2,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  MinusSquare,
  SlidersHorizontal,
  EyeOff,
  UserPlus,
  UserCheck,
  UserX,
  Key,
  ShieldAlert,
  BarChart3,
} from "lucide-react";
import { optimizeImageForUpload } from "@/lib/imageOptimizer";
import { CARD_PRICING_TIERS, calculateTieredCardPrice } from "@/lib/pricing";

export interface AdminStaff {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  adminPermissions: string[];
  isSuperAdmin: boolean;
  createdAt: string;
}

export interface UserCandidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  plan: string;
  createdAt: string;
}

export interface AdminProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  adminPermissions: string[];
  isSuperAdmin: boolean;
}

export interface AdminShopProduct {
  id: string;
  name: string;
  category: string;
  pricePerCard: number;
  minCopies: number;
  previewImage: string;
  galleryImages?: string | null;
  badge?: string | null;
  paperType: string;
  dimensions: string;
  description: string;
  featuresJson: string;
  canvaTemplateId?: string | null;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

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

export interface AdminCanvaTemplate {
  id: string;
  slug: string;
  name: string;
  topic: string;
  category: string;
  aspectRatio: string;
  backgroundColor: string;
  backgroundImage?: string | null;
  previewImage?: string | null;
  elements: any[];
  colorVariants?: any;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionHistoryItem {
  id: string;
  type: string;
  plan: string;
  amount: number;
  status: string;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  plan: string;
  purchasedPlansList?: string[];
  purchasedPlansCounts?: Record<string, number>;
  subscriptionsHistory?: SubscriptionHistoryItem[];
  planExpiresAt: string | null;
  allowedTemplatesCount: number;
  allowedCinematicCount: number;
  usedTemplatesCount: number;
  allowedCardsCount: number;
  usedCardsCount: number;
  totalRevenue: number;
  hasActiveSubscription: boolean;
  createdAt: string;
}

interface OverviewStats {
  totalUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalInvitationsCreated: number;
  totalCardsGenerated: number;
}

interface AdminInvitation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  templateSlug: string;
  partnerOne: string;
  partnerTwo: string;
  slug: string;
  createdAt: string;
  weddingDate: string;
  isUnlockedByAdmin: boolean;
  isLockedByAdmin: boolean;
  daysInUse: number;
  isLocked: boolean;
  lockReason: string | null;
  timeUntilLockText?: string | null;
  lockStartTime?: string | null;
  guestsCount: number;
}

const PLAN_BADGE_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  CINEMATIC_2000: {
    label: "CINEMATIC ₹2000",
    bg: "bg-amber-500/20",
    text: "text-amber-900",
    border: "border-amber-500/50",
  },
  PRO_1799: {
    label: "PRO ₹1799",
    bg: "bg-[#D9A441]/20",
    text: "text-[#8B6519]",
    border: "border-[#D9A441]/50",
  },
  BASIC_599: {
    label: "BASIC ₹599",
    bg: "bg-[#7A1F2B]/10",
    text: "text-[#7A1F2B]",
    border: "border-[#7A1F2B]/30",
  },
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [invitationsList, setInvitationsList] = useState<AdminInvitation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"USERS" | "ORDERS" | "LOCKS" | "SHOP" | "CANVA_TEMPLATES" | "ADMIN_STAFF">("USERS");
  const [errorMsg, setErrorMsg] = useState("");
  const [showStatsPanel, setShowStatsPanel] = useState<boolean>(false);

  // Tab Persistence Handler (Preserves tab across reloads & updates URL query)
  const handleTabChange = (tab: "USERS" | "ORDERS" | "LOCKS" | "SHOP" | "CANVA_TEMPLATES" | "ADMIN_STAFF") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("admin_active_tab", tab);
        const url = new URL(window.location.href);
        const tabParamMap: Record<string, string> = {
          CANVA_TEMPLATES: "canva",
          SHOP: "shop",
          ORDERS: "orders",
          LOCKS: "locks",
          ADMIN_STAFF: "staff",
          USERS: "users",
        };
        url.searchParams.set("tab", tabParamMap[tab] || "users");
        window.history.replaceState(null, "", url.toString());
      } catch (e) {
        // ignore
      }
    }
  };

  // Restore Active Tab on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get("tab")?.toLowerCase();
        const savedTab = localStorage.getItem("admin_active_tab");

        if (tabParam === "canva" || tabParam === "canva_templates" || tabParam === "canva-templates") {
          setActiveTab("CANVA_TEMPLATES");
        } else if (tabParam === "shop") {
          setActiveTab("SHOP");
        } else if (tabParam === "orders") {
          setActiveTab("ORDERS");
        } else if (tabParam === "locks") {
          setActiveTab("LOCKS");
        } else if (tabParam === "staff") {
          setActiveTab("ADMIN_STAFF");
        } else if (tabParam === "users") {
          setActiveTab("USERS");
        } else if (savedTab && ["USERS", "ORDERS", "LOCKS", "SHOP", "CANVA_TEMPLATES", "ADMIN_STAFF"].includes(savedTab)) {
          setActiveTab(savedTab as any);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // RBAC & Sub-Admin Management State
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [staffList, setStaffList] = useState<AdminStaff[]>([]);
  const [candidatesList, setCandidatesList] = useState<UserCandidate[]>([]);
  const [staffLoading, setStaffLoading] = useState<boolean>(false);
  const [staffSearchQuery, setStaffSearchQuery] = useState<string>("");
  const [staffModalOpen, setStaffModalOpen] = useState<boolean>(false);
  const [staffModalMode, setStaffModalMode] = useState<"CREATE" | "PROMOTE" | "EDIT">("CREATE");
  const [selectedStaffMember, setSelectedStaffMember] = useState<AdminStaff | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [savingStaff, setSavingStaff] = useState<boolean>(false);
  const [revokingStaffId, setRevokingStaffId] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "SUB_ADMIN",
    permissions: [] as string[],
  });

  const [ordersList, setOrdersList] = useState<AdminOrder[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [selectedOrderForMessage, setSelectedOrderForMessage] = useState<AdminOrder | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  // Canva Templates Management State
  const [canvaTemplatesList, setCanvaTemplatesList] = useState<AdminCanvaTemplate[]>([]);
  const [canvaTopicFilter, setCanvaTopicFilter] = useState<string>("ALL");
  const [canvaSearchQuery, setCanvaSearchQuery] = useState<string>("");
  const [togglingCanvaId, setTogglingCanvaId] = useState<string | null>(null);
  const [deletingCanvaTemplateId, setDeletingCanvaTemplateId] = useState<string | null>(null);

  // Traditional Shop Product Management State
  const [shopProductsList, setShopProductsList] = useState<AdminShopProduct[]>([]);
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>("ALL");
  const [shopStatusFilter, setShopStatusFilter] = useState<string>("ALL");
  const [shopSearchQuery, setShopSearchQuery] = useState<string>("" );
  const [shopSortBy, setShopSortBy] = useState<string>("DEFAULT");
  const [shopCurrentPage, setShopCurrentPage] = useState<number>(1);
  const [shopPageSize, setShopPageSize] = useState<number>(15);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState<boolean>(false);
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminShopProduct | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [uploadingSubImages, setUploadingSubImages] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [subImageUrlInput, setSubImageUrlInput] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
    category: "royal",
    pricePerCard: 65,
    minCopies: 50,
    previewImage: "",
    galleryImages: [] as string[],
    badge: "",
    paperType: "350 GSM Textured Metallic Gold Cardstock",
    dimensions: "5.5 x 8.5 inches",
    description: "",
    features: "Real Gold Foil Stamping\nHeavy 350 GSM Textured Board\nMatching Luxury Envelopes Included",
    canvaTemplateId: "",
    isActive: true,
  });

  // Modal State for Granting Extra Quota
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [addTemplateSlots, setAddTemplateSlots] = useState<number>(1);
  const [addCinematicSlots, setAddCinematicSlots] = useState<number>(1);
  const [addCardCredits, setAddCardCredits] = useState<number>(5);
  const [overridePlan, setOverridePlan] = useState<string>("");
  const [granting, setGranting] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [togglingLockId, setTogglingLockId] = useState<string | null>(null);
  const [deletingInvitationId, setDeletingInvitationId] = useState<string | null>(null);

  const isSuperAdmin =
    adminProfile?.isSuperAdmin ||
    Boolean((session?.user as any)?.isSuperAdmin) ||
    session?.user?.email?.toLowerCase() === "berglin1998@gmail.com";

  const isAdmin =
    (session?.user as any)?.isAdmin ||
    isSuperAdmin ||
    Boolean(adminProfile && ["ADMIN", "SUB_ADMIN", "SUPER_ADMIN"].includes((adminProfile.role || "").toUpperCase()));

  const canAccess = (permissionKey: string) => {
    if (isSuperAdmin) {
      return true;
    }
    if (adminProfile) {
      return (adminProfile.adminPermissions || []).includes(permissionKey);
    }
    const sessionPerms = (session?.user as any)?.adminPermissions || [];
    return sessionPerms.includes(permissionKey);
  };

  const fetchStaffData = async () => {
    setStaffLoading(true);
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      if (res.ok) {
        setStaffList(data.staff || []);
        setCandidatesList(data.candidates || []);
        if (data.currentAdmin) {
          setAdminProfile(data.currentAdmin);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch staff list:", e);
    } finally {
      setStaffLoading(false);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [overviewRes, ordersRes, shopRes, canvaRes] = await Promise.all([
        fetch("/api/admin/overview"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/shop/products"),
        fetch("/api/admin/canva-templates"),
      ]);
      const data = await overviewRes.json();
      const ordersData = await ordersRes.json();
      const shopData = await shopRes.json();
      const canvaData = await canvaRes.json();

      if (!overviewRes.ok) {
        throw new Error(data.error || "Failed to load admin data");
      }

      setStats(data.stats);
      setUsers(data.users || []);
      setInvitationsList(data.invitationsList || []);
      if (data.currentAdmin) {
        setAdminProfile(data.currentAdmin);
        // Auto-navigate to first available tab if current tab is restricted
        if (!data.currentAdmin.isSuperAdmin) {
          const perms = data.currentAdmin.adminPermissions || [];
          if (!perms.includes("USERS_MANAGE")) {
            if (perms.includes("ORDERS_MANAGE")) setActiveTab("ORDERS");
            else if (perms.includes("CANVA_TEMPLATES_MANAGE")) setActiveTab("CANVA_TEMPLATES");
            else if (perms.includes("SHOP_PRODUCTS_MANAGE")) setActiveTab("SHOP");
            else if (perms.includes("INVITATIONS_MANAGE")) setActiveTab("LOCKS");
          }
        }
      }

      if (ordersRes.ok && Array.isArray(ordersData.orders)) {
        setOrdersList(ordersData.orders);
      }
      if (shopRes.ok && Array.isArray(shopData.products)) {
        setShopProductsList(shopData.products);
      }
      if (canvaRes.ok && Array.isArray(canvaData.templates)) {
        setCanvaTemplatesList(canvaData.templates);
      }

      // If user is super admin or can manage admins, fetch staff list
      if (data.currentAdmin?.isSuperAdmin || isSuperAdmin) {
        fetchStaffData();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Error loading admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCanvaStatus = async (templateId: string, currentStatus: boolean) => {
    setTogglingCanvaId(templateId);
    try {
      const res = await fetch(`/api/admin/canva-templates/${templateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update template status");
      setCanvaTemplatesList((prev) =>
        prev.map((t) => (t.id === templateId ? { ...t, isActive: !currentStatus } : t))
      );
      setSuccessToast(`Template visibility updated!`);
      setTimeout(() => setSuccessToast(""), 3500);
    } catch (err: any) {
      alert(err?.message || "Failed to update status");
    } finally {
      setTogglingCanvaId(null);
    }
  };

  const handleDeleteCanvaTemplate = async (templateId: string, templateName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete template "${templateName}"?`)) return;
    setDeletingCanvaTemplateId(templateId);
    try {
      const res = await fetch(`/api/admin/canva-templates/${templateId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete template");
      setCanvaTemplatesList((prev) => prev.filter((t) => t.id !== templateId));
      setSuccessToast(`Template "${templateName}" deleted.`);
      setTimeout(() => setSuccessToast(""), 3500);
    } catch (err: any) {
      alert(err?.message || "Failed to delete template");
    } finally {
      setDeletingCanvaTemplateId(null);
    }
  };

  const handleOpenNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "royal",
      pricePerCard: 65,
      minCopies: 50,
      previewImage: "/images/canva/template2-thumb.webp",
      galleryImages: [],
      badge: "NEW",
      paperType: "350 GSM Textured Metallic Gold Cardstock",
      dimensions: "5.5 x 8.5 inches",
      description: "Majestic luxury Indian wedding invitation card with real gold foil border frames.",
      features: "Real Gold Foil Stamping\nHeavy 350 GSM Textured Board\nMatching Luxury Envelopes Included",
      canvaTemplateId: "",
      isActive: true,
    });
    setSubImageUrlInput("");
    setUploadError("");
    setShowManualUrl(false);
    setShopModalOpen(true);
  };

  const handleOpenEditProductModal = (product: AdminShopProduct) => {
    setEditingProduct(product);
    let featuresStr = "";
    try {
      const parsed = JSON.parse(product.featuresJson);
      if (Array.isArray(parsed)) featuresStr = parsed.join("\n");
    } catch {
      featuresStr = product.featuresJson || "";
    }

    let parsedGallery: string[] = [];
    try {
      if (product.galleryImages) {
        const parsed = JSON.parse(product.galleryImages);
        if (Array.isArray(parsed)) parsedGallery = parsed;
      }
    } catch {
      parsedGallery = [];
    }

    setProductForm({
      name: product.name,
      category: product.category,
      pricePerCard: product.pricePerCard,
      minCopies: product.minCopies,
      previewImage: product.previewImage,
      galleryImages: parsedGallery,
      badge: product.badge || "",
      paperType: product.paperType,
      dimensions: product.dimensions,
      description: product.description,
      features: featuresStr,
      canvaTemplateId: product.canvaTemplateId || "",
      isActive: product.isActive,
    });
    setSubImageUrlInput("");
    setUploadError("");
    setShowManualUrl(false);
    setShopModalOpen(true);
  };

  const handleUploadProductImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProductImage(true);
    setUploadError("");
    try {
      const optimizedFile = await optimizeImageForUpload(file, {
        maxDimension: 2560,
        quality: 0.92,
      });

      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("target", "shop");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");
      setProductForm((prev) => ({ ...prev, previewImage: data.url }));
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image from local system");
    } finally {
      setUploadingProductImage(false);
    }
  };

  const handleUploadProductSubImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingSubImages(true);
    setUploadError("");
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const optimizedFile = await optimizeImageForUpload(file, {
          maxDimension: 2560,
          quality: 0.92,
        });
        const formData = new FormData();
        formData.append("file", optimizedFile);
        formData.append("target", "shop");
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
        setProductForm((prev) => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), ...uploadedUrls],
        }));
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload sub images");
    } finally {
      setUploadingSubImages(false);
      e.target.value = "";
    }
  };

  const handleSetAsMainImage = (subImgUrl: string, subIndex: number) => {
    setProductForm((prev) => {
      const oldMain = prev.previewImage;
      const newGallery = [...(prev.galleryImages || [])];
      newGallery.splice(subIndex, 1);
      if (oldMain && !newGallery.includes(oldMain)) {
        newGallery.unshift(oldMain);
      }
      return {
        ...prev,
        previewImage: subImgUrl,
        galleryImages: newGallery,
      };
    });
  };

  const handleRemoveSubImage = (subIndex: number) => {
    setProductForm((prev) => {
      const newGallery = [...(prev.galleryImages || [])];
      newGallery.splice(subIndex, 1);
      return {
        ...prev,
        galleryImages: newGallery,
      };
    });
  };

  const handleAddSubImageUrl = () => {
    if (!subImageUrlInput.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), subImageUrlInput.trim()],
    }));
    setSubImageUrlInput("");
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.previewImage) {
      alert("Please fill in the product name and main preview image.");
      return;
    }

    setSavingProduct(true);
    const featuresList = productForm.features
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const payload = {
        ...productForm,
        galleryImages: JSON.stringify(productForm.galleryImages || []),
        features: featuresList,
      };

      if (editingProduct) {
        // Edit existing product
        const res = await fetch(`/api/admin/shop/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update product");

        setShopProductsList((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? data.product : p))
        );
        setSuccessToast(`Product "${productForm.name}" updated successfully!`);
      } else {
        // Create new product
        const res = await fetch("/api/admin/shop/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create product");

        setShopProductsList((prev) => [data.product, ...prev]);
        setSuccessToast(`Product "${productForm.name}" added to /shop catalog!`);
      }
      setTimeout(() => setSuccessToast(""), 4000);
      setShopModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Error saving product");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product from the shop catalog?")) return;

    setDeletingProductId(productId);
    try {
      const res = await fetch(`/api/admin/shop/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");

      setShopProductsList((prev) => prev.filter((p) => p.id !== productId));
      setSuccessToast("Product deleted successfully");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      alert(err.message || "Error deleting product");
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleToggleProductActive = async (product: AdminShopProduct) => {
    try {
      const newActive = !product.isActive;
      const res = await fetch(`/api/admin/shop/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle status");

      setShopProductsList((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: newActive } : p))
      );
      setSuccessToast(`Product is now ${newActive ? "ACTIVE on /shop" : "HIDDEN from /shop"}`);
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      alert(err.message || "Error toggling product status");
    }
  };

  const handleToggleSelectProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleToggleSelectAllOnPage = (pageProductIds: string[]) => {
    const allSelected =
      pageProductIds.length > 0 && pageProductIds.every((id) => selectedProductIds.includes(id));
    if (allSelected) {
      setSelectedProductIds((prev) => prev.filter((id) => !pageProductIds.includes(id)));
    } else {
      setSelectedProductIds((prev) => Array.from(new Set([...prev, ...pageProductIds])));
    }
  };

  const handleSelectAllFiltered = (allFilteredIds: string[]) => {
    setSelectedProductIds(allFilteredIds);
  };

  const handleClearSelection = () => {
    setSelectedProductIds([]);
  };

  const handleBulkToggleStatus = async (isActive: boolean) => {
    if (selectedProductIds.length === 0) return;
    setBulkActionLoading(true);
    try {
      const res = await fetch("/api/admin/shop/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: selectedProductIds, isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to bulk update status");

      setShopProductsList((prev) =>
        prev.map((p) => (selectedProductIds.includes(p.id) ? { ...p, isActive } : p))
      );
      setSuccessToast(
        `${selectedProductIds.length} products ${isActive ? "ACTIVATED on /shop" : "HIDDEN from /shop"} successfully!`
      );
      setTimeout(() => setSuccessToast(""), 4000);
      setSelectedProductIds([]);
    } catch (err: any) {
      alert(err.message || "Error during bulk update");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedProductIds.length} selected products? This action cannot be undone.`
      )
    )
      return;

    setBulkActionLoading(true);
    try {
      const res = await fetch("/api/admin/shop/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: selectedProductIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to bulk delete products");

      setShopProductsList((prev) => prev.filter((p) => !selectedProductIds.includes(p.id)));
      setSuccessToast(`${selectedProductIds.length} products deleted successfully!`);
      setTimeout(() => setSuccessToast(""), 4000);
      setSelectedProductIds([]);
    } catch (err: any) {
      alert(err.message || "Error during bulk delete");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, note?: string) => {
    setUpdatingStatusId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order status");

      setOrdersList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setSuccessToast(`✨ Order #${data.order?.orderNumber || ""} status updated to ${newStatus} & email sent!`);
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      alert(err?.message || "Failed to update status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleSendOrderMessage = async (orderId: string) => {
    if (!messageInput.trim()) return;
    setSendingMessage(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setOrdersList((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, messages: [...o.messages, data.message] }
            : o
        )
      );
      if (selectedOrderForMessage && selectedOrderForMessage.id === orderId) {
        setSelectedOrderForMessage((prev) =>
          prev ? { ...prev, messages: [...prev.messages, data.message] } : null
        );
      }
      setMessageInput("");
      setSuccessToast("💬 Message sent & customer notified via email!");
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      alert(err?.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUserClick = (userId: string, userEmail: string) => {
    const foundUser = users.find(
      (u) => u.id === userId || (u.email && u.email.toLowerCase() === userEmail.toLowerCase())
    );
    if (foundUser) {
      setSelectedUser(foundUser);
      setAddTemplateSlots(1);
      setAddCinematicSlots(1);
      setAddCardCredits(5);
      setOverridePlan("");
    }
  };

  const handleToggleLock = async (invitationId: string, isCurrentlyLocked: boolean) => {
    setTogglingLockId(invitationId);
    const targetUnlockState = isCurrentlyLocked; // If currently locked, unlock it; if open, lock it
    try {
      const res = await fetch("/api/admin/toggle-lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          unlockState: targetUnlockState,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to toggle lock status");
      }

      setInvitationsList((prev) =>
        prev.map((inv) => {
          if (inv.id === invitationId) {
            const newUnlocked = !!data.isUnlockedByAdmin;
            const newLocked = !!data.isLockedByAdmin;
            return {
              ...inv,
              isUnlockedByAdmin: newUnlocked,
              isLockedByAdmin: newLocked,
              isLocked: newLocked ? true : newUnlocked ? false : inv.isLocked,
            };
          }
          return inv;
        })
      );

      setSuccessToast(data.message);
      setTimeout(() => setSuccessToast(""), 3500);
    } catch (err: any) {
      setErrorMsg(err?.message || "Error toggling lock state");
    } finally {
      setTogglingLockId(null);
    }
  };

  const handleDeleteInvitation = async (invitationId: string, partnerNames?: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete the invitation template "${partnerNames || "Website"}"?\n\nThis will remove the live website, RSVP records, and guest lists.`
    );
    if (!confirmDelete) return;

    try {
      setDeletingInvitationId(invitationId);
      const res = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete invitation template");

      setSuccessToast(data.message || "Invitation template deleted successfully!");
      setTimeout(() => setSuccessToast(""), 4000);

      // Remove from local invitations list & update state
      setInvitationsList((prev) => prev.filter((i) => i.id !== invitationId));
      fetchAdminData();
    } catch (err: any) {
      alert(err?.message || "Failed to delete invitation");
    } finally {
      setDeletingInvitationId(null);
    }
  };

  // Staff Modal Open Handlers
  const handleOpenCreateStaffModal = () => {
    setStaffModalMode("CREATE");
    setSelectedStaffMember(null);
    setSelectedCandidateId("");
    setStaffForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "SUB_ADMIN",
      permissions: ["ORDERS_MANAGE", "CANVA_TEMPLATES_MANAGE"],
    });
    setStaffModalOpen(true);
  };

  const handleOpenPromoteModal = (candidateUser?: UserCandidate | AdminUser) => {
    setStaffModalMode("PROMOTE");
    setSelectedStaffMember(null);
    if (candidateUser) {
      setSelectedCandidateId(candidateUser.id);
      setStaffForm({
        name: candidateUser.name || "",
        email: candidateUser.email || "",
        password: "",
        phone: candidateUser.phone || "",
        role: "SUB_ADMIN",
        permissions: ["ORDERS_MANAGE", "CANVA_TEMPLATES_MANAGE"],
      });
    } else {
      setSelectedCandidateId("");
      setStaffForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "SUB_ADMIN",
        permissions: ["ORDERS_MANAGE", "CANVA_TEMPLATES_MANAGE"],
      });
    }
    setStaffModalOpen(true);
  };

  const handleOpenEditStaffModal = (staff: AdminStaff) => {
    setStaffModalMode("EDIT");
    setSelectedStaffMember(staff);
    setSelectedCandidateId(staff.id);
    setStaffForm({
      name: staff.name,
      email: staff.email,
      password: "",
      phone: staff.phone || "",
      role: staff.role === "ADMIN" ? "ADMIN" : "SUB_ADMIN",
      permissions: staff.adminPermissions || [],
    });
    setStaffModalOpen(true);
  };

  const handleTogglePermission = (permKey: string) => {
    setStaffForm((prev) => {
      const exists = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permKey)
          : [...prev.permissions, permKey],
      };
    });
  };

  const handleSelectAllPermissions = () => {
    setStaffForm((prev) => ({
      ...prev,
      permissions: [
        "ORDERS_MANAGE",
        "USERS_MANAGE",
        "INVITATIONS_MANAGE",
        "CANVA_TEMPLATES_MANAGE",
        "SHOP_PRODUCTS_MANAGE",
      ],
    }));
  };

  const handleDeselectAllPermissions = () => {
    setStaffForm((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStaff(true);
    try {
      if (staffModalMode === "CREATE") {
        if (!staffForm.email || !staffForm.password) {
          alert("Email and password are required.");
          setSavingStaff(false);
          return;
        }
        const res = await fetch("/api/admin/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(staffForm),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create admin staff");
        setSuccessToast(data.message || "Admin created successfully!");
      } else if (staffModalMode === "PROMOTE") {
        if (!selectedCandidateId) {
          alert("Please select a registered user to promote.");
          setSavingStaff(false);
          return;
        }
        const res = await fetch("/api/admin/staff", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: selectedCandidateId,
            role: staffForm.role,
            permissions: staffForm.permissions,
            newPassword: staffForm.password || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to promote user");
        setSuccessToast(data.message || "User promoted to admin!");
      } else if (staffModalMode === "EDIT" && selectedStaffMember) {
        const res = await fetch("/api/admin/staff", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: selectedStaffMember.id,
            role: staffForm.role,
            permissions: staffForm.permissions,
            newPassword: staffForm.password || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update staff permissions");
        setSuccessToast(data.message || "Permissions updated successfully!");
      }

      setStaffModalOpen(false);
      setTimeout(() => setSuccessToast(""), 4000);
      fetchStaffData();
      fetchAdminData();
    } catch (err: any) {
      alert(err?.message || "Failed to save staff");
    } finally {
      setSavingStaff(false);
    }
  };

  const handleRevokeStaff = async (staffId: string, staffEmail: string) => {
    if (
      !window.confirm(
        `Are you sure you want to revoke administrative access for ${staffEmail}?\n\nThis user will be demoted back to a standard USER account.`
      )
    ) {
      return;
    }
    setRevokingStaffId(staffId);
    try {
      const res = await fetch(`/api/admin/staff?userId=${staffId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to revoke admin privileges");
      setSuccessToast(data.message || `Admin privileges revoked for ${staffEmail}.`);
      setTimeout(() => setSuccessToast(""), 4000);
      fetchStaffData();
      fetchAdminData();
    } catch (err: any) {
      alert(err?.message || "Failed to revoke admin access");
    } finally {
      setRevokingStaffId(null);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAdminData();
    }
  }, [status]);

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setGranting(true);
    try {
      const res = await fetch("/api/admin/grant-quota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          addTemplateSlots,
          addCinematicSlots,
          addCardCredits,
          overridePlan: overridePlan || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update quota");
      }

      setSuccessToast(data.message || "Quota updated successfully!");
      setSelectedUser(null);
      fetchAdminData();
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      alert(err?.message || "Error updating quota");
    } finally {
      setGranting(false);
    }
  };

  const handleResetPurchases = async () => {
    if (!confirm("Are you sure you want to reset ALL user purchases, subscriptions, and revenue records to zero? This will reset all non-admin users to Free status.")) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset-purchases", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setSuccessToast(data.message || "Purchases & revenue reset to zero!");
      fetchAdminData();
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err: any) {
      alert(err?.message || "Failed to reset purchases");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-[#991B1B] border-t-transparent animate-spin" />
            <span className="text-xs font-bold text-[#991B1B]">Verifying administrative authorization...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasAccess =
    isAdmin ||
    Boolean(
      adminProfile &&
        (adminProfile.isSuperAdmin ||
          (adminProfile.adminPermissions && adminProfile.adminPermissions.length > 0) ||
          ["ADMIN", "SUB_ADMIN", "SUPER_ADMIN"].includes((adminProfile.role || "").toUpperCase()))
    );

  if (status === "unauthenticated" || !hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-md w-full shadow-lg space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#991B1B] flex items-center justify-center mx-auto shadow-inner">
              <Crown className="w-8 h-8 text-[#991B1B]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Authority Required</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your account (<strong className="text-[#991B1B]">{session?.user?.email}</strong>) does not have active administrative permissions. Please sign in with an authorized admin account.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="btn-maroon inline-flex items-center gap-2 px-6 py-3 text-xs font-bold shadow-md"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>Return to User Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === "ALL" || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const filteredShopProducts = shopProductsList
    .filter((product) => {
      // 1. Category filter
      if (shopCategoryFilter !== "ALL" && product.category !== shopCategoryFilter) {
        return false;
      }
      // 2. Status filter
      if (shopStatusFilter === "ACTIVE" && !product.isActive) return false;
      if (shopStatusFilter === "HIDDEN" && product.isActive) return false;
      // 3. Search query
      if (shopSearchQuery.trim()) {
        const q = shopSearchQuery.toLowerCase().trim();
        const text = `${product.name} ${product.description} ${product.paperType} ${product.dimensions} ${product.badge || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (shopSortBy === "PRICE_LOW") return a.pricePerCard - b.pricePerCard;
      if (shopSortBy === "PRICE_HIGH") return b.pricePerCard - a.pricePerCard;
      if (shopSortBy === "NAME_ASC") return a.name.localeCompare(b.name);
      return 0; // Default/Newest
    });

  const totalShopItems = filteredShopProducts.length;
  const effectivePageSize = shopPageSize === 0 ? totalShopItems || 1 : shopPageSize;
  const totalShopPages = Math.max(1, Math.ceil(totalShopItems / effectivePageSize));
  const validCurrentPage = Math.min(Math.max(1, shopCurrentPage), totalShopPages);

  const paginatedShopProducts =
    shopPageSize === 0
      ? filteredShopProducts
      : filteredShopProducts.slice(
          (validCurrentPage - 1) * effectivePageSize,
          validCurrentPage * effectivePageSize
        );

  const currentPageProductIds = paginatedShopProducts.map((p) => p.id);
  const allFilteredShopIds = filteredShopProducts.map((p) => p.id);
  const isAllOnPageSelected =
    currentPageProductIds.length > 0 &&
    currentPageProductIds.every((id) => selectedProductIds.includes(id));
  const isSomeOnPageSelected =
    currentPageProductIds.some((id) => selectedProductIds.includes(id)) && !isAllOnPageSelected;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-24 pb-16 sm:pb-20 max-w-[1400px] mx-auto w-full px-3 sm:px-6 space-y-4 sm:space-y-6">
        {/* Toast Notification */}
        {successToast && (
          <div className="fixed top-20 sm:top-24 right-3 sm:right-6 z-50 bg-[#5B8C69] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-white/20 animate-slide-down max-w-[90vw]">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span className="truncate">{successToast}</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#7A1F2B]/10 border border-[#7A1F2B]/40 text-[#7A1F2B] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 🌟 UNIFIED SINGLE-SURFACE ADMIN DASHBOARD CONTAINER 🌟 */}
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden flex flex-col">
          
          {/* 1. Sleek Compact Control Strip (Always Visible) */}
          <div className="p-3 sm:p-4 md:px-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="bg-[#991B1B] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider flex items-center gap-1 shadow-xs">
                <Crown className="w-3 h-3 fill-current text-amber-300" />
                <span>ADMIN AUTHORITY</span>
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold hidden sm:inline">• Live Control</span>

              {/* 🔘 Toggle Button for Full Analytics & Stats Panel (Super Admin Only) */}
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setShowStatsPanel(!showStatsPanel)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs ${
                    showStatsPanel
                      ? "bg-[#991B1B] text-white border-[#991B1B]"
                      : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                  title="Toggle Analytics Summary & System Controls"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{showStatsPanel ? "Hide Analytics & Stats" : "Show Analytics & Stats"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showStatsPanel ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={fetchAdminData}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#991B1B] ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link
                href="/dashboard"
                className="btn-maroon px-3.5 py-1.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
                <span>User Dashboard</span>
              </Link>
            </div>
          </div>

          {/* 2. Collapsible Analytics & Stats Panel (Super Admin Only) */}
          {showStatsPanel && isSuperAdmin && (
            <div className="animate-fade-in border-b border-slate-100">
              {/* Full Title, Email & Advanced Admin Actions */}
              <div className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white">
                <div className="space-y-1 w-full md:w-auto">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                    Subscription Analytics &amp; Quota Top-Up Panel
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    Logged in as <strong className="text-[#991B1B]">{session?.user?.email}</strong>. View platform subscriptions, total usage metrics, and grant custom quotas to users.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleResetPurchases}
                    disabled={loading}
                    className="px-3.5 py-2 rounded-xl bg-red-50 text-[#991B1B] text-xs font-extrabold hover:bg-red-100 border border-red-200 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    title="Reset all non-admin user purchases and revenue to zero"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Reset Purchases to ₹0</span>
                  </button>
                </div>
              </div>

              {/* Integrated 4-Column KPI Stats Strip */}
              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/40">
                  {/* Stat 1: Total Revenue */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white transition-colors">
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Revenue</span>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#991B1B] mt-0.5">
                        ₹{stats.totalRevenue.toLocaleString()}
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate mt-0.5">
                        From {stats.totalSubscriptions} subscriptions
                      </span>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 text-[#991B1B] flex items-center justify-center border border-red-100 shrink-0">
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Stat 2: Subscriptions */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white transition-colors">
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Subs</span>
                      <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                        {stats.activeSubscriptions}
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate mt-0.5">
                        {stats.totalSubscriptions} total purchased
                      </span>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Stat 3: Total Invitations Created */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white transition-colors">
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Web Invites</span>
                      <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                        {stats.totalInvitationsCreated}
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate mt-0.5">
                        Active invite websites
                      </span>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shrink-0">
                      <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Stat 4: Instagram Cards Generated */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white transition-colors">
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Cards Made</span>
                      <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                        {stats.totalCardsGenerated}
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate mt-0.5">
                        Announcement exports
                      </span>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shrink-0">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Integrated Tab Navigation Bar */}
          <div className="p-2 sm:p-3 bg-slate-50/70 border-b border-slate-100 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap md:flex-wrap min-w-max md:min-w-0">
              {/* Tab 1: User Accounts */}
              {canAccess("USERS_MANAGE") && (
                <button
                  type="button"
                  onClick={() => handleTabChange("USERS")}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "USERS"
                      ? "bg-[#991B1B] text-white shadow-xs font-extrabold"
                      : "text-slate-700 hover:text-[#991B1B] hover:bg-slate-100"
                  }`}
                >
                  <Users className={`w-4 h-4 ${activeTab === "USERS" ? "text-amber-300" : "text-[#991B1B]"}`} />
                  <span>User Accounts &amp; Quotas</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === "USERS"
                        ? "bg-white text-[#991B1B]"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {filteredUsers.length}
                  </span>
                </button>
              )}

              {/* Tab 2: Print Orders & Requests */}
              {canAccess("ORDERS_MANAGE") && (
                <button
                  type="button"
                  onClick={() => handleTabChange("ORDERS")}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 relative ${
                    activeTab === "ORDERS"
                      ? "bg-[#991B1B] text-white shadow-xs font-extrabold"
                      : "text-slate-700 hover:text-[#991B1B] hover:bg-slate-100"
                  }`}
                >
                  <Package className={`w-4 h-4 ${activeTab === "ORDERS" ? "text-amber-300" : "text-[#991B1B]"}`} />
                  <span>Card Print Orders</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === "ORDERS"
                        ? "bg-white text-[#991B1B]"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {ordersList.length}
                  </span>
                  {ordersList.some((o) => o.status === "PENDING") && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white animate-pulse absolute top-2 right-2" />
                  )}
                </button>
              )}

              {/* Tab 3: Invitation Anti-Reuse & Locks */}
              {canAccess("INVITATIONS_MANAGE") && (
                <button
                  type="button"
                  onClick={() => handleTabChange("LOCKS")}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "LOCKS"
                      ? "bg-[#991B1B] text-white shadow-xs font-extrabold"
                      : "text-slate-700 hover:text-[#991B1B] hover:bg-slate-100"
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 ${activeTab === "LOCKS" ? "text-amber-300" : "text-[#991B1B]"}`} />
                  <span>Anti-Reuse &amp; Locks</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === "LOCKS"
                        ? "bg-white text-[#991B1B]"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {invitationsList.length}
                  </span>
                </button>
              )}

              {/* Tab 4: Traditional Cards Shop Catalog */}
              {canAccess("SHOP_PRODUCTS_MANAGE") && (
                <button
                  type="button"
                  onClick={() => handleTabChange("SHOP")}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "SHOP"
                      ? "bg-[#991B1B] text-white shadow-xs font-extrabold"
                      : "text-slate-700 hover:text-[#991B1B] hover:bg-slate-100"
                  }`}
                >
                  <ShoppingBag className={`w-4 h-4 ${activeTab === "SHOP" ? "text-amber-300" : "text-[#991B1B]"}`} />
                  <span>Shop Catalog</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === "SHOP"
                        ? "bg-white text-[#991B1B]"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {shopProductsList.length}
                  </span>
                </button>
              )}

              {/* Tab 5: Dynamic Canva Card Templates */}
              {canAccess("CANVA_TEMPLATES_MANAGE") && (
                <button
                  type="button"
                  onClick={() => handleTabChange("CANVA_TEMPLATES")}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "CANVA_TEMPLATES"
                      ? "bg-[#991B1B] text-white shadow-xs font-extrabold"
                      : "text-slate-700 hover:text-[#991B1B] hover:bg-slate-100"
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${activeTab === "CANVA_TEMPLATES" ? "text-amber-300" : "text-[#991B1B]"}`} />
                  <span>Canva Studio Templates</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === "CANVA_TEMPLATES"
                        ? "bg-white text-[#991B1B]"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {canvaTemplatesList.length}
                  </span>
                </button>
              )}

              {/* Tab 6: Admin Staff & RBAC Roles (Super Admin Only) */}
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => handleTabChange("ADMIN_STAFF")}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === "ADMIN_STAFF"
                      ? "bg-[#991B1B] text-white shadow-xs font-extrabold"
                      : "text-slate-700 hover:text-[#991B1B] hover:bg-slate-100"
                  }`}
                >
                  <Crown className={`w-4 h-4 ${activeTab === "ADMIN_STAFF" ? "text-amber-300" : "text-[#991B1B]"}`} />
                  <span>Admin Staff &amp; Roles</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === "ADMIN_STAFF"
                        ? "bg-white text-[#991B1B]"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {staffList.length}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* 4. Active Tab Content Area (Rendered seamlessly inside unified card) */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* TAB 1: User Management & Quota Top-Up Table Section */}
            {activeTab === "USERS" && (
              <div className="space-y-5 sm:space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#991B1B]" />
                  <span>User Quota Authority ({filteredUsers.length})</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                  View individual user usage and grant extra wedding template slots or card credits.
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name or email..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#991B1B]"
                  />
                </div>

                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#991B1B] cursor-pointer"
                >
                  <option value="ALL">All Plans</option>
                  <option value="BASIC_599">BASIC ₹599</option>
                  <option value="PRO_1799">PRO ₹1799</option>
                  <option value="CINEMATIC_2000">CINEMATIC ₹2000</option>
                  <option value="NONE">Free / Unsubscribed</option>
                </select>
              </div>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 font-bold min-w-[180px]">User Details</th>
                    <th className="py-3.5 px-4 font-bold min-w-[150px]">Active Plan</th>
                    <th className="py-3.5 px-4 font-bold min-w-[140px]">Template Slots</th>
                    <th className="py-3.5 px-4 font-bold min-w-[130px]">Card Credits</th>
                    <th className="py-3.5 px-4 font-bold min-w-[110px]">Revenue</th>
                    <th className="py-3.5 px-4 text-right min-w-[140px]">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        {/* User Details */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.role === "ADMIN" && (
                              <span className="px-2 py-0.5 rounded-full bg-[#991B1B] text-white text-[9px] font-extrabold tracking-wider">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                          {user.phone && <div className="text-[10px] text-slate-400">{user.phone}</div>}
                        </td>

                        {/* Active Plan Badges with Individual Plan Counts */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap items-center gap-1.5 max-w-[320px]">
                            {user.role === "ADMIN" ? (
                              <span className="px-3 py-1 rounded-full bg-[#991B1B] text-white font-extrabold text-[11px] tracking-wide shadow-xs">
                                MASTER ADMIN
                              </span>
                            ) : user.purchasedPlansCounts && Object.keys(user.purchasedPlansCounts).length > 0 ? (
                              Object.entries(user.purchasedPlansCounts).map(([planKey, count]) => {
                                const config = PLAN_BADGE_CONFIG[planKey] || {
                                  label: planKey,
                                  bg: "bg-slate-100",
                                  text: "text-slate-800",
                                  border: "border-slate-300",
                                };
                                return (
                                  <span
                                    key={planKey}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide border shadow-2xs ${config.bg} ${config.text} ${config.border}`}
                                  >
                                    <span>{config.label}</span>
                                    <span className="px-1.5 py-0.5 rounded-full bg-slate-900/10 text-[9px] font-black leading-none">
                                      {count} {count === 1 ? "purchase" : "purchases"}
                                    </span>
                                  </span>
                                );
                              })
                            ) : user.purchasedPlansList && user.purchasedPlansList.length > 0 ? (
                              user.purchasedPlansList.map((planKey) => {
                                const config = PLAN_BADGE_CONFIG[planKey] || {
                                  label: planKey,
                                  bg: "bg-slate-100",
                                  text: "text-slate-800",
                                  border: "border-slate-300",
                                };
                                return (
                                  <span
                                    key={planKey}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide border shadow-2xs ${config.bg} ${config.text} ${config.border}`}
                                  >
                                    <span>{config.label}</span>
                                    <span className="px-1.5 py-0.5 rounded-full bg-slate-900/10 text-[9px] font-black leading-none">
                                      1 purchase
                                    </span>
                                  </span>
                                );
                              })
                            ) : user.hasActiveSubscription ? (
                              (() => {
                                const config = PLAN_BADGE_CONFIG[user.plan] || {
                                  label: user.plan,
                                  bg: "bg-red-50",
                                  text: "text-[#991B1B]",
                                  border: "border-red-200",
                                };
                                return (
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide border shadow-2xs ${config.bg} ${config.text} ${config.border}`}
                                  >
                                    <span>{config.label}</span>
                                    <span className="px-1.5 py-0.5 rounded-full bg-slate-900/10 text-[9px] font-black leading-none">
                                      1 purchase
                                    </span>
                                  </span>
                                );
                              })()
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-extrabold text-[10px] border border-slate-200">
                                FREE USER
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Template Slots */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#991B1B]">
                              {user.role === "ADMIN" ? `${user.usedTemplatesCount} / Unlimited` : `${user.usedTemplatesCount} / ${user.allowedTemplatesCount}`}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({user.role === "ADMIN" ? "∞ left" : `${Math.max(0, user.allowedTemplatesCount - user.usedTemplatesCount)} left`})
                            </span>
                          </div>
                        </td>

                        {/* Card Credits */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-800">
                              {user.role === "ADMIN" ? `${user.usedCardsCount} / Unlimited` : `${user.usedCardsCount} / ${user.allowedCardsCount}`}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({user.role === "ADMIN" ? "∞ left" : `${Math.max(0, user.allowedCardsCount - user.usedCardsCount)} left`})
                            </span>
                          </div>
                        </td>

                        {/* Revenue */}
                        <td className="py-4 px-4 font-bold text-emerald-600">
                          ₹{user.totalRevenue.toLocaleString()}
                        </td>

                        {/* Action */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setAddTemplateSlots(1);
                                setAddCardCredits(5);
                                setOverridePlan("");
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300" />
                              <span>Grant Quota</span>
                            </button>

                            {(adminProfile?.isSuperAdmin || canAccess("ADMINS_MANAGE") || isAdmin) && (
                              <button
                                onClick={() => handleOpenPromoteModal(user)}
                                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-[11px] font-bold inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                                title="Promote or manage admin role & permissions"
                              >
                                <Crown className="w-3.5 h-3.5 text-slate-950" />
                                <span>{user.role === "USER" ? "Make Admin" : "Edit Role"}</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: 📦 CUSTOMER CARD PRINT ORDERS & REQUESTS */}
        {activeTab === "ORDERS" && (
          <div className="space-y-5 sm:space-y-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#991B1B]" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Card Print Orders ({ordersList.length})
                  </h2>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  Manage customer print orders, contact info, and production status.
                </p>
              </div>

              {/* Status Filter Tabs - Scrollable on mobile */}
              <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar max-w-full">
                {["ALL", "PENDING", "CONFIRMED", "IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      orderStatusFilter === st
                        ? "bg-[#991B1B] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 font-bold min-w-[130px]">Order # &amp; Date</th>
                    <th className="py-3.5 px-4 font-bold min-w-[170px]">Customer</th>
                    <th className="py-3.5 px-4 font-bold min-w-[140px]">Phone Number</th>
                    <th className="py-3.5 px-4 font-bold min-w-[170px]">Items &amp; Copies</th>
                    <th className="py-3.5 px-4 font-bold min-w-[140px]">Status</th>
                    <th className="py-3.5 px-4 text-right min-w-[140px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {ordersList.filter((o) => orderStatusFilter === "ALL" || o.status === orderStatusFilter).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold">No orders found for the selected status.</p>
                      </td>
                    </tr>
                  ) : (
                    ordersList
                      .filter((o) => orderStatusFilter === "ALL" || o.status === orderStatusFilter)
                      .map((order) => {
                        const statusColors: Record<string, string> = {
                          PENDING: "bg-amber-50 text-amber-900 border-amber-200",
                          CONFIRMED: "bg-emerald-50 text-emerald-900 border-emerald-200",
                          IN_PRODUCTION: "bg-blue-50 text-blue-900 border-blue-200",
                          SHIPPED: "bg-purple-50 text-purple-900 border-purple-200",
                          DELIVERED: "bg-green-50 text-green-900 border-green-200",
                          CANCELLED: "bg-red-50 text-red-900 border-red-200",
                        };

                        return (
                          <tr
                            key={order.id}
                            className="hover:bg-slate-50 transition-colors group cursor-pointer"
                            onClick={(e) => {
                              const target = e.target as HTMLElement;
                              if (!target.closest("select") && !target.closest("button") && !target.closest("a")) {
                                window.open(`/admin/orders/${order.id}`, "_blank");
                              }
                            }}
                          >
                            {/* 1. Order Number & Date */}
                            <td className="py-4 px-4">
                              <Link
                                href={`/admin/orders/${order.id}`}
                                target="_blank"
                                className="font-mono font-extrabold text-[#991B1B] text-xs hover:underline flex items-center gap-1 group-hover:text-[#7F1D1D]"
                              >
                                <span>#{order.orderNumber}</span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                              <div className="text-[11px] text-slate-500 font-medium">
                                {new Date(order.createdAt).toLocaleDateString(undefined, {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            </td>

                            {/* 2. Customer Name & Email */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
                              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <a
                                  href={`mailto:${order.customerEmail}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="hover:text-[#991B1B] hover:underline"
                                >
                                  {order.customerEmail}
                                </a>
                              </div>
                            </td>

                            {/* 3. Phone Number */}
                            <td className="py-4 px-4">
                              {order.customerPhone ? (
                                <a
                                  href={`tel:${order.customerPhone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="font-bold text-[#991B1B] text-xs hover:underline flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 w-fit"
                                >
                                  <Phone className="w-3.5 h-3.5 text-[#991B1B]" />
                                  <span>{order.customerPhone}</span>
                                </a>
                              ) : (
                                <span className="text-slate-400 text-xs italic">N/A</span>
                              )}
                            </td>

                            {/* 4. Template & Total Copies */}
                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-[#991B1B] text-[11px] font-extrabold border border-red-200">
                                    {order.totalCopies} Copies
                                  </span>
                                  <span className="font-bold text-xs text-slate-800 line-clamp-1">
                                    {order.items[0]?.templateName || "Custom Card"}
                                    {order.items.length > 1 ? ` (+${order.items.length - 1} more)` : ""}
                                  </span>
                                </div>
                                {order.notes && (
                                  <span className="text-[10px] text-slate-500 line-clamp-1 block italic">
                                    Note: {order.notes}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 5. Order Status */}
                            <td className="py-4 px-4">
                              <div className="relative w-fit" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={order.status}
                                  disabled={updatingStatusId === order.id}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold border outline-none cursor-pointer shadow-2xs ${
                                    statusColors[order.status] || "bg-slate-100 text-slate-700 border-slate-300"
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
                            </td>

                            {/* 6. Actions */}
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedOrderForMessage(order);
                                    setMessageInput("");
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-[#991B1B] border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                                  title="Quick message customer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>

                                <Link
                                  href={`/admin/orders/${order.id}`}
                                  target="_blank"
                                  className="px-3 py-1.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-[11px] font-bold inline-flex items-center gap-1 shadow-sm transition-all"
                                >
                                  <span>View Details</span>
                                  <ExternalLink className="w-3 h-3 text-amber-300" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INVITATION ANTI-REUSE & EDIT UNLOCK CONTROLS */}
        {activeTab === "LOCKS" && (
          <div className="space-y-5 sm:space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#991B1B]" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Anti-Reuse &amp; Edit Unlock Controls ({invitationsList.length})
                  </h2>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  Manage active invitation websites and individual 2-hour pre-event edit locks.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-50 text-[#991B1B] text-[11px] font-bold shrink-0 border border-red-200">
                {invitationsList.length} Websites Built
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 font-bold min-w-[180px]">Owner User</th>
                    <th className="py-3.5 px-4 font-bold min-w-[160px]">Templates Built</th>
                    <th className="py-3.5 px-4 font-bold min-w-[150px]">Guests &amp; RSVPs</th>
                    <th className="py-3.5 px-4 font-bold min-w-[150px]">Lock Status</th>
                    <th className="py-3.5 px-4 text-right min-w-[140px]">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {users.filter((u) => u.usedTemplatesCount > 0 || invitationsList.some((inv) => inv.userId === u.id || inv.userEmail === u.email)).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No user invitations created yet.
                      </td>
                    </tr>
                  ) : (
                    users
                      .filter((u) => u.usedTemplatesCount > 0 || invitationsList.some((inv) => inv.userId === u.id || inv.userEmail === u.email))
                      .map((user) => {
                        const userInvs = invitationsList.filter(
                          (inv) => inv.userId === user.id || inv.userEmail.toLowerCase() === user.email.toLowerCase()
                        );
                        const totalGuests = userInvs.reduce((acc, inv) => acc + (inv.guestsCount || 0), 0);
                        const lockedInvsCount = userInvs.filter((inv) => (inv.isLocked && !inv.isUnlockedByAdmin) || inv.isLockedByAdmin).length;

                        return (
                          <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                            {/* 1. Owner User (Clickable) */}
                            <td className="py-4 px-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setAddTemplateSlots(1);
                                  setAddCardCredits(5);
                                  setOverridePlan("");
                                }}
                                className="text-left group focus:outline-none cursor-pointer"
                                title="Click to view all created templates & manage lock status"
                              >
                                <div className="font-bold text-[#991B1B] text-sm group-hover:underline flex items-center gap-1">
                                  <span>{user.name}</span>
                                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                              </button>
                            </td>

                            {/* 2. Templates Built Summary */}
                            <td className="py-4 px-4">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2.5 py-1 rounded-full bg-red-50 text-[#991B1B] font-bold text-xs border border-red-200">
                                  {userInvs.length} Invitation{userInvs.length !== 1 ? "s" : ""} Built
                                </span>
                                {userInvs.map((inv) => (
                                  <span key={inv.id} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold border border-slate-200">
                                    {inv.templateSlug}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* 3. Total Guests & RSVPs */}
                            <td className="py-4 px-4 font-bold text-emerald-600">
                              {totalGuests} Total Guests Attached
                            </td>

                            {/* 4. Lock Status Overview */}
                            <td className="py-4 px-4">
                              {lockedInvsCount > 0 ? (
                                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 w-fit">
                                  <Lock className="w-3 h-3 text-rose-600" />
                                  {lockedInvsCount} Locked / {userInvs.length} Total
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 w-fit">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  All {userInvs.length} Active (Editable)
                                </span>
                              )}
                            </td>

                            {/* 5. Admin Action Button */}
                            <td className="py-4 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setAddTemplateSlots(1);
                                  setAddCardCredits(5);
                                  setOverridePlan("");
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                <span>Manage Templates &amp; Locks</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Traditional Cards Shop Catalog & Pricing Management Section */}
        {activeTab === "SHOP" && (
          <div className="space-y-5 sm:space-y-6 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-[#991B1B] flex items-center justify-center border border-red-100">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Traditional Cards Shop Catalog
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#991B1B] text-[11px] font-extrabold border border-red-200">
                    {shopProductsList.length} items
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600">
                  Manage physical card templates, return gifts, pricing, and Canva Studio links on{" "}
                  <Link href="/shop" target="_blank" className="font-bold text-[#991B1B] underline hover:text-[#7F1D1D]">
                    /shop
                  </Link>.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                {/* Add New Product Button */}
                <button
                  type="button"
                  onClick={handleOpenNewProductModal}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={shopSearchQuery}
                    onChange={(e) => {
                      setShopSearchQuery(e.target.value);
                      setShopCurrentPage(1);
                    }}
                    placeholder="Search by card name, specs, price..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#991B1B]"
                  />
                  {shopSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setShopSearchQuery("");
                        setShopCurrentPage(1);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <select
                  value={shopCategoryFilter}
                  onChange={(e) => {
                    setShopCategoryFilter(e.target.value);
                    setShopCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#991B1B] cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <optgroup label="💌 Invitation Cards">
                    <option value="royal">👑 Royal &amp; Heritage</option>
                    <option value="floral">🌸 Floral &amp; Botanical</option>
                    <option value="vintage">📜 Vintage Parchment</option>
                    <option value="modern">✨ Modern Die-Cut Arch</option>
                    <option value="velvet">💎 Luxury Velvet Suites</option>
                  </optgroup>
                  <optgroup label="🎁 Return Gifts">
                    <option value="return_gifts">🎁 All / General Return Gifts</option>
                    <option value="brass">🪔 Brass Diyas &amp; Idols</option>
                    <option value="hampers">🍬 Sweets &amp; Hampers</option>
                    <option value="silver">🪙 Silver Pooja Coins</option>
                    <option value="bags">🛍️ Brocade &amp; Jute Bags</option>
                    <option value="candles">🕯️ Aromatherapy Candles</option>
                  </optgroup>
                </select>

                {/* Status Filter */}
                <select
                  value={shopStatusFilter}
                  onChange={(e) => {
                    setShopStatusFilter(e.target.value);
                    setShopCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#991B1B] cursor-pointer"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">● Active on /shop</option>
                  <option value="HIDDEN">○ Hidden</option>
                </select>

                {/* Sort By */}
                <select
                  value={shopSortBy}
                  onChange={(e) => setShopSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#991B1B] cursor-pointer"
                >
                  <option value="DEFAULT">Sort: Default (Newest)</option>
                  <option value="PRICE_LOW">Price: Low to High</option>
                  <option value="PRICE_HIGH">Price: High to Low</option>
                  <option value="NAME_ASC">Name: A to Z</option>
                </select>
              </div>

              {/* Quick Select All Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      selectedProductIds.length === allFilteredShopIds.length &&
                      allFilteredShopIds.length > 0
                    ) {
                      handleClearSelection();
                    } else {
                      handleSelectAllFiltered(allFilteredShopIds);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {selectedProductIds.length === allFilteredShopIds.length &&
                  allFilteredShopIds.length > 0 ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-[#991B1B]" />
                      <span>Deselect All</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                      <span>Select All ({allFilteredShopIds.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bulk Action Bar (When items are selected) */}
            {selectedProductIds.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-red-50 border border-red-200 animate-slide-down">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#991B1B] text-white text-xs font-bold flex items-center justify-center">
                    {selectedProductIds.length}
                  </span>
                  <span className="text-xs font-bold text-[#991B1B]">items selected</span>
                  {selectedProductIds.length < allFilteredShopIds.length && (
                    <button
                      type="button"
                      onClick={() => handleSelectAllFiltered(allFilteredShopIds)}
                      className="text-xs font-bold text-slate-600 hover:text-[#991B1B] underline ml-2 cursor-pointer"
                    >
                      Select all {allFilteredShopIds.length} items
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={bulkActionLoading}
                    onClick={() => handleBulkToggleStatus(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Activate ({selectedProductIds.length})</span>
                  </button>

                  <button
                    type="button"
                    disabled={bulkActionLoading}
                    onClick={() => handleBulkToggleStatus(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide ({selectedProductIds.length})</span>
                  </button>

                  <button
                    type="button"
                    disabled={bulkActionLoading}
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete ({selectedProductIds.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 w-10 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSelectAllOnPage(currentPageProductIds)}
                        className="cursor-pointer flex items-center justify-center mx-auto"
                        title={isAllOnPageSelected ? "Deselect page" : "Select page"}
                      >
                        {isAllOnPageSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#991B1B]" />
                        ) : isSomeOnPageSelected ? (
                          <MinusSquare className="w-4 h-4 text-[#991B1B]" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>
                    </th>
                    <th className="py-3.5 px-4 min-w-[220px]">Card Design</th>
                    <th className="py-3.5 px-4 min-w-[140px]">Category &amp; Badge</th>
                    <th className="py-3.5 px-4 min-w-[100px]">Price / Unit</th>
                    <th className="py-3.5 px-4 min-w-[160px]">Paper &amp; Specs</th>
                    <th className="py-3.5 px-4 min-w-[120px]">Status</th>
                    <th className="py-3.5 px-4 text-right min-w-[110px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedShopProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-bold text-sm text-slate-700">No products match your filters</p>
                        <p className="text-xs text-slate-400 mt-0.5">Try clearing your search query or selecting another category.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedShopProducts.map((product) => {
                      const isSelected = selectedProductIds.includes(product.id);
                      const isGift = product.category === "return_gifts";
                      let featuresList: string[] = [];
                      try {
                        const parsed = JSON.parse(product.featuresJson);
                        if (Array.isArray(parsed)) featuresList = parsed;
                      } catch {
                        // ignore
                      }

                      return (
                        <tr
                          key={product.id}
                          className={`transition-colors ${
                            isSelected ? "bg-red-50/40" : "hover:bg-slate-50"
                          }`}
                        >
                          {/* 0. Row Checkbox */}
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSelectProduct(product.id)}
                              className="cursor-pointer flex items-center justify-center mx-auto"
                              title={isSelected ? "Deselect item" : "Select item"}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#991B1B]" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                              )}
                            </button>
                          </td>

                          {/* 1. Image Thumbnail & Title */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative flex items-center justify-center">
                                <img
                                  src={product.previewImage}
                                  alt={product.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-900 text-sm block leading-snug line-clamp-1">
                                  {product.name}
                                </span>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                  <span>⭐ {product.rating || 5.0}</span>
                                  <span>•</span>
                                  <span>{product.reviewsCount || 0} reviews</span>
                                </div>
                                {product.canvaTemplateId && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-mono mt-0.5">
                                    <span>🎨 Canva:</span>
                                    <span className="truncate max-w-[100px]">{product.canvaTemplateId}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 2. Category & Badge */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 block w-fit">
                                {isGift ? "🎁 Return Gift" : product.category}
                              </span>
                              {product.badge && (
                                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider bg-red-50 text-[#991B1B] border border-red-200 block w-fit">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 3. Price & Min Copies */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <span className="text-base font-extrabold text-[#991B1B]">₹{product.pricePerCard}</span>
                              <span className="text-[10px] text-slate-500 block font-medium">
                                {isGift ? `Min: ${product.minCopies || 25} pcs` : `Base (1000+) • Min ${product.minCopies || 50}`}
                              </span>
                            </div>
                          </td>

                          {/* 4. Paper & Specs */}
                          <td className="py-4 px-4">
                            <div className="max-w-[220px] space-y-1">
                              <p className="text-[11px] font-bold text-slate-700 truncate">{product.paperType}</p>
                              <p className="text-[10px] text-slate-500">Size: {product.dimensions}</p>
                              {featuresList.length > 0 && (
                                <p className="text-[10px] text-slate-400 truncate">• {featuresList[0]}</p>
                              )}
                            </div>
                          </td>

                          {/* 5. Status Toggle */}
                          <td className="py-4 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleProductActive(product)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                product.isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                  : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                              }`}
                              title="Click to toggle active/hidden on /shop"
                            >
                              {product.isActive ? "● Active on /shop" : "○ Hidden"}
                            </button>
                          </td>

                          {/* 6. Action Buttons */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProductModal(product)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#991B1B] border border-slate-200 transition-colors cursor-pointer"
                                title="Edit Product Details & Price"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={deletingProductId === product.id}
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                                title="Delete Product"
                              >
                                {deletingProductId === product.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-slate-600">
                <span className="text-center sm:text-left">
                  Showing{" "}
                  <strong className="text-slate-900">
                    {totalShopItems === 0
                      ? 0
                      : (validCurrentPage - 1) * effectivePageSize + 1}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-slate-900">
                    {Math.min(validCurrentPage * effectivePageSize, totalShopItems)}
                  </strong>{" "}
                  of <strong className="text-slate-900">{totalShopItems}</strong> products
                </span>

                <div className="flex items-center gap-1.5 ml-1">
                  <span className="text-slate-400">Per page:</span>
                  <select
                    value={shopPageSize}
                    onChange={(e) => {
                      setShopPageSize(Number(e.target.value));
                      setShopCurrentPage(1);
                    }}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={0}>All</option>
                  </select>
                </div>
              </div>

              {/* Page Navigator */}
              {totalShopPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={validCurrentPage <= 1}
                    onClick={() => setShopCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                    {Array.from({ length: Math.min(totalShopPages, 7) }, (_, i) => {
                      let pageNum = i + 1;
                      if (totalShopPages > 7 && validCurrentPage > 4) {
                        pageNum = validCurrentPage - 3 + i;
                        if (pageNum > totalShopPages) pageNum = totalShopPages - (6 - i);
                      }
                      return (
                        <button
                          key={`page_${pageNum}`}
                          type="button"
                          onClick={() => setShopCurrentPage(pageNum)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                            validCurrentPage === pageNum
                              ? "bg-[#991B1B] text-white shadow-xs"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={validCurrentPage >= totalShopPages}
                    onClick={() => setShopCurrentPage((prev) => Math.min(totalShopPages, prev + 1))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Dynamic Canva Studio Templates */}
        {activeTab === "CANVA_TEMPLATES" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header & Main Call-To-Action */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#991B1B]" />
                    <span>Canva Card Studio Templates</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#991B1B] text-xs font-mono font-bold border border-red-200">
                    {canvaTemplatesList.length} Dynamic Built
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Design, position transparent PNG graphics, customize wedding fonts, and publish luxury card templates live to <strong>/canva</strong>.
                </p>
              </div>

              {/* Action: Open Visual Drag-and-Drop Studio */}
              <Link
                href="/admin/canva-templates/builder"
                className="w-full md:w-auto px-5 py-2.5 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-red-950/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Create Template (Visual Studio)</span>
              </Link>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={canvaSearchQuery}
                  onChange={(e) => setCanvaSearchQuery(e.target.value)}
                  placeholder="Search templates by name, category, or slug..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#991B1B]"
                />
              </div>

              {/* Topic Filters */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                {[
                  { id: "ALL", label: "All Topics" },
                  { id: "vintage", label: "📜 Vintage" },
                  { id: "modern", label: "✨ Modern" },
                ].map((topicItem) => (
                  <button
                    key={topicItem.id}
                    type="button"
                    onClick={() => setCanvaTopicFilter(topicItem.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      canvaTopicFilter === topicItem.id
                        ? "bg-[#991B1B] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {topicItem.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Cards Grid */}
            {canvaTemplatesList.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-4 bg-slate-50/50">
                <div className="w-14 h-14 rounded-3xl bg-red-50 text-[#991B1B] flex items-center justify-center mx-auto border border-red-100 shadow-sm">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">No Custom Admin Templates Created Yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    The 7 built-in starter templates are currently active in <strong>/canva</strong>. You can now build and publish custom templates with transparent PNG overlays, custom background images, and positioned text layers!
                  </p>
                </div>
                <Link
                  href="/admin/canva-templates/builder"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#991B1B] text-white text-xs font-bold shadow-md hover:bg-[#7F1D1D] transition-all"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>Launch Visual Drag-and-Drop Studio</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {canvaTemplatesList
                  .filter((t) => {
                    const matchesTopic =
                      canvaTopicFilter === "ALL" ||
                      t.topic.toLowerCase() === canvaTopicFilter.toLowerCase();
                    const matchesSearch =
                      canvaSearchQuery.trim() === "" ||
                      t.name.toLowerCase().includes(canvaSearchQuery.toLowerCase()) ||
                      t.category.toLowerCase().includes(canvaSearchQuery.toLowerCase()) ||
                      t.slug.toLowerCase().includes(canvaSearchQuery.toLowerCase());
                    return matchesTopic && matchesSearch;
                  })
                  .map((tpl) => (
                    <div
                      key={tpl.id}
                      className="bg-white border border-slate-200 hover:border-[#991B1B]/40 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Preview Thumbnail Container */}
                        <div
                          style={{
                            backgroundColor: tpl.backgroundColor || "#F3EAD8",
                          }}
                          className="relative aspect-[3/4] w-full overflow-hidden border-b border-slate-100 flex items-center justify-center p-0 bg-slate-50"
                        >
                          {tpl.previewImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={tpl.previewImage}
                              alt={tpl.name}
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            />
                          ) : tpl.backgroundImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={tpl.backgroundImage}
                              alt={tpl.name}
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-center bg-white/90 backdrop-blur-xs p-2 rounded-lg border border-slate-200 shadow-2xs max-w-[85%] space-y-0.5">
                              <h5 className="font-serif font-bold text-[11px] text-[#991B1B] truncate">
                                {tpl.name}
                              </h5>
                              <p className="text-[9px] text-slate-500 font-mono">
                                {tpl.elements?.length || 0} Layers
                              </p>
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className="absolute top-1.5 right-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide shadow-2xs ${
                                tpl.isActive
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-700 text-slate-200"
                              }`}
                            >
                              {tpl.isActive ? "Active" : "Draft"}
                            </span>
                          </div>

                          {/* Topic Pill */}
                          <div className="absolute bottom-1.5 left-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-black/60 text-white text-[8px] font-mono font-bold backdrop-blur-xs">
                              {tpl.topic.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Metadata Details */}
                        <div className="p-2.5 space-y-0.5">
                          <h4 className="font-bold text-xs text-slate-900 truncate" title={tpl.name}>
                            {tpl.name}
                          </h4>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="truncate max-w-[90px]">{tpl.category}</span>
                            <span className="font-mono text-[9px] bg-slate-100 px-1 py-0.5 rounded text-slate-600 shrink-0">
                              {tpl.elements?.length || 0} Layers
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="p-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-1.5">
                        {/* Edit in Visual Studio */}
                        <Link
                          href={`/admin/canva-templates/builder?id=${tpl.id}`}
                          className="flex-1 py-1 px-2 rounded-lg bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-[11px] font-bold text-center transition-all flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Edit3 className="w-3 h-3 text-amber-300" />
                          <span>Edit</span>
                        </Link>

                        {/* Visibility Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleCanvaStatus(tpl.id, tpl.isActive)}
                          disabled={togglingCanvaId === tpl.id}
                          className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          title={tpl.isActive ? "Deactivate template" : "Activate template"}
                        >
                          {tpl.isActive ? (
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteCanvaTemplate(tpl.id, tpl.name)}
                          disabled={deletingCanvaTemplateId === tpl.id}
                          className="p-1 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                          title="Delete template"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: 👑 ADMIN STAFF & RBAC PERMISSIONS (Super Admin Only) */}
        {activeTab === "ADMIN_STAFF" && isSuperAdmin && (
          <div className="space-y-5 sm:space-y-6 animate-fade-in">
            {/* Header with Title and Action Buttons */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-200">
                    <Crown className="w-4 h-4 text-amber-700" />
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Admin Staff &amp; Role-Based Access Control (RBAC)
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Create sub-admins with tailored permissions or promote existing registered users to administrative roles.
                </p>
              </div>

              {/* Action Buttons: Create Sub-Admin & Promote User */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={handleOpenCreateStaffModal}
                  className="px-4 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer grow sm:grow-0"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>+ Create Sub-Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenPromoteModal()}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer grow sm:grow-0"
                >
                  <Crown className="w-4 h-4 text-slate-950" />
                  <span>👑 Promote Existing User</span>
                </button>
              </div>
            </div>

            {/* Quick Filter / Search */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search administrators by name, email or phone..."
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#991B1B]"
                />
                {staffSearchQuery && (
                  <button
                    onClick={() => setStaffSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Staff List Table */}
            {staffLoading ? (
              <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#991B1B]" />
                <span className="text-xs font-medium">Loading administrative staff...</span>
              </div>
            ) : staffList.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6">
                <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Sub-Admins Created Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Only the primary Super Admin is active. Click &quot;+ Create Sub-Admin&quot; or &quot;Promote Existing User&quot; above to delegate dashboard responsibilities.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">Administrator / Staff</th>
                      <th className="py-3.5 px-4">Role Level</th>
                      <th className="py-3.5 px-4">Granted Permissions &amp; Modules</th>
                      <th className="py-3.5 px-4">Created On</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {staffList
                      .filter((s) => {
                        if (!staffSearchQuery) return true;
                        const q = staffSearchQuery.toLowerCase();
                        return (
                          s.name?.toLowerCase().includes(q) ||
                          s.email?.toLowerCase().includes(q) ||
                          (s.phone && s.phone.includes(q))
                        );
                      })
                      .map((staff) => (
                        <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Staff Name & Email */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border ${
                                staff.isSuperAdmin
                                  ? "bg-amber-100 text-amber-900 border-amber-300 shadow-xs"
                                  : staff.role === "ADMIN"
                                  ? "bg-red-50 text-[#991B1B] border-red-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}>
                                {staff.name ? staff.name.charAt(0).toUpperCase() : staff.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 text-xs">{staff.name || "Admin Staff"}</span>
                                  {staff.isSuperAdmin && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-amber-400/30 text-amber-900 text-[9px] font-black border border-amber-400">
                                      PRIMARY OWNER
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-500 block font-mono mt-0.5">{staff.email}</span>
                                {staff.phone && <span className="text-[10px] text-slate-400 block">{staff.phone}</span>}
                              </div>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="py-3.5 px-4">
                            {staff.isSuperAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300 shadow-2xs">
                                <Crown className="w-3 h-3 text-amber-700" />
                                <span>SUPER ADMIN</span>
                              </span>
                            ) : staff.role === "ADMIN" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-[#991B1B] text-[10px] font-black border border-red-300">
                                <ShieldCheck className="w-3 h-3 text-[#991B1B]" />
                                <span>FULL ADMIN</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
                                <ShieldCheck className="w-3 h-3 text-blue-600" />
                                <span>SUB ADMIN</span>
                              </span>
                            )}
                          </td>

                          {/* Granted Permissions Chips */}
                          <td className="py-3.5 px-4">
                            {staff.isSuperAdmin ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>All 5 Modules Unrestricted</span>
                              </span>
                            ) : staff.adminPermissions && staff.adminPermissions.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 max-w-md">
                                {staff.adminPermissions.map((perm) => {
                                  let label = perm;
                                  let color = "bg-slate-100 text-slate-700 border-slate-200";
                                  if (perm === "ORDERS_MANAGE") {
                                    label = "📦 Orders";
                                    color = "bg-blue-50 text-blue-700 border-blue-200";
                                  } else if (perm === "USERS_MANAGE") {
                                    label = "👥 Users";
                                    color = "bg-emerald-50 text-emerald-700 border-emerald-200";
                                  } else if (perm === "INVITATIONS_MANAGE") {
                                    label = "🛡️ Invites";
                                    color = "bg-purple-50 text-purple-700 border-purple-200";
                                  } else if (perm === "CANVA_TEMPLATES_MANAGE") {
                                    label = "✨ Canva Studio";
                                    color = "bg-amber-50 text-amber-800 border-amber-200";
                                  } else if (perm === "SHOP_PRODUCTS_MANAGE") {
                                    label = "🛍️ Shop";
                                    color = "bg-rose-50 text-rose-700 border-rose-200";
                                  }
                                  return (
                                    <span
                                      key={perm}
                                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${color}`}
                                    >
                                      {label}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No permissions assigned</span>
                            )}
                          </td>

                          {/* Created On */}
                          <td className="py-3.5 px-4 text-[11px] text-slate-500 font-mono">
                            {new Date(staff.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            {staff.isSuperAdmin ? (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                                Primary Owner
                              </span>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditStaffModal(staff)}
                                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Edit staff permissions"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRevokeStaff(staff.id, staff.email)}
                                  disabled={revokingStaffId === staff.id}
                                  className="px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                                  title="Revoke admin access (demote back to regular user)"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>{revokingStaffId === staff.id ? "Revoking..." : "Revoke"}</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
          </div>
        </div>

        {/* Modal: Add or Edit Shop Product */}
        {shopModalOpen && (
          <div data-lenis-prevent className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain">
            <div data-lenis-prevent className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full shadow-2xl relative space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto overscroll-contain animate-scale-up">
              <button
                type="button"
                onClick={() => setShopModalOpen(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#991B1B] flex items-center justify-center border border-red-100 shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingProduct ? "Edit Traditional Card Product" : "Add New Traditional Card to /shop"}
                  </h3>
                  <p className="text-xs text-slate-500">Fill in card specifications, pricing, and upload card design.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                {/* Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      {["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category)
                        ? "Return Gift / Item Title *"
                        : "Card Design Title *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder={
                        ["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category)
                          ? "e.g. Antique Brass Peacock Diya Pair in Velvet Box"
                          : "e.g. Royal Heritage Gold Embossed Card"
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-[#991B1B]"
                    >
                      <optgroup label="💌 Traditional Invitation Cards">
                        <option value="royal">👑 Royal &amp; Heritage (Cards)</option>
                        <option value="floral">🌸 Floral &amp; Botanical (Cards)</option>
                        <option value="vintage">📜 Vintage Parchment (Cards)</option>
                        <option value="modern">✨ Modern Die-Cut Arch (Cards)</option>
                        <option value="velvet">💎 Luxury Velvet Suites (Cards)</option>
                      </optgroup>
                      <optgroup label="🎁 Return Gifts &amp; Favors">
                        <option value="return_gifts">🎁 All / General Return Gifts</option>
                        <option value="brass">🪔 Brass Diyas &amp; Idols (Return Gift)</option>
                        <option value="hampers">🍬 Sweets &amp; Dry Fruits Hampers (Return Gift)</option>
                        <option value="silver">🪙 Silver Pooja Coins (Return Gift)</option>
                        <option value="bags">🛍️ Brocade &amp; Jute Bags (Return Gift)</option>
                        <option value="candles">🕯️ Aromatherapy Candles (Return Gift)</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Price, Min Copies, Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      {["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category)
                        ? "Price Per Unit / Piece (₹) *"
                        : "Base Price (1000+ prints) (₹) *"}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={productForm.pricePerCard}
                      onChange={(e) => setProductForm({ ...productForm, pricePerCard: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#991B1B] focus:outline-none focus:border-[#991B1B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      {["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category)
                        ? "Min Order Pieces"
                        : "Min Order Copies (Min 50)"}
                    </label>
                    <input
                      type="number"
                      min={50}
                      value={productForm.minCopies || 50}
                      onChange={(e) => setProductForm({ ...productForm, minCopies: Math.max(50, Number(e.target.value) || 50) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Badge Tag (Optional)</label>
                    <input
                      type="text"
                      value={productForm.badge}
                      onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                      placeholder="e.g. BESTSELLER, NEW, ROYAL LUXE"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                    />
                  </div>
                </div>

                {/* ── LIVE TIERED VOLUME PRICING PREVIEW MATRIX ── */}
                {!["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category) && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-amber-950 flex items-center gap-1.5 text-xs">
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span>Live Tiered Volume Pricing Matrix (Base: ₹{productForm.pricePerCard || 0} for 1000+ prints)</span>
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                        Min 50 Copies
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono">
                      {CARD_PRICING_TIERS.map((tier) => {
                        const sampleQty = tier.min;
                        const res = calculateTieredCardPrice(productForm.pricePerCard || 0, sampleQty);
                        return (
                          <div key={tier.label} className="bg-white p-2.5 rounded-xl border border-amber-200/70 shadow-2xs text-center">
                            <span className="text-[10px] font-bold text-slate-500 block truncate" title={tier.label}>
                              {tier.min}{tier.max ? `-${tier.max}` : "+"} copies
                            </span>
                            <div className="text-sm font-extrabold text-[#991B1B] my-0.5">
                              ₹{res.unitPrice}
                              <span className="text-[9px] font-normal text-slate-500 block">/ card</span>
                            </div>
                            <span className="text-[9px] font-bold text-amber-700 block">
                              {tier.markupPercent === 0 ? "Base (0%)" : `+${tier.markupPercent}%`}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-amber-900/90 font-sans leading-normal">
                      💡 <strong>Tier Logic:</strong> 1000+ prints: base rate (₹{productForm.pricePerCard || 0}) • 500-999: <strong>+80%</strong> • 300-499: <strong>+180%</strong> • 150-299: <strong>+250%</strong> • 80-149: <strong>+300%</strong> • 50-79: <strong>+450%</strong> (Min 50 copies). All decimals are automatically rounded to whole numbers.
                    </p>
                  </div>
                )}

                {/* ── 1. MAIN COVER IMAGE UPLOAD ── */}
                <div className="p-4 rounded-2xl border-2 border-red-200/80 bg-red-50/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#991B1B] text-white text-[10px] font-extrabold uppercase tracking-wide">
                        Main Image *
                      </span>
                      <label className="font-bold text-slate-900 text-xs">
                        {["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category)
                          ? "Primary Gift Cover Photo"
                          : "Primary Card Cover Photo"}
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowManualUrl((prev) => !prev)}
                      className="text-[11px] text-[#991B1B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>{showManualUrl ? "Switch to Local Upload" : "Enter Image URL"}</span>
                    </button>
                  </div>

                  {/* Hidden Native File Input for Main Image */}
                  <input
                    type="file"
                    id="shopProductFileInput"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleUploadProductImage}
                  />

                  {!showManualUrl ? (
                    <div className="space-y-2">
                      {productForm.previewImage ? (
                        <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-red-200 shadow-2xs">
                          <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0 p-1 flex items-center justify-center relative">
                            <img
                              src={productForm.previewImage}
                              alt="Main Product Preview"
                              className="w-full h-full object-contain"
                            />
                            <span className="absolute bottom-1 right-1 bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded shadow-xs">
                              MAIN
                            </span>
                          </div>
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Main Cover Photo Ready</span>
                            </div>
                            <p className="text-[10px] font-mono text-slate-500 truncate max-w-xs">
                              {productForm.previewImage}
                            </p>
                            <label
                              htmlFor="shopProductFileInput"
                              className={`px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                                uploadingProductImage ? "opacity-50 pointer-events-none" : ""
                              }`}
                            >
                              {uploadingProductImage ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#991B1B]" />
                              ) : (
                                <Upload className="w-3.5 h-3.5 text-[#991B1B]" />
                              )}
                              <span>{uploadingProductImage ? "Uploading Main..." : "Change Main Cover Image"}</span>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="shopProductFileInput"
                          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-red-300 hover:border-[#991B1B] rounded-2xl bg-white hover:bg-red-50/50 transition-colors cursor-pointer text-center group"
                        >
                          {uploadingProductImage ? (
                            <div className="flex flex-col items-center gap-2 text-[#991B1B]">
                              <Loader2 className="w-8 h-8 animate-spin" />
                              <span className="font-bold text-xs">Uploading main image from your computer...</span>
                            </div>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#991B1B] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6" />
                              </div>
                              <span className="font-bold text-xs text-slate-800">
                                Click to Browse &amp; Upload Main Cover Image
                              </span>
                              <span className="text-[11px] text-slate-500 mt-0.5">
                                Select PNG, JPG, or WEBP (Cover image displayed in catalog)
                              </span>
                            </>
                          )}
                        </label>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        required
                        value={productForm.previewImage}
                        onChange={(e) => setProductForm({ ...productForm, previewImage: e.target.value })}
                        placeholder="https://res.cloudinary.com/... or /images/templates/..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#991B1B]"
                      />
                      {productForm.previewImage && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">Main Preview:</span>
                          <img
                            src={productForm.previewImage}
                            alt="Main Preview"
                            className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-slate-50 p-0.5"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── 2. SUB / GALLERY IMAGES MULTI-UPLOAD ── */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-700 text-white text-[10px] font-extrabold uppercase tracking-wide">
                        Sub Images
                      </span>
                      <label className="font-bold text-slate-900 text-xs">
                        Additional Angles, Envelopes &amp; Detail Shots
                      </label>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">
                      {productForm.galleryImages?.length || 0} Sub {(productForm.galleryImages?.length === 1 ? "Image" : "Images")} Uploaded
                    </span>
                  </div>

                  {/* Hidden Multi-File Input for Sub Images */}
                  <input
                    type="file"
                    id="shopProductSubFilesInput"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleUploadProductSubImages}
                  />

                  {/* Multi-Upload Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label
                      htmlFor="shopProductSubFilesInput"
                      className={`flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all ${
                        uploadingSubImages ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {uploadingSubImages ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#991B1B]" />
                      ) : (
                        <Plus className="w-4 h-4 text-[#991B1B]" />
                      )}
                      <span>
                        {uploadingSubImages ? "Uploading Sub Images..." : "Upload Multiple Sub Images (Select 1 or more)"}
                      </span>
                    </label>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={subImageUrlInput}
                        onChange={(e) => setSubImageUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSubImageUrl();
                          }
                        }}
                        placeholder="Or paste sub-image URL..."
                        className="p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-[#991B1B] w-48 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddSubImageUrl}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shrink-0 cursor-pointer shadow-2xs"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* Sub Images Gallery Grid */}
                  {productForm.galleryImages && productForm.galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
                      {productForm.galleryImages.map((subImg, idx) => (
                        <div
                          key={idx}
                          className="group relative bg-white border border-slate-200 rounded-xl p-1 shadow-2xs flex flex-col items-center justify-between overflow-hidden"
                        >
                          <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                            <img
                              src={subImg}
                              alt={`Sub Image ${idx + 1}`}
                              className="w-full h-full object-contain p-0.5"
                            />
                            <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[8px] font-bold px-1.5 py-0.2 rounded">
                              #{idx + 1}
                            </span>
                          </div>

                          {/* Action Overlay */}
                          <div className="w-full flex items-center justify-between gap-1 pt-1">
                            <button
                              type="button"
                              onClick={() => handleSetAsMainImage(subImg, idx)}
                              title="Promote this sub image to Main Cover"
                              className="flex-1 py-1 rounded bg-amber-50 hover:bg-amber-400 text-amber-800 hover:text-slate-950 font-black text-[9px] border border-amber-200 transition-colors flex items-center justify-center gap-0.5 cursor-pointer"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-amber-600 group-hover:text-slate-950" />
                              <span>Make Main</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubImage(idx)}
                              title="Delete this sub image"
                              className="p-1 rounded bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold text-[9px] border border-rose-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] text-slate-500 italic">
                    💡 Tip: The <strong>Main Image</strong> is displayed on catalog cards. <strong>Sub Images</strong> are displayed as interactive thumbnails when customers view product details. You can click <em>&ldquo;Make Main&rdquo;</em> on any sub-image to swap it.
                  </p>

                  {uploadError && (
                    <p className="text-rose-600 font-bold text-[11px]">{uploadError}</p>
                  )}
                </div>

                {/* Paper Type / Material & Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      {["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category)
                        ? "Material & Packaging"
                        : "Paper Type & Quality"}
                    </label>
                    <input
                      type="text"
                      value={productForm.paperType}
                      onChange={(e) => setProductForm({ ...productForm, paperType: e.target.value })}
                      placeholder={
                        ["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category)
                          ? "e.g. Handcrafted Solid Brass & Royal Velvet Box"
                          : "e.g. 350 GSM Italian Textured Metallic Gold Cardstock"
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      {["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category)
                        ? "Dimensions / Weight / Set Size"
                        : "Dimensions / Size"}
                    </label>
                    <input
                      type="text"
                      value={productForm.dimensions}
                      onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                      placeholder={
                        ["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category)
                          ? "e.g. 4.5 x 3.5 inches / Set of 2 (250g)"
                          : "e.g. 5.5 x 8.5 inches (Portrait)"
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                    />
                  </div>
                </div>

                {/* Linked Canva Studio Design (Optional) */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
                  <label className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span>🎨 Link to Canva Card Studio Template (Optional)</span>
                  </label>
                  <select
                    value={productForm.canvaTemplateId}
                    onChange={(e) => setProductForm({ ...productForm, canvaTemplateId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                  >
                    <option value="">None (Standard Printed Card / Return Gift - No Canva Edit)</option>
                    <optgroup label="✨ Modern Watercolor &amp; Arch Suites">
                      <option value="modern-watercolor-floral">🌸 Modern Watercolor Floral &amp; Rings (Purple / Multi-color)</option>
                      <option value="modern-watercolor-gold-splatter">✨ Modern Watercolor &amp; Gold Foil Splatter</option>
                      <option value="modern-silver-botanical-foliage">💎 Midnight Silver Foliage Suite (Navy / Obsidian)</option>
                    </optgroup>
                    <optgroup label="👑 Vintage &amp; Heritage Suites">
                      <option value="vintage-botanical-romance">🌿 Vintage Botanical Romance (Deckled Parchment)</option>
                      <option value="royal-parchment-filigree">👑 Royal Parchment &amp; Filigree (Parchment Gold)</option>
                      <option value="vintage-baroque-gold">📜 Vintage Baroque Gold Scroll (Royal Frame)</option>
                      <option value="antique-parchment-victorian">⚜️ Antique Parchment &amp; Victorian Swirl (Victorian Arch)</option>
                    </optgroup>
                  </select>
                  <p className="text-[10.5px] text-amber-900/80 leading-relaxed m-0">
                    💡 If linked, a prominent <strong className="text-[#991B1B]">"🎨 Customize in Canva Card Studio"</strong> button will automatically appear on the shop card modal, navigating guests directly into Canva Card Studio with this design pre-loaded.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder={
                      ["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category)
                        ? "Provide details on return gift craftsmanship, occasion suitability, packaging, and custom tags."
                        : "Provide a luxury summary of the card design, printing techniques, and aesthetic appeal."
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#991B1B]"
                  />
                </div>

                {/* Features (One per line) */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Bullet Features (One per line)</label>
                  <textarea
                    rows={3}
                    value={productForm.features}
                    onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                    placeholder={
                      ["return_gifts", "brass", "hampers", "silver", "bags", "candles"].includes(productForm.category)
                        ? "Solid Heavy Brass with Antique Finish\nRoyal Red Velvet Hard Box Included\nPersonalized Couple Tag Attached"
                        : "Real Gold Foil Stamping on Titles\nHeavy 350 GSM Textured Board\nMatching Luxury Envelopes Included"
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 font-mono focus:outline-none focus:border-[#991B1B]"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="productIsActive"
                    checked={productForm.isActive}
                    onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#991B1B] accent-[#991B1B] rounded"
                  />
                  <label htmlFor="productIsActive" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Publish &amp; Show on Public /shop Catalog
                  </label>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShopModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="px-6 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold flex items-center gap-2 shadow-md hover:scale-105 transition-transform cursor-pointer disabled:opacity-50"
                  >
                    {savingProduct ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{editingProduct ? "Update Product" : "Publish to /shop"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Message Customer Thread */}
        {selectedOrderForMessage && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 max-w-lg w-full space-y-4 relative shadow-2xl border border-gray-200 max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setSelectedOrderForMessage(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 border-b border-gray-200 pb-3">
                <div className="w-9 h-9 rounded-xl bg-[#7A1F2B] text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-[#D9A441]" />
                </div>
                <div className="pr-6">
                  <h3 className="font-serif font-bold text-[#1E293B] text-sm sm:text-base leading-snug">
                    Message: {selectedOrderForMessage.customerName}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-mono truncate">Order #{selectedOrderForMessage.orderNumber} ({selectedOrderForMessage.customerEmail})</p>
                </div>
              </div>

              {/* Message Thread History */}
              <div className="max-h-56 sm:max-h-60 overflow-y-auto space-y-2.5 p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs custom-scrollbar">
                {selectedOrderForMessage.messages.length === 0 ? (
                  <p className="text-gray-400 text-center py-4 text-xs">No previous messages. Write the first message below!</p>
                ) : (
                  selectedOrderForMessage.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl ${
                        m.sender === "ADMIN"
                          ? "bg-[#FAF3E0] text-[#8C6B1B] border border-[#D9A441]/30 ml-3 sm:ml-4"
                          : "bg-white text-gray-800 border border-gray-200 mr-3 sm:mr-4"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1">
                        <span>{m.sender === "ADMIN" ? "Admin Support" : "Customer"}</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="text-xs whitespace-pre-wrap">{m.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 block">
                  Write Message (sent to user&apos;s email automatically):
                </label>
                <textarea
                  rows={3}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="e.g. Hi! Your custom print proof is ready..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:border-[#D9A441]"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForMessage(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={sendingMessage || !messageInput.trim()}
                  onClick={() => handleSendOrderMessage(selectedOrderForMessage.id)}
                  className="px-5 py-2.5 rounded-xl bg-[#7A1F2B] text-white text-xs font-bold hover:bg-[#9B2C3B] transition-colors flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>{sendingMessage ? "Sending..." : "Send & Email Customer"}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Modal: Full Card Image Preview */}
        {previewModalImage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 max-w-lg w-full flex flex-col items-center gap-3 relative shadow-2xl">
              <button
                onClick={() => setPreviewModalImage(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-serif font-bold text-sm text-[#1E293B]">Customer Card Design Snapshot</h3>
              <div className="max-h-[75vh] overflow-hidden rounded-2xl border border-gray-200">
                <img src={previewModalImage} alt="Card Preview" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        )}

        {selectedUser && (
          <div data-lenis-prevent className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div data-lenis-prevent className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-3xl sm:max-w-4xl w-full shadow-2xl relative space-y-5 sm:space-y-6 animate-scale-up max-h-[92vh] overflow-y-auto pr-3 sm:pr-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors shadow-xs cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 sm:pb-4 pr-8">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-red-50 text-[#991B1B] flex items-center justify-center border border-red-100 shrink-0">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-snug">User Authority &amp; Lock Manager</h3>
                  <p className="text-[11px] sm:text-sm text-slate-500 font-semibold truncate max-w-[240px] sm:max-w-md">{selectedUser.name} ({selectedUser.email})</p>
                </div>
              </div>

              {/* SECTION A: CREATED INVITATION TEMPLATES & LOCK CONTROLS FOR THIS USER */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#991B1B] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#991B1B]" />
                    Created Invitation Websites ({invitationsList.filter((inv) => inv.userId === selectedUser.id || inv.userEmail.toLowerCase() === selectedUser.email.toLowerCase()).length})
                  </h4>
                </div>

                {invitationsList.filter((inv) => inv.userId === selectedUser.id || inv.userEmail.toLowerCase() === selectedUser.email.toLowerCase()).length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-white rounded-xl border border-slate-200">
                    This user has not created any invitation websites yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {invitationsList
                      .filter((inv) => inv.userId === selectedUser.id || inv.userEmail.toLowerCase() === selectedUser.email.toLowerCase())
                      .map((inv) => {
                        const isCurrentlyLocked = (inv.isLocked && !inv.isUnlockedByAdmin) || inv.isLockedByAdmin;

                        return (
                          <div key={inv.id} className="p-4 bg-white rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center shadow-xs hover:border-red-200 transition-all">
                            {/* Left Info: Bride & Groom, Slug Badge, Public Link */}
                            <div className="md:col-span-7 space-y-1">
                              <div className="font-bold text-sm text-slate-900">
                                {inv.partnerOne} &amp; {inv.partnerTwo}
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold border border-slate-200">
                                  {inv.templateSlug}
                                </span>
                                <a
                                  href={`/invitations/${inv.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-[#991B1B] font-mono underline hover:text-[#7F1D1D] truncate max-w-[180px] sm:max-w-[220px]"
                                >
                                  /{inv.slug}
                                </a>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  • {inv.daysInUse} Days Active
                                </span>
                              </div>
                            </div>

                            {/* Right Info: Status Badge & Action Button */}
                            <div className="md:col-span-5 flex items-center justify-start md:justify-end gap-2 flex-wrap">
                              {inv.isUnlockedByAdmin ? (
                                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0">
                                  <Sparkles className="w-3 h-3 text-amber-600" />
                                  Admin Unlocked
                                </span>
                              ) : isCurrentlyLocked ? (
                                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0">
                                  <Lock className="w-3 h-3 text-rose-600" />
                                  {inv.isLockedByAdmin ? "Admin Locked" : "Locked (2H Pre-Event)"}
                                </span>
                              ) : (
                                <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    Active (Editable)
                                  </span>
                                  {inv.timeUntilLockText && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[9.5px] font-bold font-mono flex items-center gap-1 shadow-2xs">
                                      ⏳ {inv.timeUntilLockText}
                                    </span>
                                  )}
                                </div>
                              )}

                              <button
                                type="button"
                                disabled={togglingLockId === inv.id}
                                onClick={() => handleToggleLock(inv.id, isCurrentlyLocked)}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold inline-flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer ${
                                  isCurrentlyLocked
                                    ? "bg-[#991B1B] text-white hover:bg-[#7F1D1D]"
                                    : "bg-slate-700 text-white hover:bg-slate-800"
                                }`}
                              >
                                {togglingLockId === inv.id ? (
                                  <span className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
                                ) : isCurrentlyLocked ? (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                    <span>Unlock Edit Access</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Lock Edit Access</span>
                                  </>
                                )}
                              </button>

                              {/* Delete Template Button */}
                              <button
                                type="button"
                                disabled={deletingInvitationId === inv.id}
                                onClick={() => handleDeleteInvitation(inv.id, `${inv.partnerOne} & ${inv.partnerTwo}`)}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 font-bold text-[11px] inline-flex items-center gap-1.5 shadow-xs shrink-0 transition-all cursor-pointer disabled:opacity-50"
                                title="Permanently delete this invitation website & RSVP data"
                              >
                                {deletingInvitationId === inv.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* SECTION B: FULL SUBSCRIPTION & TRANSACTION HISTORY */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#991B1B] uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#991B1B]" />
                    Subscription &amp; Transaction History ({selectedUser.subscriptionsHistory?.length || 0} Purchase{selectedUser.subscriptionsHistory?.length !== 1 ? "s" : ""})
                  </h4>
                </div>

                {(!selectedUser.subscriptionsHistory || selectedUser.subscriptionsHistory.length === 0) ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-white rounded-xl border border-slate-200">
                    No recorded subscription transactions for this user.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {selectedUser.subscriptionsHistory.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs hover:border-red-200 transition-all"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              {sub.plan === "CINEMATIC_2000"
                                ? "CINEMATIC ₹2000 Plan"
                                : sub.plan === "PRO_1799"
                                ? "PRO ₹1799 Plan"
                                : sub.plan === "BASIC_599"
                                ? "BASIC ₹599 Plan"
                                : sub.plan}
                            </span>
                            <strong className="text-xs sm:text-sm font-extrabold text-emerald-600">₹{sub.amount.toLocaleString()}</strong>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Purchased On: {new Date(sub.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          {sub.status === "SUCCESS" || sub.status === "COMPLETED" || sub.status === "ACTIVE" ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              SUCCESS
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold text-[10px] uppercase tracking-wider">
                              {sub.status}
                            </span>
                          )}

                          {sub.isExpired ? (
                            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[10px] uppercase tracking-wider">
                              🔴 Finished ({new Date(sub.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] uppercase tracking-wider">
                              🟢 Active (Valid to {new Date(sub.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION C: QUOTA TOP-UP & PLAN OVERRIDE */}
              <form onSubmit={handleGrantSubmit} className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-semibold">Current Standard Templates Allowed:</span>
                    <strong className="text-[#991B1B] font-bold text-sm">{selectedUser.allowedTemplatesCount} Slots</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block font-semibold">Current Premium Cinematic Passes Allowed:</span>
                    <strong className="text-amber-700 font-bold text-sm">{selectedUser.allowedCinematicCount} Passes</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Add Standard Template Slots */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      📜 Add Extra Standard Template Slots
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {[1, 3, 5].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAddTemplateSlots(preset)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            addTemplateSlots === preset
                              ? "bg-[#991B1B] text-white border-[#991B1B]"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          +{preset} Slot{preset > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={addTemplateSlots}
                      onChange={(e) => setAddTemplateSlots(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                      placeholder="Enter number of extra template slots to add"
                    />
                  </div>

                  {/* Add Premium Cinematic Pass Slots */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      👑 Add Extra Premium Wedding Template Slots (₹2000 Cinematic Passes)
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {[1, 2, 3].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAddCinematicSlots(preset)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            addCinematicSlots === preset
                              ? "bg-[#991B1B] text-white border-[#991B1B]"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          +{preset} Pass{preset > 1 ? "es" : ""}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={addCinematicSlots}
                      onChange={(e) => setAddCinematicSlots(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                      placeholder="Enter number of extra cinematic passes to add"
                    />
                  </div>
                </div>

                {/* Add Card Credits */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    🎨 Add Extra Instagram Card Credits
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {[5, 10, 25].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAddCardCredits(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          addCardCredits === preset
                            ? "bg-[#991B1B] text-white border-[#991B1B]"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        +{preset} Credits
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={addCardCredits}
                    onChange={(e) => setAddCardCredits(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                    placeholder="Enter number of extra card credits to add"
                  />
                </div>

                {/* Optional Plan Upgrade */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    👑 Optional Plan Override
                  </label>
                  <select
                    value={overridePlan}
                    onChange={(e) => setOverridePlan(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#991B1B] cursor-pointer"
                  >
                    <option value="">Keep current plan ({selectedUser.plan})</option>
                    <option value="BASIC_599">Set Plan to BASIC ₹599 (1 Template + 2 Cards)</option>
                    <option value="PRO_1799">Set Plan to PRO ₹1799 (4 Templates + 6 Cards)</option>
                    <option value="CINEMATIC_2000">Set Plan to CINEMATIC ₹2000 (1 Premium Template + 10 Cards)</option>
                    <option value="NONE">Reset Plan to Free User</option>
                  </select>
                </div>

                {/* Submit Action */}
                <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="w-full sm:w-1/2 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={granting}
                    className="w-full sm:w-1/2 py-3 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>{granting ? "Granting..." : "Grant Quota & Save"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Sub-Admin Creation, Promotion & Permissions Management */}
        {staffModalOpen && (
          <div data-lenis-prevent className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain">
            <div data-lenis-prevent className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto overscroll-contain animate-scale-up">
              <button
                type="button"
                onClick={() => setStaffModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300 shrink-0">
                  {staffModalMode === "CREATE" ? (
                    <UserPlus className="w-6 h-6 text-amber-800" />
                  ) : staffModalMode === "PROMOTE" ? (
                    <Crown className="w-6 h-6 text-amber-800" />
                  ) : (
                    <Edit3 className="w-6 h-6 text-amber-800" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {staffModalMode === "CREATE"
                      ? "Create New Sub-Admin Account"
                      : staffModalMode === "PROMOTE"
                      ? "Promote Registered User to Admin"
                      : "Edit Admin Staff Permissions"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {staffModalMode === "CREATE"
                      ? "Provision login credentials and configure specific dashboard permissions."
                      : staffModalMode === "PROMOTE"
                      ? "Grant administrative dashboard privileges to an existing registered user."
                      : `Update assigned access permissions for ${staffForm.email}.`}
                  </p>
                </div>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveStaff} className="space-y-4 text-xs">
                {/* MODE 1: PROMOTE - Searchable Candidate Selection */}
                {staffModalMode === "PROMOTE" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Select Registered User to Promote <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCandidateId}
                      onChange={(e) => {
                        const candId = e.target.value;
                        setSelectedCandidateId(candId);
                        const cand = candidatesList.find((c) => c.id === candId) || users.find((u) => u.id === candId);
                        if (cand) {
                          setStaffForm((prev) => ({
                            ...prev,
                            name: cand.name || "",
                            email: cand.email,
                            phone: cand.phone || "",
                          }));
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#991B1B] cursor-pointer"
                      required
                    >
                      <option value="">-- Choose from registered users ({candidatesList.length || users.length} users) --</option>
                      {(candidatesList.length > 0 ? candidatesList : users.filter((u) => u.role !== "ADMIN" && u.role !== "SUPER_ADMIN")).map((cand) => (
                        <option key={cand.id} value={cand.id}>
                          {cand.name ? `${cand.name} (${cand.email})` : cand.email} — Plan: {cand.plan}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Name, Email, Phone (for CREATE or display) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Full Name {staffModalMode === "CREATE" && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={staffForm.name}
                      onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                      required={staffModalMode === "CREATE"}
                      disabled={staffModalMode === "EDIT"}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={staffForm.email}
                      onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                      placeholder="admin.staff@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                      required
                      disabled={staffModalMode !== "CREATE"}
                    />
                  </div>
                </div>

                {/* Password & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {staffModalMode === "CREATE"
                        ? "Login Password *"
                        : "Reset / Update Password (Optional)"}
                    </label>
                    <input
                      type="password"
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                      placeholder={staffModalMode === "CREATE" ? "Min. 6 characters" : "Leave blank to keep existing password"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                      required={staffModalMode === "CREATE"}
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={staffForm.phone}
                      onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#991B1B]"
                    />
                  </div>
                </div>

                {/* Role Level Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Administrative Role Level
                  </label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#991B1B] cursor-pointer"
                  >
                    <option value="SUB_ADMIN">Sub-Admin (Custom Selected Permissions)</option>
                    <option value="ADMIN">Full Admin (All Standard Modules)</option>
                    {staffModalMode === "EDIT" && <option value="USER">Demote back to Regular User (Revoke Admin)</option>}
                  </select>
                </div>

                {/* Granular Permissions Section */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">
                        Assigned Module Permissions
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Select which sections this administrator is allowed to view and manage.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllPermissions}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAllPermissions}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* 5 Permission Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Permission 1: Orders */}
                    <div
                      onClick={() => handleTogglePermission("ORDERS_MANAGE")}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        staffForm.permissions.includes("ORDERS_MANAGE")
                          ? "bg-blue-50/70 border-blue-300 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={staffForm.permissions.includes("ORDERS_MANAGE")}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <Package className="w-3.5 h-3.5 text-blue-600" />
                          <span>Orders &amp; Print Fulfillment</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                          Process card orders, update dispatch status, customer chat &amp; work order PDFs.
                        </p>
                      </div>
                    </div>

                    {/* Permission 2: Users */}
                    <div
                      onClick={() => handleTogglePermission("USERS_MANAGE")}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        staffForm.permissions.includes("USERS_MANAGE")
                          ? "bg-emerald-50/70 border-emerald-300 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={staffForm.permissions.includes("USERS_MANAGE")}
                          onChange={() => {}}
                          className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Users &amp; Quota Top-Ups</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                          View registered users, grant extra template &amp; card credits, manage subscriptions.
                        </p>
                      </div>
                    </div>

                    {/* Permission 3: Invitations & Locks */}
                    <div
                      onClick={() => handleTogglePermission("INVITATIONS_MANAGE")}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        staffForm.permissions.includes("INVITATIONS_MANAGE")
                          ? "bg-purple-50/70 border-purple-300 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={staffForm.permissions.includes("INVITATIONS_MANAGE")}
                          onChange={() => {}}
                          className="w-4 h-4 text-purple-600 rounded-md border-slate-300 focus:ring-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span>Invitations &amp; Anti-Reuse Locks</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                          Inspect live customer websites, view RSVP guests, lock/unlock URLs.
                        </p>
                      </div>
                    </div>

                    {/* Permission 4: Canva Studio */}
                    <div
                      onClick={() => handleTogglePermission("CANVA_TEMPLATES_MANAGE")}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        staffForm.permissions.includes("CANVA_TEMPLATES_MANAGE")
                          ? "bg-amber-50/70 border-amber-300 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={staffForm.permissions.includes("CANVA_TEMPLATES_MANAGE")}
                          onChange={() => {}}
                          className="w-4 h-4 text-amber-600 rounded-md border-slate-300 focus:ring-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Canva Studio &amp; Template Builder</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                          Design, build, edit, and publish dynamic Canva card templates &amp; graphics.
                        </p>
                      </div>
                    </div>

                    {/* Permission 5: Shop Catalog */}
                    <div
                      onClick={() => handleTogglePermission("SHOP_PRODUCTS_MANAGE")}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none sm:col-span-2 ${
                        staffForm.permissions.includes("SHOP_PRODUCTS_MANAGE")
                          ? "bg-rose-50/70 border-rose-300 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={staffForm.permissions.includes("SHOP_PRODUCTS_MANAGE")}
                          onChange={() => {}}
                          className="w-4 h-4 text-rose-600 rounded-md border-slate-300 focus:ring-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <ShoppingBag className="w-3.5 h-3.5 text-rose-600" />
                          <span>Physical Print Shop &amp; Product Catalog</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                          Add and edit traditional card products, cardstocks, wax seal colors, and pricing tiers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStaffModalOpen(false)}
                    className="w-full sm:w-1/2 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingStaff}
                    className="w-full sm:w-1/2 py-3 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {savingStaff ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-amber-300" />
                        <span>
                          {staffModalMode === "CREATE"
                            ? "Create Sub-Admin Account"
                            : staffModalMode === "PROMOTE"
                            ? "Promote User to Admin"
                            : "Save Permission Changes"}
                        </span>
                      </>
                    )}
                  </button>
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
