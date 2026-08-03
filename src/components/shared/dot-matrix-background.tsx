"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export function DotMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dots: Dot[] = [];

    const spacing = 30; // Grid dot spacing in pixels
    const maxDistance = 140; // Interaction radius around mouse cursor
    const mouse = { x: -1000, y: -1000, active: false };

    const initDots = () => {
      const parent = canvas.parentElement;
      width = canvas.width = parent ? parent.clientWidth : window.innerWidth;
      height = canvas.height = parent ? parent.clientHeight : window.innerHeight;

      dots = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          dots.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            size: 1.2,
            alpha: 0.18,
          });
        }
      }
    };

    initDots();

    const handleResize = () => {
      initDots();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Calculate distance between dot and mouse cursor
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = dot.baseX;
        let targetY = dot.baseY;
        let targetAlpha = 0.18;
        let targetSize = 1.2;
        let isHovered = false;

        if (mouse.active && dist < maxDistance) {
          const force = 1 - dist / maxDistance;
          const angle = Math.atan2(dy, dx);
          // Push dot away from mouse location
          const pushDist = force * 22;
          targetX = dot.baseX - Math.cos(angle) * pushDist;
          targetY = dot.baseY - Math.sin(angle) * pushDist;

          targetAlpha = 0.2 + force * 0.75;
          targetSize = 1.2 + force * 2.0;
          isHovered = true;
        }

        // Smooth spring physics return to base position
        dot.vx += (targetX - dot.x) * 0.08;
        dot.vy += (targetY - dot.y) * 0.08;
        dot.vx *= 0.82;
        dot.vy *= 0.82;

        dot.x += dot.vx;
        dot.y += dot.vy;

        // Render dot with glow effect on hover
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, targetSize, 0, Math.PI * 2);

        if (isHovered) {
          ctx.fillStyle = `rgba(255, 127, 42, ${targetAlpha})`;
          ctx.shadowColor = "rgba(255, 127, 42, 0.8)";
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${targetAlpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
