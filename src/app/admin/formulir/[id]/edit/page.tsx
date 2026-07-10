import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { getRowByIdAdmin } from "@/lib/admin/queries";
import { updateRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";
import type { SacramentForm } from "@/types/database";

export default async function EditSacramentFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getRowByIdAdmin<SacramentForm>("sacrament_forms", id);
  if (!row) notFound();

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["sort_order"] });
    await updateRow("sacrament_forms", id, values, "/admin/formulir");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Formulir</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/formulir"
          action={action}
          values={row}
          fields={[
            { type: "text", name: "name", label: "Nama Formulir", required: true },
            { type: "text", name: "category", label: "Kategori", required: true },
            { type: "richtext", name: "description", label: "Deskripsi" },
            { type: "text", name: "file_url", label: "Link Google Drive", required: true },
            { type: "number", name: "sort_order", label: "Urutan Tampil" },
          ]}
        />
      </div>
    </Container>
  );
}
