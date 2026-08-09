import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  number?: string;
  overline?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  number,
  overline,
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14 pt-2 md:pt-4 relative z-10 flex flex-col space-y-3",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      {(number || overline) && (
        <span className="text-overline text-orange-500 font-mono tracking-widest block relative z-20 leading-none">
          {number && <span className="text-orange-400 font-bold">{number} / </span>}
          {overline}
        </span>
      )}
      <h2 className={cn("text-display-lg text-gray-050 font-display tracking-tight relative z-10 leading-tight", titleClassName)}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-body-lg text-gray-300 mt-1 leading-relaxed relative z-10",
            align === "center" && "mx-auto text-center"
          )}
          style={{
            maxWidth: "680px",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
