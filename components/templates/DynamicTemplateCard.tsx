"use client";

import { templatesRegistry, TemplateRegistryItem } from "@/data/templatesRegistry";
import { TemplateClassicFloralProps } from "@/types/template";
import OliveOchreInvitation from "./stitch/OliveOchreInvitation";
import ModernMinimalistInvitation from "./stitch/ModernMinimalistInvitation";
import MidnightNoirInvitation from "./stitch/MidnightNoirInvitation";
import ChampagneLuxeInvitation from "./stitch/ChampagneLuxeInvitation";
import ArtDecoRevivalInvitation from "./stitch/ArtDecoRevivalInvitation";
import ClassicFloralInvitation from "./stitch/ClassicFloralInvitation";
import SeafoamPearlInvitation from "./stitch/SeafoamPearlInvitation";
import VeridianGardenInvitation from "./stitch/VeridianGardenInvitation";
import PhotoGalleryInvitation from "./stitch/PhotoGalleryInvitation";
import WhimsicalStorybookInvitation from "./stitch/WhimsicalStorybookInvitation";
import GrandBallroomInvitation from "./stitch/GrandBallroomInvitation";
import MintSlateInvitation from "./stitch/MintSlateInvitation";
import JadeInkInvitation from "./stitch/JadeInkInvitation";
import LimeSilverInvitation from "./stitch/LimeSilverInvitation";
import TealCopperInvitation from "./stitch/TealCopperInvitation";
import BohemianSunInvitation from "./stitch/BohemianSunInvitation";
import EmeraldGoldInvitation from "./stitch/EmeraldGoldInvitation";
import MossStoneInvitation from "./stitch/MossStoneInvitation";
import SageSandInvitation from "./stitch/SageSandInvitation";
import ForestFernInvitation from "./stitch/ForestFernInvitation";
import CelestialNightInvitation from "./stitch/CelestialNightInvitation";
import RoyalMaharaniInvitation from "./stitch/RoyalMaharaniInvitation";
import SunsetTerracottaInvitation from "./stitch/SunsetTerracottaInvitation";
import Navbar from "./classic-floral/Navbar";
import Hero from "./classic-floral/Hero";
import CountdownTimer from "./classic-floral/CountdownTimer";
import WeddingEvents from "./classic-floral/WeddingEvents";
import Timeline from "./classic-floral/Timeline";
import LoveStoryVideoFacade from "./classic-floral/LoveStoryVideoFacade";
import Locations from "./classic-floral/Locations";
import GalleryCarousel from "./classic-floral/GalleryCarousel";
import RsvpSection from "./classic-floral/RsvpSection";
import PersonalizedEnvelopeCover from "./classic-floral/PersonalizedEnvelopeCover";
import Footer from "./classic-floral/Footer";
import { Crown } from "lucide-react";

interface DynamicTemplateCardProps extends TemplateClassicFloralProps {
  templateSlug?: string;
}

export default function DynamicTemplateCard(props: DynamicTemplateCardProps) {
  const currentSlug = props.templateSlug || "olive-ochre";

  // Dedicated Stitch Component Renderers
  if (currentSlug === "olive-ochre") {
    return <OliveOchreInvitation {...props} />;
  }

  if (currentSlug === "modern-minimalist") {
    return <ModernMinimalistInvitation {...props} />;
  }

  if (currentSlug === "midnight-noir") {
    return <MidnightNoirInvitation {...props} />;
  }

  if (currentSlug === "champagne-luxe") {
    return <ChampagneLuxeInvitation {...props} />;
  }

  if (currentSlug === "art-deco-revival") {
    return <ArtDecoRevivalInvitation {...props} />;
  }

  if (currentSlug === "classic-floral") {
    return <ClassicFloralInvitation {...props} />;
  }

  if (currentSlug === "seafoam-pearl") {
    return <SeafoamPearlInvitation {...props} />;
  }

  if (currentSlug === "veridian-garden") {
    return <VeridianGardenInvitation {...props} />;
  }

  if (currentSlug === "photo-gallery") {
    return <PhotoGalleryInvitation {...props} />;
  }

  if (currentSlug === "whimsical-storybook") {
    return <WhimsicalStorybookInvitation {...props} />;
  }

  if (currentSlug === "grand-ballroom") {
    return <GrandBallroomInvitation {...props} />;
  }

  if (currentSlug === "mint-slate") {
    return <MintSlateInvitation {...props} />;
  }

  if (currentSlug === "jade-ink") {
    return <JadeInkInvitation {...props} />;
  }

  if (currentSlug === "lime-silver") {
    return <LimeSilverInvitation {...props} />;
  }

  if (currentSlug === "teal-copper") {
    return <TealCopperInvitation {...props} />;
  }

  if (currentSlug === "bohemian-sun") {
    return <BohemianSunInvitation {...props} />;
  }

  if (currentSlug === "emerald-gold" || currentSlug === "emerald-gold-v2") {
    return <EmeraldGoldInvitation {...props} />;
  }

  if (currentSlug === "moss-stone") {
    return <MossStoneInvitation {...props} />;
  }

  if (currentSlug === "sage-sand") {
    return <SageSandInvitation {...props} />;
  }

  if (currentSlug === "forest-fern") {
    return <ForestFernInvitation {...props} />;
  }

  if (currentSlug === "celestial-night") {
    return <CelestialNightInvitation {...props} />;
  }

  if (currentSlug === "royal-maharani") {
    return <RoyalMaharaniInvitation {...props} />;
  }

  if (currentSlug === "sunset-terracotta") {
    return <SunsetTerracottaInvitation {...props} />;
  }

  const themeItem: TemplateRegistryItem =
    templatesRegistry.find((t) => t.slug === currentSlug) ||
    templatesRegistry[0];

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${themeItem.bgGrad} font-sans relative transition-colors duration-500`}
      style={{
        color: themeItem.textColor,
      }}
    >
      {/* Personalized Guest Envelope Cover Overlay */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={props.partnerOne}
        partnerTwo={props.partnerTwo}
        weddingTime={props.weddingTime}
        isCustomizer={props.isCustomizer}
        templateSlug={currentSlug}
      />



      {/* Navigation */}
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
