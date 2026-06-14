"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { AgentCard } from "@/components/marketplace/AgentCard";
import { Pagination } from "@/components/shared/Pagination";

interface Category { id: string; name: string; slug: string }

interface Agent {
  id: string; name: string; slug: string; version: string;
  description: string; provider: string | null; model: string | null;
  author: string | null; icon: string | null; downloads: number;
  rating: number; tags: string[]; category: string | null; createdAt: string;
}

interface AgentResponse {
  agents: Agent[]; total: number; page: number; limit: number; totalPages: number;
}

export default function AgentListingPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AgentResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1) }, [debouncedSearch, selectedCategory, selectedProvider]);

  useEffect(() => {
    if (!categories.length) {
      fetch("/api/marketplace/categories").then(r => r.json()).then(setCategories);
    }
  }, [categories.length]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedProvider) params.set("provider", selectedProvider);
    params.set("page", String(page));
    params.set("limit", "12");

    fetch(`/api/marketplace/agents?${params}`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        const allProviders = new Set<string>();
        d.agents.forEach((a: Agent) => { if (a.provider) allProviders.add(a.provider) });
        setProviders(prev => prev.length ? prev : Array.from(allProviders));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [debouncedSearch, selectedCategory, selectedProvider, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e2e2ea] mb-2">Agents</h1>
        <p className="text-[#9090a8]">Pre-configured agent configurations for various tasks and domains.</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#55556a]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search agents by name..."
            className="w-full pl-10 pr-10 py-3 bg-[#111118] border border-[rgba(255,255,255,0.07)] rounded-xl text-sm text-[#e2e2ea] placeholder:text-[#55556a] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-[#e2e2ea]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#55556a] font-medium mr-1">Category:</span>
          <button
            onClick={() => { setSelectedCategory(""); setPage(1) }}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors border ${
              !selectedCategory
                ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                : "bg-[#111118] text-[#9090a8] border-[rgba(255,255,255,0.07)] hover:text-[#e2e2ea]"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.slug); setPage(1) }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors border ${
                selectedCategory === cat.slug
                  ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                  : "bg-[#111118] text-[#9090a8] border-[rgba(255,255,255,0.07)] hover:text-[#e2e2ea]"
              }`}
            >
              {cat.name}
            </button>
          ))}

          {providers.length > 0 && (
            <>
              <span className="w-px h-6 bg-[rgba(255,255,255,0.07)] mx-2" />
              <span className="text-xs text-[#55556a] font-medium mr-1">Provider:</span>
              {providers.map(p => (
                <button
                  key={p}
                  onClick={() => { setSelectedProvider(selectedProvider === p ? "" : p); setPage(1) }}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors border ${
                    selectedProvider === p
                      ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                      : "bg-[#111118] text-[#9090a8] border-[rgba(255,255,255,0.07)] hover:text-[#e2e2ea]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {data && !loading && (
        <p className="text-sm text-[#55556a] mb-4">
          Showing {data.agents.length} of {data.total} agent{data.total !== 1 ? "s" : ""}
          {selectedProvider && <> from <span className="text-[#9090a8]">{selectedProvider}</span></>}
        </p>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-[#18181f] mb-3" />
              <div className="h-4 bg-[#18181f] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[#18181f] rounded w-full mb-1" />
              <div className="h-3 bg-[#18181f] rounded w-2/3 mb-4" />
              <div className="flex gap-1 mb-3">
                <div className="h-5 bg-[#18181f] rounded-full w-14" />
                <div className="h-5 bg-[#18181f] rounded-full w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.agents.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-4xl mb-4 opacity-30">🤖</div>
          <p className="text-lg text-[#9090a8] mb-1">No agents found</p>
          <p className="text-sm text-[#55556a]">
            {search || selectedCategory || selectedProvider
              ? "Try adjusting your search or filters"
              : "No agents are published yet. Check back later."}
          </p>
          {(search || selectedCategory || selectedProvider) && (
            <button
              onClick={() => { setSearch(""); setSelectedCategory(""); setSelectedProvider(""); setPage(1) }}
              className="mt-4 px-4 py-2 text-sm rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
