import type { Metadata } from "next";
import { PublishForm } from "@/components/marketplace/PublishForm";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Publish an Agent — CortexPrism Marketplace",
  description:
    "Submit a pre-configured agent profile to the CortexPrism marketplace. Share your specialized AI agent configurations with the community.",
  alternates: { canonical: `${SITE_URL}/marketplace/publish/agent` },
  openGraph: {
    title: "Publish an Agent — CortexPrism Marketplace",
    description:
      "Share your agent configuration with the CortexPrism community. Submit specialized AI agent profiles for coding, analysis, and more.",
    url: `${SITE_URL}/marketplace/publish/agent`,
  },
};

export default function PublishAgentPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e2e2ea] mb-2">Publish an Agent</h1>
        <p className="text-[#9090a8]">
          Share your agent configuration with the CortexPrism community.
        </p>
      </div>
      <PublishForm type="agent" />
    </div>
  );
}
