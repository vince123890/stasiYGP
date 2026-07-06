import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold-600">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-medium text-parish-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-parish-700/80">{description}</p>
      )}
    </div>
  );
}
