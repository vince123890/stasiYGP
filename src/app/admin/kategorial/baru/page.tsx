import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { createRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";

export default async function NewCategoricalGroupPage() {
  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["sort_order"] });
    await createRow("categorical_groups", values, "/admin/kategorial");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Kategorial Baru</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/kategorial"
          action={action}
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
