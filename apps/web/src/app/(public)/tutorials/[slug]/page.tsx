import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypePrism from "rehype-prism-plus";
import { getTutorialBySlug } from "@/utils/api/tutorialApi";
import ReactMarkdown from "react-markdown";
import type { Tutorial } from "@/types/tutorial";
import { Clock } from "lucide-react";
import HashScroll from "@/components/hash-scroll";
import Link from "next/link";
import { estimateReadTime, extractHeadings } from "@/utils/markdownHelpers";

export default async function TutorialPage({
                                             params,
                                           }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let tutorial: Tutorial | null = null;
  try {
    tutorial = await getTutorialBySlug(slug);
  } catch {
    notFound();
  }
  if (!tutorial) notFound();

  // Sanitize: allow IDs on headings + class names for Prism; allow basic img/a attrs.
  const schema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      span: [...(defaultSchema.attributes?.span ?? []), ["className"]],
      code: [...(defaultSchema.attributes?.code ?? []), ["className"]],
      pre:  [...(defaultSchema.attributes?.pre  ?? []), ["className"]],
      a: [
        ...(defaultSchema.attributes?.a ?? []),
        ["href"], ["target"], ["rel"],
      ],
      img: [
        ...(defaultSchema.attributes?.img ?? []),
        ["src"], ["alt"], ["width"], ["height"], ["loading"], ["decoding"],
        ["referrerPolicy"],
      ],
      h1: [...(defaultSchema.attributes?.h1 ?? []), ["id"]],
      h2: [...(defaultSchema.attributes?.h2 ?? []), ["id"]],
      h3: [...(defaultSchema.attributes?.h3 ?? []), ["id"]],
      h4: [...(defaultSchema.attributes?.h4 ?? []), ["id"]],
      h5: [...(defaultSchema.attributes?.h5 ?? []), ["id"]],
      h6: [...(defaultSchema.attributes?.h6 ?? []), ["id"]],
    },
  };

  const headings = extractHeadings(tutorial.content || "");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <HashScroll />

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-6 leading-tight">
            {tutorial.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-black dark:text-white">{tutorial.authorName}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(tutorial.createdAt).toLocaleDateString()}
            </span>
            <span>{estimateReadTime(tutorial.content || "")}</span>
            <span className="text-zinc-500 dark:text-zinc-500">{tutorial.views} views</span>
          </div>
        </header>

        {/* TOC */}
        {headings.length > 0 && (
          <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 mb-12">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              {headings.map((h, i) => {
                const pad =
                  h.level <= 2 ? "" : h.level === 3 ? "pl-4 text-sm" : "pl-6 text-sm";
                return (
                  <a
                    key={`${h.id}-${i}`}
                    href={`#${h.id}`}
                    className={`block text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors ${pad}`}
                  >
                    {h.level <= 2 ? `${i + 1}. ` : ""}
                    {h.text}
                  </a>
                );
              })}
            </nav>
          </div>
        )}

        {/* Article */}
        <article className="max-w-3xl mx-auto">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
                rehypeRaw,
                [rehypeSanitize, schema],
                rehypePrism,
              ]}
              components={{
                // Headings with sticky offset
                h1: ({ children, ...props }) => (
                  <h1 className="text-3xl md:text-4xl font-semibold mb-6 leading-tight scroll-mt-24" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className="text-2xl md:text-3xl font-semibold mb-4 mt-12 scroll-mt-24" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className="text-xl md:text-2xl font-semibold mb-3 mt-8 scroll-mt-24" {...props}>
                    {children}
                  </h3>
                ),
                h4: ({ children, ...props }) => (
                  <h4 className="text-lg md:text-xl font-semibold mb-2 mt-6 scroll-mt-24" {...props}>
                    {children}
                  </h4>
                ),

                // Paragraphs
                p: ({ children, ...props }) => (
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6" {...props}>
                    {children}
                  </p>
                ),

                // Inline code only; block code stays <pre><code> rendered by ReactMarkdown
                code({ inline, children, className, ...props }: any) {
                  if (inline) {
                    return (
                      <code
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  // block: Prism adds classes to <code>; we just ensure wrapping
                  return (
                    <code
                      className={`${className ?? ""} whitespace-pre-wrap break-words`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },

                // Style the single <pre> block (no extra wrapper), wrap, no h-scroll, dark bg zinc-950
                pre({ children, ...props }) {
                  return (
                    <pre
                      className="bg-zinc-100 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 whitespace-pre-wrap break-words overflow-x-visible"
                      {...props}
                    >
                      {children}
                    </pre>
                  );
                },

                // Next Link for internal links; external open in new tab
                a({ href = "", children, ...props }) {
                  if (href.startsWith("#")) {
                    return (
                      <a href={href} {...props}>
                        {children}
                      </a>
                    );
                  }
                  if (href.startsWith("/")) {
                    return (
                      <Link href={href} {...(props as any)}>
                        {children}
                      </Link>
                    );
                  }
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                      {children}
                    </a>
                  );
                },

                // Plain <img> for UGC (safer/flexible); lazy + responsive
                img({ src = "", alt = "" }) {
                  const safe = /^https?:\/\//.test(src);
                  if (!safe) return null;
                  return (
                    <figure className="my-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={alt}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-auto rounded-lg border border-zinc-200 dark:border-zinc-700"
                      />
                      {alt && (
                        <figcaption className="text-center text-xs text-zinc-500 mt-2">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  );
                },

                // Basic table styling kept
                table: ({ children, ...props }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full border-collapse border border-zinc-300 dark:border-zinc-600" {...props}>
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children, ...props }) => (
                  <th className="border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 text-left font-semibold" {...props}>
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2" {...props}>
                    {children}
                  </td>
                ),
                blockquote: ({ children, ...props }) => (
                  <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-6 italic text-zinc-600 dark:text-zinc-400 my-6" {...props}>
                    {children}
                  </blockquote>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="space-y-2 my-6" {...props}>{children}</ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="space-y-2 my-6" {...props}>{children}</ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="leading-relaxed" {...props}>{children}</li>
                ),
              }}
            >
              {tutorial.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}
