import type { Metadata } from "next";
import { PublishForm } from "@/components/marketplace/PublishForm";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Publish a Plugin — CortexPrism Marketplace",
  description:
    "Submit your ESM module, MCP server, or WASM plugin to the CortexPrism marketplace. Share your extensions with the open-source agentic harness community.",
  alternates: { canonical: `${SITE_URL}/marketplace/publish/plugin` },
  openGraph: {
    title: "Publish a Plugin — CortexPrism Marketplace",
    description:
      "Share your plugin with the CortexPrism community. Submit ESM modules, MCP servers, or WASM plugins to the marketplace.",
    url: `${SITE_URL}/marketplace/publish/plugin`,
  },
};

export default function PublishPluginPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e2e2ea] mb-2">Publish a Plugin</h1>
        <p className="text-[#9090a8]">
          Share your plugin with the CortexPrism community.
        </p>
      </div>
      <PublishForm type="plugin" />
    </div>
  );
}
