import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { MdxContent } from "@/components/docs/MdxContent";
import { getContentBySlug, getContentSlugs } from "@/lib/markdown";
import { TableOfContents } from "@/components/docs/TableOfContents";

interface Props {
  params: { slug?: string[] };
}

export async function generateStaticParams() {
  const slugs = getContentSlugs("getting-started");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug?.[0] || "index";
  const { frontmatter } = getContentBySlug("getting-started", slug);
  return {
    title: (frontmatter.title as string) || "Getting Started",
  };
}

export default async function GettingStartedPage({ params }: Props) {
  const slug = params.slug?.[0] || "index";
  let content: string;
  try {
    const result = getContentBySlug("getting-started", slug);
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
