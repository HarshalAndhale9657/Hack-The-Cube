"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/shared/glass-card";
import { mainVenue, inaugurationVenue, hackathonHallVenue } from "@/content/venue";
import { MapPin, Navigation, Wifi, ShieldAlert, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function VenueBlock() {
  const [activeTab, setActiveTab] = useState<"main" | "inauguration" | "hall">("main");

  return (
    <div className="w-full space-y-8 max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex md:flex-wrap md:justify-center gap-2 overflow-x-auto scrollbar-hide snap-x pb-2 w-full">
        <button
          onClick={() => setActiveTab("main")}
          className={cn(
            "shrink-0 snap-start px-6 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer",
            activeTab === "main"
              ? "bg-orange-500 text-bg-void glow-orange-sm"
              : "bg-white/5 text-gray-300 hover:bg-white/10"
          )}
        >
          Main Campus & Location
        </button>
        <button
          onClick={() => setActiveTab("inauguration")}
          className={cn(
            "shrink-0 snap-start px-6 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer",
            activeTab === "inauguration"
              ? "bg-orange-500 text-bg-void glow-orange-sm"
              : "bg-white/5 text-gray-300 hover:bg-white/10"
          )}
        >
          Inauguration Auditorium
        </button>
        <button
          onClick={() => setActiveTab("hall")}
          className={cn(
            "shrink-0 snap-start px-6 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer",
            activeTab === "hall"
              ? "bg-orange-500 text-bg-void glow-orange-sm"
              : "bg-white/5 text-gray-300 hover:bg-white/10"
          )}
        >
          24-Hour Hackathon Hall
        </button>
      </div>

      {/* Main Campus Tab */}
      {activeTab === "main" && (
        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          <GlassCard className="p-8 space-y-6 border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-overline text-orange-500 font-mono">Event Location</span>
              <h3 className="text-heading-1 text-gray-050 font-display">{mainVenue.name}</h3>
              <p className="text-body text-gray-300 flex items-start gap-2.5 leading-relaxed text-center sm:text-left">
                <MapPin size={20} className="text-orange-500 shrink-0 mt-1" />
                <span>{mainVenue.address}</span>
              </p>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4 text-caption text-gray-300">
              {mainVenue.parkingInfo && (
                <p>
                  <strong className="text-gray-100">Parking:</strong> {mainVenue.parkingInfo}
                </p>
              )}
              {mainVenue.entryGate && (
                <p>
                  <strong className="text-gray-100">Entry Gate:</strong> {mainVenue.entryGate}
                </p>
              )}
            </div>

            <a
              href={`https://maps.google.com/?q=${mainVenue.coordinates.lat},${mainVenue.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex mt-2 w-fit"
            >
              <Navigation size={18} /> Get Directions
            </a>
          </GlassCard>

          <GlassCard className="p-6 h-[380px] relative overflow-hidden border-white/10">
            <iframe
              src={mainVenue.mapEmbedUrl}
              title="Campus Location Map"
              className="w-full h-full rounded-xl border-0"
              loading="lazy"
            />
          </GlassCard>
        </div>
      )}

      {/* Inauguration Venue Tab */}
      {activeTab === "inauguration" && (
        <GlassCard className="p-8 lg:p-10 max-w-3xl mx-auto space-y-6 border-white/10">
          <div className="space-y-3">
            <span className="text-overline text-orange-500 font-mono flex items-center gap-2">
              <Clock size={16} /> {inaugurationVenue.time}
            </span>
            <h3 className="text-heading-1 text-gray-050 font-display">{inaugurationVenue.name}</h3>
          </div>

          <p className="text-body-lg text-gray-300 leading-relaxed text-center">{inaugurationVenue.hallInfo}</p>

          <div className="grid sm:grid-cols-2 gap-4 border-t border-white/10 pt-6 text-body text-gray-300">
            <div className="bg-white/5 p-4 rounded-xl">
              <span className="text-caption text-gray-400 block mb-1">Floor / Location</span>
              <strong className="text-gray-100">{inaugurationVenue.floor}</strong>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <span className="text-caption text-gray-400 block mb-1">Hall Capacity</span>
              <strong className="text-gray-100">{inaugurationVenue.capacity} Seating Capacity</strong>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Hackathon Hall Tab */}
      {activeTab === "hall" && (
        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          <GlassCard className="p-8 space-y-6 border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-overline text-orange-500 font-mono flex items-center gap-2">
                <Clock size={16} /> {hackathonHallVenue.time}
              </span>
              <h3 className="text-heading-1 text-gray-050 font-display">{hackathonHallVenue.name}</h3>
              <p className="text-body text-gray-300 leading-relaxed text-center sm:text-left">{hackathonHallVenue.hallInfo}</p>
              <p className="text-caption text-gray-400 leading-relaxed text-center sm:text-left">{hackathonHallVenue.seatingInfo}</p>
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2.5 text-body text-gray-200 bg-white/5 p-3 rounded-xl">
                <Wifi size={20} className="text-orange-500 shrink-0" />
                <span>
                  <strong className="text-orange-400">WiFi SSID:</strong> {hackathonHallVenue.wifi.ssid} ({hackathonHallVenue.wifi.passwordNote})
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-body text-gray-200 bg-white/5 p-3 rounded-xl">
                <ShieldAlert size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-orange-400">Emergency Exits:</strong> {hackathonHallVenue.emergencyExits.join(", ")}
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[340px] border-white/10">
            <div className="relative w-full h-[300px] rounded-2xl overflow-hidden bg-navy-900 border border-white/10">
              <Image
                src={hackathonHallVenue.floorPlanImageUrl}
                alt="Floor Plan"
                fill
                className="object-contain p-4"
              />
            </div>
            <span className="text-caption text-gray-400 font-mono mt-3">Venue Floor Plan & Layout</span>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
