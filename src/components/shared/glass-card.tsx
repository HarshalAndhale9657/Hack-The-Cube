import { cn } from "@/lib/utils";
import { type ReactNode, type CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  as?: "div" | "article" | "section";
  style?: CSSProperties;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  as: Component = "div",
  style,
}: GlassCardProps) {
  return (
    <Component
      className={cn(
        "glass-panel",
        hover && "card-hover glass-panel-hover",
        glow && "glow-orange-sm",
        className
      )}
      style={style}
    >
      {children}
    </Component>
  );
}
