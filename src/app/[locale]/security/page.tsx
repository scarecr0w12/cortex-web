import type { Metadata } from "next";
import { Shield, Lock, Eye, FileSearch, Server, Wrench, FileCode, Brain, Scan, ArrowRight, CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { SITE_URL, generateAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "CortexPrism Security — Agent Operating System Defense Architecture | Parallax + LLM Supervisor",
  description:
    "CortexPrism's Parallax security model provides defense-in-depth for your Agent Operating System: 3-stage tool validation, LLM-based sensitive data access control, AES-256-GCM encrypted vault, DLP Guard with 22 scanners, granular policy engine, Docker-sandboxed code execution, and immutable audit logging.",
  keywords: [
    "AI agent security", "enterprise AI security", "secure AI agent operating system",
    "agent operating system security", "AES-256 credential vault", "AI tool validation",
    "sandboxed AI execution", "AI audit logging", "defense-in-depth AI", "AI policy engine",
    "secure LLM deployment", "LLM security supervisor", "DLP data loss prevention AI", "data classification AI",
  ],
  alternates: generateAlternates("/security"),
  openGraph: {
    title: "CortexPrism Security — Agent Operating System Defense Architecture | Parallax + LLM Supervisor",
    description: "Defense-in-depth for your Agent Operating System: 3-stage tool validation, LLM security supervisor, AES-256-GCM vault, DLP Guard with 22 scanners, policy engine, Docker-isolated sandboxes, and immutable audit trail.",
    url: `${SITE_URL}/security`,
  },
  twitter: {
    title: "CortexPrism Security — Agent Operating System Defense Architecture | Parallax + LLM Supervisor",
    description: "Defense-in-depth for your Agent Operating System: 3-stage validation, LLM security supervisor, AES-256-GCM vault, DLP Guard, policy engine, and Docker-isolated sandboxes.",
  },
};

interface LayerConfig {
  icon: React.ComponentType<{ className?: string }>;
  key: string;
  detailCount: number;
  color: string;
  bg: string;
  glow: string;
  borderColor: string;
}

const COLORS = [
  { color: "text-red-400", bg: "bg-red-500/10", glow: "rgba(248,113,113,0.15)", borderColor: "border-red-500/20" },
  { color: "text-amber-400", bg: "bg-amber-500/10", glow: "rgba(251,191,36,0.15)", borderColor: "border-amber-500/20" },
  { color: "text-indigo-400", bg: "bg-indigo-500/10", glow: "rgba(99,102,241,0.18)", borderColor: "border-indigo-500/20" },
  { color: "text-purple-400", bg: "bg-purple-500/10", glow: "rgba(167,139,250,0.15)", borderColor: "border-purple-500/20" },
  { color: "text-emerald-400", bg: "bg-emerald-500/10", glow: "rgba(52,211,153,0.15)", borderColor: "border-emerald-500/20" },
  { color: "text-cyan-400", bg: "bg-cyan-500/10", glow: "rgba(34,211,238,0.15)", borderColor: "border-cyan-500/20" },
  { color: "text-pink-400", bg: "bg-pink-500/10", glow: "rgba(244,114,182,0.15)", borderColor: "border-pink-500/20" },
  { color: "text-violet-400", bg: "bg-violet-500/10", glow: "rgba(167,139,250,0.15)", borderColor: "border-violet-500/20" },
  { color: "text-rose-400", bg: "bg-rose-500/10", glow: "rgba(251,113,133,0.15)", borderColor: "border-rose-500/20" },
];

const LAYER_KEYS = ["vault", "parallax", "policy", "cpl", "sandbox", "lens", "approval", "llmSupervisor", "dlpGuard"] as const;
const LAYER_ICONS = [Lock, Shield, FileSearch, FileCode, Server, Eye, Wrench, Brain, Scan];
const LAYER_DETAIL_COUNTS = [5, 6, 5, 5, 6, 5, 5, 6, 6];
const SECTION_IDS = ["vault", "parallax", "policy", "cpl", "sandbox", "lens", "approval", "llmSupervisor", "dlpGuard"];

export default async function SecurityPage() {
  const t = await getTranslations("securityPage");

  const layers: LayerConfig[] = LAYER_KEYS.map((key, i) => ({
    icon: LAYER_ICONS[i],
    key,
    detailCount: LAYER_DETAIL_COUNTS[i],
    ...COLORS[i],
  }));

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 md:py-20">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm rounded-full bg-red-500/10 border border-red-500/20 text-red-300">
          <Shield className="w-4 h-4" />
          {t("badge")}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#e2e2ea] leading-tight">
          {t("heading")}
        </h1>
        <p className="mt-5 text-lg text-[#9090a8] max-w-3xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { value: "9", label: "Security Layers" },
          { value: "3-stage", label: "Tool Validation" },
          { value: "22", label: "DLP Scanners" },
          { value: "AES-256-GCM", label: "Vault Encryption" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{stat.value}</div>
            <div className="text-xs text-[#55556a] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Security Layer Cards Grid */}
      <div className="mb-16">
        <h2 className="text-lg font-semibold text-[#e2e2ea] mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          Defense layers
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {layers.map((layer, i) => (
            <a
              key={layer.key}
              href={`#${SECTION_IDS[i]}`}
              className="group relative bg-[#111118] border border-[rgba(255,255,255,0.07)] rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-[rgba(255,255,255,0.14)] hover:bg-[#14141c] no-underline"
            >
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style={{ background: `radial-gradient(circle at 30% 30%, ${layer.glow} 0%, transparent 70%)` }}
              />
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${layer.bg} mb-3 transition-transform duration-200 group-hover:scale-110 relative`}>
                <layer.icon className={`w-5 h-5 ${layer.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-[#e2e2ea] mb-1 relative">{t(`${layer.key}Title`)}</h3>
              <p className="text-xs text-[#9090a8] leading-relaxed relative line-clamp-2">{t(`${layer.key}Description`)}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Validation Flow */}
      <div className="glass-card p-8 md:p-10 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10" style={{ boxShadow: "0 0 20px rgba(251,191,36,0.15)" }}>
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#e2e2ea]">{t("validationFlowTitle")}</h2>
            <p className="text-sm text-amber-400 font-medium">Request → Validate → Execute → Audit</p>
          </div>
        </div>
        <div className="glass-card p-5">
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

      {/* Detailed Security Layers */}
      <div className="mb-16">
        {layers.map((layer, i) => (
          <section
            key={layer.key}
            id={SECTION_IDS[i]}
            className={`py-16 ${i > 0 ? "border-t border-[rgba(255,255,255,0.06)]" : ""}`}
          >
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div className={i % 2 === 0 ? "md:order-1" : "md:order-2"}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${layer.bg} transition-transform duration-200`}
                    style={{ boxShadow: `0 0 20px ${layer.glow}` }}
                  >
                    <layer.icon className={`w-6 h-6 ${layer.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#e2e2ea]">{t(`${layer.key}Title`)}</h2>
                    <p className={`text-sm ${layer.color} font-medium`}>{t(`${layer.key}Title`)}</p>
                  </div>
                </div>
                <p className="text-[#9090a8] leading-relaxed mb-5">{t(`${layer.key}Description`)}</p>
                <div className={`glass-card p-4 border-l-2 ${layer.borderColor}`}>
                  <ul className="space-y-1.5">
                    {Array.from({ length: layer.detailCount }, (_, j) => {
                      const key = `${layer.key}Detail${j + 1}`;
                      return (
                        <li key={key} className="flex items-start gap-2 text-sm text-[#c4c4d4]">
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${layer.color}`} />
                          <span>{t(key)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className={i % 2 === 0 ? "md:order-2" : "md:order-1"}>
                <div className="sticky top-24">
                  <div className="glass-card p-1">
                    <div className="bg-[#0a0a0f] rounded-lg p-5 border border-[rgba(255,255,255,0.05)]">
                      <p className="text-sm text-[#9090a8] leading-relaxed">
                        {t(`${layer.key}Description`)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Default Deny Rules */}
      <div className="glass-card p-8 md:p-10 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10" style={{ boxShadow: "0 0 20px rgba(248,113,113,0.15)" }}>
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#e2e2ea]">{t("defaultDenyRules")}</h2>
            <p className="text-sm text-red-400 font-medium">Pre-configured on first migration</p>
          </div>
        </div>
        <p className="text-[#9090a8] mb-5">{t("defaultDenyDesc")}</p>
        <div className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.07)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0f0f15]">
                <th className="text-left py-3 px-4 text-[#e2e2ea] font-medium">{t("patternCol")}</th>
                <th className="text-left py-3 px-4 text-[#e2e2ea] font-medium">{t("blocksCol")}</th>
              </tr>
            </thead>
            <tbody>
              {["blockItem1", "blockItem2", "blockItem3", "blockItem4"].map((item) => (
                <tr key={item} className="border-t border-[rgba(255,255,255,0.05)] hover:bg-[#111118] transition-colors">
                  <td className="py-3 px-4">
                    <code className="text-sm text-green-400">{t(`${item}Pattern`)}</code>
                  </td>
                  <td className="py-3 px-4 text-[#9090a8]">{t(`${item}Blocks`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16">
        <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#e2e2ea] relative">
            Deploy secure agents with confidence
          </h2>
          <p className="mt-3 text-[#9090a8] max-w-lg mx-auto relative">
            Every layer is included by default — no extra configuration needed. Start building with enterprise-grade security from day one.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 relative">
            <Link href="/getting-started" className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg accent-gradient text-white hover:opacity-90 transition-opacity">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/features" className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg border border-[rgba(255,255,255,0.15)] text-[#e2e2ea] hover:bg-[#111118] transition-colors">
              Explore All Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
