import { cn } from "@/utils/style";

type Props = React.ComponentProps<"div">;

export function Copyright({ className, ...props }: Props) {
  return (
    <div className={cn("text-xs leading-relaxed text-muted-foreground/80", className)} {...props}>
      <p>W简历 - 专业简历制作工具</p>
      <p className="mt-4">W简历 v{__APP_VERSION__}</p>
    </div>
  );
}
