import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getRepoMetadata } from "@/lib/github";
import { AgentDetailView } from "@/components/marketplace/AgentDetail";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = await prisma.agentConfig.findFirst({
    where: { status: "approved", OR: [{ id: params.id }, { slug: params.id }] },
  });
  if (!agent) return { title: "Agent Not Found" };
  return {
    title: `${agent.name} — Agent`,
    description: agent.description,
  };
}

export default async function AgentDetailPage({ params }: Props) {
  const agent = await prisma.agentConfig.findFirst({
    where: { status: "approved", OR: [{ id: params.id }, { slug: params.id }] },
    include: { category: true, screenshots: { orderBy: { order: "asc" } }, versions: { orderBy: { createdAt: "desc" }, take: 10 } },
  });

  if (!agent) notFound();

  let githubMeta = null;
  if (agent.repository) {
    githubMeta = await getRepoMetadata(agent.repository);
  }

  return (
    <div className="max-w-page-narrow mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12">
      <AgentDetailView
        agent={{
          id: agent.id,
          name: agent.name,
          slug: agent.slug,
          version: agent.version,
          description: agent.description,
          provider: agent.provider,
          model: agent.model,
          temperature: agent.temperature,
          tools: JSON.parse(agent.tools || "[]"),
          tags: JSON.parse(agent.tags || "[]"),
          systemPrompt: agent.systemPrompt,
          soulContent: agent.soulContent,
          author: agent.author,
          authorUrl: agent.authorUrl,
          homepage: agent.homepage,
          repository: agent.repository,
          license: agent.license,
          icon: agent.icon,
          readme: agent.readme,
          downloads: agent.downloads,
          rating: agent.rating,
          githubStars: agent.githubStars || githubMeta?.stars || 0,
          githubForks: agent.githubForks || githubMeta?.forks || 0,
          githubTopics: githubMeta?.topics || [],
          category: agent.category?.name || null,
          screenshots: agent.screenshots.map(s => ({ url: s.url, alt: s.alt })),
          createdAt: agent.createdAt.toISOString(),
          updatedAt: agent.updatedAt.toISOString(),
        }}
      />
    </div>
  );
}
