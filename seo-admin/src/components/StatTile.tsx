import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "default",
  href,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "default" | "warning";
  /** If set, the whole tile is a link to a pre-filtered list screen. */
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-body">{label}</p>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            tone === "warning" ? "bg-gold/15 text-gold" : "bg-cta/10 text-cta",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-navy">{value}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-cta hover:shadow-md"
      >
        {content}
      </Link>
    );
  }

  return <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">{content}</div>;
}
