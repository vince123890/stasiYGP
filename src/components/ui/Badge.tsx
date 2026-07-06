import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-parish-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-parish-700",
        className
      )}
    >
      {children}
    </span>
  );
}
