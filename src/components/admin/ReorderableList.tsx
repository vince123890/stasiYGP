"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DeleteButton } from "@/components/ui/DeleteButton";

export function ReorderableList<T extends { id: string }>({
  items,
  renderLabel,
  editHrefBase,
  onDelete,
  onReorder,
}: {
  items: T[];
  renderLabel: (item: T) => React.ReactNode;
  editHrefBase: string;
  onDelete: (id: string) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
}) {
  const [rows, setRows] = useState(items);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    setRows((current) => {
      const next = [...current];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      startTransition(() => {
        onReorder(next.map((r) => r.id));
      });
      return next;
    });
    setDragIndex(null);
  }

  if (rows.length === 0) {
    return <Card className="p-8 text-center text-sm text-parish-700/70">Belum ada data.</Card>;
  }

  return (
    <Card className="divide-y divide-parish-100 p-0">
      {rows.map((item, i) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(i)}
          className="flex items-center gap-3 px-4 py-3"
        >
          <span className="cursor-grab text-parish-400">
            <GripVertical size={16} />
          </span>
          <div className="flex-1">{renderLabel(item)}</div>
          <Link
            href={`${editHrefBase}/${item.id}/edit`}
            className="rounded-md px-2.5 py-1.5 text-sm font-medium text-parish-600 hover:bg-parish-50"
          >
            Edit
          </Link>
          <DeleteButton action={onDelete.bind(null, item.id)} />
        </div>
      ))}
    </Card>
  );
}
