import { prisma } from "@/lib/prisma";

export async function GET() {
  const [pluginCount, agentCount, totalDownloads] = await Promise.all([
    prisma.plugin.count({ where: { status: "approved" } }),
    prisma.agentConfig.count({ where: { status: "approved" } }),
    prisma.plugin.aggregate({ _sum: { downloads: true } }),
  ]);

  const agentDownloads = await prisma.agentConfig.aggregate({
    _sum: { downloads: true },
  });

  return Response.json({
    totalPlugins: pluginCount,
    totalAgents: agentCount,
    totalDownloads: (totalDownloads._sum.downloads || 0) + (agentDownloads._sum.downloads || 0),
    categories: await prisma.category.count(),
  });
}
