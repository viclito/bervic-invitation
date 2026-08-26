import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface UserInvitationItem {
  id: string;
  slug: string;
  templateSlug?: string;
  partnerOne?: string;
  partnerTwo?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  status?: string;
  locationsJson?: string;
  eventsJson?: string;
  galleryImagesJson?: string;
  createdAt: string;
}

export function useMyInvitations() {
  return useQuery<UserInvitationItem[]>({
    queryKey: ["my-invitations"],
    queryFn: async () => {
      const res = await api.get<any>("/api/invitations/my-invitations");
      if (res?.invitations && Array.isArray(res.invitations)) {
        return res.invitations;
      }
      if (Array.isArray(res)) {
        return res;
      }
      return [];
    },
  });
}
