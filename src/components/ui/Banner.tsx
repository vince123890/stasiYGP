import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Banner({
  type,
  message,
  className,
}: {
  type: "success" | "error";
  message: string;
  className?: string;
}) {
  const isSuccess = type === "success";
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-3 text-sm",
        isSuccess ? "bg-parish-50 text-parish-700" : "bg-red-50 text-red-700",
        className
      )}
    >
      {isSuccess ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}
