"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Phone, MapPin, Share2, Check } from "lucide-react";
import { useState } from "react";

interface FooterProps {
  coupleInitials?: string;
  partnerOne?: string;
  partnerTwo?: string;
  contactPhone?: string;
  contactAddress?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

export default function FooterSection({
  coupleInitials = "T | A",
  partnerOne = "Terance",
  partnerTwo = "Ancy",
  contactPhone = "+91 98765 43210",
  contactAddress = "Kochi, Kerala, India",
  socialLinks = {},
}: FooterProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${partnerOne} & ${partnerTwo}'s Wedding Invitation`,
        text: `Join us in celebrating ${partnerOne} & ${partnerTwo}'s Wedding!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <footer className="relative bg-[#221C17] text-[#F8F3EA] pt-20 pb-12 overflow-hidden border-t-2 border-[#C9A15A]/30">
      {/* Subtle Background Mandala Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg className="w-[600px] h-[600px] text-[#C9A15A] fill-current animate-spin-slow" viewBox="0 0 24 24">
          <path d="M12 2C11.5 5 9.5 7.5 7 9C9.5 10.5 11.5 13 12 16C12.5 13 14.5 10.5 17 9C14.5 7.5 12.5 5 12 2Z" />
          <path d="M12 15C8.5 15 5.5 17.5 4 21C6.5 21.5 9.5 22 12 22C14.5 22 17.5 21.5 20 21C18.5 17.5 15.5 15 12 15Z" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-10">
        {/* Monogram / Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <span className="text-xs font-bold text-[#C9A15A] uppercase tracking-widest block">
            WE CAN'WAIT TO CELEBRATE WITH YOU
          </span>
          <h2 className="text-3xl sm:text-4xl font-accent font-bold text-[#F8F3EA]">
            {partnerOne} <span className="text-[#C9A15A]">&</span> {partnerTwo}
          </h2>
        </motion.div>

        {/* Quick Contact & Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-xs text-[#F8F3EA]/80 font-medium">
          {contactPhone && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#7A1F2B]/20 border border-[#C9A15A]/30">
              <Phone className="w-4 h-4 text-[#C9A15A]" />
              <span>RSVP: {contactPhone}</span>
            </div>
          )}
          {contactAddress && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#7A1F2B]/20 border border-[#C9A15A]/30">
              <MapPin className="w-4 h-4 text-[#C9A15A]" />
              <span>{contactAddress}</span>
            </div>
          )}
        </div>

        {/* Share Button */}
        <div>
          <button
            onClick={handleShare}
            className="btn-gold px-6 py-3 text-xs font-bold inline-flex items-center gap-2 shadow-lg"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#5B8C69]" />
                <span>Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#7A1F2B]" />
                <span>Share Invitation Card</span>
              </>
            )}
          </button>
        </div>

        {/* Platform Watermark Footer */}
        <div className="pt-8 border-t border-[#C9A15A]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F8F3EA]/60 gap-2">
          <p>© {new Date().getFullYear()} {partnerOne} & {partnerTwo}'s Wedding Celebration.</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-[#C9A15A] font-bold">Bervic</span>
            <Heart className="w-3 h-3 text-[#7A1F2B] fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}
