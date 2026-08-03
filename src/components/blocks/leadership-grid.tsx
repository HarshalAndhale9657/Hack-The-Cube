"use client";

import Image from "next/image";
import { GlassCard } from "@/components/shared/glass-card";
import { StaggerContainer, StaggerItem } from "@/components/motion/scroll-reveal";
import { Quote } from "lucide-react";
import type { LeadershipMember } from "@/content/schemas";

interface LeadershipGridProps {
  members: LeadershipMember[];
}

export function LeadershipGrid({ members }: LeadershipGridProps) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <StaggerContainer className="w-full grid gap-8 md:gap-12 max-w-4xl mx-auto">
      {members.map((member) => (
        <StaggerItem key={member.id}>
          <GlassCard className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left border-white/10">
            <div className="shrink-0 relative w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border-2 border-white/10 bg-navy-900">
              <Image
                src={member.photoUrl}
                alt={member.name}
                fill
                className="object-cover object-top"
                sizes="176px"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="text-heading-1 text-gray-050 font-display mb-1">{member.name}</h3>
                <p className="text-body font-semibold text-orange-500">{member.designation}</p>
              </div>

              <div className="relative pt-2">
                <Quote className="absolute -top-2 -left-4 text-white/5 w-12 h-12 -z-10" />
                <p className="text-body-lg text-gray-300 italic leading-relaxed">
                  &quot;{member.message}&quot;
                </p>
              </div>
            </div>
          </GlassCard>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
