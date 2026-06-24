import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  MessageSquare,
  Wrench,
  Database,
  Shield,
  Code2,
  Route,
  Clock,
  Puzzle,
  Monitor,
  Bot,
  Share2,
  GitBranch,
  Workflow,
  BrainCircuit,
  Search,
  Sparkles,
  GitGraph,
  Mic,
  MonitorSmartphone,
  Globe,
  Network,
  Users,
  Link2,
} from "lucide-react";
import { generateAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "CortexPrism Features — Agent Operating System Capabilities | AI OS Features",
  description:
    "Explore the full Agent Operating System feature set: chat with 30 LLM providers, 5-tier memory, 60+ built-in tools, self-learning skills, code intelligence, voice pipeline, computer use, browser automation, A2A protocol, MCP & ESM plugin system, Parallax security, sandboxed code execution, multi-agent orchestration, multi-user collaboration with teams and API tokens, instance federation, UI overhaul with dark/light theme, data import from OpenClaw/Hermes, and workflow engine. All open source.",
  keywords: [
    "AI OS features",
    "Agent Operating System capabilities",
    "Agent OS capabilities",
    "AI agent framework features",
    "LLM orchestration tools",
    "multi-agent system",
    "multi-user AI agent",
    "AI agent teams",
    "instance federation",
    "API tokens AI agent",
    "AI agent collaboration",
    "vector memory AI",
    "MCP plugin system",
    "sandboxed code execution",
    "AI workflow engine",
    "open source AI tools",
    "autonomous agent capabilities",
    "model context protocol",
    "self-learning skills AI",
    "code intelligence graph",
    "voice pipeline AI",
    "computer use AI agent",
    "A2A protocol",
    "agentic operating system features",
  ],
  alternates: generateAlternates("/features"),
  openGraph: {
    title: "CortexPrism Features — Agent Operating System Capabilities | AI OS Features",
    description:
      "The open-source Agent Operating System: 30 LLM providers, 5-tier memory, 60+ tools, self-learning skills, code intelligence, voice pipeline, computer use, browser automation, A2A protocol, MCP & ESM plugins, Parallax security, sandboxed code execution, multi-user collaboration with teams and API tokens, instance federation, overhauled UI with dark/light theme, multi-agent orchestration.",
    url: "https://cortexprism.io/features",
  },
  twitter: {
    title: "CortexPrism Features — Agent Operating System Capabilities | AI OS Features",
    description:
      "The open-source Agent Operating System: 30 LLM providers, 5-tier memory, 60+ tools, self-learning skills, code intelligence, voice, computer use, browser automation, A2A protocol, sandboxed execution, multi-user collaboration, instance federation, multi-agent orchestration.",
  },
};

const features = [
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

export default async function FeaturesPage() {
  const t = await getTranslations("featuresDetail");

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e2e2ea]">{t("heading")}</h1>
        <p className="mt-4 text-lg text-[#9090a8] max-w-4xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="space-y-12">
        {features.map((feature) => {
          const { prefix, benefitCount, icon: Icon, example } = feature;
          return (
            <div
              key={prefix}
              className="glass-card p-8 md:p-10 grid md:grid-cols-2 gap-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#e2e2ea]">{t(`${prefix}Title`)}</h2>
                    <p className="text-sm text-[#55556a]">{t(`${prefix}Sub`)}</p>
                  </div>
                </div>
                <p className="text-[#9090a8] leading-relaxed mb-6">{t(`${prefix}Desc`)}</p>
                <ul className="space-y-2">
                  {Array.from({ length: benefitCount }, (_, i) => {
                    const key = `${prefix}B${i + 1}`;
                    return (
                      <li key={key} className="flex items-start gap-2 text-sm text-[#9090a8]">
                        <span className="text-indigo-400 mt-0.5">◆</span>
                        {t(key)}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="glass-card p-4 h-fit">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-[#55556a] font-mono">terminal</span>
                </div>
                <pre className="text-sm font-mono">
                  <code>
                    <span className="text-[#55556a]">$ </span>
                    <span className="text-green-400">cortex</span>
                    <span className="text-[#e2e2ea]"> {example}</span>
                  </code>
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
