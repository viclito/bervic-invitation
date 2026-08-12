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
import TropicalLuauSplashInvitation from "./stitch/TropicalLuauSplashInvitation";
import NeonRetroArcadeInvitation from "./stitch/NeonRetroArcadeInvitation";
import MidnightGoldGalaInvitation from "./stitch/MidnightGoldGalaInvitation";
import BoldPopArtInvitation from "./stitch/BoldPopArtInvitation";
import MinimalistScandinavianInvitation from "./stitch/MinimalistScandinavianInvitation";
import BotanicalGardenEleganceInvitation from "./stitch/BotanicalGardenEleganceInvitation";
import ModernMonochromeEditorialInvitation from "./stitch/ModernMonochromeEditorialInvitation";
import CheerfulConfettiCarnivalInvitation from "./stitch/CheerfulConfettiCarnivalInvitation";
import ConfettiCarnivalClassicInvitation from "./stitch/ConfettiCarnivalClassicInvitation";
import EvelynsCelebrationMasterpieceInvitation from "./stitch/EvelynsCelebrationMasterpieceInvitation";
import ZenJapandiCalmInvitation from "./stitch/ZenJapandiCalmInvitation";
import ElegantWatercolorFloralInvitation from "./stitch/ElegantWatercolorFloralInvitation";
import IndustrialLoftChicInvitation from "./stitch/IndustrialLoftChicInvitation";
import SpaceGalaxyAdventureInvitation from "./stitch/SpaceGalaxyAdventureInvitation";
import VintageNewspaperInvitation from "./stitch/VintageNewspaperInvitation";
import TinySweetInvitation from "./stitch/TinySweetInvitation";
import UrbanStreetwearBashInvitation from "./stitch/UrbanStreetwearBashInvitation";
import ArtDecoGrandeurInvitation from "./stitch/ArtDecoGrandeurInvitation";
import FreshCitrusSummerInvitation from "./stitch/FreshCitrusSummerInvitation";
import EclecticChicMasterpieceInvitation from "./stitch/EclecticChicMasterpieceInvitation";
import ScrollScrubberTemplate from "./scroll-scrubber/ScrollScrubberTemplate";
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

  if (currentSlug === "whimsical-storybook" && (!props.partnerTwo || props.partnerTwo === "")) {
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

  if (currentSlug === "tropical-luau-splash") {
    return <TropicalLuauSplashInvitation {...props} />;
  }

  if (currentSlug === "neon-retro-arcade") {
    return <NeonRetroArcadeInvitation {...props} />;
  }

  if (currentSlug === "midnight-gold-gala") {
    return <MidnightGoldGalaInvitation {...props} />;
  }

  if (currentSlug === "bold-pop-art") {
    return <BoldPopArtInvitation {...props} />;
  }

  if (currentSlug === "minimalist-scandinavian") {
    return <MinimalistScandinavianInvitation {...props} />;
  }

  if (currentSlug === "botanical-garden-elegance") {
    return <BotanicalGardenEleganceInvitation {...props} />;
  }

  if (currentSlug === "whimsical-storybook" || currentSlug === "whimsical-storybook-birthday" || currentSlug === "whimsical-storybook-bday") {
    return <WhimsicalStorybookInvitation {...props} />;
  }

  if (currentSlug === "modern-monochrome-editorial") {
    return <ModernMonochromeEditorialInvitation {...props} />;
  }

  if (currentSlug === "cheerful-confetti-carnival") {
    return <CheerfulConfettiCarnivalInvitation {...props} />;
  }

  if (currentSlug === "cheerful-confetti-carnival-v1" || currentSlug === "confetti-carnival-classic") {
    return <ConfettiCarnivalClassicInvitation {...props} />;
  }

  if (currentSlug === "evelyns-celebration-masterpiece") {
    return <EvelynsCelebrationMasterpieceInvitation {...props} />;
  }

  if (currentSlug === "zen-japandi-calm") {
    return <ZenJapandiCalmInvitation {...props} />;
  }

  if (currentSlug === "elegant-watercolor-floral") {
    return <ElegantWatercolorFloralInvitation {...props} />;
  }

  if (currentSlug === "industrial-loft-chic") {
    return <IndustrialLoftChicInvitation {...props} />;
  }

  if (currentSlug === "space-galaxy-adventure") {
    return <SpaceGalaxyAdventureInvitation {...props} />;
  }

  if (currentSlug === "vintage-newspaper") {
    return <VintageNewspaperInvitation {...props} />;
  }

  if (currentSlug === "tiny-sweet") {
    return <TinySweetInvitation {...props} />;
  }

  if (currentSlug === "urban-streetwear-bash") {
    return <UrbanStreetwearBashInvitation {...props} />;
  }

  if (currentSlug === "art-deco-grandeur") {
    return <ArtDecoGrandeurInvitation {...props} />;
  }

  if (currentSlug === "fresh-citrus-summer") {
    return <FreshCitrusSummerInvitation {...props} />;
  }

  if (currentSlug === "eclectic-chic-masterpiece") {
    return <EclecticChicMasterpieceInvitation {...props} />;
  }

  if (currentSlug === "scroll-scrubber" || currentSlug === "premium-scroll" || currentSlug === "terance-ancy") {
    return <ScrollScrubberTemplate {...props} />;
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
        weddingTime={props.weddingTime}
        coupleImage={props.coupleImage}
        partnerTwoImage={props.partnerTwoImage}
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
        showVideoSection={props.showVideoSection}
      />

      {/* Section 6: Locations & Venues */}
      <Locations locations={props.locations} />

      {/* Section 7: Gallery */}
      <GalleryCarousel galleryImages={props.galleryImages} />

      {/* Section 8: RSVP Form */}
      <RsvpSection
        partnerOne={props.partnerOne}
        partnerTwo={props.partnerTwo}
        guestName={props.guestName}
        guestPhone={props.guestPhone}
      />

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
