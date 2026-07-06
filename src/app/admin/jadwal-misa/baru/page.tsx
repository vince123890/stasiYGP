import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { createRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";

export default async function NewMassSchedulePage() {
  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["sort_order"] });
    await createRow("mass_schedules", values, "/admin/jadwal-misa");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Jadwal Misa Baru</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/jadwal-misa"
          action={action}
          fields={[
            { type: "text", name: "chapel", label: "Kapel", required: true, placeholder: "Kapel IMAVI" },
            { type: "text", name: "category", label: "Kategori", required: true, placeholder: "Misa Harian" },
            { type: "text", name: "day_label", label: "Hari", required: true, placeholder: "Senin - Kamis" },
            { type: "text", name: "time", label: "Jam", required: true, placeholder: "05.30" },
            { type: "text", name: "stream_url", label: "Link Streaming (opsional)" },
            { type: "number", name: "sort_order", label: "Urutan Tampil" },
          ]}
        />
      </div>
    </Container>
  );
}
