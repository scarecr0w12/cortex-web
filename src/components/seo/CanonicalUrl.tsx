import { SITE_URL } from "@/lib/seo";

export function CanonicalUrl({ path }: { path: string }) {
  const canonical = path.startsWith("http") ? path : `${SITE_URL}${path}`;
  return <link rel="canonical" href={canonical} />;
}
