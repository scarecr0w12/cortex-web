import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Puzzle, Bot, BarChart3 } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse the CortexPrism plugin and agent marketplace",
};

export default async function MarketplacePage() {
  const [pluginCount, agentCount] = await Promise.all([
    prisma.plugin.count({ where: { status: "approved" } }),
    prisma.agentConfig.count({ where: { status: "approved" } }),
  ]);

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e2e2ea]">Marketplace</h1>
        <p className="mt-4 text-lg text-[#9090a8] max-w-4xl mx-auto">
          Discover plugins and agent configurations for the CortexPrism ecosystem.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <Link href="/marketplace/plugins">
          <div className="glass-card-hover p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
              <Puzzle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#e2e2ea] mb-2">Plugins</h2>
            <p className="text-[#9090a8] mb-4">
              Extend CortexPrism with plugins. ESM modules, MCP servers, and WASM runtimes.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#55556a]}">{pluginCount} plugins available</span>
              <span className="inline-flex items-center gap-1 text-sm text-indigo-400">
                Browse <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>

        <Link href="/marketplace/agents">
          <div className="glass-card-hover p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#e2e2ea] mb-2">Agents</h2>
            <p className="text-[#9090a8] mb-4">
              Pre-configured agent configurations for various tasks and domains.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#55556a]">{agentCount} agents available</span>
              <span className="inline-flex items-center gap-1 text-sm text-indigo-400">
                Browse <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-[#e2e2ea]">Marketplace Stats</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl font-bold gradient-text">{pluginCount}</div>
            <div className="text-sm text-[#55556a]">Plugins</div>
          </div>
          <div>
            <div className="text-2xl font-bold gradient-text">{agentCount}</div>
            <div className="text-sm text-[#55556a]">Agents</div>
          </div>
          <div>
            <div className="text-2xl font-bold gradient-text">
              {formatNumber(pluginCount + agentCount)}
            </div>
            <div className="text-sm text-[#55556a]">Total Listings</div>
          </div>
          <div>
            <Link href="/marketplace/publish/plugin" className="text-sm text-indigo-400 hover:text-indigo-300">
              Publish a Plugin →
            </Link>
            <br />
            <Link href="/marketplace/publish/agent" className="text-sm text-indigo-400 hover:text-indigo-300">
              Publish an Agent →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
