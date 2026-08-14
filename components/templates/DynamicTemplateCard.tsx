"use client";

import dynamic from "next/dynamic";
import { templatesRegistry, TemplateRegistryItem } from "@/data/templatesRegistry";
import { TemplateClassicFloralProps } from "@/types/template";
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

// ─── Lazy-loaded template components — only the one that matches the slug ───
// is ever downloaded; all others are skipped entirely.
const OliveOchreInvitation = dynamic(() => import("./stitch/OliveOchreInvitation"));
const ModernMinimalistInvitation = dynamic(() => import("./stitch/ModernMinimalistInvitation"));
const MidnightNoirInvitation = dynamic(() => import("./stitch/MidnightNoirInvitation"));
const ChampagneLuxeInvitation = dynamic(() => import("./stitch/ChampagneLuxeInvitation"));
const ArtDecoRevivalInvitation = dynamic(() => import("./stitch/ArtDecoRevivalInvitation"));
const ClassicFloralInvitation = dynamic(() => import("./stitch/ClassicFloralInvitation"));
const SeafoamPearlInvitation = dynamic(() => import("./stitch/SeafoamPearlInvitation"));
const VeridianGardenInvitation = dynamic(() => import("./stitch/VeridianGardenInvitation"));
const PhotoGalleryInvitation = dynamic(() => import("./stitch/PhotoGalleryInvitation"));
const WhimsicalStorybookInvitation = dynamic(() => import("./stitch/WhimsicalStorybookInvitation"));
const GrandBallroomInvitation = dynamic(() => import("./stitch/GrandBallroomInvitation"));
const MintSlateInvitation = dynamic(() => import("./stitch/MintSlateInvitation"));
const JadeInkInvitation = dynamic(() => import("./stitch/JadeInkInvitation"));
const LimeSilverInvitation = dynamic(() => import("./stitch/LimeSilverInvitation"));
const TealCopperInvitation = dynamic(() => import("./stitch/TealCopperInvitation"));
const BohemianSunInvitation = dynamic(() => import("./stitch/BohemianSunInvitation"));
const EmeraldGoldInvitation = dynamic(() => import("./stitch/EmeraldGoldInvitation"));
const MossStoneInvitation = dynamic(() => import("./stitch/MossStoneInvitation"));
const SageSandInvitation = dynamic(() => import("./stitch/SageSandInvitation"));
const ForestFernInvitation = dynamic(() => import("./stitch/ForestFernInvitation"));
const CelestialNightInvitation = dynamic(() => import("./stitch/CelestialNightInvitation"));
const RoyalMaharaniInvitation = dynamic(() => import("./stitch/RoyalMaharaniInvitation"));
const SunsetTerracottaInvitation = dynamic(() => import("./stitch/SunsetTerracottaInvitation"));
const TropicalLuauSplashInvitation = dynamic(() => import("./stitch/TropicalLuauSplashInvitation"));
const NeonRetroArcadeInvitation = dynamic(() => import("./stitch/NeonRetroArcadeInvitation"));
const MidnightGoldGalaInvitation = dynamic(() => import("./stitch/MidnightGoldGalaInvitation"));
const BoldPopArtInvitation = dynamic(() => import("./stitch/BoldPopArtInvitation"));
const MinimalistScandinavianInvitation = dynamic(() => import("./stitch/MinimalistScandinavianInvitation"));
const BotanicalGardenEleganceInvitation = dynamic(() => import("./stitch/BotanicalGardenEleganceInvitation"));
const ModernMonochromeEditorialInvitation = dynamic(() => import("./stitch/ModernMonochromeEditorialInvitation"));
const CheerfulConfettiCarnivalInvitation = dynamic(() => import("./stitch/CheerfulConfettiCarnivalInvitation"));
const ConfettiCarnivalClassicInvitation = dynamic(() => import("./stitch/ConfettiCarnivalClassicInvitation"));
const EvelynsCelebrationMasterpieceInvitation = dynamic(() => import("./stitch/EvelynsCelebrationMasterpieceInvitation"));
const ZenJapandiCalmInvitation = dynamic(() => import("./stitch/ZenJapandiCalmInvitation"));
const ElegantWatercolorFloralInvitation = dynamic(() => import("./stitch/ElegantWatercolorFloralInvitation"));
const IndustrialLoftChicInvitation = dynamic(() => import("./stitch/IndustrialLoftChicInvitation"));
const SpaceGalaxyAdventureInvitation = dynamic(() => import("./stitch/SpaceGalaxyAdventureInvitation"));
const VintageNewspaperInvitation = dynamic(() => import("./stitch/VintageNewspaperInvitation"));
const TinySweetInvitation = dynamic(() => import("./stitch/TinySweetInvitation"));
const UrbanStreetwearBashInvitation = dynamic(() => import("./stitch/UrbanStreetwearBashInvitation"));
const ArtDecoGrandeurInvitation = dynamic(() => import("./stitch/ArtDecoGrandeurInvitation"));
const FreshCitrusSummerInvitation = dynamic(() => import("./stitch/FreshCitrusSummerInvitation"));
const EclecticChicMasterpieceInvitation = dynamic(() => import("./stitch/EclecticChicMasterpieceInvitation"));
const ScrollScrubberTemplate = dynamic(() => import("./scroll-scrubber/ScrollScrubberTemplate"));
const PremiumScrollTemplate = dynamic(() => import("./premium-scroll/PremiumScrollTemplate"));

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

  if (currentSlug === "premium-scroll") {
    return <PremiumScrollTemplate {...props} />;
  }

  if (currentSlug === "scroll-scrubber" || currentSlug === "terance-ancy") {
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
