import { getContentSlugs, getContentBySlug } from "@/lib/markdown";
import { getAllKbArticles, getKbSlugs } from "@/lib/knowledge-base";
import { SITE_NAME } from "@/lib/seo";

export const DOCS_SECTIONS = [
  "cli",
  "architecture",
  "design-docs",
  "developer-guide",
] as const;

export const DOCS_SECTION_LABELS: Record<string, string> = {
  cli: "CLI Reference",
  architecture: "Architecture",
  "design-docs": "Design Docs",
  "developer-guide": "Developer Guide",
};

export const DOCS_SECTION_DESCRIPTIONS: Record<string, string> = {
  cli: "Complete CLI reference for all CortexPrism commands",
  architecture: "Deep-dive into CortexPrism's internal architecture",
  "design-docs": "Design decisions and RFCs for CortexPrism",
  "developer-guide": "Guides for building plugins and agents on CortexPrism",
};

export interface DocEntry {
  title: string;
  url: string;
  description?: string;
}

export function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${SITE_NAME} — Open-Source AI Agent Runtime`);
  lines.push("");
  lines.push("> CortexPrism is an open-source AI agent runtime with 24 LLM providers, 5-tier memory system, MCP plugin marketplace, sandboxed code execution, and parallax enterprise-grade security. Self-host autonomous AI agents — MIT licensed.");
  lines.push("");

  lines.push("## Get Started");
  lines.push(`- [Quickstart](https://cortexprism.io/getting-started): Run your first AI agent in under 5 minutes`);
  lines.push(`- [Installation](https://cortexprism.io/install): Install CortexPrism on Linux, macOS, or Windows`);
  lines.push(`- [Configuration](https://cortexprism.io/getting-started/configuration): Configure providers, memory, and plugins`);
  lines.push(`- [First Run](https://cortexprism.io/getting-started/first-run): Verify your installation and run an agent`);
  lines.push("");

  lines.push("## Documentation");
  lines.push(`- [CLI Reference](https://cortexprism.io/docs/cli): Every CortexPrism command — agent, plugins, sessions, marketplace, and more (41 commands)`);
  lines.push(`- [Architecture](https://cortexprism.io/docs/architecture): Agent loop, channels, daemon, memory system, model router, pipeline, and security (18 deep-dives)`);
  lines.push(`- [Developer Guide](https://cortexprism.io/docs/developer-guide): Build ESM, MCP, and WASM plugins — agent development, best practices, publishing, submission standards (10 guides)`);
  lines.push(`- [Knowledge Base](https://cortexprism.io/docs/knowledge-base): FAQ, troubleshooting, migration guides, performance tuning, and security guidelines`);
  lines.push(`- [Design Docs](https://cortexprism.io/docs/design-docs): Design decisions and RFCs`);
  lines.push("");

  lines.push("## Marketplace");
  lines.push(`- [Plugins](https://cortexprism.io/marketplace/plugins): ESM, MCP, and WASM plugins to extend your agents`);
  lines.push(`- [Agents](https://cortexprism.io/marketplace/agents): Pre-configured agent templates`);
  lines.push(`- [Publish a Plugin](https://cortexprism.io/marketplace/publish/plugin): Submit your plugin to the marketplace`);
  lines.push(`- [Publish an Agent](https://cortexprism.io/marketplace/publish/agent): Submit your agent configuration`);
  lines.push("");

  lines.push("## Learn More");
  lines.push(`- [Features](https://cortexprism.io/features): 15+ features — multi-provider LLM, 5-tier memory, sandboxed code execution, parallax security`);
  lines.push(`- [Use Cases](https://cortexprism.io/use-cases): Real-world scenarios for CortexPrism agents`);
  lines.push(`- [Security](https://cortexprism.io/security): Parallax security architecture — sandboxing, policy engine, and threat model`);
  lines.push(`- [Changelog](https://cortexprism.io/changelog): Release history for CortexPrism and CortexPrism Web`);
  lines.push(`- [Contribute](https://cortexprism.io/contribute): How to contribute to the open-source project`);
  lines.push(`- [API Reference](https://cortexprism.io/openapi): OpenAPI 3.1 specification for the CortexPrism REST API`);
  lines.push("");

  lines.push("## Optional");
  lines.push(`- [Full Documentation](https://cortexprism.io/llms-full.txt): All documentation in a single file for LLM ingestion`);
  lines.push(`- [Per-Page Markdown](https://cortexprism.io/api/docs/markdown): Individual doc pages as raw Markdown (e.g., /api/docs/markdown/cli/agent)`);
  lines.push(`- [Public Roadmap](https://github.com/CortexPrism/cortex): GitHub repository with issues and roadmap`);
  lines.push(`- [Discord Community](https://discord.gg/y7DkaEbPQC): Get help and discuss with the community`);

  return lines.join("\n") + "\n";
}

export async function buildLlmsFullTxt(): Promise<string> {
  const parts: string[] = [];

  parts.push(`# ${SITE_NAME} — Complete Documentation`);
  parts.push("");
  parts.push(`This file contains the full text of all CortexPrism documentation for LLM ingestion.`);
  parts.push("");

  parts.push("---");
  parts.push("");

  for (const section of DOCS_SECTIONS) {
    const label = DOCS_SECTION_LABELS[section];
    const slugs = getContentSlugs(section);

    parts.push(`## ${label}`);
    parts.push("");

    for (const slug of slugs) {
      try {
        const { content } = getContentBySlug(section, slug);
        const title = slug === "index"
          ? `${label} Overview`
          : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

        parts.push(`### ${title}`);
        parts.push("");
        parts.push(content);
        parts.push("");
        parts.push(`URL: https://cortexprism.io/docs/${section}${slug === "index" ? "" : `/${slug}`}`);
        parts.push("");
        parts.push("---");
        parts.push("");
      } catch {
        // skip files that can't be read
      }
    }
  }

  const gettingStartedSlugs = getContentSlugs("getting-started");
  parts.push("## Getting Started");
  parts.push("");
  for (const slug of gettingStartedSlugs) {
    try {
      const { content } = getContentBySlug("getting-started", slug);
      const title = slug === "index"
        ? "Getting Started with CortexPrism"
        : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      parts.push(`### ${title}`);
      parts.push("");
      parts.push(content);
      parts.push("");
      parts.push(`URL: https://cortexprism.io/getting-started/${slug === "index" ? "" : slug}`);
      parts.push("");
      parts.push("---");
      parts.push("");
    } catch {
      // skip
    }
  }

  parts.push("## Knowledge Base");
  parts.push("");
  try {
    const { articles } = await getAllKbArticles({ publishedOnly: true, limit: 200 });
    for (const article of articles) {
      parts.push(`### ${article.title}`);
      parts.push("");
      parts.push(article.content);
      parts.push("");
      parts.push(`URL: https://cortexprism.io/docs/knowledge-base/${article.slug}`);
      parts.push("");
      parts.push("---");
      parts.push("");
    }
  } catch {
    // db might not be available during build
  }

  return parts.join("\n") + "\n";
}

export async function buildSitemapMd(): Promise<string> {
  const lines: string[] = [];

  lines.push(`# ${SITE_NAME} — Sitemap for AI Agents`);
  lines.push("");
  lines.push("This Markdown sitemap lists all key pages for AI agent ingestion.");
  lines.push("");
  lines.push("## Static Pages");
  lines.push("");
  lines.push(`- [Home](https://cortexprism.io): ${SITE_NAME} landing page`);
  lines.push(`- [Features](https://cortexprism.io/features): Full feature list`);
  lines.push(`- [Install](https://cortexprism.io/install): Installation guide`);
  lines.push(`- [Use Cases](https://cortexprism.io/use-cases): Real-world scenarios`);
  lines.push(`- [About](https://cortexprism.io/about): About the project`);
  lines.push(`- [Security](https://cortexprism.io/security): Security architecture`);
  lines.push(`- [Changelog](https://cortexprism.io/changelog): Release history`);
  lines.push(`- [Contribute](https://cortexprism.io/contribute): Contributing guide`);
  lines.push(`- [OpenAPI](https://cortexprism.io/openapi): API reference`);
  lines.push("");

  lines.push("## Getting Started");
  lines.push("");
  const gsSlugs = getContentSlugs("getting-started");
  for (const slug of gsSlugs) {
    const title = slug === "index" ? "Getting Started" : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    lines.push(`- [${title}](https://cortexprism.io/getting-started/${slug === "index" ? "" : slug})`);
  }
  lines.push("");

  lines.push("## Documentation");
  lines.push("");
  for (const section of DOCS_SECTIONS) {
    const label = DOCS_SECTION_LABELS[section];
    const slugs = getContentSlugs(section);
    lines.push(`### ${label}`);
    lines.push("");
    for (const slug of slugs) {
      const title = slug === "index"
        ? `${label} Overview`
        : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const path = slug === "index" ? section : `${section}/${slug}`;
      lines.push(`- [${title}](https://cortexprism.io/docs/${path})`);
    }
    lines.push("");
  }

  lines.push("## Knowledge Base");
  lines.push("");
  try {
    const kbSlugs = await getKbSlugs();
    for (const slug of kbSlugs) {
      lines.push(`- [Article](https://cortexprism.io/docs/knowledge-base/${slug})`);
    }
  } catch {
    // db might not be available during build
  }
  lines.push("");

  lines.push("## Marketplace");
  lines.push(`- [All Plugins](https://cortexprism.io/marketplace/plugins)`);
  lines.push(`- [All Agents](https://cortexprism.io/marketplace/agents)`);
  lines.push(`- [Publish Plugin](https://cortexprism.io/marketplace/publish/plugin)`);
  lines.push(`- [Publish Agent](https://cortexprism.io/marketplace/publish/agent)`);

  return lines.join("\n") + "\n";
}
