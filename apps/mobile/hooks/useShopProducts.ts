import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface ShopProductItem {
  id: string;
  name: string;
  category: string;
  pricePerCard: number;
  minCopies: number;
  previewImage: string;
  badge?: string | null;
  paperType: string;
  dimensions: string;
  description: string;
  rating: number;
  reviewsCount: number;
}

export function useShopProducts(category?: string) {
  return useQuery<ShopProductItem[]>({
    queryKey: ["shop-products", category],
    queryFn: async () => {
      const url = category && category !== "all"
        ? `/api/shop/products?category=${category}&limit=50`
        : `/api/shop/products?limit=50`;

      const res = await api.get<any>(url);
      if (res?.products && Array.isArray(res.products) && res.products.length > 0) {
        return res.products;
      }
      // Fallback luxury products
      return [
        {
          id: "prod_1",
          name: "Imperial Gold Foil Royal Card",
          category: "royal",
          pricePerCard: 65,
          minCopies: 50,
          previewImage: "/images/shop/sample1.webp",
          badge: "BESTSELLER",
          paperType: "350 GSM Textured Metallic Gold Cardstock",
          dimensions: "5.5 x 8.5 inches",
          description: "Handcrafted with hot-stamped gold foil and debossed royal monogram.",
          rating: 5.0,
          reviewsCount: 42,
        },
        {
          id: "prod_2",
          name: "Velvet Crimson Royal Invite",
          category: "velvet",
          pricePerCard: 85,
          minCopies: 50,
          previewImage: "/images/shop/sample2.webp",
          badge: "ROYAL LUXE",
          paperType: "350 GSM Velvet Soft-Touch Cardstock",
          dimensions: "5.5 x 8.5 inches",
          description: "Ultra-luxury crimson velvet feel with raised metallic rose gold typography.",
          rating: 4.9,
          reviewsCount: 68,
        },
        {
          id: "prod_3",
          name: "Handcrafted Deckle Floral",
          category: "floral",
          pricePerCard: 72,
          minCopies: 50,
          previewImage: "/images/shop/sample3.webp",
          badge: "HANDMADE",
          paperType: "300 GSM Deckle-Edge Cotton Paper",
          dimensions: "5.0 x 7.0 inches",
          description: "Handmade botanical deckled edge card with custom pressed petals.",
          rating: 5.0,
          reviewsCount: 29,
        },
        {
          id: "prod_4",
          name: "Minimalist Modern Monogram",
          category: "modern",
          pricePerCard: 55,
          minCopies: 50,
          previewImage: "/images/shop/sample4.webp",
          badge: "POPULAR",
          paperType: "350 GSM Matte Pearl Cardstock",
          dimensions: "5.5 x 8.5 inches",
          description: "Crisp architectural typography on matte pearl shimmer board.",
          rating: 4.8,
          reviewsCount: 53,
        },
      ];
    },
  });
}
