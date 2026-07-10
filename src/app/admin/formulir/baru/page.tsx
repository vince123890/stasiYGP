import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { createRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";

export default async function NewSacramentFormPage() {
  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["sort_order"] });
    await createRow("sacrament_forms", values, "/admin/formulir");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Formulir Baru</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/formulir"
          action={action}
          fields={[
            { type: "text", name: "name", label: "Nama Formulir", required: true },
            { type: "text", name: "category", label: "Kategori", required: true, placeholder: "Sakramen Baptis" },
            { type: "richtext", name: "description", label: "Deskripsi" },
            {
              type: "text",
              name: "file_url",
              label: "Link Google Drive",
              required: true,
              placeholder: "https://drive.google.com/...",
            },
            { type: "number", name: "sort_order", label: "Urutan Tampil" },
          ]}
        />
      </div>
    </Container>
  );
}
