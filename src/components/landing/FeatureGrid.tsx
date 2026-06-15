import {
  MessageSquare,
  Wrench,
  Database,
  Shield,
  Clock,
  Code2,
  Route,
  Puzzle,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Interactive Chat",
    description: "Chat with 12+ LLM providers including OpenAI, Anthropic, Google, Groq, and more.",
    color: "text-blue-400 bg-blue-500/10",
  },
  {
    icon: Wrench,
    title: "Tool Use & Approval",
    description: "Agents can use tools with configurable approval gates for safety.",
    color: "text-green-400 bg-green-500/10",
  },
  {
    icon: Database,
    title: "5-Tier Memory",
    description: "Ephemeral, working, semantic, archival, and procedural memory layers.",
    color: "text-purple-400 bg-purple-500/10",
  },
  {
    icon: Shield,
    title: "Parallax Security",
    description: "Defense-in-depth with vault, policy engine, and approval workflows.",
    color: "text-red-400 bg-red-500/10",
  },
  {
    icon: Code2,
    title: "Code Sandbox",
    description: "Secure code execution in sandboxed environments (Python, WASM, more).",
    color: "text-yellow-400 bg-yellow-500/10",
  },
  {
    icon: Route,
    title: "Model Router",
    description: "RouteLLM integration for intelligent model selection and failover.",
    color: "text-indigo-400 bg-indigo-500/10",
  },
  {
    icon: Clock,
    title: "Daemon & Jobs",
    description: "Persistent daemon mode with scheduled jobs and background processing.",
    color: "text-cyan-400 bg-cyan-500/10",
  },
  {
    icon: Puzzle,
    title: "Plugin System",
    description: "Extensible ESM/MCP/WASM plugin architecture with marketplace.",
    color: "text-pink-400 bg-pink-500/10",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20">
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#e2e2ea]">
            Everything you need to build{" "}
            <span className="gradient-text">agentic applications</span>
          </h2>
          <p className="mt-4 text-lg text-[#9090a8] max-w-4xl mx-auto">
            A comprehensive toolset for building, deploying, and managing AI agents.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card-hover p-5 group cursor-default"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${feature.color} mb-3`}
              >
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#e2e2ea] mb-1.5">{feature.title}</h3>
              <p className="text-sm text-[#9090a8] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
