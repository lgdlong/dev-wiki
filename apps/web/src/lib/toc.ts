// apps/web/src/lib/toc.ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import slugify from "slugify";

// Table Of Contents item
export type TocItem = { id: string; text: string; depth: number };

// Lấy mục lục (table of contents) từ markdown
export async function buildToc(markdown: string): Promise<TocItem[]> {
  const tree = unified().use(remarkParse).parse(markdown);
  const toc: TocItem[] = [];
  visit(tree, "heading", (node: any) => {
    const depth = node.depth; // 1..6
    if (depth > 4) return;    // chỉ lấy đến H4 cho gọn
    const text = node.children?.map((c: any) => c.value || "").join("") ?? "";
    if (!text) return;
    const id: string = slugify(text, { lower: true, strict: true });
    toc.push({ id, text, depth });
  });
  return toc;
}
