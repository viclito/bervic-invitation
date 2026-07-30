"use client";

import { useEffect, useState, ReactNode } from "react";
import { Lock, ShieldAlert } from "lucide-react";

interface ScreenshotProtectionWrapperProps {
  children: ReactNode;
  enableWatermark?: boolean;
}

export default function ScreenshotProtectionWrapper({
  children,
  enableWatermark = true,
}: ScreenshotProtectionWrapperProps) {
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    // 1. Prevent Keyboard Screenshot Hotkeys, Snipping Tool, Print & DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      // Windows Key (Meta) or PrintScreen
      if (
        e.key === "PrintScreen" ||
        e.code === "PrintScreen" ||
        e.key === "Meta" ||
        e.key === "OS" ||
        e.code === "MetaLeft" ||
        e.code === "MetaRight"
      ) {
        setIsBlurred(true);
        setShowSecurityAlert(true);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("Content Protected by Bervic Invitations.");
        }
        setTimeout(() => setShowSecurityAlert(false), 3500);
      }

      // Windows Snipping Tool: Win + Shift + S or Meta + Shift + S or Ctrl + Shift + S
      if (
        ((e.metaKey || (e as any).winKey || e.ctrlKey) && e.shiftKey && (e.key.toLowerCase() === "s" || e.code === "KeyS")) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s")
      ) {
        e.preventDefault();
        setIsBlurred(true);
        setShowSecurityAlert(true);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("Content Protected by Bervic Invitations.");
        }
        setTimeout(() => setShowSecurityAlert(false), 3500);
        return false;
      }

      // Ctrl + P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setShowSecurityAlert(true);
        setTimeout(() => setShowSecurityAlert(false), 3500);
        return false;
      }

      // Ctrl + U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
        return false;
      }

      // F12 or DevTools
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        e.code === "PrintScreen" ||
        e.key === "Meta" ||
        e.key === "OS"
      ) {
        setIsBlurred(true);
        setShowSecurityAlert(true);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("Content Protected by Bervic Invitations.");
        }
        setTimeout(() => setShowSecurityAlert(false), 3500);
      }
    };

    // 2. Detect Window Blur / Mouse Leave / Snipping Tool Focus Loss
    const handleBlur = () => {
      setIsBlurred(true);
    };

    const handleFocus = () => {
      setIsBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    const handleMouseLeave = () => {
      setIsBlurred(true);
    };

    const handleMouseEnter = () => {
      setIsBlurred(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div
      className="relative select-none"
      style={{
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Dynamic CSS Print Disabling & Image Protection */}
      <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
        img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          pointer-events: auto;
        }
      `}</style>

      {/* Main Page Content with Unfocus Blur Effect */}
      <div
        className={`transition-all duration-200 ${
          isBlurred ? "blur-2xl grayscale opacity-20 pointer-events-none" : ""
        }`}
      >
        {children}
      </div>

      {/* Anti-Piracy Watermark Overlay (Protects against external cameras & Snipping Tool) */}
      {enableWatermark && (
        <div
          className="fixed inset-0 z-[9998] pointer-events-none opacity-20 overflow-hidden flex flex-wrap gap-12 p-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'%3E%3Ctext x='20' y='80' fill='%237A1F2B' font-size='12' font-family='sans-serif' font-weight='bold' transform='rotate(-25 150 75)' opacity='0.4'%3EBERVIC PROTECTED PREVIEW • DO NOT COPY%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      )}

      {/* Unfocus Privacy Overlay */}
      {isBlurred && (
        <div className="fixed inset-0 z-[99990] bg-black/85 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center text-[#F8F3EA]">
          <div className="w-16 h-16 rounded-3xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center mb-4 border-2 border-[#D9A441]/40 shadow-2xl animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#F8F3EA]">Protected Content Window</h2>
          <p className="text-xs text-[#F8F3EA]/70 mt-2 max-w-sm leading-relaxed">
            Content hidden while window is unfocused or screen capture tool is active. Move mouse inside window to resume.
          </p>
        </div>
      )}

      {/* Screenshot Prevention Security Overlay Alert */}
      {showSecurityAlert && (
        <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in text-[#F8F3EA]">
          <div className="w-16 h-16 rounded-3xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center mb-4 border-2 border-[#D9A441]/40 shadow-2xl animate-bounce">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#F8F3EA]">Screen Capture & Copying Restricted</h2>
          <p className="text-sm text-[#F8F3EA]/70 mt-2 max-w-md leading-relaxed">
            This wedding invitation design is copyright protected. Screenshots and screen recordings are restricted for privacy.
          </p>
          <div className="mt-6 px-4 py-2 rounded-full bg-[#D9A441]/20 text-[#D9A441] border border-[#D9A441]/30 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#D9A441]" />
            <span>Bervic Content Protection</span>
          </div>
        </div>
      )}
    </div>
  );
}
