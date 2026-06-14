"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarSection {
  title: string;
  links: { href: string; label: string }[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Getting Started",
    links: [
      { href: "/getting-started", label: "Overview" },
      { href: "/getting-started/installation", label: "Installation" },
      { href: "/getting-started/first-run", label: "First Run" },
      { href: "/getting-started/configuration", label: "Configuration" },
    ],
  },
  {
    title: "CLI Reference",
    links: [
      { href: "/docs/cli", label: "Overview" },
      { href: "/docs/cli/chat", label: "chat" },
      { href: "/docs/cli/serve", label: "serve" },
      { href: "/docs/cli/daemon", label: "daemon" },
      { href: "/docs/cli/run", label: "run" },
      { href: "/docs/cli/memory", label: "memory" },
      { href: "/docs/cli/reflect", label: "reflect" },
      { href: "/docs/cli/vault", label: "vault" },
      { href: "/docs/cli/policy", label: "policy" },
      { href: "/docs/cli/jobs", label: "jobs" },
      { href: "/docs/cli/sessions", label: "sessions" },
      { href: "/docs/cli/setup", label: "setup" },
    ],
  },
  {
    title: "Architecture",
    links: [
      { href: "/docs/architecture", label: "Overview" },
      { href: "/docs/architecture/agent-loop", label: "Agent Loop" },
      { href: "/docs/architecture/memory-system", label: "Memory System" },
      { href: "/docs/architecture/security-parallax", label: "Security Parallax" },
      { href: "/docs/architecture/model-router", label: "Model Router" },
      { href: "/docs/architecture/daemon-supervisor", label: "Daemon Supervisor" },
      { href: "/docs/architecture/plugin-system", label: "Plugin System" },
      { href: "/docs/architecture/databases", label: "Databases" },
    ],
  },
  {
    title: "Knowledge Base",
    links: [
      { href: "/docs/knowledge-base", label: "Overview" },
      { href: "/docs/knowledge-base/faq", label: "FAQ" },
      { href: "/docs/knowledge-base/troubleshooting", label: "Troubleshooting" },
      { href: "/docs/knowledge-base/best-practices", label: "Best Practices" },
      { href: "/docs/knowledge-base/provider-guide", label: "Provider Guide" },
      { href: "/docs/knowledge-base/sandbox-guide", label: "Sandbox Guide" },
    ],
  },
  {
    title: "Design Docs",
    links: [{ href: "/docs/design-docs", label: "Index" }],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  if (!pathname.startsWith("/getting-started") && !pathname.startsWith("/docs")) {
    return null;
  }

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] pr-4">
        <nav className="space-y-6">
          {sidebarSections.map((section) => {
            const isActive = section.links.some((l) => pathname === l.href);
            return (
              <div key={section.title}>
                <h3
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider mb-2",
                    isActive ? "text-indigo-400" : "text-[#55556a]"
                  )}
                >
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-3 py-1.5 text-sm rounded-lg transition-colors",
                          pathname === link.href
                            ? "text-indigo-400 bg-indigo-500/10 font-medium"
                            : "text-[#9090a8] hover:text-[#e2e2ea] hover:bg-[#111118]"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
