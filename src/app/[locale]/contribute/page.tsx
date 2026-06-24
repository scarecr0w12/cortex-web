import type { Metadata } from "next";
import Link from "next/link";
import { Bug, BookOpen, Puzzle, MessageCircle, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SITE_URL, generateAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contribute to CortexPrism — Open-Source Agent Operating System",
  description:
    "Contribute to the open-source CortexPrism project — the Agent Operating System for autonomous AI agents. Report issues, submit pull requests, develop plugins, or join the community. Apache 2.0 licensed and community-driven.",
  alternates: generateAlternates("/contribute"),
  keywords: [
    "contribute to Agent Operating System",
    "contribute to AI OS",
    "open source AI agent contribution",
    "AI agent operating system contributor",
    "CortexPrism contribution guide",
    "Apache 2.0 AI project",
    "AI plugin development",
    "open source AI community",
    "report AI agent bugs",
    "contribute to Agent OS",
  ],
  openGraph: {
    title: "Contribute to CortexPrism — Open-Source Agent Operating System",
    description:
      "Help build the future of AI agent technology. Report bugs, submit PRs, develop plugins for the marketplace, or join the Discord community.",
    url: `${SITE_URL}/contribute`,
  },
  twitter: {
    title: "Contribute to CortexPrism — Open-Source Agent Operating System",
    description:
      "Help build the future of AI agent technology. Report bugs, submit PRs, develop plugins, or join the community.",
  },
};

export default async function ContributePage() {
  const t = await getTranslations("contributePage");

  const sections = [
    {
      icon: Bug,
      title: t("reportIssues"),
      description: t("reportIssuesDesc"),
      link: "https://github.com/CortexPrism/cortex/issues",
      label: t("reportIssuesLabel"),
    },
    {
      icon: MessageCircle,
      title: t("joinCommunity"),
      description: t("joinCommunityDesc"),
      link: "https://discord.gg/wYxbmQeWY3",
      label: t("joinCommunityLabel"),
    },
    {
      icon: BookOpen,
      title: t("submitPrs"),
      description: t("submitPrsDesc"),
      link: "https://github.com/CortexPrism/cortex/pulls",
      label: t("submitPrsLabel"),
    },
    {
      icon: Puzzle,
      title: t("developPlugins"),
      description: t("developPluginsDesc"),
      link: "/marketplace/publish/plugin",
      label: t("developPluginsLabel"),
    },
  ];

  return (
    <div className="max-w-page-narrow mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e2e2ea]">{t("heading")}</h1>
        <p className="mt-4 text-lg text-[#9090a8]">
          {t("subtitle")}
        </p>
      </div>

      <div className="glass-card p-8 mb-12">
        <p className="text-[#9090a8] leading-relaxed">
          {t("licenseText")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {sections.map((section) => (
          <div key={section.title} className="glass-card-hover p-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 mb-4">
              <section.icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#e2e2ea] mb-2">{section.title}</h3>
            <p className="text-sm text-[#9090a8] mb-4 leading-relaxed">{section.description}</p>
            <a
              href={section.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {section.label}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      <div className="glass-card p-8">
        <h2 className="text-xl font-bold text-[#e2e2ea] mb-4">{t("devSetup")}</h2>
        <div className="space-y-4 text-sm text-[#9090a8]">
          <p>{t("devSetupDesc")}</p>
          <div className="glass-card p-4">
            <pre className="text-sm font-mono">
              <code>
                <span className="text-[#55556a]">{t("devSetupCodeComment1")}</span>
                {"\n"}
                <span className="text-green-400">git clone</span>
                <span className="text-[#e2e2ea]"> https://github.com/CortexPrism/cortex.git</span>
                {"\n"}
                <span className="text-green-400">cd</span>
                <span className="text-[#e2e2ea]"> cortex</span>
                {"\n\n"}
                <span className="text-[#55556a]">{t("devSetupCodeComment2")}</span>
                {"\n"}
                <span className="text-green-400">deno run --allow-all</span>
                <span className="text-[#e2e2ea]"> src/db/migrate.ts</span>
                {"\n\n"}
                <span className="text-[#55556a]">{t("devSetupCodeComment3")}</span>
                {"\n"}
                <span className="text-green-400">deno task</span>
                <span className="text-[#e2e2ea]"> test</span>
              </code>
            </pre>
          </div>
          <p>
            {t("devSetupInstructions")}
          </p>
          <p>
            {t("moreDetails")}{" "}
            <Link href="https://github.com/CortexPrism/cortex/blob/main/CONTRIBUTING.md" className="text-indigo-400 hover:text-indigo-300">
              {t("contributingGuide")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
