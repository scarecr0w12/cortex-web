interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  description: string | null;
  license: { spdx_id: string } | null;
  topics: string[];
  pushed_at: string;
}

interface RepoMetadata {
  stars: number;
  forks: number;
  openIssues: number;
  description: string | null;
  license: string | null;
  topics: string[];
  lastCommit: string | null;
}

const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || "CortexPrism/cortex";

let cached: { data: GitHubRepo; ts: number } | null = null;

export async function getGitHubStats(): Promise<GitHubRepo> {
  if (cached && Date.now() - cached.ts < 300_000) {
    return cached.data;
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    const data: GitHubRepo = await res.json();
    cached = { data, ts: Date.now() };
    return data;
  } catch {
    return { stargazers_count: 0, forks_count: 0, open_issues_count: 0, description: null, license: null, topics: [], pushed_at: "" };
  }
}

const repoCache = new Map<string, { data: RepoMetadata; ts: number }>();

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "github.com") return null;
    const parts = u.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/");
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getRepoMetadata(repoUrl: string): Promise<RepoMetadata | null> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) return null;

  const cacheKey = `${parsed.owner}/${parsed.repo}`;
  const cachedEntry = repoCache.get(cacheKey);
  if (cachedEntry && Date.now() - cachedEntry.ts < 300_000) {
    return cachedEntry.data;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${cacheKey}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data: GitHubRepo = await res.json();
    const result: RepoMetadata = {
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      description: data.description,
      license: data.license?.spdx_id || null,
      topics: data.topics || [],
      lastCommit: data.pushed_at || null,
    };
    repoCache.set(cacheKey, { data: result, ts: Date.now() });
    return result;
  } catch {
    return null;
  }
}
