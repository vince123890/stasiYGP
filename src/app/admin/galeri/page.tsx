import { SimpleListPage } from "@/components/admin/SimpleListPage";
import { getGalleries } from "@/lib/queries";
import { deleteRow } from "@/lib/admin/actions";

export default async function AdminGaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const rows = await getGalleries();

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("galleries", id, "/admin/galeri");
  }

  return (
    <SimpleListPage
      title="Galeri"
      newHref="/admin/galeri/baru"
      newLabel="Galeri Baru"
      rows={rows}
      onDelete={handleDelete}
      success={success}
      editHrefBase="/admin/galeri"
      emptyMessage="Belum ada galeri."
      columns={[
        { header: "Judul", cell: (r) => r.title },
        { header: "Jumlah Foto", cell: (r) => r.images?.length ?? 0 },
      ]}
    />
  );
}
