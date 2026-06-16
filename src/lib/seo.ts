export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cortexprism.io";

export const SITE_NAME = "CortexPrism";

export const SITE_DESCRIPTION =
  "An open-source agentic harness system with multi-provider LLM support, 5-tier memory, parallax security, and a plugin marketplace.";

export const SITE_TAGLINE = "Open-Source Agentic Harness";

export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

export const TWITTER_HANDLE = "@CortexPrism";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    sameAs: [
      "https://github.com/CortexPrism/cortex",
      "https://discord.gg/y7DkaEbPQC",
    ],
    description: SITE_DESCRIPTION,
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/marketplace/plugins?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateSoftwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS, Windows",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateSoftwareApplicationSchema({
  name,
  description,
  url,
  image,
  version,
  applicationCategory = "DeveloperApplication",
  operatingSystem = "Linux, macOS, Windows",
  authorName,
  offers = { price: "0", priceCurrency: "USD" },
}: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
  version: string;
  applicationCategory?: string;
  operatingSystem?: string;
  authorName?: string | null;
  offers?: { price: string; priceCurrency: string };
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    version,
    offers: {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.priceCurrency,
    },
  };

  if (image) schema.image = image;
  if (authorName) schema.author = { "@type": "Person", name: authorName };

  return schema;
}

export function generateArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished: string;
  dateModified?: string;
  authorName?: string | null;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName || "CortexPrism",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  if (image) schema.image = image;

  return schema;
}

export function generateMetaBase(): {
  metadataBase: URL;
  alternates: { canonical: string };
  openGraph: {
    siteName: string;
    locale: string;
    images: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: "summary_large_image";
    site: string;
    creator: string;
    images: string[];
  };
  robots: {
    index: boolean;
    follow: boolean;
    googleBot: {
      index: boolean;
      follow: boolean;
      "max-video-preview": number;
      "max-image-preview": "large";
      "max-snippet": number;
    };
  };
} {
  const baseUrl = new URL(SITE_URL);
  return {
    metadataBase: baseUrl,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      siteName: SITE_NAME,
      locale: "en_US",
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - ${SITE_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      images: [OG_IMAGE_URL],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
