"use client";

import { motion, type Variants } from "motion/react";
import { type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
}

const getVariants = (direction: string, reducedMotion: boolean): Variants => {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }

  const directionMap: Record<string, { x?: number; y?: number }> = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: 24 },
    right: { x: -24 },
    none: {},
  };

  const offset = directionMap[direction] || directionMap.up;

  return {
    hidden: { opacity: 0, ...offset },
    visible: { opacity: 1, x: 0, y: 0 },
  };
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.5,
  once = true,
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={getVariants(direction, reducedMotion)}
      transition={{
        duration: reducedMotion ? 0.1 : duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // expo-out
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered container — wraps children in a stagger group
 */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ staggerChildren: staggerDelay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger item — must be used inside StaggerContainer
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reducedMotion ? 0 : 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: reducedMotion ? 0.1 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
