import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { getRowByIdAdmin } from "@/lib/admin/queries";
import { updateRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";
import type { SocialMinistry } from "@/types/database";

const ICON_OPTIONS = [
  { value: "Heart", label: "Heart" },
  { value: "Gift", label: "Gift" },
  { value: "Calendar", label: "Calendar" },
  { value: "BookOpen", label: "BookOpen" },
];

export default async function EditSocialMinistryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getRowByIdAdmin<SocialMinistry>("social_ministries", id);
  if (!row) notFound();

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["sort_order"] });
    await updateRow("social_ministries", id, values, "/admin/karya-sosial");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Karya Sosial</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/karya-sosial"
          action={action}
          values={row}
          fields={[
            { type: "text", name: "name", label: "Nama", required: true },
            { type: "textarea", name: "description", label: "Deskripsi Singkat" },
            { type: "select", name: "icon", label: "Ikon", options: ICON_OPTIONS },
            { type: "richtext", name: "activities", label: "Daftar Kegiatan" },
            { type: "number", name: "sort_order", label: "Urutan Tampil" },
          ]}
        />
      </div>
    </Container>
  );
}
