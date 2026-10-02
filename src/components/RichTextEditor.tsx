"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
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

// Table cells are stored as plain text strings, so each cell's paragraphs are
// flattened to text, one line per paragraph.
function tableCellToText(cell: any): string {
  return (cell?.content ?? [])
    .map((block: any) =>
      (block?.content ?? [])
        .filter((c: any) => c.type === "text")
        .map((c: any) => c.text ?? "")
        .join("")
    )
    .join("\n")
    .trim();
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
        node.type === "table" ||
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

      // Tables become a "table" block: rows of plain-text cells. The first row
      // counts as a header row when all of its cells are header cells.
      if (node.type === "table") {
        const rows = (node.content ?? []).filter((r: any) => r.type === "tableRow");
        if (rows.length === 0) return [];
        const firstRowCells = rows[0].content ?? [];
        const hasHeaderRow =
          firstRowCells.length > 0 && firstRowCells.every((c: any) => c.type === "tableHeader");
        const caption = typeof node.attrs?.caption === "string" ? node.attrs.caption.trim() : "";
        return [
          {
            _type: "table",
            _key: randKey(),
            hasHeaderRow,
            ...(caption ? { caption } : {}),
            rows: rows.map((row: any) => ({
              _type: "tableRow",
              _key: randKey(),
              cells: (row.content ?? []).map(tableCellToText),
            })),
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

    if (block?._type === "table") {
      flushList();
      const rows: any[] = Array.isArray(block.rows) ? block.rows : [];
      if (rows.length === 0) continue;
      // Rows may have different lengths (Studio lets you type them freely),
      // so pad every row to the widest one.
      const columnCount = Math.max(
        1,
        ...rows.map((r: any) => (Array.isArray(r?.cells) ? r.cells.length : 0))
      );
      const headerFirstRow = block.hasHeaderRow !== false;
      content.push({
        type: "table",
        attrs: { caption: typeof block.caption === "string" ? block.caption : null },
        content: rows.map((row: any, rowIndex: number) => ({
          type: "tableRow",
          content: Array.from({ length: columnCount }, (_, colIndex) => {
            const text = String(row?.cells?.[colIndex] ?? "");
            return {
              type: headerFirstRow && rowIndex === 0 ? "tableHeader" : "tableCell",
              content: text
                ? text.split("\n").map((line) => ({
                    type: "paragraph",
                    content: line ? [{ type: "text", text: line }] : undefined,
                  }))
                : [{ type: "paragraph" }],
            };
          }),
        })),
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
      // The caption is kept as a node attribute so it survives a round trip
      // through the editor. It is not drawn inside the editor itself.
      Table.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            caption: { default: null, rendered: false },
          };
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    immediatelyRender: false,
    // Re-render on cursor moves too, so the table controls appear as soon as
    // the cursor enters a table and the toolbar highlights stay accurate.
    shouldRerenderOnTransaction: true,
    content: portableTextToTiptap(initialContent),
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[220px] px-3.5 py-2.5 text-sm focus:outline-none " +
          "[&_.tableWrapper]:overflow-x-auto [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse " +
          "[&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_td]:align-top " +
          "[&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2 [&_th]:text-left [&_th]:align-top " +
          "[&_td_p]:m-0 [&_th_p]:m-0 [&_.selectedCell]:bg-blue-50",
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

  function handleTableCaption() {
    if (!editor) return;
    const current = (editor.getAttributes("table").caption as string | null) ?? "";
    const next = window.prompt("Table caption (leave empty to remove it)", current);
    if (next === null) return;
    editor
      .chain()
      .focus()
      .updateAttributes("table", { caption: next.trim() || null })
      .run();
  }

  const inTable = editor?.isActive("table") ?? false;

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
        <ToolbarButton
          active={inTable}
          onClick={() =>
            editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          label="Insert table"
        >
          ▦
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelected}
          className="hidden"
        />
        {inTable && (
          <>
            <div className="mx-1 h-5 w-px bg-slate-300 shrink-0" />
            <ToolbarButton
              onClick={() => editor?.chain().focus().addRowAfter().run()}
              label="Add row below"
            >
              + row
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().deleteRow().run()}
              label="Delete this row"
            >
              − row
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().addColumnAfter().run()}
              label="Add column to the right"
            >
              + col
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().deleteColumn().run()}
              label="Delete this column"
            >
              − col
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeaderRow().run()}
              label="Turn the first row into a header, or back"
            >
              Header
            </ToolbarButton>
            <ToolbarButton onClick={handleTableCaption} label="Set table caption">
              Caption
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().deleteTable().run()}
              label="Delete the whole table"
            >
              ✕ table
            </ToolbarButton>
          </>
        )}
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
      title={label}
      className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
        active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
