"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { trackLead } from "@/lib/pixel";

const WHATSAPP_NUMBER = "919042127115";
const DEFAULT_MESSAGE = "Hi Bervic, I have an enquiry regarding digital wedding invitations & cards.";

export default function WhatsAppEnquiryButton() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Automatically fade out the floating hint bubble after 8 seconds
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Don't obscure full-screen builder canvases if on canvas studio editor
  const isBuilder = pathname?.includes("/admin/canva-templates/builder");
  if (isBuilder) return null;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <aside aria-label="Customer support" className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 print:hidden select-none">
      {/* Compact Floating Prompt Pill / Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-slate-800 px-3 py-1.5 rounded-full shadow-lg border border-emerald-200/60 text-[11px] font-semibold animate-in fade-in slide-in-from-right-3 duration-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#25D366]"></span>
          </span>
          <span>WhatsApp Us</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-600 ml-0.5 text-xs leading-none"
            aria-label="Close tooltip"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Compact Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackLead("WhatsApp Floating Button")}
        aria-label="Chat with Bervic on WhatsApp (9042127115)"
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
      >
        {/* Subtle Pulse */}
        <span className="absolute -inset-0.5 rounded-full bg-[#25D366] opacity-25 animate-ping pointer-events-none group-hover:opacity-40" />

        {/* Clean Official WhatsApp Logo Icon */}
        <svg
          className="w-6 h-6 drop-shadow-xs transition-transform duration-200 group-hover:scale-110"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 2C8.268 2 2 8.268 2 16c0 2.68.75 5.21 2.12 7.39L2.34 29.2c-.14.47.29.9.76.76l6.02-1.74A13.91 13.91 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm-1.07 6.67c-.28 0-.61.03-.89.34-.3.33-1.15 1.12-1.15 2.73s1.18 3.16 1.34 3.38c.17.22 2.27 3.65 5.61 4.96 2.78 1.09 3.34.87 3.94.81.6-.06 1.94-.79 2.21-1.56.28-.76.28-1.42.2-1.56-.09-.14-.3-.22-.63-.39-.33-.17-1.94-.96-2.24-1.07-.3-.11-.53-.17-.75.17-.22.33-.86 1.07-1.05 1.29-.2.22-.39.25-.72.08-.33-.17-1.4-.52-2.67-1.65-.98-.88-1.65-1.96-1.84-2.29-.2-.33-.02-.51.15-.67.15-.15.33-.39.5-.58.17-.2.22-.33.33-.55.11-.22.06-.42-.03-.58-.08-.17-.75-1.81-1.03-2.48-.27-.65-.55-.56-.75-.57l-.64-.01z"
            fill="currentColor"
          />
        </svg>

        {/* Screen Reader Label */}
        <span className="sr-only">WhatsApp Enquiry (9042127115)</span>
      </a>
    </aside>
  );
}
