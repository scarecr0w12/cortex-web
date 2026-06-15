import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "CortexPrism — Open-Source Agentic Harness",
    template: "%s — CortexPrism",
  },
  description:
    "An open-source agentic harness system with multi-provider LLM support, 5-tier memory, parallax security, and a plugin marketplace.",
  openGraph: {
    title: "CortexPrism — Open-Source Agentic Harness",
    description:
      "An open-source agentic harness system with multi-provider LLM support, 5-tier memory, parallax security, and a plugin marketplace.",
    type: "website",
  },
};

const matomoScript = `
var _mtm = window._mtm = window._mtm || [];
_mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
(function() {
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src='https://analytics.thecorehosting.net/js/container_1UvEV4Z1.js'; s.parentNode.insertBefore(g,s);
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <Script id="matomo-tag-manager" strategy="afterInteractive">
          {matomoScript}
        </Script>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
