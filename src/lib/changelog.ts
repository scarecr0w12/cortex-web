export interface ChangeEntry {
  type: "feature" | "bugfix" | "breaking" | "changed" | "removed" | "security";
  text: string;
}

export interface Release {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  changes: ChangeEntry[];
  unreleased?: boolean;
}

const SECTION_MAP: Record<string, "feature" | "bugfix" | "breaking" | "changed" | "removed" | "security"> = {
  added: "feature",
  fixed: "bugfix",
  changed: "changed",
  deprecated: "changed",
  removed: "removed",
  security: "security",
  breaking: "breaking",
};

function parseVersion(ver: string): "major" | "minor" | "patch" {
  const parts = ver.replace(/^v/, "").split(".");
  if (parts.length < 2) return "patch";
  const major = parseInt(parts[0]) || 0;
  const minor = parseInt(parts[1]) || 0;
  if (major >= 1) return "major";
  if (minor > 0) return "minor";
  return "patch";
}

export function parseChangelog(markdown: string): Release[] {
  const releases: Release[] = [];
  const lines = markdown.split("\n");

  let curRelease: Release | null = null;
  let curType: keyof typeof SECTION_MAP | "" = "";

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Version header: ## [1.0.0] — 2026-06-14  or  ## [Unreleased]
    const vMatch = line.match(/^##\s+\[(.+?)\]\s*(?:[—–-]\s*)?(\d{4}-\d{2}-\d{2})?/);
    if (vMatch) {
      if (curRelease) releases.push(curRelease);
      const version = vMatch[1].trim();
      curRelease = {
        version,
        date: vMatch[2] || "",
        type: parseVersion(version),
        changes: [],
        unreleased: version.toLowerCase() === "unreleased",
      };
      curType = "";
      continue;
    }

    if (!curRelease) continue;

    // Section header: ### Added  /  ### Changed  etc.
    const sMatch = line.match(/^###\s+(\w+)/);
    if (sMatch) {
      const key = sMatch[1].toLowerCase() as keyof typeof SECTION_MAP;
      curType = key in SECTION_MAP ? key : "";
      continue;
    }

    if (!curType) continue;

    // Top-level list item:  - text  or  - **bold**: text
    const topItem = line.match(/^-\s+(.*\S.*)/);
    if (topItem) {
      const text = topItem[1];
      const mapped = SECTION_MAP[curType] || "feature";
      curRelease.changes.push({ type: mapped, text });
      continue;
    }

    // Continuation of previous item (indented, or continuation text)
    if (curRelease.changes.length > 0 && line.trim() && !line.match(/^\s*$/)) {
      const last = curRelease.changes[curRelease.changes.length - 1];
      last.text += " " + line.trim();
    }
  }

  if (curRelease) releases.push(curRelease);
  return releases;
}

let cached: { releases: Release[]; ts: number } | null = null;

export async function getChangelog(): Promise<Release[]> {
  if (cached && Date.now() - cached.ts < 300_000) {
    return cached.releases;
  }
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/scarecr0w12/cortex/main/CHANGELOG.md",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const markdown = await res.text();
    const releases = parseChangelog(markdown);
    cached = { releases, ts: Date.now() };
    return releases;
  } catch {
    return [];
  }
}
