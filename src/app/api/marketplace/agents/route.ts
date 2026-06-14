import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const AgentInputSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().min(1),
  provider: z.string().optional(),
  model: z.string().optional(),
  temperature: z.number().optional(),
  tools: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  systemPrompt: z.string().optional(),
  soulContent: z.string().optional(),
  author: z.string().optional(),
  authorUrl: z.string().optional(),
  repository: z.string().optional(),
  icon: z.string().optional(),
  readme: z.string().optional(),
  categoryId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const provider = searchParams.get("provider") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

  const where: Record<string, unknown> = { published: true };
  if (search) where.OR = [
    { name: { contains: search } },
    { description: { contains: search } },
  ];
  if (category) where.category = { slug: category };
  if (provider) where.provider = provider;

  const [agents, total] = await Promise.all([
    prisma.agentConfig.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true },
      orderBy: { downloads: "desc" },
    }),
    prisma.agentConfig.count({ where }),
  ]);

  return Response.json({
    agents: agents.map((a) => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      version: a.version,
      description: a.description,
      provider: a.provider,
      model: a.model,
      author: a.author,
      icon: a.icon,
      downloads: a.downloads,
      rating: a.rating,
      tags: JSON.parse(a.tags || "[]"),
      category: a.category?.name || null,
      createdAt: a.createdAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = AgentInputSchema.parse(body);
    const slug = data.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

    const agent = await prisma.agentConfig.create({
      data: {
        ...data,
        slug,
        tools: JSON.stringify(data.tools || []),
        tags: JSON.stringify(data.tags || []),
      },
    });

    return Response.json(agent, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
