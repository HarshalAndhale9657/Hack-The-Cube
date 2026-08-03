"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoFacadeProps {
  title?: string;
}

export function VideoFacade({ title = "Hack the Cube 2026 Hype Video" }: VideoFacadeProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-bg-void overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/videos/Timeline 1.mp4"
        poster="/images/placeholder.png"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay for visual hierarchy and readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-surface-1 via-black/40 to-bg-surface-1/90 pointer-events-none" />

      {/* Floating Controls & Text Overlay */}
      <div className="relative z-10 w-full max-w-[1400px] px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6 py-16 text-center md:text-left">
        <div className="max-w-2xl space-y-3">
          <span className="text-overline text-orange-500 font-mono tracking-widest block">
            01 / Full-Screen Hype Trailer
          </span>
          <h2 className="text-display-lg text-gray-050 font-display">Relive the Experience</h2>
          <p className="text-body-lg text-gray-300">
            Immerse yourself in 24 hours of non-stop innovation, technical talk shows, and high-energy building.
          </p>
        </div>

        {/* Unmute Button */}
        <button
          onClick={toggleMute}
          className={cn(
            "group flex items-center gap-3 px-6 py-4 rounded-full font-display font-semibold text-base transition-all duration-300 cursor-pointer shadow-2xl backdrop-blur-xl border shrink-0",
            isMuted
              ? "bg-orange-500 text-bg-void border-orange-400 hover:bg-orange-600 glow-orange"
              : "bg-white/10 text-gray-050 border-white/20 hover:bg-white/20"
          )}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </div>
          <span>{isMuted ? "Click to Unmute Audio" : "Audio Playing — Mute"}</span>
        </button>
      </div>
    </div>
  );
}
