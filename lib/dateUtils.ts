/**
 * Robust utility to parse wedding date & time strings into a valid JS Date object for live countdown timers.
 * Handles ISO strings ("2026-08-07T17:30:00.000Z"), YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY,
 * and optional wedding time strings (e.g. "05:30 PM", "17:30").
 */
export function getWeddingTargetDate(weddingDate?: string, weddingTime?: string): Date {
  if (!weddingDate) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 30);
    return fallback;
  }

  // 1. Try standard ISO/Date parsing
  let parsed = new Date(weddingDate);
  if (!isNaN(parsed.getTime())) {
    // If the input was just YYYY-MM-DD or doesn't include time, apply weddingTime if present
    if (weddingTime && !weddingDate.includes("T") && !weddingDate.includes(":")) {
      applyTimeToDate(parsed, weddingTime);
    }
    return parsed;
  }

  // 2. Handle DD-MM-YYYY or DD/MM/YYYY (e.g. 07-08-2026 or 07/08/2026)
  const dmyMatch = weddingDate.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1; // 0-indexed
    const year = parseInt(dmyMatch[3], 10);
    parsed = new Date(year, month, day);
    if (weddingTime) {
      applyTimeToDate(parsed, weddingTime);
    }
    if (!isNaN(parsed.getTime())) return parsed;
  }

  // 3. Handle YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = weddingDate.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    parsed = new Date(year, month, day);
    if (weddingTime) {
      applyTimeToDate(parsed, weddingTime);
    }
    if (!isNaN(parsed.getTime())) return parsed;
  }

  // Fallback 30 days in future if parsing fails
  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 30);
  return fallback;
}

function applyTimeToDate(d: Date, timeStr: string) {
  const matchTime = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (matchTime) {
    let hours = parseInt(matchTime[1], 10);
    const minutes = parseInt(matchTime[2], 10);
    const ampm = matchTime[3] ? matchTime[3].toUpperCase() : null;

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    d.setHours(hours, minutes, 0, 0);
  }
}
