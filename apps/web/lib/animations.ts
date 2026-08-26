import { Variants } from "framer-motion";

/**
 * Shared animation variants for Framer Motion across all 20 invitation templates.
 * Enforces smooth 0.35s-0.45s easeOut/cubic-bezier transitions.
 */

// Page-level entrance and exit transitions
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 18,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 1, 0.5, 1], // Custom smooth ease-out
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// Container stagger for element-level cascades
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

// Standard Fade-In Up variant for headings, texts, cards
export const fadeInUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 24,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

// Subtle Scale-In variant for photos, badges, hero elements
export const fadeInScaleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

// Left-to-right slide variant
export const slideInLeftVariants: Variants = {
  initial: {
    opacity: 0,
    x: -28,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

// Right-to-left slide variant
export const slideInRightVariants: Variants = {
  initial: {
    opacity: 0,
    x: 28,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

// Interactive micro-animations for buttons and interactive badges
export const buttonHoverTapProps = {
  whileHover: { scale: 1.03, transition: { duration: 0.2 } },
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
};

// Interactive micro-animations for event/venue/gallery cards
export const cardHoverTapProps = {
  whileHover: { y: -4, scale: 1.015, transition: { duration: 0.25 } },
  whileTap: { scale: 0.98, transition: { duration: 0.15 } },
};

// Reusable scroll-view trigger configuration
export const viewportScrollProps = {
  once: true,
  amount: 0.15,
};
