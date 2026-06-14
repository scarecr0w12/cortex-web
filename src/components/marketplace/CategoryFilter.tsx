"use client";

import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: (slug: string) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={cn(
          "px-3 py-1.5 text-sm rounded-lg transition-colors border",
          !selected
            ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
            : "bg-[#111118] text-[#9090a8] border-[rgba(255,255,255,0.07)] hover:text-[#e2e2ea]"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={cn(
            "px-3 py-1.5 text-sm rounded-lg transition-colors border",
            selected === cat.slug
              ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
              : "bg-[#111118] text-[#9090a8] border-[rgba(255,255,255,0.07)] hover:text-[#e2e2ea]"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
