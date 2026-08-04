"use client";

import { useState } from "react";
import { Heart, Sparkles, Mail, Volume2, VolumeX } from "lucide-react";
import { templatesRegistry } from "@/data/templatesRegistry";

interface PersonalizedEnvelopeCoverProps {
  guestName?: string;
  partnerOne: string;
  partnerTwo: string;
  weddingTime: string;
  isCustomizer?: boolean;
  templateSlug?: string;
}

export default function PersonalizedEnvelopeCover({
  guestName,
  partnerOne,
  partnerTwo,
  weddingTime,
  isCustomizer = false,
  templateSlug = "classic-floral",
}: PersonalizedEnvelopeCoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // In the customizer/editor, skip the envelope entirely so designers can
  // see the actual invitation content without having to click through it.
  if (isCustomizer) return null;

  const activeGuestName = guestName ? decodeURIComponent(guestName) : "Honored Guest";

  const themeItem =
    templatesRegistry.find((t) => t.slug === templateSlug) ||
    templatesRegistry[0];


  // Tailored Envelope Styling tokens for each template design
  const getEnvelopeTheme = () => {
    switch (templateSlug) {
      case "veridian-garden":
        return {
          envelopeBg: "#061b0e",
          borderColor: "#735c00",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#ffe088",
          subTitleColor: "#819986",
          guestBannerBg: "#1b3022",
          guestBannerBorder: "#735c00",
          guestNameColor: "#ffffff",
          textColor: "#e4e2de",
          accentColor: "#735c00",
          sealGradient: "linear-gradient(135deg, #735c00, #ffe088)",
          sealTextColor: "#061b0e",
          badgeBg: "rgba(115, 92, 0, 0.25)",
          badgeBorder: "#735c00",
          badgeTextColor: "#ffe088",
        };
      case "art-deco-revival":
        return {
          envelopeBg: "#131410",
          borderColor: "#d4af37",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#f2ca50",
          subTitleColor: "#d4af37",
          guestBannerBg: "#1c1c18",
          guestBannerBorder: "#d4af37",
          guestNameColor: "#ffffff",
          textColor: "#e5e2db",
          accentColor: "#d4af37",
          sealGradient: "linear-gradient(135deg, #d4af37, #f2ca50)",
          sealTextColor: "#131410",
          badgeBg: "rgba(212, 175, 55, 0.2)",
          badgeBorder: "#d4af37",
          badgeTextColor: "#f2ca50",
        };
      case "midnight-noir":
        return {
          envelopeBg: "#081425",
          borderColor: "#c1c7cf",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#d8e3fb",
          subTitleColor: "#c1c7cf",
          guestBannerBg: "#040e1f",
          guestBannerBorder: "#c1c7cf",
          guestNameColor: "#ffffff",
          textColor: "#c6c6cb",
          accentColor: "#c1c7cf",
          sealGradient: "linear-gradient(135deg, #c1c7cf, #e2e8f0)",
          sealTextColor: "#081425",
          badgeBg: "rgba(193, 199, 207, 0.2)",
          badgeBorder: "#c1c7cf",
          badgeTextColor: "#d8e3fb",
        };
      case "seafoam-pearl":
        return {
          envelopeBg: "#faf9f6",
          borderColor: "#046c4a",
          borderWidth: "2px",
          hasDoubleBorder: false,
          titleColor: "#046c4a",
          subTitleColor: "#3f4943",
          guestBannerBg: "#ffffff",
          guestBannerBorder: "#93e9be",
          guestNameColor: "#046c4a",
          textColor: "#1a1c1a",
          accentColor: "#046c4a",
          sealGradient: "linear-gradient(135deg, #046c4a, #93e9be)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(147, 233, 190, 0.3)",
          badgeBorder: "#046c4a",
          badgeTextColor: "#046c4a",
        };
      case "champagne-luxe":
        return {
          envelopeBg: "#faf9f6",
          borderColor: "#735c00",
          borderWidth: "2px",
          hasDoubleBorder: false,
          titleColor: "#735c00",
          subTitleColor: "#685d4a",
          guestBannerBg: "#ffffff",
          guestBannerBorder: "#d4af37",
          guestNameColor: "#735c00",
          textColor: "#1a1c1a",
          accentColor: "#735c00",
          sealGradient: "linear-gradient(135deg, #735c00, #d4af37)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(212, 175, 55, 0.2)",
          badgeBorder: "#735c00",
          badgeTextColor: "#735c00",
        };
      case "olive-ochre":
        return {
          envelopeBg: "#fcf9f8",
          borderColor: "#5f5f00",
          borderWidth: "2px",
          hasDoubleBorder: false,
          titleColor: "#5f5f00",
          subTitleColor: "#904d00",
          guestBannerBg: "#ffffff",
          guestBannerBorder: "#5f5f00",
          guestNameColor: "#1b1c1c",
          textColor: "#484837",
          accentColor: "#5f5f00",
          sealGradient: "linear-gradient(135deg, #5f5f00, #904d00)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(95, 95, 0, 0.2)",
          badgeBorder: "#5f5f00",
          badgeTextColor: "#5f5f00",
        };
      case "modern-minimalist":
        return {
          envelopeBg: "#fbf9f4",
          borderColor: "#31105C",
          borderWidth: "2px",
          hasDoubleBorder: false,
          titleColor: "#31105C",
          subTitleColor: "#D4AF37",
          guestBannerBg: "#ffffff",
          guestBannerBorder: "#D4AF37",
          guestNameColor: "#31105C",
          textColor: "#1b1c19",
          accentColor: "#31105C",
          sealGradient: "linear-gradient(135deg, #31105C, #D4AF37)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(49, 16, 92, 0.15)",
          badgeBorder: "#31105C",
          badgeTextColor: "#31105C",
        };
      case "lime-silver":
        return {
          envelopeBg: "#0A0A0A",
          borderColor: "#32CD32",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#32CD32",
          subTitleColor: "#c6c6c6",
          guestBannerBg: "#1a1c1c",
          guestBannerBorder: "#32CD32",
          guestNameColor: "#ffffff",
          textColor: "#e2e2e2",
          accentColor: "#32CD32",
          sealGradient: "linear-gradient(135deg, #32CD32, #75ff68)",
          sealTextColor: "#0A0A0A",
          badgeBg: "rgba(50, 205, 50, 0.2)",
          badgeBorder: "#32CD32",
          badgeTextColor: "#32CD32",
        };
      case "jade-ink":
        return {
          envelopeBg: "#191c1d",
          borderColor: "#006d43",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#78fbb6",
          subTitleColor: "#bccabe",
          guestBannerBg: "#2e3132",
          guestBannerBorder: "#006d43",
          guestNameColor: "#ffffff",
          textColor: "#f8f9fa",
          accentColor: "#006d43",
          sealGradient: "linear-gradient(135deg, #006d43, #78fbb6)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(0, 109, 67, 0.25)",
          badgeBorder: "#006d43",
          badgeTextColor: "#78fbb6",
        };
      case "mint-slate":
        return {
          envelopeBg: "#191c1d",
          borderColor: "#246a52",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#aaf0d1",
          subTitleColor: "#bfc9c2",
          guestBannerBg: "#2e3131",
          guestBannerBorder: "#246a52",
          guestNameColor: "#ffffff",
          textColor: "#f8fafa",
          accentColor: "#246a52",
          sealGradient: "linear-gradient(135deg, #246a52, #aaf0d1)",
          sealTextColor: "#191c1d",
          badgeBg: "rgba(36, 106, 82, 0.25)",
          badgeBorder: "#246a52",
          badgeTextColor: "#aaf0d1",
        };
      case "grand-ballroom":
        return {
          envelopeBg: "#100926",
          borderColor: "#D4AF37",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#F4D068",
          subTitleColor: "#D4AF37",
          guestBannerBg: "#1f143a",
          guestBannerBorder: "#D4AF37",
          guestNameColor: "#ffffff",
          textColor: "#fbf9f4",
          accentColor: "#D4AF37",
          sealGradient: "linear-gradient(135deg, #31105C, #D4AF37)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(212, 175, 55, 0.2)",
          badgeBorder: "#D4AF37",
          badgeTextColor: "#F4D068",
        };
      case "whimsical-storybook":
        return {
          envelopeBg: "#1c142b",
          borderColor: "#D4AF37",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#E2CEFF",
          subTitleColor: "#D4AF37",
          guestBannerBg: "#291d3d",
          guestBannerBorder: "#D4AF37",
          guestNameColor: "#ffffff",
          textColor: "#fbf9f4",
          accentColor: "#D4AF37",
          sealGradient: "linear-gradient(135deg, #8B5CF6, #D4AF37)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(139, 92, 246, 0.25)",
          badgeBorder: "#D4AF37",
          badgeTextColor: "#E2CEFF",
        };
      case "photo-gallery":
        return {
          envelopeBg: "#1b1b1b",
          borderColor: "#8d99ae",
          borderWidth: "2px",
          hasDoubleBorder: false,
          titleColor: "#ffffff",
          subTitleColor: "#8d99ae",
          guestBannerBg: "#2b2d42",
          guestBannerBorder: "#8d99ae",
          guestNameColor: "#ffffff",
          textColor: "#fafafa",
          accentColor: "#8d99ae",
          sealGradient: "linear-gradient(135deg, #2b2d42, #8d99ae)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(141, 153, 174, 0.2)",
          badgeBorder: "#8d99ae",
          badgeTextColor: "#ffffff",
        };
      case "teal-copper":
        return {
          envelopeBg: "#131407",
          borderColor: "#ffb77b",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#76d6d5",
          subTitleColor: "#ffb77b",
          guestBannerBg: "#343625",
          guestBannerBorder: "#ffb77b",
          guestNameColor: "#ffffff",
          textColor: "#e4e4cc",
          accentColor: "#ffb77b",
          sealGradient: "linear-gradient(135deg, #76d6d5, #ffb77b)",
          sealTextColor: "#4d2700",
          badgeBg: "rgba(255, 183, 123, 0.2)",
          badgeBorder: "#ffb77b",
          badgeTextColor: "#ffb77b",
        };
      case "bohemian-sun":
        return {
          envelopeBg: "#fdf9f4",
          borderColor: "#91472a",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#91472a",
          subTitleColor: "#7f5214",
          guestBannerBg: "#ffffff",
          guestBannerBorder: "#91472a",
          guestNameColor: "#91472a",
          textColor: "#54433d",
          accentColor: "#91472a",
          sealGradient: "linear-gradient(135deg, #91472a, #ffb59b)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(145, 71, 42, 0.15)",
          badgeBorder: "#91472a",
          badgeTextColor: "#91472a",
        };
      case "emerald-gold":
        return {
          envelopeBg: "#043927",
          borderColor: "#735c00",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#ffe088",
          subTitleColor: "#a0d1b8",
          guestBannerBg: "#184b38",
          guestBannerBorder: "#735c00",
          guestNameColor: "#ffffff",
          textColor: "#fcf9f8",
          accentColor: "#735c00",
          sealGradient: "linear-gradient(135deg, #735c00, #ffe088)",
          sealTextColor: "#043927",
          badgeBg: "rgba(115, 92, 0, 0.25)",
          badgeBorder: "#735c00",
          badgeTextColor: "#ffe088",
        };
      case "moss-stone":
        return {
          envelopeBg: "#f9f9f7",
          borderColor: "#56642b",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#56642b",
          subTitleColor: "#76786b",
          guestBannerBg: "#eeeeec",
          guestBannerBorder: "#56642b",
          guestNameColor: "#1a1c1b",
          textColor: "#46483c",
          accentColor: "#56642b",
          sealGradient: "linear-gradient(135deg, #56642b, #8a9a5b)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(86, 100, 43, 0.15)",
          badgeBorder: "#56642b",
          badgeTextColor: "#56642b",
        };
      case "sage-sand":
        return {
          envelopeBg: "#fbf9f8",
          borderColor: "#526442",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#526442",
          subTitleColor: "#6c5b4e",
          guestBannerBg: "#efeded",
          guestBannerBorder: "#526442",
          guestNameColor: "#1b1c1c",
          textColor: "#44483f",
          accentColor: "#526442",
          sealGradient: "linear-gradient(135deg, #526442, #9caf88)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(82, 100, 66, 0.15)",
          badgeBorder: "#526442",
          badgeTextColor: "#526442",
        };
      case "forest-fern":
        return {
          envelopeBg: "#13140f",
          borderColor: "#b4cdb8",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#d0e9d4",
          subTitleColor: "#ffdcbd",
          guestBannerBg: "#1f201b",
          guestBannerBorder: "#b4cdb8",
          guestNameColor: "#ffffff",
          textColor: "#c3c8c1",
          accentColor: "#b4cdb8",
          sealGradient: "linear-gradient(135deg, #1b3022, #b4cdb8)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(180, 205, 184, 0.2)",
          badgeBorder: "#b4cdb8",
          badgeTextColor: "#b4cdb8",
        };
      case "celestial-night":
        return {
          envelopeBg: "#090a10",
          borderColor: "#d4af37",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#ffffff",
          subTitleColor: "#d4af37",
          guestBannerBg: "#121420",
          guestBannerBorder: "#d4af37",
          guestNameColor: "#ffffff",
          textColor: "#a3a8be",
          accentColor: "#d4af37",
          sealGradient: "linear-gradient(135deg, #d4af37, #f0bd8b)",
          sealTextColor: "#090a10",
          badgeBg: "rgba(212, 175, 55, 0.2)",
          badgeBorder: "#d4af37",
          badgeTextColor: "#d4af37",
        };
      case "royal-maharani":
        return {
          envelopeBg: "#1a0812",
          borderColor: "#e6c280",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#fff0f5",
          subTitleColor: "#e6c280",
          guestBannerBg: "#290d1d",
          guestBannerBorder: "#e6c280",
          guestNameColor: "#ffffff",
          textColor: "#d8b5c4",
          accentColor: "#e6c280",
          sealGradient: "linear-gradient(135deg, #e6c280, #fce8ef)",
          sealTextColor: "#1a0812",
          badgeBg: "rgba(230, 194, 128, 0.2)",
          badgeBorder: "#e6c280",
          badgeTextColor: "#e6c280",
        };
      case "sunset-terracotta":
        return {
          envelopeBg: "#1f0d07",
          borderColor: "#e07a5f",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#ffffff",
          subTitleColor: "#f4a261",
          guestBannerBg: "#31150c",
          guestBannerBorder: "#e07a5f",
          guestNameColor: "#ffffff",
          textColor: "#d8a899",
          accentColor: "#e07a5f",
          sealGradient: "linear-gradient(135deg, #e07a5f, #f4a261)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(224, 122, 95, 0.2)",
          badgeBorder: "#e07a5f",
          badgeTextColor: "#e07a5f",
        };
      default:
        // Classic Floral Fallback
        return {
          envelopeBg: "#FDF6F3",
          borderColor: "#D9A441",
          borderWidth: "2px",
          hasDoubleBorder: true,
          titleColor: "#B85C6B",
          subTitleColor: "#4A2E35",
          guestBannerBg: "#ffffff",
          guestBannerBorder: "#D9A441",
          guestNameColor: "#4A2E35",
          textColor: "#4A2E35",
          accentColor: "#B85C6B",
          sealGradient: "linear-gradient(135deg, #B85C6B, #D9A441)",
          sealTextColor: "#ffffff",
          badgeBg: "rgba(217, 164, 65, 0.2)",
          badgeBorder: "#D9A441",
          badgeTextColor: "#8B6519",
        };
    }
  };

  const envTheme = getEnvelopeTheme();

  // Synthesize a soft romantic chime using Web Audio API on opening
  const playRomanticChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const notes = [659.25, 830.61, 987.77, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.12;
        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.3);
      });
    } catch {
      // Audio fallback
    }
  };

  const handleOpenEnvelope = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    playRomanticChime();

    setTimeout(() => {
      setIsOpen(true);
    }, 1100);
  };

  if (isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => {
            setIsOpen(false);
            setIsOpening(false);
          }}
          style={{ backgroundColor: envTheme.accentColor, color: "#ffffff" }}
          className="px-4 py-2 rounded-full text-xs font-bold shadow-xl hover:opacity-90 transition-all flex items-center gap-1.5 border border-white/40"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Replay Cover</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-1000 ${
        isOpening ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{ perspective: "1000px" }}
    >
      {/* Decorative Background Halo */}
      <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-black/30 pointer-events-none" />

      {/* Sound Toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-md z-10 border border-white/30 shadow-lg"
      >
        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
      </button>

      {/* Main Theme Envelope Container */}
      <div
        className={`relative w-full max-w-lg rounded-3xl p-8 sm:p-12 shadow-2xl text-center transition-transform duration-1000 transform ${
          isOpening ? "rotate-x-90 scale-95 opacity-0" : "rotate-x-0 scale-100"
        }`}
        style={{
          backgroundColor: envTheme.envelopeBg,
          borderColor: envTheme.borderColor,
          borderWidth: envTheme.borderWidth,
          color: envTheme.textColor,
        }}
      >
        {/* Ornate Inner Double Border */}
        {envTheme.hasDoubleBorder && (
          <div
            className="absolute inset-3 rounded-2xl pointer-events-none"
            style={{ borderColor: envTheme.borderColor, borderWidth: "1px" }}
          />
        )}

        {/* Top Tagline Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm border"
          style={{
            backgroundColor: envTheme.badgeBg,
            borderColor: envTheme.badgeBorder,
            color: envTheme.badgeTextColor,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusively Invited • {themeItem.title}</span>
        </div>

        {/* Header Label */}
        <p className="text-xs sm:text-sm font-serif italic mb-2 tracking-wider" style={{ color: envTheme.subTitleColor }}>
          A Special Invitation For
        </p>

        {/* Personalized Guest Name Banner */}
        <div
          className="my-3 py-3.5 px-8 rounded-2xl border-2 shadow-md inline-block max-w-full"
          style={{
            backgroundColor: envTheme.guestBannerBg,
            borderColor: envTheme.guestBannerBorder,
          }}
        >
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide truncate" style={{ color: envTheme.guestNameColor }}>
            {activeGuestName}
          </h1>
        </div>

        {/* Celebrant / Couple & Invitation Details */}
        {(!partnerTwo || partnerTwo.trim() === "" || themeItem.category === "birthday") ? (
          <p className="text-xs sm:text-sm font-serif mt-4 max-w-xs mx-auto leading-relaxed" style={{ color: envTheme.subTitleColor }}>
            Warmly invites you to celebrate <br />
            <strong className="font-serif text-2xl block mt-1 font-bold" style={{ color: envTheme.titleColor }}>
              {partnerOne}'s Birthday
            </strong>
            at a special birthday celebration.
          </p>
        ) : (
          <p className="text-xs sm:text-sm font-serif mt-4 max-w-xs mx-auto leading-relaxed" style={{ color: envTheme.subTitleColor }}>
            Together with their families, <br />
            <strong className="font-serif text-2xl block mt-1 font-bold" style={{ color: envTheme.titleColor }}>
              {partnerOne} &amp; {partnerTwo}
            </strong>
            request the pleasure of your company at their wedding celebration.
          </p>
        )}

        <p className="text-[11px] font-semibold mt-3 font-mono tracking-wide" style={{ color: envTheme.subTitleColor }}>
          {weddingTime}
        </p>

        {/* Theme Wax Seal Unseal Button */}
        <div className="mt-8 relative flex flex-col items-center">
          <button
            onClick={handleOpenEnvelope}
            disabled={isOpening}
            className="group relative w-22 h-22 sm:w-24 sm:h-24 rounded-full p-1 shadow-2xl hover:scale-105 transition-transform duration-300 active:scale-95 flex items-center justify-center cursor-pointer"
            style={{
              background: envTheme.sealGradient,
            }}
          >
            {/* Outer Pulsing Aura */}
            <div
              className="absolute -inset-2 rounded-full animate-ping opacity-30 pointer-events-none"
              style={{ backgroundColor: envTheme.borderColor }}
            />

            {/* Inner Wax Seal Core */}
            <div
              className="w-full h-full rounded-full border-2 border-white/60 flex flex-col items-center justify-center shadow-inner"
              style={{ color: envTheme.sealTextColor }}
            >
              <Heart className="w-6 h-6 fill-current group-hover:scale-125 transition-transform" />
              <span className="text-[9px] font-bold tracking-widest uppercase mt-1">
                UNSEAL
              </span>
            </div>
          </button>

          <span
            className="text-[11px] font-bold uppercase tracking-widest mt-4 animate-bounce"
            style={{ color: envTheme.titleColor }}
          >
            Tap To Open Invitation 💌
          </span>
        </div>
      </div>
    </div>
  );
}
