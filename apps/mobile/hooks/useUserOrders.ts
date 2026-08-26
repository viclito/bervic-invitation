import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface OrderItem {
  id: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  orderStatus: string;
  paymentStatus: string;
  items?: any[];
  shippingAddress?: string;
  createdAt: string;
}

export type UserOrder = OrderItem;

export function useUserOrders() {
  return useQuery<OrderItem[]>({
    queryKey: ["user-orders"],
    queryFn: async () => {
      const res = await api.get<any>("/api/user/orders");
      if (res?.orders && Array.isArray(res.orders)) {
        return res.orders;
      }
      return [];
    },
  });
}
