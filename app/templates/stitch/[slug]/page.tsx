"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import OliveOchreInvitation from "@/components/templates/stitch/OliveOchreInvitation";
import { sampleWeddingData } from "@/data/sampleWeddingData";

export default function StitchTemplatePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "olive-ochre";

  return (
    <AnimatePresence mode="wait">
      <OliveOchreInvitation key={slug} {...sampleWeddingData} />
    </AnimatePresence>
  );
}
