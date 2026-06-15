import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getGitHubStats } from "@/lib/github";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/landing/StatsBar";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { CtaSection } from "@/components/landing/CtaSection";
import { StructuredData } from "@/components/seo/StructuredData";
import { generateSoftwareAppSchema, SITE_URL } from "@/lib/seo";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "CortexPrism — Open-Source Agentic Harness",
  description:
    "A single-process agentic harness system with multi-provider LLM support, 5-tier memory, parallax security, and a plugin marketplace. Install with one command and deploy AI agents with confidence.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "CortexPrism — Open-Source Agentic Harness",
    description:
      "A single-process agentic harness with 12+ LLM providers, 5-tier memory, parallax security, sandboxed code execution, and a plugin marketplace. MIT licensed.",
    url: SITE_URL,
  },
};

const CORTEX_VERSION_DEFAULT = "0.1.0";

function getCortexVersion(): string {
  const envVersion = process.env.NEXT_PUBLIC_CORTEX_VERSION;
  if (envVersion) return envVersion;

  try {
    const cortexDir = process.env.CORTEX_SOURCE_DIR || "/root/cortex";
    const denoJsonPath = path.join(cortexDir, "deno.json");
    if (fs.existsSync(denoJsonPath)) {
      const raw = fs.readFileSync(denoJsonPath, "utf-8");
      const { version } = JSON.parse(raw);
      return version || CORTEX_VERSION_DEFAULT;
    }
  } catch {}

  return CORTEX_VERSION_DEFAULT;
}

const cortexVersion = getCortexVersion();

export default async function HomePage() {
  const [pluginCount, agentCount, downloadAgg, gh] = await Promise.all([
    prisma.plugin.count({ where: { status: "approved" } }),
    prisma.agentConfig.count({ where: { status: "approved" } }),
    prisma.plugin.aggregate({ _sum: { downloads: true } }),
    getGitHubStats(),
  ]);

  const agentDownloads = await prisma.agentConfig.aggregate({ _sum: { downloads: true } });
  const totalDownloads =
    (downloadAgg._sum.downloads || 0) + (agentDownloads._sum.downloads || 0);

  return (
    <>
      <StructuredData data={generateSoftwareAppSchema()} />
      <Hero version={cortexVersion} />
      <StatsBar
        githubStars={gh.stargazers_count}
        pluginCount={pluginCount}
        agentCount={agentCount}
        totalDownloads={totalDownloads}
      />
      <FeatureGrid />
      <CtaSection />
    </>
  );
}
