import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { getRowByIdAdmin } from "@/lib/admin/queries";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { updateRowWithChildren } from "@/lib/admin/actions";
import { formToValues, parseRepeatedRows } from "@/lib/admin/form-helpers";
import type { Gallery, GalleryImage } from "@/types/database";

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gallery = await getRowByIdAdmin<Gallery>("galleries", id);
  if (!gallery) notFound();

  const supabase = await createAuthClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("gallery_id", id)
    .order("sort_order");

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData);

    const imageRows = parseRepeatedRows(formData, "images").map((r, i) => ({
      image_url: r.url,
      caption: r.caption || null,
      sort_order: i,
    }));

    await updateRowWithChildren(
      "galleries",
      id,
      values,
      { table: "gallery_images", parentColumn: "gallery_id", rows: imageRows },
      "/admin/galeri"
    );
  }

  return (
    <Container className="max-w-3xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Galeri</h1>
      <div className="mt-6">
        <GalleryForm gallery={gallery} images={(images ?? []) as GalleryImage[]} action={action} />
      </div>
    </Container>
  );
}
