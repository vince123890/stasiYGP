"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  confirmMessage = "Yakin ingin menghapus data ini?",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        aria-label="Hapus"
        className="flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
      >
        <Trash2 size={15} />
      </button>
    </form>
  );
}
