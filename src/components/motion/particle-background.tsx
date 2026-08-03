"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let isVisible = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Gradient blobs
    const blobs = Array.from({ length: 4 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 200 + Math.random() * 300,
      color: Math.random() > 0.5
        ? "rgba(255, 127, 42, 0.06)"
        : "rgba(40, 68, 87, 0.08)",
    }));

    const animate = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const blob of blobs) {
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce off edges
        if (blob.x < -blob.radius || blob.x > canvas.width + blob.radius) blob.vx *= -1;
        if (blob.y < -blob.radius || blob.y > canvas.height + blob.radius) blob.vy *= -1;

        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Pause when tab not visible
    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible) animate();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    // Static gradient fallback
    return (
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
