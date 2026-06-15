"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Settings } from "lucide-react";

export function ProfileActions({ username }: { username: string }) {
  const { user } = useAuth();

  if (!user || user.username !== username) return null;

  return (
    <Link
      href="/dashboard/settings"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#111118] text-[#e2e2ea] border border-[rgba(255,255,255,0.07)] hover:bg-[#18181f] transition-colors"
    >
      <Settings className="w-4 h-4" /> Edit Profile
    </Link>
  );
}
