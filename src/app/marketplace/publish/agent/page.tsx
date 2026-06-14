import type { Metadata } from "next";
import { PublishForm } from "@/components/marketplace/PublishForm";

export const metadata: Metadata = {
  title: "Publish an Agent Configuration",
  description: "Submit an agent configuration to the CortexPrism marketplace",
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
