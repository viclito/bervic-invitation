"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import {
  X,
  ShoppingCart,
  Trash2,
  MapPin,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";

export interface CartItemData {
  id: string;
  userId: string;
  itemType: string;
  templateId: string;
  templateName: string;
  previewImage: string | null;
  copies: number;
  cardDetailsJson: string;
  elementsJson?: string | null;
  customNotes?: string | null;
  price: number;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCartChange?: () => void;
}

interface CartFieldErrors {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryAddress?: string;
  city?: string;
  pincode?: string;
}

function getCardFallbackPreview(templateId?: string, templateName?: string): string {
  const id = String(templateId || "").toLowerCase();
  const name = String(templateName || "").toLowerCase();

  // 1. Modern Watercolor Floral & Rings (Purple)
  if (id.includes("modern-watercolor-floral") || id.includes("modern-floral") || name.includes("floral & rings") || name.includes("modern watercolor floral")) {
    return "/images/canva/modern-floral-thumb.webp";
  }

  // 2. Modern Watercolor & Gold Splatter (Plum / Luxury)
  if (id.includes("modern-watercolor-gold-splatter") || id.includes("modern2") || name.includes("gold splatter") || name.includes("luxury watercolor")) {
    return "/images/canva/modern2-thumb.webp";
  }

  // 3. Modern Botanical Silver Foil & Foliage (Navy / Royal)
  if (id.includes("modern-silver-botanical-foliage") || id.includes("modern3") || name.includes("silver foil") || name.includes("botanical silver")) {
    return "/images/canva/modern3-thumb.webp";
  }

  // 4. Vintage Botanical Romance (Template 1)
  if (id.includes("vintage-botanical") || name.includes("vintage botanical") || id.includes("template1")) {
    return "/images/canva/template1-thumb.webp";
  }

  // 5. Royal Parchment & Filigree (Template 2)
  if (id.includes("royal-parchment") || id.includes("royal-heritage") || name.includes("royal parchment") || name.includes("filigree") || id.includes("template2")) {
    return "/images/canva/template2-thumb.webp";
  }

  // 6. Grand Mughal Royal Architecture (Template 3)
  if (id.includes("grand-mughal") || name.includes("mughal") || id.includes("template3")) {
    return "/images/canva/template3-thumb.webp";
  }

  // 7. Antique Parchment & Victorian Swirl (Template 4)
  if (id.includes("antique-parchment") || id.includes("vintage-victorian") || name.includes("victorian") || id.includes("template4")) {
    return "/images/canva/template4-thumb.webp";
  }

  return "/images/canva/template1-thumb.webp";
}

export default function CartDrawer({ isOpen, onClose, onCartChange }: CartDrawerProps) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [selectedItemForCheckout, setSelectedItemForCheckout] = useState<CartItemData | null>(null);
  const [ordering, setOrdering] = useState<boolean>(false);

  // Customer Contact & Shipping
  const [customerName, setCustomerName] = useState<string>(session?.user?.name || "");
  const [customerEmail, setCustomerEmail] = useState<string>(session?.user?.email || "");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [orderNotes, setOrderNotes] = useState<string>("");

  // Validation State
  const [errors, setErrors] = useState<CartFieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadCart = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.items || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && session) {
      loadCart();
    }
  }, [isOpen, session]);

  useEffect(() => {
    const handleCartUpdated = () => {
      if (session) {
        loadCart();
      }
    };
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [session]);

  const validateCartFields = (): boolean => {
    const errs: CartFieldErrors = {};

    if (!customerName.trim()) {
      errs.customerName = "Full name is required.";
    } else if (customerName.trim().length < 2) {
      errs.customerName = "Name must be at least 2 characters.";
    }

    const digitsOnly = customerPhone.replace(/\D/g, "");
    if (!customerPhone.trim()) {
      errs.customerPhone = "WhatsApp / Phone number is required.";
    } else if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      errs.customerPhone = "Please enter a valid 10-digit mobile number.";
    }

    if (customerEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail.trim())) {
        errs.customerEmail = "Please enter a valid email address.";
      }
    }

    if (!deliveryAddress.trim()) {
      errs.deliveryAddress = "Delivery address is required.";
    } else if (deliveryAddress.trim().length < 8) {
      errs.deliveryAddress = "Please enter a complete address (minimum 8 characters).";
    }

    if (pincode.trim()) {
      const pincodeDigits = pincode.replace(/\D/g, "");
      if (pincodeDigits.length < 4 || pincodeDigits.length > 8) {
        errs.pincode = "Please enter a valid postal code.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateCartFields();
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart?id=${itemId}`, { method: "DELETE" });
      if (res.ok) {
        setCartItems((prev) => prev.filter((it) => it.id !== itemId));
        if (onCartChange) onCartChange();
      }
    } catch (err) {
      console.error("Remove cart item error:", err);
    }
  };

  const handlePlaceCartOrder = async () => {
    if (!session) {
      setErrorMsg("Please log in to place your order.");
      return;
    }

    setTouched({
      customerName: true,
      customerPhone: true,
      deliveryAddress: true,
      customerEmail: true,
      pincode: true,
    });

    const isValid = validateCartFields();
    if (!isValid) {
      setErrorMsg("Please fill in all required shipping details accurately.");
      return;
    }

    const itemsToOrder = selectedItemForCheckout ? [selectedItemForCheckout] : cartItems;

    if (itemsToOrder.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    setOrdering(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const itemsPayload = itemsToOrder.map((it) => ({
        itemType: it.itemType || "CANVA_CARD",
        templateId: it.templateId,
        templateName: it.templateName,
        previewImage: it.previewImage,
        copies: it.copies,
        cardDetails: it.cardDetailsJson,
        elements: it.elementsJson,
        customNotes: it.customNotes,
        price: it.price,
      }));

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim() || session.user?.email,
          customerPhone: customerPhone.trim(),
          deliveryAddress: deliveryAddress.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          notes: orderNotes.trim(),
          items: itemsPayload,
          isCartCheckout: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      setSuccessMsg(`🎉 Order #${data.orderNumber} placed successfully! An email notification has been dispatched.`);

      if (selectedItemForCheckout) {
        try {
          await fetch(`/api/cart?id=${selectedItemForCheckout.id}`, { method: "DELETE" });
        } catch {
          // ignore
        }
        setCartItems((prev) => prev.filter((it) => it.id !== selectedItemForCheckout.id));
        setSelectedItemForCheckout(null);
      } else {
        setCartItems([]);
      }

      if (onCartChange) onCartChange();

      setTimeout(() => {
        onClose();
        setIsCheckingOut(false);
        setSelectedItemForCheckout(null);
        setSuccessMsg("");
      }, 2500);
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || "Failed to place order. Please try again.");
    } finally {
      setOrdering(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const totalCopiesCount = cartItems.reduce((acc, it) => acc + (it.copies || 1), 0);
  const totalCartPrice = cartItems.reduce((acc, it) => acc + (Number(it.price) || 0), 0);

  const activeCheckoutItems = selectedItemForCheckout ? [selectedItemForCheckout] : cartItems;
  const activeCheckoutCopies = activeCheckoutItems.reduce((acc, it) => acc + (it.copies || 1), 0);
  const activeCheckoutPrice = activeCheckoutItems.reduce((acc, it) => acc + (Number(it.price) || 0), 0);

  return createPortal(
    <div data-lenis-prevent className="fixed inset-0 z-[99999] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => {
          onClose();
          setIsCheckingOut(false);
          setSelectedItemForCheckout(null);
        }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* Slide-out Drawer Container */}
      <div data-lenis-prevent className="relative bg-white w-full max-w-md h-screen max-h-screen shadow-2xl flex flex-col z-10 border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#991B1B] text-white flex items-center justify-center shadow-xs">
              <ShoppingCart className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-slate-900">Your Invitation Cart</h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {cartItems.length} {cartItems.length === 1 ? "design" : "designs"} ({totalCopiesCount} total copies)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              setIsCheckingOut(false);
              setSelectedItemForCheckout(null);
            }}
            className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div data-lenis-prevent className="p-5 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
          
          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#991B1B]" />
              <p className="text-xs font-bold text-slate-600">Loading your cart...</p>
            </div>
          ) : cartItems.length === 0 && !successMsg ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Select any traditional invitation and click <strong>&ldquo;Add to Cart&rdquo;</strong> to collect print copies here.
              </p>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Step */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#991B1B] block">
                    {selectedItemForCheckout ? "Ordering Single Item:" : "Order Summary (All Items):"}
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {selectedItemForCheckout ? selectedItemForCheckout.templateName : `${cartItems.length} Designs`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900 block">
                    {activeCheckoutCopies} Copies
                  </span>
                  <span className="text-xs font-extrabold text-[#991B1B]">
                    ₹{activeCheckoutPrice} Total
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#991B1B]" />
                  <span>Shipping &amp; Contact Information</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between mb-1">
                      <span>Full Name *</span>
                      {touched.customerName && !errors.customerName && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={customerName}
                      onBlur={() => handleBlur("customerName")}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errors.customerName && e.target.value.trim().length >= 2) {
                          setErrors((prev) => ({ ...prev, customerName: undefined }));
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none transition-colors ${
                        errors.customerName && touched.customerName
                          ? "border-red-500 bg-red-50/20 focus:border-red-500"
                          : touched.customerName && !errors.customerName && customerName.trim()
                          ? "border-emerald-400 bg-emerald-50/10 focus:border-emerald-500"
                          : "border-slate-300 focus:border-[#991B1B]"
                      }`}
                    />
                    {errors.customerName && touched.customerName && (
                      <p className="text-[10.5px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.customerName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between mb-1">
                      <span>WhatsApp / Phone Number *</span>
                      {touched.customerPhone && !errors.customerPhone && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onBlur={() => handleBlur("customerPhone")}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        const digits = e.target.value.replace(/\D/g, "");
                        if (errors.customerPhone && digits.length >= 10 && digits.length <= 15) {
                          setErrors((prev) => ({ ...prev, customerPhone: undefined }));
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none transition-colors ${
                        errors.customerPhone && touched.customerPhone
                          ? "border-red-500 bg-red-50/20 focus:border-red-500"
                          : touched.customerPhone && !errors.customerPhone && customerPhone.trim()
                          ? "border-emerald-400 bg-emerald-50/10 focus:border-emerald-500"
                          : "border-slate-300 focus:border-[#991B1B]"
                      }`}
                    />
                    {errors.customerPhone && touched.customerPhone && (
                      <p className="text-[10.5px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.customerPhone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between mb-1">
                      <span>Email Address</span>
                      {touched.customerEmail && !errors.customerEmail && customerEmail.trim() && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={customerEmail}
                      onBlur={() => handleBlur("customerEmail")}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        if (errors.customerEmail && (!e.target.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value))) {
                          setErrors((prev) => ({ ...prev, customerEmail: undefined }));
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none transition-colors ${
                        errors.customerEmail && touched.customerEmail
                          ? "border-red-500 bg-red-50/20 focus:border-red-500"
                          : "border-slate-300 focus:border-[#991B1B]"
                      }`}
                    />
                    {errors.customerEmail && touched.customerEmail && (
                      <p className="text-[10.5px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.customerEmail}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between mb-1">
                      <span>Delivery Address *</span>
                      {touched.deliveryAddress && !errors.deliveryAddress && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Door No, Street Name, Landmark, City"
                      value={deliveryAddress}
                      onBlur={() => handleBlur("deliveryAddress")}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        if (errors.deliveryAddress && e.target.value.trim().length >= 8) {
                          setErrors((prev) => ({ ...prev, deliveryAddress: undefined }));
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none transition-colors ${
                        errors.deliveryAddress && touched.deliveryAddress
                          ? "border-red-500 bg-red-50/20 focus:border-red-500"
                          : touched.deliveryAddress && !errors.deliveryAddress && deliveryAddress.trim()
                          ? "border-emerald-400 bg-emerald-50/10 focus:border-emerald-500"
                          : "border-slate-300 focus:border-[#991B1B]"
                      }`}
                    />
                    {errors.deliveryAddress && touched.deliveryAddress && (
                      <p className="text-[10.5px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.deliveryAddress}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-[#991B1B]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Pincode</label>
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={pincode}
                        onBlur={() => handleBlur("pincode")}
                        onChange={(e) => {
                          setPincode(e.target.value);
                          if (errors.pincode && (!e.target.value || e.target.value.replace(/\D/g, "").length >= 4)) {
                            setErrors((prev) => ({ ...prev, pincode: undefined }));
                          }
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none transition-colors ${
                          errors.pincode && touched.pincode
                            ? "border-red-500 bg-red-50/20 focus:border-red-500"
                            : "border-slate-300 focus:border-[#991B1B]"
                        }`}
                      />
                      {errors.pincode && touched.pincode && (
                        <p className="text-[10.5px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.pincode}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Additional Order Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Any overall packaging or dispatch instructions..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-[#991B1B]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Items List */
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-xs hover:border-[#991B1B]/40 transition-colors"
                >
                  <div className="flex gap-3 items-start">
                    {(() => {
                      const itemImageSrc = item.previewImage && item.previewImage.trim().length > 5
                        ? item.previewImage
                        : getCardFallbackPreview(item.templateId, item.templateName);
                      return (
                        <div className="w-18 h-24 shrink-0 rounded-xl overflow-hidden shadow-xs border border-slate-200 bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={itemImageSrc} alt="Card Preview" className="w-full h-full object-contain" />
                        </div>
                      );
                    })()}

                    <div className="flex-1 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-slate-900 text-sm">{item.templateName}</h4>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-red-50 text-[#991B1B] text-[10px] font-extrabold border border-red-100">
                          {item.copies} Copies
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">
                          ₹{item.price || item.copies * 20} Total
                        </span>
                      </div>

                      {item.customNotes && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 italic pt-0.5">
                          &ldquo;{item.customNotes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Direct Place Order for this specific card */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItemForCheckout(item);
                      setIsCheckingOut(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Place Order for this Card (₹{item.price || item.copies * 20})</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

        </div>

        {/* Drawer Footer Actions */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0 space-y-2">
            {isCheckingOut ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCheckingOut(false);
                    setSelectedItemForCheckout(null);
                  }}
                  disabled={ordering}
                  className="flex-1 py-3 rounded-2xl bg-white border border-slate-300 text-slate-700 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Back to Cart
                </button>
                <button
                  type="button"
                  onClick={handlePlaceCartOrder}
                  disabled={ordering}
                  className="flex-2 py-3 rounded-2xl bg-[#991B1B] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#7F1D1D] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {ordering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Confirm &amp; Order (₹{activeCheckoutPrice})</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelectedItemForCheckout(null);
                  setIsCheckingOut(true);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Proceed to Order All ({totalCopiesCount} Copies &bull; ₹{totalCartPrice})</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
