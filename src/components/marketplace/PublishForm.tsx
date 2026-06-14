"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/shared/Button";

interface PublishFormProps {
  type: "plugin" | "agent";
}

export function PublishForm({ type }: PublishFormProps) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState("esm");
  const [provider, setProvider] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    setLoading(true);
    setError("");

    const body: Record<string, unknown> = { name, version, description };
    if (type === "plugin") body.kind = kind;
    if (type === "agent") body.provider = provider || undefined;

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
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-[#e2e2ea] mb-2">Submission Received</h2>
        <p className="text-[#9090a8] mb-6">
          Your {type} has been submitted for review. You can track its status on your dashboard.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/dashboard" className="text-sm text-indigo-400 hover:text-indigo-300">
            View Dashboard →
          </Link>
          <Link href={`/marketplace/${type === "plugin" ? "plugins" : "agents"}`} className="text-sm text-[#55556a] hover:text-[#e2e2ea]">
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
      {error && <p className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-[#e2e2ea] mb-1">Name</label>
        <input type="text" required value={name} onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
          placeholder="My Awesome Plugin" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#e2e2ea] mb-1">Version</label>
        <input type="text" required value={version} onChange={e => setVersion(e.target.value)}
          className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
          placeholder="1.0.0" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#e2e2ea] mb-1">Description</label>
        <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
          placeholder="A brief description..." />
      </div>

      {type === "plugin" && (
        <div>
          <label className="block text-sm font-medium text-[#e2e2ea] mb-1">Kind</label>
          <select value={kind} onChange={e => setKind(e.target.value)}
            className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50">
            <option value="esm">ESM</option>
            <option value="mcp">MCP</option>
            <option value="wasm">WASM</option>
          </select>
        </div>
      )}

      {type === "agent" && (
        <div>
          <label className="block text-sm font-medium text-[#e2e2ea] mb-1">Provider</label>
          <input type="text" value={provider} onChange={e => setProvider(e.target.value)}
            className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
            placeholder="anthropic" />
        </div>
      )}

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
