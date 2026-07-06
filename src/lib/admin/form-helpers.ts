export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Extracts non-empty string/number fields from FormData, coercing "" to null and numeric-looking fields via `numberFields`/`boolFields`. */
export function formToValues(
  formData: FormData,
  options?: { numberFields?: string[]; boolFields?: string[] }
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  const numberFields = new Set(options?.numberFields ?? []);
  const boolFields = new Set(options?.boolFields ?? []);

  for (const [key, raw] of formData.entries()) {
    if (key === "id" || key.startsWith("_")) continue;
    const value = typeof raw === "string" ? raw : "";

    if (boolFields.has(key)) {
      values[key] = value === "on" || value === "true";
      continue;
    }
    if (numberFields.has(key)) {
      values[key] = value === "" ? null : Number(value);
      continue;
    }
    values[key] = value === "" ? null : value;
  }

  for (const key of boolFields) {
    if (!(key in values)) values[key] = false;
  }

  return values;
}

/** Parses repeated bracketed form fields like images[0][url], images[0][caption] into an array of row objects. */
export function parseRepeatedRows(
  formData: FormData,
  prefix: string
): Record<string, string>[] {
  const rows: Record<string, Record<string, string>> = {};

  for (const [key, raw] of formData.entries()) {
    const match = key.match(new RegExp(`^${prefix}\\[(\\d+)\\]\\[(\\w+)\\]$`));
    if (!match) continue;
    const [, index, field] = match;
    const value = typeof raw === "string" ? raw : "";
    rows[index] = rows[index] ?? {};
    rows[index][field] = value;
  }

  return Object.keys(rows)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => rows[k])
    .filter((r) => Object.values(r).some((v) => v.trim() !== ""));
}
