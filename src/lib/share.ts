export { SITE_URL } from "@/lib/seo";

export interface ShareUrls {
  twitter: string;
  facebook: string;
  linkedin: string;
  reddit: string;
  hackernews: string;
  email: string;
}

export function getShareUrls(url: string, title: string, text?: string): ShareUrls {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = text ? encodeURIComponent(text) : encodedTitle;

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    hackernews: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
  };
}

export function getPluginShareText(name: string, description: string): string {
  const desc = description.length > 100 ? description.slice(0, 97) + "..." : description;
  return `Check out "${name}" — a plugin for CortexPrism AI Agent Operating System: ${desc}`;
}

export function getBlogShareText(title: string, excerpt?: string | null): string {
  if (excerpt) {
    const desc = excerpt.length > 100 ? excerpt.slice(0, 97) + "..." : excerpt;
    return `Read "${title}" — ${desc}`;
  }
  return `Read "${title}" on the CortexPrism blog`;
}

export function getAgentShareText(name: string, description: string): string {
  const desc = description.length > 100 ? description.slice(0, 97) + "..." : description;
  return `Check out "${name}" — an AI agent profile for CortexPrism: ${desc}`;
}

export async function nativeShare(title: string, text: string, url: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  try {
    await navigator.share({ title, text, url });
    return true;
  } catch {
    return false;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
