import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const alt = "CortexPrism Plugin — Marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const plugin = await prisma.plugin.findFirst({
    where: { status: "approved", OR: [{ id: params.id }, { slug: params.id }] },
    select: { name: true, description: true, version: true, author: true, kind: true, slug: true },
  });

  if (!plugin) {
    return new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0f", color: "#9090a8", fontSize: 36 }}>
        Plugin Not Found — CortexPrism
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const name = plugin.name;
  const kind = plugin.kind.toUpperCase();
  const initial = name.charAt(0).toUpperCase();
  const description = plugin.description
    ? (plugin.description.length > 130 ? plugin.description.slice(0, 127) + "…" : plugin.description)
    : `A ${plugin.kind.toUpperCase()} plugin for the CortexPrism AI Agent Operating System`;
  const version = `v${plugin.version}`;
  const authorInfo = plugin.author ? `by ${plugin.author}` : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0f",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            padding: "64px 72px",
            flex: 1,
            gap: 40,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  color: "#e2e2ea",
                  lineHeight: 1.1,
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#a5b4fc",
                  background: "rgba(99,102,241,0.15)",
                  padding: "6px 18px",
                  borderRadius: 12,
                  border: "1px solid rgba(99,102,241,0.3)",
                }}
              >
                {kind}
              </span>
            </div>

            <div
              style={{
                fontSize: 26,
                color: "#9090a8",
                lineHeight: 1.4,
                maxWidth: 720,
                marginTop: 4,
              }}
            >
              {description}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginTop: 8,
                fontSize: 20,
                color: "#55556a",
              }}
            >
              <span>{version}</span>
              {authorInfo && <span>{authorInfo}</span>}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 72px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              C
            </div>
            <span style={{ fontSize: 22, fontWeight: 600, color: "#e2e2ea" }}>
              CortexPrism
            </span>
          </div>
          <span style={{ fontSize: 20, color: "#55556a" }}>
            cortexprism.io/marketplace/plugins/{plugin.slug}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
