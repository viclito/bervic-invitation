import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { UserDraftDetailsData } from "@bervic/shared";

export function useEventDraft(profileId?: string) {
  return useQuery<UserDraftDetailsData>({
    queryKey: ["event-draft", profileId || "active"],
    queryFn: async () => {
      const endpoint = profileId
        ? `/api/user/event-draft?id=${profileId}`
        : "/api/user/event-draft";
      const res = await api.get<any>(endpoint);
      return (res?.draft || res) as UserDraftDetailsData;
    },
  });
}

export function useUserProfiles() {
  return useQuery<UserDraftDetailsData[]>({
    queryKey: ["user-profiles"],
    queryFn: async () => {
      const res = await api.get<any>("/api/user/event-draft?all=true");
      if (res?.profiles && Array.isArray(res.profiles)) {
        return res.profiles;
      }
      if (res?.draft) {
        return [res.draft];
      }
      return [];
    },
  });
}

export function useUpdateEventDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserDraftDetailsData>) => {
      const res = await api.post<any>("/api/user/event-draft", data);
      return (res?.draft || res) as UserDraftDetailsData;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["event-draft", "active"], updated);
      queryClient.invalidateQueries({ queryKey: ["event-draft"] });
      queryClient.invalidateQueries({ queryKey: ["user-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
    },
  });
}
