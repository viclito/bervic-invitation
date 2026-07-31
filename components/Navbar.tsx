"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Sparkles, User, LogOut } from "lucide-react";

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
          <div className="w-10 h-10 rounded-full bg-[#7A1F2B] flex items-center justify-center text-[#D9A441] shadow-md group-hover:scale-105 transition-transform duration-300">
            {/* Diya / Mandala SVG Icon */}
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C11.5 5 9.5 7.5 7 9C9.5 10.5 11.5 13 12 16C12.5 13 14.5 10.5 17 9C14.5 7.5 12.5 5 12 2Z" />
              <path d="M12 15C8.5 15 5.5 17.5 4 21C6.5 21.5 9.5 22 12 22C14.5 22 17.5 21.5 20 21C18.5 17.5 15.5 15 12 15Z" />
            </svg>
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

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
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
            <Link
              href="/templates"
              className="btn-maroon px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#D9A441]" />
              <span>Get Started Free</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg focus:outline-none transition-colors ${
            isLightNav ? "text-[#221C17]" : "text-[#F8F3EA]"
          }`}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-[#7A1F2B]" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-[#F8F3EA]/98 backdrop-blur-xl border-b border-[#D9A441]/20 p-6 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-4 text-base font-semibold text-[#221C17]">
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#D9A441]/10"
            >
              Templates
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#D9A441]/10"
            >
              How it Works
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#D9A441]/10"
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#D9A441]/10"
            >
              FAQ
            </Link>

            {status === "authenticated" ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-maroon py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 mt-2"
              >
                <User className="w-4 h-4 text-[#D9A441]" />
                <span>My Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/templates"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-maroon py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4 text-[#D9A441]" />
                <span>Get Started Free</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
