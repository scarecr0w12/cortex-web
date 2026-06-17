import { getContentBySlug, getContentSlugs } from "@/lib/markdown";
import { getKbArticleBySlug } from "@/lib/knowledge-base";
import { DOCS_SECTION_LABELS } from "@/lib/llms";

const sectionMap: Record<string, string> = {
  cli: "cli",
  architecture: "architecture",
  "knowledge-base": "knowledge-base",
  "design-docs": "design-docs",
  "developer-guide": "developer-guide",
};

const KB_CONTENT_TYPE = "text/markdown; charset=utf-8";
const DEFAULT_CONTENT_TYPE = "text/markdown; charset=utf-8";

interface Params {
  path: string[];
}

function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function GET(
  _request: Request,
  { params }: { params: Params }
) {
  const [section, ...slugParts] = params.path;
  if (!section) {
    return new Response("Missing section parameter", { status: 400 });
  }

  const mappedSection = sectionMap[section];

  if (section === "knowledge-base") {
    const fileSlug = slugParts[0];
    if (!fileSlug) {
      return new Response("Missing knowledge base article slug", { status: 400 });
    }
    const article = await getKbArticleBySlug(fileSlug);
    if (!article || !article.published) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(article.content, {
      headers: {
        "Content-Type": KB_CONTENT_TYPE,
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  if (!mappedSection) {
    return new Response(`Unknown section: ${section}`, { status: 404 });
  }

  const fileSlug = slugParts[0] || "index";
  try {
    const { content } = getContentBySlug(mappedSection, fileSlug);
    const label = DOCS_SECTION_LABELS[section] || section;
    const title =
      fileSlug === "index"
        ? `${label} Overview`
        : slugToTitle(fileSlug);

    const header = `# ${title}\n\n`;
    const footer = `\n\n---\n*Source: [https://cortexprism.io/docs/${section}${fileSlug === "index" ? "" : `/${fileSlug}`}](https://cortexprism.io/docs/${section}${fileSlug === "index" ? "" : `/${fileSlug}`})*`;

    return new Response(header + content + footer, {
      headers: {
        "Content-Type": DEFAULT_CONTENT_TYPE,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

export async function generateStaticParams() {
  const params: { path: string[] }[] = [];

  for (const [displaySection, mappedSection] of Object.entries(sectionMap)) {
    if (displaySection === "knowledge-base") continue;
    const slugs = getContentSlugs(mappedSection);
    for (const slug of slugs) {
      if (slug === "index") {
        params.push({ path: [displaySection] });
      } else {
        params.push({ path: [displaySection, slug] });
      }
    }
  }

  return params;
}

export const dynamic = "force-static";
