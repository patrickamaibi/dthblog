"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

function randKey() {
  return Math.random().toString(36).slice(2, 10);
}

function mapMarksToPortableText(marks: any[] | undefined) {
  return (marks ?? []).map((m: any) =>
    m.type === "bold" ? "strong" : m.type === "italic" ? "em" : m.type
  );
}

function spansFromInlineContent(inlineContent: any[]) {
  const rawChildren = (inlineContent ?? []).filter((c: any) => c.type === "text");
  return rawChildren.length
    ? rawChildren.map((child: any) => ({
        _type: "span",
        _key: randKey(),
        text: child.text ?? "",
        marks: mapMarksToPortableText(child.marks),
      }))
    : [{ _type: "span", _key: randKey(), text: "", marks: [] }];
}

function tiptapToPortableText(doc: any) {
  if (!doc?.content) return [];

  return doc.content
    .filter(
      (node: any) =>
        node.type === "paragraph" ||
        node.type === "heading" ||
        node.type === "bulletList" ||
        node.type === "orderedList"
    )
    .flatMap((node: any) => {
      // Lists: each listItem becomes its own Portable Text block with
      // listItem: "bullet" | "number", the way Sanity expects.
      if (node.type === "bulletList" || node.type === "orderedList") {
        const listItemType = node.type === "bulletList" ? "bullet" : "number";
        return (node.content ?? []).map((item: any) => {
          const para = (item.content ?? []).find((c: any) => c.type === "paragraph");
          return {
            _type: "block",
            _key: randKey(),
            style: "normal",
            listItem: listItemType,
            level: 1,
            markDefs: [],
            children: spansFromInlineContent(para?.content ?? []),
          };
        });
      }

      // Paragraphs / headings
      const style = node.type === "heading" ? `h${node.attrs?.level ?? 1}` : "normal";
      return [
        {
          _type: "block",
          _key: randKey(),
          style,
          markDefs: [],
          children: spansFromInlineContent(node.content ?? []),
        },
      ];
    });
}

// Reverse of the above — converts existing Portable Text blocks (fetched from
// Sanity) into a Tiptap document, so the editor can be pre-filled when editing
// an existing post instead of always starting empty.
function portableTextToTiptap(blocks: any[] | undefined) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }

  const content: any[] = [];
  let currentList: { type: string; content: any[] } | null = null;

  const flushList = () => {
    if (currentList) {
      content.push({ type: currentList.type, content: currentList.content });
      currentList = null;
    }
  };

  for (const block of blocks) {
    if (block?._type !== "block") continue;

    const textContent = (block.children ?? []).map((span: any) => ({
      type: "text",
      text: span.text ?? "",
      marks: (span.marks ?? [])
        .map((mark: string) => (mark === "strong" ? "bold" : mark === "em" ? "italic" : null))
        .filter(Boolean)
        .map((type: string) => ({ type })),
    }));

    if (block.listItem === "bullet" || block.listItem === "number") {
      const listType = block.listItem === "bullet" ? "bulletList" : "orderedList";
      if (!currentList || currentList.type !== listType) {
        flushList();
        currentList = { type: listType, content: [] };
      }
      currentList.content.push({
        type: "listItem",
        content: [
          { type: "paragraph", content: textContent.length ? textContent : undefined },
        ],
      });
      continue;
    }

    flushList();
    const level = /^h[1-6]$/.test(block.style ?? "") ? Number(block.style.slice(1)) : null;
    content.push({
      type: level ? "heading" : "paragraph",
      ...(level ? { attrs: { level } } : {}),
      content: textContent.length > 0 ? textContent : undefined,
    });
  }
  flushList();

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
        class:
          "prose prose-slate max-w-none min-h-[220px] px-3.5 py-2.5 text-sm focus:outline-none",
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
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          label="Italic"
        >
          I
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("heading", { level: 1 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          label="Heading"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          label="Sub-heading"
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
        <ToolbarButton
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          label="Bullet list"
        >
          •
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          label="Numbered list"
        >
          1.
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
      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
        active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}