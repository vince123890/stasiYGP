import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { Banner } from "@/components/ui/Banner";
import { getMassIntentionsInfo } from "@/lib/queries";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { formToValues } from "@/lib/admin/form-helpers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function AdminIntensiMisaPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const info = await getMassIntentionsInfo();

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData);
    const supabase = await createAuthClient();
    const { error } = await supabase.from("mass_intentions_info").upsert({ id: 1, ...values });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/intensi-misa");
    revalidatePath("/", "layout");
    redirect("/admin/intensi-misa?success=1");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Intensi Misa</h1>
      {success && <Banner type="success" message="Perubahan berhasil disimpan." className="mt-6" />}
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin"
          action={action}
          values={info ?? undefined}
          fields={[
            { type: "text", name: "contact_wa", label: "Kontak WhatsApp" },
            { type: "richtext", name: "format_info", label: "Format Intensi" },
            { type: "richtext", name: "deadline_info", label: "Batas Penyampaian" },
            { type: "richtext", name: "offering_info", label: "Info Persembahan" },
            { type: "text", name: "church_account_name", label: "Rekening Gereja - Atas Nama" },
            { type: "text", name: "church_bank_name", label: "Rekening Gereja - Nama Bank" },
            { type: "text", name: "church_account_number", label: "Rekening Gereja - Nomor" },
            { type: "text", name: "social_account_name", label: "Rekening Sosial - Atas Nama" },
            { type: "text", name: "social_bank_name", label: "Rekening Sosial - Nama Bank" },
            { type: "text", name: "social_account_number", label: "Rekening Sosial - Nomor" },
          ]}
        />
      </div>
    </Container>
  );
}
