import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { createRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";

export default async function NewPastorPage() {
  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["serve_from", "serve_to", "sort_order"] });
    await createRow("pastors", values, "/admin/pastor");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Pastor Baru</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/pastor"
          action={action}
          fields={[
            { type: "image", name: "photo_url", label: "Foto" },
            { type: "text", name: "name", label: "Nama", required: true },
            { type: "text", name: "nickname", label: "Nama Panggilan" },
            {
              type: "select",
              name: "pastor_type",
              label: "Status",
              options: [
                { value: "Gembala Kami", label: "Gembala Kami" },
                { value: "Pernah Berkarya", label: "Pernah Berkarya" },
              ],
            },
            {
              type: "select",
              name: "priest_type",
              label: "Tipe",
              options: [
                { value: "Romo Paroki", label: "Romo Paroki" },
                { value: "Romo Rekan", label: "Romo Rekan" },
              ],
            },
            { type: "date", name: "ordination_date", label: "Tanggal Tahbisan" },
            { type: "number", name: "serve_from", label: "Berkarya Dari (Tahun)" },
            { type: "number", name: "serve_to", label: "Berkarya Sampai (Tahun, kosongkan jika masih aktif)" },
            { type: "richtext", name: "biography", label: "Biografi Singkat" },
            { type: "number", name: "sort_order", label: "Urutan Tampil" },
          ]}
        />
      </div>
    </Container>
  );
}
