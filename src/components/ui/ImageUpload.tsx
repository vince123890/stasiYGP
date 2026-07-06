"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ImageUpload({
  name,
  defaultValue,
  label = "Gambar",
}: {
  name: string;
  defaultValue?: string | null;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("media").upload(path, file);

    if (uploadError) {
      setError("Gagal mengunggah gambar.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <label className="text-sm font-medium text-parish-800">{label}</label>
      <div className="mt-1 flex items-start gap-3">
        {url ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-parish-100">
            <Image src={url} alt="" fill className="object-cover" sizes="80px" />
            <button
              type="button"
              onClick={() => setUrl("")}
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-parish-200 text-parish-400">
            <Upload size={20} />
          </div>
        )}

        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="block w-full text-sm text-parish-700 file:mr-3 file:rounded-full file:border-0 file:bg-parish-50 file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-parish-700 hover:file:bg-parish-100"
          />
          {uploading && <p className="mt-1 text-xs text-parish-700/60">Mengunggah...</p>}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input type="hidden" name={name} value={url} readOnly />
    </div>
  );
}
