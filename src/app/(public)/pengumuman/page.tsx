import Link from "next/link";
import { Megaphone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDate, stripHtmlExcerpt } from "@/lib/format";
import { getAnnouncements } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengumuman — Paroki Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

export default async function PengumumanPage() {
  const announcements = await getAnnouncements();

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Info Paroki"
        title="Pengumuman"
        description="Pernikahan, tahbisan, dan pengumuman penting seputar kehidupan paroki."
      />

      <div className="mt-10 grid gap-4">
        {announcements.map((a) => (
          <Link key={a.id} href={`/pengumuman/${a.slug}`}>
            <Card className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{a.category}</Badge>
                {a.is_priority && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-gold-600">
                    <Megaphone size={12} />
                    Penting
                  </span>
                )}
                <span className="ml-auto text-xs font-medium uppercase tracking-wide text-parish-500">
                  {formatDate(a.published_at)}
                </span>
              </div>
              <h3 className="mt-2 font-display text-lg text-parish-900">{a.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-parish-700/75">
                {stripHtmlExcerpt(a.content)}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
