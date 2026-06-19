import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { getGitHubToken } from "@/lib/settings";

export const CORTEX_TOPICS = {
  primary: ["cortex-plugin", "cortex-agent", "cortexprism"],
  pluginTypes: ["esm", "mcp", "wasm"],
  categories: [
    "development", "data-processing", "security",
    "productivity", "analytics", "communication", "research",
  ],
  all: [] as string[],
};
CORTEX_TOPICS.all = [
  ...CORTEX_TOPICS.primary,
  ...CORTEX_TOPICS.pluginTypes,
  ...CORTEX_TOPICS.categories,
];

interface GitHubSearchItem {
  id: number;
  full_name: string;
  name: string;
  owner: { login: string };
  description: string | null;
  html_url: string;
  stargazers_count: number;
  topics: string[];
  license: { spdx_id: string } | null;
  pushed_at: string;
  updated_at: string;
}

interface GitHubSearchResponse {
  items: GitHubSearchItem[];
  total_count: number;
}

interface ManifestCheck {
  found: boolean;
  kind: "plugin" | "agent" | null;
  manifest: Record<string, unknown> | null;
}

export interface DiscoveredRepoInfo {
  owner: string;
  repo: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  topics: string[];
  manifestCheck: ManifestCheck;
}

function detectKind(topics: string[], manifest: ManifestCheck): "plugin" | "agent" | "unknown" {
  if (manifest.found && manifest.kind) return manifest.kind;
  if (topics.includes("cortex-agent")) return "agent";
  if (topics.some(t => ["esm", "mcp", "wasm", "cortex-plugin"].includes(t))) return "plugin";
  return "unknown";
}

function authHeader(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const GITHUB_ACCEPT = "application/vnd.github.v3+json, application/vnd.github.mercy-preview+json";

export async function searchGitHubByTopic(
  topic: string,
  token: string | null = null,
  perPage: number = 100,
): Promise<GitHubSearchItem[]> {
  const allItems: GitHubSearchItem[] = [];
  let page = 1;
  const maxPages = 10;

  while (page <= maxPages) {
    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=topic:${encodeURIComponent(topic)}&sort=updated&per_page=${perPage}&page=${page}`,
        {
          headers: {
            Accept: GITHUB_ACCEPT,
            ...authHeader(token),
          },
        },
      );
      if (!res.ok) {
        if (res.status === 403 && !token) {
          console.warn(`GitHub API rate limit hit for topic "${topic}". Set a GITHUB_TOKEN for higher limits.`);
        }
        break;
      }
      const data: GitHubSearchResponse = await res.json();
      allItems.push(...data.items);
      if (data.items.length < perPage) break;
      page++;
    } catch {
      break;
    }
  }

  return allItems;
}

async function checkManifest(
  owner: string,
  repo: string,
  token: string | null = null,
  branch: string = "main",
): Promise<ManifestCheck> {
  const result: ManifestCheck = { found: false, kind: null, manifest: null };

  const manifestPaths = ["cortex.json", "cortex.yaml", "manifest.json", "cortex/mod.json"];
  const branches = [branch, "main", "master"];

  for (const b of branches) {
    for (const path of manifestPaths) {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${b}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              ...authHeader(token),
            },
          },
        );
        if (!res.ok) continue;

        const data = await res.json();
        if (!data.download_url) continue;

        const contentRes = await fetch(data.download_url);
        if (!contentRes.ok) continue;

        if (path.endsWith(".json")) {
          const manifest = await contentRes.json();
          result.found = true;
          result.manifest = manifest;

          if (manifest.kind || manifest.capabilities) {
            result.kind = "plugin";
          } else if (manifest.provider || manifest.model || manifest.systemPrompt) {
            result.kind = "agent";
          }
          return result;
        }
      } catch {
        continue;
      }
    }
    if (result.found) break;
  }

  return result;
}

async function buildImportedRepoUrls(
  discovered: { owner: string; repo: string; fullName: string }[],
): Promise<Set<string>> {
  const imported = new Set<string>();
  if (discovered.length === 0) return imported;

  const repoUrls = discovered.map(r => `https://github.com/${r.owner}/${r.repo}`);

  try {
    const [existingPlugins, existingAgents] = await Promise.all([
      prisma.plugin.findMany({
        where: {
          OR: [
            { repository: { in: repoUrls } },
            { githubImportId: { in: discovered.map(r => `topic:${r.fullName}`) } },
            { githubImportId: { in: discovered.map(r => `api:${r.owner}/${r.repo}`) } },
          ],
        },
        select: { repository: true, githubImportId: true },
      }),
      prisma.agentConfig.findMany({
        where: {
          OR: [
            { repository: { in: repoUrls } },
            { githubImportId: { in: discovered.map(r => `topic:${r.fullName}`) } },
            { githubImportId: { in: discovered.map(r => `api:${r.owner}/${r.repo}`) } },
          ],
        },
        select: { repository: true, githubImportId: true },
      }),
    ]);

    for (const p of existingPlugins) {
      if (p.repository) imported.add(p.repository);
      if (p.githubImportId) {
        for (const r of discovered) {
          if (
            p.githubImportId === `topic:${r.fullName}` ||
            p.githubImportId === `api:${r.owner}/${r.repo}` ||
            p.githubImportId.startsWith(`github:${r.owner}/${r.repo}:`)
          ) {
            imported.add(`https://github.com/${r.owner}/${r.repo}`);
          }
        }
      }
    }

    for (const a of existingAgents) {
      if (a.repository) imported.add(a.repository);
      if (a.githubImportId) {
        for (const r of discovered) {
          if (
            a.githubImportId === `topic:${r.fullName}` ||
            a.githubImportId === `api:${r.owner}/${r.repo}` ||
            a.githubImportId.startsWith(`github:${r.owner}/${r.repo}:`)
          ) {
            imported.add(`https://github.com/${r.owner}/${r.repo}`);
          }
        }
      }
    }
  } catch {
    // if DB query fails, proceed without filtering — nothing marked as imported
  }

  return imported;
}

interface RepoInfo {
  fullName: string;
  owner: string;
  repo: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  topics: string[];
}

async function listOrgRepos(org: string, token: string | null): Promise<RepoInfo[]> {
  const allRepos: RepoInfo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    try {
      const res = await fetch(
        `https://api.github.com/orgs/${org}/repos?per_page=${perPage}&page=${page}&sort=updated&type=public`,
        {
          headers: {
            Accept: GITHUB_ACCEPT,
            ...authHeader(token),
          },
        },
      );
      if (!res.ok) break;
      const repos = await res.json();
      if (!Array.isArray(repos) || repos.length === 0) break;

      for (const r of repos) {
        allRepos.push({
          fullName: r.full_name,
          owner: r.owner?.login || org,
          repo: r.name,
          description: r.description || null,
          htmlUrl: r.html_url,
          stars: r.stargazers_count || 0,
          topics: r.topics || [],
        });
      }

      if (repos.length < perPage) break;
      page++;
    } catch {
      break;
    }
  }

  return allRepos;
}

async function processRepos(
  repos: RepoInfo[],
  scanId: string,
  userId: string,
  token: string | null,
  topic: string,
  filterCortex: boolean,
): Promise<number> {
  const results: {
    fullName: string; owner: string; repo: string;
    description: string | null; htmlUrl: string; stars: number;
    topics: string[]; manifestCheck: ManifestCheck;
  }[] = [];

  for (const repo of repos) {
    const hasCortexTopic = repo.topics.some(t => CORTEX_TOPICS.all.includes(t));
    const manifestCheck = hasCortexTopic
      ? { found: false, kind: null as "plugin" | "agent" | null, manifest: null as Record<string, unknown> | null }
      : await checkManifest(repo.owner, repo.repo, token);
    results.push({
      fullName: repo.fullName,
      owner: repo.owner,
      repo: repo.repo,
      description: repo.description,
      htmlUrl: repo.htmlUrl,
      stars: repo.stars,
      topics: repo.topics,
      manifestCheck,
    });
  }

  const discovered = filterCortex
    ? results.filter(r =>
        r.topics.some(t => CORTEX_TOPICS.all.includes(t)) || r.manifestCheck.found
      )
    : results;

  const importedRepoUrls = await buildImportedRepoUrls(
    discovered.map(r => ({ owner: r.owner, repo: r.repo, fullName: r.fullName })),
  );

  for (const r of discovered) {
    const kind = detectKind(r.topics, r.manifestCheck);
    const repoUrl = `https://github.com/${r.owner}/${r.repo}`;
    const alreadyImported = importedRepoUrls.has(repoUrl);
    try {
      await prisma.discoveredRepo.create({
        data: {
          scanId,
          owner: r.owner,
          repo: r.repo,
          fullName: r.fullName,
          description: r.description,
          htmlUrl: r.htmlUrl,
          stars: r.stars,
          topics: JSON.stringify(r.topics),
          repoKind: kind,
          manifestFound: r.manifestCheck.found,
          manifestData: r.manifestCheck.manifest ? JSON.stringify(r.manifestCheck.manifest) : null,
          importStatus: alreadyImported ? "imported" : "pending",
        },
      });
    } catch {
      // duplicate skip
    }
  }

  await prisma.gitHubTopicScan.update({
    where: { id: scanId },
    data: { status: "completed", resultCount: discovered.length, completedAt: new Date() },
  });

  await createAuditLog({
    userId,
    action: "github.topic_scan",
    entity: "github_topic_scan",
    entityId: scanId,
    metadata: { topic, discovered: discovered.length, total: repos.length },
  });

  return discovered.length;
}

export async function scanTopic(topic: string, userId: string): Promise<{ scanId: string; totalFound: number }> {
  const token = await getGitHubToken();

  const scan = await prisma.gitHubTopicScan.create({
    data: {
      topic,
      status: "running",
      startedAt: new Date(),
      createdById: userId,
    },
  });

  try {
    const repos = await searchGitHubByTopic(topic, token);
    const repoInfos: RepoInfo[] = repos.map(r => ({
      fullName: r.full_name,
      owner: r.owner.login,
      repo: r.name,
      description: r.description,
      htmlUrl: r.html_url,
      stars: r.stargazers_count,
      topics: r.topics || [],
    }));

    const totalFound = await processRepos(repoInfos, scan.id, userId, token, topic, true);
    return { scanId: scan.id, totalFound };
  } catch (error) {
    await prisma.gitHubTopicScan.update({
      where: { id: scan.id },
      data: {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      },
    });
    throw error;
  }
}

export async function scanOrg(orgName: string, userId: string): Promise<{ scanId: string; status: string }> {
  const topic = `org:${orgName}`;

  const scan = await prisma.gitHubTopicScan.create({
    data: {
      topic,
      status: "running",
      startedAt: new Date(),
      createdById: userId,
    },
  });

  return { scanId: scan.id, status: "running" };
}

export async function runOrgScan(scanId: string, orgName: string, userId: string): Promise<void> {
  const token = await getGitHubToken();
  const topic = `org:${orgName}`;

  try {
    const repos = await listOrgRepos(orgName, token);
    await processRepos(repos, scanId, userId, token, topic, false);
  } catch (error) {
    await prisma.gitHubTopicScan.update({
      where: { id: scanId },
      data: {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      },
    });
  }
}

export async function importDiscoveredRepo(
  discoveredId: string,
  userId: string,
  autoApprove: boolean = false,
): Promise<{ success: boolean; entityId?: string; error?: string }> {
  const discovered = await prisma.discoveredRepo.findUnique({ where: { id: discoveredId } });
  if (!discovered) return { success: false, error: "Not found" };
  if (discovered.importStatus !== "pending") return { success: false, error: `Already ${discovered.importStatus}` };

  try {
    const repoUrl = `https://github.com/${discovered.owner}/${discovered.repo}`;
    const manifest = discovered.manifestData ? JSON.parse(discovered.manifestData) : null;
    const slug = discovered.repo.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    const kind = discovered.repoKind || "unknown";

    if (kind === "plugin") {
      const existing = await prisma.plugin.findFirst({
        where: { OR: [{ name: discovered.repo }, { slug }] },
      });
      if (existing) {
        await prisma.discoveredRepo.update({
          where: { id: discoveredId },
          data: { importStatus: "skipped", error: "Already exists in marketplace" },
        });
        return { success: false, error: "Already exists" };
      }

      const pluginTopics = typeof discovered.topics === 'string'
        ? discovered.topics
        : JSON.stringify(discovered.topics);

      const plugin = await prisma.plugin.create({
        data: {
          name: discovered.repo,
          slug,
          version: (manifest?.version as string) || "1.0.0",
          description: discovered.description || `${discovered.repo} plugin from ${discovered.fullName}`,
          kind: (manifest?.kind as string) || "esm",
          entryPoint: (manifest?.entryPoint as string) || `plugins/${slug}/mod.ts`,
          capabilities: JSON.stringify((manifest?.capabilities as string[]) || []),
          tags: pluginTopics,
          author: discovered.owner,
          license: (manifest?.license as string) || null,
          homepage: repoUrl,
          repository: repoUrl,
          status: autoApprove ? "approved" : "pending",
          githubImportId: `topic:${discovered.fullName}`,
          githubStars: discovered.stars,
          githubTopics: pluginTopics,
          userId: null,
        },
      });

      await prisma.discoveredRepo.update({
        where: { id: discoveredId },
        data: { importStatus: "imported", importedId: plugin.id },
      });

      return { success: true, entityId: plugin.id };
    }

    if (kind === "agent") {
      const existing = await prisma.agentConfig.findFirst({
        where: { OR: [{ name: discovered.repo }, { slug }] },
      });
      if (existing) {
        await prisma.discoveredRepo.update({
          where: { id: discoveredId },
          data: { importStatus: "skipped", error: "Already exists in marketplace" },
        });
        return { success: false, error: "Already exists" };
      }

      const agentTopics = typeof discovered.topics === 'string'
        ? discovered.topics
        : JSON.stringify(discovered.topics);

      const agent = await prisma.agentConfig.create({
        data: {
          name: discovered.repo,
          slug,
          version: (manifest?.version as string) || "1.0.0",
          description: discovered.description || `${discovered.repo} agent from ${discovered.fullName}`,
          provider: (manifest?.provider as string) || null,
          model: (manifest?.model as string) || null,
          temperature: (manifest?.temperature as number) ?? null,
          tools: JSON.stringify((manifest?.tools as string[]) || []),
          tags: agentTopics,
          systemPrompt: (manifest?.systemPrompt as string) || null,
          author: discovered.owner,
          license: (manifest?.license as string) || null,
          homepage: repoUrl,
          repository: repoUrl,
          status: autoApprove ? "approved" : "pending",
          githubImportId: `topic:${discovered.fullName}`,
          githubStars: discovered.stars,
          githubTopics: agentTopics,
          userId: null,
        },
      });

      await prisma.discoveredRepo.update({
        where: { id: discoveredId },
        data: { importStatus: "imported", importedId: agent.id },
      });

      return { success: true, entityId: agent.id };
    }

    await prisma.discoveredRepo.update({
      where: { id: discoveredId },
      data: { importStatus: "skipped", error: "Unknown kind — cannot determine if plugin or agent" },
    });

    return { success: false, error: "Unknown kind" };
  } catch (error) {
    await prisma.discoveredRepo.update({
      where: { id: discoveredId },
      data: { importStatus: "error", error: error instanceof Error ? error.message : "Import failed" },
    });
    return { success: false, error: "Import failed" };
  }
}
