import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { getAnnouncementByIdAdmin } from "@/lib/admin/queries";
import { updateRowWithChildren } from "@/lib/admin/actions";
import { formToValues, parseRepeatedRows, slugify } from "@/lib/admin/form-helpers";

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAnnouncementByIdAdmin(id);
  if (!result) notFound();
  const { announcement, images } = result;

  async function action(formData: FormData) {
    "use server";

    const values = formToValues(formData, { boolFields: ["is_priority"] });
    if (!values.slug) values.slug = slugify(String(values.title ?? ""));

    const imageRows = parseRepeatedRows(formData, "images").map((r, i) => ({
      image_url: r.url,
      caption: r.caption || null,
      sort_order: i,
    }));

    await updateRowWithChildren(
      "announcements",
      id,
      values,
      { table: "announcement_images", parentColumn: "announcement_id", rows: imageRows },
      "/admin/pengumuman"
    );
  }

  return (
    <Container className="max-w-3xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Pengumuman</h1>
      <div className="mt-6">
        <AnnouncementForm announcement={announcement} images={images} action={action} />
      </div>
    </Container>
  );
}
