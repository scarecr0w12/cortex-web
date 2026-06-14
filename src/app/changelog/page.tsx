import type { Metadata } from "next";
import { Tag, GitBranch, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Release history for the CortexPrism website and project",
};

interface Release {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  project: "website" | "cortex";
  changes: { type: string; text: string }[];
}

const releases: Release[] = [
  {
    version: "1.0.0",
    date: "2026-06-14",
    type: "major",
    project: "website",
    changes: [
      { type: "feature", text: "Initial public release of the CortexPrism website" },
      { type: "feature", text: "Landing page with hero, stats bar, feature grid, and CTA" },
      { type: "feature", text: "Features overview page with 11 detailed feature cards" },
      { type: "feature", text: "Getting Started documentation (quickstart, installation, first run, configuration)" },
      { type: "feature", text: "CLI Reference documentation for all cortex subcommands" },
      { type: "feature", text: "Architecture documentation (agent loop, memory, security, router, daemon, plugins, databases)" },
      { type: "feature", text: "Knowledge Base (FAQ, troubleshooting, best practices, provider guide, sandbox guide)" },
      { type: "feature", text: "Plugin marketplace with search, filtering, pagination, and detail pages" },
      { type: "feature", text: "Agent marketplace with search, provider filtering, and detail pages" },
      { type: "feature", text: "Publish forms for plugins and agents (manual review flow)" },
      { type: "feature", text: "Swagger UI at /openapi for the marketplace REST API" },
      { type: "feature", text: "OpenAPI 3.1 spec served at /api/docs/openapi.json" },
      { type: "feature", text: "Marketplace REST API: CRUD for plugins/agents, categories, stats, download endpoints" },
      { type: "feature", text: "Dark theme with responsive design and SEO metadata" },
      { type: "feature", text: "Live GitHub stars from API with 5-minute caching" },
      { type: "feature", text: "Nginx reverse proxy and systemd service for production" },
      { type: "feature", text: "Dockerfile and docker-compose.yml for container deployment" },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-05-15",
    type: "major",
    project: "cortex",
    changes: [
      { type: "feature", text: "Initial public release of CortexPrism" },
      { type: "feature", text: "Multi-provider LLM support (OpenAI, Anthropic, Google, Groq, 12+)" },
      { type: "feature", text: "5-tier memory system (ephemeral, working, semantic, archival, procedural)" },
      { type: "feature", text: "Parallax security model with vault, policy engine, and approval workflows" },
      { type: "feature", text: "Plugin system supporting ESM, MCP, and WASM plugins" },
      { type: "feature", text: "Agent manager with configurable agent profiles" },
      { type: "feature", text: "RouteLLM model router integration" },
      { type: "feature", text: "WebSocket-based real-time streaming" },
      { type: "feature", text: "REST API with Web UI dashboard" },
      { type: "feature", text: "Code sandbox execution (Python, Wasm)" },
      { type: "feature", text: "Daemon supervisor with job scheduler" },
      { type: "feature", text: "Micro-services distributed architecture" },
    ],
  },
  {
    version: "0.0.5",
    date: "2026-04-20",
    type: "minor",
    project: "cortex",
    changes: [
      { type: "feature", text: "Memory system refactored into 5 distinct tiers" },
      { type: "feature", text: "Policy engine with allow/deny rule system" },
      { type: "feature", text: "Approval workflows for tool calls" },
      { type: "feature", text: "Enhanced vault encryption with key rotation" },
    ],
  },
  {
    version: "0.0.4",
    date: "2026-03-25",
    type: "minor",
    project: "cortex",
    changes: [
      { type: "feature", text: "Plugin system with ESM, MCP, and WASM support" },
      { type: "feature", text: "Plugin registry with install/list/enable/disable" },
      { type: "feature", text: "Web UI for chat and plugin management" },
      { type: "feature", text: "OpenAPI documentation for REST API" },
    ],
  },
  {
    version: "0.0.3",
    date: "2026-02-28",
    type: "minor",
    project: "cortex",
    changes: [
      { type: "feature", text: "Agent manager with CRUD operations" },
      { type: "feature", text: "RouteLLM model router for intelligent model selection" },
      { type: "feature", text: "Daemon mode with process supervision" },
      { type: "feature", text: "Job scheduler with CRON-like syntax" },
    ],
  },
  {
    version: "0.0.2",
    date: "2026-01-30",
    type: "patch",
    project: "cortex",
    changes: [
      { type: "feature", text: "Code sandbox for Python and shell execution" },
      { type: "feature", text: "Basic memory system (semantic + working tiers)" },
      { type: "feature", text: "Provider configuration and credential management" },
    ],
  },
  {
    version: "0.0.1",
    date: "2026-01-05",
    type: "patch",
    project: "cortex",
    changes: [
      { type: "feature", text: "Initial prototype with CLI chat interface" },
      { type: "feature", text: "OpenAI and Anthropic provider support" },
      { type: "feature", text: "Basic tool calling system" },
      { type: "feature", text: "Project scaffolding and build system" },
    ],
  },
];

const typeStyles: Record<string, string> = {
  feature: "text-green-400",
  bugfix: "text-yellow-400",
  breaking: "text-red-400",
};

export default function ChangelogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e2e2ea]">Changelog</h1>
        <p className="mt-4 text-lg text-[#9090a8]">
          Release history for the CortexPrism website and project.
        </p>
      </div>

      <div className="space-y-8">
        {releases.map((release) => (
          <div key={`${release.project}-${release.version}`} className="glass-card p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-xl font-bold font-mono text-[#e2e2ea]">{release.version}</h2>
                </div>
                {release.project === "website" ? (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Website
                  </span>
                ) : release.type === "major" ? (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                    Major Release
                  </span>
                ) : null}
              </div>
              <time className="text-sm text-[#55556a] font-mono">{release.date}</time>
            </div>

            {release.project === "website" && (
              <p className="text-sm text-[#55556a] mb-4 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                cortexprism.io
              </p>
            )}

            <ul className="space-y-2">
              {release.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${typeStyles[change.type] || "text-[#55556a]"}`} />
                  <span className="text-[#9090a8]">{change.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="https://github.com/scarecr0w12/cortex/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
        >
          <GitBranch className="w-4 h-4" />
          View all Cortex releases on GitHub
        </a>
      </div>
    </div>
  );
}
