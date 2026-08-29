export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  itc: string;
  fontFamily: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English Only", itc: "", fontFamily: "inherit", flag: "🇬🇧" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", itc: "ta-t-i0-und", fontFamily: "'Noto Sans Tamil', sans-serif", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", itc: "te-t-i0-und", fontFamily: "'Noto Sans Telugu', sans-serif", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", itc: "ml-t-i0-und", fontFamily: "'Noto Sans Malayalam', sans-serif", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", itc: "hi-t-i0-und", fontFamily: "'Noto Sans Devanagari', sans-serif", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", itc: "kn-t-i0-und", fontFamily: "'Noto Sans Kannada', sans-serif", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", itc: "mr-t-i0-und", fontFamily: "'Noto Sans Devanagari', sans-serif", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", itc: "gu-t-i0-und", fontFamily: "'Noto Sans Gujarati', sans-serif", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", itc: "bn-t-i0-und", fontFamily: "'Noto Sans Bengali', sans-serif", flag: "🇮🇳" },
];

export const getLanguageByCode = (code: string): LanguageOption => {
  return (
    SUPPORTED_LANGUAGES.find((l) => l.code.toLowerCase() === (code || "").toLowerCase()) ||
    SUPPORTED_LANGUAGES[0]
  );
};

// In-memory client cache to avoid duplicate network queries
const transliterationCache = new Map<string, string>();

/**
 * Phonetic transliteration (e.g., "Kirubin" -> "கிருபின்") using Google Input Tools API
 */
export async function transliterateWord(
  text: string,
  targetLangCode: string
): Promise<{ text: string; suggestions: string[] }> {
  if (!text || !text.trim()) return { text: "", suggestions: [] };
  if (targetLangCode === "en") return { text, suggestions: [text] };

  const lang = getLanguageByCode(targetLangCode);
  if (!lang.itc) return { text, suggestions: [text] };

  const cacheKey = `${targetLangCode}::${text.trim()}`;
  if (transliterationCache.has(cacheKey)) {
    const cached = transliterationCache.get(cacheKey)!;
    return { text: cached, suggestions: [cached] };
  }

  try {
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(
      text
    )}&itc=${lang.itc}&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`;

    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data && data[0] === "SUCCESS" && Array.isArray(data[1])) {
        // Collect transliterated words in sequence
        const words = data[1].map((item: any) => {
          if (Array.isArray(item) && Array.isArray(item[1]) && item[1].length > 0) {
            return item[1][0];
          }
          return item[0] || "";
        });
        const suggestions = (data[1][0] && Array.isArray(data[1][0][1])) ? data[1][0][1] : [];
        const result = words.join(" ").trim();
        if (result) {
          transliterationCache.set(cacheKey, result);
          return { text: result, suggestions };
        }
      }
    }
  } catch (err) {
    // Network / timeout fallback
  }

  // Fallback to internal Next.js translate API
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage: targetLangCode, mode: "transliterate" }),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.translated) {
        transliterationCache.set(cacheKey, data.translated);
        return { text: data.translated, suggestions: data.suggestions || [data.translated] };
      }
    }
  } catch {}

  return { text, suggestions: [text] };
}

/**
 * Full Sentence/Phrase Translation (e.g., "Wedding & Reception" -> "திருமணம் மற்றும் வரவேற்பு")
 */
export async function translateSentence(
  text: string,
  targetLangCode: string
): Promise<string> {
  if (!text || !text.trim()) return "";
  if (targetLangCode === "en") return text;

  const cacheKey = `trans::${targetLangCode}::${text.trim()}`;
  if (transliterationCache.has(cacheKey)) {
    return transliterationCache.get(cacheKey)!;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage: targetLangCode, mode: "translate" }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.translated) {
        transliterationCache.set(cacheKey, data.translated);
        return data.translated;
      }
    }
  } catch {}

  return text;
}

const LOCALE_MAP: Record<string, string> = {
  ta: "ta-IN",
  te: "te-IN",
  ml: "ml-IN",
  hi: "hi-IN",
  kn: "kn-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  bn: "bn-IN",
  en: "en-IN",
};

/**
 * Format a Date object or YYYY-MM-DD string into English Wedding Format
 * e.g., "Sunday, 24 November 2026"
 */
export function formatEnglishDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format a Date object or YYYY-MM-DD string into Native Regional Script
 * e.g. ta -> "ஞாயிற்றுக்கிழமை, 24 நவம்பர் 2026"
 */
export function formatRegionalDate(dateStr: string, langCode: string): string {
  if (!dateStr || langCode === "en") return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const locale = LOCALE_MAP[langCode] || "en-IN";
  return d.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format 24hr or 12hr time into 12hr AM/PM
 */
export function format12HourTime(timeStr: string): string {
  if (!timeStr) return "";
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    const [h, m] = timeStr.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
  }
  return timeStr;
}

/**
 * Regional time formatting (e.g. "09:00 AM" -> "காலை 09:00", "07:00 PM" -> "மாலை 07:00")
 */
export function formatRegionalTime(timeStr: string, langCode: string): string {
  if (!timeStr || langCode === "en") return "";
  const formatted12 = format12HourTime(timeStr);
  if (formatted12.includes("AM")) {
    const cleanTime = formatted12.replace("AM", "").trim();
    switch (langCode) {
      case "ta": return `காலை ${cleanTime}`;
      case "te": return `ఉదయం ${cleanTime}`;
      case "ml": return `രാവിലെ ${cleanTime}`;
      case "hi": return `सुबह ${cleanTime}`;
      case "kn": return `ಬೆಳಿಗ್ಗೆ ${cleanTime}`;
      case "mr": return `सकाळी ${cleanTime}`;
      case "gu": return `સવારે ${cleanTime}`;
      case "bn": return `সকাল ${cleanTime}`;
      default: return formatted12;
    }
  } else if (formatted12.includes("PM")) {
    const cleanTime = formatted12.replace("PM", "").trim();
    switch (langCode) {
      case "ta": return `மாலை ${cleanTime}`;
      case "te": return `సాయంత్రం ${cleanTime}`;
      case "ml": return `വൈകുന്നேரம் ${cleanTime}`;
      case "hi": return `शाम ${cleanTime}`;
      case "kn": return `ಸಂಜೆ ${cleanTime}`;
      case "mr": return `संध्याकाळी ${cleanTime}`;
      case "gu": return `સાંજે ${cleanTime}`;
      case "bn": return `সন্ধ্যা ${cleanTime}`;
      default: return formatted12;
    }
  }
  return formatted12;
}

