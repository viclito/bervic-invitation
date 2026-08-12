"use client";

import { useState } from "react";
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Heart,
  User,
  Phone,
  Video,
  Check,
  Loader2,
} from "lucide-react";

export interface EventProfileData {
  id?: string;
  profileName?: string;
  eventTitle?: string;
  isActive?: boolean;
  eventType?: string;
  hostNameOne?: string;
  hostNameTwo?: string;
  coupleInitials?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  dressCode?: string;
  rsvpContact?: string;
  loveStoryText?: string;
  loveStoryVideoUrl?: string;
  showVideo?: boolean;
  isLocked?: boolean;
  lockReason?: string;
  timeUntilLockText?: string;
}

interface EventProfileModalProps {
  initialData?: EventProfileData | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (savedProfile: EventProfileData) => void;
}

export default function EventProfileModal({
  initialData,
  isOpen,
  onClose,
  onSaved,
}: EventProfileModalProps) {
  const [formData, setFormData] = useState<EventProfileData>({
    id: initialData?.id || undefined,
    profileName: initialData?.profileName || "",
    isActive: initialData?.isActive ?? true,
    eventType: initialData?.eventType || "WEDDING",
    hostNameOne: initialData?.hostNameOne || "",
    hostNameTwo: initialData?.hostNameTwo || "",
    coupleInitials: initialData?.coupleInitials || "",
    eventDate: initialData?.eventDate || "",
    eventTime: initialData?.eventTime || "",
    venueName: initialData?.venueName || "",
    venueAddress: initialData?.venueAddress || "",
    dressCode: initialData?.dressCode || "",
    rsvpContact: initialData?.rsvpContact || "",
    loveStoryText: initialData?.loveStoryText || "",
    loveStoryVideoUrl: initialData?.loveStoryVideoUrl || "",
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const calculateMonogram = (name1: string, name2: string) => {
    const c1 = name1.trim() ? name1.trim()[0].toUpperCase() : "";
    const c2 = name2.trim() ? name2.trim()[0].toUpperCase() : "";
    if (c1 && c2) return `${c1} & ${c2}`;
    if (c1) return c1;
    if (c2) return c2;
    return "";
  };

  const handleNameOneChange = (val: string) => {
    const mono = calculateMonogram(val, formData.hostNameTwo || "");
    setFormData((prev) => ({
      ...prev,
      hostNameOne: val,
      coupleInitials: mono || prev.coupleInitials,
    }));
  };

  const handleNameTwoChange = (val: string) => {
    const mono = calculateMonogram(formData.hostNameOne || "", val);
    setFormData((prev) => ({
      ...prev,
      hostNameTwo: val,
      coupleInitials: mono || prev.coupleInitials,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      const payload = {
        ...formData,
        loveStoryVideoUrl: formData.showVideo === false ? "" : formData.loveStoryVideoUrl,
        completedFields: formData.showVideo === false ? ["showVideo:false"] : ["showVideo:true"],
      };

      const res = await fetch("/api/user/event-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save profile");
      }

      onSaved(data.draft);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setErrorMsg(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFBF7] border border-[#D9A441]/40 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#7A1F2B] text-[#F8F3EA] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D9A441]/20 border border-[#D9A441]/40 flex items-center justify-center text-[#D9A441]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#F8F3EA]">
                {formData.id ? "Edit Celebration Profile" : "Add New Celebration Profile"}
              </h2>
              <p className="text-[11px] text-[#F8F3EA]/70">
                Configure your event details, venue, date, and love story
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#F8F3EA]/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Profile Label & Celebration Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                Profile Title / Label
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sasa & Allan's Wedding / Main Reception"
                value={formData.profileName}
                onChange={(e) => setFormData({ ...formData, profileName: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                Event Type
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
              >
                <option value="WEDDING">💍 Wedding Celebration</option>
                <option value="BIRTHDAY">🎂 Birthday Party</option>
                <option value="ANNIVERSARY">✨ Anniversary / Gala</option>
              </select>
            </div>
          </div>

          {/* Names & Monogram */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                {formData.eventType === "WEDDING" ? "Bride / Partner #1" : "Celebrated Host Name"}
              </label>
              <div className="relative">
                <Heart className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Sasa Adi Tinah"
                  value={formData.hostNameOne}
                  onChange={(e) => handleNameOneChange(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                {formData.eventType === "WEDDING" ? "Groom / Partner #2" : "Secondary Host"}
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Allan Susilo"
                  value={formData.hostNameTwo}
                  onChange={(e) => handleNameTwoChange(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                Monogram Initials
              </label>
              <input
                type="text"
                placeholder="e.g. S & A"
                value={formData.coupleInitials}
                onChange={(e) => setFormData({ ...formData, coupleInitials: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold text-[#7A1F2B] bg-white focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                Main Event Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                Main Event Time
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>
          </div>

          {/* Venue Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                Primary Venue / Hall Name
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. JW Marriott Grand Ballroom"
                  value={formData.venueName}
                  onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                Venue Address & City
              </label>
              <input
                type="text"
                placeholder="e.g. Residency Road, Bengaluru, Karnataka"
                value={formData.venueAddress}
                onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>

          {/* Dress Code & RSVP Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                Dress Code Attire
              </label>
              <input
                type="text"
                placeholder="e.g. Traditional Indian Ethnic"
                value={formData.dressCode}
                onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                RSVP WhatsApp Contact
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.rsvpContact}
                  onChange={(e) => setFormData({ ...formData, rsvpContact: e.target.value })}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>
          </div>

          {/* Shadcn Toggle Switch: Show / Hide Video Section */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-800 flex items-center justify-center font-bold">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Show YouTube Video Section</h4>
                <p className="text-[11px] text-slate-500">
                  Toggle ON to display your wedding teaser video, or OFF to hide the video section from your invitation card.
                </p>
              </div>
            </div>

            {/* Shadcn Switch Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={formData.showVideo !== false}
              onClick={() => setFormData({ ...formData, showVideo: !(formData.showVideo !== false) })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.showVideo !== false ? "bg-[#7E121D]" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  formData.showVideo !== false ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* YouTube Video URL */}
          {formData.showVideo !== false ? (
            <div>
              <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
                YouTube Video URL
              </label>
              <div className="relative">
                <Video className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={formData.loveStoryVideoUrl}
                  onChange={(e) => setFormData({ ...formData, loveStoryVideoUrl: e.target.value })}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>
          ) : null}

          {/* Love Story Narrative */}
          <div>
            <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wider">
              Love Story / Event Narrative
            </label>
            <textarea
              rows={3}
              placeholder="Share how you met and special notes for your guests..."
              value={formData.loveStoryText}
              onChange={(e) => setFormData({ ...formData, loveStoryText: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          {/* Active Profile Checkbox */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActiveCheck"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-[#7A1F2B] focus:ring-[#7A1F2B] cursor-pointer"
              />
              <label htmlFor="isActiveCheck" className="text-xs font-bold text-[#221C17] cursor-pointer">
                Set as Main Active Profile
              </label>
            </div>
            <span className="text-[10px] text-amber-900 font-medium">
              Populates all live template previews
            </span>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#7A1F2B] hover:bg-[#680E17] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>{formData.id ? "Save Profile Changes" : "Create Profile"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
