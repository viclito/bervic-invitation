"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function setProfileHasDetailsCache(hasDetails: boolean) {
  if (typeof window === "undefined") return;
  if (hasDetails) {
    localStorage.setItem("bervic_user_has_details", "true");
    document.cookie = "bervic_user_has_details=true; path=/; max-age=2592000; SameSite=Lax";
  } else {
    localStorage.setItem("bervic_user_has_details", "false");
    document.cookie = "bervic_user_has_details=false; path=/; max-age=0; SameSite=Lax";
  }
}

export function readProfileHasDetailsCache(): boolean | null {
  if (typeof window === "undefined") return null;
  
  const localVal = localStorage.getItem("bervic_user_has_details");
  if (localVal === "true") return true;
  if (localVal === "false") return false;

  const cookieMatch = document.cookie.match(/(?:^|; )bervic_user_has_details=(true|false)/);
  if (cookieMatch) {
    const val = cookieMatch[1] === "true";
    localStorage.setItem("bervic_user_has_details", cookieMatch[1]);
    return val;
  }
  return null;
}

export function useRequireLoginAndDetails(callbackUrl: string = "/templates") {
  const { status } = useSession();
  const router = useRouter();

  const [checkingDetails, setCheckingDetails] = useState(true);
  const [hasCompletedDetails, setHasCompletedDetails] = useState(() => {
    const cached = readProfileHasDetailsCache();
    return cached === true;
  });

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    let isMounted = true;

    // Verify event profile in database without premature redirection
    fetch("/api/user/event-draft")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const draft = data.draft;
        const hasDbDetails = Boolean(
          draft &&
            (draft.id ||
              draft.hostNameOne ||
              draft.hostNameTwo ||
              draft.eventDate ||
              draft.weddingDate ||
              draft.venueName ||
              draft.venuePlace ||
              draft.rsvpContact ||
              draft.contactPhone ||
              draft.eventTitle ||
              draft.coupleInitials)
        );

        if (hasDbDetails) {
          setProfileHasDetailsCache(true);
          setHasCompletedDetails(true);
        } else {
          // No saved profile -> update cache to false & redirect to details form
          setProfileHasDetailsCache(false);
          setHasCompletedDetails(false);
          router.replace("/?redirectFromTemplates=true#details-form");
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const currentCache = readProfileHasDetailsCache();
        if (currentCache === true) {
          setHasCompletedDetails(true);
        } else {
          setHasCompletedDetails(false);
          router.replace("/?redirectFromTemplates=true#details-form");
        }
      })
      .finally(() => {
        if (isMounted) {
          setCheckingDetails(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [status, router, callbackUrl]);

  return {
    isLoading: status === "loading" || checkingDetails,
    isAuthenticated: status === "authenticated",
    hasCompletedDetails,
  };
}
