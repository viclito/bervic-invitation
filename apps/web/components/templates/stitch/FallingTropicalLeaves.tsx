"use client";

import React, { useMemo } from "react";

interface LeafConfig {
  id: number;
  left: number; // percentage 0-100
  size: number; // in pixels
  duration: number; // in seconds
  delay: number; // in seconds
  initialRotation: number; // in degrees
  swayAmount: number; // in pixels
  opacity: number;
}

const EXACT_MONSTERA_LEAF = "/images/templates/monstera-leaf-cutout.png";

export default function FallingTropicalLeaves() {
  const leaves: LeafConfig[] = useMemo(() => [
    { id: 1, left: 4, size: 84, duration: 11, delay: 0, initialRotation: -18, swayAmount: 32, opacity: 0.45 },
    { id: 2, left: 14, size: 56, duration: 14, delay: 2.5, initialRotation: 24, swayAmount: 38, opacity: 0.35 },
    { id: 3, left: 24, size: 98, duration: 10, delay: 5.2, initialRotation: -30, swayAmount: 48, opacity: 0.50 },
    { id: 4, left: 34, size: 68, duration: 13, delay: 1.2, initialRotation: 40, swayAmount: 28, opacity: 0.38 },
    { id: 5, left: 44, size: 110, duration: 12, delay: 7.0, initialRotation: -15, swayAmount: 52, opacity: 0.48 },
    { id: 6, left: 54, size: 76, duration: 15, delay: 3.8, initialRotation: 35, swayAmount: 36, opacity: 0.40 },
    { id: 7, left: 64, size: 92, duration: 11.5, delay: 6.4, initialRotation: -25, swayAmount: 44, opacity: 0.46 },
    { id: 8, left: 74, size: 60, duration: 13.5, delay: 0.8, initialRotation: 20, swayAmount: 30, opacity: 0.36 },
    { id: 9, left: 84, size: 104, duration: 10.5, delay: 8.2, initialRotation: -35, swayAmount: 50, opacity: 0.50 },
    { id: 10, left: 92, size: 70, duration: 14.5, delay: 4.2, initialRotation: 18, swayAmount: 34, opacity: 0.38 },
    { id: 11, left: 9, size: 64, duration: 12.5, delay: 9.6, initialRotation: -12, swayAmount: 36, opacity: 0.36 },
    { id: 12, left: 29, size: 88, duration: 11, delay: 3.2, initialRotation: 28, swayAmount: 42, opacity: 0.44 },
    { id: 13, left: 49, size: 52, duration: 16, delay: 8.0, initialRotation: -20, swayAmount: 26, opacity: 0.32 },
    { id: 14, left: 69, size: 80, duration: 12, delay: 10.5, initialRotation: 32, swayAmount: 40, opacity: 0.42 },
    { id: 15, left: 79, size: 96, duration: 10.8, delay: 1.8, initialRotation: -28, swayAmount: 46, opacity: 0.48 },
    { id: 16, left: 89, size: 58, duration: 15, delay: 6.8, initialRotation: 15, swayAmount: 32, opacity: 0.34 },
    { id: 17, left: 19, size: 78, duration: 13, delay: 11.2, initialRotation: -22, swayAmount: 38, opacity: 0.40 },
    { id: 18, left: 39, size: 102, duration: 10.2, delay: 4.6, initialRotation: 30, swayAmount: 50, opacity: 0.48 },
    { id: 19, left: 59, size: 66, duration: 14, delay: 9.0, initialRotation: -16, swayAmount: 34, opacity: 0.36 },
    { id: 20, left: 96, size: 86, duration: 11.8, delay: 7.5, initialRotation: 22, swayAmount: 42, opacity: 0.44 },
  ], []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
      <style jsx global>{`
        @keyframes monsteraLeafFall {
          0% {
            transform: translateY(-140px) translateX(0px) rotate(var(--rot-start, 0deg)) scale(1);
            opacity: 0;
          }
          12% {
            opacity: var(--leaf-opacity, 0.45);
          }
          32% {
            transform: translateY(30vh) translateX(calc(var(--sway, 35px) * 1)) rotate(calc(var(--rot-start, 0deg) + 28deg)) scale(1.04);
          }
          64% {
            transform: translateY(68vh) translateX(calc(var(--sway, 35px) * -0.9)) rotate(calc(var(--rot-start, 0deg) - 22deg)) scale(0.96);
          }
          88% {
            opacity: var(--leaf-opacity, 0.45);
          }
          100% {
            transform: translateY(118vh) translateX(calc(var(--sway, 35px) * 0.75)) rotate(calc(var(--rot-start, 0deg) + 45deg)) scale(1);
            opacity: 0;
          }
        }
      `}</style>

      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute top-0 will-change-transform"
          style={{
            left: `${leaf.left}%`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            animation: `monsteraLeafFall ${leaf.duration}s cubic-bezier(0.37, 0, 0.63, 1) infinite`,
            animationDelay: `${leaf.delay}s`,
            ["--rot-start" as string]: `${leaf.initialRotation}deg`,
            ["--sway" as string]: `${leaf.swayAmount}px`,
            ["--leaf-opacity" as string]: leaf.opacity,
          }}
        >
          <img
            src={EXACT_MONSTERA_LEAF}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain select-none pointer-events-none"
            style={{
              mixBlendMode: "multiply",
            }}
          />
        </div>
      ))}
    </div>
  );
}

