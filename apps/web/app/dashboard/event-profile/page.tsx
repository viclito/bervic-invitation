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
  const eventTypeParam = searchParams.get("eventType") || undefined;
  const returnToTemplate = searchParams.get("returnToTemplate") || searchParams.get("template") || undefined;
  const isNewProfile = searchParams.get("new") === "true";
  const fromTab = searchParams.get("from") || searchParams.get("tab") || (invitationId ? "invitations" : "profiles");

  const handleFinished = () => {
    if (returnToTemplate) {
      router.push(`/templates/${returnToTemplate}`);
    } else {
      router.push(`/dashboard?tab=${fromTab}`);
    }
  };

  return (
    <div className="min-h-screen bg-white sm:bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-4 pt-20 sm:pt-28 md:pt-32 pb-16">
        {/* Dedicated Event Profile Wizard */}
        <QuickStartDetailsWizard
          profileId={profileId}
          invitationId={invitationId}
          isNewProfile={isNewProfile}
          initialEventType={eventTypeParam}
          startAtStepOne={false}
          onClose={handleFinished}
          onComplete={handleFinished}
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
        <div className="min-h-screen bg-white sm:bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#991B1B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EventProfileContent />
    </Suspense>
  );
}
