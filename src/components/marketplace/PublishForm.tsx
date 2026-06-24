"use client";

import { useState, useEffect } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shared/Button";

interface PublishFormProps {
  type: "plugin" | "agent";
}

interface Category {
  id: string; name: string; slug: string;
}

export function PublishForm({ type }: PublishFormProps) {
  const t = useTranslations("marketplaceList");
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState("esm");
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [temperature, setTemperature] = useState("0.7");
  const [author, setAuthor] = useState("");
  const [authorUrl, setAuthorUrl] = useState("");
  const [homepage, setHomepage] = useState("");
  const [repository, setRepository] = useState("");
  const [license, setLicense] = useState("");
  const [icon, setIcon] = useState("");
  const [readme, setReadme] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [capabilitiesStr, setCapabilitiesStr] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [toolsStr, setToolsStr] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    fetch("/api/marketplace/categories")
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    setLoading(true);
    setError("");

    const body: Record<string, unknown> = {
      name, version, description,
      author: author || undefined,
      authorUrl: authorUrl || undefined,
      homepage: homepage || undefined,
      repository: repository || undefined,
      license: license || undefined,
      icon: icon || undefined,
      readme: readme || undefined,
      categoryId: categoryId || undefined,
    };

    if (type === "plugin") {
      body.kind = kind;
      body.capabilities = capabilitiesStr ? capabilitiesStr.split(",").map(s => s.trim()).filter(Boolean) : undefined;
      body.tags = tagsStr ? tagsStr.split(",").map(s => s.trim()).filter(Boolean) : undefined;
    }

    if (type === "agent") {
      body.provider = provider || undefined;
      body.model = model || undefined;
      body.temperature = temperature ? parseFloat(temperature) : undefined;
      body.tags = tagsStr ? tagsStr.split(",").map(s => s.trim()).filter(Boolean) : undefined;
      body.tools = toolsStr ? toolsStr.split(",").map(s => s.trim()).filter(Boolean) : undefined;
      body.systemPrompt = systemPrompt || undefined;
    }

    try {
      const res = await fetch(`/api/marketplace/${type === "plugin" ? "plugins" : "agents"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(typeof data.error === "string" ? data.error : "Submission failed");
      }
    } catch {
      setError("Connection error");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-4xl mb-4">&#127881;</div>
        <h2 className="text-xl font-bold text-[#e2e2ea] mb-2">{t("submissionReceived")}</h2>
        <p className="text-[#9090a8] mb-6">
          {t("submissionDescDynamic", { type })}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/dashboard" className="text-sm text-indigo-400 hover:text-indigo-300">
            {t("viewDashboard")}
          </Link>
          <Link href={`/marketplace/${type === "plugin" ? "plugins" : "agents"}`} className="text-sm text-[#55556a] hover:text-[#e2e2ea]">
            {t("browseMarketplace")}
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50";
  const labelClass = "block text-sm font-medium text-[#e2e2ea] mb-1";
  const sectionClass = "space-y-4";

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
      {error && <p className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3">{error}</p>}

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">{t("basicInfo")}</h3>
        <div>
          <label className={labelClass}>{t("fieldName")}</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)}
            className={inputClass} placeholder={t("fieldNamePlaceholder")} />
        </div>
        <div>
          <label className={labelClass}>{t("fieldVersion")}</label>
          <input type="text" required value={version} onChange={e => setVersion(e.target.value)}
            className={inputClass} placeholder={t("fieldVersionPlaceholder")} />
        </div>
        <div>
          <label className={labelClass}>{t("fieldDescription")}</label>
          <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)}
            className={inputClass} placeholder={t("fieldDescriptionPlaceholder")} />
        </div>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.07)]" />

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
          {type === "plugin" ? t("pluginDetails") : t("agentConfig")}
        </h3>

        {type === "plugin" && (
          <>
            <div>
              <label className={labelClass}>{t("fieldKind")}</label>
              <select value={kind} onChange={e => setKind(e.target.value)} className={inputClass}>
                <option value="esm">ESM</option>
                <option value="mcp">MCP</option>
                <option value="wasm">WASM</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{t("fieldCapabilities")}</label>
              <input type="text" value={capabilitiesStr} onChange={e => setCapabilitiesStr(e.target.value)}
                className={inputClass} placeholder={t("capabilitiesPlaceholder")} />
              <p className="text-xs text-[#55556a] mt-1">{t("capabilitiesHelp")}</p>
            </div>
          </>
        )}

        {type === "agent" && (
          <>
            <div>
              <label className={labelClass}>{t("fieldProvider")}</label>
              <input type="text" value={provider} onChange={e => setProvider(e.target.value)}
                className={inputClass} placeholder={t("fieldProviderPlaceholder")} />
            </div>
            <div>
              <label className={labelClass}>{t("fieldModel")}</label>
              <input type="text" value={model} onChange={e => setModel(e.target.value)}
                className={inputClass} placeholder={t("fieldModelPlaceholder")} />
            </div>
            <div>
              <label className={labelClass}>{t("fieldTemperature")}</label>
              <input type="number" step="0.1" min="0" max="2" value={temperature} onChange={e => setTemperature(e.target.value)}
                className={inputClass} placeholder="0.7" />
            </div>
            <div>
              <label className={labelClass}>{t("fieldTools")}</label>
              <input type="text" value={toolsStr} onChange={e => setToolsStr(e.target.value)}
                className={inputClass} placeholder={t("toolsPlaceholder")} />
            </div>
            <div>
              <label className={labelClass}>{t("fieldSystemPrompt")}</label>
              <textarea rows={4} value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
                className={inputClass + " font-mono text-xs"} placeholder={t("systemPromptPlaceholder")} />
            </div>
          </>
        )}

        <div>
          <label className={labelClass}>{t("fieldTags")}</label>
          <input type="text" value={tagsStr} onChange={e => setTagsStr(e.target.value)}
            className={inputClass} placeholder={t("tagsPlaceholder")} />
        </div>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.07)]" />

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">{t("authorLinks")}</h3>
        <div>
          <label className={labelClass}>{t("fieldAuthorName")}</label>
          <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
            className={inputClass} placeholder={t("fieldAuthorNamePlaceholder")} />
        </div>
        <div>
          <label className={labelClass}>{t("fieldAuthorUrl")}</label>
          <input type="url" value={authorUrl} onChange={e => setAuthorUrl(e.target.value)}
            className={inputClass} placeholder={t("fieldAuthorUrlPlaceholder")} />
        </div>
        <div>
          <label className={labelClass}>{t("fieldRepositoryUrl")}</label>
          <input type="url" value={repository} onChange={e => setRepository(e.target.value)}
            className={inputClass} placeholder={t("fieldRepositoryUrlPlaceholder")} />
          <p className="text-xs text-[#55556a] mt-1">{t("repositoryHelp")}</p>
        </div>
        <div>
          <label className={labelClass}>{t("fieldHomepage")}</label>
          <input type="url" value={homepage} onChange={e => setHomepage(e.target.value)}
            className={inputClass} placeholder={t("fieldHomepagePlaceholder")} />
        </div>
        <div>
          <label className={labelClass}>{t("fieldLicense")}</label>
          <input type="text" value={license} onChange={e => setLicense(e.target.value)}
            className={inputClass} placeholder={t("fieldLicensePlaceholder")} />
        </div>
      </div>

      <div className="h-px bg-[rgba(255,255,255,0.07)]" />

      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">{t("media")}</h3>
        <div>
          <label className={labelClass}>{t("fieldIconUrl")}</label>
          <input type="url" value={icon} onChange={e => setIcon(e.target.value)}
            className={inputClass} placeholder={t("fieldIconUrlPlaceholder")} />
        </div>
        <div>
          <label className={labelClass}>{t("fieldCategory")}</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputClass}>
            <option value="">{t("noCategory")}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t("fieldReadme")}</label>
          <textarea rows={6} value={readme} onChange={e => setReadme(e.target.value)}
            className={`${inputClass} font-mono text-xs`} placeholder={t("readmePlaceholder")} />
          <p className="text-xs text-[#55556a] mt-1">{t("readmeHelp")}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-[rgba(255,255,255,0.07)]">
        <p className="text-xs text-[#55556a] mb-4">{t("reviewNote")}</p>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? t("submitting") : t("submitForReview")}
        </Button>
      </div>
    </form>
  );
}
