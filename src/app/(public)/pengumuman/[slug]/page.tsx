import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Megaphone, Paperclip } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { formatDate, stripHtmlExcerpt } from "@/lib/format";
import { getAnnouncementBySlug } from "@/lib/queries";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getAnnouncementBySlug(slug);
  if (!result) return {};
  return {
    title: `${result.announcement.title} — Paroki Yohanes Gabriel Perboyre`,
    description: stripHtmlExcerpt(result.announcement.content),
  };
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getAnnouncementBySlug(slug);
  if (!result) notFound();

  const { announcement } = result;

  return (
    <Container className="max-w-3xl py-16">
      <Link
        href="/pengumuman"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-parish-600 hover:text-parish-700"
      >
        <ArrowLeft size={16} />
        Kembali ke Pengumuman
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Badge>{announcement.category}</Badge>
        {announcement.is_priority && (
          <span className="flex items-center gap-1 text-xs font-semibold text-gold-600">
            <Megaphone size={12} />
            Penting
          </span>
        )}
      </div>

      <h1 className="mt-4 font-display text-3xl leading-tight text-parish-900 sm:text-4xl">
        {announcement.title}
      </h1>
      <p className="mt-3 text-sm font-medium uppercase tracking-wide text-parish-500">
        {formatDate(announcement.published_at)}
      </p>

      <RichTextContent
        html={announcement.content}
        className="mt-8 text-base text-parish-800/90"
      />

      {announcement.attachment_url && (
        <div className="mt-8 border-t border-parish-100 pt-8">
          <a
            href={announcement.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-parish-600 hover:text-parish-700"
          >
            <Paperclip size={16} />
            Lihat lampiran di Google Drive
          </a>
        </div>
      )}
    </Container>
  );
}
