"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Loader2, Lock, User } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      const next = searchParams.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/15">
            <Image src="/finprov-mark.jpeg" alt="Finprov" width={56} height={56} className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Finprov SEO Panel</h1>
            <p className="text-sm text-white/50">Sign in with your SEO team account</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-sm"
        >
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
            Username
          </label>
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 focus-within:border-gold">
            <User className="h-4 w-4 text-white/40" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              placeholder="seo"
            />
          </div>

          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
            Password
          </label>
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 focus-within:border-gold">
            <Lock className="h-4 w-4 text-white/40" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-bold text-navy transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/35">
          Content &amp; SEO editing only — not the developer admin.
        </p>
      </div>
    </main>
  );
}
