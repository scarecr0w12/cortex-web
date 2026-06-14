import Link from "next/link";
import { Badge } from "@/components/shared/Badge";
import { DownloadCount } from "@/components/shared/DownloadCount";
import { StarRating } from "@/components/shared/StarRating";
import { cn } from "@/lib/utils";

interface PluginCardProps {
  plugin: {
    id: string;
    name: string;
    slug: string;
    version: string;
    description: string;
    kind: string;
    author: string | null;
    downloads: number;
    rating: number;
    category: string | null;
    icon: string | null;
  };
}

const kindColors: Record<string, { badge: "indigo" | "green" | "purple"; from: string; to: string }> = {
  esm: { badge: "indigo", from: "from-indigo-500", to: "to-blue-600" },
  mcp: { badge: "green", from: "from-emerald-500", to: "to-teal-600" },
  wasm: { badge: "purple", from: "from-purple-500", to: "to-pink-600" },
};

const kindGradients: Record<string, string> = {
  esm: "from-indigo-500/20 via-blue-500/10 to-transparent",
  mcp: "from-emerald-500/20 via-teal-500/10 to-transparent",
  wasm: "from-purple-500/20 via-pink-500/10 to-transparent",
};

const iconColors = [
  "from-indigo-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-sky-600",
];

function hashColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return iconColors[Math.abs(h) % iconColors.length];
}

export function PluginCard({ plugin }: PluginCardProps) {
  const kc = kindColors[plugin.kind] || kindColors.esm;
  const bg = kindGradients[plugin.kind] || kindGradients.esm;

  return (
    <Link href={`/marketplace/plugins/${plugin.slug}`}>
      <div
        className={cn(
          "group relative h-full rounded-xl border border-[rgba(255,255,255,0.07)]",
          "bg-[#111118] transition-all duration-300",
          "hover:border-[rgba(99,102,241,0.3)] hover:bg-[#18181f] hover:shadow-lg hover:shadow-indigo-500/5",
          "hover:-translate-y-0.5"
        )}
      >
        <div className={cn("absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b", bg)} />

        <div className="relative p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white shadow-lg",
                hashColor(plugin.name)
              )}>
                {plugin.icon ? (
                  <img src={plugin.icon} alt="" className="w-6 h-6" />
                ) : (
                  plugin.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#e2e2ea] leading-tight group-hover:text-white transition-colors">
                  {plugin.name}
                </h3>
                <span className="text-xs text-[#55556a] font-mono">v{plugin.version}</span>
              </div>
            </div>
            <Badge variant={kc.badge}>{plugin.kind.toUpperCase()}</Badge>
          </div>

          <p className="text-sm text-[#9090a8] leading-relaxed line-clamp-2 mb-4 flex-1">
            {plugin.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-[#55556a] truncate">{plugin.author || "Unknown"}</span>
              {plugin.category && (
                <>
                  <span className="text-[#333]">·</span>
                  <span className="text-xs text-[#55556a] truncate">{plugin.category}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <StarRating rating={plugin.rating} />
              <DownloadCount count={plugin.downloads} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
