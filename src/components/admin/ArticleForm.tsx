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
import type { Article, ArticleImage, Category } from "@/types/database";

export function ArticleForm({
  article,
  images,
  categories,
  action,
}: {
  article?: Article;
  images?: ArticleImage[];
  categories: Category[];
  action: (formData: FormData) => void;
}) {
  const [galleryRows, setGalleryRows] = useState(
    images && images.length > 0 ? images : []
  );

  return (
    <form action={action} className="space-y-6">
      <Card className="space-y-4 p-6">
        <Field label="Judul" htmlFor="title">
          <Input id="title" name="title" required defaultValue={article?.title} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug" htmlFor="slug" hint="Kosongkan untuk generate otomatis dari judul">
            <Input id="slug" name="slug" defaultValue={article?.slug} />
          </Field>
          <Field label="Penulis" htmlFor="author">
            <Input id="author" name="author" defaultValue={article?.author ?? ""} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kategori" htmlFor="category_id">
            <Select id="category_id" name="category_id" defaultValue={article?.category_id ?? ""}>
              <option value="">Tanpa kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status" htmlFor="status">
            <Select id="status" name="status" defaultValue={article?.status ?? "draft"}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </Field>
        </div>

        <Field label="Isi Artikel" htmlFor="content">
          <RichTextEditor name="content" defaultValue={article?.content} />
        </Field>

        <ImageUpload
          name="cover_image_url"
          label="Gambar Sampul"
          defaultValue={article?.cover_image_url}
        />

        <Field label="Lampiran Google Drive (opsional)" htmlFor="attachment_url">
          <Input
            id="attachment_url"
            name="attachment_url"
            placeholder="https://drive.google.com/..."
            defaultValue={article?.attachment_url ?? ""}
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
                { id: crypto.randomUUID(), article_id: "", image_url: "", caption: "", sort_order: rows.length } as ArticleImage,
              ])
            }
          >
            <Plus size={14} />
            Tambah Foto
          </Button>
        </div>

        {galleryRows.map((img, i) => (
          <div key={img.id} className="flex items-start gap-3 border-t border-parish-100 pt-4 first:border-0 first:pt-0">
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
        <Button href="/admin/artikel" variant="outline">
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
