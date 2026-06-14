"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { PluginCard } from "@/components/marketplace/PluginCard";
import { Pagination } from "@/components/shared/Pagination";

interface Category { id: string; name: string; slug: string }

interface Plugin {
  id: string; name: string; slug: string; version: string;
  description: string; kind: string; author: string | null;
  icon: string | null; downloads: number; rating: number;
  category: string | null; createdAt: string;
}

interface PluginResponse {
  plugins: Plugin[]; total: number; page: number; limit: number; totalPages: number;
}

export default function PluginListingPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedKind, setSelectedKind] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PluginResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1) }, [debouncedSearch, selectedCategory, selectedKind]);

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
    if (selectedKind) params.set("kind", selectedKind);
    params.set("page", String(page));
    params.set("limit", "12");

    fetch(`/api/marketplace/plugins?${params}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false));
  }, [debouncedSearch, selectedCategory, selectedKind, page]);

  const kinds = ["esm", "mcp", "wasm"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e2e2ea] mb-2">Plugins</h1>
        <p className="text-[#9090a8]">Extend CortexPrism with powerful plugins.</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#55556a]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search plugins by name..."
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

          <span className="w-px h-6 bg-[rgba(255,255,255,0.07)] mx-2" />

          <span className="text-xs text-[#55556a] font-medium mr-1">Kind:</span>
          {kinds.map(k => (
            <button
              key={k}
              onClick={() => { setSelectedKind(selectedKind === k ? "" : k); setPage(1) }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors border ${
                selectedKind === k
                  ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                  : "bg-[#111118] text-[#9090a8] border-[rgba(255,255,255,0.07)] hover:text-[#e2e2ea]"
              }`}
            >
              {k.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {data && !loading && (
        <p className="text-sm text-[#55556a] mb-4">
          Showing {data.plugins.length} of {data.total} plugin{data.total !== 1 ? "s" : ""}
          {selectedCategory && categories.find(c => c.slug === selectedCategory) && (
            <> in <span className="text-[#9090a8]">{categories.find(c => c.slug === selectedCategory)!.name}</span></>
          )}
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
              <div className="flex justify-between">
                <div className="h-3 bg-[#18181f] rounded w-16" />
                <div className="h-3 bg-[#18181f] rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.plugins.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.plugins.map(plugin => (
              <PluginCard key={plugin.id} plugin={plugin} />
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-4xl mb-4 opacity-30">🔌</div>
          <p className="text-lg text-[#9090a8] mb-1">No plugins found</p>
          <p className="text-sm text-[#55556a]">
            {search || selectedCategory || selectedKind
              ? "Try adjusting your search or filters"
              : "No plugins are published yet. Check back later."}
          </p>
          {(search || selectedCategory || selectedKind) && (
            <button
              onClick={() => { setSearch(""); setSelectedCategory(""); setSelectedKind(""); setPage(1) }}
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
