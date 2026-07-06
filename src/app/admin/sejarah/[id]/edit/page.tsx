import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { getRowByIdAdmin } from "@/lib/admin/queries";
import { updateRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";
import type { ParishHistory } from "@/types/database";

export default async function EditHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getRowByIdAdmin<ParishHistory>("parish_history", id);
  if (!row) notFound();

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["year", "sort_order"] });
    await updateRow("parish_history", id, values, "/admin/sejarah");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Sejarah</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/sejarah"
          action={action}
          values={row}
          fields={[
            { type: "number", name: "year", label: "Tahun", required: true },
            { type: "text", name: "category", label: "Kategori", required: true },
            { type: "richtext", name: "content", label: "Isi" },
            { type: "number", name: "sort_order", label: "Urutan Tampil" },
          ]}
        />
      </div>
    </Container>
  );
}
