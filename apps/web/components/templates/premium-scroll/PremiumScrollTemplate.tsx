"use client";

import React, { useRef } from "react";
import PremiumScrollCanvas, { PremiumScrollCanvasProps } from "./PremiumScrollCanvas";

export default function PremiumScrollTemplate(props: PremiumScrollCanvasProps) {
  return (
    <div className="relative w-full bg-[#051811] text-[#FDF6F3]">
      <PremiumScrollCanvas {...props} />
    </div>
  );
}
