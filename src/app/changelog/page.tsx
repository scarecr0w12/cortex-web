import type { Metadata } from "next";
import { Tag, GitBranch, Globe, AlertCircle } from "lucide-react";
import { getChangelog } from "@/lib/changelog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Release history for the CortexPrism project, pulled live from GitHub",
};

const websiteRelease = {
  version: "1.0.0",
  date: "2026-06-14",
  type: "major" as const,
  unreleased: false,
  changes: [
    { type: "feature" as const, text: "Initial public release of the CortexPrism website" },
    { type: "feature" as const, text: "Landing page with hero, stats bar, feature grid, and CTA" },
    { type: "feature" as const, text: "Features overview page with 11 detailed feature cards" },
    { type: "feature" as const, text: "Getting Started documentation (quickstart, installation, first run, configuration)" },
    { type: "feature" as const, text: "CLI Reference documentation for all cortex subcommands" },
    { type: "feature" as const, text: "Architecture documentation (agent loop, memory, security, router, daemon, plugins, databases)" },
    { type: "feature" as const, text: "Knowledge Base (FAQ, troubleshooting, best practices, provider guide, sandbox guide)" },
    { type: "feature" as const, text: "Plugin marketplace with search, filtering, pagination, and detail pages" },
    { type: "feature" as const, text: "Agent marketplace with search, provider filtering, and detail pages" },
    { type: "feature" as const, text: "Publish forms for plugins and agents (manual review flow)" },
    { type: "feature" as const, text: "Swagger UI at /openapi for the marketplace REST API" },
    { type: "feature" as const, text: "OpenAPI 3.1 spec served at /api/docs/openapi.json" },
    { type: "feature" as const, text: "Marketplace REST API: CRUD for plugins/agents, categories, stats, download endpoints" },
    { type: "feature" as const, text: "Dark theme with responsive design and SEO metadata" },
    { type: "feature" as const, text: "Live GitHub stars from API with 5-minute caching" },
    { type: "feature" as const, text: "Nginx reverse proxy and systemd service for production" },
    { type: "feature" as const, text: "Dockerfile and docker-compose.yml for container deployment" },
  ],
};

const typeStyles: Record<string, string> = {
  feature: "text-green-400",
  bugfix: "text-yellow-400",
  breaking: "text-red-400",
  changed: "text-blue-400",
  removed: "text-red-400",
  security: "text-orange-400",
};

export default async function ChangelogPage() {
  const cortexReleases = await getChangelog();
  const allReleases = [websiteRelease, ...cortexReleases];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e2e2ea]">Changelog</h1>
        <p className="mt-4 text-lg text-[#9090a8]">
          Release history pulled live from{" "}
          <a
            href="https://github.com/scarecr0w12/cortex"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300"
          >
            github.com/scarecr0w12/cortex
          </a>
        </p>
      </div>

      {cortexReleases.length === 0 && (
        <div className="glass-card p-8 mb-8 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
          <p className="text-sm text-[#9090a8]">
            Could not fetch live changelog from GitHub. Showing website release only.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {allReleases.map((release) => (
          <div
            key={release.version}
            className={`glass-card p-6 md:p-8 ${
              release.unreleased ? "border-indigo-500/30" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-xl font-bold font-mono text-[#e2e2ea]">
                    {release.unreleased ? "[Unreleased]" : release.version}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {release.version === "1.0.0" && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Website
                    </span>
                  )}
                  {release.type === "major" && !release.unreleased && release.version !== "1.0.0" && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                      Major Release
                    </span>
                  )}
                  {release.unreleased && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      In Development
                    </span>
                  )}
                </div>
              </div>
              {release.date && !release.unreleased && (
                <time className="text-sm text-[#55556a] font-mono">{release.date}</time>
              )}
            </div>

            {release.version === "1.0.0" && (
              <p className="text-sm text-[#55556a] mb-4 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                cortexprism.io
              </p>
            )}

            {release.changes.length > 0 ? (
              <ul className="space-y-1.5">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        typeStyles[change.type] || "text-[#55556a]"
                      }`}
                    />
                    <span className="text-[#9090a8] leading-relaxed">{change.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#55556a] italic">
                {release.unreleased
                  ? "No changes yet for the upcoming release."
                  : "No changes recorded for this version."}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="https://github.com/scarecr0w12/cortex/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
        >
          <GitBranch className="w-4 h-4" />
          View full CHANGELOG.md on GitHub
        </a>
      </div>
    </div>
  );
}
