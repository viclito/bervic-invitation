/**
 * Robust utility to parse wedding date & time strings into a valid JS Date object for live countdown timers.
 * Handles ISO strings ("2026-08-07T17:30:00.000Z"), YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY,
 * ordinal strings ("9th August 2026", "28th November 2026"), and optional time strings (e.g. "10:00 AM", "17:30").
 */
export function getWeddingTargetDate(weddingDate?: string, weddingTime?: string): Date {
  if (!weddingDate) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 30);
    return fallback;
  }

  // 0. Remove ordinal suffixes e.g. "9th August 2026" -> "9 August 2026"
  const cleanDateStr = weddingDate.replace(/(\d+)(st|nd|rd|th)/gi, "$1").trim();

  let parsed: Date;

  // 1. Try standard JS Date parsing on cleaned string
  const directDate = new Date(cleanDateStr);
  if (!isNaN(directDate.getTime())) {
    parsed = directDate;
  } else {
    // 2. Handle DD-MM-YYYY or DD/MM/YYYY (e.g. 09-08-2026 or 09/08/2026)
    const dmyMatch = cleanDateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const month = parseInt(dmyMatch[2], 10) - 1; // 0-indexed
      const year = parseInt(dmyMatch[3], 10);
      parsed = new Date(year, month, day);
    } else {
      // 3. Handle YYYY-MM-DD or YYYY/MM/DD
      const ymdMatch = cleanDateStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
      if (ymdMatch) {
        const year = parseInt(ymdMatch[1], 10);
        const month = parseInt(ymdMatch[2], 10) - 1;
        const day = parseInt(ymdMatch[3], 10);
        parsed = new Date(year, month, day);
      } else {
        const fallback = new Date();
        fallback.setDate(fallback.getDate() + 30);
        return fallback;
      }
    }
  }

  let timeApplied = false;
  if (weddingTime) {
    timeApplied = applyTimeToDate(parsed, weddingTime);
  }
  if (!timeApplied && weddingDate) {
    timeApplied = applyTimeToDate(parsed, weddingDate);
  }

  // If no specific time was provided (i.e. default date set to 00:00:00 midnight),
  // default event commencement to 10:00 AM on event day instead of midnight
  if (!timeApplied && parsed.getHours() === 0 && parsed.getMinutes() === 0) {
    parsed.setHours(10, 0, 0, 0);
  }

  return parsed;
}

function applyTimeToDate(d: Date, timeStr: string): boolean {
  if (!timeStr) return false;

  const matchTime = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (matchTime) {
    let hours = parseInt(matchTime[1], 10);
    const minutes = parseInt(matchTime[2], 10);
    const ampm = matchTime[3] ? matchTime[3].toUpperCase() : null;

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    d.setHours(hours, minutes, 0, 0);
    return true;
  }

  return false;
}

/**
 * Formats any date string (ISO, YYYY-MM-DD, etc.) into a friendly display date like "28th November 2026".
 */
export function formatDateForDisplay(weddingDate?: string, fallback = "13th May 2026"): string {
  if (!weddingDate) return fallback;

  if (/[a-zA-Z]/.test(weddingDate) && !weddingDate.includes("T")) {
    return weddingDate;
  }

  const parsed = getWeddingTargetDate(weddingDate);
  if (isNaN(parsed.getTime())) return weddingDate || fallback;

  const day = parsed.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[parsed.getMonth()];
  const year = parsed.getFullYear();

  const s = ["th", "st", "nd", "rd"];
  const v = day % 100;
  const ordinal = s[(v - 20) % 10] || s[v] || s[0];

  return `${day}${ordinal} ${month} ${year}`;
}

/**
 * Converts any YouTube URL (watch URL, short link, or embed link) into a proper embed URL.
 */
export function getYouTubeEmbedUrl(url?: string): string {
  if (!url || !url.trim()) return "";

  const clean = url.trim();

  // Handle YouTube Shorts, watch, youtu.be, embed
  const ytMatch = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // Handle Vimeo
  const vimeoMatch = clean.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  // Any 11-char ID inside a youtube string
  if (clean.includes("youtube") || clean.includes("youtu")) {
    const rawMatch = clean.match(/[\w-]{11}/);
    if (rawMatch && rawMatch[0]) {
      return `https://www.youtube.com/embed/${rawMatch[0]}?autoplay=1&rel=0`;
    }
  }

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return "";
}

/**
 * Formats a birthday person's age into ordinal format (e.g. 30 -> "30th", 1 -> "1st", 21 -> "21st", "25th" -> "25th").
 */
export function formatAgeOrdinal(age?: string | number): string {
  if (!age) return "";
  const str = String(age).trim();
  if (!str) return "";

  // If already has an ordinal suffix like "30th", "1st", "2nd", "3rd", return cleaned
  if (/^\d+(st|nd|rd|th)$/i.test(str)) {
    return str;
  }

  const num = parseInt(str, 10);
  if (isNaN(num) || num <= 0) return str;

  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${num}th`;
  }
  if (lastDigit === 1) return `${num}st`;
  if (lastDigit === 2) return `${num}nd`;
  if (lastDigit === 3) return `${num}rd`;
  return `${num}th`;
}

