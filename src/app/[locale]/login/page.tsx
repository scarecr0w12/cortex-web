"use client";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shared/Button";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      login(data.token, data.user);
      router.push("/dashboard");
    } catch {
      setError(t("connectionError")); setLoading(false);
    }
  };

  const redirectUri = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}/api/auth/discord/callback&response_type=code&scope=identify`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm glass-card p-8">
        <h1 className="text-2xl font-bold text-[#e2e2ea] mb-6 text-center">{t("signIn")}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#9090a8] mb-1">{t("email")}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50" />
          </div>
          <div>
            <label className="block text-sm text-[#9090a8] mb-1">{t("password")}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0a0f] border border-[rgba(255,255,255,0.07)] rounded-lg text-sm text-[#e2e2ea] focus:outline-none focus:border-indigo-500/50" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? t("signingIn") : t("signIn")}</Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[rgba(255,255,255,0.07)]"></div></div>
          <div className="relative flex justify-center text-xs text-[#55556a]"><span className="bg-[#13131a] px-2">{t("orContinue")}</span></div>
        </div>

        <a
          href={discordAuthUrl}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-lg bg-[#5865F2] text-white hover:opacity-90 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" className="w-5 h-5 fill-current"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>
          {t("signInDiscord")}
        </a>

        <p className="mt-4 text-sm text-center text-[#55556a]">
          {t("noAccount")} <Link href="/register" className="text-indigo-400 hover:text-indigo-300">{t("register")}</Link>
        </p>
      </div>
    </div>
  );
}
