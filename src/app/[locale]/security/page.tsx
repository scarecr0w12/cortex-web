import type { Metadata } from "next";
import { Shield, Lock, Eye, FileSearch, Server, Wrench, FileCode, Brain, Scan } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { generateAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "CortexPrism Security — Agent Operating System Defense Architecture | Parallax + LLM Supervisor",
  description:
    "CortexPrism's Parallax security model provides defense-in-depth for your Agent Operating System: 3-stage tool validation, LLM-based sensitive data access control, AES-256-GCM encrypted vault, DLP Guard with 22 scanners, granular policy engine, Docker-sandboxed code execution, and immutable audit logging.",
  keywords: [
    "AI agent security",
    "enterprise AI security",
    "secure AI agent operating system",
    "agent operating system security",
    "AES-256 credential vault",
    "AI tool validation",
    "sandboxed AI execution",
    "AI audit logging",
    "defense-in-depth AI",
    "AI policy engine",
    "secure LLM deployment",
    "LLM security supervisor",
    "DLP data loss prevention AI",
    "data classification AI",
  ],
  alternates: generateAlternates("/security"),
  openGraph: {
    title: "CortexPrism Security — Agent Operating System Defense Architecture | Parallax + LLM Supervisor",
    description:
      "Defense-in-depth for your Agent Operating System: 3-stage tool validation, LLM security supervisor, AES-256-GCM vault, DLP Guard with 22 scanners, policy engine, Docker-isolated sandboxes, and immutable audit trail.",
    url: "https://cortexprism.io/security",
  },
  twitter: {
    title: "CortexPrism Security — Agent Operating System Defense Architecture | Parallax + LLM Supervisor",
    description:
      "Defense-in-depth for your Agent Operating System: 3-stage validation, LLM security supervisor, AES-256-GCM vault, DLP Guard, policy engine, and Docker-isolated sandboxes.",
  },
};

export default async function SecurityPage() {
  const t = await getTranslations("securityPage");

  const layers = [
    {
      icon: Lock,
      title: t("vault.title"),
      description: t("vault.description"),
      details: [
        t("vault.detail1"),
        t("vault.detail2"),
        t("vault.detail3"),
        t("vault.detail4"),
        t("vault.detail5"),
      ],
    },
    {
      icon: Shield,
      title: t("parallax.title"),
      description: t("parallax.description"),
      details: [
        t("parallax.detail1"),
        t("parallax.detail2"),
        t("parallax.detail3"),
        t("parallax.detail4"),
        t("parallax.detail5"),
        t("parallax.detail6"),
      ],
    },
    {
      icon: FileSearch,
      title: t("policy.title"),
      description: t("policy.description"),
      details: [
        t("policy.detail1"),
        t("policy.detail2"),
        t("policy.detail3"),
        t("policy.detail4"),
        t("policy.detail5"),
      ],
    },
    {
      icon: FileCode,
      title: t("cpl.title"),
      description: t("cpl.description"),
      details: [
        t("cpl.detail1"),
        t("cpl.detail2"),
        t("cpl.detail3"),
        t("cpl.detail4"),
        t("cpl.detail5"),
      ],
    },
    {
      icon: Server,
      title: t("sandbox.title"),
      description: t("sandbox.description"),
      details: [
        t("sandbox.detail1"),
        t("sandbox.detail2"),
        t("sandbox.detail3"),
        t("sandbox.detail4"),
        t("sandbox.detail5"),
        t("sandbox.detail6"),
      ],
    },
    {
      icon: Eye,
      title: t("lens.title"),
      description: t("lens.description"),
      details: [
        t("lens.detail1"),
        t("lens.detail2"),
        t("lens.detail3"),
        t("lens.detail4"),
        t("lens.detail5"),
      ],
    },
    {
      icon: Wrench,
      title: t("approval.title"),
      description: t("approval.description"),
      details: [
        t("approval.detail1"),
        t("approval.detail2"),
        t("approval.detail3"),
        t("approval.detail4"),
        t("approval.detail5"),
      ],
    },
    {
      icon: Brain,
      title: t("llmSupervisor.title"),
      description: t("llmSupervisor.description"),
      details: [
        t("llmSupervisor.detail1"),
        t("llmSupervisor.detail2"),
        t("llmSupervisor.detail3"),
        t("llmSupervisor.detail4"),
        t("llmSupervisor.detail5"),
        t("llmSupervisor.detail6"),
      ],
    },
    {
      icon: Scan,
      title: t("dlpGuard.title"),
      description: t("dlpGuard.description"),
      details: [
        t("dlpGuard.detail1"),
        t("dlpGuard.detail2"),
        t("dlpGuard.detail3"),
        t("dlpGuard.detail4"),
        t("dlpGuard.detail5"),
        t("dlpGuard.detail6"),
      ],
    },
  ];

  const denyRules = [
    { patternKey: "blockItem1", pattern: t("blockItem1.pattern"), blocks: t("blockItem1.blocks") },
    { patternKey: "blockItem2", pattern: t("blockItem2.pattern"), blocks: t("blockItem2.blocks") },
    { patternKey: "blockItem3", pattern: t("blockItem3.pattern"), blocks: t("blockItem3.blocks") },
    { patternKey: "blockItem4", pattern: t("blockItem4.pattern"), blocks: t("blockItem4.blocks") },
  ];

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 md:py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm rounded-full bg-red-500/10 border border-red-500/20 text-red-300">
          <Shield className="w-4 h-4" />
          {t("badge")}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#e2e2ea]">
          {t("heading")}
        </h1>
        <p className="mt-4 text-lg text-[#9090a8] max-w-4xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="glass-card p-8 md:p-10 mb-12">
        <h2 className="text-xl font-bold text-[#e2e2ea] mb-4">{t("validationFlowTitle")}</h2>
        <div className="glass-card p-4 mb-4">
          <pre className="text-sm font-mono leading-relaxed">
            <code>
              <span className="text-[#55556a]">Agent emits &lt;tool_call&gt;</span>
              {"\n"}
              <span className="text-[#e2e2ea]">  → 1. checkPolicy(&apos;tool&apos;, toolName)</span>
              {"\n"}
              <span className="text-[#9090a8]">       — is this tool allowed?</span>
              {"\n"}
              <span className="text-[#e2e2ea]">  → 2. checkPolicy(&apos;shell&apos;, command)</span>
              {"\n"}
              <span className="text-[#9090a8]">       — is the shell command safe? (regex deny)</span>
              {"\n"}
              <span className="text-[#e2e2ea]">  → 3. checkPolicy(&apos;domain&apos;, hostname)</span>
              {"\n"}
              <span className="text-[#9090a8]">       — is the domain allowed? (web_search only)</span>
              {"\n"}
              <span className="text-red-400">  → DENY → error returned to agent (no execution)</span>
              {"\n"}
              <span className="text-green-400">  → ALLOW → tool.execute() runs</span>
              {"\n"}
              <span className="text-[#55556a]">  → Lens: policy_check + tool_call events logged</span>
            </code>
          </pre>
        </div>
      </div>

      <div className="space-y-8 mb-12">
        {layers.map((layer) => (
          <div key={layer.title} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                <layer.icon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-[#e2e2ea]">{layer.title}</h2>
            </div>
            <p className="text-[#9090a8] leading-relaxed mb-4">{layer.description}</p>
            <ul className="space-y-1.5">
              {layer.details.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-[#9090a8]">
                  <span className="text-red-400 mt-0.5">◆</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="glass-card p-8">
        <h2 className="text-xl font-bold text-[#e2e2ea] mb-4">{t("defaultDenyRules")}</h2>
        <p className="text-[#9090a8] mb-4">
          {t("defaultDenyDesc")}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                <th className="text-left py-2 text-[#e2e2ea] font-medium">{t("patternCol")}</th>
                <th className="text-left py-2 text-[#e2e2ea] font-medium">{t("blocksCol")}</th>
              </tr>
            </thead>
            <tbody>
              {denyRules.map((row) => (
                <tr key={row.patternKey} className="border-b border-[rgba(255,255,255,0.05)]">
                  <td className="py-2">
                    <code className="text-sm text-green-400">{row.pattern}</code>
                  </td>
                  <td className="py-2 text-[#9090a8]">{row.blocks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
