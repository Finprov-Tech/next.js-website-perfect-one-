import { ModuleForm } from "@/components/ModuleForm";
import type { ModuleSchema } from "@/lib/moduleSchemas";

type ModuleData = Record<string, unknown> & { id: number | string };

/** Recursive: a "card" is a schema + one data row. If the schema declares
 * itemsKey/itemSchema (e.g. Credentials -> items, Quiz -> questions ->
 * options), each item in data[itemsKey] renders as its own nested card —
 * this is what lets Quiz's two levels of nesting "just work" without a
 * special case. */
export function ModuleCard({ schema, data, nested = false }: { schema: ModuleSchema; data: ModuleData; nested?: boolean; parentId?: number }) {
  const items = schema.itemsKey ? (data[schema.itemsKey] as ModuleData[] | undefined) : undefined;

  return (
    <div className={nested ? "rounded-xl border border-border/70 bg-bg-light/40 p-4" : "rounded-2xl border border-border bg-card p-5 shadow-sm"}>
      <h3 className={nested ? "mb-3 text-sm font-bold text-navy" : "mb-4 text-base font-bold text-navy"}>{schema.title}</h3>
      <ModuleForm endpoint={schema.endpoint} id={data.id} fields={schema.fields} initialData={data} canDelete={schema.canDelete} />

      {items && schema.itemSchema && (
        <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
          {items.map((item) => (
            <ModuleCard key={item.id} schema={schema.itemSchema!} data={item} nested parentId={Number(data.id)} />
          ))}
          {schema.itemSchema.canCreate && schema.itemSchema.parentField && (
            <details className="rounded-xl border border-dashed border-cta/40 p-4">
              <summary className="cursor-pointer text-sm font-bold text-cta">Add {schema.itemSchema.title.toLowerCase()}</summary>
              <div className="mt-4">
                <ModuleForm endpoint={schema.itemSchema.endpoint} fields={schema.itemSchema.fields} initialData={{}} parentField={schema.itemSchema.parentField} parentId={Number(data.id)} />
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
