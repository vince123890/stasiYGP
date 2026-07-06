import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Banner";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { getTerritories } from "@/lib/queries";
import { deleteRow } from "@/lib/admin/actions";
import { Plus, Users } from "lucide-react";

export default async function AdminWilayahPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const territories = await getTerritories();

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("territories", id, "/admin/wilayah");
  }

  return (
    <Container className="max-w-none px-6 py-10 lg:px-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-parish-900">Wilayah & Lingkungan</h1>
        <Button href="/admin/wilayah/baru" size="sm">
          <Plus size={15} />
          Wilayah Baru
        </Button>
      </div>

      {success && <Banner type="success" message="Perubahan berhasil disimpan." className="mt-6" />}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {territories.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg text-parish-900">{t.name}</h3>
                <p className="text-sm text-parish-700/70">Ketua: {t.chairman}</p>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={`/admin/wilayah/${t.id}/edit`}
                  className="rounded-md px-2.5 py-1.5 text-sm font-medium text-parish-600 hover:bg-parish-50"
                >
                  Edit
                </a>
                <DeleteButton action={handleDelete.bind(null, t.id)} />
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-parish-700/60">
              <Users size={12} />
              {t.neighborhoods.length} lingkungan
            </p>
          </Card>
        ))}
        {territories.length === 0 && (
          <p className="text-sm text-parish-700/70">Belum ada wilayah.</p>
        )}
      </div>
    </Container>
  );
}
