import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { createRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";

export default async function NewHeroSlidePage() {
  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["sort_order"] });
    await createRow("hero_slides", values, "/admin/hero-slides");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Hero Slide Baru</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/hero-slides"
          action={action}
          fields={[
            { type: "image", name: "image_url", label: "Gambar" },
            { type: "text", name: "title", label: "Judul", required: true },
            { type: "text", name: "subtitle", label: "Subjudul" },
            { type: "text", name: "link_url", label: "Tautan (opsional)", placeholder: "/jadwal-misa" },
            { type: "number", name: "sort_order", label: "Urutan Tampil" },
          ]}
        />
      </div>
    </Container>
  );
}
