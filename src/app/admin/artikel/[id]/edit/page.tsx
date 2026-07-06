import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getArticleByIdAdmin, getCategoriesAdmin } from "@/lib/admin/queries";
import { updateRowWithChildren } from "@/lib/admin/actions";
import { formToValues, parseRepeatedRows, slugify } from "@/lib/admin/form-helpers";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, categories] = await Promise.all([
    getArticleByIdAdmin(id),
    getCategoriesAdmin(),
  ]);

  if (!result) notFound();
  const { article, images } = result;

  async function action(formData: FormData) {
    "use server";

    const values = formToValues(formData);
    if (!values.slug) values.slug = slugify(String(values.title ?? ""));

    const imageRows = parseRepeatedRows(formData, "images").map((r, i) => ({
      image_url: r.url,
      caption: r.caption || null,
      sort_order: i,
    }));

    await updateRowWithChildren(
      "articles",
      id,
      values,
      { table: "article_images", parentColumn: "article_id", rows: imageRows },
      "/admin/artikel"
    );
  }

  return (
    <Container className="max-w-3xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Artikel</h1>
      <div className="mt-6">
        <ArticleForm article={article} images={images} categories={categories} action={action} />
      </div>
    </Container>
  );
}
