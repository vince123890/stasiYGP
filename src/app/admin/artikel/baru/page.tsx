import { Container } from "@/components/ui/Container";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getCategoriesAdmin } from "@/lib/admin/queries";
import { createRowWithChildren } from "@/lib/admin/actions";
import { formToValues, parseRepeatedRows, slugify } from "@/lib/admin/form-helpers";

export default async function NewArticlePage() {
  const categories = await getCategoriesAdmin();

  async function action(formData: FormData) {
    "use server";

    const values = formToValues(formData);
    if (!values.slug) values.slug = slugify(String(values.title ?? ""));
    if (!values.published_at) values.published_at = new Date().toISOString();

    const imageRows = parseRepeatedRows(formData, "images").map((r, i) => ({
      image_url: r.url,
      caption: r.caption || null,
      sort_order: i,
    }));

    await createRowWithChildren(
      "articles",
      values,
      { table: "article_images", parentColumn: "article_id", rows: imageRows },
      "/admin/artikel"
    );
  }

  return (
    <Container className="max-w-3xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Artikel Baru</h1>
      <div className="mt-6">
        <ArticleForm categories={categories} action={action} />
      </div>
    </Container>
  );
}
