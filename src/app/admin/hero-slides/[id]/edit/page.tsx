import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { getRowByIdAdmin } from "@/lib/admin/queries";
import { updateRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";
import type { HeroSlide } from "@/types/database";

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getRowByIdAdmin<HeroSlide>("hero_slides", id);
  if (!row) notFound();

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["sort_order"] });
    await updateRow("hero_slides", id, values, "/admin/hero-slides");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Hero Slide</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/hero-slides"
          action={action}
          values={row}
          fields={[
            { type: "image", name: "image_url", label: "Gambar" },
            { type: "text", name: "title", label: "Judul", required: true },
            { type: "text", name: "subtitle", label: "Subjudul" },
            { type: "text", name: "link_url", label: "Tautan (opsional)" },
            { type: "number", name: "sort_order", label: "Urutan Tampil" },
          ]}
        />
      </div>
    </Container>
  );
}
