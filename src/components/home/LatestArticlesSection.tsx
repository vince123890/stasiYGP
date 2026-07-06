import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleCard } from "@/components/articles/ArticleCard";
import type { Article } from "@/types/database";

export function LatestArticlesSection({ articles }: { articles: Article[] }) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Kabar Paroki"
          title="Artikel & Pengumuman Terbaru"
          description="Ikuti perkembangan kegiatan dan pengumuman terkini dari paroki kita."
        />
        <Button href="/artikel" variant="outline" size="sm">
          Lihat Semua
        </Button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
