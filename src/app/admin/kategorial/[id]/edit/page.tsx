import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { getRowByIdAdmin } from "@/lib/admin/queries";
import { updateRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";
import type { CategoricalGroup } from "@/types/database";

export default async function EditCategoricalGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getRowByIdAdmin<CategoricalGroup>("categorical_groups", id);
  if (!row) notFound();

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["sort_order"] });
    await updateRow("categorical_groups", id, values, "/admin/kategorial");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Kategorial</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/kategorial"
          action={action}
          values={row}
          fields={[
            { type: "text", name: "name", label: "Nama", required: true },
            { type: "richtext", name: "content", label: "Deskripsi" },
            { type: "text", name: "schedule", label: "Jadwal Pertemuan" },
            { type: "text", name: "contact", label: "Kontak Person" },
            { type: "number", name: "sort_order", label: "Urutan Tampil" },
          ]}
        />
      </div>
    </Container>
  );
}
