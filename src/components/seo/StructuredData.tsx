function escapeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003C");
}

export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(data) }}
    />
  );
}
