import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { MdxContent } from "@/components/docs/MdxContent";
import { getContentBySlug, getContentSlugs } from "@/lib/markdown";
import { TableOfContents } from "@/components/docs/TableOfContents";

interface Props {
  params: { slug?: string[] };
}

const sectionMap: Record<string, string> = {
  cli: "cli",
  architecture: "architecture",
  "knowledge-base": "knowledge-base",
  "design-docs": "design-docs",
  "developer-guide": "developer-guide",
};

export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];
  for (const [dir, section] of Object.entries(sectionMap)) {
    const slugs = getContentSlugs(section);
    params.push(
      ...slugs.map((s) => ({ slug: [dir, s === "index" ? "" : s].filter(Boolean) }))
    );
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!params.slug?.length) {
    return { title: "Docs" };
  }
  return { title: `Docs: ${params.slug.join(" / ")}` };
}

export default async function DocsPage({ params }: Props) {
  if (!params.slug?.length) {
    return (
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 flex gap-8">
        <Sidebar />
        <article className="flex-1 min-w-0 max-w-page-content">
          <h1 className="text-3xl font-bold text-[#e2e2ea] mb-6">Documentation</h1>
          <p className="text-[#9090a8]">
            Browse the documentation using the sidebar. Select a topic to get started.
          </p>
        </article>
      </div>
    );
  }

  const section = sectionMap[params.slug[0]];
  if (!section) notFound();

  const fileSlug = params.slug[1] || "index";
  let content: string;
  try {
    const result = getContentBySlug(section, fileSlug);
    content = result.content;
  } catch {
    notFound();
  }

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 flex gap-8">
      <Sidebar />
      <article className="flex-1 min-w-0 max-w-page-content">
        <MdxContent content={content} />
      </article>
      <TableOfContents />
    </div>
  );
}
