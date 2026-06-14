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

const changeTypeMap: Record<string, "feature" | "bugfix" | "breaking" | "changed" | "removed" | "security"> = {
  "added": "feature",
  "fixed": "bugfix",
  "changed": "changed",
  "deprecated": "changed",
  "removed": "removed",
  "security": "security",
  "breaking": "breaking",
};

function parseVersion(version: string): "major" | "minor" | "patch" {
  const parts = version.replace(/^v/, "").split(".");
  if (parts.length < 2) return "patch";
  const major = parseInt(parts[0]) || 0;
  const minor = parseInt(parts[1]) || 0;
  if (major >= 1) return "major";
  if (minor > 0) return "minor";
  return "patch";
}

export function parseChangelog(markdown: string): Release[] {
  const releases: Release[] = [];
  const versionLines = markdown.split("\n");
  let currentRelease: Release | null = null;
  let currentType: keyof typeof changeTypeMap | "" = "";

  const versionRegex = /^##\s+\[(.+?)\]\s*(?:—\s*|-\s*)?([\d-]+)?/;

  for (const line of versionLines) {
    const versionMatch = line.match(versionRegex);
    if (versionMatch) {
      if (currentRelease) {
        releases.push(currentRelease);
      }
      const version = versionMatch[1].trim();
      currentRelease = {
        version,
        date: versionMatch[2] || "",
        type: parseVersion(version),
        changes: [],
        unreleased: version.toLowerCase() === "unreleased",
      };
      currentType = "";
      continue;
    }

    const headerMatch = line.match(/^###\s+(.+)/);
    if (headerMatch && currentRelease) {
      const header = headerMatch[1].trim().toLowerCase();
      currentType = Object.keys(changeTypeMap).includes(header)
        ? header as keyof typeof changeTypeMap
        : "";
      continue;
    }

    const itemMatch = line.match(/^-\s+\*\*(.+?)\*\*[\s:]+(.+)/);
    if (itemMatch && currentRelease && currentType) {
      const title = itemMatch[1].trim();
      const body = itemMatch[2].trim();
      const mappedType = changeTypeMap[currentType] || "feature";
      currentRelease.changes.push({
        type: mappedType,
        text: body ? `${title} — ${body}` : title,
      });
      continue;
    }

    const simpleItem = line.match(/^-\s+(.+)/);
    if (simpleItem && currentRelease && currentType) {
      currentRelease.changes.push({
        type: changeTypeMap[currentType] || "feature",
        text: simpleItem[1].trim(),
      });
    }
  }

  if (currentRelease) {
    releases.push(currentRelease);
  }

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
