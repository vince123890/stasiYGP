import "react-quill-new/dist/quill.snow.css";
import { cn } from "@/lib/utils";

/**
 * Renders HTML produced by the Quill editor on public pages. Quill 2 draws
 * list markers (bullets/numbers/indent) via its own snow.css using the
 * `.ql-editor` scope, so we reuse that exact class instead of re-implementing
 * the counters — guaranteeing the public view matches the editor.
 */
export function RichTextContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div className={cn("ql-snow", className)}>
      <div
        className="ql-editor"
        style={{ padding: 0 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
