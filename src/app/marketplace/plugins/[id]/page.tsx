import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getRepoMetadata } from "@/lib/github";
import { PluginDetailView } from "@/components/marketplace/PluginDetail";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateBreadcrumbSchema, SITE_URL } from "@/lib/seo";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plugin = await prisma.plugin.findFirst({
    where: { status: "approved", OR: [{ id: params.id }, { slug: params.id }] },
  });
  if (!plugin) return { title: "Plugin Not Found" };
  const desc = plugin.description?.length
    ? plugin.description.length > 160
      ? plugin.description.slice(0, 157) + "..."
      : plugin.description
    : `Install ${plugin.name} v${plugin.version} — a ${plugin.kind.toUpperCase()} plugin for the CortexPrism agentic harness`;
  return {
    title: `${plugin.name} — CortexPrism Plugin`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/marketplace/plugins/${plugin.slug}` },
    openGraph: {
      title: `${plugin.name} — CortexPrism Plugin`,
      description: desc,
      url: `${SITE_URL}/marketplace/plugins/${plugin.slug}`,
      type: "article",
    },
  };
}

export default async function PluginDetailPage({ params }: Props) {
  const plugin = await prisma.plugin.findFirst({
    where: { status: "approved", OR: [{ id: params.id }, { slug: params.id }] },
    include: { category: true, screenshots: { orderBy: { order: "asc" } }, versions: { orderBy: { createdAt: "desc" }, take: 10 } },
  });

  if (!plugin) notFound();

  const githubMeta = plugin.repository ? await getRepoMetadata(plugin.repository) : null;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Marketplace", url: `${SITE_URL}/marketplace` },
    { name: "Plugins", url: `${SITE_URL}/marketplace/plugins` },
    { name: plugin.name, url: `${SITE_URL}/marketplace/plugins/${plugin.slug}` },
  ]);

  return (
    <div className="max-w-page-narrow mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12">
      <StructuredData data={breadcrumbSchema} />
      <PluginDetailView
        plugin={{
          id: plugin.id,
          name: plugin.name,
          slug: plugin.slug,
          version: plugin.version,
          description: plugin.description,
          kind: plugin.kind,
          entryPoint: plugin.entryPoint,
          capabilities: JSON.parse(plugin.capabilities || "[]"),
          tags: JSON.parse(plugin.tags || "[]"),
          author: plugin.author,
          authorUrl: plugin.authorUrl,
          homepage: plugin.homepage,
          repository: plugin.repository,
          license: plugin.license,
          icon: plugin.icon,
          readme: plugin.readme,
          downloads: plugin.downloads,
          rating: plugin.rating,
          githubStars: plugin.githubStars || githubMeta?.stars || 0,
          githubForks: plugin.githubForks || githubMeta?.forks || 0,
          githubTopics: githubMeta?.topics || [],
          category: plugin.category?.name || null,
          screenshots: plugin.screenshots.map(s => ({ url: s.url, alt: s.alt })),
          createdAt: plugin.createdAt.toISOString(),
          updatedAt: plugin.updatedAt.toISOString(),
        }}
      />
    </div>
  );
}
