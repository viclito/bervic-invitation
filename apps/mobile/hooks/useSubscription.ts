import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface SubscriptionData {
  plan: string;
  isActive: boolean;
  allowedTemplatesCount: number;
  allowedCardsCount: number;
  usedTemplatesCount: number;
  usedCardsCount: number;
  remainingTemplateSlots: number;
  remainingCardSlots: number;
}

export function useSubscription() {
  return useQuery<SubscriptionData>({
    queryKey: ["user-subscription"],
    queryFn: async () => {
      return await api.get<SubscriptionData>("/api/user/subscription");
    },
  });
}
