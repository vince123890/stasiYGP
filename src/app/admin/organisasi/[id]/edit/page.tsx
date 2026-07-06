import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { OrganizationMemberForm } from "@/components/admin/OrganizationMemberForm";
import { getOrganizationMembers } from "@/lib/queries";
import { getRowByIdAdmin } from "@/lib/admin/queries";
import { updateRow } from "@/lib/admin/actions";
import { formToValues } from "@/lib/admin/form-helpers";
import type { OrganizationMember } from "@/types/database";

export default async function EditOrganizationMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [member, allBgks, allDps] = await Promise.all([
    getRowByIdAdmin<OrganizationMember>("organization_members", id),
    getOrganizationMembers("BGKS"),
    getOrganizationMembers("DPS"),
  ]);

  if (!member) notFound();

  async function action(formData: FormData) {
    "use server";
    const values = formToValues(formData, { numberFields: ["sort_order"] });
    await updateRow("organization_members", id, values, "/admin/organisasi");
  }

  return (
    <Container className="max-w-2xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-2xl text-parish-900">Edit Anggota Organisasi</h1>
      <div className="mt-6">
        <OrganizationMemberForm member={member} allBgks={allBgks} allDps={allDps} action={action} />
      </div>
    </Container>
  );
}
