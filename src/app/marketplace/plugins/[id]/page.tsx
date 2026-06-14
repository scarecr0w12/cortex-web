import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PluginDetailView } from "@/components/marketplace/PluginDetail";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plugin = await prisma.plugin.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
  });
  if (!plugin) return { title: "Plugin Not Found" };
  return {
    title: `${plugin.name} — Plugin`,
    description: plugin.description,
  };
}

export default async function PluginDetailPage({ params }: Props) {
  const plugin = await prisma.plugin.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: { category: true },
  });

  if (!plugin) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PluginDetailView
        plugin={{
          ...plugin,
          capabilities: JSON.parse(plugin.capabilities || "[]"),
          category: plugin.category?.name || null,
          createdAt: plugin.createdAt.toISOString(),
          updatedAt: plugin.updatedAt.toISOString(),
        }}
      />
    </div>
  );
}
