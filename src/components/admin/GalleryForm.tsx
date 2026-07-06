"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { Gallery, GalleryImage } from "@/types/database";

export function GalleryForm({
  gallery,
  images,
  action,
}: {
  gallery?: Gallery;
  images?: GalleryImage[];
  action: (formData: FormData) => void;
}) {
  const [rows, setRows] = useState(images ?? []);

  return (
    <form action={action} className="space-y-6">
      <Card className="space-y-4 p-6">
        <Field label="Judul Galeri" htmlFor="title">
          <Input id="title" name="title" required defaultValue={gallery?.title} />
        </Field>
        <Field label="Link Google Photos/Drive (opsional)" htmlFor="google_photo_url">
          <Input
            id="google_photo_url"
            name="google_photo_url"
            placeholder="https://photos.app.goo.gl/..."
            defaultValue={gallery?.google_photo_url ?? ""}
          />
        </Field>
      </Card>

      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-parish-900">Foto</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setRows((r) => [
                ...r,
                { id: crypto.randomUUID(), gallery_id: "", image_url: "", caption: "", sort_order: r.length },
              ])
            }
          >
            <Plus size={14} />
            Tambah Foto
          </Button>
        </div>

        {rows.map((img, i) => (
          <div
            key={img.id}
            className="flex items-start gap-3 border-t border-parish-100 pt-4 first:border-0 first:pt-0"
          >
            <div className="flex-1 space-y-2">
              <ImageUpload name={`images[${i}][url]`} label={`Foto ${i + 1}`} defaultValue={img.image_url} />
              <Input
                name={`images[${i}][caption]`}
                placeholder="Keterangan foto (opsional)"
                defaultValue={img.caption ?? ""}
              />
            </div>
            <button
              type="button"
              onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
              className="mt-6 flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </Card>

      <div className="flex justify-end gap-3">
        <Button href="/admin/galeri" variant="outline">
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
