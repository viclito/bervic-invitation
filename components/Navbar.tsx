"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  LogIn,
  LayoutGrid,
  CreditCard,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  ShoppingCart,
  ShoppingBag,
  Package,
  Palette,
  Smartphone,
} from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";

const emptySubscribe = () => () => {};

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const fetchCartCount = useCallback(async () => {
    if (status !== "authenticated") {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (res.ok && Array.isArray(data.items)) {
        setCartCount(data.items.length);
      }
    } catch {
      // ignore
    }
  }, [status]);

  useEffect(() => {
    fetchCartCount();
    const handleCartEvent = () => {
      fetchCartCount();
    };
    window.addEventListener("cartUpdated", handleCartEvent);
    return () => {
      window.removeEventListener("cartUpdated", handleCartEvent);
    };
  }, [fetchCartCount]);

  // Handle outside click for dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [profileDropdownOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }

  const isLightNav = true;

  const navLinkClass = `transition-colors font-semibold text-slate-700 hover:text-[#991B1B]`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLightNav
          ? "bg-white/95 backdrop-blur-md py-3 shadow-xs border-b border-slate-200"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-sm border border-slate-200 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/logo.svg"
              alt="Bervic Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-1 transition-colors text-slate-900">
            Bervic
            <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B] inline-block"></span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-sm font-semibold">
          <Link
            href="/templates"
            className={`${navLinkClass} ${pathname === "/templates" ? "text-[#991B1B]" : ""}`}
          >
            Digital Invitations
          </Link>

          <Link
            href="/canva"
            target="_blank"
            rel="noopener noreferrer"
            className={`${navLinkClass} ${pathname === "/canva" ? "text-[#991B1B]" : ""}`}
          >
            Digital Studio
          </Link>

          <Link
            href="/cards"
            className={`${navLinkClass} ${pathname === "/cards" ? "text-[#991B1B]" : ""}`}
          >
            Cards
          </Link>

          <Link
            href="/pricing"
            className={`${navLinkClass} ${pathname === "/pricing" ? "text-[#991B1B]" : ""}`}
          >
            Pricing
          </Link>
        </nav>

        {/* Desktop CTA Action Buttons */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3">
          {/* Shop Now (Traditional Invitations Print Store) CTA */}
          <Link
            href="/shop"
            className="px-3.5 xl:px-4 py-2 rounded-full bg-[#991B1B] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:bg-[#7F1D1D] hover:scale-[1.03] transition-all shrink-0"
            title="Shop Traditional Printed Invitations"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>Shop Now</span>
          </Link>

          {/* Global Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-full bg-slate-100 hover:bg-[#991B1B] text-slate-700 hover:text-white transition-all border border-slate-200 flex items-center justify-center cursor-pointer shadow-xs group shrink-0"
            title="View Invitation Cart"
          >
            <ShoppingCart className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#991B1B] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* Unified Profile Dropdown or Login Actions */}
          {status === "authenticated" ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-xs border ${
                  profileDropdownOpen
                    ? "bg-[#991B1B] text-white border-[#991B1B]"
                    : "bg-red-50 border border-red-200 text-[#991B1B] hover:bg-[#991B1B] hover:text-white"
                }`}
                aria-label="User Account Menu"
              >
                <div className="w-6 h-6 rounded-full bg-[#991B1B] text-white flex items-center justify-center font-extrabold text-[11px] shrink-0">
                  {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="max-w-[90px] xl:max-w-[120px] truncate">{session.user?.name || "Account"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150 flex flex-col space-y-1">
                  {/* User Profile Summary */}
                  <div className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-extrabold text-slate-900 truncate">{session.user?.name || "User"}</p>
                    <p className="text-[11px] text-slate-500 truncate">{session.user?.email}</p>
                  </div>

                  {/* Links */}
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-[#991B1B] hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-amber-500" />
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    href="/dashboard/orders"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-[#991B1B] hover:text-white transition-colors"
                  >
                    <Package className="w-4 h-4 text-amber-500" />
                    <span>My Print Orders</span>
                  </Link>

                  <Link
                    href="/dashboard?tab=invitations"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-[#991B1B] hover:text-white transition-colors"
                  >
                    <LayoutGrid className="w-4 h-4 text-amber-500" />
                    <span>Saved Invitations</span>
                  </Link>

                  <Link
                    href="/dashboard?tab=subscription"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-[#991B1B] hover:text-white transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-amber-500" />
                    <span>Quota &amp; Subscription</span>
                  </Link>

                  {/* Admin Direct Panel Link for Admin Account */}
                  {session.user?.email?.toLowerCase() === "berglin1998@gmail.com" && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-extrabold text-[#991B1B] bg-red-50 hover:bg-[#991B1B] hover:text-white transition-colors border border-red-200"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Control Panel</span>
                    </Link>
                  )}

                  <hr className="border-slate-100 my-1" />

                  {/* Sign Out Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs border border-red-300 text-[#991B1B] hover:bg-[#991B1B] hover:text-white"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-500" />
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile & Tablet Header Controls: Shop Now, Cart, & Hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Quick Mobile Shop Now Pill */}
          <Link
            href="/shop"
            className="px-3 py-1.5 rounded-full bg-[#991B1B] text-white text-xs font-extrabold flex items-center gap-1 shadow-xs"
          >
            <ShoppingBag className="w-3 h-3 text-amber-300" />
            <span>Shop</span>
          </Link>

          {/* Mobile Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center cursor-pointer shadow-xs"
            title="Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#991B1B] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMobileMenuOpen((prev) => !prev);
            }}
            className={`p-2 rounded-full focus:outline-none transition-all cursor-pointer z-50 flex items-center justify-center min-w-[40px] min-h-[40px] ${
              mobileMenuOpen
                ? "bg-[#991B1B] text-white shadow-lg"
                : "text-slate-800 hover:bg-slate-100"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Modern Glassmorphic Mobile Slide-Down Popup Screen */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="lg:hidden fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-md flex flex-col justify-start animate-in fade-in duration-200">
          <div className="bg-white border-b-4 border-[#991B1B] rounded-b-[2.5rem] shadow-2xl p-5 sm:p-6 overflow-y-auto max-h-[92vh] animate-in slide-in-from-top-6 duration-300 flex flex-col space-y-5">
            
            {/* Top Bar inside Popup */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl overflow-hidden bg-white p-0.5 shadow-xs border border-slate-200">
                  <Image src="/images/logo.svg" alt="Bervic Logo" width={80} height={80} className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-bold text-slate-900">Bervic</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-red-50 hover:text-[#991B1B] transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Featured Traditional Invitations Shop Card */}
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-4 rounded-2xl bg-gradient-to-r from-[#991B1B] via-[#B91C1C] to-[#7F1D1D] text-white border border-red-400 shadow-md flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/40 text-white flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">Physical Prints</span>
                    <span className="text-[9px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full">Shop Now</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight">Traditional Cards Shop</h4>
                  <p className="text-[11px] text-white/80">Browse designs &amp; place print orders</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Profile / Greeting Card */}
            {status === "authenticated" && (
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#991B1B] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {session.user?.name || "Welcome Back"}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-50 text-[#991B1B] border border-red-200 px-2 py-0.5 rounded-full shadow-xs">
                  Active
                </span>
              </div>
            )}

            {/* Menu Links with Icons */}
            <nav className="flex flex-col space-y-1">
              <Link
                href="/templates"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#991B1B] flex items-center justify-center group-hover:bg-[#991B1B] group-hover:text-white transition-colors">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Digital Invitations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-[#991B1B] bg-red-50 px-2 py-0.5 rounded-full uppercase">
                    Web
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#991B1B]" />
                </div>
              </Link>

              {/* Digital Studio */}
              <Link
                href="/canva"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#991B1B] flex items-center justify-center group-hover:bg-[#991B1B] group-hover:text-white transition-colors">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Digital Studio</span>
                    <span className="text-[10px] text-slate-500 block">Interactive card customizer</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-[#991B1B] bg-red-50 px-2 py-0.5 rounded-full uppercase">
                    Studio
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#991B1B]" />
                </div>
              </Link>

              {/* Cards (Instagram Cards) */}
              <Link
                href="/cards"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#991B1B] flex items-center justify-center group-hover:bg-[#991B1B] group-hover:text-white transition-colors">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Cards</span>
                    <span className="text-[10px] text-slate-500 block">Social announcement cards</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-[#991B1B] bg-red-50 px-2 py-0.5 rounded-full uppercase border border-red-200">
                    1080px
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#991B1B]" />
                </div>
              </Link>

              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#991B1B] flex items-center justify-center group-hover:bg-[#991B1B] group-hover:text-white transition-colors">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Pricing Plans</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#991B1B]" />
              </Link>

              {status === "authenticated" && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#991B1B] flex items-center justify-center group-hover:bg-[#991B1B] group-hover:text-white transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">My Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#991B1B]" />
                  </Link>

                  <Link
                    href="/dashboard/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#991B1B] flex items-center justify-center group-hover:bg-[#991B1B] group-hover:text-white transition-colors">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">My Print Orders</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#991B1B]" />
                  </Link>
                </>
              )}
            </nav>

            {/* Bottom Action Area */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {status === "authenticated" ? (
                <>
                  {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-xl bg-[#991B1B] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>Admin Authority Panel</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold text-[#991B1B] hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/templates"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-maroon w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Explore Digital Invitations</span>
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl border-2 border-red-200 text-[#991B1B] bg-red-50 hover:bg-[#991B1B] hover:text-white text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <LogIn className="w-4 h-4 text-amber-500" />
                    <span>Login to Account</span>
                  </Link>
                </>
              )}
            </div>

            {/* Footer Tagline */}
            <div className="text-center pt-1">
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Bervic Invitations • Crafted with ❤️
              </span>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Global Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCartChange={fetchCartCount}
      />
    </header>
  );
}
