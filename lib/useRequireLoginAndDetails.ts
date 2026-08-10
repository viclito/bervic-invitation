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

  // Instant Cookie + LocalStorage cache check for 0ms loading delay
  const [checkingDetails, setCheckingDetails] = useState(() => {
    const cached = readProfileHasDetailsCache();
    return cached === null; // Only true on first-time uncached check
  });

  const [hasCompletedDetails, setHasCompletedDetails] = useState(() => {
    const cached = readProfileHasDetailsCache();
    return cached === true;
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (status === "authenticated") {
      const cached = readProfileHasDetailsCache();
      
      // If cache explicitly says false, redirect instantly without delay
      if (cached === false) {
        setHasCompletedDetails(false);
        setCheckingDetails(false);
        router.replace("/#details-form");
        return;
      }

      // Quiet background sync with database to keep cache fresh
      fetch("/api/user/event-draft")
        .then((res) => res.json())
        .then((data) => {
          const draft = data.draft;
          const hasDbDetails = Boolean(
            draft && (draft.hostNameOne || draft.eventDate || draft.venueName || draft.rsvpContact || draft.eventTitle)
          );

          if (hasDbDetails) {
            setProfileHasDetailsCache(true);
            setHasCompletedDetails(true);
            setCheckingDetails(false);
          } else {
            // No saved profile -> update cache to false & redirect
            setProfileHasDetailsCache(false);
            setHasCompletedDetails(false);
            setCheckingDetails(false);
            router.replace("/#details-form");
          }
        })
        .catch(() => {
          const currentCache = readProfileHasDetailsCache();
          if (currentCache === true) {
            setHasCompletedDetails(true);
            setCheckingDetails(false);
          } else {
            setCheckingDetails(false);
            router.replace("/#details-form");
          }
        });
    }
  }, [status, router, callbackUrl]);

  return {
    isLoading: status === "loading" ? true : checkingDetails,
    isAuthenticated: status === "authenticated",
    hasCompletedDetails,
  };
}
