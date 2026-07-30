import { TemplateClassicFloralProps } from "@/types/template";
import Navbar from "./Navbar";
import Hero from "./Hero";
import CountdownTimer from "./CountdownTimer";
import WeddingEvents from "./WeddingEvents";
import Timeline from "./Timeline";
import LoveStoryVideoFacade from "./LoveStoryVideoFacade";
import Locations from "./Locations";
import GalleryCarousel from "./GalleryCarousel";
import RsvpSection from "./RsvpSection";
import PersonalizedEnvelopeCover from "./PersonalizedEnvelopeCover";
import Footer from "./Footer";

export default function TemplateClassicFloral(props: TemplateClassicFloralProps) {
  return (
    <div className="min-h-screen bg-[#FDF6F3] text-[#2B2320] font-sans selection:bg-[#B85C6B] selection:text-[#FDF6F3] relative">
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={props.partnerOne}
        partnerTwo={props.partnerTwo}
        weddingTime={props.weddingTime}
        isCustomizer={props.isCustomizer}
      />

      {/* Fixed/Sticky Navigation */}

      <Navbar coupleInitials={props.coupleInitials} isCustomizer={props.isCustomizer} />

      {/* Section 1: Hero */}
      <Hero
        partnerOne={props.partnerOne}
        partnerTwo={props.partnerTwo}
        tagline={props.tagline}
        inviteLine={props.inviteLine}
        weddingTime={props.weddingTime}
        heroImage={props.heroImage}
      />

      {/* Section 2: Countdown Timer & Couple Photo */}
      <CountdownTimer
        weddingDate={props.weddingDate}
        coupleImage={props.coupleImage}
        partnerOne={props.partnerOne}
        partnerTwo={props.partnerTwo}
      />

      {/* Section 3: Wedding Events */}
      <WeddingEvents events={props.events} />

      {/* Section 4: Event Day Timeline */}
      <Timeline timelineDay={props.timelineDay} />

      {/* Section 5: Our Love Story & Video Facade */}
      <LoveStoryVideoFacade
        loveStoryText={props.loveStoryText}
        loveStoryVideoUrl={props.loveStoryVideoUrl}
        coupleImage={props.coupleImage}
        partnerOne={props.partnerOne}
        partnerTwo={props.partnerTwo}
      />

      {/* Section 6: Locations & Venues */}
      <Locations locations={props.locations} />

      {/* Section 7: Gallery */}
      <GalleryCarousel galleryImages={props.galleryImages} />

      {/* Section 8: RSVP Form */}
      <RsvpSection partnerOne={props.partnerOne} partnerTwo={props.partnerTwo} />

      {/* Footer */}
      <Footer
        coupleInitials={props.coupleInitials}
        partnerOne={props.partnerOne}
        partnerTwo={props.partnerTwo}
        contactPhone={props.contactPhone}
        contactAddress={props.contactAddress}
        socialLinks={props.socialLinks}
      />
    </div>
  );
}

