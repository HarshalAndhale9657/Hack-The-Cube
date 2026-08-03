import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  wide?: boolean;
  as?: "section" | "div" | "main";
  id?: string;
}

export function SectionContainer({
  children,
  className,
  wide = false,
  as: Component = "section",
  id,
}: SectionContainerProps) {
  return (
    <Component
      id={id}
      className={cn(
        "w-full mx-auto flex flex-col items-center py-24 md:py-32 overflow-hidden",
        wide ? "max-w-[1440px]" : "max-w-[1400px]",
        className
      )}
      style={{
        paddingInline: "var(--container-padding)",
      }}
    >
      {children}
    </Component>
  );
}
