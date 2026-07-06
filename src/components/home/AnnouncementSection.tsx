import Link from "next/link";
import { Megaphone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { formatDate, stripHtmlExcerpt } from "@/lib/format";
import type { Announcement } from "@/types/database";

export function AnnouncementSection({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Info Paroki"
          title="Pengumuman"
          description="Pernikahan, tahbisan, dan pengumuman penting seputar kehidupan paroki."
        />
        <Button href="/pengumuman" variant="outline" size="sm">
          Lihat Semua
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {announcements.map((a) => (
          <Link key={a.id} href={`/pengumuman/${a.slug}`}>
            <Card className="h-full p-5">
              <div className="flex items-center gap-2">
                <Badge>{a.category}</Badge>
                {a.is_priority && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-gold-600">
                    <Megaphone size={12} />
                    Penting
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-display text-lg leading-snug text-parish-900">
                {a.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-parish-700/75">
                {stripHtmlExcerpt(a.content)}
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-parish-500">
                {formatDate(a.published_at)}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
