import { SimpleListPage } from "@/components/admin/SimpleListPage";
import { getRowsAdmin } from "@/lib/admin/queries";
import { deleteRow } from "@/lib/admin/actions";
import type { MassSchedule } from "@/types/database";

export default async function AdminJadwalMisaPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const rows = await getRowsAdmin<MassSchedule>("mass_schedules");

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("mass_schedules", id, "/admin/jadwal-misa");
  }

  return (
    <SimpleListPage
      title="Jadwal Misa"
      newHref="/admin/jadwal-misa/baru"
      newLabel="Jadwal Baru"
      rows={rows}
      onDelete={handleDelete}
      success={success}
      editHrefBase="/admin/jadwal-misa"
      emptyMessage="Belum ada jadwal misa."
      columns={[
        { header: "Kapel", cell: (r) => r.chapel },
        { header: "Kategori", cell: (r) => r.category },
        { header: "Hari", cell: (r) => r.day_label },
        { header: "Jam", cell: (r) => r.time },
      ]}
    />
  );
}
