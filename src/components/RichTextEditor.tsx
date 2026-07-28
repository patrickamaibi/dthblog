"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useRef, useState } from "react";

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
        node.type === "orderedList" ||
        node.type === "blockquote" ||
        node.type === "image"
    )
    .flatMap((node: any) => {
      // Inline images become their own Portable Text image blocks,
      // referencing the Sanity asset uploaded at insert time.
      if (node.type === "image") {
        if (!node.attrs?.assetId) return []; // skip images that never finished uploading
        return [
          {
            _type: "image",
            _key: randKey(),
            asset: { _type: "reference", _ref: node.attrs.assetId },
            alt: node.attrs.alt || "",
          },
        ];
      }

      // Blockquote: Tiptap nests a paragraph inside blockquote, but Sanity's
      // blockContent schema treats "blockquote" as a block *style* (like h1/h2),
      // not a separate node type — so unwrap the inner paragraph(s) into
      // normal blocks with style: "blockquote".
      if (node.type === "blockquote") {
        const paragraphs = (node.content ?? []).filter((c: any) => c.type === "paragraph");
        return paragraphs.map((para: any) => ({
          _type: "block",
          _key: randKey(),
          style: "blockquote",
          markDefs: [],
          children: spansFromInlineContent(para.content ?? []),
        }));
      }

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
//
// NOTE: image blocks from Sanity need a resolved display URL to preview in
// the editor. Pass `initialContent` with images already resolved to
// `{ _type: "image", asset: { _ref, url }, alt }` — i.e. include "url" via
// a `"asset": { "_ref": asset._ref, "url": asset->url }` projection when
// fetching the post for editing, since raw Portable Text only has the ref.
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
    if (block?._type === "image") {
      flushList();
      content.push({
        type: "image",
        attrs: {
          src: block.asset?.url ?? "",
          assetId: block.asset?._ref ?? "",
          alt: block.alt ?? "",
        },
      });
      continue;
    }

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

    if (block.style === "blockquote") {
      content.push({
        type: "blockquote",
        content: [
          { type: "paragraph", content: textContent.length ? textContent : undefined },
        ],
      });
      continue;
    }

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2] } }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            assetId: { default: null },
          };
        },
      }).configure({
        HTMLAttributes: { class: "rounded-lg max-w-full my-4" },
      }),
    ],
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

  async function handleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so selecting the same file again still fires onChange
    if (!file || !editor) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { assetId, url } = await res.json();

      editor
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: { src: url, assetId, alt: "" },
        })
        .run();
    } catch (err) {
      console.error(err);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden bg-white">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 px-2 py-1.5">
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
        <ToolbarButton
          active={editor?.isActive("blockquote")}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          label="Quote"
        >
          "
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-slate-300 shrink-0" />
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          label="Insert image"
        >
          {uploading ? "…" : "🖼"}
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelected}
          className="hidden"
        />
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
      className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
        active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}