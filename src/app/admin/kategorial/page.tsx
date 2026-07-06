import { SimpleListPage } from "@/components/admin/SimpleListPage";
import { getRowsAdmin } from "@/lib/admin/queries";
import { deleteRow } from "@/lib/admin/actions";
import type { CategoricalGroup } from "@/types/database";

export default async function AdminKategorialPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const rows = await getRowsAdmin<CategoricalGroup>("categorical_groups");

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("categorical_groups", id, "/admin/kategorial");
  }

  return (
    <SimpleListPage
      title="Kategorial"
      newHref="/admin/kategorial/baru"
      newLabel="Kategorial Baru"
      rows={rows}
      onDelete={handleDelete}
      success={success}
      editHrefBase="/admin/kategorial"
      emptyMessage="Belum ada kelompok kategorial."
      columns={[
        { header: "Nama", cell: (r) => r.name },
        { header: "Jadwal", cell: (r) => r.schedule ?? "-" },
        { header: "Kontak", cell: (r) => r.contact ?? "-" },
      ]}
    />
  );
}
