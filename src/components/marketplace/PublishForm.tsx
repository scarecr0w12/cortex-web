"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";

interface PublishFormProps {
  type: "plugin" | "agent";
}

export function PublishForm({ type }: PublishFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-[#e2e2ea] mb-2">Submission Received</h2>
        <p className="text-[#9090a8]">
          Thank you for your submission. Since the marketplace is in early preview, submissions are reviewed manually.
          Please open a GitHub issue to track your submission.
        </p>
        <a
          href="https://github.com/scarecr0w12/cortex/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-sm text-indigo-400 hover:text-indigo-300"
        >
          Open a GitHub Issue →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#e2e2ea] mb-1">Name</label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
          placeholder="My Awesome Plugin"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#e2e2ea] mb-1">Version</label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
          placeholder="1.0.0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#e2e2ea] mb-1">Description</label>
        <textarea
          required
          rows={3}
          className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
          placeholder="A brief description of your plugin..."
        />
      </div>

      {type === "plugin" && (
        <div>
          <label className="block text-sm font-medium text-[#e2e2ea] mb-1">Kind</label>
          <select className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50">
            <option value="esm">ESM</option>
            <option value="mcp">MCP</option>
            <option value="wasm">WASM</option>
          </select>
        </div>
      )}

      {type === "agent" && (
        <div>
          <label className="block text-sm font-medium text-[#e2e2ea] mb-1">Provider</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50"
            placeholder="anthropic"
          />
        </div>
      )}

      <div className="pt-4 border-t border-[rgba(255,255,255,0.07)]">
        <p className="text-xs text-[#55556a] mb-4">
          Note: The marketplace is currently in preview. Submissions are reviewed manually.
          Your entry will not be published automatically.
        </p>
        <Button type="submit" variant="primary">Submit for Review</Button>
      </div>
    </form>
  );
}
