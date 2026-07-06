import { SimpleListPage } from "@/components/admin/SimpleListPage";
import { Badge } from "@/components/ui/Badge";
import { getRowsAdmin } from "@/lib/admin/queries";
import { deleteRow } from "@/lib/admin/actions";
import type { Pastor } from "@/types/database";

export default async function AdminPastorPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const rows = await getRowsAdmin<Pastor>("pastors");

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("pastors", id, "/admin/pastor");
  }

  return (
    <SimpleListPage
      title="Pastor"
      newHref="/admin/pastor/baru"
      newLabel="Pastor Baru"
      rows={rows}
      onDelete={handleDelete}
      success={success}
      editHrefBase="/admin/pastor"
      emptyMessage="Belum ada data pastor."
      columns={[
        { header: "Nama", cell: (r) => r.name },
        { header: "Status", cell: (r) => <Badge>{r.pastor_type}</Badge> },
        { header: "Tipe", cell: (r) => r.priest_type },
        { header: "Periode", cell: (r) => `${r.serve_from ?? "-"}${r.serve_to ? `–${r.serve_to}` : ""}` },
      ]}
    />
  );
}
