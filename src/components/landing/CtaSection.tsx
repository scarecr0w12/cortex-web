import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          <h2 className="text-3xl md:text-4xl font-bold text-[#e2e2ea] relative">
            Ready to build?
          </h2>
          <p className="mt-4 text-lg text-[#9090a8] max-w-xl mx-auto relative">
            Get started with CortexPrism in minutes. Clone the repo, configure your provider,
            and start building agentic applications.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative">
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg accent-gradient text-white hover:opacity-90 transition-opacity"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg border border-[rgba(255,255,255,0.15)] text-[#e2e2ea] hover:bg-[#111118] transition-colors"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
