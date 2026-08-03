"use client";

import Image from "next/image";
import { Linkedin } from "@/components/shared/brand-icons";
import { GlassCard } from "@/components/shared/glass-card";
import { StaggerContainer, StaggerItem } from "@/components/motion/scroll-reveal";
import type { TeamMember } from "@/content/schemas";
import { cn } from "@/lib/utils";

interface TeamGridProps {
  members: TeamMember[];
  category: TeamMember["category"];
}

export function TeamGrid({ members, category }: TeamGridProps) {
  const filteredMembers = members.filter((m) => m.category === category);

  if (!filteredMembers.length) {
    return null;
  }

  const getGridCols = () => {
    switch (category) {
      case "core": return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case "faculty-coordinator": return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case "student-coordinator": return "grid-cols-2 md:grid-cols-4 lg:grid-cols-5";
      default: return "grid-cols-2 md:grid-cols-4";
    }
  };

  return (
    <StaggerContainer className={cn("w-full grid gap-6 md:gap-8 items-stretch", getGridCols())}>
      {filteredMembers.map((member) => (
        <StaggerItem key={member.id} className="h-full">
          <GlassCard className="h-full overflow-hidden flex flex-col justify-between group text-center p-5 sm:p-6 border-white/10">
            <div>
              <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-3 rounded-full overflow-hidden bg-navy-900 border-2 border-orange-500/30 group-hover:border-orange-500 transition-colors">
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="128px"
                />
              </div>

              <h3 className="text-heading-3 font-bold text-gray-050 mb-0.5 font-display">{member.name}</h3>
              <p className="text-caption font-semibold text-orange-500 mb-0.5">
                {member.position}
              </p>
              {member.department && (
                <p className="text-caption text-gray-300 leading-tight mb-2 font-normal text-xs">
                  {member.department}
                </p>
              )}
            </div>

            {member.linkedinUrl && (
              <div className="pt-3 border-t border-white/5 flex justify-center">
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name}'s LinkedIn`}
                  className="p-2 text-gray-400 hover:text-orange-500 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            )}
          </GlassCard>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
