"use client";

import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { ImageUpload } from "@/components/ui/ImageUpload";

export type SimpleFieldConfig =
  | { type: "text" | "date" | "number"; name: string; label: string; required?: boolean; placeholder?: string }
  | { type: "textarea"; name: string; label: string; hint?: string }
  | { type: "richtext"; name: string; label: string }
  | { type: "image"; name: string; label: string }
  | { type: "select"; name: string; label: string; options: { value: string; label: string }[] }
  | { type: "checkbox"; name: string; label: string };

export function SimpleForm({
  fields,
  values,
  action,
  cancelHref,
}: {
  fields: SimpleFieldConfig[];
  values?: object;
  action: (formData: FormData) => void;
  cancelHref: string;
}) {
  const record = values as Record<string, unknown> | undefined;
  return (
    <form action={action} className="space-y-6">
      <Card className="space-y-4 p-6">
        {fields.map((f) => {
          const raw = record?.[f.name];
          const current = raw === null || raw === undefined ? "" : String(raw);

          if (f.type === "richtext") {
            return (
              <Field key={f.name} label={f.label} htmlFor={f.name}>
                <RichTextEditor name={f.name} defaultValue={current} />
              </Field>
            );
          }

          if (f.type === "image") {
            return <ImageUpload key={f.name} name={f.name} label={f.label} defaultValue={current} />;
          }

          if (f.type === "textarea") {
            return (
              <Field key={f.name} label={f.label} htmlFor={f.name} hint={f.hint}>
                <Textarea id={f.name} name={f.name} rows={4} defaultValue={current} />
              </Field>
            );
          }

          if (f.type === "select") {
            return (
              <Field key={f.name} label={f.label} htmlFor={f.name}>
                <Select id={f.name} name={f.name} defaultValue={current}>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>
            );
          }

          if (f.type === "checkbox") {
            return (
              <label key={f.name} className="flex items-center gap-2 text-sm text-parish-800">
                <input
                  type="checkbox"
                  name={f.name}
                  defaultChecked={Boolean(raw)}
                  className="h-4 w-4 rounded border-parish-300"
                />
                {f.label}
              </label>
            );
          }

          return (
            <Field key={f.name} label={f.label} htmlFor={f.name}>
              <Input
                id={f.name}
                name={f.name}
                type={f.type}
                required={f.required}
                placeholder={f.placeholder}
                defaultValue={current}
              />
            </Field>
          );
        })}
      </Card>

      <div className="flex justify-end gap-3">
        <Button href={cancelHref} variant="outline">
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}
