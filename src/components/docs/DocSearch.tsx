"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { SearchInput } from "@/components/shared/SearchInput";

interface DocPage {
  title: string;
  href: string;
  section: string;
  content: string;
}

const docs: DocPage[] = [
  { title: "Quickstart Overview", href: "/getting-started", section: "Getting Started", content: "Quickstart overview installation first run configuration setup" },
  { title: "Installation", href: "/getting-started/installation", section: "Getting Started", content: "Installation prerequisites dependencies setup deno" },
  { title: "First Run", href: "/getting-started/first-run", section: "Getting Started", content: "First run setup wizard configuration provider setup" },
  { title: "Configuration", href: "/getting-started/configuration", section: "Getting Started", content: "Configuration config file environment variables data directory" },
  { title: "CLI Overview", href: "/docs/cli", section: "CLI Reference", content: "CLI command reference overview" },
  { title: "Architecture Overview", href: "/docs/architecture", section: "Architecture", content: "System architecture overview design" },
  { title: "Knowledge Base", href: "/docs/knowledge-base", section: "Knowledge Base", content: "FAQ troubleshooting best practices guides" },
];

export function DocSearch() {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: ["title", "content", "section"],
        threshold: 0.4,
      }),
    []
  );

  const results = query ? fuse.search(query).map((r) => r.item) : [];

  return (
    <div className="relative">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search docs..."
      />
      {query && (
        <div className="absolute top-full mt-2 w-full glass-card p-2 max-h-80 overflow-y-auto z-50">
          {results.length > 0 ? (
            results.map((result) => (
              <Link
                key={result.href}
                href={result.href}
                className="block px-3 py-2 rounded-lg hover:bg-[#18181f] transition-colors"
                onClick={() => setQuery("")}
              >
                <div className="text-sm font-medium text-[#e2e2ea]">{result.title}</div>
                <div className="text-xs text-[#55556a]">{result.section}</div>
              </Link>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-[#55556a]">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
