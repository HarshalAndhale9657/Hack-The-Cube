"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return letters.join("") || "?";
}

interface AvatarProps {
  src?: string;
  name: string;
  sizes?: string;
  imgClassName?: string;
  fallbackTextClassName?: string;
}

export function Avatar({
  src,
  name,
  sizes,
  imgClassName,
  fallbackTextClassName = "text-xl md:text-2xl",
}: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500/25 via-navy-900 to-navy-900">
        <span
          className={cn(
            "font-display font-bold text-gray-050 tracking-wide select-none",
            fallbackTextClassName
          )}
          aria-hidden="true"
        >
          {getInitials(name)}
        </span>
        <span className="sr-only">{name}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      className={cn("object-cover", imgClassName)}
    />
  );
}
