import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-parish-200 px-3 py-2 text-sm text-parish-900 outline-none focus:border-parish-500",
        className
      )}
      {...props}
    />
  );
}
