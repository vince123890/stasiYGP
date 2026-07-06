import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Paperclip } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Gallery } from "@/components/articles/Gallery";
import { formatDate, stripHtmlExcerpt } from "@/lib/format";
import { getArticleBySlug } from "@/lib/queries";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticleBySlug(slug);
  if (!result) return {};
  return {
    title: `${result.article.title} — Stasi Yohanes Gabriel Perboyre`,
    description: stripHtmlExcerpt(result.article.content),
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getArticleBySlug(slug);
  if (!result) notFound();

  const { article, images } = result;

  return (
    <article className="pb-24">
      <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden">
        {article.cover_image_url && (
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-parish-900/80 via-parish-900/20 to-transparent" />
      </div>

      <Container className="-mt-16 max-w-3xl">
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_20px_-6px_rgba(28,60,45,0.15)] sm:p-10">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-parish-600 hover:text-parish-700"
          >
            <ArrowLeft size={16} />
            Kembali ke Artikel
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {article.category && <Badge>{article.category.name}</Badge>}
          </div>

          <h1 className="mt-4 font-display text-3xl leading-tight text-parish-900 sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm font-medium uppercase tracking-wide text-parish-500">
            {formatDate(article.published_at)}
            {article.author && ` · ${article.author}`}
          </p>

          <div
            className="prose prose-parish mt-8 max-w-none text-base leading-relaxed text-parish-800/90"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {images.length > 0 && (
            <div className="mt-10 border-t border-parish-100 pt-8">
              <Gallery images={images} />
            </div>
          )}

          {article.attachment_url && (
            <div className="mt-8 border-t border-parish-100 pt-8">
              <a
                href={article.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-parish-600 hover:text-parish-700"
              >
                <Paperclip size={16} />
                Lihat lampiran di Google Drive
              </a>
            </div>
          )}
        </div>
      </Container>
    </article>
  );
}
