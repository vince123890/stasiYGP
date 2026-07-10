"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const TOOLBAR = [
  [{ header: [false, 2] }],
  ["bold", "italic"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  ["clean"],
];

export function RichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const modules = useMemo(() => ({ toolbar: TOOLBAR }), []);
  const [html, setHtml] = useState(defaultValue ?? "");
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rich-text-editor rounded-lg border border-parish-200 focus-within:border-parish-500">
      <ReactQuill
        theme="snow"
        defaultValue={defaultValue ?? ""}
        modules={modules}
        onChange={(value) => {
          setHtml(value);
          if (hiddenInputRef.current) hiddenInputRef.current.value = value;
        }}
      />
      <input type="hidden" ref={hiddenInputRef} name={name} defaultValue={html} readOnly />
    </div>
  );
}
