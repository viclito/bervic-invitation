"use client";

import React, { useState, useEffect, useRef } from "react";
import { transliterateWord, translateSentence, getLanguageByCode } from "@/lib/indicTranslation";
import { Sparkles, Languages, Check, Edit3 } from "lucide-react";

interface IndicLanguageInputProps {
  label: string;
  required?: boolean;
  englishValue: string;
  onEnglishChange: (val: string) => void;
  regionalValue: string;
  onRegionalChange: (val: string) => void;
  targetLanguage: string; // "ta", "te", "ml", "hi", "kn", "mr", "gu", "bn", "en"
  languageMode: "DUAL" | "REGIONAL_ONLY";
  placeholderEnglish?: string;
  placeholderRegional?: string;
  error?: string;
  mode?: "transliterate" | "translate";
  multiline?: boolean;
  helperText?: string;
}

export default function IndicLanguageInput({
  label,
  required = false,
  englishValue = "",
  onEnglishChange,
  regionalValue = "",
  onRegionalChange,
  targetLanguage,
  languageMode,
  placeholderEnglish = "",
  placeholderRegional = "",
  error,
  mode = "transliterate",
  multiline = false,
  helperText,
}: IndicLanguageInputProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const isManuallyEditedRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const safeEnglishValue = englishValue ?? "";
  const safeRegionalValue = regionalValue ?? "";

  const langInfo = getLanguageByCode(targetLanguage);
  const isEnglishOnly = targetLanguage === "en";

  // Auto-translate / transliterate when English input changes
  useEffect(() => {
    if (isEnglishOnly || languageMode === "REGIONAL_ONLY") return;
    if (!safeEnglishValue || !safeEnglishValue.trim()) {
      if (!isManuallyEditedRef.current) {
        onRegionalChange("");
      }
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      setIsTranslating(true);
      try {
        if (mode === "translate") {
          const trans = await translateSentence(safeEnglishValue, targetLanguage);
          if (trans && !isManuallyEditedRef.current) {
            onRegionalChange(trans);
          }
        } else {
          const res = await transliterateWord(safeEnglishValue, targetLanguage);
          if (res.text && !isManuallyEditedRef.current) {
            onRegionalChange(res.text);
          }
          if (res.suggestions && res.suggestions.length > 1) {
            setSuggestions(res.suggestions);
          }
        }
      } catch (err) {
        console.error("Auto transliteration error:", err);
      } finally {
        setIsTranslating(false);
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [safeEnglishValue, targetLanguage, mode, languageMode, isEnglishOnly]);

  const handleEnglishInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    isManuallyEditedRef.current = false;
    onEnglishChange(e.target.value);
  };

  const handleRegionalInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    isManuallyEditedRef.current = true;
    onRegionalChange(e.target.value);
  };

  const applySuggestion = (sug: string) => {
    isManuallyEditedRef.current = true;
    onRegionalChange(sug);
    setSuggestions([]);
  };

  // Case 1: English Only
  if (isEnglishOnly) {
    return (
      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-800">
          {label} {required && <span className="text-[#991B1B]">*</span>}
        </label>
        {multiline ? (
          <textarea
            rows={2}
            value={safeEnglishValue}
            onChange={handleEnglishInput}
            placeholder={placeholderEnglish}
            className={`w-full text-xs sm:text-sm px-3 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#991B1B]/15 transition-all ${
              error ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-[#991B1B]"
            }`}
          />
        ) : (
          <input
            type="text"
            value={safeEnglishValue}
            onChange={handleEnglishInput}
            placeholder={placeholderEnglish}
            className={`w-full text-xs sm:text-sm px-3 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#991B1B]/15 transition-all ${
              error ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-[#991B1B]"
            }`}
          />
        )}
        {error && <p className="text-[10.5px] text-rose-600 font-bold">{error}</p>}
        {helperText && <p className="text-[10.5px] text-slate-400">{helperText}</p>}
      </div>
    );
  }

  // Case 2: Regional Language Only
  if (languageMode === "REGIONAL_ONLY") {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <label className="block text-xs font-bold text-slate-800">
            {label} {required && <span className="text-[#991B1B]">*</span>}
          </label>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
            {langInfo.nativeName} Script
          </span>
        </div>

        <div>
          {multiline ? (
            <textarea
              rows={2}
              value={safeRegionalValue || safeEnglishValue}
              onChange={handleRegionalInput}
              placeholder={placeholderRegional || placeholderEnglish}
              style={{ fontFamily: langInfo.fontFamily }}
              className={`w-full text-xs sm:text-sm px-3 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#991B1B]/15 transition-all font-medium ${
                error ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-[#991B1B]"
              }`}
            />
          ) : (
            <input
              type="text"
              value={safeRegionalValue || safeEnglishValue}
              onChange={handleRegionalInput}
              placeholder={placeholderRegional || placeholderEnglish}
              style={{ fontFamily: langInfo.fontFamily }}
              className={`w-full text-xs sm:text-sm px-3 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#991B1B]/15 transition-all font-medium ${
                error ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-[#991B1B]"
              }`}
            />
          )}
        </div>

        {error && <p className="text-[10.5px] text-rose-600 font-bold">{error}</p>}
        {helperText && <p className="text-[10.5px] text-slate-400">{helperText}</p>}
      </div>
    );
  }

  // Case 3: Dual Language Mode (English + Auto-Translated Regional Below)
  return (
    <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/80 hover:border-slate-300 transition-all space-y-2.5">
      {/* English Primary Input */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <label className="block text-[11.5px] font-bold text-slate-800">
            {label} <span className="text-[10.5px] text-slate-400 font-normal">(English)</span> {required && <span className="text-[#991B1B]">*</span>}
          </label>
          <span className="text-[10px] text-slate-400 font-medium">Type in English</span>
        </div>

        {multiline ? (
          <textarea
            rows={2}
            value={safeEnglishValue}
            onChange={handleEnglishInput}
            placeholder={placeholderEnglish || "Type in English..."}
            className={`w-full text-xs sm:text-sm px-3 py-1.5 rounded-xl border bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#991B1B]/15 transition-all ${
              error ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-[#991B1B]"
            }`}
          />
        ) : (
          <input
            type="text"
            value={safeEnglishValue}
            onChange={handleEnglishInput}
            placeholder={placeholderEnglish || "Type in English..."}
            className={`w-full text-xs sm:text-sm px-3 py-1.5 rounded-xl border bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#991B1B]/15 transition-all ${
              error ? "border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-[#991B1B]"
            }`}
          />
        )}
      </div>

      {/* Regional Script Field (Auto-populated & Editable) */}
      <div className="pt-2 border-t border-stone-200/70">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10.5px] font-extrabold text-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{langInfo.nativeName} ({langInfo.name})</span>
            </span>
            {isTranslating && (
              <span className="inline-flex items-center gap-1 text-[9.5px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium animate-pulse border border-amber-200">
                <Sparkles className="w-2.5 h-2.5 animate-spin" /> Translating...
              </span>
            )}
          </div>
          <span className="text-[9.5px] text-slate-400 font-medium flex items-center gap-0.5">
            <Edit3 className="w-2.5 h-2.5" /> Editable
          </span>
        </div>

        <div>
          {multiline ? (
            <textarea
              rows={2}
              value={safeRegionalValue}
              onChange={handleRegionalInput}
              placeholder={placeholderRegional || `${langInfo.nativeName} மொழிபெயர்ப்பு...`}
              style={{ fontFamily: langInfo.fontFamily }}
              className="w-full text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-emerald-300/80 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-900 shadow-2xs"
            />
          ) : (
            <input
              type="text"
              value={safeRegionalValue}
              onChange={handleRegionalInput}
              placeholder={placeholderRegional || `${langInfo.nativeName} மொழிபெயர்ப்பு...`}
              style={{ fontFamily: langInfo.fontFamily }}
              className="w-full text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-emerald-300/80 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium text-slate-900 shadow-2xs"
            />
          )}
        </div>

        {/* Word suggestions */}
        {suggestions.length > 1 && (
          <div className="flex flex-wrap items-center gap-1 mt-1.5">
            <span className="text-[9.5px] text-slate-400 font-medium">Suggestions:</span>
            {suggestions.slice(0, 4).map((sug, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={() => applySuggestion(sug)}
                style={{ fontFamily: langInfo.fontFamily }}
                className={`text-[10.5px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                  safeRegionalValue === sug
                    ? "bg-emerald-700 text-white border-emerald-700 font-bold"
                    : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50"
                }`}
              >
                {sug}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-[10.5px] text-rose-600 font-bold">{error}</p>}
      {helperText && <p className="text-[10.5px] text-slate-400">{helperText}</p>}
    </div>
  );
}
