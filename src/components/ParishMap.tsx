// Default lokasi Kapel YGP (Yohanes Gabriel Perboyre), dipakai bila
// map_embed_url belum diisi di database.
export const DEFAULT_MAP_EMBED_URL =
  "https://www.google.com/maps?q=-7.2703455,112.812843&z=17&output=embed";

export function ParishMap({
  src,
  title,
  className = "h-72",
}: {
  src?: string | null;
  title?: string;
  className?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-parish-100">
      <iframe
        src={src || DEFAULT_MAP_EMBED_URL}
        title={title ?? "Peta Lokasi"}
        className={`w-full border-0 ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
