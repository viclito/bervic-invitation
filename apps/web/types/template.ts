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
  desc?: string;
  status?: "upcoming" | "live" | "done";
}

export interface LocationVenue {
  name: string;
  venueLabel: string;
  address: string;
  mapLink: string;
  image: string;
  contact?: string;
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
  groomName?: string;
  brideName?: string;
  tagline: string;
  inviteLine: string;
  weddingDate: string; // ISOString format e.g. "2026-11-28T10:30:00.000Z"
  weddingTime: string;
  targetDate?: string;
  heroImage: string;
  coupleImage: string;
  coverImage?: string;
  partnerTwoImage?: string;
  groomImage?: string;
  brideImage?: string;
  venuePlace: string;
  events: WeddingEvent[];
  timelineDay: TimelineStep[];
  loveStoryText: string;
  loveStoryVideoUrl: string;
  showVideoSection?: boolean;
  welcomeMessage?: string;
  locations: LocationVenue[];
  galleryImages: string[];
  contactPhone: string;
  contactAddress: string;
  socialLinks: SocialLinks;
  isCustomizer?: boolean;
  isPreview?: boolean;
  guestName?: string;
  guestPhone?: string;
  invitationId?: string;
  celebrantName?: string;
  turningAge?: string;
  slug?: string;
}
