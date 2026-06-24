"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

export default function OpenApiPage() {
  const t = useTranslations("openapi");
  const [spec, setSpec] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/docs/openapi.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load spec");
        return r.json();
      })
      .then(setSpec)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-12">
      <h1 className="text-3xl font-bold text-[#e2e2ea] mb-8">{t("title")}</h1>
      <div className="glass-card p-6">
        {error && (
          <p className="text-sm text-red-400 text-center py-8">
            {t("loadError")}
          </p>
        )}
        {!spec && !error && (
          <div className="flex items-center justify-center py-12 text-[#55556a]">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {t("loading")}
          </div>
        )}
        {spec && <SwaggerUI spec={spec} />}
      </div>
    </div>
  );
}
