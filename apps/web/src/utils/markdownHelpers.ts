import GithubSlugger from "github-slugger";

export function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function extractHeadings(content: string) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const slugger = new GithubSlugger();
  slugger.reset();

  const headings: Array<{ level: number; text: string; id: string }> = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugger.slug(text);
    headings.push({ level, text, id });
  }
  return headings;
}
