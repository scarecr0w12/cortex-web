import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { MdxContent } from "@/components/docs/MdxContent";
import { getContentBySlug, getContentSlugs } from "@/lib/markdown";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateBreadcrumbSchema, SITE_URL } from "@/lib/seo";

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

const sectionLabels: Record<string, string> = {
  cli: "CLI Reference",
  architecture: "Architecture",
  "knowledge-base": "Knowledge Base",
  "design-docs": "Design Docs",
  "developer-guide": "Developer Guide",
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
    return {
      title: "CortexPrism Documentation — Guides, CLI & Architecture",
      description:
        "Comprehensive documentation for CortexPrism: CLI reference, architecture deep-dives, knowledge base, design docs, and developer guides for building agentic AI applications.",
      alternates: { canonical: `${SITE_URL}/docs` },
      openGraph: {
        title: "CortexPrism Documentation — Guides, CLI & Architecture",
        description:
          "CLI reference, architecture deep-dives, knowledge base, design docs, and developer guides. Everything you need to build with the CortexPrism agentic harness.",
        url: `${SITE_URL}/docs`,
      },
    };
  }
  return { title: `Docs: ${params.slug.join(" / ")}` };
}

export default async function DocsPage({ params }: Props) {
  if (!params.slug?.length) {
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Documentation", url: `${SITE_URL}/docs` },
    ]);

    return (
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 flex gap-8">
        <StructuredData data={breadcrumbSchema} />
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

  const sectionLabel = sectionLabels[params.slug[0]] || params.slug[0];
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Documentation", url: `${SITE_URL}/docs` },
    { name: sectionLabel, url: `${SITE_URL}/docs/${params.slug[0]}` },
  ];
  if (params.slug[1] && params.slug[1] !== "index") {
    const title = params.slug[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    breadcrumbItems.push({
      name: title,
      url: `${SITE_URL}/docs/${params.slug.join("/")}`,
    });
  }
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 flex gap-8">
      <StructuredData data={breadcrumbSchema} />
      <Sidebar />
      <article className="flex-1 min-w-0 max-w-page-content">
        <MdxContent content={content} />
      </article>
      <TableOfContents />
    </div>
  );
}
