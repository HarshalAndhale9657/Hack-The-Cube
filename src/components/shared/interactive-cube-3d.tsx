"use client";

import { useEffect, useRef, useState } from "react";

export function InteractiveCube3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Rotation state
    let rotX = 0.4;
    let rotY = 0.6;
    let rotZ = 0.1;
    let targetRotXSpeed = 0.005;
    let targetRotYSpeed = 0.008;

    // Mouse tracking for 3D tilt tracking
    let mouseX = 0;
    let mouseY = 0;
    let isMouseOver = false;

    const resize = () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    resize();

    // 8 Vertices of Outer Cube (cube size = 120)
    const size = 120;
    const outerVertices: [number, number, number][] = [
      [-size, -size, -size],
      [size, -size, -size],
      [size, size, -size],
      [-size, size, -size],
      [-size, -size, size],
      [size, -size, size],
      [size, size, size],
      [-size, size, size],
    ];

    // 8 Vertices of Inner Core Cube (size = 55)
    const innerSize = 55;
    const innerVertices: [number, number, number][] = [
      [-innerSize, -innerSize, -innerSize],
      [innerSize, -innerSize, -innerSize],
      [innerSize, innerSize, -innerSize],
      [-innerSize, innerSize, -innerSize],
      [-innerSize, -innerSize, innerSize],
      [innerSize, -innerSize, innerSize],
      [innerSize, innerSize, innerSize],
      [-innerSize, innerSize, innerSize],
    ];

    // 12 Edges connecting vertices
    const edges: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back face
      [4, 5], [5, 6], [6, 7], [7, 4], // Front face
      [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
    ];

    // Mouse events for 3D tilt interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = x / (rect.width / 2);
      mouseY = y / (rect.height / 2);
      isMouseOver = true;
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      isMouseOver = true;
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      isMouseOver = false;
      mouseX = 0;
      mouseY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);

    // 3D Matrix Projection Transformation
    const project = (v: [number, number, number], rx: number, ry: number, rz: number): [number, number, number] => {
      let [x, y, z] = v;

      // Rotate around X
      let rad = rx;
      let cos = Math.cos(rad);
      let sin = Math.sin(rad);
      let y1 = y * cos - z * sin;
      let z1 = y * sin + z * cos;

      // Rotate around Y
      rad = ry;
      cos = Math.cos(rad);
      sin = Math.sin(rad);
      let x2 = x * cos + z1 * sin;
      let z2 = -x * sin + z1 * cos;

      // Rotate around Z
      rad = rz;
      cos = Math.cos(rad);
      sin = Math.sin(rad);
      let x3 = x2 * cos - y1 * sin;
      let y3 = x2 * sin + y1 * cos;

      // Perspective projection
      const fov = 420;
      const distance = 450;
      const scale = fov / (distance + z2);
      const projX = x3 * scale + width / 2;
      const projY = y3 * scale + height / 2;

      return [projX, projY, z2];
    };

    let pulseTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interactive rotation acceleration & tilt tracking on hover
      if (isMouseOver) {
        targetRotXSpeed = 0.005 + mouseY * 0.015;
        targetRotYSpeed = 0.008 + mouseX * 0.015;
      } else {
        targetRotXSpeed = 0.004;
        targetRotYSpeed = 0.006;
      }

      rotX += targetRotXSpeed;
      rotY += targetRotYSpeed;
      rotZ += 0.002;
      pulseTime += 0.03;

      // Render Technical Background Orbit Rings
      const cx = width / 2;
      const cy = height / 2;
      ctx.save();
      ctx.strokeStyle = "rgba(255, 127, 42, 0.12)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, 190, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.setLineDash([2, 8]);
      ctx.beginPath();
      ctx.arc(cx, cy, 220, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Project Outer Vertices
      const projectedOuter = outerVertices.map((v) => project(v, rotX, rotY, rotZ));

      // Project Inner Vertices (Counter-rotating)
      const projectedInner = innerVertices.map((v) =>
        project(v, -rotX * 1.2, rotY * 1.1, -rotZ * 1.5)
      );

      // Render Outer Cube Edges
      ctx.lineWidth = isMouseOver ? 2 : 1.5;
      ctx.strokeStyle = isMouseOver ? "rgba(255, 127, 42, 0.85)" : "rgba(255, 127, 42, 0.5)";
      ctx.shadowColor = "rgba(255, 127, 42, 0.6)";
      ctx.shadowBlur = isMouseOver ? 16 : 8;

      edges.forEach(([start, end]) => {
        const p1 = projectedOuter[start];
        const p2 = projectedOuter[end];

        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      });

      // Render Inner Core Edges
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(255, 255, 255, 0.4)";

      edges.forEach(([start, end]) => {
        const p1 = projectedInner[start];
        const p2 = projectedInner[end];

        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      });

      // Render Glowing Corner Node Dots on Outer Vertices
      projectedOuter.forEach((p) => {
        const nodeSize = (isMouseOver ? 4.5 : 3.5) + Math.sin(pulseTime) * 0.8;
        ctx.beginPath();
        ctx.arc(p[0], p[1], nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = "#FF7F2A";
        ctx.shadowColor = "rgba(255, 127, 42, 0.9)";
        ctx.shadowBlur = isMouseOver ? 14 : 8;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[480px] h-[380px] sm:h-[440px] mx-auto flex items-center justify-center cursor-pointer group"
    >
      {/* Glow backdrop aura behind the 3D cube */}
      <div
        className="absolute inset-0 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255, 127, 42, 0.35) 0%, rgba(26, 26, 26, 0) 70%)",
        }}
      />

      <canvas ref={canvasRef} className="relative z-10 w-full h-full block" />

      {/* FlytBase style HUD corner badges */}
      <div className="absolute top-4 left-4 z-20 font-mono text-[10px] text-orange-400/80 tracking-widest uppercase bg-bg-surface-2/80 px-2.5 py-1 rounded border border-orange-500/20 backdrop-blur-md">
        Interactive 3D Matrix
      </div>
      <div className="absolute bottom-4 right-4 z-20 font-mono text-[10px] text-gray-400/80 tracking-widest uppercase bg-bg-surface-2/80 px-2.5 py-1 rounded border border-white/10 backdrop-blur-md flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? "bg-orange-500 animate-ping" : "bg-gray-500"}`} />
        {isHovered ? "3D Rotation Active" : "Hover to Tilt"}
      </div>
    </div>
  );
}
