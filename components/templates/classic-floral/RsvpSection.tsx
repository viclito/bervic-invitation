"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, XCircle, Heart, User, Phone, Mail, Users, MessageSquare, Diamond, Sparkles, Crown, Sun } from "lucide-react";

interface RsvpSectionProps {
  partnerOne?: string;
  partnerTwo?: string;
  slug?: string;
  templateSlug?: string;
  guestName?: string;
  guestPhone?: string;
}

export default function RsvpSection({
  partnerOne = "Partner",
  partnerTwo = "Partner",
  slug,
  templateSlug,
  guestName,
  guestPhone,
}: RsvpSectionProps) {
  const activeSlug = templateSlug || slug || "classic-floral";
  const searchParams = useSearchParams();

  const queryName =
    searchParams?.get("to") ||
    searchParams?.get("guest") ||
    searchParams?.get("name") ||
    guestName ||
    "";

  const queryPhone =
    searchParams?.get("phone") ||
    searchParams?.get("tel") ||
    searchParams?.get("mobile") ||
    guestPhone ||
    "";

  const initialName = queryName ? decodeURIComponent(queryName) : "";
  const initialPhone = queryPhone ? decodeURIComponent(queryPhone) : "";

  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);

  useEffect(() => {
    if (initialName && !name) {
      setName(initialName);
    }
    if (initialPhone && !phone) {
      setPhone(initialPhone);
    }
  }, [initialName, initialPhone]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"ATTENDING" | "DECLINED">("ATTENDING");
  const [plusOnes, setPlusOnes] = useState<number>(0);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    setSubmitting(true);
    try {
      const pathSlug = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : undefined;
      const currentSlug = (pathSlug && pathSlug !== "customize" && pathSlug !== "templates") ? pathSlug : (activeSlug || pathSlug);

      const res = await fetch(`/api/invitations/${currentSlug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          status,
          plusOnes: status === "ATTENDING" ? plusOnes : 0,
          dietaryNotes: dietaryNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit RSVP");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic Theme Styling configuration per template
  const getThemeStyles = () => {
    switch (activeSlug) {
      case "art-deco-revival":
        return {
          sectionBg: "bg-[#131410] border-t border-[#4d4635]",
          cardStyle: "bg-[#1c1c18] border border-[#d4af37] p-8 sm:p-12 shadow-2xl relative",
          subtitleColor: "text-[#f2ca50]",
          titleColor: "text-[#f2ca50] font-serif uppercase tracking-[0.15em]",
          textColor: "text-[#d0c5af]",
          inputBg: "bg-[#131410] text-[#e5e2db] border-[#d4af37]/60 focus:border-[#f2ca50]",
          inputIconColor: "text-[#f2ca50]",
          btnAttendingActive: "bg-[#d4af37] text-black border-[#d4af37] shadow-lg",
          btnAttendingInactive: "bg-[#131410] text-[#e5e2db] border-[#4d4635] hover:border-[#d4af37]",
          btnDeclinedActive: "bg-[#454545] text-white border-[#454545] shadow-lg",
          btnDeclinedInactive: "bg-[#131410] text-[#e5e2db] border-[#4d4635] hover:border-white",
          submitBtn: "bg-[#d4af37] text-black hover:bg-[#ffe088] font-bold uppercase tracking-[0.2em]",
          accentIcon: <Diamond className="w-5 h-5 text-[#d4af37] fill-current" />,
        };
      case "midnight-noir":
        return {
          sectionBg: "bg-[#081425] border-t border-[#45474b]/30",
          cardStyle: "bg-[#040e1f] border border-[#45474b]/40 rounded-2xl p-8 sm:p-12 shadow-2xl relative",
          subtitleColor: "text-[#c1c7cf]",
          titleColor: "text-[#d8e3fb] font-serif",
          textColor: "text-[#c6c6cb]",
          inputBg: "bg-[#081425] text-[#d8e3fb] border-[#45474b]/50 focus:border-[#c1c7cf]",
          inputIconColor: "text-[#c1c7cf]",
          btnAttendingActive: "bg-[#c1c7cf] text-[#161c22] border-[#c1c7cf] shadow-lg font-bold",
          btnAttendingInactive: "bg-[#081425] text-[#d8e3fb] border-[#45474b]/60 hover:border-[#c1c7cf]",
          btnDeclinedActive: "bg-[#353530] text-white border-[#353530] shadow-lg",
          btnDeclinedInactive: "bg-[#081425] text-[#d8e3fb] border-[#45474b]/60 hover:border-white",
          submitBtn: "bg-[#c1c7cf] text-[#161c22] hover:bg-[#dde3eb] font-bold uppercase tracking-widest",
          accentIcon: <Heart className="w-5 h-5 text-[#c1c7cf] fill-current" />,
        };
      case "champagne-luxe":
        return {
          sectionBg: "bg-[#faf9f6] border-t border-[#d0c5af]/30",
          cardStyle: "bg-white/70 backdrop-blur-xl border border-[#d0c5af]/50 rounded-2xl p-8 sm:p-12 shadow-md relative",
          subtitleColor: "text-[#685d4a]",
          titleColor: "text-[#735c00] font-serif font-light",
          textColor: "text-[#685d4a]",
          inputBg: "bg-white text-[#1a1c1a] border-[#d0c5af] focus:border-[#735c00]",
          inputIconColor: "text-[#735c00]",
          btnAttendingActive: "bg-[#735c00] text-white border-[#735c00] shadow-md font-bold",
          btnAttendingInactive: "bg-white text-[#1a1c1a] border-[#d0c5af] hover:border-[#735c00]",
          btnDeclinedActive: "bg-[#685d4a] text-white border-[#685d4a] shadow-md",
          btnDeclinedInactive: "bg-white text-[#1a1c1a] border-[#d0c5af] hover:border-[#685d4a]",
          submitBtn: "bg-[#735c00] text-white hover:bg-[#d4af37] font-bold uppercase tracking-widest",
          accentIcon: <Sparkles className="w-5 h-5 text-[#735c00]" />,
        };
      case "olive-ochre":
        return {
          sectionBg: "bg-[#fcf9f8] border-t border-[#cac7b1]/30",
          cardStyle: "bg-white/80 border border-[#cac7b1]/60 rounded-2xl p-8 sm:p-12 shadow-sm relative",
          subtitleColor: "text-[#904d00]",
          titleColor: "text-[#5f5f00] font-serif font-bold",
          textColor: "text-[#484837]",
          inputBg: "bg-white text-[#1b1c1c] border-[#cac7b1] focus:border-[#5f5f00]",
          inputIconColor: "text-[#5f5f00]",
          btnAttendingActive: "bg-[#5f5f00] text-white border-[#5f5f00] shadow-md font-bold",
          btnAttendingInactive: "bg-white text-[#1b1c1c] border-[#cac7b1] hover:border-[#5f5f00]",
          btnDeclinedActive: "bg-[#904d00] text-white border-[#904d00] shadow-md",
          btnDeclinedInactive: "bg-white text-[#1b1c1c] border-[#cac7b1] hover:border-[#904d00]",
          submitBtn: "bg-[#5f5f00] text-white hover:bg-[#494900] font-bold uppercase tracking-widest",
          accentIcon: <Heart className="w-5 h-5 text-[#5f5f00] fill-current" />,
        };
      case "seafoam-pearl":
        return {
          sectionBg: "bg-[#faf9f6] border-t border-[#93e9be]/30",
          cardStyle: "bg-white/80 backdrop-blur-md border border-[#93e9be]/50 rounded-2xl p-8 sm:p-12 shadow-[0_8px_32px_rgba(147,233,190,0.15)] relative",
          subtitleColor: "text-[#5a5f62]",
          titleColor: "text-[#046c4a] font-serif font-bold",
          textColor: "text-[#1a1c1a]",
          inputBg: "bg-[#faf9f6] text-[#1a1c1a] border-[#93e9be]/60 focus:border-[#046c4a]",
          inputIconColor: "text-[#046c4a]",
          btnAttendingActive: "bg-[#046c4a] text-white border-[#046c4a] shadow-md font-bold",
          btnAttendingInactive: "bg-[#faf9f6] text-[#1a1c1a] border-[#93e9be]/60 hover:border-[#046c4a]",
          btnDeclinedActive: "bg-[#5a5f62] text-white border-[#5a5f62] shadow-md",
          btnDeclinedInactive: "bg-[#faf9f6] text-[#1a1c1a] border-[#93e9be]/60 hover:border-[#5a5f62]",
          submitBtn: "bg-gradient-to-r from-[#93e9be] to-[#ffffff] text-[#046c4a] hover:bg-[#93e9be] font-bold uppercase tracking-widest border border-[#93e9be] shadow-sm",
          accentIcon: <Heart className="w-5 h-5 text-[#046c4a] fill-current" />,
        };
      case "veridian-garden":
        return {
          sectionBg: "bg-[#1b3022] text-[#819986] border-t border-[#735c00]/40",
          cardStyle: "bg-[#061b0e] border-2 border-[#735c00] rounded-2xl p-8 sm:p-12 shadow-2xl relative",
          subtitleColor: "text-[#d4af37]",
          titleColor: "text-white font-serif font-bold",
          textColor: "text-[#a7f3d0]",
          inputBg: "bg-[#1b3022] text-white border-[#735c00]/60 focus:border-[#735c00]",
          inputIconColor: "text-[#735c00]",
          btnAttendingActive: "bg-[#735c00] text-white border-[#735c00] shadow-md font-bold",
          btnAttendingInactive: "bg-[#1b3022] text-white border-[#735c00]/60 hover:border-[#735c00]",
          btnDeclinedActive: "bg-[#353530] text-white border-[#353530] shadow-md",
          btnDeclinedInactive: "bg-[#1b3022] text-white border-[#735c00]/60 hover:border-white",
          submitBtn: "bg-[#735c00] text-white hover:bg-[#8f7300] font-bold uppercase tracking-widest border border-[#735c00]",
          accentIcon: <Heart className="w-5 h-5 text-[#735c00] fill-current" />,
        };
      case "photo-gallery":
        return {
          sectionBg: "bg-[#31105C] text-white border-t border-[#D4AF37]/30",
          cardStyle: "bg-white/95 backdrop-blur-xl border border-[#D4AF37]/40 rounded-2xl p-8 sm:p-12 shadow-2xl relative text-[#1b1c19]",
          subtitleColor: "text-[#D4AF37]",
          titleColor: "text-white font-serif font-bold",
          textColor: "text-[#E2D4F0]",
          inputBg: "bg-white text-[#1b1c19] border-[#D4AF37]/60 focus:border-[#31105C]",
          inputIconColor: "text-[#31105C]",
          btnAttendingActive: "bg-[#31105C] text-white border-[#31105C] shadow-md font-bold",
          btnAttendingInactive: "bg-white text-[#1b1c19] border-[#D4AF37]/60 hover:border-[#31105C]",
          btnDeclinedActive: "bg-[#4a4452] text-white border-[#4a4452] shadow-md",
          btnDeclinedInactive: "bg-white text-[#1b1c19] border-[#D4AF37]/60 hover:border-[#4a4452]",
          submitBtn: "bg-[#31105C] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#31105C] font-bold uppercase tracking-widest border border-[#D4AF37]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />,
        };
      case "whimsical-storybook":
        return {
          sectionBg: "bg-[#31105C] text-white border-t border-[#D4AF37]/30",
          cardStyle: "bg-white border-2 border-[#D4AF37]/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative text-[#1b1c19]",
          subtitleColor: "text-[#D4AF37]",
          titleColor: "text-white font-serif font-bold",
          textColor: "text-[#E2D4F0]",
          inputBg: "bg-[#fbf9f4] text-[#1b1c19] border-[#D4AF37]/60 focus:border-[#31105C]",
          inputIconColor: "text-[#31105C]",
          btnAttendingActive: "bg-[#31105C] text-white border-[#31105C] shadow-md font-bold",
          btnAttendingInactive: "bg-white text-[#1b1c19] border-[#D4AF37]/60 hover:border-[#31105C]",
          btnDeclinedActive: "bg-[#4a4452] text-white border-[#4a4452] shadow-md",
          btnDeclinedInactive: "bg-white text-[#1b1c19] border-[#D4AF37]/60 hover:border-[#4a4452]",
          submitBtn: "bg-[#31105C] text-[#D4AF37] hover:bg-[#4a1b8c] hover:text-white font-bold uppercase tracking-widest border border-[#D4AF37]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />,
        };
      case "grand-ballroom":
        return {
          sectionBg: "bg-[#31105C] text-white border-t border-[#D4AF37]/30",
          cardStyle: "bg-white border-2 border-[#D4AF37] p-8 sm:p-12 shadow-2xl relative text-[#1b1c19]",
          subtitleColor: "text-[#D4AF37]",
          titleColor: "text-white font-serif font-bold",
          textColor: "text-[#E2D4F0]",
          inputBg: "bg-[#fbf9f4] text-[#1b1c19] border-[#D4AF37]/60 focus:border-[#31105C]",
          inputIconColor: "text-[#31105C]",
          btnAttendingActive: "bg-[#31105C] text-white border-[#31105C] shadow-md font-bold",
          btnAttendingInactive: "bg-white text-[#1b1c19] border-[#D4AF37]/60 hover:border-[#31105C]",
          btnDeclinedActive: "bg-[#4a4452] text-white border-[#4a4452] shadow-md",
          btnDeclinedInactive: "bg-white text-[#1b1c19] border-[#D4AF37]/60 hover:border-[#4a4452]",
          submitBtn: "bg-[#31105C] text-[#D4AF37] hover:bg-[#4a1b8c] hover:text-white font-bold uppercase tracking-widest border border-[#D4AF37]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#D4AF37]" />,
        };
      case "mint-slate":
        return {
          sectionBg: "bg-[#191c1d] text-white border-t border-[#246a52]",
          cardStyle: "bg-white border-2 border-[#191c1d] p-8 sm:p-12 shadow-2xl relative text-[#191c1d]",
          subtitleColor: "text-[#5cdbb5]",
          titleColor: "text-white font-mono font-bold uppercase",
          textColor: "text-[#c6e6da]",
          inputBg: "bg-[#f8fafa] text-[#191c1d] border-[#191c1d]/60 focus:border-[#246a52]",
          inputIconColor: "text-[#246a52]",
          btnAttendingActive: "bg-[#246a52] text-white border-[#246a52] shadow-md font-mono font-bold",
          btnAttendingInactive: "bg-white text-[#191c1d] border-[#191c1d]/60 hover:border-[#246a52]",
          btnDeclinedActive: "bg-[#191c1d] text-white border-[#191c1d] shadow-md",
          btnDeclinedInactive: "bg-white text-[#191c1d] border-[#191c1d]/60 hover:border-[#191c1d]",
          submitBtn: "bg-[#191c1d] text-[#aaf0d1] hover:bg-[#246a52] hover:text-white font-mono font-bold uppercase tracking-widest border border-[#191c1d]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#246a52]" />,
        };
      case "jade-ink":
        return {
          sectionBg: "bg-[#191c1d] text-white border-t border-[#006d43]",
          cardStyle: "bg-white border border-[#bccabe]/50 rounded-2xl p-8 sm:p-12 shadow-2xl relative text-[#191c1d]",
          subtitleColor: "text-[#34d399]",
          titleColor: "text-white font-serif font-bold",
          textColor: "text-[#d1fae5]",
          inputBg: "bg-[#f8f9fa] text-[#191c1d] border-[#bccabe] focus:border-[#006d43]",
          inputIconColor: "text-[#006d43]",
          btnAttendingActive: "bg-[#006d43] text-white border-[#006d43] shadow-md font-bold",
          btnAttendingInactive: "bg-white text-[#191c1d] border-[#bccabe] hover:border-[#006d43]",
          btnDeclinedActive: "bg-[#191c1d] text-white border-[#191c1d] shadow-md",
          btnDeclinedInactive: "bg-white text-[#191c1d] border-[#bccabe] hover:border-[#191c1d]",
          submitBtn: "bg-[#006d43] text-white hover:bg-[#005232] font-bold uppercase tracking-widest border border-[#006d43]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#006d43]" />,
        };
      case "lime-silver":
        return {
          sectionBg: "bg-[#0A0A0A] text-white border-t border-[#32CD32]",
          cardStyle: "bg-[#1a1c1c]/90 border-l-4 border-[#32CD32] border-t border-r border-b border-white/10 p-8 sm:p-12 shadow-[0_0_30px_rgba(50,205,50,0.15)] relative text-white",
          subtitleColor: "text-[#32CD32]",
          titleColor: "text-white font-sans font-black uppercase tracking-tight",
          textColor: "text-[#c6c6c6]",
          inputBg: "bg-[#0A0A0A] text-white border-white/20 focus:border-[#32CD32]",
          inputIconColor: "text-[#32CD32]",
          btnAttendingActive: "bg-[#32CD32] text-[#0A0A0A] border-[#32CD32] shadow-md font-bold",
          btnAttendingInactive: "bg-[#0A0A0A] text-white border-white/20 hover:border-[#32CD32]",
          btnDeclinedActive: "bg-white text-[#0A0A0A] border-white shadow-md font-bold",
          btnDeclinedInactive: "bg-[#0A0A0A] text-white border-white/20 hover:border-white",
          submitBtn: "bg-[#32CD32] text-[#0A0A0A] hover:bg-white font-bold uppercase tracking-widest border border-[#32CD32]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#32CD32]" />,
        };
      case "teal-copper":
        return {
          sectionBg: "bg-[#131407] text-white border-t border-[#ffb77b]",
          cardStyle: "bg-[#343625]/90 border border-[#ffb77b] p-8 sm:p-12 shadow-[0_0_25px_rgba(255,183,123,0.15)] relative text-[#e4e4cc]",
          subtitleColor: "text-[#ffb77b]",
          titleColor: "text-[#76d6d5] font-serif uppercase tracking-wider",
          textColor: "text-[#e4e4cc]",
          inputBg: "bg-[#131407] text-white border-[#ffb77b]/50 focus:border-[#ffb77b]",
          inputIconColor: "text-[#ffb77b]",
          btnAttendingActive: "bg-[#ffb77b] text-[#4d2700] border-[#ffb77b] shadow-md font-bold",
          btnAttendingInactive: "bg-[#131407] text-[#e4e4cc] border-[#ffb77b]/50 hover:border-[#ffb77b]",
          btnDeclinedActive: "bg-[#76d6d5] text-[#003737] border-[#76d6d5] shadow-md font-bold",
          btnDeclinedInactive: "bg-[#131407] text-[#e4e4cc] border-[#ffb77b]/50 hover:border-[#76d6d5]",
          submitBtn: "bg-[#ffb77b] text-[#4d2700] hover:bg-white font-bold uppercase tracking-widest border border-[#ffb77b]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#ffb77b]" />,
        };
      case "bohemian-sun":
        return {
          sectionBg: "bg-[#f7f3ee] text-[#1c1c19] border-t border-[#dac1b9]",
          cardStyle: "bg-[#fdf9f4] border border-[#dac1b9]/50 rounded-2xl p-8 sm:p-12 shadow-xl relative text-[#1c1c19]",
          subtitleColor: "text-[#91472a]",
          titleColor: "text-[#91472a] font-serif font-bold",
          textColor: "text-[#54433d]",
          inputBg: "bg-[#fdf9f4] text-[#1c1c19] border-[#dac1b9] focus:border-[#91472a]",
          inputIconColor: "text-[#91472a]",
          btnAttendingActive: "bg-[#91472a] text-white border-[#91472a] shadow-md font-bold",
          btnAttendingInactive: "bg-[#fdf9f4] text-[#1c1c19] border-[#dac1b9] hover:border-[#91472a]",
          btnDeclinedActive: "bg-[#546347] text-white border-[#546347] shadow-md font-bold",
          btnDeclinedInactive: "bg-[#fdf9f4] text-[#1c1c19] border-[#dac1b9] hover:border-[#546347]",
          submitBtn: "bg-[#91472a] text-white hover:bg-[#af5e3f] font-bold uppercase tracking-widest border border-[#91472a]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#91472a]" />,
        };
      case "emerald-gold":
        return {
          sectionBg: "bg-[#043927] text-white border-t border-[#735c00]",
          cardStyle: "bg-[#fcf9f8] border-2 border-[#735c00]/50 p-8 sm:p-12 shadow-2xl relative text-[#1c1b1b]",
          subtitleColor: "text-[#735c00]",
          titleColor: "text-[#043927] font-serif font-bold",
          textColor: "text-[#414944]",
          inputBg: "bg-white text-[#1c1b1b] border-[#735c00]/40 focus:border-[#735c00]",
          inputIconColor: "text-[#735c00]",
          btnAttendingActive: "bg-[#043927] text-white border-[#043927] shadow-md font-bold",
          btnAttendingInactive: "bg-white text-[#1c1b1b] border-[#735c00]/40 hover:border-[#735c00]",
          btnDeclinedActive: "bg-[#735c00] text-white border-[#735c00] shadow-md font-bold",
          btnDeclinedInactive: "bg-white text-[#1c1b1b] border-[#735c00]/40 hover:border-[#735c00]",
          submitBtn: "bg-[#043927] text-[#ffe088] hover:bg-[#ffe088] hover:text-[#043927] font-bold uppercase tracking-widest border border-[#735c00]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#735c00]" />,
        };
      case "moss-stone":
        return {
          sectionBg: "bg-[#f4f4f2] text-[#1a1c1b] border-t-2 border-[#76786b]",
          cardStyle: "bg-[#f9f9f7] border-2 border-[#76786b] p-8 sm:p-12 shadow-xl relative text-[#1a1c1b]",
          subtitleColor: "text-[#56642b]",
          titleColor: "text-[#56642b] font-serif font-bold",
          textColor: "text-[#46483c]",
          inputBg: "bg-[#f9f9f7] text-[#1a1c1b] border-[#76786b] focus:border-[#56642b]",
          inputIconColor: "text-[#56642b]",
          btnAttendingActive: "bg-[#56642b] text-white border-[#56642b] shadow-md font-bold",
          btnAttendingInactive: "bg-[#f9f9f7] text-[#1a1c1b] border-[#76786b] hover:border-[#56642b]",
          btnDeclinedActive: "bg-[#76786b] text-white border-[#76786b] shadow-md font-bold",
          btnDeclinedInactive: "bg-[#f9f9f7] text-[#1a1c1b] border-[#76786b] hover:border-[#76786b]",
          submitBtn: "bg-[#56642b] text-white hover:bg-[#3e4c16] font-bold uppercase tracking-widest border border-[#56642b]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#56642b]" />,
        };
      case "sage-sand":
        return {
          sectionBg: "bg-[#f5f3f3] text-[#1b1c1c] border-t border-[#c5c8bc]",
          cardStyle: "bg-white border border-[#c5c8bc]/50 p-8 sm:p-12 shadow-xl relative text-[#1b1c1c] rounded-2xl",
          subtitleColor: "text-[#6c5b4e]",
          titleColor: "text-[#526442] font-serif font-bold",
          textColor: "text-[#44483f]",
          inputBg: "bg-[#fbf9f8] text-[#1b1c1c] border-[#c5c8bc] focus:border-[#526442]",
          inputIconColor: "text-[#526442]",
          btnAttendingActive: "bg-[#526442] text-white border-[#526442] shadow-md font-bold",
          btnAttendingInactive: "bg-white text-[#1b1c1c] border-[#c5c8bc] hover:border-[#526442]",
          btnDeclinedActive: "bg-[#6c5b4e] text-white border-[#6c5b4e] shadow-md font-bold",
          btnDeclinedInactive: "bg-white text-[#1b1c1c] border-[#c5c8bc] hover:border-[#6c5b4e]",
          submitBtn: "bg-[#526442] text-white hover:bg-[#3b4c2c] font-bold uppercase tracking-widest border border-[#526442]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#526442]" />,
        };
      case "forest-fern":
        return {
          sectionBg: "bg-[#13140f] text-[#e4e2db] border-t border-[#434843]/40",
          cardStyle: "bg-[#1f201b] border border-[#434843]/50 p-8 sm:p-12 shadow-[0_0_25px_rgba(32,53,39,0.5)] relative text-[#e4e2db]",
          subtitleColor: "text-[#ffdcbd]",
          titleColor: "text-[#b4cdb8] font-serif font-bold",
          textColor: "text-[#c3c8c1]",
          inputBg: "bg-[#13140f] text-white border-[#434843] focus:border-[#b4cdb8]",
          inputIconColor: "text-[#b4cdb8]",
          btnAttendingActive: "bg-[#b4cdb8] text-[#203527] border-[#b4cdb8] shadow-md font-bold",
          btnAttendingInactive: "bg-[#13140f] text-[#c3c8c1] border-[#434843] hover:border-[#b4cdb8]",
          btnDeclinedActive: "bg-[#f0bd8b] text-[#2c1600] border-[#f0bd8b] shadow-md font-bold",
          btnDeclinedInactive: "bg-[#13140f] text-[#c3c8c1] border-[#434843] hover:border-[#f0bd8b]",
          submitBtn: "bg-[#1b3022] text-[#d0e9d4] hover:bg-[#28501e] font-bold uppercase tracking-widest border border-[#422401]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#f0bd8b]" />,
        };
      case "celestial-night":
        return {
          sectionBg: "bg-[#090a10] text-[#e0e2ec] border-t border-[#d4af37]/30",
          cardStyle: "bg-[#121420] border border-[#d4af37]/40 p-8 sm:p-12 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative text-[#e0e2ec] rounded-xl",
          subtitleColor: "text-[#d4af37]",
          titleColor: "text-white font-serif font-bold",
          textColor: "text-[#a3a8be]",
          inputBg: "bg-[#090a10] text-white border-[#d4af37]/40 focus:border-[#d4af37]",
          inputIconColor: "text-[#d4af37]",
          btnAttendingActive: "bg-[#d4af37] text-[#090a10] border-[#d4af37] shadow-md font-bold",
          btnAttendingInactive: "bg-[#090a10] text-[#e0e2ec] border-[#d4af37]/40 hover:border-[#d4af37]",
          btnDeclinedActive: "bg-[#a3a8be] text-[#090a10] border-[#a3a8be] shadow-md font-bold",
          btnDeclinedInactive: "bg-[#090a10] text-[#e0e2ec] border-[#d4af37]/40 hover:border-[#a3a8be]",
          submitBtn: "bg-[#d4af37] text-[#090a10] hover:bg-white font-bold uppercase tracking-widest border border-[#d4af37]",
          accentIcon: <Sparkles className="w-5 h-5 text-[#d4af37]" />,
        };
      case "royal-maharani":
        return {
          sectionBg: "bg-[#1a0812] text-[#fce8ef] border-t border-[#e6c280]/30",
          cardStyle: "bg-[#290d1d] border border-[#e6c280]/40 p-8 sm:p-12 shadow-[0_0_35px_rgba(230,194,128,0.2)] relative text-[#fce8ef] rounded-xl",
          subtitleColor: "text-[#e6c280]",
          titleColor: "text-[#fff0f5] font-serif font-bold",
          textColor: "text-[#d8b5c4]",
          inputBg: "bg-[#1a0812] text-white border-[#e6c280]/40 focus:border-[#e6c280]",
          inputIconColor: "text-[#e6c280]",
          btnAttendingActive: "bg-[#e6c280] text-[#1a0812] border-[#e6c280] shadow-md font-bold",
          btnAttendingInactive: "bg-[#1a0812] text-[#fce8ef] border-[#e6c280]/40 hover:border-[#e6c280]",
          btnDeclinedActive: "bg-[#d8b5c4] text-[#1a0812] border-[#d8b5c4] shadow-md font-bold",
          btnDeclinedInactive: "bg-[#1a0812] text-[#fce8ef] border-[#e6c280]/40 hover:border-[#d8b5c4]",
          submitBtn: "bg-[#e6c280] text-[#1a0812] hover:bg-white font-bold uppercase tracking-widest border border-[#e6c280]",
          accentIcon: <Crown className="w-5 h-5 text-[#e6c280]" />,
        };
      case "sunset-terracotta":
        return {
          sectionBg: "bg-[#1f0d07] text-[#faede8] border-t border-[#e07a5f]/30",
          cardStyle: "bg-[#31150c] border border-[#e07a5f]/40 p-8 sm:p-12 shadow-[0_0_35px_rgba(224,122,95,0.25)] relative text-[#faede8] rounded-xl",
          subtitleColor: "text-[#f4a261]",
          titleColor: "text-white font-serif font-bold",
          textColor: "text-[#d8a899]",
          inputBg: "bg-[#1f0d07] text-white border-[#e07a5f]/40 focus:border-[#e07a5f]",
          inputIconColor: "text-[#f4a261]",
          btnAttendingActive: "bg-[#e07a5f] text-white border-[#e07a5f] shadow-md font-bold",
          btnAttendingInactive: "bg-[#1f0d07] text-[#faede8] border-[#e07a5f]/40 hover:border-[#e07a5f]",
          btnDeclinedActive: "bg-[#f4a261] text-[#1f0d07] border-[#f4a261] shadow-md font-bold",
          btnDeclinedInactive: "bg-[#1f0d07] text-[#faede8] border-[#e07a5f]/40 hover:border-[#f4a261]",
          submitBtn: "bg-[#e07a5f] text-white hover:bg-[#f4a261] font-bold uppercase tracking-widest border border-[#e07a5f]",
          accentIcon: <Sun className="w-5 h-5 text-[#f4a261]" />,
        };
      default:
        // Classic Floral Fallback
        return {
          sectionBg: "bg-[#FAF1ED] border-t border-[#E8D4C8]",
          cardStyle: "bg-[#FAF8F5] border border-[#E8D4C8] rounded-3xl p-8 sm:p-12 shadow-xl relative",
          subtitleColor: "text-[#B85C6B]",
          titleColor: "text-[#4A2E35] font-serif",
          textColor: "text-[#2B2320]/80",
          inputBg: "bg-white text-[#2B2320] border-[#E8D4C8] focus:border-[#B85C6B]",
          inputIconColor: "text-[#B85C6B]",
          btnAttendingActive: "bg-[#B85C6B] text-white border-[#B85C6B] shadow-md font-bold",
          btnAttendingInactive: "bg-white text-[#2B2320] border-[#E8D4C8] hover:border-[#B85C6B]",
          btnDeclinedActive: "bg-[#4A2E35] text-white border-[#4A2E35] shadow-md",
          btnDeclinedInactive: "bg-white text-[#2B2320] border-[#E8D4C8] hover:border-[#4A2E35]",
          submitBtn: "bg-[#B85C6B] text-white hover:bg-[#A34B59] font-bold uppercase tracking-widest",
          accentIcon: <Heart className="w-5 h-5 text-[#B85C6B] fill-current" />,
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <section id="rsvp" className={`py-24 ${theme.sectionBg} relative overflow-hidden`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <span className={`text-xs font-bold uppercase tracking-[0.2em] ${theme.subtitleColor} block mb-2`}>
            R.S.V.P. INVITATION
          </span>
          <h2 className={`text-3xl sm:text-4xl ${theme.titleColor}`}>
            Will You Join Our Special Day?
          </h2>
          <p className={`text-sm ${theme.textColor} mt-3 max-w-lg mx-auto font-sans leading-relaxed`}>
            Please kindly respond by letting {partnerOne} &amp; {partnerTwo} know if you will be celebrating with us!
          </p>
        </div>

        {submitted ? (
          <div className={`${theme.cardStyle} text-center animate-fade-in`}>
            <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center mx-auto mb-4">
              {theme.accentIcon}
            </div>
            <h3 className={`text-2xl font-serif ${theme.titleColor}`}>
              {status === "ATTENDING" ? "Joyfully Confirmed!" : "Thank You For Replying"}
            </h3>
            <p className={`text-sm ${theme.textColor} mt-3 max-w-md mx-auto`}>
              {status === "ATTENDING"
                ? `Thank you, ${name}! Your response has been received. We cannot wait to celebrate with you!`
                : `Thank you for letting us know, ${name}. We will miss you on our special day!`}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setPhone("");
                setPlusOnes(0);
                setDietaryNotes("");
              }}
              className={`mt-6 px-6 py-2.5 rounded-full border text-xs font-bold ${theme.submitBtn} transition-all`}
            >
              Submit Another RSVP Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={`${theme.cardStyle} space-y-6`}>
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Attendance Choice */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setStatus("ATTENDING")}
                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                  status === "ATTENDING" ? theme.btnAttendingActive : theme.btnAttendingInactive
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-bold tracking-wide uppercase">Accept with Pleasure</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus("DECLINED")}
                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                  status === "DECLINED" ? theme.btnDeclinedActive : theme.btnDeclinedInactive
                }`}
              >
                <XCircle className="w-5 h-5" />
                <span className="text-xs font-bold tracking-wide uppercase">Regretfully Decline</span>
              </button>
            </div>

            {/* Name Input */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.subtitleColor}`}>
                Full Name *
              </label>
              <div className="relative">
                <User className={`w-4 h-4 ${theme.inputIconColor} absolute left-4 top-3.5`} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-xs font-medium focus:outline-none transition-all ${theme.inputBg}`}
                />
              </div>
            </div>

            {/* Plus Ones / Additional Guests */}
            {status === "ATTENDING" && (
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.subtitleColor}`}>
                  Number of Guests (Including Yourself)
                </label>
                <div className="relative">
                  <Users className={`w-4 h-4 ${theme.inputIconColor} absolute left-4 top-3.5`} />
                  <select
                    value={plusOnes}
                    onChange={(e) => setPlusOnes(Number(e.target.value))}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-xs font-medium focus:outline-none transition-all appearance-none ${theme.inputBg}`}
                  >
                    <option value={0}>Just Myself (1 Person)</option>
                    <option value={1}>Myself + 1 Guest (2 People)</option>
                    <option value={2}>Myself + 2 Guests (3 People)</option>
                    <option value={3}>Myself + 3 Guests (4 People)</option>
                    <option value={4}>Myself + 4 Guests (5 People)</option>
                    <option value={5}>Myself + 5 Guests (6 People)</option>
                    <option value={6}>Myself + 6 Guests (7 People)</option>
                    <option value={7}>Myself + 7 Guests (8 People)</option>
                    <option value={8}>Myself + 8 Guests (9 People)</option>
                    <option value={9}>Myself + 9 Guests (10 People)</option>
                    <option value={10}>Myself + 10+ Guests (Large Family)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Notes / Dietary Requirements */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.subtitleColor}`}>
                Dietary Preferences or Warm Wishes
              </label>
              <div className="relative">
                <MessageSquare className={`w-4 h-4 ${theme.inputIconColor} absolute left-4 top-3.5`} />
                <textarea
                  rows={3}
                  placeholder="e.g. Vegetarian diet, or a sweet message for the couple..."
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-xs font-medium focus:outline-none transition-all ${theme.inputBg}`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 ${theme.submitBtn}`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Submitting RSVP...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirm RSVP Response</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
