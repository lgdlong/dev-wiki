import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { getTutorialBySlug } from "@/utils/api/tutorialApi";
import ReactMarkdown from "react-markdown";
import { Tutorial } from "@/types/tutorial";

export default async function TutorialPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const tutorial: Tutorial | null = await getTutorialBySlug(slug);
  if (!tutorial) notFound();

  // sanitize schema: giữ className/id cho highlight + anchor
  const schema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      code: [...(defaultSchema.attributes?.code ?? []), ["className"]],
      span: [...(defaultSchema.attributes?.span ?? []), ["className"]],
      pre: [...(defaultSchema.attributes?.pre ?? []), ["className"]],
      h1: [...(defaultSchema.attributes?.h1 ?? []), ["id"]],
      h2: [...(defaultSchema.attributes?.h2 ?? []), ["id"]],
      h3: [...(defaultSchema.attributes?.h3 ?? []), ["id"]],
      h4: [...(defaultSchema.attributes?.h4 ?? []), ["id"]],
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-3">{tutorial.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {new Date(tutorial.createdAt).toLocaleDateString()} · Updated{" "}
            {new Date(tutorial.updatedAt).toLocaleDateString()} · {tutorial.views} views
          </p>
        </header>

        {/* Content */}
        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              rehypeRaw,
              [rehypeSanitize, schema],
            ]}
            components={{
              code(props) {
                const { children, className, ...rest } = props as any;
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                const isInline = !className;

                if (isInline) {
                  return (
                    <code
                      className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono"
                      {...rest}
                    >
                      {children}
                    </code>
                  );
                }

                return (
                  <div className="relative group">
                    <pre className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700">
                      <code className={`language-${language}`} {...rest}>
                        {children}
                      </code>
                    </pre>
                  </div>
                );
              },
              img({ src = "", alt = "" }) {
                const safe = /^https?:\/\//.test(src);
                if (!safe) return null;
                return (
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} className="rounded-lg border" />
                    {alt && (
                      <figcaption className="text-center text-xs text-zinc-500 mt-2">
                        {alt}
                      </figcaption>
                    )}
                  </figure>
                );
              },
            }}
          >
            {tutorial.content}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
