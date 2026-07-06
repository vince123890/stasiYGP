"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Neighborhood, Territory } from "@/types/database";

export function TerritoryForm({
  territory,
  neighborhoods,
  action,
}: {
  territory?: Territory;
  neighborhoods?: Neighborhood[];
  action: (formData: FormData) => void;
}) {
  const [rows, setRows] = useState(neighborhoods ?? []);

  return (
    <form action={action} className="space-y-6">
      <Card className="space-y-4 p-6">
        <Field label="Nama Wilayah" htmlFor="name">
          <Input id="name" name="name" required defaultValue={territory?.name} />
        </Field>
        <Field label="Ketua Wilayah" htmlFor="chairman">
          <Input id="chairman" name="chairman" required defaultValue={territory?.chairman} />
        </Field>
      </Card>

      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-parish-900">Lingkungan</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setRows((r) => [
                ...r,
                { id: crypto.randomUUID(), territory_id: "", name: "", chairman: "", family_count: 0 },
              ])
            }
          >
            <Plus size={14} />
            Tambah Lingkungan
          </Button>
        </div>

        {rows.map((n, i) => (
          <div
            key={n.id}
            className="grid grid-cols-[1fr_1fr_100px_auto] items-end gap-2 border-t border-parish-100 pt-4 first:border-0 first:pt-0"
          >
            <Field label="Nama Lingkungan" htmlFor={`nb-name-${i}`}>
              <Input id={`nb-name-${i}`} name={`neighborhoods[${i}][name]`} defaultValue={n.name} />
            </Field>
            <Field label="Ketua" htmlFor={`nb-chairman-${i}`}>
              <Input id={`nb-chairman-${i}`} name={`neighborhoods[${i}][chairman]`} defaultValue={n.chairman} />
            </Field>
            <Field label="Jml KK" htmlFor={`nb-count-${i}`}>
              <Input
                id={`nb-count-${i}`}
                name={`neighborhoods[${i}][family_count]`}
                type="number"
                defaultValue={n.family_count}
              />
            </Field>
            <button
              type="button"
              onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
              className="flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </Card>

      <div className="flex justify-end gap-3">
        <Button href="/admin/wilayah" variant="outline">
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
