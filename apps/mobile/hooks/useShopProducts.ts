import { useQuery } from "@tanstack/react-query";
import { api, getBaseUrl } from "../lib/api";

export interface ShopProductItem {
  id: string;
  name: string;
  category: string;
  pricePerCard: number;
  minCopies: number;
  previewImage: string;
  galleryImages?: string | null;
  badge?: string | null;
  paperType: string;
  dimensions: string;
  description: string;
  featuresJson?: string;
  canvaTemplateId?: string | null;
  rating: number;
  reviewsCount: number;
}

export function useShopProducts(mainTab: "invitations" | "return_gifts" = "invitations", category?: string) {
  return useQuery<ShopProductItem[]>({
    queryKey: ["shop-products", mainTab, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        mainTab,
        limit: "50",
      });
      if (category && category !== "all") {
        params.append("category", category);
      }

      const res = await api.get<any>(`/api/shop/products?${params.toString()}`);
      if (res?.products && Array.isArray(res.products) && res.products.length > 0) {
        const baseUrl = getBaseUrl();
        return res.products.map((p: any) => ({
          ...p,
          previewImage: p.previewImage?.startsWith("http")
            ? p.previewImage
            : `${baseUrl}${p.previewImage?.startsWith("/") ? "" : "/"}${p.previewImage || "images/shop/sample1.webp"}`,
        }));
      }
      return [];
    },
  });
}

