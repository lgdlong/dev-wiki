import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypePrism from "rehype-prism-plus";
import { getTutorialBySlug } from "@/utils/api/tutorialApi";
import ReactMarkdown from "react-markdown";
import { Tutorial } from "@/types/tutorial";
import { Clock } from "lucide-react";
import GithubSlugger from "github-slugger";
import HashScroll from "@/components/hash-scroll";
import { estimateReadTime, extractHeadings } from "@/utils/markdownHelpers";

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let tutorial: Tutorial | null = null;
  try {
    tutorial = await getTutorialBySlug(slug);
  } catch (error) {
    // Handle API errors gracefully (e.g., 404, network error)
    notFound();
  }

  if (!tutorial) notFound();

  // sanitize schema: giữ className/id cho highlight + anchor
  const schema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      span: [
        ...(defaultSchema.attributes?.span ?? []),
        ["className"],
        ["style"],                    // <-- CHO PHÉP style trên span
        ["data-line"],                // pretty-code
        ["data-highlighted-line"],
      ],
      code: [
        ...(defaultSchema.attributes?.code ?? []),
        ["className"],
        ["data-language"],            // pretty-code
      ],
      pre: [
        ...(defaultSchema.attributes?.pre ?? []),
        ["className"],
        ["data-language"],            // pretty-code
        ["data-theme"],
      ],
      h1: [...(defaultSchema.attributes?.h1 ?? []), ["id"]],
      h2: [...(defaultSchema.attributes?.h2 ?? []), ["id"]],
      h3: [...(defaultSchema.attributes?.h3 ?? []), ["id"]],
      h4: [...(defaultSchema.attributes?.h4 ?? []), ["id"]],
    },
  };


  const headings = extractHeadings(tutorial.content || '');

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <HashScroll />
        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-6 leading-tight">
            {tutorial.title}
          </h1>

          {/* Meta Info Row */}
          <div className="flex items-center space-x-6 text-sm text-zinc-600 dark:text-zinc-400 mb-8">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-black dark:text-white">{tutorial.authorName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(tutorial.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>{estimateReadTime(tutorial.content || '')}</span>
            </div>
            <div className="text-zinc-500 dark:text-zinc-500">
              {tutorial.views} views
            </div>
          </div>
        </header>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 mb-12">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              {headings.map((heading, index) => (
                <a
                  key={index}
                  href={`#${heading.id}`}
                  className={`block text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors ${
                    heading.level === 1 ? '' :
                    heading.level === 2 ? '' :
                    heading.level === 3 ? 'pl-4 text-sm' :
                    'pl-6 text-sm'
                  }`}
                >
                  {heading.level <= 2 ? `${index + 1}. ` : ''}{heading.text}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Main Content Area */}
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
                h1: ({ children, ...props }) => (
                  <h1 className="text-3xl md:text-4xl font-semibold text-black dark:text-white mb-6 leading-tight scroll-mt-24" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className="text-2xl md:text-3xl font-semibold text-black dark:text-white mb-4 mt-12 scroll-mt-24" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className="text-xl md:text-2xl font-semibold text-black dark:text-white mb-3 mt-8 scroll-mt-24" {...props}>
                    {children}
                  </h3>
                ),
                h4: ({ children, ...props }) => (
                  <h4 className="text-lg md:text-xl font-semibold text-black dark:text-white mb-2 mt-6 scroll-mt-24" {...props}>
                    {children}
                  </h4>
                ),
                p: ({ children, ...props }) => (
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6" {...props}>
                    {children}
                  </p>
                ),
                code(props) {
                  const { children, className, ...rest } = props as any;
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const isInline = !className;

                  if (isInline) {
                    return (
                      <code
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-0.5 py-0.5 rounded text-sm font-mono"
                        {...rest}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <code
                      className={`${className ?? ""} whitespace-pre-wrap break-words`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                img({ src = "", alt = "" }) {
                  const safe = /^https?:\/\//.test(src);
                  if (!safe) return null;
                  return (
                    <figure className="mb-12">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={alt}
                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700"
                      />
                    </figure>
                  );
                },
                ul: ({ children, ...props }) => (
                  <ul className="space-y-2 my-6" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="space-y-2 my-6" {...props}>
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="text-zinc-700 dark:text-zinc-300 leading-relaxed" {...props}>
                    {children}
                  </li>
                ),
                blockquote: ({ children, ...props }) => (
                  <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-6 italic text-zinc-600 dark:text-zinc-400 my-6" {...props}>
                    {children}
                  </blockquote>
                ),
                a: ({ children, href, ...props }) => (
                  <a
                    href={href}
                    className="text-black dark:text-white no-underline hover:underline transition-colors"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                table: ({ children, ...props }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="min-w-full border-collapse border border-zinc-300 dark:border-zinc-600" {...props}>
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children, ...props }) => (
                  <th className="border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 text-left font-semibold text-black dark:text-white" {...props}>
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td className="border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-zinc-700 dark:text-zinc-300" {...props}>
                    {children}
                  </td>
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