type ClassValue = string | number | null | undefined | false;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter((x) => typeof x === "string" && x.length > 0).join(" ");
}
