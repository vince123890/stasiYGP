import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/database";

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/artikel"
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
          !activeSlug
            ? "border-parish-600 bg-parish-600 text-white"
            : "border-parish-200 text-parish-700 hover:bg-parish-50"
        )}
      >
        Semua
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/artikel?category=${cat.slug}`}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            activeSlug === cat.slug
              ? "border-parish-600 bg-parish-600 text-white"
              : "border-parish-200 text-parish-700 hover:bg-parish-50"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
