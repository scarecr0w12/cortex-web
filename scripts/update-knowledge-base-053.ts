import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL || "file:./prisma/marketplace.db" } },
});

async function main() {
  const contentDir = path.join(process.cwd(), "content", "knowledge-base");

  const updates = [
    "faq",
    "provider-guide",
    "migration-guide",
    "security-guidelines",
    "troubleshooting",
    "best-practices",
    "sandbox-guide",
    "performance-tuning",
  ];

  let updated = 0;
  let created = 0;
  let skipped = 0;

  for (const slug of updates) {
    const filePath = path.join(contentDir, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP: ${slug}.mdx not found`);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const title = extractTitleFromMarkdown(content);

    const existing = await prisma.knowledgeBaseArticle.findUnique({
      where: { slug },
    });

    if (existing) {
      await prisma.knowledgeBaseArticle.update({
        where: { slug },
        data: { content, title, updatedAt: new Date() },
      });
      console.log(`  UPDATE: ${slug} -> "${title}"`);
      updated++;
    } else {
      console.log(`  SKIP: ${slug} not in DB`);
      skipped++;
    }
  }

  const newArticles = [
    {
      slug: "multi-user-collaboration",
      title: "Multi-User Collaboration",
      description: "Set up user accounts, teams, API tokens, resource sharing, and instance federation in CortexPrism v0.53.0+.",
    },
  ];

  for (const article of newArticles) {
    const filePath = path.join(contentDir, `${article.slug}.mdx`);
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP: ${article.slug}.mdx not found`);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const existing = await prisma.knowledgeBaseArticle.findUnique({
      where: { slug: article.slug },
    });

    if (!existing) {
      const existingCount = await prisma.knowledgeBaseArticle.count({
        where: { section: "knowledge-base" },
      });
      await prisma.knowledgeBaseArticle.create({
        data: {
          title: article.title,
          slug: article.slug,
          section: "knowledge-base",
          content,
          description: article.description,
          tags: JSON.stringify(["multi-user", "teams", "authentication", "federation", "api-tokens"]),
          published: true,
          sortOrder: existingCount * 10,
        },
      });
      console.log(`  CREATE: ${article.slug} -> "${article.title}"`);
      created++;
    } else {
      await prisma.knowledgeBaseArticle.update({
        where: { slug: article.slug },
        data: { content, updatedAt: new Date() },
      });
      console.log(`  UPDATE: ${article.slug} -> "${article.title}"`);
      updated++;
    }
  }

  const indexSlug = "index";
  const indexPath = path.join(contentDir, "index.mdx");
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, "utf-8");
    const existing = await prisma.knowledgeBaseArticle.findUnique({
      where: { slug: indexSlug },
    });
    if (existing) {
      await prisma.knowledgeBaseArticle.update({
        where: { slug: indexSlug },
        data: { content, updatedAt: new Date() },
      });
      console.log(`  UPDATE: index -> Knowledge Base`);
      updated++;
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Updated: ${updated}, Created: ${created}, Skipped: ${skipped}`);
}

function extractTitleFromMarkdown(content: string): string {
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : "Untitled";
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
