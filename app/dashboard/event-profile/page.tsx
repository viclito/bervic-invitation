"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuickStartDetailsWizard from "@/components/QuickStartDetailsWizard";

function EventProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const profileId = searchParams.get("id") || undefined;
  const invitationId = searchParams.get("invitationId") || undefined;
  const isNewProfile = searchParams.get("new") === "true";
  const fromTab = searchParams.get("from") || searchParams.get("tab") || (invitationId ? "invitations" : "profiles");

  return (
    <div className="min-h-screen bg-white sm:bg-[#FDF6F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-4 pt-20 sm:pt-28 md:pt-32 pb-16">
        {/* Dedicated Event Profile Wizard */}
        <QuickStartDetailsWizard
          profileId={profileId}
          invitationId={invitationId}
          isNewProfile={isNewProfile}
          startAtStepOne={false}
          onClose={() => router.push(`/dashboard?tab=${fromTab}`)}
          onComplete={() => router.push(`/dashboard?tab=${fromTab}`)}
        />
      </main>

      <Footer />
    </div>
  );
}

export default function EventProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white sm:bg-[#FDF6F0] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#7A1F2B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EventProfileContent />
    </Suspense>
  );
}
