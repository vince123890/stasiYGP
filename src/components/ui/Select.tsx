import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-parish-200 bg-white px-3 py-2 text-sm text-parish-900 outline-none focus:border-parish-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
