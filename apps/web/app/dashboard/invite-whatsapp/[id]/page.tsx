"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GuestRsvpShadcnPage from "@/components/dashboard/GuestRsvpShadcnPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function InviteWhatsAppPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [invitation, setInvitation] = useState<{
    id: string;
    slug: string;
    partnerOne: string;
    partnerTwo: string;
    weddingDate: string;
    venuePlace: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/invitations/my-invitations")
      .then((res) => res.json())
      .then((data) => {
        if (data.invitations && Array.isArray(data.invitations)) {
          const found = data.invitations.find((inv: { id: string }) => inv.id === id);
          if (found) {
            setInvitation(found);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load invitation for WhatsApp page:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-[#7A1F2B] font-bold text-sm">
          <Sparkles className="w-5 h-5 animate-spin mr-2" /> Loading WhatsApp & Guest Engine...
        </main>
        <Footer />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#221C17]">Invitation Not Found</h1>
          <p className="text-xs text-[#221C17]/70 mt-1 max-w-sm">
            We could not find the invitation associated with this link. It may have been deleted or moved.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-5 px-6 py-2.5 rounded-xl bg-[#7A1F2B] text-[#F8F3EA] text-xs font-bold shadow-xs hover:bg-[#9B2C3B] transition-all"
          >
            Back to Dashboard
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-0 sm:px-8 pt-24 sm:pt-28 pb-16 space-y-4 sm:space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="hidden sm:flex items-center justify-between pb-3 border-b border-slate-100">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <span className="text-xs font-medium text-slate-400">
            Dashboard / Invitations / {invitation.partnerOne} & {invitation.partnerTwo}
          </span>
        </div>

        {/* Full Shadcn UI WhatsApp & Guest RSVP Engine */}
        <GuestRsvpShadcnPage
          invitationId={invitation.id}
          invitationSlug={invitation.slug}
          partnerOne={invitation.partnerOne}
          partnerTwo={invitation.partnerTwo}
          weddingDate={invitation.weddingDate}
          venuePlace={invitation.venuePlace}
        />
      </main>
      <Footer />
    </div>
  );
}
