import type { Metadata } from "next";
import { PublishForm } from "@/components/marketplace/PublishForm";

export const metadata: Metadata = {
  title: "Publish a Plugin",
  description: "Submit a plugin to the CortexPrism marketplace",
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
