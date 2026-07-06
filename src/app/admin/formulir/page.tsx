import { SimpleListPage } from "@/components/admin/SimpleListPage";
import { Badge } from "@/components/ui/Badge";
import { getRowsAdmin } from "@/lib/admin/queries";
import { deleteRow } from "@/lib/admin/actions";
import type { SacramentForm } from "@/types/database";

export default async function AdminFormulirPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const rows = await getRowsAdmin<SacramentForm>("sacrament_forms");

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("sacrament_forms", id, "/admin/formulir");
  }

  return (
    <SimpleListPage
      title="Formulir"
      newHref="/admin/formulir/baru"
      newLabel="Formulir Baru"
      rows={rows}
      onDelete={handleDelete}
      success={success}
      editHrefBase="/admin/formulir"
      emptyMessage="Belum ada formulir."
      columns={[
        { header: "Nama", cell: (r) => r.name },
        { header: "Kategori", cell: (r) => <Badge>{r.category}</Badge> },
      ]}
    />
  );
}
