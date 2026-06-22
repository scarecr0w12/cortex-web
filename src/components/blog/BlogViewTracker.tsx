"use client";

import { useEffect, useRef } from "react";

interface BlogViewTrackerProps {
  slug: string;
}

export function BlogViewTracker({ slug }: BlogViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch("/api/blog/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
