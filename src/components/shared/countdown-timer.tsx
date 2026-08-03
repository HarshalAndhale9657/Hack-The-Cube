"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { useEffect, useRef, useState } from "react";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  compact?: boolean;
}

function TimeUnit({ value, label, compact }: { value: number; label: string; compact?: boolean }) {
  const formatted = String(value).padStart(2, "0");
  const prevRef = useRef(value);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setAnimate(true);
      prevRef.current = value;
      const timeout = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <div className={cn("flex flex-col items-center", compact ? "gap-0.5" : "gap-1.5")}>
      <div
        suppressHydrationWarning
        className={cn(
          "font-mono font-bold text-orange-500 tabular-nums transition-all duration-300",
          compact ? "text-xl" : "text-4xl sm:text-5xl md:text-6xl",
          animate && "scale-110 opacity-80"
        )}
        style={{
          textShadow: "0 0 20px rgba(255, 127, 42, 0.3)",
        }}
      >
        {formatted}
      </div>
      <span
        className={cn(
          "text-overline text-gray-500",
          compact && "text-[0.6rem]"
        )}
      >
        {label}
      </span>
    </div>
  );
}

function Separator({ compact }: { compact?: boolean }) {
  return (
    <span
      className={cn(
        "font-mono font-bold text-orange-500/40 self-start",
        compact ? "text-xl mt-0" : "text-4xl sm:text-5xl md:text-6xl mt-0"
      )}
    >
      :
    </span>
  );
}

export function CountdownTimer({ targetDate, className, compact = false }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className={cn("glass-panel px-6 py-4 text-center flex items-center justify-center gap-2", className)}>
        {/* Replaced emoji with Lucide SVG icon to adhere to site-wide no-emoji rule */}
        <Rocket className="text-orange-500 shrink-0" size={20} />
        <p className="text-heading-3 text-orange-500 font-display">
          Event is Live!
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "glass-panel inline-flex items-center",
        compact ? "px-4 py-2 gap-3" : "px-6 py-5 sm:px-8 sm:py-6 md:px-10 md:py-8 gap-4 sm:gap-5 md:gap-6",
        className
      )}
      style={{
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35), 0 0 60px rgba(255, 127, 42, 0.08)",
      }}
    >
      <TimeUnit value={days} label="Days" compact={compact} />
      <Separator compact={compact} />
      <TimeUnit value={hours} label="Hours" compact={compact} />
      <Separator compact={compact} />
      <TimeUnit value={minutes} label="Mins" compact={compact} />
      <Separator compact={compact} />
      <TimeUnit value={seconds} label="Secs" compact={compact} />
    </div>
  );
}
