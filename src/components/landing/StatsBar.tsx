import { formatNumber } from "@/lib/utils";

interface StatsBarProps {
  githubStars: number;
  pluginCount: number;
  agentCount: number;
  totalDownloads: number;
}

export function StatsBar({ githubStars, pluginCount, agentCount, totalDownloads }: StatsBarProps) {
  const stats = [
    { label: "GitHub Stars", value: githubStars > 0 ? formatNumber(githubStars) : "—" },
    { label: "Plugins Available", value: String(pluginCount) },
    { label: "Agent Configs", value: String(agentCount) },
    { label: "Downloads", value: formatNumber(totalDownloads) },
  ];

  return (
    <section className="border-y border-[rgba(255,255,255,0.07)] bg-[#111118]">
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="mt-1 text-sm text-[#9090a8]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
