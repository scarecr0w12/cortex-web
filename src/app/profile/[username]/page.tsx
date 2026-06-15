import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

import { DownloadCount } from "@/components/shared/DownloadCount";
import { StarRating } from "@/components/shared/StarRating";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { formatDate } from "@/lib/utils";
import { Package, Bot, Globe, Calendar, User as UserIcon } from "lucide-react";
import { SITE_URL } from "@/lib/seo";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await prisma.user.findUnique({ where: { username: params.username } });
  if (!user) return { title: "User Not Found" };
  return {
    title: `${user.username} — CortexPrism Profile`,
    description: user.bio || `View ${user.username}'s CortexPrism marketplace plugins and agent submissions`,
    alternates: { canonical: `${SITE_URL}/profile/${user.username}` },
    openGraph: {
      title: `${user.username} — CortexPrism Profile`,
      description: user.bio || `View ${user.username}'s marketplace plugins and agents`,
      url: `${SITE_URL}/profile/${user.username}`,
    },
  };
}

export default async function UserProfilePage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      plugins: {
        where: { status: "approved" },
        include: { category: true },
        orderBy: { downloads: "desc" },
        take: 50,
      },
      agents: {
        where: { status: "approved" },
        include: { category: true },
        orderBy: { downloads: "desc" },
        take: 50,
      },
    },
  });

  if (!user) notFound();

  const totalPlugins = user.plugins.length;
  const totalAgents = user.agents.length;
  const totalDownloads = [...user.plugins, ...user.agents].reduce((sum, item) => sum + item.downloads, 0);

  return (
    <div className="max-w-page-narrow mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12">
      <div className="glass-card p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-2xl shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-indigo-400 font-bold text-xl">{user.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#e2e2ea] mb-1">{user.username}</h1>
                {user.bio && <p className="text-[#9090a8] mb-2">{user.bio}</p>}
              </div>
              <ProfileActions username={user.username} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#55556a]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {formatDate(user.createdAt)}
              </span>
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
                  <Globe className="w-3.5 h-3.5" /> Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{totalPlugins}</div>
          <div className="text-xs text-[#55556a]">Plugins</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{totalAgents}</div>
          <div className="text-xs text-[#55556a]">Agents</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{totalDownloads.toLocaleString()}</div>
          <div className="text-xs text-[#55556a]">Downloads</div>
        </div>
      </div>

      {totalPlugins > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-[#e2e2ea]">Plugins ({totalPlugins})</h2>
          </div>
          <div className="space-y-2">
            {user.plugins.map((p) => (
              <Link key={p.id} href={`/marketplace/plugins/${p.slug}`}>
                <div className="glass-card-hover p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#e2e2ea] hover:text-indigo-400">{p.name}</div>
                    <div className="text-xs text-[#55556a]">v{p.version} &middot; {p.kind.toUpperCase()} &middot; {p.category?.name || "Uncategorized"}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StarRating rating={p.rating} />
                    <DownloadCount count={p.downloads} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {totalAgents > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-[#e2e2ea]">Agents ({totalAgents})</h2>
          </div>
          <div className="space-y-2">
            {user.agents.map((a) => (
              <Link key={a.id} href={`/marketplace/agents/${a.slug}`}>
                <div className="glass-card-hover p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#e2e2ea] hover:text-indigo-400">{a.name}</div>
                    <div className="text-xs text-[#55556a]">v{a.version}{a.provider ? ` &middot; ${a.provider}` : ""} &middot; {a.category?.name || "Uncategorized"}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StarRating rating={a.rating} />
                    <DownloadCount count={a.downloads} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {totalPlugins === 0 && totalAgents === 0 && (
        <div className="glass-card p-12 text-center">
          <UserIcon className="w-8 h-8 mx-auto text-[#55556a] mb-3" />
          <p className="text-[#9090a8]">This user hasn&apos;t published any plugins or agents yet.</p>
        </div>
      )}
    </div>
  );
}
