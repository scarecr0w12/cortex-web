import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AgentDetailView } from "@/components/marketplace/AgentDetail";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = await prisma.agentConfig.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
  });
  if (!agent) return { title: "Agent Not Found" };
  return {
    title: `${agent.name} — Agent`,
    description: agent.description,
  };
}

export default async function AgentDetailPage({ params }: Props) {
  const agent = await prisma.agentConfig.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: { category: true },
  });

  if (!agent) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AgentDetailView
        agent={{
          ...agent,
          tools: JSON.parse(agent.tools || "[]"),
          tags: JSON.parse(agent.tags || "[]"),
          category: agent.category?.name || null,
          createdAt: agent.createdAt.toISOString(),
          updatedAt: agent.updatedAt.toISOString(),
        }}
      />
    </div>
  );
}
