import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { GuestData } from "@bervic/shared";

export interface GuestStats {
  totalGuests: number;
  attending: number;
  declined: number;
  pending: number;
  totalPlusOnes: number;
  totalAttendingPeople: number;
  responseRate: number;
}

export interface GuestsResponse {
  guests: GuestData[];
  stats: GuestStats;
}

export function useGuests(invitationId?: string) {
  const targetId = invitationId || "default";

  return useQuery<GuestsResponse>({
    queryKey: ["guests", targetId],
    queryFn: async () => {
      const res = await api.get<any>(`/api/invitations/${targetId}/guests`);
      if (res?.guests) {
        return res;
      }
      if (Array.isArray(res)) {
        return {
          guests: res,
          stats: {
            totalGuests: res.length,
            attending: res.filter((g) => g.status === "ATTENDING").length,
            declined: res.filter((g) => g.status === "DECLINED").length,
            pending: res.filter((g) => g.status === "PENDING").length,
            totalPlusOnes: 0,
            totalAttendingPeople: res.length,
            responseRate: 0,
          },
        };
      }
      return {
        guests: [],
        stats: {
          totalGuests: 0,
          attending: 0,
          declined: 0,
          pending: 0,
          totalPlusOnes: 0,
          totalAttendingPeople: 0,
          responseRate: 0,
        },
      };
    },
    enabled: true,
  });
}

export function useAddGuest(invitationId?: string) {
  const queryClient = useQueryClient();
  const targetId = invitationId || "default";

  return useMutation({
    mutationFn: async (guest: {
      name: string;
      phone: string;
      email?: string;
      status?: string;
      plusOnes?: number;
      dietaryNotes?: string;
    }) => {
      return await api.post(`/api/invitations/${targetId}/guests`, guest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
}

export function useUpdateGuest(invitationId?: string) {
  const queryClient = useQueryClient();
  const targetId = invitationId || "default";

  return useMutation({
    mutationFn: async (guest: {
      guestId: string;
      name: string;
      phone: string;
      email?: string;
      status?: string;
      plusOnes?: number;
      dietaryNotes?: string;
    }) => {
      return await api.put(`/api/invitations/${targetId}/guests`, guest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
}

export function useDeleteGuest(invitationId?: string) {
  const queryClient = useQueryClient();
  const targetId = invitationId || "default";

  return useMutation({
    mutationFn: async (guestId: string) => {
      return await api.delete(`/api/invitations/${targetId}/guests?guestId=${guestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
}
