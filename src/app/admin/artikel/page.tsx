import Link from "next/link";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { Banner } from "@/components/ui/Banner";
import { formatDate } from "@/lib/format";
import { getAllArticlesAdmin } from "@/lib/admin/queries";
import { deleteRow } from "@/lib/admin/actions";

export default async function AdminArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const articles = await getAllArticlesAdmin();

  async function handleDelete(id: string) {
    "use server";
    await deleteRow("articles", id, "/admin/artikel");
  }

  return (
    <Container className="max-w-none px-6 py-10 lg:px-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-parish-900">Artikel</h1>
        <Button href="/admin/artikel/baru" size="sm">
          <Plus size={15} />
          Artikel Baru
        </Button>
      </div>

      {success && <Banner type="success" message="Perubahan berhasil disimpan." className="mt-6" />}

      <div className="mt-6">
        <DataTable
          rows={articles}
          emptyMessage="Belum ada artikel."
          columns={[
            {
              header: "Judul",
              cell: (a) => (
                <div>
                  <p className="font-medium text-parish-900">{a.title}</p>
                  <p className="text-xs text-parish-700/60">{a.category?.name}</p>
                </div>
              ),
            },
            {
              header: "Status",
              cell: (a) => (
                <Badge className={a.status === "draft" ? "bg-gold-500/10 text-gold-600" : undefined}>
                  {a.status}
                </Badge>
              ),
            },
            { header: "Tanggal", cell: (a) => formatDate(a.published_at) },
            {
              header: "",
              cell: (a) => (
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/artikel/${a.id}/edit`}
                    className="rounded-md px-2.5 py-1.5 text-sm font-medium text-parish-600 hover:bg-parish-50"
                  >
                    Edit
                  </Link>
                  <DeleteButton action={handleDelete.bind(null, a.id)} />
                </div>
              ),
              className: "px-4 py-3 text-right",
            },
          ]}
        />
      </div>
    </Container>
  );
}
