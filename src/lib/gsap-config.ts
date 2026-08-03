"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins once, client-side only
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Default GSAP configuration
gsap.defaults({
  ease: "power3.out", // matches our --ease-out-expo
  duration: 0.5,
});

// ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: "play none none reverse",
});

export { gsap, ScrollTrigger };
