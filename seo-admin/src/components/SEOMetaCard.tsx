import { TriangleAlert } from "lucide-react";
import { ModuleForm } from "@/components/ModuleForm";
import { SEO_META_SCHEMA } from "@/lib/moduleSchemas";

type SEOMetaData = Record<string, unknown> & { id: number; word_count?: number; warnings?: string[] };

/** SEOMeta gets its own card instead of going through the generic
 * ModuleCard — it's the only module with read-only computed info
 * (word count, duplicate-keyword/H1 warnings) alongside its editable
 * fields, which doesn't fit the plain schema-driven form. */
export function SEOMetaCard({ data }: { data: SEOMetaData }) {
  const warnings = data.warnings ?? [];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-navy">{SEO_META_SCHEMA.title}</h3>
        <span className="text-xs font-medium text-text-body/60">{data.word_count ?? 0} words on this page</span>
      </div>

      {warnings.length > 0 && (
        <div className="mb-4 space-y-1.5 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2">
          {warnings.map((w) => (
            <p key={w} className="flex items-start gap-1.5 text-xs font-medium text-gold">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {w}
            </p>
          ))}
        </div>
      )}

      <ModuleForm endpoint={SEO_META_SCHEMA.endpoint} id={data.id} fields={SEO_META_SCHEMA.fields} initialData={data} />
    </div>
  );
}
