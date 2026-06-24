import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe, Github, Heart, Code2 } from "lucide-react";
import { generateAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: `${t("headline")} — CortexPrism`,
    description: t("subtitle"),
    alternates: generateAlternates("/about"),
    openGraph: {
      title: `${t("headline")} — CortexPrism`,
      description: t("subtitle"),
      url: "https://cortexprism.io/about",
    },
    twitter: {
      title: `${t("headline")} — CortexPrism`,
      description: t("subtitle"),
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tc = await getTranslations("common");

  return (
    <div className="max-w-page-narrow mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e2e2ea]">
          {t("headline")}
        </h1>
        <p className="mt-4 text-lg text-[#9090a8] max-w-4xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="glass-card p-8 md:p-12 mb-12">
        <h2 className="text-2xl font-bold text-[#e2e2ea] mb-4">{t("whatIsTitle")}</h2>
        <div className="space-y-4 text-[#9090a8] leading-relaxed">
          <p>{t("whatIsP1")}</p>
          <p>{t("whatIsP2")}</p>
          <p>{t("whatIsP3")}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="glass-card p-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-[#e2e2ea] mb-2">{t("whyDeno")}</h3>
          <p className="text-sm text-[#9090a8] leading-relaxed">{t("whyDenoDesc")}</p>
        </div>

        <div className="glass-card p-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 text-green-400 mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-[#e2e2ea] mb-2">{t("whyOpenSource")}</h3>
          <p className="text-sm text-[#9090a8] leading-relaxed">{t("whyOpenSourceDesc")}</p>
        </div>

        <div className="glass-card p-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 mb-4">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-[#e2e2ea] mb-2">{t("providerFreedom")}</h3>
          <p className="text-sm text-[#9090a8] leading-relaxed">{t("providerFreedomDesc")}</p>
        </div>

        <div className="glass-card p-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-400 mb-4">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-[#e2e2ea] mb-2">{t("extensible")}</h3>
          <p className="text-sm text-[#9090a8] leading-relaxed">{t("extensibleDesc")}</p>
        </div>
      </div>

      <div className="glass-card p-8 mb-12">
        <h2 className="text-xl font-bold text-[#e2e2ea] mb-4">{t("principlesTitle")}</h2>
        <div className="space-y-4">
          {[
            { titleKey: "principlePrivacyTitle", descKey: "principlePrivacyDesc" },
            { titleKey: "principleSecurityTitle", descKey: "principleSecurityDesc" },
            { titleKey: "principleProviderTitle", descKey: "principleProviderDesc" },
            { titleKey: "principleLocalTitle", descKey: "principleLocalDesc" },
            { titleKey: "principleCommunityTitle", descKey: "principleCommunityDesc" },
          ].map((item) => (
            <div key={item.titleKey} className="flex items-start gap-3">
              <span className="text-indigo-400 mt-1">◆</span>
              <div>
                <h3 className="text-sm font-semibold text-[#e2e2ea]">{t(item.titleKey)}</h3>
                <p className="text-sm text-[#9090a8]">{t(item.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-[#9090a8] mb-4">
          <Heart className="w-4 h-4 text-red-400" />
          <span>{t("builtWithLove")}</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/getting-started"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg accent-gradient text-white hover:opacity-90 transition-opacity"
          >
            {tc("getStarted")}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/CortexPrism/cortex"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg border border-[rgba(255,255,255,0.15)] text-[#e2e2ea] hover:bg-[#111118] transition-colors"
          >
            <Github className="w-5 h-5" />
            {tc("viewOnGitHub")}
          </a>
        </div>
      </div>
    </div>
  );
}
