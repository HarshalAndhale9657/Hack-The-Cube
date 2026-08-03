"use client";

import { Handshake } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { StaggerContainer, StaggerItem } from "@/components/motion/scroll-reveal";

export function SponsorGrid() {
  const placeholders = [
    { id: 1, label: "Title Sponsor" },
    { id: 2, label: "Co-Sponsor" },
    { id: 3, label: "Associate Sponsor" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
        {placeholders.map((slot) => (
          <StaggerItem key={slot.id}>
            <GlassCard
              className="flex flex-col items-center justify-center text-center p-10 md:p-12 min-h-[220px] border-white/10 hover:border-orange-500/40 transition-all duration-500 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-500">
                <Handshake className="text-orange-500" size={28} />
              </div>
              <h4 className="text-heading-2 text-gray-050 font-display mb-2">
                {slot.label}
              </h4>
              <p className="text-caption text-gray-400 leading-relaxed">
                Announcement coming soon
              </p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="text-center mt-10">
        <p className="text-body text-gray-300">
          Interested in sponsoring?{" "}
          <a
            href="mailto:hackthecube@csiclub.org"
            className="text-orange-500 hover:text-orange-400 font-semibold transition-colors underline underline-offset-4"
          >
            Get in touch
          </a>
        </p>
      </div>
    </div>
  );
}
