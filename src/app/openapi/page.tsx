"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";

export default function OpenApiPage() {
  const [spec, setSpec] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/docs/openapi.json")
      .then((r) => r.json())
      .then(setSpec);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#e2e2ea] mb-8">API Documentation</h1>
      <div className="glass-card p-6">
        {spec && (
          <SwaggerUI spec={spec} />
        )}
      </div>
    </div>
  );
}
