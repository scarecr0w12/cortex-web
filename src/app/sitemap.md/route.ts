import { buildSitemapMd } from "@/lib/llms";

export async function GET() {
  const content = await buildSitemapMd();
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

export const revalidate = 3600;
