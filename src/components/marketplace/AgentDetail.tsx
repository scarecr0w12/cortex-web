"use client";

import { Badge } from "@/components/shared/Badge";
import { DownloadCount } from "@/components/shared/DownloadCount";
import { StarRating } from "@/components/shared/StarRating";
import { InstallCommand } from "@/components/marketplace/InstallCommand";
import { formatDate } from "@/lib/utils";
import { Github, User, Brain, Thermometer } from "lucide-react";

interface AgentDetailData {
  id: string;
  name: string;
  slug: string;
  version: string;
  description: string;
  provider: string | null;
  model: string | null;
  temperature: number | null;
  tools: string[];
  tags: string[];
  systemPrompt: string | null;
  soulContent: string | null;
  author: string | null;
  authorUrl: string | null;
  repository: string | null;
  icon: string | null;
  readme: string | null;
  downloads: number;
  rating: number;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AgentDetailProps {
  agent: AgentDetailData;
}

export function AgentDetailView({ agent }: AgentDetailProps) {
  return (
    <div>
      <div className="glass-card p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl shrink-0">
            <span className="text-purple-400 font-bold">A</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-[#e2e2ea]">{agent.name}</h1>
              {agent.provider && <Badge variant="indigo">{agent.provider}</Badge>}
              <span className="text-sm font-mono text-[#55556a]">v{agent.version}</span>
            </div>
            <p className="text-[#9090a8]">{agent.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
          <StarRating rating={agent.rating} />
          <DownloadCount count={agent.downloads} />
          {agent.author && (
            <span className="flex items-center gap-1 text-[#55556a]">
              <User className="w-3.5 h-3.5" />
              {agent.author}
            </span>
          )}
          {agent.model && (
            <span className="flex items-center gap-1 text-[#55556a]">
              <Brain className="w-3.5 h-3.5" />
              {agent.model}
            </span>
          )}
          {agent.temperature !== null && (
            <span className="flex items-center gap-1 text-[#55556a]">
              <Thermometer className="w-3.5 h-3.5" />
              temp: {agent.temperature}
            </span>
          )}
        </div>

        <div className="mb-6">
          <p className="text-xs text-[#55556a] mb-2">Install Command</p>
          <InstallCommand type="agent" slug={agent.slug} />
        </div>

        {agent.repository && (
          <a href={agent.repository} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300">
            <Github className="w-3.5 h-3.5" /> Repository
          </a>
        )}
      </div>

      {agent.tags.length > 0 && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#e2e2ea] mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {agent.tags.map((tag) => (
              <Badge key={tag} variant="default">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {agent.tools.length > 0 && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#e2e2ea] mb-3">Tools</h2>
          <div className="flex flex-wrap gap-2">
            {agent.tools.map((tool) => (
              <Badge key={tool} variant="indigo">{tool}</Badge>
            ))}
          </div>
        </div>
      )}

      {agent.systemPrompt && (
        <div className="glass-card p-8 mb-8">
          <h2 className="text-lg font-semibold text-[#e2e2ea] mb-4">System Prompt</h2>
          <div className="bg-[#0a0a0f] rounded-lg p-4 border border-[rgba(255,255,255,0.07)]">
            <pre className="text-sm text-[#9090a8] font-mono whitespace-pre-wrap">{agent.systemPrompt}</pre>
          </div>
        </div>
      )}

      {agent.readme && (
        <div className="glass-card p-8">
          <h2 className="text-lg font-semibold text-[#e2e2ea] mb-4">README</h2>
          <div className="text-sm text-[#9090a8] whitespace-pre-wrap">{agent.readme}</div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-xs text-[#55556a]">
          Published {formatDate(agent.createdAt)} · Updated {formatDate(agent.updatedAt)}
        </p>
      </div>
    </div>
  );
}
