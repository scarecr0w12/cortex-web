import type { Metadata } from "next";
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
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore all features of CortexPrism — the open-source agentic harness system",
};

const features = [
  {
    icon: MessageSquare,
    title: "Interactive Chat",
    subtitle: "Multi-Provider LLM Support",
    description:
      "Chat with 12+ LLM providers through a unified interface. Switch between OpenAI, Anthropic Claude, Google Gemini, Groq, and more without changing your workflow.",
    benefits: [
      "One interface for all major LLM providers",
      "Provider failover and fallback chains",
      "Streaming responses with real-time token display",
      "Conversation history with search and export",
    ],
    example: "cortex chat --model claude-sonnet-4-20250514",
  },
  {
    icon: Wrench,
    title: "Tool Use & Approval Gates",
    subtitle: "Controlled Agent Autonomy",
    description:
      "Agents can use tools and call functions, with configurable approval gates that let you review and approve or reject tool calls before they execute.",
    benefits: [
      "Built-in tool system for code execution, file I/O, web access",
      "Approval gates for sensitive operations",
      "Policy-based automatic approval rules",
      "Full audit log of all tool calls",
    ],
    example: "cortex chat --tools all",
  },
  {
    icon: Database,
    title: "5-Tier Memory System",
    subtitle: "From Ephemeral to Procedural",
    description:
      "A sophisticated memory architecture with five tiers: ephemeral (session), working (task), semantic (knowledge), archival (history), and procedural (skills).",
    benefits: [
      "Ephemeral: In-session context only",
      "Working: Active task-related information",
      "Semantic: Long-term knowledge storage",
      "Archival: Compressed historical data",
      "Procedural: Learned skills and patterns",
    ],
    example: "cortex memory search --query \"deployment config\" --tier semantic",
  },
  {
    icon: Shield,
    title: "Parallax Security Model",
    subtitle: "Defense in Depth",
    description:
      "A multi-layered security architecture with encrypted vault storage, granular policy engine, role-based access control, and approval workflows.",
    benefits: [
      "Encrypted vault for secrets and credentials",
      "Policy engine with allow/deny rules",
      "Approval workflows for sensitive actions",
      "Sandboxed plugin execution isolation",
    ],
    example: "cortex policy add --allow code.execute.python",
  },
  {
    icon: Code2,
    title: "Sandboxed Code Execution",
    subtitle: "Run Code Safely",
    description:
      "Execute Python, JavaScript, Wasm, and shell commands in isolated sandboxes. Perfect for data analysis, automation, and prototyping.",
    benefits: [
      "Python sandbox with pip package support",
      "WebAssembly runtime with WASI support",
      "Resource limits (CPU, memory, timeouts)",
      "Read-only mode for untrusted scripts",
    ],
    example: "cortex run --sandbox python --script analyze.py",
  },
  {
    icon: Route,
    title: "Model Router (RouteLLM)",
    subtitle: "Intelligent Model Selection",
    description:
      "RouteLLM integration enables automatic model selection based on task complexity, cost optimization, and provider availability with intelligent failover.",
    benefits: [
      "Automatic model selection by task type",
      "Cost optimization between providers",
      "Graceful failover on provider outages",
      "Custom routing rules and priorities",
    ],
    example: "cortex chat --router cost-optimized",
  },
  {
    icon: Clock,
    title: "Daemon Supervisor & Jobs",
    subtitle: "Background Processing",
    description:
      "Persistent daemon mode with a built-in job scheduler. Run agents in the background, schedule recurring tasks, and monitor execution.",
    benefits: [
      "Persistent background daemon process",
      "CRON-like job scheduling",
      "Job queue with priority levels",
      "Execution logs and monitoring",
    ],
    example: "cortex daemon start && cortex jobs add --schedule \"0 9 * * 1\" --task weekly-report",
  },
  {
    icon: Puzzle,
    title: "Plugin System",
    subtitle: "ESM, MCP & WASM",
    description:
      "Extend CortexPrism with a powerful plugin system supporting ESM modules, Model Context Protocol servers, and WebAssembly plugins.",
    benefits: [
      "Three plugin types: ESM, MCP, WASM",
      "Plugin marketplace for discovery",
      "Version management with dependency resolution",
      "Isolated plugin sandboxes",
    ],
    example: "cortex plugin install marketplace:cortexprism.io/plugins/python-executor",
  },
  {
    icon: Monitor,
    title: "Web UI & REST API",
    subtitle: "Full-Featured Interface",
    description:
      "Built-in web interface and comprehensive REST API for managing agents, monitoring sessions, and configuring the system remotely.",
    benefits: [
      "Responsive dark-theme web dashboard",
      "REST API with OpenAPI documentation",
      "WebSocket for real-time streaming",
      "Session management and monitoring",
    ],
    example: "cortex serve --port 8080",
  },
  {
    icon: Bot,
    title: "Agent Manager",
    subtitle: "Multi-Agent Orchestration",
    description:
      "Create, configure, and manage multiple specialized agents with different personalities, tools, and provider configurations.",
    benefits: [
      "Multiple agent profiles with custom configurations",
      "Agent-specific system prompts and souls",
      "Per-agent tool and provider assignments",
      "Agent-to-agent collaboration",
    ],
    example: "cortex agent create --name code-reviewer --model claude-sonnet-4-20250514",
  },
  {
    icon: Share2,
    title: "Micro-Services",
    subtitle: "Distributed Architecture",
    description:
      "Run CortexPrism as a distributed system with micro-service architecture. Scale components independently and deploy across multiple machines.",
    benefits: [
      "Distributed agent execution",
      "Message queue integration",
      "Service discovery and health checks",
      "Horizontal scaling of components",
    ],
    example: "cortex serve --mode micro --workers 4",
  },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e2e2ea]">Features</h1>
        <p className="mt-4 text-lg text-[#9090a8] max-w-4xl mx-auto">
          Everything you need to build, deploy, and manage agentic AI applications.
        </p>
      </div>

      <div className="space-y-12">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="glass-card p-8 md:p-10 grid md:grid-cols-2 gap-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#e2e2ea]">{feature.title}</h2>
                  <p className="text-sm text-[#55556a]">{feature.subtitle}</p>
                </div>
              </div>
              <p className="text-[#9090a8] leading-relaxed mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm text-[#9090a8]">
                    <span className="text-indigo-400 mt-0.5">◆</span>
                    {benefit}
                  </li>
                ))}
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
                  <span className="text-[#e2e2ea]"> {feature.example}</span>
                </code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
