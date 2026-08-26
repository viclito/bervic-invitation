export type UserRole = "USER" | "SUB_ADMIN" | "ADMIN" | "SUPER_ADMIN";

export type PlanType = "NONE" | "BASIC_599" | "PRO_1799" | "CINEMATIC_2000";

export type EventType =
  | "WEDDING"
  | "BIRTHDAY"
  | "ANNIVERSARY"
  | "HOUSEWARMING"
  | "POOJA"
  | (string & {});

export type GuestStatus = "PENDING" | "ATTENDING" | "DECLINED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "COD" | "FAILED";

export interface UserDraftDetailsData {
  id?: string;
  userId?: string;
  profileName?: string | null;
  isActive?: boolean;
  eventType?: EventType;
  hostNameOne?: string | null;
  hostNameTwo?: string | null;
  coupleInitials?: string | null;
  eventTitle?: string | null;
  inviteLine?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  venueName?: string | null;
  venueAddress?: string | null;
  venueMapUrl?: string | null;
  venueTwoName?: string | null;
  venueTwoAddress?: string | null;
  venueTwoMapUrl?: string | null;
  locationsJson?: string | null;
  locations?: any[];
  tagline?: string | null;
  turningAge?: string | null;
  dressCode?: string | null;
  rsvpContact?: string | null;
  loveStoryText?: string | null;
  loveStoryVideoUrl?: string | null;
  coverImage?: string | null;
  coupleImage?: string | null;
  partnerTwoImage?: string | null;
  venueImage?: string | null;
  galleryImagesJson?: string | null;
  functionsJson?: string | null;
  functions?: any[];
  dayTimelineJson?: string | null;
  timelineItems?: any[];
  additionalNotes?: string | null;
  completedFields?: string | null;
  currentStep?: number;
  isComplete?: boolean;
}

export interface GuestData {
  id: string;
  invitationId: string;
  name: string;
  phone: string;
  email?: string | null;
  status: GuestStatus;
  plusOnes: number;
  dietaryNotes?: string | null;
  uniqueCode: string;
  whatsappSentAt?: string | null;
  reminderSentAt?: string | null;
  createdAt: string;
}

export interface LocationItem {
  id?: string;
  title: string;
  venueName: string;
  address: string;
  mapUrl?: string;
  time?: string;
}

export interface TimelineItem {
  id?: string;
  time: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface SubEventItem {
  id?: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  dressCode?: string;
}
