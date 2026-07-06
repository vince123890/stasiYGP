import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGalleries } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri — Stasi Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

export default async function GaleriPage() {
  const galleries = await getGalleries();

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Dokumentasi"
        title="Galeri Foto"
        description="Momen-momen kegiatan Stasi Yohanes Gabriel Perboyre."
      />

      <div className="mt-10 space-y-10">
        {galleries.map((g) => (
          <Card key={g.id} className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg text-parish-900">{g.title}</h3>
              {g.google_photo_url && (
                <a
                  href={g.google_photo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-parish-600 hover:text-parish-700"
                >
                  Lihat album lengkap
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(g.images ?? []).map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={img.image_url}
                    alt={img.caption ?? g.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(min-width: 640px) 240px, 50vw"
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
