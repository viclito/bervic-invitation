export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1059240449093088";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

// Track standard PageView
export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

// Track custom / standard event
export const event = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", name, options);
  }
};

// Standard e-commerce events
export const trackViewContent = (contentName: string, contentCategory?: string, value?: number) => {
  event("ViewContent", {
    content_name: contentName,
    content_category: contentCategory || "Invitation Template",
    value: value || 0,
    currency: "INR",
  });
};

export const trackInitiateCheckout = (value: number, numItems: number = 1) => {
  event("InitiateCheckout", {
    value: value,
    currency: "INR",
    num_items: numItems,
  });
};

export const trackPurchase = (value: number, orderId?: string) => {
  event("Purchase", {
    value: value,
    currency: "INR",
    content_type: "product",
    order_id: orderId,
  });
};

export const trackLead = (leadType: string = "WhatsApp Inquiry") => {
  event("Lead", {
    content_name: leadType,
  });
};
