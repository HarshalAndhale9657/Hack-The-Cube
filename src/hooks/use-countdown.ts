"use client";

import { useState, useEffect } from "react";
import { getTimeRemaining } from "@/lib/utils";

/**
 * Countdown hook — updates every second until target date.
 * The lazy initializer seeds a correct first value; the interval callback
 * (not a synchronous effect body) drives subsequent ticks.
 */
export function useCountdown(targetDate: string | Date) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}
