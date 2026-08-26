import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface CanvaElement {
  id: string;
  type: "text" | "image" | "shape" | "monogram";
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: "left" | "center" | "right";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  scale?: number;
  zIndex?: number;
  imageUrl?: string;
  opacity?: number;
  letterSpacing?: number;
}

export interface CanvaTemplate {
  id: string;
  dbId?: string;
  name: string;
  topic?: string;
  category?: string;
  pricePerCard?: number;
  paperType?: string;
  previewImage?: string;
  aspectRatio?: string;
  backgroundColor: string;
  backgroundImage?: string;
  elements: CanvaElement[];
}

export function useCanvaTemplates() {
  return useQuery<CanvaTemplate[]>({
    queryKey: ["canva-templates"],
    queryFn: async () => {
      const res = await api.get<any>("/api/canva/templates");
      if (res?.templates && Array.isArray(res.templates)) {
        return res.templates;
      }
      return [];
    },
  });
}
