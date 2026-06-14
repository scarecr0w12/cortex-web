import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
