"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, List, ListOrdered, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Toolbar deliberately matches the backend's allowed-tag sanitizer
// (RICH_TEXT_ALLOWED_TAGS in api/serializers.py): bold/italic/underline,
// bulleted/numbered lists, links, headings H2-H6, images (with mandatory
// alt text). No H1 (that stays the page's dedicated heading field), no
// colors or tables — this is copy editing, not layout.
const HEADING_LEVELS = [2, 3, 4, 5, 6] as const;

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [...HEADING_LEVELS] }, codeBlock: false, blockquote: false, horizontalRule: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: false }),
      Image,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose-sm max-w-none min-h-[80px] px-3 py-2 text-sm text-navy focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  function setLink() {
    const previousUrl = editor?.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (relative path like /courses/x, or full URL):", previousUrl ?? "");
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const alt = window.prompt("Alt text for this image (describes it for screen readers and search engines):", "");
    if (alt === null) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/proxy/media/upload", { method: "POST", body: fd });
      if (!res.ok) {
        window.alert("Image upload failed.");
        return;
      }
      const data = await res.json();
      editor?.chain().focus().setImage({ src: data.url, alt }).run();
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border focus-within:border-cta">
      <div className="flex items-center gap-0.5 border-b border-border bg-bg-light px-1.5 py-1">
        <select
          value={HEADING_LEVELS.find((level) => editor.isActive("heading", { level })) ?? "paragraph"}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "paragraph") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().setHeading({ level: Number(val) as (typeof HEADING_LEVELS)[number] }).run();
            }
          }}
          className="mr-1 rounded border border-border bg-white px-1.5 py-1 text-xs font-semibold text-navy focus:outline-none"
        >
          <option value="paragraph">Paragraph</option>
          {HEADING_LEVELS.map((level) => (
            <option key={level} value={level}>
              H{level}
            </option>
          ))}
        </select>
        <div className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton active={false} onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded transition-colors disabled:opacity-50",
        active ? "bg-navy text-white" : "text-text-body hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}
