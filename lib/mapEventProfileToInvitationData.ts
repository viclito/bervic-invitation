import { sampleWeddingData } from "@/data/sampleWeddingData";
import { TemplateClassicFloralProps, WeddingEvent, LocationVenue } from "@/types/template";
import { formatDateForDisplay } from "@/lib/dateUtils";

export interface UserEventDraft {
  id?: string;
  hostNameOne?: string;
  hostNameTwo?: string;
  coupleInitials?: string;
  eventType?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  venueMapUrl?: string;
  venueTwoName?: string;
  venueTwoAddress?: string;
  venueTwoMapUrl?: string;
  locationsJson?: string;
  locations?: unknown[];
  welcomeMessage?: string;
  inviteLine?: string;
  loveStoryText?: string;
  loveStoryVideoUrl?: string;
  videoUrl?: string;
  coverPhoto?: string;
  coverImage?: string;
  couplePhoto?: string;
  coupleImage?: string;
  partnerTwoImage?: string;
  venueImage?: string;
  galleryImagesJson?: string;
  galleryImages?: string[] | string;
  scheduleFunctions?: string | unknown[];
  functionsJson?: string;
  familyMembers?: string | unknown[];
  contactPhone?: string;
  rsvpDeadline?: string;
  showVideo?: boolean;
  showVideoSection?: boolean;
  completedFields?: string[] | string;
}

interface ScheduleItem {
  icon?: string;
  title?: string;
  name?: string;
  time?: string;
  date?: string;
}

export function mapEventProfileToInvitationData(
  draft: UserEventDraft | null | undefined,
  baseData: TemplateClassicFloralProps = sampleWeddingData
): TemplateClassicFloralProps {
  if (!draft) return baseData;

  const partnerOne = draft.hostNameOne?.trim() || baseData.partnerOne;
  const partnerTwo = draft.hostNameTwo?.trim() || baseData.partnerTwo;

  const defaultInitials =
    partnerOne && partnerTwo
      ? `${partnerOne[0]?.toUpperCase() || "A"} & ${partnerTwo[0]?.toUpperCase() || "S"}`
      : baseData.coupleInitials;

  const coupleInitials = draft.coupleInitials?.trim() || defaultInitials;

  // Format display date
  const rawDate = draft.eventDate?.trim();
  const weddingDate = rawDate ? formatDateForDisplay(rawDate, baseData.weddingDate) : baseData.weddingDate;

  const weddingTime = draft.eventTime?.trim()
    ? `${draft.eventDate ? `${formatDateForDisplay(draft.eventDate)} at ` : ""}${draft.eventTime}`
    : baseData.weddingTime;

  const venuePlace = draft.venueName?.trim()
    ? `${draft.venueName}${draft.venueAddress ? `, ${draft.venueAddress}` : ""}`
    : baseData.venuePlace;

  // Images: handle coverImage/coverPhoto and coupleImage/couplePhoto
  const heroImage =
    draft.coverImage && draft.coverImage.trim() !== ""
      ? draft.coverImage
      : draft.coverPhoto && draft.coverPhoto.trim() !== ""
      ? draft.coverPhoto
      : baseData.heroImage;

  const coupleImage =
    draft.coupleImage && draft.coupleImage.trim() !== ""
      ? draft.coupleImage
      : draft.couplePhoto && draft.couplePhoto.trim() !== ""
      ? draft.couplePhoto
      : baseData.coupleImage;

  const partnerTwoImage =
    draft.partnerTwoImage && draft.partnerTwoImage.trim() !== ""
      ? draft.partnerTwoImage
      : baseData.partnerTwoImage;

  // Love Story Video URL & Video Section Visibility
  let isShowVideoExplicit = true;
  if (draft) {
    if (
      (draft as Record<string, unknown>).showVideo === false ||
      (draft as Record<string, unknown>).showVideoSection === false
    ) {
      isShowVideoExplicit = false;
    }
    if (draft.completedFields) {
      try {
        const fields =
          typeof draft.completedFields === "string"
            ? JSON.parse(draft.completedFields)
            : draft.completedFields;
        if (Array.isArray(fields) && fields.includes("showVideo:false")) {
          isShowVideoExplicit = false;
        }
      } catch {}
    }
  }

  const isVideoEnabled =
    isShowVideoExplicit &&
    Boolean(
      (draft?.loveStoryVideoUrl && draft.loveStoryVideoUrl.trim() !== "") ||
        (draft?.videoUrl && draft.videoUrl.trim() !== "")
    );

  const loveStoryVideoUrl = isVideoEnabled
    ? draft?.loveStoryVideoUrl?.trim() || draft?.videoUrl?.trim() || ""
    : "";

  const showVideoSection = isVideoEnabled;

  // Gallery images
  let galleryImages = baseData.galleryImages;
  if (draft.galleryImagesJson) {
    try {
      const parsed = JSON.parse(draft.galleryImagesJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        galleryImages = parsed;
      }
    } catch {
      // Fallback
    }
  } else if (Array.isArray(draft.galleryImages) && draft.galleryImages.length > 0) {
    galleryImages = draft.galleryImages as string[];
  }

  // Locations / Venues
  let locations: LocationVenue[] = baseData.locations;

  const rawLocations = draft.locationsJson
    ? (() => {
        try {
          const parsed = JSON.parse(draft.locationsJson);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
        } catch {
          return null;
        }
      })()
    : Array.isArray(draft.locations) && draft.locations.length > 0
    ? draft.locations
    : null;

  if (rawLocations) {
    locations = rawLocations.map((locItem: unknown, idx: number) => {
      const item = (locItem || {}) as Record<string, unknown>;
      const mainTitle = typeof item.mainTitle === "string" ? item.mainTitle : "";
      const venueLabel = typeof item.venueLabel === "string" ? item.venueLabel : "";
      const nameStr = typeof item.name === "string" ? item.name : "";

      const title =
        mainTitle.trim() ||
        venueLabel.trim() ||
        nameStr.trim() ||
        (idx === 0 ? draft.venueName?.trim() : draft.venueTwoName?.trim()) ||
        (idx === 0 ? "Marriage Ceremony Venue" : "Grand Reception Venue");

      const addressStr = typeof item.address === "string" ? item.address : "";
      const subLabelStr = typeof item.subLabel === "string" ? item.subLabel : "";

      const addr =
        addressStr.trim() ||
        subLabelStr.trim() ||
        (idx === 0 ? draft.venueAddress?.trim() : draft.venueTwoAddress?.trim()) ||
        baseData.venuePlace;

      const mapUrlStr = typeof item.mapUrl === "string" ? item.mapUrl : "";
      const mapLinkStr = typeof item.mapLink === "string" ? item.mapLink : "";

      const mapLink =
        mapUrlStr.trim() ||
        mapLinkStr.trim() ||
        (idx === 0 ? draft.venueMapUrl : draft.venueTwoMapUrl) ||
        "https://maps.google.com";

      const venuePhotoStr = typeof item.venuePhoto === "string" ? item.venuePhoto : "";
      const photoUrlStr = typeof item.photoUrl === "string" ? item.photoUrl : "";
      const imageStr = typeof item.image === "string" ? item.image : "";
      const defaultVenueFallback =
        idx === 0 ? "/images/templates/venue-ceremony.jpg" : "/images/templates/venue-reception.jpg";

      const userPhoto = venuePhotoStr.trim() || photoUrlStr.trim() || imageStr.trim();
      const img =
        userPhoto && !userPhoto.includes("couple-photo") && !userPhoto.includes("floral-hero")
          ? userPhoto
          : defaultVenueFallback;

      return {
        name: title,
        venueLabel: title,
        address: addr,
        mapLink,
        image: img,
      };
    });
  } else if (draft.venueName || draft.venueAddress) {
    const primaryTitle = draft.venueName?.trim() || "Marriage Ceremony Venue";
    const mainVenue: LocationVenue = {
      name: primaryTitle,
      venueLabel: primaryTitle,
      address: draft.venueAddress?.trim() || draft.venueName?.trim() || baseData.venuePlace,
      mapLink: draft.venueMapUrl || "https://maps.google.com",
      image: "/images/templates/venue-ceremony.jpg",
    };

    if (draft.venueTwoName || draft.venueTwoAddress) {
      const secondaryTitle = draft.venueTwoName?.trim() || "Grand Reception Venue";
      const receptionVenue: LocationVenue = {
        name: secondaryTitle,
        venueLabel: secondaryTitle,
        address: draft.venueTwoAddress?.trim() || draft.venueTwoName?.trim() || "Reception Address",
        mapLink: draft.venueTwoMapUrl || "https://maps.google.com",
        image: "/images/templates/venue-reception.jpg",
      };
      locations = [mainVenue, receptionVenue];
    } else {
      locations = [mainVenue];
    }
  }

  // Schedule / Functions
  let events: WeddingEvent[] = baseData.events;
  const functionsSource = draft.scheduleFunctions || draft.functionsJson;
  if (functionsSource) {
    let parsed: ScheduleItem[] = [];
    if (typeof functionsSource === "string") {
      try {
        parsed = JSON.parse(functionsSource);
      } catch {
        parsed = [];
      }
    } else if (Array.isArray(functionsSource)) {
      parsed = functionsSource as ScheduleItem[];
    }

    if (parsed.length > 0) {
      events = parsed.map((item, idx) => ({
        icon: item.icon || (idx === 0 ? "💍" : idx === 1 ? "🍱" : "✨"),
        title: item.title || item.name || `Function ${idx + 1}`,
        time: item.time || draft.eventTime || "10:00 AM",
        date: item.date ? formatDateForDisplay(item.date) : (draft.eventDate ? formatDateForDisplay(draft.eventDate) : "Nov 28, 2026"),
      }));
    }
  }

  // Timeline Day Items
  let timelineDay = events.map((ev, idx) => ({
    order: idx + 1,
    icon: ev.icon || "✨",
    title: ev.title,
    time: ev.time,
    status: idx === 0 ? ("done" as const) : idx === 1 ? ("live" as const) : ("upcoming" as const),
    desc: ev.date ? `Date: ${ev.date}` : undefined,
  }));

  const timelineSource = (draft as Record<string, unknown>).timelineItems || (draft as Record<string, unknown>).dayTimelineJson;
  if (timelineSource) {
    let parsedTimeline: ScheduleItem[] = [];
    if (typeof timelineSource === "string") {
      try {
        parsedTimeline = JSON.parse(timelineSource);
      } catch {
        parsedTimeline = [];
      }
    } else if (Array.isArray(timelineSource)) {
      parsedTimeline = timelineSource as ScheduleItem[];
    }

    if (parsedTimeline.length > 0) {
      timelineDay = parsedTimeline.map((item, idx) => ({
        order: idx + 1,
        icon: item.icon || (idx === 0 ? "💍" : idx === 1 ? "🍱" : "✨"),
        title: item.title || item.name || `Activity ${idx + 1}`,
        time: item.time || "10:00 AM",
        status: idx === 0 ? ("done" as const) : idx === 1 ? ("live" as const) : ("upcoming" as const),
        desc: (item as Record<string, unknown>).desc
          ? String((item as Record<string, unknown>).desc)
          : item.date
          ? `Date: ${formatDateForDisplay(item.date)}`
          : undefined,
      }));
    }
  }

  const coverImage = draft.coverImage?.trim() || "";

  return {
    ...baseData,
    partnerOne,
    partnerTwo,
    coupleInitials,
    weddingDate,
    weddingTime,
    venuePlace,
    heroImage,
    coupleImage,
    coverImage,
    partnerTwoImage,
    galleryImages,
    inviteLine: draft.welcomeMessage?.trim() || draft.inviteLine?.trim() || baseData.inviteLine,
    loveStoryText: draft.loveStoryText?.trim() || baseData.loveStoryText,
    loveStoryVideoUrl,
    showVideoSection: Boolean(loveStoryVideoUrl),
    locations,
    events,
    timelineDay,
  };
}
