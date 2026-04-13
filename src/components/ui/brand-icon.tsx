import { cn } from "@/utils/style";

type Props = {
  variant?: "logo" | "icon";
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function BrandIcon({ className, size = "md" }: Props) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-primary font-black text-primary-foreground",
        size === "sm" ? "size-8" : size === "lg" ? "size-16" : "size-12",
        sizeClasses[size],
        className
      )}
    >
      W
    </div>
  );
}
