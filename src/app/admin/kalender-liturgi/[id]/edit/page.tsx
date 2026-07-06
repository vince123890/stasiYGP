import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { getRowByIdAdmin } from "@/lib/admin/queries";
import { updateRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";
import type { LiturgicalDay } from "@/types/database";

const COLOR_OPTIONS = [
  { value: "hijau", label: "Hijau" },
  { value: "putih", label: "Putih" },
  { value: "merah", label: "Merah" },
  { value: "ungu", label: "Ungu" },
  { value: "merah_muda", label: "Merah Muda" },
];

export default async function EditLiturgicalDayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getRowByIdAdmin<LiturgicalDay>("liturgical_calendar", id);
  if (!row) notFound();

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData);
    await updateRow("liturgical_calendar", id, values, "/admin/kalender-liturgi");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Kalender Liturgi</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/kalender-liturgi"
          action={action}
          values={row}
          fields={[
            { type: "date", name: "calendar_date", label: "Tanggal", required: true },
            { type: "text", name: "celebration_name", label: "Nama Perayaan", required: true },
            { type: "select", name: "liturgical_color", label: "Warna Liturgi", options: COLOR_OPTIONS },
            { type: "text", name: "rank", label: "Tingkat" },
            { type: "text", name: "first_reading", label: "Bacaan I" },
            { type: "text", name: "psalm", label: "Mazmur" },
            { type: "text", name: "second_reading", label: "Bacaan II" },
            { type: "text", name: "gospel", label: "Injil" },
            { type: "text", name: "office_reading", label: "Bacaan Ofisi (BcO)" },
          ]}
        />
      </div>
    </Container>
  );
}
