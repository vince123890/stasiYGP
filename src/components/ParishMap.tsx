export function ParishMap({ src, title }: { src: string; title?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-parish-100">
      <iframe
        src={src}
        title={title ?? "Peta Lokasi"}
        className="h-72 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
