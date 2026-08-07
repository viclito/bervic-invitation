export interface WeddingEvent {
  icon?: string;
  title: string;
  time: string;
  date: string;
}

export interface TimelineStep {
  order: number;
  icon?: string;
  title: string;
  time: string;
  date?: string;
  status?: "upcoming" | "live" | "done";
}

export interface LocationVenue {
  name: string;
  venueLabel: string;
  address: string;
  mapLink: string;
  image: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  youtube?: string;
}

export interface TemplateClassicFloralProps {
  coupleInitials: string;
  partnerOne: string;
  partnerTwo: string;
  tagline: string;
  inviteLine: string;
  weddingDate: string; // ISOString format e.g. "2026-11-28T10:30:00.000Z"
  weddingTime: string;
  heroImage: string;
  coupleImage: string;
  partnerTwoImage?: string;
  venuePlace: string;
  events: WeddingEvent[];
  timelineDay: TimelineStep[];
  loveStoryText: string;
  loveStoryVideoUrl: string;
  showVideoSection?: boolean;
  locations: LocationVenue[];
  galleryImages: string[];
  contactPhone: string;
  contactAddress: string;
  socialLinks: SocialLinks;
  isCustomizer?: boolean;
  guestName?: string;
  guestPhone?: string;
  invitationId?: string;
  slug?: string;
}

