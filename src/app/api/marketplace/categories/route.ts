import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { plugins: true, agents: true } },
    },
  });

  return Response.json(
    categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      pluginCount: c._count.plugins,
      agentCount: c._count.agents,
    }))
  );
}
