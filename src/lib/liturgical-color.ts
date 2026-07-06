import type { LiturgicalColor } from "@/types/database";

export const LITURGICAL_COLOR_STYLES: Record<
  LiturgicalColor,
  { label: string; dot: string; bg: string; text: string }
> = {
  putih: { label: "Putih", dot: "bg-neutral-100 border border-neutral-300", bg: "bg-neutral-50", text: "text-neutral-700" },
  merah: { label: "Merah", dot: "bg-red-600", bg: "bg-red-50", text: "text-red-700" },
  hijau: { label: "Hijau", dot: "bg-parish-600", bg: "bg-parish-50", text: "text-parish-700" },
  ungu: { label: "Ungu", dot: "bg-violet-600", bg: "bg-violet-50", text: "text-violet-700" },
  merah_muda: { label: "Merah Muda", dot: "bg-pink-400", bg: "bg-pink-50", text: "text-pink-700" },
};
