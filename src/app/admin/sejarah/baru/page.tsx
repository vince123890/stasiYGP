import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { createRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";

export default async function NewHistoryPage() {
  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["year", "sort_order"] });
    await createRow("parish_history", values, "/admin/sejarah");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Tambah Sejarah</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/sejarah"
          action={action}
          fields={[
            { type: "number", name: "year", label: "Tahun", required: true },
            { type: "text", name: "category", label: "Kategori", required: true, placeholder: "Pendirian" },
            { type: "richtext", name: "content", label: "Isi" },
            { type: "number", name: "sort_order", label: "Urutan Tampil" },
          ]}
        />
      </div>
    </Container>
  );
}
