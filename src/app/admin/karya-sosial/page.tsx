import { SimpleListPage } from "@/components/admin/SimpleListPage";
import { getRowsAdmin } from "@/lib/admin/queries";
import { deleteRow } from "@/lib/admin/actions";
import type { SocialMinistry } from "@/types/database";

export default async function AdminKaryaSosialPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const rows = await getRowsAdmin<SocialMinistry>("social_ministries");

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("social_ministries", id, "/admin/karya-sosial");
  }

  return (
    <SimpleListPage
      title="Karya Sosial"
      newHref="/admin/karya-sosial/baru"
      newLabel="Karya Sosial Baru"
      rows={rows}
      onDelete={handleDelete}
      success={success}
      editHrefBase="/admin/karya-sosial"
      emptyMessage="Belum ada karya sosial."
      columns={[
        { header: "Nama", cell: (r) => r.name },
        { header: "Ikon", cell: (r) => r.icon ?? "-" },
      ]}
    />
  );
}
