import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.category.upsert({ where: { slug: "code-execution" }, update: {}, create: { name: "Code Execution", slug: "code-execution" } }),
    prisma.category.upsert({ where: { slug: "data-processing" }, update: {}, create: { name: "Data Processing", slug: "data-processing" } }),
    prisma.category.upsert({ where: { slug: "developer-tools" }, update: {}, create: { name: "Developer Tools", slug: "developer-tools" } }),
    prisma.category.upsert({ where: { slug: "analytics" }, update: {}, create: { name: "Analytics", slug: "analytics" } }),
    prisma.category.upsert({ where: { slug: "communication" }, update: {}, create: { name: "Communication", slug: "communication" } }),
    prisma.category.upsert({ where: { slug: "productivity" }, update: {}, create: { name: "Productivity", slug: "productivity" } }),
    prisma.category.upsert({ where: { slug: "research" }, update: {}, create: { name: "Research", slug: "research" } }),
    prisma.category.upsert({ where: { slug: "security" }, update: {}, create: { name: "Security", slug: "security" } }),
  ]);

  const adminExists = await prisma.user.findUnique({ where: { email: "admin@cortexprism.io" } });
  if (!adminExists) {
    const hash = "$2b$12$uLMC.1/n48Wfsgpo8M/Pa.KWVdds1M4CjISd7qvoAgrR9Mm3g5miq";
    await prisma.user.create({
      data: { email: "admin@cortexprism.io", username: "admin", passwordHash: hash, role: "admin" },
    });
    console.log("Admin user created (admin@cortexprism.io / admin12345)");
  }

  console.log("Seed complete: categories and admin user created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
