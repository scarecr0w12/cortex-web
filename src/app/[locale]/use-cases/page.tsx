import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight, Bot, Beaker, TestTube, GitBranch, Search, Shield, Mic, Monitor, Code2, Terminal, CheckCircle2,
} from "lucide-react";
import { generateAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("useCases");
  return {
    title: `Agent Operating System Use Cases — Voice Agents, Dev Assistants, Automation & Enterprise AI`,
    description: t("subtitle"),
    alternates: generateAlternates("/use-cases"),
    openGraph: {
      title: `Agent Operating System Use Cases — Voice Agents, Dev Assistants, Automation & Enterprise AI`,
      description: t("subtitle"),
      url: "https://cortexprism.io/use-cases",
    },
    twitter: {
      title: `Agent Operating System Use Cases — Voice Agents, Dev Assistants, Automation & Enterprise AI`,
      description: t("subtitle"),
    },
  };
}

interface UseCaseConfig {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  glow: string;
  borderColor: string;
  titleKey: string;
  subKey: string;
  descKey: string;
  audienceKey: string;
  highlightKeys: string[];
  commands: { label: string; cmd: string }[];
}

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

const USE_CASE_CONFIGS: Omit<UseCaseConfig, "titleKey" | "subKey" | "descKey" | "audienceKey" | "highlightKeys">[] = [
  { icon: Bot, color: "text-blue-400", bg: "bg-blue-500/10", glow: "rgba(96,165,250,0.15)", borderColor: "border-blue-500/20", commands: [{ label: "Start a chat session", cmd: "cortex agent chat --model claude-sonnet-4-5" }, { label: "Resume a session", cmd: "cortex agent chat -s sess_abc123" }, { label: "Add to memory", cmd: "cortex memory add 'Project uses PostgreSQL with Prisma ORM'" }] },
  { icon: Beaker, color: "text-purple-400", bg: "bg-purple-500/10", glow: "rgba(167,139,250,0.15)", borderColor: "border-purple-500/20", commands: [{ label: "Store research findings", cmd: "cortex memory add 'Market size: $5B, CAGR 12%'" }, { label: "Search your knowledge base", cmd: "cortex memory search 'competitive landscape'" }, { label: "Run analysis in sandbox", cmd: "cortex run analyze_market.py -l python" }] },
  { icon: TestTube, color: "text-emerald-400", bg: "bg-emerald-500/10", glow: "rgba(52,211,153,0.15)", borderColor: "border-emerald-500/20", commands: [{ label: "Debug a script", cmd: "cortex run script.py --fix" }, { label: "Generate a commit message", cmd: "cortex git commit --auto" }, { label: "Analyze code impact", cmd: "cortex graph impact src/lib/auth.ts" }] },
  { icon: GitBranch, color: "text-amber-400", bg: "bg-amber-500/10", glow: "rgba(251,191,36,0.15)", borderColor: "border-amber-500/20", commands: [{ label: "Schedule a weekly report", cmd: "cortex jobs add weekly-report 'generate-report' --cron '0 9 * * 1'" }, { label: "Start daemon mode", cmd: "cortex daemon start" }, { label: "Create a policy rule", cmd: "cortex policy add 'rm.*-rf.*/' --kind shell --effect deny" }] },
  { icon: Search, color: "text-cyan-400", bg: "bg-cyan-500/10", glow: "rgba(34,211,238,0.15)", borderColor: "border-cyan-500/20", commands: [{ label: "Search memory semantically", cmd: "cortex memory search 'deployment configuration'" }, { label: "Search by memory type", cmd: "cortex memory search 'auth pattern' --type semantic" }, { label: "View knowledge graph", cmd: "cortex server start && open http://127.0.0.1:3000" }] },
  { icon: Shield, color: "text-red-400", bg: "bg-red-500/10", glow: "rgba(248,113,113,0.15)", borderColor: "border-red-500/20", commands: [{ label: "Add a deny policy", cmd: "cortex policy add 'rm.*-rf.*/' --kind shell --effect deny" }, { label: "Store a credential", cmd: "cortex vault set GITHUB_TOKEN --value 'ghp_...'" }, { label: "View audit logs", cmd: "cortex server start && open http://127.0.0.1:3000/lens" }] },
  { icon: Mic, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", glow: "rgba(232,121,249,0.15)", borderColor: "border-fuchsia-500/20", commands: [{ label: "Enable voice", cmd: "cortex voice enable" }, { label: "Start voice session", cmd: "cortex voice start --stt whisper-1 --tts elevenlabs" }, { label: "Configure VAD sensitivity", cmd: "cortex voice configure --vad-threshold 0.3" }] },
  { icon: Monitor, color: "text-teal-400", bg: "bg-teal-500/10", glow: "rgba(45,212,191,0.15)", borderColor: "border-teal-500/20", commands: [{ label: "Take a screenshot", cmd: "cortex desktop screenshot" }, { label: "Click a position", cmd: "cortex desktop click 500 300" }, { label: "Type text into field", cmd: "cortex desktop type 'Hello World'" }] },
  { icon: Code2, color: "text-indigo-400", bg: "bg-indigo-500/10", glow: "rgba(99,102,241,0.18)", borderColor: "border-indigo-500/20", commands: [{ label: "Start codegraph UI", cmd: "cortex server start && open http://127.0.0.1:3000/codegraph" }, { label: "Analyze a symbol", cmd: "cortex graph dependencies src/lib/auth.ts --symbol authenticate" }, { label: "Trace call path", cmd: "cortex graph path src/index.ts --to src/lib/prisma.ts" }] },
];

const KEY_PREFIXES = ["personalAI", "research", "dev", "cicd", "knowledge", "secure", "voice", "gui", "codebase"];
const CARD_IDS = ["personal-ai-assistant", "research--analysis", "development--debugging", "ci/cd--automation", "knowledge-management", "secure-agent-deployments", "voice-enabled-agent", "gui-automation--computer-use", "codebase-intelligence"];

export default async function UseCasesPage() {
  const t = await getTranslations("useCases");

  const useCases = KEY_PREFIXES.map((prefix, i) => ({
    ...USE_CASE_CONFIGS[i],
    titleKey: prefix,
    subKey: `${prefix}Sub`,
    descKey: `${prefix}Desc`,
    audienceKey: `${prefix}Audience`,
    highlightKeys: [`${prefix}H1`, `${prefix}H2`, `${prefix}H3`, `${prefix}H4`],
  }));

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 md:py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">{t("badge")}</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#e2e2ea] leading-tight">
          {t("headline1")}
          <span className="gradient-text">{t("headline2")}</span>
        </h1>
        <p className="mt-5 text-lg text-[#9090a8] max-w-3xl mx-auto leading-relaxed">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { value: "9+", labelKey: "statUseCases" },
          { value: "60+", labelKey: "statTools" },
          { value: "30+", labelKey: "statProviders" },
          { value: "14+", labelKey: "statLanguages" },
        ].map((stat) => (
          <div key={stat.labelKey} className="glass-card p-4 text-center">
            <div className="text-2xl font-bold gradient-text">{stat.value}</div>
            <div className="text-xs text-[#55556a] mt-1">{t(stat.labelKey)}</div>
          </div>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="text-lg font-semibold text-[#e2e2ea] mb-5 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          {t("exploreLabel")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((uc, i) => (
            <a
              key={uc.titleKey}
              href={`#${CARD_IDS[i]}`}
              className="group relative bg-[#111118] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-[rgba(255,255,255,0.14)] hover:bg-[#14141c] no-underline"
            >
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style={{ background: `radial-gradient(circle at 30% 30%, ${uc.glow} 0%, transparent 70%)` }}
              />
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${uc.bg} mb-3 transition-transform duration-200 group-hover:scale-110 relative`}>
                <uc.icon className={`w-5 h-5 ${uc.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-[#e2e2ea] mb-1 relative">{t(uc.titleKey)}</h3>
              <p className="text-xs text-[#9090a8] leading-relaxed relative line-clamp-2">{t(uc.subKey)}</p>
            </a>
          ))}
        </div>
      </div>

      <div>
        {useCases.map((uc, i) => (
          <section
            key={uc.titleKey}
            id={CARD_IDS[i]}
            className={`py-16 ${i > 0 ? "border-t border-[rgba(255,255,255,0.06)]" : ""}`}
          >
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              <div className={i % 2 === 0 ? "md:order-1" : "md:order-2"}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${uc.bg} transition-transform duration-200`}
                    style={{ boxShadow: `0 0 20px ${uc.glow}` }}
                  >
                    <uc.icon className={`w-6 h-6 ${uc.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#e2e2ea]">{t(uc.titleKey)}</h2>
                    <p className={`text-sm ${uc.color} font-medium`}>{t(uc.subKey)}</p>
                  </div>
                </div>
                <p className="text-[#9090a8] leading-relaxed mb-5">{t(uc.descKey)}</p>
                <div className={`glass-card p-4 mb-5 border-l-2 ${uc.borderColor}`}>
                  <p className="text-xs uppercase tracking-wider text-[#55556a] mb-1 font-semibold">{t("whoFor")}</p>
                  <p className="text-sm text-[#c4c4d4] leading-relaxed">{t(uc.audienceKey)}</p>
                </div>
                <ul className="space-y-2.5">
                  {uc.highlightKeys.map((hk) => (
                    <li key={hk} className="flex items-start gap-2.5 text-sm text-[#b0b0c4]">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${uc.color}`} />
                      <span>{t(hk)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={i % 2 === 0 ? "md:order-2" : "md:order-1"}>
                <div className="sticky top-24">
                  <h3 className="text-xs uppercase tracking-widest text-[#55556a] mb-3 font-semibold">{t("tryIt")}</h3>
                  <TerminalBlock commands={uc.commands} />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16">
        <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#e2e2ea] relative">{t("ctaHeadline")}</h2>
          <p className="mt-3 text-[#9090a8] max-w-lg mx-auto relative">{t("ctaDesc")}</p>
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
              {t("ctaGuide")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/features" className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg border border-[rgba(255,255,255,0.15)] text-[#e2e2ea] hover:bg-[#111118] transition-colors">
              {t("ctaFeatures")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
