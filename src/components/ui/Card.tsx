import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-parish-100 bg-white shadow-[0_2px_20px_-6px_rgba(28,60,45,0.12)] transition-shadow duration-200 hover:shadow-[0_8px_30px_-8px_rgba(28,60,45,0.18)]",
        className
      )}
    >
      {children}
    </div>
  );
}
