import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { getRowByIdAdmin } from "@/lib/admin/queries";
import { updateRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";
import type { MassSchedule } from "@/types/database";

export default async function EditMassSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getRowByIdAdmin<MassSchedule>("mass_schedules", id);
  if (!row) notFound();

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["sort_order"] });
    await updateRow("mass_schedules", id, values, "/admin/jadwal-misa");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Jadwal Misa</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/jadwal-misa"
          action={action}
          values={row}
          fields={[
            { type: "text", name: "chapel", label: "Kapel", required: true },
            { type: "text", name: "category", label: "Kategori", required: true },
            { type: "text", name: "day_label", label: "Hari", required: true },
            { type: "text", name: "time", label: "Jam", required: true },
            { type: "text", name: "stream_url", label: "Link Streaming (opsional)" },
            { type: "number", name: "sort_order", label: "Urutan Tampil" },
          ]}
        />
      </div>
    </Container>
  );
}
