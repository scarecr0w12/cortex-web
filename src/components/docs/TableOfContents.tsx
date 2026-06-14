"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = document.querySelectorAll("h2, h3");
    const tocItems: TocItem[] = Array.from(headings).map((h) => ({
      id: h.id || h.textContent?.toLowerCase().replace(/\s+/g, "-") || "",
      text: h.textContent || "",
      level: h.tagName === "H2" ? 2 : 3,
    }));
    setItems(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    headings.forEach((h) => {
      const id = h.id || h.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      h.id = id;
      observer.observe(h);
    });

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-20 w-56 shrink-0 hidden xl:block">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#55556a] mb-3">
        On this page
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block text-sm py-1 transition-colors ${
                item.level === 3 ? "pl-4" : ""
              } ${
                activeId === item.id
                  ? "text-indigo-400 font-medium"
                  : "text-[#55556a] hover:text-[#9090a8]"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
