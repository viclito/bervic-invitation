"use client";

import { useEffect } from "react";

export default function AutoScrollToForm() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAndScroll = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const isRedirected =
        searchParams.get("redirectFromTemplates") === "true" ||
        searchParams.get("fromTemplates") === "true" ||
        window.location.hash.includes("details-form");

      if (!isRedirected) return;

      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const el = document.getElementById("details-form");
        if (el) {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(el, { offset: -80 });
          } else {
            const rect = el.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            window.scrollTo({
              top: Math.max(0, rect.top + scrollTop - 80),
              behavior: "smooth",
            });
          }
          if (attempts > 5) clearInterval(interval);
        } else if (attempts > 35) {
          clearInterval(interval);
        }
      }, 100);
    };

    checkAndScroll();
  }, []);

  return null;
}
