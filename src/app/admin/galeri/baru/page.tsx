import { Container } from "@/components/ui/Container";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { createRowWithChildren } from "@/lib/admin/actions";
import { formToValues, parseRepeatedRows } from "@/lib/admin/form-helpers";

export default async function NewGalleryPage() {
  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData);

    const imageRows = parseRepeatedRows(formData, "images").map((r, i) => ({
      image_url: r.url,
      caption: r.caption || null,
      sort_order: i,
    }));

    await createRowWithChildren(
      "galleries",
      values,
      { table: "gallery_images", parentColumn: "gallery_id", rows: imageRows },
      "/admin/galeri"
    );
  }

  return (
    <Container className="max-w-3xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Galeri Baru</h1>
      <div className="mt-6">
        <GalleryForm action={action} />
      </div>
    </Container>
  );
}
