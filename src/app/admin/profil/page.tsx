import { Container } from "@/components/ui/Container";
import { SimpleForm } from "@/components/admin/SimpleForm";
import { Banner } from "@/components/ui/Banner";
import { getParishProfile } from "@/lib/queries";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { formToValues } from "@/lib/admin/form-helpers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function AdminProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const profile = await getParishProfile();

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData);
    const supabase = await createAuthClient();
    const { error } = await supabase.from("parish_profile").upsert({ id: 1, ...values });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/profil");
    revalidatePath("/", "layout");
    redirect("/admin/profil?success=1");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Profil Paroki</h1>
      {success && <Banner type="success" message="Perubahan berhasil disimpan." className="mt-6" />}
      <div className="mt-6">
        <SimpleForm
          cancelHref="/admin"
          action={action}
          values={profile ?? undefined}
          fields={[
            { type: "text", name: "stasi_name", label: "Nama Paroki", required: true },
            { type: "text", name: "paroki_name", label: "Nama Paroki Induk" },
            { type: "textarea", name: "address", label: "Alamat" },
            { type: "text", name: "phone1", label: "Telepon 1" },
            { type: "text", name: "phone2", label: "Telepon 2" },
            { type: "text", name: "email", label: "Email" },
            { type: "textarea", name: "office_hours", label: "Jam Operasional" },
            { type: "text", name: "whatsapp_url", label: "Link WhatsApp" },
            { type: "text", name: "instagram_url", label: "Link Instagram" },
            { type: "text", name: "youtube_url", label: "Link YouTube" },
            { type: "text", name: "facebook_url", label: "Link Facebook" },
            {
              type: "text",
              name: "map_embed_url",
              label: "Link Embed Google Maps",
              placeholder: "https://www.google.com/maps?q=LAT,LNG&z=17&output=embed",
            },
            { type: "richtext", name: "about_saint", label: "Tentang Santo Pelindung" },
            { type: "richtext", name: "vision", label: "Visi" },
            { type: "richtext", name: "mission", label: "Misi" },
          ]}
        />
      </div>
    </Container>
  );
}
