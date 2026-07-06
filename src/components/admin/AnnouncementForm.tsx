"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { Announcement, AnnouncementImage } from "@/types/database";

const CATEGORIES = [
  "Pernikahan",
  "Tahbisan Imam",
  "Tahbisan Diakon",
  "Pengumuman Paroki",
  "Pengumuman Stasi",
];

export function AnnouncementForm({
  announcement,
  images,
  action,
}: {
  announcement?: Announcement;
  images?: AnnouncementImage[];
  action: (formData: FormData) => void;
}) {
  const [galleryRows, setGalleryRows] = useState(images && images.length > 0 ? images : []);

  return (
    <form action={action} className="space-y-6">
      <Card className="space-y-4 p-6">
        <Field label="Judul" htmlFor="title">
          <Input id="title" name="title" required defaultValue={announcement?.title} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug" htmlFor="slug" hint="Kosongkan untuk generate otomatis dari judul">
            <Input id="slug" name="slug" defaultValue={announcement?.slug} />
          </Field>
          <Field label="Kategori" htmlFor="category">
            <Select id="category" name="category" defaultValue={announcement?.category ?? CATEGORIES[4]}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tanggal Publikasi" htmlFor="published_at">
            <Input
              id="published_at"
              name="published_at"
              type="date"
              defaultValue={announcement?.published_at?.slice(0, 10)}
            />
          </Field>
          <Field label="Status" htmlFor="status">
            <Select id="status" name="status" defaultValue={announcement?.status ?? "draft"}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-parish-800">
          <input
            type="checkbox"
            name="is_priority"
            defaultChecked={announcement?.is_priority}
            className="h-4 w-4 rounded border-parish-300"
          />
          Tandai sebagai pengumuman penting
        </label>

        <Field label="Isi Pengumuman" htmlFor="content">
          <RichTextEditor name="content" defaultValue={announcement?.content} />
        </Field>

        <Field label="Lampiran Google Drive (opsional)" htmlFor="attachment_url">
          <Input
            id="attachment_url"
            name="attachment_url"
            placeholder="https://drive.google.com/..."
            defaultValue={announcement?.attachment_url ?? ""}
          />
        </Field>
      </Card>

      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-parish-900">Galeri Foto</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setGalleryRows((rows) => [
                ...rows,
                {
                  id: crypto.randomUUID(),
                  announcement_id: "",
                  image_url: "",
                  caption: "",
                  sort_order: rows.length,
                } as AnnouncementImage,
              ])
            }
          >
            <Plus size={14} />
            Tambah Foto
          </Button>
        </div>

        {galleryRows.map((img, i) => (
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
              onClick={() => setGalleryRows((rows) => rows.filter((_, idx) => idx !== i))}
              className="mt-6 flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </Card>

      <div className="flex justify-end gap-3">
        <Button href="/admin/pengumuman" variant="outline">
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
