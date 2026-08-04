"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  LogIn,
  LayoutGrid,
  Zap,
  CreditCard,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isHomePage = pathname === "/";
  const isLightNav = scrolled || !isHomePage;

  const navLinkClass = `transition-colors font-semibold ${
    isLightNav
      ? "text-[#221C17] hover:text-[#7A1F2B]"
      : "text-[#F8F3EA] hover:text-[#D9A441] drop-shadow-sm"
  }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLightNav
          ? "header-glass py-3.5 shadow-md border-b border-[#D9A441]/30"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-md border border-[#D9A441]/40 group-hover:scale-105 transition-transform duration-300">
            <img
              src="/logo.png"
              alt="Bervic Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className={`text-2xl font-bold tracking-tight flex items-center gap-1 transition-colors ${
              isLightNav ? "text-[#221C17]" : "text-[#F8F3EA] drop-shadow-sm"
            }`}
          >
            Bervic
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] inline-block"></span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link href="/templates" className={navLinkClass}>
            Templates
          </Link>
          <Link href="/#how-it-works" className={navLinkClass}>
            How it Works
          </Link>
          <Link href="/#pricing" className={navLinkClass}>
            Pricing
          </Link>
          <Link href="/#faq" className={navLinkClass}>
            FAQ
          </Link>

          {status === "authenticated" && (
            <Link href="/dashboard" className={navLinkClass}>
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop CTA Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" && (
                <Link
                  href="/admin"
                  className="px-3.5 py-1.5 rounded-full bg-[#7A1F2B] text-[#D9A441] text-xs font-extrabold flex items-center gap-1.5 shadow-md border border-[#D9A441]/40 hover:scale-105 transition-all"
                  title="Admin Authority Panel"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                  isLightNav
                    ? "bg-[#7A1F2B]/10 border border-[#7A1F2B]/30 text-[#7A1F2B] hover:bg-[#7A1F2B] hover:text-[#F8F3EA]"
                    : "bg-[#F8F3EA]/20 border border-[#D9A441]/40 text-[#F8F3EA] hover:border-[#D9A441]"
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>{session.user?.name || "Account"}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className={`p-2 rounded-full transition-colors ${
                  isLightNav ? "text-[#7A1F2B] hover:text-[#221C17]" : "text-[#F8F3EA] hover:text-[#7A1F2B]"
                }`}
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border ${
                  isLightNav
                    ? "border-[#7A1F2B]/40 text-[#7A1F2B] hover:bg-[#7A1F2B] hover:text-[#F8F3EA]"
                    : "border-[#D9A441]/60 text-[#F8F3EA] hover:bg-[#D9A441] hover:text-[#221C17]"
                }`}
              >
                <LogIn className="w-4 h-4 text-[#D9A441]" />
                <span>Login</span>
              </Link>
              <Link
                href="/templates"
                className="btn-maroon px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
                <span>Get Started Free</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Action Controls & Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {/* Quick Direct Mobile Login / Dashboard Button */}
          {status === "authenticated" ? (
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-sm shrink-0 ${
                isLightNav
                  ? "bg-[#7A1F2B]/10 border border-[#7A1F2B]/30 text-[#7A1F2B]"
                  : "bg-[#F8F3EA]/20 border border-[#D9A441]/40 text-[#F8F3EA]"
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-sm shrink-0 border ${
                isLightNav
                  ? "border-[#7A1F2B]/40 text-[#7A1F2B] bg-[#7A1F2B]/5"
                  : "border-[#D9A441]/60 text-[#F8F3EA] bg-[#F8F3EA]/10"
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-full focus:outline-none transition-all ${
              mobileMenuOpen
                ? "bg-[#7A1F2B] text-[#D9A441] shadow-lg"
                : isLightNav
                ? "text-[#221C17] hover:bg-[#7A1F2B]/10"
                : "text-[#F8F3EA] hover:bg-[#F8F3EA]/10"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Modern, Glassmorphic Mobile Slide-Down Popup Screen */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-0 z-50 bg-[#221C17]/60 backdrop-blur-md flex flex-col justify-start animate-in fade-in duration-200">
          <div className="bg-[#F8F3EA] border-b-4 border-[#D9A441] rounded-b-[2.5rem] shadow-2xl p-6 overflow-y-auto max-h-[92vh] animate-in slide-in-from-top-6 duration-300 flex flex-col space-y-6">
            
            {/* Top Bar inside Popup */}
            <div className="flex items-center justify-between border-b border-[#D9A441]/20 pb-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-white p-0.5 shadow-sm border border-[#D9A441]/40">
                  <img src="/logo.png" alt="Bervic Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-bold text-[#221C17]">Bervic</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center hover:bg-[#7A1F2B] hover:text-[#F8F3EA] transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile / Greeting Card */}
            {status === "authenticated" ? (
              <div className="bg-gradient-to-r from-[#7A1F2B] to-[#4A141C] text-[#F8F3EA] p-4 rounded-2xl border border-[#D9A441]/40 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#D9A441]/20 border border-[#D9A441] text-[#D9A441] flex items-center justify-center font-bold text-lg">
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F8F3EA] leading-tight">
                      {session.user?.name || "Welcome Back"}
                    </h4>
                    <p className="text-[11px] text-[#F8F3EA]/70 truncate max-w-[180px]">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#D9A441] text-[#221C17] px-2.5 py-1 rounded-full shadow-sm">
                  Active
                </span>
              </div>
            ) : (
              <div className="bg-[#EFE7D8] border border-[#D9A441]/40 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#D9A441]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#7A1F2B] uppercase tracking-wider">
                    Craft Digital Invitations
                  </h4>
                  <p className="text-[11px] text-[#221C17]/70 font-medium">
                    Customize &amp; share interactive invitations in seconds
                  </p>
                </div>
              </div>
            )}

            {/* Menu Links with Icons */}
            <nav className="flex flex-col space-y-1">
              <Link
                href="/templates"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EFE7D8] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center group-hover:bg-[#7A1F2B] group-hover:text-[#F8F3EA] transition-colors">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-[#221C17]">Templates Collection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-[#7A1F2B] bg-[#7A1F2B]/10 px-2 py-0.5 rounded-full uppercase">
                    New
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#221C17]/40 group-hover:text-[#7A1F2B]" />
                </div>
              </Link>

              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EFE7D8] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center group-hover:bg-[#7A1F2B] group-hover:text-[#F8F3EA] transition-colors">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-[#221C17]">How It Works</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#221C17]/40 group-hover:text-[#7A1F2B]" />
              </Link>

              <Link
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EFE7D8] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center group-hover:bg-[#7A1F2B] group-hover:text-[#F8F3EA] transition-colors">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-[#221C17]">Pricing Plans</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#221C17]/40 group-hover:text-[#7A1F2B]" />
              </Link>

              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EFE7D8] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center group-hover:bg-[#7A1F2B] group-hover:text-[#F8F3EA] transition-colors">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-[#221C17]">FAQ &amp; Support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#221C17]/40 group-hover:text-[#7A1F2B]" />
              </Link>

              {status === "authenticated" && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#EFE7D8] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center group-hover:bg-[#7A1F2B] group-hover:text-[#F8F3EA] transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-[#221C17]">My Dashboard</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#221C17]/40 group-hover:text-[#7A1F2B]" />
                </Link>
              )}
            </nav>

            {/* Bottom Action Area */}
            <div className="pt-2 border-t border-[#D9A441]/20 space-y-2">
              {status === "authenticated" ? (
                <>
                  {session?.user?.email?.toLowerCase() === "berglin1998@gmail.com" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-xl bg-[#7A1F2B] text-[#D9A441] text-xs font-extrabold flex items-center justify-center gap-2 shadow-md border border-[#D9A441]/40"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Authority Panel</span>
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-maroon w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                  >
                    <User className="w-4 h-4 text-[#D9A441]" />
                    <span>Go to My Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold text-[#7A1F2B] hover:bg-[#7A1F2B]/10 rounded-xl transition-colors flex items-center justify-center gap-1.5"
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
                    className="btn-maroon w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-[#D9A441]" />
                    <span>Get Started Free</span>
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl border-2 border-[#7A1F2B]/30 text-[#7A1F2B] bg-[#7A1F2B]/5 hover:bg-[#7A1F2B] hover:text-[#F8F3EA] text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <LogIn className="w-4 h-4 text-[#D9A441]" />
                    <span>Login to Account</span>
                  </Link>
                </>
              )}
            </div>

            {/* Footer Tagline */}
            <div className="text-center pt-2">
              <span className="text-[10px] text-[#221C17]/50 font-semibold tracking-wider uppercase">
                Bervic Invitations • Crafted with ❤️
              </span>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
