import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, stripHtmlExcerpt } from "@/lib/format";
import type { Article } from "@/types/database";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/artikel/${article.slug}`} className="group block">
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {article.cover_image_url ? (
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 380px, 100vw"
            />
          ) : (
            <div className="h-full w-full bg-parish-100" />
          )}
        </div>
        <div className="p-5">
          {article.category && <Badge>{article.category.name}</Badge>}
          <h3 className="mt-3 font-display text-lg leading-snug text-parish-900 group-hover:text-parish-700">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-parish-700/75">
            {stripHtmlExcerpt(article.content)}
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-parish-500">
            {formatDate(article.published_at)}
          </p>
        </div>
      </Card>
    </Link>
  );
}
