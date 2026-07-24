"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

function randKey() {
  return Math.random().toString(36).slice(2, 10);
}

function tiptapToPortableText(doc: any) {
  if (!doc?.content) return [];
  return doc.content
    .filter((node: any) => node.type === "paragraph" || node.type === "heading")
    .map((node: any) => {
      const style = node.type === "heading" ? `h${node.attrs?.level ?? 1}` : "normal";
      const rawChildren = (node.content ?? []).filter((c: any) => c.type === "text");
      const children = rawChildren.length
        ? rawChildren.map((child: any) => ({
            _type: "span",
            _key: randKey(),
            text: child.text ?? "",
            marks: (child.marks ?? []).map((m: any) => (m.type === "bold" ? "strong" : m.type)),
          }))
        : [{ _type: "span", _key: randKey(), text: "", marks: [] }];
      return {
        _type: "block",
        _key: randKey(),
        style,
        markDefs: [],
        children,
      };
    });
}

// Reverse of the above — converts existing Portable Text blocks (fetched from
// Sanity) into a Tiptap document, so the editor can be pre-filled when editing
// an existing post instead of always starting empty.
function portableTextToTiptap(blocks: any[] | undefined) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }

  const content = blocks
    .filter((block) => block?._type === "block")
    .map((block) => {
      const level = /^h[1-6]$/.test(block.style ?? "") ? Number(block.style.slice(1)) : null;
      const nodeType = level ? "heading" : "paragraph";

      const textContent = (block.children ?? []).map((span: any) => ({
        type: "text",
        text: span.text ?? "",
        marks: (span.marks ?? [])
          .map((mark: string) => (mark === "strong" ? "bold" : mark === "em" ? "italic" : null))
          .filter(Boolean)
          .map((type: string) => ({ type })),
      }));

      return {
        type: nodeType,
        ...(level ? { attrs: { level } } : {}),
        content: textContent.length > 0 ? textContent : undefined,
      };
    });

  return { type: "doc", content: content.length > 0 ? content : [{ type: "paragraph" }] };
}

export function RichTextEditor({
  name = "body",
  initialContent,
}: {
  name?: string;
  initialContent?: any[];
}) {
  const [json, setJson] = useState("[]");
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2] } })],
    immediatelyRender: false,
    content: portableTextToTiptap(initialContent),
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none min-h-[220px] px-3.5 py-2.5 text-sm focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => setJson(JSON.stringify(tiptapToPortableText(editor.getJSON()))),
  });
  useEffect(() => {
    if (editor) setJson(JSON.stringify(tiptapToPortableText(editor.getJSON())));
  }, [editor]);
  return (
    <div className="rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden bg-white">
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        <ToolbarButton
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          label="Bold"
        >
          B
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("heading", { level: 1 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}          label="Heading"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}          label="Sub-heading"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("paragraph")}
          onClick={() => editor?.chain().focus().setParagraph().run()}
          label="Body text"
        >
          P
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={json} readOnly />
    </div>
  );
}
function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick?: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${        active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}