import { Container } from "@/components/ui/Container";
import { OrganizationMemberForm } from "@/components/admin/OrganizationMemberForm";
import { getOrganizationMembers } from "@/lib/queries";
import { createRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";

export default async function NewOrganizationMemberPage() {
  const [allBgks, allDps] = await Promise.all([
    getOrganizationMembers("BGKS"),
    getOrganizationMembers("DPS"),
  ]);

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["sort_order"] });
    await createRow("organization_members", values, "/admin/organisasi");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Tambah Anggota Organisasi</h1>
      <div className="mt-6">
        <OrganizationMemberForm allBgks={allBgks} allDps={allDps} action={action} />
      </div>
    </Container>
  );
}
