import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Banner";
import { OrganizationTreeAdmin } from "@/components/admin/OrganizationTreeAdmin";
import { getOrganizationMembers } from "@/lib/queries";
import { deleteRow } from "@/lib/admin/actions";
import { Plus } from "lucide-react";

export default async function AdminOrganisasiPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const [bgks, dps] = await Promise.all([
    getOrganizationMembers("BGKS"),
    getOrganizationMembers("DPS"),
  ]);

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("organization_members", id, "/admin/organisasi");
  }

  return (
    <Container className="max-w-none px-6 py-10 lg:px-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-parish-900">Struktur Organisasi</h1>
        <Button href="/admin/organisasi/baru" size="sm">
          <Plus size={15} />
          Tambah Anggota
        </Button>
      </div>

      {success && <Banner type="success" message="Perubahan berhasil disimpan." className="mt-6" />}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-lg text-parish-900">BGKP</h2>
          <div className="mt-3">
            <OrganizationTreeAdmin members={bgks} onDelete={handleDelete} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-lg text-parish-900">DPP</h2>
          <div className="mt-3">
            <OrganizationTreeAdmin members={dps} onDelete={handleDelete} />
          </div>
        </Card>
      </div>
    </Container>
  );
}
