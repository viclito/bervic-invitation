import { Metadata } from "next";
import ScrollScrubberTemplate from "@/components/templates/scroll-scrubber/ScrollScrubberTemplate";

export const metadata: Metadata = {
  title: "Terance & Ancy | Premium Scroll Wedding Invitation",
  description:
    "Experience a luxury 480-frame scroll-scrubbing wedding invitation for Terance & Ancy.",
};

export default function ScrollScrubberPage() {
  return (
    <ScrollScrubberTemplate
      templateSlug="scroll-scrubber"
      partnerOne="Terance"
      partnerTwo="Ancy"
      tagline="TOGETHER WITH THEIR FAMILIES"
      inviteLine="Request the honor of your presence as they exchange sacred vows of love"
      weddingDate="December 18, 2026"
      weddingTime="4:00 PM Onwards"
    />
  );
}
