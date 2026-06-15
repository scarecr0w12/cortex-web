"use client";

import { Badge } from "@/components/shared/Badge";
import { DownloadCount } from "@/components/shared/DownloadCount";
import { StarRating } from "@/components/shared/StarRating";
import { InstallCommand } from "@/components/marketplace/InstallCommand";
import { ScreenshotGallery } from "@/components/marketplace/ScreenshotGallery";
import { ReviewSection } from "@/components/marketplace/ReviewSection";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  Globe, Github, User, ExternalLink, Star, GitFork, Tag
} from "lucide-react";

interface Screenshot {
  url: string;
  alt: string | null;
}

interface PluginDetailData {
  id: string;
  name: string;
  slug: string;
  version: string;
  description: string;
  kind: string;
  entryPoint: string;
  capabilities: string[];
  tags: string[];
  author: string | null;
  authorUrl: string | null;
  homepage: string | null;
  repository: string | null;
  license: string | null;
  icon: string | null;
  readme: string | null;
  downloads: number;
  rating: number;
  githubStars: number;
  githubForks: number;
  githubTopics: string[];
  category: string | null;
  screenshots: Screenshot[];
  createdAt: string;
  updatedAt: string;
}

interface PluginDetailProps {
  plugin: PluginDetailData;
}

const kindColors: Record<string, "indigo" | "green" | "purple"> = {
  esm: "indigo",
  mcp: "green",
  wasm: "purple",
};

export function PluginDetailView({ plugin }: PluginDetailProps) {
  return (
    <div>
      <div className="glass-card p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-2xl shrink-0">
            {plugin.icon ? (
              <img src={plugin.icon} alt="" className="w-10 h-10 rounded-lg" />
            ) : (
              <span className="text-indigo-400 font-bold">{plugin.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold text-[#e2e2ea]">{plugin.name}</h1>
              <Badge variant={kindColors[plugin.kind] || "default"}>{plugin.kind.toUpperCase()}</Badge>
              <span className="text-sm font-mono text-[#55556a]">v{plugin.version}</span>
              {plugin.license && (
                <Badge variant="default">{plugin.license}</Badge>
              )}
            </div>
            <p className="text-[#9090a8]">{plugin.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
          <StarRating rating={plugin.rating} />
          <DownloadCount count={plugin.downloads} />
          {plugin.author && (
            <span className="flex items-center gap-1 text-[#55556a]">
              <User className="w-3.5 h-3.5" />
              {plugin.authorUrl ? (
                <a href={plugin.authorUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">{plugin.author}</a>
              ) : plugin.author}
            </span>
          )}
          {plugin.category && (
            <Badge variant="default">{plugin.category}</Badge>
          )}
        </div>

        {(plugin.githubStars > 0 || plugin.githubForks > 0) && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {plugin.githubStars > 0 && (
              <span className="flex items-center gap-1 text-sm text-[#9090a8]">
                <Star className="w-4 h-4 text-yellow-400" /> {formatNumber(plugin.githubStars)} stars
              </span>
            )}
            {plugin.githubForks > 0 && (
              <span className="flex items-center gap-1 text-sm text-[#9090a8]">
                <GitFork className="w-4 h-4 text-indigo-400" /> {formatNumber(plugin.githubForks)} forks
              </span>
            )}
          </div>
        )}

        {plugin.githubTopics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {plugin.githubTopics.map((t) => (
              <Badge key={t} variant="default">{t}</Badge>
            ))}
          </div>
        )}

        <div className="mb-6">
          <p className="text-xs text-[#55556a] mb-2">Install Command</p>
          <InstallCommand type="plugin" slug={plugin.slug} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm items-center">
          {plugin.homepage && (
            <a href={plugin.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
              <Globe className="w-3.5 h-3.5" /> Website
            </a>
          )}
          {plugin.repository && (
            <a href={plugin.repository} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
              <Github className="w-3.5 h-3.5" /> Repository
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          )}
          {plugin.license && (
            <span className="text-[#55556a]">License: {plugin.license}</span>
          )}
          <span className="text-[#55556a]">Entry: {plugin.entryPoint}</span>
        </div>
      </div>

      <ScreenshotGallery screenshots={plugin.screenshots} showThumbnails />

      {plugin.capabilities.length > 0 && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#e2e2ea] mb-3">Capabilities</h2>
          <div className="flex flex-wrap gap-2">
            {plugin.capabilities.map((cap) => (
              <Badge key={cap} variant="indigo">{cap}</Badge>
            ))}
          </div>
        </div>
      )}

      {plugin.tags.length > 0 && (
        <div className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#e2e2ea] mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-400" /> Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {plugin.tags.map((tag) => (
              <Badge key={tag} variant="default">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      <ReviewSection itemId={plugin.id} type="plugin" />

      {plugin.readme && (
        <div className="glass-card p-8">
          <h2 className="text-lg font-semibold text-[#e2e2ea] mb-4">README</h2>
          <div className="prose prose-invert max-w-none prose-p:text-[#9090a8] prose-strong:text-[#e2e2ea] prose-code:text-[#e2e2ea]">
            {plugin.readme.split("\n").map((line, i) => (
              <p key={i} className="text-sm text-[#9090a8]">{line}</p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-xs text-[#55556a]">
          Published {formatDate(plugin.createdAt)} &middot; Updated {formatDate(plugin.updatedAt)}
        </p>
      </div>
    </div>
  );
}
