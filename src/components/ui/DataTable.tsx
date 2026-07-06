import { Card } from "@/components/ui/Card";

export interface DataTableColumn<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  emptyMessage = "Belum ada data.",
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-parish-700/70">{emptyMessage}</Card>
    );
  }

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-parish-100 text-left text-xs font-semibold uppercase tracking-wide text-parish-500">
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-parish-50 last:border-0">
              {columns.map((col) => (
                <td key={col.header} className={col.className ?? "px-4 py-3 text-parish-800"}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
