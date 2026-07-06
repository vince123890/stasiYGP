import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { createRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";

export default async function NewTerritoryPage() {
  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData);
    await createRow("territories", values, "/admin/wilayah");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Wilayah Baru</h1>
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin/wilayah"
          action={action}
          fields={[
            { type: "text", name: "name", label: "Nama Wilayah", required: true },
            { type: "text", name: "chairman", label: "Ketua Wilayah", required: true },
          ]}
        />
      </div>
    </Container>
  );
}
