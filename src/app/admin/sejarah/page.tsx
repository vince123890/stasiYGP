import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Banner";
import { ReorderableList } from "@/components/admin/ReorderableList";
import { getRowsAdmin } from "@/lib/admin/queries";
import { deleteRow, reorderRows } from "@/lib/admin/actions";
import type { ParishHistory } from "@/types/database";
import { Plus } from "lucide-react";

export default async function AdminSejarahPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const rows = await getRowsAdmin<ParishHistory>("parish_history");

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("parish_history", id, "/admin/sejarah");
  }

  async function handleReorder(orderedIds: string[]) {
    "use server";
    await reorderRows("parish_history", orderedIds, "/admin/sejarah");
  }

  return (
    <Container className="max-w-none px-6 py-10 lg:px-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-parish-900">Sejarah Paroki</h1>
        <Button href="/admin/sejarah/baru" size="sm">
          <Plus size={15} />
          Tambah Tahun
        </Button>
      </div>

      {success && <Banner type="success" message="Perubahan berhasil disimpan." className="mt-6" />}
      <p className="mt-4 text-sm text-parish-700/70">Seret (drag) untuk mengubah urutan tampil.</p>

      <div className="mt-3">
        <ReorderableList
          items={rows}
          editHrefBase="/admin/sejarah"
          onDelete={handleDelete}
          onReorder={handleReorder}
          renderLabel={(r) => (
            <div>
              <p className="font-medium text-parish-900">
                {r.year} — {r.category}
              </p>
            </div>
          )}
        />
      </div>
    </Container>
  );
}
