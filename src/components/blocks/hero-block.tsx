"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronDown, MapPin, Calendar, Play } from "lucide-react";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { DotMatrixBackground } from "@/components/shared/dot-matrix-background";
import { InteractiveCube3D } from "@/components/shared/interactive-cube-3d";
import { siteConfig } from "@/content/site-config";
import { formatDate } from "@/lib/utils";

export function HeroBlock() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: "100dvh",
        marginTop: "calc(var(--navbar-h) * -1)",
      }}
    >
      {/* Interactive Dot Matrix Canvas Background — reacts dynamically to cursor position */}
      <DotMatrixBackground />

      {/* Full-bleed background image with dark overlay (FlytBase style) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/placeholder.png"
          alt="Hack the Cube 2026 Background"
          fill
          priority
          className="object-cover opacity-15 grayscale brightness-75 scale-105 pointer-events-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(26,26,26,0.65) 0%, rgba(13,13,13,0.96) 100%)",
          }}
        />
      </div>

      {/* Radial CTA glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-25 pointer-events-none"
        style={{ background: "var(--gradient-cta-glow)" }}
      />

      {/* Hero Content — FlytBase inspired 2-column layout (7 cols text + 5 cols 3D Cube) */}
      <div
        className="relative z-10 w-full grid lg:grid-cols-12 gap-8 items-center"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--container-padding)",
          paddingBlock: "clamp(7rem, 16vw, 11rem) clamp(4rem, 8vw, 6rem)",
        }}
      >
        {/* Left Column: Headlines, CTAs & Countdown */}
        <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start gap-5">
          {/* Overline label */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-overline text-orange-500 font-mono tracking-widest inline-flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            01 / CSI Club Presents
          </motion.span>

          {/* Large Bold Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-display-xl text-gray-050 w-full font-display leading-[1.08]"
          >
            Hack the <span className="text-gradient-orange">Cube</span>{" "}
            <span className="text-orange-500">2026</span>
          </motion.h1>

          {/* Short Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-body-lg text-gray-300 w-full max-w-xl"
            style={{ lineHeight: 1.7 }}
          >
            {siteConfig.tagline}. A premier 24-hour national-level hackathon featuring
            a Technical Talk Show, industry speakers, and massive prizes.
          </motion.p>

          {/* Date & Venue Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-caption text-gray-300 font-mono"
          >
            <span className="flex items-center gap-1.5">
              <Calendar size={16} className="text-orange-500" />
              {formatDate(siteConfig.dates.eventStart)}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-700 hidden md:block" />
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-orange-500" />
              Main Campus, CSI Institute
            </span>
          </motion.div>

          {/* Primary CTA button + Secondary "Watch overview" text link side by side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-2"
          >
            <Link href="/register" className="btn-primary text-base px-8 py-4">
              Register Now
            </Link>
            <a
              href="#video"
              onClick={(e) => handleScroll(e, "#video")}
              className="inline-flex items-center gap-2 text-body font-semibold text-gray-050 hover:text-orange-500 transition-colors group"
            >
              <span className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={14} className="ml-0.5" />
              </span>
              Watch Overview
            </a>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 w-full flex justify-center lg:justify-start"
          >
            <CountdownTimer targetDate={siteConfig.dates.eventStart} />
          </motion.div>
        </div>

        {/* Right Column: Interactive 3D Cube Feature (FlytBase style) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center items-center mt-6 lg:mt-0"
        >
          <InteractiveCube3D />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 z-20 pointer-events-none"
      >
        <span className="text-caption text-gray-500 font-mono">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-gray-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
