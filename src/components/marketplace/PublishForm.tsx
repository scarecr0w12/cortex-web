"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/shared/Button";

interface PublishFormProps {
  type: "plugin" | "agent";
}

interface Category {
  id: string; name: string; slug: string;
}

export function PublishForm({ type }: PublishFormProps) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState("esm");
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [temperature, setTemperature] = useState("0.7");
  const [author, setAuthor] = useState("");
  const [authorUrl, setAuthorUrl] = useState("");
  const [homepage, setHomepage] = useState("");
  const [repository, setRepository] = useState("");
  const [license, setLicense] = useState("");
  const [icon, setIcon] = useState("");
  const [readme, setReadme] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [capabilitiesStr, setCapabilitiesStr] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [toolsStr, setToolsStr] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    fetch("/api/marketplace/categories")
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    setLoading(true);
    setError("");

    const body: Record<string, unknown> = {
      name, version, description,
      author: author || undefined,
      authorUrl: authorUrl || undefined,
      homepage: homepage || undefined,
      repository: repository || undefined,
      license: license || undefined,
      icon: icon || undefined,
      readme: readme || undefined,
      categoryId: categoryId || undefined,
    };

    if (type === "plugin") {
      body.kind = kind;
      body.capabilities = capabilitiesStr ? capabilitiesStr.split(",").map(s => s.trim()).filter(Boolean) : undefined;
      body.tags = tagsStr ? tagsStr.split(",").map(s => s.trim()).filter(Boolean) : undefined;
    }

    if (type === "agent") {
      body.provider = provider || undefined;
      body.model = model || undefined;
      body.temperature = temperature ? parseFloat(temperature) : undefined;
      body.tags = tagsStr ? tagsStr.split(",").map(s => s.trim()).filter(Boolean) : undefined;
      body.tools = toolsStr ? toolsStr.split(",").map(s => s.trim()).filter(Boolean) : undefined;
      body.systemPrompt = systemPrompt || undefined;
    }

    try {
      const res = await fetch(`/api/marketplace/${type === "plugin" ? "plugins" : "agents"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(typeof data.error === "string" ? data.error : "Submission failed");
      }
    } catch {
      setError("Connection error");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-4xl mb-4">&#127881;</div>
        <h2 className="text-xl font-bold text-[#e2e2ea] mb-2">Submission Received</h2>
        <p className="text-[#9090a8] mb-6">
          Your {type} has been submitted for review. You can track its status on your dashboard.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/dashboard" className="text-sm text-indigo-400 hover:text-indigo-300">
            View Dashboard &rarr;
          </Link>
          <Link href={`/marketplace/${type === "plugin" ? "plugins" : "agents"}`} className="text-sm text-[#55556a] hover:text-[#e2e2ea]">
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50";
  const labelClass = "block text-sm font-medium text-[#e2e2ea] mb-1";
  const sectionClass = "space-y-4";

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
      {error && <p className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3">{error}</p>}

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Basic Information</h3>
        <div>
          <label className={labelClass}>Name *</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)}
            className={inputClass} placeholder="My Awesome Plugin" />
        </div>
        <div>
          <label className={labelClass}>Version *</label>
          <input type="text" required value={version} onChange={e => setVersion(e.target.value)}
            className={inputClass} placeholder="1.0.0" />
        </div>
        <div>
          <label className={labelClass}>Description *</label>
          <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)}
            className={inputClass} placeholder="A brief description of your submission..." />
        </div>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.07)]" />

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
          {type === "plugin" ? "Plugin Details" : "Agent Configuration"}
        </h3>

        {type === "plugin" && (
          <>
            <div>
              <label className={labelClass}>Kind *</label>
              <select value={kind} onChange={e => setKind(e.target.value)} className={inputClass}>
                <option value="esm">ESM</option>
                <option value="mcp">MCP</option>
                <option value="wasm">WASM</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Capabilities (comma-separated)</label>
              <input type="text" value={capabilitiesStr} onChange={e => setCapabilitiesStr(e.target.value)}
                className={inputClass} placeholder="python:execute, python:install, python:list-packages" />
              <p className="text-xs text-[#55556a] mt-1">List the capability identifiers your plugin provides</p>
            </div>
          </>
        )}

        {type === "agent" && (
          <>
            <div>
              <label className={labelClass}>Provider</label>
              <input type="text" value={provider} onChange={e => setProvider(e.target.value)}
                className={inputClass} placeholder="anthropic" />
            </div>
            <div>
              <label className={labelClass}>Model</label>
              <input type="text" value={model} onChange={e => setModel(e.target.value)}
                className={inputClass} placeholder="claude-sonnet-4-5" />
            </div>
            <div>
              <label className={labelClass}>Temperature</label>
              <input type="number" step="0.1" min="0" max="2" value={temperature} onChange={e => setTemperature(e.target.value)}
                className={inputClass} placeholder="0.7" />
            </div>
            <div>
              <label className={labelClass}>Tools (comma-separated)</label>
              <input type="text" value={toolsStr} onChange={e => setToolsStr(e.target.value)}
                className={inputClass} placeholder="codebase_search, read, grep, glob" />
            </div>
            <div>
              <label className={labelClass}>System Prompt</label>
              <textarea rows={4} value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
                className={inputClass + " font-mono text-xs"} placeholder="You are an expert agent that..." />
            </div>
          </>
        )}

        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input type="text" value={tagsStr} onChange={e => setTagsStr(e.target.value)}
            className={inputClass} placeholder="code-review, development, security" />
        </div>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.07)]" />

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Author & Links</h3>
        <div>
          <label className={labelClass}>Author Name</label>
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
            className={inputClass} placeholder="Your name or organization" />
        </div>
        <div>
          <label className={labelClass}>Author URL</label>
          <input type="url" value={authorUrl} onChange={e => setAuthorUrl(e.target.value)}
            className={inputClass} placeholder="https://github.com/your-profile" />
        </div>
        <div>
          <label className={labelClass}>Repository URL</label>
          <input type="url" value={repository} onChange={e => setRepository(e.target.value)}
            className={inputClass} placeholder="https://github.com/owner/repo" />
          <p className="text-xs text-[#55556a] mt-1">GitHub repository for auto-fetching stars, topics, and license info</p>
        </div>
        <div>
          <label className={labelClass}>Homepage</label>
          <input type="url" value={homepage} onChange={e => setHomepage(e.target.value)}
            className={inputClass} placeholder="https://example.com" />
        </div>
        <div>
          <label className={labelClass}>License</label>
          <input type="text" value={license} onChange={e => setLicense(e.target.value)}
            className={inputClass} placeholder="MIT, Apache-2.0, GPL-3.0" />
        </div>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.07)]" />

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Media</h3>
        <div>
          <label className={labelClass}>Icon URL</label>
          <input type="url" value={icon} onChange={e => setIcon(e.target.value)}
            className={inputClass} placeholder="https://example.com/icon.png" />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass}>
            <option value="">No category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>README / Documentation</label>
          <textarea rows={6} value={readme} onChange={e => setReadme(e.target.value)}
            className={`${inputClass} font-mono text-xs`} placeholder="Detailed documentation in markdown format..." />
          <p className="text-xs text-[#55556a] mt-1">Supports Markdown formatting</p>
        </div>
      </div>

      <div className="pt-4 border-t border-[rgba(255,255,255,0.07)]">
        <p className="text-xs text-[#55556a] mb-4">
          Submissions are reviewed by admins before being published. Track your submission status on the dashboard.
        </p>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit for Review"}
        </Button>
      </div>
    </form>
  );
}
