import Link from "next/link";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { Banner } from "@/components/ui/Banner";

export function SimpleListPage<T extends { id: string }>({
  title,
  newHref,
  newLabel = "Tambah Baru",
  rows,
  columns,
  editHrefBase,
  onDelete,
  success,
  emptyMessage,
}: {
  title: string;
  newHref?: string;
  newLabel?: string;
  rows: T[];
  columns: DataTableColumn<T>[];
  editHrefBase?: string;
  onDelete: (id: string) => Promise<void>;
  success?: string;
  emptyMessage?: string;
}) {
  const allColumns: DataTableColumn<T>[] = [
    ...columns,
    {
      header: "",
      className: "px-4 py-3 text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          {editHrefBase && (
            <Link
              href={`${editHrefBase}/${row.id}/edit`}
              className="rounded-md px-2.5 py-1.5 text-sm font-medium text-parish-600 hover:bg-parish-50"
            >
              Edit
            </Link>
          )}
          <DeleteButton action={onDelete.bind(null, row.id)} />
        </div>
      ),
    },
  ];

  return (
    <Container className="max-w-none px-6 py-10 lg:px-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-parish-900">{title}</h1>
        {newHref && (
          <Button href={newHref} size="sm">
            <Plus size={15} />
            {newLabel}
          </Button>
        )}
      </div>

      {success && <Banner type="success" message="Perubahan berhasil disimpan." className="mt-6" />}

      <div className="mt-6">
        <DataTable rows={rows} columns={allColumns} emptyMessage={emptyMessage} />
      </div>
    </Container>
  );
}
