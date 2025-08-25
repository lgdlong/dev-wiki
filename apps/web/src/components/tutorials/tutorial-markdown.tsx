"use client";

import { useRef, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";

type Props = {
  value: string;
  onChange: (md: string) => void;
  height?: string;
};

export default function ToastEditor({
  value,
  onChange,
  height = "420px",
}: Props) {
  const ref = useRef<Editor>(null);

  // đồng bộ giá trị nếu cần (khi reset form)
  useEffect(() => {
    const inst = ref.current?.getInstance();
    if (inst && inst.getMarkdown() !== value) inst.setMarkdown(value);
  }, [value]);

  return (
    <Editor
      ref={ref}
      theme="dark"
      initialEditType="markdown"
      hideModeSwitch={true} // chỉ Markdown (không cho đổi sang WYSIWYG)
      previewStyle="vertical" // Markdown + Preview
      height={height}
      useCommandShortcut={true}
      autofocus={false}
      // gọi onChange mỗi khi người dùng gõ
      onChange={() => {
        const inst = ref.current?.getInstance();
        if (!inst) return;
        onChange(inst.getMarkdown());
      }}
    />
  );
}
