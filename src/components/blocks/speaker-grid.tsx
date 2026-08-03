"use client";

import Image from "next/image";
import { Globe, Mic } from "lucide-react";
import { Linkedin, Twitter } from "@/components/shared/brand-icons";
import { GlassCard } from "@/components/shared/glass-card";
import { StaggerContainer, StaggerItem } from "@/components/motion/scroll-reveal";
import type { Speaker } from "@/content/schemas";

interface SpeakerGridProps {
  speakers: Speaker[];
}

export function SpeakerGrid({ speakers }: SpeakerGridProps) {
  if (!speakers || speakers.length === 0) {
    return (
      <div className="glass-panel p-8 text-center max-w-2xl mx-auto flex flex-col items-center justify-center">
        {/* Replaced emoji with Lucide SVG icon for brand consistency */}
        <Mic className="text-orange-500 mb-3" size={32} />
        <p className="text-heading-3 text-gray-050 mb-2">Speakers Lineup Coming Soon</p>
        <p className="text-body text-gray-300">Stay tuned for our exciting speaker announcements!</p>
      </div>
    );
  }

  return (
    <StaggerContainer className="w-full grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
      {speakers.map((speaker) => (
        <StaggerItem key={speaker.id} className="h-full">
          <GlassCard className="h-full overflow-hidden flex flex-col group border-white/10">
            {/* Image Section — object-top ensures heads/faces are never cut off */}
            <div className="relative h-72 sm:h-80 w-full bg-navy-900 overflow-hidden">
              <Image
                src={speaker.photoUrl}
                alt={speaker.name}
                fill
                priority
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-surface-2 via-transparent to-transparent opacity-90" />

              {/* Floating Socials */}
              <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {speaker.links?.linkedin && (
                  <a
                    href={speaker.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-orange-500 transition-colors"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                {speaker.links?.twitter && (
                  <a
                    href={speaker.links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-orange-500 transition-colors"
                  >
                    <Twitter size={16} />
                  </a>
                )}
                {speaker.links?.website && (
                  <a
                    href={speaker.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-orange-500 transition-colors"
                  >
                    <Globe size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 sm:p-10 flex flex-col flex-grow justify-between space-y-5 text-center">
              <div className="flex flex-col items-center">
                <h3 className="text-heading-2 text-gray-050 mb-1 font-display">{speaker.name}</h3>
                <p className="text-body font-semibold text-orange-500 mb-5">
                  {speaker.designation}, {speaker.company}
                </p>

                <div className="mb-3 bg-white/5 p-3.5 rounded-xl border border-white/5 w-full">
                  <span className="text-overline text-orange-400 font-mono block mb-1">Session Topic</span>
                  <p className="text-body font-bold text-gray-100 leading-snug line-clamp-2">{speaker.sessionTopic}</p>
                </div>
              </div>

              <p className="text-caption text-gray-300 leading-relaxed border-t border-white/10 pt-4 line-clamp-3 mx-auto">
                {speaker.bio}
              </p>
            </div>
          </GlassCard>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
