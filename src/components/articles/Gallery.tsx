import Image from "next/image";
import type { ArticleImage } from "@/types/database";

export function Gallery({ images }: { images: ArticleImage[] }) {
  if (images.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-xl text-parish-900">Galeri Foto</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img) => (
          <figure
            key={img.id}
            className="relative aspect-square overflow-hidden rounded-xl bg-parish-100"
          >
            <Image
              src={img.image_url}
              alt={img.caption ?? ""}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(min-width: 640px) 240px, 50vw"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
