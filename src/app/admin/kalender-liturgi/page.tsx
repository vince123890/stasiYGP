import { SimpleListPage } from "@/components/admin/SimpleListPage";
import { LITURGICAL_COLOR_STYLES } from "@/lib/liturgical-color";
import { formatDate } from "@/lib/format";
import { getRowsAdmin } from "@/lib/admin/queries";
import { deleteRow } from "@/lib/admin/actions";
import type { LiturgicalDay } from "@/types/database";

export default async function AdminKalenderLiturgiPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const rows = await getRowsAdmin<LiturgicalDay>("liturgical_calendar", "calendar_date");

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("liturgical_calendar", id, "/admin/kalender-liturgi");
  }

  return (
    <SimpleListPage
      title="Kalender Liturgi"
      newHref="/admin/kalender-liturgi/baru"
      newLabel="Tambah Tanggal"
      rows={rows}
      onDelete={handleDelete}
      success={success}
      editHrefBase="/admin/kalender-liturgi"
      emptyMessage="Belum ada data kalender liturgi."
      columns={[
        { header: "Tanggal", cell: (r) => formatDate(r.calendar_date) },
        { header: "Perayaan", cell: (r) => r.celebration_name },
        {
          header: "Warna",
          cell: (r) => (
            <span className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${LITURGICAL_COLOR_STYLES[r.liturgical_color].dot}`} />
              {LITURGICAL_COLOR_STYLES[r.liturgical_color].label}
            </span>
          ),
        },
        { header: "Tingkat", cell: (r) => r.rank ?? "-" },
      ]}
    />
  );
}
