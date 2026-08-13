"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, User } from "lucide-react";

export function TopBar({ title }: { title: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-lg font-bold text-navy">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-bg-light px-3 py-1.5 text-xs font-semibold text-navy">
          <User className="h-3.5 w-3.5" />
          SEO Team
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-body transition-colors hover:border-destructive hover:text-destructive disabled:opacity-60"
        >
          <LogOut className="h-3.5 w-3.5" />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </header>
  );
}
