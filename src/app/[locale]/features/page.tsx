import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  MessageSquare, Wrench, Database, Shield, Code2, Route, Clock, Puzzle,
  Monitor, Bot, Share2, GitBranch, Workflow, BrainCircuit, Search, Sparkles,
  GitGraph, Mic, MonitorSmartphone, Globe, Network, Users, Link2,
  ArrowRight, CheckCircle2, Zap,
} from "lucide-react";
import { SITE_URL, generateAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "CortexPrism Features — Agent Operating System Capabilities | AI OS Features",
  description: "Explore the full Agent Operating System feature set: chat with 30 LLM providers, 5-tier memory, 60+ built-in tools, self-learning skills, code intelligence, voice pipeline, computer use, browser automation, A2A protocol, MCP & ESM plugin system, Parallax security, sandboxed code execution, multi-agent orchestration, multi-user collaboration with teams and API tokens, instance federation, UI overhaul with dark/light theme, data import from OpenClaw/Hermes, and workflow engine. All open source.",
  alternates: generateAlternates("/features"),
  openGraph: {
    title: "CortexPrism Features — Agent Operating System Capabilities | AI OS Features",
    description: "The open-source Agent Operating System: 30 LLM providers, 5-tier memory, 60+ tools, self-learning skills, code intelligence, voice pipeline, computer use, browser automation, A2A protocol, MCP & ESM plugins, Parallax security, sandboxed code execution, multi-user collaboration with teams and API tokens, instance federation, overhauled UI with dark/light theme, multi-agent orchestration.",
    url: `${SITE_URL}/features`,
  },
  twitter: {
    title: "CortexPrism Features — Agent Operating System Capabilities | AI OS Features",
    description: "The open-source Agent Operating System: 30 LLM providers, 5-tier memory, 60+ tools, self-learning skills, code intelligence, voice, computer use, browser automation, A2A protocol, sandboxed execution, multi-user collaboration, instance federation, multi-agent orchestration.",
  },
};

interface FeatureConfig {
  icon: React.ComponentType<{ className?: string }>;
  example: string;
  prefix: string;
  benefitCount: number;
  color: string;
  bg: string;
  glow: string;
  borderColor: string;
}

const COLORS = [
  { color: "text-blue-400", bg: "bg-blue-500/10", glow: "rgba(96,165,250,0.15)", borderColor: "border-blue-500/20" },
  { color: "text-emerald-400", bg: "bg-emerald-500/10", glow: "rgba(52,211,153,0.15)", borderColor: "border-emerald-500/20" },
  { color: "text-purple-400", bg: "bg-purple-500/10", glow: "rgba(167,139,250,0.15)", borderColor: "border-purple-500/20" },
  { color: "text-red-400", bg: "bg-red-500/10", glow: "rgba(248,113,113,0.15)", borderColor: "border-red-500/20" },
  { color: "text-amber-400", bg: "bg-amber-500/10", glow: "rgba(251,191,36,0.15)", borderColor: "border-amber-500/20" },
  { color: "text-indigo-400", bg: "bg-indigo-500/10", glow: "rgba(99,102,241,0.18)", borderColor: "border-indigo-500/20" },
  { color: "text-cyan-400", bg: "bg-cyan-500/10", glow: "rgba(34,211,238,0.15)", borderColor: "border-cyan-500/20" },
  { color: "text-pink-400", bg: "bg-pink-500/10", glow: "rgba(244,114,182,0.15)", borderColor: "border-pink-500/20" },
  { color: "text-orange-400", bg: "bg-orange-500/10", glow: "rgba(251,146,60,0.15)", borderColor: "border-orange-500/20" },
  { color: "text-violet-400", bg: "bg-violet-500/10", glow: "rgba(167,139,250,0.15)", borderColor: "border-violet-500/20" },
  { color: "text-teal-400", bg: "bg-teal-500/10", glow: "rgba(45,212,191,0.15)", borderColor: "border-teal-500/20" },
  { color: "text-rose-400", bg: "bg-rose-500/10", glow: "rgba(251,113,133,0.15)", borderColor: "border-rose-500/20" },
  { color: "text-lime-400", bg: "bg-lime-500/10", glow: "rgba(163,230,53,0.15)", borderColor: "border-lime-500/20" },
  { color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", glow: "rgba(232,121,249,0.15)", borderColor: "border-fuchsia-500/20" },
  { color: "text-yellow-400", bg: "bg-yellow-500/10", glow: "rgba(250,204,21,0.15)", borderColor: "border-yellow-500/20" },
  { color: "text-sky-400", bg: "bg-sky-500/10", glow: "rgba(56,189,248,0.15)", borderColor: "border-sky-500/20" },
];

const featureList: Omit<FeatureConfig, "color" | "bg" | "glow" | "borderColor">[] = [
  { icon: MessageSquare, example: "cortex agent chat -m claude-sonnet-4-5", prefix: "interactiveChat", benefitCount: 4 },
  { icon: Wrench, example: "cortex agent chat -s sess_abc123", prefix: "toolUseApproval", benefitCount: 4 },
  { icon: Database, example: 'cortex memory search "deployment config" --type semantic', prefix: "memory5Tier", benefitCount: 5 },
  { icon: Shield, example: "cortex policy add code_exec -k tool -e allow -r trusted", prefix: "parallaxSecurity", benefitCount: 4 },
  { icon: Code2, example: "cortex run analyze.py -l python --no-sandbox", prefix: "codeSandbox", benefitCount: 4 },
  { icon: Route, example: "cortex agent chat -m gpt-4o", prefix: "modelRouter", benefitCount: 4 },
  { icon: Clock, example: 'cortex daemon start && cortex jobs add weekly-report "generate-report" --cron "0 9 * * 1"', prefix: "daemonJobs", benefitCount: 4 },
  { icon: Puzzle, example: "cortex plugins install marketplace:cortexprism.io/plugins/python-executor", prefix: "pluginSystem", benefitCount: 5 },
  { icon: Monitor, example: "cortex server start --port 8080", prefix: "webUi", benefitCount: 4 },
  { icon: Bot, example: 'cortex agent create code-reviewer -m claude-sonnet-4-5 -d "Reviews pull requests" --tools file_read,web_search,shell', prefix: "agentManager", benefitCount: 5 },
  { icon: Share2, example: "cortex service create api-server -a code-reviewer -p 3001 --auto-start", prefix: "microServices", benefitCount: 4 },
  { icon: GitBranch, example: 'cortex git commit "fix: resolve type error in auth module"', prefix: "gitWorkspace", benefitCount: 4 },
  { icon: BrainCircuit, example: "cortex qm dashboard -s sess_abc123", prefix: "modelQuartermaster", benefitCount: 4 },
  { icon: Workflow, example: "cortex workflow run my-workflow", prefix: "workflowEngine", benefitCount: 4 },
  { icon: Search, example: "cortex server start && open http://127.0.0.1:3000", prefix: "cortexLens", benefitCount: 4 },
  { icon: Sparkles, example: "cortex server start && open http://127.0.0.1:3000/skills", prefix: "skillsSystem", benefitCount: 4 },
  { icon: GitGraph, example: "cortex server start && open http://127.0.0.1:3000/codegraph", prefix: "codeIntelligence", benefitCount: 4 },
  { icon: Mic, example: "cortex voice enable", prefix: "voicePipeline", benefitCount: 4 },
  { icon: MonitorSmartphone, example: "cortex desktop screenshot", prefix: "computerUse", benefitCount: 4 },
  { icon: Globe, example: 'cortex agent chat -m claude-sonnet-4-5', prefix: "browserAutomation", benefitCount: 4 },
  { icon: Users, example: "cortex login --username admin && cortex users create alice --team devs", prefix: "multiUser", benefitCount: 5 },
  { icon: Link2, example: "cortex federation generate-pairing-token && cortex federation pair", prefix: "instanceFederation", benefitCount: 5 },
  { icon: Network, example: "cortex server start && open http://127.0.0.1:3000/a2a", prefix: "a2aProtocol", benefitCount: 4 },
];

function TerminalBlock({ commands }: { commands: { label: string; cmd: string }[] }) {
  return (
    <div className="glass-card p-1">
      <div className="bg-[#0a0a0f] rounded-lg p-4 border border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-[#55556a] font-mono">terminal</span>
        </div>
        <div className="space-y-3">
          {commands.map((c) => (
            <div key={c.cmd}>
              <div className="text-[10px] uppercase tracking-wider text-[#55556a] mb-1 font-mono">{c.label}</div>
              <pre className="text-sm font-mono">
                <code>
                  <span className="text-[#55556a]">$ </span>
                  <span className="text-green-400">cortex</span>
                  <span className="text-[#e2e2ea]"> {c.cmd.startsWith("cortex ") ? c.cmd.slice(7) : c.cmd}</span>
                </code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function FeaturesPage() {
  const t = await getTranslations("featuresDetail");
  const features = featureList.map((f, i) => ({
    ...f,
    ...COLORS[i % COLORS.length],
  }));

  const sectionIds = features.map((f) => f.prefix);

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 md:py-20">
      {/* Hero */}
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
          Features
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#e2e2ea] leading-tight">
          {t("heading")}{" "}
          <span className="gradient-text">at a glance</span>
        </h1>
        <p className="mt-5 text-lg text-[#9090a8] max-w-3xl mx-auto leading-relaxed">
          Everything you need to build, deploy, and manage AI agent applications — all in one open-source Agent Operating System.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { value: "23", label: "Core Features" },
          { value: "60+", label: "Built-in Tools" },
          { value: "30+", label: "LLM Providers" },
          { value: "5", label: "Memory Tiers" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{stat.value}</div>
            <div className="text-xs text-[#55556a] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards Grid */}
      <div className="mb-16">
        <h2 className="text-lg font-semibold text-[#e2e2ea] mb-5 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          Explore every capability
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, i) => (
            <a
              key={feat.prefix}
              href={`#${sectionIds[i]}`}
              className="group relative bg-[#111118] border border-[rgba(255,255,255,0.07)] rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-[rgba(255,255,255,0.14)] hover:bg-[#14141c] no-underline"
            >
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style={{ background: `radial-gradient(circle at 30% 30%, ${feat.glow} 0%, transparent 70%)` }}
              />
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${feat.bg} mb-3 transition-transform duration-200 group-hover:scale-110 relative`}>
                <feat.icon className={`w-5 h-5 ${feat.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-[#e2e2ea] mb-1 relative">{t(`${feat.prefix}Title`)}</h3>
              <p className="text-xs text-[#9090a8] leading-relaxed relative line-clamp-2">{t(`${feat.prefix}Sub`)}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Detailed Sections */}
      <div>
        {features.map((feat, i) => (
          <section
            key={feat.prefix}
            id={sectionIds[i]}
            className={`py-16 ${i > 0 ? "border-t border-[rgba(255,255,255,0.06)]" : ""}`}
          >
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div className={i % 2 === 0 ? "md:order-1" : "md:order-2"}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feat.bg} transition-transform duration-200`}
                    style={{ boxShadow: `0 0 20px ${feat.glow}` }}
                  >
                    <feat.icon className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#e2e2ea]">{t(`${feat.prefix}Title`)}</h2>
                    <p className={`text-sm ${feat.color} font-medium`}>{t(`${feat.prefix}Sub`)}</p>
                  </div>
                </div>
                <p className="text-[#9090a8] leading-relaxed mb-6">{t(`${feat.prefix}Desc`)}</p>
                <div className={`glass-card p-4 mb-5 border-l-2 ${feat.borderColor}`}>
                  <p className="text-xs uppercase tracking-wider text-[#55556a] mb-1 font-semibold">Key Capabilities</p>
                  <ul className="space-y-1.5">
                    {Array.from({ length: feat.benefitCount }, (_, j) => {
                      const key = `${feat.prefix}B${j + 1}`;
                      return (
                        <li key={key} className="flex items-start gap-2 text-sm text-[#c4c4d4]">
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${feat.color}`} />
                          <span>{t(key)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className={i % 2 === 0 ? "md:order-2" : "md:order-1"}>
                <div className="sticky top-24">
                  <h3 className="text-xs uppercase tracking-widest text-[#55556a] mb-3 font-semibold">Try it</h3>
                  <TerminalBlock commands={[{ label: t(`${feat.prefix}Title`), cmd: feat.example }]} />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16">
        <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#e2e2ea] relative">
            Ready to explore the Agent Operating System?
          </h2>
          <p className="mt-3 text-[#9090a8] max-w-lg mx-auto relative">
            Install CortexPrism in one command and access all 23 features. Fully open source. Apache 2.0.
          </p>
          <div className="mt-6 max-w-xl mx-auto relative">
            <div className="glass-card p-1">
              <div className="bg-[#0a0a0f] rounded-lg p-3.5 border border-[rgba(255,255,255,0.05)]">
                <pre className="text-sm font-mono overflow-x-auto">
                  <code>
                    <span className="text-[#55556a]">$ </span>
                    <span className="text-green-400">curl -fsSL https://cortexprism.io/install.sh</span>
                    <span className="text-[#e2e2ea]"> | bash</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 relative">
            <Link href="/getting-started" className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg accent-gradient text-white hover:opacity-90 transition-opacity">
              Getting Started Guide
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/use-cases" className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg border border-[rgba(255,255,255,0.15)] text-[#e2e2ea] hover:bg-[#111118] transition-colors">
              Explore Use Cases
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
