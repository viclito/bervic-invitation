export interface MapLocationInput {
  name?: string;
  venueLabel?: string;
  subLabel?: string;
  address?: string;
  mapLink?: string;
  mapUrl?: string;
}

const GENERIC_EVENT_TERMS = new Set([
  "marry",
  "marriage",
  "wedding",
  "ceremony",
  "reception",
  "dinner",
  "lunch",
  "breakfast",
  "party",
  "celebration",
  "event",
  "holy matrimony",
  "the vows",
  "vows",
  "the ceremony",
  "the reception",
  "the wedding",
  "marriage ceremony",
  "grand reception",
  "marriage ceremony venue",
  "grand reception venue",
  "ceremony hall",
  "reception ballroom",
  "wedding venue",
  "celebration venue",
  "the setting",
  "venue 1",
  "venue 2",
  "address details to be shared",
  "venue address details",
]);

function isGenericTerm(text?: string): boolean {
  if (!text) return true;
  const clean = text.trim().toLowerCase();
  return GENERIC_EVENT_TERMS.has(clean);
}

/**
 * Extracts a search query or coordinates from a user's Google Maps link.
 * Examples:
 * - https://www.google.com/maps/place/Zion+CSI+Church/@8.2541,77.3125,17z -> 8.2541,77.3125
 * - https://maps.google.com/?q=8.2541,77.3125 -> 8.2541,77.3125
 * - https://www.google.com/maps/search/?api=1&query=Zion+Church -> Zion Church
 * - https://www.google.com/maps/place/Zion+CSI+Church -> Zion CSI Church
 */
export function extractQueryFromMapUrl(url?: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // 1. Coordinates in @lat,lng
  const atMatch = cleanUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return `${atMatch[1]},${atMatch[2]}`;

  // 2. Coordinates in q=lat,lng or ll=lat,lng or destination=lat,lng
  const coordMatch = cleanUrl.match(/[?&](?:q|ll|destination|center)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) return `${coordMatch[1]},${coordMatch[2]}`;

  // 3. /place/Place+Name
  const placeMatch = cleanUrl.match(/\/place\/([^/@?#]+)/);
  if (placeMatch) {
    try {
      const place = decodeURIComponent(placeMatch[1].replace(/\+/g, " ")).trim();
      if (place && !/^(-?\d+\.\d+),(-?\d+\.\d+)$/.test(place)) {
        return place;
      }
    } catch {}
  }

  // 4. query=... or q=...
  const queryMatch = cleanUrl.match(/[?&](?:query|q)=([^&]+)/);
  if (queryMatch) {
    try {
      const q = decodeURIComponent(queryMatch[1].replace(/\+/g, " ")).trim();
      if (q) return q;
    } catch {}
  }

  return null;
}

/**
 * Resolves the direct external Google Maps URL for opening in a new tab.
 * 
 * Rules:
 * 1. If Google Maps Link is provided by user (mapLink or mapUrl), open ONLY that exact link!
 *    Does NOT concatenate venue name, venue label, address, or venue place when the link is present.
 * 2. Only if the user did NOT provide Google Maps Link (or it is completely empty or just the bare domain),
 *    fall back to looking up the physical Venue Address and specific Venue Name.
 */
export function resolveDirectMapUrl(
  loc?: MapLocationInput | null,
  fallbackVenuePlace?: string
): string {
  if (!loc) {
    if (fallbackVenuePlace && !isGenericTerm(fallbackVenuePlace)) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackVenuePlace.trim())}`;
    }
    return "https://maps.google.com";
  }

  let rawLink = (loc.mapLink || loc.mapUrl || "").trim();

  // If user entered URL without protocol e.g. "maps.app.goo.gl/..."
  if (
    rawLink &&
    !/^https?:\/\//i.test(rawLink) &&
    (rawLink.includes("goo.gl") || rawLink.includes("google.com") || rawLink.includes("maps"))
  ) {
    rawLink = `https://${rawLink}`;
  }

  // Bare domain checks (generic homepage with no place or directions specified)
  const isGenericBareDomain =
    rawLink === "https://maps.google.com" ||
    rawLink === "https://maps.google.com/" ||
    rawLink === "http://maps.google.com" ||
    rawLink === "http://maps.google.com/" ||
    rawLink === "https://www.google.com/maps" ||
    rawLink === "https://www.google.com/maps/" ||
    rawLink === "http://www.google.com/maps" ||
    rawLink === "http://www.google.com/maps/";

  // 1. If user provided a specific Google Maps link, open ONLY that link!
  if (rawLink && !isGenericBareDomain && !rawLink.includes("output=embed")) {
    return rawLink;
  }

  // 2. Fallback: ONLY if user didn't provide Google Maps Link, look for Venue Address / Venue Name
  const addressText = (loc.address || "").trim();
  const subLabelText = (loc.subLabel || "").trim();
  const nameText = (loc.name || "").trim();
  const venueLabelText = (loc.venueLabel || "").trim();

  const rawParts: string[] = [];
  if (addressText && !isGenericTerm(addressText)) rawParts.push(addressText);
  if (subLabelText && !isGenericTerm(subLabelText)) rawParts.push(subLabelText);
  if (nameText && !isGenericTerm(nameText)) rawParts.push(nameText);
  if (venueLabelText && !isGenericTerm(venueLabelText)) rawParts.push(venueLabelText);
  if (fallbackVenuePlace && !isGenericTerm(fallbackVenuePlace)) rawParts.push(fallbackVenuePlace.trim());

  const uniqueParts: string[] = [];
  for (const part of rawParts) {
    if (!uniqueParts.some((u) => u.toLowerCase() === part.toLowerCase())) {
      uniqueParts.push(part);
    }
  }

  const query = uniqueParts.join(", ") || addressText || fallbackVenuePlace?.trim();
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  return "https://maps.google.com";
}

/**
 * Resolves an iframe embed URL for displaying Google Maps on page.
 */
export function resolveEmbedMapUrl(
  loc?: MapLocationInput | null,
  fallbackVenuePlace?: string
): string {
  const rawLink = (loc?.mapLink || loc?.mapUrl || "").trim();
  if (rawLink && (rawLink.includes("output=embed") || rawLink.includes("/embed"))) {
    return rawLink;
  }

  // 1. If user provided a Google Maps link, try to extract coordinates or place name
  const extracted = extractQueryFromMapUrl(rawLink);
  if (extracted) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(extracted)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }

  // 2. Fallback: physical address first, then non-generic venue names
  const addressText = (loc?.address || "").trim();
  const subLabelText = (loc?.subLabel || "").trim();
  const nameText = (loc?.name || "").trim();
  const venueLabelText = (loc?.venueLabel || "").trim();

  const rawParts: string[] = [];
  if (addressText && !isGenericTerm(addressText)) rawParts.push(addressText);
  if (subLabelText && !isGenericTerm(subLabelText)) rawParts.push(subLabelText);
  if (nameText && !isGenericTerm(nameText)) rawParts.push(nameText);
  if (venueLabelText && !isGenericTerm(venueLabelText)) rawParts.push(venueLabelText);
  if (fallbackVenuePlace && !isGenericTerm(fallbackVenuePlace)) rawParts.push(fallbackVenuePlace.trim());

  const uniqueParts: string[] = [];
  for (const part of rawParts) {
    if (!uniqueParts.some((u) => u.toLowerCase() === part.toLowerCase())) {
      uniqueParts.push(part);
    }
  }

  const query = uniqueParts.join(", ") || addressText || fallbackVenuePlace?.trim() || "Wedding Venue";

  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}
