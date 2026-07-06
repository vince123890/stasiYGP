import Image from "next/image";
import { SimpleListPage } from "@/components/admin/SimpleListPage";
import { getRowsAdmin } from "@/lib/admin/queries";
import { deleteRow } from "@/lib/admin/actions";
import type { HeroSlide } from "@/types/database";

export default async function AdminHeroSlidesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const rows = await getRowsAdmin<HeroSlide>("hero_slides");

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("hero_slides", id, "/admin/hero-slides");
  }

  return (
    <SimpleListPage
      title="Hero Slides"
      newHref="/admin/hero-slides/baru"
      newLabel="Slide Baru"
      rows={rows}
      onDelete={handleDelete}
      success={success}
      editHrefBase="/admin/hero-slides"
      emptyMessage="Belum ada hero slide."
      columns={[
        {
          header: "Gambar",
          cell: (r) => (
            <div className="relative h-12 w-20 overflow-hidden rounded-md bg-parish-100">
              <Image src={r.image_url} alt="" fill className="object-cover" sizes="80px" />
            </div>
          ),
        },
        { header: "Judul", cell: (r) => r.title },
        { header: "Urutan", cell: (r) => r.sort_order },
      ]}
    />
  );
}
